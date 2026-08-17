'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import VendaForm from '@/components/forms/VendaForm'
import ReceitaForm from '@/components/forms/ReceitaForm'
import DespesaForm from '@/components/forms/DespesaForm'
import MetasForm from '@/components/forms/MetasForm'
import FeedRecente from '@/components/FeedRecente'

type Tab = 'venda' | 'receita' | 'despesa'

interface FeedItem {
  id: number
  _tipo: 'venda' | 'receita' | 'despesa'
  data: string
  valor: number
  status?: string
  vendedor?: string
  responsavel?: string
  produto?: string
  descricao?: string
  quantidade?: number
  tipo?: string
  categoria?: string
  criado_em: string
}

export default function InserirPage() {
  const [activeTab, setActiveTab] = useState<Tab>('venda')
  const [nomeUsuario, setNomeUsuario] = useState('')
  const [feedItems, setFeedItems] = useState<FeedItem[]>([])
  const [feedLoading, setFeedLoading] = useState(true)
  const [metasOpen, setMetasOpen] = useState(false)
  const [editItem, setEditItem] = useState<FeedItem | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then((d) => {
        if (!d.loggedIn) {
          router.push('/login')
        } else {
          setNomeUsuario(d.nome || '')
        }
      })
      .catch(() => router.push('/login'))
  }, [router])

  const refreshFeed = useCallback(async () => {
    setFeedLoading(true)
    try {
      const res = await fetch('/api/feed')
      const data = await res.json()
      setFeedItems(data)
    } catch {
      // ignore
    }
    setFeedLoading(false)
  }, [])

  useEffect(() => {
    refreshFeed()
  }, [refreshFeed])

  const handleEdit = useCallback((item: FeedItem) => {
    setActiveTab(item._tipo === 'venda' ? 'venda' : item._tipo === 'receita' ? 'receita' : 'despesa')
    setEditItem(item)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleCancelEdit = useCallback(() => {
    setEditItem(null)
  }, [])

  const handleSuccess = useCallback(() => {
    setEditItem(null)
    refreshFeed()
  }, [refreshFeed])

  const tabs: { key: Tab; label: string; desc: string }[] = [
    { key: 'venda', label: 'Venda de Produtos', desc: 'Café, Sanduíches e itens' },
    { key: 'receita', label: 'Outras Receitas', desc: 'Patrocínios, inscrições e doações' },
    { key: 'despesa', label: 'Despesas e Custos', desc: 'Controle de saídas e fornecedores' },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-12">
      <Navbar nome={nomeUsuario} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">Registro de Movimentações</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Lance entradas, saídas e acompanhe os registros recentes da equipe em tempo real.
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Form Column (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="card">
              {/* Edit Mode Notice */}
              {editItem && (
                <div className="mb-4 bg-amber-950/40 border border-amber-800/40 rounded-lg p-3 flex items-center justify-between text-xs text-amber-300">
                  <span>Modo de edição ativado para o item selecionado.</span>
                  <button onClick={handleCancelEdit} className="underline font-medium hover:text-amber-200">
                    Descartar edição
                  </button>
                </div>
              )}

              {/* Tab Navigation (Left aligned & structured) */}
              <div className="border-b border-zinc-800/80 pb-4 mb-5">
                <div className="flex flex-wrap gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => {
                        setActiveTab(tab.key)
                        if (editItem && editItem._tipo !== tab.key) {
                          setEditItem(null)
                        }
                      }}
                      className={`px-4 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                        activeTab === tab.key
                          ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                          : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 border border-zinc-800'
                      }`}
                    >
                      <div>{tab.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Content */}
              <div>
                {activeTab === 'venda' && (
                  <VendaForm
                    nomeUsuario={nomeUsuario}
                    onSuccess={handleSuccess}
                    editData={editItem?._tipo === 'venda' ? (editItem as unknown as Record<string, unknown>) : null}
                    onCancelEdit={editItem ? handleCancelEdit : undefined}
                  />
                )}
                {activeTab === 'receita' && (
                  <ReceitaForm
                    nomeUsuario={nomeUsuario}
                    onSuccess={handleSuccess}
                    editData={editItem?._tipo === 'receita' ? (editItem as unknown as Record<string, unknown>) : null}
                    onCancelEdit={editItem ? handleCancelEdit : undefined}
                  />
                )}
                {activeTab === 'despesa' && (
                  <DespesaForm
                    nomeUsuario={nomeUsuario}
                    onSuccess={handleSuccess}
                    editData={editItem?._tipo === 'despesa' ? (editItem as unknown as Record<string, unknown>) : null}
                    onCancelEdit={editItem ? handleCancelEdit : undefined}
                  />
                )}
              </div>
            </div>

            {/* Metas Accordion */}
            <div className="card">
              <button
                onClick={() => setMetasOpen(!metasOpen)}
                className="w-full flex items-center justify-between text-left group"
              >
                <div>
                  <h2 className="text-sm font-medium text-zinc-200 group-hover:text-zinc-100 transition-colors">
                    Configuração de Metas Financeiras
                  </h2>
                  <p className="text-xs text-zinc-500">Defina metas diárias ou gerais para o evento</p>
                </div>
                <span className="text-xs text-zinc-500 font-mono px-2 py-1 rounded bg-zinc-800 border border-zinc-700/50">
                  {metasOpen ? 'Ocultar' : 'Configurar'}
                </span>
              </button>
              {metasOpen && (
                <div className="mt-4 pt-4 border-t border-zinc-800/80">
                  <MetasForm />
                </div>
              )}
            </div>
          </div>

          {/* Right Feed Column (5 cols) */}
          <div className="lg:col-span-5">
            <div className="card sticky top-20">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-zinc-200">Últimos Lançamentos</h2>
                  <p className="text-xs text-zinc-500">Registros recentes da equipe</p>
                </div>
                <button
                  onClick={refreshFeed}
                  disabled={feedLoading}
                  className="btn-ghost"
                  title="Recarregar lista"
                >
                  {feedLoading ? 'Atualizando...' : 'Atualizar'}
                </button>
              </div>

              {feedLoading && feedItems.length === 0 ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-500 border-t-transparent" />
                </div>
              ) : (
                <FeedRecente items={feedItems} onRefresh={refreshFeed} onEdit={handleEdit} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
