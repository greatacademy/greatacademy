// TOEFL Writing: the academic discussion read before it is written. Each discussion is a professor's question and two
// students' posts. A learner first states a student's position, then chooses the reply that adds to the discussion
// rather than repeating a classmate, wandering off the question or agreeing without a reason.

import { type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { examTopic, interleave, type SolvedChoice, solvedChoiceGenerator } from "./kit.ts";

/** Student is a student's post in a discussion with what it claims and how a careless reader might misstate it. */
interface Student {
  readonly name: string;
  readonly post: string;
  /** claim is the student's position in a sentence. */
  readonly claim: string;
  /** distort goes much further than the student does. */
  readonly distort: string;
  /** key is the words of the post that state the position; it must appear in the post. */
  readonly key: string;
  /** good agrees with the student and adds a reason and an example that neither student gave. */
  readonly good: string;
  /** repeat agrees with the student only by saying the student's reasons again. */
  readonly repeat: string;
}

/** Discussion is a professor's question, two students' posts and a reply that answers another question. */
interface Discussion {
  readonly professor: string;
  readonly question: string;
  readonly a: Student;
  readonly b: Student;
  readonly offTopic: string;
}

const discussions: readonly Discussion[] = [
  {
    professor: "Professor Alvarez",
    question:
      "Cities are deciding how to use limited budgets. Some people argue that money should go to expanding public transport; others believe repairing existing roads should come first. Which do you think a city should put first, and why?",
    a: {
      name: "Maya",
      post: "I think public transport should come first. When buses and trains are frequent and cheap, fewer people drive, so roads wear out more slowly anyway. Spending on roads just encourages more car use and more traffic in the long run.",
      claim: "Public transport should come first, because it reduces driving and so the damage to roads.",
      distort: "Roads should never be repaired again.",
      key: "fewer people drive, so roads wear out more slowly anyway",
      good: "I agree with Maya, and I would add a point about fairness. Not everyone can afford a car: students, older people and many workers on low wages depend on buses. When a city improves public transport, it helps the people who have the fewest choices. In my city, a new night bus line meant that hospital cleaners could finally get home safely after late shifts.",
      repeat:
        "Like Maya, I believe public transport is the better choice, because if trains and buses are frequent and cheap, people drive less, and then the roads are not damaged as quickly.",
    },
    b: {
      name: "Daniel",
      post: "I disagree. Most people in my town still drive to work, and broken roads cause accidents and damage cars. A city has to fix the problems people face every day before it starts large new projects that take years to finish.",
      claim: "Road repairs should come first, because damaged roads cause daily harm and new projects take years.",
      distort: "Public transport is useless in every town.",
      key: "A city has to fix the problems people face every day before it starts large new projects",
      good: "Daniel is right, and I think safety is the strongest reason. Cyclists and pedestrians use roads too, and potholes are especially dangerous for them. A cyclist who hits a hole at night can be badly hurt. Repairing roads protects everyone who uses them, not only drivers, and the results are visible within weeks.",
      repeat:
        "I agree with Daniel, because many people in towns still drive to work, and roads with holes lead to accidents and harm cars, so cities should repair them before new projects.",
    },
    offTopic:
      "I think cities should spend more money on parks. Green spaces make people happier and healthier, and children need safe places to play outside after school.",
  },
  {
    professor: "Professor Chen",
    question:
      "Some universities now record every lecture and put it online. Supporters say this helps students learn; critics say it makes students stop coming to class. Should universities record all lectures? Why or why not?",
    a: {
      name: "Aisha",
      post: "Yes, they should. Recordings let students replay difficult parts, which is especially useful for students who are studying in a second language. Being able to pause and check a word you missed makes a real difference.",
      claim: "Lectures should be recorded, because students can replay difficult parts, which helps those studying in a second language.",
      distort: "Universities should stop giving live lectures.",
      key: "Recordings let students replay difficult parts",
      good: "I side with Aisha. Recordings also help students who cannot always be there. Some students work part-time or care for family members, and missing one lecture can leave them behind for weeks. Last term my classmate was ill for ten days, and the recordings were the only way she could keep up.",
      repeat:
        "Aisha is right: with recordings, students can watch hard parts again, and this is very helpful for people learning in a second language, who can stop and look up words they did not catch.",
    },
    b: {
      name: "Tom",
      post: "I am not convinced. If everything is recorded, many students will plan to watch later and then never do it. Coming to class gives you a routine and a chance to ask questions at the moment you are confused.",
      claim:
        "Not every lecture should be recorded, because students may put off watching and lose the routine of class and the chance to ask questions.",
      distort: "Students who watch recordings always fail their exams.",
      key: "many students will plan to watch later and then never do it",
      good: "I agree with Tom, and I would add that live lectures change how teachers teach. When a lecture is recorded, some teachers become more careful and less willing to share an opinion or try a discussion. In my history class, the best moments were unplanned debates that probably would not happen in front of a camera.",
      repeat:
        "Tom makes the point I would make: when lectures are recorded, students decide to watch them later but often never do, and they also lose the routine of class and the chance to ask questions.",
    },
    offTopic:
      "In my view, universities should keep their libraries open twenty-four hours a day. Many students study best late at night, and a quiet place is hard to find in shared housing.",
  },
  {
    professor: "Professor Nakamura",
    question:
      "Many shops now charge customers for plastic bags. Is a small charge the best way to reduce plastic waste, or should governments simply ban plastic bags? Explain your view.",
    a: {
      name: "Lucas",
      post: "A charge is better than a ban. It changes habits without forcing anyone, and people who really need a bag can still buy one. In many countries a small charge has already cut bag use sharply.",
      claim: "A charge is better, because it changes habits without forcing people and still lets those who need a bag buy one.",
      distort: "Plastic bags cause no harm to the environment.",
      key: "It changes habits without forcing anyone",
      good: "Like Lucas, I prefer a charge, and the money it raises can be useful too. In some places, shops must give the money to environmental projects. My local supermarket uses its bag money to pay for beach clean-ups, so even the bags that are sold help to reduce waste.",
      repeat:
        "Lucas has it right. A charge makes people change their habits without forcing them, and anyone who truly needs a bag can still pay for one, which is fair.",
    },
    b: {
      name: "Priya",
      post: "I think a ban is needed. A charge is so small that richer customers ignore it completely. If plastic bags are harmful, the government should remove them, not just make them a little more expensive.",
      claim: "A ban is needed, because richer customers ignore a small charge and harmful bags should be removed.",
      distort: "Shops that sell plastic should be closed.",
      key: "richer customers ignore it completely",
      good: "I agree with Priya, and a ban is also simpler for shops. With a charge, staff have to ask every customer and handle small payments, which slows down the queue. When my city banned plastic bags, people adjusted within a month and started carrying their own bags.",
      repeat:
        "Like Priya, I think we need a ban, because a small charge does not matter to customers with more money, and something harmful should be removed completely.",
    },
    offTopic:
      "I believe the biggest environmental problem is air travel. Planes produce a huge amount of carbon, and governments should tax flights much more heavily.",
  },
  {
    professor: "Professor Mensah",
    question:
      "Some schools have started banning mobile phones during the whole school day, including break times. Do you think this is a good policy? Why or why not?",
    a: {
      name: "Hana",
      post: "I support the ban. Without phones at break, students actually talk to each other and play games. Phones make it easy to sit alone and scroll, and this can make loneliness worse for shy students.",
      claim: "The ban is good, because students talk and play together at break instead of scrolling alone.",
      distort: "Teenagers should not have phones anywhere, even at home.",
      key: "students actually talk to each other and play games",
      good: "Hana is right, and I think the ban also reduces bullying. A lot of unkind messages and photos are shared during the school day, when students are together but adults cannot see their screens. After my old school banned phones, teachers reported far fewer arguments that had started online.",
      repeat:
        "As Hana says, when phones are not allowed at break, students speak to one another and play together, and shy students are less likely to sit on their own scrolling.",
    },
    b: {
      name: "Omar",
      post: "I think a full-day ban goes too far. Students need to contact their parents if plans change, and learning to use a phone sensibly is a skill. Schools should teach self-control rather than remove the temptation.",
      claim: "A full-day ban goes too far, because students need to contact parents and should learn to use phones sensibly.",
      distort: "Students should be allowed to use phones during lessons.",
      key: "Schools should teach self-control rather than remove the temptation",
      good: "I agree with Omar, and phones can also be useful at break. Many students use them to check homework deadlines, read, or practise a language with an app. My younger brother uses his break to review vocabulary on his phone, which is hardly a waste of time.",
      repeat:
        "I agree with Omar that banning phones for the whole day is too much, since students may need to call their parents and they should learn to use phones in a sensible way.",
    },
    offTopic:
      "I think schools should start later in the morning. Teenagers need more sleep than adults, and many students are too tired to concentrate in the first lesson.",
  },
  {
    professor: "Professor Laurent",
    question:
      "More companies are letting employees choose to work from home some days each week. Is this good for companies, or does it make teamwork harder? Give your opinion.",
    a: {
      name: "Sofia",
      post: "It is good for companies. Employees save hours of travel and are often more productive at home, where there are fewer interruptions. Companies also need less office space, which saves money.",
      claim: "Working from home is good for companies, because staff get more done and less office space is needed.",
      distort: "Every office should be closed.",
      key: "Companies also need less office space, which saves money",
      good: "I side with Sofia. Flexible work also helps companies hire better people. When the job does not require living near the office, a company can choose from candidates in other cities or even other countries. My aunt's small design firm found its best programmer this way, in a town four hours away.",
      repeat:
        "I share Sofia's view: at home there are fewer interruptions, so people get more done and do not waste hours travelling, and companies save money on offices.",
    },
    b: {
      name: "Kenji",
      post: "I think it harms teamwork. New employees learn by watching experienced colleagues, and that is much harder on a video call. Quick conversations in the corridor often solve problems that would take days by email.",
      claim: "Working from home harms teamwork, because new staff learn less and quick conversations disappear.",
      distort: "Nobody can do any useful work at home.",
      key: "New employees learn by watching experienced colleagues",
      good: "I agree with Kenji, and I would add that working from home can make it harder to switch off. When the office is your kitchen table, many people keep checking emails late into the evening. A friend of mine who works from home says she now works longer hours but feels less connected to her team.",
      repeat:
        "Kenji's point is the right one: new workers learn from watching more experienced people, which video calls make difficult, and short talks in the corridor solve problems faster than email.",
    },
    offTopic:
      "In my opinion, companies should give employees more holidays. People who rest properly are healthier, and they come back to work with new energy.",
  },
  {
    professor: "Professor Osei",
    question:
      "Some governments put a tax on sugary drinks to improve public health. Others think people should be free to choose what they drink and that education works better. Which approach do you prefer, and why?",
    a: {
      name: "Elena",
      post: "I prefer the tax. Price has a strong effect on what people buy, especially young people. If sugary drinks cost more, many people will choose water instead, and the money raised can pay for health programmes.",
      claim: "A tax is better, because higher prices mean fewer sugary drinks are bought and the money can fund health programmes.",
      distort: "Sugary drinks should be against the law.",
      key: "Price has a strong effect on what people buy",
      good: "Like Elena, I prefer the tax, because it also pushes companies to change their recipes. When the tax depends on how much sugar a drink contains, makers have a reason to use less. Several well-known brands quietly reduced the sugar in their drinks after such a tax was announced in one country.",
      repeat:
        "Elena is right that price matters a lot when people shop, especially for young people, so a more expensive drink means more people pick water, and the tax money can support health.",
    },
    b: {
      name: "Marcus",
      post: "I prefer education. A tax punishes everyone, including people who only have a soft drink now and then. If people understand how much sugar is in a drink, they will make better choices themselves.",
      claim: "Education is better, because a tax punishes everyone and people who understand the facts will choose better themselves.",
      distort: "Sugar is good for people's health.",
      key: "A tax punishes everyone",
      good: "I agree with Marcus, and a tax can also be unfair to poorer families. They spend a larger share of their income on food and drink, so the same tax costs them more in real terms. Teaching children about food at school, as my primary school did with weekly cooking classes, reaches every family without making anyone poorer.",
      repeat:
        "Like Marcus, I think education is the answer, because a tax makes everyone pay, even those who rarely drink soft drinks, and people who know the facts will decide well.",
    },
    offTopic:
      "I think hospitals need more nurses. Many nurses work very long shifts, and patients wait hours to be seen because there are not enough staff.",
  },
  {
    professor: "Professor Ibrahim",
    question:
      "Many news websites now put their articles behind a paywall, so readers must subscribe. Should news be free to read online, or is it fair to make readers pay?",
    a: {
      name: "Chloe",
      post: "It is fair to make readers pay. Good journalism is expensive: reporters need time to check facts and travel to where events happen. If no one pays, news organisations will depend on advertising and clicks, and quality will fall.",
      claim: "Making readers pay is fair, because good journalism is expensive and without subscriptions its quality falls.",
      distort: "Every free website publishes false news.",
      key: "Good journalism is expensive",
      good: "Chloe is right, and subscriptions also make news organisations more independent. A paper that lives on advertising may avoid reporting on the companies that buy its adverts. When readers pay, the paper answers to them instead. Our local paper started investigating a large employer only after it moved to subscriptions.",
      repeat:
        "Chloe is correct that journalism costs a lot, since reporters must check facts and travel, and without readers paying, news will rely on adverts and clicks and become worse.",
    },
    b: {
      name: "Ravi",
      post: "News should be free. Everyone in a democracy needs reliable information, not only those who can afford several subscriptions. If quality news is locked away, people turn to free sources that are often less accurate.",
      claim: "News should be free, because everyone in a democracy needs reliable information, not only those who can pay.",
      distort: "Journalists should not be paid for their work.",
      key: "Everyone in a democracy needs reliable information",
      good: "I agree with Ravi, and free news also helps students. Many of us need reliable articles for coursework, and we cannot pay for five different sites. Last semester I gave up on a research project about housing because every useful article I found was behind a paywall.",
      repeat:
        "As Ravi explains, in a democracy every citizen needs trustworthy information, not only people with money for subscriptions, and otherwise people use less accurate free sources.",
    },
    offTopic:
      "I believe social media companies should check the age of their users. Young children see many things online that are not suitable for them.",
  },
  {
    professor: "Professor Petrova",
    question:
      "Some people believe that every young person should do one year of national service, such as working in hospitals or protecting the environment, after finishing school. Do you think this is a good idea?",
    a: {
      name: "Diego",
      post: "Yes. A year of service would bring together young people from different backgrounds who would otherwise never meet. Working side by side on a real project builds understanding between groups.",
      claim: "It is a good idea, because it brings together young people from different backgrounds.",
      distort: "Young people should not be allowed to go to university.",
      key: "bring together young people from different backgrounds",
      good: "I agree with Diego, and a year of service also helps young people choose a career. Many students start a degree without knowing what work they enjoy. My cousin spent six months helping in a care home and realised she wanted to become a nurse, something she had never considered at school.",
      repeat:
        "I think the same as Diego: a year of service would let young people from different backgrounds meet, and working together on something real would help them understand each other.",
    },
    b: {
      name: "Mei",
      post: "I disagree. A compulsory year delays university and careers, and not every young person can afford to lose a year of income. Service is valuable, but it should be a choice, not a requirement.",
      claim: "It should not be compulsory, because it delays study and work and some cannot afford a year without income.",
      distort: "Volunteering is a waste of time.",
      key: "it should be a choice, not a requirement",
      good: "I side with Mei. I also doubt that forced work is good work. People who are made to do a job often do it with little care, and hospitals or environmental projects need people who really want to be there. The volunteers I met at a nature reserve were effective precisely because they had chosen to come.",
      repeat:
        "Mei's argument is convincing: being forced to serve for a year would delay university and jobs, some people cannot manage a year with no income, and service should be voluntary.",
    },
    offTopic:
      "In my view, the voting age should be lowered to sixteen. Sixteen-year-olds pay taxes on part-time jobs, so they should have a say in how the country is run.",
  },
  {
    professor: "Professor Svensson",
    question:
      "Some schools want every child to learn programming from the age of seven. Others say young children should focus on reading, writing and basic maths first. What do you think?",
    a: {
      name: "Leila",
      post: "Programming should start early. Young children learn new languages quickly, and programming is a language of the modern world. Simple coding games also teach logical thinking and patience when something does not work.",
      claim: "Programming should start early, because young children learn quickly and coding teaches logic and patience.",
      distort: "Children no longer need to learn to read.",
      key: "programming is a language of the modern world",
      good: "Like Leila, I would start early, because it may also bring more girls into computing. By their teenage years, many girls already believe computers are for boys. When everyone codes from age seven, that idea has less chance to form. At my sister's primary school, the girls' coding club now has a waiting list.",
      repeat:
        "Leila is right: children pick up languages fast, and programming is a modern language, while coding games teach them to think logically and be patient when things go wrong.",
    },
    b: {
      name: "Jonas",
      post: "The basics should come first. A child who cannot read well will struggle with everything else, including programming. The school day is limited, and every hour of coding is an hour taken from reading or maths.",
      claim: "The basics should come first, because reading underlies everything and time for coding is taken from reading and maths.",
      distort: "Programming should never be taught in schools.",
      key: "every hour of coding is an hour taken from reading or maths",
      good: "I agree with Jonas, and there is also a shortage of trained teachers. Many primary teachers have never programmed, so the lessons can be poor and leave children confused. My nephew's class spent a whole term copying code from a screen without understanding any of it.",
      repeat:
        "Like Jonas, I think the basics must come first, since a weak reader will find every subject hard, including coding, and time spent coding is time lost for reading and maths.",
    },
    offTopic:
      "I think children should spend more time outdoors. Many of them sit indoors all day, and playing outside is important for their health and their mood.",
  },
  {
    professor: "Professor Moreau",
    question:
      "Some cities have made public museums free for everyone. Others charge for entry and use the money to look after their collections. Should museums be free? Explain why.",
    a: {
      name: "Yusuf",
      post: "Museums should be free. Culture belongs to everyone, and an entry fee keeps away families with little money. When a museum in my city became free, the number of school groups visiting nearly doubled.",
      claim: "Museums should be free, because entry fees keep away families with little money.",
      distort: "Museums should depend only on visitors' donations.",
      key: "an entry fee keeps away families with little money",
      good: "Yusuf is right, and free entry also changes how people use a museum. When you have paid a lot, you feel you must see everything in one long visit. When it is free, you can drop in for twenty minutes to look at one room. I often visit a free gallery near my campus during lunch breaks.",
      repeat:
        "As Yusuf says, culture is for everyone, and charging for entry stops poorer families from coming, as the free museum in his city showed with its increase in school visits.",
    },
    b: {
      name: "Grace",
      post: "I think a fee is reasonable. Old paintings and objects are expensive to protect and repair. Visitors who use the museum should help pay for it, rather than every taxpayer, including those who never visit.",
      claim: "A fee is reasonable, because collections are expensive to protect and visitors, not all taxpayers, should pay.",
      distort: "Museums are not worth visiting.",
      key: "Visitors who use the museum should help pay for it",
      good: "I agree with Grace, and a fee need not apply to everyone. Many museums charge tourists but are free for local residents or for children. That way the people who use the museum most can still visit, while visitors from abroad help pay for the collection. A museum I visited last summer worked exactly like this.",
      repeat:
        "I agree with Grace because protecting and repairing old objects costs a lot of money, and it is fairer for the people who visit to pay than for all taxpayers to pay.",
    },
    offTopic:
      "I think cities should build more libraries in poorer areas. Libraries offer free books, internet access and quiet places to study.",
  },
  {
    professor: "Professor Haddad",
    question:
      "Some scientists suggest that people should eat insects as a source of protein, because farming insects uses far less land and water than farming cattle. Should insects become a normal part of our diet?",
    a: {
      name: "Nora",
      post: "Yes, they should. The planet cannot support everyone eating as much meat as people in rich countries do now. Insects provide protein with a fraction of the land, water and emissions.",
      claim: "Insects should become normal food, because they provide protein with far less land, water and emissions.",
      distort: "Everyone should stop eating all other food.",
      key: "Insects provide protein with a fraction of the land, water and emissions",
      good: "I agree with Nora, and insects can also be hidden in familiar foods. People who would never eat a whole cricket might happily eat pasta or crackers made with insect flour. I tried protein biscuits made from cricket flour at a science fair, and they tasted like ordinary biscuits.",
      repeat:
        "Nora makes the key point: people in rich countries eat more meat than the planet can support, and insects give us protein using much less land and water and producing fewer emissions.",
    },
    b: {
      name: "Felix",
      post: "I doubt it will work. Most people in Europe and North America find the idea disgusting, and food habits change very slowly. It would be more realistic to encourage people to eat more beans and lentils.",
      claim: "It is unrealistic, because many people find insects disgusting and food habits change slowly; beans are a better aim.",
      distort: "Insects are poisonous to humans.",
      key: "food habits change very slowly",
      good: "Felix is right to be careful, and we also do not yet know enough about farming insects on a large scale. Farms with billions of insects could have problems with disease or escaped insects that we cannot predict. Before a whole diet changes, scientists should study these risks, as they had to when fish farming grew.",
      repeat:
        "I agree with Felix that many people in Europe and North America think eating insects is disgusting, that eating habits are slow to change, and that beans and lentils are more realistic.",
    },
    offTopic:
      "I think people should waste less food. A large part of the food that is produced is thrown away, often because it does not look perfect.",
  },
  {
    professor: "Professor Kowalski",
    question:
      "Should governments pay households to put solar panels on their roofs, or would that money be better spent on large solar farms? Which option is better, and why?",
    a: {
      name: "Amara",
      post: "Paying households is better. Solar panels on roofs use space that is already built, so no farmland or forest is lost. They also make people more aware of how much electricity they use.",
      claim: "Paying households is better, because roofs use space already built on and owners become more aware of their energy use.",
      distort: "Large solar farms should be taken down.",
      key: "no farmland or forest is lost",
      good: "I side with Amara. Electricity from roofs is also produced close to where it is used. Less energy is lost travelling along long power lines, and new lines can take years to approve. In my grandparents' village, rooftop panels were connected in a few months, while a planned power line is still waiting for permission.",
      repeat:
        "I think like Amara: putting panels on roofs uses space that is already built on, so no farmland or forest is lost, and people start noticing how much electricity they use.",
    },
    b: {
      name: "Liam",
      post: "Large solar farms are better value. They produce electricity much more cheaply per panel, because they can be built and maintained at scale. Payments to households mostly help people who already own houses, who tend to be wealthier.",
      claim: "Solar farms are better value, because they are cheaper per panel and payments to households mostly help wealthier owners.",
      distort: "Solar power is too expensive to use at all.",
      key: "They produce electricity much more cheaply per panel",
      good: "I agree with Liam, and solar farms can also be placed where the sun is strongest. Many roofs face the wrong way or are shaded by trees and other buildings, so their panels produce less. A farm in a sunny, open area makes the most of every panel, which is how the largest project in my region was planned.",
      repeat:
        "Liam is right that solar farms make electricity at a lower cost per panel because of their size, and payments to households mostly benefit homeowners, who are usually richer.",
    },
    offTopic:
      "I think people should use their cars less. Driving produces a lot of pollution, and many short journeys could easily be made by bicycle.",
  },
  {
    professor: "Professor Rossi",
    question:
      "Translation apps are improving quickly. Some people say that in the future there will be little reason to learn a foreign language. Do you agree? Why or why not?",
    a: {
      name: "Ethan",
      post: "I partly agree. For travel and simple tasks, such as ordering food or reading signs, apps are already good enough. Most people learn languages for practical reasons, and apps meet many of those needs.",
      claim: "For practical needs such as travel, apps are good enough, so there will be less reason to learn languages.",
      distort: "Schools should stop teaching foreign languages.",
      key: "apps are already good enough",
      good: "I agree with Ethan, and apps also help where learning the language would be impossible. A doctor treating a patient who speaks a rare language cannot learn it in five minutes. My local hospital now uses a translation app in its emergency department, and the staff say it has made urgent conversations much easier.",
      repeat:
        "As Ethan says, apps already work well for travel and simple jobs like ordering food or reading signs, and since most people learn languages for practical reasons, apps cover much of what they need.",
    },
    b: {
      name: "Zara",
      post: "I disagree. Learning a language lets you understand how other people think, including their jokes and their culture. An app can translate words, but it cannot build a real friendship for you.",
      claim:
        "People will still need to learn languages, because a language brings an understanding of culture and friendships that apps cannot.",
      distort: "Translation apps are always wrong.",
      key: "it cannot build a real friendship for you",
      good: "Zara is right, and learning a language also changes how you see your own. When I studied Spanish, I started to notice how English builds its sentences, and my essays became clearer as a result. An app gives you the translation, but you learn nothing about language from it.",
      repeat:
        "Zara makes the point I agree with: a language helps you understand how people think, including their humour and culture, and an app can translate words but not make friends for you.",
    },
    offTopic:
      "I think every student should study abroad for at least one semester. Living in another country teaches independence and gives you a new view of your own home.",
  },
  {
    professor: "Professor Bauer",
    question:
      "When an old building in a city centre is no longer used, some people want to protect it, while others want to replace it with modern housing. Which do you think is usually the better choice?",
    a: {
      name: "Ines",
      post: "Old buildings should usually be protected. They give a city its character and its sense of history. Once a historic building is knocked down, it can never be brought back.",
      claim: "Old buildings should usually be protected, because they give a city its character and cannot be replaced.",
      distort: "No new buildings should be built in cities.",
      key: "it can never be brought back",
      good: "I agree with Ines, and old buildings can often be turned into homes. Former factories and offices have been converted into flats in many cities, keeping the outside while modernising the inside. An old textile mill near my home now has sixty apartments and still looks the way it did a century ago.",
      repeat:
        "Ines is right that old buildings should be kept, since they give the city its character and history, and once one is destroyed, there is no way to get it back.",
    },
    b: {
      name: "Sam",
      post: "Modern housing is usually the better choice. Many cities have a serious shortage of homes, and an empty old building helps nobody. New buildings can also be designed to use far less energy.",
      claim: "New housing is usually better, because cities lack homes and new buildings use less energy.",
      distort: "All old buildings are dangerous.",
      key: "an empty old building helps nobody",
      good: "Like Sam, I would usually build new, partly because old buildings are often expensive to make safe. Many lack proper fire exits or contain dangerous materials, and repairing them can cost more than building something new. A theatre in my town stood empty for fifteen years because nobody could afford to repair it.",
      repeat:
        "Like Sam, I believe new housing is better, because many cities do not have enough homes, an unused old building is useless to everyone, and new designs save energy.",
    },
    offTopic:
      "I believe city centres should be closed to cars. Without traffic, streets would be quieter and safer for people walking and cycling.",
  },
  {
    professor: "Professor Tanaka",
    question:
      "Some schools give students grades in physical education, just like in maths or history. Should PE be graded, or should it simply be about enjoying exercise?",
    a: {
      name: "Ben",
      post: "PE should not be graded. Grades make students who are less athletic feel like failures, and some of them stop exercising altogether. The main goal should be to build a habit of exercise for life.",
      claim: "PE should not be graded, because grades discourage less athletic students from exercising.",
      distort: "Schools should stop teaching PE.",
      key: "Grades make students who are less athletic feel like failures",
      good: "I agree with Ben, and without grades teachers can offer more kinds of activity. When everything must be measured, lessons focus on what is easy to score, such as running times. My school replaced grades with choice, and now students can try dance, climbing or yoga, and many more of them join in.",
      repeat:
        "Ben makes a good point: when PE is graded, students who are not sporty feel they have failed, some give up exercise completely, and the real aim should be a lifelong exercise habit.",
    },
    b: {
      name: "Rosa",
      post: "PE should be graded. Without grades, many students do not take it seriously, and it becomes a free period. Grades can reward effort and improvement, not just natural talent.",
      claim: "PE should be graded, because without grades students do not take it seriously, and grades can reward effort.",
      distort: "Only talented athletes should get good grades.",
      key: "Grades can reward effort and improvement",
      good: "Rosa is right, and grades also show that physical health matters as much as other subjects. When PE has no grade, students and parents learn that it is less important than maths. At my school, attendance in PE improved once it appeared on our reports alongside every other subject.",
      repeat:
        "I agree with Rosa because, without grades, students do not treat PE seriously and use it as free time, while grades can reward hard work and progress rather than only talent.",
    },
    offTopic:
      "I think schools should serve healthier lunches. Many school meals are high in fat and sugar, which is bad for students' health and concentration.",
  },
];

for (const d of discussions) {
  for (const s of [d.a, d.b]) {
    if (!s.post.includes(s.key)) throw new Error(`the key of ${s.name}'s post is not in it: ${s.key}`);
  }
}

/** end gives the period a quoted piece of a post needs when it has no closing punctuation of its own. */
const end = (words: string) => (/[.!?]$/u.test(words) ? "" : ".");

/** shown writes a discussion as it appears on the screen, then the line under it. */
const shown = (d: Discussion, line: string) =>
  `**${d.professor}:** ${d.question}\n\n**${d.a.name}:** ${d.a.post}\n\n**${d.b.name}:** ${d.b.post}\n\n${line}`;

/** bare is a reply that agrees with a student and gives no reason; three wordings keep it from being spotted by its words. */
const bare = (name: string, i: number) =>
  [
    `I agree with ${name}. ${name}'s post is very convincing, and I think most of our class would feel the same way.`,
    `${name} is completely right about this. I had the same opinion before I read the post, and now I am even more sure.`,
    `I support what ${name} wrote. It is an important question, and ${name} answers it well.`,
  ][i % 3] as string;

const positions: readonly SolvedChoice[] = interleave(
  [(d: Discussion) => [d.a, d.b] as const, (d: Discussion) => [d.b, d.a] as const].map((pick) =>
    discussions.map((d): SolvedChoice => {
      const [s, other] = pick(d);
      return {
        shown: shown(d, `**What is ${s.name}'s position?**`),
        right: s.claim,
        wrong: [other.claim, s.distort, other.distort],
        solution: t(
          `**${s.claim}** ${s.name} writes: "${s.key}${end(s.key)}" One option gives ${other.name}'s view instead, and the others go much further than either student does.`,
          `**${s.claim}** ${s.name} 写道："${s.key}${end(s.key)}" 有一个选项说的是 ${other.name} 的观点，其他选项则远远超出了两位同学所说的话。`,
        ),
      };
    }),
  ),
);

const replies: readonly SolvedChoice[] = interleave(
  [(d: Discussion) => d.a, (d: Discussion) => d.b].map((pick, side) =>
    discussions.map((d, i): SolvedChoice => {
      const s = pick(d);
      return {
        shown: shown(d, `*You agree with ${s.name}.* **Which reply adds most to the discussion?**`),
        right: s.good,
        wrong: [s.repeat, d.offTopic, bare(s.name, i + side)],
        solution: t(
          `**This reply agrees with ${s.name} and adds a reason that neither student gave, with an example to support it.** A strong post takes a side and moves the discussion forward.`,
          `**这条回复赞同 ${s.name}，并补充了两位同学都没有提到的理由，还举例加以支持。** 好的帖子既表明立场，又推动讨论向前。`,
        ),
        whyNot: [
          t(
            `This reply only says ${s.name}'s reasons again in other words, so it adds nothing new.`,
            `这条回复只是换了说法，把 ${s.name} 的理由又说了一遍，没有任何新内容。`,
          ),
          t("This reply answers a different question, not the professor's.", "这条回复回答的是另一个问题，而不是教授提出的问题。"),
          t("This reply agrees but gives no reason or example of its own.", "这条回复表示赞同，却没有给出自己的理由或例子。"),
        ],
      };
    }),
  ),
);

const question = t("Read the class discussion and answer the question below it.", "阅读课堂讨论，回答下方的问题。");

/** discussionReplies is the TOEFL topic of reading an academic discussion and choosing a reply that adds to it. */
export const discussionReplies: TopicDef = examTopic({
  id: "toefl-reading-the-discussion",
  title: t("Reading the Discussion and Adding to It", "读懂讨论并推进讨论"),
  summary: t(
    "Before writing for an Academic Discussion: stating each student's position, and telling a reply that adds a new reason from one that repeats, wanders or only agrees.",
    "在写学术讨论之前：说出每位同学的立场，并分辨哪条回复补充了新理由，哪条只是重复、跑题或单纯表示赞同。",
  ),
  strand: "writing",
  prerequisites: ["counterclaims-and-rebuttals"],
  encompasses: [{ topic: "counterclaims-and-rebuttals", weight: 0.2 }],
  xp: 12,
  points: [
    point(
      "toefl-stating-a-position",
      t("Stating Each Student's Position", "说出每位同学的立场"),
      t(
        "In the Academic Discussion task, a professor asks a question and two students reply before you do. Your post must take part in that discussion, so first be clear what each student actually claims. Find the sentence that gives the student's answer and the reason given for it. Do not confuse the two students, and do not make a student's view stronger than it is: *a fee is reasonable* is not *museums are not worth visiting*.",
        "在学术讨论题中，教授先提出问题，两位同学在你之前作答。你的帖子要加入这场讨论，所以先要弄清每位同学究竟主张什么。找到给出该同学答案的那句话，以及他给出的理由。不要把两位同学弄混，也不要把同学的观点说得比原文更绝对：*a fee is reasonable* 并不等于 *museums are not worth visiting*。",
      ),
      solvedChoiceGenerator(question, positions),
    ),
    point(
      "toefl-adding-to-the-discussion",
      t("Adding to the Discussion", "推进讨论"),
      t(
        "A strong reply takes a side and **adds something new**: a reason neither student gave, supported by an example. Three kinds of reply fall short:\n\n- one that **repeats** a classmate's reasons in other words\n- one that **wanders** to a different question\n- one that **only agrees**, with no reason or example of its own\n\nIf you agree with a classmate, say so briefly, then spend your words on the new point.",
        "好的回复要表明立场，并**补充新内容**：两位同学都没有提到的理由，再用一个例子来支持。有三种回复不合格：\n\n- 换个说法**重复**同学的理由\n- **跑题**去回答另一个问题\n- **只是赞同**，没有自己的理由或例子\n\n如果你赞同某位同学，简短说一句即可，把篇幅留给新的观点。",
      ),
      solvedChoiceGenerator(question, replies),
    ),
  ],
});
