# RadarB3

RadarB3 é um screener e painel de análise de ativos da B3, criado para consolidar dados de mercado e fundamentos em uma interface rápida, filtrável e orientada à comparação.

> Status atual: frontend inicial implementado e validado; publicação aguardando habilitação do GitHub Pages. Nenhuma recomendação de investimento é produzida pelo sistema. Os indicadores são informativos e devem exibir fonte e data de atualização.

## Objetivo do MVP

Entregar uma aplicação web pública capaz de:

- listar ações e FIIs;
- pesquisar por ticker;
- abrir uma página individual por ativo;
- mostrar cotação e principais indicadores fundamentalistas;
- exibir histórico de preços e proventos quando disponíveis;
- ordenar e filtrar ativos em rankings;
- disponibilizar um screener básico;
- publicar o frontend gratuitamente no GitHub Pages;
- preparar a camada de dados para PostgreSQL no Railway;
- operar inicialmente dentro dos free tiers.

## Stack definida

### Frontend

- Vite
- React
- TypeScript
- Tailwind CSS
- React Router
- GitHub Pages

### Dados e backend

- brapi como fonte operacional inicial de mercado, respeitando limites do plano gratuito;
- CVM para dados oficiais e demonstrações financeiras quando aplicável;
- PostgreSQL no Railway para persistência quando a fase de banco for ativada;
- backend/worker no Railway apenas quando necessário para esconder credenciais, persistir histórico, normalizar dados ou contornar limites de CORS/rate limit.

## Arquitetura do MVP

```text
Usuário
  |
  v
GitHub Pages
Vite + React + TypeScript
  |
  +--> cache local / dados estáticos
  |
  +--> API pública permitida no navegador (fase inicial)
  |
  v
API/worker Railway (fase seguinte)
  |
  +--> brapi
  +--> CVM
  |
  v
PostgreSQL Railway
```

## Escopo funcional

Rotas previstas:

```text
/
/acoes
/fiis
/rankings
/screener
/ativo/:ticker
```

### Dados mínimos por ativo

- ticker;
- nome;
- tipo do ativo;
- preço;
- variação percentual;
- volume/liquidez quando disponível;
- valor de mercado;
- P/L;
- P/VP;
- Dividend Yield;
- ROE;
- ROIC;
- margem líquida;
- dívida líquida/EBITDA quando aplicável;
- histórico de proventos;
- histórico de preços;
- fonte e horário/data da última atualização.

## Rankings do MVP

O MVP deve permitir ordenar, no mínimo, por:

- Dividend Yield;
- P/L;
- P/VP;
- ROE;
- ROIC;
- margem líquida;
- liquidez/volume;
- valor de mercado.

Rankings não equivalem a recomendação de compra. Valores extraordinários ou não recorrentes devem ser identificados quando houver informação suficiente.

## Screener do MVP

Filtros iniciais:

- tipo: ação / FII;
- ticker;
- faixa de preço;
- DY mínimo e máximo;
- P/L mínimo e máximo;
- P/VP mínimo e máximo;
- ROE mínimo;
- ROIC mínimo;
- liquidez mínima;
- setor, quando disponível.

## Fora do MVP inicial

Não implementar antes do núcleo estar estável:

- carteira do usuário;
- autenticação;
- alertas;
- recomendação automática de compra/venda;
- IA;
- aplicativo mobile;
- execução de ordens;
- conexão direta com market data pago da B3;
- múltiplos microsserviços;
- Redis;
- websocket de cotação;
- ranking proprietário complexo.

## Princípios técnicos

1. Free tier primeiro.
2. Não depender de scraping do Investidor10.
3. Não copiar identidade visual, textos proprietários ou layout pixel a pixel de terceiros.
4. Toda métrica deve ter origem ou fórmula identificável.
5. Diferenciar cotação atrasada de cotação em tempo real.
6. Cachear agressivamente dados que não mudam com frequência.
7. O frontend nunca deve conter segredos.
8. Cada commit relevante deve atualizar `docs/STATUS.md`.
9. Mudanças de arquitetura devem ser registradas no handoff.
10. O projeto deve permanecer implantável após cada etapa concluída.

## Fases

A execução detalhada está em `docs/MVP_PLAN.md`.

Resumo:

- Fase 0 — bootstrap, documentação e governança;
- Fase 1 — frontend e GitHub Pages;
- Fase 2 — camada de dados e contratos;
- Fase 3 — listagem de ações e FIIs;
- Fase 4 — página individual do ativo;
- Fase 5 — rankings;
- Fase 6 — screener;
- Fase 7 — Railway/PostgreSQL e persistência;
- Fase 8 — auditoria, performance e release MVP.

## Regra de continuidade

Antes de começar qualquer sessão de desenvolvimento:

1. ler `README.md`;
2. ler `docs/MVP_PLAN.md`;
3. ler `docs/STATUS.md`;
4. ler `docs/HANDOFF.md`;
5. verificar o commit atual;
6. continuar do próximo item pendente, sem reiniciar o planejamento.

Ao finalizar cada commit, atualizar `docs/STATUS.md` no mesmo commit.

## Repositório

`luandev93/radarB3`

## Licença e aviso

A licença do projeto ainda não foi definida.

O RadarB3 é uma ferramenta de organização e visualização de dados. Informações financeiras podem conter atraso, divergências entre fontes ou eventos não recorrentes. O usuário deve confirmar os dados nas fontes oficiais antes de tomar decisões financeiras.

## Desenvolvimento local

Requer Node.js 24 e npm.

```sh
npm ci
npm run dev
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

O Vite usa `/radarB3/` como base. O React Router usa hash para permitir acesso direto e recarga no GitHub Pages sem regras de servidor. Exemplo: `/radarB3/#/ativo/PETR4`. A integração de dados começa na Fase 2; os valores, fonte e atualização ausentes aparecem explicitamente como indisponíveis.

## Publicação

URL prevista (**ainda não publicada**, bloqueio em docs/STATUS.md): https://luandev93.github.io/radarB3/

O workflow `.github/workflows/pages.yml` executa formatter, ESLint, Vitest, build e testes de navegador antes do deploy. Push em `main` publica via GitHub Actions. PRs só validam. Nas configurações do repositório, Pages deve usar **GitHub Actions** como fonte; o workflow tenta habilitar Pages quando permitido.
