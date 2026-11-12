// Grade 9: writing skills checked by rule, part two: claims in topic sentences, introducing and explaining evidence,
// and precise verbs for analyzing a text.

import type { TopicDef } from "@ga/content";
import { choose, type Label, label, topic } from "../grade-6/kit.ts";

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

const topicSentences = topic("writing", {
  id: "claims-in-topic-sentences",
  title: ["Claims in Topic Sentences", "主题句中的主张"],
  summary: [
    "In an analytical essay, each body paragraph opens with a topic sentence that makes a claim supporting the thesis, not with a fact or a quotation.",
    "在分析性文章中，每个主体段落都以一个支持论点的主张作为主题句开头，而不是以事实或引文开头。",
  ],
  after: ["how-a-paragraph-is-built", "an-analytical-thesis"],
  points: [
    label(
      "what-opens-the-paragraph",
      ["What Opens the Paragraph", "段落以什么开头"],
      [
        "In an analytical essay, each body paragraph should open with a **claim**: a point that supports the thesis and that the paragraph will prove. Weak paragraphs often open instead with **a fact from the plot**, which leaves nothing to prove, or with **a quotation**, which gives evidence before the reader knows what it is evidence for. A fourth weak opening **announces the topic** (*In this paragraph I will discuss...*) without saying anything about it.",
        "在分析性文章中，每个主体段落都应以**主张**开头：一个支持论点、并由本段加以证明的观点。较弱的段落常常以**情节中的事实**开头，没有什么可证明的；或者以**引文**开头，读者还不知道它要证明什么就先看到了证据。第四种较弱的开头是**宣布话题**（*In this paragraph I will discuss...*），却对话题什么也没说。",
      ],
      [
        "The thesis is: *In* The Odyssey, *Odysseus's cleverness saves him more often than his strength.* What does this opening sentence of a body paragraph give?",
        "论点是：*In* The Odyssey, *Odysseus's cleverness saves him more often than his strength.* 这个主体段落的首句给出的是什么？",
      ],
      `
        In the cave of the Cyclops, it is a trick, not a sword, that saves Odysseus and his men.|a claim
        Odysseus and his men are trapped in the cave of the Cyclops.|a fact from the plot
        “My name is Nobody,” Odysseus tells the Cyclops.|a quotation
        In this paragraph, I will discuss the episode of the Cyclops.|an announcement of the topic
        Even when Odysseus fights, his victories depend on a plan rather than on force.|a claim
        Odysseus fights the suitors in the final books of the poem.|a fact from the plot
        “Then I took the great bow,” Odysseus says.|a quotation
        This paragraph will be about the fight with the suitors.|an announcement of the topic
        Odysseus's disguise as a beggar lets him learn what strength alone could never discover.|a claim
        Odysseus returns home disguised as an old beggar.|a fact from the plot
        “I was a beggar in my own house,” Odysseus reflects.|a quotation
        Next, I am going to talk about Odysseus's disguise.|an announcement of the topic
        When Odysseus relies on strength instead of wit, as on the island of the Cicones, he loses men.|a claim
        On the island of the Cicones, Odysseus's men are attacked and many are killed.|a fact from the plot
        “Six men from each ship were killed,” the poem tells us.|a quotation
        The island of the Cicones is the subject of this paragraph.|an announcement of the topic
        Odysseus escapes the Sirens through foresight, not through courage alone.|a claim
        Odysseus has himself tied to the mast as the ship passes the Sirens.|a fact from the plot
        “Tie me hard to the mast,” Odysseus orders.|a quotation
        I will now discuss the Sirens.|an announcement of the topic
        Odysseus's patience with Penelope's suitors shows that his cleverness includes knowing when to wait.|a claim
        Odysseus waits several days before revealing himself to the suitors.|a fact from the plot
        “Bear it, my heart,” Odysseus tells himself.|a quotation
        In the following paragraph, the topic is Odysseus's waiting.|an announcement of the topic
        The story Odysseus invents for Athena shows that his cleverness is part of his nature, even with a god.|a claim
        Odysseus tells Athena a false story about who he is.|a fact from the plot
        “You would lie even to me,” Athena laughs.|a quotation
        This paragraph is about Odysseus and Athena.|an announcement of the topic
        The wooden horse, planned by Odysseus, ended a war that ten years of fighting could not.|a claim
        The Greeks hid inside a wooden horse to enter Troy.|a fact from the plot
      `,
      {
        "a claim": L(
          "主张",
          "The sentence makes a point that supports the thesis and that the paragraph can prove with evidence.",
          "这个句子提出一个支持论点、本段可以用证据证明的观点。",
          "The sentence does not make a point that the paragraph will prove.",
          "这个句子没有提出一个本段要证明的观点。",
        ),
        "a fact from the plot": L(
          "情节中的事实",
          "The sentence only states something that happens in the text, so there is nothing for the paragraph to prove.",
          "这个句子只陈述了作品中发生的事，本段没有什么可证明的。",
          "The sentence is not only a fact from the plot.",
          "这个句子不只是情节中的事实。",
        ),
        "a quotation": L(
          "引文",
          "The sentence opens with a quotation, giving evidence before the reader knows what it is evidence for.",
          "这个句子以引文开头，读者还不知道证据要证明什么就先看到了证据。",
          "The sentence does not open with a quotation.",
          "这个句子不是以引文开头的。",
        ),
        "an announcement of the topic": L(
          "宣布话题",
          "The sentence only announces what the paragraph will be about, without saying anything about it.",
          "这个句子只宣布本段要谈什么，却对它什么也没说。",
          "The sentence does more than announce the topic.",
          "这个句子不只是宣布话题。",
        ),
      },
    ),
    choose(
      "the-topic-sentence-that-fits",
      ["The Topic Sentence That Fits", "合适的主题句"],
      [
        "A topic sentence must also **fit the thesis**: it should support the thesis's claim, not wander from it. If the thesis says that *the setting mirrors the family's decline*, a good topic sentence names one part of that mirroring. Two weak choices are common: a sentence that makes a claim **about something else**, and a sentence that only **repeats the thesis** word for word, adding no new step.",
        "主题句还必须**与论点相符**：它应该支持论点的主张，而不是偏离它。如果论点说*场景映照着家族的衰落*，好的主题句就说出这种映照的某一方面。常见的弱选择有两种：一种对**别的事情**提出主张，另一种只是逐字**重复论点**，没有增加新的一步。",
      ],
      ["Which topic sentence best supports the thesis?", "哪个主题句最能支持这个论点？"],
      `
        Thesis: The crumbling house mirrors the family's decline.|As the family's fortune shrinks, the house loses its rooms one by one, sealed and left to rot.|The author grew up in a large country house much like the one in the story, as many readers know.|The crumbling house mirrors the family's decline.
        Thesis: The prince's delay comes from doubt, not cowardice.|The prince stages the play within the play to test whether the ghost has told the truth.|The prince is one of the most famous characters in all of literature.|The prince's delay comes from doubt, not cowardice.
        Thesis: The narrator's childhood view makes the adults' cruelty more shocking.|Because she does not yet know what prejudice is, the narrator describes the trial in plain words that make its injustice obvious.|The novel was very popular when it was first published, as many readers, teachers and critics have pointed out again and again over the years.|The narrator's childhood view makes the adults' cruelty more shocking.
        Thesis: The poem's winter images give way to spring as the speaker heals.|The bare branches of the first stanza become the first green buds of the third, as the speaker's grief begins to lift.|The poet wrote many other poems about the seasons and the weather.|The poem's winter images give way to spring as the speaker heals.
        Thesis: The general's jealousy, not the villain's lies, destroys him.|Again and again, the general asks for proof and then accepts the flimsiest kind.|The villain is one of the most evil characters ever written for the stage, as many readers know.|The general's jealousy, not the villain's lies, destroys him.
        Thesis: The dystopia warns about a society that trades freedom for comfort.|The citizens accept the cameras in their homes because the cameras also bring them free food and entertainment.|Many readers think that dystopias are too depressing to enjoy.|The dystopia warns about a society that trades freedom for comfort.
        Thesis: The foil of the reckless brother makes the hero's caution look wise.|When the brother rushes into the ambush and is captured, the hero's slow scouting suddenly looks like wisdom.|The playwright had a brother of his own whom he admired, as many readers and critics have pointed out over the years.|The foil of the reckless brother makes the hero's caution look wise.
        Thesis: The memoir's jumps in time show how the past lives on in the present.|Each memory of childhood is placed beside a scene from old age that echoes it.|Memoirs are a popular kind of book in many countries.|The memoir's jumps in time show how the past lives on in the present.
        Thesis: The folktale honors hospitality above wealth.|The rich man who refuses the beggar loses everything, while the poor host who shares his bread is rewarded.|Folktales were once told aloud around fires in the evening, as many readers and critics have pointed out over the years.|The folktale honors hospitality above wealth.
        Thesis: The film turns the novel's story of doubt into a story of action.|Where the novel spends pages on the hero's inner debate, the film shows him running, fighting and escaping.|The film cost more to make than any other film of its year.|The film turns the novel's story of doubt into a story of action.
        Thesis: The epic's similes link heroic battles to everyday life.|Warriors falling in battle are compared to wheat cut down at harvest, a sight every listener knew.|Epics were usually performed by singers who traveled from town to town, as many readers and critics have pointed out over the years.|The epic's similes link heroic battles to everyday life.
        Thesis: The speaker's calm voice suggests a grief too deep for tears.|The speaker describes her mother's funeral in short, even sentences, as if any strong word might break her.|Many poems are written about the death of a parent.|The speaker's calm voice suggests a grief too deep for tears.
        Thesis: In the story, the ending refuses to punish the villain.|The villain sails away untouched, while the honest characters are left to rebuild what he destroyed.|The story's author is known for writing happy endings, as many readers and critics have pointed out over the years.|In the story, the ending refuses to punish the villain.
        Thesis: The play's early talk of fate makes the lovers' deaths feel certain.|In the very first scene, the chorus calls the lovers star-crossed, so the audience watches every happy moment with dread.|The play is often performed in schools all over the world.|The play's early talk of fate makes the lovers' deaths feel certain.
        Thesis: The speech's repetition turns complaint into a demand for action.|Each time the speaker repeats “we will not wait,” the list of wrongs that follows grows shorter and the demand grows sharper.|The speech was given on a cold morning in front of a large crowd, as many readers and critics have pointed out over the years.|The speech's repetition turns complaint into a demand for action.
        Thesis: The hero's journey leaves him wiser but alone.|On his return, the hero understands the village elders' warnings, but no one in the village understands him.|The hero's journey is a pattern found in stories from many cultures.|The hero's journey leaves him wiser but alone.
        Thesis: The light in the novel always arrives with the truth.|The secret of the will is discovered by the first light of dawn, as the candles in the study burn out.|The novel was written by an author who loved to paint, as many readers and critics have pointed out over the years.|The light in the novel always arrives with the truth.
        Thesis: The unreliable narrator's contradictions reveal her guilt.|She claims she never saw the letter, but two chapters later she quotes it word for word.|Unreliable narrators appear in many famous mystery novels.|The unreliable narrator's contradictions reveal her guilt.
        Thesis: The tragic king's pride blinds him to his daughter's love.|He mistakes his youngest daughter's honest answer for coldness because it does not flatter him.|Kings in old plays often have three daughters, as many readers and critics have pointed out over the years.|The tragic king's pride blinds him to his daughter's love.
        Thesis: The two sisters show two answers to the same loss.|After their mother's death, one sister stays to run the farm while the other flees to the city.|The novel's author has a sister who is also a writer.|The two sisters show two answers to the same loss.
        Thesis: The poem's harsh words make the city sound like a machine.|Verbs such as *grind*, *clang* and *crush* turn the city's streets into the gears of an engine.|The poet lived in the city for most of her life, as many readers and critics have pointed out over the years.|The poem's harsh words make the city sound like a machine.
        Thesis: The cumulative descriptions of decay build a mood of dread.|The rust, the mold and the silence of the house build up, paragraph by paragraph, until the reader expects disaster.|Gothic stories were very popular in the nineteenth century.|The cumulative descriptions of decay build a mood of dread.
        Thesis: The short story's flashbacks explain the hero's anger.|Each flashback to the war comes just after an outburst, showing what the hero is really angry about.|The author served in the war that the story describes, as many readers and critics have pointed out over the years.|The short story's flashbacks explain the hero's anger.
        Thesis: The documentary emphasizes the ruins of the city to show the cost of war.|The camera returns to the same broken church at the start of every section, reminding viewers what was lost.|Documentaries are often shown in history classes.|The documentary emphasizes the ruins of the city to show the cost of war.
        Thesis: The mentor's death forces the young hero to grow up.|Without her teacher's advice, the hero must make her first decision alone, and she makes it well.|Mentors appear in stories from almost every culture, as many readers and critics have pointed out over the years.|The mentor's death forces the young hero to grow up.
        Thesis: The robot's questions make the reader ask what makes us human.|When the robot asks whether its fear of being switched off is real, the reader cannot easily say no.|Robots are a common subject of science fiction films.|The robot's questions make the reader ask what makes us human.
        Thesis: The essay's humor makes a painful subject easier to face.|The writer's jokes about the hospital food let readers relax just enough to keep reading about her illness.|The essay won a prize for young writers, as many readers, teachers and critics have pointed out again and again over the years.|The essay's humor makes a painful subject easier to face.
        Thesis: The closed door at the end of the poem shuts off hope.|The doors that stood open in the first stanzas are shut one by one, until the last one closes on the speaker.|The poem is one of the shortest the poet ever wrote.|The closed door at the end of the poem shuts off hope.
        Thesis: The village's silence reveals its shared guilt.|No one in the village will speak of the missing girl, not even her own family.|The village in the story is based on a real place, as many readers and critics have pointed out over the years.|The village's silence reveals its shared guilt.
        Thesis: The captain's choice to stay with the ship shows duty above life.|The captain refuses the last seat in the lifeboat and gives it to a young sailor.|Shipwrecks are a common subject in adventure stories.|The captain's choice to stay with the ship shows duty above life.
      `,
      (right) => [
        `*${right}* names one part of the thesis's claim that the paragraph can prove, so it supports the thesis.`,
        `*${right}* 说出了论点主张中本段可以证明的一部分，所以它支持论点。`,
      ],
      [
        [
          "*{wrong}* wanders from the thesis: it is about the author, the genre or the audience, not about the claim.",
          "*{wrong}* 偏离了论点：它说的是作者、体裁或读者，而不是论点的主张。",
        ],
        [
          "*{wrong}* only repeats the thesis word for word, so the paragraph adds no new step to the argument.",
          "*{wrong}* 只是逐字重复论点，本段没有为论证增加新的一步。",
        ],
      ],
    ),
  ],
});

