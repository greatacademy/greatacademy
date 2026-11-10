// Writing: the moves of an argument essay, each written by the learner and judged by a model (W5).

import { type CriterionSpec, type Text, type TopicDef, t } from "@ga/content";
import { criterionById, point, type WritingItem, writingGenerator } from "@ga/subject-english";

const criterion = (id: string): CriterionSpec => {
  const found = criterionById(id);
  if (!found) throw new Error(`unknown criterion ${id}`);
  return found;
};

const shown =
  (what: [string, string]) =>
  (model: string): Text =>
    t(`One good ${what[0]}:\n\n> ${model.replaceAll("\n", "\n> ")}`, `一个好的${what[1]}：\n\n> ${model.replaceAll("\n", "\n> ")}`);

/** thesisBank asks for a one-sentence thesis that answers a question of debate. */
const thesisBank: readonly WritingItem[] = [
  {
    task: "Should schools start later in the morning? Write a thesis statement for an essay that answers this question.",
    model: "Schools should start later in the morning, because teenagers who sleep longer learn better and are safer on the way to school.",
  },
  {
    task: "Should students be allowed to use phones during the school day? Write a thesis statement for an essay that answers this question.",
    model: "Students should not use phones during lessons, since phones pull attention away from learning and make it easier to cheat.",
  },
  {
    task: "Should zoos exist? Write a thesis statement for an essay that answers this question.",
    model: "Well-run zoos should exist, because they protect endangered animals and teach visitors to care about the wild.",
  },
  {
    task: "Should every student learn a second language? Write a thesis statement for an essay that answers this question.",
    model: "Every student should learn a second language, because it opens doors to new people, new jobs and new ways of thinking.",
  },
  {
    task: "Should video games count as a sport? Write a thesis statement for an essay that answers this question.",
    model: "Video games should not count as a sport, because sports demand physical effort that games played in a chair do not.",
  },
  {
    task: "Should towns ban plastic shopping bags? Write a thesis statement for an essay that answers this question.",
    model: "Towns should ban plastic shopping bags, because they pollute rivers and oceans while cloth bags do the same job.",
  },
  {
    task: "Should students grade their teachers? Write a thesis statement for an essay that answers this question.",
    model: "Students should be able to grade their teachers, since honest feedback helps teachers improve and gives students a voice.",
  },
  {
    task: "Should schools serve only healthy food? Write a thesis statement for an essay that answers this question.",
    model: "Schools should serve only healthy food, because a good lunch helps students focus and builds habits that last a lifetime.",
  },
];

/** outlineBank asks for the plan of an argument: a thesis, reasons and the evidence for each. */
const outlineBank: readonly WritingItem[] = [
  {
    task: "Write an outline for an essay on whether students should have a longer summer break. Give a thesis, two or three reasons, and evidence or an example for each.",
    model:
      "Thesis: Students should not have a longer summer break.\n1. Students forget what they learned. Evidence: teachers spend the first weeks of autumn reviewing old lessons.\n2. Many families cannot pay for care. Example: parents who work all day must find someone to watch their children.\n3. A shorter break with more short holidays keeps students rested all year. Example: some schools give a week off every two months.",
  },
  {
    task: "Write an outline for an essay on whether cities should build more bicycle lanes. Give a thesis, two or three reasons, and evidence or an example for each.",
    model:
      "Thesis: Cities should build more bicycle lanes.\n1. Bike lanes make cycling safer. Evidence: separated lanes keep riders away from fast traffic.\n2. More cyclists mean cleaner air. Example: every trip by bike is a trip without car fumes.\n3. Cycling keeps people healthy. Example: riding to work gives adults exercise without extra time.",
  },
  {
    task: "Write an outline for an essay on whether students should do community service. Give a thesis, two or three reasons, and evidence or an example for each.",
    model:
      "Thesis: Every student should do some community service.\n1. It helps people in need. Example: students can read to children at the library or clean up a park.\n2. It teaches responsibility. Evidence: volunteers must show up on time and finish what they start.\n3. It helps students find interests. Example: a student who helps at an animal shelter may want to become a vet.",
  },
  {
    task: "Write an outline for an essay on whether homework should be banned in primary school. Give a thesis, two or three reasons, and evidence or an example for each.",
    model:
      "Thesis: Homework in primary school should be limited, not banned.\n1. A little practice at home helps skills stick. Example: reading for twenty minutes each night builds fluency.\n2. Too much homework takes time from play and family. Evidence: young children also learn by playing and talking.\n3. Short homework teaches good habits. Example: packing a bag and finishing a task on time.",
  },
  {
    task: "Write an outline for an essay on whether schools should teach cooking. Give a thesis, two or three reasons, and evidence or an example for each.",
    model:
      "Thesis: Schools should teach every student to cook.\n1. Cooking is a skill for life. Example: everyone needs to feed themselves after leaving home.\n2. Cooking teaches healthy eating. Evidence: people who cook eat less fast food.\n3. Cooking uses other subjects. Example: measuring uses fractions, and recipes use reading.",
  },
  {
    task: "Write an outline for an essay on whether museums should be free. Give a thesis, two or three reasons, and evidence or an example for each.",
    model:
      "Thesis: Museums should be free for everyone.\n1. Free entry lets every family learn. Example: a family with little money can visit as often as a rich one.\n2. More visitors come. Evidence: when a museum drops its price, crowds usually grow.\n3. Museums hold treasures that belong to the public. Example: many works were given to the nation.",
  },
  {
    task: "Write an outline for an essay on whether pets should be allowed in classrooms. Give a thesis, two or three reasons, and evidence or an example for each.",
    model:
      "Thesis: A class pet is good for students.\n1. Caring for a pet teaches responsibility. Example: students take turns feeding the fish and cleaning its tank.\n2. A pet can calm a classroom. Evidence: many teachers say students are quieter when watching an animal.\n3. A pet makes science real. Example: students can observe how a hamster eats, sleeps and grows.",
  },
  {
    task: "Write an outline for an essay on whether students should learn to code. Give a thesis, two or three reasons, and evidence or an example for each.",
    model:
      "Thesis: Every student should learn some coding.\n1. Coding teaches clear thinking. Example: a program only works when each step is in the right order.\n2. Many future jobs will use computers. Evidence: doctors, farmers and artists already use software every day.\n3. Coding lets students build things. Example: a student can make a simple game to share with friends.",
  },
];

