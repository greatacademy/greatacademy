// Grade 7: writing judged by a model, part two: a suspense story, a five-paragraph argument and a persuasive speech.

import { type TopicDef, t } from "@ga/content";
import { point, type WritingItem, writingGenerator } from "@ga/subject-english";
import { after } from "../grade-5/links.ts";
import { checkedPiece, criterion } from "../grade-5/writing-judged-a.ts";

/** limits are the length limits of a grade 7 essay. */
const limits = { minWords: 120, maxChars: 3600 };

/** suspenseBank gives the start of a suspense story. */
const suspenseBank: readonly WritingItem[] = [
  {
    task: "Write a suspense story that begins: The lights in the space station went out one by one.",
    model:
      "The lights in the space station went out one by one. First the hallway, then the lab, then the little window light above Ana's bunk.\n\nShe floated in the dark, listening. The hum of the air fans had stopped. Without them, the air would grow stale in a few hours.\n\nAna switched on her flashlight and pushed herself toward the control room. Her beam swept across empty corridors. Somewhere ahead, metal scraped against metal.\n\nShe stopped. Was someone else awake? The rest of the crew had left on the supply ship two days ago. She was supposed to be alone.\n\nThe scraping came again. Closer.\n\nAna gripped the handrail. She turned the corner. Her light hit a pair of eyes.\n\nThen she laughed. It was Pip, the station's maintenance robot, its arm caught in an open panel, sparks fizzing from a chewed wire. Behind it sat the cause: a small mouse that had stowed away in the last food crate.\n\nAna freed the robot, fixed the wire and watched the lights blink back on, one by one.",
  },
  {
    task: "Write a suspense story that begins: Someone had left a note on Leo's desk, and it was not signed.",
    model:
      'Someone had left a note on Leo\'s desk, and it was not signed. It said only: Meet me in the old music room at four. Come alone.\n\nAll afternoon, Leo could not focus. Who would write that? Was it a joke? A trap?\n\nAt four, the halls were empty. His footsteps echoed past the closed classrooms. The old music room was at the end of the east wing, where no one went anymore since the new building opened.\n\nThe door was open a crack. Inside, it was dim and dusty. Chairs were stacked against the walls, and an old piano stood in the corner, covered with a sheet.\n\n"Hello?" Leo whispered.\n\nNo answer. Then the sheet on the piano moved.\n\nLeo\'s heart hammered. He stepped back toward the door.\n\nThe sheet slid off, and there was Mr. Okafor, the janitor, holding a dusty trumpet. "You\'re the boy who plays in the hallway at lunch," he said, smiling. "This belonged to my father. I think it should be yours."\n\nLeo stared at the trumpet, and slowly, he began to smile too.',
  },
  {
    task: "Write a suspense story that begins: The ice on the lake made a sound like a gunshot.",
    model:
      'The ice on the lake made a sound like a gunshot. Maya froze in the middle of the frozen bay, her skates still.\n\nThe shore was a hundred meters away. Her brother Sam was skating ahead, already halfway back.\n\n"Sam," she called, trying to keep her voice calm. "Stop moving."\n\nA thin black line ran across the ice between them. As she watched, water bubbled up through it.\n\nMaya remembered what their father had taught them: spread your weight. Don\'t stand. Don\'t run.\n\nShe lowered herself slowly onto her stomach. The ice creaked under her. She could feel the cold through her jacket.\n\nSam was lying flat now too, his face white. "What do we do?"\n\n"Crawl," she said. "Toward the shore. Slowly."\n\nInch by inch, they pulled themselves across the ice. Each creak made her stop and hold her breath. The crack spread behind them with a low groan.\n\nAt last, her hand touched frozen reeds. Then mud. Then solid ground.\n\nThey lay on the bank, shaking and laughing, as the ice behind them split wide open.',
  },
  {
    task: "Write a suspense story that begins: The elevator stopped between floors, and the emergency light began to blink.",
    model:
      'The elevator stopped between floors, and the emergency light began to blink. Jonah looked at the only other passenger, an old woman holding a cake box.\n\n"It happens," she said. "They\'ll fix it soon."\n\nJonah pressed the alarm button. Nothing happened. He pressed it again.\n\nThe little speaker crackled. "Stay calm," said a voice. "We\'re working on it." Then it went silent.\n\nMinutes passed. The air grew warm. The woman sat down on the floor and set the cake beside her.\n\nThen there was a sound from above: a slow, heavy creak, like a rope being stretched.\n\nThe elevator dropped.\n\nJonah\'s stomach flew into his throat. The woman screamed. The car fell for one terrible second and then jerked to a stop.\n\nSilence.\n\nAbove them, someone banged on the roof hatch. It opened, and a firefighter\'s face appeared, lit by a headlamp.\n\n"Everybody all right?" he asked.\n\nThe woman stood up, brushed off her coat and held out the box. "Would you like some cake?" she asked. Jonah laughed so hard he could barely climb the ladder.',
  },
  {
    task: "Write a suspense story that begins: The map led to a door in the side of the hill.",
    model:
      "The map led to a door in the side of the hill. It was small and made of old wood, half hidden by ivy.\n\nPriya checked the map again. The faded X was right here. Her grandfather had drawn it, years before he died.\n\nShe pushed the door. It swung open with a long creak. Cold air breathed out of the dark.\n\nHer flashlight showed stone steps going down. She counted them as she went: twenty, twenty-one, twenty-two. The air smelled of earth and rain.\n\nAt the bottom was a tunnel. Water dripped somewhere. Then she heard something else: a soft, steady tapping.\n\nTap. Tap. Tap.\n\nPriya stopped. Her light shook. The tapping was coming from the end of the tunnel.\n\nShe made herself move. One step. Another. The tunnel opened into a small round room, and on a shelf sat an old clock, still ticking.\n\nBeside it lay a letter in her grandfather's handwriting. You found it, it said. I knew you would. This clock was my father's. Keep it running.\n\nPriya held the clock close and climbed back toward the light.",
  },
  {
    task: "Write a suspense story that begins: Halfway across the rope bridge, Daniel heard the first strand snap.",
    model:
      'Halfway across the rope bridge, Daniel heard the first strand snap. The bridge lurched, and he grabbed the side rope with both hands.\n\nBelow him, the river roared over black rocks. Ahead, his guide, Rosa, was already on the far side.\n\n"Don\'t stop!" she shouted. "Keep coming!"\n\nDaniel took a step. The wooden plank under his foot bent. Another strand popped with a sound like a whip.\n\nHe looked back. The near side was just as far. There was no going back now.\n\nHe slid his feet forward, never lifting them, testing each plank before he trusted it. The wind pushed the bridge sideways, and it swung under him like a hammock.\n\nTen meters. Five.\n\nThen the side rope in his right hand went slack.\n\nDaniel threw himself forward. His hands found the last post just as the bridge sagged behind him. Rosa grabbed his wrist and pulled him up onto the rock.\n\nThey sat in silence, watching the broken bridge sway over the water. "Next time," Daniel said at last, "we take the long way."',
  },
  {
    task: "Write a suspense story that begins: The dog would not stop barking at the basement door.",
    model:
      "The dog would not stop barking at the basement door. Biscuit was usually the laziest dog in the world, but tonight she stood with her fur raised, growling.\n\n\"What is it, girl?\" Nia whispered. Her parents were out, and the house was very quiet.\n\nShe put her ear against the door. At first, nothing. Then a scratching sound, slow and steady, from somewhere below.\n\nNia's mouth went dry. She thought about calling her mother. But what would she say? That the dog was barking?\n\nShe opened the door. The stairs disappeared into darkness. She flipped the switch, but the bulb was dead.\n\nWith her phone light in one hand and Biscuit's collar in the other, she went down, one stair at a time.\n\nThe scratching stopped.\n\nAt the bottom, her light found a pile of old boxes. One of them moved.\n\nNia screamed. Biscuit lunged. And out of the box tumbled a tiny gray kitten, mewing in fear.\n\nNia sank onto the bottom step, laughing, as the kitten climbed into her lap and Biscuit licked its head.",
  },
  {
    task: "Write a suspense story that begins: The storm knocked out the radio just as the boat lost sight of land.",
    model:
      'The storm knocked out the radio just as the boat lost sight of land. Waves as tall as houses rolled under the little fishing boat, lifting it high and dropping it hard.\n\nIsla clung to the wheel while her uncle bailed water from the deck. Rain lashed her face so hard she could barely see.\n\n"Which way is home?" she shouted.\n\nHer uncle pointed at the compass. Its needle was swinging wildly.\n\nThen the engine coughed and died.\n\nIn the sudden silence, Isla heard something worse: the deep roar of waves breaking on rocks. Somewhere close.\n\nShe stared into the gray. A shape rose out of the rain: a cliff, black and jagged, and the sea foaming white at its base.\n\n"The oars!" her uncle yelled.\n\nThey rowed with everything they had. The current pulled them toward the rocks. Closer. Closer.\n\nThen, through the rain, a light flashed. Then again. The lighthouse.\n\nIsla knew that light. She knew the gap beside it. She steered toward it, and the boat slid through the calm channel into the harbor, where the whole village stood waiting.',
  },
  {
    task: "Write a suspense story that begins: The museum was supposed to be empty after closing time.",
    model:
      'The museum was supposed to be empty after closing time. That was why Omar had hidden in the coat room: he wanted one night alone with the dinosaurs.\n\nAt first it was wonderful. Moonlight fell through the tall windows onto the giant skeleton in the main hall. Omar walked beneath its ribs, his footsteps echoing.\n\nThen he heard a door close somewhere upstairs.\n\nHe froze behind a display case. Footsteps crossed the balcony above. A flashlight beam swept slowly across the hall.\n\nA guard. If he was caught, his parents would find out, and he\'d be grounded for a year.\n\nThe beam came toward him. Omar crouched lower. The light passed over the case and stopped.\n\n"I can see your shoes," said a voice.\n\nOmar stood up slowly. The guard was an old man with a gray mustache, and he was smiling.\n\n"I did the same thing when I was your age," he said. "Come on. I\'ll show you the best fossil in the building. Then I\'m calling your mother."\n\nOmar decided it was worth it.',
  },
  {
    task: "Write a suspense story that begins: Only one parachute was left on the plane.",
    model:
      'Only one parachute was left on the plane. Kira stared at it, then at her flight instructor, Mr. Hale, who was fighting the controls.\n\nSmoke was pouring from the engine. The little plane shook like a leaf.\n\n"Put it on," Mr. Hale said through his teeth.\n\n"What about you?"\n\n"I\'m going to try to land. Put it on!"\n\nKira buckled the straps with trembling hands. Below them, fields and forests spun past. The engine sputtered, roared and went silent.\n\nIn the quiet, she could hear the wind whistling over the wings.\n\n"There," Mr. Hale said. A long, flat field lay ahead, green against the brown hills.\n\nThe plane glided down, lower and lower. Trees rushed past on either side. Kira gripped her seat.\n\nThe wheels hit. The plane bounced once, twice, and rolled to a stop at the edge of a pond, scattering a flock of geese.\n\nFor a long moment, neither of them spoke. Then Mr. Hale let out a breath. "Lesson one," he said. "Always check the fuel line."\n\nKira unbuckled the parachute she had never needed.',
  },
  {
    task: "Write a suspense story that begins: The footprints in the snow led to the window, but not away from it.",
    model:
      'The footprints in the snow led to the window, but not away from it. Ella stood on the porch in her boots, staring at them.\n\nThey came across the yard, deep and clear, and stopped right under her bedroom window. There were no prints going back.\n\nShe went inside and locked the door. Her heart pounded. Her parents were at the neighbors\' and would not be home for an hour.\n\nShe checked her room. The window was closed. The closet was empty. Under the bed, nothing.\n\nThen she heard it: a soft thump from the attic above.\n\nElla grabbed a flashlight and stood at the bottom of the attic ladder. Thump. Something was moving up there.\n\nShe climbed. One rung. Two. She pushed the hatch open and shone the light inside.\n\nTwo bright eyes stared back at her. A raccoon, fat and startled, sat on a box of old toys. Behind it, a gap in the roof showed where it had climbed in from the tree beside her window.\n\nElla let out a long breath. "You," she said, "are going to be in so much trouble."',
  },
  {
    task: "Write a suspense story that begins: The countdown on the screen read ten minutes, and the door was still locked.",
    model:
      'The countdown on the screen read ten minutes, and the door was still locked. Sofia, Ben and Mateo stood in the escape room, staring at the clues on the wall.\n\n"We need a four-number code," Ben said. "Look for numbers."\n\nThey searched the bookshelf, the painting, the old desk. Nine minutes. Eight.\n\nSofia found a clock with its hands stopped at 3:45. "Three, four, five," she said. "But we need four numbers."\n\nSeven minutes.\n\nMateo pulled open a drawer and found a small key. It opened a box. Inside was a card with a single number: 2.\n\n"Two, three, four, five?" Ben tried the lock. It beeped red.\n\nFive minutes. Four.\n\nSofia stared at the painting. Ships. Lots of ships. She counted them: two at the front, three behind. "The order matters," she said. "Maybe it\'s the clock first, then the card."\n\nThree minutes. Ben\'s fingers shook. Three, four, five, two.\n\nThe lock clicked green. The door swung open.\n\nThey tumbled out laughing, with forty seconds to spare.',
  },
];

