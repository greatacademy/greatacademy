// Grades 9 to 12: the words of each unit's theme, ten to a batch: literary analysis, rhetoric, the theater,
// government and law, scientific inquiry, modern history, poetic form and reflection.

import type { TopicDef } from "@ga/content";
import { t } from "@ga/content";
import type { WordBatch } from "../../pack.ts";
import { type BatchSpec, batchTopic, batchWords } from "../batch.ts";

const fromClues = [{ topic: "context-clues", weight: 0.1 }] as const;

const literary: BatchSpec = {
  id: "words-for-literary-analysis",
  title: t("Words for Literary Analysis", "文学分析用词"),
  summary: t(
    "Ten words for writing about literature: ambiguity, motif, juxtaposition, archetype, protagonist, catharsis, satire and more.",
    "十个用于评论文学的词：ambiguity、motif、juxtaposition、archetype、protagonist、catharsis、satire 等。",
  ),
  domain: ["how stories and their meanings are made", "故事及其意义是怎样构成的"],
  prerequisites: ["context-clues", "theme"],
  encompasses: fromClues,
  words: [
    {
      word: "ambiguity",
      forms: ["ambiguities", "ambiguous"],
      meaning: ["the quality of having more than one possible meaning", "歧义，模棱两可，有不止一种可能的含义"],
      sentences: [
        "The story ends with deliberate ___: we never learn whether the brothers forgive each other.",
        "Critics still argue about the ___ of the last line, which can be read as hope or as despair.",
        "The author leaves the stranger's motives in ___, so each reader must decide whether he can be trusted.",
      ],
      confusions: ["epiphany", "motif"],
    },
    {
      word: "motif",
      forms: ["motifs"],
      meaning: ["an image, object or idea that returns again and again in a work", "母题，反复出现的意象、事物或观念"],
      sentences: [
        "Locked doors are the central ___ of the novel; one appears in almost every chapter.",
        "The ___ of birds in cages returns whenever the heroine feels trapped by her family.",
        "Water is the central ___ of these poems: rain, rivers and tears appear in each of them.",
      ],
      confusions: ["archetype", "allegory"],
    },
    {
      word: "juxtaposition",
      forms: ["juxtapositions"],
      meaning: [
        "placing two very different things side by side so that the contrast stands out",
        "并置，把截然不同的事物放在一起以突出对比",
      ],
      sentences: [
        "The ___ of the lavish wedding feast and the hungry children outside the gate makes the point without a word of comment.",
        "In the film, the ___ of a quiet lullaby with images of war is hard to forget.",
        "The poet uses ___ when she sets a newborn baby beside an old man on his deathbed.",
      ],
      confusions: ["ambiguity", "satire"],
    },
    {
      word: "archetype",
      forms: ["archetypes", "archetypal"],
      meaning: [
        "a type of character, plot or symbol found in stories across many cultures and times",
        "原型，各种文化和时代的故事中都能找到的人物、情节或象征类型",
      ],
      sentences: [
        "The wise old teacher who guides the young hero fits an old ___ found from ancient myths to modern films.",
        "The journey into a dark forest and out again is a story ___ that appears in folk tales everywhere.",
        "The trickster is the ___ who shows up in Chinese, African and Native American legends alike.",
      ],
      confusions: ["motif", "protagonist"],
    },
    {
      word: "protagonist",
      forms: ["protagonists"],
      meaning: ["the main character of a story, whose goals drive the plot", "主人公，故事的主要人物，其目标推动情节发展"],
      sentences: [
        "The ___ of the novel is a fifteen-year-old girl who runs her family's shop after her father falls ill.",
        "We follow the ___ through every chapter, so we see the whole world through her choices.",
        "Unusually, the ___ of this play is not likable; we watch him make one selfish decision after another.",
      ],
      confusions: ["antagonist", "archetype"],
    },
    {
      word: "antagonist",
      forms: ["antagonists"],
      meaning: ["the character or force that works against the main character", "反面人物，与主人公作对的人物或力量"],
      sentences: [
        "In the survival story, the ___ is not a person at all but the freezing mountain.",
        "The ___ spreads lies about the hero until the whole town turns against him.",
        "A good ___ has reasons of his own, so the reader understands him even while hoping he fails.",
      ],
      confusions: ["protagonist", "satire"],
    },
    {
      word: "catharsis",
      meaning: [
        "the release of strong feelings, such as pity and fear, that an audience feels at the end of a tragedy",
        "宣泄，悲剧结尾时观众强烈情感（如怜悯和恐惧）的释放",
      ],
      sentences: [
        "After the tragic final scene, many in the audience wept, and they left the theater feeling a strange ___.",
        "The ancient Greeks believed that watching a tragedy gave citizens the ___ that cleansed them of pity and fear.",
        "Writing the story of her grandfather's death gave her a kind of ___; afterward she could talk about him calmly.",
      ],
      confusions: ["epiphany", "ambiguity"],
    },
    {
      word: "epiphany",
      forms: ["epiphanies"],
      meaning: ["a sudden moment when a character understands something important", "顿悟，人物突然领悟到重要事情的时刻"],
      sentences: [
        "Standing at his father's grave, the son reaches his ___: he has become the cold man he always feared.",
        "The story turns on a small ___, when the girl realizes her best friend has been lying to protect her.",
        "Halfway up the mountain, he had his ___ and understood that he had climbed only to please others.",
      ],
      confusions: ["catharsis", "ambiguity"],
    },
    {
      word: "satire",
      forms: ["satires", "satirical"],
      meaning: [
        "writing that uses humor, irony and exaggeration to mock foolishness or wrongdoing",
        "讽刺作品，用幽默、反讽和夸张嘲弄愚蠢或恶行",
      ],
      sentences: [
        "The novel is a sharp ___ of school life, in which teachers hand out prizes for sitting perfectly still.",
        "Swift's famous ___ suggests a shocking solution to poverty in order to attack the cruelty of the rich.",
        "The comedy show uses ___ to mock politicians who promise everything and deliver nothing.",
      ],
      confusions: ["allegory", "juxtaposition"],
    },
    {
      word: "allegory",
      forms: ["allegories", "allegorical"],
      meaning: [
        "a story whose characters and events stand for ideas, often moral or political ones",
        "寓言，人物和事件代表某种观念（常为道德或政治观念）的故事",
      ],
      sentences: [
        "The tale of animals who take over a farm is the best-known ___ of a revolution that goes wrong.",
        "In the old ___, a traveler named Christian walks toward a heavenly city, and each place he passes stands for a test of faith.",
        "Read as this kind of ___, the story of the flood is about how a society rebuilds its rules after disaster.",
      ],
      confusions: ["satire", "motif"],
    },
  ],
};