/** evidenceBank asks for a paragraph that makes a point, uses evidence from a source, and explains it. */
const evidenceBank: readonly WritingItem[] = [
  {
    task: "Using the passage, write a body paragraph for an essay arguing that schools should have more recess. Make a point, use evidence from the passage, and explain how it supports your point.",
    source:
      "In one school, teachers tried giving students a fifteen-minute break every hour. After a term, they noticed that students fidgeted less in class and finished more of their work. Teachers also reported fewer arguments in the hallways. Students said the breaks helped them clear their heads before the next lesson.",
    model:
      'More recess helps students focus in class. In one school that gave students a fifteen-minute break every hour, teachers saw that students "fidgeted less in class and finished more of their work." This shows that a short break is not time taken away from learning. Instead, it gives students the energy to pay attention when they return, so lessons get more done.',
  },
  {
    task: "Using the passage, write a body paragraph for an essay arguing that towns should plant more trees. Make a point, use evidence from the passage, and explain how it supports your point.",
    source:
      "On a hot afternoon, scientists measured the temperature of two streets in the same city. The street lined with tall trees was about five degrees cooler than the street with none. The shaded street's sidewalks were also cooler to the touch, and fewer people there ran their air conditioners.",
    model:
      'Trees keep a town cooler in the summer. Scientists found that a street lined with tall trees was "about five degrees cooler" than a bare street in the same city. Five degrees can be the difference between a pleasant walk and a dangerous one. Because fewer people on the shaded street needed air conditioners, trees also save energy and money.',
  },
  {
    task: "Using the passage, write a body paragraph for an essay arguing that students should learn to play an instrument. Make a point, use evidence from the passage, and explain how it supports your point.",
    source:
      "A music teacher followed two groups of students for three years. One group took weekly lessons on an instrument and practiced at home. By the end, the students in this group were better at remembering long lists and staying with a hard task. Many of them also said practicing had taught them to be patient.",
    model:
      'Learning an instrument builds habits that help in every subject. A teacher who followed students for three years found that those who practiced an instrument became "better at remembering long lists and staying with a hard task." Remembering and sticking with hard work are exactly what math, science and reading demand. So the patience a student learns at the piano follows them into the classroom.',
  },
  {
    task: "Using the passage, write a body paragraph for an essay arguing that families should eat dinner together. Make a point, use evidence from the passage, and explain how it supports your point.",
    source:
      "A survey asked hundreds of students how often they ate dinner with their families. Students who ate together at least five nights a week were more likely to say they could talk to their parents about a problem. They also tried more kinds of vegetables than students who usually ate alone.",
    model:
      'Family dinners help children talk to their parents. In a survey, students who ate with their families at least five nights a week were "more likely to say they could talk to their parents about a problem." Sitting at the same table every evening gives children a regular, easy time to speak. When something goes wrong, they already have the habit of sharing.',
  },
  {
    task: "Using the passage, write a body paragraph for an essay arguing that schools should keep their libraries open after classes. Make a point, use evidence from the passage, and explain how it supports your point.",
    source:
      "When one school began opening its library for two hours after the last bell, about sixty students came each day. Many said they had no quiet place to work at home. The librarian noticed that more students handed in research projects on time that year.",
    model:
      'An open library after school gives students a place to work. When one school kept its library open for two extra hours, about sixty students came each day, and many said they "had no quiet place to work at home." For these students, the library is not a bonus but the only place to study. That year, more projects came in on time, which shows how much the space helped.',
  },
  {
    task: "Using the passage, write a body paragraph for an essay arguing that people should walk more instead of driving short distances. Make a point, use evidence from the passage, and explain how it supports your point.",
    source:
      "Doctors say that adults should be active for at least thirty minutes on most days. In one town, almost half of all car trips are shorter than two kilometers, a distance most people can walk in about twenty-five minutes.",
    model:
      'Walking short trips is an easy way to stay healthy. Doctors advise adults to be active for "at least thirty minutes on most days," yet almost half of the car trips in one town are under two kilometers. A walk of that length takes about twenty-five minutes, so replacing one short drive a day would almost meet the doctors\' advice. People could get healthier without finding extra time to exercise.',
  },
  {
    task: "Using the passage, write a body paragraph for an essay arguing that schools should grow vegetable gardens. Make a point, use evidence from the passage, and explain how it supports your point.",
    source:
      "After one school planted a vegetable garden, teachers kept track of what students ate at lunch. Students who had helped in the garden were twice as likely to take a salad as those who had not. Several said they wanted to taste the carrots and beans they had grown themselves.",
    model:
      'A school garden gets students to eat more vegetables. At one school, students who helped in the garden were "twice as likely to take a salad" as those who did not. Growing food seems to change how students feel about it: a carrot they planted is something they are curious to taste. A garden teaches healthy eating in a way no poster can.',
  },
  {
    task: "Using the passage, write a body paragraph for an essay arguing that people should spend less time on screens before bed. Make a point, use evidence from the passage, and explain how it supports your point.",
    source:
      "Researchers asked two groups of teenagers to change their evening habits for a month. One group put their phones away an hour before bed; the other kept using them. The first group fell asleep about twenty minutes sooner on average and said they felt more awake in the morning.",
    model:
      'Putting screens away before bed helps people sleep. In one study, teenagers who put their phones away an hour before bed "fell asleep about twenty minutes sooner" than those who kept using them. Twenty minutes each night adds up to more than two hours of sleep a week. Since that group also felt more awake in the morning, a simple habit could improve the whole next day.',
  },
];

