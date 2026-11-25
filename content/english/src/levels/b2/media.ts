// B2, unit 5: Media and Persuasion. Journalism, persuasion, advertising, information and trust, reporting verbs, online
// media, logic, tone and attitude, film and television, public opinion, and linking words; the patterns of reporting
// verbs. Its other topics, participial phrases, the body paragraph with evidence and varied openings, already exist.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill } from "../a2/kit.ts";
import { interleave, vocabularyTopic, word } from "../words.ts";

const journalism = vocabularyTopic({
  id: "b2-words-journalism",
  title: t("Journalism", "新闻业"),
  summary: t(
    "Coverage of events; correspondents and eyewitnesses; investigative and exclusive stories; columns, columnists and editorials; tabloids and their circulation; news anchors and commentators.",
    "事件的报道；记者和目击者；调查性报道和独家新闻；专栏、专栏作家和社论；小报及其发行量；新闻主播和评论员。",
  ),
  intro: t(
    "A **correspondent** sent a report from the scene, an **eyewitness** told her what happened, and the next morning a **columnist** gave her opinion in the paper. These words help you talk about who makes the news and the kinds of articles they write.",
    "一名 **correspondent**（驻外记者）从现场发回报道，一位 **eyewitness**（目击者）告诉她发生了什么，第二天早上，一位 **columnist**（专栏作家）在报上发表了自己的看法。这些词帮你谈论谁在制作新闻，以及他们写的各类文章。",
  ),
  prerequisites: ["b1-words-news"],
  words: [
    word(
      "coverage",
      "the reporting of an event in newspapers, on television or online",
      "新闻报道；覆盖范围",
      "The election got a lot of {coverage} on TV. | Live {coverage} of the match starts at eight. | The newspaper's {coverage} of the war, with reporters at every front line, won prizes.",
      "circulation editorial",
    ),
    word(
      "correspondent correspondents",
      "a journalist who reports from a particular place or on a particular subject",
      "记者；通讯员",
      "Our {correspondent} in Beijing sent this news report from outside the court. | She works as a foreign {correspondent} in Africa. | The health {correspondent} reported from the hospital where the new drug was tested.",
      "columnist eyewitness",
    ),
    word(
      "investigative",
      "trying to find out facts that someone has hidden",
      "调查性的",
      "{Investigative} journalists dug through secret files for months to uncover the scandal. | Her {investigative} reporting, which uncovered secret payments to the mayor, took a whole year. | Good {investigative} journalism, digging out facts that powerful people hide, costs a lot of money.",
      "exclusive inventive",
    ),
    word(
      "exclusive",
      "published by only one newspaper or channel; only for a few people",
      "独家的；专有的",
      "The magazine has an {exclusive} interview with the star. | The paper paid a lot for the {exclusive} rights to her story. | It's a very {exclusive} club: only twenty people can join.",
      "investigative inclusive",
    ),
    word(
      "column columns",
      "a regular article by the same writer in a newspaper; a tall stone post",
      "专栏；柱子",
      "She writes a weekly {column} about food. | I always read his {column} in the Sunday paper. | The roof rests on stone {columns}.|tabloids anchors",
      "tabloid anchor",
      "editorial",
    ),
    word(
      "columnist columnists",
      "a journalist who writes a regular column",
      "专栏作家",
      "The {columnist} gives her own opinion about politics in the paper every Monday. | Several {columnists} criticized the decision in their weekly opinion pieces.|correspondents eyewitnesses | At twenty-two she became the paper's youngest {columnist}, with her own opinion page every Friday.",
      "correspondent eyewitness",
      "commentator",
    ),
    word(
      "editorial editorials",
      "an article in a newspaper that gives the opinion of its editors",
      "社论",
      "Today's {editorial} calls for lower taxes. | The paper's {editorial} openly supported the president, as its editors do before every election. | The {editorial} argued that the law was unfair.",
      "coverage circulation",
      "column",
    ),
    word(
      "tabloid tabloids",
      "a newspaper with small pages, short stories and many pictures, often about famous people",
      "小报；通俗小报",
      "The {tabloids} printed photos of the singer's wedding.|editorials columns | {Tabloid} newspapers love scandals. | On the train he reads the {tabloid}, full of gossip and big photos of stars.",
      "editorial column",
    ),
    word(
      "circulation",
      "the number of copies of a newspaper that are sold; the movement of blood around the body",
      "发行量；循环",
      "The newspaper has a {circulation} of two million. | Print {circulation} is falling: fewer copies are sold every year. | Exercise improves your {circulation}, so more blood reaches your hands and feet.",
      "coverage calculation",
    ),
    word(
      "anchor anchors",
      "the person who presents the news on television; a heavy object that keeps a ship in place",
      "新闻主播；锚",
      "The news {anchor} read the headlines from the studio at nine. | She became the first woman {anchor} to present the evening news from the studio. | The ship dropped {anchor} near the island.",
      "commentator correspondent",
    ),
    word(
      "commentator commentators",
      "a person who describes an event as it happens, or who discusses the news",
      "评论员；解说员",
      "The football {commentator} got very excited. | Political {commentators} expect the minister to resign.|anchors eyewitnesses | The {commentator} described every move of the race to millions of listeners on the radio.",
      "anchor eyewitness",
      "columnist",
    ),
    word(
      "eyewitness eyewitnesses",
      "a person who saw an event happen",
      "目击者",
      "One {eyewitness}, who was standing at the bus stop, said the car was going very fast. | Police are looking for {eyewitnesses} to the accident.|columnists anchors | {Eyewitnesses} who saw the explosion from their windows described a loud bang.|columnists anchors",
      "columnist anchor",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "A *correspondent* reports news from a place, while a *columnist* gives an opinion in a regular piece. Ask whether the person in the sentence is at the scene or writing an opinion.",
        "*correspondent* 从某地报道新闻，*columnist* 在固定专栏里发表观点。想想句中的人是在现场报道，还是在写评论。",
      ),
      meaning: t(
        "*Coverage* is all the reporting of an event, while *circulation* is the number of copies a paper sells. Check whether the meaning is about reporting or about copies.",
        "*coverage* 是对一件事的全部报道，*circulation* 是报纸卖出的份数。看释义说的是报道，还是份数。",
      ),
      spell: t(
        "*Columnist* keeps the silent n of *column*, which you hear in *columnist*, and *commentator* has a double m.",
        "*columnist* 保留了 *column* 里不发音的 n，在 *columnist* 中这个 n 要读出来；*commentator* 双写 m。",
      ),
    },
    notes: `
      coverage|an election reported on TV;a match shown live;reporting of a war from every front line|coverage is all the reporting of an event; circulation is the number of copies sold|coverage 是新闻报道；circulation 是发行量|circulation=circulation is the number of copies a paper sells, not the reporting of an event=circulation 是报纸的发行量，不是对事件的报道;editorial=an editorial is one article giving the editors' opinion, not all the reporting of an event=editorial 是表达编辑观点的一篇社论，不是对事件的全部报道|cov · er · age|cover + age, with the e of -age silent at the end|cover + age，词尾 e 不发音
      correspondent|a news report sent from outside a court in Beijing;a reporter working abroad in Africa;reporting from a hospital where a drug was tested|a correspondent reports news from a place; a columnist writes a regular opinion piece|correspondent 是驻外或专题记者；columnist 是专栏作家|columnist/columnists=a columnist writes a regular opinion piece, not news reports sent from a place=columnist 撰写固定的评论专栏，不是从某地发回新闻报道的人;eyewitness/eyewitnesses=an eyewitness is anyone who saw an event, not a journalist who reports for a paper=eyewitness 是看到事件的任何人，不是为报社报道的记者|cor · re · spond · ent|a double r, and the ending -ent, not -ant|双写 r，结尾是 -ent，不是 -ant
      investigative|secret files searched for months;secret payments to a mayor uncovered;facts that powerful people hide|investigative means digging out hidden facts; exclusive means given to only one paper|investigative 是调查性的；exclusive 是独家的|exclusive=exclusive means given to only one paper or open to only a few, not digging out hidden facts=exclusive 是独家的或只限少数人的，不是挖掘隐藏事实的;inventive=inventive means good at thinking of new ideas, not finding out facts that someone has hidden=inventive 是有创意的，不是查出别人隐藏的事实|in · ves · ti · ga · tive|investigate with the e dropped, then -ive|investigate 去掉 e 再加 -ive
      exclusive|an interview with a star in only one magazine;rights to a story paid for by one paper;a club only twenty people can join|exclusive means only for one paper or a few people; inclusive means open to everyone|exclusive 是独家的、专有的；inclusive 是包容的|investigative=investigative means digging out hidden facts, not given only to one paper or a few people=investigative 是调查性的，不是只给一家媒体或少数人的;inclusive=inclusive means open to everyone, the opposite of being only for one paper or a few people=inclusive 是对所有人开放的，和独家、限少数人正相反|ex · clu · sive|ex + clu + sive, ending in -sive|ex + clu + sive，以 -sive 结尾
      column|a weekly piece about food;a regular piece in the Sunday paper;stone posts holding up a roof|a column is a regular article by one writer or a stone post; a tabloid is a whole newspaper|column 是专栏或柱子；tabloid 是小报|tabloid/tabloids=a tabloid is a whole newspaper of short stories and pictures, not one writer's regular article or a stone post=tabloid 是一整份通俗小报，不是某位作者的固定文章，也不是石柱;anchor/anchors=an anchor presents the news or holds a ship in place, not a regular article or a stone post=anchor 是新闻主播或锚，不是固定文章，也不是柱子|col · umn|the silent n at the end|词尾 n 不发音
      columnist|a writer's own opinion about politics every Monday;weekly opinion pieces criticizing a decision;an opinion page every Friday|a columnist writes a regular opinion piece; a correspondent reports news from a place|columnist 是专栏作家；correspondent 是驻地记者|correspondent/correspondents=a correspondent reports news from a place, not a writer of a regular opinion piece=correspondent 从某地报道新闻，不是写固定评论专栏的人;eyewitness/eyewitnesses=an eyewitness is someone who saw an event, not a journalist with a regular column=eyewitness 是目击事件的人，不是有固定专栏的记者|col · um · nist|column + ist, where the n of *column* is now heard|column + ist，*column* 里的 n 在这里要读出来
      editorial|a call for lower taxes;the editors' open support for a president;an argument that a law was unfair|an editorial gives the opinion of the paper's editors; coverage is the reporting of events|editorial 是社论；coverage 是新闻报道|coverage=coverage is all the reporting of an event, not one article giving the editors' opinion=coverage 是对事件的报道，不是表达编辑观点的一篇文章;circulation=circulation is the number of copies a paper sells, not an article that argues something=circulation 是发行量，不是发表论点的文章|ed · i · to · ri · al|editor + ial|editor + ial
      tabloid|photos of a singer's wedding;newspapers that love scandals;a paper full of gossip and big photos of stars|a tabloid is a newspaper of gossip and pictures; an editorial is one opinion article|tabloid 是小报；editorial 是社论|editorial/editorials=an editorial is one article giving the editors' opinion, not a whole paper full of gossip and photos=editorial 是一篇社论，不是满是八卦和照片的整份报纸;column/columns=a column is one writer's regular article, not a whole paper full of gossip and photos=column 是某位作者的固定专栏，不是满是八卦和照片的整份报纸|tab · loid|the ending -oid, as in *android*|结尾是 -oid，和 *android* 一样
      circulation|two million copies;fewer copies sold every year;more blood reaching the hands and feet|circulation is the number of copies sold or the movement of blood; coverage is the reporting of an event|circulation 是发行量或血液循环；coverage 是报道|coverage=coverage is the reporting of an event, not a number of copies sold or the movement of blood=coverage 是报道，不是发行份数或血液循环;calculation=a calculation is working out a number with maths, not copies sold or the movement of blood=calculation 是计算，不是发行份数或血液循环|cir · cu · la · tion|circ + u + la + tion, with c sounding like s|circ + u + la + tion，c 读作 s
      anchor|headlines read from the studio at nine;the first woman presenting the evening news;a ship stopping near an island|an anchor presents the news from the studio or holds a ship; a correspondent reports from a place|anchor 是新闻主播或锚；correspondent 是驻地记者|commentator/commentators=a commentator describes or discusses events, not the presenter of the news in the studio or the weight that holds a ship=commentator 是解说或评论的人，不是演播室主播，也不是固定船只的锚;correspondent/correspondents=a correspondent reports from a place, not the presenter in the studio or the weight that holds a ship=correspondent 在外地报道，不是演播室主播，也不是锚|an · chor|ch sounding like k|ch 读作 k
      commentator|an excited voice at a football match;experts expecting a minister to resign;every move of a race described on the radio|a commentator describes an event or discusses the news; an anchor presents the news|commentator 是解说员或评论员；anchor 是新闻主播|anchor/anchors=an anchor presents the news from the studio, not someone who describes a match or discusses politics=anchor 在演播室播报新闻，不是解说比赛或评论政治的人;eyewitness/eyewitnesses=an eyewitness simply saw an event, not someone whose job is to describe or discuss it=eyewitness 只是看到了事件，不是以解说或评论为业的人|com · men · ta · tor|comment + a + tor, with a double m|comment + a + tor，双写 m
      eyewitness|a man at a bus stop who saw a fast car;people who saw an accident;people who saw an explosion from their windows|an eyewitness is a person who saw an event; a columnist writes opinions for a paper|eyewitness 是目击者；columnist 是专栏作家|columnist/columnists=a columnist writes a regular opinion piece, not simply a person who saw something happen=columnist 写固定评论专栏，不只是看到事情发生的人;anchor/anchors=an anchor presents the news in a studio, not a person who saw something happen=anchor 在演播室播新闻，不是亲眼看到事件的人|eye · wit · ness|eye + witness as one word, with a double s|eye + witness 连写，双写 s
    `,
  },
});

const persuasion = vocabularyTopic({
  id: "b2-words-persuasion",
  title: t("Persuasion", "说服"),
  summary: t(
    "Persuasion and propaganda; manipulating people and manipulation; appeals; slogans and rhetoric; exaggerating and exaggeration; endorsing and sponsoring; testimonials.",
    "说服和宣传；操纵；呼吁和吸引；口号和修辞；夸大；代言和赞助；顾客推荐。",
  ),
  intro: t(
    "The party's new **slogan** was everywhere, a famous actor agreed to **endorse** the candidate, and critics said the posters **exaggerate** what the plan can do. These words help you see how people try to change what you think and do.",
    "这个党的新 **slogan**（口号）随处可见，一位名演员答应公开 **endorse**（支持）这位候选人，批评者则说海报 **exaggerate**（夸大）了计划的作用。这些词帮你看清别人怎样设法改变你的想法和做法。",
  ),
  prerequisites: ["b1-words-opinions"],
  words: [
    word(
      "persuasion",
      "making someone agree or do something by giving reasons",
      "说服；劝说",
      "After some {persuasion}, she agreed to come. | Lawyers study the art of {persuasion}: winning people over with good reasons. | It took hours of patient {persuasion}, with reason after reason, to change his mind.",
      "propaganda exaggeration",
    ),
    word(
      "propaganda",
      "false or one-sided information spread to make people support a political idea",
      "（政治）宣传",
      "During the war, both sides spread {propaganda}: posters full of lies about the enemy. | The film was pure {propaganda}, made by the government to hide the truth from the people. | Every night, state TV broadcasts {propaganda}: false stories that make the leader look perfect.",
      "rhetoric persuasion",
    ),
    word(
      "manipulate manipulates manipulated manipulating",
      "to control or influence someone in a clever, unfair way",
      "操纵；摆布",
      "Advertisers {manipulate} our feelings. | He {manipulated} the figures to make them look better.|endorsed persuaded | She felt she had been {manipulated} into agreeing by tricks she only noticed later.|endorsed persuaded",
      "endorse persuade",
    ),
    word(
      "manipulation",
      "controlling or influencing someone or something in a clever, unfair way",
      "操纵；控制",
      "The documents show clear {manipulation} of the data: numbers were secretly changed. | Children are easy targets for {manipulation}: clever adverts control what they want without their noticing. | {Manipulation} of photos is easy with modern software.",
      "persuasion testimonial",
    ),
    word(
      "appeal appeals appealed appealing",
      "a serious public request for help; to make such a request; to attract or interest someone",
      "呼吁；吸引",
      "The police {appealed} for witnesses.|endorsed sponsored | The advert {appeals} to our fear of missing out.|endorses sponsors | The charity made an {appeal} on TV, asking the public to give money for the flood victims.|exaggeration endorsement",
      "endorse sponsor",
    ),
    word(
      "slogan slogans",
      "a short phrase that is easy to remember, used in advertising or politics",
      "口号；标语",
      '"Just do it" is a famous {slogan}. | The protesters shouted {slogans}.|testimonials sponsors | The party needs a catchy {slogan}.',
      "testimonial sponsor",
    ),
    word(
      "rhetoric",
      "language that is meant to persuade or impress, often without much real meaning",
      "修辞；花言巧语",
      "His speech was full of empty {rhetoric}: grand words with no real plan behind them. | Voters are tired of fine-sounding political {rhetoric} that never turns into action. | She studied {rhetoric}, the art of speaking well.",
      "persuasion propaganda",
    ),
    word(
      "exaggerate exaggerates exaggerated exaggerating",
      "to say that something is bigger, better or worse than it really is",
      "夸大；夸张",
      "Don't {exaggerate}: it wasn't that bad. | The advert {exaggerates} the benefits: the cream will not make you look twenty years younger.|endorses appeals | Reports of the damage were {exaggerated}: only one window was broken, not the whole building.|endorsed appealed",
      "endorse appeal",
    ),
    word(
      "exaggeration",
      "a statement that makes something seem bigger, better or worse than it is",
      "夸张的说法",
      'It is no {exaggeration} to say that the internet changed everything. | The report was full of {exaggeration}: a small fire became "a huge disaster". | His story was a wild {exaggeration}.',
      "persuasion manipulation",
    ),
    word(
      "endorse endorses endorsed endorsing",
      "to say publicly that you support a person, a product or an idea",
      "（公开）支持；代言",
      "Several famous athletes {endorse} the brand. | The newspaper {endorsed} the candidate, telling its readers to vote for her.|manipulated exaggerated | I can't {endorse} a plan I don't believe in.",
      "manipulate exaggerate",
      "sponsor",
    ),
    word(
      "sponsor sponsors sponsored sponsoring",
      "a company that pays for an event in return for advertising; to pay for something in this way",
      "赞助商；赞助",
      "A bank {sponsors} the football team, so its name is printed on every shirt.|manipulates appeals | The concert was {sponsored} by a phone company.|manipulated appealed | The team is looking for a new {sponsor} to pay for its travel.|slogan testimonial",
      "manipulate appeal",
      "endorse",
    ),
    word(
      "testimonial testimonials",
      "a statement by a customer about how good a product or service is",
      "（顾客的）推荐；证明书",
      "The website is full of {testimonials} from happy customers.|slogans sponsors | The advert uses {testimonials} in which doctors say how well the cream worked for their patients.|slogans sponsors | She wrote a glowing {testimonial} for the company.",
      "slogan sponsor",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Persuasion* wins someone over honestly with reasons, while *manipulation* controls them with clever, unfair tricks. Look for words in the sentence that show whether the method is fair or hidden.",
        "*persuasion* 是用理由坦诚地说服人，*manipulation* 是用巧妙而不正当的手段操纵人。在句中找出说明手段是公开正当还是暗中操纵的词。",
      ),
      meaning: t(
        "To *endorse* is to say in public that you support something, while to *sponsor* is to pay for it in return for advertising. Check whether the meaning is about words of support or about money.",
        "*endorse* 是公开表示支持，*sponsor* 是出钱赞助、换取广告。看释义说的是口头支持，还是出钱。",
      ),
      spell: t(
        "*Exaggerate* has a double g and only one r, and *rhetoric* has a silent h after the r.",
        "*exaggerate* 双写 g，只有一个 r；*rhetoric* 的 r 后面有个不发音的 h。",
      ),
    },
    notes: `
      persuasion|a friend who agreed to come in the end;winning people over with good reasons;reason after reason that changed a mind|persuasion wins someone over with reasons; manipulation controls them with unfair tricks|persuasion 是以理服人；manipulation 是用不正当手段操纵|propaganda=propaganda is one-sided political information spread to many people, not giving one person good reasons=propaganda 是向大众散布的片面政治宣传，不是给一个人讲道理;exaggeration=exaggeration makes something seem bigger than it is, not giving reasons that win someone over=exaggeration 是把事情说大，不是用理由说服人|per · sua · sion|persuade with -de changed to -sion|persuade 把 -de 变成 -sion
      propaganda|posters full of lies about the enemy;a film made by a government to hide the truth;false stories making a leader look perfect|propaganda is false or one-sided information spread for a political side; rhetoric is impressive language|propaganda 是政治宣传；rhetoric 是修辞、花言巧语|rhetoric=rhetoric is language meant to impress, not false information spread so that people support a government=rhetoric 是用来打动人的言辞，不是让人支持政府而散布的虚假信息;persuasion=persuasion is winning someone over with reasons, not false one-sided information spread by a state=persuasion 是讲道理说服人，不是国家散布的片面虚假信息|prop · a · gan · da|prop + a + gan + da, ending in -a|prop + a + gan + da，以 -a 结尾
      manipulate|adverts working on our feelings;figures changed to look better;tricks noticed only later|to manipulate is to control someone unfairly; to persuade is to win them over with reasons|manipulate 是操纵；persuade 是说服|endorse/endorsed=endorse means to say publicly that you support something, not to control people or change figures unfairly=endorse 是公开表示支持，不是暗中操纵人或篡改数字;persuade/persuaded=persuade means to win someone over honestly with reasons, not to control them with hidden tricks=persuade 是用理由坦诚地说服，不是用暗中的手段控制人|ma · nip · u · late|man + ip + u + late, with one n and one p|man + ip + u + late，n 和 p 都只有一个
      manipulation|data whose numbers were secretly changed;children controlled by clever adverts without noticing;photos changed with software|manipulation is unfair, hidden control; persuasion is open reasoning|manipulation 是暗中操纵；persuasion 是公开说理|persuasion=persuasion is winning someone over openly with reasons, not changing data or controlling people without their noticing=persuasion 是公开讲理说服，不是篡改数据或在人不知不觉中控制他们;testimonial=a testimonial is a customer's statement praising a product, not unfair control of people or data=testimonial 是顾客对产品的推荐，不是对人或数据的操纵|ma · nip · u · la · tion|manipulate with the e dropped, then -ion|manipulate 去掉 e 再加 -ion
      appeal|police asking the public for witnesses;an advert playing on the fear of missing out;a charity asking on TV for money for flood victims|an appeal is a public request or an attraction; an endorsement is public support|appeal 是呼吁或吸引；endorse 是公开支持|endorse/endorsed/endorses=endorse means to say publicly that you support someone or something, not to ask the public for help or to attract people=endorse 是公开支持，不是向公众求助或吸引人;sponsor/sponsored/sponsors=sponsor means to pay for something in return for advertising, not to ask the public for help or to attract people=sponsor 是出钱赞助，不是向公众求助或吸引人;exaggeration=an exaggeration makes something seem bigger than it is, not a request to the public for help=exaggeration 是夸大其词，不是向公众求助;endorsement=an endorsement is public support for a product or a person, not a request to the public for help=endorsement 是公开代言或认可，不是向公众求助|ap · peal|a double p, and -eal as in *meal*|双写 p，-eal 和 *meal* 的读法一样
      slogan|the famous phrase "Just do it";phrases shouted by protesters;a catchy phrase a party needs|a slogan is a short phrase that is easy to remember; a testimonial is a customer's statement|slogan 是口号；testimonial 是顾客推荐|testimonial/testimonials=a testimonial is a customer's statement about how good a product is, not a short catchy phrase=testimonial 是顾客对产品的评价，不是简短好记的口号;sponsor/sponsors=a sponsor is a company that pays for an event, not a short catchy phrase=sponsor 是出钱赞助的公司，不是口号|slo · gan|slo + gan, ending in -an|slo + gan，以 -an 结尾
      rhetoric|grand words with no real plan behind them;fine-sounding words that never turn into action;the art of speaking well|rhetoric is impressive language that may mean little; propaganda is false information spread for a political side|rhetoric 是修辞、空话；propaganda 是政治宣传|persuasion=persuasion is winning someone over with reasons, not impressive language with little real meaning=persuasion 是讲道理说服，不是华而不实的言辞;propaganda=propaganda is false or one-sided information spread for a government, not fine words or the art of speaking well=propaganda 是为政府散布的片面信息，不是漂亮话或演讲艺术|rhet · o · ric|a silent h after the r|r 后面的 h 不发音
      exaggerate|a bad day made to sound worse;a cream that will not make you look twenty years younger;one broken window reported as a whole building|to exaggerate is to make something sound bigger than it is; to endorse is to support it publicly|exaggerate 是夸大；endorse 是公开支持|endorse/endorses/endorsed=endorse means to say publicly that you support something, not to make it sound bigger or worse than it is=endorse 是公开支持，不是把事情说得更大或更糟;appeal/appeals/appealed=appeal means to ask the public for help or to attract people, not to make something sound bigger than it is=appeal 是呼吁或吸引，不是夸大|ex · ag · ger · ate|a double g and only one r|双写 g，只有一个 r
      exaggeration|saying the internet changed everything;a small fire called a huge disaster;a story that was much bigger than the truth|an exaggeration makes something seem bigger than it is; manipulation is unfair control|exaggeration 是夸张；manipulation 是操纵|persuasion=persuasion is winning someone over with reasons, not making something seem bigger than it is=persuasion 是讲理说服，不是把事情说大;manipulation=manipulation is controlling people or facts unfairly, not simply making something sound bigger=manipulation 是不正当地操纵人或事实，不只是夸大|ex · ag · ger · a · tion|a double g, then exaggerate without the final e, plus -ion|双写 g，exaggerate 去掉 e 再加 -ion
      endorse|famous athletes supporting a brand;a paper telling readers to vote for a candidate;a plan nobody believes in|to endorse is to support something publicly; to sponsor is to pay for it|endorse 是公开支持；sponsor 是出钱赞助|manipulate/manipulated=manipulate means to control someone unfairly, not to say openly that you support them=manipulate 是不正当地操纵，不是公开表示支持;exaggerate/exaggerated=exaggerate means to make something seem bigger than it is, not to say publicly that you support it=exaggerate 是夸大，不是公开支持|en · dorse|en + dorse, ending in a silent e|en + dorse，词尾 e 不发音
      sponsor|a bank whose name is on every shirt;a phone company paying for a concert;a company paying for a team's travel|a sponsor pays for something in return for advertising; to endorse is only to support it with words|sponsor 是出钱赞助；endorse 只是口头支持|manipulate/manipulates/manipulated=manipulate means to control someone unfairly, not to pay for an event or a team=manipulate 是操纵，不是出钱赞助活动或球队;appeal/appeals/appealed=appeal means to ask for help or to attract, not to pay for an event or a team=appeal 是呼吁或吸引，不是出钱赞助;slogan=a slogan is a short catchy phrase, not a company that pays for a team=slogan 是口号，不是出钱的公司;testimonial=a testimonial is a customer's statement, not a company that pays for a team=testimonial 是顾客推荐，不是出钱的公司|spon · sor|the ending -or, not -er|结尾是 -or，不是 -er
      testimonial|statements from happy customers on a website;doctors saying how well a cream worked;a glowing statement written for a company|a testimonial is a customer's statement praising a product; a slogan is a short catchy phrase|testimonial 是顾客推荐；slogan 是口号|slogan/slogans=a slogan is a short catchy phrase made by the company, not a customer's statement about how good a product is=slogan 是公司想出的口号，不是顾客对产品的评价;sponsor/sponsors=a sponsor is a company that pays for an event, not a statement from a customer=sponsor 是出钱的公司，不是顾客的评价|tes · ti · mo · ni · al|testimony with -y changed to -ial|testimony 的 -y 变成 -ial
    `,
  },
});

