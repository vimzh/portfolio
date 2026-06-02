import { work } from "@/lib/data";

export const Work = () => {
  return (
    <section className="flex w-full flex-col gap-6">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        work
      </h2>
      <ul className="flex flex-col gap-4">
        {work.map((item) => (
          <li
            key={item.company}
            className="flex items-baseline justify-between gap-4"
          >
            <div className="flex items-baseline gap-1.5 text-sm">
              <span className="text-base font-medium text-foreground">
                {item.company}
              </span>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">{item.role}</span>
            </div>
            <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
              {item.period}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};
