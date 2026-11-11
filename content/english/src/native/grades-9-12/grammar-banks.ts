// Grades 9 to 12: the item banks of the grammar and style topics. Most are built from hand-written cores by
// templates that vary the people and the order of the parts, so each knowledge point has thirty or more items; every
// one is built the same way on every run.

import type { ChoiceItem } from "@ga/subject-english";

/** pick takes an element of a list by an index that may run past its end. */
const pick = <T>(list: readonly T[], i: number): T => list[i % list.length] as T;

const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** rows splits hand-written lines of fields separated by bars. */
const rows = (lines: string): string[][] =>
  lines
    .trim()
    .split("\n")
    .map((line) => line.trim().split("|"));

/** labelled turns lines of a sentence and its label into items whose wrong options are the other labels, two at a time. */
const labelled = (lines: string, labels: readonly string[]): ChoiceItem[] =>
  rows(lines).map(([shown, right], i) => {
    const others = labels.filter((l) => l !== right);
    const wrong = others.length <= 2 ? others : [pick(others, i), pick(others, i + 1)];
    return [shown ?? "", right ?? "", wrong];
  });

const women = ["Maya", "Priya", "Ana", "Lena", "Aisha", "Rosa", "Mei", "Zara"];
const men = ["Leo", "Sam", "Jun", "Omar", "Tomas", "Kenji", "Diego", "Kofi"];

/** named fills {F} with a woman's name and {M} with a man's, chosen by the index. */
const named = (s: string, i: number) => s.replace("{F}", pick(women, i)).replace("{M}", pick(men, i));

// Semicolons and colons.

/** punctuationBank asks which mark belongs in the gap: a semicolon, a colon or a comma. */
export const punctuationBank: readonly ChoiceItem[] = [
  // A semicolon joins two independent clauses, with or without a word such as however.
  ...rows(`
    The storm passed before noon ___ the roads stayed closed until evening.
    {F} finished the essay at midnight ___ she still had to check the citations.
    The museum was crowded on Saturday ___ on Monday we had the galleries to ourselves.
    The first draft was too long ___ the second cut half of it.
    {M} trained every morning for a year ___ however, the race was cancelled.
    The tickets sold out in an hour ___ consequently, the band added a second show.
    The bridge looked solid ___ nevertheless, the engineers closed it for inspection.
    {F} speaks three languages ___ moreover, she is learning a fourth.
    Some students prefer to study alone ___ others work best in a group.
    The river froze early that winter ___ the ferry did not run again until March.
  `).map(([s], i): ChoiceItem => [named(s ?? "", i), ";", [":", ","]]),
  // A semicolon separates items of a list that already contain commas.
  ...rows(`
    The tour stopped in Lyon, France ___ Turin, Italy; and Geneva, Switzerland.
    The panel included {F}, a doctor ___ Mr. Ito, a nurse; and Ms. Reyes, a pharmacist.
    We met on Monday, May 4 ___ Friday, May 8; and Tuesday, May 12.
    The prizes went to {M}, for poetry ___ the twins, for drama; and the editor, for the best essay.
    The team needs a captain, who leads ___ a keeper, who never panics; and a coach, who sees everything.
  `).map(([s], i): ChoiceItem => [named(s ?? "", i + 3), ";", [",", ":"]]),
  // A colon follows a complete clause and introduces a list, an explanation or a quotation.
  ...rows(`
    The recipe needs only three things ___ flour, eggs and milk.
    {M} had one reason to smile ___ the exam was finally over.
    The sign gave a single warning ___ do not feed the bears.
    The expedition carried the essentials ___ a stove, a tent, rope and a radio.
    The answer was obvious ___ someone had left the gate open.
    The coach repeated her favorite rule ___ the ball is never yours until the whistle blows.
    Only one problem remained ___ nobody knew where the key was.
    {F} packed what mattered most ___ her notebooks, her violin and a photo of her grandmother.
    The report reached a clear conclusion ___ the factory had been polluting the river for years.
    The poet chose an unusual subject ___ the inside of a shoe.
    The town has two seasons ___ tourist season and mud season.
    Lincoln's address opens with a famous phrase ___ "Four score and seven years ago."
  `).map(([s], i): ChoiceItem => [named(s ?? "", i + 6), ":", [";", ","]]),
  // A comma, not a semicolon or colon, comes before and, but or so joining two clauses.
  ...rows(`
    The storm passed before noon ___ but the roads stayed closed until evening.
    {F} missed the bus ___ so she walked the three miles to school.
    The ice looked thick ___ yet no one dared to cross it.
    The lights flickered twice ___ and then the whole street went dark.
    The essay was due on Friday ___ but {M} handed it in on Wednesday.
  `).map(([s], i): ChoiceItem => [named(s ?? "", i + 2), ",", [";", ":"]]),
];

