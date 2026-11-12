// B1, unit 5: Media and News. The news, media, truth and lies, crime and elections, describing events, communicating
// and opinions; reported speech; writing an article. Its opinion paragraph reuses the native writing topic.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill, judgedTopic } from "../a2/kit.ts";
import { everyPair, vocabularyTopic, word } from "../words.ts";

const news = vocabularyTopic({
  id: "b1-words-news",
  title: t("The News", "新闻"),
  summary: t(
    "Bulletins, newspapers and magazines; articles and headlines; reporters and editors; channels and broadcasts; announcing, publishing and the press.",
    "新闻简报、报纸和杂志；文章和标题；记者和编辑；频道和广播；宣布、出版和新闻界。",
  ),
  prerequisites: ["a2-words-communication"],
  words: [
    word(
      "bulletin bulletins",
      "a short news program on radio or television",
      "新闻简报",
      "I heard about the accident on the six o'clock news {bulletin}.|editor press | The radio has a {bulletin} every hour.|editor headline | There will be more news in our next {bulletin}.|editor reporter",
      "broadcast headline",
    ),
    word(
      "newspaper newspapers",
      "large printed sheets of paper with news, sold every day or every week",
      "报纸",
      "My grandfather reads the {newspaper} every morning.|reporter channel | The story was on the front page of every {newspaper}.|reporter channel | Fewer people buy {newspapers} these days.|reporters channels",
      "magazine article",
    ),
    word(
      "magazine magazines",
      "a thin book with pictures and stories that comes out every week or month",
      "杂志",
      "She reads a fashion {magazine} every month.|reporter channel | I found the recipe in a cooking {magazine}.|reporter channel | There are lots of {magazines} in the waiting room.|reporters channels",
      "newspaper article",
    ),
    word(
      "article articles",
      "a piece of writing in a newspaper, a magazine or on a website",
      "文章",
      "I read an interesting {article} about sleep.|channel editor | She writes {articles} for the school magazine.|channels editors | The {article} says that sugar is bad for your brain.|channel editor",
      "headline magazine",
    ),
    word(
      "headline headlines",
      "the title of a story in a newspaper, in large letters",
      "标题；头条",
      'The {headline} said: "Local Girl Wins Gold".|channel press | The story made {headlines} around the world.|channels editors | I only read the {headlines}, not the whole articles.|channels editors',
      "article bulletin",
    ),
    word(
      "reporter reporters",
      "a person whose job is to find out the news and write or talk about it",
      "记者",
      "A {reporter} asked the mayor some difficult questions.|headline channel | The {reporters} waited outside the hospital.|headlines channels | She works as a sports {reporter} for a local newspaper.|headline channel",
      "editor journalist",
    ),
    word(
      "editor editors",
      "a person who decides what goes into a newspaper, a magazine or a book",
      "编辑",
      "The {editor} decided to put the story on the front page.|headline channel | She's the {editor} of the school magazine.|headline channel | {Editors} check articles before they are published.|Headlines Channels",
      "reporter publisher",
    ),
    word(
      "channel channels",
      "a television station",
      "频道",
      "What's on the other {channel}?|editor headline | This {channel} shows only sport.|editor headline | We get two hundred {channels} on our TV.|editors headlines",
      "program broadcast",
    ),
    word(
      "broadcast broadcasts broadcasting",
      "to send out a program on television or radio; a program sent out in this way",
      "广播；播送",
      "The match will be {broadcast} live tonight.|published announced | The president's speech was {broadcast} on every channel.|published announced | The radio station has been {broadcasting} since 1950.|publishing announcing",
      "publish announce",
    ),
    word(
      "announce announces announced announcing",
      "to tell people something officially",
      "宣布",
      "The school {announced} that it would close for a week.|broadcast published | They {announced} the winner at the end of the show.|broadcast published | The company will {announce} its new phone tomorrow.|broadcast publish",
      "publish broadcast",
    ),
    word(
      "publish publishes published publishing",
      "to print a book, a magazine or a newspaper, or put writing online, for people to read",
      "出版；发表",
      "Her first book was {published} in 2020.|announced broadcast | The newspaper {published} a story about the school.|announced broadcast | The website {publishes} new articles every day.|announces broadcasts",
      "announce broadcast",
    ),
    word(
      "press",
      "newspapers and magazines, and the people who write for them; to push",
      "新闻界；按",
      "The singer refused to talk to the {press}.|channel headline | {Press} the green button to start.|Channel Edit | The story was in the {press} for weeks.|channel editor",
      "media headline",
    ),
  ],
});

const media = vocabularyTopic({
  id: "b1-words-media",
  title: t("Media", "媒体"),
  summary: t(
    "The media, audiences and viewers; programs, series and episodes; documentaries, podcasts and blogs; comments, followers and subscribing.",
    "媒体、观众和收看者；节目、系列和一集；纪录片、播客和博客；评论、关注者和订阅。",
  ),
  prerequisites: ["b1-words-news"],
  words: [
    word(
      "media",
      "television, radio, newspapers and the internet, which give people news and information",
      "媒体",
      "The {media} have reported the story all week.|episode podcast | Social {media} can spread news very fast.|episode blog | She's studying {media} at university.|episode follower",
      "press audience",
    ),
    word(
      "audience audiences",
      "the people who watch or listen to a show, a film or a talk",
      "观众；听众",
      "The {audience} clapped at the end of the play.|episode podcast | The show is popular with young {audiences}.|episodes blogs | There was a big {audience} at the concert.|episode blog",
      "viewer follower",
    ),
    word(
      "viewer viewers",
      "a person who watches television",
      "电视观众",
      "Millions of {viewers} watched the final.|episodes podcasts | The program lost {viewers} after the first season.|episodes blogs | Each {viewer} can vote for their favorite singer.|episode podcast",
      "audience follower",
    ),
    word(
      "program programs",
      "a show on television or radio; a set of instructions for a computer",
      "节目；程序",
      "What's your favorite TV {program}?|viewer follower | There's a good {program} about whales on tonight.|viewer follower | My brother writes computer {programs}.|viewers followers",
      "series episode",
    ),
    word(
      "series",
      "a set of programs about the same people or subject",
      "系列节目；连续剧",
      "I watched the whole {series} in one weekend.|viewer audience | The second {series} starts next month.|viewer follower | This is a {series} about life in the ocean.|viewer follower",
      "episode program",
    ),
    word(
      "episode episodes",
      "one program of a series",
      "一集",
      "I missed last week's {episode}.|viewer audience | Each {episode} lasts forty minutes.|viewer audience | There are ten {episodes} in the first season.|viewers audiences",
      "series program",
    ),
    word(
      "documentary documentaries",
      "a film or a program that gives facts about a real subject",
      "纪录片",
      "We watched a {documentary} about the rainforest.|follower comment | She makes {documentaries} about wildlife.|followers comments | The {documentary} showed how plastic gets into the sea.|follower comment",
      "series program",
    ),
    word(
      "podcast podcasts",
      "a program that you can listen to on the internet",
      "播客",
      "I listen to a science {podcast} on the way to school.|viewer follower | They started a {podcast} about football.|viewer follower | You can download new {podcasts} every week.|viewers followers",
      "blog program",
    ),
    word(
      "blog blogs",
      "a website where someone writes regularly about their life or their interests",
      "博客",
      "She writes a travel {blog}.|viewer audience | I read his {blog} about cooking every week.|viewer audience | Many {blogs} have thousands of readers.|viewers audiences",
      "podcast article",
    ),
    word(
      "comment comments commented commenting",
      "something that you say or write to give an opinion; to say or write an opinion",
      "评论",
      "She left a {comment} under the video.|viewer audience | Lots of people {commented} on his photo.|subscribed followed | Thanks for all your kind {comments}!|viewers audiences",
      "opinion follower",
    ),
    word(
      "follower followers",
      "a person who chooses to see what someone posts online",
      "关注者；粉丝",
      "She has a million {followers} online.|episodes audiences | He lost some {followers} after his rude post.|episodes audiences | Every new {follower} makes me happy.|episode audience",
      "viewer audience",
    ),
    word(
      "subscribe subscribes subscribed subscribing",
      "to pay for or sign up to get a magazine or see a channel regularly",
      "订阅",
      "{Subscribe} to our channel for new videos every week.|Comment Broadcast | My dad {subscribes} to two newspapers.|comments broadcasts | I've {subscribed} to a cooking podcast.|commented broadcast",
      "comment follow",
    ),
  ],
});

