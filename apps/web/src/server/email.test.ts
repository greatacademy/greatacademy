import { describe, expect, it, vi } from "vitest";
import { type CloudflareMail, type EmailSettings, emailProviders, emailSender, resetPasswordEmail, senderAddress } from "./email.ts";

const FROM = "Great Academy <noreply@mail.example.test>";
const email = resetPasswordEmail("guardian@example.test", "https://example.test/reset");

const failing = (code: string) => {
  const error = Object.assign(new Error("failed"), { code });
  return { send: vi.fn(async () => Promise.reject(error)) };
};
const working = () => ({ send: vi.fn(async () => ({ messageId: "m-1" })) });
const resend = (status: number) => vi.fn(async () => new Response("{}", { status }));

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
    expect(emailProviders(settings({ cloudflare: working() }))).toEqual([]);
  });

  it("keeps the order EMAIL_PROVIDER lists", () => {
    const both = { resendApiKey: "re_test", cloudflare: working() };
    expect(emailProviders(settings({ ...both, provider: "cloudflare" }))).toEqual(["cloudflare"]);
    expect(emailProviders(settings({ ...both, provider: " cloudflare , resend " }))).toEqual(["cloudflare", "resend"]);
    expect(emailProviders(settings({ ...both, provider: "resend,cloudflare" }))).toEqual(["resend", "cloudflare"]);
  });

  it("refuses an unknown or repeated provider, or one without what it needs", () => {
    expect(() => emailProviders(settings({ provider: "smtp" }))).toThrow(/smtp/);
    expect(() => emailProviders(settings({ provider: "resend,resend", resendApiKey: "re_test" }))).toThrow(/twice/);
    expect(() => emailProviders(settings({ provider: "resend" }))).toThrow(/RESEND_API_KEY/);
    expect(() => emailProviders(settings({ provider: "cloudflare" }))).toThrow(/EMAIL binding/);
  });
});

describe("senderAddress", () => {
  it("splits a named sender and keeps a bare address", () => {
    expect(senderAddress(FROM)).toEqual({ email: "noreply@mail.example.test", name: "Great Academy" });
    expect(senderAddress('"Great Academy" <a@example.test>')).toEqual({ email: "a@example.test", name: "Great Academy" });
    expect(senderAddress("<a@example.test>")).toBe("a@example.test");
    expect(senderAddress(" a@example.test ")).toBe("a@example.test");
  });
});

describe("emailSender", () => {
  it("sends through Cloudflare with the named sender", async () => {
    const cloudflare = working();
    await emailSender(settings({ provider: "cloudflare", cloudflare }))(email);
    expect(cloudflare.send).toHaveBeenCalledWith({
      from: { email: "noreply@mail.example.test", name: "Great Academy" },
      to: "guardian@example.test",
      subject: email.subject,
      text: email.text,
    });
  });

  it("sends through Resend with the key and the sender as written", async () => {
    const fetcher = resend(200);
    await emailSender(settings({ provider: "resend", resendApiKey: "re_test" }), fetcher)(email);
    const [url, init] = fetcher.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    expect((init.headers as Record<string, string>).authorization).toBe("Bearer re_test");
    expect(JSON.parse(init.body as string)).toMatchObject({ from: FROM, to: "guardian@example.test" });
  });

  it("falls back to the second service on a rate limit, an outage or a failed delivery", async () => {
    for (const code of ["E_RATE_LIMIT_EXCEEDED", "E_DAILY_LIMIT_EXCEEDED", "E_DELIVERY_FAILED"]) {
      const fetcher = resend(200);
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      await emailSender(settings({ provider: "cloudflare,resend", cloudflare: failing(code), resendApiKey: "re_test" }), fetcher)(email);
      expect(fetcher).toHaveBeenCalledTimes(1);
      warn.mockRestore();
    }
    const cloudflare = working();
    await emailSender(settings({ provider: "resend,cloudflare", cloudflare, resendApiKey: "re_test" }), resend(503))(email);
    expect(cloudflare.send).toHaveBeenCalledTimes(1);
  });

  it("does not fall back when the setup or the message is wrong", async () => {
    const fetcher = resend(200);
    const send = emailSender(
      settings({ provider: "cloudflare,resend", cloudflare: failing("E_SENDER_NOT_VERIFIED"), resendApiKey: "re_test" }),
      fetcher,
    );
    await expect(send(email)).rejects.toThrow(/E_SENDER_NOT_VERIFIED/);
    expect(fetcher).not.toHaveBeenCalled();
    const cloudflare = working();
    await expect(
      emailSender(settings({ provider: "resend,cloudflare", cloudflare, resendApiKey: "re_test" }), resend(422))(email),
    ).rejects.toThrow(/422/);
    expect(cloudflare.send).not.toHaveBeenCalled();
  });

  it("reports every failure when the last service fails too", async () => {
    const send = emailSender(
      settings({ provider: "cloudflare,resend", cloudflare: failing("E_RATE_LIMIT_EXCEEDED"), resendApiKey: "re_test" }),
      resend(500),
    );
    await expect(send(email)).rejects.toThrow(/E_RATE_LIMIT_EXCEEDED.*500/);
  });

  it("never mails a child's placeholder address, and logs when no service is set up", async () => {
    const cloudflare: CloudflareMail = working();
    await emailSender(settings({ provider: "cloudflare", cloudflare }))({ ...email, to: "kid@children.invalid" });
    expect(cloudflare.send).not.toHaveBeenCalled();
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    await emailSender(settings({}))(email);
    expect(log).toHaveBeenCalledWith(expect.stringContaining("no EMAIL_PROVIDER"));
    log.mockRestore();
  });
});
