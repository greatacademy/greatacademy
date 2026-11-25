// Grade 11: the batches of academic words for drafting, for gaining and giving, for meeting and talking, for inside and
// outside, for exactness and rank, for changing and handling, and for fitting and spreading.

import { t } from "@ga/content";
import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const drafting = batch(
  "words-for-drafting-and-editing",
  ["Words for Drafting and Editing", "起草与编辑的词"],
  ["academic words for writing a text and making it clear", "表示撰写文本并使之清楚的学术词"],
  `
  clarify|to make a statement or situation clearer|澄清，阐明|Could you ___ what you meant? Your last answer left us all a little confused.|The new guide will ___ the rules, explaining in plain words what was unclear before.|A simple diagram may help to ___ how the engine works.|obfuscate,edit|clarified,clarification
  specify|to state clearly and exactly|具体说明|The order form asks you to ___ the exact size, colour and number of shirts you want.|The contract must ___ the date when the work will be finished, down to the day.|Please ___ which day you would like to come: Monday or Tuesday.|edit,append|specified,specification
  quote|to repeat words from a text or speaker; a price offered|引用；报价|The reporter decided to ___ the mayor's exact words, putting them in inverted commas.|She loves to ___ Shakespeare, repeating famous lines from his plays at dinner.|Don't ___ me; I never said those words, so please don't repeat them as mine.|edit,clarify|quoted,quotation
  edit|to prepare a text by correcting and shortening it|编辑|Before printing, she will ___ the article, cutting it by half and correcting every mistake.|It took him a month to ___ the film, cutting six hours of footage down to ninety minutes.|Please ___ your report carefully, checking the spelling and removing any repeated points.|insert,append|edited
  draft|a first version of a piece of writing; to write one|草稿；起草|This is only a rough ___ of my essay, as long as the finished one but full of crossings-out.|She sent her publisher the first ___ of the novel, a messy early version that still needed a lot of work.|The lawyer prepared a ___ of the contract for both sides to read and change before it was signed.|summary,format|drafted,drafts
  format|the way something is arranged or set out|格式，版式|The quiz show has a simple ___: three rounds of questions and a final race against the clock.|Save the file in a ___ that any computer can open, such as PDF.|The new ___ of the newspaper, with bigger photos and shorter stories, is easier to read.|paragraph,summary|formatted,formatting
  paragraph|a section of a text that deals with one idea|段落|Start a new ___ each time you move on to a new idea in your essay.|The first ___ of the letter, just four lines long, says why she is writing.|Indent the first line of every ___ so the reader can see where it begins.|summary,format|paragraphs
  summary|a brief statement of the main points|摘要，总结|Write a short ___ of the story in no more than fifty words, giving only the main events.|At the end of the news, the presenter gave a brief ___ of the day's main stories.|The report opens with a one-page ___ for busy readers who will not read all two hundred pages.|draft,thesis|summaries,summarize
  append|to add something to the end of a text|附加|Please ___ a list of your sources to the end of your essay.|He decided to ___ a short note at the bottom of the letter, after his signature.|The museum will ___ a new chapter to the end of its guidebook.|edit,specify|appended,appendix
  insert|to put something into something else|插入|To pay, ___ your card into the slot and type in your number.|She had to ___ a new sentence in the middle of the paragraph.|The doctor will ___ a thin tube into the vein in your arm.|append,clarify|inserted,insertion
  `,
  "context-clues",
  {
    intro: t(
      "Write a first **draft**, then **edit** it, **clarify** any confusing **paragraph** and **append** a list of sources at the end. These ten words help you talk, in formal and academic English, about planning, writing, changing and laying out a text.",
      "先写初稿（**draft**），再修改（**edit**）它，把任何让人困惑的段落（**paragraph**）说清楚（**clarify**），最后在结尾附上（**append**）参考资料清单。这十个词帮你用正式的学术英语谈论文章的构思、写作、修改和排版。",
    ),
    watchOut: {
      meanings: t(
        "To **append** is to add something at the end, while to **insert** is to put it inside, between other parts; you append a list of sources but insert a sentence in the middle.",
        "**append** 是附加在末尾，**insert** 是插入中间；说 append a list of sources，但说 insert a sentence in the middle。",
      ),
      use: t(
        "**Quote** is the verb and *quotation* the noun in careful writing, so you quote a poet and use a quotation from him.",
        "在正式写作中，**quote** 是动词，*quotation* 是名词：quote a poet，use a quotation from him。",
      ),
      spelling: t(
        "**Paragraph** ends in -graph with ph, **summary** has a double m, and **append** has a double p.",
        "**paragraph** 以含 ph 的 -graph 结尾；**summary** 双写 m；**append** 双写 p。",
      ),
    },
    notes: `
      clarify|someone asked to explain an answer that confused everyone|a guide explaining in plain words what was unclear|a diagram helping to explain how an engine works|clarify means to make something clearer; obfuscate means to make it harder to understand|clarify 是使清楚；obfuscate 是使模糊|obfuscate means to make something harder to understand, the opposite of explaining it plainly|obfuscate 是使难以理解，和讲清楚正好相反|edit means to correct and shorten a text, not to explain what something means|edit 是修改删减文字，不是解释含义|clar · i · fy|the -ify ending|结尾是 -ify
      specify|an order form asking for exact size, colour and number|a contract stating the finishing date down to the day|choosing exactly which day to come|specify means to state something exactly; clarify means to make something clearer|specify 是明确说明；clarify 是澄清|edit means to correct and shorten a text, not to state an exact size or date|edit 是修改删减文字，不是写明具体尺寸或日期|append means to add something at the end of a text, not to state exact details|append 是附在末尾，不是写明具体细节|spec · i · fy|the c that sounds like s and the -ify ending|c 读作 s，结尾是 -ify
      quote|a reporter printing a mayor's exact words in inverted commas|a woman repeating famous lines from Shakespeare|a man denying that he ever said certain words|quote means to repeat someone's exact words; edit means to correct and shorten a text|quote 是引用原话；edit 是修改删减|edit means to correct and shorten a text, not to repeat someone's exact words|edit 是修改删减文字，不是重复别人的原话|clarify means to make something clearer, not to repeat the exact words of a speaker|clarify 是使清楚，不是引用原话|quote|the qu and the silent e|qu 组合，结尾 e 不发音
      edit|an article cut by half with every mistake corrected|six hours of film cut to ninety minutes|a report checked for spelling and repeated points|edit means to correct and shorten a text or film; insert means to put something in|edit 是修改删减；insert 是插入|insert means to put something into a text, not to cut and correct the whole of it|insert 是往文中插入，不是删改全文|append means to add something at the end, not to cut a text down and correct it|append 是附在末尾，不是删减修改|ed · it|one d and one t|只有一个 d 和一个 t
      draft|a rough essay as long as the finished one but full of crossings-out|a messy early version of a novel|a contract for both sides to change before signing|a draft is an early version still to be changed; a summary is a short account of the main points|draft 是待修改的草稿；summary 是要点概括|a summary is a short account of the main points, not a full early version still full of changes|summary 是简短的要点概括，不是满是改动的完整初稿|a format is the way something is laid out, not an early version of a text|format 是版式，不是文稿的早期版本|draft|the -aft ending, as in *craft*|结尾 -aft，同 *craft*
      format|a quiz show with three rounds and a final race|a file saved so that any computer can open it|a newspaper with bigger photos and shorter stories|a format is the way something is arranged or set out; a paragraph is a section of a text|format 是格式、版式；paragraph 是段落|a paragraph is one section of a text about one idea, not the way a show or a file is arranged|paragraph 是讲一个意思的一段文字，不是节目或文件的编排方式|a summary is a short account of main points, not the way something is laid out|summary 是要点概括，不是编排方式|for · mat|one t at the end, doubled in *formatted*|结尾一个 t，*formatted* 时双写
      paragraph|starting a new section for each new idea|four lines at the start of a letter saying why she writes|the first line of each section indented|a paragraph is a section of a text about one idea; a summary is a short account of the whole|paragraph 是段落；summary 是全文概括|a summary is a short account of the main points of a whole text, not one section of it|summary 是全文要点概括，不是其中一段|a format is the way a text is laid out, not one section of it|format 是版式，不是其中的一段|par · a · graph|the -graph ending with ph|结尾是含 ph 的 -graph
      summary|a story told in fifty words with only the main events|a brief account of the day's main news|a one-page account of a long report for busy readers|a summary is a short account of the main points; a draft is an early version|summary 是要点概括；draft 是草稿|a draft is an early, full version still to be changed, not a short account of the main points|draft 是待修改的完整初稿，不是简短的要点概括|a thesis is an argument put forward or a long essay, not a brief account of the main events|thesis 是论点或论文，不是要点概括|sum · ma · ry|the double m|双写 m
      append|a list of sources added at the end of an essay|a note added at the bottom of a letter after the signature|a new chapter added at the end of a guidebook|append means to add at the end; insert means to put inside, between other parts|append 是附在末尾；insert 是插入中间|edit means to correct and shorten a text, not to add something at the end|edit 是修改删减，不是附在末尾|specify means to state exactly, not to add a list or a note at the end|specify 是明确说明，不是在末尾附上清单或附言|ap · pend|the double p|双写 p
      insert|a card put into a slot to pay|a new sentence put in the middle of a paragraph|a thin tube put into a vein|insert means to put something into something else; append means to add at the end|insert 是插入；append 是附在末尾|append means to add something at the end, not to put it into a slot, a vein or the middle of a text|append 是附在末尾，不是插进卡槽、血管或段落中间|clarify means to make something clearer, not to put one thing inside another|clarify 是使清楚，不是把东西插进去|in · sert|the -ert ending|结尾是 -ert
    `,
  },
);

