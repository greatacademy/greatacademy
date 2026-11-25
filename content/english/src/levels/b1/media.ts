// B1, unit 5: Media and News. The news, media, truth and lies, crime and elections, describing events, communicating
// and opinions; reported speech; writing an article. Its opinion paragraph reuses the native writing topic.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill, judgedTopic } from "../a2/kit.ts";
import { everyPair, vocabularyTopic, word } from "../words.ts";
import { reportedSpeechWriteNot } from "./mistakes.ts";

const news = vocabularyTopic({
  id: "b1-words-news",
  title: t("The News", "新闻"),
  summary: t(
    "Bulletins, newspapers and magazines; articles and headlines; reporters and editors; channels and broadcasts; announcing, publishing and the press.",
    "新闻简报、报纸和杂志；文章和标题；记者和编辑；频道和广播；宣布、出版和新闻界。",
  ),
  intro: t(
    "A **reporter** wrote the **article**, its **headline** was on the front page of every **newspaper**, and the TV news **bulletin** **announced** it on every **channel**. These words help you follow and talk about the news.",
    "一位 **reporter**（记者）写了这篇 **article**（文章），它的 **headline**（标题）登上了每份 **newspaper**（报纸）的头版，电视新闻 **bulletin**（简报）也在每个 **channel**（频道）上 **announced**（宣布）了这件事。这些词帮你关注和谈论新闻。",
  ),
  prerequisites: ["a2-words-communication"],
  words: [
    word(
      "bulletin bulletins",
      "a short news program on radio or television",
      "新闻简报",
      "I heard about the accident on the six o'clock news {bulletin} on the radio.|headline article | The radio station has a short news {bulletin} every hour. | There will be more news in our next {bulletin}, at nine o'clock on this channel.",
      "headline article",
    ),
    word(
      "newspaper newspapers",
      "large printed sheets of paper with news, sold every day or every week",
      "报纸",
      "My grandfather reads the printed {newspaper}, full of today's news, every morning. | The story was on the front page of every daily {newspaper}. | Fewer people buy printed daily {newspapers} these days.|magazines websites",
      "magazine website",
    ),
    word(
      "magazine magazines",
      "a thin book with pictures and stories that comes out every week or month",
      "杂志",
      "She reads a fashion {magazine} every month. | I found the recipe in a cooking {magazine} with lots of photos, which comes out every month. | There are old monthly {magazines} with photos in the waiting room.|newspapers novels",
      "newspaper novel",
    ),
    word(
      "article articles",
      "a piece of writing in a newspaper, a magazine or on a website",
      "文章",
      "I read the whole {article} about sleep, all three pages of it. | She writes long {articles} for the school magazine.|headlines bulletins | The {article}, in its third paragraph, says that sugar is bad for your brain.",
      "headline bulletin",
    ),
    word(
      "headline headlines",
      "the title of a story in a newspaper, in large letters",
      "标题；头条",
      'The {headline} in big letters at the top said: "Local Girl Wins Gold". | The story made {headlines} around the world.|articles chapters | I only read the {headlines}, not the whole articles.|articles chapters',
      "article chapter",
    ),
    word(
      "reporter reporters",
      "a person whose job is to find out the news and write or talk about it",
      "记者",
      "Our {reporter} went out to the street and asked the mayor questions for the news. | The {reporters} waited outside the hospital to get the news.|editors viewers | She works as a sports {reporter}, going to matches and writing about them.",
      "editor viewer",
    ),
    word(
      "editor editors",
      "a person who decides what goes into a newspaper, a magazine or a book",
      "编辑",
      "The {editor} decided to put the story on the front page. | She's the {editor} of the school magazine and chooses every story in it. | {Editors} check and correct articles before they are published.|reporters viewers",
      "reporter viewer",
    ),
    word(
      "channel channels",
      "a television station",
      "频道",
      "What's on the other {channel}? Let's change to it with the remote. | This {channel} shows only sport, all day and all night. | We can choose from two hundred TV {channels}, each with its own number.|programs bulletins",
      "program bulletin",
    ),
    word(
      "broadcast broadcasts broadcasting",
      "to send out a program on television or radio; a program sent out in this way",
      "广播；播送",
      "The match will be {broadcast} live on TV tonight.|published printed | The president's speech was {broadcast} on every channel.|published printed | The radio station has been {broadcasting} since 1950.|publishing printing",
      "publish print",
    ),
    word(
      "announce announces announced announcing",
      "to tell people something officially",
      "宣布",
      "The head teacher {announced} to everyone in the hall that the school would close for a week.|published whispered | They {announced} the winner to the whole audience at the end of the show.|published whispered | The company will {announce} its new phone to the world tomorrow.",
      "publish whisper",
    ),
    word(
      "publish publishes published publishing",
      "to print a book, a magazine or a newspaper, or put writing online, for people to read",
      "出版；发表",
      "Her first book was {published} in 2020, and it's in every bookshop.|announced broadcast | The newspaper {published} a story about the school on page three.|announced broadcast | The website {publishes} new articles every day.|announces broadcasts",
      "announce broadcast",
    ),
    word(
      "press",
      "newspapers and magazines, and the people who write for them; to push",
      "新闻界；按",
      "The singer refused to talk to the {press}, the reporters from the newspapers. | {Press} the green button down with your finger to start.|kick wash | The story was in the {press}, in every newspaper, for weeks.",
      "crowd audience",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Publish* and *broadcast* both send news out to people, but you *publish* writing in print or online, and you *broadcast* a program on TV or radio. Look for paper and websites, or for TV and radio.",
        "*publish* 和 *broadcast* 都是把新闻传给大家，但 *publish* 是印刷或在网上发表文字，*broadcast* 是在电视或广播里播出节目。留意句中是纸和网站，还是电视和广播。",
      ),
      meaning: t(
        "*Reporter* and *editor* both work on the news, but a *reporter* goes out to find the story and write it, and an *editor* decides what goes in and checks it. Check whether the meaning finds the news or chooses it.",
        "*reporter* 和 *editor* 都做新闻工作，但 *reporter* 出去找新闻、写新闻，*editor* 决定登什么并负责把关。看清释义说的是找新闻，还是挑选新闻。",
      ),
      spell: t(
        "*Broadcast* stays the same in the past: *broadcast*, not *broadcasted*; *bulletin* ends in -in, not -en.",
        "*broadcast* 的过去式不变：*broadcast*，不是 *broadcasted*；*bulletin* 以 -in 结尾，不是 -en。",
      ),
    },
    notes: `
      bulletin|the six o'clock news on the radio;short news every hour on a radio station;more news at nine on this channel|a bulletin is a short news program; a headline is the title of a printed story|bulletin 是新闻简报；headline 是标题|headline/headlines=a headline is the title of a printed story, not a program you hear=headline 是印出来的新闻标题，不是听的节目;article/articles=an article is a piece of writing, not a program on radio or TV=article 是一篇文字，不是广播电视节目|a news bulletin · the six o'clock bulletin|also a short printed notice: a school bulletin|也指印出来的简短通告：a school bulletin
      newspaper|today's news printed every morning;the front page of every daily one;printed daily news fewer people buy|a newspaper comes out every day with the news; a magazine comes out every week or month|newspaper 是报纸；magazine 是杂志|magazine/magazines=a magazine comes out every week or month with pictures, not every day with the news=magazine 每周或每月出一期，不是每天的新闻;website/websites=a website is on the internet, not printed on paper=website 在网上，不是印在纸上|a daily newspaper · read the newspaper|news + paper, one word|news 加 paper，写成一个词
      magazine|fashion every month;recipes with photos every month;old monthly ones in a waiting room|a magazine is a thin book with pictures, often monthly; a novel is a long story|magazine 是杂志；novel 是小说|newspaper/newspapers=a newspaper comes out every day with the news, not every month with photos=newspaper 每天出新闻，不是每月一期带照片的;novel/novels=a novel is a long story in a book, not a thin book with pictures every month=novel 是长篇小说，不是每月出的薄画册|a fashion magazine · a monthly magazine|stress at the end: *ma-ga-ZINE*|重音在最后：*ma-ga-ZINE*
      article|three pages about sleep;long writing for the school magazine;a third paragraph about sugar|an article is a piece of writing; a headline is only its title|article 是文章；headline 是标题|headline/headlines=a headline is only the title in big letters, not pages of writing=headline 只是大字标题，不是几页文字;bulletin/bulletins=a bulletin is a short news program you hear, not writing you read=bulletin 是听的新闻简报，不是读的文字|write an article · a newspaper article|in grammar, *a* and *the* are also called articles|语法里 *a* 和 *the* 也叫 article（冠词）
      headline|big letters at the top;stories known around the world;titles read instead of whole articles|a headline is the title in large letters; an article is the whole piece|headline 是标题；article 是文章|article/articles=an article is the whole piece of writing, not just the title in big letters=article 是整篇文字，不只是大字标题;chapter/chapters=a chapter is part of a book, not the title of a news story=chapter 是书的一章，不是新闻标题|make headlines · a front-page headline|head + line, one word|head 加 line，写成一个词
      reporter|someone asking the mayor questions in the street;people waiting outside a hospital for news;someone going to matches and writing about them|a reporter goes out to find news; an editor decides what goes in|reporter 是记者；editor 是编辑|editor/editors=an editor stays in the office and decides what goes in, and does not go out to find the news=editor 在办公室决定登什么，不出去找新闻;viewer/viewers=a viewer watches the news on TV and does not find it out=viewer 是看新闻的观众，不去采访新闻|a news reporter · a sports reporter|verb *report*|动词 *report*
      editor|someone who decided on the front page;someone who chooses every story in a magazine;people who check and correct articles|an editor decides and checks what goes in; a reporter writes stories|editor 是编辑；reporter 是记者|reporter/reporters/Reporters=a reporter finds the news and writes it, but does not choose what goes in or correct others' work=reporter 找新闻写新闻，但不决定登什么，也不改别人的稿;viewer/viewers/Viewers=a viewer watches TV and does not decide what goes in a magazine=viewer 是看电视的人，不决定杂志登什么|the editor of · a newspaper editor|verb *edit*|动词 *edit*
      channel|something you change to with the remote;sport all day and all night;two hundred with their own numbers|a channel is a TV station; a program is one show|channel 是频道；program 是节目|program/programs=a program is one show, not a station that shows them all day=program 是一个节目，不是全天播放的电视台;bulletin/bulletins=a bulletin is one short news program, not a station you change to=bulletin 是一段简短新闻，不是可以换过去的频道|change the channel · a sports channel|*channel* also means a narrow sea: the English Channel|*channel* 也指海峡：the English Channel
      broadcast|a match live on TV;a speech on every channel;a radio station since 1950|to broadcast is to send out on TV or radio; to publish is to print or put online|broadcast 是播出；publish 是出版|publish/published/publishing=to publish is to print or put writing online, not to send out a program on TV or radio=publish 是印刷或在网上发表文字，不是在电视广播里播出;print/printed/printing=to print is to put words on paper, not on TV or radio=print 是印在纸上，不是在电视或广播里|broadcast live · a live broadcast|past is *broadcast*|过去式是 *broadcast*
      announce|news told to everyone in the hall;a winner told to the whole audience;a new phone shown to the world|to announce is to tell people officially; to whisper is to speak quietly|announce 是宣布；whisper 是低声说|publish/published=to publish is to print a book or writing, not to tell everyone news out loud=publish 是出版文字，不是当众宣布消息;whisper/whispered=to whisper is to speak very quietly to one person, not to tell everyone officially=whisper 是对一个人低声说，不是正式告诉大家|announce the winner · announce that|noun *announcement*|名词 *announcement*
      publish|a book in every bookshop;a story on page three of a newspaper;new articles on a website|to publish is to print or put writing online; to announce is to tell people news|publish 是出版、发表；announce 是宣布|announce/announced/announces=to announce is to tell people news, not to print a book or writing=announce 是宣布消息，不是印刷书或文字;broadcast/broadcasts=to broadcast is to send out on TV or radio, not to print a book or a newspaper story=broadcast 是在电视广播里播出，不是印刷书报|publish a book · be published|a company that publishes books is a *publisher*|出版书的公司叫 *publisher*
      press|reporters from the newspapers;a green button pushed with a finger;every newspaper for weeks|the press is newspapers and reporters; a crowd is many people in one place|press 是新闻界、按；crowd 是人群|crowd/crowds=a crowd is many people in one place, not newspapers or reporters=crowd 是一群人，不是报纸或记者;audience=an audience watches a show and does not write the news=audience 是看演出的人，不写新闻;kick/Kick=you kick with your foot, not push a button with your finger=kick 是用脚踢，不是用手指按按钮;wash/Wash=washing makes something clean and does not start a machine=wash 是洗干净，不能启动机器|the press · press the button|*the press* always has *the*|*the press* 总带 *the*
    `,
  },
});

