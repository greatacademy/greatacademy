// The reading unit of the A2 theme Health and the Body: visits to the doctor, accidents and good habits.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { readingWords } from "./reading-words.ts";

const passage = passageMaker(readingWords, [
  "a2-words-health",
  "a2-words-body-2",
  "a2-words-staying-well",
  "a2-words-at-the-doctor",
  "should-and-must",
  "have-to",
]);

/** readingHealth is the reading unit of the theme Health and the Body. */
export const readingHealth: ReadingUnitDef = {
  id: "a2-reading-health",
  title: t("Health and the Body", "健康和身体"),
  passages: [
    passage({
      id: "a2-health-a-visit-to-the-dentist",
      title: ["A Visit to the Dentist", "看牙医"],
      body: `Last Tuesday I had a toothache, so Mom made an appointment with the dentist. I was worried, because I don't like dentists.

The dentist, Dr. Wong, was a friendly woman with a big smile. She asked me to sit in a large chair and open my mouth. Then she checked all my teeth carefully.

"You have a small problem here," she said. "This tooth is not healthy. It isn't serious, but I must fix it today." She fixed my tooth in twenty minutes, and it didn't hurt very much.

After that, she gave me some advice. "You should brush your teeth two times a day, for two minutes. And you should not eat a lot of candy. Come back in six months."

Now I brush my teeth every morning and every night, and I eat fruit after school, not candy. I'm not afraid of the dentist now.`,
      grammar: ["should-and-must", "past-simple-irregular"],
      names: ["Dr", "Wong"],
      questions: [
        [
          ["Why did the writer go to the dentist?", "作者为什么去看牙医？"],
          ["Because of a toothache", "因为牙疼"],
          [
            ["Because of a headache", "因为头疼"],
            ["For a check at school", "为了学校的体检"],
          ],
          ['The first sentence says: "Last Tuesday I had a toothache."', "第一句说作者牙疼，所以妈妈预约了牙医。"],
        ],
        [
          ["How long did it take to fix the tooth?", "补牙用了多长时间？"],
          ["Twenty minutes", "二十分钟"],
          [
            ["Two minutes", "两分钟"],
            ["An hour", "一个小时"],
          ],
          ['The passage says: "She fixed my tooth in twenty minutes."', "文中说她用二十分钟补好了牙；两分钟是刷牙的时间。"],
        ],
        [
          ["What advice did the dentist give?", "牙医给了什么建议？"],
          ["Brush your teeth two times a day", "每天刷两次牙"],
          [
            ["Never eat fruit", "永远不要吃水果"],
            ["Come back next week", "下周再来"],
          ],
          [
            'The dentist says: "You should brush your teeth two times a day, for two minutes."',
            "牙医用 should 给出建议：每天刷两次牙，每次两分钟；她让作者六个月后再来。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-health-why-we-need-sleep",
      title: ["Why We Need Sleep", "我们为什么需要睡觉"],
      body: `Everyone needs sleep, but many people don't sleep enough. Children like you should sleep for nine to eleven hours every night. Older people need seven to nine hours.

When you sleep, your body rests and grows. Your heart works more slowly, and your body repairs itself. Your head is busy too. It works on the things you learned during the day, so you can remember them.

If you don't sleep enough, you feel tired and weak. You can't think well at school, and you get ill more easily. Some people also feel angry or sad.

So how can you sleep better? Here is some advice. You should go to bed at the same time every night. You should not use your phone or watch TV in bed, because their light makes it difficult to sleep. You should also get some exercise during the day, but not late in the evening. And don't drink coffee or tea after lunch!

Sleep is not lost time. It is one of the most important things you can do for your health.`,
      grammar: ["should-and-must"],
      questions: [
        [
          ["How many hours should children sleep every night?", "孩子每晚应该睡几个小时？"],
          ["Nine to eleven", "九到十一个小时"],
          [
            ["Seven to nine", "七到九个小时"],
            ["Five to six", "五到六个小时"],
          ],
          [
            'The passage says: "Children like you should sleep for nine to eleven hours every night."',
            "七到九个小时是年纪大一些的人需要的睡眠。",
          ],
        ],
        [
          ["What does your head do while you sleep?", "睡觉时你的大脑在做什么？"],
          ["It works on the things you learned", "处理你白天学到的东西"],
          [
            ["It stops working", "停止工作"],
            ["It makes your heart work faster", "让心脏跳得更快"],
          ],
          [
            'The passage says: "It works on the things you learned during the day, so you can remember them."',
            "文中说睡觉时大脑也很忙，会处理白天学到的东西，让你记住。心脏反而跳得更慢。",
          ],
        ],
        [
          ["Why shouldn't you use your phone in bed?", "为什么不应该在床上用手机？"],
          ["Its light makes it difficult to sleep", "它的光让人难以入睡"],
          [
            ["It is bad for your bones", "对骨头不好"],
            ["Your parents get angry", "父母会生气"],
          ],
          ['The passage says: "because their light makes it difficult to sleep."', "because 后面给出了原因：手机和电视的光让人难以入睡。"],
        ],
      ],
    }),
    passage({
      id: "a2-health-the-bike-accident",
      title: ["The Bike Accident", "自行车事故"],
      body: `Last Friday my friend Omar had an accident on his bike. We were riding home from school down a big hill. Omar was going very fast, and he didn't see a stone on the road. His bike hit the stone, and he fell.

I stopped and ran to him. His knee was red with blood, and he couldn't move his arm. "It hurts," he said. "It really hurts." I was scared, but I called his mother on my phone, and she came in her car ten minutes later.

They went to the hospital. A doctor checked his arm and said that a bone was broken. Omar had to rest his arm for six weeks.

He couldn't play football or write with his right hand for a long time, and he was bored. I visited him every day after school and helped him with his homework.

Now his arm is fine again, and we ride our bikes together. But Omar always rides slowly down the hill, and he looks carefully at the road.`,
      grammar: ["have-to", "past-simple-irregular"],
      names: ["Omar"],
      questions: [
        [
          ["Why did Omar fall?", "奥马尔为什么摔倒了？"],
          ["His bike hit a stone", "他的自行车撞上了一块石头"],
          [
            ["A car hit him", "一辆车撞了他"],
            ["His bike was broken", "他的自行车坏了"],
          ],
          [
            'The passage says: "he didn\'t see a stone on the road. His bike hit the stone, and he fell."',
            "他骑得太快，没看见路上的石头，车撞上石头后摔倒了。",
          ],
        ],
        [
          ["What did the writer do after the accident?", "事故发生后作者做了什么？"],
          ["Called Omar's mother", "给奥马尔的妈妈打电话"],
          [
            ["Took Omar to the hospital", "把奥马尔送到医院"],
            ["Rode home alone", "一个人骑车回家"],
          ],
          ['The writer says: "I called his mother on my phone."', "作者打电话叫来了奥马尔的妈妈，是妈妈开车送他去的医院。"],
        ],
        [
          ["How long did Omar have to rest his arm?", "奥马尔的胳膊要休养多久？"],
          ["Six weeks", "六周"],
          [
            ["Ten days", "十天"],
            ["Six months", "六个月"],
          ],
          ['The passage says: "Omar had to rest his arm for six weeks."', "文中用 had to 说他必须让胳膊休养六周。"],
        ],
      ],
    }),
    passage({
      id: "a2-health-healthy-habits-for-school-days",
      title: ["Healthy Habits for School Days", "上学日的健康习惯"],
      body: `A healthy day starts in the morning. Here are five habits for school days.

1. Have breakfast. Your body needs food after the night. Eggs, bread, fruit and milk are all good.

2. Drink water. You should drink six to eight glasses of water a day, so take a bottle of water to school.

3. Move your body. You don't have to play a sport, but you should exercise for an hour every day. You can walk to school, ride a bike or dance in your room.

4. Wash your hands. Wash them before you eat and after you use the bathroom. It helps you stay healthy.

5. Take a break from your books. Every hour, stand up and look out of the window for a minute. It's good for your eyes and your neck.

These habits are easy, and they are free. Try them for a week, and see how you feel!`,
      grammar: ["should-and-must", "have-to"],
      questions: [
        [
          ["How much water should you drink a day?", "一天应该喝多少水？"],
          ["Six to eight glasses", "六到八杯"],
          [
            ["One bottle", "一瓶"],
            ["Two glasses", "两杯"],
          ],
          ['Habit 2 says: "You should drink six to eight glasses of water a day."', "第二条习惯说每天应该喝六到八杯水。"],
        ],
        [
          ["Do you have to play a sport?", "你必须参加一项运动吗？"],
          ["No, but you should exercise every day", "不必，但应该每天锻炼"],
          [
            ["Yes, every day after school", "是的，每天放学后"],
            ["Yes, but only at school", "是的，但只在学校"],
          ],
          [
            'Habit 3 says: "You don\'t have to play a sport, but you should exercise for an hour every day."',
            "don't have to 表示“不必”：不一定要运动项目，走路、骑车、跳舞都可以。",
          ],
        ],
        [
          ["Why should you look out of the window every hour?", "为什么每小时要看看窗外？"],
          ["It is good for your eyes and your neck", "对眼睛和脖子有好处"],
          [
            ["To see the weather", "为了看天气"],
            ["To rest your hands", "为了让手休息"],
          ],
          ['Habit 5 says: "It\'s good for your eyes and your neck."', "第五条习惯说看看窗外对眼睛和脖子有好处。"],
        ],
      ],
    }),
    passage({
      id: "a2-health-a-fever-before-the-big-game",
      title: ["A Fever Before the Big Game", "大赛前发烧"],
      body: `On Thursday night Lucy felt terrible. Her head hurt, her throat hurt, and she was very hot. Her father checked her temperature: thirty-nine degrees. She had a fever.

Lucy was worried. On Saturday her basketball team had the most important game of the year, and she was their best player.

The next morning they went to the doctor. "You have a bad cold," said Dr. Hill. "You must stay at home and rest for three days. Take one of these pills every morning, and drink a lot of water. You should not play basketball this weekend."

Lucy cried. "But it's the big game!" she said. "I'm sorry," said the doctor, "but your health is more important than a game."

On Saturday Lucy watched the game on her computer in bed. Her team played well without her and won by two points. After the game, the players called her and sang a song for her. Lucy felt much better.`,
      grammar: ["should-and-must", "past-simple-irregular"],
      names: ["Lucy", "Dr", "Hill"],
      questions: [
        [
          ["What was Lucy's temperature?", "露西的体温是多少？"],
          ["Thirty-nine degrees", "三十九度"],
          [
            ["Thirty-seven degrees", "三十七度"],
            ["Forty degrees", "四十度"],
          ],
          ['The passage says: "Her father checked her temperature: thirty-nine degrees."', "爸爸给她量了体温：三十九度。"],
        ],
        [
          ["What did the doctor say Lucy must do?", "医生说露西必须做什么？"],
          ["Stay at home and rest for three days", "在家休息三天"],
          [
            ["Play only half of the game", "只打半场比赛"],
            ["Go to the hospital", "去医院"],
          ],
          [
            'The doctor says: "You must stay at home and rest for three days."',
            "医生用 must 说明她必须在家休息三天，并且这个周末不该打球。",
          ],
        ],
        [
          ["What happened in the game?", "比赛结果怎样？"],
          ["Lucy's team won by two points", "露西的球队赢了两分"],
          [
            ["Lucy's team lost", "露西的球队输了"],
            ["Lucy played for ten minutes", "露西上场打了十分钟"],
          ],
          [
            'The passage says: "Her team played well without her and won by two points."',
            "露西在床上用电脑看比赛，她的球队没有她也赢了两分。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-health-strong-bones",
      title: ["Strong Bones", "强壮的骨骼"],
      body: `There are more than two hundred bones in your body. They hold you up, they protect your heart and other important parts of your body, and they help you move.

Bones are alive. They grow when you are young, and they keep growing until you are about twenty-five. After that, they slowly get weaker, so it is important to build strong bones when you are young.

How can you do that? First, you need the right food. Milk, beans, fish and green vegetables are all good for your bones. Second, you need exercise. When you run, jump, dance or climb, your bones get stronger. Swimming is good for your heart, but running and jumping are better for your bones. Third, you need the sun. Your skin uses the sun to help your bones, so you should play outside every day.

Bones can break in an accident, but young bones repair themselves quickly. So eat well, move a lot and go outside!`,
      grammar: ["should-and-must"],
      questions: [
        [
          ["How many bones are there in your body?", "你身体里有多少块骨头？"],
          ["More than two hundred", "两百多块"],
          [
            ["About twenty-five", "大约二十五块"],
            ["About one hundred", "大约一百块"],
          ],
          [
            'The first sentence says: "There are more than two hundred bones in your body."',
            "第一句说身体里有两百多块骨头；二十五是骨头停止生长的年龄。",
          ],
        ],
        [
          ["Until what age do your bones grow?", "骨头长到多少岁？"],
          ["About twenty-five", "大约二十五岁"],
          [
            ["About ten", "大约十岁"],
            ["About fifty", "大约五十岁"],
          ],
          ['The passage says: "they keep growing until you are about twenty-five."', "文中说骨头一直长到大约二十五岁，之后慢慢变弱。"],
        ],
        [
          ["Which is better for your bones?", "哪种运动对骨头更好？"],
          ["Running and jumping", "跑和跳"],
          [
            ["Swimming", "游泳"],
            ["Sleeping a lot", "多睡觉"],
          ],
          [
            'The passage says: "Swimming is good for your heart, but running and jumping are better for your bones."',
            "游泳对心脏好，跑和跳对骨头更好。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-health-the-night-of-the-ambulance",
      title: ["The Night of the Ambulance", "救护车来的那一夜"],
      body: `It was two o'clock in the morning when I woke up. Someone was shouting in the apartment next to ours. It was our neighbor, Mrs. Chen. "Help! Please help!"

My mother ran to her door. Mr. Chen was on the kitchen floor. He couldn't speak, and he had a terrible pain near his heart.

Mom called the emergency number and told them what was wrong. "Don't move him," they said. "An ambulance is coming." I stayed with Mrs. Chen and held her hand. She was very worried.

Eight minutes later, the ambulance arrived. Two people in green ran up the stairs. They checked his heart and gave him some medicine, and then they carried him down to the ambulance. Mrs. Chen went with them to the hospital.

Mr. Chen stayed in the hospital for two weeks. When he came home, he came to our apartment with flowers. "Thank you," he said. "You called quickly, and that is why I am alive."`,
      grammar: ["past-simple-irregular"],
      names: ["Mrs", "Mr", "Chen"],
      questions: [
        [
          ["When did this happen?", "这件事是什么时候发生的？"],
          ["At two o'clock in the morning", "凌晨两点"],
          [
            ["At two o'clock in the afternoon", "下午两点"],
            ["At eight o'clock in the evening", "晚上八点"],
          ],
          ['The first sentence says: "It was two o\'clock in the morning when I woke up."', "第一句说那是凌晨两点。"],
        ],
        [
          ["What did the writer's mother do?", "作者的妈妈做了什么？"],
          ["She called the emergency number", "拨打了急救电话"],
          [
            ["She drove Mr. Chen to the hospital", "开车送陈先生去医院"],
            ["She gave Mr. Chen some medicine", "给陈先生吃药"],
          ],
          ['The passage says: "Mom called the emergency number and told them what was wrong."', "妈妈打了急救电话；给药的是救护车上的人。"],
        ],
        [
          ["How long did Mr. Chen stay in the hospital?", "陈先生在医院住了多久？"],
          ["Two weeks", "两周"],
          [
            ["Eight minutes", "八分钟"],
            ["Two days", "两天"],
          ],
          ['The passage says: "Mr. Chen stayed in the hospital for two weeks."', "八分钟是救护车赶到的时间，陈先生在医院住了两周。"],
        ],
      ],
    }),
    passage({
      id: "a2-health-grandpas-new-diet",
      title: ["Grandpa's New Diet", "爷爷的新饮食"],
      body: `Last month my grandpa went to the doctor for a check. The doctor listened to his heart and said that it was weak. "You must start a new diet," she said.

Grandpa loves food. For breakfast he always had fried eggs and bread with a lot of butter. For lunch he ate meat with rice, and in the evening he had noodles with a salty sauce. He also drank three cups of coffee with sugar every day.

Now he has a new diet. He has to eat fish and chicken, not red meat. He eats a lot of vegetables and fruit, and he cooks with a little oil, not butter. He has only one cup of coffee in the morning, without sugar.

At first Grandpa was not happy. "This food is boring!" he said. But Grandma found some new recipes, and now he says that some of them are delicious. He also walks in the park with his dog every morning.

Last week the doctor checked him again. "Your heart is stronger," she said. Grandpa smiled. "Good. Can I have some cake now?" "No," said the doctor and Grandma together.`,
      grammar: ["have-to", "should-and-must"],
      questions: [
        [
          ["What did the doctor say about Grandpa's heart at first?", "医生起初说爷爷的心脏怎么样？"],
          ["It was weak", "很弱"],
          [
            ["It was strong", "很强"],
            ["It was too big", "太大了"],
          ],
          [
            'The passage says: "The doctor listened to his heart and said that it was weak."',
            "医生听了他的心脏，说心脏很弱，要开始新的饮食。",
          ],
        ],
        [
          ["What does Grandpa drink now?", "爷爷现在喝什么？"],
          ["One cup of coffee without sugar", "一杯不加糖的咖啡"],
          [
            ["Three cups of coffee with sugar", "三杯加糖的咖啡"],
            ["Tea with honey", "加蜂蜜的茶"],
          ],
          [
            'The passage says: "He has only one cup of coffee in the morning, without sugar."',
            "三杯加糖咖啡是他以前的习惯，现在只在早上喝一杯不加糖的。",
          ],
        ],
        [
          ["What did the doctor say last week?", "上周医生说了什么？"],
          ["His heart is stronger", "他的心脏更强了"],
          [
            ["He can eat cake again", "他又可以吃蛋糕了"],
            ["He must go to the hospital", "他必须去医院"],
          ],
          [
            'The doctor says: "Your heart is stronger." Then she and Grandma both say no to the cake.',
            "医生说他的心脏更强了；至于蛋糕，医生和奶奶一起说“不行”。",
          ],
        ],
      ],
    }),
  ],
};