const gaining = batch(
  "words-for-gaining-and-giving",
  ["Words for Gaining and Giving", "获得与给予的词"],
  ["academic words for getting, chasing and handing out", "表示获取、追求和授予的学术词"],
  `
  acquisition|an asset or object bought or obtained; the learning of a skill|获得物；习得|The museum's latest ___, a painting it bought for ten million pounds, now hangs in the main hall.|Language ___ is fastest in young children, who pick up new words every day.|The firm's ___ of a rival company, which it bought last year, made it the biggest in Europe.|largesse,insight|acquisitions,acquire
  attain|to succeed in achieving|达到，获得|After years of training, she managed to ___ her goal of running a marathon in under three hours.|Few climbers ___ the summit of Everest without extra oxygen.|The country hopes to ___ full independence within five years.|devote,confer|attained,attainment
  confer|to grant a title or right; to discuss together|授予；商议|The university will ___ an honorary degree on the famous writer at a ceremony in June.|The judges needed to ___ for an hour, talking the case over before giving their verdict.|The two leaders met in private to ___ about the crisis.|grant,devote|conferred
  grant|a sum of money given for a purpose; to agree to give or allow|拨款；准予|They agreed to ___ her request for more time to finish the project.|The court may ___ him permission to stay in the country.|In the story, the genie will ___ the boy three wishes.|confer,invest|granted
  devote|to give all or most of one's time or effort to|致力于，献身|She chose to ___ her whole life to caring for sick animals.|The newspaper will ___ a full page to the story of the rescue.|He decided to ___ every spare hour to learning the violin.|invest,pursue|
  invest|to put money into something to make a profit; to spend time on|投资|She decided to ___ her savings in a small bakery, hoping to make a profit.|Large companies ___ millions in new technology each year, expecting it to pay off.|If you ___ time in your friendships, they will last.|devote,purchase|invested,investor
  purchase|to buy; something bought|购买；购买的东西|You can ___ tickets at the box office, paying by cash or card.|The family saved for years to ___ their first home, finally paying the full price in May.|The museum used a large gift to ___ the painting at auction for two million pounds.|invest,seek|purchased,purchaser
  pursue|to follow in order to catch; to continue with a course of action|追赶；从事|The police car turned on its siren to ___ the stolen van through the streets.|After school she plans to ___ her studies in medicine for another six years.|The dog would ___ any cat that came into the garden, chasing it over the fence.|seek,attain|pursued,pursuit
  seek|to try to find or get|寻求|The lost hikers had to ___ shelter from the storm, looking for a cave or a hut.|If you feel ill, you should ___ a doctor's advice at once.|Many people come to the city to ___ work, hoping to find a job in a factory.|pursue,attain|sought
  secure|fixed or fastened so as not to give way; to succeed in getting|牢固的，安全的；获得|After months of talks, the club managed to ___ a deal to sign the star player.|She worked hard to ___ a place at the top university, and the letter of offer came in March.|The union fought for months to ___ a pay rise for the nurses, and in the end it won.|attain,seek|secured,securely
  `,
  "context-clues",
  {
    intro: t(
      "To **attain** her dream, she chose to **devote** ten years to study, **seek** advice from experts and **invest** her savings in a small lab. These ten words help you talk, in formal and academic English, about trying for things, getting them and giving them.",
      "为了实现（**attain**）梦想，她决定投入（**devote**）十年时间学习，向专家寻求（**seek**）建议，并把积蓄投资（**invest**）在一个小实验室上。这十个词帮你用正式的学术英语谈论争取、获得和给予。",
    ),
    watchOut: {
      meanings: t(
        "To **seek** something is to look for it, while to **pursue** it is to chase it or keep going after it over time; you seek shelter but pursue a thief.",
        "**seek** 是寻找，**pursue** 是追赶或长期追求；说 seek shelter，但说 pursue a thief。",
      ),
      use: t(
        "You **devote** time to something but **invest** time in it, and a university **confers** a degree on someone.",
        "说 **devote** time to something，但说 **invest** time in it；大学 **confer** a degree on 某人。",
      ),
      spelling: t(
        "**Seek** becomes *sought* in the past, **confer** doubles its r in *conferred*, and **acquisition** has cq and -sition.",
        "**seek** 的过去式是 *sought*；**confer** 变成 *conferred* 时双写 r；**acquisition** 中有 cq，结尾是 -sition。",
      ),
    },
    notes: `
      acquisition|a painting a museum bought for ten million pounds|young children picking up new words every day|a firm buying a rival company|an acquisition is something bought or gained, or the learning of a skill; largesse is generous giving|acquisition 是购得之物或习得；largesse 是慷慨赠予|largesse is generosity in giving money or gifts, not something a museum or firm has bought or a skill learned|largesse 是慷慨赠予，不是博物馆或公司买下的东西，也不是习得的技能|an insight is a deep understanding, not something bought or a skill picked up|insight 是深刻的理解，不是购得之物或习得的技能|ac · qui · si · tion|the cq and the -sition ending|cq 组合，结尾是 -sition
      attain|running a marathon in under three hours after years of training|reaching the top of Everest without extra oxygen|a country hoping to achieve independence|attain means to succeed in reaching a goal; devote means to give time or effort to something|attain 是达到、实现；devote 是投入|devote means to give time or effort to something, and it needs to after it, not a goal reached|devote 是投入时间精力，后接 to，不是达到目标|confer means to give a title or to talk together, not to reach a goal oneself|confer 是授予或商议，不是自己达到目标|at · tain|the double t and the -ain ending|双写 t，结尾是 -ain
      confer|a university giving an honorary degree to a writer|judges talking a case over before a verdict|two leaders talking about a crisis in private|confer means to give an honour or title, or to talk together; grant means to agree to give or allow|confer 是授予或商议；grant 是准予|grant means to agree to give or allow something, and it is not used with on for an honour or for talking together|grant 是准予，不用 on 表示授予荣誉，也不表示商议|devote means to give time or effort to something, not to give a title or talk things over|devote 是投入时间精力，不是授予头衔或商议|con · fer|the r is doubled in *conferred*|变成 *conferred* 时双写 r
      grant|agreeing to give someone more time|a court allowing a man to stay in a country|a genie giving a boy three wishes|grant means to agree to give or allow; confer means to give an honour or talk together|grant 是准予；confer 是授予荣誉或商议|confer means to give an honour on someone or to talk together, not to allow a request or give wishes|confer 是授予荣誉或商议，不是批准请求或实现愿望|invest means to put money or time into something for a return, not to allow a request|invest 是投入资金或时间以求回报，不是批准请求|grant|the -ant ending|结尾是 -ant
      devote|a woman giving her whole life to caring for animals|a newspaper giving a full page to a rescue|a man giving every spare hour to the violin|devote means to give all of one's time or effort to something; invest means to put money or time in for a return|devote 是全身心投入；invest 是投入以求回报|invest means to put money or time into something, and it takes in, not to|invest 是投资，后接 in 而不是 to|pursue means to chase or keep going after something, and it is not followed by to|pursue 是追赶或追求，后面不接 to|de · vote|the long o and the silent e|长音 o，结尾 e 不发音
      invest|savings put into a small bakery to make a profit|companies putting millions into new technology|time put into friendships so they last|invest means to put money or time into something for a return; devote means to give all one's time to something|invest 是投资；devote 是全身心投入|devote means to give time or effort to something, and it takes to, not in|devote 是投入时间精力，后接 to 而不是 in|purchase means to buy something, not to put money in for a future profit|purchase 是购买，不是为日后获利而投资|in · vest|the -est ending|结尾是 -est
      purchase|buying tickets at a box office with cash or card|a family paying the full price for its first home|a museum buying a painting at auction|purchase means to buy; invest means to put money in for a profit|purchase 是购买；invest 是投资|invest means to put money in for a profit later, not to pay the price of a ticket or a house|invest 是投资获利，不是支付门票或房子的价钱|seek means to look for something, not to pay for it|seek 是寻找，不是付钱买下|pur · chase|the -chase ending, as in *chase*|结尾 -chase，同 *chase*
      pursue|a police car chasing a stolen van|a student carrying on with medical studies for six years|a dog chasing cats over a fence|pursue means to chase or to keep going with something; seek means to look for something|pursue 是追赶或继续从事；seek 是寻找|seek means to look for something, not to chase it through the streets or carry on with studies|seek 是寻找，不是穿街追赶或继续学业|attain means to reach a goal, not to chase after something or keep at it|attain 是达到目标，不是追赶或坚持从事|pur · sue|the -sue ending|结尾是 -sue
      seek|lost hikers looking for a cave or hut in a storm|an ill person asking a doctor for advice|people coming to a city to look for work|seek means to try to find or get; pursue means to chase or carry on with|seek 是寻找；pursue 是追赶或继续|pursue means to chase something or keep at it, not to look for shelter, advice or work|pursue 是追赶或坚持，不是寻找住处、建议或工作|attain means to succeed in reaching a goal, not to be still looking for something|attain 是成功达到，不是还在寻找|seek|the double e; its past is *sought*|双写 e，过去式是 *sought*
      secure|a club getting a deal to sign a star player|a student winning a place at a top university|a union winning a pay rise for nurses|secure means to succeed in getting something after effort; seek means only to try to find or get it|secure 是成功争取到；seek 只是寻求|attain means to reach a goal or level, and it is not used for getting a deal, a place or a pay rise|attain 是达到目标或水平，不用于争取到协议、名额或加薪|seek means to try to find or get something, not to succeed in getting it|seek 是设法寻求，不是成功得到|se · cure|the -cure ending, as in *cure*|结尾 -cure，同 *cure*
    `,
  },
);

