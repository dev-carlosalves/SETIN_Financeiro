import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const receitas = await prisma.receitas_outras.findMany({
      orderBy: { criado_em: 'desc' },
      take: 100,
    })
    return NextResponse.json(receitas)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar receitas.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data, tipo, descricao, valor, status, responsavel } = body

    if (!data || !tipo || !descricao || valor === undefined || !responsavel) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando.' }, { status: 400 })
    }

    const validTipos = ['patrocinio', 'inscricao', 'doacao', 'outro']
    const validStatus = ['recebido', 'previsto']

    if (!validTipos.includes(tipo)) {
      return NextResponse.json({ error: 'Tipo inválido.' }, { status: 400 })
    }

    const statusFinal = validStatus.includes(status) ? status : 'previsto'

    const receita = await prisma.receitas_outras.create({
      data: {
        data: new Date(data),
        tipo,
        descricao: String(descricao).trim(),
        valor: parseFloat(valor),
        status: statusFinal,
        responsavel: String(responsavel).trim(),
      },
    })

    return NextResponse.json(receita, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao criar receita.' }, { status: 500 })
  }
}