const rhetoric: BatchSpec = {
  id: "words-of-rhetoric",
  title: t("Words of Rhetoric", "修辞用词"),
  summary: t(
    "Ten words for talking about persuasion: rhetoric, anecdote, concession, analogy, euphemism, rebuttal, demagogue and more.",
    "十个谈论说服的词：rhetoric、anecdote、concession、analogy、euphemism、rebuttal、demagogue 等。",
  ),
  domain: ["speeches, debates and persuasion", "演讲、辩论和说服"],
  prerequisites: ["context-clues", "authors-purpose"],
  encompasses: fromClues,
  words: [
    {
      word: "rhetoric",
      forms: ["rhetorical"],
      meaning: [
        "the art of using language to persuade, or language used mainly to impress",
        "修辞，用语言说服人的艺术，或主要为了打动人的言辞",
      ],
      sentences: [
        "Students of ___ in ancient Athens practiced speeches for hours each day.",
        "Voters grew tired of the senator's empty ___ and wanted to know what he would actually do.",
        "Her ___ was so skillful that even people who disagreed with her stayed to hear the end.",
      ],
      confusions: ["polemic", "anecdote"],
    },
    {
      word: "anecdote",
      forms: ["anecdotes", "anecdotal"],
      meaning: ["a short, interesting story about a real event or person", "轶事，关于真实事件或人物的简短趣事"],
      sentences: [
        "The speaker opened with a funny ___ about getting lost on her first day at the job.",
        "One ___ about a single patient is not enough to prove that a medicine works.",
        "Grandpa tells the same ___ about meeting the president at every family dinner.",
      ],
      confusions: ["analogy", "rhetoric"],
    },
    {
      word: "concession",
      forms: ["concessions"],
      meaning: ["admitting that the other side has a fair point, before answering it", "让步，承认对方有道理之处，然后再回应"],
      sentences: [
        "She made a ___ to her opponents: the new bridge would cost a great deal.",
        "A wise ___ shows the audience that you have listened to the other side.",
        "His only ___ was that the plan might take longer than he had promised.",
      ],
      confusions: ["rebuttal", "euphemism"],
    },
    {
      word: "analogy",
      forms: ["analogies"],
      meaning: [
        "a comparison that explains one thing by showing how it is like another",
        "类比，通过说明一事物与另一事物的相似之处来解释它",
      ],
      sentences: [
        "The teacher used a simple ___ to explain the heart: it works like a pump that never stops.",
        "Comparing the internet to a highway is an old ___, and it hides how different they are.",
        "His ___ between running a country and running a household fails, because a country can print money.",
      ],
      confusions: ["anecdote", "concession"],
    },
    {
      word: "euphemism",
      forms: ["euphemisms"],
      meaning: [
        "a mild or vague word used in place of one that seems harsh or unpleasant",
        "委婉语，代替刺耳或令人不快的词的温和或含糊说法",
      ],
      sentences: [
        'The company called the firing of two hundred workers a "restructuring," which is a ___.',
        '"Passed away" is a gentle ___ for "died."',
        'Calling the war\'s civilian deaths "collateral damage" is a ___ that hides real suffering.',
      ],
      confusions: ["concession", "rhetoric"],
    },
    {
      word: "inflammatory",
      meaning: ["likely to make people angry or violent", "煽动性的，可能激起愤怒或暴力的"],
      sentences: [
        "The editor refused to print the letter because its language was ___.",
        "His ___ speech turned a peaceful crowd into an angry one within minutes.",
        "Posting ___ rumors about a rival school can lead to real fights.",
      ],
      confusions: ["eloquent", "polemic"],
    },
    {
      word: "rebuttal",
      forms: ["rebuttals", "rebut"],
      meaning: ["an answer that tries to prove the other side's argument wrong", "反驳，试图证明对方论点错误的回答"],
      sentences: [
        "In her ___, the debater showed that her opponent's numbers were ten years out of date.",
        "Each team has two minutes for their ___ after the other side speaks.",
        "His ___ was so strong that the other team had nothing left to say.",
      ],
      confusions: ["concession", "analogy"],
    },
    {
      word: "polemic",
      forms: ["polemics", "polemical"],
      meaning: ["a strong written or spoken attack on an idea or a person", "论战文章，对观点或人物的猛烈抨击"],
      sentences: [
        "The pamphlet was a fierce ___ against the factories that poisoned the river.",
        "Her book is less a history than a ___; it attacks the generals on every page.",
        "His article began as a calm review and turned into a bitter ___ against modern art.",
      ],
      confusions: ["rhetoric", "rebuttal"],
    },
    {
      word: "eloquent",
      forms: ["eloquence", "eloquently"],
      meaning: ["able to speak or write clearly, movingly and well", "雄辩的，能清楚、动人、出色地说话或写作的"],
      sentences: [
        "Even her opponents admitted that the young lawyer was ___.",
        "The ___ letter from the student persuaded the board to keep the music program.",
        "He was shy in conversation but ___ whenever he stood up to speak about justice.",
      ],
      confusions: ["inflammatory", "rhetoric"],
    },
    {
      word: "demagogue",
      forms: ["demagogues"],
      meaning: [
        "a leader who wins support by stirring people's fears and prejudices rather than by reason",
        "煽动家，靠激起人们的恐惧和偏见而非靠道理赢得支持的领袖",
      ],
      sentences: [
        "The ___ blamed every problem on foreigners and promised simple answers to hard questions.",
        "History warns us how quickly the ___ can turn a frightened crowd against its neighbors.",
        "Rather than explain her plan, the ___ shouted slogans and pointed at enemies.",
      ],
      confusions: ["polemic", "anecdote"],
    },
  ],
};

