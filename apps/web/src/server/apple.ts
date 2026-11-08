import { APPLE_BUNDLE, type AppleStatus, type AppleTransaction, type AppStore } from "@ga/api";

/** AppleKeys are the App Store Server API key's id, issuer and private key (PEM), from App Store Connect (docs/billing.md §10). */
export interface AppleKeys {
  readonly keyId: string;
  readonly issuerId: string;
  readonly privateKey: string;
}

const HOSTS = {
  Production: "https://api.storekit.itunes.apple.com",
  Sandbox: "https://api.storekit-sandbox.itunes.apple.com",
} as const;

const base64url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
const text = (s: string) => base64url(new TextEncoder().encode(s));

/** jwsPayload reads a JWS's payload without checking its signature; only answers that came from Apple over TLS are trusted. */
export function jwsPayload(jws: string): Record<string, unknown> | undefined {
  const part = jws.split(".")[1];
  if (!part) return undefined;
  try {
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    const bytes = Uint8Array.from(json, (c) => c.charCodeAt(0));
    const value: unknown = JSON.parse(new TextDecoder().decode(bytes));
    return value && typeof value === "object" ? (value as Record<string, unknown>) : undefined;
  } catch {
    return undefined;
  }
}

const str = (v: unknown) => (typeof v === "string" ? v : undefined);
const num = (v: unknown) => (typeof v === "number" ? v : undefined);

/** transactionOf reads a decoded transaction; the price, in thousandths, becomes cents. */
function transactionOf(p: Record<string, unknown> | undefined): AppleTransaction | undefined {
  if (!p) return undefined;
  const transactionId = str(p.transactionId);
  const originalTransactionId = str(p.originalTransactionId);
  const productId = str(p.productId);
  const bundleId = str(p.bundleId);
  const purchaseDate = num(p.purchaseDate);
  const environment = p.environment === "Sandbox" ? "Sandbox" : p.environment === "Production" ? "Production" : undefined;
  if (!transactionId || !originalTransactionId || !productId || !bundleId || purchaseDate === undefined || !environment) return undefined;
  const token = str(p.appAccountToken);
  const revoked = num(p.revocationDate);
  return {
    transactionId,
    originalTransactionId,
    productId,
    bundleId,
    ...(token && { appAccountToken: token }),
    purchaseDate,
    expiresDate: num(p.expiresDate) ?? purchaseDate,
    ...(revoked !== undefined && { revocationDate: revoked }),
    price: Math.round((num(p.price) ?? 0) / 10),
    currency: str(p.currency) ?? "USD",
    environment,
  };
}

/** appStore implements AppStore with the App Store Server API, signing each request with the key. */
export function appStore(keys: AppleKeys): AppStore {
  let signing: Promise<CryptoKey> | undefined;
  const key = () => {
    signing ??= (async () => {
      const pem = keys.privateKey.replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
      const der = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));
      return crypto.subtle.importKey("pkcs8", der, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
    })();
    return signing;
  };
  const token = async () => {
    const now = Math.floor(Date.now() / 1000);
    const head = text(JSON.stringify({ alg: "ES256", kid: keys.keyId, typ: "JWT" }));
    const body = text(JSON.stringify({ iss: keys.issuerId, iat: now, exp: now + 300, aud: "appstoreconnect-v1", bid: APPLE_BUNDLE }));
    const signature = await crypto.subtle.sign(
      { name: "ECDSA", hash: "SHA-256" },
      await key(),
      new TextEncoder().encode(`${head}.${body}`),
    );
    return `${head}.${body}.${base64url(new Uint8Array(signature))}`;
  };
  const get = async (environment: keyof typeof HOSTS, path: string): Promise<Record<string, unknown> | undefined> => {
    const response = await fetch(`${HOSTS[environment]}${path}`, { headers: { authorization: `Bearer ${await token()}` } });
    if (response.status === 404) return undefined;
    if (!response.ok) throw new Error(`App Store Server API answered ${response.status}`);
    return (await response.json()) as Record<string, unknown>;
  };

  return {
    async transaction(id) {
      // Apple's advice: ask production first, then the sandbox, where App Review and testers buy.
      for (const environment of ["Production", "Sandbox"] as const) {
        const answer = await get(environment, `/inApps/v1/transactions/${encodeURIComponent(id)}`);
        const signed = str(answer?.signedTransactionInfo);
        if (signed) return transactionOf(jwsPayload(signed));
      }
      return undefined;
    },

    async status(id, environment): Promise<AppleStatus | undefined> {
      const answer = await get(environment, `/inApps/v1/subscriptions/${encodeURIComponent(id)}`);
      const groups = Array.isArray(answer?.data) ? (answer.data as Record<string, unknown>[]) : [];
      for (const group of groups) {
        const last = Array.isArray(group.lastTransactions) ? (group.lastTransactions as Record<string, unknown>[]) : [];
        for (const entry of last) {
          const latest = transactionOf(jwsPayload(str(entry.signedTransactionInfo) ?? ""));
          if (!latest) continue;
          const renewal = jwsPayload(str(entry.signedRenewalInfo) ?? "");
          const grace = num(renewal?.gracePeriodExpiresDate);
          return { latest, renews: renewal?.autoRenewStatus === 1, ...(grace !== undefined && { graceUntil: grace }) };
        }
      }
      return undefined;
    },
  };
}

/**
 * notifiedTransaction reads the transaction id out of an App Store Server Notification V2. Its signature is not
 * checked: the id is only a question to ask Apple, whose answer is what counts.
 */
export function notifiedTransaction(body: unknown): string | undefined {
  const signed = body && typeof body === "object" ? str((body as Record<string, unknown>).signedPayload) : undefined;
  const payload = signed ? jwsPayload(signed) : undefined;
  const data = payload?.data && typeof payload.data === "object" ? (payload.data as Record<string, unknown>) : undefined;
  const transaction = data ? jwsPayload(str(data.signedTransactionInfo) ?? "") : undefined;
  return str(transaction?.transactionId);
}
