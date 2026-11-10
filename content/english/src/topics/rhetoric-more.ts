// Rhetoric and composition: more items for the banks of rhetoric.ts, so that each rule-checked knowledge point has at
// least 30 items, and more tasks for its two pieces of writing. Choice items are written as lines of fields separated
// by bars: what is shown, the right answer and the wrong answers.

import type { ChoiceItem, WritingItem } from "@ga/subject-english";

/** bars turns lines of fields separated by bars into choice items. */
const bars = (lines: string): readonly ChoiceItem[] =>
  lines
    .trim()
    .split("\n")
    .map((line) => {
      const [shown, right, ...wrong] = line.trim().split("|");
      return [shown!, right!, wrong];
    });

/** labelled turns lines of "label|shown" into items whose wrong answers are the other labels, in a set order. */
const labelled = (labels: readonly string[], lines: string): readonly ChoiceItem[] =>
  lines
    .trim()
    .split("\n")
    .map((line, i) => {
      const [label, shown] = line.trim().split("|");
      const others = labels.filter((l) => l !== label);
      const wrong = i % 2 === 0 ? others : [...others].reverse();
      return [shown!, label!, wrong];
    });

/** fallacies turns lines of "label|other|other|shown" into items with two chosen wrong labels. */
const fallacies = (lines: string): readonly ChoiceItem[] =>
  lines
    .trim()
    .split("\n")
    .map((line) => {
      const [label, a, b, shown] = line.trim().split("|");
      return [shown!, label!, [a!, b!]];
    });

/** audienceMore are more passages with the audience each addresses. */
export const audienceMore: readonly ChoiceItem[] = bars(`
"Shoppers, for the next ten minutes, every coat on the second floor is half price."|customers in a store|the store's cashiers|the makers of the coats
"Graduates, today you leave these halls, but the friendships you made here will travel with you."|students finishing school|the teachers of the school|the families of younger pupils
"Ladies and gentlemen of the jury, the evidence will show that my client was miles away that night."|the jurors deciding a case|the judge of the court|the reporters in the room
"Neighbors, the empty lot on Pine Street could become a garden we all share. Will you lend a hand on Saturday?"|people who live near the lot|the city's gardening experts|the owner of the lot
"Voters of the fifth district, I will fight for every bus route you depend on."|citizens who can vote in the district|the drivers of the buses|people in other districts
"New employees, welcome. Over the next week you will learn how everything here works."|people just starting a job|the company's customers|the managers who hired them
"Dear readers, if you have ever lost a pet, you will understand why this story matters to me."|readers of the writer's column|the writer's own pets|the editors of the paper
"Fellow scientists, our data cannot be ignored; we must publish our findings this year."|researchers in the speaker's field|ordinary newspaper readers|the funders of the research
"Passengers, please fasten your seat belts and return your seats to the upright position."|travelers on a plane|the crew of the plane|people waiting at the airport
"Members of the board, a small grant from you will keep the shelter open all winter."|a board that can give money|the people who sleep at the shelter|the shelter's volunteers
"Students, if you want a longer lunch break, sign the petition at the front office today."|students at the school|the school's cooks|the parents of the students
"Investors, our app doubled its users this year, and we are ready to grow again."|people who might fund a company|the users of the app|the company's competitors
"Citizens of this nation, in this dark hour I ask for your courage and your patience."|the people of a whole country|the soldiers at the front|the leaders of other nations
"Coaches, please make sure every player has a signed medical form before Friday."|the coaches of school teams|the players on the teams|the doctors who sign the forms
"Dear Senator, as a farmer in your state, I urge you to vote against the new water tax."|a lawmaker who will vote|the other farmers of the state|the people who collect the tax
"Mom and Dad, I know a phone is expensive, but I will pay half from my summer job."|the speaker's parents|the speaker's friends|the phone company
"Hikers, the trail ahead is steep and icy. Turn back if you do not have proper boots."|people walking the trail|the rangers of the park|the makers of hiking boots
"Readers who love mysteries will not be able to put this novel down."|people who might buy the book|the author of the novel|the characters in the novel
"Teachers, the new grading system will save you hours of paperwork each week."|teachers at the school|the students being graded|the people who designed the system
"To the families of Room 12: our class trip to the museum needs four more adult helpers."|the parents of a class|the museum guides|the children of Room 12
"Members of the press, the mayor will answer three questions and then must leave."|reporters at an event|the mayor's staff|the readers of the newspapers
"Young voters, this election will decide the price of your college tuition."|young people who can vote|college professors|the candidates in the election
`);