const evidence = topic("writing", {
  id: "introducing-and-explaining-evidence",
  title: ["Introducing and Explaining Evidence", "引出和解释证据"],
  summary: [
    "A quotation in an essay needs a sentence that introduces it and a sentence that explains how it proves the claim.",
    "文章中的引文需要一个引出它的句子，以及一个解释它如何证明主张的句子。",
  ],
  after: ["quoting-a-primary-source", "analysis-not-summary"],
  points: [
    label(
      "introduced-dropped-or-explained",
      ["Introduced, Dropped or Explained", "引出、突兀还是解释"],
      [
        "A quotation should never stand alone in an essay. It needs an **introduction**, which tells the reader who is speaking and when: *As the storm rises, the captain shouts,* “...” A **dropped quotation** appears with no introduction, as a sentence by itself. And after the quotation comes the **explanation**, which shows how the words prove the claim: *His order reveals that he fears the crew more than the sea.* A paragraph that ends with the quotation leaves the reader to do the essay's work.",
        "引文在文章中绝不能孤零零地出现。它需要**引出**，告诉读者是谁在什么时候说的：*As the storm rises, the captain shouts,* “...” **突兀的引文**没有任何引出，自成一句。引文之后是**解释**，说明这些话如何证明主张：*His order reveals that he fears the crew more than the sea.* 以引文结尾的段落把文章该做的事留给了读者。",
      ],
      ["What does this sentence from an essay do with the quotation?", "文章中的这个句子如何处理引文？"],
      `
        As the storm rises, the captain shouts, “Every man to the ropes!”|introduces it
        “Every man to the ropes!”|drops it
        The captain's order reveals that, even in danger, he thinks first of his crew.|explains it
        When the king learns the truth, he cries, “I am a very foolish, fond old man.”|introduces it
        “I am a very foolish, fond old man.”|drops it
        By calling himself foolish, the king at last admits the pride that ruined him.|explains it
        Looking back on her childhood, the narrator writes, “We were poor, but we never knew it.”|introduces it
        “We were poor, but we never knew it.”|drops it
        The narrator's words suggest that the family's love hid their hardship even from themselves.|explains it
        Alone on the stage, the prince asks himself, “To be, or not to be.”|introduces it
        “To be, or not to be.”|drops it
        The prince's question shows that his struggle is not with his uncle but with whether life itself is worth living.|explains it
        As she leaves the village, the girl promises, “I will come back when the river freezes.”|introduces it
        “I will come back when the river freezes.”|drops it
        Because the river in the story never freezes, her promise quietly tells the reader that she will never return.|explains it
        Describing the city, the poet calls it “a hungry mouth.”|introduces it
        “A hungry mouth.”|drops it
        The metaphor turns the city into a creature that devours the people who come to it.|explains it
        At the trial, the witness insists, “I saw nothing, and I heard nothing.”|introduces it
        “I saw nothing, and I heard nothing.”|drops it
        The witness's denial, repeated so firmly, makes the reader suspect that she saw everything.|explains it
        Near the end of the speech, the speaker declares, “We will not wait.”|introduces it
        “We will not wait.”|drops it
        The short, blunt sentence turns the speech's complaints into a demand.|explains it
        Watching the soldiers leave, the mother whispers, “Come home whole.”|introduces it
        “Come home whole.”|drops it
        Her word *whole* shows that she fears not only her son's death but the damage the war will do to him.|explains it
        In his final letter, the explorer writes, “We are weak, but we are not afraid.”|introduces it
        “We are weak, but we are not afraid.”|drops it
        The explorer's calm words show a courage that does not depend on hope.|explains it
      `,
      {
        "introduces it": L(
          "引出引文",
          "The sentence tells who is speaking and when, then gives the quotation inside the writer's own sentence.",
          "这个句子说明谁在什么时候说话，然后把引文放进作者自己的句子里。",
          "The sentence does not lead into the quotation by telling who speaks and when.",
          "这个句子没有说明谁在什么时候说话来引出引文。",
        ),
        "drops it": L(
          "突兀的引文",
          "The quotation stands alone as a sentence, with no words to introduce it.",
          "引文自成一句，没有任何引出的话。",
          "The quotation does not stand alone without an introduction.",
          "引文并不是没有引出、孤零零地出现。",
        ),
        "explains it": L(
          "解释引文",
          "The sentence shows what the quoted words mean and how they prove the claim.",
          "这个句子说明引用的话意味着什么，以及它们如何证明主张。",
          "The sentence does not explain what the quotation means or proves.",
          "这个句子没有解释引文的含义或它证明了什么。",
        ),
      },
    ),
    choose(
      "the-explanation-that-proves",
      ["The Explanation That Proves", "能证明主张的解释"],
      [
        "The explanation after a quotation should **connect the words to the claim**, often by looking closely at a single word or image. Two weak explanations are common: one only **restates the quotation** in other words, and one makes **a claim the quotation does not support**.",
        "引文之后的解释应该**把这些话与主张联系起来**，常常是仔细分析某一个词或意象。常见的弱解释有两种：一种只是用别的话**重述引文**，另一种提出了**引文并不支持的主张**。",
      ],
      ["Which sentence best explains how the quotation proves the claim?", "哪个句子最能解释引文如何证明主张？"],
      `
        Claim: The king's pride blinds him. Quotation: “Nothing will come of nothing.”|The king's cold reply shows that he values words of flattery over his daughter's honest love.|The king says that if she says nothing, she will get nothing from him.|This quotation proves that the king has always hated his youngest daughter, without any doubt.
        Claim: The narrator feels trapped. Quotation: “The walls leaned in a little more each day.”|The image of closing walls turns her feeling of being trapped into something she can almost see.|The narrator says that each day the walls seemed to lean in a little more.|This quotation proves that the narrator's house is really falling down.
        Claim: The hero's courage is a choice. Quotation: “My knees shook, but I stepped forward.”|The word *but* shows that his courage comes from choosing to act in spite of fear.|The hero says his knees were shaking, but he still stepped forward.|This quotation proves that the hero has never felt fear in his life, without any doubt.
        Claim: The city is a threat. Quotation: “The streets swallowed him.”|The verb *swallowed* turns the city into a creature that devours the people inside it.|The quotation says that the streets swallowed him up.|This quotation proves that the man was eaten by an animal.
        Claim: The mother hides her grief. Quotation: “She smiled and set the table for four.”|Her smile, beside the extra place, shows a grief she will not let anyone see.|The mother smiled and set the table for four people.|This quotation proves that the mother has forgotten that her son is gone, without any doubt.
        Claim: The general's jealousy grows. Quotation: “Give me the ocular proof.”|His demand for proof he can see shows that suspicion has already taken hold of him.|The general asks to be given proof he can see with his own eyes.|This quotation proves that the general is losing his eyesight.
        Claim: The speaker longs for the past. Quotation: “Where are the songs of spring?”|The question shows that the speaker misses a happier time she knows is gone.|The speaker asks where the songs of spring have gone.|This quotation proves that the speaker hates the spring, and the rest of the text makes this perfectly clear.
        Claim: The village fears the stranger. Quotation: “Doors were bolted at noon.”|Bolting doors in broad daylight shows how deep the village's fear has grown.|The quotation says that people bolted their doors at noon.|This quotation proves that the village has a problem with thieves.
        Claim: The poem celebrates nature. Quotation: “The hills are alive with light.”|Calling the hills *alive* gives nature an energy the speaker clearly admires.|The poem says that the hills are alive with light.|This quotation proves that the hills are covered in electric lamps, without any doubt.
        Claim: The prince doubts the ghost. Quotation: “The spirit that I have seen may be a devil.”|By calling the ghost a possible devil, the prince shows that his delay comes from doubt.|The prince says that the spirit he has seen might be a devil.|This quotation proves that the prince does not believe in ghosts at all.
        Claim: The explorer accepts death calmly. Quotation: “We shall stick it out to the end.”|The plain phrase *stick it out* shows a quiet acceptance, without fear or self-pity.|The explorer writes that they will stick it out to the end.|This quotation proves that the explorer expects to be rescued soon, without any doubt.
        Claim: The girl outgrows her childhood. Quotation: “The swing seemed smaller than I remembered.”|The swing seems smaller because she has grown, so the image marks the end of her childhood.|The narrator says that the swing seemed smaller than she remembered.|This quotation proves that someone has replaced the old swing.
        Claim: The factory dehumanizes the workers. Quotation: “The hands were counted at the gate.”|Calling the workers *hands* reduces them to the parts of them the factory uses.|The quotation says that the hands were counted at the gate.|This quotation proves that the workers had injured their hands, without any doubt.
        Claim: The lovers' meeting is fated. Quotation: “My life were better ended by their hate.”|Romeo's words show he already links his love to death, as if the ending were written.|Romeo says that his life would be better ended by their hate.|This quotation proves that Romeo hates Juliet's family.
        Claim: The soldier is haunted by the war. Quotation: “Every door slam was a gunshot.”|Turning ordinary sounds into gunshots shows that the war has followed him home.|The soldier says that every slamming door sounded like a gunshot.|This quotation proves that the soldier lives in a dangerous neighborhood, without any doubt.
        Claim: The queen rules by fear. Quotation: “No one spoke until she looked away.”|The court's silence under her gaze shows how completely fear controls them.|The quotation says that no one spoke until she looked away.|This quotation proves that the queen is unable to speak.
        Claim: The grandfather is proud of his heritage. Quotation: “He wore his father's coat to every wedding.”|Wearing the old coat on proud occasions shows how much his father's past means to him.|The grandfather wore his father's coat to every wedding.|This quotation proves that the grandfather could not afford a new coat, without any doubt.
        Claim: The storm mirrors the family's quarrel. Quotation: “The thunder answered every shout.”|The thunder *answering* the shouts links the storm outside to the anger inside the house.|The quotation says that thunder answered every shout.|This quotation proves that the family was too loud during the storm.
        Claim: The poem sees time as a thief. Quotation: “The years crept in and took the gold.”|The verb *crept* makes time a silent thief that steals youth without being seen.|The poem says that the years crept in and took the gold.|This quotation proves that a thief stole the family's gold, and the rest of the text makes this perfectly clear.
        Claim: The boy is lonely. Quotation: “He talked to the dog because no one else listened.”|The phrase *no one else listened* shows that the dog is his only companion.|The boy talked to the dog because no one else would listen.|This quotation proves that the boy is afraid of people.
        Claim: The speech inspires hope. Quotation: “The dawn is closer than the dark.”|Placing dawn *closer* than the dark promises the audience that the worst is nearly over.|The speaker says that the dawn is closer than the dark.|This quotation proves that the speech was given early in the morning, and the rest of the text makes this perfectly clear.
        Claim: The servant is secretly powerful. Quotation: “She held every key in the house.”|Holding every key gives the servant control over every secret the family keeps.|The quotation says that she held every key in the house.|This quotation proves that the servant is a thief.
        Claim: The island is a paradise. Quotation: “No one there had ever learned the word for hunger.”|A people with no word for hunger have never known want, which marks the island as ideal.|No one on the island had ever learned the word for hunger.|This quotation proves that the islanders speak a different language, and the rest of the text makes this perfectly clear.
        Claim: The hero has changed. Quotation: “He no longer recognized his own reflection.”|Not recognizing his reflection shows how deeply the journey has changed him.|The hero no longer recognized his own reflection.|This quotation proves that the hero has lost his memory.
        Claim: The family is falling apart. Quotation: “They ate in separate rooms now.”|Eating apart shows that the family no longer shares even the simplest moments.|The quotation says that they ate in separate rooms now.|This quotation proves that the house is too small for the family, without any doubt.
        Claim: The poem praises simple things. Quotation: “A cup of tea, a window, rain.”|Listing small, ordinary things as a whole line makes them seem precious.|The poem mentions a cup of tea, a window and rain.|This quotation proves that the poet does not like to go outside.
        Claim: The tyrant fears his people. Quotation: “He slept in a different room every night.”|Changing rooms each night shows that the tyrant lives in constant fear of attack.|The tyrant slept in a different room every night.|This quotation proves that the tyrant had trouble sleeping, and the rest of the text makes this perfectly clear.
        Claim: The narrator regrets her choice. Quotation: “I still dream of the road I did not take.”|Dreaming of the other road shows that her choice still troubles her years later.|The narrator says she still dreams of the road she did not take.|This quotation proves that the narrator got lost on a journey.
        Claim: The war poem rejects glory. Quotation: “The old lie: it is sweet to die for one's country.”|Calling the famous saying *the old lie* rejects the idea that dying in war is glorious.|The poet calls the saying that it is sweet to die for one's country an old lie.|This quotation proves that the poet does not love his country, and the rest of the text makes this perfectly clear.
        Claim: The orphan finds a new family. Quotation: “They set a place for her without asking.”|Setting her place without asking shows that the family already counts her as one of them.|The quotation says that they set a place for her without asking.|This quotation proves that the family is rude to the orphan.
      `,
      (right) => [
        `*${right}* connects the quoted words to the claim, often through one word or image, which proves the point.`,
        `*${right}* 把引用的话与主张联系起来，常常借助一个词或意象，从而证明了观点。`,
      ],
      [
        [
          "*{wrong}* only restates the quotation in other words; it does not explain how it proves the claim.",
          "*{wrong}* 只是用别的话重述了引文，没有解释它如何证明主张。",
        ],
        ["*{wrong}* makes a claim that the quotation does not support.", "*{wrong}* 提出了一个引文并不支持的主张。"],
      ],
    ),
  ],
});