/** argumentBank gives a question and notes for a five-paragraph argument. */
const argumentBank: readonly WritingItem[] = [
  {
    task: "Write a five-paragraph argument on this question: Should schools have a four-day week? Notes: saves money on buses and heating; more time for family and rest; some studies show no drop in test scores; but longer school days can tire young students; working parents may need child care on the fifth day.",
    model:
      "Every year, schools look for ways to save money and keep students healthy. A four-day school week would do both. Schools should adopt a four-day week because it saves money and gives students time to rest.\n\nFirst, a four-day week saves money. When schools are closed one extra day, they do not need to run buses or heat the buildings. Those savings can pay for books, teachers and repairs.\n\nSecond, a shorter week gives students more time to rest and be with their families. A long weekend lets tired students recover, and it gives families time for appointments and activities, so students miss fewer school days.\n\nSome people argue that students will learn less. However, some studies show no drop in test scores when schools make each day a little longer. Others worry that working parents will need child care, but schools could offer clubs or tutoring on the fifth day.\n\nIn conclusion, a four-day week saves money and helps students rest without hurting learning. Schools should give it a try.",
  },
  {
    task: "Write a five-paragraph argument on this question: Should students be required to learn a second language? Notes: helps with jobs later; helps understand other cultures; studies show it improves memory and problem solving; but it takes time from other subjects; some students struggle.",
    model:
      "In a world where people travel and work across borders, speaking more than one language is a powerful skill. All students should be required to learn a second language because it opens doors to jobs, builds understanding of other cultures and strengthens the mind.\n\nFirst, a second language helps students find good jobs later in life. Many companies do business around the world and look for workers who can speak with customers in their own language.\n\nSecond, learning a language helps students understand other cultures. When students learn how other people speak, they also learn about their food, holidays and ways of thinking, which builds respect.\n\nThird, studies show that learning a language improves memory and problem solving, skills that help in every subject.\n\nSome people say language classes take time from other subjects, and that some students struggle. However, the skills gained help in those other subjects, and extra support can help students who find it hard.\n\nIn conclusion, a second language prepares students for work, connects them with others and sharpens their minds. Every school should require one.",
  },
  {
    task: "Write a five-paragraph argument on this question: Should cities ban cars from their downtown centers? Notes: less air pollution; streets safer for walkers and cyclists; more space for parks and cafés; but shops may lose customers who drive; harder for people who cannot walk far.",
    model:
      "Downtown streets are often crowded, noisy and dangerous. Cities should ban cars from their downtown centers because it would clean the air, make streets safer and create space for people.\n\nFirst, banning cars would reduce air pollution. Car exhaust fills busy streets with harmful gases. Without cars, the air downtown would be cleaner and healthier to breathe.\n\nSecond, car-free streets would be safer. Walkers and cyclists would no longer have to dodge traffic, so fewer people would be hurt in accidents.\n\nThird, removing cars would free up space. Roads and parking lots could become parks, cafés and places for markets and music, making downtown a place where people want to spend time.\n\nSome worry that shops will lose customers who drive. However, cities that have closed streets to cars often find that more people walk in and shop. Others point out that some people cannot walk far, but cities can provide buses and special services for them.\n\nIn conclusion, a car-free downtown would be cleaner, safer and more welcoming. Cities should make the change.",
  },
  {
    task: "Write a five-paragraph argument on this question: Should zoos exist? Notes: protect endangered animals with breeding programs; teach visitors about wildlife; fund research; but some animals suffer in small spaces; animals belong in the wild.",
    model:
      "Zoos have been part of cities for centuries, but some people now question whether they should exist. Zoos should continue to exist because they protect endangered animals, teach the public and support research.\n\nFirst, zoos protect animals that are in danger of disappearing. Through breeding programs, zoos have helped save species such as the California condor, raising young animals and returning some to the wild.\n\nSecond, zoos teach visitors about wildlife. Seeing a real tiger or elephant helps children and adults care about animals they would never meet otherwise.\n\nThird, zoos pay for research that helps animals in the wild. Scientists study animal health and behavior in zoos and use what they learn to protect animals in their natural homes.\n\nCritics argue that some animals suffer in small spaces and that animals belong in the wild. This concern is fair, but the answer is to give animals larger, better homes, not to close zoos that are saving species.\n\nIn conclusion, zoos protect, teach and discover. With better care for their animals, zoos should continue to exist.",
  },
  {
    task: "Write a five-paragraph argument on this question: Should students wear school uniforms? Notes: reduce bullying over clothes; save families money over time; make mornings easier; but limit self-expression; uniforms can be expensive to buy at first.",
    model:
      "What students wear may seem like a small issue, but it can affect how they feel at school. Schools should require uniforms because they reduce bullying, save families money and make mornings simpler.\n\nFirst, uniforms reduce bullying. When everyone wears the same clothes, students cannot be teased for wearing old or unpopular brands, and the focus shifts to learning.\n\nSecond, uniforms save families money over time. Instead of buying many fashionable outfits, families buy a few uniform pieces that last the whole year.\n\nThird, uniforms make mornings easier. Students do not have to decide what to wear, so they get ready faster and arrive on time.\n\nSome argue that uniforms limit students' self-expression. However, students can still express themselves through their ideas, their art and their activities. Others say uniforms are expensive at first, but schools can offer help or used uniforms for families who need them.\n\nIn conclusion, uniforms make school fairer, cheaper and calmer. Every school should adopt them.",
  },
  {
    task: "Write a five-paragraph argument on this question: Should homework be limited to one hour a night? Notes: students need time for sleep, sports and family; too much homework causes stress; studies show more homework does not always help younger students; but practice helps learning; some subjects need more time.",
    model:
      "Many students spend their evenings buried in homework. Schools should limit homework to one hour a night because students need time to rest, too much homework causes stress, and more homework does not always mean more learning.\n\nFirst, students need time for things other than schoolwork. Sleep, sports, music and family time all help young people grow and stay healthy.\n\nSecond, too much homework causes stress. When students face hours of work every night, many feel anxious and tired, which makes it harder to learn.\n\nThird, studies show that more homework does not always help, especially for younger students. After a certain point, extra work adds little to what students learn.\n\nSome people argue that practice is important and that some subjects need more time. They are right that practice matters, but one focused hour of practice is better than three exhausted ones. Teachers can choose the most useful work.\n\nIn conclusion, a one-hour limit protects students' health and keeps homework useful. Schools should set this limit.",
  },
  {
    task: "Write a five-paragraph argument on this question: Should plastic bags be banned in stores? Notes: plastic bags harm sea animals; take hundreds of years to break down; reusable bags work well; but paper bags also use resources; some people reuse plastic bags.",
    model:
      "Every year, billions of plastic bags are used once and thrown away. Stores should ban plastic bags because they harm animals, last for centuries and can easily be replaced.\n\nFirst, plastic bags harm wildlife. Many end up in rivers and oceans, where turtles mistake them for jellyfish and birds become tangled in them.\n\nSecond, plastic bags take hundreds of years to break down. A bag used for ten minutes can stay in the environment for longer than any of us will live.\n\nThird, there is an easy alternative. Reusable bags are strong, cheap and can be used hundreds of times, so shoppers lose nothing by switching.\n\nSome argue that paper bags also use resources and that people reuse plastic bags at home. However, reusable cloth bags avoid both problems, and the few times a plastic bag is reused do not make up for the harm it does when it is thrown away.\n\nIn conclusion, plastic bags damage the planet and are easily replaced. Stores should ban them.",
  },
  {
    task: "Write a five-paragraph argument on this question: Should every student learn to cook at school? Notes: teaches healthy eating; uses math and science; prepares students to live on their own; but schools need kitchens and money; families can teach cooking at home.",
    model:
      "Many young people leave home without knowing how to cook a simple meal. Every student should learn to cook at school because it teaches healthy eating, uses real skills from other subjects and prepares students for adult life.\n\nFirst, cooking classes teach healthy eating. Students who learn to make fresh meals are less likely to depend on fast food and snacks.\n\nSecond, cooking uses math and science. Measuring ingredients, doubling a recipe and seeing how heat changes food all put classroom lessons to work.\n\nThird, cooking prepares students to live on their own. Knowing how to plan meals and cook them saves money and builds independence.\n\nSome people argue that schools would need kitchens and money, and that families can teach cooking at home. However, not every family has the time to teach, and simple classes can be taught with a few hot plates and basic tools.\n\nIn conclusion, cooking lessons build health, skills and independence. Every school should teach them.",
  },
  {
    task: "Write a five-paragraph argument on this question: Should the voting age be lowered to 16? Notes: 16-year-olds can work and pay taxes; voting young builds a lifelong habit; young people are affected by decisions about schools and climate; but some say they are not mature enough; they may vote like their parents.",
    model:
      "Decisions made by governments shape the lives of young people, yet those under 18 have no vote. The voting age should be lowered to 16 because many 16-year-olds work and pay taxes, voting young builds a habit, and young people are deeply affected by the choices leaders make.\n\nFirst, many 16-year-olds already have adult responsibilities. They can work and pay taxes, so they should have a say in how that money is spent.\n\nSecond, voting at a younger age builds a lifelong habit. People who vote in their first election are more likely to keep voting, and 16-year-olds, who still live at home and attend school, can be encouraged by teachers and families.\n\nThird, young people are affected by decisions about schools, jobs and the climate, sometimes more than anyone.\n\nSome say 16-year-olds are not mature enough or that they will vote like their parents. However, many adults also vote like their families, and studies of places with 16-year-old voters show that young people take the vote seriously.\n\nIn conclusion, 16-year-olds are ready to vote. The voting age should be lowered.",
  },
  {
    task: "Write a five-paragraph argument on this question: Should schools start later in the morning? Notes: teenagers' bodies fall asleep later; tired students learn less; later start reduces car accidents among teen drivers; but buses and parents' work schedules are harder; sports end later.",
    model:
      "Many teenagers arrive at school yawning, struggling to stay awake. Schools should start later in the morning because teenagers' bodies need it, tired students learn less, and well-rested drivers are safer.\n\nFirst, teenagers' bodies are built to fall asleep later than children's or adults'. Making them wake up very early means many get far less sleep than they need.\n\nSecond, tired students learn less. A sleepy brain has trouble paying attention and remembering, so early starts hurt learning.\n\nThird, a later start makes roads safer. In some towns that moved their start times, car accidents among teen drivers went down because students were more alert.\n\nSome point out that later start times make bus routes and parents' work schedules harder, and that sports would end later. These problems are real, but schools can adjust bus routes and schedules, and the gains in health and learning are worth the effort.\n\nIn conclusion, a later start matches how teenagers' bodies work and helps them learn and stay safe. Schools should make the change.",
  },
  {
    task: "Write a five-paragraph argument on this question: Should students have a longer lunch break? Notes: twenty minutes is not enough to eat; students need time to rest and talk with friends; hungry students cannot focus; but a longer lunch makes the school day longer; less time for classes.",
    model:
      "At many schools, students have only twenty minutes for lunch, and much of that time is spent waiting in line. Schools should give students a longer lunch break because students need time to eat, rest and focus.\n\nFirst, twenty minutes is not enough time to eat a proper meal. By the time students get their food, they have only a few minutes left, so many throw much of it away.\n\nSecond, students need a real break in the middle of the day. Time to rest and talk with friends helps them return to class calm and ready to work.\n\nThird, students who do not eat properly cannot focus. A hungry student has trouble concentrating in afternoon classes, so a longer lunch helps learning.\n\nSome argue that a longer lunch would make the school day longer or cut time from classes. However, adding just fifteen minutes would make a large difference, and students who are fed and rested will use their class time better.\n\nIn conclusion, a longer lunch helps students eat, rest and learn. Schools should extend it.",
  },
  {
    task: "Write a five-paragraph argument on this question: Should video games be considered a sport? Notes: players train for hours and compete in teams; tournaments draw millions of viewers; require fast reactions and strategy; but they do not involve physical exercise; some games are violent.",
    model:
      "Every year, millions of people watch players compete in video game tournaments. Video games should be considered a sport because players train seriously, compete in organized events and need real skill.\n\nFirst, top players train like athletes. They practice for hours each day, study their opponents and work in teams with coaches, just as football or basketball players do.\n\nSecond, video game competitions are organized like other sports. There are leagues, tournaments and prizes, and the biggest events draw millions of viewers.\n\nThird, video games require real skill. Players need lightning-fast reactions, careful strategy and teamwork under pressure.\n\nSome argue that video games are not a sport because they do not involve physical exercise. However, sports such as chess and archery are recognized as sports even though they are not very physical. Others point out that some games are violent, but many competitive games, such as racing and football games, are not.\n\nIn conclusion, video games demand training, teamwork and skill. They should be considered a sport.",
  },
];