const advertising = vocabularyTopic({
  id: "b2-words-advertising",
  title: t("Advertising", "广告"),
  summary: t(
    "Commercials and marketing; billboards and logos; influencers and advertisers; viral videos and clickbait; endorsements; catchy jingles; publicity.",
    "广告片和市场营销；广告牌和标志；网红和广告商；疯传的视频和标题党；代言；朗朗上口的广告曲；宣传。",
  ),
  intro: t(
    "The new drink had a **catchy** **jingle**, its **logo** was on every **billboard**, and an **influencer** posted a video that went **viral**. These words help you talk about how companies get your attention and sell to you.",
    "这款新饮料有一段 **catchy**（朗朗上口的）**jingle**（广告曲），它的 **logo**（标志）出现在每一块 **billboard**（广告牌）上，还有一位 **influencer**（网红）发的视频 **viral**（迅速走红）了。这些词帮你谈论公司怎样吸引你的注意、向你推销。",
  ),
  prerequisites: ["b1-words-media"],
  words: [
    word(
      "commercial commercials",
      "an advertisement on television or radio; connected with buying and selling",
      "（电视、广播）广告；商业的",
      "The {commercial} for the new car, a short film about a happy family, is shown on TV every evening. | Their thirty-second TV {commercials}, with actors and a story, are shown during the match.|billboards jingles | The film was a huge {commercial} success, earning millions at the box office.|catchy comical",
      "billboard jingle",
    ),
    word(
      "marketing",
      "the work of advertising and selling products",
      "市场营销",
      "She works in {marketing} for a sports brand. | The company spends millions on {marketing}. | Social media is now central to {marketing}.",
      "clickbait jingle",
    ),
    word(
      "billboard billboards",
      "a very large board beside a road for advertisements",
      "广告牌",
      "A huge {billboard} stands beside the highway. | The city has banned {billboards}, the giant advertising boards, from the streets of the old town.|logos commercials | Her face is on {billboards} all over the city.|logos commercials",
      "logo commercial",
    ),
    word(
      "logo logos",
      "a small design that is the symbol of a company or a team",
      "标志；徽标",
      "The {logo} of the company is a red apple. | Their shirts have the team's {logo}, a small black horse, on the front. | The bank changed its {logo} from a blue circle to a green tree.",
      "slogan jingle",
    ),
    word(
      "influencer influencers",
      "a person with many followers online whom companies pay to show their products",
      "网红；（社交媒体）影响者",
      "The {influencer} posts videos of her outfits to five million followers. | Brands pay {influencers} to post about their products.|advertisers endorsements | At sixteen she became an {influencer}, with a million people following her videos online.",
      "advertiser endorsement",
    ),
    word(
      "viral",
      "spreading very quickly from person to person on the internet",
      "（网上）迅速传播的；病毒的",
      "The video went {viral} overnight. | A {viral} post, shared again and again from phone to phone, can reach millions of people in a day. | Nobody knows which videos will go {viral}.",
      "catchy vital",
    ),
    word(
      "clickbait",
      "headlines or pictures online that are made to make you click, often promising more than they give",
      "标题党；诱饵式标题",
      'That headline, "You won\'t believe what she did next!", is just {clickbait} to make you click. | Many websites earn money from {clickbait}: every click on a silly headline brings in advertising money. | {Clickbait} headlines promise more than the article gives.',
      "publicity marketing",
    ),
    word(
      "endorsement",
      "a public statement of support, especially by a famous person for a product",
      "代言；认可",
      "The singer earns more from {endorsement} deals than from music. | The candidate won the {endorsement} of the biggest union. | A doctor's {endorsement} makes a product seem trustworthy.",
      "publicity advertiser",
    ),
    word(
      "jingle jingles",
      "a short tune that is easy to remember, used in an advertisement",
      "（广告）短曲",
      "I can't stop humming that {jingle} from the radio advert. | The radio advert has a cheerful {jingle} played on a piano. | People still sing old TV {jingles} decades later.|logos slogans",
      "logo slogan",
    ),
    word(
      "catchy",
      "easy to remember and pleasant to hear",
      "易记的；朗朗上口的",
      "The song has a {catchy} tune that everyone remembers after one listen. | We need a {catchy} name for the product. | The slogan is short and {catchy}.",
      "viral patchy",
    ),
    word(
      "advertiser advertisers",
      "a person or company that advertises a product",
      "广告商；登广告者",
      "{Advertisers} pay for adverts that reach young people.|influencers billboards | The magazine lost several big {advertisers}.|influencers billboards | The TV channel depends on money from {advertisers}.|influencers billboards",
      "influencer billboard",
    ),
    word(
      "publicity",
      "attention given to someone or something by newspapers, television and the public",
      "宣传；公众关注",
      "The scandal got a lot of {publicity}. | The actor hates {publicity} and never talks to journalists. | The charity used the {publicity} from the news story to raise money.",
      "marketing clickbait",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Viral* is about how fast something spreads online, while *catchy* is about how easy a tune or a name is to remember. Ask whether the sentence talks about sharing or about remembering.",
        "*viral* 说的是在网上传播得多快，*catchy* 说的是曲子或名字多好记。想想句子说的是转发传播，还是容易记住。",
      ),
      meaning: t(
        "An *advertiser* is a company that pays for adverts, while an *influencer* is a person with many followers whom companies pay. Check whether the meaning is a company or a person online.",
        "*advertiser* 是出钱登广告的公司，*influencer* 是有很多粉丝、被公司付钱推广产品的人。看释义说的是公司，还是网上的个人。",
      ),
      spell: t(
        "*Billboard* has a double l, *commercial* has a double m, and *clickbait* is one word ending in -bait.",
        "*billboard* 双写 l，*commercial* 双写 m，*clickbait* 连写成一个词，以 -bait 结尾。",
      ),
    },
    notes: `
      commercial|a short TV film about a happy family selling a car;thirty-second TV films with actors shown during a match;a film earning millions at the box office|a commercial is an advert on TV or radio, or means connected with money; a billboard is an advert beside a road|commercial 是电视广告或商业的；billboard 是路边广告牌|billboard/billboards=a billboard is a big board beside a road, not a short film shown on TV=billboard 是路边的大广告牌，不是电视上播的短片;jingle/jingles=a jingle is a short tune in an advert, not a whole film with actors and a story=jingle 是广告里的短曲，不是有演员和情节的短片;catchy=catchy means easy to remember, not about earning money=catchy 是好记的，与赚钱无关;comical=comical means funny, not about earning money=comical 是滑稽的，与赚钱无关|com · mer · cial|a double m, and -cial sounding like "shul"|双写 m，-cial 读作 "shul"
      marketing|a job at a sports brand;millions spent by a company;the place of social media today|marketing is the whole work of advertising and selling; clickbait is only silly headlines online|marketing 是市场营销；clickbait 是标题党|clickbait=clickbait is headlines made to make you click, not the whole work of advertising and selling=clickbait 是诱人点击的标题，不是整个广告和销售工作;jingle=a jingle is one short tune in an advert, not the work of advertising and selling=jingle 是广告里的一段短曲，不是营销工作|mar · ket · ing|market + ing, with no double t|market + ing，t 不双写
      billboard|a huge board beside a highway;giant advertising boards banned from an old town;a face shown all over a city|a billboard is a very large board for adverts beside a road; a logo is a small design|billboard 是大型广告牌；logo 是小标志|logo/logos=a logo is a small design that stands for a company, not a giant board beside a road=logo 是代表公司的小图案，不是路边的大牌子;commercial/commercials=a commercial is an advert on TV or radio, not a board beside a road=commercial 是电视或广播广告，不是路边的牌子|bill · board|bill + board, with a double l|bill + board，双写 l
      logo|a red apple as a company's sign;a small black horse on a shirt;a blue circle changed to a green tree|a logo is a small design that is a company's sign; a slogan is a short phrase|logo 是标志图案；slogan 是口号|slogan/slogans=a slogan is a short phrase in words, not a small picture that stands for a company=slogan 是一句话，不是代表公司的图案;jingle/jingles=a jingle is a short tune you hear, not a design you see=jingle 是听到的短曲，不是看到的图案|lo · go|lo + go, ending in -o|lo + go，以 -o 结尾
      influencer|videos of outfits posted to five million followers;people paid by brands to post about products;a million people following her videos|an influencer is a person with many followers online; an advertiser is the company that pays for adverts|influencer 是网红；advertiser 是广告商|advertiser/advertisers=an advertiser is a company that pays for adverts, not a person with followers who posts videos=advertiser 是出钱做广告的公司，不是有粉丝、发视频的人;endorsement/endorsements=an endorsement is a statement of support, not a person with followers=endorsement 是代言或认可，不是有粉丝的人|in · flu · en · cer|influence + r, keeping the c|influence + r，保留 c
      viral|a video popular overnight;a post shared from phone to phone;videos nobody can predict|viral means spreading very fast online; catchy means easy to remember|viral 是迅速传播的；catchy 是好记的|catchy=catchy means easy to remember, not spreading quickly from person to person online=catchy 是好记的，不是在网上迅速传播的;vital=vital means very important or necessary, not spreading quickly online=vital 是至关重要的，不是迅速传播的|vi · ral|vi + ral, like *virus*|vi + ral，和 *virus* 开头一样
      clickbait|a silly headline made to make you click;websites earning money from every click;headlines that promise more than the article|clickbait is headlines made to make you click; publicity is attention from the media|clickbait 是标题党；publicity 是公众关注|publicity=publicity is attention from newspapers, TV and the public, not a silly headline made to get clicks=publicity 是媒体和公众的关注，不是骗点击的标题;marketing=marketing is the whole work of advertising and selling, not a silly headline made to get clicks=marketing 是营销工作，不是骗点击的标题|click · bait|click + bait as one word, with ck|click + bait 连写，有 ck
      endorsement|deals that earn a singer more than music;the support of the biggest union;a doctor's support for a product|an endorsement is public support for a product or a person; publicity is attention from the media|endorsement 是代言、认可；publicity 是公众关注|publicity=publicity is attention from the media, not a statement of support for a product or a person=publicity 是媒体关注，不是对产品或人的支持;advertiser/advertisers=an advertiser is a company that pays for adverts, not a statement of support=advertiser 是广告商，不是支持的声明|en · dorse · ment|endorse + ment, keeping the e|endorse + ment，保留 e
      jingle|a tune hummed from a radio advert;a cheerful tune played on a piano;old TV tunes still sung|a jingle is a short tune in an advert; a slogan is a short phrase|jingle 是广告短曲；slogan 是口号|logo/logos=a logo is a design you see, not a tune you hum or sing=logo 是看到的图案，不是哼唱的曲子;slogan/slogans=a slogan is a short phrase that is spoken or written, not a tune played and sung=slogan 是说或写的口号，不是演奏和演唱的曲子|jin · gle|-gle at the end, not -gel|结尾是 -gle，不是 -gel
      catchy|a tune everyone remembers after one listen;a name for a new product;a short slogan|catchy means easy to remember; viral means spreading fast online|catchy 是好记的；viral 是迅速传播的|viral=viral means spreading very fast online, not easy to remember or pleasant to hear=viral 是在网上迅速传播的，不是好记或好听的;patchy=patchy means good in some parts and bad in others, not easy to remember=patchy 是时好时坏的，不是好记的|catch · y|catch + y, keeping the tch|catch + y，保留 tch
      advertiser|companies paying for adverts for young people;big companies a magazine lost;money a TV channel depends on|an advertiser is a company that pays for adverts; an influencer is a person paid to post|advertiser 是广告商；influencer 是网红|influencer/influencers=an influencer is a person with many followers whom companies pay, not the company that pays for adverts=influencer 是被公司付钱的网红，不是出钱做广告的公司;billboard/billboards=a billboard is a board for adverts, not the company that pays for them=billboard 是广告牌，不是出钱的公司|ad · ver · tis · er|advertise + r, with -ise, not -ize|advertise + r，是 -ise，不是 -ize
      publicity|a scandal in all the papers;an actor who never talks to journalists;a news story used by a charity|publicity is attention from the media and the public; marketing is the work of selling|publicity 是公众关注、宣传；marketing 是营销|marketing=marketing is the work of advertising and selling products, not attention from the media=marketing 是推销产品的工作，不是媒体的关注;clickbait=clickbait is headlines made to make you click, not attention from the media=clickbait 是诱人点击的标题，不是媒体的关注|pub · lic · i · ty|public + ity|public + ity
    `,
  },
});

