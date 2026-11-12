// Grade 4: the spelling topics: nouns in -tion and -sion, silent letters, and ie and ei. Each bank is a list of words
// with a sentence of their own; the wrong spellings are the mistakes children make, worked out from the rule.

import { type Text, type TopicDef, t } from "@ga/content";
import { point, type TypedItem, typedGenerator } from "@ga/subject-english";
import { fields, fill, type Item, itemGenerator } from "./kit.ts";
import { after } from "./prior.ts";

// Nouns in -tion and -sion.

/** NounRule is the rule a verb follows to make its noun, worked out from how the verb ends. */
interface NounRule {
  readonly en: string;
  readonly zh: string;
  readonly wrong: (verb: string, noun: string) => [string, string];
}

const nounRule = (verb: string): NounRule => {
  if (verb.endsWith("mit"))
    return {
      en: "a verb ending in *-mit* changes the *t* to *ss* and adds *-ion*: *-mission*",
      zh: "以 *-mit* 结尾的动词把 *t* 变成 *ss* 再加 *-ion*，成为 *-mission*",
      wrong: (v) => [`${v}tion`, `${v.slice(0, -1)}sion`],
    };
  if (verb.endsWith("ss"))
    return {
      en: "a verb ending in *ss* keeps it and adds *-ion*: *-ssion*",
      zh: "以 *ss* 结尾的动词保留 *ss*，再加 *-ion*，成为 *-ssion*",
      wrong: (v) => [`${v.slice(0, -1)}tion`, `${v.slice(0, -2)}tion`],
    };
  if (verb.endsWith("d") || verb.endsWith("de"))
    return {
      en: "a verb ending in *d* or *de* drops those letters and takes *-sion*",
      zh: "以 *d* 或 *de* 结尾的动词去掉这些字母，加 *-sion*",
      wrong: (v, n) => [`${n.slice(0, -4)}tion`, `${v.replace(/e$/, "")}tion`],
    };
  if (verb.endsWith("ate"))
    return {
      en: "a verb ending in *-ate* drops the *e* and adds *-ion*: *-ation*",
      zh: "以 *-ate* 结尾的动词去掉 *e* 再加 *-ion*，成为 *-ation*",
      wrong: (v) => [`${v.slice(0, -2)}sion`, `${v}tion`],
    };
  return {
    en: "a verb ending in *t* simply adds *-ion*: *-tion*",
    zh: "以 *t* 结尾的动词直接加 *-ion*，成为 *-tion*",
    wrong: (v) => [`${v.slice(0, -1)}sion`, `${v}ation`],
  };
};

