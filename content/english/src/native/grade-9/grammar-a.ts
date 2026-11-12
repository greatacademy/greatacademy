// Grade 9: grammar of the first units: the kinds of phrases, the three kinds of dependent clauses, complements and
// objects, elliptical clauses and possessives before gerunds.

import type { TopicDef } from "@ga/content";
import { choose, type Label, label, topic } from "../grade-6/kit.ts";

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

const phraseLabels: Readonly<Record<string, Label>> = {
  prepositional: L(
    "介词短语",
    "It begins with a preposition such as *in*, *across* or *beneath* and ends with its object, a noun or a pronoun.",
    "它以 *in*、*across* 或 *beneath* 这样的介词开头，以介词的宾语（名词或代词）结尾。",
    "A prepositional phrase begins with a preposition and ends with its object, and this phrase does not.",
    "介词短语以介词开头、以介词宾语结尾，而这个短语不是这样。",
  ),
  appositive: L(
    "同位语短语",
    "It is a noun phrase set beside another noun to rename it, telling us who or what that noun is.",
    "它是放在另一个名词旁边的名词短语，给那个名词换一个说法，告诉我们它是谁或是什么。",
    "An appositive renames the noun beside it, and this phrase does not rename a noun.",
    "同位语给旁边的名词换一个说法，而这个短语并没有重新指称一个名词。",
  ),
  participial: L(
    "分词短语",
    "It begins with a participle, an *-ing* or *-ed* form or one such as *broken*, and the whole phrase describes a noun.",
    "它以分词开头（*-ing*、*-ed* 形式或 *broken* 这样的形式），整个短语描述一个名词。",
    "A participial phrase describes a noun, and this phrase does not.",
    "分词短语描述名词，而这个短语没有描述名词。",
  ),
  gerund: L(
    "动名词短语",
    "It begins with an *-ing* word and the whole phrase does a noun's job, as the subject or an object of the sentence.",
    "它以 *-ing* 词开头，整个短语起名词的作用，作句子的主语或宾语。",
    "A gerund phrase names an activity and does a noun's job, and this phrase does not.",
    "动名词短语指一种活动、起名词作用，而这个短语不是。",
  ),
  infinitive: L(
    "不定式短语",
    "It begins with *to* and the base form of a verb, as in *to cross the river*.",
    "它以 *to* 加动词原形开头，如 *to cross the river*。",
    "An infinitive phrase begins with *to* and a verb, and this phrase does not.",
    "不定式短语以 *to* 加动词开头，而这个短语不是。",
  ),
};

const jobLabels: Readonly<Record<string, Label>> = {
  noun: L(
    "名词",
    "The phrase does a noun's job: it is the subject, an object or a complement, and you could replace it with *it* or *something*.",
    "这个短语起名词的作用：作主语、宾语或补语，可以用 *it* 或 *something* 替换。",
    "The phrase cannot be replaced by *it* or *something*, so it is not doing a noun's job.",
    "这个短语不能用 *it* 或 *something* 替换，所以不是在起名词的作用。",
  ),
  adjective: L(
    "形容词",
    "The phrase describes a noun, telling which one or what kind, as an adjective would.",
    "这个短语描述一个名词，说明是哪一个或哪一种，就像形容词一样。",
    "The phrase does not describe a noun here.",
    "这里的短语没有描述名词。",
  ),
  adverb: L(
    "副词",
    "The phrase tells how, when, where or why about the verb, as an adverb would.",
    "这个短语说明动作的方式、时间、地点或原因，就像副词一样。",
    "The phrase does not tell how, when, where or why about the verb.",
    "这个短语并没有说明动作的方式、时间、地点或原因。",
  ),
};

