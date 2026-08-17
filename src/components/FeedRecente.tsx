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
      alert('Erro ao excluir lançamento.')
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
      <div className="text-center py-10 text-zinc-500">
        <p className="text-sm font-medium text-zinc-400">Nenhum lançamento registrado</p>
        <p className="text-xs text-zinc-600 mt-1">Os novos registros aparecerão nesta lista em tempo real.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      {items.map((item) => {
        const isPending = item._tipo === 'despesa' && item.status === 'pendente'
        const isForecast = item._tipo === 'receita' && item.status === 'previsto'
        const canMarkStatus = isPending || isForecast

        const typeBadge =
          item._tipo === 'venda'
            ? 'bg-zinc-800 text-zinc-300 border-zinc-700'
            : item._tipo === 'receita'
            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
            : 'bg-rose-950/60 text-rose-300 border-rose-800/40'

        const statusBadge =
          item.status === 'pago' || item.status === 'recebido'
            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/30'
            : 'bg-amber-950/40 text-amber-400 border-amber-800/30'

        return (
          <div
            key={`${item._tipo}-${item.id}`}
            className="p-3.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700/80 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className={`badge uppercase text-[10px] tracking-wider font-semibold ${typeBadge}`}>
                    {item._tipo}
                  </span>
                  {item.status && (
                    <span className={`badge uppercase text-[10px] tracking-wider ${statusBadge}`}>
                      {item.status}
                    </span>
                  )}
                  <span className="text-xs text-zinc-500 font-mono">{formatDate(item.data)}</span>
                </div>

                <p className="text-xs sm:text-sm font-medium text-zinc-200 truncate">
                  {item._tipo === 'venda'
                    ? `${item.produto} (qtd: ${item.quantidade}) • ${item.vendedor}`
                    : item._tipo === 'receita'
                    ? `${getTipoReceitaLabel(item.tipo || '')} — ${item.descricao}`
                    : `${item.categoria} — ${item.descricao}`}
                </p>

                <p className={`text-sm font-semibold mt-1 font-mono ${
                  item._tipo === 'despesa' ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {item._tipo === 'despesa' ? '− ' : '+ '}{formatCurrency(item.valor)}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                {canMarkStatus && (
                  <button
                    onClick={() => handleMarkStatus(item)}
                    disabled={markingStatus === item.id}
                    className="text-xs font-medium py-1 px-2.5 rounded bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/50 transition-colors"
                    title={item._tipo === 'despesa' ? 'Confirmar pagamento' : 'Confirmar recebimento'}
                  >
                    {markingStatus === item.id ? '...' : item._tipo === 'despesa' ? 'Pagar' : 'Receber'}
                  </button>
                )}
                <button
                  onClick={() => onEdit(item)}
                  className="text-xs font-medium py-1 px-2 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/60 transition-colors"
                  title="Editar"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  disabled={deleting === item.id}
                  className="text-xs font-medium py-1 px-2 rounded bg-zinc-900 hover:bg-rose-950/80 text-zinc-400 hover:text-rose-300 border border-zinc-800 hover:border-rose-800/40 transition-colors"
                  title="Excluir"
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