const nounLines = `
  erupt|eruption|The ___ of the volcano lit up the night sky.|After the ___, ash covered the fields for miles.
  collect|collection|Her ___ of rocks fills three shelves.|The museum has a ___ of fossils from the desert.
  protect|protection|A hard hat gives your head ___ from falling rocks.|Sunscreen offers ___ against a burn.
  invent|invention|The telephone was an ___ that changed the world.|Which ___ would you most like to make?
  inspect|inspection|The bridge needs an ___ after every earthquake.|The ___ found a crack in the wall.
  connect|connection|There is a ___ between rain and floods.|The phone lost its ___ in the canyon.
  predict|prediction|Her ___ about the storm turned out to be right.|Scientists made a ___ about the next eruption.
  prevent|prevention|Fire ___ starts with clearing dry brush.|The ___ of floods takes strong walls and good planning.
  select|selection|The shop has a wide ___ of minerals.|Make your ___ from the list of topics.
  construct|construction|The ___ of the dam took four years.|Workers wore helmets at the ___ site.
  react|reaction|Her ___ to the loud bang was to jump.|Mixing the two liquids caused a fizzing ___.
  attract|attraction|The hot springs are the main ___ of the park.|A magnet's ___ pulls the nails toward it.
  direct|direction|The river flows in a southern ___.|Which ___ is the wind blowing from?
  subtract|subtraction|We used ___ to find how much the hill had shrunk.|The last problem on the test was a ___.
  interrupt|interruption|The fire alarm caused an ___ in the lesson.|She spoke for an hour without a single ___.
  instruct|instruction|Read each ___ before you start the experiment.|The ranger gave us one ___: stay on the path.
  create|creation|The ___ of a canyon takes millions of years.|This sand sculpture is my own ___.
  educate|education|A good ___ opens many doors.|The park offers free ___ about volcanoes.
  separate|separation|The ___ of the two plates formed a valley.|After a long ___, the friends met again.
  celebrate|celebration|The town held a ___ when the new bridge opened.|Our ___ ended with fireworks.
  locate|location|Mark the ___ of each volcano on the map.|The ___ of the cave was a secret.
  donate|donation|Our class made a ___ to the flood relief fund.|Every ___ helps families rebuild their homes.
  erode|erosion|Wind and water cause ___ of the cliffs.|Tree roots slow the ___ of the riverbank.
  divide|division|The ___ of the land into farms happened long ago.|We practiced long ___ in math class.
  explode|explosion|The ___ of gas inside the volcano threw rocks into the air.|Nobody was hurt in the ___.
  decide|decision|Moving away from the volcano was a hard ___.|The ___ to close the trail kept hikers safe.
  include|inclusion|The ___ of a map made the report clearer.|Everyone agreed with the ___ of the new rule.
  conclude|conclusion|The scientists came to a ___ after years of study.|Write a ___ at the end of your report.
  collide|collision|A ___ of two plates can push up mountains.|The ___ of the carts made a loud crash.
  invade|invasion|An ___ of ants ruined our picnic.|The castle walls stopped the ___.
  extend|extension|The ___ of the road reaches the next village.|The teacher gave us an ___ on our projects.
  expand|expansion|The ___ of the city covered the old farms.|Heat causes the ___ of metal.
  discuss|discussion|Our class had a ___ about earthquake safety.|The ___ went on until the bell rang.
  express|expression|The ___ on her face showed surprise.|A smile is an ___ of joy.
  impress|impression|The giant crater made a strong ___ on us.|The fossil left an ___ in the soft mud.
  confess|confession|The puppy's muddy paws were a ___ of where he had been.|His ___ came after a long silence.
  admit|admission|The museum offers free ___ on Sundays.|The ticket gives you ___ to both halls.
  permit|permission|You need ___ to climb the crater wall.|We asked for ___ to camp by the lake.
  transmit|transmission|The ___ of the warning reached every phone in town.|A storm stopped the radio ___.
  correct|correction|Make each ___ in red pen.|The teacher marked one ___ on my test.
  elect|election|The class held an ___ for captain.|Who won the ___ for mayor?
  inject|injection|The vet gave the dog an ___.|The nurse said the ___ would not hurt much.
  reflect|reflection|I saw my ___ in the still lake.|The ___ of the moon shimmered on the water.
  reject|rejection|The ___ of his plan upset him.|She was sad about the ___ of her poem.
  suggest|suggestion|Do you have a ___ for the puppy's name?|Her ___ was to meet at noon.
  digest|digestion|Fiber in food helps ___.|Chewing well is good for your ___.
  insert|insertion|The ___ of the key opened the box.|After the ___ of a coin, the machine beeped.
  decorate|decoration|We hung a paper ___ on the door.|Each ___ on the tree was handmade.
  illustrate|illustration|The book has an ___ on every page.|Her ___ showed a dragon over the volcano.
  operate|operation|The doctor did an ___ on his knee.|The ___ took two hours.
  translate|translation|We read the ___ of the poem.|The ___ was in Spanish and English.
  persuade|persuasion|With a little ___, Dad agreed to the trip.|Her ___ worked on the whole class.
  provide|provision|The ___ of clean water was the first job after the flood.|The camp made ___ for fifty hikers.
  corrode|corrosion|Rust is a kind of ___.|Salt speeds up the ___ of metal.
  submit|submission|The last day for ___ of the stories is Friday.|Each ___ will be read by the judges.
  omit|omission|The ___ of one word changed the meaning.|There was one ___ in the list of names.
  emit|emission|The ___ of smoke from the volcano grew each day.|Cars give off an ___ of gas.
  possess|possession|This old watch is my favorite ___.|Keep each ___ in your locker.
  progress|progression|The ___ of the seasons is steady.|We watched the ___ of the storm on the map.
`;

const nounRows = fields(nounLines).map(([verb, noun, first, second]) => {
  if (!verb || !noun || !first?.includes("___") || !second?.includes("___")) throw new Error(`a noun line needs four fields: ${verb}`);
  const rule = nounRule(verb);
  const [w1, w2] = rule.wrong(verb, noun);
  if (w1 === noun || w2 === noun || w1 === w2) throw new Error(`the wrong spellings of ${noun} repeat`);
  return { verb, noun, first, second, rule, wrong: [w1, w2] as const };
});

const nounWhy = (row: (typeof nounRows)[number], shown: string): Text =>
  t(
    `${fill(shown, row.noun)} The verb is *${row.verb}*, and ${row.rule.en}. Listen to the end of the verb to choose: *-t* gives *-tion*, *-d* or *-de* gives *-sion*.`,
    `${fill(shown, row.noun)} 动词是 *${row.verb}*，${row.rule.zh}。听动词的结尾来选择：*-t* 变成 *-tion*，*-d* 或 *-de* 变成 *-sion*。`,
  );

/** nounChoiceBank asks for the spelling of the noun made from a verb. */
const nounChoiceBank: readonly Item[] = nounRows.flatMap((row) =>
  [row.first, row.second].map((shown) => ({
    question: t(`Which noun made from *${row.verb}* completes the sentence?`, `由 *${row.verb}* 构成的哪个名词能补全句子？`),
    shown,
    right: row.noun,
    wrong: row.wrong,
    why: nounWhy(row, shown),
    whyNot: row.wrong.map((w) =>
      t(
        `“${w}” is not how the noun is spelled. The verb ends in *${row.verb.slice(-2)}*, and ${row.rule.en}.`,
        `“${w}” 拼写不对。动词以 *${row.verb.slice(-2)}* 结尾，${row.rule.zh}。`,
      ),
    ),
  })),
);

const nounTypedBank: readonly TypedItem[] = nounRows.flatMap((row) =>
  [row.second, row.first].map((shown) => ({
    shown,
    accepted: [row.noun],
    wrong: [...row.wrong],
    instruction: t(`Make a noun from the verb *${row.verb}*.`, `用动词 *${row.verb}* 构成名词。`),
  })),
);

// Silent letters.

