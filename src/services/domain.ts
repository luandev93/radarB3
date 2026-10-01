export interface Provenance {
  source: string
  updatedAt: string | null
}
export interface Asset {
  ticker: string
  name: string | null
  type: 'STOCK' | 'FII' | null
  sector: string | null
  subsector: string | null
  currency: string | null
  logoUrl: string | null
}
export interface Quote extends Provenance {
  ticker: string
  price: number | null
  changePercent: number | null
  volume: number | null
  marketCap: number | null
  dayHigh: number | null
  dayLow: number | null
  fiftyTwoWeekHigh: number | null
  fiftyTwoWeekLow: number | null
  delayMinutes: number | null
}
export interface Fundamentals extends Provenance {
  ticker: string
  pe: number | null
  pb: number | null
  dividendYield: number | null
  roe: number | null
  roic: number | null
  netMargin: number | null
  netDebtToEbitda: number | null
  eps: number | null
  bookValuePerShare: number | null
}
export interface Dividend extends Provenance {
  ticker: string
  kind: string | null
  exDate: string | null
  paymentDate: string | null
  value: number | null
}
export interface PricePoint extends Provenance {
  ticker: string
  date: string
  open: number | null
  high: number | null
  low: number | null
  close: number | null
  adjustedClose: number | null
  volume: number | null
}
export interface AssetSnapshot {
  asset: Asset
  quote: Quote
  fundamentals: Fundamentals
  dividends: Dividend[] | null
  prices: PricePoint[] | null
  retrievedAt: string
}
export interface MarketDataProvider {
  getAsset(ticker: string): Promise<AssetSnapshot | null>
}
export type DataErrorCode =
  | 'unsupported'
  | 'network'
  | 'timeout'
  | 'rate-limit'
  | 'auth'
  | 'invalid-response'
  | 'server'
export class DataError extends Error {
  code: DataErrorCode
  retryAfterSeconds: number | null
  constructor(code: DataErrorCode, retryAfterSeconds: number | null = null) {
    super(code)
    this.name = 'DataError'
    this.code = code
    this.retryAfterSeconds = retryAfterSeconds
  }
}