const information = vocabularyTopic({
  id: "b2-words-information",
  title: t("Information and Trust", "信息与信任"),
  summary: t(
    "Misinformation and disinformation; censorship and censoring; transparency and being transparent; credible sources and credibility; biased and impartial reporting; fact-checking; hoaxes.",
    "错误信息和虚假信息；审查制度和审查；透明度和公开；可信的来源和可信度；有偏见和公正的报道；核查事实；骗局。",
  ),
  intro: t(
    "A fake story was spreading online, so the paper decided to **fact-check** it, found it was a **hoax**, and told readers which sources are **credible**. These words help you judge whether information is true and fair.",
    "一则假新闻在网上流传，报社决定 **fact-check**（核查事实），发现那是个 **hoax**（骗局），并告诉读者哪些来源是 **credible**（可信的）。这些词帮你判断信息是否真实、公正。",
  ),
  prerequisites: ["b1-words-truth"],
  words: [
    word(
      "misinformation",
      "wrong information, often spread by people who think it is true",
      "错误信息",
      "{Misinformation} about the vaccine spread online. | The site is full of {misinformation} about health. | Correcting {misinformation} takes time.",
      "censorship transparency",
      "disinformation",
    ),
    word(
      "disinformation",
      "false information that is spread on purpose to deceive people",
      "虚假信息（故意散布）",
      "The government accused a foreign state of spreading {disinformation}. | {Disinformation} campaigns try to divide voters. | Fake accounts were used to spread {disinformation}.",
      "transparency credibility",
      "misinformation",
    ),
    word(
      "censorship",
      "the control of what may be published, broadcast or said",
      "审查制度",
      "There is strict {censorship} of the press. | The writer fought against {censorship} after the government banned three of her books. | Internet {censorship} blocks many foreign websites.",
      "credibility transparency",
    ),
    word(
      "censor censors censored censoring",
      "to remove the parts of a book, film or message that are not allowed",
      "审查；删改",
      "The government {censors} the news, cutting any story that criticizes it.|fact-checks censures | Parts of the film were {censored}: the violent scenes were cut before it was shown.|fact-checked censured | Messages that mention the protest are {censored} and never reach anyone.|fact-checked censured",
      "fact-check censure",
    ),
    word(
      "transparency",
      "being open about what you do, so that people can see it and trust you",
      "透明度",
      "Voters demand more {transparency} about how money is spent. | The new rules aim to increase {transparency} by putting every contract online for anyone to read. | {Transparency}, letting the public see every decision, builds trust.",
      "credibility censorship",
      "transparent",
    ),
    word(
      "transparent",
      "clear enough to see through; open and honest",
      "透明的；公开的",
      "Glass is {transparent}. | The process must be {transparent}, so that anyone can see how decisions are made. | The company is {transparent} about its prices: every cost is shown on its website.",
      "biased credible",
      "transparency",
    ),
    word(
      "credible",
      "able to be believed or trusted",
      "可信的",
      "The witness was not very {credible}: nobody believed her story. | We need {credible} evidence. | Is the website a {credible} source that we can believe and trust?",
      "transparent biased",
      "credibility",
    ),
    word(
      "credibility",
      "the quality of being believed and trusted",
      "可信度；信誉",
      "The scandal damaged the minister's {credibility}. | The newspaper lost its {credibility} after the false story. | Mistakes in the data reduce the study's {credibility}.",
      "transparency censorship",
      "credible",
    ),
    word(
      "biased",
      "unfairly preferring one person, group or side",
      "有偏见的；偏向的",
      "The report was {biased} against women. | Many people think the channel is {biased}: it always takes the government's side. | A judge who is {biased} cannot give a fair decision.",
      "impartial credible",
    ),
    word(
      "impartial",
      "not supporting any side; fair to everyone",
      "公正的；不偏不倚的",
      "Judges must be {impartial} and treat both sides the same. | The broadcaster aims to be {impartial}, giving every party the same time on air. | The match needs a referee who is {impartial} and favors neither team.",
      "biased credible",
    ),
    word(
      "fact-check fact-checks fact-checked fact-checking",
      "to check that the facts in a text or a statement are correct",
      "核查事实",
      "Journalists must {fact-check} every claim to make sure it is true. | The article was {fact-checked} before it was published, and two wrong dates were corrected.|censored quoted | {Fact-checking} websites test what politicians say.|censoring quoting",
      "censor quote",
    ),
    word(
      "hoax hoaxes",
      "a trick that makes people believe something that is not true",
      "骗局；恶作剧",
      "The photo of a shark swimming down a flooded street was a {hoax}: someone made it on a computer. | The bomb threat turned out to be a {hoax}. | Internet {hoaxes}, like fake photos and made-up stories, spread faster than the truth.|fallacies scandals",
      "fallacy scandal",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "A *biased* report takes one side unfairly, while an *impartial* one takes no side at all. Look for words in the sentence that show whether someone favors a side.",
        "*biased* 的报道不公正地偏向一方，*impartial* 的报道不偏向任何一方。在句中找出说明是否偏袒某一方的词。",
      ),
      meaning: t(
        '*Misinformation* is wrong information spread by people who may believe it, while *disinformation* is false information spread on purpose to deceive. Check whether the meaning says "on purpose".',
        "*misinformation* 是传播者自己可能也信以为真的错误信息，*disinformation* 是故意散布来骗人的虚假信息。看释义里有没有“故意”。",
      ),
      spell: t(
        "*Censor* begins with c, not s as in *sensor*, and *credible* ends in -ible, not -able.",
        "*censor* 以 c 开头，不是 *sensor* 的 s；*credible* 以 -ible 结尾，不是 -able。",
      ),
    },
    notes: `
      misinformation|wrong ideas about a vaccine spreading online;a site full of wrong health advice;wrong information that takes time to correct|misinformation is wrong information, often spread by mistake; censorship is control of what may be said|misinformation 是错误信息；censorship 是审查|censorship=censorship is the control of what may be published, not wrong information that spreads=censorship 是对发表内容的管控，不是传播开的错误信息;transparency=transparency is being open so people can see what you do, not wrong information that spreads=transparency 是公开透明，不是传播开的错误信息|mis · in · for · ma · tion|mis + information, one word|mis + information，连写
      disinformation|a foreign state spreading lies on purpose;campaigns trying to divide voters;fake accounts used to deceive|disinformation is false information spread on purpose; misinformation may be spread by mistake|disinformation 是故意散布的虚假信息；misinformation 可能是无意传播的|transparency=transparency is being open and honest, the opposite of spreading lies on purpose=transparency 是公开诚实，和故意散布谎言正相反;credibility=credibility is the quality of being believed, not false information spread to deceive=credibility 是可信度，不是用来骗人的虚假信息|dis · in · for · ma · tion|dis + information, one word|dis + information，连写
      censorship|strict control of the press;a government banning books;foreign websites blocked online|censorship is control of what may be published or said; transparency is openness|censorship 是审查制度；transparency 是透明|credibility=credibility is the quality of being believed, not control of what may be published=credibility 是可信度，不是对发表内容的管控;transparency=transparency is being open so people can see everything, the opposite of controlling what may be published=transparency 是公开透明，和管控发表内容正相反|cen · sor · ship|censor + ship, with c, not s|censor + ship，是 c 不是 s
      censor|a government cutting critical stories;violent film scenes cut before showing;messages about a protest that never arrive|to censor is to remove what is not allowed; to fact-check is to see whether facts are correct|censor 是审查删改；fact-check 是核查事实|fact-check/fact-checks/fact-checked=fact-check means to see whether the facts are correct, not to cut out what is not allowed=fact-check 是核查事实是否正确，不是删掉不允许的内容;censure/censures/censured=censure means to criticize someone formally, not to cut parts of a film or a message=censure 是正式谴责，不是删改电影或信息|cen · sor|cen + sor, with c, not s as in *sensor*|cen + sor，是 c，不是 *sensor* 的 s
      transparency|voters asking how money is spent;every contract put online;the public seeing every decision|transparency is being open so people can see what you do; credibility is being believed|transparency 是透明度；credibility 是可信度|credibility=credibility is the quality of being believed, not being open so that people can see what you do=credibility 是可信度，不是让人看到你所做的一切;censorship=censorship is control of what may be said, the opposite of letting people see everything=censorship 是审查，和让人看到一切正相反|trans · par · en · cy|transparent with -t changed to -cy|transparent 把 -t 变成 -cy
      transparent|glass you can see through;decisions anyone can see being made;every cost shown on a website|transparent means clear to see through, or open and honest; credible means able to be believed|transparent 是透明的、公开的；credible 是可信的|biased=biased means unfairly favoring one side, not clear to see through or open about everything=biased 是有偏见的，不是透明或公开的;credible=credible means able to be believed, not clear to see through or showing everything openly=credible 是可信的，不是透明或公开展示一切的|trans · par · ent|trans + parent|trans + parent
      credible|a witness nobody believed;evidence that can be trusted;a source we can believe and trust|credible means able to be believed; transparent means open for everyone to see|credible 是可信的；transparent 是公开透明的|transparent=transparent means open or clear to see through, not able to be believed=transparent 是透明的，不是可信的;biased=biased means unfairly favoring one side, not something people believe and trust=biased 是有偏见的，不是让人相信的|cred · i · ble|cred + ible, ending in -ible, not -able|cred + ible，以 -ible 结尾，不是 -able
      credibility|a minister's trust damaged by a scandal;trust a paper lost after a false story;trust reduced by mistakes in the data|credibility is the quality of being believed; transparency is being open|credibility 是可信度；transparency 是透明度|transparency=transparency is being open about what you do, not the trust people have in you=transparency 是公开透明，不是别人对你的信任;censorship=censorship is control of what may be said, not the trust people have in someone=censorship 是审查，不是人们的信任|cred · i · bil · i · ty|credible with -le changed to -ility|credible 把 -le 变成 -ility
      biased|a report unfair to women;a channel always on the government's side;a judge who cannot be fair|biased means unfairly favoring one side; impartial means favoring no side|biased 是有偏见的；impartial 是公正的|impartial=impartial means favoring no side, the opposite of unfairly taking one side=impartial 是不偏不倚的，和偏向一方正相反;credible=credible means able to be believed, not unfairly favoring one side=credible 是可信的，不是偏向一方的|bi · ased|bias + ed, with one s|bias + ed，只有一个 s
      impartial|judges treating both sides the same;the same time on air for every party;a referee who favors neither team|impartial means favoring no side; biased means unfairly favoring one|impartial 是公正的；biased 是有偏见的|biased=biased means unfairly favoring one side, the opposite of treating both sides the same=biased 是有偏见的，和平等对待双方正相反;credible=credible means able to be believed, not treating every side the same=credible 是可信的，不是对各方一视同仁的|im · par · tial|im + partial, with -tial sounding like "shul"|im + partial，-tial 读作 "shul"
      fact-check|claims checked to see whether they are true;two wrong dates corrected before publishing;websites testing what politicians say|to fact-check is to check that facts are correct; to censor is to cut what is not allowed|fact-check 是核查事实；censor 是审查删改|censor/censored/censoring=censor means to cut out what is not allowed, not to check whether facts are true=censor 是删掉不允许的内容，不是核查事实;quote/quoted/quoting=quote means to repeat someone's exact words, not to check whether they are true=quote 是引用原话，不是核查真假|fact-check|fact + check joined by a hyphen|fact 和 check 之间用连字符
      hoax|a fake photo of a shark in a flooded street;a bomb threat that was not real;fake photos and made-up stories online|a hoax is a trick to make people believe something false; a fallacy is a mistake in reasoning|hoax 是骗局；fallacy 是谬误|fallacy/fallacies=a fallacy is a false idea or a mistake in reasoning, not a trick made to fool people=fallacy 是谬论或推理错误，不是故意捉弄人的骗局;scandal/scandals=a scandal is a shocking event that people talk about, not a trick that makes something false look real=scandal 是丑闻，不是以假乱真的骗局|hoax|oa as in *coat*, and the plural *hoaxes* with -es|oa 和 *coat* 一样，复数 *hoaxes* 加 -es
    `,
  },
});

const reportingWords = vocabularyTopic({
  id: "b2-words-reporting-verbs",
  title: t("Reporting Verbs", "转述动词"),
  summary: t(
    "Alleging, stating and disclosing; implying and speculating; quoting and citing; condemning and urging; confessing, remarking and reiterating.",
    "声称、陈述和透露；暗示和推测；引用和援引；谴责和敦促；坦白、评论和重申。",
  ),
  intro: t(
    "The police **allege** that the mayor took money, the mayor's lawyer **stated** that she did nothing wrong, and reporters began to **speculate** about her future. These words help you report what people say and how they say it.",
    "警方 **allege**（指控）市长收了钱，市长的律师 **stated**（声明）她没有做错任何事，记者们开始 **speculate**（猜测）她的前途。这些词帮你转述别人说了什么、是怎么说的。",
  ),
  prerequisites: ["b1-words-communicating"],
  words: [
    word(
      "allege alleges alleged alleging",
      "to say that someone has done something wrong, without giving proof",
      "声称；指控",
      "Police {allege} that he stole the money. | The newspaper {alleged} that the minister had lied.|confessed condemned | She is {alleged} to have taken bribes.|confessed condemned",
      "confess condemn",
    ),
    word(
      "state states stated stating",
      "to say or write something clearly and formally",
      "陈述；声明",
      "The report {states} clearly that the river is polluted.|implies speculates | Please {state} your name and address. | The rules {state} in plain words that phones must be switched off.",
      "imply speculate",
      "remark",
    ),
    word(
      "disclose discloses disclosed disclosing",
      "to make known something that was secret",
      "透露；公开",
      "The company refused to {disclose} its profits. | In his book he {disclosed}, for the first time, the secret illness he had hidden for years.|implied condemned | Details of the deal were not {disclosed}.|implied condemned",
      "imply condemn",
    ),
    word(
      "imply implies implied implying",
      "to suggest something without saying it directly",
      "暗示；意味着",
      "You didn't say it directly, but are you {implying} that I lied?|stating quoting | Her silence {implied} that she agreed.|stated quoted | The results do not prove it, but they {imply} that the drug works.",
      "state quote",
    ),
    word(
      "speculate speculates speculated speculating",
      "to guess about something without knowing all the facts",
      "推测；猜测",
      "Reporters {speculated} about the reasons for his resignation.|stated disclosed | It is too early to {speculate} about the cause. | Without any real news, fans are {speculating} that the band will split.|stating disclosing",
      "state disclose",
    ),
    word(
      "quote quotes quoted quoting",
      "to repeat the exact words that someone said or wrote",
      "引用；引述",
      "The article {quotes} the minister directly.|speculates confesses | She {quoted} a line from Shakespeare.|speculated confessed | Can I {quote} you on that?",
      "speculate confess",
      "cite",
    ),
    word(
      "cite cites cited citing",
      "to mention a source or an example as evidence",
      "引用；举出",
      "The study is {cited} in many textbooks.|speculated urged | He {cited} three reasons for the decision.|speculated urged | Always {cite} your sources.",
      "speculate urge",
      "quote",
    ),
    word(
      "condemn condemns condemned condemning",
      "to say very strongly that something is wrong",
      "谴责",
      "World leaders {condemned} the attack.|urged alleged | We {condemn} all forms of violence. | The decision was {condemned} by human rights groups.|urged alleged",
      "urge allege",
    ),
    word(
      "urge urges urged urging",
      "to try hard to persuade someone to do something",
      "敦促；力劝",
      "Doctors {urge} people to get vaccinated. | She {urged} him to see a lawyer.|condemned implied | The UN is {urging} both sides to stop fighting.|condemning implying",
      "condemn imply",
    ),
    word(
      "confess confesses confessed confessing",
      "to admit that you have done something wrong or something you are ashamed of",
      "承认；坦白",
      "He {confessed} to the crime.|alleged remarked | I'm ashamed to {confess} that I haven't read the book. | She finally {confessed} that she had broken the vase.|alleged remarked",
      "allege remark",
    ),
    word(
      "remark remarks remarked remarking",
      "to say what you think or what you have noticed",
      "说起；评论",
      "She {remarked} that the room was cold.|confessed urged | He {remarks} on everything I wear.|confesses urges | Several visitors {remarked} on the beauty of the garden.|confessed urged",
      "confess urge",
      "state",
    ),
    word(
      "reiterate reiterates reiterated reiterating",
      "to say something again, to make it very clear",
      "重申",
      "The minister {reiterated} her support for the plan, saying once again that it was the right choice.|speculated disclosed | Let me {reiterate} what I said earlier: nobody will lose their job. | The company {reiterates}, as it has many times before, that the product is safe.|speculates discloses",
      "speculate disclose",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "To *state* something is to say it clearly, while to *imply* it is to suggest it without saying it directly. Look for words such as *clearly* or *without saying it* that show which one fits.",
        "*state* 是明确地说出来，*imply* 是不直接说、只是暗示。找找句中的 *clearly* 或 *without saying it* 这类词，判断该用哪个。",
      ),
      meaning: t(
        "To *quote* is to repeat someone's exact words, while to *cite* is to mention a source or an example as evidence. Check whether the meaning is about exact words or about a source.",
        "*quote* 是原样引述别人的话，*cite* 是提到某个出处或例子作为依据。看释义说的是原话，还是出处。",
      ),
      spell: t(
        "*Condemn* ends in a silent n, *allege* has a double l, and *reiterate* is re + iterate.",
        "*condemn* 词尾 n 不发音，*allege* 双写 l，*reiterate* 是 re + iterate。",
      ),
    },
    notes: `
      allege|police saying a man stole money;a paper saying a minister lied;bribes she is said to have taken|to allege is to say someone did wrong without proof; to confess is to admit your own wrong|allege 是无证据地指控；confess 是坦白自己的错|confess/confessed/confesses=confess means to admit your own wrong, not to say without proof that someone else did wrong=confess 是承认自己的错，不是无证据地指控别人;condemn/condemned/condemns=condemn means to say strongly that something is wrong, and is not followed by *that* or *to have* to report a claim=condemn 是强烈谴责，后面不接 *that* 或 *to have* 来转述指控|al · lege|a double l, and -ege sounding like "edge"|双写 l，-ege 读作 "edge"
      state|a report saying clearly that a river is polluted;a name and address given on a form;rules saying in plain words that phones go off|to state is to say something clearly and formally; to imply is to suggest it without saying it|state 是明确陈述；imply 是暗示|imply/implies=imply means to suggest without saying directly, the opposite of saying something clearly and formally=imply 是不直说的暗示，和明确正式地陈述正相反;speculate/speculates=speculate means to guess without the facts, not to say something clearly as a fact=speculate 是没有事实依据的猜测，不是明确陈述事实|state|the a-e spelling, as in *date*|a-e 的拼法，和 *date* 一样
      disclose|profits a company kept secret;a secret illness told for the first time;details of a deal kept hidden|to disclose is to make a secret known; to imply is to suggest without saying|disclose 是透露秘密；imply 是暗示|imply/implied=imply means to suggest something without saying it, not to make a secret openly known=imply 是暗示，不是把秘密公开说出来;condemn/condemned=condemn means to say strongly that something is wrong, not to make a secret known=condemn 是谴责，不是透露秘密|dis · close|dis + close|dis + close
      imply|something suggested but not said directly;silence that suggested agreement;results that suggest a drug works but do not prove it|to imply is to suggest without saying directly; to state is to say clearly|imply 是暗示；state 是明确陈述|state/stating/stated/states=state means to say something clearly and directly, the opposite of only suggesting it=state 是明确直接地说，和只是暗示正相反;quote/quoting/quoted/quotes=quote means to repeat someone's exact words, not to suggest something without saying it=quote 是引用原话，不是暗示|im · ply|im + ply, and the y becomes -ies in *implies*|im + ply，*implies* 里 y 变成 -ies
      speculate|reporters guessing why a man resigned;guessing about a cause too early;fans guessing without any real news|to speculate is to guess without all the facts; to state is to say clearly as a fact|speculate 是猜测；state 是陈述|state/stated/stating=state means to say something clearly as a fact, not to guess without knowing=state 是作为事实明确陈述，不是猜测;disclose/disclosed/disclosing=disclose means to make known a secret you know, not to guess about what you do not know=disclose 是透露已知的秘密，不是猜测未知的事|spec · u · late|spec + u + late, with one c|spec + u + late，只有一个 c
      quote|a minister's exact words in an article;a line from Shakespeare;exact words used in a newspaper|to quote is to repeat exact words; to cite is to mention a source as evidence|quote 是引用原话；cite 是引证出处|speculate/speculates/speculated=speculate means to guess without the facts, not to repeat someone's exact words=speculate 是猜测，不是引用原话;confess/confesses/confessed=confess means to admit a wrong, not to repeat someone else's words=confess 是坦白认错，不是引用别人的话|quote|qu, then the o-e spelling, as in *note*|qu 开头，再是 o-e 的拼法，和 *note* 一样
      cite|a study mentioned in many textbooks;three reasons given for a decision;sources named in an essay|to cite is to mention a source or an example as evidence; to quote is to repeat exact words|cite 是引证；quote 是引用原话|speculate/speculated=speculate means to guess without the facts, not to name a source or reasons as evidence=speculate 是猜测，不是举出出处或理由;urge/urged=urge means to try hard to persuade someone, not to name a source as evidence=urge 是力劝，不是举出出处|cite|c sounding like s, not *site* or *sight*|c 读作 s，不要写成 *site* 或 *sight*
      condemn|world leaders against an attack;all forms of violence called wrong;a decision attacked by human rights groups|to condemn is to say very strongly that something is wrong; to urge is to push someone to act|condemn 是谴责；urge 是敦促|urge/urged=urge means to push someone to do something, not to say strongly that an act is wrong=urge 是敦促别人去做，不是谴责;allege/alleged=allege means to claim without proof that someone did wrong, not to say openly that an act is wrong=allege 是无证据地指控，不是公开谴责|con · demn|a silent n at the end|词尾 n 不发音
      urge|doctors pushing people to get vaccinated;a push to see a lawyer;both sides pushed to stop fighting|to urge is to try hard to make someone act; to condemn is to say something is wrong|urge 是敦促；condemn 是谴责|condemn/condemned/condemning=condemn means to say strongly that something is wrong, not to push someone to do something=condemn 是谴责，不是敦促别人去做;imply/implied/implying=imply means to suggest without saying directly, not to push someone hard to act=imply 是暗示，不是极力劝人行动|urge|ur + ge, with g sounding like j|ur + ge，g 读作 j
      confess|a man admitting a crime;admitting with shame not reading a book;finally admitting breaking a vase|to confess is to admit your own wrong; to allege is to say someone else did wrong|confess 是坦白；allege 是指控|allege/alleged=allege means to say without proof that someone else did wrong, not to admit your own wrong=allege 是指控别人，不是承认自己的错;remark/remarked=remark means to say what you notice, not to admit something you are ashamed of=remark 是随口评论，不是承认羞愧的事|con · fess|con + fess, with a double s|con + fess，双写 s
      remark|a comment that a room was cold;comments on every outfit;visitors commenting on a garden|to remark is to say what you notice or think; to confess is to admit a wrong|remark 是评论；confess 是坦白|confess/confessed/confesses=confess means to admit a wrong, not simply to say what you notice=confess 是认错，不是说出自己注意到的事;urge/urged/urges=urge means to push someone to act, not to say what you notice=urge 是敦促，不是评论|re · mark|re + mark|re + mark
      reiterate|support for a plan said once again;words said earlier said again;a claim made many times before|to reiterate is to say something again to make it clear; to disclose is to make a secret known for the first time|reiterate 是重申；disclose 是首次透露|speculate/speculated/speculates=speculate means to guess without the facts, not to say again what you have said before=speculate 是猜测，不是重复说过的话;disclose/disclosed/discloses=disclose means to tell a secret for the first time, not to say again what is already known=disclose 是第一次透露秘密，不是重复已知的话|re · it · er · ate|re + iterate, with an e between the r and the i|re + iterate，r 和 i 之间有 e
    `,
  },
});

