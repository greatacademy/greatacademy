// Grade 8: reading of the first units: how incidents propel the action, dramatic irony, how a paragraph is built,
// conflicting accounts, founding documents, opposing viewpoints, central ideas, and facts beside interpretations.

import type { TopicDef } from "@ga/content";
import { type Label, label, topic } from "../grade-6/kit.ts";

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

const incidents = topic("reading", {
  id: "how-incidents-propel-the-action",
  title: ["How Incidents Propel the Action", "事件如何推动情节"],
  summary: [
    "An incident in a story or play can force a decision, reveal a character or deepen the conflict, and each one sets up what follows.",
    "故事或戏剧中的一个事件可以迫使人物做出决定、揭示人物性格或加深冲突，每个事件都为后面的情节做铺垫。",
  ],
  after: ["plot-and-conflict", "how-story-elements-interact"],
  points: [
    label(
      "what-the-incident-does",
      ["What the Incident Does", "这个事件起什么作用"],
      [
        "Writers choose each incident for a reason. Some incidents **force a decision**: a character must choose, and the choice sets the next events moving. Some **reveal a character**: they show what a person is like, brave or petty or kind, without changing the course of the plot. Others **deepen the conflict**: a new obstacle or danger makes the problem harder to solve. Ask what would be lost if the incident were cut.",
        "作家安排每个事件都有理由。有些事件**迫使人物做出决定**：人物必须选择，而这个选择推动了后面的事件。有些事件**揭示人物性格**：它们表现一个人勇敢、小气或善良，但不改变情节的走向。还有些事件**加深冲突**：新的障碍或危险让问题更难解决。问问自己：如果删掉这个事件，会失去什么？",
      ],
      ["What does this incident mainly do in the story?", "这个事件在故事中主要起什么作用？"],
      `
        Story: Leo has hidden the fact that he broke his neighbor's window. Incident: His neighbor asks him straight out whether he saw who did it.|forces a decision
        Story: Leo has hidden the fact that he broke his neighbor's window. Incident: On the way home, Leo stops to help a small child tie her shoe.|reveals a character
        Story: Leo has hidden the fact that he broke his neighbor's window. Incident: The police come and say the neighbor's son is being blamed.|deepens the conflict
        Story: Ana wants to win the regional chess final. Incident: Her rival offers to tell her his opening moves if she lends him her notes.|forces a decision
        Story: Ana wants to win the regional chess final. Incident: Before the match, Ana quietly lends her spare pen to a nervous younger player.|reveals a character
        Story: Ana wants to win the regional chess final. Incident: The night before the final, Ana sprains her wrist and cannot sleep for the pain.|deepens the conflict
        Story: A ship's crew is running short of water. Incident: The captain must choose between turning back and sailing on to an unknown island.|forces a decision
        Story: A ship's crew is running short of water. Incident: The cook gives his own ration to the cabin boy without a word.|reveals a character
        Story: A ship's crew is running short of water. Incident: A storm smashes two of the last water barrels.|deepens the conflict
        Story: Mei has been chosen to give the school speech but is terrified of crowds. Incident: Her teacher says she can still hand the speech to someone else, but only today.|forces a decision
        Story: Mei has been chosen to give the school speech but is terrified of crowds. Incident: Mei spends her lunch hour helping a friend study for a test.|reveals a character
        Story: Mei has been chosen to give the school speech but is terrified of crowds. Incident: She learns that the mayor and a television crew will be in the audience.|deepens the conflict
        Story: Two brothers are fighting over their late father's farm. Incident: A buyer offers a large sum, and the brothers must agree by Friday or lose the offer.|forces a decision
        Story: Two brothers are fighting over their late father's farm. Incident: The older brother is seen feeding a stray dog every morning.|reveals a character
        Story: Two brothers are fighting over their late father's farm. Incident: A will is found that gives the whole farm to a cousin.|deepens the conflict
        Story: Sam is hiding a lost puppy in his room against his parents' rules. Incident: His mother says she is coming upstairs to clean his room in ten minutes.|forces a decision
        Story: Sam is hiding a lost puppy in his room against his parents' rules. Incident: Sam carefully counts out his savings to buy the puppy food.|reveals a character
        Story: Sam is hiding a lost puppy in his room against his parents' rules. Incident: Posters appear around town offering a reward for the puppy.|deepens the conflict
        Story: A knight has sworn to guard a bridge. Incident: A wounded stranger begs to cross, and the knight must break his oath or turn him away.|forces a decision
        Story: A knight has sworn to guard a bridge. Incident: The knight shares his bread with a crow that lands on the rail.|reveals a character
        Story: A knight has sworn to guard a bridge. Incident: Word comes that an army is marching toward the bridge.|deepens the conflict
        Story: Rosa is saving to buy back her grandmother's sold piano. Incident: Her brother needs money for a doctor, and Rosa holds the only savings in the family.|forces a decision
        Story: Rosa is saving to buy back her grandmother's sold piano. Incident: Rosa plays a song on a shop's piano and cries at the memory.|reveals a character
        Story: Rosa is saving to buy back her grandmother's sold piano. Incident: The new owner raises the price to twice what Rosa has saved.|deepens the conflict
        Story: A girl has found a diary that proves the mayor lied. Incident: A reporter asks her to hand it over tonight or keep silent forever.|forces a decision
        Story: A girl has found a diary that proves the mayor lied. Incident: She reads the diary to her blind uncle each evening.|reveals a character
        Story: A girl has found a diary that proves the mayor lied. Incident: Someone breaks into her house and searches her room.|deepens the conflict
        Story: A climber is stuck on a ledge as night falls. Incident: She must choose whether to climb down in the dark or wait for help.|forces a decision
        Story: A climber is stuck on a ledge as night falls. Incident: She hums her late father's favorite song to stay calm.|reveals a character
        Story: A climber is stuck on a ledge as night falls. Incident: A rope frays and her phone battery dies.|deepens the conflict
      `,
      {
        "forces a decision": L(
          "迫使人物做出决定",
          "The incident puts a choice in front of a character, and whatever the character chooses will set the next events moving.",
          "这个事件把一个选择摆在人物面前，无论人物怎么选，都会推动接下来的事件。",
          "The incident does not put a choice in front of a character.",
          "这个事件并没有把一个选择摆在人物面前。",
        ),
        "reveals a character": L(
          "揭示人物性格",
          "The incident shows what the character is like, such as kind or generous, but it does not change the course of the plot.",
          "这个事件表现了人物的性格，如善良或慷慨，但并不改变情节的走向。",
          "The incident changes the course of the plot; it does more than show a trait.",
          "这个事件改变了情节的走向，不只是表现性格。",
        ),
        "deepens the conflict": L(
          "加深冲突",
          "The incident adds a new obstacle or danger, so the character's problem becomes harder to solve.",
          "这个事件增添了新的障碍或危险，人物的问题变得更难解决。",
          "The incident does not make the character's problem harder.",
          "这个事件并没有让人物的问题更难解决。",
        ),
      },
    ),
    label(
      "does-one-event-cause-the-next",
      ["Does One Event Cause the Next", "一个事件是否导致下一个"],
      [
        "A plot is more than one thing after another. In a tightly built story, an earlier event **causes** a later one: because Maya lies about her injury, she plays the final and hurts her knee worse. Some events only come **after** another in time without being caused by it. And sometimes the second event actually **came before** the first, and the story tells it out of order. Ask: could the second event have happened if the first had not?",
        "情节不只是一件事接着一件事。在结构紧凑的故事里，前面的事件**导致**后面的事件：因为玛雅隐瞒伤情，她参加了决赛，膝伤更重了。有些事件只是时间上**在后**，并非由前一个事件引起。有时第二个事件其实**发生在前**，只是故事不按顺序讲述。问一问：如果第一个事件没有发生，第二个事件还会发生吗？",
      ],
      ["How is the second event related to the first?", "第二个事件与第一个事件是什么关系？"],
      `
        First: Maya hides her injury from her coach. Second: Maya plays the final and hurts her knee worse.|caused by the first
        First: Maya hides her injury from her coach. Second: Later that month, the school repaints the gym.|only after it in time
        First: Maya hides her injury from her coach. Second: Maya had twisted her knee in practice the week before.|came before it
        First: The guard falls asleep at his post. Second: The prisoner slips out through the unlocked gate.|caused by the first
        First: The guard falls asleep at his post. Second: In the morning, the baker opens his shop across town.|only after it in time
        First: The guard falls asleep at his post. Second: The guard had worked three nights in a row without rest.|came before it
        First: Tom insults his best friend in front of the class. Second: His friend stops speaking to him.|caused by the first
        First: Tom insults his best friend in front of the class. Second: The bell rings for lunch.|only after it in time
        First: Tom insults his best friend in front of the class. Second: That morning, Tom had learned he failed his exam.|came before it
        First: The farmer sells his only horse. Second: He cannot plow his field in the spring.|caused by the first
        First: The farmer sells his only horse. Second: A comet is seen in the sky that winter.|only after it in time
        First: The farmer sells his only horse. Second: A dry summer had left him with no money for seed.|came before it
        First: The queen banishes her advisor. Second: With no one to warn her, she walks into the rebels' trap.|caused by the first
        First: The queen banishes her advisor. Second: Spring comes, and the palace gardens bloom.|only after it in time
        First: The queen banishes her advisor. Second: The advisor had openly mocked the queen at a feast.|came before it
        First: Jada finds a wallet full of cash. Second: She spends the afternoon tracking down its owner.|caused by the first
        First: Jada finds a wallet full of cash. Second: Her favorite show is on television that night.|only after it in time
        First: Jada finds a wallet full of cash. Second: An old man had dropped it while hurrying for a bus.|came before it
        First: The dam cracks during the storm. Second: The village below is flooded by morning.|caused by the first
        First: The dam cracks during the storm. Second: The next week, the school holds its spelling bee.|only after it in time
        First: The dam cracks during the storm. Second: Engineers had warned for years that the dam was weak.|came before it
        First: Ben lies about where he was on Friday night. Second: His story falls apart when a friend posts a photo.|caused by the first
        First: Ben lies about where he was on Friday night. Second: On Sunday it rains all day.|only after it in time
        First: Ben lies about where he was on Friday night. Second: On Friday night, Ben had sneaked out to a concert.|came before it
        First: The captain ignores the iceberg warning. Second: The ship strikes the ice at full speed.|caused by the first
        First: The captain ignores the iceberg warning. Second: Far away, a newspaper prints the price of wheat.|only after it in time
        First: The captain ignores the iceberg warning. Second: Earlier, the captain had promised to arrive a day early.|came before it
        First: Lena breaks her violin before the recital. Second: She has to borrow an old, out-of-tune violin.|caused by the first
        First: Lena breaks her violin before the recital. Second: The following summer, her family visits the coast.|only after it in time
        First: Lena breaks her violin before the recital. Second: She had practiced the piece every day for a year.|came before it
      `,
      {
        "caused by the first": L(
          "由第一个事件导致",
          "The second event happens because of the first; without the first, it would not have happened.",
          "第二个事件是因为第一个事件才发生的；没有第一个事件，它就不会发生。",
          "The first event does not cause the second.",
          "第一个事件并没有导致第二个事件。",
        ),
        "only after it in time": L(
          "只是时间在后",
          "The second event comes later, but it would have happened anyway; the first event did not cause it.",
          "第二个事件发生在后面，但无论如何都会发生；第一个事件并不是它的原因。",
          "The second event is not simply later and unconnected.",
          "第二个事件并不只是发生在后、互不相干。",
        ),
        "came before it": L(
          "发生在前",
          "The second event actually happened earlier and helps explain the first; the story tells it out of order.",
          "第二个事件其实发生得更早，有助于解释第一个事件；故事是倒叙讲出来的。",
          "The second event did not happen before the first.",
          "第二个事件并没有发生在第一个事件之前。",
        ),
      },
    ),
  ],
});

