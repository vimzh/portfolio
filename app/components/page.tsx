import { NavBar } from "@/components/NavBar";
import { emptyState } from "@/lib/data";

export default function ComponentsPage() {
  return (
    <main className="flex flex-1 flex-col pt-24">
      <div className="flex w-full flex-col gap-6">
        <NavBar />
        <p className="text-base leading-relaxed text-muted-foreground">
          {emptyState}
        </p>
      </div>
    </main>
  );
}