const online = vocabularyTopic({
  id: "b2-words-online-media",
  title: t("Online Media", "网络媒体"),
  summary: t(
    "Algorithms; trending topics and hashtags; memes and livestreams; content and its creators; moderators; engagement and notifications; trolls; subscribers.",
    "算法；热门话题和话题标签；表情包和直播；内容及其创作者；版主；互动和通知；网络喷子；订阅者。",
  ),
  intro: t(
    "Every evening Lin opens the app: the **algorithm** picks **trending** videos for her, she checks her **notifications**, and she thanks her **subscribers** for watching. These words help you talk about how people make, share and react to things online.",
    "每天晚上林都会打开那个应用：**algorithm**（算法）为她挑出 **trending**（热门的）视频，她查看 **notifications**（通知），并感谢 **subscribers**（订阅者）的观看。这些词帮你谈论人们在网上如何创作、分享和回应内容。",
  ),
  prerequisites: ["b1-words-digital"],
  words: [
    word(
      "algorithm algorithms",
      "a set of rules a computer follows, for example to choose what you see online",
      "算法",
      "The {algorithm} decides which videos you see next. | Social media {algorithms} push angry posts to the top of your feed.|hashtags memes | The company changed the {algorithm} that ranks search results.",
      "hashtag meme",
    ),
    word(
      "trending",
      "very popular on social media at the moment",
      "热门的；正流行的",
      "The hashtag was {trending} all day. | Which topics are {trending} today, so popular that everyone is talking about them? | Within an hour of the goal, the player's name was {trending} at the top of the list of popular searches.",
      "streaming posting",
    ),
    word(
      "hashtag hashtags",
      "a word or phrase after the sign #, used to group posts on one subject",
      "话题标签",
      "Add the {hashtag} #CleanBeach to your post so people can find it with others on the same subject. | Type the sign # before a word to make it a {hashtag}. | Search for the {hashtag} #WorldCup to see every post about the games.",
      "meme notification",
    ),
    word(
      "meme memes",
      "a funny picture or video that is copied and shared widely online",
      "表情包；网络梗",
      "The photo of the angry cat became a {meme}, copied with new jokes on thousands of pages. | He made a {meme} by adding a funny line of text to a picture of his dog. | The {meme}, a still picture with a joke written on it, was copied millions of times.",
      "hashtag livestream",
    ),
    word(
      "livestream livestreams",
      "a video that is broadcast online while it happens",
      "直播",
      "Thousands watched the {livestream} of the concert as it happened. | She sells clothes in her daily {livestreams}, talking live to buyers.|memes hashtags | The {livestream} crashed because too many people joined at once.",
      "meme hashtag",
    ),
    word(
      "content",
      "the information, videos and pictures on a website or a channel",
      "（网站等的）内容",
      "The site has a lot of free {content}: films, articles and courses. | Creators earn money from the {content} they make, such as videos, songs and posts. | Videos that show violence are harmful {content}, and the site removes them.",
      "engagement algorithm",
    ),
    word(
      "creator creators",
      "a person who makes videos or other material for the internet",
      "（内容）创作者",
      "The {creator} of the channel films and edits every video herself. | Many {creators} earn money from the adverts shown in the videos they make.|subscribers moderators | Video {creators} spend hours writing, filming and editing each new upload.|subscribers moderators",
      "subscriber moderator",
    ),
    word(
      "moderator moderators",
      "a person who checks what is posted on a website and removes what breaks its rules",
      "（网络）版主；审核员",
      "A {moderator} deleted the rude comment because it broke the forum's rules. | The forum needs more {moderators} to check posts and remove the ones that break its rules.|subscribers trolls | {Moderators} read thousands of posts a day and take down the ones that break the rules.|subscribers trolls",
      "subscriber troll",
    ),
    word(
      "engagement",
      "how much people react to posts online, for example by liking and sharing them",
      "（网络）互动；参与度",
      "The post got very little {engagement}: hardly any likes or shares. | Brands measure {engagement} by counting likes, shares and replies. | Angry posts increase {engagement}, because people rush to like, share and reply to them.",
      "content notification",
    ),
    word(
      "notification notifications",
      "a message on your phone or computer telling you that something has happened",
      "通知；提醒",
      "I turn off {notifications} at night so my phone stays quiet.|hashtags memes | My phone shows a {notification} for every new message. | The app keeps buzzing my phone with {notifications} about new likes.|hashtags memes",
      "hashtag meme",
    ),
    word(
      "troll trolls",
      "a person who posts rude or angry messages online to upset people",
      "网络喷子；挑衅者",
      "Ignore the {trolls} in the comments, who only want to upset you. | The singer left social media because {trolls} kept sending her cruel messages. | An anonymous {troll} sent her threats every day.|creator moderator",
      "creators moderators",
    ),
    word(
      "subscriber subscribers",
      "a person who signs up or pays to receive something regularly",
      "订阅者",
      "The channel has a million {subscribers} who get every new video. | Newspaper {subscribers} get the paper delivered every morning. | She thanked her {subscribers} for signing up to her channel.",
      "creators moderators",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Content* is what is posted, such as videos and articles, while *engagement* is how people react to it, by liking, sharing and replying. Ask whether the sentence is about the things themselves or about people's reactions.",
        "*content* 是发布出来的东西，比如视频和文章；*engagement* 是人们对它的反应，比如点赞、转发和回复。看句子说的是东西本身，还是人们的反应。",
      ),
      meaning: t(
        "A *creator* makes the videos, a *subscriber* signs up to receive them, and a *moderator* removes posts that break the rules. Match the meaning to the person's job.",
        "*creator* 制作视频，*subscriber* 订阅并接收视频，*moderator* 删除违规的帖子。按释义里这个人做的事来对应。",
      ),
      spell: t(
        '*Algorithm* has an i and no y: algo · rithm, not "rhythm". *Meme* is spelled like *theme*, and *moderator* ends in -or.',
        '*algorithm* 里是 i，没有 y：algo · rithm，不是 "rhythm"。*meme* 拼法和 *theme* 一样，*moderator* 以 -or 结尾。',
      ),
    },
    notes: `
      algorithm|rules that pick the next video;rules that push angry posts up a feed;rules that rank search results|an algorithm is the computer's set of rules; a hashtag is a tag that groups posts|algorithm 是电脑遵循的规则；hashtag 是给帖子归类的标签|hashtag/hashtags=a hashtag is a word after the sign # that groups posts, and it cannot decide, push or rank anything=hashtag 是 # 号后面给帖子归类的词，不能决定、推送或排序任何东西;meme/memes=a meme is a funny picture that people copy, and it is not a set of rules a computer follows=meme 是人们转发的搞笑图片，不是电脑遵循的规则|al · go · rithm|an i after the r and no y, unlike *rhythm*|r 后面是 i，没有 y，和 *rhythm* 不同
      trending|a hashtag popular all day;topics everyone is talking about;a player's name at the top of popular searches|trending means very popular online right now; streaming means sending video live|trending 是正在网上流行；streaming 是在线直播|streaming=streaming means sending video or sound live over the internet, which a hashtag, a topic or a name cannot do=streaming 是在网上实时传送视频或声音，话题标签、话题或名字都做不到;posting=posting means putting a message online, something people do, not something a topic or a name does=posting 是把消息发到网上，是人做的事，不是话题或名字做的事|trend · ing|trend + ing, with no extra letter|trend + ing，不加别的字母
      hashtag|a tag added to a post about a clean beach;a word with the sign # before it;a tag searched to find every World Cup post|a hashtag groups posts by a word after #; a meme is a funny picture people copy|hashtag 用 # 后的词给帖子归类；meme 是被转发的搞笑图片|meme/memes=a meme is a funny picture or video, not a word after the sign # that groups posts=meme 是搞笑图片或视频，不是 # 号后面给帖子归类的词;notification/notifications=a notification is a message your phone shows you, not a word you add to a post or search for=notification 是手机给你的提醒，不是加在帖子里或用来搜索的词|hash · tag|hash + tag, two short words joined|hash + tag，两个短词拼在一起
      meme|a photo of an angry cat copied with new jokes;a dog picture with a funny line of text;a still picture with a joke copied millions of times|a meme is a funny picture people copy and change; a hashtag is a word after # that groups posts|meme 是被人转发改编的搞笑图片；hashtag 是 # 后给帖子归类的词|hashtag/hashtags=a hashtag is a word after the sign #, not a picture with a joke on it=hashtag 是 # 号后面的词，不是配了笑话的图片;livestream/livestreams=a livestream is a video shown live as it happens, not a still picture copied again and again=livestream 是实时播出的视频，不是被反复转发的静态图片|meme|e-e spelling, as in *theme*, said "meem"|e-e 的拼法，和 *theme* 一样，读作 "meem"
      livestream|a concert watched as it happened;clothes sold by talking live to buyers;a live video that crashed when too many joined|a livestream is video broadcast live; a meme is a funny picture copied later|livestream 是实时直播；meme 是之后被转发的搞笑图片|meme/memes=a meme is a funny picture that people copy, not a video watched live as it happens=meme 是被转发的搞笑图片，不是实时观看的视频;hashtag/hashtags=a hashtag is a word after the sign #, which nobody can watch or join=hashtag 是 # 号后面的词，没人能观看或加入|live · stream|live + stream, one word with no space|live + stream，连写成一个词，中间无空格
      content|free films, articles and courses on a site;videos, songs and posts that creators make;violent videos a site removes|content is what is posted; engagement is how people react to it|content 是发布的内容；engagement 是人们的互动|engagement=engagement is how much people like, share and reply, not the videos and articles themselves=engagement 是人们点赞、转发和回复的多少，不是视频和文章本身;algorithm/algorithms=an algorithm is the set of rules that chooses what you see, not the films, songs and posts you see=algorithm 是挑选内容的规则，不是你看到的影片、歌曲和帖子|con · tent|stress on the first part, CON · tent; it has no plural here|重音在前，CON · tent；这里没有复数
      creator|someone who films and edits every video of a channel;people who earn from adverts in the videos they make;people who write, film and edit each upload|a creator makes the videos; a subscriber signs up to watch them|creator 制作视频；subscriber 订阅观看|subscriber/subscribers=a subscriber signs up to receive videos and does not make them=subscriber 订阅接收视频，并不制作视频;moderator/moderators=a moderator checks posts and removes what breaks the rules, but does not make the videos=moderator 审核并删除违规帖子，但不制作视频|cre · a · tor|create + or, dropping the e|create 去掉 e 再加 or
      moderator|someone who deletes a comment that broke the rules;people who check and remove posts on a forum;people who take down posts that break the rules|a moderator removes posts that break the rules; a troll writes the rude posts|moderator 删除违规帖子；troll 写恶意帖子|subscriber/subscribers=a subscriber signs up to receive posts, and has no power to delete or take them down=subscriber 只是订阅接收内容，无权删除帖子;troll/trolls=a troll writes rude posts to upset people, the opposite of removing them=troll 发恶意帖子惹人生气，和删除帖子正相反|mod · er · a · tor|-ator at the end, spelled with o, not -er|结尾是 -ator，用 o，不是 -er
      engagement|a post with hardly any likes or shares;likes, shares and replies that brands count;people rushing to like, share and reply to angry posts|engagement is how people react; content is what is posted|engagement 是互动；content 是内容|content=content is the videos and posts themselves, not how many people like and share them=content 是视频和帖子本身，不是点赞转发的多少;notification/notifications=a notification is a message on your phone, not a measure of how people react to a post=notification 是手机上的提醒，不是衡量帖子互动的多少|en · gage · ment|engage keeps its e before -ment|engage 加 -ment 时保留 e
      notification|a phone kept quiet at night;an alert for every new message;a phone buzzing about new likes|a notification is a message telling you something happened; a hashtag is a tag on a post|notification 是提醒消息；hashtag 是帖子上的标签|hashtag/hashtags=a hashtag is a tag on a post, which a phone does not show you as an alert=hashtag 是帖子上的标签，不是手机弹出的提醒;meme/memes=a meme is a funny picture people share, not an alert that something has happened=meme 是人们分享的搞笑图片，不是告诉你发生了什么的提醒|no · ti · fi · ca · tion|notify changes its y to i before -cation|notify 的 y 变 i，再加 -cation
      troll|people in the comments who want to upset you;people sending a singer cruel messages;an unknown person sending threats|a troll posts rude messages to upset people; a moderator removes them|troll 发恶意消息；moderator 删除它们|creator/creators=a creator makes videos for people to enjoy, not cruel messages to upset them=creator 制作给人欣赏的视频，不是发恶意消息;moderator/moderators=a moderator removes rude posts, the opposite of sending them=moderator 删除恶意帖子，和发帖正相反|troll|a double l at the end|结尾双写 l
      subscriber|a million people who get every new video;people who get a newspaper each morning;people who signed up to a channel|a subscriber signs up to receive something; a creator makes it|subscriber 订阅接收；creator 制作内容|creator/creators=a creator makes the videos or papers, rather than signing up to receive them=creator 制作视频或报纸，而不是订阅接收;moderator/moderators=a moderator checks posts for a site, rather than signing up to receive them=moderator 为网站审核帖子，而不是订阅接收|sub · scrib · er|subscribe drops its e before -er|subscribe 去掉 e 再加 -er
    `,
  },
});

const logic = vocabularyTopic({
  id: "b2-words-logic",
  title: t("Logic", "逻辑"),
  summary: t(
    "Premises and assumptions; assuming; logic, logical and illogical; fallacies and flawed arguments; contradicting and contradictions; counterarguments; refuting a claim.",
    "前提和假设；假定；逻辑、合乎逻辑和不合逻辑；谬误和有缺陷的论证；反驳和矛盾；反方论点；驳斥某个说法。",
  ),
  intro: t(
    "In the debate, Sam's whole case rested on one **premise**. His opponent showed it was a **fallacy**, pointed out a **contradiction** in his figures, and **refuted** his last point. These words help you build an argument and test the arguments of others.",
    "辩论中，萨姆的整个论证建立在一个 **premise**（前提）上。对手指出那是个 **fallacy**（谬误），又挑出他数字里的 **contradiction**（矛盾），并 **refuted**（驳倒了）他最后一个论点。这些词帮你构建论证，也帮你检验别人的论证。",
  ),
  prerequisites: ["b1-words-thinking"],
  words: [
    word(
      "premise premises",
      "an idea on which an argument or a story is based",
      "前提；（故事的）基本设定",
      "The argument rests on a false {premise}. | The {premise} of the film is that robots can feel. | Every step follows from the first {premise}, so if it is wrong, the conclusion is wrong too.",
      "fallacy counterargument",
      "assumption",
    ),
    word(
      "assumption assumptions",
      "something that you believe is true without proof",
      "假设；设想",
      "You're making {assumptions} about her age without asking her. | The plan is based on the {assumption} that prices will fall, but nobody can be sure.|contradiction counterargument | Check your {assumptions}: things you believe without proof can be wrong.",
      "contradictions counterarguments",
      "premise",
    ),
    word(
      "assume assumes assumed assuming",
      "to think that something is true without being sure",
      "假定；以为",
      "I {assume} you've already eaten, since it's so late. | Don't just {assume} that everyone agrees with you: ask them. | We {assumed} the shop would be open, but it was closed.|refuted implied",
      "refute imply",
    ),
    word(
      "logic",
      "a sensible way of reasoning; the study of reasoning",
      "逻辑",
      "I can't follow the {logic} of his argument: each step doesn't lead to the next. | Spending money we don't have goes against all {logic}. | Computers work by strict {logic}, one step leading to the next.",
      "fallacy contradiction",
      "logical",
    ),
    word(
      "logical",
      "following the rules of reasoning; sensible",
      "合乎逻辑的",
      "Her explanation is clear and {logical}: each step follows from the last. | After school, college is the {logical} next step, the one that makes most sense. | There must be a {logical} reason for this: things don't happen for no reason.",
      "flawed illogical",
      "logic",
    ),
    word(
      "illogical",
      "not sensible or reasonable",
      "不合逻辑的",
      "His fear of flying is {illogical}, since flying is safer than driving, but it is real. | It is {illogical} to blame the victim for the crime. | The plan seems {illogical} to me: why close the school that has the most students?",
      "logical flawed",
    ),
    word(
      "fallacy fallacies",
      "a false idea that many people believe; a mistake in reasoning",
      "谬误；谬论",
      "It is a {fallacy} that money brings happiness, a false belief that many people share. | The argument contains a common {fallacy}, a mistake in reasoning. | Students learn to spot {fallacies}, mistakes in reasoning that make weak arguments look strong.|premises counterarguments",
      "premise counterargument",
    ),
    word(
      "flawed",
      "having a mistake or a weakness that makes it less good",
      "有缺陷的",
      "The study was {flawed}: it had only ten people. | The plan is deeply {flawed}, with weak points everywhere. | A {flawed} argument can still sound convincing.",
      "logical valid",
    ),
    word(
      "contradict contradicts contradicted contradicting",
      "to say the opposite of what someone has said; to be so different that both cannot be true",
      "反驳；与……矛盾",
      "The two reports {contradict} each other: one says ten people died, the other says none. | Don't {contradict} your mother by saying the opposite of what she said. | His two stories {contradict} each other, so both cannot be true.",
      "assume imply",
      "refute",
    ),
    word(
      "contradiction contradictions",
      "a difference between two things that means both cannot be true",
      "矛盾",
      'There is a {contradiction} between what he says and what he does. | Her story is full of {contradictions}: she says she was at home and at work at the same time.|premises assumptions | "Friendly enemy" is a {contradiction} in terms.',
      "premise assumption",
    ),
    word(
      "counterargument counterarguments",
      "an argument against another argument",
      "反驳的论点；反方论点",
      "She answered every {counterargument} that her opponent raised against her plan. | The strongest {counterargument} against the plan is about cost. | Before you write, list the main {counterarguments} that people on the other side might make.|premises fallacies",
      "premise fallacy",
    ),
    word(
      "refute refutes refuted refuting",
      "to prove that a statement or an idea is wrong",
      "驳斥；反驳",
      "The scientist {refuted} the claim with new data.|assumed implied | It is hard to {refute} such a simple argument, because it is hard to prove it wrong. | She {refutes} every point he makes, proving each one wrong.|assumes implies",
      "assume imply",
      "contradict",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "To *assume* is to believe something without proof, while to *refute* is to prove that something is wrong. Look for words such as *proof*, *data* or *without asking* that show which one fits.",
        "*assume* 是没有证据就相信，*refute* 是证明某事是错的。找找句中的 *proof*、*data* 或 *without asking* 这类词，判断该用哪个。",
      ),
      meaning: t(
        "A *premise* is the idea an argument starts from, a *fallacy* is a mistake in reasoning, and a *counterargument* is an argument against it. Check whether the meaning is about the start, a mistake or the other side.",
        "*premise* 是论证的出发点，*fallacy* 是推理中的错误，*counterargument* 是反对它的论点。看释义说的是起点、错误，还是对方的论点。",
      ),
      spell: t(
        "*Fallacy* has a double l and one c, *premise* ends in -ise, and *counterargument* is one word, with no e after the u of *argue*.",
        "*fallacy* 双写 l、只有一个 c，*premise* 以 -ise 结尾，*counterargument* 连写成一个词，*argue* 的 u 后面没有 e。",
      ),
    },
    notes: `
      premise|an argument resting on a false idea;the basic idea of a film about robots;the first idea every step follows from|a premise is the idea an argument starts from; a fallacy is a mistake in reasoning|premise 是论证的起点；fallacy 是推理错误|fallacy/fallacies=a fallacy is a mistake in reasoning, not the idea that an argument or a story is built on=fallacy 是推理错误，不是论证或故事赖以建立的想法;counterargument/counterarguments=a counterargument is an argument against another one, not the idea that the argument itself starts from=counterargument 是反方论点，不是论证本身的出发点|prem · ise|-ise at the end, with one m|结尾是 -ise，只有一个 m
      assumption|ideas about her age made without asking;a belief that prices will fall;things you believe without proof|an assumption is something you believe without proof; a premise is the stated idea an argument is built on|assumption 是没有证据的假设；premise 是论证明确的前提|contradiction/contradictions=a contradiction is a clash between two things that cannot both be true, not something you believe without proof=contradiction 是两件事不能同时成立的矛盾，不是没有证据的相信;counterargument/counterarguments=a counterargument is an argument against another one, not a belief you hold without proof=counterargument 是反方论点，不是未经证实的看法|as · sump · tion|assume changes to -sump- with a p|assume 变成 -sump-，多了一个 p
      assume|thinking someone has eaten because it is late;thinking everyone agrees without asking;expecting a shop to be open|to assume is to believe without being sure; to refute is to prove something wrong|assume 是不确定地以为；refute 是证明为错|refute/refutes/refuted=refute means to prove something wrong, not to think it is true without being sure=refute 是证明为错，不是不确定地以为是真的;imply/implies/implied=imply means to suggest something without saying it, not to believe it without proof=imply 是暗示，不是没有证据地相信|as · sume|a double s, and the u-e spelling|双写 s，u-e 的拼法
      logic|an argument whose steps don't lead to the next;spending money we don't have;computers working step by step|logic is sensible reasoning; a fallacy is a mistake in it|logic 是合理的推理；fallacy 是推理中的错误|fallacy/fallacies=a fallacy is a mistake in reasoning, the opposite of sensible reasoning=fallacy 是推理错误，和合理的推理正相反;contradiction/contradictions=a contradiction is a clash between two claims, not a sensible way of reasoning=contradiction 是说法之间的矛盾，不是合理的推理方式|lo · gic|-ic at the end, with a g that sounds like j|结尾是 -ic，g 读作 j
      logical|an explanation where each step follows from the last;the next step that makes most sense;a reason that must exist|logical means following sensible reasoning; illogical means not sensible|logical 是合乎逻辑；illogical 是不合逻辑|flawed=flawed means having a weakness or a mistake, which does not match clear, sensible reasoning=flawed 是有缺陷，和清楚合理的推理不符;illogical=illogical means not sensible, the opposite of following the rules of reasoning=illogical 是不合理，和合乎推理规则正相反|lo · gi · cal|logic + al|logic + al
      illogical|a fear of flying when flying is safer than driving;blaming the victim of a crime;closing the school with the most students|illogical means not sensible; logical means sensible|illogical 是不合逻辑；logical 是合乎逻辑|logical=logical means sensible, but the sentence shows something that makes no sense=logical 是合理的，但句子说的事并不合理;flawed=flawed means having a weak point, and is said of a plan or a study, not of a fear or of blaming someone=flawed 是有缺陷，用来说计划或研究，不说恐惧或责怪别人|il · lo · gi · cal|il + logical, so a double l|il + logical，所以双写 l
      fallacy|the false belief that money brings happiness;a mistake in reasoning in an argument;mistakes that make weak arguments look strong|a fallacy is a mistake in reasoning; a premise is the idea an argument starts from|fallacy 是推理错误；premise 是论证的起点|premise/premises=a premise is the idea an argument is built on, not a false belief or a mistake in reasoning=premise 是论证的基础，不是错误的信念或推理错误;counterargument/counterarguments=a counterargument is an argument against another one, not a mistake in reasoning=counterargument 是反方论点，不是推理错误|fal · la · cy|a double l, one c, and -acy at the end|双写 l，只有一个 c，以 -acy 结尾
      flawed|a study with only ten people;a plan with weak points everywhere;an argument that is weak but sounds convincing|flawed means having a mistake or a weakness; valid means sound and correct|flawed 是有缺陷；valid 是合理有效|logical=logical means sensible and well reasoned, not weak or mistaken=logical 是合理严密，不是有缺陷;valid=valid means sound and correct, the opposite of having a weakness=valid 是合理有效，和有缺陷正相反|flawed|aw as in *saw*, not *floored* or *flowed*|aw 和 *saw* 一样，不要写成 *floored* 或 *flowed*
      contradict|two reports giving opposite numbers of deaths;saying the opposite of what your mother said;two stories that cannot both be true|to contradict is to say the opposite; to refute is to prove something wrong|contradict 是说相反的话；refute 是证明为错|assume/assumes=assume means to believe something without proof, not to say the opposite=assume 是没有证据地相信，不是说相反的话;imply/implies=imply means to suggest something without saying it, not to say the opposite=imply 是暗示，不是唱反调|con · tra · dict|contra (against) + dict (say)|contra（反）+ dict（说）
      contradiction|a gap between what he says and what he does;being at home and at work at the same time;the phrase "friendly enemy"|a contradiction is a clash between two things that cannot both be true; an assumption is a belief without proof|contradiction 是矛盾；assumption 是假设|premise/premises=a premise is the idea an argument starts from, not a clash between two things=premise 是论证的起点，不是两件事之间的矛盾;assumption/assumptions=an assumption is a belief without proof, not a clash between two things that cannot both be true=assumption 是没有证据的看法，不是两件事的矛盾|con · tra · dic · tion|contradict + ion|contradict + ion
      counterargument|points an opponent raised against a plan;the strongest point against a plan;points people on the other side might make|a counterargument is an argument against another; a premise is the idea an argument starts from|counterargument 是反方论点；premise 是起点|premise/premises=a premise is the idea your own argument starts from, not a point raised against it=premise 是自己论证的起点，不是对方提出的反对意见;fallacy/fallacies=a fallacy is a mistake in reasoning, not a point made against an argument=fallacy 是推理错误，不是反对的论点|coun · ter · ar · gu · ment|counter + argument, one word, and no e after the u|counter + argument 连写，u 后面没有 e
      refute|a claim proved wrong with new data;a simple argument that is hard to prove wrong;every point proved wrong|to refute is to prove wrong; to contradict is only to say the opposite|refute 是证明为错；contradict 只是说相反的话|assume/assumes/assumed=assume means to believe something without proof, the opposite of proving it wrong=assume 是没有证据地相信，和证明它错正相反;imply/implies/implied=imply means to suggest something without saying it, not to prove it wrong=imply 是暗示，不是证明为错|re · fute|re + fute, with the u-e spelling, not *refuse*|re + fute，u-e 的拼法，不要写成 *refuse*
    `,
  },
});

