'use client'

import { useState, useEffect } from 'react'
import { PRODUTOS, FORMAS_PAGAMENTO_VENDA } from '@/lib/constants'
import { todayISO, formatCurrency } from '@/lib/utils'

interface VendaFormProps {
  nomeUsuario: string
  equipeUsuario: number
  onSuccess: () => void
  editData?: Record<string, unknown> | null
  onCancelEdit?: () => void
}

interface FormState {
  data: string
  vendedor: string
  produto: string
  quantidade: string
  valor_unitario: string
  cliente: string
  equipe: number
  forma_pagamento: string
}

export default function VendaForm({ nomeUsuario, equipeUsuario, onSuccess, editData, onCancelEdit }: VendaFormProps) {
  const [form, setForm] = useState<FormState>({
    data: todayISO(),
    vendedor: nomeUsuario,
    produto: PRODUTOS[0].nome,
    quantidade: '1',
    valor_unitario: String(PRODUTOS[0].preco),
    cliente: '',
    equipe: equipeUsuario,
    forma_pagamento: 'dinheiro',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!editData) {
      setForm((f) => ({ ...f, vendedor: nomeUsuario, equipe: equipeUsuario }))
    }
  }, [nomeUsuario, equipeUsuario, editData])

  useEffect(() => {
    if (editData) {
      setForm({
        data: editData.data ? String(editData.data).split('T')[0] : todayISO(),
        vendedor: String(editData.vendedor || nomeUsuario),
        produto: String(editData.produto || PRODUTOS[0].nome),
        quantidade: String(editData.quantidade || '1'),
        valor_unitario: String(editData.valor_unitario || ''),
        cliente: String(editData.cliente || ''),
        equipe: Number(editData.equipe) || equipeUsuario,
        forma_pagamento: String(editData.forma_pagamento || 'dinheiro'),
      })
    }
  }, [editData, nomeUsuario, equipeUsuario])

  const valorTotal =
    parseFloat(form.quantidade || '0') * parseFloat(form.valor_unitario || '0')
  const valorTotalDisplay = isNaN(valorTotal) ? 0 : valorTotal

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
    setSuccess(false)
  }

  const setQuickProduct = (p: typeof PRODUTOS[number]) => {
    setForm((prev) => ({ ...prev, produto: p.nome, valor_unitario: String(p.preco) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.produto || !form.quantidade || !form.valor_unitario) {
      setError('Produto, quantidade e valor unitário são obrigatórios.')
      return
    }
    if (!form.forma_pagamento) {
      setError('Selecione a forma de pagamento.')
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
            produto: PRODUTOS[0].nome,
            quantidade: '1',
            valor_unitario: String(PRODUTOS[0].preco),
            cliente: '',
            equipe: equipeUsuario,
            forma_pagamento: 'dinheiro',
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
      {/* Product Quick Select with Prices */}
      <div>
        <label className="label">Produto</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
          {PRODUTOS.map((p) => (
            <button
              key={p.nome}
              type="button"
              onClick={() => setQuickProduct(p)}
              className={`py-2.5 px-3 rounded-lg text-xs font-medium border transition-all text-left ${
                form.produto === p.nome
                  ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 font-semibold'
                  : 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <div className="truncate">{p.nome}</div>
              <div className={`text-[11px] font-mono mt-0.5 ${
                form.produto === p.nome ? 'text-emerald-400' : 'text-zinc-500'
              }`}>
                {formatCurrency(p.preco)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <label className="label">Forma de Pagamento</label>
        <div className="grid grid-cols-3 gap-2">
          {FORMAS_PAGAMENTO_VENDA.map((fp) => (
            <button
              key={fp.value}
              type="button"
              onClick={() => { setForm((prev) => ({ ...prev, forma_pagamento: fp.value })); setError('') }}
              className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all text-center ${
                form.forma_pagamento === fp.value
                  ? 'bg-blue-950/60 border-blue-500/60 text-blue-300 font-semibold'
                  : 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              {fp.label}
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
