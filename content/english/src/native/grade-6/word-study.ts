// Grade 6: word study: Latin and Greek roots, prefixes of number and of place, adages and proverbs, and words that
// English borrowed from other languages.

import type { TopicDef } from "@ga/content";
import type { ChoiceItem } from "@ga/subject-english";
import { choose, field, partLines, parts, rows, topic } from "./kit.ts";

const latin = partLines(`
  capt|take or seize|拿，抓|capture|to take a person or an animal by force|captive|a person who has been taken and held prisoner|captivate|to take hold of someone's attention completely
  fac|make or do|做，制作|factory|a building where goods are made|manufacture|to make goods in large numbers with machines|facility|a building or place made for a particular use
  mot|move|移动|motion|the act of moving|motor|a machine that makes something move|promote|to move someone up to a higher rank
  junct|join|连接|junction|a place where roads or railway lines join|conjunction|a word such as and or but that joins parts of a sentence|juncture|a point in time where events join or meet
  sect|cut|切，割|dissect|to cut something apart to study it|section|one of the parts that something is cut or divided into|intersect|to cut across each other, as two roads do
  pend|hang|悬挂|pendant|a jewel that hangs from a chain around the neck|pendulum|a weight that hangs and swings to keep a clock's time|suspend|to hang something from above
  cur|run|跑，流|current|water or air that runs in one direction|courier|a person who runs to carry messages or packages|recur|to run again; to happen again and again
  fid|faith or trust|信任|confide|to tell a secret to someone you trust|fidelity|faithfulness to a person or a promise|confident|trusting in yourself and your abilities
  loc|place|地方|locate|to find the place where something is|local|belonging to a particular place nearby|relocate|to move to a new place
  vert|turn|转|convert|to turn something into something else|reverse|to turn back the other way|vertigo|a dizzy feeling that everything is turning around
`);

const latinRoots3 = parts({
  id: "latin-roots-3",
  title: ["Latin Roots 3", "拉丁词根 3"],
  summary: [
    "Ten more Latin roots: capt, fac, mot, junct, sect, pend, cur, fid, loc and vert.",
    "另外十个拉丁词根：capt、fac、mot、junct、sect、pend、cur、fid、loc 和 vert。",
  ],
  after: ["latin-roots-2"],
  kind: ["Latin root", "拉丁词根"],
  list: latin,
  explanations: [
    [
      "These Latin roots carry the meaning of many words. *Capt* means take, *fac* make or do, *mot* move, *junct* join, *sect* cut, *pend* hang, *cur* run, *fid* trust, *loc* place and *vert* turn. A root can sit at the start, middle or end of a word, with prefixes and suffixes around it: *re-loc-ate*, *pro-mot-e*.",
      "这些拉丁词根承载着许多词的意思。*capt* 意为拿，*fac* 做，*mot* 移动，*junct* 连接，*sect* 切，*pend* 悬挂，*cur* 跑，*fid* 信任，*loc* 地方，*vert* 转。词根可以在词的开头、中间或结尾，前后带着前缀和后缀：*re-loc-ate*、*pro-mot-e*。",
    ],
    [
      "To choose a word from its meaning, look for the root that carries the meaning you need. Something that *turns back* holds *vert*; a place where roads *join* holds *junct*; water that *runs* in one direction holds *cur*. Then check that the rest of the word fits: *-ion* makes a noun, *-ate* often a verb.",
      "根据意思选词时，找出承载所需意思的词根。“转回去”的东西含有 *vert*；道路“连接”的地方含有 *junct*；朝一个方向“流”的水含有 *cur*。再看词的其他部分是否合适：*-ion* 构成名词，*-ate* 常构成动词。",
    ],
  ],
});