const truth = vocabularyTopic({
  id: "b1-words-truth",
  title: t("Truth and Lies", "真相和谎言"),
  summary: t(
    "Opinions, the truth and lies; false stories, rumors and fakes; sources and evidence; trusting; accurate claims; proving.",
    "观点、真相和谎言；虚假的报道、谣言和假货；消息来源和证据；信任；准确的说法；证明。",
  ),
  prerequisites: ["b1-words-news"],
  words: [
    word(
      "opinion opinions",
      "what you think about something",
      "观点；意见",
      "In my {opinion}, the film was too long.|evidence source | Everyone has a different {opinion} about it.|evidence accurate | Can I give my {opinion}?|accurate false",
      "truth claim",
    ),
    word(
      "truth",
      "what is true; the real facts",
      "真相；事实",
      "Please tell me the {truth}. Did you break the window?|opinion rumor | Nobody knows the {truth} about what happened.|opinion fake | There is some {truth} in what he says.|rumor source",
      "lie opinion",
    ),
    word(
      "lie lies lied lying",
      "something you say that you know is not true; to say something that is not true",
      "谎言；说谎",
      "Don't {lie} to me. I know you took it.|trust prove | He told a {lie} about his age.|source evidence | She was {lying} when she said she was ill.|trusting proving",
      "truth rumor",
    ),
    word(
      "false",
      "not true; not real",
      "虚假的；错误的",
      '"The sun goes around the earth." True or {false}?|accurate certain | He gave the police a {false} name.|accurate recent | Many stories online are {false}, so don\'t believe everything you read.|accurate official',
      "fake accurate",
    ),
    word(
      "rumor rumors",
      "a story that people tell, which may not be true",
      "谣言；传闻",
      "There's a {rumor} that our teacher is leaving.|evidence opinion | Don't believe {rumors}. Check the facts.|evidences opinions | The {rumor} spread quickly around the school.|evidence truth",
      "lie truth",
    ),
    word(
      "fake",
      "not real, but made to look real; something that is not real",
      "假的；赝品",
      "This is not a real diamond. It's {fake}.|accurate certain | The photo was a {fake}. Someone changed it on a computer.|truth source | The police found {fake} money in his car.|accurate certain",
      "false accurate",
    ),
    word(
      "source sources",
      "where something comes from, such as a person or a book that gives information",
      "来源；出处",
      "Always check the {source} of a story.|lie favor | Fruit is a good {source} of vitamins.|rumor lie | The reporter didn't name her {sources}.|rumors lies",
      "evidence rumor",
    ),
    word(
      "evidence",
      "facts or things that show that something is true",
      "证据",
      "There is no {evidence} that the man stole the car.|opinion favor | Scientists have found {evidence} of water on Mars.|rumor opinion | The police are looking for {evidence}.|opinion rumor",
      "proof source",
    ),
    word(
      "trust trusts trusted trusting",
      "to believe that someone is honest or that something is true",
      "信任；相信",
      "I {trust} my best friend with all my secrets.|prove claim | Don't {trust} everything you read online.|prove claim | She has always {trusted} her doctor.|proved claimed",
      "believe prove",
    ),
    word(
      "accurate",
      "correct and exact",
      "准确的",
      "Is this information {accurate}?|obvious major | The report gave an {accurate} picture of the problem.|fake false | My watch is very {accurate}.|obvious uncertain",
      "false fake",
    ),
    word(
      "claim claims claimed claiming",
      "to say that something is true, although you cannot show it; something said in this way",
      "声称；说法",
      "He {claims} that he can speak ten languages.|trusts lies | The company {claimed} that its drink was healthy.|trusted lied | There is no evidence for his {claim}.|trust truth",
      "prove lie",
    ),
    word(
      "prove proves proved proving",
      "to show that something is true",
      "证明",
      "Can you {prove} that you were at home?|trust lie | The photos {proved} that he was there.|trusted claimed | Scientists have {proved} that smoking causes cancer.|trusted lied",
      "claim trust",
    ),
  ],
});