/** purposeMore are more texts with the main purpose of each. */
export const purposeMore: readonly ChoiceItem[] = bars(`
A recipe card lists the ingredients of a soup and the steps to cook it.|to inform readers how to do something|to persuade readers to eat less meat|to entertain readers with a story
A speech urges the students to vote for a later start to the school day.|to persuade listeners to support a change|to inform listeners of the school's hours|to entertain listeners with jokes
A comic strip shows a cat trying, and failing, to catch a laser dot.|to entertain readers|to inform readers about cat behavior|to persuade readers to buy a laser pointer
An encyclopedia article explains how volcanoes form.|to inform readers|to persuade readers to visit a volcano|to entertain readers with an adventure
An advertisement promises that a new toothpaste will make teeth whiter in a week.|to persuade readers to buy a product|to inform readers how teeth grow|to entertain readers with a tale
A news report describes a fire that closed a factory and says no one was hurt.|to inform readers of an event|to persuade readers to fight fires|to entertain readers with a drama
A letter asks the mayor to fix the broken lights in the park.|to persuade the reader to take action|to inform the mayor about electricity|to entertain the mayor
A fantasy novel follows a girl who discovers she can talk to ravens.|to entertain readers|to persuade readers to protect birds|to explain how birds communicate
A safety sign at a pool lists the rules: no running, no diving in the shallow end.|to inform readers of rules|to entertain swimmers|to persuade readers to learn to swim
An editorial argues that the city should build more bike lanes.|to persuade readers to agree with a position|to inform readers where the lanes are|to entertain readers with a cycling story
A user manual explains how to set up a new printer.|to inform readers how to do something|to persuade readers to buy ink|to entertain readers
A humorous essay describes the writer's disastrous attempt to bake bread.|to entertain readers|to persuade readers to stop baking|to inform readers of a bread recipe
A campaign flyer says that a candidate will lower taxes and asks for your vote.|to persuade readers to vote for someone|to inform readers how taxes work|to entertain readers with a story
A science textbook chapter describes the stages of the water cycle.|to inform readers|to persuade readers to save water|to entertain readers with a tale
A charity's letter describes children without books and asks for a donation.|to persuade readers to give money|to inform readers how books are printed|to entertain readers with a story
A collection of limericks makes fun of a forgetful king.|to entertain readers|to inform readers about kings|to persuade readers to vote for a king
A museum label gives the date of a painting and explains what it shows.|to inform visitors|to persuade visitors to paint|to entertain visitors with a joke
A review urges readers to skip a new film because its plot makes no sense.|to persuade readers not to see a film|to inform readers of the film's running time|to entertain readers with a story
A bus timetable lists when each bus leaves the station.|to inform readers|to persuade readers to take the bus|to entertain readers
A ghost story describes a lighthouse whose lamp turns on by itself every winter.|to entertain readers|to inform readers how lighthouses work|to persuade readers to visit the coast
A poster asks students to join the recycling club and help clean the school.|to persuade readers to join|to inform readers what recycling is|to entertain readers
A biography tells the facts of a scientist's life from birth to death.|to inform readers about a life|to persuade readers to study science|to entertain readers with jokes
`);

