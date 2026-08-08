import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { records } from "@/lib/lspd-data";

export const Route = createFileRoute("/records")({
  head: () => ({
    meta: [
      { title: "Incident Records — LSPD Portal" },
      {
        name: "description",
        content:
          "Searchable LSPD incident report records with case type, location, reporting officer and case status.",
      },
      { property: "og:title", content: "Incident Records — LSPD Portal" },
      {
        property: "og:description",
        content: "Incident report records with case type, location, reporting officer and status.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RecordsPage,
});

const statusStyles: Record<string, string> = {
  "In Progress": "bg-warning/10 text-warning border border-warning/30",
  Resolved: "bg-success/10 text-success border border-success/30",
  Closed: "bg-muted text-muted-foreground border border-border",
};

type IncidentRecord = (typeof records)[number];

function RecordsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<IncidentRecord | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return records.filter((r) => {
      const matchesStatus = status === "all" || r.status === status;
      const matchesQuery =
        !q || [r.id, r.type, r.location, r.officer].some((v) => v.toLowerCase().includes(q));
      return matchesStatus && matchesQuery;
    });
  }, [query, status]);

  return (
    <AppLayout title="Records" subtitle="Incident reports filed by the division.">
      <Card className="card-shadow">
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-3 pb-3">
          <CardTitle className="font-display text-lg font-semibold">Incident Reports</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search report, type, officer"
                className="pl-9"
                aria-label="Search incident reports"
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40" aria-label="Filter by status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-y bg-muted/50">
                  <th className="field-label px-5 py-2">Report</th>
                  <th className="field-label px-5 py-2">Type</th>
                  <th className="field-label px-5 py-2">Location</th>
                  <th className="field-label px-5 py-2">Reporting officer</th>
                  <th className="field-label px-5 py-2">Filed</th>
                  <th className="field-label px-5 py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className="cursor-pointer transition-colors hover:bg-muted/40"
                  >
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{r.id}</td>
                    <td className="px-5 py-3 font-medium text-foreground">{r.type}</td>
                    <td className="px-5 py-3 text-muted-foreground">{r.location}</td>
                    <td className="px-5 py-3 text-muted-foreground">{r.officer}</td>
                    <td className="px-5 py-3 text-muted-foreground">{r.date}</td>
                    <td className="px-5 py-3 text-right">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[r.status]}`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">
                      No reports match those filters.
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
            <DialogTitle className="font-display">{selected?.type}</DialogTitle>
            <DialogDescription>
              Report {selected?.id} · filed {selected?.date}
            </DialogDescription>
          </DialogHeader>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="field-label">Location</dt>
              <dd className="mt-1 text-foreground">{selected?.location}</dd>
            </div>
            <div>
              <dt className="field-label">Reporting officer</dt>
              <dd className="mt-1 text-foreground">{selected?.officer}</dd>
            </div>
            <div>
              <dt className="field-label">Status</dt>
              <dd className="mt-1 text-foreground">{selected?.status}</dd>
            </div>
            <div>
              <dt className="field-label">Division</dt>
              <dd className="mt-1 text-foreground">Mission Row</dd>
            </div>
          </dl>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
