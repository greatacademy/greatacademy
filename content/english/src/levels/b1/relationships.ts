// B1, unit 8: Relationships. Relationships, personality, getting on, emotions, social life, life events and family
// life; question tags and indirect questions; writing a letter of advice. Its run-ons reuse the native topics.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill, judgedTopic } from "../a2/kit.ts";
import { interleave, vocabularyTopic, word } from "../words.ts";

const relationships = vocabularyTopic({
  id: "b1-words-relationships",
  title: t("Relationships", "人际关系"),
  summary: t(
    "Relationships, couples and marriage; divorce and getting engaged; boyfriends and girlfriends; single and romantic; acquaintances, generations and childhood.",
    "关系、情侣和婚姻；离婚和订婚；男朋友和女朋友；单身的和浪漫的；熟人、一代人和童年。",
  ),
  prerequisites: ["a2-words-relatives"],
  words: [
    word(
      "relationship relationships",
      "the way two or more people feel about and behave toward each other",
      "关系",
      "I have a good {relationship} with my parents.|generation childhood | Their {relationship} ended after three years.|childhood generation | Good {relationships} need trust.|childhoods generations",
      "relative religion",
    ),
    word(
      "couple couples",
      "two people who are married or in a romantic relationship",
      "情侣；夫妻",
      "The young {couple} next door have just had a baby.|acquaintance generation | They have been a {couple} since high school.|generation childhood | Many {couples} get married in spring.|generations acquaintances",
      "cousin double",
    ),
    word(
      "marriage marriages",
      "the relationship between two people who are married",
      "婚姻",
      "My grandparents had a long and happy {marriage}.|childhood acquaintance | {Marriage} is a big decision.|Childhood Acquaintance | Their {marriage} lasted fifty years.|acquaintance generation",
      "wedding message",
    ),
    word(
      "divorce divorces divorced divorcing",
      "the legal end of a marriage; to end a marriage",
      "离婚",
      "Her parents got {divorced} when she was six.|engaged romantic | The couple are getting a {divorce}.|childhood generation | One in three marriages ends in {divorce}.|childhood romantic",
      "divide wedding",
    ),
    word(
      "engaged",
      "having agreed to marry someone",
      "订婚的",
      "Tom and Lisa got {engaged} last month.|single romantic | My brother is {engaged} to a girl from Canada.|single romantic | They were {engaged} for two years before the wedding.|divorced single",
      "engaging busy",
    ),
    word(
      "boyfriend boyfriends",
      "a man or a boy with whom someone has a romantic relationship",
      "男朋友",
      "Has your sister got a {boyfriend}?|childhood generation | She met her {boyfriend} at university.|childhood generation | Her new {boyfriend} is very funny.|childhood generation",
      "brother classmate",
    ),
    word(
      "girlfriend girlfriends",
      "a woman or a girl with whom someone has a romantic relationship",
      "女朋友",
      "He's bringing his {girlfriend} to the party.|childhood generation | Max and his {girlfriend} have been together for a year.|childhood generation | Jack bought his {girlfriend} flowers for her birthday.|childhood generation",
      "sister classmate",
    ),
    word(
      "single",
      "not married or not in a romantic relationship",
      "单身的",
      "My aunt is {single} and lives alone.|romantic childhood | Are you married or {single}?|romantic childhood | He's been {single} since he broke up with his girlfriend.|romantic childhood",
      "simple lonely",
    ),
    word(
      "romantic",
      "about love, or showing love in a special way",
      "浪漫的",
      "They had a {romantic} dinner by candlelight.|single engaged | It's a {romantic} film about two students in Paris.|single engaged | My dad isn't very {romantic}; he forgot their anniversary.|engaged single",
      "religious realistic",
    ),
    word(
      "acquaintance acquaintances",
      "a person you know a little but who is not a close friend",
      "熟人",
      "He's not a friend; he's just an {acquaintance} from work.|engagement generation | I met an old {acquaintance} at the station.|generation childhood | She has many {acquaintances} but few close friends.|generations childhoods",
      "accountant acceptance",
    ),
    word(
      "generation generations",
      "all the people born at about the same time",
      "一代人；代",
      "Three {generations} of the family live in the same house.|couples relationships | The younger {generation} uses phones for everything.|couple relationship | The recipe has been passed down from {generation} to generation.|couple marriage",
      "general gene",
    ),
    word(
      "childhood",
      "the time when you are a child",
      "童年",
      "I had a happy {childhood} in a small village.|generation acquaintance | We have been friends since {childhood}.|generation acquaintance | She told us stories from her {childhood}.|generation acquaintance",
      "children neighborhood",
    ),
  ],
});

