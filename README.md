# vimzh.dev

A minimal, content-driven personal portfolio built with Next.js 16, React 19,
Tailwind CSS 4, and Fumadocs MDX.

Live site: [vimzh.dev](https://vimzh.dev)

## What is included

- Typed content modules for profile data, site copy, work, projects, and open
  source contributions.
- Focused React components that consume content without owning portfolio data.
- Static `/about`, `/projects`, and `/blogs` pages using the Next.js App Router.
- A schema-validated MDX blog with generated post routes.
- A GitHub contribution graph fetched through the GraphQL API and cached for
  24 hours.
- Search and machine-readable output through JSON-LD, `sitemap.xml`,
  `robots.txt`, `llms.txt`, `about.md`, and `work.md`.
- Light and dark themes, responsive layouts, and Vercel Analytics.

## Quick start

This repository uses [Bun](https://bun.sh/) for package management and scripts.

```bash
bun install
cp .env.example .env.local
bun run dev
```

The development server runs at
[http://localhost:3000](http://localhost:3000).

### Environment variables

Set the following value in `.env.local`:

```bash
GITHUB_TOKEN=your_github_token
```

`GITHUB_TOKEN` is used only for the contribution graph. A classic token with
the `read:user` scope is sufficient. When it is missing or the GitHub request
fails, the site displays an explicit unavailable state instead of contribution
data.

Never commit `.env.local` or a real token.

## Content model

Most portfolio content can be changed without editing page or component
layouts.

| File | Responsibility |
| --- | --- |
| `content/user.ts` | Name, bio, email, avatars, social accounts, and About copy |
| `content/site.ts` | Site metadata, navigation, footer, not-found, and LLM copy |
| `content/projects.ts` | Project entries and Projects section labels |
| `content/work.ts` | Work history and Work section labels |
| `content/open-source.ts` | Detailed and compact open-source contributions |
| `content/contributions.ts` | GitHub contribution section copy |
| `content/blog.ts` | Blog index and navigation copy |
| `content/routes.ts` | Internal routes and machine-readable endpoints |
| `types/data.ts` | Shared contracts that validate the content modules |

Images, the resume, and other static files live under `public/`. Replace the
avatar files, project screenshots, and `public/resume.pdf` when adapting the
portfolio.

This structure is content-driven rather than a generic theme engine. The
existing layout and visual system remain intentionally opinionated; changing
the page composition still requires editing the relevant React component or
App Router page.

## Project structure

```text
app/                  App Router pages, metadata, and machine-readable routes
components/           Portfolio sections and shared UI components
content/              Typed portfolio data and interface copy
content/blog/         MDX blog posts
lib/                  Blog, GitHub, JSON-LD, theme, and utility logic
public/               Avatars, project images, and resume
types/                Shared TypeScript content contracts
source.config.ts      Fumadocs collection and frontmatter schema
```

## Writing a blog post

Create an MDX file under `content/blog/`. The filename becomes the URL slug.

```mdx
---
title: Post title
description: A concise summary of the post.
date: 2026-07-29
tags:
  - engineering
published: true
---

Write the post in Markdown or MDX.
```

Fumadocs validates frontmatter during development and production builds.
Published posts appear on `/blogs`, receive a static `/blogs/[slug]` route, and
are added to the sitemap. Set `published: false` to keep a draft out of the blog
index and production routes.

The generated `.source/` directory is ignored and must not be edited manually.

## Available routes

| Route | Purpose |
| --- | --- |
| `/` | Portfolio overview |
| `/about` | Full profile and contact information |
| `/projects` | Complete project collection |
| `/blogs` | Published blog index |
| `/blogs/[slug]` | Generated MDX post page |
| `/llms.txt` | Machine-readable site index |
| `/about.md` | Machine-readable profile |
| `/work.md` | Machine-readable work history |

## Scripts

| Command | Purpose |
| --- | --- |
| `bun run dev` | Start the local development server |
| `bun run lint` | Run ESLint |
| `bunx tsc --noEmit` | Type-check without producing build output |
| `bun run build` | Create and validate the production build |
| `bun run start` | Run the production server after a build |

## Verification

Run the complete local quality gate before publishing changes:

```bash
bun run lint
bunx tsc --noEmit
bun run build
```

## Deployment

The application can run on any platform that supports Next.js. For Vercel,
import the repository and configure `GITHUB_TOKEN` in the project environment.
The standard build command is `bun run build`.
