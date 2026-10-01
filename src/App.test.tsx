import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
vi.mock('./services', () => ({
  marketData: { getAsset: vi.fn(() => new Promise(() => {})) },
}))
import App from './App'
beforeEach(() => {
  window.location.hash = '/'
})
describe('Navegação do RadarB3', () => {
  it('navega pelas quatro seções e preserva a origem ausente', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'O mercado',
    )
    for (const title of ['Ações', 'FIIs', 'Rankings', 'Screener']) {
      await user.click(screen.getByRole('link', { name: title }))
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(title)
      expect(
        screen.getByText('Dados indisponíveis por enquanto'),
      ).toBeInTheDocument()
      expect(screen.getByText(/Fonte e atualização/)).toBeInTheDocument()
      expect(document.title).toBe(`${title} | RadarB3`)
      expect(screen.getByRole('link', { name: title })).toHaveAttribute(
        'aria-current',
        'page',
      )
    }
  })
  it('abre o ativo sem inventar métricas', () => {
    window.location.hash = '/ativo/PETR4'
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('PETR4')
    expect(screen.getByText('Consultando cotação')).toBeInTheDocument()
  })
  it.each(['/rota-inexistente', '/ativo/%3Cscript%3E'])(
    'trata endereço inválido: %s',
    (path) => {
      window.location.hash = path
      render(<App />)
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        /Página não encontrada|Confira o ticker/,
      )
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    },
  )
})
