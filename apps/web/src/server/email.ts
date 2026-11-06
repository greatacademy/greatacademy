/** Email is a message to one address. */
export interface Email {
  readonly to: string;
  readonly subject: string;
  readonly text: string;
}

/** SendEmail delivers a message. */
export type SendEmail = (email: Email) => Promise<void>;

/**
 * emailSender sends through Resend when an API key is set. Without one, which
 * is how a local development server runs, it logs the message so that its link
 * can be followed.
 */
export function emailSender(apiKey: string | undefined, from: string): SendEmail {
  if (!apiKey) {
    return async (email) => console.log(`[email not sent: no RESEND_API_KEY] to ${email.to}\n${email.subject}\n${email.text}`);
  }
  return async (email) => {
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