// Periodic and cumulative sentences.

/** shapeCores are a main clause and the modifiers that may come before it (periodic) or after it (cumulative). */
const shapeCores: readonly (readonly [main: string, mods: readonly string[]])[] = [
  ["the old dog limped home", ["soaked by the rain", "its tail low", "its paws heavy with mud"]],
  ["the general signed the surrender", ["after four years of war", "after a million dead", "after every promise had failed"]],
  ["she opened the letter", ["alone in the kitchen", "her coffee going cold", "the clock ticking above the stove"]],
  ["the crowd fell silent", ["at the moment the runner crossed the line", "arms raised", "face twisted with pain and joy"]],
  ["the ship went down", ["with its lights still burning", "with its band still playing", "with half its boats never lowered"]],
  ["he understood his father at last", ["years later", "standing in the same kitchen", "holding a child of his own"]],
  ["the city woke", ["slowly", "street by street", "the bakeries first, then the markets, then the trains"]],
  ["the treaty was signed", ["in a cold room in Paris", "by men who had never seen the battlefields", "with a gold pen"]],
  ["the girl stepped onto the stage", ["shaking", "clutching her violin", "her eyes fixed on the back of the hall"]],
  ["the river had risen over the road", ["by morning", "brown and swift", "carrying branches, fences and a lost canoe"]],
  ["the fox slipped into the hedge", ["low to the ground", "silent", "a feather still caught in its teeth"]],
  ["the committee approved the plan", ["after three hours of argument", "two walkouts", "one broken chair"]],
  ["my grandmother laughed", ["standing in the ruins of her kitchen", "flour on her face", "the cake in pieces on the floor"]],
  ["the scientists found the answer", ["after ten years", "after a thousand failed tests", "after almost giving up"]],
  ["the soldiers marched home", ["thin", "silent", "their boots worn through"]],
];

/** periodic puts the modifiers first and saves the main clause for the end; cumulative states it first and adds on. */
const periodic = (main: string, mods: readonly string[]) => `${capital(mods.join(", "))}, ${main}.`;
const cumulative = (main: string, mods: readonly string[]) => `${capital(main)}, ${mods.join(", ")}.`;

/** shapeBank asks whether a sentence is periodic, cumulative or balanced. */
export const shapeBank: readonly ChoiceItem[] = [
  ...shapeCores.flatMap(([main, mods], i): ChoiceItem[] => {
    const p: ChoiceItem = [periodic(main, mods), "periodic", ["cumulative", "balanced"]];
    const c: ChoiceItem = [cumulative(main, mods), "cumulative", ["periodic", "balanced"]];
    return i % 2 === 0 ? [p, c] : [c, p];
  }),
  ...rows(`
    We came to build a school, not to build a wall.
    To err is human; to forgive, divine.
    The rich man feared losing his money; the poor man feared losing his home.
    Some read to escape the world; others read to understand it.
    The young want to change the world, and the old want the world to stop changing.
    Winter keeps the seed, and spring sets it free.
    It is easy to start a war and hard to end one.
    The coach praised in public and criticized in private.
  `).map(([s]): ChoiceItem => [s ?? "", "balanced", ["periodic", "cumulative"]]),
];

