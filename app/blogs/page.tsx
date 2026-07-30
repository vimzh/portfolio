import Link from "next/link";

import { NavBar } from "@/components/NavBar";
import { blogCopy } from "@/content/blog";
import { formatBlogDate, getPublishedPosts } from "@/lib/blog";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: blogCopy.title,
  description: blogCopy.description,
};

export default function BlogsPage() {
  const posts = getPublishedPosts();

  return (
    <main className="reveal-stack flex flex-1 flex-col gap-16 pt-24">
      <NavBar />
      <section className="flex w-full flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-xl font-normal tracking-tight text-foreground">
            {blogCopy.title}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {blogCopy.description}
          </p>
        </div>

        <ul className="flex flex-col divide-y divide-border">
          {posts.map((post) => (
            <li key={post.url} className="py-5 first:pt-0 last:pb-0">
              <Link
                href={post.url}
                className="group block rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                <article className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                    <h2 className="font-medium text-foreground transition-colors group-hover:text-foreground/70">
                      {post.data.title}
                    </h2>
                    <time
                      dateTime={post.data.date}
                      className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground"
                    >
                      {formatBlogDate(post.data.date)}
                    </time>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {post.data.description}
                  </p>
                  {post.data.tags.length > 0 && (
                    <ul className="flex flex-wrap gap-1.5 pt-1" aria-label="Tags">
                      {post.data.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-md border px-1.5 py-0.5 font-mono text-xs text-muted-foreground"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
