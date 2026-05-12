# Guia Para Novos Projetos Playwright

Este arquivo serve como guia reutilizavel para criar projetos de automacao E2E com Playwright e TypeScript.

A ideia e usar este guia em etapas. Primeiro validar que o projeto roda, depois evoluir estrutura, qualidade, CI/CD e documentacao.

## Principios

- Nao criar tudo de uma vez.
- Validar cada etapa antes de seguir.
- Usar Playwright com TypeScript.
- Preferir locators estaveis e `expect` do Playwright.
- Evitar sleeps fixos.
- Separar testes, Page Objects, dados e helpers.
- Manter o projeto simples, mas preparado para crescer.
- Tratar este guia como checklist flexivel: solucoes equivalentes sao aceitaveis quando forem mais claras para o projeto.

## Ordem Recomendada

1. Criar a base Playwright.
2. Criar um teste simples para validar o setup.
3. Organizar a estrutura profissional.
4. Criar Page Objects.
5. Automatizar o fluxo principal real.
6. Criar cenarios positivos, negativos e validacoes.
7. Adicionar qualidade com ESLint, Prettier e TypeScript check.
8. Adicionar CI/CD com GitHub Actions.
9. Criar README profissional.
10. Rodar checklist final.
11. Publicar no GitHub.

## Estrutura Recomendada

```text
tests/
  data/        Massas de dados dos testes
  e2e/         Especificacoes E2E
  fixtures/    Arquivos usados nos testes
  pages/       Page Objects
  support/     Helpers, mocks e funcoes auxiliares
```

Variações aceitaveis:

- `tests/specs` no lugar de `tests/e2e`
- `tests/utils` no lugar de `tests/support`
- fixtures customizadas do Playwright quando fizer sentido

## Scripts Recomendados

O projeto deve ter scripts claros no `package.json`.

Obrigatorios:

```json
{
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:ui": "playwright test --ui",
    "report": "playwright show-report",
    "lint": "eslint .",
    "format": "prettier . --write",
    "format:check": "prettier . --check"
  }
}
```

Recomendado:

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "quality": "npm run format:check && npm run lint && npm run typecheck",
    "ci": "npm run quality && npm test"
  }
}
```

O script `quality` e recomendado, mas nao obrigatorio. Tambem e valido rodar `format:check`, `lint`, `typecheck` e `test` como etapas separadas no CI/CD.

O script `ci` e um atalho local para simular as principais validacoes do pipeline antes de fazer push. Ele nao dispara o GitHub Actions remoto. O CI/CD real e disparado pelos eventos configurados no workflow, como `push` ou `pull_request`.

## Prompt 1 - Criar Base Do Projeto

```text
Quero criar um novo projeto de automacao E2E do zero usando Playwright com TypeScript.

Objetivo do projeto:
[descreva aqui o site ou sistema que sera automatizado]

Nome do projeto:
[nome-do-projeto]

Regras:
- Nao crie tudo de uma vez.
- Explique cada etapa antes de executar.
- Configure a base com Playwright e TypeScript.
- Crie um teste simples para validar que o setup funciona.
- Rode o teste no final e corrija se falhar.
```

## Prompt 2 - Organizar Estrutura Profissional

```text
Agora quero organizar a estrutura do projeto Playwright.

Analise a estrutura atual e proponha uma organizacao usando, quando fizer sentido:
- tests/e2e ou tests/specs
- tests/pages para Page Objects
- tests/fixtures para arquivos de teste
- tests/data para massas de dados
- tests/support ou tests/utils para helpers

Depois implemente a estrutura de forma incremental e rode os testes.
```

## Prompt 3 - Criar Primeiro Fluxo Real

```text
Quero criar o primeiro fluxo automatizado real.

Cenario:
[descreva o cenario, por exemplo: cadastro com dados validos]

Regras:
- Identifique os elementos da pagina.
- Crie ou atualize o Page Object.
- Crie o teste.
- Use locators estaveis.
- Use expect do Playwright.
- Evite sleeps fixos.
- Rode o teste no final e corrija se falhar.
```

## Prompt 4 - Refatorar Para Page Objects

```text
Quero refatorar os testes existentes para Page Object Model.

Regras:
- Analise os testes atuais.
- Identifique duplicacoes.
- Crie metodos claros nas pages.
- Evite colocar regra de negocio escondida demais no Page Object.
- Use asserts no Page Object quando forem validacoes reutilizaveis de tela.
- Mantenha os nomes simples e legiveis.
- Rode os testes apos a refatoracao.
```

## Prompt 5 - Criar Mais Cenarios

```text
Quero expandir a cobertura de testes.

