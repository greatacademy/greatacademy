import { env, waitUntil } from "cloudflare:workers";
import { createConnectRouter, createContextValues } from "@connectrpc/connect";
import { type UniversalHandler, universalServerRequestFromFetch, universalServerResponseToFetch } from "@connectrpc/connect/protocol";
import { catalogService, dbKey, learningService, Registry, userIdKey } from "@ga/api";
import { compileMath } from "@ga/content-math";
import { connect } from "@ga/db";
import { CatalogService } from "@ga/proto/catalog/v1/catalog_pb";
import { LearningService } from "@ga/proto/learning/v1/learning_pb";

import { createAuth } from "./auth.ts";

/** RPC_PREFIX is where the Connect services are mounted. */
export const RPC_PREFIX = "/api/rpc";

// Built once per isolate: compiling the content and the routing table is pure.
const registry = new Registry([compileMath()]);
const handlers = new Map<string, UniversalHandler>();
{
  const router = createConnectRouter();
  router.service(CatalogService, catalogService(registry));
  router.service(LearningService, learningService({ registry, now: Date.now, seed: () => Math.floor(Math.random() * 0x7fffffff) }));
  for (const h of router.handlers) handlers.set(h.requestPath, h);
}

/**
 * handleApi serves /api: better-auth under /api/auth and the Connect services
 * under /api/rpc. Each request opens its own database client through
 * Hyperdrive and closes it once the response is sent.
 */
export async function handleApi(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const conn = connect(env.HYPERDRIVE.connectionString);
  try {
    const auth = createAuth(conn.db, env.BETTER_AUTH_SECRET, url.origin);
    if (url.pathname.startsWith("/api/auth/")) return await auth.handler(request);
    if (!url.pathname.startsWith(`${RPC_PREFIX}/`)) return new Response("Not Found", { status: 404 });
    const handler = handlers.get(url.pathname.slice(RPC_PREFIX.length));
    if (!handler) return new Response("Not Found", { status: 404 });
    const session = await auth.api.getSession({ headers: request.headers });
    const req = universalServerRequestFromFetch(request, {});
    req.contextValues = createContextValues().set(dbKey, conn.db).set(userIdKey, session?.user.id);
    return universalServerResponseToFetch(await handler(req));
  } finally {
    waitUntil(conn.close());
  }
}
