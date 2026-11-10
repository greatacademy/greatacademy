// Grades 6 to 8: writing judged by a model, one kind of piece for each of several units: a retold myth, a response
// to a poem, an informative paragraph, an objective summary and a narrative from a point of view (W4).

import { type CriterionSpec, type TopicDef, t } from "@ga/content";
import { criterionById, point, type WritingItem, writingGenerator } from "@ga/subject-english";

const criterion = (id: string): CriterionSpec => {
  const found = criterionById(id);
  if (!found) throw new Error(`unknown criterion ${id}`);
  return found;
};

const onePiece = (model: string) =>
  t(`One good response:\n\n> ${model.replaceAll("\n\n", "\n>\n> ")}`, `一个好的回答：\n\n> ${model.replaceAll("\n\n", "\n>\n> ")}`);

/** mythBank asks for a myth retold from notes in two or three paragraphs. */
const mythBank: readonly WritingItem[] = [
  {
    task: "Retell the myth of King Midas in two or three paragraphs. Keep its conflict and its lesson.",
    source:
      "King Midas loves gold more than anything. A god offers him one wish. He wishes that everything he touches turns to gold. His food, his drink and finally his daughter turn to gold. He begs the god to take the gift back. He washes in a river and everything returns to normal. He learns that gold is not worth more than life and love.",
    model:
      'Long ago, King Midas ruled a rich kingdom, but no amount of gold was ever enough for him. When a god offered to grant him one wish, Midas did not hesitate. "Let everything I touch turn to gold," he said. The next morning, he ran through his palace touching chairs, doors and roses, and laughed as each one glittered.\n\nAt dinner, his laughter stopped. The bread turned to gold in his hand, and the wine became hard metal on his lips. When his young daughter ran to hug him, she froze into a golden statue. Weeping, Midas begged the god to take the gift away. The god told him to wash in the river, and as he did, the water carried the curse downstream. His daughter blinked and smiled again. From that day on, Midas knew that the things he truly treasured could never be made of gold.',
  },
  {
    task: "Retell the myth of Orpheus and Eurydice in two or three paragraphs. Keep its conflict and its lesson.",
    source:
      "Orpheus is a musician whose songs charm everyone. His wife Eurydice dies from a snake bite. He goes down to the underworld and plays for its king. The king lets Eurydice follow him back, on one condition: he must not look back until they reach the sunlight. Just before the end, Orpheus fears she is not there and turns. She vanishes forever. Lesson: doubt and impatience can cost us what we love.",
    model:
      'Orpheus played the lyre so beautifully that rivers paused to listen. When his wife, Eurydice, died from a snake\'s bite on their wedding day, his music turned to grief. Refusing to accept her death, he walked down into the underworld, where no living person was allowed to go.\n\nThere he played for Hades, the king of the dead, and even that cold king was moved. "She may follow you back," Hades said, "but you must not look at her until you both stand in the sunlight." Orpheus climbed the long, dark path, hearing nothing behind him. With the light just ahead, he could bear the doubt no longer, and he turned around. For one moment he saw Eurydice\'s face; then she faded back into the shadows forever. Orpheus had won her with his music and lost her with a single moment of doubt.',
  },
  {
    task: "Retell the myth of Narcissus in two or three paragraphs. Keep its conflict and its lesson.",
    source:
      "Narcissus is a very handsome young man who thinks no one is good enough for him. He rejects everyone who loves him, including the nymph Echo. A goddess punishes him. He sees his reflection in a pool and falls in love with it. He cannot leave the pool and wastes away. A flower grows where he sat. Lesson: loving only yourself leads to ruin.",
    model:
      "Narcissus was the most handsome young man in Greece, and he knew it. Many people fell in love with him, but he turned every one of them away, saying no one was worthy of him. Even the nymph Echo, who could only repeat the last words she heard, followed him through the woods until he laughed at her and left her heartbroken.\n\nThe goddess of revenge decided he must learn what it felt like to love without being loved back. One hot afternoon, Narcissus knelt to drink from a still pool and saw a beautiful face in the water. He reached for it, and it reached for him, but whenever he touched the water, it broke apart. Unable to leave the face he loved, he stayed by the pool day after day until he faded away. In his place grew a white flower that still bends over the water, a warning that a person who loves only himself is lost.",
  },
  {
    task: "Retell the myth of Theseus and the Minotaur in two or three paragraphs. Keep its conflict and its lesson.",
    source:
      "Every year Athens must send young people to Crete to be eaten by the Minotaur, a monster in a labyrinth. Prince Theseus volunteers to go and kill it. Princess Ariadne of Crete gives him a ball of thread. He ties it at the entrance, finds and kills the Minotaur, and follows the thread out. Lesson: courage needs cleverness and help from others.",
    model:
      'Every year, the city of Athens had to send fourteen young people to the island of Crete, where they were thrown into a labyrinth to be eaten by the Minotaur, a monster with the body of a man and the head of a bull. When Prince Theseus saw the families weeping at the harbor, he stepped forward. "I will go," he said, "and I will kill the beast."\n\nIn Crete, Princess Ariadne watched the prisoners arrive and felt sorry for the brave prince. Secretly, she handed him a ball of thread. "Tie it at the door," she whispered, "and it will lead you out." Theseus unwound the thread as he crept through the dark, twisting halls. At the center, the Minotaur charged, and after a fierce fight, Theseus defeated it. Then he followed the thread back to the light. Strength alone would have left him lost forever; it took Ariadne\'s clever gift to bring him home.',
  },
  {
    task: "Retell the myth of Phaethon in two or three paragraphs. Keep its conflict and its lesson.",
    source:
      "Phaethon is the son of the sun god Helios. Other boys doubt it. Helios promises him any gift to prove it. Phaethon asks to drive the sun chariot for a day. Helios warns him, but must keep his promise. The horses are too strong; the chariot burns the earth and freezes other parts. Zeus strikes Phaethon down to save the world. Lesson: pride can make us take on more than we can handle.",
    model:
      'Phaethon told everyone that his father was Helios, the god who drove the sun across the sky, but the other boys laughed at him. Angry and embarrassed, he traveled to his father\'s golden palace. Helios hugged him and swore to give him anything he asked to prove he was his son. "Let me drive the sun chariot for one day," Phaethon said. His father\'s face went pale. "Not even Zeus can control those horses," he warned, but a promise of the gods could not be broken.\n\nAt dawn, Phaethon grabbed the reins, and the fiery horses felt how light he was. They bolted off their path. The chariot swooped so low that rivers boiled and forests burst into flame, then climbed so high that the earth below froze. To save the world, Zeus hurled a thunderbolt, and Phaethon fell like a falling star into a river. His pride had made him ask for a power he could not handle.',
  },
  {
    task: "Retell the myth of Baucis and Philemon in two or three paragraphs. Keep its conflict and its lesson.",
    source:
      "Zeus and Hermes disguise themselves as poor travelers and visit a town. Every rich house turns them away. An old, poor couple, Baucis and Philemon, welcome them and share their little food. The wine jug keeps refilling itself. The gods reveal themselves, flood the unkind town and turn the couple's hut into a temple. The couple ask to die together and become two trees. Lesson: kindness to strangers is rewarded.",
    model:
      'One evening, two tired travelers in torn cloaks knocked on door after door in a wealthy town. Every family slammed the door in their faces. At last they reached a tiny hut at the edge of the hills, where an old couple named Baucis and Philemon lived. "Come in and rest," said Philemon, and Baucis stirred the fire and cooked the last of their cabbage.\n\nAs they ate, Baucis noticed something strange: no matter how much wine she poured, the jug was always full. Trembling, the couple realized that their guests were gods, Zeus and Hermes in disguise. The gods led them up the hill, and when they looked back, a flood had covered the unkind town, while their little hut had become a shining temple. Asked for a wish, the couple said only that they hoped to die at the same moment. Years later, they turned into an oak and a linden tree, standing side by side, a reminder that kindness to strangers is never wasted.',
  },
  {
    task: "Retell the myth of Atalanta's race in two or three paragraphs. Keep its conflict and its lesson.",
    source:
      "Atalanta is the fastest runner in Greece. She does not want to marry. She says she will marry only a man who beats her in a race; those who lose are sent away. A young man named Hippomenes asks the goddess of love for help. She gives him three golden apples. During the race he drops them; Atalanta stops to pick them up and loses. Lesson: being distracted can cost us a race we should win.",
    model:
      "Atalanta could outrun the wind, and she had no wish to marry. When her father insisted, she made a rule: she would marry only a man who could beat her in a footrace. One young man after another lined up, and one after another, she left them far behind.\n\nHippomenes knew he could never win by speed alone, so he prayed to the goddess of love, who gave him three golden apples. When the race began, Atalanta shot ahead. Hippomenes rolled the first apple across her path, and its shine caught her eye. She stopped to pick it up and still passed him easily. He threw the second, then the third, far off to the side. Each time she turned to chase the gleam, and on the last stretch Hippomenes crossed the line first. Atalanta, who could beat anyone, had been beaten by her own wandering eyes.",
  },
  {
    task: "Retell the Chinese myth of Nüwa mending the sky in two or three paragraphs. Keep its conflict and its lesson.",
    source:
      "Two gods fight, and one crashes into the mountain that holds up the sky. The sky cracks; fire and floods pour onto the earth. The goddess Nüwa melts stones of five colors to patch the hole. She uses the legs of a giant turtle to prop up the four corners of the sky. The floods go down and people are safe. Lesson: care and hard work can repair great damage.",
    model:
      "In the ancient days, the water god and the fire god fought a terrible battle. Losing, the water god smashed his head against the mountain that held up the sky, and the mountain broke. A great crack split the heavens. Fire poured down from above, floods burst up from below, and wild beasts attacked the frightened people.\n\nThe goddess Nüwa, who loved the people she had made, could not bear to watch them suffer. She gathered stones of five colors from the riverbeds and melted them in a huge fire until they glowed like molten glass. With this, she patched the hole in the sky, piece by piece. Then she took the four legs of a giant turtle and set them at the corners of the earth to hold the sky up. Slowly the fires died and the floods drained away. The people learned that even the worst damage can be mended by someone who cares enough to work patiently.",
  },
  {
    task: "Retell the Chinese myth of Kua Fu chasing the sun in two or three paragraphs. Keep its conflict and its lesson.",
    source:
      "Kua Fu is a giant. He decides to catch the sun so it will always give light. He chases it across the land. He grows terribly thirsty and drinks the Yellow River and the Wei River dry. Still thirsty, he heads for a great lake but dies on the way. His walking stick becomes a peach forest. Lesson: some goals are beyond us, yet determined effort can leave something good behind.",
    model:
      'Long ago, a giant named Kua Fu grew tired of the darkness that came every night. "I will catch the sun," he declared, "and keep it in the sky forever." With huge strides, he set off after the sun as it rolled toward the west, crossing mountains in a single step.\n\nThe closer he came, the hotter the sun burned, and Kua Fu grew terribly thirsty. He knelt and drank the Yellow River dry, then the Wei River, but his thirst only grew. He turned north toward a great lake, but before he could reach it, he fell to the ground and died. As he fell, he threw down his wooden staff, and where it landed, a forest of peach trees sprang up, giving shade and fruit to travelers. Kua Fu never caught the sun, but his stubborn effort left behind a gift for everyone who came after him.',
  },
  {
    task: "Retell the Chinese myth of Jingwei filling the sea in two or three paragraphs. Keep its conflict and its lesson.",
    source:
      "The daughter of the Fire Emperor goes sailing and drowns in the Eastern Sea. She becomes a small bird called Jingwei. Angry at the sea, she carries pebbles and twigs from the mountains and drops them into the water, day after day. The sea laughs that she can never fill it. She replies she will keep going for ten thousand years. Lesson: determination in the face of impossible odds.",
    model:
      'The youngest daughter of the Fire Emperor loved the sea. One day she rowed far out on the Eastern Sea, but a storm rose, and the waves swallowed her little boat. She never came home. Instead, a small bird with a speckled head and a white beak flew out of the waves, crying "Jingwei, jingwei," and that became her name.\n\nJingwei was angry at the sea for taking her life and for all the people it might drown in the future. So she flew to the western mountains, picked up a pebble in her beak, carried it back and dropped it into the waves. Then she did it again, and again. "Foolish bird," roared the sea. "You could not fill me in a million years." "Then I will work for ten million," Jingwei answered, and flew back to the mountains. People still tell her story when they speak of someone who will not give up, however great the task.',
  },
  {
    task: "Retell the Norse myth of Odin's eye in two or three paragraphs. Keep its conflict and its lesson.",
    source:
      "Odin, the chief of the Norse gods, wants wisdom more than anything. Wisdom lies in Mimir's well at the root of the world tree. Mimir, the guardian, says a drink costs a great price: one of Odin's eyes. Odin agrees, gives up his eye and drinks. He gains great wisdom and sees what is coming. Lesson: true wisdom has a cost.",
    model:
      'Odin ruled the Norse gods, but he was troubled. He could see danger gathering at the edges of the world, yet he did not understand it. He learned that at the roots of the great tree that held up all the worlds lay a well, and whoever drank its water would gain all the wisdom of the ages.\n\nThe well was guarded by Mimir, the wisest of all beings. "A drink from my well is not free," Mimir said. "It will cost you one of your eyes." Odin was silent for a long time. Then, without a word, he gave up his eye and dropped it into the dark water. Mimir filled a horn, and Odin drank. At once he understood the past and saw the future, the dangers ahead and how to face them. From then on, Odin had only one eye, but he saw more than anyone, for he had learned that true wisdom is never gained without sacrifice.',
  },
  {
    task: "Retell the myth of Sisyphus in two or three paragraphs. Keep its conflict and its lesson.",
    source:
      "King Sisyphus is clever but tricks people and even the gods. When Death comes for him, he chains Death up, so no one can die. The gods free Death. Sisyphus tricks his way back from the underworld too. As punishment, he must roll a heavy boulder up a hill forever; each time it nears the top, it rolls back down. Lesson: cheating others, even cleverly, brings its own punishment.",
    model:
      'Sisyphus, king of Corinth, was the cleverest man alive, and he used his cleverness to cheat everyone around him, even the gods. When Death came to take him to the underworld, Sisyphus asked to see how his chains worked, then snapped them shut around Death himself. For days, no one on earth could die, until the angry gods freed Death and sent Sisyphus below.\n\nEven then, he tricked the queen of the underworld into letting him return to the living, and he lived on until he was very old. When he finally came down to stay, the gods were waiting. They gave him a huge boulder and a steep hill. "Roll it to the top," they said, "and you will be free." Each time Sisyphus pushed it almost to the peak, the stone slipped and thundered back to the bottom. He is pushing it still, a lesson that cleverness used to cheat others leads only to endless trouble for oneself.',
  },
];

