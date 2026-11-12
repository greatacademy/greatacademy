// Grade 7: grammar of the first five units: shifts in mood, phrases and clauses, dangling modifiers, suffixes,
// pronouns in pairs, adjective and adverb clauses, interrupters and tricky subjects.

import type { TopicDef } from "@ga/content";
import { choose, type Label, label, topic } from "../grade-6/kit.ts";

const shiftLabels: Readonly<Record<string, Label>> = {
  "no shift": {
    zh: "没有转换",
    why: [
      "Every verb in the sentence stays in one mood, so the sentence reads smoothly and needs no change.",
      "句中每个动词都保持同一种语气，所以句子读起来流畅，不需要修改。",
    ],
    not: [
      "This sentence does keep one mood throughout, so there is no shift to name.",
      "这个句子自始至终保持同一种语气，所以没有转换可言。",
    ],
  },
  "imperative to indicative": {
    zh: "从祈使语气转为陈述语气",
    why: [
      "It begins with a command to *you* and then turns into a statement about what you should or will do.",
      "它以对 *you* 的命令开头，接着变成了关于你应该或将要做什么的陈述。",
    ],
    not: ["This sentence does not start with a command and then turn into a statement.", "这个句子并不是先发出命令再转为陈述。"],
  },
  "indicative to imperative": {
    zh: "从陈述语气转为祈使语气",
    why: [
      "It begins with a statement of fact and then suddenly gives the reader a command.",
      "它以陈述事实开头，然后突然给读者下了一个命令。",
    ],
    not: ["This sentence does not start with a statement and then turn into a command.", "这个句子并不是先陈述再转为命令。"],
  },
  "subjunctive to indicative": {
    zh: "从虚拟语气转为陈述语气",
    why: [
      "It begins with an unreal or wished-for situation, as with *if I were*, and then states something as a plain fact.",
      "它以不真实或希望的情况开头，如 *if I were*，接着却把某事当作平常的事实来陈述。",
    ],
    not: [
      "This sentence does not start with an unreal wish or condition and then switch to a plain fact.",
      "这个句子并不是先说不真实的愿望或条件再转为平常的事实。",
    ],
  },
};

const moodShifts = topic("grammar", {
  id: "shifts-in-verb-mood",
  title: ["Shifts in Verb Mood", "动词语气的转换"],
  summary: [
    "A sentence keeps one mood: a command stays a command, a fact a fact, and an unreal wish stays unreal.",
    "一个句子保持同一种语气：命令一直是命令，事实一直是事实，不真实的愿望一直是不真实的。",
  ],
  after: ["verb-moods"],
  points: [
    label(
      "naming-the-shift",
      ["Naming the Shift", "辨认语气的转换"],
      [
        "Verbs have **moods**: the **indicative** states a fact (*You open the box*), the **imperative** gives a command (*Open the box*), and the **subjunctive** speaks of something unreal or wished for (*If I were you*). A sentence that starts in one mood should not slide into another: *Open the box, and then you should take out the cable* starts as a command and turns into a statement.",
        "动词有**语气**：**陈述语气**陈述事实（*You open the box*），**祈使语气**发出命令（*Open the box*），**虚拟语气**说不真实或希望的事（*If I were you*）。一个句子用一种语气开头，就不应该滑向另一种：*Open the box, and then you should take out the cable* 以命令开头，后来却变成了陈述。",
      ],
      ["Does the sentence shift mood, and how?", "这个句子是否转换了语气？怎样转换的？"],
      `
        Read the motion aloud, and then you should give your first reason.|imperative to indicative
        Read the motion aloud, and then give your first reason.|no shift
        Each speaker has two minutes, so watch the clock.|indicative to imperative
        Each speaker has two minutes, and the moderator watches the clock.|no shift
        If I were the judge, I would ask more questions, and I ask them politely.|subjunctive to indicative
        If I were the judge, I would ask more questions and would ask them politely.|no shift
        Write down the other side's claim, and you will answer it next.|imperative to indicative
        Write down the other side's claim, and answer it next.|no shift
        The team meets at four, so bring your notes.|indicative to imperative
        The team meets at four, and everyone brings notes.|no shift
        If the school were to ban phones, students would complain, and they complain loudly.|subjunctive to indicative
        If the school were to ban phones, students would complain, and they would complain loudly.|no shift
        Stand when you speak, and you should look at the judges.|imperative to indicative
        Stand when you speak, and look at the judges.|no shift
        The rules allow one rebuttal, so keep it short.|indicative to imperative
        The rules allow one rebuttal, and most speakers keep it short.|no shift
        If she were our captain, she would plan every practice, and she plans them well.|subjunctive to indicative
        If she were our captain, she would plan every practice and would plan them well.|no shift
        Check your facts, and then you can quote the study.|imperative to indicative
        Check your facts, and then quote the study.|no shift
        A good argument answers objections, so answer at least one.|indicative to imperative
        A good argument answers objections, and this one answers two.|no shift
        If we were allowed to vote, we would choose the park, and the park wins.|subjunctive to indicative
        If we were allowed to vote, we would choose the park, and the park would win.|no shift
        Thank your opponent, and you should shake hands at the end.|imperative to indicative
        Thank your opponent, and shake hands at the end.|no shift
        The jury listens to both sides, so listen carefully too.|indicative to imperative
        The jury listens to both sides, and the judge listens too.|no shift
        If I were mayor, I would build a skate park, and I build it near the river.|subjunctive to indicative
        If I were mayor, I would build a skate park and would build it near the river.|no shift
      `,
      shiftLabels,
    ),
    choose(
      "keeping-one-mood",
      ["Keeping One Mood", "保持同一种语气"],
      [
        "To fix a shift, make the second verb match the first. After a command, give another command: *Open the box and **take out** the cable.* After a statement, make another statement. After an unreal *if I were* or *I wish*, keep the *would* of the unreal: *If I were captain, I **would** practice more and **would** listen to everyone.*",
        "要改正语气的转换，就让第二个动词与第一个一致。命令之后接另一个命令：*Open the box and **take out** the cable.* 陈述之后接另一个陈述。在不真实的 *if I were* 或 *I wish* 之后，继续用表示不真实的 *would*：*If I were captain, I **would** practice more and **would** listen to everyone.*",
      ],
      ["Which words keep the sentence in one mood?", "哪个选项能让句子保持同一种语气？"],
      `
        Raise your hand, and then ___ your question.|ask|you should ask|you will ask
        Plan your speech, and ___ it twice before the debate.|practice|you should practice|you practiced
        Read both articles, and ___ the stronger one.|choose|you will choose|you can choose
        Look at the evidence, and ___ what it really shows.|decide|you should decide|you decided
        Turn off your phone, and ___ it in your bag.|put|you can put|you should put
        Listen to the question, and ___ before you answer.|pause|you should pause|you paused
        Open your notebook, and ___ the date at the top.|write|you should write|you will write
        Make a claim, and ___ it with two reasons.|support|you need to support|you supported
        Find the main idea, and ___ it in one sentence.|state|you will state|you stated
        Check the source, and ___ who wrote it.|note|you should note|you noted
        If I were the principal, I would add a garden and ___ students run it.|would let|let|will let
        If he were taller, he would play center and ___ every rebound.|would catch|catches|will catch
        If we were in charge, we would change the menu and ___ fresh fruit.|would add|add|will add
        If she were here, she would explain the rule and ___ our questions.|would answer|answers|will answer
        If I were you, I would apologize and ___ to make it right.|would offer|offer|will offer
        If they were older, they would vote and ___ the town council.|would join|join|will join
        If it were summer, we would swim and ___ on the beach.|would camp|camp|will camp
        If the bus were on time, I would arrive early and ___ the library first.|would visit|visit|will visit
        If our team were stronger, we would win and ___ to the finals.|would travel|travel|will travel
        If I were an author, I would write mysteries and ___ them in Venice.|would set|set|will set
        Close the door, and ___ the lights.|turn off|you should turn off|you turned off
        Copy the quotation exactly, and ___ the author's name.|add|you should add|you added
        Write a clear thesis, and ___ it in your conclusion.|repeat|you will repeat|you repeated
        Take one card, and ___ it to your partner.|pass|you should pass|you passed
        Sit down quietly, and ___ the first page.|read|you should read|you will read
        Mix the flour and the water, and ___ it for ten minutes.|stir|you should stir|you stirred
        Answer each objection, and ___ why it is weaker.|explain|you should explain|you explained
        Wash your hands, and ___ them on a clean towel.|dry|you should dry|you dried
        Count the votes, and ___ the result.|announce|you will announce|you announced
        Find a partner, and ___ your arguments.|compare|you should compare|you compared
      `,
      (right) => [
        `**${right}** keeps the second part in the same mood as the first, so the sentence does not shift.`,
        `**${right}** 让后半句与前半句保持同一种语气，句子就不会转换语气。`,
      ],
      [
        [
          "*{wrong}* turns the sentence into a statement or a different kind of verb halfway through, a shift in mood.",
          "*{wrong}* 让句子中途变成陈述或另一种动词形式，造成语气转换。",
        ],
        [
          "*{wrong}* changes the time or the mood of the verb, so the two parts no longer match.",
          "*{wrong}* 改变了动词的时间或语气，两部分就不再一致。",
        ],
      ],
    ),
  ],
});

