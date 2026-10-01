import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
for (const width of [390, 1280]) {
  test(`rotas, reload e acessibilidade em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
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
