import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const body = await request.json()
    const { data, categoria, descricao, fornecedor, valor, status, forma_pagamento, responsavel } = body

    const despesa = await prisma.despesas.update({
      where: { id: parseInt(id) },
      data: {
        data: new Date(data),
        categoria: String(categoria).trim(),
        descricao: String(descricao).trim(),
        fornecedor: fornecedor ? String(fornecedor).trim() : null,
        valor: parseFloat(valor),
        status,
        forma_pagamento: forma_pagamento ? String(forma_pagamento).trim() : null,
        responsavel: String(responsavel).trim(),
      },
    })
    return NextResponse.json(despesa)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar despesa.' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    await prisma.despesas.delete({ where: { id: parseInt(id) } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir despesa.' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const body = await request.json()
    const despesa = await prisma.despesas.update({
      where: { id: parseInt(id) },
      data: { status: body.status },
    })
    return NextResponse.json(despesa)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar status.' }, { status: 500 })
  }
}
