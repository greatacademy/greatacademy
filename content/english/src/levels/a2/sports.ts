// A2, unit 5: Sports and Games. Sports, competition, movement, games and how we do things; adverbs of manner and
// could; a past event judged by a model.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { interleave, vocabularyTopic, word } from "../words.ts";
import { combos, fill, judgedTopic } from "./kit.ts";

const sports = vocabularyTopic({
  id: "a2-words-sports",
  title: t("Sports", "体育运动"),
  summary: t(
    "Tennis, volleyball, badminton, ping-pong and baseball; skating and skiing; races, matches, players, coaches and scores.",
    "网球、排球、羽毛球、乒乓球和棒球；滑冰和滑雪；比赛、选手、教练和比分。",
  ),
  prerequisites: ["a1-words-sports-and-music"],
  words: [
    word(
      "tennis",
      "a game where two or four players hit a ball over a net with rackets",
      "网球",
      "Let's play {tennis}. I have two rackets and some balls.|baseball skiing | Wimbledon is a famous {tennis} match in London.|skiing baseball | She hit the {tennis} ball over the net.|skiing race",
      "badminton baseball",
    ),
    word(
      "volleyball",
      "a game where two teams hit a big ball over a high net with their hands",
      "排球",
      "We play {volleyball} on the beach in summer.|skiing baseball | A {volleyball} team has six players on the court.|skiing tennis | Jump high and hit the {volleyball} over the net!|ski race",
      "tennis badminton",
    ),
    word(
      "badminton",
      "a game where players hit a light thing with feathers over a net",
      "羽毛球",
      "{Badminton} is very popular in China and Indonesia.|Skiing Baseball | You hit a shuttlecock, not a ball, in {badminton}.|baseball volleyball | We played {badminton} in the park, but the wind was too strong.|skiing baseball",
      "tennis volleyball",
    ),
    word(
      "ping-pong",
      "a game where players hit a small light ball over a net on a table",
      "乒乓球",
      "We play {ping-pong} on a green table.|baseball skiing | A {ping-pong} ball is small, white and very light.|baseball volleyball | China has many {ping-pong} champions.|skiing baseball",
      "tennis badminton",
    ),
    word(
      "baseball",
      "an American game where players hit a ball with a bat and run around four bases",
      "棒球",
      "In {baseball}, you hit the ball with a bat.|tennis ping-pong | He wears a {baseball} cap every day.|tennis ping-pong | {Baseball} is very popular in Japan and the US.|Skiing Skating",
      "tennis volleyball",
    ),
    word(
      "skate skates skated skating",
      "to move over ice or the ground on special shoes with blades or wheels",
      "滑冰；溜冰",
      "We went {skating} on the frozen lake.|racing scoring | Can you {skate} backwards?|score coach | My new {skates} have pink wheels.|scores races",
      "ski race",
    ),
    word(
      "ski skis skied skiing",
      "to move over snow on two long narrow boards",
      "滑雪",
      "We go {skiing} in the mountains every winter.|scoring racing | I {skied} down the hill and fell in the snow.|scored raced | You need a lot of snow to {ski}.|score coach",
      "skate race",
    ),
    word(
      "race races",
      "a competition to see who is the fastest",
      "赛跑；比赛",
      "Who won the {race}? — Anna. She was the fastest.|coach score | The horse {race} starts at two o'clock.|coach score | I came last in the {race}, but I finished it.|coach score",
      "match score",
    ),
    word(
      "match matches",
      "a game between two players or two teams",
      "比赛",
      "Our team won the football {match} 3 to 1.|coach player | Did you watch the tennis {match} on TV?|coach skate | The {match} was canceled because of the rain.|coach skate",
      "race player",
    ),
    word(
      "player players",
      "a person who plays a game or a sport",
      "选手；运动员",
      "There are eleven {players} in a football team.|matches scores | Messi is a famous football {player}.|match score | Each {player} has a number on her shirt.|match score",
      "coach match",
    ),
    word(
      "coach coaches",
      "a person who trains a team or a player",
      "教练",
      'Our {coach} makes us run ten laps before every game.|match score | The {coach} shouted, "Pass the ball!"|match score | She is a swimming {coach} at the sports center.|match score',
      "player match",
    ),
    word(
      "score scores scored scoring",
      "to win a point or a goal; the number of points in a game",
      "得分；比分",
      "What's the {score}? — It's 2 to 2.|coach player | She {scored} two goals in the first half.|coached raced | The final {score} was 21 to 15.|coach player",
      "race match",
    ),
  ],
});

