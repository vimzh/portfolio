# Portfolio

Personal portfolio built with Next.js 16, React 19, Tailwind CSS 4, and a headless Fumadocs MDX blog.

## Development

```bash
bun install
bun run dev
```

The site runs at [http://localhost:3000](http://localhost:3000).

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

Fumadocs validates frontmatter at build time. Published posts appear automatically on `/blogs`, receive a static `/blogs/[slug]` page, and are added to the sitemap. Set `published: false` to keep a draft out of the index and production routes.

The generated `.source/` directory is ignored and should not be edited manually.

## Verification

```bash
bun run lint
bunx tsc --noEmit
bun run build
```
