// B1, unit 8: Relationships. Relationships, personality, getting on, emotions, social life, life events and family
// life; question tags and indirect questions; writing a letter of advice. Its run-ons reuse the native topics.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill, judgedTopic } from "../a2/kit.ts";
import { everyPair, interleave, vocabularyTopic, word } from "../words.ts";
import { indirectQuestionsWriteNot, questionTagsWriteNot } from "./mistakes.ts";

const relationships = vocabularyTopic({
  id: "b1-words-relationships",
  title: t("Relationships", "人际关系"),
  summary: t(
    "Relationships, couples and marriage; divorce and getting engaged; boyfriends and girlfriends; single and romantic; acquaintances, generations and childhood.",
    "关系、情侣和婚姻；离婚和订婚；男朋友和女朋友；单身的和浪漫的；熟人、一代人和童年。",
  ),
  intro: t(
    "A **couple** may get **engaged**, then start a **marriage**, and sometimes it ends in **divorce**. These words help you talk about love, family and the people in your life.",
    "一对 **couple**（情侣）可能先 **engaged**（订婚），然后开始 **marriage**（婚姻），有时以 **divorce**（离婚）告终。这些词帮你谈论爱情、家庭和生活中的人。",
  ),
  prerequisites: ["a2-words-relatives"],
  words: [
    word(
      "relationship relationships",
      "the way two or more people feel about and behave toward each other",
      "关系",
      "I have a good {relationship} with my parents. | They were boyfriend and girlfriend, but their {relationship} ended after three years. | Good {relationships} with friends and coworkers need trust.|marriages generations",
      "marriage generation",
    ),
    word(
      "couple couples",
      "two people who are married or in a romantic relationship",
      "情侣；夫妻",
      "The {couple} next door, Tom and his wife Anna, just had their first baby. | Sam and Mia fell in love at school and have been a {couple} ever since.|generation class | Many {couples} who love each other get married in spring.|generations neighbors",
      "generation neighbor",
    ),
    word(
      "marriage marriages",
      "the relationship between two people who are married",
      "婚姻",
      "My grandparents had a long and happy {marriage}: they were husband and wife for 60 years. | {Marriage} is a big decision. | Their {marriage} lasted fifty years, from their wedding day until he died.",
      "childhood acquaintance",
    ),
    word(
      "divorce divorces divorced divorcing",
      "the legal end of a marriage; to end a marriage",
      "离婚",
      "Her parents got {divorced} when she was six, and her father moved out. | The couple are getting a {divorce}.|childhood generation | One in three marriages ends in {divorce}.|childhood generation",
      "engaged romantic",
    ),
    word(
      "engaged",
      "having agreed to marry someone",
      "订婚的",
      "Tom asked Lisa to marry him, and they got {engaged} last month. | My brother is {engaged}: he's going to marry a girl from Canada. | Before they got married, they were {engaged} for two years and planned the wedding together.|divorced single",
      "single romantic",
    ),
    word(
      "boyfriend boyfriends",
      "a man or a boy with whom someone has a romantic relationship",
      "男朋友",
      "Has your sister got a {boyfriend}? Who is he? | She met her {boyfriend} at university, and he's now her husband. | Her new {boyfriend} is very funny: he makes her laugh all the time.",
      "girlfriend couple",
    ),
    word(
      "girlfriend girlfriends",
      "a woman or a girl with whom someone has a romantic relationship",
      "女朋友",
      "He's bringing his {girlfriend} to the party: she's very nice. | Max and his {girlfriend}, Sara, have been together for a year. | Jack bought his {girlfriend} flowers for her birthday.",
      "boyfriend couple",
    ),
    word(
      "single",
      "not married or not in a romantic relationship",
      "单身的",
      "My aunt has never married and has no partner: she's {single}. | Are you married, or are you {single} with no partner? | He's been {single} since he broke up with his girlfriend.",
      "engaged romantic",
    ),
    word(
      "romantic",
      "about love, or showing love in a special way",
      "浪漫的",
      "They had a {romantic} dinner by candlelight. | It's a {romantic} film about two students who fall in love in Paris. | My dad isn't very {romantic}; he forgot their anniversary.",
      "single divorced",
    ),
    word(
      "acquaintance acquaintances",
      "a person you know a little but who is not a close friend",
      "熟人",
      "Mark isn't a close friend: he's only my {acquaintance} from the office. | At the station I met some old {acquaintances} from my first job.|strangers boyfriends | She has many {acquaintances}, people she knows a little, but few close friends.|strangers boyfriends",
      "stranger boyfriend",
    ),
    word(
      "generation generations",
      "all the people born at about the same time",
      "一代人；代",
      "Three {generations} live in the same house: grandparents, parents and children.|couples relationships | The younger {generation}, people born after 2000, uses phones for everything. | The recipe has been passed down from {generation} to generation.|couple marriage",
      "couple relationship",
    ),
    word(
      "childhood",
      "the time when you are a child",
      "童年",
      "I had a happy {childhood} in a small village, playing in the fields with other kids. | We have been friends since {childhood}. | She told us stories from her {childhood}, when she was a little girl.",
      "generation marriage",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Boyfriend* and *girlfriend* differ only in who the partner is: a *boyfriend* is a man, a *girlfriend* is a woman. Look for *he*, *she*, *his* or *her* near the gap.",
        "*boyfriend* 和 *girlfriend* 只差在对方是谁：*boyfriend* 是男性，*girlfriend* 是女性。留意空格附近的 *he*、*she*、*his* 或 *her*。",
      ),
      meaning: t(
        "*Engaged* means you have agreed to marry but the wedding has not happened yet; after it, you are in a *marriage*. Check whether the meaning is before or after the wedding.",
        "*engaged* 是已经答应结婚但还没举行婚礼；婚礼之后才是 *marriage*。看释义说的是婚礼之前还是之后。",
      ),
      spell: t(
        "*Acquaintance* has a c before the q and ends in -ance: a-c-q-u-a-i-n-t-a-n-c-e.",
        "*acquaintance* 的 q 前面有个 c，结尾是 -ance：a-c-q-u-a-i-n-t-a-n-c-e。",
      ),
    },
    notes: `
      relationship|getting on with parents;boyfriend and girlfriend for three years;friends and coworkers who trust each other|a relationship is how people feel and act toward each other; a marriage is between husband and wife|relationship 是关系；marriage 是婚姻|marriage/marriages=a marriage is between a husband and wife, not any way people get on=marriage 是夫妻之间的婚姻，不是任何人际关系;generation/generations=a generation is people born at the same time, not how two people get on=generation 是同一时期出生的人，不是两人的关系|a good relationship · a relationship with|from *relate*|来自 *relate*
      couple|Tom and his wife Anna next door;in love since school;people in love who marry in spring|a couple is two people in love; a neighbor is one person living near you|couple 是一对情侣或夫妻；neighbor 是邻居|generation/generations=a generation is all the people born at the same time, not two people in love=generation 是同一时期出生的人，不是一对恋人;neighbor/neighbors=a neighbor is a person living near you, not two people in love=neighbor 是住在附近的人，不是一对恋人;class=a class is a group of students, not two people in love=class 是一班学生，不是一对恋人|a young couple · a married couple|*a couple of* also means two or a few|*a couple of* 也表示两个或几个
      marriage|60 years as husband and wife;a big decision;from the wedding day until he died|a marriage is being husband and wife; a childhood is the time when you are a child|marriage 是婚姻；childhood 是童年|childhood/Childhood=a childhood is the time when you are a child, not being husband and wife=childhood 是童年，不是夫妻关系;acquaintance/Acquaintance=an acquaintance is a person you know a little, not being husband and wife=acquaintance 是熟人，不是夫妻关系;generation=a generation is people born at the same time, not being husband and wife=generation 是同代人，不是婚姻|a happy marriage · marriage is|verb *marry*; a *wedding* is the day, *marriage* the life after|动词 *marry*；*wedding* 是婚礼那天，*marriage* 是婚后生活
      divorce|parents apart when she was six;a couple ending their marriage;one in three marriages|divorce is the legal end of a marriage; engaged means agreeing to marry|divorce 是离婚；engaged 是订婚|engaged=engaged means you have agreed to marry, not ended a marriage=engaged 是答应结婚，不是结束婚姻;romantic=romantic is about showing love, not ending a marriage=romantic 是浪漫，不是离婚;childhood=a childhood is the time you are a child, not the end of a marriage=childhood 是童年，不是婚姻的结束;generation=a generation is people born at the same time, not the end of a marriage=generation 是同代人，不是婚姻的结束|get divorced · get a divorce|noun and verb|既是名词也是动词
      engaged|Lisa saying yes to marry Tom;going to marry a girl from Canada;two years planning the wedding|engaged means agreed to marry; single means not in a relationship|engaged 是订婚的；single 是单身的|single=single means not in a relationship, not agreed to marry someone=single 是单身，不是订了婚;romantic=romantic means showing love, not agreed to marry=romantic 是浪漫的，不是订了婚;divorced=divorced means a marriage has ended, not that a wedding is coming=divorced 是离了婚，不是婚礼即将到来|get engaged · engaged to|*engaged* also means busy on a phone line|*engaged* 也指电话占线
      boyfriend|a sister's partner who is a he;met at university and now her husband;a he who makes her laugh|a boyfriend is a man; a girlfriend is a woman|boyfriend 是男朋友；girlfriend 是女朋友|girlfriend=a girlfriend is a woman, but the partner here is a he=girlfriend 是女性，而这里的对象是男性;couple=a couple is two people, not one partner=couple 是两个人，不是一位伴侣|have a boyfriend · her boyfriend|one word|是一个词
      girlfriend|a she brought to a party;Max and Sara;flowers for her birthday|a girlfriend is a woman; a boyfriend is a man|girlfriend 是女朋友；boyfriend 是男朋友|boyfriend=a boyfriend is a man, but the partner here is a she=boyfriend 是男性，而这里的对象是女性;couple=a couple is two people, not one partner=couple 是两个人，不是一位伴侣|his girlfriend · a new girlfriend|one word|是一个词
      single|an aunt with no partner;married or with no partner;after a break-up|single means not in a relationship; engaged means agreed to marry|single 是单身的；engaged 是订婚的|engaged=engaged means agreed to marry, not without a partner=engaged 是订了婚，不是没有伴侣;romantic=romantic means showing love, not without a partner=romantic 是浪漫的，不是没有伴侣|single and lives alone · stay single|*single* also means only one: a single ticket|*single* 也表示单个：a single ticket
      romantic|dinner by candlelight;two students falling in love;a dad who forgot the anniversary|romantic means showing love; single means having no partner|romantic 是浪漫的；single 是单身的|single=single means having no partner, not showing love=single 是单身，不是浪漫;divorced=divorced means a marriage has ended, not showing love in a special way=divorced 是离了婚，不是浪漫|a romantic dinner · a romantic film|from *romance*|来自 *romance*
      acquaintance|someone from the office, not a close friend;old people from a first job;people she knows a little|an acquaintance is someone you know a little; a stranger is someone you don't know|acquaintance 是熟人；stranger 是陌生人|stranger/strangers=a stranger is someone you don't know at all, not someone you know a little=stranger 是完全不认识的人，不是有点认识的人;boyfriend/boyfriends=a boyfriend is a close romantic partner, not someone you know a little=boyfriend 是亲密的男朋友，不是只有点认识的人|an old acquaintance · just an acquaintance|a c comes before the q|q 前面有个 c
      generation|grandparents, parents and children;people born after 2000;passing a recipe down|a generation is people born at the same time; a couple is two people in love|generation 是一代人；couple 是一对情侣|couple/couples=a couple is two people in love, not people born at the same time=couple 是一对恋人，不是同代人;relationship/relationships=a relationship is how people get on, not people born at the same time=relationship 是关系，不是同代人;marriage=a marriage is between husband and wife, not people born at the same time=marriage 是婚姻，不是同代人|the younger generation · three generations|*generation* also means making power: electricity generation|*generation* 也指发电：electricity generation
      childhood|playing in fields in a village;friends since a young age;stories from being a little girl|childhood is the time you are a child; a generation is people born at the same time|childhood 是童年；generation 是一代人|generation=a generation is people born at the same time, not the time when you are a child=generation 是同代人，不是童年;marriage=a marriage is being husband and wife, not the time when you are a child=marriage 是婚姻，不是童年;acquaintance=an acquaintance is a person you know a little, not a time of life=acquaintance 是熟人，不是人生阶段|a happy childhood · since childhood|*child* + *-hood*|由 *child* 加 *-hood* 构成
    `,
  },
});

