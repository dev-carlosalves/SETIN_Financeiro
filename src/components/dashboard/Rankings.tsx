'use client'

import { formatCurrency } from '@/lib/utils'

interface RankingItem {
  produto?: string
  categoria?: string
  quantidade?: number
  valor: number
}

interface RankingsProps {
  produtos: RankingItem[]
  categorias: RankingItem[]
  vendedores?: Array<{ vendedor: string; valor: number }>
}

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

export default function Rankings({ produtos, categorias }: RankingsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
