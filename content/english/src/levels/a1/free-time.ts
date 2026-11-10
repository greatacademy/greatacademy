// A1, unit 7: Free Time. Sports and music, hobbies, parties, verbs for saying and thinking, like and love with -ing,
// and sentences about what people like.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { pairUp, vocabularyTopic, word } from "../words.ts";

const sportsAndMusic = vocabularyTopic({
  id: "a1-words-sports-and-music",
  title: t("Sports and Music", "运动与音乐"),
  summary: t(
    "Sports, games, balls, music and songs, dancing, singing, riding a bike, football, movies and films.",
    "运动、游戏、球、音乐和歌曲，跳舞、唱歌、骑自行车、足球、电影和影片。",
  ),
  prerequisites: ["a1-words-how-often"],
  words: [
    word(
      "sport sports",
      "a game like football or swimming that you play for exercise",
      "运动；体育",
      "My favorite {sport} is swimming.|song movie | Do you play any {sports}? — Yes, basketball.|songs movies | Football is a team {sport}.|song movie",
      "song movie",
    ),
    word(
      "game games",
      "something you play, with rules, to have fun",
      "游戏；比赛",
      "Let's play a {game}! — Okay, what game?|song ball | We won the {game} three to one.|song bike | I like computer {games}.|songs bikes",
      "song ball",
    ),
    word(
      "ball balls",
      "a round thing you throw, kick or hit in games",
      "球",
      "Kick the {ball} to me!|bike song | A football is a big round {ball}.|bike movie | The dog is playing with a {ball}.|song movie",
      "bike song",
    ),
    word(
      "music",
      "sounds that people sing or play on instruments",
      "音乐",
      "I listen to {music} on my phone.|movies games | What kind of {music} do you like? — Pop!|sport ball | We have {music} class on Friday.|ball bike",
      "sport game",
    ),
    word(
      "song songs",
      "a short piece of music with words that you sing",
      "歌曲",
      "Let's sing a {song}!|game ball | This is my favorite {song}. Listen!|ball sport | We learn English {songs} at school.|balls bikes",
      "game movie",
    ),
    word(
      "dance dances danced dancing",
      "to move your body to music",
      "跳舞",
      "Can you {dance}? — Yes, I love dancing!|ride sing | We {danced} at the party all night.|rode sang | She is {dancing} to the music.|riding singing",
      "ride sing",
    ),
    word(
      "sing sings sang sung singing",
      "to make music with your voice",
      "唱歌",
      'Birds {sing} in the morning.|ride dance | Let\'s {sing} a song for Grandma.|ride dance | She {sang} "Happy Birthday" at the party.|rode danced',
      "ride dance",
    ),
    word(
      "ride rides rode ridden riding",
      "to sit on a bike or a horse and move on it",
      "骑",
      "I {ride} my bike to school.|sing dance | Can you {ride} a horse?|sing dance | We are {riding} our bikes in the park.|singing dancing",
      "sing dance",
    ),
    word(
      "bike bikes",
      "a thing with two wheels that you ride",
      "自行车",
      "I ride my {bike} to school.|ball song | My {bike} is red and has a bell.|ball song | We left our {bikes} outside the shop.|balls songs",
      "ball song",
    ),
    word(
      "football",
      "a game where two teams kick a ball into a goal; also the ball",
      "足球",
      "We play {football} after school.|music movie | Kick the {football} into the goal!|music song | Our {football} team has eleven players.|music movie",
      "basketball music",
    ),
    word(
      "basketball",
      "a game where two teams throw a ball through a high ring",
      "篮球",
      "In {basketball}, you throw the ball into a high basket.|football music | Tall people are often good at {basketball}.|music movie | The {basketball} game starts at six.|music song",
      "football music",
    ),
    word(
      "movie movies",
      "a story you watch on a screen",
      "电影",
      "Let's watch a {movie} tonight.|song sport | This {movie} is very funny.|ball sport | We go to the {movies} on Saturday.|balls sports",
      "song game",
    ),
    word(
      "film films",
      "a story told in moving pictures that you watch on a screen",
      "电影",
      "Let's watch a {film} on TV this evening.|song bike | This {film} is about a girl and her horse.|ball bike | I like {films} with lots of songs and dancing.|bikes balls",
      "fill farm",
      "movie",
    ),
  ],
});

