import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Packages the app for a server chosen at build time, since Native Shell has no
// build-time values: `pnpm nx run nsh:package -- --target macos [--api-url <url>] [nsh package flags]`.

const PRODUCTION = "https://greatacademy.dev";
const DEVELOPMENT = 'export const API_URL = "http://localhost:5173";';
const DESKTOPS = new Set(["macos", "windows", "linux"]);

const args = process.argv.slice(2).filter((arg) => arg !== "--");
const flag = (name: string): string | undefined => {
  const at = args.indexOf(name);
  return at < 0 ? undefined : args.splice(at, 2)[1];
};
const apiUrl = flag("--api-url") ?? PRODUCTION;
const target = args[args.indexOf("--target") + 1] ?? "";
if (!args.includes("--target")) throw new Error("--target is required");

// A desktop icon is a rounded tile with a margin; a phone rounds the square itself.
const icon = DESKTOPS.has(target) ? ["--icon", "assets/icon-desktop.png"] : [];

const rpc = fileURLToPath(new URL("../lib/rpc.ts", import.meta.url));
const source = readFileSync(rpc, "utf8");
if (!source.includes(DEVELOPMENT)) throw new Error("lib/rpc.ts no longer has the line this script replaces");

writeFileSync(rpc, source.replace(DEVELOPMENT, `export const API_URL = ${JSON.stringify(apiUrl)};`));
let status: number | null = 1;
try {
  status = spawnSync("nsh", ["package", ".", ...icon, ...args], {
    cwd: fileURLToPath(new URL("..", import.meta.url)),
    stdio: "inherit",
  }).status;
} finally {
  writeFileSync(rpc, source);
}
process.exit(status ?? 1);