const phrases = topic("grammar", {
  id: "kinds-of-phrases",
  title: ["Kinds of Phrases", "短语的种类"],
  summary: [
    "Prepositional, appositive, participial, gerund and infinitive phrases, and the job each does in a sentence: noun, adjective or adverb.",
    "介词短语、同位语短语、分词短语、动名词短语和不定式短语，以及每种短语在句中的作用：名词、形容词或副词。",
  ],
  after: ["phrases-and-clauses", "gerund-and-infinitive-phrases"],
  points: [
    label(
      "naming-the-phrase",
      ["Naming the Phrase", "辨认短语的种类"],
      [
        "A **phrase** is a group of words without its own subject and verb. Name it by the word it begins with. A **prepositional** phrase begins with a preposition: *across the dark sea*. An **appositive** phrase renames a noun: *Odysseus, **the king of Ithaca***. A **participial** phrase begins with a participle and describes a noun: ***Tied to the mast**, he heard the song.* A **gerund** phrase begins with an *-ing* word and acts as a noun: ***Escaping the giant** took cunning.* An **infinitive** phrase begins with *to* and a verb: *He longed **to see his home**.*",
        "**短语**是一组没有自己主语和谓语的词。根据开头的词来辨认它。**介词短语**以介词开头：*across the dark sea*。**同位语短语**给名词换一个说法：*Odysseus, **the king of Ithaca***。**分词短语**以分词开头，描述名词：***Tied to the mast**, he heard the song.* **动名词短语**以 *-ing* 词开头，起名词作用：***Escaping the giant** took cunning.* **不定式短语**以 *to* 加动词开头：*He longed **to see his home**.*",
      ],
      ["What kind of phrase is in bold?", "粗体部分是哪种短语？"],
      `
        The ship sailed **across the wine-dark sea**.|prepositional
        Odysseus, **the king of Ithaca**, longed for home.|appositive
        **Tied to the mast**, he listened to the Sirens.|participial
        **Escaping the Cyclops** took great cunning.|gerund
        He wanted **to see his wife again**.|infinitive
        The hero hid **beneath the belly of a ram**.|prepositional
        Penelope, **his faithful wife**, waited twenty years.|appositive
        The suitors, **feasting in the hall**, ignored the beggar.|participial
        **Weaving and unweaving the shroud** kept the suitors away.|gerund
        Athena came down **to help the young prince**.|infinitive
        The bard sang **of ancient wars**.|prepositional
        Beowulf, **a warrior from across the sea**, came to the hall.|appositive
        **Wounded by the hero**, the monster fled into the marsh.|participial
        The king's dream was **ruling a peaceful land**.|gerund
        No one dared **to enter the dragon's cave**.|infinitive
        The sword lay **at the bottom of the lake**.|prepositional
        Gilgamesh, **the great king of Uruk**, feared death.|appositive
        **Hearing the war horn**, the villagers ran for the gates.|participial
        **Keeping a promise** mattered more to him than gold.|gerund
        Her plan was **to cross the mountains by night**.|infinitive
        The goddess appeared **in the shape of an old woman**.|prepositional
        Hector, **the eldest son of Priam**, defended Troy.|appositive
        The soldiers, **hidden inside the wooden horse**, waited for dark.|participial
        She was praised for **saving the city from the flood**.|gerund
        The young knight swore **to guard the bridge**.|infinitive
        The travelers rested **under an old olive tree**.|prepositional
        Achilles, **the fastest of the Greeks**, refused to fight.|appositive
        **Exhausted by the long voyage**, the crew slept on the beach.|participial
        **Telling the old stories** keeps them alive.|gerund
        The hero returned **to claim his throne**.|infinitive
        The shield hung **above the king's chair**.|prepositional
        Mulan, **a girl in her father's armor**, rode to war.|appositive
      `,
      phraseLabels,
    ),
    label(
      "what-job-the-phrase-does",
      ["What Job the Phrase Does", "短语起什么作用"],
      [
        "Every phrase works in the sentence as one part of speech. It works as a **noun** if it is the subject, an object or a complement: you could put *it* or *something* in its place (***To win the race** was her goal*). It works as an **adjective** if it describes a noun (*the house **on the hill***). It works as an **adverb** if it tells how, when, where or why about the verb (*She trained **to win the race***).\n\nThe same kind of phrase can do different jobs: an infinitive phrase can be a noun, an adjective or an adverb.",
        "每个短语在句中都起某一种词类的作用。如果它作主语、宾语或补语，可以用 *it* 或 *something* 替换（***To win the race** was her goal*），它就起**名词**作用。如果它描述名词（*the house **on the hill***），就起**形容词**作用。如果它说明动作的方式、时间、地点或原因（*She trained **to win the race***），就起**副词**作用。\n\n同一种短语可以起不同的作用：不定式短语可以作名词、形容词或副词。",
      ],
      ["What job does the phrase in bold do in the sentence?", "粗体短语在句中起什么作用？"],
      `
        **To win the race** was her only goal.|noun
        She trained every morning **to win the race**.|adverb
        She had no time **to win the race**.|adjective
        The house **on the hill** belongs to the mayor.|adjective
        The children ran **up the hill**.|adverb
        **Climbing the hill** tired the old horse.|noun
        The girl **holding the lantern** led the way.|adjective
        He was proud of **finishing the climb**.|noun
        We left early **to catch the ferry**.|adverb
        The best way **to learn a language** is to use it.|adjective
        He hoped **to find work in the city**.|noun
        The letter **from her brother** arrived on Monday.|adjective
        She hid the key **under the doormat**.|adverb
        **Reading old letters** made her sad.|noun
        The man **in the gray coat** is a detective.|adjective
        The bus stopped **in front of the library**.|adverb
        They decided **to sell the farm**.|noun
        That is a story **to remember**.|adjective
        He saved money **to buy a bicycle**.|adverb
        Her hobby is **collecting old maps**.|noun
        The road **through the forest** was closed.|adjective
        We waited **for an hour**.|adverb
        The decision **to close the school** angered parents.|adjective
        **To forgive an enemy** takes courage.|noun
        She spoke **with great care**.|adverb
        The boy **sitting by the window** is new.|adjective
        He enjoys **swimming in the lake**.|noun
        They arrived **after the storm**.|adverb
        The painting **above the fireplace** is very old.|adjective
        I came here **to ask for your help**.|adverb
        The hardest part was **saying goodbye**.|noun
        She needs someone **to talk to**.|adjective
      `,
      jobLabels,
    ),
  ],
});

const clauseLabels: Readonly<Record<string, Label>> = {
  "noun clause": L(
    "名词从句",
    "The clause does a noun's job: it is the subject, an object or a complement, and you could replace it with *it* or *something*.",
    "这个从句起名词的作用：作主语、宾语或补语，可以用 *it* 或 *something* 替换。",
    "The clause cannot be replaced by *it* or *something*, so it is not a noun clause.",
    "这个从句不能用 *it* 或 *something* 替换，所以不是名词从句。",
  ),
  "adjective clause": L(
    "形容词从句",
    "The clause comes after a noun and describes it, usually beginning with *who*, *whom*, *whose*, *which* or *that*.",
    "这个从句跟在名词后面描述它，通常以 *who*、*whom*、*whose*、*which* 或 *that* 开头。",
    "The clause does not describe the noun before it, so it is not an adjective clause.",
    "这个从句没有描述前面的名词，所以不是形容词从句。",
  ),
  "adverb clause": L(
    "副词从句",
    "The clause tells when, why, how, under what condition or in spite of what the main action happens, beginning with a word such as *because*, *although*, *when* or *if*.",
    "这个从句说明主要动作发生的时间、原因、方式、条件或让步，以 *because*、*although*、*when* 或 *if* 这样的词开头。",
    "The clause does not tell when, why or under what condition the main action happens.",
    "这个从句没有说明主要动作发生的时间、原因或条件。",
  ),
};

