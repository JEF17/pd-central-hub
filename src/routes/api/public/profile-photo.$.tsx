import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/profile-photo/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = (params as { _splat?: string })._splat ?? "";
        const { readProfilePhoto } = await import("@/lib/profile-photo.server");
        const file = await readProfilePhoto(path);
        if (!file) return new Response("Not found", { status: 404 });
        return new Response(file.bytes, {
          headers: {
            "content-type": file.contentType,
            "cache-control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