const crime = vocabularyTopic({
  id: "b1-words-crime",
  title: t("Crime and Elections", "犯罪和选举"),
  summary: t(
    "Crimes and thieves; stealing, robbing and arresting; victims and witnesses; courts, judges and prisons; elections and voting.",
    "犯罪和小偷；偷窃、抢劫和逮捕；受害者和目击者；法院、法官和监狱；选举和投票。",
  ),
  prerequisites: ["a2-words-neighborhood"],
  words: [
    word(
      "crime crimes",
      "something that is against the law",
      "犯罪；罪行",
      "Stealing is a {crime}.|victim election | {Crime} in the city has fallen this year.|Election Prison | The police are trying to stop {crimes} like this.|elections victims",
      "court prison",
    ),
    word(
      "thief thieves",
      "a person who steals",
      "小偷；贼",
      "A {thief} took my bike while I was in the shop.|judge victim | The {thieves} broke in through the window.|judges victims | The police caught the {thief}.|judge victim",
      "victim witness",
    ),
    word(
      "steal steals stole stolen stealing",
      "to take something that is not yours",
      "偷",
      "Someone {stole} my phone on the bus.|arrested voted | My bike was {stolen} from outside the school.|arrested voted | It's wrong to {steal}.|arrest vote",
      "rob arrest",
    ),
    word(
      "rob robs robbed robbing",
      "to take money or things from a person or a place, often using force",
      "抢劫",
      "Two men {robbed} the bank yesterday.|voted witnessed | He was {robbed} on his way home.|voted judged | They were caught trying to {rob} a shop.|vote judge",
      "steal arrest",
    ),
    word(
      "arrest arrests arrested arresting",
      "(of the police) to take someone away because they may have done a crime",
      "逮捕",
      "The police {arrested} the thief at the station.|voted robbed | He was {arrested} for driving too fast.|voted robbed | The police made three {arrests}.|votes victims",
      "rob steal",
    ),
    word(
      "victim victims",
      "a person who is hurt or has something taken in a crime or an accident",
      "受害者",
      "The {victim} of the robbery was an old man.|judge election | Help for the {victims} of the flood is on its way.|judges elections | He was the {victim} of a scam.|judge election",
      "witness thief",
    ),
    word(
      "witness witnesses",
      "a person who sees a crime or an accident happen",
      "目击者；证人",
      "A {witness} saw the man running away.|prison election | The police are looking for {witnesses} to the accident.|prisons courts | The {witness} told the court what she saw.|prison election",
      "victim judge",
    ),
    word(
      "court courts",
      "the place where a judge decides if someone has done a crime; a place for playing tennis or basketball",
      "法院；球场",
      "The man will appear in {court} next week.|prison election | The {court} decided that he was not guilty.|victim election | We play basketball on the school {court}.|prison victim",
      "prison judge",
    ),
    word(
      "judge judges judged judging",
      "the person who decides in a court how to punish someone; to form an opinion about someone",
      "法官；评判",
      "The {judge} sent him to prison for two years.|victim witness | Don't {judge} people by their clothes.|vote arrest | Three {judges} chose the winner of the competition.|victims witnesses",
      "court witness",
    ),
    word(
      "prison prisons",
      "a building where criminals are kept",
      "监狱",
      "He spent five years in {prison}.|election victim | The thief was sent to {prison}.|election victim | Some {prisons} teach prisoners new skills.|elections victims",
      "court crime",
    ),
    word(
      "election elections",
      "a time when people choose leaders by voting",
      "选举",
      "Who won the {election}?|prison victim | There will be an {election} for class president next week.|prison arrest | {Elections} are held every four years.|Prisons Victims",
      "vote court",
    ),
    word(
      "vote votes voted voting",
      "to choose someone or something by marking a paper or raising your hand",
      "投票；选票",
      "You can {vote} when you are eighteen.|rob arrest | Most students {voted} for a longer lunch break.|robbed arrested | She won by twenty {votes}.|arrests crimes",
      "election judge",
    ),
  ],
});

const events = vocabularyTopic({
  id: "b1-words-describing-events",
  title: t("Describing Events", "描述事件"),
  summary: t(
    "Recent and current events; national, international and official news; shocking, unexpected and sudden events; major and minor; positive and negative.",
    "最近的和当前的事件；全国的、国际的和官方的消息；令人震惊的、出乎意料的和突然的事件；重大的和次要的；正面的和负面的。",
  ),
  prerequisites: ["a2-words-events"],
  words: [
    word(
      "recent",
      "happening a short time ago",
      "最近的",
      "In {recent} years, more people have started working from home.|negative minor | This is a {recent} photo. I took it last week.|national minor | Prices have gone up in {recent} months.|negative official",
      "current sudden",
    ),
    word(
      "current",
      "happening now",
      "当前的；现在的",
      "What is the {current} price of gold?|negative sudden | Our {current} teacher is much stricter than the last one.|sudden shocking | We talked about {current} events in class.|personally strongly",
      "recent modern",
    ),
    word(
      "national",
      "of the whole of a country",
      "全国的；国家的",
      "Today is a {national} holiday, so the schools are closed.|minor sudden | She plays for the {national} team.|minor sudden | The story was on the {national} news.|minor sudden",
      "international official",
    ),
    word(
      "international",
      "between or among many countries",
      "国际的",
      "English is an {international} language.|minor sudden | The {international} airport is an hour from the city.|minor sudden | She works for an {international} company with offices in twenty countries.|minor sudden",
      "national global",
    ),
    word(
      "official",
      "decided by people in power; done by people in power",
      "官方的；正式的",
      "The {official} language of Brazil is Portuguese.|sudden shocking | The results will be {official} tomorrow.|sudden shocking | We got an {official} letter from the school.|sudden minor",
      "national public",
    ),
    word(
      "shocking",
      "very surprising and upsetting",
      "令人震惊的",
      "The news of the accident was {shocking}.|major personally | It's {shocking} how much food we throw away.|official minor | We saw some {shocking} pictures of the flood.|personally totally",
      "unexpected sudden",
    ),
    word(
      "unexpected",
      "surprising, because you did not think it would happen",
      "出乎意料的",
      "We had an {unexpected} visit from my aunt.|personally strongly | The result of the match was completely {unexpected}.|official national | His answer was {unexpected}.|personally strongly",
      "sudden shocking",
    ),
    word(
      "major",
      "very large or important",
      "重大的；主要的",
      "Pollution is a {major} problem. It kills millions of people every year.|minor recent | There was a {major} accident on the motorway.|personally international | Paris is a {major} city.|minor recent",
      "minor main",
    ),
    word(
      "minor",
      "small and not very important",
      "次要的；轻微的",
      "It's only a {minor} injury. He'll be fine.|major national | We made some {minor} changes to the plan.|personally national | There was a {minor} problem with the car.|personally international",
      "major small",
    ),
    word(
      "sudden",
      "happening quickly when you do not expect it",
      "突然的",
      "There was a {sudden} noise behind me.|official national | The storm was very {sudden}.|official national | Her {sudden} decision to leave surprised everyone.|national international",
      "unexpected quick",
    ),
    word(
      "positive",
      "good or useful; hopeful",
      "积极的；正面的",
      "Try to be {positive}. Things will get better.|negative official | The new rules have had a {positive} effect.|personally national | We got lots of {positive} comments about the show.|personally strongly",
      "negative major",
    ),
    word(
      "negative",
      "bad or harmful; not hopeful",
      "消极的；负面的",
      "Too much screen time has a {negative} effect on sleep.|positive official | Don't be so {negative}! It might work.|positive official | She gave him some {negative} feedback.|personally strongly",
      "positive minor",
    ),
  ],
});

