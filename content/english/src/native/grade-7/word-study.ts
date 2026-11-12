// Grade 7: word study: Latin and Greek roots, suffixes of science and of adjectives, idioms and euphemisms.

import type { TopicDef } from "@ga/content";
import type { ChoiceItem } from "@ga/subject-english";
import { choose, field, partLines, parts, rows, topic } from "../grade-6/kit.ts";

const latin4 = parts({
  id: "latin-roots-4",
  title: ["Latin Roots 4", "拉丁词根 4"],
  summary: [
    "Ten more Latin roots: magn, nov, mort, sens, grat, pos, flect, clud, viv and cogn.",
    "另外十个拉丁词根：magn、nov、mort、sens、grat、pos、flect、clud、viv 和 cogn。",
  ],
  after: ["latin-roots-3"],
  kind: ["Latin root", "拉丁词根"],
  list: partLines(`
    magn|great|大|magnify|to make something look bigger than it is|magnificent|very great and beautiful|magnitude|the great size or importance of something
    nov|new|新|novel|new and different from anything before|novice|a person who is new to an activity|renovate|to make an old building new again
    mort|death|死亡|mortal|certain to die some day|immortal|living forever; never dying|mortician|a person whose job is to prepare the dead for burial
    sens|feel|感觉|sensation|a feeling in the body, such as heat or pain|sensitive|quick to feel or react to something|sensory|having to do with the body's senses and feelings
    grat|thanks or pleasing|感谢，令人愉快|grateful|feeling thanks for something|gratitude|the feeling of being thankful|gratify|to please someone by giving what they want
    pos|put or place|放，置|deposit|to put something down or into a place|compose|to put together parts to make a whole, such as a song|postpone|to put something off until later
    flect|bend|弯曲|reflect|to bend light or sound back from a surface|deflect|to bend something away from its path|flexible|able to bend easily without breaking
    clud|shut|关闭|exclude|to shut someone out of a group|include|to shut something in as part of a whole|seclude|to shut someone away from other people
    viv|live|活|vivid|full of life and bright color|revive|to bring back to life or strength|survive|to stay alive through something dangerous
    cogn|know|知道|recognize|to know someone or something because you have seen it before|cognitive|having to do with knowing and thinking|incognito|with your identity hidden, so others do not know you
  `),
  explanations: [
    [
      "A Latin **root** carries the core meaning of a word, and prefixes and suffixes change it. *Magn* means great, *nov* new, *mort* death, *sens* feel, *grat* thanks or pleasing, *pos* put, *flect* bend, *clud* shut, *viv* live and *cogn* know. A root may change its spelling a little (*flex* in *flexible*, *vit* in *vital*), but its meaning stays.",
      "拉丁**词根**承载词的核心意思，前缀和后缀改变它。*magn* 意为大，*nov* 新，*mort* 死亡，*sens* 感觉，*grat* 感谢或令人愉快，*pos* 放置，*flect* 弯曲，*clud* 关闭，*viv* 活，*cogn* 知道。词根的拼写可能稍有变化（*flexible* 中的 *flex*，*vital* 中的 *vit*），但意思不变。",
    ],
    [
      "To choose a word for a meaning, find the root that matches the core of the meaning, then check the rest of the word. *To shut someone out* needs *clud* (shut) with *ex-* (out): **exclude**. *Living forever* needs *mort* (death) with *im-* (not): **immortal**.",
      "根据意思选词时，先找出与意思核心相符的词根，再看词的其余部分。*to shut someone out* 需要 *clud*（关闭）加 *ex-*（出）：**exclude**。*living forever* 需要 *mort*（死亡）加 *im-*（不）：**immortal**。",
    ],
  ],
});

