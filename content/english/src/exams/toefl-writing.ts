// TOEFL Writing, judged by a model: an email that does what a situation asks, and a post to an academic discussion
// that answers a professor and adds to what two classmates said. Every task and model answer is written for this course.

import { type TopicDef, t } from "@ga/content";
import type { WritingItem } from "@ga/subject-english";
import { judgedExamTopic } from "./kit.ts";

/** email builds the task of an email from its situation, its reader and the three things it must do. */
function email(situation: string, to: string, points: readonly [string, string, string], model: string): WritingItem {
  return {
    task: `${situation}\n\nWrite an email to ${to}. In your email, do the following:\n\n- ${points.join("\n- ")}`,
    model,
  };
}

const emailBank: readonly WritingItem[] = [
  email(
    "You missed your biology class yesterday because you were ill.",
    "your professor, Dr. Evans",
    [
      "Explain why you missed the class.",
      "Ask what you need to do to catch up.",
      "Ask whether you can hand in this week's lab report late.",
    ],
    "Dear Dr. Evans,\n\nI am sorry that I missed yesterday's biology class. I woke up with a high fever and a bad cough, and my doctor told me to stay at home for two days. I am feeling better now and expect to be back in class on Monday.\n\nCould you tell me what I need to do to catch up? If there were any slides or handouts, I would be grateful if you could send them to me, and I will ask a classmate for their notes as well.\n\nI also wanted to ask whether I could hand in this week's lab report a few days late. Because I was ill, I could not finish the experiment. Would next Wednesday be acceptable?\n\nThank you for your understanding.\n\nBest regards,\nMaria Lopez",
  ),
  email(
    "The heater in your room in student housing has stopped working, and the weather is very cold.",
    "the housing office",
    ["Describe the problem.", "Explain how it is affecting you.", "Ask when it can be repaired."],
    "Dear Housing Office,\n\nI am writing to report a problem in my room, number 214 in North Hall. The heater stopped working on Sunday evening. It makes a low noise when I turn it on, but it does not produce any heat at all, even on the highest setting.\n\nSince the weather turned cold this week, my room has become very uncomfortable. At night the temperature is so low that I have trouble sleeping, and I cannot study at my desk in the evenings, so I have been going to the library until it closes.\n\nCould you please let me know when someone can come to repair it? I am in my room every morning before ten, but I am happy for a worker to enter while I am out.\n\nThank you for your help.\n\nSincerely,\nDaniel Kim",
  ),
  email(
    "You and your classmate Sam must give a presentation together in two weeks, but you have not started planning it.",
    "Sam",
    ["Suggest a time to meet this week.", "Suggest how you could divide the work.", "Ask Sam which part he would prefer."],
    "Hi Sam,\n\nI hope your week is going well! I just realized that our presentation is only two weeks away, so I think we should start planning it soon.\n\nAre you free on Thursday afternoon? We could meet in the library at three and spend an hour making a plan. If that doesn't work for you, I'm also free on Friday morning.\n\nI was thinking we could divide the work into two parts. One of us could research the history of the topic and the other could look at the situation today. Then we could make the slides together at the end, so that they look the same.\n\nWhich part would you prefer? I'm happy to do either one, so just let me know.\n\nSee you soon,\nAlex",
  ),
  email(
    "You returned a library book on time, but the library has charged you a fine for returning it late.",
    "the library",
    ["Explain the situation.", "Give details that show you returned the book on time.", "Ask the library to remove the fine."],
    "Dear Library Staff,\n\nI am writing about a fine that has been added to my library account. Yesterday I received an email saying that I owed a fine for returning the book A History of Science late. However, I believe that I returned it on time.\n\nThe book was due on March 10, and I returned it on the evening of March 9. Because the front desk was closed, I put it in the return box outside the main entrance. I remember the date clearly because it was the day before my chemistry exam. It is possible that the book was not checked in until a few days later.\n\nWould you please check your records and remove the fine from my account? I would be happy to come to the library if you need more information.\n\nThank you,\nPriya Shah",
  ),
  email(
    "You would like to join the university hiking club, but you do not know much about it.",
    "the president of the club, Jordan",
    ["Introduce yourself.", "Ask when and how often the club goes hiking.", "Ask what equipment you need."],
    "Dear Jordan,\n\nMy name is Tom Becker, and I am a first-year student in the engineering department. I saw a poster for the hiking club in the student center, and I would really like to join. I grew up near the mountains and went hiking with my family most weekends, but I have not found anyone to hike with since I arrived here.\n\nCould you tell me when the club usually goes hiking and how often? I have classes on Saturday mornings this semester, so I would like to know whether most trips are on Saturdays or Sundays.\n\nI would also like to know what equipment I need. I have good boots and a backpack, but I do not have a tent. Does the club lend equipment to new members?\n\nThank you, and I hope to meet you soon.\n\nBest wishes,\nTom Becker",
  ),
  email(
    "You are applying for a summer program in environmental science, and you need a letter of recommendation.",
    "Professor Ahmed, who taught you last semester",
    ["Explain what the program is.", "Explain why you are asking her in particular.", "Tell her when the letter is needed."],
    "Dear Professor Ahmed,\n\nI hope you are well. I am writing to ask whether you would be willing to write a letter of recommendation for me.\n\nI am applying for a summer program in environmental science at Lakeside University. It is a six-week program in which students take part in research on water quality in local rivers, and only twenty students are accepted each year.\n\nI am asking you in particular because your course on ecology last semester was the one that made me want to study this field. I worked very hard on my final project about river pollution, and I believe you know my work and my interest in the subject better than any of my other professors.\n\nThe deadline for the letter is April 15. I can send you my application and my project if that would help.\n\nThank you for considering my request.\n\nSincerely,\nLena Park",
  ),
  email(
    "Your friend Chris, who lives in another city, is coming to visit you next month for a weekend.",
    "Chris",
    ["Suggest some things you could do together.", "Ask what time Chris will arrive.", "Offer Chris a place to stay."],
    "Hi Chris,\n\nI'm so happy you're coming to visit next month! It's been far too long since we last saw each other.\n\nThere's a lot we could do while you're here. On Saturday we could walk along the river to the old town, where there's a great market in the morning. In the evening, there's a jazz club near my apartment that I think you would love. If the weather is good on Sunday, we could also rent bikes and ride out to the lake.\n\nWhat time will you arrive on Friday? If you're coming by train, I can meet you at the station.\n\nAlso, you're very welcome to stay at my place. I have a comfortable sofa bed in the living room, so you don't need to book a hotel.\n\nLooking forward to it,\nJamie",
  ),
  email(
    "The campus café has advertised a part-time job, and you would like to apply.",
    "the manager of the café, Ms. Rivera",
    ["Describe your experience.", "Explain when you are available to work.", "Ask a question about the job."],
    "Dear Ms. Rivera,\n\nI am writing to apply for the part-time job at the campus café that I saw advertised on the student website.\n\nI have worked in cafés before. Last summer I worked at a busy coffee shop in my hometown for three months, where I made drinks, served customers and handled money. I enjoy working with people, and I am used to staying calm when there is a long line.\n\nThis semester, my classes finish at one o'clock every day, so I am available to work on weekday afternoons and evenings. I could also work on Sunday if needed.\n\nI would like to ask how many hours a week the job involves. I would prefer to work about fifteen hours a week so that I have enough time for my studies.\n\nThank you for considering my application.\n\nBest regards,\nOmar Haddad",
  ),
  email(
    "You have just found out that two of your final exams are at the same time on the same day.",
    "the course coordinator, Mr. Grant",
    ["Explain the problem.", "Suggest a possible solution.", "Ask him to reply by a certain date."],
    "Dear Mr. Grant,\n\nI am writing because I have found a problem with my final exam schedule. My exam for History 210 and my exam for Psychology 105 are both on December 12 at nine in the morning, in different buildings, so I cannot take both of them.\n\nI would like to suggest a possible solution. I noticed that the Psychology 105 exam is also given to a second group on December 14. Would it be possible for me to take the exam with that group instead? I have no other exams that day.\n\nSince I need to plan my studying and book my journey home after the exams, I would be very grateful if you could reply by November 30.\n\nThank you for your help.\n\nSincerely,\nGrace Liu",
  ),
  email(
    "Last week you borrowed a book from your classmate Ben, and now you cannot find it.",
    "Ben",
    ["Apologize and explain what happened.", "Offer a solution.", "Ask Ben whether he needs the book soon."],
    "Hi Ben,\n\nI'm really sorry, but I have some bad news about the book you lent me last week. I think I left it on the bus on Tuesday. I had it in my hands when I got on, but when I got home it wasn't in my bag. I've called the bus company, but nobody has handed it in so far.\n\nOf course, I'll replace it. I've already looked online, and I can order a new copy that would arrive in about five days. If you'd prefer, I can give you the money instead, and you can buy it yourself.\n\nDo you need the book soon? If you need it for this week's essay, you're welcome to use my notes, and I can show you where the library keeps its copy.\n\nSorry again,\nNina",
  ),
  email(
    "You attended a workshop on study skills organized by the student center last weekend.",
    "the organizer of the workshop, Ms. Taylor",
    ["Thank her and say what you found most useful.", "Make a suggestion for improving the workshop.", "Ask about future events."],
    "Dear Ms. Taylor,\n\nThank you for organizing the study skills workshop last Saturday. I found it very helpful, especially the part about planning my week. Since the workshop, I have started making a schedule every Sunday evening, and I already feel much less stressed about my deadlines.\n\nI would like to make one suggestion. The workshop was very full, and there was not much time for questions at the end. It might be better to have smaller groups, or to add a short break for questions after each part, so that students can ask about the ideas while they are fresh.\n\nI would also like to know whether the student center is planning any similar events this semester. I would be especially interested in a workshop on writing research papers.\n\nBest regards,\nSofia Rossi",
  ),
  email(
    "You have already told your professor the topic of your research paper, but now you would like to change it.",
    "your professor, Dr. Nakamura",
    ["Describe the new topic.", "Explain why you want to change.", "Ask whether she agrees to the change."],
    "Dear Dr. Nakamura,\n\nI am writing about my research paper for your sociology course. Two weeks ago I told you that I planned to write about social media and friendship, but I would now like to change my topic.\n\nMy new topic is how young people in cities use public libraries. I would like to look at why some libraries attract many teenagers while others do not, and I hope to interview staff at two local libraries.\n\nThe main reason for the change is that I found very little research on my first topic that I could use, while there is a lot of useful material on libraries. I also volunteer at a library on weekends, so I am very interested in the subject and can easily speak to the staff.\n\nWould you agree to this change? I can send you a short plan by Friday.\n\nThank you,\nKevin Brown",
  ),
];