const media = vocabularyTopic({
  id: "b1-words-media",
  title: t("Media", "媒体"),
  summary: t(
    "The media, audiences and viewers; programs, series and episodes; documentaries, podcasts and blogs; comments, followers and subscribing.",
    "媒体、观众和收看者；节目、系列和一集；纪录片、播客和博客；评论、关注者和订阅。",
  ),
  intro: t(
    "**Viewers** at home and **followers** online can watch every **episode** of a **series**, listen to a **podcast** or leave a **comment** on a **blog**. These words help you talk about the shows you watch and the media you use.",
    "在家的 **viewers**（观众）和网上的 **followers**（关注者）可以看 **series**（系列节目）的每一 **episode**（集），听 **podcast**（播客），或在 **blog**（博客）下面留 **comment**（评论）。这些词帮你谈论你看的节目和用的媒体。",
  ),
  prerequisites: ["b1-words-news"],
  words: [
    word(
      "media",
      "television, radio, newspapers and the internet, which give people news and information",
      "媒体",
      "The {media} have reported the story all week. | Social {media}, like apps and websites, can spread news very fast. | She's studying {media}, like TV and newspapers, at university.",
      "audience crowd",
    ),
    word(
      "audience audiences",
      "the people who watch or listen to a show, a film or a talk",
      "观众；听众",
      "The {audience} clapped at the end of the play. | The play is popular with young {audiences} in theaters.|viewers followers | There was a big {audience} at the concert.",
      "viewer follower",
    ),
    word(
      "viewer viewers",
      "a person who watches television",
      "电视观众",
      "Millions of TV {viewers} at home watched the final.|audiences followers | The TV program lost {viewers} who stopped watching it after the first season.|audiences followers | Each {viewer} watching at home can vote for their favorite singer by phone.",
      "audience follower",
    ),
    word(
      "program programs",
      "a show on television or radio; a set of instructions for a computer",
      "节目；程序",
      "What's your favorite TV {program}, the one show you never miss? | There's a good {program} about whales on TV tonight. | My brother writes computer {programs}.|channels podcasts",
      "channel podcast",
    ),
    word(
      "series",
      "a set of programs about the same people or subject",
      "系列节目；连续剧",
      "I watched the whole {series}, all ten episodes, in one weekend. | The second {series} of the show, with eight new episodes, starts next month. | This {series} of six programs is about life in the ocean.",
      "episode channel",
    ),
    word(
      "episode episodes",
      "one program of a series",
      "一集",
      "I missed last week's {episode}, so I don't know what happened in that one show. | Each {episode} lasts forty minutes. | There are ten {episodes} in the first season.|series channels",
      "series channel",
    ),
    word(
      "documentary documentaries",
      "a film or a program that gives facts about a real subject",
      "纪录片",
      "We watched a {documentary} with real facts about the rainforest. | She makes {documentaries} that show real wild animals and the facts about them.|comedies dramas | The {documentary} showed, with real facts, how plastic gets into the sea.",
      "comedy drama",
    ),
    word(
      "podcast podcasts",
      "a program that you can listen to on the internet",
      "播客",
      "I listen to a science {podcast} on my phone on the way to school. | They started a {podcast} about football that people listen to online. | You can download new {podcasts} to listen to every week.|blogs magazines",
      "blog magazine",
    ),
    word(
      "blog blogs",
      "a website where someone writes regularly about their life or their interests",
      "博客",
      "She writes a travel {blog} and puts a new post on her website every week. | I read his {blog} about cooking every week. | Many {blogs} on the internet have thousands of readers.|podcasts novels",
      "podcast novel",
    ),
    word(
      "comment comments commented commenting",
      "something that you say or write to give an opinion; to say or write an opinion",
      "评论",
      "She left a {comment} under the video. | Lots of people {commented} on his photo, writing what they thought.|voted clicked | Thanks for all your kind {comments}!|followers viewers",
      "follower viewer",
    ),
    word(
      "follower followers",
      "a person who chooses to see what someone posts online",
      "关注者；粉丝",
      "She has a million {followers} who see her posts online.|viewers guests | He lost some {followers}, who stopped seeing his posts, after his rude post.|viewers guests | Every new {follower} of my account makes me happy.",
      "viewer guest",
    ),
    word(
      "subscribe subscribes subscribed subscribing",
      "to pay for or sign up to get a magazine or see a channel regularly",
      "订阅",
      "{Subscribe} to our channel to get new videos every week. | My dad {subscribes} to two newspapers and pays for them every month.|listens writes | I've {subscribed} to a cooking podcast, so new episodes come to me every week.|listened written",
      "listen write",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Audience* and *viewer* both watch, but an *audience* is a whole group, often in one place, and a *viewer* is one person watching TV. Look for a theater or a concert, or for TV at home.",
        "*audience* 和 *viewer* 都在观看，但 *audience* 是一群人，常在同一个地方，*viewer* 是看电视的一个人。留意句中是剧院、音乐会，还是在家看电视。",
      ),
      meaning: t(
        "*Series* and *episode* go together, but a *series* is the whole set of programs, and an *episode* is one program in it. Check whether the meaning is the whole set or one part.",
        "*series* 和 *episode* 常一起出现，但 *series* 是整套节目，*episode* 是其中一集。看清释义说的是一整套，还是其中一集。",
      ),
      spell: t(
        "*Series* is the same for one and for more than one: one *series*, two *series*; *documentary* ends in -ary.",
        "*series* 单复数同形：one *series*，two *series*；*documentary* 以 -ary 结尾。",
      ),
    },
    notes: `
      media|a story reported all week;apps and websites that spread news;TV and newspapers studied at university|the media are TV, radio, newspapers and the internet; an audience is the people watching|media 是媒体；audience 是观众|audience=an audience is the people watching, not TV, radio and newspapers=audience 是观看的人，不是电视、广播和报纸;crowd=a crowd is many people in one place, not TV, newspapers and the internet=crowd 是一群人，不是电视、报纸和网络|social media · the media|*media* is the plural of *medium*|*media* 是 *medium* 的复数
      audience|people clapping at the end of a play;young people in theaters;a big group at a concert|an audience is the whole group watching; a viewer is one person at home|audience 是全体观众；viewer 是电视观众|viewer/viewers=a viewer is one person watching TV at home, not all the people at a play or concert=viewer 是在家看电视的一个人，不是剧院或音乐会的全体观众;follower/followers=a follower sees someone's posts online, not people watching a play or concert=follower 是网上看帖子的人，不是看演出的人|a big audience · the audience clapped|one group, so *the audience* can be *is* or *are*|是一个群体，*the audience* 后面可用 *is* 或 *are*
      viewer|millions watching a final at home;people who stopped watching a program;someone voting by phone at home|a viewer is one person watching TV; an audience is a group|viewer 是电视观众；audience 是一群观众|audience/audiences=an audience is a whole group, often in one room, not one person watching TV at home=audience 是一群人，常在一个地方，不是在家看电视的一个人;follower/followers=a follower sees someone's posts online, not a person watching TV=follower 是网上看帖子的人，不是看电视的人|TV viewers · millions of viewers|verb *view*: to watch|动词 *view*：观看
      program|the one show you never miss;a show about whales tonight;instructions written for computers|a program is one show or computer instructions; a channel is a TV station|program 是节目、程序；channel 是频道|channel/channels=a channel is a TV station that shows many programs, not one show or a set of computer instructions=channel 是播很多节目的电视台，不是一个节目或电脑程序;podcast/podcasts=a podcast is something you listen to on the internet, not a TV show or computer instructions=podcast 是网上听的节目，不是电视节目或电脑程序|a TV program · a computer program|British *programme* for TV, *program* for computers|英式拼写电视节目是 *programme*，电脑程序是 *program*
      series|all ten episodes in a weekend;eight new episodes next month;six programs about the ocean|a series is a set of programs; an episode is one of them|series 是系列节目；episode 是一集|episode=an episode is one program, not a set of many=episode 是一集，不是很多集;channel=a channel is a TV station, not a set of programs about the same story=channel 是电视台，不是同一题材的一套节目|a TV series · the second series|same for one and more than one|单复数同形
      episode|that one show I missed;forty minutes each;ten in the first season|an episode is one program of a series; a series is the whole set|episode 是一集；series 是整套节目|series=a series is a whole set of programs, not one program of forty minutes=series 是整套节目，不是四十分钟的一集;channel/channels=a channel is a TV station, not one program of a series=channel 是电视台，不是一集|the last episode · an episode of|*episode* can also mean one event in your life|*episode* 也可指人生中的一段经历
      documentary|real facts about the rainforest;real wild animals and facts;real facts about plastic in the sea|a documentary shows real facts; a comedy is a funny made-up story|documentary 是纪录片；comedy 是喜剧|comedy/comedies=a comedy is a funny made-up story, not a film of real facts=comedy 是虚构的搞笑故事，不是讲真实事实的片子;drama/dramas=a drama is a made-up story with actors, not a film of real facts=drama 是演员演的虚构故事，不是讲真实事实的片子|a nature documentary · make documentaries|stress: *doc-u-MEN-ta-ry*|重音：*doc-u-MEN-ta-ry*
      podcast|science on a phone on the way to school;football that people listen to online;new ones to listen to every week|a podcast is a program you listen to online; a blog is writing you read|podcast 是播客；blog 是博客|blog/blogs=a blog is writing that you read, not a program you listen to=blog 是读的文字，不是听的节目;magazine/magazines=a magazine is printed for reading, not something you listen to=magazine 是印出来读的，不是听的|listen to a podcast · start a podcast|pod + cast, one word|pod 加 cast，写成一个词
      blog|a new travel post every week;cooking writing read every week;internet writing with thousands of readers|a blog is writing on a website; a podcast is something you listen to|blog 是博客；podcast 是播客|podcast/podcasts=a podcast is something you listen to, not writing you read on a website=podcast 是听的，不是在网站上读的文字;novel/novels=a novel is a long story in a printed book, not writing posted on a website=novel 是印在书里的长篇故事，不是贴在网站上的文字|write a blog · a travel blog|one piece in a blog is a *post*|博客里的一篇叫 *post*
      comment|something left under a video;writing what they thought about a photo;kind words from many people|a comment is something said or written as an opinion; a follower is a person|comment 是评论；follower 是关注者|follower/followers=a follower is a person, not something you say or write=follower 是人，不是说的话或写的字;viewer/viewers=a viewer is a person who watches, not words=viewer 是观看的人，不是话语;voted=to vote is to choose, not to write what you think=vote 是投票选择，不是写下想法;clicked=to click is to press a button, not to write what you think=click 是点按钮，不是写下想法|leave a comment · comment on|use *on*: comment on a photo|用 *on*：comment on a photo
      follower|a million who see her posts;people who stopped seeing his posts;a new person following my account|a follower sees someone's posts online; a viewer watches TV|follower 是关注者；viewer 是观众|viewer/viewers=a viewer watches TV, not someone's posts online=viewer 看电视，不是看网上帖子;guest/guests=a guest visits your home, not someone who sees your posts=guest 是到你家的客人，不是看你帖子的人|a million followers · gain followers|verb *follow*: follow someone online|动词 *follow*：在网上关注某人
      subscribe|new videos every week from a channel;newspapers paid for every month;new episodes that come every week|to subscribe is to sign up to get something regularly; to listen is to hear|subscribe 是订阅；listen 是听|listen/Listen/listens/listened=to listen is to hear something, not to sign up to get it regularly=listen 是听，不是报名定期收到;write/Write/writes/written=to write to someone is to send them words, not to sign up to get something regularly=write 是写信给人，不是定期订阅|subscribe to a channel · subscribe to a newspaper|use *to*: subscribe to a magazine|用 *to*：subscribe to a magazine
    `,
  },
});