const theater: BatchSpec = {
  id: "words-of-the-theater",
  title: t("Words of the Theater", "戏剧用词"),
  summary: t(
    "Ten words of plays and the stage: playwright, soliloquy, monologue, aside, chorus, tragedy, hubris, farce, understudy and denouement.",
    "十个关于戏剧和舞台的词：playwright、soliloquy、monologue、aside、chorus、tragedy、hubris、farce、understudy 和 denouement。",
  ),
  domain: ["plays and the theater", "戏剧和剧场"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "playwright",
      forms: ["playwrights"],
      meaning: ["a person who writes plays", "剧作家"],
      sentences: [
        "The ___ sat in the back row on opening night, watching the audience instead of the stage.",
        "Shakespeare is the most famous ___ in English, but he also acted in his own plays.",
        "The young ___ rewrote the last scene eleven times before the director was satisfied.",
      ],
      confusions: ["understudy", "chorus"],
    },
    {
      word: "soliloquy",
      forms: ["soliloquies"],
      meaning: ["a speech in which a character alone on stage speaks his or her thoughts aloud", "独白，人物独自在台上说出内心想法的台词"],
      sentences: [
        "Alone on the dark stage, the prince speaks his ___ about whether life is worth living.",
        "In her ___, the queen admits to herself the crime she has hidden from everyone.",
        "Because no other character hears the ___, the audience learns secrets that the others never discover.",
      ],
      confusions: ["monologue", "aside"],
    },
    {
      word: "monologue",
      forms: ["monologues"],
      meaning: ["a long speech by one character to others on stage", "长篇独白，一个人物对台上其他人发表的长篇讲话"],
      sentences: [
        "The general delivers a long ___ to his soldiers before the battle while they listen in silence.",
        "For her audition, she performed a two-minute ___ from a play about a family farm.",
        "The father's angry ___ at the dinner table goes on for a full page, and no one dares to interrupt.",
      ],
      confusions: ["soliloquy", "aside"],
    },
    {
      word: "aside",
      forms: ["asides"],
      meaning: [
        "a short remark a character makes to the audience that the other characters do not hear",
        "旁白，人物对观众说的、其他人物听不到的简短话语",
      ],
      sentences: [
        "In his ___, the servant tells the audience that he knows exactly where the money is hidden.",
        'The villain smiles at his victim, then turns to the crowd and whispers this ___: "Not for long, my friend."',
        "Each ___ lets the audience in on a joke that the other characters miss.",
      ],
      confusions: ["soliloquy", "monologue"],
    },
    {
      word: "chorus",
      forms: ["choruses"],
      meaning: [
        "in ancient Greek drama, a group of performers who comment together on the action",
        "歌队，古希腊戏剧中一起评论剧情的一组演员",
      ],
      sentences: [
        "In Greek tragedy, the ___ warns the king again and again, but he does not listen.",
        "The ___ of old men steps forward to tell the audience what happened before the play began.",
        "Masked and moving as one, the ___ sang of the city's grief.",
      ],
      confusions: ["playwright", "farce"],
    },
    {
      word: "tragedy",
      forms: ["tragedies", "tragic"],
      meaning: ["a serious play in which the main character falls from good fortune to ruin", "悲剧，主人公从顺境走向毁灭的严肃戏剧"],
      sentences: [
        "In a ___, the hero's own choices lead step by step to his destruction.",
        "Audiences cried at the end of the ___, when the young lovers both die.",
        "Unlike a comedy, which ends in a wedding, a ___ often ends in death.",
      ],
      confusions: ["farce", "hubris"],
    },
    {
      word: "hubris",
      meaning: [
        "too much pride, especially the pride that makes a person challenge the gods or fate",
        "狂妄自大，尤指使人挑战神明或命运的过度骄傲",
      ],
      sentences: [
        "The king's ___ made him believe that no prophecy could touch him.",
        "In the myth, the young man's ___ leads him to fly too close to the sun.",
        "The coach's ___ cost them the final; he was so sure of winning that he never studied the other team.",
      ],
      confusions: ["tragedy", "denouement"],
    },
    {
      word: "farce",
      forms: ["farces", "farcical"],
      meaning: [
        "a comedy full of wild coincidences, mistaken identities and people hiding behind doors",
        "闹剧，充满离奇巧合、认错人和躲在门后等情节的喜剧",
      ],
      sentences: [
        "The play is a ___ in which three couples hide in the same hotel room without seeing each other.",
        "With slamming doors and twins mistaken for each other, the ___ had the audience laughing for two hours.",
        "The meeting turned into a ___ when the speaker's notes blew away and the microphone fell apart.",
      ],
      confusions: ["tragedy", "chorus"],
    },
    {
      word: "understudy",
      forms: ["understudies"],
      meaning: [
        "an actor who learns another actor's part in order to replace them if needed",
        "替角，学会另一名演员角色以便必要时顶替的演员",
      ],
      sentences: [
        "When the lead actor broke his ankle, his ___ played the role for the rest of the month.",
        "Every night the ___ waited backstage, knowing every line but hoping to speak none of them.",
        "She began as the ___ and became a star after one unexpected night on stage.",
      ],
      confusions: ["playwright", "chorus"],
    },
    {
      word: "denouement",
      meaning: [
        "the final part of a play or story, after the climax, when everything is explained or settled",
        "结局，高潮之后一切得到解释或解决的最后部分",
      ],
      sentences: [
        "In the ___, we learn that the missing letter was in the old man's coat all along.",
        "After the duel, the ___ is short: the survivors bury the dead and the new king is crowned.",
        "The ___ ties up every loose thread, perhaps too neatly.",
      ],
      confusions: ["hubris", "tragedy"],
    },
  ],
};

