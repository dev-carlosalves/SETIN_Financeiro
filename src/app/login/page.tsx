'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [nome, setNome] = useState('')
  const [senha, setSenha] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome.trim() || !senha) {
      setError('Por favor, informe seu nome e a senha de acesso.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, senha }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Senha incorreta ou acesso negado.')
        setLoading(false)
        return
      }
      router.push('/visualizar')
      router.refresh()
    } catch {
      setError('Erro ao conectar ao servidor. Verifique sua conexão.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-xl bg-emerald-600/15 border border-emerald-500/30 items-center justify-center mb-3">
            <span className="text-emerald-400 font-semibold text-sm tracking-wider">SET</span>
          </div>
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight">SETIN Financeiro</h1>
          <p className="text-zinc-500 text-xs mt-1">Controle de caixa e gestão financeira do evento</p>
        </div>

        {/* Form Card */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nome" className="label">
                Identificação do Usuário
              </label>
              <input
                id="nome"
                type="text"
                autoComplete="name"
                placeholder="Seu nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="input-field"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label htmlFor="senha" className="label">
                Senha Compartilhada
              </label>
              <div className="relative">
                <input
                  id="senha"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Senha de acesso da equipe"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="input-field pr-11"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center text-zinc-400 hover:text-zinc-200 focus:outline-none focus:text-emerald-400 transition-colors"
                  title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                  aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" x2="22" y1="2" y2="22" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-rose-950/40 border border-rose-800/40 rounded-lg px-3.5 py-2.5 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Verificando...
                </span>
              ) : (
                'Acessar Sistema'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-zinc-600 text-[11px] mt-6">
          SETIN — Uso restrito aos membros da comissão organizadora
        </p>
      </div>
    </div>
  )
}