const tone = vocabularyTopic({
  id: "b2-words-tone",
  title: t("Tone and Attitude", "语气与态度"),
  summary: t(
    "Sarcastic, ironic and humorous; sincere and cynical; optimistic, pessimistic and skeptical; critical and enthusiastic; indifferent and sympathetic.",
    "讽刺挖苦的、反讽的和幽默的；真诚的和愤世嫉俗的；乐观的、悲观的和怀疑的；批评的和热情的；漠不关心的和同情的。",
  ),
  intro: t(
    'The review of the new phone was **sarcastic**: "What a surprise, another black rectangle." Readers were **skeptical** of its claims, but some fans stayed **enthusiastic**. These words help you describe the tone of a text and the attitude behind it.',
    '那篇新手机评测写得很 **sarcastic**（挖苦）："真惊喜，又是一个黑色长方块。"读者对它的宣传 **skeptical**（怀疑），但一些粉丝依然 **enthusiastic**（热情）。这些词帮你描述一段文字的语气和背后的态度。',
  ),
  prerequisites: ["b1-words-emotions"],
  words: [
    word(
      "sarcastic",
      "saying the opposite of what you mean, in order to be unkind or to make a joke",
      "讽刺挖苦的",
      '"Oh, great, more rain," she said in a {sarcastic} voice, meaning the opposite. | Don\'t be {sarcastic}: say what you really mean. | His {sarcastic} comments, which said the opposite of what he meant, hurt her feelings.',
      "sincere sympathetic",
      "ironic",
    ),
    word(
      "ironic",
      "strange or funny because it is the opposite of what you expect",
      "具有讽刺意味的；反讽的",
      "It's {ironic} that the fire station burned down: it's the opposite of what you'd expect. | The {ironic} thing is that he hates cars but works for a car company. | It is {ironic} that the safety expert was the one who got hurt.",
      "sarcastic sincere",
      "sarcastic",
    ),
    word(
      "humorous",
      "funny and making people laugh",
      "幽默的；滑稽的",
      "She wrote a warm, {humorous} speech that made all the wedding guests laugh. | The book is gently {humorous}, with kind jokes on every page. | He has a {humorous} way of telling stories that makes everyone smile.",
      "sarcastic cynical",
    ),
    word(
      "sincere",
      "really meaning what you say or feel; honest",
      "真诚的；诚挚的",
      "Please accept my {sincere} apologies: I am truly sorry. | She was clearly {sincere}: there were tears in her eyes when she said sorry. | He gave a {sincere} thank-you speech, meaning every word.",
      "sarcastic cynical",
    ),
    word(
      "cynical",
      "believing that people only care about themselves",
      "愤世嫉俗的；认为人皆自私的",
      "He's {cynical} about politicians: he thinks they only care about themselves. | Years of broken promises made her {cynical}, and she trusts nobody now. | It was a {cynical} attempt to win votes, made only for his own gain.",
      "sympathetic sincere",
      "skeptical",
    ),
    word(
      "optimistic",
      "expecting good things to happen",
      "乐观的",
      "I'm {optimistic} that we'll win: our team is strong. | Doctors are {optimistic} about her recovery, as she is getting better every day. | The report is {optimistic} about the economy, saying growth will be strong.",
      "pessimistic skeptical",
      "enthusiastic",
    ),
    word(
      "pessimistic",
      "expecting bad things to happen",
      "悲观的",
      "He is {pessimistic} about the future of the planet, expecting things to get worse. | Don't be so {pessimistic}: it might work. | The forecasts are {pessimistic}: growth will slow.",
      "optimistic enthusiastic",
      "cynical",
    ),
    word(
      "skeptical",
      "having doubts that something is true or will work",
      "怀疑的",
      "Scientists are {skeptical} about the claim and want to see more proof. | I was {skeptical} at first, but the plan worked. | Voters are {skeptical} about big promises they have heard many times and never seen kept.",
      "enthusiastic optimistic",
      "cynical",
    ),
    word(
      "critical",
      "saying what is wrong with someone or something; very important",
      "批评的；关键的",
      "The report is highly {critical} of the police, listing their many mistakes. | She is always {critical} of my cooking: too salty, too cold, too late. | Teachers were {critical} of the new exam, saying it was badly written.",
      "supportive appreciative",
    ),
    word(
      "enthusiastic",
      "showing great interest and excitement",
      "热情的；热心的",
      "The crowd cheered, clapped and gave the team a warm, {enthusiastic} welcome. | She's very {enthusiastic} about her new job and talks about it all the time. | The students were {enthusiastic} about the trip and couldn't wait to go.",
      "indifferent cynical",
      "optimistic",
    ),
    word(
      "indifferent",
      "not interested in or not caring about something",
      "漠不关心的；冷淡的",
      "He seemed {indifferent} to her problems and didn't even ask about them. | Many young people are {indifferent} to politics and never vote. | The waiter was rude and {indifferent}, and didn't care if we were served.",
      "enthusiastic sympathetic",
    ),
    word(
      "sympathetic",
      "showing that you understand and care about someone's problems; agreeing with an idea",
      "同情的；赞同的",
      "She was very {sympathetic} when my father died, and she sent flowers. | My boss was {sympathetic} and gave me a day off. | He is {sympathetic} to the workers' demands and supports their strike.",
      "indifferent sarcastic",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Sarcastic* describes what a person says, meaning the opposite to mock someone, while *ironic* describes a situation that is the opposite of what you expect. Ask whether the gap is about someone's words or about what happened.",
        "*sarcastic* 说的是人的话：说反话挖苦人；*ironic* 说的是情况：结果和预期正相反。看空格讲的是某人说的话，还是发生的事。",
      ),
      meaning: t(
        "*Cynical* people think everyone acts only for themselves, while *skeptical* people simply doubt that a claim is true. Check whether the meaning is about people's motives or about a claim.",
        "*cynical* 的人认为人人都只为自己；*skeptical* 的人只是怀疑某个说法是否属实。看释义说的是人的动机，还是某个说法。",
      ),
      spell: t(
        "*Skeptical* starts with sk in American English, *pessimistic* has a double s, and *sympathetic* has a y after the s.",
        "*skeptical* 在美式英语中以 sk 开头，*pessimistic* 双写 s，*sympathetic* 的 s 后面是 y。",
      ),
    },
    notes: `
      sarcastic|"Oh, great, more rain" said to mean the opposite;words that hide what you really mean;comments that hurt her feelings|sarcastic words mean the opposite to mock; ironic describes a situation that is the opposite of what you expect|sarcastic 是说反话挖苦；ironic 是情况与预期相反|sincere=sincere means really meaning what you say, the opposite of saying the opposite of what you mean=sincere 是真心实意，和说反话正相反;sympathetic=sympathetic means kind and caring, not mocking or unkind=sympathetic 是同情关心，不是挖苦刻薄|sar · cas · tic|sar + cas + tic, with a c in the middle, not a k|sar + cas + tic，中间是 c，不是 k
      ironic|a fire station that burned down;a man who hates cars working for a car company;a safety expert who got hurt|ironic describes a situation opposite to what you expect; sarcastic describes words meant to mock|ironic 是情况出人意料地相反；sarcastic 是挖苦的话|sarcastic=sarcastic describes what a person says to mock someone, not a situation or a thing that happened=sarcastic 说的是人挖苦人的话，不是一种情况或发生的事;sincere=sincere describes a person who means what they say, not a strange turn of events=sincere 说的是真心实意的人，不是出人意料的事|i · ron · ic|iron + ic, said "eye-RON-ic"|iron + ic，读作 "eye-RON-ic"
      humorous|a warm wedding speech that made guests laugh;kind jokes on every page;stories that make everyone smile|humorous means funny in a way that makes people laugh; sarcastic means mocking by saying the opposite|humorous 是幽默逗笑；sarcastic 是说反话挖苦|sarcastic=sarcastic means mocking by saying the opposite, which is unkind rather than warm and gentle=sarcastic 是说反话挖苦，刻薄而不温和;cynical=cynical means thinking that everyone is selfish, not making people laugh=cynical 是认为人人自私，不是逗人发笑|hu · mor · ous|humor + ous, with no u after the o in American English|humor + ous，美式拼法 o 后没有 u
      sincere|apologies from someone truly sorry;tears when she said sorry;a speech meant word for word|sincere means really meaning what you say; sarcastic means saying the opposite of what you mean|sincere 是真诚；sarcastic 是说反话|sarcastic=sarcastic means saying the opposite of what you mean, not truly meaning it=sarcastic 是说反话，不是真心实意;cynical=cynical means believing that people only care about themselves, not meaning every word you say=cynical 是认为人皆自私，不是句句真心|sin · cere|-cere at the end, like *here* with a c|结尾是 -cere，和 *here* 的拼法一样，前面是 c
      cynical|thinking politicians care only about themselves;trusting nobody after broken promises;an attempt made only for his own gain|cynical means thinking everyone acts for themselves; skeptical means doubting that a claim is true|cynical 是认为人皆自私；skeptical 是怀疑说法是否属实|sympathetic=sympathetic means caring about others, the opposite of thinking that everyone is selfish=sympathetic 是关心别人，和认为人皆自私正相反;sincere=sincere means honest and meaning what you say, the opposite of acting only for your own gain=sincere 是真诚，和只为私利正相反|cyn · i · cal|a y after the c, which sounds like s|c 后面是 y，c 读作 s
      optimistic|believing a strong team will win;a patient getting better every day;a report saying growth will be strong|optimistic means expecting good things; pessimistic means expecting bad things|optimistic 是乐观；pessimistic 是悲观|pessimistic=pessimistic means expecting bad things, but the sentence expects good ones=pessimistic 是预料坏事，但句子预料的是好事;skeptical=skeptical means doubting that something is true, not expecting good things to happen=skeptical 是怀疑，不是预料好事发生|op · ti · mis · tic|optim + istic, with one t and one m|optim + istic，一个 t、一个 m
      pessimistic|the future of the planet getting worse;a plan that might work after all;forecasts that growth will slow|pessimistic means expecting bad things; optimistic means expecting good things|pessimistic 是悲观；optimistic 是乐观|optimistic=optimistic means expecting good things, but the sentence expects bad ones=optimistic 是预料好事，但句子预料的是坏事;enthusiastic=enthusiastic means excited and interested, not expecting things to go badly=enthusiastic 是热情兴奋，不是预料事情会变糟|pes · si · mis · tic|a double s after pe|pe 后面双写 s
      skeptical|scientists wanting more proof;doubts at first about a plan that worked;voters doubting promises never kept|skeptical means doubting a claim; cynical means thinking that everyone is selfish|skeptical 是怀疑某个说法；cynical 是认为人皆自私|enthusiastic=enthusiastic means excited and eager, not doubting that something is true=enthusiastic 是热情急切，不是怀疑真假;optimistic=optimistic means expecting good things, not doubting that a claim or a plan will work=optimistic 是预料好事，不是怀疑说法或计划|skep · ti · cal|sk at the start in American English, *sceptical* in British English|美式以 sk 开头，英式写作 *sceptical*
      critical|a report listing police mistakes;complaints about salty, cold food;teachers saying an exam was badly written|critical means saying what is wrong; supportive means saying what is good and helping|critical 是批评；supportive 是支持|supportive=supportive means helping and agreeing with someone, the opposite of listing what is wrong=supportive 是支持赞同，和挑毛病正相反;appreciative=appreciative means showing that you value something, not saying what is wrong with it=appreciative 是欣赏感激，不是挑毛病|crit · i · cal|critic + al|critic + al
      enthusiastic|a crowd cheering and clapping;someone who talks about her new job all the time;students who couldn't wait for a trip|enthusiastic means showing great interest and excitement; indifferent means not caring|enthusiastic 是热情；indifferent 是冷淡|indifferent=indifferent means not caring at all, the opposite of great excitement=indifferent 是毫不在乎，和兴奋热情正相反;cynical=cynical means thinking that people are selfish, not being excited about something=cynical 是认为人皆自私，不是对某事兴奋|en · thu · si · as · tic|th after en, and -iastic at the end|en 后面是 th，结尾是 -iastic
      indifferent|someone who didn't even ask about her problems;young people who never vote;a waiter who didn't care if we were served|indifferent means not caring; sympathetic means caring about someone's problems|indifferent 是漠不关心；sympathetic 是同情关心|enthusiastic=enthusiastic means very interested and excited, the opposite of not caring=enthusiastic 是很感兴趣，和不在乎正相反;sympathetic=sympathetic means caring about someone's problems, the opposite of not caring=sympathetic 是关心别人的困难，和不在乎正相反|in · dif · fer · ent|in + different, with a double f|in + different，双写 f
      sympathetic|flowers sent when a father died;a boss who gave a day off;support for workers on strike|sympathetic means caring about someone's problems; indifferent means not caring|sympathetic 是同情关心；indifferent 是漠不关心|indifferent=indifferent means not caring at all, the opposite of showing that you care=indifferent 是毫不在乎，和表示关心正相反;sarcastic=sarcastic means mocking someone by saying the opposite, not caring about their problems=sarcastic 是说反话挖苦，不是关心别人的困难|sym · pa · thet · ic|sym with a y, and -thetic at the end|sym 里是 y，结尾是 -thetic
    `,
  },
});