const law: BatchSpec = {
  id: "words-of-government-and-law",
  title: t("Words of Government and Law", "政府与法律用词"),
  summary: t(
    "Ten words of how laws are made and judged: constitution, amendment, legislature, judiciary, verdict, jury, petition, suffrage, statute and precedent.",
    "十个关于法律制定和审判的词：constitution、amendment、legislature、judiciary、verdict、jury、petition、suffrage、statute 和 precedent。",
  ),
  domain: ["government, courts and the law", "政府、法院和法律"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "constitution",
      forms: ["constitutions", "constitutional"],
      meaning: [
        "the set of basic laws that says how a country is governed and what rights its people have",
        "宪法，规定国家如何治理及人民享有何种权利的根本法",
      ],
      sentences: [
        "The new ___ divided power among a president, a parliament and the courts.",
        "No ordinary law may break the rules written in the ___.",
        "The students wrote their own ___ for their club, setting out how leaders would be chosen.",
      ],
      confusions: ["statute", "amendment"],
    },
    {
      word: "amendment",
      forms: ["amendments", "amend", "amended"],
      meaning: ["a formal change or addition to a law or constitution", "修正案，对法律或宪法的正式修改或补充"],
      sentences: [
        "The ___ to the constitution gave women the right to vote.",
        "The council voted down the ___ that would have closed the park at night.",
        "Changing the constitution is hard, so few proposals for any ___ ever succeed.",
      ],
      confusions: ["petition", "precedent"],
    },
    {
      word: "legislature",
      forms: ["legislatures", "legislative", "legislators"],
      meaning: ["the elected group of people who make a country's or state's laws", "立法机关，制定国家或州法律的民选机构"],
      sentences: [
        "The state ___ meets every spring to debate new laws.",
        "A bill must pass both houses of the ___ before the governor can sign it.",
        "Citizens wrote to members of the ___, asking them to protect the forest.",
      ],
      confusions: ["judiciary", "jury"],
    },
    {
      word: "judiciary",
      meaning: ["the system of courts and judges of a country", "司法机构，一个国家的法院和法官体系"],
      sentences: [
        "An independent ___ can rule against the government when it breaks the law.",
        "The president may not fire judges, because the ___ is a separate branch.",
        "Reformers argued that the ___ needed more judges to hear cases quickly.",
      ],
      confusions: ["legislature", "jury"],
    },
    {
      word: "verdict",
      forms: ["verdicts"],
      meaning: ["the decision of a jury or judge about whether someone is guilty", "裁决，陪审团或法官关于某人是否有罪的决定"],
      sentences: [
        "After three days of discussion, the jury reached a ___ of not guilty.",
        "The whole town waited outside the courthouse to hear the ___.",
        "The judge read the ___ aloud, and the accused man's mother began to cry.",
      ],
      confusions: ["statute", "petition"],
    },
    {
      word: "jury",
      forms: ["juries", "jurors"],
      meaning: ["a group of ordinary citizens chosen to decide the facts of a trial", "陪审团，被选出来裁定审判事实的普通公民"],
      sentences: [
        "The twelve members of the ___ listened to every witness before deciding.",
        "The lawyer turned to the ___ and asked them to imagine themselves in her client's place.",
        "In some countries, trials are decided by a judge alone, with no ___.",
      ],
      confusions: ["judiciary", "legislature"],
    },
    {
      word: "petition",
      forms: ["petitions", "petitioned"],
      meaning: [
        "a written request, often signed by many people, asking those in power to act",
        "请愿书，常由许多人签名、要求掌权者采取行动的书面请求",
      ],
      sentences: [
        "More than five thousand people signed the ___ to save the old library.",
        "The students delivered their ___ to the mayor's office in a cardboard box.",
        "The right to ___ the government is protected in many constitutions.",
      ],
      confusions: ["amendment", "verdict"],
    },
    {
      word: "suffrage",
      meaning: ["the right to vote in public elections", "选举权，在公共选举中投票的权利"],
      sentences: [
        "Women who fought for ___ marched, wrote and went to prison for the right to vote.",
        "Universal ___ means every adult citizen may vote, rich or poor.",
        "New Zealand granted women ___ in 1893, before most other countries.",
      ],
      confusions: ["precedent", "petition"],
    },
    {
      word: "statute",
      forms: ["statutes"],
      meaning: ["a written law passed by a legislature", "成文法，由立法机关通过的书面法律"],
      sentences: [
        "The ___ makes it a crime to sell fireworks to anyone under eighteen.",
        "Judges must apply the ___ as written, even when they think it is unwise.",
        "An old ___ from 1890 still forbids horses on the main street.",
      ],
      confusions: ["constitution", "verdict"],
    },
    {
      word: "precedent",
      forms: ["precedents"],
      meaning: [
        "an earlier decision or event that is used as a rule or example for later ones",
        "先例，作为以后规则或范例的先前判决或事件",
      ],
      sentences: [
        "The judge followed the ___ set by a similar case twenty years earlier.",
        "Letting one student skip the exam would set the ___ that others would expect to follow.",
        "Her victory in court became the ___ for thousands of workers with the same complaint.",
      ],
      confusions: ["amendment", "statute"],
    },
  ],
};

