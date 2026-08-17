'use client'

import { formatCurrency } from '@/lib/utils'

interface RankingItem {
  produto?: string
  vendedor?: string
  categoria?: string
  quantidade?: number
  valor: number
}

interface RankingsProps {
  produtos: RankingItem[]
  vendedores: RankingItem[]
  categorias: RankingItem[]
}

function RankingList({
  title,
  items,
  labelKey,
  icon,
}: {
  title: string
  items: RankingItem[]
  labelKey: 'produto' | 'vendedor' | 'categoria'
  icon: string
}) {
  if (items.length === 0) {
    return (
      <div>
        <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-1.5">
          <span>{icon}</span> {title}
        </h3>
        <p className="text-xs text-gray-500">Sem dados</p>
      </div>
    )
  }

  const maxValue = items[0]?.valor || 1

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-1.5">
        <span>{icon}</span> {title}
      </h3>
      <div className="space-y-2.5">
        {items.slice(0, 5).map((item, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-300 flex items-center gap-1">
                <span className="text-gray-500 w-4">{idx + 1}.</span>
                <span className="truncate max-w-[120px]">{item[labelKey]}</span>
                {item.quantidade !== undefined && (
                  <span className="text-gray-500">({item.quantidade} un.)</span>
                )}
              </span>
              <span className="text-gray-300 font-semibold">{formatCurrency(item.valor)}</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-600"
                style={{ width: `${(item.valor / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Rankings({ produtos, vendedores, categorias }: RankingsProps) {
  return (
    <div className="space-y-6">
      <RankingList
        title="Produtos mais vendidos"
        items={produtos}
        labelKey="produto"
        icon="🏆"
      />
      <div className="border-t border-gray-800 pt-6">
        <RankingList
          title="Ranking de vendedores"
          items={vendedores}
          labelKey="vendedor"
          icon="⭐"
        />
      </div>
      <div className="border-t border-gray-800 pt-6">
        <RankingList
          title="Despesas por categoria"
          items={categorias}
          labelKey="categoria"
          icon="💸"
        />
      </div>
    </div>
  )
}
