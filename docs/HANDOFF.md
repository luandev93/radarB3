# RadarB3 — Handoff de continuidade

## Missão

Continuar a implementação do RadarB3 sem reiniciar o planejamento.

Repositório:
`luandev93/radarB3`

Branch base:
`main`

Estado recebido:

- planejamento do MVP concluído;
- README criado;
- plano detalhado criado;
- status vivo criado;
- governança de commits criada;
- Fase 1 publicada a partir de `bc23003`; Fase 2 publicada a partir de `680f0e3`; Fase 3 publicada a partir de `6644e74`; fase ativa agora é Fase 4, conforme STATUS.

## Leitura obrigatória antes de editar código

Leia integralmente, nesta ordem:

1. `README.md`
2. `docs/MVP_PLAN.md`
3. `docs/STATUS.md`
4. este arquivo
5. commits mais recentes da branch

Não refaça o planejamento salvo nesses arquivos, exceto se encontrar uma contradição técnica concreta.

## Stack aprovada

Frontend:

- Vite
- React
- TypeScript
- Tailwind CSS
- React Router
- Vitest
- ESLint

Deploy inicial:

- GitHub Pages

Dados:

- brapi no free tier como fonte operacional planejada;
- CVM como fonte oficial complementar.

Infra futura:

- Railway;
- PostgreSQL;
- API/worker apenas quando necessário.

## Regra central de arquitetura

O GitHub Pages é estático. Portanto:

- não colocar segredos no frontend;
- não considerar `VITE_*` secreto;
- chamadas que precisem de token privado devem migrar para backend Railway;
- o frontend deve depender de interfaces/adaptadores internos, e não do JSON bruto da brapi;
- persistência não deve ser introduzida antes de haver necessidade real.

## Fase atual

**Fase 4 — Página individual do ativo**

As Fases 1, 2 e a interface da Fase 3 na cobertura disponível estão concluídas. Não repetir bootstrap/camada de dados/listagem; iniciar cabeçalho da Fase 4. A execução abaixo é o histórico do bootstrap.

### Execução esperada

1. inicializar Vite React TypeScript;
2. configurar Tailwind;
3. configurar router;
4. criar páginas vazias funcionais:
   - Home
   - Ações
   - FIIs
   - Rankings
   - Screener
   - Ativo
5. criar shell/layout responsivo;
6. configurar GitHub Pages;
7. adicionar testes mínimos;
8. rodar lint/test/build;
9. atualizar `docs/STATUS.md`;
10. commitar.

## Regras de commit

Cada commit relevante deve:

- ser pequeno e coerente;
- deixar o projeto buildável;
- atualizar `docs/STATUS.md`;
- registrar testes/validações no status;
- atualizar este handoff se houver decisão arquitetural, bloqueio, mudança de fonte ou mudança de fase.

Não acumular múltiplas fases num único commit sem necessidade.

## Governança de status

Existe um workflow em:

`.github/workflows/require-status-update.yml`

Ele deve verificar commits relevantes e falhar quando `docs/STATUS.md` não for alterado.

Não remover ou contornar essa regra para acelerar o desenvolvimento. Se a regra causar falso positivo, corrigir o workflow e registrar a razão no status/handoff.

## Regras de produto

- não copiar Investidor10 pixel a pixel;
- não depender de scraping do Investidor10;
- não chamar dado atrasado de "tempo real";
- mostrar fonte e timestamp;
- não transformar ranking em recomendação automática;
- tratar ausência de dados explicitamente;
- separar métricas de ações e FIIs quando necessário.

## Regras de dados

Antes de exibir qualquer métrica:

- definir unidade;
- definir fonte;
- definir timestamp;
- normalizar null;
- validar números;
- evitar divisão por zero;
- testar ordenação com números negativos/nulos.

## Definição da primeira entrega visual

A primeira entrega publicada deve permitir:

- abrir a home;
- navegar para todas as rotas;
- visualizar layout responsivo;
- chegar a `/ativo/PETR4` usando dado mockado/fixture, caso a integração real ainda não esteja pronta;
- recarregar a aplicação no GitHub Pages sem tela 404.

## O que NÃO fazer agora

- não criar login;
- não criar carteira;
- não criar IA;
- não criar recomendação de compra/venda;
- não provisionar PostgreSQL antes da Fase 7 sem justificativa;
- não criar microsserviços;
- não adicionar Redis;
- não adicionar websocket;
- não colocar tokens privados no frontend.

## Próximo commit sugerido

`feat(asset): expand asset header and available indicators`

Esse commit deve iniciar Fase 4, preservar cobertura/ausências explícitas, incluir validações adequadas e atualizar STATUS no mesmo commit.

## Critério para passar à Fase 2

Somente avançar quando:

- GitHub Pages estiver publicado;
- todas as rotas abrirem;
- build estiver verde;
- teste mínimo estiver verde;
- `docs/STATUS.md` registrar a URL pública e as validações.

