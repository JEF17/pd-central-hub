import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppLayout } from "@/components/AppLayout";
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
    ],
  }),
  component: PersonnelPage,
});

function PersonnelPage() {
  return (
    <AppLayout title="Personnel" subtitle="Roster and duty status for the current watch.">
      <Card className="card-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-lg font-semibold">Department Roster</CardTitle>
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
                {personnel.map((p) => (
                  <tr key={p.badge} className="transition-colors hover:bg-muted/40">
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
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