const competition = vocabularyTopic({
  id: "a2-words-competition",
  title: t("Competition", "竞赛"),
  summary: t(
    "Winners, prizes, medals and champions; goals and points; playing against, beating, practicing; fans who cheer; the final.",
    "获胜者、奖品、奖牌和冠军；进球和分数；对抗、打败、练习；欢呼的球迷；决赛。",
  ),
  prerequisites: ["a2-words-sports"],
  words: [
    word(
      "winner winners",
      "the person or team that wins",
      "获胜者",
      "The {winner} gets a gold medal.|fan practice | And the {winner} is... Lucy Chen!|fan final | There can only be one {winner} in a race.|fan practice",
      "champion fan",
    ),
    word(
      "prize prizes",
      "something you get for winning",
      "奖品；奖",
      "She won first {prize} in the drawing competition.|fan goal | The {prize} for the winner is a new bike.|fan goal | He has won many {prizes} for his poems.|fans goals",
      "medal goal",
    ),
    word(
      "medal medals",
      "a round piece of metal you get for winning or doing well",
      "奖牌",
      "She won a gold {medal} at the Olympics.|fan goal | The winners wear their {medals} around their necks.|fans goals | He came third and got a bronze {medal}.|fan goal",
      "prize goal",
    ),
    word(
      "champion champions",
      "the best player or team in a competition",
      "冠军",
      "He is the world {champion} in ping-pong.|fan practice | Who are this year's {champions}?|fans practices | She was the swimming {champion} three years in a row.|fan practice",
      "winner fan",
    ),
    word(
      "goal goals",
      "the net where you try to put the ball; a point in football",
      "球门；进球",
      "He kicked the ball into the {goal}.|prize medal | Our team scored three {goals}.|prizes medals | Wow, what a {goal}! The fans are going crazy.|prize medal",
      "point prize",
    ),
    word(
      "point points",
      "one number in the score of a game",
      "分；得分",
      "You get one {point} for each right answer.|fan final | We won the game by two {points}.|medals fans | In basketball, a long shot is worth three {points}.|medals fans",
      "goal medal",
    ),
    word(
      "against",
      "on the other side in a game or fight",
      "对抗；反对",
      "Our team is playing {against} the red team on Saturday.|final practice | It's China {against} Brazil in the final.|final practice | Don't lean {against} the wet wall.|final practice",
      "final practice",
    ),
    word(
      "beat beats beaten beating",
      "to win against someone",
      "打败；战胜",
      "We {beat} the blue team 3 to 0.|cheered practiced | Nobody can {beat} her at chess.|cheer practice | They have never {beaten} us at home.|cheered practiced",
      "cheer practice",
    ),
    word(
      "practice practices practiced practicing",
      "to do something again and again to get better at it",
      "练习",
      "I {practice} the piano every day.|beat cheer | Football {practice} is on Tuesday and Thursday.|final fan | She {practiced} her serve for hours.|beat cheered",
      "beat cheer",
    ),
    word(
      "fan fans",
      "a person who loves a team, a sport or a famous person",
      "迷；粉丝",
      "The {fans} sang and waved flags.|goals points | I'm a big {fan} of that singer.|goal point | Thousands of {fans} came to the match.|goals points",
      "winner champion",
    ),
    word(
      "cheer cheers cheered cheering",
      "to shout because you are happy or want someone to win",
      "欢呼；喝彩",
      "The crowd {cheered} when she scored.|beat practiced | Let's {cheer} for our team!|beat practice | We heard {cheering} from the stadium.|beating practicing",
      "beat practice",
    ),
    word(
      "final finals",
      "the last game, which decides the winner; last",
      "决赛；最后的",
      "Our team is in the {final}! We play on Sunday.|fan goal | This is the {final} question. Good luck!|against fan | Two teams reached the {finals}.|fans goals",
      "fan point",
    ),
  ],
});

