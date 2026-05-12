import { expect, type Locator, type Page } from '@playwright/test';

export class HomePage {
  readonly logo: Locator;
  readonly heading: Locator;
  readonly subtitle: Locator;
  readonly signupLink: Locator;

  constructor(private readonly page: Page) {
    this.logo = page.getByRole('img', { name: 'Buger Eats' });
    this.heading = page.getByRole('heading', {
      name: /Seja um parceiro entregador pela Buger Eats/i,
    });
    this.subtitle = page.getByText(/Em vez de oportunidades tradicionais/i);
    this.signupLink = page.getByRole('link', { name: /cadastre-se/i });
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveTitle(/Buger Eats/i);
    await expect(this.logo).toBeVisible();
    await expect(this.heading).toBeVisible();
    await expect(this.subtitle).toBeVisible();
    await expect(this.signupLink).toBeVisible();
  }

  async goToDeliverPage(): Promise<void> {
    await this.signupLink.click();
  }
}
