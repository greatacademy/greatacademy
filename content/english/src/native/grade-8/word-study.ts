// Grade 8: word study: Latin and Greek roots, suffixes that form nouns, the older words of Shakespeare's English and
// words whose meanings have changed over the centuries.

import type { TopicDef } from "@ga/content";
import type { ChoiceItem } from "@ga/subject-english";
import { choose, field, partLines, parts, rows, topic } from "../grade-6/kit.ts";

const latin6 = parts({
  id: "latin-roots-6",
  title: ["Latin Roots 6", "拉丁词根 6"],
  summary: [
    "Ten more Latin roots: ben, mal, dom, greg, carn, corp, sanct, prim, ver and cred.",
    "另外十个拉丁词根：ben、mal、dom、greg、carn、corp、sanct、prim、ver 和 cred。",
  ],
  after: ["latin-roots-5"],
  kind: ["Latin root", "拉丁词根"],
  list: partLines(`
    ben|good or well|好|benefit|something good that helps you|benevolent|kind and wishing good to others|benefactor|a person who gives money or help to do good
    mal|bad or badly|坏|malfunction|to fail to work properly|malnutrition|poor health caused by not eating the right food|malicious|wanting to harm others
    dom|home or master|家，主人|domestic|having to do with the home and family|domesticate|to tame an animal so that it can live with people|dominate|to rule over others as a master does
    greg|flock or group|群|gregarious|liking to be with other people|congregate|to gather together in a crowd|segregate|to set a group apart from the rest
    carn|flesh|肉|carnage|the killing of a great many people|incarnate|in human form, with a body of flesh|reincarnation|being born again in a new body
    corp|body|身体|corpse|a dead body|corporal|having to do with the body|corporation|a company that acts as one body under the law
    sanct|holy|神圣|sanctuary|a holy place, or a place where one is safe|sanctify|to make something holy|sanctity|the holiness of something
    prim|first|第一|primary|first in order or importance|primitive|belonging to the earliest stage of development|primeval|from the very first ages of the world
    ver|true|真|verify|to check that something is true|verdict|the decision of a jury about what is true|veracity|the quality of being truthful
    cred|believe|相信|credible|able to be believed|incredulous|unwilling to believe something|credentials|papers that prove who you are and that you can be trusted
  `),
  explanations: [
    [
      "Ten more Latin **roots**. *Ben* means good or well, *mal* bad, *dom* home or master, *greg* flock, *carn* flesh, *corp* body, *sanct* holy, *prim* first, *ver* true and *cred* believe. *Ben* and *mal* often come in pairs: a *benevolent* person wishes good, a *malevolent* one wishes harm.",
      "另外十个拉丁**词根**。*ben* 意为好，*mal* 坏，*dom* 家或主人，*greg* 群，*carn* 肉，*corp* 身体，*sanct* 神圣，*prim* 第一，*ver* 真，*cred* 相信。*ben* 和 *mal* 常成对出现：*benevolent* 的人心怀善意，*malevolent* 的人心怀恶意。",
    ],
    [
      "Find the root that carries the core of the meaning. *Unwilling to believe* needs *cred* (believe) with *in-* (not): **incredulous**. *To check that something is true* needs *ver* (true): **verify**. When two words share a prefix, the root decides.",
      "找出承载意思核心的词根。*unwilling to believe* 需要 *cred*（相信）加 *in-*（不）：**incredulous**。*to check that something is true* 需要 *ver*（真）：**verify**。两个词前缀相同时，由词根决定。",
    ],
  ],
});