const greek3 = parts({
  id: "greek-roots-3",
  title: ["Greek Roots 3", "希腊词根 3"],
  summary: [
    "Ten more Greek roots: phil, soph, anthrop, arch, nym, pan, hom, dox, ortho and crypt.",
    "另外十个希腊词根：phil、soph、anthrop、arch、nym、pan、hom、dox、ortho 和 crypt。",
  ],
  after: ["greek-roots-2"],
  kind: ["Greek root", "希腊词根"],
  list: partLines(`
    phil|love|爱|philosophy|the love and study of wisdom|philanthropist|a person who gives money because they love people|bibliophile|a person who loves books
    soph|wise|智慧|sophisticated|wise in the ways of the world; complex|sophomore|a student in the second year, "wise but foolish"|philosopher|a person who seeks wisdom by thinking deeply
    anthrop|human|人类|anthropology|the study of human beings and their cultures|misanthrope|a person who dislikes other people|anthropoid|shaped like a human, as an ape is
    arch|chief or rule|首领，统治|monarch|a single person who rules a country|anarchy|a state with no ruler or government|archbishop|a chief bishop over other bishops
    nym|name|名字|synonym|a word with the same meaning as another|pseudonym|a false name used by a writer|anonymous|with no name given
    pan|all|全部|panorama|a wide view of all of an area|pandemic|a disease that spreads among all the world's people|pantheon|a temple for all the gods
    hom|same|相同|homogeneous|made of parts that are all the same kind|homonym|a word that sounds or is spelled the same as another|homophone|a word that sounds the same as another
    dox|opinion or belief|意见，信仰|orthodox|holding the accepted beliefs|paradox|a statement that goes against what you expect but may be true|heterodox|holding beliefs different from the accepted ones
    ortho|straight or correct|直，正确|orthodontist|a dentist who straightens teeth|orthography|the correct spelling of a language|orthopedic|having to do with correcting bones and joints
    crypt|hidden|隐藏|cryptic|with a hidden or puzzling meaning|encrypt|to hide a message in a secret code|crypt|a hidden room under a church
  `),
  explanations: [
    [
      "Greek roots fill the words of ideas and learning. *Phil* means love, *soph* wise, *anthrop* human, *arch* chief or rule, *nym* name, *pan* all, *hom* same, *dox* opinion, *ortho* straight or correct and *crypt* hidden. Two Greek roots often join: *phil* + *soph* is the love of wisdom, **philosophy**.",
      "希腊词根构成许多关于思想和学问的词。*phil* 意为爱，*soph* 智慧，*anthrop* 人类，*arch* 首领或统治，*nym* 名字，*pan* 全部，*hom* 相同，*dox* 意见，*ortho* 直或正确，*crypt* 隐藏。两个希腊词根常常连用：*phil* + *soph* 就是对智慧的爱，**philosophy**。",
    ],
    [
      "Build the meaning from the parts. *A false name* needs *nym* (name) with *pseudo* (false): **pseudonym**. *A view of all of an area* needs *pan* (all) with *orama* (view): **panorama**. When two words share a root, the other part tells them apart.",
      "用各部分拼出意思。*a false name* 需要 *nym*（名字）加 *pseudo*（假）：**pseudonym**。*a view of all of an area* 需要 *pan*（全部）加 *orama*（景象）：**panorama**。两个词词根相同时，靠另一部分区分它们。",
    ],
  ],
});

const scienceSuffixes = parts({
  id: "suffixes-of-science-and-medicine",
  title: ["Suffixes of Science and Medicine", "科学与医学的后缀"],
  summary: [
    "Ten suffixes of science and medicine: -itis, -cide, -phobia, -vore, -ectomy, -osis, -arium, -oid, -emia and -ician.",
    "十个科学与医学的后缀：-itis、-cide、-phobia、-vore、-ectomy、-osis、-arium、-oid、-emia 和 -ician。",
  ],
  after: ["common-suffixes"],
  kind: ["suffix", "后缀"],
  list: partLines(`
    -itis|swelling and soreness|发炎|tonsillitis|a swelling of the tonsils in the throat|arthritis|a painful swelling of the joints|bronchitis|a swelling of the tubes that carry air to the lungs
    -cide|killing|杀死|pesticide|a chemical that kills insects and other pests|insecticide|a chemical that kills insects|germicide|a substance that kills germs
    -phobia|fear|恐惧|claustrophobia|fear of small, closed spaces|arachnophobia|fear of spiders|acrophobia|fear of heights
    -vore|eater|食者|herbivore|an animal that eats only plants|carnivore|an animal that eats meat|omnivore|an animal that eats both plants and meat
    -ectomy|cutting out|切除|appendectomy|an operation that removes the appendix|tonsillectomy|an operation that removes the tonsils|mastectomy|an operation that removes a breast
    -osis|a diseased condition|病症|tuberculosis|a disease of the lungs caused by bacteria|scoliosis|a condition in which the spine curves to the side|halitosis|a condition of bad breath
    -arium|a place for|场所|aquarium|a tank or building where water animals are kept|planetarium|a building where images of the stars and planets are shown|terrarium|a glass box where small land plants or animals are kept
    -oid|like or shaped like|像，形似|asteroid|a rock in space that looks like a small star|humanoid|having a shape like a human|spheroid|shaped almost like a ball
    -emia|a condition of the blood|血液病症|anemia|a condition of having too few red blood cells|leukemia|a cancer of the blood|hypoglycemia|a condition of having too little sugar in the blood
    -ician|a person skilled in|专业人员|technician|a person skilled in working with machines or equipment|musician|a person skilled in playing music|electrician|a person skilled in working with electric wires
  `),
  explanations: [
    [
      "Many words of science and medicine end in a Greek or Latin **suffix** that tells you what kind of thing the word names. *-itis* is swelling and soreness, *-cide* killing, *-phobia* fear, *-vore* an eater, *-ectomy* cutting out, *-osis* a diseased condition, *-arium* a place for, *-oid* like, *-emia* a condition of the blood and *-ician* a person skilled in something.",
      "许多科学和医学词汇以希腊或拉丁**后缀**结尾，后缀告诉你这个词指哪一类事物。*-itis* 指发炎，*-cide* 杀死，*-phobia* 恐惧，*-vore* 食者，*-ectomy* 切除，*-osis* 病症，*-arium* 场所，*-oid* 像，*-emia* 血液病症，*-ician* 擅长某事的人。",
    ],
    [
      "Read the suffix first, then the beginning. *Herbivore* and *carnivore* are both eaters (*-vore*); *herb* (plant) and *carn* (meat) tell what they eat. *Tonsillitis* and *tonsillectomy* both concern the tonsils; *-itis* is a swelling of them, *-ectomy* an operation that cuts them out.",
      "先读后缀，再读开头。*herbivore* 和 *carnivore* 都是食者（*-vore*）；*herb*（植物）和 *carn*（肉）说明它们吃什么。*tonsillitis* 和 *tonsillectomy* 都与扁桃体有关；*-itis* 是它发炎，*-ectomy* 是把它切除的手术。",
    ],
  ],
});

