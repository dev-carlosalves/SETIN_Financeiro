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

function ProgressBar({ label, atual, meta }: { label: string; atual: number; meta: number }) {
  const pct = meta > 0 ? Math.min(100, (atual / meta) * 100) : 0
  const achieved = pct >= 100

  return (
    <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">{label}</span>
        <div className="text-right">
          <span className={`text-sm font-semibold font-mono ${achieved ? 'text-emerald-400' : 'text-zinc-100'}`}>
            {formatCurrency(atual)}
          </span>
          <span className="text-xs text-zinc-500 font-mono ml-1">/ {formatCurrency(meta)}</span>
        </div>
      </div>
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${achieved ? 'bg-emerald-500' : 'bg-emerald-600/80'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between items-center mt-2 text-xs">
        <span className="text-zinc-500 font-mono font-medium">{pct.toFixed(1)}% atingido</span>
        {achieved ? (
          <span className="text-emerald-400 font-medium">Meta alcançada</span>
        ) : (
          <span className="text-zinc-500">Restam {formatCurrency(meta - atual)}</span>
        )}
      </div>
    </div>
  )
}

export default function ProgressoMetas({ diaria, total }: ProgressoMetasProps) {
  if (!diaria && !total) {
    return (
      <div className="text-center py-6 text-zinc-500 text-xs">
        Nenhuma meta configurada até o momento.{' '}
        <a href="/inserir" className="text-emerald-400 hover:underline font-medium ml-1">
          Configurar metas
        </a>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {diaria && (
        <ProgressBar
          label="Meta Diária (Hoje)"
          atual={diaria.atual}
          meta={diaria.valor}
        />
      )}
      {total && (
        <ProgressBar
          label="Meta Geral do Evento"
          atual={total.atual}
          meta={total.valor}
        />
      )}
    </div>
  )
}