const dramaticIrony = topic("reading", {
  id: "dramatic-irony",
  title: ["Dramatic Irony", "戏剧性反讽"],
  summary: [
    "Dramatic irony is when the audience knows something a character does not, which can build suspense or humor.",
    "戏剧性反讽是观众知道某件事而人物不知道，它可以制造悬念或幽默。",
  ],
  after: ["irony", "parts-of-a-play"],
  points: [
    label(
      "who-knows-more",
      ["Who Knows More", "谁知道得更多"],
      [
        "In **dramatic irony**, the audience knows more than a character: we see the villain hide the poison, but the hero drinks. Writers can also do the opposite and keep the audience **in the dark**: a character knows a secret that we only learn later, which makes a mystery. Sometimes the audience and the character **know the same**, and we discover things together. Ask what you know at that moment, and what the character knows.",
        "在**戏剧性反讽**中，观众比人物知道得多：我们看到坏人藏起了毒药，主人公却喝了下去。作家也可以反过来，让观众**蒙在鼓里**：人物知道一个秘密，我们后来才知道，这就形成了悬疑。有时观众和人物**知道得一样多**，一起发现真相。问问自己：此刻你知道什么，人物又知道什么？",
      ],
      ["In this scene, who knows more?", "在这个场景中，谁知道得更多？"],
      `
        We watch the thief hide the necklace in the maid's bag. The maid packs her bag, humming happily.|the audience knows more
        The detective smiles and says she knows who the thief is, but the chapter ends before she says the name.|the character knows more
        The hikers hear a strange noise in the woods, and we hear it with them, not knowing what it is.|both know the same
        We know the birthday party is a surprise; the birthday girl walks home thinking everyone forgot her.|the audience knows more
        The old sailor tells the boy he has a reason for never going to sea again, but he will not say what it is.|the character knows more
        A letter arrives, and the girl opens it as we read over her shoulder for the first time.|both know the same
        We saw the twin brothers swap places; the teacher scolds the wrong twin for the broken window.|the audience knows more
        The spy reads a coded message, nods, and burns it without telling us what it said.|the character knows more
        The lights go out in the house, and the family and the reader wait in the dark together.|both know the same
        We know the bridge was cut in the night; the messenger gallops toward it at full speed.|the audience knows more
        The grandmother hides a key in her apron and says, "You will understand one day."|the character knows more
        The class opens the time capsule, and the reader learns what is inside as they do.|both know the same
        We know the prince is in disguise; the innkeeper complains to him about the prince.|the audience knows more
        The captain studies the map, grows pale, and orders the ship to turn around without explaining.|the character knows more
        The friends knock on the old door, and neither they nor we know who will answer.|both know the same
        We know the letter was forged; the father reads it and disowns his son.|the audience knows more
        The new student keeps glancing at the clock as if she knows something will happen at noon.|the character knows more
        The doctor reads the test results aloud, and the patient and the reader hear them at the same moment.|both know the same
        We saw the villain loosen the wheel; the family sets off cheerfully in the carriage.|the audience knows more
        The magician says the trick has a simple secret, and he leaves the stage without revealing it.|the character knows more
        The storm hits, and the crew and the reader learn together how bad the damage is.|both know the same
        We know the girl's dog is safe at the neighbor's; she searches the streets, sobbing.|the audience knows more
        The witness says she saw everything that night, but she refuses to speak until the trial.|the character knows more
        The team watches the scoreboard as the last result is posted, and the reader learns it too.|both know the same
        We know the "ghost" is the boys in a sheet; the nervous uncle locks himself in the cellar.|the audience knows more
        The prisoner smiles at his guards as if he already has a way out, but we are not told what it is.|the character knows more
        The explorers step into the cave, and the reader sees the paintings on the wall with them.|both know the same
        We know Romeo believes Juliet is dead, though she is only asleep; he raises the poison.|the audience knows more
        The inventor locks his notebook away and says no one must ever read page twelve.|the character knows more
        The judge opens the envelope and announces the winner as the reader learns it.|both know the same
      `,
      {
        "the audience knows more": L(
          "观众知道得更多",
          "We have been shown something the character has not, so we watch the character act without knowing it: dramatic irony.",
          "我们看到了人物没看到的事，所以看着人物在不知情的情况下行动：这就是戏剧性反讽。",
          "The audience has not been shown anything the character does not know.",
          "观众并没有看到人物不知道的事情。",
        ),
        "the character knows more": L(
          "人物知道得更多",
          "The character holds a secret that the writer keeps from us, which makes a mystery rather than dramatic irony.",
          "人物掌握着作者向我们隐瞒的秘密，这形成的是悬疑，而不是戏剧性反讽。",
          "No character here is keeping a secret from the audience.",
          "这里没有人物对观众隐瞒秘密。",
        ),
        "both know the same": L(
          "知道得一样多",
          "The audience and the character discover things at the same moment, so neither knows more.",
          "观众和人物同时发现真相，谁也没有知道得更多。",
          "One side here knows something the other does not.",
          "这里有一方知道另一方不知道的事情。",
        ),
      },
    ),
    label(
      "what-the-irony-creates",
      ["What the Irony Creates", "反讽产生什么效果"],
      [
        "Dramatic irony works on our feelings. When a character walks toward danger we can see, it creates **suspense**: we want to shout a warning. When a character's ignorance leads to a silly mistake, such as praising the person he is secretly insulting, it creates **humor**. And when we know a terrible truth the character does not, such as that a loved one is already lost, it creates **sorrow**: we feel the coming grief before the character does.",
        "戏剧性反讽作用于我们的情感。当人物走向我们看得见的危险时，它制造**悬念**：我们想大喊着提醒他。当人物因不知情而犯下可笑的错误，比如当面称赞他暗中嘲笑的人，它制造**幽默**。当我们知道一个人物不知道的可怕真相，比如他所爱的人已经不在了，它引起**悲伤**：我们比人物更早感受到即将到来的悲痛。",
      ],
      ["What does the dramatic irony in this scene mainly create?", "这个场景中的戏剧性反讽主要产生什么效果？"],
      `
        We know a bomb is under the table; the two men chat about the weather.|suspense
        We know the "rich stranger" is the butler in a borrowed coat; the snobbish lady curtsies to him again and again.|humor
        We know the soldier's son died in battle; the soldier writes him a cheerful letter about coming home.|sorrow
        We know the wolf is hiding behind the door; the girl reaches for the handle.|suspense
        We know the cake is made of salt, not sugar; the proud cook serves it to the king with a bow.|humor
        We know the ship has sunk; the wife sets the table for her husband's return.|sorrow
        We know the floor of the old barn is rotten; the boy steps toward the center.|suspense
        We know the new teacher is the boy's mother in disguise; he boasts to her that his mother lets him do anything.|humor
        We know the old dog will not survive the winter; the girl plans its birthday for the spring.|sorrow
        We know the killer is in the back seat; the driver hums along to the radio.|suspense
        We know the parrot repeats everything; the guest whispers an insult about the host right next to it.|humor
        We know the letter of pardon arrived too late; the prisoner's family celebrates the news.|sorrow
        We know the guards are waiting at the gate; the escaped prisoner runs straight toward it.|suspense
        We know the "ghost" is a goat; the knight draws his sword and challenges it to a duel.|humor
        We know the soldier will not return; his little brother saves his best marbles to show him.|sorrow
        We know the ice is thin; the skater glides out to the middle of the pond.|suspense
        We know the duke wrote the love letter himself; he mocks the poor fool who must have written it.|humor
        We know the old house was sold this morning; the grandfather plans where to plant next year's roses.|sorrow
        We know the snake is in the boot; the farmer sits down to pull it on.|suspense
        We know the twins have switched coats; the aunt praises each one for the other's good deed.|humor
        We know the girl's best friend is moving away tomorrow; she talks happily about their plans for the summer.|sorrow
        We know the poison is in the cup; the queen raises it to drink a toast.|suspense
        We know the professor's notes are upside down; he reads the lecture with great confidence.|humor
        We know the mother has already died; the son hurries home with the medicine.|sorrow
        We know the bridge has been weakened; the whole army begins to cross.|suspense
        We know the fish he is boasting about came from the market; the fisherman describes his heroic catch.|humor
        We know the pet rabbit escaped; the little boy leaves a carrot by its empty cage.|sorrow
        We know the trapdoor is open; the detective backs toward it in the dark.|suspense
        We know the noise is the cat; the burglars flee in terror, leaving their loot behind.|humor
        We know the lighthouse keeper is lost at sea; his daughter lights the lamp to guide him home.|sorrow
      `,
      {
        suspense: L(
          "悬念",
          "The character moves toward a danger we can see, so we wait anxiously to learn whether harm will come.",
          "人物走向我们看得见的危险，所以我们焦急地等待，想知道是否会出事。",
          "No danger here threatens the character in a way that keeps us anxious.",
          "这里没有让我们焦虑不安的、威胁人物的危险。",
        ),
        humor: L(
          "幽默",
          "The character's ignorance leads to a foolish or awkward mistake, and we laugh because we see the truth.",
          "人物的不知情导致了愚蠢或尴尬的错误，我们因为看清真相而发笑。",
          "The character's mistake here is not a funny one.",
          "这里人物的错误并不好笑。",
        ),
        sorrow: L(
          "悲伤",
          "We know of a loss the character has not yet learned about, so their hope makes us feel their coming grief.",
          "我们知道一个人物尚未得知的失去，所以他的希望让我们感受到他即将到来的悲痛。",
          "The scene does not hide a loss that has already happened.",
          "这个场景并没有隐藏一个已经发生的失去。",
        ),
      },
    ),
  ],
});