const nounClauseJobs: Readonly<Record<string, Label>> = {
  subject: L(
    "主语",
    "The noun clause comes before the main verb and is what the sentence is about: it does the verb.",
    "这个名词从句在谓语动词前面，是句子所说的对象，即动作的发出者。",
    "The noun clause does not come before the main verb as its subject.",
    "这个名词从句并不是位于谓语前面的主语。",
  ),
  "direct object": L(
    "直接宾语",
    "The noun clause comes right after an action verb such as *know*, *said* or *wonder* and answers *what?*",
    "这个名词从句紧跟在 *know*、*said* 或 *wonder* 这样的行为动词后面，回答“什么？”",
    "The noun clause does not answer *what?* right after an action verb.",
    "这个名词从句并不是紧跟行为动词、回答“什么？”的宾语。",
  ),
  "object of a preposition": L(
    "介词宾语",
    "The noun clause follows a preposition such as *about*, *of* or *on* and completes it.",
    "这个名词从句跟在 *about*、*of* 或 *on* 这样的介词后面，作介词的宾语。",
    "No preposition comes right before this noun clause.",
    "这个名词从句前面没有介词。",
  ),
  "subject complement": L(
    "主语补语（表语）",
    "The noun clause follows a linking verb such as *is* or *was* and renames the subject.",
    "这个名词从句跟在 *is* 或 *was* 这样的系动词后面，说明主语是什么。",
    "The noun clause does not follow a linking verb to rename the subject.",
    "这个名词从句并没有跟在系动词后面说明主语。",
  ),
};

const clauses = topic("grammar", {
  id: "noun-adjective-and-adverb-clauses",
  title: ["Noun, Adjective and Adverb Clauses", "名词从句、形容词从句和副词从句"],
  summary: [
    "The three kinds of dependent clauses, told apart by the job each does, and the jobs a noun clause can do.",
    "三种从句根据各自的作用来区分，以及名词从句可以充当的成分。",
  ],
  after: ["adjective-and-adverb-clauses", "phrases-and-clauses"],
  points: [
    label(
      "naming-the-dependent-clause",
      ["Naming the Dependent Clause", "辨认从句的种类"],
      [
        "A **dependent clause** has a subject and a verb but cannot stand alone. Name it by its job. A **noun clause** does a noun's job and could be replaced by *it* or *something*: *I know **that she lied***. An **adjective clause** follows a noun and describes it: *the girl **who found the map***. An **adverb clause** tells when, why, how or under what condition: ***Although the sea was rough**, they sailed.*\n\nThe first word alone will not tell you: *when* can begin any of the three. *I know **when she left*** (noun), *the day **when she left*** (adjective), *I cried **when she left*** (adverb).",
        "**从句**有主语和谓语，但不能独立成句。根据它的作用来辨认。**名词从句**起名词作用，可以用 *it* 或 *something* 替换：*I know **that she lied***。**形容词从句**跟在名词后面描述它：*the girl **who found the map***。**副词从句**说明时间、原因、方式或条件：***Although the sea was rough**, they sailed.*\n\n只看第一个词并不能判断：*when* 可以引导三种从句中的任何一种。*I know **when she left***（名词），*the day **when she left***（形容词），*I cried **when she left***（副词）。",
      ],
      ["What kind of clause is in bold?", "粗体部分是哪种从句？"],
      `
        I know **that she lied**.|noun clause
        The girl **who found the map** became famous.|adjective clause
        **Although the sea was rough**, they set sail.|adverb clause
        I remember **when she left**.|noun clause
        I will never forget the day **when she left**.|adjective clause
        I cried **when she left**.|adverb clause
        **What he said** surprised everyone.|noun clause
        The book **that I borrowed** is overdue.|adjective clause
        We stayed inside **because it was raining**.|adverb clause
        She wondered **whether the bridge would hold**.|noun clause
        The town **where my mother grew up** has changed.|adjective clause
        **If the river floods**, the road will close.|adverb clause
        Nobody knows **why the ship sank**.|noun clause
        The reason **why the ship sank** is still a mystery.|adjective clause
        The crew panicked **as the ship sank**.|adverb clause
        **Whoever finishes first** wins a prize.|noun clause
        The runner **whose shoe came off** still finished.|adjective clause
        **Unless you hurry**, you will miss the train.|adverb clause
        The truth is **that we were lost**.|noun clause
        The poem, **which she wrote at twelve**, won a prize.|adjective clause
        She smiled **as though nothing had happened**.|adverb clause
        He asked **where the station was**.|noun clause
        I visited the house **where the poet was born**.|adjective clause
        **Wherever she went**, people recognized her.|adverb clause
        **That the king was dying** was kept secret.|noun clause
        The doctor **whom we called** came at once.|adjective clause
        **Once the guests had gone**, she cleaned the kitchen.|adverb clause
        We argued about **how the story should end**.|noun clause
        The painter **who lived next door** gave me lessons.|adjective clause
        He kept running **until he reached the shore**.|adverb clause
        Tell me **what you saw**.|noun clause
        The storm **that hit the coast** destroyed the pier.|adjective clause
      `,
      clauseLabels,
    ),
    label(
      "what-the-noun-clause-does",
      ["What the Noun Clause Does", "名词从句充当什么成分"],
      [
        "A noun clause can do any job a noun does. As the **subject**, it comes before the main verb: ***What she found** changed history.* As a **direct object**, it follows an action verb and answers *what?*: *They knew **that the dam would break**.* As the **object of a preposition**, it follows a word such as *about* or *of*: *We talked about **where we would live**.* As a **subject complement**, it follows a linking verb and renames the subject: *The problem is **that no one listened**.*",
        "名词从句可以充当名词能充当的任何成分。作**主语**时，它位于谓语前面：***What she found** changed history.* 作**直接宾语**时，它跟在行为动词后面，回答“什么？”：*They knew **that the dam would break**.* 作**介词宾语**时，它跟在 *about* 或 *of* 这样的词后面：*We talked about **where we would live**.* 作**主语补语**时，它跟在系动词后面，说明主语是什么：*The problem is **that no one listened**.*",
      ],
      ["What job does the noun clause in bold do?", "粗体的名词从句在句中充当什么成分？"],
      `
        **What she found** changed history.|subject
        They knew **that the dam would break**.|direct object
        We talked about **where we would live**.|object of a preposition
        The problem is **that no one listened**.|subject complement
        **Whoever took the money** must return it.|subject
        She asked **why the shop was closed**.|direct object
        He is proud of **what his daughter achieved**.|object of a preposition
        The question was **whether anyone would help**.|subject complement
        **How the cat got onto the roof** is a mystery.|subject
        I wonder **who wrote this letter**.|direct object
        Give the prize to **whoever deserves it**.|object of a preposition
        Her fear was **that the letter would be lost**.|subject complement
        **That he survived the fall** amazed the doctors.|subject
        The guide explained **how the caves were formed**.|direct object
        We disagreed about **what the poem meant**.|object of a preposition
        The rule is **that no one leaves early**.|subject complement
        **Why she left so suddenly** puzzled her friends.|subject
        Nobody remembered **where the key was hidden**.|direct object
        They were worried about **how the news would spread**.|object of a preposition
        My hope is **that you will come back soon**.|subject complement
        **Whether the plan will work** depends on the weather.|subject
        The judge decided **that the will was valid**.|direct object
        She thought carefully about **which path to take**.|object of a preposition
        The surprise was **that the old man could still dance**.|subject complement
        **What the witness saw** contradicted the police report.|subject
        Do you know **when the train arrives**?|direct object
        He laughed at **what the clown did**.|object of a preposition
        The danger is **that the ice is too thin**.|subject complement
        **Who will be the next captain** is still undecided.|subject
        The letter revealed **that he had a brother**.|direct object
        We were surprised by **how quickly the fire spread**.|object of a preposition
        The trouble was **that nobody had a map**.|subject complement
      `,
      nounClauseJobs,
    ),
  ],
});