/** counterclaimBank asks for a paragraph that states an opposing view fairly and answers it. */
const counterclaimBank: readonly WritingItem[] = [
  {
    task: "Your essay argues that schools should start later in the morning. Write a paragraph that states a counterclaim fairly and then rebuts it.",
    model:
      "Some people argue that a later start would push the end of the school day too late for sports and jobs. This is a fair worry, since practice and part-time work often begin right after school. However, students who are well rested play better and work more safely, and many schools that start later have simply moved practice back by an hour. The benefits of sleep outweigh the trouble of changing a schedule.",
  },
  {
    task: "Your essay argues that students should not use phones during lessons. Write a paragraph that states a counterclaim fairly and then rebuts it.",
    model:
      "Critics say that phones are useful tools for looking up facts and taking photos of the board. It is true that a phone can help a student learn. Yet the same phone also brings games, messages and videos that are hard to ignore. Schools can provide computers for research when a lesson needs them, without the distractions a personal phone carries.",
  },
  {
    task: "Your essay argues that towns should ban plastic shopping bags. Write a paragraph that states a counterclaim fairly and then rebuts it.",
    model:
      "Some shoppers say that plastic bags are cheap and convenient, and a ban would make shopping harder. Plastic bags are certainly easy to carry and cost very little. Even so, their real cost comes later, when they clog drains and harm animals in rivers and oceans. Once people get used to bringing cloth bags, shopping is just as easy as before.",
  },
  {
    task: "Your essay argues that every student should learn a second language. Write a paragraph that states a counterclaim fairly and then rebuts it.",
    model:
      "Others believe that time spent on a second language would be better spent on math or science. Those subjects matter, and school time is limited. However, learning a language also trains memory and attention, skills that help in math and science too. A second language does not take away from other subjects; it supports them.",
  },
  {
    task: "Your essay argues that zoos should exist. Write a paragraph that states a counterclaim fairly and then rebuts it.",
    model:
      "Some people argue that keeping wild animals in cages is cruel. In the past, many zoos did keep animals in small, bare spaces. Still, good zoos today give animals large habitats and care from trained vets. They also breed endangered animals that might otherwise disappear from the world entirely.",
  },
  {
    task: "Your essay argues that schools should serve only healthy food. Write a paragraph that states a counterclaim fairly and then rebuts it.",
    model:
      "Critics say students will refuse healthy food and go hungry instead. It is true that some students like sweets and fried food better. However, schools that serve healthy meals often find that students get used to them within weeks, especially when the food is cooked well. A school's job is to help students grow, and that includes what they eat.",
  },
  {
    task: "Your essay argues that students should be able to grade their teachers. Write a paragraph that states a counterclaim fairly and then rebuts it.",
    model:
      "Some teachers worry that students would give low grades to teachers who are strict or give a lot of homework. This could happen, since students do not always enjoy what is good for them. However, the grades could ask about clear things, such as whether lessons are explained well, and a school would look at the patterns across many students. Honest answers from a whole class are hard to ignore and easy to learn from.",
  },
  {
    task: "Your essay argues that video games should not count as a sport. Write a paragraph that states a counterclaim fairly and then rebuts it.",
    model:
      "Supporters of video games point out that top players train for hours, compete in teams and win prizes, just like athletes. They are right that gaming takes skill and practice. Yet chess also takes skill and practice, and few people call it a sport. What makes a sport is physical effort, and sitting in a chair moving a controller does not demand the strength or fitness that running or swimming does.",
  },
];

