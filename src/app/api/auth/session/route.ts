import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions, SessionData } from '@/lib/session'

export async function GET(request: NextRequest) {
  const response = NextResponse.json({})
  const session = await getIronSession<SessionData>(request, response, sessionOptions)
  if (!session.loggedIn) {
    return NextResponse.json({ loggedIn: false, nome: null })
  }
  return NextResponse.json({ loggedIn: true, nome: session.nome })
}
