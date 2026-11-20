import type { Alarm, BillingReminder, NoticeKind } from "@ga/api";

/** Locale is a language email is written in; each message is in one language only. */
export type Locale = "en" | "zh-CN";

/** Email is a message to one address, as plain text and as HTML. */
export interface Email {
  readonly to: string;
  readonly subject: string;
  readonly text: string;
  readonly html: string;
}

/** SITE is the address links in scheduled email lead to; email sent in answer to a request links to that request's site. */
export const SITE = "https://greatacademy.dev";

const LOCALE_COOKIE = "ga-locale";

/**
 * requestLocale is the language a request was made in: the web's language
 * switch, saved in a cookie, else the Accept-Language header, which the
 * native apps set to their own language. It is undefined when the request
 * says nothing.
 */
export function requestLocale(headers: Headers | undefined): Locale | undefined {
  const cookie = headers?.get("cookie") ?? "";
  const saved = new RegExp(`(?:^|;\\s*)${LOCALE_COOKIE}=([^;]+)`).exec(cookie)?.[1];
  if (saved === "en" || saved === "zh-CN") return saved;
  const accept = headers?.get("accept-language")?.trim();
  if (!accept) return undefined;
  return /^zh\b/i.test(accept) ? "zh-CN" : "en";
}

// The colors of the default light palette and the mark (libs/design), fixed so that every mail client shows them.
const C = {
  page: "#f4f5f8",
  surface: "#ffffff",
  line: "#dbdee5",
  ink: "#1b1f29",
  muted: "#5e636f",
  accent: "#3655cd",
  onAccent: "#ffffff",
  shield: "#8a1f3f",
} as const;

const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'PingFang SC','Hiragino Sans GB','Microsoft YaHei','Noto Sans CJK SC',sans-serif";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** Message is the content of one email in one language, which layout turns into its text and HTML. */
interface Message {
  readonly subject: string;
  /** preheader is the line mail clients show after the subject in the inbox. */
  readonly preheader: string;
  readonly heading: string;
  readonly paragraphs: readonly string[];
  readonly action?: { readonly label: string; readonly url: string };
  /** note is the smaller text below the button: how long a link lasts, or what to do if the email was not expected. */
  readonly note?: string;
}

const chrome: Record<Locale, { copyLink: string; footer: (to: string) => string; sentBy: string }> = {
  en: {
    copyLink: "If the button doesn't work, copy this link into your browser:",
    footer: (to) => `This email was sent to ${to} about your Great Academy account.`,
    sentBy: "Great Academy",
  },
  "zh-CN": {
    copyLink: "如果按钮无法打开，请把下面的链接复制到浏览器中：",
    footer: (to) => `这封邮件发送至 ${to}，与你的 Great Academy 账号有关。`,
    sentBy: "Great Academy",
  },
};

function text(locale: Locale, to: string, m: Message): string {
  const lines = [m.heading, "", ...m.paragraphs.flatMap((p) => [p, ""])];
  if (m.action) lines.push(`${m.action.label}${locale === "zh-CN" ? "：" : ":"}`, m.action.url, "");
  if (m.note) lines.push(m.note, "");
  lines.push("—", chrome[locale].sentBy, chrome[locale].footer(to));
  return `${lines.join("\n")}\n`;
}

function html(locale: Locale, to: string, m: Message): string {
  const c = chrome[locale];
  const p = (s: string) => `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:${C.ink};">${esc(s)}</p>`;
  const button = m.action
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px;"><tr>
<td align="center" bgcolor="${C.accent}" style="border-radius:8px;background:${C.accent};">
<a href="${esc(m.action.url)}" target="_blank" style="display:inline-block;padding:13px 24px;font-family:${FONT};font-size:16px;font-weight:600;line-height:1.2;color:${C.onAccent};text-decoration:none;border-radius:8px;">${esc(m.action.label)}</a>
</td></tr></table>`
    : "";
  const note = m.note ? `<p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:${C.muted};">${esc(m.note)}</p>` : "";
  const fallback = m.action
    ? `<p style="margin:16px 0 0;padding-top:16px;border-top:1px solid ${C.line};font-size:13px;line-height:1.6;color:${C.muted};">${esc(c.copyLink)}<br>
<a href="${esc(m.action.url)}" target="_blank" style="color:${C.accent};word-break:break-all;">${esc(m.action.url)}</a></p>`
    : "";
  return `<!doctype html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(m.subject)}</title>
</head>
<body style="margin:0;padding:0;background:${C.page};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(m.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.page};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;font-family:${FONT};">
<tr><td style="padding:0 4px 20px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td width="32" height="32" align="center" valign="middle" bgcolor="${C.shield}" style="width:32px;height:32px;border-radius:8px;background:${C.shield};color:#ffffff;font-family:${FONT};font-size:18px;font-weight:700;line-height:32px;">G</td>
<td style="padding-left:10px;font-family:${FONT};font-size:17px;font-weight:600;color:${C.ink};">Great Academy</td>
</tr></table>
</td></tr>
<tr><td style="background:${C.surface};border:1px solid ${C.line};border-radius:12px;padding:32px;">
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.35;font-weight:600;color:${C.ink};">${esc(m.heading)}</h1>
${m.paragraphs.map(p).join("\n")}
${button}
${note}
${fallback}
</td></tr>
<tr><td style="padding:20px 4px 0;font-size:12px;line-height:1.6;color:${C.muted};">${esc(c.footer(to))}</td></tr>
</table>
</td></tr>
</table>
</body>
</html>
`;
}

