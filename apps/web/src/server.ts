import handler from "@tanstack/react-start/server-entry";

/** The Worker: TanStack Start serves the pages, the static files and the recordings; the API is apps/server's own host. */
export default {
  fetch: handler.fetch,
};