/** poemBank asks for a paragraph on what a short poem makes the reader feel, and how. */
const poemBank: readonly WritingItem[] = [
  {
    task: "Write a paragraph on what this poem makes the reader feel, and how its images and sounds create that feeling. Quote the poem.",
    source:
      "The Last Ferry\n\nThe last ferry slides from the dock, / its lamps like coins dropped in the dark. / Gulls go quiet on the posts. / I stand with my ticket, too late, / and the water closes like a door.",
    model:
      '"The Last Ferry" leaves the reader with a lonely, wistful feeling of having missed something for good. The speaker watches the boat leave "with my ticket, too late," so the moment is both ordinary and painful. The images grow darker and quieter as the poem goes on: the ferry\'s lamps are "like coins dropped in the dark," small and disappearing, and even the gulls "go quiet." The last simile, "the water closes like a door," is the strongest, because a closing door suggests a chance that is shut forever. The short, soft lines make the scene feel still, and the reader is left standing on the dock with the speaker.',
  },
  {
    task: "Write a paragraph on what this poem makes the reader feel, and how its images and sounds create that feeling. Quote the poem.",
    source:
      "Snow Day\n\nThe school bus sleeps beneath a hill of white. / We tumble out in boots and borrowed mittens, / shouting, sliding, sledding till the light / turns blue, and we come home as cold as kittens.",
    model:
      '"Snow Day" is full of exuberant, carefree joy. The poem opens with a playful image, "The school bus sleeps beneath a hill of white," which tells us there will be no school and makes the bus seem like a sleepy animal. The second line is packed with action verbs, "tumble," "shouting, sliding, sledding," and the repeated *s* sounds make the lines rush forward like children racing down a hill. The rhymes of "white" and "light" and of "mittens" and "kittens" give the poem a bouncy, song-like rhythm. Even the ending, "as cold as kittens," is cozy rather than harsh, so the reader feels the happy tiredness of a day spent playing in the snow.',
  },
  {
    task: "Write a paragraph on what this poem makes the reader feel, and how its images and sounds create that feeling. Quote the poem.",
    source:
      "Grandfather's Workshop\n\nHis tools still hang in their painted outlines, / each hammer waiting in its shape. / Sawdust sleeps in the corners. / I pick up the plane he used, / and it fits my hand like his did.",
    model:
      '"Grandfather\'s Workshop" creates a quiet, melancholy mood mixed with love. The grandfather is never said to be gone, but the details show it: his tools "still hang in their painted outlines," and each hammer is "waiting," as if for someone who will not come back. Words like "sleeps" and "waiting" make the workshop feel paused in time. The ending turns the sadness into something warmer. When the speaker says the plane "fits my hand like his did," the simile connects the speaker to the grandfather, suggesting that his skill and memory live on. The reader feels both the loss and the comfort of carrying someone forward.',
  },
  {
    task: "Write a paragraph on what this poem makes the reader feel, and how its images and sounds create that feeling. Quote the poem.",
    source:
      "Before the Storm\n\nThe sky turns the color of a bruise. / Leaves flip their pale undersides / like hands raised in warning. / The dog will not leave the porch. / Somewhere far off, a door bangs, and bangs.",
    model:
      '"Before the Storm" builds an ominous, uneasy mood. The first image, a sky "the color of a bruise," suggests both darkness and pain, so the reader expects something harmful. The leaves are personified "like hands raised in warning," as if nature itself is telling us to watch out. Small details add to the tension: the dog "will not leave the porch," which hints that animals sense the danger first. The last line repeats a sound, "a door bangs, and bangs," and the repetition feels restless and threatening, because no one is closing it. The poem ends before the storm arrives, which leaves the reader holding the tension.',
  },
  {
    task: "Write a paragraph on what this poem makes the reader feel, and how its images and sounds create that feeling. Quote the poem.",
    source:
      "Morning Lake\n\nNo wind. The lake holds the mountains / upside down and perfectly. / A heron lifts one foot, / sets it down without a sound. / Even my breathing feels too loud.",
    model:
      '"Morning Lake" makes the reader feel deeply serene, almost as if holding their breath. The poem begins with two words, "No wind," that set a still scene. The lake "holds the mountains / upside down and perfectly," an image of a reflection so clear that the water seems like glass. The heron\'s slow movement, lifting a foot and setting it down "without a sound," slows the poem\'s pace, and the short lines and soft sounds match that calm. The last line, "Even my breathing feels too loud," shows how quiet the place is and pulls the reader into the speaker\'s careful, peaceful stillness.',
  },
  {
    task: "Write a paragraph on what this poem makes the reader feel, and how its images and sounds create that feeling. Quote the poem.",
    source:
      "The Moon's Lost Button\n\nThe moon has lost a button / from her silver evening coat. / It rolled across the rooftops / and landed in a boat. / The fisherman who found it / now cannot find his way, / for every night it glows so bright / he thinks it's still the day.",
    model:
      '"The Moon\'s Lost Button" has a whimsical, playful tone that makes the reader smile. It treats the moon as a fancy lady with a "silver evening coat," which is a gentle, funny form of personification. The image of a button rolling "across the rooftops" and into a boat is impossible but delightful, like a picture in a children\'s book. The poem\'s regular rhythm and rhymes, such as "coat" and "boat" and "way" and "day," make it sound like a nursery rhyme. Even the fisherman\'s problem is silly rather than serious, so the poem leaves the reader with a light, amused feeling.',
  },
  {
    task: "Write a paragraph on what this poem makes the reader feel, and how its images and sounds create that feeling. Quote the poem.",
    source:
      "Moving Day\n\nOur boxes say KITCHEN, BOOKS, MY ROOM / in my mother's hurried hand. / The walls are paler where the pictures were. / I write my name inside the closet, small, / so the house remembers.",
    model:
      '"Moving Day" leaves the reader with a nostalgic, bittersweet feeling. The labels on the boxes, written "in my mother\'s hurried hand," show the rush of leaving, while the speaker seems to want to slow down. The detail that "The walls are paler where the pictures were" is powerful because it shows the empty spaces left by a whole life in the house. The last two lines are the most touching: the speaker writes their name "inside the closet, small, / so the house remembers." The word "small" suggests a secret, private goodbye, and the idea that the house could remember shows how much the speaker wants to leave a part of themself behind.',
  },
  {
    task: "Write a paragraph on what this poem makes the reader feel, and how its images and sounds create that feeling. Quote the poem.",
    source:
      "Final Whistle\n\nThe whistle blows. The stands explode, / a thousand scarves flung up like birds. / We pile on top of our goalkeeper, / a heap of mud and laughing, / and the rain feels like applause.",
    model:
      '"Final Whistle" bursts with jubilant joy at a hard-won victory. The verb "explode" in the first line shows the sudden roar of the crowd, and the simile "a thousand scarves flung up like birds" makes the celebration look wild and free. The players pile on their goalkeeper in "a heap of mud and laughing," an image that is messy but full of happiness. The best image comes last: "the rain feels like applause." Rain is usually miserable at a game, but here even the weather seems to cheer for the team, which shows how winning changes everything. The reader shares the team\'s thrill.',
  },
  {
    task: "Write a paragraph on what this poem makes the reader feel, and how its images and sounds create that feeling. Quote the poem.",
    source:
      "Winter Field\n\nOne crow. One fence. One broken gate. / The stubble frozen into rows. / The farmhouse window, dark since spring. / The wind has nothing left to take.",
    model:
      '"Winter Field" creates a bleak, empty mood. The first line lists single things, "One crow. One fence. One broken gate," in short, flat sentences, and the repetition of "one" makes the field feel bare and lonely. Everything in the poem is damaged or lifeless: the gate is "broken," the stubble is "frozen," and the farmhouse window has been "dark since spring," which suggests that whoever lived there has gone. The final line, "The wind has nothing left to take," personifies the wind as a thief and suggests that everything of value has already been lost. The reader is left feeling the cold emptiness of the place.',
  },
  {
    task: "Write a paragraph on what this poem makes the reader feel, and how its images and sounds create that feeling. Quote the poem.",
    source:
      "The Kite\n\nI let the string run through my fingers, / farther, farther, till the kite / is just a red word in the sky / I cannot read. / I almost hope it never lands.",
    model:
      '"The Kite" fills the reader with a sense of freedom mixed with gentle longing. The repetition of "farther, farther" makes the line stretch out the way the string does, so we feel the kite pulling away. The metaphor of the kite as "a red word in the sky / I cannot read" is surprising: it makes the kite seem mysterious, part of a message too far away to understand. The line break after "read" adds a pause, as if the speaker is staring up. The ending, "I almost hope it never lands," shows that the speaker enjoys the feeling of letting go and wishes the moment could last.',
  },
  {
    task: "Write a paragraph on what this poem makes the reader feel, and how its images and sounds create that feeling. Quote the poem.",
    source:
      "Hospital Night\n\nThe machines keep their small green time. / My mother sleeps beside my bed, / her coat still on, her shoes still tied, / as if she might be called away / and will not let it be by me.",
    model:
      '"Hospital Night" creates a somber but loving mood. The machines that "keep their small green time" are quiet and steady, which makes the hospital room feel serious and still. The most moving details are about the mother, who sleeps "her coat still on, her shoes still tied." These images show that she is ready to rush to help at any moment and has not let herself rest properly. The final lines suggest that she will not leave her child\'s side. The reader feels the worry of the night, but also the deep love and loyalty of a parent who keeps watch.',
  },
  {
    task: "Write a paragraph on what this poem makes the reader feel, and how its images and sounds create that feeling. Quote the poem.",
    source:
      "Market Morning\n\nMangoes stacked like little suns, / a radio crackling old songs, / the fish man singing prices, / and my grandmother haggling, / laughing, winning every time.",
    model:
      '"Market Morning" makes the reader feel the warm, lively energy of a busy market. The simile "Mangoes stacked like little suns" gives the scene bright color and heat right away. The poem then appeals to hearing, with "a radio crackling old songs" and "the fish man singing prices," so the market seems full of music. The lines are a long list without a full stop until the end, which makes the poem feel crowded and joyful, like the market itself. The final image of the grandmother "haggling, / laughing, winning every time" adds affection and humor, leaving the reader with a cheerful, exuberant picture of the morning.',
  },
];