const meeting = batch(
  "words-for-meeting-and-talking",
  ["Words for Meeting and Talking", "会面与交流的词"],
  ["academic words for coming together, joining in and disagreeing", "表示聚集、参与和争议的学术词"],
  `
  convene|to come or bring together for a meeting|召集，开会|The chairman will ___ a meeting of the board for Friday morning, calling all twelve members together.|World leaders will ___ in Geneva next week, gathering in one hall for a summit on the climate.|The committee will ___ again in the spring to hear the results of the study.|intervene,acknowledge|convened
  converse|to talk with someone; the opposite of a statement|交谈；相反的事物|The two old friends sat by the fire to ___ quietly about their school days.|It is hard to ___ face to face with someone who keeps looking at his phone.|Visitors could ___ with the robot in English, asking it questions and hearing its spoken replies.|correspond,convene|conversed
  correspond|to match closely; to write letters to someone|相符；通信|The two pen friends ___ by letter, writing to each other every month.|His story does not ___ with the facts: the shop was closed at the time he says he was there.|The red dots on the map ___ to the towns that have a railway station.|converse,convene|corresponded,corresponding
  coordinate|to bring the parts of an activity together; one of a pair of numbers marking a position|协调；坐标|Her job is to ___ the work of the three teams, making sure they all fit together smoothly.|The relief effort was hard to ___ because so many charities were working in different places.|Dancers must ___ their movements so that they all move as one.|participate,convene|coordinated,coordinator
  participate|to take part|参加|All pupils are expected to ___ in sports day, running in at least one race.|Over a thousand runners will ___ in the marathon this year.|Shy at first, she began to ___ in the class discussion, sharing her own ideas with the group.|coordinate,intervene|participated,participant,participation
  intervene|to come between so as to prevent or alter a result|干预|A teacher had to ___ when the two boys started fighting, pulling them apart.|The government may ___ to stop the price of bread rising any further.|If the talks fail, the United Nations will ___ to prevent a war.|participate,acknowledge|intervened,intervention
  acknowledge|to accept or admit the truth of; to show one has noticed|承认；致意|He finally had to ___ that he had made a mistake.|She waved to ___ me across the room, showing she had seen me come in.|Please ___ receipt of this letter by sending us a short reply.|intervene,encounter|acknowledged,acknowledgment
  controversy|prolonged public disagreement|争议|The new law caused great ___, with angry public arguments lasting for months.|There is ___ over the plan to build a road through the forest; people are deeply divided.|The referee's decision is still the subject of fierce ___ among fans.|encounter,link|controversies,controversial
  encounter|an unexpected meeting; to meet unexpectedly|偶遇；遇到|Our chance ___ with a bear on the mountain path was terrifying.|She described her first ___ with the famous writer, whom she met by surprise on a train.|In a brief ___ at the airport, the two old enemies came face to face without warning.|controversy,link|encountered
  link|a connection between two things; to connect|联系；连接|Scientists have found a clear ___ between smoking and heart disease.|The new bridge is a vital ___ between the island and the mainland.|Click the ___ in the email to open the web page.|encounter,controversy|linked,linkage
  `,
  "context-clues",
  {
    intro: t(
      "When the two clubs **convene** to settle the **controversy**, a judge will **intervene** only if they cannot agree, and both sides must **acknowledge** the result. These ten words help you talk, in formal and academic English, about meetings, talks, taking part, disagreements and connections.",
      "两家俱乐部召开会议（**convene**）解决这场争议（**controversy**）时，只有在双方无法达成一致的情况下法官才会介入（**intervene**），而双方都必须承认（**acknowledge**）最终结果。这十个词帮你用正式的学术英语谈论会议、交谈、参与、分歧和联系。",
    ),
    watchOut: {
      meanings: t(
        "To **converse** is to talk face to face, while to **correspond** is to write letters, or for two things to match each other.",
        "**converse** 是当面交谈；**correspond** 是通信，或两样东西相符。",
      ),
      use: t(
        "You **participate in** something, as in participate in the race, but you **intervene** to stop something or **intervene in** a quarrel to change it.",
        "说 **participate in** something，如 participate in the race；**intervene** 是出面阻止，或 **intervene in** 一场争执以改变结果。",
      ),
      spelling: t(
        "**Acknowledge** has a silent k and a c before it, **controversy** has -versy, and **correspond** has a double r.",
        "**acknowledge** 中的 k 不发音，前面还有一个 c；**controversy** 结尾是 -versy；**correspond** 双写 r。",
      ),
    },
    notes: `
      convene|a chairman calling twelve board members together for Friday|world leaders gathering in one hall in Geneva for a summit|a committee meeting again to hear the results of a study|convene means to call or come together for a meeting; intervene means to step in to change what happens|convene 是召集或聚集开会；intervene 是出面干预|intervene means to step in to stop or change what is happening, not to call people together for a meeting|intervene 是出面阻止或改变事态，不是召集开会|acknowledge means to admit something or show one has noticed it, not to bring people together to meet|acknowledge 是承认或示意，不是召集人们开会|con · vene|the long e and the silent e at the end|长音 e，结尾 e 不发音
      converse|two old friends talking quietly by a fire|trying to talk face to face with someone looking at a phone|visitors asking a robot questions and hearing spoken replies|converse means to talk with someone; correspond means to write letters or to match|converse 是交谈；correspond 是通信或相符|correspond means to write letters or to match, not to talk face to face by a fire|correspond 是通信或相符，不是在火炉边当面交谈|convene means to come together for a formal meeting, not to chat with a friend|convene 是聚集开正式会议，不是和朋友聊天|con · verse|the -verse ending, as in *verse*|结尾 -verse，同 *verse*
      correspond|pen friends writing to each other every month|a story that does not match the facts|red dots on a map that match towns with stations|correspond means to write letters or to match closely; converse means to talk face to face|correspond 是通信或相符；converse 是当面交谈|converse means to talk face to face, not to write letters or match the facts|converse 是当面交谈，不是写信或与事实相符|convene means to come together for a meeting, not to write letters or match something|convene 是聚集开会，不是通信或相符|cor · re · spond|the double r|双写 r
      coordinate|making three teams' work fit together smoothly|organizing many charities working in different places|dancers making their movements match|coordinate means to make the parts of an activity work together; participate means to take part|coordinate 是协调；participate 是参与|participate means to take part in something, and it needs in, not the work of teams or dancers' movements|participate 是参加，需接 in，不能直接接团队工作或舞蹈动作|convene means to call people to a meeting, not to make different parts work together|convene 是召集开会，不是使各部分协同|co · or · di · nate|the double o, split as *co-or*|双写 o，拆成 *co-or*
      participate|pupils running in races on sports day|a thousand runners in a marathon|a shy pupil sharing ideas in a class discussion|participate means to take part; intervene means to step in to stop or change something|participate 是参与；intervene 是介入干预|coordinate means to organize the parts of an activity, not to take part in a race or discussion|coordinate 是协调安排，不是参加比赛或讨论|intervene means to step in to stop or change something, not simply to join in and share ideas|intervene 是出面阻止或改变，不是一般地参与、分享想法|par · tic · i · pate|the c that sounds like s and the -ate ending|c 读作 s，结尾是 -ate
      intervene|a teacher pulling apart two fighting boys|a government stepping in to stop bread prices rising|the United Nations stepping in to prevent a war|intervene means to step in to stop or change what is happening; participate means to take part|intervene 是介入干预；participate 是参与|participate means to take part in an activity, not to step in to stop a fight or a war|participate 是参加活动，不是出面制止打架或战争|acknowledge means to admit or show one has noticed something, not to step in to change it|acknowledge 是承认或示意，不是出面改变事态|in · ter · vene|the -vene ending with a silent e|结尾 -vene，e 不发音
      acknowledge|a man admitting he made a mistake|a woman waving to show she has seen someone|a short reply saying a letter has arrived|acknowledge means to admit something or show one has noticed it; intervene means to step in|acknowledge 是承认或示意收到；intervene 是介入|intervene means to step in to change what happens, not to admit a mistake or show one has seen someone|intervene 是介入干预，不是承认错误或示意看见了某人|encounter means to meet someone by chance, not to admit something or confirm a letter has arrived|encounter 是偶遇，不是承认或确认收到信件|ac · knowl · edge|the c before a silent k|c 后接不发音的 k
      controversy|a new law causing angry public arguments for months|a road plan that divides people deeply|fans still arguing fiercely about a referee's decision|a controversy is a long public disagreement; an encounter is a meeting|controversy 是持久的公开争议；encounter 是相遇|an encounter is an unexpected meeting, not a long public argument|encounter 是不期而遇，不是持久的公开争论|a link is a connection between two things, not an angry public disagreement|link 是两者之间的联系，不是激烈的公开争议|con · tro · ver · sy|the -versy ending|结尾是 -versy
      encounter|meeting a bear by chance on a mountain path|meeting a famous writer by surprise on a train|two old enemies coming face to face at an airport|an encounter is an unexpected meeting; a controversy is a long public disagreement|encounter 是不期而遇；controversy 是公开争议|a controversy is a long public disagreement, not a sudden meeting with a bear or a person|controversy 是持久的公开争议，不是与熊或某人的突然相遇|a link is a connection between things, not a face-to-face meeting|link 是事物间的联系，不是面对面的相遇|en · coun · ter|the ou, as in *count*|ou 读音同 *count*
      link|a connection between smoking and heart disease|a bridge joining an island to the mainland|something to click in an email to open a web page|a link is a connection between two things; an encounter is a meeting|link 是联系、链接；encounter 是相遇|an encounter is an unexpected meeting between people, not a connection between two things|encounter 是人与人的偶遇，不是两样事物的联系|a controversy is a long public disagreement, not a connection or something to click|controversy 是公开争议，不是联系或可点击的链接|link|the nk at the end|结尾是 nk
    `,
  },
);