const silentLines = `
  knight|k|n|t|The ___ rode out to meet the dragon.|night|kniht
  knee|k|n|e|The squire fell and scraped his ___.|nee|kne
  knife|k|f|n|The cook cut the bread with a sharp ___.|nife|knif
  knock|k|c|n|Three loud ___s shook the castle door.|nock|knok
  kneel|k|l|n|The squire had to ___ before the king.|neel|kneal
  knot|k|t|n|The sailor tied a strong ___ in the rope.|not|knott
  knuckle|k|c|l|He hit the table so hard that his ___ hurt.|nuckle|knukle
  wrist|w|r|s|The archer wore a leather band on her ___.|rist|wrisst
  wrap|w|r|p|They ___ the bread in cloth to keep it warm.|rap|wrapp
  wreck|w|r|c|The storm left the old ship a ___.|reck|wrek
  wrong|w|r|g|The messenger took the ___ road and got lost.|rong|wronge
  write|w|r|t|Only the monks could read and ___ in the village.|rite|wrigt
  sword|w|s|d|The blacksmith made a ___ for the young knight.|sord|swourd
  answer|w|n|s|The king waited for an ___ to his letter.|anser|answere
  climb|b|c|m|The guards had to ___ the tower stairs every night.|clim|climbe
  doubt|b|d|t|There was no ___ that the castle was safe.|dout|doupt
  lamb|b|l|m|The shepherd carried the little ___ home.|lam|lambe
  thumb|b|t|m|The jester pricked his ___ on a needle.|thum|thumbe
  comb|b|c|m|The lady used an ivory ___ for her hair.|com|combe
  crumb|b|c|m|The mouse ate every ___ under the table.|crum|crumbe
  gnaw|g|n|w|Rats would ___ at the sacks of grain.|naw|gnau
  gnome|g|n|m|The story told of a ___ who lived under the bridge.|nome|gnom
  sign|g|s|n|A painted ___ hung outside the baker's shop.|sine|sighn
  design|g|d|s|The weaver chose a ___ of red and gold.|desine|desighn
  castle|t|c|l|The ___ stood on a hill above the river.|casle|cassle
  listen|t|l|n|The children would ___ to the traveling singer.|lisen|lissen
  whistle|t|w|l|The guard blew a ___ to warn the town.|whisle|whissle
  fasten|t|f|n|The knight had to ___ his armor with straps.|fasen|fassen
  island|s|l|d|The monks built their home on a small ___.|iland|islend
  hour|h|r|o|The bells rang every ___ of the day.|our|houre
  honest|h|n|t|The judge was known as an ___ man.|onest|honnest
  half|l|h|f|The baker gave ___ of the loaf to the beggar.|haf|halfe
  calf|l|c|f|The farmer's cow had a new ___ in spring.|caf|calfe
  autumn|n|t|m|In ___, the peasants brought in the harvest.|autum|awtumn
  column|n|c|m|A stone ___ held up the roof of the hall.|colum|collum
  ghost|h|g|t|People said a ___ walked the castle halls at night.|gost|goast
  knob|k|n|b|Turn the ___ to open the cupboard.|nob|knobb
  knit|k|n|t|Grandma likes to ___ warm socks.|nit|knitt
  know|k|n|o|Do you ___ the way to the station?|no|knoe
  knew|k|n|e|She ___ the answer right away.|new|knue
  knelt|k|n|l|The boy ___ down to tie his shoe.|nelt|kneelt
  knowledge|k|n|l|Books give us ___ about the world.|nowledge|knowlege
  knead|k|n|d|The baker will ___ the dough.|nead|kneed
  knives|k|n|v|The ___ are in the top drawer.|nives|knifes
  wrench|w|r|n|Dad used a ___ to loosen the bolt.|rench|wrensh
  wren|w|r|n|A tiny ___ sang on the fence.|ren|wrenn
  wrinkle|w|r|n|There is a ___ in my shirt.|rinkle|wrinkel
  wriggle|w|r|g|The worm began to ___ in the soil.|riggle|wrigle
  wrestle|w|r|s|The puppies like to ___ on the rug.|ressle|wressle
  wreath|w|r|t|We hung a ___ of holly on the door.|reath|wreeth
  wrote|w|r|t|She ___ a letter to her friend.|rote|wroat
  whole|w|h|l|He ate the ___ pizza by himself.|hole|whol
  who|w|h|o|I wonder ___ left the door open.|ho|whoo
  numb|b|n|m|My fingers were ___ from the cold.|num|numbe
  limb|b|l|m|The owl sat on a high ___ of the tree.|lim|limbe
  tomb|b|t|m|The old king was buried in a stone ___.|tom|toomb
  plumber|b|p|m|The ___ fixed the leaking pipe.|plumer|plummer
  debt|b|d|t|He paid back his ___ to the bank.|det|dett
  gnat|g|n|t|A ___ buzzed near my ear.|nat|gnatt
  campaign|g|c|m|The class ran a ___ to save the park.|campain|campane
  align|g|l|n|Please ___ the chairs in a straight row.|aline|alighn
  glisten|t|g|l|The snow will ___ in the morning sun.|glissen|glisen
  hustle|t|h|s|We had to ___ to catch the bus.|hussle|husle
  bustle|t|b|s|The market was full of noise and ___.|bussle|busle
  rustle|t|r|s|I heard the dry leaves ___.|russle|rusle
  thistle|t|l|s|A purple ___ grew by the gate.|thissle|thisle
  nestle|t|n|l|The kitten likes to ___ in my lap.|nessle|nesle
  soften|t|s|f|Butter will ___ in the warm kitchen.|soffen|sofen
  moisten|t|m|s|Please ___ the sponge before you wipe the table.|moisen|moissen
  honor|h|n|r|It is an ___ to meet the mayor.|onor|honnor
  heir|h|r|e|The prince is the ___ to the throne.|air|hair
  rhyme|h|r|m|The words *cat* and *hat* ___.|ryme|rime
  school|h|s|l|We walk to ___ together.|scool|skool
  chorus|h|c|r|The whole class sang the ___.|corus|chorous
  echo|h|e|c|We heard an ___ in the cave.|eco|ecko
  character|h|c|r|My favorite ___ in the book is the fox.|caracter|charactor
  talk|l|t|k|Let us ___ about the trip.|tak|tauk
  walk|l|w|k|We ___ the dog every evening.|wak|wauk
  chalk|l|a|k|The teacher wrote on the board with ___.|chak|chauk
  folk|l|f|k|My grandpa likes old ___ songs.|fok|foke
  yolk|l|y|k|I dipped my toast in the egg ___.|yok|yoke
  could|l|c|d|I ___ not find my other shoe.|coud|cood
  would|l|w|d|I ___ like a glass of water.|woud|wood
  salmon|l|s|m|We grilled ___ for dinner.|samon|sammon
  palm|l|p|m|She held the shell in the ___ of her hand.|pam|parm
  calm|l|c|m|The sea was ___ this morning.|cam|carm
  solemn|n|s|m|The ceremony was quiet and ___.|solem|sollem
  scissors|c|s|r|Cut the paper with ___.|sissors|scisors
  science|c|s|n|We did an experiment in ___ class.|sience|sciense
  scene|c|s|n|The last ___ of the play was funny.|sene|seen
  muscle|c|m|s|Swimming builds every ___ in your body.|mussle|muscel
  scent|c|s|n|The roses have a sweet ___.|sent|cent
  ascend|c|s|d|The climbers will ___ the hill at dawn.|asend|assend
  descend|c|s|d|The plane began to ___ toward the runway.|desend|dessend
  guess|u|g|s|Can you ___ how old I am?|gess|guesss
  guitar|u|g|t|He plays the ___ in a band.|gitar|guittar
  guard|u|g|d|A ___ stood at the gate.|gard|guardd
  guide|u|g|d|Our ___ showed us the caves.|gide|giude
  build|u|b|d|We will ___ a treehouse this summer.|bild|biuld
  biscuit|u|b|t|She ate a ___ with her tea.|biscit|bisquit
  tongue|u|t|g|The dog licked me with its ___.|tonge|tung
  two|w|t|o|I have ___ brothers.|to|tow
  Wednesday|d|W|n|We have art class on ___.|Wensday|Wednsday
  handsome|d|h|s|The prince was tall and ___.|hansome|handsom
  cupboard|p|c|b|The cups are in the ___.|cubboard|cupbord
  raspberry|p|r|b|I picked a ___ from the bush.|rasberry|raspbery
  ballet|t|b|l|My sister takes ___ lessons.|balley|ballay
  climber|b|c|m|The ___ reached the top of the cliff.|climer|climbre
  exhaust|h|x|s|The long hike will ___ us.|exaust|exhast
  exhibit|h|x|b|The museum has a new ___ of masks.|exibit|exhibbit
  vehicle|h|v|c|A truck is a large ___.|veicle|vehical
  rhino|h|r|n|A ___ has a horn on its nose.|rino|rhyno
  wrapper|w|r|p|Put the candy ___ in the bin.|rapper|wraper
  writer|w|r|t|The ___ signed my copy of her book.|riter|writter
`;

