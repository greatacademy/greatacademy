import { ConnectError } from "@connectrpc/connect";

import { errorText, language } from "./i18n.ts";

// The wording of the plans page, which sells App Store subscriptions on iOS (docs/billing.md §8).

const en = {
  plans: "Plans",
  plansDetail: "Subscribe in the App Store",
  plansBody: "A plan renews automatically through your Apple account until you turn it off in its subscriptions.",
  forWhom: "Who it is for",
  forSelf: "Me",
  forChild: "A child I'll add",
  oneApple: "An Apple account holds one subscription here, which stays with the learner it was bought for.",
  interval: "Billing",
  monthly: "Monthly",
  yearly: "Yearly",
  perMonth: "/ month",
  perYear: "/ year",
  allSubjects: "Every subject",
  oneSubject: "One subject",
  owned: "Owned",
  agreeTerms: "I agree to the Terms of Service.",
  agreeRenewal: "I understand the plan renews automatically until I cancel it in my Apple account.",
  agreeRefund: "I understand refunds for App Store purchases are requested from Apple.",
  subscribe: "Subscribe",
  restore: "Restore purchases",
  manage: "Manage subscriptions",
  terms: "Terms of Service",
  privacy: "Privacy notice",
  current: "Your App Store subscription",
  renews: (date: string) => `Renews on ${date}`,
  ends: (date: string) => `Ends on ${date}`,
  waitingChild: "for the next child you add",
  done: "Thank you. The plan is active.",
  doneChild: "Thank you. The plan starts when you add the child.",
  pending: "The purchase is waiting for approval. The plan starts once Apple confirms it.",
  restored: (n: number) => (n === 1 ? "Restored 1 purchase." : `Restored ${n} purchases.`),
  nothingRestored: "This Apple account has no purchases to restore.",
  adultOnly: "Only an adult can subscribe. Ask a parent or guardian to buy a plan for you.",
  unavailable: "Purchases are not available on this device.",
  free: "Study is free for now: no plan is needed.",
  seePlans: "See plans",
  oneSubscription: "This Apple account already holds a subscription here, for another learner.",
  onlyUp: "An App Store subject plan can only move up to every subject.",
  alreadyCovered: "This learner already has a plan for that.",
  notSetUp: "App Store purchases are not set up yet.",
};

const zh: typeof en = {
  plans: "订阅方案",
  plansDetail: "在 App Store 订阅",
  plansBody: "方案通过你的 Apple 账号自动续订，直到你在 Apple 账号的订阅中关闭。",
  forWhom: "为谁购买",
  forSelf: "我自己",
  forChild: "即将添加的孩子",
  oneApple: "一个 Apple 账号在这里只能持有一份订阅，并始终归属于购买时选择的学习者。",
  interval: "计费周期",
  monthly: "按月",
  yearly: "按年",
  perMonth: "/ 月",
  perYear: "/ 年",
  allSubjects: "全部学科",
  oneSubject: "单个学科",
  owned: "已拥有",
  agreeTerms: "我同意服务条款。",
  agreeRenewal: "我知道方案会自动续订，直到我在 Apple 账号中取消。",
  agreeRefund: "我知道 App Store 购买的退款需向 Apple 申请。",
  subscribe: "订阅",
  restore: "恢复购买",
  manage: "管理订阅",
  terms: "服务条款",
  privacy: "隐私声明",
  current: "你的 App Store 订阅",
  renews: (date) => `${date} 续费`,
  ends: (date) => `${date} 结束`,
  waitingChild: "给下一个添加的孩子",
  done: "谢谢，方案已生效。",
  doneChild: "谢谢，添加孩子后方案即生效。",
  pending: "购买正在等待批准，Apple 确认后方案生效。",
  restored: (n) => `已恢复 ${n} 笔购买。`,
  nothingRestored: "这个 Apple 账号没有可恢复的购买。",
  adultOnly: "只有成年人可以订阅。请家长或监护人为你购买方案。",
  unavailable: "这台设备不能购买。",
  free: "目前学习免费，不需要方案。",
  seePlans: "查看方案",
  oneSubscription: "这个 Apple 账号已在这里为另一位学习者持有订阅。",
  onlyUp: "App Store 的单学科方案只能升级为全部学科。",
  alreadyCovered: "这位学习者已经有这个方案了。",
  notSetUp: "App Store 购买尚未开通。",
};

/** b gives the plans page's wording in the app's language. */
export const b = () => (language() === "zh-CN" ? zh : en);

const SERVER: Record<string, keyof typeof en> = {
  "an Apple account holds one App Store subscription": "oneSubscription",
  "an App Store subject plan can only move to all subjects": "onlyUp",
  "this learner already has a plan for that": "alreadyCovered",
  "App Store purchases are not set up": "notSetUp",
  "only an adult can pay": "adultOnly",
};

/** billingError words a failed purchase, with the server's refusals said plainly. */
export function billingError(error: unknown): string {
  const key = error instanceof ConnectError ? SERVER[error.rawMessage] : undefined;
  const text = key ? b()[key] : undefined;
  return typeof text === "string" ? text : errorText(error);
}
