// Grade 9: writing skills checked by rule, part one: an analytical thesis, analysis rather than summary, writing an
// epic simile and citing lines of plays and poems.

import type { TopicDef } from "@ga/content";
import { choose, type Label, label, topic } from "../grade-6/kit.ts";

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

const thesis = topic("writing", {
  id: "an-analytical-thesis",
  title: ["An Analytical Thesis", "分析性论点"],
  summary: [
    "A thesis for a literary analysis makes an arguable claim about how or why a text works, not a summary, a bare opinion or an idea too broad to prove.",
    "文学分析的论点要就作品如何或为何产生效果提出可以论证的主张，而不是概括情节、空泛的个人喜好或大到无法证明的观点。",
  ],
  after: ["qualifying-a-claim"],
  points: [
    label(
      "is-it-an-analytical-thesis",
      ["Is It an Analytical Thesis", "这是分析性论点吗"],
      [
        "An **analytical thesis** makes a claim about *how* or *why* a text works, a claim that a reader could disagree with and that the essay will prove: *In* The Odyssey, *Odysseus's cleverness saves him more often than his strength.* Three kinds of sentence look like a thesis but are not. A **plot summary** only says what happens. A **bare opinion** says the writer likes or dislikes the text. A thesis that is **too broad** makes a claim about life or literature in general that no single essay could prove.",
        "**分析性论点**就作品*如何*或*为何*产生效果提出主张，读者可能不同意，而文章要证明它：*In* The Odyssey, *Odysseus's cleverness saves him more often than his strength.* 有三种句子看起来像论点，其实不是。**情节概括**只说发生了什么。**空泛的个人喜好**只说作者喜欢或不喜欢这部作品。**过于宽泛**的论点对人生或文学泛泛而谈，任何一篇文章都无法证明。",
      ],
      [
        "Is this sentence an analytical thesis, a plot summary, a bare opinion or too broad?",
        "这个句子是分析性论点、情节概括、个人喜好，还是过于宽泛？",
      ],
      `
        In The Odyssey, Odysseus's cleverness saves him more often than his strength does.|an analytical thesis
        In The Odyssey, Odysseus travels for ten years before he finally reaches home.|a plot summary
        The Odyssey is the most exciting poem I have ever read.|a bare opinion
        All great stories are about journeys.|too broad
        In Romeo and Juliet, the speed of the action makes the lovers' haste seem both thrilling and doomed.|an analytical thesis
        Romeo and Juliet meet at a party, marry in secret and die within a week.|a plot summary
        Romeo and Juliet is a boring play with too much talking.|a bare opinion
        Love is the most powerful force in human life.|too broad
        In the story, the repeated image of the locked gate shows how the narrator feels trapped by her family.|an analytical thesis
        In the story, the narrator grows up in a house with a locked gate and finally leaves home.|a plot summary
        I really enjoyed the story about the girl and the gate.|a bare opinion
        Every family keeps its children locked in some way.|too broad
        By telling the story through a child's eyes, the novel makes the adults' cruelty more shocking.|an analytical thesis
        The novel is told by a nine-year-old girl who watches her town turn against a stranger.|a plot summary
        The novel is beautifully written and everyone should read it.|a bare opinion
        Children always see the truth more clearly than adults.|too broad
        In the poem, the shift from winter images to spring images marks the speaker's recovery from grief.|an analytical thesis
        The poem describes a winter landscape and then a spring morning.|a plot summary
        The poem is lovely, and I liked the part about spring the best.|a bare opinion
        Nature always helps people to heal.|too broad
        The hero's journey in the film is undercut by its ending, which suggests that the quest was never worth it.|an analytical thesis
        The film follows a young man who leaves his village, fights a dragon and comes home.|a plot summary
        The film was too long, and the dragon looked fake.|a bare opinion
        Every hero's journey ends in disappointment.|too broad
        In the play, the foil of the reckless brother makes the hero's caution look like wisdom rather than fear.|an analytical thesis
        In the play, two brothers react differently when their father is murdered.|a plot summary
        The play's characters are interesting and I liked the brothers.|a bare opinion
        Brothers are always rivals.|too broad
        The story's narrator is unreliable, and her contradictions reveal the guilt she will not admit.|an analytical thesis
        The story is told by a woman who describes the night her brother disappeared.|a plot summary
        The narrator of the story is annoying and I did not believe her.|a bare opinion
        Nobody ever tells the whole truth about themselves.|too broad
      `,
      {
        "an analytical thesis": L(
          "分析性论点",
          "It claims how or why the text works, a point a reader could dispute and the essay can prove from the text.",
          "它就作品如何或为何产生效果提出主张，读者可能有异议，而文章可以用作品来证明。",
          "It does not make an arguable claim about how or why the text works.",
          "它没有就作品如何或为何产生效果提出可以论证的主张。",
        ),
        "a plot summary": L(
          "情节概括",
          "It only says what happens in the text; there is nothing to argue or prove.",
          "它只说作品中发生了什么，没有什么可以争论或证明的。",
          "It does more than say what happens.",
          "它不只是说发生了什么。",
        ),
        "a bare opinion": L(
          "个人喜好",
          "It only says the writer likes or dislikes the text, which cannot be proved from the text.",
          "它只说作者喜欢或不喜欢这部作品，这是无法用作品证明的。",
          "It is not only a statement of liking or disliking the text.",
          "它不只是表达对作品的喜欢或不喜欢。",
        ),
        "too broad": L(
          "过于宽泛",
          "It makes a claim about life or all literature in general, far too large for one essay to prove.",
          "它对人生或所有文学泛泛而谈，大到一篇文章无法证明。",
          "It is not a claim about life or literature in general.",
          "它不是对人生或文学的泛泛之论。",
        ),
      },
    ),
    choose(
      "the-sharper-thesis",
      ["The Sharper Thesis", "更有力的论点"],
      [
        "A strong thesis is **specific**: it names the text, the device or element, and what that element does. Compare *The poem uses imagery* with *In* Dulce et Decorum Est, *the images of drowning turn the glory of war into horror.* Two weak revisions are common: one stays **vague**, naming a device without saying what it does, and one **states a fact** that no one would dispute.",
        "有力的论点是**具体的**：它说出作品、手法或要素，以及这个要素起什么作用。比较 *The poem uses imagery* 和 *In* Dulce et Decorum Est, *the images of drowning turn the glory of war into horror.* 常见的弱修改有两种：一种依然**含糊**，只说出手法而不说它的作用；一种**陈述事实**，没有人会对它有异议。",
      ],
      ["Which is the strongest thesis for an essay on this subject?", "就这个题目而言，哪个是最有力的论点？"],
      `
        The war poem's imagery|The poem's images of drowning turn the glory of war into horror.|The poem uses a lot of imagery to describe the war, and this matters a great deal to the work as a whole.|The poem was written by a soldier who fought in the war.
        Setting in a gothic story|The crumbling house mirrors the family's decline, so that the setting tells the story's ending before it happens.|The setting of the story is very important and adds a lot.|The story is set in a large old house in the countryside.
        The narrator of a novel|Because the narrator is a child, the novel lets readers see the prejudice that the adults around her take for granted.|The narrator is an important part of how the novel works, and this is one of the most important and interesting things about the whole work.|The novel is narrated in the first person by a girl named Scout.
        A soliloquy in a tragedy|The prince's soliloquy shows that his delay comes from doubt about the ghost, not from cowardice.|The soliloquy tells us a lot about the prince and his thoughts.|In the soliloquy, the prince speaks alone on the stage.
        Symbolism in a short story|The green light stands for a dream that keeps moving out of reach, which is why the hero can never be satisfied.|The story uses symbols to show its themes and meanings, and this is one of the most important and interesting things about the whole work.|There is a green light at the end of a dock in the story.
        A character foil in a play|The reckless cousin makes the hero's patience look like strength rather than weakness.|The play has a character who is a foil for the hero.|The hero's cousin is hot-tempered and gets into fights.
        The ending of a novel|The ending refuses to punish the villain, which forces readers to see that justice in the novel's world is not guaranteed.|The ending of the novel is very surprising and memorable, and this is one of the most important and interesting things about the whole work.|The novel ends with the villain escaping on a ship.
        Tone in a personal essay|The essay's gentle humor makes its painful subject easier to face without making it smaller.|The writer uses tone in an effective and interesting way.|The essay is about the death of the writer's father.
        Repetition in a speech|By repeating “we will not wait,” the speaker turns a list of complaints into a rising demand for action.|The speaker uses repetition in the speech many times, and this matters a great deal to the work as a whole.|The phrase “we will not wait” appears five times in the speech.
        Conflict in an epic|The hero's struggle with the sea god is really a struggle with his own pride.|The epic has many conflicts that the hero must face.|The hero fights the sea god for ten years.
        Point of view in a short story|Telling the story from the dog's point of view lets the writer show human cruelty without explaining it.|Point of view is used well in this story, and this is one of the most important and interesting things about the whole work.|The story is told from the point of view of a dog.
        Irony in a play|The audience knows the king is the murderer he seeks, so every vow of revenge he makes becomes a curse on himself.|There is a lot of irony in the play that makes it interesting.|The king promises to find and punish the murderer.
        Word choice in a poem|The poet's harsh, clipped words make the city sound like a machine that crushes the people inside it.|The poet chooses words carefully throughout the poem, and this matters a great deal to the work as a whole.|The poem uses words such as “grind,” “clang” and “crush.”
        Structure of a memoir|By jumping between childhood and old age, the memoir shows how the past keeps living in the present.|The memoir has an interesting and unusual structure.|The memoir has twelve chapters, alternating between two times.
        The hero's journey in a film|The film follows the hero's journey only to overturn it, since the hero's return brings his village nothing.|The film follows the pattern of the hero's journey, and this is one of the most important and interesting things about the whole work.|The hero leaves his village, faces trials and returns home.
        Mood in a gothic tale|The slow buildup of small, wrong details creates a dread that is worse than any monster the story could show.|The mood of the story is dark and scary.|The tale takes place over one stormy night in a castle.
        A theme in a novel|The novel suggests that loyalty to a friend can become a trap when it means betraying the truth.|The novel has a theme about loyalty and friendship, and this matters a great deal to the work as a whole.|The two boys in the novel promise to be friends forever.
        Dialogue in a play|The father's short, cold replies show that his love for his son is hidden under fear.|The dialogue in the play reveals a lot about the characters.|The father and son argue in almost every scene.
        Characterization in a story|The grandmother's small acts of kindness reveal a strength that the louder characters lack.|The grandmother is an important and well-written character, and this matters a great deal to the work as a whole.|The grandmother gives bread to a beggar in the first scene.
        Flashback in a novel|The flashbacks to the war show that the hero's anger in the present comes from guilt, not cruelty.|The novel uses flashbacks to tell part of its story.|The novel has three flashbacks to the war.
        Allusion in a poem|The poem's allusion to Icarus warns that the speaker's ambition may end in a fall.|The poem contains an allusion that adds meaning, and this matters a great deal to the work as a whole.|The poem mentions Icarus in the third stanza.
        Paradox in a speech|The paradox “we must lose in order to win” prepares the audience to accept short-term sacrifice.|The speech uses paradox in an interesting way.|The speaker says “we must lose in order to win.”
        Imagery of light in a novel|Light in the novel always arrives with truth, so the darkening chapters show the family hiding more and more.|There is a lot of imagery about light in the novel, and this is one of the most important and interesting things about the whole work.|The novel describes candles, lamps and sunlight.
        A tragic flaw|The general's jealousy, not the villain's lies, is what destroys him, since he believes the lies because he wants to.|The general has a tragic flaw that leads to his fall.|The general kills his wife after hearing false reports about her.
        Pacing in a story|The story slows almost to stillness at the moment of the accident, making a single second feel like the center of a life.|The story's pacing is very effective and keeps the reader interested, and this matters a great deal to the work as a whole.|The story has a car accident in the middle.
        Setting in a dystopia|The perfectly clean city hides its cruelty so well that its cleanliness itself becomes frightening.|The setting of the novel is a dystopian city in the future.|The novel takes place in a clean, orderly city of the future.
        The speaker of a poem|The speaker's calm voice in the face of loss suggests a grief too deep for tears.|The speaker of the poem is very interesting to study, and this matters a great deal to the work as a whole.|The speaker describes the day of her mother's funeral.
        Cultural values in a folktale|The tale rewards the poorest host for sharing his bread, showing that hospitality matters more than wealth in its culture.|The folktale shows many values of the culture it comes from.|In the tale, a poor man shares his bread with a stranger.
        Two versions of a story|The film cuts the novel's inner thoughts, turning a story about doubt into a story about action.|The film and the novel are different in many ways, and this matters a great deal to the work as a whole.|The film was made forty years after the novel was published.
        Foreshadowing in a tragedy|The early talk of stars and fate makes the lovers' death feel certain from the first scene.|The play uses foreshadowing to hint at the ending.|The chorus says in the first scene that the lovers will die.
      `,
      (right) => [
        `*${right}* names the element and makes an arguable claim about what it does, which an essay can prove.`,
        `*${right}* 说出了要素，并就它的作用提出可以论证的主张，一篇文章可以证明它。`,
      ],
      [
        [
          "*{wrong}* stays vague: it names the device or element but never says what it does or why it matters.",
          "*{wrong}* 依然含糊：只说出手法或要素，却没有说它起什么作用、为什么重要。",
        ],
        [
          "*{wrong}* states a fact about the text that no one would dispute, so there is nothing for the essay to prove.",
          "*{wrong}* 陈述了一个关于作品、没有人会有异议的事实，所以文章没有什么可证明的。",
        ],
      ],
    ),
  ],
});

