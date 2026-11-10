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

/**
 * emailSender sends through Resend when an API key is set. Without one, which
 * is how a local development server runs, it logs the message so that its link
 * can be followed.
 */
export function emailSender(apiKey: string | undefined, from: string): SendEmail {
  if (!apiKey) {
    return async (email) => {
      if (hasInbox(email.to)) console.log(`[email not sent: no RESEND_API_KEY] to ${email.to}\n${email.subject}\n${email.text}`);
    };
  }
  return async (email) => {
    if (!hasInbox(email.to)) return;
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({ from, to: email.to, subject: email.subject, text: email.text }),
    });
    if (!res.ok) throw new Error(`sending email failed with status ${res.status}`);
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
