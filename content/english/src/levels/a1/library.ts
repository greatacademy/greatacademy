// A1, unit 9: The Library. Library words and books, me, him, her and them, a and the, and short notes judged by a
// model.

import { type CriterionSpec, type Text, type TopicDef, t } from "@ga/content";
import {
  type ChoiceItem,
  choiceGenerator,
  criterionById,
  point,
  type TypedItem,
  typedGenerator,
  type WritingItem,
  writingGenerator,
} from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, interleave, vocabularyTopic, word } from "../words.ts";
import { objectPronounsReplaceNot, theArticleTheTypeNot } from "./mistakes.ts";

const library = vocabularyTopic({
  id: "a1-words-library",
  title: t("The Library", "图书馆"),
  summary: t(
    "Borrowing and returning books, shelves, library cards, due dates, stories and the librarian.",
    "借书和还书、书架、借书证、到期日、故事和图书管理员。",
  ),
  intro: t(
    "At the **library**, I show my **card** and **borrow** two books. The **librarian** says they are **due** in two weeks. These words help you take books home and bring them back on time.",
    "在 **library**（图书馆），我出示 **card**（借书证），**borrow**（借）了两本书。**librarian**（图书管理员）说两周后 **due**（到期）。这些词帮你把书借回家并按时归还。",
  ),
  prerequisites: ["a1-words-schoolwork"],
  words: [
    word(
      "library libraries",
      "a place with many books that you can read or borrow",
      "图书馆",
      "I borrow books from the {library}. | The school {library} has ten thousand books to borrow. | Be quiet in the {library}, please. People are reading and borrowing books.",
      "shop farm",
    ),
    word(
      "borrow borrows borrowed borrowing",
      "to take something for a time and then give it back",
      "借（入）",
      "Can I {borrow} your pen? I'll give it back after class. | I {borrowed} three books from the library.|returned found | You can {borrow} a book for two weeks.",
      "return find",
    ),
    word(
      "return returns returned returning",
      "to give something back; to go back",
      "归还；返回",
      "Please {return} the book to the library by Friday. | I {returned} my books to the library today.|borrowed found | We {return} home at six.",
      "borrow find",
    ),
    word(
      "shelf shelves",
      "a flat board on a wall or in a cupboard for putting things on",
      "架子；书架",
      "Put the book back on the {shelf}. | The comics are on the top {shelf}. | My bookcase has five {shelves} to put books on.|cards stories",
      "card story",
    ),
    word(
      "card cards",
      "a small piece of stiff paper; you need a library one to borrow books",
      "卡片；借书证",
      "You need a library {card} to borrow books. | I made a birthday {card} for Mom and wrote on it. | Show your library {card}, and you can take the books home.",
      "shelf story",
    ),
    word(
      "due",
      "expected or needed by a certain time",
      "到期的",
      "This book is {due} back on May 5th. | When is the homework {due}? — On Monday. | My library books are {due} tomorrow, so I must return them.",
      "quiet free",
    ),
    word(
      "story stories",
      "words that tell what happened to someone, true or made up",
      "故事",
      "Grandpa tells me a {story} every night. | This {story} in my book is about a brave little mouse. | Mom reads me funny {stories} at bedtime.|shelves cards",
      "shelf card",
    ),
    word(
      "librarian librarians",
      "a person who works in a library",
      "图书管理员",
      "Ask the {librarian}. She knows where every book is. | The {librarian} stamps the date in my book. | Our school {librarian} reads stories to us in the library.",
      "library nurse",
    ),
    word(
      "quiet quieter quietest",
      "making little or no noise",
      "安静的",
      "Please be {quiet}. The baby is sleeping. | The library is a {quiet} place where nobody talks. | The classroom is very {quiet} during the test. We can't hear a sound.",
      "loud noisy",
    ),
    word(
      "find finds found finding",
      "to see or get something you were looking for",
      "找到",
      "I can't {find} my library card. Where is it? | She {found} her keys under the sofa.|borrowed needed | Can you help me {find} my lost pen?",
      "borrow need",
    ),
    word(
      "need needs needed needing",
      "to have to have something",
      "需要",
      "I {need} a pencil. Can I borrow one? | Plants {need} water to grow. | Do you {need} help?",
      "find return",
    ),
    word(
      "back",
      "to the place where something was before; the part behind",
      "回到原处；后面",
      "Put the book {back} on the shelf where it was. | I'm going out now, but I'll be {back} in five minutes. | The cat is sleeping at the {back} of the room, behind the sofa.",
      "away front",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Borrow* is taking a book home; *return* is bringing it back to the library. Look for *from* (borrow from) or *to* (return to) and for words like *by Friday*.",
        "*borrow* 是把书借回家，*return* 是把书还回图书馆。留意 *from*（borrow from）和 *to*（return to），以及 *by Friday* 这样的词。",
      ),
      meaning: t(
        "A *library* is the place, and the *librarian* is the person who works there. A book that is *due* on Friday must be back by Friday.",
        "*library* 是地方，*librarian* 是在那里工作的人。书 *due* on Friday，就是星期五前必须还回来。",
      ),
      spell: t(
        "*Library* has r after the b, so not *libary*; *librarian* adds -ian. *Shelf* becomes *shelves* and *story* becomes *stories*.",
        "*library* 的 b 后面有 r，不是 *libary*；*librarian* 是加 -ian。*shelf* 的复数是 *shelves*，*story* 的复数是 *stories*。",
      ),
    },
    notes: `
      library|borrowing books there;ten thousand books to borrow;people reading and borrowing|you borrow books from a library; you buy things in a shop|library 借书；shop 买东西|shop=shop sells things, so you buy there and do not borrow books=shop 卖东西，在那里是买，不是借书;farm=farm has animals and plants, not books to read or borrow=farm 有动物和庄稼，没有可读可借的书|li · brar · y|r after the b, so not *libary*|b 后面有 r，不是 *libary*
      borrow|giving the pen back after class;three books from the library;two weeks|you borrow a thing to give back later; you return it when you give it back|borrow 是借来；return 是还回去|return/returned=return means to give back, but here you get the pen or the books first and give them back later=return 是还，可这里是先拿到笔或书，以后再还;find/found=find means to get something you were looking for, not to have it for a time and give it back=find 是找到，不是借一段时间再还|bor · row|a double r, and ow at the end|双写 r，结尾是 ow
      return|to the library by Friday;to the library today;home at six|you return a book to the library; you borrow it from the library|return 是还给图书馆；borrow 是从图书馆借|borrow/borrowed=borrow goes with *from*, not with *to the library* or *home*=borrow 和 *from* 连用，不和 *to the library* 或 *home* 连用;find/found=find means to get something you were looking for, not to take it to the library or go home=find 是找到，不是送回图书馆或回家|re · turn|*re-* means again, and ur said like *er*|*re-* 表示“再、回”，ur 读作 *er*
      shelf|putting the book back on it;the top one;five in my bookcase|a shelf is a board you put books on; a card is a small piece of paper|shelf 是放书的板子；card 是小卡片|card/cards=card is a small piece of paper, so books do not go on it and a bookcase does not have cards to put books on=card 是小卡片，书不放在卡片上，书架上也没有放书的卡片;story/stories=story is words that tell what happened, not a place to put books=story 是讲发生了什么的话，不是放书的地方|shelf|f changing to -ves in *shelves*|复数 *shelves* 里 f 变成 -ves
      card|a library one to borrow books;a birthday one I wrote on;showing it to take books home|a card is a small piece of stiff paper; a shelf is a board for books|card 是硬纸卡片；shelf 是放书的板子|shelf=shelf is a board on a wall, not something you show, make for Mom or need in your pocket to borrow books=shelf 是墙上的板子，不能出示、送给妈妈，也不是借书要带的东西;story=story is words that tell what happened, and there is no *library story* you show to borrow books=story 是讲发生了什么的话，没有出示后能借书的 *library story*|card|ar said like *car*|ar 读作 *car* 里的音
      due|back on May 5th;homework on Monday;library books tomorrow so I must return them|due tells you when something must be back or done; free means it costs nothing or you have time|due 说的是什么时候必须交还或完成；free 是免费或有空|quiet=quiet means with little noise, not the day a book or homework must be back=quiet 是安静，不说书或作业哪天必须交;free=free means it costs nothing or you have time, not the day you must return or hand in something=free 是免费或有空，不说哪天必须交还|due|ue said like *you*, the same sound as *dew*|ue 读作 *you*，和 *dew* 同音
      story|told by Grandpa every night;about a brave little mouse;funny ones at bedtime|a story tells what happened; a card is a small piece of paper|story 讲发生了什么；card 是小卡片|shelf/shelves=shelf is a board for books, so nobody tells or reads you one=shelf 是放书的板子，没人给你讲或读一个架子;card/cards=card is a small piece of paper, not something Grandpa tells or Mom reads at bedtime about a mouse=card 是小卡片，爷爷不会讲、妈妈睡前也不会读一张关于老鼠的卡片|sto · ry|y changing to -ies in *stories*|复数 *stories* 里 y 变成 -ies
      librarian|a she who knows where every book is;someone who stamps the date;someone reading to us in the library|a librarian is a person; a library is a place|librarian 是人；library 是地方|library=library is a place, so it is not a she, cannot stamp a date and cannot read stories to us=library 是地方，不是“她”，不会盖日期，也不会给我们读故事;nurse=nurse looks after sick people, not books, dates in books or reading in the library=nurse 照顾病人，不管书、不在书上盖日期，也不在图书馆读故事|li · brar · i · an|*library* with y changing to -ian|*library* 的 y 变成 -ian
      quiet|a sleeping baby;nobody talks;we can't hear a sound|quiet means with little noise; loud means with a lot of noise|quiet 是安静；loud 是大声|loud=loud means with a lot of noise, but a sleeping baby, nobody talking and no sound all mean no noise=loud 是声音大，可婴儿在睡、没人说话、听不到声音都是没有噪音;noisy=noisy means full of noise, but here there is no noise at all=noisy 是很吵，可这里一点声音都没有|qui · et|ie in the middle, so not *quite*|中间是 ie，不是 *quite*
      find|a library card I can't see;keys under the sofa;my lost pen|you find something you were looking for; you borrow something to give back|find 是找到；borrow 是借|borrow/borrowed=borrow means to have something for a time and give it back, not to look for your own lost card, keys or pen=borrow 是借来再还，不是找自己丢的卡、钥匙或笔;need/needed=need means to have to have something, and *can't need* or *help me need* is not English=need 是需要，没有 *can't need* 或 *help me need* 的说法|find|i said like *eye*, and the past *found*|i 读作 *eye*，过去式是 *found*
      need|a pencil to borrow;water to grow;help|you need what you must have; you find what you were looking for|need 是需要；find 是找到|find=find means to see something you looked for, and plants do not find water to grow=find 是找到，植物不是“找到”水才长大;return=return means to give back, but you do not give back a pencil you want to borrow, water for plants or help=return 是还，可想借的铅笔、植物要的水和帮助都谈不上“还”|need|a double e|双写 e
      back|the shelf where it was;five minutes after going out;behind the sofa|back means where something was before, or the part behind; front is the part ahead|back 是回到原处或后面；front 是前面|away=away means to another place, not to the place where it was before or coming home soon=away 是去别处，不是回到原处或马上回来;front=front is the part ahead, so *behind the sofa* cannot be the front=front 是前面，*behind the sofa* 不会是前面|back|ck at the end|结尾是 ck
    `,
  },
});

