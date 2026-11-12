// Grade 10: word study: Latin and Greek roots of the year, and the suffixes that turn words into adjectives.

import type { TopicDef } from "@ga/content";
import { partLines, parts } from "../grade-6/kit.ts";

const latin8 = parts({
  id: "latin-roots-8",
  title: ["Latin Roots 8", "拉丁词根 8"],
  summary: [
    "Ten more Latin roots: culp, fract, tort, plac, ven, lev, mut, vinc, sacr and rog.",
    "另外十个拉丁词根：culp、fract、tort、plac、ven、lev、mut、vinc、sacr 和 rog。",
  ],
  after: ["latin-roots-7"],
  kind: ["Latin root", "拉丁词根"],
  list: partLines(`
    culp|blame|过错，责备|culprit|the person to blame for a crime or a fault|exculpate|to free someone from blame|inculpate|to put the blame for a crime on someone
    fract|break|破碎|fracture|a break or crack, as in a bone|fractious|easily angered and likely to break into quarrels|refract|to bend light, as if breaking its straight path
    tort|twist|扭曲|distort|to twist something out of its true shape or meaning|contort|to twist the body or face into an unusual shape|tortuous|full of twists and turns
    plac|please or calm|使高兴，平息|placate|to calm someone who is angry|placid|calm and not easily upset|implacable|impossible to calm or satisfy
    ven|come|来|convene|to come together for a meeting|intervene|to come between people or events to change what happens|venue|the place where people come for an event
    lev|lift or light|举起，轻|levity|lightness of mood at a serious moment|alleviate|to make pain or trouble lighter|levitate|to rise and float in the air
    mut|change|改变|mutation|a change in the genes of a living thing|immutable|never changing|commute|to change one punishment for a lighter one, or to travel back and forth
    vinc|conquer|征服|invincible|impossible to defeat|evince|to show a feeling clearly, as if winning it into view|convince|to win someone over to a belief
    sacr|holy|神圣|sacred|holy, or treated with great respect|sacrilege|the act of treating a holy thing without respect|sacrosanct|too important or holy to be changed
    rog|ask|询问，要求|interrogate|to ask someone many questions, often formally|arrogant|claiming too much for oneself|prerogative|a right that belongs to a person because of their position
  `),
  explanations: [
    [
      "Ten more Latin **roots**. *Culp* means blame, *fract* break, *tort* twist, *plac* please or calm, *ven* come, *lev* lift or light, *mut* change, *vinc* conquer, *sacr* holy and *rog* ask. A *culprit* is the one to blame; a *fracture* is a break; to *distort* is to twist; to *placate* is to calm. Knowing the root lets you guess the meaning of a word you have never seen.",
      "另外十个拉丁**词根**。*culp* 意为过错，*fract* 破碎，*tort* 扭曲，*plac* 使高兴或平息，*ven* 来，*lev* 举起或轻，*mut* 改变，*vinc* 征服，*sacr* 神圣，*rog* 询问。*culprit* 是该受责备的人；*fracture* 是断裂；*distort* 是扭曲；*placate* 是平息。知道词根，就能猜出没见过的词的意思。",
    ],
    [
      "Prefixes steer the root. With *plac*, *im-* (not) gives **implacable**, impossible to calm. With *mut*, *im-* gives **immutable**, never changing. With *culp*, *ex-* (out of) gives **exculpate**, to take someone out of blame. With *ven*, *con-* (together) gives **convene** and *inter-* (between) gives **intervene**. Read the prefix, then the root, and put them together.",
      "前缀决定词根的方向。与 *plac* 搭配，*im-*（不）构成 **implacable**，无法平息的。与 *mut* 搭配，*im-* 构成 **immutable**，永不改变的。与 *culp* 搭配，*ex-*（出）构成 **exculpate**，使人摆脱罪责。与 *ven* 搭配，*con-*（一起）构成 **convene**，*inter-*（之间）构成 **intervene**。先读前缀，再读词根，然后把意思合起来。",
    ],
  ],
});

