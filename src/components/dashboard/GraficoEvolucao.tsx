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
    <div className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm shadow-xl">
      <p className="text-gray-400 mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  )
}

export default function GraficoEvolucao({ data }: { data: ChartPoint[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        Sem dados suficientes para exibir o gráfico.
      </div>
    )
  }

  const formattedData = data.map((d) => ({
    ...d,
    dateLabel: formatDate(d.date),
  }))

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={formattedData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis
          dataKey="dateLabel"
          tick={{ fill: '#6b7280', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fill: '#6b7280', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
          width={55}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ color: '#9ca3af', fontSize: 12 }}
          formatter={(value) => (value === 'saldoReal' ? 'Saldo Real' : 'Saldo Projetado')}
        />
        <Line
          type="monotone"
          dataKey="saldoReal"
          name="saldoReal"
          stroke="#6366f1"
          strokeWidth={2.5}
          dot={{ fill: '#6366f1', r: 3 }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="saldoProjetado"
          name="saldoProjetado"
          stroke="#22d3ee"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
