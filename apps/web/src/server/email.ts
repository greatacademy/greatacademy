import type { Alarm, BillingReminder, NoticeKind } from "@ga/api";

/** Email is a message to one address. */
export interface Email {
  readonly to: string;
  readonly subject: string;
  readonly text: string;
}

/** SendEmail delivers a message. */
export type SendEmail = (email: Email) => Promise<void>;

/** hasInbox tells a real address from the placeholder of a child's account, which must never be mailed. */
const hasInbox = (to: string) => !to.endsWith(".invalid");

/** CloudflareMail is the part of Cloudflare Email Service's send_email binding that the sender uses. */
export interface CloudflareMail {
  send(message: { from: string | { email: string; name: string }; to: string; subject: string; text: string }): Promise<unknown>;
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
      await mail.send({ from: senderAddress(from), to: email.to, subject: email.subject, text: email.text });
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
        body: JSON.stringify({ from, to: email.to, subject: email.subject, text: email.text }),
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

/** resetPasswordEmail is the message with a link to choose a new password, in both languages since the account has no language of its own. */
export function resetPasswordEmail(to: string, url: string): Email {
  return {
    to,
    subject: "Reset your Great Academy password / 重置 Great Academy 密码",
    text: `Follow this link within one hour to choose a new password. If you did not ask for this, ignore this email.\n请在一小时内打开此链接设置新密码。如果不是你本人操作，请忽略这封邮件。\n\n${url}\n`,
  };
}

/** verifyEmail is the message with a link that confirms an address, in both languages. */
export function verifyEmail(to: string, url: string): Email {
  return {
    to,
    subject: "Verify your Great Academy email / 验证 Great Academy 邮箱",
    text: `Follow this link to confirm your address, so that you can recover your account.\n请打开此链接确认邮箱，以便将来找回账号。\n\n${url}\n`,
  };
}

const privacyNotices: Record<NoticeKind, { subject: string; text: string }> = {
  "consent-expiring": {
    subject: "A Great Academy consent ends soon / Great Academy 的一项同意即将到期",
    text: "A consent you gave ends within 30 days. Renew it under Settings or Learners if study should continue.\n你给予的一项同意将在 30 天内到期。如需继续学习，请在“设置”或“学习者”中续期。",
  },
  "child-reduced": {
    subject: "A learner changed their privacy choices / 学习者更改了隐私选择",
    text: "A learner you guard turned something off or deleted some of their data. See the details under Learners.\n你监护的一位学习者关闭了某项功能或删除了部分数据。详情请查看“学习者”。",
  },
  "account-inactive": {
    subject: "An inactive Great Academy account will be deleted / 不活跃的 Great Academy 账号将被删除",
    text: "A minor's account has not been used for 12 months and will be deleted in 30 days. Sign in to keep it.\n一个未成年人账号已 12 个月未使用，将在 30 天后删除。如需保留，请登录。",
  },
  "verification-decided": {
    subject: "Your guardian verification was decided / 你的监护人验证已有结果",
    text: "See the result under Learners. The form you sent has been deleted.\n请在“学习者”中查看结果。你提交的表格已被删除。",
  },
};

/** privacyEmail is the message for a privacy notice, in both languages; it never names a learner or quotes their text. */
export function privacyEmail(to: string, kind: NoticeKind): Email {
  return { to, ...privacyNotices[kind] };
}

const billingReminders: Record<BillingReminder, { subject: string; text: string }> = {
  "renews-soon": {
    subject: "Your Great Academy plan renews soon / 你的 Great Academy 方案即将续费",
    text: "A plan you pay for renews within 7 days and your card will be charged. To stop it, cancel under Settings before then.\n你付费的一个方案将在 7 天内续费，并从你的银行卡扣款。如不想续费，请在此之前到“设置”中取消。",
  },
  "ends-soon": {
    subject: "Your Great Academy plan ends soon / 你的 Great Academy 方案即将到期",
    text: "A plan you pay for ends within 7 days. It does not renew by itself; pay for another period under Plans to keep studying.\n你付费的一个方案将在 7 天内到期，它不会自动续费；如需继续学习，请在“方案”中再购买一期。",
  },
};

/** billingEmail is the reminder before a plan renews or ends, in both languages. */
export function billingEmail(to: string, kind: BillingReminder): Email {
  return { to, ...billingReminders[kind] };
}

/** alarmEmail tells an administrator of a spending alarm; its text names vendors and sums, never learners. */
export function alarmEmail(to: string, alarm: Alarm): Email {
  return {
    to,
    subject: `Great Academy AI spending alarm / AI 费用告警: ${alarm.target}`,
    text: `${alarm.text}\n\n费用告警：${alarm.target}（${alarm.detail}）。详情见管理后台 /admin/ai。\nSee /admin/ai in the admin console.`,
  };
}