const screen = vocabularyTopic({
  id: "b2-words-film-and-tv",
  title: t("Film and Television", "电影与电视"),
  summary: t(
    "Sitcoms, thrillers, horror and animation; the cast and the screenplay; sequels; subtitles and dubbing; genres; blockbusters and trailers; critics.",
    "情景喜剧、惊悚片、恐怖片和动画；演员阵容和剧本；续集；字幕和配音；类型；大片和预告片；评论家。",
  ),
  intro: t(
    "Friday is movie night: Mia wants the new **thriller**, Leo wants an old **sitcom**, and in the end they watch a **sequel** with **subtitles**. These words help you talk about the films and shows you watch and how they are made.",
    "周五是电影之夜：米娅想看新出的 **thriller**（惊悚片），利奥想看一部老 **sitcom**（情景喜剧），最后他们看了一部带 **subtitles**（字幕）的 **sequel**（续集）。这些词帮你谈论你看的电影和节目，以及它们是怎么拍出来的。",
  ),
  prerequisites: ["b1-words-film-and-theater"],
  words: [
    word(
      "sitcom sitcoms",
      "a funny television series about the same characters in everyday situations",
      "情景喜剧",
      "We laughed all evening at an old {sitcom} about a family in New York. | {Sitcoms} are funny TV series, often about the same friends in the same flat.|thrillers trailers | The {sitcom} ran for ten seasons and made viewers laugh every week.",
      "thriller trailer",
    ),
    word(
      "thriller thrillers",
      "an exciting book or film about crime or danger",
      "惊悚片；惊险小说",
      "The {thriller}, full of danger and twists, kept me on the edge of my seat. | She writes {thrillers} about spies who are always in danger.|sitcoms documentaries | It's a fast, made-up {thriller} about a bank robbery, with a shocking ending.",
      "sitcom documentary",
    ),
    word(
      "horror",
      "great fear; a kind of film that is meant to frighten you",
      "恐惧；恐怖片",
      "I don't watch {horror} films: they give me nightmares. | She screamed in {horror} when she saw the body. | The {horror} of the war was shown on the news.",
      "animation comedy",
    ),
    word(
      "animation",
      "films made from drawings or computer pictures that seem to move",
      "动画；动画制作",
      "The studio is famous for its {animation}: its drawn characters seem to move. | Computer {animation} has changed films for children. | She studied {animation} at art school and now draws cartoons.",
      "horror dubbing",
    ),
    word(
      "cast casts",
      "all the actors in a film or a play",
      "演员阵容",
      "The {cast} includes several famous actors. | The whole {cast} came on stage at the end to bow. | The film has a young {cast}: most of the actors are under twenty.",
      "crew audience",
    ),
    word(
      "screenplay screenplays",
      "the written text of a film, with what the actors say",
      "电影剧本",
      "She won an award for the {screenplay}: she wrote every line the actors say. | He writes {screenplays} for Hollywood films, full of scenes and dialogue.|trailers soundtracks | The {screenplay} is based on a true story, and the writer spent a year on it.",
      "trailer soundtrack",
    ),
    word(
      "sequel sequels",
      "a book or a film that continues the story of an earlier one",
      "续集；续篇",
      "The {sequel}, which continues the story, is even better than the first film. | They are making a {sequel} next year to show what happens to the hero after the war. | {Sequels} rarely match the first film whose story they continue.|Trailers Remakes",
      "trailer remake",
    ),
    word(
      "subtitle subtitles",
      "words at the bottom of the screen that translate what is said",
      "字幕",
      "We watched the Korean film with English {subtitles} at the bottom of the screen. | Can you turn on the {subtitles}? I can't understand what they're saying. | The {subtitles} at the bottom of the screen were full of mistakes.",
      "trailers screenplays",
      "dub",
    ),
    word(
      "dub dubs dubbed dubbing",
      "to replace the sounds of a film with words in another language",
      "配音；译制",
      "The cartoon was {dubbed} into Chinese.|cast filmed | Many countries {dub} foreign films so viewers hear their own language. | I prefer subtitles to {dubbing}, because I like to hear the actors' real voices.|casting filming",
      "cast film",
      "subtitle",
    ),
    word(
      "genre genres",
      "a type of art, music, writing or film",
      "类型；体裁",
      "Science fiction is my favorite {genre}. | The film mixes several {genres}: comedy, horror and romance.|sequels trailers | Jazz is a {genre} of music, like rock or pop.",
      "sequel trailer",
    ),
    word(
      "blockbuster blockbusters",
      "a very successful and expensive film or book",
      "大片；畅销书",
      "The summer {blockbuster} made a billion dollars. | Hollywood spends huge sums making {blockbusters} that millions will see.|flops trailers | Her novel became a {blockbuster}, sold in every bookshop.",
      "flop trailer",
    ),
    word(
      "trailer trailers",
      "a short film that shows parts of a new film to advertise it",
      "预告片",
      "The {trailer} for the new film, only two minutes long, has ten million views. | We watched the {trailers} for coming films before the film started.|sequels screenplays | The {trailer} shows all the best jokes, so the film has no surprises.",
      "sequel screenplay",
    ),
    word(
      "critic critics",
      "a person whose job is to give opinions about films, books, art or food; a person who says what is wrong with someone or something",
      "评论家；批评者",
      "The {critics} wrote glowing reviews of the film, but it made little money. | She works as a food {critic}, writing reviews for a newspaper.|director producer | Even his {critics}, who usually attack his work, agree that he is talented.",
      "directors producers",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "The *cast* are the actors you see on screen, while the *crew* are the people who work behind the camera. Look for words such as *actors* or *on stage* that point to the cast.",
        "*cast* 是银幕上的演员，*crew* 是镜头后面工作的人员。找找句中的 *actors* 或 *on stage* 这类词，它们指向 cast。",
      ),
      meaning: t(
        "*Subtitles* put a translation in words at the bottom of the screen, while to *dub* a film is to replace the voices with another language. Check whether the meaning is about words you read or voices you hear.",
        "*subtitles* 是屏幕底部的翻译文字，*dub* 是把配音换成另一种语言。看释义说的是读到的文字，还是听到的声音。",
      ),
      spell: t(
        "*Genre* comes from French, so its g sounds like the s in *measure* and it ends in -re; *sequel* has qu, and *thriller* has a double l.",
        "*genre* 来自法语，g 读音像 *measure* 里的 s，结尾是 -re；*sequel* 里是 qu，*thriller* 双写 l。",
      ),
    },
    notes: `
      sitcom|an old show about a family in New York;funny series about the same friends;a show that made viewers laugh for ten seasons|a sitcom is a funny TV series; a thriller is an exciting story about danger|sitcom 是情景喜剧；thriller 是惊悚片|thriller/thrillers=a thriller is an exciting story about crime or danger, not a funny series that makes people laugh=thriller 是关于犯罪或危险的惊险故事，不是逗人发笑的连续剧;trailer/trailers=a trailer is a short advert for a new film, not a series that runs for seasons=trailer 是新片的短预告，不是连播好几季的剧集|sit · com|sit(uation) + com(edy)|situation 和 comedy 的缩合
      thriller|a film full of danger and twists;books about spies in danger;a made-up story of a bank robbery with a shocking ending|a thriller is an exciting story about crime or danger; a documentary shows real events|thriller 是惊悚片；documentary 是纪录片|sitcom/sitcoms=a sitcom is a funny series about everyday life, not a story full of danger=sitcom 是关于日常生活的喜剧，不是充满危险的故事;documentary/documentaries=a documentary shows real facts, not a made-up story full of danger and twists=documentary 讲真实的事，不是虚构的惊险故事|thril · ler|thrill + er, with a double l|thrill + er，双写 l
      horror|films that give nightmares;a scream at seeing a body;the terrible fear of a war shown on the news|horror is great fear, or films meant to frighten you; comedy is meant to make you laugh|horror 是恐惧或恐怖片；comedy 是喜剧|animation=animation is drawings that seem to move, not great fear=animation 是会动的图画，不是极度恐惧;comedy=comedy is meant to make you laugh, the opposite of fear and nightmares=comedy 是逗人发笑的，和恐惧、噩梦正相反|hor · ror|a double r twice: h-o-rr-o-r|两处都是 r：h-o-rr-o-r
      animation|a studio whose drawn characters seem to move;computer pictures that move in children's films;art school study that leads to drawing cartoons|animation makes drawings seem to move; dubbing replaces the voices in a film|animation 是动画；dubbing 是配音|horror=horror is fear, or films meant to frighten you, not drawings that seem to move=horror 是恐惧或恐怖片，不是会动的图画;dubbing=dubbing replaces the voices in a film, not the drawings that move=dubbing 是换配音，不是会动的画面|an · i · ma · tion|animate + ion, dropping the e|animate 去掉 e 再加 ion
      cast|several famous actors;actors who came on stage to bow;actors mostly under twenty|the cast are the actors; the crew work behind the camera|cast 是演员；crew 是幕后人员|crew=the crew work behind the camera and are not the actors who appear and bow=crew 是幕后人员，不是出镜和谢幕的演员;audience=the audience watch the film or the play, not act in it=audience 是观众，不是参演的人|cast|a short a, and the same form for one or many|短元音 a，单复数同形
      screenplay|every line the actors say;scenes and dialogue for Hollywood films;a written story that took a writer a year|a screenplay is the written text of a film; a soundtrack is its music|screenplay 是剧本；soundtrack 是配乐|trailer/trailers=a trailer is a short advert for a film, not the text with every line the actors say=trailer 是电影的短预告，不是写有全部台词的文本;soundtrack/soundtracks=a soundtrack is the music of a film, not the written scenes and lines=soundtrack 是电影配乐，不是写好的场景和台词|screen · play|screen + play, one word|screen + play，连写成一个词
      sequel|a film that continues the story;a film showing what happens to the hero after the war;films that continue a first film's story|a sequel continues an earlier story; a remake tells the same story again|sequel 是续集；remake 是翻拍|trailer/trailers=a trailer is a short advert for a film, not a whole film that continues the story=trailer 是短预告，不是接着讲故事的整部电影;remake/remakes=a remake tells the same story again, rather than continuing it=remake 是把同一个故事再拍一遍，而不是接着讲|se · quel|qu after the e, and -el at the end|e 后面是 qu，以 -el 结尾
      subtitle|English words at the bottom of a Korean film;words that help you understand what is said;words at the bottom of the screen with mistakes|subtitles are translated words you read; dubbing replaces the voices you hear|subtitles 是读到的翻译文字；dubbing 是听到的配音|trailer/trailers=a trailer is a short advert for a film, not words shown at the bottom of the screen=trailer 是短预告，不是屏幕底部的文字;screenplay/screenplays=a screenplay is the script the actors use, not the words shown at the bottom of the screen=screenplay 是演员用的剧本，不是屏幕底部的文字|sub · ti · tle|sub + title|sub + title
      dub|a cartoon given Chinese voices;foreign films heard in your own language;voices replaced instead of the actors' real ones|to dub is to replace the voices with another language; subtitles show a translation in words|dub 是配音；subtitles 是字幕|cast/casting=to cast a film is to choose its actors, not to change the language of its voices=cast 是挑选演员，不是换配音语言;film/filmed/filming=to film is to record with a camera, not to replace voices with another language=film 是拍摄，不是换成另一种语言的配音|dub|a double b in *dubbed* and *dubbing*|*dubbed* 和 *dubbing* 双写 b
      genre|science fiction as a favorite type;comedy, horror and romance mixed in one film;jazz as a type of music like rock|a genre is a type of film, music or writing; a sequel is one film that continues another|genre 是类型；sequel 是续集|sequel/sequels=a sequel is one film that continues another, not a type such as science fiction or jazz=sequel 是接续的一部作品，不是科幻、爵士这样的类型;trailer/trailers=a trailer is a short advert for one film, not a type of art=trailer 是一部影片的预告，不是艺术类型|gen · re|a French word, g as in *measure* and -re at the end|法语词，g 读音同 *measure* 的 s，结尾是 -re
      blockbuster|a summer film that made a billion dollars;expensive films millions will see;a novel sold in every bookshop|a blockbuster is a huge success; a flop is a failure|blockbuster 是大片；flop 是失败之作|flop/flops=a flop is a film or a book that fails, the opposite of a huge success=flop 是失败的作品，和大获成功正相反;trailer/trailers=a trailer is a short advert, not a whole film or book that sells hugely=trailer 是短预告，不是大卖的整部作品|block · bus · ter|block + buster, one word|block + buster，连写成一个词
      trailer|a two-minute advert for a new film;adverts for coming films;an advert that shows the best jokes|a trailer is a short advert for a film; a sequel is a whole film that continues a story|trailer 是预告片；sequel 是续集|sequel/sequels=a sequel is a whole new film, not a two-minute advert=sequel 是一整部新片，不是两分钟的广告;screenplay/screenplays=a screenplay is the written script, not a short film you watch=screenplay 是文字剧本，不是可以观看的短片|trail · er|trail + er, with ai|trail + er，中间是 ai
      critic|people who wrote reviews of a film;someone who writes food reviews for a paper;people who usually attack his work|a critic gives opinions on others' work; a director makes the film|critic 是评论家；director 是导演|director/directors=a director makes the film, not someone who writes reviews or attacks the work=director 是拍电影的人，不是写评论或批评作品的人;producer/producers=a producer finds the money and runs the making of a film, not someone who reviews it=producer 负责筹资和制作，不是写评论的人|crit · ic|-ic at the end, the c sounding like k|以 -ic 结尾，c 读作 k
    `,
  },
});

const opinion = vocabularyTopic({
  id: "b2-words-public-opinion",
  title: t("Public Opinion", "公众舆论"),
  summary: t(
    "Polls and referendums; consensus; outrage and backlash; criticism; approval and disapproval; sentiment and stance; perceptions and how people perceive things.",
    "民意调查和全民公投；共识；愤慨和强烈反对；批评；赞成和不赞成；情绪和立场；看法以及人们如何看待事物。",
  ),
  intro: t(
    "A **poll** showed that most people disliked the new airport. When the plan went ahead, there was **outrage** online and a **backlash** from local voters, and the mayor changed her **stance**. These words help you talk about what the public thinks and how it reacts.",
    "一项 **poll**（民意调查）显示，大多数人不喜欢新机场。计划照样推进后，网上一片 **outrage**（愤慨），当地选民也出现 **backlash**（强烈反对），市长随即改变了 **stance**（立场）。这些词帮你谈论公众怎么想、怎么反应。",
  ),
  prerequisites: ["b1-words-opinions"],
  words: [
    word(
      "poll polls",
      "a study in which many people are asked what they think",
      "民意调查",
      "A new {poll}, which asked 2,000 people, shows that most voters support the plan. | The {polls} were wrong about who would win the election.|referendums stances | According to the latest {poll} of a thousand adults, the president is unpopular.",
      "referendum stance",
    ),
    word(
      "referendum referendums",
      "a vote in which all the people of a country decide one question",
      "全民公投",
      "The country held a {referendum} in which every citizen voted yes or no on independence. | The {referendum} was binding, so the government had to do what the voters decided. | Swiss citizens vote in several {referendums} each year, each on a single question.|polls consensuses",
      "poll consensus",
    ),
    word(
      "consensus",
      "an opinion that all or most people agree with",
      "共识；一致意见",
      "There is a {consensus} among scientists that the climate is changing: almost all agree. | The group reached a {consensus} after hours of talks. | There is no {consensus} on how to fix the problem: experts disagree.",
      "backlash controversy",
    ),
    word(
      "outrage outrages",
      "a strong feeling of anger and shock",
      "愤慨；暴行",
      "The decision caused public {outrage}, with angry crowds in the streets. | There was {outrage} when the park was sold: people were angry and shocked. | People expressed their {outrage} at the cruel attack.",
      "approval consensus",
      "backlash",
    ),
    word(
      "backlash backlashes",
      "a strong negative reaction from many people against a change or a decision",
      "强烈反对",
      "The new tax led to a {backlash} from angry voters. | The company faced a {backlash} over its advert, and many customers stopped buying. | Fearing a {backlash}, the minister changed the plan.",
      "consensus approval",
      "outrage",
    ),
    word(
      "criticism",
      "saying what you think is bad about someone or something",
      "批评；指责",
      "The plan has faced strong {criticism} from experts who say it won't work. | She can't take {criticism}: she gets upset when anyone points out a mistake. | His book received harsh {criticism} from many experts.",
      "approval praise",
      "disapproval",
    ),
    word(
      "approval",
      "the feeling that something is good; official permission",
      "赞成；批准",
      "The plan needs {approval} from the city council before work can start. | She smiled and nodded with {approval}. | The president's {approval} rating has risen, as more people like what he does.",
      "criticism disapproval",
      "consensus",
    ),
    word(
      "disapproval",
      "the feeling that something is bad or wrong",
      "不赞成；反对",
      "She shook her head in {disapproval}. | There is wide public {disapproval} of the war, and many marches against it. | His parents made their {disapproval} clear: they hated the plan.",
      "approval consensus",
      "criticism",
    ),
    word(
      "sentiment sentiments",
      "a feeling or an opinion, especially one shared by many people",
      "情绪；观点",
      "Public {sentiment} is turning against the war, as more people feel it is wrong. | I share your {sentiments} exactly: I feel the same way.|polls stances | Anti-tourist {sentiment} is growing in the city as locals feel crowded out.",
      "poll stance",
    ),
    word(
      "stance stances",
      "a public opinion on a subject",
      "立场；观点",
      "What is the party's official {stance} on taxes? | She took a strong {stance} against the new law. | He changed his {stance} after the election, and now supports the plan.",
      "sentiment backlash",
    ),
    word(
      "perception perceptions",
      "the way you understand or think about something",
      "看法；感知",
      "There's a {perception} that the city is unsafe, though crime is low. | The film changed my {perception} of war. | Public {perceptions} of the police have changed over the years.|backlashes stances",
      "backlash stance",
    ),
    word(
      "perceive perceives perceived perceiving",
      "to see or understand something in a particular way",
      "认为；察觉",
      "Many people {perceive} the plan as unfair. | She is {perceived} as a strong leader.|polled outraged | How do others {perceive} you: as kind, or as cold?",
      "poll outrage",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "A *poll* asks a sample of people what they think, while a *referendum* is an official vote in which every citizen decides. Look for words such as *every citizen*, *binding* or *2,000 people* that show which one fits.",
        "*poll* 是抽样询问一部分人的看法，*referendum* 是全体公民参加的正式投票。找找句中的 *every citizen*、*binding* 或 *2,000 people* 这类词，判断该用哪个。",
      ),
      meaning: t(
        "A *sentiment* is a feeling that many people share, while a *stance* is the public position someone takes on a subject. Check whether the meaning is about a feeling or about a position.",
        "*sentiment* 是很多人共有的情绪，*stance* 是某人在某个问题上公开表明的立场。看释义说的是情绪，还是立场。",
      ),
      spell: t(
        "*Consensus* has an s in the middle, not a c: con · sen · sus, and it is not *census*. *Perceive* follows i before e except after c.",
        "*consensus* 中间是 s，不是 c：con · sen · sus，也不是 *census*。*perceive* 遵循“c 后 e 在 i 前”的规则。",
      ),
    },
    notes: `
      poll|2,000 people asked about a plan;guesses about who would win an election;a thousand adults asked about the president|a poll asks a sample of people; a referendum is a vote of all citizens|poll 是抽样调查；referendum 是全民公投|referendum/referendums=a referendum is an official vote of every citizen, not a study that asks some people=referendum 是全体公民的正式投票，不是询问部分人的调查;stance/stances=a stance is one side's opinion on a subject, not a study of what many people think=stance 是一方的立场，不是了解大众想法的调查|poll|a double l|双写 l
      referendum|every citizen voting yes or no on independence;a vote the government had to obey;Swiss votes on single questions|a referendum is an official vote of everyone; a poll only asks a sample|referendum 是全民投票；poll 只是抽样调查|poll/polls=a poll only asks some people and decides nothing, but here every citizen votes on a question=poll 只问一部分人，也决定不了什么，而这里是全体公民投票;consensus/consensuses=a consensus is an opinion most people share, not a vote that people take part in=consensus 是多数人的共识，不是人们参加的投票|ref · er · en · dum|refer + endum, with -um at the end|refer + endum，以 -um 结尾
      consensus|almost all scientists agreeing about the climate;agreement reached after hours of talks;experts disagreeing on a fix|a consensus is broad agreement; a controversy is strong disagreement|consensus 是共识；controversy 是争议|backlash=a backlash is an angry reaction against a decision, not broad agreement=backlash 是对决定的强烈反对，不是普遍认同;controversy=a controversy is strong public disagreement, the opposite of agreement=controversy 是公开的激烈争论，和一致意见正相反|con · sen · sus|s in the middle and -sus at the end, not *census*|中间是 s，结尾是 -sus，不是 *census*
      outrage|angry crowds in the streets;anger and shock when a park was sold;anger at a cruel attack|outrage is a strong feeling of anger and shock; a backlash is a reaction against a change|outrage 是愤慨；backlash 是对变化的强烈反对|approval=approval is the feeling that something is good, the opposite of anger and shock=approval 是认为某事好，和愤怒震惊正相反;consensus=consensus is calm agreement, not anger and shock=consensus 是平和的共识，不是愤怒和震惊|out · rage|out + rage|out + rage
      backlash|angry voters against a new tax;customers who stopped buying after an advert;a reaction the minister feared|a backlash is a strong reaction against a change; outrage is the feeling of anger itself|backlash 是强烈反对的行动；outrage 是愤慨的情绪|consensus=consensus is broad agreement, not a negative reaction against a change=consensus 是普遍认同，不是对变化的反对;approval=approval is the feeling that something is good, the opposite of a reaction against it=approval 是赞成，和反对正相反|back · lash|back + lash, one word|back + lash，连写成一个词
      criticism|experts who say a plan won't work;getting upset when a mistake is pointed out;harsh words about a book|criticism is saying what is bad; praise is saying what is good|criticism 是批评；praise 是赞扬|approval=approval is the feeling that something is good, not pointing out what is bad=approval 是赞成，不是指出缺点;praise=praise is saying what is good, the opposite of pointing out what is wrong=praise 是赞扬，和指出错误正相反|crit · i · cism|critic + ism, with a c that sounds like s before the i|critic + ism，i 前的 c 读作 s
      approval|a council's permission to start work;a smile and a nod;a rating that rises when people like a president|approval is the feeling that something is good, or official permission; disapproval is the feeling that it is bad|approval 是赞成或批准；disapproval 是不赞成|criticism=criticism is saying what is bad, not giving permission or showing that you like something=criticism 是指出缺点，不是批准或表示喜欢;disapproval=disapproval is the feeling that something is bad, the opposite of liking it=disapproval 是不赞成，和喜欢正相反|ap · prov · al|a double p, and approve drops its e|双写 p，approve 去掉 e
      disapproval|a shake of the head;public feeling against a war;parents who hated a plan|disapproval is the feeling that something is wrong; criticism puts that feeling into words|disapproval 是不赞成的态度；criticism 是说出来的批评|approval=approval is the feeling that something is good, the opposite of thinking it is wrong=approval 是赞成，和认为不对正相反;consensus=consensus is agreement among many people, not the feeling that something is wrong=consensus 是众人的一致意见，不是认为某事不对|dis · ap · prov · al|dis + approval, with one s and a double p|dis + approval，一个 s，双写 p
      sentiment|feeling turning against a war;the same feelings as yours;locals feeling crowded out by tourists|a sentiment is a feeling many share; a stance is a position someone takes publicly|sentiment 是情绪；stance 是立场|poll/polls=a poll is a study that asks people what they think, not the feeling itself=poll 是询问看法的调查，不是情绪本身;stance/stances=a stance is a position someone takes publicly, not a feeling that grows among many people=stance 是公开表明的立场，不是在人群中滋长的情绪|sen · ti · ment|senti + ment, with no a|senti + ment，中间没有 a
      stance|a party's official view on taxes;a strong position against a law;a view changed after an election|a stance is a public position; a sentiment is a feeling|stance 是立场；sentiment 是情绪|sentiment/sentiments=a sentiment is a feeling shared by many, not an official position that someone takes=sentiment 是多数人共有的情绪，不是某人表明的正式立场;backlash/backlashes=a backlash is a reaction against something, not a position you hold on a subject=backlash 是对某事的反对行动，不是你在问题上的立场|stance|-ance at the end, as in *dance*|结尾是 -ance，和 *dance* 一样
      perception|a belief that a city is unsafe;a view of war changed by a film;how the public sees the police|a perception is how you understand something; a stance is a position you take publicly|perception 是看法；stance 是立场|backlash/backlashes=a backlash is a reaction against a change, not the way you understand something=backlash 是反对行动，不是理解事物的方式;stance/stances=a stance is a position you state publicly, not your inner way of seeing something=stance 是公开表明的立场，不是内心看待事物的方式|per · cep · tion|perceive changes to -cept- before -ion|perceive 变成 -cept- 再加 -ion
      perceive|a plan seen as unfair;a woman seen as a strong leader;how others see you|to perceive is to see something in a particular way; to poll is to ask many people what they think|perceive 是看待；poll 是调查|poll/polled=to poll is to ask many people what they think, not to see something in a particular way=poll 是询问众人看法，不是以某种方式看待;outrage/outraged=to outrage is to make people very angry, not to see something in a particular way=outrage 是激怒，不是以某种方式看待|per · ceive|ei after c, as in *receive*|c 后面是 ei，和 *receive* 一样
    `,
  },
});