const adjectiveSuffixes = parts({
  id: "suffixes-that-form-adjectives",
  title: ["Suffixes That Form Adjectives", "构成形容词的后缀"],
  summary: [
    "Ten suffixes that turn words into adjectives: -ous, -ive, -ish, -ward, -proof, -fold, -ary, -some, -esque and -ic.",
    "十个把词变成形容词的后缀：-ous、-ive、-ish、-ward、-proof、-fold、-ary、-some、-esque 和 -ic。",
  ],
  after: ["suffixes-that-change-word-class"],
  kind: ["suffix", "后缀"],
  list: partLines(`
    -ous|full of|充满|courageous|full of courage|glorious|full of glory and beauty|hazardous|full of danger
    -ive|tending to|倾向于|creative|tending to make new things|talkative|tending to talk a lot|destructive|tending to destroy things
    -ish|somewhat or like|有点，像|childish|like a child, in a silly way|reddish|somewhat red|foolish|like a fool; not wise
    -ward|in the direction of|朝……方向|homeward|in the direction of home|skyward|in the direction of the sky|eastward|in the direction of the east
    -proof|safe against|防……的|waterproof|safe against water getting in|fireproof|safe against burning|soundproof|safe against noise getting through
    -fold|times as many|倍|twofold|twice as many or as much|tenfold|ten times as many or as much|hundredfold|a hundred times as many or as much
    -ary|relating to|与……有关|monetary|relating to money|planetary|relating to planets|military|relating to soldiers and armies
    -some|causing or tending to|引起，易于|troublesome|causing trouble|lonesome|tending to feel lonely|tiresome|causing someone to feel tired or bored
    -esque|in the style of|……风格的|picturesque|pretty in the style of a picture|statuesque|tall and still, in the style of a statue|Romanesque|in the style of Roman buildings, with round arches
    -ic|of or having the nature of|具有……性质的|heroic|having the nature of a hero|economic|of the economy and money|poetic|having the nature of poetry
  `),
  explanations: [
    [
      "A **suffix** at the end of a word can make it an adjective and add a meaning. *-ous* means full of, *-ive* tending to, *-ish* somewhat or like, *-ward* in the direction of, *-proof* safe against, *-fold* times as many, *-ary* relating to, *-some* causing, *-esque* in the style of and *-ic* of the nature of.",
      "词尾的**后缀**可以把词变成形容词并增加意思。*-ous* 意为充满，*-ive* 倾向于，*-ish* 有点或像，*-ward* 朝……方向，*-proof* 防……的，*-fold* 倍，*-ary* 与……有关，*-some* 引起，*-esque* ……风格的，*-ic* 具有……性质的。",
    ],
    [
      "Split the word into its base and its suffix, and put the two meanings together. *Water* + *-proof* (safe against) is **waterproof**, safe against water. *Trouble* + *-some* (causing) is **troublesome**, causing trouble. The base word may lose a letter, as *glory* does in *glorious*.",
      "把词拆成词干和后缀，再把两个意思合起来。*water* + *-proof*（防）是 **waterproof**，防水。*trouble* + *-some*（引起）是 **troublesome**，引起麻烦。词干可能会少一个字母，比如 *glory* 在 *glorious* 中。",
    ],
  ],
});