const greek5 = parts({
  id: "greek-roots-5",
  title: ["Greek Roots 5", "希腊词根 5"],
  summary: [
    "Ten more Greek roots: paleo, neo, pseud, theo, hetero, andr, eu, hem, phon and tele.",
    "另外十个希腊词根：paleo、neo、pseud、theo、hetero、andr、eu、hem、phon 和 tele。",
  ],
  after: ["greek-roots-4"],
  kind: ["Greek root", "希腊词根"],
  list: partLines(`
    paleo|old or ancient|古老|Paleolithic|of the Old Stone Age, when people made tools of chipped stone|paleography|the study of ancient handwriting|Paleozoic|the era of ancient life, long before the dinosaurs
    neo|new|新|neonatal|having to do with newborn babies|neologism|a newly made word|neoclassical|in a new style that copies the art of ancient Greece and Rome
    pseud|false|假|pseudoscience|false science that is not based on evidence|pseudopod|a "false foot" that an amoeba pushes out to move|pseudo|not real, though pretending to be
    theo|god|神|theology|the study of God and religion|atheist|a person who believes there is no god|monotheism|the belief in one god
    hetero|other or different|其他，不同|heterogeneous|made of parts of different kinds|heteronym|a word spelled like another but with a different sound and meaning|heterochromia|having eyes of two different colors
    andr|man|男人|android|a robot made to look like a human being|androgynous|partly male and partly female in appearance|polyandry|having more than one husband at the same time
    eu|good or well|好|euphoria|a feeling of great happiness|eulogy|a speech that speaks well of someone who has died|euthanasia|a gentle, painless death given to end suffering
    hem|blood|血|hemorrhage|heavy bleeding|hemoglobin|the part of red blood cells that carries oxygen|hemophilia|a condition in which the blood does not clot
    phon|sound|声音|symphony|a long piece of music in which many sounds go together|phonics|teaching reading through the sounds of letters|cacophony|a harsh mix of loud sounds
    tele|far|远|telescope|an instrument for seeing things that are far away|telepathy|sending thoughts to someone far away without speaking|teleport|to move instantly to a far place
  `),
  explanations: [
    [
      "Ten more Greek **roots**. *Paleo* means old, *neo* new, *pseud* false, *theo* god, *hetero* other or different, *andr* man, *eu* good or well, *hem* blood, *phon* sound and *tele* far. *Paleo* and *neo* make a pair, like *hetero* and *homo* (same).",
      "另外十个希腊**词根**。*paleo* 意为古老，*neo* 新，*pseud* 假，*theo* 神，*hetero* 其他或不同，*andr* 男人，*eu* 好，*hem* 血，*phon* 声音，*tele* 远。*paleo* 和 *neo* 是一对，就像 *hetero* 和 *homo*（相同）。",
    ],
    [
      "Many Greek words are built of two roots. *A word spelled like another but with a different sound* joins *hetero* (different) and *nym* (name): **heteronym**. *An instrument for seeing far* joins *tele* (far) and *scope* (look): **telescope**. Read each root in turn and put the meanings together.",
      "许多希腊词由两个词根组成。*a word spelled like another but with a different sound* 由 *hetero*（不同）和 *nym*（名字）组成：**heteronym**。*an instrument for seeing far* 由 *tele*（远）和 *scope*（看）组成：**telescope**。依次读出每个词根，把意思合起来。",
    ],
  ],
});