const compose = (to: string, locale: Locale, m: Message): Email => ({
  to,
  subject: m.subject,
  text: text(locale, to, m),
  html: html(locale, to, m),
});

/** verifyEmail asks a new account to confirm its address, so that the account can be recovered. */
export function verifyEmail(to: string, url: string, locale: Locale): Email {
  return compose(
    to,
    locale,
    locale === "zh-CN"
      ? {
          subject: "请确认你的邮箱地址",
          preheader: "确认后，忘记密码时也能找回账号。",
          heading: "确认你的邮箱地址",
          paragraphs: ["欢迎加入 Great Academy。请确认这个邮箱属于你，这样将来忘记密码时，你可以用它找回账号。"],
          action: { label: "确认邮箱", url },
          note: "如果你没有注册过 Great Academy，忽略这封邮件即可。",
        }
      : {
          subject: "Confirm your email address",
          preheader: "So that you can always get back into your account.",
          heading: "Confirm your email address",
          paragraphs: [
            "Welcome to Great Academy. Confirm that this address is yours, so that you can get back into your account if you ever forget your password.",
          ],
          action: { label: "Confirm email address", url },
          note: "If you didn't sign up for Great Academy, you can ignore this email.",
        },
  );
}

/** resetPasswordEmail carries the link to choose a new password, which lasts an hour. */
export function resetPasswordEmail(to: string, url: string, locale: Locale): Email {
  return compose(
    to,
    locale,
    locale === "zh-CN"
      ? {
          subject: "重置你的密码",
          preheader: "链接一小时内有效。",
          heading: "重置密码",
          paragraphs: ["我们收到了重置你 Great Academy 账号密码的请求。点击下方按钮设置新密码。"],
          action: { label: "设置新密码", url },
          note: "链接一小时内有效，且只能使用一次。如果不是你本人操作，请忽略这封邮件，你的密码不会改变。",
        }
      : {
          subject: "Reset your password",
          preheader: "The link works for one hour.",
          heading: "Reset your password",
          paragraphs: [
            "We received a request to reset the password of your Great Academy account. Use the button below to choose a new one.",
          ],
          action: { label: "Choose a new password", url },
          note: "The link works once, within one hour. If you didn't ask for this, ignore this email; your password stays the same.",
        },
  );
}

type Copy = Omit<Message, "action"> & { readonly action?: { readonly label: string; readonly path: string } };

const privacyNotices: Record<NoticeKind, Record<Locale, Copy>> = {
  "consent-expiring": {
    en: {
      subject: "A consent you gave ends in 30 days",
      preheader: "Renew it to keep learning without a break.",
      heading: "A consent ends soon",
      paragraphs: [
        "A consent you gave on Great Academy ends within 30 days. If learning should continue, renew it before then; until it ends, nothing changes.",
      ],
      action: { label: "Review consents", path: "/settings" },
      note: "A consent you gave for a learner you look after is on their page under Learners.",
    },
    "zh-CN": {
      subject: "你给予的一项同意将在 30 天后到期",
      preheader: "续期后学习不会中断。",
      heading: "一项同意即将到期",
      paragraphs: ["你在 Great Academy 给予的一项同意将在 30 天内到期。如需继续学习，请在到期前续期；到期之前一切照常。"],
      action: { label: "查看同意", path: "/settings" },
      note: "为你监护的学习者给予的同意，可在“学习者”中对应的页面查看。",
    },
  },
  "child-reduced": {
    en: {
      subject: "A learner changed their privacy choices",
      preheader: "See what changed on the Learners page.",
      heading: "A learner changed their privacy choices",
      paragraphs: [
        "A learner you look after turned off a feature or deleted some of their data. You can see what changed on the Learners page.",
      ],
      action: { label: "Open Learners", path: "/guardian" },
    },
    "zh-CN": {
      subject: "一位学习者更改了隐私选择",
      preheader: "在“学习者”页面查看变化。",
      heading: "一位学习者更改了隐私选择",
      paragraphs: ["你监护的一位学习者关闭了某项功能，或删除了部分数据。你可以在“学习者”页面查看具体变化。"],
      action: { label: "打开学习者页面", path: "/guardian" },
    },
  },
  "account-inactive": {
    en: {
      subject: "An inactive account will be deleted in 30 days",
      preheader: "Sign in once to keep it.",
      heading: "An inactive account will be deleted",
      paragraphs: [
        "A young learner's account on Great Academy hasn't been used for 12 months. To keep their data no longer than needed, we'll delete it in 30 days.",
        "To keep the account and its progress, sign in to it once before then.",
      ],
      action: { label: "Sign in", path: "/sign-in" },
    },
    "zh-CN": {
      subject: "一个不活跃的账号将在 30 天后删除",
      preheader: "登录一次即可保留。",
      heading: "一个不活跃的账号将被删除",
      paragraphs: [
        "Great Academy 上一个未成年学习者的账号已有 12 个月未使用。为了不过久保存他们的数据，我们将在 30 天后删除这个账号。",
        "如需保留账号和学习进度，请在此之前登录一次。",
      ],
      action: { label: "登录", path: "/sign-in" },
    },
  },
  "verification-decided": {
    en: {
      subject: "Your guardian verification has been decided",
      preheader: "See the result on the Learners page.",
      heading: "Your guardian verification has been decided",
      paragraphs: [
        "We've reviewed the form you sent to show that you're a parent or guardian. You can see the result on the Learners page.",
        "For your privacy, the form itself has been deleted.",
      ],
      action: { label: "See the result", path: "/guardian" },
    },
    "zh-CN": {
      subject: "你的监护人验证已有结果",
      preheader: "在“学习者”页面查看结果。",
      heading: "你的监护人验证已有结果",
      paragraphs: ["我们已审核你提交的家长或监护人证明表格，你可以在“学习者”页面查看结果。", "为保护你的隐私，表格本身已被删除。"],
      action: { label: "查看结果", path: "/guardian" },
    },
  },
};

