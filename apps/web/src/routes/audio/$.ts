import { env } from "cloudflare:workers";
import { createFileRoute } from "@tanstack/react-router";

import { serveAudio } from "../../server/audio.ts";

// The recordings of passages read aloud, kept in the R2 bucket under audio/ (docs/content.md); in development Vite serves them from public/audio.
export const Route = createFileRoute("/audio/$")({
  server: {
    handlers: {
      GET: ({ request }) => serveAudio(env.BUCKET, request),
      HEAD: ({ request }) => serveAudio(env.BUCKET, request),
    },
  },
});
