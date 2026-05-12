import type { Page } from '@playwright/test';

import { deliverData } from '../data/deliver';

export async function mockValidCep(page: Page): Promise<void> {
  await page.route(
    `https://viacep.com.br/ws/${deliverData.address.postalCode}/json/`,
    async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          cep: '04534-011',
          logradouro: deliverData.address.street,
          bairro: deliverData.address.district,
          localidade: 'Sao Paulo',
          uf: 'SP',
        }),
      });
    },
  );
}

export async function mockInvalidCep(page: Page, postalCode: string): Promise<void> {
  await page.route(`https://viacep.com.br/ws/${postalCode}/json/`, async (route) => {
    await route.abort();
  });
}
