// Grade 9: the batches of words of the first four units, from the tone of a writer and the craft of a story to epics
// and quests, the loves and feuds of tragedy, and growing up.

import { t } from "@ga/content";
import type { BatchSpec } from "../batch.ts";
import { batch } from "../grade-5/batches.ts";

const tone = batch(
  "words-of-tone-and-attitude",
  ["Words of Tone and Attitude", "语气与态度的词"],
  ["a writer's tone and attitude", "作者的语气与态度"],
  `
  sardonic|grimly mocking, in a way that shows scorn|讥讽的，冷嘲的|He gave a grim, mocking ___ laugh when the boss called the failed plan a great success.|Her ___ remarks, full of bitter scorn, made it clear she thought the meeting was a joke.|The narrator's cold, scornful, ___ voice mocks the town's proud leaders.|wry,jaunty|sardonically
  wry|showing dry, quiet humor, often about something disappointing|揶揄的，带苦笑的|Missing the bus by a few seconds, she gave a small, ___ smile at her own bad luck.|The author's quiet, ___ humor about her own failures makes even the sad chapters gentle to read.|"Well, that went well," he said with a dry, ___ grin, sorry and amused at once, as he looked at the vase he had broken.|sardonic,flippant|wryly
  reverent|showing deep respect, often with a sense of awe|恭敬的，虔诚的|The visitors walked through the ancient cathedral in ___ silence, heads bowed in awe.|He always spoke of his old teacher in hushed, ___ tones, full of deep respect.|The essay's ___ tone toward the mountains treats them with awe, almost like a temple.|elegiac,didactic|reverently,reverence
  contemptuous|showing that you think someone or something is worthless|轻蔑的，鄙视的|She gave the bribe a ___ glance, as if it were worthless trash, and walked away.|The critic was openly ___ of the film, calling its ending worthless rubbish.|His ___ reply, which treated their offer as far beneath him, showed how little he thought of it.|sardonic,detached|contemptuously,contempt
  detached|not showing feeling or personal involvement; distant|超然的，冷漠的|The reporter described the battle in a cool, ___ voice, as if none of it touched her.|He stood strangely ___ from the chaos around him, feeling nothing at all.|The narrator's calm, ___ tone, which shows no feeling, makes the tragedy even more chilling.|laconic,contemptuous|detachment
  flippant|not showing the seriousness that a situation deserves|轻率的，不严肃的|His ___ answer to the judge's serious question, a silly joke, angered the court.|It is easy to be ___ about dangers you have never faced, joking as if they did not matter.|She regretted her ___ joke about the accident; people had been badly hurt.|wry,jaunty|flippantly
  elegiac|sad and full of sorrow for someone or something lost or past|哀伤的，挽歌式的|The poem's ___ tone mourns the village that was drowned under the new lake.|His ___ essay about his late father is full of sorrow and loss.|The film ends on a sad, ___ note, as the old ship sinks and the crew say goodbye to it forever.|reverent,laconic
  jaunty|lively, cheerful and confident|轻快的，得意洋洋的|He wore his hat tipped at a ___ angle, looking cheerful and sure of himself.|A lively, ___ tune played as the curtain rose.|Despite the bad news, she walked off with a cheerful, ___ step.|flippant,didactic|jauntily
  didactic|meant to teach, especially in a way that lectures the reader|说教的，教诲的|The story is too ___: every page stops to teach the reader a lesson.|Old children's books were often ___, written mainly to teach good manners.|Her ___ tone, lecturing the audience on what they must do, made them feel scolded.|reverent,jaunty
  laconic|using very few words|简洁的，言简意赅的|The ___ farmer answered every question with just "yep" or "nope."|His ___ letters, only two or three lines long, said only what was necessary.|The hero's ___ replies, never more than a few words, make him seem calm and strong.|detached,elegiac|laconically
  `,
  "context-clues",
  {
    intro: t(
      "The critic's review was **sardonic**, mocking the film with bitter scorn; the director answered with a **wry** smile and a **laconic** reply of two words. These ten words help you name a writer's tone, the attitude you hear behind the words.",
      "评论家的影评冷嘲热讽（**sardonic**），满是尖刻的不屑；导演只是苦笑（**wry**）一下，回了简短的两个词（**laconic**）。这十个词帮你说出作者的语气，也就是字里行间透出的态度。",
    ),
    watchOut: {
      meanings: t(
        "Tell three kinds of humor apart: **sardonic** mocks with bitter scorn, **wry** is dry and gentle about a disappointment, and **flippant** jokes when it should be serious.",
        "分清三种“幽默”：**sardonic** 带着尖刻的轻蔑去嘲讽，**wry** 对失望之事温和地自嘲，**flippant** 则是在该严肃时开玩笑。",
      ),
      use: t(
        "**Laconic** is about how *few words* someone uses, **detached** is about how *little feeling* they show; and **elegiac** mourns a loss while **reverent** bows in respect.",
        "**laconic** 说的是话很少，**detached** 说的是不流露感情；**elegiac** 是哀悼失去，**reverent** 是怀着敬意。",
      ),
      spelling: t(
        "Watch the silent *w* of **wry**, the double *p* of **flippant**, the *-uous* ending of **contemptuous** and the *-iac* ending of **elegiac**.",
        "注意 **wry** 开头不发音的 w、**flippant** 的双写 p、**contemptuous** 结尾的 -uous，以及 **elegiac** 结尾的 -iac。",
      ),
    },
    notes: `
      sardonic|a grim, mocking laugh at a failed plan called a success|remarks full of bitter scorn about a meeting|a narrator's cold, scornful voice mocking proud leaders|sardonic mocks with bitter scorn; wry humor is dry and gentle|sardonic 是带着尖刻轻蔑的嘲讽；wry 是温和的冷幽默|wry is dry, gentle humor about a disappointment, without the bitter scorn of a mocking voice|wry 是对失望之事温和的冷幽默，没有嘲讽中那种尖刻的轻蔑|jaunty means lively, cheerful and confident, not grim and mocking|jaunty 指轻快、开朗又自信，不是阴沉地嘲讽|sar · don · ic|the -don- in the middle and the -ic ending|中间是 -don-，结尾是 -ic
      wry|a small smile at her own bad luck after missing a bus|an author's quiet, gentle humor about her own failures|a dry grin, sorry and amused at once, at a broken vase|wry is gentle, dry humor; sardonic is bitter, scornful mockery|wry 是温和的冷幽默；sardonic 是尖刻轻蔑的嘲讽|sardonic is grimly mocking and full of scorn, not quiet, gentle humor|sardonic 是阴沉而充满轻蔑的嘲讽，不是安静温和的幽默|flippant means treating something serious too lightly, not seeing the dry humor in a disappointment|flippant 指把严肃的事看得太轻，不是对失望之事的自嘲|w · ry|the silent w before r, as in write|开头的 w 不发音，同 write
      reverent|visitors walking silently through a cathedral, heads bowed in awe|a man speaking of his old teacher with deep respect|an essay treating mountains with awe, almost like a temple|reverent shows deep respect and awe; elegiac mourns something lost|reverent 表达敬畏与尊重；elegiac 哀悼失去的东西|elegiac means full of sorrow for something lost, not full of respect and awe|elegiac 指为失去的东西而悲伤，不是充满敬畏|didactic means meant to teach a lesson, not showing deep respect|didactic 指意在说教，不是表达深深的敬意|rev · er · ent|the -ent ending, not -ant|结尾是 -ent，不是 -ant
      contemptuous|a glance at a bribe as if it were worthless trash|a critic calling a film's ending worthless rubbish|a reply treating an offer as far beneath him|contemptuous treats something as worthless; sardonic mocks with grim humor|contemptuous 视之如粪土；sardonic 用阴冷的幽默嘲弄|sardonic is grimly mocking with a bitter joke, not simply treating something as worthless|sardonic 是带苦涩玩笑的冷嘲，不只是把东西看得一文不值|detached means showing no feeling at all, while scorn for something worthless is a strong feeling|detached 指不流露任何感情，而轻视某物本身就是强烈的感情|con · temp · tu · ous|the p before t and the -uous ending|temp 中的 p 别漏，结尾是 -uous
      detached|a reporter describing a battle as if none of it touched her|a man feeling nothing in the chaos around him|a narrator's calm tone that shows no feeling about a tragedy|detached shows no feeling; laconic uses very few words|detached 不流露感情；laconic 用词极少|laconic means using very few words, which says nothing about whether feelings are shown|laconic 指话很少，和是否流露感情无关|contemptuous shows strong scorn, which is a feeling, not distance from all feeling|contemptuous 表现出强烈的轻蔑，那是一种感情，不是置身事外|de · tached|the t before ch|ch 前面有一个 t
      flippant|a silly joke in answer to a judge's serious question|joking about dangers as if they did not matter|a joke about an accident in which people were badly hurt|flippant fails to take a serious thing seriously; wry sees the humor in a disappointment|flippant 对严肃的事不够严肃；wry 是从失望中看出幽默|wry is dry humor that still feels what is sad, not treating a serious matter as if it did not matter|wry 是仍体会到悲伤的冷幽默，不是把严肃的事当作无关紧要|jaunty describes a lively, confident manner or step, not a remark that fails to take something seriously|jaunty 形容轻快自信的神态或步子，不是对严肃之事的轻率话语|flip · pant|the double p and the -ant ending|双写 p，结尾是 -ant
      elegiac|a poem mourning a village drowned under a new lake|an essay full of sorrow for a late father|a sad farewell to an old ship as it sinks|elegiac mourns what is lost; reverent bows in respect|elegiac 哀悼失去的东西；reverent 怀着敬意|reverent means showing deep respect and awe, not mourning something lost|reverent 指深怀敬畏，不是哀悼失去的东西|laconic means using very few words, not full of sorrow for something gone|laconic 指话很少，不是为逝去之物而哀伤|el · e · gi · ac|the g that sounds like j and the -iac ending|g 读作 j，结尾是 -iac
      jaunty|a hat tipped at a cheerful, confident angle|a lively tune playing as a curtain rose|a cheerful step after bad news|jaunty is lively and confident; flippant fails to take things seriously|jaunty 轻快而自信；flippant 对事情不够严肃|flippant describes a remark that treats something serious too lightly, not a lively, cheerful look or step|flippant 形容把严肃的事说得太轻的话，不是轻快开朗的神态或步子|didactic means meant to teach a lesson, not lively and cheerful|didactic 指意在说教，不是轻快开朗|jaun · ty|the au as in haunt and the -ty ending|au 同 haunt，结尾是 -ty
      didactic|a story that stops on every page to teach a lesson|old children's books written to teach good manners|a tone lecturing an audience until they felt scolded|didactic lectures in order to teach; reverent shows deep respect|didactic 是为了教育而说教；reverent 是怀着敬意|reverent means showing deep respect and awe, not lecturing in order to teach|reverent 指深怀敬畏，不是为了教育而说教|jaunty means lively and cheerful, not stopping to teach a lesson|jaunty 指轻快开朗，不是停下来讲道理|di · dac · tic|the -dac- in the middle and the -tic ending|中间是 -dac-，结尾是 -tic
      laconic|a farmer answering every question with yep or nope|letters only two or three lines long|a hero's replies of never more than a few words|laconic uses very few words; detached shows no feeling|laconic 用词极少；detached 不流露感情|detached means showing no feeling, not using very few words|detached 指不流露感情，不是话很少|elegiac means full of sorrow for something lost, not short and sparing with words|elegiac 指为失去的东西而哀伤，不是言简意赅|la · con · ic|one c in the middle and the -ic ending|中间只有一个 c，结尾是 -ic
    `,
  },
);