const communicating = vocabularyTopic({
  id: "b1-words-communicating",
  title: t("Communicating", "交流"),
  summary: t(
    "Informing, mentioning and expressing; responding and responses; debates; interrupting and whispering; suggesting and suggestions; warning and advising; speeches.",
    "通知、提到和表达；回应和答复；辩论；打断和低声说；建议和提议；警告和劝告；演讲。",
  ),
  prerequisites: ["a2-words-communication"],
  words: [
    word(
      "inform informs informed informing",
      "to tell someone facts, often officially",
      "通知；告知",
      "Please {inform} us if you change your address.|whisper interrupt | We were {informed} that the flight was late.|whispered interrupted | The letter {informs} parents about the school trip.|whispers interrupts",
      "mention warn",
    ),
    word(
      "mention mentions mentioned mentioning",
      "to talk or write about something in a few words",
      "提到",
      "Did she {mention} her new job?|interrupt whisper | He {mentioned} that he was tired.|interrupted debated | Don't {mention} the party. It's a surprise.|interrupt debate",
      "inform express",
    ),
    word(
      "express expresses expressed expressing",
      "to show a feeling or an opinion in words or actions",
      "表达",
      "She {expresses} her feelings through music.|interrupts whispers | It's hard to {express} how happy I am.|interrupt whisper | Many people {expressed} their anger about the decision.|interrupted whispered",
      "mention respond",
    ),
    word(
      "respond responds responded responding",
      "to answer or react",
      "回应；回答",
      "He didn't {respond} to my message.|interrupt whisper | How did she {respond} when you told her?|interrupt mention | The company {responded} to the complaint in a day.|interrupted whispered",
      "response reply",
    ),
    word(
      "response responses",
      "an answer or a reaction",
      "回应；答复",
      "I'm still waiting for a {response} to my email.|debate suggestion | Her {response} was a big smile.|debate suggestion | We got hundreds of {responses} to our survey.|debates suggestions",
      "suggestion answer",
    ),
    word(
      "debate debates",
      "a discussion in which people give different opinions, often in a formal way",
      "辩论",
      "Our class had a {debate} about school uniforms.|response witness | There's a lot of {debate} about the new airport.|response suggestion | She won three {debates} this year.|responses suggestions",
      "discussion response",
    ),
    word(
      "interrupt interrupts interrupted interrupting",
      "to start talking while someone else is talking",
      "打断",
      "Please don't {interrupt} me. Let me finish.|inform advise | Sorry to {interrupt}, but there's a phone call for you.|inform advise | He kept {interrupting} the teacher.|advising responding",
      "whisper respond",
    ),
    word(
      "whisper whispers whispered whispering",
      "to speak very quietly",
      "低声说；耳语",
      '"Don\'t wake the baby," she {whispered}.|informed advised | Stop {whispering} in class!|informing advising | He {whispered} the answer to his friend.|informed advised',
      "interrupt mention",
    ),
    word(
      "suggest suggests suggested suggesting",
      "to give an idea for someone to think about",
      "建议；提议",
      "I {suggest} that we take the train.|whisper interrupt | My friend {suggested} a good restaurant.|whispered interrupted | What do you {suggest}?|interrupt whisper",
      "advise warn",
    ),
    word(
      "suggestion suggestions",
      "an idea that someone gives for others to think about",
      "建议",
      "Can I make a {suggestion}? Let's go to the beach.|debate response | Thanks for your {suggestions}.|debates witnesses | That's a good {suggestion}.|debate witness",
      "advice response",
    ),
    word(
      "warn warns warned warning",
      "to tell someone about a danger",
      "警告",
      "I {warned} you that the ice was thin!|whispered interrupted | The sign {warns} drivers about the sharp bend.|whispers interrupts | They {warned} us not to swim in the river.|whispered interrupted",
      "advise inform",
    ),
    word(
      "advise advises advised advising",
      "to tell someone what you think they should do",
      "劝告；建议",
      "The doctor {advised} me to rest for a week.|whispered interrupted | I'd {advise} you to book early.|whisper interrupt | My teacher {advises} us to read every day.|whispers interrupts",
      "suggest warn",
    ),
    word(
      "speech speeches",
      "a formal talk to a group of people; the ability to speak",
      "演讲；言语",
      "The head teacher gave a {speech} at the start of the year.|mention inform | She was nervous before her {speech}.|interrupt advise | The mayor's {speeches} are always short.|informs advises",
      "speed speak",
    ),
  ],
});

const opinions = vocabularyTopic({
  id: "b1-words-opinions",
  title: t("Opinions", "观点"),
  summary: t(
    "Opposing, favoring and convincing; doubts; certain, uncertain and obvious; personally, definitely, totally, strongly and absolutely.",
    "反对、赞成和说服；怀疑；确定的、不确定的和明显的；就个人而言、肯定地、完全地、强烈地和绝对地。",
  ),
  prerequisites: ["b1-words-truth"],
  words: [
    word(
      "oppose opposes opposed opposing",
      "to disagree with a plan and try to stop it",
      "反对",
      "Many people {oppose} the new road.|convince doubt | The students {opposed} the plan to shorten the holidays.|convinced whispered | She is strongly {opposed} to hunting.|convinced certain",
      "favor convince",
    ),
    word(
      "favor favors",
      "support for a plan or an idea (in favor of); something kind that you do for someone",
      "赞成；帮忙",
      "Are you in {favor} of school uniforms?|doubt certain | Can you do me a {favor} and carry this bag?|doubt certain | Most people voted in {favor} of the plan.|doubt opposition",
      "oppose doubt",
    ),
    word(
      "convince convinces convinced convincing",
      "to make someone believe or do something",
      "说服；使相信",
      "She {convinced} me to try the dish.|opposed doubted | I'm {convinced} that he's telling the truth.|opposed obvious | He tried to {convince} his parents to buy a dog.|oppose doubt",
      "persuade oppose",
    ),
    word(
      "doubt doubts",
      "a feeling of not being sure",
      "怀疑",
      "There's no {doubt} that she is the best player.|favor opinion | I have some {doubts} about his plan.|favors followers | If you're in {doubt}, ask the teacher.|favor opinion",
      "certain favor",
    ),
    word(
      "certain",
      "sure; with no doubt",
      "确定的",
      "Are you {certain} that you locked the door?|obvious personally | I'm {certain} she'll win.|obvious personally | It's {certain} to rain tomorrow.|obvious uncertain",
      "uncertain obvious",
    ),
    word(
      "uncertain",
      "not sure; not decided",
      "不确定的",
      "Nobody knows what will happen. The future of the club is {uncertain}.|obvious certain | I'm {uncertain} about which course to choose.|obvious certain | The date of the concert is still {uncertain}.|obvious certain",
      "certain obvious",
    ),
    word(
      "obvious",
      "easy to see or understand",
      "明显的",
      "It's {obvious} that she likes him.|personally definitely | The answer is {obvious}. Why can't you see it?|uncertain personally | For {obvious} reasons, we can't swim in winter.|uncertain personally",
      "certain clear",
    ),
    word(
      "personally",
      "used to say that you are giving your own opinion",
      "就个人而言",
      "{Personally}, I prefer tea to coffee.|Obvious Certain | I {personally} think the plan is a mistake.|obvious certain | {Personally}, I don't like horror films.|Obvious Certain",
      "strongly definitely",
    ),
    word(
      "definitely",
      "certainly; with no doubt",
      "肯定地；一定",
      'I\'ll {definitely} come to your party.|obvious certain | This is {definitely} the best pizza in town.|obvious certain | "Are you coming?" "{Definitely}!"|Personally Obvious',
      "absolutely certain",
    ),
    word(
      "totally",
      "completely",
      "完全地",
      "I {totally} forgot about the meeting!|obvious certain | The two films are {totally} different.|obvious certain | I {totally} agree with you.|obvious certain",
      "absolutely definitely",
    ),
    word(
      "strongly",
      "very much; in a strong way",
      "强烈地",
      "I {strongly} believe that animals should be free.|obvious certain | She {strongly} disagrees with the new rule.|obvious certain | I {strongly} advise you to take an umbrella.|obvious certain",
      "totally definitely",
    ),
    word(
      "absolutely",
      "completely; used to say yes strongly",
      "绝对地；完全地",
      'The view from the top was {absolutely} beautiful.|obvious certain | "Do you agree?" "{Absolutely}!"|Personally Obvious | You\'re {absolutely} right.|obvious certain',
      "totally definitely",
    ),
  ],
});