const phraseLabels: Readonly<Record<string, Label>> = {
  phrase: {
    zh: "短语",
    why: [
      "The group of words has no subject doing a verb, so it is a phrase, not a clause.",
      "这组词里没有主语和它的动词，所以是短语，不是从句。",
    ],
    not: ["A phrase has no subject and verb of its own, and this group of words has both.", "短语没有自己的主语和动词，而这组词两者都有。"],
  },
  "independent clause": {
    zh: "独立从句",
    why: [
      "It has a subject and a verb and could stand alone as a complete sentence, so it is an independent clause.",
      "它有主语和动词，能单独成为一个完整的句子，所以是独立从句。",
    ],
    not: ["An independent clause could stand alone as a sentence; this group of words could not.", "独立从句可以单独成句，而这组词不能。"],
  },
  "dependent clause": {
    zh: "从属从句",
    why: [
      "It has a subject and a verb, but it begins with a word such as *because*, *when* or *who*, so it cannot stand alone.",
      "它有主语和动词，但以 *because*、*when* 或 *who* 这样的词开头，所以不能单独成句。",
    ],
    not: [
      "A dependent clause has a subject and a verb but needs the rest of the sentence; this group does not fit that.",
      "从属从句有主语和动词但需要依附句子的其余部分；这组词不符合这一点。",
    ],
  },
};

const phraseKinds: Readonly<Record<string, Label>> = {
  "prepositional phrase": {
    zh: "介词短语",
    why: [
      "It begins with a preposition such as *in*, *under* or *across* and ends with a noun.",
      "它以 *in*、*under* 或 *across* 这样的介词开头，以名词结尾。",
    ],
    not: ["A prepositional phrase begins with a preposition, and this one does not.", "介词短语以介词开头，而这个短语不是。"],
  },
  "participial phrase": {
    zh: "分词短语",
    why: [
      "It begins with a verb form ending in *-ing* or *-ed* and describes a noun, as an adjective would.",
      "它以 *-ing* 或 *-ed* 结尾的动词形式开头，像形容词一样描述一个名词。",
    ],
    not: [
      "A participial phrase starts with an *-ing* or *-ed* verb form that describes a noun, and this one does not.",
      "分词短语以描述名词的 *-ing* 或 *-ed* 动词形式开头，而这个短语不是。",
    ],
  },
  "appositive phrase": {
    zh: "同位语短语",
    why: [
      "It is a noun phrase set beside another noun to rename it, telling who or what that noun is.",
      "它是放在另一个名词旁边、给它换个说法的名词短语，说明那个名词是谁或是什么。",
    ],
    not: [
      "An appositive renames the noun beside it, and this phrase does not rename a noun.",
      "同位语给旁边的名词换个说法，而这个短语没有。",
    ],
  },
  "infinitive phrase": {
    zh: "不定式短语",
    why: [
      "It begins with *to* followed by the base form of a verb, as in *to save the reef*.",
      "它以 *to* 加动词原形开头，如 *to save the reef*。",
    ],
    not: ["An infinitive phrase begins with *to* and a verb, and this phrase does not.", "不定式短语以 *to* 加动词开头，而这个短语不是。"],
  },
};

const phrasesAndClauses = topic("grammar", {
  id: "phrases-and-clauses",
  title: ["Phrases and Clauses", "短语与从句"],
  summary: [
    "A clause has a subject and a verb; a phrase does not. Some clauses stand alone, and phrases do different jobs.",
    "从句有主语和动词，短语没有。有些从句能单独成句，而短语各有不同的作用。",
  ],
  after: ["prepositional-phrases", "subordinating-conjunctions"],
  points: [
    label(
      "phrase-or-clause",
      ["Phrase or Clause", "短语还是从句"],
      [
        "A **clause** has a subject and a verb that goes with it: *the octopus hid*. An **independent clause** can stand alone as a sentence. A **dependent clause** begins with a word such as *because*, *when*, *although*, *who* or *that* and cannot stand alone. A **phrase** is a group of words with no subject-and-verb pair: *under the rock*, *hiding from the shark*.",
        "**从句**有主语和与之相配的动词：*the octopus hid*。**独立从句**能单独成句。**从属从句**以 *because*、*when*、*although*、*who* 或 *that* 这样的词开头，不能单独成句。**短语**是一组没有主谓搭配的词：*under the rock*、*hiding from the shark*。",
      ],
      ["What is the group of words in italics?", "斜体部分是什么？"],
      `
        The octopus hid *under a rock*.|phrase
        *The octopus hid* under a rock.|independent clause
        *When the shark swam past*, the octopus hid.|dependent clause
        Divers saw a turtle *near the reef*.|phrase
        *The reef was quiet* after the storm.|independent clause
        The fish scattered *because a seal appeared*.|dependent clause
        *Swimming close to the bottom*, the ray looked for clams.|phrase
        *The water grew colder* as we went deeper.|independent clause
        The water grew colder *as we went deeper*.|dependent clause
        The whale *that we saw* was a humpback.|dependent clause
        Plankton drift *with the currents*.|phrase
        *Plankton drift*, and whales follow them.|independent clause
        *Although the sea looked calm*, the current was strong.|dependent clause
        The crab scuttled *across the sand*.|phrase
        The crab scuttled across the sand, *and the gull followed it*.|independent clause
        We waited *until the tide went out*.|dependent clause
        *To protect the turtles*, the beach closes at night.|phrase
        The beach closes at night *so that turtles can nest*.|dependent clause
        *The turtles nest* in the summer.|independent clause
        Scientists *studying the reef* counted the fish.|phrase
        Scientists *who study the reef* counted the fish.|dependent clause
        *Scientists counted the fish* on the reef.|independent clause
        The kelp forest grows *in cold water*.|phrase
        *If the water warms*, the kelp may die.|dependent clause
        If the water warms, *the kelp may die*.|independent clause
        A jellyfish drifted *past the boat*.|phrase
        The diver, *a marine biologist*, took photos.|phrase
        The diver took photos *while the seal watched*.|dependent clause
        *The seal watched* the diver.|independent clause
        Sea stars live *in tide pools*.|phrase
      `,
      phraseLabels,
    ),
    label(
      "kinds-of-phrases",
      ["Kinds of Phrases", "短语的种类"],
      [
        "Phrases do different jobs. A **prepositional phrase** starts with a preposition (*beneath the waves*). A **participial phrase** starts with an *-ing* or *-ed* verb form and describes a noun (*covered in barnacles*). An **appositive phrase** renames a noun beside it (*the blue whale, the largest animal on Earth*). An **infinitive phrase** starts with *to* and a verb (*to find food*).",
        "短语有不同的作用。**介词短语**以介词开头（*beneath the waves*）。**分词短语**以 *-ing* 或 *-ed* 动词形式开头，描述一个名词（*covered in barnacles*）。**同位语短语**给旁边的名词换个说法（*the blue whale, the largest animal on Earth*）。**不定式短语**以 *to* 加动词开头（*to find food*）。",
      ],
      ["What kind of phrase is in italics?", "斜体部分是哪种短语？"],
      `
        The ship sank *beneath the waves*.|prepositional phrase
        The rock, *covered in barnacles*, was slippery.|participial phrase
        The blue whale, *the largest animal on Earth*, eats tiny krill.|appositive phrase
        Seals dive deep *to find food*.|infinitive phrase
        *Gliding through the water*, the shark circled the boat.|participial phrase
        Coral grows *in warm, shallow seas*.|prepositional phrase
        Our guide, *an old fisherman*, knew every rock.|appositive phrase
        The team worked hard *to clean the beach*.|infinitive phrase
        A crab hid *inside an empty shell*.|prepositional phrase
        *Tired from the long swim*, the turtle rested on the sand.|participial phrase
        The *Alvin*, *a small submersible*, carried three people.|appositive phrase
        Volunteers came *to count the birds*.|infinitive phrase
        Fish *living near the bottom* are often flat.|participial phrase
        We walked *along the shore* at sunset.|prepositional phrase
        Dr. Earle, *a famous ocean explorer*, gave the talk.|appositive phrase
        The boat slowed *to avoid the dolphins*.|infinitive phrase
        Light fades quickly *below two hundred meters*.|prepositional phrase
        *Frightened by the noise*, the fish darted away.|participial phrase
        Krill, *tiny shrimp-like animals*, feed many whales.|appositive phrase
        Sea otters use rocks *to open shellfish*.|infinitive phrase
        *Carried by the current*, the bottle reached Spain.|participial phrase
        The anchor dropped *to the sandy bottom*.|prepositional phrase
        The Pacific, *the deepest ocean*, covers a third of Earth.|appositive phrase
        It is hard *to see in the deep sea*.|infinitive phrase
        The penguins waddled *across the ice*.|prepositional phrase
        *Feeding on plankton*, the whale shark swam slowly.|participial phrase
        My aunt, *a ship's captain*, sails every summer.|appositive phrase
        The class went to the aquarium *to study jellyfish*.|infinitive phrase
        Waves crashed *against the cliffs*.|prepositional phrase
        Nets *left in the sea* trap many animals.|participial phrase
      `,
      phraseKinds,
    ),
  ],
});

