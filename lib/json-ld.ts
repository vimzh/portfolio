import { site, socialImage } from "@/content/site";
import type { BlogPost } from "@/lib/blog";
import { routes } from "@/content/routes";
import { socialLinks, user } from "@/content/user";

const PERSON_ID = `${site.url}/#person`;
const WEBSITE_ID = `${site.url}/#website`;

/**
 * Builds the site-wide structured data (schema.org) describing the person and
 * the website. All values are derived from content files so the JSON-LD stays in
 * sync with the rest of the site.
 */
export const getProfileJsonLd = () => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: user.name,
      alternateName: user.alias,
      description: user.bio,
      url: site.url,
      email: `mailto:${user.email}`,
      sameAs: socialLinks.map((social) => social.href),
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: site.url,
      name: site.name,
      description: site.description,
      inLanguage: "en",
      author: { "@id": PERSON_ID },
    },
  ],
});

export const getBlogPostJsonLd = (post: BlogPost) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "@id": `${site.url}${post.url}#article`,
  headline: post.data.title,
  description: post.data.description,
  datePublished: post.data.date,
  url: new URL(post.url, site.url).toString(),
  mainEntityOfPage: new URL(post.url, site.url).toString(),
  image: new URL(socialImage.url, site.url).toString(),
  author: {
    "@type": "Person",
    "@id": PERSON_ID,
    name: user.name,
    alternateName: user.alias,
    url: new URL(routes.about, site.url).toString(),
  },
  isPartOf: { "@id": WEBSITE_ID },
  inLanguage: "en",
});