// Conditional sentences.

/** conditionalBank asks for the verb form of a real, unreal, past unreal or mixed conditional, or an inversion. */
export const conditionalBank: readonly ChoiceItem[] = rows(`
  If {F} ___ the bus at seven, she will reach the museum before it opens.|catches|caught|had caught
  If it ___ tomorrow, the match will move indoors.|rains|rained|would rain
  If you heat ice, it ___.|melts|would melt|would have melted
  If {F} finishes the report tonight, the editor ___ it in the morning.|will read|would read|would have read
  If I ___ you, I would apologize before the meeting.|were|am|had been
  If {F} ___ more time, she would learn to play the cello.|had|has|would have
  If the library ___ open on Sundays, more students would use it.|stayed|stays|had stayed
  If {M} lived closer to the sea, he ___ every morning.|would swim|will swim|would have swum
  If we ___ a car, we could visit the national park this weekend.|owned|own|had owned
  If {F} knew the answer, she ___ her hand.|would raise|will raise|would have raised
  If {M} ___ the warning, he would not have crossed the ice.|had heard|heard|would hear
  If the captain had checked the weather, the ship ___ the harbor.|would not have left|would not leave|will not leave
  If they had left an hour earlier, they ___ the storm.|would have missed|would miss|had missed
  If {F} ___ harder for the exam, she would have passed it.|had studied|studied|would study
  If the council had listened to the engineers, the bridge ___.|would not have collapsed|would not collapse|did not collapse
  If I had known about the party, I ___ a cake.|would have brought|would bring|had brought
  If {F} had taken the job in Tokyo, she ___ there now.|would be living|would have lived|will be living
  If I had eaten breakfast, I ___ so hungry now.|would not be|would not have been|will not be
  If {M} ___ his passport last week, he would be on the plane right now.|had renewed|renewed|would renew
  If the town had built the dam, the valley ___ under water today.|would be|would have been|will be
  If {F} were more careful, she ___ that mistake yesterday.|would not have made|would not make|will not make
  If he were braver, he ___ for class president last spring.|would have run|would run|will run
  ___ I known about the delay, I would have taken the train.|Had|Have|If
  ___ you need help, call the front desk at any hour.|Should|Would|Had
  ___ I in your place, I would accept the offer.|Were|Was|If
  ___ the weather been better, the climbers would have reached the summit.|Had|Has|Were
  ___ they arrive late, the doors will already be closed.|Should|Would|Were
  ___ she known the truth, she would never have signed the contract.|Had|Has|Was
  Unless {F} ___ now, she will miss the last train.|leaves|left|would leave
  Unless the rain stops, the parade ___ cancelled.|will be|would be|would have been
  If {M} ___ the letter, he would know why his sister left.|had read|reads|would read
  If you mix blue and yellow, you ___ green.|get|would get|got
  If the bakery ___ out of bread, we will buy rolls instead.|runs|ran|had run
  If I won the prize, I ___ the money to the animal shelter.|would give|will give|would have given
`).map(([s, right, ...wrong], i): ChoiceItem => [named(s ?? "", i), right ?? "", wrong]);

// Absolute phrases.