const silentRows = fields(silentLines).map(([word, silent, o1, o2, shown, w1, w2]) => {
  if (!word || !silent || !o1 || !o2 || !shown || !w1 || !w2) throw new Error(`a silent-letter line needs seven fields: ${word}`);
  return { word, silent, other: [o1, o2] as const, shown, wrong: [w1, w2] as const };
});

/** silentFindBank asks for the silent letter of a word. */
const silentFindBank: readonly Item[] = silentRows.map((row) => ({
  question: t(`Which letter of *${row.word}* is written but not heard?`, `*${row.word}* 中哪个字母写出来却不发音？`),
  shown: "",
  right: row.silent,
  wrong: row.other,
  why: t(
    `In *${row.word}* the **${row.silent}** is silent. Say the word slowly: you never hear the ${row.silent}, but it has been written for hundreds of years, since people once said it.`,
    `*${row.word}* 中的 **${row.silent}** 不发音。慢慢读这个词：你听不到 ${row.silent}，但几百年来人们一直写它，因为从前人们是读出来的。`,
  ),
  whyNot: row.other.map((o) =>
    t(
      `You can hear the *${o}* when you say *${row.word}* aloud, so it is not silent. Look for the letter you write but never say.`,
      `大声读 *${row.word}* 时能听到 *${o}*，所以它不是不发音的字母。找出写了却从不读出来的那个字母。`,
    ),
  ),
}));