const greek = partLines(`
  seism|shake or earthquake|震动，地震|seismograph|an instrument that records the shaking of an earthquake|seismic|to do with earthquakes or shaking of the earth|seismologist|a scientist who studies earthquakes
  chrom|color|颜色|monochrome|having only one color|chromatic|to do with color|chromosome|a thread-like body in a cell, named for how it takes up colored dye
  gen|birth or kind|出生，种类|generation|all the people born at about the same time|genetic|to do with the traits passed on at birth|genealogy|the study of a family's history and ancestors
  path|feeling or disease|感情，疾病|sympathy|feeling sorry for someone else's trouble|pathologist|a doctor who studies diseases|empathy|the ability to share another person's feelings
  crat|rule or power|统治，权力|democrat|a person who believes in rule by the people|bureaucrat|an official who follows the rules of a government office|autocrat|a ruler who has all the power
  dem|people|人民|democracy|government by the people|epidemic|a disease that spreads among many people at once|demographic|to do with the size and makeup of a population
  poli|city|城市|metropolis|a very large and important city|police|the people who keep order in a city or country|politics|the business of running a city or country
  lith|stone|石头|monolith|a single huge block of stone|lithograph|a print made from a flat stone|megalith|a very large stone set up in ancient times
  morph|shape or form|形状|metamorphosis|a complete change of form, as from caterpillar to butterfly|morphology|the study of the shapes of living things or words|amorphous|having no clear shape
  kine|motion|运动|kinetic|to do with movement|cinema|a theater for moving pictures|kinesiology|the study of how the body moves
`);

const greekRoots2 = parts({
  id: "greek-roots-2",
  title: ["Greek Roots 2", "希腊词根 2"],
  summary: [
    "Ten more Greek roots: seism, chrom, gen, path, crat, dem, poli, lith, morph and kine.",
    "另外十个希腊词根：seism、chrom、gen、path、crat、dem、poli、lith、morph 和 kine。",
  ],
  after: ["greek-roots-1"],
  kind: ["Greek root", "希腊词根"],
  list: greek,
  explanations: [
    [
      "Greek roots build many words of science and government. *Seism* means shake, *chrom* color, *gen* birth or kind, *path* feeling or disease, *crat* rule, *dem* people, *poli* city, *lith* stone, *morph* shape and *kine* motion. Two roots often join in one word: *dem* + *cracy* is rule by the people.",
      "希腊词根构成了许多科学和政治方面的词。*seism* 意为震动，*chrom* 颜色，*gen* 出生或种类，*path* 感情或疾病，*crat* 统治，*dem* 人民，*poli* 城市，*lith* 石头，*morph* 形状，*kine* 运动。一个词里常常有两个词根：*dem* 加 *cracy* 就是由人民统治。",
    ],
    [
      "When you need a word for a meaning, think of the Greek root that carries it, then look for that root in the choices. A tool that records *shaking* holds *seism*; a single huge *stone* holds *lith*; a complete change of *shape* holds *morph*. The other parts of the word tell you whether it names a person, a tool or a study.",
      "需要表达某个意思时，先想想承载它的希腊词根，再在选项里找这个词根。记录“震动”的仪器含有 *seism*；一整块巨大的“石头”含有 *lith*；“形状”的彻底改变含有 *morph*。词的其他部分会告诉你它指的是人、工具还是学科。",
    ],
  ],
});

const number = partLines(`
  mono|one or single|单一|monorail|a railway with a single rail|monologue|a long speech by one person|monotone|a sound that stays on one note
  pent|five|五|pentagon|a shape with five sides|pentathlon|a contest made of five events|pentameter|a line of poetry with five beats
  oct|eight|八|octopus|a sea creature with eight arms|octagon|a shape with eight sides|octave|the eight notes from one note to the same note higher up
  deca|ten|十|decade|a period of ten years|decathlon|a contest made of ten events|decagon|a shape with ten sides
  cent|hundred|百|century|a period of one hundred years|centipede|a small creature said to have a hundred legs|centennial|the hundredth anniversary of an event
  kilo|thousand|千|kilometer|one thousand meters|kilogram|one thousand grams|kilowatt|one thousand watts of power
  milli|thousandth|千分之一|millimeter|one thousandth of a meter|milligram|one thousandth of a gram|milliliter|one thousandth of a liter
  quad|four|四|quadrilateral|a shape with four sides|quadruple|to multiply by four|quadrant|one of four equal parts of a circle
  poly|many|多|polygon|a flat shape with many straight sides|polyglot|a person who speaks many languages|polytheism|belief in many gods
  hemi|half|半|hemisphere|half of a sphere, such as half of the Earth|hemicycle|a half circle of seats or rooms|hemiplegia|weakness of one half of the body
`);

