const encoder = new TextEncoder();

/** keyFrom derives an AES-GCM key from a secret string. */
async function keyFrom(secret: string): Promise<CryptoKey> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(secret));
  return crypto.subtle.importKey("raw", digest, "AES-GCM", false, ["encrypt", "decrypt"]);
}

/** encryptSecret encrypts text under a secret, returning base64 of a random nonce followed by the cipher text. */
export async function encryptSecret(secret: string, text: string): Promise<string> {
  if (!secret) throw new Error("no encryption secret");
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await keyFrom(secret), encoder.encode(text)));
  const joined = new Uint8Array(iv.length + cipher.length);
  joined.set(iv);
  joined.set(cipher, iv.length);
  return btoa(String.fromCharCode(...joined));
}

/** decryptSecret reverses encryptSecret; a wrong secret or changed text throws. */
export async function decryptSecret(secret: string, sealed: string): Promise<string> {
  const joined = Uint8Array.from(atob(sealed), (c) => c.charCodeAt(0));
  const text = await crypto.subtle.decrypt({ name: "AES-GCM", iv: joined.slice(0, 12) }, await keyFrom(secret), joined.slice(12));
  return new TextDecoder().decode(text);
}