const movement = vocabularyTopic({
  id: "a2-words-movement",
  title: t("Movement", "动作"),
  summary: t(
    "Throwing, kicking, hitting, climbing, pushing, pulling, lifting, rolling, slipping, holding, shouting and fighting.",
    "扔、踢、击打、爬、推、拉、举、滚、滑倒、握住、喊叫和打架。",
  ),
  prerequisites: ["a2-words-competition"],
  words: [
    word(
      "throw throws threw thrown throwing",
      "to send something through the air with your hand",
      "扔；投",
      "{Throw} the ball to me!|Kick Push | He {threw} the ball over the fence.|pulled slipped | Don't {throw} stones at the birds.|pull slip",
      "kick push",
    ),
    word(
      "kick kicks kicked kicking",
      "to hit something with your foot",
      "踢",
      "He {kicked} the ball into the goal.|threw lifted | My little brother {kicks} me under the table.|holds lifts | Don't {kick} the door. Use your hand.|lift hold",
      "throw hit",
    ),
    word(
      "hit hits hitting",
      "to touch something hard and fast, with your hand or a bat",
      "击打；撞",
      "{Hit} the ball with the bat.|Pull Shout | The car {hit} a tree, but nobody was hurt.|shouted pulled | She is good at {hitting} the ball over the net.|shouting pulling",
      "kick push",
    ),
    word(
      "climb climbs climbed climbing",
      "to go up something using your hands and feet",
      "爬；攀登",
      "The cat {climbed} up the tree.|threw kicked | We {climbed} the mountain in five hours.|threw kicked | {Climbing} walls is my favorite sport.|Throwing Kicking",
      "lift roll",
    ),
    word(
      "push pushes pushed pushing",
      "to move something away from you with your hands",
      "推",
      "{Push} the door to open it.|Shout Climb | He {pushed} me and I fell!|shouted climbed | The car stopped, so we {pushed} it to the garage.|shouted threw",
      "pull lift",
    ),
    word(
      "pull pulls pulled pulling",
      "to move something toward you",
      "拉",
      "{Pull} the rope as hard as you can!|Shout Climb | Don't {pull} the cat's tail.|shout climb | The horse {pulled} the cart up the hill.|shouted slipped",
      "push lift",
    ),
    word(
      "lift lifts lifted lifting",
      "to move something up",
      "举起；抬起",
      "Can you help me {lift} this box?|slip shout | He {lifted} the baby onto his shoulders.|slipped shouted | {Lift} your arms over your head.|Slip Shout",
      "pull hold",
    ),
    word(
      "roll rolls rolled rolling",
      "to move by turning over and over",
      "滚动",
      "The ball {rolled} under the car.|lifted shouted | {Roll} the dice and move your piece.|Lift Shout | The dog {rolled} in the grass.|lifted held",
      "throw slip",
    ),
    word(
      "slip slips slipped slipping",
      "to slide by accident and fall",
      "滑倒；打滑",
      "Be careful! Don't {slip} on the ice.|lift hold | I {slipped} on the wet floor and hurt my knee.|lifted held | The cup {slipped} out of my hand.|lifted held",
      "roll throw",
    ),
    word(
      "hold holds held holding",
      "to have something in your hands",
      "拿着；握住",
      "{Hold} my hand when we cross the road.|Kick Slip | She {held} the baby carefully.|kicked slipped | He's {holding} a cup of hot tea.|kicking slipping",
      "lift pull",
    ),
    word(
      "shout shouts shouted shouting",
      "to say something very loudly",
      "喊叫",
      'Don\'t {shout}! I can hear you.|throw lift | The coach {shouted} at the players.|threw lifted | "Help!" she {shouted}.|lifted rolled',
      "cheer push",
    ),
    word(
      "fight fights fought fighting",
      "to use your body or weapons against someone; to argue",
      "打架；战斗；争吵",
      "My brother and I often {fight} about the TV.|lift roll | Dogs sometimes {fight} over food.|lift hold | The doctors are {fighting} to save her life.|rolling slipping | The two cats {fought} in the garden all night.|lifted held",
      "fit flight",
    ),
  ],
});

const games = vocabularyTopic({
  id: "a2-words-games",
  title: t("Games", "游戏"),
  summary: t(
    "Puzzles, rules, dice and boards; partners and levels; online games and videos; cheating; chances; fair and lucky.",
    "拼图、规则、骰子和棋盘；搭档和关卡；网络游戏和视频；作弊；机会；公平的和幸运的。",
  ),
  prerequisites: ["a2-words-movement"],
  words: [
    word(
      "puzzle puzzles",
      "a game or a question that you have to think hard about",
      "拼图；谜题",
      "This {puzzle} has a thousand pieces.|dice partner | I can't do this {puzzle}. It's too hard.|dice partner | He loves crossword {puzzles}.|partners levels",
      "rule level",
    ),
    word(
      "rule rules",
      "what you must or must not do in a game or a place",
      "规则",
      "Do you know the {rules} of chess?|partners dice | It's against the {rules} to touch the ball with your hand.|partner board | The first {rule} is: no running by the pool.|partner level",
      "level puzzle",
    ),
    word(
      "dice",
      "small cubes with one to six dots, used in games",
      "骰子",
      "Throw the {dice}. You got a six!|partner rule | You need two {dice} to play this game.|partners rules | It's your turn. Roll the {dice}.|partner rule",
      "board puzzle",
    ),
    word(
      "board boards",
      "a flat piece of wood or card on which you play a game",
      "棋盘；板",
      "Put the chess pieces on the {board}.|dice partner | My family plays {board} games on Sunday.|dice rule | The teacher wrote on the {board}.|dice partner",
      "dice level",
    ),
    word(
      "partner partners",
      "a person you do something with",
      "搭档；伙伴",
      "Find a {partner} and practice the dialogue.|dice level | My tennis {partner} is my sister.|dice level | Work with your {partner} on this puzzle.|dice board",
      "player fan",
    ),
    word(
      "level levels",
      "one stage of a game, each harder than the one before",
      "关卡；级别",
      "I'm on {level} 12 of the game.|dice partner | Each {level} is harder than the last one.|dice partner | This book is for students at {level} A2.|dice partner",
      "rule board",
    ),
    word(
      "online",
      "on the internet",
      "在线的；网上",
      "I play chess {online} with my cousin in Canada.|lucky fair | You can buy tickets {online}.|lucky fair | Many people shop {online} now.|lucky fair",
      "video lucky",
    ),
    word(
      "video videos",
      "a recording of moving pictures",
      "视频",
      "Let's watch a {video} of the match.|puzzle dice | He makes funny {videos} of his cat.|puzzles dice | I play {video} games for one hour on Saturday.|rule level",
      "board puzzle",
    ),
    word(
      "cheat cheats cheated cheating",
      "to do something that is against the rules to win",
      "作弊",
      "Don't look at my cards! That's {cheating}.|holding rolling | He {cheated} in the test and the teacher saw him.|rolled held | If you {cheat}, you can't play with us.|roll hold",
      "beat practice",
    ),
    word(
      "fair fairer fairest",
      "right for everyone; following the rules",
      "公平的",
      "That's not {fair}! He has more cake than me.|online lucky | Each team has five players. That's {fair}.|online video | The judge wasn't {fair} to us.|online video",
      "lucky online",
    ),
    word(
      "lucky luckier luckiest",
      "having good things happen by chance",
      "幸运的",
      "You found money in the street? You're {lucky}!|fair online | Seven is my {lucky} number.|fair online | We were {lucky}: the rain stopped just before the match.|fair online",
      "fair online",
    ),
    word(
      "chance chances",
      "a time when you can do something; how possible it is that something will happen",
      "机会；可能性",
      "Do you think we have a {chance} of winning?|rule dice | I didn't get a {chance} to play today.|dice puzzle | There's a good {chance} it will rain tomorrow.|puzzle partner | She had two {chances} to score, but she missed both.|partners rules",
      "change charge",
    ),
  ],
});