const science: BatchSpec = {
  id: "words-of-scientific-inquiry",
  title: t("Words of Scientific Inquiry", "科学探究用词"),
  summary: t(
    "Ten words of how science tests ideas: hypothesis, variable, replicate, empirical, correlation, anomaly, consensus, ethical, placebo and skeptical.",
    "十个关于科学如何检验观点的词：hypothesis、variable、replicate、empirical、correlation、anomaly、consensus、ethical、placebo 和 skeptical。",
  ),
  domain: ["experiments and how science reaches its conclusions", "实验以及科学如何得出结论"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "hypothesis",
      forms: ["hypotheses"],
      meaning: ["an idea that can be tested to explain something", "假设，可以检验的、用来解释某事的想法"],
      sentences: [
        "Her ___ was that plants given music would grow faster than plants kept in silence.",
        "The experiment showed that the ___ was wrong, which taught the team something new.",
        "A good ___ makes a prediction that an experiment could prove false.",
      ],
      confusions: ["variable", "consensus"],
    },
    {
      word: "variable",
      forms: ["variables"],
      meaning: ["a factor in an experiment that can change or be changed", "变量，实验中可以变化或被改变的因素"],
      sentences: [
        "To test the fertilizer fairly, keep every ___ the same except the amount of fertilizer.",
        "Temperature was the only ___ the students changed from one jar to the next.",
        "If you change two things at once, you cannot tell which ___ caused the result.",
      ],
      confusions: ["hypothesis", "placebo"],
    },
    {
      word: "replicate",
      forms: ["replicated", "replicates", "replication"],
      meaning: ["to repeat an experiment to see whether the same results appear", "重复（实验），看是否得到同样的结果"],
      sentences: [
        "Other labs tried to ___ the surprising result, but none of them could.",
        "A finding that no one can ___ should not be trusted.",
        "The scientists described every step so that anyone could ___ their work.",
      ],
      confusions: ["empirical", "skeptical"],
    },
    {
      word: "empirical",
      meaning: ["based on observation and experiment rather than on theory alone", "经验的，基于观察和实验而不仅是理论的"],
      sentences: [
        "The claim sounds reasonable, but there is no ___ evidence for it.",
        "Galileo trusted ___ tests, dropping objects and timing them, more than the books of ancient thinkers.",
        "Science is ___: an idea must finally answer to what we can observe.",
      ],
      confusions: ["ethical", "skeptical"],
    },
    {
      word: "correlation",
      forms: ["correlations", "correlated"],
      meaning: ["a connection in which two things tend to change together", "相关性，两件事倾向于一起变化的关联"],
      sentences: [
        "There is a clear ___ between ice cream sales and drownings, but ice cream does not cause drowning; hot weather drives both.",
        "The study found a strong ___ between hours of sleep and test scores.",
        "This ___ alone cannot prove that one thing causes the other.",
      ],
      confusions: ["anomaly", "hypothesis"],
    },
    {
      word: "anomaly",
      forms: ["anomalies"],
      meaning: ["something that does not fit the expected pattern", "异常，不符合预期模式的事物"],
      sentences: [
        "One reading was far higher than all the others, and the team checked whether the ___ came from a broken instrument.",
        "The planet's strange orbit was the ___ that led astronomers to discover another planet pulling on it.",
        "At first the scientists ignored the ___, but it turned out to be the most important result of all.",
      ],
      confusions: ["correlation", "placebo"],
    },
    {
      word: "consensus",
      meaning: ["general agreement among most of the people in a group", "共识，群体中大多数人的普遍一致意见"],
      sentences: [
        "There is a strong ___ among climate scientists that human activity is warming the planet.",
        "The committee argued for hours but never reached a ___.",
        "A scientific ___ forms slowly, as evidence from many studies points the same way.",
      ],
      confusions: ["hypothesis", "correlation"],
    },
    {
      word: "ethical",
      forms: ["ethics", "unethical"],
      meaning: ["morally right and fair, especially in how people are treated", "合乎道德的，尤指对待他人公正正当的"],
      sentences: [
        "It is not ___ to test a new medicine on people without telling them the risks.",
        "The review board must agree that a study is ___ before it can begin.",
        "Scientists debate whether it is ___ to change the genes of human embryos.",
      ],
      confusions: ["empirical", "skeptical"],
    },
    {
      word: "placebo",
      forms: ["placebos"],
      meaning: [
        "a pill or treatment with no medicine in it, given to compare its effects with a real treatment",
        "安慰剂，不含药物、用于与真实治疗对比的药片或疗法",
      ],
      sentences: [
        "Half the patients took the new drug, and the other half took the ___ made of sugar.",
        "Some people felt better after the ___, simply because they expected to.",
        "Neither the patients nor the doctors knew who had received the ___.",
      ],
      confusions: ["variable", "anomaly"],
    },
    {
      word: "skeptical",
      forms: ["skepticism", "skeptic", "skeptics"],
      meaning: ["doubting a claim until there is good evidence for it", "怀疑的，在有充分证据之前对说法存疑的"],
      sentences: [
        "Good scientists stay ___ of surprising results, even their own.",
        "She was ___ of the advertisement's promise that the cream would make anyone look ten years younger.",
        "The reviewers were ___ because the study had only six participants.",
      ],
      confusions: ["empirical", "ethical"],
    },
  ],
};

