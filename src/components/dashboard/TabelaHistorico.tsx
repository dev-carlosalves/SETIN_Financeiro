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

const TIPO_BADGE: Record<string, string> = {
  venda: 'bg-cyan-950/60 text-cyan-300 border-cyan-800/50',
  receita: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50',
  despesa: 'bg-red-950/60 text-red-300 border-red-800/50',
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

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        <div>
          <label className="label text-xs">Tipo</label>
          <select name="tipo" value={filters.tipo} onChange={handleFilterChange} className="input-field py-2 text-sm">
            <option value="">Todos</option>
            <option value="venda">Venda</option>
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
          </select>
        </div>
        <div>
          <label className="label text-xs">Produto</label>
          <select name="produto" value={filters.produto} onChange={handleFilterChange} className="input-field py-2 text-sm">
            <option value="">Todos</option>
            {PRODUTOS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="label text-xs">Vendedor/Resp.</label>
          <input
            type="text"
            name="responsavel"
            value={filters.responsavel}
            onChange={handleFilterChange}
            placeholder="Nome..."
            className="input-field py-2 text-sm"
          />
        </div>
        <div>
          <label className="label text-xs">Status</label>
          <select name="status" value={filters.status} onChange={handleFilterChange} className="input-field py-2 text-sm">
            <option value="">Todos</option>
            <option value="pago">Pago</option>
            <option value="pendente">Pendente</option>
            <option value="recebido">Recebido</option>
            <option value="previsto">Previsto</option>
          </select>
        </div>
        <div>
          <label className="label text-xs">Data início</label>
          <input type="date" name="dataInicio" value={filters.dataInicio} onChange={handleFilterChange} className="input-field py-2 text-sm" />
        </div>
        <div>
          <label className="label text-xs">Data fim</label>
          <input type="date" name="dataFim" value={filters.dataFim} onChange={handleFilterChange} className="input-field py-2 text-sm" />
        </div>
      </div>

      {/* Export + count */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{loading ? '...' : `${items.length} lançamentos`}</span>
        <button
          onClick={handleExportCsv}
          className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
        >
          <span>⬇</span> Exportar CSV
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-8 text-gray-500 text-sm">Nenhum resultado encontrado.</div>
      ) : (
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-2.5 px-2 text-xs text-gray-500 font-medium">Tipo</th>
                <th className="text-left py-2.5 px-2 text-xs text-gray-500 font-medium">Data</th>
                <th className="text-left py-2.5 px-2 text-xs text-gray-500 font-medium">Descrição</th>
                <th className="text-right py-2.5 px-2 text-xs text-gray-500 font-medium">Valor</th>
                <th className="text-left py-2.5 px-2 text-xs text-gray-500 font-medium">Status</th>
                <th className="text-left py-2.5 px-2 text-xs text-gray-500 font-medium hidden sm:table-cell">Resp.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-800/30 transition-colors">
                  <td className="py-2.5 px-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${TIPO_BADGE[item.tipo]}`}>
                      {item.tipo}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-gray-400 text-xs">{formatDate(item.data)}</td>
                  <td className="py-2.5 px-2 text-gray-200 max-w-[150px]">
                    <span className="truncate block">{item.descricao}</span>
                  </td>
                  <td className={`py-2.5 px-2 text-right font-semibold ${item.tipo === 'despesa' ? 'text-red-400' : 'text-emerald-400'}`}>
                    {item.tipo === 'despesa' ? '−' : '+'}{formatCurrency(item.valor)}
                  </td>
                  <td className="py-2.5 px-2">
                    {item.status ? (
                      <span className={`text-xs ${
                        item.status === 'pago' || item.status === 'recebido'
                          ? 'text-emerald-400'
                          : 'text-yellow-400'
                      }`}>
                        {item.status}
                      </span>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                  <td className="py-2.5 px-2 text-gray-400 text-xs hidden sm:table-cell truncate max-w-[80px]">
                    {item.responsavel || item.vendedor || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
