/** LegalSection is a heading with its paragraphs and lists. */
export interface LegalSection {
  readonly heading: string;
  readonly paragraphs?: readonly string[];
  readonly items?: readonly string[];
}

/** LegalPage is one page under /legal. */
export interface LegalPage {
  readonly title: string;
  readonly intro: string;
  readonly sections: readonly LegalSection[];
}

/** LEGAL_PAGES are the pages under /legal, by name. They go through review because they are in the code; counsel has not reviewed this version. */
export const LEGAL_PAGES = ["terms", "privacy", "children", "retention", "guardian-form"] as const;

/** LegalPageName names a page under /legal. */
export type LegalPageName = (typeof LEGAL_PAGES)[number];

const draftEn =
  "Draft, version 2026-11. This text has not yet been reviewed by counsel in each market, and will change before those markets open to minors.";
const draftZh = "草稿，版本 2026-11。本文尚未经过各市场法律顾问审阅，在这些市场向未成年人开放之前还会修改。";

const en: Record<LegalPageName, LegalPage> = {
  terms: {
    title: "Terms of Service",
    intro: draftEn,
    sections: [
      {
        heading: "Who may pay",
        paragraphs: [
          "Only an adult may buy a plan, for themselves, for a child they add, or for a teen who follows them. A plan is for one learner.",
        ],
      },
      {
        heading: "Plans and renewal",
        items: [
          "A plan covers one subject, or every subject including new ones, for a month or a year.",
          "A plan paid by card renews at the end of each period and the card is charged, until you cancel.",
          "A plan paid by Alipay or WeChat Pay buys one period and never renews; paying again adds another period.",
          "We email you seven days before a plan renews or ends.",
        ],
      },
      {
        heading: "Cancelling",
        paragraphs: [
          "You can cancel a card plan online under Settings at any time. It then stops renewing and lasts until the end of the period already paid for.",
        ],
      },
      {
        heading: "Refunds",
        items: [
          "Each account gets one refund: the first payment it ever makes, if that payment buys a month, can be refunded in full from Settings within 30 days of that payment. The plan then ends at once.",
          "Yearly payments, renewals and every later payment are not refunded, in full or in part.",
          "A plan starts as soon as it is paid, at your request. Where the law gives you a period to withdraw from a purchase, you agree when you pay that it ends once the plan starts. This does not limit any right the law of your country gives you and does not allow you to waive.",
        ],
      },
      {
        heading: "Deleting your account",
        paragraphs: ["Deleting your account ends the card plans you pay for at once, without a refund beyond the one above."],
      },
    ],
  },
  privacy: {
    title: "Privacy notice",
    intro: draftEn,
    sections: [
      {
        heading: "What we keep",
        items: [
          "Your account: email and name, or for a child's account only a username.",
          "Your age group, the date it ends and your country. We don't keep your date of birth.",
          "What you study: which questions you saw, whether each answer was right, and the XP you earned.",
          "The text of your answers, for a limited time (see how long we keep things).",
          "Sign-in records with an address and browser, for 30 days.",
        ],
      },
      {
        heading: "Why",
        paragraphs: [
          "To teach you: to choose what you should study next, check your answers and show your progress. We don't use your data for advertising, and we don't sell it.",
        ],
      },
      {
        heading: "Who receives it",
        items: [
          "Our hosting and email providers, who process it only for us.",
          "AI companies only if an AI feature is on, only for that feature, and only companies named in the notice you agreed to. They may not train on it.",
          "Your guardian, if you have one, can see your progress and activity. They don't see the text of your answers in the app.",
        ],
      },
      {
        heading: "What you can do",
        items: [
          "Download a copy of your data in Settings.",
          "Delete what you typed, in Settings.",
          "Turn off any optional feature, at any time, and keep studying.",
          "Delete your account in Settings. A guardian deletes a child's account.",
        ],
      },
      {
        heading: "What we never do",
        items: [
          "Advertising, third-party trackers or session replay.",
          "Training any model on minors' text or voice.",
          "Voiceprints, voice cloning, or inferring emotion or personality.",
        ],
      },
    ],
  },
  children: {
    title: "For children and guardians",
    intro: draftEn,
    sections: [
      {
        heading: "If you're a child",
        items: [
          "Your guardian made this account, and said yes to what's on. You can see what's on in Settings.",
          "Your guardian can see how you're doing, but not what you type.",
          "You can turn things off and delete what you typed whenever you like. Your guardian is told.",
          "If an AI reads your work, we'll tell you, and we'll ask you first too. If you say no, it stays off.",
          "Nobody else can talk to you here, and nobody sees your real name, because we don't ask for it.",
        ],
      },
      {
        heading: "If you're a guardian",
        items: [
          "You verify once with a signed form. A person checks it, and it's deleted once they've decided.",
          "You agree to each purpose separately. Refusing an optional one keeps the course.",
          "An agreement lasts 12 months. We remind you before it ends; then that feature stops.",
          "You can see progress, set a daily limit, download the data, delete typed answers, or delete the account, at any time. Deleting takes effect at once.",
        ],
      },
    ],
  },
  retention: {
    title: "How long we keep things",
    intro: draftEn,
    sections: [
      {
        heading: "For learners under 18",
        items: [
          "Text of answers: 90 days for a child's account, 1 year for other learners under 18. After that it's emptied; whether it was right stays.",
          "Addresses and browsers in sign-in records: 30 days.",
          "Progress: while the account is active, then deleted with the account.",
          "An inactive account: after 12 months we send a notice, and 30 days later we delete it.",
          "A guardian's signed form: until a person has decided, then deleted.",
          "Consent records: for the life of the account, plus any period the law of the market requires.",
        ],
      },
      {
        heading: "Deleting",
        paragraphs: ["Deleting an account removes everything under it from our database at once. Backups age out within a stated window."],
      },
    ],
  },
  "guardian-form": {
    title: "Guardian consent form",
    intro: "Print this page, fill it in and sign it, then upload a photo or scan under Learners. It's deleted once a person has decided.",
    sections: [
      {
        heading: "I state that",
        items: [
          "I'm an adult, and a parent or legal guardian of the child I'll add to Great Academy.",
          "I've read the privacy notice and the page for children and guardians.",
          "I understand that I agree to each purpose separately in the app, that I can withdraw at any time, and that I can see, download and delete the child's data.",
        ],
      },
      {
        heading: "To fill in",
        items: [
          "Email of my Great Academy account: ____________________",
          "My name: ____________________",
          "Date: ____________________",
          "Signature: ____________________",
        ],
      },
    ],
  },
};