const greek7 = parts({
  id: "greek-roots-7",
  title: ["Greek Roots 7", "希腊词根 7"],
  summary: [
    "Ten more Greek roots: log, mne, pneum, phan, gno, trop, nom, gam, dys and iatr.",
    "另外十个希腊词根：log、mne、pneum、phan、gno、trop、nom、gam、dys 和 iatr。",
  ],
  after: ["greek-roots-6"],
  kind: ["Greek root", "希腊词根"],
  list: partLines(`
    log|word or reason|词语，理性|logic|the study of correct reasoning|monologue|a long speech by one person|eulogy|a speech of good words in praise of someone who has died
    mne|memory|记忆|amnesia|a loss of memory|mnemonic|a device such as a rhyme that helps the memory|amnesty|a pardon, as if the crime were forgotten
    pneum|air or lung|空气，肺|pneumonia|a disease that fills the lungs with fluid|pneumatic|worked by air under pressure|pneumothorax|air trapped in the chest that makes a lung collapse
    phan|show or appear|显现|phantom|a ghost that appears but is not real|epiphany|a sudden moment in which the truth appears|diaphanous|so thin and fine that light shows through
    gno|know|知道|diagnose|to know an illness from its signs|agnostic|a person who says that one cannot know whether God exists|prognosis|a judgment of how an illness is likely to go, known beforehand
    trop|turn|转向|tropic|one of the two lines of latitude where the sun turns back|heliotrope|a plant that turns toward the sun|entropy|a turn toward disorder in a system
    nom|law or custom|法则，规则|autonomy|the right to make one's own laws or choices|astronomy|the science of the laws of the stars|economy|the managing of a household or a nation by rules
    gam|marriage|婚姻|monogamy|marriage to one partner at a time|bigamy|marriage to two people at once|polygamy|marriage to more than one partner
    dys|bad or difficult|坏，困难|dystopia|an imagined society in which life is bad|dysfunctional|not working well|dyslexia|a difficulty with reading words
    iatr|healing or doctor|治疗，医生|pediatrician|a doctor for children|psychiatry|the healing of the mind|geriatric|having to do with medical care for old people
  `),
  explanations: [
    [
      "Ten more Greek **roots**. *Log* means word or reason, *mne* memory, *pneum* air or lung, *phan* show, *gno* know, *trop* turn, *nom* law, *gam* marriage, *dys* bad or difficult and *iatr* healing. A *mnemonic* helps you remember; *pneumonia* is a disease of the lungs; to *diagnose* is to know an illness through its signs.",
      "另外十个希腊**词根**。*log* 意为词语或理性，*mne* 记忆，*pneum* 空气或肺，*phan* 显现，*gno* 知道，*trop* 转向，*nom* 法则，*gam* 婚姻，*dys* 坏或困难，*iatr* 治疗。*mnemonic* 帮你记忆；*pneumonia* 是肺部的疾病；*diagnose* 就是通过症状认出疾病。",
    ],
    [
      "Greek words are often built from two roots or a prefix and a root. *Auto* (self) and *nom* give **autonomy**, making one's own laws. *Dys* and *topia* (place) give **dystopia**, a bad place. *A-* (not) and *mne* give **amnesia**, not remembering. *Epi-* (upon) and *phan* give **epiphany**, a truth that appears upon you. Split the word and read each part.",
      "希腊语词常由两个词根或一个前缀加一个词根构成。*auto*（自己）加 *nom* 构成 **autonomy**，自己定规则。*dys* 加 *topia*（地方）构成 **dystopia**，糟糕的地方。*a-*（不）加 *mne* 构成 **amnesia**，不记得。*epi-*（在上）加 *phan* 构成 **epiphany**，突然显现在你面前的真相。把词拆开，逐个读出各部分。",
    ],
  ],
});