const latin5 = parts({
  id: "latin-roots-5",
  title: ["Latin Roots 5", "拉丁词根 5"],
  summary: [
    "Ten Latin roots of speech, law and society: loqu, clam, lingu, jur, liber, equ, civ, pop, fort and pac.",
    "十个有关言语、法律和社会的拉丁词根：loqu、clam、lingu、jur、liber、equ、civ、pop、fort 和 pac。",
  ],
  after: ["latin-roots-4"],
  kind: ["Latin root", "拉丁词根"],
  list: partLines(`
    loqu|speak|说|eloquent|speaking well and with power|loquacious|speaking a great deal|soliloquy|a speech that a character makes alone on stage
    clam|cry out|呼喊|exclaim|to cry out suddenly|proclaim|to announce something loudly and in public|clamor|a loud, shouting noise made by many people
    lingu|tongue or language|舌头，语言|bilingual|able to speak two languages|linguist|a person who studies languages|multilingual|using many languages
    jur|law or swear|法律，发誓|jury|a group sworn to decide a court case|jurisdiction|the area in which a court's laws have power|perjury|lying in court after swearing to tell the truth
    liber|free|自由|liberty|the state of being free|liberate|to set someone free|liberal|free in giving; open to new ideas
    equ|equal|相等|equality|the state of being equal|equation|a statement that two amounts are equal|equator|the line that divides Earth into two equal halves
    civ|citizen|公民|civic|having to do with citizens and their town|civilian|a citizen who is not in the army|civilization|a society of citizens with its own laws and culture
    pop|people|人民|population|all the people who live in a place|popular|liked by many people|populate|to fill a place with people
    fort|strong|强|fortify|to make a place stronger against attack|fortitude|strength of mind in hard times|fortress|a strong building that protects people
    pac|peace|和平|pacify|to make someone calm and peaceful|pacifist|a person who believes war is always wrong|pact|a peaceful agreement between groups
  `),
  explanations: [
    [
      "Latin gave English the words of speech, law and life together. *Loqu* means speak, *clam* cry out, *lingu* tongue or language, *jur* law or swear, *liber* free, *equ* equal, *civ* citizen, *pop* people, *fort* strong and *pac* peace. The spelling may shift (*claim* in *exclaim*, *just* beside *jur*), but the core meaning stays.",
      "拉丁语给了英语许多关于言语、法律和共同生活的词。*loqu* 意为说，*clam* 呼喊，*lingu* 舌头或语言，*jur* 法律或发誓，*liber* 自由，*equ* 相等，*civ* 公民，*pop* 人民，*fort* 强，*pac* 和平。拼写可能有变化（*exclaim* 中的 *claim*），但核心意思不变。",
    ],
    [
      "Match the core of a meaning to its root, then let the prefix or suffix finish it. *Able to speak two languages* needs *lingu* (language) with *bi-* (two): **bilingual**. *Lying after swearing to tell the truth* needs *jur* (swear) with *per-* (wrongly): **perjury**.",
      "把意思的核心与词根对上，再让前缀或后缀补全它。*able to speak two languages* 需要 *lingu*（语言）加 *bi-*（二）：**bilingual**。*lying after swearing to tell the truth* 需要 *jur*（发誓）加 *per-*（错误地）：**perjury**。",
    ],
  ],
});

