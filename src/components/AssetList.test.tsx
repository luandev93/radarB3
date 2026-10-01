import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AssetList } from './AssetList'
import { marketData } from '../services'
import fixture from '../test/fixtures/brapi-petr4.json'
import { normalizeBrapi } from '../services/brapi'
import { DataError } from '../services/domain'
vi.mock('../services', () => ({ marketData: { getAsset: vi.fn() } }))
beforeEach(() => {
  vi.mocked(marketData.getAsset).mockReset()
})
it('preserva dados prontos quando outra consulta falha e permite retry', async () => {
  const data = normalizeBrapi(fixture, 'PETR4', '2026-10-01T21:00:00Z')!
  vi.mocked(marketData.getAsset).mockImplementation(async (ticker) => {
    if (ticker === 'VALE3') throw new DataError('rate-limit', 60)
    return ticker === 'PETR4' ? data : null
  })
  render(
    <MemoryRouter>
      <AssetList type="STOCK" />
    </MemoryRouter>,
  )
  await screen.findByText('R$ 49,77')
  expect(
    await screen.findByText('Aguarde ao menos 60 segundos.'),
  ).toBeInTheDocument()
  vi.mocked(marketData.getAsset).mockResolvedValue(null)
  await userEvent.click(
    screen.getByRole('button', { name: 'Tentar novamente VALE3' }),
  )
  await waitFor(() =>
    expect(
      screen.queryByRole('button', { name: 'Tentar novamente VALE3' }),
    ).not.toBeInTheDocument(),
  )
  expect(screen.getByText('R$ 49,77')).toBeInTheDocument()
})
it('busca, limpa com foco e lê filtros da URL sem requisitar novamente', async () => {
  vi.mocked(marketData.getAsset).mockResolvedValue(null)
  render(
    <MemoryRouter initialEntries={['/acoes?q=petr4']}>
      <AssetList type="STOCK" />
    </MemoryRouter>,
  )
  const input = screen.getByRole('searchbox')
  expect(input).toHaveValue('petr4')
  expect(
    screen.queryByRole('link', { name: 'VALE3 ↗' }),
  ).not.toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: /^Limpar busca$/ }))
  expect(input).toHaveFocus()
  expect(screen.getByRole('link', { name: 'VALE3 ↗' })).toBeInTheDocument()
  expect(marketData.getAsset).toHaveBeenCalledTimes(4)
})
it('não consulta a API de ações ao abrir FIIs sem cobertura', () => {
  render(
    <MemoryRouter>
      <AssetList type="FII" />
    </MemoryRouter>,
  )
  expect(screen.getByText('FIIs sem cobertura nesta etapa')).toBeInTheDocument()
  expect(marketData.getAsset).not.toHaveBeenCalled()
})
