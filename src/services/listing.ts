import type { AssetSnapshot, DataError } from './domain'
import { SANDBOX_TICKERS } from './config'
export const assetCoverage = {
  STOCK: SANDBOX_TICKERS as readonly string[],
  FII: [] as readonly string[],
}
export type AssetRow = {
  ticker: string
  status: 'loading' | 'ready' | 'empty' | 'error'
  data: AssetSnapshot | null
  error: DataError | null
}
export type SortKey =
  | 'ticker'
  | 'name'
  | 'price'
  | 'change'
  | 'dy'
  | 'pe'
  | 'pb'
  | 'roe'
  | 'volume'
  | 'updated'
export type QuickFilter = 'all' | 'positive' | 'negative' | 'quoted'
export const sortLabels: Record<SortKey, string> = {
  ticker: 'Ticker',
  name: 'Nome',
  price: 'Preço (BRL)',
  change: 'Variação (%)',
  dy: 'DY (%)',
  pe: 'P/L',
  pb: 'P/VP',
  roe: 'ROE (%)',
  volume: 'Volume (ações)',
  updated: 'Atualização',
}
function value(row: AssetRow, key: SortKey): string | number | null {
  const d = row.data
  if (key === 'ticker') return row.ticker
  if (!d) return null
  switch (key) {
    case 'name':
      return d.asset.name
    case 'price':
      return d.asset.currency === 'BRL' ? d.quote.price : null
    case 'change':
      return d.quote.changePercent
    case 'dy':
      return d.fundamentals.dividendYield
    case 'pe':
      return d.fundamentals.pe
    case 'pb':
      return d.fundamentals.pb
    case 'roe':
      return d.fundamentals.roe
    case 'volume':
      return d.quote.volume
    case 'updated':
      return d.quote.updatedAt === null ? null : Date.parse(d.quote.updatedAt)
  }
}
const normalizeSearch = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim()
export function selectRows(
  rows: AssetRow[],
  query: string,
  filter: QuickFilter,
  sort: SortKey,
  direction: 'asc' | 'desc',
) {
  const q = normalizeSearch(query)
  return rows
    .filter((row) => {
      if (
        !normalizeSearch(
          `${row.ticker} ${row.data?.asset.name ?? ''}`,
        ).includes(q)
      )
        return false
      const change = row.data?.quote.changePercent ?? null
      if (filter === 'positive') return change !== null && change > 0
      if (filter === 'negative') return change !== null && change < 0
      if (filter === 'quoted') return value(row, 'price') !== null
      return true
    })
    .sort((a, b) => {
      const x = value(a, sort),
        y = value(b, sort)
      // Missing values are always last, independently of direction.
      if (x === null && y !== null) return 1
      if (y === null && x !== null) return -1
      const compared =
        x === null || y === null
          ? 0
          : typeof x === 'number' && typeof y === 'number'
            ? x - y
            : String(x).localeCompare(String(y), 'pt-BR')
      return compared === 0
        ? a.ticker.localeCompare(b.ticker, 'pt-BR')
        : direction === 'asc'
          ? compared
          : -compared
    })
}
