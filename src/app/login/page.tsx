'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [nome, setNome] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome.trim() || !senha) {
      setError('Preencha todos os campos.')
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
        setError(data.error || 'Senha incorreta.')
        setLoading(false)
        return
      }
      router.push('/visualizar')
      router.refresh()
    } catch {
      setError('Erro de conexão. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-950/30 via-gray-950 to-cyan-950/20 pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-indigo-600 items-center justify-center mb-4 shadow-lg shadow-indigo-900/50">
            <span className="text-white text-2xl font-black">S</span>
          </div>
          <h1 className="text-2xl font-bold text-white">SETIN Financeiro</h1>
          <p className="text-gray-500 text-sm mt-1">Sistema interno da equipe organizadora</p>
        </div>

        {/* Card */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nome" className="label">
                Seu nome completo
              </label>
              <input
                id="nome"
                type="text"
                autoComplete="name"
                placeholder="Ex.: Pedro Henrique"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="input-field"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label htmlFor="senha" className="label">
                Senha de acesso
              </label>
              <input
                id="senha"
                type="password"
                autoComplete="current-password"
                placeholder="Senha compartilhada da equipe"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="input-field"
                disabled={loading}
                required
              />
            </div>

            {error && (
              <div className="bg-red-950/50 border border-red-800 rounded-xl px-4 py-3 text-red-400 text-sm">
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
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          SETIN — Acesso restrito à equipe organizadora
        </p>
      </div>
    </div>
  )
}