/** introBank asks for an introduction that catches the reader's interest and ends on a thesis. */
const introBank: readonly WritingItem[] = [
  {
    task: "Write the introduction of an essay arguing that cities should build more bicycle lanes.",
    model:
      "Every morning, thousands of cars crawl through city traffic, each carrying just one person. Many of those trips are short enough to make by bike, yet riders often feel unsafe on busy roads. Cities should build more bicycle lanes, because safe lanes would cut traffic, clean the air and help people stay healthy.",
  },
  {
    task: "Write the introduction of an essay arguing that students should do community service.",
    model:
      "Imagine a park full of litter, and then imagine it clean after one afternoon of work by a class of students. Small acts like this change neighborhoods. Every student should do some community service, because it helps people in need, teaches responsibility and helps students discover what they care about.",
  },
  {
    task: "Write the introduction of an essay arguing that museums should be free.",
    model:
      "A painting that hangs in a national museum may have been seen by millions, but many families have never stood in front of it. For them, the price of a ticket is a wall. Museums should be free for everyone, because the treasures they hold belong to the public and should be open to all.",
  },
  {
    task: "Write the introduction of an essay arguing that schools should teach cooking.",
    model:
      "Most students leave school able to solve equations, but many cannot cook a simple meal. As a result, they rely on fast food and snacks. Schools should teach every student to cook, because it is a skill for life that also teaches healthy eating and puts other subjects to use.",
  },
  {
    task: "Write the introduction of an essay arguing that schools should start later in the morning.",
    model:
      "At seven in the morning, many teenagers are sitting in class with their eyes half closed. Their bodies are still asking for sleep. Schools should start later, because students who sleep longer learn better, feel better and travel to school more safely.",
  },
  {
    task: "Write the introduction of an essay arguing that towns should plant more trees.",
    model:
      "On the hottest day of summer, people cross the street to walk in the shade of a single tree. That shade is more than a comfort. Towns should plant more trees, because trees cool streets, clean the air and make neighborhoods better places to live.",
  },
  {
    task: "Write the introduction of an essay arguing that every student should learn a second language.",
    model:
      "Hello, hola, nǐ hǎo: one greeting can open a conversation with someone from the other side of the world. Yet many students finish school able to speak only one language. Every student should learn a second language, because it opens doors to new people, new jobs and new ways of thinking.",
  },
  {
    task: "Write the introduction of an essay arguing that towns should ban plastic shopping bags.",
    model:
      "A plastic bag is used for about twenty minutes, but it can last in the ocean for hundreds of years. Every week, a single town throws away thousands of them. Towns should ban plastic shopping bags, because they pollute rivers and seas while cloth bags do the same job without the harm.",
  },
];

