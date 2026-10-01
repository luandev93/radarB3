# RadarB3 — Plano completo do MVP

Data de referência: 2026-10-01

## 1. Objetivo

Construir um site público, rápido e gratuito na fase inicial, capaz de consultar e comparar ações e FIIs da B3 usando dados atuais e fundamentos, com rankings e screener próprios.

O MVP deve provar quatro coisas:

1. conseguimos obter dados suficientes dentro dos free tiers;
2. conseguimos normalizar esses dados de forma confiável;
3. conseguimos apresentar ativos com boa velocidade no GitHub Pages;
4. conseguimos filtrar e ordenar ativos sem depender do Investidor10.

## 2. Restrições do MVP

- Frontend hospedado inicialmente no GitHub Pages.
- Orçamento inicial: zero.
- Não usar scraping do Investidor10 como dependência do produto.
- Não copiar identidade visual, textos ou layout proprietário de terceiros.
- PostgreSQL será Railway quando persistência entrar no escopo.
- Não expor chaves ou tokens no bundle do frontend.
- Se a fonte de dados exigir segredo, CORS especial, cache central ou maior controle, usar API/worker no Railway.
- Dados não devem ser rotulados como tempo real quando houver atraso.
- Ações e FIIs podem compartilhar componentes, mas não devem compartilhar métricas sem sentido econômico.

## 3. Stack

### Frontend

- Vite
- React
- TypeScript
- Tailwind CSS
- React Router
- Vitest
- ESLint
- GitHub Actions
- GitHub Pages

### Dados

- brapi: mercado e indicadores disponíveis no plano gratuito;
- CVM: demonstrações financeiras e dados oficiais, quando aplicável;
- cálculos derivados próprios para métricas históricas.

### Persistência

- PostgreSQL no Railway, ativado na Fase 7.
- Sem ORM obrigatório no MVP; decidir quando o backend for criado.
- Preferir SQL explícito ou uma camada pequena e previsível.

## 4. Arquitetura evolutiva

### Etapa A — site estático

```text
GitHub Pages
   |
React SPA
   |
fonte pública permitida
```

Objetivo: validar navegação, componentes, modelo de dados e experiência.

### Etapa B — backend no Railway

```text
GitHub Pages
   |
React SPA
   |
API RadarB3 / Railway
   |
   +-- brapi
   +-- CVM
```

Objetivo: esconder credenciais, normalizar dados e aplicar cache.

### Etapa C — persistência

```text
GitHub Pages
   |
API Railway
   |
PostgreSQL Railway
   |
workers/sync
   |
brapi + CVM
```

Objetivo: histórico, rankings calculados, cache persistente e independência parcial de chamadas externas.

## 5. Modelo de domínio inicial

### Asset

- ticker
- name
- type: STOCK | FII
- sector
- subsector
- currency
- logoUrl opcional

### Quote

- ticker
- price
- changePercent
- volume
- marketCap
- dayHigh
- dayLow
- fiftyTwoWeekHigh
- fiftyTwoWeekLow
- updatedAt
- source
- delayMinutes quando conhecido

### Fundamentals

- ticker
- pe
- pb
- dividendYield
- roe
- roic
- netMargin
- netDebtToEbitda
- eps
- bookValuePerShare
- updatedAt
- source

### Dividend

- ticker
- kind
- exDate
- paymentDate
- value
- source

### PricePoint

- ticker
- date
- open
- high
- low
- close
- adjustedClose
- volume

## 6. Fases de execução

### Fase 0 — Bootstrap e governança

Objetivo: repositório com contexto suficiente para qualquer nova sessão continuar.

Entregáveis:

- [x] README inicial
- [x] plano do MVP
- [x] STATUS.md
- [x] HANDOFF.md
- [x] workflow para exigir atualização do status em commits de implementação

Critério de saída:

- novo chat consegue identificar stack, escopo, fase atual e próximo passo apenas lendo o repositório.

### Fase 1 — Bootstrap frontend + GitHub Pages

Entregáveis:

- [x] criar projeto Vite React TypeScript
- [x] configurar Tailwind
- [x] configurar ESLint
- [x] configurar Vitest
- [x] configurar React Router
- [x] criar layout base responsivo
- [x] criar navegação principal
- [x] configurar `base` corretamente para `/radarB3/`
- [x] criar workflow de build/deploy GitHub Pages
- [ ] validar deploy público
- [ ] registrar URL publicada em README e STATUS

Rotas:

- /
- /acoes
- /fiis
- /rankings
- /screener
- /ativo/:ticker

Critério de saída:

- deploy no GitHub Pages abre sem erros;
- reload/navegação não quebra;
- build e testes passam.

### Fase 2 — Camada de dados

Entregáveis:

- [ ] criar `src/services`
- [ ] criar tipos de domínio
- [ ] criar adaptador da fonte de dados
- [ ] centralizar configuração por env
- [ ] tratamento de loading/error/empty
- [ ] normalização de números e datas
- [ ] exibir fonte e timestamp
- [ ] criar fixtures para desenvolvimento/testes
- [ ] mapear limites reais do free tier usado

Critério de saída:

- UI não conhece formato bruto da API externa;
- trocar a fonte exige alterar somente adaptadores.

### Fase 3 — Lista de ações e FIIs

Entregáveis:

- [ ] tabela/grid reutilizável
- [ ] busca por ticker/nome
- [ ] ordenação
- [ ] paginação ou virtualização se necessária
- [ ] filtros rápidos
- [ ] skeleton
- [ ] estados de erro
- [ ] separar ações e FIIs

Colunas mínimas:

- ticker
- nome
- preço
- variação
- DY
- P/L
- P/VP
- ROE
- liquidez/volume
- atualização

