// Grade 9: writing judged by a model, part one: a hero's trial, an analysis of a soliloquy and an analysis of a
// character.

import { type TopicDef, t } from "@ga/content";
import { point, type WritingItem, writingGenerator } from "@ga/subject-english";
import { after, covers } from "../grade-5/links.ts";
import { criterion, onePiece } from "../grade-5/writing-judged-a.ts";

/** limits are the length limits of a grade 9 essay. */
export const limits = { minWords: 150, maxChars: 4800 };

/** trialBank gives the trial a hero must face in a short story. */
const trialBank: readonly WritingItem[] = [
  {
    task: "Write a short story in which a young ferry pilot must decide whether to cross a flooded river at night to bring a doctor to a sick child.",
    model:
      "The river had risen a foot since sunset. Nadia stood at the ferry rope and watched branches spin past in the brown water.\n\n“No one crosses tonight,” her uncle had said before he left for the city. But Mrs. Okafor's daughter had been burning with fever for two days, and the only doctor lived on the far bank.\n\nIf she stayed, the girl might die before morning. If she went and the rope snapped, Nadia would die instead.\n\nShe untied the ferry.\n\nHalfway across, a whole tree struck the side. The deck tilted; her lantern rolled into the river and went out. In the dark, Nadia found the rope with her hands and pulled, arm over arm, counting each pull aloud so that she would not count the seconds.\n\nThe doctor was waiting on the bank with his bag.\n\nAt dawn, when the fever broke, Mrs. Okafor kissed Nadia's raw palms. Nadia said nothing. That evening, for the first time, she walked past her uncle's chair and sat at the head of the table, and no one told her to move.",
  },
  {
    task: "Write a short story in which a girl who is afraid of heights must climb a lighthouse in a storm to relight the lamp before a fishing boat reaches the rocks.",
    model:
      "Mira had never climbed higher than the third step of the lighthouse. Above that, the stairs spiraled into the dark like the inside of a shell, and her legs always refused to go on.\n\nTonight the lamp had gone out, and her father's boat was somewhere in the storm, heading for the rocks below.\n\nShe took the matches and began to climb. At the twentieth step, the wind screamed through a cracked window and the whole tower seemed to sway. Mira pressed her face to the cold wall. Her father's voice came back to her: *Look at the next step, not the ground.*\n\nShe looked at the next step. Then the next.\n\nAt the top, rain lashed the glass. Her hands shook so badly that the first match broke, and the second blew out. The third caught. The lamp roared into light and swung its beam across the black water.\n\nFar out, a small light blinked back and turned away from the rocks.\n\nWhen her father climbed the stairs at dawn, he found her sitting at the top, her feet dangling over the gallery rail, watching the sea.",
  },
  {
    task: "Write a short story in which a boy must return a valuable wallet he found to a man who once humiliated him in front of the whole school.",
    model:
      "The wallet was fat with money, and the name on the card was Mr. Harlan's.\n\nEli knew the name too well. Two years before, Mr. Harlan had held up Eli's spelling test in front of the whole school assembly and read out every mistake. The laughter had followed Eli for months.\n\nNow the man's money lay in his hand. Nobody had seen him pick it up. With it, Eli could buy the bicycle he had wanted for three summers. He walked home slowly, the wallet heavy in his pocket.\n\nAt the corner of Harlan's street, he stopped. He pictured the bicycle. Then he pictured himself riding it past this house every day, knowing.\n\nHe knocked on the door.\n\nMr. Harlan looked older and smaller than Eli remembered. He counted the money, then looked at the boy for a long moment. “You're the Reyes boy,” he said quietly. “I owe you more than this.”\n\nEli shrugged and walked away. He did not feel like a hero. He felt light, as if he had put down something he had carried for two years.",
  },
  {
    task: "Write a short story in which a young apprentice blacksmith must forge a sword for a cruel lord, knowing that a flawed blade could save her village.",
    model:
      "Lord Varn wanted the sword by the full moon. “The finest blade in the valley,” he said, “or your master hangs.”\n\nTeya had worked in the forge for six years. She knew how to make a perfect blade. She also knew how to make one that looked perfect and would shatter at the first hard blow.\n\nVarn meant to use the sword against the villages that would not pay his taxes. Her own village was one of them.\n\nFor three nights she worked alone. She folded the steel, heated it and folded it again, and on the last night she quenched it in water that was a little too cold. A hidden crack ran through the heart of the blade, too fine for any eye.\n\nIf Varn discovered it, she and her master would both die.\n\nAt the full moon, Varn swung the sword through the air and smiled. He rode away with it on his hip.\n\nA month later, news came from the hills: the lord's sword had broken in his first battle, and his men had fled. Teya listened, then went back to the anvil. Her hands, she noticed, no longer shook when she held the tongs.",
  },
  {
    task: "Write a short story in which a runner who could win a race must decide whether to stop and help a rival who has fallen.",
    model:
      "With four hundred meters to go, Ama was finally in front. For two years she had finished second to Lucía Moreno. Today, the gold medal was hers to lose.\n\nThen she heard the fall behind her: a gasp, the slap of a body on the track. She glanced back. Lucía lay on her side, clutching her ankle, while the other runners streamed past her.\n\nThe finish line was right there. Ama's coach was screaming her name from the stands. Everything she had trained for was ten seconds away.\n\nShe stopped.\n\nThe crowd went silent as she jogged back. “Get up,” she said, and pulled Lucía's arm across her shoulders. Together they limped down the final straight, while runner after runner passed them.\n\nThey crossed the line last, side by side.\n\nThat night, Ama's coach would not speak to her. Her medal shelf stayed empty. But the next morning a parcel arrived with no note, only a pair of Lucía's racing spikes inside, and Ama hung them on the wall where the medal would have gone.",
  },
  {
    task: "Write a short story in which a young scribe is ordered by the emperor to rewrite history and erase the name of a fallen general.",
    model:
      "The order came sealed in red wax: every mention of General Ruo was to be scraped from the records of the empire.\n\nLiang was the youngest scribe in the archive. He had read the general's battles a hundred times. Ruo had saved the capital from invaders, then made the mistake of telling the emperor that the people were starving.\n\nThe senior scribes began scraping at once. Ink flaked from the old scrolls like dead skin. Liang sat with his knife above the page and could not cut.\n\nTo refuse meant prison, perhaps death. To obey meant that in a hundred years no one would know the general had lived.\n\nThat night he worked by candlelight. He scraped away Ruo's name, as ordered. But in the margins of a dull scroll about grain taxes, in letters smaller than rice, he copied the general's story from beginning to end.\n\nThe next morning the inspector found the work complete and praised him.\n\nLiang bowed. From then on, he wrote every report a little more carefully, as if each one might someday be the only true record left.",
  },
  {
    task: "Write a short story in which a shy girl must speak at a town meeting to stop the old forest from being cut down.",
    model:
      "Kiri had never spoken at the town meeting. She had never spoken anywhere if she could help it. But tomorrow the bulldozers would start on Ashwood, and every adult who loved the forest had already spoken and lost.\n\nWhen the mayor asked, “Anyone else?” the hall went quiet. Kiri's chair scraped as she stood. Two hundred faces turned toward her.\n\nHer prepared speech vanished from her head. Her mouth was dry. For a terrible moment she thought she would sit down again.\n\nThen she remembered the owl.\n\n“There's an owl in the third oak past the stream,” she said. Her voice cracked, but she kept going. “She's raised chicks there every spring for nine years. I've counted. If you cut the forest, I'll be the last person who ever counted them.”\n\nNo one laughed. An old farmer in the front row nodded slowly. The vote was put off until the council could study the forest.\n\nKiri walked home through Ashwood that evening. She did not hurry or look at the ground. She said good night aloud to the owl, and did not care who heard.",
  },
  {
    task: "Write a short story in which a young sailor, left in command when the captain falls ill, must choose between a safe harbor and a race to deliver medicine.",
    model:
      "When Captain Brandt collapsed with fever, the crew of the *Gull* looked at Tomas. He was nineteen and the first mate only because the old mate had drowned in the spring.\n\nIn the hold were six crates of medicine for the island of Varra, where a sickness was killing children. The storm ahead was the worst any of them had seen. To the east lay a safe harbor; there they could wait out the weather for three days.\n\nThree days would be too late for some of the children of Varra.\n\n“We go on,” Tomas said. The cook stared at him. The bosun spat. But they went to their posts.\n\nAll night the *Gull* climbed waves like hills and fell into their valleys. Tomas stayed at the wheel until his hands bled, calling every change of course himself.\n\nAt dawn they sighted Varra.\n\nLater, the recovered captain asked why he had risked the ship. Tomas began to explain, then stopped. “You would have done the same,” he said. The captain did not answer, but from then on he called Tomas *mister*, as he did the officers.",
  },
  {
    task: "Write a short story in which a boy must tell his father the truth about a mistake that cost the family's harvest.",
    model:
      "The irrigation gate had been Dev's job. One job, his father had said, and he had forgotten it to play cricket by the river.\n\nBy the time anyone noticed, the water had drained into the neighbor's field and the young rice had dried in the sun. Half the harvest was lost.\n\nAt dinner his father sat silent, turning his cup. “Someone must have opened the gate at night,” his mother said. “A thief, maybe.”\n\nDev could let the thief take the blame. No one would ever know.\n\nHe set down his spoon. His heart was beating so hard that he thought they must hear it.\n\n“It wasn't a thief,” he said. “I forgot. I went to the river.”\n\nHis father looked at him for a long time. Dev waited for the shouting. It did not come. Instead his father said, “Tomorrow we replant the east field. You'll carry the seedlings.”\n\nDev carried seedlings for nine days, until his back ached and his hands cracked. Every evening he checked the gate twice. He never missed a check again, even years later, when the farm was his.",
  },
  {
    task: "Write a short story in which a young healer must enter a village everyone else has fled because of a sickness.",
    model:
      "The road to Kell was empty except for a cart that someone had abandoned, one wheel in the ditch. The whole valley had heard about the sickness. Everyone who could leave Kell had left.\n\nIrena was sixteen and had studied with the old healer for only a year. The old healer had died of a fever the winter before. There was no one else to send.\n\nAt the edge of the village she stopped. She could still turn back. No one would blame her; most would call her sensible.\n\nThrough a window she saw a small hand lift, then fall.\n\nShe went in.\n\nFor three weeks she boiled water, burned the bedding and sat with the dying. Some she saved. Some she could not. She learned that the sickness spread through the well, and she sealed it with stones.\n\nWhen the families finally came back, they found the young healer asleep on a bench in the square, thinner than they remembered. When she woke, she did not tell them about the fear. She only asked who would help her dig a new well.",
  },
  {
    task: "Write a short story in which a girl must choose between her best friend and the truth when her friend is accused of cheating.",
    model:
      "Ms. Patel held up two exam papers. “These answers are identical,” she said. “Word for word.”\n\nOne paper was Hana's. The other belonged to Jess, her best friend since they were six.\n\nHana knew exactly what had happened. Jess had asked to borrow her notes the night before the exam, and Hana had refused. Then Jess had taken them from her bag while she slept.\n\n“Hana,” said Ms. Patel, “did you share your work?”\n\nJess was looking at her with wide, pleading eyes. If Hana said yes, they would both be punished, and the friendship would survive. If she told the truth, it would not.\n\n“No,” Hana said. “I didn't share it. My notes went missing that night.”\n\nJess's face went white. She did not speak to Hana for the rest of the term.\n\nIn the spring, a letter appeared in Hana's locker in Jess's handwriting. It said only, *You were right. I was angry because you were right.* Hana kept it in a book she never lent to anyone.",
  },
  {
    task: "Write a short story in which a young guard must decide whether to open the city gate to refugees against the commander's orders.",
    model:
      "The refugees came out of the snow at dusk: old men, mothers with children, a boy pulling a goat. Behind them, far off, the smoke of their burning village stained the sky.\n\n“The gate stays shut,” the commander had said. “If we let them in, we feed them all winter.”\n\nPell was on the gate alone. He was seventeen and had held a spear for only a month. Below him a woman lifted a baby toward the wall, as if he could catch it.\n\nIf he opened the gate, he would be flogged at least. If he did not, many of the people below would freeze before morning.\n\nHe thought of his own mother, who had walked into this city with nothing, carrying him.\n\nHe lifted the bar.\n\nThe commander found out within the hour. Pell took his twenty lashes in the square without a sound. That night, as he lay on his stomach in the barracks, the boy with the goat crept in and set a bowl of hot soup beside his bed. Pell ate it slowly. It was the best thing he had ever tasted.",
  },
];