/** conclusionBank asks for a conclusion that restates a thesis in new words and leaves a final thought. */
const conclusionBank: readonly WritingItem[] = [
  {
    task: "Write the conclusion of an essay whose thesis is: Cities should build more bicycle lanes, because safe lanes cut traffic, clean the air and keep people healthy.",
    model:
      "Bicycle lanes are a small change to a street that can make a big change to a city. They take cars off the road, leave the air cleaner and turn a daily trip into exercise. If cities want to be healthier places to live, painting a few lines on the road is a good place to start.",
  },
  {
    task: "Write the conclusion of an essay whose thesis is: Every student should do some community service, because it helps people, teaches responsibility and helps students find their interests.",
    model:
      "Community service gives as much to students as it gives to the people they help. Volunteers learn to keep their promises, and some find the work they want to do for life. A few hours a month could turn a school full of students into a town full of helpers.",
  },
  {
    task: "Write the conclusion of an essay whose thesis is: Schools should start later in the morning, because rested students learn better and are safer on the way to school.",
    model:
      "Starting school an hour later would cost little and give students the sleep their bodies need. Rested students pay more attention in class and travel more safely in daylight. It is time for schools to build their schedules around how students actually learn best.",
  },
  {
    task: "Write the conclusion of an essay whose thesis is: Museums should be free for everyone, because their treasures belong to the public.",
    model:
      "When a museum opens its doors for free, it tells every family that history and art belong to them too. More people visit, more children are inspired, and the treasures do the job they were saved for. A free museum is an investment in everyone's education.",
  },
  {
    task: "Write the conclusion of an essay whose thesis is: Schools should serve only healthy food, because good lunches help students focus and build lasting habits.",
    model:
      "What students eat at noon shapes how they learn in the afternoon and how they eat for the rest of their lives. Healthy school meals give them energy now and good habits later. Schools teach students so much already; teaching them to eat well should be part of the lesson.",
  },
  {
    task: "Write the conclusion of an essay whose thesis is: Every student should learn a second language, because it opens doors to new people, jobs and ways of thinking.",
    model:
      "A second language is more than a school subject; it is a key to other people and places. It helps students find work, make friends across borders and think in new ways. In a world that grows more connected every year, no student should be left with only one key.",
  },
  {
    task: "Write the conclusion of an essay whose thesis is: Towns should ban plastic shopping bags, because they pollute rivers and oceans while cloth bags do the same job.",
    model:
      "Plastic bags are convenient for a few minutes and harmful for centuries. A ban would keep them out of our rivers and seas, and cloth bags would carry our shopping just as well. The habit of bringing a bag is easy to learn, and the water we save it for is not easy to clean.",
  },
  {
    task: "Write the conclusion of an essay whose thesis is: Towns should plant more trees, because trees cool streets, clean the air and make neighborhoods better places to live.",
    model:
      "A tree planted today will shade a sidewalk for a hundred years. Along the way, it will cool hot streets, clean the air and give every neighborhood a little more life. Towns that plant trees now are giving a gift to people who have not even been born yet.",
  },
];

/** revisionBank gives a weak paragraph, names its problem, and asks for a revision that fixes it. */
const revisionBank: readonly WritingItem[] = [
  {
    task: "This body paragraph gives no evidence for its point. Revise it so that it supports the point with a specific example or fact.",
    source:
      "Recycling is good for the environment. It helps the planet a lot. Everyone should do it because it is good. The environment needs our help.",
    model:
      "Recycling is good for the environment. Recycling one ton of paper saves trees that would otherwise be cut down, and recycled aluminum cans can be back on a shop shelf within weeks. Every bottle and can we recycle is one less piece of trash buried in the ground. Small choices like these add up to a cleaner planet.",
  },
  {
    task: "This body paragraph wanders off its point. Revise it so that every sentence supports the topic sentence.",
    source:
      "Dogs make loyal companions. My dog waits by the door every day until I come home from school. My cousin has a parrot that can say ten words. When I am sad, my dog sits beside me. Parrots can live for fifty years.",
    model:
      "Dogs make loyal companions. My dog waits by the door every day until I come home from school. When I am sad, he sits beside me and rests his head on my knee. Wherever I go in the house, he follows, as if he wants to make sure I am never alone.",
  },
  {
    task: "This body paragraph repeats its evidence without explaining it. Revise it so that it explains how the evidence supports the point.",
    source:
      "Students should get more sleep. A study found that students who slept nine hours did better on tests. Students who slept nine hours did better on tests than students who slept six hours. That is what the study found.",
    model:
      "Students should get more sleep. A study found that students who slept nine hours did better on tests than those who slept six. This suggests that sleep is not wasted time: the brain uses it to store what was learned during the day. A student who stays up late to study may actually remember less than one who goes to bed.",
  },
  {
    task: "This body paragraph has no clear topic sentence. Revise it so that it opens with a sentence stating its main point.",
    source:
      "Many students walk to school along Main Street. There is no crosswalk near the school gate. Last month, a car almost hit a student there. Cars often drive fast on that road.",
    model:
      "Our town needs a crosswalk at the school gate on Main Street. Many students walk to school along this road, where cars often drive fast. There is no crosswalk near the gate, and last month a car almost hit a student. A crosswalk would make the walk to school safe for everyone.",
  },
  {
    task: "This body paragraph uses only vague words. Revise it so that it uses specific, precise words and details.",
    source:
      "The field trip was really good. We saw a lot of nice things at the place. The stuff there was interesting. Everyone had a good time.",
    model:
      "Our field trip to the science museum was the best day of the year. We touched a meteorite that fell to Earth thousands of years ago and watched a robot arm build a tower of blocks. In the planetarium, the whole sky turned to stars above our heads. On the bus home, no one could stop talking about what we had seen.",
  },
  {
    task: "This body paragraph gives its ideas in a confusing order. Revise it so that the ideas follow a clear order with transitions.",
    source:
      "Finally, we put the tent up. We drove for three hours to reach the campsite. Before leaving, we packed the car. We chose a flat spot near the lake when we arrived.",
    model:
      "Our camping trip began early in the morning. First, we packed the car with the tent, food and sleeping bags. Then we drove for three hours to reach the campsite. When we arrived, we chose a flat spot near the lake. Finally, we put the tent up just before the sun went down.",
  },
  {
    task: "This body paragraph has no closing sentence and stops suddenly. Revise it so that it ends by bringing the reader back to its point.",
    source:
      "Our town should open a skate park. Right now, skaters use the parking lot behind the shops, where cars come and go. A skate park would give them a safe place with ramps built for skating.",
    model:
      "Our town should open a skate park. Right now, skaters use the parking lot behind the shops, where cars come and go all day. A skate park would give them a safe place with ramps built for skating, away from traffic. Building one would protect young people and give them a place in the town that is truly theirs.",
  },
  {
    task: "This body paragraph gives an opinion with no reasons. Revise it so that it supports the opinion with at least two reasons.",
    source:
      "I think our school should have a music club. A music club would be great. Lots of schools have clubs. We should definitely have one.",
    model:
      "Our school should start a music club. Many students play instruments at home but have no one to play with, and a club would let them form bands and learn from each other. Concerts by the club could also raise money for new instruments for the school. A music club would give students a place to share a talent that now stays hidden.",
  },
];