const truth = vocabularyTopic({
  id: "b1-words-truth",
  title: t("Truth and Lies", "真相和谎言"),
  summary: t(
    "Opinions, the truth and lies; false stories, rumors and fakes; sources and evidence; trusting; accurate claims; proving.",
    "观点、真相和谎言；虚假的报道、谣言和假货；消息来源和证据；信任；准确的说法；证明。",
  ),
  intro: t(
    "Before you **trust** a story online, check its **source**, look for **evidence** and ask if it is **accurate**, because a **rumor** or a **fake** photo can spread fast. These words help you tell the **truth** from a **lie**.",
    "在 **trust**（相信）网上的消息之前，先查它的 **source**（来源），找 **evidence**（证据），问问它是否 **accurate**（准确），因为 **rumor**（谣言）或 **fake**（假的）照片传得很快。这些词帮你分辨 **truth**（真相）和 **lie**（谎言）。",
  ),
  prerequisites: ["b1-words-news"],
  words: [
    word(
      "opinion opinions",
      "what you think about something",
      "观点；意见",
      "In my {opinion}, the film was too long. | Everyone thinks something different: we each have our own {opinion} about it. | Can I give my {opinion} and say what I think?",
      "fact rumor",
    ),
    word(
      "truth",
      "what is true; the real facts",
      "真相；事实",
      "Please tell me the {truth}. Did you break the window? | Nobody knows the {truth}, the real facts, about what happened. | There is some {truth} in what he says: part of it is really true.",
      "opinion rumor",
    ),
    word(
      "lie lies lied lying",
      "something you say that you know is not true; to say something that is not true",
      "谎言；说谎",
      "Don't {lie} to me: I know you took it, so stop saying you didn't.|shout whisper | He told a {lie} about his age: he said he was 18, but he's 15. | She was {lying} when she said she was ill: she was at the beach.|shouting whispering",
      "rumor fact",
    ),
    word(
      "false",
      "not true; not real",
      "虚假的；错误的",
      '"The sun goes around the earth." True or {false}? | He told the police his name was Bob, but that was {false}: his real name is Tom. | Many stories online are {false}, so don\'t believe everything you read.',
      "accurate certain",
    ),
    word(
      "rumor rumors",
      "a story that people tell, which may not be true",
      "谣言；传闻",
      "People are passing on the {rumor} that our teacher is leaving, but it may not be true. | Don't believe {rumors}. Check the facts.|facts opinions | The {rumor} spread quickly from person to person, but nobody knew if it was true.",
      "fact opinion",
    ),
    word(
      "fake",
      "not real, but made to look real; something that is not real",
      "假的；赝品",
      "This is not a real diamond. It's {fake}. | The photo was a {fake}. Someone changed it on a computer.|fact source | The police found {fake} money, printed at home, in his car.",
      "accurate certain",
    ),
    word(
      "source sources",
      "where something comes from, such as a person or a book that gives information",
      "来源；出处",
      "Always check the {source} of a story: who wrote it and where it came from. | Fruit is a good {source} of vitamins. | The reporter didn't name her {sources}, the people who told her the story.|rumors lies",
      "rumor lie",
    ),
    word(
      "evidence",
      "facts or things that show that something is true",
      "证据",
      "There is no {evidence}, like fingerprints or a video, that the man stole the car. | Scientists have found {evidence} of water on Mars. | The police are looking for {evidence}, such as fingerprints.",
      "opinion rumor",
    ),
    word(
      "trust trusts trusted trusting",
      "to believe that someone is honest or that something is true",
      "信任；相信",
      "I {trust} my best friend with all my secrets. | Don't {trust} or believe everything you read online. | She has always {trusted} her doctor and believes what he says.|proved claimed",
      "prove claim",
    ),
    word(
      "accurate",
      "correct and exact",
      "准确的",
      "Is this information {accurate}, correct in every detail? | The report's picture of the problem was {accurate}, correct in every way. | My watch is very {accurate}: it's never a second wrong.",
      "false obvious",
    ),
    word(
      "claim claims claimed claiming",
      "to say that something is true, although you cannot show it; something said in this way",
      "声称；说法",
      "He {claims} that he can speak ten languages, but he can't show it.|proves trusts | The company {claimed} that its drink was healthy, without any evidence.|proved trusted | There is no evidence for his {claim} that he saw a ghost.|trust truth",
      "prove trust",
    ),
    word(
      "prove proves proved proving",
      "to show that something is true",
      "证明",
      "Can you {prove} that you were at home? Show me. | The photos {proved} that he was there.|claimed trusted | Scientists have {proved}, with many tests, that smoking causes cancer.|claimed trusted",
      "claim trust",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Claim* and *prove* both say something is true, but you *claim* it without showing it, and you *prove* it with evidence. Look for evidence, photos or tests in the sentence.",
        "*claim* 和 *prove* 都是说某事是真的，但 *claim* 是只说不拿出证明，*prove* 是用证据证明。留意句中有没有证据、照片或实验。",
      ),
      meaning: t(
        "*Rumor* and *lie* are both stories that may be untrue, but a *rumor* is passed from person to person and may be true or not, and a *lie* is something you say knowing it is false. Check whether the speaker knows it is false.",
        "*rumor* 和 *lie* 都可能不真实，但 *rumor* 是人传人的说法，可能真也可能假，*lie* 是明知是假还要说的话。看清释义里说话的人是否知道它是假的。",
      ),
      spell: t(
        "*Rumor* ends in -or in American English and *rumour* in -our in British English; *evidence* has no plural: some evidence.",
        "美式 *rumor* 以 -or 结尾，英式 *rumour* 以 -our 结尾；*evidence* 没有复数：some evidence。",
      ),
    },
    notes: `
      opinion|a film that was too long in my view;something different each person thinks;saying what I think|an opinion is what you think; a fact is true for everyone|opinion 是观点；fact 是事实|fact/facts=a fact is something true for everyone, not what one person thinks=fact 是对谁都成立的事实，不是一个人的想法;rumor/rumors=a rumor is a story people pass on, not what you yourself think=rumor 是人们传的说法，不是你自己的想法|in my opinion · give your opinion|*in my opinion*, not *in my opinion I think*|说 *in my opinion*，不要再加 *I think*
      truth|who broke the window;the real facts about what happened;the part that is really true|the truth is the real facts; an opinion is what someone thinks|truth 是真相；opinion 是观点|opinion=an opinion is what someone thinks, not the real facts=opinion 是某人的想法，不是真实情况;rumor=a rumor may not be true, so it is not the real facts=rumor 不一定真实，不是真实情况|tell the truth · the truth about|adjective *true*|形容词 *true*
      lie|saying you didn't take it;a wrong age;being at the beach while saying she was ill|a lie is something you say knowing it is false; a rumor is a story people pass on|lie 是谎言；rumor 是谣言|rumor=a rumor is a story people pass around, not something one person says knowing it is false=rumor 是大家传的说法，不是一个人明知是假还说的话;fact=a fact is true, not something untrue=fact 是真的，不是假话;shout/shouting=to shout is to speak loudly, not to say something untrue=shout 是大声说话，不是说假话;whisper/whispering=to whisper is to speak quietly, not to say something untrue=whisper 是小声说话，不是说假话|tell a lie · lie to someone|*lying* also means lying down: *lie, lay, lain*|*lie* 也有“躺”的意思，过去式 *lay*，过去分词 *lain*
      false|true or not true;a name that wasn't his real one;stories online you shouldn't believe|false means not true; accurate means correct|false 是假的、错误的；accurate 是准确的|accurate=accurate means correct and exact, the opposite of not true=accurate 是正确准确，和不真实相反;certain=certain means sure, not untrue=certain 是确定，不是不真实|true or false · false information|*false* can mean wrong, *fake* means made to look real|*false* 指错误、不真实，*fake* 指仿造的
      rumor|news passed on that may not be true;stories you should check;a story passed from person to person|a rumor may not be true; a fact is true|rumor 是谣言；fact 是事实|fact/facts=a fact is known to be true, not a story that may not be=fact 是确定为真的，不是可能不真实的说法;opinion/opinions=an opinion is what one person thinks, not a story people pass around=opinion 是一个人的想法，不是人们传来传去的说法|spread a rumor · a rumor that|British spelling *rumour*|英式拼写 *rumour*
      fake|a diamond that is not real;a photo changed on a computer;money printed at home|fake means made to look real; accurate means correct|fake 是假的、赝品；accurate 是准确的|accurate=accurate means correct and exact, not made to look real=accurate 是准确，不是仿造的;certain=certain means sure, not not real=certain 是确定，不是不真的;fact=a fact is something true, not a thing made to look real=fact 是事实，不是仿造品;source=a source is where information comes from, not a thing made to look real=source 是信息来源，不是仿造品|fake money · fake news|*fake* can also be a verb: to fake an illness|*fake* 也能当动词：to fake an illness
      source|who wrote a story and where it came from;fruit for vitamins;people who told a reporter the story|a source is where something comes from; a rumor is a story that may be untrue|source 是来源；rumor 是谣言|rumor/rumors=a rumor is a story that may not be true, not where information comes from=rumor 是可能不真实的说法，不是信息来源;lie/lies=a lie is something untrue, not where information comes from=lie 是假话，不是信息来源|check the source · a good source of|*source* sounds like *sauce* in British English|英式英语里 *source* 和 *sauce* 读音相同
      evidence|fingerprints or a video about a car;water found on Mars;fingerprints the police look for|evidence is facts that show something is true; an opinion is what someone thinks|evidence 是证据；opinion 是观点|opinion=an opinion is what someone thinks, not facts that show something is true=opinion 是想法，不是证明真相的事实;rumor=a rumor is a story that may not be true, not something that shows the truth=rumor 是可能不真实的说法，不能证明真相|no evidence · evidence of|no plural: *a piece of evidence*|没有复数：*a piece of evidence*
      trust|secrets told to a best friend;believing what you read online;believing a doctor|to trust is to believe someone is honest; to prove is to show something is true|trust 是信任；prove 是证明|prove/proved=to prove is to show that something is true, not to believe someone is honest=prove 是证明，不是相信别人诚实;claim/claimed=to claim is to say something is true, not to believe someone=claim 是声称，不是相信别人|trust someone · trust your doctor|noun too: *trust* between friends|也可作名词：朋友之间的 *trust*
      accurate|information correct in every detail;a report's picture correct in every way;a watch never a second wrong|accurate means correct and exact; false means not true|accurate 是准确的；false 是错误的|false=false means not true, the opposite of correct=false 是不对，和正确相反;obvious=obvious means easy to see, not correct and exact=obvious 是明显，不是准确|accurate information · very accurate|double c: *ac-cu-rate*|双写 c：*ac-cu-rate*
      claim|ten languages he can't show;a healthy drink without any evidence;a ghost with no evidence|to claim is to say something is true without showing it; to prove is to show it|claim 是声称；prove 是证明|prove/proves/proved=to prove is to show something is true, which he cannot do=prove 是拿出证明，而他做不到;trust/trusts/trusted=to trust is to believe someone, not to say something without evidence=trust 是相信别人，不是没有证据地声称;truth=the truth is the real facts, not something said without evidence=truth 是真实情况，不是没有证据的说法|claim that · make a claim|*claim* also means to ask for money you are owed|*claim* 也指索要应得的钱
      prove|being at home and showing it;photos that showed he was there;many tests about smoking|to prove is to show something is true; to claim is to say it without showing it|prove 是证明；claim 是声称|claim/claimed=to claim is to say something without showing it, not to show it with photos or tests=claim 是只说不证明，不是用照片或实验证明;trust/trusted=to trust is to believe someone, not to show that something is true=trust 是相信，不是证明|prove that · prove it|noun *proof*|名词 *proof*
    `,
  },
});

