// Grade 11: writing judged by a model, part one: an analysis of a motif, a meditative essay and a critique of an
// argument.

import { type TopicDef, t } from "@ga/content";
import { point, type WritingItem, writingGenerator } from "@ga/subject-english";
import { after, covers } from "../grade-5/links.ts";
import { criterion, onePiece } from "../grade-5/writing-judged-a.ts";

/** limits are the length limits of a grade 11 essay. */
export const limits = { minWords: 180, maxChars: 5400 };

/** motifBank gives a short original story with a motif for the student to analyze. */
const motifBank: readonly WritingItem[] = [
  {
    task: 'Write a short analysis of the motif of the clock in this story. When Ana\'s father left, the kitchen clock stopped at ten past four, and her mother would not let anyone wind it. For years the family ate, argued and celebrated beneath it. Visitors asked about it; her mother changed the subject. On the night Ana left for university, she found her mother standing on a chair, winding the clock. "It was only waiting," her mother said. The next morning it was ticking, five hours wrong.',
    model:
      'The stopped clock in this story is a motif of a family frozen by grief, and its last appearance shows that healing does not mean returning to the past.\n\nThe clock stops "at ten past four," the moment the father leaves, and the mother "would not let anyone wind it." Time in the kitchen has been halted at the wound. The family goes on living "beneath it," and the word beneath suggests that the loss hangs over every meal and argument.\n\nThe middle of the story repeats the motif through silence. Visitors ask about the clock and the mother "changed the subject." The clock has become the one thing that cannot be discussed, so it stands for the grief the family refuses to name.\n\nThe turning point comes when Ana leaves home. Her mother winds the clock and says, "It was only waiting." Her daughter\'s departure forces her to accept another loss, and this time she chooses to move forward.\n\nThe final detail is the most telling: the clock is ticking but "five hours wrong." Life has started again, yet it does not match the old time. The family cannot undo the past; it can only begin from where it stands.',
  },
  {
    task: "Write a short analysis of the motif of the bridge in this story. Two villages faced each other across a river and had not spoken for fifty years. Each spring, the children threw stones at the ruined bridge between them. When a flood came, the old men of both villages worked side by side to save the last span. Afterward they stood on it, not speaking. The next year, the children threw flowers instead of stones.",
    model:
      'The ruined bridge is a motif of the broken relationship between the two villages, and its changes trace a slow movement from hatred toward reconciliation.\n\nAt the start, the bridge is "ruined," a picture of fifty years of silence. The villages "faced each other" but could not cross, so the broken bridge marks the exact place where the connection failed. The children\'s habit of throwing stones at it each spring shows that the hostility is being handed down; the young attack the symbol of the bond their elders destroyed.\n\nThe flood turns the motif. The old men of "both villages" work "side by side to save the last span." Saving the bridge means saving the possibility of contact, and they do it together without planning to. Shared danger accomplishes what fifty years of pride could not.\n\nThe scene on the bridge is quiet: they stood on it, "not speaking." The story is honest that peace does not arrive all at once. Yet standing on the same span is itself a kind of speech.\n\nThe final image completes the pattern. The children throw "flowers instead of stones" at the same bridge. The ritual remains, but its meaning has changed, and the next generation inherits hope instead of hatred.',
  },
  {
    task: "Write a short analysis of the motif of the window in this story. Every afternoon, Mrs. Ito sat at her window and watched the schoolchildren pass. She knew their names from their shouts. When the school closed for the summer, she kept her chair at the window, facing an empty street. In September, a girl stopped, looked up and waved. Mrs. Ito waved back. The next day she went down to the gate.",
    model:
      'The window in this story is a motif of Mrs. Ito\'s loneliness, a barrier that lets her see life without joining it, and the story ends when she finally crosses it.\n\nAt first the window is her whole connection to the world. She sits there "every afternoon" and knows the children\'s names "from their shouts." The detail is touching but sad: she knows them only from a distance, through glass, and they do not know her.\n\nThe summer deepens the motif. She keeps her chair "at the window, facing an empty street." The window still frames her life, but now it frames nothing. The image shows that her habit has become a kind of waiting, and the empty street reflects her isolation.\n\nThe turning point is a small gesture. A girl "stopped, looked up and waved." For the first time, someone looks through the window from the other side. When Mrs. Ito waves back, the glass has become a place of contact instead of separation.\n\nThe last sentence moves her beyond the motif entirely: "she went down to the gate." She leaves the window behind. The story suggests that loneliness can be broken by the smallest act of recognition, if a person is willing to answer it.',
  },
  {
    task: "Write a short analysis of the motif of hands in this story. The baker's hands were famous in the town: broad, floured, always moving. He shaped a thousand loaves a week and never measured anything. When arthritis twisted his fingers, he stood in the shop and watched his son's clumsy hands fail with the dough. One morning he put his own hands over his son's and pressed down, and they shaped the loaf together.",
    model:
      'Hands are the central motif of this story, and their changes show that a skill survives not by staying in one person but by being passed on.\n\nThe baker\'s hands are first described as "broad, floured, always moving." They are almost a portrait of the man: generous, busy and full of his craft. He "never measured anything," which suggests that his knowledge lives in his hands rather than in recipes or words.\n\nThe motif darkens when arthritis "twisted his fingers." The same hands that defined him now betray him. The story places him beside his son\'s "clumsy hands," so we see two pairs of hands that fail in different ways: the father\'s through age, the son\'s through inexperience.\n\nThe turning point is a single touch. He puts "his own hands over his son\'s and pressed down." The gesture teaches what words could not, because his skill has always been in the hands. Weak as they now are, his fingers can still guide.\n\nThe final phrase, "they shaped the loaf together," gathers the motif into its meaning. Neither pair of hands could do it alone. The story suggests that a craft, like a family, continues when the old and the young work as one.',
  },
  {
    task: "Write a short analysis of the motif of the coat in this story. Leo's brother left for the war in his old brown coat and left Leo his new one. Leo refused to wear it all winter. In spring the letters stopped. In autumn a package came with the brown coat inside, torn at the shoulder. That night Leo put on the new coat for the first time, and then, over it, the old one.",
    model:
      'The coats in this story are a motif of the bond between the two brothers, and the final image shows Leo choosing to carry both his brother\'s memory and his own future.\n\nThe exchange at the start is an act of love. Leo\'s brother takes "his old brown coat" to war and leaves Leo "his new one." The new coat represents the life the brother is giving up, a future he hands to his younger brother.\n\nLeo "refused to wear it all winter." His refusal suggests that wearing it would mean accepting his brother\'s absence, or even his loss. As long as the coat stays unworn, Leo can pretend the exchange is only temporary.\n\nThe motif turns with the package. The brown coat comes home "torn at the shoulder," without its owner. The torn cloth tells what the stopped letters only hinted: the brother is wounded or dead. The coat has returned in his place.\n\nThe ending joins the two coats. Leo puts on the new one "for the first time, and then, over it, the old one." He finally accepts the gift, but he does not let go of his brother. The layered coats suggest that grief and growth can be worn together, and that the dead remain part of the living.',
  },
  {
    task: "Write a short analysis of the motif of the song in this story. Grandmother sang the same lullaby to every baby in the family, in a language no one else could speak. When she died, the family tried to remember it and could not agree on the words. Years later, Mia heard her own daughter humming in her sleep, and the tune was the lullaby, though no one had ever sung it to her.",
    model:
      'The lullaby is a motif of the family\'s heritage, and the story uses it to suggest that what a family inherits runs deeper than what it can consciously remember.\n\nAt first the song belongs entirely to the grandmother. She sings it "to every baby in the family," so it marks the start of each life, but it is "in a language no one else could speak." The heritage is shared and yet locked inside one person, which makes it fragile.\n\nHer death exposes that fragility. The family "tried to remember it and could not agree on the words." The song begins to break apart, and the disagreement shows how quickly a culture can fade when its last speaker is gone. The words, the part that must be learned, are the first to be lost.\n\nThe ending reverses the loss in a surprising way. Mia hears her daughter "humming in her sleep," and the tune is the lullaby, "though no one had ever sung it to her." The child never heard the song, yet it returns through her.\n\nThe story does not explain this, and it does not need to. The motif suggests that the words may die but the music survives, carried beneath memory, and that a family\'s past lives on in its children in ways no one can fully trace.',
  },
  {
    task: 'Write a short analysis of the motif of the key in this story. When Nora married, her mother gave her the key to the family house "for when you need it." Nora hung it on a nail and forgot it. During the hard years of her marriage, she held the key in her pocket on bad nights. When her mother died, Nora drove to the house, unlocked the door and found every room exactly as it had been. She left the key in the lock and drove home.',
    model:
      'The key is a motif of escape and refuge, and its changes trace Nora\'s movement from depending on her childhood home to choosing her own life.\n\nHer mother\'s gift comes with a quiet promise: the key is "for when you need it." It stands for a safe place to return to, and the phrase admits, gently, that the marriage might fail. At first Nora "hung it on a nail and forgot it," a sign of her confidence in her new life.\n\nThe motif deepens during "the hard years." On bad nights she holds the key "in her pocket." She never uses it, but holding it is comforting; the key has become a possibility of escape that lets her endure. It shows how much the idea of a refuge can matter even when the refuge is never entered.\n\nAfter her mother\'s death, Nora finally unlocks the door and finds every room "exactly as it had been." The house has stopped in the past. It can no longer be a living refuge, because the person who offered it is gone.\n\nHer final act completes the motif: she leaves "the key in the lock" and drives "home." The word home now means her own house. By giving up the key, Nora chooses the life she has built rather than the one she could flee to.',
  },
  {
    task: "Write a short analysis of the motif of the river in this story. As a boy, Sam was forbidden to swim in the river that had drowned his uncle. He watched the other boys dive from the rocks. At sixteen he swam across alone at dawn and told no one. At forty, he stood on the same rocks and taught his son to swim, holding him in the current until the boy laughed.",
    model:
      'The river is a motif of fear inherited from the past, and its three appearances show Sam moving from fear to defiance to a kind of peace.\n\nAt first the river is forbidden. It "had drowned his uncle," so it carries the family\'s grief and fear. Sam can only watch "the other boys dive from the rocks." The river divides him from ordinary boyhood, and the rule protecting him also confines him.\n\nAt sixteen he crosses it "alone at dawn and told no one." This is defiance, but private defiance. He conquers the river for himself, yet he keeps it secret, as if the fear still belongs to the family even after he has overcome it. The secrecy suggests that he has not yet made peace with the past.\n\nThe final scene changes the river\'s meaning completely. At forty, Sam stands "on the same rocks" and teaches his son to swim, "holding him in the current until the boy laughed." The place of death becomes a place of play and trust. The rocks he once watched from are now where he leads.\n\nThe repetition of the rocks ties the three scenes together. The story suggests that a fear handed down need not be handed on; it can be turned into care for the next generation.',
  },
  {
    task: "Write a short analysis of the motif of the empty chair in this story. After Grandfather died, no one sat in his chair at the head of the table. At Thanksgiving, the family set a plate there out of habit and then removed it in silence. The next year, the youngest grandson climbed into the chair before anyone could stop him and asked for the turkey. Everyone laughed for the first time in a year.",
    model:
      'The empty chair is a motif of the family\'s grief, and the story shows how a loss that silences a family can be broken by the innocence of a child.\n\nThe chair "at the head of the table" stands for the grandfather\'s place in the family, and the fact that "no one sat in his chair" shows how deeply they feel his absence. Leaving it empty is a form of respect, but it also means the family has arranged itself around a gap.\n\nAt Thanksgiving the motif becomes painful. The family sets "a plate there out of habit and then removed it in silence." The habit shows that their lives still expect him; the silence shows that they cannot speak of the loss. The empty place turns every meal into a reminder.\n\nThe turning point comes from the person with the least sense of the rule. The youngest grandson "climbed into the chair before anyone could stop him." He does not know the chair is sacred, and so he simply uses it. When he asks "for the turkey," he takes on, without knowing, the grandfather\'s role at the head of the table.\n\nThe ending, "everyone laughed for the first time in a year," shows grief beginning to lift. The chair is filled again, not by a replacement but by the next generation, and the family can finally move on.',
  },
  {
    task: "Write a short analysis of the motif of the garden in this story. Elena planted a garden every spring in the yard of the apartment she hated. Each autumn the landlord paved a little more of it for parking. She planted in pots, then in tin cans on the fire escape. The year she moved out, she left one geranium in a can on the step. Her neighbor, who had never spoken to her, watered it.",
    model:
      'The garden is a motif of Elena\'s stubborn hope, and the story follows it as the space for that hope shrinks until it passes to someone else.\n\nElena plants "every spring in the yard of the apartment she hated." The detail matters: she does not garden because she is happy there but in spite of being unhappy. The garden is her way of making a hostile place bearable.\n\nThe motif develops through loss. Each autumn the landlord "paved a little more of it." Planting is answered by concrete, and her garden moves from the yard to "pots, then in tin cans on the fire escape." The containers get smaller and humbler, but she keeps planting. The shrinking garden shows how much pressure her hope survives.\n\nWhen she moves out, she leaves "one geranium in a can on the step." It is the smallest garden yet, and also a gift. She leaves behind something living in the place she hated.\n\nThe final sentence completes the motif in an unexpected way: her neighbor, "who had never spoken to her, watered it." The garden reaches beyond Elena. Her hope, reduced to a single plant, connects two strangers who never knew each other, and it survives her leaving.',
  },
  {
    task: "Write a short analysis of the motif of the mirror in this story. Clara avoided mirrors after the accident left a scar across her cheek. She turned the bathroom mirror to the wall. At her sister's wedding, a photographer asked her to stand in front of the hall's great mirror for a group picture. She stood there, shaking, and saw her sister's arm around her and her own face, scarred and smiling. The next morning she turned the bathroom mirror back.",
    model:
      'The mirror is a motif of Clara\'s self-image, and its changes show her moving from shame toward acceptance through the love of others.\n\nAfter the accident, Clara "avoided mirrors" and "turned the bathroom mirror to the wall." The mirror stands for the face she cannot bear to see. Turning it around is a way of refusing to see herself, and it suggests that she believes the scar is all she is.\n\nThe wedding forces her to face the motif in its largest form, "the hall\'s great mirror." The setting is important: she stands there not alone but in "a group picture." For the first time she sees herself among other people.\n\nWhat she sees changes everything: "her sister\'s arm around her and her own face, scarred and smiling." The mirror shows not only the scar but the love that surrounds her and her own happiness. The scar has not disappeared, but it is no longer the only thing in the picture.\n\nThe final action closes the pattern. The next morning she "turned the bathroom mirror back." The private mirror she had turned away now faces her again. The story suggests that people can accept themselves once they see themselves as others do.',
  },
  {
    task: 'Write a short analysis of the motif of the train in this story. Every evening the night train passed the farm, and every evening Ruth stopped work to watch it. Her father called it "the city\'s train" and spat. When Ruth turned eighteen, she bought a ticket and kept it in her Bible for a year. When her father fell ill, she tore it up. Twenty years later, she still stops work when the train passes, and now her daughter watches it with her.',
    model:
      'The train is a motif of the life Ruth did not choose, and the story uses it to show a longing that never quite ends even after it is given up.\n\nAt first the train is a nightly ritual. "Every evening" Ruth stops work to watch it, which suggests that it pulls her attention away from the farm toward somewhere else. Her father\'s name for it, "the city\'s train," and his spitting show that it stands for a world he rejects.\n\nThe ticket turns longing into a plan. She buys it at eighteen and keeps it "in her Bible for a year." The hiding place shows how sacred and secret the dream is. Yet a year passes, which hints at her hesitation.\n\nWhen her father falls ill, she "tore it up." Duty wins over desire. The torn ticket is the end of the plan, but not the end of the motif.\n\nTwenty years later she "still stops work when the train passes." The longing has survived the sacrifice. The last detail, that her daughter "watches it with her," is open and haunting. It may mean the dream will be passed down, and that the daughter may one day take the train her mother never did.',
  },
];

