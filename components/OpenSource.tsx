import { Fragment } from "react";
import {
  ArrowUpRight01Icon,
  GitMergeIcon,
  StarIcon,
} from "@hugeicons/core-free-icons";

import { Icon } from "@/components/Icon";
import { TextLink } from "@/components/TextLink";
import { moreContributions, openSource } from "@/lib/data";

export const OpenSource = () => {
  return (
    <section className="flex w-full flex-col gap-6">
      <h2 className="font-heading text-xl font-normal tracking-tight text-foreground">
        open source
      </h2>
      <ul className="flex flex-col divide-y divide-border">
        {openSource.map((item) => (
          <li
            key={`${item.owner}/${item.repo}`}
            className="group flex flex-col gap-1.5 py-4 first:pt-0 last:pb-0"
          >
            <div className="flex items-center justify-between gap-3">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-sm font-medium text-foreground outline-none focus-visible:underline focus-visible:underline-offset-4"
              >
                <span>
                  <span className="text-muted-foreground">{item.owner}/</span>
                  {item.repo}
                </span>
                <Icon
                  icon={ArrowUpRight01Icon}
                  aria-hidden="true"
                  className="size-3.5 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                />
              </a>
              <div className="flex shrink-0 items-center gap-3">
                <span className="inline-flex items-center gap-1 font-mono text-xs tabular-nums text-muted-foreground">
                  <Icon icon={StarIcon} aria-hidden="true" className="size-3" />
                  {item.stars}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border border-violet-500/30 px-1.5 py-0.5 text-xs text-violet-700 dark:border-violet-400/30 dark:text-violet-300">
                  <Icon
                    icon={GitMergeIcon}
                    aria-hidden="true"
                    className="size-3"
                  />
                  {item.status}
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </li>
        ))}
        <li className="py-4 text-sm text-muted-foreground first:pt-0 last:pb-0">
          +{" "}
          {moreContributions.map((item, index) => (
            <Fragment key={item.name}>
              {index > 0 && ", "}
              <TextLink href={item.link}>{item.name}</TextLink>
            </Fragment>
          ))}
        </li>
      </ul>
    </section>
  );
};