const billingReminders: Record<BillingReminder, Record<Locale, Copy>> = {
  "renews-soon": {
    en: {
      subject: "Your plan renews in 7 days",
      preheader: "Nothing to do if you'd like to keep studying.",
      heading: "Your plan renews soon",
      paragraphs: [
        "A Great Academy plan you pay for renews within 7 days, and your card will be charged then.",
        "To keep studying, you don't need to do anything. To stop the renewal, cancel it in Settings before then.",
      ],
      action: { label: "Manage your plan", path: "/settings" },
    },
    "zh-CN": {
      subject: "你的方案将在 7 天后续费",
      preheader: "继续学习无需任何操作。",
      heading: "你的方案即将续费",
      paragraphs: [
        "你付费的一个 Great Academy 方案将在 7 天内续费，届时会从你的银行卡扣款。",
        "如需继续学习，无需任何操作；如不想续费，请在此之前到“设置”中取消。",
      ],
      action: { label: "管理方案", path: "/settings" },
    },
  },
  "ends-soon": {
    en: {
      subject: "Your plan ends in 7 days",
      preheader: "It won't renew by itself.",
      heading: "Your plan ends soon",
      paragraphs: [
        "A Great Academy plan you pay for ends within 7 days, and it won't renew by itself.",
        "To keep studying without a break, buy another period on the Plans page.",
      ],
      action: { label: "See plans", path: "/plans" },
    },
    "zh-CN": {
      subject: "你的方案将在 7 天后到期",
      preheader: "它不会自动续费。",
      heading: "你的方案即将到期",
      paragraphs: [
        "你付费的一个 Great Academy 方案将在 7 天内到期，并且不会自动续费。",
        "如需不间断地继续学习，请在“方案”页面再购买一期。",
      ],
      action: { label: "查看方案", path: "/plans" },
    },
  },
};

const withSite = (copy: Copy, site: string): Message => ({
  ...copy,
  action: copy.action && { label: copy.action.label, url: `${site}${copy.action.path}` },
});

/** privacyEmail is the message for a privacy notice; it never names a learner or quotes their text. */
export function privacyEmail(to: string, kind: NoticeKind, locale: Locale, site = SITE): Email {
  return compose(to, locale, withSite(privacyNotices[kind][locale], site));
}

/** billingEmail is the reminder before a plan renews or ends. */
export function billingEmail(to: string, kind: BillingReminder, locale: Locale, site = SITE): Email {
  return compose(to, locale, withSite(billingReminders[kind][locale], site));
}

/** alarmEmail tells an administrator of a spending alarm; its text names vendors and sums, never learners. */
export function alarmEmail(to: string, alarm: Alarm, locale: Locale, site = SITE): Email {
  const url = `${site}/admin/ai`;
  return compose(
    to,
    locale,
    locale === "zh-CN"
      ? {
          subject: `AI 费用告警：${alarm.target}`,
          preheader: alarm.textZh,
          heading: "AI 费用告警",
          paragraphs: [alarm.textZh, `告警：${alarm.detail}`],
          action: { label: "打开 AI 费用", url },
          note: "同一告警只发送一次。你收到这封邮件，是因为你是 Great Academy 的管理员。",
        }
      : {
          subject: `AI spending alarm: ${alarm.target}`,
          preheader: alarm.text,
          heading: "AI spending alarm",
          paragraphs: [alarm.text, `Alarm: ${alarm.detail}`],
          action: { label: "Open AI costs", url },
          note: "Each alarm is sent once. You're receiving this because you're an administrator of Great Academy.",
        },
  );
}
