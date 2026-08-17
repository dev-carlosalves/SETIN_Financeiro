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
              <input
                id="senha"
                type="password"
                autoComplete="current-password"
                placeholder="Senha de acesso da equipe"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="input-field"
                disabled={loading}
                required
              />
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