const paragraph = topic("reading", {
  id: "how-a-paragraph-is-built",
  title: ["How a Paragraph Is Built", "段落是如何构成的"],
  summary: [
    "In a well-built paragraph each sentence has a job: a topic sentence states the key idea, details develop it, and a closing sentence ends or links it.",
    "在结构良好的段落中，每个句子都有自己的作用：主题句提出要点，细节句展开它，结尾句收束或过渡。",
  ],
  after: ["how-sections-of-a-text-work-together", "main-idea"],
  points: [
    label(
      "the-job-of-the-sentence",
      ["The Job of the Sentence", "句子的作用"],
      [
        "A paragraph of explanation is built from sentences with different jobs. The **topic sentence** states the key idea in general words: *Steam engines changed how factories were built.* **Supporting details** give the examples, facts and reasons that develop it: *Mills no longer had to stand beside rivers.* A **closing sentence** sums up the idea or links it to the next paragraph: *This freedom soon changed the shape of whole cities.*",
        "说明性的段落由作用不同的句子组成。**主题句**用概括的话提出要点：*Steam engines changed how factories were built.* **支持细节**给出展开要点的例子、事实和理由：*Mills no longer had to stand beside rivers.* **结尾句**总结要点或连接下一段：*This freedom soon changed the shape of whole cities.*",
      ],
      ["What is the job of this sentence in its paragraph?", "这个句子在段落中起什么作用？"],
      `
        In a paragraph about steam engines: Steam engines changed where factories could be built.|topic sentence
        In a paragraph about steam engines: Before steam, a mill had to stand beside a fast river to turn its wheel.|supporting detail
        In a paragraph about steam engines: This freedom would soon reshape whole cities, as the next section shows.|closing sentence
        In a paragraph about early computers: The first computers were enormous machines.|topic sentence
        In a paragraph about early computers: ENIAC, built in 1945, filled a room and weighed about thirty tonnes.|supporting detail
        In a paragraph about early computers: Only decades later would computers shrink enough to sit on a desk.|closing sentence
        In a paragraph about the printing press: The printing press made books far cheaper.|topic sentence
        In a paragraph about the printing press: A hand-copied Bible could take a monk a year to finish.|supporting detail
        In a paragraph about the printing press: Cheaper books, in turn, meant that more people learned to read.|closing sentence
        In a paragraph about railways: Railways shrank the distances between towns.|topic sentence
        In a paragraph about railways: A journey from London to Manchester fell from two days by coach to five hours by train.|supporting detail
        In a paragraph about railways: In short, the railway changed what people meant by "far away."|closing sentence
        In a paragraph about the telegraph: The telegraph let news travel faster than any horse.|topic sentence
        In a paragraph about the telegraph: In 1858, a cable under the Atlantic carried a message from Britain to America in hours.|supporting detail
        In a paragraph about the telegraph: Newspapers would never be the same again.|closing sentence
        In a paragraph about sewing machines: The sewing machine transformed the making of clothes.|topic sentence
        In a paragraph about sewing machines: A shirt that took fourteen hours to sew by hand took about one hour by machine.|supporting detail
        In a paragraph about sewing machines: Clothing became something ordinary families could afford to replace.|closing sentence
        In a paragraph about the light bulb: Electric light changed the rhythm of daily life.|topic sentence
        In a paragraph about the light bulb: Factories could now run night shifts without the danger of gas lamps.|supporting detail
        In a paragraph about the light bulb: Night, for the first time, became a time for work as well as rest.|closing sentence
        In a paragraph about the microchip: The microchip packed thousands of switches into a tiny space.|topic sentence
        In a paragraph about the microchip: A chip from 1971 held about 2,300 transistors on a sliver smaller than a fingernail.|supporting detail
        In a paragraph about the microchip: That tiny sliver led directly to the computers in our pockets today.|closing sentence
        In a paragraph about the cotton gin: The cotton gin made cleaning cotton far faster.|topic sentence
        In a paragraph about the cotton gin: One worker with a gin could clean fifty pounds of cotton a day instead of one.|supporting detail
        In a paragraph about the cotton gin: Yet, as we will see next, this speed had a terrible human cost.|closing sentence
        In a paragraph about the bicycle: The bicycle gave ordinary people a new freedom to travel.|topic sentence
        In a paragraph about the bicycle: Workers could now live miles from the factory and still arrive on time.|supporting detail
        In a paragraph about the bicycle: For many, the bicycle was their first taste of independence.|closing sentence
      `,
      {
        "topic sentence": L(
          "主题句",
          "The sentence states the key idea of the paragraph in general words; the other sentences develop it.",
          "这个句子用概括的话提出段落的要点，其他句子展开它。",
          "The sentence is too specific or too final to state the paragraph's key idea.",
          "这个句子太具体或太像结尾，不能提出段落的要点。",
        ),
        "supporting detail": L(
          "支持细节",
          "The sentence gives a specific example, fact or number that develops the key idea.",
          "这个句子给出具体的例子、事实或数字来展开要点。",
          "The sentence gives no specific example, fact or number.",
          "这个句子没有给出具体的例子、事实或数字。",
        ),
        "closing sentence": L(
          "结尾句",
          "The sentence sums up the idea or looks ahead to what comes next, so it ends the paragraph or links it to the next.",
          "这个句子总结要点或展望后文，所以它结束本段或连接下一段。",
          "The sentence does not sum up the paragraph or point ahead.",
          "这个句子既没有总结本段，也没有展望后文。",
        ),
      },
    ),
    label(
      "how-the-idea-is-developed",
      ["How the Idea Is Developed", "要点是如何展开的"],
      [
        "After the topic sentence, a writer can develop the idea in different ways. **Examples** name particular cases: *Watt's engine, the spinning jenny and the power loom all...* A **comparison** sets two things side by side to show a likeness or difference: *Unlike a horse, a steam engine never tired.* **Steps in order** walk through a process: *First the water is heated; then the steam pushes a piston...* Look at what the sentences after the topic sentence do.",
        "提出主题句后，作者可以用不同的方式展开要点。**举例**指出具体的事例：*Watt's engine, the spinning jenny and the power loom all...* **比较**把两件事物并列，显示相同点或不同点：*Unlike a horse, a steam engine never tired.* **按顺序的步骤**逐步讲解一个过程：*First the water is heated; then the steam pushes a piston...* 看一看主题句后面的句子在做什么。",
      ],
      ["How does this paragraph develop its key idea?", "这个段落是如何展开要点的？"],
      `
        Many inventions of the 1700s used water power. The spinning frame ran on a water wheel. So did the first cotton mills and many iron works.|examples
        A steam engine was a better servant than a horse. A horse tired after a few hours, but an engine could run all day. A horse needed a field to graze; an engine needed only coal.|a comparison
        A steam engine turns heat into motion. First, coal heats water in a boiler. The steam then pushes a piston. Finally, the piston turns a wheel.|steps in order
        Early computers were used for many serious tasks. They calculated the paths of shells. They counted the census. They even predicted the weather.|examples
        A modern phone outdoes the computers of the 1960s. Those machines filled rooms; the phone fits in a pocket. They cost millions; the phone costs a few hundred dollars.|a comparison
        Sending an email takes several stages. You type the message and press send. The message is broken into small packets. The packets travel separately and are rebuilt at the other end.|steps in order
        Railways carried far more than passengers. Coal rode in open wagons. Fresh milk reached cities overnight. Mail, cattle and newspapers all went by train.|examples
        Travel by canal and travel by rail were very different. A canal boat moved at walking pace, while a train ran at thirty miles an hour. Canals froze in winter; railways ran all year.|a comparison
        Making paper by machine is a careful process. Wood is ground into pulp. The pulp is spread thin on a moving screen. Rollers then press and dry it into sheets.|steps in order
        Electricity changed the home in countless ways. Lamps replaced candles. Irons no longer had to be heated on a stove. Radios brought music into the kitchen.|examples
        A typewriter and a pen produce writing in different ways. A pen depends on the writer's hand, while a typewriter makes every letter the same. A pen is quiet, but a typewriter clatters.|a comparison
        A photograph was once made in several steps. The photographer coated a glass plate with chemicals. Then the plate was exposed in the camera. Last, it was developed in a dark room.|steps in order
        Factories brought new dangers to workers. Children lost fingers in looms. Miners breathed coal dust. Boilers sometimes exploded.|examples
        The telephone and the telegraph both sent messages by wire, but they differed. The telegraph sent coded clicks, while the telephone carried the human voice. Only trained clerks could use the telegraph.|a comparison
        Building a steam locomotive followed a set order. Workers first built the frame. Next they mounted the boiler on it. Finally they fixed the wheels and tested the engine on a track.|steps in order
        The age of machines brought new kinds of jobs. There were engine drivers and telegraph clerks. There were mechanics and factory inspectors.|examples
        Hand weaving and power weaving produced cloth at very different speeds. A hand weaver made a few yards a day, while a power loom made many times that. The machine also never needed rest.|a comparison
        A computer program runs in steps. The computer reads an instruction. It carries out that instruction. Then it moves on to the next one, millions of times a second.|steps in order
        Many machines were invented to save labor on farms. The reaper cut grain. The thresher separated the seeds. The tractor replaced teams of horses.|examples
        Gas lamps and electric lights both lit the streets, but electric light was safer. Gas lamps could leak and explode, while bulbs could not. Electric light was also brighter.|a comparison
        A printing press of the 1800s made a page in stages. A worker inked the type. A sheet of paper was laid on top. The press then squeezed the paper against the type.|steps in order
        Inventors often improved on earlier machines. Watt improved Newcomen's engine. Edison improved earlier light bulbs. Bell built on the work of telegraph makers.|examples
        Steamships and sailing ships crossed the ocean in different ways. A sailing ship depended on the wind, while a steamship could sail straight into it. Steamships kept to timetables; sailing ships could not.|a comparison
        A cotton mill turned raw cotton into thread in stages. First, machines cleaned and combed the cotton. Next, it was drawn out into a loose rope. Finally, spinning machines twisted it into thread.|steps in order
        Some machines changed how people spent their free time. The bicycle took families into the countryside. The camera let them keep pictures of holidays. The gramophone filled parlors with music.|examples
        A hand-cranked engine and an electric starter both start a car, but one is far easier. Cranking took strength and could break an arm, while a starter needed only a button.|a comparison
        Smelting iron followed a set order. Iron ore and coke were loaded into a furnace. Air was blasted in to make the fire hotter. The melted iron then ran out into molds.|steps in order
        Computers now help in many fields. Doctors use them to read scans. Pilots use them to steer planes. Scientists use them to model the climate.|examples
        Old mills and modern factories differ in how they are powered. Old mills relied on a single wheel or engine, while modern factories give each machine its own electric motor.|a comparison
        A letter by post traveled in stages. It was dropped in a box and collected. It was sorted at the post office. Then it was carried by train and delivered by hand.|steps in order
      `,
      {
        examples: L(
          "举例",
          "The sentences after the topic sentence name several particular cases that show the key idea.",
          "主题句后面的句子列举了几个具体事例来说明要点。",
          "The paragraph does not develop its idea by listing particular cases.",
          "这个段落不是通过列举具体事例来展开要点的。",
        ),
        "a comparison": L(
          "比较",
          "The sentences set two things side by side, often with words like *unlike*, *while* or *but*, to show how they differ or match.",
          "这些句子把两件事物并列，常用 *unlike*、*while* 或 *but* 等词，表明它们的不同或相同。",
          "The paragraph does not set two things side by side.",
          "这个段落没有把两件事物并列比较。",
        ),
        "steps in order": L(
          "按顺序的步骤",
          "The sentences walk through a process one stage at a time, often with words like *first*, *next* and *finally*.",
          "这些句子一步一步讲解一个过程，常用 *first*、*next*、*finally* 等词。",
          "The paragraph does not walk through a process in order.",
          "这个段落没有按顺序讲解一个过程。",
        ),
      },
    ),
  ],
});