const zh: Record<LegalPageName, LegalPage> = {
  terms: {
    title: "服务条款",
    intro: draftZh,
    sections: [
      {
        heading: "谁可以付款",
        paragraphs: ["只有成年人可以购买方案：为自己、为自己添加的孩子，或为关注自己的青少年。一个方案只供一位学习者使用。"],
      },
      {
        heading: "方案与续费",
        items: [
          "一个方案覆盖一个学科，或覆盖包括以后新增在内的所有学科，期限为一个月或一年。",
          "用银行卡支付的方案在每期结束时自动续费并从银行卡扣款，直到你取消。",
          "用支付宝或微信支付的方案只购买一期，不会续费；再次付款可以再延长一期。",
          "方案续费或到期前七天，我们会发邮件通知你。",
        ],
      },
      {
        heading: "取消",
        paragraphs: ["你随时可以在“设置”中在线取消银行卡方案。取消后不再续费，方案持续到已付期限结束。"],
      },
      {
        heading: "退款",
        items: [
          "每个账号有一次退款机会：账号的第一笔付款如果购买的是一个月，可以在付款后 30 天内从“设置”中申请全额退款，方案随即结束。",
          "年付、续费以及之后的任何付款都不退款，也不按比例退款。",
          "方案应你的要求在付款后立即开始。若法律给予你撤回购买的期限，你在付款时同意该期限在方案开始时结束。这不限制你所在国家法律赋予且不允许放弃的任何权利。",
        ],
      },
      {
        heading: "删除账号",
        paragraphs: ["删除账号会立即结束你付费的银行卡方案；除上述退款外不另行退款。"],
      },
    ],
  },
  privacy: {
    title: "隐私声明",
    intro: draftZh,
    sections: [
      {
        heading: "我们保存什么",
        items: [
          "你的账号：邮箱和姓名；儿童账号只有用户名。",
          "你的年龄段、其结束日期和国家或地区。我们不保存你的出生日期。",
          "你的学习情况：看过哪些题、每题是否正确、获得的 XP。",
          "你答案的文本，保存有限的时间（见“数据保存多久”）。",
          "带有地址和浏览器信息的登录记录，保存 30 天。",
        ],
      },
      { heading: "为什么", paragraphs: ["为了教你：选择接下来该学什么、检查答案、展示进度。我们不把你的数据用于广告，也不出售。"] },
      {
        heading: "谁会收到",
        items: [
          "我们的托管和邮件服务商，它们只代我们处理。",
          "只有开启 AI 功能时才会发送给 AI 公司，仅用于该功能，且仅限你同意的通知中写明的公司。它们不得用这些数据训练模型。",
          "你的监护人（如果有）可以看到你的进度和活动。他们在应用中看不到你答案的文本。",
        ],
      },
      {
        heading: "你可以做什么",
        items: [
          "在“设置”中下载数据副本。",
          "在“设置”中删除你输入的内容。",
          "随时关闭任何可选功能，并继续学习。",
          "在“设置”中删除账号。儿童账号由监护人删除。",
        ],
      },
      {
        heading: "我们绝不做的事",
        items: ["广告、第三方跟踪或会话回放。", "用未成年人的文本或声音训练任何模型。", "声纹、声音克隆，或推断情绪和性格。"],
      },
    ],
  },
  children: {
    title: "写给儿童和监护人",
    intro: draftZh,
    sections: [
      {
        heading: "如果你是孩子",
        items: [
          "这个账号是你的监护人创建的，开启的功能也是他们同意的。你可以在“设置”里看到开启了什么。",
          "你的监护人能看到你学得怎么样，但看不到你输入的内容。",
          "你随时可以关闭功能、删除你输入的内容。你的监护人会收到通知。",
          "如果有 AI 读你的作业，我们会告诉你，也会先问你。如果你说不，它就保持关闭。",
          "这里没有其他人能和你说话，也没有人能看到你的真实姓名，因为我们不会问。",
        ],
      },
      {
        heading: "如果你是监护人",
        items: [
          "你只需用签字表格验证一次。会有人工审核，决定后表格即被删除。",
          "你对每个用途分别同意。拒绝可选用途不影响课程。",
          "同意的有效期为 12 个月。到期前我们会提醒你，到期后该功能停止。",
          "你随时可以查看进度、设置每日上限、下载数据、删除输入的答案或删除账号。删除立即生效。",
        ],
      },
    ],
  },
  retention: {
    title: "数据保存多久",
    intro: draftZh,
    sections: [
      {
        heading: "未满 18 岁的学习者",
        items: [
          "答案的文本：儿童账号 90 天，其他未满 18 岁的学习者 1 年。之后会被清空，是否正确仍保留。",
          "登录记录中的地址和浏览器信息：30 天。",
          "学习进度：账号活跃期间保留，随账号一起删除。",
          "不活跃的账号：12 个月后发送通知，30 天后删除。",
          "监护人的签字表格：保留到人工作出决定，然后删除。",
          "同意记录：账号存续期间保留，并按市场法律要求的期限保留。",
        ],
      },
      { heading: "删除", paragraphs: ["删除账号会立即从我们的数据库中移除其下的所有内容。备份会在规定的时间内过期。"] },
    ],
  },
  "guardian-form": {
    title: "监护人同意表",
    intro: "请打印本页，填写并签字，然后在“学习者”页面上传照片或扫描件。人工作出决定后，表格即被删除。",
    sections: [
      {
        heading: "本人声明",
        items: [
          "我是成年人，是我将添加到 Great Academy 的孩子的父母或法定监护人。",
          "我已阅读隐私声明和“写给儿童和监护人”页面。",
          "我明白我会在应用中对每个用途分别同意，可以随时撤回，也可以查看、下载和删除孩子的数据。",
        ],
      },
      {
        heading: "请填写",
        items: [
          "我的 Great Academy 账号邮箱：____________________",
          "我的姓名：____________________",
          "日期：____________________",
          "签名：____________________",
        ],
      },
    ],
  },
};

/** legalPage returns a page in a locale, or undefined for a name that is not one. */
export function legalPage(name: string, locale: string): LegalPage | undefined {
  const found = LEGAL_PAGES.find((p) => p === name);
  return found && (locale === "zh-CN" ? zh : en)[found];
}