const greek4 = parts({
  id: "greek-roots-4",
  title: ["Greek Roots 4", "希腊词根 4"],
  summary: [
    "Ten Greek roots of flight, machines and light: aer, naut, baro, helic, pter, cosm, mechan, pyr, gyr and phot.",
    "十个有关飞行、机器和光的希腊词根：aer、naut、baro、helic、pter、cosm、mechan、pyr、gyr 和 phot。",
  ],
  after: ["greek-roots-3"],
  kind: ["Greek root", "希腊词根"],
  list: partLines(`
    aer|air|空气|aerial|in or from the air|aerosol|a fine spray of liquid in the air|aerospace|the air around Earth and the space beyond it
    naut|sailor or ship|水手，船|astronaut|a person who travels in space as a sailor travels the sea|nautical|having to do with ships and sailors|aeronaut|a person who flies a balloon or an aircraft
    baro|weight or pressure|重量，压力|barometer|a tool that measures the pressure of the air|barometric|having to do with the pressure of the air|barograph|a tool that records air pressure on paper
    helic|spiral|螺旋|helicopter|an aircraft lifted by blades that spin in a spiral|helix|a spiral shape like a spring|helical|shaped like a spiral
    pter|wing|翅膀|pterodactyl|a flying reptile with wings like fingers|dipteran|an insect with two wings, such as a fly|lepidopteran|an insect with scaly wings, such as a butterfly
    cosm|world or order|世界，秩序|cosmos|the whole ordered universe|cosmonaut|a Russian astronaut, a sailor of the universe|microcosm|a small world that stands for a larger one
    mechan|machine|机器|mechanic|a person who repairs machines|mechanical|worked by a machine|mechanism|the working parts of a machine
    pyr|fire|火|pyrotechnics|a display of fireworks|pyre|a pile of wood for burning|pyromaniac|a person with a strong urge to set fires
    gyr|circle or turn|圆，旋转|gyroscope|a spinning wheel that keeps its direction and helps aircraft stay level|gyrate|to turn round and round|gyre|a large circle of turning ocean currents
    phot|light|光|photon|a tiny unit of light|photosynthesis|the way plants make food from light|photogenic|looking good in pictures taken with light
  `),
  explanations: [
    [
      "The words of flight and machines are full of Greek. *Aer* means air, *naut* sailor or ship, *baro* weight or pressure, *helic* spiral, *pter* wing, *cosm* world or order, *mechan* machine, *pyr* fire, *gyr* circle or turn and *phot* light. One word can hold two roots: a **helicopter** is a *helic* (spiral) *pter* (wing).",
      "飞行和机器的词汇里有很多希腊词根。*aer* 意为空气，*naut* 水手或船，*baro* 重量或压力，*helic* 螺旋，*pter* 翅膀，*cosm* 世界或秩序，*mechan* 机器，*pyr* 火，*gyr* 圆或旋转，*phot* 光。一个词可以含两个词根：**helicopter** 就是 *helic*（螺旋）*pter*（翅膀）。",
    ],
    [
      "To choose a word, find the root that holds the key idea. *A tool that measures the pressure of the air* needs *baro* (pressure) with *meter* (measure): **barometer**. *A person who travels in space* needs *naut* (sailor) with *astro* (star): **astronaut**.",
      "选词时，找出含有关键意思的词根。*a tool that measures the pressure of the air* 需要 *baro*（压力）加 *meter*（测量）：**barometer**。*a person who travels in space* 需要 *naut*（水手）加 *astro*（星星）：**astronaut**。",
    ],
  ],
});

