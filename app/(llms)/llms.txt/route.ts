import { routes } from "@/content/routes";
import { llmsCopy, site } from "@/content/site";
import { socialLinks } from "@/content/user";

const content = `# ${site.name}

> ${site.description}

- [${llmsCopy.index.aboutLabel}](${new URL(routes.aboutMarkdown, site.url)}): ${llmsCopy.index.aboutDescription}
- [${llmsCopy.index.workLabel}](${new URL(routes.workMarkdown, site.url)}): ${llmsCopy.index.workDescription}

## ${llmsCopy.index.linksHeading}

${socialLinks.map((social) => `- [${social.label}](${social.href})`).join("\n")}
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
