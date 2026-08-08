import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { AppLayout } from "@/components/AppLayout";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Portal Settings — LSPD Portal" },
      {
        name: "description",
        content:
          "Configure LSPD Portal notifications, radio alerts and watch preferences for your account.",
      },
      { property: "og:title", content: "Portal Settings — LSPD Portal" },
      {
        property: "og:description",
        content: "Configure notifications, radio alerts and watch preferences for your account.",
      },
    ],
  }),
  component: SettingsPage,
});

const toggles = [
  { label: "Priority 1 audible alert", note: "Play a tone for every Code 3 dispatch.", on: true },
  { label: "BOLO push notifications", note: "Notify when a new BOLO is issued citywide.", on: true },
  { label: "Shift summary email", note: "Send an end-of-watch summary to your inbox.", on: false },
  { label: "Show unit callsigns", note: "Display callsigns instead of officer names.", on: true },
];

function SettingsPage() {
  return (
    <AppLayout title="Settings" subtitle="Portal preferences for your account and watch.">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="card-shadow lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg font-semibold">Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {toggles.map((t) => (
                <div key={t.label} className="flex items-center justify-between gap-4 py-4 first:pt-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.label}</p>
                    <p className="text-xs text-muted-foreground">{t.note}</p>
                  </div>
                  <Switch defaultChecked={t.on} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg font-semibold">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="field-label">Officer</p>
              <p className="text-foreground">Sgt. J. Reed</p>
            </div>
            <div>
              <p className="field-label">Badge</p>
              <p className="font-mono text-foreground">3812</p>
            </div>
            <div>
              <p className="field-label">Division</p>
              <p className="text-foreground">Mission Row — Patrol</p>
            </div>
            <div>
              <p className="field-label">Access level</p>
              <p className="text-foreground">Watch Supervisor</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
