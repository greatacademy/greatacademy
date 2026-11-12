// Grade 10: writing judged by a model, part one: a thematic analysis, a comparison of two texts and a descriptive
// essay on a place.

import { type TopicDef, t } from "@ga/content";
import { point, type WritingItem, writingGenerator } from "@ga/subject-english";
import { after, covers } from "../grade-5/links.ts";
import { criterion, onePiece } from "../grade-5/writing-judged-a.ts";

/** limits are the length limits of a grade 10 essay. */
export const limits = { minWords: 150, maxChars: 4800 };

/** themeBank gives a short original fable or story whose theme the student analyzes. */
const themeBank: readonly WritingItem[] = [
  {
    task: "Write a short analysis of the theme of this fable. A crow found a silver spoon and hid it in her nest. Every day she found another shiny thing: a ring, a button, a key. Soon the nest was so full of treasure that there was no room for her eggs, and when spring came, she had nothing to hatch.",
    model:
      'The fable of the crow suggests that the desire to possess things can crowd out what gives life its meaning. The fable builds this idea through a simple pattern of accumulation.\n\nAt first, the crow\'s behavior seems harmless. She finds "a silver spoon" and hides it, a small and natural act. But the list that follows, "a ring, a button, a key," shows the habit growing day after day. The rhythm of the list mirrors the way collecting becomes compulsive: each new object seems to call for the next.\n\nThe turning point comes with the nest itself. A nest exists for eggs, for the future and for new life. When it becomes "so full of treasure that there was no room for her eggs," the crow has replaced the purpose of her home with possessions. The word "treasure" is ironic, because the shiny objects have no value to a bird.\n\nThe ending is quiet but severe: "she had nothing to hatch." The fable does not punish the crow with a dramatic disaster. Instead, it shows a loss that she chose without noticing, which makes the warning more unsettling for human readers.',
  },
  {
    task: "Write a short analysis of the theme of this story. A young violinist practiced every day for the city competition. On the morning of the final, she saw an old street musician whose violin had been smashed by a passing car. She gave him hers and played in the final on a borrowed instrument she did not know. She came fourth. Years later, she said it was the only performance she still remembered.",
    model:
      'This story suggests that the moments that define us are often the ones in which we give up a chance to win. The theme emerges from the contrast between public success and private choice.\n\nThe story first establishes how much the competition matters. The violinist "practiced every day," and the final is the goal of all that work. By placing the street musician\'s misfortune on "the morning of the final," the writer makes her choice as costly as possible: she cannot help him without risking her own success.\n\nHer decision is described without commentary. She simply "gave him hers." The plainness of this sentence suggests that generosity, in the moment, does not feel heroic; it is just the obvious thing to do.\n\nThe result is deliberately unspectacular. She "came fourth," a result no one would remember. Yet the final sentence reverses our expectations: it was "the only performance she still remembered." The competition she trained for has faded, but the sacrifice has lasted. The story thus measures a life not by its rankings but by the moments in which a person chose someone else over herself.',
  },
  {
    task: "Write a short analysis of the theme of this fable. A king ordered that every mirror in his kingdom be broken, because they showed him growing old. His courtiers praised his youth every day. When he died, the people found that he had not seen his own face for thirty years, and that no one in the palace knew how to tell the truth.",
    model:
      'This fable suggests that a ruler who cannot bear the truth will end up surrounded by people who cannot speak it. The theme develops through the image of the mirror and the behavior of the court.\n\nThe king\'s order to break "every mirror in his kingdom" is extreme and absurd, which marks the story as a fable about pride. Mirrors are honest objects: they show what is there. By destroying them, the king destroys the one source of information that cannot flatter him.\n\nThe courtiers then replace the mirrors. They "praised his youth every day," offering him the image he wants instead of the one that is real. The fable suggests that flattery is a kind of false mirror, one that power creates around itself.\n\nThe final sentence widens the damage. The king has lost the sight of his own face, but the court has lost something greater: "no one in the palace knew how to tell the truth." Thirty years of comfortable lies have made honesty impossible. The fable therefore warns that vanity in leaders does not stay private; it corrupts everyone who serves them.',
  },
  {
    task: "Write a short analysis of the theme of this story. Two brothers inherited their father's orchard. They argued over where the boundary between their halves should run and built a wall down the middle. The wall cut off the stream from one side and the sun from the other. Within five years both halves had died, and the brothers sold the land to the same buyer, who knocked down the wall.",
    model:
      'The story of the orchard suggests that when people divide what should be shared, everyone loses. The theme is carried mainly by the symbol of the wall.\n\nThe orchard begins as an inheritance from a father, a single living thing that the brothers receive together. Their argument over "where the boundary between their halves should run" turns a gift into a dispute about ownership. The story never tells us who was right, which suggests that being right does not matter.\n\nThe wall is the center of the story. It is built to protect each brother\'s share, but it does the opposite: it "cut off the stream from one side and the sun from the other." The orchard needed both water and light, just as the brothers needed each other. In trying to secure their halves, they made both halves impossible to keep alive.\n\nThe ending is bitterly ironic. The brothers sell to "the same buyer," who "knocked down the wall." Only a stranger, with no pride to defend, can see that the land works as one. The story leaves readers with a quiet question about the walls they build in their own families.',
  },
  {
    task: "Write a short analysis of the theme of this story. Every evening, an old woman left a light in her window for her son, who had gone to sea twenty years before and never returned. The neighbors called her foolish. When she died, they found the lamp still burning, and one of them, without a word, refilled it with oil.",
    model:
      'This story suggests that hope can be meaningful even when it is not rewarded, and that it can pass from one person to another. The theme grows through the image of the lamp and the change in the neighbors.\n\nThe old woman\'s habit is described as a ritual: she lights the lamp "every evening" for a son gone "twenty years." The length of time makes her hope seem unreasonable, and the neighbors say so directly when they call her "foolish." The story invites us to share their view at first.\n\nThe lamp, however, is more than a signal to a lost sailor. It represents the refusal to give up on love. It keeps burning after the woman herself has died, as if her hope has outlived her.\n\nThe final action reverses the neighbors\' judgment. One of them "refilled it with oil," and the phrase "without a word" suggests that the act cannot be explained, only performed. The neighbor does not expect the son to come home either. Instead, the story implies, the neighbor has understood that keeping a light burning is a way of honoring love, not a prediction about the future.',
  },
  {
    task: "Write a short analysis of the theme of this fable. A fox told the hens that the farmer planned to eat them and offered to lead them to safety in the forest. The hens were grateful and followed him. The fox was never hungry again.",
    model:
      'This brief fable suggests that people are most easily exploited by those who claim to protect them from danger. Its theme depends on irony and on what the fable leaves unsaid.\n\nThe fox\'s speech contains a half-truth. The farmer probably does plan to eat the hens, so the threat he describes is real. This is what makes his trick effective: he uses a genuine fear to win their trust. The fable suggests that manipulation works best when it begins with something true.\n\nThe hens are "grateful." This single word is the most painful in the fable, because their gratitude is directed at the one creature certain to destroy them. They escape a distant danger by running straight into a closer one.\n\nThe final sentence is a masterpiece of understatement: "The fox was never hungry again." The fable never describes the hens\' deaths; it lets the reader work out what happened. This silence makes the lesson more chilling. The reader, like the hens, understands too late. The fable thus warns its audience to ask what a self-appointed protector stands to gain.',
  },
  {
    task: 'Write a short analysis of the theme of this story. A boy spent a whole summer building a model ship inside a glass bottle. On the last day, his little sister knocked it off the shelf, and it shattered. He was about to shout at her when he saw her face. He picked up the pieces and said, "Now we can build the next one together."',
    model:
      'This story suggests that how we respond to loss can matter more than the loss itself. The theme develops through the contrast between the work the boy has done and the choice he makes in a single moment.\n\nThe story first stresses the value of the ship. The boy spent "a whole summer" on it, and building a ship inside a bottle demands patience and delicate skill. When it "shattered" on "the last day," the timing makes the loss as painful as possible.\n\nThe turning point is brief: "He was about to shout at her when he saw her face." The boy\'s anger is natural and even justified. What stops him is not a rule but an act of seeing; he notices his sister\'s fear and guilt. The story suggests that compassion begins with paying attention to another person.\n\nHis final words transform the meaning of the loss. By saying "we can build the next one together," he turns an accident into an invitation. The broken ship becomes the beginning of something shared. The story implies that the true achievement of the summer is not the ship but the kind of brother he chooses to be.',
  },
  {
    task: "Write a short analysis of the theme of this story. A town voted to cut down the ancient oak in its square to make room for parking. On the day of the felling, the oldest man in town stood with his back against the trunk. One by one, other people joined him, until the woodcutters packed up their saws and left.",
    model:
      'This story suggests that one person\'s quiet courage can awaken the conscience of a whole community. The theme emerges through the symbol of the oak and the gradual growth of the protest.\n\nThe oak is described as "ancient," a living link to the town\'s past. The reason for cutting it down, "to make room for parking," is deliberately trivial. The contrast suggests that the town is about to trade something irreplaceable for mere convenience.\n\nThe resistance begins with "the oldest man in town." His age connects him to the tree: both have witnessed the town\'s history. He does not argue or shout; he simply stands "with his back against the trunk." The gesture is physical and silent, yet it is more powerful than a speech.\n\nThe phrase "One by one" is the heart of the story. The other townspeople do not join all at once; each makes a separate decision, encouraged by those already standing there. The story suggests that courage is contagious. By the end, the woodcutters leave without any confrontation. The town has reversed its own vote, not through debate but through people discovering what they valued when it was nearly too late.',
  },
  {
    task: "Write a short analysis of the theme of this fable. A peacock laughed at a plain brown sparrow for its dull feathers. That winter, a hawk circled the field. The sparrow hid among the dry leaves, invisible. The peacock's tail glittered in the snow.",
    model:
      'This fable suggests that the qualities others mock may be the very ones that protect us, while the qualities we are proud of can expose us to danger. The theme is built through contrast and through an ending that is shown rather than stated.\n\nThe fable opens with the peacock\'s scorn. It "laughed" at the sparrow\'s "dull feathers," judging the smaller bird entirely by appearance. In ordinary life, the peacock\'s beauty would seem like an advantage, and the sparrow\'s plainness like a failing.\n\nThe arrival of the hawk changes the standard of value. In winter, among "dry leaves," brown feathers become camouflage, and the sparrow becomes "invisible." What the peacock mocked is now the sparrow\'s means of survival.\n\nThe final image is striking: "The peacock\'s tail glittered in the snow." The word "glittered" recalls the beauty the peacock was proud of, but here it is a signal to the hunter. The fable never says that the hawk catches the peacock; it trusts the reader to see what will happen. This restraint makes the lesson sharper. Pride in appearance, the fable implies, can blind us to how circumstances may change.',
  },
  {
    task: 'Write a short analysis of the theme of this story. A girl promised her dying grandfather that she would keep his bakery open. For a year she rose at four, burned her hands and lost money. One morning an old customer tasted her bread and said, "It tastes like his." She cried, and then she changed the recipe and made it her own.',
    model:
      'This story suggests that honoring someone we have lost does not mean becoming a copy of them; it means carrying their gift forward in our own way. The theme develops through the girl\'s struggle and her final decision.\n\nThe promise to her grandfather sets the story in motion, and the details of her year show its cost. She "rose at four, burned her hands and lost money." These hardships suggest that she is driven by loyalty rather than by love of the work itself. She is trying to keep a dead man\'s life going.\n\nThe customer\'s comment, "It tastes like his," is the turning point. It proves that she has succeeded in imitating her grandfather perfectly. Her tears suggest relief and grief at once: the promise is fulfilled, but the bakery is still his, not hers.\n\nHer response is surprising. Instead of preserving the recipe, she "changed the recipe and made it her own." The story implies that the truest way to keep a promise to the dead is to let their legacy grow. By changing the bread, she does not betray her grandfather; she finally becomes his heir.',
  },
  {
    task: "Write a short analysis of the theme of this story. The village had a rule: no one could leave before the age of twenty. Lina counted the days. On her twentieth birthday she walked to the edge of the valley, looked down at the road to the city and, for reasons she could not explain, turned back home.",
    model:
      'This story suggests that freedom is not the same as the desire to leave, and that the meaning of home can only be understood when we are free to choose it. The theme develops through the rule, Lina\'s waiting and her unexpected decision.\n\nThe village rule frames home as a kind of prison. Because no one may leave "before the age of twenty," staying is not a choice but an obligation. Lina\'s habit of counting "the days" shows how strongly she resents this. The reader expects her story to end with escape.\n\nThe moment at "the edge of the valley" is the climax. For the first time, the road to the city is open to her. The writer places her at a literal and symbolic border between the life she knows and the one she imagined.\n\nHer decision to turn back is presented "for reasons she could not explain." This ambiguity is important. The story does not claim that the village is better than the city. Instead, it suggests that once staying becomes a free choice, it may feel entirely different. What she rejected was not her home, but the absence of choice.',
  },
  {
    task: "Write a short analysis of the theme of this story. A famous painter refused to sell his best painting to a museum for a fortune. When asked why, he said it was not finished. He worked on it for the rest of his life. After his death, the museum found that he had painted over it so many times that the canvas had become black.",
    model:
      'This story suggests that the pursuit of perfection can destroy the very thing it aims to improve. The theme develops through the painter\'s refusal, his endless work and the shocking final image.\n\nThe story begins with an act that seems admirable. The painter turns down "a fortune" for his "best painting," which suggests that he values art above money. His explanation, that it was "not finished," sounds like the humility of a true artist.\n\nHowever, the phrase "for the rest of his life" changes our view. A painting that is never finished is no longer a work in progress; it has become an obsession. The story implies that the painter could not accept anything less than perfect, and that this standard could never be met.\n\nThe ending turns this obsession into a powerful image. The canvas "had become black." Every improvement has been covered by another, until nothing remains. The painting that was once his best is now nothing at all. The story\'s irony is clear: the painter protected his masterpiece from the world, but he could not protect it from himself. The story warns that knowing when to stop is part of creating anything worthwhile.',
  },
];

