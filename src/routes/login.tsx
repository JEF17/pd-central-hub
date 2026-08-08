import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Officer Sign In — LSPD Portal" },
      {
        name: "description",
        content:
          "Secure sign-in for Los Santos Police Department personnel accessing the Mission Row division portal.",
      },
      { property: "og:title", content: "Officer Sign In — LSPD Portal" },
      {
        property: "og:description",
        content: "Secure sign-in for LSPD personnel accessing the division portal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [badge, setBadge] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-sidebar px-4">
      <Card className="w-full max-w-sm card-shadow">
        <CardHeader className="items-center space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-steel text-primary-foreground">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="font-display text-xl font-bold tracking-wide">
              LSPD PORTAL
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Mission Row Division</p>
          </div>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!badge || !password) {
                toast.error("Badge number and password are required.");
                return;
              }
              toast.success("Credentials accepted — demo mode, no live session.");
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="badge" className="field-label">
                Badge number
              </Label>
              <Input
                id="badge"
                inputMode="numeric"
                placeholder="3812"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="field-label">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Authorized use only.{" "}
            <Link to="/" className="text-steel underline-offset-2 hover:underline">
              Continue to portal
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