const hobbies = vocabularyTopic({
  id: "a1-words-hobbies",
  title: t("Hobbies", "爱好"),
  summary: t(
    "Guitar, piano, painting, photos, teams and parks, fun and free time.",
    "吉他、钢琴、画画、照片、队伍和公园，乐趣和空闲时间。",
  ),
  prerequisites: ["a1-words-sports-and-music"],
  words: [
    word(
      "hobby hobbies",
      "something you like to do in your free time",
      "爱好",
      "My {hobby} is painting.|team park | What are your {hobbies}? — Reading and chess.|teams parks | Collecting stamps is a fun {hobby}.|team park",
      "team park",
    ),
    word(
      "guitar guitars",
      "a music instrument with six strings that you play with your fingers",
      "吉他",
      "My brother plays the {guitar} in a band.|camera photo | A {guitar} has six strings.|camera park | He is singing and playing his {guitar}.|camera photo",
      "piano camera",
    ),
    word(
      "piano pianos",
      "a big music instrument with black and white keys",
      "钢琴",
      "I play the {piano}. I practice every day.|camera photo | A {piano} has black and white keys.|camera team | There is a {piano} in the music room.|camera park",
      "guitar camera",
    ),
    word(
      "paint paints painted painting",
      "to make a picture with colors and a brush",
      "画；刷漆",
      "I like to {paint} flowers.|free fun | We {painted} the wall blue.|took rode | She is {painting} a picture of the sea.|taking riding",
      "free fun",
    ),
    word(
      "photo photos",
      "a picture you take with a camera or a phone",
      "照片",
      "Can I take a {photo} of you?|camera team | Look at this {photo} of my family.|camera park | I take {photos} of birds.|cameras teams",
      "camera piano",
    ),
    word(
      "camera cameras",
      "a thing you take photos with",
      "相机",
      "I take photos with my {camera}.|photo piano | This {camera} is new. It takes good pictures.|photo team | Smile at the {camera}!|photo guitar",
      "photo piano",
    ),
    word(
      "fun",
      "something you enjoy; enjoyable",
      "乐趣；有趣的",
      "The party was a lot of {fun}!|free together | Have {fun} at the zoo!|free favorite | Swimming is {fun}.|together favorite",
      "free together",
    ),
    word(
      "together",
      "with each other",
      "一起",
      "Let's play {together}!|free favorite | My sister and I walk to school {together}.|free fun | We always eat dinner {together}.|free favorite",
      "free fun",
    ),
    word(
      "favorite favorites",
      "liked more than any other",
      "最喜欢的",
      "Blue is my {favorite} color.|free together | What is your {favorite} food? — Dumplings!|free together | This song is my {favorite}.|free together",
      "free together",
    ),
    word(
      "team teams",
      "a group of people who play or work together",
      "队；团队",
      "There are eleven players in a football {team}.|hobby park | Our {team} won the game!|hobby park | Which {team} do you like? — The red team.|hobby camera",
      "hobby park",
    ),
    word(
      "park parks",
      "a big public garden with grass and trees where people play",
      "公园",
      "We play football in the {park}.|team hobby | There are many trees in the {park}.|team photo | Let's walk the dog in the {park}.|team hobby",
      "team hobby",
    ),
    word(
      "free freer freest",
      "not busy; also not costing money",
      "空闲的；免费的",
      "Are you {free} on Saturday? — Yes, I have no plans.|favorite together | In my {free} time, I read comics.|favorite together | The museum is {free}. You don't pay.|together favorite",
      "fun favorite",
    ),
  ],
});