const craft = batch(
  "words-of-narrative-craft",
  ["Words of Narrative Craft", "叙事技艺的词"],
  ["how a story is told", "故事的讲述方式"],
  `
  narrator|the voice or character who tells a story|叙述者|Everything we learn in the novel comes through its ___, a ten-year-old girl who tells the whole story.|We cannot fully trust a ___ who admits, halfway through telling the story, that he lies.|In the first chapter, the ___ stops telling the story to speak directly to the reader.|persona,bard|narrators,narration
  omniscient|knowing everything, including what all the characters think and feel|全知的|The ___ narrator can tell us what every character is secretly thinking.|The story shifts from the ___ view, which sees into every mind, to a single character's eyes.|No one is truly ___; nobody can know everything that is happening everywhere.|retrospective,sapient
  verisimilitude|the quality of seeming true or real|逼真，真实感|Details of real streets and real prices give the novel ___: it feels true.|The dialogue lacks ___; no real person talks like that.|Historical novelists research for years so that their books seem true to life and achieve ___.|anachronism,subtext
  digression|a part of a speech or a piece of writing that moves away from the main subject|离题，题外话|After a long ___ about his childhood, the speaker finally returned to his main point.|In chapter four the novel wanders off into a ___ about cheese-making, then returns to the plot.|Forgive the ___; I wandered from the subject, so let me get back to the story.|subtext,chronology|digressions,digress
  chronology|the order in which events happened|年表，时间顺序|The story jumps around in time, so readers must piece together the ___ of events, from first to last.|Historians still argue about the ___ of the battle: which attack came first, and when?|Her ___ of her grandfather's life lists each event by year.|digression,anachronism|chronologies
  episodic|made of separate events or adventures loosely joined together|插曲式的，由片段组成的|The novel is ___: each chapter is a separate adventure, loosely joined to the next.|The plot is so ___, a string of separate events, that it can feel scattered.|The TV series is ___, with a separate adventure in each part, so you can watch any part first.|retrospective,coherent
  retrospective|looking back on past events|回顾的|The novel is an old man's ___ account, told as he looks back on his youth.|In her ___ essay, she looks back on her years at the school.|The museum's ___ show looks back over the painter's whole life's work.|episodic,omniscient|retrospectively,retrospect
  persona|the character or voice that a writer or speaker takes on, which may differ from the real person|人物角色，人格面具|The poet writes in the ___ of an old soldier, although she has never been to war.|On stage, the shy singer takes on a bold, loud ___ that is nothing like her real self.|Behind the comic ___ he shows the world, the writer is a sad man.|narrator,subtext|personas
  subtext|a meaning that is not stated directly but lies beneath the words|潜台词，言外之意|On the surface they talk politely about the weather, but the ___ of their talk is anger.|Read the ___: she says yes, but beneath her words she means no.|Good dialogue often has a rich ___, saying more beneath the words than on the surface.|persona,verisimilitude
  anachronism|something placed in a time where it does not belong, such as a clock in ancient Rome|时代错误|In a film about medieval knights, the wristwatch on the king's arm is a clear ___.|The novel's ___ of Romans using telephones was a deliberate joke.|Calling ancient Romans "teenagers" is a funny ___, since the word did not exist until the 1900s.|verisimilitude,chronology|anachronisms,anachronistic
  `,
  "context-clues",
  {
    intro: t(
      "The novel's **narrator** is an old man, and his **retrospective** story has rich **verisimilitude**—until a wristwatch appears on a Roman soldier, a plain **anachronism**. These ten words help you talk about how a story is told.",
      "这部小说的叙述者（**narrator**）是一位老人，他回顾往事（**retrospective**）的故事极具真实感（**verisimilitude**）——直到一名罗马士兵手上出现了手表，这显然是时代错误（**anachronism**）。这十个词帮你谈论故事是怎样讲述的。",
    ),
    watchOut: {
      meanings: t(
        "The **narrator** is whoever tells the story; a **persona** is a mask a writer puts on, which may be quite unlike the writer; **subtext** is what is meant beneath the words.",
        "**narrator** 是讲故事的人；**persona** 是作者戴上的面具，可能和作者本人很不一样；**subtext** 是字面之下的含意。",
      ),
      use: t(
        "Three words about time: **chronology** is the *order* of events, a **digression** *wanders* from the subject, and an **anachronism** sits in the *wrong* time.",
        "三个和时间有关的词：**chronology** 是事情的先后顺序，**digression** 是偏离主题，**anachronism** 是放错了时代。",
      ),
      spelling: t(
        "Watch the *-cient* (said *shent*) of **omniscient**, the double *s* of **digression**, the *ch* said as *k* in **anachronism** and **chronology**, and the five *i*'s of **verisimilitude**.",
        "注意 **omniscient** 的 -cient（读 shent）、**digression** 的双写 s、**anachronism** 和 **chronology** 中读作 k 的 ch，以及 **verisimilitude** 中的五个 i。",
      ),
    },
    notes: `
      narrator|a ten-year-old girl who tells a novel's whole story|a storyteller who admits halfway through that he lies|a storyteller who stops to speak directly to the reader|the narrator tells the story; a persona is a mask a writer puts on|narrator 是讲故事的人；persona 是作者戴上的面具|persona is a mask or character a writer puts on, not simply the voice that tells the story|persona 是作者戴上的面具或角色，不只是讲故事的声音|bard is a poet who sang long poems aloud in ancient times, not the voice that tells a novel's story|bard 是古代吟唱长诗的诗人，不是讲述小说故事的声音|nar · ra · tor|the double r and the -or ending|双写 r，结尾是 -or
      omniscient|a narrator who knows every character's secret thoughts|a view that sees into every mind|the fact that nobody can know everything happening everywhere|omniscient knows everything; retrospective only looks back|omniscient 无所不知；retrospective 只是回顾往事|retrospective means looking back on the past, not knowing everything, including every character's thoughts|retrospective 指回顾过去，不是无所不知、连每个人的想法都清楚|sapient means able to think and reason, which does not mean knowing every thought and fact|sapient 指能思考推理，并不等于知道每个想法和事实|om · nis · cient|the sc and the -cient ending, said shent|中间是 sc，结尾 -cient 读作 shent
      verisimilitude|real streets and real prices that make a novel feel true|dialogue that no real person would speak|years of research to make a historical novel feel true to life|verisimilitude is the feel of truth; an anachronism breaks it|verisimilitude 是真实感；anachronism 会破坏这种真实感|anachronism is something placed in the wrong time, which spoils the sense that a story is real|anachronism 是放错时代的东西，会破坏故事的真实感|subtext is a hidden meaning beneath the words, not the quality of seeming true|subtext 是字面之下的含意，不是看起来真实的特质|ver · i · sim · il · i · tude|the five i's and the -tude ending|五个 i，结尾是 -tude
      digression|a speaker's long story about his childhood before his main point|a novel's sudden chapter about cheese-making|a storyteller apologizing for wandering from the subject|a digression wanders from the subject; subtext lies beneath the words|digression 偏离主题；subtext 藏在字面之下|subtext is a hidden meaning beneath the words, not a part that wanders away from the main subject|subtext 是字面之下的含意，不是偏离主题的部分|chronology is the order in which events happened, not a stretch that leaves the main subject|chronology 是事情发生的先后顺序，不是离开主题的一段|di · gres · sion|the double s in -ssion|-ssion 中双写 s
      chronology|piecing together the order of events in a story that jumps around|which attack came first in a battle, and when|a list of each event of a grandfather's life by year|chronology is the order of events; an anachronism is something in the wrong time|chronology 是事件顺序；anachronism 是放错时代的东西|digression is a part that wanders from the main subject, not the order in which events happened|digression 是偏离主题的部分，不是事情发生的顺序|anachronism is something placed in a time where it does not belong, not the order of events|anachronism 是放到不属于它的时代的东西，不是事件的顺序|chro · nol · o · gy|the ch said as k and the -logy ending|ch 读作 k，结尾是 -logy
      episodic|chapters that are separate adventures loosely joined|a plot that is a string of separate events|a TV series with a separate adventure in each part|episodic is made of loosely joined parts; coherent has parts that fit tightly|episodic 由松散连接的片段组成；coherent 各部分紧密衔接|retrospective means looking back on past events, not made of separate, loosely joined adventures|retrospective 指回顾往事，不是由松散连接的片段组成|coherent means clear, with parts that fit tightly together, the opposite of loosely joined episodes|coherent 指条理清楚、各部分紧密衔接，正与松散的片段相反|ep · i · sod · ic|episode loses its e: -sod-ic|episode 去掉 e 再加 -ic
      retrospective|an old man looking back on his youth|an essay looking back on years at a school|a museum show looking back over a painter's life work|retrospective looks back; episodic is made of separate parts|retrospective 是回顾；episodic 由松散的片段组成|episodic means made of separate, loosely joined events, not looking back on the past|episodic 指由松散的片段组成，不是回顾过去|omniscient means knowing everything, not looking back on what has passed|omniscient 指无所不知，不是回顾已经过去的事|ret · ro · spec · tive|retro- and -spective, as in inspect|retro- 加 -spective（同 inspect）
      persona|a poet writing as an old soldier though she never went to war|a shy singer's bold stage self|a comic face hiding a sad man|a persona is a mask taken on; the narrator is whoever tells the story|persona 是戴上的面具；narrator 是讲故事的人|narrator is the voice that tells a story, not a mask or character taken on that differs from the real person|narrator 是讲故事的声音，不是不同于本人的面具或角色|subtext is a hidden meaning beneath the words, not a character someone takes on|subtext 是字面之下的含意，不是某人扮演的角色|per · so · na|the -a ending, not the -on of person|结尾是 -a，不是 person 的 -on
      subtext|anger beneath polite talk about the weather|a yes that really means no|dialogue that says more beneath the words than on the surface|subtext is the meaning beneath; verisimilitude is the feel of truth|subtext 是言外之意；verisimilitude 是真实感|persona is a mask or character someone takes on, not a meaning hidden beneath the words|persona 是某人戴上的面具或角色，不是藏在字面下的含意|verisimilitude is the quality of seeming true, not a meaning that lies beneath what is said|verisimilitude 是看起来真实的特质，不是话语之下的含意|sub · text|sub- meaning under, plus text|sub- 表示“在下面”，加上 text
      anachronism|a wristwatch on a king's arm in a film about medieval knights|Romans using telephones in a novel|calling ancient Romans teenagers|an anachronism is out of its time; chronology is the order of events|anachronism 是放错了时代；chronology 是事件的先后|verisimilitude is the quality of seeming true and real, which something out of its time spoils|verisimilitude 是逼真的真实感，而放错时代的东西恰恰会破坏它|chronology is the order in which events happened, not one thing placed in the wrong time|chronology 是事情发生的先后顺序，不是放错时代的某样东西|a · nach · ro · nism|ana- and the ch said as k, then -ism|ana- 加读作 k 的 ch，结尾是 -ism
    `,
  },
);

