import type { Email } from "./templates.ts";

export type { Email } from "./templates.ts";

/** SendEmail delivers a message. */
export type SendEmail = (email: Email) => Promise<void>;

/** hasInbox tells a real address from the placeholder of a child's account, which must never be mailed. */
const hasInbox = (to: string) => !to.endsWith(".invalid");

/** CloudflareMail is the part of Cloudflare Email Service's send_email binding that the sender uses. */
export interface CloudflareMail {
  send(message: {
    from: string | { email: string; name: string };
    to: string;
    subject: string;
    text: string;
    html: string;
  }): Promise<unknown>;
}

/** EmailSettings holds EMAIL_PROVIDER, the credentials of each service and the sender address. */
export interface EmailSettings {
  /** provider lists "cloudflare" and "resend" in the order to try them, separated by commas; empty means Resend when a key is set. */
  readonly provider: string | undefined;
  readonly resendApiKey: string | undefined;
  readonly cloudflare: CloudflareMail | undefined;
  readonly from: string;
}

/** EmailProvider is a service that delivers email. */
export type EmailProvider = "resend" | "cloudflare";

/**
 * emailProviders lists the services to try, in order; an empty list means
 * none is set up. It throws on a provider it does not know, one named twice,
 * or one without what it needs.
 */
export function emailProviders(settings: EmailSettings): EmailProvider[] {
  const named = (settings.provider ?? "")
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p !== "");
  if (named.length === 0) return settings.resendApiKey ? ["resend"] : [];
  const providers: EmailProvider[] = [];
  for (const p of named) {
    if (p !== "resend" && p !== "cloudflare") throw new Error(`EMAIL_PROVIDER lists ${p}; only resend and cloudflare are known`);
    if (providers.includes(p)) throw new Error(`EMAIL_PROVIDER lists ${p} twice`);
    if (p === "resend" && !settings.resendApiKey) throw new Error("EMAIL_PROVIDER lists resend but RESEND_API_KEY is empty");
    if (p === "cloudflare" && !settings.cloudflare) throw new Error("EMAIL_PROVIDER lists cloudflare but the EMAIL binding is missing");
    providers.push(p);
  }
  return providers;
}

/** senderAddress splits "Name <address>" into the named address of Cloudflare's binding; a bare address stays as it is. */
export function senderAddress(from: string): string | { email: string; name: string } {
  const named = /^\s*(.*?)\s*<([^<>\s]+)>\s*$/.exec(from);
  if (!named?.[2]) return from.trim();
  const name = named[1]?.replace(/^"(.*)"$/, "$1") ?? "";
  return name === "" ? named[2] : { email: named[2], name };
}

/** SendFailure is a failed delivery; a passing one, such as a rate limit or an outage, lets the next service try. */
export class SendFailure extends Error {
  readonly passing: boolean;
  constructor(message: string, passing: boolean) {
    super(message);
    this.name = "SendFailure";
    this.passing = passing;
  }
}

/** PASSING_CLOUDFLARE_CODES are the codes of Cloudflare Email Service after which another service may try; the rest are mistakes of setup or of the message. */
const PASSING_CLOUDFLARE_CODES = new Set([
  "E_RATE_LIMIT_EXCEEDED",
  "E_DAILY_LIMIT_EXCEEDED",
  "E_DELIVERY_FAILED",
  "E_INTERNAL_SERVER_ERROR",
]);

const viaCloudflare =
  (mail: CloudflareMail, from: string): SendEmail =>
  async (email) => {
    try {
      await mail.send({ from: senderAddress(from), to: email.to, subject: email.subject, text: email.text, html: email.html });
    } catch (e) {
      const code = e instanceof Error && "code" in e && typeof e.code === "string" ? e.code : undefined;
      throw new SendFailure(`Cloudflare failed with ${code ?? "no code"}`, code === undefined || PASSING_CLOUDFLARE_CODES.has(code));
    }
  };

const viaResend =
  (apiKey: string, from: string, fetcher: typeof fetch): SendEmail =>
  async (email) => {
    let res: Response;
    try {
      res = await fetcher("https://api.resend.com/emails", {
        method: "POST",
        headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
        body: JSON.stringify({ from, to: email.to, subject: email.subject, text: email.text, html: email.html }),
      });
    } catch {
      throw new SendFailure("Resend could not be reached", true);
    }
    if (!res.ok) throw new SendFailure(`Resend failed with status ${res.status}`, res.status === 429 || res.status >= 500);
  };

/**
 * emailSender sends through the services EMAIL_PROVIDER lists, Cloudflare
 * Email Service and Resend: one alone, or both in order, the second trying
 * only when the first fails for a passing reason. Without any, which is how a
 * local development server runs, it logs the message so that its link can be
 * followed.
 */
export function emailSender(settings: EmailSettings, fetcher: typeof fetch = fetch): SendEmail {
  const services = emailProviders(settings).map((p) =>
    p === "cloudflare"
      ? { p, send: viaCloudflare(settings.cloudflare as CloudflareMail, settings.from) }
      : { p, send: viaResend(settings.resendApiKey as string, settings.from, fetcher) },
  );
  if (services.length === 0) {
    return async (email) => {
      if (hasInbox(email.to)) console.log(`[email not sent: no EMAIL_PROVIDER] to ${email.to}\n${email.subject}\n${email.text}`);
    };
  }
  return async (email) => {
    if (!hasInbox(email.to)) return;
    const failures: string[] = [];
    for (const [i, { p, send }] of services.entries()) {
      try {
        await send(email);
        if (failures.length > 0) console.warn(`email sent through ${p} after ${failures.join("; ")}`);
        return;
      } catch (e) {
        const failure = e instanceof SendFailure ? e : new SendFailure(`${p} failed`, true);
        failures.push(failure.message);
        if (!failure.passing || i === services.length - 1) throw new Error(`sending email failed: ${failures.join("; ")}`);
      }
    }
  };
}