const adverbWords = vocabularyTopic({
  id: "a2-words-adverbs",
  title: t("How We Do Things", "做事的方式"),
  summary: t(
    "Quickly, slowly, carefully, quietly, loudly, easily, badly and hard; loud; almost and quite.",
    "快速地、慢慢地、仔细地、安静地、大声地、容易地、糟糕地和努力地；大声的；几乎和相当。",
  ),
  prerequisites: ["a2-words-games"],
  words: [
    word(
      "quickly",
      "fast",
      "快速地",
      "Come {quickly}! The bus is here.|quietly carefully | She ate her breakfast {quickly} and ran to school.|quietly badly | The time went {quickly}.|quietly loudly",
      "slowly easily",
    ),
    word(
      "slowly",
      "not fast",
      "慢慢地",
      "Please speak more {slowly}. I don't understand.|loudly badly | The old man walked {slowly} up the hill.|loudly badly | Drive {slowly} near the school.|loudly badly",
      "quickly quietly",
      "carefully quietly",
    ),
    word(
      "carefully",
      "paying attention so that you don't make mistakes or break something",
      "仔细地；小心地",
      "Read the questions {carefully}.|loudly badly | Carry the glasses {carefully}.|loudly badly | Listen {carefully} to the rules.|badly almost",
      "badly easily",
      "slowly quietly",
    ),
    word(
      "quietly",
      "making very little noise",
      "安静地；轻声地",
      "Talk {quietly}. The baby is sleeping.|loudly badly | He closed the door {quietly}.|loudly badly | The cat walked {quietly} behind the bird.|loudly badly",
      "loudly carefully",
      "slowly carefully",
    ),
    word(
      "loudly",
      "making a lot of noise",
      "大声地",
      "The fans cheered {loudly}.|quietly slowly | Don't talk so {loudly}. People are looking.|quietly carefully | The dog barked {loudly} all night.|quietly easily",
      "quietly badly",
      "loud",
    ),
    word(
      "easily",
      "without difficulty",
      "容易地；轻松地",
      "She won the race {easily}.|badly loudly | I can {easily} carry this bag. It's light.|badly loudly | He gets angry very {easily}.|loudly carefully",
      "badly quietly",
    ),
    word(
      "badly",
      "not well",
      "糟糕地；严重地",
      "We played {badly} and lost 5 to 0.|easily quickly | He was {badly} hurt in the accident.|easily quickly | I slept {badly} because of the noise.|easily quickly",
      "easily carefully",
    ),
    word(
      "hard harder hardest",
      "with a lot of effort; not soft",
      "努力地；硬的",
      "She studied {hard} and passed the test.|almost quite | It's raining {hard}. Take an umbrella.|almost quite | This bed is too {hard}. I can't sleep.|almost quickly",
      "easily badly",
    ),
    word(
      "loud louder loudest",
      "making a lot of noise",
      "大声的；响亮的",
      "The music is too {loud}! Turn it down.|almost quite | There was a {loud} noise in the night.|almost quickly | Can you speak {louder}? I can't hear you.|quicklier almost",
      "quiet hard",
      "loudly",
    ),
    word(
      "almost",
      "nearly; not quite",
      "几乎；差不多",
      "Hurry up! It's {almost} eight o'clock.|loud hard | I {almost} fell, but I held the rail.|loud hard | We're {almost} there. Just five more minutes.|loud badly",
      "quite hard",
      "quite",
    ),
    word(
      "quite",
      "fairly; more than a little",
      "相当；颇",
      "The test was {quite} easy.|loudly badly | It's {quite} cold today. Wear a coat.|loudly badly | She speaks English {quite} well.|loud badly",
      "almost hard",
      "almost",
    ),
  ],
});

// Adverbs of manner.

/** manners are an adjective, its adverb, a person who does it, the verb for that person, and two wrong adverbs. */
const manners: readonly (readonly [string, string, string, string, string])[] = [
  ["quick", "quickly", "runner", "runs", "quickely"],
  ["slow", "slowly", "eater", "eats", "slowley"],
  ["careful", "carefully", "driver", "drives", "carefuly"],
  ["quiet", "quietly", "speaker", "speaks", "quietely"],
  ["loud", "loudly", "singer", "sings", "loudy"],
  ["bad", "badly", "player", "plays", "badely"],
  ["good", "well", "swimmer", "swims", "goodly"],
  ["beautiful", "beautifully", "dancer", "dances", "beautifuly"],
];

