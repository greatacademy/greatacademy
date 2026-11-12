// Grade 12: writing judged by a model, part two: a comparison of two translations and a proposal to reduce a risk.

import { type TopicDef, t } from "@ga/content";
import { point, type WritingItem, writingGenerator } from "@ga/subject-english";
import { after, covers } from "../grade-5/links.ts";
import { criterion, onePiece } from "../grade-5/writing-judged-a.ts";
import { limits } from "./writing-judged-a.ts";

/** translateBank gives a line with a word-for-word gloss and two translations for the student to compare. */
const translateBank: readonly WritingItem[] = [
  {
    task: 'Compare these two translations of the opening of a short poem. Word for word, the original says: "Autumn wind. Old road. Thin horse. Sun sets west. Broken-hearted man at sky\'s edge." Translation A: "An autumn wind blows over the old road, where a thin horse walks as the sun sets in the west, and a heartbroken traveler stands at the edge of the world." Translation B: "Autumn wind. Old road. A thin horse. / The sun goes down in the west. / A man with a broken heart, at the end of the sky."',
    model:
      'Both translations carry the sadness of the original, but Translation B is closer to its spirit, because it keeps the poem\'s broken, image-by-image form, while Translation A smooths it into one flowing sentence.\n\nThe original is a list of short images with no verbs: "Autumn wind. Old road. Thin horse." Translation B keeps this almost exactly: "Autumn wind. Old road. A thin horse." The full stops make each image stand alone, so the reader sees them one after another, like pictures. The effect is stark and lonely.\n\nTranslation A joins the images with verbs and clauses: the wind "blows over the old road, where a thin horse walks." The result is graceful and easy to read, but it explains connections the original leaves silent. It also adds "traveler," which tells us who the man is, while the original only calls him "broken-hearted man."\n\nThe two translations also differ in their last image. A\'s "the edge of the world" sounds grand and familiar, while B\'s "the end of the sky" is stranger and closer to the original\'s "sky\'s edge."\n\nTranslation A would suit a reader who wants a smooth English poem. But for a reader who wants to feel how the original works, Translation B is better, because its silences are part of the poem\'s meaning.',
  },
  {
    task: 'Compare these two translations of a line from a story. Word for word, the original says: "Mother said nothing. She only put more rice in my bowl." Translation A: "Mother said nothing. She only put more rice in my bowl." Translation B: "Mother didn\'t say a word, but her love was clear as she quietly heaped extra rice into my bowl."',
    model:
      'These two translations differ mainly in how much they explain, and Translation A is stronger because it trusts the reader to understand the mother\'s silent love.\n\nTranslation A is almost word for word: "Mother said nothing. She only put more rice in my bowl." The two short sentences keep the original\'s restraint. The word "only" suggests that this small act is all the mother can or will do, and the reader feels the love inside it without being told.\n\nTranslation B adds a great deal. It joins the sentences with "but," and it adds the phrase "her love was clear," which states openly what the original leaves unspoken. It also changes "put more rice" to "heaped extra rice," which is more vivid but makes the gesture bigger and less shy.\n\nThe additions make B warmer and easier for a reader who might miss the meaning of the gesture. However, they also take away the reader\'s discovery. In the original, the power of the moment comes from the gap between the mother\'s silence and her action. B fills that gap.\n\nA reader of B learns that the mother loves her child; a reader of A feels it. For a story built on quiet emotion, the plainer translation is the more faithful and the more moving.',
  },
  {
    task: 'Compare these two translations of a line from a letter. Word for word, the original says: "I am well. The weather is cold. I think of you every day." Translation A: "I am fine. It is cold here. I think about you every day." Translation B: "All is well with me, though the cold has settled in; not a day passes without my thoughts turning to you."',
    model:
      'Both translations are accurate, but they create very different writers: A sounds plain and direct, while B sounds formal and literary, and A is closer to the voice of the original.\n\nThe original consists of three short, simple sentences. Translation A keeps that shape and its everyday words: "I am fine. It is cold here. I think about you every day." The plainness suggests a writer who is not trying to impress, and the last sentence, coming without ornament, feels sincere.\n\nTranslation B joins the sentences into one long, balanced sentence with a semicolon. Its words are more elaborate: "All is well with me," "the cold has settled in," "not a day passes without my thoughts turning to you." The phrasing is beautiful, but it belongs to an older, more educated style that the original does not use.\n\nB also changes the emotional effect. Its graceful phrasing makes the love sound composed and literary. A\'s bare statement makes it sound like something the writer could only say simply.\n\nB might suit a translator who wants to present the letter as literature. But if the letter was written by an ordinary person, A is more faithful, because it keeps both the meaning and the simple voice in which that meaning was offered.',
  },
  {
    task: 'Compare these two translations of the first line of a novel. Word for word, the original says: "Many years later, on the platform, the doctor remembered the morning his mother took him to see the sea." Translation A: "Many years later, as he stood alone on the crowded platform, the doctor remembered that distant morning when his mother took him to see the sea." Translation B: "Years afterward, standing on the platform, the doctor would recall the morning his mother showed him the sea."',
    model:
      'Both translations open the novel with a contrast between an adult\'s present and a childhood memory, but they differ in how much they explain, and each has a strength the other lacks.\n\nTranslation A adds three words that the original does not contain: "alone," "crowded" and "distant." "Alone on the crowded platform" tells the reader at once that the doctor is lonely among strangers, while the original says only "on the platform." "Distant morning" stresses how long ago the memory is. These additions set the mood clearly, but they leave the reader less to discover.\n\nTranslation B stays closer to the original\'s restraint. "Standing on the platform" gives only the place, so the reader must wonder why this moment brings the memory back. B also uses "would recall," which gives the sentence a storyteller\'s sense of looking forward in time.\n\nThe translations differ again at the end. A keeps "took him to see the sea," which suggests a journey, while B\'s "showed him the sea" is shorter and more intimate, as if the sea were a gift.\n\nA is easier for readers who want the feeling named. But B better preserves the original\'s quiet tension, letting a plain setting carry an unspoken meaning. For a first line meant to draw readers in, B\'s restraint is the more powerful choice.',
  },
  {
    task: 'Compare these two translations of a proverb. Word for word, the original says: "Water drop, drop, stone hole." Translation A: "Constant dripping wears away the stone." Translation B: "Drop by drop, the water makes a hole in the stone."',
    model:
      'Both translations express the proverb\'s meaning that patience overcomes difficulty, but A turns it into a familiar English saying, while B keeps the original\'s concrete picture and rhythm.\n\nTranslation A, "Constant dripping wears away the stone," sounds like a proverb English speakers already know. The word "constant" sums up the repetition of the original "drop, drop," and "wears away" describes a slow process. The sentence is polished and easy to remember.\n\nHowever, A loses something. The original\'s repetition, "drop, drop," lets the reader almost hear the water falling. A replaces this sound with the abstract adjective "constant." It also changes "hole" to "wears away," so the dramatic result in the original becomes gradual and vague.\n\nTranslation B, "Drop by drop, the water makes a hole in the stone," keeps the repetition and the concrete result. Its rhythm imitates the patient falling of the water, and the final image, "a hole in the stone," shows exactly what patience achieves.\n\nB is slightly longer and less familiar as a saying, but it is truer to the original\'s way of thinking through a vivid picture. For readers who want to understand how the proverb works in its own language, B is better; for readers who just need the meaning, A is efficient.',
  },
  {
    task: 'Compare these two translations of a line from a song. Word for word, the original says: "If you go, I will wait under the willow tree until the river runs dry." Translation A: "If you leave, I\'ll wait beneath the willow till the river\'s gone." Translation B: "Should you depart, I shall await your return under the willow tree, until such time as the river runs dry."',
    model:
      'Translation A is the better translation of this line, because it keeps the song\'s simplicity and rhythm, while Translation B\'s formal language turns a love song into something stiff.\n\nThe original is a plain, emotional promise: "If you go, I will wait under the willow tree until the river runs dry." Translation A keeps this directness with short, common words: "If you leave, I\'ll wait beneath the willow." The contractions "I\'ll" and "till" make it sound like something sung, and the line has a regular beat.\n\nTranslation B uses grand, formal phrases: "Should you depart," "I shall await your return," "until such time as." These are correct, but they sound like a legal document. The added words "your return" also explain what the original only implies.\n\nA does make one change: "till the river\'s gone" replaces "runs dry." The image is a little weaker, since "gone" is vaguer than "dry." Still, the meaning that the singer will wait forever survives.\n\nB is closer in some individual words, keeping "runs dry" and "willow tree." But a song is more than its words; it must be singable and feel spontaneous. A captures the voice of a person in love, while B sounds like a clerk recording a promise. For a song, A is clearly the more faithful translation.',
  },
  {
    task: 'Compare these two translations of a sentence from a speech. Word for word, the original says: "We are not asking for gifts. We are asking for what is ours." Translation A: "We are not asking for charity. We are demanding our rights." Translation B: "We are not asking for gifts. We are asking for what belongs to us."',
    model:
      'Both translations make the speaker\'s point that the people are owed something, but A sharpens the tone into a confrontation, while B keeps the original\'s calm dignity.\n\nThe original repeats "We are asking" in both sentences. Translation B keeps this repetition: "We are not asking for gifts. We are asking for what belongs to us." The parallel structure makes the contrast clear and gives the line a steady, reasonable force, as if the speaker were explaining something obvious.\n\nTranslation A changes the second verb to "demanding." This breaks the repetition and raises the temperature: the speaker is no longer asking at all. It also replaces "what is ours" with "our rights," a political term that names the claim more precisely but sounds more like a slogan.\n\nA\'s first sentence makes a change too. "Charity" carries a sense of pity and inequality that "gifts" does not, so A suggests the speaker is rejecting humiliation, not just generosity.\n\nA is more forceful and might suit a protest banner. But it changes the speaker\'s tone, adding anger the original does not show. B is more faithful, and its calmness may even be more persuasive: by asking politely for what is theirs, the speaker makes the listeners\' refusal look unreasonable.',
  },
  {
    task: 'Compare these two translations of a line from a story. Word for word, the original says: "The village was quiet. Only a dog barked, far away." Translation A: "The village was silent, except for a dog barking somewhere in the distance." Translation B: "The village was quiet. Only a dog barked, far away."',
    model:
      'Both translations describe the same scene, but B keeps the original\'s two-part structure, and that structure is what makes the quiet felt.\n\nThe original has two short sentences. The first sets the scene; the second adds a single sound. Translation B copies this exactly: "The village was quiet. Only a dog barked, far away." The pause created by the full stop lets the silence settle before the bark arrives, and the final phrase "far away," set off by a comma, makes the sound seem to fade.\n\nTranslation A joins the two sentences: "silent, except for a dog barking somewhere in the distance." This is smooth English, but the pause disappears, and the bark becomes a mere exception attached to the description. A also changes "quiet" to "silent," which is stronger and slightly less accurate, since a village with a barking dog is not completely silent.\n\nA\'s phrase "somewhere in the distance" is longer and vaguer than "far away." It loses the original\'s simplicity and the echo-like effect of the short final words.\n\nA reads naturally and would not trouble any reader. But B shows that sometimes the most faithful translation is also the most effective: by keeping the original\'s shape, it keeps the feeling of a still night broken by a single distant sound.',
  },
  {
    task: 'Compare these two translations of a line from a play. Word for word, the original says: "KING: Bring me my crown. I am still the king." Translation A: "KING: Fetch me my crown! I am the king still!" Translation B: "KING: Give me the crown. I\'m still king, you know."',
    model:
      'The two translations create two very different kings: A gives him a proud, commanding voice, while B makes him sound casual and almost uncertain, and A is closer to the original.\n\nIn the original, the king gives a direct command and then a statement of authority. Translation A strengthens both with exclamation marks: "Fetch me my crown! I am the king still!" The old-fashioned "fetch" and the unusual word order "the king still" give the line a formal, royal sound, suitable for a stage.\n\nTranslation B uses everyday speech: "Give me the crown. I\'m still king, you know." The contraction "I\'m" and the added "you know" make the king sound like an ordinary man trying to convince his listeners. The phrase "you know" actually suggests doubt, as if he fears that no one believes him any more.\n\nB also changes "my crown" to "the crown," losing the king\'s sense that it belongs to him personally.\n\nB\'s casual tone could work in a modern production that shows a weakening king. But it adds a meaning the original does not contain. A preserves the king\'s insistence on his own power, which may be all the more dramatic if the audience knows he is losing it. For a faithful translation, A is the better choice.',
  },
  {
    task: "Compare these two translations of the ending of a fable. Word for word, the original says: \"The fox looked at the grapes for a long time, then walked away. 'They are sour,' he said.\" Translation A: \"The fox stared at the grapes for a long time and then walked off. 'They're sour anyway,' he muttered.\" Translation B: \"The fox looked at the grapes for a long time, then walked away. 'They are sour,' he said.\"",
    model:
      'Translation A makes the fox\'s self-deception obvious, while Translation B leaves it for the reader to notice, and B is more faithful to the dry humor of the original.\n\nTranslation B is almost word for word. The fox "looked at the grapes for a long time, then walked away," and then says simply, "They are sour." Because nothing explains his tone, the reader must realize that he is making excuses for his failure. The joke is quiet, and the reader shares it with the storyteller.\n\nTranslation A adds three changes. "Stared" suggests longing more strongly than "looked." "Anyway" makes the fox\'s excuse explicit, since it shows that he is dismissing something he could not get. And "muttered" tells us he is sulking. Together these words turn the fox\'s statement into an obvious complaint.\n\nA\'s changes make the meaning clear for a young reader who might miss the irony, and they make the fox more vivid. But they also spoil the fable\'s economy. Its moral, about pretending that what we cannot have is not worth having, works best when readers discover it for themselves.\n\nFor a picture book for small children, A might be the better choice. For a faithful translation of the fable, B\'s restraint is closer to the original\'s wit.',
  },
  {
    task: 'Compare these two translations of a line from a diary. Word for word, the original says: "Today the bombs fell again. We sat in the cellar and my sister counted." Translation A: "Today the bombs fell again. We sat in the cellar and my sister counted." Translation B: "The bombing started again today, so we hid in the cellar, and my little sister counted the explosions to calm herself."',
    model:
      'Translation A is far stronger than Translation B, because it keeps the diary\'s plainness, and that plainness is what makes the line so disturbing.\n\nThe original records the terror of a bombing in a flat, factual voice. Translation A preserves this exactly: "Today the bombs fell again. We sat in the cellar and my sister counted." The word "again" shows that bombings have become routine, and "sat" suggests helpless waiting. The final phrase, "my sister counted," leaves the reader to wonder what she was counting, and the answer, when we guess it, is chilling.\n\nTranslation B explains everything. It adds "so we hid," "little sister," "the explosions" and "to calm herself." Each addition is reasonable, but together they remove the gaps that make the original powerful. The reader no longer has to imagine; the translator has done it for them.\n\nB also changes "sat" to "hid," which describes the action more dramatically but loses the sense of numbness, and its long sentence loses the diary\'s short, shocked rhythm.\n\nB would help a reader who cannot fill in the meaning. But a diary written in war speaks through what it does not say. A respects the writer\'s voice and trusts the reader, and its silence is more moving than any explanation.',
  },
  {
    task: 'Compare these two translations of a line from a poem about a mountain. Word for word, the original says: "Birds fly high and vanish. One cloud goes away alone. We look at each other, never tired: only the mountain." Translation A: "The birds have flown high and gone; a lonely cloud drifts away. We gaze at each other, never weary, the mountain and I." Translation B: "Birds vanish into the sky. A cloud floats off. Only the mountain and I never tire of looking at each other."',
    model:
      'Both translations capture the poem\'s peaceful companionship between the speaker and the mountain, but A keeps more of the original\'s slow movement, while B makes the ending clearer.\n\nTranslation A follows the order of the original images. The birds "have flown high and gone," a "lonely cloud drifts away," and only then do we read, "We gaze at each other, never weary, the mountain and I." Saving "the mountain and I" for the end creates a small surprise: the reader learns who "we" are only in the last words. The word "lonely" also gives the cloud a human feeling, echoing the speaker\'s own solitude.\n\nTranslation B is more compact. "Birds vanish into the sky. A cloud floats off." The short sentences are clear, but "floats off" is lighter and loses the sense of loneliness. B then states the relationship directly: "Only the mountain and I never tire." This is easier to understand, but the surprise of the ending is gone.\n\nB\'s use of "only" is closer to the original\'s final words, and it stresses that everything else has left.\n\nBoth are good translations. But A better preserves the poem\'s gradual emptying of the sky and the quiet discovery at the end. B explains the poem well; A lets the reader experience it.',
  },
];