// Idioms: idiom|meaning|sentence|sentence|situation|situation
const idiomLines = rows(`
  break the ice|to make people feel relaxed when they first meet|At the first meeting, Ana told a joke to break the ice.|The teacher played a name game to break the ice on the first day.|On the first day of camp, a counselor gets the shy new campers laughing with a silly song.|Meeting her cousin's friends for the first time, Jun asks everyone about their favorite films so they start chatting.
  bite off more than you can chew|to try to do more than you are able to|I bit off more than I could chew when I joined four clubs.|Don't bite off more than you can chew; one project is enough.|Mara signs up for three sports, the school play and a weekend job, and soon she cannot keep up.|Theo promises to build a whole robot in one evening and is still gluing wheels at midnight.
  hit the nail on the head|to describe exactly what is causing a problem|You hit the nail on the head: the problem is that we started too late.|When she said the plan was too expensive, she hit the nail on the head.|Everyone argues about why the team keeps losing until Sam says the defense never talks, and they all agree.|The mechanic listens once and names the exact part that is making the noise.
  on thin ice|in a risky situation where you might get into trouble|After being late three times, he is on thin ice with the coach.|You are on thin ice if you forget your homework again.|Late for the third time this week, Leo is warned that one more will cost him his place on the team.|Having broken two of the library's rules, Priya knows the next mistake will lose her the card.
  let the cat out of the bag|to tell a secret by mistake|Ben let the cat out of the bag about the surprise party.|Don't let the cat out of the bag before the announcement.|At dinner, Maya mentions the present she bought for her sister, who is sitting right there.|Jay asks his friend whether she is excited about the party everyone has been keeping secret from her.
  the ball is in your court|it is now your turn to act or decide|I have made my offer; the ball is in your court.|We sent the plan to the principal, so the ball is in her court.|After the club offers Lina the job of captain, it is up to her to say yes or no.|Diego has said sorry and invited his friend over, and now he waits for her answer.
  cut corners|to do something badly or cheaply to save time or money|The builders cut corners, and the roof leaked.|If you cut corners on your essay, you will lose marks.|To finish quickly, the painter skips the first coat, and the wall soon peels.|The company uses cheaper bolts to save money, and the bridge has to be repaired within a year.
  get cold feet|to become too nervous to do something you planned|She got cold feet the night before the speech.|Many people get cold feet before a big change.|Just before his turn on the high diving board, Omar climbs back down the ladder.|Rosa signed up for the talent show, but on the day she asks to be taken off the list.
  in the same boat|in the same difficult situation as others|We all lost our notes, so we are in the same boat.|Don't worry, everyone in the class is in the same boat.|All the passengers miss their connecting flight because of the storm.|Every student on the team has two tests on the same morning.
  under the weather|feeling a little sick|I stayed home because I was under the weather.|Grandpa is under the weather, so we will visit next week.|With a sore throat and a slight fever, Kim decides to rest instead of going to practice.|Arjun feels tired and achy, so he asks to skip the long hike.
  a blessing in disguise|something that seems bad at first but turns out to be good|Missing the bus was a blessing in disguise, because I met my old friend.|Losing the job was a blessing in disguise.|Rain cancels the picnic, so the family stays home and finds the photos they thought they had lost.|Failing the first audition pushes Nia to practice so hard that she wins a better part the next year.
  burn the midnight oil|to work late into the night|She burned the midnight oil to finish the project.|Students often burn the midnight oil before exams.|The night before the deadline, Ravi is still writing his report at two in the morning.|Before the science fair, the twins work on their volcano long after everyone else is asleep.
  see eye to eye|to agree completely|My sister and I don't see eye to eye on music.|The two coaches finally saw eye to eye on the plan.|After a long talk, both friends agree on exactly where to go for the trip.|The mayor and the council vote together on every part of the new park.
  turn over a new leaf|to change your behavior and start again in a better way|After the warning, he turned over a new leaf and studied every day.|I am turning over a new leaf this year and getting up early.|After failing a test, Sara starts doing her homework every evening as soon as she gets home.|Once always late, Kai now sets two alarms and arrives first at practice every day.
  once in a blue moon|very rarely|We go to the city only once in a blue moon.|My brother cleans his room once in a blue moon.|Ella's aunt, who lives overseas, visits about every five years.|The town gets snow perhaps one winter in ten.
`);
const idioms = idiomLines.map((r) => ({
  idiom: field(r, 0),
  means: field(r, 1),
  uses: [field(r, 2), field(r, 3)],
  situations: [field(r, 4), field(r, 5)],
}));
const idiomMeaning: ChoiceItem[] = [];
const idiomFit: ChoiceItem[] = [];
idioms.forEach((p, i) => {
  p.uses.forEach((use, k) => {
    const others = [idioms[(i + 1 + k) % idioms.length], idioms[(i + 6 + k) % idioms.length]];
    idiomMeaning.push([use.replace(p.idiom, `*${p.idiom}*`), p.means, others.map((o) => o?.means ?? "")]);
  });
  p.situations.forEach((s, k) => {
    const others = [idioms[(i + 2 + k) % idioms.length], idioms[(i + 8 + k) % idioms.length]];
    idiomFit.push([s, p.idiom, others.map((o) => o?.idiom ?? "")]);
  });
});
const idiomByMeaning = (m: string) => idioms.find((p) => p.means === m)?.idiom ?? "";
const idiomMeans = (p: string) => idioms.find((x) => x.idiom === p)?.means ?? "";