/** soliloquyBank gives a short original soliloquy to analyze. */
const soliloquyBank: readonly WritingItem[] = [
  {
    task: "Write a short analysis of what this soliloquy reveals about the speaker. A young queen, alone after her father's funeral: “They bow to me now, who laughed at me last spring. / The crown is heavy, heavier than grief. / Shall I be gentle, as my father was, / and see them bite the hand that feeds them? / Or shall I be hard, and lose myself? / Father, you never told me how to choose.”",
    model:
      "This soliloquy reveals that the young queen is less afraid of her enemies than of what ruling will make her become.\n\nThe speech begins with bitterness about the court. She notes that “they bow to me now, who laughed at me last spring.” The contrast between bowing and laughing shows that she sees through their loyalty; she knows it is only respect for the crown.\n\nThe image of the crown as “heavier than grief” is striking, because grief for her father should be the heaviest thing she carries. By ranking the crown above it, she shows that responsibility has already pushed aside her private sorrow.\n\nHer real conflict appears in two questions. If she is gentle, they will “bite the hand that feeds them”; if she is hard, she will “lose” herself. Neither choice is safe, and the questions show her torn between them.\n\nThe last line, addressed to her dead father, is the most revealing. “You never told me how to choose” sounds almost like an accusation. Alone on stage, the queen admits what she could never say to the court: she feels unprepared and abandoned.",
  },
  {
    task: "Write a short analysis of what this soliloquy reveals about the speaker. A soldier, alone on watch the night before a battle: “Tomorrow, glory. That is what they say. / I have seen glory: it was a boy of fifteen / who called for his mother in the mud. / The captain speaks of honor like a coin. / I would spend every coin of it / to be home, mending my father's fence.”",
    model:
      "This soliloquy reveals that the soldier no longer believes in the glory of war and longs for the ordinary life he left behind.\n\nHe opens by repeating what others say: “Tomorrow, glory. That is what they say.” The short phrase “that is what they say” separates him from the official view. He is quoting it, not believing it.\n\nHe then redefines glory through a single memory. Glory, he says, “was a boy of fifteen / who called for his mother in the mud.” By placing the grand word beside such a small and painful image, he exposes what war really costs. The boy's age and his call for his mother make the death unbearably human.\n\nThe soldier's attitude to honor is shown through a metaphor. The captain speaks of honor “like a coin,” something that can be counted and traded. The soldier takes the metaphor further: he would “spend every coin of it” to go home. Honor, for him, is worth less than peace.\n\nThe final image, “mending my father's fence,” is humble and quiet. It shows that his deepest wish is not victory but the simple, useful work of home.",
  },
  {
    task: "Write a short analysis of what this soliloquy reveals about the speaker. A servant who has just been promised a reward for betraying his master: “Forty pieces of gold. Forty. / I could buy a farm, a cow, a wife. / And what did he ever give me but kind words? / Kind words do not fill a bowl. / Then why do my hands shake? / Why can I not stop seeing his face?”",
    model:
      "This soliloquy reveals that the servant is trying to persuade himself to betray his master, but his conscience will not let him.\n\nHe begins by repeating the sum, “Forty pieces of gold. Forty.” The repetition suggests that he is dazzled by the money, saying it again to make it real. He then lists what it could buy, “a farm, a cow, a wife,” a picture of security he has never had.\n\nNext he argues against his master. “What did he ever give me but kind words?” he asks, and answers that “kind words do not fill a bowl.” Here he sounds practical, even hard. Yet the argument reveals something he does not intend: his master has treated him kindly, which makes the betrayal worse.\n\nThe turn comes in the last two lines, which are both questions. His shaking hands and the face he cannot stop seeing are signs of guilt that his reasoning cannot silence. The body tells the truth that the mind denies.\n\nThe speech moves from certainty to doubt. By its end, the audience suspects that the servant may not go through with the betrayal, or that he will never forgive himself if he does.",
  },
  {
    task: "Write a short analysis of what this soliloquy reveals about the speaker. A mother, alone after her son has left to seek his fortune: “Go, then. I packed your bread myself. / I smiled at the gate; you never saw me fall. / The house is wide tonight, and every chair / is louder in its silence than your songs. / Be bold, my son. But be a little afraid. / The world forgets the ones who love it most.”",
    model:
      "This soliloquy reveals that the mother hid her grief to let her son leave freely, and that she fears the world will not treat him kindly.\n\nThe opening, “Go, then,” sounds brave, almost brisk, but the next details show the cost of that bravery. She “smiled at the gate,” yet her son “never saw me fall.” The contrast between the smile and the fall shows that her cheerfulness was an act performed for his sake.\n\nHer loneliness is expressed through the house itself. It is “wide tonight,” as if it has grown larger without him, and every chair is “louder in its silence than your songs.” This paradox makes his absence a kind of noise that fills the room.\n\nHer advice is divided: “Be bold, my son. But be a little afraid.” She wants him to succeed, but she knows too much about the world to want him fearless.\n\nThe final line widens the speech into a general truth: “The world forgets the ones who love it most.” Perhaps she is thinking of herself, left behind. Either way, the line shows a sadness she would never have let her son hear.",
  },
  {
    task: "Write a short analysis of what this soliloquy reveals about the speaker. A prince who has just learned that his brother plans to seize the throne: “My brother. We shared a cradle and a sword. / He taught me how to ride; I taught him chess. / And now he plays the game I taught him. / Good. Then let him find that I have learned / the moves he never bothered to watch. / Check, brother. Your turn.”",
    model:
      "This soliloquy reveals that the prince's grief over his brother's betrayal quickly hardens into a cold and confident plan.\n\nThe speech begins with memories of closeness. They “shared a cradle and a sword,” two images that cover their whole lives, from infancy to training for war. The exchange of lessons, riding for chess, shows a friendship of equals.\n\nThe turn comes with the metaphor of the game. His brother now “plays the game I taught him,” meaning that the plot for the throne is like a game of chess. The bitterness lies in the fact that the prince himself gave his brother the skill to betray him.\n\nThe single word “Good” marks a sudden shift in tone. Hurt becomes resolve. The prince claims to have learned “the moves he never bothered to watch,” suggesting that his brother has always underestimated him.\n\nThe final lines, “Check, brother. Your turn,” are short and almost playful, but they carry a threat. The prince speaks as if the conflict has already begun and he is ahead. The audience learns that he will not be a passive victim, and that the brothers' love has become a deadly contest.",
  },
  {
    task: "Write a short analysis of what this soliloquy reveals about the speaker. An old king, alone, after giving his kingdom to his children: “I gave them everything. Lands, gold, my crown. / I kept one thing: their love, or so I thought. / Today my daughter's steward did not bow. / A small thing. A door left shut. A cup not filled. / Small things. And I am small among them now. / Who am I, if no one calls me king?”",
    model:
      "This soliloquy reveals that the old king has begun to realize, too late, that his power was the source of the respect he believed was love.\n\nHe begins with a list, “Lands, gold, my crown,” that shows how completely he gave his power away. He believed he had kept their love, but the phrase “or so I thought” shows doubt creeping in.\n\nThe middle of the speech is built on small details: a steward who “did not bow,” “a door left shut,” “a cup not filled.” He repeats that these are “small things,” as if trying to convince himself they do not matter. Yet their accumulation shows that they matter enormously. Each one is a sign that he is no longer respected.\n\nThe word “small” then shifts to describe him: “I am small among them now.” This repetition reveals how his sense of himself has shrunk along with his authority.\n\nThe final question is the heart of the speech: “Who am I, if no one calls me king?” He has never known himself apart from his title. The soliloquy shows a man facing, for the first time, the emptiness of a life built on power.",
  },
  {
    task: "Write a short analysis of what this soliloquy reveals about the speaker. A young woman who has disguised herself as a man to join the army: “Three months, and no one knows. / I march as well as any, and I shoot better. / Yet when the sergeant praises me, he praises Tom, / and Tom is no one. Tom is a coat, a voice. / I wonder, if they knew, would I be braver / in their eyes, or only stranger?”",
    model:
      "This soliloquy reveals the young woman's pride in her ability and her frustration that her achievements belong to a person who does not exist.\n\nShe opens with a note of triumph: “Three months, and no one knows.” She is proud of her success, and the claim that she shoots “better” than the men shows confidence that she has earned.\n\nThe turn comes with the sergeant's praise. When he praises her, “he praises Tom, / and Tom is no one.” The repetition of the name and the blunt phrase “no one” show how hollow the praise feels. Her disguise lets her succeed, but it also steals her success.\n\nShe describes Tom as “a coat, a voice,” reducing him to the outward things she has put on. This image suggests that she feels split between the woman inside and the soldier everyone sees.\n\nThe final question reveals her uncertainty about how she would be judged. Would the men think her “braver” or “only stranger”? She suspects that the truth might not bring her the respect she deserves, which shows how clearly she understands the prejudice of the world around her.",
  },
  {
    task: "Write a short analysis of what this soliloquy reveals about the speaker. A merchant who has just lost his ships in a storm: “Gone. All six. The sea has eaten my name. / Yesterday the bankers smiled at me in the street. / Tomorrow they will cross it to avoid me. / Well. I came to this city with one coat. / I have the coat still. I have my hands. / Let them cross the street. I will build again.”",
    model:
      "This soliloquy reveals that the merchant, though shocked by his ruin, has a deep inner strength that does not depend on wealth.\n\nThe speech opens in shock. The one-word sentence “Gone” and the short phrase “All six” sound like someone struggling to take in the news. The metaphor that the sea “has eaten my name” shows that he feels his reputation, not just his property, has been destroyed.\n\nHe then predicts how others will treat him. The bankers who “smiled” yesterday will “cross” the street tomorrow. The contrast exposes how shallow their friendship was; it followed his money, not him.\n\nThe word “Well” marks a turning point. The merchant looks back to his beginning, when he came to the city “with one coat.” By noting that he still has the coat and his hands, he reminds himself that he once had nothing and succeeded anyway.\n\nThe ending is defiant: “Let them cross the street. I will build again.” The short, firm sentences show that his despair has turned into determination. The soliloquy reveals a man whose real wealth was always his ability to work.",
  },
  {
    task: "Write a short analysis of what this soliloquy reveals about the speaker. A judge, alone in his chambers before sentencing a young thief: “The law is clear. The boy stole bread. / The law is clear, and I have served it forty years. / But the law has never been hungry. / The law has never seen his sisters' faces. / I am the law today. God help me, / I wish I were only a man.”",
    model:
      "This soliloquy reveals that the judge is torn between his lifelong duty to the law and his human pity for the hungry boy.\n\nThe repeated phrase “The law is clear” shows how the judge has always thought: the rules are simple and must be followed. The detail that he has served the law “forty years” suggests how much of his identity rests on that duty.\n\nThe turn comes with “But.” The judge personifies the law, saying it “has never been hungry” and “has never seen his sisters' faces.” By describing the law as something that cannot feel, he shows that he himself does feel, and that the boy's poverty has moved him.\n\nThe line “I am the law today” is both proud and painful. He knows that he holds the boy's fate, and that he cannot hide behind the rules, because he is the one who must apply them.\n\nThe final wish, “I wish I were only a man,” reveals his deepest conflict. As a man, he could show mercy freely. As a judge, he must weigh mercy against the law. The soliloquy shows a person who has discovered, late in life, that justice and compassion do not always agree.",
  },
  {
    task: "Write a short analysis of what this soliloquy reveals about the speaker. A girl who has just won a scholarship to study in a distant city: “I should be dancing. Mother cried for joy. / Father shook my hand, as if I were a man. / Then why do I keep walking to the river / and counting the stones I have known since I was small? / The city will not know my name. / The river knows it. That is the trouble.”",
    model:
      "This soliloquy reveals that the girl's joy at winning the scholarship is mixed with a deep fear of losing the home that has shaped her.\n\nShe begins with what she “should” feel: “I should be dancing.” The word “should” suggests that she is not dancing, and that her real feelings do not match what others expect. Her parents' reactions, her mother crying for joy and her father shaking her hand “as if I were a man,” show how proud they are and how much the moment means to them.\n\nThe question that follows reveals her inner conflict. She keeps walking to the river and “counting the stones I have known since I was small.” Counting the stones is a way of holding on to familiar things, as if she wants to remember every detail before she leaves.\n\nThe contrast between the city and the river sharpens her fear. “The city will not know my name,” but the river does. The river stands for home, a place where she is known.\n\nThe final line, “That is the trouble,” is quiet but honest. She admits that being known and loved makes leaving painful, even when the leaving is a great opportunity.",
  },
  {
    task: "Write a short analysis of what this soliloquy reveals about the speaker. A rebel leader, alone, after his first victory: “They cheered for me today. A thousand throats. / They called me liberator, father, sword. / The last king heard those same words once, I think. / Perhaps he meant well too, at first. / Watch yourself, Danek. Watch your hands. / A crown fits any head that bends to wear it.”",
    model:
      "This soliloquy reveals that the rebel leader, in the moment of his triumph, fears that power will corrupt him as it corrupted the king he overthrew.\n\nHe begins by describing the crowd's praise: “A thousand throats” called him “liberator, father, sword.” The list of titles grows grander as it goes, showing how quickly the people have raised him above themselves.\n\nThe turn comes with a disturbing thought: “The last king heard those same words once.” By comparing himself to the king he defeated, Danek shows unusual self-awareness. He admits that the king “meant well too, at first,” suggesting that tyrants are not born but made.\n\nHe then speaks to himself by name: “Watch yourself, Danek. Watch your hands.” This self-address shows that he sees himself as two people, the leader and the man who must keep watch over him. The repeated command “Watch” sounds like a warning he expects to need again.\n\nThe last line is the most chilling. “A crown fits any head that bends to wear it” suggests that anyone can become a tyrant who accepts the crown. The soliloquy reveals a leader who understands that his greatest enemy may now be himself.",
  },
];

