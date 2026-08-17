import type { SessionOptions } from 'iron-session'

export interface SessionData {
  nome: string
  loggedIn: boolean
}

// Called at runtime so env vars are guaranteed to be injected by Vercel
export function getSessionOptions(): SessionOptions {
  const password = process.env.SESSION_SECRET
  if (!password) {
    throw new Error('SESSION_SECRET environment variable is not set')
  }
  return {
    password,
    cookieName: 'setin_session',
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  }
}