const crime = vocabularyTopic({
  id: "b1-words-crime",
  title: t("Crime and Elections", "犯罪和选举"),
  summary: t(
    "Crimes and thieves; stealing, robbing and arresting; victims and witnesses; courts, judges and prisons; elections and voting.",
    "犯罪和小偷；偷窃、抢劫和逮捕；受害者和目击者；法院、法官和监狱；选举和投票。",
  ),
  intro: t(
    "A **witness** saw the **thief** **steal** a bag, the police **arrested** him, and a **judge** in **court** sent him to **prison**. These words help you talk about crime, the law and voting.",
    "一名 **witness**（目击者）看见 **thief**（小偷）**steal**（偷）了一个包，警察 **arrested**（逮捕）了他，**court**（法院）里的 **judge**（法官）判他进 **prison**（监狱）。这些词帮你谈论犯罪、法律和投票。",
  ),
  prerequisites: ["a2-words-neighborhood"],
  words: [
    word(
      "crime crimes",
      "something that is against the law",
      "犯罪；罪行",
      "Stealing is a {crime}: it's against the law. | {Crime}, like stealing and robbery, has fallen in the city this year. | The police are trying to stop {crimes} like this.|prisons courts",
      "prison court",
    ),
    word(
      "thief thieves",
      "a person who steals",
      "小偷；贼",
      "A {thief} took my bike while I was in the shop. | The {thieves} broke in through the window and took the TV.|victims witnesses | The police caught the {thief} who stole my bag.",
      "victim witness",
    ),
    word(
      "steal steals stole stolen stealing",
      "to take something that is not yours",
      "偷",
      "Someone {stole} my phone on the bus, and I never got it back.|borrowed lent | My bike was {stolen} from outside the school by a thief.|borrowed lent | It's wrong to {steal}, taking and keeping things that are not yours.",
      "borrow lend",
    ),
    word(
      "rob robs robbed robbing",
      "to take money or things from a person or a place, often using force",
      "抢劫",
      "Two masked men with guns {robbed} the bank and took the money yesterday.|arrested visited | He was {robbed} on his way home: two men took his wallet.|arrested visited | They were caught trying to {rob} a shop and take its money.",
      "arrest visit",
    ),
    word(
      "arrest arrests arrested arresting",
      "(of the police) to take someone away because they may have done a crime",
      "逮捕",
      "The police {arrested} the thief at the station.|robbed judged | He was {arrested} by the police for driving too fast.|robbed judged | The police made three {arrests}.|crimes victims",
      "rob judge",
    ),
    word(
      "victim victims",
      "a person who is hurt or has something taken in a crime or an accident",
      "受害者",
      "The old man who lost his wallet was the {victim} of the robbery. | Help for the {victims} of the flood is on its way.|witnesses thieves | He was the {victim} of a scam and lost all his money.",
      "witness thief",
    ),
    word(
      "witness witnesses",
      "a person who sees a crime or an accident happen",
      "目击者；证人",
      "A {witness} across the street saw the man running away. | The police are looking for {witnesses} who saw the accident.|victims judges | The {witness}, who saw everything but wasn't hurt, told the court what she saw.",
      "victim judge",
    ),
    word(
      "court courts",
      "the place where a judge decides if someone has done a crime; a place for playing tennis or basketball",
      "法院；球场",
      "The man will stand in front of a judge in {court} next week. | The {court} decided that he was not guilty. | We play basketball on the school {court}.",
      "prison station",
    ),
    word(
      "judge judges judged judging",
      "the person who decides in a court how to punish someone; to form an opinion about someone",
      "法官；评判",
      "The {judge} sent him to prison for two years. | Don't {judge} people by their clothes: you can't know someone from what they wear.|arrest rob | Three {judges} chose the winner of the competition.|witnesses victims",
      "witness victim",
    ),
    word(
      "prison prisons",
      "a building where criminals are kept",
      "监狱",
      "He spent five years in {prison}. | The judge sent the thief to {prison} for two years. | Some {prisons} teach prisoners new skills.|courts stations",
      "court station",
    ),
    word(
      "election elections",
      "a time when people choose leaders by voting",
      "选举",
      "Who won the {election} for mayor? | Next week everyone will vote for a class president in the {election}. | {Elections} for a new president are held every four years.|contests courts",
      "contest court",
    ),
    word(
      "vote votes voted voting",
      "to choose someone or something by marking a paper or raising your hand",
      "投票；选票",
      "You can {vote} in elections, by marking a paper, when you are eighteen. | Most students {voted} for a longer lunch break, raising their hands.|argued shouted | She won the election by twenty {votes}.|crimes arrests",
      "argue shout",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Steal* and *rob* both take what is not yours, but you *steal* a thing, like a phone, and you *rob* a person or a place, like a bank. Look at what comes after the gap.",
        "*steal* 和 *rob* 都是拿走不属于你的东西，但 *steal* 后面接东西，比如手机，*rob* 后面接人或地方，比如银行。看空格后面接的是什么。",
      ),
      meaning: t(
        "*Victim* and *witness* are both people at a crime, but the *victim* is the one who is hurt or loses something, and the *witness* only sees it. Check whether the person in the meaning is hurt or only watches.",
        "*victim* 和 *witness* 都是犯罪现场的人，但 *victim* 是受伤或丢东西的人，*witness* 只是看见了。看清释义里的人是受害了，还是只在旁边看。",
      ),
      spell: t(
        "*Thief* has ie, and its plural changes f to v: *thieves*; *steal* has its own past forms: *stole*, *stolen*.",
        "*thief* 里是 ie，复数把 f 变成 v：*thieves*；*steal* 的过去式和过去分词特殊：*stole*、*stolen*。",
      ),
    },
    notes: `
      crime|something against the law;stealing and robbery in the city;things the police try to stop|a crime is something against the law; a prison is where criminals are kept|crime 是犯罪；prison 是监狱|prison/prisons=a prison is where criminals are kept, not something against the law=prison 是关罪犯的地方，不是违法的事;court/courts=a court is where a judge decides, not something against the law=court 是法官判决的地方，不是违法的事|commit a crime · crime has fallen|a person who does a crime is a *criminal*|犯罪的人叫 *criminal*
      thief|someone who took my bike;people who broke in and took the TV;someone who stole my bag|a thief steals; a victim loses things|thief 是小偷；victim 是受害者|victim/victims=a victim has things taken, not the person who steals=victim 是被偷的人，不是偷东西的人;witness/witnesses=a witness only sees a crime and does not do it=witness 只是看见，没有作案|catch a thief · car thieves|plural *thieves*|复数 *thieves*
      steal|a phone never got back;a bike taken by a thief;taking and keeping what is not yours|to steal is to take a thing that is not yours; to borrow is to take it and give it back|steal 是偷；borrow 是借|borrow/borrowed=to borrow is to take something for a short time with permission and give it back=borrow 是经过允许借用，之后会还;lend/lent=to lend is to give something for a short time, not to take what is not yours=lend 是借给别人，不是拿走别人的东西|steal a phone · stolen from|past *stole*, *stolen*|过去式 *stole*，过去分词 *stolen*
      rob|masked men taking money from a bank;two men taking a wallet;taking a shop's money|to rob is to take from a person or place, often by force; to visit is to go to see|rob 是抢劫；visit 是拜访|arrest/arrested=to arrest is what police do to criminals, not taking money by force=arrest 是警察抓罪犯，不是用暴力抢钱;visit/visited=to visit is to go and see someone, not to take their money=visit 是去看望，不是拿走钱|rob a bank · be robbed|you rob a person or a place, but steal a thing|rob 后接人或地方，steal 后接东西
      arrest|a thief taken away at the station;the police and someone driving too fast;three made by the police|to arrest is what police do; to rob is what criminals do|arrest 是逮捕；rob 是抢劫|rob/robbed=to rob is what criminals do, not what police do=rob 是罪犯做的事，不是警察做的;judge/judged=a judge decides in court, but the police take people away=judge 在法庭判决，带走人的是警察;crime/crimes=a crime is what a criminal does, not what the police make=crime 是罪犯做的事，不是警察做的;victim/victims=a victim is a person hurt in a crime, not something the police make=victim 是受害的人，不是警察做的事|be arrested for · make an arrest|*under arrest* means held by the police|*under arrest* 是被警方拘捕
      victim|an old man who lost his wallet;people hurt by a flood;someone who lost all his money in a scam|a victim is hurt or loses something; a witness only sees it|victim 是受害者；witness 是目击者|witness/witnesses=a witness sees a crime or a flood but is not hurt by it=witness 看见了犯罪或洪水，但没有受害;thief/thieves=a thief steals, not the person who loses things=thief 是偷东西的人，不是丢东西的人|the victim of · flood victims|use *of*: the victim of a crime|用 *of*：the victim of a crime
      witness|someone across the street who saw;people who saw an accident;someone who saw everything and wasn't hurt|a witness sees a crime; a victim is hurt by it|witness 是目击者；victim 是受害者|victim/victims=a victim is hurt or loses something, not someone who only watched=victim 是受害的人，不只是旁观;judge/judges=a judge decides in court and did not see the crime happen=judge 在法庭判决，没有亲眼看到案发|a witness to · look for witnesses|*witness* can be a verb: to witness an accident|*witness* 也能当动词：to witness an accident
      court|standing in front of a judge;a decision that he was not guilty;basketball at school|a court is where a judge decides, or a place for some games; a prison is where criminals are kept|court 是法院、球场；prison 是监狱|prison/prisons=a prison is where criminals are kept, not where a judge decides or where you play basketball=prison 是关罪犯的地方，不是法官判决或打篮球的地方;station=a station is where trains stop, not where a judge decides or games are played=station 是车站，不是判案或比赛的地方|in court · a tennis court|we say *in court*, with no *the*|说 *in court*，不加 *the*
      judge|two years in prison;people judged by their clothes;three who chose a winner|a judge decides; a witness tells what she saw|judge 是法官、评判；witness 是目击者|witness/witnesses=a witness tells the court what she saw, but does not decide=witness 向法庭讲看到的事，不做决定;victim/victims=a victim is hurt in a crime, not someone who decides=victim 是受害者，不做决定;arrest=to arrest is to take someone to the police, not to form an opinion about them=arrest 是带去警局，不是对人下判断;rob=to rob is to take money by force, not to form an opinion=rob 是抢钱，不是下判断|a judge in court · judge someone|dg said like *j*: *juj*|dg 读作 *j*：*juj*
      prison|five years inside;two years from a judge;places that teach prisoners skills|a prison is where criminals are kept; a court is where a judge decides|prison 是监狱；court 是法院|court/courts=a court is where a judge decides, not where criminals live for years=court 是法官判决的地方，不是罪犯住几年的地方;station/stations=a station is where trains stop, not where criminals are kept=station 是车站，不是关罪犯的地方|in prison · go to prison|a person in prison is a *prisoner*|关在监狱里的人叫 *prisoner*
      election|choosing a mayor;voting for a class president;choosing a new president every four years|an election is choosing leaders by voting; a contest is won by skill|election 是选举；contest 是比赛|contest/contests=a contest is a competition you win by skill, not choosing a leader by voting=contest 是凭本事赢的比赛，不是投票选领导;court/courts=a court is where a judge decides, not where people choose leaders=court 是法官判决的地方，不是选领导的地方|win an election · hold an election|verb *elect*: they elected a new mayor|动词 *elect*：they elected a new mayor
      vote|marking a paper in elections;students raising their hands;twenty more that won an election|to vote is to choose by marking a paper or raising your hand; to argue is to talk angrily|vote 是投票；argue 是争吵|argue/argued=to argue is to talk angrily about something, not to choose by marking a paper or raising your hand=argue 是争吵，不是画票或举手选择;shout/shouted=to shout is to speak loudly, not to choose by marking a paper or raising hands=shout 是大声喊，不是画票或举手选择;crime/crimes=a crime is something against the law, not a choice counted in an election=crime 是违法的事，不是选举中计的票;arrest/arrests=an arrest is the police taking someone away, not a choice counted in an election=arrest 是警察抓人，不是选举中计的票|vote for · win by ten votes|*vote for* someone, *vote against* something|*vote for* 支持某人，*vote against* 反对某事
    `,
  },
});