const history: BatchSpec = {
  id: "words-of-modern-history",
  title: t("Words of Modern History", "现代史用词"),
  summary: t(
    "Ten words for the changes of the last two centuries: industrialization, immigration, depression, propaganda, totalitarian, alliance, decolonization, globalization, refugee and revolution.",
    "十个关于近两个世纪变化的词：industrialization、immigration、depression、propaganda、totalitarian、alliance、decolonization、globalization、refugee 和 revolution。",
  ),
  domain: ["the history of the modern world", "现代世界的历史"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "industrialization",
      forms: ["industrial", "industrialized"],
      meaning: [
        "the change from an economy of farms and handwork to one of factories and machines",
        "工业化，从农业和手工经济转变为工厂和机器经济",
      ],
      sentences: [
        "___ drew millions of people from the countryside into crowded factory towns.",
        "With ___ came railways, coal smoke and twelve-hour working days.",
        "Japan's rapid ___ in the late 1800s turned it into a modern power within a generation.",
      ],
      confusions: ["globalization", "revolution"],
    },
    {
      word: "immigration",
      forms: ["immigrant", "immigrants", "immigrated"],
      meaning: ["coming to live permanently in a foreign country", "移民（入境），来到外国永久居住"],
      sentences: [
        "Waves of ___ brought workers from Ireland, Italy and China to American cities.",
        "The new law limited ___ from some countries and welcomed it from others.",
        "Many of the city's restaurants were opened by families who arrived during the great ___ of the 1900s.",
      ],
      confusions: ["refugee", "decolonization"],
    },
    {
      word: "depression",
      forms: ["depressions"],
      meaning: ["a long period when business is very bad and many people have no work", "（经济）萧条，商业极不景气、大量人失业的长时期"],
      sentences: [
        "During the ___ of the 1930s, one worker in four in the United States had no job.",
        "Banks closed, farms failed, and families stood in line for bread throughout the ___.",
        "Leaders feared that a crash on the stock market could start another ___.",
      ],
      confusions: ["revolution", "propaganda"],
    },
    {
      word: "propaganda",
      meaning: [
        "information, often false or one-sided, spread to make people support a cause",
        "宣传，为使人们支持某一事业而散布的信息，常常是虚假或片面的",
      ],
      sentences: [
        "Wartime ___ showed the enemy as monsters and every soldier on one's own side as a hero.",
        "The government controlled the radio and filled it with ___.",
        "Learning to spot ___ means asking who made a message and what they want you to do.",
      ],
      confusions: ["alliance", "depression"],
    },
    {
      word: "totalitarian",
      meaning: ["controlling every part of people's lives and allowing no opposition", "极权的，控制人们生活的方方面面、不允许任何反对的"],
      sentences: [
        "In a ___ state, the government decides what people read, say and even think.",
        "The ___ regime arrested anyone who criticized its leader.",
        "The novel imagines a ___ world where cameras watch every room.",
      ],
      confusions: ["revolution", "propaganda"],
    },
    {
      word: "alliance",
      forms: ["alliances", "allies"],
      meaning: ["an agreement between countries to support each other, especially in war", "联盟，国家之间互相支持（尤其在战争中）的协定"],
      sentences: [
        "A web of ___ treaties pulled one country after another into the First World War.",
        "The two nations formed this ___ against their larger neighbor.",
        "After the war, the old ___ broke apart as former friends became rivals.",
      ],
      confusions: ["globalization", "propaganda"],
    },
    {
      word: "decolonization",
      meaning: ["the process by which colonies became independent countries", "去殖民化，殖民地成为独立国家的过程"],
      sentences: [
        "After 1945, ___ created dozens of new nations in Africa and Asia.",
        "India's independence in 1947 was one of the first great steps of ___.",
        "The map of the world changed more during ___ than in any other period of the century.",
      ],
      confusions: ["immigration", "industrialization"],
    },
    {
      word: "globalization",
      meaning: [
        "the growing connection of the world's countries through trade, travel and communication",
        "全球化，世界各国通过贸易、旅行和通信日益紧密地联系在一起",
      ],
      sentences: [
        "Thanks to ___, a phone may be designed in one country, built in another and sold in a hundred more.",
        "Critics say ___ has moved factory jobs to wherever wages are lowest.",
        "Container ships and the internet sped up ___ at the end of the twentieth century.",
      ],
      confusions: ["industrialization", "alliance"],
    },
    {
      word: "refugee",
      forms: ["refugees"],
      meaning: ["a person forced to leave their country because of war, danger or persecution", "难民，因战争、危险或迫害被迫离开祖国的人"],
      sentences: [
        "The ___ crossed the mountains on foot, carrying only what she could hold.",
        "After the war, camps across Europe held millions of people, and each ___ hoped to find a new home.",
        "As a young ___, he arrived with no money and no English, and later became a doctor.",
      ],
      confusions: ["immigration", "decolonization"],
    },
    {
      word: "revolution",
      forms: ["revolutions", "revolutionary", "revolutionaries"],
      meaning: ["a sudden, complete change, especially the overthrow of a government by its people", "革命，彻底的突变，尤指人民推翻政府"],
      sentences: [
        "The ___ of 1917 ended the rule of the tsars in Russia.",
        "The printing press began a ___ in how ideas spread.",
        "Crowds filled the square, and within a week the ___ had swept the old government away.",
      ],
      confusions: ["depression", "totalitarian"],
    },
  ],
};

