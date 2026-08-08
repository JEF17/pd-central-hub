import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { personnel } from "@/lib/lspd-data";

export const Route = createFileRoute("/personnel")({
  head: () => ({
    meta: [
      { title: "Personnel Roster — LSPD Portal" },
      {
        name: "description",
        content:
          "LSPD personnel roster with badge numbers, rank, division assignment and current duty status.",
      },
      { property: "og:title", content: "Personnel Roster — LSPD Portal" },
      {
        property: "og:description",
        content: "Badge numbers, rank, division assignment and duty status for department personnel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PersonnelPage,
});

type Officer = (typeof personnel)[number];

function PersonnelPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Officer | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return personnel;
    return personnel.filter((p) =>
      [p.badge, p.name, p.rank, p.division, p.status].some((v) => v.toLowerCase().includes(q)),
    );
  }, [query]);

  return (
    <AppLayout title="Personnel" subtitle="Roster and duty status for the current watch.">
      <Card className="card-shadow">
        <CardHeader className="flex-row items-center justify-between gap-4 pb-3">
          <CardTitle className="font-display text-lg font-semibold">Department Roster</CardTitle>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, badge, division"
              className="pl-9"
              aria-label="Search personnel"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-y bg-muted/50">
                  <th className="field-label px-5 py-2">Badge</th>
                  <th className="field-label px-5 py-2">Name</th>
                  <th className="field-label px-5 py-2">Rank</th>
                  <th className="field-label px-5 py-2">Division</th>
                  <th className="field-label px-5 py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((p) => (
                  <tr
                    key={p.badge}
                    onClick={() => setSelected(p)}
                    className="cursor-pointer transition-colors hover:bg-muted/40"
                  >
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{p.badge}</td>
                    <td className="px-5 py-3 font-medium text-foreground">{p.name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{p.rank}</td>
                    <td className="px-5 py-3 text-muted-foreground">{p.division}</td>
                    <td className="px-5 py-3 text-right">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          p.status === "On Duty"
                            ? "border border-success/30 bg-success/10 text-success"
                            : "border bg-muted text-muted-foreground"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                      No personnel match that search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">{selected?.name}</DialogTitle>
            <DialogDescription>
              Badge {selected?.badge} · {selected?.division} Division
            </DialogDescription>
          </DialogHeader>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="field-label">Rank</dt>
              <dd className="mt-1 text-foreground">{selected?.rank}</dd>
            </div>
            <div>
              <dt className="field-label">Duty status</dt>
              <dd className="mt-1 text-foreground">{selected?.status}</dd>
            </div>
            <div>
              <dt className="field-label">Assignment</dt>
              <dd className="mt-1 text-foreground">Mission Row · Watch 3</dd>
            </div>
            <div>
              <dt className="field-label">Radio</dt>
              <dd className="mt-1 font-mono text-foreground">TAC-{selected?.badge.slice(0, 2)}</dd>
            </div>
          </dl>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