/** appealMore are more sentences with the appeal each mainly uses. */
export const appealMore: readonly ChoiceItem[] = labelled(
  ["ethos", "pathos", "logos"],
  `
ethos|As the engineer who designed this bridge, I can tell you it is safe.
pathos|Think of the puppy shaking in its cage, waiting for someone to choose it.
logos|The program costs two dollars per student and raised test scores by ten percent.
ethos|I have served this town as a firefighter for twenty years, and I would never ask you to take a needless risk.
pathos|Picture your grandmother alone at the window, waiting for a visit that never comes.
logos|If each family saves one liter of water a day, the town will save four million liters a year.
ethos|The world's leading heart surgeons recommend this simple daily walk.
pathos|Her small hands trembled as she held the last photograph of her father.
logos|Since the store opened, crime on the street has fallen by a third, according to police records.
ethos|As a former student of this school, I know what this library meant to me and to my friends.
pathos|Imagine the terror of a family watching the flood waters rise toward their roof.
logos|The new bus route would connect three schools and two hospitals in under twenty minutes.
ethos|I have read every study on this subject published in the last decade.
pathos|Every night, a child somewhere in this city goes to sleep hungry and afraid.
logos|Electric buses cost more to buy but half as much to run, so they pay for themselves in six years.
ethos|My opponent and I both love this city, but only I have run a city budget before.
pathos|Remember the cheers of the crowd the night our team finally won the championship?
logos|Three of the four bridges in the county are more than eighty years old and need repair.
ethos|Speaking as a nurse who has worked through two epidemics, I urge you to get vaccinated.
pathos|The old oak has watched over generations of children playing in its shade.
logos|Because the factory employs two thousand people, closing it would remove one in ten jobs in the town.
`,
);

/** deviceMore are more lines with the rhetorical device each uses. */
export const deviceMore: readonly ChoiceItem[] = labelled(
  ["anaphora", "antithesis", "rhetorical question"],
  `
anaphora|We will build the road. We will build the school. We will build the future.
antithesis|We must learn to live together as brothers or perish together as fools.
rhetorical question|Can any of us truly say we have done enough?
anaphora|This is our home. This is our land. This is our fight.
antithesis|One small step for a man, one giant leap for mankind.
rhetorical question|If not now, when?
anaphora|Never before have we been so close. Never before have we been so ready. Never before has the prize been so near.
antithesis|Ask not what your country can do for you; ask what you can do for your country.
rhetorical question|Who would choose to breathe dirty air if clean air were possible?
anaphora|Let freedom ring from the hills. Let freedom ring from the valleys. Let freedom ring from every town.
antithesis|To err is human; to forgive, divine.
rhetorical question|What parent would not give everything for a child's safety?
anaphora|Not for fame, not for money, not for power did she do this.
antithesis|Some people dream of success, while others wake up and work for it.
rhetorical question|Are we really going to let one storm decide our future?
anaphora|I came for the music. I came for the friends. I came for the memories.
antithesis|Easy to promise, hard to keep.
rhetorical question|How can we teach honesty if we will not practice it?
anaphora|Every voice matters. Every vote counts. Every citizen belongs.
antithesis|The rich grow richer while the poor grow poorer.
rhetorical question|Is a library just a building, or is it the memory of a town?
`,
);

/** fallacyMore are more arguments with the fallacy each commits and two other fallacies. */
export const fallacyMore: readonly ChoiceItem[] = fallacies(`
ad hominem|straw man|bandwagon|Why listen to Dr. Lee on climate? He drives an old car that burns too much fuel.
straw man|false dilemma|ad hominem|She says we should study more history. So she thinks science and math are worthless.
false dilemma|slippery slope|hasty generalization|You are either with our club or against the whole school.
slippery slope|straw man|bandwagon|If we allow phones at lunch, next they will use them in class, and soon no one will learn anything.
hasty generalization|ad hominem|false dilemma|I met two rude people from that city, so everyone there must be rude.
bandwagon|hasty generalization|straw man|Everyone in my class has the new shoes, so they must be the best shoes.
ad hominem|slippery slope|false dilemma|Don't trust her report on the river. She failed chemistry in high school.
straw man|bandwagon|slippery slope|He wants a shorter school week. So he wants children to sit at home doing nothing.
false dilemma|ad hominem|bandwagon|Either we cut the music program, or the school will go bankrupt.
slippery slope|hasty generalization|ad hominem|If we raise the bus fare by ten cents, soon only the rich will be able to ride.
hasty generalization|bandwagon|straw man|My first two lessons were boring, so the whole course will be boring.
bandwagon|false dilemma|ad hominem|Millions of people use this diet, so it must work.
ad hominem|hasty generalization|straw man|The mayor's plan is foolish; just look at her terrible taste in clothes.
straw man|slippery slope|hasty generalization|The council wants to limit parking downtown. Clearly, they want to ban cars completely.
false dilemma|bandwagon|straw man|Either you buy this insurance today, or your family will be ruined.
slippery slope|false dilemma|bandwagon|If we let one student hand in work late, every student will hand in work late, and deadlines will mean nothing.
hasty generalization|slippery slope|ad hominem|One study found that coffee helped memory, so coffee will make anyone a genius.
bandwagon|straw man|slippery slope|All the popular singers support this candidate, so you should vote for him too.
ad hominem|bandwagon|false dilemma|You can't take his advice about saving money; he is only nineteen.
straw man|ad hominem|false dilemma|My brother says I should help with dinner. He thinks I should be his servant.
false dilemma|hasty generalization|slippery slope|We can have a strong army or good schools, but not both.
hasty generalization|false dilemma|bandwagon|The new restaurant was slow on its first night, so it will always be slow.
`);