const complementLabels: Readonly<Record<string, Label>> = {
  "direct object": L(
    "直接宾语",
    "The word receives the action of the verb and answers *whom?* or *what?* after it.",
    "这个词承受动词的动作，回答动词后面的“谁？”或“什么？”",
    "The word does not receive the action of the verb directly.",
    "这个词并没有直接承受动词的动作。",
  ),
  "indirect object": L(
    "间接宾语",
    "The word comes between the verb and the direct object and tells *to whom* or *for whom* the action is done.",
    "这个词位于动词和直接宾语之间，说明动作是对谁或为谁做的。",
    "The word does not tell to whom or for whom something is done, before a direct object.",
    "这个词并不是位于直接宾语前面、说明动作对象的间接宾语。",
  ),
  "subject complement": L(
    "主语补语（表语）",
    "The word follows a linking verb such as *is*, *seemed* or *became* and renames or describes the subject.",
    "这个词跟在 *is*、*seemed* 或 *became* 这样的系动词后面，说明或描述主语。",
    "The word does not follow a linking verb to rename or describe the subject.",
    "这个词并不是跟在系动词后面说明主语的成分。",
  ),
  "object complement": L(
    "宾语补足语",
    "The word follows the direct object and renames or describes it, with verbs such as *made*, *named*, *called* or *found*.",
    "这个词跟在直接宾语后面，说明或描述宾语，常与 *made*、*named*、*called* 或 *found* 这样的动词搭配。",
    "The word does not rename or describe the direct object that comes before it.",
    "这个词并没有说明或描述它前面的直接宾语。",
  ),
};

const verbKindLabels: Readonly<Record<string, Label>> = {
  transitive: L(
    "及物动词",
    "The verb has a direct object: it acts on someone or something named after it.",
    "这个动词带直接宾语：它作用于后面提到的人或物。",
    "The verb has no direct object here, so it is not transitive in this sentence.",
    "这个动词在这里不带直接宾语，所以在本句中不是及物动词。",
  ),
  intransitive: L(
    "不及物动词",
    "The verb has no direct object; what follows, if anything, tells how, when or where, not *what*.",
    "这个动词不带直接宾语；后面如果有成分，说明的是方式、时间或地点，而不是“什么”。",
    "The verb has an object or a complement here, so it is not intransitive.",
    "这个动词在这里带有宾语或补语，所以不是不及物动词。",
  ),
  linking: L(
    "系动词",
    "The verb joins the subject to a word that renames or describes it; you could put *is* or *was* in its place.",
    "这个动词把主语和说明或描述主语的词连接起来，可以用 *is* 或 *was* 替换。",
    "The verb does not join the subject to a word that describes it; it names an action.",
    "这个动词并不是把主语和描述它的词连起来，而是表示一个动作。",
  ),
};

