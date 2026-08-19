'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts'
import { formatCurrency, formatDate } from '@/lib/utils'

export interface DailySalesPoint {
  date: string
  valorTotal: number
  quantidadeTotal: number
  transacoes: number
  diferenca: number
  percentual: number | null
  isFirstDay: boolean
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ payload: DailySalesPoint }>
  label?: string
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null
  const data = payload[0].payload

  const isPositive = data.diferenca > 0
  const isNegative = data.diferenca < 0
  const isZero = data.diferenca === 0

  return (
    <div className="bg-zinc-900/95 border border-zinc-700/80 rounded-xl p-3.5 text-xs shadow-2xl backdrop-blur-md min-w-[200px]">
      <p className="text-zinc-400 font-medium pb-2 mb-2 border-b border-zinc-800 flex items-center justify-between">
        <span>{formatDate(data.date)}</span>
        <span className="text-[10px] text-zinc-500 font-mono">
          {data.transacoes} {data.transacoes === 1 ? 'registro' : 'registros'}
        </span>
      </p>

      <div className="space-y-2">
        <div>
          <span className="text-zinc-400 block text-[11px]">Total Vendido no Dia:</span>
          <span className="text-emerald-400 font-bold font-mono text-sm">
            {formatCurrency(data.valorTotal)}
          </span>
          <span className="text-zinc-500 text-[11px] ml-1.5 font-medium">
            ({data.quantidadeTotal} {data.quantidadeTotal === 1 ? 'item' : 'itens'})
          </span>
        </div>

        <div className="pt-2 border-t border-zinc-800/80">
          <span className="text-zinc-400 block text-[11px] mb-1">Diferença vs Dia Anterior:</span>
          {data.isFirstDay ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-800 text-zinc-300">
              Primeiro dia de vendas
            </span>
          ) : isPositive ? (
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
              <span>↑ +{formatCurrency(data.diferenca)}</span>
              {data.percentual !== null && (
                <span className="text-[10px] opacity-80">(+{data.percentual.toFixed(1)}%)</span>
              )}
            </div>
          ) : isNegative ? (
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-950/60 text-rose-400 border border-rose-800/50">
              <span>↓ {formatCurrency(data.diferenca)}</span>
              {data.percentual !== null && (
                <span className="text-[10px] opacity-80">({data.percentual.toFixed(1)}%)</span>
              )}
            </div>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-800 text-zinc-400">
              = Mesma quantia (0%)
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function GraficoVendasDiarias({ data }: { data: DailySalesPoint[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500 text-xs">
        Nenhuma venda registrada até o momento para exibir o comparativo diário.
      </div>
    )
  }

  const formattedData = data.map((d) => ({
    ...d,
    dateLabel: formatDate(d.date),
  }))

  // Summary calculations
  const totalGeral = data.reduce((acc, curr) => acc + curr.valorTotal, 0)
  const mediaDiaria = totalGeral / data.length
  const melhorDia = [...data].sort((a, b) => b.valorTotal - a.valorTotal)[0]
  const ultimoDia = data[data.length - 1]

  return (
    <div className="space-y-4">
      {/* Quick stats cards row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-lg p-2.5">
          <p className="text-[11px] text-zinc-400 font-medium">Dias com Vendas</p>
          <p className="text-sm font-bold text-zinc-100 font-mono mt-0.5">
            {data.length} {data.length === 1 ? 'dia' : 'dias'}
          </p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-lg p-2.5">
          <p className="text-[11px] text-zinc-400 font-medium">Média Diária</p>
          <p className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
            {formatCurrency(mediaDiaria)}
          </p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-lg p-2.5">
          <p className="text-[11px] text-zinc-400 font-medium">Melhor Dia de Vendas</p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-sm font-bold text-emerald-300 font-mono">
              {formatCurrency(melhorDia.valorTotal)}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              ({formatDate(melhorDia.date)})
            </span>
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-lg p-2.5">
          <p className="text-[11px] text-zinc-400 font-medium">Variação Recente</p>
          <div className="mt-0.5">
            {ultimoDia.isFirstDay ? (
              <span className="text-xs text-zinc-400 font-medium">1º registro</span>
            ) : ultimoDia.diferenca > 0 ? (
              <span className="text-xs font-semibold text-emerald-400 font-mono">
                ↑ +{formatCurrency(ultimoDia.diferenca)}
              </span>
            ) : ultimoDia.diferenca < 0 ? (
              <span className="text-xs font-semibold text-rose-400 font-mono">
                ↓ {formatCurrency(ultimoDia.diferenca)}
              </span>
            ) : (
              <span className="text-xs text-zinc-400 font-mono">= Estável</span>
            )}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.6} vertical={false} />
            <XAxis
              dataKey="dateLabel"
              tick={{ fill: '#71717a', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fill: '#71717a', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `R$${v}`}
              width={65}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#27272a', opacity: 0.3 }} />
            <ReferenceLine
              y={mediaDiaria}
              stroke="#059669"
              strokeDasharray="3 3"
              strokeWidth={1.5}
              label={{
                value: `Média (${formatCurrency(mediaDiaria)})`,
                fill: '#10b981',
                fontSize: 10,
                position: 'insideTopRight',
              }}
            />
            <Bar
              dataKey="valorTotal"
              radius={[6, 6, 0, 0]}
              maxBarSize={56}
            >
              {formattedData.map((entry, index) => {
                // Color variation: if day grew compared to previous, bright emerald; if decreased, soft teal/cyan or amber
                const isGrowth = entry.diferenca >= 0
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isFirstDay ? '#10b981' : isGrowth ? '#10b981' : '#0d9488'}
                    className="transition-all duration-200 hover:opacity-80"
                  />
                )
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend / Helper note */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-zinc-500 pt-1 border-t border-zinc-800/60">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
            <span>Valor diário vendido</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 border-t border-dashed border-emerald-500 inline-block" />
            <span>Linha de média diária</span>
          </div>
        </div>
        <span>Passe o cursor sobre as barras para ver a diferença detalhada em R$ e %</span>
      </div>
    </div>
  )
}
