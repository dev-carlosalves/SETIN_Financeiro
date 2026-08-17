'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import ResumoCards from '@/components/dashboard/ResumoCards'
import ProgressoMetas from '@/components/dashboard/ProgressoMetas'
import GraficoEvolucao from '@/components/dashboard/GraficoEvolucao'
import TabelaHistorico from '@/components/dashboard/TabelaHistorico'
import Rankings from '@/components/dashboard/Rankings'

interface DashboardData {
  cards: {
    totalVendidoHoje: number
    totalVendidoEvento: number
    saldoReal: number
    saldoProjetado: number
  }
  metas: {
    diaria: { valor: number; atual: number } | null
    total: { valor: number; atual: number } | null
  }
  chartData: Array<{ date: string; saldoReal: number; saldoProjetado: number }>
  rankings: {
    produtos: Array<{ produto: string; quantidade: number; valor: number }>
    vendedores: Array<{ vendedor: string; valor: number }>
    categorias: Array<{ categoria: string; valor: number }>
  }
}

export default function VisualizarPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [nomeUsuario, setNomeUsuario] = useState('')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then((d) => {
        if (!d.loggedIn) router.push('/login')
        else setNomeUsuario(d.nome || '')
      })
      .catch(() => router.push('/login'))
  }, [router])

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard')
      const json = await res.json()
      setData(json)
      setLastUpdated(new Date())
    } catch {
      // ignore
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchDashboard()
    const interval = setInterval(fetchDashboard, 60000)
    return () => clearInterval(interval)
  }, [fetchDashboard])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-16">
      <Navbar nome={nomeUsuario} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800/80">
          <div>
            <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">Painel de Acompanhamento Financeiro</h1>
            {lastUpdated && (
              <p className="text-xs text-zinc-400 mt-0.5">
                Última atualização realizada às{' '}
                <span className="font-mono text-zinc-300">
                  {lastUpdated.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchDashboard}
              disabled={loading}
              className="btn-secondary text-xs"
            >
              {loading ? 'Atualizando...' : 'Atualizar Dados'}
            </button>
          </div>
        </div>

        {loading && !data ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent" />
          </div>
        ) : data ? (
          <>
            {/* Top Metric Cards */}
            <ResumoCards data={data.cards} />

            {/* Metas Section */}
            {(data.metas.diaria || data.metas.total) && (
              <div className="card">
                <div className="mb-4">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Acompanhamento de Metas
                  </h2>
                </div>
                <ProgressoMetas diaria={data.metas.diaria} total={data.metas.total} />
              </div>
            )}

            {/* Financial Flow Evolution Chart */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Evolução do Saldo Acumulado
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Comparativo entre Saldo Real liquidado e Saldo Projetado
                  </p>
                </div>
              </div>
              <GraficoEvolucao data={data.chartData} />
            </div>

            {/* Financial Distribution (Products & Category Expenses - Seller ranking removed) */}
            <Rankings
              produtos={data.rankings.produtos}
              categorias={data.rankings.categorias}
            />

            {/* Complete History Table */}
            <div className="card">
              <div className="mb-4">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Extrato e Histórico de Transações
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Filtre e exporte todas as vendas, receitas e despesas registradas
                </p>
              </div>
              <TabelaHistorico />
            </div>
          </>
        ) : (
          <div className="card text-center py-16 text-zinc-500 text-sm">
            Não foi possível carregar os dados financeiros no momento.
          </div>
        )}
      </main>
    </div>
  )
}