const complements = topic("grammar", {
  id: "complements-and-objects",
  title: ["Complements and Objects", "补语与宾语"],
  summary: [
    "Direct and indirect objects, subject and object complements, and the transitive, intransitive and linking verbs that take them.",
    "直接宾语和间接宾语、主语补语和宾语补足语，以及带这些成分的及物、不及物和系动词。",
  ],
  after: ["action-and-linking-verbs"],
  points: [
    label(
      "naming-the-complement",
      ["Naming the Complement", "辨认补语和宾语"],
      [
        "A **complement** completes the meaning of a verb. A **direct object** receives the action: *The queen crowned **the knight***. An **indirect object** comes before the direct object and tells to or for whom: *She gave **the knight** a sword.* A **subject complement** follows a linking verb and renames or describes the subject: *The knight became **a hero***. An **object complement** follows the direct object and renames or describes it: *The people called the knight **a hero***.",
        "**补语**补充动词的意思。**直接宾语**承受动作：*The queen crowned **the knight***。**间接宾语**位于直接宾语前，说明对谁或为谁：*She gave **the knight** a sword.* **主语补语**跟在系动词后，说明或描述主语：*The knight became **a hero***。**宾语补足语**跟在直接宾语后，说明或描述宾语：*The people called the knight **a hero***。",
      ],
      ["What is the word in bold?", "粗体的词是什么成分？"],
      `
        The queen crowned **the knight**.|direct object
        She gave **the knight** a sword.|indirect object
        The knight became **a hero**.|subject complement
        The people called the knight **a hero**.|object complement
        The storm sank **the ship**.|direct object
        Her uncle sent **her** a letter.|indirect object
        The soup tasted **salty**.|subject complement
        The long wait made everyone **restless**.|object complement
        The villagers elected **Ana** mayor.|direct object
        The villagers elected Ana **mayor**.|object complement
        Grandmother told **us** a story.|indirect object
        The old house seemed **empty**.|subject complement
        The jury found the man **guilty**.|object complement
        The hunter followed **the tracks**.|direct object
        The teacher showed **the class** a map.|indirect object
        My brother is **a doctor**.|subject complement
        They painted the fence **green**.|object complement
        The dog buried **the bone**.|direct object
        She bought **her sister** a scarf.|indirect object
        The night grew **cold**.|subject complement
        The king named his son **heir**.|object complement
        The poet wrote **a sonnet**.|direct object
        The guide offered **the travelers** water.|indirect object
        The answer was **wrong**.|subject complement
        The fans considered the coach **a genius**.|object complement
        The farmer sold **his horse**.|direct object
        I lent **my friend** my bicycle.|indirect object
        The milk turned **sour**.|subject complement
        The news left her **speechless**.|object complement
        The children built **a snowman**.|direct object
        The waiter brought **us** our soup.|indirect object
        Her voice sounded **tired**.|subject complement
      `,
      complementLabels,
    ),
    label(
      "transitive-intransitive-or-linking",
      ["Transitive, Intransitive or Linking", "及物、不及物还是系动词"],
      [
        "A **transitive** verb takes a direct object: *She **grew** tomatoes.* An **intransitive** verb takes none: *The tomatoes **grew** quickly* (*quickly* tells how, not what). A **linking** verb joins the subject to a word that describes it: *She **grew** tired* (you could say *she was tired*).\n\nMany verbs can be all three. Ask: is there something that receives the action (transitive), nothing after but how, when or where (intransitive), or a word describing the subject (linking)?",
        "**及物动词**带直接宾语：*She **grew** tomatoes.* **不及物动词**不带宾语：*The tomatoes **grew** quickly*（*quickly* 说明方式，不是“什么”）。**系动词**把主语和描述主语的词连接起来：*She **grew** tired*（可以说 *she was tired*）。\n\n许多动词三种用法都有。问一问：后面有承受动作的东西吗（及物）？后面只有方式、时间或地点吗（不及物）？还是有描述主语的词（系动词）？",
      ],
      ["How is the verb in bold used in this sentence?", "粗体动词在本句中是什么用法？"],
      `
        She **grew** tomatoes on the balcony.|transitive
        The tomatoes **grew** quickly.|intransitive
        She **grew** tired of waiting.|linking
        He **smelled** the roses.|transitive
        The roses **smelled** sweet.|linking
        The guard **turned** the key.|transitive
        The guard **turned** pale.|linking
        The wheel **turned** slowly.|intransitive
        The chef **tasted** the sauce.|transitive
        The sauce **tasted** bitter.|linking
        The baby **slept** through the night.|intransitive
        The crowd **became** silent.|linking
        The hunter **felt** the cold wind.|transitive
        The hunter **felt** afraid.|linking
        The ship **sank** in the storm.|intransitive
        The storm **sank** the ship.|transitive
        The singer **appeared** nervous.|linking
        A light **appeared** in the window.|intransitive
        She **kept** the letter for years.|transitive
        She **kept** calm during the fire.|linking
        The children **laughed** at the clown.|intransitive
        He **looked** the stranger in the eye.|transitive
        He **looked** worried.|linking
        The old man **looked** out of the window.|intransitive
        The river **ran** through the valley.|intransitive
        She **ran** the bakery for twenty years.|transitive
        The well **ran** dry.|linking
        The bell **sounded** at noon.|intransitive
        The plan **sounded** reasonable.|linking
        The guard **sounded** the alarm.|transitive
        The leaves **fell** silently.|intransitive
        The prince **remained** loyal to his father.|linking
      `,
      verbKindLabels,
    ),
  ],
});

