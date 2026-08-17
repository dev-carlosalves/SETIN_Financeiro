'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { formatCurrency, formatDate } from '@/lib/utils'

interface ChartPoint {
  date: string
  saldoReal: number
  saldoProjetado: number
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className="bg-zinc-900 border border-zinc-700/80 rounded-lg p-3 text-xs shadow-xl backdrop-blur-md">
      <p className="text-zinc-400 font-medium mb-1.5">{label}</p>
      <div className="space-y-1">
        {payload.map((p) => (
          <div key={p.name} className="flex items-center justify-between gap-4">
            <span className="text-zinc-300 font-medium">
              {p.name === 'saldoReal' ? 'Saldo Real' : 'Saldo Projetado'}
            </span>
            <span style={{ color: p.color }} className="font-semibold font-mono">
              {formatCurrency(p.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function GraficoEvolucao({ data }: { data: ChartPoint[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500 text-xs">
        Sem movimentações suficientes para gerar o gráfico histórico.
      </div>
    )
  }

  const formattedData = data.map((d) => ({
    ...d,
    dateLabel: formatDate(d.date),
  }))

  return (
    <div className="w-full h-64 pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.6} />
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
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: 12, fontSize: 11 }}
            formatter={(value) => (
              <span className="text-zinc-400 font-medium">
                {value === 'saldoReal' ? 'Saldo Real' : 'Saldo Projetado'}
              </span>
            )}
          />
          <Line
            type="monotone"
            dataKey="saldoReal"
            name="saldoReal"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={{ fill: '#10b981', r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="saldoProjetado"
            name="saldoProjetado"
            stroke="#71717a"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