const books = vocabularyTopic({
  id: "a1-words-books",
  title: t("Books", "书"),
  summary: t(
    "Comics, dictionaries, titles and projects; bringing, taking and giving; must and when.",
    "漫画、词典、书名和课题；带来、拿走和给；must 和 when。",
  ),
  intro: t(
    "I **bring** a **dictionary** and two **comics** to school, and I **give** one comic to my friend. These words help you talk about books and pass them to people.",
    "我 **bring**（带来）一本 **dictionary**（词典）和两本 **comics**（漫画）到学校，又 **give**（给）朋友一本漫画。这些词帮你谈论书，并把书递给别人。",
  ),
  prerequisites: ["a1-words-library"],
  words: [
    word(
      "comic comics",
      "a magazine or book of stories told in pictures",
      "漫画",
      "I read {comics} about superheroes. | This {comic} tells its story in funny pictures. | My brother draws his own {comics}.",
      "dictionary title",
    ),
    word(
      "dictionary dictionaries",
      "a book that tells you what words mean",
      "词典",
      "I don't know this word. Let's look in the {dictionary}. | An English-Chinese {dictionary} is very useful. | {Dictionaries} tell you what words mean.",
      "comic title",
    ),
    word(
      "title titles",
      "the name of a book, a movie or a song",
      "标题；书名",
      'The {title} of the book is "The Lost Cat". | What\'s the {title} of your story? | Write the {title} at the top of the page.',
      "project comic",
    ),
    word(
      "about",
      "on the subject of",
      "关于",
      "This book is {about} dinosaurs. | What is your story {about}? — A brave dog. | Tell me {about} your family.",
      "from with",
    ),
    word(
      "project projects",
      "a piece of school work that you do over some time",
      "项目；课题",
      "Our class {project} is about the sea. We made a big poster. | I need books for my science {project}. | We made a poster for our art {project}.",
      "title dictionary",
    ),
    word(
      "bring brings brought bringing",
      "to come with something",
      "带来",
      "Please {bring} your library card when you come here tomorrow. | Can I {bring} a friend with me when I come to your party? | She {brought} a cake here to share with us.|took gave",
      "take give",
    ),
    word(
      "take takes took taken taking",
      "to carry something with you to another place; to get and hold",
      "拿走；带走",
      "Don't forget to {take} your umbrella when you go out. | I {take} the bus to school. | Who {took} my pencil away from my desk?|brought gave",
      "bring give",
    ),
    word(
      "give gives gave given giving",
      "to let someone have something",
      "给",
      "You're next to me. Please {give} me the book. | I {gave} my sister my old bike, so now it's hers.|took brought | {Give} your sister a turn on the swing.",
      "take bring",
    ),
    word(
      "must",
      "used to say that something is necessary",
      "必须",
      "You {must} return the book by Friday. Don't be late! | We {must} be quiet in the library. | You {must} wear a helmet on your bike. It keeps you safe.",
      "can't mustn't",
    ),
    word(
      "when",
      "at what time; at the time that",
      "什么时候；当……时",
      "{When} is the book due? — Next Monday. | I read {when} I'm in bed. | {When} I was little, I loved comics.",
      "where what",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Use *bring* when something comes here with you, *take* when it goes away from here, and *give* when another person gets to keep it. Look for *here*, *come*, *go out* and who has it at the end.",
        "东西跟你来到这里用 *bring*，从这里带走用 *take*，交给别人让他拥有用 *give*。留意 *here*、*come*、*go out*，以及最后东西在谁手里。",
      ),
      meaning: t(
        "A *title* is the name of a book, but a *comic* is a book of stories in pictures. *You must* means it is necessary; *you mustn't* means do not do it.",
        "*title* 是书的名字，*comic* 是用图画讲故事的书。*you must* 表示必须做；*you mustn't* 表示不许做。",
      ),
      spell: t(
        "*Dictionary* ends in -ary and becomes *dictionaries*. *Bring* becomes *brought*, *take* becomes *took* and *give* becomes *gave*.",
        "*dictionary* 以 -ary 结尾，复数是 *dictionaries*。*bring* 的过去式是 *brought*，*take* 是 *took*，*give* 是 *gave*。",
      ),
    },
    notes: `
      comic|superheroes;a story in funny pictures;ones my brother draws|a comic tells a story in pictures; a dictionary tells you what words mean|comic 用图画讲故事；dictionary 解释词义|dictionary/dictionaries=dictionary tells you what words mean, not stories about superheroes in pictures=dictionary 解释词义，不讲画出来的超级英雄故事;title/titles=title is just the name of a book, so you cannot read one about superheroes or tell a story in pictures=title 只是书名，不能读一本关于超级英雄的书名，也不用图画讲故事|com · ic|one m, and c at the end|只有一个 m，结尾是 c
      dictionary|looking up a word I don't know;English-Chinese;telling what words mean|a dictionary tells you what words mean; a comic tells a story in pictures|dictionary 解释词义；comic 用图画讲故事|comic/comics=comic tells a story in pictures, not what a word means=comic 用图画讲故事，不解释词义;title/titles=title is the name of a book, so you cannot look a word up in it=title 是书名，不能在书名里查词|dic · tion · ar · y|-ary at the end, and y changing to -ies|结尾是 -ary，复数 y 变 -ies
      title|the name The Lost Cat;the name of your story;at the top of the page|a title is the name of a book or story; a project is school work|title 是书或故事的名字；project 是课题|project=project is school work you do over time, not a name like *The Lost Cat* written at the top=project 是一段时间做的课题，不是写在顶上的 *The Lost Cat* 这种名字;comic=comic is a book of picture stories, so a book or a story does not have a comic as its name=comic 是图画故事书，书或故事的名字不是漫画|ti · tle|i said like *eye*, and -le at the end|i 读作 *eye*，结尾是 -le
      about|dinosaurs as the subject;a brave dog as the answer;my family|about tells the subject; from tells where something starts|about 说的是内容；from 说的是来自哪里|from=from tells where something comes from, not what a book, a story or a talk is on=from 说来自哪里，不说书、故事或谈话的内容;with=with means together with, not what a book, a story or a talk is on=with 是和……一起，不说书、故事或谈话的内容|a · bout|ou said like *out*|ou 读作 *out*
      project|the sea with a big poster;science books;an art poster|a project is school work over some time; a title is a name|project 是一段时间完成的课题；title 是名字|title=title is the name of a book, not work for which you make a poster or need books=title 是书名，不是要做海报或要用书的功课;dictionary=dictionary tells what words mean, not class work about the sea or art with a poster=dictionary 解释词义，不是关于大海或美术、要做海报的课题|proj · ect|j in the middle, and ct at the end|中间是 j，结尾是 ct
      bring|coming here tomorrow;coming to your party;a cake here to share|bring means you come here with it; take means you go away with it|bring 是带来这里；take 是带离这里|take/took=take is for going away from here, but *come* and *here* call for bring=take 用于从这里带走，可 *come* 和 *here* 要用 bring;give/gave=give means another person gets it, and *give a friend with me* or *gave a cake here* is not English=give 是让别人得到，没有 *give a friend with me* 或 *gave a cake here* 的说法|bring|the past *brought*, with ough|过去式是 *brought*，中间是 ough
      take|an umbrella when I go out;the bus;my pencil away from my desk|take means away from here; bring means to here|take 是带离这里；bring 是带来这里|bring/brought=bring is for coming here, but going out, riding the bus and *away* go away from here=bring 用于来这里，可出门、坐公交车和 *away* 都是离开这里;give/gave=give means another person gets it, but nobody gets the umbrella, the bus or the pencil here=give 是让别人得到，可这里雨伞、公交车和铅笔都没交给别人|take|the past *took*|过去式是 *took*
      give|the book from right next to me;my old bike so now it's hers;a turn on the swing|give means another person gets it; bring means you come here with it|give 是让别人得到；bring 是带来这里|take/took=take means you get it or carry it away, but here the book, the bike and the turn go to another person=take 是自己拿或带走，可这里书、自行车和机会都给了别人;bring/brought=bring means to come here with it, but the book is already next to me, the bike now belongs to her and a turn cannot be carried=bring 是带来这里，可书就在旁边，自行车已经归她了，机会也没法带来|give|a silent e, and the past *gave*|词尾 e 不发音，过去式是 *gave*
      must|returning by Friday without being late;being quiet in the library;a helmet that keeps you safe|must means it is necessary; mustn't means do not do it|must 表示必须；mustn't 表示不许|can't=can't means it is not possible, but you are able to return a book, be quiet and wear a helmet=can't 是做不到，可还书、安静和戴头盔都做得到;mustn't=mustn't means do not do it, but being on time, being quiet and staying safe are things to do=mustn't 是不许做，可按时、安静和注意安全都是该做的|must|u said like the u in *up*|u 读作 *up* 里的 u
      when|next Monday as the answer;bedtime;being little|when asks or tells about a time; where asks or tells about a place|when 问或说时间；where 问或说地点|where=where is about a place, but *next Monday*, *in bed* as a time and *I was little* are about time=where 说地点，可 *next Monday*、在床上的时候和 *I was little* 都是时间;what=what asks about a thing, and *what is the book due* or *what I was little* is not English=what 问东西，没有 *what is the book due* 或 *what I was little* 的说法|when|wh at the start, with a silent h|开头是 wh，h 不发音
    `,
  },
});

