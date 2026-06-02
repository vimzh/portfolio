"use client";

import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from "@/components/kibo-ui/contribution-graph";

import type { Activity } from "@/components/kibo-ui/contribution-graph";

type ContributionGraphViewProps = {
  data: Activity[];
};

export const ContributionGraphView = ({ data }: ContributionGraphViewProps) => {
  return (
    <ContributionGraph
      data={data}
      labels={{ totalCount: "{{count}} contributions" }}
      className="w-full"
    >
      <ContributionGraphCalendar className="w-full overflow-x-hidden [&>svg]:h-auto [&>svg]:w-full">
        {({ activity, dayIndex, weekIndex }) => (
          <ContributionGraphBlock
            activity={activity}
            dayIndex={dayIndex}
            weekIndex={weekIndex}
          />
        )}
      </ContributionGraphCalendar>
      <ContributionGraphFooter>
        <ContributionGraphTotalCount />
        <ContributionGraphLegend />
      </ContributionGraphFooter>
    </ContributionGraph>
  );
};