const nounSuffixes = parts({
  id: "suffixes-that-form-nouns",
  title: ["Suffixes That Form Nouns", "构成名词的后缀"],
  summary: [
    "Ten suffixes that turn words into nouns: -ism, -ity, -ance, -dom, -hood, -ship, -ee, -let, -ery and -age.",
    "十个把词变成名词的后缀：-ism、-ity、-ance、-dom、-hood、-ship、-ee、-let、-ery 和 -age。",
  ],
  after: ["suffixes-that-form-adjectives"],
  kind: ["suffix", "后缀"],
  list: partLines(`
    -ism|a belief or practice|信仰，主义|patriotism|love of and loyalty to your country|optimism|the belief that things will turn out well|journalism|the work of collecting and reporting news
    -ity|the quality of being|……的性质|curiosity|the quality of being eager to learn|generosity|the quality of being willing to give|rarity|the quality of being uncommon
    -ance|the act or state of|……的行为或状态|performance|the act of performing a play or a task|resistance|the act of fighting against something|annoyance|the state of being annoyed
    -dom|a realm or a condition|领域，状态|kingdom|a land ruled by a king or queen|freedom|the condition of being free|stardom|the condition of being a famous star
    -hood|a time or state of life|时期，身份|childhood|the time of being a child|adulthood|the time of being an adult|parenthood|the state of being a parent
    -ship|a position, a skill or a bond|身份，技能，关系|friendship|the bond between friends|leadership|the skill or position of a leader|citizenship|the position of being a citizen of a country
    -ee|a person to whom something is done|受动者|employee|a person who is employed by someone|trainee|a person who is being trained|interviewee|a person who is interviewed
    -let|a small one|小|booklet|a small, thin book|piglet|a young, small pig|droplet|a very small drop
    -ery|a place where something is made or kept|场所|bakery|a place where bread is baked|brewery|a place where beer is made|nursery|a place where young plants or children are cared for
    -age|a collection or an amount|集合，数量|baggage|all the bags a traveler carries|mileage|the number of miles traveled|foliage|all the leaves of a plant or tree
  `),
  explanations: [
    [
      "A **suffix** at the end of a word can turn it into a noun and tell what kind of noun it is. *-ism* names a belief or practice, *-ity* a quality, *-ance* an act or state, *-dom* a realm or condition, *-hood* a time or state of life, *-ship* a position, skill or bond, *-ee* a person to whom something is done, *-let* a small one, *-ery* a place where something is made or kept, and *-age* a collection or amount.",
      "词尾的**后缀**可以把词变成名词，并说明它是哪一类名词。*-ism* 指信仰或做法，*-ity* 性质，*-ance* 行为或状态，*-dom* 领域或状态，*-hood* 人生的某个时期或身份，*-ship* 身份、技能或关系，*-ee* 受动者，*-let* 小的东西，*-ery* 制作或存放某物的场所，*-age* 集合或数量。",
    ],
    [
      "Compare words with the same base: an *employer* employs, an *employee* is employed; a *friend* is a person, *friendship* is the bond. To choose a noun for a definition, find the base word, then the suffix that names the right kind of thing.",
      "比较词根相同的词：*employer* 是雇用别人的人，*employee* 是被雇用的人；*friend* 是人，*friendship* 是关系。根据定义选名词时，先找出基础词，再找出表示正确类别的后缀。",
    ],
  ],
});

/** GlossLine is an entry of a set of words or phrases with two uses and two situations, read from six fields. */
interface GlossLine {
  readonly word: string;
  readonly means: string;
  readonly uses: readonly [string, string];
  readonly situations: readonly [string, string];
}

const glossLines = (lines: string): GlossLine[] =>
  rows(lines).map((r) => ({
    word: field(r, 0),
    means: field(r, 1),
    uses: [field(r, 2), field(r, 3)],
    situations: [field(r, 4), field(r, 5)],
  }));