/** informBank asks for an informative paragraph built from notes. */
const informBank: readonly WritingItem[] = [
  {
    task: "Use the notes to write an informative paragraph that explains how Roman aqueducts worked.",
    source:
      "aqueducts: channels that carried water to Roman cities / water flowed downhill by gravity, no pumps / slope very gentle, a few inches per mile / mostly underground; stone arches only to cross valleys / Rome had eleven aqueducts / water fed public fountains, baths, homes of the rich",
    model:
      "Roman aqueducts were channels that carried fresh water from distant hills into the cities. They worked without any pumps, relying only on gravity: each aqueduct sloped downhill very gently, often by just a few inches per mile, so that the water kept flowing steadily without rushing. Most of an aqueduct actually ran underground. The famous tall stone arches were built only where the channel had to cross a valley. The city of Rome was served by eleven aqueducts, which supplied its public fountains and baths, as well as the private homes of wealthy citizens. In this way, careful engineering gave millions of people clean water every day.",
  },
  {
    task: "Use the notes to write an informative paragraph that explains how Roman roads were built.",
    source:
      "over 50,000 miles of paved roads / built by soldiers / dug a trench, filled with layers: large stones, gravel, sand / top layer of flat fitted stones / curved surface so rain ran off to ditches / milestones marked distances / helped armies, traders and messengers travel fast",
    model:
      "The Romans built more than fifty thousand miles of paved roads, and they built them to last. Soldiers did much of the work. First they dug a deep trench, and then they filled it with layers: large stones at the bottom, then gravel and finally sand. On top, they laid flat stones fitted tightly together. The surface was curved slightly, so rain ran off into ditches at the sides instead of soaking in. Stone markers called milestones told travelers how far they had come. Because of this design, armies, traders and messengers could move quickly across the empire, which helped Rome control its vast lands.",
  },
  {
    task: "Use the notes to write an informative paragraph that explains the government of the Roman Republic.",
    source:
      "Republic began about 509 BCE after last king driven out / citizens elected leaders / two consuls, elected every year, led government and army / each consul could veto the other / senate: council of experienced men, advised consuls, controlled money / assemblies of citizens voted on laws / goal: no single person too powerful",
    model:
      "The Roman Republic began around 509 BCE, after the Romans drove out their last king and decided to choose their own leaders. At the top were two consuls, elected every year, who led both the government and the army. Each consul could veto, or block, the other's decisions. The senate, a council of experienced men, advised the consuls and controlled the state's money. Meanwhile, assemblies of ordinary citizens voted on laws and elected officials. All of these parts were designed for one purpose: to make sure that no single person could become too powerful, as the kings had been.",
  },
  {
    task: "Use the notes to write an informative paragraph that explains what happened at Pompeii.",
    source:
      "Pompeii: Roman town near Mount Vesuvius / 79 CE, volcano erupted / ash and stones fell for hours / then clouds of hot gas swept down / town buried under about 20 feet of ash / rediscovered in 1700s / ash preserved buildings, paintings, bread in ovens / shows daily Roman life",
    model:
      "Pompeii was a busy Roman town at the foot of Mount Vesuvius, a volcano that had been quiet for centuries. In 79 CE, Vesuvius suddenly erupted. For hours, ash and small stones rained down on the town, and then clouds of scorching gas swept down the mountain. By the end, Pompeii lay buried under about twenty feet of ash. The town was forgotten until it was rediscovered in the 1700s. Because the ash sealed everything so quickly, it preserved houses, wall paintings and even loaves of bread left in ovens. Today, Pompeii gives historians a rare, detailed look at everyday life in the Roman world.",
  },
  {
    task: "Use the notes to write an informative paragraph that explains how Latin lives on in English.",
    source:
      "Latin: language of ancient Rome / about half of English words come from Latin, often through French / roots: port = carry (portable, transport), dict = say (dictionary, predict), aqua = water (aquarium) / used in science names (Homo sapiens) / mottoes and phrases: et cetera, etc.",
    model:
      'Latin, the language of ancient Rome, is still alive inside English. About half of all English words come from Latin, many of them through French. Knowing a Latin root can unlock many words at once. For example, *port* means "carry," which appears in *portable* and *transport*; *dict* means "say," as in *dictionary* and *predict*; and *aqua* means "water," as in *aquarium*. Scientists also use Latin to name living things, such as *Homo sapiens* for human beings. Even everyday abbreviations like *etc.*, short for *et cetera*, come from Latin. In short, English speakers use the language of Rome every day without noticing.',
  },
  {
    task: "Use the notes to write an informative paragraph about the Colosseum.",
    source:
      "Colosseum: huge oval arena in Rome / opened 80 CE / held about 50,000 people / free shows: gladiator fights, animal hunts, plays / underground tunnels and lifts for animals and scenery / canvas awning for shade / damaged by earthquakes; still standing / now a symbol of Rome",
    model:
      "The Colosseum is a huge oval arena in the center of Rome that opened in 80 CE. It could hold about fifty thousand spectators, who came to watch free shows such as gladiator fights, animal hunts and plays. Beneath the arena floor lay a maze of tunnels and lifts that raised animals and scenery up through trapdoors, surprising the crowd. On hot days, sailors stretched a huge canvas awning over the seats to give shade. Although earthquakes and the passing centuries have damaged it, the Colosseum is still standing today. It has become a symbol of the city and of the power of ancient Rome.",
  },
  {
    task: "Use the notes to write an informative paragraph that explains what a Roman legion was.",
    source:
      "legion: main unit of Roman army / about 5,000 soldiers / soldiers were citizens, served 20-25 years / trained hard: marching 20 miles a day with heavy packs / armed with short sword, shield, javelins / built camp with walls every night / also built roads, bridges, forts / eagle standard was legion's symbol",
    model:
      "A legion was the main unit of the Roman army, made up of about five thousand soldiers. Legionaries were Roman citizens who served for twenty to twenty-five years. Their training was tough: they had to march twenty miles a day while carrying heavy packs. In battle, each soldier fought with a short sword, a large shield and javelins for throwing. Every night on the march, the legion built a camp surrounded by walls. Legionaries were builders as well as fighters, constructing roads, bridges and forts across the empire. Each legion carried a bronze eagle on a pole, its proudest symbol, which soldiers would die to protect.",
  },
  {
    task: "Use the notes to write an informative paragraph that explains how volcanoes form.",
    source:
      "earth's crust broken into plates / magma: melted rock below crust / where plates pull apart or one slides under another, magma rises / magma collects in chamber / pressure builds, magma bursts through vent / called lava once outside / layers of lava and ash build the mountain / examples: Mount Fuji, Vesuvius",
    model:
      "A volcano forms where melted rock from deep inside the earth breaks through the surface. The earth's crust is broken into huge pieces called plates. Where two plates pull apart, or where one slides beneath another, magma, which is melted rock, can rise toward the surface. The magma collects in a chamber underground, and as more arrives, pressure builds. Eventually the magma bursts out through an opening called a vent. Once it reaches the surface, it is called lava. Over time, layer after layer of cooled lava and ash piles up into a mountain. Mount Fuji in Japan and Vesuvius in Italy both formed this way.",
  },
  {
    task: "Use the notes to write an informative paragraph about how honeybees live together.",
    source:
      "honeybees live in colonies of up to 60,000 / one queen lays all the eggs, up to 2,000 a day / worker bees (female): collect nectar and pollen, make honey, clean, guard / drones (male): mate with queen / waggle dance tells others where flowers are / colony survives winter by eating stored honey",
    model:
      'Honeybees live together in colonies that can hold as many as sixty thousand bees, and each bee has a job. A single queen lays all of the colony\'s eggs, sometimes two thousand in one day. Most of the bees are female workers, who collect nectar and pollen, make honey, clean the hive and guard its entrance. The few males, called drones, have only one task, which is to mate with a queen. Workers share information in a surprising way: a bee that finds flowers performs a "waggle dance" that shows the others which direction to fly and how far. In winter, the colony survives by eating the honey it stored during summer.',
  },
  {
    task: "Use the notes to write an informative paragraph that explains how a compass works.",
    source:
      "compass: tool for finding direction / needle is a small magnet / earth acts like a giant magnet with magnetic poles near geographic poles / needle lines up with earth's magnetic field, points north / invented in China, first used at sea by about 1100 / let sailors navigate under cloudy skies / iron objects nearby can make it wrong",
    model:
      "A compass is a simple tool that shows which way is north. Its needle is a small, thin magnet that can spin freely. Because the earth itself acts like a giant magnet, with magnetic poles near its geographic poles, the needle lines up with the earth's magnetic field and points north. The compass was invented in China, and sailors there were using it at sea by about the year 1100. It allowed them to navigate even when clouds hid the sun and stars. However, a compass is not perfect: iron objects nearby can pull the needle and give a false reading, so careful navigators keep metal away from it.",
  },
  {
    task: "Use the notes to write an informative paragraph that explains what the Roman forum was.",
    source:
      "forum: open public square at center of a Roman town / Rome's forum in a valley between hills / temples, law courts, the senate house around it / markets and shops / speeches and elections held there / triumphal processions passed through / ruins visited by millions today",
    model:
      "The forum was the open public square at the heart of every Roman town, and it was the center of public life. In Rome, the great forum lay in a valley between the city's hills. Around its edges stood temples to the gods, law courts and the senate house, where the city's leaders met. Merchants set up markets and shops there, so people came to the forum to buy food as well as to hear the news. Politicians gave speeches from platforms, elections were held there, and victorious generals led their triumphal processions through it. Today, the ruins of Rome's forum are visited by millions of people each year.",
  },
  {
    task: "Use the notes to write an informative paragraph that explains what a Roman citizen's rights were.",
    source:
      "citizenship: membership in Roman state / at first only for people of Rome; later spread across empire; in 212 CE given to almost all free men / rights: vote, hold office, own property, make contracts / right to a trial; could appeal to the emperor / could not be whipped or crucified / women citizens: could own property but not vote / duties: pay taxes, serve in army",
    model:
      "Being a Roman citizen meant belonging to the Roman state and having special rights. At first, only people from the city of Rome were citizens, but over time citizenship spread across the empire, until in 212 CE it was given to almost all free men. Citizens could vote, hold public office, own property and make legal contracts. A citizen accused of a crime had the right to a trial and could even appeal to the emperor, and he could not be whipped or crucified. Women who were citizens could own property but could not vote. In return for these rights, citizens had duties, such as paying taxes and serving in the army.",
  },
];