const parties = vocabularyTopic({
  id: "a1-words-parties",
  title: t("Parties", "聚会"),
  summary: t(
    "Parties, gifts, invitations, concerts and clubs, enjoying and laughing, chess, drums and kites.",
    "聚会、礼物、邀请、音乐会和社团，享受和大笑，象棋、鼓和风筝。",
  ),
  prerequisites: ["a1-words-hobbies"],
  words: [
    word(
      "party parties",
      "a time when people meet to eat, talk, dance and have fun",
      "聚会；派对",
      "Come to my birthday {party} on Saturday!|chess kite | We had a big {party} for the New Year.|chess drum | There are lots of {parties} in December.|chesses kites",
      "concert club",
    ),
    word(
      "gift gifts",
      "something you give to someone, often for a birthday",
      "礼物",
      "This {gift} is for you. Happy birthday!|club chess | I got many {gifts} for my birthday.|clubs chess | Thank you for the lovely {gift}!|club chess",
      "club kite",
    ),
    word(
      "invite invites invited inviting",
      "to ask someone to come to a party or an event",
      "邀请",
      "I want to {invite} all my friends to my party.|laugh enjoy | Thank you for {inviting} me!|laughing enjoying | She {invited} ten people to her birthday.|laughed enjoyed",
      "laugh enjoy",
    ),
    word(
      "concert concerts",
      "a show where people play or sing music",
      "音乐会",
      "We went to a {concert}. The band was great!|club chess | The school {concert} is on Friday. I'm singing!|chess kite | Tickets for the {concert} are ten dollars.|chess kite",
      "club party",
    ),
    word(
      "club clubs",
      "a group of people who meet to do something they like",
      "俱乐部；社团",
      "I'm in the chess {club} at school.|concert gift | The music {club} meets on Tuesday.|gift kite | Which {clubs} are you in?|gifts kites",
      "concert gift",
    ),
    word(
      "enjoy enjoys enjoyed enjoying",
      "to like doing something",
      "享受；喜欢",
      "Did you {enjoy} the party? — Yes, it was fun!|invite laugh | I {enjoy} reading in bed.|invite laugh | {Enjoy} your lunch!|Invite Laugh",
      "invite laugh",
    ),
    word(
      "laugh laughs laughed laughing",
      "to make a sound because something is funny",
      "笑；大笑",
      "The movie was so funny. We {laughed} a lot!|invited enjoyed | Why are you {laughing}? What's funny?|inviting enjoying | Don't {laugh} at me!|invite enjoy",
      "invite enjoy",
    ),
    word(
      "chess",
      "a game for two people on a board with black and white squares",
      "国际象棋",
      "Grandpa and I play {chess} on Sundays.|kite drum | In {chess}, the king is the most important piece.|kite drum | {Chess} is a game for two players.|Kite Drum",
      "kite drum",
    ),
    word(
      "drum drums",
      "a music instrument that you hit",
      "鼓",
      "He plays the {drums} in the school band.|kites gifts | Bang the {drum}! Boom, boom!|kite gift | The {drum} is very loud.|kite chess",
      "kite chess",
    ),
    word(
      "kite kites",
      "a light toy on a long string that flies in the wind",
      "风筝",
      "We fly a {kite} on windy days.|drum chess | My {kite} is high in the sky!|drum gift | There are many {kites} in the park today.|drums gifts",
      "drum gift",
    ),
  ],
});

