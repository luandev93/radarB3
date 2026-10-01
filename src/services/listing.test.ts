import { describe, expect, it } from 'vitest'
import fixture from '../test/fixtures/brapi-petr4.json'
import { normalizeBrapi } from './brapi'
import { selectRows } from './listing'
import type { AssetRow } from './listing'
const sample = normalizeBrapi(fixture, 'PETR4', '2026-10-01T21:00:00Z')!
function row(
  ticker: string,
  change: number | null,
  pe: number | null,
): AssetRow {
  return {
    ticker,
    status: 'ready',
    error: null,
    data: {
      ...sample,
      asset: { ...sample.asset, ticker, name: 'Ação de teste' },
      quote: { ...sample.quote, ticker, changePercent: change },
      fundamentals: { ...sample.fundamentals, ticker, pe },
    },
  }
}
describe('Seleção local dos ativos', () => {
  const rows = [
    row('AAAA3', -2, null),
    row('BBBB3', 0, -5),
    row('CCCC3', 3, 0),
    row('DDDD3', null, 4),
  ]
  it('mantém null ao final nas duas direções, preservando zero e negativos', () => {
    expect(
      selectRows(rows, '', 'all', 'pe', 'asc').map((r) => r.ticker),
    ).toEqual(['BBBB3', 'CCCC3', 'DDDD3', 'AAAA3'])
    expect(
      selectRows(rows, '', 'all', 'pe', 'desc').map((r) => r.ticker),
    ).toEqual(['DDDD3', 'CCCC3', 'BBBB3', 'AAAA3'])
    expect(rows[0].ticker).toBe('AAAA3')
  })
  it('busca ticker/nome sem distinguir maiúscula e acento', () => {
    expect(selectRows(rows, 'acao', 'all', 'ticker', 'asc')).toHaveLength(4)
    expect(selectRows(rows, ' bbbb3 ', 'all', 'ticker', 'asc')).toHaveLength(1)
    expect(
      selectRows(rows, 'inexistente', 'all', 'ticker', 'asc'),
    ).toHaveLength(0)
  })
  it('filtra variação com ausência explícita, sem converter zero/null em alta', () => {
    expect(
      selectRows(rows, '', 'positive', 'ticker', 'asc').map((r) => r.ticker),
    ).toEqual(['CCCC3'])
    expect(
      selectRows(rows, '', 'negative', 'ticker', 'asc').map((r) => r.ticker),
    ).toEqual(['AAAA3'])
  })
  it('não considera preço em moeda desconhecida uma cotação BRL', () => {
    const noCurrency = row('EEEE3', 0, 1)
    noCurrency.data!.asset.currency = null
    expect(selectRows([noCurrency], '', 'quoted', 'price', 'asc')).toHaveLength(
      0,
    )
  })
  it('desempata por ticker e ordena o timestamp da fonte', () => {
    const a = row('ZZZZ3', 0, null),
      b = row('AAAA3', 0, null)
    expect(selectRows([a, b], '', 'all', 'pe', 'desc')[0].ticker).toBe('AAAA3')
    a.data!.quote.updatedAt = null
    expect(selectRows([a, b], '', 'all', 'updated', 'desc')[0].ticker).toBe(
      'AAAA3',
    )
  })
})
