import { profile, site, socials } from "@/lib/data";

const content = `# About

${profile.bio}

## Contact

- Name: ${profile.name}
- Handle: ${profile.handle}
- Email: ${profile.email}
- Website: ${site.url}

## Social Links

${socials.map((social) => `- [${social.label}](${social.href})`).join("\n")}
`;

export const revalidate = false;
export const dynamic = "force-static";

export async function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  });
}
