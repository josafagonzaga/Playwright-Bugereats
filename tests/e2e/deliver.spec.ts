import { expect, test } from '@playwright/test';

import { deliverData } from '../data/deliver';
import { DeliverPage } from '../pages/deliver.page';
import { HomePage } from '../pages/home.page';
import { mockInvalidCep, mockValidCep } from '../support/cep-api';

test.describe('Cadastro de entregador', () => {
  test.describe('Visual', () => {
    test('deve manter o layout visual da tela de cadastro', async ({ page }) => {
      const deliverPage = new DeliverPage(page);

      await deliverPage.goto();
      await deliverPage.expectLoaded();
      await deliverPage.expectInitialFormVisible();

      await expect(page).toHaveScreenshot('deliver-page.png', {
        animations: 'disabled',
        fullPage: true,
      });
    });
  });

  test.describe('Funcional', () => {
    test('deve voltar para home pela tela de cadastro', async ({ page }) => {
      const deliverPage = new DeliverPage(page);
      const homePage = new HomePage(page);

      await deliverPage.goto();
      await deliverPage.expectLoaded();
      await deliverPage.backHomeLink.click();

      await expect(page).toHaveURL(/\/$/);
      await homePage.expectLoaded();
    });

    test('deve preencher endereco ao buscar CEP valido', async ({ page }) => {
      const deliverPage = new DeliverPage(page);

      await mockValidCep(page);
      await deliverPage.goto();
      await deliverPage.expectLoaded();
      await deliverPage.postalCodeInput.fill(deliverData.address.postalCode);
      await deliverPage.searchCepButton.click();

      await expect(deliverPage.addressInput).toHaveValue(deliverData.address.street);
      await expect(deliverPage.districtInput).toHaveValue(deliverData.address.district);
      await expect(deliverPage.cityUfInput).toHaveValue(deliverData.address.cityUf);
    });

    test('deve exibir preview ao subir foto da CNH', async ({ page }) => {
      const deliverPage = new DeliverPage(page);

      await deliverPage.goto();
      await deliverPage.expectLoaded();
      await deliverPage.uploadCnh(deliverData.cnhFile);

      await deliverPage.expectCnhPreviewVisible();
    });

    test('deve atualizar preview ao trocar foto da CNH', async ({ page }) => {
      const deliverPage = new DeliverPage(page);

      await deliverPage.goto();
      await deliverPage.expectLoaded();
      await deliverPage.uploadCnh(deliverData.cnhFile);
      await deliverPage.expectCnhPreviewVisible();
      await deliverPage.expectCnhPreviewNaturalWidth(320);

      await deliverPage.uploadCnh(deliverData.replacementCnhFile);

      await deliverPage.expectCnhPreviewVisible();
      await deliverPage.expectCnhPreviewNaturalWidth(480);
    });

    test('deve cadastrar um entregador com dados validos', async ({ page }) => {
      const homePage = new HomePage(page);
      const deliverPage = new DeliverPage(page);

      await mockValidCep(page);

      await homePage.goto();
      await homePage.goToDeliverPage();

      await deliverPage.expectLoaded();

      await deliverPage.fillRequiredValidData(deliverData);
      await deliverPage.submit();

      await deliverPage.expectSuccessModal();

      await deliverPage.closeSuccessModal();
      await expect(page).toHaveURL(/\/$/);
    });

    test('deve cadastrar um entregador sem complemento', async ({ page }) => {
      const deliverPage = new DeliverPage(page);

      await mockValidCep(page);
      await deliverPage.goto();
      await deliverPage.expectLoaded();
      await deliverPage.fillDriverData(deliverData.driver);
      await deliverPage.fillAddress(deliverData.address);
      await deliverPage.selectDeliveryMethod(deliverData.deliveryMethod);
      await deliverPage.uploadCnh(deliverData.cnhFile);
      await deliverPage.submit();

      await deliverPage.expectSuccessModal();
    });
  });

  test.describe('Validacoes', () => {
    test('deve validar campos obrigatorios ao enviar formulario vazio', async ({ page }) => {
      const deliverPage = new DeliverPage(page);

      await deliverPage.goto();
      await deliverPage.expectLoaded();
      await deliverPage.submit();

      await deliverPage.expectAlert('É necessário informar o nome');
      await deliverPage.expectAlert('É necessário informar o CPF');
      await deliverPage.expectAlert('É necessário informar o email');
      await deliverPage.expectAlert('É necessário informar o CEP');
      await deliverPage.expectAlert('É necessário informar o número do endereço');
      await deliverPage.expectAlert('Adicione uma foto da sua CNH');
      await deliverPage.expectAlert('Selecione o método de entrega');
    });

    test('deve validar nome obrigatorio isolado', async ({ page }) => {
      const deliverPage = new DeliverPage(page);

      await mockValidCep(page);
      await deliverPage.goto();
      await deliverPage.expectLoaded();
      await deliverPage.fillRequiredValidData(deliverData);
      await deliverPage.fullNameInput.clear();
      await deliverPage.submit();

      await deliverPage.expectAlert('É necessário informar o nome');
    });

    test('deve validar CPF obrigatorio isolado', async ({ page }) => {
      const deliverPage = new DeliverPage(page);

      await mockValidCep(page);
      await deliverPage.goto();
      await deliverPage.expectLoaded();
      await deliverPage.fillRequiredValidData(deliverData);
      await deliverPage.cpfInput.clear();
      await deliverPage.submit();

      await deliverPage.expectAlert('É necessário informar o CPF');
    });

    test('deve validar email obrigatorio isolado', async ({ page }) => {
      const deliverPage = new DeliverPage(page);

      await mockValidCep(page);
      await deliverPage.goto();
      await deliverPage.expectLoaded();
      await deliverPage.fillRequiredValidData(deliverData);
      await deliverPage.emailInput.clear();
      await deliverPage.submit();

      await deliverPage.expectAlert('É necessário informar o email');
    });

    test('deve validar CEP obrigatorio isolado ao enviar formulario', async ({ page }) => {
      const deliverPage = new DeliverPage(page);

      await mockValidCep(page);
      await deliverPage.goto();
      await deliverPage.expectLoaded();
      await deliverPage.fillRequiredValidData(deliverData);
      await deliverPage.postalCodeInput.clear();
      await deliverPage.submit();

      await deliverPage.expectAlert('É necessário informar o CEP');
    });

    test('deve validar numero do endereco obrigatorio isolado', async ({ page }) => {
      const deliverPage = new DeliverPage(page);

      await mockValidCep(page);
      await deliverPage.goto();
      await deliverPage.expectLoaded();
      await deliverPage.fillRequiredValidData(deliverData);
      await deliverPage.addressNumberInput.clear();
      await deliverPage.submit();

      await deliverPage.expectAlert('É necessário informar o número do endereço');
    });

    const invalidCpfs = [
      { value: '11111111111', scenario: 'com numeros repetidos' },
      { value: '1234567890', scenario: 'com menos de 11 digitos' },
      { value: '123456789012', scenario: 'com mais de 11 digitos' },
      { value: '123abc78909', scenario: 'com letras' },
    ];

    for (const cpf of invalidCpfs) {
      test(`deve validar CPF invalido ${cpf.scenario}`, async ({ page }) => {
        const deliverPage = new DeliverPage(page);

        await mockValidCep(page);
        await deliverPage.goto();
        await deliverPage.expectLoaded();
        await deliverPage.fillRequiredValidData(deliverData);
        await deliverPage.cpfInput.fill(cpf.value);
        await deliverPage.submit();

        await deliverPage.expectAlert('Oops! CPF inválido');
      });
    }

    test('deve validar email invalido', async ({ page }) => {
      const deliverPage = new DeliverPage(page);

      await mockValidCep(page);
      await deliverPage.goto();
      await deliverPage.expectLoaded();
      await deliverPage.fillRequiredValidData(deliverData);
      await deliverPage.emailInput.fill('joao.silva@');
      await deliverPage.submit();

      await deliverPage.expectAlert('Oops! Email com formato inválido.');
    });

    test('deve validar Whatsapp invalido', async ({ page }) => {
      const deliverPage = new DeliverPage(page);

      await mockValidCep(page);
      await deliverPage.goto();
      await deliverPage.expectLoaded();
      await deliverPage.fillRequiredValidData(deliverData);
      await deliverPage.whatsappInput.fill('11999');
      await deliverPage.submit();

      await deliverPage.expectAlert('Oops! Whatsapp com formato incorreto');
    });

    test('deve validar ausencia de CNH', async ({ page }) => {
      const deliverPage = new DeliverPage(page);

      await mockValidCep(page);
      await deliverPage.goto();
      await deliverPage.expectLoaded();
      await deliverPage.fillDriverData(deliverData.driver);
      await deliverPage.fillAddress(deliverData.address);
      await deliverPage.selectDeliveryMethod(deliverData.deliveryMethod);
      await deliverPage.submit();

      await deliverPage.expectAlert('Adicione uma foto da sua CNH');
    });

    test('deve validar ausencia de metodo de entrega', async ({ page }) => {
      const deliverPage = new DeliverPage(page);

      await mockValidCep(page);
      await deliverPage.goto();
      await deliverPage.expectLoaded();
      await deliverPage.fillDriverData(deliverData.driver);
      await deliverPage.fillAddress(deliverData.address);
      await deliverPage.uploadCnh(deliverData.cnhFile);
      await deliverPage.submit();

      await deliverPage.expectAlert('Selecione o método de entrega');
    });

    test('deve validar CEP obrigatorio ao buscar endereco sem preencher o campo', async ({
      page,
    }) => {
      const deliverPage = new DeliverPage(page);

      await deliverPage.goto();
      await deliverPage.expectLoaded();
      await deliverPage.searchCepButton.click();

      await deliverPage.expectAlert('Informe um CEP válido');
    });

    test('deve validar CEP invalido ao buscar endereco', async ({ page }) => {
      const invalidPostalCode = '00000000';
      const deliverPage = new DeliverPage(page);

      await mockInvalidCep(page, invalidPostalCode);
      await deliverPage.goto();
      await deliverPage.expectLoaded();
      await deliverPage.postalCodeInput.fill(invalidPostalCode);
      await deliverPage.searchCepButton.click();

      await deliverPage.expectAlert('Informe um CEP válido');
    });

    test('deve validar selecao de mais de um metodo de entrega', async ({ page }) => {
      const deliverPage = new DeliverPage(page);

      await mockValidCep(page);
      await deliverPage.goto();
      await deliverPage.expectLoaded();
      await deliverPage.fillRequiredValidData(deliverData);
      await deliverPage.selectDeliveryMethod('Bike Elétrica');
      await deliverPage.submit();

      await deliverPage.expectAlert('Oops! Selecione apenas um método de entrega');
    });

    test('deve selecionar e desmarcar metodo de entrega', async ({ page }) => {
      const deliverPage = new DeliverPage(page);

      await deliverPage.goto();
      await deliverPage.expectLoaded();
      await deliverPage.selectDeliveryMethod('Moto');
      await deliverPage.expectDeliveryMethodSelected('Moto');
      await deliverPage.selectDeliveryMethod('Moto');

      await deliverPage.expectDeliveryMethodNotSelected('Moto');
    });

    const deliveryMethods = ['Moto', 'Bike Elétrica', 'Van/Carro'];

    for (const deliveryMethod of deliveryMethods) {
      test(`deve selecionar o metodo de entrega ${deliveryMethod}`, async ({ page }) => {
        const deliverPage = new DeliverPage(page);

        await deliverPage.goto();
        await deliverPage.expectLoaded();
        await deliverPage.selectDeliveryMethod(deliveryMethod);

        await deliverPage.expectDeliveryMethodSelected(deliveryMethod);
      });
    }
  });
});
