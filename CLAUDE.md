# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

The `@AGENTS.md` import above is load-bearing: this repo runs **Next.js 16.2.7 + React 19**, which has breaking changes versus older training data. Before writing Next.js code, read the relevant guide under `node_modules/next/dist/docs/` (e.g. `01-app/...`) rather than assuming older App Router conventions.

## Browser automation

Do not use the Claude in Chrome browser tools (`mcp__claude-in-chrome__*`) — navigation, screenshots, page automation — unless explicitly asked to. Verify changes with `bun run lint`, `bun run build`, and type checks instead.

## Commands

Package manager is **bun** (lockfile is `bun.lock`); never use npm/yarn/pnpm.

- `bun run dev` — start the dev server (http://localhost:3000)
- `bun run build` — production build
- `bun run start` — serve the production build
- `bun run lint` — ESLint (flat config, `eslint-config-next`)

There is **no test runner configured** — no `test` script and no test framework is installed. Do not assume one exists.

Add shadcn/ui components with `bunx --bun shadcn@latest add <component>` (they land in `components/ui`).

## Architecture

App Router project at the repo root (no `src/` directory). App code lives in `app/`, shared code in `components/` and `lib/`.

- **Import alias:** `@/*` maps to the repo root (`tsconfig.json`), so imports are `@/lib/utils`, `@/components/ui/...` — not `@/src/...`.
- **Layout chrome lives in `app/layout.tsx`, not pages.** The root layout wraps every page's `{children}` in a single centered container (`mx-auto w-full max-w-6xl flex-1 flex-col px-6`). Pages should render content directly and rely on the layout for width/centering rather than re-adding their own container.

### Content

**Never hardcode user-facing content (copy, names, links, lists, image paths) directly in components.** All such data lives in a `data.ts` file (e.g. `lib/data.ts`) and is imported by the component. Components handle presentation; `data.ts` is the single source of truth for content. When adding a new section, add its data to `data.ts` first, then consume it.

**Copy voice:** keep all user-facing text natural and human. Do not use em dashes (`—`); use commas, periods, or separate sentences instead. Avoid corporate or AI-sounding filler.

### Styling & design system

- **Tailwind v4, CSS-first.** There is no `tailwind.config.js`. All configuration lives in `app/globals.css` via `@import "tailwindcss"` and `@theme inline { ... }`. PostCSS uses `@tailwindcss/postcss`.
- **Design tokens are the source of truth.** Colors are defined as CSS variables in `oklch` under `:root` (light) and `.dark` (dark) in `app/globals.css`, then exposed to Tailwind through `@theme inline` as `--color-*`. Use semantic utilities (`bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, etc.) — do not hardcode `bg-white`/`bg-zinc-*`. Radii derive from a single `--radius` token (`rounded-md`, `rounded-lg`, …).
- **Dark mode** is class-based via the custom variant `@custom-variant dark (&:is(.dark *))` — toggled by a `.dark` class on an ancestor, not the `prefers-color-scheme` media query.
- **shadcn/ui** config is in `components.json`: style `radix-nova`, base color `neutral`, icon library `lucide` (`lucide-react`), RSC enabled. Primitives come from `radix-ui`. Use the `cn()` helper in `lib/utils.ts` (clsx + tailwind-merge) for conditional classes.

### Fonts

Fonts are loaded in `app/layout.tsx` via `next/font/google` and wired through CSS variables consumed by `globals.css`:
- `--font-sans` → **Schibsted Grotesk** (drives `font-sans`); `--font-heading` → **Eighties Comeback**
- `--font-geist-mono` → **Geist Mono** (drives `font-mono`)