// Reported speech.

/** said are reported statements: who spoke, the words said, the report after "that", and the verb in it with two wrong forms. */
const handSaid: readonly (readonly [string, string, string, string, readonly [string, string]])[] = [
  ["Anna", "I am tired", "she was tired", "was", ["am", "been"]],
  ["Tom", "I like my new school", "he liked his new school", "liked", ["like", "liking"]],
  ["Lucy", "I have a headache", "she had a headache", "had", ["have", "having"]],
  ["Mark", "I live in a small town", "he lived in a small town", "lived", ["live", "living"]],
  ["Emma", "I am reading a good book", "she was reading a good book", "was reading", ["am reading", "be reading"]],
  ["Jack", "I don't eat meat", "he didn't eat meat", "didn't", ["don't", "not"]],
  ["Mia", "My brother is ill", "her brother was ill", "was", ["am", "be"]],
  ["Sam", "I want a new phone", "he wanted a new phone", "wanted", ["want", "wanting"]],
  ["Grace", "I am not hungry", "she was not hungry", "was", ["am", "been"]],
  ["Leo", "I am working late", "he was working late", "was working", ["am working", "be working"]],
  ["Ella", "I know the answer", "she knew the answer", "knew", ["know", "knowing"]],
  ["Ben", "My bike is broken", "his bike was broken", "was", ["am", "be"]],
  ["Zoe", "I need some help", "she needed some help", "needed", ["need", "needing"]],
  ["Max", "I feel sick", "he felt sick", "felt", ["feel", "feeling"]],
  ["Amy", "I love my job", "she loved her job", "loved", ["love", "loving"]],
  ["Dan", "I am late for school", "he was late for school", "was", ["am", "been"]],
  ["Kate", "I don't understand the question", "she didn't understand the question", "didn't", ["don't", "not"]],
  ["Paul", "I have two sisters", "he had two sisters", "had", ["have", "having"]],
  ["Lily", "I am studying for an exam", "she was studying for an exam", "was studying", ["am studying", "be studying"]],
  ["Nick", "I play the guitar", "he played the guitar", "played", ["play", "playing"]],
  ["Ruby", "My parents are at work", "her parents were at work", "were", ["was", "be"]],
  ["Tim", "I think it's a good idea", "he thought it was a good idea", "thought", ["think", "thinking"]],
  ["Sara", "I go to the gym every day", "she went to the gym every day", "went", ["go", "going"]],
  ["Alex", "I'm hungry", "he was hungry", "was", ["am", "been"]],
  ["Nina", "I don't like coffee", "she didn't like coffee", "didn't", ["don't", "not"]],
  ["Joe", "My sister plays tennis", "his sister played tennis", "played", ["play", "playing"]],
  ["Eva", "I am waiting for the bus", "she was waiting for the bus", "was waiting", ["am waiting", "be waiting"]],
  ["Ryan", "I have a cold", "he had a cold", "had", ["have", "having"]],
  ["Julia", "I speak three languages", "she spoke three languages", "spoke", ["speak", "speaking"]],
  ["Oscar", "I am very happy", "he was very happy", "was", ["am", "been"]],
  ["Mary", "My computer doesn't work", "her computer didn't work", "didn't", ["don't", "not"]],
  ["Adam", "I enjoy my English lessons", "he enjoyed his English lessons", "enjoyed", ["enjoy", "enjoying"]],
];

/** reporters are more speakers, and whether they are a man. */
const reporters: readonly (readonly [string, boolean])[] = [
  ["Ken", true],
  ["Rosa", false],
  ["Omar", true],
  ["Mei", false],
  ["Hugo", true],
  ["Hana", false],
  ["Ali", true],
  ["Clara", false],
];

/** reportFor puts the pronouns of a man or a woman into a report. */
const reportFor = (report: string, man: boolean) =>
  report
    .split(" ")
    .map((w) => {
      if (w === "he" || w === "she") return man ? "he" : "she";
      if (w === "his" || w === "her") return man ? "his" : "her";
      return w;
    })
    .join(" ");

/** said are the hand-written statements and every statement said again by every other speaker. */
const said: readonly (readonly [string, string, string, string, readonly [string, string]])[] = [
  ...handSaid,
  ...everyPair(handSaid, reporters).map(
    ([[, words, report, verb, wrong], [name, man]]) => [name, words, reportFor(report, man), verb, wrong] as const,
  ),
];

/** quoteOf is the direct speech of a reported statement: "I am tired," Anna said. */
const quoteOf = (name: string, words: string) => `"${words}," ${name} said.`;

const backChoice: readonly ChoiceItem[] = said.map(([name, words, report, verb, wrong]): ChoiceItem => {
  const [first, ...rest] = report.split(" ");
  const gapped = `${first} ${rest.join(" ").replace(verb, "___")}`;
  return [`${quoteOf(name, words)} → ${name} said that ${gapped}.`, verb, wrong];
});

const otherOf: Readonly<Record<string, readonly [string, string]>> = {
  he: ["I", "she"],
  she: ["I", "he"],
  his: ["my", "her"],
  her: ["my", "his"],
};

const pronounChoice: readonly ChoiceItem[] = said.map(([name, words, report]): ChoiceItem => {
  const [first = "", ...rest] = report.split(" ");
  const wrong = otherOf[first];
  if (!wrong) throw new Error(`reported speech: no pronoun in ${report}`);
  return [`${quoteOf(name, words)} → ${name} said that ___ ${rest.join(" ")}.`, first, wrong];
});

const reportTyped: readonly TypedItem[] = said.map(
  ([name, words, report]): TypedItem => ({
    shown: quoteOf(name, words),
    accepted: [`${name} said [that ]${report}.`],
    canonical: `${name} said that ${report}.`,
    wrong: [`${name} said that ${words.replace(/^My /, "my ").replace(/^I'm /, "I am ")}.`],
  }),
);

/** saidOf finds the reported statement that a gapped report or a written report comes from. */
const saidOf = (text: string) =>
  said.find(([name, words]) => text.includes(quoteOf(name, words))) ??
  said.find(([name, , report]) => text === `${name} said that ${report}.`);