const numberPrefixes = parts({
  id: "prefixes-of-number-and-amount",
  title: ["Prefixes of Number and Amount", "表示数目和数量的前缀"],
  summary: [
    "Mono- one, quad- four, pent- five, oct- eight, deca- ten, cent- hundred, kilo- thousand, milli- thousandth, poly- many and hemi- half.",
    "mono- 一，quad- 四，pent- 五，oct- 八，deca- 十，cent- 百，kilo- 千，milli- 千分之一，poly- 多，hemi- 半。",
  ],
  after: ["prefixes-of-number-and-position"],
  kind: ["prefix", "前缀"],
  list: number,
  explanations: [
    [
      "You know *uni-*, *bi-* and *tri-*. Greek and Latin gave English more prefixes that tell **how many**: *mono-* one, *quad-* four, *pent-* five, *oct-* eight, *deca-* ten, *cent-* a hundred, *kilo-* a thousand, *milli-* a thousandth, *poly-* many and *hemi-* half. They fill the language of math and measurement: a *pentagon*, a *decade*, a *kilometer*, a *millimeter*.",
      "你已经认识 *uni-*、*bi-* 和 *tri-*。希腊语和拉丁语还给了英语更多表示**数目**的前缀：*mono-* 一，*quad-* 四，*pent-* 五，*oct-* 八，*deca-* 十，*cent-* 百，*kilo-* 千，*milli-* 千分之一，*poly-* 多，*hemi-* 半。数学和度量的词里到处是它们：*pentagon*、*decade*、*kilometer*、*millimeter*。",
    ],
    [
      "To choose a word for a definition, find the number in the definition and match it to the prefix: *eight arms* points to *oct-*, *half of a sphere* to *hemi-*, *ten years* to *deca-*. *Kilo-* makes a unit a thousand times bigger and *milli-* a thousand times smaller, so do not mix them up.",
      "根据定义选词时，找出定义中的数目，再与前缀对应：*eight arms* 指向 *oct-*，*half of a sphere* 指向 *hemi-*，*ten years* 指向 *deca-*。*kilo-* 让单位大一千倍，*milli-* 让单位小一千倍，不要混淆。",
    ],
  ],
});

const place = partLines(`
  ex|out of|出，向外|exit|the way out of a place|exhale|to breathe out|extract|to pull something out
  intra|within|在……内部|intramural|happening within one school|intravenous|within a vein, as medicine given through a tube|intrastate|within the borders of one state
  circum|around|环绕|circumference|the distance around a circle|circumnavigate|to sail all the way around something|circumstance|a fact or condition that surrounds an event
  peri|around the edge|周边|perimeter|the distance around the edge of a shape|periscope|a tube for looking around from below the water|periphery|the outer edge of an area
  pro|forward|向前|propel|to push something forward|progress|forward movement toward a goal|protrude|to stick out forward from a surface
  retro|backward|向后|retrospect|looking back on the past|retroactive|working backward to apply to an earlier time|retrorocket|a rocket that fires backward to slow a spacecraft
  extra|outside or beyond|在……之外|extraordinary|beyond what is ordinary|extracurricular|outside the regular lessons of a school|extraterrestrial|from outside the Earth
  contra|against|反对，相反|contradict|to say the opposite of what someone said|contrast|a difference that sets one thing against another|contraband|goods brought in against the law
  ante|before|在……之前|antecedent|a thing that comes before another|anteroom|a small room before a larger one|antebellum|from the time before a war
  intro|inward|向内|introvert|a person who turns inward and prefers quiet|introduce|to bring someone in to meet others|introspection|looking inward at your own thoughts
`);

