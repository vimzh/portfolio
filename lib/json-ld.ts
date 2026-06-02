import { profile, site, socials } from "@/lib/data";

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
      name: profile.name,
      alternateName: profile.handle,
      description: profile.bio,
      url: site.url,
      image: new URL(profile.avatars[0], site.url).toString(),
      email: `mailto:${profile.email}`,
      sameAs: socials.map((social) => social.href),
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
