import { describe, expect, it, vi } from "vitest";
import { type EmailSettings, emailProviders, emailSender, senderAddress } from "./email.ts";
import { resetPasswordEmail } from "./templates.ts";

const FROM = "Great Academy <noreply@mail.example.test>";
const email = resetPasswordEmail("guardian@example.test", "https://example.test/reset", "en");

const CLOUDFLARE = { accountId: "acc", token: "cf_test" };
const SEND = "https://api.cloudflare.com/client/v4/accounts/acc/email/sending/send";

/** services answers Cloudflare's and Resend's API with the given statuses, and records what each was sent. */
const services = (cloudflare: number, resend = 200, code = 10004) =>
  vi.fn(async (url: string | URL | Request, _init?: RequestInit) =>
    String(url) === SEND
      ? new Response(JSON.stringify(cloudflare < 300 ? { success: true } : { success: false, errors: [{ code }] }), { status: cloudflare })
      : new Response("{}", { status: resend }),
  );
const calls = (fetcher: ReturnType<typeof services>, url: string) => fetcher.mock.calls.filter(([u]) => String(u) === url);
const RESEND = "https://api.resend.com/emails";

const settings = (over: Partial<EmailSettings>): EmailSettings => ({
  provider: "",
  resendApiKey: undefined,
  cloudflare: undefined,
  from: FROM,
  ...over,
});

describe("emailProviders", () => {
  it("uses Resend when nothing is named and a key is set, and nothing without a key", () => {
    expect(emailProviders(settings({ resendApiKey: "re_test" }))).toEqual(["resend"]);
    expect(emailProviders(settings({ cloudflare: CLOUDFLARE }))).toEqual([]);
  });

  it("keeps the order EMAIL_PROVIDER lists", () => {
    const both = { resendApiKey: "re_test", cloudflare: CLOUDFLARE };
    expect(emailProviders(settings({ ...both, provider: "cloudflare" }))).toEqual(["cloudflare"]);
    expect(emailProviders(settings({ ...both, provider: " cloudflare , resend " }))).toEqual(["cloudflare", "resend"]);
    expect(emailProviders(settings({ ...both, provider: "resend,cloudflare" }))).toEqual(["resend", "cloudflare"]);
  });

  it("refuses an unknown or repeated provider, or one without what it needs", () => {
    expect(() => emailProviders(settings({ provider: "smtp" }))).toThrow(/smtp/);
    expect(() => emailProviders(settings({ provider: "resend,resend", resendApiKey: "re_test" }))).toThrow(/twice/);
    expect(() => emailProviders(settings({ provider: "resend" }))).toThrow(/RESEND_API_KEY/);
    expect(() => emailProviders(settings({ provider: "cloudflare" }))).toThrow(/CLOUDFLARE_EMAIL_TOKEN/);
  });
});

describe("senderAddress", () => {
  it("splits a named sender and keeps a bare address", () => {
    expect(senderAddress(FROM)).toEqual({ address: "noreply@mail.example.test", name: "Great Academy" });
    expect(senderAddress('"Great Academy" <a@example.test>')).toEqual({ address: "a@example.test", name: "Great Academy" });
    expect(senderAddress("<a@example.test>")).toBe("a@example.test");
    expect(senderAddress(" a@example.test ")).toBe("a@example.test");
  });
});

describe("emailSender", () => {
  it("sends through Cloudflare's API with the account token and the named sender", async () => {
    const fetcher = services(200);
    await emailSender(settings({ provider: "cloudflare", cloudflare: CLOUDFLARE }), fetcher)(email);
    const [[, init]] = calls(fetcher, SEND) as [[string, RequestInit]];
    expect((init.headers as Record<string, string>).authorization).toBe("Bearer cf_test");
    expect(JSON.parse(init.body as string)).toEqual({
      from: { address: "noreply@mail.example.test", name: "Great Academy" },
      to: "guardian@example.test",
      subject: email.subject,
      text: email.text,
      html: email.html,
    });
  });

  it("sends through Resend with the key and the sender as written", async () => {
    const fetcher = services(200);
    await emailSender(settings({ provider: "resend", resendApiKey: "re_test" }), fetcher)(email);
    const [[, init]] = calls(fetcher, RESEND) as [[string, RequestInit]];
    expect((init.headers as Record<string, string>).authorization).toBe("Bearer re_test");
    expect(JSON.parse(init.body as string)).toMatchObject({ from: FROM, to: "guardian@example.test" });
  });

  it("falls back to the second service on a rate limit or an outage", async () => {
    for (const status of [429, 500, 503]) {
      const fetcher = services(status);
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      await emailSender(settings({ provider: "cloudflare,resend", cloudflare: CLOUDFLARE, resendApiKey: "re_test" }), fetcher)(email);
      expect(calls(fetcher, RESEND)).toHaveLength(1);
      warn.mockRestore();
    }
    const fetcher = services(200, 503);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    await emailSender(settings({ provider: "resend,cloudflare", cloudflare: CLOUDFLARE, resendApiKey: "re_test" }), fetcher)(email);
    expect(calls(fetcher, SEND)).toHaveLength(1);
    warn.mockRestore();
  });

  it("does not fall back when the setup or the message is wrong", async () => {
    const refused = services(403, 200, 10102);
    const send = emailSender(settings({ provider: "cloudflare,resend", cloudflare: CLOUDFLARE, resendApiKey: "re_test" }), refused);
    await expect(send(email)).rejects.toThrow(/403 \(10102\)/);
    expect(calls(refused, RESEND)).toHaveLength(0);
    const fetcher = services(200, 422);
    await expect(
      emailSender(settings({ provider: "resend,cloudflare", cloudflare: CLOUDFLARE, resendApiKey: "re_test" }), fetcher)(email),
    ).rejects.toThrow(/422/);
    expect(calls(fetcher, SEND)).toHaveLength(0);
  });

  it("reports every failure when the last service fails too", async () => {
    const send = emailSender(
      settings({ provider: "cloudflare,resend", cloudflare: CLOUDFLARE, resendApiKey: "re_test" }),
      services(429, 500),
    );
    await expect(send(email)).rejects.toThrow(/429.*500/);
  });

  it("never mails a child's placeholder address, and logs when no service is set up", async () => {
    const fetcher = services(200);
    await emailSender(settings({ provider: "cloudflare", cloudflare: CLOUDFLARE }), fetcher)({ ...email, to: "kid@children.invalid" });
    expect(fetcher).not.toHaveBeenCalled();
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    await emailSender(settings({}))(email);
    expect(log).toHaveBeenCalledWith(expect.stringContaining("no EMAIL_PROVIDER"));
    log.mockRestore();
  });
});