/** characterBank gives a short original passage about a character to analyze. */
const characterBank: readonly WritingItem[] = [
  {
    task: "Write a short analysis of the grandmother in this passage. “Every morning, Grandmother rose before the roosters and swept the yard, though no one ever thanked her. When the landlord came to shout about the rent, she gave him tea and listened until he ran out of words. Then she paid him in coins she had saved in a tin for a year. When I asked why she was kind to him, she said, ‘Anger is a fire. Why should I warm my hands at his?’”",
    model:
      "In this passage, the grandmother is revealed as a quietly strong woman whose patience is a kind of power.\n\nHer strength first appears in her daily habits. She rises “before the roosters” and sweeps the yard “though no one ever thanked her.” The detail about thanks shows that she works out of duty and pride, not for praise.\n\nThe scene with the landlord shows the same strength under pressure. When he comes “to shout,” she gives him tea and listens “until he ran out of words.” The writer contrasts his noise with her silence. Her calm makes his anger seem childish, and in the end he is the one who runs out.\n\nThe coins saved “in a tin for a year” show her careful planning. She was ready for this moment long before it came.\n\nThe writer reveals her most clearly through her own words. Her saying, “Anger is a fire. Why should I warm my hands at his?” shows a deliberate choice not to be drawn into conflict. The metaphor suggests that anger may seem comforting but burns whoever gets close to it.\n\nThrough contrast and through her words, the writer shows that the grandmother's gentleness is not weakness but wisdom.",
  },
  {
    task: "Write a short analysis of the captain in this passage. “Captain Rourke wore his medals to breakfast. He told the new recruits how he had held the bridge at Corran with twelve men. When the first shots came from the ridge, he ordered the platoon forward and stayed behind the wall to ‘direct the advance.’ That evening he wrote a report that mentioned his own name eleven times and the dead private's name once, spelled wrong.”",
    model:
      "In this passage, Captain Rourke is revealed as a vain and cowardly man who cares more about his reputation than about the soldiers in his care.\n\nThe writer begins with his vanity. Rourke wears “his medals to breakfast,” a detail that shows he wants to be admired even in the most ordinary moments. His story about holding the bridge “with twelve men” may be true, but telling it to new recruits suggests that he needs constant praise.\n\nThe central method of the passage is a contrast between his words and his actions. A man who boasts of bravery should lead from the front. Instead, when the shooting starts, he orders the platoon forward and stays behind the wall. The phrase “direct the advance,” in quotation marks, mocks his excuse.\n\nThe final detail is the most damning. His report mentions his own name “eleven times” and the dead private's name “once, spelled wrong.” The numbers say everything: the captain sees the battle as a story about himself, and the soldier who died is barely worth remembering.\n\nBy letting Rourke's actions contradict his self-image, the writer shows a man whose medals hide a hollow character.",
  },
  {
    task: "Write a short analysis of Leah in this passage. “At the start of the year, Leah sat in the back row and answered every question with a shrug. In March, she found a stray kitten in the rain and carried it to the vet under her coat. She stayed until it was safe and spent her lunch money on the bill. In April, she raised her hand in class for the first time, to ask how a broken leg heals.”",
    model:
      "In this passage, Leah changes from a withdrawn student into someone who has discovered a purpose, and the writer shows this change through a series of actions rather than explanation.\n\nAt the start, Leah sits “in the back row” and answers every question “with a shrug.” Both details suggest that she does not care, or does not want anyone to see that she cares. The back row keeps her hidden, and the shrug keeps her silent.\n\nThe turning point is the rescue of the kitten. She carries it to the vet “under her coat,” a gesture of protection, and stays “until it was safe.” Spending her lunch money on the bill shows that she is willing to give something up for another creature. The girl who seemed indifferent is, in fact, deeply caring.\n\nThe change is completed in April, when she raises her hand “for the first time.” Her question, about how a broken leg heals, connects directly to the kitten. Her new interest in learning grows from her experience of helping.\n\nThe writer never states that Leah has changed. Instead, the passage moves from a shrug to a raised hand, letting her actions show the growth of a young person who has found something worth caring about.",
  },
  {
    task: "Write a short analysis of the two brothers in this passage. “When the river flooded the farm, Isaac ran to save the horses and was soaked to the waist by the time he reached the barn. His brother Simon climbed to the roof with the deed to the land and the cash box, and watched. Afterward, Isaac nursed a lame mare for weeks. Simon spent those weeks writing to the insurance company.”",
    model:
      "In this passage, the writer uses the two brothers as foils, contrasting Isaac's selfless care for living things with Simon's cold concern for property.\n\nThe flood reveals their characters at once. Isaac runs “to save the horses” and is “soaked to the waist” by the time he reaches the barn. The physical detail shows that he threw himself into danger without hesitation.\n\nSimon's response is the opposite. He climbs “to the roof” with “the deed to the land and the cash box,” and then simply “watched.” The objects he saves are papers and money, and the single word “watched” shows his detachment while his brother struggles in the water.\n\nThe contrast continues after the flood. Isaac nurses “a lame mare for weeks,” a sign of patience and tenderness. During the same weeks, Simon writes “to the insurance company.” The parallel structure of the two sentences invites the reader to compare them directly.\n\nSimon is not shown as evil; saving the deed was sensible. But by placing the brothers side by side, the writer makes Isaac's warmth shine and Simon's practicality look like a lack of heart. Each brother makes the other's character clearer.",
  },
  {
    task: "Write a short analysis of Mr. Okoye in this passage. “Mr. Okoye ran the corner shop and never smiled. Children were afraid of him. He shouted at anyone who touched the fruit. But every Friday, after closing, he packed the bread that had not sold into paper bags and left them on the steps of the families on Cannon Street, where the factory had closed. He never knocked, and he never told anyone.”",
    model:
      "In this passage, Mr. Okoye is revealed as a deeply generous man who hides his kindness behind a harsh public face.\n\nThe writer first shows him as others see him. He “never smiled,” children “were afraid of him,” and he “shouted at anyone who touched the fruit.” These details build a picture of a grumpy, unfriendly shopkeeper, and the reader is invited to judge him as the children do.\n\nThe word “But” overturns that picture. Every Friday, he packs unsold bread into paper bags and leaves them for families on Cannon Street, “where the factory had closed.” The detail about the factory explains why these families need help, and it shows that Mr. Okoye pays close attention to his neighbors' hardships.\n\nThe last sentence reveals the most about him: “He never knocked, and he never told anyone.” He wants no thanks and no reputation for kindness. His generosity is private, perhaps because he wants to spare the families the shame of accepting charity.\n\nThe writer reveals Mr. Okoye through a contrast between his public manner and his secret actions. The passage suggests that a person's true character may lie in what he does when no one is watching.",
  },
  {
    task: "Write a short analysis of Clara in this passage. “Clara told everyone she was not nervous about the audition. She laughed loudly at lunch and said it was ‘just a silly play.’ That night, her sister heard her in the bathroom, reciting the speech again and again, until her voice cracked. In the morning, Clara arrived at the theater an hour early and sat in the empty hall, folding and unfolding her script.”",
    model:
      "In this passage, Clara is revealed as someone who cares intensely about the audition but tries to hide her fear behind a careless act.\n\nThe writer first shows what Clara says. She tells everyone she is “not nervous” and calls the audition “just a silly play.” Her loud laughter at lunch seems designed to convince others, and perhaps herself, that it does not matter.\n\nThe writer then contrasts her words with her actions. That night, her sister hears her “reciting the speech again and again, until her voice cracked.” Practicing until her voice breaks shows how much she wants the part. The bathroom, a private space, is where her real feelings come out.\n\nThe final details confirm this. Clara arrives “an hour early” and sits alone, “folding and unfolding her script.” This restless movement shows her anxiety more clearly than any words could.\n\nThe writer reveals Clara through the gap between what she says and what she does. Her claim that the play is silly is a kind of armor: if she fails, she can pretend she never cared. The passage shows how people sometimes protect themselves by pretending not to want what they want most.",
  },
  {
    task: "Write a short analysis of the old fisherman in this passage. “The young men laughed when old Pedro rowed out in the storm warnings. ‘The sea doesn't care how long you've known it,’ they said. Pedro only nodded and checked his knots twice. When the squall hit, the young men's motorboat stalled and drifted toward the rocks. Pedro reached them first, rowing steadily through the waves, and threw them a line without a word.”",
    model:
      "In this passage, old Pedro is revealed as a quiet, skilled and humble man whose experience proves more valuable than the young men's confidence.\n\nThe writer begins by showing how others see him. The young men laugh and warn that “the sea doesn't care how long you've known it.” Their words suggest that they see Pedro as a foolish old man relying on outdated experience.\n\nPedro's response is revealing. He “only nodded and checked his knots twice.” He does not argue or defend himself; instead, he prepares carefully. Checking his knots twice shows the caution that comes from long experience.\n\nThe storm reverses the situation. The young men's motorboat, a symbol of modern confidence, “stalled and drifted toward the rocks.” Pedro, in his old rowing boat, reaches them first, “rowing steadily through the waves.” The word “steadily” sums up his character: calm and reliable.\n\nThe final detail, that he throws them a line “without a word,” completes the portrait. He does not mock them, though he could. The writer reveals Pedro through a contrast with the young men and through his silence, which speaks of a man who has nothing to prove.",
  },
  {
    task: "Write a short analysis of Theo in this passage. “When the class voted for team captain, Theo voted for himself. He chose his friends first and left Sam, who limped, for last. In the final game, Theo kept the ball and shot from impossible distances while Sam stood open by the goal. They lost by one point. Theo said the referee had cheated. That night he lay awake, replaying Sam's raised hand, again and again.”",
    model:
      "In this passage, Theo is revealed as a selfish and proud boy, but the last line suggests the beginning of a troubled conscience.\n\nHis selfishness shows in a series of choices. He votes “for himself” as captain, chooses his friends first and leaves Sam, “who limped,” until last. The detail of Sam's limp makes Theo's choice seem unkind as well as unfair.\n\nDuring the game, his pride costs his team. He keeps the ball and shoots “from impossible distances” while Sam stands “open by the goal.” The contrast between the impossible shots and the easy pass he refuses shows that Theo wants personal glory more than victory.\n\nAfter the loss by one point, he blames the referee. This excuse shows that he cannot yet admit his own mistake.\n\nHowever, the final sentence complicates the portrait. That night he lies awake “replaying Sam's raised hand, again and again.” The repetition suggests that he knows the truth he refused to say aloud. Theo is not simply a villain; he is a boy whose pride is beginning to crack under guilt.\n\nThe writer reveals him through his actions and then through his private thoughts, hinting at a change still to come.",
  },
  {
    task: "Write a short analysis of Aunt Mei in this passage. “Aunt Mei arrived with three suitcases and opinions about everything: the curtains, the rice, the way I held my chopsticks. She rearranged the kitchen on her first day. On her last day, she left a notebook on my pillow. It held forty of my grandmother's recipes, copied in her neat hand, with notes in the margins: ‘Your mother liked this one with less salt.’”",
    model:
      "In this passage, Aunt Mei first seems bossy and critical, but the final detail reveals a loving woman who expresses care through action rather than words.\n\nThe writer begins with a humorous picture. Aunt Mei arrives with “three suitcases and opinions about everything,” and the list that follows, “the curtains, the rice, the way I held my chopsticks,” moves from large things to tiny ones. Rearranging the kitchen on her first day shows that she takes control wherever she goes.\n\nThe narrator seems irritated, and the reader may share that feeling. But the passage turns on her last day. She leaves a notebook containing “forty of my grandmother's recipes,” copied “in her neat hand.” Copying forty recipes by hand takes patience and time, which shows that her criticism hid real devotion.\n\nThe notes in the margins are the most revealing detail. “Your mother liked this one with less salt” shows that Aunt Mei remembers small things about the family and wants the narrator to inherit them.\n\nThe writer reveals Aunt Mei through a contrast between her first and last days. Her opinions about the kitchen were not mere bossiness; they came from a deep wish to pass on the family's traditions.",
  },
  {
    task: "Write a short analysis of Gwen in this passage. “Gwen had never lost an argument. In the debate final, her opponent, a nervous boy from a village school, made a point she could not answer. Gwen felt her cheeks burn. She opened her mouth to attack his accent, as she had seen others do. Then she closed it. When the judges announced his victory, she was the first to stand and shake his hand.”",
    model:
      "In this passage, Gwen is revealed as a proud and competitive girl who, in a moment of defeat, chooses fairness over winning.\n\nThe opening sentence, “Gwen had never lost an argument,” establishes her pride. Her identity seems built on winning, which makes the coming defeat more significant.\n\nThe writer contrasts her with her opponent, “a nervous boy from a village school.” The detail suggests that she expected to win easily. When he makes a point she cannot answer, her burning cheeks show her shock and embarrassment.\n\nThe crucial moment comes in two short sentences. She opens her mouth “to attack his accent, as she had seen others do,” and then “she closed it.” The writer shows a temptation that would have been cruel and unfair, an attack on who he is rather than on his argument. Her silence reveals a decision to be better than the people she has watched.\n\nThe final detail confirms her change. She is “the first to stand and shake his hand.” Gwen loses the debate but shows a quality more important than winning.\n\nThe writer reveals her character through a single choice, showing that integrity can matter more than pride.",
  },
  {
    task: "Write a short analysis of Mr. Lindqvist in this passage. “Mr. Lindqvist taught chemistry in a gray suit and a voice like a ticking clock. He gave no extra credit and accepted no excuses. Yet when Arjun's father died, Mr. Lindqvist drove two hours to the funeral and stood at the back. He left before anyone could thank him. The next week, Arjun found the deadline for his project quietly moved to the end of the term.”",
    model:
      "In this passage, Mr. Lindqvist is revealed as a strict teacher whose firmness hides a deep and private compassion.\n\nThe writer first describes him through details that suggest coldness. His “gray suit” and his “voice like a ticking clock” make him seem mechanical, and the simile suggests a man ruled by time and rules. He gives “no extra credit” and accepts “no excuses.” The reader expects him to be unfeeling.\n\nThe word “Yet” introduces a contrast. When Arjun's father dies, Mr. Lindqvist drives “two hours” to the funeral. The distance shows how much effort he is willing to make, though he never says so. He stands “at the back” and leaves “before anyone could thank him,” which shows that he does not want attention for his kindness.\n\nThe final detail is the most telling. Arjun finds the deadline “quietly moved.” The teacher who accepts no excuses has made an exception without being asked, and the word “quietly” shows that he did it privately to spare the boy embarrassment.\n\nThrough this contrast between his public manner and his private actions, the writer shows that strictness and kindness can live in the same person.",
  },
  {
    task: "Write a short analysis of Yara in this passage. “Yara's family had moved four times in three years. At each new school she learned the names of everyone in her class by the first Friday, but she never told anyone where she lived. She kept a box under her bed with one stone from every town. At the fourth school, a girl asked to see the box. Yara hesitated, then opened it, and told her about every stone.”",
    model:
      "In this passage, Yara is revealed as a careful, guarded girl whose frequent moves have taught her to protect herself, and the ending shows her beginning to trust someone.\n\nThe opening explains her situation: her family moved “four times in three years.” This background helps the reader understand her behavior.\n\nThe writer then shows two sides of her. She learns “the names of everyone in her class by the first Friday,” which shows that she is observant and wants to fit in quickly. Yet she “never told anyone where she lived.” The contrast suggests that she keeps others at a distance, perhaps because she expects to leave again.\n\nThe box of stones is a revealing symbol. Keeping “one stone from every town” shows that she values each place and wants to remember it, even if she never let anyone there know her. The box holds the history she hides from others.\n\nThe ending marks a change. When a girl asks to see the box, Yara “hesitated, then opened it.” The hesitation shows how hard it is for her to let someone in. Telling “about every stone” means sharing her whole story.\n\nThe writer reveals Yara through her habits and a symbol, and ends with a small act of trust.",
  },
];

