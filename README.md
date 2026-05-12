# Playwright Buger Eats

Projeto de automação E2E para o site [Buger Eats QA](https://buger-eats-qa.vercel.app/), usando Playwright, TypeScript, Page Objects, validações funcionais, regressão visual e pipeline de CI no GitHub Actions.

## Objetivo

Validar os principais fluxos da aplicação Buger Eats, com foco no cadastro de entregadores e na estabilidade visual das telas principais.

## Tecnologias

- Playwright
- TypeScript
- ESLint
- Prettier
- GitHub Actions

## Estrutura

```text
tests/
  data/          Massa de dados dos testes
  e2e/           Especificações E2E
  fixtures/      Arquivos usados nos testes, como upload da CNH
  pages/         Page Objects
  support/       Apoio aos testes, como mocks de API
```

## Cenários Cobertos

### Home

- Carregamento da página inicial
- Validação visual da página inicial

### Cadastro de Entregador

- Validação visual da tela de cadastro
- Navegação de volta para a Home
- Busca de CEP válido preenchendo endereço
- Cadastro com dados válidos
- Campos obrigatórios com formulário vazio
- CPF inválido:
  - números repetidos
  - menos de 11 dígitos
  - mais de 11 dígitos
  - letras
- E-mail inválido
- Whatsapp inválido
- Ausência de CNH
- Ausência de método de entrega
- CEP obrigatório
- CEP inválido
- Seleção de mais de um método de entrega
- Seleção e desmarcação de método de entrega

## Como Executar

Instale as dependências:

```bash
npm ci
```

Instale os browsers do Playwright:

```bash
npx playwright install
```

Execute todos os testes:

```bash
npm test
```

Execute em modo headed:

```bash
npm run test:headed
```

Execute com a interface do Playwright:

```bash
npm run test:ui
```

Abra o relatório HTML:

```bash
npm run report
```

## Qualidade de Código

Executar ESLint:

```bash
npm run lint
```

Verificar formatação:

```bash
npm run format:check
```

Formatar arquivos:

```bash
npm run format
```

Validar TypeScript:

```bash
npx tsc --noEmit
```

## Regressão Visual

O projeto usa snapshots visuais do Playwright para proteger o layout das telas:

- Home
- Cadastro de entregador

Para atualizar snapshots intencionalmente:

```bash
npx playwright test --update-snapshots
```

## CI/CD

O projeto possui pipeline no GitHub Actions em:

```text
.github/workflows/playwright.yml
```

O pipeline roda automaticamente em `push` e `pull_request` para a branch `main`, executando:

```bash
npm ci
npx playwright install --with-deps chromium
npm run format:check
npm run lint
npx tsc --noEmit
npm test
```

## Repositório

```text
https://github.com/josafagonzaga/Playwright-Bugereats
```