// Me, him, her and them.

/** objectForms are a subject pronoun, its object form and the wrong forms a learner writes. */
const objectForms: readonly (readonly [subject: string, object: string, wrong: readonly string[]])[] = [
  ["I", "me", ["I", "my"]],
  ["he", "him", ["he", "his"]],
  ["she", "her", ["she", "hers"]],
  ["we", "us", ["we", "our"]],
  ["they", "them", ["they", "their"]],
];

const objectFrames: readonly string[] = [
  "Can you help ___?",
  "Give the book to ___.",
  "Grandma is waiting for ___.",
  "My dog loves ___.",
  "Please call ___ after school.",
  "Come to the library with ___.",
  "Tom sits next to ___.",
  "Look at ___!",
  "Mom made a cake for ___.",
  "Dad is looking for ___.",
  "Can you see ___?",
  "The teacher asks ___ a question.",
  "Lily writes to ___ every week.",
  "The cat follows ___ home.",
  "Our friends play with ___.",
  "The bus waits for ___.",
  "Anna smiles at ___.",
  "Please tell ___ the answer.",
  "Sit with ___ at lunch.",
  "Read the story to ___.",
];

const objectItems = () =>
  everyPair(objectForms, objectFrames).map(([[subject, object, wrong], frame]) => ({ shown: `${frame} (${subject})`, object, wrong }));