/** judgedTopics9a are the first writing topics of grade 9 judged by a model. */
export const judgedTopics9a: readonly TopicDef[] = [
  {
    id: "writing-a-heros-trial",
    title: t("Writing a Hero's Trial", "写英雄的考验"),
    summary: t(
      "Write a short story in which a young hero faces a hard trial with real stakes, meets it through a choice of his or her own and is changed by it.",
      "写一个短篇故事：一位年轻的主人公面对代价真实的艰难考验，靠自己的选择去应对，并因此而改变。",
    ),
    prerequisites: after("the-heros-journey", "writing-an-epic-simile"),
    encompasses: covers(0.2, "the-heros-journey"),
    xp: 24,
    strand: "writing",
    criteria: ["g9-trial-stakes", "g9-trial-choice", "g9-trial-change"].map(criterion),
    knowledgePoints: [
      point(
        "stakes-and-a-choice",
        t("Stakes and a Choice", "代价与选择"),
        t(
          "A hero's trial matters only if the reader knows **what could be lost**. Make the stakes clear early: *If she stayed, the girl might die before morning. If she went and the rope snapped, Nadia would die instead.* Then let the hero meet the trial through **a choice of his or her own**, shown in a scene. A hero who is rescued by luck or by someone else has not faced the trial.",
          "只有读者知道**可能失去什么**，英雄的考验才有分量。尽早交代代价：*If she stayed, the girl might die before morning. If she went and the rope snapped, Nadia would die instead.* 然后让主人公**靠自己的选择**应对考验，并用场景表现出来。被运气或别人救下的主人公并没有真正经受考验。",
        ),
        writingGenerator(
          t(
            "Write the story in English, making the stakes clear and letting the hero meet the trial through a choice.",
            "用英语写这个故事，交代清楚代价，并让主人公靠自己的选择应对考验。",
          ),
          trialBank,
          ["g9-trial-stakes", "g9-trial-choice", "g9-trial-change"],
          limits,
          onePiece,
        ),
      ),
      point(
        "showing-the-change",
        t("Showing the Change", "表现改变"),
        t(
          "End by showing how the trial has **changed the hero**, through a detail or an action rather than a stated moral. *She sat at the head of the table, and no one told her to move* shows a new place in the family; *She learned to be brave* only tells. Choose one image that the reader can see.",
          "结尾要表现考验如何**改变了主人公**，用一个细节或动作，而不是直接说出道理。*She sat at the head of the table, and no one told her to move* 表现了她在家中新的地位；*She learned to be brave* 只是在陈述。选一个读者能看见的画面。",
        ),
        writingGenerator(
          t(
            "Write the story in English, ending with a detail or an action that shows how the trial has changed the hero.",
            "用英语写这个故事，以一个表现考验如何改变主人公的细节或动作结尾。",
          ),
          trialBank,
          ["g9-trial-change", "g9-trial-choice", "g9-trial-stakes"],
          limits,
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-an-analysis-of-a-soliloquy",
    title: t("Writing an Analysis of a Soliloquy", "写独白分析"),
    summary: t(
      "Write a short essay that claims what a soliloquy reveals about its speaker, quotes and explains its words and analyzes its choices of language.",
      "写一篇短文：提出一段独白揭示了说话人的什么，引用并解释其中的话语，分析其语言选择。",
    ),
    prerequisites: after("soliloquy-and-aside", "introducing-and-explaining-evidence", "citing-lines-of-plays-and-poems"),
    encompasses: covers(0.2, "soliloquy-and-aside", "introducing-and-explaining-evidence"),
    xp: 24,
    strand: "writing",
    criteria: ["g9-soliloquy-claim", "g9-soliloquy-quotes", "g9-soliloquy-language"].map(criterion),
    knowledgePoints: [
      point(
        "what-the-speech-reveals",
        t("What the Speech Reveals", "独白揭示了什么"),
        t(
          "Open with a **claim** about what the soliloquy reveals: a hidden feeling, a conflict, a plan. *This soliloquy reveals that the young queen is less afraid of her enemies than of what ruling will make her become.* Then support it with **short quotations**, each introduced in your own sentence and followed by an explanation.",
          "以一个**主张**开头，说出独白揭示了什么：隐藏的感情、内心冲突或计划。*This soliloquy reveals that the young queen is less afraid of her enemies than of what ruling will make her become.* 然后用**简短的引文**支持它，每条引文都用自己的句子引出，并在后面加以解释。",
        ),
        writingGenerator(
          t(
            "Write the analysis in English, opening with a claim about what the soliloquy reveals and supporting it with quotations.",
            "用英语写这篇分析，以独白揭示了什么的主张开头，并用引文加以支持。",
          ),
          soliloquyBank,
          ["g9-soliloquy-claim", "g9-soliloquy-quotes", "g9-soliloquy-language"],
          limits,
          onePiece,
        ),
      ),
      point(
        "reading-the-language",
        t("Reading the Language", "解读语言"),
        t(
          "A soliloquy shows a mind at work, so look closely at its **language**: a repeated word, a striking image, a question, a sudden shift in tone. *The single word “Good” marks a sudden shift: hurt becomes resolve.* Say what each choice shows about the speaker.",
          "独白展现的是思维的活动，所以要仔细分析它的**语言**：重复的词、醒目的意象、提问、语气的突然转变。*The single word “Good” marks a sudden shift: hurt becomes resolve.* 说出每个选择表现了说话人的什么。",
        ),
        writingGenerator(
          t(
            "Write the analysis in English, explaining what at least one choice of language in the soliloquy shows.",
            "用英语写这篇分析，解释独白中至少一处语言选择表现了什么。",
          ),
          soliloquyBank,
          ["g9-soliloquy-language", "g9-soliloquy-quotes", "g9-soliloquy-claim"],
          limits,
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-an-analysis-of-a-character",
    title: t("Writing an Analysis of a Character", "写人物分析"),
    summary: t(
      "Write a short essay that claims a trait or a change in a character, supports it with details from the passage and explains how the writer reveals it.",
      "写一篇短文：提出人物的某个特点或变化，用文段中的细节支持，并解释作者如何表现它。",
    ),
    prerequisites: after("character-foils", "claims-in-topic-sentences", "how-dialogue-reveals-character"),
    encompasses: covers(0.2, "character-foils", "claims-in-topic-sentences"),
    xp: 24,
    strand: "writing",
    criteria: ["g9-character-claim", "g9-character-evidence", "g9-character-method"].map(criterion),
    knowledgePoints: [
      point(
        "a-claim-about-the-character",
        t("A Claim About the Character", "关于人物的主张"),
        t(
          "Begin with a **claim** that names a trait or a change: *Captain Rourke is revealed as a vain and cowardly man who cares more about his reputation than about his soldiers.* Then support it with **details** from the passage, what the character does, says or how others react, and explain what each detail shows.",
          "以一个说出人物特点或变化的**主张**开头：*Captain Rourke is revealed as a vain and cowardly man who cares more about his reputation than about his soldiers.* 然后用文段中的**细节**支持它，即人物做了什么、说了什么或别人如何反应，并解释每个细节表现了什么。",
        ),
        writingGenerator(
          t(
            "Write the analysis in English, opening with a claim about the character and supporting it with details from the passage.",
            "用英语写这篇分析，以关于人物的主张开头，并用文段中的细节加以支持。",
          ),
          characterBank,
          ["g9-character-claim", "g9-character-evidence", "g9-character-method"],
          limits,
          onePiece,
        ),
      ),
      point(
        "how-the-writer-reveals-it",
        t("How the Writer Reveals It", "作者如何表现人物"),
        t(
          "Go beyond the trait to the **method**: how does the writer reveal it? Through a **contrast** with another character (a foil), through a **change** from beginning to end, or through a gap between what a character **says** and what he or she **does**. *By letting Rourke's actions contradict his self-image, the writer shows a man whose medals hide a hollow character.*",
          "不只说出特点，还要说出**方法**：作者是如何表现它的？通过与另一个人物的**对比**（衬托），通过从开头到结尾的**变化**，或者通过人物**说的**与**做的**之间的差距。*By letting Rourke's actions contradict his self-image, the writer shows a man whose medals hide a hollow character.*",
        ),
        writingGenerator(
          t(
            "Write the analysis in English, explaining how the writer reveals the character, through a contrast, a change or a gap between words and actions.",
            "用英语写这篇分析，解释作者如何通过对比、变化或言行之间的差距来表现人物。",
          ),
          characterBank,
          ["g9-character-method", "g9-character-evidence", "g9-character-claim"],
          limits,
          onePiece,
        ),
      ),
    ],
  },
];