const epic = batch(
  "words-of-epic-and-myth",
  ["Words of Epic and Myth", "史诗与神话的词"],
  ["epics and myths", "史诗与神话"],
  `
  epic|a long poem that tells of the deeds of a great hero; or very great in scale|史诗；宏大的|The ___, a long poem of many books, tells of a king's ten-year journey home after a war.|Homer's ___, sung in verse, begins in the middle of the story, with the hero already far from home.|The poet spent twenty years on her ___, thousands of lines about one hero's deeds.|saga,invocation|epics
  invocation|a call for help, as when a poet asks a muse for inspiration at the start of a poem|祈求，祈祷|The poem opens with the poet's ___, a call to the goddess of memory for help.|The priest began the ceremony with a solemn ___, calling on the gods to bless the city.|In the ___, the poet asks the gods to sing through him.|epithet,muse|invocations,invoke
  epithet|a descriptive word or phrase used again and again with a name, such as "swift-footed Achilles"|称号，修饰语|"Rosy-fingered Dawn" is a famous ___ from Homer, used again and again.|The hero's ___, "the cunning one," is added to his name and shows what he is known for.|Each god in the poem has a fixed ___ that always comes with the name, such as "gray-eyed Athena."|invocation,saga|epithets
  saga|a long story of heroic deeds, often over many generations|传奇，长篇故事|The ___ follows one family through three hundred years of feuds and voyages.|Each old Icelandic ___, a long prose story, tells of feuds and voyages across generations.|The family ___ follows grandparents, parents and children over a whole century.|epic,bard|sagas
  bard|a poet, especially one who sang or recited long poems in ancient times|吟游诗人|At the feast, the ___ sang of the hero's deeds while playing a harp.|Shakespeare, the greatest poet of England, is often called the ___.|Each village had its own ___ who recited the old poems by heart.|muse,saga|bards
  muse|one of the goddesses believed to inspire poets and artists; or a person who inspires an artist|缪斯；灵感来源|The poet calls on the ___ to inspire him and give him the words to tell the story.|His wife was his ___, inspiring every painting he made.|Each ___ ruled over one art, such as music, dance or history.|bard,invocation|muses
  pantheon|all the gods of a people or a religion; or a group of very famous people|万神殿，众神；名人群体|Zeus ruled over the whole Greek ___ of gods from Mount Olympus.|The Norse ___, all the gods together, includes Odin, Thor and Freya.|With her discoveries, she has joined the ___ of great scientists.|deity,demigod|pantheons
  deity|a god or a goddess|神，神灵|The temple was built to honor the ___ of the sea, a god who ruled the waves.|Each ___ in the city had its own feast day, when people honored that god.|The ancient people prayed to their ___ of rain, a goddess, for a good harvest.|pantheon,demigod|deities
  demigod|a being who is part god and part human, such as Hercules|半神|Hercules was a ___, the son of Zeus and a human woman.|The ___ had great strength, but because he was half human he could still die.|Born to a goddess and a human king, the hero was a ___.|deity,pantheon|demigods
  immortal|living forever, never dying; or a being who lives forever|不朽的；神仙|The gods of Olympus never grew old or died, for they were ___.|Her songs will never be forgotten; they have made her name ___.|The hero refused the gift of living forever; he did not want to be ___.|celestial,omniscient|immortality,immortals,mortal,mortals
  `,
  "context-clues",
  {
    intro: t(
      "At the feast, the **bard** called on the **muse** and sang an **epic** about a **demigod** who dared to fight a **deity** of the sea. These ten words help you read the old stories of gods and heroes.",
      "宴会上，吟游诗人（**bard**）向缪斯（**muse**）祈求灵感，吟唱了一部史诗（**epic**），讲一位半神（**demigod**）竟敢与海神（**deity**）交战。这十个词帮你读懂关于神与英雄的古老故事。",
    ),
    watchOut: {
      meanings: t(
        "Count the gods: a **deity** is one god, a **demigod** is half god and half human, and a **pantheon** is all the gods of a people together.",
        "数一数神：**deity** 是一位神，**demigod** 是半神半人，**pantheon** 是一个民族的全体神祇。",
      ),
      use: t(
        'At the start of an epic, the poet makes an **invocation** (the *call*) to the **muse** (the *goddess* called on); an **epithet** is the phrase stuck to a name, such as "swift-footed."',
        "史诗开头，诗人向 **muse**（被呼唤的女神）作 **invocation**（呼唤本身）；**epithet** 则是固定附在名字上的修饰语，例如 swift-footed。",
      ),
      spelling: t(
        "Watch the *-theon* of **pantheon**, the *-thet* of **epithet**, the *e* before *i* in **deity**, and the double *m* of **immortal**.",
        "注意 **pantheon** 的 -theon、**epithet** 的 -thet、**deity** 中 e 在 i 前，以及 **immortal** 的双写 m。",
      ),
    },
    notes: `
      epic|a long poem of many books about a king's journey home|Homer's poem sung in verse, starting in the middle of the story|thousands of lines about one hero's deeds|an epic is a long poem about a hero; a saga is a long prose story, often of a family|epic 是关于英雄的长诗；saga 是长篇散文故事，常写一个家族|saga is a long prose story of heroic deeds, often across generations, not a long poem|saga 是讲英雄事迹的长篇散文故事，常跨越几代人，不是长诗|invocation is a call for help at the start of a poem, not the whole long poem|invocation 是诗开头的祈求，不是整部长诗|ep · ic|one p and the -ic ending|只有一个 p，结尾是 -ic
      invocation|a poet calling to the goddess of memory for help|a priest calling on the gods to bless a city|a poet asking the gods to sing through him|an invocation is the call; the muse is the goddess called on|invocation 是呼唤本身；muse 是被呼唤的女神|epithet is a describing phrase used with a name, not a call for help|epithet 是附在名字上的修饰语，不是求助的呼唤|muse is the goddess who is called on, not the call for help itself|muse 是被呼唤的女神，不是呼唤本身|in · vo · ca · tion|invoke changes k to c before -ation|invoke 的 k 在 -ation 前变成 c
      epithet|the phrase rosy-fingered used again and again with Dawn|the cunning one added to a hero's name|a fixed phrase such as gray-eyed that always comes with a god's name|an epithet is a phrase added to a name; an invocation is a call for help|epithet 是附在名字上的修饰语；invocation 是求助的呼唤|invocation is a call for help to a god or a muse, not a describing phrase added to a name|invocation 是向神或缪斯求助，不是附在名字上的修饰语|saga is a long story of heroic deeds, not a short phrase added to a name|saga 是讲英雄事迹的长故事，不是附在名字上的短语|ep · i · thet|the th in the last part, -thet|最后一段是 -thet，有 th
      saga|one family's feuds and voyages over three hundred years|old Icelandic prose stories of feuds across generations|grandparents, parents and children followed over a century|a saga is a prose story over generations; an epic is a long poem about one hero|saga 是跨越几代的散文故事；epic 是关于一位英雄的长诗|epic is a long poem about one great hero, not a prose story of a family over many generations|epic 是关于一位伟大英雄的长诗，不是讲一个家族几代人的散文故事|bard is a poet who sang old tales, not the long story itself|bard 是吟唱古老故事的诗人，不是故事本身|sa · ga|one g and the -a ending|只有一个 g，结尾是 -a
      bard|a singer of a hero's deeds at a feast, playing a harp|Shakespeare as England's greatest poet|a village poet reciting old poems by heart|a bard is the poet who sings; a muse inspires the poet|bard 是吟唱的诗人；muse 给诗人灵感|muse is a goddess or person who inspires a poet, not the poet who sings|muse 是给诗人灵感的女神或人，不是吟唱的诗人|saga is a long story of heroic deeds, not the person who sings it|saga 是讲英雄事迹的长故事，不是吟唱它的人|bard|the -ard as in hard, with no e at the end|-ard 同 hard，结尾没有 e
      muse|a poet calling for inspiration and words to tell a story|a wife who inspired every painting her husband made|goddesses who each ruled over one art|the muse inspires; the bard sings|muse 给予灵感；bard 负责吟唱|bard is the poet who sings, not the one who inspires the poet|bard 是吟唱的诗人，不是启发诗人的人|invocation is the call for help, not the goddess or person who gives inspiration|invocation 是求助的呼唤，不是给予灵感的女神或人|muse|the -use ending, as in use|结尾是 -use，同 use
      pantheon|all the Greek gods ruled by Zeus|Odin, Thor and Freya and all the Norse gods together|a group of the greatest scientists|a pantheon is all the gods together; a deity is one god|pantheon 是全体神祇；deity 是一位神|deity is one god or goddess, not all the gods of a people together|deity 是一位男神或女神，不是一个民族的全体神祇|demigod is one being who is part god and part human, not a whole group of gods|demigod 是一个半神半人的存在，不是一群神|pan · the · on|the -theon with an e before the o|-theon 中 o 前面有 e
      deity|a god who ruled the sea and its waves|each god of a city honored on a feast day|a goddess of rain prayed to for a good harvest|a deity is a full god; a demigod is only half god|deity 是完全的神；demigod 只是半神|pantheon is all the gods of a people together, not one god|pantheon 是一个民族的全体神祇，不是一位神|demigod is only part god and part human, not a full god or goddess|demigod 只是半神半人，不是完全的男神或女神|de · i · ty|the e before the i, then -ty|e 在 i 前面，结尾是 -ty
      demigod|Hercules as the son of Zeus and a human woman|a strong hero who could still die because he was half human|a hero born to a goddess and a human king|a demigod is half god and half human; a deity is a full god|demigod 半神半人；deity 是完全的神|deity is a full god or goddess, not a being who is half human|deity 是完全的男神或女神，不是半人半神的存在|pantheon is all the gods of a people, not one half-human being|pantheon 是一个民族的全体神祇，不是一个半人的存在|dem · i · god|demi- meaning half, plus god|demi- 表示“一半”，加上 god
      immortal|gods who never grew old or died|songs that keep a singer's name from being forgotten|a hero who refused the gift of living forever|immortal means never dying; celestial means belonging to the sky|immortal 指永生不死；celestial 指属于天空的|celestial means having to do with the sky or outer space, not living forever|celestial 指与天空或外太空有关，不是永生不死|omniscient means knowing everything, not never dying|omniscient 指无所不知，不是永远不死|im · mor · tal|the double m and the -tal ending|双写 m，结尾是 -tal
    `,
  },
);

const quests = batch(
  "words-of-trials-and-quests",
  ["Words of Trials and Quests", "考验与探寻的词"],
  ["quests and the trials of heroes", "英雄的探寻与考验"],
  `
  tribulation|a cause of great trouble or suffering|苦难，磨难|Hunger, cold and sickness: each ___ of that first winter brought the settlers great suffering.|The book tells of every hard trial and ___ that a young doctor suffered in the war.|Each ___ of the long march, from hunger to bitter cold, made the travelers suffer, yet stronger.|gauntlet,mishap|tribulations
  talisman|an object thought to have magic powers, especially to bring good luck or protection|护身符|The sailor wore a silver ___ around his neck to keep him safe from storms.|In the tale, the magic ___ protects the hero from the witch's spell.|She carried a lucky ___, a small carved stone, into every exam.|relic,heirloom|talismans
  relic|an object that has survived from the past, often one that is honored or treasured|遗物，圣物|The museum keeps a ___ from the old monastery: a bone of a saint in a silver box.|The old typewriter is a ___ of a time before computers.|Pilgrims traveled for weeks to see the sacred ___ kept in the church.|talisman,heirloom|relics
  gauntlet|a series of attacks or difficulties to be faced one after another; or a heavy glove of armor|夹击，严峻考验；铁手套|The hero had to run a ___ of monsters, one after another, to reach the gate.|The new law faced a ___ of criticism, attack after attack from every side.|The knight threw down his iron ___ as a challenge.|tribulation,vigil|gauntlets
  vigil|a period of staying awake at night to watch or pray|守夜，值夜|She kept a ___ at her father's bedside, awake all night.|The night before his quest, the knight held a ___ in the chapel, praying until dawn.|Hundreds joined a candlelight ___ through the night for the lost miners.|relic,sojourn|vigils
  emissary|a person sent on a special mission, especially to deliver a message|使者，密使|The king sent his ___ to the enemy camp with an offer of peace.|The ___ carried a sealed letter from the queen across the mountains.|She served as the ___ between the two families, carrying messages back and forth.|suppliant,guardian|emissaries
  arduous|needing a great deal of effort and energy|艰巨的，艰苦的|The climb to the summit was long and ___, and they stopped to rest every hundred steps.|Writing the dictionary by hand was ___ work that took thirty years.|After the ___ journey over the frozen pass, they reached the coast exhausted.|tenacious,undaunted|arduously
  tenacious|holding on firmly and refusing to give up|坚韧的，顽强的|The ___ reporter kept asking the same question until she finally got an answer.|The weed's ___ roots held on deep in the soil, and no one could pull them out.|The hero's ___ hope, which he never lets go of, keeps him alive.|arduous,intrepid|tenacity,tenaciously
  sojourn|a short stay in a place that is not your home|逗留，暂住|After a brief ___ of three days on the island, the sailors went on.|Her year-long ___ in Paris, far from home, changed her life.|The hero's ___ with the goddess on her island lasts seven years before he sails on.|vigil,emissary|sojourns
  forsake|to abandon or leave someone or something completely|抛弃，离弃|He swore never to ___ his friends, even if the whole world turned against them.|She would not ___ her dream of flying, though everyone told her to give it up.|The captain refused to ___ the sinking ship while any sailor was still on board.|abstain,elope|forsakes,forsook,forsaken
  `,
  "context-clues",
  {
    intro: t(
      "On the **arduous** road to the mountain, the knight held a **vigil** each night and carried a **talisman** for luck, swearing he would never **forsake** his quest. These ten words help you follow a hero through the trials of a quest.",
      "在通往高山的艰苦（**arduous**）路上，骑士每晚守夜（**vigil**），随身带着护身符（**talisman**）祈求好运，并发誓绝不放弃（**forsake**）他的使命。这十个词帮你跟随英雄经历探寻途中的种种考验。",
    ),
    watchOut: {
      meanings: t(
        "A **talisman** is believed to bring *luck or protection*; a **relic** is honored because it *survives from the past*; neither is simply a family **heirloom**.",
        "**talisman** 被认为能带来好运或保护；**relic** 因留存自过去而受到尊崇；两者都不只是家传的 **heirloom**。",
      ),
      use: t(
        "**Arduous** describes a *task or journey* that takes great effort; **tenacious** describes a *person or thing* that holds on and will not let go.",
        "**arduous** 形容费力的任务或旅程；**tenacious** 形容紧抓不放、绝不放弃的人或物。",
      ),
      spelling: t(
        "Watch the *au* of **gauntlet**, the double *s* of **emissary**, the *-uous* of **arduous**, the *-cious* of **tenacious** and the *-journ* (as in *journey*) of **sojourn**.",
        "注意 **gauntlet** 中的 au、**emissary** 的双写 s、**arduous** 的 -uous、**tenacious** 的 -cious，以及 **sojourn** 中的 -journ（同 journey）。",
      ),
    },
    notes: `
      tribulation|hunger, cold and sickness bringing settlers great suffering in their first winter|the hard trials a young doctor suffered in a war|the hunger and bitter cold of a long march|a tribulation is a cause of great suffering; a mishap is only a small accident|tribulation 是带来巨大苦难的事；mishap 只是小意外|gauntlet is a series of attacks to be run through one after another, not one cause of great suffering|gauntlet 是要一一闯过的连番攻击，不是某一件带来巨大苦难的事|mishap is a small accident or bit of bad luck, not great trouble and suffering|mishap 是小事故或小小的不幸，不是巨大的苦难|trib · u · la · tion|the u after trib and the -lation ending|trib 后面是 u，结尾是 -lation
      talisman|a silver charm worn to keep a sailor safe from storms|a magic object protecting a hero from a witch's spell|a lucky carved stone carried into every exam|a talisman is believed to bring luck or protection; a relic is honored because it is old|talisman 被认为能带来好运或保护；relic 因古老而受尊崇|relic is an object that survives from the past and is honored, not one thought to bring luck or protection|relic 是留存自过去并受尊崇的物品，不是被认为能带来好运或保护的东西|heirloom is a treasured object passed down in a family, not one with magic powers to protect|heirloom 是家族世代相传的珍贵物品，不是有魔力保护人的东西|tal · is · man|the -man ending, with the plural talismans|结尾是 -man，复数是 talismans
      relic|a saint's bone kept in a silver box from an old monastery|an old typewriter from a time before computers|a sacred object pilgrims traveled for weeks to see|a relic survives from the past and is honored; a talisman is believed to bring luck|relic 是留存下来并受尊崇的旧物；talisman 被认为能带来好运|talisman is an object thought to bring luck or protection, not something honored because it survives from the past|talisman 是被认为能带来好运或保护的东西，不是因留存自过去而受尊崇的物品|heirloom is an object passed down within one family, not something kept from an old age or a holy place|heirloom 是在一个家族中传下来的物品，不是从古代或圣地保存下来的东西|rel · ic|the -ic ending, not -ick|结尾是 -ic，不是 -ick
      gauntlet|a hero running past monster after monster to reach a gate|a law facing attack after attack of criticism|a knight throwing down his iron glove as a challenge|a gauntlet is a series of attacks one after another; a tribulation is one great suffering|gauntlet 是接连不断的攻击；tribulation 是一桩巨大的苦难|tribulation is one cause of great suffering, not a series of attacks to pass through or a glove|tribulation 是带来巨大苦难的事，不是要闯过的连番攻击，也不是手套|vigil is a night of staying awake to watch or pray, not a series of attacks or a glove|vigil 是彻夜不眠地守候或祈祷，不是连番攻击，也不是手套|gaunt · let|the au in gaunt and the -let ending|gaunt 中的 au，结尾是 -let
      vigil|a daughter awake all night at her father's bedside|a knight praying in a chapel until dawn before his quest|hundreds holding candles through the night for lost miners|a vigil is a night awake to watch or pray; a sojourn is a short stay somewhere|vigil 是彻夜守候或祈祷；sojourn 是在某地短暂逗留|relic is an object kept from the past, not a night of staying awake|relic 是留存自过去的物品，不是彻夜不眠|sojourn is a short stay away from home, not a night spent awake to watch or pray|sojourn 是离家在外短暂逗留，不是彻夜守候或祈祷|vig · il|the -il ending, not -ill or -le|结尾是 -il，不是 -ill 或 -le
      emissary|a king's messenger sent to an enemy camp with an offer of peace|a messenger carrying a queen's sealed letter over mountains|a go-between carrying messages between two families|an emissary is sent with a message; a suppliant comes to beg for help|emissary 是奉命传信的人；suppliant 是前来哀求的人|suppliant is someone who humbly begs for help for himself, not someone sent to deliver a message|suppliant 是为自己低声下气求助的人，不是被派去传信的人|guardian is someone who protects or is responsible for a child, not a messenger sent on a mission|guardian 是保护者或孩子的监护人，不是奉命出使的信使|em · is · sar · y|the double s and the -ary ending|双写 s，结尾是 -ary
      arduous|a long climb to a summit with rests every hundred steps|thirty years of writing a dictionary by hand|a journey over a frozen pass that left travelers exhausted|arduous describes a task that needs great effort; tenacious describes someone who will not give up|arduous 形容费力的任务；tenacious 形容不肯放弃的人|tenacious describes a person or thing that holds on and will not give up, not a task that needs great effort|tenacious 形容紧抓不放、不肯放弃的人或物，不是费力的任务|undaunted describes a person who is not discouraged, not a task or journey that needs great effort|undaunted 形容不气馁的人，不是费力的任务或旅程|ar · du · ous|the du said like ju and the -uous ending|du 读作 ju，结尾是 -uous
      tenacious|a reporter asking the same question until she got an answer|roots holding so deep that no one could pull them out|a hope a hero never lets go of|tenacious holds on and will not give up; intrepid is fearless|tenacious 紧抓不放；intrepid 无所畏惧|arduous describes a task that needs great effort, not someone who holds on and will not give up|arduous 形容费力的任务，不是紧抓不放、不肯放弃的人|intrepid means fearless and adventurous, not holding on firmly and refusing to let go|intrepid 指无畏而爱冒险，不是紧抓不放|te · na · cious|the -cious ending with a c, as in delicious|结尾是带 c 的 -cious，同 delicious
      sojourn|three days on an island before the sailors went on|a year in Paris, far from home|seven years on a goddess's island before a hero sails on|a sojourn is a short stay away from home; a vigil is a night awake|sojourn 是离家短住；vigil 是彻夜不眠|vigil is a night of staying awake to watch or pray, not a stay in a place away from home|vigil 是彻夜守候或祈祷，不是在异地逗留|emissary is a person sent with a message, not a stay somewhere|emissary 是奉命传信的人，不是在某地逗留|so · journ|the -journ as in journey|-journ 同 journey
      forsake|a vow never to abandon friends|refusing to give up a dream of flying|a captain refusing to leave a sinking ship while sailors were aboard|forsake is to abandon completely; abstain is to choose not to do something|forsake 是彻底抛弃；abstain 是选择不做某事|abstain means to choose not to do something you enjoy, not to leave someone or something completely|abstain 指选择不做喜欢的事，不是彻底离开某人或某物|elope means to run away secretly to get married, not to abandon someone or something|elope 指为结婚而私奔，不是抛弃某人或某物|for · sake|for- with no e, then sake|for- 没有 e，再加 sake
    `,
  },
);