const objectChoiceBank: readonly ChoiceItem[] = objectItems().map(({ shown, object, wrong }): ChoiceItem => [shown, object, wrong]);

/** namedPeople are people and the pronouns that replace them after a verb. */
const namedPeople: readonly (readonly [noun: string, object: string, wrong: string])[] = [
  ["Tom", "him", "he"],
  ["Anna", "her", "she"],
  ["my parents", "them", "they"],
  ["my brother", "him", "he"],
  ["Grandma", "her", "she"],
  ["the children", "them", "they"],
  ["Ben and me", "us", "we"],
];

/** namedThings are things, which them replaces. */
const namedThings: readonly (readonly [noun: string, object: string, wrong: string])[] = [
  ["the books", "them", "they"],
  ["the flowers", "them", "they"],
  ["the photos", "them", "they"],
];

/** replaceFrames fit any person; thingFrames fit any thing. */
const replaceFrames: readonly string[] = [
  "Lily sees {x} every day.",
  "Can you help {x}?",
  "The teacher waits for {x} after school.",
  "Give the cake to {x}.",
  "Mom calls {x} at night.",
  "I often visit {x}.",
  "We play with {x} after school.",
  "Dad drives {x} to the station.",
  "Please ask {x}.",
  "I like {x} a lot.",
  "The dog follows {x}.",
  "Sit next to {x}.",
  "Write a letter to {x}.",
];
const thingFrames: readonly string[] = ["I like {x} a lot.", "Put {x} on the desk.", "Can you find {x}?", "Look at {x}!", "Take {x} home."];

const replaceBank: readonly TypedItem[] = interleave([everyPair(namedPeople, replaceFrames), everyPair(namedThings, thingFrames)]).map(
  ([[noun, object, wrong], frame]): TypedItem => ({
    shown: `${frame.replace("{x}", noun)} (${noun})`,
    accepted: [frame.replace("{x}", object)],
    wrong: [frame.replace("{x}", wrong), frame.replace("{x}", noun)],
    instruction: t(
      "Write the sentence again with a word like him, her or them in place of the words in brackets.",
      "重写句子，用 him、her、them 这样的词代替括号里的词。",
    ),
  }),
);

const objectWhy = (right: string, shown: string) => {
  const sentence = shown.replace(/ \(.*\)$/u, "").replace("___", `*${right}*`);
  const subject = shown.match(/\((.*)\)$/u)?.[1] ?? "";
  return t(
    `The gap comes after a verb or a word like *to* or *with*, so *${subject}* becomes *${right}*: ${sentence}\n\n**Check.** Look directly before the gap: a verb or a preposition (*to, with, for, at*) comes before it, so the object form *${right}* fits, not the subject form *${subject}*.`,
    `空白在动词或 *to*、*with* 这样的词后面，所以 *${subject}* 要变成宾格 *${right}*：${sentence}\n\n**检验。** 看空白前面：前面是动词或介词（*to、with、for、at*），所以要用宾格 *${right}*，不能用主格 *${subject}*。`,
  );
};

/** whyNotObject says what a wrong pronoun shows the learner misread, by the order the forms list it. */
const whyNotObject = (wrong: string, _right: string, _shown: string, position: number): Text =>
  position === 0
    ? t(
        `*${wrong}* is the form that comes before a verb; after a verb or a word like *to*, it changes.`,
        `*${wrong}* 是放在动词前的主格；在动词或 *to* 这样的词后面要变形。`,
      )
    : t(
        `*${wrong}* says whose something is, but the gap here is the person, not an owner.`,
        `*${wrong}* 表示“……的”，可这里的空白指的是人本身，而不是谁的东西。`,
      );

