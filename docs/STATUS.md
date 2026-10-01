# RadarB3 — Status vivo

Última atualização: 2026-10-01  
Fase ativa: **Fase 1 — Bootstrap frontend + GitHub Pages**  
Estado geral: **PRONTO PARA IMPLEMENTAÇÃO**

## Último commit registrado

- Bootstrap documental iniciado em `9f0c293` — `docs: initialize RadarB3 MVP`
- O commit atual desta documentação deve substituir/avançar essa referência após ser criado.

> Regra: a partir da ativação do workflow de governança, todo commit relevante deve modificar este arquivo no mesmo commit.

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

## Fase 0 — concluído

- [x] definir objetivo do MVP
- [x] definir stack
- [x] definir GitHub Pages como hospedagem inicial
- [x] definir Railway como backend/PostgreSQL futuro
- [x] definir brapi/CVM como fontes planejadas
- [x] criar README
- [x] criar plano detalhado
- [x] criar handoff
- [x] criar status vivo
- [x] criar validação automática de atualização do status

## Fase 1 — próximo trabalho

### Pendente
- [ ] inicializar Vite + React + TypeScript
- [ ] instalar/configurar Tailwind
- [ ] instalar/configurar React Router
- [ ] configurar ESLint
- [ ] configurar Vitest
- [ ] criar layout base
- [ ] criar rotas
- [ ] configurar base path do GitHub Pages
- [ ] criar deploy via GitHub Actions
- [ ] publicar
- [ ] validar URL pública

## Decisões vigentes

- frontend: Vite + React + TypeScript;
- hospedagem inicial: GitHub Pages;
- CSS: Tailwind;
- banco futuro: PostgreSQL no Railway;
- backend futuro: Railway;
- fonte operacional planejada: brapi free tier;
- fonte oficial complementar: CVM;
- sem scraping do Investidor10 como dependência;
- sem autenticação no MVP;
- sem recomendações automáticas de investimento no MVP.

## Validações executadas

- repositório confirmado: `luandev93/radarB3`;
- branch padrão: `main`;
- repositório iniciou vazio;
- README criado com sucesso.

## Bloqueios atuais

Nenhum bloqueio técnico conhecido para iniciar a Fase 1.

## Próximo passo exato

Criar a aplicação Vite React TypeScript diretamente no repositório, configurar o `base` para GitHub Pages e criar a estrutura mínima de rotas sem ainda acoplar a API externa.

## Como atualizar este arquivo em cada commit

Use este padrão:

```md
## Último commit registrado
- <SHA curto> — <mensagem>

## Alterado neste commit
- ...

## Validações
- npm test
- npm run build

## Bloqueios
- nenhum

## Próximo passo exato
- ...
```

Se o commit muda código/configuração e não atualiza este arquivo, o workflow de governança deve falhar.