const honor = batch(
  "words-of-honor-and-hospitality",
  ["Words of Honor and Hospitality", "荣誉与待客之道的词"],
  ["honor, loyalty and the welcome of guests", "荣誉、忠诚与待客"],
  `
  hospitality|friendly and generous treatment of guests and strangers|好客，殷勤招待|The villagers showed great ___ to the lost travelers, giving them food and beds.|In ancient Greece, a host who harmed a guest broke the sacred laws of ___.|Thank you for your kind ___; we loved staying in your home.|reciprocity,solidarity|hospitable
  fealty|the loyalty a person in the Middle Ages owed to a lord|（封建时代的）效忠|In the ceremony, each lord knelt before the king and swore ___ to him as his master.|In return for his land, the knight owed his lord ___ and forty days of service each year.|In the Middle Ages, breaking an oath of ___ to one's lord was punished harshly.|devotion,reciprocity
  suppliant|a person who humbly asks for help, especially from someone powerful|恳求者，哀求者|The ___ knelt before the king and begged for his son's life.|By custom, any ___ who came begging at the altar could not be harmed.|She came to the palace not as a queen but as a humble ___, asking for help.|benefactor,emissary|suppliants
  benefactor|a person who gives money or help to a person or a cause|恩人，捐助者|A mysterious ___ paid for her studies but never gave his name.|The library was built with money from a wealthy ___.|The hospital thanked its ___ for a large gift.|suppliant,guardian|benefactors
  reciprocity|giving something in return for what you receive, so that both sides benefit|互惠|Friendship depends on ___: each friend gives as much as the other.|The two towns agreed on ___: each would help the other in a flood.|Gifts in the story create a bond of ___, for each gift must be answered with another.|hospitality,fealty
  disgrace|loss of respect and honor; or something that causes it|耻辱，丢脸|He left the court in ___ after the scandal, his good name lost.|The broken promise brought ___ on the whole family, and the neighbors stopped respecting them.|She refused to bring ___ on her name by cheating.|retribution,rancor|disgraced,disgraceful
  retribution|punishment for a serious wrong|惩罚，报应|The villagers demanded ___, a fair punishment for the men who burned their homes.|The gods' ___ fell on the proud king, who was punished for his cruelty.|He lived in fear of ___, sure that the law would punish him for his crime.|disgrace,vendetta
  ignominy|public shame and loss of honor|耻辱，不光彩|The general suffered the ___ of surrender in front of his whole army.|She could not bear the public ___ of being sent home in front of the whole school.|The team avoided the ___ of finishing last.|retribution,rancor|ignominious
  magnanimous|generous and forgiving, especially toward a rival or someone weaker|宽宏大量的|The ___ winner forgave his rival's insults and invited him to the celebration.|It was ___ of her, and very generous, to forgive the rival who had cheated her.|In one ___ gesture, the king forgave and freed the prisoners who had fought against him.|honorable,prudent|magnanimity
  honorable|deserving respect because of being honest and fair|光荣的，正直的|He was honest, fair and ___, a man who always kept his word.|Cheating is never ___, because it is neither honest nor fair.|She made the ___ choice to tell the truth, even though it cost her the prize.|magnanimous,shrewd|honorably
  `,
  "context-clues",
  {
    intro: t(
      "The old king was famous for his **hospitality**; when a **suppliant** knelt at his gate, he was **magnanimous**, and he would rather die than suffer the **ignominy** of turning a guest away. These ten words help you talk about honor, loyalty and the welcome of guests.",
      "老国王以好客（**hospitality**）闻名；有恳求者（**suppliant**）跪在宫门前时，他宽宏大量（**magnanimous**），宁死也不愿蒙受拒客的耻辱（**ignominy**）。这十个词帮你谈论荣誉、忠诚与待客之道。",
    ),
    watchOut: {
      meanings: t(
        "A **suppliant** *asks* for help and a **benefactor** *gives* it; **fealty** is loyalty owed *up* to a lord, while **reciprocity** is giving back *as equals*.",
        "**suppliant** 是求助的人，**benefactor** 是施助的人；**fealty** 是对领主向上的效忠，**reciprocity** 是平等的互相回报。",
      ),
      use: t(
        "**Disgrace** and **ignominy** are shame, but **retribution** is *punishment*; **magnanimous** is generous forgiveness, while **honorable** is plain honesty and fairness.",
        "**disgrace** 和 **ignominy** 都是耻辱，**retribution** 却是惩罚；**magnanimous** 是宽厚的原谅，**honorable** 是诚实公正。",
      ),
      spelling: t(
        "Watch the *fe-al* of **fealty** (not *feel*), the double *p* of **suppliant**, the *-proc-* of **reciprocity** and the silent *h* of **honorable**.",
        "注意 **fealty** 拼作 fe-al（不是 feel）、**suppliant** 的双写 p、**reciprocity** 中的 -proc-，以及 **honorable** 中不发音的 h。",
      ),
    },
    notes: `
      hospitality|villagers giving food and beds to lost travelers|a host who harmed a guest breaking sacred laws|thanks for a kind welcome in someone's home|hospitality is a host's generous welcome; reciprocity is giving back in return|hospitality 是主人慷慨的款待；reciprocity 是有来有往的回报|reciprocity is giving something back in return, not a host's generous welcome of guests|reciprocity 是有来有往的回报，不是主人对客人的慷慨款待|solidarity is unity among people who share a struggle, not the welcome a host gives guests|solidarity 是共患难者之间的团结，不是主人对客人的款待|hos · pi · tal · i · ty|hospital plus -ity|hospital 加 -ity
      fealty|lords kneeling to swear loyalty to their king|a knight owing his lord loyalty and service in return for land|an oath of loyalty to a lord in the Middle Ages|fealty is loyalty owed to a lord; devotion is loving care|fealty 是对领主的效忠；devotion 是挚爱与忠心|devotion is great love and care for someone, not the duty of loyalty a medieval knight owed his lord|devotion 是深厚的爱与关怀，不是中世纪骑士对领主应尽的效忠义务|reciprocity is a fair exchange between equals, not the loyalty owed upward to a lord|reciprocity 是平等双方的公平交换，不是向上对领主的效忠|fe · al · ty|the e before the a, fe-al, not feel|e 在 a 前面，是 fe-al，不是 feel
      suppliant|a man kneeling before a king to beg for his son's life|someone begging at an altar who could not be harmed|a woman coming to a palace humbly asking for help|a suppliant begs for help; a benefactor gives it|suppliant 是求助的人；benefactor 是施助的人|benefactor is someone who gives help, not someone who humbly begs for it|benefactor 是施予帮助的人，不是低声下气求助的人|emissary is someone sent to deliver a message, not someone humbly begging for help|emissary 是被派去传信的人，不是低声求助的人|sup · pli · ant|the double p and the -ant ending|双写 p，结尾是 -ant
      benefactor|a mysterious giver who paid for a girl's studies|a wealthy giver whose money built a library|a giver thanked by a hospital for a large gift|a benefactor gives help; a suppliant begs for it|benefactor 是施助的人；suppliant 是求助的人|suppliant is someone who begs for help, not someone who gives it|suppliant 是乞求帮助的人，不是给予帮助的人|guardian is someone legally responsible for a child or who protects something, not someone who gives money to a cause|guardian 是孩子的法定监护人或守护者，不是为事业捐钱的人|ben · e · fac · tor|bene- meaning good, then -factor with -or|bene- 意为“好”，再加以 -or 结尾的 -factor
      reciprocity|friends who each give as much as the other|two towns agreeing to help each other in a flood|gifts that must each be answered with another gift|reciprocity is giving back as equals; fealty is loyalty owed to a lord|reciprocity 是平等的互相回报；fealty 是对领主的效忠|hospitality is a host's generous welcome to guests, not an even exchange in which both sides give|hospitality 是主人对客人的慷慨款待，不是双方对等的交换|fealty is loyalty owed by one side to a lord, not giving back in return as equals|fealty 是一方对领主的效忠，不是平等的互相回报|rec · i · proc · i · ty|the -proc- with a c and the -ity ending|中间是带 c 的 -proc-，结尾是 -ity
      disgrace|a man leaving court after a scandal with his good name lost|a broken promise that made neighbors stop respecting a family|a girl refusing to shame her name by cheating|disgrace is loss of honor; retribution is punishment|disgrace 是名誉扫地；retribution 是惩罚|retribution is punishment for a wrong, not loss of respect and honor|retribution 是对错事的惩罚，不是失去尊重与名誉|rancor is bitter anger kept inside, not a loss of respect and honor|rancor 是积在心里的怨恨，不是失去尊重与名誉|dis · grace|dis- plus grace|dis- 加 grace
      retribution|villagers demanding fair punishment for the men who burned their homes|the gods punishing a proud, cruel king|a criminal sure that the law would punish him|retribution is punishment for a wrong; a vendetta is a chain of revenge|retribution 是对错事的惩罚；vendetta 是冤冤相报|disgrace is loss of respect and honor, not punishment for a wrong|disgrace 是失去尊重与名誉，不是对错事的惩罚|vendetta is a long chain of revenge between families, not a single just punishment|vendetta 是家族间长期的冤冤相报，不是一次公正的惩罚|ret · ri · bu · tion|re-tri-, with ri, then -bution|re-tri-，中间是 ri，结尾是 -bution
      ignominy|a general surrendering in front of his whole army|a girl sent home in front of the whole school|a team only just avoiding finishing last|ignominy is public shame; retribution is punishment|ignominy 是当众受辱；retribution 是惩罚|retribution is punishment for a wrong, not public shame|retribution 是对错事的惩罚，不是当众受辱|rancor is bitter anger that lasts, not the shame of losing honor in public|rancor 是长久的怨恨，不是当众失去名誉的羞耻|ig · no · min · y|the o after n and the -iny ending|n 后面是 o，结尾是 -iny
      magnanimous|a winner forgiving a rival's insults and inviting him to celebrate|a woman generous enough to forgive a rival who cheated her|a king forgiving and freeing prisoners who fought against him|magnanimous is generous forgiveness; honorable is honesty and fairness|magnanimous 是宽厚的原谅；honorable 是诚实公正|honorable means honest and fair, which is about keeping your word, not about generously forgiving a rival|honorable 指诚实公正，讲的是守信，不是宽厚地原谅对手|prudent means careful and sensible about the future, not generous and forgiving|prudent 指对未来谨慎明智，不是宽厚大度|mag · nan · i · mous|the -nan- in the middle and the -mous ending|中间是 -nan-，结尾是 -mous
      honorable|an honest, fair man who always kept his word|cheating, which is neither honest nor fair|a girl telling the truth even though it cost her a prize|honorable is honest and fair; magnanimous is generous and forgiving|honorable 是诚实公正；magnanimous 是宽厚大度|magnanimous means generous and forgiving toward a rival, not simply honest and fair|magnanimous 指对对手宽厚大度，不只是诚实公正|shrewd means clever at getting an advantage, not honest and fair|shrewd 指精于为自己谋利，不是诚实公正|hon · or · a · ble|the silent h and -or- in American spelling|开头的 h 不发音，美式拼写是 -or-
    `,
  },
);