const elliptical = topic("grammar", {
  id: "elliptical-clauses",
  title: ["Elliptical Clauses", "省略从句"],
  summary: [
    "Clauses with words left out, such as *than I [am]*: finding the missing words and choosing the pronoun that fits them.",
    "省略了词语的从句，如 *than I [am]*：找出省略的部分，选出与之相符的代词。",
  ],
  after: ["pronoun-case", "complete-comparisons"],
  points: [
    choose(
      "the-pronoun-in-a-comparison",
      ["The Pronoun in a Comparison", "比较句中的代词"],
      [
        "An **elliptical clause** leaves out words the reader can supply: *She is taller than **I** [am].* To choose the pronoun after *than* or *as*, finish the clause in your head. If the missing verb follows, use the subject form (*I, he, she, we, they*): *He runs faster than **she** [runs].* If the pronoun receives the action, use the object form (*me, him, her, us, them*): *The coach praised Leo more than [she praised] **me***.\n\nIn formal writing, choose the form the complete clause needs.",
        "**省略从句**省去了读者能自行补出的词：*She is taller than **I** [am].* 要选择 *than* 或 *as* 后面的代词，就在心里把从句补完整。如果后面省略的是谓语动词，用主格（*I, he, she, we, they*）：*He runs faster than **she** [runs].* 如果代词承受动作，用宾格（*me, him, her, us, them*）：*The coach praised Leo more than [she praised] **me***。\n\n在正式写作中，选择完整从句所需要的形式。",
      ],
      ["Which pronoun is correct in formal writing?", "在正式写作中哪个代词是正确的？"],
      `
        My brother is taller than ___.|I|me|myself
        She runs faster than ___.|he|him|himself
        Nobody worked as hard as ___.|they|them|themselves
        The other team scored more goals than ___.|we|us|ourselves
        He is not as old as ___.|she|her|herself
        You know the city better than ___.|I|me|myself
        Our neighbors have lived here longer than ___.|we|us|ourselves
        Lin sings more sweetly than ___.|he|him|himself
        The teacher trusts Mia more than ___. (more than she trusts me)|me|I|myself
        The dog likes my sister more than ___. (more than it likes me)|me|I|myself
        I gave Tom more help than ___. (than I gave her)|her|she|herself
        The judges praised her more than ___. (than they praised him)|him|he|himself
        No one was as surprised as ___.|I|me|myself
        They arrived earlier than ___.|we|us|ourselves
        My cousin is as brave as ___.|she|her|herself
        The coach chose Ana sooner than ___. (than he chose them)|them|they|themselves
        The storm frightened the children more than ___. (than it frightened us)|us|we|ourselves
        She paints better than ___.|I|me|myself
        Grandfather tells stories better than ___.|they|them|themselves
        The book interested my father more than ___. (than it interested me)|me|I|myself
        Few people are as patient as ___.|he|him|himself
        The guide warned Leo sooner than ___. (than she warned me)|me|I|myself
        My friends were as tired as ___.|we|us|ourselves
        Her sister is much younger than ___.|she|her|herself
        The news upset my mother more than ___. (than it upset him)|him|he|himself
        You have read more books than ___.|I|me|myself
        Nobody knows the forest as well as ___.|they|them|themselves
        The teacher thanked Sara more warmly than ___. (than she thanked us)|us|we|ourselves
        My uncle drives more carefully than ___.|she|her|herself
        The prize meant more to Ana than to ___.|me|I|myself
      `,
      (right) => [
        `Finish the clause in your head: the missing words show that **${right}** is the form the complete clause needs.`,
        `在心里把从句补完整：省略的部分表明 **${right}** 是完整从句所需要的形式。`,
      ],
      [
        [
          "*{wrong}* is the wrong case: finish the clause, and you will see that it needs **{right}**.",
          "*{wrong}* 的格不对：把从句补完整，就会看出它需要 **{right}**。",
        ],
        [
          "*{wrong}* is a reflexive pronoun, which refers back to the subject of its own clause; there is nothing for it to refer back to here.",
          "*{wrong}* 是反身代词，用来回指本从句的主语；这里没有它可以回指的对象。",
        ],
      ],
    ),
    choose(
      "what-the-clause-leaves-out",
      ["What the Clause Leaves Out", "从句省略了什么"],
      [
        "Writers often leave out words that the reader can supply from the rest of the sentence. *While [she was] waiting, she read.* *When [it is] ripe, the fruit falls.* *She likes the sea more than [she likes] the mountains.* To read such a sentence, supply the words that the main clause makes obvious.\n\nSometimes the missing words change the meaning: *I miss you more than **he** [misses you]* is not the same as *I miss you more than [I miss] **him***.",
        "作者常常省去读者能从句子其余部分补出的词。*While [she was] waiting, she read.* *When [it is] ripe, the fruit falls.* *She likes the sea more than [she likes] the mountains.* 读这样的句子时，要补出主句已经清楚表明的词。\n\n有时省略的部分会改变意思：*I miss you more than **he** [misses you]* 和 *I miss you more than [I miss] **him*** 不是一个意思。",
      ],
      ["Which words has the writer left out at the mark [ ]?", "作者在 [ ] 处省略了哪些词？"],
      `
        While [ ] waiting for the bus, she read a novel.|she was|the bus was|she had
        When [ ] ripe, the apples fall from the tree.|they are|the tree is|it was
        Though [ ] tired, the runners kept going.|they were|it was|the race was
        She likes the sea more than [ ] the mountains.|she likes|the sea likes|the mountains like
        I miss you more than he [ ].|misses you|misses him|I miss him
        I miss you more than [ ] him.|I miss|he misses|you miss
        If [ ] possible, call me before noon.|it is|you are|I am
        Once [ ] inside, the guests took off their coats.|they were|the house was|it was
        The film was longer than [ ] expected.|we had|it had|the film was
        Although [ ] small, the dog was fierce.|it was|the owner was|they were
        He speaks French better than [ ] English.|he speaks|French speaks|English is
        When [ ] in doubt, ask the teacher.|you are|the teacher is|it was
        The new bridge is stronger than the old one [ ].|was|is stronger|built
        Unless [ ] told otherwise, stay in your seats.|you are|they are|it is
        She trusted her aunt more than [ ] her uncle.|she trusted|her uncle trusted|her aunt trusted
        She trusted her aunt more than her uncle [ ].|did|trusted him|was trusted
        While [ ] on holiday, they visited three museums.|they were|the museums were|it was
        If [ ] necessary, we will cancel the trip.|it is|we are|the trip is
        My sister reads more books than I [ ].|do|read her|am read
        The cake tastes better than it [ ].|looks|tastes|cakes
        Whenever [ ] possible, she walks to school.|it is|she is|school is
        Though [ ] warned of the danger, he climbed on.|he was|the danger was|it was
        The test was easier than [ ] feared.|we had|it had|the test was
        When [ ] finished, put your pencils down.|you are|the pencils are|it is
        Tom helped me more than [ ] Sam.|he helped|Sam helped|I helped
        Tom helped me more than Sam [ ].|did|helped Sam|was helped
        While [ ] still a child, she learned to sail.|she was|the boat was|it was
        If [ ] in danger, press the red button.|you are|the button is|it was
        The river was deeper than [ ] thought.|we had|the river had|it was
        Although [ ] poor, the family was happy.|they were|it was|the house was
      `,
      (right) => [
        `The rest of the sentence makes it clear that **${right}** is the missing part; put it back and the clause is complete.`,
        `句子的其余部分清楚地表明省略的是 **${right}**；把它补回去，从句就完整了。`,
      ],
      [
        [
          "With *{wrong}*, the clause would be about the wrong person or thing; the main clause shows the missing words are **{right}**.",
          "补上 *{wrong}*，从句说的就成了另一个人或物；主句表明省略的是 **{right}**。",
        ],
        [
          "*{wrong}* does not fit the rest of the sentence: put it back and the meaning or the grammar goes wrong.",
          "*{wrong}* 与句子其余部分不符：补回去后，意思或语法就不对了。",
        ],
      ],
    ),
  ],
});

