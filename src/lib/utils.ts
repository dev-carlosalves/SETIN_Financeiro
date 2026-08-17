// Normalizes a name: trim + Title Case
export function normalizeName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

// Format currency in BRL
export function formatCurrency(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(num)
}

// Format date to dd/mm/yyyy
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '—'

  if (typeof date === 'string') {
    const cleanStr = date.trim()
    const match = cleanStr.match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (match) {
      const [, year, month, day] = match
      return `${day}/${month}/${year}`
    }
    const d = new Date(cleanStr)
    if (isNaN(d.getTime())) return '—'
    return d.toLocaleDateString('pt-BR', { timeZone: 'UTC' })
  }

  if (date instanceof Date) {
    if (isNaN(date.getTime())) return '—'
    const day = String(date.getUTCDate()).padStart(2, '0')
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const year = date.getUTCFullYear()
    return `${day}/${month}/${year}`
  }

  return '—'
}

// Get today in YYYY-MM-DD format for input[type=date] default value
export function todayISO(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Converts Prisma Decimal or string to number
export function toNumber(value: unknown): number {
  if (value === null || value === undefined) return 0
  return parseFloat(String(value))
}
