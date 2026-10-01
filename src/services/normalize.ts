export function record(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}
export function finiteNumber(value: unknown): number | null {
  if (typeof value === 'string' && !/^-?\d+(\.\d+)?$/.test(value.trim()))
    return null
  if (typeof value !== 'number' && typeof value !== 'string') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}
export function text(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}
export function timestamp(value: unknown): string | null {
  if (
    typeof value !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(value)
  )
    return null
  const day = value.slice(0, 10)
  const midnight = Date.parse(day + 'T00:00:00Z')
  if (
    !Number.isFinite(midnight) ||
    new Date(midnight).toISOString().slice(0, 10) !== day
  )
    return null
  const t = Date.parse(value)
  return Number.isFinite(t) ? new Date(t).toISOString() : null
}
export function formatNumber(
  value: number | null,
  unit: 'number' | 'BRL' | 'percent' = 'number',
) {
  if (value === null || !Number.isFinite(value)) return 'Indisponível'
  if (unit === 'BRL')
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  const formatted = new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 2,
  }).format(value)
  return unit === 'percent' ? `${formatted}%` : formatted
}
export function formatTimestamp(value: string | null) {
  return value === null
    ? 'Indisponível'
    : new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'medium',
        timeZone: 'America/Sao_Paulo',
      }).format(new Date(value)) + ' (Brasília)'
}
