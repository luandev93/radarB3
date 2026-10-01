import { DataError } from './domain'
import type { AssetSnapshot, MarketDataProvider } from './domain'
import { dataConfig, SANDBOX_TICKERS } from './config'
import { finiteNumber, record, text, timestamp } from './normalize'

export function normalizeBrapi(
  payload: unknown,
  ticker: string,
  retrievedAt: string,
): AssetSnapshot | null {
  const root = record(payload)
  if (!root || !Array.isArray(root.results))
    throw new DataError('invalid-response')
  if (root.results.length === 0) return null
  const entry = root.results
    .map(record)
    .find((item) => item?.requestedSymbol === ticker)
  if (!entry || entry.symbol !== ticker) throw new DataError('invalid-response')
  const d = record(entry.data)
  if (!d) throw new DataError('invalid-response')
  const n = (key: string) => finiteNumber(d[key])
  const nonnegative = (key: string) => {
    const value = n(key)
    return value !== null && value >= 0 ? value : null
  }
  return {
    asset: {
      ticker,
      name: text(d.longName) ?? text(d.shortName),
      type: 'STOCK',
      sector: null,
      subsector: null,
      currency: text(d.currency),
      logoUrl: null,
    },
    quote: {
      ticker,
      price: nonnegative('regularMarketPrice'),
      changePercent: n('regularMarketChangePercent'),
      volume: nonnegative('regularMarketVolume'),
      marketCap: nonnegative('marketCap'),
      dayHigh: nonnegative('regularMarketDayHigh'),
      dayLow: nonnegative('regularMarketDayLow'),
      fiftyTwoWeekHigh: nonnegative('fiftyTwoWeekHigh'),
      fiftyTwoWeekLow: nonnegative('fiftyTwoWeekLow'),
      source: 'brapi — sandbox sem token',
      updatedAt: timestamp(d.regularMarketTime),
      delayMinutes: null,
    },
    fundamentals: {
      ticker,
      pe: null,
      pb: null,
      dividendYield: null,
      roe: null,
      roic: null,
      netMargin: null,
      netDebtToEbitda: null,
      eps: null,
      bookValuePerShare: null,
      source: 'brapi — não solicitado',
      updatedAt: null,
    },
    dividends: null,
    prices: null,
    retrievedAt,
  }
}
export function createBrapiProvider(
  fetcher: typeof fetch = fetch,
  now: () => number = Date.now,
): MarketDataProvider {
  const cache = new Map<
    string,
    { expires: number; data: AssetSnapshot | null }
  >()
  const pending = new Map<string, Promise<AssetSnapshot | null>>()
  let cooldownUntil = 0
  let queue: Promise<unknown> = Promise.resolve()
  return {
    getAsset(ticker) {
      if (!(SANDBOX_TICKERS as readonly string[]).includes(ticker))
        return Promise.reject(new DataError('unsupported'))
      const cached = cache.get(ticker)
      if (cached && cached.expires > now()) return Promise.resolve(cached.data)
      const existing = pending.get(ticker)
      if (existing) return existing
      if (now() < cooldownUntil)
        return Promise.reject(
          new DataError(
            'rate-limit',
            Math.ceil((cooldownUntil - now()) / 1000),
          ),
        )
      const task = queue.then(async () => {
        if (now() < cooldownUntil)
          throw new DataError(
            'rate-limit',
            Math.ceil((cooldownUntil - now()) / 1000),
          )
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), dataConfig.timeoutMs)
        try {
          const url = new URL(dataConfig.endpoint)
          url.searchParams.set('symbols', ticker)
          const response = await fetcher(url, {
            signal: controller.signal,
            credentials: 'omit',
          })
          if (response.status === 429) {
            const raw = response.headers.get('Retry-After')
            const secs =
              finiteNumber(raw) ??
              (raw ? Math.ceil((Date.parse(raw) - now()) / 1000) : null)
            const retry = Math.max(
              1,
              secs !== null && Number.isFinite(secs) ? secs : 60,
            )
            cooldownUntil = now() + retry * 1000
            throw new DataError('rate-limit', retry)
          }
          if ([401, 403].includes(response.status)) throw new DataError('auth')
          if (response.status === 404) {
            cache.set(ticker, {
              data: null,
              expires: now() + dataConfig.cacheMs,
            })
            return null
          }
          if (!response.ok) throw new DataError('server')
          let payload: unknown
          try {
            payload = await response.json()
          } catch {
            throw new DataError(
              controller.signal.aborted ? 'timeout' : 'invalid-response',
            )
          }
          const data = normalizeBrapi(
            payload,
            ticker,
            new Date(now()).toISOString(),
          )
          cache.set(ticker, { data, expires: now() + dataConfig.cacheMs })
          return data
        } catch (error) {
          if (error instanceof DataError) throw error
          throw new DataError(controller.signal.aborted ? 'timeout' : 'network')
        } finally {
          clearTimeout(timer)
        }
      })
      queue = task.catch(() => {})
      pending.set(ticker, task)
      void task.finally(() => pending.delete(ticker)).catch(() => {})
      return task
    },
  }
}