const danglingLabels: Readonly<Record<string, Label>> = {
  dangling: {
    zh: "垂悬修饰语",
    why: [
      "The opening phrase describes someone, but the subject after the comma is not that person, so the modifier dangles.",
      "开头的短语描述某个人，但逗号后的主语不是那个人，所以修饰语是垂悬的。",
    ],
    not: [
      "A dangling modifier has no right noun to describe, and here the opening phrase fits the subject after it.",
      "垂悬修饰语找不到它应修饰的名词，而这里开头的短语与后面的主语相符。",
    ],
  },
  misplaced: {
    zh: "错位修饰语",
    why: [
      "The noun the modifier describes is in the sentence, but the modifier sits next to the wrong word.",
      "修饰语所描述的名词在句子中，但修饰语放在了错误的词旁边。",
    ],
    not: [
      "A misplaced modifier sits beside the wrong word of the sentence; that is not the problem here.",
      "错位修饰语是放在了句中错误的词旁边，这里的问题不是这个。",
    ],
  },
  clear: {
    zh: "清楚",
    why: [
      "The modifier sits right beside the noun it describes, so the sentence is clear.",
      "修饰语紧挨着它所描述的名词，所以句子很清楚。",
    ],
    not: [
      "The modifier in this sentence does not attach to the right word, so the sentence is not clear.",
      "这个句子中的修饰语没有连到正确的词上，所以句子不清楚。",
    ],
  },
};

const dangling = topic("grammar", {
  id: "dangling-modifiers",
  title: ["Dangling Modifiers", "垂悬修饰语"],
  summary: [
    "An opening phrase must describe the subject right after it; when the right noun is missing, the modifier dangles.",
    "句首的短语必须描述紧跟其后的主语；如果缺了正确的名词，修饰语就是垂悬的。",
  ],
  after: ["misplaced-modifiers"],
  points: [
    label(
      "spotting-a-dangling-modifier",
      ["Spotting a Dangling Modifier", "找出垂悬修饰语"],
      [
        "A phrase at the start of a sentence describes the **subject** that comes right after the comma. *Walking into the chapel, the paintings amazed us* says the paintings were walking: the person who walked is missing, so the modifier **dangles**. A **misplaced** modifier is different: the right noun is in the sentence, but the modifier stands next to the wrong word (*She saw a statue walking to school*).",
        "句首的短语描述紧跟在逗号后面的**主语**。*Walking into the chapel, the paintings amazed us* 说的是画在走路：走路的人不见了，所以修饰语是**垂悬的**。**错位**修饰语不同：正确的名词在句中，但修饰语放在了错误的词旁边（*She saw a statue walking to school*）。",
      ],
      ["Is the modifier in this sentence dangling, misplaced or clear?", "这个句子中的修饰语是垂悬的、错位的，还是清楚的？"],
      `
        Walking into the chapel, the paintings amazed us.|dangling
        Walking into the chapel, we were amazed by the paintings.|clear
        We saw a fresco walking through the palace.|misplaced
        Painted in 1504, the statue stands in Florence.|dangling
        Carved in 1504, the statue stands in Florence.|clear
        Having studied for years, the painting was finally finished.|dangling
        Having studied for years, the apprentice finally finished the painting.|clear
        The artist sold a portrait to the duke covered in gold paint.|misplaced
        To become a master, years of training were needed.|dangling
        To become a master, an apprentice needed years of training.|clear
        Looking through the telescope, the moon seemed rough and full of craters.|dangling
        Looking through the telescope, Galileo saw that the moon was rough.|clear
        Galileo saw mountains on the moon looking through his telescope.|misplaced
        After reading the pamphlet, the idea seemed less strange.|dangling
        After reading the pamphlet, the merchant found the idea less strange.|clear
        Covered in dust, the workers carried the old manuscript.|dangling
        Covered in dust, the old manuscript was carried out by the workers.|clear
        Excited by the news, the printing press ran all night.|dangling
        Excited by the news, the printer ran his press all night.|clear
        The tourists photographed the dome climbing the stairs.|misplaced
        While mixing the plaster, the wall cracked.|dangling
        While mixing the plaster, the painter noticed a crack in the wall.|clear
        Born in a small village, Leonardo's talent was noticed early.|dangling
        Born in a small village, Leonardo showed his talent early.|clear
        The patron paid the sculptor riding a white horse.|misplaced
        Hoping for a commission, the young artist wrote to the pope.|clear
        Hoping for a commission, a letter was written to the pope.|dangling
        At the age of fourteen, his father sent him to a workshop.|dangling
        At the age of fourteen, he was sent by his father to a workshop.|clear
        She found an old map of Florence cleaning the attic.|misplaced
      `,
      danglingLabels,
    ),
    choose(
      "fixing-a-dangling-modifier",
      ["Fixing a Dangling Modifier", "改正垂悬修饰语"],
      [
        "Fix a dangling modifier by putting the person or thing it describes right after the comma: *Walking into the chapel, **we** were amazed by the paintings.* Or turn the phrase into a clause with its own subject: ***As we walked** into the chapel, the paintings amazed us.* Moving the phrase to the end of the same sentence does not fix it, because the right noun is still missing.",
        "改正垂悬修饰语的方法是把它所描述的人或物放在逗号后面：*Walking into the chapel, **we** were amazed by the paintings.* 或者把短语变成有自己主语的从句：***As we walked** into the chapel, the paintings amazed us.* 把短语移到同一句子的末尾并不能改正它，因为正确的名词仍然不在句中。",
      ],
      ["Which sentence fixes the dangling modifier?", "哪个句子改正了垂悬修饰语？"],
      `
        Walking into the chapel, the paintings amazed us.|Walking into the chapel, we were amazed by the paintings.|The paintings amazed us, walking into the chapel.|Walking into the chapel, the paintings were amazing to us.
        Having studied for years, the painting was finally finished.|Having studied for years, the apprentice finally finished the painting.|The painting was finally finished, having studied for years.|Having studied for years, the painting was finally finished by her.
        To become a master, years of training were needed.|To become a master, an apprentice needed years of training.|Years of training were needed to become a master.|To become a master, years of training were needed by many.
        Looking through the telescope, the moon seemed rough.|Looking through the telescope, Galileo saw that the moon was rough.|The moon seemed rough, looking through the telescope.|Looking through the telescope, the moon seemed rough to him.
        After reading the pamphlet, the idea seemed less strange.|After reading the pamphlet, the merchant found the idea less strange.|The idea seemed less strange after reading the pamphlet.|After reading the pamphlet, the idea seemed less strange to some.
        Excited by the news, the printing press ran all night.|Excited by the news, the printer ran his press all night.|The printing press ran all night, excited by the news.|Excited by the news, the printing press was run all night.
        While mixing the plaster, the wall cracked.|While the painter was mixing the plaster, the wall cracked.|The wall cracked while mixing the plaster.|While mixing the plaster, the wall suddenly cracked.
        Born in a small village, Leonardo's talent was noticed early.|Born in a small village, Leonardo showed his talent early.|Leonardo's talent was noticed early, born in a small village.|Born in a small village, Leonardo's great talent was noticed early.
        Hoping for a commission, a letter was written to the pope.|Hoping for a commission, the artist wrote a letter to the pope.|A letter was written to the pope, hoping for a commission.|Hoping for a commission, a long letter was written to the pope.
        At the age of fourteen, his father sent him to a workshop.|When he was fourteen, his father sent him to a workshop.|His father sent him to a workshop at the age of fourteen, as a boy.|At the age of fourteen, his own father sent him to a workshop.
        Tired after the long climb, the view from the dome was beautiful.|Tired after the long climb, we found the view from the dome beautiful.|The view from the dome was beautiful, tired after the long climb.|Tired after the long climb, the view from the dome was very beautiful.
        Running late for class, the bus left without me.|Running late for class, I missed the bus.|The bus left without me, running late for class.|Running late for class, the bus left without me again.
        Opening the old book, a pressed flower fell out.|When I opened the old book, a pressed flower fell out.|A pressed flower fell out, opening the old book.|Opening the old book, a dry pressed flower fell out.
        Using only a feather, the letters were painted in gold.|Using only a feather, the monk painted the letters in gold.|The letters were painted in gold, using only a feather.|Using only a feather, the gold letters were painted.
        After finishing the dome, the city held a festival.|After Brunelleschi finished the dome, the city held a festival.|The city held a festival, after finishing the dome.|After finishing the great dome, the city held a festival.
        Sketching every day, his drawing improved quickly.|Sketching every day, he improved his drawing quickly.|His drawing improved quickly, sketching every day.|Sketching every day, his drawing quickly improved.
        To print a book, many letters must be set by hand.|To print a book, a printer must set many letters by hand.|Many letters must be set by hand to print a book.|To print a book, many small letters must be set by hand.
        Climbing the scaffold, the ceiling seemed very close.|Climbing the scaffold, the painter came very close to the ceiling.|The ceiling seemed very close, climbing the scaffold.|Climbing the scaffold, the ceiling seemed close at last.
        Studying the stars, a new idea came to Copernicus.|Studying the stars, Copernicus came to a new idea.|A new idea came to Copernicus, studying the stars.|Studying the stars, a bold new idea came to Copernicus.
        Walking through the market, the smell of bread was everywhere.|Walking through the market, we smelled bread everywhere.|The smell of bread was everywhere, walking through the market.|Walking through the market, the smell of fresh bread was everywhere.
        Born in Poland, the sun was placed at the center by Copernicus.|Born in Poland, Copernicus placed the sun at the center.|The sun was placed at the center by Copernicus, born in Poland in his theory.|Born in Poland, the sun was placed at the center of his model.
        Arriving at the museum, the doors were closed.|When we arrived at the museum, the doors were closed.|The doors were closed, arriving at the museum.|Arriving at the museum, the big doors were closed.
        Practicing for hours, her lines were perfect by Friday.|Practicing for hours, she knew her lines perfectly by Friday.|Her lines were perfect by Friday, practicing for hours.|Practicing for hours, her lines were finally perfect by Friday.
        Frightened by the thunder, the bed was the dog's hiding place.|Frightened by the thunder, the dog hid under the bed.|The bed was the dog's hiding place, frightened by the thunder.|Frightened by the loud thunder, the bed was where the dog hid.
        Having lost the map, the road home was hard to find.|Having lost the map, the travelers could not find the road home.|The road home was hard to find, having lost the map.|Having lost the map, the road home was very hard to find.
        To win the prize, the painting had to be finished by May.|To win the prize, she had to finish the painting by May.|The painting had to be finished by May to win the prize.|To win the prize, the painting had to be finished early.
        Hurrying to the gate, my ticket fell out of my pocket.|Hurrying to the gate, I dropped my ticket.|My ticket fell out of my pocket, hurrying to the gate.|Hurrying to the gate, my ticket fell out.
        After eating lunch, the museum tour began.|After we ate lunch, the museum tour began.|The museum tour began, after eating lunch.|After eating a quick lunch, the museum tour began.
        Reading by candlelight, the scholar's eyes grew tired.|Reading by candlelight, the scholar felt his eyes grow tired.|The scholar's eyes grew tired, reading by candlelight.|Reading by candlelight, the old scholar's eyes grew tired.
        Lost in thought, the paintbrush slipped from her hand.|Lost in thought, she let the paintbrush slip from her hand.|The paintbrush slipped from her hand, lost in thought.|Lost in thought, the wet paintbrush slipped from her hand.
      `,
      (right) => [
        `*${right}* puts the person who does the action right after the opening phrase, so the modifier no longer dangles.`,
        `*${right}* 把做动作的人紧放在句首短语之后，修饰语就不再垂悬。`,
      ],
      [
        [
          "*{wrong}* only moves the phrase to the end; the person it describes is still missing, so it still dangles.",
          "*{wrong}* 只是把短语移到了句末；它所描述的人仍然不在句中，所以仍然是垂悬的。",
        ],
        [
          "*{wrong}* adds a word or two but keeps the wrong subject after the comma, so the modifier still dangles.",
          "*{wrong}* 加了一两个词，但逗号后面仍是错误的主语，所以修饰语仍然垂悬。",
        ],
      ],
    ),
  ],
});