const feuds = batch(
  "words-of-love-and-feuds",
  ["Words of Love and Feuds", "爱情与世仇的词"],
  ["love and family feuds", "爱情与家族世仇"],
  `
  vendetta|a long series of revenge attacks between families or groups|血亲复仇，宿怨|The killing started the ___, revenge attacks between the two families that lasted thirty years.|Each murder in the ___ led to another, as each family took revenge for the last.|The town was torn apart by the ___, a chain of killings and counter-killings.|enmity,rancor|vendettas
  enmity|a feeling of hatred between enemies|敌意，仇恨|The old ___ between the two houses, a hatred neither side forgot, flared up again in the street.|There was deep ___ between the rival captains; each hated the other.|Time had not softened the ___ the two enemies felt for each other.|vendetta,devotion|enmities
  rancor|bitter, long-lasting anger and resentment|积怨，怨恨|Years later, he spoke of the rival who had cheated him without any bitter ___.|Years of ___ and resentment divided the village after the unfair election.|She let go of her bitter ___ and forgave him.|vendetta,ardor
  infatuation|a strong but short-lived feeling of love or attraction|迷恋|His ___ with the actress lasted only one summer, then vanished.|Is it true, lasting love, or only a short-lived ___?|Her ___ with the new game faded within a week.|devotion,ardor|infatuated
  devotion|great love, loyalty or care for someone or something|挚爱，忠诚|For ten years, her ___ to her sick brother never weakened.|The dog's loyal ___ to its owner, waiting at the station every day, moved everyone.|After fifty years of marriage, he still cared for his wife with quiet, faithful ___.|infatuation,ardor|devoted
  ardor|great warmth and strength of feeling, especially of love or enthusiasm|热情，热恋|He wrote love letters full of ___, burning with passion.|Her ___ for science, a burning enthusiasm, began in childhood.|The crowd's excited ___ cooled when the speech went on too long.|devotion,rancor|ardent
  suitor|a man who wants to marry a particular woman|求婚者|Each ___ brought gifts to the princess, hoping she would choose him as her husband.|Her father turned away every ___ who asked to marry her.|The rich ___ asked for her hand, but to everyone's surprise she refused him.|betrothed,emissary|suitors
  betrothed|engaged to be married; or the person someone is engaged to|已订婚的；未婚夫（妻）|She was ___ to a prince she had never met.|The young couple were ___, and the wedding was planned for June.|The two were ___ when they were still children, by an agreement between their fathers.|clandestine,estranged
  elope|to run away secretly in order to get married|私奔|Rather than wait for their parents' approval, the young couple decided to ___ and marry in secret.|They planned to ___ on a stormy night and marry in the next town.|Her parents feared she would ___ with the sailor and marry without their blessing.|forsake,abstain|elopes,eloped
  clandestine|done secretly, often because it is not allowed|秘密的，暗中的|The lovers held ___ meetings in the garden at midnight so that no one would find out.|The rebels' ___ newspaper was printed in a cellar that the police never found.|Their ___ wedding, kept secret from both families, took place in the old chapel.|implicit,estranged|clandestinely
  `,
  "context-clues",
  {
    intro: t(
      "Across the town square raged a **vendetta** between two families, yet their children held **clandestine** meetings and planned to **elope**, their **ardor** stronger than any **enmity**. These ten words help you talk about love and the feuds that stand in its way.",
      "城中广场两边的两个家族冤冤相报（**vendetta**），可他们的孩子却秘密（**clandestine**）相会，计划私奔（**elope**）；他们的热恋（**ardor**）胜过一切仇恨（**enmity**）。这十个词帮你谈论爱情，以及阻挡爱情的世仇。",
    ),
    watchOut: {
      meanings: t(
        "**Enmity** and **rancor** are *feelings* of hatred and bitterness, but a **vendetta** is a *chain of revenge attacks*; **infatuation** fades fast, while **devotion** lasts.",
        "**enmity** 和 **rancor** 是仇恨与怨恨的感情，**vendetta** 却是一连串报复行动；**infatuation** 来得快去得快，**devotion** 则长久不变。",
      ),
      use: t(
        "A **suitor** is still *trying* to win a bride; once she says yes, they are **betrothed**; if their families say no, they may **elope**.",
        "**suitor** 还在追求；一旦对方答应，两人便 **betrothed**（订婚）；若家里反对，他们可能会 **elope**（私奔）。",
      ),
      spelling: t(
        "Watch the double *t* of **vendetta**, the *-or* (no *u*) of **rancor** and **ardor**, the *-des-* of **clandestine**, and the single *l* of **elope**.",
        "注意 **vendetta** 的双写 t、**rancor** 和 **ardor** 结尾的 -or（没有 u）、**clandestine** 中的 -des-，以及 **elope** 只有一个 l。",
      ),
    },
    notes: `
      vendetta|revenge attacks between two families lasting thirty years|each murder leading to another as each family took revenge|a chain of killings and counter-killings tearing a town apart|a vendetta is a chain of revenge attacks; enmity is the feeling of hatred|vendetta 是一连串报复行动；enmity 是仇恨的感情|enmity is a feeling of hatred, not a series of revenge attacks|enmity 是仇恨的感情，不是一连串的报复行动|rancor is bitter resentment inside someone, not a chain of revenge attacks|rancor 是心中的积怨，不是一连串的报复行动|ven · det · ta|the double t and the -a ending|双写 t，结尾是 -a
      enmity|an old hatred between two houses that neither side forgot|rival captains who each hated the other|a hatred between two enemies that time had not softened|enmity is hatred between enemies; a vendetta is the revenge attacks themselves|enmity 是敌人间的仇恨；vendetta 是报复行动本身|vendetta is a series of revenge attacks, not the feeling of hatred itself|vendetta 是一连串报复行动，不是仇恨的感情本身|devotion is great love and loyalty, the opposite of hatred between enemies|devotion 是深厚的爱与忠诚，与敌人间的仇恨正相反|en · mi · ty|enemy loses its e: en-mi-ty|enemy 去掉 e，变成 en-mi-ty
      rancor|a man speaking without bitterness of the rival who cheated him|years of resentment dividing a village after an unfair election|a woman letting go of her bitterness and forgiving|rancor is bitter resentment; ardor is warm passion|rancor 是积怨；ardor 是热情|vendetta is a series of revenge attacks, not bitter resentment kept inside|vendetta 是一连串报复行动，不是积在心中的怨恨|ardor is warm, eager feeling, the opposite of bitter resentment|ardor 是温暖热切的感情，与积怨正相反|ran · cor|the -or ending, with no u in American spelling|结尾是 -or，美式拼写没有 u
      infatuation|a love for an actress that lasted only one summer|the question of true love or something short-lived|a passion for a new game that faded within a week|infatuation is a strong attraction that soon fades; devotion lasts|infatuation 是很快消退的迷恋；devotion 长久不变|devotion is deep, lasting love and loyalty, not a strong attraction that soon fades|devotion 是深厚持久的爱与忠诚，不是很快消退的迷恋|ardor is warmth and strength of feeling in general, not a sudden attraction that is short-lived|ardor 泛指热烈的感情，不是突然而短暂的迷恋|in · fat · u · a · tion|in-fat-u, then -ation|in-fat-u 再加 -ation
      devotion|ten years of caring for a sick brother|a dog waiting at the station for its owner every day|fifty years of faithful care for a wife|devotion is lasting, faithful love; infatuation soon fades|devotion 是长久忠实的爱；infatuation 很快消退|infatuation is a strong attraction that soon fades, not lasting love and loyalty|infatuation 是很快消退的迷恋，不是长久的爱与忠诚|ardor is fiery passion or enthusiasm, not quiet, faithful loyalty and care|ardor 是炽热的激情，不是安静忠实的关爱|de · vo · tion|devote drops its e, then -tion|devote 去掉 e 再加 -tion
      ardor|love letters burning with passion|a burning enthusiasm for science since childhood|a crowd's excitement cooling during a long speech|ardor is burning passion; devotion is faithful love over time|ardor 是炽热的激情；devotion 是长久忠实的爱|devotion is faithful love and loyalty over time, not a burning heat of feeling|devotion 是长久忠实的爱与忠诚，不是炽热的感情|rancor is bitter resentment, not warm, eager feeling|rancor 是积怨，不是温暖热切的感情|ar · dor|the -or ending, with no u in American spelling|结尾是 -or，美式拼写没有 u
      suitor|men bringing gifts to a princess hoping to marry her|men turned away by a father when they asked to marry his daughter|a rich man refused when he asked for a woman's hand|a suitor is still trying to win a bride; a betrothed is already engaged|suitor 还在追求；betrothed 已经订婚|betrothed is someone already engaged to be married, not a man still trying to win a woman|betrothed 是已经订婚的人，不是仍在追求女子的男人|emissary is someone sent with a message, not a man who wants to marry|emissary 是奉命传信的人，不是想要求婚的男人|suit · or|suit plus -or|suit 加 -or
      betrothed|a girl promised to a prince she had never met|a couple whose wedding was planned for June|two children promised to marry by their fathers' agreement|betrothed means promised in marriage; estranged means no longer close|betrothed 指已订婚；estranged 指已经疏远|clandestine means done in secret, not promised in marriage|clandestine 指秘密进行的，不是已订下婚约|estranged means no longer close or in contact, the opposite of being engaged to marry|estranged 指不再亲近或联系，与订婚正相反|be · trothed|the -troth- with th, then -ed|中间是带 th 的 -troth-，结尾是 -ed
      elope|a couple marrying in secret instead of waiting for approval|a plan to run off on a stormy night to marry in the next town|parents afraid their daughter would marry a sailor without their blessing|elope is to run away to marry; forsake is to abandon|elope 是私奔成婚；forsake 是抛弃|forsake means to abandon someone or something completely, not to run away to get married|forsake 指彻底抛弃某人或某物，不是为结婚而私奔|abstain means to choose not to do something, not to run off secretly to marry|abstain 指选择不做某事，不是偷偷私奔成婚|e · lope|one l and a silent e at the end|只有一个 l，结尾的 e 不发音
      clandestine|lovers meeting in a garden at midnight so no one would find out|a rebel newspaper printed in a hidden cellar|a wedding kept secret from both families|clandestine is done in secret; implicit is suggested without being said|clandestine 是暗中进行的；implicit 是没明说的暗示|implicit means suggested without being stated, not done in secret because it is not allowed|implicit 指暗含而未明说，不是因不被允许而偷偷进行|estranged means no longer friendly or in contact, not hidden from others|estranged 指不再亲近或联系，不是瞒着别人|clan · des · tine|the -des- with an e and the -tine ending|中间是 -des-，结尾是 -tine
    `,
  },
);