const analysis = topic("writing", {
  id: "analysis-not-summary",
  title: ["Analysis, Not Summary", "要分析，不要复述"],
  summary: [
    "In a literary essay, sentences that explain how and why the text works do the essay's work; retelling the plot does not.",
    "在文学评论文章中，解释作品如何以及为何产生效果的句子才是文章的主体；复述情节则不是。",
  ],
  after: ["keeping-a-summary-objective"],
  points: [
    label(
      "summary-or-analysis",
      ["Summary or Analysis", "复述还是分析"],
      [
        "In a literary essay, a sentence of **summary** retells what happens: *Then Juliet drinks the potion.* A sentence of **analysis** explains what a detail means or how it works: *Juliet's hesitation before drinking shows that her courage is a choice, not a lack of fear.* A third kind of sentence gives **a personal reaction**, such as *This part made me sad*, which is about the reader, not the text. A good essay uses only as much summary as the reader needs, and spends most of its sentences on analysis.",
        "在文学评论文章中，**复述**的句子讲发生了什么：*Then Juliet drinks the potion.* **分析**的句子解释一个细节意味着什么、如何起作用：*Juliet's hesitation before drinking shows that her courage is a choice, not a lack of fear.* 第三种句子表达**个人感受**，比如 *This part made me sad*，说的是读者而不是作品。好的文章只用读者需要的那一点复述，把大部分句子用于分析。",
      ],
      [
        "Is this sentence from a literary essay summary, analysis or a personal reaction?",
        "这个出自文学评论文章的句子是复述、分析还是个人感受？",
      ],
      `
        Juliet drinks the potion and falls into a deathlike sleep.|summary
        Juliet's hesitation before she drinks shows that her courage is a choice, not an absence of fear.|analysis
        This scene made me feel nervous for Juliet.|a personal reaction
        Odysseus tells the Cyclops that his name is Nobody.|summary
        The false name reveals that Odysseus wins by wit, since it turns the giant's strength into helplessness.|analysis
        I thought the Cyclops scene was the funniest part of the poem.|a personal reaction
        The narrator's brother leaves home in the second chapter.|summary
        The empty chair that the family keeps at the table shows that they cannot accept the brother's absence.|analysis
        I would have been angry if my brother left like that.|a personal reaction
        The king banishes his youngest daughter when she refuses to flatter him.|summary
        By punishing honesty and rewarding flattery, the king shows that his pride has blinded him to love.|analysis
        The king is so unfair that I could hardly keep reading.|a personal reaction
        At the end of the story, the girl opens the cage and lets the bird fly away.|summary
        The open cage completes the story's pattern of captivity, suggesting that the girl has freed herself as well.|analysis
        The ending was really beautiful and made me smile.|a personal reaction
        The poem describes a field of snow and a single crow.|summary
        The lone black crow against the white field makes the speaker's loneliness visible.|analysis
        I love poems about winter because winter is my favorite season.|a personal reaction
        The general believes the lies and kills his wife.|summary
        The general accepts the lies so quickly that his jealousy seems to have been waiting for an excuse.|analysis
        I can't believe anyone could be so foolish.|a personal reaction
        The hero returns to his village after many years.|summary
        No one in the village recognizes the hero, which suggests that the journey has changed him beyond recognition.|analysis
        I was glad that the hero finally got home.|a personal reaction
        In the speech, the speaker repeats the phrase “not yet” five times.|summary
        The repetition of “not yet” turns patience into a kind of promise, so the audience hears hope rather than delay.|analysis
        The speech was very inspiring and gave me chills.|a personal reaction
        The story ends with the two old enemies planting a tree together.|summary
        The shared tree points to the story's theme that peace must be grown slowly, like something alive.|analysis
        I wish more stories had happy endings like this one.|a personal reaction
      `,
      {
        summary: L(
          "复述",
          "The sentence only retells what happens in the text.",
          "这个句子只是复述作品中发生了什么。",
          "The sentence does more than retell what happens.",
          "这个句子不只是复述发生了什么。",
        ),
        analysis: L(
          "分析",
          "The sentence explains what a detail means or how it works, which is the real work of a literary essay.",
          "这个句子解释了一个细节意味着什么或如何起作用，这才是文学评论文章真正要做的事。",
          "The sentence does not explain what a detail means or how it works.",
          "这个句子没有解释细节的含义或作用。",
        ),
        "a personal reaction": L(
          "个人感受",
          "The sentence is about the reader's own feelings, not about the text.",
          "这个句子说的是读者自己的感受，而不是作品。",
          "The sentence is about the text, not only the reader's feelings.",
          "这个句子说的是作品，而不只是读者的感受。",
        ),
      },
    ),
    choose(
      "turning-summary-into-analysis",
      ["Turning Summary into Analysis", "把复述变成分析"],
      [
        "A sentence of summary can become analysis by adding **what the detail shows** and **why it matters**. *The boy breaks the window* becomes *The boy breaks the window on purpose, which shows that his anger has finally found a target.* Two weak revisions are common: one only **adds more plot**, and one adds **a reaction** of the writer instead of a claim about the text.",
        "复述的句子加上**这个细节表明了什么**和**它为什么重要**，就能变成分析。*The boy breaks the window* 变成 *The boy breaks the window on purpose, which shows that his anger has finally found a target.* 常见的弱修改有两种：一种只是**补充更多情节**，另一种加上的是作者的**感受**，而不是对作品的主张。",
      ],
      ["Which revision turns the sentence of summary into analysis?", "哪个修改把复述的句子变成了分析？"],
      `
        The boy breaks the window.|The boy breaks the window on purpose, which shows that his anger has finally found a target.|The boy breaks the window, and then he runs down the street and hides behind the church, and then the scene moves on.|The boy breaks the window, which is a terrible thing to do.
        The queen gives away her crown.|By giving away her crown, the queen shows that she values her people's peace above her own power.|The queen gives away her crown and then leaves the palace that same night.|The queen gives away her crown, which I thought was very brave.
        The old man feeds the stray cats every night.|The old man's nightly care for the strays shows a tenderness he hides from people.|The old man feeds the stray cats every night and talks to them by name, and then the scene moves on.|The old man feeds the stray cats every night, which is so sweet.
        The hero refuses the gift of the gods.|Refusing the gods' gift, the hero shows that he would rather be mortal and free than immortal and owned.|The hero refuses the gift of the gods and sails away from the island the next morning.|The hero refuses the gift of the gods, which I did not expect.
        The poem ends with a closed door.|The closed door at the end shuts off the hope the poem had been building, leaving the speaker alone.|The poem ends with a closed door after the speaker walks down a long hall, and then the scene moves on.|The poem ends with a closed door, and I found it a little sad.
        The girl tears up her sister's letter.|Tearing up the letter shows that the girl would rather destroy the truth than face it.|The girl tears up her sister's letter and throws the pieces into the fire.|The girl tears up her sister's letter, which was very rude of her.
        The soldier keeps his mother's photograph in his helmet.|The photograph in his helmet suggests that the soldier carries home with him as a kind of armor.|The soldier keeps his mother's photograph in his helmet throughout the whole war, and then the scene moves on.|The soldier keeps his mother's photograph in his helmet, which made me cry.
        The villain laughs when he is arrested.|The villain's laughter at his arrest suggests that he believes he has already won.|The villain laughs when he is arrested and is taken away to the prison in chains.|The villain laughs when he is arrested, which was really creepy.
        The garden is overgrown with weeds.|The weeds in the garden mirror the family's neglect of one another.|The garden is overgrown with weeds and the fence has fallen down, and then the scene moves on.|The garden is overgrown with weeds, which sounds like my grandmother's.
        The prince delays killing his uncle.|The prince's delay shows that he doubts the ghost, so his problem is uncertainty rather than fear.|The prince delays killing his uncle for several more scenes.|The prince delays killing his uncle, which made me impatient.
        The mother sets an extra place at the table.|The extra place reveals that the mother still hopes her son will come home.|The mother sets an extra place at the table every evening at six, and then the scene moves on.|The mother sets an extra place at the table, which is heartbreaking.
        The narrator's voice becomes quieter as the story goes on.|The narrator's fading voice suggests that she is slowly disappearing into the family's silence.|The narrator's voice becomes quieter as the story goes on, until the last chapter.|The narrator's voice becomes quieter, and I liked that.
        The bridge collapses in the final scene.|The collapse of the bridge destroys the only link between the two villages, making their division permanent.|The bridge collapses in the final scene during a heavy storm, and soon afterward the other characters arrive and begin to talk.|The bridge collapses in the final scene, which was so exciting.
        The poet calls the city a hungry mouth.|Calling the city a hungry mouth makes it a creature that devours the people who come to it.|The poet calls the city a hungry mouth in the second stanza of the poem.|The poet calls the city a hungry mouth, which is a cool image.
        The servant hides the letter.|By hiding the letter, the servant becomes the hidden power behind every misunderstanding in the play.|The servant hides the letter under a loose board in the kitchen, and soon afterward the other characters arrive and begin to talk.|The servant hides the letter, which made me dislike her.
        The rain stops when the brothers make peace.|The rain stopping as the brothers make peace links the weather to their quarrel, as if nature had shared their anger.|The rain stops when the brothers make peace, and the sun comes out over the farm.|The rain stops when the brothers make peace, which felt satisfying.
        The girl cuts her long hair.|Cutting her hair marks the girl's break from the person her family wanted her to be.|The girl cuts her long hair with her mother's sewing scissors, and then the scene moves on.|The girl cuts her long hair, which I thought was a bold move.
        The clock in the hall has stopped.|The stopped clock shows that the house is trapped in the moment of its loss.|The clock in the hall has stopped at twenty minutes to nine.|The clock in the hall has stopped, which is spooky.
        The captain stays on the sinking ship.|By staying on the sinking ship, the captain shows that his duty matters more to him than his life.|The captain stays on the sinking ship while the passengers row away, and soon afterward the other characters arrive and begin to talk.|The captain stays on the sinking ship, which is very sad.
        The children stop playing when the stranger arrives.|The children's sudden silence shows how fear of the stranger spreads even to the youngest.|The children stop playing when the stranger arrives and run to their houses.|The children stop playing when the stranger arrives, which I understood.
        The king's crown is too large for him.|The crown that is too large shows that the young king is not yet ready for power.|The king's crown is too large for him and slips over his eyes, and then the scene moves on.|The king's crown is too large for him, which is funny.
        The letter arrives a day too late.|The letter's late arrival shows how chance, not choice, rules the lovers' fate.|The letter arrives a day too late, carried by a tired messenger.|The letter arrives a day too late, which made me angry.
        The heroine burns her old diary.|Burning the diary shows that the heroine is ready to let go of the girl she used to be.|The heroine burns her old diary in the fireplace one winter night, and then the scene moves on.|The heroine burns her old diary, which I would never do.
        The speaker addresses the moon.|By speaking to the moon, the speaker shows how alone she is, with no human listener left.|The speaker addresses the moon in each stanza of the poem.|The speaker addresses the moon, which is so romantic.
        The farmer refuses to sell his land.|The farmer's refusal to sell shows that the land is part of who he is, not just property.|The farmer refuses to sell his land to the company, even for a high price, and then the scene moves on.|The farmer refuses to sell his land, which I respect.
        The dog waits at the station every day.|The dog's daily wait at the station turns loyalty into a kind of grief that never ends.|The dog waits at the station every day for nine years.|The dog waits at the station every day, which is adorable.
        The two sisters wear the same dress to the dance.|The matching dresses show that the sisters cannot yet see themselves as separate people.|The two sisters wear the same dress to the dance by accident, and then the scene moves on.|The two sisters wear the same dress to the dance, which is hilarious.
        The narrator never says her own name.|The narrator's missing name suggests that she has lost her sense of self.|The narrator never says her own name in the whole novel.|The narrator never says her own name, which is strange to me.
        The general weeps after the victory.|The general's tears after victory show that he understands the cost of what he has won.|The general weeps after the victory, alone in his tent, and soon afterward the other characters arrive and begin to talk.|The general weeps after the victory, which surprised me.
        The house's lights are left on all night.|The lights left on all night show that the family is still waiting for someone who will not return.|The house's lights are left on all night, every night of the winter.|The house's lights are left on all night, which wastes electricity.
      `,
      (right) => [
        `*${right}* adds what the detail shows and why it matters, which turns the summary into analysis.`,
        `*${right}* 补充了这个细节表明什么、为什么重要，把复述变成了分析。`,
      ],
      [
        [
          "*{wrong}* only adds more plot; it still says what happens, not what it means.",
          "*{wrong}* 只是补充了更多情节，说的仍然是发生了什么，而不是它意味着什么。",
        ],
        [
          "*{wrong}* adds the writer's reaction, which is about the reader rather than a claim about the text.",
          "*{wrong}* 加上的是作者的感受，说的是读者而不是对作品的主张。",
        ],
      ],
    ),
  ],
});