const personality = vocabularyTopic({
  id: "b1-words-personality",
  title: t("Personality", "性格"),
  summary: t(
    "Personality and character; generous and selfish; shy and outgoing; sensitive and sociable; stubborn, mature, easygoing and considerate.",
    "个性和性格；慷慨的和自私的；害羞的和外向的；敏感的和好交际的；固执的、成熟的、随和的和体贴的。",
  ),
  intro: t(
    "A **generous** person shares, a **selfish** one doesn't, a **shy** person is quiet with new people, and an **outgoing** one loves meeting them. These words help you describe what people are like.",
    "**generous**（慷慨的）人乐于分享，**selfish**（自私的）人不会，**shy**（害羞的）人见到生人很安静，**outgoing**（外向的）人喜欢认识新朋友。这些词帮你描述别人的性格。",
  ),
  prerequisites: ["b1-words-qualities"],
  words: [
    word(
      "personality personalities",
      "the kind of person someone is, shown in the way they behave and feel",
      "个性；性格",
      "She has a warm and friendly {personality}: she's kind to everyone she meets. | The twins look the same, but they have very different {personalities}: one is shy and the other is outgoing.|habits hobbies | A good teacher needs a strong {personality} to keep a noisy class calm.",
      "habit hobby",
      "character",
    ),
    word(
      "character characters",
      "all the qualities that make a person who they are",
      "性格；品质",
      "Honesty is an important part of her {character}. | It's not in his {character} to lie. | Her brother has a very calm {character}: nothing makes him angry.",
      "habit hobby",
      "personality",
    ),
    word(
      "generous",
      "happy to give money, time or help to others",
      "慷慨的；大方的",
      "It was very {generous} of you to pay for dinner. | My grandmother is {generous} with her time and always helps us. | He gave a {generous} gift to the school.",
      "shy stubborn",
    ),
    word(
      "selfish",
      "caring only about yourself and not about other people",
      "自私的",
      "Don't be so {selfish}! Share your sweets with your brother.|mature sociable | It was {selfish} of him to take the last piece of cake.|generous considerate | She's too {selfish} to help anyone.|generous considerate",
      "shellfish generous",
    ),
    word(
      "shy shyer shyest",
      "nervous and uncomfortable with other people, especially new people",
      "害羞的",
      "He was too {shy} to ask her to dance. | She was {shy} at first, but now she talks to everyone. | Don't be {shy}. Come and say hello.",
      "outgoing sociable",
    ),
    word(
      "outgoing",
      "friendly and liking to meet new people",
      "外向的；友好的",
      "My sister is very {outgoing}; she talks to everyone. | {Outgoing} people who love meeting others often enjoy working in sales. | He's more {outgoing} than his brother, who prefers to stay at home.",
      "shy stubborn",
      "sociable",
    ),
    word(
      "sensitive",
      "easily upset by what people say or do; or quick to notice how others feel",
      "敏感的；体贴的",
      "Be careful what you say; he's very {sensitive} about his weight.|outgoing easygoing | She's a {sensitive} girl who notices when her friends are sad.|stubborn selfish | My skin is very {sensitive}, so I always wear sun cream.|stubborn sociable",
      "sensible sentence",
    ),
    word(
      "sociable",
      "enjoying being with other people",
      "好交际的；合群的",
      "Our neighbors are very {sociable} and often invite us for dinner.|shy selfish | I'm not feeling very {sociable} today; I'd rather stay in.|stubborn mature | Dogs are {sociable} animals that like company.|stubborn selfish",
      "social socket",
      "outgoing",
    ),
    word(
      "stubborn",
      "not willing to change your ideas or what you do, even when you should",
      "固执的；倔强的",
      "My grandfather is too {stubborn} to see a doctor.|sociable outgoing | Don't be so {stubborn}. Just say sorry.|sociable generous | She's as {stubborn} as a mule.|sociable generous",
      "strong stupid",
    ),
    word(
      "mature",
      "behaving in a sensible way, like an adult",
      "成熟的",
      "She's very {mature} for a twelve-year-old: she behaves like an adult. | It wasn't very {mature} of you to shout at him.|shy sociable | He has become much more {mature} and sensible since he started university.|shy stubborn",
      "shy selfish",
    ),
    word(
      "easygoing",
      "relaxed, and not easily worried or annoyed",
      "随和的；好相处的",
      "My dad is very {easygoing}; he never gets angry. | She is {easygoing} and gets on with everyone. | Our teacher is {easygoing} about homework deadlines: a day late is fine.|selfish shy",
      "stubborn selfish",
    ),
    word(
      "considerate",
      "always thinking of other people's feelings and needs",
      "体贴的；考虑周到的",
      "It was {considerate} of you to call me when you knew you'd be late.|stubborn shy | Please be {considerate} and turn your music down.|stubborn shy | He's a kind, {considerate} neighbor.|stubborn selfish",
      "considerable confident",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Shy* and *outgoing* are opposites: a *shy* person feels nervous with new people, an *outgoing* person enjoys them. Look at how the person acts with others in the sentence.",
        "*shy* 和 *outgoing* 意思相反：*shy* 的人见生人紧张，*outgoing* 的人喜欢和人打交道。看句中这个人和别人相处的表现。",
      ),
      meaning: t(
        "*Sensitive* is about feelings: easily upset, or quick to notice how others feel. *Sensible* means having good sense. Check whether the meaning talks about feelings or about good judgment.",
        "*sensitive* 和感受有关：容易受伤，或很快察觉别人的感受。*sensible* 是明智的。看释义说的是感受还是判断力。",
      ),
      spell: t(
        "*Considerate* ends in -ate, not -able: c-o-n-s-i-d-e-r-a-t-e; *considerable* is a different word.",
        "*considerate* 以 -ate 结尾，不是 -able：c-o-n-s-i-d-e-r-a-t-e；*considerable* 是另一个词。",
      ),
    },
    notes: `
      personality|kind to everyone she meets;twins, one shy and one outgoing;a teacher keeping a class calm|personality is the kind of person you are; a habit is something you do often|personality 是个性；habit 是习惯|habit/habits=a habit is something you do often, not the kind of person you are=habit 是常做的事，不是性格;hobby/hobbies=a hobby is something you do for fun, not the kind of person you are=hobby 是业余爱好，不是性格|a strong personality · a friendly personality|close to *character*|和 *character* 意思相近
      character|honesty as an important part;not one to lie;a brother nothing makes angry|character is the qualities that make you who you are; a hobby is something you enjoy doing|character 是品格；hobby 是爱好|habit=a habit is something you do often, not all the qualities that make you who you are=habit 是习惯，不是品格;hobby=a hobby is something you do for fun, not the qualities that make you who you are=hobby 是业余爱好，不是品格|a calm character · in his character|*character* is also a person in a story|*character* 也指故事里的人物
      generous|paying for dinner;giving time and always helping;a big gift to a school|generous means happy to give; selfish means caring only about yourself|generous 是慷慨的；selfish 是自私的|shy=shy means nervous with people, not happy to give=shy 是害羞，不是慷慨;stubborn=stubborn means not changing your mind, not happy to give=stubborn 是固执，不是慷慨;sociable=sociable means enjoying company, not happy to give money or gifts=sociable 是好交际，不是慷慨;mature=mature means sensible like an adult, not happy to give=mature 是成熟，不是慷慨|generous with · a generous gift|noun *generosity*|名词 *generosity*
      selfish|sweets not shared with a brother;taking the last piece of cake;never helping anyone|selfish means caring only about yourself; generous means happy to give|selfish 是自私的；generous 是慷慨的|generous=generous means happy to give, not caring only about yourself=generous 是乐于给予，不是自私;considerate=considerate means thinking of others, not only about yourself=considerate 是体贴别人，不是自私;mature=mature means sensible like an adult, not caring only about yourself=mature 是成熟，不是自私;sociable=sociable means enjoying company, not caring only about yourself=sociable 是好交际，不是自私;shellfish=shellfish are sea animals with shells, not a word for how a person behaves=shellfish 是贝类海鲜，不是形容人的词|selfish of him · too selfish to|*self* + *-ish*; not *shellfish*|由 *self* 加 *-ish* 构成；不是 *shellfish*
      shy|too nervous to ask someone to dance;quiet at first, then talking to everyone;told to come and say hello|shy means nervous with people; outgoing means liking to meet people|shy 是害羞的；outgoing 是外向的|outgoing=outgoing means liking to meet new people, not nervous with them=outgoing 是外向，不是紧张害羞;sociable=sociable means enjoying company, not nervous with people=sociable 是好交际，不是害羞|too shy to · shy at first|comparative *shyer*|比较级 *shyer*
      outgoing|a sister who talks to everyone;people who love meeting others;a brother who prefers staying home|outgoing means liking to meet people; shy means nervous with them|outgoing 是外向的；shy 是害羞的|shy/Shy=shy means nervous with new people, not liking to meet them=shy 是害羞，不是喜欢结识新人;stubborn/Stubborn=stubborn means not changing your mind, not liking to meet people=stubborn 是固执，不是外向|very outgoing · an outgoing person|*outgoing* also means leaving a job: the outgoing president|*outgoing* 也指即将离任的：the outgoing president
      sensitive|careful words about weight;noticing when friends are sad;skin that needs sun cream|sensitive means easily upset or quick to notice feelings; easygoing means relaxed|sensitive 是敏感的；easygoing 是随和的|outgoing=outgoing means liking to meet people, not easily upset=outgoing 是外向，不是敏感;easygoing=easygoing means relaxed and not easily upset=easygoing 是随和，不容易被惹恼;stubborn=stubborn means not changing your mind, not quick to notice feelings or easily hurt=stubborn 是固执，不是敏感;selfish=selfish means caring only about yourself, not noticing how others feel=selfish 是自私，不会察觉别人的感受;sociable=sociable means enjoying company, not easily hurt by the sun=sociable 是好交际，不是容易被晒伤|sensitive about · sensitive skin|not *sensible*, which means having good sense|不是 *sensible*（明智的）
      sociable|neighbors who invite us for dinner;not wanting company today;dogs that like company|sociable means enjoying being with people; shy means nervous with them|sociable 是好交际的；shy 是害羞的|shy=shy means nervous with people, not enjoying inviting them=shy 是害羞，不是喜欢请人吃饭;selfish=selfish means caring only about yourself, not enjoying company=selfish 是自私，不是好交际;stubborn=stubborn means not changing your mind, not enjoying company=stubborn 是固执，不是好交际;mature=mature means sensible like an adult, not wanting company=mature 是成熟，不是想要陪伴;socket=a socket is where you plug things in, not a friendly person=socket 是插座，不是爱交际的人|very sociable · sociable animals|from *social*|来自 *social*
      stubborn|refusing to see a doctor;not saying sorry;like a mule|stubborn means not changing your mind; sociable means enjoying company|stubborn 是固执的；sociable 是好交际的|sociable=sociable means enjoying company, not refusing to change your mind=sociable 是好交际，不是固执;outgoing=outgoing means liking new people, not refusing to change your mind=outgoing 是外向，不是固执;generous=generous means happy to give, not refusing to change your mind=generous 是慷慨，不是固执;stupid=stupid means not clever, not refusing to change your mind=stupid 是笨，不是固执|too stubborn to · as stubborn as a mule|double b: s-t-u-b-b-o-r-n|双写 b：s-t-u-b-b-o-r-n
      mature|a twelve-year-old who behaves like an adult;not shouting at someone;sensible since university|mature means sensible like an adult; shy means nervous with people|mature 是成熟的；shy 是害羞的|shy=shy means nervous with people, not sensible like an adult=shy 是害羞，不是成熟;selfish=selfish means caring only about yourself, not behaving like an adult=selfish 是自私，不是成熟;sociable=sociable means enjoying company, not sensible like an adult=sociable 是好交际，不是成熟;stubborn=stubborn means not changing your mind, not sensible like an adult=stubborn 是固执，不是成熟|mature for · become more mature|*mature* is not *nature*|*mature* 不是 *nature*
      easygoing|a dad who never gets angry;getting on with everyone;a day late is fine|easygoing means relaxed; stubborn means not changing your mind|easygoing 是随和的；stubborn 是固执的|stubborn=stubborn means refusing to change your mind, not relaxed=stubborn 是固执，不是随和;selfish=selfish means caring only about yourself, not relaxed with others=selfish 是自私，不是随和;shy=shy means nervous with people, not relaxed about rules=shy 是害羞，不是对规矩随和|very easygoing · easygoing about|also written *easy-going*|也写作 *easy-going*
      considerate|calling when you'll be late;turning your music down;a kind neighbor|considerate means thinking of others' feelings; stubborn means not changing your mind|considerate 是体贴的；stubborn 是固执的|stubborn=stubborn means not changing your mind, not thinking of others' feelings=stubborn 是固执，不是体贴;shy=shy means nervous with people, not thinking of their needs=shy 是害羞，不是体贴;selfish=selfish means thinking only of yourself, not of others=selfish 是只想着自己，不是体贴;considerable=considerable means large in amount, not kind to others=considerable 是相当多的，不是体贴的|considerate of you · be considerate|*considerate* is not *considerable*, which means large|*considerate* 不是 *considerable*（相当大的）
    `,
  },
});

const gettingOn = vocabularyTopic({
  id: "b1-words-getting-on",
  title: t("Getting On", "相处"),
  summary: t(
    "Supporting, apologizing and forgiving; admitting, blaming and criticizing; praising and complaining; deserving; ignoring; quarrels, arguments and disagreeing.",
    "支持、道歉和原谅；承认、责备和批评；表扬和抱怨；应得；忽视；争吵、争论和意见不合。",
  ),
  intro: t(
    "After a **quarrel**, you might **admit** you were wrong, **apologize**, and hope your friend will **forgive** you. These words help you talk about getting on with people and making up after a fight.",
    "吵了一 **quarrel**（架）之后，你可能会 **admit**（承认）自己错了，**apologize**（道歉），并希望朋友 **forgive**（原谅）你。这些词帮你谈论与人相处和吵架后和好。",
  ),
  prerequisites: ["a2-words-people-together"],
  words: [
    word(
      "support supports supported supporting",
      "to help someone, especially when they have problems",
      "支持；帮助",
      "My family always {supports} me and helps me when things are difficult.|blames criticizes | Thank you for all your {support}.|argument quarrel | Which football team do you {support}? I'm a big fan of Liverpool.",
      "blame criticize",
    ),
    word(
      "apologize apologizes apologized apologizing",
      "to say that you are sorry",
      "道歉",
      "You broke your sister's phone, so you should {apologize} and say sorry. | He {apologized}: \"I'm sorry I'm late.\"|complained disagreed | I {apologize} if I hurt your feelings.",
      "complain disagree",
    ),
    word(
      "forgive forgives forgave forgiven forgiving",
      "to stop being angry with someone for something they did",
      "原谅",
      "Please {forgive} me. I didn't mean it. | She was angry for years and never {forgave} him for forgetting her birthday.|criticized blamed | I'm not angry any more: I've {forgiven} you, but I won't forget.|criticized blamed",
      "criticize blame",
    ),
    word(
      "admit admits admitted admitting",
      "to agree that something bad is true, often unwillingly",
      "承认",
      "He {admitted} that he had broken the window and said sorry.|denied complained | I must {admit} I was wrong: you were right all along. | She never {admits} her mistakes and always says they were someone else's.|denies forgives",
      "deny complain",
    ),
    word(
      "blame blames blamed blaming",
      "to say that someone is responsible for something bad",
      "责备；归咎于",
      "Don't {blame} me for the broken window! It wasn't my fault. | The driver {blamed} the weather for the accident.|praised thanked | It was an accident: nobody {blames} you for what happened.|praises thanks",
      "praise thank",
    ),
    word(
      "criticize criticizes criticized criticizing",
      "to say what you think is bad about someone or something",
      "批评；指责",
      "My boss {criticized} my report in front of everyone and said it was full of mistakes.|praised ignored | It's easy to {criticize} other people and say what they do wrong. | Parents shouldn't always {criticize} their children; they should also praise them.",
      "praise ignore",
    ),
    word(
      "praise praises praised praising",
      "to say that someone or something is very good",
      "表扬；称赞",
      "The teacher {praised} her for her excellent essay.|blamed criticized | Children need {praise} when they do well, as well as rules. | Everyone {praises} the food at that restaurant: it's delicious.|blames criticizes",
      "blame criticize",
    ),
    word(
      "complain complains complained complaining",
      "to say that you are not happy about something",
      "抱怨；投诉",
      "Our neighbors {complained} to us about the noise and asked us to be quiet.|apologized lied | Stop {complaining} about the food and eat your dinner!|apologizing lying | He's always {complaining} about the weather.|apologizing lying",
      "apologize lie",
    ),
    word(
      "deserve deserves deserved deserving",
      "to have earned something because of what you have done",
      "应得；值得",
      "You worked hard, so you {deserve} a holiday. | She {deserved} to win the prize after all her hard work.|refused forgot | He's so rude to her that he doesn't {deserve} such a kind girlfriend.",
      "deny ignore",
    ),
    word(
      "quarrel quarrels quarreled quarreling",
      "an angry argument; to argue angrily",
      "争吵",
      "The two brothers {quarreled} angrily about money and shouted at each other.|apologized laughed | We had a {quarrel}, but we're friends again now. | Stop {quarreling}, you two, and be friends again!|apologizing laughing",
      "joke chat",
      "argument",
    ),
    word(
      "argument arguments",
      "a talk in which people disagree, often angrily",
      "争论；争吵",
      "My dad and I had a big {argument} about my phone, and we both shouted. | They never have {arguments} about money: they always agree.|jokes chats | The angry {argument} ended when she walked out of the room.",
      "joke chat",
      "quarrel",
    ),
    word(
      "disagree disagrees disagreed disagreeing",
      "to have a different opinion from someone",
      "不同意；意见不合",
      "I {disagree} with you about the new rule: I think it's a bad idea, and you think it's good. | My parents often {disagree} about where to go on holiday: Mom wants the beach and Dad wants the mountains. | Two teachers {disagreed} about the best answer: one said A and the other said B.|agreed joked",
      "agree joke",
    ),
    word(
      "ignore ignores ignored ignoring",
      "to pay no attention to someone or something",
      "忽视；不理睬",
      "I said hello, but she {ignored} me and walked past without a word.|answered thanked | Don't {ignore} the doctor's advice: do what she says.|follow answer | He kept {ignoring} my messages and never wrote back.|answering thanking",
      "answer thank",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Praise* and *criticize* are opposites: you *praise* what is good and *criticize* what is bad. Look for words like *excellent* or *mistakes* in the sentence.",
        "*praise* 和 *criticize* 意思相反：*praise* 夸好的，*criticize* 批评不好的。留意句中的 *excellent* 或 *mistakes* 这类词。",
      ),
      meaning: t(
        "*Blame* and *forgive* are both about something bad someone did, but to *blame* is to say they are responsible, and to *forgive* is to stop being angry. Check whether the anger starts or ends.",
        "*blame* 和 *forgive* 都与别人做的坏事有关，但 *blame* 是说他该负责，*forgive* 是不再生气。看怒气是开始还是结束。",
      ),
      spell: t(
        "*Forgive* has an irregular past: *forgave*, *forgiven*; *quarrel* doubles the r: q-u-a-r-r-e-l.",
        "*forgive* 的过去式不规则：*forgave*、*forgiven*；*quarrel* 双写 r：q-u-a-r-r-e-l。",
      ),
    },
    notes: `
      support|family help when things are difficult;thanks for help;a football team|to support is to help; to blame is to say someone is responsible for something bad|support 是支持；blame 是责备|blame/blames=to blame is to say someone caused something bad, not to help them=blame 是归咎，不是帮助;criticize/criticizes=to criticize is to say what is bad, not to help=criticize 是批评，不是帮助;argument=an argument is an angry talk, not help you thank someone for=argument 是争吵，不是值得感谢的帮助;quarrel=a quarrel is an angry argument, not help=quarrel 是争吵，不是帮助;forgive=to forgive is to stop being angry, not to be a fan of a team=forgive 是原谅，不是支持球队|support someone · support a team|noun and verb|既是名词也是动词
      apologize|saying sorry for a broken phone;"I'm sorry I'm late";hurt feelings|to apologize is to say sorry; to complain is to say you are not happy|apologize 是道歉；complain 是抱怨|complain/complained=to complain is to say you are not happy, not to say sorry=complain 是抱怨，不是道歉;disagree/disagreed=to disagree is to have a different opinion, not to say sorry=disagree 是意见不同，不是道歉|apologize to · apologize for|noun *apology*|名词 *apology*
      forgive|"I didn't mean it";years of anger about a birthday;not angry any more|to forgive is to stop being angry; to blame is to say someone is responsible|forgive 是原谅；blame 是责备|criticize/criticized=to criticize is to say what is bad, not to stop being angry=criticize 是批评，不是原谅;blame/blamed=to blame is to say someone is responsible, not to stop being angry=blame 是归咎，不是原谅|forgive someone for · please forgive me|past *forgave*, *forgiven*|过去式 *forgave*，过去分词 *forgiven*
      admit|a broken window and sorry;being wrong;mistakes she says were others'|to admit is to agree something bad is true; to deny is to say it isn't true|admit 是承认；deny 是否认|deny/denied/denies=to deny is to say something is not true, not to agree it is=deny 是否认，不是承认;complain/complained=to complain is to say you are not happy, not to agree something bad is true=complain 是抱怨，不是承认;forgives=to forgive is to stop being angry with someone, not to agree your own mistake is true=forgive 是原谅别人，不是承认自己的错|admit a mistake · I must admit|past *admitted* doubles the t|过去式 *admitted* 双写 t
      blame|a broken window that wasn't my fault;the weather and an accident;an accident nobody caused on purpose|to blame is to say someone is responsible for something bad; to praise is to say they did well|blame 是责备；praise 是表扬|praise/praised/praises=to praise is to say something is good, not that someone caused something bad=praise 是表扬，不是归咎;thank/thanked/thanks=to thank is to say you are grateful, not that someone caused something bad=thank 是感谢，不是归咎|blame someone for · don't blame me|*blame* is also a noun: take the blame|*blame* 也是名词：take the blame
      criticize|a report full of mistakes;saying what others do wrong;children who should also be praised|to criticize is to say what is bad; to praise is to say what is good|criticize 是批评；praise 是表扬|praise/praised=to praise is to say something is good, not what is bad=praise 是夸好的，不是批评;ignore/ignored=to ignore is to pay no attention, not to say what is bad=ignore 是不理睬，不是批评|criticize someone · easy to criticize|British spelling *criticise*|英式拼写 *criticise*
      praise|an excellent essay;doing well, as well as rules;delicious food|to praise is to say something is very good; to blame is to say someone caused something bad|praise 是表扬；blame 是责备|blame/blamed/blames=to blame is to say someone caused something bad, not that they did well=blame 是归咎，不是表扬;criticize/criticized/criticizes=to criticize is to say what is bad, not what is very good=criticize 是批评，不是表扬;quarrel=a quarrel is an angry argument, not something children need when they do well=quarrel 是争吵，不是孩子做得好时需要的东西|praise someone for · need praise|*praise* is not *price*|*praise* 不是 *price*
      complain|neighbors asking for quiet about noise;food at dinner;the weather|to complain is to say you are not happy; to apologize is to say sorry|complain 是抱怨；apologize 是道歉|apologize/apologized/apologizing=to apologize is to say sorry, not to say you are not happy=apologize 是道歉，不是抱怨;lie/lied/lying=to lie is to say something untrue, not to say you are not happy=lie 是说谎，不是抱怨|complain about · complain to|noun *complaint*|名词 *complaint*
      deserve|a holiday after hard work;a prize after hard work;a kind girlfriend he is rude to|to deserve is to have earned something; to deny is to say something isn't true|deserve 是应得；deny 是否认|deny=to deny is to say something isn't true, not to have earned it=deny 是否认，不是应得;ignore=to ignore is to pay no attention, not to have earned something=ignore 是不理睬，不是应得;refused=to refuse is to say no, not to have earned something=refuse 是拒绝，不是应得;forgot=to forget is not to remember, not to have earned something=forget 是忘记，不是应得|deserve a rest · deserve to win|*deserve* is not *reserve*|*deserve* 不是 *reserve*
      quarrel|brothers shouting about money;friends again after one;two people told to be friends again|a quarrel is an angry argument; a joke is something funny|quarrel 是争吵；joke 是笑话|joke=a joke is something funny, not an angry argument=joke 是笑话，不是争吵;chat=a chat is a friendly talk, not an angry argument=chat 是友好的聊天，不是争吵;apologized/apologizing=to apologize is to say sorry, not to argue angrily=apologize 是道歉，不是吵架;laughed/laughing=to laugh is to show something is funny, not to argue angrily=laugh 是笑，不是吵架|have a quarrel · quarrel about|American *quarreled*, British *quarrelled*|美式 *quarreled*，英式 *quarrelled*
      argument|shouting about a phone;money, when they always agree;ended by walking out|an argument is an angry talk; a chat is a friendly one|argument 是争论；chat 是聊天|joke/jokes=a joke is something funny, not an angry talk=joke 是笑话，不是争吵;chat/chats=a chat is a friendly talk, not an angry one=chat 是友好的聊天，不是争吵|have an argument · an argument about|*argue* drops its e: *argument*|*argue* 去掉 e：*argument*
      disagree|a bad idea against a good one;the beach or the mountains;answer A or answer B|to disagree is to have a different opinion; to agree is to have the same one|disagree 是不同意；agree 是同意|agree/agreed=to agree is to have the same opinion, not a different one=agree 是意见相同，不是不同;joke/joked=to joke is to say something funny, not to have a different opinion=joke 是开玩笑，不是意见不同|disagree with · disagree about|*dis-* + *agree*|由 *dis-* 加 *agree* 构成
      ignore|walking past without a word;a doctor's advice;messages never answered|to ignore is to pay no attention; to answer is to reply|ignore 是不理睬；answer 是回答|answer/answered/answering=to answer is to reply, not to pay no attention=answer 是回答，不是不理睬;thank/thanked/thanking=to thank is to say you are grateful, not to pay no attention=thank 是感谢，不是不理睬;follow=to follow advice is to do what it says, not to pay no attention to it=follow 是听从，不是忽视|ignore someone · ignore advice|*ignore* is not *ignorant*, which means not knowing|*ignore* 不是 *ignorant*（无知的）
    `,
  },
});

