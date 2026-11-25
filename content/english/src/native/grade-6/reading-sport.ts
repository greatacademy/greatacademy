// Grade 6: the reading unit of the ninth theme, sport and fairness, with passages of history, of rules to apply
// and of arguments to weigh.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const competitionWords = { topic: "words-of-competition", weight: 0.3 } as const;
const rulesWords = { topic: "words-of-rules-and-fair-play", weight: 0.3 } as const;
const trainingWords = { topic: "words-of-training", weight: 0.3 } as const;
const rules = { topic: "reading-rules-and-instructions", weight: 0.2 } as const;
const argument = { topic: "tracing-an-argument", weight: 0.2 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;
const academic3 = { topic: "academic-words-3", weight: 0.1 } as const;

/** fairPlay is a reading unit of grade 6 on sport, its rules and fairness. */
export const fairPlay: ReadingUnitDef = {
  id: "fair-play",
  title: t("Fair Play", "公平竞赛"),
  passages: [
    passage(
      "the-first-marathon",
      t("The First Marathon", "第一次马拉松"),
      `According to an old Greek legend, in 490 BCE a messenger named Pheidippides ran from the town of Marathon to Athens, a distance of about forty kilometers. The Athenian army had just defeated a much larger Persian army at Marathon, and Pheidippides carried the news of the victory. When he reached Athens, the story says, he cried out, "Rejoice, we conquer!" and fell dead.

Historians are not sure the story is true. The oldest accounts of the battle, written a few decades later, do not mention this run at all. They tell of a different run, in which a messenger ran about 240 kilometers to Sparta to ask for help before the battle. The famous story of the run to Athens was written down more than five hundred years after the event.

True or not, the legend inspired the modern marathon. When the first modern Olympic Games were held in Athens in 1896, a French scholar suggested a long race from Marathon to the Olympic stadium in honor of the old story. The Greek crowd was delighted when the race was won by a Greek water carrier named Spyridon Louis. He became a national hero.

At first the length of the race varied. At the 1908 Olympics in London, the course was set at 42.195 kilometers so that it could start at Windsor Castle and finish in front of the royal box in the stadium. That odd distance became the official length in 1921, and it has stayed the same ever since.

Today, more than a million people a year run marathons. Few of them win. For most, the real contest is not against an opponent but against their own stamina and doubt.`,
      [competitionWords, trainingWords, argument],
      [
        ask(
          t("Why are historians not sure that the story of Pheidippides is true?", "为什么历史学家不确定菲迪皮德斯的故事是真的？"),
          t("The oldest accounts do not mention the run to Athens", "最早的记载没有提到跑到雅典这件事"),
          [
            t("The run to Athens was too short to be real", "跑到雅典的路程太短，不可能是真的"),
            t("The Athenian army lost the battle", "雅典军队输掉了那场战役"),
            t("Pheidippides wrote the story himself", "菲迪皮德斯自己编写了这个故事"),
          ],
          t(
            "The second paragraph says the oldest accounts do not mention this run and that the famous story was written down more than five hundred years later.",
            "第二段说，最早的记载根本没有提到这次奔跑，而这个著名的故事是五百多年后才被记录下来的。",
          ),
          [
            t("Forty kilometers is a long run, and length is never the doubt.", "四十公里是很长的距离，文中从没因长度而怀疑。"),
            t("The Athenian army won the battle at Marathon.", "雅典军队在马拉松打赢了。"),
            t("The story was written five hundred years later, not by him.", "故事是五百年后写下的，不是他本人写的。"),
          ],
        ),
        ask(
          t("Why is the marathon 42.195 kilometers long?", "为什么马拉松是 42.195 公里？"),
          t(
            "The 1908 course was set so it could start at a castle and end at the royal box",
            "1908 年的赛道是为了从城堡出发、在皇家包厢前结束而设定的",
          ),
          [
            t("It is the exact distance Pheidippides ran", "这正是菲迪皮德斯跑的距离"),
            t("It was the distance from Marathon to Sparta", "这是从马拉松到斯巴达的距离"),
            t("Spyridon Louis chose it after he won", "斯皮里东·路易斯获胜后选定了它"),
          ],
          t(
            "The fourth paragraph says the 1908 London course was set at that length so it could start at Windsor Castle and finish in front of the royal box.",
            "第四段说，1908 年伦敦的赛道定为这个长度，是为了从温莎城堡出发、在皇家包厢前结束。",
          ),
          [
            t(
              "Pheidippides ran about forty kilometers, and the length varied at first.",
              "斐迪庇第斯跑了大约四十公里，而且起初长度不固定。",
            ),
            t("The run to Sparta was about 240 kilometers.", "去斯巴达那段约有 240 公里。"),
            t("Louis won in 1896; the distance was set in 1908.", "路易斯 1896 年夺冠，距离是 1908 年定下的。"),
          ],
        ),
        ask(
          t("What does the last sentence suggest about most marathon runners?", "最后一句暗示了大多数马拉松跑者怎样？"),
          t("They run to test themselves rather than to beat others", "他们跑步是为了挑战自己，而不是为了打败别人"),
          [
            t("They expect to win the race", "他们指望赢得比赛"),
            t("They do not train before the race", "他们赛前不训练"),
            t("They run only in Greece", "他们只在希腊跑"),
          ],
          t(
            "It says the real contest for most is not against an opponent but against their own stamina and doubt.",
            "它说，对大多数人来说，真正的较量不是与对手，而是与自己的耐力和怀疑。",
          ),
          [
            t("Few of them win, the passage says.", "文中说他们中很少有人获胜。"),
            t("Their contest is against stamina and doubt, which needs training.", "他们挑战的是耐力和怀疑，这需要训练。"),
            t("More than a million people a year run marathons around the world.", "每年有一百多万人跑马拉松，不只在希腊。"),
          ],
        ),
        ask(
          t("Who won the first modern Olympic marathon?", "谁赢得了第一届现代奥运会马拉松？"),
          t("A Greek water carrier named Spyridon Louis", "希腊送水工斯皮里东·路易斯"),
          [t("Pheidippides", "菲迪皮德斯"), t("A French scholar", "一位法国学者"), t("A runner from London", "一位伦敦选手")],
          t("The race was won by a Greek water carrier named Spyridon Louis.", "比赛的冠军是希腊送水工斯皮里东·路易斯。"),
          [
            t("Pheidippides is the legend from 490 BCE.", "斐迪庇第斯是公元前 490 年传说里的人。"),
            t("The French scholar only suggested the race.", "那位法国学者只是提议举办比赛。"),
            t("London hosted the 1908 Olympics, not the first race.", "伦敦举办的是 1908 年奥运会，不是第一场比赛。"),
          ],
        ),
      ],
      [
        "Greek",
        "Pheidippides",
        "Marathon",
        "Athens",
        "Athenian",
        "Persian",
        "Sparta",
        "Olympic",
        "Olympics",
        "French",
        "Spyridon",
        "Louis",
        "London",
        "Windsor",
      ],
    ),
    passage(
      "why-we-have-referees",
      t("Why We Have Referees", "为什么要有裁判"),
      `In the early days of football in England, there were no referees at all. The players were expected to be gentlemen who would never cheat, so any argument was settled by the two team captains. As the game became more popular and more competitive, this system broke down. Captains rarely agreed when a foul had been committed by their own side.

The next step was to appoint two umpires, one chosen by each team. Each umpire watched one half of the field. But because each was chosen by a team, players suspected them of favoring their own side. So, in the 1870s, a third official was added. He stood on the side of the field, and the umpires could "refer" a disagreement to him. This is where the word referee comes from: the person to whom a question is referred.

By 1891, the referee had moved onto the field and become the main decision maker, with the power to award a penalty, send off a player and stop the game. The two umpires became his assistants, running along the sides.

Why do sports need referees at all? One reason is that players, coaches and spectators all want their own team to win, so they cannot judge fairly. A referee is supposed to be neutral, belonging to neither side. Another reason is speed. Games move fast, and someone must decide at once, so the game can go on.

Referees are often booed and shouted at. Yet without them, most games would quickly fall apart into arguments. A good referee is someone whose decisions are accepted, even by the team that loses.`,
      [rulesWords, competitionWords, argument],
      [
        ask(
          t("Why did the system of letting captains settle arguments break down?", "为什么由队长解决争端的做法行不通了？"),
          t(
            "As the game became more competitive, captains rarely agreed about their own side's fouls",
            "随着比赛竞争越来越激烈，队长很少能就本方的犯规达成一致",
          ),
          [
            t("There were too many captains on each team", "每支球队的队长太多了"),
            t("The captains did not know the rules", "队长们不懂规则"),
            t("The umpires refused to work", "裁判员拒绝工作"),
          ],
          t(
            "The first paragraph says that as the game became more competitive the system broke down, because captains rarely agreed when their own side had fouled.",
            "第一段说，随着比赛越来越激烈，这一做法行不通了，因为本方犯规时队长很少能达成一致。",
          ),
          [
            t("The number of captains is not the problem. They could not agree.", "问题不在队长人数，而在他们无法达成一致。"),
            t("The captains were not said to lack the rules.", "文中没说队长不懂规则。"),
            t("Umpires came after the captain system failed.", "裁判员是在队长制失败后才出现的。"),
          ],
        ),
        ask(
          t("Where does the word referee come from?", "referee 这个词是怎么来的？"),
          t("From the official to whom a disagreement was referred", "来自被提交争议的那位裁判"),
          [
            t("From the name of a famous captain", "来自一位著名队长的名字"),
            t("From a word meaning to run along the sides", "来自一个意为沿边线奔跑的词"),
            t("From a Greek word for a whistle", "来自希腊语中表示哨子的词"),
          ],
          t(
            "The second paragraph says the umpires could refer a disagreement to the third official, so the referee is the person to whom a question is referred.",
            "第二段说，裁判员可以把争议提交给第三位裁判，所以 referee 就是问题被提交给的那个人。",
          ),
          [
            t("No captain's name is involved.", "和哪位队长的名字无关。"),
            t("Running along the sides is what the assistants did later.", "沿边线跑是后来助理裁判做的事。"),
            t("The word comes from refer, not a Greek word.", "这个词来自 refer，不是希腊语。"),
          ],
        ),
        ask(
          t("What two reasons does the passage give for why sports need referees?", "文章给出了体育运动需要裁判的哪两个理由？"),
          t(
            "Those who want a team to win cannot judge fairly, and decisions must be made quickly",
            "希望某队获胜的人无法公正裁判，而且必须迅速作出判定",
          ),
          [
            t("Referees score goals and sell tickets", "裁判会进球，还会卖票"),
            t("Players are always gentlemen and never cheat", "球员总是绅士，从不作弊"),
            t("Spectators like to boo, and captains like to argue", "观众喜欢喝倒彩，队长喜欢争吵"),
          ],
          t(
            "The fourth paragraph gives One reason, that everyone involved wants a side to win, and Another reason, speed.",
            "第四段给出了 One reason，即所有参与者都希望某方获胜，以及 Another reason，即速度。",
          ),
          [
            t("Referees do not score goals or sell tickets.", "裁判不进球也不卖票。"),
            t("Players could not be trusted to judge fairly. That is why referees came.", "正因为球员无法公正裁判，才有了裁判。"),
            t("Booing and arguing are problems, not reasons for referees.", "喝倒彩和争吵是问题，不是需要裁判的理由。"),
          ],
        ),
        ask(
          t("By what year had the referee moved onto the field?", "到哪一年裁判走进了球场？"),
          t("By 1891", "1891年"),
          [t("By 1870", "1870年"), t("By 1908", "1908年"), t("By 2012", "2012年")],
          t(
            "By 1891, the referee had moved onto the field and become the main decision maker.",
            "到1891年，裁判已走进球场成为主要决策者。",
          ),
          [
            t("The 1870s is when the third official was added on the side.", "1870 年代加入的第三位裁判还站在场边。"),
            t("1908 is the year in the marathon passage, not this one.", "1908 年属于马拉松那篇，不是这篇。"),
            t("2012 is never mentioned.", "文中从没提到 2012 年。"),
          ],
        ),
      ],
      ["England"],
    ),
    passage(
      "a-race-run-fairly",
      t("A Race Run Fairly", "公平的比赛"),
      `These are the rules for the 800-meter race at the Westfield Schools Track Meet. Every runner must read them before the race.

1. Eligibility. Only students in grades 6 to 8 who are registered with their school's team may compete. Each school may enter no more than three runners.

2. The start. Runners line up behind the curved white starting line. When the starter says "On your marks," runners step up to the line. At the sound of the starting horn, the race begins. A runner who moves before the horn has made a false start. The first false start is given a warning to the whole field. Any runner who makes a false start after that is disqualified.

3. Lanes. For the first 100 meters, each runner must stay in his or her own lane. After passing the green flag at the end of the first bend, runners may leave their lanes and move toward the inside of the track.

4. Contact. Runners must not push, trip or block another runner. Accidental contact is not a foul unless it causes another runner to fall or lose a place. A runner who causes such contact may be disqualified at the judges' decision.

5. The finish. The race ends when a runner's chest, not head, arm or foot, crosses the finish line. If two runners finish at the same time, the photo from the finish camera decides the result. If the photo cannot separate them, both share the place.

6. Appeals. A coach who believes a rule was broken may appeal in writing to the head judge within fifteen minutes of the end of the race. The head judge's decision is final.`,
      [rulesWords, rules, academic2],
      [
        ask(
          t(
            "A runner moves before the horn after the starter has already given one warning. What happens?",
            "发令员已经警告过一次，某个选手又在号角响起前起跑了。会怎样？",
          ),
          t("The runner is disqualified", "该选手被取消资格"),
          [
            t("The whole field gets another warning", "全体选手再次受到警告"),
            t("The runner must start one meter behind", "该选手必须后退一米起跑"),
            t("Nothing happens because it is the first false start", "什么也不会发生，因为这是第一次抢跑"),
          ],
          t(
            "Rule 2 says the first false start brings a warning to the whole field, and any runner who makes a false start after that is disqualified.",
            "第 2 条规定，第一次抢跑时全体选手受到警告，此后任何抢跑的选手都会被取消资格。",
          ),
          [
            t("The whole field gets a warning only for the first false start.", "只有第一次抢跑才给全体警告。"),
            t("No rule moves a runner one meter back.", "没有规则让选手后退一米。"),
            t("The warning has already been given, so this is not the first.", "警告已经给过，这不是第一次了。"),
          ],
        ),
        ask(
          t(
            "Two runners brush shoulders on the back straight, and neither falls or loses a place. Is this a foul?",
            "两名选手在后直道上肩膀擦碰，但都没有摔倒或失去名次。这算犯规吗？",
          ),
          t(
            "No, because accidental contact is a foul only if it makes a runner fall or lose a place",
            "不算，因为意外接触只有在导致选手摔倒或失去名次时才算犯规",
          ),
          [
            t("Yes, because any touching is a foul", "算，因为任何接触都是犯规"),
            t("Yes, because they left their lanes", "算，因为他们离开了自己的跑道"),
            t("No, because contact is always allowed", "不算，因为接触总是被允许的"),
          ],
          t(
            "Rule 4 gives the exception: accidental contact is not a foul unless it causes another runner to fall or lose a place.",
            "第 4 条给出了例外：意外接触不算犯规，除非它导致另一名选手摔倒或失去名次。",
          ),
          [
            t("Accidental contact is not a foul unless someone falls or loses a place.", "意外接触不算犯规，除非有人摔倒或失去名次。"),
            t("The back straight is past the green flag, so lanes are open.", "后直道已过绿旗，可以离开跑道。"),
            t("Pushing, tripping and blocking are never allowed.", "推、绊和阻挡任何时候都不允许。"),
          ],
        ),
        ask(
          t(
            "A runner leaves her lane fifty meters after the start. Which rule has she broken?",
            "一名选手在起跑后五十米处离开了自己的跑道。她违反了哪条规则？",
          ),
          t("Rule 3, because runners must stay in their lanes for the first 100 meters", "第 3 条，因为前 100 米选手必须待在自己的跑道上"),
          [
            t("Rule 1, because only three runners may enter", "第 1 条，因为只能有三名选手参赛"),
            t("Rule 5, because her chest has not crossed the line", "第 5 条，因为她的胸部还没过线"),
            t("No rule, because runners may always change lanes", "没有违反，因为选手随时可以换道"),
          ],
          t(
            "Rule 3 says each runner must stay in his or her own lane for the first 100 meters, until the green flag.",
            "第 3 条规定，前 100 米内，直到绿旗处，每名选手都必须待在自己的跑道上。",
          ),
          [
            t("Rule 1 is about who may enter, not lanes.", "第一条讲参赛资格，不是跑道。"),
            t("Rule 5 is about the finish.", "第五条讲的是终点。"),
            t("Runners must keep their lanes for the first 100 meters.", "前 100 米必须留在自己的跑道上。"),
          ],
        ),
        ask(
          t("What part of a runner must cross the line to finish?", "选手身体的哪个部位过线才算完成比赛？"),
          t("The chest", "胸部"),
          [t("The head", "头部"), t("The foot", "脚"), t("The arm", "手臂")],
          t(
            "The race ends when a runner's chest, not head, arm or foot, crosses the finish line.",
            "选手的胸部（而不是头、手臂或脚）越过终点线时比赛结束。",
          ),
          [
            t("The head is named as not counting.", "规则明确说头不算。"),
            t("The foot is named as not counting.", "规则明确说脚不算。"),
            t("The arm is named as not counting.", "规则明确说手臂不算。"),
          ],
        ),
      ],
      ["Westfield"],
    ),
    passage(
      "practice-makes-progress",
      t("Practice Makes Progress", "熟能生巧"),
      `Many people believe that great athletes are simply born with talent. Talent does matter: a basketball player who is two meters tall has an advantage that no amount of training can give. But scientists who study sport have found that how an athlete practices matters at least as much.

In the 1990s, a psychologist named Anders Ericsson studied violin students at a music school in Berlin. He found that the best students were not the ones with the most natural gift. They were the ones who had spent the most time in what he called deliberate practice. Later researchers found similar results in chess, swimming and many other skills.

Deliberate practice is not the same as simply playing. A young footballer who kicks a ball around with friends for an hour is having fun, which is valuable. But a player who spends that hour taking fifty free kicks from the same spot, noticing where each one goes and changing one small thing each time, is practicing deliberately. It means working on a skill just beyond what you can already do, with a clear goal and quick feedback, often from a coach.

This kind of practice is hard. It requires focus, and it is often frustrating, because you are always working on what you cannot yet do. That is why good training plans include rest. Muscles grow stronger during recovery, not during the workout itself, and athletes who never rest are more likely to suffer a strain or a sprain.

The old saying is "Practice makes perfect." No one is perfect, so a better version might be: practice, done well and with rest, makes progress.`,
      [trainingWords, argument, academic3],
      [
        ask(
          t("What is the author's main claim?", "作者的主要观点是什么？"),
          t("How an athlete practices matters at least as much as talent", "运动员的训练方式至少和天赋同样重要"),
          [
            t("Talent does not matter at all in sport", "天赋在体育中根本不重要"),
            t("Only tall people can play basketball", "只有个子高的人才能打篮球"),
            t("Athletes should never take a rest", "运动员永远不应该休息"),
          ],
          t(
            "The first paragraph grants that talent matters, then states the claim: how an athlete practices matters at least as much.",
            "第一段承认天赋很重要，然后提出观点：运动员怎样训练至少同样重要。",
          ),
          [
            t("Talent does matter, the author says, like a tall basketball player.", "作者说天赋确实重要，比如个子高的篮球运动员。"),
            t("Height is an example, not the main claim.", "身高只是例子，不是主要观点。"),
            t("The author says rest is needed.", "作者说需要休息。"),
          ],
        ),
        ask(
          t("What evidence does the author give for the claim?", "作者为这一观点提供了什么证据？"),
          t(
            "Ericsson's study found the best violin students had done the most deliberate practice",
            "埃里克森的研究发现，最优秀的小提琴学生做了最多的刻意练习",
          ),
          [
            t("A footballer kicked a ball with friends for an hour", "一名足球运动员和朋友踢了一小时球"),
            t("The old saying Practice makes perfect", "老话“熟能生巧”"),
            t("Muscles grow stronger during recovery", "肌肉在恢复期间变得更强壮"),
          ],
          t(
            "The second paragraph describes Ericsson's study, in which the best students were those who had spent the most time in deliberate practice, and similar later results.",
            "第二段描述了埃里克森的研究：最优秀的学生是那些花最多时间刻意练习的人，后来的研究也得出了类似结果。",
          ),
          [
            t("Kicking with friends is an example of play, not evidence.", "和朋友踢球是玩耍的例子，不是证据。"),
            t("The saying is something the author revises.", "这句俗语是作者要修改的说法。"),
            t("Recovery explains rest, not the main claim.", "恢复解释的是休息，不是主要观点。"),
          ],
        ),
        ask(
          t("Why do good training plans include rest?", "为什么好的训练计划包括休息？"),
          t(
            "Muscles grow stronger during recovery, and athletes who never rest are more likely to get hurt",
            "肌肉在恢复期间变强，而从不休息的运动员更容易受伤",
          ),
          [
            t("Rest is more fun than practice", "休息比训练更有趣"),
            t("Coaches need time to give feedback", "教练需要时间给出反馈"),
            t("Deliberate practice is too easy", "刻意练习太容易了"),
          ],
          t(
            "The fourth paragraph says muscles grow stronger during recovery and athletes who never rest are more likely to suffer a strain or a sprain.",
            "第四段说，肌肉在恢复期间变强，而从不休息的运动员更容易拉伤或扭伤。",
          ),
          [
            t("Rest is not chosen for fun.", "休息不是为了好玩。"),
            t("Feedback comes during practice, not rest.", "反馈在练习中给出，不是休息时。"),
            t("Deliberate practice is hard, not easy.", "刻意练习很难，并不简单。"),
          ],
        ),
        ask(
          t("Whom did Anders Ericsson study in Berlin?", "安德斯·埃里克森在柏林研究了谁？"),
          t("Violin students at a music school", "音乐学校的小提琴学生"),
          [t("Football players", "足球运动员"), t("Chess players", "国际象棋棋手"), t("Swimmers", "游泳运动员")],
          t("Ericsson studied violin students at a music school in Berlin.", "埃里克森研究了柏林一所音乐学校的小提琴学生。"),
          [
            t("Football is an example the author gives, not Ericsson's study.", "足球是作者举的例子，不是埃里克森的研究。"),
            t("Chess came from later researchers.", "国际象棋来自后来的研究者。"),
            t("Swimming came from later researchers too.", "游泳也来自后来的研究者。"),
          ],
        ),
      ],
      ["Anders", "Ericsson", "Ericsson's", "Berlin"],
    ),
    passage(
      "the-rules-of-the-game",
      t("The Rules of the Game", "比赛规则"),
      `The Oakdale Youth Basketball League plays by the usual rules of basketball, with a few changes for younger players. Coaches, players and parents should read these league rules carefully.

Playing time. Every player on the team must play at least one full quarter of each game, unless the player is injured or arrives late. A player who arrives after the start of the second quarter is not guaranteed playing time.

Fouls. A player who commits five personal fouls must leave the game and may not return. A technical foul, given for arguing with an official or for unsporting behavior, counts as a personal foul. A coach who receives two technical fouls in one game must leave the gym.

Free throws. Players in the under-12 division may shoot free throws from one meter closer than the usual line. Players in the under-14 division shoot from the usual line.

Defense. In the under-12 division, teams must play person-to-person defense, in which each player guards one opponent. Zone defense, in which players guard an area instead, is not allowed until the last two minutes of the game.

Forfeits. A team must have at least five players present to start a game. If a team has fewer than five players fifteen minutes after the scheduled start, it forfeits the game, and the other team is given the win. A team that forfeits three games in one season may be suspended from the league.

Weather and safety. If the gym must be closed, the league will post a notice on its website by 8 a.m. on game day. Games that are canceled will be rescheduled.`,
      [rulesWords, rules, competitionWords],
      [
        ask(
          t(
            "An under-12 player arrives at the start of the third quarter. Must the coach give her a full quarter?",
            "一名 12 岁以下组的球员在第三节开始时到场。教练必须让她打满一节吗？",
          ),
          t("No, because she arrived after the start of the second quarter", "不必，因为她在第二节开始后才到"),
          [
            t("Yes, because every player must play a full quarter", "必须，因为每个球员都必须打满一节"),
            t("Yes, because she is in the under-12 division", "必须，因为她在 12 岁以下组"),
            t("No, because under-12 players never play full quarters", "不必，因为 12 岁以下组球员从不打满一节"),
          ],
          t(
            "The playing time rule has an exception: a player who arrives after the start of the second quarter is not guaranteed playing time.",
            "上场时间规则有一个例外：在第二节开始后才到场的球员不保证有上场时间。",
          ),
          [
            t("The full-quarter rule has an exception for late arrival.", "打满一节的规则对迟到有例外。"),
            t("The division does not change the late-arrival rule.", "组别不影响迟到规则。"),
            t("Under-12 players do play full quarters.", "十二岁以下组的球员也打满一节。"),
          ],
        ),
        ask(
          t(
            "A player has four personal fouls and then argues with the referee and is given a technical foul. What happens?",
            "一名球员已有四次个人犯规，又因与裁判争吵被判技术犯规。会怎样？",
          ),
          t(
            "He must leave the game, because the technical foul is his fifth personal foul",
            "他必须离场，因为这次技术犯规是他的第五次个人犯规",
          ),
          [
            t("Nothing, because technical fouls do not count", "什么也不会发生，因为技术犯规不计数"),
            t("His coach must leave the gym", "他的教练必须离开体育馆"),
            t("His team forfeits the game", "他的球队被判弃权"),
          ],
          t(
            "The fouls rule says a technical foul counts as a personal foul, and a player with five personal fouls must leave the game.",
            "犯规规则说，技术犯规算作个人犯规，个人犯规满五次的球员必须离场。",
          ),
          [
            t("A technical foul counts as a personal foul.", "技术犯规算作个人犯规。"),
            t("The coach leaves only after two technical fouls of his own.", "教练自己被判两次技术犯规才要离场。"),
            t("Forfeits are about too few players.", "弃权与人数不足有关。"),
          ],
        ),
        ask(
          t(
            "An under-12 team wants to play zone defense with five minutes left. Is it allowed?",
            "一支 12 岁以下组的球队想在比赛还剩五分钟时打区域防守。可以吗？",
          ),
          t("No, zone defense is allowed only in the last two minutes", "不可以，区域防守只能在最后两分钟使用"),
          [
            t("Yes, zone defense is always allowed", "可以，区域防守随时都可以"),
            t("Yes, because there are fewer than five players", "可以，因为球员少于五人"),
            t("No, zone defense is never allowed in any division", "不可以，任何组别都不允许区域防守"),
          ],
          t(
            "The defense rule says under-12 teams must play person-to-person, and zone defense is not allowed until the last two minutes.",
            "防守规则规定，12 岁以下组必须打人盯人防守，最后两分钟之前不允许区域防守。",
          ),
          [
            t("Under-12 teams must play person-to-person until the end.", "十二岁以下组在最后两分钟前必须人盯人。"),
            t("The number of players does not unlock zone defense.", "人数多少不能解锁区域防守。"),
            t("The ban is only for under-12, and only before the last two minutes.", "只在十二岁以下组限制，而且只到最后两分钟前。"),
          ],
        ),
        ask(
          t("How many players must a team have to start a game?", "一支球队至少要有几名队员才能开赛？"),
          t("At least five", "至少五名"),
          [t("At least three", "至少三名"), t("At least eight", "至少八名"), t("At least twelve", "至少十二名")],
          t("A team must have at least five players present to start a game.", "球队必须至少有五名队员到场才能开赛。"),
          [
            t("Three forfeits is the number for suspension.", "三次弃权是停赛的标准。"),
            t("Eight is never mentioned.", "文中没提八人。"),
            t("Twelve is never mentioned.", "文中没提十二人。"),
          ],
        ),
      ],
      ["Oakdale"],
    ),
    passage(
      "winning-and-losing-well",
      t("Winning and Losing Well", "赢得漂亮，输得体面"),
      `At the end of the 2012 Olympic 10,000-meter race in London, the winner, Mo Farah, crossed the line with his arms wide and his mouth open in joy. A few meters behind, his training partner Galen Rupp, who had come second, ran straight to him and hugged him. They had competed against each other with everything they had, and then they celebrated together. That moment is a picture of sportsmanship.

Sportsmanship means treating opponents, officials and the game itself with respect, whether you win or lose. It is easy to talk about but hard to practice, especially when emotions run high.

Losing well is perhaps the harder part. After a defeat, a good sport shakes hands with the other team and congratulates them, even while feeling disappointed. She does not blame the referee, her teammates or bad luck for everything. Instead, she asks what she could do better next time. Throwing a racket or refusing to shake hands might feel satisfying for a moment, but it shows a lack of respect for the opponent who played well.

Winning well matters just as much. A good winner celebrates, but does not mock or taunt the losing side. She remembers that the other team trained hard too, and that next week the result might be reversed.

Why does this matter? Sport is a contest, but it is also an agreement. Both sides agree to follow the same rules and to accept the result. Without that agreement, there would be no game at all. A player who cheats or bullies may win a match, but he breaks the very thing that makes victory mean something.

That is why many coaches say that the true test of an athlete is not the score. It is how she behaves when the final whistle blows.`,
      [competitionWords, rulesWords, argument],
      [
        ask(
          t("Why does the passage begin with Mo Farah and Galen Rupp?", "文章为什么以莫·法拉和盖伦·鲁普开头？"),
          t("To give a real example of sportsmanship before defining it", "在给出定义之前，先举一个体育精神的真实例子"),
          [
            t("To explain how to win a 10,000-meter race", "解释如何赢得一万米比赛"),
            t("To argue that second place is better than first", "论证第二名比第一名好"),
            t("To show that training partners never compete", "说明训练伙伴从不互相竞争"),
          ],
          t(
            "The first paragraph describes the two runners hugging after competing hard and calls it a picture of sportsmanship; the second paragraph then defines the word.",
            "第一段描述了两位跑者全力竞争后相拥，称之为体育精神的写照；第二段接着给出这个词的定义。",
          ),
          [
            t("The passage is about behavior, not race tactics.", "文章讲的是行为，不是比赛技巧。"),
            t("Rupp came second and celebrated Farah's win.", "拉普获得第二，为法拉的胜利庆祝。"),
            t("They competed with everything they had.", "他们全力以赴地相互竞争。"),
          ],
        ),
        ask(
          t("According to the passage, what does a good loser do?", "根据文章，一个输得起的人会怎么做？"),
          t("Congratulates the other team and asks what to do better next time", "祝贺对方并思考下次如何做得更好"),
          [
            t("Blames the referee for the defeat", "把失败归咎于裁判"),
            t("Refuses to shake hands", "拒绝握手"),
            t("Mocks the winning team", "嘲笑获胜的一方"),
          ],
          t(
            "The third paragraph says a good sport shakes hands, congratulates the other team and asks what she could do better next time.",
            "第三段说，有体育精神的人会握手、祝贺对方，并思考下次怎样做得更好。",
          ),
          [
            t("A good loser does not blame the referee.", "好的输家不怪裁判。"),
            t("A good loser shakes hands.", "好的输家会握手。"),
            t("Mocking is what a bad winner does.", "嘲笑是糟糕的赢家才会做的事。"),
          ],
        ),
        ask(
          t("Which reason does the author give for why sportsmanship matters?", "作者给出了体育精神为什么重要的哪个理由？"),
          t("Sport depends on both sides agreeing to follow the rules and accept the result", "体育运动依赖于双方都同意遵守规则并接受结果"),
          [
            t("Good sports always win more games", "有体育精神的人总能赢得更多比赛"),
            t("Referees give extra points for good behavior", "裁判会因为表现好而加分"),
            t("Coaches only choose players who smile", "教练只选会笑的球员"),
          ],
          t(
            "The paragraph that asks Why does this matter? answers that sport is an agreement to follow the same rules and accept the result, and without it there would be no game.",
            "提出 Why does this matter? 的那一段回答说，体育是一种遵守同样规则并接受结果的约定，没有它就没有比赛。",
          ),
          [
            t("Winning more is never claimed.", "文中从没说会赢得更多。"),
            t("Referees give no points for behavior.", "裁判不会因为表现好而加分。"),
            t("Smiling is never mentioned.", "文中从没提微笑。"),
          ],
        ),
        ask(
          t("Which race did Mo Farah win in 2012?", "2012年莫·法拉赢了哪个项目？"),
          t("The Olympic 10,000-meter race", "奥运会一万米赛跑"),
          [t("The marathon", "马拉松"), t("The 800-meter race", "800米赛跑"), t("The 100-meter race", "100米赛跑")],
          t("Mo Farah won the 2012 Olympic 10,000-meter race in London.", "莫·法拉赢得了2012年伦敦奥运会一万米赛跑。"),
          [
            t("The marathon is a different topic.", "马拉松是另一个话题。"),
            t("The 800-meter race is in the track meet rules.", "800 米赛跑出现在田径规则里。"),
            t("The 100-meter race is never mentioned.", "文中从没提 100 米赛跑。"),
          ],
        ),
      ],
      ["Olympic", "London", "Mo", "Farah", "Galen", "Rupp"],
    ),
    passage(
      "girls-on-the-field",
      t("Girls on the Field", "赛场上的女孩"),
      `In 1967, a twenty-year-old student named Kathrine Switzer entered the Boston Marathon. At the time, women were not officially allowed to run it; many people believed that running such a long distance was harmful to women. Switzer signed the entry form with her initials, K. V. Switzer, and was given a number. A few kilometers into the race, an official spotted her, ran onto the course and tried to tear the number off her shirt. Her friends pushed him away, and Switzer finished the race. Photographs of the attack appeared in newspapers around the world.

Switzer's run became a symbol of a long struggle. For much of the twentieth century, girls and women had far fewer chances to play sports than boys and men. Schools spent most of their sports money on boys' teams, and many competitions were closed to women entirely. The first women's Olympic marathon was not held until 1984.

Change came slowly, and often through rules. In the United States, a law passed in 1972, known as Title IX, required schools that receive government money to give girls the same opportunities as boys, including in sports. Before the law, about one in twenty-seven high school girls played a school sport. Today, it is about two in five.

The struggle is not over. In many countries, women athletes are still paid less than men, receive less attention in the news and have fewer places to train. But each generation of girls who step onto the field owes something to the women who were told they did not belong there, and ran anyway.

Kathrine Switzer ran the Boston Marathon again in 2017, at the age of seventy, wearing the same number.`,
      [competitionWords, rulesWords, argument, academic3],
      [
        ask(
          t("Why was Kathrine Switzer's run in 1967 important?", "为什么凯瑟琳·斯威策 1967 年的那次奔跑很重要？"),
          t("It became a symbol of the struggle for women's place in sport", "它成为女性争取体育地位斗争的象征"),
          [
            t("She won the race by a large margin", "她以很大的优势赢得了比赛"),
            t("She was the first person ever to run a marathon", "她是有史以来第一个跑马拉松的人"),
            t("She made the official her friend", "她和那位官员成了朋友"),
          ],
          t(
            "The second paragraph says Switzer's run became a symbol of a long struggle for girls and women to play sports.",
            "第二段说，斯威策的奔跑成了女孩和女性争取参与体育运动这一长期斗争的象征。",
          ),
          [
            t("Switzer finished the race but is not said to have won.", "斯威策跑完了，但文中没说她获胜。"),
            t("Pheidippides ran long before her.", "斐迪庇第斯在她之前很久就跑过。"),
            t("Her friends pushed the official away.", "她的朋友把那名官员推开了。"),
          ],
        ),
        ask(
          t("What evidence shows that Title IX made a difference?", "什么证据表明《第九条》起了作用？"),
          t(
            "High school girls playing sports rose from about one in twenty-seven to about two in five",
            "参加运动的高中女生从约二十七分之一增加到约五分之二",
          ),
          [
            t("The law was passed in 1972", "这项法律于 1972 年通过"),
            t("Women athletes are still paid less than men", "女运动员的收入仍然比男运动员低"),
            t("Switzer ran again at the age of seventy", "斯威策七十岁时再次参赛"),
          ],
          t(
            "The third paragraph compares the numbers before and after the law: from about one in twenty-seven girls to about two in five.",
            "第三段对比了法律通过前后的数字：从约二十七分之一的女生增加到约五分之二。",
          ),
          [
            t("The year alone does not show a change.", "光有年份不能说明变化。"),
            t("Lower pay shows what is still wrong.", "收入较低说明问题仍在。"),
            t("Her second run is a symbol, not evidence of Title IX.", "她再跑一次是象征，不是第九条的证据。"),
          ],
        ),
        ask(
          t("What is the author's view of the struggle today?", "作者对今天的这场斗争持什么看法？"),
          t("Much has changed, but the struggle is not over", "已经有了很大变化，但斗争还没有结束"),
          [
            t("Women and men are now treated equally everywhere", "如今男女在各地都受到平等对待"),
            t("Nothing has changed since 1967", "自 1967 年以来一切都没有变"),
            t("Girls should stop playing sports", "女孩应该停止参加体育运动"),
          ],
          t(
            "The fourth paragraph begins The struggle is not over and lists how women athletes are still treated unequally, after the passage has shown how much has changed.",
            "第四段以 The struggle is not over 开头，列举了女运动员至今仍受到的不平等待遇，而此前文章已说明了已有的巨大变化。",
          ),
          [
            t("Women are still paid less in many countries.", "在许多国家女性收入仍然更低。"),
            t("Girls playing sports rose from one in twenty-seven to two in five.", "参加运动的女生从二十七分之一升到五分之二。"),
            t("The author praises girls who step onto the field.", "作者赞扬走上赛场的女孩。"),
          ],
        ),
      ],
      ["Kathrine", "Switzer", "Switzer's", "Boston", "K.", "V.", "Olympic", "Title", "IX"],
    ),
    passage(
      "should-video-replay-decide",
      t("Should Video Replay Decide?", "应该由视频回放来判定吗？"),
      `In the 2010 World Cup, England's Frank Lampard kicked a ball that hit the crossbar, bounced down well over the goal line and spun back out. Millions of viewers saw on replays that it was clearly a goal. But the referee, who had seen it for less than a second from far away, ruled that it was not. England went on to lose the match. Moments like this have led many sports to use video replay to check difficult decisions. I believe this is the right choice, as long as it is used carefully.

The strongest argument for replay is fairness. Athletes train for years, and a single wrong call can decide a championship. When the technology exists to see what really happened, it seems wrong not to use it. In tennis, a system of cameras now tracks the ball and shows whether it landed in or out, and players accept its decisions almost without argument.

A second argument is that replay protects referees. Officials are human, and they cannot see everything in a fraction of a second. Replay lets them correct an honest mistake instead of being blamed for it for years.

Critics say that replay slows the game down. Fans may wait minutes while officials study the screen, and the excitement of a goal can disappear while everyone waits. Critics also point out that many calls, such as whether a tackle was a foul, are matters of judgment that a camera cannot settle.

These are real problems, but they can be solved. Replay should be used only for clear, factual questions, such as whether a ball crossed a line, and reviews should have a strict time limit. Used this way, replay can make sport fairer without taking away its excitement.`,
      [rulesWords, argument, rules],
      [
        ask(
          t("What is the author's claim?", "作者的观点是什么？"),
          t("Sports should use video replay, as long as it is used carefully", "体育运动应该使用视频回放，只要谨慎使用"),
          [
            t("Video replay should be banned from all sports", "所有体育运动都应禁止视频回放"),
            t("Referees should be replaced by cameras", "应该用摄像机取代裁判"),
            t("England should have won the 2010 World Cup", "英格兰本该赢得 2010 年世界杯"),
          ],
          t(
            "The first paragraph ends with the claim: I believe this is the right choice, as long as it is used carefully.",
            "第一段最后提出了观点：我认为这是正确的选择，只要谨慎使用。",
          ),
          [
            t("The author supports replay, used carefully.", "作者支持谨慎使用回放。"),
            t("Cameras help referees; they do not replace them.", "摄像机帮助裁判，而不是取代裁判。"),
            t("The Lampard goal is an example, not the claim.", "兰帕德的进球是例子，不是观点。"),
          ],
        ),
        ask(
          t("Which piece of evidence supports the reason of fairness?", "哪条证据支持“公平”这一理由？"),
          t("In tennis, players accept the camera system's in-or-out decisions", "在网球比赛中，球员接受摄像系统对界内界外的判定"),
          [
            t("Fans may wait minutes while officials study the screen", "裁判看屏幕时，观众可能要等好几分钟"),
            t("Some calls are matters of judgment", "有些判罚是主观判断问题"),
            t("Referees see things for less than a second", "裁判看到情况的时间不到一秒"),
          ],
          t(
            "The second paragraph gives the reason of fairness and supports it with the tennis example, where players accept the cameras almost without argument.",
            "第二段提出公平这一理由，并用网球的例子来支持：球员几乎毫无异议地接受摄像系统的判定。",
          ),
          [
            t("Waiting is a point the critics make.", "等待是批评者提出的问题。"),
            t("Judgment calls are another critics' point.", "判罚需要判断，也是批评者的观点。"),
            t("The short glance supports protecting referees, not fairness.", "短暂一瞥支持的是保护裁判，不是公平。"),
          ],
        ),
        ask(
          t("How does the author answer the critics?", "作者是怎样回应批评者的？"),
          t("By proposing that replay be used only for factual questions, with a time limit", "提议只把回放用于事实性问题，并设定时间限制"),
          [
            t("By saying the critics do not like sport", "说批评者不喜欢体育"),
            t("By agreeing that replay should never be used", "同意永远不应使用回放"),
            t("By ignoring what they say", "无视他们的说法"),
          ],
          t(
            "The last paragraph calls the problems real but solvable, and proposes using replay only for clear, factual questions with a strict time limit.",
            "最后一段说这些问题确实存在但可以解决，并提议只将回放用于清楚的事实性问题，同时严格限时。",
          ),
          [
            t("The author does not attack the critics.", "作者没有攻击批评者。"),
            t("The author still supports replay.", "作者仍然支持回放。"),
            t("The author calls their points real problems.", "作者称他们的观点是真实的问题。"),
          ],
        ),
      ],
      ["England's", "England", "Frank", "Lampard", "World", "Cup"],
    ),
  ],
};