const placePrefixes = parts({
  id: "prefixes-of-place-and-direction",
  title: ["Prefixes of Place and Direction", "表示位置和方向的前缀"],
  summary: [
    "Ex- out, intra- within, circum- around, peri- around the edge, pro- forward, retro- back, extra- beyond, contra- against, ante- before, intro- inward.",
    "ex- 向外，intra- 在内，circum- 环绕，peri- 周边，pro- 向前，retro- 向后，extra- 在外，contra- 相反，ante- 在前，intro- 向内。",
  ],
  after: ["prefixes-of-number-and-position"],
  kind: ["prefix", "前缀"],
  list: place,
  explanations: [
    [
      "You know *sub-*, *super-*, *inter-* and *trans-*. Ten more prefixes tell **where** or **which way**: *ex-* out of, *intra-* within, *circum-* around, *peri-* around the edge, *pro-* forward, *retro-* backward, *extra-* outside or beyond, *contra-* against, *ante-* before and *intro-* inward. Picture the direction and the word often explains itself: to *circumnavigate* is to sail around.",
      "你已经认识 *sub-*、*super-*、*inter-* 和 *trans-*。另外十个前缀表示**位置**或**方向**：*ex-* 向外，*intra-* 在内，*circum-* 环绕，*peri-* 周边，*pro-* 向前，*retro-* 向后，*extra-* 在外或超出，*contra-* 相反，*ante-* 在前，*intro-* 向内。想象这个方向，词义常常不言自明：*circumnavigate* 就是环绕航行。",
    ],
    [
      "Pairs of opposites help: *ex-* goes out and *intro-* goes in; *pro-* moves forward and *retro-* back; *intra-* is inside and *extra-* is outside. *Ante-* (before) is not *anti-* (against), which *contra-* matches. To choose a word, find the direction in the definition and the prefix that names it.",
      "成对的反义前缀很有帮助：*ex-* 向外，*intro-* 向内；*pro-* 向前，*retro-* 向后；*intra-* 在内，*extra-* 在外。*ante-*（在前）不是 *anti-*（反对），与 *anti-* 意思相同的是 *contra-*。选词时，先找出定义中的方向，再找表示这个方向的前缀。",
    ],
  ],
});