const suffixSpelling = topic("grammar", {
  id: "spelling-words-with-suffixes",
  title: ["Spelling Words with Suffixes", "加后缀的拼写"],
  summary: [
    "A final silent e drops before a suffix that starts with a vowel, and a final y after a consonant becomes i.",
    "词尾不发音的 e 在以元音开头的后缀前去掉，辅音后的词尾 y 变成 i。",
  ],
  after: ["spelling-doubling-final-consonants"],
  points: [
    choose(
      "dropping-or-keeping-e",
      ["Dropping or Keeping a Final E", "去掉还是保留词尾的 e"],
      [
        "When a word ends in a **silent e**, drop the *e* before a suffix that begins with a vowel (*-ing*, *-able*, *-ous*, *-ion*): *hope*, *hoping*; *fame*, *famous*. Keep the *e* before a suffix that begins with a consonant (*-ment*, *-ful*, *-ly*, *-ness*): *hope*, *hopeful*; *safe*, *safely*. A few words break the rule to keep a soft *c* or *g*: *noticeable*, *courageous*.",
        "单词以**不发音的 e** 结尾时，在以元音开头的后缀（*-ing*、*-able*、*-ous*、*-ion*）前去掉 *e*：*hope*、*hoping*；*fame*、*famous*。在以辅音开头的后缀（*-ment*、*-ful*、*-ly*、*-ness*）前保留 *e*：*hope*、*hopeful*；*safe*、*safely*。少数词为了保留软音 *c* 或 *g* 而不遵守规则：*noticeable*、*courageous*。",
      ],
      ["How is the word with its suffix spelled?", "这个词加上后缀后怎样拼写？"],
      `
        hope + ing|hoping|hopeing|hopping
        hope + ful|hopeful|hopful|hoppful
        fame + ous|famous|fameous|famos
        safe + ly|safely|safly|safelly
        create + ive|creative|createive|creattive
        move + ment|movement|movment|movemant
        write + ing|writing|writeing|writting
        care + less|careless|carless|carreless
        use + able|usable|useable|usible
        state + ment|statement|statment|statemant
        believe + able|believable|believeable|believible
        excite + ment|excitement|excitment|excitemant
        dance + ing|dancing|danceing|dansing
        nice + ly|nicely|nicly|nicelly
        separate + ion|separation|separateion|seperation
        love + ly|lovely|lovly|lovelly
        imagine + ation|imagination|imagineation|imaginnation
        late + ness|lateness|latness|lateniss
        explore + er|explorer|exploreer|explorrer
        hate + ful|hateful|hatful|hatefull
        make + ing|making|makeing|makking
        amuse + ment|amusement|amusment|amusemant
        decorate + ion|decoration|decorateion|decorration
        complete + ly|completely|completly|completelly
        notice + able|noticeable|noticable|noticible
        courage + ous|courageous|couragous|courageus
        live + ing|living|liveing|livving
        manage + ment|management|managment|managemant
        sense + ible|sensible|senseible|sensable
        close + ness|closeness|closness|closenes
      `,
      (right, shown) => [
        `**${right}**: ${shown.split(" + ")[1]?.match(/^[aeiou]/) ? "the suffix begins with a vowel, so the silent e drops" : "the suffix begins with a consonant, so the silent e stays"}${["noticeable", "courageous"].includes(right) ? ", except that this word keeps its e for the soft sound" : ""}.`,
        `**${right}**：${shown.split(" + ")[1]?.match(/^[aeiou]/) ? "后缀以元音开头，所以不发音的 e 去掉" : "后缀以辅音开头，所以不发音的 e 保留"}${["noticeable", "courageous"].includes(right) ? "，但这个词为了保留软音而保留 e" : ""}。`,
      ],
      [
        [
          "*{wrong}* keeps or drops the final e against the rule for this suffix.",
          "*{wrong}* 违反了这个后缀的规则，错误地保留或去掉了词尾的 e。",
        ],
        ["*{wrong}* doubles or changes a letter that should stay as it is.", "*{wrong}* 把本应保持不变的字母双写或改变了。"],
      ],
    ),
    choose(
      "changing-y-to-i",
      ["Changing Y to I", "把 y 变成 i"],
      [
        "When a word ends in a **consonant + y**, change the *y* to *i* before most suffixes: *happy*, *happiness*; *carry*, *carried*; *beauty*, *beautiful*. Keep the *y* before *-ing*, so that two i's do not meet: *carrying*, *studying*. When a **vowel + y** ends the word, keep the *y*: *play*, *played*; *enjoy*, *enjoyment*.",
        "单词以**辅音 + y** 结尾时，在大多数后缀前把 *y* 变成 *i*：*happy*、*happiness*；*carry*、*carried*；*beauty*、*beautiful*。在 *-ing* 前保留 *y*，以免两个 i 连在一起：*carrying*、*studying*。单词以**元音 + y** 结尾时，保留 *y*：*play*、*played*；*enjoy*、*enjoyment*。",
      ],
      ["How is the word with its suffix spelled?", "这个词加上后缀后怎样拼写？"],
      `
        happy + ness|happiness|happyness|happieness
        carry + ed|carried|carryed|caried
        carry + ing|carrying|carriing|caring
        beauty + ful|beautiful|beautyful|beautifull
        play + ed|played|plaied|playd
        enjoy + ment|enjoyment|enjoiment|enjoyement
        study + ing|studying|studiing|studing
        study + ed|studied|studyed|studid
        busy + ly|busily|busyly|busilly
        pity + ful|pitiful|pityful|pitifull
        delay + ed|delayed|delaied|delayd
        easy + er|easier|easyer|easeir
        lonely + ness|loneliness|lonelyness|lonelness
        hurry + ing|hurrying|hurriing|huring
        hurry + ed|hurried|hurryed|huried
        employ + er|employer|emploier|employeer
        mercy + ful|merciful|mercyful|mercifull
        heavy + est|heaviest|heavyest|heavist
        destroy + ed|destroyed|destroied|destroyd
        duty + ful|dutiful|dutyful|dutifull
        reply + ed|replied|replyed|replid
        reply + ing|replying|repliing|repling
        lazy + ness|laziness|lazyness|lazeness
        annoy + ance|annoyance|annoiance|annoyence
        angry + ly|angrily|angryly|angrilly
        defy + ance|defiance|defyance|defience
        pay + ment|payment|paiment|payement
        ready + ness|readiness|readyness|readness
        worry + ed|worried|worryed|woried
        apply + cation|application|applycation|aplication
      `,
      (right, shown) => [
        `**${right}**: ${/[aeiou]y \+/.test(shown) ? "a vowel comes before the y, so the y stays" : shown.endsWith("+ ing") ? "the y stays before -ing, so that two i's do not meet" : "a consonant comes before the y, so the y becomes i before the suffix"}.`,
        `**${right}**：${/[aeiou]y \+/.test(shown) ? "y 前面是元音，所以 y 保留" : shown.endsWith("+ ing") ? "在 -ing 前 y 保留，以免两个 i 连在一起" : "y 前面是辅音，所以加后缀时 y 变成 i"}。`,
      ],
      [
        [
          "*{wrong}* keeps or changes the y against the rule for the letter before it.",
          "*{wrong}* 违反了看 y 前面字母的规则，错误地保留或改变了 y。",
        ],
        ["*{wrong}* drops, doubles or adds a letter that the word does not have.", "*{wrong}* 去掉、双写或加上了这个词本来没有的字母。"],
      ],
    ),
  ],
});