/** objectFor says whom each object pronoun stands for, in every locale. */
const objectFor: Record<string, Text> = {
  him: t("one man or boy", "一个男性"),
  her: t("one woman or girl", "一个女性"),
  them: t("more than one person or thing", "多个人或物"),
  us: t("you and others", "包括自己在内的几个人"),
};

const objectPronouns: TopicDef = {
  id: "object-pronouns",
  title: t("Me, Him, Her and Them", "me、him、her 和 them"),
  summary: t(
    "Can you help me? I like her. Give them to us. After a verb or a word like to and with, I becomes me, he becomes him and they becomes them.",
    "Can you help me? I like her. Give them to us. 在动词或 to、with 这样的词后面，I 变成 me，he 变成 him，they 变成 them。",
  ),
  intro: t(
    "Compare *He knows me* and *I know him*. In English, a pronoun changes form when it moves from before the verb to after the verb or after a word like *to*, *for* or *with*.",
    "比较 *He knows me* 和 *I know him*。在英语里，代词从动词前面移到动词后面，或者移到 *to*、*for*、*with* 后面时，词形会发生变化。",
  ),
  prerequisites: ["my-your-his-her", "a1-words-books"],
  encompasses: [
    { topic: "my-your-his-her", weight: 0.3 },
    { topic: "a1-words-books", weight: 0.2 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("I or me, he or him", "I 还是 me，he 还是 him"),
      t(
        "Before a verb, use a subject pronoun: *I, he, she, we, they*. After a verb or after *to, with, for, at, next to*, use an object pronoun: *me, him, her, us, them*.\n\n*I* like *her*. *She* likes *me*. *Give the book to him.*\n\n> **Watch out.** Do not use a possessive word like *my*, *his* or *our* in an object slot: say *Wait for me*, not *Wait for my* or *Wait for I*.",
        "动词前用主格：*I、he、she、we、they*。动词后或 *to、with、for、at、next to* 后用宾格：*me、him、her、us、them*。\n\n*I* like *her*. *She* likes *me*. *Give the book to him.*\n\n> **注意。** 中文“我”“他”放在哪里都不变，英语却要变形；也不要把表示“……的”的 *my、his、our* 放进宾语位置，要说 *Wait for me*，不要说 *Wait for my* 或 *Wait for I*。",
      ),
      choiceGenerator(t("Choose the word for the gap.", "选出填入空白处的词。"), objectChoiceBank, objectWhy, whyNotObject),
    ),
    point(
      "replace",
      t("A pronoun in place of a name", "用代词代替名字"),
      t(
        "Once we know who or what we are talking about, we can replace the noun after the verb with an object pronoun: *I see Tom every day.* → *I see him every day.* One man or boy: *him*. One woman or girl: *her*. More than one person or thing: *them*. You and others: *us*.\n\n> **Watch out.** Plural things also take *them* after a verb—say *Put them on the desk*, not *Put they on the desk*.",
        "知道说的是谁或什么之后，就可以用宾格代词代替动词后面的名词：*I see Tom every day.* → *I see him every day.* 一个男性：*him*；一个女性：*her*；多个人或物：*them*；包括自己在内的几个人：*us*。\n\n> **注意。** 复数事物在动词后面同样用 *them*——要说 *Put them on the desk*，不要说 *Put they on the desk*。",
      ),
      typedGenerator(
        "sentence",
        t("Use a pronoun.", "使用代词。"),
        replaceBank,
        (right, shown) => {
          const noun = shown.match(/\((.*)\)$/u)?.[1] ?? "";
          const object = [...namedPeople, ...namedThings].find(([n]) => n === noun)?.[1] ?? "";
          return t(
            `*${noun}* is ${objectFor[object]?.en}, and after a verb or a word like *to* that is *${object}*: ${right}\n\n**Check.** Confirm that *${noun}* is completely replaced by *${object}* (not *${object === "him" ? "he" : object === "her" ? "she" : object === "us" ? "we" : "they"}*) and that the rest of the sentence stays unchanged.`,
            `*${noun}* 指${objectFor[object]?.["zh-CN"]}，在动词或 *to* 这样的词后面用 *${object}*：${right}\n\n**检验。** 确认 *${noun}* 已经完整替换成宾格 *${object}*（而不是主格 *${object === "him" ? "he" : object === "her" ? "she" : object === "us" ? "we" : "they"}*），并且句子的其余部分保持不变。`,
          );
        },
        objectPronounsReplaceNot,
      ),
    ),
  ],
};

// A and the.

const articleNouns: readonly string[] = [
  "book",
  "cat",
  "comic",
  "apple",
  "dictionary",
  "umbrella",
  "bag",
  "egg",
  "story",
  "letter",
  "old map",
];
const firstFrames: readonly string[] = [
  "I have ___ {n}.",
  "There is ___ {n} on the table.",
  "Can I borrow ___ {n}?",
  "Here is ___ {n}.",
  "I see ___ {n} in the box.",
  "Anna has ___ {n} in her bag.",
];
const describe: readonly string[] = ["new", "old", "very nice", "mine", "Tom's"];

const an = (noun: string) => (/^[aeiou]/u.test(noun) ? "an" : "a");

/** rotated starts a list at the given place, so two banks open on different sentences. */
const rotated = <T>(items: readonly T[], from: number): readonly T[] => [...items.slice(from), ...items.slice(0, from)];

const firstItems = (from: number) =>
  rotated(everyPair(articleNouns, firstFrames), from).map(([noun, frame]) => ({
    shown: frame.replace("{n}", noun),
    right: an(noun),
    wrong: [an(noun) === "a" ? "an" : "a", "the"],
  }));

const secondItems = (from: number) =>
  rotated(everyPair(articleNouns, describe), from).map(([noun, adjective]) => ({
    shown: `There is ${an(noun)} ${noun} on the desk. ___ ${noun} is ${adjective}.`,
    right: "The",
    wrong: ["A", "An"],
  }));