/** compareBank gives two short original texts on one subject for the student to compare. */
const compareBank: readonly WritingItem[] = [
  {
    task: 'Write a short essay comparing how these two texts present war. Text A, a poem: "The drums were loud, the flags were bright, / we marched to glory in the light." Text B, a soldier\'s letter: "Mother, the mud is up to our knees. Tom died yesterday. Nobody here talks about glory."',
    model:
      'Both texts describe soldiers going to war, but they present it in opposite ways: the poem celebrates war as glorious, while the letter exposes its reality as suffering and loss.\n\nThe poem relies on sound and color. Its "drums" are "loud" and its "flags" are "bright," images of parades rather than battles. The regular rhyme of "bright" and "light" gives the lines a marching rhythm, so that the form itself feels confident and proud. The poem\'s key word is "glory," and war is presented as a journey toward it.\n\nThe letter, by contrast, focuses on the body and on death. "The mud is up to our knees" replaces the poem\'s bright colors with dirt and discomfort. The sentence "Tom died yesterday" is short and flat, as if the writer is too tired or numb to say more. Most powerfully, the letter answers the poem directly: "Nobody here talks about glory."\n\nThe difference in form explains the difference in view. The poem is public and written to inspire, while the letter is private and written to a mother. Read together, the texts suggest that the glory of war exists mainly for those who are far from it.',
  },
  {
    task: 'Write a short essay comparing how these two texts present the city. Text A, a travel advertisement: "Discover a city that never sleeps: dazzling lights, endless shopping and a thrill on every corner!" Text B, a diary entry: "Another night awake. The sirens, the neon through the curtain, the neighbors fighting. I miss the silence of the farm."',
    model:
      'Both texts describe a city that is awake at night, but the advertisement presents this as exciting, while the diary presents it as exhausting and lonely.\n\nThe advertisement is written to sell. It addresses the reader directly with the command "Discover," and it piles up attractive phrases: "dazzling lights, endless shopping and a thrill on every corner." The exclamation mark adds energy. Even the phrase "never sleeps" is meant as praise; it suggests constant opportunity.\n\nThe diary turns the same features into problems. "Another night awake" echoes the idea of a city that never sleeps, but now sleeplessness is a burden on a real person. The "neon" that might be "dazzling" in the advertisement is something that comes "through the curtain," an intrusion into private space. The list of "sirens," lights and fighting neighbors gives a picture of noise and conflict rather than thrills.\n\nThe last sentence of the diary reveals the writer\'s perspective: "I miss the silence of the farm." The advertisement speaks to visitors who will stay for a few days; the diary speaks for someone who must live there. Together, the texts show that the same city can be a holiday or a hardship, depending on who experiences it.',
  },
  {
    task: 'Write a short essay comparing how these two texts present the sea. Text A, from a fisherman\'s memoir: "The sea fed my family for three generations, and it took my brother. I respect it the way you respect a hard father." Text B, from a holiday brochure: "Relax on golden sands and let the gentle waves wash your worries away."',
    model:
      'Both texts describe the sea, but the memoir presents it as a powerful force that gives and takes life, while the brochure presents it as a soft and harmless setting for relaxation.\n\nThe memoir speaks from long experience. The sea has "fed my family for three generations," which shows that for the fisherman it is a source of work and survival. Yet in the same sentence, it "took my brother." The two halves of the sentence balance gift and loss, so that the sea seems both generous and deadly. The fisherman\'s comparison is especially revealing: he respects the sea "the way you respect a hard father." This simile suggests authority, discipline and a love that includes fear.\n\nThe brochure offers no such complexity. Its sands are "golden" and its waves are "gentle," words chosen to soothe. The waves "wash your worries away," giving the sea a caring role. Danger is completely absent.\n\nThe difference reflects each writer\'s purpose and relationship with the sea. The brochure must make the sea attractive to strangers for a week. The fisherman has lived with it all his life and knows it as something that cannot be controlled. Read together, the texts suggest that only those who depend on nature truly understand its power.',
  },
  {
    task: 'Write a short essay comparing how these two texts present the same factory closing. Text A, a company statement: "To remain competitive, we are consolidating our operations. We thank our valued employees for their contribution." Text B, a worker\'s interview: "Thirty-one years I worked there. They told us on a Friday by email. My son works there too."',
    model:
      'Both texts concern the closing of a factory, but the company statement uses vague and distant language to soften the event, while the worker\'s interview gives it a human face and a personal cost.\n\nThe company statement never uses the word "close." Instead, it speaks of "consolidating our operations," a phrase that sounds technical and neutral. The reason offered, "to remain competitive," presents the decision as necessary and sensible. Even the thanks to "our valued employees" feels formal and general; no individual is named, and nothing is said about what will happen to them.\n\nThe interview, by contrast, is full of specific details. "Thirty-one years" measures the worker\'s loyalty in a single number. "They told us on a Friday by email" shows how impersonal the decision felt, which quietly contradicts the statement\'s claim that employees are "valued." The final sentence, "My son works there too," reveals that the loss reaches across two generations of one family.\n\nThe contrast in style reflects a contrast in power. The company chooses abstract words because it wants the closing to seem reasonable. The worker speaks in short, plain sentences because he is describing something that has happened to him. Together, the texts show how language can hide the human consequences of a decision.',
  },
  {
    task: 'Write a short essay comparing how these two texts present growing old. Text A, a poem: "My hands are maps of every road I\'ve walked; / each wrinkle is a story I have told." Text B, an advertisement: "Fight the signs of aging! Our cream erases wrinkles in just seven days."',
    model:
      'Both texts focus on wrinkles as a sign of age, but the poem treats them as a record of a meaningful life, while the advertisement treats them as a problem to be eliminated.\n\nThe poem uses metaphor to give value to the aging body. The speaker\'s hands are "maps of every road I\'ve walked," which suggests that the lines on the skin trace a life\'s journeys. In the second line, "each wrinkle is a story I have told." Age becomes a form of memory and experience, something to be proud of. The calm, regular rhythm of the lines matches this acceptance.\n\nThe advertisement uses the language of battle. It commands the reader to "Fight the signs of aging!" and promises that its cream "erases wrinkles." The verb "erases" is telling: what the poem sees as stories, the advertisement wants to wipe out. The promise of results "in just seven days" adds urgency, as if aging were an emergency.\n\nThe two purposes explain the two attitudes. The advertisement needs readers to feel that aging is bad, because only then will they buy the cream. The poem has nothing to sell and can therefore celebrate what age brings. Read together, the texts reveal how commercial messages can teach people to be ashamed of something natural.',
  },
  {
    task: 'Write a short essay comparing how these two texts present a storm. Text A, a weather report: "Winds of up to 120 kilometers per hour are expected overnight. Residents should stay indoors." Text B, a short story: "The wind came for the house like an animal, clawing at the roof, howling at the door, while we held each other in the dark."',
    model:
      'Both texts describe the same kind of event, a violent storm, but the weather report presents it as information to be acted on, while the story presents it as a frightening experience to be felt.\n\nThe weather report is precise and impersonal. It gives a measurement, "up to 120 kilometers per hour," and a time, "overnight." Its second sentence is an instruction: "Residents should stay indoors." There are no descriptive words and no emotions. The writer\'s goal is to help readers stay safe, so clarity matters more than vividness.\n\nThe story uses figurative language to make the storm alive. The wind "came for the house like an animal," a simile that turns weather into a predator. The verbs "clawing" and "howling" continue the image, so that the wind seems to attack deliberately. The final clause shifts from the storm to the people: "we held each other in the dark." The danger is now measured by fear and closeness rather than by numbers.\n\nThe texts serve different needs. The report prepares people before the storm; the story captures what it is like to live through one. Neither is more true than the other. Together, they show that the same event can be understood through facts or through feeling, and that both kinds of understanding are useful.',
  },
  {
    task: 'Write a short essay comparing how these two texts present homework. Text A, from a school newsletter: "Homework builds discipline and strengthens learning outside the classroom." Text B, from a student\'s blog: "Five hours a night. I haven\'t seen my friends in weeks. I learn more when I sleep."',
    model:
      'Both texts address homework, but the newsletter presents it as a benefit to students, while the blog presents it as a burden that harms them.\n\nThe newsletter uses general and positive language. Homework "builds discipline" and "strengthens learning," two claims that sound reasonable but are not supported by any detail. The sentence speaks about students as a group, from the point of view of the school. It describes what homework is supposed to achieve rather than what it is actually like.\n\nThe blog speaks from inside the experience. Its first fragment, "Five hours a night," gives a specific and startling amount. The next sentence, "I haven\'t seen my friends in weeks," shows the social cost that the newsletter ignores. The final sentence, "I learn more when I sleep," directly challenges the newsletter\'s claim about learning, suggesting that rest may do more for a student than extra work.\n\nThe style of each text reflects its author. The newsletter is formal and confident, written by an institution defending its policy. The blog is short, personal and tired, written by someone living with the policy every night. Read side by side, the texts suggest that a policy can look very different from above and from below.',
  },
  {
    task: 'Write a short essay comparing how these two texts present a mountain. Text A, from a climber\'s journal: "Summit at last. My lungs burned and my toes were numb, but I have never felt so alive." Text B, from a local legend: "The old ones say the mountain is a sleeping god, and those who climb it wake his anger."',
    model:
      'Both texts are about climbing a mountain, but the journal presents the climb as a personal triumph, while the legend presents the mountain as sacred and the climb as a dangerous offense.\n\nThe climber\'s journal centers on the self. "Summit at last" is a cry of achievement, and the phrase "at last" suggests a long and difficult effort. The physical details, "my lungs burned and my toes were numb," show the cost of the climb. Yet these pains only make the ending stronger: "I have never felt so alive." For the climber, the mountain is a challenge to be overcome.\n\nThe legend sees the mountain in a completely different way. It is "a sleeping god," a being to be respected rather than conquered. The phrase "The old ones say" places the legend in a long tradition of shared wisdom, unlike the journal\'s single voice. In this view, climbing does not prove strength; it "wakes his anger."\n\nThe contrast raises a question about perspective. The climber values the mountain for what it gives him, a feeling of being alive. The legend values it for what it is in itself. Read together, the texts suggest that achievement for one person may be disrespect for another, especially when a visitor meets a place that others hold sacred.',
  },
  {
    task: 'Write a short essay comparing how these two texts present a new smartphone. Text A, a company launch speech: "This is not just a phone. It is a window to the world, a camera, a friend in your pocket." Text B, a parent\'s opinion column: "My daughter has a window to the world in her pocket. She has not looked out of a real window in months."',
    model:
      'Both texts use the same image, the phone as "a window to the world," but the launch speech uses it to praise the phone, while the column turns it around to criticize the phone\'s effect on young people.\n\nThe speech builds excitement through a series of metaphors. "This is not just a phone" raises expectations, and the list that follows, "a window to the world, a camera, a friend in your pocket," makes the phone sound like far more than a device. The phrase "a friend in your pocket" is especially persuasive, because it suggests that the phone can satisfy a human need for company.\n\nThe column borrows the speech\'s metaphor exactly: "My daughter has a window to the world in her pocket." At first, the sentence seems to agree. The second sentence then reveals the irony: "She has not looked out of a real window in months." The contrast between a virtual window and a "real" one suggests that the phone has replaced the world rather than opened it.\n\nThe parent\'s strategy is effective because it uses the company\'s own words against it. The speech offers a promise; the column shows its cost in one family. Together, the texts reveal how the same image can be used both to sell a product and to question it.',
  },
  {
    task: 'Write a short essay comparing how these two texts present a forest. Text A, a timber company report: "The northern forest contains an estimated 4 million cubic meters of harvestable wood." Text B, a poem: "Here the owl keeps her ancient watch, / and roots hold hands beneath the moss."',
    model:
      'Both texts describe the same forest, but the report presents it as a resource to be measured and used, while the poem presents it as a living community to be valued for its own sake.\n\nThe report reduces the forest to a number: "an estimated 4 million cubic meters of harvestable wood." The trees are not named or described; they appear only as "wood," and the word "harvestable" suggests that their purpose is to be cut. The language is precise and impersonal, which fits a document written for business decisions.\n\nThe poem, by contrast, fills the forest with life and relationships. The owl "keeps her ancient watch," a phrase that suggests age, wisdom and guardianship. The second line uses personification: roots "hold hands beneath the moss." This image turns the hidden network of roots into a picture of friendship and connection. The forest becomes something like a family.\n\nThe difference in vocabulary reflects a difference in values. For the company, the forest matters for what it can become; for the poet, it matters for what it already is. The report\'s numbers are accurate, but they leave out the owl and the roots entirely. Read together, the texts suggest that how we describe nature shapes how we are willing to treat it.',
  },
  {
    task: 'Write a short essay comparing how these two texts present a marathon runner. Text A, a sports report: "Kiptum crossed the line in 2:01:09, breaking the course record by forty seconds." Text B, the runner\'s own words: "At kilometer thirty-five I wanted to stop. I thought of my mother selling vegetables at the market at dawn, and I kept running."',
    model:
      'Both texts describe the same race, but the sports report presents the runner\'s achievement as a measurable result, while the runner\'s own words reveal the private struggle and motivation behind it.\n\nThe report is built on numbers. It gives an exact time, "2:01:09," and a precise margin, "forty seconds." The verb "breaking" emphasizes the record, which is what matters to readers who follow the sport. The report tells us what happened at the finish line, but nothing about the experience of getting there.\n\nThe runner\'s account focuses on a single moment inside the race. "At kilometer thirty-five I wanted to stop" admits weakness, something a record time hides completely. The runner then explains what kept him going: the memory of his mother "selling vegetables at the market at dawn." This image connects his success to his family\'s hard work and suggests that he is running for her as well as for himself.\n\nTogether, the texts show two sides of achievement. The report offers the public story, clear and impressive. The runner offers the human story, full of doubt and love. A reader who saw only the report would know that he won, but only his own words explain why he did not give up.',
  },
  {
    task: 'Write a short essay comparing how these two texts present a refugee camp. Text A, an official update: "The camp currently houses 42,000 people. Food distribution operates on a weekly schedule." Text B, a child\'s drawing described by a teacher: "She drew a tent, a sun and a door. When I asked about the door, she said, \'That is our house at home. We will go back.\'"',
    model:
      'Both texts describe life in a refugee camp, but the official update presents it as a problem of numbers and organization, while the child\'s drawing presents it through hope and the memory of home.\n\nThe update is brief and factual. It reports that the camp "houses 42,000 people," a number so large that the individuals disappear inside it. The second sentence, about "food distribution" on "a weekly schedule," shows the practical concerns of the organizations running the camp. The text is useful, but it says nothing about what the people in the camp feel or want.\n\nThe teacher\'s description gives us one of those 42,000 people. The drawing contains simple images: "a tent, a sun and a door." The tent is the child\'s present. The door is surprising, since tents do not have doors, and the child explains that it is "our house at home." Her final words, "We will go back," reveal a hope that the update leaves out completely.\n\nThe contrast between the two texts is a contrast between scale and detail. The update helps readers understand the size of the crisis; the drawing helps them understand its meaning for a single family. Read together, they suggest that statistics can tell us how many people suffer, but only individual voices can tell us what they have lost.',
  },
];

