import { Code, ConnectError } from "@connectrpc/connect";
import { resource, signal } from "nsh";

import { netFetch } from "./net.ts";
import { API_URL, privacy } from "./rpc.ts";
import { setToken, token } from "./session.ts";

/** AgeAnswer is what the age question collects; it is sent to the server, which keeps only the band. */
export interface AgeAnswer {
  readonly country: string;
  readonly birthYear: number;
  readonly birthMonth: number;
}

/** AuthError is a refusal from the account service, with its code for wording it. */
export class AuthError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

async function post(path: string, body: unknown): Promise<Response> {
  // better-auth checks Origin once a request carries a cookie, which the platform's network stack may add.
  const headers: Record<string, string> = { "Content-Type": "application/json", Origin: API_URL };
  const current = token();
  if (current) headers.Authorization = `Bearer ${current}`;
  return netFetch(`${API_URL}/api/auth${path}`, { method: "POST", headers, body: JSON.stringify(body) });
}

async function startSession(path: string, body: unknown): Promise<void> {
  const response = await post(path, body);
  const data = (await response.json().catch(() => ({}))) as { code?: string; message?: string };
  if (!response.ok) throw new AuthError(data.code ?? "", data.message ?? "");
  const issued = response.headers.get("set-auth-token");
  if (!issued) throw new AuthError("", "no session token");
  setToken(issued);
}

/** signIn starts a session with an email address, or with the username of a child's account. */
export function signIn(login: string, password: string): Promise<void> {
  const name = login.trim();
  return name.includes("@")
    ? startSession("/sign-in/email", { email: name, password })
    : startSession("/sign-in/username", { username: name.toLowerCase(), password });
}

// While sign-up stores the age answer, the new account's access waits, since it would still say to answer.
const settingUp = signal(false);

/** signUp creates an account, starts its session and stores the age answer; if that fails, the account answers again on the age page. */
export async function signUp(name: string, email: string, password: string, age: AgeAnswer): Promise<void> {
  settingUp.set(true);
  try {
    await startSession("/sign-up/email", { name, email: email.trim(), password });
    await privacy.setAge(age).catch(() => undefined);
  } finally {
    settingUp.set(false);
  }
}

/** requestPasswordReset asks for an email with a link to choose a new password, which opens on the web. */
export async function requestPasswordReset(email: string): Promise<void> {
  const response = await post("/request-password-reset", { email: email.trim(), redirectTo: `${API_URL}/reset-password` });
  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { code?: string; message?: string };
    throw new AuthError(data.code ?? "", data.message ?? "");
  }
}

/** deleteAccount deletes the signed-in account for good, once its password is confirmed, and signs out on the device. */
export async function deleteAccount(password: string): Promise<void> {
  const response = await post("/delete-user", { password });
  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { code?: string; message?: string };
    throw new AuthError(data.code ?? "", data.message ?? "");
  }
  setToken(null);
}

/** signOut ends the session on the server when it can, and always on the device. */
export async function signOut(): Promise<void> {
  await post("/sign-out", {}).catch(() => undefined);
  setToken(null);
}

/** access is what the signed-in person may do now; a session the server no longer accepts signs out. */
export const access = resource(
  () => !settingUp() && token(),
  async (_, { signal }) => {
    try {
      return await privacy.getAccess({}, { signal });
    } catch (error) {
      if (ConnectError.from(error).code === Code.Unauthenticated) setToken(null);
      throw error;
    }
  },
);
