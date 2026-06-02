import { site, socials } from "@/lib/data";

const content = `# ${site.name}

> ${site.description}

- [About](${site.url}/about.md): A quick intro to me, how to reach me, and where to find me online.
- [Work](${site.url}/work.md): Roles I've held and where I'm working now.

## Links

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
