// The reading unit of the A2 theme Sports and Games: matches, races, rules and players, with adverbs and could.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { readingWords } from "./reading-words.ts";

const passage = passageMaker(readingWords, [
  "a2-words-sports",
  "a2-words-competition",
  "a2-words-movement",
  "a2-words-games",
  "a2-words-adverbs",
  "adverbs-of-manner",
  "could-for-past-ability",
]);

/** readingSports is the reading unit of the theme Sports and Games. */
export const readingSports: ReadingUnitDef = {
  id: "a2-reading-sports",
  title: t("Sports and Games", "运动和游戏"),
  passages: [
    passage({
      id: "a2-sports-the-ping-pong-champion",
      title: ["The Ping-Pong Champion", "乒乓球冠军"],
      body: `Wang Fang is fourteen years old, and she is the ping-pong champion of her city. She started to play when she was six. At first she couldn't hit the ball over the table, but she practiced every day after school.

Now she practices for three hours a day, six days a week. Her coach, Mr. Liu, says she plays very fast and very carefully. "She can see where the ball will go before it gets there," he says.

Last month Wang Fang played in the city final against a girl of seventeen. The other player was taller and stronger, and she won the first two games easily. But Wang Fang didn't stop. She played more slowly and carefully, and she won the next three games. The fans cheered loudly.

After the match she held her medal and smiled. "I was worried after the first two games," she said. "But my coach always says: play the ball, not the player."

Now Wang Fang has a new dream: to play for China one day.`,
      grammar: ["adverbs-of-manner", "could-for-past-ability"],
      names: ["Wang", "Fang", "Mr", "Liu", "China"],
      questions: [
        [
          ["How old was Wang Fang when she started to play?", "王芳几岁开始打乒乓球？"],
          ["Six", "六岁"],
          [
            ["Fourteen", "十四岁"],
            ["Seventeen", "十七岁"],
          ],
          ['The passage says: "She started to play when she was six."', "她六岁开始打球；十四岁是她现在的年龄，十七岁是决赛对手的年龄。"],
        ],
        [
          ["How did Wang Fang win the final?", "王芳是怎样赢得决赛的？"],
          ["She played more slowly and carefully", "她打得更慢、更仔细"],
          [
            ["She was taller and stronger", "她更高更壮"],
            ["The other girl was ill", "另一个女孩生病了"],
          ],
          [
            'The passage says: "She played more slowly and carefully, and she won the next three games."',
            "输掉前两局后，她打得更慢、更仔细，赢了后三局。更高更壮的是对手。",
          ],
        ],
        [
          ["What is Wang Fang's new dream?", "王芳的新梦想是什么？"],
          ["To play for China", "代表中国打球"],
          [
            ["To be a coach", "当教练"],
            ["To win the city final", "赢得市决赛"],
          ],
          [
            'The last sentence says: "Now Wang Fang has a new dream: to play for China one day."',
            "她已经赢了市决赛，新的梦想是有一天代表中国打球。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-sports-a-race-in-the-rain",
      title: ["A Race in the Rain", "雨中赛跑"],
      body: `Last Saturday our school had its big race: two times around the park. It rained all morning, and the paths were wet and dangerous.

Two hundred students ran. At the start everyone ran fast, but after ten minutes many people were tired. My friend Ali was near the front. He was running easily, and he looked strong.

Then, near the lake, Ali slipped on the wet ground and fell. He hurt his knee, and many students went past him. I stopped and helped him up. "Go on," he said. "You can still win!" But I didn't want to leave him. We walked and ran slowly together to the end.

We came last. But when we arrived, all the other students were waiting for us, and they cheered loudly. Our teacher gave us a prize for helping a friend.

I didn't win the race, but that prize is the one I remember.`,
      grammar: ["adverbs-of-manner", "past-continuous"],
      names: ["Ali"],
      questions: [
        [
          ["What was the weather like on the day of the race?", "赛跑那天天气怎么样？"],
          ["It rained all morning", "下了一上午雨"],
          [
            ["It was hot and sunny", "又热又晴"],
            ["It snowed", "下雪了"],
          ],
          ['The passage says: "It rained all morning, and the paths were wet and dangerous."', "那天下了一上午雨，路又湿又危险。"],
        ],
        [
          ["What happened to Ali?", "阿里怎么了？"],
          ["He slipped and hurt his knee", "他滑倒伤了膝盖"],
          [
            ["He won the race", "他赢了比赛"],
            ["He got lost in the park", "他在公园里迷路了"],
          ],
          ['The passage says: "Ali slipped on the wet ground and fell. He hurt his knee."', "阿里在湿地上滑倒，伤了膝盖。"],
        ],
        [
          ["Why did the writer get a prize?", "作者为什么得了奖？"],
          ["For helping a friend", "因为帮助了朋友"],
          [
            ["For coming first", "因为得了第一"],
            ["For running in the rain", "因为冒雨跑步"],
          ],
          ['The passage says: "Our teacher gave us a prize for helping a friend."', "他们得了最后一名，但老师因为作者帮助朋友而给了奖。"],
        ],
      ],
    }),
    passage({
      id: "a2-sports-why-fans-cheer",
      title: ["Why Fans Cheer", "球迷为什么欢呼"],
      body: `Every weekend millions of people go to watch sports. They sing, shout, cheer and sometimes cry. Why do fans care so much?

One reason is that sports are interesting. In a match anything can happen. A team can lose for eighty minutes and then win in the last two. No one knows the end.

Another reason is that fans feel like part of a group. When you wear the colors of your team and sing with hundreds of other fans, you are not alone. You are part of something big. Many fans follow the same team all their lives, like their parents and grandparents before them.

Fans also think that their cheering helps, and they may be right! Players often say that loud fans make them play harder, and teams win more often at home than in other cities.

But the life of a fan is not always fun. When your team loses, you feel terrible. But the next week you hope again. That is what fans do.`,
      grammar: ["comparatives-and-superlatives"],
      questions: [
        [
          ["What is one reason that sports are interesting?", "运动有趣的一个原因是什么？"],
          ["Anything can happen in a match", "比赛中什么都可能发生"],
          [
            ["The best team always wins", "最好的球队总是赢"],
            ["Matches are short", "比赛时间很短"],
          ],
          [
            'The passage says: "In a match anything can happen... No one knows the end."',
            "一支球队可能输了八十分钟，却在最后两分钟赢了，没人知道结局。",
          ],
        ],
        [
          ["How do fans feel when they sing with other fans?", "和其他球迷一起唱歌时，球迷有什么感觉？"],
          ["Part of something big", "自己是一个大集体的一部分"],
          [
            ["Lonely", "孤独"],
            ["Bored", "无聊"],
          ],
          [
            'The passage says: "you are not alone. You are part of something big."',
            "和几百个球迷一起唱歌时，你不是一个人，而是一个大集体的一部分。",
          ],
        ],
        [
          ["What do players say about loud fans?", "球员们怎么说大声的球迷？"],
          ["They make them play harder", "让他们打得更卖力"],
          [
            ["They make them tired", "让他们很累"],
            ["They make them play badly", "让他们打得很差"],
          ],
          ['The passage says: "Players often say that loud fans make them play harder."', "球员们常说，大声的球迷让他们打得更卖力。"],
        ],
      ],
    }),
    passage({
      id: "a2-sports-our-teams-last-match",
      title: ["Our Team's Last Match", "我们队的最后一场比赛"],
      body: `On Friday our school football team played its last match of the year against Hill Park School. It was the final, and the whole school came to watch.

Hill Park were the champions last year, and they were very good. After ten minutes they scored the first goal. Their players were faster than ours, and they kicked the ball very well. At half time the score was two to zero.

In the break our coach, Ms. Lopez, talked to us quietly. "You're playing too fast," she said. "Slow down, hold the ball and work together."

In the second half we played much better. Sam scored with his head, and then Mia scored from far out. Two to two! The fans cheered and shouted. With one minute to go, the ball came to me. I kicked it hard, and it hit the side of the goal and went in!

We won three to two. For a moment I couldn't speak. It was the best moment of my life.`,
      grammar: ["adverbs-of-manner", "could-for-past-ability", "comparatives-and-superlatives"],
      names: ["Hill", "Park", "Ms", "Lopez", "Sam", "Mia"],
      questions: [
        [
          ["What was the score at half time?", "半场时比分是多少？"],
          ["Two to zero for Hill Park", "希尔帕克学校二比零领先"],
          [
            ["Two to two", "二比二"],
            ["Three to two", "三比二"],
          ],
          [
            'The passage says: "At half time the score was two to zero."',
            "上半场结束时希尔帕克学校二比零领先；二比二和三比二是下半场的比分。",
          ],
        ],
        [
          ["What did the coach tell the players?", "教练对队员们说了什么？"],
          ["Slow down, hold the ball and work together", "放慢速度、控住球、互相配合"],
          [
            ["Play faster and kick harder", "踢得更快更用力"],
            ["Stop and go home", "别踢了，回家吧"],
          ],
          ['Ms. Lopez says: "Slow down, hold the ball and work together."', "洛佩斯老师说他们踢得太快了，要放慢、控球、配合。"],
        ],
        [
          ["Who scored the last goal?", "谁进了最后一个球？"],
          ["The writer", "作者"],
          [
            ["Sam", "萨姆"],
            ["Mia", "米娅"],
          ],
          [
            'The writer says: "the ball came to me. I kicked it hard, and it hit the side of the goal and went in!"',
            "萨姆和米娅各进一球，最后一个球是作者踢进的。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-sports-the-rules-of-a-new-game",
      title: ["The Rules of a New Game", "一个新游戏的规则"],
      body: `Last month our class made a new board game. We call it Island Run. Here are the rules.

You need the board, one dice and a small toy animal for each player. Two to four people can play, alone or with a partner.

Every player starts on the beach. Throw the dice and move your animal. If you stop on a blue square, you must answer a question about English. If your answer is right, you can throw again. If it is wrong, you lose your next turn.

There are three levels on the board: the beach, the forest and the mountain. To go up a level, you have to answer a difficult question. The first player who arrives at the mountain wins.

There is one more rule: no cheating! If you cheat, you must go back to the beach.

We played it last Friday. It was fair, it was fun, and we learned a lot of words. Our teacher says we can play it every Friday afternoon.`,
      grammar: ["have-to", "should-and-must", "imperatives"],
      names: ["Island", "Run"],
      questions: [
        [
          ["How many people can play the game?", "这个游戏可以几个人玩？"],
          ["Two to four", "二到四人"],
          [
            ["Only one", "只能一个人"],
            ["Six or more", "六个人或更多"],
          ],
          [
            'The rules say: "Two to four people can play, alone or with a partner."',
            "规则说二到四人可以玩，可以单独玩，也可以和搭档一起。",
          ],
        ],
        [
          ["What happens if your answer is wrong?", "答错了会怎样？"],
          ["You lose your next turn", "下一轮停一次"],
          [
            ["You go back to the beach", "回到海滩"],
            ["You throw the dice again", "再掷一次骰子"],
          ],
          ['The rules say: "If it is wrong, you lose your next turn."', "答对可以再掷一次；答错就失去下一轮。回到海滩是作弊的惩罚。"],
        ],
        [
          ["What happens if you cheat?", "作弊会怎样？"],
          ["You must go back to the beach", "必须回到海滩"],
          [
            ["You win the game", "赢得游戏"],
            ["Nothing happens", "什么也不会发生"],
          ],
          ['The rules say: "If you cheat, you must go back to the beach."', "规则说作弊的人必须回到起点海滩。"],
        ],
      ],
    }),
    passage({
      id: "a2-sports-skating-on-the-lake",
      title: ["Skating on the Lake", "在湖上滑冰"],
      body: `When I was a child, the winters in my village were very cold. In January the lake froze, and the ice was hard and strong. Every afternoon after school, all the children went skating.

Grandpa taught me to skate when I was five. At first I couldn't stand on the ice. I fell again and again, and I cried. Grandpa held my hands and pulled me slowly across the lake. "Look up, not down," he said. "And don't be afraid to fall."

By the end of that winter I could skate easily. By the next winter I could skate faster than my older brother. We played games on the ice and skated until it was dark.

Now I live in a big city, and the winters are warmer. The lake near my apartment doesn't freeze, and children skate in a big building in the city center. It's safer, but it's not the same. I still remember the cold air, the white hills and Grandpa holding my hands.`,
      grammar: ["could-for-past-ability", "adverbs-of-manner"],
      questions: [
        [
          ["Who taught the writer to skate?", "谁教作者滑冰？"],
          ["Grandpa", "爷爷"],
          [
            ["An older brother", "哥哥"],
            ["A teacher at school", "学校的老师"],
          ],
          ['The passage says: "Grandpa taught me to skate when I was five."', "作者五岁时爷爷教会了她滑冰；哥哥后来被她超过了。"],
        ],
        [
          ["What did Grandpa tell the writer?", "爷爷对作者说了什么？"],
          ["Look up, not down", "往上看，别往下看"],
          [
            ["Skate faster", "滑快点"],
            ["Never fall", "永远别摔倒"],
          ],
          ['Grandpa says: "Look up, not down. And don\'t be afraid to fall."', "爷爷让作者往上看，不要怕摔倒。"],
        ],
        [
          ["Why don't children skate on the lake near the writer's apartment?", "为什么孩子们不在作者公寓附近的湖上滑冰？"],
          ["It doesn't freeze", "湖面不结冰"],
          [
            ["It is dangerous", "那里很危险"],
            ["It is too far", "那里太远了"],
          ],
          ['The passage says: "The lake near my apartment doesn\'t freeze."', "城市的冬天更暖和，湖不结冰，孩子们在大楼里滑冰。"],
        ],
      ],
    }),
    passage({
      id: "a2-sports-a-medal-for-the-slowest-runner",
      title: ["A Medal for the Slowest Runner", "给跑得最慢的人的奖牌"],
      body: `Every year our town has a race for children. Last year a boy called Toby joined it. Toby is ten, and he has a problem with his legs. He can walk and run, but slowly.

The race was two times around the park. When it started, the other children ran quickly, and soon Toby was alone at the back. His legs hurt, but he didn't stop.

After twenty minutes all the other children finished, and people started to leave. Then someone shouted, "Look! He's still running!" Everyone turned. Toby was coming slowly around the lake, with a red face.

The people came back. They stood along the path and cheered for him. Some of the other children ran the last part of the race with him. When Toby finished, the crowd shouted his name.

The race leader gave Toby a medal, the same as the winner. "You didn't run the fastest," she said, "but you didn't stop, and that is the most important thing."`,
      grammar: ["adverbs-of-manner", "past-continuous"],
      names: ["Toby"],
      questions: [
        [
          ["Why does Toby run slowly?", "托比为什么跑得慢？"],
          ["He has a problem with his legs", "他的腿有毛病"],
          [
            ["He is very young", "他年纪很小"],
            ["He didn't practice", "他没有练习"],
          ],
          ['The passage says: "he has a problem with his legs. He can walk and run, but slowly."', "托比的腿有问题，能走能跑，但很慢。"],
        ],
        [
          ["Why did the people come back?", "人们为什么又回来了？"],
          ["Someone saw that Toby was still running", "有人看到托比还在跑"],
          [
            ["They wanted their medals", "他们想要奖牌"],
            ["It started to rain", "开始下雨了"],
          ],
          ["The passage says: \"someone shouted, 'Look! He's still running!'\"", "有人喊托比还在跑，人们就回来为他加油。"],
        ],
        [
          ["What did Toby get?", "托比得到了什么？"],
          ["A medal, the same as the winner", "一枚和冠军一样的奖牌"],
          [
            ["A smaller prize", "一个小一点的奖品"],
            ["Nothing", "什么也没有"],
          ],
          [
            'The passage says: "The race leader gave Toby a medal, the same as the winner."',
            "比赛负责人给了托比一枚和冠军一样的奖牌，因为他坚持跑完了。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-sports-the-coachs-advice",
      title: ["The Coach's Advice", "教练的建议"],
      body: `Hi team,

Next Saturday we have the most important race of the year. Here is my advice for the week.

1. Sleep well. Go to bed early every night this week, not only on Friday.

2. Eat well. Have a good breakfast on Saturday morning, but not too much. Don't eat anything new on the day of the race.

3. Practice, but not too hard. On Monday, Tuesday and Wednesday we will practice for two hours. On Thursday and Friday we will run slowly, and only for an hour. You have to be fresh, not tired.

4. Think about yourself, not the others. Run your own race, and don't look at the players next to you.

5. Have fun! You can't win every race, but you can try your hardest.

Last year some of you couldn't finish the long race. This year I know you can. You are stronger and faster than ever.

See you on Saturday at seven o'clock at the park gate.

Coach Anna`,
      grammar: ["have-to", "imperatives", "could-for-past-ability"],
      names: ["Anna"],
      questions: [
        [
          ["When should the players go to bed early?", "队员们应该什么时候早睡？"],
          ["Every night this week", "这周的每个晚上"],
          [
            ["Only on Friday", "只在星期五"],
            ["Only on Saturday", "只在星期六"],
          ],
          ['The coach writes: "Go to bed early every night this week, not only on Friday."', "教练说这周每晚都要早睡，不只是星期五。"],
        ],
        [
          ["Why will they run slowly on Thursday and Friday?", "为什么星期四和星期五要慢跑？"],
          ["So they are fresh, not tired", "让他们精力充沛而不累"],
          [
            ["Because the coach is busy", "因为教练很忙"],
            ["Because it will rain", "因为会下雨"],
          ],
          ['The coach writes: "You have to be fresh, not tired."', "赛前两天减少训练，是为了比赛时精力充沛。"],
        ],
        [
          ["What happened last year?", "去年发生了什么？"],
          ["Some players couldn't finish the long race", "一些队员没能跑完长距离比赛"],
          [
            ["The team won every race", "队伍赢了每一场比赛"],
            ["The coach was ill", "教练病了"],
          ],
          ['The coach writes: "Last year some of you couldn\'t finish the long race."', "couldn't 表示过去没能做到：去年有些队员没跑完。"],
        ],
      ],
    }),
  ],
};