const mannerSubjects: readonly string[] = ["Tom", "My sister", "Our coach", "Mr. Li", "Anna"];

const mannerRows = combos(40, manners, mannerSubjects, [0]);

const mannerChoiceBank: readonly ChoiceItem[] = interleave([
  mannerRows.map(
    ([[adjective, adverb, , verb, misspelt], subject]): ChoiceItem => [
      `${subject} ${verb} ___. (${adjective})`,
      adverb,
      [adjective, misspelt],
    ],
  ),
  mannerRows.map(
    ([[adjective, adverb, person, , misspelt], subject]): ChoiceItem => [
      `${subject} is a ___ ${person}. (${adjective})`,
      adjective,
      [adverb, misspelt],
    ],
  ),
]);

const mannerTypedBank: readonly TypedItem[] = mannerRows.map(
  ([[adjective, adverb, person, verb, misspelt], subject]): TypedItem => ({
    shown: `${subject} is a ${adjective} ${person}.`,
    instruction: t(`Use: ${subject} ${verb} …`, `使用：${subject} ${verb} …`),
    accepted: [`${subject} ${verb} ${adverb}.`],
    wrong: [`${subject} ${verb} ${adjective}.`, `${subject} ${verb} ${misspelt}.`],
  }),
);

/** mannerOf finds the row of manners for an adjective. */
const mannerOf = (adjective: string) => manners.find(([a]) => a === adjective);

/** adverbRule says how an adjective becomes its adverb. */
const adverbRule = (adjective: string, adverb: string): Text =>
  adjective === "good"
    ? t("*good* has an adverb of its own, *well*", "*good* 有自己的副词 *well*")
    : t(`*${adjective}* just adds *-ly* to make *${adverb}*`, `*${adjective}* 直接加 *-ly* 变成 *${adverb}*`);

/** mannerWhy explains an adjective before a noun or an adverb after a verb. */
const mannerWhy = (right: string, shown: string): Text => {
  const adjective = /\((\w+)\)$/u.exec(shown)?.[1] ?? "";
  const [, adverb = "", person = "", verb = ""] = mannerOf(adjective) ?? [];
  if (/ is a ___/u.test(shown))
    return t(
      `The gap comes before the noun *${person}* and says what the person is like, so it needs the adjective: ${fill(shown, right)}`,
      `空白在名词 *${person}* 前面，说明这个人是什么样的，所以用形容词：${fill(shown, right)}`,
    );
  const rule = adverbRule(adjective, adverb);
  return t(
    `The gap comes after the verb *${verb}* and says how, so it needs the adverb; ${rule.en}: ${fill(shown, right)}`,
    `空白在动词 *${verb}* 后面，说明动作怎样做，所以用副词；${rule["zh-CN"]}：${fill(shown, right)}`,
  );
};

/** whyNotManner explains an adjective after a verb, an adverb before a noun, or a misspelt adverb. */
const whyNotManner = (wrong: string, right: string, shown: string): Text => {
  const adjective = /\((\w+)\)$/u.exec(shown)?.[1] ?? "";
  const [, adverb = ""] = mannerOf(adjective) ?? [];
  const rule = adverbRule(adjective, adverb);
  if (wrong === adjective)
    return t(
      `*${wrong}* is an adjective. After a verb, saying how, English uses the adverb: ${rule.en}.`,
      `*${wrong}* 是形容词。在动词后面说明怎样做，英语要用副词：${rule["zh-CN"]}。`,
    );
  if (wrong === adverb)
    return t(
      `*${wrong}* is an adverb and goes with a verb. Before a noun, use the adjective *${right}*.`,
      `*${wrong}* 是副词，修饰动词。名词前面要用形容词 *${right}*。`,
    );
  return t(
    `*${wrong}* is not a word: ${rule.en}${/ is a ___/u.test(shown) ? `, and before a noun you need the adjective *${right}* anyway` : ""}.`,
    `*${wrong}* 不是正确的词：${rule["zh-CN"]}${/ is a ___/u.test(shown) ? `；而且名词前本来就要用形容词 *${right}*` : ""}。`,
  );
};