/** characterizationMore are more sentences, each characterizing directly or indirectly. */
export const characterizationMore: readonly ChoiceItem[] = labelled(
  ["direct", "indirect"],
  `
direct|Grandpa Lou was the most generous man on the street.
indirect|Grandpa Lou pressed a twenty into the paper boy's hand and told him to keep the change.
direct|Nadia was shy and hated being the center of attention.
indirect|When the teacher called her name, Nadia stared at her desk and whispered her answer.
direct|The new manager was cold and impatient.
indirect|The new manager checked his watch twice while she was still explaining the problem.
direct|Tomás was honest to a fault.
indirect|Tomás walked back three blocks to return the extra coin the cashier had given him.
direct|Aunt Bea was a nervous traveler.
indirect|Aunt Bea arrived at the station two hours early and checked her ticket every ten minutes.
direct|The old sailor was wise and calm.
indirect|While the others shouted, the old sailor quietly lowered the sail and turned the boat into the wind.
direct|Priya was ambitious.
indirect|Priya had already written down her five-year plan before anyone else had finished the first question.
direct|The landlord was greedy and cruel.
indirect|The landlord raised the rent the same week the tenants' heating broke and refused to fix it.
direct|Ben was a loyal friend.
indirect|Ben sat outside the hospital all night so his friend would see a familiar face in the morning.
direct|The princess was proud and spoiled.
indirect|"I do not eat from silver," the princess said, pushing the plate away. "Bring me gold."
direct|Mrs. Kim was a strict but fair teacher.
indirect|Mrs. Kim gave Leo a zero for copying, then stayed after school to help him redo the work.
`,
);

/** allusionMore are more sentences with an allusion, with what each suggests. */
export const allusionMore: readonly ChoiceItem[] = bars(`
His promise to fix the roads turned out to be a Trojan horse for higher taxes.|A gift or offer hides a harmful purpose.|The promise was kept exactly as he said.|He gave the town a wooden horse.
The athlete's weak ankle was his Achilles' heel.|It is the one weak point in someone otherwise strong.|He was the fastest runner on the team.|His heel helped him win the race.
Getting the city council to agree on anything is a Herculean task.|It is a job that needs enormous strength or effort.|It is a quick and easy job.|It is a job only for one person named Hercules.
She has the Midas touch with failing restaurants.|Everything she works on becomes successful and profitable.|She ruins everything she touches.|She likes to decorate restaurants in gold.
After the scandal, the senator found himself in a Catch-22.|Every choice open to him leads to a bad result.|He had twenty-two ways out.|He was caught by twenty-two reporters.
The tiny startup was a modern Cinderella story.|Something humble rose suddenly to great success.|The company was cruel to its workers.|The company made glass shoes.
His refusal to ask for directions was a kind of odyssey.|It became a long, wandering journey full of trouble.|It was a short and simple trip.|He refused to read a famous poem.
The two brothers' rivalry was like Cain and Abel's.|Their rivalry is bitter and could become violent.|They are the best of friends.|They both work as farmers.
She felt like Atlas, carrying the whole family's problems on her shoulders.|She is bearing a huge burden alone.|She is very strong and enjoys lifting things.|She has a map of the world.
The candidate's speech was a siren song to anxious voters.|It was attractive but likely to lead them into danger.|It was a loud warning of danger.|It was sung beautifully at the end.
Opening the attic after forty years felt like finding Aladdin's cave.|It was a place full of unexpected treasures.|It was a dangerous and dark trap.|It was a small, empty room.
His rise and fall in the company was the story of Icarus.|Too much ambition led him to ruin.|He was careful and slowly rose to the top.|He learned to fly airplanes.
The forgotten letter in the drawer was her Rosetta Stone.|It was the key that made something puzzling understandable.|It was a heavy, useless stone.|It was written in Egyptian.
The dancer was a Romeo, leaving broken hearts in every city.|He is a romantic lover of many women.|He is a loyal husband.|He is a famous playwright.
The manager acted like Big Brother, watching every email his workers sent.|He watched and controlled people too closely.|He took care of his workers like an older brother.|He was the oldest person in the office.
The government's new rule was met with a Pyrrhic victory for its supporters.|They won, but at such a cost that it was nearly a defeat.|They won easily and gained a lot.|They lost the vote completely.
Waiting for the results felt like the sword of Damocles hanging over us.|A danger threatened at every moment.|We were preparing for a sword fight.|We were relaxed and happy.
After years of victories, the general finally met his Waterloo.|He suffered a final, decisive defeat.|He won his greatest victory.|He visited a famous town in Belgium.
The coach was a Scrooge with the team's budget.|He was very unwilling to spend money.|He was very generous with money.|He loved celebrating holidays.
Moving to a new country, he felt like Rip Van Winkle, waking into a world he did not recognize.|Everything around him had changed beyond what he knew.|He slept well on the journey.|He felt young and full of energy.
Her plan to win the election was quixotic.|It was idealistic but impractical and unlikely to succeed.|It was carefully planned and sure to work.|It involved fighting real giants.
The leaked memo was the smoking gun investigators needed.|It was clear proof that someone was guilty.|It was a dangerous weapon.|It was evidence that someone was innocent.
`);

