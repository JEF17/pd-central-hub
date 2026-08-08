import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppLayout } from "@/components/AppLayout";
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
    ],
  }),
  component: RecordsPage,
});

const statusStyles: Record<string, string> = {
  "In Progress": "bg-warning/10 text-warning border border-warning/30",
  Resolved: "bg-success/10 text-success border border-success/30",
  Closed: "bg-muted text-muted-foreground border border-border",
};

function RecordsPage() {
  return (
    <AppLayout title="Records" subtitle="Incident reports filed by the division.">
      <Card className="card-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-lg font-semibold">Incident Reports</CardTitle>
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
                {records.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-muted/40">
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
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
