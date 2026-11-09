import type { ReadingUnitDef } from "@ga/content";
import { t } from "@ga/content";

import { clues, cluesAcademic } from "./topics.ts";

/** lifeOnTheNile is a reading unit of grades 3 to 5 on life in ancient Egypt along the Nile. */
export const lifeOnTheNile: ReadingUnitDef = {
  id: "life-on-the-nile",
  title: t("Life on the Nile", "尼罗河畔的生活"),
  passages: [
    {
      id: "a-river-in-the-desert",
      title: t("A River in the Desert", "沙漠中的河"),
      body: `Much of northern Africa is desert, hot and dry, with almost no rain. Yet thousands of years ago, one of the greatest civilizations in history grew up there. A civilization is a large group of people who share a way of life, with cities, leaders, laws and writing. This one was ancient Egypt.

How could so many people live in a desert? The answer is the Nile, one of the longest rivers in the world. The Nile flows north through Egypt to the sea. Along both of its banks lies a narrow strip of green land, sometimes only a few miles wide. Beyond that strip, the desert begins.

The ancient Egyptians called the green land along the river the Black Land, because of its dark, rich soil. They called the desert the Red Land.

Almost everyone in ancient Egypt lived in the Black Land, close to the river. The Nile gave them water to drink, fish to eat and a way to travel. Without the river, there would have been no Egypt at all.`,
      topics: [clues],
      names: ["Africa", "Egypt", "Nile", "Egyptians"],
      glossed: ["civilizations", "civilization"],
      xp: 4,
      questions: [
        {
          prompt: t("What is a civilization, according to the passage?", "根据文章，什么是文明？"),
          right: t(
            "A large group of people who share a way of life, with cities, leaders, laws and writing",
            "有城市、领袖、法律和文字，共享一种生活方式的一大群人",
          ),
          wrong: [
            t("A river that flows through a desert", "流经沙漠的河"),
            t("A strip of green land", "一片狭长的绿地"),
            t("A kind of dark soil", "一种黑色的土壤"),
          ],
          solution: t("The first paragraph explains the word right after using it.", "第一段在用到这个词之后紧接着解释了它。"),
        },
        {
          prompt: t("Why did the Egyptians call the land along the river the Black Land?", "埃及人为什么把河边的土地叫作“黑土地”？"),
          right: t("Because its soil was dark and rich", "因为那里的土壤又黑又肥沃"),
          wrong: [
            t("Because it was always night there", "因为那里总是黑夜"),
            t("Because it was covered in rocks", "因为那里遍布岩石"),
            t("Because no one lived there", "因为那里没人居住"),
          ],
          solution: t(
            "The third paragraph says they called it the Black Land because of its dark, rich soil.",
            "第三段说因为那里的土壤又黑又肥沃，所以叫“黑土地”。",
          ),
        },
        {
          prompt: t(
            'What does the writer mean by "Without the river, there would have been no Egypt at all"?',
            "作者说“Without the river, there would have been no Egypt at all”是什么意思？",
          ),
          right: t("People could only live in the desert because of the river", "人们之所以能在沙漠中生活，完全是因为这条河"),
          wrong: [
            t("The river made Egypt a rainy place", "这条河让埃及变得多雨"),
            t("Egypt was built under the river", "埃及建在河底下"),
            t("The Egyptians did not like the river", "埃及人不喜欢这条河"),
          ],
          solution: t(
            "The passage explains that the land around the river is desert and that the Nile gave people water, food and a way to travel.",
            "文章说明河周围都是沙漠，是尼罗河给了人们水、食物和交通。",
          ),
        },
      ],
    },
    {
      id: "the-flood",
      title: t("The Gift of the Flood", "洪水的馈赠"),
      body: `Every summer, something remarkable happened in ancient Egypt. Far to the south, heavy rains fell in the mountains where the Nile begins. All that water rushed north, and the river in Egypt began to rise.

By late summer, the Nile spilled over its banks and covered the fields beside it. For weeks, the farmland was under water. Villages were built on higher ground so that they stayed dry.

When the water finally went down in autumn, it left behind a layer of thick black mud. This mud was full of the minerals that crops need. It made the soil so rich that farmers could grow large harvests year after year without ever running out of good soil.

The Egyptians depended on the flood, and they watched it closely. A flood that was too low meant dry fields and not enough food. A flood that was too high could wash away homes. A good flood meant a good year.

Because the flood came at about the same time every year, the Egyptians used it to measure time. Their year began with the rising of the river.`,
      topics: [clues],
      names: ["Egypt", "Nile", "Egyptians"],
      xp: 4,
      questions: [
        {
          prompt: t("What caused the Nile to flood every summer?", "是什么让尼罗河每年夏天泛滥？"),
          right: t("Heavy rains in the mountains far to the south", "南方远处山区的大雨"),
          wrong: [
            t("Rain falling on Egypt's fields", "落在埃及田地上的雨"),
            t("Ice melting near the sea", "海边的冰融化"),
            t("Farmers opening their gates", "农民打开了闸门"),
          ],
          solution: t(
            "The first paragraph says heavy rains fell in the mountains far to the south, and the water rushed north.",
            "第一段说南方远处山区下大雨，雨水向北奔流。",
          ),
        },
        {
          prompt: t("Why was the mud the flood left behind important?", "洪水留下的淤泥为什么很重要？"),
          right: t("It was full of minerals that made the soil rich for crops", "它富含矿物质，让土壤肥沃，适合种庄稼"),
          wrong: [
            t("It was used to build boats", "它被用来造船"),
            t("It kept the villages dry", "它让村庄保持干燥"),
            t("It stopped the river from rising", "它阻止了河水上涨"),
          ],
          solution: t(
            "The third paragraph says the mud was full of the minerals crops need and made the soil rich.",
            "第三段说淤泥里有庄稼需要的矿物质，让土壤变得肥沃。",
          ),
        },
        {
          prompt: t("What did a flood that was too low mean?", "水位太低的洪水意味着什么？"),
          right: t("Dry fields and not enough food", "田地干旱，粮食不够"),
          wrong: [t("Homes washed away", "房屋被冲走"), t("A very good year", "一个好年景"), t("More fish in the river", "河里的鱼更多")],
          solution: t(
            "The fourth paragraph says a flood that was too low meant dry fields and not enough food.",
            "第四段说水位太低的洪水意味着田地干旱、粮食不够。",
          ),
        },
      ],
    },
    {
      id: "farming-by-the-river",
      title: t("Farming by the River", "河边的农耕"),
      body: `Most people in ancient Egypt were farmers. Their year followed the river, and it had three seasons.

The first season was the flood. While their fields were under water, farmers could not plant anything. Many of them worked on building projects for the king instead.

The second season began when the water went down. Farmers hurried to plow the soft, wet mud and plant their seeds. They grew wheat and barley to make bread, along with onions, beans and other vegetables. They also grew flax, a plant whose stems could be made into cloth.

The third season was the harvest. In spring, the farmers cut their crops and gathered them in. Then the land dried out under the hot sun until the next flood came.

Even with the flood's help, the fields far from the river needed more water. So farmers dug ditches, called canals, to carry water from the Nile to their fields. They used a simple machine, a long pole with a bucket on one end and a heavy weight on the other, to lift water from the river into the canals.`,
      topics: [clues],
      names: ["Egypt", "Nile"],
      glossed: ["flax", "canals", "barley"],
      xp: 4,
      questions: [
        {
          prompt: t("Why could farmers not plant during the first season?", "农民为什么在第一个季节不能播种？"),
          right: t("Their fields were under water", "他们的田地被水淹了"),
          wrong: [t("It was too cold", "天太冷了"), t("They had no seeds", "他们没有种子"), t("The king did not allow it", "国王不允许")],
          solution: t(
            "The second paragraph says that while their fields were under water, farmers could not plant anything.",
            "第二段说田地被水淹着的时候，农民什么也种不了。",
          ),
        },
        {
          prompt: t("What was flax used for?", "亚麻被用来做什么？"),
          right: t("Making cloth", "制作布料"),
          wrong: [t("Making bread", "做面包"), t("Building canals", "修建水渠"), t("Feeding fish", "喂鱼")],
          solution: t(
            "The third paragraph says flax is a plant whose stems could be made into cloth.",
            "第三段说亚麻是一种茎可以用来做布的植物。",
          ),
        },
        {
          prompt: t("What are canals, according to the passage?", "根据文章，canals 是什么？"),
          right: t("Ditches that carry water from the river to the fields", "把河水引到田里的沟渠"),
          wrong: [
            t("Boats that carry crops", "运送庄稼的船"),
            t("Machines that lift water", "提水的机器"),
            t("Fields far from the river", "离河很远的田地"),
          ],
          solution: t(
            "The last paragraph says farmers dug ditches, called canals, to carry water from the Nile to their fields.",
            "最后一段说农民挖了叫作 canals 的沟渠，把尼罗河的水引到田里。",
          ),
        },
      ],
    },
    {
      id: "the-pharaoh",
      title: t("The King of Egypt", "埃及的国王"),
      body: `The ruler of ancient Egypt was called the pharaoh. The pharaoh was much more than a king. The Egyptians believed that the pharaoh was a link between the people and their gods.

The pharaoh had many duties. He led the army in war. He made the laws. He owned much of the land, and he collected taxes from the farmers, often in the form of grain. The grain was stored in large buildings and handed out in years when the flood was poor.

The Egyptians believed that one of the pharaoh's most important jobs was to keep order in the world. When the flood came on time and the harvest was good, people saw it as a sign that the pharaoh was doing his job well.

No pharaoh could rule alone. Thousands of officials helped him. The most powerful was the vizier, who managed the government from day to day. Below the vizier were officials who collected taxes, judged arguments and planned building projects.

Most pharaohs were men, but a few women also ruled Egypt as pharaoh. They wore the same crowns and held the same power.`,
      topics: [clues],
      names: ["Egypt", "Egyptians"],
      glossed: ["pharaoh", "pharaohs", "pharaoh's", "vizier"],
      xp: 4,
      questions: [
        {
          prompt: t("What did the Egyptians believe about the pharaoh?", "埃及人对法老有什么看法？"),
          right: t("The pharaoh was a link between the people and their gods", "法老是人民与神之间的纽带"),
          wrong: [
            t("The pharaoh was just an ordinary farmer", "法老只是一个普通农民"),
            t("The pharaoh lived under the river", "法老住在河底"),
            t("The pharaoh had no duties", "法老没有职责"),
          ],
          solution: t(
            "The first paragraph says the Egyptians believed the pharaoh was a link between the people and their gods.",
            "第一段说埃及人认为法老是人民与神之间的纽带。",
          ),
        },
        {
          prompt: t("Why was grain stored in large buildings?", "为什么要把粮食储存在大仓库里？"),
          right: t("So it could be handed out in years when the flood was poor", "以便在洪水不好的年份分发"),
          wrong: [
            t("So the pharaoh could eat it all", "让法老一个人吃"),
            t("So farmers could plant it in the desert", "让农民种在沙漠里"),
            t("So the army could sell it", "让军队卖掉"),
          ],
          solution: t(
            "The second paragraph says the grain was stored and handed out in years when the flood was poor.",
            "第二段说粮食被储存起来，在洪水不好的年份分发。",
          ),
        },
        {
          prompt: t("Who was the vizier?", "维齐尔（vizier）是谁？"),
          right: t("The most powerful official, who managed the government day to day", "最有权力的官员，负责管理日常政务"),
          wrong: [t("The pharaoh's son", "法老的儿子"), t("A god of the river", "河神"), t("A farmer who paid taxes", "交税的农民")],
          solution: t(
            "The fourth paragraph says the most powerful official was the vizier, who managed the government from day to day.",
            "第四段说最有权力的官员是维齐尔，他负责管理日常政务。",
          ),
        },
      ],
    },
    {
      id: "the-pyramids",
      title: t("Mountains Made by People", "人造的山"),
      body: `The pyramids of Egypt are some of the most famous buildings in the world. They were built as tombs, places to bury the dead. Each great pyramid was made for a pharaoh.

The largest is the Great Pyramid at Giza. It was built more than four thousand years ago for a pharaoh named Khufu. It is made of more than two million blocks of stone. Many of the blocks weigh more than a car. For thousands of years, it was the tallest building on Earth.

How did people build such a thing without machines? No one knows every detail, but there is good evidence for much of it. Workers cut the blocks with copper tools and moved them on wooden sleds. They poured water on the sand in front of the sleds, which made the sand firm and the sleds easier to pull. Long ramps of mud and stone let them drag the blocks higher and higher.

The builders were not slaves, as people once thought. Many were skilled workers who were paid in bread and beer. Others were farmers who came to work during the flood season, when their fields were under water.`,
      topics: [clues, cluesAcademic],
      names: ["Egypt", "Giza", "Khufu", "Earth"],
      glossed: ["pyramids", "pyramid", "tombs"],
      xp: 5,
      questions: [
        {
          prompt: t("What were the pyramids built for?", "金字塔是为了什么而建造的？"),
          right: t("As tombs for pharaohs", "作为法老的陵墓"),
          wrong: [
            t("As homes for workers", "作为工人的住所"),
            t("As places to store grain", "作为储存粮食的地方"),
            t("As towers to watch the flood", "作为观察洪水的塔"),
          ],
          solution: t(
            "The first paragraph says the pyramids were built as tombs, and each great pyramid was made for a pharaoh.",
            "第一段说金字塔是作为陵墓建造的，每座大金字塔都是为一位法老而建。",
          ),
        },
        {
          prompt: t("Why did workers pour water on the sand in front of the sleds?", "工人为什么要在雪橇前面的沙子上泼水？"),
          right: t("It made the sand firm and the sleds easier to pull", "这让沙子变得结实，雪橇更容易拉动"),
          wrong: [
            t("It cooled the workers", "这能给工人降温"),
            t("It washed the blocks clean", "这能把石块洗干净"),
            t("It helped plants grow", "这能帮助植物生长"),
          ],
          solution: t(
            "The third paragraph says the water made the sand firm and the sleds easier to pull.",
            "第三段说泼水让沙子变得结实，雪橇更容易拉动。",
          ),
        },
        {
          prompt: t("Which statement about the builders is supported by the passage?", "关于建造者，哪一项说法得到了文章的支持？"),
          right: t("Many were paid workers, and some were farmers during the flood season", "很多是有报酬的工人，有些是洪水季节的农民"),
          wrong: [
            t("They were all slaves", "他们全都是奴隶"),
            t("They used modern machines", "他们使用现代机器"),
            t("They were all pharaohs", "他们全都是法老"),
          ],
          solution: t(
            "The last paragraph says the builders were not slaves; many were skilled paid workers and others were farmers during the flood.",
            "最后一段说建造者不是奴隶；很多是有报酬的熟练工人，其他的是洪水季节来干活的农民。",
          ),
        },
      ],
    },
    {
      id: "writing-in-pictures",
      title: t("Writing in Pictures", "用图画写字"),
      body: `The ancient Egyptians had one of the first writing systems in the world. Their writing is called hieroglyphs. Hieroglyphs are small pictures. Some pictures stand for whole words, such as a drawing of the sun meaning "sun". Others stand for sounds, the way the letters of our alphabet do. Egyptian writing used more than seven hundred different signs.

Learning to write took many years, so only a few people could do it. These trained writers were called scribes. Scribes kept records of taxes, harvests and the stores of grain. They wrote letters and laws for the pharaoh. Being a scribe was a respected job, and scribes did not have to do hard work in the fields.

Scribes wrote with reed brushes and ink on a kind of paper called papyrus. Papyrus was made from a tall plant that grew along the Nile. Workers cut its stems into thin strips, laid them side by side in layers, pressed them flat and let them dry into sheets.

For hundreds of years after Egypt's civilization ended, no one could read hieroglyphs. Then, about two hundred years ago, scholars compared the same message written in hieroglyphs and in Greek on one stone, and at last they cracked the code.`,
      topics: [clues, cluesAcademic],
      names: ["Egyptians", "Egyptian", "Nile", "Egypt's", "Greek"],
      glossed: ["hieroglyphs", "scribes", "scribe", "papyrus", "reed"],
      xp: 5,
      questions: [
        {
          prompt: t("What are hieroglyphs?", "什么是象形文字（hieroglyphs）？"),
          right: t("Small pictures used as writing", "用作文字的小图画"),
          wrong: [
            t("Letters of our alphabet", "我们字母表中的字母"),
            t("Sheets of paper", "纸张"),
            t("Brushes made from reeds", "芦苇做的笔"),
          ],
          solution: t(
            "The first paragraph says Egyptian writing is called hieroglyphs, and hieroglyphs are small pictures.",
            "第一段说埃及文字叫作象形文字，象形文字就是小图画。",
          ),
        },
        {
          prompt: t("Why could only a few people write?", "为什么只有少数人会写字？"),
          right: t("Learning to write took many years", "学写字要花很多年"),
          wrong: [
            t("The pharaoh did not allow writing", "法老不允许写字"),
            t("There was no paper", "那时没有纸"),
            t("Writing was only done in the fields", "只能在田里写字"),
          ],
          solution: t(
            "The second paragraph says learning to write took many years, so only a few people could do it.",
            "第二段说学写字要花很多年，所以只有少数人会写。",
          ),
        },
        {
          prompt: t("How were scholars at last able to read hieroglyphs?", "学者们最后是怎样读懂象形文字的？"),
          right: t("They compared the same message written in hieroglyphs and in Greek", "他们比较了用象形文字和希腊文写的同一段内容"),
          wrong: [
            t("A scribe taught them", "一位书吏教了他们"),
            t("They found a dictionary in a pyramid", "他们在金字塔里找到了一本字典"),
            t("They guessed from the pictures alone", "他们只凭图画猜测"),
          ],
          solution: t(
            "The last paragraph says scholars compared the same message in hieroglyphs and in Greek on one stone.",
            "最后一段说学者们比较了同一块石头上用象形文字和希腊文写的同一段内容。",
          ),
        },
      ],
    },
    {
      id: "boats-on-the-nile",
      title: t("Boats on the Nile", "尼罗河上的船"),
      body: `In ancient Egypt, the Nile was the main road. There were few roads across the desert, and carrying heavy loads over sand was slow and hard. On the river, a boat could carry people and goods from one end of the country to the other.

The Nile had a special gift for sailors. The river flows from south to north. But the wind in Egypt usually blows from north to south. So a boat going north could simply float with the current. A boat going south could raise its sail and let the wind push it up the river against the current. In Egyptian writing, the sign for traveling north was a boat with its sail down, and the sign for traveling south was a boat with its sail up.

The earliest boats were made from bundles of papyrus stems tied together. Later, Egyptians built large wooden boats. Some carried huge blocks of stone for pyramids and temples. Others carried grain, cattle and other goods to trade.

The river connected the whole country. A message, a load of grain or an army could travel along it faster than any other way.`,
      topics: [clues],
      names: ["Egypt", "Nile", "Egyptian", "Egyptians"],
      xp: 4,
      questions: [
        {
          prompt: t("Why was the Nile the main road of Egypt?", "尼罗河为什么是埃及的主要道路？"),
          right: t("Carrying heavy loads over the desert was slow and hard", "在沙漠里运送重物又慢又难"),
          wrong: [
            t("There was no water in the river", "河里没有水"),
            t("Boats were not allowed on land roads", "陆路上不准用船"),
            t("The pharaoh lived on a boat", "法老住在船上"),
          ],
          solution: t(
            "The first paragraph says there were few roads across the desert and carrying heavy loads over sand was slow and hard.",
            "第一段说穿越沙漠的道路很少，在沙地上运送重物又慢又难。",
          ),
        },
        {
          prompt: t("How did a boat travel south on the Nile?", "船怎样在尼罗河上向南航行？"),
          right: t("It raised its sail so the wind could push it against the current", "它扬起帆，让风推着它逆流而上"),
          wrong: [
            t("It floated with the current", "它顺流漂浮"),
            t("People pulled it along the bank", "人们在岸边拉着它"),
            t("It used a motor", "它用发动机"),
          ],
          solution: t(
            "The second paragraph says the wind blows from north to south, so a boat going south raised its sail.",
            "第二段说风从北往南吹，所以向南的船会扬起帆。",
          ),
        },
        {
          prompt: t("In this passage, what does *current* mean?", "这篇文章中的 *current* 是什么意思？"),
          right: t("The flow of the river's water", "河水的流动"),
          wrong: [t("Happening now", "现在发生的"), t("A kind of sail", "一种帆"), t("The wind from the north", "北风")],
          solution: t(
            "The second paragraph says the river flows from south to north and a boat going north could float with the current, so current means the water's flow.",
            "第二段说河水从南向北流，向北的船可以随 current 漂浮，所以 current 指水流。",
          ),
        },
      ],
    },
    {
      id: "a-day-in-a-village",
      title: t("A Day in a Village", "村庄里的一天"),
      body: `Most Egyptians did not live in palaces or cities. They lived in small farming villages near the river.

Their houses were made of mud bricks. Villagers mixed mud from the river with straw, pressed it into wooden molds and left the bricks to dry hard in the sun. Thick mud walls kept houses cool during the hot days. Many families slept on the flat roof on summer nights, when it was cooler outside than in.

The day began early. Men usually worked in the fields or at a trade, such as making pots or baskets. Women ran the household, and many also worked as weavers, bakers or sellers at the market. Egyptian women could own land and run businesses, which was rare in the ancient world.

Children helped as soon as they were old enough. They fetched water, scared birds away from the crops and looked after younger brothers and sisters. They also played. Archaeologists, scientists who study how people lived long ago by digging up what they left behind, have found balls, spinning tops and toy animals in Egyptian villages.

Bread and beer were the main foods, with onions, beans, fish and fruit. Meat was a treat for special days.`,
      topics: [clues],
      names: ["Egyptians", "Egyptian"],
      glossed: ["archaeologists", "weavers"],
      xp: 4,
      questions: [
        {
          prompt: t("Why did many families sleep on the roof on summer nights?", "为什么很多家庭夏天晚上睡在屋顶上？"),
          right: t("It was cooler outside than inside", "外面比屋里凉快"),
          wrong: [
            t("Their houses had no beds", "他们的房子里没有床"),
            t("They watched for the flood", "他们在观察洪水"),
            t("The roof was made of straw", "屋顶是稻草做的"),
          ],
          solution: t(
            "The second paragraph says they slept on the roof on summer nights, when it was cooler outside than in.",
            "第二段说他们夏天晚上睡在屋顶上，因为那时外面比屋里凉快。",
          ),
        },
        {
          prompt: t("What does the passage say was rare in the ancient world?", "文章说在古代世界中什么是罕见的？"),
          right: t("Women owning land and running businesses", "女性拥有土地和经营生意"),
          wrong: [
            t("Children playing with toys", "孩子玩玩具"),
            t("People eating bread", "人们吃面包"),
            t("Houses made of mud bricks", "泥砖造的房子"),
          ],
          solution: t(
            "The third paragraph says Egyptian women could own land and run businesses, which was rare in the ancient world.",
            "第三段说埃及女性可以拥有土地和经营生意，这在古代世界很少见。",
          ),
        },
        {
          prompt: t("What do archaeologists do?", "考古学家做什么？"),
          right: t("Study how people lived long ago by digging up what they left behind", "通过挖掘古人留下的东西来研究他们的生活"),
          wrong: [
            t("Make mud bricks", "制作泥砖"),
            t("Sell goods at the market", "在市场上卖东西"),
            t("Build houses for villages", "为村庄建房子"),
          ],
          solution: t(
            "The fourth paragraph explains the word right after it: scientists who study how people lived long ago by digging up what they left behind.",
            "第四段紧接着解释了这个词：通过挖掘古人留下的东西来研究他们生活的科学家。",
          ),
        },
      ],
    },
    {
      id: "gods-and-temples",
      title: t("Gods and Temples", "神与神庙"),
      body: `The ancient Egyptians believed in many gods. Each god cared for a different part of life. One god was linked with the sun, another with the river's flood, and others with writing, healing or the harvest. Egyptians often showed their gods with human bodies and the heads of animals, such as a falcon or a cat.

The Egyptians built great temples as homes for their gods. Inside the deepest room of each temple stood a statue of the god. Only priests were allowed in that room. Each morning, priests washed and dressed the statue and brought it food, the way a servant would care for a king.

Ordinary people did not usually enter the temple. They prayed at small shrines in their homes and took part in festivals. On festival days, priests carried the god's statue out of the temple in a small boat on poles, and crowds gathered to watch it pass.

Temples were also important places of work. They owned farms, stored grain and employed bakers, builders and scribes. A large temple was almost like a town of its own.`,
      topics: [clues],
      names: ["Egyptians"],
      glossed: ["priests", "shrines", "falcon"],
      xp: 4,
      questions: [
        {
          prompt: t("Why did the Egyptians build temples?", "埃及人为什么要建造神庙？"),
          right: t("As homes for their gods", "作为神的居所"),
          wrong: [
            t("As homes for farmers", "作为农民的住所"),
            t("As tombs for pharaohs", "作为法老的陵墓"),
            t("As markets for trade", "作为交易的市场"),
          ],
          solution: t(
            "The second paragraph says the Egyptians built great temples as homes for their gods.",
            "第二段说埃及人建造宏伟的神庙作为神的居所。",
          ),
        },
        {
          prompt: t("How did priests care for the statue each morning?", "祭司每天早上怎样照料神像？"),
          right: t("They washed it, dressed it and brought it food", "给它清洗、穿衣，并带来食物"),
          wrong: [
            t("They carried it to the market", "把它抬到市场上"),
            t("They painted it a new color", "给它涂上新颜色"),
            t("They hid it from the pharaoh", "把它藏起来不让法老看见"),
          ],
          solution: t(
            "The second paragraph says priests washed and dressed the statue and brought it food each morning.",
            "第二段说祭司每天早上给神像清洗、穿衣，并带来食物。",
          ),
        },
        {
          prompt: t(
            'Why does the writer say a large temple was "almost like a town of its own"?',
            "作者为什么说大神庙“almost like a town of its own”？",
          ),
          right: t("It owned farms, stored grain and employed many kinds of workers", "它拥有农场、储存粮食，还雇用各种工人"),
          wrong: [
            t("Everyone in Egypt lived inside it", "埃及所有人都住在里面"),
            t("It had its own pharaoh", "它有自己的法老"),
            t("It was built in the desert far from people", "它建在远离人群的沙漠里"),
          ],
          solution: t(
            "The last paragraph says temples owned farms, stored grain and employed bakers, builders and scribes.",
            "最后一段说神庙拥有农场、储存粮食，并雇用面包师、建筑工和书吏。",
          ),
        },
      ],
    },
    {
      id: "what-egypt-left-us",
      title: t("What Egypt Left Us", "埃及留给我们的"),
      body: `Ancient Egypt lasted for about three thousand years. That is longer than many other civilizations have existed. Its people left behind more than pyramids and temples. Many of their ideas are still with us today.

Because they needed to know when the flood would come, Egyptians studied the sky and made a calendar of 365 days, divided into twelve months. Our calendar today is based partly on theirs.

To measure fields after the flood washed away the old borders, Egyptian scribes became skilled at math. They could estimate the area of a field and the amount of grain a storehouse could hold. To build pyramids with straight sides, they had to measure angles and distances with great care.

Egyptian doctors were famous in the ancient world. Their writings describe how to set broken bones, care for wounds and treat many illnesses.

When we compare our lives with the lives of people along the Nile long ago, we may find that they are not so different. They farmed, traded, wrote, built and played. And like us, they depended on water. Their whole civilization was a gift of the river.`,
      topics: [clues, cluesAcademic],
      names: ["Egypt", "Egyptians", "Egyptian", "Nile"],
      xp: 5,
      questions: [
        {
          prompt: t("Why did the Egyptians make a calendar?", "埃及人为什么要制定历法？"),
          right: t("They needed to know when the flood would come", "他们需要知道洪水什么时候来"),
          wrong: [
            t("To count the pyramids", "为了数金字塔"),
            t("To plan festivals for doctors", "为了给医生安排节日"),
            t("To measure angles", "为了测量角度"),
          ],
          solution: t(
            "The second paragraph says they studied the sky because they needed to know when the flood would come.",
            "第二段说他们研究天空是因为需要知道洪水什么时候到来。",
          ),
        },
        {
          prompt: t("What does the word *estimate* mean in the third paragraph?", "第三段中的 *estimate* 是什么意思？"),
          right: t("Work out about how large or how much something is", "估算某物大约有多大或多少"),
          wrong: [t("Wash away a border", "冲走边界"), t("Build a storehouse", "建造仓库"), t("Write a letter", "写信")],
          solution: t(
            "The scribes use it to find the area of a field and how much grain a storehouse holds, which is working out an amount.",
            "书吏用它来求田地的面积和仓库能装多少粮食，也就是估算数量。",
          ),
        },
        {
          prompt: t("What is the main idea of the passage?", "这篇文章的主要意思是什么？"),
          right: t(
            "Ancient Egypt left ideas we still use, and its life depended on the river",
            "古埃及留下了我们至今仍在使用的思想，它的生活依赖于这条河",
          ),
          wrong: [
            t("Egyptian doctors were better than doctors today", "埃及医生比现在的医生好"),
            t("Ancient Egypt lasted only a short time", "古埃及只存在了很短时间"),
            t("The Egyptians never studied the sky", "埃及人从不研究天空"),
          ],
          solution: t(
            "The passage lists the calendar, math and medicine that Egypt left us, and the last paragraph ties them back to the river.",
            "文章列举了埃及留给我们的历法、数学和医学，最后一段又回到了这条河。",
          ),
        },
      ],
    },
  ],
};