/** absoluteCores are a main clause and three phrases a sentence may add to it: absolute, participial and prepositional. */
const absoluteCores: readonly (readonly [main: string, absolute: string, participial: string, prepositional: string])[] = [
  ["{F} began to sing", "her hands trembling", "stepping onto the stage", "under the hot lights"],
  ["the climbers reached the summit", "their lungs burning", "pulling themselves over the last ledge", "at dawn"],
  ["{M} waited by the door", "his coat already buttoned", "checking the clock again", "in the cold hallway"],
  ["the old horse stood in the field", "its head low", "ignoring the farmer's call", "near the broken gate"],
  ["the rowers crossed the finish line", "their oars flashing", "gasping for breath", "in record time"],
  ["{F} read the letter twice", "her face pale", "sitting at the kitchen table", "by candlelight"],
  ["the soldiers marched into the square", "their flags torn", "singing an old song", "after the long siege"],
  ["the cat watched the bird", "its tail twitching", "crouching in the tall grass", "beside the fence"],
  ["{M} walked out of the exam", "his pencil still in his hand", "smiling to himself", "into the bright afternoon"],
  ["the ship sailed into the harbor", "its sails patched", "carrying spices from the east", "at the end of summer"],
  ["the judge read the verdict", "her voice steady", "looking straight at the jury", "in the silent courtroom"],
  ["the children ran toward the sea", "their towels flying behind them", "shouting with joy", "across the hot sand"],
  ["{F} finished the marathon", "her knees aching", "pushing through the last mile", "in the pouring rain"],
  ["the fox crossed the road", "its tail held high", "sniffing the air", "in the early morning"],
  ["the singer bowed to the crowd", "his voice gone", "holding the roses", "at the end of the concert"],
  ["the farmer surveyed the field", "the harvest finally in", "leaning on his gate", "in the evening light"],
];

/** absoluteBank asks which phrase of a sentence is the absolute phrase, a noun with a participle of its own. */
export const absoluteBank: readonly ChoiceItem[] = absoluteCores.flatMap(([main, absolute, participial, prepositional], i) => {
  const m = named(main, i);
  const front = `${capital(participial)}, ${m} ${prepositional}, ${absolute}.`;
  const back = `${capital(absolute)}, ${m} ${prepositional}, ${participial}.`;
  return [
    [front, absolute, [participial, prepositional]],
    [back, absolute, [participial, prepositional]],
  ] satisfies ChoiceItem[];
});

// Noun clauses.

const subject = "the subject";
const object = "the direct object";
const prepObject = "the object of a preposition";
const complement = "a subject complement";
const nounJobs = [subject, object, prepObject, complement] as const;

/** nounClauses are clauses that act as nouns; the clauses with that cannot follow a preposition. */
const nounClauses: readonly (readonly [clause: string, afterPreposition: boolean])[] = [
  ["what the scientist had found", true],
  ["whether the bridge was safe", true],
  ["that the river was rising", false],
  ["why the lights went out", true],
  ["how the thief got in", true],
  ["who left the gate open", true],
  ["where the old map was hidden", true],
  ["when the storm would arrive", true],
  ["that the letter had been forged", false],
  ["which road led to the coast", true],
];

const jobFrames: Readonly<Record<string, readonly string[]>> = {
  [subject]: ["{C} worried the mayor all week.", "{C} was the talk of the whole village."],
  [object]: ["The report did not say {c}.", "Nobody in the room knew {c}."],
  [prepObject]: ["Everyone argued about {c}.", "The detective thought carefully about {c}."],
  [complement]: ["The real question was {c}.", "The mystery was {c}."],
};

/** nounClauseBank asks what job a noun clause, in bold, does in its sentence. */
export const nounClauseBank: readonly ChoiceItem[] = nounClauses.flatMap(([clause, afterPreposition], i) =>
  nounJobs
    .filter((job) => afterPreposition || job !== prepObject)
    .map((job, j): ChoiceItem => {
      const frame = pick(jobFrames[job] ?? [], i + j);
      const bold = `**${clause}**`;
      const shown = frame.startsWith("{C}") ? frame.replace("{C}", `**${capital(clause)}**`) : frame.replace("{c}", bold);
      const others = nounJobs.filter((x) => x !== job);
      return [shown, job, [pick(others, i), pick(others, i + 1)]];
    }),
);

// Integrating quotations.

