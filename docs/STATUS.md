# RadarB3 — Status vivo

Última atualização: 2026-10-01
Fase ativa: **Fase 4 — Página individual do ativo (pronta para iniciar)**
Estado geral: **FASE 3 CONCLUÍDA NA COBERTURA DISPONÍVEL — PUBLICADA E VALIDADA**

## Último commit registrado

- Baseline desta fase: `93ed9ad` — conclusão da Fase 2 publicada.
- Último commit de implementação: `6644e74` — `feat(assets): add searchable sortable sandbox asset table`.
- Este registro: `docs(status): complete phase 3 after public listing validation`.

## Progresso global

- [x] Fase 0 — Bootstrap e governança
- [x] Fase 1 — Frontend + GitHub Pages
- [x] Fase 2 — Camada de dados
- [x] Fase 3 — Ações e FIIs (interface; cobertura limitada)
- [ ] Fase 4 — Página individual
- [ ] Fase 5 — Rankings
- [ ] Fase 6 — Screener
- [ ] Fase 7 — Railway/PostgreSQL
- [ ] Fase 8 — Release MVP

## Concluído na Fase 3

- Tabela reutilizável de dez colunas com links ao ativo, fonte e horário por linha.
- Busca por ticker/nome e filtros rápidos: todas, com cotação, variação positiva/negativa.
- Ordenação em todas as colunas, null ao final nas duas direções e desempate previsível.
- Busca/filtro/ordenação na URL; recarga/retorno preservam o recorte.
- Consultas progressivas com skeleton por linha, erros parciais e retry individual.
- Ações e FIIs separados. FIIs mostra cobertura indisponível; não há fundo fictício.
- Quatro registros não justificam paginação/virtualização; decisão registrada.
- Mensagens de erro compartilhadas com a prévia do ativo; contratos de UI/design atualizados.

## Testes e validações

- Vitest: 27 testes passaram, incluindo null/negativo/zero, filtros e falha parcial/retry.
- ESLint passou após correção do fluxo de carregamento no effect.
- TypeScript/Vite build passou após corrigir opção de teste incompatível com Testing Library.
- Playwright: seis testes passaram em 390px/1280px; seis rotas/404, reload, busca, filtro, teclado, retorno, erro/retry/vazio e axe.
- Capturas da lista mobile/desktop inspecionadas; rolagem contida, sem overflow no documento. Ticker ajustado para não quebrar linha.
- format:check e git diff --check passaram. Auditoria premium strict: zero findings. DESIGN lint: zero erros (três avisos de tokens órfãos já existentes).
- Revalidação final: lint, 27 testes, TypeScript/build e seis testes E2E passaram. Publicação validada.
- GitHub Actions https://github.com/luandev93/radarB3/actions/runs/36928611178 : build e deploy success. Guard de STATUS passou.
- Navegador público: quatro ativos com dados reais, nomes distintos, preço/variação/volume e fonte/horários por linha.
- Busca por nome "magazine" mostrou MGLU3 e persistiu após reload; limpar e filtro negativo mostraram ITUB4 no momento da verificação.
- Ordenação crescente por preço produziu MGLU3, ITUB4, PETR4, VALE3; URL registrou sort/dir.
- Ticker abriu PETR4; FIIs mostrou ausência de cobertura; navegação de volta a Ações funcionou.
- URL publicada e validada: https://luandev93.github.io/radarB3/#/acoes .

## Bloqueios e limites

Nenhum bloqueio para o sandbox. Cobertura completa de ações/FIIs e fundamentos não está disponível por esta integração sem token. Delay do sandbox não é documentado: desconhecido. Não expor token para ampliar a cobertura. CVM e Railway permanecem nas etapas previstas.

## Próximo passo exato

Iniciar Fase 4 pelo primeiro item: cabeçalho individual do ativo, com nome/tipo e informações disponíveis no contrato. Completar cards/valor de mercado/volume e fallbacks explícitos. Antes de implementar gráfico, histórico de proventos ou fundamentos, verificar disponibilidade pública no sandbox e limites da fonte; se ausentes, registrar bloqueio real sem criar dados fictícios nem antecipar Railway ou expor token. Não avançar rankings/screener antes de resolver o núcleo.
