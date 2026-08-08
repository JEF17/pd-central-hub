import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { callsByDay, callTypeBreakdown, responseTrend } from "@/lib/lspd-data";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Watch Reports — LSPD Portal" },
      {
        name: "description",
        content:
          "Weekly LSPD watch analytics: call volume by day, response-time trend and incident type breakdown.",
      },
      { property: "og:title", content: "Watch Reports — LSPD Portal" },
      {
        property: "og:description",
        content: "Call volume, response-time trend and incident type breakdown for the division.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReportsPage,
});

const pieColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function ReportsPage() {
  return (
    <AppLayout title="Reports" subtitle="Weekly analytics for Mission Row and adjoining sectors.">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="card-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg font-semibold">Calls by Day</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={callsByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip cursor={{ fill: "var(--color-muted)" }} />
                <Bar dataKey="calls" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg font-semibold">
              Average Response Time (min)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={responseTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} domain={[0, 8]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="minutes"
                  stroke="var(--color-chart-3)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-shadow lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg font-semibold">
              Incident Type Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={callTypeBreakdown}
                    dataKey="value"
                    nameKey="type"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {callTypeBreakdown.map((entry, i) => (
                      <Cell key={entry.type} fill={pieColors[i % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 self-center">
              {callTypeBreakdown.map((entry, i) => (
                <div key={entry.type} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-foreground">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: pieColors[i % pieColors.length] }}
                    />
                    {entry.type}
                  </span>
                  <span className="font-mono text-muted-foreground">{entry.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