const emotions = vocabularyTopic({
  id: "b1-words-emotions",
  title: t("Emotions", "情绪"),
  summary: t(
    "Emotions; anger, fear and joy; grateful, disappointed and frustrated; confused and ashamed; relieved and annoyed.",
    "情绪；愤怒、恐惧和喜悦；感激的、失望的和沮丧的；困惑的和羞愧的；松了口气的和恼火的。",
  ),
  intro: t(
    "You can feel **anger**, **fear** or **joy**; you can be **grateful** for help, **relieved** when a problem is over, or **disappointed** when things go wrong. These words help you say how you feel.",
    "你会感到 **anger**（愤怒）、**fear**（恐惧）或 **joy**（喜悦）；得到帮助会 **grateful**（感激），问题解决会 **relieved**（松了口气），事情不顺会 **disappointed**（失望）。这些词帮你说出自己的感受。",
  ),
  prerequisites: ["a2-words-feelings-2"],
  words: [
    word(
      "emotion emotions",
      "a strong feeling, such as love, anger or fear",
      "情感；情绪",
      "It's hard for him to show his {emotions}: he never cries or laughs.|opinions situations | Fear is a natural {emotion}. | Her voice was full of {emotion} as she said goodbye.",
      "opinion situation",
    ),
    word(
      "emotional",
      "having or showing strong feelings",
      "情绪的；激动的",
      "The goodbye at the airport was very {emotional}: everyone was crying. | She gets {emotional} and starts to cry when she talks about her grandmother.|grateful relieved | Teenagers go through many {emotional} changes.|grateful relieved",
      "grateful ashamed",
    ),
    word(
      "anger",
      "the strong feeling you have when you are very annoyed",
      "愤怒",
      "He couldn't hide his {anger} and shouted when he saw the broken window. | She shouted in {anger} and slammed the door. | Count to ten to control your {anger} when someone annoys you.",
      "joy fear",
    ),
    word(
      "fear fears",
      "the feeling you have when you think something bad may happen",
      "恐惧；害怕",
      "Her {fear} of spiders is so strong that she screams when she sees one. | The children were shaking with {fear} as the storm got closer. | You must face your {fears}, the things that frighten you.|joys angers",
      "joy anger",
    ),
    word(
      "joy",
      "great happiness",
      "喜悦；快乐",
      "The baby brought {joy} to the whole family. | She jumped for {joy} when she heard the news. | Music brings {joy} and happiness to many people.",
      "anger fear",
    ),
    word(
      "grateful",
      "wanting to thank someone for what they have done",
      "感激的",
      "I'm very {grateful} for all your help.|annoyed ashamed | We are {grateful} to everyone who gave money.|confused annoyed | She was {grateful} to her friends for visiting her in hospital.|ashamed annoyed",
      "great graceful",
    ),
    word(
      "disappointed",
      "sad because something was not as good as you hoped",
      "失望的",
      "I was {disappointed} with my exam results: they were worse than I hoped. | The fans were {disappointed} when the concert was canceled. | Mom will be {disappointed} if you don't come home for her birthday.",
      "grateful relieved",
    ),
    word(
      "frustrated",
      "annoyed because you cannot do or get what you want",
      "沮丧的；受挫的",
      "I get {frustrated} when my computer is slow.|grateful relieved | He was {frustrated} because nobody listened to his ideas.|grateful relieved | She felt {frustrated} after failing her driving test again.|grateful relieved",
      "frightened fried",
      "annoyed disappointed",
    ),
    word(
      "confused",
      "not able to understand something or think clearly",
      "困惑的；糊涂的",
      "I'm {confused}. Can you explain it again?|grateful relieved | The new road signs left many drivers {confused}.|grateful ashamed | He looked {confused} when I spoke to him in French.|grateful relieved",
      "confident refused",
    ),
    word(
      "ashamed",
      "feeling bad and embarrassed about something you did",
      "羞愧的",
      "He was {ashamed} of himself for lying to his mother.|grateful relieved | You should be {ashamed} of what you said.|grateful relieved | I'm {ashamed} to say I forgot her name.|relieved grateful",
      "amazed shameless",
    ),
    word(
      "relieved",
      "happy because something bad did not happen or is finished",
      "宽慰的；松了口气的",
      "I was so {relieved} when I found my passport.|ashamed annoyed | We were {relieved} to hear that everyone was safe.|ashamed annoyed | She looked {relieved} when the exam was over.|ashamed annoyed",
      "received believed",
    ),
    word(
      "annoyed",
      "a little angry",
      "恼火的；烦恼的",
      "I was {annoyed} because he was late again.|grateful relieved | She gets {annoyed} when people interrupt her.|grateful relieved | Dad was {annoyed} with me for leaving the door open.|grateful relieved",
      "enjoyed avoided",
      "frustrated",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Emotion* is a noun and *emotional* is an adjective: you show your *emotions*, but a goodbye is *emotional*. Look at the word before the gap.",
        "*emotion* 是名词，*emotional* 是形容词：show your *emotions*，但 a goodbye is *emotional*。看空格前面的词。",
      ),
      meaning: t(
        "*Disappointed* and *frustrated* are both unhappy feelings, but you are *disappointed* when something was not as good as you hoped, and *frustrated* when you keep trying and cannot get what you want. Check whether the meaning talks about hopes or about trying.",
        "*disappointed* 和 *frustrated* 都是不开心，但 *disappointed* 是结果不如期望，*frustrated* 是一再努力却做不到。看释义说的是期望还是努力。",
      ),
      spell: t(
        "*Disappointed* has one s and a double p: d-i-s-a-p-p-o-i-n-t-e-d.",
        "*disappointed* 有一个 s、两个 p：d-i-s-a-p-p-o-i-n-t-e-d。",
      ),
    },
    notes: `
      emotion|someone who never cries or laughs;fear as a natural one;a voice saying goodbye|an emotion is a strong feeling; an opinion is what you think|emotion 是情感；opinion 是观点|opinion/opinions=an opinion is what you think about something, not a strong feeling like love or fear=opinion 是看法，不是爱或恐惧这样的情感;situation/situations=a situation is what is happening, not a feeling=situation 是情况，不是情感|show your emotions · full of emotion|adjective *emotional*|形容词 *emotional*
      emotional|everyone crying at the airport;starting to cry about a grandmother;changes in teenagers|emotional means showing strong feelings; grateful means wanting to thank|emotional 是激动的；grateful 是感激的|grateful=grateful means wanting to thank someone, not crying with strong feelings=grateful 是感激，不是情绪激动得哭;ashamed=ashamed means feeling bad about what you did, not crying at a goodbye=ashamed 是羞愧，不是告别时激动;relieved=relieved means happy something bad is over, not showing strong feelings and crying=relieved 是松了口气，不是激动得哭|get emotional · an emotional goodbye|from *emotion*|来自 *emotion*
      anger|shouting at a broken window;a slammed door;counting to ten|anger is a strong annoyed feeling; joy is great happiness|anger 是愤怒；joy 是喜悦|joy=joy is great happiness, not the feeling that makes you shout and slam doors=joy 是喜悦，不是让人大喊摔门的情绪;fear=fear is being afraid, not the feeling of being very annoyed=fear 是害怕，不是恼怒|in anger · control your anger|adjective *angry*|形容词 *angry*
      fear|screaming at spiders;shaking as a storm came;things that frighten you|fear is the feeling that something bad may happen; joy is great happiness|fear 是恐惧；joy 是喜悦|joy/joys=joy is great happiness, not the feeling that something bad may happen=joy 是喜悦，不是担心坏事发生;anger/angers=anger is feeling very annoyed, not afraid=anger 是愤怒，不是害怕|a fear of · shaking with fear|*fear* is also a verb: I fear the worst|*fear* 也是动词：I fear the worst
      joy|a baby for the whole family;jumping at good news;music and happiness|joy is great happiness; fear is being afraid|joy 是喜悦；fear 是恐惧|anger=anger is feeling very annoyed, not great happiness=anger 是愤怒，不是喜悦;fear=fear is being afraid, not great happiness=fear 是害怕，不是喜悦|jump for joy · bring joy|adjective *joyful*|形容词 *joyful*
      grateful|all your help;everyone who gave money;friends visiting in hospital|grateful means wanting to thank; annoyed means a little angry|grateful 是感激的；annoyed 是恼火的|annoyed=annoyed means a little angry, not wanting to thank someone=annoyed 是有点生气，不是感激;ashamed=ashamed means feeling bad about what you did, not wanting to thank=ashamed 是羞愧，不是感激;confused=confused means not understanding, not wanting to thank=confused 是困惑，不是感激;graceful=graceful means moving in a smooth, beautiful way, not thankful=graceful 是优雅，不是感激|grateful for · grateful to|*grate-* not *great-*: g-r-a-t-e-f-u-l|拼作 *grate-* 不是 *great-*
      disappointed|exam results worse than hoped;a canceled concert;not coming home for a birthday|disappointed means sad because something was worse than you hoped; relieved means happy a problem is over|disappointed 是失望的；relieved 是松了口气的|grateful=grateful means wanting to thank someone, not sad about something worse than you hoped=grateful 是感激，不是失望;relieved=relieved means happy a problem is over, not sad things went wrong=relieved 是松了口气，不是失望|disappointed with · disappointed when|*disappoint* has one s, double p|*disappoint* 一个 s、两个 p
      frustrated|a slow computer;nobody listening to ideas;failing a driving test again|frustrated means annoyed because you can't do what you want; grateful means wanting to thank|frustrated 是受挫的；grateful 是感激的|grateful=grateful means wanting to thank someone, not annoyed at failing=grateful 是感激，不是受挫;relieved=relieved means happy something bad is over, not annoyed because you can't do something=relieved 是松了口气，不是受挫;frightened=frightened means afraid, not annoyed because you cannot do something=frightened 是害怕，不是因做不成事而恼火|get frustrated · feel frustrated|noun *frustration*|名词 *frustration*
      confused|asking for an explanation again;new road signs;French you don't understand|confused means not able to understand; relieved means happy a problem is over|confused 是困惑的；relieved 是松了口气的|grateful=grateful means wanting to thank someone, not unable to understand=grateful 是感激，不是不明白;relieved=relieved means happy a problem is over, not unable to understand=relieved 是松了口气，不是困惑;ashamed=ashamed means feeling bad about what you did, not unable to understand signs=ashamed 是羞愧，不是看不懂|confused about · look confused|*confusing* describes what confuses you|*confusing* 描述让人困惑的东西
      ashamed|lying to a mother;something unkind you said;forgetting a name|ashamed means feeling bad about what you did; relieved means happy something is over|ashamed 是羞愧的；relieved 是松了口气的|grateful=grateful means wanting to thank someone, not feeling bad about what you did=grateful 是感激，不是羞愧;relieved=relieved means happy something bad is over, not feeling bad about what you did=relieved 是松了口气，不是羞愧;amazed=amazed means very surprised, not feeling bad about something you did=amazed 是惊讶，不是羞愧;shameless=shameless means feeling no shame at all, which is the opposite=shameless 是不知羞耻，正好相反|ashamed of · ashamed to say|*a-* + *shamed*|由 *a-* 加 *shamed* 构成
      relieved|a passport found;everyone safe;an exam that is over|relieved means happy something bad is over; annoyed means a little angry|relieved 是松了口气的；annoyed 是恼火的|ashamed=ashamed means feeling bad about what you did, not happy a problem is over=ashamed 是羞愧，不是松了口气;annoyed=annoyed means a little angry, not happy a problem is over=annoyed 是有点生气，不是松了口气|relieved to hear · so relieved|*ie* in *relieved*, like *believe*|*relieved* 里是 *ie*，像 *believe*
      annoyed|someone late again;people interrupting;a door left open|annoyed means a little angry; grateful means wanting to thank|annoyed 是恼火的；grateful 是感激的|grateful=grateful means wanting to thank someone, not a little angry=grateful 是感激，不是生气;relieved=relieved means happy a problem is over, not a little angry=relieved 是松了口气，不是生气|annoyed with · get annoyed|*annoying* describes the person or thing that annoys you|*annoying* 描述让人烦的人或事
    `,
  },
});