/** silentSpellBank asks for the right spelling of a word with a silent letter in a sentence. */
const silentSpellBank: readonly Item[] = silentRows.map((row) => ({
  question: t("Which spelling completes the sentence?", "哪个拼写能补全句子？"),
  shown: row.shown,
  right: row.word,
  wrong: row.wrong,
  why: t(
    `${fill(row.shown, row.word)} The word keeps its silent **${row.silent}**, which you must write even though you do not hear it.`,
    `${fill(row.shown, row.word)} 这个词保留不发音的 **${row.silent}**，虽然听不到，但一定要写出来。`,
  ),
  whyNot: row.wrong.map((w) =>
    t(
      `“${w}” is not the spelling of the word in this sentence: the word is *${row.word}*, with a silent *${row.silent}* and no extra letters.`,
      `“${w}” 不是这个句子里那个词的拼写：应该是 *${row.word}*，有一个不发音的 *${row.silent}*，也没有多余的字母。`,
    ),
  ),
}));

// ie and ei.

const ieRules = {
  i: [
    "*i* comes before *e* when the sound is long *ee* and there is no *c* just before it",
    "发长音 *ee* 且前面不是 *c* 时，*i* 在 *e* 前",
  ],
  c: ["after *c*, the *e* comes first", "在 *c* 后面，*e* 在前"],
  a: [
    "when the letters say /ay/, as in *neighbor* and *weigh*, the *e* comes first",
    "字母读作 /ay/ 时，例如 *neighbor* 和 *weigh*，*e* 在前",
  ],
  x: ["this word breaks the rule and has to be learned by heart", "这个词不符合规则，需要记住"],
} as const;