const poetic: BatchSpec = {
  id: "words-for-poetic-form",
  title: t("Words for Poetic Form", "诗歌形式用词"),
  summary: t(
    "Ten words for the shapes of poems: stanza, couplet, sonnet, ballad, haiku, ode, elegy, meter, refrain and enjambment.",
    "十个描述诗歌形式的词：stanza、couplet、sonnet、ballad、haiku、ode、elegy、meter、refrain 和 enjambment。",
  ),
  domain: ["the forms of poetry", "诗歌的形式"],
  prerequisites: ["context-clues", "sound-devices"],
  encompasses: fromClues,
  words: [
    {
      word: "stanza",
      forms: ["stanzas"],
      meaning: ["a group of lines in a poem, set apart like a paragraph", "诗节，诗中像段落一样分开的一组诗行"],
      sentences: [
        "Each ___ of the poem has four lines and describes a different season.",
        "The final ___ is only two lines long, which makes its ending feel sudden.",
        "The poet uses a blank line between each ___, the way a writer of prose begins a new paragraph.",
      ],
      confusions: ["couplet", "refrain"],
    },
    {
      word: "couplet",
      forms: ["couplets"],
      meaning: ["two lines of poetry together, usually rhyming", "对句，两行连在一起的诗，通常押韵"],
      sentences: [
        "The sonnet closes with a rhyming ___ that sums up its argument.",
        '"The day is done, the sun has set; / The work is long, unfinished yet" is a ___.',
        "The whole poem is written in rhyming pairs, one ___ after another.",
      ],
      confusions: ["stanza", "refrain"],
    },
    {
      word: "sonnet",
      forms: ["sonnets"],
      meaning: ["a poem of fourteen lines with a set pattern of rhyme", "十四行诗，有固定押韵格式的十四行诗"],
      sentences: [
        "Of all the poems Shakespeare wrote about time, this ___ is the most famous.",
        "Her ___ fits a whole love story into just fourteen lines.",
        "In an Italian ___, the first eight lines raise a question and the last six answer it.",
      ],
      confusions: ["ode", "ballad"],
    },
    {
      word: "ballad",
      forms: ["ballads"],
      meaning: [
        "a poem or song that tells a story in short stanzas, often with a repeated line",
        "叙事歌谣，用短诗节讲述故事、常有重复诗句的诗或歌",
      ],
      sentences: [
        "The old ___ tells of a sailor who never came home, in twenty short verses.",
        "Folk singers passed the ___ from village to village for three hundred years before anyone wrote it down.",
        "Like most of its kind, the ___ tells a dramatic story with a sad ending.",
      ],
      confusions: ["sonnet", "elegy"],
    },
    {
      word: "haiku",
      forms: ["haikus"],
      meaning: [
        "a short Japanese form of three lines, often of five, seven and five syllables, about a moment in nature",
        "俳句，日本的短诗形式，三行，常为五、七、五音节，描写自然中的一个瞬间",
      ],
      sentences: [
        "Her ___ captured a frog leaping into an old pond in just three lines.",
        "Basho, the great master of the ___, traveled across Japan on foot.",
        "Writing each ___ teaches you to choose every syllable with care.",
      ],
      confusions: ["couplet", "ode"],
    },
    {
      word: "ode",
      forms: ["odes"],
      meaning: ["a serious poem that praises or speaks to a person, thing or idea", "颂歌，赞美或向某人、某物或某观念致辞的庄重诗歌"],
      sentences: [
        "Keats wrote his ___ to a nightingale, praising its song as something that never dies.",
        "Pablo Neruda wrote a playful ___ to his socks, praising them as if they were treasures.",
        "The poem is the poet's ___ to the city, celebrating its bridges, markets and crowded trains.",
      ],
      confusions: ["elegy", "sonnet"],
    },
    {
      word: "elegy",
      forms: ["elegies"],
      meaning: ["a poem of sorrow for someone who has died", "挽歌，哀悼死者的诗"],
      sentences: [
        "He wrote this ___ for his grandmother and read it aloud at her funeral.",
        "The ___ moves from grief to a quiet acceptance in its final lines.",
        "Thomas Gray's famous ___ mourns the forgotten poor buried in a country churchyard.",
      ],
      confusions: ["ode", "ballad"],
    },
    {
      word: "meter",
      forms: ["meters", "metrical"],
      meaning: ["the regular pattern of stressed and unstressed syllables in a line of poetry", "格律，诗行中重读与非重读音节的规律模式"],
      sentences: [
        "The ___ of the poem is so steady that it sounds like a horse's hooves.",
        "Most of Shakespeare's lines follow the same ___: ten syllables, with every second one stressed.",
        "Free verse has no fixed ___; its lines follow the rhythms of speech.",
      ],
      confusions: ["enjambment", "refrain"],
    },
    {
      word: "refrain",
      forms: ["refrains"],
      meaning: ["a line or group of lines repeated through a poem or song", "叠句，在诗或歌中反复出现的诗行"],
      sentences: [
        'The ___ "and still the river runs" returns at the end of every stanza.',
        "By the last verse, the whole audience was singing the ___ along with her.",
        "Each time the ___ comes back, its meaning grows darker.",
      ],
      confusions: ["stanza", "meter"],
    },
    {
      word: "enjambment",
      meaning: ["running a sentence from one line of poetry onto the next without a pause", "跨行，句子从一行诗延续到下一行而不停顿"],
      sentences: [
        "The poet's ___ pulls the reader quickly from one line into the next, the way the river pulls the boat.",
        'Through ___, the sentence "I could not / stop" breaks across two lines, and the break itself becomes a pause of fear.',
        "Notice the ___ here: the line ends in the middle of a thought, so we must read on to find out what happened.",
      ],
      confusions: ["meter", "couplet"],
    },
  ],
};

