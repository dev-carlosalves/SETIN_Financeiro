import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const metas = await prisma.metas.findMany()
    return NextResponse.json(metas)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar metas.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tipo, valor_meta, referencia } = body

    if (!tipo || valor_meta === undefined) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando.' }, { status: 400 })
    }

    const validTipos = ['diaria', 'total_evento']
    if (!validTipos.includes(tipo)) {
      return NextResponse.json({ error: 'Tipo de meta inválido.' }, { status: 400 })
    }

    // For daily goals, use today's date if not provided
    const referenciaDate =
      tipo === 'diaria'
        ? referencia
          ? new Date(referencia)
          : new Date()
        : null

    // Upsert: for total_evento there's only one; for diaria, one per date
    let meta
    if (tipo === 'total_evento') {
      const existing = await prisma.metas.findFirst({ where: { tipo: 'total_evento' } })
      if (existing) {
        meta = await prisma.metas.update({
          where: { id: existing.id },
          data: { valor_meta: parseFloat(valor_meta) },
        })
      } else {
        meta = await prisma.metas.create({
          data: { tipo, valor_meta: parseFloat(valor_meta), referencia: null },
        })
      }
    } else {
      // Daily goal
      const dateStr = referenciaDate ? referenciaDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      const existing = await prisma.metas.findFirst({
        where: {
          tipo: 'diaria',
          referencia: new Date(dateStr),
        },
      })
      if (existing) {
        meta = await prisma.metas.update({
          where: { id: existing.id },
          data: { valor_meta: parseFloat(valor_meta) },
        })
      } else {
        meta = await prisma.metas.create({
          data: {
            tipo,
            valor_meta: parseFloat(valor_meta),
            referencia: new Date(dateStr),
          },
        })
      }
    }

    return NextResponse.json(meta)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao salvar meta.' }, { status: 500 })
  }
}