const pairs = topic("grammar", {
  id: "pronouns-in-compound-subjects-and-objects",
  title: ["Pronouns in Pairs", "并列结构中的代词"],
  summary: [
    "In a pair such as Amara and I or Amara and me, the pronoun takes the case it would take alone.",
    "在 Amara and I 或 Amara and me 这样的并列结构中，代词用它单独使用时的格。",
  ],
  after: ["pronoun-case"],
  points: [
    choose(
      "pronouns-as-subjects-and-objects",
      ["Pronouns Paired with a Noun", "与名词并列的代词"],
      [
        "When a pronoun is joined to a noun with *and* or *or*, cover the noun and try the pronoun alone. *Amara and ___ visited Timbuktu*: *I visited*, so **Amara and I**. *The guide showed Amara and ___ the library*: *showed me*, so **Amara and me**. Use *myself* only when *I* is already the subject: *I taught myself*.",
        "当代词与名词用 *and* 或 *or* 连在一起时，遮住名词，单独试一试代词。*Amara and ___ visited Timbuktu*：*I visited*，所以用 **Amara and I**。*The guide showed Amara and ___ the library*：*showed me*，所以用 **Amara and me**。只有当 *I* 已经是主语时才用 *myself*：*I taught myself*。",
      ],
      ["Which pronoun completes the sentence?", "哪个代词能补全句子？"],
      `
        Amara and ___ visited the old mosque.|I|me|myself
        The guide showed Amara and ___ the library.|me|I|myself
        My cousin and ___ read about Mansa Musa.|I|me|myself
        The teacher gave Kofi and ___ a map of Mali.|me|I|myself
        ___ and her brother learned to play the kora.|She|Her|Herself
        The griot sang for the children and ___.|us|we|ourselves
        ___ and the other traders crossed the desert.|He|Him|Himself
        The scholar thanked Musa and ___ for the books.|him|he|himself
        Ama and ___ wrote a report on Timbuktu.|I|me|myself
        Mr. Diallo asked Ama and ___ to read aloud.|me|I|myself
        ___ and their parents went to the market.|They|Them|Themselves
        The merchant sold the salt to Ali and ___.|them|they|themselves
        You and ___ can finish the poster together.|I|me|myself
        The prize went to my partner and ___.|me|I|myself
        ___ and Fatou were chosen to lead the tour.|We|Us|Ourselves
        Grandma told Fatou and ___ a story about Sundiata.|us|we|ourselves
        Either Musa or ___ will carry the drum.|he|him|himself
        The class voted for either Musa or ___.|him|he|himself
        My sister and ___ built a model of the mosque.|I|me|myself
        The museum gave my sister and ___ free tickets.|me|I|myself
        ___ and the scholars studied the stars.|She|Her|Herself
        The camel followed the boy and ___.|her|she|herself
        Neither Kwame nor ___ had seen a real salt slab.|I|me|myself
        The guide warned Kwame and ___ about the heat.|me|I|myself
        ___ and their teacher visited the archive.|They|Them|Themselves
        The archive was opened for the students and ___.|them|they|themselves
        You and ___ should practice the speech.|she|her|herself
        The judges praised you and ___.|her|she|herself
        Our class and ___ took the same bus.|they|them|themselves
        The driver waited for our class and ___.|them|they|themselves
      `,
      (right) => [
        `**${right}** is the form the pronoun takes alone in this place, so it is the right form in the pair as well.`,
        `**${right}** 是这个代词单独用在这个位置时的形式，所以在并列结构中也用它。`,
      ],
      [
        [
          "*{wrong}* is the wrong case: cover the other person and try *{wrong}* alone, and the sentence no longer works.",
          "*{wrong}* 的格不对：遮住另一个人，单独试一试 *{wrong}*，句子就不通了。",
        ],
        [
          "*{wrong}* is a reflexive pronoun, which is used only when the same person is already the subject of the sentence.",
          "*{wrong}* 是反身代词，只有当同一个人已经是句子的主语时才用。",
        ],
      ],
    ),
    choose(
      "pronouns-after-prepositions",
      ["Pronouns after Prepositions", "介词后的代词"],
      [
        "A pronoun after a preposition such as *between*, *for*, *with*, *to* or *except* is an **object**, so it takes the object form, even in a pair: *between you and **me***, *for her and **him***, *with Ama and **us***. *Between you and I* is a common mistake; try the pronoun alone: *between me*.",
        "*between*、*for*、*with*、*to* 或 *except* 这样的介词后面的代词是**宾语**，所以要用宾格形式，即使在并列结构中也是如此：*between you and **me***、*for her and **him***、*with Ama and **us***。*between you and I* 是常见的错误；单独试一试代词：*between me*。",
      ],
      ["Which pronoun completes the sentence?", "哪个代词能补全句子？"],
      `
        Keep this secret between you and ___.|me|I|myself
        The gift is for Ama and ___.|him|he|himself
        Everyone came except Musa and ___.|her|she|herself
        Come to the market with my brother and ___.|me|I|myself
        The teacher divided the books between Kofi and ___.|me|I|myself
        This letter is addressed to you and ___.|him|he|himself
        Sit beside Fatou and ___.|us|we|ourselves
        The guide walked ahead of the scholars and ___.|them|they|themselves
        There is no difference between you and ___.|her|she|herself
        The story was told to the children and ___.|us|we|ourselves
        The map was drawn by Ali and ___.|me|I|myself
        I bought a drink for Ama and ___.|her|she|herself
        No one but you and ___ knows the answer.|me|I|myself
        The traders shared the water with the guides and ___.|them|they|themselves
        Stand between Kwame and ___ in the photo.|me|I|myself
        The camel walked behind the merchant and ___.|him|he|himself
        The prize was split among Ama, Kofi and ___.|me|I|myself
        The teacher was proud of you and ___.|me|I|myself
        Send the photos to Fatou and ___.|us|we|ourselves
        The decision is up to you and ___.|them|they|themselves
        Without you and ___, the play would fail.|her|she|herself
        The rules apply to the captain and ___.|him|he|himself
        This argument is between my sister and ___.|me|I|myself
        We saved seats for the guests and ___.|them|they|themselves
        Everyone laughed except Musa and ___.|me|I|myself
        The coach talked to my partner and ___.|me|I|myself
        The books were given to the scholars and ___.|us|we|ourselves
        A letter came for you and ___.|her|she|herself
        The driver waited for Ali and ___.|him|he|himself
        The story is about the king and ___.|her|she|herself
      `,
      (right) => [
        `**${right}** is the object form, which a pronoun takes after a preposition, even when it is one of a pair.`,
        `**${right}** 是宾格形式，介词后面的代词要用宾格，即使它在并列结构中。`,
      ],
      [
        [
          "*{wrong}* is the subject form, but after a preposition the pronoun is an object; try it alone after the preposition.",
          "*{wrong}* 是主格形式，但介词后面的代词是宾语；单独把它放在介词后面试一试。",
        ],
        [
          "*{wrong}* is reflexive, used only when the same person is the subject, which is not so here.",
          "*{wrong}* 是反身代词，只有当同一个人是主语时才用，而这里不是。",
        ],
      ],
    ),
  ],
});

const clauseLabels: Readonly<Record<string, Label>> = {
  "adjective clause": {
    zh: "形容词从句",
    why: [
      "It describes a noun and tells which one or what kind, usually beginning with *who*, *which*, *that* or *whose*.",
      "它描述一个名词，说明是哪一个或哪一种，通常以 *who*、*which*、*that* 或 *whose* 开头。",
    ],
    not: ["An adjective clause describes a noun, and this clause does not describe one.", "形容词从句描述名词，而这个从句并不描述名词。"],
  },
  "adverb clause": {
    zh: "副词从句",
    why: [
      "It tells when, why, where or under what condition the main action happens, beginning with a word such as *when*, *because* or *if*.",
      "它说明主要动作在何时、为何、何地或在什么条件下发生，以 *when*、*because* 或 *if* 这样的词开头。",
    ],
    not: [
      "An adverb clause tells when, why or under what condition, and this clause does not do that.",
      "副词从句说明时间、原因或条件，而这个从句不是这样。",
    ],
  },
  "noun clause": {
    zh: "名词从句",
    why: [
      "It does the job of a noun, as the subject or object of the sentence, often beginning with *what*, *that* or *how*.",
      "它起名词的作用，作句子的主语或宾语，常以 *what*、*that* 或 *how* 开头。",
    ],
    not: ["A noun clause works as a subject or object, and this clause does not.", "名词从句作主语或宾语，而这个从句不是。"],
  },
};