// More adages and proverbs: proverb|meaning|use|use|situation|situation
const proverbLines = rows(`
  Rome wasn't built in a day.|big things take time and patience|Learning a language takes years; Rome wasn't built in a day.|Don't give up on your garden, since Rome wasn't built in a day.|It takes Aisha five years of work to finish building her boat.|The town's new library is built bit by bit over many years.
  The pen is mightier than the sword.|writing and ideas can be more powerful than force|Her letters changed the law; the pen is mightier than the sword.|The pen is mightier than the sword, so write to the mayor.|A student's article in the paper persuades the city to save the old park.|A book about the factory leads to new laws that protect workers.
  When in Rome, do as the Romans do.|follow the customs of the place you are in|In Japan we took off our shoes indoors; when in Rome, do as the Romans do.|When in Rome, do as the Romans do, so we ate with chopsticks.|Visiting a country where people bow, Sam bows as well.|At her friend's house, Mia joins the family's custom of singing before dinner.
  Necessity is the mother of invention.|people invent new things when they really need them|With no ladder, we built steps from crates; necessity is the mother of invention.|Necessity is the mother of invention, and the flood led to a new kind of boat.|Stuck on an island without a net, the sailors weave one from vines.|The farmers had no water, so they designed a new way to catch the rain.
  A stitch in time saves nine.|fixing a small problem now saves a lot of work later|Patch the roof before winter; a stitch in time saves nine.|A stitch in time saves nine, so Dad fixed the leaking pipe at once.|Eva mends a small tear in her coat before it grows into a big hole.|Kofi fixes a loose wheel on his bike before it falls off on the road.
  Haste makes waste.|doing things too fast leads to mistakes|I rushed my test and lost points; haste makes waste.|Haste makes waste, so check each step of the recipe.|Rushing to finish, Nate spills paint across the whole floor.|Hurrying through her math homework, Lena makes careless mistakes on every page.
  Birds of a feather flock together.|people who are alike tend to spend time together|The three chess fans always sit together; birds of a feather flock together.|Birds of a feather flock together, so the actors became friends.|All the children who love dinosaurs end up at the same table at lunch.|The new students who play music quickly form a group of their own.
  Absence makes the heart grow fonder.|being apart from someone makes you love them more|While Grandma was away, I missed her more each day; absence makes the heart grow fonder.|Absence makes the heart grow fonder, and the friends wrote every week.|After a summer at camp, Ali can't wait to see his little sister again.|Living far from her best friend, Rosa values their calls more than ever.
  The squeaky wheel gets the grease.|the person who complains loudest gets attention|He kept asking for a better desk and got one; the squeaky wheel gets the grease.|The squeaky wheel gets the grease, so ask again politely.|The neighbor who calls the city every week gets the pothole fixed first.|The child who keeps asking gets the first turn on the swing.
  You can't have your cake and eat it too.|you can't keep two things when choosing one means losing the other|You want to save your money and buy the game; you can't have your cake and eat it too.|You can't have your cake and eat it too: stay up late or feel fresh tomorrow.|Jada wants to join the swim team but also keep every Saturday free.|Leo wants to spend his allowance and still have it saved for the trip.
  Knowledge is power.|knowing things gives you the ability to act well|She read the rules and won the argument; knowledge is power.|Knowledge is power, so learn how your money works.|Because Hana studied the map, she is the one who leads the lost group home.|Knowing the law, the young lawyer helps the family keep their house.
  Strike while the iron is hot.|act quickly while you have a good chance|The coach is in a good mood, so strike while the iron is hot and ask now.|Strike while the iron is hot: the store's sale ends today.|Right after the crowd cheers for her song, Mei asks to play another.|The moment the teacher praises the idea, the class asks to start the project.
  Still waters run deep.|a quiet person may have deep thoughts or feelings|He never talks in class, but his essays are brilliant; still waters run deep.|Still waters run deep, and the shy girl wrote the best poem.|Quiet Mr. Ito turns out to know three languages and to have sailed the world.|The silent boy at the back answers the hardest question of all.
  Fortune favors the bold.|people who take brave risks often succeed|She asked the author for an interview and got one; fortune favors the bold.|Fortune favors the bold, so try out for the lead role.|Though she is nervous, Tia raises her hand to run for class president and wins.|Jamal enters the big science contest as the youngest student and takes first place.
  Too many cooks spoil the broth.|when too many people work on one thing, it goes badly|Ten of us edited the poster and it was a mess; too many cooks spoil the broth.|Too many cooks spoil the broth, so let two people plan the party.|With six people giving directions at once, the tent ends up upside down.|Everyone on the team changes the story, and it no longer makes sense.
`);
const proverbs = proverbLines.map((r) => ({
  proverb: field(r, 0),
  means: field(r, 1),
  uses: [field(r, 2), field(r, 3)],
  situations: [field(r, 4), field(r, 5)],
}));
const proverbMeaning: ChoiceItem[] = [];
const proverbFit: ChoiceItem[] = [];
proverbs.forEach((p, i) => {
  p.uses.forEach((use, k) => {
    const others = [proverbs[(i + 1 + k) % proverbs.length], proverbs[(i + 6 + k) % proverbs.length]];
    proverbMeaning.push([use, p.means, others.map((o) => o?.means ?? "")]);
  });
  p.situations.forEach((s, k) => {
    const others = [proverbs[(i + 2 + k) % proverbs.length], proverbs[(i + 8 + k) % proverbs.length]];
    proverbFit.push([s, p.proverb, others.map((o) => o?.proverb ?? "")]);
  });
});
const proverbByMeaning = (m: string) => proverbs.find((p) => p.means === m)?.proverb ?? "";
const proverbMeans = (p: string) => proverbs.find((x) => x.proverb === p)?.means ?? "";

