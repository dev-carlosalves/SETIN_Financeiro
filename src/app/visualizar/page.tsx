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
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchDashboard, 60000)
    return () => clearInterval(interval)
  }, [fetchDashboard])

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar nome={nomeUsuario} />

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">Painel Financeiro</h1>
            {lastUpdated && (
              <p className="text-xs text-gray-500">
                Atualizado às {lastUpdated.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
          <button
            onClick={fetchDashboard}
            className="btn-secondary text-xs flex items-center gap-1.5"
          >
            <span className="text-sm">↻</span> Atualizar
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500" />
          </div>
        ) : data ? (
          <>
            {/* Summary Cards */}
            <ResumoCards data={data.cards} />

            {/* Meta Progress */}
            {(data.metas.diaria || data.metas.total) && (
              <div className="card">
                <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                  <span>🎯</span> Progresso das metas
                </h2>
                <ProgressoMetas diaria={data.metas.diaria} total={data.metas.total} />
              </div>
            )}

            {/* Chart */}
            <div className="card">
              <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                <span>📈</span> Evolução do saldo
              </h2>
              <GraficoEvolucao data={data.chartData} />
              <div className="flex gap-4 mt-3 justify-center">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <div className="w-6 h-0.5 bg-indigo-500" />
                  Saldo real
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <div className="w-6 h-0.5 bg-cyan-500 border-t-2 border-dashed border-cyan-500" />
                  Saldo projetado
                </div>
              </div>
            </div>

            {/* Rankings */}
            <div className="card">
              <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                <span>🏆</span> Rankings
              </h2>
              <Rankings
                produtos={data.rankings.produtos}
                vendedores={data.rankings.vendedores}
                categorias={data.rankings.categorias}
              />
            </div>

            {/* History Table */}
            <div className="card">
              <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                <span>📊</span> Histórico completo
              </h2>
              <TabelaHistorico />
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-gray-500">
            Erro ao carregar dados. Verifique a conexão com o banco.
          </div>
        )}
      </main>
    </div>
  )
}
