# RadarB3 — fontes e limites da camada de dados

Verificado em 2026-10-01. Esta integração cobre a Fase 2; não representa cobertura completa da B3.

## Fonte operacional inicial

brapi, endpoint público `https://brapi.dev/api/v2/stocks/quote?symbols=PETR4`. A documentação recomenda v2 para novas integrações. O adaptador normaliza o envelope `results[].data`; componentes recebem apenas os contratos internos de `src/services/domain.ts`.

O sandbox sem token permite PETR4, VALE3, ITUB4 e MGLU3. Outros ativos, incluindo FIIs, são rejeitados localmente com mensagem de cobertura limitada. Não há chamada autenticada, token em VITE_* ou infraestrutura paga. O plano gratuito autenticado é distinto: a FAQ informa 15.000 requisições/mês, um ticker por chamada, atraso aproximado de 30 minutos, histórico de até três meses e ausência de dividendos. Isso não autoriza expor a credencial no Pages nem atribuir esse atraso ao sandbox.

Uma consulta real v2 a PETR4 retornou HTTP 200 e CORS `Access-Control-Allow-Origin: *`. Headers observados informaram limite 20, janela/reset 60 segundos e concorrência 1. São observações de uma resposta, não uma garantia de quota universal. A implementação serializa consultas, deduplica chamadas do mesmo ticker, usa cache em memória por cinco minutos e não faz polling. A lista consulta os quatro ativos progressivamente (até quatro requisições por entrada sem cache); busca e filtros são locais. Cache se perde ao recarregar; cada visitante ainda consome requisições. HTTP 429 respeita Retry-After (segundos ou data), com fallback de 60 segundos. Timeout padrão: dez segundos.

## Proveniência, unidade e ausência

- Preço: BRL somente quando a moeda retornada é BRL. Variação: percentual fornecido, sem multiplicar novamente por 100.
- Volume: quantidade de ações negociadas informada pela fonte; não equivale a liquidez financeira em BRL.
- Valor de mercado: moeda retornada pela fonte. Preços, volume e valor de mercado negativos são tratados como ausentes.
- Fonte da cotação: brapi — sandbox sem token. `updatedAt` é apenas regularMarketTime; requestedAt não substitui o horário de mercado.
- `retrievedAt` registra quando a resposta foi recebida. Ambos são exibidos separadamente em horário de Brasília.
- Atraso do sandbox: desconhecido (`null`). A interface não usa a expressão tempo real para a cotação.
- Números ausentes/inválidos: null, nunca zero inventado. Zero e variação negativa válidos são preservados. Datas sem timezone ou inválidas não viram timestamps.
- Fundamentos, setor, proventos e histórico não solicitados: null, explicitamente indisponíveis. Não inferir DY, P/VP, ROE ou tipo FII a partir do ticker.
- HTTP 404 e results vazio representam ausência. Formato inválido, rede, timeout, autorização e rate limit têm estados próprios. Respostas obsoletas não substituem o ticker atual.

## Fixtures e configuração

`src/test/fixtures/brapi-petr4.json` é uma resposta real capturada em 2026-10-01, exclusiva dos testes. A aplicação publicada consulta a fonte real; não usa fixture como fallback financeiro. Testes de navegador interceptam a API para serem determinísticos e não gastar quota.

`.env.example` contém somente timeout e TTL públicos, validados em `src/services/config.ts`. Endpoint e allowlist são centralizados; não há variável de token. `MarketDataProvider` isola a UI da API externa.

## Limitação de continuidade

A camada de dados está utilizável para o sandbox. Cobertura de FIIs, fundamentos e universo completo continua limitada pela fonte acessível sem segredo. Fase 3 deve apresentar a cobertura real e ausências; não inventar uma lista completa. Se ampliar a fonte exigir credencial privada, registrar a decisão e usar backend na fase prevista, sem provisionamento automático nesta etapa. CVM permanece complementar planejada e ainda não conectada.

## Referências oficiais

- https://brapi.dev/docs/openapi
- https://brapi.dev/swagger/latest.json
- https://brapi.dev/docs/authentication
- https://brapi.dev/faq/api-e-gratis-mesmo