/** summaryBank asks for an objective summary of a longer text. */
const summaryBank: readonly WritingItem[] = [
  {
    task: "Write an objective summary of the text.",
    source:
      "Coral reefs cover less than one percent of the ocean floor, yet they are home to about a quarter of all ocean species. A reef is built by tiny animals called coral polyps, which take calcium from seawater and build hard skeletons. Over thousands of years, these skeletons pile up into huge structures. The polyps depend on tiny algae living inside them, which make food from sunlight; this is why reefs grow in clear, shallow water. Today, reefs are in danger. When the ocean becomes too warm, the polyps push out their algae and turn white, a process called bleaching. If the water does not cool, the coral starves and dies. Pollution and overfishing add to the harm. Scientists are now growing young corals in nurseries and planting them on damaged reefs, hoping to help them recover.",
    model:
      "The text explains that coral reefs, though small in area, support a large share of ocean life, and that they are now threatened. Reefs are built over thousands of years from the skeletons of coral polyps, which rely on algae that need sunlight. Warm water causes bleaching, in which corals lose their algae and may die, while pollution and overfishing cause further damage. Scientists are trying to help by growing young corals and planting them on damaged reefs.",
  },
  {
    task: "Write an objective summary of the text.",
    source:
      'Plankton are the drifters of the sea. The word comes from a Greek word meaning "wanderer," because these living things cannot swim against currents. There are two main kinds. Phytoplankton are tiny plant-like organisms that use sunlight to make food. They produce about half of the oxygen on Earth, more than all the forests combined. Zooplankton are tiny animals, including baby fish, shrimp-like krill and jellyfish, and many of them eat phytoplankton. Together, plankton form the base of the ocean food web. Small fish eat them, larger fish eat the small fish, and even the largest animal on Earth, the blue whale, survives by swallowing huge mouthfuls of krill. Without plankton, almost all ocean life would disappear.',
    model:
      "The text describes plankton, small living things that drift with ocean currents, and explains why they are essential. Phytoplankton make food from sunlight and produce about half of Earth's oxygen, while zooplankton are tiny animals that often eat phytoplankton. Together they form the base of the ocean food web, feeding animals from small fish to blue whales, so almost all ocean life depends on them.",
  },
  {
    task: "Write an objective summary of the text.",
    source:
      "Every year, humpback whales make one of the longest journeys of any mammal. In summer, they feed in cold waters near the poles, where krill and small fish are plentiful. They eat enormous amounts, building up thick layers of fat. When winter comes, they swim thousands of miles to warm tropical waters. There, they give birth and raise their calves, which could not survive in icy seas. During this time, the adults eat almost nothing and live off their stored fat. In spring, the mothers lead their calves back toward the feeding grounds. Scientists are still studying how whales find their way; they may use the sun, the earth's magnetic field and the shape of the ocean floor. Tracking tags have shown that some humpbacks travel more than five thousand miles each way.",
    model:
      "The text explains the yearly migration of humpback whales between polar feeding grounds and tropical breeding waters. In summer, they eat heavily in cold waters and store fat; in winter, they travel to warm seas to give birth and raise calves while barely eating. In spring, they return. Scientists think whales may navigate using the sun, the magnetic field and the sea floor, and tags show some travel over five thousand miles each way.",
  },
  {
    task: "Write an objective summary of the text.",
    source:
      "Along cool, rocky coasts, giant underwater forests grow. They are made of kelp, a large brown seaweed that can grow up to two feet in a single day and reach over one hundred feet tall. Kelp is held to the rocks by root-like holdfasts, and gas-filled bulbs keep its long blades floating toward the sunlight. Kelp forests shelter hundreds of species, from fish and crabs to seals. Sea otters play a key role. They eat sea urchins, spiny animals that feed on kelp. Where otters were hunted almost to extinction, urchins multiplied and ate entire forests, leaving bare rock. When otters were protected and returned, the urchins were kept in check, and the kelp grew back. Scientists use this as an example of how one animal can shape a whole ecosystem.",
    model:
      "The text describes kelp forests, fast-growing seaweed forests on rocky coasts that shelter many species, and shows how sea otters keep them healthy. Kelp is anchored by holdfasts and floats upward on gas-filled bulbs. Otters eat sea urchins, which eat kelp; when otters disappeared, urchins destroyed the forests, and when otters returned, the kelp recovered. Scientists use this as an example of one animal shaping an entire ecosystem.",
  },
  {
    task: "Write an objective summary of the text.",
    source:
      "Millions of tons of plastic enter the ocean every year. Some of it comes from ships, but most washes in from land through rivers, drains and wind. Plastic does not rot the way wood or paper does. Instead, sunlight and waves break it into smaller and smaller pieces called microplastics. Sea turtles mistake floating bags for jellyfish, and seabirds feed bottle caps to their chicks. Microplastics are swallowed by plankton and fish and can move up the food chain. Ocean currents carry floating plastic into huge swirling zones, such as the Great Pacific Garbage Patch. Some groups are developing machines to collect plastic from the sea, but many scientists say the most important step is to stop plastic from reaching the water in the first place, by using less and recycling more.",
    model:
      "The text explains how plastic gets into the ocean and the harm it causes. Most plastic washes in from land, and rather than rotting, it breaks into tiny microplastics. Animals such as turtles and seabirds eat plastic by mistake, and microplastics move through the food chain, while currents gather plastic into large patches. Although machines are being built to remove it, many scientists say preventing plastic from reaching the sea matters most.",
  },
  {
    task: "Write an objective summary of the text.",
    source:
      "The deep sea, below about three thousand feet, is the largest living space on Earth, but it is also one of the least explored. No sunlight reaches it, the water is near freezing, and the pressure is crushing. Yet life thrives there. Many deep-sea animals make their own light, a skill called bioluminescence, which they use to attract prey, find mates or confuse predators. The anglerfish dangles a glowing lure in front of its mouth. Food is scarce, so many animals have huge mouths and stretchy stomachs to eat whatever they find. Near hot springs on the sea floor, entire communities of giant tube worms, clams and shrimp live on bacteria that make food from chemicals instead of sunlight. Scientists exploring with robot submarines still discover new species on almost every dive.",
    model:
      "The text describes the deep sea as a vast, dark, cold and high-pressure environment that is little explored but full of life. Many animals there produce their own light to hunt, find mates or escape predators, and many have large mouths and stomachs because food is scarce. Around sea-floor hot springs, communities live on bacteria that make food from chemicals. Robot submarines continue to find new species there.",
  },
  {
    task: "Write an objective summary of the text.",
    source:
      "In 1936, Dr. Amara Okafor, a fictional marine biologist in our story, began her career by counting fish from a rowboat with a notebook and a pencil. Today, her granddaughter studies the same bay with underwater drones, satellite images and DNA tests of seawater. The tools have changed, but the questions are much the same: which animals live here, how many are there, and how are they changing? DNA testing has been especially useful. Every animal sheds tiny bits of skin and waste into the water, so a single bottle of seawater can reveal which species have passed by, even ones no one has seen. Satellites track the temperature of the sea and the spread of algae. Drones can follow a whale for hours without disturbing it. Together, these tools let scientists study the ocean faster and more gently than ever before.",
    model:
      "The text compares how marine scientists studied the ocean in the past and how they study it today. Where an early biologist counted fish by hand from a boat, scientists now use drones, satellites and DNA testing of seawater, though their questions about which animals live in a place and how they are changing remain similar. DNA in water reveals species no one has seen, satellites track temperature and algae, and drones follow animals without disturbing them, making research faster and gentler.",
  },
  {
    task: "Write an objective summary of the text.",
    source:
      "Twice a day, the sea rises up the beach and then slips back again. These movements are called tides, and they are caused mainly by the moon. The moon's gravity pulls on the earth's oceans, making the water bulge out on the side facing the moon. A second bulge forms on the opposite side of the earth. As the earth turns, each coast passes through both bulges, so most places have two high tides and two low tides each day. The sun's gravity matters too. When the sun and moon line up, at the new and full moon, their pulls combine to make extra-high tides called spring tides. When they pull at right angles, the tides are smaller. Animals of the shore, such as crabs, mussels and sea stars, must survive being underwater and then exposed to the air every few hours.",
    model:
      "The text explains that tides, the twice-daily rise and fall of the sea, are caused mainly by the moon's gravity, which creates two bulges of water on opposite sides of the earth. As the earth turns, coasts pass through these bulges, giving two high and two low tides each day. The sun also affects tides, making them larger when it lines up with the moon and smaller when it does not. Shore animals must survive these regular changes.",
  },
  {
    task: "Write an objective summary of the text.",
    source:
      "The ocean is divided into zones by depth. The sunlight zone, from the surface down to about six hundred feet, receives enough light for plants and algae to grow. Most ocean life lives here, including dolphins, sea turtles and most fish. Below it, the twilight zone reaches to about three thousand feet. Only faint blue light reaches these waters, so no plants can grow, and many animals rise toward the surface at night to feed, then sink again by day. This daily trip is the largest migration on Earth. Below the twilight zone lies the midnight zone, which is completely dark and very cold. Even deeper are the abyss and the trenches, where the pressure is more than a thousand times that at the surface. Each zone has creatures adapted to its light, temperature and pressure.",
    model:
      "The text explains that the ocean is divided into zones by depth, each with its own conditions and life. The sunlight zone has enough light for plants and holds most ocean life. The twilight zone gets only faint light, and many of its animals swim up each night to feed, the largest migration on Earth. Below lie the dark, cold midnight zone and the abyss and trenches, with enormous pressure. Each zone's creatures are adapted to it.",
  },
  {
    task: "Write an objective summary of the text.",
    source:
      "An ocean food web shows who eats whom in the sea. It begins with producers, mostly phytoplankton, which make food from sunlight. Zooplankton graze on the phytoplankton. Small fish, such as anchovies, eat the zooplankton, and larger fish, like tuna, eat the small fish. At the top are predators such as sharks, orcas and seals. When these animals die, decomposers, mostly bacteria, break down their bodies and return nutrients to the water, where phytoplankton use them again. Because the parts of a food web are connected, a change in one part affects the others. When too many anchovies are caught, for example, seabirds and larger fish that depend on them go hungry. This is why scientists argue that fishing limits must consider the whole web, not just one species.",
    model:
      "The text explains how an ocean food web connects living things through what they eat. Phytoplankton produce food from sunlight, zooplankton eat them, small fish eat zooplankton, and larger fish and top predators eat those below them, while decomposers return nutrients to the water. Because every part is connected, changes such as overfishing anchovies affect other animals, so scientists say fishing limits should take the whole web into account.",
  },
  {
    task: "Write an objective summary of the text.",
    source:
      "Marine protected areas are parts of the ocean where human activities such as fishing, drilling or mining are limited or banned. They work something like national parks on land. Studies of protected areas around the world have found that, after some years, they often contain more fish, and larger fish, than nearby waters. Some of these fish swim out of the protected area, which can help fishers who work nearby. However, protected areas only work if their rules are enforced, and patrolling large areas of sea is difficult and costly. Some fishing communities have also opposed new protected areas, worried about losing their income. Today, a little under ten percent of the ocean is protected in some way, and many countries have agreed to raise that to thirty percent by 2030.",
    model:
      "The text describes marine protected areas, ocean regions where fishing, drilling or mining is limited, and weighs their effects. Studies show they often come to hold more and larger fish, some of which move into nearby waters and help fishers. However, the rules are hard and costly to enforce, and some fishing communities oppose them out of concern for their income. About ten percent of the ocean is now protected, and many countries aim for thirty percent by 2030.",
  },
  {
    task: "Write an objective summary of the text.",
    source:
      "Sea turtles have lived in the oceans for over one hundred million years, yet six of the seven species are now endangered or threatened. Female turtles return to the same beaches where they hatched to lay their eggs in the sand. When the babies hatch, they head for the brightest horizon, which is normally the moonlit sea. Today, lights from hotels and roads can lead them the wrong way, toward danger. Turtles also get caught in fishing nets and swallow plastic bags they mistake for jellyfish. In many places, people are working to help. Volunteers guard nesting beaches, towns dim their lights during hatching season, and some fishing nets now have escape hatches that let turtles swim free. In several regions, these efforts have helped turtle numbers begin to rise.",
    model:
      "The text explains why most sea turtle species are endangered and what people are doing to help. Turtles nest on the beaches where they hatched, but artificial lights can confuse hatchlings, and turtles also die in fishing nets or from eating plastic. In response, volunteers guard beaches, towns dim their lights during hatching season, and some nets have escape hatches. In several regions, turtle numbers have started to increase.",
  },
];