const adages = topic("vocabulary", {
  id: "more-adages-and-proverbs",
  title: ["More Adages and Proverbs", "更多格言与谚语"],
  summary: [
    "Fifteen more old sayings, such as A stitch in time saves nine and Necessity is the mother of invention.",
    "另外十五句老话，如 A stitch in time saves nine 和 Necessity is the mother of invention。",
  ],
  after: ["adages-and-proverbs"],
  points: [
    choose(
      "what-a-proverb-means",
      ["What a Proverb Means", "谚语的意思"],
      [
        "An **adage** or **proverb** is an old, short saying that gives advice or states a truth most people accept. Its words often paint a picture that is not meant literally: *A stitch in time saves nine* is not about sewing but about fixing a small problem before it grows. Ask what lesson the picture teaches.",
        "**格言**或**谚语**是简短的老话，给出建议或说出大多数人认同的道理。它的字面常常是一幅不按字面理解的画面：*A stitch in time saves nine* 说的不是缝衣服，而是趁小问题还没变大就解决它。要问这幅画面讲的是什么道理。",
      ],
      ["What does the proverb in this sentence mean?", "句子里的谚语是什么意思？"],
      proverbMeaning,
      (right) => [
        `The proverb *${proverbByMeaning(right)}* means **${right}**; its picture stands for that lesson, not for its literal words.`,
        `谚语 *${proverbByMeaning(right)}* 的意思是 **${right}**；它的画面代表这个道理，而不是字面意思。`,
      ],
      [
        [
          "*{wrong}* is the lesson of a different proverb, not of the one in this sentence.",
          "*{wrong}* 是另一句谚语的道理，不是这句话里那句谚语的。",
        ],
        [
          "*{wrong}* is the lesson of another saying; it does not fit how the proverb is used here.",
          "*{wrong}* 是另一句老话的道理，与这里谚语的用法不符。",
        ],
      ],
    ),
    choose(
      "proverb-for-a-situation",
      ["The Proverb for a Situation", "适合情境的谚语"],
      [
        "People use a proverb to sum up a situation in a few words. To choose one, first say in plain words what the situation shows: fixing a problem early saves work; too many helpers make a mess. Then pick the proverb whose lesson is the same, not one that merely shares a word or a picture.",
        "人们用谚语简短地概括一个情境。选择谚语时，先用平常的话说出这个情境说明了什么：早点解决问题能省事；帮忙的人太多反而搞砸。再选出道理相同的谚语，而不是只有某个词或画面相同的谚语。",
      ],
      ["Which proverb fits this situation?", "哪句谚语适合这个情境？"],
      proverbFit,
      (right) => [
        `**${right}** fits: it means ${proverbMeans(right)}, which is just what the situation shows.`,
        `**${right}** 合适：它的意思是 ${proverbMeans(right)}，这正是情境所说明的。`,
      ],
      [
        ["*{wrong}* teaches a different lesson; this situation is not about that.", "*{wrong}* 讲的是另一个道理，这个情境说的不是那件事。"],
        [
          "*{wrong}* does not sum up what happens here; its lesson is about something else.",
          "*{wrong}* 不能概括这里发生的事，它的道理是关于别的事的。",
        ],
      ],
    ),
  ],
});