/** onlyOnes are sentences where the reader knows which one: the only one, the first or best, or one named by more words. */
const onlyOnes: readonly string[] = [
  "___ sun is very hot today.",
  "Look at ___ moon! It's so big tonight.",
  "___ sky is blue and clear.",
  "___ first day of the week is Monday.",
  "Who is ___ best student in your class?",
  "What is ___ title of this book?",
  "Here is ___ book you wanted.",
  "Who is ___ girl next to Tom?",
  "I read in bed in ___ evening.",
  "My sister plays ___ piano.",
  "We are in ___ same class.",
  "What is ___ name of your school?",
  "What's ___ date today?",
  "Z is ___ last letter of the alphabet.",
  "I do my homework in ___ afternoon.",
  "He plays ___ guitar in a band.",
  "Who is ___ tallest boy in the class?",
  "This is ___ last page of the story.",
  "What's ___ price of this comic?",
  "___ second question is difficult.",
  "I get up early in ___ morning.",
  "Where is ___ bag you bought yesterday?",
  "Mars is ___ fourth planet from the sun.",
  "What's ___ answer to question three?",
  "Monday is ___ day after Sunday.",
  "Who wrote ___ story we read in class?",
];

const onlyItems = (from: number, count: number) =>
  onlyOnes.slice(from, from + count).map((shown) => {
    const start = shown.startsWith("___");
    return { shown, right: start ? "The" : "the", wrong: start ? ["A", "An"] : ["a", "an"] };
  });

const articleChoiceBank: readonly ChoiceItem[] = interleave([firstItems(0), secondItems(0), onlyItems(0, 13)]).map(
  ({ shown, right, wrong }): ChoiceItem => [shown, right, wrong],
);

const articleTypedBank: readonly TypedItem[] = interleave([firstItems(30), secondItems(25), onlyItems(13, 13)]).map(
  ({ shown, right, wrong }): TypedItem => ({ shown, accepted: [right], wrong }),
);

/** articleNoun finds the noun after the gap of a sentence. */
const articleNoun = (shown: string) => (shown.split("___ ")[1] ?? "").split(/[ .?!]/u)[0] ?? "";

const articleWhy = (right: string, shown: string) => {
  const sentence = shown.replace("___", `*${right}*`);
  const noun = articleNoun(shown);
  const isThe = right.toLowerCase() === "the";
  const reason = !isThe
    ? t(
        `This is the first time the ${noun} comes up, one of many, so it takes *a* or *an*, and *${noun}* starts with a ${right === "an" ? "vowel" : "consonant"} sound`,
        `这是第一次提到 ${noun}，是许多中的一个，所以用 *a* 或 *an*；*${noun}* 以${right === "an" ? "元音" : "辅音"}开头`,
      )
    : shown.startsWith("There is")
      ? t(
          `The sentence before already named the ${noun}, so now we both know which one and it takes *the*`,
          `前一句已经提到了 ${noun}，双方都知道是哪一个，所以用 *the*`,
        )
      : t(
          "There is only one, or the words around it say which one, so it takes *the*",
          "这样东西独一无二，或者前后的词说明了是哪一个，所以用 *the*",
        );
  const check = !isThe
    ? t(
        `**Check.** Ask two things: is this the first mention (yes → *a/an*), and does *${noun}* begin with a vowel sound (${right === "an" ? "yes → *an*" : "no → *a*"})?`,
        `**检验。** 问自己两个问题：这是不是第一次提到（是 → 用 *a/an*）？*${noun}* 的开头是不是元音（${right === "an" ? "是 → 用 *an*" : "不是 → 用 *a*"}）？`,
      )
    : t(
        `**Check.** Ask whether both speaker and listener know which exact one is meant—here they do, so *${right}* fits.`,
        `**检验。** 问问自己，说话双方是否都知道指哪一个——这里双方都清楚，所以用 *${right}*。`,
      );
  return t(`${reason.en}: ${sentence}\n\n${check.en}`, `${reason["zh-CN"]}：${sentence}\n\n${check["zh-CN"]}`);
};

/** whyNotArticle says what a wrong article shows the learner misread. */
const whyNotArticle = (wrong: string, right: string, shown: string): Text => {
  if (wrong.toLowerCase() === "the")
    return t(
      "*the* is for the one we both know, but this is the first time it comes up.",
      "*the* 用于双方都知道的那一个，可这是第一次提到它。",
    );
  if (right.toLowerCase() !== "the")
    return t(
      `*${wrong}* is the wrong one of the pair: *${articleNoun(shown)}* starts with a ${right === "an" ? "vowel" : "consonant"} sound.`,
      `*${wrong}* 用错了：*${articleNoun(shown)}* 以${right === "an" ? "元音" : "辅音"}开头。`,
    );
  return shown.startsWith("There is")
    ? t(
        `*${wrong}* would mean some other one, but the sentence before already named it.`,
        `*${wrong}* 表示另外的某一个，可前一句已经提到了它。`,
      )
    : t(
        `*${wrong}* is for one of many, but here there is only one, or the words say which one.`,
        `*${wrong}* 用于许多中的一个，可这里只有一个，或者前后的词已经说明了是哪一个。`,
      );
};

