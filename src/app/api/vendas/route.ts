import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const vendas = await prisma.vendas.findMany({
      orderBy: { criado_em: 'desc' },
      take: 100,
    })
    return NextResponse.json(vendas)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar vendas.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data, vendedor, produto, quantidade, valor_unitario, cliente, equipe, forma_pagamento } = body

    if (!data || !vendedor || !produto || !quantidade || valor_unitario === undefined) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando.' }, { status: 400 })
    }

    const qty = parseInt(quantidade)
    const unitPrice = parseFloat(valor_unitario)

    if (qty <= 0 || unitPrice < 0) {
      return NextResponse.json({ error: 'Quantidade e valor inválidos.' }, { status: 400 })
    }

    const valor_total = qty * unitPrice
    const equipeNum = parseInt(equipe) || 1

    const venda = await prisma.vendas.create({
      data: {
        data: new Date(data),
        vendedor: String(vendedor).trim(),
        produto: String(produto).trim(),
        quantidade: qty,
        valor_unitario: unitPrice,
        valor_total,
        cliente: cliente ? String(cliente).trim() : null,
        equipe: equipeNum,
        forma_pagamento: forma_pagamento ? String(forma_pagamento).trim() : 'pix',
      },
    })

    return NextResponse.json(venda, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao criar venda.' }, { status: 500 })
  }
}