const fate = batch(
  "words-of-fate-and-fortune",
  ["Words of Fate and Fortune", "命运与运气的词"],
  ["fate, chance and fortune", "命运、机缘与运气"],
  `
  portent|a sign or warning that something important, usually bad, is about to happen|凶兆，预兆|The comet was taken as a ___ of war, a warning of what was to come.|Strange dreams were a ___ that the king would soon die.|The play opens with a dark ___: a storm, a howling dog and a falling crown.|providence,calamity|portents,portentous
  providence|the care of God or nature, thought to guide events; or careful planning for the future|天意；远见|They thanked ___ for watching over them and bringing them home safely.|By ___, a ship passed just as their raft began to sink, as if heaven had sent it.|The farmer's ___, storing grain for the years ahead, saved the village from hunger.|fortune,happenstance
  fortune|chance or luck, good or bad, and the way it affects a life; or great wealth|运气；财富|By good ___, a doctor happened to be on the train.|Then ___ turned against the king, and his luck ran out in every battle.|She made her ___ selling books and became one of the richest women in town.|providence,calamity|fortunes,fortunate,misfortune,misfortunes
  calamity|a sudden event that causes great damage or suffering|灾难|The flood, which destroyed half the houses, was the worst ___ in the town's history.|The play ends in ___ for both families: both heirs are dead.|The earthquake was a ___ that left thousands without homes.|mishap,portent|calamities
  mishap|a small accident or piece of bad luck|小事故，不幸|Apart from one small ___ with a flat tire, the trip went well.|A minor ___ in the kitchen, a dropped bag, left flour everywhere.|The race was going well until a small ___: her shoelace came undone.|calamity,fluke|mishaps
  serendipity|the luck of finding something good without looking for it|意外发现，机缘巧合|By pure ___, she found her grandmother's lost letter while looking for a recipe.|Many discoveries in science were made by ___, while researchers were looking for something else.|It was happy ___ that let her find her dream job while looking for a café.|providence,portent|serendipitous
  happenstance|something that happens by chance|偶然事件|By ___, they had both chosen the same train, without any plan.|Their meeting was mere ___, not a plan and not fate.|Much of history depends on ___: a missed letter, a sudden storm, a lucky guess.|providence,portent
  predestined|already decided by God or fate, so that it cannot be changed|命中注定的|The lovers believed their meeting was ___, decided by fate before they were born.|Is the hero's death ___ by the gods, or could he escape it?|He did not believe that anything was ___; he thought people make their own fate.|auspicious,arbitrary|predestination
  auspicious|showing signs that success will follow|吉利的，吉祥的|The sunny, calm morning was ___, a good sign for the voyage ahead.|They waited for the most ___ day, one that promised good luck, for the wedding.|Losing the first game was not the most ___ beginning for the team.|predestined,prudent|auspiciously
  fluke|something lucky or surprising that happens by chance, not by skill|侥幸，偶然|Her first win was a ___, but the second showed real skill.|By a lucky ___, the ball bounced off a post and into the goal.|It was no ___; he had practiced that shot for years.|mishap,serendipity|flukes
  `,
  "context-clues",
  {
    intro: t(
      "Some sailors saw the comet as a **portent**; others thanked **providence** for their safe return; but the captain said the calm sea was just a **fluke**. These ten words help you talk about fate, chance and luck.",
      "有的水手把彗星看作凶兆（**portent**）；有的感谢天意（**providence**）保佑他们平安归来；船长却说风平浪静不过是侥幸（**fluke**）。这十个词帮你谈论命运、机缘与运气。",
    ),
    watchOut: {
      meanings: t(
        "A **portent** comes *before* trouble as a warning; a **calamity** *is* the disaster; a **mishap** is only a *small* accident.",
        "**portent** 在灾祸之前出现，是预警；**calamity** 就是灾难本身；**mishap** 只是小意外。",
      ),
      use: t(
        "Ask who decides: **providence** is a caring power that guides, **predestined** means fixed by fate, while **happenstance** and a **fluke** are pure chance.",
        "问问是谁决定的：**providence** 是关照引导的力量，**predestined** 是命中注定，**happenstance** 和 **fluke** 则纯属偶然。",
      ),
      spelling: t(
        "Watch the *au* and *-cious* of **auspicious**, the *-dence* of **providence**, the single *l* and *m* of **calamity**, and the *-dip-* of **serendipity**.",
        "注意 **auspicious** 的 au 和 -cious、**providence** 的 -dence、**calamity** 只有一个 l 和一个 m，以及 **serendipity** 中的 -dip-。",
      ),
    },
    notes: `
      portent|a comet taken as a warning of war|strange dreams warning that a king would die|a storm, a howling dog and a falling crown at the start of a play|a portent warns of trouble ahead; a calamity is the trouble itself|portent 预示灾祸；calamity 就是灾祸本身|providence is the care of God or nature guiding events, not a warning sign of trouble ahead|providence 是上天或自然对世事的眷顾，不是灾祸将至的预兆|calamity is the disaster itself, not a sign that one is coming|calamity 是灾难本身，不是灾难将至的征兆|por · tent|por plus tent|por 加 tent
      providence|a family thanking heaven for watching over them on the way home|a ship passing as if sent by heaven just as a raft began to sink|a farmer storing grain for the years ahead|providence is a caring power or careful planning; fortune is plain luck|providence 是上天的眷顾或深谋远虑；fortune 只是运气|fortune is luck, good or bad, or wealth, not a caring power that guides events or careful planning|fortune 是好运、厄运或财富，不是引导世事的眷顾，也不是深谋远虑|happenstance is something that happens by mere chance, not care and guidance from heaven or careful planning|happenstance 是纯属偶然的事，不是上天的眷顾或深谋远虑|prov · i · dence|provide changes to provi-, then -dence|provide 变成 provi-，再加 -dence
      fortune|a doctor who happened to be on the train|a king whose luck ran out in every battle|a woman who became rich selling books|fortune is luck or wealth; providence is a caring power that guides|fortune 是运气或财富；providence 是引导世事的眷顾|providence is the care of God or nature guiding events, not luck or wealth|providence 是上天或自然对世事的眷顾，不是运气或财富|calamity is a sudden disaster, not luck in general or great wealth|calamity 是突如其来的灾难，不是一般的运气或巨额财富|for · tune|for plus tune|for 加 tune
      calamity|a flood that destroyed half the houses in a town|both heirs dead at the end of a play|an earthquake that left thousands without homes|a calamity causes great damage; a mishap is a small accident|calamity 造成巨大损失；mishap 只是小意外|mishap is a small accident, not a sudden event that causes great damage|mishap 是小意外，不是造成巨大破坏的突发事件|portent is a warning sign of trouble ahead, not the disaster itself|portent 是灾祸将至的征兆，不是灾难本身|ca · lam · i · ty|one l, one m and the -ity ending|一个 l、一个 m，结尾是 -ity
      mishap|a flat tire on an otherwise good trip|a dropped bag of flour in a kitchen|a shoelace coming undone in the middle of a race|a mishap is a small accident; a calamity is a disaster|mishap 是小意外；calamity 是大灾难|calamity is a disaster that causes great damage, not a small accident|calamity 是造成巨大损失的灾难，不是小意外|fluke is a lucky chance, not a small piece of bad luck|fluke 是侥幸的好运，不是小小的不幸|mis · hap|mis- plus hap, with the s and h said apart|mis- 加 hap，s 和 h 分开读
      serendipity|finding a lost letter while looking for a recipe|scientific discoveries made while looking for something else|finding a dream job while looking for a café|serendipity is the luck of a happy discovery; providence is guidance from heaven|serendipity 是意外发现的好运；providence 是上天的眷顾|providence is the care of God or nature guiding events, not the luck of finding something good by accident|providence 是上天或自然对世事的眷顾，不是意外发现好东西的运气|portent is a warning sign of trouble, not a happy discovery|portent 是灾祸的征兆，不是令人高兴的意外发现|ser · en · dip · i · ty|the -dip- in the middle and the -ity ending|中间是 -dip-，结尾是 -ity
      happenstance|two people choosing the same train without any plan|a meeting that was neither planned nor fated|a missed letter, a sudden storm and a lucky guess shaping history|happenstance is mere chance; providence is guidance from heaven|happenstance 纯属偶然；providence 是上天的安排|providence is guidance by God or nature, not mere chance|providence 是上天或自然的引导，不是纯粹的偶然|portent is a sign of something to come, not something that just happens by chance|portent 是将来之事的征兆，不是偶然发生的事|hap · pen · stance|happen plus stance|happen 加 stance
      predestined|lovers sure fate decided their meeting before they were born|a hero's death that may be fixed by the gods|a man who thought people make their own fate|predestined is fixed by fate; auspicious is a sign of success to come|predestined 是命中注定；auspicious 是成功的吉兆|auspicious means showing signs of success to come, not already decided by fate|auspicious 指显示出成功的吉兆，不是早已由命运决定|arbitrary means decided by whim or chance, not fixed by fate|arbitrary 指随意或偶然决定的，不是由命运注定的|pre · des · tined|pre- plus destined|pre- 加 destined
      auspicious|a sunny, calm morning as a good sign for a voyage|a lucky day chosen for a wedding|a first loss that was a poor start for a team|auspicious signals success ahead; predestined is fixed by fate|auspicious 预示成功；predestined 由命运注定|predestined means already fixed by fate, not showing a sign that success will come|predestined 指早已由命运注定，不是显示成功的吉兆|prudent means careful and sensible, not a sign of good things ahead|prudent 指谨慎明智，不是好事将至的征兆|aus · pi · cious|the au at the start and the -cious ending|开头是 au，结尾是 -cious
      fluke|a first win that came by luck, not skill|a ball bouncing off a post and into the goal|a shot that came from years of practice, not chance|a fluke is a lucky chance; a mishap is a small bit of bad luck|fluke 是侥幸的好运；mishap 是小小的不幸|mishap is a small bit of bad luck, not a lucky chance|mishap 是小小的不幸，不是侥幸的好运|serendipity is finding something good you were not looking for, not succeeding by chance instead of skill|serendipity 是意外发现好东西，不是靠运气而非本领取得成功|fluke|the u with a silent e, u-e|u 后面跟着不发音的 e
    `,
  },
);

