'use client'

import { useState, useEffect } from 'react'
import { STATUS_DESPESA, FORMAS_PAGAMENTO } from '@/lib/constants'
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
    categoria: '',
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
    if (!editData) {
      setForm((f) => ({ ...f, responsavel: nomeUsuario }))
    }
  }, [nomeUsuario, editData])

  useEffect(() => {
    if (editData) {
      setForm({
        data: editData.data ? String(editData.data).split('T')[0] : todayISO(),
        categoria: String(editData.categoria || ''),
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
    if (!form.categoria || !form.descricao || !form.valor) {
      setError('Categoria, descrição e valor são campos obrigatórios.')
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
        setError(d.error || 'Erro ao salvar despesa.')
      } else {
        setSuccess(true)
        if (!editData) {
          setForm({
            data: todayISO(),
            categoria: '',
            descricao: '',
            fornecedor: '',
            valor: '',
            status: 'pendente',
            forma_pagamento: '',
            responsavel: nomeUsuario,
          })
        }
        onSuccess()
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch {
      setError('Erro de conexão ao salvar despesa.')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Data do Registro</label>
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
          <label className="label">Categoria</label>
          <input
            type="text"
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            className="input-field"
            placeholder="Ex: Alimentação, Transporte, Material..."
            required
          />
        </div>
      </div>

      <div>
        <label className="label">Descrição da Despesa</label>
        <input
          type="text"
          name="descricao"
          value={form.descricao}
          onChange={handleChange}
          className="input-field"
          placeholder="Ex: Compra de insumos, café em pó, guardanapos"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Fornecedor / Estabelecimento (Opcional)</label>
          <input
            type="text"
            name="fornecedor"
            value={form.fornecedor}
            onChange={handleChange}
            className="input-field"
            placeholder="Nome do fornecedor"
          />
        </div>
        <div>
          <label className="label">Responsável pelo Lançamento</label>
          <input
            type="text"
            name="responsavel"
            value={form.responsavel}
            onChange={handleChange}
            className="input-field"
            placeholder="Nome do responsável"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
            required
          />
        </div>
        <div>
          <label className="label">Status de Pagamento</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="input-field"
          >
            {STATUS_DESPESA.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Forma de Pagamento</label>
          <select
            name="forma_pagamento"
            value={form.forma_pagamento}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Não especificado</option>
            {FORMAS_PAGAMENTO.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="text-rose-400 text-xs bg-rose-950/40 border border-rose-800/40 rounded-lg px-3 py-2.5">
          {error}
        </div>
      )}
      {success && (
        <div className="text-emerald-400 text-xs bg-emerald-950/40 border border-emerald-800/40 rounded-lg px-3 py-2.5">
          Despesa registrada com sucesso.
        </div>
      )}

      <div className="flex gap-2.5 pt-1">
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? 'Processando...' : editData ? 'Salvar Alterações' : 'Lançar Despesa'}
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