const structure = batch(
  "words-for-inside-and-outside",
  ["Words for Inside and Outside", "内部与外部的词"],
  ["academic words for parts, areas and how things are arranged", "表示部分、领域和排列方式的学术词"],
  `
  internal|of or on the inside|内部的|The doctor checked for ___ bleeding, which happens inside the body and cannot be seen.|The company held an ___ inquiry, run by its own staff rather than by outsiders.|The house's ___ walls, the ones between the rooms, are thinner than the outside walls.|external,intermediate|internally
  external|belonging to or forming the outer surface|外部的|This cream is for ___ use only: rub it on the skin, but never swallow it.|The school brought in ___ examiners from another city, so that its own teachers would not mark the tests.|The ___ surface of the egg is hard, but inside it is soft.|internal,adjacent|externally
  intermediate|coming between two things in time, place or order|中级的，中间的|The ___ class is for students who are past the basics but not yet advanced.|On the way from London to Sydney, the plane lands at one ___ stop in Dubai, about halfway.|In the ___ stage between caterpillar and butterfly, the insect rests inside a case.|preliminary,adjacent|
  adjacent|next to or adjoining something else|邻近的|We stayed in ___ rooms, so we could knock on the wall between us to say goodnight.|The car park is ___ to the station, right next door.|The fire spread quickly to the ___ houses on either side.|external,intermediate|
  configuration|an arrangement of parts|配置，布局|The ___ of the seats in the hall, arranged in a circle, lets everyone see the stage.|To fit more people in, the airline changed the ___ of the cabin, arranging nine seats in each row instead of eight.|The ___ of the stars in this group looks like a hunter with a bow.|infrastructure,entity|configurations
  infrastructure|the basic systems and structures a society needs|基础设施|The country needs better ___: new roads, railways, power lines and water pipes.|After the earthquake, the city's ___ was in ruins, with bridges down and no electricity.|Money from the fund will repair the ___ of rural areas, such as roads and phone lines.|configuration,sphere|
  domain|an area of activity or knowledge; an area owned by someone|领域；领地|The forest was once the king's private ___, land where only he was allowed to hunt.|The old farmer ruled his ___, a hundred acres of fields and woods, like a little king.|The castle and all its lands formed the lord's ___, and the villagers paid him rent.|sphere,entity|domains
  sphere|a round solid figure; an area of activity|球体；领域|The Earth is not a perfect ___; it bulges slightly at the equator.|Shaped like a ball, the glass ___ is perfectly round in every direction.|In the ___ of sport, she is one of the most famous names in the country.|section,entity|spheres,spherical
  entity|a thing with distinct and independent existence|实体|After the merger, the two banks became a single ___, with one name and one board.|The law treats a company as a separate ___, distinct from the people who own it.|Each of the two Koreas is a distinct political ___ with its own government.|domain,configuration|entities
  section|any of the parts into which something is divided|部分，章节|Turn to the sports ___ at the back of the newspaper.|The tail ___ of the plane broke off in the crash.|This ___ of the road is closed for repairs until Friday.|sphere,domain|sections
  `,
  "context-clues",
  {
    intro: t(
      "The **external** walls of the old station stayed standing, but its **internal** layout, its **infrastructure** and every **section** of track had to be rebuilt. These ten words help you talk, in formal and academic English, about insides and outsides, parts and wholes, and areas of land or life.",
      "老车站的外墙（**external**）还立着，但它的内部（**internal**）布局、基础设施（**infrastructure**）和每一段（**section**）轨道都得重建。这十个词帮你用正式的学术英语谈论内外、部分与整体，以及土地或生活中的各个领域。",
    ),
    watchOut: {
      meanings: t(
        "**Adjacent** means right next to something, while **intermediate** means in the middle between two things; adjacent rooms share a wall, and an intermediate stop is halfway.",
        "**adjacent** 是紧挨着的，**intermediate** 是处于两者中间的；adjacent rooms 共用一堵墙，intermediate stop 是中途停靠站。",
      ),
      use: t(
        "**Adjacent** takes to, as in adjacent to the station, and a **sphere** of activity is usually followed by of, as in the sphere of sport.",
        "**adjacent** 后接 to，如 adjacent to the station；表示领域的 **sphere** 通常后接 of，如 the sphere of sport。",
      ),
      spelling: t(
        "**Sphere** begins with sph, **adjacent** has a silent d before the j, and **infrastructure** joins *infra* and *structure*.",
        "**sphere** 以 sph 开头；**adjacent** 中 j 前的 d 不发音；**infrastructure** 由 *infra* 和 *structure* 组成。",
      ),
    },
    notes: `
      internal|bleeding inside the body that cannot be seen|an inquiry run by a company's own staff|walls between the rooms of a house|internal means on or from the inside; external means on or from the outside|internal 是内部的；external 是外部的|external means on or from the outside, the opposite of inside the body or run by one's own staff|external 是外部的，和体内或由自己人主持正好相反|intermediate means in the middle between two things, not inside something|intermediate 是处于中间的，不是内部的|in · ter · nal|the -al ending|结尾是 -al
      external|a cream for the skin that must not be swallowed|examiners brought in from another city|the hard shell outside a soft egg|external means on or from the outside; internal means inside|external 是外部的；internal 是内部的|internal means inside, the opposite of on the skin, from another city or on the outer shell|internal 是内部的，和涂在皮肤上、来自外地或外壳正好相反|adjacent means right next to something, not on its outside|adjacent 是紧挨着的，不是外部的|ex · ter · nal|the -al ending|结尾是 -al
      intermediate|a class for students past the basics but not yet advanced|a stop in Dubai halfway between London and Sydney|the stage between caterpillar and butterfly|intermediate means in the middle between two things; preliminary means coming first|intermediate 是中间的；preliminary 是初步的|preliminary means coming first, before the main part, not in the middle between two stages|preliminary 是最先的、初步的，不是两个阶段之间|adjacent means right next to something, not halfway between two things|adjacent 是紧挨着的，不是处于两者中间|in · ter · me · di · ate|the -iate ending|结尾是 -iate
      adjacent|rooms sharing a wall so guests can knock goodnight|a car park right next door to a station|houses on either side catching fire|adjacent means right next to; intermediate means in the middle between two things|adjacent 是紧挨着的；intermediate 是中间的|external means on the outside, not next door to something|external 是外部的，不是隔壁的|intermediate means halfway between two things, not sharing a wall or right next door|intermediate 是处于两者中间，不是共用一堵墙或就在隔壁|ad · ja · cent|the silent d before j and the soft c|j 前的 d 不发音，c 读作 s
      configuration|seats arranged in a circle in a hall|nine seats in each row of a plane cabin instead of eight|stars arranged like a hunter with a bow|a configuration is the way parts are arranged; infrastructure is the basic systems a society needs|configuration 是排列组合；infrastructure 是基础设施|infrastructure is roads, power and pipes, not the way seats or stars are arranged|infrastructure 是道路、电力、管道等，不是座位或星星的排列方式|an entity is a thing that exists on its own, not the way parts are arranged|entity 是独立存在的事物，不是排列方式|con · fig · u · ra · tion|the -ation ending|结尾是 -ation
      infrastructure|roads, railways, power lines and water pipes a country needs|bridges and electricity lost in an earthquake|roads and phone lines in the countryside|infrastructure is the basic systems a society needs; a configuration is how parts are arranged|infrastructure 是基础设施；configuration 是排列方式|a configuration is the way parts are arranged, not the roads and power lines a country needs|configuration 是排列方式，不是国家需要的道路和电线|a sphere is a round shape or an area of activity, not roads, bridges and pipes|sphere 是球体或领域，不是道路、桥梁和管道|in · fra · struc · ture|*infra* joined to *structure*|*infra* 加 *structure*
      domain|a forest where only the king may hunt|a farmer's hundred acres of fields and woods|a lord's castle and lands where villagers pay rent|a domain is land owned or ruled by someone, or an area of knowledge; a sphere is a ball or an area of activity|domain 是领地或领域；sphere 是球体或活动范围|a sphere is a ball or an area of activity, not land owned and ruled by a king or lord|sphere 是球体或活动范围，不是国王或领主拥有的土地|an entity is a thing that exists on its own, not land owned by someone|entity 是独立存在的事物，不是某人拥有的土地|do · main|the -ain ending, as in *rain*|结尾 -ain，同 *rain*
      sphere|the Earth bulging slightly at the equator|a glass ball perfectly round in every direction|the world of sport where she is famous|a sphere is a perfectly round solid or an area of life; a section is one part of something|sphere 是球体或领域；section 是一部分|a section is one part of something divided up, not a round solid or a whole area of activity|section 是被分开的一部分，不是球体或一整个领域|an entity is a thing that exists on its own, not a round shape or an area of life|entity 是独立存在的事物，不是球形或生活领域|sphere|the sph at the start|开头是 sph
      entity|two banks becoming one with one name and one board|a company treated as separate from its owners|a country with its own government|an entity is a thing that exists on its own; a domain is land owned by someone or an area of knowledge|entity 是实体；domain 是领地或领域|a domain is land owned by someone or an area of knowledge, not a separate body such as a bank or a country|domain 是领地或知识领域，不是银行或国家这样的独立实体|a configuration is the way parts are arranged, not a body that exists on its own|configuration 是排列方式，不是独立存在的实体|en · ti · ty|the -ity ending|结尾是 -ity
      section|the sports pages at the back of a newspaper|the tail of a plane breaking off|a stretch of road closed for repairs|a section is one part of something divided up; a sphere is a round solid or an area of activity|section 是一部分；sphere 是球体或领域|a sphere is a round solid or an area of activity, not one part of a newspaper, plane or road|sphere 是球体或领域，不是报纸、飞机或道路的一部分|a domain is land owned by someone, not one part of a newspaper or road|domain 是某人的领地，不是报纸或道路的一部分|sec · tion|the -tion ending|结尾是 -tion
    `,
  },
);