const adverbJobs: Readonly<Record<string, Label>> = {
  time: {
    zh: "时间",
    why: [
      "The clause tells **when** the main action happens, with a word such as *when*, *after*, *before* or *until*.",
      "这个从句说明主要动作**何时**发生，用 *when*、*after*、*before* 或 *until* 这样的词。",
    ],
    not: ["This clause does not tell when the action happens.", "这个从句并不说明动作何时发生。"],
  },
  reason: {
    zh: "原因",
    why: [
      "The clause tells **why** the main action happens, with a word such as *because*, *since* or *as*.",
      "这个从句说明主要动作**为什么**发生，用 *because*、*since* 或 *as* 这样的词。",
    ],
    not: ["This clause does not give a reason for the action.", "这个从句并不给出动作的原因。"],
  },
  condition: {
    zh: "条件",
    why: [
      "The clause tells **under what condition** the main action happens, with *if*, *unless* or *as long as*.",
      "这个从句说明主要动作**在什么条件下**发生，用 *if*、*unless* 或 *as long as*。",
    ],
    not: ["This clause does not set a condition for the action.", "这个从句并不为动作设定条件。"],
  },
  contrast: {
    zh: "对比",
    why: [
      "The clause sets up something **in contrast** to the main idea, with *although*, *though* or *even though*.",
      "这个从句提出与主要意思**相对比**的内容，用 *although*、*though* 或 *even though*。",
    ],
    not: ["This clause does not set up a contrast with the main idea.", "这个从句并不提出与主要意思相对比的内容。"],
  },
};

const clauses = topic("grammar", {
  id: "adjective-and-adverb-clauses",
  title: ["Adjective and Adverb Clauses", "形容词从句与副词从句"],
  summary: [
    "A dependent clause can describe a noun, as an adjective does, or tell when, why or under what condition, as an adverb does.",
    "从属从句可以像形容词一样描述名词，也可以像副词一样说明时间、原因或条件。",
  ],
  after: ["relative-clauses"],
  points: [
    label(
      "naming-the-clause",
      ["Naming the Clause", "辨认从句"],
      [
        "A dependent clause does one of three jobs. An **adjective clause** describes a noun: *the scholar **who copied the book***. An **adverb clause** tells when, why, where or under what condition: ***when the caravan arrived***, *the market filled*. A **noun clause** works as a noun, as the subject or the object: *No one knew **what the letter said***.",
        "从属从句起三种作用之一。**形容词从句**描述名词：*the scholar **who copied the book***。**副词从句**说明时间、原因、地点或条件：***when the caravan arrived***, *the market filled*。**名词从句**起名词的作用，作主语或宾语：*No one knew **what the letter said***。",
      ],
      ["What kind of clause is in italics?", "斜体部分是哪种从句？"],
      `
        The scholar *who copied the book* lived in Timbuktu.|adjective clause
        *When the caravan arrived*, the market filled with people.|adverb clause
        No one knew *what the letter said*.|noun clause
        The salt *that the traders carried* came from the north.|adjective clause
        The city grew rich *because it controlled the gold trade*.|adverb clause
        *What Mansa Musa gave away* made prices fall in Cairo.|noun clause
        Mali was an empire *whose rulers were very rich*.|adjective clause
        *If the wells were dry*, the caravan turned back.|adverb clause
        Historians believe *that the mosque was built in 1327*.|noun clause
        The griot *who sang the story* was very old.|adjective clause
        *Although the desert was dangerous*, traders crossed it every year.|adverb clause
        The scholars asked *how the planets moved*.|noun clause
        The manuscripts, *which were kept in wooden chests*, survived for centuries.|adjective clause
        The travelers rested *until the heat of the day had passed*.|adverb clause
        *Whoever controlled the river* controlled the trade.|noun clause
        Timbuktu is the city *where the great library stood*.|adjective clause
        *Since gold was plentiful*, the emperor gave much of it away.|adverb clause
        We learned *why salt was so valuable*.|noun clause
        The camels *that led the caravan* wore bells.|adjective clause
        *Before the sun rose*, the caravan was already moving.|adverb clause
        The guide explained *what each sign meant*.|noun clause
        The king *whom the people loved* ruled for twenty years.|adjective clause
        Farmers planted crops *after the rains came*.|adverb clause
        *That the empire was rich* is clear from the records.|noun clause
        The river *that floods each year* made the soil rich.|adjective clause
        *Unless a guide led them*, travelers could get lost.|adverb clause
        The visitors wondered *where the gold came from*.|noun clause
        Musa built a mosque *that still stands today*.|adjective clause
        *As the empire grew*, more scholars arrived.|adverb clause
        The teacher asked *who had read the chapter*.|noun clause
      `,
      clauseLabels,
    ),
    label(
      "what-an-adverb-clause-tells",
      ["What an Adverb Clause Tells", "副词从句说明什么"],
      [
        "The first word of an **adverb clause** tells you its job. *When*, *after*, *before*, *while* and *until* tell **time**. *Because*, *since* and *as* (meaning because) give a **reason**. *If*, *unless* and *as long as* set a **condition**. *Although*, *though* and *even though* set up a **contrast**.",
        "**副词从句**的第一个词说明它的作用。*when*、*after*、*before*、*while* 和 *until* 说明**时间**。*because*、*since* 和 *as*（意为因为）给出**原因**。*if*、*unless* 和 *as long as* 设定**条件**。*although*、*though* 和 *even though* 提出**对比**。",
      ],
      ["What does the clause in italics tell?", "斜体的从句说明什么？"],
      `
        *When the rains ended*, the traders set out.|time
        The traders set out *because the rains had ended*.|reason
        The traders will set out *if the rains end soon*.|condition
        *Although the rains had ended*, the traders waited.|contrast
        *After the prayers were over*, the scholars began to teach.|time
        The library grew *because families collected books*.|reason
        *Unless the wells have water*, no caravan can cross.|condition
        *Even though the journey was long*, Musa reached Mecca.|contrast
        The camels drank *before they entered the desert*.|time
        *Since salt kept food from spoiling*, people paid well for it.|reason
        You may borrow the book *as long as you return it*.|condition
        *Though Timbuktu was small*, its scholars were famous.|contrast
        The market stayed open *until the sun went down*.|time
        *As the gold mines were secret*, few traders knew their place.|reason
        *If the emperor agreed*, the city would build a school.|condition
        *Although gold was plentiful*, salt was harder to find.|contrast
        *While the griot sang*, the children listened quietly.|time
        The prices in Cairo fell *because Musa gave away so much gold*.|reason
        The traders would not sell *unless the price was fair*.|condition
        *Even though the manuscripts were old*, the ink was still dark.|contrast
        *Before he left for Mecca*, Musa chose a ruler to govern.|time
        The city was safe *since the army guarded the river*.|reason
        *If you visit Djenné*, you can see the mud mosque.|condition
        *Though the walls are made of mud*, the mosque has stood for a century.|contrast
        The scholars copied the books *after the originals grew worn*.|time
        *Because the river flooded*, the fields were rich.|reason
        The guide will lead us *as long as we follow his rules*.|condition
        *Although the empire fell*, its books survived.|contrast
        *Until the new road was built*, the trip took a month.|time
        *As it was too hot to travel*, the caravan rested at noon.|reason
      `,
      adverbJobs,
    ),
  ],
});