/** meditateBank gives a natural scene or object from which a meditative essay begins. */
const meditateBank: readonly WritingItem[] = [
  {
    task: "Write a meditative essay that begins with a close look at an old tree near your home or school and moves toward a larger idea.",
    model:
      "There is an oak at the corner of our street that is older than every house around it. Its bark is split into deep grey plates, and one low branch has been worn smooth by generations of children climbing it. Someone once nailed a sign to the trunk, and the tree has grown around the nail until only the rusty head shows.\n\nI have walked past this tree for twelve years, and only recently have I stopped to look at it. What strikes me most is how slowly it does everything. It has been growing the whole time I have been alive, yet I have never once seen it move except in the wind.\n\nPatience, I think, is a kind of strength we rarely notice because it makes no noise. The oak did not fight the nail; it absorbed it. It did not resist the climbing children; it let their hands polish its branch. Over decades it has turned injuries into part of its shape.\n\nI am not patient. I want answers by the weekend and results by the end of the month. But standing under that oak, I wonder whether the most lasting growth in a person also happens too slowly to see, and whether the things that hurt us might, given time, become part of who we are rather than marks against us.",
  },
  {
    task: "Write a meditative essay that begins with a close look at a body of water you know, such as a river, a lake or the sea, and moves toward a larger idea.",
    model:
      "The river below the old mill is never the same color twice. In the morning it is the grey of wet slate; in the afternoon, when the sun clears the hill, it turns green at the edges and brown in the middle. After a storm it runs the color of milky tea and carries whole branches past the stones.\n\nI like to sit on the low wall above the weir and watch one leaf at a time. Each leaf takes its own path. Some spin at the edge for minutes, caught in a small whirlpool, while others are pulled straight over the drop and gone. None of them chooses, and yet each journey is different.\n\nWatching the river, I think about how much of a life is current rather than choice. I did not choose my town, my family or the language I first spoke. Like those leaves, I was set down in a stream already moving.\n\nYet the river also teaches the opposite lesson. The water itself is never trapped; it bends around every stone and finds a way through. Perhaps freedom is not standing outside the current but learning how to move within it, the way water does, giving way where it must and pressing forward wherever there is room.",
  },
  {
    task: "Write a meditative essay that begins with a close look at the night sky and moves toward a larger idea.",
    model:
      "On the night the power went out across our town, I lay on the roof of the garage and saw more stars than I had seen in my whole life. Without the streetlights, the sky was not black but crowded, with faint clouds of light between the bright points. Directly above me, the band of the Milky Way ran from one horizon to the other like spilled flour.\n\nI had known, of course, that the stars were always there. I had learned their distances in school and seen photographs. But knowing is not the same as seeing. For one night the sky stopped being a fact and became a presence, enormous and quiet, indifferent to the town below it.\n\nIt is strange to feel small and comforted at the same time. Under that sky, my worries about exams and friendships seemed briefly the size they really were. Not unimportant, but not everything either.\n\nI think we hide much of the world from ourselves with our own light. The glow that lets us see the street also hides the stars. When the power came back on an hour later, the sky went pale again, and I went inside. But I have tried since then to remember that the brightest things around me are not always the largest, and that some truths can only be seen in the dark.",
  },
  {
    task: "Write a meditative essay that begins with a close look at a stone, a shell or another small natural object you have kept, and moves toward a larger idea.",
    model:
      "On my desk is a smooth grey stone about the size of an egg. I picked it up on a beach in the north when I was nine. One side has a white line running around it like a belt, and the surface is so even that it feels almost warm in the hand, as if it were made rather than found.\n\nThat smoothness took thousands of years. The stone began as a sharp piece of rock broken from a cliff. Every wave rolled it against other stones, and every grain of sand wore down a little of its edge, until there was no edge left. It was shaped entirely by being knocked about.\n\nI often hold it while I study. It reminds me that much of what is beautiful in the world is the result of friction. The stone did not become smooth by being protected; it became smooth because it was never left alone.\n\nI would like to believe the same is true of people, though I know it is not always so. Some hardship only breaks. But some of the gentlest people I know are the ones who have been through the most, as if their sharp corners were worn away by years of rough water. When I feel battered by a difficult week, I look at the stone and try to imagine what shape the waves are giving me.",
  },
  {
    task: "Write a meditative essay that begins with a close look at snow, rain or another kind of weather, and moves toward a larger idea.",
    model:
      "The first snow of the year fell overnight, and by morning it covered everything: the cars, the bins, the broken fence behind the school. Nothing was hidden for long, though. By noon the paths were trampled grey, and the clean white of the early morning survived only on the roofs and in the corners no one walked.\n\nI stood at the window before anyone else was awake and looked at the yard. The snow had made it unfamiliar. The pile of old bricks looked like a soft hill; the rusty swing set looked almost elegant. For an hour, the snow made an ordinary place beautiful simply by covering its flaws.\n\nThere is something tempting about that kind of beauty, and something false. The bricks were still there under the white. When the snow melted, they would return, a little wetter and no more lovely.\n\nI think about the ways we cover things in our own lives: the smile over a bad mood, the polite answer over the honest one. Sometimes that covering is kind, like the snow, a brief rest from what is ugly. But it cannot last, and it should not have to. The most honest beauty, perhaps, is not a covering at all but the way we learn to see the bricks themselves and find something in them worth looking at.",
  },
  {
    task: "Write a meditative essay that begins with a close look at a bird, an insect or another animal you have watched, and moves toward a larger idea.",
    model:
      'Every spring, a pair of swallows builds a nest under the roof of our shed. They make it from mud, one beakful at a time, flying back and forth from the puddle by the gate perhaps a thousand times. The finished nest is a little cup the color of dried earth, pressed so tightly against the wood that it looks as if it grew there.\n\nThis year I timed them. In one afternoon a single bird made forty trips. Each load of mud was no bigger than a pea. Watching them, I could not imagine how anything so small could become a home, and yet in a week it was done.\n\nWhat strikes me is that the swallows never seem to doubt. They do not stop to consider whether the task is too large; they simply carry the next beakful. The size of the work is defeated by the size of each step.\n\nI am the opposite. When I face a long essay or a difficult year, I look at the whole of it and freeze. The swallows suggest a different way to think about effort, where the question is never "Can I build a nest?" but only "Can I carry this one piece of mud?" Most of what lasts in a life may be built exactly that way, one small trip at a time.',
  },
  {
    task: "Write a meditative essay that begins with a close look at a field, a garden or a park through one season, and moves toward a larger idea.",
    model:
      "The field behind our school is mown flat every summer, and every summer it fights back. By August, dandelions have pushed through the short grass, clover has spread in round green patches, and along the fence a line of thistles stands taller than the younger children.\n\nI walk across it every day, and this year I have been noticing what grows where. The thistles survive by the fence because the mower cannot reach them. The clover survives in the middle because it lies too low to cut. Each plant has found its own way to endure the same blade.\n\nI find this oddly encouraging. Schools, like fields, are designed to make everyone the same height. There are timetables and uniforms and tests that reward one kind of mind. Many of us are mown down a little every year.\n\nYet the field reminds me that sameness is never complete. Life keeps finding the places that rules cannot reach, the low ground and the corners by the fence. Perhaps the point is not to grow tall where the blade will cut but to discover, as the clover has, the shape in which one can flourish anyway. Every September the field is mown again, and every summer it returns, a little wilder than the last.",
  },
  {
    task: "Write a meditative essay that begins with a close look at a mountain, a hill or a cliff you have seen, and moves toward a larger idea.",
    model:
      "From my grandmother's village you can see a mountain with a bare grey summit and a long scar of loose stone down one side. She says the scar was made by a landslide when she was a girl. It is still there seventy years later, as clear as a road.\n\nI climbed it last summer with my cousin. From the village the mountain looks smooth and simple, but on its slopes it is a maze of gullies, boulders and small hidden meadows. The scar, close up, is not a single line but thousands of broken rocks, some as large as cars.\n\nI keep thinking about how different the mountain looked from near and far. From the village, one glance tells you its whole shape. On the slope, you see only the next few steps and never the whole.\n\nPeople are like that too, I think, and so are the events of our lives. From a distance we judge them in a glance: that family, that town, that terrible year. Close up, they are endlessly detailed and hard to sum up. Both views are true, but the far view is the easier one, and so it is the one we use most. The mountain has taught me to be wary of any judgment that is made from too far away to see the stones.",
  },
  {
    task: "Write a meditative essay that begins with a close look at a sunrise or a sunset you have watched, and moves toward a larger idea.",
    model:
      "On the last morning of the camping trip, I woke before everyone else and walked to the edge of the lake to watch the sun come up. First the sky over the far hills turned the grey of old paper. Then a thin line of orange appeared, and the water copied it exactly, so that for a moment there seemed to be two sunrises, one above and one below.\n\nIt happened slowly, then all at once. For twenty minutes the light gathered, and then the sun cleared the hills in less than a minute and the whole lake was suddenly bright.\n\nI had seen sunrises before, but always on the way to something: the bus, the airport, school. This was the first time I watched one for its own sake, with nothing to do afterward but wake the others.\n\nI think much of what matters in life happens like that sunrise. Change gathers quietly for a long time, invisible to anyone in a hurry, and then arrives all at once. A friendship, a skill, a decision often seems sudden only because we were not watching while it formed. That morning taught me that paying attention is not a way of making things happen faster but a way of being present for them while they are happening at all.",
  },
  {
    task: "Write a meditative essay that begins with a close look at a forest or a wood you have walked through, and moves toward a larger idea.",
    model:
      "In the wood near my uncle's farm there is a fallen beech that has lain on the ground for as long as anyone can remember. Its trunk is covered in moss so thick that it feels like carpet, and small ferns grow from cracks along its length. In one place a young rowan has rooted in the rotting wood and grows straight up out of the dead tree.\n\nThe first time I saw it, I thought it was sad: a great tree brought down and left to decay. But the longer I looked, the more alive it seemed. Beetles worked under the bark. Fungi spread in pale fans along its side. The fallen beech was not empty; it was full.\n\nForesters call such a trunk a nurse log, because it feeds the life that grows from it. Its death became a kind of nursery.\n\nI have started to think about endings differently because of that tree. We usually treat an ending as a loss, the end of a school, a friendship or a way of life. Sometimes it is. But some endings, given time, become the ground in which new things root. The rowan could not have grown there if the beech had stayed standing. Perhaps what we lose is not always simply gone, but quietly turned into soil.",
  },
  {
    task: "Write a meditative essay that begins with a close look at the wind and what it does to a place, and moves toward a larger idea.",
    model:
      "Our town sits on a ridge, and the wind never stops. You can see it in the trees along the main road, which all lean the same way, toward the east, as if they were listening for something. Even the young ones planted last year have begun to bend.\n\nI used to think the wind was the enemy of those trees. It strips their leaves early and snaps their weaker branches every winter. But a gardener once told me that trees grown in the wind are stronger than trees grown in shelter. The constant pushing makes their wood dense and their roots deep. Trees raised in a greenhouse often fall in their first storm.\n\nWhen I look at those leaning trees now, I see two things at once. I see the force that has bent them, and I see that they are still standing.\n\nIt is easy to admire people who grew up in calm places and stand straight. It is harder to see the strength in those who lean, the ones whose lives have pushed them in one direction for years. Their shape shows what they have suffered. Their roots, which no one sees, may be the deepest of all. I would rather be a tree on the ridge, I think, than one that has never felt the wind.",
  },
  {
    task: "Write a meditative essay that begins with a close look at an abandoned building or a ruin in nature, and moves toward a larger idea.",
    model:
      "At the end of the old quarry road stands a stone farmhouse with no roof. Birch trees grow inside it, their white trunks rising out of the rooms where people once slept. Ivy has covered one wall completely, and the doorway frames nothing but a square of sky.\n\nI went there with friends to explore, expecting something eerie. What I found was quiet. The fireplace was still blackened with old smoke. A rusted hook hung from a beam. Someone had once hung a pot on that hook and cooked dinner for a family whose names no one remembers.\n\nIt is humbling to stand in such a place. Whoever built that house believed it would last, and in a way it has, for perhaps two hundred years. But it has not lasted as a home. It has become part of the hillside again, slowly taken back by the trees.\n\nI think about the things I expect to last: my school, my street, the arguments that feel so important now. All of them will one day be like that farmhouse, remembered by no one. This is not a reason for despair. If anything, it makes the present more precious. The family by that fireplace did not live less fully because their house would fall. They lived, and that was enough.",
  },
];

