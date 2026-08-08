import { ContributionGraphView } from "@/components/ContributionGraphView";
import { contributionsCopy } from "@/content/contributions";
import { user } from "@/content/user";
import { getContributions } from "@/lib/github";

import type { Activity } from "@/components/kibo-ui/contribution-graph";

export const Contributions = async () => {
  let data: Activity[] = [];
  try {
    data = await getContributions(user.accounts.github.username);
  } catch {
    data = [];
  }

  return (
    <section className="flex w-full flex-col gap-6">
      <h2 className="font-heading text-xl font-normal tracking-tight text-foreground">
        {contributionsCopy.heading}
      </h2>
      {data.length > 0 ? (
        <ContributionGraphView data={data} />
      ) : (
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          {contributionsCopy.unavailableMessage}
        </p>
      )}
    </section>
  );
};
