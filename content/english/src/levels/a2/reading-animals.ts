// The reading unit of the A2 theme Animals and Pets: pets at home, wild animals and farms, with the past
// continuous and sentences joined by because, but and so.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { readingWords } from "./reading-words.ts";

const passage = passageMaker(readingWords, [
  "a2-words-pets",
  "a2-words-wildlife",
  "a2-words-animal-life",
  "a2-words-farm-and-care",
  "past-continuous",
  "coordinating-conjunctions",
  "expanding-with-because-but-so",
]);

/** readingAnimals is the reading unit of the theme Animals and Pets. */
export const readingAnimals: ReadingUnitDef = {
  id: "a2-reading-animals",
  title: t("Animals and Pets", "动物和宠物"),
  passages: [
    passage({
      id: "a2-animals-choosing-a-pet",
      title: ["Choosing a Pet", "挑选宠物"],
      body: `Do you want a pet? Before you decide, think carefully, because a pet needs a lot of care.

Dogs are friendly and fun, but they need a lot of time. You have to walk them every day, so a dog is not a good pet for a busy family. Cats are easier. They can stay alone during the day, but they need space to move and windows to look out of.

Small animals are good for children. A hamster is cheap and quiet, but it sleeps during the day and wakes up at night, so it is not much fun after school. Fish are beautiful and easy to feed, but you can't hold them or play with them.

Turtles live for a very long time. Some live for fifty years or more! So if you get a turtle, it may still be with you when you are old.

Parrots are interesting, because some of them can say words. But they can be very loud, so your neighbors may not be happy.

Every pet needs food, water, a clean home and love. Get the one that is right for your family.`,
      grammar: ["coordinating-conjunctions", "expanding-with-because-but-so"],
      questions: [
        [
          ["Why is a dog not a good pet for a busy family?", "为什么狗不适合忙碌的家庭？"],
          ["You have to walk it every day", "你每天都得遛它"],
          [
            ["It is too loud", "它太吵了"],
            ["It is too expensive", "它太贵了"],
          ],
          [
            'The passage says: "You have to walk them every day, so a dog is not a good pet for a busy family."',
            "so 前面就是原因：狗每天都要遛，需要很多时间。",
          ],
        ],
        [
          ["What is the problem with a hamster?", "仓鼠有什么问题？"],
          ["It sleeps during the day", "它白天睡觉"],
          [
            ["It is very loud", "它很吵"],
            ["It lives for fifty years", "它能活五十年"],
          ],
          [
            'The passage says: "it sleeps during the day and wakes up at night, so it is not much fun after school."',
            "仓鼠白天睡觉、晚上醒来，所以放学后和它玩不了多少。活五十年的是乌龟。",
          ],
        ],
        [
          ["How long can some turtles live?", "有些乌龟能活多久？"],
          ["Fifty years or more", "五十年或更久"],
          [
            ["Five years", "五年"],
            ["Ten years", "十年"],
          ],
          ['The passage says: "Some live for fifty years or more!"', "文中说有些乌龟能活五十年或更久，你老了它可能还在。"],
        ],
      ],
    }),
    passage({
      id: "a2-animals-how-a-bird-builds-its-nest",
      title: ["How a Bird Builds Its Nest", "鸟怎样筑巢"],
      body: `In spring many birds build nests. A nest is a home for their eggs and, later, for their babies.

Birds don't have hands, so they build with their beaks and their feet. First the bird finds a safe place: a branch high in a tree, a corner under a roof or a bush with sharp leaves. Then it collects small pieces of grass, leaves and wood. It flies to the place hundreds of times, with one small piece in its beak each time.

The bird puts the pieces around itself and turns its body again and again, so the nest is just the right size for its body. In the center many birds put soft things, like dry grass, fur from other animals or even hair.

A small bird can build a nest in about a week. Then it lays its eggs, sits on them and keeps them warm. While it is sitting on the eggs, the other parent often brings it food.`,
      grammar: ["present-simple", "coordinating-conjunctions"],
      questions: [
        [
          ["What do birds build their nests with?", "鸟用什么筑巢？"],
          ["Their beaks and their feet", "嘴和脚"],
          [
            ["Their wings", "翅膀"],
            ["Their tails", "尾巴"],
          ],
          ['The passage says: "Birds don\'t have hands, so they build with their beaks and their feet."', "鸟没有手，所以用嘴和脚来筑巢。"],
        ],
        [
          ["How long does a small bird need to build a nest?", "一只小鸟筑一个巢要多长时间？"],
          ["About a week", "大约一周"],
          [
            ["About a day", "大约一天"],
            ["About a month", "大约一个月"],
          ],
          ['The passage says: "A small bird can build a nest in about a week."', "文中说小鸟大约一周就能筑好巢。"],
        ],
        [
          ["What does the other parent often do while one bird sits on the eggs?", "一只鸟孵蛋时，另一只常常做什么？"],
          ["It brings food", "带来食物"],
          [
            ["It builds a second nest", "再筑一个巢"],
            ["It sits on the eggs too", "也坐在蛋上"],
          ],
          [
            'The passage says: "While it is sitting on the eggs, the other parent often brings it food."',
            "一只鸟孵蛋时，另一只常常给它带食物。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-animals-the-fox-in-the-garden",
      title: ["The Fox in the Garden", "花园里的狐狸"],
      body: `Last night I was reading in bed when I heard something in the garden. It was about eleven o'clock. I went to the window and looked out.

A fox was standing on the grass in the light of the moon. It was red, with a long, beautiful tail. It was eating from the bowl of our cat, Coco.

While the fox was eating, Coco came out of the house. I was scared, because foxes can bite. But Coco didn't run, and the fox didn't chase her. They looked at each other for a long moment. Then the fox turned and jumped over the fence into the dark.

In the morning I told my parents. Dad laughed. "Foxes live in many cities now," he said. "They come at night because people leave food outside, so they don't have to hunt."

Now we feed Coco in the kitchen, not outside. But I still look out of the window every night. I hope the fox comes back.`,
      grammar: ["past-continuous", "expanding-with-because-but-so"],
      names: ["Coco"],
      questions: [
        [
          ["What was the writer doing when the story started?", "故事开始时作者在做什么？"],
          ["Reading in bed", "在床上看书"],
          [
            ["Sleeping", "睡觉"],
            ["Eating dinner", "吃晚饭"],
          ],
          [
            'The first sentence says: "Last night I was reading in bed when I heard something in the garden."',
            "was reading 表示当时正在看书，这时听到了花园里的声音。",
          ],
        ],
        [
          ["What was the fox eating?", "狐狸在吃什么？"],
          ["Food from the cat's bowl", "猫碗里的食物"],
          [
            ["A bird", "一只鸟"],
            ["Bread from the kitchen", "厨房里的面包"],
          ],
          ['The passage says: "It was eating from the bowl of our cat, Coco."', "狐狸在吃猫咪可可碗里的食物。"],
        ],
        [
          ["Why do foxes come into cities, says Dad?", "爸爸说狐狸为什么来城市？"],
          ["People leave food outside", "人们把食物放在外面"],
          [
            ["They are scared of the forest", "它们害怕森林"],
            ["They like to play with cats", "它们喜欢和猫玩"],
          ],
          [
            'Dad says: "They come at night because people leave food outside, so they don\'t have to hunt."',
            "因为人们把食物放在外面，狐狸不用捕猎就有吃的。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-animals-life-on-a-goat-farm",
      title: ["Life on a Goat Farm", "山羊农场的生活"],
      body: `My aunt Sofia has a goat farm in the hills. Last summer I stayed there for two weeks.

Every day started at six o'clock. First we fed the goats and gave them fresh water. Then my aunt got milk from them. She has forty goats, so it took two hours! After breakfast we took the goats to the fields. They climbed on the rocks and ate grass, leaves and even the flowers of the neighbors.

Goats are funny animals. They want to taste everything: paper, clothes, even my hat! One day a young goat jumped over the fence, and we chased it for an hour.

The farm also has hens, two donkeys and a big dog. The dog protects the goats from wolves, because there are still a few wolves in the hills.

In the evening I was tired but happy. The best moment was when a baby goat was born. It was tiny and wet, but after an hour it could stand. I gave it a name: Star.`,
      grammar: ["past-simple-irregular", "could-for-past-ability"],
      names: ["Sofia"],
      questions: [
        [
          ["How many goats does Aunt Sofia have?", "索菲亚姑姑有多少只山羊？"],
          ["Forty", "四十只"],
          [
            ["Two", "两只"],
            ["Fourteen", "十四只"],
          ],
          ['The passage says: "She has forty goats, so it took two hours!"', "她有四十只山羊，所以挤奶要两个小时。"],
        ],
        [
          ["What happened one day?", "有一天发生了什么事？"],
          ["A young goat jumped over the fence", "一只小山羊跳过了围栏"],
          [
            ["A wolf came to the farm", "一只狼来到了农场"],
            ["A donkey ran into the hills", "一头驴跑进了山里"],
          ],
          [
            'The passage says: "One day a young goat jumped over the fence, and we chased it for an hour."',
            "一只小山羊跳过围栏，他们追了一个小时。",
          ],
        ],
        [
          ["Why does the farm have a big dog?", "农场为什么养一只大狗？"],
          ["To protect the goats from wolves", "保护山羊不被狼伤害"],
          [
            ["To play with the children", "陪孩子们玩"],
            ["To find the eggs of the hens", "找母鸡下的蛋"],
          ],
          [
            'The passage says: "The dog protects the goats from wolves, because there are still a few wolves in the hills."',
            "山里还有几只狼，所以狗要保护山羊。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-animals-why-whales-sing",
      title: ["Why Whales Sing", "鲸为什么唱歌"],
      body: `Whales are the biggest animals on earth. Some of them are longer than two buses. They live in the ocean, but they are not fish. They need air, so they come up to get it.

Some whales sing. Their songs are long, and some go on for twenty minutes or more. The songs travel very far under the water, so other whales can hear them from very far.

Why do they sing? People who watch whales think there are a few reasons. Whales may sing to find each other in the dark ocean. Some songs may help them find food. And some whales may sing to find a partner.

The most interesting thing is that all the whales in a group sing the same song, and every year the song is a little different. They learn new parts from each other, like people who learn a new song from their friends.

We still don't know everything about whale songs. Perhaps one day we will understand them.`,
      grammar: ["comparatives-and-superlatives", "expanding-with-because-but-so"],
      questions: [
        [
          ["Why do whales come up to the top of the water?", "鲸为什么要浮到水面？"],
          ["They need air", "它们需要空气"],
          [
            ["They want to sing", "它们想唱歌"],
            ["They eat birds", "它们吃鸟"],
          ],
          ['The passage says: "They need air, so they come up to get it."', "鲸不是鱼，需要呼吸空气，所以要浮上来。"],
        ],
        [
          ["What is one reason that whales sing?", "鲸唱歌的一个原因是什么？"],
          ["To find each other in the dark ocean", "在黑暗的海洋里找到彼此"],
          [
            ["To sleep better", "为了睡得更好"],
            ["To make sharks go away", "为了赶走鲨鱼"],
          ],
          ['The passage says: "Whales may sing to find each other in the dark ocean."', "文中给出的原因有：找到彼此、找食物、找伴侣。"],
        ],
        [
          ["What is interesting about the songs of a group?", "一群鲸的歌有什么有趣的地方？"],
          ["They all sing the same song, and it changes a little every year", "它们唱同一首歌，而且每年都有点不同"],
          [
            ["They sing only at night", "它们只在夜里唱"],
            ["Their song never changes", "它们的歌从来不变"],
          ],
          [
            'The passage says: "all the whales in a group sing the same song, and every year the song is a little different."',
            "同一群鲸唱同一首歌，并且互相学习新的部分，所以每年都有点不同。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-animals-a-puppys-first-week",
      title: ["A Puppy's First Week", "小狗的第一周"],
      body: `Monday: Our new puppy came home today! He is eight weeks old, brown and white, with big soft ears. We called him Biscuit. He was scared in the car, so I held him all the way home.

Tuesday: Biscuit cried all night. Mom says he misses his mother. I put an old T-shirt of mine in his bed, and he slept better.

Wednesday: Biscuit bit my favorite shoes! Dad said all puppies do it, because their teeth hurt. We bought him some toys to bite.

Thursday: We took Biscuit to the vet. She checked his ears, his eyes and his teeth. He is healthy! She said we should feed him four small meals a day.

Friday: I tried to teach Biscuit to sit. He didn't understand, but he was very happy when I gave him a small piece of chicken.

Saturday: Biscuit sat! Only once, but he did it!

Sunday: Biscuit played in the garden all morning and slept all afternoon. He is part of our family now.`,
      grammar: ["past-simple-irregular", "expanding-with-because-but-so"],
      names: ["Biscuit"],
      questions: [
        [
          ["Why did Biscuit cry all night, says Mom?", "妈妈说饼干为什么哭了一夜？"],
          ["He misses his mother", "他想妈妈"],
          [
            ["He is hungry", "他饿了"],
            ["He is ill", "他病了"],
          ],
          ['Tuesday says: "Mom says he misses his mother."', "妈妈说小狗想念它的妈妈。"],
        ],
        [
          ["What did the vet say?", "兽医说了什么？"],
          ["Feed him four small meals a day", "每天喂他四顿小餐"],
          [
            ["He is not healthy", "他不健康"],
            ["Give him a lot of chicken", "多给他吃鸡肉"],
          ],
          ['Thursday says: "She said we should feed him four small meals a day."', "兽医说小狗很健康，应该每天喂四顿小餐。"],
        ],
        [
          ["What happened on Saturday?", "星期六发生了什么？"],
          ["Biscuit sat for the first time", "饼干第一次坐下了"],
          [
            ["Biscuit bit the shoes", "饼干咬了鞋"],
            ["Biscuit went to the vet", "饼干去看了兽医"],
          ],
          ['Saturday says: "Biscuit sat! Only once, but he did it!"', "星期五他还学不会，星期六终于坐下了一次。"],
        ],
      ],
    }),
    passage({
      id: "a2-animals-bees-at-work",
      title: ["Bees at Work", "忙碌的蜜蜂"],
      body: `A bee is small, but it works very hard. In summer a bee lives for only about six weeks, and it works for almost all of that time.

Bees live in large groups. A group can have more bees than there are people in a small town, and every bee has a job. One big bee lays all the eggs. Young bees clean, feed the babies and make honey. Older bees fly out to find flowers.

When a bee finds good flowers, it flies back home and does a dance. The dance tells the other bees where the flowers are and how far they are. Isn't that interesting?

Bees are very important for people. When they go from flower to flower, they carry tiny bits of each flower to the next one. This helps plants make fruit and seeds. Without bees, we couldn't have many fruits and vegetables, like apples and tomatoes.

Today there are not as many bees as before, so many people plant flowers in their gardens to help them.`,
      grammar: ["coordinating-conjunctions", "comparatives-and-superlatives"],
      questions: [
        [
          ["What does a bee's dance tell the other bees?", "蜜蜂的舞蹈告诉其他蜜蜂什么？"],
          ["Where the flowers are and how far they are", "花在哪里、有多远"],
          [
            ["That it is tired", "它累了"],
            ["That a bird is coming", "有鸟来了"],
          ],
          [
            'The passage says: "The dance tells the other bees where the flowers are and how far they are."',
            "蜜蜂找到好花后回家跳舞，告诉同伴花的位置和距离。",
          ],
        ],
        [
          ["How long does a bee live in summer?", "夏天一只蜜蜂能活多久？"],
          ["About six weeks", "大约六周"],
          [
            ["About a year", "大约一年"],
            ["About two days", "大约两天"],
          ],
          ['The passage says: "In summer a bee lives for only about six weeks."', "文中说夏天的蜜蜂只能活大约六周。"],
        ],
        [
          ["Why are bees important for people?", "蜜蜂为什么对人类很重要？"],
          ["They help plants make fruit and seeds", "帮助植物结果实和种子"],
          [
            ["They make milk", "它们产奶"],
            ["They eat all the ants", "它们吃掉所有蚂蚁"],
          ],
          [
            'The passage says: "This helps plants make fruit and seeds. Without bees, we couldn\'t have many fruits and vegetables."',
            "蜜蜂在花之间传送花粉，帮助植物结果，没有它们就没有很多水果蔬菜。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-animals-the-night-the-hamster-escaped",
      title: ["The Night the Hamster Escaped", "仓鼠逃跑的那一夜"],
      body: `Last Friday I was sleeping when something woke me up. It was three o'clock in the morning, and something was moving under my bed.

I turned on the light. The door of the hamster cage was open, and Peanut, my hamster, wasn't there! I looked under the bed, but he was gone.

I woke up my parents. Dad looked behind the sofa, while Mom looked in the kitchen cupboards. I was very worried. Peanut is tiny, and our cat, Max, loves to chase small animals.

For an hour we looked in every room. Then Mom said, "Listen!" Something was moving in the bag of rice in the kitchen. We opened it, and there was Peanut, eating rice! He looked very happy, and he didn't want to leave.

I put him back in his cage and closed the door carefully. Now I check the door of the cage every night before I go to bed. And we keep the rice on a high shelf.`,
      grammar: ["past-continuous", "past-simple-irregular"],
      names: ["Peanut", "Max"],
      questions: [
        [
          ["What time did the writer wake up?", "作者几点醒的？"],
          ["Three o'clock in the morning", "凌晨三点"],
          [
            ["Eleven o'clock at night", "夜里十一点"],
            ["Six o'clock in the morning", "早上六点"],
          ],
          ['The passage says: "It was three o\'clock in the morning."', "作者凌晨三点被床底下的动静弄醒了。"],
        ],
        [
          ["Why was the writer worried?", "作者为什么担心？"],
          ["Peanut is tiny, and the cat chases small animals", "花生很小，而猫喜欢追小动物"],
          [
            ["Peanut was ill", "花生生病了"],
            ["Dad was angry", "爸爸生气了"],
          ],
          [
            'The passage says: "Peanut is tiny, and our cat, Max, loves to chase small animals."',
            "仓鼠很小，家里的猫又爱追小动物，所以作者很担心。",
          ],
        ],
        [
          ["Where was Peanut?", "花生在哪里？"],
          ["In the bag of rice", "在米袋里"],
          [
            ["Under the bed", "在床底下"],
            ["Behind the sofa", "在沙发后面"],
          ],
          [
            'The passage says: "Something was moving in the bag of rice... and there was Peanut, eating rice!"',
            "他们在厨房的米袋里找到了正在吃米的花生。",
          ],
        ],
      ],
    }),
  ],
};