const thesisCriteria = ["w5-thesis-position", "w5-thesis-reasons"];
const outlineCriteria = ["w5-outline-thesis", "w5-outline-reasons", "w5-outline-evidence"];
const evidenceCriteria = ["w4-topic-sentence", "w5-uses-source", "w5-explains-evidence"];
const counterCriteria = ["w5-states-counterclaim", "w5-rebuts"];
const introCriteria = ["w5-intro-hook", "w5-intro-thesis"];
const conclusionCriteria = ["w5-conclusion-restates", "w5-conclusion-final-thought"];
const revisionCriteria = ["w5-revision-fixes", "w5-revision-keeps-point"];

/**
 * judgedEssayTopics are the moves of an argument essay, each written and judged
 * on its own, so that every one can be judged reliably. A learner for whom no
 * route qualifies does not get them.
 */
export const judgedEssayTopics: readonly TopicDef[] = [
  {
    id: "writing-a-thesis-statement",
    title: t("Writing a Thesis Statement", "写论点句"),
    summary: t(
      "Answer a question of debate in one sentence that takes a side and says why.",
      "用一句话回答一个有争议的问题：表明立场，并说明理由。",
    ),
    prerequisites: ["claims", "writing-an-opinion-paragraph"],
    encompasses: [{ topic: "claims", weight: 0.4 }],
    xp: 14,
    criteria: thesisCriteria.map(criterion),
    knowledgePoints: [
      point(
        "a-position-and-its-reasons",
        t("A Position and Its Reasons", "立场及其理由"),
        t(
          "The **thesis statement** is the one sentence an argument essay sets out to prove. It takes a side that a reasonable person could disagree with, and it names the main reasons the essay will give.\n\n*Phones are common in schools* is a fact, not a thesis: nobody argues with it. *Phones should be banned in lessons, because they distract students and make cheating easy* takes a side and gives two reasons, each of which can become a body paragraph.",
          "**论点句**（thesis statement）是议论文要证明的那一句话。它表明一个讲道理的人也可能不同意的立场，并点出文章将给出的主要理由。\n\n*Phones are common in schools* 是事实，不是论点：没有人会反驳它。*Phones should be banned in lessons, because they distract students and make cheating easy* 表明了立场并给出两个理由，每个理由都能写成一个主体段落。",
        ),
        writingGenerator(
          t(
            "Write one sentence in English that takes a side on the question and names your main reasons.",
            "用英语写一句话：对这个问题表明立场，并点出你的主要理由。",
          ),
          thesisBank,
          thesisCriteria,
          { minWords: 10, maxChars: 400 },
          shown(["thesis statement", "论点句"]),
        ),
      ),
    ],
  },
  {
    id: "outlining-an-argument",
    title: t("Outlining an Argument", "列论证提纲"),
    summary: t(
      "Plan an essay before drafting it: a thesis, the reasons that support it, and evidence for each reason.",
      "动笔前先规划文章：论点、支持它的理由，以及每个理由的论据。",
    ),
    prerequisites: ["writing-a-thesis-statement", "evidence"],
    encompasses: [
      { topic: "writing-a-thesis-statement", weight: 0.3 },
      { topic: "evidence", weight: 0.3 },
    ],
    xp: 16,
    criteria: outlineCriteria.map(criterion),
    knowledgePoints: [
      point(
        "planning-the-reasons",
        t("Planning Reasons and Evidence", "规划理由和论据"),
        t(
          "An outline is the skeleton of an essay. Write the thesis at the top. Under it, list two or three **reasons**, each one different and each one a reason for the thesis. Under every reason, note the **evidence** you will use: a fact, an example or an expert's words.\n\nIf a reason has no evidence you can name, it is not ready, and the outline shows you that before you have written a single paragraph.",
          "提纲是文章的骨架。把论点写在最上面。在它下面列出两三个**理由**，每个理由各不相同，而且都能支持论点。在每个理由下面，注明你要用的**论据**：一个事实、一个例子或专家的话。\n\n如果某个理由举不出论据，它就还没准备好；提纲能让你在写出任何段落之前就发现这一点。",
        ),
        writingGenerator(
          t(
            "Write an outline in English: a thesis, two or three reasons, and evidence or an example under each reason.",
            "用英语写一份提纲：论点、两三个理由，以及每个理由下面的论据或例子。",
          ),
          outlineBank,
          outlineCriteria,
          { minWords: 40, maxChars: 2000 },
          shown(["outline", "提纲"]),
        ),
      ),
    ],
  },
  {
    id: "writing-an-evidence-paragraph",
    title: t("Writing a Body Paragraph with Evidence", "写有论据的主体段落"),
    summary: t(
      "Make a point, support it with evidence from a source, and explain how the evidence proves the point.",
      "提出观点，用来源中的论据支持它，并解释论据怎样证明观点。",
    ),
    prerequisites: ["outlining-an-argument", "reasoning"],
    encompasses: [
      { topic: "reasoning", weight: 0.4 },
      { topic: "outlining-an-argument", weight: 0.2 },
    ],
    xp: 20,
    criteria: evidenceCriteria.map(criterion),
    knowledgePoints: [
      point(
        "point-evidence-explanation",
        t("Point, Evidence, Explanation", "观点、论据、解释"),
        t(
          "A strong body paragraph does three things. It opens with a **point** that supports the thesis. It gives **evidence** from a source: quote the exact words in quotation marks, or put them closely in your own. Then it **explains** the evidence: why does it prove the point? Explaining is the step most often skipped, and it is the one that shows your thinking.\n\nEvidence alone, *The study found that students slept better*, leaves the reader to guess. Add the link: *This shows that...*, *Because of this...*, *This matters because...*.",
          "一个有力的主体段落要做三件事。开头提出支持论点的**观点**。给出来源中的**论据**：用引号引用原话，或用自己的话准确转述。然后**解释**论据：它为什么能证明观点？解释是最常被省略的一步，也正是展示你思考的一步。\n\n只有论据，例如 *The study found that students slept better*，读者只能自己去猜。要加上联系：*This shows that...*、*Because of this...*、*This matters because...*。",
        ),
        writingGenerator(
          t(
            "Read the passage, then write a body paragraph in English: a point, evidence from the passage, and an explanation of how the evidence supports the point.",
            "阅读文段，然后用英语写一个主体段落：观点、来自文段的论据，以及论据怎样支持观点的解释。",
          ),
          evidenceBank,
          evidenceCriteria,
          { minWords: 50, maxChars: 2000 },
          shown(["body paragraph", "主体段落"]),
        ),
      ),
    ],
  },
  {
    id: "writing-a-counterclaim-paragraph",
    title: t("Writing a Counterclaim Paragraph", "写反方观点段落"),
    summary: t(
      "State the strongest view against your own fairly, then answer it with a reason.",
      "公正地陈述反对你的最有力的观点，再用理由回应它。",
    ),
    prerequisites: ["counterclaims-and-rebuttals", "writing-an-evidence-paragraph"],
    encompasses: [
      { topic: "counterclaims-and-rebuttals", weight: 0.4 },
      { topic: "writing-an-evidence-paragraph", weight: 0.2 },
    ],
    xp: 20,
    criteria: counterCriteria.map(criterion),
    knowledgePoints: [
      point(
        "answering-the-other-side",
        t("Answering the Other Side", "回应另一方"),
        t(
          "Readers who disagree with you are more likely to listen if you show that you understand them. Introduce the opposing view with *Some people argue*, *Critics say* or *Others believe*, and state it fairly, as its supporters would. You may admit what is true in it.\n\nThen turn with *However*, *Yet* or *Even so*, and give a **reason or evidence** why your claim still holds. Simply saying the other side is wrong is not a rebuttal.",
          "如果你表现出理解反对你的读者，他们就更愿意听你说。用 *Some people argue*、*Critics say* 或 *Others believe* 引出反方观点，并像它的支持者那样公正地陈述它。你可以承认其中正确的部分。\n\n然后用 *However*、*Yet* 或 *Even so* 转折，给出你的论点仍然成立的**理由或论据**。只说对方错了，不算反驳。",
        ),
        writingGenerator(
          t(
            "Write a paragraph in English that states a counterclaim fairly and then rebuts it with a reason or evidence.",
            "用英语写一个段落：公正地陈述一个反方观点，再用理由或论据反驳它。",
          ),
          counterclaimBank,
          counterCriteria,
          { minWords: 45, maxChars: 2000 },
          shown(["paragraph", "段落"]),
        ),
      ),
    ],
  },
  {
    id: "introductions-and-conclusions",
    title: t("Introductions and Conclusions", "开头与结尾"),
    summary: t(
      "Open an essay by drawing the reader in and stating the thesis; close it by restating the thesis and leaving a final thought.",
      "开头吸引读者并提出论点；结尾重申论点，并留下最后的思考。",
    ),
    prerequisites: ["writing-a-thesis-statement"],
    encompasses: [{ topic: "writing-a-thesis-statement", weight: 0.4 }],
    xp: 18,
    criteria: [...introCriteria, ...conclusionCriteria].map(criterion),
    knowledgePoints: [
      point(
        "writing-an-introduction",
        t("Writing an Introduction", "写开头"),
        t(
          "An introduction moves from the reader's world to the essay's claim. It opens with a **hook**: a striking fact, a short scene, or a question that makes the reader care. A sentence or two of background follows. The thesis comes last, so the reader ends the introduction knowing exactly what the essay will prove.\n\nAvoid announcing the essay, as in *In this essay I will talk about bikes*: start with the subject itself.",
          "开头把读者从他们的世界带到文章的论点。它以一个**引子**（hook）开始：一个惊人的事实、一个简短的场景，或一个让读者关心的问题。接着用一两句交代背景。论点放在最后，让读者读完开头就确切知道文章要证明什么。\n\n不要宣布式开头，例如 *In this essay I will talk about bikes*：要直接从话题本身写起。",
        ),
        writingGenerator(
          t(
            "Write the introduction in English: a hook, a little background, and a thesis at the end.",
            "用英语写开头：引子、少量背景，最后是论点。",
          ),
          introBank,
          introCriteria,
          { minWords: 35, maxChars: 1500 },
          shown(["introduction", "开头"]),
        ),
      ),
      point(
        "writing-a-conclusion",
        t("Writing a Conclusion", "写结尾"),
        t(
          "A conclusion moves the other way, from the essay back to the reader's world. It restates the thesis **in new words** and sums up the reasons briefly, without new evidence. Then it leaves a **final thought**: why the issue matters, what should happen next, or what the future could look like.\n\nCopying the thesis word for word, or ending with *That is the end of my essay*, wastes the last thing the reader sees.",
          "结尾方向相反，从文章回到读者的世界。它**换一种说法**重申论点，并简要总结理由，不再加入新的论据。然后留下**最后的思考**：这个问题为什么重要、接下来应该怎么做，或者未来可能是什么样子。\n\n逐字照抄论点，或以 *That is the end of my essay* 收尾，都浪费了读者最后看到的地方。",
        ),
        writingGenerator(
          t(
            "Write the conclusion in English: restate the thesis in new words, then leave a final thought.",
            "用英语写结尾：换一种说法重申论点，然后留下最后的思考。",
          ),
          conclusionBank,
          conclusionCriteria,
          { minWords: 35, maxChars: 1500 },
          shown(["conclusion", "结尾"]),
        ),
      ),
    ],
  },
  {
    id: "revising-a-draft",
    title: t("Revising a Draft", "修改草稿"),
    summary: t(
      "Find what a draft paragraph is missing and rewrite it so it does its job, keeping its point.",
      "找出草稿段落缺少什么，改写它使其发挥作用，同时保留它的观点。",
    ),
    prerequisites: ["writing-an-evidence-paragraph"],
    encompasses: [{ topic: "writing-an-evidence-paragraph", weight: 0.3 }],
    xp: 20,
    criteria: revisionCriteria.map(criterion),
    knowledgePoints: [
      point(
        "fixing-what-is-missing",
        t("Fixing What Is Missing", "补上缺少的部分"),
        t(
          "Revising is more than fixing spelling. Read the draft as a stranger would, and ask what stops it from working: no clear topic sentence, a sentence off the point, evidence with no explanation, vague words, or ideas out of order. Then rewrite to fix that problem, while keeping the paragraph's point.\n\nA revision may add, cut, move or replace whole sentences. Correcting a few words is editing, and it rarely fixes a paragraph that does not work.",
          "修改不只是改拼写。像陌生人一样读草稿，问问是什么让它不起作用：没有清楚的主题句、有离题的句子、论据没有解释、用词含糊，或者顺序混乱。然后改写以解决这个问题，同时保留段落的观点。\n\n修改可以增加、删去、移动或替换整个句子。只改几个词是校对，很少能挽救一个不起作用的段落。",
        ),
        writingGenerator(
          t(
            "Read the draft paragraph, then rewrite it in English so that it fixes the problem named.",
            "阅读草稿段落，然后用英语改写它，解决所指出的问题。",
          ),
          revisionBank,
          revisionCriteria,
          { minWords: 35, maxChars: 2000 },
          shown(["revision", "修改稿"]),
        ),
      ),
    ],
  },
];
