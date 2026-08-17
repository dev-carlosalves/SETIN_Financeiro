import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const despesas = await prisma.despesas.findMany({
      orderBy: { criado_em: 'desc' },
      take: 100,
    })
    return NextResponse.json(despesas)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar despesas.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data, categoria, descricao, fornecedor, valor, status, forma_pagamento, responsavel } = body

    if (!data || !categoria || !descricao || valor === undefined || !responsavel) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando.' }, { status: 400 })
    }

    const validStatus = ['pago', 'pendente']
    const statusFinal = validStatus.includes(status) ? status : 'pendente'

    const despesa = await prisma.despesas.create({
      data: {
        data: new Date(data),
        categoria: String(categoria).trim(),
        descricao: String(descricao).trim(),
        fornecedor: fornecedor ? String(fornecedor).trim() : null,
        valor: parseFloat(valor),
        status: statusFinal,
        forma_pagamento: forma_pagamento ? String(forma_pagamento).trim() : null,
        responsavel: String(responsavel).trim(),
      },
    })

    return NextResponse.json(despesa, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao criar despesa.' }, { status: 500 })
  }
}