const actions = vocabularyTopic({
  id: "a1-words-actions",
  title: t("Saying and Thinking", "说和想"),
  summary: t(
    "Say, tell, think, hear, talk, stay, hope, let, begin, end, wish and move.",
    "say、tell、think、hear、talk、stay、hope、let、begin、end、wish 和 move。",
  ),
  prerequisites: ["a1-words-little-words-1"],
  words: [
    word(
      "say says said saying",
      "to speak words",
      "说",
      'What did you {say}? I can\'t hear you.|tell talk | {Say} "thank you" to Grandma.|Tell Talk | She {said} "hello" to me.|told talked',
      "tell talk",
    ),
    word(
      "tell tells told telling",
      "to give information to someone with words",
      "告诉；讲",
      "Can you {tell} me the time, please?|say talk | Grandpa {tells} us stories at night.|says talks | {Tell} me about your day.|Say Hope",
      "say talk",
    ),
    word(
      "think thinks thought thinking",
      "to use your mind; to believe",
      "想；认为",
      "{Think} before you speak.|Hear Hope | What do you {think} of my new dress? — It's pretty!|hear say | Let me {think} about it.|hear hope",
      "hear hope",
    ),
    word(
      "hear hears heard hearing",
      "to know a sound with your ears",
      "听见",
      "Can you {hear} the birds?|think say | Speak louder, please. I can't {hear} you.|think say | I {heard} a noise in the kitchen.|thought said",
      "think say",
    ),
    word(
      "talk talks talked talking",
      "to speak with someone",
      "谈话；说话",
      "We {talk} on the phone every evening.|say tell | Please don't {talk} in the library.|say tell | Who are you {talking} to?|saying telling",
      "say tell",
    ),
    word(
      "stay stays stayed staying",
      "to not leave a place",
      "停留；待",
      "{Stay} here. I'll be back soon.|Move Begin | We {stayed} at Grandma's house for a week.|moved began | I'm sick, so I {stay} at home today.|move begin",
      "move begin",
    ),
    word(
      "hope hopes hoped hoping",
      "to want something to happen",
      "希望",
      "I {hope} you feel better soon!|let stay | We {hope} it's sunny tomorrow.|let stay | I {hope} to see you again.|think hear",
      "wish think",
    ),
    word(
      "let lets letting",
      "to allow someone to do something",
      "让；允许",
      "{Let} me see your photo!|Hope Wish | My mom {lets} me stay up late on Fridays.|hopes wishes | Please {let} me help you.|hope wish",
      "hope wish",
    ),
    word(
      "begin begins began begun beginning",
      "to start",
      "开始",
      "The class {begins} at nine and ends at ten.|stays moves | Let's {begin}. Open your books.|end wish | The movie {began} at seven.|stayed moved",
      "end stay",
    ),
    word(
      "end ends ended ending",
      "to finish; the last part of something",
      "结束；结尾",
      "The movie {ends} at nine. Then we go home.|begins stays | The story has a happy {end}.|wish hope | School {ended} at three today.|began stayed",
      "begin stay",
    ),
    word(
      "wish wishes wished wishing",
      "to want something that may not happen; what you want",
      "希望；愿望",
      "Make a {wish} and blow out the candles!|hope move | I {wish} I could fly!|hope let | Best {wishes} for the New Year!|hopes moves",
      "hope think",
    ),
    word(
      "move moves moved moving",
      "to go to another place; to change the place of something",
      "移动；搬家",
      "Don't {move}! There's a bee on your arm.|stay begin | We {moved} to a new apartment last year.|stayed began | Can you help me {move} this table?|stay begin",
      "stay begin",
    ),
  ],
});

// Like and love with -ing.

/** likers are a subject and its form of like, love or enjoy. */
const likers: readonly (readonly [subject: string, verb: string, enjoy: boolean])[] = [
  ["I", "like", false],
  ["She", "likes", false],
  ["They", "love", false],
  ["He", "loves", false],
  ["We", "enjoy", true],
  ["Tom", "enjoys", true],
  ["My sister", "likes", false],
  ["My parents", "love", false],
];

/** pastimes are an activity: the verb, its -ing form, a misspelling and the rest. */
const pastimes: readonly (readonly [verb: string, ing: string, misspelled: string, rest: string])[] = [
  ["swim", "swimming", "swiming", ""],
  ["dance", "dancing", "danceing", ""],
  ["ride", "riding", "rideing", " a bike"],
  ["sing", "singing", "singging", " songs"],
  ["play", "playing", "plaing", " chess"],
  ["paint", "painting", "paintting", " pictures"],
  ["read", "reading", "readding", " books"],
  ["watch", "watching", "watchhing", " movies"],
  ["take", "taking", "takeing", " photos"],
  ["run", "running", "runing", " in the park"],
  ["fly", "flying", "fliing", " kites"],
  ["cook", "cooking", "cookking", " for my family"],
  ["draw", "drawing", "drawwing", " animals"],
];

const likeItems = (from: number, count: number) =>
  pairUp(from + count, likers, pastimes)
    .slice(from)
    .map(([[subject, verb, enjoy], [base, ing, misspelled, rest]]) => ({ subject, verb, enjoy, base, ing, misspelled, rest }));

const likeChoiceBank: readonly ChoiceItem[] = likeItems(0, 44).map(
  ({ subject, verb, base, ing, rest }): ChoiceItem => [
    `${subject} ${verb} ___${rest}. (${base})`,
    ing,
    [
      base,
      base.endsWith("y") && !base.endsWith("ay") ? `${base.slice(0, -1)}ies` : /(ch|sh|s|x|o)$/u.test(base) ? `${base}es` : `${base}s`,
    ],
  ],
);

const likeSpellBank: readonly TypedItem[] = likeItems(44, 39).map(
  ({ subject, verb, base, ing, misspelled, rest }): TypedItem => ({
    shown: `${subject} ${verb} ___${rest}. (${base})`,
    accepted: [ing],
    wrong: [misspelled, base],
  }),
);

