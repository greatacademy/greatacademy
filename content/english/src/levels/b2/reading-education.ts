// The reading unit of the B2 theme Education and Opportunity: free university, learning by doing, a test that decides
// a future, the subjects boys and girls choose, a school without homework, online degrees, the first in the family to
// go to university and what schools are for.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { readingWords } from "./reading-words.ts";

const passage = passageMaker(readingWords, [
  "b2-words-higher-education",
  "b2-words-learning-2",
  "b2-words-assessment",
  "b2-words-opportunity",
  "b2-words-teaching",
  "b2-words-growing-up",
  "b2-words-abstract-nouns",
  "b2-words-thinking-verbs",
  "b2-words-digital-learning",
  "b2-words-vocations",
  "b2-words-character",
  "mixed-conditionals",
  "appositives",
]);

/** readingEducation is the reading unit of the theme Education and Opportunity. */
export const readingEducation: ReadingUnitDef = {
  id: "b2-reading-education",
  title: t("Education and Opportunity", "教育与机会"),
  passages: [
    passage({
      id: "b2-education-should-university-be-free",
      title: ["Should University Be Free?", "大学应该免费吗？"],
      body: `In some countries, a university education costs nothing. Students in Germany, for example, pay only a small fee each term, and the government pays the rest. In others, tuition can cost many thousands of dollars a year, and many graduates spend decades paying back their loans. Between these two positions lies one of the most heated debates in education: should society pay for university, or should students?

Those who support free university make several arguments. The first is about equality of opportunity. When university is expensive, they argue, talented young people from disadvantaged families may decide that it is not for them, however strong their merit. A high price is a barrier, and it falls hardest on those with the least. The second argument is economic. A country needs doctors, engineers and teachers, and everyone benefits when more people have studied. Education, in this view, is not a private product but a public good, like roads or clean water.

The other side has strong arguments too. Free university is not really free: someone pays for it, usually through taxes, and that means workers who never went to university themselves pay for it too. Since graduates usually earn more over their lives, those who are against free tuition ask why a bus driver should pay for the degree of a future lawyer. Moreover, when universities are free, governments often control the number of places to control the cost. Then the students who win those places are often the children of the privileged, who had the best schools and private lessons.

Between these positions, some countries have found a middle way. In Australia and England, students borrow the cost of tuition from the government and pay it back only when their income gets to a certain level. If they never earn much, they never pay it all back.

Neither side, notably, disputes the main point: that talent is found in every part of society, and that a fair society should give it an opportunity. The real question is how to achieve that at a price a country can afford.`,
      grammar: ["mixed-conditionals"],
      names: ["Germany", "Australia", "England"],
      questions: [
        [
          ["What is the first argument for free university?", "支持大学免费的第一个论点是什么？"],
          ["A high price keeps talented poor students away", "高昂的费用会把有才华的穷学生挡在门外"],
          [
            ["Graduates earn more money than other workers", "大学毕业生比其他工人挣得多"],
            ["Universities would offer more places", "大学会提供更多名额"],
          ],
          [
            "The first argument concerns equality of opportunity: a high price is a barrier for talented young people from disadvantaged families.",
            "第一个论点关乎机会平等：高昂的学费会成为出身弱势家庭的有才华年轻人的障碍。",
          ],
        ],
        [
          [
            "Why might free university help the privileged, according to its critics?",
            "批评者认为，免费大学为什么可能反而帮助了特权阶层？",
          ],
          ["Places are limited, and the best-prepared students win them", "名额有限，准备最充分的学生会得到它们"],
          [
            ["Rich students do not have to pay any taxes", "富裕学生不必交任何税"],
            ["Poor students are not allowed to apply", "贫穷学生不能申请"],
          ],
          [
            "Governments often limit the number of places, and those places go mostly to the children of the privileged, who had the best schools and private lessons.",
            "政府往往限制名额，而名额大多被受过最好教育的特权家庭子女得到。",
          ],
        ],
        [
          ["How does the system in Australia and England work?", "澳大利亚和英格兰的制度是怎样运作的？"],
          ["Students pay back the cost only once they earn enough", "学生只有在收入足够高时才偿还学费"],
          [
            ["The government pays for every student completely", "政府为每个学生支付全部费用"],
            ["Students pay the whole cost before they start", "学生在入学前支付全部费用"],
          ],
          [
            "Students borrow the cost from the government and pay it back only when their income gets to a certain level.",
            "学生向政府借学费，只有收入达到一定水平时才偿还。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-education-learning-by-doing",
      title: ["Learning by Doing", "在实践中学习"],
      body: `Picture two groups of students learning how electricity works. The first group listens to a lecture, takes notes and reads a chapter of a book. The second group is given batteries, cables and small lights and asked to make the lights work. A month later, which group remembers more?

In study after study, the answer has been the second group. Learning by doing, an approach that goes back at least a hundred years to the teacher John Dewey, rests on a simple notion: we retain what we work out for ourselves far better than what we are told. When students have to solve a real problem, they must recall what they know, test their ideas and correct their mistakes. In this way, knowledge is not just absorbed but built.

The approach takes many forms. In science, it means experiments instead of explanations alone. In history, students might interview older people about the past and compare their stories with written sources. In some schools, whole terms are organized around a project, such as designing a garden for the school or making a short movie about the local river, and the subjects of the curriculum are integrated into it.

Its fans say that such projects engage students who are bored by traditional lessons, and that they develop skills that employers value: working in a team, planning, and persistence when things go wrong. Many students also find the work more rewarding, because they can see the result.

However, not everyone is convinced, and their worries deserve attention. Projects take a great deal of time, so less of the syllabus can be taught. Without careful help from the teacher, students may spend hours busy with tasks and still fail to grasp the main concept. Some cognitive scientists argue that beginning students, especially, learn faster from clear instruction and worked examples, and that discovery works best once students already have some knowledge.

Most experienced teachers, as a result, mix the two. A clear explanation introduces an idea; a practical task lets students use it and find out where it stops working; and a class conversation after it helps them formulate what they have learned. Learning by doing, in other words, works best when it is carefully planned.`,
      grammar: ["appositives"],
      names: ["John", "Dewey"],
      questions: [
        [
          ["What is the main notion behind learning by doing?", '"在实践中学习"背后的主要观点是什么？'],
          ["We retain what we work out ourselves better than what we are told", "我们自己弄明白的东西比别人告诉我们的记得更牢"],
          [
            ["Students should never listen to lectures", "学生永远不应该听讲座"],
            ["Textbooks contain more knowledge than teachers", "教科书比老师掌握更多知识"],
          ],
          [
            'It rests on the notion that "we retain what we work out for ourselves far better than what we are told."',
            "它基于这样的观点：我们主动弄明白的东西远比别人告诉我们的记得牢。",
          ],
        ],
        [
          ["Which is a concern of the critics?", "以下哪一项是批评者的担忧？"],
          ["Students may be busy for hours and still miss the main idea", "学生可能忙了几个小时仍没掌握要点"],
          [
            ["Projects make students bored with science", "项目让学生对科学感到厌倦"],
            ["Employers do not value working in a team", "雇主并不看重团队合作"],
          ],
          [
            '"Without careful help from the teacher, students may spend hours busy with tasks and still fail to grasp the main concept."',
            "如果没有细致的指导，学生可能花了好几个小时做活动，仍然没有掌握主要概念。",
          ],
        ],
        [
          ["What do most experienced teachers do, according to the passage?", "根据文章，大多数有经验的老师怎么做？"],
          ["Combine clear explanation with practical tasks", "把清楚的讲解与实践任务结合起来"],
          [
            ["Use only projects for the whole year", "全年只用项目教学"],
            ["Give beginners no instruction at all", "完全不给初学者讲解"],
          ],
          [
            '"Most experienced teachers, as a result, mix the two": an explanation, a practical task and a class conversation.',
            "大多数有经验的老师会把两者结合：先讲解，再做实践任务，最后讨论。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-education-the-test-that-decides-a-future",
      title: ["The Test That Decides a Future", "决定未来的考试"],
      body: `Every June, more than ten million students in China sit the gaokao, the national university entrance exam. For two or three days, the whole country seems to stop and wait. Building work near test centers stops, police cars clear the roads, and parents wait outside the gates for hours. For most students, the result of this single test will decide which university they attend, and often which career they pursue.

China is not alone. In South Korea, planes are kept on the ground during the listening part of the national test so that the students can hear clearly. Many other countries rely on a standardized test to pick students for their best universities.

Those who support such tests point to a real benefit: fairness. Every student answers the same questions, under the same conditions, and is checked by people who do not know their name. In a country where personal connections can open many doors, an exam that cannot be bought or influenced gives the daughter of a farmer in a poor region the same opportunity as the child of an important minister. For millions of families, it has been the main path of social mobility.

The costs, however, are serious. Students may spend years memorizing answers and practicing old papers, with little time for sport, friends or sleep. Teachers feel pressure to teach only what will be in the test, so curiosity and creativity can suffer. And a single bad day, through illness or nerves, can change a life. Moreover, richer families can pay for private lessons, so even a fair test does not start from an equal line.

Several countries are now trying other methods. Some allow students to take the test more than once. Others add to the score a fuller assessment, with school grades, projects and interviews. These methods are more complete, but they are also harder to check, and some fear that they open the door again to influence and privilege.

There is no easy answer. A test can measure some things in a fair way but cannot measure everything. The challenge for every country is to keep the fairness of the exam while reducing the weight that rests on one young person in one week of June.`,
      grammar: ["mixed-conditionals"],
      names: ["China", "Korea"],
      glossed: ["gaokao"],
      questions: [
        [
          ["Why are planes kept on the ground in South Korea during the test?", "考试期间韩国为什么让飞机停飞？"],
          ["So that their noise does not disturb the listening part", "以免噪音干扰听力部分"],
          [
            ["Because the pilots are taking the test", "因为飞行员也在参加考试"],
            ["Because parents travel to the test centers", "因为家长要去考点"],
          ],
          [
            'Planes stay on the ground "during the listening part of the national test so that the noise does not disturb the students."',
            "在全国考试的听力部分，飞机停飞，以免噪音干扰考生。",
          ],
        ],
        [
          ["What strength of such tests does the passage describe?", "文章描述了这类考试的什么优点？"],
          ["They give poor students the same chance as rich ones", "它们给穷学生和富学生同样的机会"],
          [
            ["They encourage curiosity and creativity", "它们鼓励好奇心和创造力"],
            ["They can be taken many times", "它们可以考很多次"],
          ],
          [
            "An exam that cannot be bought or influenced gives the daughter of a farmer in a poor region the same opportunity as the child of an important minister.",
            "无法通过贿赂或关系影响的考试，让贫困省份农民的女儿与权贵子女有同样的机会。",
          ],
        ],
        [
          ["What do critics fear about broader assessments?", "批评者担心更全面的评估会带来什么？"],
          ["They may open the door to influence and privilege again", "它们可能再次为关系和特权打开大门"],
          [
            ["They are too easy for most students", "它们对大多数学生来说太容易了"],
            ["They take less time than a single test", "它们花的时间比一次考试还少"],
          ],
          [
            'These methods are harder to check, "and some fear that they open the door again to influence and privilege."',
            "这些方法更难核查，批评者担心它们会再次为关系和特权打开大门。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-education-why-boys-and-girls-choose-different-subjects",
      title: ["Why Boys and Girls Choose Different Subjects", "男生和女生为何选择不同的科目"],
      body: `In their first years at school, girls and boys do just as well as each other in math. By the age of eighteen, however, in many countries far more boys than girls choose to study physics, computer science and engineering, while far more girls choose languages, psychology and subjects connected with health and teaching. Why does this happen, if their early results are so similar?

One common explanation is ability, but the evidence does not support it well. Average differences in test scores between boys and girls are small, and in some countries girls now do better than boys in science. What is more different is how sure they feel. In surveys, girls with the same grades as boys often rate their own ability in math lower. A girl who believes she is "not a math person" will probably not choose a subject where she expects to find things hard.

Ideas about what boys and girls are like play a part from an early age. Toys, books and movies often show boys building things and girls caring for others. Teachers and parents, without meaning to, may praise boys for being clever and girls for working hard. Peers matter too: a teenager who would be the only girl in a difficult physics class may decide that it is just not worth it.

Yet some research suggests that the difference is largest in the richest and most equal countries. One explanation is that when people feel secure about money, they follow their interests more, and interests themselves are influenced by society. Another is that in poorer countries, a career in technology that pays well is too valuable to give up.

Does the difference matter? Many argue that it does. Jobs in technology are some of the best paid, so the difference contributes to differences in income between men and women. Moreover, when products are designed mostly by one group, the needs of others can be missed.

Several approaches seem to help: women in science whom girls can admire, teachers who show that ability grows with effort, and lessons that connect science to real problems that students care about. The goal is not to push every girl into engineering or every boy into nursing, but to make sure that each young person can decide for themselves.`,
      grammar: ["appositives"],

      questions: [
        [
          ["What differs most between boys and girls, according to the passage?", "根据文章，男生和女生之间差别最大的是什么？"],
          ["Their confidence in their own ability", "他们对自己能力的信心"],
          [
            ["Their test scores in mathematics", "他们的数学考试分数"],
            ["Their grades in primary school", "他们小学时的成绩"],
          ],
          [
            'Differences in scores are small. "What is more different is how sure they feel": girls with the same grades often rate their ability lower.',
            "分数差异很小，差别更大的是信心：成绩相同的女生往往低估自己的能力。",
          ],
        ],
        [
          ["Where is the gap largest, according to some research?", "根据一些研究，差距在哪里最大？"],
          ["In the richest and most equal countries", "在最富裕、最平等的国家"],
          [
            ["In the poorest countries", "在最贫穷的国家"],
            ["In countries with the most schools", "在学校最多的国家"],
          ],
          [
            '"Some research suggests that the difference is largest in the richest and most equal countries."',
            "一些研究表明，差距在最富裕、最平等的国家最大。",
          ],
        ],
        [
          ["What is the aim of the approaches the passage describes?", "文章所描述的做法的目的是什么？"],
          ["To make sure that each young person can decide for themselves", "确保每个年轻人都能自由选择"],
          [
            ["To push every girl into engineering", "把每个女生都推向工程专业"],
            ["To have the same number of boys and girls in every class", "让每个班的男女生人数相同"],
          ],
          [
            '"The goal is not to push every girl into engineering or every boy into nursing, but to make sure that each young person can decide for themselves."',
            "目的不是把每个女生推向工程、把每个男生推向护理，而是确保每个选择都是自由的。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-education-a-school-that-abolished-homework",
      title: ["A School That Abolished Homework", "取消家庭作业的学校"],
      body: `Five years ago, the head teacher of a school for young children in a quiet town announced a decision that surprised many parents: from the next term, there would be no more homework. Children would still read at home if they wanted to, but there would be no worksheets, no tests to prepare for and no projects due on Monday morning.

Her reasons came in part from evidence and in part from what she saw every day. Studies suggest that homework has little effect on the results of young children, although it helps older students more. Meanwhile, she noticed that many of her pupils arrived tired and anxious, and that homework had become a source of conflict in families every evening. Children whose parents had studied got help at home; others had to manage alone. Homework, she argued, was making the distance between them greater.

The response was mixed. Some parents were very pleased and said that evenings at home had become calmer. Others were worried. A father, an engineer who had worked hard at school, was afraid that his son would fall behind and fail to develop self-discipline. A group of parents wrote to the school asking it to think again.

The school did not change its decision, but it changed its lessons. Teachers spent more time on reading and practice in class, where they could give feedback at once. They also encouraged families to spend the free time on other things: cooking together, playing outside, visiting the library or just talking.

After five years, the results are encouraging, albeit not dramatic. Test scores have stayed the same or risen slightly. Pupils report enjoying school more, and teachers say that children arrive with more energy and curiosity. The father who had been against the plan now admits that his fears were exaggerated. "If I had been told this five years ago," he says, "I would not have believed it. But my son is doing well, and he reads more now than he ever did."

Not everyone is convinced. Schools for older students, others point out, face different pressures, and older students may need practice at home. But for young children, at least, this school suggests that less homework does not have to mean less learning.`,
      grammar: ["mixed-conditionals"],
      glossed: ["worksheets"],
      questions: [
        [
          ["Why did the head teacher believe homework was unfair?", "校长为什么认为家庭作业不公平？"],
          ["Children whose parents had studied got more help at home", "父母受过教育的孩子在家能得到更多帮助"],
          [
            ["Older students had less homework than younger ones", "高年级学生的作业比低年级的少"],
            ["Teachers had no time to mark it", "老师没有时间批改作业"],
          ],
          [
            '"Children whose parents had studied got help at home; others had to manage alone." Homework was making the distance greater.',
            "父母受过教育的孩子在家有人帮，其他孩子只能独自挣扎，作业拉大了差距。",
          ],
        ],
        [
          ["How did the school change its lessons?", "学校怎样改变了课堂教学？"],
          ["More reading and practice happened in class", "更多的阅读和练习在课堂上进行"],
          [
            ["Lessons became shorter so that children could rest", "课变短了，好让孩子休息"],
            ["Parents were asked to teach in the evenings", "要求家长晚上给孩子上课"],
          ],
          [
            '"Teachers spent more time on reading and practice in class, where they could give feedback at once."',
            "老师在课堂上花更多时间进行阅读和练习，可以当场给出反馈。",
          ],
        ],
        [
          ["What does the father think now?", "那位父亲现在怎么想？"],
          ["His fears were exaggerated", "他当初的担心是夸大了"],
          [
            ["His son has fallen behind", "他的儿子落后了"],
            ["Homework should come back", "家庭作业应该恢复"],
          ],
          [
            '"The father who had been against the plan now admits that his fears were exaggerated": his son is doing well and reads more.',
            "曾经反对的父亲现在承认当初的担心过头了：儿子学得很好，读书也比以前多。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-education-online-degrees",
      title: ["Online Degrees", "网络学位"],
      body: `Twenty years ago, a degree earned online was often seen as second best, the kind of qualification an employer might look at with doubt. Today, many of the top universities in the world offer complete bachelor and master degrees online, and millions of people study for them from their kitchens, offices and phones.

The benefits are clear. An online degree takes away the barrier of distance: a nurse in a small town can study with a university in the capital without leaving her job or her family. It is often cheaper, since students do not pay for housing or travel. Many courses are self-paced, so that students can watch lectures at night, stop them and watch them again. For people who work, care for children or live with an illness, the ability to choose when to study can make the difference between studying and not studying at all.

The problems are just as real. Studying alone at a screen requires a great deal of self-discipline, and the number of students who drop out of online courses is much higher than on campus. Distraction is always one click away. Students also miss what happens between lectures: conversations over coffee, study groups, and the opportunity to get to know professors who might later become mentors. Some subjects, such as medicine or engineering, need laboratories and practical skills that a screen cannot replace. And not everyone has reliable internet or enough bandwidth at home.

Universities are trying to solve these problems. Many now offer hybrid degrees, in which students study mostly online but come to campus for a few busy weeks. Online forums, live seminars and small virtual groups are designed to build the feeling of community that study alone lacks. Some programs give each student a tutor who checks on their progress every week.

What about employers? Surveys suggest that attitudes have changed, particularly since so many people studied from home during the pandemic. Most employers now care more about the name of the university and the skills of the graduate than about where the lectures were watched.

An online degree, in short, is not an easy road, and it is not second best either. For the right student, it is an opportunity; for the wrong one, a lonely test of self-discipline.`,
      grammar: ["appositives"],

      questions: [
        [
          ["Which advantage of online degrees does the passage mention?", "文章提到了网络学位的哪一个优点？"],
          ["Students can study without leaving their job or family", "学生不必离开工作或家庭就能学习"],
          [
            ["Students meet their professors more often", "学生更常见到教授"],
            ["Every subject can be studied without a laboratory", "每门学科都可以在没有实验室的情况下学习"],
          ],
          [
            'An online degree takes away the barrier of distance: a nurse can study "without leaving her job or her family."',
            "网络学位消除了距离的障碍：护士不用离开工作和家庭就能学习。",
          ],
        ],
        [
          ["What is one disadvantage of studying online?", "网上学习的一个缺点是什么？"],
          ["Many more students drop out", "退学的学生多得多"],
          [
            ["It is more expensive than studying on campus", "比在校园学习更贵"],
            ["Lectures cannot be watched again", "讲座不能重看"],
          ],
          [
            '"The number of students who drop out of online courses is much higher than on campus."',
            "网络课程的退学人数比在校园学习的高得多。",
          ],
        ],
        [
          ["What do most employers care about now?", "大多数雇主现在看重什么？"],
          ["The name of the university and the skills of the graduate", "大学的声誉和毕业生的能力"],
          [
            ["Whether the lectures were watched on campus", "讲座是否在校园里观看"],
            ["How many hours the student spent online", "学生在网上花了多少小时"],
          ],
          [
            'Most employers "care more about the name of the university and the skills of the graduate than about where the lectures were watched."',
            "大多数雇主更看重大学的声誉和毕业生的能力，而不是在哪里听的课。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-education-the-first-in-the-family",
      title: ["The First in the Family to Go to University", "家里第一个上大学的人"],
      body: `When Ana opened the letter that offered her a place to study law, her mother cried and her father went straight out to tell the neighbors. Nobody in the family had ever gone to university. Her parents, a cleaner and a construction worker, had left school at fifteen. For them, the letter was the result of years of hard work. For Ana, it was the beginning of something she did not yet understand.

The first weeks were harder than she had expected. Other students seemed to know things that nobody had told her: how to write an essay in an academic style, what office hours were for, why people spoke so easily in seminars. When a lecturer mentioned "the reading list", she did not know that she was expected to read it before the first class. She felt, she says now, like a guest at a party where everyone else knew the rules.

Her experience is common. Students who are the first in their family to attend university drop out more often than others, even when their grades on arrival are the same. The reasons are almost never about ability. They often work long hours to support themselves, cannot ask their parents for advice, and feel out of place. Some feel caught between two worlds, no longer quite at home with their old friends and not yet at home with their new ones.

Universities have begun to respond. Many now run programs that pair first-generation students with mentors, often older students from similar families. Others offer short courses before the first term that explain the hidden rules of academic life, and some give financial support so that students do not need to work so much.

For Ana, the turning point was a mentor, a lawyer who had also been the first in her family to study. "She told me that everyone feels like a fake at the start," Ana says. "If she hadn't said that, I probably wouldn't be here now." Ana is now in her final year and plans to help other students like her. Her parents, she says, still keep the letter in a drawer.`,
      grammar: ["mixed-conditionals"],
      names: ["Ana"],
      glossed: ["first-generation"],
      questions: [
        [
          ["Why were the first weeks hard for Ana?", "为什么最初几周对安娜来说很艰难？"],
          ["Other students knew unwritten rules that nobody had told her", "其他学生知道一些没人告诉过她的规则"],
          [
            ["Her grades were lower than those of other students", "她的成绩比其他学生低"],
            ["Her parents did not want her to study law", "她的父母不想让她学法律"],
          ],
          [
            '"Other students seemed to know things that nobody had told her", such as how to write an academic essay or what office hours were for.',
            "其他学生似乎知道一些没人告诉过她的事，比如怎样写学术论文、办公时间是做什么的。",
          ],
        ],
        [
          ["Why do first-generation students drop out more often?", "为什么第一代大学生更容易退学？"],
          ["They work long hours, lack advice and feel they do not belong", "他们工作时间长，缺少建议，觉得自己不属于那里"],
          [
            ["Their grades on arrival are usually much lower", "他们入学时的成绩通常低得多"],
            ["Universities do not allow them to work", "大学不允许他们工作"],
          ],
          [
            '"The reasons are almost never about ability." They work long hours, cannot ask their parents for advice and feel out of place.',
            "原因很少与能力有关：他们要长时间打工，无法向父母求教，还觉得自己格格不入。",
          ],
        ],
        [
          ["What helped Ana most?", "什么对安娜帮助最大？"],
          ["A mentor who had been in the same situation", "一位有过同样经历的导师"],
          [
            ["Financial support from the university", "大学的经济资助"],
            ["A short course before the first term", "第一学期前的短期课程"],
          ],
          [
            '"For Ana, the turning point was a mentor, a lawyer who had also been the first in her family to study."',
            "对安娜来说，转折点是一位导师，她也是家里第一个上大学的人。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-education-what-schools-are-for",
      title: ["What Schools Are For", "学校是为了什么"],
      body: `Ask ten people what schools are for, and you may get ten different answers. Some will say that schools are there to pass on knowledge: the facts, ideas and skills that each generation has collected. Others will say that they prepare young people for work. Others again will speak of citizenship, character or being happy. Each answer leads to a different idea of what a good school looks like.

The oldest answer is knowledge. In this view, a school is where children meet the best that has been thought and written: math, science, history, literature and the arts. Without such knowledge, people cannot think clearly about anything, and children from poorer homes, who may not meet these ideas at home, are the ones who lose most when schools neglect it.

The economic answer is more recent. Since the Industrial Revolution, governments have seen schools as a way to produce a skilled workforce. This view is behind much of the debate today, with its focus on employability, standardized tests and subjects such as computer science. Others argue that it sees children as future workers instead of as people.

A third answer is about citizenship. A democracy needs citizens who can read carefully, distinguish facts from opinions, listen to others and take part in public life. Schools, in this view, are some of the few places where children from different kinds of families learn together, and that experience is itself a lesson.

A fourth answer focuses on each child as a person. Schools should help each child discover their interests, develop qualities such as courage, compassion and persistence, and grow into a happy adult. Those who hold this view worry that tests and targets leave little room for play, art or curiosity.

These goals do not have to conflict. A history lesson can build knowledge, teach students to judge evidence and prepare them for jobs that require careful thinking. Yet time is short, and every decision about the curriculum reveals priorities. Perhaps the most useful thing a society can do is to discuss those priorities in public, instead of letting them be decided by the next test.`,
      grammar: ["appositives"],
      glossed: ["employability", "citizenship"],
      questions: [
        [
          ["According to the knowledge view, who loses most when schools neglect knowledge?", '按照"知识"观点，学校忽视知识时谁损失最大？'],
          ["Children from poorer homes", "来自较贫困家庭的孩子"],
          [
            ["Future employers", "未来的雇主"],
            ["Children who are good at sport", "擅长体育的孩子"],
          ],
          [
            'Children from poorer homes, "who may not meet these ideas at home, are the ones who lose most when schools neglect it."',
            "来自较贫困家庭的孩子在别处可能接触不到这些思想，学校忽视知识时他们损失最大。",
          ],
        ],
        [
          ["Why are schools important for democracy, according to the third view?", "按照第三种观点，学校为什么对民主很重要？"],
          ["Children from different kinds of families learn together there", "不同背景的孩子在那里一起学习"],
          [
            ["Schools teach children how to vote", "学校教孩子如何投票"],
            ["Schools produce a skilled workforce", "学校培养熟练的劳动力"],
          ],
          [
            'Schools "are some of the few places where children from different kinds of families learn together, and that experience is itself a lesson."',
            "学校是少数几个让不同背景的孩子一起学习的地方，这种经历本身就是一课。",
          ],
        ],
        [
          ["What does the writer suggest at the end?", "作者在结尾提出了什么建议？"],
          ["Society should discuss its priorities for schools in public", "社会应该公开讨论对学校的优先目标"],
          [
            ["Schools should choose only one goal", "学校应该只选择一个目标"],
            ["Tests should decide what schools teach", "应该由考试决定学校教什么"],
          ],
          [
            '"Perhaps the most useful thing a society can do is to discuss those priorities in public, instead of letting them be decided by the next test."',
            "社会最有益的做法或许是公开讨论这些优先事项，而不是让下一次考试来决定。",
          ],
        ],
      ],
    }),
  ],
};