const exactness = batch(
  "words-for-exactness-and-rank",
  ["Words for Exactness and Rank", "精确与主次的词"],
  ["academic words for what is exact, first, main and only", "表示确切、最初、主要和唯一的学术词"],
  `
  definite|clearly stated or decided|明确的，确定的|By Friday we need your ___ answer, a clear yes or no, not a maybe.|The date of the wedding is now ___: it will be on 12 June, and the hall is booked.|Nothing is ___ yet; the team might still change the whole plan.|overall,potential|definitely
  specific|clearly defined or identified; particular|具体的，特定的|Can you give me a ___ example, such as one particular day when this happened?|The cream is made for a ___ skin problem: dry patches on the elbows.|The doctor asked ___ questions, such as exactly when the pain started and where it hurt.|definite,sole|specifically
  initial|existing or occurring at the beginning; the first letter of a name|最初的；首字母|My ___ reaction was shock, but after a while I began to laugh.|The ___ cost of the car is high, but it is cheap to run afterwards.|In the ___ stages of the illness there are few signs, so it is often missed.|prior,prime|initially,initials
  prior|existing or coming before in time or importance|先前的|No ___ experience is needed for the job; we will train you from the start.|She could not come because her ___ engagement, made weeks before, came first.|Visitors must book at least a week ___ to their arrival.|initial,predominant|
  overall|taking everything into account|全面的，总的|The ___ cost of the trip, including flights, hotels and food, was two thousand pounds.|The ___ winner is the team with the most points after all six races.|My ___ impression of the city, taking everything together, was very good.|definite,principal|
  predominant|present as the strongest or main element|主要的，占优势的|Blue is the ___ colour in the painting, covering most of the canvas.|Fear was the ___ feeling in the town, stronger than any other.|English is the ___ language of the internet, used on most websites.|initial,sole|predominantly
  fundamental|forming a necessary base or core|基本的，根本的|Clean water and food are ___ human needs, as basic as shelter.|The house's problems were ___: the foundations were cracked, so everything above was unsafe.|Reading is ___ to all other learning; without it, pupils cannot study any subject.|specific,overall|fundamentally,fundamentals
  principal|first in order of importance; the head of a school|主要的；校长|The ___ reason for the delay was the snow, though a broken train didn't help.|Rice is the ___ food of half the world's people.|She plays the ___ role in the play, appearing in almost every scene.|specific,initial|principally
  prime|of first importance; the best part of something|首要的；全盛时期|The police say he is the ___ suspect, the one they most want to question.|The flat's ___ location, right in the centre near the park and the station, makes it very expensive.|Her ___ concern is the safety of the children; everything else comes second.|initial,fundamental|
  sole|one and only; the underside of a foot or shoe|唯一的；脚底|He was the ___ survivor of the crash; everyone else on board died.|Her ___ aim was to win; she cared about nothing else.|This shop is the ___ seller of the cheese outside France; nobody else has it.|specific,overall|solely
  `,
  "context-clues",
  {
    intro: t(
      "The **initial** results were mixed, but the **overall** picture is clear: the **principal** cause of the floods is a **fundamental** fault in the old dam. These ten words help you talk, in formal and academic English, about being exact and about what comes first, matters most or stands alone.",
      "初步的（**initial**）结果好坏参半，但总体的（**overall**）情况很清楚：洪水的主要（**principal**）原因是旧水坝存在一个根本的（**fundamental**）缺陷。这十个词帮你用正式的学术英语谈论精确，以及最先、最重要或唯一的事物。",
    ),
    watchOut: {
      meanings: t(
        "**Predominant** means the strongest or most common of several, while **sole** means the only one; blue can be the predominant colour of a painting that also has red in it.",
        "**predominant** 是几者中最强或最常见的，**sole** 是唯一的；一幅画即使也有红色，蓝色仍可以是 predominant colour。",
      ),
      use: t(
        "**Prior** is often followed by to, as in prior to arrival, meaning before, while **initial** goes straight before a noun, as in initial reaction.",
        "**prior** 常接 to，如 prior to arrival，意为“在……之前”；**initial** 直接放在名词前，如 initial reaction。",
      ),
      spelling: t(
        "**Principal** ends in -pal, unlike *principle*, **definite** ends in -ite, not -ate, and **predominant** ends in -ant.",
        "**principal** 结尾是 -pal，和 *principle* 不同；**definite** 结尾是 -ite 而不是 -ate；**predominant** 结尾是 -ant。",
      ),
    },
    notes: `
      definite|a clear yes or no instead of a maybe|a wedding date that is fixed with the hall booked|a plan that is not yet settled and might still change|definite means clearly fixed or decided; potential means possible but not yet real|definite 是明确的、已确定的；potential 是潜在的|overall means taking everything together, not clearly fixed or decided|overall 是总体的，不是明确确定的|potential means possible but not yet real, the opposite of fixed and settled|potential 是可能的、尚未成真的，和已确定正好相反|def · i · nite|the -ite ending, not -ate|结尾是 -ite 而不是 -ate
      specific|one particular day given as an example|a cream for dry patches on the elbows|a doctor asking exactly when and where the pain started|specific means particular and clearly named; definite means clearly fixed or decided|specific 是特定的、具体的；definite 是确定的|definite means fixed and decided, not one particular example or problem picked out|definite 是确定的，不是挑出的某个具体例子或问题|sole means the only one, not one particular example picked out of many|sole 是唯一的，不是从许多中挑出的某一个具体例子|spe · cif · ic|the c that sounds like s and the -ic ending|第一个 c 读作 s，结尾是 -ic
      initial|shock that turns to laughter after a while|a high first cost for a car that is cheap to run later|the early stages of an illness with few signs|initial means at the beginning; prior means existing before something else|initial 是起初的；prior 是先前的|prior means existing before something else, often with to, not the first part of a reaction or an illness|prior 是先前的，常接 to，不是反应或病程的最初阶段|prime means of first importance, not at the very beginning in time|prime 是最重要的，不是时间上最初的|in · i · tial|the t that sounds like *sh*|t 读作 *sh*
      prior|no experience needed before the job starts|an engagement made weeks before|booking a week before arrival|prior means existing or coming before; initial means at the start of something|prior 是先前的；initial 是起初的|initial means at the start of something, and it is not used with to for coming before|initial 是起初的，不接 to 表示“在……之前”|predominant means the strongest or most common, not coming before in time|predominant 是占主导的，不是时间上在前|pri · or|the -or ending|结尾是 -or
      overall|the total cost of a trip including flights, hotels and food|the team with the most points after all six races|an impression of a city taking everything together|overall means taking everything into account; principal means first in importance|overall 是总体的；principal 是主要的|definite means clearly fixed or decided, not taking everything together|definite 是确定的，不是综合一切的|principal means the main or most important, not the total of everything together|principal 是主要的，不是一切加在一起的总体|o · ver · all|one word made of *over* and *all*|由 *over* 和 *all* 合成一个词
      predominant|blue covering most of a painting|fear stronger than any other feeling in a town|English used on most websites|predominant means the strongest or most common of several; sole means the only one|predominant 是占主导的；sole 是唯一的|initial means at the beginning, not the strongest or most common|initial 是起初的，不是最强或最常见的|sole means the only one, but there are other colours, feelings and languages here|sole 是唯一的，而这里还有别的颜色、情感和语言|pre · dom · i · nant|the -ant ending|结尾是 -ant
      fundamental|clean water and food as basic human needs|cracked foundations making a whole house unsafe|reading as the base for all other learning|fundamental means forming the basic core of something; specific means particular|fundamental 是根本的、基础的；specific 是具体的|specific means particular and clearly named, not basic to everything else|specific 是具体特定的，不是一切的基础|overall means taking everything together, not forming the basic core|overall 是总体的，不是构成核心基础的|fun · da · men · tal|the -al ending|结尾是 -al
      principal|snow as the main cause of a delay|rice as the main food of half the world|the main role in a play, in almost every scene|principal means first in importance; specific means particular|principal 是主要的；specific 是具体的|specific means particular and clearly named, not the main or most important|specific 是具体特定的，不是最主要的|initial means at the beginning, not the most important|initial 是起初的，不是最重要的|prin · ci · pal|the -pal ending, unlike *principle*|结尾是 -pal，和 *principle* 不同
      prime|the suspect police most want to question|a flat in the best spot near the park and station|the safety of children above everything else|prime means of first importance or the best; initial means at the beginning|prime 是首要的或最好的；initial 是起初的|initial means at the beginning, not the most important or the best|initial 是起初的，不是最重要或最好的|fundamental means forming the basic core, not the best or first in importance|fundamental 是基础的，不是最好的或首要的|prime|the long i and the silent e|长音 i，结尾 e 不发音
      sole|the only survivor of a crash|an aim of winning with nothing else cared about|the only seller of a cheese outside France|sole means one and only; specific means particular|sole 是唯一的；specific 是具体的|specific means particular, not the only one when everyone else is gone|specific 是特定的，不是只剩下的唯一一个|overall means taking everything together, the opposite of one and only|overall 是总体的，和唯一的正好相反|sole|the long o and the silent e|长音 o，结尾 e 不发音
    `,
  },
);

