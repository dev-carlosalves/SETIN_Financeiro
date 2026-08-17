'use client'

import { useState, useEffect } from 'react'
import { todayISO } from '@/lib/utils'

interface Meta {
  id?: number
  tipo: string
  valor_meta: string
  referencia?: string
}

export default function MetasForm() {
  const [metaDiaria, setMetaDiaria] = useState('')
  const [metaTotal, setMetaTotal] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/metas')
      .then((r) => r.json())
      .then((data: Meta[]) => {
        const total = data.find((m) => m.tipo === 'total_evento')
        const today = todayISO()
        const diaria = data.find((m) => m.tipo === 'diaria' && m.referencia?.startsWith(today))
        if (total) setMetaTotal(String(total.valor_meta))
        if (diaria) setMetaDiaria(String(diaria.valor_meta))
      })
      .catch(() => {})
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    try {
      const promises = []
      if (metaDiaria) {
        promises.push(
          fetch('/api/metas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tipo: 'diaria', valor_meta: parseFloat(metaDiaria), referencia: todayISO() }),
          })
        )
      }
      if (metaTotal) {
        promises.push(
          fetch('/api/metas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tipo: 'total_evento', valor_meta: parseFloat(metaTotal) }),
          })
        )
      }
      await Promise.all(promises)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('Erro ao salvar metas financeiras.')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Meta Diária (Hoje) — R$</label>
          <input
            type="number"
            value={metaDiaria}
            onChange={(e) => setMetaDiaria(e.target.value)}
            className="input-field"
            min="0"
            step="0.01"
            inputMode="decimal"
            placeholder="0,00"
          />
        </div>
        <div>
          <label className="label">Meta Geral do Evento — R$</label>
          <input
            type="number"
            value={metaTotal}
            onChange={(e) => setMetaTotal(e.target.value)}
            className="input-field"
            min="0"
            step="0.01"
            inputMode="decimal"
            placeholder="0,00"
          />
        </div>
      </div>

      {error && (
        <div className="text-rose-400 text-xs bg-rose-950/40 border border-rose-800/40 rounded-lg px-3 py-2">
          {error}
        </div>
      )}
      {success && (
        <div className="text-emerald-400 text-xs bg-emerald-950/40 border border-emerald-800/40 rounded-lg px-3 py-2">
          Metas atualizadas com sucesso.
        </div>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Salvando...' : 'Salvar Metas'}
      </button>
    </form>
  )
}