const reflection: BatchSpec = {
  id: "words-for-reflection",
  title: t("Words for Reflection", "反思用词"),
  summary: t(
    "Ten words for writing about one's own experience: introspective, poignant, candid, ambivalent, formative, resolve, vulnerable, perseverance, gratitude and aspiration.",
    "十个书写个人经历的词：introspective、poignant、candid、ambivalent、formative、resolve、vulnerable、perseverance、gratitude 和 aspiration。",
  ),
  domain: ["one's own experience and growth", "个人的经历与成长"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "introspective",
      meaning: ["tending to look inward and think about one's own thoughts and feelings", "内省的，倾向于审视自己的想法和感受的"],
      sentences: [
        "After the accident, he became quiet and ___, spending long evenings thinking about what mattered to him.",
        "Her diary is ___; it records far more about her feelings than about the events of her day.",
        "The essay is ___, asking again and again why the writer acted as she did.",
      ],
      confusions: ["candid", "ambivalent"],
    },
    {
      word: "poignant",
      meaning: ["causing a sharp feeling of sadness or tenderness", "令人心酸的，引起强烈悲伤或柔情的"],
      sentences: [
        "The most ___ moment of the film is when the old man finds his late wife's handwriting in a cookbook.",
        "Her letter home from the war was short but ___.",
        "It was ___ to see my grandfather's empty chair at the table that first holiday.",
      ],
      confusions: ["vulnerable", "formative"],
    },
    {
      word: "candid",
      meaning: ["honest and direct, even about uncomfortable things", "坦率的，即使对令人不快的事也诚实直接的"],
      sentences: [
        "In her ___ interview, the champion admitted that she had nearly quit the sport twice.",
        "I asked my friend for her ___ opinion of my essay, and she told me the ending did not work.",
        "The memoir is ___ about the author's mistakes as a young father.",
      ],
      confusions: ["introspective", "vulnerable"],
    },
    {
      word: "ambivalent",
      forms: ["ambivalence"],
      meaning: ["having mixed or opposite feelings about something", "矛盾的，对某事怀有复杂或相反感情的"],
      sentences: [
        "I felt ___ about moving: excited by the new city but sad to leave my friends.",
        "She remained ___ about the job offer, since it paid well but meant leaving her family.",
        "Many voters were ___, liking the candidate's ideas but doubting his experience.",
      ],
      confusions: ["introspective", "candid"],
    },
    {
      word: "formative",
      meaning: ["having a deep influence on how a person develops", "对人的成长有深远影响的"],
      sentences: [
        "The summers he spent on his uncle's farm were ___ years that shaped his love of the land.",
        "Losing the election in ninth grade was a ___ experience; it taught her how to lose well.",
        "Her ___ years in a busy household taught her to work through noise.",
      ],
      confusions: ["poignant", "vulnerable"],
    },
    {
      word: "resolve",
      meaning: ["firm determination to do something", "决心，坚定地要做某事的意志"],
      sentences: [
        "Each failure only strengthened her ___ to finish the race the next year.",
        "His ___ weakened after the third rejection letter, but he kept writing.",
        "With quiet ___, she sat down at the piano and began the piece again from the start.",
      ],
      confusions: ["perseverance", "aspiration"],
    },
    {
      word: "vulnerable",
      forms: ["vulnerability"],
      meaning: ["easily hurt, physically or emotionally", "易受伤害的，在身体或情感上脆弱的"],
      sentences: [
        "Sharing the poem about her father made her feel ___, but the class listened with respect.",
        "Newborn turtles are ___ on the long crawl from their nests to the sea.",
        "He hid his fear because he did not want to seem ___ in front of his teammates.",
      ],
      confusions: ["candid", "ambivalent"],
    },
    {
      word: "perseverance",
      forms: ["persevere", "persevered"],
      meaning: ["continuing to try in spite of difficulty or failure", "毅力，不顾困难或失败而坚持努力"],
      sentences: [
        "It took four years of ___ for him to learn to walk again after the injury.",
        "Her ___ paid off when, after twenty tries, the experiment finally worked.",
        "Talent helps, but ___ is what finishes a novel.",
      ],
      confusions: ["resolve", "gratitude"],
    },
    {
      word: "gratitude",
      meaning: ["the feeling of being thankful", "感激之情"],
      sentences: [
        "She wrote to her old teacher to express her ___ for the hours of extra help.",
        "Full of ___, the family invited the firefighters to dinner.",
        "The essay ends not in sadness but in ___ for the years they had together.",
      ],
      confusions: ["aspiration", "perseverance"],
    },
    {
      word: "aspiration",
      forms: ["aspirations", "aspire", "aspires"],
      meaning: ["a strong hope or goal for the future", "抱负，对未来强烈的希望或目标"],
      sentences: [
        "Her greatest ___ is to become the first doctor in her family.",
        "The scholarship helps students whose ___ is bigger than their bank account.",
        "As a boy, his only ___ was to play in the national orchestra.",
      ],
      confusions: ["gratitude", "resolve"],
    },
  ],
};

const batches: readonly BatchSpec[] = [literary, rhetoric, theater, law, science, history, poetic, reflection];

/** wordTopics912 are the vocabulary topics of grades 9 to 12. */
export const wordTopics912: readonly TopicDef[] = batches.map(batchTopic);

/** vocabulary912 are the words the batches of grades 9 to 12 teach. */
export const vocabulary912: readonly WordBatch[] = batches.map(batchWords);