const accounts = topic("reading", {
  id: "conflicting-accounts-of-one-event",
  title: ["Conflicting Accounts of One Event", "对同一事件的不同记述"],
  summary: [
    "Two accounts of the same event can disagree on the facts or on what they mean, often because of where the writers stood or whose side they were on.",
    "对同一事件的两份记述可能在事实上或对事实的解释上存在分歧，原因往往是作者的位置或立场不同。",
  ],
  after: ["comparing-texts-on-a-topic", "primary-and-secondary-sources"],
  points: [
    label(
      "where-they-disagree",
      ["Where They Disagree", "分歧在哪里"],
      [
        "When two accounts of one event differ, ask what kind of difference it is. Some accounts **disagree on a fact**: one says forty sailors died, the other four hundred. Others agree on the facts but **disagree on what they mean**: both say the captain turned back, but one calls it wise and the other cowardly. And sometimes the two accounts, though worded differently, actually **agree**.",
        "两份记述不一致时，要问是哪一种分歧。有些记述**在事实上有分歧**：一份说四十名水手死亡，另一份说四百名。有些在事实上一致，却**在意义上有分歧**：两份都说船长掉头返航，一份称之为明智，另一份称之为懦弱。有时两份记述措辞不同，其实**意见一致**。",
      ],
      ["How do the two accounts differ?", "这两份记述有什么不同？"],
      `
        A: The storm sank three of the fleet's ships. B: The storm sank seven of the fleet's ships.|disagree on a fact
        A: The captain turned back, and his caution saved the crew. B: The captain turned back, and his fear cost them the prize.|disagree on what it means
        A: The ship reached the island on the fifth of May. B: On May 5, the vessel arrived at the island.|agree
        A: The crew mutinied in the second month of the voyage. B: The crew mutinied in the sixth month of the voyage.|disagree on a fact
        A: The explorers traded knives for food, a fair exchange. B: The explorers traded knives for food, cheating people who did not know their value.|disagree on what it means
        A: Magellan was killed in a battle in the Philippines. B: Magellan died fighting on a Philippine island.|agree
        A: Only eighteen men returned from the voyage. B: More than two hundred men returned from the voyage.|disagree on a fact
        A: The king paid for the voyage, a generous act of faith. B: The king paid for the voyage, hoping only to fill his treasury.|disagree on what it means
        A: The fire started in the ship's kitchen. B: Flames first broke out where the cook prepared meals.|agree
        A: The first shot was fired by the soldiers. B: The first shot was fired by the crowd.|disagree on a fact
        A: The soldiers fired into the crowd, a brutal massacre. B: The soldiers fired into the crowd, defending themselves from a mob.|disagree on what it means
        A: Five people died in the street that night. B: That night, five lives were lost in the street.|agree
        A: The expedition reached the pole in December. B: The expedition never reached the pole at all.|disagree on a fact
        A: The explorer left his sick companion behind, a sensible choice. B: The explorer left his sick companion behind, a betrayal.|disagree on what it means
        A: The ice trapped the ship for ten months. B: For ten months, the ship was frozen in place.|agree
        A: The treaty was signed by both chiefs. B: Only one chief ever signed the treaty.|disagree on a fact
        A: The settlers built a fort on the hill, to protect their families. B: The settlers built a fort on the hill, to control land that was not theirs.|disagree on what it means
        A: The fort was finished in the spring of 1608. B: Work on the fort ended in spring 1608.|agree
        A: The guide led them through the pass in two days. B: The guide led them through the pass in two weeks.|disagree on a fact
        A: The guide refused to go on, wisely fearing the snow. B: The guide refused to go on, abandoning those who had paid him.|disagree on what it means
        A: The party crossed the river at dawn. B: At first light, the group forded the river.|agree
        A: The landing party was greeted with gifts. B: The landing party was greeted with arrows.|disagree on a fact
        A: The admiral burned the enemy fleet, a brilliant victory. B: The admiral burned the enemy fleet, a cruel act that killed many prisoners.|disagree on what it means
        A: The battle lasted from noon until dark. B: Fighting went on from midday until night fell.|agree
        A: The map was drawn by the captain himself. B: The map was copied from an older Arab chart.|disagree on a fact
        A: The colony was abandoned, a sad failure. B: The colony was abandoned, a wise retreat that saved lives.|disagree on what it means
        A: The colonists left in the summer of 1590. B: In summer 1590, the colonists departed.|agree
        A: The voyage took three years. B: The voyage took one year.|disagree on a fact
        A: The sailors brought home new foods, a great gift to Europe. B: The sailors brought home new foods, taken from people they had conquered.|disagree on what it means
        A: Columbus sailed with three ships. B: Three vessels made up Columbus's fleet.|agree
      `,
      {
        "disagree on a fact": L(
          "在事实上有分歧",
          "The accounts give different facts, such as numbers, dates or who did what; at least one of them must be wrong.",
          "两份记述给出的事实不同，如数字、日期或谁做了什么；至少有一份是错的。",
          "The accounts do not give different facts.",
          "两份记述给出的事实并没有不同。",
        ),
        "disagree on what it means": L(
          "在意义上有分歧",
          "The accounts report the same facts but judge or explain them differently.",
          "两份记述报告的事实相同，但对事实的评判或解释不同。",
          "The accounts do not judge the same facts in different ways.",
          "两份记述并没有对相同的事实做出不同的评判。",
        ),
        agree: L(
          "意见一致",
          "The accounts use different words but report the same facts and the same view of them.",
          "两份记述措辞不同，但报告的事实和看法相同。",
          "The accounts do not say the same thing.",
          "两份记述说的并不是同一回事。",
        ),
      },
    ),
    label(
      "why-the-accounts-differ",
      ["Why the Accounts Differ", "记述为什么不同"],
      [
        "Accounts of one event differ for reasons we can often find. Writers saw it from **different places**: a sailor below deck and an officer on the bridge did not see the same things. They had **different loyalties**: an officer writing to defend himself, or a reporter from the enemy side, may shade the story. And they wrote at **different times**: an account written that night is fresher than one remembered forty years later.",
        "对同一事件的记述不同，原因往往可以找到。作者是从**不同的位置**看到的：在甲板下的水手和在舰桥上的军官看到的不一样。他们有**不同的立场**：为自己辩护的军官或敌方的记者，可能会歪曲事实。他们还在**不同的时间**写作：当晚写的记述比四十年后的回忆更鲜活准确。",
      ],
      ["What best explains why these accounts might differ?", "什么最能解释这两份记述为何不同？"],
      `
        One account was written by a sailor below deck, the other by the captain on the bridge.|different places
        One account was written by the captain, who was later put on trial for losing the ship.|different loyalties
        One account was a diary entry made that night; the other was told to a grandchild fifty years later.|different times
        One witness stood at the front of the crowd; the other watched from a window down the street.|different places
        One report was printed in a newspaper owned by the general's political party.|different loyalties
        One letter was written the day after the battle; the other was a memoir written in old age.|different times
        One soldier fought on the left side of the field, the other on the right.|different places
        One account was written by the explorer, hoping to raise money for his next voyage.|different loyalties
        One map was drawn during the voyage; the other was drawn years later from memory.|different times
        One guard was posted at the gate; the other was inside the palace.|different places
        One history was written by the winning side; the other by the side that lost the war.|different loyalties
        One survivor spoke to reporters the next morning; another spoke to a historian decades later.|different times
        One observer was on the shore; the other was on board the sinking ship.|different places
        One account was written by a merchant who profited from the trade.|different loyalties
        One log entry was written as the storm raged; the other was a summary written at the next port.|different times
        One villager saw the landing from the beach; another saw it from the hills above.|different places
        One letter was written by an officer trying to excuse his own mistakes.|different loyalties
        One account was a telegram sent that hour; the other was a speech given twenty years later.|different times
        One miner was trapped deep in the tunnel; the other worked at the entrance.|different places
        One statement came from the company that owned the mine.|different loyalties
        One witness wrote her statement that evening; another was first questioned months later.|different times
        One sailor was in the crow's nest; the other was in the ship's hold.|different places
        One report was written by a spy paid by the rival king.|different loyalties
        One newspaper story was printed the next day; the other was a book written after the war.|different times
        One reporter watched the parade from the front row; the other from a rooftop.|different places
        One account was written by the son of the man accused of starting the fire.|different loyalties
        One description was sketched at the scene; the other was painted in a studio years afterward.|different times
        One passenger was in the first-class cabins; the other was in third class far below.|different places
        One speech was given by a leader who needed the people's votes.|different loyalties
        One story was told the week of the flood; the other was a legend passed down for generations.|different times
      `,
      {
        "different places": L(
          "位置不同",
          "The writers saw the event from different spots, so each saw only part of what happened.",
          "作者是从不同的地方看到事件的，所以每人只看到了一部分。",
          "The detail given is not about where the writers stood.",
          "这里给出的细节与作者的位置无关。",
        ),
        "different loyalties": L(
          "立场不同",
          "A writer had a side to take or something to gain, which may shade how the event is told.",
          "作者有自己的立场或利益，这可能影响事件的讲述方式。",
          "The detail given is not about a writer's side or interest.",
          "这里给出的细节与作者的立场或利益无关。",
        ),
        "different times": L(
          "时间不同",
          "One account was written soon after and the other much later, when memory may have faded or changed.",
          "一份记述写于事后不久，另一份写于很久以后，那时记忆可能已经模糊或改变。",
          "The detail given is not about when the accounts were written.",
          "这里给出的细节与记述写成的时间无关。",
        ),
      },
    ),
  ],
});