const personality = vocabularyTopic({
  id: "b1-words-personality",
  title: t("Personality", "性格"),
  summary: t(
    "Personality and character; generous and selfish; shy and outgoing; sensitive and sociable; stubborn, mature, easygoing and considerate.",
    "个性和性格；慷慨的和自私的；害羞的和外向的；敏感的和好交际的；固执的、成熟的、随和的和体贴的。",
  ),
  prerequisites: ["b1-words-qualities"],
  words: [
    word(
      "personality personalities",
      "the kind of person someone is, shown in the way they behave and feel",
      "个性；性格",
      "She has a warm and friendly {personality}.|stubborn mature | The twins look the same, but they have very different {personalities}.|generous mature | A good teacher needs a strong {personality}.|selfish generous",
      "personal popularity",
      "character",
    ),
    word(
      "character characters",
      "all the qualities that make a person who they are",
      "性格；品质",
      "Honesty is an important part of her {character}.|selfish mature | It's not in his {character} to lie.|stubborn sociable | Her brother has a very calm {character}.|generous outgoing",
      "charity actor",
      "personality",
    ),
    word(
      "generous",
      "happy to give money, time or help to others",
      "慷慨的；大方的",
      "It was very {generous} of you to pay for dinner.|shy stubborn | My grandmother is {generous} with her time.|shy mature | He gave a {generous} gift to the school.|shy sociable",
      "general selfish",
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
      "He was too {shy} to ask her to dance.|outgoing sociable | She was {shy} at first, but now she talks to everyone.|outgoing sociable | Don't be {shy}. Come and say hello.|generous mature",
      "sly outgoing",
    ),
    word(
      "outgoing",
      "friendly and liking to meet new people",
      "外向的；友好的",
      "My sister is very {outgoing}; she talks to everyone.|shy stubborn | {Outgoing} people often enjoy working in sales.|Shy Stubborn | He's more {outgoing} than his brother, who prefers to stay at home.|shy stubborn",
      "outdoor ongoing",
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
      "She's very {mature} for a twelve-year-old.|shy selfish | It wasn't very {mature} of you to shout at him.|shy sociable | He has become much more {mature} since he started university.|shy stubborn",
      "nature major",
    ),
    word(
      "easygoing",
      "relaxed, and not easily worried or annoyed",
      "随和的；好相处的",
      "My dad is very {easygoing}; he never gets angry.|stubborn selfish | She's an {easygoing} person who gets on with everyone.|stubborn selfish | Our teacher is {easygoing} about homework deadlines.|selfish shy",
      "easy outgoing",
    ),
    word(
      "considerate",
      "always thinking of other people's feelings and needs",
      "体贴的；考虑周到的",
      "It was {considerate} of you to call me when you knew you'd be late.|stubborn shy | Please be {considerate} and turn your music down.|stubborn shy | He's a kind, {considerate} neighbor.|stubborn selfish",
      "considerable confident",
    ),
  ],
});

