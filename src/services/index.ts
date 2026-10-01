import { createBrapiProvider } from './brapi'
import type { MarketDataProvider } from './domain'
export const marketData: MarketDataProvider = createBrapiProvider()
