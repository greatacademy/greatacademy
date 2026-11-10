// The reading unit of the B1 theme The Environment: waste, the oceans, energy, wildlife, drought and taking action.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { readingWords } from "./reading-words.ts";

const passive = "active-and-passive-voice";

const passage = passageMaker(readingWords, [
  "b1-words-environment",
  "b1-words-nature-2",
  "b1-words-green-living",
  "b1-words-change",
  "b1-words-taking-action",
  "b1-words-weather-and-climate",
  "b1-words-waste",
  passive,
]);

/** readingEnvironment is the reading unit of the theme The Environment. */
export const readingEnvironment: ReadingUnitDef = {
  id: "b1-reading-environment",
  title: t("The Environment", "环境"),
  passages: [
    passage({
      id: "b1-environment-where-our-trash-goes",
      title: ["Where Our Trash Goes", "我们的垃圾去了哪里"],
      body: `Every morning you throw something away: an empty bottle, a piece of cardboard, the skin of a banana. You put it in a bin, and then you forget about it. But where does it actually go?

In most cities, trash is collected from homes once or two times a week. It is taken to a center where it is put into groups. Paper, cardboard, glass, metal and some types of plastic are sent to factories, where they are recycled into new products. An aluminum can, for example, can be melted down and turned into a new can in about two months.

Food waste and garden waste go to another place. In some places they are made into compost, which farmers use to help plants grow. In others they are used to make gas for heating and electricity.

Everything else is either burned or taken to a landfill. When trash is burned, the heat can be used to make electricity, but the smoke must be cleaned carefully, because it can have toxic gases in it. A landfill is a huge area where trash is put into the ground and left for hundreds of years.

The problem is that a lot of trash ends up in the wrong place. When people put dirty containers or the wrong kind of plastic in the recycling bin, a whole bin of good material can be made dirty and has to be dumped. In some countries only about a third of what could be recycled actually is.

So the next time you throw something away, think for a second. Is it clean? Is it in the right bin? Could it be reused instead? Small actions at home decide where our waste goes.`,
      grammar: [passive],
      questions: [
        [
          ["What happens to paper, glass and metal at the center?", "纸、玻璃和金属在处理中心会怎样？"],
          ["They are sent to factories and recycled", "它们被送到工厂回收利用"],
          [
            ["They are burned to make electricity", "它们被焚烧来发电"],
            ["They are made into compost for farmers", "它们被做成堆肥给农民用"],
          ],
          [
            '"Paper, cardboard, glass, metal and some types of plastic are sent to factories, where they are recycled into new products."',
            "这句用了被动语态：这些材料被送往工厂，被回收做成新产品。",
          ],
        ],
        [
          ["Why must the smoke from burned trash be cleaned?", "为什么焚烧垃圾产生的烟必须被清理？"],
          ["It can contain toxic gases", "它可能含有有毒气体"],
          [
            ["It makes the electricity weaker", "它会使电力变弱"],
            ["It smells of food waste", "它有厨余垃圾的味道"],
          ],
          [
            'The passage says "the smoke must be cleaned carefully, because it can have toxic gases in it".',
            "焚烧产生的烟可能含有毒气体，所以必须仔细清理。",
          ],
        ],
        [
          ["What can happen if dirty containers are put in the recycling bin?", "如果把脏容器放进回收箱会怎样？"],
          ["Good material can be spoiled and dumped", "好的材料会被弄脏而不得不被丢弃"],
          [
            ["The containers are washed by the city", "城市会把容器洗干净"],
            ["They are turned into compost", "它们会被做成堆肥"],
          ],
          [
            'When the wrong things are put in the recycling bin, "a whole bin of good material can be made dirty and has to be dumped".',
            "放错的东西会弄脏整车可回收物，只能被倒掉。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-environment-the-coral-reef-in-danger",
      title: ["The Coral Reef in Danger", "危险中的珊瑚礁"],
      body: `Under the warm, clear water near many coasts, there are huge gardens of every color under the sea. These are coral reefs. They look like rocks or plants, but coral is actually made of millions of tiny animals that live together.

Coral reefs take up only a tiny part of the ocean floor, but about a quarter of all ocean species live on them or near them. Fish lay their eggs there, turtles feed there, and sharks hunt there. Reefs also protect coasts from storms and waves, and millions of people depend on them for food and for jobs with tourists.

Today many reefs are at serious risk. The biggest threat is climate change. As the oceans become warmer, the coral becomes weak and loses its colors. It turns white. If the water stays too hot for too long, the coral dies. In the last thirty years, about half of the coral in some famous reefs has been destroyed in this way.

There are other threats too. Pollution from farms and cities is carried into the sea by rivers. Plastic is caught on the coral. In some places, reefs have been damaged by boats and by people who take coral home as a souvenir.

But there is hope. Scientists are growing young coral in special containers and planting it on damaged reefs. Some governments have created protected areas where catching fish is banned. And tourists can help too: they can choose sun cream that does not harm coral, never touch the reef, and help local communities that protect it.

If we do something now, our children may still be able to swim with these living rainbows.`,
      grammar: [passive],
      glossed: ["reefs", "reef"],
      questions: [
        [
          ["What is coral actually made of?", "珊瑚其实是由什么构成的？"],
          ["Millions of tiny animals", "数百万微小的动物"],
          [
            ["Rocks and sand", "岩石和沙子"],
            ["Underwater plants", "水下植物"],
          ],
          [
            '"They look like rocks or plants, but coral is actually made of millions of tiny animals that live together."',
            "珊瑚看起来像岩石或植物，其实是由无数微小的动物组成的。",
          ],
        ],
        [
          ["What is the main threat to coral reefs?", "珊瑚礁面临的主要威胁是什么？"],
          ["Climate change, which makes the oceans warmer", "气候变化让海水变暖"],
          [
            ["Too many sharks", "鲨鱼太多"],
            ["Too much rain near the coast", "海岸附近雨水太多"],
          ],
          [
            '"The biggest threat is climate change." When the water becomes too hot, the coral turns white and can die.',
            "海水变暖会让珊瑚失去颜色变白，持续过热珊瑚就会死去。",
          ],
        ],
        [
          ["How can tourists help reefs?", "游客能怎样帮助珊瑚礁？"],
          ["By never touching the reef", "永远不触摸珊瑚礁"],
          [
            ["By taking coral home as a souvenir", "把珊瑚带回家作纪念品"],
            ["By growing coral in containers", "在容器里培育珊瑚"],
          ],
          [
            "Tourists can choose sun cream that does not harm coral, never touch the reef, and help local communities. Scientists, not tourists, grow young coral in containers.",
            "游客可以选择不伤害珊瑚的防晒霜、不触摸珊瑚礁；在容器里培育珊瑚的是科学家。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-environment-a-town-that-runs-on-the-sun",
      title: ["A Town That Runs on the Sun", "靠太阳运转的小镇"],
      body: `Ten years ago, the small town of Hollowell, in a dry, sunny valley, got all its electricity from a coal power station two hundred kilometers away. Today almost every roof in the town has solar panels on it, and on most days the town makes more electricity than it uses.

The change started with a problem. The old power station was going to close, and electricity prices were rising fast. At a town meeting, a retired electrician called Ruth Adams stood up. "We have three hundred sunny days a year," she said. "Why are we buying power from far away?"

Some people thought the idea was impossible. Solar panels were expensive, and many families could not pay for them. So the leaders of the town made a plan. It borrowed money to buy panels for the whole town at a lower price, and families paid it back slowly from the money they saved each month. The school, the hospital and the library were done first.

Not everything went well. In the first winter there were cloudy weeks, and the town had to buy electricity again. So a huge battery was built next to the school. Now the extra energy from sunny days is kept and used at night or when the weather is bad.

The results have been great. The town has reduced its carbon emissions to less than a fifth of what they were, and families pay much less for electricity. People come from all over the country to learn from Hollowell.

"It wasn't hard to understand," says Ruth, now eighty-one. "It was normal people who decided to do something together."`,
      grammar: [passive],
      names: ["Hollowell", "Ruth", "Adams"],
      glossed: ["panels"],
      questions: [
        [
          ["Where did the town get its electricity ten years ago?", "十年前这个小镇的电从哪里来？"],
          ["From a coal power station far away", "来自远处的一座燃煤电厂"],
          [
            ["From solar panels on every roof", "来自每家屋顶上的太阳能板"],
            ["From a huge battery next to the school", "来自学校旁边的大电池"],
          ],
          [
            'Ten years ago the town "got all its electricity from a coal power station two hundred kilometers away". The panels and the battery came later.',
            "十年前小镇的电来自两百公里外的燃煤电厂，太阳能板和大电池都是后来才有的。",
          ],
        ],
        [
          ["How did families pay for the solar panels?", "家庭是怎样支付太阳能板费用的？"],
          ["Slowly, from the money they saved each month", "用每月省下的钱慢慢还"],
          [
            ["The government gave them the panels for free", "政府免费送给他们"],
            ["Ruth Adams paid for all of them", "露丝·亚当斯全部买单"],
          ],
          [
            'The town leaders borrowed money to buy the panels, and "families paid it back slowly from the money they saved each month".',
            "镇议会先借钱统一购买，各家用每月节省的电费慢慢还款。",
          ],
        ],
        [
          ["Why was a huge battery built?", "为什么要建一个巨大的电池？"],
          ["To keep extra energy for night and bad weather", "为夜晚和坏天气储存多余的电"],
          [
            ["To sell electricity to other towns", "为了把电卖给其他城镇"],
            ["Because the solar panels stopped working", "因为太阳能板坏了"],
          ],
          [
            'After the cloudy weeks of the first winter, a battery was built so that "the extra energy from sunny days is kept and used at night or when the weather is bad".',
            "第一个冬天阴天多，于是建了大电池，把晴天多余的电存起来晚上或坏天气时用。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-environment-plastic-in-the-ocean",
      title: ["Plastic in the Ocean", "海洋里的塑料"],
      body: `Plastic is light, strong and cheap, and that is why we use so much of it. But because it is light, strong and cheap, it is also a serious problem for the environment. Every year huge amounts of plastic waste end up in the oceans.

Most of it comes from the land. Bags, bottles and packaging are dropped as litter, carried into rivers by the wind, or washed into the sea after heavy rain. Some is dumped by ships. Once it is in the water, the moving sea carries it around the world. Plastic has been found on the beaches of islands where nobody lives, and even thousands of meters down in the ocean.

Plastic does not disappear. It breaks into smaller and smaller pieces, called microplastics, but this takes hundreds of years. Sea creatures often think plastic is food. Turtles eat plastic bags because they look like jellyfish, and sea birds feed pieces of plastic to their young. Many animals die because their stomachs are full of plastic. Microplastics have also been found in fish and salt, and so in our own food.

What can be done? Many countries have banned plastic bags or made people pay for them. Some cities have banned plastic cups and spoons. Volunteers collect huge amounts of litter from beaches every year, and engineers are designing machines that collect plastic from rivers before it gets to the sea.

But the best answer is to use less plastic in the first place. Carry your own bag and water bottle, avoid products with too much packaging, and reuse what you can. Every bottle that is not thrown away is one less bottle in the ocean.`,
      grammar: [passive],
      glossed: ["microplastics", "jellyfish"],
      questions: [
        [
          ["Where does most plastic in the ocean come from?", "海洋中的塑料大多来自哪里？"],
          ["From the land", "来自陆地"],
          [
            ["From fish and sea creatures", "来自鱼和海洋生物"],
            ["From islands where nobody lives", "来自无人居住的岛屿"],
          ],
          [
            '"Most of it comes from the land": litter is carried into rivers or washed into the sea. Some is dumped by ships.',
            "大部分塑料来自陆地，被风吹进河里或被雨水冲进海里；也有一部分是船只倾倒的。",
          ],
        ],
        [
          ["Why do turtles eat plastic bags?", "海龟为什么会吃塑料袋？"],
          ["The bags look like jellyfish", "塑料袋看起来像水母"],
          [
            ["The bags taste of salt", "塑料袋有咸味"],
            ["There is no other food in the sea", "海里没有别的食物"],
          ],
          [
            '"Turtles eat plastic bags because they look like jellyfish." Sea creatures often think plastic is food.',
            "海龟把漂浮的塑料袋当成水母吃掉。",
          ],
        ],
        [
          ["What does the passage say is the best answer?", "文章认为最好的解决办法是什么？"],
          ["To use less plastic in the first place", "从一开始就少用塑料"],
          [
            ["To collect plastic from beaches", "从海滩上收集塑料"],
            ["To build machines in every river", "在每条河里安装机器"],
          ],
          [
            'Collecting litter helps, but "the best answer is to use less plastic in the first place".',
            "清理海滩和发明机器都有帮助，但最好的办法是从源头少用塑料。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-environment-saving-the-pandas",
      title: ["Saving the Pandas", "拯救大熊猫"],
      body: `For many years the panda was the most famous endangered animal in the world. Forty years ago there were only about a thousand pandas left in the wild, living in the mountain forests of China. Many people believed that the species would soon be extinct.

Pandas had a few serious threats. Their forests were cut down for wood and farms, so their habitat became smaller and was broken into small pieces. Pandas eat almost nothing but bamboo, up to forty kilos a day, and when the bamboo in one area dies, they must move to another. If the forests are not connected, they cannot move, and they cannot find food.

About thirty years ago the Chinese government began a serious campaign to protect them. Cutting trees in panda areas was banned. Many protected areas were created, and new forests were planted to connect them, so that pandas could move from one area to another. Local people were employed to look after the forests instead of cutting them down.

Scientists also studied how pandas live and how to help them have babies, which is difficult. Many young pandas were born in special centers, and some of them have been returned to the wild.

The campaign has worked. Today there are more than eighteen hundred pandas in the wild, and in 2016 the panda was moved from the list of endangered species to a less serious group. It is still at risk, especially from climate change, which may destroy some of its bamboo.

The panda story shows that a species can be rescued when governments, scientists and local communities work together.`,
      grammar: [passive],
      names: ["China", "Chinese"],
      questions: [
        [
          ["How many pandas were left in the wild forty years ago?", "四十年前野外还剩多少只大熊猫？"],
          ["About a thousand", "大约一千只"],
          [
            ["More than eighteen hundred", "一千八百多只"],
            ["About forty", "大约四十只"],
          ],
          [
            '"Forty years ago there were only about a thousand pandas left in the wild." Today there are more than eighteen hundred.',
            "四十年前野外只剩约一千只，如今已超过一千八百只。",
          ],
        ],
        [
          ["Why were new forests planted between the protected areas?", "为什么要在保护区之间种植新的森林？"],
          ["So that pandas could move from one area to another", "让大熊猫能从一个区域迁到另一个区域"],
          [
            ["So that people could cut more wood", "让人们能砍更多的木材"],
            ["So that tourists could visit the pandas", "让游客能来参观大熊猫"],
          ],
          [
            'New forests were planted "to connect them, so that pandas could move from one area to another". When the bamboo dies, pandas must move.',
            "竹子死了大熊猫就得迁移，森林相连它们才能走到别处去。",
          ],
        ],
        [
          ["What is the main lesson of the panda story?", "大熊猫的故事主要说明了什么？"],
          ["A species can be rescued when people work together", "人们齐心协力就能拯救一个物种"],
          [
            ["Pandas are no longer at any risk", "大熊猫已经完全没有危险了"],
            ["Climate change does not affect pandas", "气候变化不影响大熊猫"],
          ],
          [
            'The passage ends: "a species can be rescued when governments, scientists and local communities work together." Pandas are still at risk from climate change.',
            "政府、科学家和当地社区合作就能拯救物种；大熊猫仍面临气候变化的风险。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-environment-living-through-a-drought",
      title: ["Living Through a Drought", "经历一场干旱"],
      body: `Last summer the city of Valdera, home to two million people, came very close to running out of water. After three years with almost no rain, the lakes that give the city its water were only a tenth full. The government warned that unless people used much less water, the water would be turned off in eight weeks.

Carmen Ortiz, a mother of three, remembers it well. "At first we didn't think it was serious," she says. "Then we saw photos of the lake. It was just dry, broken ground."

Hard rules were introduced. Every person was allowed fifty liters of water a day, less than a third of what most people used before. Washing cars was banned, and gardens were left to die. Prices for water above fifty liters were raised.

Families like the Ortiz family changed their routines totally. They took showers of two minutes, standing in a big bowl, and the water from the bowl was used again. Water from washing vegetables was poured on the few plants they kept alive. "The children made it a game," Carmen says. "They checked our meter every evening to see if we had won."

Within weeks the whole city had reduced its water use by half. The water was never turned off, and in October the rain finally came back.

But scientists warn that droughts like this will happen more often as the climate changes. Valdera is now building a plant that turns sea water into drinking water, and it is repairing old leaks. The Ortiz family still takes short showers. "We learned that water can run out," she says. "We won't forget it."`,
      grammar: [passive],
      names: ["Valdera", "Carmen", "Ortiz"],
      questions: [
        [
          ["What did the government warn?", "政府发出了什么警告？"],
          ["The water would be turned off unless people used less water", "如果人们不少用水，就会停水"],
          [
            ["The lakes would be full in eight weeks", "八周后湖水就会满"],
            ["Water prices would go down", "水价将会下降"],
          ],
          [
            '"The government warned that unless people used much less water, the water would be turned off in eight weeks."',
            "政府警告：除非大家大幅减少用水，否则八周后将停水。",
          ],
        ],
        [
          ["What did Carmen's family do with the water from washing vegetables?", "卡门一家怎样处理洗菜的水？"],
          ["They poured it on their plants", "把它浇在植物上"],
          [
            ["They used it to wash the car", "用它来洗车"],
            ["They threw it away", "把它倒掉"],
          ],
          [
            '"Water from washing vegetables was poured on the few plants they kept alive." Washing cars was banned.',
            "洗菜水被浇在仅剩的几株植物上；洗车是被禁止的。",
          ],
        ],
        [
          ["What is Valdera doing now to prepare for future droughts?", "瓦尔德拉现在怎样为将来的干旱做准备？"],
          ["Building a plant that turns sea water into drinking water", "建造把海水变成饮用水的工厂"],
          [
            ["Banning showers in the city", "在全城禁止淋浴"],
            ["Moving people to another city", "把人们迁到另一个城市"],
          ],
          [
            'The city "is now building a plant that turns sea water into drinking water", and it is repairing old leaks.',
            "城市正在建海水淡化厂，并修理旧的漏水处。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-environment-the-petition-that-changed-a-law",
      title: ["The Petition That Changed a Law", "改变法律的请愿书"],
      body: `It started with a school project. In 2019 Lily Tan, who was fourteen, was asked by her science teacher to collect the litter on a beach near her home and make a list of it. In one hour she and her classmates collected more than six hundred plastic straws.

"I couldn't believe it," Lily says. "Straws are used for ten minutes and then they stay in the environment for hundreds of years." She learned that sea creatures are often hurt by them, and she decided to do something.

Lily wrote a petition asking the government to ban plastic straws. She put it online and shared it with her friends. At first only fifty people signed it. Then a local newspaper wrote a short article about her, and a famous actor shared it with his followers. Within a month the petition had been signed by more than a hundred thousand people.

Not everybody agreed with her. Some restaurant owners said that the ban would cost them money. Others said that straws were only a tiny part of the plastic problem. Lily listened to them. "They were right that straws are small," she says. "But a small change makes people think about the bigger ones."

She was invited to speak to a group of people from the government. She was very nervous, but she spoke clearly and showed them her photos from the beach. A year later, a law was passed: plastic straws were banned in shops and restaurants across the country.

Today Lily studies the law of the environment at university. Her advice to young people is simple: "Don't wait for older people to do something. If something is wrong, start a campaign. You will be surprised how many people agree with you."`,
      grammar: [passive],
      names: ["Lily", "Tan"],
      glossed: ["straws"],
      questions: [
        [
          ["How did Lily's campaign begin?", "莉莉的活动是怎样开始的？"],
          ["With a school project to count litter on a beach", "源于一个统计海滩垃圾的学校项目"],
          [
            ["With an article in a newspaper", "源于报纸上的一篇文章"],
            ["With a speech to people from the government", "源于对政府人员的一次演讲"],
          ],
          [
            '"It started with a school project": her science teacher asked her to collect and list the litter on a beach, and she found six hundred straws.',
            "一切始于科学老师布置的海滩垃圾调查，她们一小时就捡到六百多根吸管。",
          ],
        ],
        [
          ["What happened after a famous actor shared the petition?", "一位知名演员转发请愿书后发生了什么？"],
          ["More than a hundred thousand people signed it within a month", "一个月内有十多万人签了名"],
          [
            ["Restaurant owners stopped using straws at once", "餐馆老板立刻停用了吸管"],
            ["Only fifty people signed it", "只有五十个人签名"],
          ],
          [
            '"Within a month the petition had been signed by more than a hundred thousand people." At first only fifty had signed it.',
            "起初只有五十人签名，演员转发后一个月内签名超过十万。",
          ],
        ],
        [
          ["What did Lily say to the people who disagreed with her?", "莉莉怎样回应反对她的人？"],
          ["Straws are small, but a small change makes people think about bigger ones", "吸管虽小，但小改变能让人想到更大的问题"],
          [
            ["Restaurants should close", "餐馆应该关门"],
            ["Plastic straws are the biggest problem in the ocean", "塑料吸管是海洋里最大的问题"],
          ],
          [
            'Lily agreed that straws are small, "But a small change makes people think about the bigger ones."',
            "莉莉承认吸管只是小问题，但她认为小改变能引发人们思考更大的问题。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-environment-how-a-landfill-works",
      title: ["How a Landfill Works", "垃圾填埋场是怎样运作的"],
      body: `Most of the trash that is not recycled or burned is taken to a landfill. Many people imagine a landfill as a big dump where trash is just thrown on the ground and left there. A modern landfill is planned much more carefully than that.

First, a place is chosen where the ground is hard and far from rivers and towns. A huge pit is dug, and its floor is made of thick clay and strong plastic. This stops dirty water from leaking into the ground. When rain falls through the trash, it becomes a toxic liquid. This liquid is collected and cleaned before it is returned to nature.

Every day, trash is brought to the landfill from all over the city. It is spread out and pushed down by heavy machines, so that more can fit in. At the end of every day, soil is spread on top of the trash. This stops the wind from carrying it away and keeps birds and mice out.

As food and paper slowly break down, they make gases. One of them is methane, a gas that heats the climate much more than carbon dioxide. If it is left in the air, it adds to climate change. So in a modern landfill it is collected and burned, often to make electricity for homes in the area.

When a landfill is full, it is closed, and soil and grass are put on top. Some old landfills have been turned into parks, where people walk their dogs and children play.

But even the best landfill is not a real answer. It takes up a lot of land, and the trash in it stays there for hundreds of years. That is why it is better to reduce, reuse and recycle first.`,
      grammar: [passive],
      glossed: ["pit", "clay", "liquid", "soil", "methane", "dioxide"],
      questions: [
        [
          ["Why is the floor of a landfill made of clay and plastic?", "为什么填埋场的底部要用黏土和塑料？"],
          ["To stop dirty water from leaking into the ground", "防止脏水渗入地下"],
          [
            ["To make the trash burn faster", "让垃圾烧得更快"],
            ["To keep birds and mice out", "防止鸟和老鼠进入"],
          ],
          [
            '"This stops dirty water from leaking into the ground." The soil spread on top each day is what keeps birds and mice out.',
            "底部的黏土和塑料防止脏水渗入地下；每天铺在上面的泥土才是用来挡住鸟和老鼠的。",
          ],
        ],
        [
          ["What is done with the methane from a modern landfill?", "现代填埋场产生的甲烷会被怎样处理？"],
          ["It is collected and burned, often to make electricity", "被收集起来燃烧，常用于发电"],
          [
            ["It is left in the air", "任其留在空气中"],
            ["It is turned into clean water", "被转化成干净的水"],
          ],
          [
            '"In a modern landfill it is collected and burned, often to make electricity for homes in the area."',
            "这里用了被动语态：甲烷被收集起来燃烧，常用来为附近的家庭发电。",
          ],
        ],
        [
          ["Why is a landfill not a real answer?", "为什么填埋场不是真正的解决办法？"],
          ["It uses a lot of land and the trash stays for hundreds of years", "它占用大量土地，垃圾会存留几百年"],
          [
            ["It is too expensive to dig", "挖坑太贵了"],
            ["It always pollutes the rivers", "它总是污染河流"],
          ],
          [
            '"It takes up a lot of land, and the trash in it stays there for hundreds of years. That is why it is better to reduce, reuse and recycle first."',
            "填埋场占地多、垃圾要存留几百年，所以最好先减少、再利用、再回收。",
          ],
        ],
      ],
    }),
  ],
};
