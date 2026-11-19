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
  "Draft, version 2026-11. This text follows a first legal review, which counsel in each market has not yet confirmed, and will change before those markets open to minors. Text in square brackets is filled in before then.";
const draftZh =
  "草稿，版本 2026-11。本文已按第一次法律审阅修改，尚待各市场执业律师确认，在这些市场向未成年人开放之前还会修改。方括号中的内容届时填入。";

/** OPERATOR_EN is the operator, its address and contacts, to be filled in when the owner names the legal entity. */
const OPERATOR_EN = "[legal name of the operator], [registered postal address]";
const OPERATOR_ZH = "[运营者法定名称]，[注册邮寄地址]";
/** SUPPORT and PRIVACY are the contact addresses, to be confirmed before launch. */
const SUPPORT = "[support@greatacademy.dev]";
const PRIVACY = "[privacy@greatacademy.dev]";

const en: Record<LegalPageName, LegalPage> = {
  terms: {
    title: "Terms of Service",
    intro: draftEn,
    sections: [
      {
        heading: "Who provides the service and where",
        paragraphs: [
          `Great Academy is provided by ${OPERATOR_EN}, contact ${SUPPORT}.`,
          "It is offered only in the markets where it has launched. It is not offered to minors in mainland China, nor to minors in any market not opened to them.",
        ],
      },
      {
        heading: "Who may pay",
        paragraphs: [
          "Only an adult who has reached the age of majority where they live may buy a plan: usually 18, 19 in South Korea and some Canadian provinces, and 19 or 21 in some US states. An adult may buy for themselves, for a child they add, or for a teen who follows them. A plan is for one learner.",
        ],
      },
      {
        heading: "Plans and renewal",
        items: [
          "A plan covers one subject, or every subject including new ones, for a month or a year.",
          "Prices on the web are stated and charged in US dollars. Any tax is shown at checkout, and your card's issuer may charge for converting the currency.",
          "A plan paid by card renews at the end of each period and the card is charged, until you cancel.",
          "A plan paid by Alipay or WeChat Pay buys one period and never renews; paying again adds another period.",
          "We email you 7 days before a monthly plan renews or ends, and 30 days before a yearly plan does, saying how to cancel online.",
          "If we change the price of plans already running, we email you at least 30 days before, and where the law requires your separate agreement to a higher price, as in South Korea, we ask for it before charging it.",
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
          "Except as below or where the law of your country requires otherwise, yearly payments, renewals and every later payment are not refunded, in full or in part, except as credit toward an upgrade.",
          "A plan starts as soon as it is paid, at your request. Where the law lets you give up a period to withdraw from a digital service that starts at once, you agree when you pay that the plan starts at once and that the period ends then. Nothing here limits a right the law does not allow you to give up.",
          `Brazil: under Article 49 of the Consumer Protection Code, you may cancel any purchase made online within 7 days of buying it, without a reason, and get all of it back. Write to ${SUPPORT}. Nothing above about giving up a withdrawal period applies in Brazil.`,
          "Australia: our services come with guarantees that cannot be excluded under the Australian Consumer Law. For a major failure you may cancel and get a refund for the unused part, or compensation for the drop in value.",
          "South Korea: where Article 17 of the Act on Consumer Protection in Electronic Commerce gives you 7 days to withdraw and none of its exceptions applies, you may withdraw and get a refund as that act provides.",
          "Taiwan: the service is digital content not supplied on a physical medium, which starts at once with your agreement when you pay, so the 7-day period of Article 19 of the Consumer Protection Act does not apply to it. The one refund above still does.",
        ],
      },
      {
        heading: "Deleting your account",
        paragraphs: [
          "Deleting your account ends the card plans you pay for at once, without a refund beyond the one above. Apple keeps charging for a plan bought in the App Store until you turn it off there.",
        ],
      },
      {
        heading: "Use of the courses, and what you write",
        items: [
          "The courses belong to the operator and those who license them to it, and are for the covered learner's own study, not for business. You may not copy, resell or scrape them, or use them to train a model.",
          "What a learner writes or says stays theirs. You let us use it only as far as we need to teach, grade, review and keep it as the privacy notice says.",
        ],
      },
      {
        heading: "Liability and the law that applies",
        items: [
          "As far as the law allows, we are not liable for indirect or consequential loss. Nothing here excludes a liability the law does not let us exclude, such as consumer guarantees.",
          "These terms are governed by the law of [jurisdiction of the operator]. This does not take away the protection of the mandatory law of the country where you live, or your right to go to its courts.",
          "Japan: the disclosures required by the Act on Specified Commercial Transactions will be on their own page before plans are sold to consumers in Japan.",
        ],
      },
    ],
  },
  privacy: {
    title: "Privacy notice",
    intro: draftEn,
    sections: [
      {
        heading: "Who we are",
        items: [
          `Controller of your data: ${OPERATOR_EN}.`,
          `Privacy contact and data protection officer: [name or title], ${PRIVACY}, [postal address].`,
          "Brazil: our legal representative in Brazil is [name, address, email].",
          "You can write to us first, and you may always complain to your data protection authority, such as the FTC or your state's attorney general in the United States, the OPC or Quebec's CAI in Canada, the OAIC in Australia, the PDPC in Singapore, the PPC in Japan, the PIPC in Korea, Taiwan's authority for personal data, the PCPD in Hong Kong, or the ANPD in Brazil.",
        ],
      },
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
          "Our hosting providers, Cloudflare (serving pages and security) and Hetzner (database and services in Oregon, United States), and our email providers, Cloudflare Email Service and Resend. They process it only on our instructions.",
          "Stripe, for adults' payments on the web and a guardian's card check; we never keep card numbers. Apple, for subscriptions bought in the iPhone app.",
          "AI companies only if an AI feature is on, only for that feature, and only companies named in the notice you agreed to. They may not train on it, and keep nothing, or only for a short agreed time.",
          "For speaking, Microsoft (Azure AI Speech), only if speaking is on, to turn your recordings into words and score how clearly they were said. The recordings are not kept and may not be used for training.",
          "Your guardian, if you have one, can see your progress, your activity and what you agreed to. They don't see the text of your answers in the app, though a child's guardian may download the child's data.",
          "South Korea: the list of each processor and recipient abroad, with its country, when and how data is sent, what is sent, why and for how long, is in the Korean notice.",
        ],
      },
      {
        heading: "Speaking",
        items: [
          "Some questions are answered aloud. They are optional, and on only if you agreed to speaking, or, for a child below the age at which a guardian must agree where they live, if the guardian agreed and the child said yes too.",
          "Nothing records until you press record, and you see that it is recording. The recording stays on your device until you send it.",
          "When you send it, we pass it to Microsoft Azure AI Speech, which turns it into words, and may score how clearly the words were said, while you wait. Neither we nor Microsoft keep the recording, and Microsoft may not train on it.",
          "We keep the words heard for 30 days, so you can see what was heard; then they are emptied, and whether the answer was right stays.",
          "We never make a voiceprint, recognise who is speaking, or guess emotions, health or age from your voice. An accent is fine: only whether the words are clear counts.",
          "Turn speaking off in Settings at any time, or for the day with “Can’t speak now”. The course goes on without it.",
        ],
      },
      {
        heading: "AI grading and automated decisions",
        items: [
          "A learning engine chooses what you study next. If you turn an AI feature on, an AI model helps grade your writing or speaking. We always tell you when an AI graded your work and show its reasons in words.",
          `You or your guardian may ask a person to review any AI grade, at ${PRIVACY}; the person's decision replaces the AI's, and we answer within 30 days. For a child, questions checked by rules can show mastery on their own, and AI grading only adds to them.`,
          "Quebec, Australia, South Korea and Brazil: study choices and AI grades use your answers, your writing with personal details removed, and what was heard when you spoke. You may ask what the main criteria and factors are, have wrong data corrected, and ask for a person's review, or refuse a fully automated decision where the law provides for it.",
        ],
      },
      {
        heading: "Where it is kept",
        paragraphs: [
          "We keep your data in the United States, in Oregon, whichever country you live in, and our backups stay there too. Cloudflare serves our pages from a place near you, but doesn't keep your data there.",
          "If you live outside the United States, using Great Academy sends your data to the United States, where it is kept and processed. Our hosting contract is with Hetzner Online GmbH in Germany, whose US company runs the data centre in Oregon. The law that protects data there may differ from yours, and US courts and authorities may lawfully demand access to it. We protect it with data processing agreements, limits on keeping and training, and the standard clauses the law requires.",
          "Japan: under Article 28 of the APPI, the country your data goes to is the United States (Oregon). Japan's Personal Information Protection Commission publishes how US federal and Oregon law protect personal data, and our contracts require those who receive it to keep safeguards equal to Japan's.",
          "Brazil: data sent from Brazil to the United States goes under the standard contractual clauses of ANPD Resolution 19/2024 or another means the ANPD recognises; you may ask our data protection officer for a copy.",
        ],
      },
      {
        heading: "What you can do",
        items: [
          "Download a copy of your data in Settings.",
          "Delete what you typed, in Settings.",
          "Turn off any optional feature, at any time, and keep studying.",
          "Delete your account in Settings. A guardian deletes a child's account.",
          "Ask us, or your guardian may ask, to correct wrong data or withdraw an agreement at any time. What you do in Settings takes effect at once; we answer a written request within 30 days, with reasons if the law makes us refuse.",
          "Your account details, age group and country are needed to provide the service; without them you cannot study. Writing, speaking and conversation are entirely up to you, and saying no to them keeps the courses.",
          "Brazil: we process data to provide the service you signed up for, in the best interest of the child with a parent's or guardian's specific consent under 16, and to meet legal duties (LGPD Articles 7 and 14).",
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
          `If you have a question about your data, want something deleted, or think something isn't right, you or your parent can email ${PRIVACY} at any time, and we'll answer in words you understand.`,
        ],
      },
      {
        heading: "If you're a guardian",
        items: [
          "You show you're an adult guardian once, in either of two ways: by paying for a first plan with a credit or debit card that isn't prepaid, through Stripe, whose bank tells the cardholder of the payment (we never keep the card number); or with a signed form, which a person checks and which is deleted once they've decided.",
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
        paragraphs: [
          "We keep a minor's data only as long as we need to teach the course, show feedback on grading, allow a person's review, keep accounts safe and meet the law, and never without end.",
        ],
        items: [
          "Text of answers, and an AI's feedback on it: 90 days for a child's account, 1 year for other learners under 18, so feedback can be shown and reviewed. After that it's emptied; whether it was right, and each criterion met or not, stays.",
          "Essays and feedback quoting them: at most 1 year, so progress can be shown and reviewed. After that they're deleted; scores stay.",
          "Recordings of spoken answers: not kept. They are heard while the learner waits, then discarded.",
          "Words heard in spoken answers: 30 days, so the learner can see what was heard. After that they're emptied; whether the answer was right stays.",
          "Conversation transcripts, where offered: not kept for a child; 30 days for a teen, then deleted.",
          "Recordings collected for research with a signed form: until the date on the form, at most 12 months, then destroyed.",
          "Addresses and browsers in sign-in records: 30 days, for security and to stop abuse, then deleted.",
          "Progress: while the account is active, then deleted with the account.",
          "An inactive account: after 12 months we send a notice, and 30 days later we delete it.",
          "A guardian's signed form: until a person has decided, then deleted.",
          "Consent records, and records of what a payer agreed to: for the life of the account, plus the period the law of the market requires, to show that agreement was given.",
          "When an agreement is withdrawn, or ends after 12 months without being renewed, the feature stops at once and the text and words heard that it covered are emptied at once, and always within 5 days.",
        ],
      },
      {
        heading: "Deleting",
        paragraphs: [
          "Deleting an account removes all personal data under it from our live database at once, for good, including the text of answers, transcripts, feedback and forms not yet decided. Encrypted backups for recovery expire and are destroyed within [30] days.",
        ],
      },
    ],
  },
  "guardian-form": {
    title: "Guardian consent form",
    intro: `Print this page, fill it in and sign it, then upload a photo or scan under Learners. It's deleted once a person has decided. To: ${OPERATOR_EN}. Questions: ${PRIVACY}.`,
    sections: [
      {
        heading: "I state that",
        items: [
          "I'm an adult, and a parent or legal guardian of the child I'll add to Great Academy.",
          "I've read the privacy notice and the page for children and guardians.",
          "I understand that I agree to each purpose separately in the app, that I can withdraw at any time, and that I can see, download and delete the child's data.",
          "I understand that my data and the data of any child I add are kept and processed in the United States (Oregon), and, for features that are on, sent to the providers named in the privacy notice.",
        ],
      },
      {
        heading: "To fill in",
        items: [
          "Email of my Great Academy account: ____________________",
          "My name: ____________________",
          "Country or region where I live: ____________________",
          "Email or phone for the decision and notices: ____________________",
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
          "Organiser, its legal name and address: ____________________",
          "Countries or regions where the recordings are kept and processed, the speech service's included: ____________________",
          `To withdraw or ask a question: ${PRIVACY}`,
        ],
      },
      {
        heading: "I state that",
        items: [
          "I'm the speaker and an adult, or a parent or legal guardian of the speaker.",
          "I've read this form, and agree to the recordings being made and used as it says.",
          "If the speaker is a child, they were told what will happen in words they understand, and said yes. If they say no, now or later, nothing is recorded.",
          "I understand that taking part is entirely voluntary, and that saying no or withdrawing at any time changes nothing for anyone's use of Great Academy.",
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
        heading: "谁提供服务，在哪里提供",
        paragraphs: [
          `Great Academy 由${OPERATOR_ZH}提供，联系邮箱 ${SUPPORT}。`,
          "本服务只在已开放的市场提供。本服务不向中国大陆的未成年人提供，也不在未向未成年人开放的市场向未成年人提供。",
        ],
      },
      {
        heading: "谁可以付款",
        paragraphs: [
          "只有达到所在地法定成年年龄的成年人可以购买方案：通常为 18 岁，韩国和加拿大部分省份为 19 岁，美国部分州为 19 或 21 岁。成年人可以为自己、为自己添加的孩子，或为关注自己的青少年购买。一个方案只供一位学习者使用。",
        ],
      },
      {
        heading: "方案与续费",
        items: [
          "一个方案覆盖一个学科，或覆盖包括以后新增在内的所有学科，期限为一个月或一年。",
          "网页上的价格以美元标示和结算。税费（如有）在结账时显示，你的发卡行可能收取货币转换费。",
          "用银行卡支付的方案在每期结束时自动续费并从银行卡扣款，直到你取消。",
          "用支付宝或微信支付的方案只购买一期，不会续费；再次付款可以再延长一期。",
          "月付方案续费或到期前 7 天、年付方案续费或到期前 30 天，我们会发邮件通知你，并说明如何在线取消。",
          "如果我们调整正在进行的方案的价格，会至少提前 30 天发邮件通知你；在法律要求对涨价另行同意的地区（如韩国），我们会先征得你的同意再按新价扣款。",
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
          "除下文所述或你所在国家法律另有规定外，年付、续费以及之后的任何付款都不退款，也不按比例退款；升级时的抵扣除外。",
          "方案应你的要求在付款后立即开始。若法律允许你放弃对立即开始的数字服务的撤回期限，你在付款时同意方案立即开始，该期限随之结束。本条不限制任何依法不得放弃的权利。",
          `巴西：依据《消费者保护法典》第 49 条，你可以在任何一次在线购买后 7 天内无理由取消并获得全额退款，请写信至 ${SUPPORT}。上述放弃撤回期限的约定不适用于巴西。`,
          "澳大利亚：我们的服务附带《澳大利亚消费者法》规定的、不可排除的保障。服务出现重大故障时，你可以取消并就未使用的部分获得退款，或就价值减损获得补偿。",
          "韩国：如《电子商务消费者保护法》第 17 条给予你 7 天撤回期，且不属于其例外情形，你可以依该法撤回并获得退款。",
          "台湾：本服务属非以有形媒介提供的数字内容，经你在付款时同意后立即开始提供，因此不适用《消费者保护法》第 19 条的 7 天期限。上述一次退款仍然适用。",
        ],
      },
      {
        heading: "删除账号",
        paragraphs: [
          "删除账号会立即结束你付费的银行卡方案；除上述退款外不另行退款。在 App Store 购买的方案，Apple 会继续扣款，直到你在那里关闭。",
        ],
      },
      {
        heading: "课程的使用与你写的内容",
        items: [
          "课程归运营者及其许可方所有，仅供方案所覆盖的学习者个人学习，不得用于商业。不得复制、转售、抓取课程，或用它训练模型。",
          "学习者写下或说出的内容仍归学习者所有。你只许可我们在教学、判分、复核和按隐私声明保存所需的范围内使用。",
        ],
      },
      {
        heading: "责任与适用法律",
        items: [
          "在法律允许的范围内，我们不承担间接或附带损失。本条不排除法律不允许排除的责任，例如消费者保障。",
          "本条款适用[运营者所在法域]的法律。这不剥夺你所居住国家强制性法律给予你的保护，也不剥夺你向当地法院起诉的权利。",
          "日本：《特定商业交易法》要求的披露事项，将在向日本消费者销售方案之前在单独的页面公布。",
        ],
      },
    ],
  },
  privacy: {
    title: "隐私声明",
    intro: draftZh,
    sections: [
      {
        heading: "我们是谁",
        items: [
          `你的数据的控制者：${OPERATOR_ZH}。`,
          `隐私联系人与数据保护官：[姓名或职位]，${PRIVACY}，[邮寄地址]。`,
          "巴西：我们在巴西的法定代表为[名称、地址、邮箱]。",
          "你可以先联系我们，也随时有权向所在地的数据保护机构投诉，例如美国的 FTC 或州总检察长、加拿大的 OPC 或魁北克 CAI、澳大利亚的 OAIC、新加坡的 PDPC、日本的个人信息保护委员会、韩国的个人信息保护委员会、台湾的个人资料主管机关、香港的个人资料私隐专员公署，或巴西的 ANPD。",
        ],
      },
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
          "我们的托管服务商 Cloudflare（页面分发与安全）和 Hetzner（位于美国俄勒冈州的数据库与服务），以及邮件服务商 Cloudflare Email Service 和 Resend。它们只按我们的指示处理。",
          "Stripe，处理成年人在网页上的付款和监护人的银行卡验证；我们从不保存银行卡号。Apple，处理在 iPhone 应用中购买的订阅。",
          "只有开启 AI 功能时才会发送给 AI 公司，仅用于该功能，且仅限你同意的通知中写明的公司。它们不得用这些数据训练模型，不保存或只在约定的短时间内保存。",
          "口语：仅在开启口语时发送给 Microsoft（Azure AI Speech），用于把你的录音转成文字并评估是否说清楚。录音不被保存，也不得用于训练。",
          "你的监护人（如果有）可以看到你的进度、活动和你同意了什么。他们在应用中看不到你答案的文本，但儿童的监护人可以下载孩子的数据。",
          "韩国：每个受托处理方和境外接收方的名称、所在国家、传输的时间和方式、传输的项目、目的和保存期限，列在韩文版声明中。",
        ],
      },
      {
        heading: "口语",
        items: [
          "有些题目需要开口回答。它们是可选的，只有你本人同意了口语才会开启；如果你未满所在地须由监护人同意的年龄，则须监护人同意，并且孩子本人也同意。",
          "在你按下录音之前不会录音，录音时你会看到提示。录音在你发送之前一直留在你的设备上。",
          "你发送后，我们把录音交给 Microsoft Azure AI Speech，在你等待时把它转成文字，并可能评估发音是否清楚。我们和 Microsoft 都不保存录音，Microsoft 也不得用它训练模型。",
          "识别出的文字保存 30 天，方便你查看听到了什么；之后会被清空，答案是否正确仍保留。",
          "我们绝不制作声纹、识别说话人，也不从你的声音推断情绪、健康或年龄。有口音没关系，只看词是否说清楚。",
          "你随时可以在“设置”中关闭口语，或用“现在不方便说话”关闭当天的口语。不开口语，课程照常进行。",
        ],
      },
      {
        heading: "AI 判分与自动化决定",
        items: [
          "学习引擎决定你接下来学什么。如果你开启了 AI 功能，AI 模型会辅助评判你的写作或口语。AI 评判你的作业时，我们一定会告诉你，并用文字说明理由。",
          `你或你的监护人可以写信至 ${PRIVACY}，请人工复核任何一次 AI 判分；人工的决定取代 AI 的判定，我们在 30 天内答复。对儿童而言，规则判定的题目本身就能确认掌握，AI 判分只是补充。`,
          "魁北克、澳大利亚、韩国和巴西：学习安排和 AI 判分使用你的答题记录、去除个人信息后的写作文本，以及你开口回答时识别出的文字。你可以询问主要的标准和因素、要求更正不准确的数据、请求人工复核，并在法律规定的情况下拒绝完全自动化的决定。",
        ],
      },
      {
        heading: "存放在哪里",
        paragraphs: [
          "无论你住在哪个国家或地区，你的数据都存放在美国俄勒冈州，备份也留在那里。Cloudflare 会从离你近的地方提供我们的页面，但不在那里保存你的数据。",
          "如果你住在美国以外，使用 Great Academy 会把你的数据传到美国存放和处理。我们的托管合同由位于德国的 Hetzner Online GmbH 签订，俄勒冈州的数据中心由其美国公司运营。那里保护数据的法律可能与你所在地不同，美国法院和执法机关可能依法要求调取数据。我们以数据处理协议、对保存和训练的限制，以及法律要求的标准合同条款保护这些数据。",
          "日本：依据《个人信息保护法》第 28 条，接收数据的国家为美国（俄勒冈州）。日本个人信息保护委员会公布了美国联邦和俄勒冈州保护个人信息的制度，我们的合同要求接收方采取与日本标准相当的保护措施。",
          "巴西：从巴西传往美国的数据依据 ANPD 第 19/2024 号决议的标准合同条款或 ANPD 认可的其他机制传输；你可以向我们的数据保护官索取副本。",
        ],
      },
      {
        heading: "你可以做什么",
        items: [
          "在“设置”中下载数据副本。",
          "在“设置”中删除你输入的内容。",
          "随时关闭任何可选功能，并继续学习。",
          "在“设置”中删除账号。儿童账号由监护人删除。",
          "随时要求我们更正不准确的数据或撤回同意，你的监护人也可以。在“设置”中的操作立即生效；书面请求我们在 30 天内答复，如依法必须拒绝，会说明理由。",
          "账号信息、年龄段和国家或地区是提供服务所必需的，不提供就无法学习。写作、口语和对话完全由你决定，拒绝它们不影响课程。",
          "巴西：我们处理数据的依据是履行你注册的服务、儿童的最大利益并经父母或监护人对未满 16 岁者的明确同意，以及履行法定义务（LGPD 第 7 条和第 14 条）。",
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
          `如果你对自己的数据有疑问、想删除什么，或觉得哪里不对，你或你的爸爸妈妈随时可以发邮件到 ${PRIVACY}，我们会用你能听懂的话回复。`,
        ],
      },
      {
        heading: "如果你是监护人",
        items: [
          "你只需证明一次自己是成年监护人，两种方式任选其一：用非预付的信用卡或借记卡通过 Stripe 支付第一个方案，发卡行会通知持卡人这笔付款（我们从不保存卡号）；或者提交签字表格，由人工审核，决定后表格即被删除。",
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
        paragraphs: [
          "我们只在教授课程、展示判分反馈、支持人工复核、保障账号安全和遵守法律所需的时间内保存未成年人的数据，绝不无限期保存。",
        ],
        items: [
          "答案的文本及 AI 对它的反馈：儿童账号 90 天，其他未满 18 岁的学习者 1 年，用于展示反馈和人工复核。之后会被清空，是否正确以及每条标准是否满足仍保留。",
          "作文及引用作文的反馈：最长 1 年，用于展示进步和人工复核。之后删除，分数保留。",
          "开口回答的录音：不保存。在学习者等待时识别，随即丢弃。",
          "开口回答中识别出的文字：30 天，方便学习者查看听到了什么。之后会被清空，答案是否正确仍保留。",
          "对话的文字记录（如提供）：儿童不保存；青少年 30 天，然后删除。",
          "凭签字表格为研究采集的录音：保存到表格上写明的日期，最长 12 个月，然后销毁。",
          "登录记录中的地址和浏览器信息：30 天，用于账号安全和防止滥用，然后删除。",
          "学习进度：账号活跃期间保留，随账号一起删除。",
          "不活跃的账号：12 个月后发送通知，30 天后删除。",
          "监护人的签字表格：保留到人工作出决定，然后删除。",
          "同意记录，以及付款人同意了什么的记录：账号存续期间保留，并按市场法律要求的期限保留，用于证明同意确已作出。",
          "撤回某项同意，或同意满 12 个月未续期时，该功能立即停止，它所涉及的文本和识别出的文字立即清空，最迟不超过 5 天。",
        ],
      },
      {
        heading: "删除",
        paragraphs: [
          "删除账号会立即且不可恢复地从我们的在线数据库中移除其下的所有个人数据，包括答案文本、文字记录、反馈和尚未审核的表格。用于恢复的加密备份在 [30] 天内过期并销毁。",
        ],
      },
    ],
  },
  "guardian-form": {
    title: "监护人同意表",
    intro: `请打印本页，填写并签字，然后在“学习者”页面上传照片或扫描件。人工作出决定后，表格即被删除。收件方：${OPERATOR_ZH}。如有疑问：${PRIVACY}。`,
    sections: [
      {
        heading: "本人声明",
        items: [
          "我是成年人，是我将添加到 Great Academy 的孩子的父母或法定监护人。",
          "我已阅读隐私声明和“写给儿童和监护人”页面。",
          "我明白我会在应用中对每个用途分别同意，可以随时撤回，也可以查看、下载和删除孩子的数据。",
          "我明白我的数据以及我添加的孩子的数据存放和处理于美国（俄勒冈州），并在开启相应功能时发送给隐私声明中写明的服务商。",
        ],
      },
      {
        heading: "请填写",
        items: [
          "我的 Great Academy 账号邮箱：____________________",
          "我的姓名：____________________",
          "我居住的国家或地区：____________________",
          "接收审核结果和通知的邮箱或电话：____________________",
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
          "主办方的法定名称和地址：____________________",
          "录音存放和处理的国家或地区（含语音服务）：____________________",
          `撤回或咨询：${PRIVACY}`,
        ],
      },
      {
        heading: "本人声明",
        items: [
          "我是说话人本人且已成年，或是说话人的父母或法定监护人。",
          "我已阅读本表，同意按本表所述录音和使用录音。",
          "如果说话人是孩子，已经用他们能听懂的话告诉他们会发生什么，他们也同意了。如果他们现在或以后说不，就不会录音。",
          "我明白参加完全自愿，拒绝或随时撤回都不会影响任何人使用 Great Academy。",
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
