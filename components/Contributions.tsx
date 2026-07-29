import { ContributionGraphView } from "@/components/ContributionGraphView";
import { profile } from "@/lib/data";
import { getContributions } from "@/lib/github";

import type { Activity } from "@/components/kibo-ui/contribution-graph";

export const Contributions = async () => {
  let data: Activity[] = [];
  try {
    data = await getContributions(profile.githubUsername);
  } catch {
    data = [];
  }

  return (
    <section className="flex w-full flex-col gap-6">
      <h2 className="font-heading text-xl font-normal tracking-tight text-foreground">
        contributions
      </h2>
      {data.length > 0 ? (
        <ContributionGraphView data={data} />
      ) : (
        <p className="text-base leading-relaxed text-muted-foreground">
          GitHub contributions are unavailable right now.
        </p>
      )}
    </section>
  );
};