const events = vocabularyTopic({
  id: "b1-words-describing-events",
  title: t("Describing Events", "描述事件"),
  summary: t(
    "Recent and current events; national, international and official news; shocking, unexpected and sudden events; major and minor; positive and negative.",
    "最近的和当前的事件；全国的、国际的和官方的消息；令人震惊的、出乎意料的和突然的事件；重大的和次要的；正面的和负面的。",
  ),
  intro: t(
    "A **sudden** storm, **shocking** pictures on the **national** news and an **unexpected** result: some events are **major** and some **minor**, some **positive** and some **negative**. These words help you describe news and events.",
    "**sudden**（突然的）暴风雨、**national**（全国的）新闻里 **shocking**（令人震惊的）画面、一个 **unexpected**（出乎意料的）结果：有些事 **major**（重大），有些 **minor**（次要），有些 **positive**（积极），有些 **negative**（消极）。这些词帮你描述新闻和事件。",
  ),
  prerequisites: ["a2-words-events"],
  words: [
    word(
      "recent",
      "happening a short time ago",
      "最近的",
      "In {recent} years, more people have started working from home. | This photo is {recent}: I took it just last week. | Prices have gone up in {recent} months.",
      "old future",
    ),
    word(
      "current",
      "happening now",
      "当前的；现在的",
      "What is the {current} price of gold right now, today? | Our {current} teacher, the one we have now, is much stricter than the last one. | We talked about {current} events, the news happening now, in class.",
      "recent future",
    ),
    word(
      "national",
      "of the whole of a country",
      "全国的；国家的",
      "Today is our {national} holiday, so the schools in the whole country are closed. | She plays for the {national} team of her country. | The story was on the {national} news, all over the country.",
      "international local",
    ),
    word(
      "international",
      "between or among many countries",
      "国际的",
      "English is {international}: people use it in many countries. | The {international} airport, with flights to many countries, is an hour from the city. | She works for a big {international} company with offices in twenty countries.",
      "national local",
    ),
    word(
      "official",
      "decided by people in power; done by people in power",
      "官方的；正式的",
      "The {official} language of Brazil, chosen by the government, is Portuguese. | The results will be {official} tomorrow, when the government tells everyone. | We got a letter from the school on {official} paper with the head teacher's name.",
      "personal secret",
    ),
    word(
      "shocking",
      "very surprising and upsetting",
      "令人震惊的",
      "The news of the terrible accident was {shocking}, and everyone was upset. | It's {shocking} how much food we throw away. | We saw some {shocking} pictures of the flood that made us cry.",
      "boring nice",
    ),
    word(
      "unexpected",
      "surprising, because you did not think it would happen",
      "出乎意料的",
      "My aunt's visit was {unexpected}: she came without calling. | The result of the match was completely {unexpected}: nobody thought they would win. | His answer was {unexpected}, and it surprised us all.",
      "normal planned",
    ),
    word(
      "major",
      "very large or important",
      "重大的；主要的",
      "Pollution is a {major} problem. It kills millions of people every year. | There was a {major} accident on the motorway, and ten cars crashed. | Paris is a {major} city with millions of people.",
      "minor small",
    ),
    word(
      "minor",
      "small and not very important",
      "次要的；轻微的",
      "It's only a {minor} injury. He'll be fine. | We made some {minor} changes to the plan, just small ones. | There was a {minor} problem with the car, but it was easy to fix.",
      "major serious",
    ),
    word(
      "sudden",
      "happening quickly when you do not expect it",
      "突然的",
      "There was a {sudden} noise behind me, and I jumped. | The storm was very {sudden}: one minute it was sunny, the next it was raining. | Her {sudden} decision to leave surprised everyone.",
      "slow planned",
    ),
    word(
      "positive",
      "good or useful; hopeful",
      "积极的；正面的",
      "Try to be {positive}. Things will get better. | The new rules have had a {positive} effect: everyone is happier. | We got lots of {positive} comments about the show, saying how good it was.",
      "negative sad",
    ),
    word(
      "negative",
      "bad or harmful; not hopeful",
      "消极的；负面的",
      "Too much screen time has a {negative} effect on sleep, making it worse. | Don't be so {negative}! It might work. | She gave him some {negative} feedback about his mistakes.",
      "positive happy",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Recent* and *current* are both about time, but *recent* means a short time ago, and *current* means happening now. Look for words like *last week* or *now*.",
        "*recent* 和 *current* 都和时间有关，但 *recent* 是不久以前，*current* 是现在正在发生。留意句中的 *last week* 或 *now* 之类的词。",
      ),
      meaning: t(
        "*National* and *international* both describe places, but *national* is about one whole country, and *international* is about many countries. Check whether the meaning names one country or many.",
        "*national* 和 *international* 都和地域有关，但 *national* 说的是一整个国家，*international* 说的是许多国家之间。看清释义说的是一个国家还是很多国家。",
      ),
      spell: t(
        "*Unexpected* is un- plus *expected*; *official* has double f and ends in -cial, not -tial.",
        "*unexpected* 是 un- 加 *expected*；*official* 双写 f，以 -cial 结尾，不是 -tial。",
      ),
    },
    notes: `
      recent|years in which more people work from home;a photo taken just last week;months when prices went up|recent means a short time ago; old means a long time ago|recent 是最近的；old 是旧的|old=old means from a long time ago, not a short time ago=old 是很久以前的，不是不久以前;future=future means coming later, not something that has already happened=future 是将来的，不是已经发生的|in recent years · a recent photo|adverb *recently*|副词 *recently*
      current|the price of gold right now;the teacher we have now;the news happening now|current means happening now; recent means a short time ago|current 是当前的；recent 是最近的|recent=recent means a short time ago, not right now=recent 是不久前，不是现在;future=future means coming later, not happening now=future 是将来，不是现在|current events · the current price|*current* is also a flow of water or electricity|*current* 也指水流或电流
      national|schools closed in the whole country;the team of her country;news all over the country|national means of one whole country; local means of one small area|national 是全国的；local 是当地的|international=international means among many countries, not the whole of one country=international 是许多国家之间的，不是一个国家全国的;local=local means of one small area, not the whole country=local 是一个小地方的，不是全国的|a national holiday · the national team|noun *nation*|名词 *nation*
      international|a language used in many countries;flights to many countries;offices in twenty countries|international means among many countries; national means of one country|international 是国际的；national 是全国的|national=national means of one country, not many=national 是一个国家的，不是很多国家的;local=local means of one small area, not many countries=local 是一个小地方的，不是很多国家的|an international airport · international news|inter- means between: between nations|inter- 表示“之间”：国与国之间
      official|a language chosen by the government;results the government tells everyone;school paper with the head teacher's name|official means decided or done by people in power; personal means private|official 是官方的；personal 是个人的|personal=personal means about one person's private life, not decided by people in power=personal 是个人私事的，不是掌权者决定的;secret=secret means hidden from others, not told to everyone by people in power=secret 是保密的，不是掌权者公开告知的|official language · an official letter|*an official* is also a person with an official job|*an official* 也指官员
      shocking|news of a terrible accident;how much food we throw away;flood pictures that made us cry|shocking means very surprising and upsetting; boring means not interesting|shocking 是令人震惊的；boring 是无聊的|boring=boring means not interesting, not surprising and upsetting=boring 是无聊，不是令人震惊又难过;nice=nice means pleasant, not upsetting=nice 是令人愉快的，不是令人难过的|shocking news · it's shocking how|*shocked* is how you feel; *shocking* is what makes you feel it|*shocked* 是人的感受；*shocking* 是让人震惊的事物
      unexpected|a visit without calling;a result nobody thought would happen;an answer that surprised us|unexpected means surprising because you didn't think it would happen; planned means arranged before|unexpected 是出乎意料的；planned 是计划好的|normal=normal means usual and expected, not surprising=normal 是平常的、意料之中的，不是出乎意料;planned=planned means arranged before, not something you didn't think would happen=planned 是事先安排好的，不是没想到的|completely unexpected · an unexpected visit|un- plus *expected*|un- 加 *expected*
      major|a problem that kills millions;ten cars crashing on a motorway;a city with millions of people|major means very large or important; minor means small|major 是重大的；minor 是次要的|minor=minor means small and not important, not very large=minor 是小而不重要的，不是很大的;small=small means little, not very large or important=small 是小的，不是很大或很重要|a major problem · a major city|*major* is also a main subject at university|*major* 也指大学主修专业
      minor|an injury that will be fine;just small changes;a problem easy to fix|minor means small and not important; serious means bad or important|minor 是轻微的；serious 是严重的|major=major means very large or important, not small and easy=major 是重大的，不是小而容易的;serious=serious means bad or important, not small and easy to fix=serious 是严重的，不是小而容易解决的|a minor injury · minor changes|*a minor* is also a person under 18|*a minor* 也指未成年人
      sudden|a noise that made me jump;sun then rain in a minute;a decision that surprised everyone|sudden means happening quickly and unexpectedly; slow means taking a long time|sudden 是突然的；slow 是慢的|slow=slow means taking a long time, not happening quickly=slow 是慢慢来的，不是一下子发生的;planned=planned means decided before, not happening when you don't expect it=planned 是事先决定的，不是没想到就发生|a sudden noise · all of a sudden|*all of a sudden* means suddenly|*all of a sudden* 表示突然
      positive|things that will get better;rules that made everyone happier;comments saying how good a show was|positive means good or hopeful; negative means bad|positive 是积极的；negative 是消极的|negative=negative means bad or not hopeful, the opposite of good=negative 是坏的、不抱希望的，和好的相反;sad=sad means unhappy, not hopeful or good=sad 是难过，不是充满希望或好的|a positive effect · stay positive|in a test, *positive* can mean the thing was found|检测里 *positive* 可指结果呈阳性
      negative|sleep made worse by screens;thinking it won't work;feedback about mistakes|negative means bad or not hopeful; positive means good|negative 是消极的；positive 是积极的|positive=positive means good or hopeful, the opposite of bad=positive 是好的、有希望的，和坏的相反;happy=happy means feeling good, not bad or without hope=happy 是开心，不是坏的或没希望的|a negative effect · negative feedback|*negative* numbers are below zero|*negative* 数是小于零的数
    `,
  },
});

