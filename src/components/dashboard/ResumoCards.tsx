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
      label: 'Vendas Hoje',
      value: data.totalVendidoHoje,
      subtitle: 'Faturamento do dia atual',
      accentColor: 'text-zinc-100',
      badge: 'Hoje',
      badgeColor: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    },
    {
      label: 'Total em Vendas',
      value: data.totalVendidoEvento,
      subtitle: 'Acumulado durante todo o evento',
      accentColor: 'text-zinc-100',
      badge: 'Acumulado',
      badgeColor: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    },
    {
      label: 'Saldo Real em Caixa',
      value: data.saldoReal,
      subtitle: 'Recebimentos efetuados − Despesas pagas',
      accentColor: data.saldoReal >= 0 ? 'text-emerald-400' : 'text-rose-400',
      badge: 'Disponível',
      badgeColor: data.saldoReal >= 0 ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40' : 'bg-rose-950/60 text-rose-300 border-rose-800/40',
    },
    {
      label: 'Saldo Projetado',
      value: data.saldoProjetado,
      subtitle: 'Todas as receitas − Todas as despesas',
      accentColor: data.saldoProjetado >= 0 ? 'text-zinc-100' : 'text-rose-400',
      badge: 'Estimado',
      badgeColor: 'bg-zinc-800/60 text-zinc-400 border-zinc-700/60',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="card flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {card.label}
              </span>
              <span className={`badge uppercase text-[9px] tracking-wider ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>
            <p className={`text-2xl font-bold tracking-tight font-mono ${card.accentColor}`}>
              {formatCurrency(card.value)}
            </p>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2.5 pt-2 border-t border-zinc-800/60">
            {card.subtitle}
          </p>
        </div>
      ))}
    </div>
  )
}