const moreIdioms = topic("vocabulary", {
  id: "more-idioms",
  title: ["More Idioms", "更多习语"],
  summary: [
    "Fifteen idioms of everyday English, such as break the ice, cut corners and a blessing in disguise.",
    "十五个日常英语习语，如 break the ice、cut corners 和 a blessing in disguise。",
  ],
  after: ["idioms"],
  points: [
    choose(
      "what-an-idiom-means",
      ["What an Idiom Means", "习语的意思"],
      [
        "An **idiom** is a group of words whose meaning cannot be worked out from the words one by one. *Break the ice* has nothing to do with ice; it means making people feel relaxed when they first meet. Read the whole sentence and ask what the idiom must mean for the sentence to make sense.",
        "**习语**是一组词，它的意思不能从单个词的意思推出来。*break the ice* 与冰无关，意思是让初次见面的人放松下来。读完整个句子，想想习语必须是什么意思，句子才说得通。",
      ],
      ["What does the idiom in italics mean?", "斜体的习语是什么意思？"],
      idiomMeaning,
      (right) => [
        `*${idiomByMeaning(right)}* means **${right}**; read as a whole, the idiom makes the sentence make sense.`,
        `*${idiomByMeaning(right)}* 的意思是 **${right}**；把习语作为一个整体理解，句子才说得通。`,
      ],
      [
        ["*{wrong}* is the meaning of a different idiom, not of the one in italics.", "*{wrong}* 是另一个习语的意思，不是斜体习语的意思。"],
        [
          "*{wrong}* belongs to another idiom; it does not fit what happens in this sentence.",
          "*{wrong}* 属于另一个习语，与这个句子中发生的事不符。",
        ],
      ],
    ),
    choose(
      "idiom-for-a-situation",
      ["The Idiom for a Situation", "适合情境的习语"],
      [
        "To choose an idiom for a situation, first say in plain words what is happening: someone is too nervous to go on; someone tried to do too much. Then pick the idiom whose meaning is the same. Do not be misled by a word in the situation that also appears in an idiom.",
        "为情境选择习语时，先用平常的话说出发生了什么：有人紧张得做不下去；有人想做的事太多了。再选出意思相同的习语。不要被情境中恰好也出现在某个习语里的词误导。",
      ],
      ["Which idiom describes this situation?", "哪个习语能描述这个情境？"],
      idiomFit,
      (right) => [
        `**${right}** fits: it means ${idiomMeans(right)}, which is what happens here.`,
        `**${right}** 合适：它的意思是 ${idiomMeans(right)}，这正是这里发生的事。`,
      ],
      [
        ["*{wrong}* means something else; this situation is not about that.", "*{wrong}* 的意思是另一回事，这个情境说的不是那件事。"],
        [
          "*{wrong}* does not describe what happens here; its meaning is about something else.",
          "*{wrong}* 不能描述这里发生的事，它的意思是关于别的事的。",
        ],
      ],
    ),
  ],
});

// Euphemisms: euphemism|plain meaning|sentence|sentence|plain sentence|plain sentence
const euphemismLines = rows(`
  passed away|died|Her grandfather passed away last spring.|The old dog passed away in his sleep.|The newspaper reported that the famous singer had died at eighty.|The doctor had to tell the family that their uncle had died.
  let go|fired from a job|Fifty workers were let go when the factory closed.|He was let go after the company lost money.|The manager told three waiters they were fired.|The company fired its whole sales team.
  between jobs|without a job|My uncle is between jobs at the moment.|She has been between jobs since the spring.|After the shop closed, Dad had no job for six months.|He has had no work since the factory shut down.
  economical with the truth|lying or leaving out the truth|The witness was economical with the truth about where he had been.|The ad was economical with the truth about the price.|The salesman lied about how old the car was.|The report lied about the number of people hurt.
  pre-owned|used; owned by someone before|They bought a pre-owned car to save money.|The shop sells pre-owned phones.|We bought a used bicycle from a neighbor.|The market sells used furniture.
  vertically challenged|short|The ad joked about being vertically challenged.|The comedian called himself vertically challenged.|My brother is short for his age.|The basketball player was short but very fast.
  downsizing|cutting jobs to make a company smaller|The company announced downsizing in its offices.|After the downsizing, only ten people worked there.|The firm cut two hundred jobs.|The bank cut half of its jobs in the city.
  collateral damage|harm done to people or things that were not the target|The report called the ruined homes collateral damage.|Officials spoke of collateral damage after the attack.|The bombs destroyed a school near the bridge.|Many people who were not soldiers were killed in the attack.
  correctional facility|prison|He spent three years in a correctional facility.|The correctional facility is outside the town.|The thief was sent to prison for two years.|The prison has high walls and guards.
  economically disadvantaged|poor|The program helps economically disadvantaged families.|Many economically disadvantaged students get free lunch.|The charity gives coats to poor children.|The town has many poor families.
  senior citizen|an old person|Tickets are cheaper for every senior citizen.|The senior citizen center offers dance classes.|The bus has seats for old people near the front.|Many old people live on this street.
  negative growth|a fall or loss|The company reported negative growth this year.|The economy showed negative growth in the spring.|Sales fell by ten percent.|The town lost money last year.
  budget-friendly|cheap|The hotel offers budget-friendly rooms.|We found a budget-friendly restaurant near the station.|The shop sells cheap shoes that break in a month.|They bought the cheap tent, and it leaked.
  restroom|toilet|Excuse me, where is the restroom?|The restroom is down the hall.|The toilet in the gym was broken.|There is a toilet next to the kitchen.
  fixer-upper|a house in bad repair|The ad described the house as a fixer-upper.|They bought a fixer-upper and spent a year on repairs.|The old house had a broken roof and rotten floors.|The house they bought was falling apart.
`);
const euphemisms = euphemismLines.map((r) => ({
  euphemism: field(r, 0),
  plain: field(r, 1),
  uses: [field(r, 2), field(r, 3)],
  plains: [field(r, 4), field(r, 5)],
}));
const euphemismMeaning: ChoiceItem[] = [];
const euphemismFor: ChoiceItem[] = [];
euphemisms.forEach((e, i) => {
  e.uses.forEach((use, k) => {
    const others = [euphemisms[(i + 2 + k) % euphemisms.length], euphemisms[(i + 7 + k) % euphemisms.length]];
    euphemismMeaning.push([use.replace(e.euphemism, `*${e.euphemism}*`), e.plain, others.map((o) => o?.plain ?? "")]);
  });
  e.plains.forEach((p, k) => {
    const others = [euphemisms[(i + 3 + k) % euphemisms.length], euphemisms[(i + 9 + k) % euphemisms.length]];
    euphemismFor.push([p, e.euphemism, others.map((o) => o?.euphemism ?? "")]);
  });
});
const euphemismByPlain = (p: string) => euphemisms.find((e) => e.plain === p)?.euphemism ?? "";
const plainOf = (e: string) => euphemisms.find((x) => x.euphemism === e)?.plain ?? "";