const ieLines = `
  piece|peice|peace|a part of something|一部分|The art teacher gave each of us a ___ of clay.|i|May I have a ___ of your orange?
  field|feild|feeld|an open area of land|一片田野|The painter set up her easel in a ___ of poppies.|i|The cows rested in the ___ by the river.
  believe|beleive|belive|to think something is true|相信|I ___ that this painting is very old.|i|Do you ___ in dragons?
  chief|cheif|cheef|the leader of a group|首领|The ___ of the village asked for a new mural.|i|The fire ___ thanked the volunteers.
  thief|theif|theef|a person who steals|小偷|A ___ once stole a famous painting from the museum.|i|The ___ ran off with my bike.
  shield|sheild|sheeld|something carried to block blows|盾牌|The knight's ___ was painted with a lion.|i|Sunglasses ___ your eyes from the sun.
  niece|neice|neece|the daughter of your brother or sister|侄女或外甥女|My aunt drew a portrait of her ___.|i|My uncle took his ___ to the zoo.
  brief|breif|breef|short|简短的|The guide gave a ___ talk about each sculpture.|i|We had a ___ chat at the gate.
  grief|greif|greef|deep sadness|悲痛|The painting showed a mother's ___.|i|The family's ___ was shared by the whole town.
  relief|releif|releaf|the good feeling when worry ends|宽慰|It was a ___ when the statue arrived safely.|i|Rain brought ___ to the dry farms.
  yield|yeild|yeeld|to give or produce|产出|These grapes ___ a dark purple dye.|i|Cars must ___ to people at the crossing.
  shriek|shreik|shreek|a loud, high scream|尖叫|The child let out a ___ when she saw the giant statue.|i|A ___ of laughter came from the playground.
  priest|preist|preest|a leader of worship|神父|The ___ asked an artist to paint the chapel walls.|i|The ___ rang the bell for the wedding.
  fierce|feirce|feerce|wild and strong|凶猛的|The mask had a ___ face with sharp teeth.|i|A ___ wind blew all night.
  receive|recieve|receeve|to get something given to you|收到|The winners will ___ a set of paints.|c|Did you ___ my postcard?
  ceiling|cieling|seiling|the top of a room|天花板|The artist lay on his back to paint the ___.|c|A spider hung from the ___.
  receipt|reciept|receit|a paper that shows you paid|收据|Keep the ___ for the frame you bought.|c|The shop gave me a ___ for the shoes.
  deceive|decieve|deceeve|to make someone believe something false|欺骗|The painted door was made to ___ the eye.|c|A mirror can ___ you about the size of a room.
  conceited|concieted|conceeted|too proud of yourself|自负的|The ___ artist said his work was the best in the land.|c|Nobody likes a ___ winner.
  perceive|percieve|perceeve|to notice or understand|察觉|Some people ___ a face in the clouds of the painting.|c|Owls ___ tiny sounds in the dark.
  weigh|wiegh|wey|to find how heavy something is|称重|The movers had to ___ the marble statue.|a|Please ___ the apples on the scale.
  neighbor|nieghbor|naybor|a person who lives next to you|邻居|Our ___ paints pictures of birds.|a|Our ___ waters our plants when we are away.
  eight|ieght|eigth|the number after seven|八|The museum has ___ rooms of paintings.|a|The spider has ___ legs.
  vein|vien|vane|a tube that carries blood, or a line in stone|纹理|A gray ___ ran through the white marble.|a|Blood flows back to the heart through a ___.
  reign|riegn|rein|the time a king or queen rules|统治时期|The portrait was painted during the queen's ___.|a|The king's ___ lasted forty years.
  sleigh|sliegh|slay|a sled pulled by animals|雪橇|The painting showed a ___ crossing the snowy hills.|a|We rode in a ___ through the snowy woods.
  freight|frieght|frate|goods carried by train, truck or ship|货物|The statues traveled by ___ train.|a|The ___ train carried coal to the city.
  beige|biege|bayge|a pale brownish color|米色|The walls of the gallery are painted ___.|a|She wore a ___ coat.
  their|thier|there|belonging to them|他们的|The students hung ___ paintings in the hall.|x|The kids packed ___ lunches.
  weird|wierd|weerd|very strange|怪异的|The sculpture had a ___ shape that looked like a melting clock.|x|I heard a ___ noise in the attic.
  height|hieght|hight|how tall something is|高度|The ___ of the statue is three meters.|x|Write your ___ on the chart.
  seize|sieze|seeze|to grab suddenly|抓住|The guards rushed to ___ the thief.|x|The eagle swooped to ___ the fish.
  foreign|foriegn|forein|from another country|外国的|Many ___ visitors come to see the cave paintings.|x|Learning a ___ language takes time.
  either|iether|eather|one or the other of two|两者之一|You can paint with ___ a brush or a sponge.|x|You may choose ___ the red one or the blue one.
  protein|protien|proteen|a part of food that builds the body|蛋白质|Egg white is full of ___, and painters once mixed it with color.|x|Beans are a good source of ___.
  achieve|acheive|acheeve|to reach a goal by working|实现|She worked hard to ___ her dream.|i|If we practice, we can ___ a lot.
  siege|seige|seege|a long attack on a town|围攻|The castle held out during the long ___.|i|The ___ lasted all winter.
  pierce|peirce|peerce|to make a hole through|刺穿|A thorn can ___ a balloon.|i|The sharp beak can ___ a shell.
  pier|peir|peer|a walkway built out over water|码头|We fished from the end of the ___.|i|The boat tied up at the ___.
  retrieve|retreive|retreeve|to go and bring back|取回|The dog ran to ___ the stick.|i|Can you ___ my ball from the roof?
  grieve|greive|greeve|to feel deep sadness|悲伤|It is normal to ___ when a pet dies.|i|The town will ___ for the old oak.
  wield|weild|weeld|to hold and use a tool or weapon|挥舞|Only the hero could ___ the heavy sword.|i|The chef can ___ a knife with great skill.
  relieve|releive|releeve|to make pain or worry less|减轻|Rest will ___ the pain in your leg.|i|A cool drink can ___ your thirst.
  conceive|concieve|conceeve|to form an idea in your mind|构想|Can you ___ of a world without books?|c|It is hard to ___ how big space is.
  deceit|deciet|deceet|tricking people with lies|欺骗|The fox won by ___, not by speed.|c|The story warns against ___.
  conceit|conciet|conceet|too much pride in yourself|自负|His ___ annoyed the other players.|c|She spoke about her prize without any ___.
  weight|wieght|wate|how heavy something is|重量|The ___ of the box surprised us.|a|Check the ___ of the bag before the flight.
  neigh|niegh|nay|the sound a horse makes|马嘶声|We heard the horse ___ in the barn.|a|The pony gave a loud ___.
  reindeer|riendeer|raindeer|a deer of cold northern lands|驯鹿|A ___ has wide hooves for walking on snow.|a|The ___ pulled a sled across the ice.
  veil|viel|vale|a thin cloth that covers the face|面纱|The bride wore a long white ___.|a|A ___ of fog hid the hills.
  rein|rien|rane|a strap used to guide a horse|缰绳|Hold the ___ firmly when you ride.|a|She pulled on the left ___.
  eighteen|ieghteen|ateen|the number after seventeen|十八|My cousin turns ___ next week.|a|There are ___ students in the club.
  neither|niether|neether|not one and not the other|两者都不|I like ___ of the two shirts.|x|We chose ___ path, and went home instead.
  leisure|liesure|leasure|free time to rest or play|闲暇|Reading is my favorite ___ activity.|x|Sunday is a day of ___.
  caffeine|caffiene|caffeen|a substance in coffee that keeps you awake|咖啡因|Coffee and tea contain ___.|x|Children should not have much ___.
  forfeit|forfiet|forfit|to lose by breaking a rule or not showing up|弃权|If they do not come, they will ___ the game.|x|The team had to ___ the match.
  ancient|anceint|ancent|very old|古老的|We visited an ___ temple.|x|The ___ map was hard to read.
  science|sceince|sciance|the study of the natural world|科学|We grew beans in ___ class.|x|She loves ___ and math.
  friend|freind|frend|a person you like and trust|朋友|My best ___ lives next door.|x|I wrote a card to my ___.
  efficient|efficeint|efficent|working well without waste|高效的|This new lamp is very ___.|x|An ___ worker finishes on time.
`;

const ieRows = fields(ieLines).map(([word, swap, other, en, zh, shown, rule, shown2]) => {
  if (!word || !swap || !other || !en || !zh || !shown || !rule || !(rule in ieRules) || !shown2?.includes("___"))
    throw new Error(`an ie line needs eight fields: ${word}`);
  return {
    word,
    wrong: [swap, other] as const,
    meaning: [en, zh] as const,
    shown,
    shown2,
    rule: ieRules[rule as keyof typeof ieRules],
  };
});