/** speechBank gives an issue and notes for a persuasive speech. */
const speechBank: readonly WritingItem[] = [
  {
    task: "Write a persuasive speech to your school asking students to help clean up the river. Notes: river full of plastic bottles and bags; fish and birds harmed; cleanup on Saturday, 9 a.m., at the bridge; last year, 50 volunteers filled 200 bags of trash.",
    model:
      "Good morning, everyone. Close your eyes for a moment and picture the river behind our school. Now picture it full of plastic bottles, torn bags and old cans. Sadly, you don't have to imagine it. That is what it looks like today.\n\nLast month, I walked along the bank with my little brother. We found a duck tangled in a plastic bag, struggling to swim. We freed it, but I kept thinking about all the animals no one sees.\n\nThe trash in our river harms fish and birds every day. But we can change that. Last year, just 50 volunteers filled 200 bags of trash in a single morning.\n\nSome of you might think one person can't make a difference. But every bag you fill is one less bag in the water.\n\nSo here is what I am asking. This Saturday, at nine in the morning, meet us at the bridge. Bring gloves and a friend. Let's give our river back to the animals who live there.",
  },
  {
    task: "Write a persuasive speech to the school board asking for a later school start time. Notes: teenagers need 8 to 10 hours of sleep; most get less than 7; schools that started later saw better grades and attendance; start at 8:30 instead of 7:30.",
    model:
      "Members of the board, thank you for listening. Let me ask you a question: how well would you work if you had slept only six hours?\n\nFor many students in this room, that is every morning. Doctors say teenagers need between eight and ten hours of sleep, but most of us get less than seven. Our bodies are made to fall asleep late, and our alarms ring at six.\n\nI am one of those students. Last year, I fell asleep during a math test. I knew the answers, but my brain simply would not work.\n\nThe good news is that this problem has a solution. Schools that have moved their start times later have seen better grades and better attendance.\n\nSome of you may worry about buses or sports schedules. Those are real concerns, but they can be solved. Our health cannot wait.\n\nTonight, I ask you to vote to start school at 8:30 instead of 7:30, beginning next fall. Give us one more hour, and we will give you our best.",
  },
  {
    task: "Write a persuasive speech to your class asking students to vote for a new reading corner. Notes: library is far away; a reading corner with beanbags and 200 books; costs \\$500, raised by a bake sale; students who read more do better in all subjects.",
    model:
      "Hi, everyone. Raise your hand if you have ever wanted to read during free time but the library was too far away. That's a lot of hands.\n\nI have an idea that can fix that: a reading corner, right here in our classroom, with soft beanbags and 200 books we choose ourselves.\n\nWhen I was in fourth grade, my teacher had a reading corner. That's where I found my favorite series, and that's when I started to love reading.\n\nAnd reading does more than make us happy. Students who read more do better in every subject, from science to math.\n\nYou might be wondering how we would pay for it. The corner would cost about \\$500, and we can raise that with a bake sale. If each of us bakes one batch of cookies, we'll be there in a single afternoon.\n\nSo on Friday, when we vote, please vote yes for the reading corner. Then, next week, bring your best cookies. Together, we can build a place where every one of us can fall in love with a book.",
  },
  {
    task: "Write a persuasive speech to your town council asking for a crosswalk near the school. Notes: busy road with no crosswalk; students run across between cars; three near accidents this year; a crosswalk with a light costs less than one accident.",
    model:
      "Good evening, members of the council. My name is Ana, and I am a student at Lincoln Middle School. Every morning, I stand at the edge of Oak Road and wait for a gap in the traffic so I can run across.\n\nThere is no crosswalk on Oak Road, even though hundreds of students cross it every day. Cars speed past, and many students simply dash between them.\n\nThis year, there have been three near accidents. In one, a sixth grader was knocked off his bike by a car that never saw him. He was lucky. Next time, someone may not be.\n\nSome might say a crosswalk with a light is too expensive. But think about the cost of one serious accident: the hospital, the pain, a family's grief. A crosswalk costs far less than that.\n\nI am asking you tonight to approve a crosswalk with a light on Oak Road before the next school year begins. Please don't wait for a tragedy to act. Help us get to school safely.",
  },
  {
    task: "Write a persuasive speech to students asking them to join the school's tree-planting day. Notes: trees give shade and clean air; school yard has almost no shade; planting day is next Friday after school; goal of 30 trees.",
    model:
      "Hello, everyone! Think about the last time you sat outside at lunch in June. Remember how the sun beat down on the hot pavement, and there was nowhere to hide?\n\nOur school yard has almost no shade. That's why the green club is holding a tree-planting day, and we need your help.\n\nTrees do amazing things. They give shade that can make the ground many degrees cooler, and they clean the air we breathe. A tree we plant today could be giving shade to students fifty years from now.\n\nMy grandfather planted an oak tree outside his house when he was my age. Today, I sit under it every summer. That tree is older than my parents.\n\nSome of you may think you don't know how to plant a tree. Don't worry. We'll show you, and it only takes about twenty minutes per tree.\n\nOur goal is 30 trees. So next Friday, after school, come to the back field with a friend. Let's plant a forest of shade that will last longer than any of us.",
  },
  {
    task: "Write a persuasive speech to your school asking students to stop using their phones at lunch for one week. Notes: students sit together but look at screens; talking builds friendships; one school tried a phone-free lunch and students said they were happier; challenge starts Monday.",
    model:
      "Good afternoon, everyone. Look around the cafeteria tomorrow at lunch. You'll see tables full of friends sitting side by side, and almost all of them looking down at their phones.\n\nWe sit together, but we're not really together. Real friendships grow when we talk, laugh and listen to one another.\n\nLast year, a school in our district tried a phone-free lunch for a week. At the end, most students said they felt happier and had made new friends. Some even said it was the best week of the year.\n\nI know what some of you are thinking: what if I miss something important? But your messages will still be there after lunch. The conversation at your table won't.\n\nI tried this myself last month. On the second day, I found out that the girl next to me loves the same band I do. We've been friends ever since.\n\nSo here is my challenge. Starting Monday, for one week, keep your phone in your bag at lunch. Just one week. You might be surprised by what you find when you look up.",
  },
  {
    task: "Write a persuasive speech to your community asking people to adopt pets from the animal shelter. Notes: shelter has 80 dogs and cats waiting; adoption costs less than buying; adopted pets are often already trained; adoption day this Saturday at the community center.",
    model:
      "Good evening, neighbors. Right now, just a few streets from here, 80 dogs and cats are waiting in cages for someone to take them home.\n\nTwo years ago, my family visited the shelter just to look. A shy brown dog named Rusty pressed his nose against the bars and wagged his tail. We took him home that day, and now I can't imagine our house without him.\n\nAdopting a pet is not only kind; it also makes sense. Adoption costs far less than buying a pet from a store, and many shelter animals are already trained and used to people.\n\nSome people believe shelter animals must have something wrong with them. That's simply not true. Most are there because their owners moved or could no longer care for them. They are loving animals who just need a second chance.\n\nThis Saturday, the shelter is holding an adoption day at the community center. Please come, even just to meet the animals. One of them might be waiting for you.",
  },
  {
    task: "Write a persuasive speech to students asking them to give blood at the school's first blood drive for adults and staff, or to encourage family members to give. Notes: one donation can help save up to three lives; hospitals often run short; giving takes about one hour; drive is on March 10 in the gym.",
    model:
      "Good morning, students and teachers. I want to begin with a number: three. One blood donation can help save up to three lives.\n\nLast winter, my uncle was in a car accident. He needed blood during surgery, and it was there for him because strangers had taken the time to give. Those strangers saved his life, and they never even knew his name.\n\nHospitals often run short of blood, especially in winter and summer. When they do, patients have to wait for the help they need.\n\nMost of us are too young to give blood ourselves. But our teachers, our older brothers and sisters and our parents can, and we can encourage them.\n\nSome people are afraid of needles, or they think it takes too long. The truth is, giving blood takes about an hour, and the needle pinch lasts only a second.\n\nOn March 10, our school is holding a blood drive in the gym. Teachers, please sign up at the office. Students, go home tonight and ask one adult to come. One hour of their time could give someone a lifetime.",
  },
  {
    task: "Write a persuasive speech to your class asking students to vote for more recess time. Notes: recess is only 15 minutes; exercise helps the brain focus; students who play outside are less stressed; ask the principal for 30 minutes.",
    model:
      "Hi, everyone. How many of you have ever been in the middle of a great game at recess when the bell rang? It happens every day, because our recess is only fifteen minutes long.\n\nFifteen minutes is barely enough time to get outside, choose teams and start playing.\n\nBut recess is not just about fun. Scientists have found that exercise helps the brain focus. After running and playing, students pay better attention in class and remember more of what they learn.\n\nRecess also helps us feel better. Students who play outside are less stressed and get along better with one another.\n\nSome teachers worry that a longer recess would mean less time for learning. But if a few extra minutes of play help us learn better, then every minute of class will count for more.\n\nSo I'm asking you to vote yes on Friday to send a letter to the principal asking for thirty minutes of recess. Let's show her that we take our learning seriously, and that's exactly why we need time to play.",
  },
  {
    task: "Write a persuasive speech to your community asking people to shop at local stores. Notes: local stores keep money in the town; they create jobs for neighbors; many have closed in the last five years; 'Shop Local Week' starts Monday.",
    model:
      "Good evening, everyone. Think about Main Street when you were younger. Remember the toy shop, the bakery and the bookstore with the cat in the window?\n\nIn the last five years, many of those stores have closed. Today, too many windows on Main Street are empty.\n\nWhen we shop at local stores, our money stays in our town. The baker buys flour from local farms. The bookstore pays local workers. That money helps our schools, parks and neighbors.\n\nLocal stores also create jobs. My older sister got her first job at the hardware store on Elm Street. The owner taught her how to fix things and how to treat customers with respect.\n\nSome people say big online stores are cheaper and more convenient. Sometimes they are. But no website will ever know your name, sponsor your child's football team or help you choose the right paint for your kitchen.\n\nNext week is Shop Local Week. Starting Monday, buy just one thing from a store on Main Street. Together, we can fill those empty windows again.",
  },
  {
    task: "Write a persuasive speech to your school asking students to save energy. Notes: lights and computers often left on in empty rooms; the school pays thousands of dollars a year for wasted energy; savings could buy new sports equipment; start 'Lights Out' week Monday.",
    model:
      "Good morning, everyone. Yesterday after school, I walked down our hallway and counted. Six empty classrooms had their lights on. Four had computers running with no one there.\n\nThat might not seem like much. But it adds up. Our school pays thousands of dollars every year for energy that nobody uses.\n\nNow imagine what we could do with that money. New basketballs. New nets for the soccer field. Maybe even the new art supplies we keep asking for.\n\nSome of you might think that switching off one light doesn't matter. But if every student switched off just one light a day, that would be hundreds of lights every single day.\n\nAt my house, we started turning off lights when we leave a room. In three months, our electricity bill went down by almost a fifth.\n\nSo starting Monday, we're holding Lights Out Week. When you're the last person to leave a room, switch off the lights and the computers. It takes one second. Let's save energy and spend the money on something we'll all enjoy.",
  },
  {
    task: "Write a persuasive speech to students asking them to be kind to new students. Notes: moving to a new school is scary; many new students eat lunch alone; a small act, like an invitation, can make a big difference; start a 'Buddy Bench' this week.",
    model:
      "Hello, everyone. Have you ever walked into a room where you didn't know a single person? Remember how it felt: your heart pounding, your face hot, wishing someone would just say hello?\n\nThat's how new students feel every day at our school.\n\nWhen I moved here two years ago, I ate lunch alone for my first three weeks. I would sit at the end of a table, pretending to read, hoping no one would notice how lonely I was.\n\nThen one day, a girl named Rosa sat down across from me and asked if I liked football. That one question changed everything. We've been best friends ever since.\n\nSome people think new students want to be left alone. Most of them don't. They're just too nervous to make the first move.\n\nThis week, we're starting a Buddy Bench on the playground. If you see someone sitting on it, invite them to join your game. And at lunch, look for anyone sitting alone and ask them one simple question. You could be someone's Rosa.",
  },
];