const communicating = vocabularyTopic({
  id: "b1-words-communicating",
  title: t("Communicating", "交流"),
  summary: t(
    "Informing, mentioning and expressing; responding and responses; debates; interrupting and whispering; suggesting and suggestions; warning and advising; speeches.",
    "通知、提到和表达；回应和答复；辩论；打断和低声说；建议和提议；警告和劝告；演讲。",
  ),
  intro: t(
    "In a class **debate**, one student gave a **speech**, another kept **interrupting**, and the teacher **suggested** a better way to **respond**. These words help you talk about how people share ideas and feelings.",
    "在一场班级 **debate**（辩论）中，一个学生做了 **speech**（演讲），另一个总是 **interrupting**（打断），老师 **suggested**（建议）了更好的 **respond**（回应）方式。这些词帮你谈论人们怎样交流想法和感受。",
  ),
  prerequisites: ["a2-words-communication"],
  words: [
    word(
      "inform informs informed informing",
      "to tell someone facts, often officially",
      "通知；告知",
      "Please {inform} us in writing if you change your address. | We were {informed} by letter that our new passports were ready.|warned asked | The letter {informs} parents of the date and time of the school trip.|warns asks",
      "warn ask",
    ),
    word(
      "mention mentions mentioned mentioning",
      "to talk or write about something in a few words",
      "提到",
      "Did she {mention} her new job when she talked to you, even in a few words? | He {mentioned}, in just a few words, that he was tired.|hid forgot | Don't {mention} the party or even say its name. It's a surprise.",
      "hide forget",
    ),
    word(
      "express expresses expressed expressing",
      "to show a feeling or an opinion in words or actions",
      "表达",
      "She {expresses} her feelings through music, showing everyone how she feels.|hides forgets | It's hard to {express} in words how happy I am. | Many people {expressed} their anger about the decision by writing letters.|hid forgot",
      "hide forget",
    ),
    word(
      "respond responds responded responding",
      "to answer or react",
      "回应；回答",
      "He didn't {respond} to my message: I'm still waiting for an answer. | How did she {respond}, and what did she say back, when you told her? | The company {responded} to the complaint in a day with a letter.|listened agreed",
      "listen agree",
    ),
    word(
      "response responses",
      "an answer or a reaction",
      "回应；答复",
      "I sent a question, and I'm still waiting for a {response} to my email. | When I asked, her {response} was a big smile. | We got hundreds of {responses} answering our survey.|suggestions questions",
      "suggestion question",
    ),
    word(
      "debate debates",
      "a discussion in which people give different opinions, often in a formal way",
      "辩论",
      "Our class had a {debate} about school uniforms, with two teams giving different opinions. | There's a lot of {debate}, with people arguing for and against, about the new airport. | She won three {debates} this year by arguing better than the other side.|responses speeches",
      "response speech",
    ),
    word(
      "interrupt interrupts interrupted interrupting",
      "to start talking while someone else is talking",
      "打断",
      "Please don't {interrupt} while I'm talking. Let me finish. | Sorry to {interrupt} while you're speaking, but there's a phone call for you. | He kept {interrupting} while the teacher was talking, so she couldn't finish.|whispering listening",
      "whisper listen",
    ),
    word(
      "whisper whispers whispered whispering",
      "to speak very quietly",
      "低声说；耳语",
      "\"Don't wake the baby,\" she {whispered}.|shouted sang | Stop {whispering} quietly to your friend in class!|shouting singing | He {whispered} the answer quietly so the teacher couldn't hear.|shouted sang",
      "shout sing",
    ),
    word(
      "suggest suggests suggested suggesting",
      "to give an idea for someone to think about",
      "建议；提议",
      "I {suggest} that we take the train, but it's only an idea. | My friend {suggested} a good restaurant for us to think about.|ordered forgot | What do you {suggest}? Give me an idea.",
      "order forget",
    ),
    word(
      "suggestion suggestions",
      "an idea that someone gives for others to think about",
      "建议",
      "Can I make a {suggestion}? Let's go to the beach. | Thanks for your {suggestions} and ideas for the party.|responses questions | That's a good {suggestion}. Let's do it.",
      "response question",
    ),
    word(
      "warn warns warned warning",
      "to tell someone about a danger",
      "警告",
      "I {warned} you that the ice was thin and dangerous, but you didn't listen!|promised taught | The red sign {warns} drivers that the bend ahead is dangerous.|promises teaches | They {warned} us that the river was dangerous for swimming.|promised taught",
      "promise teach",
    ),
    word(
      "advise advises advised advising",
      "to tell someone what you think they should do",
      "劝告；建议",
      "The doctor {advised} me to rest for a week because it would be best for me.|invited taught | I'd {advise} you to book early, because tickets sell out. | My teacher {advises} us to read every day, because she thinks it's best.|invites teaches",
      "invite teach",
    ),
    word(
      "speech speeches",
      "a formal talk to a group of people; the ability to speak",
      "演讲；言语",
      "The head teacher gave her {speech} to the whole school in the hall at the start of the year. | She was nervous before her {speech} in front of five hundred people. | The mayor's {speeches}, which he gives to big crowds, are always short.|lessons interviews",
      "lesson interview",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Whisper* and *shout* are opposites: you *whisper* very quietly so that few people hear, and you *shout* very loudly. Look for words like *quietly*, *so nobody could hear* or *don't wake the baby*.",
        "*whisper* 和 *shout* 意思相反：*whisper* 是很小声地说，只有很少人听得到，*shout* 是大声喊。留意句中的 *quietly*、*so nobody could hear* 或 *don't wake the baby*。",
      ),
      meaning: t(
        "*Response* and *suggestion* are both things you say, but a *response* is an answer to something, and a *suggestion* is a new idea for others to think about. Check whether the meaning answers or offers an idea.",
        "*response* 和 *suggestion* 都是说出来的话，但 *response* 是对某事的回答，*suggestion* 是提给别人考虑的新想法。看清释义是在回答，还是在提想法。",
      ),
      spell: t(
        "*Advise* with s is the verb and *advice* with c is the noun: I *advise* you; that's good *advice*.",
        "带 s 的 *advise* 是动词，带 c 的 *advice* 是名词：I *advise* you；that's good *advice*。",
      ),
    },
    notes: `
      inform|a change of address in writing;a letter saying passports were ready;the date and time of a school trip|to inform is to tell someone facts, often officially; to warn is to tell about a danger|inform 是通知；warn 是警告|warn/warned/warns=to warn is to tell someone about a danger, and here there is no danger=warn 是提醒危险，这里没有危险;ask/asked/asks=to ask is to want an answer from someone, not to give them facts=ask 是向人要答案，不是告诉对方事实|inform someone of · keep someone informed|noun *information*|名词 *information*
      mention|a new job said in a few words;being tired said briefly;a party whose name you shouldn't say|to mention is to talk about something in a few words; to hide is to keep it secret|mention 是提到；hide 是隐瞒|hide/hid=to hide is to keep something secret, not to talk about it=hide 是藏起来不说，不是提到;forget/forgot=to forget is not to remember, not to talk about something briefly=forget 是忘记，不是简单提一下|mention that · don't mention it|*Don't mention it* is a polite answer to *thank you*|*Don't mention it* 是回答“谢谢”的客气话
      express|feelings shown through music;how happy I am in words;anger shown by writing letters|to express is to show a feeling or an opinion; to hide is to keep it inside|express 是表达；hide 是隐藏|hide/hides/hid=to hide is to keep a feeling inside where nobody can see, not to show it=hide 是把感受藏起来，不是表现出来;forget/forgets/forgot=to forget is not to remember, not to show a feeling=forget 是忘记，不是表达感受|express your feelings · express an opinion|noun *expression*|名词 *expression*
      respond|a message still waiting for an answer;what she said back;a letter in a day about a complaint|to respond is to answer or react; to listen is only to hear|respond 是回应；listen 是听|listen/listened=to listen is only to hear, not to answer=listen 只是听，不是回答;agree/agreed=to agree is to have the same opinion, not to answer=agree 是意见相同，不是回答|respond to · respond quickly|use *to*: respond to a message|用 *to*：respond to a message
      response|an answer to my email;a smile when I asked;hundreds answering a survey|a response is an answer; a suggestion is a new idea|response 是回应；suggestion 是建议|suggestion/suggestions=a suggestion is an idea for others to think about, not an answer to what you asked=suggestion 是供人考虑的想法，不是对问题的回答;question/questions=a question asks for an answer and is not the answer=question 是提问，不是回答|in response to · get a response|noun of *respond*|是 *respond* 的名词
      debate|two teams with different opinions;people arguing for and against;arguing better than the other side|a debate is a discussion with different opinions; a speech is one person talking|debate 是辩论；speech 是演讲|response/responses=a response is an answer, not people giving different opinions=response 是回答，不是双方各执一词;speech/speeches=a speech is one person talking to a group, not two sides arguing=speech 是一个人对大家讲话，不是两方辩论|have a debate · a lot of debate|*debate* can be a verb: to debate a question|*debate* 也能当动词：to debate a question
      interrupt|talking before I finish;a phone call while you're speaking;a teacher who couldn't finish|to interrupt is to start talking while someone else is; to listen is to hear them|interrupt 是打断；listen 是听|whisper/whispering=to whisper is to speak quietly, which does not stop someone finishing=whisper 是小声说话，不会让人说不完;listen/listening=to listen is to hear someone, not to stop them talking=listen 是听人说，不是打断|don't interrupt · sorry to interrupt|double r: *in-ter-rupt*|双写 r：*in-ter-rupt*
      whisper|not waking the baby;quiet talk to a friend in class;an answer the teacher couldn't hear|to whisper is to speak very quietly; to shout is to speak very loudly|whisper 是低声说；shout 是大喊|shout/shouted/shouting=to shout is to speak very loudly, not quietly=shout 是大声喊，不是小声说;sing/sang/singing=to sing is to make music with your voice, not to speak quietly=sing 是唱歌，不是小声说话|whisper to someone · in a whisper|the h is silent: *WIS-per*|h 不发音：*WIS-per*
      suggest|taking the train as only an idea;a restaurant to think about;an idea someone gives|to suggest is to give an idea; to order is to say someone must do it|suggest 是建议；order 是命令|order/ordered=to order is to tell someone they must do something, not to give an idea to think about=order 是命令必须做，不是提出供考虑的想法;forget/forgot=to forget is not to remember, not to give an idea=forget 是忘记，不是提出想法|suggest that · suggest a place|*suggest that we go*, not *suggest us to go*|说 *suggest that we go*，不说 *suggest us to go*
      suggestion|going to the beach;ideas for the party;an idea to do|a suggestion is an idea for others; a response is an answer|suggestion 是建议；response 是回应|response/responses=a response is an answer, not an idea for others to think about=response 是回答，不是供人考虑的想法;question/questions=a question asks something and does not give an idea=question 是提问，不是提出想法|make a suggestion · a good suggestion|*make* a suggestion, not *do* a suggestion|说 *make* a suggestion，不说 *do*
      warn|thin and dangerous ice;a dangerous bend ahead;a river dangerous for swimming|to warn is to tell someone about a danger; to promise is to say you will surely do something|warn 是警告；promise 是承诺|promise/promised/promises=to promise is to say you will surely do something, not to tell someone about a danger=promise 是保证会做某事，不是提醒危险;teach/taught/teaches=to teach is to give lessons, not to tell someone about a danger just before it happens=teach 是上课教东西，不是在危险前提醒|warn someone about · a warning sign|noun *warning*|名词 *warning*
      advise|resting for a week as best;booking early before tickets sell out;reading every day as best|to advise is to say what someone should do; to invite is to ask someone to come|advise 是劝告；invite 是邀请|invite/invited/invites=to invite is to ask someone to come to an event, not to tell them what they should do=invite 是请人来参加活动，不是告诉他该怎么做;teach/taught/teaches=to teach is to give lessons, not to say what you think is best=teach 是上课教东西，不是说你觉得怎样最好|advise someone to · I'd advise you|noun *advice*, with c|名词 *advice*，用 c
      speech|a talk to the whole school in the hall;five hundred people listening;talks to big crowds|a speech is a formal talk to a group; a lesson is teaching in a class|speech 是演讲；lesson 是课|lesson/lessons=a lesson is teaching in a class, not a formal talk to a big crowd=lesson 是课堂上课，不是对一大群人的正式讲话;interview/interviews=an interview is questions and answers between a few people, not one person talking to a big group=interview 是几个人之间的问答，不是一个人对一大群人讲话|give a speech · make a speech|*speech* also means the power to speak|*speech* 也指说话的能力
    `,
  },
});