const social = vocabularyTopic({
  id: "b1-words-social-life",
  title: t("Social Life", "社交生活"),
  summary: t(
    "Gatherings and reunions; visitors; gossip; greeting people; accepting and refusing; attitudes, opportunities and situations; conversations and topics.",
    "聚会和重聚；来访者；闲话；打招呼；接受和拒绝；态度、机会和情况；谈话和话题。",
  ),
  intro: t(
    "At a family **gathering** or a class **reunion**, you **greet** old friends, start a **conversation**, and maybe share a little **gossip**. These words help you talk about meeting and talking with people.",
    "在家庭 **gathering**（聚会）或同学 **reunion**（重聚）上，你会 **greet**（问候）老朋友，开始一段 **conversation**（谈话），也许还聊点 **gossip**（八卦）。这些词帮你谈论与人见面和交谈。",
  ),
  prerequisites: ["a2-words-people-together"],
  words: [
    word(
      "gathering gatherings",
      "a meeting of people, especially for a social reason",
      "聚会；集会",
      "We had a small family {gathering} for my grandfather's birthday.|attitude topic | Large {gatherings} were not allowed during the illness.|attitudes topics | The village {gathering} takes place every summer.|attitude opportunity",
      "garden gardening",
      "reunion",
    ),
    word(
      "reunion reunions",
      "a meeting of people who have not seen each other for a long time",
      "团聚；重聚",
      "Our class is having a ten-year {reunion} next month.|attitude situation | The {reunion} at the airport was emotional: they hadn't met for years.|attitude topic | Family {reunions} are a big part of Chinese New Year.|attitudes topics",
      "union return",
      "gathering",
    ),
    word(
      "visitor visitors",
      "a person who comes to see a place or a person",
      "来访者；游客",
      "The museum has thousands of {visitors} every day.|topics attitudes | We had {visitors} from England last weekend.|topics situations | {Visitors} must sign in at the front desk.|Topics Attitudes",
      "visit inventor",
    ),
    word(
      "gossip gossips",
      "talk about other people's private lives, often unkind or untrue",
      "闲话；八卦",
      "Don't believe all the {gossip} you hear. | They spent the evening drinking tea and sharing {gossip}.|opportunity situation | She loves to {gossip}, telling everyone the secrets of her neighbors.|greet complain",
      "opportunity attitude",
    ),
    word(
      "greet greets greeted greeting",
      "to say hello to someone or welcome them",
      "问候；迎接",
      'Our host {greeted} us at the door and said, "Welcome!"|refused ignored | In Japan, people often {greet} each other with a bow. | She {greets} every customer by name.|refuses ignores',
      "refuse ignore",
    ),
    word(
      "accept accepts accepted accepting",
      "to say yes to something that is offered",
      "接受",
      "She {accepted} the job offer at once and started work on Monday.|refused greeted | Please {accept} this small gift. | Do you {accept} credit cards, or can I only pay in cash?",
      "refuse greet",
    ),
    word(
      "refuse refuses refused refusing",
      "to say no to something; to say you will not do something",
      "拒绝",
      'He {refused} to answer my question and said, "No comment."|agreed offered | I couldn\'t {refuse} such a kind invitation, so I said yes.|accept offer | The child {refuses} to eat vegetables and pushes the plate away.|agrees offers',
      "agree offer",
    ),
    word(
      "attitude attitudes",
      "the way you think and feel about something",
      "态度",
      "She has a positive {attitude} to life.|gathering reunion | His {attitude} toward his work has changed.|gathering visitor | Our {attitudes} to money are very different.|gatherings reunions",
      "altitude aptitude",
    ),
    word(
      "opportunity opportunities",
      "a chance to do something",
      "机会",
      "Living abroad gave me the {opportunity} to learn Spanish.|attitude gossip | This summer job is a great {opportunity} to earn some money.|attitude gossip | There are many job {opportunities} in big cities.|attitudes gossips",
      "opposite community",
    ),
    word(
      "situation situations",
      "what is happening at a particular time and place",
      "情况；处境",
      "The {situation} is getting worse every day.|visitor reunion | What would you do in my {situation}?|visitor gossip | We practiced English for real-life {situations}, like ordering food.|visitors reunions",
      "station solution",
    ),
    word(
      "conversation conversations",
      "a talk between two or more people",
      "谈话；对话",
      "I had a long {conversation} with my grandmother.|attitude opportunity | Our {conversation} was hard to hear in the noisy restaurant.|attitude situation | Our English teacher wants us to practice everyday {conversations}.|attitudes opportunities",
      "conservation invitation",
    ),
    word(
      "topic topics",
      "a subject that people talk or write about",
      "话题；主题",
      "The weather is a safe {topic} of conversation.|visitor attitude | Let's change the {topic} and talk about something else.|visitor reunion | We discussed many {topics} at the meeting.|visitors reunions",
      "tropic top",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Accept* and *refuse* are opposites: you *accept* when you say yes to an offer, and *refuse* when you say no. Look for clues like *said yes* or *No comment*.",
        "*accept* 和 *refuse* 意思相反：答应别人的提议是 *accept*，拒绝是 *refuse*。留意 *said yes* 或 *No comment* 这类线索。",
      ),
      meaning: t(
        "A *gathering* is any meeting of people for a social reason; a *reunion* is a meeting of people who have not seen each other for a long time. Check whether the meaning says the people were apart for long.",
        "*gathering* 是任何社交聚会；*reunion* 是久别之人的重聚。看释义有没有说这些人分开了很久。",
      ),
      spell: t(
        "*Opportunity* has a double p and ends in -ity: o-p-p-o-r-t-u-n-i-t-y.",
        "*opportunity* 双写 p，以 -ity 结尾：o-p-p-o-r-t-u-n-i-t-y。",
      ),
    },
    notes: `
      gathering|a family meeting for a birthday;large ones not allowed;a village one every summer|a gathering is a social meeting of people; an attitude is how you think and feel|gathering 是聚会；attitude 是态度|attitude/attitudes=an attitude is the way you think and feel, not a meeting of people=attitude 是态度，不是聚会;topic/topics=a topic is a subject to talk about, not a meeting of people=topic 是话题，不是聚会;opportunity=an opportunity is a chance, not a meeting of people=opportunity 是机会，不是聚会;gardening=gardening is working in a garden, not people meeting together=gardening 是园艺，不是聚会|a family gathering · a small gathering|verb *gather*: to come together|动词 *gather*：聚集
      reunion|a class ten years later;people who hadn't met for years;Chinese New Year families|a reunion is meeting again after a long time; a situation is what is happening|reunion 是重聚；situation 是情况|attitude/attitudes=an attitude is the way you think and feel, not a meeting after a long time=attitude 是态度，不是重聚;situation=a situation is what is happening, not a meeting after a long time=situation 是情况，不是重聚;topic/topics=a topic is a subject to talk about, not a meeting after a long time=topic 是话题，不是重聚|a family reunion · a class reunion|*re-* + *union*: coming together again|*re-* 加 *union*：再次相聚
      visitor|thousands at a museum;guests from England;signing in at a desk|a visitor is a person who comes to see a place; a topic is a subject|visitor 是来访者；topic 是话题|topics/Topics=topics are subjects to talk about, not people who come to a place=topic 是话题，不是来访的人;attitudes/Attitudes=attitudes are ways of thinking, not people who come to a place=attitude 是态度，不是来访的人;situations=situations are what is happening, not people who come to see you=situation 是情况，不是来访的人|have visitors · visitors to the museum|from *visit* + *-or*|由 *visit* 加 *-or* 构成
      gossip|things you shouldn't believe;news shared over tea;neighbors' secrets told to everyone|gossip is talk about other people's private lives; an opportunity is a chance|gossip 是八卦；opportunity 是机会|opportunity=an opportunity is a chance to do something, not talk about people's private lives=opportunity 是机会，不是八卦;attitude=an attitude is how you think, not talk about other people=attitude 是态度，不是八卦;situation=a situation is what is happening, not talk shared about others=situation 是情况，不是八卦;greet=to greet is to say hello, not to tell secrets about people=greet 是打招呼，不是说别人闲话;complain=to complain is to say you're not happy, not to tell people's secrets=complain 是抱怨，不是传播别人的秘密|share gossip · gossip about|noun and verb|既是名词也是动词
      greet|a host saying "Welcome!";a bow in Japan;every customer by name|to greet is to say hello; to ignore is to pay no attention|greet 是问候；ignore 是不理睬|refuse/refused/refuses=to refuse is to say no, not to say hello and welcome=refuse 是拒绝，不是问候欢迎;ignore/ignored/ignores=to ignore is to pay no attention, not to say hello=ignore 是不理睬，不是问候|greet someone · greet with a smile|noun *greeting*|名词 *greeting*
      accept|a job offer and work on Monday;a small gift;credit cards or only cash|to accept is to say yes to an offer; to refuse is to say no|accept 是接受；refuse 是拒绝|refuse/refused=to refuse is to say no, not yes to an offer=refuse 是拒绝，不是接受;greet/greeted=to greet is to say hello, not to say yes to an offer=greet 是打招呼，不是接受|accept an offer · accept a gift|*accept* is not *except*, which means but not|*accept* 不是 *except*（除了）
      refuse|"No comment";a kind invitation answered yes;vegetables pushed away|to refuse is to say no; to agree is to say yes|refuse 是拒绝；agree 是同意|agree/agreed/agrees=to agree is to say yes, not no=agree 是同意，不是拒绝;offer/offered/offers=to offer is to ask if someone wants something, not to say no=offer 是主动提出，不是拒绝;accept=to accept an invitation is to say yes, but here you couldn't say no=accept 是接受；这里说的是没法拒绝|refuse to · refuse an invitation|noun *refusal*|名词 *refusal*
      attitude|a positive one to life;feelings about work;different views on money|an attitude is how you think and feel; a gathering is a meeting|attitude 是态度；gathering 是聚会|gathering/gatherings=a gathering is a meeting of people, not how you think and feel=gathering 是聚会，不是态度;reunion/reunions=a reunion is meeting again, not how you think and feel=reunion 是重聚，不是态度;visitor=a visitor comes to see a place, not how you feel about work=visitor 是来访者，不是态度;altitude=altitude is height above the sea, not how you think and feel about something=altitude 是海拔高度，不是态度|a positive attitude · attitude to|*attitude* is not *altitude*, height|*attitude* 不是 *altitude*（高度）
      opportunity|learning Spanish abroad;a summer job to earn money;jobs in big cities|an opportunity is a chance; an attitude is how you think|opportunity 是机会；attitude 是态度|attitude/attitudes=an attitude is how you think and feel, not a chance to do something=attitude 是态度，不是机会;gossip/gossips=gossip is talk about other people, not a chance to do something=gossip 是八卦，不是机会|the opportunity to · job opportunities|double p|双写 p
      situation|getting worse every day;in my place;ordering food in real life|a situation is what is happening; a visitor is a person who comes|situation 是情况；visitor 是来访者|visitor/visitors=a visitor is a person who comes to see you, not what is happening=visitor 是来访者，不是情况;reunion/reunions=a reunion is a meeting again, not what is happening=reunion 是重聚，不是情况;gossip=gossip is talk about people, not your position=gossip 是八卦，不是处境;solution=a solution is an answer to a problem, not what is happening=solution 是解决办法，不是处境|a difficult situation · in my situation|*situation* is not *station*|*situation* 不是 *station*
      conversation|a long talk with a grandmother;a noisy restaurant;everyday English|a conversation is a talk between people; a situation is what is happening|conversation 是谈话；situation 是情况|attitude/attitudes=an attitude is how you think, not a talk between people=attitude 是态度，不是谈话;opportunity/opportunities=an opportunity is a chance, not a talk between people=opportunity 是机会，不是谈话;situation=a situation is what is happening, not a talk between people=situation 是情况，不是谈话|have a conversation · a long conversation|*conversation* is not *conservation*, protecting nature|*conversation* 不是 *conservation*（保护自然）
      topic|the weather in conversation;talking about something else;many at a meeting|a topic is a subject to talk about; a visitor is a person|topic 是话题；visitor 是来访者|visitor/visitors=a visitor is a person, not a subject to talk about=visitor 是来访者，不是话题;attitude=an attitude is how you think, not a subject to talk about=attitude 是态度，不是话题;reunion/reunions=a reunion is a meeting again, not a subject to talk about=reunion 是重聚，不是话题;tropic/tropics=the tropics are the hot parts of the world near the equator, not a subject to talk about=tropic 是热带，不是话题|change the topic · a safe topic|*topic* is not *tropic*|*topic* 不是 *tropic*
    `,
  },
});

const lifeEvents = vocabularyTopic({
  id: "b1-words-life-events",
  title: t("Life Events", "人生大事"),
  summary: t(
    "Birth and death; adults, teenagers and youth; the elderly and retirement; funerals; pregnant; twins and ancestors.",
    "出生和死亡；成年人、青少年和青年时期；老年人和退休；葬礼；怀孕的；双胞胎和祖先。",
  ),
  intro: t(
    "Life goes from **birth** through **youth** to being an **adult**, then **retirement**, and finally **death** and a **funeral**. These words help you talk about the stages of a life.",
    "人生从 **birth**（出生）经过 **youth**（青年时期）成为 **adult**（成年人），然后 **retirement**（退休），最后是 **death**（死亡）和 **funeral**（葬礼）。这些词帮你谈论人生的各个阶段。",
  ),
  prerequisites: ["a2-words-relatives"],
  words: [
    word(
      "birth births",
      "the time when a baby is born",
      "出生",
      "What is your date of {birth}? | She gave {birth} to twins. | The {birth} of their first child was the happiest day of their lives.",
      "death youth",
    ),
    word(
      "adult adults",
      "a person who is fully grown",
      "成年人",
      "Tickets cost ten dollars for {adults} and five for children and teenagers.|teenagers ancestors | At eighteen, young people become {adults} and can vote.|teenagers ancestors | The film is not for children: it's for {adults} only, people over 18.|teenagers ancestors",
      "teenager ancestor",
    ),
    word(
      "teenager teenagers",
      "a person between thirteen and nineteen years old",
      "青少年",
      "Most {teenagers} in my class at high school have a phone.|adults ancestors | When I was a {teenager} of fifteen, I wanted to be a singer.|baby grandparent | This book is written for {teenagers} aged 13 to 19.|adults ancestors",
      "adult ancestor",
      "teenage youth",
    ),
    word(
      "teenage",
      "between thirteen and nineteen years old, or for people of that age",
      "十几岁的；青少年的",
      "They have two {teenage} sons, aged 14 and 16. | Many {teenage} girls at high school read her books. | Her {teenage} years, from 13 to 19, were difficult.",
      "elderly adult",
      "teenager youth",
    ),
    word(
      "youth",
      "the time when someone is young",
      "青年时期；青春",
      "In his {youth}, he was a great runner.|birth funeral | She spent her {youth} in the countryside and moved to the city at 20. | The town built a new {youth} club for teenagers.",
      "birth retirement",
      "teenager teenage",
    ),
    word(
      "elderly",
      "old (a polite word)",
      "年长的；上了年纪的",
      "We help our {elderly} neighbor, who is 90, with her shopping.|teenage pregnant | The bus has special seats for {elderly} people over 70.|teenage pregnant | Many {elderly} people live alone after their husband or wife dies.|teenage pregnant",
      "early orderly",
    ),
    word(
      "retirement",
      "the time when you stop working because you are old",
      "退休",
      "My grandfather stopped working at 65 and enjoys his {retirement}. | She is looking forward to her {retirement} next year. | After {retirement}, when they stop working, many people travel.",
      "birth youth",
    ),
    word(
      "funeral funerals",
      "a ceremony after someone dies",
      "葬礼",
      "Hundreds of people came to her {funeral} after she died.|birth retirement | The {funeral} for Mr. Lee, who died last week, will be held on Friday.|youth birth | People usually wear black at {funerals}.|births youths",
      "festival general",
    ),
    word(
      "pregnant",
      "having a baby growing inside your body",
      "怀孕的",
      "My sister is {pregnant}; the baby is due in May.|elderly teenage | She was {pregnant} with her second child.|elderly teenage | She's eight months {pregnant}.|elderly teenage",
      "present important",
    ),
    word(
      "twin twins",
      "one of two children born at the same time to the same mother",
      "双胞胎之一",
      "My {twin} brother and I were born on the same day and look exactly the same.|elderly adult | They are {twins}, born ten minutes apart, but they have very different personalities.|ancestors adults | I can never tell the {twins} apart.|ancestors adults",
      "pair cousin",
    ),
    word(
      "ancestor ancestors",
      "a person in your family who lived a long time ago",
      "祖先",
      "My {ancestors} came from the south of China hundreds of years ago.|twins teenagers | During the festival, people remember their {ancestors} who died long ago.|twins teenagers | One of her {ancestors}, who lived 500 years ago, was a famous poet.|twins teenagers",
      "descendant grandchild",
    ),
    word(
      "death deaths",
      "the end of a life",
      "死亡",
      "The {death} of his dog made him very sad.|birth youth | Smoking causes many early {deaths}.|births youths | She was with her grandmother until her {death}.|birth youth",
      "dead debt",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Teenager* is a noun and *teenage* is an adjective: you are a *teenager*, but you have *teenage* sons. Look at whether a noun follows the gap.",
        "*teenager* 是名词，*teenage* 是形容词：你是 *teenager*，但说 *teenage* sons。看空格后面是否跟着名词。",
      ),
      meaning: t(
        "*Elderly* and *adult* both describe grown people, but *elderly* is a polite word for old, while an *adult* is anyone fully grown. Check whether the meaning says old or just grown up.",
        "*elderly* 和 *adult* 都指长大的人，但 *elderly* 是“年长”的礼貌说法，*adult* 是任何成年人。看释义说的是年老还是仅仅成年。",
      ),
      spell: t(
        "*Retirement* keeps the e of *retire* before -ment: r-e-t-i-r-e-m-e-n-t.",
        "*retirement* 在 -ment 前保留 *retire* 的 e：r-e-t-i-r-e-m-e-n-t。",
      ),
    },
    notes: `
      birth|a date on a form;twins;the happiest day for new parents|birth is when a baby is born; death is the end of a life|birth 是出生；death 是死亡|death=death is the end of a life, not when a baby is born=death 是生命的结束，不是出生;youth=youth is the time when you are young, not the moment a baby is born=youth 是青年时期，不是出生那一刻;funeral=a funeral is a ceremony after someone dies, not when a baby is born=funeral 是葬礼，不是出生;retirement=retirement is when you stop working, not when a baby is born=retirement 是退休，不是出生|date of birth · give birth to|*birth* is not *birthday*, the same day every year|*birth* 不是 *birthday*（每年的生日）
      adult|tickets for grown-ups, not children or teenagers;voting at eighteen;a film for over 18|an adult is a fully grown person; a teenager is 13 to 19|adult 是成年人；teenager 是青少年|teenager/teenagers=a teenager is 13 to 19, not fully grown and over 18=teenager 是十三到十九岁，不是十八岁以上的成年人;ancestor/ancestors=an ancestor lived long ago in your family, not a grown-up today=ancestor 是很久以前的祖先，不是现在的成年人|adults only · become an adult|stress on *a* or *dult*: both are used|重音在 *a* 或 *dult* 都可以
      teenager|phone owners at high school;fifteen and wanting to be a singer;readers aged 13 to 19|a teenager is 13 to 19; an adult is fully grown|teenager 是青少年；adult 是成年人|adult/adults=an adult is fully grown, not aged 13 to 19 at high school=adult 是成年人，不是十三到十九岁的中学生;ancestor/ancestors=an ancestor lived long ago, not a young person today=ancestor 是祖先，不是现在的年轻人;baby=a baby is very young, not fifteen=baby 是婴儿，不是十五岁;grandparent=a grandparent is old, not fifteen=grandparent 是祖父母，不是十五岁|a teenager · teenagers today|from *-teen*: thirteen to nineteen|来自 *-teen*：thirteen 到 nineteen
      teenage|sons aged 14 and 16;girls at high school;the years from 13 to 19|teenage describes people aged 13 to 19; elderly describes old people|teenage 是十几岁的；elderly 是年长的|elderly=elderly means old, not aged 13 to 19=elderly 是年长的，不是十几岁;adult=adult means fully grown, not aged 13 to 19=adult 是成年的，不是十几岁|teenage years · a teenage boy|adjective; the person is a *teenager*|形容词；人叫 *teenager*
      youth|a great runner when young;the countryside until 20;a club for teenagers|youth is the time when you are young; retirement is when you stop working|youth 是青年时期；retirement 是退休|birth=birth is when a baby is born, not the years when you are young=birth 是出生，不是年轻的那些年;funeral=a funeral is after someone dies, not the time when you are young=funeral 是葬礼，不是青年时期;retirement=retirement is when you are old and stop working, not when you are young=retirement 是年老退休，不是年轻时|in his youth · a youth club|*youth* is not *truth*|*youth* 不是 *truth*
      elderly|a neighbor of 90;bus seats for over 70;living alone after a partner dies|elderly is a polite word for old; teenage means 13 to 19|elderly 是年长的；teenage 是十几岁的|teenage=teenage means aged 13 to 19, not old=teenage 是十几岁，不是年长;pregnant=pregnant means having a baby inside, not old=pregnant 是怀孕，不是年长;orderly=orderly means neat and well arranged, not old=orderly 是整齐有序，不是年老|elderly people · an elderly neighbor|*elderly* looks like an adverb but is an adjective|*elderly* 像副词，其实是形容词
      retirement|stopping work at 65;next year;travel after stopping work|retirement is when you stop working; youth is when you are young|retirement 是退休；youth 是青年时期|birth=birth is when a baby is born, not when you stop working=birth 是出生，不是退休;youth=youth is when you are young, not when you stop working=youth 是青年时期，不是退休|enjoy retirement · after retirement|verb *retire*|动词 *retire*
      funeral|hundreds of people after she died;Friday, for a man who died;black clothes|a funeral is a ceremony after someone dies; a birth is when a baby is born|funeral 是葬礼；birth 是出生|birth/births=a birth is when a baby is born, not a ceremony after someone dies=birth 是出生，不是去世后的仪式;retirement=retirement is when you stop working, not a ceremony after someone dies=retirement 是退休，不是葬礼;youth/youths=youth is the time when you are young, not a ceremony after death=youth 是青年时期，不是葬礼;general=a general is a top army officer, not a ceremony for someone who has died=general 是将军，不是葬礼|go to a funeral · the funeral will be held|*funeral* is not *festival*|*funeral* 不是 *festival*
      pregnant|a baby due in May;a second child;eight months|pregnant means having a baby inside; elderly means old|pregnant 是怀孕的；elderly 是年长的|elderly=elderly means old, not having a baby inside=elderly 是年长的，不是怀孕;teenage=teenage means aged 13 to 19, not having a baby inside=teenage 是十几岁，不是怀孕;present=present means here now, or a gift, not expecting a baby=present 是在场或礼物，不是怀孕|pregnant with · six months pregnant|noun *pregnancy*|名词 *pregnancy*
      twin|a brother born the same day who looks the same;ten minutes apart;two children you can't tell apart|a twin is one of two children born together; an adult is a grown person|twin 是双胞胎之一；adult 是成年人|elderly=elderly means old, not born at the same time as a brother=elderly 是年长的，不是同一天出生;adult/adults=an adult is a grown person, not one of two children born together=adult 是成年人，不是双胞胎;ancestors=ancestors lived long ago, not two children born together=ancestor 是祖先，不是双胞胎|a twin brother · identical twins|*twin* is not *pair*: a pair is two of anything|*twin* 不是 *pair*：pair 是任何东西的一对
      ancestor|from south China hundreds of years ago;remembered at a festival;a poet 500 years ago|an ancestor lived long ago in your family; a twin is born with you|ancestor 是祖先；twin 是双胞胎之一|twins=twins are two children born together, not family who lived long ago=twin 是双胞胎，不是很久以前的祖先;teenagers=teenagers are young people today, not family who lived long ago=teenager 是现在的青少年，不是祖先;descendant=a descendant comes after you in a family, not before you=descendant 是后代，不是祖先|our ancestors · remember ancestors|the opposite is *descendant*|反义词是 *descendant*
      death|a dog that made him sad;early ones from smoking;with a grandmother until the end|death is the end of a life; birth is the start|death 是死亡；birth 是出生|birth/births=birth is the start of a life, not the end=birth 是生命的开始，不是结束;youth/youths=youth is the time when you are young, not the end of a life=youth 是青年时期，不是生命的结束|the death of · early deaths|adjective *dead*, verb *die*|形容词 *dead*，动词 *die*
    `,
  },
});