// Older words: word|modern meaning|line|line|modern sentence with the modern word in italics|another
const olderWords = glossLines(`
  thou|you, as the subject of a verb|If thou wilt come with me, we leave at dawn.|I know thou speakest truly, my friend.|*You* are the bravest knight in the land.|Will *you* walk with me to the river?
  thee|you, after a verb or after a word such as with|I will follow thee to the end of the world.|Good night, and peace be with thee.|I give *you* my word.|I cannot live without *you*.
  thy|your|Give me thy hand, old friend.|Why is thy face so pale tonight?|What is *your* name, stranger?|Put down *your* sword.
  art|are, used with thou|Thou art a fool to trust him.|Who art thou, that walks so softly in the dark?|*Are* you the king's messenger?|You *are* my oldest friend.
  hast|have, used with thou|What hast thou done with the letter?|Thou hast saved my life.|*Have* you seen my brother?|You *have* won the prize.
  doth|does|Mine eye doth tell me something is amiss.|How doth the little garden grow?|The wind *does* blow cold tonight.|*Does* he know the truth?
  wherefore|why|Tell me wherefore thou weepest.|I know not wherefore the king is angry.|*Why* are you crying?|I do not know *why* she left.
  hither|to this place|Come hither, boy, and hold my horse.|Bring the letter hither at once.|Come *here* and sit beside me.|Bring the lamp *here*.
  thither|to that place|The castle lies beyond the hill; we ride thither at noon.|He went thither and never came back.|The town is far, but we will walk *there* tomorrow.|She went *there* every summer.
  whence|from where|Tell me whence thou comest.|Return to the land whence you came.|*Where* did this letter come *from*?|Go back to the place *from which* you came.
  ere|before|I will return ere the sun sets.|Speak now, ere it is too late.|Finish your work *before* night falls.|Think twice *before* you speak.
  anon|soon, in a little while|Wait at the gate; the doctor will see you anon.|I shall come anon, good sir.|I will be with you *soon*.|The guests will arrive *in a little while*.
  prithee|please, from "I pray thee"|Tell me, prithee, what is wrong.|Sit down, prithee, and rest a while.|*Please* tell me the news.|Pass me the bread, *please*.
  nay|no|I say nay to this marriage.|He begged her to stay, but she answered nay.|*No*, I will not sign it.|She shook her head and said *no*.
  'tis|it is|Come quickly, for 'tis almost midnight.|I fear 'tis too late to save him.|*It is* a cold night.|Hurry, *it is* nearly dawn.
`);

const olderMeaning: ChoiceItem[] = [];
const olderFor: ChoiceItem[] = [];
olderWords.forEach((w, i) => {
  w.uses.forEach((use, k) => {
    const others = [olderWords[(i + 1 + k) % olderWords.length], olderWords[(i + 6 + k) % olderWords.length]];
    olderMeaning.push([use.replace(w.word, `*${w.word}*`), w.means, others.map((o) => o?.means ?? "")]);
  });
  w.situations.forEach((s, k) => {
    const others = [olderWords[(i + 2 + k) % olderWords.length], olderWords[(i + 8 + k) % olderWords.length]];
    olderFor.push([s, w.word, others.map((o) => o?.word ?? "")]);
  });
});
const olderByMeaning = (m: string) => olderWords.find((w) => w.means === m)?.word ?? "";
const olderMeans = (word: string) => olderWords.find((w) => w.word === word)?.means ?? "";

