import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema/index.ts";

export { schema };

/** Db is a database or a transaction, whatever the driver: postgres.js in the Worker, PGlite in tests. */
export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

/** Connection is a database client that must be closed when the request ends. */
export interface Connection {
  readonly db: Db;
  close(): Promise<void>;
}

/**
 * connect opens a PostgreSQL client. In a Worker, url is the Hyperdrive
 * connection string and a client is opened per request: Hyperdrive pools the
 * connections, and a Worker may not share I/O objects across requests.
 */
export function connect(url: string): Connection {
  const client = postgres(url, { max: 5, fetch_types: false });
  return { db: drizzle(client, { schema }), close: () => client.end() };
}
