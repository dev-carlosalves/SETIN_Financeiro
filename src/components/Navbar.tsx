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
    <nav className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <span className="font-bold text-white text-sm hidden sm:block">SETIN Financeiro</span>
          </div>

          {/* Tabs */}
          <div className="flex gap-1.5 bg-gray-900 p-1 rounded-xl border border-gray-800">
            <Link
              href="/inserir"
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                pathname.startsWith('/inserir') ? 'tab-active' : 'tab-inactive'
              }`}
            >
              Inserir
            </Link>
            <Link
              href="/visualizar"
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                pathname.startsWith('/visualizar') ? 'tab-active' : 'tab-inactive'
              }`}
            >
              Visualizar
            </Link>
          </div>

          {/* User + Logout */}
          <div className="flex items-center gap-2">
            {nome && (
              <span className="text-xs text-gray-400 hidden sm:block truncate max-w-[100px]">
                {nome}
              </span>
            )}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-xs text-gray-500 hover:text-red-400 transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-800"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
