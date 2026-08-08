import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Radio, Siren, Users } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import {
  activeCalls,
  bolos,
  bulletins,
  priorityCall,
  stats,
  units,
} from "@/lib/lspd-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LSPD Portal — Watch Command Dashboard" },
      {
        name: "description",
        content:
          "Los Santos Police Department portal: live call queue, unit availability, bulletins and BOLOs for watch command.",
      },
      { property: "og:title", content: "LSPD Portal — Watch Command Dashboard" },
      {
        property: "og:description",
        content:
          "Live call queue, unit availability, bulletins and BOLOs for Los Santos Police Department watch command.",
      },
    ],
  }),
  component: Dashboard,
});

const priorityStyles: Record<string, string> = {
  P1: "bg-destructive/10 text-destructive border border-destructive/30",
  P2: "bg-warning/10 text-warning border border-warning/30",
  P3: "bg-muted text-muted-foreground border border-border",
};

const statusLabels: Record<string, string> = {
  dispatched: "Dispatched",
  en_route: "En route",
  on_scene: "On scene",
  clear: "Clear",
};

const unitStatusStyles: Record<string, string> = {
  available: "bg-success/10 text-success border border-success/30",
  assigned: "bg-steel/10 text-steel border border-steel/30",
  out_of_service: "bg-muted text-muted-foreground border border-border",
};

function Dashboard() {
  const available = units.filter((u) => u.status === "available").length;

  return (
    <AppLayout
      title="Watch Command"
      subtitle="Live operational picture for Mission Row and adjoining sectors."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="card-shadow transition-shadow hover:card-shadow-hover">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p
                    className={`mt-1 font-display text-2xl font-bold ${
                      stat.warn ? "text-destructive" : "text-foreground"
                    }`}
                  >
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.note}</p>
                </div>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    stat.warn ? "bg-destructive/10" : "bg-steel/10"
                  }`}
                >
                  <Radio className={`h-5 w-5 ${stat.warn ? "text-destructive" : "text-steel"}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="flex flex-wrap items-start gap-5 p-5">
          <span className="rounded-md bg-destructive px-3 py-1 font-display text-xs font-semibold tracking-wide text-destructive-foreground">
            {priorityCall.code} · PRIORITY 1
          </span>
          <div className="min-w-64 flex-1 space-y-1">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
              <Siren className="h-4 w-4 text-destructive" />
              {priorityCall.title}
            </h2>
            <p className="max-w-[68ch] text-sm text-muted-foreground">{priorityCall.detail}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {priorityCall.units.map((u) => (
                <Badge key={u} variant="outline" className="border-destructive/40 text-destructive">
                  {u}
                </Badge>
              ))}
            </div>
          </div>
          <button className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-opacity hover:opacity-90">
            Join response
          </button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="card-shadow lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between font-display text-lg font-semibold">
              <span>Dispatch Call Queue</span>
              <span className="text-sm font-normal text-muted-foreground">
                {activeCalls.length} active
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeCalls.map((call) => (
                <div
                  key={call.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-14 font-mono text-sm font-medium text-muted-foreground">
                      {call.code}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{call.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {call.location} · {call.unit}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-muted-foreground">{call.elapsed}</span>
                    <span className="text-xs text-muted-foreground">
                      {statusLabels[call.status]}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyles[call.priority]}`}
                    >
                      {call.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="card-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-display text-lg font-semibold">
                <Users className="h-5 w-5 text-steel" />
                Field Units
                <span className="ml-auto text-sm font-normal text-muted-foreground">
                  {available} available
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {units.slice(0, 6).map((unit) => (
                  <div
                    key={unit.callsign}
                    className="flex items-center justify-between rounded-lg bg-muted/50 p-2"
                  >
                    <div>
                      <p className="font-mono text-xs font-medium text-foreground">
                        {unit.callsign}
                      </p>
                      <p className="text-xs text-muted-foreground">{unit.officers}</p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${unitStatusStyles[unit.status]}`}
                    >
                      {unit.status.replace(/_/g, " ")}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg font-semibold">Bulletin Board</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bulletins.map((b) => (
                  <div
                    key={b.title}
                    className={`space-y-1 border-l-2 pl-4 ${
                      b.level === "warning" ? "border-warning" : "border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-foreground">{b.title}</h4>
                      <span className="font-mono text-[11px] text-muted-foreground">{b.time}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">{b.body}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-display text-lg font-semibold">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Active BOLOs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bolos.map((bolo) => (
                  <div key={bolo.name} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{bolo.name}</p>
                      <Badge
                        variant="outline"
                        className={
                          bolo.priority === "High"
                            ? "border-destructive/40 text-destructive"
                            : "border-warning/40 text-warning"
                        }
                      >
                        {bolo.priority}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{bolo.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