const earlyModern = topic("vocabulary", {
  id: "early-modern-english-words",
  title: ["Words of Shakespeare's English", "莎士比亚时代英语的词"],
  summary: [
    "Fifteen older words that readers meet in Shakespeare and the King James Bible, such as thou, thee, wherefore and ere.",
    "读者在莎士比亚和钦定版《圣经》中会遇到的十五个旧词，如 thou、thee、wherefore 和 ere。",
  ],
  after: ["parts-of-a-play", "context-clues"],
  points: [
    choose(
      "what-the-older-word-means",
      ["What the Older Word Means", "旧词的意思"],
      [
        "English four hundred years ago used words that have since dropped out of speech. *Thou* was *you* as the subject, *thee* was *you* after a verb or a word like *with*, and *thy* was *your*; verbs after *thou* end in *-st* (*thou hast*, *thou art*). *Wherefore* means *why*, not *where*: Juliet asks why Romeo must be a Montague, not where he is.",
        "四百年前的英语用着一些后来不再说的词。*thou* 是作主语的 *you*，*thee* 是动词或 *with* 之类的词后面的 *you*，*thy* 是 *your*；*thou* 后面的动词以 *-st* 结尾（*thou hast*、*thou art*）。*wherefore* 的意思是 *why*，不是 *where*：朱丽叶问的是罗密欧为什么偏偏是蒙太古家的人，不是问他在哪里。",
      ],
      ["What does the older word in italics mean?", "斜体的旧词是什么意思？"],
      olderMeaning,
      (right) => [
        `*${olderByMeaning(right)}* means **${right}**; put that in its place and the line reads as modern English.`,
        `*${olderByMeaning(right)}* 的意思是 **${right}**；用它替换后，这一行就成了现代英语。`,
      ],
      [
        ["*{wrong}* is what a different older word means, not this one.", "*{wrong}* 是另一个旧词的意思，不是这一个的。"],
        [
          "*{wrong}* is the meaning of another word of that time; it does not make sense in this line.",
          "*{wrong}* 是那个时代另一个词的意思，放在这一行里说不通。",
        ],
      ],
    ),
    choose(
      "the-older-word-for-a-modern-one",
      ["The Older Word for a Modern One", "现代词对应的旧词"],
      [
        "To hear how a line would sound in Shakespeare's time, find the older word for the modern word in italics. Watch the position of *you*: before the verb it was *thou* (*thou art*), after a verb or *with* it was *thee* (*with thee*), and before a noun *your* was *thy* (*thy sword*).",
        "要听出一行话在莎士比亚时代怎么说，先找出与斜体现代词对应的旧词。注意 *you* 的位置：在动词前是 *thou*（*thou art*），在动词或 *with* 后面是 *thee*（*with thee*），在名词前的 *your* 是 *thy*（*thy sword*）。",
      ],
      [
        "Which older word would a writer of Shakespeare's time use for the words in italics?",
        "莎士比亚时代的作者会用哪个旧词表达斜体的词？",
      ],
      olderFor,
      (right) => [
        `**${right}** meant ${olderMeans(right)}, which is what the words in italics say.`,
        `**${right}** 的意思是 ${olderMeans(right)}，正是斜体的词所表达的。`,
      ],
      [
        ["*{wrong}* meant something else; it cannot stand for these words.", "*{wrong}* 的意思是别的，不能代替这些词。"],
        ["*{wrong}* is an older word with a different meaning.", "*{wrong}* 是另一个意思不同的旧词。"],
      ],
    ),
  ],
});

