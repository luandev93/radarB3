# RadarB3 — Status vivo

Última atualização: 2026-10-01
Fase ativa: **Fase 1 — Bootstrap frontend + GitHub Pages**
Estado geral: **FRONTEND IMPLEMENTADO — VALIDAÇÃO/PUBLICAÇÃO EM CURSO**

## Último commit registrado

- Baseline recebida: `3974004` — `docs(status): record phase 0 baseline`.
- Este commit: `feat(web): bootstrap Vite React app and routes` (SHA registrado após criação para evitar autorreferência).

## Progresso global

- [x] Fase 0 — Bootstrap e governança
- [ ] Fase 1 — Frontend + GitHub Pages
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
- [ ] Publicar.
- [ ] Validar URL pública.

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

## Bloqueios encontrados

O primeiro download do Chromium (Playwright mais recente) devolveu um arquivo inválido neste ambiente. Playwright foi fixado em 1.51.1 para testar com um browser disponível. Habilitação de Pages ainda precisa ser confirmada.

## Próximo passo exato

Concluir a validação de navegador, publicar o commit em main, acompanhar o workflow de Pages e validar a URL https://luandev93.github.io/radarB3/ e todas as rotas públicas. Não iniciar Fase 2 antes desse gate.
