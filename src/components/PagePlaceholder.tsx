import { Construction } from "lucide-react";

export function PagePlaceholder({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-muted-foreground">This section is not built yet.</p>
      <div className="mt-8 flex items-center gap-3 rounded-lg border border-dashed border-border bg-card/50 p-8 text-muted-foreground">
        <Construction className="size-5 text-primary" />
        <span className="text-sm">Content coming soon.</span>
      </div>
    </div>
  );
}
