// Writing: a whole argument essay, handed in at once and judged by a model after its session ends (W5).

import { type CriterionSpec, type TopicDef, t } from "@ga/content";
import { criterionById, point, type WritingItem, writingGenerator } from "@ga/subject-english";

const criterion = (id: string): CriterionSpec => {
  const found = criterionById(id);
  if (!found) throw new Error(`unknown criterion ${id}`);
  return found;
};

const shown = (model: string) =>
  t(`One good essay:\n\n> ${model.replaceAll("\n\n", "\n>\n> ")}`, `一篇好的文章：\n\n> ${model.replaceAll("\n\n", "\n>\n> ")}`);

/** argumentEssayBank asks for a whole argument essay on a question of debate, each with a model essay of five paragraphs. */
const argumentEssayBank: readonly WritingItem[] = [
  {
    task: "Should schools give students a longer lunch break? Write an argument essay that answers this question.",
    model:
      "By the time many students find a seat in the cafeteria, half of their lunch break is already gone. They gulp their food, skip the line for a drink and run back to class. Schools should give students a longer lunch break, because it helps them eat properly and come back ready to learn.\n\nFirst, a longer break lets students eat a real meal. When there are only twenty minutes, students often throw away the vegetables and eat only what is quick, such as chips. With more time, they can finish their food and drink water. A healthy meal keeps the body going through the afternoon.\n\nSecond, a longer break gives the mind a rest. Students sit through four or five lessons before lunch. A few extra minutes to talk with friends or walk outside lets them relax. As a result, they come back to class calmer and more focused, which helps teachers too.\n\nSome people argue that a longer lunch would make the school day end later. That is a fair worry, since families plan around the last bell. However, schools can take a few minutes from passing time or from long morning assemblies, so the day does not need to grow at all.\n\nIn short, a longer lunch break is a small change that makes students healthier and better learners. If schools want sharp minds in the afternoon, they should start by giving students time to eat.",
  },
  {
    task: "Should students have to take a swimming class at school? Write an argument essay that answers this question.",
    model:
      "Every summer, news stories report children who could not swim getting into trouble at rivers, lakes and pools. Many of them never had the chance to learn. Schools should require a swimming class, because swimming saves lives and gives every student a skill they can use for years.\n\nThe most important reason is safety. A child who can float, tread water and reach the edge of a pool is far less likely to drown. Lessons also teach rules, such as never swimming alone. These skills matter most in an emergency, when there is no time to learn.\n\nSwimming is also a healthy activity that students can enjoy for life. Unlike some team sports, it does not need a team or a field. A grandparent can swim as well as a teenager. When students learn at school, they leave with a way to exercise that stays with them.\n\nCritics say that swimming classes are expensive, and that not every school has a pool. This is true for many schools. Even so, schools can share a town pool or hold lessons for a few weeks each year, and the cost is small compared with the lives that the lessons may save.\n\nSwimming is more than a sport; it is a basic safety skill, like crossing the street. Schools should make sure that no student leaves without it, because the day it is needed may come without warning.",
  },
  {
    task: "Should children be paid for doing chores at home? Write an argument essay that answers this question.",
    model:
      "Who should wash the dishes, and should anyone get paid for it? In many homes this question starts arguments. Children should not be paid for ordinary chores, because helping is part of belonging to a family and because payment teaches the wrong lesson about work.\n\nTo begin with, a family is a team. Parents cook, clean and do laundry without being paid, because the home belongs to everyone. When children set the table or feed the dog, they are doing their share. Paying them suggests that the home is a job rather than a place they help to keep.\n\nIn addition, paying for chores can make children help only when they want money. A child who is saving for a game may clean happily, but once the game is bought, the help may stop. Chores that are simply expected become a habit, and habits last longer than a wish to earn.\n\nSome people believe that payment teaches children how to manage money. Learning about money is important. However, parents can give a small allowance that is not tied to chores, or pay for extra jobs, such as washing the car, while everyday tasks stay unpaid.\n\nFor these reasons, ordinary chores should remain a part of family life, not a paid job. Children who help without being paid learn something worth more than money: that the people they live with can count on them.",
  },
  {
    task: "Should students be allowed to choose some of their own school subjects? Write an argument essay that answers this question.",
    model:
      "A student who loves building robots may spend the whole year without a single class about machines. Students should be allowed to choose some of their own subjects, because choice makes them work harder and helps them discover what they are good at.\n\nFirst, students try harder in subjects they have chosen. When a person picks something, they feel responsible for it. A student who chose a class in drama is more likely to practice lines at home than one who was simply placed there. That extra effort leads to better learning.\n\nSecond, choice helps students find their interests before they leave school. A short course in coding, photography or farming can open a door that a student did not know was there. For example, someone who tries a class on journalism may find a love of writing that guides their future.\n\nSome people argue that young students are not ready to make such choices and might pick only easy classes. This is a real risk. Yet schools can keep the core subjects, such as math and English, required for everyone, and let students choose only one or two classes each year, with advice from teachers.\n\nGiving students some choice does not mean letting them skip what matters. It means trusting them with part of their own education, so that they learn not only facts but also how to follow their interests.",
  },
  {
    task: "Should towns put up more street lights in parks? Write an argument essay that answers this question.",
    model:
      "When the sun sets early in winter, many parks become dark empty spaces by five o'clock. Towns should put up more street lights in parks, because light makes parks safer and lets people use them for more hours of the day.\n\nThe first reason is safety. Paths that are well lit are easier to walk on without tripping over roots or holes. People also feel safer when they can see who else is around. For example, a parent walking home with a child through a lit park does not need to take a long way around.\n\nThe second reason is that lights give parks more hours of use. In winter, people who work or study all day can only visit after dark. With lights, they can still jog, walk the dog or play on the courts. A park that is used more often is worth more to the whole town.\n\nSome people argue that lights waste energy and disturb animals at night. These are fair concerns. However, modern lamps use little electricity, and they can be pointed down at the paths and turned off late at night, so that animals in the trees are left in the dark.\n\nIn the end, a park belongs to the people who live near it, at every hour. More lights would let them enjoy it safely, even on the longest nights of the year.",
  },
  {
    task: "Should schools have a quiet reading time every day? Write an argument essay that answers this question.",
    model:
      "Imagine a school where, for twenty minutes every day, the hallways go silent and everyone, even the principal, opens a book. Schools should have a quiet reading time every day, because it builds reading skills and gives students a calm break in a busy day.\n\nTo start, reading every day makes students better readers. Like any skill, reading improves with practice. Twenty minutes a day adds up to more than sixty hours over a school year. Students who read more learn new words and read faster, which helps them in every subject.\n\nIn addition, quiet reading gives students a rest from noise and screens. The school day is full of bells, group work and talk. A short time to sit still with a story lets students slow down. Many students come back to their lessons calmer and more ready to focus.\n\nCritics say that schools do not have time to spare, since lessons are already full. It is true that every minute matters. Even so, quiet reading supports the other lessons, because better readers understand science and history texts more easily, so the time is not lost but invested.\n\nA daily reading time costs nothing but a few minutes and a quiet room. In return, it gives students stronger skills and a habit that may stay with them long after they leave school.",
  },
  {
    task: "Should families eat dinner together without phones? Write an argument essay that answers this question.",
    model:
      "At many dinner tables, the loudest sound is not conversation but the tap of fingers on screens. Families should eat dinner together without phones, because shared meals without screens bring families closer and help everyone enjoy their food.\n\nThe main reason is that dinner may be the only time a family is together all day. Parents work, children go to school, and evenings fill up with homework and activities. When phones are put away, family members can talk about their day and notice when someone is worried or excited. These small talks build strong bonds.\n\nAnother reason is that people pay more attention to their food when they are not looking at a screen. Eating slowly and noticing when you are full is a healthy habit. A meal without phones also shows respect to the person who cooked it.\n\nSome people say that phones are needed in case of an urgent call. That can be true for some jobs. However, a phone can be left on a shelf with the sound on, so an important call is not missed, while the screen stays away from the table.\n\nA phone-free dinner is a simple rule that any family can try tonight. It turns an ordinary meal into time together, and that is something no screen can give.",
  },
  {
    task: "Should students learn to play a musical instrument at school? Write an argument essay that answers this question.",
    model:
      "Many adults say they wish they had learned to play an instrument as a child. Schools can make sure that the next generation does not share that regret. Every student should learn to play a musical instrument at school, because music builds discipline and brings people together.\n\nFirst, learning an instrument teaches patience and hard work. A song on the recorder or the violin does not come out right on the first try. Students must practice a little every day and fix mistakes one at a time. This kind of steady effort is useful in math, sport and any other skill.\n\nSecond, music connects people. When students play in a school band, each one has a part, and the song only works if everyone listens to the others. Concerts also bring families into the school, where they can share in the students' work.\n\nSome people argue that instruments are expensive and that many families cannot buy them. This is an important point. However, schools can keep a collection of instruments to lend, and simple ones, such as the recorder or a drum, cost very little.\n\nMusic is not only for students who will become musicians. It is a way of learning to work, to listen and to share something beautiful. Schools that give every student an instrument give them all of these things at once.",
  },
  {
    task: "Should schools plant gardens where students grow food? Write an argument essay that answers this question.",
    model:
      "Ask a young child where tomatoes come from, and the answer may be the supermarket. Schools should plant gardens where students grow food, because gardens make lessons real and teach students to eat well.\n\nTo begin with, a garden turns lessons into something students can touch. In science, they can watch seeds sprout and learn what plants need to grow. In math, they can measure the beds and count the harvest. A lesson about soil means much more when your own hands have been in it.\n\nMoreover, students who grow vegetables are more willing to eat them. A child who refuses peas at home may proudly taste the peas they planted and watered for weeks. School gardens can teach healthy habits better than any poster in the cafeteria.\n\nCritics point out that gardens need care during the summer, when school is closed. This is a real problem. Yet families, local volunteers or a summer club can take turns watering, and schools can plant crops that are ready to pick before the holidays begin.\n\nA school garden is a classroom without walls. It feeds students' minds and bodies at the same time, and it reminds them that food comes from the earth and from hard work.",
  },
  {
    task: "Should towns close a main street to cars one day each month? Write an argument essay that answers this question.",
    model:
      "On most days, a town's main street belongs to cars, buses and trucks. Towns should close a main street to cars one day each month, because it brings people together and helps local shops.\n\nThe first reason is that a car-free day turns the street into a place for people. Families can walk in the middle of the road, children can ride bikes safely, and musicians can play on the corners. Neighbors who usually drive past each other can stop and talk. Such days help a town feel like a community.\n\nThe second reason is that local shops benefit. People on foot move slowly and look in windows, while drivers rush past. A bakery or a bookshop may see more customers on a busy car-free day than in a whole week of traffic. Shops can also put tables and displays outside.\n\nSome people argue that closing the street makes it hard to reach homes and businesses, and pushes traffic onto other roads. This is a fair concern. However, the closure lasts only one day a month, and towns can plan detours, keep side streets open and choose a day when traffic is light, such as a Sunday.\n\nOne day a month is a small price for a street full of life. A car-free day reminds people that a town's streets are not only for passing through but also for living in.",
  },
  {
    task: "Should students have homework on weekends? Write an argument essay that answers this question.",
    model:
      "On Friday afternoon, many students carry home a bag as heavy as the one they carried in on Monday. By Sunday night, the weekend has turned into a second school week. Schools should stop giving homework on weekends, because students need time to rest and time to learn outside the classroom.\n\nFirst, rest helps students learn. After five days of lessons, the brain needs a break to sort what it has learned. Students who sleep in, play outside and see friends come back on Monday with more energy. Tired students, by contrast, read the same page three times and remember little of it.\n\nSecond, weekends teach things that school cannot. A child who cooks with a grandparent practices measuring and reading a recipe. A family trip to a museum or a forest can spark questions that no worksheet asks. Clubs, sports and part-time jobs also build skills such as teamwork and responsibility.\n\nSome people argue that without weekend homework, students will forget what they learned during the week. This worry makes sense, because practice does help memory. However, teachers can plan short reviews on Monday mornings, and students who want extra practice can still choose to do it. A rule against weekend homework does not stop anyone from reading or studying.\n\nIn short, free weekends make students healthier, more curious and better prepared for the week ahead. Schools should give the weekend back to students and their families.",
  },
  {
    task: "Should cities give every child a free library card at birth? Write an argument essay that answers this question.",
    model:
      "Some children grow up surrounded by books, while others reach school without ever owning one. A library card can close part of that gap. Cities should give every child a free library card at birth, because it brings books into every home and turns reading into a habit early.\n\nFirst, a card at birth reaches every family, not only those who already visit the library. Many parents do not know that cards are free, or they feel unsure about signing up. When the card arrives with the birth certificate, no family has to ask. Every child starts with the same key to thousands of books.\n\nSecond, early reading shapes later learning. Children who are read to as babies hear more words and learn to love stories. A card invites parents to borrow picture books, join story time and come back each week. Small visits like these become a habit that lasts through school.\n\nSome people argue that the plan would waste money, since many cards would never be used. That is a fair point, because printing and mailing cards costs something. However, a library card is one of the cheapest things a city can offer, and even a few new readers repay the cost many times over. Libraries can also send reminders that bring families through the door.\n\nIn short, a free card at birth is a simple gift that gives every child a fair start. Cities that want strong readers should hand out the key on the very first day.",
  },
];