const growing = batch(
  "words-of-growing-up",
  ["Words of Growing Up", "成长的词"],
  ["growing up", "成长"],
  `
  maturity|the state of being fully grown, or of thinking and acting like an adult|成熟|She showed great ___ for a fourteen-year-old, calm and sensible like an adult.|It takes ___ to admit you were wrong and say sorry like a grown-up.|The oak trees reach full ___ only after many years of growing.|autonomy,angst
  naive|showing too little experience of life and too much trust|天真的，幼稚的|It was ___ to believe the stranger's story; she trusted him far too easily.|The ___ boy trusts everyone in the big city and thinks they will all be kind.|Her ___ trust in the advertisement cost her all her savings.|callow,precocious|naively,naivety
  autonomy|the freedom to make your own decisions and govern yourself|自主，自治|Teenagers often want more ___, the freedom to make their own choices, than their parents allow.|After a long struggle, the region won ___ and now governs itself.|With her first job came a new sense of ___: she could decide how to spend her money.|maturity,rite
  rite|a ceremony performed according to a custom, especially to mark an event|仪式|In some cultures, the ___ of passage from childhood into adulthood is marked with songs and gifts.|In the ancient ___ of passage, boys had to spend one night alone in the forest.|Graduation is a modern ___ of passage.|observance,autonomy|rites
  impressionable|easily influenced by others, especially because young|易受影响的|Advertisers target ___ young viewers, who are easily influenced.|At twelve, he was ___ and copied his older cousin in everything.|The film shows how ___ children can be: they copy whatever they see.|precocious,callow
  juvenile|having to do with young people; or childish and silly|青少年的；幼稚的|The ___ court deals with crimes by people under eighteen.|His silly, ___ jokes annoyed everyone at dinner.|Young, ___ birds stay near the nest for weeks.|callow,precocious|juveniles
  callow|young and without experience|稚嫩的，没有经验的|At seventeen he was still ___, with no experience of the world, when he joined the army.|The ___ young reporter, new to the job, made every mistake possible.|She smiled at her ___ younger self in old photographs, so young and so green.|precocious,impressionable
  precocious|having developed abilities or interests unusually early|早熟的|The ___ child was reading novels at five.|At nine, the ___ violinist was already playing concerts.|His ___ questions about the stars surprised the teacher, who expected them from much older students.|impressionable,callow|precociously
  fledgling|a young bird that has just learned to fly; or someone or something new and inexperienced|雏鸟；初出茅庐的人|The ___ fell from the nest but flapped its new wings and flew away safely.|The ___ company, only a month old, had just three workers.|As a ___ writer, she sent her first stories to every magazine.|maturity,toddler|fledglings
  angst|a strong feeling of worry and unhappiness, especially about life or the future|焦虑，忧虑|The novel captures the ___ of being sixteen: worry about who you are and where life is going.|His songs are full of teenage ___ about life and the future.|Behind her smile was a deep ___ about the meaning of her life.|trepidation,autonomy
  `,
  "context-clues",
  {
    intro: t(
      "At sixteen, the **precocious** girl wanted more **autonomy**, yet her diary was full of **angst**; she was still a **fledgling** in the wide world. These ten words help you talk about growing up.",
      "十六岁的她早慧（**precocious**），想要更多自主（**autonomy**），日记里却满是焦虑（**angst**）；在广阔的世界里，她仍是一只雏鸟（**fledgling**）。这十个词帮你谈论成长。",
    ),
    watchOut: {
      meanings: t(
        "Three ways to be young: **naive** trusts *too much*, **callow** lacks *experience*, and **impressionable** is *easily influenced*; **precocious** is the opposite, *ahead* of one's age.",
        "三种“年轻”：**naive** 太容易相信人，**callow** 缺乏经验，**impressionable** 容易受影响；**precocious** 则相反，是超出年龄的早熟。",
      ),
      use: t(
        "**Maturity** is being *grown up*; **autonomy** is the *freedom to decide* for yourself; a **rite** of passage is the *ceremony* that marks the change.",
        "**maturity** 是成熟；**autonomy** 是自己做主的自由；**rite** of passage 是标志转变的仪式。",
      ),
      spelling: t(
        "Watch **rite** (not *right* or *write*), the double *l* of **callow**, the *-dg-* of **fledgling**, the *-nile* of **juvenile** and the double *s* of **impressionable**.",
        "注意 **rite**（不是 right 或 write）、**callow** 的双写 l、**fledgling** 中的 -dg-、**juvenile** 结尾的 -nile，以及 **impressionable** 的双写 s。",
      ),
    },
    notes: `
      maturity|a fourteen-year-old who is calm and sensible like an adult|admitting you were wrong like a grown-up|oak trees fully grown after many years|maturity is being grown up; autonomy is the freedom to decide for yourself|maturity 是成熟；autonomy 是自己做主的自由|autonomy is the freedom to make your own decisions, not being fully grown or acting like an adult|autonomy 是自己做决定的自由，不是长大成熟、像大人一样行事|angst is deep worry about life, not the calm good sense of an adult|angst 是对人生的深深忧虑，不是成年人那种沉稳明理|ma · tur · i · ty|mature drops its e: matur-ity|mature 去掉 e，变成 matur-ity
      naive|believing a stranger's story far too easily|a boy who trusts everyone in a big city|trusting an advertisement and losing all her savings|naive trusts too much; callow simply lacks experience|naive 太容易相信别人；callow 只是缺乏经验|callow describes someone young and lacking experience, not someone who trusts too much|callow 形容年轻而缺乏经验的人，不是太容易轻信的人|precocious means advanced for one's age, not too trusting|precocious 指早熟、超出年龄，不是太轻信|na · ive|the a and i said apart, with no double letter|a 和 i 分开读，没有双写字母
      autonomy|teenagers wanting the freedom to make their own choices|a region winning the right to govern itself|a first job bringing the freedom to decide how to spend money|autonomy is freedom to decide for yourself; maturity is being grown up|autonomy 是自己做主的自由；maturity 是成熟|maturity is being fully grown or acting like an adult, not the freedom to make your own decisions|maturity 是长大成熟、像大人一样行事，不是自己做决定的自由|rite is a ceremony performed by custom, not freedom to govern yourself|rite 是按习俗举行的仪式，不是自我管理的自由|au · ton · o · my|auto- plus -nomy|auto- 加 -nomy
      rite|a ceremony with songs and gifts marking the move from childhood into adulthood|boys spending one night alone in a forest as a ceremony|graduation as a modern ceremony of passage|a rite is one ceremony; an observance is the keeping of a custom or a day|rite 是一场仪式；observance 是对习俗或节日的遵守|observance is the keeping of a law, custom or special day, not one ceremony performed in set steps|observance 是对法律、习俗或节日的遵守，不是按步骤举行的一场仪式|autonomy is the freedom to govern yourself, not a ceremony|autonomy 是自我管理的自由，不是仪式|rite|r-i-t-e, not right or write|拼作 r-i-t-e，不是 right 或 write
      impressionable|young viewers targeted by advertisers because they are easily influenced|a twelve-year-old copying his older cousin in everything|children copying whatever they see|impressionable is easily influenced; precocious is advanced for one's age|impressionable 容易受影响；precocious 是早熟|precocious means developing abilities unusually early, not being easily influenced|precocious 指能力发展得特别早，不是容易受影响|callow means young and without experience, not easily swayed by others|callow 指年轻没经验，不是容易被别人左右|im · pres · sion · a · ble|the double s and the -able ending|双写 s，结尾是 -able
      juvenile|a court for crimes by people under eighteen|silly, childish jokes at dinner|young birds staying near the nest|juvenile is about young people or childishness; callow is about lacking experience|juvenile 指青少年的或幼稚的；callow 指没经验|callow describes a person who lacks experience, not something for young people or childish behavior|callow 形容缺乏经验的人，不是与青少年有关或幼稚的行为|precocious means advanced for one's age, the opposite of childish|precocious 指早熟，与幼稚正相反|ju · ve · nile|the -nile ending, as in the River Nile|结尾是 -nile，同尼罗河 Nile
      callow|a seventeen-year-old with no experience of the world joining the army|a new reporter making every mistake possible|old photographs of a young, green self|callow lacks experience; precocious is skilled early|callow 缺乏经验；precocious 早熟|precocious means skilled unusually early, not young and inexperienced|precocious 指能力早熟，不是年轻没经验|impressionable means easily influenced by others, not simply lacking experience|impressionable 指容易受别人影响，不只是缺乏经验|cal · low|the double l and the -ow ending|双写 l，结尾是 -ow
      precocious|a five-year-old reading novels|a nine-year-old violinist playing concerts|questions about the stars far beyond a child's age|precocious is ahead of one's age; impressionable is easily influenced|precocious 超出年龄；impressionable 容易受影响|impressionable means easily influenced, not advanced for one's age|impressionable 指容易受影响，不是超出年龄的早熟|callow means young and inexperienced, the opposite of being skilled early|callow 指年轻没经验，与能力早熟正相反|pre · co · cious|pre- and the -cious ending|pre- 开头，结尾是 -cious
      fledgling|a young bird flapping new wings after falling from the nest|a company only a month old with three workers|a new writer sending her first stories to magazines|a fledgling is a young bird or a beginner; a toddler is a child learning to walk|fledgling 是雏鸟或新手；toddler 是学步的幼儿|maturity is being fully grown, the opposite of being new and inexperienced|maturity 是成熟，与初出茅庐正相反|toddler is a young child learning to walk, not a young bird or a newcomer|toddler 是学走路的幼儿，不是雏鸟或新手|fledg · ling|the -dg- and the -ling ending|中间是 -dg-，结尾是 -ling
      angst|the worry of a sixteen-year-old about who she is and where life is going|teenage songs full of worry about life and the future|deep unease about the meaning of life behind a smile|angst is deep unease about life; trepidation is fear of one thing ahead|angst 是对人生的深层忧虑；trepidation 是对某件将来之事的害怕|trepidation is fear about one particular thing that may happen, not a deep unease about life itself|trepidation 是对某件可能发生的事的害怕，不是对人生本身的深层不安|autonomy is the freedom to decide for yourself, not worry and unhappiness|autonomy 是自己做主的自由，不是忧虑与不快|angst|ng then st: a-n-g-s-t|先 ng 再 st：a-n-g-s-t
    `,
  },
);

const belonging = batch(
  "words-of-family-and-belonging",
  ["Words of Family and Belonging", "家庭与归属的词"],
  ["families and belonging", "家庭与归属"],
  `
  kinship|a family relationship, or a feeling of being close to someone|亲属关系；亲近感|She felt a strong ___ with the other new students, as close as if they were family.|In the village, ties of ___, who was whose cousin or aunt, decided who could marry whom.|The two writers shared a deep ___ of spirit.|clan,solidarity
  heirloom|a valued object that has been passed down in a family for generations|传家宝|The silver clock is a family ___, passed down from great-grandfather to grandson.|Her wedding ring is a family ___ that has passed through four generations.|The quilt, sewn by her great-great-grandmother, became a treasured ___ handed down to every daughter.|relic,progeny|heirlooms
  estranged|no longer friendly or in contact with someone you were close to|疏远的，不和的|He had been ___ from his brother for ten years; they never spoke.|The story reunites a father and daughter who had been ___ for years.|Her ___ husband, who had moved out after their quarrel, no longer spoke to her.|betrothed,clandestine|estrangement
  alienated|feeling that you do not belong or are cut off from others|疏远的，格格不入的|In the new school, he felt ___ and alone, as if he did not belong.|The novel describes a young woman who feels ___ from everyone around her, like an outsider.|Many workers felt ___ by the new rules, shut out from decisions about their own jobs.|estranged,detached|alienation
  solidarity|unity and support among people who share an aim or a difficulty|团结|The workers showed ___ by striking together, all for one.|Neighbors stood in ___ with the family who had lost their home.|A sense of ___ grew among the passengers stuck together on the train.|kinship,reciprocity
  guardian|a person who is legally responsible for a child who is not their own; or a protector|监护人；守护者|After her parents died, her aunt became her legal ___.|The dog acted as the ___ of the farm, protecting it from foxes.|Each student needs a parent or ___ to sign the form.|matriarch,benefactor|guardians,guardianship
  ancestral|belonging to or inherited from your ancestors|祖先的，祖传的|They visited their ___ village in Italy, where their great-grandparents were born.|The family sold the ___ home that had belonged to them for a hundred years.|The family's ___ customs, handed down from their forefathers, are kept alive at festivals.|archaic,ceremonial
  progeny|a person's children or descendants|子孙，后代|The old king hoped his ___ would rule after him.|The farmer's ___, his children and grandchildren, still work the same land.|All the rose bushes in the garden are the ___ of one plant.|heirloom,clan
  matriarch|a woman who is the head of a family or a group|女家长，女族长|The family ___, the grandmother, made every important decision.|At ninety, she was the ___ of five generations.|The elephant herd follows its oldest female, the ___.|guardian,progeny|matriarchs,patriarch,patriarchs
  clan|a large group of families who share an ancestor|宗族，氏族|Every member of the Scottish ___ wore the same tartan.|Each ___ had its own lands and leader.|The whole ___, dozens of families, gathered for the wedding.|kinship,matriarch|clans
  `,
  "context-clues",
  {
    intro: t(
      "At the reunion, the **matriarch** of the **clan** showed her grandchildren the **heirloom** clock and told them stories of their **ancestral** village. These ten words help you talk about families and the feeling of belonging.",
      "家族聚会上，宗族（**clan**）的女族长（**matriarch**）给孙辈看那座传家宝（**heirloom**）钟，讲起祖先（**ancestral**）村庄的故事。这十个词帮你谈论家庭与归属感。",
    ),
    watchOut: {
      meanings: t(
        "**Estranged** means cut off from *one person* you were close to; **alienated** means feeling you do not belong *anywhere*; **kinship** and **solidarity** are their opposites.",
        "**estranged** 指和某个原本亲近的人断了来往；**alienated** 指觉得自己哪里都不属于；**kinship** 和 **solidarity** 正与它们相反。",
      ),
      use: t(
        "Point to the right thing: an **heirloom** is an *object*, **progeny** are *people* who come after you, a **clan** is a *group of families*, and a **matriarch** is the *woman at its head*.",
        "指对对象：**heirloom** 是物品，**progeny** 是后代的人，**clan** 是一群家庭，**matriarch** 是为首的女性。",
      ),
      spelling: t(
        "Watch the silent *h* and double *o* of **heirloom**, the *-ces-* of **ancestral**, the *ch* said as *k* in **matriarch**, and the *u* after *g* in **guardian**.",
        "注意 **heirloom** 中不发音的 h 和双写 o、**ancestral** 中的 -ces-、**matriarch** 中读作 k 的 ch，以及 **guardian** 中 g 后面的 u。",
      ),
    },
    notes: `
      kinship|a girl feeling as close to new classmates as if they were family|ties of who was whose cousin or aunt deciding marriages in a village|two writers close in spirit|kinship is a family tie or closeness; solidarity is unity in a shared cause|kinship 是亲属关系或亲近感；solidarity 是为共同目标而团结|clan is a large group of families, not the relationship or closeness between people|clan 是由许多家庭组成的大群体，不是人与人之间的关系或亲近感|solidarity is unity among people who share a cause, not a family relationship or a feeling of closeness|solidarity 是有共同目标的人之间的团结，不是亲属关系或亲近感|kin · ship|kin plus -ship|kin 加 -ship
      heirloom|a silver clock passed down from great-grandfather to grandson|a wedding ring that has passed through four generations|a quilt handed down to every daughter in a family|an heirloom is handed down in one family; a relic survives from an old time or a holy place|heirloom 在一个家族里代代相传；relic 是从古代或圣地留存下来的|relic is an object surviving from an old time or a holy place, not one handed down through one family|relic 是从古代或圣地留存下来的物品，不是在一个家族里代代相传的|progeny are a person's children and descendants, not a valued object|progeny 是一个人的子孙后代，不是珍贵的物品|heir · loom|the silent h in heir and the double o in loom|heir 中的 h 不发音，loom 中双写 o
      estranged|two brothers who had not spoken for ten years|a father and daughter brought back together after years apart|a husband who had moved out and no longer spoke to his wife|estranged is cut off from someone you were close to; betrothed is promised to marry them|estranged 是和亲近的人断了来往；betrothed 是和对方订了婚|betrothed means engaged to be married, the opposite of having broken off contact|betrothed 指已订婚，与断绝来往正相反|clandestine means done in secret, not cut off from someone you were once close to|clandestine 指秘密进行的，不是和曾经亲近的人断了来往|es · tranged|es- plus strange, losing one s|es- 加 strange，少一个 s
      alienated|a boy in a new school feeling he does not belong|a young woman feeling like an outsider among everyone around her|workers shut out from decisions about their own jobs|alienated is feeling cut off and not belonging; detached is showing no feeling|alienated 是被排斥、无所归属的感觉；detached 是不流露感情|estranged means no longer in contact with someone you were close to, not feeling that you do not belong|estranged 指和亲近的人不再来往，不是觉得自己不属于这里|detached means showing no feeling, not feeling shut out and alone|detached 指不流露感情，不是觉得被排斥、孤单|a · li · en · at · ed|alien plus -ated|alien 加 -ated
      solidarity|workers striking together, all for one|neighbors standing by a family who lost their home|passengers stuck on a train growing close in their trouble|solidarity is standing together in a shared cause; kinship is a family tie|solidarity 是为共同目标团结；kinship 是亲属关系|kinship is a family relationship or closeness between people, not unity in a shared struggle|kinship 是亲属关系或人与人之间的亲近，不是在共同困境中的团结|reciprocity is giving back in return, not standing together in a shared cause|reciprocity 是有来有往的回报，不是为共同目标站在一起|sol · i · dar · i · ty|solid plus -arity|solid 加 -arity
      guardian|an aunt legally responsible for a girl after her parents died|a dog protecting a farm from foxes|a parent or another responsible adult signing a form|a guardian is responsible for a child or protects something; a matriarch heads a family|guardian 负责照看孩子或守护某物；matriarch 是一家之长|matriarch is a woman who heads a family, not someone legally responsible for a child or protecting something|matriarch 是一家之长的女性，不是孩子的法定监护人或守护者|benefactor is someone who gives money or help, not someone legally responsible for a child|benefactor 是捐钱或施助的人，不是孩子的法定监护人|guard · i · an|the u after g and the -ian ending|g 后面有 u，结尾是 -ian
      ancestral|a village in Italy where great-grandparents were born|a home that belonged to a family for a hundred years|customs handed down from forefathers|ancestral belongs to your ancestors; archaic is simply very old or out of use|ancestral 属于祖先；archaic 只是非常古老或已不再使用|archaic means very old or no longer in use, not belonging to your own ancestors|archaic 指非常古老或已不再使用，不是属于自己祖先的|ceremonial means used in a formal ceremony, not inherited from your ancestors|ceremonial 指用于正式仪式的，不是从祖先那里继承的|an · ces · tral|the c in -ces- and the -tral ending|-ces- 中是 c，结尾是 -tral
      progeny|a king hoping his children would rule after him|a farmer's children and grandchildren still working his land|rose bushes all grown from one plant|progeny are someone's children or descendants; a clan is a large group of families|progeny 是某人的子孙后代；clan 是许多家庭组成的宗族|heirloom is a valued object handed down, not a person's children|heirloom 是代代相传的珍贵物品，不是一个人的子女|clan is a large group of families sharing an ancestor, not one person's own children|clan 是有共同祖先的许多家庭，不是某一个人的子女|prog · e · ny|the soft g and the -eny ending|g 读软音，结尾是 -eny
      matriarch|a grandmother who made every important decision for the family|a ninety-year-old at the head of five generations|the oldest female leading an elephant herd|a matriarch heads a family; a guardian is responsible for a child|matriarch 是一家之长；guardian 负责照看孩子|guardian is someone responsible for a child or protecting something, not the woman who heads a family|guardian 是照看孩子或守护某物的人，不是一家之长的女性|progeny are someone's children, not the head of the family|progeny 是某人的子女，不是一家之长|ma · tri · arch|matri- and the ch said as k in -arch|matri- 开头，-arch 中的 ch 读作 k
      clan|a Scottish family group all wearing the same tartan|family groups each with their own lands and leader|dozens of related families gathering for a wedding|a clan is a large group of families; kinship is the relationship between relatives|clan 是一大群家庭；kinship 是亲属之间的关系|kinship is the relationship between relatives, not a large group of families|kinship 是亲属之间的关系，不是由许多家庭组成的群体|matriarch is the woman who heads a family, not the whole group|matriarch 是一家之长的女性，不是整个群体|clan|one n at the end, not clann|结尾只有一个 n
    `,
  },
);