/** discussion builds the source of an academic discussion from the professor's post and two classmates' posts. */
function discussion(course: string, professor: string, first: string, second: string, model: string): WritingItem {
  return {
    task: `Your professor is teaching a class on ${course}. Write a post responding to the professor's question.`,
    source: `${professor}\n\n${first}\n\n${second}`,
    model,
  };
}

const discussionBank: readonly WritingItem[] = [
  discussion(
    "education",
    "Professor Reed: Many universities require all students to study a foreign language, whatever their major. Some people say this is a waste of time for students of science or business. Should universities require every student to take a foreign language? Why or why not?",
    "Hannah: Yes. Learning a language teaches you about another culture, and that makes you more open-minded. Every educated person should have that experience, no matter what they study.",
    "Leo: I disagree. Students only have four years, and one or two language courses are not enough to learn a language well. That time would be better spent on courses in their own field.",
    "I agree with Hannah that universities should require a foreign language, but I would give a more practical reason. Leo is right that two courses will not make anyone fluent, but that is not the point. Even a basic level can make a big difference at work. Many science and business graduates end up working in international teams, and being able to greet a colleague or read a simple email in their language builds trust. In addition, studying a language teaches skills that are useful in every field, such as memorizing large amounts of information and dealing with mistakes. My cousin, an engineer, says that her two years of Japanese helped her get a job with a company that works with partners in Tokyo. So the time is not wasted at all.",
  ),
  discussion(
    "city planning",
    "Professor Ortiz: Several cities have banned private cars from their centers, allowing only buses, bicycles and people on foot. Supporters say this makes cities cleaner and safer, but some businesses worry about losing customers. Do you think cities should ban cars from their centers? Why or why not?",
    "Ana: I think it's a great idea. The air in city centers is terrible, and streets without cars are much safer for children and older people.",
    "Marcus: I understand the benefits, but many people need their cars, for example parents with small children or people who live far from a bus line. A ban would make the center hard to reach for them.",
    "In my opinion, cities should ban cars from their centers, but only if they improve public transport first. Marcus makes an important point: a ban is unfair if people have no other way to reach the center. However, that is a reason to plan the change carefully, not to avoid it. If a city adds more frequent buses, safe bicycle lanes and parking at the edge of the center, almost everyone can still get there easily. I also think the worry about businesses is often wrong. When a street near my home was closed to cars, people started walking there in the evenings, and new cafés and shops opened. Streets that are pleasant to walk in attract more customers, not fewer. So a well-planned ban helps both residents and businesses.",
  ),
  discussion(
    "business",
    "Professor Chen: When a new company is successful, its founders must decide how fast to grow. Some companies grow very quickly, hiring many workers and opening in new places, while others grow slowly and carefully. Which approach do you think is better for a new company, and why?",
    "Zoe: Growing quickly is better. If you are slow, a competitor will copy your idea and take your customers before you can reach them.",
    "Ryan: I prefer slow growth. Many companies that grow too fast run out of money or cannot keep the quality of their products high, and then they fail.",
    "I believe that slow, careful growth is usually the better choice for a new company. Zoe is right that competitors can copy a good idea, but customers do not stay with a company just because it was first; they stay because its products are good. That is why I agree with Ryan, and I would add another reason: company culture. When a company hires hundreds of people in a few months, the new workers often do not understand its values, and the friendly, creative atmosphere that made it successful can disappear. A small bakery in my town is a good example. It opened one new shop every two years, trained every new baker itself, and is now loved across the region, while a rival chain that opened ten shops at once closed after three years.",
  ),
  discussion(
    "psychology",
    "Professor Walsh: People often say that we learn more from our failures than from our successes. Others argue that success teaches us what works and gives us the confidence to keep going. Do people learn more from failure or from success? Explain your view.",
    "Mia: Failure is a better teacher. When something goes wrong, you are forced to think about what you did and why, but when you succeed, you usually just celebrate and move on.",
    "Ethan: I think success matters more. If you fail again and again, you lose confidence and might give up. Success shows you that your efforts work.",
    "I think people learn more from failure, but only when they are given the chance to reflect on it. I agree with Mia that failure makes us ask questions that success never does. However, Ethan's point is also important, because repeated failure without support can simply make people give up. In my view, the difference lies in what happens after a failure. When I failed my first driving test, my instructor went through every mistake with me, and I practiced those exact situations. I passed easily the second time, and I am a much more careful driver because of it. If I had passed the first time, I would never have noticed those weaknesses. So failure is the better teacher, as long as someone helps us understand it.",
  ),
  discussion(
    "environmental science",
    "Professor Hughes: Individuals can do many things to protect the environment, such as eating less meat, using public transport or buying fewer new products. Which one action do you think individuals can take that would help the environment the most? Why?",
    "Olivia: I think using public transport instead of driving is the most important. Cars produce a large share of the gases that warm the planet, and it's something most people can change.",
    "Noah: In my view, buying fewer things is the most important. Making every product uses energy and materials, and most of what we buy ends up as waste very quickly.",
    "Olivia and Noah both make good suggestions, but I believe that eating less meat would help the environment the most. Producing meat, especially beef, needs huge areas of land for animals and for growing their food, and forests are often cut down to make room for farms. Cattle also release large amounts of a gas that warms the planet. Unlike Olivia's suggestion, this change does not depend on whether a person lives near a good bus line, so almost anyone can do it. It is also easy to start: a family can simply replace meat with beans or vegetables two or three days a week. My family began doing this last year, and we found that we also spent less money on food. Small changes in diet, made by millions of people, can make a real difference.",
  ),
  discussion(
    "education and technology",
    "Professor Grant: Some schools have banned students from using phones during the school day, while others allow phones in class for learning activities. Do you think schools should allow students to use phones in the classroom? Why or why not?",
    "Lucas: Phones should be banned. Students spend the whole class checking messages and playing games instead of listening to the teacher.",
    "Emma: Phones can be useful learning tools. Students can look up information, use dictionaries and take photos of the board. Banning them seems old-fashioned.",
    "I think schools should allow phones in the classroom, but only when the teacher asks students to use them. Lucas is right that phones are very distracting, and students who check messages during a lesson learn much less. On the other hand, as Emma says, phones can be powerful tools. The answer, in my opinion, is clear rules rather than a complete ban. In my high school, phones stayed in our bags unless the teacher told us to take them out for a task, such as answering a quick quiz or checking a fact. Anyone who used a phone at other times lost it until the end of the day. This system worked well: classes were calm, but we still learned to use our phones for studying, which is an important skill for university.",
  ),
  discussion(
    "sociology",
    "Professor Adams: Some people spend their whole lives in the town where they grew up, while others move many times to different cities or countries. Is it better to stay in one place or to move often? Explain your opinion.",
    "Sara: I think staying in one place is better. You have your family and old friends around you, and you feel that you really belong to a community.",
    "Jake: Moving is better. Every time you move, you meet new people and learn new things, and you become more independent.",
    "In my opinion, it is better to move at least once, especially when you are young, even if you later return home. Sara is right that a strong community is valuable, and I do not think people should move often just for the sake of it. However, living somewhere new teaches lessons that are hard to learn at home. When I moved to another city for a year as an exchange student, I had to solve problems on my own, from opening a bank account to making friends with people very different from me. That experience made me more confident and more understanding of others. I would add to Jake's point that moving also helps you appreciate your home town, because you see it with new eyes when you come back.",
  ),
  discussion(
    "media studies",
    "Professor Bell: Many news websites now ask readers to pay to read their articles, while others are free and earn money from advertising. Should people have to pay for online news? Why or why not?",
    "Chloe: Yes. Good journalism costs a lot of money. If nobody pays for it, newspapers will close, and we will only have low-quality free news.",
    "Daniel: I disagree. News is important for everyone, not just people who can pay. If the best news is only for paying readers, poorer people will be less informed.",
    "I believe that people should pay for online news, but news websites should also find ways to keep important stories free. Chloe is right that serious journalism is expensive: reporters may spend months investigating a single story. Websites that depend on advertising often publish shocking headlines just to get clicks, which lowers the quality of the news. At the same time, Daniel raises a fair concern. A good solution is the one that some newspapers already use: most articles are for paying readers, but news about emergencies, health and elections is free for everyone. Some papers also offer cheap or free subscriptions to students. In this way, readers who can pay support quality journalism, and nobody is left without the information they need.",
  ),
  discussion(
    "public health",
    "Professor Morgan: Some governments have introduced a tax on sugary drinks to reduce the amount of sugar people consume. Critics say that people should be free to choose what they drink. Do you think governments should tax sugary drinks? Why or why not?",
    "Ella: I support the tax. Too much sugar leads to serious health problems, and the tax could be used to pay for healthy food in schools.",
    "Sam: I don't think it's the government's job to tell people what to drink. Adults can make their own decisions, and the tax is unfair to people who drink these drinks only occasionally.",
    "I think governments should tax sugary drinks, mainly because of their effect on children. Sam argues that adults should decide for themselves, and I agree that adults have that right. However, children are the biggest consumers of these drinks, and they do not understand the long-term risks to their teeth and their weight. A tax works mainly by changing the price, and young people with little money are especially sensitive to prices. I would also add something to Ella's point: in some countries, companies reacted to the tax by making their drinks less sweet, which helped even people who kept buying them. And because the tax is small, people who only drink a soda occasionally hardly notice it. So the tax protects health without taking away anyone's freedom to choose.",
  ),
  discussion(
    "history",
    "Professor King: Over the last two hundred years, many inventions have changed the way people live, such as the train, electric light and the telephone. Which invention of this period do you think has changed daily life the most? Why?",
    "Isabel: I would choose the internet. It has changed how we work, study, shop and communicate with each other.",
    "Mark: I think electric light changed life the most. Before it, people's days ended when the sun went down, and working or reading at night was difficult and dangerous.",
    "Both electricity and the internet are good choices, but I would argue that the washing machine changed daily life the most. This may sound surprising, but before it, washing a family's clothes by hand took a whole day every week, usually the work of women. Boiling the water, scrubbing and drying everything was exhausting. When washing machines became common, millions of women suddenly had many more free hours. Many of them used this time to study or take paid jobs, which changed family life and the role of women in society. Isabel's choice, the internet, is very important, but it mostly changed how we do things we already did, like talking and shopping. The washing machine gave people time to do completely new things.",
  ),
  discussion(
    "management",
    "Professor Diaz: Since many companies allowed employees to work from home, a debate has continued about whether this is good for workers. Is working from home better for employees than working in an office? Explain your view.",
    "Ruby: Working from home is better. Employees save hours every week that they used to spend traveling, and they can organize their day around their family.",
    "Owen: I think it's worse. People at home feel lonely, and they miss the chance to learn from colleagues by watching them and asking quick questions.",
    "I believe that a mix of the two is best for most employees. Ruby is right that working from home saves time and makes family life easier. My mother, for example, no longer spends two hours a day on the train, and she can now pick up my little brother from school. However, I think Owen's point is especially true for young workers. When I did an internship last summer, I learned most of what I know by sitting near experienced colleagues and listening to how they spoke to customers. That would have been very difficult from my bedroom. If employees work from home two or three days a week and spend the other days in the office, they get the freedom Ruby describes and the learning that Owen values.",
  ),
  discussion(
    "science policy",
    "Professor Lee: Governments spend large amounts of money on space exploration, such as sending robots to Mars. Some people believe that this money should be spent on solving problems on Earth instead. What is your opinion? Should governments continue to fund space exploration?",
    "Aiden: We should spend the money on Earth. Millions of people do not have enough food or clean water, and these problems are more urgent than exploring other planets.",
    "Julia: Space exploration is worth it. It inspires young people to study science, and some day we may need to live on other planets.",
    "I think governments should continue to fund space exploration, because it helps solve problems on Earth too. Aiden is right that hunger and clean water are urgent, but space budgets are actually quite small compared with what governments spend on health or defense, so stopping them would not solve these problems. More importantly, many technologies developed for space are now used in daily life. Satellites help farmers to plan when to water their crops and warn people about storms, and systems that clean water for astronauts have been used in areas without safe drinking water. I would add to Julia's point that space research is a long-term investment. We cannot know today which discoveries will be useful tomorrow, so cutting this funding could cost us more in the future.",
  ),
];

