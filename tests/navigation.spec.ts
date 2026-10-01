import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { readFileSync } from 'node:fs'
const fixture = JSON.parse(
  readFileSync(
    new URL('../src/test/fixtures/brapi-petr4.json', import.meta.url),
    'utf8',
  ),
)
for (const width of [390, 1280]) {
  test(`rotas, reload e acessibilidade em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    await page.route('https://brapi.dev/api/v2/stocks/quote?*', (route) => {
      const ticker = new URL(route.request().url()).searchParams.get('symbols')!
      const body = structuredClone(fixture)
      body.results[0].requestedSymbol = ticker
      body.results[0].symbol = ticker
      return route.fulfill({ json: body })
    })
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    for (const [path, heading] of [
      ['/', 'O mercado'],
      ['/acoes', 'Ações'],
      ['/fiis', 'FIIs'],
      ['/rankings', 'Rankings'],
      ['/screener', 'Screener'],
      ['/ativo/PETR4', 'PETR4'],
      ['/inexistente', 'Página não encontrada'],
    ]) {
      await page.goto(`/radarB3/#${path}`)
      await expect(page.locator('h1')).toContainText(heading)
      await page.reload()
      await expect(page.locator('h1')).toContainText(heading)
      if (path === '/acoes')
        await expect(
          page.getByText('0 consultas pendentes', { exact: false }),
        ).toHaveCount(0)
      if (path === '/acoes')
        await expect(page.getByText('R$ 49,77', { exact: true })).toHaveCount(4)
      if (path === '/ativo/PETR4') {
        await expect(page.getByText('R$ 49,77', { exact: true })).toBeVisible()
        await page.screenshot({
          path: `test-results/ativo-${width}.png`,
          fullPage: true,
        })
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true)
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
            .analyze()
        ).violations,
      ).toEqual([])
    }
    await page
      .getByRole('navigation')
      .getByRole('link', { name: 'Ações', exact: true })
      .click()
    await expect(page).toHaveURL(/#\/acoes$/)
    await expect(page.getByText('R$ 49,77', { exact: true })).toHaveCount(4)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.keyboard.press('Tab')
    await page.screenshot({
      path: `test-results/acoes-${width}.png`,
      fullPage: true,
    })
    expect(errors).toEqual([])
  })
}

test('falha da fonte, nova tentativa, vazio e cobertura limitada', async ({
  page,
}) => {
  let calls = 0
  await page.route('https://brapi.dev/api/v2/stocks/quote?*', (route) => {
    calls++
    return calls === 1
      ? route.fulfill({ status: 503, body: '{}' })
      : route.fulfill({ json: fixture })
  })
  await page.goto('/radarB3/#/ativo/PETR4')
  await expect(
    page.getByText(
      'A fonte está indisponível no momento. Tente novamente mais tarde.',
    ),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Tentar novamente' }).click()
  await expect(page.getByText('R$ 49,77', { exact: true })).toBeVisible()
  await page.unroute('https://brapi.dev/api/v2/stocks/quote?*')
  await page.route('https://brapi.dev/api/v2/stocks/quote?*', (route) =>
    route.fulfill({ json: { results: [] } }),
  )
  await page.goto('/radarB3/#/ativo/VALE3')
  await expect(
    page.getByRole('heading', { name: 'Nenhum dado retornado' }),
  ).toBeVisible()
  await page.goto('/radarB3/#/ativo/HGLG11')
  await expect(
    page.getByText('Este ativo não está disponível no acesso sem token.', {
      exact: false,
    }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Tentar novamente' }),
  ).toHaveCount(0)
})

for (const width of [390, 1280]) {
  test(`lista: busca, filtros, ordenação, URL e teclado em ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 })
    await page.route('https://brapi.dev/api/v2/stocks/quote?*', (route) => {
      const ticker = new URL(route.request().url()).searchParams.get('symbols')!
      const body = structuredClone(fixture)
      body.results[0].requestedSymbol = ticker
      body.results[0].symbol = ticker
      body.results[0].data.regularMarketChangePercent =
        ticker === 'VALE3' ? -2 : 1
      return route.fulfill({ json: body })
    })
    await page.goto('/radarB3/#/acoes')
    await expect(page.getByText('R$ 49,77', { exact: true })).toHaveCount(4)
    const input = page.getByRole('searchbox')
    await input.fill('petroleo')
    await expect(page).toHaveURL(/q=petroleo/)
    await expect(page.getByText('R$ 49,77', { exact: true })).toHaveCount(4)
    await input.fill('vale')
    await expect(page.locator('tbody tr')).toHaveCount(1)
    await page.reload()
    await expect(input).toHaveValue('vale')
    await page
      .getByRole('button', { name: 'Limpar busca', exact: true })
      .click()
    await expect(input).toBeFocused()
    await page
      .getByRole('button', { name: 'Variação negativa', exact: true })
      .click()
    await expect(page.locator('tbody tr')).toHaveCount(1)
    await expect(
      page.getByRole('link', { name: 'VALE3 ↗', exact: true }),
    ).toBeVisible()
    await page.getByRole('button', { name: 'Todas', exact: true }).click()
    const sort = page.getByRole('button', {
      name: 'Ordenar por Variação (%)',
      exact: true,
    })
    await sort.focus()
    await page.keyboard.press('Enter')
    await expect(page.locator('tbody tr').first()).toContainText('VALE3')
    await page.keyboard.press('Enter')
    await expect(page.locator('tbody tr').last()).toContainText('VALE3')
    await input.fill('zzzz')
    await expect(
      page.getByRole('heading', { name: 'Nenhuma ação corresponde à busca' }),
    ).toBeVisible()
    await page.getByRole('button', { name: 'Limpar busca e filtros' }).click()
    await page.getByRole('link', { name: 'PETR4 ↗', exact: true }).click()
    await expect(page.locator('h1')).toHaveText('PETR4')
    await page.goBack()
    await expect(page.getByRole('searchbox')).toHaveValue('')
    await expect(page.locator('th[aria-sort="descending"]')).toContainText(
      'Variação',
    )
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze()
      ).violations,
    ).toEqual([])
  })
}

test('lista preserva resultados parciais, vazio e nova tentativa de erro', async ({
  page,
}) => {
  let failed = true
  await page.route('https://brapi.dev/api/v2/stocks/quote?*', (route) => {
    const ticker = new URL(route.request().url()).searchParams.get('symbols')!
    if (ticker === 'VALE3' && failed)
      return route.fulfill({ status: 503, body: '{}' })
    if (ticker !== 'PETR4') return route.fulfill({ json: { results: [] } })
    return route.fulfill({ json: fixture })
  })
  await page.goto('/radarB3/#/acoes')
  await expect(page.getByText('R$ 49,77', { exact: true })).toBeVisible()
  const retry = page.getByRole('button', { name: 'Tentar novamente VALE3' })
  await expect(retry).toBeVisible()
  failed = false
  await retry.click()
  await expect(retry).toHaveCount(0)
  await expect(
    page.getByText('A fonte não retornou dados para este ativo.', {
      exact: true,
    }),
  ).toHaveCount(3)
  await expect(page.getByText('R$ 49,77', { exact: true })).toBeVisible()
  await page.getByRole('link', { name: 'FIIs', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'FIIs sem cobertura nesta etapa' }),
  ).toBeVisible()
})