/** spokenVerb is the verb of the words as they were said, before it moved back. */
function spokenVerb(words: string, verb: string, wrong: string): string {
  if (verb === "were") return "are";
  if (verb.startsWith("was")) {
    const be = /\bis\b/u.test(words) ? "is" : /I'm/u.test(words) ? "'m" : "am";
    return verb === "was" ? be : verb.replace("was", be);
  }
  if (verb === "didn't") return /doesn't/u.test(words) ? "doesn't" : "don't";
  return wrong;
}

/** backRule names how the verb moved back, for the statement in text. */
function backRule(text: string): Text {
  const item = saidOf(text);
  if (!item) return t("After *said*, the verb moves back in time", "*said* 后面的动词往过去退一步");
  const [, words, , verb, [first]] = item;
  const spoken = spokenVerb(words, verb, first);
  return t(
    `After *said*, the verb moves back in time, so *${spoken}* becomes *${verb}*`,
    `*said* 后面的动词往过去退一步，所以 *${spoken}* 变成 *${verb}*`,
  );
}

/** whyNotBack explains a verb that did not move back, or a form that is not a past. */
const whyNotBack = (wrong: string, right: string, shown: string, position: number): Text => {
  const rule = backRule(shown);
  let first: Text;
  const item = saidOf(shown);
  const spoken = item ? spokenVerb(item[1], item[3], item[4][0]) : wrong;
  if (right === "were" && wrong === "was")
    first = t("*was* is for one person or thing, but the subject is plural.", "*was* 用于单数主语，但这里的主语是复数。");
  else if (position === 0 && wrong === "am" && spoken !== "am" && spoken !== "'m")
    first = t("*am* goes only with *I*, and it is not a past form.", "*am* 只和 *I* 连用，而且不是过去式。");
  else if (position === 0) first = t(`*${wrong}* is the verb as it was said, in the present.`, `*${wrong}* 是原话里的现在时动词。`);
  else if (wrong === "not") first = t("*not* alone has no verb to make the negative.", "只有 *not*，没有构成否定的助动词。");
  else first = t(`*${wrong}* is not a past form.`, `*${wrong}* 不是过去式。`);
  return t(`${first.en} ${rule.en}.`, `${first["zh-CN"]}${rule["zh-CN"]}。`);
};

/** pronounRule names how the speaker's I or my changes, from the right pronoun and the speaker. */
function pronounRule(right: string, shown: string): Text {
  const name = saidOf(shown)?.[0] ?? "";
  const man = right === "he" || right === "his";
  const from = right === "he" || right === "she" ? "I" : "my";
  return t(
    `${name} is ${man ? "a man" : "a woman"}, so the speaker's *${from}* becomes *${right}*`,
    `${name} 是${man ? "男性" : "女性"}，所以说话人的 *${from}* 变成 *${right}*`,
  );
}

/** whyNotPronoun explains a pronoun kept from the speaker's words, or one for the other sex. */
const whyNotPronoun = (wrong: string, right: string, shown: string, position: number): Text => {
  const rule = pronounRule(right, shown);
  const first =
    position === 0
      ? t(`*${wrong}* is the speaker's own word, which changes when you report it.`, `*${wrong}* 是说话人自己的用词，转述时要改变。`)
      : t(
          `*${wrong}* would be about ${/^(he|his)$/u.test(wrong) ? "a man" : "a woman"}.`,
          `*${wrong}* 指的是${/^(he|his)$/u.test(wrong) ? "男性" : "女性"}。`,
        );
  return t(`${first.en} ${rule.en}.`, `${first["zh-CN"]}${rule["zh-CN"]}。`);
};

/** reportWhy explains a written report: the pronoun changes and the verb moves back. */
const reportWhy = (right: string): Text => {
  const item = saidOf(right);
  const back = backRule(right);
  if (!item) return t(`${back.en}: ${right}`, `${back["zh-CN"]}：${right}`);
  const [name, words, report] = item;
  const pronoun = pronounRule(report.split(" ")[0] ?? "", quoteOf(name, words));
  return t(`${pronoun.en}, and ${back.en.replace(/^After/u, "after")}: ${right}`, `${pronoun["zh-CN"]}；${back["zh-CN"]}：${right}`);
};

const reportedSpeech: TopicDef = {
  id: "reported-speech",
  title: t("She Said She Was Tired", "她说她累了（间接引语）"),
  summary: t(
    '"I am tired," she said becomes She said that she was tired: the verb moves back in time, and I and my become she and her.',
    '"I am tired," she said 变成 She said that she was tired：动词往过去退一步，I 和 my 变成 she 和 her。',
  ),
  prerequisites: ["past-simple-irregular", "object-pronouns"],
  encompasses: [{ topic: "past-simple-irregular", weight: 0.2 }],
  xp: 25,
  strand: "grammar",
  knowledgePoints: [
    point(
      "back",
      t("The verb moves back", "动词往过去退一步"),
      t(
        "When you report what someone said with *said*, the verb usually moves back in time:\n\n- *am / is* → *was*, *are* → *were*\n- *like* → *liked*, *go* → *went*, *have* → *had*\n- *don't / doesn't* → *didn't*\n- *am reading* → *was reading*\n\n*\"I am tired,\" Anna said.* → *Anna said that she **was** tired.*\n\nYou can leave out *that*: *Anna said she was tired.*",
        "用 *said* 转述别人的话时，动词通常往过去退一步：\n\n- *am / is* → *was*，*are* → *were*\n- *like* → *liked*，*go* → *went*，*have* → *had*\n- *don't / doesn't* → *didn't*\n- *am reading* → *was reading*\n\n*\"I am tired,\" Anna said.* → *Anna said that she **was** tired.*\n\n*that* 可以省略：*Anna said she was tired.* 中文转述时动词不变（“她说她累了”），英语却要把动词变成过去式。",
      ),
      choiceGenerator(
        t("Choose the words for the gap.", "选出填入空白处的词。"),
        backChoice,
        (right, shown) => {
          const rule = backRule(shown);
          return t(`${rule.en}: ${fill(shown, right)}`, `${rule["zh-CN"]}：${fill(shown, right)}`);
        },
        whyNotBack,
      ),
    ),
    point(
      "pronouns",
      t("I becomes he or she", "I 变成 he 或 she"),
      t(
        "The speaker's *I* and *my* change to fit the person you are talking about: *\"I love my job,\" Amy said.* → *Amy said that **she** loved **her** job.* A man's *I* becomes *he* and his *my* becomes *his*; a woman's become *she* and *her*.",
        '说话人的 *I* 和 *my* 要按所指的人改变：*"I love my job," Amy said.* → *Amy said that **she** loved **her** job.* 男性说的 *I* 变成 *he*，*my* 变成 *his*；女性说的变成 *she* 和 *her*。',
      ),
      choiceGenerator(
        t("Choose the word for the gap.", "选出填入空白处的词。"),
        pronounChoice,
        (right, shown) => {
          const rule = pronounRule(right, shown);
          return t(`${rule.en}: ${fill(shown, right)}`, `${rule["zh-CN"]}：${fill(shown, right)}`);
        },
        whyNotPronoun,
      ),
    ),
    point(
      "write",
      t("Reporting what people said", "转述别人的话"),
      t(
        'Write the report of the words: start with the speaker and *said that*, change *I* and *my*, and move the verb back. *"I have a cold," Ryan said.* → *Ryan said that he had a cold.* You may leave out *that*.',
        '转述这句话：以说话人和 *said that* 开头，改变 *I* 和 *my*，把动词往过去退一步。*"I have a cold," Ryan said.* → *Ryan said that he had a cold.* 可以省略 *that*。',
      ),
      typedGenerator(
        "sentence-pattern",
        t("Report what the person said. Begin with the person's name and said.", "转述这个人说的话，以人名和 said 开头。"),
        reportTyped,
        reportWhy,
      ),
    ),
  ],
};