const theArticleThe: TopicDef = {
  id: "the-article-the",
  title: t("A and The", "a 和 the"),
  summary: t(
    "I have a book. The book is about cats. A is for one of many, the for the one we both know.",
    "I have a book. The book is about cats. a 指许多中的一个，the 指双方都知道的那一个。",
  ),
  intro: t(
    "Look at the shift in *I found a key. The key is silver.* The first sentence introduces one key out of many with *a*; the second points back to that exact key with *the*.",
    "看这两句的变化：*I found a key. The key is silver.* 第一句用 *a* 引出众多钥匙中的一把，第二句用 *the* 回指刚才那把特定的钥匙。",
  ),
  prerequisites: ["a-and-an", "a1-words-library"],
  encompasses: [
    { topic: "a-and-an", weight: 0.4 },
    { topic: "a1-words-library", weight: 0.2 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("A or the", "a 还是 the"),
      t(
        "*a* or *an*: one of many, the first time you say it (*I have a book*). *the*: the one we both know—because it is the second time you say it (*The book is about cats*), there is only one (*the sun*), or the words around it say which one (*the first day*, *the title of this book*, *the book you wanted*). Fixed phrases like *in the morning* and *play the piano* also take *the*.\n\n> **Watch out.** Do not use *the* on a brand-new, unspecific noun—say *I have a dictionary*, not *I have the dictionary* when the listener has never heard of it.",
        "*a* 或 *an*：许多中的一个，第一次提到时用（*I have a book*）。*the*：双方都知道的那一个——第二次提到时用（*The book is about cats*），独一无二的东西用（*the sun*），或前后的词说明了是哪一个时用（*the first day*、*the title of this book*、*the book you wanted*）。固定搭配 *in the morning*、*play the piano* 也用 *the*。\n\n> **注意。** 中文没有冠词，“书”可以泛指也可以特指；英语里第一次提到泛指的单数名词不要误用 *the*，要说 *I have a dictionary*，而不是 *I have the dictionary*。",
      ),
      choiceGenerator(t("Choose the word for the gap.", "选出填入空白处的词。"), articleChoiceBank, articleWhy, whyNotArticle),
    ),
    point(
      "type",
      t("Writing a, an or the", "写出 a、an 或 the"),
      t(
        "When you type *a*, *an* or *the*, decide in two steps: first ask if the listener already knows which one (*There is an apple on the desk. The apple is red.*), and if not, check the first sound of the next word (*an egg*, *a story*).\n\n> **Watch out.** At the start of a sentence, capitalize the article (*The sky is blue*, not *the sky is blue*), and match *an* to a vowel sound (*an old map*).",
        "输入 *a*、*an* 或 *the* 时分两步判断：先看听话人是否已经知道指哪一个（*There is an apple on the desk. The apple is red.*）；如果是首次提到，再看后面词的开头发音（*an egg*、*a story*）。\n\n> **注意。** 句首的冠词要大写（*The sky is blue*，不要写成 *the sky is blue*），*an* 要根据紧跟其后的词的开头元音来选（*an old map*）。",
      ),
      typedGenerator(
        "word-form",
        t("Type the word for the gap.", "输入填入空白处的词。"),
        articleTypedBank,
        articleWhy,
        theArticleTheTypeNot,
      ),
    ),
  ],
};

// Writing a short note.

const criterion = (id: string): CriterionSpec => {
  const found = criterionById(id);
  if (!found) throw new Error(`unknown criterion ${id}`);
  return found;
};

const oneNote = (model: string) =>
  t(
    `One good note:\n\n> ${model.replace(/\n/gu, "\n> ")}\n\n**Check.** Verify that your note opens with the reader's name, answers every part of the task in two to four clear sentences, and ends with your own name.`,
    `一张好的便条：\n\n> ${model.replace(/\n/gu, "\n> ")}\n\n**检验。** 核对你的便条：开头有没有写收信人称呼，中间有没有用两到四个清楚的句子把题目要求写全，结尾有没有署名。`,
  );

/** tellBank asks for a note that tells someone where you are or what you are doing. */
const tellBank: readonly WritingItem[] = [
  {
    task: "You are at the library after school. Write a note to your mom. Say where you are and when you will be home.",
    model: "Dear Mom,\nI'm at the library with Lily. We are doing our science project. I will be home at six o'clock.\nLove, Anna",
  },
  {
    task: "You went to the park to play football. Write a note to your dad. Say where you are and who you are with.",
    model: "Hi Dad,\nI'm at the park with Tom and Ben. We are playing football. I'll come home before dinner.\nSam",
  },
  {
    task: "You are at your friend's house. Write a note to your brother. Say where you are and ask him to feed the cat.",
    model: "Hi Leo,\nI'm at Mia's house. We are making a cake for her mom. Can you feed the cat at five, please?\nThanks, Kate",
  },
  {
    task: "You took the dog for a walk. Write a note to your grandma. Say where you are and when you will be back.",
    model:
      "Dear Grandma,\nI'm walking the dog in the park. It's sunny today, so we are taking a long walk. We will be back at four.\nLove, Ben",
  },
  {
    task: "You are at a piano lesson. Write a note to your sister. Say where you are and when the lesson ends.",
    model: "Hi Amy,\nI'm at my piano lesson. It ends at half past five. Then I will come home and help you with your homework.\nLucy",
  },
  {
    task: "You went shopping with your aunt. Write a note to your dad. Say where you are and what you are buying.",
    model: "Dear Dad,\nI'm at the shops with Aunt Rose. We are buying new shoes for school. We will be home for dinner.\nLove, Max",
  },
  {
    task: "You are at the swimming pool with your class. Write a note to your mom. Say where you are and what you need.",
    model:
      "Dear Mom,\nI'm at the swimming pool with my class. I forgot my towel. Can you bring it to the pool before four, please?\nLove, Jack",
  },
  {
    task: "You are visiting your grandpa. Write a note to your friend. Say where you are and that you can't play today.",
    model:
      "Hi Tom,\nI'm at my grandpa's house today. He is sick, so I'm helping him. I can't play football today, but I can play on Sunday.\nBen",
  },
  {
    task: "You are at the school club. Write a note to your mom. Say which club you are in and when you will be home.",
    model: "Dear Mom,\nI'm at the chess club after school. We have a big game today! I will be home at five thirty.\nLove, Mia",
  },
  {
    task: "You are at the doctor's with your dad. Write a note to your teacher. Say where you are and that you will be late.",
    model:
      "Dear Ms. Green,\nI'm at the doctor's with my dad this morning. I will be late for school. I will come at eleven o'clock.\nThank you, Leo",
  },
  {
    task: "You went to the shop to buy bread. Write a note to your sister. Say where you are and ask her to wait for you.",
    model: "Hi Emma,\nI'm at the shop. I'm buying bread and milk for breakfast. Please wait for me. I'll be back in ten minutes.\nNora",
  },
  {
    task: "You are at a friend's birthday party. Write a note to your parents. Say where you are and how you will get home.",
    model: "Dear Mom and Dad,\nI'm at Lily's birthday party. It's a lot of fun! Lily's dad will drive me home at seven.\nLove, Anna",
  },
];