const interrupters = topic("grammar", {
  id: "commas-with-interrupters",
  title: ["Commas with Interrupters", "插入语的逗号"],
  summary: [
    "Words that interrupt a sentence, such as however, of course, names of people spoken to and yes or no, are set off by commas.",
    "打断句子的词，如 however、of course、直接称呼的人名以及 yes 或 no，要用逗号隔开。",
  ],
  after: ["commas-with-nonessential-elements"],
  points: [
    choose(
      "commas-around-interrupters",
      ["Commas around Interrupters", "插入语两边的逗号"],
      [
        "An **interrupter** is a word or phrase that breaks into a sentence to comment on it: *however*, *of course*, *for example*, *in fact*, *I think*, *by the way*. Set it off with commas: a comma **before and after** it in the middle of a sentence, one comma after it at the start, one before it at the end. *The storm, however, missed the city.*",
        "**插入语**是插进句子里对句子加以评论的词或短语：*however*、*of course*、*for example*、*in fact*、*I think*、*by the way*。用逗号把它隔开：在句子中间时**前后**各一个逗号，在句首时后面一个逗号，在句末时前面一个逗号。*The storm, however, missed the city.*",
      ],
      ["Which sentence is punctuated correctly?", "哪个句子的标点正确？"],
      `
        the vaccine however was not ready|The vaccine, however, was not ready.|The vaccine, however was not ready.|The vaccine however, was not ready.|The vaccine, however, was not, ready.
        the doctor of course washed her hands|The doctor, of course, washed her hands.|The doctor, of course washed her hands.|The doctor of course, washed her hands.|The doctor, of course, washed her, hands.
        smallpox in fact has been ended|Smallpox, in fact, has been ended.|Smallpox, in fact has been ended.|Smallpox in fact, has been ended.|Smallpox, in fact, has been, ended.
        many diseases for example spread through water|Many diseases, for example, spread through water.|Many diseases, for example spread through water.|Many diseases for example, spread through water.|Many diseases, for example, spread through, water.
        the clinic I think opens at nine|The clinic, I think, opens at nine.|The clinic, I think opens at nine.|The clinic I think, opens at nine.|The clinic, I think, opens at, nine.
        the fever by the way is going down|The fever, by the way, is going down.|The fever, by the way is going down.|The fever by the way, is going down.|The fever, by the way, is going, down.
        however the germ was hard to see|However, the germ was hard to see.|However the germ, was hard to see.|However the germ was, hard to see.|However, the germ was hard to, see.
        of course you should rest|Of course, you should rest.|Of course you, should rest.|Of, course you should rest.|Of course, you should, rest.
        in fact the cure was simple|In fact, the cure was simple.|In fact the cure, was simple.|In, fact the cure was simple.|In fact, the cure was, simple.
        the town was spared fortunately|The town was spared, fortunately.|The town, was spared fortunately.|The town was, spared fortunately.|The town was spared,, fortunately.
        hand washing on the other hand is free|Hand washing, on the other hand, is free.|Hand washing, on the other hand is free.|Hand washing on the other hand, is free.|Hand washing, on the other hand, is, free.
        the result as you can see was clear|The result, as you can see, was clear.|The result, as you can see was clear.|The result as you can see, was clear.|The result, as you can see, was, clear.
        Jenner's idea surprisingly worked|Jenner's idea, surprisingly, worked.|Jenner's idea, surprisingly worked.|Jenner's idea surprisingly, worked.|Jenner's idea, surprisingly,, worked.
        the outbreak therefore ended quickly|The outbreak, therefore, ended quickly.|The outbreak, therefore ended quickly.|The outbreak therefore, ended quickly.|The outbreak, therefore, ended, quickly.
        the nurse in my opinion deserves a prize|The nurse, in my opinion, deserves a prize.|The nurse, in my opinion deserves a prize.|The nurse in my opinion, deserves a prize.|The nurse, in my opinion, deserves a, prize.
        for example cholera spreads in dirty water|For example, cholera spreads in dirty water.|For example cholera, spreads in dirty water.|For, example cholera spreads in dirty water.|For example, cholera spreads in dirty, water.
        the pump was the cause after all|The pump was the cause, after all.|The pump, was the cause after all.|The pump was, the cause after all.|The pump was the cause, after, all.
        the patients meanwhile waited outside|The patients, meanwhile, waited outside.|The patients, meanwhile waited outside.|The patients meanwhile, waited outside.|The patients, meanwhile, waited, outside.
        the germ theory at first seemed strange|The germ theory, at first, seemed strange.|The germ theory, at first seemed strange.|The germ theory at first, seemed strange.|The germ theory, at first, seemed, strange.
        honestly I hate getting shots|Honestly, I hate getting shots.|Honestly I hate, getting shots.|Honestly I, hate getting shots.|Honestly, I hate getting, shots.
        the doctors to be sure were tired|The doctors, to be sure, were tired.|The doctors, to be sure were tired.|The doctors to be sure, were tired.|The doctors, to be sure, were, tired.
        the medicine as a result was cheaper|The medicine, as a result, was cheaper.|The medicine, as a result was cheaper.|The medicine as a result, was cheaper.|The medicine, as a result, was, cheaper.
        the city nevertheless built new sewers|The city, nevertheless, built new sewers.|The city, nevertheless built new sewers.|The city nevertheless, built new sewers.|The city, nevertheless, built new, sewers.
        the shot it seems did not hurt|The shot, it seems, did not hurt.|The shot, it seems did not hurt.|The shot it seems, did not hurt.|The shot, it seems, did not, hurt.
        Lister's spray for instance killed germs|Lister's spray, for instance, killed germs.|Lister's spray, for instance killed germs.|Lister's spray for instance, killed germs.|Lister's spray, for instance, killed, germs.
        the experiment unfortunately failed|The experiment, unfortunately, failed.|The experiment, unfortunately failed.|The experiment unfortunately, failed.|The experiment, unfortunately,, failed.
        you should wear a mask by the way|You should wear a mask, by the way.|You should wear, a mask by the way.|You should, wear a mask by the way.|You should wear a mask, by the, way.
        clean water in short saves lives|Clean water, in short, saves lives.|Clean water, in short saves lives.|Clean water in short, saves lives.|Clean water, in short, saves, lives.
        the cough I believe is getting better|The cough, I believe, is getting better.|The cough, I believe is getting better.|The cough I believe, is getting better.|The cough, I believe, is getting, better.
        indeed the plan worked|Indeed, the plan worked.|Indeed the plan, worked.|Indeed the, plan worked.|Indeed, the plan, worked.
      `,
      (right) => [
        `*${right}* sets the interrupter off with commas wherever it breaks into the sentence, before and after it in the middle.`,
        `*${right}* 在插入语打断句子的地方用逗号把它隔开，在句子中间时前后都有逗号。`,
      ],
      [
        [
          "*{wrong}* leaves out one of the commas, so the interrupter is not fully set off.",
          "*{wrong}* 漏掉了一个逗号，插入语没有被完全隔开。",
        ],
        [
          "*{wrong}* puts a comma in the wrong place, splitting the sentence where nothing interrupts it.",
          "*{wrong}* 把逗号放错了地方，在没有插入语的地方把句子断开了。",
        ],
        [
          "*{wrong}* sets the interrupter off but adds one comma too many, cutting the sentence where nothing breaks into it.",
          "*{wrong}* 隔开了插入语，却多加了一个逗号，在没有插入语的地方把句子断开了。",
        ],
      ],
    ),
    choose(
      "commas-with-names-and-yes-or-no",
      ["Commas with Names and Yes or No", "称呼语和 yes、no 的逗号"],
      [
        "Commas also set off the **name of the person spoken to** (*Doctor, is it serious?* *Thank you, Maria.* *I think, Sam, that you are right.*) and words such as **yes**, **no** and **well** at the start of an answer (*Yes, I had the shot.* *Well, it hurt a little.*). Without the comma, *Let's eat, Grandma* turns into *Let's eat Grandma*.",
        "逗号还用来隔开**直接称呼的人名**（*Doctor, is it serious?* *Thank you, Maria.* *I think, Sam, that you are right.*）以及回答开头的 **yes**、**no** 和 **well** 等词（*Yes, I had the shot.* *Well, it hurt a little.*）。没有逗号的话，*Let's eat, Grandma* 就成了 *Let's eat Grandma*。",
      ],
      ["Which sentence is punctuated correctly?", "哪个句子的标点正确？"],
      `
        doctor is it serious|Doctor, is it serious?|Doctor is it, serious?|Doctor is it serious?
        thank you Maria|Thank you, Maria.|Thank, you Maria.|Thank you Maria.
        yes I had the shot|Yes, I had the shot.|Yes I, had the shot.|Yes I had the shot.
        no the clinic is closed|No, the clinic is closed.|No the clinic, is closed.|No the clinic is closed.
        well it hurt a little|Well, it hurt a little.|Well it, hurt a little.|Well it hurt a little.
        I think Sam that you are right|I think, Sam, that you are right.|I think, Sam that you are right.|I think Sam, that you are right.
        nurse can you help me|Nurse, can you help me?|Nurse can you, help me?|Nurse can you help me?
        please sit down Mr. Ito|Please sit down, Mr. Ito.|Please, sit down Mr. Ito.|Please sit down Mr. Ito.
        yes the fever is gone|Yes, the fever is gone.|Yes the fever, is gone.|Yes the fever is gone.
        Lena did you wash your hands|Lena, did you wash your hands?|Lena did you, wash your hands?|Lena did you wash your hands?
        no thank you|No, thank you.|No thank, you.|No thank you.
        well that is good news|Well, that is good news.|Well that, is good news.|Well that is good news.
        listen class this is important|Listen, class, this is important.|Listen, class this is important.|Listen class, this is important.
        are you feeling better Grandpa|Are you feeling better, Grandpa?|Are you, feeling better Grandpa?|Are you feeling better Grandpa?
        yes Doctor I will take the medicine|Yes, Doctor, I will take the medicine.|Yes, Doctor I will take the medicine.|Yes Doctor, I will take the medicine.
        no Ben the pills are not candy|No, Ben, the pills are not candy.|No, Ben the pills are not candy.|No Ben, the pills are not candy.
        well I suppose you are right|Well, I suppose you are right.|Well I suppose, you are right.|Well I suppose you are right.
        come in Ms. Lopez|Come in, Ms. Lopez.|Come, in Ms. Lopez.|Come in Ms. Lopez.
        Dad where is the first aid kit|Dad, where is the first aid kit?|Dad where is, the first aid kit?|Dad where is the first aid kit?
        your test results Mrs. Kim are normal|Your test results, Mrs. Kim, are normal.|Your test results, Mrs. Kim are normal.|Your test results Mrs. Kim, are normal.
        yes the vaccine is safe|Yes, the vaccine is safe.|Yes the vaccine, is safe.|Yes the vaccine is safe.
        no I do not have a cough|No, I do not have a cough.|No I do, not have a cough.|No I do not have a cough.
        good morning everyone|Good morning, everyone.|Good, morning everyone.|Good morning everyone.
        well the shot is over now|Well, the shot is over now.|Well the shot, is over now.|Well the shot is over now.
        tell me Ana how do you feel|Tell me, Ana, how do you feel?|Tell me, Ana how do you feel?|Tell me Ana, how do you feel?
        thanks Coach|Thanks, Coach.|Thanks Coach.|Thanks, Coach,.
        yes Ms. Patel I finished the report|Yes, Ms. Patel, I finished the report.|Yes, Ms. Patel I finished the report.|Yes Ms. Patel, I finished the report.
        sir your ticket please|Sir, your ticket, please.|Sir your ticket, please.|Sir, your ticket please.
        no I have never had measles|No, I have never had measles.|No I have never, had measles.|No I have never had measles.
        let's eat Grandma|Let's eat, Grandma.|Let's, eat Grandma.|Let's eat Grandma.
      `,
      (right) => [
        `*${right}* sets off the name of the person spoken to, or the opening yes, no or well, with commas.`,
        `*${right}* 用逗号隔开了直接称呼的人名或开头的 yes、no、well。`,
      ],
      [
        ["*{wrong}* misses a comma or puts one where nothing should be set off.", "*{wrong}* 漏了逗号，或在不该隔开的地方放了逗号。"],
        [
          "*{wrong}* leaves the name or the opening word without the commas that set it off.",
          "*{wrong}* 没有用逗号把称呼语或开头的词隔开。",
        ],
      ],
    ),
  ],
});

