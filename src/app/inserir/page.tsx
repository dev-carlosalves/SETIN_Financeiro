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

  // Get session user name
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

  const tabs: { key: Tab; label: string; emoji: string }[] = [
    { key: 'venda', label: 'Venda', emoji: '🛒' },
    { key: 'receita', label: 'Receita', emoji: '💰' },
    { key: 'despesa', label: 'Despesa', emoji: '💸' },
  ]

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar nome={nomeUsuario} />

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Form section */}
        <div className="card">
          {editItem && (
            <div className="mb-4 bg-indigo-950/40 border border-indigo-800/50 rounded-xl px-4 py-2 text-sm text-indigo-300">
              ✏️ Editando lançamento — clique em Cancelar para descartar.
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-1.5 bg-gray-950 p-1 rounded-xl mb-5 border border-gray-800">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); if (!editItem) {} }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 flex items-center justify-center gap-1.5 ${
                  activeTab === tab.key ? 'tab-active' : 'tab-inactive'
                }`}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Active form */}
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

        {/* Metas section (collapsible) */}
        <div className="card">
          <button
            onClick={() => setMetasOpen(!metasOpen)}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🎯</span>
              <span className="font-semibold text-gray-200">Metas</span>
            </div>
            <span className={`text-gray-400 transition-transform duration-200 ${metasOpen ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          {metasOpen && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <MetasForm />
            </div>
          )}
        </div>

        {/* Feed */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-200 flex items-center gap-2">
              <span>📋</span> Lançamentos recentes
            </h2>
            <button
              onClick={refreshFeed}
              className="text-xs text-gray-500 hover:text-gray-300 px-2 py-1 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Atualizar
            </button>
          </div>
          {feedLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500" />
            </div>
          ) : (
            <FeedRecente items={feedItems} onRefresh={refreshFeed} onEdit={handleEdit} />
          )}
        </div>
      </main>
    </div>
  )
}
