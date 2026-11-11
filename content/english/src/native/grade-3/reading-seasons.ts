// Grade 3: the reading unit of the theme of poems through the year: eight original poems, two for each season.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, clues, passage, words } from "./reading-kit.ts";

const poetry = words("words-of-poetry");
const seasons = words("words-for-seasons-and-senses");
const senses = words("sensory-words");

/** poemsForAllSeasons is the reading unit of grade 3 of poems about winter, spring, summer and autumn. */
export const poemsForAllSeasons: ReadingUnitDef = {
  id: "poems-for-all-seasons",
  title: t("Poems for All Seasons", "四季的诗"),
  passages: [
    passage(
      "first-snow",
      t("First Snow", "初雪"),
      `I woke before the morning light
and something in the room was strange.
The world outside had gone so quiet,
as if the night had made a change.

I pulled the curtain to one side
and gasped at what I saw below:
the street, the cars, the garden wall
were sleeping under soft white snow.

The fence had grown a fluffy coat,
the bench was wearing a tall white hat,
the bushes looked like sleeping sheep,
and every roof was smooth and flat.

I pulled my boots and mittens on
and crept outside without a sound.
The air was cold and sharp and clean.
My footsteps crunched across the ground.

I caught a snowflake on my tongue.
It tasted like a drop of sky.
I lay down flat and swept my arms
to make an angel, wide and high.

By noon the other kids came out
with sleds and shovels, shouts and play,
but I will always keep the hush
of that first snow, at break of day.`,
      [clues, poetry, seasons, senses],
      [
        ask(
          ["What did the speaker notice first, before looking outside?", "在往外看之前，诗中的“我”先注意到了什么？"],
          ["The world outside had gone very quiet", "外面的世界变得非常安静"],
          [
            ["Kids were shouting with their sleds", "孩子们拉着雪橇大声喊叫"],
            ["A snowflake had landed on the bed", "一片雪花落在了床上"],
            ["The sun was shining very brightly", "阳光非常耀眼"],
          ],
          [
            "The first stanza says the speaker woke before the light and noticed the world outside had gone so quiet.",
            "第一节说，“我”在天亮前醒来，发现外面的世界变得非常安静。",
          ],
        ),
        ask(
          ["In the third stanza, what does the poet compare the snowy bushes to?", "在第三节里，诗人把盖着雪的灌木比作什么？"],
          ["Sleeping sheep", "睡着的绵羊"],
          [
            ["Tall white hats", "高高的白帽子"],
            ["Fluffy coats", "毛茸茸的外套"],
            ["Snow angels", "雪天使"],
          ],
          [
            "The third stanza says the bushes looked like sleeping sheep, while the fence had a coat and the bench a hat.",
            "第三节说灌木看起来像睡着的绵羊，而篱笆穿着外套，长椅戴着帽子。",
          ],
        ),
        ask(
          ["Which line uses the sense of taste?", "哪一行用到了味觉？"],
          ["It tasted like a drop of sky", "它尝起来像一滴天空"],
          [
            ["My footsteps crunched across the ground", "我的脚步嘎吱嘎吱地踩过地面"],
            ["The air was cold and sharp and clean", "空气又冷又清冽又干净"],
            ["The world outside had gone so quiet", "外面的世界变得那么安静"],
          ],
          [
            "The fifth stanza says the snowflake tasted like a drop of sky, which is about taste, while crunching is about sound.",
            "第五节说雪花尝起来像一滴天空，这写的是味觉，而嘎吱声写的是听觉。",
          ],
        ),
      ],
    ),
    passage(
      "the-puddle-jumper",
      t("The Puddle Jumper", "踩水坑的孩子"),
      `The rain came down all Sunday night.
It drummed upon the roof.
It tapped the windows, gurgled down
the gutters, drip and droop.

But Monday morning, out came the sun,
and there, upon the street,
were puddles shining everywhere,
just waiting for my feet.

I put my yellow raincoat on.
I put my red boots too.
I said goodbye to Mom and ran
the way I always do.

The first one was a little one.
I hopped it with a plop.
The second one was deeper, and
I landed with a slop.

The third one was a giant lake.
I took a running leap,
and splash! A wave of muddy brown
went flying wide and deep.

It soaked my socks. It soaked my knees.
It soaked a passing cat,
who glared at me and shook herself
and hissed, "Well, how about that!"

I squelched to school with soggy toes
and freckles made of mud.
My teacher only laughed and said,
"I see you've met the flood."`,
      [clues, poetry, seasons, senses],
      [
        ask(
          ["Why were there puddles everywhere on Monday morning?", "为什么星期一早上到处都是水坑？"],
          ["It had rained all Sunday night", "星期天下了一整夜的雨"],
          [
            ["A pipe had burst in the street", "街上的水管爆了"],
            ["The snow had melted in the sun", "雪在阳光下融化了"],
            ["Mom had washed the street", "妈妈把街道冲洗了一遍"],
          ],
          [
            "The first two stanzas say the rain came down all Sunday night, and on Monday morning there were puddles everywhere.",
            "前两节说，星期天下了一整夜的雨，星期一早上到处都是水坑。",
          ],
        ),
        ask(
          ["How are the three puddles different?", "这三个水坑有什么不同？"],
          ["Each one is bigger or deeper than the one before", "一个比一个大，一个比一个深"],
          [
            ["Each one is a different color", "每个水坑颜色都不一样"],
            ["Each one is farther from school", "每个水坑都离学校更远"],
            ["Only the first one is muddy", "只有第一个水坑是浑的"],
          ],
          [
            "The fourth and fifth stanzas say the first was little, the second deeper, and the third a giant lake.",
            "第四节和第五节说，第一个很小，第二个更深，第三个像一个巨大的湖。",
          ],
        ),
        ask(
          ["How did the cat feel about the splash?", "那只猫对溅起的水有什么感受？"],
          ["It was annoyed", "它很恼火"],
          [
            ["It was delighted", "它很高兴"],
            ["It was sleepy", "它很困"],
            ["It was frightened of the rain", "它害怕下雨"],
          ],
          [
            "The sixth stanza says the soaked cat glared at the speaker and hissed, which shows it was annoyed.",
            "第六节说，被弄湿的猫瞪着“我”，还发出嘶嘶声，这说明它很恼火。",
          ],
        ),
      ],
      ["Sunday", "Monday", "Mom"],
    ),
    passage(
      "spring-is-late",
      t("Spring Is Late", "春天迟到了"),
      `Spring is late this year, I think.
She must have missed her train.
The calendar says April now,
but still it's cold and grey with rain.

The robins on the fence are cross.
They ruffle up their wings.
They came back early from the south
expecting warmer things.

The daffodils have poked their heads
up from the frozen ground,
then pulled their green coats tighter still
and looked uneasily around.

The farmer waits to plant his seeds.
The ducks wait on the pond.
The children wait with kites in hand
for sky and wind beyond.

Oh Spring, where are you hiding now?
Have you forgotten us?
Perhaps you're lost, or fast asleep,
or waiting for the bus.

But wait. This morning, by the gate,
a single tulip, red,
is open wide and shining bright
upon its garden bed.

And on the branch outside my room
a bud is turning green.
I think that Spring has just arrived,
the shyest guest I've seen.`,
      [clues, poetry, seasons],
      [
        ask(
          ["What is the poem mostly about?", "这首诗主要写的是什么？"],
          ["Waiting for spring to finally arrive", "等待春天终于到来"],
          [
            ["A train that is late to the station", "一列晚点进站的火车"],
            ["A farmer planting seeds in summer", "一个农民在夏天播种"],
            ["Children flying kites on a windy day", "孩子们在刮风的日子放风筝"],
          ],
          [
            "The poem is about a spring that is late: everyone waits for it, and at the end the first tulip and bud show it has come.",
            "这首诗写的是迟到的春天：大家都在等它，到最后第一朵郁金香和一个嫩芽说明它来了。",
          ],
        ),
        ask(
          ["Why are the robins cross?", "知更鸟为什么不高兴？"],
          ["They came back early and found it still cold", "它们早早飞回来，却发现天气还很冷"],
          [
            ["Someone took their nest from the fence", "有人拿走了篱笆上的鸟窝"],
            ["The daffodils pushed them off the fence", "水仙花把它们从篱笆上挤了下去"],
            ["The children scared them with kites", "孩子们用风筝吓唬它们"],
          ],
          [
            "The second stanza says the robins came back early from the south expecting warmer things, but it is still cold.",
            "第二节说，知更鸟从南方早早飞回来，盼着天气变暖，可天还是很冷。",
          ],
        ),
        ask(
          ["How does the speaker know at the end that spring has come?", "结尾时，“我”怎么知道春天来了？"],
          ["A tulip has opened and a bud is turning green", "一朵郁金香开了，一个花苞正在变绿"],
          [
            ["The calendar says it is April", "日历上显示是四月"],
            ["Spring got off the bus at the gate", "春天在大门口下了公共汽车"],
            ["The robins flew back to the south", "知更鸟飞回了南方"],
          ],
          [
            "The last two stanzas show a red tulip open by the gate and a bud turning green, so the speaker thinks Spring has arrived.",
            "最后两节写大门边开了一朵红郁金香，一个花苞正在变绿，所以“我”认为春天来了。",
          ],
        ),
      ],
      ["Spring", "April", "Oh"],
    ),
    passage(
      "bees-in-the-clover",
      t("Bees in the Clover", "三叶草里的蜜蜂"),
      `Down in the meadow where the clover grows,
white and pink in tangled rows,
the bees are busy all day long,
humming their low and sleepy song.

Buzz, buzz, from flower to flower,
hour by hour by golden hour,
they dip their heads in every one
and fill their bags beneath the sun.

Their legs are thick with yellow dust.
They fly as far as busy bees must,
over the brook and over the hill,
and back again, and further still.

Buzz, buzz, from flower to flower,
working through each sunny hour,
they carry the sweet juice home to make
the honey for the hive's own sake.

I lie in the grass and close my eyes
and hear them humming as they rise.
The clover smells of warm sweet tea.
A bee lands softly on my knee.

I keep quite still. I do not shout.
It looks around and walks about.
Then off it hums, as bees will do,
to find a flower it never knew.

Buzz, buzz, from flower to flower,
until the evening's cooling hour,
the meadow sings, the meadow hums,
and summer comes, and summer comes.`,
      [clues, poetry, seasons, senses],
      [
        ask(
          ["Which lines repeat in this poem?", "这首诗中哪些诗句是重复的？"],
          ['Lines that begin "Buzz, buzz, from flower to flower"', "以“嗡嗡，从一朵花飞到另一朵花”开头的诗句"],
          [
            ['Lines that begin "I lie in the grass"', "以“我躺在草地上”开头的诗句"],
            ['Lines that begin "Their legs are thick"', "以“它们的腿上沾满了”开头的诗句"],
            ['Lines that begin "I keep quite still"', "以“我一动也不动”开头的诗句"],
          ],
          [
            'The line "Buzz, buzz, from flower to flower" opens the second, fourth and last stanzas, like a chorus.',
            "“嗡嗡，从一朵花飞到另一朵花”这一行出现在第二、第四和最后一节的开头，就像副歌一样。",
          ],
        ),
        ask(
          ["Why do the bees carry the sweet juice home?", "蜜蜂为什么要把甜甜的汁液带回家？"],
          ["To make honey for the hive", "为了给蜂巢酿蜜"],
          [
            ["To feed the clover in the meadow", "为了给草地上的三叶草施肥"],
            ["To make tea for the speaker", "为了给“我”泡茶"],
            ["To wash the dust from their legs", "为了洗掉腿上的粉"],
          ],
          [
            "The fourth stanza says the bees carry the sweet juice home to make the honey for the hive.",
            "第四节说，蜜蜂把甜甜的汁液带回家，是为了给蜂巢酿蜜。",
          ],
        ),
        ask(
          ["What does the speaker do when a bee lands on their knee?", "一只蜜蜂落在“我”的膝盖上时，“我”做了什么？"],
          ["Keeps quite still and does not shout", "一动不动，也不叫喊"],
          [
            ["Jumps up and runs home", "跳起来跑回家"],
            ["Brushes it away with a hand", "用手把它拂走"],
            ["Catches it in a jar", "把它装进罐子里"],
          ],
          [
            "The sixth stanza says the speaker keeps quite still and does not shout, and the bee walks about and flies off.",
            "第六节说，“我”一动不动，也不叫喊，蜜蜂走了走就飞走了。",
          ],
        ),
      ],
    ),
    passage(
      "the-hottest-day",
      t("The Hottest Day", "最热的一天"),
      `It was the hottest day of all,
the hottest day of the year.
The sun hung like a burning ball
and nothing moved, not far, not near.

The road was soft and shimmering.
The dog lay flat beneath the tree.
The birds forgot their twittering.
The flowers drooped, and so did we.

The ice cream melted down my hand
before I'd had a single lick.
The sidewalk burned like desert sand.
The air was heavy, still and thick.

My brother filled a bucket up
and tipped it over both our heads.
We drank lemonade, cup after cup,
and lay like starfish on our beds.

Then Grandpa said, "I have a plan,"
and found the hose behind the shed.
He sprayed us both, and off we ran
through rainbows, laughing, wet and red.

At last the sun began to sink.
A little breeze came up the hill.
The sky turned orange, gold and pink.
The crickets sang. The world was still.

We sat outside on the cool back stair
and watched the first star shining bright,
and felt the soft and gentle air.
The hottest day became a lovely night.`,
      [clues, poetry, seasons, senses],
      [
        ask(
          ["What does the poet compare the sun to?", "诗人把太阳比作什么？"],
          ["A burning ball", "一个燃烧的球"],
          [
            ["A bucket of water", "一桶水"],
            ["A starfish on a bed", "床上的一只海星"],
            ["A rainbow in the sky", "天上的一道彩虹"],
          ],
          ["The first stanza says the sun hung like a burning ball.", "第一节说，太阳像一个燃烧的球挂在天上。"],
        ),
        ask(
          ["Which detail shows how hot the day was?", "哪个细节说明那天有多热？"],
          ["The ice cream melted before the first lick", "还没舔一口，冰淇淋就化了"],
          [
            ["The crickets sang in the evening", "傍晚蟋蟀在唱歌"],
            ["The first star was shining bright", "第一颗星星闪闪发亮"],
            ["A little breeze came up the hill", "一阵微风吹上山坡"],
          ],
          [
            "The third stanza says the ice cream melted down the speaker's hand before a single lick, which shows the heat.",
            "第三节说，“我”还没舔一口，冰淇淋就顺着手化了，这说明天气很热。",
          ],
        ),
        ask(
          ["How does the mood of the poem change at the end?", "诗的结尾气氛发生了什么变化？"],
          ["It goes from hot and heavy to cool and peaceful", "从又热又闷变得凉爽而平静"],
          [
            ["It goes from happy to angry", "从高兴变得生气"],
            ["It goes from quiet to very noisy", "从安静变得非常吵闹"],
            ["It goes from cool to even hotter", "从凉爽变得更热"],
          ],
          [
            "The last two stanzas bring a breeze, crickets, cool stairs and soft air, so the hot, heavy day turns into a peaceful night.",
            "最后两节写了微风、蟋蟀、凉凉的台阶和柔和的空气，于是又热又闷的白天变成了平静的夜晚。",
          ],
        ),
      ],
      ["Grandpa"],
    ),
    passage(
      "fireflies",
      t("Fireflies", "萤火虫"),
      `When summer evenings slowly fade
and shadows fill the yard,
when bats come out and frogs begin
to sing, and stars are starred,

the fireflies come floating up
from grasses, damp and deep,
like little lanterns being lit
by someone half asleep.

They blink, they wink, they drift, they rise,
they glow and then they hide.
They write their names in yellow light
and vanish on the side.

I chase them with an empty jar
across the cooling lawn.
I catch one, and it lights my hand,
and then I see it's gone.

It crawled up to the very top
and flew into the night.
I think it wanted to be free.
I think that it was right.

So now I only sit and watch
upon the old front stair,
and count the tiny, flickering lights
that dance across the air.

One, two, three, a dozen more,
a hundred, maybe more:
the whole dark garden twinkles like
a sky laid on the floor.`,
      [clues, poetry, seasons, senses],
      [
        ask(
          ["When do the fireflies come out in the poem?", "诗中萤火虫什么时候出来？"],
          ["On summer evenings as it gets dark", "在夏天傍晚天色变暗的时候"],
          [
            ["On cold winter mornings", "在寒冷的冬天早晨"],
            ["At noon on the hottest day", "在最热那天的中午"],
            ["In the middle of a rainstorm", "在暴雨中"],
          ],
          [
            "The first stanza says the fireflies come when summer evenings slowly fade and shadows fill the yard.",
            "第一节说，萤火虫在夏天傍晚天色慢慢变暗、院子里布满阴影的时候出来。",
          ],
        ),
        ask(
          ["What does the poet compare the fireflies to in the second stanza?", "在第二节里，诗人把萤火虫比作什么？"],
          ["Little lanterns being lit", "被点亮的小灯笼"],
          [
            ["Frogs singing in the grass", "在草丛里唱歌的青蛙"],
            ["Bats coming out at night", "夜里出来的蝙蝠"],
            ["An empty jar", "一个空罐子"],
          ],
          [
            "The second stanza says the fireflies float up like little lanterns being lit.",
            "第二节说，萤火虫飘起来，像一盏盏被点亮的小灯笼。",
          ],
        ),
        ask(
          ["Why does the speaker stop chasing fireflies with a jar?", "“我”为什么不再用罐子去捉萤火虫了？"],
          ["The speaker thinks the fireflies want to be free", "“我”觉得萤火虫想要自由"],
          [
            ["The jar was broken", "罐子破了"],
            ["The fireflies stopped glowing", "萤火虫不再发光了"],
            ["It became too cold outside", "外面变得太冷了"],
          ],
          [
            "After the firefly escapes, the speaker says it wanted to be free and was right, and from then on only sits and watches.",
            "萤火虫飞走以后，“我”说它想要自由，而且它是对的，从那以后“我”就只是坐着看。",
          ],
        ),
      ],
    ),
    passage(
      "the-leaf-pile",
      t("The Leaf Pile", "落叶堆"),
      `The maple tree let go its leaves,
red and orange, brown and gold.
They twirled and spun like spinning tops
and fell because the wind was cold.

They covered up the garden path.
They covered up the lawn.
They covered up my bike and ball,
and still they came falling on.

So Dad and I took out the rakes
and raked them, row by row,
and swept them all into a pile
as high as I could throw.

It crackled and it rustled,
it smelled of earth and rain,
it was the finest pile of leaves
from here to Spain and back again.

I stepped back to the garden wall.
I counted, "One, two, three!"
I ran and jumped and disappeared.
The leaves came down on me.

I swam inside that crunchy sea.
I threw it in the air.
I came up out of it with leaves
stuck all across my hair.

Then Dad said with a weary sigh,
"We'll have to rake it all again."
I said, "Let's do it once again,
and jump once more, and then..."

And so we did, the whole day long,
till evening came, and dark, and night.
The pile was flat, but we were full
of autumn and delight.`,
      [clues, poetry, seasons, senses],
      [
        ask(
          ["Why did the leaves fall from the maple tree?", "枫树的叶子为什么会落下来？"],
          ["The wind was cold", "因为风很冷"],
          [
            ["Dad shook the tree", "因为爸爸摇了树"],
            ["The speaker threw a ball at it", "因为“我”朝树扔了个球"],
            ["It was raining very hard", "因为雨下得很大"],
          ],
          [
            "The first stanza says the leaves twirled and spun and fell because the wind was cold.",
            "第一节说，叶子旋转着落下，因为风很冷。",
          ],
        ),
        ask(
          ["Which words in the fourth stanza help you hear the leaf pile?", "第四节里哪些词让你仿佛听到了落叶堆的声音？"],
          ["Crackled and rustled", "噼啪作响和沙沙作响"],
          [
            ["Red and orange", "红色和橙色"],
            ["Earth and rain", "泥土和雨"],
            ["Here to Spain", "从这里到西班牙"],
          ],
          [
            "The fourth stanza says the pile crackled and rustled, which are sounds, while earth and rain are what it smelled of.",
            "第四节说落叶堆噼啪作响、沙沙作响，这是声音，而泥土和雨是它闻起来的气味。",
          ],
        ),
        ask(
          ["Why did Dad give a weary sigh?", "爸爸为什么疲惫地叹了口气？"],
          ["The jumping had spread the leaves, and they had to rake again", "跳来跳去把树叶弄散了，他们得重新耙"],
          [
            ["He did not like the color of the leaves", "他不喜欢树叶的颜色"],
            ["The speaker had lost the rakes", "“我”把耙子弄丢了"],
            ["It was starting to rain", "天开始下雨了"],
          ],
          [
            'After the speaker jumps in and throws the leaves around, Dad sighs, "We\'ll have to rake it all again."',
            "“我”跳进去、把叶子扔得到处都是以后，爸爸叹气说：“我们又得全部重新耙一遍了。”",
          ],
        ),
      ],
      ["Dad", "Spain"],
    ),
    passage(
      "the-last-apple",
      t("The Last Apple", "最后一个苹果"),
      `High up on the apple tree,
the very highest bough,
there hangs one apple, round and red.
It's all alone up there now.

All autumn long we picked the rest.
We filled up every crate.
We baked them into pies and cakes
and ate them off a plate.

We pressed them into apple juice
and stirred them into jam.
We sliced them thin for Grandma's tea
and served them up with ham.

But that one apple, way up high,
was just too far to reach.
My brother tried. I tried as well.
We tried a ladder each.

Now all the leaves have blown away.
The branches black and bare
are shivering in the winter wind,
and still the apple's there.

It glows like a lamp against the grey,
it shines in frost and sleet.
The blackbirds come and peck at it.
I'm glad they have a treat.

I think I'll leave it where it is,
a small red winter sun,
to say the tree will bloom again
when winter's cold is done.`,
      [clues, poetry, seasons, senses],
      [
        ask(
          ["Why is the last apple still on the tree?", "为什么最后一个苹果还挂在树上？"],
          ["It hangs too high for anyone to reach", "它挂得太高，谁也够不着"],
          [
            ["Nobody in the family likes apples", "家里没有人喜欢吃苹果"],
            ["It is too small and green to pick", "它太小、太青，不能摘"],
            ["Grandma wants to save it for tea", "奶奶想留着它配茶"],
          ],
          ["The fourth stanza says the apple was too far to reach, even with a ladder.", "第四节说，那个苹果太远了，连用梯子都够不着。"],
        ),
        ask(
          ["How does the season change during the poem?", "在这首诗里，季节是怎样变化的？"],
          ["From autumn to winter", "从秋天变到冬天"],
          [
            ["From spring to summer", "从春天变到夏天"],
            ["From summer to spring", "从夏天变到春天"],
            ["From winter to autumn", "从冬天变到秋天"],
          ],
          [
            "The poem starts with picking apples all autumn long and moves on to bare branches, winter wind, frost and sleet.",
            "这首诗一开始写整个秋天都在摘苹果，后来写到光秃秃的树枝、冬天的风、霜和雨夹雪。",
          ],
        ),
        ask(
          ["What does the speaker think the apple says at the end?", "结尾时，“我”觉得这个苹果在诉说什么？"],
          ["That the tree will bloom again after winter", "这棵树过了冬天还会再开花"],
          [
            ["That the blackbirds should go away", "黑鸟应该飞走"],
            ["That the ladder should be taller", "梯子应该更高一些"],
            ["That autumn will never end", "秋天永远不会结束"],
          ],
          [
            "The last stanza says the speaker will leave the apple as a small red winter sun to say the tree will bloom again.",
            "最后一节说，“我”要把这个苹果留着，让它像一个红红的冬日小太阳，诉说这棵树还会再开花。",
          ],
        ),
      ],
      ["Grandma's"],
    ),
  ],
};
