import type { ReadingUnitDef } from "@ga/content";
import { t } from "@ga/content";

const mainIdea = { topic: "main-idea", weight: 0.3 } as const;
const details = { topic: "supporting-details", weight: 0.2 } as const;
const sequence = { topic: "sequence-in-texts", weight: 0.3 } as const;
const causes = { topic: "cause-and-effect-in-texts", weight: 0.3 } as const;
const contrast = { topic: "compare-and-contrast-in-texts", weight: 0.3 } as const;
const structure = { topic: "text-structures", weight: 0.3 } as const;
const inference = { topic: "making-inferences", weight: 0.3 } as const;
const factOpinion = { topic: "fact-and-opinion", weight: 0.3 } as const;
const purpose = { topic: "authors-purpose", weight: 0.3 } as const;

/** howAnimalsSurvive is a reading unit of grades 3 to 5 on the ways animals stay alive, whose questions practice the skills of reading informational texts. */
export const howAnimalsSurvive: ReadingUnitDef = {
  id: "how-animals-survive",
  title: t("How Animals Survive", "动物怎样生存"),
  passages: [
    {
      id: "hiding-in-plain-sight",
      title: t("Hiding in Plain Sight", "藏在眼皮底下"),
      body: `Many animals stay safe by being hard to see. Their colors and shapes match the places where they live, so a hungry hunter can look right at them and never notice them. This kind of hiding is called camouflage.

The snowshoe hare is brown in summer, the color of dirt and dead leaves. In autumn it grows new white fur, and by the time snow covers the ground, the hare is almost impossible to spot.

Some insects hide by looking like parts of plants. A stick insect is long, thin and brown, and it stays still for hours on a branch. A leaf insect is flat and green, with marks on its body like the lines on a real leaf.

Hunters use camouflage too. A tiger's stripes look bold in a zoo, but in tall grass, light and shadow fall in stripes as well. The tiger seems to disappear, and it can creep close to a deer before the deer knows it is there.

The next time you walk in a park or a forest, look carefully. Animals may be watching you from places you thought were empty.`,
      topics: [mainIdea],
      glossed: ["camouflage", "hare"],
      xp: 5,
      questions: [
        {
          prompt: t("What is the main idea of the passage?", "这篇文章的主旨是什么？"),
          right: t("Many animals survive by blending in with the places they live", "许多动物靠融入生活环境来生存"),
          wrong: [
            t("Snowshoe hares turn white in winter", "雪鞋兔冬天会变白"),
            t("Tigers live in zoos", "老虎生活在动物园里"),
            t("Parks and forests are good places to walk", "公园和森林是散步的好地方"),
          ],
          solution: t(
            "The first paragraph states the idea, and every later paragraph gives an animal that hides by matching its home. The hare is only one detail.",
            "第一段说出了这个意思，后面每一段都举了一种靠与环境相配来隐藏的动物。雪鞋兔只是其中一个细节。",
          ),
        },
        {
          prompt: t("Why does the snowshoe hare grow white fur in autumn?", "雪鞋兔为什么在秋天长出白色的毛？"),
          right: t("So it will match the snow that covers the ground in winter", "为了和冬天覆盖地面的雪颜色一致"),
          wrong: [
            t("So it will stay warm in summer", "为了在夏天保暖"),
            t("So hunters can find it more easily", "为了让捕猎者更容易找到它"),
            t("Because it eats white leaves", "因为它吃白色的叶子"),
          ],
          solution: t(
            "The second paragraph says that by the time snow covers the ground, the white hare is almost impossible to spot.",
            "第二段说，等到雪覆盖地面时，白色的兔子几乎无法被发现。",
          ),
        },
        {
          prompt: t("How does camouflage help a tiger?", "伪装怎样帮助老虎？"),
          right: t("It lets the tiger creep close to its prey without being seen", "它让老虎能悄悄靠近猎物而不被发现"),
          wrong: [
            t("It keeps the tiger safe from hunters", "它保护老虎不被捕猎者伤害"),
            t("It makes the tiger look bold in a zoo", "它让老虎在动物园里显得醒目"),
            t("It helps the tiger find water", "它帮助老虎找到水"),
          ],
          solution: t(
            "The fourth paragraph says the tiger seems to disappear in tall grass, so it can creep close to a deer before the deer knows it is there.",
            "第四段说老虎在高草中好像消失了，所以它能在鹿察觉之前悄悄靠近。",
          ),
        },
      ],
    },
    {
      id: "built-for-the-cold",
      title: t("Built for the Cold", "为寒冷而生"),
      body: `The polar bear lives on the ice and snow of the far north, one of the coldest places on Earth. Its whole body is made for this hard home.

First, the polar bear has two kinds of warm covering. Under its skin is a layer of fat as thick as your hand is long. On top of its skin is thick fur. Together they keep the bear so warm that it can swim for hours in icy water.

Second, its feet are made for walking on ice. They are wide, like snowshoes, which spreads out the bear's weight so it does not break through thin ice. Small bumps on the bottoms of its feet keep it from slipping.

Third, the polar bear has a powerful nose. It can smell a seal, its favorite food, under a thick sheet of ice or from far across the snow.

Even its color helps. Its pale fur matches the snow, so a seal resting on the ice may not see the bear coming until it is too late.`,
      topics: [mainIdea, details],
      names: ["Earth"],
      glossed: ["polar", "seal", "snowshoes"],
      xp: 5,
      questions: [
        {
          prompt: t("Which sentence best states the main idea?", "哪句话最好地说出了主旨？"),
          right: t("The polar bear's body is made for living in the cold", "北极熊的身体是为在寒冷中生活而生的"),
          wrong: [
            t("Polar bears like to eat seals", "北极熊喜欢吃海豹"),
            t("The far north is very cold", "遥远的北方非常寒冷"),
            t("Polar bears can swim for hours", "北极熊能游好几个小时"),
          ],
          solution: t(
            "The first paragraph ends by saying the bear's whole body is made for this hard home, and each paragraph after it describes one part of the body.",
            "第一段最后说北极熊的整个身体都是为这个艰苦的家而生的，之后每一段都描述身体的一个部分。",
          ),
        },
        {
          prompt: t("Which detail supports the idea that a polar bear's feet are made for ice?", "哪个细节支持北极熊的脚是为冰面而生的？"),
          right: t("Bumps on the bottoms of its feet keep it from slipping", "脚底的小凸起让它不会滑倒"),
          wrong: [
            t("It can smell a seal from far away", "它能从很远的地方闻到海豹"),
            t("It has a thick layer of fat", "它有一层厚厚的脂肪"),
            t("Its fur is pale like the snow", "它的毛像雪一样浅"),
          ],
          solution: t(
            "The third paragraph is about the feet: they are wide like snowshoes, and small bumps keep the bear from slipping.",
            "第三段讲的是脚：脚掌宽得像雪鞋，小凸起让北极熊不会滑倒。",
          ),
        },
        {
          prompt: t("Why does the bear's pale color help it hunt?", "北极熊浅色的毛为什么有助于捕猎？"),
          right: t("A seal may not see it coming across the snow", "海豹可能看不到它穿过雪地走来"),
          wrong: [
            t("It keeps the bear warm in icy water", "它让北极熊在冰水里保暖"),
            t("It helps the bear smell under the ice", "它帮助北极熊闻到冰下的气味"),
            t("It scares the seals away", "它把海豹吓跑"),
          ],
          solution: t(
            "The last paragraph says the pale fur matches the snow, so a resting seal may not see the bear until it is too late.",
            "最后一段说浅色的毛与雪相配，所以休息的海豹可能直到太晚才看到北极熊。",
          ),
        },
      ],
    },
    {
      id: "the-long-sleep",
      title: t("The Long Sleep", "漫长的睡眠"),
      body: `In winter, food is hard to find. Plants stop growing, insects disappear, and snow covers the ground. Some animals solve this problem by sleeping through the hardest months. This deep winter sleep is called hibernation.

The arctic ground squirrel is a champion sleeper. In late summer it eats and eats until it is fat. Then it curls up in a burrow under the ground and goes to sleep for seven or eight months.

During hibernation, the squirrel's body nearly shuts down. Its heart, which beats hundreds of times a minute in summer, slows to just a few beats a minute. It breathes only once every few minutes. Its body becomes so cold that it is colder than ice, yet it does not freeze.

The squirrel does not eat at all while it sleeps. It lives on the fat it stored in summer, and by spring it has become much thinner.

When the days grow warm again, the squirrel's body slowly warms up. It wakes, climbs out of its burrow and goes looking for its first meal in months.`,
      topics: [details],
      glossed: ["hibernation", "arctic", "squirrel", "burrow"],
      xp: 5,
      questions: [
        {
          prompt: t("Which detail shows that the squirrel's body nearly shuts down?", "哪个细节说明松鼠的身体几乎停止了运转？"),
          right: t("Its heart slows to just a few beats a minute", "它的心跳减慢到每分钟只有几下"),
          wrong: [
            t("It curls up in a burrow", "它蜷缩在洞穴里"),
            t("It eats until it is fat", "它吃到很胖"),
            t("It looks for a meal in spring", "它在春天寻找食物"),
          ],
          solution: t(
            "The third paragraph supports this idea with the heart that slows to a few beats a minute and breathing only once every few minutes.",
            "第三段用心跳减慢到每分钟几下、每隔几分钟才呼吸一次来支持这个意思。",
          ),
        },
        {
          prompt: t("How does the squirrel stay alive without eating all winter?", "松鼠整个冬天不吃东西，怎样活下来？"),
          right: t("It lives on the fat it stored in summer", "它靠夏天储存的脂肪活着"),
          wrong: [
            t("It wakes up to eat insects", "它醒来吃昆虫"),
            t("It keeps food in its burrow", "它在洞里储存食物"),
            t("It drinks melted snow", "它喝融化的雪水"),
          ],
          solution: t(
            "The fourth paragraph says the squirrel does not eat at all and lives on the fat it stored in summer.",
            "第四段说松鼠完全不吃东西，靠夏天储存的脂肪生活。",
          ),
        },
        {
          prompt: t("Why do some animals hibernate?", "有些动物为什么要冬眠？"),
          right: t("Food is hard to find in winter", "冬天很难找到食物"),
          wrong: [
            t("They are too hot in summer", "它们夏天太热"),
            t("They want to grow thinner", "它们想变瘦"),
            t("Their burrows are too small", "它们的洞太小"),
          ],
          solution: t(
            "The first paragraph names the problem: in winter food is hard to find, so some animals sleep through the hardest months.",
            "第一段说出了问题：冬天很难找到食物，所以有些动物睡过最艰难的几个月。",
          ),
        },
      ],
    },
    {
      id: "a-salmon-journey",
      title: t("A Salmon's Journey", "鲑鱼的旅程"),
      body: `A salmon's life is a long trip that ends where it began.

It starts as a tiny egg, one of thousands buried in the gravel of a cold mountain stream. In the spring, the eggs hatch. At first the baby fish stay hidden among the stones, living on a bag of food attached to their bodies.

When that food is gone, the young salmon begin to swim and hunt for insects. After a year or two in the stream, they are ready to leave. They swim downstream to the river, then all the way to the ocean.

The salmon spend several years in the ocean, eating and growing large and strong. Then something amazing happens. The grown salmon turn around and swim back to the very stream where they hatched. They travel hundreds of miles upstream, even leaping up waterfalls on the way. Scientists think they find their home stream by its smell.

Finally, in the stream of their birth, the females lay their eggs in the gravel, and the journey begins again.`,
      topics: [sequence],
      glossed: ["salmon", "gravel", "downstream", "upstream", "waterfalls", "hatch", "hatched", "females"],
      xp: 5,
      questions: [
        {
          prompt: t("What do the young salmon do right after their bag of food is gone?", "小鲑鱼身上的食物袋用完后，紧接着做什么？"),
          right: t("They begin to swim and hunt for insects", "开始游动并捕食昆虫"),
          wrong: [t("They swim to the ocean", "游向大海"), t("They lay their eggs", "产卵"), t("They hatch from the eggs", "从卵中孵出")],
          solution: t(
            "The third paragraph begins with the time words *when that food is gone*: the young salmon begin to swim and hunt. The trip to the ocean comes a year or two later.",
            "第三段以时间词 *when that food is gone* 开头：小鲑鱼开始游动和捕食。去大海是一两年以后的事。",
          ),
        },
        {
          prompt: t("Which happens last in the salmon's life?", "鲑鱼一生中最后发生的是哪件事？"),
          right: t("The females lay eggs in their home stream", "雌鱼在出生的溪流中产卵"),
          wrong: [
            t("The salmon grow large in the ocean", "鲑鱼在海里长大"),
            t("The salmon leap up waterfalls", "鲑鱼跃上瀑布"),
            t("The salmon swim downstream to the river", "鲑鱼顺流游到河里"),
          ],
          solution: t(
            "The last paragraph begins with *finally*: the females lay their eggs, and the journey begins again.",
            "最后一段以 *finally* 开头：雌鱼产卵，旅程重新开始。",
          ),
        },
        {
          prompt: t("How do scientists think salmon find their way home?", "科学家认为鲑鱼怎样找到回家的路？"),
          right: t("By the smell of their home stream", "靠出生溪流的气味"),
          wrong: [
            t("By following other fish", "跟着别的鱼"),
            t("By looking at the stars", "看星星"),
            t("By the sound of waterfalls", "靠瀑布的声音"),
          ],
          solution: t(
            "The fourth paragraph says scientists think the salmon find their home stream by its smell.",
            "第四段说科学家认为鲑鱼靠气味找到出生的溪流。",
          ),
        },
      ],
    },
    {
      id: "when-the-rains-stop",
      title: t("When the Rains Stop", "当雨水停止"),
      body: `On the grasslands of Africa, the year has two parts: a wet season and a dry season. Each spring the rains stop, and the land changes quickly.

Without rain, the grass dries out and turns brown. Rivers shrink, and many small ponds disappear completely. Because there is so little to eat and drink, huge herds of zebras and wildebeest begin to walk. They travel hundreds of miles, following the smell of rain toward places where fresh grass is growing.

The animals that stay behind must crowd around the few water holes that are left. Elephants help them. With their tusks and feet, elephants dig into dry riverbeds until they reach water under the sand. Smaller animals then drink from the holes the elephants made.

The dry season is hard for hunters too. As the herds leave, lions have less to eat, and some go hungry for days.

Then the clouds return. As soon as the rain falls, green grass springs up, the herds come back, and the grasslands fill with life once more.`,
      topics: [causes],
      names: ["Africa"],
      glossed: ["grasslands", "zebras", "wildebeest", "herds", "tusks", "riverbeds"],
      xp: 5,
      questions: [
        {
          prompt: t("Why do the herds of zebras and wildebeest begin to walk?", "斑马和角马群为什么开始迁徙？"),
          right: t("There is little to eat and drink in the dry season", "旱季几乎没有吃的和喝的"),
          wrong: [
            t("The lions chase them away", "狮子把它们赶走"),
            t("The elephants dig holes", "大象挖洞"),
            t("The grass grows too tall", "草长得太高"),
          ],
          solution: t(
            "The second paragraph gives the reason with *because*: there is so little to eat and drink, so the herds begin to walk.",
            "第二段用 *because* 说明原因：吃的喝的太少，所以兽群开始迁徙。",
          ),
        },
        {
          prompt: t("What happens because elephants dig into dry riverbeds?", "大象挖开干涸的河床，带来了什么结果？"),
          right: t("Smaller animals can drink from the holes", "小动物可以从洞里喝水"),
          wrong: [
            t("The rain begins to fall", "开始下雨"),
            t("The grass turns brown", "草变成褐色"),
            t("The herds leave for new places", "兽群去往新的地方"),
          ],
          solution: t(
            "The third paragraph says elephants dig until they reach water, and smaller animals then drink from the holes the elephants made.",
            "第三段说大象挖到有水为止，然后小动物就从大象挖的洞里喝水。",
          ),
        },
        {
          prompt: t("Why do some lions go hungry in the dry season?", "为什么有些狮子在旱季会挨饿？"),
          right: t("The herds they hunt have left", "它们捕猎的兽群离开了"),
          wrong: [
            t("They are too hot to hunt", "天太热无法捕猎"),
            t("The elephants eat their food", "大象吃了它们的食物"),
            t("They are sleeping through the season", "它们在睡觉度过这个季节"),
          ],
          solution: t(
            "The fourth paragraph says that as the herds leave, lions have less to eat.",
            "第四段说随着兽群离开，狮子能吃的东西变少了。",
          ),
        },
      ],
    },
    {
      id: "two-kinds-of-armor",
      title: t("Two Kinds of Armor", "两种盔甲"),
      body: `Some animals do not run or hide from danger. Instead, they carry their protection with them. The box turtle and the porcupine both wear a kind of armor, but their armor works in very different ways.

The box turtle's armor is a hard shell made of bone. When danger comes, the turtle pulls its head, legs and tail inside. Then it closes the bottom of its shell like a door, and nothing can get in. Its armor keeps danger out.

The porcupine's armor is made of quills, thousands of sharp spines hidden in its fur. When a porcupine is in danger, it raises its quills and turns its back toward the enemy. If the enemy comes too close, the quills stick in its skin and come loose from the porcupine. Its armor hurts whoever attacks.

Both animals are slow, and both would be easy to catch without their armor. But the turtle waits safely inside its shell, while the porcupine teaches its enemies a painful lesson they are not likely to forget.`,
      topics: [contrast],
      glossed: ["armor", "porcupine", "quills", "spines", "turtle", "turtle's", "porcupine's"],
      xp: 5,
      questions: [
        {
          prompt: t("How are the box turtle and the porcupine alike?", "箱龟和豪猪有什么相同之处？"),
          right: t("Both are slow and carry their protection with them", "两者都行动缓慢，并随身带着保护"),
          wrong: [
            t("Both have shells made of bone", "两者都有骨质的壳"),
            t("Both have sharp quills", "两者都有尖刺"),
            t("Both run fast from danger", "两者都能快速逃离危险"),
          ],
          solution: t(
            "The first paragraph says both wear a kind of armor, and the last paragraph says both animals are slow.",
            "第一段说两者都穿着一种盔甲，最后一段说两种动物都很慢。",
          ),
        },
        {
          prompt: t("How is the porcupine's armor different from the turtle's?", "豪猪的盔甲和箱龟的有什么不同？"),
          right: t("It hurts an attacker instead of only keeping danger out", "它会伤害攻击者，而不只是挡住危险"),
          wrong: [
            t("It is made of hard bone", "它由坚硬的骨头构成"),
            t("It closes like a door", "它像门一样关上"),
            t("It keeps the porcupine warm", "它让豪猪保暖"),
          ],
          solution: t(
            "The second paragraph says the turtle's armor keeps danger out, while the third says the porcupine's armor hurts whoever attacks.",
            "第二段说箱龟的盔甲把危险挡在外面，而第三段说豪猪的盔甲会伤害攻击者。",
          ),
        },
        {
          prompt: t("Which word in the last paragraph signals a contrast?", "最后一段中哪个词表示对比？"),
          right: t("while", "while（而）"),
          wrong: [t("both", "both（两者都）"), t("and", "and（和）"), t("inside", "inside（在里面）")],
          solution: t(
            "*While* sets the turtle waiting in its shell against the porcupine teaching its enemies a lesson. *Both* and *and* join things that are alike.",
            "*while* 把在壳里等待的箱龟和教训敌人的豪猪对照起来。*both* 和 *and* 连接的是相同的东西。",
          ),
        },
      ],
    },
    {
      id: "fences-that-buzz",
      title: t("Fences That Buzz", "嗡嗡作响的围栏"),
      body: `In parts of Kenya, farmers and elephants live side by side, and that can be a problem. At night, elephants walk into the fields and eat the crops. In a few hours, a hungry herd can destroy food that a family worked all year to grow.

Farmers tried shouting, banging pots and lighting fires, but the elephants kept coming back. Some farmers got angry, and both people and elephants were hurt.

Then a scientist noticed something surprising: elephants are afraid of bees. A bee sting inside an elephant's trunk is very painful, and when elephants hear angry bees buzzing, they quickly walk away.

So she helped farmers build beehive fences. Every few steps along the edge of a field, a beehive hangs from a wire. When an elephant pushes against the wire, the hives swing, and the bees fly out buzzing.

The fences work. Most elephants now turn back before they reach the crops. As a bonus, the bees make honey, which the farmers can sell, and the bees help the crops grow by carrying pollen from flower to flower.`,
      topics: [structure],
      names: ["Kenya"],
      glossed: ["beehive", "hives", "sting", "trunk", "elephant's"],
      xp: 5,
      questions: [
        {
          prompt: t("How is this passage organized?", "这篇文章是怎样组织的？"),
          right: t("problem and solution", "问题与解决"),
          wrong: [t("sequence", "顺序"), t("compare and contrast", "比较与对比"), t("description", "描述")],
          solution: t(
            "The first paragraph names a problem, elephants eating crops, and the later paragraphs tell how beehive fences solved it.",
            "第一段提出一个问题，即大象吃庄稼，后面几段讲蜂箱围栏怎样解决了它。",
          ),
        },
        {
          prompt: t("Why do beehive fences keep elephants away?", "蜂箱围栏为什么能让大象远离？"),
          right: t("Elephants are afraid of angry bees", "大象害怕被激怒的蜜蜂"),
          wrong: [
            t("The fences are too tall to climb", "围栏太高爬不过去"),
            t("The honey tastes bad to elephants", "大象觉得蜂蜜难吃"),
            t("The farmers shout at night", "农民晚上大喊"),
          ],
          solution: t(
            "The third paragraph says a bee sting inside the trunk is painful, and elephants walk away when they hear angry bees.",
            "第三段说鼻子里被蜇非常疼，大象听到被激怒的蜜蜂就会走开。",
          ),
        },
        {
          prompt: t("What extra good do the bees bring the farmers?", "蜜蜂还给农民带来了什么额外的好处？"),
          right: t("Honey to sell and help with growing crops", "可以出售的蜂蜜，以及帮助庄稼生长"),
          wrong: [
            t("Wood for their fires", "生火用的木头"),
            t("Food for their elephants", "喂大象的食物"),
            t("Water for their fields", "浇地的水"),
          ],
          solution: t(
            "The last paragraph says the bees make honey the farmers can sell and carry pollen that helps the crops grow.",
            "最后一段说蜜蜂酿的蜂蜜农民可以出售，还能传粉帮助庄稼生长。",
          ),
        },
      ],
    },
    {
      id: "stories-in-the-snow",
      title: t("Stories in the Snow", "雪地里的故事"),
      body: `After a fresh snowfall, a forest is full of stories, if you know how to read them. Every animal that passes leaves tracks.

One winter morning, a girl named Ana followed a line of small tracks across a field. The tracks came in groups of four: two small prints side by side, and two long ones in front of them. The groups were far apart, as if the animal had been leaping.

Halfway across the field, a second line of tracks joined the first. These were larger, with four toes and a pad, in a neat line, one print in front of the other.

Ana followed both lines to the edge of the woods. There, the snow was pressed down in a wide circle. A few tufts of brown fur lay on the snow. Beyond the circle, only the larger tracks continued into the trees.

Ana stood still for a long time. Then she walked home, thinking about the story the snow had told her.`,
      topics: [inference],
      names: ["Ana"],
      glossed: ["snowfall", "tufts", "prints"],
      xp: 5,
      questions: [
        {
          prompt: t("What can you infer the small animal was doing?", "你能推断出那只小动物在做什么？"),
          right: t("Running fast across the field", "飞快地跑过田野"),
          wrong: [
            t("Sleeping in the snow", "在雪地里睡觉"),
            t("Walking slowly to find food", "慢慢地走着找食物"),
            t("Digging a burrow", "挖洞"),
          ],
          solution: t(
            "The second paragraph says its tracks were far apart, as if the animal had been leaping. An animal that leaps far is moving fast.",
            "第二段说它的足迹相隔很远，好像这只动物在跳跃。跳得远的动物是在快速移动。",
          ),
        },
        {
          prompt: t("What most likely happened at the edge of the woods?", "在树林边缘最可能发生了什么？"),
          right: t("The larger animal caught the smaller one", "大动物抓住了小动物"),
          wrong: [
            t("The two animals became friends", "两只动物成了朋友"),
            t("Ana caught the small animal", "安娜抓住了小动物"),
            t("Both animals ran into the trees", "两只动物都跑进了树林"),
          ],
          solution: t(
            "The fourth paragraph gives the clues: the snow pressed down in a circle, tufts of fur, and only the larger tracks going on into the trees.",
            "第四段给出了线索：雪地上压出一个圆圈，有几撮毛，只有大动物的足迹继续通向树林。",
          ),
        },
        {
          prompt: t("Which clue shows the larger animal was following the smaller one?", "哪条线索说明大动物在跟踪小动物？"),
          right: t("Its tracks joined the first line and went the same way", "它的足迹加入了第一行，朝同一方向走"),
          wrong: [
            t("Its prints had four toes and a pad", "它的脚印有四个趾和一个肉垫"),
            t("Ana stood still for a long time", "安娜站了很久"),
            t("The tracks came in groups of four", "足迹四个一组"),
          ],
          solution: t(
            "The third paragraph says the second line of tracks joined the first halfway across the field, and both lines led to the edge of the woods.",
            "第三段说第二行足迹在田野中途加入了第一行，两行都通向树林边缘。",
          ),
        },
      ],
    },
    {
      id: "the-truth-about-sharks",
      title: t("The Truth About Sharks", "关于鲨鱼的真相"),
      body: `Sharks have a bad name. In movies they are monsters that hunt people, and many swimmers are terrified of them. I think sharks are the most misunderstood animals in the sea.

Here are the facts. There are more than five hundred kinds of sharks. Most of them are smaller than a person, and some are short enough to hold in your hand. The largest, the whale shark, is as long as a bus, but it eats only tiny plants and animals that float in the water.

Sharks almost never attack people. Each year, fewer than one hundred people around the world are bitten by sharks. You are more likely to be hit by lightning.

People are far more dangerous to sharks. Every year, fishing boats catch millions of them, and some kinds of sharks have become rare.

Sharks have lived in the oceans for millions of years, longer than trees have grown on land. In my opinion, they deserve our respect, not our fear. We should protect them before it is too late.`,
      topics: [factOpinion],
      glossed: ["sharks", "shark", "misunderstood", "terrified", "lightning", "deserve"],
      xp: 5,
      questions: [
        {
          prompt: t("Which sentence from the passage is a fact?", "文中哪个句子是事实？"),
          right: t("There are more than five hundred kinds of sharks.", "鲨鱼有五百多种。"),
          wrong: [
            t("Sharks are the most misunderstood animals in the sea.", "鲨鱼是海里最被误解的动物。"),
            t("They deserve our respect, not our fear.", "它们值得我们尊重，而不是害怕。"),
            t("We should protect them before it is too late.", "我们应该在为时已晚之前保护它们。"),
          ],
          solution: t(
            "The number of kinds of sharks can be checked in a book. The other sentences tell what the writer thinks, with words such as *most misunderstood*, *deserve* and *should*.",
            "鲨鱼的种类数可以查书核实。其他句子表达的是作者的想法，用了 *most misunderstood*、*deserve*、*should* 这样的词。",
          ),
        },
        {
          prompt: t("Which words tell you the writer is giving an opinion?", "哪些词告诉你作者在表达观点？"),
          right: t("In my opinion", "In my opinion（在我看来）"),
          wrong: [
            t("Here are the facts", "Here are the facts（以下是事实）"),
            t("Each year", "Each year（每年）"),
            t("more than", "more than（超过）"),
          ],
          solution: t(
            "*In my opinion* and *I think* tell you a sentence is what the writer believes. *Here are the facts* introduces facts.",
            "*In my opinion* 和 *I think* 表明句子是作者的看法。*Here are the facts* 引出的是事实。",
          ),
        },
        {
          prompt: t(
            "Which fact supports the idea that sharks are not very dangerous to people?",
            "哪个事实支持鲨鱼对人并不太危险这一看法？",
          ),
          right: t("Fewer than one hundred people a year are bitten by sharks", "每年被鲨鱼咬伤的人不到一百个"),
          wrong: [
            t("The whale shark is as long as a bus", "鲸鲨和公共汽车一样长"),
            t("Sharks have lived in the oceans for millions of years", "鲨鱼已在海洋中生活了数百万年"),
            t("Some kinds of sharks have become rare", "有些种类的鲨鱼已经很稀少"),
          ],
          solution: t(
            "The third paragraph says fewer than one hundred people a year are bitten, which shows attacks are rare.",
            "第三段说每年被咬的人不到一百个，说明鲨鱼袭击很少见。",
          ),
        },
      ],
    },
    {
      id: "a-garden-for-monarchs",
      title: t("A Garden for Monarchs", "为帝王蝶建一座花园"),
      body: `Every spring, monarch butterflies fly north looking for one special plant: milkweed. It is the only plant on which they lay their eggs, and the only food their caterpillars can eat. Without milkweed, there can be no monarchs.

Sadly, milkweed is disappearing. Fields where it once grew wild have become roads, parking lots and neat green lawns. As the milkweed goes, so do the butterflies. There are far fewer monarchs today than there were when your grandparents were young.

You can help, and it is easy. Milkweed grows quickly from seed, and it needs little care. Plant some in a sunny corner of your yard, in a pot on a balcony, or in a corner of the school garden. Ask your neighbors to plant some too.

Imagine stepping outside on a summer morning and finding a striped caterpillar munching on a leaf, or an orange and black butterfly drifting past your window. With a few seeds and a little water, you can give the monarchs a place to land. Please plant milkweed this spring!`,
      topics: [purpose, inference],
      glossed: ["monarch", "monarchs", "milkweed", "caterpillars", "caterpillar", "lawns", "balcony", "munching", "striped"],
      xp: 5,
      questions: [
        {
          prompt: t("What is the author's main purpose?", "作者的主要目的是什么？"),
          right: t("To persuade readers to plant milkweed", "说服读者种植马利筋"),
          wrong: [
            t("To entertain readers with a story about a butterfly", "用蝴蝶的故事娱乐读者"),
            t("To explain how roads are built", "解释道路是怎样修建的"),
            t("To tell how fast caterpillars grow", "讲述毛毛虫长得有多快"),
          ],
          solution: t(
            "The author gives facts about monarchs, but tells the reader *you can help*, gives steps to follow and ends with *Please plant milkweed this spring!*",
            "作者虽然提供了关于帝王蝶的事实，但告诉读者 *you can help*，给出了做法，并以 *Please plant milkweed this spring!* 结尾。",
          ),
        },
        {
          prompt: t("Why are there fewer monarchs today?", "为什么现在的帝王蝶变少了？"),
          right: t("Much of the milkweed they need has disappeared", "它们需要的马利筋大量消失了"),
          wrong: [
            t("They have stopped flying north", "它们不再向北飞了"),
            t("Their caterpillars eat too many leaves", "它们的毛毛虫吃了太多叶子"),
            t("People plant too much milkweed", "人们种了太多马利筋"),
          ],
          solution: t(
            "The second paragraph says fields of milkweed have become roads, parking lots and lawns, and as the milkweed goes, so do the butterflies.",
            "第二段说长马利筋的田野变成了道路、停车场和草坪，马利筋消失，蝴蝶也随之消失。",
          ),
        },
        {
          prompt: t("Why does the author ask you to imagine a summer morning?", "作者为什么请你想象一个夏日的早晨？"),
          right: t("To make you want to see monarchs near your home", "让你想在家附近看到帝王蝶"),
          wrong: [
            t("To tell you what time butterflies wake up", "告诉你蝴蝶什么时候醒来"),
            t("To warn you about caterpillars", "提醒你小心毛毛虫"),
            t("To show that summer is the best season", "说明夏天是最好的季节"),
          ],
          solution: t(
            "The last paragraph paints a pleasant picture of a caterpillar and a butterfly at your window, then asks you to plant milkweed: the picture makes the request more appealing.",
            "最后一段描绘了毛毛虫和蝴蝶出现在窗前的美好画面，然后请你种马利筋：这幅画面让请求更有吸引力。",
          ),
        },
      ],
    },
  ],
};