Critério de saída:

- lista navegável e rápida em desktop e mobile;
- clique abre a página do ativo.

### Fase 4 — Página individual do ativo

Entregáveis:

- [ ] cabeçalho do ativo
- [ ] preço e variação
- [ ] cards de indicadores
- [ ] gráfico de preços
- [ ] histórico de proventos
- [ ] fundamentals
- [ ] origem e atualização dos dados
- [ ] fallback para campos indisponíveis

Indicadores alvo:

- P/L
- P/VP
- DY
- ROE
- ROIC
- margem líquida
- valor de mercado
- liquidez
- dívida líquida/EBITDA quando aplicável

Critério de saída:

- URL `/ativo/PETR4` ou equivalente abre diretamente;
- dados ausentes não quebram a tela.

### Fase 5 — Rankings

Entregáveis:

- [ ] ranking por DY
- [ ] ranking por P/L
- [ ] ranking por P/VP
- [ ] ranking por ROE
- [ ] ranking por ROIC
- [ ] ranking por margem líquida
- [ ] ranking por liquidez
- [ ] ranking por valor de mercado
- [ ] filtros por tipo de ativo

Regras:

- nulos nunca devem aparecer artificialmente como melhores;
- valores negativos precisam de tratamento explícito;
- rankings devem informar critério, unidade, fonte e atualização.

Critério de saída:

- ordenação previsível e testada;
- nenhum ranking implica recomendação.

### Fase 6 — Screener

Entregáveis:

- [ ] filtros combináveis
- [ ] chips/resumo dos filtros ativos
- [ ] reset de filtros
- [ ] estado preservado na URL quando viável
- [ ] quantidade de resultados
- [ ] ordenação independente do filtro

Filtros alvo:

- ações/FIIs
- ticker
- setor
- preço
- DY
- P/L
- P/VP
- ROE
- ROIC
- liquidez

Critério de saída:

- combinações funcionam sem inconsistências;
- filtros podem ser reproduzidos/compartilhados.

### Fase 7 — Railway + PostgreSQL

Ativar apenas quando houver necessidade comprovada.

Entregáveis:

- [ ] projeto/serviço no Railway
- [ ] PostgreSQL
- [ ] API RadarB3
- [ ] migrations
- [ ] cache persistente
- [ ] ingestão periódica
- [ ] histórico
- [ ] healthcheck
- [ ] variáveis de ambiente
- [ ] CORS restrito ao frontend
- [ ] nenhuma credencial no repositório

Schema inicial previsto:

- assets
- quotes
- fundamentals
- dividends
- price_history
- indicator_history
- sync_runs

Critério de saída:

- frontend consome nossa API;
- falha externa temporária não derruba todo o site;
- banco pode ser reconstruído por migrations.

### Fase 8 — Release MVP

Checklist:

- [ ] Lighthouse satisfatório
- [ ] acessibilidade básica
- [ ] responsividade
- [ ] erros tratados
- [ ] URLs funcionais
- [ ] fontes/timestamps visíveis
- [ ] README atualizado
- [ ] STATUS atualizado
- [ ] HANDOFF atualizado
- [ ] testes verdes
- [ ] build verde
- [ ] GitHub Pages verde
- [ ] limites do free tier documentados
- [ ] aviso de caráter informativo
- [ ] tag `v0.1.0`

## 7. Critérios de qualidade

### Dados

- não inventar valores;
- null é preferível a estimativa silenciosa;
- indicar unidade;
- normalizar percentual e moeda;
- guardar timestamp;
- separar valor atual de valor histórico;
- validar fórmulas derivadas com testes.

### UI

- mobile-first;
- carregamento progressivo;
- tabelas legíveis;
- sem excesso de animações;
- sem gráficos decorativos;
- filtros claros;
- comparação rápida entre ativos.

### Performance

- bundle enxuto;
- lazy loading para páginas pesadas;
- cache onde permitido;
- evitar nova chamada por componente para o mesmo recurso;
- limitar gráficos e históricos ao necessário.

## 8. Segurança

- nenhuma chave secreta em `VITE_*`;
- variáveis Vite são públicas;
- segredos ficam exclusivamente no Railway;
- sanitizar parâmetros de ticker;
- limitar endpoints;
- aplicar timeout em chamadas externas;
- não confiar em dados externos sem validação de schema.

## 9. Estratégia de commits

Formato recomendado:

```text
tipo(escopo): descrição curta
```

Exemplos:

- `feat(assets): add stock listing`
- `feat(rankings): add dividend yield ranking`
- `fix(data): handle missing P/VP`
- `docs(status): update phase 2 progress`
- `chore(ci): configure pages deploy`

Regra obrigatória após a Fase 0:

> todo commit que altera código, configuração, dados, workflow ou comportamento do produto também deve incluir atualização de `docs/STATUS.md`.

O GitHub Actions valida essa regra.

## 10. Regra de atualização do STATUS

Em cada commit relevante:

1. atualizar `Último commit registrado`;
2. marcar itens concluídos;
3. registrar o que foi feito;
4. registrar validações executadas;
5. registrar bloqueios;
6. definir exatamente o próximo passo.

Nunca escrever apenas "em andamento" sem indicar o que falta.

## 11. Definição de pronto

Uma tarefa só pode ser marcada como concluída quando:

- implementação existe;
- build passa;
- testes relacionados passam;
- comportamento foi validado;
- documentação/status foram atualizados.

## 12. Ordem obrigatória para nova sessão

1. README.md
2. docs/MVP_PLAN.md
3. docs/STATUS.md
4. docs/HANDOFF.md
5. git log recente
6. continuar do primeiro item PENDENTE da fase ativa
