import { ConnectError } from "@connectrpc/connect";
import type { Text } from "@ga/proto/common/v1/text_pb";
import { locale } from "nsh";

import { AuthError } from "./auth.ts";

const language = (): "en" | "zh-CN" => (locale().startsWith("zh") ? "zh-CN" : "en");

/** tx picks the device's language from a localized text, falling back to English. */
export function tx(text: Text | undefined): string {
  return text?.values[language()] ?? text?.values.en ?? "";
}

const messages = {
  en: {
    account: "Account",
    ageBody: "We ask everyone these two things.",
    ageTitle: "Before you start",
    back: "Back",
    badLogin: "That email, username or password isn't right.",
    birthMonth: "Month of birth",
    birthYear: "Year of birth",
    choose: "Choose…",
    closedBody: "Great Academy isn't open to learners your age in your country or region yet. Your account and progress are kept.",
    closedTitle: "Not available yet",
    continue: "Continue",
    country: "Country or region",
    courses: "Courses",
    email: "Email",
    emailOrUsername: "Email or username",
    emailTaken: "An account with that email already exists.",
    error: "Something went wrong.",
    forgotPassword: "Forgot your password?",
    guardianBody:
      "Before you can study, a parent or guardian has to verify and agree. Make a code under Settings and give it to them, or ask them to check Learners if they already follow you.",
    guardianTitle: "A guardian needs to agree first",
    haveAccount: "Already have an account?",
    invalidDate: "That date is not valid.",
    legalPrivacy: "Privacy notice",
    loading: "Loading…",
    name: "Name",
    noAccount: "No account yet?",
    otherCountry: "Somewhere else",
    password: "Password",
    passwordHint: "At least 8 characters",
    retry: "Retry",
    settingsOnWeb: "Privacy and settings on the web",
    signIn: "Sign in",
    signOut: "Sign out",
    signUp: "Create account",
    signUpNotice: "By signing up you confirm you've read",
    soon: "Lessons in the app are coming soon.",
    stopBody:
      "Great Academy can't create this account. Show this page to a parent or guardian: they can make their own account and set you up from there, where we offer that.",
    stopClosed: "Accounts for learners your age aren't available in your country or region yet.",
    stopNote: "We didn't keep anything you entered.",
    stopTitle: "Please ask an adult",
    topics: (n: number) => `${n} topics`,
    weakPassword: "The password needs at least 8 characters.",
  },
  "zh-CN": {
    account: "账号",
    ageBody: "我们会问每个人这两个问题。",
    ageTitle: "开始之前",
    back: "返回",
    badLogin: "邮箱、用户名或密码不正确。",
    birthMonth: "出生月份",
    birthYear: "出生年份",
    choose: "请选择…",
    closedBody: "Great Academy 暂未在你所在的国家或地区向你这个年龄的学习者开放。你的账号和进度会保留。",
    closedTitle: "暂未开放",
    continue: "继续",
    country: "国家或地区",
    courses: "课程",
    email: "邮箱",
    emailOrUsername: "邮箱或用户名",
    emailTaken: "这个邮箱已有账号。",
    error: "出错了。",
    forgotPassword: "忘记密码？",
    guardianBody:
      "开始学习之前，需要父母或监护人完成验证并同意。请在“设置”中生成一个邀请码交给他们；如果他们已经关注你，请让他们查看“学习者”页面。",
    guardianTitle: "需要监护人先同意",
    haveAccount: "已有账号？",
    invalidDate: "这个日期无效。",
    legalPrivacy: "隐私声明",
    loading: "加载中…",
    name: "名字",
    noAccount: "还没有账号？",
    otherCountry: "其他地方",
    password: "密码",
    passwordHint: "至少 8 个字符",
    retry: "重试",
    settingsOnWeb: "在网页上管理隐私和设置",
    signIn: "登录",
    signOut: "退出登录",
    signUp: "注册",
    signUpNotice: "注册即表示你已阅读",
    soon: "应用内课程即将推出。",
    stopBody: "Great Academy 无法创建这个账号。请把这个页面给父母或监护人看：在我们提供此服务的地方，他们可以创建自己的账号，再为你设置。",
    stopClosed: "你所在的国家或地区暂时不提供你这个年龄的账号。",
    stopNote: "你输入的内容我们没有保存。",
    stopTitle: "请找一位成年人",
    topics: (n: number) => `${n} 个知识点`,
    weakPassword: "密码至少需要 8 个字符。",
  },
} as const;

/** m gives the app's own messages in the device's language. */
export const m = () => messages[language()];

// Intl.DisplayNames does not exist on QuickJS, so the markets are named here.
const regions: Record<string, { en: string; "zh-CN": string }> = {
  AU: { en: "Australia", "zh-CN": "澳大利亚" },
  BR: { en: "Brazil", "zh-CN": "巴西" },
  CA: { en: "Canada", "zh-CN": "加拿大" },
  CN: { en: "Mainland China", "zh-CN": "中国大陆" },
  HK: { en: "Hong Kong", "zh-CN": "香港" },
  JP: { en: "Japan", "zh-CN": "日本" },
  KR: { en: "South Korea", "zh-CN": "韩国" },
  SG: { en: "Singapore", "zh-CN": "新加坡" },
  TW: { en: "Taiwan", "zh-CN": "台湾" },
  US: { en: "United States", "zh-CN": "美国" },
};

/** regionName names a market in the device's language. */
export function regionName(code: string): string {
  return regions[code]?.[language()] ?? code;
}

const authMessages = {
  INVALID_EMAIL_OR_PASSWORD: "badLogin",
  INVALID_USERNAME_OR_PASSWORD: "badLogin",
  USER_ALREADY_EXISTS: "emailTaken",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "emailTaken",
  PASSWORD_TOO_SHORT: "weakPassword",
} as const;

/** errorText words a failed call for the person who made it. */
export function errorText(error: unknown): string {
  if (error instanceof AuthError) {
    const key = authMessages[error.code as keyof typeof authMessages];
    return key ? m()[key] : m().error;
  }
  return ConnectError.from(error).rawMessage === "that date is not valid" ? m().invalidDate : m().error;
}