const essayCriteria = ["w5-essay-thesis", "w5-essay-reasons", "w5-essay-counterclaim", "w5-essay-conclusion", "w5-essay-organized"];

/**
 * argumentEssayTopics are the whole argument essay of W5: the moves put
 * together and handed in at once. Its session ends on submission, and a model
 * judges it afterwards, with no rewrite.
 */
export const argumentEssayTopics: readonly TopicDef[] = [
  {
    id: "writing-an-argument-essay",
    title: t("Writing an Argument Essay", "写一篇议论文"),
    summary: t(
      "Put the moves together: an introduction with a thesis, two reasons with evidence, a counterclaim answered, and a conclusion.",
      "把各个步骤合在一起：带论点的开头、两个有论据的理由、回应过的反方观点，以及结尾。",
    ),
    prerequisites: ["writing-a-counterclaim-paragraph", "introductions-and-conclusions", "revising-a-draft"],
    encompasses: [
      { topic: "writing-an-evidence-paragraph", weight: 0.3 },
      { topic: "writing-a-counterclaim-paragraph", weight: 0.3 },
      { topic: "introductions-and-conclusions", weight: 0.3 },
    ],
    xp: 30,
    essay: true,
    criteria: essayCriteria.map(criterion),
    knowledgePoints: [
      point(
        "the-whole-essay",
        t("The Whole Essay", "整篇文章"),
        t(
          "An argument essay puts together every move you have practiced. A plan of five paragraphs works well:\n\n1. An **introduction** with a hook, a little background and the thesis at the end.\n2. A **body paragraph** for the first reason, with evidence or an example, and an explanation of how it supports the thesis.\n3. A **body paragraph** for the second reason, built the same way.\n4. A **counterclaim paragraph**: the strongest view against yours, stated fairly, then answered with a reason.\n5. A **conclusion** that restates the thesis in new words and leaves a final thought.\n\nLink the paragraphs with words such as *First*, *In addition*, *However* and *In short*. Plan before you write, and reread before you hand it in: once handed in, the essay is judged as it is, and the verdict comes after the session ends.",
          "议论文把你练过的各个步骤合在一起。五段式的安排很好用：\n\n1. **开头**：引子、少量背景，最后是论点。\n2. 第一个理由的**主体段落**：有论据或例子，并解释它怎样支持论点。\n3. 第二个理由的**主体段落**，写法相同。\n4. **反方观点段落**：公正地陈述反对你的最有力的观点，再用理由回应它。\n5. **结尾**：换一种说法重申论点，并留下最后的思考。\n\n用 *First*、*In addition*、*However*、*In short* 等词把段落连起来。动笔前先列提纲，交之前再读一遍：文章一旦交上，就按原样评判，结果在这次学习结束后才出来。",
        ),
        writingGenerator(
          t(
            "Write the whole essay in English, in four or five paragraphs: an introduction with your thesis, two reasons with evidence, a counterclaim you answer, and a conclusion.",
            "用英语写整篇文章，分四五段：带论点的开头、两个有论据的理由、一个你回应的反方观点，以及结尾。",
          ),
          argumentEssayBank,
          essayCriteria,
          { minWords: 150, maxChars: 5000 },
          shown,
        ),
      ),
    ],
  },
];