/** askBank asks for a note that asks for something or thanks someone. */
const askBank: readonly WritingItem[] = [
  {
    task: "Your friend gave you a book for your birthday. Write a note to thank her and say what you like about it.",
    model:
      "Dear Lily,\nThank you for the book! I love stories about animals, and this one is very funny. I read it every night.\nLove, Anna",
  },
  {
    task: "You want to borrow your friend's dictionary for your English homework. Write a note to ask for it.",
    model:
      "Hi Tom,\nCan I borrow your dictionary, please? I need it for my English homework. I will give it back to you on Friday.\nThanks, Ben",
  },
  {
    task: "Your neighbor fed your cat when you were away. Write a note to thank him.",
    model:
      "Dear Mr. Brown,\nThank you for feeding our cat last week. She is very happy and healthy. Here are some cookies for you.\nThe Lee family",
  },
  {
    task: "You need help with your math homework. Write a note to your older brother to ask him.",
    model:
      "Hi Leo,\nCan you help me with my math homework tonight? The questions on page ten are very difficult. I will wash the dishes for you!\nSam",
  },
  {
    task: "Your teacher helped you after class. Write a note to thank her.",
    model: "Dear Ms. Green,\nThank you for helping me after class. Now I understand the present simple. The test was easy!\nFrom Mia",
  },
  {
    task: "You want your friend to bring his football to school tomorrow. Write a note to ask him.",
    model: "Hi Ben,\nCan you bring your football to school tomorrow, please? We can play after lunch. My ball is broken.\nTom",
  },
  {
    task: "Your grandma made you a hat. Write a note to thank her and say when you wear it.",
    model:
      "Dear Grandma,\nThank you for the beautiful hat. Blue is my favorite color! I wear it every day when I walk to school.\nLove, Emma",
  },
  {
    task: "You want to use your sister's computer for your project. Write a note to ask her.",
    model:
      "Hi Amy,\nCan I use your computer this afternoon, please? I need it for my history project. I will be careful with it.\nThanks, Jack",
  },
  {
    task: "Your friend's mom drove you home after a party. Write a note to thank her.",
    model:
      "Dear Mrs. Park,\nThank you for driving me home after the party. It was very kind of you. I had a lot of fun with Jun.\nFrom Lucy",
  },
  {
    task: "You want the librarian to keep a book for you until Monday. Write a note to ask her.",
    model:
      'Dear Ms. White,\nCan you keep the book "The Lost Cat" for me, please? I don\'t have my library card today. I will come on Monday.\nThank you, Max',
  },
  {
    task: "Your classmate lent you a pencil when you forgot yours. Write a note to thank him.",
    model: "Hi Ben,\nThank you for the pencil this morning. I forgot my pencil case at home. Here it is. You are a good friend!\nNora",
  },
  {
    task: "You want your dad to buy milk on his way home. Write a note to ask him.",
    model:
      "Dear Dad,\nCan you buy some milk on your way home, please? There isn't any milk in the kitchen. We need it for breakfast.\nLove, Kate",
  },
];

const noteCriteria = ["a1-note-purpose", "a1-reader-and-name", "a1-sentences"];

const writingAShortNote: TopicDef = {
  id: "writing-a-short-note",
  title: t("Writing a Short Note", "写便条"),
  summary: t(
    "Write a note of two to four sentences for a reason the task gives: to say where you are, to ask for something, or to thank someone.",
    "根据任务写一张两到四句话的便条：说你在哪里、请人帮忙或者向人道谢。",
  ),
  intro: t(
    "A short note gets one message across quickly: *Hi Dad, I'm at the bookstore with Leo. I will be home for dinner. Sam.* Opening with a greeting and closing with your name makes the note complete.",
    "短便条用来快速交代一件事：*Hi Dad, I'm at the bookstore with Leo. I will be home for dinner. Sam.* 开头有称呼、结尾有署名，便条才完整。",
  ),
  prerequisites: ["joining-with-and-but-or", "writing-capital-letters-for-names", "object-pronouns"],
  encompasses: [
    { topic: "joining-with-and-but-or", weight: 0.2 },
    { topic: "writing-capital-letters-for-names", weight: 0.2 },
  ],
  xp: 25,
  strand: "writing",
  criteria: noteCriteria.map(criterion),
  knowledgePoints: [
    point(
      "telling",
      t("A note that tells", "告知的便条"),
      t(
        "A note starts with the reader's name (*Dear Mom,* or *Hi Tom,*), says what the reader needs to know in two to four short sentences, and ends with your name.\n\nTo say where you are: *I'm at the library with Lily.* What you are doing: *We are doing our project.* When you'll be back: *I will be home at six o'clock.*\n\n> **Watch out.** Do not forget the greeting at the top or your name at the bottom—without them, the reader cannot tell who the note is for or who wrote it.",
        "便条以收信人的称呼开头（*Dear Mom,* 或 *Hi Tom,*），用两到四个短句说清对方需要知道的事，最后写上自己的名字。\n\n说你在哪里：*I'm at the library with Lily.* 在做什么：*We are doing our project.* 什么时候回来：*I will be home at six o'clock.*\n\n> **注意。** 别漏掉开头的称呼和结尾的署名——没有它们，对方看不出便条是写给谁、谁写的。",
      ),
      writingGenerator(
        t(
          "Write a short note in English: two to four sentences, with the reader's name at the start and your name at the end.",
          "用英语写一张便条：两到四句话，开头写收信人的称呼，结尾写你的名字。",
        ),
        tellBank,
        noteCriteria,
        { minWords: 15, maxChars: 500 },
        oneNote,
      ),
    ),
    point(
      "asking-and-thanking",
      t("A note that asks or thanks", "请求或感谢的便条"),
      t(
        "To ask, use *Can you...?* or *Can I...?* and *please*, and say why: *Can I borrow your dictionary, please? I need it for my homework.*\n\nTo thank, say what for and add one more sentence: *Thank you for the book! I love stories about animals.*\n\n> **Watch out.** Remember the question mark after *Can you...?* or *Can I...?*, and write at least two full sentences rather than a single phrase.",
        "请求时用 *Can you...?* 或 *Can I...?* 加 *please*，并说明原因：*Can I borrow your dictionary, please? I need it for my homework.*\n\n感谢时说明为什么感谢，再多写一句：*Thank you for the book! I love stories about animals.*\n\n> **注意。** *Can you...?* 或 *Can I...?* 结尾别忘加问号，并且至少写两句完整的句子，不要只写一个短语。",
      ),
      writingGenerator(
        t(
          "Write a short note in English: two to four sentences, with the reader's name at the start and your name at the end.",
          "用英语写一张便条：两到四句话，开头写收信人的称呼，结尾写你的名字。",
        ),
        askBank,
        noteCriteria,
        { minWords: 15, maxChars: 500 },
        oneNote,
      ),
    ),
  ],
};

/** topics are the topics of the unit The Library. */
export const topics: readonly TopicDef[] = [library.topic, books.topic, objectPronouns, theArticleThe, writingAShortNote];

/** vocabulary are the words the unit The Library teaches. */
export const vocabulary: readonly WordBatch[] = [library.batch, books.batch];