const family = vocabularyTopic({
  id: "b1-words-family-life",
  title: t("Family Life", "家庭生活"),
  summary: t(
    "Upbringing and households; chores and allowance; siblings, nephews, nieces and grandchildren; spouses, brides and grooms; adopting.",
    "教养和家庭；家务和零花钱；兄弟姐妹、侄子外甥、侄女外甥女和孙辈；配偶、新娘和新郎；收养。",
  ),
  intro: t(
    "In every **household**, children do **chores**, may get an **allowance**, and grow up with **siblings**, a **nephew** or a **niece**. These words help you talk about family life at home.",
    "每个 **household**（家庭）里，孩子要做 **chores**（家务），可能有 **allowance**（零花钱），和 **siblings**（兄弟姐妹）、**nephew**（侄子、外甥）或 **niece**（侄女、外甥女）一起长大。这些词帮你谈论家庭生活。",
  ),
  prerequisites: ["a2-words-relatives"],
  words: [
    word(
      "upbringing",
      "the way parents care for a child and teach them how to behave",
      "养育；教养",
      "She had a strict {upbringing}: her parents taught her to be polite and work hard.|allowance chore | His good manners come from his {upbringing}.|allowance household | Parents play the biggest part in a child's {upbringing}.|allowance household",
      "upset uprising",
    ),
    word(
      "household households",
      "all the people who live together in one home",
      "一家人；家庭",
      "Most {households} in the village have a car.|chores allowances | She does all the {household} shopping.|upbringing spouse | There are five people in our {household}.|upbringing allowance",
      "housework neighborhood",
    ),
    word(
      "chore chores",
      "a job you have to do regularly at home, such as cleaning",
      "家务；杂事",
      "Washing the dishes is my least favorite {chore}.|spouse upbringing | We share the {chores} at home, like cooking and cleaning.|spouses nieces | I can go out after I've done my {chores}.|spouses nephews",
      "choir hobby",
    ),
    word(
      "allowance allowances",
      "money that parents give a child regularly",
      "零花钱；津贴",
      "I get a weekly {allowance} of twenty yuan.|upbringing household | She saves half of her {allowance} every month.|upbringing chore | My parents stopped my {allowance} because I didn't help at home.|upbringing household",
      "balance appearance",
    ),
    word(
      "sibling siblings",
      "a brother or a sister",
      "兄弟姐妹",
      "Do you have any {siblings}, brothers or sisters?|spouses households | I'm the oldest of four {siblings}.|spouses brides | {Siblings} often argue, but they usually love each other.|Upbringings Allowances",
      "cousin seedling",
    ),
    word(
      "nephew nephews",
      "the son of your brother or sister",
      "侄子；外甥",
      "My {nephew} is my sister's little boy.|niece bride | I bought my {nephew} a toy car for his birthday.|chore upbringing | She has two {nephews} and a niece.|brides spouses",
      "cousin grandson",
    ),
    word(
      "niece nieces",
      "the daughter of your brother or sister",
      "侄女；外甥女",
      "My {niece} is my brother's daughter.|nephew groom | I'm taking my {niece} to the zoo on Saturday.|chore upbringing | He has three {nieces} and no nephews.|grooms spouses",
      "nice piece",
    ),
    word(
      "grandchild grandchildren",
      "a child of your son or daughter",
      "孙子女；外孙子女",
      "My grandmother has ten {grandchildren}.|chores allowances | Their first {grandchild} was born last week.|spouse chore | She loves spending time with her {grandchildren}.|chores allowances",
      "grandparent godchild",
    ),
    word(
      "spouse spouses",
      "a husband or a wife",
      "配偶",
      "Employees can bring their {spouse} to the dinner.|chore upbringing | Please write the name of your {spouse} on the form.|chore upbringing | {Spouses} often share their money.|Chores Upbringings",
      "parent cousin",
    ),
    word(
      "bride brides",
      "a woman on her wedding day",
      "新娘",
      "The {bride} wore a beautiful red dress.|chore allowance | Everyone stood up when the {bride} came in.|chore allowance | The {bride} and groom cut the cake together.|nephew sibling",
      "bridge pride",
    ),
    word(
      "groom grooms",
      "a man on his wedding day",
      "新郎",
      "The {groom} looked nervous before the ceremony.|chore allowance | The bride and {groom} danced together.|niece sibling | The {groom} made a funny speech.|chore upbringing",
      "room broom",
    ),
    word(
      "adopt adopts adopted adopting",
      "to take another person's child into your family and become their legal parent",
      "收养",
      "They {adopted} a baby girl from China and became her parents.|divided supported | My cousin was {adopted} by new parents when he was two.|divided supported | We're thinking of {adopting} a dog from the animal shelter.|dividing supporting",
      "adapt adore",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Nephew* and *niece* differ only in the child: a *nephew* is a boy, a *niece* is a girl. Look for *boy*, *daughter*, *his* or *her* near the gap.",
        "*nephew* 和 *niece* 只差在孩子的性别：*nephew* 是男孩，*niece* 是女孩。留意空格附近的 *boy*、*daughter*、*his* 或 *her*。",
      ),
      meaning: t(
        "A *household* is the people who live together in one home; an *upbringing* is the way parents raise a child. Check whether the meaning names people or a way of raising.",
        "*household* 是同住一个家里的人；*upbringing* 是父母养育孩子的方式。看释义说的是一群人还是养育方式。",
      ),
      spell: t(
        "*Niece* has ie, and *nephew* has ph for the f sound: n-i-e-c-e, n-e-p-h-e-w.",
        "*niece* 里是 ie，*nephew* 用 ph 发 f 音：n-i-e-c-e、n-e-p-h-e-w。",
      ),
    },
    notes: `
      upbringing|strict parents teaching politeness;where good manners come from;what parents play the biggest part in|upbringing is how parents raise a child; an allowance is money they give|upbringing 是教养；allowance 是零花钱|allowance=an allowance is money parents give, not the way they raise a child=allowance 是零花钱，不是养育方式;chore=a chore is a job at home, not the way parents raise a child=chore 是家务，不是养育方式;household=a household is the people living together, not how a child is raised=household 是一家人，不是养育方式|a strict upbringing · a good upbringing|from *bring up*|来自 *bring up*
      household|villages and cars;family shopping;five people in one home|a household is the people living in one home; an upbringing is how a child is raised|household 是一家人；upbringing 是教养|chores=chores are jobs at home, not the people who live there=chore 是家务，不是住在家里的人;allowances/allowance=allowances are money for children, not the people in a home=allowance 是零花钱，不是家里的人;upbringing=upbringing is how a child is raised, not the people in a home=upbringing 是养育方式，不是家里的人;spouse=a spouse is a husband or wife, not all the shopping of a home=spouse 是配偶，不是一家人;housework=housework is jobs like cleaning and cooking, not all the people who live in a home=housework 是家务活，不是一家人|a household · household chores|*house* + *hold*|由 *house* 加 *hold* 构成
      chore|washing dishes;cooking and cleaning shared;jobs done before going out|a chore is a regular job at home; a spouse is a husband or wife|chore 是家务；spouse 是配偶|spouse/spouses=a spouse is a husband or wife, not a job at home=spouse 是配偶，不是家务;upbringing=upbringing is how parents raise a child, not a job at home=upbringing 是养育方式，不是家务;nieces=nieces are your brother's or sister's daughters, not jobs at home=niece 是侄女，不是家务;nephews=nephews are your brother's or sister's sons, not jobs at home=nephew 是侄子，不是家务|do the chores · household chores|usually plural: *chores*|常用复数 *chores*
      allowance|twenty yuan a week;half saved every month;stopped for not helping at home|an allowance is money given to a child; an upbringing is how a child is raised|allowance 是零花钱；upbringing 是教养|upbringing=upbringing is how a child is raised, not money given each week=upbringing 是养育方式，不是每周给的钱;household=a household is people who live together, not money given to a child=household 是一家人，不是零花钱;chore=a chore is a job at home, not money you save=chore 是家务，不是存下的钱;appearance=appearance is how someone looks, not money given to a child regularly=appearance 是外表，不是零花钱|a weekly allowance · pocket money|British English says *pocket money*|英式英语说 *pocket money*
      sibling|brothers or sisters;the oldest of four;arguing but loving each other|a sibling is a brother or sister; a spouse is a husband or wife|sibling 是兄弟姐妹；spouse 是配偶|spouses=a spouse is a husband or wife, not a brother or sister=spouse 是配偶，不是兄弟姐妹;households=a household is people in one home, not a brother or sister=household 是一家人，不是兄弟姐妹;brides=a bride is a woman on her wedding day, not a brother or sister=bride 是新娘，不是兄弟姐妹;Upbringings=upbringing is how a child is raised, not brothers and sisters=upbringing 是养育方式，不是兄弟姐妹;Allowances=allowances are money for children, not brothers and sisters=allowance 是零花钱，不是兄弟姐妹;seedling=a seedling is a young plant, not a brother or sister=seedling 是幼苗，不是兄弟姐妹|any siblings · older siblings|a word for both brothers and sisters|兄弟姐妹的统称
      nephew|a sister's little boy;a toy car for his birthday;two of them and a niece|a nephew is the son of your brother or sister; a niece is the daughter|nephew 是侄子、外甥；niece 是侄女、外甥女|niece=a niece is a girl, but this child is a boy=niece 是女孩，而这个孩子是男孩;bride/brides=a bride is a woman on her wedding day, not a brother's or sister's son=bride 是新娘，不是侄子;chore=a chore is a job at home, not a child you buy a toy for=chore 是家务，不是孩子;upbringing=upbringing is how a child is raised, not a child=upbringing 是养育方式，不是孩子;spouses=spouses are husbands or wives, not a brother's or sister's sons=spouse 是配偶，不是侄子;grandson=a grandson is your son's or daughter's son, not your brother's or sister's son=grandson 是孙子、外孙，不是侄子、外甥|my nephew · a nephew and a niece|ph sounds like f|ph 读作 f
      niece|a brother's daughter;a trip to the zoo;three and no nephews|a niece is the daughter of your brother or sister; a nephew is the son|niece 是侄女、外甥女；nephew 是侄子、外甥|nephew=a nephew is a boy, but this child is a daughter=nephew 是男孩，而这个孩子是女儿;groom/grooms=a groom is a man on his wedding day, not a brother's daughter=groom 是新郎，不是侄女;chore=a chore is a job at home, not a child you take to the zoo=chore 是家务，不是孩子;upbringing=upbringing is how a child is raised, not a child=upbringing 是养育方式，不是孩子;spouses=spouses are husbands or wives, not daughters=spouse 是配偶，不是侄女|my niece · nieces and nephews|*niece* is not *nice*|*niece* 不是 *nice*
      grandchild|ten for one grandmother;the first born last week;time spent with them|a grandchild is a child of your son or daughter; a chore is a job at home|grandchild 是孙辈；chore 是家务|chores=chores are jobs at home, not children of your son or daughter=chore 是家务，不是孙辈;allowances=allowances are money, not children of your son or daughter=allowance 是零花钱，不是孙辈;spouse=a spouse is a husband or wife, not a child born last week=spouse 是配偶，不是刚出生的孙辈;chore=a chore is a job at home, not a child born last week=chore 是家务，不是孙辈;godchild=a godchild is a child you promise to guide at a church ceremony, not your son's or daughter's child=godchild 是教子、教女，不是孙辈|ten grandchildren · our first grandchild|plural *grandchildren*|复数 *grandchildren*
      spouse|brought to a work dinner;a name on a form;sharing money|a spouse is a husband or wife; a sibling is a brother or sister|spouse 是配偶；sibling 是兄弟姐妹|chore/Chores=a chore is a job at home, not a husband or wife=chore 是家务，不是配偶;upbringing/Upbringings=upbringing is how a child is raised, not a husband or wife=upbringing 是养育方式，不是配偶|your spouse · spouses and children|a formal word for husband or wife|husband 或 wife 的正式说法
      bride|a red dress;everyone standing up;cutting the cake with the groom|a bride is a woman on her wedding day; a groom is a man|bride 是新娘；groom 是新郎|chore=a chore is a job at home, not a woman on her wedding day=chore 是家务，不是新娘;allowance=an allowance is money for a child, not a woman on her wedding day=allowance 是零花钱，不是新娘;nephew=a nephew is a boy, not a woman on her wedding day=nephew 是男孩，不是新娘;sibling=a sibling is a brother or sister, not the woman getting married=sibling 是兄弟姐妹，不是新娘;pride=pride is a feeling of being pleased with what you did, not a woman getting married=pride 是自豪，不是新娘|the bride and groom · a beautiful bride|*bride* is not *bridge*|*bride* 不是 *bridge*
      groom|nervous before the ceremony;dancing with the bride;a funny speech|a groom is a man on his wedding day; a bride is a woman|groom 是新郎；bride 是新娘|chore=a chore is a job at home, not a man on his wedding day=chore 是家务，不是新郎;allowance=an allowance is money for a child, not a man on his wedding day=allowance 是零花钱，不是新郎;niece=a niece is a girl, not a man on his wedding day=niece 是女孩，不是新郎;sibling=a sibling is a brother or sister, not the man getting married=sibling 是兄弟姐妹，不是新郎;upbringing=upbringing is how a child is raised, not a man who makes a speech=upbringing 是养育方式，不是新郎;broom=a broom is a brush for sweeping the floor, not a man getting married=broom 是扫帚，不是新郎|the bride and groom · the groom's speech|also *bridegroom*|也说 *bridegroom*
      adopt|a baby girl who got new parents;a cousin with new parents at two;a dog from a shelter|to adopt is to take a child into your family; to support is to help|adopt 是收养；support 是支持|divided/dividing=to divide is to separate into parts, not to take a child into your family=divide 是分开，不是收养;supported/supporting=to support is to help, not to become someone's legal parent=support 是帮助，不是成为合法父母;adore=to adore is to love very much, not to take a child into your family by law=adore 是非常喜爱，不是领养|adopt a child · adopt a dog|*adopt* is not *adapt*, to change|*adopt* 不是 *adapt*（适应）
    `,
  },
});

// Question tags.

