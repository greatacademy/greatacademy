import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate as applyMigrations } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

import * as schema from "./schema/index.ts";

export { schema };

/** Db is a database or a transaction, whatever the driver: postgres.js in the API server, PGlite in tests. */
export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

/** Connection is a pool of database connections, closed when the process ends. */
export interface Connection {
  readonly db: Db;
  close(): Promise<void>;
}

/** connect opens a pool of at most max PostgreSQL connections, shared by every request of the process. */
export function connect(url: string, max = 5): Connection {
  const client = postgres(url, { max, fetch_types: false });
  return { db: drizzle(client, { schema }), close: () => client.end() };
}

/** migrate applies the migrations of folder (libs/db/drizzle) that the database lacks, on one connection of its own. */
export async function migrate(url: string, folder: string): Promise<void> {
  const client = postgres(url, { max: 1, fetch_types: false, onnotice: () => {} });
  try {
    await applyMigrations(drizzle(client), { migrationsFolder: folder });
  } finally {
    await client.end();
  }
}
