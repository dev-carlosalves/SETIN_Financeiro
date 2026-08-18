'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

export default function Navbar({ nome, equipe }: { nome?: string; equipe?: number }) {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleLogout = async () => {
    setLoggingOut(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  // Close menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false)
      }
    }
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [mobileMenuOpen])

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14" ref={menuRef}>
          {/* Brand */}
          <Link href="/visualizar" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/15 border border-emerald-500/30 flex items-center justify-center group-hover:border-emerald-500/50 transition-colors">
              <span className="text-emerald-400 font-semibold text-xs tracking-wider">SET</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-zinc-100 text-sm tracking-tight">SETIN</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                Financeiro
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden sm:flex items-center gap-1 bg-zinc-900/80 p-1 rounded-lg border border-zinc-800">
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

          {/* Desktop User Profile & Logout */}
          <div className="hidden sm:flex items-center gap-3">
            {nome && (
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-medium text-zinc-300 max-w-[140px] truncate">{nome}</span>
                {equipe && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                    EQ {equipe}
                  </span>
                )}
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

          {/* Mobile Menu Button (Top Right Corner) */}
          <div className="flex sm:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu de navegação'}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 focus:outline-none transition-colors"
            >
              {mobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden absolute top-14 left-0 right-0 bg-zinc-950/95 border-b border-zinc-800 px-4 py-4 shadow-xl backdrop-blur-lg animate-in fade-in slide-in-from-top-2 duration-150">
              {nome && (
                <div className="flex items-center gap-2 px-3 py-2 mb-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-xs text-zinc-300">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="truncate">Operador: <strong className="font-semibold text-zinc-100">{nome}</strong></span>
                  {equipe && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 shrink-0">
                      EQ {equipe}
                    </span>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <Link
                  href="/inserir"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    pathname.startsWith('/inserir')
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                      : 'text-zinc-300 hover:bg-zinc-900 border border-transparent'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Inserir Lançamento
                </Link>

                <Link
                  href="/visualizar"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    pathname.startsWith('/visualizar')
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                      : 'text-zinc-300 hover:bg-zinc-900 border border-transparent'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Painel Geral
                </Link>
              </div>

              <div className="mt-3 pt-3 border-t border-zinc-800/80">
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-950/30 border border-rose-900/30 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-rose-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {loggingOut ? 'Encerrando sessão...' : 'Encerrar sessão'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
