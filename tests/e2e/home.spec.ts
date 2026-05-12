import { expect, test } from '@playwright/test';

import { HomePage } from '../pages/home.page';

test.describe('Home', () => {
  test.describe('Funcional', () => {
    test('deve carregar a pagina inicial do Buger Eats', async ({ page }) => {
      const homePage = new HomePage(page);

      await homePage.goto();

      await homePage.expectLoaded();
    });
  });

  test.describe('Visual', () => {
    test('deve manter o layout visual da pagina inicial', async ({ page }) => {
      const homePage = new HomePage(page);

      await homePage.goto();
      await homePage.expectLoaded();

      await expect(page).toHaveScreenshot('home-page.png', {
        animations: 'disabled',
        fullPage: true,
      });
    });
  });
});