/** proposalBank gives the facts of a risk, with costs and an objection, for the student to answer with a proposal. */
const proposalBank: readonly WritingItem[] = [
  {
    task: "Write a proposal to the town council to reduce this risk. Facts: On Mill Road, outside the primary school, 9 children were hit by cars in the last five years, about 2 a year; on similar roads in town the figure is about 1 every five years. Cars average 45 km/h there; the limit is 50. A speed table costs 8,000 dollars; a crossing guard costs 15,000 dollars a year. Some drivers say lower speeds will cause traffic jams.",
    model:
      "To the Town Council: I propose that the council install two speed tables on Mill Road outside the primary school and lower the limit there to 30 km/h during school hours.\n\nOver the last five years, nine children were hit by cars on this stretch of road, about two a year. On similar roads in town, the figure is about one child every five years. The risk outside this school is therefore around ten times higher than elsewhere, and it falls on young children walking to and from class.\n\nSpeed is the main cause we can change. Cars average 45 km/h on Mill Road. A child hit at that speed is far more likely to be seriously injured than one hit at 30 km/h. Two speed tables, at 8,000 dollars each, would cost 16,000 dollars once and slow every car, every day. A crossing guard, at 15,000 dollars a year, would help only at one point and only at certain times, so the tables are better value.\n\nSome drivers worry that lower speeds will cause traffic jams. However, the slower limit would apply only to about four hundred meters and only during school hours. At 30 km/h instead of 45, that stretch would take about sixteen extra seconds.\n\nSixteen seconds is a small price for protecting the children who use this road. I ask the council to approve the speed tables in this year's budget.",
  },
  {
    task: "Write a proposal to the school principal to reduce this risk. Facts: In the school gym, 14 students were injured on the climbing wall last year out of about 600 who used it, mostly from falls when the mats were moved. Thicker fixed mats cost 6,000 dollars. Training two staff members as wall supervisors costs 1,200 dollars. Some teachers want to close the wall entirely.",
    model:
      "To the Principal: I propose that the school replace the movable mats under the climbing wall with thicker fixed mats and train two staff members to supervise the wall.\n\nLast year, fourteen of about six hundred students who used the climbing wall were injured, a rate of roughly two in every hundred. Most injuries happened when students fell onto bare floor because the mats had been moved. The risk is real, but it comes mainly from one fixable cause.\n\nFixed mats, costing about 6,000 dollars, would stay in place under the whole wall, so no student would land on the floor. Training two staff members as supervisors would cost 1,200 dollars and would ensure that someone checks harnesses and limits the number of climbers at once. Together, the measures cost 7,200 dollars, less than the price of one serious injury claim.\n\nSome teachers want to close the wall entirely. I understand their concern, but closing it would remove an activity that hundreds of students enjoy and that builds strength and confidence. Most of the injuries had a single cause, and removing that cause is a better answer than removing the wall.\n\nWith fixed mats and trained supervisors, the climbing wall can remain one of the most popular parts of the gym while becoming much safer. I ask you to include these measures in next term's budget.",
  },
  {
    task: 'Write a proposal to the city health department to reduce this risk. Facts: In the city\'s hot summers, deaths among people over 75 rise from about 10 to about 14 per 100,000 during heat waves. Many live alone in flats without air conditioning. Opening ten libraries as "cool centers" during heat waves would cost 40,000 dollars a summer. A volunteer phone-call program to check on elderly people costs 10,000 dollars. Some officials say the risk is too small to justify spending.',
    model:
      "To the City Health Department: I propose that the city open ten libraries as cool centers during heat waves and fund a volunteer program to telephone elderly people who live alone.\n\nDuring heat waves, deaths among people over seventy-five rise from about ten to about fourteen per one hundred thousand. In a city of our size, that means several additional deaths each summer. Most of those at risk live alone in flats without air conditioning and may not realize how dangerous the heat has become.\n\nOpening ten libraries as cool centers would cost about 40,000 dollars a summer. They already have staff, seating and toilets, so the cost is mainly longer hours and cooling. A volunteer phone program, costing about 10,000 dollars, would call elderly residents during heat waves, remind them to drink water and arrange transport to a center if needed.\n\nSome officials argue that the risk is too small to justify the spending. It is true that the number of deaths per hundred thousand is low. But each of these deaths is likely preventable, and the measures are cheap compared with the cost of hospital care for heat illness.\n\nFor 50,000 dollars a year, the city could protect its most vulnerable residents during its most dangerous weeks. I urge the department to begin both programs before next summer.",
  },
  {
    task: "Write a proposal to the company's managers to reduce this risk. Facts: At the warehouse, about 15 in 100 workers have reported back injuries in the past three years, compared with about 6 in 100 at similar warehouses. Most injuries come from lifting boxes over 25 kg by hand. Lifting machines for each loading area cost 60,000 dollars in total. Training in safe lifting costs 5,000 dollars. Managers worry the machines will slow work.",
    model:
      "To the Managers: I propose that the company buy lifting machines for every loading area and train all warehouse workers in safe lifting.\n\nOver the past three years, about fifteen in every hundred of our workers have reported back injuries. At similar warehouses, the rate is about six in a hundred. Our workers are therefore more than twice as likely to be hurt, and most injuries come from one task: lifting boxes heavier than twenty-five kilograms by hand.\n\nLifting machines for each loading area would cost about 60,000 dollars in total. They would remove the need to lift the heaviest boxes by hand. Training in safe lifting, at about 5,000 dollars, would reduce injuries from the lighter loads that workers will still carry.\n\nSome managers worry that the machines will slow work. At first, workers will need time to learn them. But injuries also slow work: each injured worker misses days or weeks, and others must cover the gaps. Over three years, those absences have likely cost the company more than the machines.\n\nA total of 65,000 dollars is a significant investment, but it is a one-time cost that protects every worker for years. It would also make the company more attractive to new employees. I recommend that the purchase be approved this quarter.",
  },
  {
    task: "Write a proposal to the town's flood committee to reduce this risk. Facts: The town has about a 1 in 50 chance each year of a major river flood, which would affect about 300 homes. The last major flood, 30 years ago, caused 20 million dollars of damage. Raising the river wall would cost 4 million dollars. A flood warning system with sirens and text alerts would cost 200,000 dollars. Some residents say floods are too rare to worry about.",
    model:
      "To the Flood Committee: I propose that the town install a flood warning system now and begin raising the river wall over the next five years.\n\nEach year, the town has about a one in fifty chance of a major river flood. That sounds small, but over thirty years the chance of at least one major flood is roughly forty-five percent. Such a flood would affect about three hundred homes. The last one, thirty years ago, caused twenty million dollars of damage.\n\nA warning system, with sirens and text alerts, would cost about 200,000 dollars. It would not stop water from rising, but it would give families time to move vehicles, valuables and, above all, themselves. Raising the river wall would cost about four million dollars, but it would prevent most of the damage. Spreading that cost over five years makes it affordable.\n\nSome residents say floods are too rare to worry about. It is true that most years will pass without one. But when a flood does come, its cost is enormous: one flood could cost five times as much as the wall. Rare events still happen, and we know this one will happen eventually.\n\nI ask the committee to fund the warning system this year and to approve a five-year plan for raising the wall.",
  },
  {
    task: "Write a proposal to the hospital's board to reduce this risk. Facts: About 4 in 100 patients at the hospital catch an infection during their stay; the national average is about 2.5 in 100. Studies show many infections spread on unwashed hands. Hand-gel stations by every bed cost 30,000 dollars. A program that checks and reports hand-washing rates costs 20,000 dollars a year. Some staff feel they are being blamed.",
    model:
      "To the Hospital Board: I propose that the hospital place hand-gel stations beside every bed and begin a program to check and report hand-washing rates.\n\nAbout four in every hundred of our patients catch an infection during their stay. The national average is about two and a half in a hundred. Our patients therefore face a noticeably higher risk, and infections can lengthen stays, require extra treatment and, in some cases, cause death.\n\nStudies show that many hospital infections spread on unwashed hands. Hand-gel stations beside every bed, costing about 30,000 dollars, would make cleaning hands quick and easy at the moment it matters most. A checking program, at about 20,000 dollars a year, would measure how often staff clean their hands and report the results to each ward.\n\nSome staff feel that such checks blame them. That is not the purpose. Busy nurses and doctors forget for understandable reasons, and the gel stations are meant to make the right action easier. The results would be reported by ward, not by name, and used to improve systems rather than to punish individuals.\n\nIf our infection rate fell to the national average, we would prevent many infections every year and save the cost of extra treatment. I recommend that the board approve both measures.",
  },
  {
    task: "Write a proposal to the city transport office to reduce this risk. Facts: On the new riverside cycle path, 12 of about 40,000 cyclists were hurt last year, mostly at two crossings where the path meets roads. Traffic lights for cyclists at the two crossings would cost 90,000 dollars. Painting the crossings red with warning signs would cost 8,000 dollars. Drivers' groups oppose new traffic lights.",
    model:
      "To the City Transport Office: I propose that the city paint the two riverside crossings red and add warning signs now, and install cycle traffic lights at the busier crossing next year.\n\nLast year, twelve of about forty thousand cyclists using the new riverside path were injured. The overall rate is low, about three in every ten thousand riders, but almost all the injuries happened at the two crossings where the path meets roads. The risk is therefore concentrated in two places that we can improve.\n\nPainting both crossings red and adding warning signs would cost about 8,000 dollars. This would make the crossings clearly visible to drivers and remind cyclists to slow down. Cycle traffic lights at both crossings would cost about 90,000 dollars. Installing one at the busier crossing first would cost about half that and would let the city judge the results.\n\nDrivers' groups oppose new traffic lights, arguing that they slow traffic. This concern is fair, so I suggest the lights change only when a cyclist presses a button, and that they be tested at one crossing before any further decision.\n\nThe riverside path has become one of the city's most popular routes. A small investment now would keep it safe for the tens of thousands who use it. I ask the office to approve the painting and signs this month.",
  },
  {
    task: "Write a proposal to the school board to reduce this risk. Facts: Air near the school, which sits beside a highway, has pollution levels about 40% above the safe limit. Asthma rates at the school are about 12 in 100 students, compared with 8 in 100 in the region. Air filters for all classrooms cost 50,000 dollars. Planting a thick hedge along the highway costs 15,000 dollars. Some parents want the school moved, which would cost millions.",
    model:
      "To the School Board: I propose that the board install air filters in every classroom and plant a thick hedge along the highway side of the school grounds.\n\nThe school sits beside a highway, and air near it has pollution levels about forty percent above the safe limit. About twelve in every hundred of our students have asthma, compared with about eight in a hundred across the region. Pollution is not the only cause of asthma, but it is known to make it worse.\n\nAir filters for all classrooms would cost about 50,000 dollars. Students spend most of the school day indoors, so cleaner classroom air would protect them during the hours when they are most exposed. A thick hedge along the highway, costing about 15,000 dollars, would trap some of the dust and fumes before they reach the playground.\n\nSome parents want the school moved to a cleaner site. That would solve the problem fully, but it would cost millions and take years. The filters and hedge could be in place within months, for a small fraction of the cost.\n\nThese measures will not make the air perfect, but they would reduce the pollution students breathe every day. I recommend that the board approve them now, while it studies longer-term options for the school's location.",
  },
  {
    task: "Write a proposal to the community pool's managers to reduce this risk. Facts: At the community pool, there were 5 near-drownings last summer, all of children under 8, all in the deep end during busy afternoons. There is one lifeguard at a time. A second lifeguard for busy afternoons costs 12,000 dollars a summer. A rope dividing the shallow and deep ends costs 800 dollars. Some families say children should be watched by their parents.",
    model:
      "To the Pool Managers: I propose that the pool install a rope dividing the shallow and deep ends and hire a second lifeguard for busy afternoons.\n\nLast summer there were five near-drownings at our pool. All involved children under eight, all happened in the deep end, and all took place on busy afternoons when one lifeguard was watching a crowded pool. These incidents show a clear pattern, and next time the outcome could be a death.\n\nA rope between the shallow and deep ends costs about 800 dollars. It would mark the deep water clearly and make it harder for young children to drift into it without noticing. A second lifeguard on busy afternoons, costing about 12,000 dollars a summer, would mean that one guard could watch the deep end while the other watches the rest of the pool.\n\nSome families argue that parents, not the pool, should watch their children. Parents certainly have that duty. But on a crowded afternoon, a child can slip under the water in seconds, even while a parent is nearby. Lifeguards are trained to spot the signs that parents may miss.\n\nFor less than 13,000 dollars, the pool could greatly reduce the chance of a tragedy. I urge the managers to approve both measures before the pool opens next summer.",
  },
  {
    task: "Write a proposal to the mayor to reduce this risk. Facts: The city's old bridge is rated safe for loads under 20 tons. Inspectors found that about 30 trucks heavier than 20 tons cross it each day. A weight sensor that photographs heavy trucks and issues fines costs 120,000 dollars. Repairing the bridge to carry 40 tons would cost 6 million dollars. Truck companies say the detour adds 20 minutes.",
    model:
      "To the Mayor: I propose that the city install a weight sensor on the old bridge to identify and fine trucks heavier than twenty tons, and begin planning a full repair.\n\nEngineers rate the old bridge as safe for loads under twenty tons. Inspectors have found that about thirty trucks heavier than that limit cross it every day. Each overweight crossing adds strain to an old structure, and while a collapse is unlikely on any single day, the risk grows with every truck. If it happened, the cost in lives and repairs would be enormous.\n\nA weight sensor that photographs heavy trucks and issues fines would cost about 120,000 dollars. It would make the existing limit effective, since signs alone have clearly not worked. A repair that allowed the bridge to carry forty tons would cost about six million dollars and would take years to plan and fund.\n\nTruck companies object that the detour adds twenty minutes. That is a real cost to them. But the limit exists to protect everyone who uses the bridge, and the companies' time cannot outweigh that safety. If the city later repairs the bridge, the detour will no longer be needed.\n\nI ask the mayor to approve the sensor now and to include the repair in the city's long-term plan, so that the bridge is protected today and fixed for the future.",
  },
  {
    task: "Write a proposal to the sports club's committee to reduce this risk. Facts: In the club's youth football teams, about 3 in 100 players tear a knee ligament each season. Research shows that a 15-minute warm-up program cuts these injuries by about half. Training coaches to run the program costs 2,000 dollars. Some coaches say warm-ups take time away from practice.",
    model:
      "To the Club Committee: I propose that the club adopt a fifteen-minute injury-prevention warm-up for all youth teams and train every coach to run it.\n\nEach season, about three in every hundred of our youth players tear a knee ligament. With more than two hundred young players, that means around six serious injuries a year. A torn ligament can keep a player out for a year, and some never return to the game.\n\nResearch shows that a structured fifteen-minute warm-up, with exercises for balance, landing and strength, cuts these injuries by about half. For our club, that could mean three fewer serious injuries each season. Training coaches to run the program would cost about 2,000 dollars, a small sum for the benefit.\n\nSome coaches say the warm-up takes time away from practice. It does use fifteen minutes. But many of its exercises, such as quick changes of direction, also improve football skills. More importantly, an injured player loses not fifteen minutes of practice but months.\n\nParents trust the club to look after their children. Adopting a proven warm-up is one of the simplest ways to honor that trust. I ask the committee to approve the training and require the program for all youth teams from the start of next season.",
  },
  {
    task: "Write a proposal to the apartment building's owners to reduce this risk. Facts: The 12-story building has smoke alarms that work in only about 60% of flats, according to a recent check. There has been one small kitchen fire in the past year. Replacing all alarms with ten-year sealed alarms costs 9,000 dollars. A fire-safety meeting for residents costs nothing. Some owners say residents should take care of their own alarms.",
    model:
      "To the Building Owners: I propose that the owners replace all smoke alarms in the building with ten-year sealed alarms and hold a fire-safety meeting for residents.\n\nA recent check found that smoke alarms work in only about sixty percent of flats. In a twelve-story building, that means dozens of homes where a fire at night could spread before anyone wakes. The risk of a fire in any one flat is low, but last year's kitchen fire shows that fires do happen here, and in a tall building one fire can endanger everyone.\n\nReplacing every alarm with a ten-year sealed alarm would cost about 9,000 dollars. These alarms need no battery changes, so they cannot be disabled by a flat battery or removed to stop false alarms. A fire-safety meeting, which costs nothing, would explain escape routes and what to do if an alarm sounds.\n\nSome owners argue that residents should look after their own alarms. In principle that is fair, but the check shows that this approach has failed in four flats out of ten. A fire in one of those flats would threaten neighbors who have done everything right.\n\nFor less than the cost of repairing a single burned flat, the owners could ensure that every home has a working alarm. I recommend that the replacement be completed within three months.",
  },
];

