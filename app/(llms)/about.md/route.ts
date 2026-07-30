import { llmsCopy, site } from "@/content/site";
import { socialLinks, user } from "@/content/user";

const content = `# ${llmsCopy.about.title}

${user.bio}

## ${llmsCopy.about.contactHeading}

- ${llmsCopy.about.nameLabel}: ${user.name}
- ${llmsCopy.about.handleLabel}: ${user.accounts.x.handle}
- ${llmsCopy.about.emailLabel}: ${user.email}
- ${llmsCopy.about.websiteLabel}: ${site.url}

## ${llmsCopy.about.socialLinksHeading}

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