/** viewBank asks for a narrative of an event told by one character, with what that character can know and feel. */
const viewBank: readonly WritingItem[] = [
  {
    task: "Tell the moment Zheng He's fleet arrives at a port in East Africa from the point of view of a young girl on the shore who has never seen such ships.",
    model:
      "I was mending a net with my grandmother when the first sail appeared, and at first I thought it was a cloud that had fallen onto the sea. Then came another, and another, until the whole horizon was covered with ships taller than our mosque. My hands went cold. Grandmother stood up so fast that the net slid into the sand. Men on the beach were shouting, but I could not understand why the ships did not come closer, only waited, their red sails glowing in the late sun. Then a small boat rowed toward us, and a man in a silk robe raised his empty hands. I did not know who he was or what he wanted, but I saw my grandmother lift her hand back, and so, slowly, I did the same.",
  },
  {
    task: "Tell the moment a Polynesian navigator first sights a new island after weeks at sea, from the point of view of the navigator's young apprentice.",
    model:
      'For nineteen days I had watched the stars rise and set, trying to remember everything my teacher said, and for nineteen days I had seen only water. That morning, my teacher sat in silence at the front of the canoe, his eyes half closed, his palm resting on the hull as if he were listening to it. I wanted to ask whether we were lost, but I was afraid of the answer. Then he pointed, not at the horizon but at a single white bird flying west. "It is going home," he said. My heart thumped. I stared until my eyes watered, and at last I saw it: a gray smudge, low on the water, that did not move like a cloud. I shouted, and the whole crew shouted with me, but my teacher only smiled, as if he had known all along.',
  },
  {
    task: "Tell the first steps on the moon from the point of view of a child watching on a small television at home in 1969.",
    model:
      "Our whole street crowded into our living room because we were the only family with a television. I sat on the floor so close to the screen that Mom kept pulling me back by my collar. The picture was fuzzy and gray, and for a long time nothing seemed to happen, just a shape and a ladder and a lot of crackling voices. My uncle said it was the most important night in history, but I mostly felt my legs going numb. Then a white, puffy figure moved down the ladder, slow as a dream. Someone gasped. When the boot touched the ground, the room went completely silent, and I realized I was holding my breath. I looked out the window at the real moon, tiny and bright, and tried to believe a person was standing on it right then.",
  },
  {
    task: "Tell the moment Matthew Henson and his team reach the area of the North Pole, from Henson's own point of view.",
    model:
      "The wind had cut my face for weeks, and I no longer felt my fingers inside the fur mittens. I walked ahead of the sleds, as I always did, testing the ice with my pole and listening for the deep crack that meant open water. Behind me, the dogs panted and the Inuit men called to them in the words they had taught me years before. When my measurements said we were nearly there, I did not feel the joy I had imagined. I felt tired, and I thought of all the miles still between us and home. I looked around at the white emptiness, the same in every direction, and I understood that no one could ever see the place we had reached. We had come to it only by trusting one another.",
  },
  {
    task: "Tell a sudden storm aboard one of Magellan's ships from the point of view of a ship's boy on his first voyage.",
    model:
      'I was asleep in the hold when the ship tipped so far that I rolled off my sack of rice and into a barrel. Water was pouring down the ladder, cold as ice. Above me I heard the captain roaring orders and the sails cracking like whips. I did not know what I was supposed to do, so I grabbed a bucket because I saw an older sailor grabbing one. We bailed for hours, my arms burning, while the ship groaned as if it were in pain. Every time a wave hit, I was sure we would sink, and I prayed in a whisper so no one would hear how scared I was. When gray light finally came through the hatch, the sea had calmed, and the old sailor patted my shoulder and said, "Now you are one of us."',
  },
  {
    task: "Tell the day Ibn Battuta's caravan reaches a desert oasis from the point of view of one of the camels' young handlers.",
    model:
      "By the eighth day without a well, the camels had stopped grumbling, and that frightened me more than their complaints had. My lips had cracked, and the sand seemed to shine up into my eyes no matter how I wrapped my scarf. The scholar from Tangier rode near me, writing in his little book even when his hand shook. I could not imagine what he found to write about in so much nothing. Then my lead camel lifted her head and pulled hard on the rope, almost knocking me over. She could smell something I could not. A few minutes later, I saw palm trees rising out of the heat, green as a dream. I ran beside her, laughing and crying at once, and I did not care that the scholar was watching and writing it all down.",
  },
  {
    task: "Tell the moment the first explorers reach the South Pole and find another team's flag already there, from the point of view of one member of the second team.",
    model:
      "For two months I had dreamed of being the first person to stand at the bottom of the world. That dream was what pulled my frozen feet forward each morning. So when our leader stopped and pointed at a dark speck ahead, I thought at first it was a rock. As we came closer, I saw it was a tent, and above it a flag that was not ours, snapping in the wind. Nobody spoke. I felt something inside me fall, like a sled sliding off a cliff. Inside the tent was a letter from the other team, polite and calm. I read it twice and then sat on my sled and looked at the endless white. We had walked eight hundred miles to reach a place where someone else's footprints were waiting.",
  },
  {
    task: "Tell a scene from the Lewis and Clark expedition from the point of view of Sacagawea as the team meets her own people after years away.",
    model:
      "When the hills began to look like the ones I remembered, my heart started to race, but I did not let myself hope. Six years had passed since I was taken from my people, and I was not sure they would know me. The captains wanted horses to cross the mountains, and they needed me to speak for them. As the riders came toward us, I studied their faces. Then I saw a young woman I had played with as a child, and I ran to her before I knew my feet were moving. We held each other and could not stop crying. Later, when I was called to translate, I looked at the chief and saw that he was my own brother. For a moment I could not speak at all.",
  },
  {
    task: "Tell the departure of a ship on a long voyage from the point of view of the captain's daughter, left behind on the dock.",
    model:
      'Father knelt to fix the ribbon on my bonnet, though it did not need fixing, and I knew he was trying not to look at my face. "Two years," he said, "and then I will bring you a parrot that can say your name." I nodded because I could not trust my voice. The sailors were already shouting from the rigging, and the gulls screamed over the masts. When he walked up the plank, I counted his steps so I would not cry, and I lost count at eleven. Mother squeezed my hand hard enough to hurt. The ship slid away slowly, and I waved until I could not tell which of the tiny figures on deck was him. Even then I kept waving, in case he could still see me.',
  },
  {
    task: "Tell a dive into the deepest part of the ocean from the point of view of the pilot of the small submarine.",
    model:
      "The last of the blue faded from the window when we passed three thousand feet, and after that there was only black. I watched the depth numbers climb, my hands steady on the controls even though my heart was not. Every so often the hull made a small ticking sound as the pressure squeezed it, and each time my stomach tightened. The scientist beside me pressed her face to the porthole, whispering about the flashes of light drifting past us, but I kept my eyes on the gauges. Hours later, the lights showed a floor of pale, soft mud, smooth as snow. I let out a breath I felt I had been holding since the surface. We were seven miles down, and for a moment I was too amazed to speak.",
  },
  {
    task: "Tell a moment of an expedition into an uncharted rain forest from the point of view of the expedition's mapmaker.",
    model:
      "My map ended where the river split, and beyond that line the paper was blank. All morning, the others hacked at the vines while I measured our steps and checked my compass, trying to turn the green tangle into something I could draw. Sweat kept dripping onto the page and blurring my lines, and the insects found every inch of skin I had missed. I was beginning to wonder if any map could hold this place. Then the forest suddenly opened, and I found myself standing on a rock above a waterfall no outsider had ever recorded. The others cheered and splashed into the pool below, but I sat down, opened my notebook and, with shaking fingers, drew the first line that had ever marked this spot.",
  },
  {
    task: "Tell the return of an expedition after a year away from the point of view of an explorer seeing home again.",
    model:
      "As the train pulled into the station, I pressed my face against the window like a child. I had imagined this moment through every frozen night on the ice, but now that it was here, I felt strangely afraid. Would they know me, with my beard and my thin face? I stepped onto the platform, and the noise of the city hit me: horns, voices, music, the smell of roasting chestnuts. After a year of silence and wind, it was almost too much. Then I heard my name, and I turned to see my sister running toward me, older than I remembered. She threw her arms around me, and I laughed, and the laugh turned into tears, and I realized that I had finally reached the place I had been traveling toward all along.",
  },
];