/** paradoxMore are more lines, each a paradox or an oxymoron. */
export const paradoxMore: readonly ChoiceItem[] = labelled(
  ["oxymoron", "paradox"],
  `
oxymoron|The mall was an open secret among the students.
paradox|I must be cruel only to be kind.
oxymoron|The meeting ended in a deafening silence.
paradox|The only constant is change.
oxymoron|It was a terribly good performance.
paradox|Sometimes you must lose to win.
oxymoron|They served jumbo shrimp at the party.
paradox|The more you give away, the richer you become.
oxymoron|She spoke with a gentle force.
paradox|Nobody goes to that restaurant anymore; it is too crowded.
oxymoron|The ruins showed a kind of sweet sorrow.
paradox|I know that I know nothing.
oxymoron|He gave a wise fool's answer.
paradox|The beginning of wisdom is to admit you are ignorant.
oxymoron|The comedian's act was seriously funny.
paradox|Freedom has its own kind of chains.
oxymoron|We waited in an awful calm before the storm.
paradox|If you want peace, prepare for war.
oxymoron|The old house was filled with a living death.
paradox|The harder I try to sleep, the more awake I become.
oxymoron|It was an original copy of the letter.
paradox|What we hold too tightly, we often lose.
`,
);

/** sourceMore are more research situations, with the most credible source for each. */
export const sourceMore: readonly ChoiceItem[] = bars(`
You are writing about the population of your country. Which source is most credible?|The national statistics office's latest census report|A travel website's page of fun facts|A comment on a social media post
You are writing about the safety of a children's car seat. Which source is most credible?|Crash test results from an independent safety agency|The car seat company's advertisement|A parent's review on a shopping site
You are writing about the causes of the First World War. Which source is most credible?|A history book by a university historian, with notes on its sources|A war film based loosely on events|A video game set in the war
You are writing about how a new law affects renters. Which source is most credible?|The text of the law and a report by a nonpartisan research group|A landlord association's flyer|An angry post by a tenant who did not read the law
You are writing about the nutrition of breakfast cereals. Which source is most credible?|A government health agency's report on nutrition labels|A cereal maker's television commercial|A celebrity chef's opinion on a talk show
You are writing about the effects of a drought on farms this year. Which source is most credible?|A recent report by the national weather service and farm agency|A weather report from ten years ago|A rumor shared in a farmers' chat group
You are writing about whether a famous quotation is real. Which source is most credible?|A scholarly edition of the speaker's collected speeches and letters|A poster with the quotation over a sunset|A quotation website with no sources listed
You are writing about the dangers of a volcano near a city. Which source is most credible?|A geological survey's monitoring report on the volcano|A tourist brochure for the volcano's hiking trails|A novel set on the volcano
You are writing about how much homework affects learning. Which source is most credible?|A review of many studies in an education research journal|A homework-help company's blog|An opinion from a student who dislikes homework
You are writing about the history of a local factory. Which source is most credible?|The factory's archived records and newspaper reports from the time|A website selling souvenirs of the town|A friend's memory of a story his uncle told
You are writing about a new treatment for asthma. Which source is most credible?|Results of a clinical trial published in a peer-reviewed medical journal|An advertisement from the company that makes the treatment|A post on a health forum by an unnamed user
You are writing about air pollution in your city. Which source is most credible?|Data from the city's air-quality monitoring stations|A car company's report on its own vehicles|A meme about smog
You are writing about the life of a famous poet. Which source is most credible?|A biography by a scholar who studied the poet's letters and diaries|A film loosely based on the poet's life|A fan page that invents scenes from the poet's life
You are writing about whether electric cars are cleaner than gasoline cars. Which source is most credible?|A study by independent researchers comparing both kinds over their whole lives|An oil company's pamphlet|An electric car maker's advertisement
You are writing about a recent election's results. Which source is most credible?|The official results published by the election commission|A partisan blog that disputes the count|A text message forwarded many times
You are writing about how bees communicate. Which source is most credible?|A book by a biologist who has studied bees for decades|A children's cartoon about a talking bee|A post by someone who keeps one hive
You are writing about the cost of college. Which source is most credible?|Data from the government's education department on tuition and aid|A loan company's advertisement|A friend's guess about what college costs
You are writing about the effects of screen time on sleep. Which source is most credible?|A study by sleep scientists in a medical journal|A phone company's press release|An influencer's video about her bedtime routine
You are writing about a war that ended in 1975. Which source is most credible?|Documents from the time and a historian's book that analyzes them|A website with no author or date|A song written about the war
You are writing about the safety of tap water in your town. Which source is most credible?|The water utility's latest test results, checked by a state agency|A company selling home water filters|A neighbor's complaint about the taste
You are writing about the speed of the fastest land animal. Which source is most credible?|A wildlife research institute's published measurements|A cartoon that shows a cheetah racing a car|A trivia game card with no source
You are writing about current unemployment figures. Which source is most credible?|The latest monthly report from the national labor statistics office|A report from five years ago|An online comment from someone who lost a job
`);

