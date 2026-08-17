'use client'

import { useState, useCallback, useEffect } from 'react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { PRODUTOS } from '@/lib/constants'

interface HistoricoItem {
  id: number
  tipo: 'venda' | 'receita' | 'despesa'
  data: string
  descricao: string
  valor: number
  status?: string
  responsavel?: string
  vendedor?: string
  produto?: string
  categoria?: string
  tipo_receita?: string
}

export default function TabelaHistorico() {
  const [items, setItems] = useState<HistoricoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    tipo: '',
    produto: '',
    responsavel: '',
    status: '',
    dataInicio: '',
    dataFim: '',
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v) })
    try {
      const res = await fetch(`/api/historico?${params}`)
      const data = await res.json()
      setItems(data)
    } catch {
      // ignore
    }
    setLoading(false)
  }, [filters])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleExportCsv = () => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v) })
    params.set('export', 'csv')
    window.open(`/api/historico?${params}`, '_blank')
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleResetFilters = () => {
    setFilters({
      tipo: '',
      produto: '',
      responsavel: '',
      status: '',
      dataInicio: '',
      dataFim: '',
    })
  }

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Filtros de Pesquisa
          </span>
          <button
            onClick={handleResetFilters}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Limpar filtros
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <div>
            <label className="label text-[10px]">Tipo</label>
            <select name="tipo" value={filters.tipo} onChange={handleFilterChange} className="input-field py-1.5 text-xs">
              <option value="">Todos</option>
              <option value="venda">Vendas</option>
              <option value="receita">Receitas</option>
              <option value="despesa">Despesas</option>
            </select>
          </div>
          <div>
            <label className="label text-[10px]">Produto</label>
            <select name="produto" value={filters.produto} onChange={handleFilterChange} className="input-field py-1.5 text-xs">
              <option value="">Todos</option>
              {PRODUTOS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="label text-[10px]">Responsável</label>
            <input
              type="text"
              name="responsavel"
              value={filters.responsavel}
              onChange={handleFilterChange}
              placeholder="Buscar nome..."
              className="input-field py-1.5 text-xs"
            />
          </div>
          <div>
            <label className="label text-[10px]">Status</label>
            <select name="status" value={filters.status} onChange={handleFilterChange} className="input-field py-1.5 text-xs">
              <option value="">Todos</option>
              <option value="pago">Pago</option>
              <option value="pendente">Pendente</option>
              <option value="recebido">Recebido</option>
              <option value="previsto">Previsto</option>
            </select>
          </div>
          <div>
            <label className="label text-[10px]">Data Início</label>
            <input type="date" name="dataInicio" value={filters.dataInicio} onChange={handleFilterChange} className="input-field py-1.5 text-xs" />
          </div>
          <div>
            <label className="label text-[10px]">Data Fim</label>
            <input type="date" name="dataFim" value={filters.dataFim} onChange={handleFilterChange} className="input-field py-1.5 text-xs" />
          </div>
        </div>
      </div>

      {/* Header bar: Count & Export */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-zinc-400 font-mono">
          {loading ? 'Carregando registros...' : `${items.length} registros encontrados`}
        </span>
        <button
          onClick={handleExportCsv}
          className="btn-secondary text-xs py-1.5 px-3"
        >
          Exportar Relatório CSV
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-500 border-t-transparent" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-zinc-500 text-xs">
          Nenhum registro encontrado com os filtros selecionados.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-800/80 bg-zinc-950/40">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3.5">Tipo</th>
                <th className="py-3 px-3.5">Data</th>
                <th className="py-3 px-3.5">Descrição</th>
                <th className="py-3 px-3.5 text-right">Valor</th>
                <th className="py-3 px-3.5">Status</th>
                <th className="py-3 px-3.5 hidden sm:table-cell">Responsável</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {items.map((item, idx) => {
                const typeBadge =
                  item.tipo === 'venda'
                    ? 'bg-zinc-800 text-zinc-300 border-zinc-700'
                    : item.tipo === 'receita'
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                    : 'bg-rose-950/60 text-rose-300 border-rose-800/40'

                const statusBadge =
                  item.status === 'pago' || item.status === 'recebido'
                    ? 'text-emerald-400'
                    : 'text-amber-400'

                return (
                  <tr key={idx} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3 px-3.5">
                      <span className={`badge uppercase text-[9px] tracking-wider font-semibold ${typeBadge}`}>
                        {item.tipo}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-zinc-400 font-mono whitespace-nowrap">
                      {formatDate(item.data)}
                    </td>
                    <td className="py-3 px-3.5 text-zinc-200 font-medium max-w-[220px] truncate">
                      {item.descricao}
                    </td>
                    <td className={`py-3 px-3.5 text-right font-semibold font-mono whitespace-nowrap ${
                      item.tipo === 'despesa' ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {item.tipo === 'despesa' ? '− ' : '+ '}{formatCurrency(item.valor)}
                    </td>
                    <td className="py-3 px-3.5">
                      {item.status ? (
                        <span className={`font-medium capitalize ${statusBadge}`}>
                          {item.status}
                        </span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3.5 text-zinc-400 hidden sm:table-cell truncate max-w-[120px]">
                      {item.responsavel || item.vendedor || '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