## Decisões do bootstrap (2026-10-01)

- Vite com `base: '/radarB3/'`; React Router com HashRouter. Rotas lógicas continuam as previstas; URL pública usa hash: `/radarB3/#/acoes` e `/radarB3/#/ativo/PETR4`. Escolha evita 404 em recarga sem fallback do servidor do Pages e sem redirecionamento JavaScript de 404.
- Páginas iniciais são funcionais para navegação, com dados explicitamente indisponíveis. Não há fixtures financeiras apresentadas como cotações. Adaptadores e fontes continuam na Fase 2.
- DESIGN.md e UX-CONTRACT.md registram tokens, idioma pt-BR, navegação e estados comuns.
- Node.js 24; npm ci usa o lockfile. Tailwind v4 usa plugin Vite. ESLint, Vitest, Prettier e Playwright/axe configurados.
- Testes de navegador cobrem 390px e 1280px, seis rotas e 404, acesso direto e recarga. Playwright 1.51.1 fixado após falha de download do browser da versão mais recente no ambiente.
- Workflow Pages valida antes de publicar em main; PR não publica. `configure-pages` tenta enablement. Se faltar permissão de habilitação, selecionar Settings → Pages → Source: GitHub Actions e reexecutar workflow. Não declarar Fase 1 concluída sem deploy e URL verificados.

## Publicação confirmada (2026-10-01)

- URL: https://luandev93.github.io/radarB3/ .
- Execução https://github.com/luandev93/radarB3/actions/runs/36914250896 — tentativa 2: success.
- O usuário habilitou Pages; reexecução do deploy pelo conector concluiu. O bloqueio `Resource not accessible by integration` foi resolvido.
- Home retorna HTTP 200. Todas as seis rotas públicas e recarga foram verificadas no navegador de sessão. Testes responsivos e axe passaram no job build.
- Nenhuma fonte financeira conectada; a tela mostra ausência explícita de valores, fonte e atualização.

## Camada de dados (2026-10-01)

- Fase 2 concluída e publicada; STATUS é a autoridade para fase ativa.
- Fonte brapi v2, endpoint público sandbox sem token. Allowlist PETR4/VALE3/ITUB4/MGLU3, limitada para evitar exigência de segredo no frontend.
- MarketDataProvider separa componentes e formato externo. Substituir fonte no adaptador, preservando contratos.
- Cache em memória cinco minutos, timeout dez segundos, deduplicação, fila sequencial e cooldown Retry-After. Env só contém timeout/TTL públicos.
- updatedAt é horário da cotação; retrievedAt é momento da consulta. Atraso desconhecido; ausência nunca vira zero nem atualização artificial.
- Fundamentos, histórico, proventos e FIIs ainda indisponíveis; não preencher com fixtures nem inferências. DATA_SOURCES documenta limites e referências oficiais.
- A FAQ distingue sandbox aberto e free tier autenticado. Não colocar chave privada no Pages para obter o universo completo; Railway continua reservado à fase prevista/necessidade comprovada.
- Fixture capturada da resposta v2 é exclusiva de testes. Preview do ativo valida serviços e estados; não antecipa implementação completa da Fase 4.

## Próximo passo exato vigente

Fase 4: completar cabeçalho individual e cards dos indicadores disponíveis. Usar MarketDataProvider e os contratos normalizados. Verificar disponibilidade pública de histórico/proventos/fundamentos antes de implementar; ausências devem virar bloqueio explícito para o núcleo, nunca fixture em produção. Sem rankings/screener antecipados, sem login/carteira/IA nem credencial no frontend.

## Publicação da Fase 2 confirmada

Commit `680f0e3`, execução https://github.com/luandev93/radarB3/actions/runs/36926921905 : success. Navegador público consultou PETR4 com cotação/variação reais e fonte/horários separados; HGLG11 mostrou cobertura limitada antes e após reload. A fase ativa passa a Fase 3. Não confundir conclusão dos contratos/adaptador com cobertura financeira completa.

## Listagem implementada (2026-10-01)

AssetList/AssetTable e seleção local em services/listing são os donos da Fase 3. Não duplicar tabela nas próximas telas. Cache/fila continuam no provider; busca e filtros não provocam chamadas adicionais. URL conserva q/filter/sort/dir; null sempre por último, independentemente da direção. Paginação dispensada com quatro registros. FIIs separado com ausência explícita, sem consulta indevida. A entrega ainda não amplia o universo de ativos nem oferece indicadores completos. Publicação validada; seguir Fase 4 conforme STATUS.

## Publicação da Fase 3 confirmada

Commit `6644e74`; execução https://github.com/luandev93/radarB3/actions/runs/36928611178 : build/deploy success. Lista real dos quatro ativos no Pages, busca por nome, recarga, filtro negativo, ordenação por preço, acesso ao ativo e ausência FII validados no navegador. Fase ativa passa a Fase 4. Conclusão da interface de listagem não equivale à cobertura completa da B3; limitação da fonte permanece.