const adverbsOfManner: TopicDef = {
  id: "adverbs-of-manner",
  title: t("Quickly and Carefully", "quickly 和 carefully"),
  summary: t(
    "She runs quickly. He plays well. A word that says how goes after the verb and usually ends in -ly.",
    "She runs quickly. He plays well. 说明“怎样做”的词放在动词后面，通常以 -ly 结尾。",
  ),
  prerequisites: ["adjectives-before-nouns", "a2-words-adverbs"],
  encompasses: [
    { topic: "adjectives-before-nouns", weight: 0.2 },
    { topic: "a2-words-adverbs", weight: 0.2 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Adjective or adverb", "形容词还是副词"),
      t(
        "An adjective says what a person or thing is like, and goes before a noun: *a quick runner*. An adverb says how someone does something, and goes after the verb: *She runs quickly.*\n\n- Most adverbs add *-ly*: *quick → quickly*, *careful → carefully*, *loud → loudly*.\n- *-y* becomes *-ily*: *easy → easily*.\n- *good* becomes *well*: *a good swimmer → She swims well.*\n- *fast* and *hard* do not change: *He runs fast. She works hard.*",
        "形容词说明人或事物是什么样的，放在名词前：*a quick runner*。副词说明动作怎样做，放在动词后：*She runs quickly.*\n\n- 大多数副词加 *-ly*：*quick → quickly*、*careful → carefully*、*loud → loudly*。\n- 以 *-y* 结尾的变成 *-ily*：*easy → easily*。\n- *good* 变成 *well*：*a good swimmer → She swims well.*\n- *fast* 和 *hard* 不变：*He runs fast. She works hard.*\n\n中文常说“跑得快”“唱得好”，英语不用 *runs quick*、*sings good*，要用副词。",
      ),
      choiceGenerator(t("Choose the word for the gap.", "选出填入空白处的词。"), mannerChoiceBank, mannerWhy, whyNotManner),
    ),
    point(
      "write",
      t("Saying it with an adverb", "用副词表达"),
      t(
        "Say the same thing with the verb and an adverb: *Tom is a careful driver.* → *Tom drives carefully.* Remember *good → well*.",
        "用动词加副词表达同样的意思：*Tom is a careful driver.* → *Tom drives carefully.* 注意 *good → well*。",
      ),
      typedGenerator(
        "sentence",
        t("Write the sentence again, starting with the person and the verb shown.", "用所给的动词改写句子，以人开头。"),
        mannerTypedBank,
        (right, shown) => {
          const adjective = manners.find(([a, , person]) => shown.includes(` ${a} ${person}`))?.[0] ?? "";
          const [, adverb = ""] = mannerOf(adjective) ?? [];
          const rule = adverbRule(adjective, adverb);
          return t(
            `With the verb, the word that says how is an adverb, and it goes after the verb; ${rule.en}: ${right}`,
            `用动词表达时，说明怎样做的词是副词，放在动词后面；${rule["zh-CN"]}：${right}`,
          );
        },
      ),
    ),
  ],
};

// Could for past ability.

const couldLeads: readonly (readonly [string, string])[] = [
  ["I", "I was"],
  ["Lin", "she was"],
  ["My brother", "he was"],
  ["Tom", "he was"],
  ["We", "we were"],
  ["My grandma", "she was"],
];
const couldActs: readonly string[] = [
  "swim across the lake",
  "ride a bike",
  "skate on the ice",
  "climb trees",
  "read English books",
  "play the piano",
  "count to a hundred",
];
const couldAges: readonly string[] = ["four", "five", "six", "seven", "ten"];

const couldName = (subject: string) => (/^(I|Lin|Tom)$/u.test(subject) ? subject : subject.toLowerCase());

const couldRows = combos(70, couldLeads, couldActs, couldAges);

const couldNegatives: readonly string[] = [
  "It was very foggy, so we ___ see the ball.",
  "The music was too loud, so I ___ hear you.",
  "Ana was sick last week, so she ___ play in the match.",
  "The box was too heavy. Tom ___ lift it.",
  "The door was locked, so they ___ get in.",
  "I ___ find my keys this morning, so I was late.",
  "It was dark, and we ___ see the path.",
  "He hurt his leg, so he ___ run in the race.",
  "The test was too hard. I ___ answer the last question.",
  "We ___ go skiing last winter because there was no snow.",
  "The shop was closed, so I ___ buy any milk.",
  "She lost her glasses and ___ read the menu.",
  "The water was too cold. We ___ swim.",
  "My phone was dead, so I ___ call you.",
  "The ice was very thin, so we ___ skate on the lake.",
  "There were no tickets left, so they ___ watch the final.",
];

const couldChoiceBank: readonly ChoiceItem[] = interleave([
  couldRows
    .slice(0, 32)
    .map(
      ([[subject, was], act, age]): ChoiceItem => [`When ${was} ${age}, ${couldName(subject)} ___ ${act}.`, "could", ["can", "could to"]],
    ),
  couldNegatives.map((s): ChoiceItem => [s, "couldn't", ["can't", "didn't could"]]),
]);

const couldTypedBank: readonly TypedItem[] = couldRows.slice(32, 70).map(([[subject, was], act, age], k): TypedItem => {
  const not = k % 4 >= 2;
  const when = `when ${was} ${age}`;
  return {
    shown: `${subject} / ${not ? "not " : ""}${act} / ${when}`,
    accepted: [`${subject} ${not ? "[couldn't|could not]" : "could"} ${act} ${when}.`],
    canonical: `${subject} ${not ? "couldn't" : "could"} ${act} ${when}.`,
    wrong: not
      ? [`${subject} can't ${act} ${when}.`, `${subject} didn't could ${act} ${when}.`]
      : [`${subject} can ${act} ${when}.`, `${subject} could ${act.replace(/^(\w+)/u, "$1ed")} ${when}.`],
  };
});

