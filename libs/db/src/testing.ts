import { fileURLToPath } from "node:url";

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";

import type { Db } from "./db.ts";
import * as schema from "./schema/index.ts";

const migrationsFolder = fileURLToPath(new URL("../drizzle", import.meta.url));

/** createTestDb creates an in-memory PostgreSQL (PGlite) with every migration applied. */
export async function createTestDb(): Promise<Db & { close(): Promise<void> }> {
  const client = new PGlite();
  const db = drizzle(client, { schema });
  await migrate(db, { migrationsFolder });
  return Object.assign(db as unknown as Db, { close: () => client.close() });
}

/** createUser inserts an account holder, as better-auth would on sign-up. */
export async function createUser(db: Db, id: string, name = id): Promise<void> {
  await db.insert(schema.user).values({ id, name, email: `${id}@example.com` });
}
