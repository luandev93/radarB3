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
- nenhuma feature do frontend implementada ainda.

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

**Fase 1 — Bootstrap frontend + GitHub Pages**

Comece por ela.

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

`feat(web): bootstrap Vite React app and routes`

Esse commit deve incluir:
- app inicial;
- rotas;
- layout;
- configuração base;
- testes básicos;
- atualização de `docs/STATUS.md`.

## Critério para passar à Fase 2

Somente avançar quando:
- GitHub Pages estiver publicado;
- todas as rotas abrirem;
- build estiver verde;
- teste mínimo estiver verde;
- `docs/STATUS.md` registrar a URL pública e as validações.
