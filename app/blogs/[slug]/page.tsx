import { notFound } from "next/navigation";

import { NavBar } from "@/components/NavBar";
import { TextLink } from "@/components/TextLink";
import {
  formatBlogDate,
  getBlogPostSlug,
  getPublishedPost,
  getPublishedPosts,
} from "@/lib/blog";
import { blogCopy } from "@/lib/data";
import { getMDXComponents } from "@/mdx-components";

import type { Metadata } from "next";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export const generateStaticParams = () =>
  getPublishedPosts().map((post) => ({ slug: getBlogPostSlug(post) }));

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPublishedPost(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.data.title,
    description: post.data.description,
    keywords: post.data.tags,
    alternates: { canonical: post.url },
    openGraph: {
      type: "article",
      url: post.url,
      title: post.data.title,
      description: post.data.description,
      publishedTime: `${post.data.date}T00:00:00.000Z`,
      tags: post.data.tags,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPublishedPost(slug);

  if (!post) {
    notFound();
  }

  const MDX = post.data.body;

  return (
    <main className="reveal-stack flex flex-1 flex-col gap-16 pt-24">
      <NavBar />
      <article className="flex w-full flex-col gap-10">
        <header className="flex flex-col gap-4 border-b border-border pb-8">
          <TextLink href="/blogs" className="w-fit text-sm">
            {blogCopy.backLabel}
          </TextLink>
          <div className="flex flex-col gap-3">
            <h1 className="font-heading text-3xl leading-tight font-normal tracking-tight text-foreground sm:text-4xl">
              {post.data.title}
            </h1>
            <p className="max-w-2xl leading-relaxed text-muted-foreground">
              {post.data.description}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <time dateTime={post.data.date} className="font-mono tabular-nums">
              {formatBlogDate(post.data.date)}
            </time>
            {post.data.tags.length > 0 && (
              <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
                {post.data.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-md border px-1.5 py-0.5 font-mono"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </header>

        <div className="blog-content max-w-2xl">
          <MDX components={getMDXComponents()} />
        </div>
      </article>
    </main>
  );
}