const connectives = vocabularyTopic({
  id: "b2-words-linking-3",
  title: t("Words for Precise Arguments", "使论证精确的词"),
  summary: t(
    "Albeit and notwithstanding; conversely and alternatively; additionally; admittedly and arguably; inevitably and essentially; specifically, notably and particularly.",
    "尽管和虽然；相反地和或者；此外；诚然和可以说；不可避免地和本质上；具体地说、尤其和特别地。",
  ),
  intro: t(
    "**Admittedly**, the new library cost a lot. It is, **arguably**, the best building in town, and it is busy, **notably** with students. **Conversely**, the old one stood empty. These words help you make an argument exact: you admit a point, compare two sides or pick out one example.",
    "**Admittedly**（诚然），新图书馆花了很多钱。它 **arguably**（可以说）是城里最好的建筑，而且很热闹，**notably**（尤其）是学生多。**Conversely**（相反地），旧图书馆却空空荡荡。这些词让论证更精确：承认一个观点、对比两方，或挑出一个例子。",
  ),
  prerequisites: ["b2-words-linking-2"],
  words: [
    word(
      "albeit",
      "although (used before an adjective, an adverb or a short phrase)",
      "尽管；虽然",
      "It was a good result, {albeit} a lucky one. | He agreed, {albeit} unwillingly. | The plan worked, {albeit} slowly.",
      "conversely additionally",
      "notwithstanding",
    ),
    word(
      "notwithstanding",
      "despite (formal)",
      "尽管；虽然",
      "{Notwithstanding} the bad weather, the match went ahead. | The project, {notwithstanding} its problems, was a success. | {Notwithstanding} her age, she ran the marathon.",
      "conversely additionally",
      "albeit",
    ),
    word(
      "conversely",
      "in an opposite way",
      "相反地",
      "Some people eat when they are stressed; {conversely}, others stop eating. | Cold weather raises gas prices; {conversely}, a warm winter lowers them. | Men here tend to retire early; women, {conversely}, work longer.",
      "additionally specifically",
    ),
    word(
      "alternatively",
      "as another possibility",
      "或者；另一种选择是",
      "We could take the train or, {alternatively}, we could drive. | You can pay online or, {alternatively}, at the post office. | {Alternatively}, if you prefer not to call, you can send us an email.",
      "conversely notably",
    ),
    word(
      "additionally",
      "as well as what has been said",
      "此外；另外",
      "The hotel is near the beach. {Additionally}, it has a pool. | Students need good grades. {Additionally}, they must pass a test. | The job pays well; {additionally}, it offers free training.",
      "conversely albeit",
      "notably",
    ),
    word(
      "admittedly",
      "used to accept that something is true, before saying something different",
      "诚然；不可否认",
      "{Admittedly}, the hotel was expensive, but it was worth it. | It was, {admittedly}, a difficult decision. | {Admittedly}, I haven't read the whole report.",
      "conversely specifically",
      "arguably",
    ),
    word(
      "arguably",
      "used to say that there are good reasons for believing something",
      "可以说；按理说",
      "She is {arguably} the best player in the world. | It is {arguably} the most important invention of the century. | This is {arguably} his greatest film.",
      "conversely alternatively",
      "admittedly",
    ),
    word(
      "inevitably",
      "in a way that cannot be avoided",
      "不可避免地",
      "Prices will {inevitably} rise. | {Inevitably}, some people lost their jobs. | The topic {inevitably} turned to money.",
      "conversely alternatively",
    ),
    word(
      "essentially",
      "in the most important ways; basically",
      "本质上；基本上",
      "The two plans are {essentially} the same. | {Essentially}, the problem is a lack of money. | The film is {essentially} a love story.",
      "alternatively conversely",
    ),
    word(
      "specifically",
      "for a particular reason or purpose; exactly",
      "具体地；特地",
      "The course is designed {specifically} for beginners. | I {specifically} asked for no sugar. | Which areas, {specifically}, need improvement?",
      "albeit conversely",
      "particularly",
    ),
    word(
      "notably",
      "especially; in a way that is worth noticing",
      "尤其；显著地",
      "Several countries, {notably} France and Spain, agreed. | The weather was {notably} warmer this year. | Some players, {notably} the captain, played very well.",
      "albeit conversely",
      "particularly",
    ),
    word(
      "particularly",
      "more than usual; especially",
      "特别；尤其",
      "I'm not {particularly} hungry. | The museum is {particularly} popular with children. | Prices are high, {particularly} in the capital.",
      "albeit conversely",
      "notably",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Albeit* goes before a short phrase with no verb, as in *albeit slowly*, while *notwithstanding* goes before a noun, as in *notwithstanding the weather*. Look at what comes right after the gap.",
        "*albeit* 后面接不带动词的短语，如 *albeit slowly*；*notwithstanding* 后面接名词，如 *notwithstanding the weather*。看空格后面紧跟的是什么。",
      ),
      meaning: t(
        "*Admittedly* accepts a point against you before you go on, while *arguably* says there are good reasons for a claim. Check whether the meaning is about giving way or about claiming.",
        "*admittedly* 是先承认对自己不利的一点再往下说，*arguably* 是说某个说法有充分理由。看释义说的是让步，还是主张。",
      ),
      spell: t(
        "*Notwithstanding* is one word, not + with + standing; *albeit* is all + be + it with one l; *additionally* has a double d and a double l.",
        "*notwithstanding* 连写，是 not + with + standing；*albeit* 是 all + be + it，只有一个 l；*additionally* 双写 d，也双写 l。",
      ),
    },
    notes: `
      albeit|a good but lucky result;agreeing unwillingly;a plan that worked slowly|albeit means "although" before a short phrase; notwithstanding means "despite" before a noun|albeit 后接短语；notwithstanding 后接名词|conversely=conversely introduces the opposite case, not a small point that limits what was just said=conversely 引出相反的情况，不是对刚说的话加以限制;additionally=additionally adds one more point, not a "but" that limits what was just said=additionally 是再加一点，不是对刚说的话表示让步|al · be · it|all + be + it, written with one l|all + be + it，只写一个 l
      notwithstanding|a match played in bad weather;a project that succeeded despite problems;a marathon run despite her age|notwithstanding means "despite" before a noun; albeit means "although" before a short phrase|notwithstanding 后接名词；albeit 后接短语|conversely=conversely introduces the opposite case, and cannot come before a noun to mean "despite"=conversely 引出相反情况，不能放在名词前表示“尽管”;additionally=additionally adds another point, and cannot come before a noun to mean "despite"=additionally 是再补充一点，不能放在名词前表示“尽管”|not · with · stand · ing|not + with + standing, one word|not + with + standing，连写成一个词
      conversely|some eating and others not eating when stressed;cold weather raising prices and warm weather lowering them;men retiring early and women working longer|conversely introduces the opposite case; additionally adds a similar point|conversely 引出相反情况；additionally 补充同类信息|additionally=additionally adds one more similar point, but the second half here is the opposite of the first=additionally 补充同类的点，但这里后半句与前半句相反;specifically=specifically gives an exact detail of the same point, not the opposite case=specifically 给出同一点的具体细节，不是相反的情况|con · verse · ly|converse + ly, keeping the e|converse + ly，保留 e
      alternatively|a train or a car;paying online or at the post office;an email instead of a call|alternatively offers another choice; conversely gives the opposite case|alternatively 提出另一个选择；conversely 给出相反情况|conversely=conversely gives the opposite case, not another choice you could make instead=conversely 给出相反情况，不是可以替换的另一个选择;notably=notably picks out an important example, not another choice=notably 挑出值得注意的例子，不是另一个选择|al · ter · na · tive · ly|alternative + ly, not *alternately*|alternative + ly，不是 *alternately*
      additionally|a hotel with a pool as well;a test on top of good grades;free training as well as good pay|additionally adds another point; conversely gives the opposite|additionally 补充一点；conversely 给出相反情况|conversely=conversely gives the opposite case, but here a second good point is added=conversely 给出相反情况，而这里是再加一个优点;albeit=albeit comes before a short phrase meaning "although", and cannot start a sentence to add a point=albeit 放在短语前表示“尽管”，不能放在句首补充信息|ad · di · tion · al · ly|a double d and a double l|双写 d，也双写 l
      admittedly|an expensive hotel that was worth it;a difficult decision;a report not fully read|admittedly accepts a point against you; arguably claims there are good reasons for something|admittedly 是让步承认；arguably 是有理由地主张|conversely=conversely gives the opposite case, not a point you accept before going on=conversely 给出相反情况，不是先承认的一点;specifically=specifically gives an exact detail, not a weakness you accept=specifically 给出具体细节，不是承认的不足|ad · mit · ted · ly|admit doubles its t: admitted + ly|admit 双写 t：admitted + ly
      arguably|the best player in the world;the most important invention of the century;his greatest film|arguably says there are good reasons for a claim; admittedly accepts a point against you|arguably 是可以说；admittedly 是诚然|conversely=conversely gives the opposite case, and does not support a claim such as "the best"=conversely 给出相反情况，不能用来支持“最好”这类说法;alternatively=alternatively offers another choice, and does not support a claim such as "the best"=alternatively 提出另一个选择，不能用来支持“最好”这类说法|ar · gu · a · bly|argue drops its e: argu + ably|argue 去掉 e：argu + ably
      inevitably|prices that will rise;jobs that were lost;talk that turned to money|inevitably means it cannot be avoided; alternatively offers another choice|inevitably 是不可避免；alternatively 是另一选择|conversely=conversely gives the opposite case, not something that cannot be avoided=conversely 给出相反情况，不是无法避免的事;alternatively=alternatively offers another choice, but here there is no choice at all=alternatively 提出另一个选择，而这里根本没有选择|in · ev · i · ta · bly|in + evitable, with -ably at the end|in + evitable，以 -ably 结尾
      essentially|two plans that are basically the same;a problem that is really about money;a film that is basically a love story|essentially means in the most important ways; alternatively offers another choice|essentially 是本质上；alternatively 是另一选择|alternatively=alternatively offers another choice, not what something basically is=alternatively 提出另一个选择，不是说事物的本质;conversely=conversely gives the opposite case, not what something basically is=conversely 给出相反情况，不是说事物的本质|es · sen · tial · ly|essential + ly, with a double s and a double l|essential + ly，双写 s，也双写 l
      specifically|a course made for beginners;a clear request for no sugar;exactly which areas need work|specifically means exactly, or for one purpose; particularly means more than usual|specifically 是具体地、专门地；particularly 是特别地|albeit=albeit means "although" before a short phrase, not "exactly" or "for one purpose"=albeit 在短语前表示“尽管”，不是“具体地”或“专门”;conversely=conversely gives the opposite case, not an exact purpose or detail=conversely 给出相反情况，不是具体的目的或细节|spe · cif · i · cal · ly|specific + ally, not -icly|specific + ally，不是 -icly
      notably|France and Spain among countries;weather clearly warmer this year;the captain among players|notably picks out an example worth noticing; particularly means more than usual|notably 挑出值得注意的例子；particularly 是特别地|albeit=albeit means "although", not an example worth noticing=albeit 表示“尽管”，不是挑出值得注意的例子;conversely=conversely gives the opposite case, not an example from a group=conversely 给出相反情况，不是从一组中挑出例子|no · ta · bly|notable drops its e: not + ably|notable 去掉 e：not + ably
      particularly|not very hungry;a museum popular with children;prices high in the capital|particularly means more than usual; notably picks out an example worth noticing|particularly 是特别；notably 是尤其值得注意的|albeit=albeit means "although", not "more than usual"=albeit 表示“尽管”，不是“特别”;conversely=conversely gives the opposite case, not "more than usual"=conversely 给出相反情况，不是“特别”|par · tic · u · lar · ly|particular + ly, with -ar- before -ly|particular + ly，-ly 前是 -ar-
    `,
  },
});

// Reporting verbs.

const joinWords = (...parts: readonly string[]) => parts.filter((p) => p !== "").join(" ");

/** Pattern is the shape of what follows a reporting verb. */
type Pattern = "ing" | "prep-ing" | "to" | "object-to";

/**
 * reports are a direct quotation, the reporting verb's base and past forms, the subject and object of the report, the
 * pattern after the verb, the two wrong forms of that pattern, two verbs that cannot take it, the rest of the report,
 * and another right form of the pattern (or "").
 */
const handReports: readonly (readonly [
  string,
  string,
  string,
  string,
  string,
  string,
  Pattern,
  readonly [string, string],
  readonly [string, string],
  string,
  string,
])[] = [
  [
    '"I didn\'t take the money," said Tom.',
    "deny",
    "denied",
    "Tom",
    "",
    "taking",
    "ing",
    ["to take", "take"],
    ["promised", "offered"],
    "the money",
    "having taken",
  ],
  [
    '"I won\'t sign the form," said Ana.',
    "refuse",
    "refused",
    "Ana",
    "",
    "to sign",
    "to",
    ["signing", "sign"],
    ["denied", "suggested"],
    "the form",
    "",
  ],
  [
    '"Please vote!" the candidate said to us.',
    "urge",
    "urged",
    "The candidate",
    "us",
    "to vote",
    "object-to",
    ["voting", "vote"],
    ["suggested", "said"],
    "",
    "",
  ],
  [
    '"I\'m sorry I was late," said Anna.',
    "apologize",
    "apologized",
    "Anna",
    "",
    "for being",
    "prep-ing",
    ["to be", "for be"],
    ["regretted", "explained"],
    "late",
    "for having been",
  ],
  [
    '"I broke the window," Lily said.',
    "admit",
    "admitted",
    "Lily",
    "",
    "breaking",
    "ing",
    ["to break", "break"],
    ["agreed", "offered"],
    "the window",
    "having broken",
  ],
  [
    '"OK, we\'ll share the cost," said the neighbors.',
    "agree",
    "agreed",
    "The neighbors",
    "",
    "to share",
    "to",
    ["sharing", "share"],
    ["suggested", "admitted"],
    "the cost",
    "",
  ],
  [
    '"Don\'t swim in the river," the lifeguard told the children.',
    "warn",
    "warned",
    "The lifeguard",
    "the children",
    "not to swim",
    "object-to",
    ["don't swim", "not swimming"],
    ["said", "explained"],
    "in the river",
    "",
  ],
  [
    '"You stole my phone!" Jake said to Leo.',
    "accuse",
    "accused",
    "Jake",
    "Leo",
    "of stealing",
    "prep-ing",
    ["for stealing", "to steal"],
    ["blamed", "criticized"],
    "his phone",
    "of having stolen",
  ],
  [
    '"Let\'s take a taxi," said Mia.',
    "suggest",
    "suggested",
    "Mia",
    "",
    "taking",
    "ing",
    ["to take", "us to take"],
    ["promised", "told"],
    "a taxi",
    "",
  ],
  [
    '"I can drive you home, Sara," said Leo.',
    "offer",
    "offered",
    "Leo",
    "",
    "to drive",
    "to",
    ["driving", "drive"],
    ["suggested", "denied"],
    "Sara home",
    "",
  ],
  [
    '"You should rest for a week," the doctor told Paul.',
    "advise",
    "advised",
    "The doctor",
    "Paul",
    "to rest",
    "object-to",
    ["resting", "rest"],
    ["explained", "suggested"],
    "for a week",
    "",
  ],
  [
    '"No, no, I\'m paying for dinner!" said Grandma.',
    "insist",
    "insisted",
    "Grandma",
    "",
    "on paying",
    "prep-ing",
    ["to pay", "on pay"],
    ["demanded", "suggested"],
    "for dinner",
    "",
  ],
  [
    '"You should book early," the guide said.',
    "recommend",
    "recommended",
    "The guide",
    "",
    "booking",
    "ing",
    ["to book", "book"],
    ["told", "promised"],
    "early",
    "",
  ],
  [
    '"I\'ll be on time, I promise," said Nina.',
    "promise",
    "promised",
    "Nina",
    "",
    "to be",
    "to",
    ["being", "be"],
    ["denied", "suggested"],
    "on time",
    "",
  ],
  [
    '"Apply for the job: you\'d be great!" Mum said to Zoe.',
    "encourage",
    "encouraged",
    "Mum",
    "Zoe",
    "to apply",
    "object-to",
    ["applying", "apply"],
    ["suggested", "said"],
    "for the job",
    "",
  ],
  [
    '"Thank you for coming," the host said to the guests.',
    "thank",
    "thanked",
    "The host",
    "the guests",
    "for coming",
    "prep-ing",
    ["to come", "for come"],
    ["apologized", "suggested"],
    "",
    "",
  ],
  [
    '"I didn\'t send the email," said the manager.',
    "deny",
    "denied",
    "The manager",
    "",
    "sending",
    "ing",
    ["to send", "send"],
    ["offered", "agreed"],
    "the email",
    "having sent",
  ],
  [
    '"Give me the money or I\'ll call the police!" the shopkeeper shouted.',
    "threaten",
    "threatened",
    "The shopkeeper",
    "",
    "to call",
    "to",
    ["calling", "call"],
    ["denied", "suggested"],
    "the police",
    "",
  ],
  [
    '"Don\'t forget to lock the door, Ali," said Mum.',
    "remind",
    "reminded",
    "Mum",
    "Ali",
    "to lock",
    "object-to",
    ["locking", "lock"],
    ["said", "explained"],
    "the door",
    "",
  ],
  [
    '"You lost us the match!" the fans told the coach.',
    "blame",
    "blamed",
    "The fans",
    "the coach",
    "for losing",
    "prep-ing",
    ["of losing", "to lose"],
    ["accused", "told"],
    "the match",
    "",
  ],
  [
    '"I copied the answers," Sam said.',
    "admit",
    "admitted",
    "Sam",
    "",
    "copying",
    "ing",
    ["to copy", "copy"],
    ["promised", "offered"],
    "the answers",
    "having copied",
  ],
  [
    '"I\'m a doctor," the man said.',
    "claim",
    "claimed",
    "The man",
    "",
    "to be",
    "to",
    ["being", "be"],
    ["suggested", "denied"],
    "a doctor",
    "",
  ],
  [
    '"Please, please stay!" the children said to their grandfather.',
    "beg",
    "begged",
    "The children",
    "their grandfather",
    "to stay",
    "object-to",
    ["staying", "stay"],
    ["explained", "suggested"],
    "",
    "",
  ],
  [
    '"Well done on passing your exams, Emma!" said Dad.',
    "congratulate",
    "congratulated",
    "Dad",
    "Emma",
    "on passing",
    "prep-ing",
    ["to pass", "on pass"],
    ["thanked", "praised"],
    "her exams",
    "",
  ],
  [
    '"Why don\'t we meet at noon?" said Ben.',
    "suggest",
    "suggested",
    "Ben",
    "",
    "meeting",
    "ing",
    ["to meet", "us to meet"],
    ["agreed", "told"],
    "at noon",
    "",
  ],
  [
    '"I won\'t answer that question," said the actor.',
    "refuse",
    "refused",
    "The actor",
    "",
    "to answer",
    "to",
    ["answering", "answer"],
    ["denied", "suggested"],
    "the question",
    "",
  ],
  [
    '"Would you like to come to dinner?" the Lees said to us.',
    "invite",
    "invited",
    "The Lees",
    "us",
    "to come",
    "object-to",
    ["coming", "come"],
    ["suggested", "said"],
    "to dinner",
    "",
  ],
  [
    '"I\'m sorry I forgot the meeting," said Kim.',
    "apologize",
    "apologized",
    "Kim",
    "",
    "for forgetting",
    "prep-ing",
    ["to forget", "for forget"],
    ["regretted", "explained"],
    "the meeting",
    "for having forgotten",
  ],
  [
    '"Try the fish soup," the waiter said.',
    "recommend",
    "recommended",
    "The waiter",
    "",
    "trying",
    "ing",
    ["to try", "try"],
    ["told", "promised"],
    "the fish soup",
    "",
  ],
  [
    '"Sure, I\'ll help you move house, Kate," said Omar.',
    "agree",
    "agreed",
    "Omar",
    "",
    "to help",
    "to",
    ["helping", "help"],
    ["suggested", "denied"],
    "Kate move house",
    "",
  ],
  [
    '"Leave the building now!" the officer told the crowd.',
    "order",
    "ordered",
    "The officer",
    "the crowd",
    "to leave",
    "object-to",
    ["leaving", "leave"],
    ["said", "explained"],
    "the building",
    "",
  ],
  [
    '"You cheated in the exam!" the teacher said to Oliver.',
    "accuse",
    "accused",
    "The teacher",
    "Oliver",
    "of cheating",
    "prep-ing",
    ["for cheating", "to cheat"],
    ["blamed", "criticized"],
    "in the exam",
    "of having cheated",
  ],
  [
    '"I was wrong," the minister said.',
    "admit",
    "admitted",
    "The minister",
    "",
    "being",
    "ing",
    ["to be", "be"],
    ["agreed", "promised"],
    "wrong",
    "having been",
  ],
  [
    '"I\'ll pay you back next week," said my cousin.',
    "promise",
    "promised",
    "My cousin",
    "",
    "to pay",
    "to",
    ["paying", "pay"],
    ["suggested", "admitted"],
    "me back next week",
    "",
  ],
  [
    '"Don\'t touch the wires," the electrician told us.',
    "warn",
    "warned",
    "The electrician",
    "us",
    "not to touch",
    "object-to",
    ["don't touch", "not touching"],
    ["suggested", "said"],
    "the wires",
    "",
  ],
  [
    '"I\'ll do the washing-up. I insist!" said Tom.',
    "insist",
    "insisted",
    "Tom",
    "",
    "on doing",
    "prep-ing",
    ["to do", "on do"],
    ["demanded", "suggested"],
    "the washing-up",
    "",
  ],
  [
    '"I didn\'t eat the cake!" said my brother.',
    "deny",
    "denied",
    "My brother",
    "",
    "eating",
    "ing",
    ["to eat", "eat"],
    ["promised", "agreed"],
    "the cake",
    "having eaten",
  ],
  [
    '"I\'ll carry your bags, Mrs. Lee," said the boy.',
    "offer",
    "offered",
    "The boy",
    "",
    "to carry",
    "to",
    ["carrying", "carry"],
    ["suggested", "admitted"],
    "Mrs. Lee's bags",
    "",
  ],
  [
    '"Please think again," Lisa said to her boss.',
    "urge",
    "urged",
    "Lisa",
    "her boss",
    "to think",
    "object-to",
    ["thinking", "think"],
    ["explained", "suggested"],
    "again",
    "",
  ],
  [
    '"Let\'s go to the beach," said Ella.',
    "suggest",
    "suggested",
    "Ella",
    "",
    "going",
    "ing",
    ["to go", "us to go"],
    ["told", "promised"],
    "to the beach",
    "",
  ],
];

