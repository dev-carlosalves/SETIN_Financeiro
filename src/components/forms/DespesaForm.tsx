'use client'

import { useState, useEffect } from 'react'
import { CATEGORIAS_DESPESA, STATUS_DESPESA, FORMAS_PAGAMENTO } from '@/lib/constants'
import { todayISO } from '@/lib/utils'

interface DespesaFormProps {
  nomeUsuario: string
  onSuccess: () => void
  editData?: Record<string, unknown> | null
  onCancelEdit?: () => void
}

export default function DespesaForm({ nomeUsuario, onSuccess, editData, onCancelEdit }: DespesaFormProps) {
  const [form, setForm] = useState({
    data: todayISO(),
    categoria: CATEGORIAS_DESPESA[0],
    descricao: '',
    fornecedor: '',
    valor: '',
    status: 'pendente',
    forma_pagamento: '',
    responsavel: nomeUsuario,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setForm((f) => ({ ...f, responsavel: nomeUsuario }))
  }, [nomeUsuario])

  useEffect(() => {
    if (editData) {
      setForm({
        data: editData.data ? String(editData.data).split('T')[0] : todayISO(),
        categoria: String(editData.categoria || CATEGORIAS_DESPESA[0]),
        descricao: String(editData.descricao || ''),
        fornecedor: String(editData.fornecedor || ''),
        valor: String(editData.valor || ''),
        status: String(editData.status || 'pendente'),
        forma_pagamento: String(editData.forma_pagamento || ''),
        responsavel: String(editData.responsavel || nomeUsuario),
      })
    }
  }, [editData, nomeUsuario])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
    setSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.descricao || !form.valor) {
      setError('Descrição e valor são obrigatórios.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const isEdit = editData && editData.id
      const url = isEdit ? `/api/despesas/${editData.id}` : '/api/despesas'
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
          setForm({ data: todayISO(), categoria: CATEGORIAS_DESPESA[0], descricao: '', fornecedor: '', valor: '', status: 'pendente', forma_pagamento: '', responsavel: nomeUsuario })
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
          <label className="label">Categoria</label>
          <select name="categoria" value={form.categoria} onChange={handleChange} className="input-field">
            {CATEGORIAS_DESPESA.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label">Descrição</label>
        <input type="text" name="descricao" value={form.descricao} onChange={handleChange} className="input-field" placeholder="Ex.: Aluguel do espaço principal" />
      </div>

      <div>
        <label className="label">Fornecedor (opcional)</label>
        <input type="text" name="fornecedor" value={form.fornecedor} onChange={handleChange} className="input-field" placeholder="Nome do fornecedor" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Valor (R$)</label>
          <input
            type="number"
            name="valor"
            value={form.valor}
            onChange={handleChange}
            className="input-field"
            min="0"
            step="0.01"
            inputMode="decimal"
            placeholder="0,00"
          />
        </div>
        <div>
          <label className="label">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="input-field">
            {STATUS_DESPESA.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Forma de pagamento (opcional)</label>
          <select name="forma_pagamento" value={form.forma_pagamento} onChange={handleChange} className="input-field">
            <option value="">Selecionar...</option>
            {FORMAS_PAGAMENTO.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Responsável</label>
          <input type="text" name="responsavel" value={form.responsavel} onChange={handleChange} className="input-field" placeholder="Nome" />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm bg-red-950/40 border border-red-800/50 rounded-xl px-3 py-2">{error}</p>}
      {success && <p className="text-emerald-400 text-sm bg-emerald-950/40 border border-emerald-800/50 rounded-xl px-3 py-2">✓ Despesa registrada com sucesso!</p>}

      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? 'Salvando...' : editData ? 'Atualizar despesa' : 'Registrar despesa'}
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