const tricky = topic("grammar", {
  id: "agreement-with-tricky-subjects",
  title: ["Agreement with Tricky Subjects", "棘手主语的主谓一致"],
  summary: [
    "Some subjects look plural but take a singular verb, such as news and mathematics; others, such as scissors, are always plural; a group or an amount is usually singular.",
    "有些主语看起来是复数却用单数动词，如 news 和 mathematics；有些如 scissors 总是复数；集体或数量通常是单数。",
  ],
  after: ["subject-verb-agreement-with-phrases-between"],
  points: [
    choose(
      "subjects-that-look-plural",
      ["Subjects That Look Plural", "看起来是复数的主语"],
      [
        "Some nouns end in *-s* but name **one** thing or subject, so they take a singular verb: *news*, *mathematics*, *physics*, *measles*, *economics*, *the United States*. Others name one object but are **always plural**, because the object has two parts: *scissors*, *jeans*, *glasses*, *pants*. Ask whether the word names one thing or a pair.",
        "有些名词以 *-s* 结尾，却指**一个**事物或学科，所以用单数动词：*news*、*mathematics*、*physics*、*measles*、*economics*、*the United States*。另一些名词指一件东西，却**总是复数**，因为这件东西由两部分组成：*scissors*、*jeans*、*glasses*、*pants*。要问这个词指的是一个事物还是一对东西。",
      ],
      ["Which verb completes the sentence?", "哪个动词能补全句子？"],
      `
        The news ___ good today.|is|are|were
        Mathematics ___ my favorite subject this year.|is|are|were
        Measles ___ a very contagious disease.|is|are|were
        My scissors ___ on the desk right now.|are|is|was
        These jeans ___ too long for me now.|are|is|was
        Physics ___ the study of matter and energy.|is|are|were
        The United States ___ fifty states today.|has|have|had
        My glasses ___ in my bag at the moment.|are|is|was
        Economics ___ about how people use money.|is|are|were
        Her pants ___ covered in paint now.|are|is|was
        The evening news ___ at six every day.|starts|start|started
        Gymnastics ___ a hard sport to learn.|is|are|were
        The tongs ___ hanging by the grill now.|are|is|was
        Civics ___ taught in the eighth grade at our school.|is|are|were
        The pliers ___ in the red toolbox today.|are|is|was
        Mumps ___ rare in this country now.|is|are|were
        The shorts I bought ___ too big.|are|is|was
        Statistics ___ a branch of mathematics.|is|are|were
        My binoculars ___ broken today.|are|is|was
        The Philippines ___ more than seven thousand islands.|has|have|had
        This news ___ hard to believe.|is|are|were
        Athletics ___ popular at our school this term.|is|are|were
        Your sunglasses ___ on your head right now.|are|is|was
        Politics ___ often a topic at dinner these days.|is|are|were
        The tweezers ___ in the first aid kit now.|are|is|was
        Linguistics ___ the study of language.|is|are|were
        My pajamas ___ in the dryer now.|are|is|was
        The Netherlands ___ famous for its tulips.|is|are|were
        Electronics ___ a fast-changing field today.|is|are|were
        These trousers ___ too tight now.|are|is|was
      `,
      (right) => [
        `**${right}** agrees with the subject: ask whether it names one thing or a pair, and use the verb that matches.`,
        `**${right}** 与主语一致：问一问它指的是一个事物还是一对东西，再用相配的动词。`,
      ],
      [
        [
          "*{wrong}* does not agree: the subject looks one way but names the other, so it takes **{right}**.",
          "*{wrong}* 不一致：这个主语看起来是一种情况，实际指的却是另一种，所以用 **{right}**。",
        ],
        ["*{wrong}* is in the past, but the sentence speaks of now.", "*{wrong}* 是过去时，而句子说的是现在。"],
      ],
    ),
    choose(
      "groups-and-amounts",
      ["Groups and Amounts", "集体与数量"],
      [
        "A **collective noun** such as *team*, *class*, *family*, *jury* or *committee* names one group, so in American English it usually takes a **singular** verb: *The team is ready.* An **amount** of money, time or distance treated as one sum is singular too: *Ten dollars is too much. Three hours is a long wait.* But *a number of* means many and is plural: *A number of students are sick.*",
        "**集体名词**如 *team*、*class*、*family*、*jury* 或 *committee* 指一个群体，所以在美国英语中通常用**单数**动词：*The team is ready.* 被当作一个总数的钱、时间或距离也是单数：*Ten dollars is too much. Three hours is a long wait.* 但 *a number of* 表示许多，是复数：*A number of students are sick.*",
      ],
      ["Which verb completes the sentence?", "哪个动词能补全句子？"],
      `
        The team ___ ready for the game now.|is|are|were
        Ten dollars ___ too much for a sandwich today.|is|are|were
        A number of students ___ sick this week.|are|is|was
        The class ___ on a trip to the museum today.|is|are|were
        Three hours ___ a long time to wait now.|is|are|were
        The jury ___ still deciding today.|is|are|were
        A number of doctors ___ studying the virus now.|are|is|was
        The committee ___ every Monday.|meets|meet|met
        Five kilometers ___ a long way to walk today.|is|are|were
        My family ___ visiting Grandma this weekend.|is|are|were
        The number of cases ___ falling this month.|is|are|were
        The audience ___ clapping loudly now.|is|are|was
        Twenty minutes ___ enough time for the test today.|is|are|were
        The band ___ playing in the park tonight.|is|are|were
        A number of birds ___ nesting on the roof now.|are|is|was
        The crowd ___ growing by the minute.|is|are|were
        Two weeks ___ the usual time to recover.|is|are|were
        The staff ___ a meeting at noon today.|has|have|had
        A number of questions ___ still open now.|are|is|was
        The council ___ voting on the plan tonight.|is|are|were
        The flock ___ flying south now.|is|are|were
        A hundred dollars ___ the price of the bike today.|is|are|were
        The orchestra ___ tuning its instruments now.|is|are|were
        The number of visitors ___ higher this year.|is|are|were
        The herd ___ moving toward the river now.|is|are|were
        A number of players ___ injured this season.|are|is|was
        The panel ___ its report tomorrow.|gives|give|gave
        Fifty grams ___ the right amount of sugar for this recipe.|is|are|were
        The group ___ waiting for the bus right now.|is|are|were
        A number of shops ___ closed today.|are|is|was
      `,
      (right) => [
        `**${right}** agrees with the subject: a group or an amount counts as one, but *a number of* means many.`,
        `**${right}** 与主语一致：集体或数量算作一个，而 *a number of* 表示许多。`,
      ],
      [
        [
          "*{wrong}* does not agree with this subject, which takes **{right}**: a group or an amount counts as one, *a number of* as many.",
          "*{wrong}* 与这个主语不一致，应该用 **{right}**：集体或数量算作一个，*a number of* 算作许多。",
        ],
        ["*{wrong}* is in the past, but the sentence speaks of now or of every time.", "*{wrong}* 是过去时，而句子说的是现在或每一次。"],
      ],
    ),
  ],
});

/** grammarTopics7a are the grammar topics of the first five units of grade 7. */
export const grammarTopics7a: readonly TopicDef[] = [
  moodShifts,
  phrasesAndClauses,
  dangling,
  suffixSpelling,
  pairs,
  clauses,
  interrupters,
  tricky,
];
