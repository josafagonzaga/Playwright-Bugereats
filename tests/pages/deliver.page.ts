import { expect, type Locator, type Page } from '@playwright/test';
import path from 'node:path';

import type { deliverData } from '../data/deliver';

type DeliverData = typeof deliverData;

export class DeliverPage {
  readonly logo: Locator;
  readonly backHomeLink: Locator;
  readonly heading: Locator;
  readonly dataSectionTitle: Locator;
  readonly addressSectionTitle: Locator;
  readonly deliveryMethodSectionTitle: Locator;
  readonly fullNameInput: Locator;
  readonly cpfInput: Locator;
  readonly emailInput: Locator;
  readonly whatsappInput: Locator;
  readonly postalCodeInput: Locator;
  readonly searchCepButton: Locator;
  readonly addressInput: Locator;
  readonly addressNumberInput: Locator;
  readonly addressDetailsInput: Locator;
  readonly districtInput: Locator;
  readonly cityUfInput: Locator;
  readonly cnhFileInput: Locator;
  readonly cnhPreviewImage: Locator;
  readonly cnhUploadText: Locator;
  readonly warningText: Locator;
  readonly submitButton: Locator;
  readonly successTitle: Locator;
  readonly successMessage: Locator;
  readonly closeSuccessModalButton: Locator;

  constructor(private readonly page: Page) {
    this.logo = page.getByRole('img', { name: 'Buger Eats' });
    this.backHomeLink = page.getByRole('link', { name: /Voltar para home/i });
    this.heading = page.getByRole('heading', { name: /cadastre-se para/i });
    this.dataSectionTitle = page.getByRole('heading', { name: 'Dados' });
    this.addressSectionTitle = page.getByRole('heading', { name: 'Endereço' });
    this.deliveryMethodSectionTitle = page.getByRole('heading', { name: 'Método de entrega' });
    this.fullNameInput = page.locator('input[name="fullName"]');
    this.cpfInput = page.locator('input[name="cpf"]');
    this.emailInput = page.locator('input[name="email"]');
    this.whatsappInput = page.locator('input[name="whatsapp"]');
    this.postalCodeInput = page.getByPlaceholder('CEP');
    this.searchCepButton = page.getByRole('button', { name: 'Buscar CEP' });
    this.addressInput = page.locator('input[name="address"]');
    this.addressNumberInput = page.locator('input[name="address-number"]');
    this.addressDetailsInput = page.locator('input[name="address-details"]');
    this.districtInput = page.locator('input[name="district"]');
    this.cityUfInput = page.locator('input[name="city-uf"]');
    this.cnhFileInput = page.locator('input[type="file"]');
    this.cnhPreviewImage = page.getByRole('img', { name: 'Deliver thumbnail' });
    this.cnhUploadText = page.getByText('Foto da sua CNH');
    this.warningText = page.getByText(/CNH é obrigatória somente para veículos motorizados/i);
    this.submitButton = page.getByRole('button', { name: 'Cadastre-se para fazer entregas' });
    this.successTitle = page.getByRole('heading', { name: /Sim/ });
    this.successMessage = page.getByText(/Recebemos os seus dados/i);
    this.closeSuccessModalButton = page.getByRole('button', { name: 'Fechar' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/deliver');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/deliver$/);
    await expect(this.logo).toBeVisible();
    await expect(this.backHomeLink).toBeVisible();
    await expect(this.heading).toBeVisible();
  }

  async expectInitialFormVisible(): Promise<void> {
    await expect(this.dataSectionTitle).toBeVisible();
    await expect(this.fullNameInput).toBeVisible();
    await expect(this.cpfInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.whatsappInput).toBeVisible();

    await expect(this.addressSectionTitle).toBeVisible();
    await expect(this.postalCodeInput).toBeVisible();
    await expect(this.searchCepButton).toBeVisible();
    await expect(this.addressInput).toBeVisible();
    await expect(this.addressNumberInput).toBeVisible();
    await expect(this.addressDetailsInput).toBeVisible();
    await expect(this.districtInput).toBeVisible();
    await expect(this.cityUfInput).toBeVisible();

    await expect(this.deliveryMethodSectionTitle).toBeVisible();
    await expect(this.page.locator('li', { hasText: 'Moto' })).toBeVisible();
    await expect(this.page.locator('li', { hasText: 'Bike Elétrica' })).toBeVisible();
    await expect(this.page.locator('li', { hasText: 'Van/Carro' })).toBeVisible();
    await expect(this.cnhUploadText).toBeVisible();
    await expect(this.warningText).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async fillDriverData(driver: DeliverData['driver']): Promise<void> {
    await this.fullNameInput.fill(driver.fullName);
    await this.cpfInput.fill(driver.cpf);
    await this.emailInput.fill(driver.email);
    await this.whatsappInput.fill(driver.whatsapp);
  }

  async fillRequiredValidData(data: DeliverData): Promise<void> {
    await this.fillDriverData(data.driver);
    await this.fillAddress(data.address);
    await this.selectDeliveryMethod(data.deliveryMethod);
    await this.uploadCnh(data.cnhFile);
  }

  async fillAddress(address: DeliverData['address']): Promise<void> {
    await this.postalCodeInput.fill(address.postalCode);
    await this.searchCepButton.click();

    await expect(this.addressInput).toHaveValue(address.street);
    await expect(this.districtInput).toHaveValue(address.district);
    await expect(this.cityUfInput).toHaveValue(address.cityUf);

    await this.addressNumberInput.fill(address.number);
  }

  async selectDeliveryMethod(method: string): Promise<void> {
    await this.deliveryMethodOption(method).click();
  }

  async uploadCnh(filePath: string): Promise<void> {
    await this.cnhFileInput.setInputFiles(path.resolve(filePath));
  }

  async expectCnhPreviewVisible(): Promise<void> {
    await expect(this.cnhPreviewImage).toBeVisible();
  }

  deliveryMethodOption(method: string): Locator {
    return this.page.locator('li', { hasText: method });
  }

  async expectDeliveryMethodSelected(method: string): Promise<void> {
    await expect(this.deliveryMethodOption(method)).toHaveClass(/selected/);
  }

  async expectDeliveryMethodNotSelected(method: string): Promise<void> {
    await expect(this.deliveryMethodOption(method)).not.toHaveClass(/selected/);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async expectAlert(message: string | RegExp): Promise<void> {
    await expect(this.page.getByText(message)).toBeVisible();
  }

  async expectSuccessModal(): Promise<void> {
    await expect(this.successTitle).toBeVisible();
    await expect(this.successMessage).toBeVisible();
  }

  async closeSuccessModal(): Promise<void> {
    await this.closeSuccessModalButton.click();
  }
}
