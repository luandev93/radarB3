# RadarB3 — contrato de interface

## Fontes

README.md, docs/MVP_PLAN.md e docs/HANDOFF.md definem o MVP, ausência de recomendação, fonte/timestamp, ausência explícita de dados e hospedagem estática. DESIGN.md define a identidade visual. Não há autenticação, exclusão, cobrança ou coleta de dados pessoais nesta fase.

## Donos canônicos

| Capacidade          | Dono                            | Verificação                                |
| ------------------- | ------------------------------- | ------------------------------------------ |
| Navegação           | Shell / React Router HashRouter | App.test.tsx e tests/navigation.spec.ts    |
| Estado indisponível | SectionPage e DataAvailability  | Testes de todas as rotas                   |
| Scrollbar           | src/index.css global            | Auditoria e inspeção do navegador          |
| Página do ativo     | AssetPage                       | Ticker válido/inválido e métricas ausentes |

## Comportamento

Rotas preservadas no hash para recarga estática no GitHub Pages. Base do Vite: /radarB3/. Navegação atual identificada por aria-current. Cada mudança de rota atualiza título, leva foco ao conteúdo principal e retorna ao topo. Link de pular conteúdo mantém o hash de rota. Página não encontrada conserva navegação e retorno ao início.

Todas as rotas são públicas. UI em pt-BR. Estado atual é sem integração; não existe loading, falha remota, busca, paginação ou recomendação. Quando introduzidos em fases posteriores, os estados devem ser definidos antes da implementação. Não simular requisições ou exibir valores financeiros artificiais.

## Verificação

Vitest cobre navegação, metadados indisponíveis, ticker e endereço inválido. Playwright cobre as seis rotas e 404, recarga, navegação, ausência de overflow e erros JS em 390px e 1280px. Axe verifica regras automatizadas WCAG AA; isso não equivale a certificação completa.
