'use client'

import { useState, useEffect } from 'react'
import { PRODUTOS } from '@/lib/constants'
import { todayISO, formatCurrency } from '@/lib/utils'

interface VendaFormProps {
  nomeUsuario: string
  onSuccess: () => void
  editData?: Record<string, unknown> | null
  onCancelEdit?: () => void
}

export default function VendaForm({ nomeUsuario, onSuccess, editData, onCancelEdit }: VendaFormProps) {
  const [form, setForm] = useState({
    data: todayISO(),
    vendedor: nomeUsuario,
    produto: PRODUTOS[0] || 'Café',
    quantidade: '1',
    valor_unitario: '',
    cliente: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!editData) {
      setForm((f) => ({ ...f, vendedor: nomeUsuario }))
    }
  }, [nomeUsuario, editData])

  useEffect(() => {
    if (editData) {
      setForm({
        data: editData.data ? String(editData.data).split('T')[0] : todayISO(),
        vendedor: String(editData.vendedor || nomeUsuario),
        produto: String(editData.produto || PRODUTOS[0]),
        quantidade: String(editData.quantidade || '1'),
        valor_unitario: String(editData.valor_unitario || ''),
        cliente: String(editData.cliente || ''),
      })
    }
  }, [editData, nomeUsuario])

  const valorTotal =
    parseFloat(form.quantidade || '0') * parseFloat(form.valor_unitario || '0')
  const valorTotalDisplay = isNaN(valorTotal) ? 0 : valorTotal

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
    setSuccess(false)
  }

  const setQuickProduct = (p: string) => {
    setForm((prev) => ({ ...prev, produto: p }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.produto || !form.quantidade || !form.valor_unitario) {
      setError('Produto, quantidade e valor unitário são obrigatórios.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const isEdit = editData && editData.id
      const url = isEdit ? `/api/vendas/${editData.id}` : '/api/vendas'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error || 'Erro ao registrar venda.')
      } else {
        setSuccess(true)
        if (!editData) {
          setForm({
            data: todayISO(),
            vendedor: nomeUsuario,
            produto: PRODUTOS[0] || 'Café',
            quantidade: '1',
            valor_unitario: '',
            cliente: '',
          })
        }
        onSuccess()
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch {
      setError('Erro de conexão ao salvar venda.')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Product Quick Select */}
      <div>
        <label className="label">Produto</label>
        <div className="grid grid-cols-3 gap-2 mb-2">
          {PRODUTOS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setQuickProduct(p)}
              className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all text-center ${
                form.produto === p
                  ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 font-semibold'
                  : 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Data da Venda</label>
          <input
            type="date"
            name="data"
            value={form.data}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="label">Vendedor Responsável</label>
          <input
            type="text"
            name="vendedor"
            value={form.vendedor}
            onChange={handleChange}
            className="input-field"
            placeholder="Nome do vendedor"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Quantidade</label>
          <input
            type="number"
            name="quantidade"
            value={form.quantidade}
            onChange={handleChange}
            className="input-field"
            min="1"
            inputMode="numeric"
            placeholder="1"
            required
          />
        </div>
        <div>
          <label className="label">Valor Unitário (R$)</label>
          <input
            type="number"
            name="valor_unitario"
            value={form.valor_unitario}
            onChange={handleChange}
            className="input-field"
            min="0"
            step="0.01"
            inputMode="decimal"
            placeholder="0,00"
            required
          />
        </div>
      </div>

      {/* Calculated Total Box */}
      <div className="bg-zinc-950/80 border border-zinc-800 rounded-lg px-4 py-3 flex justify-between items-center">
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Total da Venda</span>
        <span className="text-base font-semibold text-emerald-400 font-mono">
          {formatCurrency(valorTotalDisplay)}
        </span>
      </div>

      <div>
        <label className="label">Identificação do Cliente (Opcional)</label>
        <input
          type="text"
          name="cliente"
          value={form.cliente}
          onChange={handleChange}
          className="input-field"
          placeholder="Ex: Aluno, Professor, Convidado"
        />
      </div>

      {error && (
        <div className="text-rose-400 text-xs bg-rose-950/40 border border-rose-800/40 rounded-lg px-3 py-2.5">
          {error}
        </div>
      )}
      {success && (
        <div className="text-emerald-400 text-xs bg-emerald-950/40 border border-emerald-800/40 rounded-lg px-3 py-2.5">
          Venda registrada com sucesso no sistema.
        </div>
      )}

      <div className="flex gap-2.5 pt-1">
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? 'Processando...' : editData ? 'Salvar Alterações' : 'Lançar Venda'}
        </button>
        {editData && onCancelEdit && (
          <button type="button" onClick={onCancelEdit} className="btn-secondary">
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