const epicSimile = topic("writing", {
  id: "writing-an-epic-simile",
  title: ["Writing an Epic Simile", "写史诗式明喻"],
  summary: [
    "How to build an epic simile: open with *as when* or *like*, unfold a small scene from everyday life, then return with *so* to the action.",
    "如何构造史诗式明喻：以 *as when* 或 *like* 开头，展开一幅日常生活的小场景，再用 *so* 回到情节。",
  ],
  after: ["epic-conventions"],
  points: [
    label(
      "epic-simile-or-not",
      ["Epic Simile or Not", "是不是史诗式明喻"],
      [
        "An **epic simile** has three parts: it opens with *as when* or *like*, unfolds into a **small scene of its own** over several clauses, and returns with *so* to the main action. A **short simile** compares in a few words (*brave as a lion*). A **metaphor** says one thing *is* another without *like* or *as*. A simile that **never returns** unfolds a scene but forgets to come back with *so*, which leaves the reader lost.",
        "**史诗式明喻**有三个部分：以 *as when* 或 *like* 开头，用几个分句展开**一幅自成一体的小场景**，再用 *so* 回到主要情节。**简短的明喻**只用几个词作比较（*brave as a lion*）。**隐喻**不用 *like* 或 *as*，直接说一样东西*是*另一样东西。**没有回到情节**的明喻展开了场景，却忘了用 *so* 回来，让读者无所适从。",
      ],
      ["What kind of comparison is this?", "这是哪种比较？"],
      `
        As when a farmer's flock is scattered by a sudden storm, and the lambs run bleating every way across the hills, so the soldiers fled across the plain.|an epic simile
        The soldiers fled like frightened lambs.|a short simile
        The soldiers were frightened lambs, scattering in the storm of battle.|a metaphor
        As when a farmer's flock is scattered by a sudden storm, and the lambs run bleating every way across the hills, and the shepherd shouts in vain.|a simile that never returns
        As when a river in spring floods its banks and sweeps away the fences, the bridges and the barns, so the army poured over the walls.|an epic simile
        The army poured over the walls like a flood.|a short simile
        The army was a flood that swept the city away.|a metaphor
        As when a river in spring floods its banks and sweeps away the fences, the bridges and the barns in its brown rush.|a simile that never returns
        Like a hawk that circles high above a field, watching every rustle of the grass, then folds its wings and drops, so the queen waited and then struck.|an epic simile
        The queen struck as fast as a hawk.|a short simile
        The queen was a hawk, circling her enemies.|a metaphor
        Like a hawk that circles high above a field, watching every rustle of the grass, then folds its wings and drops upon a mouse.|a simile that never returns
        As when a child builds a tower of stones on the beach, and the tide creeps in and topples it stone by stone, so the empire slowly fell.|an epic simile
        The empire fell like a tower of sand.|a short simile
        The empire was a sandcastle, waiting for the tide.|a metaphor
        As when a child builds a tower of stones on the beach, and the tide creeps in and topples it stone by stone while the child watches.|a simile that never returns
        As when a blacksmith plunges red-hot iron into water, and it hisses and steams and hardens, so the hero's grief turned to cold resolve.|an epic simile
        The hero's grief hardened like iron.|a short simile
        The hero's grief was red-hot iron, plunged into cold water.|a metaphor
        As when a blacksmith plunges red-hot iron into water, and it hisses and steams and hardens in his hands.|a simile that never returns
        Like bees that pour from a hollow rock, cluster after cluster, humming over the spring flowers, so the people poured from the city gates.|an epic simile
        The people poured out like bees.|a short simile
        The city gates were a hive, and the people its swarming bees.|a metaphor
        Like bees that pour from a hollow rock, cluster after cluster, humming over the spring flowers in the meadow.|a simile that never returns
        As when the wind falls upon a field of wheat, and the heads bow low in long waves, so the crowd bowed before the king.|an epic simile
        The crowd bowed like wheat in the wind.|a short simile
        The crowd was a field of wheat, bowing before the king.|a metaphor
        As when the wind falls upon a field of wheat, and the heads bow low in long waves that run to the edge of the field.|a simile that never returns
        As when a hunter's torch is lifted in the dark forest and the wolves draw back, snarling, from its light, so the hero's sword drove back his enemies.|an epic simile
        The hero's sword shone like a torch.|a short simile
      `,
      {
        "an epic simile": L(
          "史诗式明喻",
          "It opens with *as when* or *like*, unfolds a small scene of its own and returns with *so* to the action.",
          "它以 *as when* 或 *like* 开头，展开一幅自成一体的小场景，再用 *so* 回到情节。",
          "It is not a long comparison that unfolds a scene and returns to the action with *so*.",
          "它不是展开场景、再用 *so* 回到情节的长比喻。",
        ),
        "a short simile": L(
          "简短的明喻",
          "It compares with *like* or *as* in only a few words, without unfolding a scene.",
          "它用 *like* 或 *as* 作比较，只用了几个词，没有展开场景。",
          "It is not a brief comparison with *like* or *as*.",
          "它不是用 *like* 或 *as* 的简短比较。",
        ),
        "a metaphor": L(
          "隐喻",
          "It says that one thing *is* another, without *like* or *as*.",
          "它不用 *like* 或 *as*，直接说一样东西*是*另一样东西。",
          "It does not say that one thing simply *is* another.",
          "它并没有直接说一样东西*是*另一样东西。",
        ),
        "a simile that never returns": L(
          "没有回到情节的明喻",
          "It unfolds a scene but never comes back with *so* to the action it was meant to describe.",
          "它展开了场景，却始终没有用 *so* 回到它要描写的情节。",
          "It does not leave its scene without returning to the action.",
          "它并没有展开场景后不回到情节。",
        ),
      },
    ),
    choose(
      "completing-the-epic-simile",
      ["Completing the Epic Simile", "补全史诗式明喻"],
      [
        "The *so* clause of an epic simile must **match the scene point for point**. If the scene is of a wave that rises, gathers and crashes, the action must also rise, gather and strike. A good *so* clause picks out the same movement or feeling. Two mistakes are common: a return that **does not match** the scene, and a return that **repeats the scene** instead of coming back to the action.",
        "史诗式明喻的 *so* 分句必须与场景**逐点对应**。如果场景是一个浪头涌起、积聚、拍碎，那么情节也必须涌起、积聚、出击。好的 *so* 分句会选出相同的动作或感受。常见的错误有两种：回到情节时**与场景不对应**，以及没有回到情节而是**重复场景**。",
      ],
      ["Which *so* clause best completes the epic simile?", "哪个 *so* 分句最能补全这个史诗式明喻？"],
      `
        As when a wave rises far out at sea, gathers height and crashes on the rocks, ___|so the army gathered on the hill and fell upon the town.|so the army rested quietly in the shade of the trees.|so the wave broke into white foam upon the stones, just as it had done many times before.
        As when a single spark falls on dry grass and the fire spreads across the whole plain, ___|so one rumor spread until the whole city was in revolt.|so the city lay calm and silent under the moon.|so the flames ran on across the dry plain.
        As when a lion, driven from the cattle by the herdsmen's spears, turns back slowly, snarling, ___|so the hero drew back from the walls, angry and unwilling.|so the hero ran happily home to his mother.|so the lion stalked off into the dark hills, just as it had done many times before.
        As when an oak, struck by lightning, crashes down and shakes the whole forest, ___|so the king fell, and the whole kingdom trembled.|so the king laughed and called for more wine.|so the oak lay split and smoking on the ground.
        As when a mother bird flies back and forth all day to feed her crying young, ___|so the general rode tirelessly between his weary troops.|so the general slept late in his warm tent.|so the bird gathered worms for her nest, just as it had done many times before.
        As when the first snow falls softly and silently covers every road and roof, ___|so silence settled over the hall after the queen's words.|so the hall burst into shouting and quarrels.|so the snow lay deep on every road.
        As when a river, blocked by a fallen tree, rises behind it until it bursts through, ___|so the people's anger grew until it broke the king's command.|so the people forgot their anger and went to sleep.|so the river tore the tree away and rushed on, just as it had done many times before.
        As when a hunter waits motionless in the reeds for hours until the deer comes near, ___|so the spy waited patiently until the general let slip his secret.|so the spy shouted out his secret to the crowd.|so the hunter crouched in the cold reeds.
        As when a candle burns brightest just before it goes out, ___|so the old warrior fought most fiercely in his final battle.|so the old warrior grew weaker in every battle.|so the candle flared and then went dark, just as it had done many times before.
        As when wolves circle a lost sheep, closing in step by step, ___|so the enemies circled the young prince, waiting for their chance.|so the enemies scattered and fled from the prince.|so the wolves closed in on the trembling sheep.
        As when a farmer patiently clears a stony field, stone by stone, year after year, ___|so the queen rebuilt her ruined kingdom, slowly and steadily.|so the queen won back her kingdom in a single day.|so the farmer piled the stones along the wall, just as it had done many times before.
        As when the sun breaks through dark clouds and the wet fields shine, ___|so the hero's smile broke through his grief and his friends took heart.|so the hero's grief grew darker and his friends despaired.|so the fields sparkled in the sudden light.
        As when a ship, battered by the storm, finally reaches the quiet harbor, ___|so the weary travelers came at last to their father's house.|so the weary travelers set off again into danger.|so the ship rocked gently at the dock, just as it had done many times before.
        As when a boulder rolls down a mountainside, faster and faster, crushing all in its path, ___|so the charge of the horsemen gathered speed and swept the enemy away.|so the horsemen slowed to a walk and stopped.|so the boulder smashed the trees below.
        As when ice cracks on a frozen lake, first with a small sound, then with a roar, ___|so the quarrel began with a whisper and ended in open war.|so the quarrel ended as quietly as it began.|so the ice split across the whole lake, just as it had done many times before.
        As when a weaver sits at her loom, passing the thread back and forth until a picture appears, ___|so the old storyteller wove many tales into one great history.|so the old storyteller forgot every tale he knew.|so the weaver finished her bright cloth.
        As when a frightened deer leaps from the thicket and races across the open field, ___|so the messenger burst from the forest and ran toward the city.|so the messenger sat down to rest beneath a tree.|so the deer ran on across the meadow, just as it had done many times before.
        As when a gardener prunes a rose so that it will bloom more fully in spring, ___|so the teacher's hard words helped the young poet grow.|so the teacher's hard words made the young poet give up.|so the gardener cut back the long stems.
        As when a flood sweeps away a village and leaves only mud behind, ___|so the war swept through the land and left only ruins.|so the war passed and left the land richer than before.|so the flood left the fields thick with mud, just as it had done many times before.
        As when a falcon is unhooded and launches into the sky toward its prey, ___|so the young warrior, freed at last, rushed toward the enemy.|so the young warrior stayed behind in the camp.|so the falcon soared high above the field.
        As when wildflowers spring up after a fire, ___|so new hope rose in the city after the war.|so the city stayed gray and empty for a hundred years.|so the flowers covered the burned hills, just as it had done many times before.
        As when a stone dropped in still water sends ripples to the farthest shore, ___|so the king's single word was felt in every corner of the land.|so the king's word was heard by no one at all.|so the ripples spread across the pond.
        As when the tide goes out and leaves the ships stranded on the sand, ___|so the army's allies withdrew and left it helpless.|so the army's allies arrived to help in great numbers.|so the ships lay tilted on the empty beach, just as it had done many times before.
        As when a beekeeper smokes the hive and the angry bees pour out in a cloud, ___|so the soldiers poured from the fort when the enemy set it on fire.|so the soldiers stayed calmly inside the fort.|so the bees swarmed around the beekeeper's veil.
        As when a traveler at night sees a single light far off and walks toward it all night, ___|so the exile held to the hope of home through all his wandering.|so the exile gave up hope on his first night away.|so the traveler walked through the dark toward the light, just as it had done many times before.
        As when a blacksmith hammers the glowing iron again and again until it takes its shape, ___|so hardship after hardship shaped the boy into a man.|so the boy's life was easy and he never changed.|so the blacksmith beat the iron into a blade.
        As when the moon rises and silvers the dark sea, ___|so the queen's arrival brought light to the gloomy hall.|so the queen's arrival made the hall darker than before.|so the moon shone over the quiet water, just as it had done many times before.
        As when a herd of horses stampedes, the ground shaking under their hooves, ___|so the crowd rushed toward the gates, and the square trembled.|so the crowd stood still and silent in the square.|so the horses thundered across the plain.
        As when a cloud of locusts darkens the sky and strips the fields bare, ___|so the invading army darkened the land and left nothing behind.|so the invading army planted fields wherever it went.|so the locusts ate every green leaf, just as it had done many times before.
        As when a mountain spring, small at first, grows into a mighty river, ___|so the small rebellion grew into a war that changed the world.|so the small rebellion faded away and was forgotten.|so the spring became a river that ran to the sea.
      `,
      (right) => [`*${right}* returns to the action and matches the scene point for point.`, `*${right}* 回到了情节，而且与场景逐点对应。`],
      [
        [
          "*{wrong}* returns to the action, but its movement or feeling does not match the scene of the simile.",
          "*{wrong}* 回到了情节，但其动作或感受与明喻的场景不对应。",
        ],
        [
          "*{wrong}* only repeats the scene; it never comes back to the action the simile was meant to describe.",
          "*{wrong}* 只是重复了场景，始终没有回到明喻要描写的情节。",
        ],
      ],
    ),
  ],
});

