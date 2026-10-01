# RadarB3 — Status vivo

Última atualização: 2026-10-01
Fase ativa: **Fase 1 — Bootstrap frontend + GitHub Pages**
Estado geral: **FRONTEND VALIDADO — PUBLICAÇÃO BLOQUEADA NA HABILITAÇÃO DO PAGES**

## Último commit registrado

- Baseline recebida: `3974004` — `docs(status): record phase 0 baseline`.
- Último commit de implementação: `bc23003` — `feat(web): bootstrap Vite React app and routes`.
- Este registro documental: `docs(status): record Pages enablement blocker`.

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

## Validações no GitHub Actions

Execução: https://github.com/luandev93/radarB3/actions/runs/36914250896

- Guard de STATUS: **success**.
- Job build: **success** — npm ci, format:check, lint, Vitest, build, Playwright e upload do artefato Pages.
- Job deploy: **failure** em `actions/configure-pages@v5`, antes de publicar.
- Inspeção visual local: home e Ações em desktop, Ações em celular; scrollbar global calculado conforme tokens.
- URL prevista: https://luandev93.github.io/radarB3/ — **HTTP 404** na verificação; não publicada.

## Bloqueios encontrados

**GitHub Pages não habilitado.** O workflow tentou criar o site com `enablement: true`, mas o GITHUB_TOKEN não tem permissão administrativa para a primeira habilitação:

```text
Get Pages site failed: Not Found
Create Pages site failed: Resource not accessible by integration
```

O conector disponível permite commits e acompanhamento de Actions, mas não expõe configuração de Pages. Nenhum segredo foi adicionado para contornar essa limitação. O código e o artefato estão buildáveis; o bloqueio é de configuração do repositório.

O problema local de download do navegador foi resolvido pelo mirror Microsoft oficial. Não bloqueia os testes; Chromium 134 e Playwright 1.51.1 foram usados.

## Próximo passo exato

1. Abrir https://github.com/luandev93/radarB3/settings/pages .
2. Em **Build and deployment → Source**, selecionar **GitHub Actions**.
3. Reexecutar o job deploy da execução acima (**Re-run failed jobs**) ou executar o workflow **Validate and deploy Pages** em main.
4. Validar HTTP 200 da home, arquivos JS/CSS e seis rotas via hash (incluindo `/radarB3/#/ativo/PETR4`) com recarga.
5. Registrar a URL pública, concluir Fase 1 em STATUS/MVP_PLAN/HANDOFF e então iniciar Fase 2 por tipos de domínio e src/services.

Não iniciar integração de dados antes de resolver esse gate.
