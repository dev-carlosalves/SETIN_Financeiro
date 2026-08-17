'use client'

import { formatCurrency } from '@/lib/utils'

interface MetaInfo {
  valor: number
  atual: number
}

interface ProgressoMetasProps {
  diaria: MetaInfo | null
  total: MetaInfo | null
}

function ProgressBar({ label, atual, meta, color }: { label: string; atual: number; meta: number; color: string }) {
  const pct = meta > 0 ? Math.min(100, (atual / meta) * 100) : 0
  const achieved = pct >= 100

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <div className="text-right">
          <span className={`text-sm font-bold ${achieved ? 'text-emerald-400' : color}`}>
            {formatCurrency(atual)}
          </span>
          <span className="text-xs text-gray-500 ml-1">/ {formatCurrency(meta)}</span>
        </div>
      </div>
      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${achieved ? 'bg-emerald-500' : 'bg-indigo-600'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-500">{pct.toFixed(1)}%</span>
        {achieved ? (
          <span className="text-xs text-emerald-400 font-medium">🎉 Meta atingida!</span>
        ) : (
          <span className="text-xs text-gray-500">Faltam {formatCurrency(meta - atual)}</span>
        )}
      </div>
    </div>
  )
}

export default function ProgressoMetas({ diaria, total }: ProgressoMetasProps) {
  if (!diaria && !total) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        Nenhuma meta definida.{' '}
        <a href="/inserir" className="text-indigo-400 hover:underline">
          Definir metas →
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {diaria && (
        <ProgressBar
          label="🎯 Meta do dia"
          atual={diaria.atual}
          meta={diaria.valor}
          color="text-cyan-300"
        />
      )}
      {total && (
        <ProgressBar
          label="🏆 Meta total do evento"
          atual={total.atual}
          meta={total.valor}
          color="text-indigo-300"
        />
      )}
    </div>
  )
}
