import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import fixture from '../test/fixtures/brapi-petr4.json'
import { normalizeBrapi } from '../services/brapi'
import { marketData } from '../services'
import { DataError } from '../services/domain'
import { QuotePreview } from './QuotePreview'
vi.mock('../services', () => ({ marketData: { getAsset: vi.fn() } }))
beforeEach(() => vi.mocked(marketData.getAsset).mockReset())
it('mostra dados, origem e dois horários distintos', async () => {
  vi.mocked(marketData.getAsset).mockResolvedValue(
    normalizeBrapi(fixture, 'PETR4', '2026-10-01T21:00:56Z'),
  )
  render(<QuotePreview ticker="PETR4" />)
  expect(screen.getByText('Consultando cotação')).toBeInTheDocument()
  await screen.findByText(/49,77/)
  expect(screen.getByText(/Horário da cotação/)).toHaveTextContent('17:59:30')
  expect(screen.getByText(/Consultado em/)).toHaveTextContent('18:00:56')
  expect(screen.getByText(/Atraso: não informado/)).toBeInTheDocument()
})
it('mostra vazio explicitamente', async () => {
  vi.mocked(marketData.getAsset).mockResolvedValue(null)
  render(<QuotePreview ticker="PETR4" />)
  await screen.findByText('Nenhum dado retornado')
})
it('ignora resposta antiga ao trocar ticker', async () => {
  let finish: (value: null) => void = () => {}
  vi.mocked(marketData.getAsset)
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve
        }),
    )
    .mockRejectedValueOnce(new DataError('unsupported'))
  const view = render(<QuotePreview ticker="PETR4" />)
  view.rerender(<QuotePreview ticker="HGLG11" />)
  await screen.findByText(/Este ativo não está disponível/)
  finish(null)
  await waitFor(() =>
    expect(screen.queryByText('Nenhum dado retornado')).not.toBeInTheDocument(),
  )
})