const foundingDocument = topic("reading", {
  id: "reading-a-founding-document",
  title: ["Reading a Founding Document", "阅读建国文献"],
  summary: [
    "Founding documents declare principles, list complaints and set up how a government works; their formal language can be turned into plain words.",
    "建国文献宣告原则、列举不满并规定政府如何运作；可以把它们正式的语言转换成平实的话。",
  ],
  after: ["primary-and-secondary-sources", "context-clues"],
  points: [
    label(
      "what-the-passage-does",
      ["What the Passage Does", "这段文字起什么作用"],
      [
        "Founding documents, such as declarations, charters and constitutions, are built from passages with different jobs. Some **declare a principle**, a belief about rights or about where power comes from: *all men are created equal*. Some **list a complaint** against a ruler: *He has refused his assent to laws*. Others **set up a rule of government**, saying who holds a power and how it is used: *The Senate shall be composed of two senators from each state*.",
        "宣言、宪章和宪法等建国文献由作用不同的段落组成。有些**宣告原则**，即关于权利或权力来源的信念：*all men are created equal*。有些**列举对统治者的不满**：*He has refused his assent to laws*。还有些**规定政府的规则**，说明谁掌握某种权力以及如何使用：*The Senate shall be composed of two senators from each state*。",
      ],
      ["What does this passage from a founding document do?", "这段建国文献的文字起什么作用？"],
      `
        We hold these truths to be self-evident, that all men are created equal.|declares a principle
        He has refused his assent to laws, the most wholesome and necessary for the public good.|lists a complaint
        The Senate of the United States shall be composed of two senators from each state.|sets up a rule of government
        Governments are instituted among men, deriving their just powers from the consent of the governed.|declares a principle
        He has kept among us, in times of peace, standing armies without the consent of our legislatures.|lists a complaint
        The President shall be commander in chief of the army and navy.|sets up a rule of government
        Men are born and remain free and equal in rights.|declares a principle
        He has cut off our trade with all parts of the world.|lists a complaint
        All bills for raising revenue shall originate in the House of Representatives.|sets up a rule of government
        The aim of every political association is the preservation of the natural rights of man.|declares a principle
        He has imposed taxes on us without our consent.|lists a complaint
        Each house shall keep a journal of its proceedings.|sets up a rule of government
        Liberty consists in the freedom to do everything which injures no one else.|declares a principle
        He has deprived us, in many cases, of the benefits of trial by jury.|lists a complaint
        The judges shall hold their offices during good behavior.|sets up a rule of government
        No free man shall be seized or imprisoned except by the lawful judgment of his equals.|declares a principle
        He has dissolved representative houses repeatedly.|lists a complaint
        A person must be thirty-five years old to be eligible for the office of President.|sets up a rule of government
        Everyone has the right to life, liberty and security of person.|declares a principle
        He has plundered our seas, ravaged our coasts, burnt our towns.|lists a complaint
        Congress shall assemble at least once in every year.|sets up a rule of government
        The law is the expression of the general will.|declares a principle
        He has obstructed the administration of justice.|lists a complaint
        The President shall hold his office during the term of four years.|sets up a rule of government
        No one shall be held in slavery or servitude.|declares a principle
        He has sent swarms of officers to harass our people.|lists a complaint
        The vice president shall be president of the Senate.|sets up a rule of government
        Whenever any form of government becomes destructive of these ends, it is the right of the people to alter or to abolish it.|declares a principle
        He has made judges dependent on his will alone.|lists a complaint
        Representatives shall be chosen every second year by the people of the several states.|sets up a rule of government
      `,
      {
        "declares a principle": L(
          "宣告原则",
          "The passage states a general belief about rights, freedom or where a government's power comes from.",
          "这段文字陈述了关于权利、自由或政府权力来源的普遍信念。",
          "The passage is not a general belief about rights or power.",
          "这段文字不是关于权利或权力的普遍信念。",
        ),
        "lists a complaint": L(
          "列举不满",
          "The passage accuses a ruler, usually *he*, of a particular wrong done to the people.",
          "这段文字指控统治者（通常是 *he*）对人民犯下的某一具体过错。",
          "The passage does not accuse a ruler of a wrong.",
          "这段文字并没有指控统治者的过错。",
        ),
        "sets up a rule of government": L(
          "规定政府的规则",
          "The passage says who holds a power, how officials are chosen or how the government must work, often with *shall*.",
          "这段文字规定谁掌握某种权力、官员如何产生或政府必须如何运作，常用 *shall*。",
          "The passage does not set out how the government works.",
          "这段文字并没有规定政府如何运作。",
        ),
      },
    ),
    label(
      "the-plain-meaning",
      ["The Plain Meaning", "平实的意思"],
      [
        "The language of old documents is formal, but its key words can be decoded. **Consent of the governed** means the people's agreement. **Unalienable** rights are rights that cannot be taken away or given up. **Usurpations** are powers seized without the right to them. **Redress** is a fix for a wrong. Read the phrase in its sentence, look for familiar roots, then put it in your own plain words.",
        "旧文献的语言很正式，但其中的关键词可以解读。**consent of the governed** 指人民的同意。**unalienable** 权利是不能被剥夺或放弃的权利。**usurpations** 是无权而夺取的权力。**redress** 是对过错的补救。把短语放在句子中读，寻找熟悉的词根，然后用自己平实的话说出来。",
      ],
      ["What does the phrase in italics mean?", "斜体短语是什么意思？"],
      `
        Rights that are *unalienable* belong to every person.|cannot be taken away
        Just powers come from *the consent of the governed*.|the agreement of the people
        The king's long train of *usurpations* angered the colonies.|powers seized without right
        We have petitioned for *redress* in the most humble terms.|a fix for a wrong
        It is their right to *abolish* a destructive government.|end it completely
        The colonies *declare* themselves free and independent states.|announce openly
        A *decent respect to the opinions of mankind* requires them to explain.|care for what other people think
        The people may *alter* their government.|change
        He has *refused his assent* to laws.|would not agree
        Among these rights are life, liberty and *the pursuit of happiness*.|the freedom to seek a good life
        We *mutually pledge* to each other our lives.|promise one another
        He has *quartered* large bodies of troops among us.|made people house
        A *tyrant* is unfit to be the ruler of a free people.|a cruel ruler with total power
        We, the people, in order to *form a more perfect union*...|join together more closely
        ...to *establish justice*...|set up fair laws and courts
        ...to *insure domestic tranquility*...|keep peace at home
        ...to *provide for the common defense*...|protect the country together
        ...to *promote the general welfare*...|help everyone live well
        ...and *secure the blessings of liberty* to ourselves and our posterity.|keep freedom safe
        ...to ourselves and our *posterity*.|the generations to come
        Congress shall make no law *abridging* the freedom of speech.|limiting
        The people have the right *peaceably to assemble*.|to gather without violence
        The right to *petition the government* shall not be denied.|ask the government formally
        Excessive *bail* shall not be required.|money paid to be let out before trial
        Nor shall *cruel and unusual punishments* be inflicted.|harsh and strange penalties
        No person shall be *deprived of life, liberty, or property* without due process.|have taken away
        ...without *due process of law*.|fair legal steps
        The accused shall enjoy the right to a *speedy and public trial*.|a quick trial open to all
        Private property shall not be taken for public use without *just compensation*.|fair payment
        Powers not *delegated* to the United States are reserved to the states.|handed over
      `,
      {
        "cannot be taken away": L(
          "不能被剥夺的",
          "*Unalienable* rights cannot be taken away or given up.",
          "*unalienable* 权利是不能被剥夺或放弃的。",
          "The phrase does not mean that something cannot be taken away.",
          "这个短语的意思不是不能被剥夺。",
        ),
        "the agreement of the people": L(
          "人民的同意",
          "*Consent* is agreement, and *the governed* are the people a government rules.",
          "*consent* 是同意，*the governed* 是被统治的人民。",
          "The phrase is not about the people's agreement.",
          "这个短语与人民的同意无关。",
        ),
        "powers seized without right": L(
          "无权而夺取的权力",
          "To *usurp* is to take a power one has no right to.",
          "*usurp* 是夺取无权拥有的权力。",
          "The phrase is not about powers seized without right.",
          "这个短语与无权夺取的权力无关。",
        ),
        "a fix for a wrong": L(
          "对过错的补救",
          "*Redress* is setting right a wrong that was done.",
          "*redress* 是纠正已经造成的过错。",
          "The phrase does not mean a fix for a wrong.",
          "这个短语的意思不是对过错的补救。",
        ),
        "end it completely": L(
          "彻底废除",
          "To *abolish* something is to end it completely.",
          "*abolish* 是彻底废除某事物。",
          "The phrase does not mean to end something completely.",
          "这个短语的意思不是彻底废除。",
        ),
        "announce openly": L(
          "公开宣布",
          "To *declare* is to announce openly and officially.",
          "*declare* 是公开正式地宣布。",
          "The phrase does not mean to announce openly.",
          "这个短语的意思不是公开宣布。",
        ),
        "care for what other people think": L(
          "尊重他人的看法",
          "A *decent respect to the opinions of mankind* is a proper concern for what the world thinks.",
          "*a decent respect to the opinions of mankind* 是对世人看法的应有尊重。",
          "The phrase is not about caring what others think.",
          "这个短语与在意他人看法无关。",
        ),
        change: L(
          "改变",
          "To *alter* something is to change it.",
          "*alter* 是改变某事物。",
          "The phrase does not mean to change.",
          "这个短语的意思不是改变。",
        ),
        "would not agree": L(
          "不同意",
          "To *refuse one's assent* is to refuse to agree or to approve.",
          "*refuse one's assent* 是拒绝同意或批准。",
          "The phrase is not about refusing to agree.",
          "这个短语与拒绝同意无关。",
        ),
        "the freedom to seek a good life": L(
          "追求幸福的自由",
          "*The pursuit of happiness* is the freedom to chase what makes a good life.",
          "*the pursuit of happiness* 是追求美好生活的自由。",
          "The phrase is not about seeking a good life.",
          "这个短语与追求美好生活无关。",
        ),
        "promise one another": L(
          "相互承诺",
          "To *mutually pledge* is for each person to promise the others.",
          "*mutually pledge* 是每个人向其他人做出承诺。",
          "The phrase is not about promising one another.",
          "这个短语与相互承诺无关。",
        ),
        "made people house": L(
          "迫使人们提供住处",
          "To *quarter* troops among people is to make them house the soldiers.",
          "*quarter* troops among people 是迫使人们让士兵住进家里。",
          "The phrase is not about making people house soldiers.",
          "这个短语与迫使人们为士兵提供住处无关。",
        ),
        "a cruel ruler with total power": L(
          "拥有绝对权力的残暴统治者",
          "A *tyrant* rules cruelly and answers to no one.",
          "*tyrant* 是残暴统治、不对任何人负责的人。",
          "The phrase does not name a cruel ruler.",
          "这个短语指的不是残暴的统治者。",
        ),
        "join together more closely": L(
          "更紧密地联合起来",
          "To *form a more perfect union* is to bind the states together more closely.",
          "*form a more perfect union* 是让各州更紧密地联合在一起。",
          "The phrase is not about joining together.",
          "这个短语与联合无关。",
        ),
        "set up fair laws and courts": L(
          "建立公正的法律和法院",
          "To *establish justice* is to set up a fair system of laws and courts.",
          "*establish justice* 是建立公正的法律和法院制度。",
          "The phrase is not about setting up fair laws.",
          "这个短语与建立公正的法律无关。",
        ),
        "keep peace at home": L(
          "维护国内安宁",
          "*Domestic* means at home, and *tranquility* means peace.",
          "*domestic* 意为国内的，*tranquility* 意为安宁。",
          "The phrase is not about peace at home.",
          "这个短语与国内安宁无关。",
        ),
        "protect the country together": L(
          "共同保卫国家",
          "The *common defense* is the protection of the whole country, shared by all.",
          "*common defense* 是大家共同承担的对整个国家的保卫。",
          "The phrase is not about defending the country.",
          "这个短语与保卫国家无关。",
        ),
        "help everyone live well": L(
          "增进大众福祉",
          "The *general welfare* is the well-being of all the people.",
          "*general welfare* 是全体人民的福祉。",
          "The phrase is not about everyone's well-being.",
          "这个短语与大众福祉无关。",
        ),
        "keep freedom safe": L(
          "保障自由",
          "To *secure the blessings of liberty* is to make the good things of freedom safe.",
          "*secure the blessings of liberty* 是保障自由带来的好处。",
          "The phrase is not about keeping freedom safe.",
          "这个短语与保障自由无关。",
        ),
        "the generations to come": L(
          "子孙后代",
          "*Posterity* means the people who will live after us.",
          "*posterity* 指我们之后的人，即子孙后代。",
          "The phrase does not mean the generations to come.",
          "这个短语的意思不是子孙后代。",
        ),
        limiting: L(
          "限制",
          "To *abridge* a freedom is to cut it short, to limit it.",
          "*abridge* 自由就是削减、限制它。",
          "The phrase does not mean limiting.",
          "这个短语的意思不是限制。",
        ),
        "to gather without violence": L(
          "和平集会",
          "To *assemble peaceably* is to come together without violence.",
          "*assemble peaceably* 是不使用暴力地聚集在一起。",
          "The phrase is not about gathering peacefully.",
          "这个短语与和平集会无关。",
        ),
        "ask the government formally": L(
          "正式向政府请愿",
          "To *petition* is to make a formal request.",
          "*petition* 是正式提出请求。",
          "The phrase is not about a formal request.",
          "这个短语与正式请求无关。",
        ),
        "money paid to be let out before trial": L(
          "保释金",
          "*Bail* is money paid so an accused person can go free until the trial.",
          "*bail* 是为让被告在审判前获得自由而支付的钱。",
          "The phrase does not mean money paid for release before trial.",
          "这个短语的意思不是保释金。",
        ),
        "harsh and strange penalties": L(
          "残酷而不寻常的刑罚",
          "*Cruel and unusual punishments* are penalties that are harsh beyond reason.",
          "*cruel and unusual punishments* 是过度严酷的刑罚。",
          "The phrase is not about harsh penalties.",
          "这个短语与严酷的刑罚无关。",
        ),
        "have taken away": L(
          "被剥夺",
          "To be *deprived* of something is to have it taken away.",
          "*be deprived of* 某物就是被夺走某物。",
          "The phrase does not mean having something taken away.",
          "这个短语的意思不是被剥夺。",
        ),
        "fair legal steps": L(
          "正当法律程序",
          "*Due process* is the fair set of steps the law must follow.",
          "*due process* 是法律必须遵循的公正步骤。",
          "The phrase is not about fair legal steps.",
          "这个短语与正当法律程序无关。",
        ),
        "a quick trial open to all": L(
          "迅速而公开的审判",
          "*Speedy* means quick, and *public* means open for anyone to watch.",
          "*speedy* 意为迅速，*public* 意为公开、任何人都可以旁听。",
          "The phrase is not about a quick, open trial.",
          "这个短语与迅速公开的审判无关。",
        ),
        "fair payment": L(
          "公正的补偿",
          "*Just compensation* is a fair payment for what was taken.",
          "*just compensation* 是对被征用之物的公正补偿。",
          "The phrase does not mean fair payment.",
          "这个短语的意思不是公正的补偿。",
        ),
        "handed over": L(
          "移交",
          "Powers *delegated* are powers handed over to someone else.",
          "*delegated* 的权力是移交给别人的权力。",
          "The phrase does not mean handed over.",
          "这个短语的意思不是移交。",
        ),
      },
    ),
  ],
});