const citing = topic("writing", {
  id: "citing-lines-of-plays-and-poems",
  title: ["Citing Lines of Plays and Poems", "引用剧本和诗歌的诗行"],
  summary: [
    "How to quote verse: a slash between lines, line numbers in parentheses for poems, and act, scene and line for plays.",
    "如何引用诗行：行与行之间用斜线，诗歌在括号中注明行号，剧本注明幕、场和行。",
  ],
  after: ["quoting-a-primary-source"],
  points: [
    choose(
      "the-correct-citation",
      ["The Correct Citation", "正确的引用格式"],
      [
        "When you quote **two or three lines of verse** in your own sentence, keep them in quotation marks and show each line break with a **slash** with a space on each side: “Shall I compare thee to a summer's day? / Thou art more lovely and more temperate” (lines 1–2). For a **poem**, give the line numbers in parentheses after the closing quotation mark. For a **play in verse**, give the **act, scene and line** as numbers separated by periods: (3.1.56). The period of your sentence goes after the parentheses.",
        "在自己的句子中引用**两到三行诗**时，要放在引号里，并用前后各有一个空格的**斜线**表示换行：“Shall I compare thee to a summer's day? / Thou art more lovely and more temperate” (lines 1–2)。引用**诗歌**时，在后引号之后的括号中注明行号。引用**诗体剧本**时，用句点隔开的数字注明**幕、场和行**：(3.1.56)。句子的句号放在括号之后。",
      ],
      ["Which citation is written correctly?", "哪种引用格式是正确的？"],
      `
        Lines 1 and 2 of a sonnet|“Shall I compare thee to a summer's day? / Thou art more lovely and more temperate” (lines 1–2).|“Shall I compare thee to a summer's day? Thou art more lovely and more temperate” (lines 1–2).|“Shall I compare thee to a summer's day? / Thou art more lovely and more temperate.” (lines 1–2)
        Act 3, scene 1, line 56 of a play|Hamlet asks, “To be, or not to be, that is the question” (3.1.56).|Hamlet asks, “To be, or not to be, that is the question” (act three, the first scene, around the middle).|Hamlet asks, “To be, or not to be, that is the question.” (3.1.56)
        Lines 3 and 4 of a poem|The speaker hears “the lake water lapping with low sounds by the shore; / While I stand on the roadway” (lines 3–4).|The speaker hears “the lake water lapping with low sounds by the shore, while I stand on the roadway” (lines 3–4).|The speaker hears “the lake water lapping with low sounds by the shore; / While I stand on the roadway.” (lines 3–4)
        Act 2, scene 2, line 2 of a play|Romeo declares, “But soft, what light through yonder window breaks?” (2.2.2).|Romeo declares, “But soft, what light through yonder window breaks?” (in the balcony scene).|Romeo declares, “But soft, what light through yonder window breaks?” 2.2.2.
        Line 13 of a poem|The speaker admits that the woods are “lovely, dark and deep” (line 13).|The speaker admits that the woods are “lovely, dark and deep” (somewhere near the end).|The speaker admits that the woods are “lovely, dark and deep.” (line 13)
        Act 1, scene 5, line 25 of a play|The ghost commands, “Revenge his foul and most unnatural murder” (1.5.25).|The ghost commands, “Revenge his foul and most unnatural murder” (page of the play where the ghost appears).|The ghost commands, “Revenge his foul and most unnatural murder.” (1.5.25)
        Lines 1 and 2 of a poem|The poet writes, “I wandered lonely as a cloud / That floats on high o'er vales and hills” (lines 1–2).|The poet writes, “I wandered lonely as a cloud that floats on high o'er vales and hills” (lines 1–2).|The poet writes, “I wandered lonely as a cloud / That floats on high o'er vales and hills.” (lines 1–2)
        Act 5, scene 5, line 19 of a play|The king mourns, “Tomorrow, and tomorrow, and tomorrow” (5.5.19).|The king mourns, “Tomorrow, and tomorrow, and tomorrow” (near the end of the play).|The king mourns, “Tomorrow, and tomorrow, and tomorrow.” (5.5.19)
        The opening lines of a poem|The speaker remembers “two roads diverged in a yellow wood, / And sorry I could not travel both” (lines 1–2).|The speaker remembers “two roads diverged in a yellow wood and sorry I could not travel both” (lines 1–2).|The speaker remembers “two roads diverged in a yellow wood, / And sorry I could not travel both.” (lines 1–2)
        Act 1, scene 1, line 1 of a play|The guard's first words are “Who's there?” (1.1.1).|The guard's first words are “Who's there?” (the very first line of the play, in the first scene).|The guard's first words are “Who's there?”. (1.1.1)
        Lines 1 to 3 of a poem|The poem opens, “Because I could not stop for Death / He kindly stopped for me / The carriage held but just ourselves” (lines 1–3).|The poem opens, “Because I could not stop for Death he kindly stopped for me, the carriage held but just ourselves” (lines 1–3).|The poem opens, “Because I could not stop for Death / He kindly stopped for me / The carriage held but just ourselves.” (lines 1–3)
        Act 4, scene 1, line 10 of a play|The witches chant, “Double, double toil and trouble” (4.1.10).|The witches chant, “Double, double toil and trouble” (in the cave scene with the witches).|The witches chant, “Double, double toil and trouble.” (4.1.10)
        Lines 7 and 8 of a sonnet|The speaker notes that “every fair from fair sometime declines, / By chance or nature's changing course untrimmed” (lines 7–8).|The speaker notes that “every fair from fair sometime declines, by chance or nature's changing course untrimmed” (lines 7–8).|The speaker notes that “every fair from fair sometime declines, / By chance or nature's changing course untrimmed.” (lines 7–8)
        Act 3, scene 2, line 73 of a play|Antony begins, “Friends, Romans, countrymen, lend me your ears” (3.2.73).|Antony begins, “Friends, Romans, countrymen, lend me your ears” (at the funeral).|Antony begins, “Friends, Romans, countrymen, lend me your ears.” (3.2.73)
        Lines 15 and 16 of a poem|The speaker promises, “And miles to go before I sleep, / And miles to go before I sleep” (lines 15–16).|The speaker promises, “And miles to go before I sleep, and miles to go before I sleep” (lines 15–16).|The speaker promises, “And miles to go before I sleep, / And miles to go before I sleep.” (lines 15–16)
        Act 2, scene 7, line 139 of a play|Jaques observes, “All the world's a stage” (2.7.139).|Jaques observes, “All the world's a stage” (in his famous speech about the ages of man).|Jaques observes, “All the world's a stage.” (2.7.139)
        Lines 1 and 2 of a poem|The speaker declares, “Do not go gentle into that good night, / Old age should burn and rave at close of day” (lines 1–2).|The speaker declares, “Do not go gentle into that good night, old age should burn and rave at close of day” (lines 1–2).|The speaker declares, “Do not go gentle into that good night, / Old age should burn and rave at close of day.” (lines 1–2)
        Act 1, scene 3, line 78 of a play|Polonius advises, “To thine own self be true” (1.3.78).|Polonius advises, “To thine own self be true” (when he says goodbye to his son).|Polonius advises, “To thine own self be true.” (1.3.78)
        Lines 4 and 5 of a poem|The speaker sees “a host, of golden daffodils; / Beside the lake, beneath the trees” (lines 4–5).|The speaker sees “a host, of golden daffodils, beside the lake, beneath the trees” (lines 4–5).|The speaker sees “a host, of golden daffodils; / Beside the lake, beneath the trees.” (lines 4–5)
        Act 2, scene 2, line 43 of a play|Juliet asks, “What's in a name?” (2.2.43).|Juliet asks, “What's in a name?” (somewhere in act 2).|Juliet asks, “What's in a name?”. (2.2.43)
        Lines 9 and 10 of a sonnet|The speaker vows, “But thy eternal summer shall not fade, / Nor lose possession of that fair thou ow'st” (lines 9–10).|The speaker vows, “But thy eternal summer shall not fade, nor lose possession of that fair thou ow'st” (lines 9–10).|The speaker vows, “But thy eternal summer shall not fade, / Nor lose possession of that fair thou ow'st.” (lines 9–10)
        Act 5, scene 1, line 180 of a play|Hamlet holds the skull and says, “Alas, poor Yorick!” (5.1.180).|Hamlet holds the skull and says, “Alas, poor Yorick!” (in the graveyard).|Hamlet holds the skull and says, “Alas, poor Yorick!”. (5.1.180)
        Lines 11 and 12 of a poem|The speaker hears “the sweep / Of easy wind and downy flake” (lines 11–12).|The speaker hears “the sweep of easy wind and downy flake” (lines 11–12).|The speaker hears “the sweep / Of easy wind and downy flake.” (lines 11–12)
        Act 1, scene 7, line 60 of a play|Lady Macbeth insists, “But screw your courage to the sticking-place” (1.7.60).|Lady Macbeth insists, “But screw your courage to the sticking-place” (when she persuades her husband).|Lady Macbeth insists, “But screw your courage to the sticking-place.” (1.7.60)
        Lines 1 and 2 of a poem about hope|The speaker describes how “Hope is the thing with feathers / That perches in the soul” (lines 1–2).|The speaker describes how “Hope is the thing with feathers that perches in the soul” (lines 1–2).|The speaker describes how “Hope is the thing with feathers / That perches in the soul.” (lines 1–2)
        Act 3, scene 1, line 87 of a play|Hamlet calls death “The undiscovered country” (3.1.87).|Hamlet calls death “The undiscovered country” (in the same speech as “to be or not to be”).|Hamlet calls death “The undiscovered country.” (3.1.87)
        Lines 13 and 14 of a sonnet|The sonnet closes, “So long as men can breathe or eyes can see, / So long lives this, and this gives life to thee” (lines 13–14).|The sonnet closes, “So long as men can breathe or eyes can see, so long lives this, and this gives life to thee” (lines 13–14).|The sonnet closes, “So long as men can breathe or eyes can see, / So long lives this, and this gives life to thee.” (lines 13–14)
        Act 4, scene 3, line 218 of a play|Macduff cries out, “All my pretty ones?” (4.3.218).|Macduff cries out, “All my pretty ones?” (when he learns his family is dead).|Macduff cries out, “All my pretty ones?”. (4.3.218)
        Lines 6 and 7 of a poem|The speaker watches “the leaves fall / And the year turn” (lines 6–7).|The speaker watches “the leaves fall and the year turn” (lines 6–7).|The speaker watches “the leaves fall / And the year turn.” (lines 6–7)
        Act 2, scene 2, line 185 of a play|Juliet sighs, “Parting is such sweet sorrow” (2.2.185).|Juliet sighs, “Parting is such sweet sorrow” (at the end of the balcony scene).|Juliet sighs, “Parting is such sweet sorrow.” (2.2.185)
      `,
      (right) => [
        `*${right}* marks line breaks with a slash, gives the numbers in parentheses and puts the period after them.`,
        `*${right}* 用斜线表示换行，在括号中注明数字，并把句号放在括号之后。`,
      ],
      [
        [
          "*{wrong}* does not cite correctly: it runs lines together without a slash, or replaces the numbers with a vague description.",
          "*{wrong}* 引用格式不正确：没有用斜线就把诗行连在一起，或者用含糊的描述代替了数字。",
        ],
        [
          "*{wrong}* puts the period in the wrong place: it belongs after the parentheses, not inside the quotation or before the citation.",
          "*{wrong}* 句号的位置不对：它应该放在括号之后，而不是放在引号内或引用标注之前。",
        ],
      ],
    ),
    label(
      "what-the-citation-tells",
      ["What the Citation Tells", "引用标注说明了什么"],
      [
        "A citation tells the reader where to find the quotation. In **(3.1.56)**, the numbers are the **act**, the **scene** and the **line**: act 3, scene 1, line 56. In **(lines 5–8)**, the numbers are **line numbers** of a poem. A **slash** inside a quotation shows **where one line of verse ends** and the next begins. And a **page number** alone, as in (45), is used for prose, which has no line numbers.",
        "引用标注告诉读者在哪里能找到引文。在 **(3.1.56)** 中，数字依次是**幕**、**场**和**行**：第 3 幕第 1 场第 56 行。在 **(lines 5–8)** 中，数字是诗歌的**行号**。引文中的**斜线**表示**一行诗在哪里结束**、下一行从哪里开始。只有**页码**的标注，如 (45)，用于没有行号的散文。",
      ],
      ["In this citation, what does the marked part tell the reader?", "在这个引用中，标出的部分告诉读者什么？"],
      `
        In (3.1.56), the number 3|the act
        In (3.1.56), the number 1|the scene
        In (3.1.56), the number 56|the line
        In (2.2.43), the first 2|the act
        In (2.2.43), the second 2|the scene
        In (2.2.43), the number 43|the line
        In (5.5.19), the first 5|the act
        In (5.5.19), the number 19|the line
        In (1.7.60), the number 7|the scene
        In (4.3.218), the number 218|the line
        In (4.3.218), the number 4|the act
        In (4.3.218), the number 3|the scene
        In (1.5.25), the number 1|the act
        In (1.5.25), the number 5|the scene
        In (2.7.139), the number 139|the line
        In (2.7.139), the number 7|the scene
        In (5.1.180), the number 1|the scene
        In (3.2.73), the number 73|the line
        In (3.2.73), the number 3|the act
        In (1.3.78), the number 3|the scene
        In (1.1.1), the last 1|the line
        In (1.1.1), the first 1|the act
        In (4.1.10), the number 10|the line
        In (4.1.10), the number 4|the act
        In (2.2.185), the number 185|the line
        In (3.1.87), the number 1|the scene
        In (5.3.120), the number 5|the act
        In (5.3.120), the number 3|the scene
        In (5.3.120), the number 120|the line
        In (1.2.135), the number 2|the scene
      `,
      {
        "the act": L(
          "幕",
          "The first number of a play citation is the act, the largest division of the play.",
          "剧本引用标注的第一个数字是幕，即剧本最大的划分单位。",
          "This number is not the first one, so it is not the act.",
          "这个数字不是第一个，所以不是幕。",
        ),
        "the scene": L(
          "场",
          "The middle number of a play citation is the scene within the act.",
          "剧本引用标注中间的数字是该幕中的场。",
          "This number is not the middle one, so it is not the scene.",
          "这个数字不是中间那个，所以不是场。",
        ),
        "the line": L(
          "行",
          "The last number of a play citation is the line within the scene.",
          "剧本引用标注的最后一个数字是该场中的行。",
          "This number is not the last one, so it is not the line.",
          "这个数字不是最后一个，所以不是行。",
        ),
      },
    ),
  ],
});

/** writingTopics9a are the first writing topics of grade 9 checked by rule. */
export const writingTopics9a: readonly TopicDef[] = [thesis, analysis, epicSimile, citing];