// Words from other languages: word|language|clue|clue|sentence|sentence
const borrowedLines = rows(`
  kindergarten|German|In its first language the word means "children's garden."|It was coined by Friedrich Fröbel, who opened a school for small children near Berlin.|My little brother starts ___ in September.|The ___ class painted pictures of their pets.
  pretzel|German|Bakers in Bavaria twist this salty bread into a knot.|The word comes from the old language of Bavaria and Austria, where it names a knotted loaf.|We bought a warm, salty ___ at the fair.|The ___ was twisted into a loose knot.
  ballet|French|It comes from the language of the royal court at Versailles, where dancers performed for Louis XIV.|Its spelling ends in a silent t, as in many words of the language of Paris.|She has danced ___ since she was five.|The ___ dancers moved across the stage on their toes.
  café|French|The word means "coffee" in the language of Paris.|Its accent mark over the e shows the language it came from, spoken in France.|We had hot chocolate at a little ___ by the river.|The ___ on the corner sells soup and sandwiches.
  piano|Italian|It is short for pianoforte, a word from the language of Florence meaning "soft-loud."|It was invented by Bartolomeo Cristofori in Florence around 1700.|He practices the ___ every evening.|The ___ in the hall needs tuning.
  balcony|Italian|It comes from balcone, a word from the language of Venice and Rome.|Like many words of building, it came to English from the land of Renaissance architects.|We ate breakfast on the hotel ___.|She waved from the ___ above the street.
  canyon|Spanish|It comes from cañón, a word of the language of Mexico and Spain.|English speakers in the American Southwest took it from the settlers who were there first, who spoke the language of Madrid.|The river carved a deep ___ through the rock.|We hiked to the bottom of the ___.
  patio|Spanish|It names the open courtyard of a house in Seville or Mexico City.|It came to English from the language spoken in Spain and most of Latin America.|We had a barbecue on the ___.|Flowers in pots lined the sunny ___.
  tsunami|Japanese|It means "harbor wave," because fishers came home to find their harbors destroyed.|It comes from the language of the island country that has many earthquakes, including Tokyo's.|The earthquake caused a ___ that flooded the coast.|Signs show the way to high ground in case of a ___.
  karaoke|Japanese|It means "empty orchestra," because the music plays with no singer.|It was invented in Kobe in the 1970s.|We sang our favorite songs at the ___ party.|The ___ machine showed the words on a screen.
  tea|Chinese|It comes from te, a word of the Min language spoken in Fujian.|Dutch traders carried the drink and its name to Europe from the ports of southern China.|Would you like a cup of ___?|Grandma brews green ___ every morning.
  kung fu|Chinese|In its first language it means "skill won by hard work."|It names a martial art from the country of the Shaolin Temple.|She practices ___ at the club on Saturdays.|The ___ master moved slowly and gracefully.
  algebra|Arabic|It comes from al-jabr, a word from a book by the Baghdad mathematician al-Khwarizmi.|It came to Europe in the Middle Ages through translations of books written in the language of Baghdad.|We are learning ___ in math class.|In ___, letters stand for numbers.
  sofa|Arabic|It comes from suffa, a word for a raised bench covered with cushions.|It came to English through Turkish and French from the language of the Middle East.|The cat sleeps on the ___ all afternoon.|We bought a new ___ for the living room.
  shampoo|Hindi|It comes from champo, meaning "press" or "massage," in the language of northern India.|It came to English in the 1700s, when travelers from Britain learned head massage in India.|I ran out of ___ in the shower.|This ___ smells of coconut.
  bungalow|Hindi|It comes from bangla, meaning "of Bengal," for a kind of low house built there.|British people living in India took the word from the language of Delhi.|They live in a small ___ with one floor.|The ___ had a wide porch.
  cookie|Dutch|It comes from koekje, meaning "little cake."|Settlers from the Netherlands brought the word to New York, then called New Amsterdam.|She baked a chocolate chip ___ for each guest.|The ___ jar is empty again.
  yacht|Dutch|It comes from jacht, a fast ship used to chase pirates in the Netherlands.|Sailors of Amsterdam gave English this word with its unusual spelling.|The rich family sailed around the islands on their ___.|A white ___ was anchored in the bay.
`);
const borrowed = borrowedLines.map((r) => ({
  word: field(r, 0),
  language: field(r, 1),
  clues: [field(r, 2), field(r, 3)],
  sentences: [field(r, 4), field(r, 5)],
}));
const languages = [...new Set(borrowed.map((b) => b.language))];
const languageItems: ChoiceItem[] = borrowed.flatMap((b, i) =>
  b.clues.map((clue, k): ChoiceItem => {
    const others = languages.filter((l) => l !== b.language);
    return [`**${b.word}**: ${clue}`, b.language, [others[(i + k) % others.length] ?? "", others[(i + k + 3) % others.length] ?? ""]];
  }),
);
const borrowedFit: ChoiceItem[] = borrowed.flatMap((b, i) =>
  b.sentences.map(
    (s, k): ChoiceItem => [
      s,
      b.word,
      [borrowed[(i + 3 + k) % borrowed.length]?.word ?? "", borrowed[(i + 7 + k) % borrowed.length]?.word ?? ""],
    ],
  ),
);
const languageOf = (word: string) => borrowed.find((b) => b.word === word)?.language ?? "";