/** positives are positive statements with their negative tag and two wrong tags. */
const handPositives: readonly (readonly [string, string, readonly [string, string]])[] = [
  ["You're coming to the party", "aren't you", ["isn't you", "don't you"]],
  ["She plays tennis", "doesn't she", ["isn't she", "don't she"]],
  ["They live in Shanghai", "don't they", ["aren't they", "doesn't they"]],
  ["It's cold today", "isn't it", ["doesn't it", "is it"]],
  ["He was at school yesterday", "wasn't he", ["didn't he", "isn't he"]],
  ["You can swim", "can't you", ["don't you", "can you"]],
  ["We'll be late", "won't we", ["will we", "don't we"]],
  ["Your brother has been to Japan", "hasn't he", ["doesn't he", "isn't he"]],
  ["They went to the cinema", "didn't they", ["weren't they", "don't they"]],
  ["Anna likes coffee", "doesn't she", ["isn't she", "don't she"]],
  ["You've finished your homework", "haven't you", ["didn't you", "aren't you"]],
  ["The film was boring", "wasn't it", ["didn't it", "isn't it"]],
  ["Your parents are teachers", "aren't they", ["don't they", "isn't they"]],
  ["Tom should see a doctor", "shouldn't he", ["doesn't he", "should he"]],
  ["You were tired", "weren't you", ["wasn't you", "didn't you"]],
  ["It rained all night", "didn't it", ["wasn't it", "doesn't it"]],
  ["She's your cousin", "isn't she", ["doesn't she", "is she"]],
  ["The shop opens at nine", "doesn't it", ["isn't it", "don't it"]],
  ["You could help me", "couldn't you", ["can't you", "don't you"]],
  ["They're getting married", "aren't they", ["don't they", "isn't they"]],
  ["He forgot your birthday", "didn't he", ["wasn't he", "doesn't he"]],
  ["Ben would like some tea", "wouldn't he", ["doesn't he", "won't he"]],
  ["We've met before", "haven't we", ["didn't we", "aren't we"]],
  ["This is your bag", "isn't it", ["isn't this", "doesn't it"]],
  ["Those are your keys", "aren't they", ["aren't those", "isn't it"]],
  ["Mia knows the answer", "doesn't she", ["isn't she", "don't she"]],
  ["The children were asleep", "weren't they", ["wasn't they", "didn't they"]],
  ["You'll call me later", "won't you", ["will you", "don't you"]],
  ["Your sister speaks French", "doesn't she", ["isn't she", "don't she"]],
  ["Grandpa made this table", "didn't he", ["wasn't he", "doesn't he"]],
  ["We're in the right place", "aren't we", ["don't we", "isn't it"]],
  ["Max is moving to Canada", "isn't he", ["doesn't he", "is he"]],
  ["You saw the news", "didn't you", ["weren't you", "haven't you"]],
  ["The bus leaves at six", "doesn't it", ["isn't it", "don't it"]],
];

/** negatives are negative statements with their positive tag and two wrong tags. */
const handNegatives: readonly (readonly [string, string, readonly [string, string]])[] = [
  ["You aren't angry", "are you", ["aren't you", "do you"]],
  ["She doesn't eat meat", "does she", ["doesn't she", "is she"]],
  ["They didn't call", "did they", ["didn't they", "were they"]],
  ["It isn't far", "is it", ["isn't it", "does it"]],
  ["He can't drive", "can he", ["can't he", "does he"]],
  ["You won't tell anyone", "will you", ["won't you", "do you"]],
  ["We haven't missed the train", "have we", ["haven't we", "did we"]],
  ["Your friends weren't at home", "were they", ["weren't they", "did they"]],
  ["Sam doesn't like football", "does he", ["doesn't he", "is he"]],
  ["The test wasn't difficult", "was it", ["wasn't it", "did it"]],
  ["You don't remember me", "do you", ["don't you", "are you"]],
  ["She hasn't been to Paris", "has she", ["hasn't she", "does she"]],
  ["They aren't coming", "are they", ["aren't they", "do they"]],
  ["You shouldn't be here", "should you", ["shouldn't you", "are you"]],
  ["He didn't pass the exam", "did he", ["didn't he", "was he"]],
  ["It won't rain today", "will it", ["won't it", "does it"]],
  ["Your parents don't know", "do they", ["don't they", "are they"]],
  ["Emma isn't married", "is she", ["isn't she", "does she"]],
  ["We can't park here", "can we", ["can't we", "do we"]],
  ["The kids aren't sleeping", "are they", ["aren't they", "do they"]],
  ["You didn't lock the door", "did you", ["didn't you", "were you"]],
  ["This isn't your phone", "is it", ["isn't it", "is this"]],
  ["He wasn't listening", "was he", ["wasn't he", "did he"]],
  ["You haven't seen my keys", "have you", ["haven't you", "did you"]],
  ["She couldn't come", "could she", ["couldn't she", "did she"]],
  ["They don't live here", "do they", ["don't they", "are they"]],
  ["Your brother never cooks", "does he", ["doesn't he", "is he"]],
  ["You never listen to me", "do you", ["don't you", "are you"]],
  ["The shops aren't open on Sunday", "are they", ["aren't they", "do they"]],
  ["Tom didn't break the window", "did he", ["didn't he", "was he"]],
  ["It doesn't matter", "does it", ["doesn't it", "is it"]],
  ["We weren't late", "were we", ["weren't we", "did we"]],
  ["You wouldn't lie to me", "would you", ["wouldn't you", "do you"]],
  ["Lily can't swim", "can she", ["can't she", "does she"]],
];

/** tagPeople are a subject, its pronoun in a tag, and whether it takes the forms for one person. */
const tagPeople: readonly (readonly [string, string, boolean])[] = [
  ["She", "she", true],
  ["Tom", "he", true],
  ["Your parents", "they", false],
  ["Anna", "she", true],
  ["They", "they", false],
  ["He", "he", true],
  ["Your brother", "he", true],
  ["The children", "they", false],
  ["You", "you", false],
  ["We", "we", false],
];

/**
 * tagFrames are a statement after the subject, its tag's helping verb, and a wrong helping verb from another family,
 * each as the forms for one person and for more than one: is|are.
 */
const tagFrames: readonly (readonly [statement: string, tag: string, other: string])[] = [
  ["is|are at home", "isn't|aren't", "doesn't|don't"],
  ["likes|like coffee", "doesn't|don't", "isn't|aren't"],
  ["went to the cinema", "didn't", "wasn't|weren't"],
  ["can swim", "can't", "doesn't|don't"],
  ["will be late", "won't", "isn't|aren't"],
  ["has|have finished the work", "hasn't|haven't", "didn't"],
  ["was|were at school yesterday", "wasn't|weren't", "didn't"],
  ["isn't|aren't ready", "is|are", "does|do"],
  ["doesn't|don't eat meat", "does|do", "is|are"],
  ["didn't call", "did", "was|were"],
  ["can't drive", "can", "does|do"],
  ["won't tell anyone", "will", "does|do"],
  ["hasn't|haven't seen the film", "has|have", "did"],
  ["wasn't|weren't listening", "was|were", "did"],
  ["couldn't come", "could", "did"],
];

/** formFor picks the form for one person or for more than one from words such as is|are. */
const formFor = (forms: string, single: boolean) =>
  forms.replace(/(\S+)\|(\S+)/gu, (_, one: string, more: string) => (single ? one : more));

/** opposite turns a helping verb of a tag to the other polarity: isn't to is, is to isn't. */
const opposite = (helper: string) =>
  helper.endsWith("n't")
    ? (({ "can't": "can", "won't": "will" } as Record<string, string>)[helper] ?? helper.slice(0, -3))
    : (({ can: "can't", will: "won't" } as Record<string, string>)[helper] ?? `${helper}n't`);

const framedTags = everyPair(tagFrames, tagPeople).map(([[statement, tag, other], [subject, pronoun, single]]) => {
  const helper = formFor(tag, single);
  return [
    `${subject} ${formFor(statement, single)}`,
    `${helper} ${pronoun}`,
    [`${opposite(helper)} ${pronoun}`, `${formFor(other, single)} ${pronoun}`] as const,
    tag.includes("n't"),
  ] as const;
});

const positives: readonly (readonly [string, string, readonly [string, string]])[] = [
  ...handPositives,
  ...framedTags.filter(([, , , negativeTag]) => negativeTag).map(([statement, tag, wrong]) => [statement, tag, wrong] as const),
];

const negatives: readonly (readonly [string, string, readonly [string, string]])[] = [
  ...handNegatives,
  ...framedTags.filter(([, , , negativeTag]) => !negativeTag).map(([statement, tag, wrong]) => [statement, tag, wrong] as const),
];

const tagChoice = (list: typeof positives): readonly ChoiceItem[] =>
  list.map(([statement, tag, wrong]): ChoiceItem => [`${statement}, ___?`, tag, wrong]);

const tagTyped: readonly TypedItem[] = interleave([positives, negatives]).map(
  ([statement, tag, wrong]): TypedItem => ({
    shown: statement,
    accepted: [`${statement}, ${tag}?`],
    wrong: [`${statement}, ${wrong[0]}?`, `${statement}, ${wrong[1]}?`],
  }),
);

