// The API server. `node server.mjs` serves HTTP on PORT, compiling every subject before it listens, so that a pod is
// ready only once the content is in memory. `job daily|quarter` runs a scheduled job, `migrate` applies the migrations
// in MIGRATIONS (libs/db/drizzle), and `grant-admin <email>` makes an adult's account an administrator; each exits.

import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { compileChinese } from "@ga/content-chinese";
import { compileEnglish } from "@ga/content-english";
import { compileMath } from "@ga/content-math";
import { connect, grantAdminByEmail, migrate } from "@ga/db";

import { readConfig } from "./config.ts";
import { type Api, createApi, isJob, openServices, runJob } from "./handler.ts";

/** HEALTH answers the probes of deploy/k8s. */
const HEALTH = "/healthz";

/** toRequest turns a Node request into a fetch Request on the site's origin, whatever host it came in by. */
function toRequest(req: IncomingMessage, origin: string, signal: AbortSignal): Request {
  const headers = new Headers();
  for (const [name, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    for (const v of Array.isArray(value) ? value : [value]) headers.append(name, v);
  }
  const body = req.method === "GET" || req.method === "HEAD" ? undefined : (Readable.toWeb(req) as ReadableStream<Uint8Array>);
  return new Request(new URL(req.url ?? "/", origin), {
    method: req.method ?? "GET",
    headers,
    signal,
    ...(body && { body, duplex: "half" }),
  });
}

/** send writes a fetch Response to a Node response, streaming its body. */
async function send(response: Response, res: ServerResponse): Promise<void> {
  const cookies = response.headers.getSetCookie();
  const headers: Record<string, string | string[]> = {};
  for (const [name, value] of response.headers) if (name !== "set-cookie") headers[name] = value;
  if (cookies.length > 0) headers["set-cookie"] = cookies;
  res.writeHead(response.status, headers);
  if (!response.body) {
    res.end();
    return;
  }
  await pipeline(Readable.fromWeb(response.body as import("node:stream/web").ReadableStream), res);
}

/** serve answers each request with api, logging what fails. */
function serve(api: Api, origin: string) {
  return async (req: IncomingMessage, res: ServerResponse) => {
    if (req.url === HEALTH) {
      res.writeHead(200, { "content-type": "text/plain" }).end("ok");
      return;
    }
    const aborted = new AbortController();
    res.on("close", () => {
      if (!res.writableFinished) aborted.abort();
    });
    try {
      await send(await api(toRequest(req, origin, aborted.signal)), res);
    } catch (e) {
      if (aborted.signal.aborted) return;
      console.error(`${req.method} ${req.url?.split("?")[0]} failed`, e instanceof Error ? (e.stack ?? e.message) : e);
      if (!res.headersSent) res.writeHead(500, { "content-type": "text/plain" }).end("Internal Server Error");
      else res.destroy();
    }
  };
}

const config = readConfig(process.env);
const [command, name] = process.argv.slice(2);

if (command === "migrate") {
  await migrate(config.databaseUrl, process.env.MIGRATIONS ?? "drizzle");
  console.log("migrated");
  process.exit(0);
}
if (command === "grant-admin") {
  if (!name) throw new Error("usage: grant-admin <email>");
  const conn = connect(config.databaseUrl, 1);
  try {
    await grantAdminByEmail(conn.db, name, new Date());
    console.log("granted");
  } finally {
    await conn.close();
  }
  process.exit(0);
}
if (command !== undefined && command !== "job")
  throw new Error(`unknown command ${command}; the commands are job, migrate and grant-admin`);

const started = performance.now();
// The daily job, and the quarter-hourly one without AI keys to judge essays, use no subject.
const usesSubjects = command !== "job" || (name === "quarter" && config.aiKeysSecret !== undefined);
const subjects = usesSubjects ? [compileMath(), compileEnglish(), compileChinese()] : [];
const conn = connect(config.databaseUrl, command === "job" ? 2 : 10);
const services = await openServices(config, conn.db, subjects);
console.log(`subjects ready in ${Math.round(performance.now() - started)} ms`);

if (command === "job") {
  if (!isJob(name)) throw new Error(`unknown job ${name}; the jobs are daily and quarter`);
  try {
    await runJob(services, name, Date.now());
  } finally {
    await conn.close();
  }
} else {
  const server = createServer(serve(createApi(services), config.apiUrl));
  // Longer than the load balancer's idle timeout, so that the server never closes a connection it is about to reuse.
  server.keepAliveTimeout = 65_000;
  server.listen(config.port, () => console.log(`listening on ${config.port}`));
  const stop = () => {
    console.log("stopping");
    server.close(() => void conn.close().then(() => process.exit(0)));
    server.closeIdleConnections();
    setTimeout(() => process.exit(0), 25_000).unref();
  };
  process.once("SIGTERM", stop);
  process.once("SIGINT", stop);
}