/** writingJudgedTopics7b are the later writing topics of grade 7 judged by a model. */
export const writingJudgedTopics7b: readonly TopicDef[] = [
  {
    id: "writing-a-suspense-story",
    title: t("Writing a Suspense Story", "写悬疑故事"),
    summary: t(
      "Write a suspense story that builds tension step by step, controls its pace with sentence length and resolves the danger in an ending that follows from the story.",
      "写一个悬疑故事：一步步制造紧张感，用句子长短控制节奏，并在合乎情理的结尾中化解危险。",
    ),
    intro: t(
      "A scraping sound in an empty hallway keeps a reader turning pages far better than announcing *It was scary*. A **suspense story** raises the stakes detail by detail, tightens the sentence rhythm at the climax, and resolves the mystery cleanly.",
      "空走廊里传来的刮擦声，比直说 *It was scary* 更能让读者屏住呼吸。**悬疑故事**靠细节一步步抬高紧张感，在高潮收紧句式节奏，最后给出合乎情理的揭晓。",
    ),
    prerequisites: after("pacing-with-sentence-length", "contrasting-points-of-view"),
    encompasses: [{ topic: "pacing-with-sentence-length", weight: 0.2 }],
    xp: 22,
    strand: "writing",
    criteria: ["g7-suspense-builds", "g7-suspense-pacing", "g7-suspense-ending"].map(criterion),
    knowledgePoints: [
      point(
        "building-the-tension",
        t("Building the Tension", "制造紧张感"),
        t(
          "Suspense thrives on an **unanswered question**: what is making that sound? Will the rope hold? Escalate the danger step by step with concrete sensory clues—a closer footstep, a flickering bulb, a locked latch—delaying the reveal until the climax, then resolving it logically.\n\n> **Watch out.** Do not give away the cause in paragraph two, and do not end with a cheap trick (*It was all a dream*)—build steadily and pay off the clues you planted.",
          "悬念源于一个**悬而未决的问题**：那声音是什么？绳子撑得住吗？用具体的感官细节一步步升级险情——逼近的脚步、闪烁的灯光、锁死的门闩——把答案压到高潮再合理解开。\n\n> **注意。** 既不要第二段就提前泄底，也不要用“原来是一场梦”草草收尾——稳步铺垫并让前面的线索在结尾呼应。",
        ),
        writingGenerator(
          t(
            "Continue the opening in English as a suspense story that builds tension step by step and resolves it at the end.",
            "用英语接着这个开头写一个悬疑故事，一步步制造紧张感，并在结尾化解它。",
          ),
          suspenseBank,
          ["g7-suspense-builds", "g7-suspense-ending", "g7-suspense-pacing"],
          limits,
          checkedPiece(
            "Trace the tension curve in your draft: at least two escalating clues build the mystery before the climax, and the ending resolves the danger cleanly from details already in the story.",
            "检查故事的紧张曲线：高潮前至少有两处层层递进的线索，结尾则顺着前文埋下的细节合理解开悬念。",
          ),
        ),
      ),
      point(
        "pacing-the-climax",
        t("Pacing the Climax", "控制高潮的节奏"),
        t(
          "Sentence length controls the reader's pulse. Stretch out the uneasy wait before the climax with longer, detail-rich sentences; then, as danger hits, snap into **short, punchy sentences**: *Closer. Her light hit a pair of eyes.* Once the climax breaks, relax into longer sentences again.\n\n> **Watch out.** If every sentence in the whole story is short, the climax loses its punch—contrast longer buildup sentences against sharp climax sentences.",
          "句子的长短掌控着读者的心跳。高潮前的不安等待用细节饱满的长句拉慢节奏；危机骤然逼近时切换为**短促利落的短句**：*Closer. Her light hit a pair of eyes.* 高潮过去后，再放缓句式收尾。\n\n> **注意。** 如果通篇都是短句，高潮反而失去爆发力——要把铺垫段的长句和高潮处的短句形成鲜明对比。",
        ),
        writingGenerator(
          t(
            "Continue the opening in English as a suspense story, using short sentences at the climax and longer ones to slow the tense moments.",
            "用英语接着这个开头写一个悬疑故事，在高潮处用短句，在紧张的时刻用长句放慢节奏。",
          ),
          suspenseBank,
          ["g7-suspense-pacing", "g7-suspense-builds", "g7-suspense-ending"],
          limits,
          checkedPiece(
            "Read your buildup and climax aloud: verify that longer sentences stretch the waiting moment while short, sharp sentences accelerate the exact instant of the reveal.",
            "大声读一遍铺垫段和高潮段：确认等待时刻用了较长句子放慢节奏，揭晓瞬间切换成短促有力的短句。",
          ),
        ),
      ),
    ],
  },
  {
    id: "writing-a-five-paragraph-argument",
    title: t("Writing a Five-Paragraph Argument", "写五段式议论文"),
    summary: t(
      "Write an argument in five paragraphs: an introduction ending in a claim, body paragraphs each with one reason and its evidence, an answer to the other side and a conclusion.",
      "写一篇五段式议论文：以论点结尾的引言，每段一个理由及其证据的主体段落，对反方观点的回应，以及结论。",
    ),
    intro: t(
      "Putting every argument move together—hook and thesis, two focused evidence paragraphs, a fair counterclaim and rebuttal, and a resonant conclusion—creates the classic **five-paragraph argument**.",
      "把议论文的所有核心招式合为一体——引子与论点、两段有证据的主体论证、公正的反方与反驳，以及有力的收尾——就构成了经典的**五段式议论文**。",
    ),
    prerequisites: after("relevant-and-sufficient-evidence", "writing-a-counterclaim-paragraph"),
    encompasses: [{ topic: "writing-a-counterclaim-paragraph", weight: 0.2 }],
    xp: 22,
    strand: "writing",
    criteria: ["g7-argument-claim", "g7-argument-evidence", "g6-answers-other-side", "g7-argument-structure"].map(criterion),
    knowledgePoints: [
      point(
        "claim-and-reasons",
        t("The Claim and Its Reasons", "论点及其理由"),
        t(
          "Open with a brief hook and end paragraph one with a **claim** that previews your reasons: *Schools should adopt a four-day week because it saves money and gives students time to rest.* Devote each of the next body paragraphs to **one distinct reason**, backed by concrete evidence and an explanation linking that evidence to the claim.\n\n> **Watch out.** Do not cram two unrelated reasons into a single body paragraph—give each reason its own paragraph with its own evidence and explanation.",
          "第一段用简短引子开场，段尾亮明**论点**并预告理由：*Schools should adopt a four-day week because it saves money and gives students time to rest.* 接下来的每个主体段专注展开**一条独立理由**，配上具体证据以及说明证据如何支持论点的分析。\n\n> **注意。** 别把两条毫不相干的理由塞进同一段——每条理由独占一段，各自配齐证据和解释。",
        ),
        writingGenerator(
          t(
            "Write a five-paragraph argument in English on the question, with a clear claim and one reason with evidence in each body paragraph.",
            "用英语就这个问题写一篇五段式议论文，提出明确的论点，每个主体段落写一个理由及其证据。",
          ),
          argumentBank,
          ["g7-argument-claim", "g7-argument-evidence", "g7-argument-structure"],
          limits,
          checkedPiece(
            "Check your structure paragraph by paragraph: intro ending in a clear claim, body paragraphs each developing one reason with evidence and explanation, a counterclaim paragraph, and a conclusion.",
            "逐段核对文章结构：引言以明确论点收尾，每个主体段围绕一条理由展开并配证据与解释，接着一段回应反方，最后一段总结。",
          ),
        ),
      ),
      point(
        "answering-the-other-side",
        t("Answering the Other Side", "回应反方观点"),
        t(
          "Dedicate a paragraph near the end to the strongest opposing view: introduce it fairly (*Some people argue that…*), then pivot and rebut it with a solid reason or evidence (*However, …*). Finish with a conclusion that restates your claim in fresh words and leaves the reader with a memorable closing thought.\n\n> **Watch out.** Do not introduce brand-new evidence in the conclusion or copy your introduction's claim word for word—restate it freshly and close strong.",
          "在结尾前专门用一段回应对方最有力的反对意见：先公正引出（*Some people argue that…*），再转折并用扎实理由或证据反驳（*However, …*）。最后一段换一种说法重申论点，留下令人印象深刻的收束。\n\n> **注意。** 结尾段既不要塞进全新论据，也不要逐字照抄引言里的论点句——换词重申并有力收尾。",
        ),
        writingGenerator(
          t(
            "Write a five-paragraph argument in English on the question, answering the other side and ending with a conclusion that restates the claim.",
            "用英语就这个问题写一篇五段式议论文，回应反方观点，并以重申论点的结论结束。",
          ),
          argumentBank,
          ["g6-answers-other-side", "g7-argument-structure", "g7-argument-claim"],
          limits,
          checkedPiece(
            "Verify your counterclaim paragraph states a real opposing view fairly and answers it directly, and that your conclusion restates your claim in new words without repeating the opening verbatim.",
            "核对反方段落是否公正陈述并正面反驳了反对观点，结尾段是否用新措辞重申了论点而未照抄开头。",
          ),
        ),
      ),
    ],
  },
  {
    id: "writing-a-persuasive-speech",
    title: t("Writing a Persuasive Speech", "写说服性演讲稿"),
    summary: t(
      "Write a speech that speaks to its listeners: an opening that grabs them, a story and facts that persuade, an answer to doubts and a call to action that tells them what to do.",
      "写一篇面向听众的演讲稿：抓住听众的开头，有说服力的故事和事实，对疑虑的回应，以及告诉他们该做什么的号召。",
    ),
    intro: t(
      "Unlike an essay read silently at a desk, a **persuasive speech** talks straight to a room full of listeners—opening with a vivid picture or question, blending story with proof, and ending with a concrete call to action.",
      "不同于在书桌前默读的议论文，**说服性演讲稿**直接面向满场听众——用生动画面或提问开场，把故事与事实结合起来，最后以具体行动号召收尾。",
    ),
    prerequisites: after("writing-a-call-to-action", "loaded-language"),
    encompasses: [{ topic: "writing-a-call-to-action", weight: 0.2 }],
    xp: 22,
    strand: "writing",
    criteria: ["g7-speech-opening", "g7-speech-moves", "g7-speech-call"].map(criterion),
    knowledgePoints: [
      point(
        "speaking-to-listeners",
        t("Speaking to Listeners", "面向听众"),
        t(
          "A speech is written for the ear. Address your listeners directly (*Good morning, everyone*), hook them with a **question**, a vivid **picture**, or a brief **story**, and combine at least two persuasive moves—such as a human story to make listeners care plus a concrete fact or statistic to prove the point.\n\n> **Watch out.** Do not write a stiff essay with *This paper will prove…*—use direct spoken address (*you*, *we*) and natural, rhythmic sentences meant to be read aloud.",
          "演讲稿是写给耳朵听的。直接面向听众开口（*Good morning, everyone*），用**提问**、生动**画面**或简短**故事**抓住注意力，再结合至少两种说服手法——例如用真实故事打动人心，并用具体事实或数据加以证实。\n\n> **注意。** 别写成板正的书面论文（如 *This paper will prove…*）——要用直接对话听众的口吻（*you*、*we*）和适合朗读的自然节奏。",
        ),
        writingGenerator(
          t(
            "Write a persuasive speech in English from the notes, opening with a question, picture or story and using at least two ways to persuade.",
            "根据笔记用英语写一篇说服性演讲稿，以问题、画面或故事开头，并至少使用两种说服手法。",
          ),
          speechBank,
          ["g7-speech-opening", "g7-speech-moves", "g7-speech-call"],
          limits,
          checkedPiece(
            "Read your opening and middle aloud: confirm you address the audience directly, hook them with a question, picture, or story, and combine at least two distinct persuasive moves.",
            "把开头和主体段朗读一遍：确认直接面向听众说话，用提问、画面或故事开场，并结合了至少两种不同的说服手法。",
          ),
        ),
      ),
      point(
        "ending-with-a-call-to-action",
        t("Ending with a Call to Action", "以号召行动结束"),
        t(
          "Near the end, answer the main doubt your listeners might hold (*Some of you might think…*), then close with a specific **call to action** telling them *what* to do and *when* or *where*: *This Saturday at nine, meet us at the bridge.* Without a clear next step, even a moving speech fades away.\n\n> **Watch out.** Replace vague endings (*Let's all try to do better*) with one concrete action listeners can take right away.",
          "结尾前先回应听众心里可能有的疑虑（*Some of you might think…*），再用具体的**号召行动**收尾，说清*做什么*以及*何时或何地*：*This Saturday at nine, meet us at the bridge.* 没有明确下一步，再动人的演讲也会很快被遗忘。\n\n> **注意。** 把空泛口号（*Let's all try to do better*）换成听众立刻能照做的一件具体行动。",
        ),
        writingGenerator(
          t(
            "Write a persuasive speech in English from the notes, answering a doubt and ending with a clear call to action.",
            "根据笔记用英语写一篇说服性演讲稿，回应一个疑虑，并以明确的号召行动结束。",
          ),
          speechBank,
          ["g7-speech-call", "g7-speech-moves", "g7-speech-opening"],
          limits,
          checkedPiece(
            "Check your closing paragraphs: verify you addressed one listener doubt fairly and ended with a specific action telling listeners what to do and when or where.",
            "核对结尾部分：确认公正回应了一处听众疑虑，并以具体行动号召收尾，明确交代了做什么以及时间或地点。",
          ),
        ),
      ),
    ],
  },
];