/** helperOf is the helping verb of a tag without n't: won't is will, can't is can. */
const helperOf = (tag: string) => {
  const first = tag.split(" ")[0] ?? "";
  if (first === "won't") return "will";
  if (first === "can't") return "can";
  return first.replace(/n't$/u, "");
};

const doWords = /\b(do|does|did|don't|doesn't|didn't)\b/u;

/** tagRule names how the tag of a statement is made: the opposite polarity, its helping verb and a pronoun. */
function tagRule(statement: string, tag: string): Text {
  const negative = /n't|never/u.test(statement);
  const helper = helperOf(tag);
  const pronoun = tag.split(" ")[1] ?? "";
  const noHelper = /^(do|does|did)$/u.test(helper) && !doWords.test(statement);
  const polarity = negative
    ? t(
        `The sentence is negative${/never/u.test(statement) ? " (*never*)" : ""}, so the tag is positive`,
        `句子是否定的${/never/u.test(statement) ? "（*never*）" : ""}，所以反意疑问用肯定`,
      )
    : t("The sentence is positive, so the tag is negative", "句子是肯定的，所以反意疑问用否定");
  const verb = noHelper
    ? t(`*${helper}*, since the sentence has no helping verb`, ` *${helper}*，因为句子里没有助动词`)
    : t(`the sentence's own helping verb, *${helper}*`, `句子本身的助动词 *${helper}*`);
  return t(
    `${polarity.en}, with ${verb.en}, and *${pronoun}* for the subject`,
    `${polarity["zh-CN"]}，用${verb["zh-CN"]}，主语换成 *${pronoun}*`,
  );
}

/** sameFamily tells whether two helping verbs differ only in agreement with the subject. */
const sameFamily = (a: string, b: string) =>
  [
    ["do", "does"],
    ["is", "are", "am"],
    ["was", "were"],
  ].some((family) => family.includes(a) && family.includes(b));

/** whyNotTag explains a tag with the wrong pronoun, the same polarity as the sentence, or the wrong helping verb. */
const whyNotTag = (wrong: string, right: string, shown: string): Text => {
  const statement = shown.replace(/, ___\?$/u, "");
  const [, wrongPronoun = ""] = wrong.split(" ");
  const [, rightPronoun = ""] = right.split(" ");
  const negativeTag = (tag: string) => /n't/u.test(tag);
  if (wrongPronoun !== rightPronoun)
    return t(
      `A question tag never repeats *${wrongPronoun}*; it replaces the subject with a personal pronoun (*he, she, it, they*, etc.).`,
      `反意疑问里不用 *${wrongPronoun}*，要把主语换成人称代词（*he、she、it、they* 等）。`,
    );
  if (negativeTag(wrong) === /n't|never/u.test(statement))
    return t(
      `*${wrong}* has the same polarity (${negativeTag(wrong) ? "negative" : "positive"}) as the statement, but a tag must flip polarity.`,
      `*${wrong}* 和主句一样是${negativeTag(wrong) ? "否定" : "肯定"}的，但反意疑问必须与主句相反。`,
    );
  if (sameFamily(helperOf(wrong), helperOf(right)))
    return t(
      `*${wrong.split(" ")[0]}* does not agree with the subject pronoun *${rightPronoun}*.`,
      `*${wrong.split(" ")[0]}* 与主语代词 *${rightPronoun}* 单复数不一致。`,
    );
  return t(
    `*${helperOf(wrong)}* does not match the helping verb or tense of the statement.`,
    `*${helperOf(wrong)}* 与主句的助动词或时态不匹配。`,
  );
};

/** tagWhy explains the tag in the gap of shown. */
const tagWhy = (right: string, shown: string): Text => {
  const statement = shown.replace(/, ___\?$/u, "");
  const rule = tagRule(statement, right);
  return t(
    `${rule.en}: ${fill(shown, right)}\n\n**Check.** Verify all three checks: polarity flips (+ ↔ −), helping verb matches the statement's verb/tense, and the subject becomes a pronoun.`,
    `${rule["zh-CN"]}：${fill(shown, right)}\n\n**检验。** 核对三项：正负相反（肯 ↔ 否）、助动词与主句动词和时态一致、主语换成了人称代词。`,
  );
};

/** tagWriteWhy explains a written sentence with its tag. */
const tagWriteWhy = (right: string, shown: string): Text => {
  const tag = right.slice(shown.length + 2).replace(/\?$/u, "");
  const rule = tagRule(shown, tag);
  return t(
    `${rule.en}: ${right}\n\n**Check.** Confirm the comma before *${tag}*, opposite polarity, matching helping verb + pronoun, and the closing question mark.`,
    `${rule["zh-CN"]}：${right}\n\n**检验。** 确认 *${tag}* 前有逗号、正负相反、助动词与人称代词匹配，且句末有问号。`,
  );
};

const questionTags: TopicDef = {
  id: "question-tags",
  title: t("Question Tags", "反意疑问句"),
  summary: t(
    "You're coming, aren't you? She didn't call, did she? A positive sentence takes a negative tag, a negative sentence a positive one, with the helping verb of the sentence.",
    "You're coming, aren't you? She didn't call, did she? 肯定句配否定的反意疑问，否定句配肯定的，助动词跟句子一致。",
  ),
  intro: t(
    "In conversation, adding a short tag checks if the listener agrees: *He can drive, can't he?* *We aren't late, are we?* Unlike Chinese “对吧？”, an English tag changes its verb, polarity, and pronoun to match the statement.",
    "对话里在句末加个简短反意疑问可以向对方确认：*He can drive, can't he?* *We aren't late, are we?* 和中文通用的“对吧？”不同，英语反意疑问的助动词、正负和代词都要随主句变化。",
  ),
  prerequisites: ["present-simple-questions", "was-and-were"],
  encompasses: [
    { topic: "present-simple-questions", weight: 0.2 },
    { topic: "was-and-were", weight: 0.1 },
  ],
  xp: 25,
  strand: "grammar",
  knowledgePoints: [
    point(
      "positive",
      t("Tags after positive sentences", "肯定句后的反意疑问"),
      t(
        "A question tag is a short question at the end of a sentence. After a **positive** sentence, the tag is **negative**:\n\n- *You're coming, **aren't you**?* (*are* → *aren't*)\n- *She plays tennis, **doesn't she**?* (no helping verb, so use *do / does / did*)\n- *They went home, **didn't they**?*\n- *You can swim, **can't you**?*\n\nThe tag uses the same helping verb as the sentence, or *do / does / did* when there is none, and a pronoun for the subject: *Anna* → *she*, *this* → *it*, *those* → *they*.\n\n> **Watch out.** Never repeat a name or *this/that* in the tag (*Anna is here, isn't Anna?* is wrong—use *she*), and never put a positive tag after a positive statement.",
        "反意疑问是放在句末的简短问句，用来确认或请对方同意。**肯定**句后面用**否定**的反意疑问：\n\n- *You're coming, **aren't you**?*（*are* → *aren't*）\n- *She plays tennis, **doesn't she**?*（句中没有助动词，用 *do / does / did*）\n- *They went home, **didn't they**?*\n- *You can swim, **can't you**?*\n\n反意疑问用句子里的助动词，没有助动词就用 *do / does / did*；主语换成代词：*Anna* → *she*，*this* → *it*，*those* → *they*。\n\n> **注意。** 反意疑问里不能重复人名或 *this/that*（*isn't Anna?* 是错的，要用 *she*），肯定句后面也不要接肯定的反意疑问。",
      ),
      choiceGenerator(t("Choose the question tag.", "选出正确的反意疑问。"), tagChoice(positives), tagWhy, whyNotTag),
    ),
    point(
      "negative",
      t("Tags after negative sentences", "否定句后的反意疑问"),
      t(
        "After a **negative** sentence, the tag is **positive**:\n\n- *You aren't angry, **are you**?*\n- *She doesn't eat meat, **does she**?*\n- *They didn't call, **did they**?*\n\nWords such as *never* make a sentence negative too, so the tag is positive: *You never listen to me, **do you**?*\n\n> **Watch out.** Spot hidden negatives like *never*—*She never complains, doesn't she?* is wrong because *never* already makes the statement negative.",
        "**否定**句后面用**肯定**的反意疑问：\n\n- *You aren't angry, **are you**?*\n- *She doesn't eat meat, **does she**?*\n- *They didn't call, **did they**?*\n\n*never* 这样的词也让句子变成否定，所以反意疑问用肯定：*You never listen to me, **do you**?*\n\n> **注意。** 留心 *never* 这类隐含否定词——*She never complains, doesn't she?* 是错的，因为 *never* 已经让主句是否定，反意疑问要用肯定。",
      ),
      choiceGenerator(t("Choose the question tag.", "选出正确的反意疑问。"), tagChoice(negatives), tagWhy, whyNotTag),
    ),
    point(
      "write",
      t("Adding question tags", "加上反意疑问"),
      t(
        "Write the sentence with a question tag at the end. Put a comma before the tag and a question mark after it: *She plays tennis* → *She plays tennis, doesn't she?*\n\n> **Watch out.** Check the comma, the contracted negative (*isn't, doesn't, didn't, can't, won't*), the pronoun, and the closing question mark.",
        "在句末加上反意疑问，写出整句。反意疑问前加逗号，后面加问号：*She plays tennis* → *She plays tennis, doesn't she?*\n\n> **注意。** 核对逗号、否定缩写（*isn't、doesn't、didn't、can't、won't*）、人称代词和句末问号。",
      ),
      typedGenerator(
        "sentence",
        t("Add a question tag and write the whole sentence.", "加上反意疑问，写出整句。"),
        tagTyped,
        tagWriteWhy,
        questionTagsWriteNot,
      ),
    ),
  ],
};

// Indirect questions.

/** whItems are a direct question, a longer frame with a gap, the words in statement order, and two wrong orders. */
const handWhItems: readonly (readonly [string, string, string, readonly [string, string]])[] = [
  ["Where is the station?", "Do you know where ___?", "the station is", ["is the station", "the station it is"]],
  ["What time does the film start?", "Can you tell me what time ___?", "the film starts", ["does the film start", "the film start"]],
  ["Where does Anna live?", "Do you know where ___?", "Anna lives", ["does Anna live", "Anna live"]],
  ["Why is he angry?", "I wonder why ___.", "he is angry", ["is he angry", "he angry is"]],
  ["How much does this cost?", "Could you tell me how much ___?", "this costs", ["does this cost", "this cost"]],
  ["When did the train leave?", "Do you know when ___?", "the train left", ["did the train leave", "left the train"]],
  ["What is her name?", "I can't remember what ___.", "her name is", ["is her name", "her name it is"]],
  ["Where are the toilets?", "Could you tell me where ___?", "the toilets are", ["are the toilets", "the toilets is"]],
  ["How old is your grandmother?", "Do you know how old ___?", "your grandmother is", ["is your grandmother", "your grandmother are"]],
  ["What did she say?", "I didn't hear what ___.", "she said", ["did she say", "said she"]],
  ["Where did you buy that coat?", "Can you tell me where ___?", "you bought that coat", ["did you buy that coat", "bought you that coat"]],
  ["How far is the airport?", "Do you know how far ___?", "the airport is", ["is the airport", "the airport are"]],
  ["What time is it?", "Could you tell me what time ___?", "it is", ["is it", "it be"]],
  ["Why did they leave early?", "I don't know why ___.", "they left early", ["did they leave early", "left they early"]],
  ["When does the bank open?", "Do you know when ___?", "the bank opens", ["does the bank open", "the bank open"]],
  ["Where has Tom gone?", "Do you have any idea where ___?", "Tom has gone", ["has Tom gone", "Tom has went"]],
  ["How do you spell your name?", "Could you tell me how ___?", "you spell your name", ["do you spell your name", "you spells your name"]],
  ["What does this word mean?", "Do you know what ___?", "this word means", ["does this word mean", "this word mean"]],
  ["Where are you going?", "Can I ask where ___?", "you are going", ["are you going", "you is going"]],
  [
    "How long will the journey take?",
    "Do you know how long ___?",
    "the journey will take",
    ["will the journey take", "the journey take will"],
  ],
  ["What are they talking about?", "I wonder what ___.", "they are talking about", ["are they talking about", "they is talking about"]],
  ["When is your birthday?", "Can you remember when ___?", "your birthday is", ["is your birthday", "your birthday are"]],
  [
    "Why was the flight canceled?",
    "Do you know why ___?",
    "the flight was canceled",
    ["was the flight canceled", "the flight were canceled"],
  ],
  ["How much do the tickets cost?", "Could you tell me how much ___?", "the tickets cost", ["do the tickets cost", "the tickets costs"]],
  ["Where can I park?", "Do you know where ___?", "I can park", ["can I park", "I park can"]],
  ["What did you have for lunch?", "Tell me what ___.", "you had for lunch", ["did you have for lunch", "had you for lunch"]],
  ["How often does the bus come?", "Do you know how often ___?", "the bus comes", ["does the bus come", "the bus come"]],
  ["Where were you last night?", "I want to know where ___.", "you were last night", ["were you last night", "you was last night"]],
  [
    "What is the weather like in Beijing?",
    "Do you know what ___ in Beijing?",
    "the weather is like",
    ["is the weather like", "the weather like is"],
  ],
  ["Why are you laughing?", "Can you tell me why ___?", "you are laughing", ["are you laughing", "you is laughing"]],
  [
    "When will the results be ready?",
    "Do you know when ___?",
    "the results will be ready",
    ["will the results be ready", "the results ready will be"],
  ],
  ["How did you find my number?", "I wonder how ___.", "you found my number", ["did you find my number", "found you my number"]],
  ["What time does the shop close?", "Could you tell me what time ___?", "the shop closes", ["does the shop close", "the shop close"]],
  ["Where did I put my glasses?", "I can't remember where ___.", "I put my glasses", ["did I put my glasses", "put I my glasses"]],
];

/** yesNoItems are a yes-no question, a frame with a gap, and the words in statement order with if; the wrong orders follow. */
const handYesNoItems: readonly (readonly [string, string, string, string])[] = [
  ["Is the museum open today?", "Do you know ___?", "the museum is open today", "is the museum open today"],
  ["Does this bus go to the airport?", "Can you tell me ___?", "this bus goes to the airport", "does this bus go to the airport"],
  ["Is there a bank near here?", "Do you know ___?", "there is a bank near here", "is there a bank near here"],
  ["Did Tom call?", "I wonder ___.", "Tom called", "did Tom call"],
  ["Are the shops open on Sunday?", "Could you tell me ___?", "the shops are open on Sunday", "are the shops open on Sunday"],
  ["Has the film started?", "Do you know ___?", "the film has started", "has the film started"],
  ["Can I pay by card?", "Could you tell me ___?", "I can pay by card", "can I pay by card"],
  ["Will it rain tomorrow?", "Do you know ___?", "it will rain tomorrow", "will it rain tomorrow"],
  ["Does she like chocolate?", "I'm not sure ___.", "she likes chocolate", "does she like chocolate"],
  ["Is breakfast included?", "Can you tell me ___?", "breakfast is included", "is breakfast included"],
  ["Did they enjoy the party?", "I'd like to know ___.", "they enjoyed the party", "did they enjoy the party"],
  ["Are you free on Friday?", "Can I ask ___?", "you are free on Friday", "are you free on Friday"],
  ["Is this seat free?", "Do you know ___?", "this seat is free", "is this seat free"],
  ["Does the hotel have a pool?", "Could you tell me ___?", "the hotel has a pool", "does the hotel have a pool"],
  ["Was the exam difficult?", "I want to know ___.", "the exam was difficult", "was the exam difficult"],
  ["Have you seen my phone?", "Do you know ___?", "you have seen my phone", "have you seen my phone"],
  ["Can children swim in this pool?", "Could you tell me ___?", "children can swim in this pool", "can children swim in this pool"],
  ["Did I leave my keys here?", "I wonder ___.", "I left my keys here", "did I leave my keys here"],
  ["Is the restaurant expensive?", "Do you know ___?", "the restaurant is expensive", "is the restaurant expensive"],
  ["Does the train stop at Hangzhou?", "Can you tell me ___?", "the train stops at Hangzhou", "does the train stop at Hangzhou"],
  ["Will the teacher be angry?", "I'm not sure ___.", "the teacher will be angry", "will the teacher be angry"],
  ["Are dogs allowed in the park?", "Do you know ___?", "dogs are allowed in the park", "are dogs allowed in the park"],
  ["Did the shop give you a receipt?", "Can you remember ___?", "the shop gave you a receipt", "did the shop give you a receipt"],
  ["Is Lucy coming to dinner?", "Do you know ___?", "Lucy is coming to dinner", "is Lucy coming to dinner"],
  ["Has the parcel arrived?", "Could you tell me ___?", "the parcel has arrived", "has the parcel arrived"],
  ["Does your brother speak English?", "I'd like to know ___.", "your brother speaks English", "does your brother speak English"],
  ["Was the concert good?", "I wonder ___.", "the concert was good", "was the concert good"],
  ["Can we take photos here?", "Do you know ___?", "we can take photos here", "can we take photos here"],
  ["Is the water safe to drink?", "Could you tell me ___?", "the water is safe to drink", "is the water safe to drink"],
  ["Did you lock the car?", "Can you remember ___?", "you locked the car", "did you lock the car"],
  ["Are the tickets still available?", "Do you know ___?", "the tickets are still available", "are the tickets still available"],
  ["Does the library open on Mondays?", "Can you tell me ___?", "the library opens on Mondays", "does the library open on Mondays"],
];

/** openers are the starts of a longer sentence that holds a question, and the mark that ends it. */
const openers: readonly (readonly [string, string])[] = [
  ["Do you know", "?"],
  ["Can you tell me", "?"],
  ["Could you tell me", "?"],
  ["Do you have any idea", "?"],
  ["I wonder", "."],
  ["I'm not sure", "."],
  ["I'd like to know", "."],
  ["I don't know", "."],
];

/** whWord finds the question word before the gap of a frame, with what follows the gap. */
const whWord = (frame: string) =>
  /\b((?:what time|how much|how old|how far|how long|how often|what|where|why|when|how)) ___( in Beijing)?[?.]$/u.exec(frame);

const whItems: readonly (readonly [string, string, string, readonly [string, string]])[] = [
  ...handWhItems,
  ...everyPair(handWhItems, openers).flatMap(([[direct, frame, right, wrong], [open, mark]]) => {
    const found = whWord(frame);
    return found ? [[direct, `${open} ${found[1]} ___${found[2] ?? ""}${mark}`, right, wrong] as const] : [];
  }),
];

const yesNoItems: readonly (readonly [string, string, string, string])[] = [
  ...handYesNoItems,
  ...everyPair(handYesNoItems, openers).map(
    ([[direct, , statement, question], [open, mark]]) => [direct, `${open} ___${mark}`, statement, question] as const,
  ),
];

const whChoice: readonly ChoiceItem[] = whItems.map(([, frame, right, wrong]): ChoiceItem => [frame, right, wrong]);
const yesNoChoice: readonly ChoiceItem[] = yesNoItems.map(
  ([, frame, statement, question]): ChoiceItem => [frame, `if ${statement}`, [`if ${question}`, question]],
);

const indirectTyped: readonly TypedItem[] = interleave([
  whItems.map(
    ([direct, frame, right, wrong]): TypedItem => ({
      shown: `${direct} → ${frame.replace(" ___", "...").replace(/[?.]$/u, "")}`,
      accepted: [frame.replace("___", right)],
      wrong: [frame.replace("___", wrong[0])],
    }),
  ),
  yesNoItems.map(
    ([direct, frame, statement, question]): TypedItem => ({
      shown: `${direct} → ${frame.replace(" ___", "...").replace(/[?.]$/u, "")}`,
      accepted: [frame.replace("___", `[if|whether] ${statement}`)],
      canonical: frame.replace("___", `if ${statement}`),
      wrong: [frame.replace("___", question), frame.replace("___", `if ${question}`)],
    }),
  ),
]);

/** doIn finds do, does or did in a direct question, which goes away in an indirect one. */
const doIn = (direct: string) => /\b(do|does|did)\b/iu.exec(direct.split(" ").slice(0, 3).join(" "))?.[1]?.toLowerCase() ?? "";

/** indirectRule names the order of a question inside a longer sentence, from its direct form. */
function indirectRule(direct: string, yesNo: boolean): Text {
  const helper = doIn(direct);
  const without = helper ? t(`, and *${helper}* goes away`, `，并去掉 *${helper}*`) : t("", "");
  return yesNo
    ? t(
        `*${direct}* is a yes-no question, so inside a longer sentence it takes *if* and the order of a statement${without.en}`,
        `*${direct}* 是一般疑问句，放进长句里要加 *if*，并用陈述句语序${without["zh-CN"]}`,
      )
    : t(
        `Inside a longer sentence, *${direct}* takes the order of a statement, with the subject before the verb${without.en}`,
        `放进长句里，*${direct}* 要用陈述句语序，主语在动词前${without["zh-CN"]}`,
      );
}

/** whItemOf finds the wh-item of a frame and its right words. */
const whItemOf = (frame: string, right: string) => whItems.find(([, f, r]) => f === frame && r === right);

/** whWhy explains the statement order after a question word. */
const whWhy = (right: string, shown: string): Text => {
  const rule = indirectRule(whItemOf(shown, right)?.[0] ?? "", false);
  return t(
    `${rule.en}: ${fill(shown, right)}\n\n**Check.** Read the embedded clause (*${right}*): subject comes before verb, and any *do/does/did* is gone.`,
    `${rule["zh-CN"]}：${fill(shown, right)}\n\n**检验。** 读一遍嵌入部分（*${right}*）：主语在动词前面，且没有多余的 *do/does/did*。`,
  );
};

/** whyNotWh explains the order of a question, or a word wrong in the statement order. */
const whyNotWh = (wrong: string, right: string, shown: string, position: number): Text => {
  const direct = whItemOf(shown, right)?.[0] ?? "";
  const w = wrong.split(" ");
  const r = right.split(" ");
  const extra = w.filter((x) => !r.includes(x));
  const missing = r.filter((x) => !w.includes(x));
  const helper = doIn(direct);
  if (position === 0)
    return t(
      `*${wrong}* keeps direct-question order, but inside a longer sentence it must switch to statement order (subject before verb).`,
      `*${wrong}* 保留了直接疑问句语序，放进长句里要改成陈述句语序（主语在动词前）。`,
    );
  if (extra.length === 0 && missing.length === 0)
    return t(`*${wrong}* puts the verb in the wrong position for statement order.`, `*${wrong}* 的动词位置不符合陈述句语序。`);
  if (missing.length === 0)
    return t(`*${extra.join(" ")}* is extra—the clause already has its subject.`, `不需要多余的 *${extra.join(" ")}*，分句已经有主语了。`);
  if (helper)
    return t(
      `Once *${helper}* is dropped, the verb itself must carry the right tense or *-s* ending rather than staying *${extra.join(" ")}*.`,
      `去掉 *${helper}* 后，实义动词本身要体现正确的时态或 *-s*，不能留在 *${extra.join(" ")}*。`,
    );
  return t(
    `*${extra.join(" ")}* does not agree with the subject or tense of the embedded clause.`,
    `*${extra.join(" ")}* 与嵌入分句的主语或时态不一致。`,
  );
};

/** yesNoOf finds the yes-no question of a frame and its statement after if. */
const yesNoOf = (frame: string, right: string) => yesNoItems.find(([, f, s]) => f === frame && `if ${s}` === right)?.[0] ?? "";

/** ifWhy explains if and the statement order after it. */
const ifWhy = (right: string, shown: string): Text => {
  const rule = indirectRule(yesNoOf(shown, right), true);
  return t(
    `${rule.en}: ${fill(shown, right)}\n\n**Check.** Verify both parts: *if* introduces the yes-no question, and the words after *if* follow statement order (subject before verb).`,
    `${rule["zh-CN"]}：${fill(shown, right)}\n\n**检验。** 核对两处：用 *if* 引导一般疑问句，且 *if* 后面采用陈述句语序（主语在动词前）。`,
  );
};

/** whyNotIf explains a yes-no question without if, or with the order of a question after if. */
const whyNotIf = (_wrong: string, _right: string, _shown: string, position: number): Text =>
  position === 0
    ? t(
        "*if* is right, but the words after it still use inverted question order instead of statement order.",
        "*if* 用对了，但后面的词依然是倒装的疑问句语序，没有改成陈述句语序。",
      )
    : t(
        "This copies the direct question as it was—it is missing *if* and still uses question order.",
        "这里直接照搬了原问句，既少了引导词 *if*，又保留了疑问句语序。",
      );

/** indirectWriteWhy explains a written indirect question from its direct question. */
const indirectWriteWhy = (right: string): Text => {
  const wh = whItems.find(([, frame, r]) => frame.replace("___", r) === right);
  const yesNo = yesNoItems.find(([, frame, s]) => frame.replace("___", `if ${s}`) === right);
  const rule = indirectRule(wh?.[0] ?? yesNo?.[0] ?? "", !wh);
  const mark = right.endsWith("?") ? "question mark" : "period";
  return t(
    `${rule.en}: ${right}\n\n**Check.** Confirm statement order inside the embedded clause, no leftover *do/does/did*, and a closing ${mark} matching the outer opener.`,
    `${rule["zh-CN"]}：${right}\n\n**检验。** 确认嵌入分句是陈述句语序、没有残留 *do/does/did*，且句末标点与外层开头一致。`,
  );
};

const indirectQuestions: TopicDef = {
  id: "indirect-questions",
  title: t("Do You Know Where...?", "间接疑问句"),
  summary: t(
    "Do you know where the station is? Inside a longer question or sentence, a question takes the order of a statement, without do, does or did; a yes-no question takes if or whether.",
    "Do you know where the station is? 问句放进更长的问句或句子里，要用陈述句语序，不用 do、does、did；一般疑问句用 if 或 whether 引导。",
  ),
  intro: t(
    "Asking *Where is the exit?* directly can sound abrupt. Wrapping it inside *Could you tell me where the exit is?* sounds polite—and flips the inner question back into statement order (*the exit is*).",
    "直接问 *Where is the exit?* 有时显得生硬，放进 *Could you tell me where the exit is?* 里就礼貌得多——同时里面的问句要恢复陈述句语序（*the exit is*）。",
  ),
  prerequisites: ["wh-questions", "reported-speech"],
  encompasses: [
    { topic: "wh-questions", weight: 0.2 },
    { topic: "reported-speech", weight: 0.1 },
  ],
  xp: 25,
  strand: "grammar",
  knowledgePoints: [
    point(
      "wh",
      t("Where the station is", "where the station is 的语序"),
      t(
        "To ask politely, you can put a question inside a longer one (*Do you know...?*, *Could you tell me...?*), or inside a statement (*I wonder...*, *I don't know...*).\n\nThe question inside then takes the order of a **statement**: the subject comes before the verb, and *do, does* and *did* disappear:\n\n- *Where **is the station**?* → *Do you know where **the station is**?*\n- *What time **does the film start**?* → *Can you tell me what time **the film starts**?*\n- *What **did she say**?* → *I didn't hear what **she said**.*\n\n> **Watch out.** Never keep inverted question order after the *wh-* word (*Do you know where is the station?* is wrong), and remember to put *-s* or the past tense back on the main verb when *does/did* drops.",
        "礼貌地提问时，可以把一个问题放进更长的问句里（*Do you know...?*、*Could you tell me...?*），也可以放进陈述句里（*I wonder...*、*I don't know...*）。\n\n里面的问题要用**陈述句语序**：主语在动词前面，*do、does、did* 去掉：\n\n- *Where **is the station**?* → *Do you know where **the station is**?*\n- *What time **does the film start**?* → *Can you tell me what time **the film starts**?*\n- *What **did she say**?* → *I didn't hear what **she said**.*\n\n> **注意。** 不要在疑问词后面保留倒装语序（*Do you know where is the station?* 是错的），去掉 *does/did* 后记得把 *-s* 或过去式补回实义动词上。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), whChoice, whWhy, whyNotWh),
    ),
    point(
      "if",
      t("If or whether for yes-no questions", "一般疑问句用 if 或 whether"),
      t(
        "A question that is answered with *yes* or *no* has no question word, so you add ***if*** or ***whether*** and use the order of a statement:\n\n- *Is the museum open?* → *Do you know **if the museum is open**?*\n- *Did Tom call?* → *I wonder **if Tom called**.*\n\n> **Watch out.** Do not drop *if/whether*, and do not keep *is/does/did* in front of the subject after *if* (*if is the museum open* is wrong).",
        "用 *yes* 或 *no* 回答的问题没有疑问词，所以要加 ***if*** 或 ***whether***，再用陈述句语序：\n\n- *Is the museum open?* → *Do you know **if the museum is open**?*\n- *Did Tom call?* → *I wonder **if Tom called**.*\n\n> **注意。** 不能省掉 *if/whether*，也不能在 *if* 后面保留倒装语序（*if is the museum open* 是错的）。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), yesNoChoice, ifWhy, whyNotIf),
    ),
    point(
      "write",
      t("Writing indirect questions", "写间接疑问句"),
      t(
        "Put the question into the longer sentence that starts after the arrow. Use the order of a statement, drop *do, does* and *did*, and add *if* or *whether* for a yes-no question: *Where is the station? → Do you know...* becomes *Do you know where the station is?*\n\n> **Watch out.** Match the end punctuation to the outer frame—*Do you know...?* ends with `?`, while *I wonder...* and *I'm not sure...* end with a period.",
        "把问题放进箭头后面开头的长句里。用陈述句语序，去掉 *do、does、did*，一般疑问句加 *if* 或 *whether*：*Where is the station? → Do you know...* 写成 *Do you know where the station is?*\n\n> **注意。** 句末标点看外层主句——*Do you know...?* 用问号，而 *I wonder...*、*I'm not sure...* 是陈述句，用句号。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Put the question into the sentence that begins after the arrow.", "把问题放进箭头后面开头的句子里。"),
        indirectTyped,
        indirectWriteWhy,
        indirectQuestionsWriteNot,
      ),
    ),
  ],
};

// Writing a letter of advice.

const adviceBank: readonly WritingItem[] = [
  {
    task: "Read the letter from Mia. Write a reply of 120 to 150 words giving her advice.",
    source:
      "My best friend has started spending all her time with a new group of girls. She doesn't sit with me at lunch anymore, and she didn't invite me to her birthday party. I feel hurt and lonely. Should I tell her how I feel, or just forget about her? Mia",
    model:
      "Dear Mia,\n\nI'm so sorry to hear about your friend. It really hurts when someone you care about seems to forget you, and it's completely normal to feel lonely.\n\nFirst, I think you should talk to her, but choose a quiet moment when she is alone. Tell her calmly how you feel, without blaming her. For example, you could say, \"I miss spending time with you.\" She may not realize that she has hurt you.\n\nSecond, try to make some new friends too. Join a club or sit with other classmates at lunch. That way, you won't depend on just one person, and you'll feel more confident.\n\nIf she doesn't want to be close friends anymore, that's sad, but it isn't your fault. People change, and new friendships will come.\n\nI hope things get better soon. Take care!\n\nBest wishes,\nSam",
  },
  {
    task: "Read the letter from Leo. Write a reply of 120 to 150 words giving him advice.",
    source:
      "My parents argue with me all the time about my phone. They say I spend too much time on it and that it's affecting my schoolwork. I think they are too strict, because all my friends have their phones all day. What can I do to stop the arguments? Leo",
    model:
      "Dear Leo,\n\nThanks for your letter. I understand how you feel. It's annoying when you argue with your parents every day, especially when your friends seem to have more freedom.\n\nMy first piece of advice is to listen to their worries. Are your marks really going down? If they are, your parents may have a point, and showing that you understand will make them trust you more.\n\nSecondly, why don't you suggest a plan together? For example, you could agree to leave your phone in the kitchen while you do your homework and use it freely after that. If you keep to the plan, they will probably give you more time.\n\nRemember that your parents want the best for you, even when they seem strict. A calm conversation will help more than another argument.\n\nGood luck!\n\nAll the best,\nAnna",
  },
  {
    task: "Read the letter from Grace. Write a reply of 120 to 150 words giving her advice.",
    source:
      "I lent my friend some money three months ago. She promised to pay me back after a week, but she hasn't, and she never mentions it. Now I feel uncomfortable when I see her. I don't want to lose her as a friend. What should I do? Grace",
    model:
      "Dear Grace,\n\nI'm sorry you're in this situation. Money can make friendships difficult, and I can see that you care about her a lot.\n\nI think you should mention it to her, kindly but clearly. Perhaps she has simply forgotten. You could say something like, \"Do you remember the money I lent you? I need it now for something.\" If you say it in a friendly way, she probably won't feel attacked.\n\nIf she has problems with money at the moment, you could suggest that she pays you back a little at a time. That way, it's easier for her, and you won't have to wait forever.\n\nIn the future, it's a good idea to lend only an amount you could afford to lose. A real friend will understand.\n\nI hope you sort it out soon.\n\nBest wishes,\nDan",
  },
  {
    task: "Read the letter from Ben. Write a reply of 120 to 150 words giving him advice.",
    source:
      "I'm starting a new school next month in another city. I'm very shy, and I'm worried that I won't make any friends. At my old school I had the same friends since I was six. How can I meet people at the new school? Ben",
    model:
      "Hi Ben,\n\nThanks for writing to me. Starting a new school is scary for everyone, not only for shy people, so it's normal to feel nervous.\n\nMy first piece of advice is to join a club or a team in the first few weeks. It's much easier to talk to people when you are doing something together, like playing football or making music. You'll have a topic of conversation straight away.\n\nAlso, try to ask questions. Shy people often worry about what to say, but most people love talking about themselves. Ask a classmate about the homework or what they did at the weekend, and listen to the answer.\n\nFinally, don't forget your old friends. You can still call them when you feel homesick.\n\nGive it time. By Christmas, I'm sure you'll have new friends. Good luck!\n\nYour friend,\nKate",
  },
  {
    task: "Read the letter from Nina. Write a reply of 120 to 150 words giving her advice.",
    source:
      "My older sister always borrows my clothes without asking. Last week she took my favorite jacket and got paint on it. When I complained, my mother told me not to be selfish. I'm so angry with both of them. What would you do? Nina",
    model:
      "Dear Nina,\n\nI can understand why you're angry. It isn't fair when someone takes your things without asking, especially when they get damaged.\n\nFirst, I would wait until you feel calm and then talk to your sister alone. Explain that you don't mind lending her clothes sometimes, but that she must ask first. You could also ask her to pay for cleaning the jacket.\n\nSecond, talk to your mother again. Perhaps she didn't understand the whole story. Tell her that you're happy to share, but that you want your sister to respect your things. If she understands that you're not being selfish, she will probably support you.\n\nIf nothing changes, you could keep your favorite clothes in a box in your room.\n\nI'm sure you can find a solution together. Sisters argue, but they usually make up!\n\nLove,\nEmma",
  },
  {
    task: "Read the letter from Oscar. Write a reply of 120 to 150 words giving him advice.",
    source:
      "My best friend told me a secret, and I accidentally told another friend. Now everyone knows, and my best friend isn't speaking to me. I feel terrible. How can I make things right? Oscar",
    model:
      "Dear Oscar,\n\nThanks for your letter. I can tell that you feel really bad about what happened, and that shows you care about your friend.\n\nThe most important thing is to apologize properly. Don't make excuses or blame the other friend. Just say that you made a mistake, that you're sorry, and that you understand why he's upset. You could write him a letter if it's hard to say it face to face.\n\nAfter that, give him some time. He may not forgive you straight away, and you can't force him. But if you show him that you can keep secrets in the future, he will slowly trust you again.\n\nEveryone makes mistakes, and a good friendship can survive one. If you're honest with him, I'm sure he'll forgive you in the end.\n\nTake care,\nLucy",
  },
  {
    task: "Read the letter from Ruby. Write a reply of 120 to 150 words giving her advice.",
    source:
      "My grandmother lives alone in a village two hours away. She says she's fine, but when I call her, she sounds lonely. I'm busy with school and can only visit her a few times a year. What can I do to help her? Ruby",
    model:
      "Dear Ruby,\n\nWhat a kind letter! It's clear that you love your grandmother very much, and I can understand why you're worried about her.\n\nFirst, why don't you call her more often, even for five minutes? Choose a regular time, such as every Sunday evening. Then she'll have something to look forward to. You could also send her photos or short letters about your life.\n\nSecondly, you could help her to meet people in her village. Many villages have clubs for older people, where they play cards, dance or learn new things. If you find out what is available, you could encourage her to try one.\n\nFinally, if she has a smartphone, teach her to make video calls on your next visit. Seeing your face will make her very happy.\n\nI'm sure your grandmother is proud of you.\n\nBest wishes,\nTim",
  },
  {
    task: "Read the letter from Jack. Write a reply of 120 to 150 words giving him advice.",
    source:
      "My friend wants to copy my homework every day. He says he doesn't have time to do it because he works in his family's shop after school. I want to help him, but I don't think copying is right. What should I do? Jack",
    model:
      "Hi Jack,\n\nI'm glad you wrote to me. You're in a difficult situation, because you want to be a good friend and do the right thing at the same time.\n\nI think you should stop giving him your homework, but explain why in a kind way. Tell him that you're worried about him, because if he copies, he won't learn anything and he will fail the exams.\n\nInstead, you could offer to help him in other ways. For example, you could do homework together at lunchtime, or explain the difficult parts on the phone in the evening. That's real help.\n\nIt might also be a good idea for him to talk to a teacher. If the teachers know about his job, they may give him more time.\n\nA true friend will understand. Good luck!\n\nYour friend,\nMax",
  },
  {
    task: "Read the letter from Ella. Write a reply of 120 to 150 words giving her advice.",
    source:
      "My two best friends had a big argument, and now they both want me to choose between them. Each of them tells me bad things about the other. I like them both and I don't want to lose either of them. Please help! Ella",
    model:
      "Dear Ella,\n\nI'm sorry you're stuck in the middle. It's a horrible feeling when two people you love are angry with each other.\n\nMy first piece of advice is not to choose. Tell each of them, calmly and clearly, that you are friends with both of them and that you won't take sides. If they start saying bad things about each other, change the topic or walk away.\n\nSecondly, spend time with them separately for a while. That way, you can stay close to both of them without being part of the argument.\n\nWhen things are calmer, you could suggest that they meet and talk. But don't push them too hard, because they need to solve this themselves.\n\nYou are being a good friend to both of them. I hope they make up soon.\n\nBest wishes,\nRyan",
  },
  {
    task: "Read the letter from Adam. Write a reply of 120 to 150 words giving him advice.",
    source:
      "My brother is two years younger than me, and my parents always compare us. They say he is more hard-working and polite than me. It makes me feel useless, and I'm starting to dislike my brother. What should I do? Adam",
    model:
      "Dear Adam,\n\nThank you for your letter. Being compared with a brother or sister is really hard, and it's not surprising that you feel this way.\n\nFirst, I think you should tell your parents how it makes you feel. Choose a calm moment and explain that you feel useless when they compare you. They probably don't realize how much it hurts, and they may stop if they understand.\n\nSecondly, try not to blame your brother. It isn't his fault that your parents compare you. If you spend time doing something fun together, you'll remember that you're on the same team.\n\nAlso, think about the things you are good at. Everyone has different strengths. If you enjoy sport or art, for example, make time for it.\n\nYou are not useless. I hope your family can talk about this soon.\n\nAll the best,\nJulia",
  },
  {
    task: "Read the letter from Zoe. Write a reply of 120 to 150 words giving her advice.",
    source:
      "I've been invited to two parties on the same Saturday: my cousin's wedding and my best friend's sixteenth birthday. My mother says I must go to the wedding, but my friend will be very disappointed if I don't come. What can I do? Zoe",
    model:
      "Hi Zoe,\n\nThat's a hard choice! I can see why you feel torn, because both events are important to people you love.\n\nFirst of all, I think you should go to the wedding. A family wedding happens only once, and your cousin and your mother would be really hurt if you weren't there.\n\nBut that doesn't mean you have to miss your friend's birthday completely. Talk to her before the weekend and explain the situation honestly. Perhaps you could leave the wedding early and arrive at the party later, or take her out for lunch on Sunday to celebrate together.\n\nYou could also give her a special present or a card to show how much she means to you. If she is a real friend, she will understand.\n\nI hope you enjoy both celebrations!\n\nLove,\nAmy",
  },
  {
    task: "Read the letter from Paul. Write a reply of 120 to 150 words giving him advice.",
    source:
      "My friends often make jokes about me in front of other people. They say it's just for fun, but it makes me feel embarrassed and upset. I don't want to seem too sensitive. Should I say something? Paul",
    model:
      "Dear Paul,\n\nThanks for writing. I'm sorry your friends are making you feel this way. Jokes aren't funny when only one person is laughing, and it's not \"too sensitive\" to feel hurt.\n\nI think you should say something, but choose the right moment. Don't do it in front of everyone, because they may laugh again. Speak to one or two of them on their own, and tell them honestly that the jokes upset you. Real friends will want to know.\n\nYou could also try a quick, calm answer the next time it happens, such as \"That's not funny, guys.\" If you say it without getting angry, they'll probably stop.\n\nIf they still don't change, it might be time to spend more time with people who make you feel good.\n\nYou deserve friends who respect you. Good luck!\n\nBest wishes,\nSara",
  },
];

const writingALetterOfAdvice = judgedTopic({
  id: "writing-a-letter-of-advice",
  title: t("Writing a Letter of Advice", "写建议信"),
  summary: t(
    "Reply to a letter from someone with a problem with a friend or a family member: show you understand, give two pieces of advice with reasons, and end kindly.",
    "回复一封讲述与朋友或家人之间问题的来信：表示理解，提出两条带理由的建议，并友好地结尾。",
  ),
  intro: t(
    "When someone writes to you with a personal dilemma, lecturing them rarely helps. A thoughtful reply starts with empathy (*I can understand why you feel hurt*), offers two practical suggestions with reasons, and closes with warm encouragement.",
    "别人向你倾诉人际困扰时，上来就说教往往不起作用。贴心的建议信会先表达共情（*I can understand why you feel hurt*），再给出两条带理由的实用建议，最后用温暖的鼓励收尾。",
  ),
  prerequisites: ["writing-an-informal-email", "first-conditional"],
  encompasses: [
    { topic: "writing-an-informal-email", weight: 0.3 },
    { topic: "first-conditional", weight: 0.1 },
  ],
  criteria: ["b1-advice-understanding", "b1-advice-with-reasons", "b1-advice-kind-ending", "b1-informal-tone"],
  point: {
    id: "advice",
    title: t("Understanding, advice and a kind ending", "理解、建议和友好的结尾"),
    explanation: t(
      "A letter of advice answers someone who has a problem. It has three parts:\n\n- **Show you understand** the problem and the writer's feelings: *I'm sorry to hear that... It's normal to feel...*\n- **Give two pieces of advice, each with a reason**: *I think you should... because... Why don't you...? If you..., she will...* Begin each one with *First* or *Secondly* so the reader can follow.\n- **End kindly**, with hope or encouragement: *I hope things get better soon. Good luck!*\n\n> **Watch out.** Do not jump straight into orders like *You must...*—open with empathy, explain *why* each suggestion helps, and sign off warmly.",
      "建议信是回复遇到问题的人。它有三部分：\n\n- **表示理解**问题和来信人的感受：*I'm sorry to hear that... It's normal to feel...*\n- **提出两条建议，每条都有理由**：*I think you should... because... Why don't you...? If you..., she will...* 用 *First*、*Secondly* 开头，让读者容易跟上。\n- **友好地结尾**，表达希望或鼓励：*I hope things get better soon. Good luck!*\n\n> **注意。** 不要一上来就用 *You must...* 发号施令——先共情，再说明每条建议为什么有效，最后温暖收尾并署名。",
    ),
  },
  question: t(
    "Read the letter. Write a reply of 120 to 150 words in English: show that you understand, give two pieces of advice with reasons, and end kindly.",
    "阅读来信，用英语写一封 120 到 150 词的回信：表示理解，提出两条带理由的建议，并友好地结尾。",
  ),
  bank: adviceBank,
  limits: { minWords: 100, maxChars: 1500 },
  what: t("letter of advice", "建议信"),
});

/** topics are the topics of the unit Relationships. */
export const topics: readonly TopicDef[] = [
  relationships.topic,
  personality.topic,
  gettingOn.topic,
  emotions.topic,
  social.topic,
  lifeEvents.topic,
  family.topic,
  questionTags,
  indirectQuestions,
  writingALetterOfAdvice,
];

/** vocabulary are the words the unit Relationships teaches. */
export const vocabulary: readonly WordBatch[] = [
  relationships.batch,
  personality.batch,
  gettingOn.batch,
  emotions.batch,
  social.batch,
  lifeEvents.batch,
  family.batch,
];
