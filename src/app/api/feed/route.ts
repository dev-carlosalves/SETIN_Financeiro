import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { toNumber } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const [vendas, receitas, despesas] = await Promise.all([
      prisma.vendas.findMany({ orderBy: { criado_em: 'desc' }, take: 10 }),
      prisma.receitas_outras.findMany({ orderBy: { criado_em: 'desc' }, take: 10 }),
      prisma.despesas.findMany({ orderBy: { criado_em: 'desc' }, take: 10 }),
    ])

    const items: Array<Record<string, unknown>> = [
      ...vendas.map((v) => ({ ...v, _tipo: 'venda', valor: toNumber(v.valor_total) })),
      ...receitas.map((r) => ({ ...r, _tipo: 'receita', valor: toNumber(r.valor) })),
      ...despesas.map((d) => ({ ...d, _tipo: 'despesa', valor: toNumber(d.valor) })),
    ]

    items.sort((a, b) => {
      const aTime = a.criado_em instanceof Date ? a.criado_em.getTime() : new Date(a.criado_em as string).getTime()
      const bTime = b.criado_em instanceof Date ? b.criado_em.getTime() : new Date(b.criado_em as string).getTime()
      return bTime - aTime
    })

    return NextResponse.json(items.slice(0, 10))
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao buscar feed.' }, { status: 500 })
  }
}