/** rhetoricalAnalysisMore are more passages to analyze for how they persuade. */
export const rhetoricalAnalysisMore: readonly WritingItem[] = [
  {
    task: "Write a paragraph that analyzes how the speaker tries to persuade the audience. Name a choice the speaker makes, quote it, and explain its effect.",
    source:
      "Neighbors, last winter Mrs. Patel slipped on the ice outside the post office and broke her hip. She is eighty-one. The sidewalk had not been salted for three days. We can buy salt for the whole street for less than the cost of one ambulance ride. Let us do it before someone else falls.",
    model:
      'The speaker persuades by joining a story to a simple comparison of costs. Naming "Mrs. Patel," who "is eighty-one," turns an icy sidewalk into an injury the audience can picture, which appeals to their sympathy. The speaker then shows that salt costs "less than the cost of one ambulance ride," so the solution seems both cheap and sensible. The final line, "before someone else falls," adds urgency by suggesting that the next victim could be anyone.',
  },
  {
    task: "Write a paragraph that analyzes how the writer tries to persuade the reader. Name a choice the writer makes, quote it, and explain its effect.",
    source:
      "We say that we value our teachers. We say that education is the future. We say that every child matters. Yet our teachers buy their own paper, our classrooms leak, and our children share textbooks. It is time our budget said what we say.",
    model:
      'The writer persuades through anaphora and a sharp contrast between words and actions. The repeated phrase "We say" builds a list of familiar promises, and its rhythm makes the reader expect action to follow. Instead, "Yet" introduces a list of failures: teachers who "buy their own paper" and classrooms that "leak." The final sentence, "It is time our budget said what we say," turns the repetition into a challenge, suggesting that the community\'s spending reveals what it truly values.',
  },
  {
    task: "Write a paragraph that analyzes how the speaker tries to persuade the audience. Name a choice the speaker makes, quote it, and explain its effect.",
    source:
      "I am not a politician. I am a nurse. For eighteen years, I have held the hands of patients who could not afford their medicine. When I tell you that drug prices are hurting people, I am not repeating a slogan. I am telling you what I have seen.",
    model:
      'The speaker persuades mainly through ethos, building trust by separating herself from politicians. Her opening contrast, "I am not a politician. I am a nurse," suggests that she has no reason to exaggerate. The detail that she has "held the hands of patients" for "eighteen years" adds both experience and emotion. By ending with "I am telling you what I have seen," she presents her argument as testimony rather than opinion, which makes it harder for the audience to dismiss.',
  },
  {
    task: "Write a paragraph that analyzes how the writer tries to persuade the reader. Name a choice the writer makes, quote it, and explain its effect.",
    source:
      "The average American spends four hours a day looking at a phone. That is sixty days a year, or about ten years over a lifetime. Ten years. What would you do with ten more years? Learn a language? Write a book? Visit your grandparents more often?",
    model:
      'The writer persuades by turning a daily habit into a shocking total and then letting rhetorical questions do the work. The calculation moves from "four hours a day" to "about ten years over a lifetime," and the short repetition "Ten years." forces the reader to pause on the number. The questions that follow, such as "Learn a language?" and "Visit your grandparents more often?", invite readers to imagine what they are losing, so they reach the writer\'s conclusion on their own.',
  },
];

