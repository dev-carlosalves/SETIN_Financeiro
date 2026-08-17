'use client'

import { useState, useCallback } from 'react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { TIPOS_RECEITA } from '@/lib/constants'

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

interface FeedRecenteProps {
  items: FeedItem[]
  onRefresh: () => void
  onEdit: (item: FeedItem) => void
}

const TIPO_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  venda: { label: 'Venda', color: 'text-cyan-300', bg: 'bg-cyan-950/40 border-cyan-800/50' },
  receita: { label: 'Receita', color: 'text-emerald-300', bg: 'bg-emerald-950/40 border-emerald-800/50' },
  despesa: { label: 'Despesa', color: 'text-red-300', bg: 'bg-red-950/40 border-red-800/50' },
}

function getTipoReceitaLabel(tipo: string) {
  return TIPOS_RECEITA.find((t) => t.value === tipo)?.label || tipo
}

export default function FeedRecente({ items, onRefresh, onEdit }: FeedRecenteProps) {
  const [deleting, setDeleting] = useState<number | null>(null)
  const [markingStatus, setMarkingStatus] = useState<number | null>(null)

  const handleDelete = useCallback(async (item: FeedItem) => {
    if (!window.confirm(`Excluir este lançamento de ${formatCurrency(item.valor)}? Esta ação não pode ser desfeita.`)) return
    setDeleting(item.id)
    try {
      const endpoint = item._tipo === 'venda' ? 'vendas' : item._tipo === 'receita' ? 'receitas' : 'despesas'
      await fetch(`/api/${endpoint}/${item.id}`, { method: 'DELETE' })
      onRefresh()
    } catch {
      alert('Erro ao excluir.')
    }
    setDeleting(null)
  }, [onRefresh])

  const handleMarkStatus = useCallback(async (item: FeedItem) => {
    setMarkingStatus(item.id)
    try {
      const endpoint = item._tipo === 'receita' ? 'receitas' : 'despesas'
      const newStatus = item._tipo === 'receita' ? 'recebido' : 'pago'
      await fetch(`/api/${endpoint}/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      onRefresh()
    } catch {
      alert('Erro ao atualizar status.')
    }
    setMarkingStatus(null)
  }, [onRefresh])

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-4xl mb-2">📋</p>
        <p className="text-sm">Nenhum lançamento ainda. Comece inserindo uma venda!</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const tipoInfo = TIPO_LABELS[item._tipo]
        const isPending = item._tipo === 'despesa' && item.status === 'pendente'
        const isForecast = item._tipo === 'receita' && item.status === 'previsto'
        const canMarkStatus = isPending || isForecast

        return (
          <div
            key={`${item._tipo}-${item.id}`}
            className={`border rounded-xl px-4 py-3 ${tipoInfo.bg}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-gray-900/50 ${tipoInfo.color}`}>
                    {tipoInfo.label}
                  </span>
                  {item.status && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      item.status === 'pago' || item.status === 'recebido'
                        ? 'bg-emerald-900/50 text-emerald-400'
                        : 'bg-yellow-900/50 text-yellow-400'
                    }`}>
                      {item.status === 'pago' ? 'Pago' : item.status === 'recebido' ? 'Recebido' : item.status === 'pendente' ? 'Pendente' : 'Previsto'}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">{formatDate(item.data)}</span>
                </div>

                <p className="text-sm text-gray-200 truncate">
                  {item._tipo === 'venda'
                    ? `${item.produto} × ${item.quantidade} — ${item.vendedor}`
                    : item._tipo === 'receita'
                    ? `${getTipoReceitaLabel(item.tipo || '')} · ${item.descricao}`
                    : `${item.categoria} · ${item.descricao}`}
                </p>

                <p className={`text-base font-bold mt-1 ${
                  item._tipo === 'despesa' ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {item._tipo === 'despesa' ? '−' : '+'}{formatCurrency(item.valor)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-1.5 shrink-0">
                {canMarkStatus && (
                  <button
                    onClick={() => handleMarkStatus(item)}
                    disabled={markingStatus === item.id}
                    className="btn-success text-xs py-1.5 px-2.5"
                  >
                    {markingStatus === item.id ? '...' : item._tipo === 'despesa' ? '✓ Pago' : '✓ Recebido'}
                  </button>
                )}
                <button
                  onClick={() => onEdit(item)}
                  className="btn-secondary text-xs py-1.5 px-2.5"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  disabled={deleting === item.id}
                  className="btn-danger text-xs py-1.5 px-2.5"
                >
                  {deleting === item.id ? '...' : 'Excluir'}
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
