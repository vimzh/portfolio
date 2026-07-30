import { llmsCopy } from "@/content/site";
import { work } from "@/content/work";

const content = `# ${llmsCopy.work.title}

${work
  .map((item) => `## ${item.role} | ${item.company}\n\n${item.period}`)
  .join("\n\n")}
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