const handling = batch(
  "words-for-changing-and-handling",
  ["Words for Changing and Handling", "改变与操控的词"],
  ["academic words for making, checking and controlling", "表示产生、检查和控制的学术词"],
  `
  alter|to change in character or composition|改变|The tailor will ___ the dress, taking it in at the waist so it fits better.|We had to ___ our plans when the rain came, moving the party indoors.|Nothing you say will ___ my decision; I have made up my mind.|conform,inspect|altered,alteration
  conform|to comply with rules or standards|遵守，顺从|All new buildings must ___ to the safety rules, or they cannot open.|Teenagers often feel they must ___, dressing and talking just like everyone else.|Her designs do not ___ to the usual style; they break every rule.|alter,undergo|conformed
  manipulate|to control or influence cleverly or unfairly; to handle skillfully|操纵；熟练操作|He tried to ___ his friends into lending him money, playing on their guilt with clever lies.|With nimble fingers, the puppeteer could ___ all twelve strings at once, making the puppet dance.|The dishonest manager would ___ the figures, changing numbers in secret to hide the losses.|monitor,induce|manipulated,manipulation,manipulative
  monitor|to observe and check over time; a screen|监测；显示器|Nurses ___ the patient's heart rate all night, checking the screen every hour.|Scientists ___ the volcano day and night, watching for any sign of an eruption.|Parents should ___ how long their children spend online each week.|manipulate,generate|monitored,monitoring
  inspect|to look at closely in order to assess|检查|A mechanic will ___ the car closely before you buy it, checking the engine and brakes.|Officials came to ___ the kitchen, looking closely at every shelf for dirt.|The guard will ___ your passport at the border before letting you through.|generate,alter|inspected,inspection,inspector
  generate|to produce or create|产生|Wind farms ___ electricity from the wind that blows across the hills.|The new factory will ___ two hundred jobs for the town.|The surprise result is likely to ___ a lot of excitement among the fans.|undergo,conform|generated
  induce|to succeed in persuading; to bring about|劝使；引起|Nothing could ___ her to leave her home, not even a large offer of money.|The doctor gave her a drug to ___ sleep after three restless nights.|They offered free meals to ___ more people to come to the meeting.|utilize,conform|induced,inducement
  trigger|to cause an event to happen; the part of a gun one pulls|引发；扳机|Burnt toast can ___ the smoke alarm, setting it off with a loud beep.|A single careless remark may ___ a fight between the two brothers.|Pollen can ___ an asthma attack in some children.|undergo,inspect|triggered
  undergo|to experience something unpleasant or demanding|经历，经受|She will ___ an operation on her knee next week.|The city is set to ___ huge changes as the new railway is built.|All new pilots must ___ two years of hard training.|utilize,conform|underwent,undergone
  utilize|to make practical and effective use of|利用|The school will ___ the empty room as a library, putting it to good use.|Farmers ___ every part of the plant, using the leaves for food and the stems for building.|A good cook will ___ leftover rice to make fried rice the next day.|undergo,alter|utilized,utilization
  `,
  "context-clues",
  {
    intro: t(
      "Engineers **monitor** the bridge every day and **inspect** it closely each year, and if a crack appears, they **alter** the traffic so the bridge can **undergo** repairs. These ten words help you talk, in formal and academic English, about changing, checking, controlling, causing and using things.",
      "工程师每天监测（**monitor**）这座桥，每年仔细检查（**inspect**）一次；一旦出现裂缝，他们就会改变（**alter**）交通安排，让桥接受（**undergo**）维修。这十个词帮你用正式的学术英语谈论改变、检查、操控、引发和利用。",
    ),
    watchOut: {
      meanings: t(
        "To **monitor** is to watch something over a long time, while to **inspect** is to look at it closely once to judge it; nurses monitor a heartbeat, but a guard inspects a passport.",
        "**monitor** 是长时间持续观察，**inspect** 是仔细检查一次以作判断；护士 monitor 心跳，边检 inspect 护照。",
      ),
      use: t(
        "**Conform to** a rule takes to, and **induce** someone to do something takes to and a verb, as in induce more people to come.",
        "**conform to** a rule 要用 to；**induce** someone to do something 也用 to 加动词，如 induce more people to come。",
      ),
      spelling: t(
        "**Utilize** ends in -ize, **undergo** becomes *underwent* and *undergone*, and **trigger** has a double g.",
        "**utilize** 结尾是 -ize；**undergo** 的过去式和过去分词是 *underwent*、*undergone*；**trigger** 双写 g。",
      ),
    },
    notes: `
      alter|a tailor taking a dress in at the waist|plans changed to move a party indoors|a decision that nothing will change|alter means to change something; inspect means to look at it closely|alter 是改变；inspect 是检查|conform means to follow a rule or fit in, and it takes to, not a dress or a plan after it|conform 是遵守或随大流，后接 to，不能直接接衣服或计划|inspect means to look closely at something, not to change it|inspect 是仔细查看，不是改变|al · ter|the -er ending, as in *after*|结尾 -er，同 *after*
      conform|new buildings following safety rules|teenagers dressing and talking like everyone else|designs that break every usual rule|conform means to follow rules or fit in with others; alter means to change something|conform 是遵守、随大流；alter 是改变|alter means to change something, and it is not followed by to and a rule|alter 是改变，后面不接 to 加规则|undergo means to go through something hard, not to follow rules or fit in|undergo 是经历，不是遵守规则或随大流|con · form|the -form ending, as in *form*|结尾 -form，同 *form*
      manipulate|a man using lies to get money from his friends|a puppeteer working twelve strings at once|a manager secretly changing figures to hide losses|manipulate means to control people or things cleverly, often unfairly, or to handle them with skill; monitor means to watch over time|manipulate 是操纵或熟练操作；monitor 是持续监测|monitor means to watch something over time, not to control people or work strings with the fingers|monitor 是持续观察，不是操纵人或用手操作|induce means to persuade someone to do something, and it takes to, not into, and it is not secret control|induce 是劝使，后接 to 而不是 into，也不是暗中操控|ma · nip · u · late|the single n and p|n 和 p 都只写一个
      monitor|nurses checking a heart rate every hour all night|scientists watching a volcano day and night|parents keeping track of time spent online|monitor means to watch and check something over time; inspect means to look closely once to judge it|monitor 是持续监测；inspect 是一次性仔细检查|manipulate means to control or handle something, not to watch and check it over time|manipulate 是操纵或操作，不是持续观察|generate means to produce something, not to keep watch|generate 是产生，不是监测|mon · i · tor|the -or ending|结尾是 -or
      inspect|a mechanic checking an engine and brakes before a sale|officials looking at every kitchen shelf for dirt|a guard checking a passport at a border|inspect means to look at something closely to judge it; monitor means to watch over a long time|inspect 是仔细检查；monitor 是长期监测|generate means to produce something, not to look at it closely|generate 是产生，不是仔细查看|alter means to change something, not to check it before deciding|alter 是改变，不是检查后再作决定|in · spect|the ct at the end|结尾是 ct
      generate|wind farms producing electricity|a factory creating two hundred jobs|a result causing excitement among fans|generate means to produce or create; undergo means to go through something|generate 是产生；undergo 是经历|undergo means to go through something hard, not to produce electricity or jobs|undergo 是经历，不是产生电力或工作岗位|conform means to follow rules or fit in, not to produce something new|conform 是遵守或随大流，不是产生新东西|gen · er · ate|the soft g and the -ate ending|g 发软音，结尾是 -ate
      induce|an offer of money that cannot persuade a woman to leave home|a drug given to bring on sleep|free meals offered to persuade people to come|induce means to persuade someone or to bring something about; trigger means to set something off suddenly|induce 是劝使或引起；trigger 是突然触发|utilize means to make use of something, not to persuade someone or bring on sleep|utilize 是利用，不是劝说或引起睡意|conform means to follow rules or fit in, not to persuade someone|conform 是遵守或随大流，不是劝说别人|in · duce|the -duce ending, as in *produce*|结尾 -duce，同 *produce*
      trigger|burnt toast setting off a smoke alarm|a careless remark starting a fight|pollen setting off an asthma attack|trigger means to set something off suddenly; induce means to persuade or bring about slowly|trigger 是触发；induce 是劝使或促成|undergo means to go through something hard, not to set off an alarm or a fight|undergo 是经历，不是触发警报或打斗|inspect means to look closely at something, not to set it off|inspect 是仔细查看，不是触发|trig · ger|the double g|双写 g
      undergo|a woman having a knee operation|a city going through huge changes|new pilots going through two years of training|undergo means to go through something hard or demanding; utilize means to make use of|undergo 是经历；utilize 是利用|utilize means to make use of something, not to go through an operation or training|utilize 是利用，不是接受手术或训练|conform means to follow rules, not to go through something hard|conform 是遵守规则，不是经历困难|un · der · go|*under* and *go*; its past forms are *underwent* and *undergone*|*under* 加 *go*，过去式和过去分词是 *underwent*、*undergone*
      utilize|an empty room put to use as a library|every part of a plant used for food or building|leftover rice used for fried rice|utilize means to make practical use of something; undergo means to go through something|utilize 是利用；undergo 是经历|undergo means to go through something hard, not to make use of a room or a plant|undergo 是经历，不是利用房间或植物|alter means to change something, not to put it to good use|alter 是改变，不是加以利用|u · ti · lize|the -ize ending|结尾是 -ize
    `,
  },
);

