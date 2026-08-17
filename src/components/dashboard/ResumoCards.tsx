'use client'

import { formatCurrency } from '@/lib/utils'

interface CardsData {
  totalVendidoHoje: number
  totalVendidoEvento: number
  saldoReal: number
  saldoProjetado: number
}

export default function ResumoCards({ data }: { data: CardsData }) {
  const cards = [
    {
      label: 'Vendido hoje',
      value: data.totalVendidoHoje,
      icon: '📅',
      color: 'text-cyan-300',
      bg: 'border-cyan-800/40',
    },
    {
      label: 'Vendas no evento',
      value: data.totalVendidoEvento,
      icon: '🛒',
      color: 'text-indigo-300',
      bg: 'border-indigo-800/40',
    },
    {
      label: 'Saldo real',
      value: data.saldoReal,
      icon: '✅',
      color: data.saldoReal >= 0 ? 'text-emerald-300' : 'text-red-400',
      bg: data.saldoReal >= 0 ? 'border-emerald-800/40' : 'border-red-800/40',
      subtitle: 'Receitas recebidas − despesas pagas',
    },
    {
      label: 'Saldo projetado',
      value: data.saldoProjetado,
      icon: '📊',
      color: data.saldoProjetado >= 0 ? 'text-amber-300' : 'text-red-400',
      bg: 'border-amber-800/40',
      subtitle: 'Todas as receitas − todas as despesas',
      dashed: true,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-gray-900 border rounded-2xl p-4 shadow-xl ${card.bg} ${card.dashed ? 'border-dashed opacity-90' : ''}`}
        >
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-base">{card.icon}</span>
            <span className="text-xs text-gray-400 font-medium">{card.label}</span>
          </div>
          <p className={`text-xl font-bold ${card.color} leading-tight`}>
            {formatCurrency(card.value)}
          </p>
          {card.subtitle && (
            <p className="text-xs text-gray-600 mt-1 leading-tight">{card.subtitle}</p>
          )}
        </div>
      ))}
    </div>
  )
}