// Words that changed: word|old meaning|modern meaning|old sentence|old sentence|gap sentence|gap sentence
const changedLines = rows(`
  nice|foolish or ignorant|pleasant and kind|In a story of 1350, the *nice* young man believes every lie the fox tells him.|An old poem mocks the *nice* traveler who gives his purse to the first stranger he meets.|Long ago, a writer could call a man who believed every tale ___, meaning foolish.|In the fourteenth century, ___ described the ignorant, not the kind.
  awful|full of awe; inspiring wonder and fear|very bad|The old hymn speaks of the *awful* majesty of the mountains, filling the singer with wonder.|To the pilgrims, the great cathedral was an *awful* sight that made them fall silent with awe.|An old writer called a great storm at sea ___, meaning that it filled him with awe.|Before it meant terrible, ___ meant inspiring wonder and fear.
  silly|blessed, happy or innocent|foolish|An old prayer asks God to watch over the *silly* children in their beds, innocent and blessed.|The medieval poet calls the lambs *silly*, meaning innocent and happy.|A thousand years ago, ___ meant blessed and innocent.|In Old English, a happy, blessed person could be called ___.
  naughty|having nothing; poor|badly behaved|An old document speaks of *naughty* folk who owned nothing at all.|The beggar was *naughty*, for he had not a coin to his name.|In the 1300s, a person who had nothing was called ___, from the word naught.|Long ago, ___ meant poor and worthless rather than badly behaved.
  girl|a young person, boy or girl|a young female|In a poem of 1300, the knight remembers his days as a *girl*, playing with the other boys.|Old writers spoke of the "knave *girl*," meaning a young boy.|Seven hundred years ago, any child, boy or girl, could be called a ___.|The word ___ once named a young person of either sex.
  meat|any kind of food|the flesh of animals|The old book says the travelers had no *meat* but bread and apples.|"Grace before *meat*" was a prayer said before any meal.|In old English, bread, fruit and cheese were all called ___.|Long ago, ___ meant food of any kind, not only the flesh of animals.
  terrific|causing terror|very good|The old account describes a *terrific* storm that drove the people screaming from their homes.|To the villagers, the dragon of the legend was a *terrific* beast.|Two hundred years ago, a monster that filled people with terror was called ___.|Before it meant wonderful, ___ meant frightening.
  egregious|standing out for being excellent|standing out for being shockingly bad|An old letter praises an *egregious* scholar, the finest of his time.|The king honored the *egregious* poet above all others.|In 1550, a writer could praise an excellent student as ___.|The Latin for "out of the flock" gave ___, which once meant outstandingly good.
  decimate|to kill one in every ten|to destroy a large part of|As a punishment, the Roman general chose to *decimate* the legion that had run from battle, killing one soldier in ten.|Roman law allowed a commander to *decimate* a rebellious army.|In ancient Rome, to kill one soldier in every ten as a punishment was to ___ the army.|From the Latin for "tenth" comes ___, once a punishment for a whole legion.
  villain|a farm worker of low rank|a wicked person|In the old records of the manor, each *villain* owed the lord three days of work a week.|The *villain* plowed the lord's field before his own.|In the Middle Ages, a farm worker tied to a lord's land was a ___.|Before it named the wicked, ___ named a peasant of a country estate.
  sad|full; having had enough|unhappy|After the great feast, the old poem says, the guests were *sad* and could eat no more.|The farmer was *sad* of work after the long harvest, meaning he had had his fill.|Long ago, a guest who had eaten enough could be called ___.|In Old English, ___ meant full or satisfied, not unhappy.
  clue|a ball of thread|a piece of evidence that helps solve a problem|In the myth, Theseus unwinds a *clue* as he enters the maze, so that he can find his way out.|The old story says Ariadne gave the hero a *clue* of red thread.|Long ago, a ball of thread was called a ___.|Because a ball of thread led Theseus out of the maze, ___ came to mean something that leads to a solution.
  bully|a sweetheart; a fine fellow|a person who frightens weaker people|In an old play, the sailor greets his friend as "my *bully*," meaning his fine fellow.|Shakespeare's characters call a good friend a *bully*.|In the 1500s, a sweetheart or a fine friend could be called a ___.|Before it named someone cruel, ___ was a word of affection.
  fantastic|existing only in the imagination|wonderful|The old scholar dismissed the tale of the sea serpent as *fantastic*, a thing of the mind only.|The doctor said the patient's fears were *fantastic*, with no basis in the world.|Long ago, ___ described things that existed only in the imagination.|Before it meant wonderful, ___ meant imagined and not real.
  manufacture|to make by hand|to make in large numbers by machine|In 1600, a weaver would *manufacture* each cloth on her own loom, by hand.|The old guild rules let a master *manufacture* only what his own hands could make.|From the Latin for "hand" and "make" comes ___, which once meant to make by hand.|Before factories, to ___ something was to make it with your own hands.
`);
const changed = changedLines.map((r) => ({
  word: field(r, 0),
  old: field(r, 1),
  modern: field(r, 2),
  olds: [field(r, 3), field(r, 4)],
  gaps: [field(r, 5), field(r, 6)],
}));
const oldMeaning: ChoiceItem[] = [];
const wordThatChanged: ChoiceItem[] = [];
changed.forEach((c, i) => {
  c.olds.forEach((s, k) => {
    const other = changed[(i + 3 + k) % changed.length];
    oldMeaning.push([s, c.old, [c.modern, other?.old ?? ""]]);
  });
  c.gaps.forEach((s, k) => {
    const others = [changed[(i + 2 + k) % changed.length], changed[(i + 7 + k) % changed.length]];
    wordThatChanged.push([s, c.word, others.map((o) => o?.word ?? "")]);
  });
});
const changedByOld = (old: string) => changed.find((c) => c.old === old);
const changedByWord = (word: string) => changed.find((c) => c.word === word);