/** speakerSexes are the speakers of the hand-written reports who can be swapped for another person, and whether they are men. */
const speakerSexes: Readonly<Record<string, boolean>> = {
  Tom: true,
  Leo: true,
  Jake: true,
  Sam: true,
  Ben: true,
  Omar: true,
  Ana: false,
  Anna: false,
  Lily: false,
  Mia: false,
  Nina: false,
  Kim: false,
  Ella: false,
  Lisa: false,
  Grandma: false,
};
const otherMen = ["Daniel", "Marco", "Hiro", "Kevin", "Ahmed"] as const;
const otherWomen = ["Sofia", "Priya", "Elena", "Rachel", "Yuki"] as const;

/** extraReports are the hand-written reports said again by other speakers of the same sex. */
const extraReports: typeof handReports = handReports.flatMap((report) => {
  const [quote, base, past, subject, ...more] = report;
  const man = speakerSexes[subject];
  if (man === undefined) return [];
  return (man ? otherMen : otherWomen).map(
    (name) => [quote.replace(new RegExp(`\\b${subject}\\b`, "u"), name), base, past, name, ...more] as const,
  );
});

/** reports are the hand-written reports and the same reports from other speakers. */
const reports: typeof handReports = [...handReports, ...extraReports];

const patternChoice: readonly ChoiceItem[] = reports.map(
  ([quote, , past, subject, object, right, , wrong, , rest]): ChoiceItem => [
    `${quote} → ${joinWords(subject, past, object, "___", rest)}.`,
    right,
    [...wrong],
  ],
);

const verbChoice: readonly ChoiceItem[] = interleave([handReports.slice(20), handReports.slice(0, 20), extraReports]).map(
  ([quote, , past, subject, object, form, , , wrongVerbs, rest]): ChoiceItem => [
    `${quote} → ${joinWords(subject, "___", object, form, rest)}.`,
    past,
    [...wrongVerbs],
  ],
);

const reportTyped: readonly TypedItem[] = reports.map(([quote, base, past, subject, object, form, , wrong, , rest, alt]): TypedItem => {
  const forms = alt === "" ? form : `[${form}|${alt}]`;
  return {
    shown: `${quote} (${base})`,
    accepted: [`${joinWords(subject, past, object, forms, rest)}.`],
    canonical: `${joinWords(subject, past, object, form, rest)}.`,
    wrong: wrong.map((w) => `${joinWords(subject, past, object, w, rest)}.`),
  };
});

/** reportOf finds the report whose quotation starts shown. */
const reportOf = (shown: string) => reports.find(([quote]) => shown.startsWith(quote));

/** patternText names a pattern in words, with the preposition of a pattern with one. */
function patternText(pattern: Pattern, form: string): Text {
  if (pattern === "ing") return t("the *-ing* form", "*-ing* 形式");
  if (pattern === "to") return t("*to* and the base form", "*to* 加动词原形");
  if (pattern === "object-to") return t("an object, then *to* and the base form", "宾语再加 *to* 和动词原形");
  const prep = form.split(" ")[0] ?? "";
  return t(`*${prep}* and the *-ing* form`, `*${prep}* 加 *-ing* 形式`);
}

/** reportRule names the pattern of the reporting verb of shown. */
function reportRule(shown: string): Text {
  const item = reportOf(shown);
  if (!item) return t("Each reporting verb takes its own pattern", "每个转述动词都有自己的句型");
  const [, base, , , , form, pattern] = item;
  const what = patternText(pattern, form);
  return t(`*${base}* takes ${what.en}`, `*${base}* 后面接${what["zh-CN"].startsWith("*") ? " " : ""}${what["zh-CN"]}`);
}

/** reportWhy puts the pattern of the reporting verb before a sentence. */
const reportWhy = (sentence: string, shown: string): Text => {
  const rule = reportRule(shown);
  return t(
    `${rule.en}: ${sentence}\n\n**Check.** Verify the reporting verb's fixed complement pattern (*-ing*, *prep + -ing*, *to + verb*, or *object + to + verb*) matches the sentence.`,
    `${rule["zh-CN"]}：${sentence}\n\n**检验。** 核对转述动词的固定搭配（*-ing*、*介词 + -ing*、*to + 动词原形* 或 *宾语 + to + 动词原形*）是否与句子一致。`,
  );
};

/** whyNotPattern explains a pattern that the reporting verb does not take. */
const whyNotPattern = (wrong: string, right: string, shown: string): Text => {
  const item = reportOf(shown);
  const base = item?.[1] ?? "";
  const pattern = item?.[6] ?? "ing";
  const [w0 = "", w1 = ""] = wrong.split(" ");
  if (w0 === "to") return t(`*${base}* does not take *to* and a base verb.`, `*${base}* 后面不接 *to* 加动词原形。`);
  if (w1 === "to") return t(`*${base}* never takes an object followed by *to*.`, `*${base}* 后面不能接宾语加 *to*。`);
  if (wrong.split(" ").length === 1 && wrong.endsWith("ing"))
    return t(`*${base}* does not take a bare *-ing* form.`, `*${base}* 后面不直接接 *-ing* 形式。`);
  if (wrong.split(" ").length === 1)
    return t(
      `*${wrong}* is a bare base verb, which reporting verbs do not take directly.`,
      `*${wrong}* 只是动词原形，转述动词后面不能直接接原形。`,
    );
  if (pattern === "prep-ing" && w1.endsWith("ing") && w0 !== right.split(" ")[0])
    return t(`*${w0}* is the wrong preposition for *${base}*.`, `*${w0}* 不是 *${base}* 搭配的介词。`);
  return t(
    `After the preposition *${w0}*, the verb must take *-ing*, not the base form.`,
    `介词 *${w0}* 后面的动词必须用 *-ing*，不能用原形。`,
  );
};

/** takes names what the wrong reporting verbs are followed by. */
const takes: Readonly<Record<string, Text>> = {
  suggested: t("the *-ing* form, never an object and *to*", "*-ing* 形式，不能接宾语加 *to*"),
  said: t("a *that*-clause or the words said, never an object and *to*", "*that* 从句或原话，不能接宾语加 *to*"),
  explained: t("a *that*-clause, never a person straight after it", "*that* 从句，后面不能直接接人"),
  told: t("an object and *to* with a verb", "宾语加 *to* 和动词"),
  promised: t("*to* and a verb", "*to* 加动词"),
  agreed: t("*to* and a verb", "*to* 加动词"),
  offered: t("*to* and a verb", "*to* 加动词"),
  demanded: t("*to* and a verb, with no object", "*to* 加动词，不接宾语"),
  denied: t("the *-ing* form", "*-ing* 形式"),
  admitted: t("the *-ing* form", "*-ing* 形式"),
  regretted: t("the *-ing* form", "*-ing* 形式"),
  apologized: t("*for* and the *-ing* form", "*for* 加 *-ing* 形式"),
  blamed: t("someone *for* and the *-ing* form", "某人加 *for* 和 *-ing* 形式"),
  criticized: t("someone *for* and the *-ing* form", "某人加 *for* 和 *-ing* 形式"),
  thanked: t("someone *for* and the *-ing* form", "某人加 *for* 和 *-ing* 形式"),
  praised: t("someone *for* and the *-ing* form", "某人加 *for* 和 *-ing* 形式"),
  accused: t("someone *of* and the *-ing* form", "某人加 *of* 和 *-ing* 形式"),
};

/** verbRule names why the right reporting verb fits what was said and the words after the gap. */
function verbRule(right: string, shown: string): Text {
  const item = reportOf(shown);
  if (!item) return reportRule(shown);
  const [, base, , subject, , form, pattern] = item;
  const what = patternText(pattern, form);
  return t(
    `*${right}* sums up what ${subject.replace(/^The /u, "the ")} said, and *${base}* takes ${what.en}, as after the gap`,
    `*${right}* 概括了说话人的话，而且 *${base}* 后面接${what["zh-CN"].startsWith("*") ? " " : ""}${what["zh-CN"]}，和空白后面一致`,
  );
}

/** whyNotVerb explains a reporting verb that cannot take the words after the gap. */
const whyNotVerb = (wrong: string): Text => {
  const what = takes[wrong];
  return what
    ? t(
        `*${wrong}* takes ${what.en}, which does not fit the words after the gap.`,
        `*${wrong}* 后面接${what["zh-CN"].startsWith("*") ? " " : ""}${what["zh-CN"]}，和空白后面的词不相配。`,
      )
    : t(`*${wrong}* cannot take the structure after the gap.`, `*${wrong}* 不能和空白后面的结构搭配。`);
};

const reportingVerbs: TopicDef = {
  id: "reporting-verbs",
  title: t("She Denied Taking It", "She denied taking it（转述动词）"),
  summary: t(
    "She denied taking it. He urged us to vote. They agreed to share the cost. Instead of said, a reporting verb tells what the speaker did, and each verb has its own pattern: -ing, a preposition and -ing, to, or an object and to.",
    "She denied taking it. He urged us to vote. They agreed to share the cost。转述动词代替 said，说明说话人做了什么；每个动词有自己的句型：接 -ing、接介词加 -ing、接 to，或者接宾语加 to。",
  ),
  intro: t(
    "Instead of repeating *said* in every line of a news story, English uses verbs that name the speaker's action—*She admitted making a mistake*, *He offered to help*, *They blamed us for the delay*—each locked to its own verb pattern.",
    "新闻报道里不会句句都写 *said*，英语会用直接点明说话人行为的转述动词——*She admitted making a mistake*、*He offered to help*、*They blamed us for the delay*——每个动词都有自己固定的后续句型。",
  ),
  prerequisites: ["reported-speech", "gerunds-and-infinitives"],
  encompasses: [
    { topic: "reported-speech", weight: 0.3 },
    { topic: "gerunds-and-infinitives", weight: 0.3 },
  ],
  xp: 30,
  strand: "grammar",
  knowledgePoints: [
    point(
      "pattern",
      t("What follows the verb", "动词后面接什么"),
      t(
        "A reporting verb sums up what someone said, and each one is followed by its own pattern:\n\n- **-ing**: *deny, admit, suggest, recommend*: *Tom **denied taking** the money. Mia **suggested taking** a taxi.*\n- **a preposition + -ing**: *apologize for, insist on, accuse someone of, blame someone for, thank someone for, congratulate someone on*: *Anna **apologized for being** late. Jake **accused** Leo **of stealing** his phone.*\n- **to + verb**: *refuse, agree, offer, promise, threaten, claim*: *Ana **refused to sign** the form.*\n- **an object + to + verb**: *urge, warn, advise, encourage, remind, beg, invite, order*: *The candidate **urged us to vote**.* A negative puts *not* before *to*: *warned the children **not to swim***.\n\n> **Watch out.** *Suggest* never takes an object + *to* (*Mia suggested us to take a taxi* is wrong)—use *suggested taking* or *suggested that we take*.",
        "转述动词概括别人说的话，每个动词后面有自己的句型：\n\n- 接 **-ing**：*deny, admit, suggest, recommend*：*Tom **denied taking** the money. Mia **suggested taking** a taxi.*\n- 接**介词加 -ing**：*apologize for, insist on, accuse someone of, blame someone for, thank someone for, congratulate someone on*：*Anna **apologized for being** late. Jake **accused** Leo **of stealing** his phone.*\n- 接 **to 加动词原形**：*refuse, agree, offer, promise, threaten, claim*：*Ana **refused to sign** the form.*\n- 接**宾语加 to 加动词原形**：*urge, warn, advise, encourage, remind, beg, invite, order*：*The candidate **urged us to vote**.* 否定时 *not* 放在 *to* 前面：*warned the children **not to swim***。\n\n“拒绝签字”是 *refused to sign*，“否认拿了钱”是 *denied taking*。\n\n> **注意。** 中文说“建议我们打车”，但英语的 *suggest* 绝不能接宾语加 *to*（*Mia suggested us to take a taxi* 是错的），应说 *suggested taking* 或 *suggested that we take*。",
      ),
      choiceGenerator(
        t("Report what was said. Choose the words for the gap.", "转述别人说的话。选出填入空白处的词。"),
        patternChoice,
        (right, shown) => reportWhy(fill(shown, right), shown),
        whyNotPattern,
      ),
    ),
    point(
      "verb",
      t("Choosing the reporting verb", "选择转述动词"),
      t(
        "Choose the verb that says what the speaker did and fits the words after the gap. A denial is *denied*, an apology is *apologized*, a strong request is *urged*, a warning is *warned*.\n\nThe pattern after the gap rules out the others: *suggest* and *say* cannot take an object and *to* (not *said us to vote*), *explain* cannot take a person straight after it, and *blame* takes *for*, while *accuse* takes *of*: *They **blamed** the coach **for** losing. Jake **accused** Leo **of** stealing.*\n\n> **Watch out.** Always check both meaning and grammar together: even if a verb fits the meaning, it is wrong if the preposition or structure after the gap does not match (such as *accuse* with *for* or *explain* + person).",
        "选出既能说明说话人做了什么、又和空白后面的词相配的动词。否认用 *denied*，道歉用 *apologized*，强烈请求用 *urged*，警告用 *warned*。\n\n空白后面的句型能排除其他动词：*suggest* 和 *say* 不能接宾语加 to（不能说 *said us to vote*），*explain* 后面不能直接接人，*blame* 搭配 *for*，*accuse* 搭配 *of*：*They **blamed** the coach **for** losing. Jake **accused** Leo **of** stealing.* 中文的“说”可以说成“说让我们去投票”，英语的 *say* 却不能这样用。\n\n> **注意。** 语义和句型必须同时对上：即使意思相近，如果空白后面的介词或结构不配（如 *accuse* 后面出现 *for*，或 *explain* 直接接人），也必须排除。",
      ),
      choiceGenerator(
        t("Report what was said. Choose the verb for the gap.", "转述别人说的话。选出填入空白处的动词。"),
        verbChoice,
        (right, shown) => {
          const rule = verbRule(right, shown);
          return t(
            `${rule.en}: ${fill(shown, right)}\n\n**Check.** Confirm *${right}* matches both the speaker's intent in the quote and the exact grammar pattern after the gap.`,
            `${rule["zh-CN"]}：${fill(shown, right)}\n\n**检验。** 确认 *${right}* 既准确概括了引语意图，又完全匹配空白后面的语法结构。`,
          );
        },
        whyNotVerb,
      ),
    ),
    point(
      "write",
      t("Reporting with the verb", "用转述动词改写"),
      t(
        'Report the quotation with the verb in brackets, in the past simple, and with the pattern that verb takes: *"I didn\'t take the money," said Tom. (deny)* becomes *Tom denied taking the money.* *"Please vote!" the candidate said to us. (urge)* becomes *The candidate urged us to vote.*\n\nUse the verb\'s own pattern, not a *that*-clause, and change *I*, *you* and *my* to fit the report, as in reported speech. After *deny*, *admit*, *apologize for* and *accuse of* you may also write *having* + past participle: *Tom denied having taken the money.*\n\n> **Watch out.** Put the reporting verb in the **past simple** and check pronouns (*I* → *he/she*, *my* → *his/her*) so the reported sentence matches the reporter\'s viewpoint.',
        '用括号里的动词转述引语，动词用一般过去时，后面接这个动词的句型：*"I didn\'t take the money," said Tom. (deny)* 写成 *Tom denied taking the money.* 不要用 *that* 从句，并像间接引语一样把 *I*、*you*、*my* 改成合适的词。*deny*、*admit*、*apologize for* 和 *accuse of* 后面也可以写 *having* 加过去分词：*Tom denied having taken the money.*\n\n> **注意。** 括号里的转述动词要改成**一般过去时**，并核对人称代词（*I* → *he/she*、*my* → *his/her*）是否已按转述视角调整。',
      ),
      typedGenerator(
        "sentence-pattern",
        t("Report the quotation with the verb in brackets.", "用括号里的动词转述引语。"),
        reportTyped,
        (right, shown) => reportWhy(right, shown),
      ),
    ),
  ],
};

/** topics are the topics of the unit Media and Persuasion. */
export const topics: readonly TopicDef[] = [
  journalism.topic,
  persuasion.topic,
  advertising.topic,
  information.topic,
  reportingWords.topic,
  online.topic,
  logic.topic,
  tone.topic,
  screen.topic,
  opinion.topic,
  connectives.topic,
  reportingVerbs,
];

/** vocabulary are the words the unit Media and Persuasion teaches. */
export const vocabulary: readonly WordBatch[] = [
  journalism.batch,
  persuasion.batch,
  advertising.batch,
  information.batch,
  reportingWords.batch,
  online.batch,
  logic.batch,
  tone.batch,
  screen.batch,
  opinion.batch,
  connectives.batch,
];
