import { site } from "@/content/site";
import { socialLinks, user } from "@/content/user";

const PERSON_ID = `${site.url}/#person`;
const WEBSITE_ID = `${site.url}/#website`;

/**
 * Builds the site-wide structured data (schema.org) describing the person and
 * the website. All values are derived from lib/data.ts so the JSON-LD stays in
 * sync with the rest of the site.
 */
export const getProfileJsonLd = () => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: user.name,
      alternateName: user.accounts.x.handle,
      description: user.bio,
      url: site.url,
      image: new URL(user.avatars[0], site.url).toString(),
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