const otherLanguages = topic("vocabulary", {
  id: "words-from-other-languages",
  title: ["Words from Other Languages", "来自其他语言的词"],
  summary: [
    "English borrows words from many languages: kindergarten from German, ballet from French, piano from Italian, tsunami from Japanese, tea from Chinese.",
    "英语从许多语言借词：kindergarten 来自德语，ballet 来自法语，piano 来自意大利语，tsunami 来自日语，tea 来自汉语。",
  ],
  after: ["latin-roots-3"],
  points: [
    choose(
      "where-a-word-came-from",
      ["Where a Borrowed Word Came From", "借词来自哪里"],
      [
        "English has **borrowed** words from almost every language it met through trade, travel and conquest: *ballet* and *café* from French, *piano* from Italian, *canyon* from Spanish, *tsunami* from Japanese, *tea* from Chinese, *algebra* from Arabic, *shampoo* from Hindi. A dictionary gives a word's origin; a clue about who first used it, where, or what it first meant points to the language.",
        "英语通过贸易、旅行和征服，几乎从它接触过的每种语言**借**了词：*ballet* 和 *café* 来自法语，*piano* 来自意大利语，*canyon* 来自西班牙语，*tsunami* 来自日语，*tea* 来自汉语，*algebra* 来自阿拉伯语，*shampoo* 来自印地语。词典会给出词源；关于谁最先使用、在哪里使用或最初是什么意思的线索，能指向它来自的语言。",
      ],
      ["From which language did English borrow this word?", "英语从哪种语言借来了这个词？"],
      languageItems,
      (right, shown) => [
        `The clue points to ${right}: ${shown.replace(/^\*\*[^*]+\*\*: /, "")} So the word was borrowed from **${right}**.`,
        `线索指向${right}：${shown.replace(/^\*\*[^*]+\*\*: /, "")} 所以这个词借自 **${right}**。`,
      ],
      [
        ["*{wrong}* gave English other words, but the clue points to **{right}**.", "*{wrong}* 也给了英语别的词，但线索指向 **{right}**。"],
        ["Nothing in the clue points to *{wrong}*; it points to **{right}**.", "线索中没有任何地方指向 *{wrong}*，它指向 **{right}**。"],
      ],
    ),
    choose(
      "using-a-borrowed-word",
      ["Using a Borrowed Word", "使用借词"],
      [
        "A borrowed word is an ordinary English word once it is borrowed, so the sentence around it decides whether it fits. Many keep a sign of where they came from, such as the silent *t* of *ballet* or the accent of *café*, so spell them as English spells them now.",
        "借词一旦被借进来，就是普通的英语单词，所以要看周围的句子决定它是否合适。许多借词还保留着来源的痕迹，比如 *ballet* 中不发音的 *t*，*café* 上的重音符号，所以要按英语现在的拼法来写。",
      ],
      ["Which borrowed word completes the sentence?", "哪个借词能补全句子？"],
      borrowedFit,
      (right, shown) => [
        `${shown.replace("___", `**${right}**`)} *${right}*, borrowed from ${languageOf(right)}, is the only choice that makes sense here.`,
        `${shown.replace("___", `**${right}**`)} 借自${languageOf(right)}的 *${right}* 是唯一说得通的选项。`,
      ],
      [
        [
          "*{wrong}* is a borrowed word too, but it names something that does not fit this sentence.",
          "*{wrong}* 也是借词，但它指的东西放不进这个句子。",
        ],
        ["*{wrong}* makes no sense in this gap; the sentence needs **{right}**.", "*{wrong}* 放在这个空里说不通，句子需要 **{right}**。"],
      ],
    ),
  ],
});

/** wordStudyTopics6 are the topics of word study of grade 6. */
export const wordStudyTopics6: readonly TopicDef[] = [latinRoots3, greekRoots2, numberPrefixes, placePrefixes, adages, otherLanguages];