/** synthesisMore are more pairs of sources to bring together in support of one claim. */
export const synthesisMore: readonly WritingItem[] = [
  {
    task: "Using both sources, write a paragraph that supports a claim about whether schools should offer more recess. Use evidence from each source and explain how they work together.",
    source:
      "Source A: A study found that students who had a twenty-minute recess paid more attention in afternoon lessons. Source B: Teachers in a district that added recess reported fewer fights in class.",
    model:
      'Schools should offer more recess, because breaks improve both learning and behavior. Source A shows that students with recess "paid more attention in afternoon lessons," so time away from class can make class time more productive. Source B adds that teachers reported "fewer fights in class" after recess was added. Together, the sources suggest that recess is not lost learning time: it helps students return calmer and more focused.',
  },
  {
    task: "Using both sources, write a paragraph that supports a claim about whether cities should build more parks. Use evidence from each source and explain how they work together.",
    source:
      "Source A: Doctors report that people who live within a ten-minute walk of a park exercise more. Source B: A survey found that neighbors who share a park are more likely to know each other's names.",
    model:
      'Cities should build more parks, because parks strengthen both bodies and communities. According to Source A, people who live near a park "exercise more," which improves their health. Source B shows a social benefit: neighbors who share a park are "more likely to know each other\'s names." Source A shows what parks do for individuals, and Source B shows what they do for the neighborhood, so together they make the case that parks are worth their cost.',
  },
  {
    task: "Using both sources, write a paragraph that supports a claim about whether students should read printed books rather than screens. Use evidence from each source and explain how they work together.",
    source:
      "Source A: In one study, students who read a story on paper remembered the order of events better than those who read it on a screen. Source B: Eye doctors report that long hours of reading on screens can cause eye strain and headaches.",
    model:
      'Students should read printed books for long assignments, because paper supports both memory and comfort. Source A found that readers on paper "remembered the order of events better," which suggests that printed pages help students understand what they read. Source B adds that screens "can cause eye strain and headaches" over long hours. The first source shows that paper helps the mind, and the second that it spares the body, so together they favor printed books for serious reading.',
  },
  {
    task: "Using both sources, write a paragraph that supports a claim about whether towns should keep their local libraries open. Use evidence from each source and explain how they work together.",
    source:
      "Source A: The town library reports that half of its visitors use its free computers to apply for jobs. Source B: A national survey found that children who visit libraries regularly read more books each year.",
    model:
      'Towns should keep their libraries open, because libraries serve both adults and children in ways nothing else does. Source A reports that half of visitors use the free computers "to apply for jobs," so the library helps adults find work. Source B shows that children who visit regularly "read more books each year." Together, the sources show that the library supports a town at every age, from a child\'s first books to an adult\'s next job.',
  },
];
