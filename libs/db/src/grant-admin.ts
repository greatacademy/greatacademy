// Grants the platform administrator role to an existing adult account, the
// only way to create the first administrator. Run through Nx:
// pnpm nx run db:grant-admin -- someone@example.com
import { grantAdmin, logChange, userByEmail } from "./admin.ts";
import { connect } from "./db.ts";

const email = process.argv[2];
if (!email) throw new Error("usage: grant-admin <email>");
const conn = connect(process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:54329/greatacademy");
try {
  const found = await userByEmail(conn.db, email);
  if (!found) throw new Error("no account with that email");
  if (found.band !== "adult") throw new Error("only an account in the adult band can be an administrator; answer the age question first");
  const at = new Date();
  await grantAdmin(conn.db, found.id, null, at);
  await logChange(conn.db, { actor: "system", action: "admin.grant", target: found.id, detail: "command line", at });
  console.log("granted");
} finally {
  await conn.close();
}
