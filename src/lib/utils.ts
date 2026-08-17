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
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date
  return d.toLocaleDateString('pt-BR')
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
