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
    produto: PRODUTOS[0],
    quantidade: '1',
    valor_unitario: '',
    cliente: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setForm((f) => ({ ...f, vendedor: nomeUsuario }))
  }, [nomeUsuario])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.produto || !form.quantidade || !form.valor_unitario) {
      setError('Produto, quantidade e valor são obrigatórios.')
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
        setError(d.error || 'Erro ao salvar.')
      } else {
        setSuccess(true)
        if (!editData) {
          setForm({ data: todayISO(), vendedor: nomeUsuario, produto: PRODUTOS[0], quantidade: '1', valor_unitario: '', cliente: '' })
        }
        onSuccess()
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch {
      setError('Erro de conexão.')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Data</label>
          <input type="date" name="data" value={form.data} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label className="label">Vendedor</label>
          <input type="text" name="vendedor" value={form.vendedor} onChange={handleChange} className="input-field" placeholder="Nome" />
        </div>
      </div>

      <div>
        <label className="label">Produto</label>
        <select name="produto" value={form.produto} onChange={handleChange} className="input-field">
          {PRODUTOS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
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
          />
        </div>
        <div>
          <label className="label">Valor unitário (R$)</label>
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
          />
        </div>
      </div>

      {/* Live total */}
      {valorTotalDisplay > 0 && (
        <div className="bg-indigo-950/40 border border-indigo-800/50 rounded-xl px-4 py-3 flex justify-between items-center">
          <span className="text-sm text-indigo-300">Total calculado</span>
          <span className="text-lg font-bold text-indigo-300">{formatCurrency(valorTotalDisplay)}</span>
        </div>
      )}

      <div>
        <label className="label">Cliente (opcional)</label>
        <input type="text" name="cliente" value={form.cliente} onChange={handleChange} className="input-field" placeholder="Nome do cliente" />
      </div>

      {error && <p className="text-red-400 text-sm bg-red-950/40 border border-red-800/50 rounded-xl px-3 py-2">{error}</p>}
      {success && <p className="text-emerald-400 text-sm bg-emerald-950/40 border border-emerald-800/50 rounded-xl px-3 py-2">✓ Venda registrada com sucesso!</p>}

      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? 'Salvando...' : editData ? 'Atualizar venda' : 'Registrar venda'}
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