const gettingOn = vocabularyTopic({
  id: "b1-words-getting-on",
  title: t("Getting On", "相处"),
  summary: t(
    "Supporting, apologizing and forgiving; admitting, blaming and criticizing; praising and complaining; deserving; ignoring; quarrels, arguments and disagreeing.",
    "支持、道歉和原谅；承认、责备和批评；表扬和抱怨；应得；忽视；争吵、争论和意见不合。",
  ),
  prerequisites: ["a2-words-people-together"],
  words: [
    word(
      "support supports supported supporting",
      "to help someone, especially when they have problems",
      "支持；帮助",
      "My family always {supports} me when things are difficult.|blames criticizes | Thank you for all your {support}.|argument quarrel | Which football team do you {support}?|blame forgive",
      "suppose report",
    ),
    word(
      "apologize apologizes apologized apologizing",
      "to say that you are sorry",
      "道歉",
      "You should {apologize} to your sister for breaking her phone.|praise deserve | He {apologized} for being late.|deserved admitted | I {apologize} if I hurt your feelings.|deserve support",
      "apply complain",
    ),
    word(
      "forgive forgives forgave forgiven forgiving",
      "to stop being angry with someone for something they did",
      "原谅",
      "Please {forgive} me. I didn't mean it.|criticize blame | She never {forgave} him for forgetting her birthday.|praised deserved | I've {forgiven} you, but I won't forget.|criticized deserved",
      "forget give",
    ),
    word(
      "admit admits admitted admitting",
      "to agree that something bad is true, often unwillingly",
      "承认",
      "He {admitted} that he had broken the window.|praised deserved | I must {admit} I was wrong.|deserve praise | She never {admits} her mistakes.|deserves praises",
      "admire permit",
    ),
    word(
      "blame blames blamed blaming",
      "to say that someone is responsible for something bad",
      "责备；归咎于",
      "Don't {blame} me! It wasn't my fault.|praise apologize | The driver {blamed} the weather for the accident.|apologized deserved | Nobody {blames} you for what happened.|apologizes deserves",
      "claim praise",
    ),
    word(
      "criticize criticizes criticized criticizing",
      "to say what you think is bad about someone or something",
      "批评；指责",
      "My boss {criticized} my report in front of everyone.|apologized deserved | It's easy to {criticize} other people.|apologize deserve | Parents shouldn't always {criticize} their children; they should also praise them.|apologize deserve",
      "praise organize",
    ),
    word(
      "praise praises praised praising",
      "to say that someone or something is very good",
      "表扬；称赞",
      "The teacher {praised} her for her excellent essay.|blamed complained | Children need {praise} as well as rules.|blame quarrel | Everyone {praises} the food at that restaurant.|complains apologizes",
      "price blame",
    ),
    word(
      "complain complains complained complaining",
      "to say that you are not happy about something",
      "抱怨；投诉",
      "Our neighbors {complained} about the noise.|praised forgave | Stop {complaining} and eat your dinner!|praising forgiving | He's always {complaining} about the weather.|admitting deserving",
      "explain compare",
    ),
    word(
      "deserve deserves deserved deserving",
      "to have earned something because of what you have done",
      "应得；值得",
      "You worked hard, so you {deserve} a holiday.|apologize complain | She {deserved} to win the prize.|complained apologized | He doesn't {deserve} such a kind girlfriend.|complain apologize",
      "desert reserve",
    ),
    word(
      "quarrel quarrels quarreled quarreling",
      "an angry argument; to argue angrily",
      "争吵",
      "The two brothers {quarreled} about money.|praised supported | We had a {quarrel}, but we're friends again now.|support praise | Stop {quarreling}, you two!|praising supporting",
      "quarter question",
      "argument",
    ),
    word(
      "argument arguments",
      "a talk in which people disagree, often angrily",
      "争论；争吵",
      "I had an {argument} with my dad about my phone.|support praise | They never have {arguments} about money.|supports praises | The {argument} ended when she walked out of the room.|support praise",
      "agreement document",
      "quarrel",
    ),
    word(
      "disagree disagrees disagreed disagreeing",
      "to have a different opinion from someone",
      "不同意；意见不合",
      "I {disagree} with you about the new rule.|deserve forgive | My parents often {disagree} about where to go on holiday.|deserve apologize | Two teachers {disagreed} about the best answer.|deserved forgave",
      "dislike disappear",
    ),
    word(
      "ignore ignores ignored ignoring",
      "to pay no attention to someone or something",
      "忽视；不理睬",
      "I said hello, but she {ignored} me.|deserved apologized | Don't {ignore} the doctor's advice.|apologize complain | He kept {ignoring} my messages.|apologizing disagreeing",
      "ignite inform",
    ),
  ],
});