const wordsThatChanged = topic("vocabulary", {
  id: "words-that-changed-meaning",
  title: ["Words That Changed Their Meaning", "词义演变的词"],
  summary: [
    "Fifteen words whose meanings have shifted over the centuries, such as nice, awful, silly and clue.",
    "十五个词义在几百年间发生了变化的词，如 nice、awful、silly 和 clue。",
  ],
  after: ["connotation-and-precise-words"],
  points: [
    choose(
      "the-old-meaning",
      ["The Old Meaning", "旧时的意思"],
      [
        "Words change their meanings over time. *Nice* once meant foolish, *awful* full of awe, *silly* blessed and *meat* any food. When you read an old text, the modern meaning can mislead you: ask what the rest of the sentence says the word must mean. A *silly* child in an old prayer is innocent, not foolish.",
        "词的意思会随时间变化。*nice* 曾经的意思是愚蠢，*awful* 是充满敬畏，*silly* 是有福的，*meat* 是任何食物。读古老的文本时，现代意思可能会误导你：要看句子的其余部分说明这个词必须是什么意思。旧祷文里 *silly* 的孩子是天真的，不是愚蠢的。",
      ],
      ["What does the word in italics mean in this old text?", "在这段旧文本中，斜体的词是什么意思？"],
      oldMeaning,
      (right) => {
        const c = changedByOld(right);
        return [
          `In this old text, *${c?.word}* means **${right}**; the rest of the sentence shows it, though today it means ${c?.modern}.`,
          `在这段旧文本中，*${c?.word}* 的意思是 **${right}**；句子的其余部分说明了这一点，虽然它今天的意思是 ${c?.modern}。`,
        ];
      },
      [
        [
          "*{wrong}* is what the word means today; the old text uses it in its earlier sense.",
          "*{wrong}* 是这个词今天的意思；旧文本用的是它更早的意思。",
        ],
        ["*{wrong}* is the old meaning of a different word.", "*{wrong}* 是另一个词的旧意思。"],
      ],
    ),
    choose(
      "the-word-that-changed",
      ["The Word That Changed", "发生变化的词"],
      [
        "Many words that changed carry their history in them. *Naughty* comes from *naught* (nothing), so it first meant having nothing. *Decimate* comes from the Latin for a tenth. *Manufacture* joins the Latin for hand and make. Knowing the story of a word helps you read it in an old text and remember it in a new one.",
        "许多词义变了的词身上带着自己的历史。*naughty* 来自 *naught*（无），所以最初的意思是一无所有。*decimate* 来自拉丁语的“十分之一”。*manufacture* 由拉丁语的“手”和“做”组成。了解一个词的来历，能帮你读懂旧文本中的它，也能帮你记住它在新文本中的意思。",
      ],
      ["Which word completes the sentence?", "哪个词能补全句子？"],
      wordThatChanged,
      (right) => {
        const c = changedByWord(right);
        return [
          `**${right}** once meant ${c?.old}; today it means ${c?.modern}.`,
          `**${right}** 曾经的意思是 ${c?.old}；今天它的意思是 ${c?.modern}。`,
        ];
      },
      [
        ["*{wrong}* once had a different meaning from the one described here.", "*{wrong}* 过去的意思与这里描述的不同。"],
        ["*{wrong}* changed in another way; its old meaning does not fit.", "*{wrong}* 是以另一种方式变化的，它的旧意思不符合。"],
      ],
    ),
  ],
});

/** wordStudyTopics8 are the topics of word study of grade 8. */
export const wordStudyTopics8: readonly TopicDef[] = [latin6, greek5, nounSuffixes, earlyModern, wordsThatChanged];