const viewpoints = topic("reading", {
  id: "acknowledging-conflicting-viewpoints",
  title: ["Acknowledging Conflicting Viewpoints", "承认对立观点"],
  summary: [
    "A strong argument states the other side fairly and answers it, by conceding a point or rebutting it with evidence, rather than dismissing it.",
    "有力的论证会公正地陈述对方观点并作出回应，或者让步，或者用证据反驳，而不是不屑一顾。",
  ],
  after: ["counterclaims-and-rebuttals", "loaded-language"],
  points: [
    label(
      "how-the-writer-answers",
      ["How the Writer Answers", "作者如何回应"],
      [
        "When writers bring in a view that conflicts with their own, watch what they do with it. Some **concede** a point, admitting the other side is partly right: *It is true that the law cost money.* Some **rebut** it, answering with reasons or evidence: *But the cost was repaid within five years.* And some **dismiss** it unfairly, waving it away with scorn instead of reasons: *Only fools could believe that.*",
        "作者引入与自己相冲突的观点时，要看他们怎样对待它。有些**让步**，承认对方部分正确：*It is true that the law cost money.* 有些**反驳**，用理由或证据回应：*But the cost was repaid within five years.* 还有些**不公正地否定**，用轻蔑而非理由把它打发掉：*Only fools could believe that.*",
      ],
      ["What does the writer do with the opposing view?", "作者如何对待对立观点？"],
      `
        Opponents say the new factory law will raise prices. It is true that some prices may rise a little.|concedes
        Opponents say the new factory law will raise prices. Yet in towns that passed such laws, prices rose by less than one percent.|rebuts
        Opponents say the new factory law will raise prices. Only greedy mill owners would whine about that.|dismisses
        Some argue that independence will bring war. They are right that war is a real danger.|concedes
        Some argue that independence will bring war. But war has already come; the king's soldiers fired first.|rebuts
        Some argue that independence will bring war. Such cowards do not deserve to be heard.|dismisses
        Critics say children need wages to feed their families. That is a real and painful need.|concedes
        Critics say children need wages to feed their families. However, where school was made free, families found other ways and children's health improved.|rebuts
        Critics say children need wages to feed their families. That is the kind of nonsense heartless people repeat.|dismisses
        Many claim the railway will ruin farmland. Some fields will indeed be cut in two.|concedes
        Many claim the railway will ruin farmland. Yet farmers along the first lines sold their crops in cities and grew richer.|rebuts
        Many claim the railway will ruin farmland. People who fear trains are simply backward.|dismisses
        Some say freeing the enslaved will ruin the economy. It is true that planters would lose money at first.|concedes
        Some say freeing the enslaved will ruin the economy. But no profit can justify owning a human being, and free states grew wealthy without it.|rebuts
        Some say freeing the enslaved will ruin the economy. Their opinion is worth nothing.|dismisses
        Opponents argue that women are not ready to vote. Many women have indeed had little chance to study politics.|concedes
        Opponents argue that women are not ready to vote. Yet women already run farms, businesses and schools, and they pay taxes.|rebuts
        Opponents argue that women are not ready to vote. Such old-fashioned people should keep quiet.|dismisses
        Some say the king's taxes are fair. The king does face real debts from the last war.|concedes
        Some say the king's taxes are fair. But we have no voice in Parliament, and taxes without consent break English law itself.|rebuts
        Some say the king's taxes are fair. Anyone who says so is a traitor to the colonies.|dismisses
        Critics claim unions cause strikes that hurt everyone. Strikes do cause real hardship.|concedes
        Critics claim unions cause strikes that hurt everyone. However, records show that strikes fell where unions could bargain with owners.|rebuts
        Critics claim unions cause strikes that hurt everyone. Those critics are paid liars.|dismisses
        Some argue that a strong king keeps order. Order is indeed precious.|concedes
        Some argue that a strong king keeps order. Yet the strongest kings have often caused the worst disorder, as the civil wars show.|rebuts
        Some argue that a strong king keeps order. That is a ridiculous idea.|dismisses
        Many say machines take away jobs. Some workers did lose their jobs to machines.|concedes
        Many say machines take away jobs. But the machine age created more jobs than it destroyed, as factory records show.|rebuts
        Many say machines take away jobs. Those people are afraid of anything new.|dismisses
      `,
      {
        concedes: L(
          "让步",
          "The writer admits the other side has a fair point, which makes the writer seem reasonable.",
          "作者承认对方有合理之处，这让作者显得通情达理。",
          "The writer does not admit the other side has a point.",
          "作者并没有承认对方有道理。",
        ),
        rebuts: L(
          "反驳",
          "The writer answers the opposing view with a reason or evidence that shows it is wrong or weaker than it seems.",
          "作者用理由或证据回应对立观点，表明它是错误的或不如看上去那么有力。",
          "The writer gives no reason or evidence against the other view.",
          "作者没有给出反对对方观点的理由或证据。",
        ),
        dismisses: L(
          "不公正地否定",
          "The writer waves the view away with insults or scorn instead of answering it with reasons.",
          "作者用侮辱或轻蔑打发这个观点，而不是用理由回应它。",
          "The writer does not simply scorn the other view.",
          "作者并没有只是轻蔑地否定对方观点。",
        ),
      },
    ),
    label(
      "is-the-other-side-stated-fairly",
      ["Is the Other Side Stated Fairly", "对方观点是否被公正地陈述"],
      [
        "Before answering an opposing view, a writer must state it. A **fair statement** gives the view as its own supporters would put it. A **straw man** twists it into a weaker or sillier version that is easy to knock down: *My opponents want children to starve.* **Name-calling** attacks the people who hold the view instead of stating it: *These selfish millionaires say...* Ask whether a supporter of the view would accept how it is described.",
        "回应对立观点之前，作者必须先陈述它。**公正的陈述**按照其支持者会采用的说法来表述。**稻草人**把它歪曲成一个更弱或更荒谬、容易驳倒的版本：*My opponents want children to starve.* **人身攻击**攻击持这种观点的人，而不是陈述观点：*These selfish millionaires say...* 问一问：这种观点的支持者会接受这样的描述吗？",
      ],
      ["How is the opposing view presented?", "对立观点是如何被呈现的？"],
      `
        Mill owners argue that shorter hours would make their goods too costly to sell abroad.|a fair statement
        Mill owners apparently want children to work until they drop dead.|a straw man
        These bloated, money-mad mill owners say shorter hours are bad.|name-calling
        Loyalists believe that staying with Britain offers protection and trade.|a fair statement
        Loyalists think we should all be slaves to the king forever.|a straw man
        Those spineless loyalists claim Britain protects us.|name-calling
        Supporters of the railway say it will carry goods faster and more cheaply.|a fair statement
        Supporters of the railway want to tear up every farm in the country.|a straw man
        The railway's greedy cheerleaders claim it will help trade.|name-calling
        Some teachers argue that phones can be useful tools for research in class.|a fair statement
        Some teachers think students should play games all day instead of learning.|a straw man
        Lazy teachers who want an easy job say phones help research.|name-calling
        Opponents of the dam worry that it will flood the homes of two hundred families.|a fair statement
        Opponents of the dam want the city to live without water or electricity.|a straw man
        Those hysterical tree-huggers say the dam will flood homes.|name-calling
        Those who oppose the tax argue that it will fall hardest on poor families.|a fair statement
        Those who oppose the tax want the government to have no money at all.|a straw man
        The tax's whining critics claim it hurts the poor.|name-calling
        Some parents argue that a longer school day would leave children too tired to learn.|a fair statement
        Some parents just want their children to do nothing.|a straw man
        Overprotective parents complain that longer days are tiring.|name-calling
        The planters argue that freeing enslaved workers would leave their crops unharvested.|a fair statement
        The planters believe they should own every person in the land.|a straw man
        The cruel, wicked planters claim their crops will rot.|name-calling
        Critics of the new park say the land would bring more jobs if it were used for housing.|a fair statement
        Critics of the new park hate children and green spaces.|a straw man
        The park's sour-faced critics say houses would bring jobs.|name-calling
        Those against the new library argue that the money is needed to repair roads.|a fair statement
        Those against the new library want everyone to stop reading.|a straw man
        Ignorant opponents of the library say roads matter more.|name-calling
      `,
      {
        "a fair statement": L(
          "公正的陈述",
          "The view is given as its own supporters would put it, with their real reason.",
          "按照支持者会采用的说法陈述观点，并给出他们的真实理由。",
          "The view is twisted or its holders are insulted, so the statement is not fair.",
          "观点被歪曲或持有者被侮辱，所以这个陈述不公正。",
        ),
        "a straw man": L(
          "稻草人",
          "The view is exaggerated into an extreme, silly version that its supporters would never accept, so it is easy to knock down.",
          "观点被夸大成支持者绝不会接受的极端、荒谬的版本，所以很容易驳倒。",
          "The view is not exaggerated into an extreme version.",
          "观点并没有被夸大成极端的版本。",
        ),
        "name-calling": L(
          "人身攻击",
          "Insulting words attack the people who hold the view instead of dealing with the view itself.",
          "用侮辱性的词语攻击持这种观点的人，而不是讨论观点本身。",
          "The statement does not insult the people who hold the view.",
          "这个陈述没有侮辱持这种观点的人。",
        ),
      },
    ),
  ],
});