const euphemismTopic = topic("vocabulary", {
  id: "euphemisms",
  title: ["Euphemisms", "委婉语"],
  summary: [
    "Words that make something harsh or unpleasant sound softer, such as passed away for died and let go for fired.",
    "把严厉或令人不快的事说得更柔和的词，如用 passed away 代替 died，用 let go 代替 fired。",
  ],
  after: ["connotation-and-precise-words"],
  points: [
    choose(
      "what-a-euphemism-means",
      ["What a Euphemism Means", "委婉语的意思"],
      [
        "A **euphemism** is a mild word or phrase used in place of one that sounds harsh, sad or rude: *passed away* for *died*, *let go* for *fired*. People use euphemisms to be kind, but news reports, ads and officials also use them to hide how bad something is. To read one, say the plain word it stands for.",
        "**委婉语**是用来代替听起来严厉、悲伤或粗鲁的词的温和说法：用 *passed away* 代替 *died*，用 *let go* 代替 *fired*。人们用委婉语表示体贴，但新闻报道、广告和官员也用它来掩盖事情有多糟。读到委婉语时，要说出它所代替的直白说法。",
      ],
      ["What does the euphemism in italics plainly mean?", "斜体的委婉语直白地说是什么意思？"],
      euphemismMeaning,
      (right) => [
        `*${euphemismByPlain(right)}* is a softer way of saying **${right}**.`,
        `*${euphemismByPlain(right)}* 是 **${right}** 的委婉说法。`,
      ],
      [
        ["*{wrong}* is what a different euphemism stands for.", "*{wrong}* 是另一个委婉语所代替的意思。"],
        ["*{wrong}* is the plain meaning of another mild phrase, not this one.", "*{wrong}* 是另一个温和说法的直白意思，不是这一个的。"],
      ],
    ),
    choose(
      "euphemism-for-a-plain-word",
      ["The Euphemism for a Plain Word", "直白说法的委婉语"],
      [
        "Writers choose between a plain word and a euphemism for their purpose. To soften the sentence, find the plain word that carries the harsh meaning, such as *died* or *prison*, and choose the mild phrase that stands for exactly that, such as *passed away* or *correctional facility*.",
        "作者会根据目的在直白的词和委婉语之间选择。要让句子柔和一些，先找出带有严厉意思的直白词，如 *died* 或 *prison*，再选出正好代替它的温和说法，如 *passed away* 或 *correctional facility*。",
      ],
      ["Which euphemism could soften this sentence?", "哪个委婉语能使这个句子更柔和？"],
      euphemismFor,
      (right) => [
        `**${right}** is the mild way of saying ${plainOf(right)}, the harsh meaning in this sentence.`,
        `**${right}** 是 ${plainOf(right)} 的温和说法，正是这个句子中严厉的意思。`,
      ],
      [
        [
          "*{wrong}* softens a different word: it stands for something this sentence does not say.",
          "*{wrong}* 柔化的是另一个词：它代替的意思这个句子里没有。",
        ],
        [
          "*{wrong}* is a euphemism for something else, so it would change the meaning.",
          "*{wrong}* 是别的事情的委婉语，会改变句子的意思。",
        ],
      ],
    ),
  ],
});

/** wordStudyTopics7 are the topics of word study of grade 7. */
export const wordStudyTopics7: readonly TopicDef[] = [
  latin4,
  greek3,
  scienceSuffixes,
  adjectiveSuffixes,
  moreIdioms,
  latin5,
  greek4,
  euphemismTopic,
];