const verbs = topic("writing", {
  id: "verbs-for-analyzing-a-text",
  title: ["Verbs for Analyzing a Text", "分析作品时用的动词"],
  summary: [
    "Precise verbs such as *reveals*, *suggests*, *emphasizes* and *contrasts* say exactly what a detail does, where *says* and *shows* say little.",
    "*reveals*、*suggests*、*emphasizes*、*contrasts* 这样精确的动词准确地说出细节起什么作用，而 *says* 和 *shows* 说明不了多少。",
  ],
  after: ["word-choice-and-meaning"],
  points: [
    choose(
      "the-precise-verb",
      ["The Precise Verb", "精确的动词"],
      [
        "Analysis needs **precise verbs**. *Reveals* means a detail uncovers something hidden. *Suggests* means it hints without stating. *Emphasizes* means it gives something special weight. *Contrasts* means it sets two things against each other. *Foreshadows* means it hints at what will happen later. Vague verbs such as *says* or *talks about* tell the reader little.",
        "分析需要**精确的动词**。*reveals* 表示细节揭示了隐藏的东西。*suggests* 表示暗示而不直说。*emphasizes* 表示特别强调某样东西。*contrasts* 表示把两样东西对照起来。*foreshadows* 表示暗示后来会发生的事。*says* 或 *talks about* 这样含糊的动词告诉读者的东西很少。",
      ],
      ["Which verb fits the analysis best?", "哪个动词最适合这句分析？"],
      `
        The storm in the opening scene ___ the violence that will come in the final act.|foreshadows|says|contrasts
        The villain's smile in the last scene ___ that he planned everything from the start.|reveals|talks about|foreshadows
        The poet's repetition of *never* ___ the speaker's despair, giving it special weight.|emphasizes|says|reveals
        The bright kitchen ___ the cold, dark street outside, setting the two against each other.|contrasts|talks about|emphasizes
        The faded wallpaper ___, without stating it, that the family has fallen on hard times.|suggests|says|contrasts
        The broken mirror in chapter one ___ the shattering of the family in chapter ten.|foreshadows|talks about|emphasizes
        The diary, found after her death, ___ the secret she kept all her life.|reveals|says|suggests
        Ending every stanza with *alone* ___ the speaker's loneliness.|emphasizes|talks about|contrasts
        The quiet sister ___ the loud one, so that each makes the other stand out.|contrasts with|says|reveals
        The empty birdcage ___, though the story never says so, that the girl has lost her freedom.|suggests|talks about|emphasizes
        The early mention of the cliff ___ the fall in the final scene.|foreshadows|says|reveals
        The letter in the drawer ___ that the father knew the truth all along.|reveals|talks about|contrasts
        Placing the single word *Silence* on its own line ___ it.|emphasizes|says|foreshadows
        The rich man's feast ___ the beggar's empty bowl.|contrasts with|talks about|suggests
        The trembling hand ___ that the hero is more frightened than he admits.|suggests|says|contrasts
        The crow on the gate in the first scene ___ the death that will come later.|foreshadows|talks about|reveals
        The confession in the last chapter ___ who really started the fire.|reveals|says|emphasizes
        The writer's use of capital letters ___ the importance of the warning.|emphasizes|talks about|suggests
        The sunny opening ___ the dark ending.|contrasts with|says|foreshadows
        The way she clutches the old photograph ___ how much she misses her brother.|suggests|talks about|contrasts
        The fortune teller's warning ___ the hero's downfall.|foreshadows|says|emphasizes
        The overheard conversation ___ the plot against the king.|reveals|talks about|suggests
        Repeating the question three times ___ the speaker's desperation.|emphasizes|says|contrasts
        The calm sea of the first chapter ___ the storm of the last.|contrasts with|talks about|reveals
        The locked door ___ that the family is hiding something.|suggests|says|emphasizes
        The cracked bell in the opening ___ the broken promises to come.|foreshadows|talks about|contrasts
        The mask falling off ___ the villain's true face.|reveals|says|foreshadows
        Ending the essay on the single word *hope* ___ it.|emphasizes|talks about|reveals
        The noisy city ___ the silent village where the story ends.|contrasts with|says|suggests
        The way the dog hides when the master comes home ___ that the master is cruel.|suggests|talks about|foreshadows
      `,
      (right) => [`*${right}* says exactly what the detail does in the text.`, `*${right}* 准确说出了这个细节在作品中起什么作用。`],
      [
        [
          "*{wrong}* is too vague: it tells the reader little about what the detail does.",
          "*{wrong}* 太含糊了：它几乎没有告诉读者这个细节起什么作用。",
        ],
        [
          "*{wrong}* is precise, but it names a different job from the one the detail does here.",
          "*{wrong}* 虽然精确，但说的是另一种作用，而不是这个细节在这里所起的作用。",
        ],
      ],
    ),
    label(
      "what-the-verb-claims",
      ["What the Verb Claims", "动词提出了什么主张"],
      [
        "Each analytical verb makes a different claim. **Reveals** claims that something hidden is uncovered. **Suggests** claims that something is hinted at but not stated. **Emphasizes** claims that something is given extra weight. **Contrasts** claims that two things are set against each other. **Foreshadows** claims that a detail hints at a later event. Choose the verb whose claim you can prove.",
        "每个分析性动词都提出不同的主张。**reveals** 主张隐藏的东西被揭开了。**suggests** 主张某事被暗示而没有明说。**emphasizes** 主张某事被特别强调。**contrasts** 主张两样东西被相互对照。**foreshadows** 主张某个细节暗示了后来的事件。选择你能证明其主张的动词。",
      ],
      ["Which verb's claim does this description match?", "这个描述与哪个动词的主张相符？"],
      `
        A detail hints at an event that has not happened yet.|foreshadows
        A detail uncovers something that was hidden from the characters or the reader.|reveals
        A detail hints at a meaning without stating it.|suggests
        A detail gives something extra weight, through repetition or placement.|emphasizes
        A detail sets two things against each other so their differences stand out.|contrasts
        A dark cloud in the first chapter hints at the disaster in the last.|foreshadows
        A hidden letter, once read, shows the reader who the real father is.|reveals
        A character's nervous glance hints, without words, that she is lying.|suggests
        A word is repeated at the end of every stanza to give it weight.|emphasizes
        The rich house and the poor hut are described side by side.|contrasts
        An early warning about the river prepares for the drowning later in the story.|foreshadows
        A confession uncovers the secret that has driven the plot.|reveals
        The cold tone of a letter hints that the friendship is over.|suggests
        A single sentence is placed alone in its own paragraph for weight.|emphasizes
        The gentle brother and the cruel brother are set side by side.|contrasts
        A prophecy at the start points toward the hero's fate at the end.|foreshadows
        A mask is removed, and the villain's true identity is uncovered.|reveals
        Faded curtains hint that the family has known better days.|suggests
        The writer puts the key word in capital letters to stress it.|emphasizes
        The noisy morning market is set against the silent night streets.|contrasts
        A broken toy in chapter two hints at the broken family in chapter ten.|foreshadows
        A diary entry uncovers what the heroine truly felt.|reveals
        A character's empty plate hints that he is too sad to eat.|suggests
        The poem's last line repeats its first, giving the idea special weight.|emphasizes
        The bright first scene is set against the dark final scene.|contrasts
        A crack in the dam, mentioned early, prepares for the flood at the end.|foreshadows
        An overheard whisper uncovers the plot against the queen.|reveals
        A shaking voice hints at fear the speaker will not admit.|suggests
        A speaker pauses before the most important word to make it stand out.|emphasizes
        The young hero's hope is set against the old king's despair.|contrasts
      `,
      {
        foreshadows: L(
          "预示",
          "The detail hints at an event that will come later in the text.",
          "这个细节暗示了作品中后来会发生的事。",
          "The detail is not about an event that comes later.",
          "这个细节与后来发生的事无关。",
        ),
        reveals: L(
          "揭示",
          "The detail uncovers something that was hidden.",
          "这个细节揭开了隐藏的东西。",
          "Nothing hidden is uncovered here.",
          "这里并没有揭开什么隐藏的东西。",
        ),
        suggests: L(
          "暗示",
          "The detail hints at a meaning without stating it outright.",
          "这个细节暗示了某种含义，但没有明说。",
          "The detail is not a hint at an unstated meaning.",
          "这个细节并不是对未明说含义的暗示。",
        ),
        emphasizes: L(
          "强调",
          "The detail gives something extra weight, often through repetition or placement.",
          "这个细节特别强调了某样东西，常常借助重复或位置安排。",
          "The detail does not give something extra weight.",
          "这个细节并没有特别强调某样东西。",
        ),
        contrasts: L(
          "对照",
          "The detail sets two things against each other so their differences stand out.",
          "这个细节把两样东西相互对照，使它们的差异突出。",
          "The detail does not set two things against each other.",
          "这个细节并没有把两样东西相互对照。",
        ),
      },
    ),
  ],
});

/** writingTopics9b are the second writing topics of grade 9 checked by rule. */
export const writingTopics9b: readonly TopicDef[] = [topicSentences, evidence, verbs];
