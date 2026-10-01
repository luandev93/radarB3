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
    await page.route('https://brapi.dev/api/v2/stocks/quote?*', (route) =>
      route.fulfill({ json: fixture }),
    )
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
