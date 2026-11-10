// The reading unit of the A2 theme The Natural World: the sky, plants, water and space, with the present perfect
// of experience.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { readingWords } from "./reading-words.ts";

const perfect = "present-perfect-with-ever-and-never";

const passage = passageMaker(readingWords, [
  "a2-words-landscape",
  "a2-words-weather-2",
  "a2-words-space",
  "a2-words-plants",
  "a2-words-little-words-3",
  perfect,
]);

/** readingNature is the reading unit of the theme The Natural World. */
export const readingNature: ReadingUnitDef = {
  id: "a2-reading-nature",
  title: t("The Natural World", "自然世界"),
  passages: [
    passage({
      id: "a2-nature-why-the-sky-is-blue",
      title: ["Why the Sky Is Blue", "天空为什么是蓝色的"],
      body: `Have you ever asked yourself why the sky is blue? The answer is in the light of the sun.

The light of the sun looks white, but it is really all the colors of the rainbow together: red, orange, yellow, green, blue and purple. When this light comes through the air around the earth, it hits tiny bits of air. These bits push the blue light around the sky much more than the red and yellow light. So when you look up, you see blue light from every part of the sky.

At sunrise and in the evening, the sun is low. Its light has to travel through much more air to get to your eyes. On the way, most of the blue light is lost, and only the red, orange and yellow light gets to you. That is why the sky is red and orange at the beginning and at the end of the day.

On the moon there is no air, so the sky is always black, even in the day. The people who have been there say that it is very different from the sky at home.`,
      grammar: [perfect, "expanding-with-because-but-so"],
      questions: [
        [
          ["What colors are in the light of the sun?", "太阳光里有哪些颜色？"],
          ["All the colors of the rainbow", "彩虹的所有颜色"],
          [
            ["Only white", "只有白色"],
            ["Only blue", "只有蓝色"],
          ],
          [
            'The passage says the light "looks white, but it is really all the colors of the rainbow together".',
            "阳光看起来是白的，其实是彩虹的各种颜色合在一起。",
          ],
        ],
        [
          ["Why is the sky red and orange in the evening?", "为什么傍晚的天空是红色和橙色的？"],
          ["The light goes through more air, and the blue light is lost", "光要穿过更多空气，蓝光在路上丢失了"],
          [
            ["The sun is red in the evening", "太阳傍晚是红色的"],
            ["There are more clouds in the evening", "傍晚云更多"],
          ],
          [
            'The passage says: "Its light has to travel through much more air... most of the blue light is lost."',
            "太阳低的时候，光要穿过更多空气，蓝光丢失了，只剩红、橙、黄光。",
          ],
        ],
        [
          ["What color is the sky on the moon?", "月球上的天空是什么颜色？"],
          ["Black", "黑色"],
          [
            ["Blue", "蓝色"],
            ["Red", "红色"],
          ],
          [
            'The passage says: "On the moon there is no air, so the sky is always black, even in the day."',
            "月球上没有空气，所以白天天空也是黑的。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-nature-life-in-the-jungle",
      title: ["Life in the Jungle", "丛林里的生活"],
      body: `A jungle is a forest in a hot, wet part of the world. It rains almost every day there, and the trees grow very tall and very close together.

More than half of all the plants and animals in the world live in jungles. High in the trees there are monkeys, parrots and snakes. They almost never come down to the ground, because they can find everything they need above: fruit, leaves, insects and water.

On the ground it is dark, because the leaves above stop the light. Only a few plants grow there. But there are a lot of insects, spiders and ants. Some ants are bigger than your finger!

Jungles are important for the whole earth. Their trees help to keep the air clean, and many medicines come from jungle plants.

But every year people cut down large areas of jungle for farms and roads. When the trees are gone, the animals lose their homes. Many people are working to protect the jungles, because when a jungle dies, it doesn't come back easily.`,
      grammar: ["expanding-with-because-but-so", "comparatives-and-superlatives"],
      questions: [
        [
          ["What is the weather like in a jungle?", "丛林里的天气怎么样？"],
          ["Hot and wet, with rain almost every day", "又热又湿，几乎每天下雨"],
          [
            ["Cold and dry", "又冷又干"],
            ["Snowy in winter", "冬天下雪"],
          ],
          [
            'The passage says: "A jungle is a forest in a hot, wet part of the world. It rains almost every day there."',
            "丛林在世界上又热又湿的地方，几乎每天下雨。",
          ],
        ],
        [
          ["Why is it dark on the ground?", "为什么地面上很暗？"],
          ["The leaves above stop the light", "上面的树叶挡住了光"],
          [
            ["There is always fog", "总是有雾"],
            ["The animals are black", "动物是黑色的"],
          ],
          [
            'The passage says: "On the ground it is dark, because the leaves above stop the light."',
            "because 后面是原因：上面的树叶挡住了光线。",
          ],
        ],
        [
          ["What happens when people cut down the trees?", "人们砍掉树后会怎样？"],
          ["The animals lose their homes", "动物失去了家"],
          [
            ["More animals come", "更多动物来了"],
            ["The jungle grows back quickly", "丛林很快长回来"],
          ],
          ['The passage says: "When the trees are gone, the animals lose their homes."', "树没了，动物就失去了家，而且丛林不容易恢复。"],
        ],
      ],
    }),
    passage({
      id: "a2-nature-a-night-under-the-stars",
      title: ["A Night Under the Stars", "星空下的一夜"],
      body: `I have slept outside only once, but I will never forget it. It was last August, on a hill near the farm of my uncle.

My cousin and I carried our sleeping bags up the hill after dinner. We didn't take a tent, because there were no clouds. We lay on the grass and waited for the dark.

Slowly the stars came out: first one, then ten, then hundreds, then too many to say. Far from the lights of the city, the sky looked different. We could see a long white river of stars across the whole sky. My cousin said it was part of our home in space, a group of millions of stars.

At about twelve o'clock we saw a star fall across the sky. Then another, and another. We made a wish every time.

It was cold, and the ground was hard, but I didn't want to sleep. Have you ever seen a falling star? If you haven't, go far from the city on a night with no clouds, and look up.`,
      grammar: [perfect, "past-simple-irregular"],
      questions: [
        [
          ["How many times has the writer slept outside?", "作者在外面睡过几次？"],
          ["Once", "一次"],
          [
            ["Never", "从来没有"],
            ["Every summer", "每年夏天"],
          ],
          ['The first sentence says: "I have slept outside only once."', "have slept 是现在完成时，表示经历：作者只在外面睡过一次。"],
        ],
        [
          ["Why didn't they take a tent?", "他们为什么没带帐篷？"],
          ["There were no clouds", "没有云"],
          [
            ["They forgot it", "他们忘了带"],
            ["The tent was broken", "帐篷坏了"],
          ],
          ['The passage says: "We didn\'t take a tent, because there were no clouds."', "因为没有云，不会下雨，所以他们没带帐篷。"],
        ],
        [
          ["What did they do when they saw a star fall?", "看到流星时他们做了什么？"],
          ["They made a wish", "许了个愿"],
          [
            ["They shouted", "大喊"],
            ["They went home", "回家了"],
          ],
          ['The passage says: "We made a wish every time."', "每看到一颗流星，他们就许一个愿。"],
        ],
      ],
    }),
    passage({
      id: "a2-nature-how-seeds-travel",
      title: ["How Seeds Travel", "种子怎样旅行"],
      body: `Plants can't walk, but their seeds can travel a long way. A seed needs space and light to grow, so it is better if it grows far from its parent plant. Plants have many ways to move their seeds.

Some seeds fly. They are very light, and the wind carries them through the air. Some have tiny wings, and some look like little umbrellas.

Some seeds swim. A coconut is a big, hard seed from a tree that grows on beaches. It can travel on the ocean for months and then grow on a new island.

Some seeds travel with animals. Birds eat fruit and fly to another place, and the seeds come out of their bodies later, far from the tree. Other seeds hold on to the fur of animals or to your clothes. Have you ever found seeds on your socks after a walk in a field? Now you know why!

Some plants even throw their seeds. When they are dry, they open suddenly and throw their seeds far.`,
      grammar: [perfect, "comparatives-and-superlatives"],
      glossed: ["coconut"],
      questions: [
        [
          ["Why is it better for a seed to grow far from its parent plant?", "为什么种子离母株远一些生长更好？"],
          ["It needs space and light", "它需要空间和光"],
          [
            ["It is warmer there", "那里更暖和"],
            ["Animals can't find it", "动物找不到它"],
          ],
          [
            'The passage says: "A seed needs space and light to grow, so it is better if it grows far from its parent plant."',
            "so 前面就是原因：种子生长需要空间和光。",
          ],
        ],
        [
          ["How does a coconut travel?", "椰子是怎么旅行的？"],
          ["On the ocean", "在海上漂"],
          [
            ["With the wind", "随风飞"],
            ["In the fur of animals", "挂在动物的毛上"],
          ],
          [
            'The passage says: "It can travel on the ocean for months and then grow on a new island."',
            "椰子能在海上漂几个月，然后在新的岛上生长。",
          ],
        ],
        [
          ["Why might you find seeds on your socks after a walk?", "散步后袜子上为什么可能有种子？"],
          ["Some seeds hold on to fur and clothes", "有些种子会挂在毛和衣服上"],
          [
            ["You planted them", "你种了它们"],
            ["The wind put them there", "风把它们吹到那里"],
          ],
          [
            'The passage says: "Other seeds hold on to the fur of animals or to your clothes."',
            "有些种子会粘在动物的毛或人的衣服上，被带到别处。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-nature-the-waterfall-path",
      title: ["The Waterfall Path", "瀑布小路"],
      body: `Last Sunday my family went for a walk on the Waterfall Path in the hills. The path follows a stream up a valley, and at the end there is a big waterfall.

At first the path was easy. It went through a quiet wood, and we saw a deer and a lot of butterflies. Then it got more difficult. There were big stones and rocks, and in some places the ground was wet. My little brother slipped two times, but he didn't cry.

After two hours we heard the waterfall before we saw it. Then we turned a corner, and there it was: white water falling from high rocks into a green pond. The air was cool and wet, and there was a small rainbow above the water.

We sat on the rocks and ate our sandwiches. My brother put his feet in the pond and shouted, because it was freezing! Dad said, "I have walked on this path many times, but I have never seen a rainbow here before."

The walk down was faster. We were tired, but everyone said it was the best walk of the year.`,
      grammar: [perfect, "past-simple-irregular"],
      questions: [
        [
          ["What did they see in the wood?", "他们在树林里看到了什么？"],
          ["A deer and a lot of butterflies", "一只鹿和很多蝴蝶"],
          [
            ["A fox and some birds", "一只狐狸和一些鸟"],
            ["A bear", "一只熊"],
          ],
          ['The passage says: "we saw a deer and a lot of butterflies."', "他们在安静的树林里看到了一只鹿和很多蝴蝶。"],
        ],
        [
          ["Why did the writer's brother shout?", "作者的弟弟为什么大喊？"],
          ["The water was freezing", "水冰冷刺骨"],
          [
            ["He slipped on a rock", "他在石头上滑倒了"],
            ["He saw a snake", "他看见了一条蛇"],
          ],
          [
            'The passage says: "My brother put his feet in the pond and shouted, because it was freezing!"',
            "他把脚伸进池塘，水太冷了，所以大喊。",
          ],
        ],
        [
          ["What did Dad say?", "爸爸说了什么？"],
          ["He has never seen a rainbow there before", "他以前从没在那里见过彩虹"],
          [
            ["It is his first time on the path", "这是他第一次走这条路"],
            ["The path is too dangerous", "这条路太危险了"],
          ],
          [
            'Dad says: "I have walked on this path many times, but I have never seen a rainbow here before."',
            "爸爸走过很多次，但从没在那里见过彩虹。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-nature-when-the-pond-froze",
      title: ["When the Pond Froze", "池塘结冰的时候"],
      body: `Every winter the pond behind our school freezes. Last year it got very cold in January. The air was ten degrees below zero, and for two weeks the pond was frozen hard.

The teachers said, "You must not walk on the ice." But we wanted to see the pond, so during every break we went and looked at it.

Under the ice the water was still. We could see fish moving slowly in the water. "Why don't they die?" asked my friend.

Our science teacher, Mr. Hall, told us. "The ice is like a roof," he said. "Under it the water doesn't freeze, and it stays at about four degrees. The fish move slowly, eat very little and wait for the spring."

In February the weather got warmer. The ice started to melt, and soon it was gone. One morning we saw the fish come up to eat. They were alive and well, and they looked as happy as we were.`,
      grammar: ["past-continuous", "should-and-must"],
      names: ["Mr", "Hall"],
      questions: [
        [
          ["Why didn't the children walk on the ice?", "孩子们为什么不在冰上走？"],
          ["The teachers said they must not", "老师说不准"],
          [
            ["The ice was too thin", "冰太薄了"],
            ["They had no time", "他们没时间"],
          ],
          ['The teachers said: "You must not walk on the ice."', "must not 表示禁止：老师不准他们在冰上走。"],
        ],
        [
          ["What did Mr. Hall say the ice is like?", "霍尔老师说冰像什么？"],
          ["A roof", "屋顶"],
          [
            ["A window", "窗户"],
            ["A bed", "床"],
          ],
          ['Mr. Hall says: "The ice is like a roof."', "冰像屋顶一样盖在上面，下面的水不结冰。"],
        ],
        [
          ["When did the ice melt?", "冰什么时候融化的？"],
          ["In February", "二月"],
          [
            ["In January", "一月"],
            ["In March", "三月"],
          ],
          [
            'The passage says: "In February the weather got warmer. The ice started to melt."',
            "一月很冷，池塘结冰；二月天气变暖，冰开始融化。",
          ],
        ],
      ],
    }),
    passage({
      id: "a2-nature-astronauts-in-space",
      title: ["Astronauts in Space", "太空中的宇航员"],
      body: `Astronauts are people who travel into space in rockets. Some astronauts live and work for months on a space station that goes around the earth.

Life in space is very different. There is no up or down, so everything flies around: your food, your pens, even your water! Astronauts eat food from small bags, and they sleep in bags on the wall, so they don't fly around the room in the night.

Astronauts have to exercise for two hours every day, because in space your bones and your heart get weaker. They run and lift things every day to stay strong.

From the window of the space station, astronauts can see sixteen sunrises a day! They say the earth looks blue and white and very beautiful. You can't see any countries from space, only land, water and clouds.

Have you ever dreamed of going to space? Many children have. Perhaps someday you will be an astronaut too.`,
      grammar: [perfect, "have-to"],
      glossed: ["astronauts", "astronaut"],
      questions: [
        [
          ["Why do astronauts sleep in bags on the wall?", "宇航员为什么睡在墙上的袋子里？"],
          ["So they don't fly around the room", "这样就不会在房间里飘来飘去"],
          [
            ["Because it is cold", "因为很冷"],
            ["Because there are no beds", "因为没有床"],
          ],
          [
            'The passage says: "they sleep in bags on the wall, so they don\'t fly around the room in the night."',
            "太空里没有上下，东西都会飘，所以要睡在固定在墙上的袋子里。",
          ],
        ],
        [
          ["Why do astronauts have to exercise every day?", "宇航员为什么每天都要锻炼？"],
          ["Their bones and heart get weaker in space", "在太空里骨骼和心脏会变弱"],
          [
            ["They are bored", "他们很无聊"],
            ["They want to win a race", "他们想赢比赛"],
          ],
          [
            'The passage says: "because in space your bones and your heart get weaker."',
            "have to 表示必须：太空中骨骼和心脏会变弱，所以每天锻炼两小时。",
          ],
        ],
        [
          ["How many times a day can astronauts see the sun rise?", "宇航员一天能看到几次日出？"],
          ["Sixteen", "十六次"],
          [
            ["One", "一次"],
            ["Two", "两次"],
          ],
          ['The passage says: "astronauts can see sixteen sunrises a day!"', "空间站绕地球转得很快，一天能看到十六次日出。"],
        ],
      ],
    }),
    passage({
      id: "a2-nature-the-rainbow-after-the-storm",
      title: ["The Rainbow After the Storm", "暴风雨后的彩虹"],
      body: `Last Friday afternoon the sky suddenly went dark. There was thunder and lightning, and then a lot of rain. My little sister was scared, so we sat together at the window and watched the storm.

After half an hour the storm stopped. The sun came out, and the wet street was shining. Then my sister shouted, "Look!" Above the trees there was a huge rainbow. It went across the whole sky, from one side of the town to the other.

Have you ever seen a rainbow? You can see one when the sun is behind you and there is rain in front of you. The light of the sun goes into each tiny bit of water and comes out in all the colors, from red to purple.

My grandma says there is money at the end of a rainbow. But no one has ever found it, because you can never get to the end of a rainbow. When you walk to it, it moves too.

The rainbow stayed for ten minutes. Then it was gone. But my sister wasn't scared now. "Can we have another storm tomorrow?" she asked.`,
      grammar: [perfect, "past-simple-irregular"],
      questions: [
        [
          ["Why did the writer and the sister sit at the window?", "作者和妹妹为什么坐在窗边？"],
          ["The sister was scared of the storm", "妹妹害怕暴风雨"],
          [
            ["They were waiting for Dad", "她们在等爸爸"],
            ["They wanted to see the rainbow", "她们想看彩虹"],
          ],
          [
            'The passage says: "My little sister was scared, so we sat together at the window and watched the storm."',
            "妹妹害怕，所以她们一起坐在窗边看暴风雨；彩虹是后来才出现的。",
          ],
        ],
        [
          ["When can you see a rainbow?", "什么时候能看到彩虹？"],
          ["When the sun is behind you and there is rain in front of you", "太阳在身后、雨在前方的时候"],
          [
            ["At night", "夜里"],
            ["When it is foggy", "有雾的时候"],
          ],
          [
            'The passage says: "You can see one when the sun is behind you and there is rain in front of you."',
            "太阳在身后、前方有雨时，就能看到彩虹。",
          ],
        ],
        [
          ["Why can't you get to the end of a rainbow?", "为什么走不到彩虹的尽头？"],
          ["It moves when you walk to it", "你朝它走，它也会动"],
          [
            ["It is too far", "太远了"],
            ["It is dangerous", "很危险"],
          ],
          ['The passage says: "When you walk to it, it moves too."', "你走向彩虹时，它也跟着移动，所以永远走不到尽头。"],
        ],
      ],
    }),
  ],
};
