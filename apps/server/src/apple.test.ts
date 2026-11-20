import { afterEach, describe, expect, it, vi } from "vitest";

import { appStore, jwsPayload, notifiedTransaction } from "./apple.ts";

const b64url = (s: string) => btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const jws = (payload: object) => `${b64url('{"alg":"ES256"}')}.${b64url(JSON.stringify(payload))}.sig`;

const transaction = {
  transactionId: "2000",
  originalTransactionId: "1000",
  productId: "ga.all.month",
  bundleId: "dev.greatacademy.app",
  appAccountToken: "6f1c1f9e-5c0a-4a0e-9a57-3c8f1a2b4c5d",
  purchaseDate: 1_800_000_000_000,
  expiresDate: 1_802_000_000_000,
  price: 57990,
  currency: "USD",
  environment: "Sandbox",
};

async function pem(): Promise<string> {
  const pair = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
  const der = new Uint8Array(await crypto.subtle.exportKey("pkcs8", pair.privateKey));
  return `-----BEGIN PRIVATE KEY-----\n${btoa(String.fromCharCode(...der))}\n-----END PRIVATE KEY-----`;
}

afterEach(() => vi.unstubAllGlobals());

describe("App Store", () => {
  it("reads a notification's transaction, and nothing from anything else", () => {
    const body = { signedPayload: jws({ notificationType: "DID_RENEW", data: { signedTransactionInfo: jws(transaction) } }) };
    expect(notifiedTransaction(body)).toBe("2000");
    expect(notifiedTransaction({ signedPayload: jws({ notificationType: "TEST" }) })).toBeUndefined();
    expect(notifiedTransaction("nonsense")).toBeUndefined();
    expect(jwsPayload("a.!!!.c")).toBeUndefined();
  });

  it("asks production, then the sandbox, with a signed token, and reads prices in cents", async () => {
    const asked: { url: string; auth: string }[] = [];
    vi.stubGlobal("fetch", async (url: string, init: RequestInit) => {
      asked.push({ url, auth: new Headers(init.headers).get("authorization") ?? "" });
      if (url.startsWith("https://api.storekit.itunes")) return new Response("", { status: 404 });
      if (url.includes("/transactions/")) return Response.json({ signedTransactionInfo: jws(transaction) });
      return Response.json({
        data: [
          {
            lastTransactions: [
              {
                status: 1,
                signedTransactionInfo: jws(transaction),
                signedRenewalInfo: jws({ autoRenewStatus: 0, gracePeriodExpiresDate: 1_803_000_000_000 }),
              },
            ],
          },
        ],
      });
    });
    const store = appStore({ keyId: "KEY", issuerId: "ISSUER", privateKey: await pem() });
    const t = await store.transaction("2000");
    expect(t).toMatchObject({ transactionId: "2000", price: 5799, environment: "Sandbox", appAccountToken: transaction.appAccountToken });
    expect(asked.map((a) => a.url)).toEqual([
      "https://api.storekit.itunes.apple.com/inApps/v1/transactions/2000",
      "https://api.storekit-sandbox.itunes.apple.com/inApps/v1/transactions/2000",
    ]);
    const token = asked[0]!.auth.replace("Bearer ", "");
    expect(jwsPayload(token)).toMatchObject({ iss: "ISSUER", aud: "appstoreconnect-v1", bid: "dev.greatacademy.app" });
    expect(token.split(".")[2]).toMatch(/^[\w-]{86}$/);
    expect(await store.status("2000", "Sandbox")).toMatchObject({ renews: false, graceUntil: 1_803_000_000_000 });
  });
});