const centralIdea = topic("reading", {
  id: "tracking-a-central-idea",
  title: ["Tracking a Central Idea", "追踪中心思想"],
  summary: [
    "A central idea is introduced, developed with evidence and often refined as a text goes on; an objective summary states it without opinion.",
    "中心思想在文中被提出、用证据展开，并常常随着行文得到修正；客观的概括陈述它而不带个人看法。",
  ],
  after: ["how-a-paragraph-is-built", "keeping-a-summary-objective"],
  points: [
    label(
      "how-the-sentence-shapes-the-idea",
      ["How the Sentence Shapes the Idea", "句子如何塑造中心思想"],
      [
        "A central idea grows through a text. Early on, a sentence **introduces** it in general terms. Later sentences **develop** it with examples, facts and quotations that show it is true. And good writers often **refine** it: they add a limit, an exception or a complication, so that the idea becomes more exact: *Yet not every factory child suffered alike.*",
        "中心思想在文中逐步发展。开头的句子用概括的话**提出**它。后面的句子用例子、事实和引语**展开**它，证明它是对的。好的作者还常常**修正**它：加上限定、例外或复杂情况，使中心思想更准确：*Yet not every factory child suffered alike.*",
      ],
      ["How does this sentence shape the central idea?", "这个句子如何塑造中心思想？"],
      `
        Central idea: Factories changed childhood. Sentence: The coming of the factory changed what it meant to be a child.|introduces it
        Central idea: Factories changed childhood. Sentence: In 1833, children as young as six worked twelve-hour shifts in Manchester's mills.|develops it
        Central idea: Factories changed childhood. Sentence: Yet children on farms had always worked hard, so the change was in the kind of work, not the amount.|refines it
        Central idea: Railways transformed trade. Sentence: No invention of the 1800s transformed trade as deeply as the railway.|introduces it
        Central idea: Railways transformed trade. Sentence: Fish caught at dawn on the coast could be sold in London the same evening.|develops it
        Central idea: Railways transformed trade. Sentence: Still, the benefits reached towns on the line, while those it bypassed often declined.|refines it
        Central idea: Coal powered the industrial age. Sentence: Coal was the fuel on which the whole industrial age ran.|introduces it
        Central idea: Coal powered the industrial age. Sentence: British coal output rose from about ten million tonnes in 1800 to over two hundred million by 1900.|develops it
        Central idea: Coal powered the industrial age. Sentence: Water power, however, remained important in some industries for decades.|refines it
        Central idea: Cities grew crowded and unhealthy. Sentence: As factories drew workers in, cities grew crowded and dangerous to health.|introduces it
        Central idea: Cities grew crowded and unhealthy. Sentence: In one Leeds street, a single water pump served more than three hundred people.|develops it
        Central idea: Cities grew crowded and unhealthy. Sentence: But by the 1870s, new sewers had begun to make some cities safer than the countryside.|refines it
        Central idea: Workers organized for better conditions. Sentence: Faced with long hours and low pay, workers began to organize.|introduces it
        Central idea: Workers organized for better conditions. Sentence: In 1888, the London match girls struck and won higher wages within three weeks.|develops it
        Central idea: Workers organized for better conditions. Sentence: Many early unions, though, admitted only skilled men and ignored women and the unskilled.|refines it
        Central idea: Machines made goods cheaper. Sentence: The great gift of the machine was cheapness.|introduces it
        Central idea: Machines made goods cheaper. Sentence: The price of cotton cloth fell by more than eighty percent between 1780 and 1830.|develops it
        Central idea: Machines made goods cheaper. Sentence: Cheaper goods did not always mean better lives, since wages for many fell too.|refines it
        Central idea: Reformers fought child labor. Sentence: From the 1830s, reformers began a long fight against child labor.|introduces it
        Central idea: Reformers fought child labor. Sentence: Lord Shaftesbury's committee gathered the stories of hundreds of factory children.|develops it
        Central idea: Reformers fought child labor. Sentence: Even so, many families depended on children's wages and opposed the reforms.|refines it
        Central idea: Steam changed travel by sea. Sentence: Steam freed ships from the mercy of the wind.|introduces it
        Central idea: Steam changed travel by sea. Sentence: In 1838, the Great Western crossed the Atlantic in fifteen days, half the usual time.|develops it
        Central idea: Steam changed travel by sea. Sentence: Sailing ships, though, stayed cheaper for heavy cargo until nearly 1900.|refines it
        Central idea: Factory work imposed a new kind of time. Sentence: The factory brought a new master into workers' lives: the clock.|introduces it
        Central idea: Factory work imposed a new kind of time. Sentence: Workers who arrived five minutes late could lose a whole morning's pay.|develops it
        Central idea: Factory work imposed a new kind of time. Sentence: Some craftsmen in small workshops, however, kept their old, flexible hours for decades.|refines it
        Central idea: Gas light changed city life. Sentence: Gas light changed the life of the city after dark.|introduces it
        Central idea: Gas light changed city life. Sentence: By 1823, about two hundred miles of London streets were lit by gas.|develops it
        Central idea: Gas light changed city life. Sentence: Poorer districts, however, often stayed dark for many more years.|refines it
      `,
      {
        "introduces it": L(
          "提出",
          "The sentence states the central idea in general terms, the way a text opens it.",
          "这个句子用概括的话陈述中心思想，就像文章开头提出它那样。",
          "The sentence does more than state the idea in general terms.",
          "这个句子不只是概括地陈述中心思想。",
        ),
        "develops it": L(
          "展开",
          "The sentence gives a fact, number or example that shows the central idea is true.",
          "这个句子给出事实、数字或例子，证明中心思想是对的。",
          "The sentence gives no fact or example in support of the idea.",
          "这个句子没有给出支持中心思想的事实或例子。",
        ),
        "refines it": L(
          "修正",
          "The sentence adds a limit, exception or complication, often after *yet*, *but* or *however*, that makes the idea more exact.",
          "这个句子加上限定、例外或复杂情况，常在 *yet*、*but* 或 *however* 之后，使中心思想更准确。",
          "The sentence adds no limit or exception to the idea.",
          "这个句子没有给中心思想加上限定或例外。",
        ),
      },
    ),
    label(
      "an-objective-statement",
      ["An Objective Statement", "客观的陈述"],
      [
        "To summarize a text, state its central idea **objectively and completely**: in neutral words, covering the whole text. Two mistakes are common. A statement can be **too narrow**, giving just one detail instead of the main idea. Or it can **add an opinion**, the reader's own judgment, which does not belong in a summary: *This shocking text shows...*",
        "概括一篇文章时，要**客观而完整地**陈述它的中心思想：用中立的词语，涵盖全文。常见的错误有两种。陈述可能**太窄**，只给出一个细节而不是中心思想。或者它可能**加入个人看法**，即读者自己的评判，这不应出现在概括中：*This shocking text shows...*",
      ],
      ["Is this statement of the text's central idea objective and complete?", "这个对中心思想的陈述是否客观而完整？"],
      `
        Text: an article on how railways changed trade, travel and time in Britain. Statement: Railways changed how Britain traded, traveled and kept time.|objective and complete
        Text: an article on how railways changed trade, travel and time in Britain. Statement: Fish could reach London the same day it was caught.|too narrow
        Text: an article on how railways changed trade, travel and time in Britain. Statement: Railways were the most wonderful invention ever made.|adds an opinion
        Text: a history of child labor in mills and the laws that limited it. Statement: Child labor was common in mills until laws gradually limited it.|objective and complete
        Text: a history of child labor in mills and the laws that limited it. Statement: The Factory Act of 1833 banned work for children under nine.|too narrow
        Text: a history of child labor in mills and the laws that limited it. Statement: The cruel mill owners deserved to be punished.|adds an opinion
        Text: a report on how coal mining shaped Welsh towns. Statement: Coal mining shaped the growth, work and culture of Welsh towns.|objective and complete
        Text: a report on how coal mining shaped Welsh towns. Statement: Many miners sang in choirs.|too narrow
        Text: a report on how coal mining shaped Welsh towns. Statement: It is a shame that the mines ever closed.|adds an opinion
        Text: an essay on how the steam engine was improved over a century. Statement: The steam engine was improved step by step over about a hundred years.|objective and complete
        Text: an essay on how the steam engine was improved over a century. Statement: Watt added a separate condenser in 1769.|too narrow
        Text: an essay on how the steam engine was improved over a century. Statement: James Watt was a genius far greater than other inventors.|adds an opinion
        Text: an article on why cities grew crowded and how reformers cleaned them up. Statement: Industrial cities grew crowded and unhealthy until reformers improved sanitation.|objective and complete
        Text: an article on why cities grew crowded and how reformers cleaned them up. Statement: One pump served three hundred people in Leeds.|too narrow
        Text: an article on why cities grew crowded and how reformers cleaned them up. Statement: The reformers were heroes, and we should honor them today.|adds an opinion
        Text: a history of how workers formed unions to win better pay and hours. Statement: Workers formed unions to win better pay and shorter hours.|objective and complete
        Text: a history of how workers formed unions to win better pay and hours. Statement: The match girls went on strike in 1888.|too narrow
        Text: a history of how workers formed unions to win better pay and hours. Statement: The unions were brave, and the owners were villains.|adds an opinion
        Text: an article on how cheap cotton cloth changed what people wore. Statement: Machine-made cotton made cheap clothing widely available and changed fashion.|objective and complete
        Text: an article on how cheap cotton cloth changed what people wore. Statement: Printed cotton dresses became popular.|too narrow
        Text: an article on how cheap cotton cloth changed what people wore. Statement: Cotton is a far nicer fabric than wool.|adds an opinion
        Text: an essay on how the factory clock changed the way people worked. Statement: Factories made workers follow strict clock time instead of the rhythms of the day.|objective and complete
        Text: an essay on how the factory clock changed the way people worked. Statement: Latecomers could lose a morning's pay.|too narrow
        Text: an essay on how the factory clock changed the way people worked. Statement: Clocks are a terrible thing to rule anyone's life.|adds an opinion
        Text: a report on how canals were built and then replaced by railways. Statement: Canals carried Britain's goods until railways replaced them.|objective and complete
        Text: a report on how canals were built and then replaced by railways. Statement: Some canal boats were pulled by horses.|too narrow
        Text: a report on how canals were built and then replaced by railways. Statement: Canals were much more charming than railways.|adds an opinion
        Text: an article on how gas light changed life in cities at night. Statement: Gas lighting made city streets safer and busier after dark.|objective and complete
        Text: an article on how gas light changed life in cities at night. Statement: London had two hundred miles of gas-lit streets by 1823.|too narrow
        Text: an article on how gas light changed life in cities at night. Statement: Gas lamps were the most beautiful sight of the age.|adds an opinion
      `,
      {
        "objective and complete": L(
          "客观而完整",
          "The statement covers the main idea of the whole text in neutral words, with no opinion.",
          "这个陈述用中立的词语涵盖全文的中心思想，不带个人看法。",
          "The statement is too narrow or adds an opinion.",
          "这个陈述太窄或加入了个人看法。",
        ),
        "too narrow": L(
          "太窄",
          "The statement gives only one detail from the text, not the idea the whole text develops.",
          "这个陈述只给出文中的一个细节，而不是全文展开的中心思想。",
          "The statement is not just one small detail.",
          "这个陈述不只是一个小细节。",
        ),
        "adds an opinion": L(
          "加入个人看法",
          "The statement judges with words like *cruel*, *wonderful* or *should*, which do not belong in an objective summary.",
          "这个陈述用 *cruel*、*wonderful* 或 *should* 等词做出评判，这不应出现在客观的概括中。",
          "The statement does not add the reader's own judgment.",
          "这个陈述没有加入读者自己的评判。",
        ),
      },
    ),
  ],
});