const emotions = vocabularyTopic({
  id: "b1-words-emotions",
  title: t("Emotions", "情绪"),
  summary: t(
    "Emotions; anger, fear and joy; grateful, disappointed and frustrated; confused and ashamed; relieved and annoyed.",
    "情绪；愤怒、恐惧和喜悦；感激的、失望的和沮丧的；困惑的和羞愧的；松了口气的和恼火的。",
  ),
  prerequisites: ["a2-words-feelings-2"],
  words: [
    word(
      "emotion emotions",
      "a strong feeling, such as love, anger or fear",
      "情感；情绪",
      "It's hard for him to show his {emotions}.|grateful relieved | Fear is a natural {emotion}.|anger joy | Her voice was full of {emotion} as she said goodbye.|grateful ashamed",
      "motion emoji",
    ),
    word(
      "emotional",
      "having or showing strong feelings",
      "情绪的；激动的",
      "The goodbye at the airport was very {emotional}.|grateful ashamed | She gets {emotional} when she talks about her grandmother.|grateful relieved | Teenagers go through many {emotional} changes.|grateful relieved",
      "emotion national",
    ),
    word(
      "anger",
      "the strong feeling you have when you are very annoyed",
      "愤怒",
      "He couldn't hide his {anger} when he saw the broken window.|joy grateful | She shouted in {anger}.|joy relieved | Count to ten to control your {anger}.|joy grateful",
      "danger hunger",
    ),
    word(
      "fear fears",
      "the feeling you have when you think something bad may happen",
      "恐惧；害怕",
      "She has a {fear} of spiders.|joy anger | The children were shaking with {fear}.|joy relieved | You must face your {fears}.|joys angers",
      "fair dear",
    ),
    word(
      "joy",
      "great happiness",
      "喜悦；快乐",
      "The baby brought {joy} to the whole family.|anger fear | She jumped for {joy} when she heard the news.|anger fear | Music brings {joy} to many people.|grateful relieved",
      "toy joke",
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
      "I was {disappointed} with my exam results.|grateful relieved | The fans were {disappointed} when the concert was canceled.|grateful relieved | Mom will be {disappointed} if you don't come home for her birthday.|grateful relieved",
      "disappeared appointed",
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
});

const social = vocabularyTopic({
  id: "b1-words-social-life",
  title: t("Social Life", "社交生活"),
  summary: t(
    "Gatherings and reunions; visitors; gossip; greeting people; accepting and refusing; attitudes, opportunities and situations; conversations and topics.",
    "聚会和重聚；来访者；闲话；打招呼；接受和拒绝；态度、机会和情况；谈话和话题。",
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
      "Our class is having a ten-year {reunion} next month.|attitude situation | It was an emotional {reunion} at the airport.|attitude topic | Family {reunions} are a big part of Chinese New Year.|attitudes topics",
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
      "Don't believe all the {gossip} you hear.|opportunity attitude | They spent the evening drinking tea and sharing {gossip}.|opportunity situation | She loves to {gossip} about her neighbors.|accept refuse",
      "gospel goggles",
    ),
    word(
      "greet greets greeted greeting",
      "to say hello to someone or welcome them",
      "问候；迎接",
      "Our host {greeted} us at the door with a big smile.|refused accepted | In Japan, people often {greet} each other with a bow.|refuse gossip | She {greets} every customer by name.|refuses gossips",
      "great agree",
    ),
    word(
      "accept accepts accepted accepting",
      "to say yes to something that is offered",
      "接受",
      "She {accepted} the job offer at once.|greeted gossiped | Please {accept} this small gift.|greet gossip | Do you {accept} credit cards?|greet gossip",
      "except expect",
    ),
    word(
      "refuse refuses refused refusing",
      "to say no to something; to say you will not do something",
      "拒绝",
      "He {refused} to answer my question.|greeted gossiped | I couldn't {refuse} such a kind invitation.|greet gossip | The child {refuses} to eat vegetables.|greets gossips",
      "refuel reuse",
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
      "I had a long {conversation} with my grandmother.|attitude opportunity | It's hard to have a {conversation} in a noisy restaurant.|attitude situation | Our English teacher wants us to practice everyday {conversations}.|attitudes opportunities",
      "conservation invitation",
    ),
    word(
      "topic topics",
      "a subject that people talk or write about",
      "话题；主题",
      "The weather is a safe {topic} of conversation.|visitor attitude | Let's change the {topic}.|visitor reunion | We discussed many {topics} at the meeting.|visitors reunions",
      "tropic top",
    ),
  ],
});

const lifeEvents = vocabularyTopic({
  id: "b1-words-life-events",
  title: t("Life Events", "人生大事"),
  summary: t(
    "Birth and death; adults, teenagers and youth; the elderly and retirement; funerals; pregnant; twins and ancestors.",
    "出生和死亡；成年人、青少年和青年时期；老年人和退休；葬礼；怀孕的；双胞胎和祖先。",
  ),
  prerequisites: ["a2-words-relatives"],
  words: [
    word(
      "birth births",
      "the time when a baby is born",
      "出生",
      "What is your date of {birth}?|death youth | She gave {birth} to twins.|death youth | The {birth} of their first child changed everything.|funeral retirement",
      "birthday breath",
    ),
    word(
      "adult adults",
      "a person who is fully grown",
      "成年人",
      "Tickets cost ten dollars for {adults} and five for children.|ancestors funerals | When you become an {adult}, you can vote.|ancestor elderly | The film is not for children; it's for {adults} only.|ancestors twins",
      "child baby",
    ),
    word(
      "teenager teenagers",
      "a person between thirteen and nineteen years old",
      "青少年",
      "Most {teenagers} in my class have a phone.|ancestors funerals | When I was a {teenager}, I wanted to be a singer.|funeral ancestor | This book is written for {teenagers}.|ancestors funerals",
      "toddler pensioner",
      "teenage youth",
    ),
    word(
      "teenage",
      "between thirteen and nineteen years old, or for people of that age",
      "十几岁的；青少年的",
      "They have two {teenage} sons.|elderly pregnant | Many {teenage} girls read her books.|elderly pregnant | Her {teenage} years were difficult.|elderly pregnant",
      "toddler aged",
      "teenager youth",
    ),
    word(
      "youth",
      "the time when someone is young",
      "青年时期；青春",
      "In his {youth}, he was a great runner.|birth funeral | She spent her {youth} in the countryside.|funeral retirement | The town built a new {youth} club for teenagers.|funeral retirement",
      "truth mouth",
      "teenager teenage",
    ),
    word(
      "elderly",
      "old (a polite word)",
      "年长的；上了年纪的",
      "We help an {elderly} neighbor with her shopping.|teenage pregnant | The bus has special seats for {elderly} people.|teenage pregnant | Many {elderly} people live alone.|teenage pregnant",
      "early orderly",
    ),
    word(
      "retirement",
      "the time when you stop working because you are old",
      "退休",
      "My grandfather enjoys his {retirement}; he plays chess every day.|birth youth | She is looking forward to her {retirement} next year.|birth youth | After {retirement}, many people travel.|birth twin",
      "requirement entertainment",
    ),
    word(
      "funeral funerals",
      "a ceremony after someone dies",
      "葬礼",
      "Hundreds of people came to her {funeral}.|birth retirement | The {funeral} will be held on Friday.|youth birth | People usually wear black at {funerals}.|births youths",
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
      "My {twin} brother and I look exactly the same.|elderly adult | They are {twins}, but they have very different personalities.|ancestors adults | I can never tell the {twins} apart.|ancestors adults",
      "pair cousin",
    ),
    word(
      "ancestor ancestors",
      "a person in your family who lived a long time ago",
      "祖先",
      "My {ancestors} came from the south of China.|twins teenagers | During the festival, people remember their {ancestors}.|twins teenagers | One of her {ancestors} was a famous poet.|twins teenagers",
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
});

const family = vocabularyTopic({
  id: "b1-words-family-life",
  title: t("Family Life", "家庭生活"),
  summary: t(
    "Upbringing and households; chores and allowance; siblings, nephews, nieces and grandchildren; spouses, brides and grooms; adopting.",
    "教养和家庭；家务和零花钱；兄弟姐妹、侄子外甥、侄女外甥女和孙辈；配偶、新娘和新郎；收养。",
  ),
  prerequisites: ["a2-words-relatives"],
  words: [
    word(
      "upbringing",
      "the way parents care for a child and teach them how to behave",
      "养育；教养",
      "She had a strict {upbringing}.|allowance chore | His good manners come from his {upbringing}.|allowance household | Parents play the biggest part in a child's {upbringing}.|allowance household",
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
      "Washing the dishes is my least favorite {chore}.|spouse upbringing | We share the {chores} at home.|spouses nieces | I can go out after I've done my {chores}.|spouses nephews",
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
      "Do you have any {siblings}?|spouses households | I'm the oldest of four {siblings}.|spouses brides | {Siblings} often argue, but they usually love each other.|Upbringings Allowances",
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
      "They {adopted} a baby girl from China.|divided supported | My cousin was {adopted} when he was two.|divided supported | We're thinking of {adopting} a dog from the animal shelter.|dividing supporting",
      "adapt adore",
    ),
  ],
});

// Question tags.

/** positives are positive statements with their negative tag and two wrong tags. */
const positives: readonly (readonly [string, string, readonly [string, string]])[] = [
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
const negatives: readonly (readonly [string, string, readonly [string, string]])[] = [
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

const tagChoice = (list: typeof positives): readonly ChoiceItem[] =>
  list.map(([statement, tag, wrong]): ChoiceItem => [`${statement}, ___?`, tag, wrong]);

const tagTyped: readonly TypedItem[] = interleave([positives, negatives]).map(
  ([statement, tag, wrong]): TypedItem => ({
    shown: statement,
    accepted: [`${statement}, ${tag}?`],
    wrong: [`${statement}, ${wrong[0]}?`, `${statement}, ${wrong[1]}?`],
  }),
);

/** tagNote explains in Chinese how the tag is made. */
function tagNote(shown: string): string {
  if (/n't|never/u.test(shown.split(",")[0] ?? "")) return "否定的陈述句（包括含 never 的句子）后面用肯定的反意疑问";
  return "肯定的陈述句后面用否定的反意疑问，助动词和句子保持一致";
}

const questionTags: TopicDef = {
  id: "question-tags",
  title: t("Question Tags", "反意疑问句"),
  summary: t(
    "You're coming, aren't you? She didn't call, did she? A positive sentence takes a negative tag, a negative sentence a positive one, with the helping verb of the sentence.",
    "You're coming, aren't you? She didn't call, did she? 肯定句配否定的反意疑问，否定句配肯定的，助动词跟句子一致。",
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
        "A question tag is a short question at the end of a sentence. You use it to check something or to ask someone to agree. After a **positive** sentence, the tag is **negative**:\n\n- *You're coming, **aren't you**?* (*are* → *aren't*)\n- *She plays tennis, **doesn't she**?* (no helping verb, so use *do / does / did*)\n- *They went home, **didn't they**?*\n- *You can swim, **can't you**?*\n\nThe tag uses the same helping verb as the sentence (*is, are, was, have, can, will, should*...), or *do / does / did* when there is none, and a pronoun for the subject: *Anna* → *she*, *this* → *it*, *those* → *they*.",
        "反意疑问是放在句末的简短问句，用来确认或请对方同意。**肯定**句后面用**否定**的反意疑问：\n\n- *You're coming, **aren't you**?*（*are* → *aren't*）\n- *She plays tennis, **doesn't she**?*（句中没有助动词，用 *do / does / did*）\n- *They went home, **didn't they**?*\n- *You can swim, **can't you**?*\n\n反意疑问用句子里的助动词（*is, are, was, have, can, will, should* 等），没有助动词就用 *do / does / did*；主语换成代词：*Anna* → *she*，*this* → *it*，*those* → *they*。中文一句“对吧？”“是不是？”可以用在所有句子后面，英语却要随句子的动词和主语变化。",
      ),
      choiceGenerator(t("Choose the question tag.", "选出正确的反意疑问。"), tagChoice(positives), (right, shown) =>
        t(fill(shown, right), `${fill(shown, right)}（${tagNote(shown)}）`),
      ),
    ),
    point(
      "negative",
      t("Tags after negative sentences", "否定句后的反意疑问"),
      t(
        "After a **negative** sentence, the tag is **positive**:\n\n- *You aren't angry, **are you**?*\n- *She doesn't eat meat, **does she**?*\n- *They didn't call, **did they**?*\n\nWords such as *never* make a sentence negative too, so the tag is positive: *You never listen to me, **do you**?*",
        "**否定**句后面用**肯定**的反意疑问：\n\n- *You aren't angry, **are you**?*\n- *She doesn't eat meat, **does she**?*\n- *They didn't call, **did they**?*\n\n*never* 这样的词也让句子变成否定，所以反意疑问用肯定：*You never listen to me, **do you**?*",
      ),
      choiceGenerator(t("Choose the question tag.", "选出正确的反意疑问。"), tagChoice(negatives), (right, shown) =>
        t(fill(shown, right), `${fill(shown, right)}（${tagNote(shown)}）`),
      ),
    ),
    point(
      "write",
      t("Adding question tags", "加上反意疑问"),
      t(
        "Write the sentence with a question tag at the end. Put a comma before the tag and a question mark after it: *She plays tennis* → *She plays tennis, doesn't she?*",
        "在句末加上反意疑问，写出整句。反意疑问前加逗号，后面加问号：*She plays tennis* → *She plays tennis, doesn't she?*",
      ),
      typedGenerator(
        "sentence",
        t("Add a question tag and write the whole sentence.", "加上反意疑问，写出整句。"),
        tagTyped,
        (right, shown) => t(right, `${right}（${tagNote(shown)}）`),
      ),
    ),
  ],
};

// Indirect questions.

/** whItems are a direct question, a longer frame with a gap, the words in statement order, and two wrong orders. */
const whItems: readonly (readonly [string, string, string, readonly [string, string]])[] = [
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
const yesNoItems: readonly (readonly [string, string, string, string])[] = [
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

/** indirectNote explains in Chinese the word order of an indirect question. */
function indirectNote(right: string): string {
  if (right.startsWith("if ")) return "一般疑问句放进长句里，用 if 或 whether 引导，后面用陈述句语序";
  return "疑问句放进长句里，疑问词后面用陈述句语序：主语在动词前，也不用 do、does、did";
}

const indirectQuestions: TopicDef = {
  id: "indirect-questions",
  title: t("Do You Know Where...?", "间接疑问句"),
  summary: t(
    "Do you know where the station is? Inside a longer question or sentence, a question takes the order of a statement, without do, does or did; a yes-no question takes if or whether.",
    "Do you know where the station is? 问句放进更长的问句或句子里，要用陈述句语序，不用 do、does、did；一般疑问句用 if 或 whether 引导。",
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
        "To ask politely, you can put a question inside a longer one: *Do you know...?*, *Could you tell me...?* You can also put one inside a sentence: *I wonder...*, *I don't know...*.\n\nThe question inside then takes the order of a **statement**: the subject comes before the verb, and *do, does* and *did* disappear:\n\n- *Where **is the station**?* → *Do you know where **the station is**?*\n- *What time **does the film start**?* → *Can you tell me what time **the film starts**?*\n- *What **did she say**?* → *I didn't hear what **she said**.*\n\nThe question mark goes at the end only if the whole sentence is a question.",
        "礼貌地提问时，可以把一个问题放进更长的问句里：*Do you know...?*、*Could you tell me...?*；也可以放进陈述句里：*I wonder...*、*I don't know...*。\n\n里面的问题要用**陈述句语序**：主语在动词前面，*do、does、did* 去掉：\n\n- *Where **is the station**?* → *Do you know where **the station is**?*\n- *What time **does the film start**?* → *Can you tell me what time **the film starts**?*\n- *What **did she say**?* → *I didn't hear what **she said**.*\n\n中文的问句和陈述句语序一样（“车站在哪儿”），所以很容易说成 *Do you know where is the station?*。整句是问句才用问号。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), whChoice, (right, shown) =>
        t(fill(shown, right), `${fill(shown, right)}（${indirectNote(right)}）`),
      ),
    ),
    point(
      "if",
      t("If or whether for yes-no questions", "一般疑问句用 if 或 whether"),
      t(
        "A question that is answered with *yes* or *no* has no question word, so you add ***if*** or ***whether*** and use the order of a statement:\n\n- *Is the museum open?* → *Do you know **if the museum is open**?*\n- *Did Tom call?* → *I wonder **if Tom called**.*",
        "用 *yes* 或 *no* 回答的问题没有疑问词，所以要加 ***if*** 或 ***whether***，再用陈述句语序：\n\n- *Is the museum open?* → *Do you know **if the museum is open**?*\n- *Did Tom call?* → *I wonder **if Tom called**.*\n\n中文说“你知道博物馆开不开门吗”，英语里不能省掉 if。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), yesNoChoice, (right, shown) =>
        t(fill(shown, right), `${fill(shown, right)}（${indirectNote(right)}）`),
      ),
    ),
    point(
      "write",
      t("Writing indirect questions", "写间接疑问句"),
      t(
        "Put the question into the longer sentence that starts after the arrow. Use the order of a statement, drop *do, does* and *did*, and add *if* or *whether* for a yes-no question. Keep the question mark only when the whole sentence is a question: *Where is the station? → Do you know...* becomes *Do you know where the station is?*",
        "把问题放进箭头后面开头的长句里。用陈述句语序，去掉 *do、does、did*，一般疑问句加 *if* 或 *whether*。只有整句是问句才保留问号：*Where is the station? → Do you know...* 写成 *Do you know where the station is?*",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Put the question into the sentence that begins after the arrow.", "把问题放进箭头后面开头的句子里。"),
        indirectTyped,
        (right) => t(right, `${right}（间接疑问句用陈述句语序）`),
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
      "A letter of advice answers someone who has a problem. It has three parts:\n\n- **Show you understand** the problem and the writer's feelings: *I'm sorry to hear that... It's normal to feel...*\n- **Give two pieces of advice, each with a reason**: *I think you should... because... Why don't you...? If you..., she will...* Begin each one with *First* or *Secondly* so the reader can follow.\n- **End kindly**, with hope or encouragement: *I hope things get better soon. Good luck!*\n\nWrite to the person by name, in a friendly, informal style, and sign your name.",
      "建议信是回复遇到问题的人。它有三部分：\n\n- **表示理解**问题和来信人的感受：*I'm sorry to hear that... It's normal to feel...*\n- **提出两条建议，每条都有理由**：*I think you should... because... Why don't you...? If you..., she will...* 用 *First*、*Secondly* 开头，让读者容易跟上。\n- **友好地结尾**，表达希望或鼓励：*I hope things get better soon. Good luck!*\n\n直接称呼对方的名字，用友好、非正式的语气，最后署名。中文回信常常直接讲道理，英语的建议信先表示理解，建议也要说得委婉，比如用 *Why don't you...?* 而不是 *You must...*。",
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
