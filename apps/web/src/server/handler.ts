import { env, waitUntil } from "cloudflare:workers";
import { createConnectRouter, createContextValues } from "@connectrpc/connect";
import { type UniversalHandler, universalServerRequestFromFetch, universalServerResponseToFetch } from "@connectrpc/connect/protocol";
import { accountService, catalogService, dbKey, learningService, Registry, userIdKey } from "@ga/api";
import type { SubjectGateway } from "@ga/content";
import { connect } from "@ga/db";
import { AccountService } from "@ga/proto/account/v1/account_pb";
import { CatalogService } from "@ga/proto/catalog/v1/catalog_pb";
import { LearningService } from "@ga/proto/learning/v1/learning_pb";

import { createAuth } from "./auth.ts";
import { emailSender } from "./email.ts";

/** RPC_PREFIX is where the Connect services are mounted. */
export const RPC_PREFIX = "/api/rpc";

/** subjectGateways are the Workers serving each subject; a new subject adds its binding here. */
const subjectGateways = (): readonly SubjectGateway[] => [env.SUBJECT_MATH as unknown as SubjectGateway];

let loaded: ReadonlyMap<string, UniversalHandler> | undefined;

/**
 * routes reads the subject listings and builds the routing table once per
 * isolate. Concurrent first requests each read for themselves: a promise of one
 * request must not be awaited by another, which would fail if the first is cancelled.
 */
async function routes(): Promise<ReadonlyMap<string, UniversalHandler>> {
  if (loaded) return loaded;
  const registry = await Registry.open(subjectGateways());
  if (loaded) return loaded;
  const router = createConnectRouter();
  router.service(CatalogService, catalogService(registry));
  router.service(AccountService, accountService({ registry, now: Date.now }));
  router.service(LearningService, learningService({ registry, now: Date.now, seed: () => Math.floor(Math.random() * 0x7fffffff) }));
  loaded = new Map(router.handlers.map((h) => [h.requestPath, h]));
  return loaded;
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
    const auth = createAuth(conn.db, env.BETTER_AUTH_SECRET, url.origin, emailSender(env.RESEND_API_KEY, env.EMAIL_FROM));
    if (url.pathname.startsWith("/api/auth/")) return await auth.handler(request);
    if (!url.pathname.startsWith(`${RPC_PREFIX}/`)) return new Response("Not Found", { status: 404 });
    const handler = (await routes()).get(url.pathname.slice(RPC_PREFIX.length));
    if (!handler) return new Response("Not Found", { status: 404 });
    const session = await auth.api.getSession({ headers: request.headers });
    const req = universalServerRequestFromFetch(request, {});
    req.contextValues = createContextValues().set(dbKey, conn.db).set(userIdKey, session?.user.id);
    return universalServerResponseToFetch(await handler(req));
  } finally {
    waitUntil(conn.close());
  }
}
