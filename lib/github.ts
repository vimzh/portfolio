import { unstable_cache } from "next/cache";

import type { Activity } from "@/components/kibo-ui/contribution-graph";

const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

const CONTRIBUTIONS_QUERY = `
  query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

const LEVEL_MAP: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

type ContributionDay = {
  date: string;
  contributionCount: number;
  contributionLevel: string;
};

type ContributionsResponse = {
  data?: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          weeks: Array<{ contributionDays: ContributionDay[] }>;
        };
      };
    } | null;
  };
  errors?: Array<{ message: string }>;
};

const fetchContributions = async (username: string): Promise<Activity[]> => {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN is not set");
  }

  const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: CONTRIBUTIONS_QUERY,
      variables: { login: username },
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL request failed with ${response.status}`);
  }

  const result = (await response.json()) as ContributionsResponse;

  if (result.errors?.length) {
    throw new Error(result.errors.map((error) => error.message).join("; "));
  }

  const calendar =
    result.data?.user?.contributionsCollection.contributionCalendar;
  if (!calendar) {
    throw new Error(`No contribution data found for "${username}"`);
  }

  return calendar.weeks.flatMap((week) =>
    week.contributionDays.map((day) => ({
      date: day.date,
      count: day.contributionCount,
      level: LEVEL_MAP[day.contributionLevel] ?? 0,
    }))
  );
};

export const getContributions = unstable_cache(
  fetchContributions,
  ["github-contributions"],
  { revalidate: 86400, tags: ["github-contributions"] }
);
