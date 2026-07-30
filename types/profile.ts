import type { Link } from "@/types/common";

export type UserAccount = Link & {
  username: string;
  handle?: string;
};

export type User = {
  name: string;
  alias: string;
  email: string;
  bio: string;
  avatars: readonly string[];
  accounts: {
    github: UserAccount;
    x: UserAccount;
    linkedin: UserAccount;
    codeforces: UserAccount;
    leetcode: UserAccount;
  };
};

export type AboutCopy = {
  greeting: string;
  aliasConnector: string;
  socialsLeadIn: string;
  emailLeadIn: string;
  moreLabel: string;
  pageTitle: string;
};

export type WorkEntry = {
  company: string;
  role: string;
  period: string;
  isPrivate?: boolean;
};
