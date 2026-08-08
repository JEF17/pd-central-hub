import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppLayout } from "@/components/AppLayout";
import { activeCalls, units } from "@/lib/lspd-data";

export const Route = createFileRoute("/dispatch")({
  head: () => ({
    meta: [
      { title: "Dispatch Queue — LSPD Portal" },
      {
        name: "description",
        content:
          "Full LSPD dispatch queue with call codes, assigned units, elapsed time and unit availability by sector.",
      },
      { property: "og:title", content: "Dispatch Queue — LSPD Portal" },
      {
        property: "og:description",
        content: "Full LSPD dispatch queue with call codes, assigned units and unit availability.",
      },
    ],
  }),
  component: DispatchPage,
});

const priorityStyles: Record<string, string> = {
  P1: "bg-destructive/10 text-destructive border border-destructive/30",
  P2: "bg-warning/10 text-warning border border-warning/30",
  P3: "bg-muted text-muted-foreground border border-border",
};

const unitStatusStyles: Record<string, string> = {
  available: "bg-success/10 text-success border border-success/30",
  assigned: "bg-steel/10 text-steel border border-steel/30",
  out_of_service: "bg-muted text-muted-foreground border border-border",
};

function DispatchPage() {
  return (
    <AppLayout title="Dispatch" subtitle="Every open call and the units assigned to them.">
      <Card className="card-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-lg font-semibold">Call Queue</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-y bg-muted/50">
                  <th className="field-label px-5 py-2">CAD</th>
                  <th className="field-label px-5 py-2">Code</th>
                  <th className="field-label px-5 py-2">Situation</th>
                  <th className="field-label px-5 py-2">Location</th>
                  <th className="field-label px-5 py-2">Unit</th>
                  <th className="field-label px-5 py-2 text-right">Elapsed</th>
                  <th className="field-label px-5 py-2 text-right">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {activeCalls.map((call) => (
                  <tr key={call.id} className="transition-colors hover:bg-muted/40">
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{call.id}</td>
                    <td className="px-5 py-3 font-mono font-medium text-foreground">{call.code}</td>
                    <td className="px-5 py-3 font-medium text-foreground">{call.type}</td>
                    <td className="px-5 py-3 text-muted-foreground">{call.location}</td>
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                      {call.unit}
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-muted-foreground">
                      {call.elapsed}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyles[call.priority]}`}
                      >
                        {call.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="card-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-lg font-semibold">Unit Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {units.map((unit) => (
              <div key={unit.callsign} className="rounded-lg border p-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-foreground">
                    {unit.callsign}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${unitStatusStyles[unit.status]}`}
                  >
                    {unit.status.replace(/_/g, " ")}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{unit.officers}</p>
                <p className="text-xs text-muted-foreground">{unit.sector}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