const likeFixBank: readonly TypedItem[] = likeItems(83, 39).map(
  ({ subject, verb, enjoy, base, ing, rest }): TypedItem => ({
    shown: `${subject} ${verb} ${base}${rest}.`,
    accepted: [enjoy ? `${subject} ${verb} ${ing}${rest}.` : `${subject} ${verb} [${ing}|to ${base}]${rest}.`],
    canonical: `${subject} ${verb} ${ing}${rest}.`,
    wrong: [
      `${subject} ${verb} ${base}${rest}.`,
      ...(enjoy ? [`${subject} ${verb} to ${base}${rest}.`] : [`${subject} ${verb} ${base}s${rest}.`]),
    ],
  }),
);

const likeAndLove: TopicDef = {
  id: "like-and-love-with-ing",
  title: t("Like Swimming, Love Dancing", "like swimming、love dancing"),
  summary: t(
    "I like swimming. She loves dancing. After like, love and enjoy, a verb takes -ing.",
    "I like swimming. She loves dancing. 在 like、love 和 enjoy 后面，动词用 -ing 形式。",
  ),
  prerequisites: ["present-simple", "a1-words-sports-and-music"],
  encompasses: [
    { topic: "present-simple", weight: 0.2 },
    { topic: "a1-words-sports-and-music", weight: 0.3 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("A verb after like", "like 后面的动词"),
      t(
        "After *like*, *love* and *enjoy*, a second verb takes *-ing*: *I like swimming. She loves dancing. We enjoy playing chess.*\n\nThe second verb never takes *-s*: not *She likes dances*.",
        "在 *like*、*love* 和 *enjoy* 后面，第二个动词用 *-ing* 形式：*I like swimming. She loves dancing. We enjoy playing chess.*\n\n中文说“我喜欢游泳”，两个动词直接连在一起；英语不能说 *I like swim*，第二个动词也不能加 *-s*。",
      ),
      choiceGenerator(t("Choose the word for the gap.", "选出填入空白处的词。"), likeChoiceBank, (right, shown) => {
        const sentence = shown.replace(/ \(.*\)$/u, "").replace("___", `*${right}*`);
        return t(sentence, `${sentence}（like、love、enjoy 后面的动词用 -ing）`);
      }),
    ),
    point(
      "spell",
      t("Spelling the -ing form", "拼写 -ing 形式"),
      t(
        "Add *-ing*: *read → reading*. Drop a last *e*: *dance → dancing*, *ride → riding*. Double one last consonant after one short vowel: *swim → swimming*, *run → running*.",
        "直接加 *-ing*：*read → reading*。以不发音的 *e* 结尾的去 *e*：*dance → dancing*、*ride → riding*。以一个短元音加一个辅音结尾的双写辅音：*swim → swimming*、*run → running*。",
      ),
      typedGenerator("word-form", t("Type the verb with -ing.", "输入动词的 -ing 形式。"), likeSpellBank, (right, shown) => {
        const sentence = shown.replace(/ \(.*\)$/u, "").replace("___", `*${right}*`);
        return t(sentence, `${sentence}（动词的 -ing 形式是 ${right}）`);
      }),
    ),
    point(
      "fix",
      t("Fixing the second verb", "改正第二个动词"),
      t(
        "Each sentence puts two verbs side by side, as Chinese does. Give the second one *-ing*. After *like* and *love* you may also write *to* and the verb (*I like to swim*), but after *enjoy* only *-ing* is right.",
        "每个句子都像中文一样把两个动词直接连在一起。把第二个动词改成 *-ing* 形式。在 *like* 和 *love* 后面也可以用 *to* 加动词（*I like to swim*），但 *enjoy* 后面只能用 *-ing*。",
      ),
      typedGenerator("sentence-pattern", t("Fix the sentence.", "改正这个句子。"), likeFixBank, (right) =>
        t(right, `${right}（like、love、enjoy 后面的动词用 -ing）`),
      ),
    ),
  ],
};

// Writing about likes.

/** fans are people who like things, and whether their verb takes -s. */
const fans: readonly (readonly [who: string, s: boolean])[] = [
  ["Ben", true],
  ["Mia", true],
  ["I", false],
  ["My brother", true],
  ["Anna", true],
  ["My friends", false],
  ["Grandpa", true],
];

const likeVerbs: readonly string[] = ["like", "love", "enjoy"];

