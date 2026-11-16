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
export const LEGAL_PAGES = ["terms", "privacy", "children", "retention", "guardian-form", "research-form"] as const;

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
        heading: "Upgrading",
        paragraphs: [
          "When you buy all subjects for a learner who has single-subject plans you pay for, the unused time of those plans is worth its share of their last payment, and that value comes off the first payment for all subjects. The single-subject plans end when that payment arrives and are not charged again. The credit is the only value given for them; it is not paid out.",
        ],
      },
      {
        heading: "Plans bought in the App Store",
        paragraphs: [
          "A plan bought in the iPhone app is an App Store subscription, sold and charged by Apple at the App Store's price. It renews until you turn it off in your Apple account's subscriptions, and Apple's terms govern its billing, cancelling and refunds; the one refund below does not apply to it.",
          "An Apple account holds one such subscription, for the learner chosen when it is bought. Buying all subjects in the app for a learner whose single-subject plans you pay for here ends those plans and refunds their unused value, worked out as for an upgrade, to the card or wallet that paid.",
        ],
      },
      {
        heading: "Refunds",
        items: [
          "Each account gets one refund: the first payment it ever makes, if that payment buys a month, can be refunded in full from Settings within 30 days of that payment. The plan then ends at once.",
          "Yearly payments, renewals and every later payment are not refunded, in full or in part, except as credit toward an upgrade.",
          "A plan starts as soon as it is paid, at your request. Where the law gives you a period to withdraw from a purchase, you agree when you pay that it ends once the plan starts. This does not limit any right the law of your country gives you and does not allow you to waive.",
        ],
      },
      {
        heading: "Deleting your account",
        paragraphs: [
          "Deleting your account ends the card plans you pay for at once, without a refund beyond the one above. Apple keeps charging for a plan bought in the App Store until you turn it off there.",
        ],
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
          "Your account: name, username and email address; a child's account has no email address.",
          "Your age group, the date it ends and your country. We don't keep your date of birth.",
          "What you study: which questions you saw, whether each answer was right, and the XP you earned.",
          "The text of your answers, for a limited time (see how long we keep things).",
          "If speaking is on, the words a speech service heard in your spoken answers, for 30 days. We don't keep the recordings.",
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
          "Our hosting providers, Cloudflare and Hetzner, and our email provider, who process it only for us.",
          "AI companies only if an AI feature is on, only for that feature, and only companies named in the notice you agreed to. They may not train on it.",
          "For speaking, Microsoft (Azure AI Speech), only if speaking is on, to turn your recordings into words.",
          "Your guardian, if you have one, can see your progress and activity. They don't see the text of your answers in the app.",
        ],
      },
      {
        heading: "Speaking",
        items: [
          "Some questions are answered aloud. They are optional, and on only if you, or your guardian for a learner under 18, agreed to speaking. We ask a child too.",
          "Nothing records until you press record, and you see that it is recording. The recording stays on your device until you send it.",
          "When you send it, we pass it to Microsoft Azure AI Speech, which turns it into words, and may score how clearly the words were said, while you wait. Neither we nor Microsoft keep the recording, and Microsoft may not train on it.",
          "We keep the words heard for 30 days, so you can see what was heard; then they are emptied, and whether the answer was right stays.",
          "We never make a voiceprint, recognise who is speaking, or guess emotions, health or age from your voice. An accent is fine: only whether the words are clear counts.",
          "Turn speaking off in Settings at any time, or for the day with “Can’t speak now”. The course goes on without it.",
        ],
      },
      {
        heading: "Where it is kept",
        paragraphs: [
          "We keep your data in the United States, in Oregon, whichever country you live in, and our backups stay there too. Cloudflare serves our pages from a place near you, but doesn't keep your data there.",
          "If you live outside the United States, using Great Academy sends your data there, where the law that protects it may differ from yours.",
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
          "If speaking is on, you can answer some questions aloud. Your voice is turned into words and then thrown away. You can always press “Can’t speak now”.",
          "Nobody else can talk to you here, and nobody sees your real name, because we don't ask for it.",
        ],
      },
      {
        heading: "If you're a guardian",
        items: [
          "You verify once with a signed form. A person checks it, and it's deleted once they've decided.",
          "You agree to each purpose separately. Refusing an optional one keeps the course. Speaking is its own purpose: recordings are heard by the speech service in the privacy notice and kept by no one.",
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
          "Recordings of spoken answers: not kept. They are heard while the learner waits, then discarded.",
          "Words heard in spoken answers: 30 days. After that they're emptied; whether the answer was right stays.",
          "Recordings collected for research with a signed form: until the date on the form, at most 12 months, then destroyed.",
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
  "research-form": {
    title: "Research recording consent form",
    intro:
      "Print this page for one collection of recordings, fill it in and sign it, and hand it to the person running the collection. Recordings made with it test speech services; they are never part of a learner's account.",
    sections: [
      {
        heading: "What happens",
        items: [
          "The speaker reads short words and sentences aloud, for about 15 minutes. Nothing else is recorded, and no name is said.",
          "The recordings are kept apart from any Great Academy account, under a number, not a name.",
          "Two people named below listen to each recording and rate whether the words are clear. A speech service named below hears them too, to compare its results with the ratings.",
          "No one trains a model on the recordings, makes a voiceprint, or recognises who is speaking.",
          "The recordings and ratings are destroyed on the date below, at most 12 months after the collection. Only counts, with no voice, remain.",
          "You may withdraw at any time before that date, without giving a reason, and the speaker's recordings are destroyed at once.",
        ],
      },
      {
        heading: "Filled in by Great Academy",
        items: [
          "Collection: ____________________",
          "People who rate the recordings: ____________________",
          "Speech service: ____________________",
          "Recordings destroyed on: ____________________",
        ],
      },
      {
        heading: "I state that",
        items: [
          "I'm the speaker and an adult, or a parent or legal guardian of the speaker.",
          "I've read this form, and agree to the recordings being made and used as it says.",
          "If the speaker is a child, they were told what will happen in words they understand, and said yes. If they say no, now or later, nothing is recorded.",
        ],
      },
      {
        heading: "To fill in",
        items: [
          "Speaker's age: ____________________",
          "My name: ____________________",
          "Relationship to the speaker: ____________________",
          "Email or phone, to withdraw: ____________________",
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
        heading: "升级",
        paragraphs: [
          "为已有你付费的单学科方案的学习者购买全部学科时，这些方案剩余时间的价值按其最后一笔付款的相应比例计算，并从全部学科的第一笔付款中扣除。付款到账后，单学科方案随即结束，不再扣款。抵扣是对它们的唯一补偿，不以现金支付。",
        ],
      },
      {
        heading: "在 App Store 购买的方案",
        paragraphs: [
          "在 iPhone 应用中购买的方案是 App Store 订阅，由 Apple 按 App Store 的价格出售并扣款。它会续订，直到你在 Apple 账号的订阅中关闭；其扣款、取消和退款适用 Apple 的条款，下面的一次退款不适用于它。",
          "一个 Apple 账号只持有一份这样的订阅，归属于购买时选择的学习者。在应用中为已有你在这里付费的单学科方案的学习者购买全部学科，会结束这些方案，并把按升级方式计算的剩余价值退回付款的银行卡或钱包。",
        ],
      },
      {
        heading: "退款",
        items: [
          "每个账号有一次退款机会：账号的第一笔付款如果购买的是一个月，可以在付款后 30 天内从“设置”中申请全额退款，方案随即结束。",
          "年付、续费以及之后的任何付款都不退款，也不按比例退款；升级时的抵扣除外。",
          "方案应你的要求在付款后立即开始。若法律给予你撤回购买的期限，你在付款时同意该期限在方案开始时结束。这不限制你所在国家法律赋予且不允许放弃的任何权利。",
        ],
      },
      {
        heading: "删除账号",
        paragraphs: [
          "删除账号会立即结束你付费的银行卡方案；除上述退款外不另行退款。在 App Store 购买的方案，Apple 会继续扣款，直到你在那里关闭。",
        ],
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
          "你的账号：名字、用户名和邮箱；儿童账号没有邮箱。",
          "你的年龄段、其结束日期和国家或地区。我们不保存你的出生日期。",
          "你的学习情况：看过哪些题、每题是否正确、获得的 XP。",
          "你答案的文本，保存有限的时间（见“数据保存多久”）。",
          "如果开启了口语，语音服务从你开口回答中识别出的文字，保存 30 天。我们不保存录音。",
          "带有地址和浏览器信息的登录记录，保存 30 天。",
        ],
      },
      { heading: "为什么", paragraphs: ["为了教你：选择接下来该学什么、检查答案、展示进度。我们不把你的数据用于广告，也不出售。"] },
      {
        heading: "谁会收到",
        items: [
          "我们的托管服务商 Cloudflare 和 Hetzner，以及邮件服务商，它们只代我们处理。",
          "只有开启 AI 功能时才会发送给 AI 公司，仅用于该功能，且仅限你同意的通知中写明的公司。它们不得用这些数据训练模型。",
          "口语：仅在开启口语时发送给 Microsoft（Azure AI Speech），用于把你的录音转成文字。",
          "你的监护人（如果有）可以看到你的进度和活动。他们在应用中看不到你答案的文本。",
        ],
      },
      {
        heading: "口语",
        items: [
          "有些题目需要开口回答。它们是可选的，只有你（未满 18 岁的学习者则由监护人）同意了口语才会开启。我们也会问孩子本人。",
          "在你按下录音之前不会录音，录音时你会看到提示。录音在你发送之前一直留在你的设备上。",
          "你发送后，我们把录音交给 Microsoft Azure AI Speech，在你等待时把它转成文字，并可能评估发音是否清楚。我们和 Microsoft 都不保存录音，Microsoft 也不得用它训练模型。",
          "识别出的文字保存 30 天，方便你查看听到了什么；之后会被清空，答案是否正确仍保留。",
          "我们绝不制作声纹、识别说话人，也不从你的声音推断情绪、健康或年龄。有口音没关系，只看词是否说清楚。",
          "你随时可以在“设置”中关闭口语，或用“现在不方便说话”关闭当天的口语。不开口语，课程照常进行。",
        ],
      },
      {
        heading: "存放在哪里",
        paragraphs: [
          "无论你住在哪个国家或地区，你的数据都存放在美国俄勒冈州，备份也留在那里。Cloudflare 会从离你近的地方提供我们的页面，但不在那里保存你的数据。",
          "如果你住在美国以外，使用 Great Academy 会把你的数据传到美国；那里保护数据的法律可能与你所在地不同。",
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
          "如果开启了口语，有些题你可以开口回答。你的声音会被转成文字，然后丢掉。你随时可以按“现在不方便说话”。",
          "这里没有其他人能和你说话，也没有人能看到你的真实姓名，因为我们不会问。",
        ],
      },
      {
        heading: "如果你是监护人",
        items: [
          "你只需用签字表格验证一次。会有人工审核，决定后表格即被删除。",
          "你对每个用途分别同意。拒绝可选用途不影响课程。口语是单独的用途：录音由隐私声明中列出的语音服务识别，不被任何一方保存。",
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
          "开口回答的录音：不保存。在学习者等待时识别，随即丢弃。",
          "开口回答中识别出的文字：30 天。之后会被清空，答案是否正确仍保留。",
          "凭签字表格为研究采集的录音：保存到表格上写明的日期，最长 12 个月，然后销毁。",
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
  "research-form": {
    title: "研究录音同意表",
    intro: "每次采集录音请打印本页，填写并签字后交给负责采集的人。用它录下的声音用于测试语音服务，绝不会成为任何学习者账号的一部分。",
    sections: [
      {
        heading: "会做什么",
        items: [
          "说话人大声读出一些简短的词和句子，约 15 分钟。不录其他内容，也不会说出姓名。",
          "录音与任何 Great Academy 账号分开保存，只用编号标记，不用姓名。",
          "下面写明的两个人会听每一段录音，评定词是否说清楚。下面写明的语音服务也会识别这些录音，用来和评定结果比较。",
          "任何人都不会用这些录音训练模型、制作声纹或识别说话人。",
          "录音和评定结果会在下面写明的日期销毁，最晚为采集后 12 个月。之后只留下不含声音的统计数字。",
          "在那之前你随时可以撤回，无需说明理由，说话人的录音会立即销毁。",
        ],
      },
      {
        heading: "由 Great Academy 填写",
        items: [
          "采集名称：____________________",
          "评定录音的人：____________________",
          "语音服务：____________________",
          "录音销毁日期：____________________",
        ],
      },
      {
        heading: "本人声明",
        items: [
          "我是说话人本人且已成年，或是说话人的父母或法定监护人。",
          "我已阅读本表，同意按本表所述录音和使用录音。",
          "如果说话人是孩子，已经用他们能听懂的话告诉他们会发生什么，他们也同意了。如果他们现在或以后说不，就不会录音。",
        ],
      },
      {
        heading: "请填写",
        items: [
          "说话人的年龄：____________________",
          "我的姓名：____________________",
          "与说话人的关系：____________________",
          "用于撤回的邮箱或电话：____________________",
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
