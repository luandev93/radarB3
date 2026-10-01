---
version: alpha
name: RadarB3
description: Painel brasileiro de comparação de ativos com azul instrumental e metadados visíveis.
colors:
  primary: '#155bc1'
  ink: '#172c45'
  muted: '#51647c'
  background: '#f5f8fc'
  surface: '#ffffff'
  line: '#d4dfec'
typography:
  sans:
    fontFamily: 'Segoe UI, Arial, sans-serif'
  display:
    fontFamily: 'Trebuchet MS, Segoe UI, sans-serif'
  mono:
    fontFamily: 'Consolas, Courier New, monospace'
rounded:
  DEFAULT: '8px'
  control: '6px'
spacing:
  page-max: '1136px'
  section-gap: '48px'
components:
  navigation:
    textColor: muted
    backgroundColor: surface
  section-card:
    textColor: ink
    backgroundColor: surface
  availability:
    textColor: muted
---

# RadarB3 Design System

## Overview

Painel de consulta para investidores brasileiros em celular e desktop, conforme README e docs/MVP_PLAN.md. Registro de produto em pt-BR. A referência é um instrumento de consulta: marca em forma de radar, azul reservado à navegação e origem dos dados sempre visível. Não copiar portais de investimento nem usar gráficos decorativos ou aparência de recomendação.

O arquivo espelha a fonte canônica de tokens em src/index.css. Tailwind é usado para composição de grid e espaçamento; as variáveis CSS alimentam os componentes compartilhados. Alterações duráveis devem atualizar este documento e CSS juntos. Não existem telas anteriores ao bootstrap.

## Colors

Azul primary para links e foco, ink para títulos e muted para metadados. Fundo background com superfícies surface e divisórias line. Tema claro, sem código verde/vermelho de mercado enquanto não houver dados. Forced colors conserva cores do sistema e scrollbars operáveis.

## Typography

Display em Trebuchet para títulos, sans em Segoe UI para controles e texto, mono em Consolas para rótulos técnicos. Fontes locais eliminam downloads e deslocamento de layout. Título fluido de 40 a 64px, texto principal de 17px, metadados de 12px, parágrafos com entrelinha 1.65.

## Layout

Conteúdo até 1136px com margens de 32px; em telas estreitas, 20px. Navegação quebra linhas sem ocultar destinos. Cards em duas colunas a partir de 768px, uma abaixo disso. Rolagem pertence ao documento. Home apresenta entrada para as quatro áreas; telas irmãs compartilham layout e estados. A tabela de ativos mantém colunas comparáveis com rolagem horizontal dentro de uma região focável e instrução explícita, sem criar overflow no documento. Não há coluna fixa que cubra o foco.

## Elevation & Depth

Superfícies planas com bordas. Sem sombras e sem overlays no bootstrap.

## Shapes

Cards com raio de 8px; controles de 6px. Marca circular de radar como único elemento expressivo. Sem animação ornamental.

## Components

Shell, DataAvailability e SectionPage centralizam navegação, metadados e estado vazio. Links nativos com hover, active e foco visível. Scrollbars globais usam tokens de thumb, track, hover e active em src/index.css; forced colors retorna a auto. Cada rota atualiza título e foco de conteúdo. Redução de movimento elimina animações e transições.

## Do's and Don'ts

- Exibir ausência de dados em texto e usar travessão para métricas ausentes.
- Preservar acesso por teclado, contraste e navegação em celular.
- Não usar valores fictícios, fontes inventadas, timestamp de build como timestamp de cotação ou promessa de tempo real.
- Não introduzir controles de filtros que ainda não funcionam.

## Listagem de ativos

AssetList centraliza busca e filtros; AssetTable centraliza a tabela semântica, ordenação e estados por linha. Busca e botões usam as cores/raios existentes. Cabeçalho usa o token de scrollbar track; skeleton estático usa line, sem animação. Dados numéricos usam mono e tabular-nums. A navegação usa o ticker como link nativo. Sem paginação para quatro ativos.
