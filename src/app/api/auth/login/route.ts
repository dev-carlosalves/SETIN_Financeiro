import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { getSessionOptions, SessionData } from '@/lib/session'
import { normalizeName } from '@/lib/utils'

// Simple in-memory rate limiting (per IP)
const attempts: Record<string, { count: number; resetAt: number }> = {}
const MAX_ATTEMPTS = 10
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  const now = Date.now()

  // Rate limiting check
  if (!attempts[ip] || now > attempts[ip].resetAt) {
    attempts[ip] = { count: 0, resetAt: now + WINDOW_MS }
  }

  if (attempts[ip].count >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: 'Muitas tentativas. Tente novamente mais tarde.' },
      { status: 429 }
    )
  }

  const body = await request.json()
  const { nome, senha, equipe } = body

  if (!nome || !senha) {
    return NextResponse.json({ error: 'Nome e senha são obrigatórios.' }, { status: 400 })
  }

  const equipeNum = parseInt(equipe)
  if (!equipeNum || equipeNum < 1 || equipeNum > 4) {
    return NextResponse.json({ error: 'Selecione uma equipe válida (1 a 4).' }, { status: 400 })
  }

  // Artificial delay to slow brute force
  await new Promise((res) => setTimeout(res, 500))

  const correctPassword = process.env.SITE_PASSWORD
  if (!correctPassword || senha !== correctPassword) {
    attempts[ip].count++
    return NextResponse.json({ error: 'Senha incorreta.' }, { status: 401 })
  }

  // Reset attempts on success
  delete attempts[ip]

  // Create session
  const response = NextResponse.json({ success: true, nome: normalizeName(nome), equipe: equipeNum })
  const session = await getIronSession<SessionData>(request, response, getSessionOptions())

  session.nome = normalizeName(nome)
  session.equipe = equipeNum
  session.loggedIn = true
  await session.save()

  return response
}