/** quoteCores are a speaker in a work, his or her pronoun, and a line the speaker says that begins with I. */
const quoteCores: readonly (readonly [speaker: string, pronoun: string, possessive: string, rest: string])[] = [
  ["the narrator of *The Salt Road*", "he", "his", "have never trusted the sea"],
  ["the novel's heroine, Mara,", "she", "her", "would rather lose the farm than lose this family"],
  ["the old captain", "he", "his", "learned to sail before learning to read"],
  ["the speaker of the poem", "she", "her", "keep the past in a jar of buttons"],
  ["the mayor in the play", "he", "his", "promised the town a bridge and gave it a wall"],
  ["Dr. Osei in her essay", "she", "her", "trust a result only when a stranger can repeat it"],
  ["the young soldier", "he", "his", "did not know that a field could hold so much silence"],
  ["Grandmother Lin in the memoir", "she", "her", "cooked for fifty people and never sat down to eat"],
  ["the narrator of the story", "she", "her", "watched the house burn and felt only relief"],
  ["the prince", "he", "his", "cannot be a king and a son at once"],
  ["the scientist in the documentary", "she", "her", "spent ten years trying to prove the theory wrong"],
  ["the runaway in the novel", "he", "his", "left with nothing but a coat and a name"],
];

/** quotationBank asks which of three sentences works a quotation into the writer's own sentence correctly. */
export const quotationBank: readonly ChoiceItem[] = quoteCores.flatMap(([speaker, pronoun, possessive, rest]) => {
  const q = `I ${rest}`;
  const speakerCap = capital(speaker);
  return [
    [`The line: "${q}."`, `As ${speaker} says, "${q}."`, [`As ${speaker} says "${q}."`, `As ${speaker} says: "${q}."`]],
    [
      `The line: "${q}."`,
      `${speakerCap} admits that "[${pronoun}] ${rest}."`,
      [`${speakerCap} admits that, "[${pronoun}] ${rest}."`, `${speakerCap} admits that "${pronoun} ${rest}."`],
    ],
    [
      `The line: "${q}."`,
      `${speakerCap} states ${possessive} view plainly: "${q}."`,
      [`${speakerCap} states: ${possessive} view plainly "${q}."`, `${speakerCap} states ${possessive} view plainly "${q}."`],
    ],
  ] satisfies ChoiceItem[];
});

// Word order for emphasis.

const inversion = "inversion";
const fronting = "fronting";
const cleft = "a cleft sentence";

/** emphasisBank asks how a sentence moves a word or phrase into a place of stress. */
export const emphasisBank: readonly ChoiceItem[] = labelled(
  `
  Never had the village seen such a flood.|${inversion}
  Not until the last guest left did she allow herself to cry.|${inversion}
  Only then did we understand what the warning meant.|${inversion}
  Rarely does a first novel sell a million copies.|${inversion}
  Seldom have I heard a speech so honest.|${inversion}
  Under the old oak stood a single gravestone.|${inversion}
  Into the room burst the youngest of the brothers.|${inversion}
  Little did they know that the bridge would not hold.|${inversion}
  No sooner had the bell rung than the hall emptied.|${inversion}
  Hardly had we sat down when the lights went out.|${inversion}
  Down came the rain, all at once.|${inversion}
  At no time did the captain consider turning back.|${inversion}
  That kind of help we can do without.|${fronting}
  Her courage I will never forget.|${fronting}
  Strange it may seem, but the plan worked.|${fronting}
  This question the committee refused to answer.|${fronting}
  Tired they were, but they kept walking.|${fronting}
  The first chapter I read three times.|${fronting}
  Money he had; friends he had none.|${fronting}
  What he promised, he delivered.|${fronting}
  A fool I may be, but I am not a liar.|${fronting}
  Every word of that letter she still remembers.|${fronting}
  The ending of the film I found unbearable.|${fronting}
  Those mountains our grandparents crossed on foot.|${fronting}
  It was the silence that frightened him most.|${cleft}
  It was my grandmother who taught me to read.|${cleft}
  What the town needs is a hospital, not a stadium.|${cleft}
  What surprised us was how quickly the ice melted.|${cleft}
  It was in Lisbon that the two friends met again.|${cleft}
  It was only after the storm that we saw the damage.|${cleft}
  What I remember most is the smell of the bakery.|${cleft}
  It is the small mistakes that sink a ship.|${cleft}
  What she wanted was a single honest answer.|${cleft}
  It was the youngest player who scored the winning goal.|${cleft}
  What matters is not how fast you run but whether you finish.|${cleft}
  It was not the cold but the hunger that defeated the army.|${cleft}
`,
  [inversion, fronting, cleft],
);

