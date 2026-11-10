import { createFileRoute } from "@tanstack/react-router";

import { handleVoiceApi } from "../../server/handler.ts";

// The voice service's calls (apps/voice): the tutor's next turn, and the result of a session.
export const Route = createFileRoute("/voice/$")({
  server: {
    handlers: {
      POST: ({ request }) => handleVoiceApi(request),
      PUT: ({ request }) => handleVoiceApi(request),
    },
  },
});