const ieWhy = (row: (typeof ieRows)[number], shown: string = row.shown): Text =>
  t(
    `${fill(shown, row.word)} In *${row.word}*, ${row.rule[0]}. The rule: *i* before *e*, except after *c*, or when it sounds like /ay/.`,
    `${fill(shown, row.word)} 在 *${row.word}* 中，${row.rule[1]}。规则是：*i* 在 *e* 前，*c* 后例外，读作 /ay/ 时也例外。`,
  );

/** ieChoiceBank asks for the spelling of a word with ie or ei in a sentence. */
const ieChoiceBank: readonly Item[] = ieRows.flatMap((row) =>
  [row.shown, row.shown2].map((shown) => ({
    question: t("Which spelling completes the sentence?", "哪个拼写能补全句子？"),
    shown,
    right: row.word,
    wrong: row.wrong,
    why: ieWhy(row, shown),
    whyNot: [
      t(
        `“${row.wrong[0]}” puts the two letters in the wrong order. In *${row.word}*, ${row.rule[0]}.`,
        `“${row.wrong[0]}” 把两个字母的顺序弄反了。在 *${row.word}* 中，${row.rule[1]}。`,
      ),
      t(
        `“${row.wrong[1]}” spells the sound as it is heard, but the word is written with *${row.word.includes("ie") ? "ie" : "ei"}*.`,
        `“${row.wrong[1]}” 按照读音来拼写，但这个词要用 *${row.word.includes("ie") ? "ie" : "ei"}* 来写。`,
      ),
    ],
  })),
);

const ieTypedBank: readonly TypedItem[] = ieRows.flatMap((row) =>
  [row.shown2, row.shown].map((shown) => ({
    shown,
    accepted: [row.word],
    wrong: [...row.wrong],
    instruction: t(`The missing word means ${row.meaning[0]}.`, `缺少的词意思是“${row.meaning[1]}”。`),
  })),
);

const ieRowOf = (word: string) => ieRows.find((row) => row.word === word);

