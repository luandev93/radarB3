export const SANDBOX_TICKERS = ['PETR4', 'VALE3', 'ITUB4', 'MGLU3'] as const
function duration(value: unknown, fallback: number, min: number, max: number) {
  const n = Number(value)
  return Number.isFinite(n) && n >= min && n <= max ? n : fallback
}
// All VITE_* settings are public. No credential or arbitrary provider URL is accepted.
export const dataConfig = Object.freeze({
  endpoint: 'https://brapi.dev/api/v2/stocks/quote',
  timeoutMs: duration(import.meta.env.VITE_DATA_TIMEOUT_MS, 10000, 1000, 30000),
  cacheMs: duration(import.meta.env.VITE_DATA_CACHE_MS, 300000, 60000, 3600000),
})