const adjectiveSuffixes = parts({
  id: "word-parts-that-form-adjectives",
  title: ["Word Parts That Form Adjectives", "构成形容词的词缀"],
  summary: [
    "Ten suffixes that turn words into adjectives: -ory, -ile, -ose, -ine, -ent, -ial, -ulent, -aceous, -ative and -escent.",
    "十个把词变成形容词的后缀：-ory、-ile、-ose、-ine、-ent、-ial、-ulent、-aceous、-ative 和 -escent。",
  ],
  after: ["word-parts-that-form-verbs"],
  kind: ["suffix", "后缀"],
  list: partLines(`
    -ory|having the nature of or serving for|具有……性质的，用于……的|advisory|serving to give advice|celebratory|serving to celebrate|exploratory|done in order to explore
    -ile|able to or having to do with|能……的，与……有关的|fragile|easily broken|juvenile|having to do with young people|tactile|having to do with the sense of touch
    -ose|full of|充满……的|verbose|using too many words|bellicose|full of eagerness to fight|grandiose|full of grand plans, often too grand
    -ine|like or having to do with|像……的，与……有关的|feline|having to do with cats|equine|having to do with horses|crystalline|clear like crystal
    -ent|doing or being|正在……的，处于……状态的|resilient|recovering quickly after trouble|persistent|keeping on in spite of difficulty|dependent|relying on someone or something
    -ial|having to do with|与……有关的|editorial|having to do with editors, or an article giving the editors' opinion|testimonial|having to do with a statement of praise|colonial|having to do with a colony
    -ulent|having much of|富含……的|fraudulent|full of fraud and deceit|opulent|full of wealth and luxury|turbulent|full of violent movement
    -aceous|of the nature of|具有……特性的|herbaceous|of the nature of an herb, soft rather than woody|cretaceous|of the nature of chalk|curvaceous|having curves
    -ative|tending to|倾向于……的|talkative|tending to talk a great deal|argumentative|tending to argue|imaginative|tending to imagine new things
    -escent|beginning to be or becoming|开始变得……的|adolescent|becoming an adult|convalescent|recovering from an illness|iridescent|showing colors that seem to change like a rainbow
  `),
  explanations: [
    [
      "A **suffix** can turn a word into an adjective and add a meaning of its own. *-ose* and *-ulent* mean *full of*: a *verbose* speaker is full of words, a *fraudulent* claim full of fraud. *-ine* means *like*: *feline* grace is like a cat's. *-ative* means *tending to*: a *talkative* child tends to talk. *-escent* means *beginning to be*: an *adolescent* is becoming an adult. *-ory*, *-ile*, *-ent*, *-ial* and *-aceous* mark a word as describing a quality or a connection.",
      "**后缀**可以把词变成形容词，并加上自己的意思。*-ose* 和 *-ulent* 意为*充满*：*verbose* 的讲话者话太多，*fraudulent* 的说法充满欺诈。*-ine* 意为*像*：*feline* 的优雅像猫一样。*-ative* 意为*倾向于*：*talkative* 的孩子爱说话。*-escent* 意为*开始变得*：*adolescent* 正在成为成年人。*-ory*、*-ile*、*-ent*、*-ial* 和 *-aceous* 表示这个词描述一种性质或关联。",
    ],
    [
      "To find the word for a definition, look for the base inside it, then the suffix. *Tending to argue* has *argue* inside it, with *-ative*: **argumentative**. *Full of eagerness to fight* has *bell* (war) with *-ose*: **bellicose**. *Recovering from an illness* is *convalesce* with *-ent*: **convalescent**.",
      "要找出符合释义的词，先找出其中的词干，再找后缀。*tending to argue* 里有 *argue*，加上 *-ative*：**argumentative**。*full of eagerness to fight* 是 *bell*（战争）加 *-ose*：**bellicose**。*recovering from an illness* 是 *convalesce* 加 *-ent*：**convalescent**。",
    ],
  ],
});

/** wordStudyTopics10 are the word study topics of grade 10. */
export const wordStudyTopics10: readonly TopicDef[] = [latin8, greek7, adjectiveSuffixes];
