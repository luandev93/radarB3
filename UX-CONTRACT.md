# RadarB3 — contrato de interface

## Fontes

README.md, docs/MVP_PLAN.md e docs/HANDOFF.md definem o MVP, ausência de recomendação, fonte/timestamp, ausência explícita de dados e hospedagem estática. DESIGN.md define a identidade visual. Não há autenticação, exclusão, cobrança ou coleta de dados pessoais nesta fase.

## Donos canônicos

| Capacidade          | Dono                                 | Verificação                               |
| ------------------- | ------------------------------------ | ----------------------------------------- |
| Navegação           | Shell / React Router HashRouter      | App.test.tsx e tests/navigation.spec.ts   |
| Estado indisponível | SectionPage e DataAvailability       | Testes de todas as rotas                  |
| Scrollbar           | src/index.css global                 | Auditoria e inspeção do navegador         |
| Página do ativo     | AssetPage / QuotePreview             | Ticker válido/inválido e estados remotos  |
| Dados de mercado    | MarketDataProvider / adaptador brapi | Normalização, cache, timeout e rate limit |

## Comportamento

Rotas preservadas no hash para recarga estática no GitHub Pages. Base do Vite: /radarB3/. Navegação atual identificada por aria-current. Cada mudança de rota atualiza título, leva foco ao conteúdo principal e retorna ao topo. Link de pular conteúdo mantém o hash de rota. Página não encontrada conserva navegação e retorno ao início.

Todas as rotas são públicas. UI em pt-BR. QuotePreview tem estados de carregamento, pronto, vazio e erro. Reservar altura no carregamento; mostrar erro em pt-BR e botão de nova tentativa quando recuperável. Rate limit informa espera e o serviço impede consulta antecipada. Ativo fora da cobertura e autenticação exigida não oferecem repetição inútil. Trocar ticker descarta resposta anterior. Pronto mostra cotação/variação, fonte, horário de mercado e consulta separados; atraso desconhecido e fundamentos indisponíveis permanecem explícitos. A fixture é exclusiva de testes. Não existe busca, paginação ou recomendação nesta fase.

## Verificação

Vitest cobre navegação, contratos, números/datas nulos, cache, deduplicação, fila, timeout, erros, limites e descarte de respostas obsoletas. Playwright cobre as seis rotas e 404, recarga, navegação, ausência de overflow e erros JS em 390px e 1280px. Axe verifica regras automatizadas WCAG AA; isso não equivale a certificação completa.

Os cartões e botões reutilizam os tokens de DESIGN.md. Não há biblioteca paralela de componentes; QuotePreview é o dono dos estados remotos.

## Listagem — Fase 3

Fonte de escopo: docs/MVP_PLAN.md (Fase 3) e docs/DATA_SOURCES.md (cobertura). AssetList é o dono de busca/filtros/estado por linha; AssetTable é o dono da tabela semântica e da região com rolagem horizontal. selectRows em services/listing normaliza a busca e ordena cópia dos dados sem mutar a fonte. Não há select, seleção em massa ou popup nesta entrega.

Busca local por ticker/nome, sem distinguir acentos/maiúsculas. Não produz requisições adicionais; URL no hash conserva q/filter/sort/dir e recarga/retorno. Limpar é imediato, restaura foco ao input e não gera nova consulta. Params inválidos voltam aos padrões. Filtros Todas/Com cotação/Variação positiva/Variação negativa usam campos presentes; zero não é positivo nem negativo. Qualquer direção mantém null por último; empate usa ticker. Headers têm botões nativos e aria-sort. Foco na região permite rolagem pelo teclado.

Loading é por linha com skeleton estático; status informa consultas pendentes. Erro de um ativo conserva os demais. Retry recupera somente a linha afetada, respeitando cache/fila/timeout/cooldown do provider. Respostas de tentativa antiga e de componente desmontado são descartadas. Vazio da fonte não é igual a filtro sem resultados. Busca sem resultados oferece limpar busca/filtros. FIIs possui estado próprio de cobertura indisponível e não chama API de ações. Paginação/virtualização não se justificam com quatro registros.

Cotação é BRL apenas quando confirmada pela fonte; variação/DY/ROE têm unidade percentual. Volume está em ações, não em reais. Atualização por linha informa fonte, horário de cotação e horário de consulta separadamente. Fundamentos indisponíveis não recebem o horário da cotação como substituto. Não há recomendação ou ranking automático.

Verificação: listing.test.ts cobre negativos/zero/null, busca, filtros, moeda e desempate; AssetList.test.tsx cobre partial/retry, URL/limpar/foco e cobertura FII. Playwright cobre busca/nome/ticker, sort por teclado, filtros, recarga/retorno, mobile/desktop, erros/vazio e axe.