const likeNotes = Array.from({ length: 42 }, (_, k) => {
  const [who, s] = fans[k % fans.length] ?? ["Ben", true];
  const verb = likeVerbs[k % likeVerbs.length] ?? "like";
  const [v1, ing1, , r1] = pastimes[k % pastimes.length] ?? pastimes[0] ?? ["swim", "swimming", "", ""];
  const second = k % 2 === 1 ? pastimes[(k + 5) % pastimes.length] : undefined;
  const verbForm = s ? `${verb}s` : verb;
  const note = second ? `${who} / ${verb} / ${v1}${r1} + ${second[0]}${second[3]}` : `${who} / ${verb} / ${v1}${r1}`;
  const ings = second ? `${ing1}${r1} and ${second[1]}${second[3]}` : `${ing1}${r1}`;
  const tos = second ? `to ${v1}${r1} and (to )${second[0]}${second[3]}` : `to ${v1}${r1}`;
  const bases = second ? `${v1}${r1} and ${second[0]}${second[3]}` : `${v1}${r1}`;
  return {
    note,
    right: `${who} ${verbForm} ${ings}.`,
    pattern: verb === "enjoy" ? `${who} ${verbForm} ${ings}.` : `${who} ${verbForm} [${ings}|${tos}].`,
    wrong: [`${who} ${verbForm} ${bases}.`, `${who} ${s ? verb : `${verb}s`} ${ings}.`],
  };
});

const likesChoiceBank: readonly ChoiceItem[] = likeNotes.map(({ note, right, wrong }): ChoiceItem => [note, right, wrong]);
const likesTypedBank: readonly TypedItem[] = likeNotes.map(
  ({ note, right, pattern, wrong }): TypedItem => ({
    shown: note,
    accepted: [pattern],
    canonical: right,
    wrong,
  }),
);

const writingAboutLikes: TopicDef = {
  id: "writing-about-likes",
  title: t("Writing About Likes", "写喜欢的事"),
  summary: t(
    "Turn notes into sentences: Ben / like / ride a bike becomes Ben likes riding a bike.",
    "把笔记写成句子：Ben / like / ride a bike 写成 Ben likes riding a bike.",
  ),
  prerequisites: ["like-and-love-with-ing", "joining-with-and-but-or"],
  encompasses: [
    { topic: "like-and-love-with-ing", weight: 0.4 },
    { topic: "joining-with-and-but-or", weight: 0.2 },
  ],
  xp: 20,
  strand: "writing",
  knowledgePoints: [
    point(
      "choose",
      t("The sentence for a note", "选出符合笔记的句子"),
      t(
        "A note gives a person, a verb and one or two activities. The sentence gives *like*, *love* or *enjoy* an *-s* after one person, turns each activity into *-ing*, and joins two of them with *and*.\n\n*Ben / like / ride a bike + play chess* → *Ben likes riding a bike and playing chess.*",
        "笔记给出一个人、一个动词和一两项活动。写成句子时，单数主语后的 *like*、*love*、*enjoy* 加 *-s*，每项活动改成 *-ing* 形式，两项活动用 *and* 连接。\n\n*Ben / like / ride a bike + play chess* → *Ben likes riding a bike and playing chess.*",
      ),
      choiceGenerator(t("Choose the sentence that matches the note.", "选出与笔记相符的句子。"), likesChoiceBank, (right) =>
        t(right, `${right}（like/love/enjoy + 动词 -ing）`),
      ),
    ),
    point(
      "write",
      t("Writing the sentence", "写出句子"),
      t("Write a whole sentence for the note, with a capital letter and a period.", "根据笔记写一个完整的句子，句首大写，句末加句号。"),
      typedGenerator("sentence-pattern", t("Write a sentence from the note.", "根据笔记写一个句子。"), likesTypedBank, (right) =>
        t(right, `${right}（like/love/enjoy + 动词 -ing）`),
      ),
    ),
  ],
};

/** topics are the topics of the unit Free Time. */
export const topics: readonly TopicDef[] = [
  sportsAndMusic.topic,
  hobbies.topic,
  parties.topic,
  actions.topic,
  likeAndLove,
  writingAboutLikes,
];

/** vocabulary are the words the unit Free Time teaches. */
export const vocabulary: readonly WordBatch[] = [sportsAndMusic.batch, hobbies.batch, parties.batch, actions.batch];