const fitting = batch(
  "words-for-fitting-and-spreading",
  ["Words for Fitting and Spreading", "相容与传播的词"],
  ["academic words for what is easy to reach, real, matching and widespread", "表示易得、真实、相容和普遍的学术词"],
  `
  accessible|able to be reached, entered or understood|可到达的；易懂的|The new library is fully ___ to wheelchair users, with ramps and a lift to every floor.|The village is only ___ by boat; there is no road over the mountains.|The files are ___ online, so anyone with a password can open them from home.|compatible,straightforward|accessibility
  authentic|genuine; of undisputed origin|真正的，正宗的|Experts say the painting is ___, a real work by Van Gogh and not a copy.|The restaurant serves ___ Thai food, cooked by chefs from Bangkok with real Thai recipes.|The museum checked that the letter was ___, written in the king's own hand.|counterfeit,potential|authenticity
  compatible|able to exist or work together without conflict|兼容的，合得来的|This charger is not ___ with my phone; the plug is the wrong shape.|The two flatmates are very ___: they like the same music and never argue.|Is the new software ___ with older computers, or will it only run on new ones?|accessible,mutual|compatibility
  passive|accepting what happens without active response|被动的，消极的|He was a ___ member of the club, going to meetings but never speaking or helping.|Don't just be ___; if you want change, you must stand up and act.|Watching TV is a ___ activity: you just sit back and let the pictures wash over you.|positive,voluntary|passively
  positive|showing confidence or hope; certain; above zero|积极的；确定的|She stayed ___ throughout the illness, sure that she would get better.|Are you ___ that you locked the door? Think carefully before we drive off.|The test result was ___: the sample did contain the virus.|passive,potential|positively
  potential|possible but not yet real; capacity to develop|潜在的；潜力|The company is looking for ___ customers, people who might buy its products in future.|Every ___ danger, from fire to flood, must be planned for before the festival.|With more training, this ___ champion could win the world title within two years.|positive,authentic|potentially
  straightforward|easy to do or understand; honest and frank|简单的；坦率的|The instructions are ___: just plug it in and press start.|Her ___ answer, honest and to the point, had no hidden meaning.|Fixing the leak was ___; it took five minutes and one spanner.|intricate,widespread|straightforwardly
  voluntary|done by choice; working without pay|自愿的|Attendance at the after-school club is ___; no one has to go.|She does ___ work at the hospital, helping out without pay.|The pupils gave up their sweets in a ___ act; no teacher made them do it.|passive,mutual|voluntarily
  widespread|found or spread over a large area|普遍的，广泛的|There was ___ damage after the storm, with fallen trees across the whole region.|The belief that carrots help you see in the dark is ___, held by people all over the world.|The flu is ___ this winter, with cases in every town in the country.|straightforward,mutual|
  mutual|experienced or done by each of two or more people|相互的；共同的|The two leaders have ___ respect for each other, and each praises the other's work.|They became friends through a ___ friend who knew them both and introduced them.|The feeling was ___: she disliked him, and he disliked her just as much.|compatible,voluntary|mutually
  `,
  "context-clues",
  {
    intro: t(
      "The museum's guide is **straightforward**, its galleries are **accessible** to everyone, and its **authentic** old maps draw **widespread** praise. These ten words help you talk, in formal and academic English, about being easy to reach or use, real, possible, freely chosen, shared and spread far and wide.",
      "博物馆的导览简单明了（**straightforward**），展厅人人都能进入（**accessible**），馆藏的真迹（**authentic**）古地图更是广受（**widespread**）赞誉。这十个词帮你用正式的学术英语谈论易于到达或使用、真实、潜在、自愿、共有以及广泛传播。",
    ),
    watchOut: {
      meanings: t(
        "**Mutual** means felt or done by each of two people toward the other, while **compatible** means able to work or live together without trouble.",
        "**mutual** 是双方彼此都有的感受或行为；**compatible** 是能和睦相处、配合使用的。",
      ),
      use: t(
        "**Compatible** takes with, as in compatible with older computers, and **accessible** takes to or by, as in accessible to wheelchair users or accessible by boat.",
        "**compatible** 后接 with，如 compatible with older computers；**accessible** 后接 to 或 by，如 accessible to wheelchair users、accessible by boat。",
      ),
      spelling: t(
        "**Accessible** has a double c, a double s and -ible, **compatible** also ends in -ible, and **voluntary** ends in -ary.",
        "**accessible** 双写 c 和 s，结尾 -ible；**compatible** 也以 -ible 结尾；**voluntary** 结尾是 -ary。",
      ),
    },
    notes: `
      accessible|a library with ramps and a lift for wheelchair users|a village reached only by boat|files anyone with a password can open from home|accessible means easy to reach, enter or use; compatible means able to work together|accessible 是可到达、可使用的；compatible 是兼容的|compatible means able to work together, and it takes with, not to or by|compatible 是兼容、合得来，后接 with，而不是 to 或 by|straightforward means easy to do or understand, not able to be reached by a ramp or a boat|straightforward 是简单明了的，不是可通过坡道或船只到达|ac · ces · si · ble|the double c, the double s and the -ible ending|双写 c、双写 s，结尾是 -ible
      authentic|a real Van Gogh and not a copy|Thai food cooked by Bangkok chefs from real recipes|a letter written in the king's own hand|authentic means real and genuine; counterfeit means a fake copy made to deceive|authentic 是真实的；counterfeit 是伪造的|counterfeit means a fake copy made to fool people, the opposite of real and genuine|counterfeit 是用来骗人的仿冒品，和真品正好相反|potential means possible but not yet real, not genuine and proved|potential 是潜在的，不是经证实的真品|au · then · tic|the au and the th|au 组合和 th 组合
      compatible|a charger whose plug fits a phone|flatmates who like the same music and never argue|software that runs on older computers|compatible means able to work or live together without problems; mutual means shared by both sides|compatible 是兼容的、合得来的；mutual 是双方共有的|accessible means easy to reach or use, and it is not used with with for a charger or software|accessible 是可到达或可使用的，不用 with 搭配充电器或软件|mutual means felt by each of two people toward the other, not able to work together|mutual 是彼此都有的，不是能配合使用的|com · pat · i · ble|the -ible ending|结尾是 -ible
      passive|a club member who never speaks or helps|someone told to stand up and act instead|sitting back while TV pictures wash over you|passive means accepting what happens without acting; positive means hopeful or certain|passive 是被动的；positive 是积极乐观或确定的|positive means hopeful, confident or certain, not doing nothing and just receiving|positive 是乐观、自信或确定的，不是无所作为、被动接受|voluntary means done by free choice, not doing nothing|voluntary 是自愿的，不是无所作为|pas · sive|the double s and the -ive ending|双写 s，结尾是 -ive
      positive|a woman sure she will get better|someone asked whether he is certain the door is locked|a test showing that a virus is present|positive means hopeful, certain or showing that something is present; passive means doing nothing|positive 是乐观、确定或呈阳性的；passive 是被动的|passive means accepting things without acting, not hopeful, certain or showing a virus|passive 是被动的，不是乐观、确定或呈阳性|potential means possible but not yet real, not certain or shown to be present|potential 是潜在的，不是确定或已证实存在的|pos · i · tive|the -ive ending|结尾是 -ive
      potential|people who might buy a company's products in future|dangers from fire to flood that might happen|a young athlete who could win a world title with training|potential means possible but not yet real; positive means certain or hopeful|potential 是潜在的；positive 是确定或乐观的|positive means certain or hopeful, not possible in the future but not yet real|positive 是确定或乐观的，不是将来可能但尚未成真的|authentic means real and genuine, not possible but not yet real|authentic 是真实的，不是尚未成真的|po · ten · tial|the -tial ending that sounds like *shul*|-tial 结尾读作 *shul*
      straightforward|instructions that say just plug in and press start|an honest answer with no hidden meaning|a leak fixed in five minutes with one spanner|straightforward means easy to do or understand, or honest; intricate means very complicated|straightforward 是简单明了或坦率的；intricate 是错综复杂的|intricate means very complicated and detailed, the opposite of plug in and press start|intricate 是错综复杂的，和插上电按开始就行正好相反|widespread means found over a large area, not easy to do or honest|widespread 是分布广泛的，不是简单或坦率的|straight · for · ward|*straight* and *forward* with the silent gh|*straight* 加 *forward*，gh 不发音
      voluntary|a club that no one has to go to|hospital work done without pay|giving up sweets without being made to|voluntary means done by free choice or without pay; passive means doing nothing|voluntary 是自愿的或义务的；passive 是被动的|passive means accepting things without acting, not choosing freely to help or give|passive 是被动的，不是主动选择帮忙或付出|mutual means felt or done by both sides toward each other, not chosen freely by one person|mutual 是双方彼此的，不是某人自己选择的|vol · un · tar · y|the -ary ending|结尾是 -ary
      widespread|storm damage across a whole region|a belief held by people all over the world|flu cases in every town|widespread means found over a large area or among many people; straightforward means easy|widespread 是分布广泛的；straightforward 是简单的|straightforward means easy to do or honest, not spread over a large area|straightforward 是简单或坦率的，不是分布广泛的|mutual means shared by two sides, not spread across a whole region or the world|mutual 是双方共有的，不是遍布全国或全世界的|wide · spread|one word made of *wide* and *spread*|由 *wide* 和 *spread* 合成一个词
      mutual|two leaders who each praise the other's work|a friend whom both people know|a dislike felt by each person for the other|mutual means felt or done by each of two people toward the other; compatible means able to get on together|mutual 是彼此的；compatible 是合得来的|compatible means able to work or get on together, not felt by each person toward the other|compatible 是合得来、兼容的，不是彼此都有的感受|voluntary means done by free choice, not felt by each side toward the other|voluntary 是自愿的，不是彼此都有的|mu · tu · al|the tu that sounds like *chew*|tu 读音同 *chew*
    `,
  },
);

/** batchesH are the academic words for drafting, gaining, meeting, inside and outside, exactness, handling and fitting. */
export const batchesH: readonly BatchSpec[] = [drafting, gaining, meeting, structure, exactness, handling, fitting];