/** judgedTopics12b are the second writing topics of grade 12 judged by a model. */
export const judgedTopics12b: readonly TopicDef[] = [
  {
    id: "writing-a-comparison-of-translations",
    title: t("Writing a Comparison of Translations", "写译本比较"),
    summary: t(
      "Write a short essay that compares two translations of the same line, quoting the words that differ, explaining what each difference does, and judging which serves the original better.",
      "写一篇短文，比较同一句话的两种译文，引用不同的词语，解释每种差异的作用，并判断哪种更能体现原文。",
    ),
    prerequisites: after("comparing-translations", "writing-a-comparison-of-two-texts"),
    encompasses: covers(0.2, "comparing-translations"),
    xp: 24,
    strand: "writing",
    criteria: ["g12-translation-claim", "g12-translation-evidence", "g12-translation-judgment"].map(criterion),
    knowledgePoints: [
      point(
        "the-main-difference",
        t("The Main Difference", "主要差异"),
        t(
          "Open with a claim about **the main difference** between the translations and what it does: *Both translations carry the sadness of the original, but B keeps its broken, image-by-image form, while A smooths it into one flowing sentence.* Use the word-for-word gloss to check which translation adds, drops or changes something.",
          "开头提出一个论点，说明两种译文**主要的差异**及其作用：*Both translations carry the sadness of the original, but B keeps its broken, image-by-image form, while A smooths it into one flowing sentence.* 用逐词释义来核查哪种译文增加、删去或改变了什么。",
        ),
        writingGenerator(
          t(
            "Write the comparison in English, opening with a claim about the main difference between the translations and its effect.",
            "用英语写这篇比较，开头提出关于两种译文主要差异及其效果的论点。",
          ),
          translateBank,
          ["g12-translation-claim", "g12-translation-evidence", "g12-translation-judgment"],
          limits,
          onePiece,
        ),
      ),
      point(
        "the-words-that-differ",
        t("The Words That Differ", "不同的词语"),
        t(
          "Then **quote** the words that differ from both translations and explain the effect of each choice on the reader: word choice and connotation, sentence shape and rhythm, meaning added or lost. Give each translation credit for what it does well, and end with a **judgment** of which serves the original, and which reader, better.",
          "然后从两种译文中**引用**不同的词语，并解释每个选择对读者的效果：用词和联想意义、句式和节奏、意义的增减。肯定每种译文做得好的地方，最后**判断**哪种更能体现原文、更适合哪类读者。",
        ),
        writingGenerator(
          t(
            "Write the comparison in English, quoting the words that differ, explaining each effect and ending with a fair judgment.",
            "用英语写这篇比较，引用不同的词语，解释每种效果，并以公正的判断结尾。",
          ),
          translateBank,
          ["g12-translation-evidence", "g12-translation-judgment", "g12-translation-claim"],
          limits,
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-a-proposal-to-reduce-a-risk",
    title: t("Writing a Proposal to Reduce a Risk", "写降低风险的提案"),
    summary: t(
      "Write a proposal that states a risk in absolute numbers, recommends specific measures with their costs, and answers an objection in calm, persuasive words.",
      "写一份提案，用绝对数字陈述风险，提出具体措施及其成本，并用冷静而有说服力的语言回应一个反对意见。",
    ),
    prerequisites: after("explaining-a-risk-clearly", "writing-an-editorial"),
    encompasses: covers(0.2, "explaining-a-risk-clearly"),
    xp: 24,
    strand: "writing",
    criteria: ["g12-proposal-risk", "g12-proposal-plan", "g12-proposal-objection"].map(criterion),
    knowledgePoints: [
      point(
        "the-size-of-the-risk",
        t("The Size of the Risk", "风险有多大"),
        t(
          "Open by stating **what you propose** and to whom. Then show **the size of the risk** with the absolute numbers from the facts, who is affected and how it compares: *Nine children were hit in five years, about two a year; on similar roads the figure is about one every five years.* Keep the words calm and let the numbers do the work.",
          "开头说明**你提议什么**、向谁提议。然后用事实中的绝对数字说明**风险有多大**、谁受影响，以及与什么相比：*Nine children were hit in five years, about two a year; on similar roads the figure is about one every five years.* 措辞保持冷静，让数字说话。",
        ),
        writingGenerator(
          t(
            "Write the proposal in English, stating what you propose and showing the size of the risk with absolute numbers and a comparison.",
            "用英语写这份提案，说明你的提议，并用绝对数字和比较说明风险有多大。",
          ),
          proposalBank,
          ["g12-proposal-risk", "g12-proposal-plan", "g12-proposal-objection"],
          limits,
          onePiece,
        ),
      ),
      point(
        "the-plan-and-the-objection",
        t("The Plan and the Objection", "方案与反对意见"),
        t(
          "Then set out the **measures**, what each would do and what it costs, and explain why they are worth it. State **the objection** in the facts fairly, answer it with reasons and numbers, and end by asking the reader for a specific action by a specific time.",
          "然后列出**措施**，说明每项措施的作用和成本，并解释为什么值得。公正地陈述事实中的**反对意见**，用理由和数字回应它，最后请读者在特定时间前采取特定行动。",
        ),
        writingGenerator(
          t(
            "Write the proposal in English, setting out the measures and their costs, answering the objection fairly and ending with a specific request.",
            "用英语写这份提案，列出措施及其成本，公正地回应反对意见，并以具体的请求结尾。",
          ),
          proposalBank,
          ["g12-proposal-plan", "g12-proposal-objection", "g12-proposal-risk"],
          limits,
          onePiece,
        ),
      ),
    ],
  },
];