/** couldWhy explains could or couldn't for an ability in the past. */
const couldWhy = (sentence: string): Text =>
  /couldn't|could not/u.test(sentence)
    ? t(
        `This happened in the past, so *can't* becomes *couldn't*, with the plain verb after it: ${sentence}`,
        `这是过去的事，所以 *can't* 变成 *couldn't*，后面接动词原形：${sentence}`,
      )
    : t(
        `This is about the past, so *can* becomes *could*, with the plain verb after it: ${sentence}`,
        `这是过去的事，所以 *can* 变成 *could*，后面接动词原形：${sentence}`,
      );

/** whyNotCould explains can for the past, to after could, or did with could. */
const whyNotCould = (wrong: string, right: string): Text => {
  if (wrong === "can" || wrong === "can't")
    return t(
      `*${wrong}* is for now. This is about the past, so it takes *${right}*.`,
      `*${wrong}* 用于现在。这是过去的事，要用 *${right}*。`,
    );
  if (wrong === "could to")
    return t("*could* takes the plain verb straight after it, with no *to*.", "*could* 后面直接接动词原形，不加 *to*。");
  return t("*could* makes its own negative, *couldn't*, and never takes *did*.", "*could* 自己构成否定 *couldn't*，从不和 *did* 连用。");
};

const couldForPastAbility: TopicDef = {
  id: "could-for-past-ability",
  title: t("Could and Couldn't", "could 和 couldn't"),
  summary: t(
    "I could swim when I was five. We couldn't see the ball. Could is can in the past.",
    "I could swim when I was five. We couldn't see the ball. could 是 can 的过去式。",
  ),
  prerequisites: ["can-for-ability", "past-simple-irregular"],
  encompasses: [{ topic: "can-for-ability", weight: 0.3 }],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Could or couldn't", "could 还是 couldn't"),
      t(
        "*Could* is the past of *can*: *I can swim now. I could swim when I was five.* The negative is *couldn't* (*could not*): *We couldn't see the ball.*\n\nThe verb after *could* stays in its first form, with no *to*: *She could ride a bike*, not *could to ride* or *could rode*. Do not use *did* with it: *didn't could* is wrong.",
        "*could* 是 *can* 的过去式：*I can swim now. I could swim when I was five.* 否定是 *couldn't*（*could not*）：*We couldn't see the ball.*\n\n*could* 后面的动词用原形，不加 *to*：*She could ride a bike*，不说 *could to ride* 或 *could rode*。也不要和 *did* 一起用：*didn't could* 是错的。",
      ),
      choiceGenerator(
        t("Choose the words for the gap.", "选出填入空白处的词。"),
        couldChoiceBank,
        (right, shown) => couldWhy(fill(shown, right)),
        whyNotCould,
      ),
    ),
    point(
      "write",
      t("Writing with could", "用 could 写句子"),
      t(
        "Write a sentence from the note with *could* or *couldn't*, and the verb in its first form. *not* in the note means *couldn't*.",
        "根据笔记用 *could* 或 *couldn't* 写句子，动词用原形。笔记里有 *not* 就用 *couldn't*。",
      ),
      typedGenerator("sentence-pattern", t("Write a sentence from the note.", "根据笔记写一个句子。"), couldTypedBank, couldWhy),
    ),
  ],
};

// Writing about a past event.