/** writingAnEmail is the Write an Email task of TOEFL Writing. */
export const writingAnEmail: TopicDef = judgedExamTopic({
  id: "toefl-writing-an-email",
  title: t("TOEFL: Writing an Email", "托福：写电子邮件"),
  summary: t(
    "Write an email of about 100 words or more in a few minutes that does each thing a situation asks, to a professor, a classmate or an office.",
    "在几分钟内写一封约 100 词或更长的邮件，完成情境要求的每一件事，收信人是教授、同学或某个办公室。",
  ),
  prerequisites: ["writing-a-formal-email"],
  encompasses: [{ topic: "writing-a-formal-email", weight: 0.4 }],
  criteria: ["toefl-email-all-tasks", "toefl-email-register", "toefl-email-clear"],
  point: {
    id: "email",
    title: t("An email for a situation", "按情境写邮件"),
    explanation: t(
      "You have about 7 minutes. Read the situation and the three things you must do, then write:\n\n1. **A greeting that suits the reader**: *Dear Dr. Evans* for a professor or an office, *Hi Sam* for a classmate.\n2. **The purpose in the first sentence or two**: *I am writing to ...*, *I'm sorry, but ...*\n3. **One short paragraph for each thing you must do**, with a detail that makes it real: a date, a room number, a reason.\n4. **A polite closing**: *Thank you for your help. Best regards,* and your name.\n\nUse full forms and polite requests (*Could you ...? Would it be possible ...?*) for a professor; contractions are fine for a friend.",
      "时间约 7 分钟。读懂情境和必须完成的三件事，然后这样写：\n\n1. **符合收信人的称呼**：给教授或办公室写 *Dear Dr. Evans*，给同学写 *Hi Sam*。\n2. **开头一两句说明目的**：*I am writing to ...*、*I'm sorry, but ...*\n3. **每件事写一小段**，加上使内容具体的细节：日期、房间号、理由。\n4. **礼貌的结尾**：*Thank you for your help. Best regards,* 再写上你的名字。\n\n给教授写信时用完整形式和礼貌的请求（*Could you ...? Would it be possible ...?*）；给朋友写信可以用缩写。",
    ),
  },
  question: t(
    "Write an email of about 100 words or more in English, as in the TOEFL Write an Email task. You have about 7 minutes.",
    "按照托福 Write an Email 的要求，用英语写一封约 100 词或更长的邮件。时间约 7 分钟。",
  ),
  bank: emailBank,
  limits: { minWords: 80, maxChars: 1600 },
  xp: 15,
  what: t("email", "邮件"),
});