/** writingTopics68 are the writing topics judged by a model added for grades 6 to 8. */
export const writingTopics68: readonly TopicDef[] = [
  {
    id: "retelling-a-myth",
    title: t("Retelling a Myth", "复述神话"),
    summary: t(
      "A myth retold from notes in two or three paragraphs, keeping its conflict and its lesson.",
      "根据笔记用两三个段落复述一则神话，保留其中的冲突和寓意。",
    ),
    prerequisites: ["writing-a-narrative-paragraph", "plot-and-conflict"],
    encompasses: [
      { topic: "writing-a-narrative-paragraph", weight: 0.4 },
      { topic: "plot-and-conflict", weight: 0.2 },
    ],
    xp: 25,
    strand: "writing",
    criteria: ["g68-myth-conflict", "g68-myth-sequence", "g68-myth-telling", "g68-myth-lesson"].map(criterion),
    knowledgePoints: [
      point(
        "telling-a-myth",
        t("Telling a Myth", "讲述神话"),
        t(
          "A myth is an old story, often about gods and heroes, that explains something about the world or teaches how to live. To retell one, keep three things: the **conflict** (what the hero wants and what stands in the way), the **events** in order up to the turning point and its outcome, and the **lesson** or explanation at the end.\n\nThen make it your own telling. Open by setting the scene, add a line of dialogue or a vivid detail at the key moment, and use a new paragraph when the story turns. Close by making the lesson clear, but through the ending rather than a lecture: *His pride had made him ask for a power he could not handle.*",
          "神话是古老的故事，常常讲述神和英雄，用来解释世界上的某些现象或教人如何生活。复述神话时，要保留三点：**冲突**（主人公想要什么、遇到了什么阻碍）、按顺序直到转折点及其结果的**事件**，以及结尾的**寓意**或解释。\n\n然后用你自己的方式讲述。开头交代场景，在关键时刻加一句对话或一个生动的细节，故事转折时另起一段。结尾让寓意清楚，但要通过结局而不是说教来体现：*His pride had made him ask for a power he could not handle.*",
        ),
        writingGenerator(
          t("Use the notes to retell the myth in English, in two or three paragraphs.", "根据笔记，用英语分两三个段落复述这则神话。"),
          mythBank,
          ["g68-myth-conflict", "g68-myth-sequence", "g68-myth-telling", "g68-myth-lesson"],
          { minWords: 110, maxChars: 3200 },
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "responding-to-a-poem",
    title: t("Responding to a Poem", "回应一首诗"),
    summary: t(
      "A paragraph on what a poem's images and sounds make the reader feel, quoting it.",
      "写一个段落，引用诗句，说明诗中的意象和声音让读者有什么感受。",
    ),
    prerequisites: ["tone-and-mood", "writing-a-paragraph"],
    encompasses: [
      { topic: "tone-and-mood", weight: 0.3 },
      { topic: "writing-a-paragraph", weight: 0.3 },
    ],
    xp: 20,
    strand: "writing",
    criteria: ["g68-poem-feeling", "g68-poem-quotes", "g68-poem-how", "g68-poem-focus"].map(criterion),
    knowledgePoints: [
      point(
        "images-sounds-and-feeling",
        t("Images, Sounds and Feeling", "意象、声音与情感"),
        t(
          'A response to a poem opens with a claim about the feeling it creates, named precisely: *wistful*, *ominous*, *serene*, not just *sad* or *happy*. Then it proves the claim with the poem\'s own words, in quotation marks, and explains **how** each quoted part creates the feeling: what an image makes us picture, what a simile compares, what a repeated sound or a short line does to the pace.\n\nQuote briefly, a few words at a time, and spend more words explaining than quoting. Mark line breaks with a slash: *"upside down and perfectly. / A heron lifts one foot."*',
          '回应一首诗时，开头先提出关于它所营造情感的论点，并准确地命名这种情感：*wistful*、*ominous*、*serene*，而不只是 *sad* 或 *happy*。然后用诗中的原话（加引号）来证明这个论点，并解释每处引文**怎样**营造了这种情感：一个意象让我们想象什么，一个明喻比较了什么，一个重复的声音或一行短句对节奏有什么作用。\n\n引用要简短，每次几个词，解释的文字要多于引用的文字。用斜线标出分行：*"upside down and perfectly. / A heron lifts one foot."*',
        ),
        writingGenerator(
          t("Read the poem and write a paragraph about it in English.", "阅读这首诗，用英语写一个段落来回应它。"),
          poemBank,
          ["g68-poem-feeling", "g68-poem-quotes", "g68-poem-how", "g68-poem-focus"],
          { minWords: 80, maxChars: 2400 },
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-an-informative-paragraph",
    title: t("Writing an Informative Paragraph", "写说明段落"),
    summary: t(
      "A paragraph that explains a topic from notes with facts, definitions and examples, in a clear order.",
      "根据笔记写一个段落，用事实、定义和例子按清晰的顺序说明一个话题。",
    ),
    prerequisites: ["writing-a-paragraph", "text-structures"],
    encompasses: [
      { topic: "writing-a-paragraph", weight: 0.3 },
      { topic: "text-structures", weight: 0.2 },
    ],
    xp: 20,
    strand: "writing",
    criteria: ["g68-inform-topic", "g68-inform-facts", "g68-inform-order", "g68-inform-close"].map(criterion),
    knowledgePoints: [
      point(
        "explaining-from-notes",
        t("Explaining from Notes", "根据笔记进行说明"),
        t(
          "An informative paragraph teaches the reader about a topic without arguing for a side. Its topic sentence names the topic and the main point: *Roman aqueducts carried fresh water into cities using only gravity.* The body gives the facts from the notes, defines any special word the reader may not know (*magma, which is melted rock*), and adds examples.\n\nPut the facts in an order the reader can follow, such as steps in a process, causes and effects, or parts of a whole, and link them with transitions: *first, then, because of this, for example, however*. End with a sentence that sums up why the topic matters, not with your opinion of it.",
          "说明段落向读者介绍一个话题，而不是为某一方辩护。主题句点明话题和要点：*Roman aqueducts carried fresh water into cities using only gravity.* 正文给出笔记中的事实，解释读者可能不懂的专门用词（*magma, which is melted rock*），并举出例子。\n\n按读者能够理解的顺序安排事实，比如过程的步骤、因果关系或整体的各个部分，并用过渡词连接：*first, then, because of this, for example, however*。结尾用一句话总结这个话题为什么重要，而不是发表你对它的看法。",
        ),
        writingGenerator(
          t("Use the notes to write an informative paragraph in English.", "根据笔记用英语写一个说明段落。"),
          informBank,
          ["g68-inform-topic", "g68-inform-facts", "g68-inform-order", "g68-inform-close"],
          { minWords: 80, maxChars: 2400 },
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-an-objective-summary",
    title: t("Writing an Objective Summary", "写客观摘要"),
    summary: t(
      "The central idea of a longer text and how it is developed, in a few sentences and without opinions.",
      "用几句话写出较长文本的中心思想及其展开方式，不加入个人观点。",
    ),
    prerequisites: ["writing-a-summary", "citing-textual-evidence"],
    encompasses: [
      { topic: "writing-a-summary", weight: 0.4 },
      { topic: "citing-textual-evidence", weight: 0.2 },
    ],
    xp: 20,
    strand: "writing",
    criteria: ["g68-summary-central", "g68-summary-development", "g68-summary-objective", "g68-summary-concise"].map(criterion),
    knowledgePoints: [
      point(
        "central-idea-and-development",
        t("The Central Idea and Its Development", "中心思想及其展开"),
        t(
          "An **objective summary** tells what a text says, not what you think of it. Open with the text's **central idea**, often with a phrase such as *The text explains that…* or *The article describes…*. Then show how the text **develops** that idea: its main supporting points, in the order the text gives them, leaving out examples and small details.\n\nStay objective: no *I think*, no *interesting* or *amazing*, and nothing the text does not say. Use your own words and keep it short, about a third of the length of the original or less.",
          "**客观摘要**讲述文本说了什么，而不是你对它的看法。开头写出文本的**中心思想**，常用 *The text explains that…* 或 *The article describes…* 这样的短语。然后说明文本怎样**展开**这个思想：按文本的顺序写出主要的支撑要点，省略例子和次要细节。\n\n保持客观：不写 *I think*，不用 *interesting* 或 *amazing* 这类词，也不写文本没有说的内容。用自己的话，写得简短，大约是原文的三分之一或更短。",
        ),
        writingGenerator(
          t(
            "Read the text and write an objective summary of it in English, in your own words.",
            "阅读这篇文本，用你自己的英语为它写一个客观摘要。",
          ),
          summaryBank,
          ["g68-summary-central", "g68-summary-development", "g68-summary-objective", "g68-summary-concise"],
          { minWords: 40, maxChars: 1400 },
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-a-narrative-from-a-point-of-view",
    title: t("Writing a Narrative from a Point of View", "从某一视角写叙事"),
    summary: t(
      "An event told by one character, with only what that character can know, see and feel.",
      "由一个人物讲述一个事件，只写这个人物能知道、看到和感受到的内容。",
    ),
    prerequisites: ["writing-a-narrative-paragraph", "narrative-point-of-view"],
    encompasses: [
      { topic: "writing-a-narrative-paragraph", weight: 0.4 },
      { topic: "narrative-point-of-view", weight: 0.3 },
    ],
    xp: 20,
    strand: "writing",
    criteria: ["g68-pov-consistent", "g68-pov-limits", "g68-pov-inner", "g68-pov-event"].map(criterion),
    knowledgePoints: [
      point(
        "one-characters-eyes",
        t("Through One Character's Eyes", "通过一个人物的眼睛"),
        t(
          "The same event looks different to each person who lives through it. To tell it from one point of view, choose your narrator and stay with them, usually as *I*. Tell only what they can see, hear and know: a girl on the shore can see the ships but cannot know what the sailors are thinking, unless she guesses.\n\nShow the narrator's thoughts and feelings, through their body (*my hands went cold*) and their own words for things: a child who has never seen a ship might think the sail is a fallen cloud. Give the event a beginning and an end, and let the last line show what it meant to that person.",
          "同一件事，在每个亲历者眼中都不一样。要从一个视角讲述，就选定叙述者并始终跟随他，通常用 *I*。只写他能看到、听到和知道的：岸边的女孩能看到船，却不能知道水手在想什么，除非她去猜测。\n\n通过叙述者的身体（*my hands went cold*）和他自己对事物的说法来表现他的想法和感受：一个从没见过船的孩子，可能会以为船帆是落下来的云。让事件有开头和结尾，并用最后一句表现这件事对这个人意味着什么。",
        ),
        writingGenerator(
          t("Write a narrative in English from the point of view given.", "按照所给的视角，用英语写一段叙事。"),
          viewBank,
          ["g68-pov-consistent", "g68-pov-limits", "g68-pov-inner", "g68-pov-event"],
          { minWords: 90, maxChars: 2400 },
          onePiece,
        ),
      ),
    ],
  },
];
