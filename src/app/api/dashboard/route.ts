import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { toNumber } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const today = new Date()
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

    // Fetch all data
    const [allVendas, allReceitas, allDespesas, metas] = await Promise.all([
      prisma.vendas.findMany({ orderBy: { data: 'asc' } }),
      prisma.receitas_outras.findMany({ orderBy: { data: 'asc' } }),
      prisma.despesas.findMany({ orderBy: { data: 'asc' } }),
      prisma.metas.findMany(),
    ])

    // ===== Summary Cards =====
    const vendasHoje = allVendas.filter(
      (v) => v.data >= todayStart && v.data < todayEnd
    )
    const totalVendidoHoje = vendasHoje.reduce((sum, v) => sum + toNumber(v.valor_total), 0)
    const totalVendidoEvento = allVendas.reduce((sum, v) => sum + toNumber(v.valor_total), 0)

    const totalReceitasRecebidas = allReceitas
      .filter((r) => r.status === 'recebido')
      .reduce((sum, r) => sum + toNumber(r.valor), 0)
    const totalReceitasPrevistas = allReceitas.reduce((sum, r) => sum + toNumber(r.valor), 0)

    const totalDespesasPagas = allDespesas
      .filter((d) => d.status === 'pago')
      .reduce((sum, d) => sum + toNumber(d.valor), 0)
    const totalDespesasTodas = allDespesas.reduce((sum, d) => sum + toNumber(d.valor), 0)

    const saldoReal = totalVendidoEvento + totalReceitasRecebidas - totalDespesasPagas
    const saldoProjetado = totalVendidoEvento + totalReceitasPrevistas - totalDespesasTodas

    // ===== Metas =====
    const metaTotal = metas.find((m) => m.tipo === 'total_evento')
    const metaDiaria = metas.find(
      (m) =>
        m.tipo === 'diaria' &&
        m.referencia &&
        m.referencia >= todayStart &&
        m.referencia < todayEnd
    )

    const receitasHoje = allReceitas
      .filter((r) => r.data >= todayStart && r.data < todayEnd && r.status === 'recebido')
      .reduce((sum, r) => sum + toNumber(r.valor), 0)
    const totalHoje = totalVendidoHoje + receitasHoje

    // ===== Chart Data (daily cumulative) =====
    // Collect all unique dates
    const allDates = new Set<string>()
    allVendas.forEach((v) => allDates.add(v.data.toISOString().split('T')[0]))
    allReceitas.forEach((r) => allDates.add(r.data.toISOString().split('T')[0]))
    allDespesas.forEach((d) => allDates.add(d.data.toISOString().split('T')[0]))

    const sortedDates = Array.from(allDates).sort()

    let cumulativeReal = 0
    let cumulativeProjetado = 0
    const chartData = sortedDates.map((dateStr) => {
      const dayStart = new Date(dateStr + 'T00:00:00.000Z')
      const dayEnd = new Date(dateStr + 'T23:59:59.999Z')

      const dayVendas = allVendas
        .filter((v) => v.data.toISOString().split('T')[0] === dateStr)
        .reduce((sum, v) => sum + toNumber(v.valor_total), 0)

      const dayReceitasRecebidas = allReceitas
        .filter((r) => r.data.toISOString().split('T')[0] === dateStr && r.status === 'recebido')
        .reduce((sum, r) => sum + toNumber(r.valor), 0)
      const dayReceitasTodas = allReceitas
        .filter((r) => r.data.toISOString().split('T')[0] === dateStr)
        .reduce((sum, r) => sum + toNumber(r.valor), 0)

      const dayDespesasPagas = allDespesas
        .filter((d) => d.data.toISOString().split('T')[0] === dateStr && d.status === 'pago')
        .reduce((sum, d) => sum + toNumber(d.valor), 0)
      const dayDespesasTodas = allDespesas
        .filter((d) => d.data.toISOString().split('T')[0] === dateStr)
        .reduce((sum, d) => sum + toNumber(d.valor), 0)

      cumulativeReal += dayVendas + dayReceitasRecebidas - dayDespesasPagas
      cumulativeProjetado += dayVendas + dayReceitasTodas - dayDespesasTodas

      return {
        date: dateStr,
        saldoReal: cumulativeReal,
        saldoProjetado: cumulativeProjetado,
      }
    })

    // ===== Rankings =====
    // Products by quantity and by total value
    const produtosMap: Record<string, { quantidade: number; valor: number }> = {}
    allVendas.forEach((v) => {
      if (!produtosMap[v.produto]) produtosMap[v.produto] = { quantidade: 0, valor: 0 }
      produtosMap[v.produto].quantidade += v.quantidade
      produtosMap[v.produto].valor += toNumber(v.valor_total)
    })
    const rankingProdutos = Object.entries(produtosMap)
      .map(([produto, stats]) => ({ produto, ...stats }))
      .sort((a, b) => b.valor - a.valor)

    // Vendedores by total value
    const vendedoresMap: Record<string, number> = {}
    allVendas.forEach((v) => {
      vendedoresMap[v.vendedor] = (vendedoresMap[v.vendedor] || 0) + toNumber(v.valor_total)
    })
    const rankingVendedores = Object.entries(vendedoresMap)
      .map(([vendedor, valor]) => ({ vendedor, valor }))
      .sort((a, b) => b.valor - a.valor)

    // Expenses by category
    const categoriasMap: Record<string, number> = {}
    allDespesas.forEach((d) => {
      categoriasMap[d.categoria] = (categoriasMap[d.categoria] || 0) + toNumber(d.valor)
    })
    const rankingCategorias = Object.entries(categoriasMap)
      .map(([categoria, valor]) => ({ categoria, valor }))
      .sort((a, b) => b.valor - a.valor)

    return NextResponse.json({
      cards: {
        totalVendidoHoje,
        totalVendidoEvento,
        saldoReal,
        saldoProjetado,
      },
      metas: {
        diaria: metaDiaria ? { valor: toNumber(metaDiaria.valor_meta), atual: totalHoje } : null,
        total: metaTotal ? { valor: toNumber(metaTotal.valor_meta), atual: totalVendidoEvento + totalReceitasPrevistas } : null,
      },
      chartData,
      rankings: {
        produtos: rankingProdutos,
        vendedores: rankingVendedores,
        categorias: rankingCategorias,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao buscar dados do dashboard.' }, { status: 500 })
  }
}
