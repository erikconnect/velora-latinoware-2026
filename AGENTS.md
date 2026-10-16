## Learned User Preferences

- Comunica em Português; respostas e documentação do projeto devem estar em Português.
- A apresentação deve respeitar os Skins Velora (`@velora/css`) com possibilidade de troca ao vivo durante a demo.
- No desktop, cada slide deve ocupar exatamente uma tela (`100svh`); no mobile, scroll livre sem snap.
- Animações devem usar `vl-in-view` em cada slide para reexecutar ao avançar ou voltar entre slides.
- Fotos de retrato devem usar proporção 4:5 e foco `center top` para não cortar a cabeça.

## Learned Workspace Facts

- Apresentação HTML/Vite para Latinoware 2026; repositório separado do monorepo Velora em `../velora`.
- CSS do `@veloracss.io/css` vendorizado em `vendor/velora-css/` (cópia estática, sem dependência `file:` — quebrava o deploy na Vercel por apontar fora do repo). Fonte da verdade: o `src/` do pacote publicado no npm (`npm pack @veloracss.io/css@<versao>`), hoje 0.9.0. O site publicado (`site/`) usa `site/css/velora.min.css` e não o vendor; o vendor alimenta só o app Vite (`src/presentation.css`).
- Gerenciador de pacotes: pnpm (`packageManager` no `package.json`).
- Breakpoint do deck: desktop ≥761px (snap obrigatório, slide fixo em `100svh`); mobile ≤760px (sem snap, altura automática).
- Motion: `vl-in-view` em cada slide; Hero usa gate amplo (anima no load); demais slides só em `cover 99–100%` (tela cheia).
- Tokens de retrato em `presentation.css`: `--talk-portrait-ratio: 4 / 5` e `--talk-portrait-focus: center top`.
- Skins aplicados via `data-editorial-theme` no `<html>`; preferência em `localStorage` (`vl-editorial-theme`).
- `.vscode/tasks.json` com tarefas pnpm explícitas; `.vscode/settings.json` com `npm.autoDetect` e `task.autoDetect` desativados.
