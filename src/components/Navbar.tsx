'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Navbar({ nome }: { nome?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/15 border border-emerald-500/30 flex items-center justify-center">
              <span className="text-emerald-400 font-semibold text-xs tracking-wider">SET</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-100 text-sm tracking-tight">SETIN</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50">
                  Financeiro
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-lg border border-zinc-800">
            <Link
              href="/inserir"
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                pathname.startsWith('/inserir')
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              Inserir Lançamento
            </Link>
            <Link
              href="/visualizar"
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                pathname.startsWith('/visualizar')
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              Painel Geral
            </Link>
          </div>

          {/* User profile & action */}
          <div className="flex items-center gap-3">
            {nome && (
              <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-medium text-zinc-300 max-w-[140px] truncate">{nome}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-xs text-zinc-400 hover:text-rose-400 transition-colors px-2.5 py-1.5 rounded-md hover:bg-zinc-900 border border-transparent hover:border-zinc-800"
            >
              {loggingOut ? 'Saindo...' : 'Encerrar sessão'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
