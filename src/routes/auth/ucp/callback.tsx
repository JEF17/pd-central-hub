import { createFileRoute } from "@tanstack/react-router";
import { getRequest, getRequestHeader } from "@tanstack/react-start/server";

export const Route = createFileRoute("/auth/ucp/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const helpers = await import("@/lib/portal-auth.server");
        const {
          readOAuthStateCookie,
          generateSessionToken,
          hashToken,
          clearOAuthStateCookie,
          exchangeUcpCode,
          fetchUcpUserInfo,
          findPortalUserByUcpId,
          createPortalUser,
          updatePortalUserLogin,
          createSession,
          logLoginEvent,
        } = helpers;

        const url = new URL(request.url);
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");
        const errorParam = url.searchParams.get("error");

        function redirectResponse(location: string, cookies?: string[]) {
          const headers = new Headers({ Location: location });
          for (const cookie of cookies ?? []) {
            headers.append("Set-Cookie", cookie);
          }
          return new Response(null, { status: 302, headers });
        }

        if (errorParam) {
          return redirectResponse(`/auth/giris?error=${encodeURIComponent(errorParam)}`);
        }
        if (!code || !state) {
          return redirectResponse("/auth/giris?error=missing_code");
        }

        const cookieState = readOAuthStateCookie();
        if (!cookieState || cookieState !== state) {
          return redirectResponse("/auth/giris?error=invalid_state");
        }

        const clientId = process.env["UCP_CLIENT_ID"];
        const clientSecret = process.env["UCP_CLIENT_SECRET"];
        const adminUsername = process.env["UCP_ADMIN_USERNAME"];

        if (!clientId || !clientSecret) {
          return redirectResponse("/auth/giris?error=not_configured");
        }

        const redirectUri = new URL("/auth/ucp/callback", request.url).toString();

        try {
          const { accessToken } = await exchangeUcpCode(code, clientId, clientSecret, redirectUri);
          const info = await fetchUcpUserInfo(accessToken);

          if (!info.username) {
            throw new Error("UCP username is missing");
          }

          let user = await findPortalUserByUcpId(info.ucpUserId);
          const isFirstAdmin =
            !!adminUsername && info.username.toLowerCase() === adminUsername.toLowerCase();

          if (!user) {
            user = await createPortalUser(info, isFirstAdmin);
            await logLoginEvent(
              user.id,
              user.username,
              "signup",
              isFirstAdmin ? "first_admin" : "pending",
            );
          } else {
            user = await updatePortalUserLogin(user.id, info);
            await logLoginEvent(user.id, user.username, "login", "existing");
          }

          const sessionToken = generateSessionToken();
          const tokenHash = hashToken(sessionToken);
          await createSession(user.id, tokenHash, getRequestHeader("user-agent") ?? null);

          const redirectTo = user.status === "approved" ? "/" : "/onay-bekliyor";
          return redirectResponse(redirectTo, [
            clearOAuthStateCookie(),
            helpers.serializeSessionCookie(sessionToken),
          ]);
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          await logLoginEvent(null, null, "callback_error", message);
          return redirectResponse(`/auth/giris?error=${encodeURIComponent(message)}`);
        }
      },
    },
  },
});
