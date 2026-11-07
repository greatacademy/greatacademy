import handler from "@tanstack/react-start/server-entry";

import { runScheduled } from "./server/handler.ts";

/** The Worker: TanStack Start serves requests, and the daily Cron Trigger runs the retention rules. */
export default {
  fetch: handler.fetch,
  scheduled(controller: ScheduledController, _env: unknown, ctx: ExecutionContext) {
    ctx.waitUntil(runScheduled(controller.scheduledTime));
  },
};
