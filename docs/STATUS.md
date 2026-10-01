# RadarB3 — Status vivo

Última atualização: 2026-10-01
Fase ativa: **Fase 2 — Camada de dados (pronta para iniciar)**
Estado geral: **FASE 1 CONCLUÍDA — SITE PUBLICADO E VALIDADO**

## Último commit registrado

- Baseline recebida: `3974004` — `docs(status): record phase 0 baseline`.
- Último commit de implementação: `bc23003` — `feat(web): bootstrap Vite React app and routes`.
- Este registro documental: `docs(status): complete phase 1 after Pages validation`.

## Progresso global

- [x] Fase 0 — Bootstrap e governança
- [x] Fase 1 — Frontend + GitHub Pages
- [ ] Fase 2 — Camada de dados
- [ ] Fase 3 — Ações e FIIs
- [ ] Fase 4 — Página individual
- [ ] Fase 5 — Rankings
- [ ] Fase 6 — Screener
- [ ] Fase 7 — Railway/PostgreSQL
- [ ] Fase 8 — Release MVP

## Alterado neste commit

- [x] Inicializar Vite + React + TypeScript.
- [x] Configurar Tailwind v4 pelo plugin Vite.
- [x] Configurar React Router com HashRouter.
- [x] Configurar ESLint, Vitest e formatter Prettier.
- [x] Criar layout responsivo, navegação, foco/título por rota e estado indisponível compartilhado.
- [x] Criar `/`, `/acoes`, `/fiis`, `/rankings`, `/screener`, `/ativo/:ticker` e fallback 404.
- [x] Configurar base `/radarB3/`.
- [x] Criar GitHub Actions para validar e publicar Pages.
- [x] Publicar.
- [x] Validar URL pública.

Nenhuma fonte de dados está conectada. Sem métricas financeiras inventadas, segredos, scraping ou infraestrutura paga. Decisão de navegação: hash para recarga estática sem 404; detalhes no HANDOFF. Identidade e componentes compartilhados documentados em DESIGN.md e UX-CONTRACT.md.

## Testes e validações executados

- `npm run lint`: passou.
- `npm test`: 4 testes passaram (navegação, metadados ausentes, ativo, endereços inválidos).
- `npm run build`: passou; JS ~84.6 kB gzip e CSS ~3.1 kB gzip.
- Auditoria estática premium strict: zero findings.
- Lint de DESIGN.md: zero erros.
- `npm ci`: instalação limpa passou.
- `npm run format:check` e `npm run typecheck`: passaram.
- `npm run test:e2e`: 2 testes passaram; seis rotas e 404, acesso direto/recarga, 390px/1280px, sem overflow ou erros JS; axe sem violações automatizadas.
- Capturas de tela de Ações inspecionadas.
- Download do Chromium 134 completado pelo mirror Microsoft oficial.

## Validações no GitHub Actions

Execução: https://github.com/luandev93/radarB3/actions/runs/36914250896 — tentativa 2: **success**.

- Guard de STATUS: **success**.
- Job build: **success** — npm ci, format:check, lint, Vitest, build, Playwright e upload do artefato Pages.
- Job deploy: **success** após habilitação de Pages pelo usuário e reexecução pelo conector.
- URL publicada: https://luandev93.github.io/radarB3/ — **HTTP 200**.
- Navegador público: home, Ações, FIIs, Rankings, Screener e PETR4 abriram; recarga das seis rotas preservou a página.
- Responsividade 390px/1280px e acessibilidade automatizada validadas localmente e no job build.
- Validação pública usou navegador de sessão; Chromium local teve falha de transporte/certificado no proxy e não foi usado como evidência de validação pública. Nenhuma validação TLS foi desabilitada.

## Bloqueios atuais

Nenhum bloqueio para iniciar Fase 2. O bloqueio anterior de habilitação administrativa do Pages foi resolvido. Não há integração com fonte de dados ainda; métricas, fonte e atualização continuam explicitamente indisponíveis.

## Próximo passo exato

Iniciar Fase 2 pelo primeiro item pendente: criar `src/services` e tipos de domínio de Asset, Quote, Fundamentals, Dividend e PricePoint conforme MVP_PLAN. Definir campos nulos e metadados de fonte/atualização antes do adaptador. Verificar os limites e endpoints reais do free tier brapi antes de integrar; não expor tokens em VITE_* nem provisionar Railway nesta etapa sem necessidade comprovada.
