import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const body = await request.json()
    const { data, vendedor, produto, quantidade, valor_unitario, cliente, equipe, forma_pagamento } = body

    const qty = parseInt(quantidade)
    const unitPrice = parseFloat(valor_unitario)
    const valor_total = qty * unitPrice

    const venda = await prisma.vendas.update({
      where: { id: parseInt(id) },
      data: {
        data: new Date(data),
        vendedor: String(vendedor).trim(),
        produto: String(produto).trim(),
        quantidade: qty,
        valor_unitario: unitPrice,
        valor_total,
        cliente: cliente ? String(cliente).trim() : null,
        equipe: parseInt(equipe) || 1,
        forma_pagamento: forma_pagamento ? String(forma_pagamento).trim() : 'pix',
      },
    })
    return NextResponse.json(venda)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar venda.' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    await prisma.vendas.delete({ where: { id: parseInt(id) } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir venda.' }, { status: 500 })
  }
}