Analise os fluxos existentes e sugira novos cenarios separados por prioridade:
- alta
- media
- baixa

Depois implemente primeiro os cenarios de maior valor.

Considere:
- fluxo principal positivo
- campos obrigatorios
- validacoes isoladas
- formatos invalidos
- navegacao
- upload/download, se existir
- chamadas de API ou mocks, se fizer sentido
- regressao visual, se fizer sentido

Rode a spec impactada no final.
```

## Prompt 6 - Adicionar Qualidade

```text
Quero adicionar qualidade ao projeto com ESLint, Prettier e TypeScript check.

Configure:
- ESLint para TypeScript
- plugin/regras adequadas para Playwright, se fizer sentido
- Prettier
- scripts no package.json:
  - lint
  - format
  - format:check
  - typecheck
  - quality, se fizer sentido

Depois rode:
- npm run format:check
- npm run lint
- npm run typecheck ou npx tsc --noEmit

Corrija os problemas encontrados.
```

## Prompt 7 - Adicionar CI/CD

```text
Quero adicionar CI/CD com GitHub Actions para meu projeto Playwright.

Crie o workflow em:

.github/workflows/playwright.yml

O pipeline deve:
- rodar em push para main
- rodar em pull_request para main
- usar ubuntu-latest
- instalar Node.js
- rodar npm ci
- instalar browsers do Playwright
- rodar format:check
- rodar lint
- rodar typecheck
- rodar testes Playwright
- salvar playwright-report como artifact

Pode usar npm run quality se o script existir. Caso contrario, rode as etapas de qualidade separadamente.

Depois explique como o CI/CD funciona e como testar na pratica com um commit pequeno.
```

## Prompt 8 - Criar README Profissional

```text
Quero criar um README profissional para este projeto.

Inclua:
- nome do projeto
- objetivo
- tecnologias usadas
- estrutura de pastas
- cenarios cobertos
- como instalar
- como rodar testes
- como rodar testes headed
- como abrir relatorio
- como rodar qualidade
- explicacao do CI/CD
- badge do GitHub Actions, se ja existir workflow
- proximos passos

Use linguagem clara e profissional, adequada para portfolio.
```

## Prompt 9 - Publicar No GitHub

```text
Quero publicar este projeto no GitHub.

Antes de fazer push:
- verifique git status
- verifique user.name e user.email
- confirme o remote
- confira se ha arquivos sensiveis
- confira .gitignore
- rode format:check
- rode lint
- rode typecheck
- rode os testes
- opcionalmente rode npm run ci, se esse script existir

Depois me guie para criar ou confirmar o repositorio remoto e fazer o push.
```

## Checklist Final

Antes de considerar o projeto pronto:

- A estrutura de pastas esta organizada.
- Os testes usam Page Objects quando ha repeticao ou fluxo reutilizavel.
- Dados de teste estao separados quando fizer sentido.
- Nao ha sleeps fixos desnecessarios.
- `npm run format:check` passa.
- `npm run lint` passa.
- `npm run typecheck` ou `npx tsc --noEmit` passa.
- `npm test` passa.
- `npm run ci` passa, se esse script existir.
- O CI/CD esta configurado.
- O workflow salva relatorio como artifact.
- O README explica instalacao, execucao, cenarios e CI/CD.
- `.gitignore` ignora `node_modules`, reports, resultados e arquivos sensiveis.
- `git status` foi revisado.
- O remote GitHub esta configurado.
- As alteracoes foram commitadas e publicadas.

## Prompt Principal Para Reutilizar

Use este prompt quando estiver comecando um projeto novo:

```text
Quero criar um novo projeto de automacao E2E do zero usando Playwright com TypeScript.

Objetivo do projeto:
[descreva aqui o site ou sistema que sera automatizado]

Nome do projeto:
[nome-do-projeto]

Quero que voce me guie passo a passo.

Nao crie tudo de uma vez. Primeiro crie a base e valide com um teste simples. Depois evolua para estrutura profissional, Page Objects, dados de teste, helpers, qualidade, CI/CD, README e publicacao no GitHub.

Use boas praticas de QA Automation. Explique decisoes importantes, rode validacoes ao final de cada etapa e trate este guia como checklist flexivel quando houver uma solucao equivalente mais clara.
```