/** placeBank asks for a descriptive essay on a place. */
const placeBank: readonly WritingItem[] = [
  {
    task: "Write a descriptive essay about a market at dawn, using details of several senses and building a single dominant impression.",
    model:
      "At five in the morning, the market is not yet a market. It is a place waking up, slowly and noisily, like a giant stretching its arms.\n\nThe first thing I notice is the cold. It rises from the wet concrete and creeps through the soles of my shoes. Under the flickering lights, the stall owners move in silence, their breath forming small clouds as they lift crates of tomatoes and cabbages from their vans.\n\nThen the sounds begin. A metal shutter rattles up. Someone drops a box of oranges, and they roll in every direction while a boy laughs and chases them. The fishmonger sharpens his knife against a stone with a steady scrape, scrape, scrape that sounds almost like a song.\n\nThe smells arrive next, layered on top of one another: the salt of the fish on their bed of ice, the earthy dust of potatoes, the sweetness of the first loaves from the bakery stall at the corner. By six, a radio is playing, and the first customers are arriving with their baskets.\n\nAs the sky turns from gray to pale gold, I realize that I have been watching something like a performance. Every day, before the city wakes, these people build their small world from nothing, and every evening they take it down again.",
  },
  {
    task: "Write a descriptive essay about an abandoned building you know or imagine, creating a mood of loss through specific details.",
    model:
      "The old cinema on Mill Street has been closed for eleven years, but it still has its name. Six red letters hang above the entrance, though the second one has fallen, so that it now announces a word that means nothing.\n\nThe glass doors are covered with posters for concerts that happened long ago. Through a gap between them, I can see the lobby. A ticket booth stands in the corner, its little window cracked. On the counter, a single paper cup has been left beside the cash register, as if someone stepped away for a moment and never came back.\n\nThe smell is what surprises me most. Even from the doorway, there is a faint trace of popcorn under the damp and the dust, a ghost of the thousands of evenings that happened here. The carpet, once a deep red, has faded to the color of old bricks.\n\nIn the auditorium, according to my grandfather, there were three hundred velvet seats. He met my grandmother in the back row. Now pigeons nest in the projection room, and their wings make a soft clapping sound when they fly through the broken skylight.\n\nIt is strange to mourn a building. But standing here, I understand that buildings hold the moments that people forget to keep.",
  },
  {
    task: "Write a descriptive essay about a kitchen in a home you know well, revealing the people who use it through the details of the room.",
    model:
      'My grandmother\'s kitchen is small, but it holds the whole family.\n\nThe first thing anyone notices is the table. It is wooden and heavy, with deep scratches along one edge where my father carved his initials when he was eight. My grandmother never sanded them away. "Some marks should stay," she says.\n\nAbove the stove hangs a row of copper pans, each a slightly different shade of orange and brown. She polishes them every Sunday, even though she uses only two. The others belonged to her mother, and they are less for cooking than for remembering.\n\nThe smells change with the hours. In the morning, there is coffee and toast. By noon, onions are frying in oil, and the windows begin to steam. In the evening, there is always something sweet in the oven, because my grandmother believes that no one should go to bed without dessert.\n\nOn the refrigerator, under magnets shaped like fruit, are drawings by every grandchild, from the oldest, who is now at university, to the youngest, who drew a purple cat last week.\n\nThe kitchen is never quite clean and never quite quiet. That is exactly why everyone ends up there, no matter how many other rooms the house has.',
  },
  {
    task: "Write a descriptive essay about a beach in winter, contrasting it with how it looks in summer.",
    model:
      "In summer, the beach at Harlow Bay belongs to everyone. In winter, it belongs to the wind.\n\nIn July, the sand disappears under towels and umbrellas of every color. Children shriek as the waves chase them, music drifts from a dozen phones, and the air smells of sunscreen and fried food. The ice cream kiosk has a line that stretches back to the car park.\n\nIn January, the kiosk is shuttered, its painted cones faded and peeling. The car park is empty except for a single van whose owner walks a gray dog along the waterline. The sand is no longer soft and golden; it is packed hard, dark with rain, and marked only by the zigzag tracks of seabirds.\n\nThe sea itself changes most. In summer it is a lazy blue, lapping politely at the shore. In winter it is the color of iron, and it throws itself at the rocks with a roar that I can feel in my chest. Foam blows across the sand in trembling clumps, like the ghosts of the summer's crowds.\n\nI used to think that winter made the beach sad. Now I think it shows what the beach really is when nobody is watching: not a playground, but the wild edge of the world.",
  },
  {
    task: "Write a descriptive essay about a library, conveying the feeling it gives you through details of sight, sound and smell.",
    model:
      "The public library on Oak Avenue is the quietest place I know, and yet it is never truly silent.\n\nWhen I push open the heavy door, the noise of the street falls away at once, as if someone has closed a lid. The light inside is soft and golden, coming through tall windows that have not been cleaned in years. Dust floats in the sunbeams, turning slowly, never quite landing.\n\nThe sounds of the library are small and precise. A page turns. A chair creaks as someone shifts their weight. Somewhere among the shelves, a librarian pushes a trolley with one squeaking wheel, and the sound travels down the aisles like a tiny bird call. Even the clock on the wall seems to tick more gently here.\n\nThen there is the smell, which I could recognize with my eyes closed: old paper, wood polish and a faint sweetness, like vanilla. I once read that this is the smell of books slowly breaking down. I prefer to think of it as the smell of stories.\n\nIn the corner by the history section, there is a worn green armchair that I think of as mine. When I sink into it with a book, I feel what I imagine sailors feel when they reach a harbor: safe, and ready for the next voyage.",
  },
  {
    task: "Write a descriptive essay about a train station at rush hour, creating a sense of movement and energy.",
    model:
      "At eight in the morning, Central Station is less a building than a river of people.\n\nThe crowd pours in through every entrance at once. Briefcases swing, umbrellas drip, and a hundred pairs of shoes strike the marble floor in a rhythm with no beat. Nobody walks slowly. Even the people who are standing still seem to be leaning forward, ready to run.\n\nAbove them, the departure board clicks and flickers as the times change. Platform numbers appear, and the river divides, streams of commuters breaking off toward the stairs. A voice from the loudspeakers announces delays in a tone so calm that it sounds almost bored.\n\nThe smells are a mixture of coffee, wet coats and the hot metal breath of the trains. At the café by the clock, the barista works without looking up, sliding cups across the counter faster than I can count. A pigeon, unbothered by any of it, pecks at a crumb near a bench.\n\nThen a train pulls in with a long sigh of brakes. Its doors slide open, and for a moment the two crowds, those leaving and those arriving, press against each other before they untangle and flow on.\n\nBy nine, the river has passed. The floor is suddenly visible again, and the station breathes out, waiting for the evening flood.",
  },
  {
    task: "Write a descriptive essay about a garden through the seasons, showing how it changes over a year.",
    model:
      "My mother's garden is a small rectangle behind our house, but over one year it becomes four different places.\n\nIn spring, it is a place of promises. The ground is dark and damp, and the first green tips of tulips push through the soil like fingers. My mother kneels in her old blue trousers, planting seeds in straight rows and marking each one with a wooden stick that bears its name in her careful handwriting.\n\nIn summer, the garden becomes crowded and loud. Bees hum among the lavender, tomato plants grow taller than me, and the air is heavy with the smell of roses and cut grass. In the evenings, we eat dinner at a small table under the apple tree, and its leaves keep the last of the sun off our faces.\n\nIn autumn, the garden glows. The apple tree drops its fruit with soft thuds, and the leaves turn red and gold before they fall. My mother rakes them into piles, which my little brother destroys with joyful leaps.\n\nIn winter, the garden sleeps. Frost covers everything with silver, and the bare branches of the apple tree draw dark lines against the white sky.\n\nWatching the garden change, I have learned that every ending in it is also a beginning.",
  },
  {
    task: "Write a descriptive essay about a hospital waiting room, conveying the feelings of the people there through precise details.",
    model:
      "The waiting room of St. Mary's Hospital is painted a pale green that someone must once have chosen to be calming. It has the opposite effect.\n\nThe chairs are plastic, joined together in long rows, so that whenever anyone shifts in their seat, the whole row trembles slightly. Nobody sits next to a stranger if they can help it. Families cluster together, and single people perch at the ends of rows, as if ready to escape.\n\nA television high on the wall shows a cooking program with the sound turned off. A few people watch it without seeing it. An old man in a brown coat holds his hat in both hands and turns it slowly, around and around. Across from him, a young mother rocks a sleeping baby and stares at the doors that lead into the wards.\n\nThe sounds are few but sharp. A vending machine hums. Shoes squeak on the polished floor. Every few minutes, a nurse appears and calls a name, and every head lifts at once, then drops again.\n\nThe smell is clean and chemical, the smell of disinfectant and floor polish. It covers everything, but it cannot cover the fear.\n\nIn this room, time does not pass; it waits, along with everyone else.",
  },
  {
    task: "Write a descriptive essay about a mountain village, building a dominant impression of peace or of isolation.",
    model:
      "The village of Ardel clings to the mountainside as if it is afraid of falling. From the valley road, it looks like a handful of white stones scattered among the pines.\n\nThe only way up is a narrow track that zigzags through the forest. When I finally reach the top, the silence is almost shocking. There are no cars, no engines, no music. The loudest sound is a stream that runs beside the main street, chattering over its stones.\n\nThe houses are old and small, built of gray stone with roofs of dark slate. Their windows are tiny, to keep out the winter cold, and many are decorated with red geraniums in wooden boxes. An old woman sits on a bench outside her door, knitting, and she nods to me without speaking.\n\nIn the square, the church bell rings the hour, and its sound rolls down into the valley and echoes back from the mountains opposite. A dog lifts its head, then goes back to sleep in the sun.\n\nAs evening comes, mist rises from the valley and wraps itself around the village, until the world below disappears. I feel as though I have climbed above everything that hurries. Up here, the day ends not with noise but with the slow fading of the light.",
  },
  {
    task: "Write a descriptive essay about a sports stadium on match day, capturing the atmosphere through sound and movement.",
    model:
      "Two hours before kickoff, the stadium is already alive.\n\nOutside the gates, the streets have turned into a sea of blue and white. Fans wear scarves, shirts and painted faces, and some carry flags so large that they need two people to hold them. Street sellers shout over the noise, offering programs, hats and hot sausages that send clouds of smoke into the air.\n\nInside, the stands fill slowly at first, then all at once. From my seat high in the east stand, the pitch looks impossibly green, as if it has been painted. The grass is striped in perfect lines, and the white markings are so bright that they almost glow.\n\nThe sound builds like a storm. First there is a low murmur of voices, then a song that begins in one corner and spreads around the stadium until forty thousand people are singing the same words. When the players run out of the tunnel, the noise becomes a roar that I feel in my ribs and in the soles of my feet.\n\nFlags wave, drums thunder, and the whole stand rises as one. For ninety minutes, strangers will hug each other and shout together.\n\nIn this place, for one afternoon, a city becomes a single voice.",
  },
  {
    task: "Write a descriptive essay about your bedroom or another private space, revealing your personality through what is in it.",
    model:
      "My room is the smallest in the apartment, but it is the only place where everything is exactly where I want it, even if no one else can see the order.\n\nThe first thing a visitor notices is the books. They are everywhere: stacked on the shelves, piled beside the bed and balanced on the windowsill. Most are science fiction, with spaceships and strange planets on their covers. A few are borrowed from the library and are two weeks overdue.\n\nAbove my desk is a map of the night sky. I have marked the constellations I have actually seen with small gold stars, and there are only nine so far. Next to it hangs a photograph of my grandfather standing in front of a telescope he built himself. He is the reason I look up at night.\n\nMy desk is a mess of notebooks, broken pencils and half-finished drawings of rockets. In the corner, there is a cactus that I have somehow kept alive for three years. It is called Steve.\n\nAt night, I leave the curtains open. Even in the city, I can see a few stars, and before I fall asleep I count them. My room is small, but from it I can travel farther than anyone imagines.",
  },
  {
    task: "Write a descriptive essay about a city street after rain, using imagery to transform an ordinary place.",
    model:
      "Every day, Baker Street is ordinary: a row of shops, a bus stop, a few tired trees. But after the rain, for an hour or two, it becomes something else.\n\nThe pavement turns into a mirror. The red sign of the pharmacy and the yellow lights of the café are copied upside down beneath my feet, blurred and trembling as if they were painted on water. When a bus passes, its headlights draw two long gold lines across the road, and then they break apart into a thousand pieces.\n\nThe air smells new. The dust of the morning has been washed away, and in its place there is the cool, green smell of wet leaves and stone. Drops still fall from the awnings, ticking on the metal tables outside the café like slow clocks.\n\nPeople move differently, too. They step around puddles in little leaps, fold their umbrellas carefully and shake them like dogs shaking their fur. A child in yellow boots ignores the puddles completely and jumps into the biggest one with both feet, while her father pretends to be angry.\n\nAs the clouds break, a strip of blue appears above the rooftops. Soon the street will dry and become ordinary again. But for now, it shines.",
  },
];