const eventBank: readonly WritingItem[] = [
  {
    task: "Write about a football match you played or watched.",
    model:
      'Last Saturday our school team played against Green Park School. It was cold and windy. In the first half, they scored quickly, and we were 1 to 0 behind. Then our coach shouted, "Pass the ball!" After that we played much better. Lily scored a great goal, and Tom scored another one just before the end. We won 2 to 1, and our fans cheered loudly. I was tired but very happy.',
  },
  {
    task: "Write about a race you ran or watched.",
    model:
      "Last month I ran in a 5 km race in the park. There were about two hundred runners. At first I ran too quickly, and I was tired after one kilometer. Then I ran more slowly and carefully. Near the end it started to rain, and I almost slipped on the wet path. Finally I crossed the line. I wasn't the winner, but I finished in thirty minutes. I got a small medal.",
  },
  {
    task: "Write about a game of ping-pong or badminton you played.",
    model:
      "Yesterday I played ping-pong with my cousin Max after school. He is a good player, and he usually beats me. In the first game he played very well and won easily. In the second game I practiced my serve and hit the ball harder. I won 11 to 9. The last game was very close, and we were 10 to 10. Then Max hit the ball into the net. I won the match!",
  },
  {
    task: "Write about a basketball game you played or watched.",
    model:
      "Last Friday I watched my sister's basketball match. Her team played against the best team in the city. At half time her team was 10 points behind. Then my sister scored three baskets quickly. The fans cheered loudly. In the last minute the score was 40 to 40. Finally her friend threw the ball from far away, and it went in. They won 43 to 40.",
  },
  {
    task: "Write about a day you went skating or skiing.",
    model:
      "Last winter my family went skiing in the mountains. It was my first time, and I couldn't stand up at first. A teacher showed me how to move slowly and carefully. I fell many times, but I tried again. In the afternoon I skied down a small hill without falling. My dad took a video of me. In the evening we drank hot chocolate. I was tired but proud.",
  },
  {
    task: "Write about a sports day at your school.",
    model:
      "We had our sports day last Wednesday. In the morning there were races. I ran in the 100 meters, and I came second. Then my class played tug of war against class 5B. We pulled very hard, but they won. After lunch there was a long jump competition. My friend Jack jumped the farthest and won a gold medal. At the end of the day our class got a prize for the most points.",
  },
  {
    task: "Write about a board game you played with your family.",
    model:
      "Last Sunday it rained all day, so my family played a board game. We played in teams: my mom and I against my dad and my brother. We rolled the dice and moved our pieces around the board. At first my dad's team was lucky and moved quickly. Then we got two sixes and caught up. My brother wanted to cheat, but Mom saw him! Finally we won by one point.",
  },
  {
    task: "Write about a swimming competition.",
    model:
      "Last summer I swam in a competition at the city pool. I was very nervous before my race. When the race started, I jumped into the water quickly. I swam as hard as I could. After the turn, I was in third place. In the last few meters I passed one girl. I finished second and got a silver medal. My parents cheered loudly from the seats.",
  },
  {
    task: "Write about a tennis match you played or watched.",
    model:
      "Two weeks ago I watched a tennis final on TV with my grandpa. The players were from Spain and Italy. The Spanish player won the first set easily. Then the Italian player started to play much better. He hit the ball very hard and ran quickly. The match was almost four hours long. Finally the Italian player won. He cried and held the cup over his head.",
  },
  {
    task: "Write about a time your team lost a game.",
    model:
      'Last month our volleyball team played in the school final. We practiced hard for two weeks before the match. But on the day, we played badly. The other team was taller, and they hit the ball very hard. We lost the first set 25 to 15. We played better in the second set, but we lost again. After the match, our coach said, "You can be proud. You tried hard." We are going to practice more.',
  },
  {
    task: "Write about a video game or online game you played with a friend.",
    model:
      'Last Saturday I played an online game with my friend Ken. We were partners, and we played against two other players. First we had to find a key in a castle. Ken found it quickly. Then we had to climb a tall tower. I slipped and fell twice! Finally we reached the top and beat the last level. We shouted with joy. We played for two hours, and then my mom said, "Stop!"',
  },
  {
    task: "Write about a match you saw at a stadium.",
    model:
      "Last year my uncle took me to a baseball game at the stadium. There were thousands of fans, and they were very loud. We bought hot dogs and sat near the field. In the third inning, a player hit the ball out of the stadium. Everyone jumped up and cheered. In the end, our team won 5 to 3. On the way home, I held my new cap and smiled.",
  },
];

const writingAboutAPastEvent = judgedTopic({
  id: "writing-about-a-past-event",
  title: t("Writing About a Past Event", "写过去的一件事"),
  summary: t(
    "Write six to eight sentences about a game, a race or a match: what happened, in order, and how it ended.",
    "写六到八句话，讲一场游戏、赛跑或比赛：按顺序讲发生了什么，以及结果如何。",
  ),
  prerequisites: ["writing-sentences-in-the-past", "adverbs-of-manner"],
  encompasses: [
    { topic: "writing-sentences-in-the-past", weight: 0.3 },
    { topic: "adverbs-of-manner", weight: 0.2 },
  ],
  criteria: ["a2-past-simple", "a2-events-in-order", "a2-event-ending", "a1-sentences"],
  point: {
    id: "event",
    title: t("What happened and how it ended", "发生了什么，结果如何"),
    explanation: t(
      "Tell the story in the past simple, in order:\n\n- When and where it was, and who played: *Last Saturday our team played against Green Park School.*\n- What happened, step by step, with *then*, *after that*, *finally*: *Then our coach shouted. After that we played better.*\n- How it ended: *We won 2 to 1.* *I came second.*\n\nWords like *quickly*, *loudly* and *hard* say how things happened.",
      "用一般过去时按顺序讲故事：\n\n- 什么时候、在哪里、谁参加：*Last Saturday our team played against Green Park School.*\n- 按顺序讲发生了什么，用 *then*、*after that*、*finally*：*Then our coach shouted. After that we played better.*\n- 结果如何：*We won 2 to 1.* *I came second.*\n\n用 *quickly*、*loudly*、*hard* 等副词说明事情是怎样发生的。",
    ),
  },
  question: t(
    "Write six to eight sentences in English about the event the task names: what happened, in order, and how it ended.",
    "根据题目用英语写六到八句话：按顺序讲发生了什么，以及结果如何。",
  ),
  bank: eventBank,
  limits: { minWords: 45, maxChars: 900 },
  what: t("story", "记叙"),
});

/** topics are the topics of the unit Sports and Games. */
export const topics: readonly TopicDef[] = [
  sports.topic,
  competition.topic,
  movement.topic,
  games.topic,
  adverbWords.topic,
  adverbsOfManner,
  couldForPastAbility,
  writingAboutAPastEvent,
];

/** vocabulary are the words the unit Sports and Games teaches. */
export const vocabulary: readonly WordBatch[] = [sports.batch, competition.batch, movement.batch, games.batch, adverbWords.batch];
