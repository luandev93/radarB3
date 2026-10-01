# RadarB3 — Status vivo

Última atualização: 2026-10-01
Fase ativa: **Fase 3 — Lista de ações e FIIs (implementada; publicação a validar)**
Estado geral: **FASE 3 IMPLEMENTADA — CHECKS VERDES, PUBLICAÇÃO A VALIDAR**

## Último commit registrado

- Baseline: `eaf94c5` — conclusão da Fase 1 publicada.
- Último commit de implementação: `680f0e3` — `feat(data): add typed brapi sandbox provider and quote states`.
- Este commit: `feat(assets): add searchable sortable sandbox asset table`.

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

## Concluído nesta entrega

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
- Revalidação final: lint, 27 testes, TypeScript/build e seis testes E2E passaram. Publicação ainda a validar.
- Site público ainda corresponde à Fase 2: https://luandev93.github.io/radarB3/ .

## Bloqueios e limites

Nenhum bloqueio para o sandbox. Cobertura completa de ações/FIIs e fundamentos não está disponível por esta integração sem token. Delay do sandbox não é documentado: desconhecido. Não expor token para ampliar a cobertura. CVM e Railway permanecem nas etapas previstas.

## Próximo passo exato

Concluir checks finais, publicar a lista e validar no Pages a tabela real, busca, ordenação, recarga e FIIs indisponíveis. Depois registrar conclusão da Fase 3 e iniciar Fase 4 pelo cabeçalho do ativo, preservando limites de cobertura para gráficos/proventos/fundamentos.