/** judgedTopics10a are the first writing topics of grade 10 judged by a model. */
export const judgedTopics10a: readonly TopicDef[] = [
  {
    id: "writing-a-thematic-analysis",
    title: t("Writing a Thematic Analysis", "写主题分析"),
    summary: t(
      "Write a short analysis that states the theme of a fable or story as a complete idea and shows, with quoted details, how the text develops it.",
      "写一篇简短的分析，把寓言或故事的主题陈述为一个完整的观点，并引用细节说明文本如何发展这一主题。",
    ),
    prerequisites: after("stating-a-theme", "writing-a-literary-analysis-essay"),
    encompasses: covers(0.2, "stating-a-theme"),
    xp: 24,
    strand: "writing",
    criteria: ["g10-theme-statement", "g10-theme-development", "g10-theme-quotes"].map(criterion),
    knowledgePoints: [
      point(
        "the-theme-as-an-idea",
        t("The Theme as an Idea", "主题是一个观点"),
        t(
          "Open with the theme as a **complete idea about life** that the text supports: *The fable suggests that the desire to possess things can crowd out what gives life its meaning.* Do not name only a topic (*greed*) or retell the plot.",
          "开头要把主题陈述为文本所支持的、**关于人生的完整观点**：*The fable suggests that the desire to possess things can crowd out what gives life its meaning.* 不要只说出一个话题（*greed*），也不要复述情节。",
        ),
        writingGenerator(
          t(
            "Write the analysis in English, opening with the theme stated as a complete idea about life.",
            "用英语写这篇分析，开头把主题陈述为一个关于人生的完整观点。",
          ),
          themeBank,
          ["g10-theme-statement", "g10-theme-development", "g10-theme-quotes"],
          limits,
          onePiece,
        ),
      ),
      point(
        "how-the-text-builds-it",
        t("How the Text Builds It", "文本如何构建主题"),
        t(
          'Then trace **how the text develops** the theme from beginning to end: a pattern, a symbol, a turning point or an ironic ending. Quote short phrases and explain what each one adds: *The word "grateful" is the most painful in the fable, because...*',
          '然后从头到尾追踪**文本如何发展**这一主题：一种模式、一个象征、一个转折点或一个反讽的结局。引用简短的词句，并解释每一处起了什么作用：*The word "grateful" is the most painful in the fable, because...*',
        ),
        writingGenerator(
          t(
            "Write the analysis in English, tracing how the beginning, the turning point and the ending develop the theme, with short quotations.",
            "用英语写这篇分析，引用简短的词句，追踪开头、转折点和结局如何发展主题。",
          ),
          themeBank,
          ["g10-theme-development", "g10-theme-quotes", "g10-theme-statement"],
          limits,
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-a-comparison-of-two-texts",
    title: t("Writing a Comparison of Two Texts", "写两篇文本的比较"),
    summary: t(
      "Write an essay comparing how two texts present the same subject, explaining how differences of language and purpose create different views.",
      "写一篇文章，比较两篇文本如何呈现同一主题，解释语言和写作目的的不同如何形成不同的看法。",
    ),
    prerequisites: after("a-subject-in-two-mediums", "writing-a-compare-and-contrast-essay"),
    encompasses: covers(0.2, "a-subject-in-two-mediums"),
    xp: 24,
    strand: "writing",
    criteria: ["g10-compare-claim", "g10-compare-language", "g10-compare-purpose"].map(criterion),
    knowledgePoints: [
      point(
        "a-claim-about-both",
        t("A Claim About Both", "关于两者的论点"),
        t(
          "Open with a claim that names **what the texts share and how they differ**: *Both texts describe the sea, but the memoir presents it as a force that gives and takes life, while the brochure presents it as harmless.* Then discuss each text with quoted words.",
          "开头提出一个论点，说明**两篇文本的共同点和不同点**：*Both texts describe the sea, but the memoir presents it as a force that gives and takes life, while the brochure presents it as harmless.* 然后引用原文讨论每篇文本。",
        ),
        writingGenerator(
          t(
            "Write the comparison in English, opening with a claim about what the two texts share and how they differ.",
            "用英语写这篇比较，开头提出关于两篇文本共同点和不同点的论点。",
          ),
          compareBank,
          ["g10-compare-claim", "g10-compare-language", "g10-compare-purpose"],
          limits,
          onePiece,
        ),
      ),
      point(
        "why-they-differ",
        t("Why They Differ", "为什么不同"),
        t(
          "A comparison is more than two summaries. Explain **why** the texts differ: who wrote each one, for whom and for what purpose. *The brochure must make the sea attractive to strangers; the fisherman has lived with it all his life.* End with what reading them together reveals.",
          "比较不只是两段概要。要解释两篇文本**为什么**不同：各是谁写的，写给谁，出于什么目的。*The brochure must make the sea attractive to strangers; the fisherman has lived with it all his life.* 最后说明把它们放在一起读能揭示什么。",
        ),
        writingGenerator(
          t(
            "Write the comparison in English, explaining how the purpose and audience of each text shape its view, and ending with what the two reveal together.",
            "用英语写这篇比较，解释每篇文本的写作目的和读者如何影响其看法，并以二者合在一起所揭示的内容结尾。",
          ),
          compareBank,
          ["g10-compare-purpose", "g10-compare-language", "g10-compare-claim"],
          limits,
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-a-descriptive-essay-on-a-place",
    title: t("Writing a Descriptive Essay on a Place", "写一篇描写地点的文章"),
    summary: t(
      "Write a descriptive essay that brings a place to life through details of several senses, organized to build one dominant impression.",
      "写一篇描写性文章，用多种感官的细节让一个地方栩栩如生，并组织这些细节来营造一个主导印象。",
    ),
    prerequisites: after("creating-atmosphere-with-sensory-details", "writing-a-descriptive-paragraph"),
    encompasses: covers(0.2, "creating-atmosphere-with-sensory-details"),
    xp: 24,
    strand: "writing",
    criteria: ["g10-place-senses", "g10-place-impression", "g10-place-order"].map(criterion),
    knowledgePoints: [
      point(
        "details-of-the-senses",
        t("Details of the Senses", "感官的细节"),
        t(
          "Describe the place through **at least three senses**, with precise details rather than general words: not *it was noisy* but *a metal shutter rattles up*; not *it smelled nice* but *the sweetness of the first loaves from the bakery stall*.",
          "通过**至少三种感官**描写这个地方，用精确的细节而不是笼统的词：不说 *it was noisy*，而说 *a metal shutter rattles up*；不说 *it smelled nice*，而说 *the sweetness of the first loaves from the bakery stall*。",
        ),
        writingGenerator(
          t(
            "Write the descriptive essay in English, using precise details of at least three senses.",
            "用英语写这篇描写性文章，使用至少三种感官的精确细节。",
          ),
          placeBank,
          ["g10-place-senses", "g10-place-impression", "g10-place-order"],
          limits,
          onePiece,
        ),
      ),
      point(
        "one-dominant-impression",
        t("One Dominant Impression", "一个主导印象"),
        t(
          "Choose **one dominant impression**, such as peace, loss or energy, and let every detail serve it. Order the details clearly, by time, by space or by sense, and end with a sentence that shows what the place means: *In this room, time does not pass; it waits.*",
          "选择**一个主导印象**，比如宁静、失落或活力，让每个细节都为它服务。按时间、空间或感官清楚地安排细节，并以一个说明这个地方意义的句子结尾：*In this room, time does not pass; it waits.*",
        ),
        writingGenerator(
          t(
            "Write the descriptive essay in English, building one dominant impression and ending with what the place means.",
            "用英语写这篇描写性文章，营造一个主导印象，并以这个地方的意义结尾。",
          ),
          placeBank,
          ["g10-place-impression", "g10-place-order", "g10-place-senses"],
          limits,
          onePiece,
        ),
      ),
    ],
  },
];
