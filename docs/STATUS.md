# RadarB3 — Status vivo

Última atualização: 2026-10-01
Fase ativa: **Fase 3 — Lista de ações e FIIs (pronta para iniciar)**
Estado geral: **FASE 2 CONCLUÍDA — PUBLICADA E VALIDADA**

## Último commit registrado

- Baseline: `eaf94c5` — conclusão da Fase 1 publicada.
- Último commit de implementação: `680f0e3` — `feat(data): add typed brapi sandbox provider and quote states`.
- Este registro: `docs(status): complete phase 2 after public data validation`.

## Progresso global

- [x] Fase 0 — Bootstrap e governança
- [x] Fase 1 — Frontend + GitHub Pages
- [x] Fase 2 — Camada de dados
- [ ] Fase 3 — Ações e FIIs
- [ ] Fase 4 — Página individual
- [ ] Fase 5 — Rankings
- [ ] Fase 6 — Screener
- [ ] Fase 7 — Railway/PostgreSQL
- [ ] Fase 8 — Release MVP

## Concluído na Fase 2

- src/services e tipos Asset, Quote, Fundamentals, Dividend, PricePoint, proveniência e interface MarketDataProvider.
- Adaptador brapi v2 sem token para PETR4, VALE3, ITUB4 e MGLU3, sem JSON externo na UI.
- Cache em memória, deduplicação, fila de concorrência 1, timeout e Retry-After para 429.
- Configuração pública validada em env; sem segredos, scraping ou infraestrutura paga.
- Normalização de números/datas, null explícito, fonte e timestamps de mercado/consulta separados.
- Estados loading/error/empty/ready e nova tentativa; descarte de resposta de ticker anterior.
- Fixture real exclusiva dos testes e limites documentados em DATA_SOURCES.
- Página de ativo recebe apenas prévia de cotação para validar a camada; gráficos, proventos e fundamentos completos continuam na Fase 4.

## Testes e validações

- ESLint, Vitest (19 testes) e build TypeScript/Vite passaram.
- Playwright: três testes; seis rotas e 404, reload, 390px/1280px, cotação, erro/retry/vazio/cobertura; sem overflow/erros JS e axe sem violações nas rotas.
- Captura da página do ativo em 390px inspecionada: preços e origem legíveis, sem corte.
- Resposta real v2 PETR4 HTTP 200 e CORS público verificados; a fixture preserva essa resposta.
- format:check passou; git diff --check passou; auditoria estática premium strict: zero findings.
- GitHub Actions https://github.com/luandev93/radarB3/actions/runs/36926921905 : success. Build e deploy passaram; guard STATUS também passou.
- Publicação validada no navegador: PETR4 consultado da fonte real, cotação/variação presentes, DY/P/VP ausentes explícitos, fonte brapi sandbox.
- Horário de mercado exibido 01/10/2026 18:11:30 e consulta 18:13:14 (Brasília), separados. Atraso permanece desconhecido.
- HGLG11 mostra cobertura limitada e conserva o estado após reload; navegação para home funciona.
- URL: https://luandev93.github.io/radarB3/ — HTTP 200 confirmado.

## Bloqueios e limites

Nenhum bloqueio para o sandbox. Cobertura completa de ações/FIIs e fundamentos não está disponível por esta integração sem token. Delay do sandbox não é documentado: desconhecido. Não expor token para ampliar a cobertura. CVM e Railway permanecem nas etapas previstas.

## Próximo passo exato

Iniciar Fase 3 pelo primeiro item pendente: tabela/grid reutilizável de ações e FIIs. Usar MarketDataProvider, começar pela cobertura real do sandbox e indicar FIIs/fundamentos indisponíveis. Em seguida busca por ticker/nome, ordenação de números negativos/null e filtros rápidos. Não antecipar rankings/screener nem expor credenciais para ampliar a cobertura.