/** academicDiscussion is the Writing for an Academic Discussion task of TOEFL Writing. */
export const academicDiscussion: TopicDef = judgedExamTopic({
  id: "toefl-academic-discussion",
  title: t("TOEFL: Writing for an Academic Discussion", "托福：学术讨论写作"),
  summary: t(
    "Write a post of about 100 words or more that answers a professor's question with a clear opinion and a reason, and adds something to what two classmates said.",
    "写一篇约 100 词或更长的帖子，用明确的观点和理由回答教授的问题，并在两位同学的发言之外补充新的内容。",
  ),
  prerequisites: ["writing-an-opinion-paragraph", "counterclaims-and-rebuttals"],
  encompasses: [
    { topic: "writing-an-opinion-paragraph", weight: 0.4 },
    { topic: "counterclaims-and-rebuttals", weight: 0.2 },
  ],
  criteria: ["toefl-discussion-opinion", "toefl-discussion-support", "toefl-discussion-contribution"],
  point: {
    id: "discussion-post",
    title: t("A post to a class discussion", "课堂讨论帖"),
    explanation: t(
      "You have 10 minutes. Read the professor's question and both classmates' posts, then write one paragraph:\n\n1. **Your opinion in the first sentence**: *In my opinion, cities should ...*\n2. **A link to a classmate**: agree or disagree with one of them by name (*Marcus makes an important point, but ...*).\n3. **Something new**: a reason or an example that neither classmate gave, explained in two or three sentences. A short example from your own life works well.\n4. **A final sentence** that brings it back to your opinion.\n\nDo not only repeat what the classmates said: the post must add to the discussion.",
      "时间 10 分钟。读懂教授的问题和两位同学的帖子，然后写一段：\n\n1. **第一句写出你的观点**：*In my opinion, cities should ...*\n2. **联系一位同学**：点名同意或反对其中一位（*Marcus makes an important point, but ...*）。\n3. **新的内容**：给出两位同学都没有提到的理由或例子，用两三句话展开。用自己生活中的一个简短例子效果很好。\n4. **最后一句**回到你的观点。\n\n不要只重复同学的话：你的帖子必须为讨论增添新内容。",
    ),
  },
  question: t(
    "Write a post of about 100 words or more in English, as in the TOEFL Academic Discussion task. You have 10 minutes.",
    "按照托福学术讨论写作的要求，用英语写一篇约 100 词或更长的帖子。时间 10 分钟。",
  ),
  bank: discussionBank,
  limits: { minWords: 100, maxChars: 1800 },
  xp: 20,
  what: t("post", "帖子"),
});