/** critiqueBank gives a short original argument for the student to critique. */
const critiqueBank: readonly WritingItem[] = [
  {
    task: 'Write a short critique of this argument. "Our school should ban phones completely. Students who use phones in class have lower grades, as everyone knows. Phones also cause bullying. Some people say phones are useful for research, but students can use library computers. If we ban phones, grades will rise and bullying will end."',
    model:
      'The writer argues that the school should ban phones completely because phones lower grades and cause bullying. The concern is reasonable, but the argument relies on unsupported claims and an unstated assumption that weakens its conclusion.\n\nFirst, the evidence is thin. The claim that students who use phones have lower grades is supported only by "as everyone knows," which is an appeal to common belief, not evidence. A study or school data would make the point far stronger.\n\nSecond, the argument assumes that phones cause the lower grades. It is possible that students who are already struggling turn to their phones out of boredom. If the link is not causal, a ban might not raise grades at all.\n\nThird, the claim that phones "cause bullying" ignores the fact that bullying existed long before phones. Phones may change how bullying happens, but a ban is unlikely to "end" it, as the conclusion promises. This is an overstatement.\n\nTo its credit, the writer addresses a counterclaim about research. However, the answer that students can use library computers is brief and does not consider whether there are enough computers for everyone.\n\nOverall, the argument identifies a real problem but overstates its solution. With real evidence and a more limited claim, such as restricting phones during lessons, it would be more convincing.',
  },
  {
    task: "Write a short critique of this argument. \"The city should build a new sports stadium. Our team is the best in the region, and a stadium would bring thousands of visitors and millions of dollars. Every great city has a stadium. Those who oppose it simply don't care about our city's future.\"",
    model:
      'The writer claims that the city should build a new stadium because it would bring visitors and money and because every great city has one. The argument has some appeal, but it depends on unsupported claims, a questionable assumption and an unfair treatment of opponents.\n\nThe central economic claim, that a stadium would bring "thousands of visitors and millions of dollars," is offered without evidence. Many studies of new stadiums have found that they cost cities more than they earn. Without figures or examples from similar cities, this reason is only a hope.\n\nThe argument also assumes that what great cities have, our city should have. This is a questionable assumption. Great cities may have stadiums because they are already large and wealthy; building a stadium does not by itself create those conditions.\n\nThe claim that the team is "the best in the region" may be true, but it is not clearly relevant. A winning team does not prove that a new building is a good use of public money.\n\nMost seriously, the writer dismisses opponents as people who "simply don\'t care about our city\'s future." This is a personal attack. Opponents may care a great deal; they may simply believe the money should go to schools or roads.\n\nThe argument would be stronger if it offered real economic evidence and answered the opposing view fairly.',
  },
  {
    task: 'Write a short critique of this argument. "Teenagers should not be allowed to vote. Most teenagers don\'t read the news, and their brains are not fully developed until age twenty-five. Besides, my sixteen-year-old cousin thinks the moon landing was fake. Giving teenagers the vote would be a disaster for democracy."',
    model:
      'The writer argues that teenagers should not vote because they do not follow the news, their brains are still developing and some hold false beliefs. These are serious points, but the argument uses weak evidence and makes assumptions that would apply to many adults as well.\n\nThe claim that "most teenagers don\'t read the news" is not supported. Even if it were true, many adults also do not read the news, and they are allowed to vote. The argument assumes that following the news is a requirement for voting, but no such requirement exists for anyone else.\n\nThe point about brain development is more interesting, because it refers to scientific research. However, the writer does not explain how incomplete development affects the ability to choose a candidate. If the brain is not fully developed until twenty-five, the argument would also exclude voters aged eighteen to twenty-four, which the writer does not propose.\n\nThe example of the writer\'s cousin is a hasty generalization. One teenager\'s belief tells us nothing about teenagers as a group, and some adults believe the same thing.\n\nFinally, the prediction that teen voting would be "a disaster" is an exaggeration offered without support.\n\nThe argument raises a fair question about maturity, but to be convincing it needs real evidence and a standard that it applies consistently.',
  },
  {
    task: 'Write a short critique of this argument. "Homework should be abolished. In Finland, students get very little homework and have some of the best test scores in the world. Homework causes stress, and stressed students cannot learn. Teachers who give homework are just trying to look busy."',
    model:
      'The writer argues that homework should be abolished, pointing to Finland\'s results and to the stress homework causes. The topic is important, but the argument relies on a doubtful comparison, a sweeping claim and an unfair attack.\n\nThe example of Finland is the argument\'s strongest evidence, but it assumes that low homework is the reason for Finland\'s high scores. Finland differs from other countries in many ways, including teacher training, class sizes and social support. Without evidence that homework is the key difference, the comparison does not prove that abolishing homework would raise scores here.\n\nThe claim that "homework causes stress, and stressed students cannot learn" contains some truth, but it is too absolute. Some homework may cause stress, while a moderate amount may help students practice. The argument leaps from "some homework is stressful" to "all homework should be abolished," ignoring the option of reducing it.\n\nThe final sentence is a personal attack on teachers. It claims to know their motives without evidence, and it ignores the real reasons many teachers give homework, such as practice and preparation. This weakens the writer\'s credibility.\n\nThe argument would be more persuasive if it supported its comparison, admitted that homework can have benefits and argued for a limit rather than a complete ban.',
  },
  {
    task: 'Write a short critique of this argument. "We should stop funding space exploration. There are people starving on Earth, and every dollar spent on rockets is a dollar taken from the hungry. Space has given us nothing useful. Either we feed people or we fly to Mars."',
    model:
      'The writer argues that space exploration should not be funded because the money is needed to fight hunger. The moral concern behind the argument is serious, but it rests on a false choice, an unsupported claim and an assumption about how budgets work.\n\nThe final sentence presents a false dilemma: "Either we feed people or we fly to Mars." Governments fund many things at once, and space budgets are a small share of most national budgets. It is possible to fund both, or to cut other spending instead.\n\nThe argument also assumes that every dollar not spent on rockets would go to the hungry. There is no evidence for this. Money saved from one program is often spent on something else entirely.\n\nThe claim that "space has given us nothing useful" is not supported and is contradicted by common knowledge. Weather satellites, GPS and many medical and material technologies grew out of space research. Some of these, such as satellite tracking of droughts, even help in fighting hunger.\n\nTo its credit, the argument raises a real question about priorities, and its concern for the hungry is sincere.\n\nTo be convincing, however, it would need to show that cutting space funding would actually reduce hunger, and it would need to drop the false choice in favor of a fair comparison of costs and benefits.',
  },
  {
    task: 'Write a short critique of this argument. "The town should cut down the old trees on Main Street. Their roots crack the sidewalk, and last year an old woman tripped and broke her wrist. Trees are messy and drop leaves everywhere. New concrete would be cleaner and safer."',
    model:
      'The writer argues that the old trees on Main Street should be cut down because their roots crack the sidewalk and cause accidents. The safety concern is legitimate, but the argument overlooks alternatives and treats one side of the issue as the whole.\n\nThe strongest evidence is the accident in which a woman broke her wrist. It is a real harm, and it deserves attention. However, a single accident does not show how often such injuries happen. Data on the number of falls would give a clearer picture of the danger.\n\nMore importantly, the argument assumes that cutting the trees is the only solution. Sidewalks can be repaired, raised or rerouted around roots, and some cities use flexible paving for exactly this problem. By ignoring these options, the writer creates a false choice between trees and safety.\n\nThe complaint that trees are "messy" is weak. Falling leaves are a small cost compared with the shade, beauty and cooler temperatures trees provide, none of which the writer mentions.\n\nFinally, the claim that concrete would be "cleaner and safer" is not supported. Concrete can also crack and become slippery.\n\nThe argument raises a real problem, but a fair treatment would weigh the trees\' benefits and consider repairs before calling for their removal.',
  },
  {
    task: 'Write a short critique of this argument. "Video games make young people violent. Many of the teenagers arrested for violent crimes last year played violent video games. Games reward players for killing. Parents who let their children play these games are responsible for the violence that follows."',
    model:
      'The writer argues that video games cause violence in young people and that parents who allow them are to blame. The argument raises a common worry, but its central reasoning confuses correlation with cause.\n\nThe main evidence is that many teenagers arrested for violent crimes played violent games. However, a very large share of all teenagers play such games, including millions who never commit a crime. Without comparing the arrested teenagers with teenagers in general, the statistic shows only that games are common, not that they cause violence.\n\nThe argument assumes that playing a game leads to imitating it. This assumption is questionable. Many studies have found little or no link between games and real violence, and other factors, such as poverty, abuse and access to weapons, are better predictors of violent crime.\n\nThe point that games "reward players for killing" is accurate for some games, but the writer does not explain why rewards in a game would change behavior outside it.\n\nThe final sentence moves the blame to parents without evidence that their choices caused any crime. It is a sweeping judgment that ignores the many parents whose children play games and remain peaceful.\n\nThe argument would be stronger if it used real research and made a more limited claim about the effects of games.',
  },
  {
    task: 'Write a short critique of this argument. "All students should be required to learn a second language. People who speak two languages earn more money. Employers want bilingual workers. In today\'s world, a person who speaks only one language will be left behind."',
    model:
      'The writer argues that every student should be required to learn a second language because bilingual people earn more and employers want them. The goal is a good one, but the argument relies on claims it does not support and on an assumption about cause.\n\nThe claim that bilingual people "earn more money" is plausible, but it is given without evidence. More importantly, it assumes that the second language is the cause of the higher income. Bilingual people may also be more likely to have had more education or to live in larger cities, which would also raise their earnings.\n\nThe statement that "employers want bilingual workers" is too broad. Some employers do, especially in trade and tourism, but many jobs do not require a second language. The argument would be more convincing if it named the fields where languages matter and showed how many students will work in them.\n\nThe final claim, that a person who speaks one language "will be left behind," is an exaggeration. Many successful people speak only one language.\n\nThe argument also ignores the counterclaim that requiring a language may take time from other subjects or frustrate students who struggle with languages.\n\nWith real evidence, a fair answer to opponents and a less absolute conclusion, this could be a persuasive case.',
  },
  {
    task: 'Write a short critique of this argument. "The new reading program is a great success. Since it began in September, the average reading score at our school has risen from 71 to 74. The principal says the teachers love it. Clearly, every school in the district should adopt it immediately."',
    model:
      'The writer argues that the new reading program is a success and should be adopted across the district. The argument has the merit of using actual data, but its evidence is too limited to support such a broad conclusion.\n\nThe rise in the average score, from 71 to 74, is the strongest point. Yet a three-point rise in one school over a few months is small, and the writer does not tell us whether it is a meaningful change or normal variation from year to year. Scores often rise during a school year as students mature.\n\nThe argument assumes that the program caused the rise. Other changes, such as new teachers, smaller classes or a different test, could explain it. Without comparing the school with a similar school that did not use the program, the cause remains uncertain.\n\nThe principal\'s statement that teachers "love it" is secondhand and shows only that teachers like the program, not that it works. Enthusiasm is not the same as evidence.\n\nFinally, the conclusion that "every school in the district" should adopt it "immediately" goes far beyond the evidence from one school. Other schools may have different students and needs.\n\nA more careful writer would call the early results promising and recommend a wider trial before adopting the program everywhere.',
  },
  {
    task: 'Write a short critique of this argument. "Zoos should be closed. Animals in zoos are prisoners. A lion was born to roam the savanna, not to pace a concrete pit. Zoos claim to protect endangered species, but that is just an excuse to make money from ticket sales."',
    model:
      'The writer argues that zoos should be closed because animals in them are prisoners. The argument speaks to a real moral concern, but it relies on emotional language, an outdated picture of zoos and an unfair dismissal of the opposing view.\n\nThe description of a lion pacing "a concrete pit" is vivid, but it may not represent modern zoos, many of which now use large, planted enclosures. The writer offers no evidence about how most zoos actually keep their animals, so the image works on feelings rather than facts.\n\nCalling animals "prisoners" assumes that captivity is always a harm to them. This is open to debate. Some animals in good zoos live longer and healthier lives than in the wild, while others, especially wide-ranging species, may suffer. A stronger argument would make this distinction.\n\nThe writer does mention the counterclaim that zoos protect endangered species, which is a good step. However, the answer, that this is "just an excuse to make money," is an attack on motives without evidence. Breeding programs have saved species such as the California condor, and the writer does not address this.\n\nThe argument would be fairer and more convincing if it focused on the animals that suffer most in captivity and answered the conservation argument with evidence.',
  },
  {
    task: 'Write a short critique of this argument. "School should start at 9 a.m. instead of 7:30. Scientists say teenagers need more sleep. When I sleep late on weekends, I feel much better. Schools that start later have happier students. Anyone who disagrees has forgotten what it is like to be a teenager."',
    model:
      'The writer argues that school should start later because teenagers need more sleep. The conclusion may well be right, but the argument mixes strong and weak support and dismisses those who disagree.\n\nThe reference to scientists is the argument\'s best point, since research on teenage sleep is extensive. However, the writer gives no study, figure or source, which makes the claim easy to doubt. Naming one study would strengthen it considerably.\n\nThe writer\'s own experience of feeling better after sleeping late is a personal anecdote. It is understandable, but it is not evidence for a whole school, and it might simply reflect the relief of a weekend.\n\nThe claim that later-starting schools have "happier students" is offered without support, and it assumes that the start time is the reason for the happiness. Those schools may differ in other ways.\n\nThe argument also ignores real counterarguments, such as later sports practices, bus schedules and parents\' working hours. Instead, it ends by saying opponents have "forgotten what it is like to be a teenager." This dismisses them rather than answering them.\n\nThe case for a later start is a reasonable one, but it would be far more convincing with cited research, a fair summary of the objections and a response to each.',
  },
  {
    task: 'Write a short critique of this argument. "Cash should be abolished. Criminals use cash because it cannot be traced. Digital payments are faster and safer. Sweden is already almost cashless, and it is one of the richest countries in the world. Only people with something to hide still use cash."',
    model:
      'The writer argues that cash should be abolished because criminals use it and digital payments are better. The argument has a clear structure, but it rests on a questionable comparison and ignores the people who depend on cash.\n\nThe point that cash is hard to trace and so useful to criminals is true, but it is only part of the picture. Criminals also use digital methods, and abolishing cash would not end crime. The argument assumes that removing one tool would remove the behavior.\n\nThe claim that digital payments are "faster and safer" is partly true. They can also be hacked, fail during power cuts and expose personal data, which the writer does not mention.\n\nThe example of Sweden implies that going cashless contributes to wealth. However, Sweden was rich long before it moved away from cash. Its wealth is not evidence that abolishing cash makes a country richer.\n\nThe final sentence is the weakest. Saying that only people "with something to hide" use cash ignores the elderly, the poor and people without bank accounts, who often rely on it. This is an unfair generalization about many honest people.\n\nA stronger argument would weigh the benefits of digital payments against these costs and suggest how to protect those who cannot easily give up cash.',
  },
];