const opinions = vocabularyTopic({
  id: "b1-words-opinions",
  title: t("Opinions", "观点"),
  summary: t(
    "Opposing, favoring and convincing; doubts; certain, uncertain and obvious; personally, definitely, totally, strongly and absolutely.",
    "反对、赞成和说服；怀疑；确定的、不确定的和明显的；就个人而言、肯定地、完全地、强烈地和绝对地。",
  ),
  intro: t(
    "**Personally**, I **strongly** **oppose** the plan, but my friend is **definitely** in **favor**; we are both **certain** we are right, so who will **convince** whom? These words help you give and discuss opinions.",
    "**personally**（就我个人而言），我 **strongly**（强烈地）**oppose**（反对）这个计划，可我朋友 **definitely**（肯定）是 **favor**（赞成）的；我们都 **certain**（确信）自己是对的，那谁能 **convince**（说服）谁呢？这些词帮你表达和讨论观点。",
  ),
  prerequisites: ["b1-words-truth"],
  words: [
    word(
      "oppose opposes opposed opposing",
      "to disagree with a plan and try to stop it",
      "反对",
      "Many people {oppose} the new road and are trying to stop it. | The students {opposed} the plan to shorten the holidays and signed a letter against it.|supported enjoyed | She strongly {opposes} hunting and thinks it should be stopped.|supports enjoys",
      "support enjoy",
    ),
    word(
      "favor favors",
      "support for a plan or an idea (in favor of); something kind that you do for someone",
      "赞成；帮忙",
      "Are you in {favor} of school uniforms, or against them? | Can you do me a {favor} and carry this bag? | Most people voted in {favor} of the plan, so it was accepted.",
      "front place",
    ),
    word(
      "convince convinces convinced convincing",
      "to make someone believe or do something",
      "说服；使相信",
      "She {convinced} me to try the dish, though I didn't want to at first.|invited taught | I'm {convinced}, with no doubt at all, that he's telling the truth.|worried afraid | He tried to {convince} his parents to buy a dog by giving them lots of good reasons.",
      "invite teach",
    ),
    word(
      "doubt doubts",
      "a feeling of not being sure",
      "怀疑",
      "There's no {doubt} that she is the best player: everyone is sure. | I have some {doubts} about his plan: I'm not sure it will work.|favors opinions | If you're in {doubt} and not sure, ask the teacher.",
      "favor opinion",
    ),
    word(
      "certain",
      "sure; with no doubt",
      "确定的",
      "Are you {certain}, really sure, that you locked the door? | I'm {certain} she'll win. I have no doubt. | We are {certain} that it will rain tomorrow: there's no doubt.",
      "uncertain nervous",
    ),
    word(
      "uncertain",
      "not sure; not decided",
      "不确定的",
      "Nobody knows what will happen. The future of the club is {uncertain}. | I'm {uncertain} about which course to choose and can't decide. | The date of the concert is still {uncertain}: nobody has decided it yet.",
      "certain clear",
    ),
    word(
      "obvious",
      "easy to see or understand",
      "明显的",
      "It's {obvious} that she likes him: anyone can see it. | The answer is {obvious}. Why can't you see it? | For {obvious} reasons, such as the freezing water, we can't swim in winter.",
      "uncertain secret",
    ),
    word(
      "personally",
      "used to say that you are giving your own opinion",
      "就个人而言",
      "{Personally}, I prefer tea to coffee, but that's just my opinion. | I {personally} think the plan is a mistake, but others may not agree. | {Personally}, I don't like horror films, but my friends love them.",
      "definitely totally",
    ),
    word(
      "definitely",
      "certainly; with no doubt",
      "肯定地；一定",
      'I\'ll {definitely} come to your party. I can\'t wait! | This is {definitely} the best pizza in town, with no doubt. | "Are you coming?" "{Definitely}! I wouldn\'t miss it."',
      "maybe never",
    ),
    word(
      "totally",
      "completely",
      "完全地",
      "I {totally} forgot about the meeting: I didn't remember it at all! | The two films are {totally} different: they have nothing in common. | I {totally} agree with you, in every way.",
      "nearly slightly",
    ),
    word(
      "strongly",
      "very much; in a strong way",
      "强烈地",
      "I {strongly} believe, with all my heart, that animals should be free. | She {strongly} disagrees with the new rule and has written to the head teacher. | I {strongly} advise you to take an umbrella: it will pour!",
      "slightly quietly",
    ),
    word(
      "absolutely",
      "completely; used to say yes strongly",
      "绝对地；完全地",
      'The view from the top was {absolutely} beautiful, the best I have ever seen. | "Do you agree?" "{Absolutely}! I agree completely." | You\'re {absolutely} right, in every way.',
      "nearly slightly",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Certain* and *obvious* both mean there is no doubt, but *certain* describes a person who is sure, and *obvious* describes a fact that anyone can see. Look at who or what the word describes.",
        "*certain* 和 *obvious* 都表示没有疑问，但 *certain* 形容人很确定，*obvious* 形容事情谁都看得出来。看这个词形容的是人还是事。",
      ),
      meaning: t(
        "*Totally* and *nearly* both say how much, but *totally* means completely, and *nearly* means almost but not quite. Check whether the meaning is all of it or almost all.",
        "*totally* 和 *nearly* 都表示程度，但 *totally* 是完全，*nearly* 是差一点、几乎。看清释义说的是全部还是几乎全部。",
      ),
      spell: t(
        "*Definitely* has -ite- in the middle: def-in-ite-ly, not *definately*; *favor* is *favour* in British English.",
        "*definitely* 中间是 -ite-：def-in-ite-ly，不是 *definately*；英式拼写 *favor* 是 *favour*。",
      ),
    },
    notes: `
      oppose|a new road people try to stop;a letter against a shorter holiday;hunting that should be stopped|to oppose is to disagree and try to stop; to support is to agree and help|oppose 是反对；support 是支持|support/supported/supports=to support is to agree with a plan and help it, the opposite of trying to stop it=support 是赞成并支持，和想阻止它相反;enjoy/enjoyed/enjoys=to enjoy is to like something, not to try to stop it=enjoy 是喜欢，不是想阻止|oppose a plan · be opposed to|*be opposed to* + -ing or a noun|*be opposed to* 后接 -ing 或名词
      favor|uniforms supported or opposed;a kind act like carrying a bag;votes that accepted a plan|in favor of means supporting; a favor is a kind act|in favor of 是赞成；a favor 是帮忙|front=front is the side that faces forward, and it is not support or a kind act=front 是朝前的一面，不是支持，也不是帮忙;place=a place is somewhere you go, and in place of means instead of, so neither is support or a kind act=place 是地方，in place of 是“代替”，都不是支持或帮忙|in favor of · do someone a favor|British spelling *favour*|英式拼写 *favour*
      convince|trying a dish at first unwanted;sure with no doubt at all;good reasons for a dog|to convince is to make someone believe or do something; to invite is to ask someone to come|convince 是说服；invite 是邀请|invite/invited=to invite is to ask someone to come, not to make them believe or agree=invite 是邀请人来，不是让人相信或同意;teach/taught=to teach is to give lessons, not to make someone change their mind with reasons=teach 是上课教东西，不是用理由改变别人的想法;worried=worried means afraid something bad will happen, not sure with no doubt=worried 是担心坏事，不是毫无疑问地确信;afraid=afraid means frightened, not sure with no doubt=afraid 是害怕，不是毫无疑问地确信|convince someone to · be convinced that|*convinced* also means very sure|*convinced* 也表示非常确信
      doubt|the best player everyone is sure of;not being sure a plan will work;not being sure and asking the teacher|a doubt is a feeling of not being sure; an opinion is what you think|doubt 是怀疑；opinion 是观点|favor/favors=a favor is a kind act or support, not a feeling of not being sure=favor 是帮忙或支持，不是不确定的感觉;opinion/opinions=an opinion is what you think, not a feeling of not being sure=opinion 是你的想法，不是不确定的感觉|no doubt · in doubt|the b is silent: *dout*|b 不发音：*dout*
      certain|really sure about a locked door;no doubt she'll win;rain with no doubt|certain means sure; uncertain means not sure|certain 是确定的；uncertain 是不确定的|uncertain=uncertain means not sure, the opposite of having no doubt=uncertain 是不确定，和毫无疑问相反;nervous=nervous means worried, not sure with no doubt=nervous 是紧张担心，不是毫无疑问|be certain that · for certain|adverb *certainly*|副词 *certainly*
      uncertain|a club's future nobody knows;a course that can't be decided;a concert date not decided yet|uncertain means not sure or not decided; certain means sure|uncertain 是不确定的；certain 是确定的|certain=certain means sure, not undecided=certain 是确定的，不是没决定的;clear=clear means easy to understand and decided, not unsure=clear 是清楚明白、已经确定的，不是不确定|uncertain about · an uncertain future|un- plus *certain*|un- 加 *certain*
      obvious|something anyone can see;an answer you should see;freezing water as the reason|obvious means easy to see or understand; uncertain means not sure|obvious 是明显的；uncertain 是不确定的|uncertain=uncertain means not sure, not easy to see=uncertain 是不确定，不是显而易见;secret=secret means hidden, not easy for anyone to see=secret 是保密的，不是谁都看得出|it's obvious that · for obvious reasons|adverb *obviously*|副词 *obviously*
      personally|tea as just my opinion;a mistake others may not agree with;horror films my friends love|personally gives your own opinion; definitely means with no doubt|personally 是就个人而言；definitely 是肯定地|definitely/Definitely=definitely means with no doubt, not one person's own view=definitely 是毫无疑问，不是只代表个人的看法;totally/Totally=totally means completely, not giving your own opinion=totally 是完全地，不是表达个人看法|personally, I think · I personally|*personally* is often at the start, with a comma|*personally* 常放句首，后面加逗号
      definitely|a party I can't wait for;the best pizza with no doubt;an answer that won't miss it|definitely means with no doubt; maybe means perhaps|definitely 是肯定；maybe 是也许|maybe/Maybe=maybe means perhaps, not with no doubt=maybe 是也许，不是毫无疑问;never/Never=never means not at any time, the opposite of surely doing it=never 是从不，和肯定会做相反|definitely not · I'll definitely|*definitely*, not *definately*|拼作 *definitely*，不是 *definately*
      totally|a meeting not remembered at all;films with nothing in common;agreement in every way|totally means completely; nearly means almost|totally 是完全地；nearly 是几乎|nearly=nearly means almost but not quite, not completely=nearly 是差一点，不是完全;slightly=slightly means a little, not completely=slightly 是稍微，不是完全|totally different · I totally agree|from *total*|来自 *total*
      strongly|a belief with all my heart;a rule she wrote to the head teacher about;an umbrella before a downpour|strongly means very much; slightly means a little|strongly 是强烈地；slightly 是稍微|slightly=slightly means a little, not very much=slightly 是稍微，不是非常;quietly=quietly means without much noise, not very much=quietly 是安静地，不是非常|strongly believe · strongly disagree|from *strong*|来自 *strong*
      absolutely|the best view I've ever seen;agreeing completely;right in every way|absolutely means completely; nearly means almost|absolutely 是完全地；nearly 是几乎|nearly/Nearly=nearly means almost, not completely=nearly 是几乎，不是完全;slightly/Slightly=slightly means a little, not completely=slightly 是稍微，不是完全|absolutely right · absolutely beautiful|*Absolutely!* alone means a strong yes|单说 *Absolutely!* 表示非常肯定的“是”
    `,
  },
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
  const item = saidOf(shown);
  const spoken = item ? spokenVerb(item[1], item[3], item[4][0]) : wrong;
  if (right === "were" && wrong === "was")
    return t("*was* is for one person or thing, but the reported subject is plural.", "*was* 用于单数主语，但这里转述的主语是复数。");
  if (position === 0 && wrong === "am" && spoken !== "am" && spoken !== "'m")
    return t("*am* goes only with *I*, and it is not a past form.", "*am* 只和 *I* 连用，而且不是过去式。");
  if (position === 0)
    return t(
      `*${wrong}* stays in the present tense as originally spoken, without moving one step back after *said*.`,
      `*${wrong}* 保留了原话里的现在时，没有在 *said* 后面往过去退一步。`,
    );
  if (wrong === "not") return t("*not* alone has no auxiliary verb to form a past negative.", "只有 *not*，缺少构成过去否定的助动词。");
  return t(`*${wrong}* is not the past form needed after *said*.`, `*${wrong}* 不是 *said* 后面需要的过去形式。`);
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
const whyNotPronoun = (wrong: string, _right: string, shown: string, position: number): Text => {
  const name = saidOf(shown)?.[0] ?? "the speaker";
  return position === 0
    ? t(
        `*${wrong}* is the speaker's own direct-speech word, which must shift to match ${name} in reported speech.`,
        `*${wrong}* 是直接引语里说话人自己的用词，转述时要改成对应 ${name} 的代词。`,
      )
    : t(
        `*${wrong}* refers to ${/^(he|his)$/u.test(wrong) ? "a man" : "a woman"}, which does not match ${name}.`,
        `*${wrong}* 指的是${/^(he|his)$/u.test(wrong) ? "男性" : "女性"}，与 ${name} 不一致。`,
      );
};

/** reportWhy explains a written report: the pronoun changes and the verb moves back. */
const reportWhy = (right: string): Text => {
  const item = saidOf(right);
  const back = backRule(right);
  if (!item)
    return t(
      `${back.en}: ${right}\n\n**Check.** Verify that the quotation marks are gone, the pronoun fits the speaker, and the verb has shifted back into the past.`,
      `${back["zh-CN"]}：${right}\n\n**检验。** 确认已去掉引号、代词与说话人一致，且动词已往过去退一步。`,
    );
  const [name, words, report] = item;
  const pronoun = pronounRule(report.split(" ")[0] ?? "", quoteOf(name, words));
  return t(
    `${pronoun.en}, and ${back.en.replace(/^After/u, "after")}: ${right}\n\n**Check.** Compare the original quote with your report: *I/my* now matches ${name}, and the verb has shifted back one tense after *said*.`,
    `${pronoun["zh-CN"]}；${back["zh-CN"]}：${right}\n\n**检验。** 对照原话和转述句：*I/my* 已改成对应 ${name} 的代词，且 *said* 后的动词已往过去退一步。`,
  );
};

const reportedSpeech: TopicDef = {
  id: "reported-speech",
  title: t("She Said She Was Tired", "她说她累了（间接引语）"),
  summary: t(
    '"I am tired," she said becomes She said that she was tired: the verb moves back in time, and I and my become she and her.',
    '"I am tired," she said 变成 She said that she was tired：动词往过去退一步，I 和 my 变成 she 和 her。',
  ),
  intro: t(
    "When you pass on someone's words later—*\"I like the news,\" Ben said* → *Ben said that he liked the news*—two things shift together: the speaker's *I/my* becomes *he/his* or *she/her*, and the present verb moves one step back into the past.",
    '转述别人的话时（*"I like the news," Ben said* → *Ben said that he liked the news*），有两处联动变化：说话人的 *I/my* 变成 *he/his* 或 *she/her*，现在时动词往过去退一步。',
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
        "When you report what someone said with *said*, the verb usually moves back in time:\n\n- *am / is* → *was*, *are* → *were*\n- *like* → *liked*, *go* → *went*, *have* → *had*\n- *don't / doesn't* → *didn't*\n- *am reading* → *was reading*\n\n*\"I am tired,\" Anna said.* → *Anna said that she **was** tired.* You can leave out *that*: *Anna said she was tired.*\n\n> **Watch out.** Do not leave the verb in the present after *said* (*Anna said she is tired* misses the backshift taught here), and remember *don't/doesn't* becomes *didn't* + plain verb.",
        "用 *said* 转述别人的话时，动词通常往过去退一步：\n\n- *am / is* → *was*，*are* → *were*\n- *like* → *liked*，*go* → *went*，*have* → *had*\n- *don't / doesn't* → *didn't*\n- *am reading* → *was reading*\n\n*\"I am tired,\" Anna said.* → *Anna said that she **was** tired.* *that* 可以省略。\n\n> **注意。** 中文转述时动词不变（“她说她累了”），但英语在 *said* 后面要把现在时退成过去式，否定 *don't/doesn't* 变成 *didn't* 加动词原形。",
      ),
      choiceGenerator(
        t("Choose the words for the gap.", "选出填入空白处的词。"),
        backChoice,
        (right, shown) => {
          const rule = backRule(shown);
          return t(
            `${rule.en}: ${fill(shown, right)}\n\n**Check.** Spot *said* at the start and confirm the verb (*${right}*) has shifted back into the past and agrees with its subject.`,
            `${rule["zh-CN"]}：${fill(shown, right)}\n\n**检验。** 看句首的 *said*，确认动词 *${right}* 已往过去退一步且与主语一致。`,
          );
        },
        whyNotBack,
      ),
    ),
    point(
      "pronouns",
      t("I becomes he or she", "I 变成 he 或 she"),
      t(
        "The speaker's *I* and *my* change to fit the person you are talking about: *\"I love my job,\" Amy said.* → *Amy said that **she** loved **her** job.* A man's *I* becomes *he* and his *my* becomes *his*; a woman's become *she* and *her*.\n\n> **Watch out.** Do not keep the speaker's *I* or *my* inside reported speech, and match the pronoun to the speaker's name (*he/his* vs. *she/her*).",
        '说话人的 *I* 和 *my* 要按所指的人改变：*"I love my job," Amy said.* → *Amy said that **she** loved **her** job.* 男性说的 *I* 变成 *he*，*my* 变成 *his*；女性说的变成 *she* 和 *her*。\n\n> **注意。** 转述时不要保留原话的 *I* 或 *my*，并根据说话人核对 *he/his* 还是 *she/her*。',
      ),
      choiceGenerator(
        t("Choose the word for the gap.", "选出填入空白处的词。"),
        pronounChoice,
        (right, shown) => {
          const rule = pronounRule(right, shown);
          return t(
            `${rule.en}: ${fill(shown, right)}\n\n**Check.** Check who spoke the quote and whether the gap needs a subject (*he/she*) or a possessive (*his/her*).`,
            `${rule["zh-CN"]}：${fill(shown, right)}\n\n**检验。** 核对说话人是谁，以及空白处需要主格（*he/she*）还是所有格（*his/her*）。`,
          );
        },
        whyNotPronoun,
      ),
    ),
    point(
      "write",
      t("Reporting what people said", "转述别人的话"),
      t(
        'Write the report of the words: start with the speaker and *said that*, change *I* and *my*, and move the verb back. *"I have a cold," Ryan said.* → *Ryan said that he had a cold.* You may leave out *that*.\n\n> **Watch out.** Make both changes together—shift the pronoun AND shift the verb—and drop the quotation marks.',
        '转述这句话：以说话人和 *said that* 开头，改变 *I* 和 *my*，把动词往过去退一步。*"I have a cold," Ryan said.* → *Ryan said that he had a cold.* 可以省略 *that*。\n\n> **注意。** 两处改动别漏其一——代词要换、动词也要退成过去式，并去掉引号。',
      ),
      typedGenerator(
        "sentence-pattern",
        t("Report what the person said. Begin with the person's name and said.", "转述这个人说的话，以人名和 said 开头。"),
        reportTyped,
        reportWhy,
        reportedSpeechWriteNot,
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
  intro: t(
    "A magazine article pulls readers in from the very first line: *Have you ever wondered what happens when a whole class gives up phones for a week?* A catchy title, focused paragraphs, and a direct closing keep readers scrolling to the end.",
    "杂志文章第一句就要抓住读者：*Have you ever wondered what happens when a whole class gives up phones for a week?* 亮眼标题、清晰分段加上面向读者的收尾，才能让人一口气读完。",
  ),
  prerequisites: ["writing-a-paragraph"],
  encompasses: [{ topic: "writing-a-paragraph", weight: 0.3 }],
  criteria: ["b1-article-title-and-opening", "b1-article-paragraphs", "b1-article-reader"],
  point: {
    id: "article",
    title: t("Title, opening and paragraphs", "标题、开头和段落"),
    explanation: t(
      "An article is written for readers who can stop reading at any time, so it must keep them interested:\n\n- **A title** that says what the article is about or makes the reader curious: *A Week Without My Phone*.\n- **An opening** that catches the reader: a question (*Are you bored at the weekend?*), a surprising fact or a short scene.\n- **Two or three paragraphs**, each about one main idea, joined with words such as *first*, *however* and *finally*.\n- **An ending** that speaks to the reader: advice, a question or an invitation (*Why don't you try it too?*).\n\n> **Watch out.** Do not forget a title or start with a dull announcement like *Today I will write about...*—hook the reader directly and address them as *you*.",
      "文章的读者随时可能停止阅读，所以要让他们一直有兴趣：\n\n- **标题**：说明文章写什么，或者让读者好奇：*A Week Without My Phone*。\n- **开头**要吸引读者：一个问题（*Are you bored at the weekend?*）、一个出人意料的事实或一个小场景。\n- **两三个段落**，每段写一个主要意思，用 *first*、*however*、*finally* 等词连接。\n- **结尾**要面向读者：提建议、提问题或发出邀请（*Why don't you try it too?*）。\n\n> **注意。** 别漏掉标题，也不要用沉闷的 *Today I will write about...* 开头——直接用问题或场景抓住读者，并用 *you* 与读者对话。",
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