// Writing an article.

const articleBank: readonly WritingItem[] = [
  {
    task: "Write an article for the school magazine about a place in your town that teenagers should visit.",
    source: "Tell readers what the place is, what you can do there, and why it is good for young people.",
    model:
      "The Best Place You Have Never Been\n\nAre you bored at the weekend? Then let me tell you about the old library on River Street.\n\nFrom the outside, it looks like a boring gray building. Inside, however, it has changed completely. Last year the town turned the top floor into a space for teenagers, with comfortable sofas, board games and three computers for making music and films.\n\nThere is something to do every day. On Mondays there is a chess club, and on Fridays a film club shows a new film and talks about it afterwards. Best of all, everything is free.\n\nI started going in January, and I have made friends from other schools there. It is also a quiet place to do homework when my house is too noisy.\n\nSo next time you have nothing to do, walk down River Street and climb the stairs. You might be surprised.",
  },
  {
    task: 'Write an article for a website for young people: "Can we live without our phones?"',
    source: "Describe what happened when you or someone you know tried to stop using a phone for a week, and say what you learned.",
    model:
      "A Week Without My Phone\n\nHow many times a day do you look at your phone? I used to check mine more than a hundred times. Then my class decided to try a week without phones.\n\nThe first two days were terrible. I kept putting my hand in my pocket, and I felt I was missing everything. I didn't know what my friends were doing, and I had to ask my mom the time.\n\nBy Wednesday, though, something changed. I started reading a book on the bus instead of watching videos. I slept better because I wasn't looking at a screen at midnight. I even talked to my grandfather for an hour.\n\nWhen the week ended, I turned my phone on again, and I hadn't missed anything important at all.\n\nI still use my phone, but now I leave it in the kitchen at night. Why don't you try it too?",
  },
  {
    task: "Write an article for the school magazine about a person who has helped your community.",
    source: "Say who the person is, what they have done, and why you think they are special.",
    model:
      'The Man Who Feeds Our Street\n\nEvery Saturday morning, a long line of people waits outside a small bakery on our street. They are not there to buy bread. They are there to see Mr. Chen.\n\nMr. Chen has run the bakery for thirty years. Five years ago, he noticed that some old people in the area were living alone and not eating well. So he started giving away bread and soup every Saturday to anyone who needed it.\n\nAt first he did it alone. Now more than twenty people help him, including several students from our school. They cook, carry boxes and visit people who can\'t leave their homes.\n\nWhat makes Mr. Chen special is that he never asks for thanks. "Everyone should have a warm meal," he says, smiling.\n\nIf you have a free Saturday, why not go and help him? It is the best way to start a weekend.',
  },
  {
    task: 'Write an article for a website: "The best way to learn a language".',
    source: "Give two or three pieces of advice from your own experience of learning English.",
    model:
      "How I Finally Started Speaking English\n\nI studied English for six years, but I was still afraid to speak it. If you feel the same, here is what helped me.\n\nFirst, I stopped trying to be perfect. I used to think about grammar so much that I said nothing at all. Now I just speak, and if I make a mistake, I try again. People understand me much better than I expected.\n\nSecond, I made English part of my day. I changed the language on my phone, I listen to a podcast on the way to school, and I watch series with English subtitles. It doesn't feel like studying, but I learn new words every day.\n\nFinally, I found someone to talk to. I joined an online club where students from different countries meet once a week.\n\nLearning a language takes time, but it doesn't have to be boring. Start today with one small change.",
  },
  {
    task: "Write an article for the school magazine about a school trip you went on.",
    source: "Describe where you went, what happened, and whether you would recommend the trip to other students.",
    model:
      "Three Days in the Mountains\n\nNo phones, no beds and no hot water: that was our class trip last month. And it was the best trip I have ever been on.\n\nWe took a bus to a camp in the mountains, two hours from the city. We slept in tents and cooked our own food on a fire. On the first night it rained so hard that water came into our tent, and we had to move everything at two in the morning.\n\nThe next day was better. We walked fifteen kilometers to a lake and saw eagles flying above us. In the evening, our teacher showed us the stars, and we learned the names of five of them.\n\nThe trip taught me that I can do more than I thought. I also got to know classmates I had never really talked to before.\n\nIf your class gets the chance to go, say yes. Just remember to bring a good raincoat!",
  },
  {
    task: 'Write an article for a website for teenagers: "Is homework a waste of time?"',
    source: "Give arguments on both sides and say what you think.",
    model:
      "Homework: Help or Headache?\n\nIt is ten o'clock at night, and you are still doing math. Sound familiar? Many students say homework is a waste of time. But is it?\n\nOn the one hand, homework can be useful. It gives us a chance to practice what we learned in class, and it teaches us to organize our time. Some studies show that a little homework helps older students do better in exams.\n\nOn the other hand, too much homework can cause stress and leave no time for sport, hobbies or family. When I have three hours of homework, I often feel too tired to learn anything.\n\nIn my opinion, the answer is not to stop homework but to give less of it. Thirty minutes of useful practice is better than three hours of copying.\n\nWhat do you think? Write to us and tell us how much homework you get.",
  },
  {
    task: "Write an article for the school magazine about a hobby you love.",
    source: "Explain what the hobby is, how you started, and why other students might enjoy it.",
    model:
      "Why I Love Rock Climbing\n\nThe first time I went rock climbing, I was so scared that I stopped halfway up the wall. Two years later, it is my favorite thing in the world.\n\nI started when my cousin took me to an indoor climbing center for my birthday. You wear a harness and a rope, so it is much safer than it looks. Each wall has routes of different colors, from easy to very hard.\n\nClimbing is good for your body, because it uses almost every muscle. But it is also good for your mind. When you are on the wall, you can't think about anything else, so you forget your problems for a while.\n\nThe best thing, though, is the people. Climbers help each other and cheer when someone reaches the top.\n\nThe climbing center in our town has a student price on Wednesdays. Come and try it. I'll be the one at the top!",
  },
  {
    task: 'Write an article for a website: "How to have a greener school".',
    source: "Suggest two or three ideas that students could start at your school, and say why they would work.",
    model:
      "Five Minutes to a Greener School\n\nOur school throws away about two hundred plastic bottles every day. That is a thousand a week. We can do better, and it doesn't have to be hard.\n\nThe first idea is simple: bring your own bottle. If the school puts water fountains in every building, nobody will need to buy plastic bottles. Our class tried it for a month and saved more than five hundred bottles.\n\nSecond, let's start a compost bin for food waste from the canteen. The compost can then be used in the school garden to grow vegetables.\n\nFinally, the last person to leave a classroom should turn off the lights and the computers. It takes five seconds, and it saves electricity every day.\n\nNone of these ideas costs much money. All they need is students who care. Talk to your class tomorrow and choose one to start with.",
  },
  {
    task: "Write an article for the school magazine about a film or a series that everyone should watch.",
    source: "Say what it is about without telling the ending, what is good about it, and who would enjoy it.",
    model:
      "The Series I Can't Stop Thinking About\n\nIf you only watch one series this year, make it Ocean Planet.\n\nIt is a documentary series in eight episodes about life in the sea. Each episode visits a different ocean, from the ice of the Arctic to the coral reefs of Australia. The pictures are absolutely beautiful, and some of the animals I had never seen before, like a fish that makes its own light.\n\nWhat I liked most was that the series is not only about beautiful places. It also shows how plastic and warm water are harming the ocean, and what people are doing to protect it. The episode about a team rescuing turtles nearly made me cry.\n\nThe series is great for anyone who likes nature, but you don't need to be a science fan to enjoy it. My little brother, who is eight, watched every episode with me.\n\nGrab some snacks and press play. You won't be sorry.",
  },
  {
    task: 'Write an article for a website: "The day that changed my life".',
    source: "Tell the story of an important day in your life and explain why it was important.",
    model:
      "The Day I Joined the Team\n\nTwo years ago, I was the quietest student in my class. I hardly spoke to anyone, and I spent lunch breaks alone in the library. Then, one September afternoon, everything changed.\n\nOur PE teacher needed one more player for the school basketball team. Nobody wanted to join, so she looked at me. I said no three times, but she didn't give up. In the end, I agreed to try one practice.\n\nI was terrible. I dropped the ball, and I fell over twice. But the other players didn't laugh. Instead, they showed me how to pass and invited me to practice with them on Saturday.\n\nSince that day, I have played in twenty matches, and my teammates are now my best friends. More importantly, I learned that being brave is not about not being afraid. It is about saying yes anyway.\n\nIs there something you are afraid to try? Maybe today is your day.",
  },
  {
    task: "Write an article for the school magazine about healthy eating for students.",
    source: "Explain why breakfast and healthy snacks matter, and give some easy ideas.",
    model:
      "Feeding Your Brain\n\nDo you often feel tired in the middle of the morning? Your breakfast, or the lack of it, might be the reason.\n\nMany students skip breakfast because they get up late. But after a whole night without food, your brain needs energy to work well. Studies show that students who eat breakfast remember more in class and feel less stressed.\n\nBreakfast doesn't have to take long. A banana and a glass of milk takes two minutes. If you have a little more time, try eggs on brown toast or a bowl of oats with fruit.\n\nSnacks matter too. Instead of chips and sweets, which give you energy for a short time and then make you tired, take some nuts, an apple or a yogurt to school.\n\nSmall changes can make a big difference. Try a healthy breakfast every day for a week and see how you feel.",
  },
  {
    task: 'Write an article for a website for young people: "Should every teenager have a part-time job?"',
    source: "Give your opinion with reasons and examples, and end with a message for readers.",
    model:
      "Working While You Study\n\nLast summer I got my first job, washing dishes in a café. It was hot, tiring and not very well paid, but it taught me more than any lesson at school.\n\nI think every teenager should try a part-time job if they can. Firstly, you learn the value of money. When you have worked four hours to earn something, you think carefully before you spend it.\n\nSecondly, a job teaches skills that you can't learn from books. I learned to be on time, to work in a team and to stay polite when customers were rude.\n\nOf course, school must come first. A job of more than ten hours a week can leave you too tired to study. That is why I only work on Saturdays.\n\nIf you are thinking about getting a job, start small. Ask at local shops, or offer to help neighbors with their gardens. You might enjoy it more than you expect.",
  },
];

