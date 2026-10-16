# Velora CSS — Latinoware 2026

Apresentação HTML do lançamento público do Velora CSS na Latinoware 2026.

## Rodar

```bash
pnpm install
pnpm dev
```

Build:

```bash
pnpm build
```

Preview do build:

```bash
pnpm preview
```

## Skins (design systems)

A apresentação consome os **Skins** do `@velora/css` via `data-editorial-theme` no `<html>`.
Cada Skin retokeniza tipografia, cores, grid, densidade, geometria, materiais e motion voice.

**Trocar ao vivo:**

- Painel fixo no canto inferior esquerdo (Noir · Earth · Aethel · Meridian)
- Swatches clicáveis no slide 11 (Core ≠ Skin)
- URL com query: `?skin=meridian` (útil para ensaios)

A preferência persiste em `localStorage` (mesma chave do Velora Showcase).

## Apresentar

- Abra no Chrome/Safari moderno.
- Use tela cheia.
- Role com trackpad/mouse, Page Down ou Space.
- **Desktop (≥761px):** cada slide ocupa exatamente **1 tela** (`100svh`), com `scroll-snap` obrigatório entre slides.
- **Mobile (≤760px):** scroll livre, sem snap — o conteúdo pode ultrapassar a altura da tela.
- **Hero (slide 01):** gate aberto na carga — sequência `vl-enter` + `vl-delay` começa imediatamente.
- **Slides 02–18:** gate abre em tela cheia (`cover 99–100%`); entradas rodam dentro do slide e **repetem** ao voltar.
- O progresso no topo é CSS `scroll-timeline`.
- Motion usa o contrato `vl-*` do `@velora/css`, sem runtime JavaScript.

## Exportar PDF

Use a impressão do navegador em **Landscape**, sem margens e com gráficos de fundo ativados.
O CSS de impressão define páginas 16:9 (`13.333in × 7.5in`).

## Estrutura

- `index.html` — 17 slides principais (na ordem da Home vNext), 1 divisor e 7 slides de backup; semântica da palestra.
- `src/presentation.css` — layout do deck sobre o design system Velora.
- `vendor/velora-css/` — cópia estática do `@velora/css` (framework CSS consumido pelo deck).
- `public/media/erik-cardoso.jpg` — foto do palestrante.
- `public/media/velora-logo.svg` — marca oficial.
- `public/media/velora-github-qr.svg` — QR do repositório.

## Filosofia

O deck funciona como demonstração do próprio produto: HTML declara intenção através de
`vl-*`; Velora/CSS executam motion, layout, adaptação e impressão. Não há JavaScript de
apresentação.