const factsInterpretations = topic("reading", {
  id: "facts-interpretations-and-judgments",
  title: ["Facts, Interpretations and Judgments", "事实、解释与评判"],
  summary: [
    "Historians state facts that records can confirm, interpretations that explain them, and judgments that weigh them as good or bad.",
    "历史学家陈述记录可以证实的事实、解释事实的观点，以及评判事实好坏的判断。",
  ],
  after: ["fact-and-opinion", "distinguishing-observation-and-inference"],
  points: [
    label(
      "what-kind-of-statement",
      ["What Kind of Statement", "哪一类陈述"],
      [
        "History writing mixes three kinds of statement. A **fact** can be checked in a record: *The first Factory Act was passed in 1802.* An **interpretation** explains why something happened or what it meant; it rests on evidence, and historians can argue about it: *The act passed mainly because of fear of disease.* A **judgment** says whether something was good or bad, right or wrong: *The act was a shameful half measure.*",
        "历史写作混合了三类陈述。**事实**可以在记录中核实：*The first Factory Act was passed in 1802.* **解释**说明某事为什么发生或意味着什么；它以证据为基础，历史学家可以争论：*The act passed mainly because of fear of disease.* **评判**说某事是好是坏、是对是错：*The act was a shameful half measure.*",
      ],
      ["What kind of statement is this?", "这是哪一类陈述？"],
      `
        The first Factory Act was passed in Britain in 1802.|fact
        The act passed mainly because doctors feared that fevers in the mills would spread to the towns.|interpretation
        The act was a shameful half measure that left children unprotected.|judgment
        Stephenson's Rocket won the Rainhill Trials in 1829.|fact
        The Rocket won largely because its design used steam more efficiently than its rivals did.|interpretation
        The Rocket was the most beautiful machine of its century.|judgment
        By 1851, more people in Britain lived in towns than in the countryside.|fact
        People moved to towns chiefly because farm work was disappearing.|interpretation
        The move to the towns was a tragedy for the English character.|judgment
        The Luddites smashed weaving machines between 1811 and 1816.|fact
        The Luddites were protesting against low wages more than against machines themselves.|interpretation
        The Luddites were foolish to stand in the way of progress.|judgment
        The Great Exhibition opened in London in 1851.|fact
        The exhibition was meant above all to show off Britain's industrial power.|interpretation
        The exhibition was a vulgar display of national pride.|judgment
        About a third of the workers in early cotton mills were children.|fact
        Owners hired children because they could pay them far less than adults.|interpretation
        Hiring children was wicked, whatever the reason.|judgment
        The Liverpool and Manchester Railway opened in 1830.|fact
        The railway succeeded because merchants badly needed a faster link to the port.|interpretation
        The railway was a splendid achievement that deserves our admiration.|judgment
        Edwin Chadwick published a report on the health of the poor in 1842.|fact
        Chadwick's report changed opinion because it used numbers rather than stories.|interpretation
        Chadwick was the greatest reformer of his age.|judgment
        The ten-hour day was made law for women and children in 1847.|fact
        The law passed partly because landowners wanted to punish the mill owners who opposed them.|interpretation
        The ten-hour law was a wonderful victory for decency.|judgment
        Coal production in Britain more than doubled between 1830 and 1850.|fact
        The demand for coal rose mainly because of the spread of railways and steamships.|interpretation
        The coal age was a dirty, ugly time that should never be admired.|judgment
      `,
      {
        fact: L(
          "事实",
          "The statement can be checked in a record, such as a date, a number or an event.",
          "这个陈述可以在记录中核实，如日期、数字或事件。",
          "The statement explains or judges; it cannot simply be checked in a record.",
          "这个陈述是在解释或评判，不能简单地在记录中核实。",
        ),
        interpretation: L(
          "解释",
          "The statement explains why something happened or what it meant; it rests on evidence, but historians can disagree.",
          "这个陈述说明某事为什么发生或意味着什么；它以证据为基础，但历史学家可能有不同看法。",
          "The statement does not explain causes or meanings.",
          "这个陈述没有解释原因或意义。",
        ),
        judgment: L(
          "评判",
          "The statement weighs something as good or bad, using words like *shameful*, *wonderful* or *foolish*.",
          "这个陈述用 *shameful*、*wonderful* 或 *foolish* 等词评判某事的好坏。",
          "The statement does not say whether something was good or bad.",
          "这个陈述没有说某事是好是坏。",
        ),
      },
    ),
    label(
      "how-to-test-it",
      ["How to Test It", "如何检验它"],
      [
        "Each kind of statement is tested in its own way. A fact is tested by **checking a record**: a law book, a census or a letter of the time. An interpretation is tested by **weighing the evidence**: do the sources, taken together, support this explanation better than others? A judgment is tested by **asking about values**: what standard of right and wrong does the writer use, and do you share it?",
        "每一类陈述都有自己的检验方式。事实通过**查阅记录**来检验：当时的法典、人口普查或信件。解释通过**权衡证据**来检验：综合各种来源，它们是否比其他解释更支持这一个？评判通过**追问价值观**来检验：作者用的是什么是非标准，你是否认同？",
      ],
      ["What is the best way to test this statement?", "检验这个陈述的最好方法是什么？"],
      `
        The mill at New Lanark employed about two thousand people in 1816.|check a record
        Robert Owen's mill made a profit mainly because well-treated workers worked harder.|weigh the evidence
        Robert Owen was a better man than any other mill owner of his day.|ask about values
        The first public railway carried passengers in 1825.|check a record
        Railways grew fastest where coal and iron lay close together.|weigh the evidence
        It was right for the government to let private companies build the railways.|ask about values
        The population of Manchester was about 300,000 in 1850.|check a record
        Manchester grew so fast because its damp air suited cotton spinning.|weigh the evidence
        Manchester was the ugliest city in Europe.|ask about values
        The Mines Act of 1842 banned women and girls from working underground.|check a record
        The act was passed largely because drawings of children in the mines shocked the public.|weigh the evidence
        Banning women from the mines was unfair to the women who needed the work.|ask about values
        The match girls' strike began in July 1888.|check a record
        The strike succeeded because newspapers turned the public against the company.|weigh the evidence
        The match company's owners behaved disgracefully.|ask about values
        Richard Arkwright opened his first water-powered mill in 1771.|check a record
        Arkwright succeeded more through business skill than through invention.|weigh the evidence
        Arkwright deserves more praise than the workers who ran his machines.|ask about values
        In 1830, a riot broke out at the opening of the Liverpool railway.|check a record
        Crowds attacked the railway mainly in protest against the prime minister who opened it.|weigh the evidence
        The rioters were wrong to use violence.|ask about values
        Cholera killed about 50,000 people in Britain in 1849.|check a record
        Cholera spread mostly through dirty drinking water.|weigh the evidence
        The government was guilty of neglect for not cleaning the water sooner.|ask about values
        The first trade union for all workers was founded in 1834.|check a record
        The union collapsed because employers refused to hire its members.|weigh the evidence
        Workers had every right to join a union.|ask about values
        Wages in cotton mills fell between 1810 and 1830.|check a record
        Wages fell mainly because so many hand weavers were competing for work.|weigh the evidence
        Paying such low wages was a moral crime.|ask about values
      `,
      {
        "check a record": L(
          "查阅记录",
          "The statement is a fact, such as a date, number or event, so a record of the time can confirm or correct it.",
          "这个陈述是事实，如日期、数字或事件，所以当时的记录可以证实或纠正它。",
          "This statement cannot be settled just by looking it up.",
          "这个陈述不能仅靠查阅来确定。",
        ),
        "weigh the evidence": L(
          "权衡证据",
          "The statement is an interpretation, an explanation of causes, so you must ask whether the evidence supports it better than other explanations.",
          "这个陈述是解释，即对原因的说明，所以要问证据是否比其他解释更支持它。",
          "This statement is not an explanation to be weighed against the evidence.",
          "这个陈述不是需要用证据权衡的解释。",
        ),
        "ask about values": L(
          "追问价值观",
          "The statement is a judgment of right or wrong, so it depends on the standard of values the writer uses.",
          "这个陈述是对是非的评判，所以它取决于作者采用的价值标准。",
          "This statement does not judge right or wrong.",
          "这个陈述没有评判是非。",
        ),
      },
    ),
  ],
});

/** readingTopics8a are the reading topics of the first units of grade 8. */
export const readingTopics8a: readonly TopicDef[] = [
  incidents,
  dramaticIrony,
  paragraph,
  accounts,
  foundingDocument,
  viewpoints,
  centralIdea,
  factsInterpretations,
];
