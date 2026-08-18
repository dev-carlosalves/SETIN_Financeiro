'use client'

import { formatCurrency } from '@/lib/utils'

interface RankingItem {
  produto?: string
  categoria?: string
  quantidade?: number
  valor: number
}

interface EquipeRanking {
  equipe: number
  total: number
  porDia: Record<string, number>
}

interface RankingsProps {
  produtos: RankingItem[]
  categorias: RankingItem[]
  vendedores?: Array<{ vendedor: string; valor: number }>
  equipes?: EquipeRanking[]
}

const EQUIPE_COLORS = [
  { bg: 'bg-emerald-500/80', text: 'text-emerald-300', border: 'border-emerald-500/40', accent: 'bg-emerald-950/40' },
  { bg: 'bg-blue-500/80', text: 'text-blue-300', border: 'border-blue-500/40', accent: 'bg-blue-950/40' },
  { bg: 'bg-amber-500/80', text: 'text-amber-300', border: 'border-amber-500/40', accent: 'bg-amber-950/40' },
  { bg: 'bg-purple-500/80', text: 'text-purple-300', border: 'border-purple-500/40', accent: 'bg-purple-950/40' },
]

function MetricDistribution({
  title,
  items,
  labelKey,
}: {
  title: string
  items: RankingItem[]
  labelKey: 'produto' | 'categoria'
}) {
  if (!items || items.length === 0) {
    return (
      <div className="card">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
          {title}
        </h3>
        <p className="text-xs text-zinc-600">Sem dados registrados até o momento.</p>
      </div>
    )
  }

  const maxValue = items[0]?.valor || 1

  return (
    <div className="card">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">
        {title}
      </h3>
      <div className="space-y-3.5">
        {items.slice(0, 6).map((item, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-200 font-medium flex items-center gap-2">
                <span className="text-zinc-500 font-mono text-[10px] w-3">{idx + 1}.</span>
                <span className="truncate max-w-[160px] sm:max-w-[200px]">{item[labelKey]}</span>
                {item.quantidade !== undefined && (
                  <span className="text-zinc-500 font-mono text-[11px]">
                    ({item.quantidade} un)
                  </span>
                )}
              </span>
              <span className="text-zinc-300 font-semibold font-mono">
                {formatCurrency(item.valor)}
              </span>
            </div>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500/80 transition-all duration-500"
                style={{ width: `${Math.max(4, (item.valor / maxValue) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EquipeRankingSection({ equipes }: { equipes: EquipeRanking[] }) {
  if (!equipes || equipes.length === 0) {
    return (
      <div className="card col-span-full">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
          Ranking por Equipe
        </h3>
        <p className="text-xs text-zinc-600">Sem dados de equipes registrados até o momento.</p>
      </div>
    )
  }

  const maxTotal = equipes[0]?.total || 1
  const winner = equipes[0]

  return (
    <div className="card col-span-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Ranking por Equipe
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">Total vendido por cada equipe ao longo do evento</p>
        </div>
        {winner && winner.total > 0 && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-zinc-500">Líder:</span>
            <span className={`font-semibold ${EQUIPE_COLORS[(winner.equipe - 1) % 4].text}`}>
              Equipe {winner.equipe}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {equipes.map((eq, idx) => {
          const colors = EQUIPE_COLORS[(eq.equipe - 1) % 4]
          const percentage = maxTotal > 0 ? (eq.total / maxTotal) * 100 : 0
          const isWinner = idx === 0 && eq.total > 0

          return (
            <div key={eq.equipe} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className={`text-xs font-bold px-2 py-1 rounded-md border ${colors.accent} ${colors.border} ${colors.text}`}>
                    EQ {eq.equipe}
                  </span>
                  <span className="text-xs text-zinc-300 font-medium">
                    Equipe {eq.equipe}
                  </span>
                  {isWinner && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-800/40">
                      🏆 1º lugar
                    </span>
                  )}
                </div>
                <span className="text-sm font-semibold font-mono text-zinc-200">
                  {formatCurrency(eq.total)}
                </span>
              </div>
              <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${colors.bg} transition-all duration-700 ease-out`}
                  style={{ width: `${Math.max(2, percentage)}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Rankings({ produtos, categorias, equipes }: RankingsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Ranking de Equipes (full width) */}
      <EquipeRankingSection equipes={equipes || []} />

      <MetricDistribution
        title="Produtos Mais Vendidos"
        items={produtos}
        labelKey="produto"
      />
      <MetricDistribution
        title="Despesas por Categoria"
        items={categorias}
        labelKey="categoria"
      />
    </div>
  )
}