const possessives = topic("grammar", {
  id: "possessives-before-gerunds",
  title: ["Possessives Before Gerunds", "动名词前的所有格"],
  summary: [
    "In formal writing, a possessive comes before a gerund (*his leaving*), while an object pronoun comes before a participle (*I saw him leaving*).",
    "在正式写作中，动名词前用所有格（*his leaving*），而分词前用宾格代词（*I saw him leaving*）。",
  ],
  after: ["identifying-verbals", "apostrophes-and-possessives"],
  points: [
    choose(
      "the-possessive-before-the-gerund",
      ["The Possessive Before the Gerund", "动名词前用所有格"],
      [
        "A **gerund** is an *-ing* word used as a noun. Because it is a noun, the word before it takes the **possessive** form in formal writing, just as it would before any noun: *We were surprised by **his** leaving* (like *his departure*). *I don't mind **Maria's** singing* (like *Maria's song*).\n\nThe object form (*him leaving*) is common in speech, but formal writing prefers the possessive.",
        "**动名词**是用作名词的 *-ing* 词。既然它是名词，在正式写作中它前面的词就用**所有格**，就像在任何名词前一样：*We were surprised by **his** leaving*（如同 *his departure*）。*I don't mind **Maria's** singing*（如同 *Maria's song*）。\n\n宾格形式（*him leaving*）在口语中很常见，但正式写作更喜欢用所有格。",
      ],
      ["Which word is correct in formal writing?", "在正式写作中哪个词是正确的？"],
      `
        We were surprised by ___ leaving so early.|his|him|he
        I don't mind ___ singing in the shower.|your|you|yours
        The teacher was pleased with ___ answering every question.|Ana's|Ana|Anas
        ___ arriving late upset the whole class.|Their|Them|They
        Do you remember ___ falling off the boat?|my|me|mine
        Her parents worried about ___ driving at night.|her|she|hers
        The coach praised ___ running in the final.|Leo's|Leo|Leos
        I can't stand ___ complaining all the time.|his|him|he
        ___ winning the prize surprised everyone.|Our|Us|We
        Nobody objected to ___ joining the team.|her|she|hers
        The noise of ___ hammering woke the baby.|the builders'|the builders|the builder
        We appreciate ___ helping with the move.|your|you|yours
        She was proud of ___ finishing the marathon.|her son's|her son|her sons
        The judge disapproved of ___ shouting in court.|their|them|they
        ___ lying about the accident made things worse.|His|Him|He
        I heard about ___ moving to Canada.|your|you|yours
        The captain insisted on ___ wearing life jackets.|our|us|we
        Mother was annoyed by ___ forgetting his homework again.|Tom's|Tom|Toms
        ___ refusing to apologize ended the friendship.|Her|She|Hers
        The village was shocked by ___ selling the farm.|the family's|the family|the families
        Thank you for ___ waiting so patiently.|your|you|yours
        Everyone laughed at ___ dancing.|my|me|I
        ___ quitting the band was a surprise.|His|Him|He
        The doctor approved of ___ walking every day.|my grandfather's|my grandfather|my grandfathers
        I don't understand ___ wanting to leave.|their|them|they
        The neighbors complained about ___ barking at night.|the dog's|the dog|the dogs
        ___ being late again cost him the job.|His|Him|He
        We celebrated ___ passing the exam.|her|she|hers
        Is there any chance of ___ coming to the party?|your|you|yours
        The town remembers ___ saving the children from the fire.|the firefighter's|the firefighter|the firefighters
      `,
      (right) => [
        `The *-ing* word is a gerund, a noun, so the word before it takes the possessive form **${right}**, just as it would before any noun.`,
        `*-ing* 词是动名词，也就是名词，所以它前面的词用所有格 **${right}**，就像在任何名词前一样。`,
      ],
      [
        [
          "*{wrong}* is the object form, common in speech; before a gerund, formal writing uses the possessive **{right}**.",
          "*{wrong}* 是宾格形式，在口语中常见；在动名词前，正式写作用所有格 **{right}**。",
        ],
        [
          "*{wrong}* is not a possessive that can come before a noun; the gerund needs **{right}**.",
          "*{wrong}* 不是可以放在名词前的所有格；动名词前需要 **{right}**。",
        ],
      ],
    ),
    choose(
      "gerund-or-participle",
      ["Gerund or Participle?", "动名词还是分词？"],
      [
        "Not every *-ing* word after a noun or a pronoun is a gerund. Ask what the sentence is about. If it is about the **action**, the *-ing* word is a gerund and takes a **possessive**: *I dislike **his** shouting* (I dislike the shouting). If it is about the **person**, seen doing something, the *-ing* word is a participle describing that person and takes the **object** form: *I saw **him** shouting* (I saw him; he was shouting).\n\nVerbs of the senses, such as *see*, *hear*, *watch* and *feel*, usually go with a person seen in action.",
        "名词或代词后的 *-ing* 词并不都是动名词。问一问句子说的是什么。如果说的是**动作**，*-ing* 词是动名词，前面用**所有格**：*I dislike **his** shouting*（我讨厌的是喊叫）。如果说的是**人**，看到他在做某事，*-ing* 词是描述这个人的分词，前面用**宾格**：*I saw **him** shouting*（我看见了他，他正在喊叫）。\n\n*see*、*hear*、*watch* 和 *feel* 这样的感官动词，通常与看到的正在行动的人连用。",
      ],
      ["Which word is correct in formal writing?", "在正式写作中哪个词是正确的？"],
      `
        I dislike ___ shouting.|his|him|he
        I saw ___ shouting at the referee.|him|his|he
        We heard ___ singing in the next room.|them|their|they
        We enjoyed ___ singing at the concert.|their|them|they
        The police watched ___ climbing the wall.|the thief|the thief's|the thiefs
        The police were puzzled by ___ climbing the wall.|the thief's|the thief|the thiefs
        I felt ___ trembling beside me.|the child|the child's|the childs
        ___ trembling worried the nurse.|The child's|The child|The childs
        She noticed ___ hiding behind the door.|him|his|he
        She was annoyed by ___ hiding her keys.|his|him|he
        I can see ___ waving from the boat.|you|your|yours
        Thank you for ___ waving goodbye.|your|you|yours
        They caught ___ cheating on the test.|him|his|he
        ___ cheating on the test was discovered.|His|Him|He
        We watched ___ dancing in the square.|them|their|they
        Everyone admired ___ dancing.|their|them|they
        I heard ___ crying in the night.|him|his|he
        ___ crying kept us all awake.|His|Him|He
        The guard spotted ___ running toward the gate.|us|our|we
        The guard was alarmed by ___ running toward the gate.|our|us|we
        We saw ___ painting the fence.|them|their|they
        ___ painting of the fence took all day.|Their|Them|They
        She found ___ sleeping on the sofa.|him|his|he
        ___ sleeping late became a habit.|His|Him|He
        We could hear ___ arguing through the wall.|them|their|they
        ___ arguing went on for hours.|Their|Them|They
        Mother watched ___ swimming across the lake.|me|my|I
        Mother was amazed by ___ swimming across the lake.|my|me|I
        He felt ___ pulling at his sleeve.|you|your|yours
        He objected to ___ pulling at his sleeve.|your|you|yours
      `,
      (right, shown) => [
        shown.includes("saw") ||
        shown.includes("heard") ||
        shown.includes("watched") ||
        shown.includes("felt") ||
        shown.includes("noticed") ||
        shown.includes("caught") ||
        shown.includes("spotted") ||
        shown.includes("found") ||
        shown.includes("hear") ||
        shown.includes("see")
          ? `The sentence is about a person seen or heard in action, so the *-ing* word is a participle describing that person: **${right}**.`
          : `The sentence is about the action itself, so the *-ing* word is a gerund and takes the possessive **${right}**.`,
        shown.includes("saw") ||
        shown.includes("heard") ||
        shown.includes("watched") ||
        shown.includes("felt") ||
        shown.includes("noticed") ||
        shown.includes("caught") ||
        shown.includes("spotted") ||
        shown.includes("found") ||
        shown.includes("hear") ||
        shown.includes("see")
          ? `句子说的是被看到或听到正在行动的人，所以 *-ing* 词是描述这个人的分词：**${right}**。`
          : `句子说的是动作本身，所以 *-ing* 词是动名词，前面用所有格 **${right}**。`,
      ],
      [
        [
          "*{wrong}* treats the sentence the other way round: ask whether it is about the action itself (a gerund, with a possessive) or a person seen doing it (a participle, with the object form). Here it needs **{right}**.",
          "*{wrong}* 把句子理解反了：问一问它说的是动作本身（动名词，用所有格）还是看到某人在做这件事（分词，用宾格）。这里需要 **{right}**。",
        ],
        [
          "*{wrong}* is neither the possessive nor the object form, so it cannot come before the *-ing* word here; the sentence needs **{right}**.",
          "*{wrong}* 既不是所有格也不是宾格，不能放在这里的 *-ing* 词前面；句子需要 **{right}**。",
        ],
      ],
    ),
  ],
});

/** grammarTopics9a are the grammar topics of the first units of grade 9. */
export const grammarTopics9a: readonly TopicDef[] = [phrases, clauses, complements, elliptical, possessives];