// Sentence variety for effect.

/** varietyBank gives a paragraph and asks which ending gives it the strongest emphasis, by contrast with what came before. */
export const varietyBank: readonly ChoiceItem[] = rows(`
  For three weeks we had searched the mountains, following old trails, questioning shepherds and sleeping in caves that smelled of smoke and sheep. On the twenty-second day, cold and nearly out of food, we climbed the last ridge and looked down into the valley where the monastery was supposed to be.|It was gone.|When we looked, after everything, we saw that the monastery that we had been searching for was, in fact, no longer there in the valley.|The monastery, which had been standing there for many centuries according to the shepherds, was not there anymore, as we discovered.
  The coach talked for twenty minutes about effort, about pride, about what the town expected and what our fathers had done on the same field thirty years before. Then she folded her notes, looked at each of us in turn and said the only thing anyone remembered.|"Win."|She told us that what she wanted from us, more than anything else that night, was for us to go out there and win the game.|She said that we should win, which was the main point of everything she had been saying for the past twenty minutes.
  I practiced the sonata every evening that winter, through the holidays, through a fever, through the night the power failed and I played by candlelight with numb fingers. When the day of the audition came, I sat down, lifted my hands and played the first notes.|They were perfect.|The notes that I played, after all the practice of that long winter, turned out to be exactly right, every one of them, without a mistake.|After all that practice, and I want to stress how much practice it was, the first notes I played were perfect, I think.
  The letter had been in the drawer for forty years, under tax forms and old receipts and a broken watch, and no one in the family knew it existed. My aunt found it while clearing the house, read it standing by the window, and then sat down very slowly.|It was from her father.|The letter, as she discovered by reading it there by the window, had been written to her by her own father many years before.|She saw that it was from her father, who had written it, it seemed, a very long time ago, before she was born or soon after.
  The factory had promised jobs, a new school and clean water, and for a while the town believed every word. Then the fish in the river began to die, the children began to cough, and the company's lawyers began to arrive.|The promises were lies.|It became clear to everyone in the town, slowly but surely, that the promises the factory had made were not in fact true.|The promises, which the town had believed for a while, were not, as people began to realize after some time, entirely honest.
  Rain fell. The roof leaked. The baby cried. The phone rang and rang. My father sat at the kitchen table with his head in his hands.|Then my mother came home, shook out her umbrella, put the kettle on, picked up the baby, answered the phone and, somehow, without raising her voice, made the whole house quiet again.|Then my mother came home.|My mother came. She fixed it. It was quiet.
  Wind. Ice. Dark. For six hours the climbers clung to the ledge.|When the sun finally rose, spreading gold across the glacier below them and warming their frozen faces, they saw the path down, clear and wide, as if it had been waiting for them all night.|The sun rose.|Then morning. Then light. Then the path.
  The judge had heard the evidence for nine days: the witnesses, the photographs, the long arguments of lawyers who seemed to enjoy their own voices. On the tenth morning she entered the courtroom, sat down, and looked at the young man in the dock.|"Not guilty."|She said that the young man in the dock was found not guilty of the crime of which he had been accused by the state.|After looking at him for a while, she announced her decision, which was that he had been found not guilty.
  We had planned the trip for a year, saved every coin, read every guidebook and practiced our French on the bus to school each morning. We arrived in Paris at dawn, tired and happy, and took a taxi straight to the Eiffel Tower.|It was closed.|When we got there, we found that on that particular day, for reasons we never learned, it was not open to visitors.|The tower, to our great disappointment, which we felt very strongly, was not open that day.
  My grandfather never spoke about the war, not at dinner, not on holidays, not even when my brother asked him directly for a school project. Then one evening, watching the news, he put down his fork.|"I was there," he said.|He told us, in a quiet voice that none of us had heard before, that he had been there himself during the war.|He said that he had been there, which surprised all of us, because he had never told us before.
  For months the scientists had seen nothing in their data but noise: random flickers, broken signals, the hum of their own machines. Then, at 3:14 one morning, a young researcher stared at her screen and called the others over.|There it was.|On the screen, she showed them, was the signal that they had been looking for over all those months of work.|What she had found, as they all saw when they came over, was the signal at last, after months.
  The ship had survived storms off the Cape, fevers in the tropics and a fire in the hold that nearly took the mainmast. Within sight of home, on a calm and sunny afternoon, it struck a rock that was marked on every chart.|It sank in minutes.|The ship then sank, and the sinking took only a matter of a few minutes from start to finish.|Within minutes, which was a surprisingly short time considering all it had survived, it sank.
  Everyone said the old bakery would close: the rent had doubled, the oven was older than the owner, and a chain store had opened across the street. On the last Saturday of the month, the line outside stretched around the block.|The bakery stayed open.|In the end, after all of these worries, the bakery did not have to close and was able to stay open for business.|It turned out that, despite what everyone had been saying for a long time, the bakery stayed open after all.
  She had written the speech in her head a hundred times: on the bus, in the shower, in the minutes before sleep. Now she stood at the podium, the hall full, the microphone humming.|Her mind went blank.|She found that her mind, at that important moment in front of everyone, had gone completely blank and empty.|Her mind, which had been so full of the speech for weeks, was suddenly, to her horror, blank.
  The general promised that the war would be over by Christmas. The newspapers repeated it. Families planned their reunions. Soldiers wrote home that they would be back for dinner.|The war lasted four more years.|In fact, as it turned out, the war continued to go on for a period of four more years after that Christmas.|But the war did not end then, and it went on, lasting four more years, longer than anyone had said.
  Our team had lost every game that season: by ten points, by twenty, once by forty, in front of a crowd that came only to laugh. In the final game, with two seconds left, the ball came to the smallest player on the court.|She scored.|The ball went in the basket when she threw it, which meant that our team had scored at the last second.|She threw the ball, and it went in, which was a surprise to everyone who was watching.
  My brother spent the whole summer building a boat in the garage from plans he found in a library book. He sawed and glued and painted, ignored our jokes, and finally carried it to the lake on the first day of September.|It floated.|When he put it in the water, it turned out that the boat was able to float on the surface of the lake.|The boat, which he had worked on all summer, to everyone's surprise, floated on the lake.
  For a decade the two countries had traded insults, closed their borders and built up their armies along the river that divided them. In a small room in a neutral city, after a week of secret talks, the two leaders stood up from the table.|They shook hands.|The two leaders then reached out across the table and shook each other's hands in the small room.|After the week of secret talks in the neutral city, the leaders, who had been enemies, shook hands.
  The experiment needed silence, darkness and a temperature that never changed by more than a tenth of a degree. On the night of the test, everything was ready, the lab was sealed, and the team held its breath.|Then someone sneezed.|At that moment, unfortunately for the experiment, one of the members of the team sneezed loudly.|Someone, who must have had a cold, sneezed at that moment, which ruined the silence.
  The essay contest asked for two thousand words on the meaning of home. I wrote about my grandmother's house, my father's village, the apartment where I was born, and the six cities my family had lived in since.|I did not win.|The judges, when they announced the results, did not choose my essay as the winner of the contest.|My essay, unfortunately, was not chosen by the judges, who picked another one.
  The explorers had crossed a thousand miles of ice, eaten their last dogs and buried two of their companions in the snow. When they finally reached the Pole, they found a tent and a flag already standing there.|Someone had beaten them.|They realized that another team of explorers had reached the Pole before they had arrived there.|The tent and the flag showed them, to their horror, that another team had arrived first.
  Mother had warned us not to open the attic, not to touch the boxes, and above all not to read the diaries stacked beneath the window. The day she went into town, we climbed the stairs, opened the first box and lifted out a small blue book.|It was her diary from the year she was our age.|The book that we took out of the box was a diary, and it had been written by our mother when she was about the same age as we were.|We saw that it was a diary that our mother had kept a long time ago, in the year she was our age.
  The candidate had spent millions on posters, speeches, television advertisements and buses with her face painted on the side. On election night, her supporters filled a hotel ballroom and waited for the results.|She lost by nine votes.|The results showed that she had not won the election, and that the number of votes by which she lost was nine.|When the results came in, they showed that she had lost, and only by a margin of nine votes in the end.
  Grandfather's garden was famous in the village: roses as big as fists, tomatoes that won prizes, beans that climbed higher than the roof. The spring after he died, no one tended it, no one watered it, and no one came to look.|Still, the roses bloomed.|In spite of all that, the roses that he had planted in the garden came into bloom again that year.|The roses, even though nobody was looking after the garden that spring, bloomed anyway, as they always had.
  The professor lectured for an hour on the causes of the war: the alliances, the arms race, the empires, the assassination in Sarajevo. At the end, a student in the back row raised her hand and asked a single question.|"Could it have been stopped?"|She wanted to know whether or not, in the professor's opinion, it would have been possible to stop the war from happening.|Her question was whether the war, with all those causes, could have been stopped by anyone.
  Our neighbor had never said a kind word to anyone: he shouted at children, poisoned the moles in his lawn and called the police whenever a car parked in front of his house. When the flood came, he was the first one at our door with sandbags.|We never forgot it.|That was something that our family did not forget, even many years later when we had moved away.|We remembered that for years afterward, all of us, because it was so surprising.
  The lighthouse keeper lived alone on the rock for thirty years, lighting the lamp each evening, writing the weather in his log and watching ships pass that never stopped. On the day the lighthouse became automatic, a boat came to take him to the mainland.|He would not go.|He told the people on the boat that he did not want to leave the rock and go to the mainland with them.|He refused to leave, telling them that he wanted to stay on the rock where he had lived.
  The doctors tried everything: new medicines, old medicines, rest, surgery, a special diet and a hospital by the sea. In the spring, against every prediction, my sister walked out of the hospital on her own two feet.|She was nine.|At the time that this happened, my sister was only nine years old.|She was, at that time, a little girl of only nine years of age.
  The dam had held for a hundred years against floods, earthquakes and a war. In the end, it was not a flood or a bomb that broke it, but a crack no wider than a hair, ignored for a decade by inspectors who were in a hurry.|Small things matter.|This shows us that, in the end, it is often the small things that are the ones that turn out to be important.|It shows that small things, like the crack, can matter, sometimes more than big ones.
  For two years the old cinema stood empty: its seats torn, its screen stained, its doors chained against the kids who broke in at night to tell ghost stories. Then a retired teacher bought it, spent every evening of a long winter scrubbing and sewing and painting, and on the first warm night of spring opened the doors to the whole town.|Every seat was full.|When the doors opened that night, it turned out that each one of the seats in the whole cinema had someone sitting in it.|The seats, which she had sewn herself over the winter, were all taken by people from the town, as far as anyone could see.
`).map(([context, right, ...wrong]): ChoiceItem => [context ?? "", right ?? "", wrong]);