const writingAnArticle = judgedTopic({
  id: "writing-an-article",
  title: t("Writing an Article", "写文章"),
  summary: t(
    "Write an article of 150 to 200 words for a school magazine or website, with a title, an opening that catches the reader, two or three paragraphs and an ending for the reader.",
    "为校刊或网站写一篇 150 到 200 词的文章：有标题，开头能吸引读者，有两三个段落，结尾面向读者。",
  ),
  prerequisites: ["writing-a-paragraph"],
  encompasses: [{ topic: "writing-a-paragraph", weight: 0.3 }],
  criteria: ["b1-article-title-and-opening", "b1-article-paragraphs", "b1-article-reader"],
  point: {
    id: "article",
    title: t("Title, opening and paragraphs", "标题、开头和段落"),
    explanation: t(
      "An article is written for readers who can stop reading at any time, so it must keep them interested:\n\n- **A title** that says what the article is about or makes the reader curious: *A Week Without My Phone*.\n- **An opening** that catches the reader: a question (*Are you bored at the weekend?*), a surprising fact or a short scene.\n- **Two or three paragraphs**, each about one main idea, joined with words such as *first*, *however* and *finally*.\n- **An ending** that speaks to the reader: advice, a question or an invitation (*Why don't you try it too?*).\n\nWrite in a lively but correct style, and talk to the reader as *you*.",
      "文章的读者随时可能停止阅读，所以要让他们一直有兴趣：\n\n- **标题**：说明文章写什么，或者让读者好奇：*A Week Without My Phone*。\n- **开头**要吸引读者：一个问题（*Are you bored at the weekend?*）、一个出人意料的事实或一个小场景。\n- **两三个段落**，每段写一个主要意思，用 *first*、*however*、*finally* 等词连接。\n- **结尾**要面向读者：提建议、提问题或发出邀请（*Why don't you try it too?*）。\n\n文风可以生动，但要正确，用 *you* 直接对读者说话。中文作文常先铺陈背景，英语文章则第一句就要抓住读者。",
    ),
  },
  question: t(
    "Read the task. Write an article of 150 to 200 words in English, with a title, an opening that catches the reader, two or three paragraphs and an ending for the reader.",
    "阅读任务，用英语写一篇 150 到 200 词的文章：有标题，开头吸引读者，有两三个段落，结尾面向读者。",
  ),
  bank: articleBank,
  limits: { minWords: 120, maxChars: 1800 },
  what: t("article", "文章"),
});

/** topics are the topics of the unit Media and News. */
export const topics: readonly TopicDef[] = [
  news.topic,
  media.topic,
  truth.topic,
  crime.topic,
  events.topic,
  communicating.topic,
  opinions.topic,
  reportedSpeech,
  writingAnArticle,
];

/** vocabulary are the words the unit Media and News teaches. */
export const vocabulary: readonly WordBatch[] = [
  news.batch,
  media.batch,
  truth.batch,
  crime.batch,
  events.batch,
  communicating.batch,
  opinions.batch,
];
