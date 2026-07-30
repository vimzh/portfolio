import type { AboutCopy, Link, User } from "@/types/data";

export const user = {
  name: "vansh",
  alias: "vimzh",
  email: "vimzh.dev@gmail.com",
  bio: "I’m a full-stack developer obsessed with AI and clean, minimal interfaces. I love building things from scratch, figuring out hard problems and shipping fast. Most of my time goes into writing code, contributing to open source and exploring what’s possible with LLMs. Always open to interesting projects and collaborations. If you’re working on something cool, let’s talk.",
  avatars: ["/avatar.jpeg", "/avatar-2.jpeg", "/avatar-3.jpeg"],
  accounts: {
    github: {
      label: "github",
      username: "vimzh",
      href: "https://github.com/vimzh",
    },
    x: {
      label: "x",
      username: "vimzhtwt",
      handle: "@vimzh",
      href: "https://x.com/vimzhtwt",
    },
    linkedin: {
      label: "linkedin",
      username: "vimzh",
      href: "https://www.linkedin.com/in/vimzh/",
    },
    codeforces: {
      label: "codeforces",
      username: "tzyx",
      href: "https://codeforces.com/profile/tzyx",
    },
    leetcode: {
      label: "leetcode",
      username: "vimzh",
      href: "https://leetcode.com/u/vimzh",
    },
  },
} as const satisfies User;

export const socialLinks = [
  user.accounts.github,
  user.accounts.x,
  user.accounts.linkedin,
  user.accounts.codeforces,
  user.accounts.leetcode,
] as const satisfies readonly Link[];

export const aboutCopy = {
  greeting: "hi i’m",
  aliasConnector: "aka",
  socialsLeadIn: "you can find me on",
} as const satisfies AboutCopy;
