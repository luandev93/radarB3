import { describe, expect, it, vi } from 'vitest'
import fixture from '../test/fixtures/brapi-petr4.json'
import { createBrapiProvider, normalizeBrapi } from './brapi'
import { finiteNumber, timestamp, formatNumber } from './normalize'
const at = '2026-10-01T21:00:56.000Z'
describe('Contratos de dados', () => {
  it('normaliza dados v2 e conserva ausência e origem', () => {
    const d = normalizeBrapi(fixture, 'PETR4', at)!
    expect(d.quote.price).toBe(49.77)
    expect(d.quote.updatedAt).toBe('2026-10-01T20:59:30.000Z')
    expect(d.retrievedAt).toBe(at)
    expect(d.quote.delayMinutes).toBeNull()
    expect(d.fundamentals.updatedAt).toBeNull()
    expect(d.dividends).toBeNull()
  })
  it('não inventa números a partir de null, boolean ou texto vazio', () => {
    for (const v of [null, undefined, true, '', 'NaN', '1,25', Infinity])
      expect(finiteNumber(v)).toBeNull()
    expect(finiteNumber(0)).toBe(0)
    expect(finiteNumber('-2.5')).toBe(-2.5)
    expect(formatNumber(0, 'percent')).toBe('0%')
  })
  it('não interpreta data local ou horário de requisição como cotação', () => {
    expect(timestamp('2026-10-01')).toBeNull()
    expect(timestamp('não é data')).toBeNull()
    expect(timestamp('2026-02-31T00:00:00Z')).toBeNull()
    const d = normalizeBrapi(
      {
        results: [
          {
            requestedSymbol: 'PETR4',
            symbol: 'PETR4',
            data: { regularMarketPrice: '', regularMarketVolume: -1 },
          },
        ],
        requestedAt: at,
      },
      'PETR4',
      at,
    )!
    expect(d.quote.price).toBeNull()
    expect(d.quote.volume).toBeNull()
    expect(d.quote.updatedAt).toBeNull()
  })
  it('distingue vazio de resposta inválida ou ticker divergente', () => {
    expect(normalizeBrapi({ results: [] }, 'PETR4', at)).toBeNull()
    expect(() => normalizeBrapi({}, 'PETR4', at)).toThrow('invalid-response')
    expect(() => normalizeBrapi(fixture, 'VALE3', at)).toThrow(
      'invalid-response',
    )
  })
  it('cacheia e deduplica sem alterar timestamp da fonte', async () => {
    let clock = Date.parse(at)
    const fetcher = vi.fn(async () => new Response(JSON.stringify(fixture)))
    const provider = createBrapiProvider(fetcher, () => clock)
    const [a, b] = await Promise.all([
      provider.getAsset('PETR4'),
      provider.getAsset('PETR4'),
    ])
    expect(fetcher).toHaveBeenCalledTimes(1)
    expect(a).toBe(b)
    await provider.getAsset('PETR4')
    expect(fetcher).toHaveBeenCalledTimes(1)
    clock += 3600001
    await provider.getAsset('PETR4')
    expect(fetcher).toHaveBeenCalledTimes(2)
  })
  it('não chama a API para ativo fora do sandbox', async () => {
    const fetcher = vi.fn()
    await expect(
      createBrapiProvider(fetcher).getAsset('HGLG11'),
    ).rejects.toMatchObject({ code: 'unsupported' })
    expect(fetcher).not.toHaveBeenCalled()
  })
  it('respeita Retry-After e não repete chamadas no cooldown', async () => {
    const fetcher = vi.fn(
      async () =>
        new Response('', { status: 429, headers: { 'Retry-After': '120' } }),
    )
    const provider = createBrapiProvider(fetcher, () => Date.parse(at))
    await expect(provider.getAsset('PETR4')).rejects.toMatchObject({
      code: 'rate-limit',
      retryAfterSeconds: 120,
    })
    await expect(provider.getAsset('VALE3')).rejects.toMatchObject({
      code: 'rate-limit',
    })
    expect(fetcher).toHaveBeenCalledTimes(1)
  })
  it.each([
    [403, 'auth'],
    [500, 'server'],
  ])('trata HTTP %s', async (status, code) => {
    await expect(
      createBrapiProvider(
        async () => new Response('', { status: Number(status) }),
      ).getAsset('PETR4'),
    ).rejects.toMatchObject({ code })
  })
  it('serializa ativos diferentes e reaproveita a fila após erro', async () => {
    let release!: (response: Response) => void
    const fetcher = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise<Response>((resolve) => {
            release = resolve
          }),
      )
      .mockResolvedValue(new Response('', { status: 404 }))
    const provider = createBrapiProvider(fetcher)
    const first = provider.getAsset('PETR4')
    const second = provider.getAsset('VALE3')
    await vi.waitFor(() => expect(fetcher).toHaveBeenCalledTimes(1))
    release(new Response('', { status: 500 }))
    await expect(first).rejects.toMatchObject({ code: 'server' })
    await expect(second).resolves.toBeNull()
    await expect(provider.getAsset('VALE3')).resolves.toBeNull()
    expect(fetcher).toHaveBeenCalledTimes(2)
  })
  it('encerra consulta por timeout e permite nova tentativa', async () => {
    vi.useFakeTimers()
    try {
      const fetcher = vi
        .fn<typeof fetch>()
        .mockImplementationOnce(
          (_url, options) =>
            new Promise((_resolve, reject) =>
              options?.signal?.addEventListener('abort', () =>
                reject(new Error('abort')),
              ),
            ),
        )
        .mockResolvedValue(new Response(JSON.stringify(fixture)))
      const provider = createBrapiProvider(fetcher)
      const check = expect(provider.getAsset('PETR4')).rejects.toMatchObject({
        code: 'timeout',
      })
      await vi.advanceTimersByTimeAsync(30001)
      await check
      await expect(provider.getAsset('PETR4')).resolves.toMatchObject({
        quote: { price: 49.77 },
      })
    } finally {
      vi.useRealTimers()
    }
  })
  it('trata erro de rede e JSON inválido', async () => {
    await expect(
      createBrapiProvider(async () => {
        throw new Error('connection')
      }).getAsset('PETR4'),
    ).rejects.toMatchObject({ code: 'network' })
    await expect(
      createBrapiProvider(async () => new Response('not json')).getAsset(
        'PETR4',
      ),
    ).rejects.toMatchObject({ code: 'invalid-response' })
  })
})