const courage = batch(
  "words-of-courage-and-fear",
  ["Words of Courage and Fear", "勇气与恐惧的词"],
  ["courage and fear", "勇气与恐惧"],
  `
  fortitude|courage in bearing pain or trouble for a long time|坚韧，刚毅|She bore her long, painful illness with great ___, never complaining.|It took ___ to endure the months of hunger after the flood.|The soldiers showed ___, bearing the cold and pain through the whole winter.|audacity,trepidation
  audacity|a bold willingness to take risks, sometimes in a rude way|大胆，胆大妄为|He had the ___ to ask for a raise on his very first day.|The ___ of the plan, so bold and risky, amazed everyone.|With great ___, she climbed uninvited onto the stage and began to sing.|fortitude,trepidation|audacious
  intrepid|fearless and adventurous|无畏的，勇敢的|The ___ explorer crossed the frozen ice alone, eager for adventure.|The ___ reporter walked fearlessly into the war zone.|Only the most ___ climbers, fearless and adventurous, attempt the north face.|craven,tenacious
  resilience|the ability to recover quickly from difficulties|恢复力，韧性|The town showed great ___, rebuilding quickly after the fire.|Children often have remarkable ___ and bounce back quickly from setbacks.|Her ___ helped her recover after each failure and try again.|audacity,trepidation
  undaunted|not discouraged or frightened by danger or difficulty|无畏的，不气馁的|The sailors, ___ by the storm, kept rowing toward the shore.|She was ___ by her early failures and kept trying.|The ___ team, not discouraged by their loss, began again the next morning.|craven,detached
  trepidation|fear or worry about something that may happen|惶恐，忧惧|She opened the letter with ___, afraid of what it might say.|With some ___, he stepped onto the old, creaking bridge.|The students waited for their results in ___, worried about what they would be.|audacity,fortitude
  valiant|very brave, especially in a difficult situation|英勇的|The firefighters' ___ effort, rushing into the flames, saved the children.|The ___ knight rode out alone to fight the dragon.|Despite their ___ fight against a much stronger team, they lost.|craven,honorable|valiantly
  craven|lacking courage; cowardly|怯懦的，胆小的|The ___ guard ran away at the first sign of danger.|It was a ___ act to blame his friend instead of owning up.|The hero is surrounded by ___ advisors who hide whenever there is danger.|valiant,callow|cravenly
  unflinching|not showing fear or hesitation in the face of danger or difficulty|毫不畏惧的，坚定的|She met his angry stare with a steady, ___ gaze.|The book takes an honest, ___ look at life in prison, hiding nothing.|His ___ courage in the face of the enemy guns inspired the others.|craven,detached|unflinchingly
  mettle|the ability to keep going bravely through difficulty|勇气，毅力|The final race tested every runner's ___.|The young captain proved her ___ by keeping the ship together in the storm.|He showed his ___ by coming back after a terrible injury.|audacity,trepidation
  `,
  "context-clues",
  {
    intro: t(
      "Facing the storm with **fortitude**, the **intrepid** captain proved her **mettle**; her crew, at first full of **trepidation**, were soon **undaunted** too. These ten words help you describe courage and fear.",
      "面对风暴，那位无畏（**intrepid**）的船长以坚韧（**fortitude**）证明了自己的勇气（**mettle**）；船员们起初满心惶恐（**trepidation**），很快也变得毫不气馁（**undaunted**）。这十个词帮你描述勇气与恐惧。",
    ),
    watchOut: {
      meanings: t(
        "Kinds of courage differ: **fortitude** *bears* pain for a long time, **resilience** *bounces back*, and **audacity** *dares* boldly, sometimes rudely.",
        "勇气各有不同：**fortitude** 是长期忍受痛苦，**resilience** 是迅速恢复，**audacity** 是大胆冒险，有时近乎无礼。",
      ),
      use: t(
        "**Valiant** and **intrepid** are brave; **craven** is the opposite, cowardly. Do not mix up **craven** with **callow**, which only means young and inexperienced.",
        "**valiant** 和 **intrepid** 都是勇敢；**craven** 正相反，是怯懦。别把 **craven** 和只表示年轻没经验的 **callow** 弄混。",
      ),
      spelling: t(
        "Watch **mettle** (double *t*, *-tle*, unlike *metal*), the *-ience* of **resilience**, the *au* of **audacity** and **undaunted**, and the *-iant* of **valiant**.",
        "注意 **mettle**（双写 t、结尾 -tle，不同于 metal）、**resilience** 的 -ience、**audacity** 和 **undaunted** 中的 au，以及 **valiant** 的 -iant。",
      ),
    },
    notes: `
      fortitude|a woman bearing a long, painful illness without complaint|months of hunger endured after a flood|soldiers bearing cold and pain through a whole winter|fortitude is patient courage in bearing pain; audacity is bold daring|fortitude 是忍受痛苦的坚毅；audacity 是大胆冒险|audacity is bold daring that takes risks, not patient courage in bearing pain|audacity 是敢于冒险的大胆，不是忍受痛苦的坚毅|trepidation is fear about what may happen, the opposite of calm courage|trepidation 是对可能发生之事的恐惧，与沉着的勇气正相反|for · ti · tude|forti- and the -tude ending|forti- 加 -tude
      audacity|a new worker asking for a raise on his very first day|a plan so bold and risky that it amazed everyone|a woman climbing uninvited onto a stage to sing|audacity is bold daring; fortitude is patient endurance|audacity 是大胆冒险；fortitude 是坚忍不拔|fortitude is patient courage in bearing pain, not bold daring|fortitude 是忍受痛苦的坚毅，不是大胆冒险|trepidation is fear, the opposite of bold daring|trepidation 是恐惧，与大胆冒险正相反|au · dac · i · ty|the au at the start and the -city ending|开头是 au，结尾是 -city
      intrepid|an explorer crossing frozen ice alone, eager for adventure|a reporter walking fearlessly into a war zone|fearless climbers attempting the north face|intrepid is fearless and adventurous; tenacious refuses to give up|intrepid 无畏而爱冒险；tenacious 不肯放弃|craven means cowardly, the opposite of fearless|craven 指怯懦，与无畏正相反|tenacious means holding on and refusing to give up, not fearless and adventurous|tenacious 指紧抓不放、不肯放弃，不是无畏爱冒险|in · trep · id|in- plus trepid, as in trepidation|in- 加 trepid（同 trepidation）
      resilience|a town rebuilding quickly after a fire|children bouncing back quickly from setbacks|a woman recovering after each failure and trying again|resilience is bouncing back quickly; audacity is bold daring|resilience 是迅速恢复；audacity 是大胆冒险|audacity is bold risk-taking, not the ability to bounce back|audacity 是大胆冒险，不是迅速恢复的能力|trepidation is fear about what may happen, not the ability to recover|trepidation 是对可能发生之事的恐惧，不是恢复的能力|re · sil · i · ence|the -ience ending, not -ance|结尾是 -ience，不是 -ance
      undaunted|sailors who kept rowing through a storm|a woman who kept trying after early failures|a team that began again the morning after a loss|undaunted is not discouraged; craven is cowardly|undaunted 不气馁；craven 怯懦|craven means cowardly, the opposite of refusing to be discouraged|craven 指怯懦，与不气馁正相反|detached means showing no feeling, not refusing to be discouraged|detached 指不流露感情，不是不肯气馁|un · daunt · ed|un- plus daunt with au|un- 加带 au 的 daunt
      trepidation|a girl afraid of what a letter might say|a man stepping onto an old, creaking bridge|students worried while waiting for their results|trepidation is fear of what may happen; audacity is bold daring|trepidation 是对可能之事的害怕；audacity 是大胆|audacity is bold daring, not fear of what may happen|audacity 是大胆冒险，不是对可能之事的恐惧|fortitude is calm courage in bearing pain, the opposite of fearful worry|fortitude 是忍受痛苦的沉着勇气，与提心吊胆正相反|trep · i · da · tion|trepid plus -ation|trepid 加 -ation
      valiant|firefighters rushing into flames to save children|a knight riding out alone to fight a dragon|a team fighting bravely against a much stronger side|valiant is very brave; honorable is honest and fair|valiant 英勇；honorable 正直公正|craven means cowardly, the opposite of very brave|craven 指怯懦，与英勇正相反|honorable means honest and fair, not brave in the face of danger|honorable 指诚实公正，不是面对危险时的勇敢|val · iant|the -iant ending with an i, not -ent|结尾是带 i 的 -iant，不是 -ent
      craven|a guard who ran away at the first sign of danger|a boy blaming his friend instead of owning up|advisors who hide whenever there is danger|craven is cowardly; callow is merely young and inexperienced|craven 是怯懦；callow 只是年轻没经验|valiant means very brave, the opposite of cowardly|valiant 指非常勇敢，与怯懦正相反|callow means young and inexperienced, not lacking courage|callow 指年轻没经验，不是缺乏勇气|cra · ven|the -ven ending, as in raven|结尾是 -ven，同 raven
      unflinching|a steady gaze meeting an angry stare|an honest look at prison life that hides nothing|courage that did not pull back from enemy guns|unflinching does not pull back from danger; detached shows no feeling|unflinching 面对危险毫不退缩；detached 不流露感情|craven means cowardly, the opposite of facing danger without fear|craven 指怯懦，与无畏地面对危险正相反|detached means showing no feeling, not facing danger without pulling back|detached 指不流露感情，不是面对危险毫不退缩|un · flinch · ing|un- plus flinch plus -ing|un- 加 flinch 再加 -ing
      mettle|a final race that tested every runner|a young captain keeping her ship together in a storm|a player coming back after a terrible injury|mettle is the strength to keep going bravely; audacity is bold daring|mettle 是坚持到底的勇气；audacity 是大胆冒险|audacity is bold, sometimes rude daring, not the strength to keep going through difficulty|audacity 是大胆、有时无礼的冒险，不是在困难中坚持下去的毅力|trepidation is fear, not the strength to keep going|trepidation 是恐惧，不是坚持下去的毅力|met · tle|the double t and the -tle ending, unlike metal|双写 t，结尾是 -tle，不同于 metal
    `,
  },
);

/** batchesA are the batches of words of the first four units of grade 9. */
export const batchesA: readonly BatchSpec[] = [tone, craft, epic, quests, honor, feuds, fate, growing, belonging, courage];
