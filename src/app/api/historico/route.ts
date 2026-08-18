import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { toNumber } from '@/lib/utils'
import type { vendas, receitas_outras, despesas } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo') // 'venda' | 'receita' | 'despesa' | null
    const produto = searchParams.get('produto')
    const responsavel = searchParams.get('responsavel')
    const status = searchParams.get('status')
    const dataInicio = searchParams.get('dataInicio')
    const dataFim = searchParams.get('dataFim')
    const equipeFilter = searchParams.get('equipe')
    const exportCsv = searchParams.get('export') === 'csv'

    const dateFilter: { gte?: Date; lte?: Date } = {}
    if (dataInicio) dateFilter.gte = new Date(dataInicio)
    if (dataFim) {
      const end = new Date(dataFim)
      end.setDate(end.getDate() + 1)
      dateFilter.lte = end
    }

    // Build combined list
    const items: Array<{
      id: number
      tipo: 'venda' | 'receita' | 'despesa'
      data: Date
      descricao: string
      valor: number
      status?: string
      responsavel?: string
      vendedor?: string
      produto?: string
      categoria?: string
      tipo_receita?: string
      equipe?: number
      forma_pagamento?: string
      criado_em: Date
    }> = []

    // Vendas
    if (!tipo || tipo === 'venda') {
      const whereVenda: Record<string, unknown> = {}
      if (Object.keys(dateFilter).length > 0) whereVenda.data = dateFilter
      if (produto) whereVenda.produto = { contains: produto, mode: 'insensitive' }
      if (responsavel) whereVenda.vendedor = { contains: responsavel, mode: 'insensitive' }
      if (equipeFilter) whereVenda.equipe = parseInt(equipeFilter)

      const vendas = await prisma.vendas.findMany({
        where: whereVenda,
        orderBy: { criado_em: 'desc' },
      })
      vendas.forEach((v: vendas) => {
        items.push({
          id: v.id,
          tipo: 'venda',
          data: v.data,
          descricao: `${v.produto} (${v.quantidade}x)`,
          valor: toNumber(v.valor_total),
          vendedor: v.vendedor,
          produto: v.produto,
          equipe: v.equipe,
          forma_pagamento: v.forma_pagamento,
          criado_em: v.criado_em,
        })
      })
    }

    // Receitas
    if (!tipo || tipo === 'receita') {
      const whereReceita: Record<string, unknown> = {}
      if (Object.keys(dateFilter).length > 0) whereReceita.data = dateFilter
      if (responsavel) whereReceita.responsavel = { contains: responsavel, mode: 'insensitive' }
      if (status) whereReceita.status = status

      const receitas = await prisma.receitas_outras.findMany({
        where: whereReceita,
        orderBy: { criado_em: 'desc' },
      })
      receitas.forEach((r: receitas_outras) => {
        items.push({
          id: r.id,
          tipo: 'receita',
          data: r.data,
          descricao: r.descricao,
          valor: toNumber(r.valor),
          status: r.status,
          responsavel: r.responsavel,
          tipo_receita: r.tipo,
          criado_em: r.criado_em,
        })
      })
    }

    // Despesas
    if (!tipo || tipo === 'despesa') {
      const whereDespesa: Record<string, unknown> = {}
      if (Object.keys(dateFilter).length > 0) whereDespesa.data = dateFilter
      if (responsavel) whereDespesa.responsavel = { contains: responsavel, mode: 'insensitive' }
      if (status) whereDespesa.status = status

      const despesas = await prisma.despesas.findMany({
        where: whereDespesa,
        orderBy: { criado_em: 'desc' },
      })
      despesas.forEach((d: despesas) => {
        items.push({
          id: d.id,
          tipo: 'despesa',
          data: d.data,
          descricao: d.descricao,
          valor: toNumber(d.valor),
          status: d.status,
          responsavel: d.responsavel,
          categoria: d.categoria,
          criado_em: d.criado_em,
        })
      })
    }

    // Sort by criado_em desc
    items.sort((a, b) => b.criado_em.getTime() - a.criado_em.getTime())

    if (exportCsv) {
      const headers = ['Tipo', 'Data', 'Descrição', 'Valor (R$)', 'Status', 'Responsável / Vendedor', 'Produto / Categoria', 'Equipe', 'Pagamento']
      const rows = items.map((item) => {
        const dataObj = new Date(item.data)
        const dia = String(dataObj.getUTCDate()).padStart(2, '0')
        const mes = String(dataObj.getUTCMonth() + 1).padStart(2, '0')
        const ano = dataObj.getUTCFullYear()
        const dataFormatada = `${dia}/${mes}/${ano}`

        return [
          item.tipo.toUpperCase(),
          dataFormatada,
          item.descricao,
          item.valor.toFixed(2).replace('.', ','),
          item.status ? item.status.toUpperCase() : 'N/A',
          item.responsavel || item.vendedor || '',
          item.produto || item.categoria || item.tipo_receita || '',
          item.equipe ? `Equipe ${item.equipe}` : '',
          item.forma_pagamento || '',
        ]
      })

      // Excel Brasil uses ';' separator and requires UTF-8 BOM (\uFEFF) for accents (Café, Descrição, etc.)
      const csvContent = [headers, ...rows]
        .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
        .join('\r\n')

      const bom = '\uFEFF'
      return new NextResponse(bom + csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="historico-setin.csv"',
        },
      })
    }

    return NextResponse.json(items)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao buscar histórico.' }, { status: 500 })
  }
}