/** spellingTopics4 are the spelling topics of grade 4. */
export const spellingTopics4: readonly TopicDef[] = [
  {
    id: "spelling-tion-and-sion",
    title: t("Spelling -tion and -sion", "拼写 -tion 和 -sion"),
    summary: t(
      "Nouns made from verbs end in -tion or -sion, following the end of the verb: erupt, eruption; erode, erosion.",
      "由动词构成的名词以 -tion 或 -sion 结尾，取决于动词的结尾：erupt 变 eruption，erode 变 erosion。",
    ),
    prerequisites: ["common-suffixes"],
    encompasses: [{ topic: "common-suffixes", weight: 0.2 }],
    xp: 14,
    strand: "grammar",
    knowledgePoints: [
      point(
        "choosing-tion-or-sion",
        t("Choosing -tion or -sion", "选择 -tion 还是 -sion"),
        t(
          "Many nouns are made by adding *-ion* to a verb, and the end of the verb tells you how to spell it.\n\n- A verb ending in *t* adds *-ion*: *erupt*, *eruption*; *collect*, *collection*.\n- A verb ending in *-ate* drops the *e*: *create*, *creation*.\n- A verb ending in *d* or *de* drops it and takes *-sion*: *erode*, *erosion*; *divide*, *division*; *extend*, *extension*.\n- A verb ending in *ss* adds *-ion*: *discuss*, *discussion*.\n- A verb ending in *-mit* becomes *-mission*: *admit*, *admission*.",
          "很多名词是在动词后加 *-ion* 构成的，动词的结尾告诉你怎么拼写。\n\n- 以 *t* 结尾的动词加 *-ion*：*erupt*、*eruption*；*collect*、*collection*。\n- 以 *-ate* 结尾的动词去掉 *e*：*create*、*creation*。\n- 以 *d* 或 *de* 结尾的动词去掉它们，加 *-sion*：*erode*、*erosion*；*divide*、*division*；*extend*、*extension*。\n- 以 *ss* 结尾的动词加 *-ion*：*discuss*、*discussion*。\n- 以 *-mit* 结尾的动词变成 *-mission*：*admit*、*admission*。",
        ),
        itemGenerator(nounChoiceBank),
      ),
      point(
        "typing-tion-and-sion-nouns",
        t("Typing the Noun", "输入名词"),
        t(
          "Now write the noun yourself. Say the verb, look at its last letters, and use the rule: *t* and *-ate* give *-tion*, *d* and *de* give *-sion*, *ss* gives *-ssion*, and *-mit* gives *-mission*. Check that you did not keep a letter the rule drops, as in *erodtion*.",
          "现在自己写出名词。读出动词，看它的最后几个字母，然后用规则：*t* 和 *-ate* 变成 *-tion*，*d* 和 *de* 变成 *-sion*，*ss* 变成 *-ssion*，*-mit* 变成 *-mission*。检查你有没有保留规则要求去掉的字母，例如 *erodtion*。",
        ),
        typedGenerator(
          "word-form",
          t("Type the noun that completes the sentence.", "输入能补全句子的名词。"),
          nounTypedBank,
          (right, shown) => {
            const row = nounRows.find((r) => r.noun === right);
            return row ? nounWhy(row, shown) : t(fill(shown, right), fill(shown, right));
          },
        ),
      ),
    ],
  },
  {
    id: "spelling-silent-letters",
    title: t("Spelling with Silent Letters", "含不发音字母的拼写"),
    summary: t(
      "Some letters are written but not heard: k in knight, w in wrist and sword, b in climb, g in gnaw, t in castle.",
      "有些字母写出来却不发音：knight 中的 k，wrist 和 sword 中的 w，climb 中的 b，gnaw 中的 g，castle 中的 t。",
    ),
    prerequisites: after("spelling-ck-tch-and-dge"),
    encompasses: [],
    xp: 14,
    strand: "grammar",
    knowledgePoints: [
      point(
        "finding-silent-letters",
        t("Finding the Silent Letter", "找出不发音的字母"),
        t(
          "English keeps many letters people stopped saying long ago. Learn them in groups:\n\n- *k* before *n*: *knight*, *knee*, *knife*.\n- *w* before *r*: *wrist*, *write*, and also *sword* and *answer*.\n- *b* after *m* or before *t*: *climb*, *lamb*, *doubt*.\n- *g* before *n*: *gnaw*, *sign*, *design*.\n- *t* after *s*: *castle*, *listen*, *whistle*.\n- *h*, *l* and *n* in words such as *hour*, *half* and *autumn*.",
          "英语保留了许多人们很久以前就不再读出来的字母。按组来记：\n\n- *n* 前的 *k*：*knight*、*knee*、*knife*。\n- *r* 前的 *w*：*wrist*、*write*，还有 *sword* 和 *answer*。\n- *m* 后或 *t* 前的 *b*：*climb*、*lamb*、*doubt*。\n- *n* 前的 *g*：*gnaw*、*sign*、*design*。\n- *s* 后的 *t*：*castle*、*listen*、*whistle*。\n- *hour*、*half*、*autumn* 这类词中的 *h*、*l* 和 *n*。",
        ),
        itemGenerator(silentFindBank),
      ),
      point(
        "spelling-words-with-silent-letters",
        t("Choosing the Spelling", "选择拼写"),
        t(
          "When you write a word with a silent letter, you cannot trust your ears. Picture the word, remember its group (*kn*, *wr*, *mb*, *gn*, *stle*), and write the letter you do not hear. Some words without it are other words: *night* is not *knight*, and *rap* is not *wrap*.",
          "写含不发音字母的词时，不能只靠耳朵。在脑子里想出这个词的样子，记住它属于哪一组（*kn*、*wr*、*mb*、*gn*、*stle*），把听不到的字母写出来。有些词少了这个字母就成了别的词：*night* 不是 *knight*，*rap* 也不是 *wrap*。",
        ),
        itemGenerator(silentSpellBank),
      ),
    ],
  },
  {
    id: "spelling-ie-and-ei",
    title: t("Spelling ie and ei", "拼写 ie 和 ei"),
    summary: t(
      "I comes before e except after c or when the sound is /ay/, with a few exceptions to learn: their, weird, height.",
      "i 在 e 前，c 后或读作 /ay/ 时例外，还有几个要记住的特例：their、weird、height。",
    ),
    prerequisites: after("spelling-ck-tch-and-dge"),
    encompasses: [],
    xp: 14,
    strand: "grammar",
    knowledgePoints: [
      point(
        "choosing-ie-or-ei",
        t("Choosing ie or ei", "选择 ie 还是 ei"),
        t(
          "The old rhyme helps: *i before e, except after c, or when sounded like /ay/, as in neighbor and weigh*.\n\n- *ie* for the long *ee* sound: *piece*, *field*, *believe*, *chief*.\n- *ei* after *c*: *receive*, *ceiling*, *receipt*.\n- *ei* for the /ay/ sound: *eight*, *vein*, *reign*.\n\nA few common words break the rule and must be learned: *their*, *weird*, *height*, *seize*, *foreign*, *either*.",
          "一句老口诀能帮忙：*i 在 e 前，c 后例外，读作 /ay/ 时也例外，例如 neighbor 和 weigh*。\n\n- 长音 *ee* 用 *ie*：*piece*、*field*、*believe*、*chief*。\n- *c* 后用 *ei*：*receive*、*ceiling*、*receipt*。\n- 读作 /ay/ 用 *ei*：*eight*、*vein*、*reign*。\n\n有几个常用词不守规则，必须记住：*their*、*weird*、*height*、*seize*、*foreign*、*either*。",
        ),
        itemGenerator(ieChoiceBank),
      ),
      point(
        "typing-ie-and-ei-words",
        t("Typing ie and ei Words", "输入 ie 和 ei 单词"),
        t(
          "Now type the word from its meaning. Decide on the sound first: long *ee*, or /ay/? Then check for a *c* just before the two letters. If the word is one of the exceptions, such as *their* or *height*, spell it from memory.",
          "现在根据词义输入单词。先判断读音：是长音 *ee* 还是 /ay/？再看这两个字母前面是不是 *c*。如果这个词是 *their*、*height* 这样的特例，就凭记忆拼写。",
        ),
        typedGenerator(
          "word-form",
          t("Type the word that completes the sentence.", "输入能补全句子的单词。"),
          ieTypedBank,
          (right, shown) => {
            const row = ieRowOf(right);
            return row ? ieWhy(row, shown) : t(right, right);
          },
        ),
      ),
    ],
  },
];
