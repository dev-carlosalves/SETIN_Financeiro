import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const body = await request.json()
    const { data, tipo, descricao, valor, status, responsavel } = body

    const receita = await prisma.receitas_outras.update({
      where: { id: parseInt(id) },
      data: {
        data: new Date(data),
        tipo,
        descricao: String(descricao).trim(),
        valor: parseFloat(valor),
        status,
        responsavel: String(responsavel).trim(),
      },
    })
    return NextResponse.json(receita)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar receita.' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    await prisma.receitas_outras.delete({ where: { id: parseInt(id) } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir receita.' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const body = await request.json()
    const receita = await prisma.receitas_outras.update({
      where: { id: parseInt(id) },
      data: { status: body.status },
    })
    return NextResponse.json(receita)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar status.' }, { status: 500 })
  }
}