/** judgedTopics11a are the first writing topics of grade 11 judged by a model. */
export const judgedTopics11a: readonly TopicDef[] = [
  {
    id: "writing-an-analysis-of-a-motif",
    title: t("Writing an Analysis of a Motif", "写母题分析"),
    summary: t(
      "Write a short analysis that traces a motif through a story, from its first appearance to its last, and explains what its changes show.",
      "写一篇简短的分析，追踪一个母题在故事中从第一次到最后一次的出现，并解释它的变化说明了什么。",
    ),
    prerequisites: after("motifs-in-a-story", "writing-a-thematic-analysis"),
    encompasses: covers(0.2, "motifs-in-a-story"),
    xp: 24,
    strand: "writing",
    criteria: ["g11-motif-claim", "g11-motif-trace", "g11-motif-quotes"].map(criterion),
    knowledgePoints: [
      point(
        "what-the-motif-means",
        t("What the Motif Means", "母题意味着什么"),
        t(
          "Open with a claim about what the motif **stands for** and what its changes show: *The stopped clock is a motif of a family frozen by grief, and its last appearance shows that healing does not mean returning to the past.* Do not only name the motif or describe it.",
          "开头要提出一个论点，说明母题**代表**什么、它的变化说明了什么：*The stopped clock is a motif of a family frozen by grief, and its last appearance shows that healing does not mean returning to the past.* 不要只说出母题或描述它。",
        ),
        writingGenerator(
          t(
            "Write the analysis in English, opening with a claim about what the motif stands for and what its changes show.",
            "用英语写这篇分析，开头提出母题代表什么、它的变化说明了什么。",
          ),
          motifBank,
          ["g11-motif-claim", "g11-motif-trace", "g11-motif-quotes"],
          limits,
          onePiece,
        ),
      ),
      point(
        "each-return-of-the-motif",
        t("Each Return of the Motif", "母题的每一次回归"),
        t(
          'Then take the appearances **in order**: the first, the turning point and the last. Quote a short phrase from each and explain what has changed: *The clock is now ticking, but "five hours wrong," so life has begun again without matching the old time.*',
          '然后**按顺序**分析母题的出现：第一次、转折点和最后一次。从每一处引用简短的词句，并解释发生了什么变化：*The clock is now ticking, but "five hours wrong," so life has begun again without matching the old time.*',
        ),
        writingGenerator(
          t(
            "Write the analysis in English, tracing the first appearance, the turning point and the last appearance of the motif with short quotations.",
            "用英语写这篇分析，引用简短的词句，追踪母题的第一次出现、转折点和最后一次出现。",
          ),
          motifBank,
          ["g11-motif-trace", "g11-motif-quotes", "g11-motif-claim"],
          limits,
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-a-meditative-essay",
    title: t("Writing a Meditative Essay", "写沉思性散文"),
    summary: t(
      "Write a meditative essay that begins with a close look at something in nature and moves, through concrete detail, to a larger idea about life.",
      "写一篇沉思性散文，从细致观察自然中的某样东西开始，借助具体细节，过渡到一个关于人生的更大观念。",
    ),
    prerequisites: after("moving-between-concrete-and-abstract", "writing-a-reflective-essay"),
    encompasses: covers(0.2, "moving-between-concrete-and-abstract"),
    xp: 24,
    strand: "writing",
    criteria: ["g11-meditation-observation", "g11-meditation-movement", "g11-meditation-insight"].map(criterion),
    knowledgePoints: [
      point(
        "looking-closely",
        t("Looking Closely", "细致地观察"),
        t(
          "Begin with **the thing itself**, observed closely enough that a reader can see it: *Its bark is split into deep grey plates, and one low branch has been worn smooth by generations of children.* Use specific details of color, shape, sound and change, not general words such as *beautiful*.",
          "从**事物本身**开始，观察得足够细致，让读者能看见它：*Its bark is split into deep grey plates, and one low branch has been worn smooth by generations of children.* 用颜色、形状、声音和变化等具体细节，而不是 *beautiful* 之类笼统的词。",
        ),
        writingGenerator(
          t(
            "Write the essay in English, opening with a close, concrete observation of the scene or object before any idea.",
            "用英语写这篇散文，在提出任何观念之前，先对场景或事物进行细致而具体的观察。",
          ),
          meditateBank,
          ["g11-meditation-observation", "g11-meditation-movement", "g11-meditation-insight"],
          limits,
          onePiece,
        ),
      ),
      point(
        "from-the-thing-to-the-thought",
        t("From the Thing to the Thought", "从事物到思考"),
        t(
          "Then let the observation **lead** to an idea, and show the step: *Watching the swallows, I realized that the size of a task is defeated by the size of each step.* End with an insight that grows out of the details and applies to your own life, without turning into a lecture.",
          "然后让观察**引出**一个观念，并展示这一步：*Watching the swallows, I realized that the size of a task is defeated by the size of each step.* 结尾给出一个从细节中生长出来、又能用于自己生活的感悟，而不要变成说教。",
        ),
        writingGenerator(
          t(
            "Write the essay in English, moving step by step from the observed details to a larger idea that applies to your own life.",
            "用英语写这篇散文，从观察到的细节一步步过渡到一个适用于自己生活的更大观念。",
          ),
          meditateBank,
          ["g11-meditation-movement", "g11-meditation-insight", "g11-meditation-observation"],
          limits,
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-a-critique-of-an-argument",
    title: t("Writing a Critique of an Argument", "写论证评析"),
    summary: t(
      "Write a short critique that summarizes an argument fairly, finds its unstated assumptions and weak evidence, and reaches a balanced judgment.",
      "写一篇简短的评析，公正地概述一个论证，找出其未言明的假设和薄弱的证据，并得出平衡的判断。",
    ),
    prerequisites: after("unstated-assumptions", "summarizing-an-opposing-view-fairly"),
    encompasses: covers(0.2, "unstated-assumptions", "summarizing-an-opposing-view-fairly"),
    xp: 24,
    strand: "writing",
    criteria: ["g11-critique-summary", "g11-critique-assumption", "g11-critique-judgment"].map(criterion),
    knowledgePoints: [
      point(
        "the-argument-in-fair-words",
        t("The Argument in Fair Words", "用公正的语言概述论证"),
        t(
          "Open by stating the writer's **claim and main reasons** in neutral words: *The writer argues that the school should ban phones because phones lower grades and cause bullying.* Then give your overall view in a sentence, before you test the parts.",
          "开头用中性的语言陈述作者的**主张和主要理由**：*The writer argues that the school should ban phones because phones lower grades and cause bullying.* 然后用一句话给出你的总体看法，再去检验各个部分。",
        ),
        writingGenerator(
          t(
            "Write the critique in English, opening with a fair summary of the claim and its main reasons and your overall view.",
            "用英语写这篇评析，开头公正地概述主张及其主要理由，并给出你的总体看法。",
          ),
          critiqueBank,
          ["g11-critique-summary", "g11-critique-assumption", "g11-critique-judgment"],
          limits,
          onePiece,
        ),
      ),
      point(
        "testing-the-reasoning",
        t("Testing the Reasoning", "检验推理"),
        t(
          "Then test the argument piece by piece: name an **unstated assumption** (*The argument assumes that phones cause the lower grades*), point out weak evidence or fallacies, and give the argument credit where it is strong. End with a **balanced judgment** and what would make the argument better.",
          "然后逐一检验论证：说出一个**未言明的假设**（*The argument assumes that phones cause the lower grades*），指出薄弱的证据或谬误，并在论证有力之处给予肯定。结尾给出**平衡的判断**，以及怎样能让论证更好。",
        ),
        writingGenerator(
          t(
            "Write the critique in English, naming at least one unstated assumption, giving credit where it is due and ending with a balanced judgment.",
            "用英语写这篇评析，至少指出一个未言明的假设，在应当肯定之处给予肯定，并以平衡的判断结尾。",
          ),
          critiqueBank,
          ["g11-critique-assumption", "g11-critique-judgment", "g11-critique-summary"],
          limits,
          onePiece,
        ),
      ),
    ],
  },
];
