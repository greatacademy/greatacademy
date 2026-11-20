// Grants the platform administrator role to an existing adult account, the only way to create the first
// administrator. Locally: pnpm nx run db:grant-admin -- someone@example.com; in the cluster the API server's image
// does the same (deploy/k8s/README.md).
import { grantAdminByEmail } from "./admin.ts";
import { connect } from "./db.ts";

const email = process.argv[2];
if (!email) throw new Error("usage: grant-admin <email>");
const conn = connect(process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:54329/greatacademy");
try {
  await grantAdminByEmail(conn.db, email, new Date());
  console.log("granted");
} finally {
  await conn.close();
}
