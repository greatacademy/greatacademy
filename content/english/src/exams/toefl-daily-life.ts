// TOEFL Reading: Read in Daily Life. Short everyday texts, such as notices, emails, messages and adverts, each with
// three questions on details and three on what the text suggests but does not say.

import { type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { examTopic, interleave, type SolvedChoice, solvedChoiceGenerator } from "./kit.ts";

/** end gives the period a quoted piece of evidence needs when it has no closing punctuation of its own. */
const end = (evidence: string) => (/[.!?…]$/u.test(evidence) ? "" : ".");

/** Question is a question, its right option, three wrong ones, and the words of the text that decide it. */
type Question = readonly [question: string, right: string, wrong: readonly [string, string, string], evidence: string];

/** Everyday is a short everyday text with three questions on details and three on inferences. */
interface Everyday {
  readonly text: string;
  readonly details: readonly [Question, Question, Question];
  readonly inferences: readonly [Question, Question, Question];
}

const texts: readonly Everyday[] = [
  {
    text: "**Notice to all students**\n\nFrom Monday 3 March, the second floor of the Hale Library will be closed for repairs to the heating system. The work is expected to take three weeks. Group study rooms on that floor can no longer be booked; students who already have bookings will be moved to rooms in the Science Building. The silent reading room on the first floor will stay open until 10 p.m. instead of 8 p.m. during the repairs. We apologise for any inconvenience.",
    details: [
      [
        "Why will part of the library be closed?",
        "The heating system needs repairs.",
        ["The rooms are being painted.", "There are not enough staff.", "The Science Building is being moved."],
        "will be closed for repairs to the heating system",
      ],
      [
        "What will happen to existing bookings of group study rooms?",
        "They will be moved to another building.",
        ["They will be cancelled.", "They will move to the first floor.", "They will be delayed by three weeks."],
        "students who already have bookings will be moved to rooms in the Science Building",
      ],
      [
        "How long will the work probably last?",
        "Three weeks.",
        ["Three days.", "Until 10 p.m.", "Until Monday."],
        "The work is expected to take three weeks",
      ],
    ],
    inferences: [
      [
        "Why will the silent reading room stay open later during the repairs?",
        "To make up for the space that is closed.",
        [
          "Because the heating works better at night.",
          "Because the group rooms are now silent.",
          "Because the Science Building closes early.",
        ],
        "will stay open until 10 p.m. instead of 8 p.m. during the repairs",
      ],
      [
        "What can be inferred about the second floor?",
        "It is usually used for group study.",
        ["It has no heating at all.", "It will close for good.", "It is the quietest part of the library."],
        "Group study rooms on that floor can no longer be booked",
      ],
      [
        "Who most likely wrote the notice?",
        "The people who run the library.",
        ["A student group.", "Teachers in the Science Building.", "A heating company."],
        "We apologise for any inconvenience",
      ],
    ],
  },
  {
    text: "Hi Jordan,\n\nI think I left my blue umbrella in your car after you drove me home on Friday. Could you have a look when you get a chance? It's not urgent, as the forecast is dry until the weekend, but it was a present from my grandmother, so I'd hate to lose it. I'll be at the sports centre on Wednesday evening if you're going too.\n\nThanks,\nMaya",
    details: [
      [
        "What does Maya think she left in Jordan's car?",
        "An umbrella.",
        ["A jacket.", "A present for her grandmother.", "Her sports bag."],
        "I left my blue umbrella in your car",
      ],
      [
        "When did Jordan drive Maya home?",
        "On Friday.",
        ["On Wednesday.", "At the weekend.", "This morning."],
        "after you drove me home on Friday",
      ],
      [
        "Who gave Maya the umbrella?",
        "Her grandmother.",
        ["Jordan.", "A friend at the sports centre.", "Her mother."],
        "it was a present from my grandmother",
      ],
    ],
    inferences: [
      [
        "Why does Maya say the request is not urgent?",
        "She does not expect rain soon.",
        ["She has another umbrella at home.", "She does not care about the umbrella.", "She will not see Jordan for a month."],
        "the forecast is dry until the weekend",
      ],
      [
        "Why does Maya mention the sports centre?",
        "Jordan could give the umbrella back there.",
        ["She lost the umbrella there.", "She wants Jordan to join a team.", "It is near Jordan's home."],
        "I'll be at the sports centre on Wednesday evening if you're going too",
      ],
      [
        "How does Maya feel about the umbrella?",
        "It has special value for her.",
        ["It is too old to keep.", "She would like a new one.", "She is angry that Jordan took it."],
        "it was a present from my grandmother, so I'd hate to lose it",
      ],
    ],
  },
  {
    text: "**Riverside Café: Student Offers**\n\nShow your student card to get 10% off any hot drink before 11 a.m. Our lunch deal (soup, a sandwich and a piece of fruit) costs £6.50 and is served from 12 to 2 p.m., Monday to Friday. Bring your own cup and save a further 20p. Please note that we only accept card payments.",
    details: [
      [
        "What do students need to get the morning discount?",
        "A student card.",
        ["Their own cup.", "Cash.", "A lunch voucher."],
        "Show your student card to get 10% off",
      ],
      [
        "What is included in the lunch deal?",
        "Soup, a sandwich and fruit.",
        ["A hot drink and a sandwich.", "Soup and a hot drink.", "A sandwich and a cake."],
        "soup, a sandwich and a piece of fruit",
      ],
      [
        "How can customers save 20p?",
        "By bringing their own cup.",
        ["By paying by card.", "By arriving before 11 a.m.", "By ordering the lunch deal."],
        "Bring your own cup and save a further 20p",
      ],
    ],
    inferences: [
      [
        "What can be inferred about the lunch deal?",
        "It is not served at weekends.",
        ["It is only for students.", "It includes a hot drink.", "It can be paid for in cash."],
        "served from 12 to 2 p.m., Monday to Friday",
      ],
      [
        "A student who has only cash wants a coffee. What will most likely happen?",
        "The student will not be able to pay.",
        ["The student will get 10% off.", "The student will save 20p.", "The student will pay £6.50."],
        "we only accept card payments",
      ],
      [
        "What does the word *further* suggest about the 20p saving?",
        "It can be added to another discount.",
        ["The cup costs 20p.", "The price rises by 20p after 11 a.m.", "Only one discount is allowed."],
        "save a further 20p",
      ],
    ],
  },
  {
    text: "**Sam (4:12 p.m.):** The landlord just called. Someone's coming to fix the washing machine tomorrow between 9 and 12.\n**Lee (4:20 p.m.):** I've got an exam at 10. Can you be in?\n**Sam (4:21 p.m.):** I've got work till 11, but I'll ask if I can start later.\n**Lee (4:35 p.m.):** Thanks! If not, my sister could let them in. She has a key.",
    details: [
      [
        "Why is someone coming to the flat?",
        "To repair the washing machine.",
        ["To meet the landlord.", "To deliver a key.", "To clean the flat."],
        "Someone's coming to fix the washing machine",
      ],
      [
        "Why can't Lee be at home?",
        "Lee has an exam.",
        ["Lee has to work until 11.", "Lee is meeting a sister.", "Lee has lost the key."],
        "I've got an exam at 10",
      ],
      [
        "Who else has a key to the flat?",
        "Lee's sister.",
        ["Sam's manager.", "The landlord's son.", "The repair person."],
        "my sister could let them in. She has a key",
      ],
    ],
    inferences: [
      [
        "What will Sam probably do next?",
        "Ask to start work later tomorrow.",
        ["Call the landlord to cancel.", "Take Lee's exam.", "Fix the machine alone."],
        "I'll ask if I can start later",
      ],
      [
        "What can be inferred about the landlord?",
        "The landlord arranged the repair.",
        ["The landlord will be at the flat.", "The landlord has no key.", "The landlord lives with Sam and Lee."],
        "The landlord just called. Someone's coming to fix the washing machine",
      ],
      [
        "Why does Lee mention the sister?",
        "To offer another way to let the repair person in.",
        ["Because the sister lives in the flat.", "Because the sister can fix the machine.", "To explain why Lee has an exam."],
        "If not, my sister could let them in",
      ],
    ],
  },
  {
    text: "**Fitness Centre: Changes to Classes**\n\nBecause of high demand, the Tuesday yoga class will now run twice: at 6 p.m. and at 7.15 p.m. Places must be booked online at least two hours in advance. The Thursday cycling class has been cancelled until further notice, as the instructor is on leave. Members who paid for a ten-class pass will have it extended by one month.",
    details: [
      [
        "What has happened to the Tuesday yoga class?",
        "An extra session has been added.",
        ["It has moved to Thursday.", "It has been cancelled.", "It now starts at 7.15 p.m. only."],
        "the Tuesday yoga class will now run twice",
      ],
      [
        "How must members book a place?",
        "Online, at least two hours before.",
        ["By phone, the day before.", "At the door.", "Online, two days before."],
        "booked online at least two hours in advance",
      ],
      [
        "Why has the cycling class been cancelled?",
        "The instructor is away.",
        ["Too few people came.", "The bikes are broken.", "The yoga class needs the room."],
        "the instructor is on leave",
      ],
    ],
    inferences: [
      [
        "What can be inferred about the yoga class?",
        "Many members want to take it.",
        ["It was too expensive.", "Its instructor is on leave.", "Few members booked it."],
        "Because of high demand",
      ],
      [
        "Why are ten-class passes being extended?",
        "To make up for classes members cannot attend.",
        ["Because yoga now runs twice.", "Because the centre is closing.", "Because prices are rising."],
        "Members who paid for a ten-class pass will have it extended by one month",
      ],
      [
        "When will the cycling class start again?",
        "No date has been set.",
        ["Next Thursday.", "In one month.", "In two hours."],
        "cancelled until further notice",
      ],
    ],
  },
  {
    text: "**For sale: student bike**\n\nBlue city bike, three years old, with lights, a lock and a basket. I'm selling it because I'm moving abroad at the end of June. It has just had new brakes fitted, though the back tyre will need replacing soon. £80, or £70 if you can collect it this week. Message Ali on 07700 900123.",
    details: [
      [
        "Why is Ali selling the bike?",
        "Ali is moving to another country.",
        ["The bike is too old.", "Ali has bought a new bike.", "The brakes do not work."],
        "I'm moving abroad at the end of June",
      ],
      [
        "What has recently been done to the bike?",
        "New brakes were fitted.",
        ["The back tyre was replaced.", "A basket was added.", "It was painted blue."],
        "It has just had new brakes fitted",
      ],
      [
        "What comes with the bike?",
        "Lights, a lock and a basket.",
        ["A new back tyre.", "A helmet and a lock.", "Delivery to the buyer."],
        "with lights, a lock and a basket",
      ],
    ],
    inferences: [
      [
        "What will a buyer probably need to pay for soon?",
        "A new back tyre.",
        ["New brakes.", "New lights.", "A new lock."],
        "the back tyre will need replacing soon",
      ],
      [
        "Why does Ali offer a lower price for collection this week?",
        "Ali wants to sell it quickly.",
        ["The bike will be cheaper after June.", "Delivery is expensive.", "The price includes a tyre."],
        "£70 if you can collect it this week",
      ],
      [
        "How should someone who is interested contact Ali?",
        "By sending a text message.",
        ["By email.", "By visiting a shop.", "By calling after June."],
        "Message Ali",
      ],
    ],
  },
  {
    text: "Dear volunteers,\n\nThank you for helping at last Saturday's family day, which attracted over 900 visitors, our highest number ever. Several of you mentioned that the queue for the face-painting table was too long, so next time we will have two tables. The next family day is on 14 June. If you can help, please reply by 1 June so that we can plan the rota. Lunch will be provided as usual.\n\nBest wishes,\nRosa Lee, Volunteer Coordinator",
    details: [
      [
        "How many visitors came to the family day?",
        "More than 900.",
        ["Exactly 900.", "Fewer than 900.", "About 1,400."],
        "attracted over 900 visitors",
      ],
      [
        "What change will be made next time?",
        "There will be two face-painting tables.",
        ["There will be a longer lunch break.", "Visitors will paint faces themselves.", "The day will be shorter."],
        "next time we will have two tables",
      ],
      ["By when should volunteers reply?", "1 June.", ["14 June.", "Last Saturday.", "The end of the month."], "please reply by 1 June"],
    ],
    inferences: [
      [
        "What can be inferred about earlier family days?",
        "They had fewer visitors.",
        ["They had two face-painting tables.", "They did not need volunteers.", "They all took place in June."],
        "our highest number ever",
      ],
      [
        "Why does Rosa need replies by 1 June?",
        "To organise who works when.",
        ["To order face paint.", "To count the visitors.", "To pay the volunteers."],
        "so that we can plan the rota",
      ],
      [
        "What do the words *as usual* tell the volunteers about lunch?",
        "Volunteers have been given lunch before.",
        ["Lunch will be at the usual café.", "Volunteers must bring their own lunch.", "Lunch costs the usual price."],
        "Lunch will be provided as usual",
      ],
    ],
  },
  {
    text: "**Route 12: Temporary Change**\n\nFrom 5 to 18 May, Route 12 buses will not stop on Market Street because of road works. Please use the temporary stop on Bridge Road, a two-minute walk away. Buses will run every 15 minutes as normal, but journeys may take up to ten minutes longer at busy times. Tickets and passes are not affected.",
    details: [
      [
        "Why will buses not stop on Market Street?",
        "Road works are taking place.",
        ["The stop has been closed for good.", "Bridge Road is too busy.", "Few people use it."],
        "because of road works",
      ],
      [
        "Where should passengers wait instead?",
        "On Bridge Road.",
        ["On Market Street.", "At the bus station.", "On Route 12."],
        "use the temporary stop on Bridge Road",
      ],
      [
        "How often will buses run?",
        "Every 15 minutes.",
        ["Every ten minutes.", "Every two minutes.", "Less often than usual."],
        "Buses will run every 15 minutes as normal",
      ],
    ],
    inferences: [
      [
        "What should a passenger who must arrive on time probably do?",
        "Leave a little earlier than usual.",
        ["Buy a new pass.", "Wait on Market Street.", "Take a later bus."],
        "journeys may take up to ten minutes longer at busy times",
      ],
      [
        "What can be inferred about the stop on Bridge Road?",
        "It is close to the usual stop.",
        ["It will be used after 18 May.", "Only some buses stop there.", "It needs a different ticket."],
        "a two-minute walk away",
      ],
      [
        "What will most likely happen after 18 May?",
        "Buses will stop on Market Street again.",
        ["Route 12 will be cancelled.", "Tickets will cost more.", "Buses will run every ten minutes."],
        "From 5 to 18 May, Route 12 buses will not stop on Market Street",
      ],
    ],
  },
  {
    text: "**Photography Club**\n\nOur walk this Sunday is moving indoors! With heavy rain forecast, we'll meet in Room 4B instead of at the park gates. Kai will show us how to edit photos on our phones, so bring yours fully charged. New members are very welcome, and no experience is needed. Same time: 2 p.m.",
    details: [
      [
        "Where will the club meet on Sunday?",
        "In Room 4B.",
        ["At the park gates.", "In the park café.", "At Kai's home."],
        "we'll meet in Room 4B instead of at the park gates",
      ],
      [
        "What will Kai teach?",
        "How to edit photos on a phone.",
        ["How to take photos in the rain.", "How to charge a phone faster.", "How to choose a camera."],
        "Kai will show us how to edit photos on our phones",
      ],
      ["What time will the meeting start?", "2 p.m.", ["4 p.m.", "12 p.m.", "It has not been decided."], "Same time: 2 p.m."],
    ],
    inferences: [
      [
        "Why has the plan changed?",
        "The weather is expected to be bad.",
        ["The park is closed.", "Kai cannot walk far.", "Too many new members joined."],
        "With heavy rain forecast",
      ],
      [
        "What was the original plan for Sunday?",
        "A walk outdoors.",
        ["A talk in Room 4B.", "A photo competition.", "A meeting for new members only."],
        "Our walk this Sunday is moving indoors",
      ],
      [
        "What can be inferred about joining the club?",
        "Beginners can join.",
        ["Members must bring a camera.", "Members must pay a fee.", "New members should meet at the park."],
        "no experience is needed",
      ],
    ],
  },
  {
    text: "**Student job: campus tour guide**\n\nThe Admissions Office is looking for second- and third-year students to show visitors around the campus on Saturdays. Guides are paid £12 an hour and receive two days of training in September. You should be confident speaking to groups and know the campus well. To apply, send a short paragraph about why you would be a good guide to the Admissions Office by 20 August.",
    details: [
      ["When do guides work?", "On Saturdays.", ["Every weekday.", "Only in September.", "On Sundays."], "on Saturdays"],
      [
        "What do guides receive in September?",
        "Two days of training.",
        ["A pay rise.", "A campus map.", "Two days off."],
        "receive two days of training in September",
      ],
      [
        "What must people who apply send?",
        "A short piece of writing on why they would be good guides.",
        ["A full CV.", "A list of campus buildings.", "A recording of a tour."],
        "send a short paragraph about why you would be a good guide",
      ],
    ],
    inferences: [
      [
        "Why are first-year students probably not asked to apply?",
        "They may not know the campus well yet.",
        ["They are paid more in other jobs.", "They have training in September.", "They are not allowed to work on Saturdays."],
        "know the campus well",
      ],
      [
        "Who will the guides most likely show around?",
        "People who are thinking of studying there.",
        ["New members of staff.", "Students who have lost their way.", "Visitors to a sports match."],
        "The Admissions Office is looking for",
      ],
      [
        "Which person would suit the job best?",
        "A third-year student who enjoys talking to groups.",
        [
          "A first-year student who knows the campus.",
          "A second-year student who is shy in groups.",
          "A former student who is free on Saturdays.",
        ],
        "You should be confident speaking to groups",
      ],
    ],
  },
];

// Every piece of evidence must be words of its text.
for (const e of texts) {
  for (const [, , , evidence] of [...e.details, ...e.inferences]) {
    if (!e.text.includes(evidence)) throw new Error(`evidence not in its text: ${evidence}`);
  }
}

function items(pick: (e: Everyday) => readonly Question[], inferred: boolean): readonly SolvedChoice[] {
  return interleave(
    texts.map((e) =>
      pick(e).map(([question, right, wrong, evidence]) => ({
        shown: `${e.text}\n\n**${question}**`,
        right,
        wrong,
        solution: inferred
          ? t(
              `**${right}** The text does not say it directly, but it follows from: "${evidence}${end(evidence)}" The other options go further than the text, or rely on guesses it gives no reason for.`,
              `**${right}** 原文没有直接说，但可以从这里推出："${evidence}${end(evidence)}" 其他选项超出了原文，或者是原文没有依据的猜测。`,
            )
          : t(
              `**${right}** The text says: "${evidence}${end(evidence)}" The other options use real times, places or words from the text, but not the ones that answer this question.`,
              `**${right}** 原文是："${evidence}${end(evidence)}" 其他选项用的是原文中真实出现的时间、地点或词语，但回答的不是这个问题。`,
            ),
      })),
    ),
  );
}

const question = t("Read the text and answer the question below it.", "阅读短文，回答下方的问题。");

/** dailyLifeReading is the TOEFL topic of reading in daily life. */
export const dailyLifeReading: TopicDef = examTopic({
  id: "toefl-daily-life-reading",
  title: t("Read in Daily Life", "日常生活阅读"),
  summary: t(
    "TOEFL-style questions on short everyday texts such as notices, emails, messages and adverts: details, and what the text suggests.",
    "托福风格的题目，围绕通知、邮件、短信、广告等简短的日常文本：细节题，以及原文暗示了什么的推断题。",
  ),
  strand: "reading",
  prerequisites: ["reading-workplace-documents", "making-inferences"],
  encompasses: [
    { topic: "reading-workplace-documents", weight: 0.2 },
    { topic: "making-inferences", weight: 0.2 },
  ],
  xp: 12,
  points: [
    point(
      "toefl-daily-life-details",
      t("Finding Practical Details", "找出实用细节"),
      t(
        "Everyday texts, such as notices, emails, messages and adverts, are short and full of practical facts: times, places, prices, reasons and changes. Read the question first, then scan the text for the part that answers it. The right option often says the same thing in other words. Wrong options usually take a real time, place or name from the text and put it where it does not belong.",
        "通知、邮件、短信、广告等日常文本都很短，满是实用信息：时间、地点、价格、原因和变动。先读问题，再在文中找到回答它的那一部分。正确选项常常用别的话说出同样的意思。错误选项通常把原文中真实出现的时间、地点或名字放到了不对的地方。",
      ),
      solvedChoiceGenerator(
        question,
        items((e) => e.details, false),
      ),
    ),
    point(
      "toefl-daily-life-inferences",
      t("What the Text Suggests", "原文暗示了什么"),
      t(
        "Some questions ask what a text suggests: why the writer mentions something, what will probably happen next, or who would suit an offer. The answer is not written in the text, but it must follow from what is. Find the sentence the question is about and ask what must be true if that sentence is true. A café that *only accepts card payments* cannot take cash; a family day with *our highest number ever* means earlier ones had fewer visitors. Reject options that go further than the text or rest on your own guesses.",
        "有些题问的是原文暗示了什么：作者为什么提到某件事，接下来可能会发生什么，或者谁适合某个机会。答案没有写在原文里，但必须能从原文推出。找到题目所问的那句话，想一想如果它是真的，什么也一定是真的。一家*只接受刷卡*的咖啡馆不能收现金；家庭日迎来*有史以来最多的人数*，说明以前的人数更少。超出原文或基于自己猜测的选项要排除。",
      ),
      solvedChoiceGenerator(
        question,
        items((e) => e.inferences, true),
      ),
    ),
  ],
});
