# Laboon website

Landing page of **Laboon** — the app that connects musicians. Collects emails
for the launch and the beta, and hosts the app's companion pages.

🌐 Production: https://www.laboon-app.com

## Quick start

```bash
nvm use              # Node 24 (see .nvmrc)
npm install
cp .env.example .env.local   # optional: forms work in "dry run" without keys
npm run dev          # http://localhost:3000
```

## Scripts

| Command                                                     | What it does                                                 |
| ----------------------------------------------------------- | ------------------------------------------------------------ |
| `npm run dev`                                               | Local dev server                                             |
| `npm run build` / `npm start`                               | Production build / serve it locally                          |
| `npm run lint`                                              | ESLint (zero warnings allowed)                               |
| `npm run typecheck`                                         | TypeScript                                                   |
| `npm test` / `npm run test:watch` / `npm run test:coverage` | Unit tests (Vitest)                                          |
| `npm run format`                                            | Format all files (Prettier)                                  |
| `npm run check`                                             | Format check + lint + typecheck + tests — run before pushing |

## Features

Newsletter signup (launch / beta, listmonk double opt-in) · contact form ·
invisible anti-bot protection · social links · legal documents (+ app
WebView embed) · password reset fallback · iOS/Android deep links · SEO &
share image · analytics & conversion events · error monitoring (Sentry) ·
French error pages.

## Documentation

Everything is in [`docs/`](docs/README.md): architecture, design system,
conventions, testing, deployment, decisions, roadmap and one page per feature.
