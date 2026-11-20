import type { Alarm, BillingReminder, NoticeKind } from "@ga/api";
import { describe, expect, it } from "vitest";
import {
  alarmEmail,
  billingEmail,
  type Email,
  type Locale,
  privacyEmail,
  requestLocale,
  resetPasswordEmail,
  verifyEmail,
} from "./templates.ts";

const TO = "guardian@example.test";
const han = /[一-鿿]/u;
const alarm: Alarm = {
  target: "Vendor/model",
  detail: "budget 2026-11 100%",
  text: "Vendor spent $10.00.",
  textZh: "Vendor 已花费 $10.00。",
};

const every = (locale: Locale): Email[] => [
  verifyEmail(TO, "https://example.test/verify?token=a&b=1", locale),
  resetPasswordEmail(TO, "https://example.test/reset", locale),
  ...(["consent-expiring", "child-reduced", "account-inactive", "verification-decided"] as NoticeKind[]).map((k) =>
    privacyEmail(TO, k, locale),
  ),
  ...(["renews-soon", "ends-soon"] as BillingReminder[]).map((k) => billingEmail(TO, k, locale)),
  alarmEmail(TO, alarm, locale),
];

describe("email templates", () => {
  it("writes each English email in English only", () => {
    for (const email of every("en")) {
      expect(email.subject, email.subject).not.toMatch(han);
      expect(email.text, email.subject).not.toMatch(han);
      expect(email.html, email.subject).not.toMatch(han);
      expect(email.html).toContain('lang="en"');
    }
  });

  it("writes each Chinese email in Chinese, with no English subject beside it", () => {
    for (const email of every("zh-CN")) {
      expect(email.subject, email.subject).toMatch(han);
      expect(email.subject, email.subject).not.toMatch(/ \/ /);
      expect(email.html).toContain('lang="zh-CN"');
      expect(email.text).toContain("这封邮件发送至");
    }
  });

  it("puts the link in the button, in the fallback line and in the text, escaped in HTML", () => {
    const email = verifyEmail(TO, "https://example.test/verify?token=a&b=1", "en");
    expect(email.html.match(/href="https:\/\/example\.test\/verify\?token=a&amp;b=1"/g)).toHaveLength(2);
    expect(email.text).toContain("https://example.test/verify?token=a&b=1");
  });

  it("escapes what it interpolates", () => {
    const email = alarmEmail(TO, { ...alarm, target: "<b>x</b>", text: "a & b" }, "en");
    expect(email.html).not.toContain("<b>x</b>");
    expect(email.html).toContain("&lt;b&gt;x&lt;/b&gt;");
    expect(email.html).toContain("a &amp; b");
  });

  it("links scheduled email to the site's pages", () => {
    expect(billingEmail(TO, "ends-soon", "en", "https://example.test").html).toContain('href="https://example.test/plans"');
    expect(privacyEmail(TO, "child-reduced", "zh-CN").text).toContain("https://greatacademy.dev/guardian");
  });
});

describe("requestLocale", () => {
  const h = (init: Record<string, string>) => new Headers(init);
  it("prefers the saved choice, then Accept-Language, else says nothing", () => {
    expect(requestLocale(h({ cookie: "a=1; ga-locale=zh-CN", "accept-language": "en-US" }))).toBe("zh-CN");
    expect(requestLocale(h({ cookie: "ga-locale=en", "accept-language": "zh-CN" }))).toBe("en");
    expect(requestLocale(h({ "accept-language": "zh-Hans-CN,zh;q=0.9" }))).toBe("zh-CN");
    expect(requestLocale(h({ "accept-language": "fr-FR" }))).toBe("en");
    expect(requestLocale(h({}))).toBeUndefined();
    expect(requestLocale(undefined)).toBeUndefined();
  });
});
