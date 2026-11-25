// Grade 2: the reading units of the course, one for each theme: stories, fables, a letter and texts of facts, in words
// a second grader can sound out or knows by sight, three questions each.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage, words } from "../grade-3/reading-kit.ts";

const parts = words("beginning-middle-and-end", 0.3);
const topic = words("the-main-topic-of-a-text", 0.3);
const feel = words("how-characters-feel", 0.3);

/** longAgoAndToday is the reading unit of grade 2 on how life has changed. */
export const longAgoAndToday: ReadingUnitDef = {
  id: "long-ago-and-today",
  title: t("Long Ago and Today", "过去和现在"),
  passages: [
    passage(
      "toys-long-ago",
      t("Toys Long Ago", "过去的玩具"),
      `Long ago, children did not have toys that beeped or lit up. Most toys were made by hand, from wood, cloth or string. A mother might make a ball from old cloth.

A child might have a wooden top. You wound a string around it and pulled hard, and the top spun on the floor. Girls and boys played with dolls made of rags. Some children rolled a metal hoop down the road with a stick to see how far it could go.

Children also played games that needed no toys at all, such as tag and hide and seek. Today we have many new toys, but children still love to play the same old games.`,
      [topic],
      [
        ask(
          ["What were most toys made from long ago?", "过去的玩具大多是用什么做的？"],
          ["Wood, cloth or string", "木头、布或绳子"],
          [
            ["Plastic and glass", "塑料和玻璃"],
            ["Paper and glue", "纸和胶水"],
            ["Lights and wires", "灯和电线"],
          ],
          ["The text says most toys were made by hand, from wood, cloth or string.", "短文说过去的玩具大多是用木头、布或绳子手工做的。"],
          [
            [
              "Plastic and glass are not in the text. Long-ago toys were made from wood, cloth or string.",
              "文中没有塑料和玻璃。从前的玩具是用木头、布或绳子做的。",
            ],
            ["Paper and glue are not named. The text lists wood, cloth and string.", "文中没提纸和胶水，列出的是木头、布和绳子。"],
            [
              "Lights and wires are the opposite. The first line says toys did not beep or light up.",
              "灯和电线正好相反。第一句就说那时的玩具不会响也不会亮。",
            ],
          ],
        ),
        ask(
          ["How did a child make a top spin?", "孩子怎样让陀螺转起来？"],
          ["By winding a string around it and pulling hard", "把绳子绕在上面再用力一拉"],
          [
            ["By pushing a button", "按一个按钮"],
            ["By rolling it with a stick", "用棍子滚它"],
            ["By blowing on it", "对着它吹气"],
          ],
          ["The text says you wound a string around the top and pulled hard.", "短文说要把绳子绕在陀螺上，再用力一拉。"],
          [
            ["Pushing a button is how a toy works today. A top had no buttons.", "按按钮是今天玩具的玩法，陀螺没有按钮。"],
            ["Rolling with a stick is how children moved the metal hoop, not the top.", "用棍子滚的是铁环，不是陀螺。"],
            ["Blowing on it is not in the text. You wound a string and pulled.", "文中没有吹。要绕上绳子再用力拉。"],
          ],
        ),
        ask(
          ["What is the text mostly about?", "这篇短文主要讲什么？"],
          ["How children played long ago", "过去的孩子怎样玩耍"],
          [
            ["How to make a doll", "怎样做布娃娃"],
            ["Toys that light up", "会发光的玩具"],
            ["A game of tag at school", "学校里的一场捉人游戏"],
          ],
          ["Every part tells about the toys and games of children long ago.", "每一部分都在讲过去孩子们的玩具和游戏。"],
          [
            ["Making a doll is only one small detail, about rag dolls.", "做娃娃只是一个小细节，讲的是布娃娃。"],
            ["Toys that light up are what children did not have, so that is not the topic.", "会发光的玩具是从前的孩子没有的，不是主题。"],
            ["Tag at school is just one game named near the end.", "在学校玩捉人只是结尾提到的一个游戏。"],
          ],
        ),
        ask(
          ["What kind of toys did children not have long ago?", "很久以前孩子们没有什么样的玩具？"],
          ["Toys that beeped or lit up", "会哔哔响或会发光的玩具"],
          [
            ["Toys made of wood", "木头做的玩具"],
            ["Dolls made of rags", "布条做的娃娃"],
            ["Toys made by hand", "手工做的玩具"],
          ],
          ["The text says long ago, children did not have toys that beeped or lit up.", "短文说很久以前孩子们没有会哔哔响或会发光的玩具。"],
          [
            ["Toys made of wood are what children did have.", "木头玩具是那时孩子有的。"],
            ["Rag dolls are named as toys children played with.", "布娃娃是文中说孩子们玩过的玩具。"],
            ["Toys made by hand are what most toys were long ago.", "手工做的玩具正是从前大多数的玩具。"],
          ],
        ),
        ask(
          ["How were most toys made long ago?", "很久以前大多数玩具是怎样做的？"],
          ["By hand", "手工做的"],
          [
            ["In big factories", "在大工厂里"],
            ["By computers", "用电脑做的"],
            ["From plastic", "用塑料做的"],
          ],
          ['The text says, "Most toys were made by hand."', "短文说：“大多数玩具是手工做的。”"],
          [
            ["Big factories are not in the text. Toys were made by hand.", "文中没有大工厂。玩具是手工做的。"],
            ["Computers did not exist in these long-ago times.", "在那个年代还没有电脑。"],
            ["Plastic is not named. Toys were made from wood, cloth or string.", "文中没提塑料。玩具是用木头、布或绳子做的。"],
          ],
        ),
        ask(
          ["Where did the top spin?", "陀螺在哪里转？"],
          ["On the floor", "在地板上"],
          [
            ["On the table", "在桌子上"],
            ["In the air", "在空中"],
            ["On the road", "在路上"],
          ],
          ["The text says the top spun on the floor.", "短文说陀螺在地板上转。"],
          [
            ["The table is not named. The top spun on the floor.", "文中没提桌子。陀螺在地板上转。"],
            ["In the air is wrong. The top spun on the floor.", "在空中不对。陀螺在地板上转。"],
            ["The road is where children rolled the hoop, not the top.", "马路是孩子们滚铁环的地方，不是转陀螺的地方。"],
          ],
        ),
        ask(
          ["What were the dolls made of?", "娃娃是用什么做的？"],
          ["Rags", "布条"],
          [
            ["Metal", "金属"],
            ["String", "绳子"],
            ["Paper", "纸"],
          ],
          ["The text says girls and boys played with dolls made of rags.", "短文说男孩女孩都玩布条做的娃娃。"],
          [
            ["Metal is what the hoop was made of, not the dolls.", "金属是铁环的材料，不是娃娃的。"],
            ["String is what you wound around the top.", "绳子是绕在陀螺上的。"],
            ["Paper is not named. Dolls were made of rags.", "文中没提纸。娃娃是用碎布做的。"],
          ],
        ),
        ask(
          ["What did some children roll down the road?", "有些孩子在路上滚什么？"],
          ["A metal hoop", "一个铁环"],
          [
            ["A wooden top", "一个木陀螺"],
            ["A ball", "一个球"],
            ["A doll", "一个娃娃"],
          ],
          ["Some children rolled a metal hoop down the road with a stick.", "有些孩子用棍子在路上滚铁环。"],
          [
            ["A wooden top spun on the floor. It was not rolled down the road.", "木陀螺在地板上转，不是在路上滚。"],
            [
              "A ball is named, but as a mother's handmade toy, not rolled down the road.",
              "文中提到了球，但那是妈妈手工做的，不是在路上滚的。",
            ],
            ["A doll is a rag toy to hold, not to roll down the road.", "娃娃是抱着玩的布玩具，不是在路上滚的。"],
          ],
        ),
        ask(
          ["Which game needed no toys at all?", "哪种游戏完全不需要玩具？"],
          ["Hide and seek", "捉迷藏"],
          [
            ["Spinning a top", "转陀螺"],
            ["Rolling a hoop", "滚铁环"],
            ["Playing with dolls", "玩娃娃"],
          ],
          ["The text names tag and hide and seek as games that needed no toys.", "短文说捉人游戏和捉迷藏是不需要玩具的游戏。"],
          [
            ["Spinning a top needs a top and a string.", "转陀螺需要陀螺和绳子。"],
            ["Rolling a hoop needs a hoop and a stick.", "滚铁环需要铁环和棍子。"],
            ["Playing with dolls needs dolls.", "玩娃娃需要娃娃。"],
          ],
        ),
        ask(
          ["What do children still love today?", "今天孩子们仍然喜欢什么？"],
          ["Playing the same old games", "玩同样的老游戏"],
          [
            ["Rolling metal hoops", "滚铁环"],
            ["Only new toys", "只喜欢新玩具"],
            ["Making tops", "做陀螺"],
          ],
          ["The text says children still love to play the same old games.", "短文说孩子们仍然喜欢玩同样的老游戏。"],
          [
            [
              "Rolling metal hoops is a long-ago game, not what the text says children still love.",
              "滚铁环是从前的游戏，文中没说现在的孩子还喜欢。",
            ],
            ["Only new toys is wrong. The text says children still love the old games.", "只喜欢新玩具不对。文中说孩子们仍然喜欢老游戏。"],
            ["Making tops is not in the text.", "文中没有做陀螺。"],
          ],
        ),
      ],
    ),
    passage(
      "grans-school-days",
      t("Gran's School Days", "奶奶的上学时光"),
      `When my gran was seven, she went to a school with just one room. All the children sat in that room, from the little ones to the big ones. There was only one teacher for all of them. The big children helped the little ones learn to read.

Gran walked to school every day, even in the snow. She carried her lunch in a tin pail. In winter, the children took turns bringing wood for the stove that kept the room warm.

Gran wrote on a small slate with a piece of chalk. When she made a mistake, she wiped it off with a cloth. "We did not have much," Gran told me, "but we learned a lot, and we had fun."`,
      [topic, feel],
      [
        ask(
          ["How many rooms did Gran's school have?", "奶奶的学校有几间教室？"],
          ["Just one", "只有一间"],
          [
            ["Two", "两间"],
            ["Ten", "十间"],
            ["A room for each grade", "每个年级一间"],
          ],
          ["The text says Gran went to a school with just one room.", "短文说奶奶上的学校只有一间教室。"],
          [
            ["Two is wrong. The school had just one room.", "两间不对。学校只有一间教室。"],
            ["Ten is far too many. It was a one-room school.", "十间太多了。那是只有一间教室的学校。"],
            [
              "A room for each grade is the opposite. All the children sat in one room.",
              "每个年级一间正好相反。所有孩子都坐在一间教室里。",
            ],
          ],
        ),
        ask(
          ["What kept the room warm in winter?", "冬天什么让教室保持温暖？"],
          ["A stove that burned wood", "烧木柴的炉子"],
          [
            ["Lots of blankets", "很多毯子"],
            ["The sun", "太阳"],
            ["A big fire outside", "外面的一大堆火"],
          ],
          ["The children brought wood for the stove that kept the room warm.", "孩子们轮流带木柴来烧炉子，让教室保持温暖。"],
          [
            ["Lots of blankets are not in the text. A wood stove kept them warm.", "文中没有很多毯子。是烧木头的炉子让他们暖和。"],
            ["The sun is not named. The children brought wood for the stove.", "文中没提太阳。孩子们带木柴烧炉子。"],
            ["A big fire outside is wrong. The stove was inside the room.", "外面的大火不对。炉子在教室里。"],
          ],
        ),
        ask(
          ["How does Gran feel about her school days?", "奶奶对她的上学时光有什么感受？"],
          ["Glad, because they learned a lot and had fun", "很高兴，因为他们学到了很多，也很快乐"],
          [
            ["Angry, because the walk was long", "很生气，因为路很远"],
            ["Sad, because she had no friends", "很难过，因为她没有朋友"],
            ["Scared of the teacher", "害怕老师"],
          ],
          ["Gran says they did not have much, but they learned a lot and had fun.", "奶奶说他们东西不多，但学到了很多，也很快乐。"],
          [
            [
              "Angry about the walk is wrong. Gran walked even in snow and does not complain.",
              "因为路远而生气不对。奶奶即使下雪也走路上学，没有抱怨。",
            ],
            ["Having no friends is not said. She says they had fun.", "文中没说没有朋友。她说他们过得很开心。"],
            ["Scared of the teacher is not in the text.", "文中没说怕老师。"],
          ],
        ),
        ask(
          ["How old was Gran when she went to the school?", "奶奶上那所学校时几岁？"],
          ["Seven", "七岁"],
          [
            ["Five", "五岁"],
            ["Ten", "十岁"],
            ["Twelve", "十二岁"],
          ],
          [
            'The text says, "When my gran was seven, she went to a school with just one room."',
            "短文说：“我奶奶七岁时，上了一所只有一个教室的学校。”",
          ],
          [
            ["Five is wrong. The first line says Gran was seven.", "五岁不对。第一句说奶奶七岁。"],
            ["Ten is wrong. Gran was seven.", "十岁不对。奶奶七岁。"],
            ["Twelve is too old. She was seven.", "十二岁太大了。她七岁。"],
          ],
        ),
        ask(
          ["How many teachers did the school have?", "学校有几位老师？"],
          ["Only one", "只有一位"],
          [
            ["Two", "两位"],
            ["One for each class", "每个班一位"],
            ["None", "一位也没有"],
          ],
          ['The text says, "There was only one teacher for all of them."', "短文说：“所有孩子只有一位老师。”"],
          [
            ["Two is wrong. There was only one teacher for all of them.", "两位不对。全校只有一位老师。"],
            [
              "One for each class is wrong. All the children were in one class with one teacher.",
              "每班一位不对。所有孩子在同一个班，只有一位老师。",
            ],
            ["None is wrong. There was one teacher, and big children helped too.", "没有老师不对。有一位老师，大孩子也会帮忙。"],
          ],
        ),
        ask(
          ["How did Gran get to school?", "奶奶怎样去上学？"],
          ["She walked", "走路去"],
          [
            ["She rode a bus", "坐公共汽车"],
            ["Her dad drove her", "爸爸开车送她"],
            ["She rode a horse", "骑马去"],
          ],
          ['The text says, "Gran walked to school every day, even in the snow."', "短文说：“奶奶每天走路上学，下雪天也是。”"],
          [
            ["A bus is not in the text. Gran walked every day.", "文中没有公交车。奶奶每天走路。"],
            ["Her dad driving her is not in the text.", "文中没有爸爸开车送她。"],
            ["A horse is not in the text. She walked, even in the snow.", "文中没有马。她走路上学，下雪也一样。"],
          ],
        ),
        ask(
          ["What did Gran carry her lunch in?", "奶奶用什么装午饭？"],
          ["A tin pail", "一个铁皮桶"],
          [
            ["A paper bag", "一个纸袋"],
            ["A lunch box", "一个饭盒"],
            ["A basket", "一个篮子"],
          ],
          ["The text says she carried her lunch in a tin pail.", "短文说她用铁皮桶装午饭。"],
          [
            ["A paper bag is not named. She used a tin pail.", "文中没提纸袋。她用的是铁皮桶。"],
            ["A lunch box is the modern word. Gran's lunch was in a tin pail.", "饭盒是现在的说法。奶奶的午饭装在铁皮桶里。"],
            ["A basket is not named.", "文中没提篮子。"],
          ],
        ),
        ask(
          ["What did the children take turns bringing in winter?", "冬天孩子们轮流带什么？"],
          ["Wood for the stove", "生炉子用的木柴"],
          [
            ["Chalk", "粉笔"],
            ["Lunch for the teacher", "给老师的午饭"],
            ["Snow", "雪"],
          ],
          ["In winter, the children took turns bringing wood for the stove.", "冬天，孩子们轮流带木柴来生炉子。"],
          [
            ["Chalk is what Gran wrote with, not what they brought for winter.", "粉笔是奶奶写字用的，不是冬天带的东西。"],
            ["Lunch for the teacher is not in the text.", "文中没有给老师带午饭。"],
            ["Snow is outside. They brought wood to keep warm.", "雪在外面。他们带木柴来取暖。"],
          ],
        ),
        ask(
          ["What did Gran write on?", "奶奶在什么上写字？"],
          ["A small slate", "一块小石板"],
          [
            ["Paper", "纸"],
            ["A big board", "一块大黑板"],
            ["The wall", "墙上"],
          ],
          ["Gran wrote on a small slate with a piece of chalk.", "奶奶用粉笔在一块小石板上写字。"],
          [
            ["Paper is not named. She wrote on a slate.", "文中没提纸。她在石板上写字。"],
            ["A big board is not in the text. Her slate was small.", "文中没有大黑板。她的石板很小。"],
            ["The wall is not in the text.", "文中没有墙。"],
          ],
        ),
        ask(
          ["What did Gran do when she made a mistake?", "奶奶写错时怎么办？"],
          ["She wiped it off with a cloth", "她用布擦掉"],
          [
            ["She threw the slate away", "她把石板扔了"],
            ["She asked for a new slate", "她要了一块新石板"],
            ["She left it there", "她就留着不管"],
          ],
          ["When she made a mistake, she wiped it off with a cloth.", "她写错时，就用布擦掉。"],
          [
            ["Throwing the slate away is wrong. She wiped the mistake off.", "扔掉石板不对。她把错的擦掉了。"],
            ["Asking for a new slate is not in the text.", "文中没有要新石板。"],
            ["Leaving it there is wrong. She wiped it with a cloth.", "留着不改不对。她用布擦掉了。"],
          ],
        ),
      ],
    ),
    passage(
      "how-we-get-light",
      t("How We Get Light", "我们怎样获得光亮"),
      `What do you do when it gets dark? You flip a switch, and a light comes on. But long ago, there were no light bulbs. Many people went to bed soon after the sun went down.

Long ago, people used candles made from fat or wax. A candle gave a small, soft light, and it could start a fire if it fell over. Later, people used lamps that burned oil. They gave more light, but they were smoky and needed to be filled again and again.

Then, about a hundred and fifty years ago, people made the electric light bulb. It was bright, clean and safe. Today, many homes use bulbs that save power. Light has changed a lot over time!`,
      [topic],
      [
        ask(
          ["What did people use for light long ago?", "很久以前人们用什么照明？"],
          ["Candles made from fat or wax", "用油脂或蜡做的蜡烛"],
          [
            ["Light bulbs", "电灯泡"],
            ["The moon only", "只用月亮"],
            ["Flashlights", "手电筒"],
          ],
          ["The text says long ago people used candles made from fat or wax.", "短文说很久以前人们用油脂或蜡做的蜡烛。"],
          [
            ["Light bulbs came much later, about a hundred and fifty years ago.", "灯泡是很久以后才有的，大约一百五十年前。"],
            ["The moon only is not in the text. People used candles.", "文中没说只靠月亮。人们用蜡烛。"],
            ["Flashlights are not in the text.", "文中没有手电筒。"],
          ],
        ),
        ask(
          ["What was a problem with oil lamps?", "油灯有什么问题？"],
          ["They were smoky and had to be filled again and again", "它们冒烟，还得一次又一次地加油"],
          [
            ["They gave no light", "它们不发光"],
            ["They were too bright", "它们太亮了"],
            ["They cost no money", "它们不要钱"],
          ],
          ["The text says the lamps were smoky and needed to be filled again and again.", "短文说油灯会冒烟，而且得一次又一次地加油。"],
          [
            ["Giving no light is wrong. Lamps gave more light than candles.", "不发光不对。油灯比蜡烛更亮。"],
            ["Too bright is not the problem named. They were smoky.", "太亮不是文中说的问题，问题是有烟。"],
            ["Costing no money is not in the text.", "文中没说不花钱。"],
          ],
        ),
        ask(
          ["What is the main topic of the text?", "这篇短文的主题是什么？"],
          ["How the way we get light has changed", "我们获得光亮的方式是怎样变化的"],
          [
            ["How to make a candle", "怎样做蜡烛"],
            ["Why fires are dangerous", "火为什么危险"],
            ["What happens at night", "晚上会发生什么"],
          ],
          [
            "The text tells about candles, then oil lamps, then light bulbs: how light has changed over time.",
            "短文依次讲了蜡烛、油灯和电灯泡，也就是光亮随着时间发生的变化。",
          ],
          [
            [
              "Making a candle is not explained. Candles are one step in the story of light.",
              "文中没讲怎么做蜡烛。蜡烛只是照明变化中的一步。",
            ],
            ["Fire danger is one detail about candles, not the main topic.", "着火的危险只是关于蜡烛的一个细节，不是主题。"],
            ["What happens at night is only the opening question.", "夜里会发生什么只是开头的问题。"],
          ],
        ),
        ask(
          ["What do we do today when it gets dark?", "今天天黑时我们做什么？"],
          ["Flip a switch", "按一下开关"],
          [
            ["Light a candle", "点一支蜡烛"],
            ["Fill a lamp with oil", "给灯加油"],
            ["Go to bed at once", "马上去睡觉"],
          ],
          ['The text says, "You flip a switch, and a light comes on."', "短文说：“你按一下开关，灯就亮了。”"],
          [
            ["Lighting a candle is what people did long ago.", "点蜡烛是从前人们做的。"],
            ["Filling a lamp with oil is from later long ago, not today.", "给油灯加油是过去的事，不是今天。"],
            ["Going to bed at once is what many people did long ago, before bulbs.", "天一黑就睡是没有灯泡前很多人的做法。"],
          ],
        ),
        ask(
          ["What was there none of long ago?", "很久以前没有什么？"],
          ["Light bulbs", "电灯泡"],
          [
            ["Candles", "蜡烛"],
            ["Fire", "火"],
            ["Lamps", "灯"],
          ],
          ['The text says, "But long ago, there were no light bulbs."', "短文说：“但是很久以前，没有电灯泡。”"],
          [
            ["Candles were used long ago, so there were some.", "从前用蜡烛，所以那时有蜡烛。"],
            ["Fire was there. Candles and lamps used it.", "那时有火，蜡烛和油灯都靠火。"],
            ["Lamps that burned oil were used long ago.", "从前人们用烧油的灯。"],
          ],
        ),
        ask(
          ["What kind of light did a candle give?", "蜡烛发出什么样的光？"],
          ["A small, soft light", "微弱柔和的光"],
          [
            ["A very bright light", "非常亮的光"],
            ["A smoky green light", "冒烟的绿光"],
            ["No light at all", "一点光也没有"],
          ],
          ["The text says a candle gave a small, soft light.", "短文说蜡烛发出微弱柔和的光。"],
          [
            ["A very bright light is the electric bulb, not a candle.", "很亮的光是电灯泡，不是蜡烛。"],
            ["A smoky green light is not in the text. Oil lamps were smoky.", "文中没有冒烟的绿光。有烟的是油灯。"],
            ["No light at all is wrong. A candle gave a small, soft light.", "完全不亮不对。蜡烛发出微弱柔和的光。"],
          ],
        ),
        ask(
          ["What could happen if a candle fell over?", "蜡烛倒了会发生什么？"],
          ["It could start a fire", "可能引起火灾"],
          [
            ["It would turn off", "它会自己熄灭"],
            ["It would get brighter", "它会变得更亮"],
            ["Nothing at all", "什么也不会发生"],
          ],
          ["The text says a candle could start a fire if it fell over.", "短文说蜡烛倒了可能引起火灾。"],
          [
            ["Turning off is wrong. A fallen candle could start a fire.", "熄灭不对。蜡烛倒了可能引起火灾。"],
            ["Getting brighter is not in the text.", "文中没说会更亮。"],
            ["Nothing at all is wrong. The text warns it could start a fire.", "什么都不会发生不对。文中提醒它可能引起火灾。"],
          ],
        ),
        ask(
          ["What did lamps burn?", "灯燃烧的是什么？"],
          ["Oil", "油"],
          [
            ["Wood", "木头"],
            ["Wax", "蜡"],
            ["Paper", "纸"],
          ],
          ['The text says, "Later, people used lamps that burned oil."', "短文说：“后来，人们用烧油的灯。”"],
          [
            ["Wood is not what lamps burned.", "油灯烧的不是木头。"],
            ["Wax is what some candles were made of.", "蜡是一些蜡烛的材料。"],
            ["Paper is not in the text. Lamps burned oil.", "文中没有纸。油灯烧的是油。"],
          ],
        ),
        ask(
          ["When was the electric light bulb made?", "电灯泡是什么时候被发明的？"],
          ["About a hundred and fifty years ago", "大约一百五十年前"],
          [
            ["Last year", "去年"],
            ["About ten years ago", "大约十年前"],
            ["Before people had candles", "在人们有蜡烛之前"],
          ],
          [
            'The text says, "Then, about a hundred and fifty years ago, people made the electric light bulb."',
            "短文说：“后来，大约一百五十年前，人们发明了电灯泡。”",
          ],
          [
            ["Last year is far too recent.", "去年太近了。"],
            ["About ten years ago is too recent.", "大约十年前太近了。"],
            ["Before candles is wrong. Candles came first, then lamps, then bulbs.", "在蜡烛之前不对。先有蜡烛，再有油灯，最后才有灯泡。"],
          ],
        ),
        ask(
          ["What do many homes use today?", "今天很多家庭用什么？"],
          ["Bulbs that save power", "节能灯泡"],
          [
            ["Candles made from fat", "油脂蜡烛"],
            ["Oil lamps", "油灯"],
            ["Fires in the stove", "炉火"],
          ],
          ['The text says, "Today, many homes use bulbs that save power."', "短文说：“今天，很多家庭使用节能灯泡。”"],
          [
            ["Candles made from fat were used long ago.", "用油脂做的蜡烛是从前用的。"],
            ["Oil lamps came before bulbs.", "油灯在灯泡之前。"],
            ["Fires in the stove are not in this text.", "这篇文章里没有炉火。"],
          ],
        ),
      ],
    ),
  ],
};

/** ourNeighborhood is the reading unit of grade 2 on the people and places of a town. */
export const ourNeighborhood: ReadingUnitDef = {
  id: "our-neighborhood",
  title: t("Our Neighborhood", "我们的社区"),
  passages: [
    passage(
      "helpers-in-our-town",
      t("Helpers in Our Town", "我们镇上的帮手"),
      `Many people work to help our town. Each one has an important job.

Firefighters put out fires and keep people safe. They ride in a big red truck with a long ladder. Police officers help people who are lost, and they keep the roads safe.

Doctors and nurses care for people who are sick or hurt. Teachers help children learn to read, write and count. Mail carriers bring letters and boxes to every home, in rain or sun.

Some helpers work at night while we sleep. Bakers make fresh bread, and street sweepers clean the roads. Who are the helpers in your town?`,
      [topic],
      [
        ask(
          ["What do firefighters ride in?", "消防员乘坐什么？"],
          ["A big red truck with a long ladder", "带长梯子的红色大卡车"],
          [
            ["A small blue car", "一辆蓝色小汽车"],
            ["A bus", "一辆公共汽车"],
            ["A boat", "一条船"],
          ],
          ["The text says firefighters ride in a big red truck with a long ladder.", "短文说消防员乘坐一辆带长梯子的红色大卡车。"],
          [
            ["A small blue car is not in the text.", "文中没有蓝色小汽车。"],
            ["A bus is not named. Firefighters ride in a red truck.", "文中没提公交车。消防员坐红色消防车。"],
            ["A boat is not in the text.", "文中没有船。"],
          ],
        ),
        ask(
          ["Who brings letters to every home?", "谁把信送到每户人家？"],
          ["Mail carriers", "邮递员"],
          [
            ["Police officers", "警察"],
            ["Bakers", "面包师"],
            ["Nurses", "护士"],
          ],
          ["The text says mail carriers bring letters and boxes to every home.", "短文说邮递员把信件和包裹送到每户人家。"],
          [
            ["Police officers help lost people and keep the roads safe.", "警察帮助迷路的人，维护道路安全。"],
            ["Bakers make bread at night.", "面包师夜里做面包。"],
            ["Nurses care for people who are sick.", "护士照顾病人。"],
          ],
        ),
        ask(
          ["What is the text mostly about?", "这篇短文主要讲什么？"],
          ["People whose jobs help the town", "工作能帮助小镇的人们"],
          [
            ["How to put out a fire", "怎样灭火"],
            ["Why bread is good", "面包为什么好"],
            ["What children learn at school", "孩子们在学校学什么"],
          ],
          ["The text tells about many helpers and their jobs in the town.", "短文讲了镇上的许多帮手和他们的工作。"],
          [
            ["Putting out fires is one job named, not the whole text.", "灭火只是提到的一种工作，不是全文。"],
            ["Bread is one detail about bakers.", "面包只是讲面包师的一个细节。"],
            ["What children learn is one detail about teachers.", "孩子学什么只是讲老师的一个细节。"],
          ],
        ),
        ask(
          ["What do firefighters do?", "消防员做什么？"],
          ["Put out fires and keep people safe", "灭火，保护人们的安全"],
          [
            ["Bring letters", "送信"],
            ["Make bread", "做面包"],
            ["Teach children", "教孩子们"],
          ],
          ['The text says, "Firefighters put out fires and keep people safe."', "短文说：“消防员灭火，保护人们的安全。”"],
          [
            ["Bringing letters is the mail carriers' job.", "送信是邮递员的工作。"],
            ["Making bread is the bakers' job.", "做面包是面包师的工作。"],
            ["Teaching children is the teachers' job.", "教孩子是老师的工作。"],
          ],
        ),
        ask(
          ["Who helps people who are lost?", "谁帮助迷路的人？"],
          ["Police officers", "警察"],
          [
            ["Bakers", "面包师"],
            ["Nurses", "护士"],
            ["Street sweepers", "清扫工"],
          ],
          ["The text says police officers help people who are lost.", "短文说警察帮助迷路的人。"],
          [
            ["Bakers make bread. They do not help lost people.", "面包师做面包，不帮迷路的人。"],
            ["Nurses care for the sick and hurt.", "护士照顾病人和伤者。"],
            ["Street sweepers clean the roads at night.", "清洁工夜里打扫街道。"],
          ],
        ),
        ask(
          ["Who cares for people who are sick or hurt?", "谁照顾生病或受伤的人？"],
          ["Doctors and nurses", "医生和护士"],
          [
            ["Firefighters", "消防员"],
            ["Teachers", "老师"],
            ["Mail carriers", "邮递员"],
          ],
          ["The text says doctors and nurses care for people who are sick or hurt.", "短文说医生和护士照顾生病或受伤的人。"],
          [
            ["Firefighters put out fires.", "消防员灭火。"],
            ["Teachers help children learn.", "老师帮孩子学习。"],
            ["Mail carriers bring letters and boxes.", "邮递员送信件和包裹。"],
          ],
        ),
        ask(
          ["What do teachers help children learn?", "老师帮助孩子们学什么？"],
          ["To read, write and count", "读、写和数数"],
          [
            ["To put out fires", "灭火"],
            ["To bake bread", "烤面包"],
            ["To drive a truck", "开卡车"],
          ],
          ["Teachers help children learn to read, write and count.", "老师帮助孩子们学习读、写和数数。"],
          [
            ["Putting out fires is what firefighters do.", "灭火是消防员做的事。"],
            ["Baking bread is what bakers do.", "烤面包是面包师做的事。"],
            ["Driving a truck is not something teachers teach here.", "开卡车不是这里老师教的内容。"],
          ],
        ),
        ask(
          ["When do mail carriers bring letters?", "邮递员在什么天气送信？"],
          ["In rain or sun", "无论下雨还是晴天"],
          [
            ["Only on sunny days", "只在晴天"],
            ["Only at night", "只在晚上"],
            ["Only in winter", "只在冬天"],
          ],
          ["Mail carriers bring letters and boxes to every home, in rain or sun.", "无论下雨还是晴天，邮递员都把信件和包裹送到每家每户。"],
          [
            ["Only sunny days is wrong. They come in rain or sun.", "只在晴天不对。不管下雨还是晴天他们都来。"],
            ["Only at night is wrong. Bakers and sweepers work at night.", "只在晚上不对。晚上工作的是面包师和清洁工。"],
            ["Only in winter is not in the text.", "文中没说只在冬天。"],
          ],
        ),
        ask(
          ["When do some helpers work?", "有些帮手在什么时候工作？"],
          ["At night while we sleep", "在我们睡觉的夜里"],
          [
            ["Only at lunch time", "只在午饭时"],
            ["Only on Saturday", "只在星期六"],
            ["Never", "从不"],
          ],
          ['The text says, "Some helpers work at night while we sleep."', "短文说：“有些帮手在我们睡觉时的夜里工作。”"],
          [
            ["Only at lunch time is not in the text.", "文中没说只在午饭时。"],
            ["Only on Saturday is not in the text.", "文中没说只在星期六。"],
            ["Never is wrong. The text says some work at night.", "从不不对。文中说有人在晚上工作。"],
          ],
        ),
        ask(
          ["What do bakers make at night?", "面包师夜里做什么？"],
          ["Fresh bread", "新鲜面包"],
          [
            ["Clean roads", "干净的道路"],
            ["Letters", "信件"],
            ["Fires", "火"],
          ],
          ['The text says, "Bakers make fresh bread."', "短文说：“面包师做新鲜面包。”"],
          [
            ["Clean roads come from the street sweepers.", "街道干净靠的是清洁工。"],
            ["Letters are brought by mail carriers.", "信件是邮递员送的。"],
            ["Fires are put out by firefighters, not made by bakers.", "火是消防员扑灭的，不是面包师做的。"],
          ],
        ),
      ],
    ),
    passage(
      "a-walk-to-the-market",
      t("A Walk to the Market", "去集市"),
      `On Saturday, Ravi and his mom walked to the market. Ravi held the shopping list. It said: apples, bread, eggs and flowers for Gran.

First, they stopped at the fruit stand. Ravi picked six shiny red apples. Next, they went to the baker. The shop smelled warm and sweet. The baker gave Ravi a little roll to try.

Then Ravi looked at the list again. Oh no! They had forgotten the eggs. They walked back past the fruit stand to the egg farmer.

At last, they bought yellow flowers for Gran. When Gran saw them, she smiled and gave Ravi a big hug.`,
      [parts, feel],
      [
        ask(
          ["Where did Ravi and his mom stop first?", "拉维和妈妈先去了哪里？"],
          ["The fruit stand", "水果摊"],
          [
            ["The baker", "面包店"],
            ["The egg farmer", "卖鸡蛋的农民那里"],
            ["Gran's house", "奶奶家"],
          ],
          ['The story says, "First, they stopped at the fruit stand."', "故事说：“他们先在水果摊停了下来。”"],
          [
            ["The baker was the second stop, after the fruit stand.", "面包店是第二站，在水果摊之后。"],
            ["The egg farmer came later, after they found they had forgotten the eggs.", "卖蛋的农民是后来去的，他们发现忘了买蛋以后。"],
            ["Gran's house is where the flowers went at the very end.", "奶奶家是最后送花去的地方。"],
          ],
        ),
        ask(
          ["What problem came up in the middle?", "中间出现了什么问题？"],
          ["They had forgotten the eggs", "他们忘了买鸡蛋"],
          [
            ["They lost the list", "他们把清单弄丢了"],
            ["The baker had no bread", "面包师没有面包了"],
            ["It began to rain", "开始下雨了"],
          ],
          ["Ravi looked at the list again and saw that they had forgotten the eggs.", "拉维又看了一遍清单，发现他们忘了买鸡蛋。"],
          [
            [
              "Losing the list is wrong. Ravi looked at the list again and saw the eggs on it.",
              "弄丢清单不对。拉维又看了一遍清单，发现上面有鸡蛋。",
            ],
            [
              "The baker having no bread is not in the story. He even gave Ravi a roll.",
              "故事里没说面包店没面包。面包师还给了拉维一个小面包。",
            ],
            ["Rain is not in the story.", "故事里没有下雨。"],
          ],
        ),
        ask(
          ["How did Gran feel when she saw the flowers?", "奶奶看到花时有什么感受？"],
          ["Happy", "很开心"],
          [
            ["Angry", "很生气"],
            ["Sleepy", "很困"],
            ["Scared", "很害怕"],
          ],
          ["Gran smiled and gave Ravi a big hug, which shows she was happy.", "奶奶笑了，还给了拉维一个大大的拥抱，说明她很开心。"],
          [
            ["Angry is the opposite. Gran smiled and hugged Ravi.", "生气正好相反。奶奶笑着拥抱了拉维。"],
            ["Sleepy is not in the story.", "故事里没有困。"],
            ["Scared is not in the story. She smiled.", "故事里没有害怕。她笑了。"],
          ],
        ),
        ask(
          ["When did Ravi and his mom go to the market?", "拉维和妈妈什么时候去市场？"],
          ["On Saturday", "星期六"],
          [
            ["On Monday", "星期一"],
            ["On Friday", "星期五"],
            ["On Sunday", "星期日"],
          ],
          ['The story says, "On Saturday, Ravi and his mom walked to the market."', "故事说：“星期六，拉维和妈妈走路去市场。”"],
          [
            ['Monday is not named. The first words are "On Saturday".', "文中没提星期一。开头就是“星期六”。"],
            ["Friday is wrong. They went on Saturday.", "星期五不对。他们星期六去的。"],
            ["Sunday is the day after. The story says Saturday.", "星期天是第二天。故事说的是星期六。"],
          ],
        ),
        ask(
          ["Who held the shopping list?", "谁拿着购物清单？"],
          ["Ravi", "拉维"],
          [
            ["Mom", "妈妈"],
            ["Gran", "奶奶"],
            ["The baker", "面包师"],
          ],
          ['The story says, "Ravi held the shopping list."', "故事说：“拉维拿着购物清单。”"],
          [
            ["Mom walked with him, but Ravi held the list.", "妈妈陪他走，但拿清单的是拉维。"],
            ["Gran was at home. The flowers were for her.", "奶奶在家，花是买给她的。"],
            ["The baker gave Ravi a roll. He did not hold the list.", "面包师给了拉维一个面包，没有拿清单。"],
          ],
        ),
        ask(
          ["How many apples did Ravi pick?", "拉维挑了几个苹果？"],
          ["Six", "六个"],
          [
            ["Three", "三个"],
            ["Ten", "十个"],
            ["Two", "两个"],
          ],
          ["Ravi picked six shiny red apples.", "拉维挑了六个亮晶晶的红苹果。"],
          [
            ["Three is too few. Ravi picked six apples.", "三个太少了。拉维挑了六个苹果。"],
            ["Ten is too many. The story says six.", "十个太多了。故事说的是六个。"],
            ["Two is too few. He picked six shiny red apples.", "两个太少了。他挑了六个红亮的苹果。"],
          ],
        ),
        ask(
          ["How did the baker's shop smell?", "面包店闻起来怎么样？"],
          ["Warm and sweet", "温暖香甜"],
          [
            ["Like flowers", "像花香"],
            ["Like fish", "像鱼腥味"],
            ["Cold and wet", "又冷又潮"],
          ],
          ["The story says the shop smelled warm and sweet.", "故事说那家店闻起来温暖香甜。"],
          [
            [
              "Like flowers is wrong. The flowers came at the end. The bakery smelled warm and sweet.",
              "像花香不对。花是最后才买的。面包店闻起来温暖香甜。",
            ],
            ["Like fish is not in the story.", "故事里没有鱼腥味。"],
            ["Cold and wet is the opposite of warm and sweet.", "又冷又湿和温暖香甜正好相反。"],
          ],
        ),
        ask(
          ["What did the baker give Ravi?", "面包师给了拉维什么？"],
          ["A little roll to try", "一个小面包尝尝"],
          [
            ["A big cake", "一个大蛋糕"],
            ["Six eggs", "六个鸡蛋"],
            ["Some flowers", "一些花"],
          ],
          ["The baker gave Ravi a little roll to try.", "面包师给了拉维一个小面包尝尝。"],
          [
            ["A big cake is wrong. It was a little roll.", "大蛋糕不对。是一个小面包。"],
            [
              "Six eggs is mixed up. Six was the number of apples, and eggs came from the farmer.",
              "六个鸡蛋弄混了。六是苹果的数目，鸡蛋是从农民那儿买的。",
            ],
            ["Flowers were bought at the end, not given by the baker.", "花是最后买的，不是面包师给的。"],
          ],
        ),
        ask(
          ["Who did they buy the eggs from?", "他们从谁那里买的鸡蛋？"],
          ["The egg farmer", "卖蛋的农民"],
          [
            ["The baker", "面包师"],
            ["The fruit stand", "水果摊"],
            ["Gran", "奶奶"],
          ],
          ["They walked back past the fruit stand to the egg farmer.", "他们走回去，经过水果摊，来到卖蛋的农民那里。"],
          [
            ["The baker sold bread, not eggs.", "面包师卖面包，不卖鸡蛋。"],
            [
              "The fruit stand is where they got apples. They only walked past it for the eggs.",
              "水果摊是买苹果的地方。去买蛋时他们只是路过。",
            ],
            ["Gran got the flowers. She did not sell eggs.", "奶奶收到了花，她不卖鸡蛋。"],
          ],
        ),
        ask(
          ["What color were the flowers for Gran?", "给奶奶的花是什么颜色的？"],
          ["Yellow", "黄色"],
          [
            ["Red", "红色"],
            ["Blue", "蓝色"],
            ["White", "白色"],
          ],
          ["At last, they bought yellow flowers for Gran.", "最后，他们给奶奶买了黄色的花。"],
          [
            ["Red is the color of the apples.", "红色是苹果的颜色。"],
            ["Blue is not in the story.", "故事里没有蓝色。"],
            ["White is not in the story. The flowers were yellow.", "故事里没有白色。花是黄色的。"],
          ],
        ),
      ],
      ["Ravi"],
    ),
    passage(
      "the-new-library",
      t("The New Library", "新图书馆"),
      `For a long time, our town had a tiny library. It had only one room, and there was no place to sit. Then the town built a new library on Oak Street.

On the first day, Mia and her dad went to see it. The doors opened by themselves! Inside, there were rows and rows of books, and big soft chairs by the windows. There was a room just for children, with a rug shaped like a turtle.

Mia got her very own library card. She picked three books about space. "Can we come back next week?" she asked. Her dad laughed. "We can come back every week," he said.`,
      [feel, parts],
      [
        ask(
          ["What was the problem with the old library?", "旧图书馆有什么问题？"],
          ["It was tiny, with no place to sit", "它很小，没有地方坐"],
          [
            ["It had no books", "它没有书"],
            ["It was too far away", "它太远了"],
            ["It was always closed", "它总是关门"],
          ],
          ["The story says the old library had only one room and no place to sit.", "故事说旧图书馆只有一个房间，没有地方坐。"],
          [
            ["No books is not said. The problem was the size and no seats.", "文中没说没有书。问题是太小、没座位。"],
            ["Too far away is not in the text.", "文中没说太远。"],
            ["Always closed is not in the text.", "文中没说总是关门。"],
          ],
        ),
        ask(
          ["What was the rug in the children's room shaped like?", "儿童室的地毯是什么形状的？"],
          ["A turtle", "一只乌龟"],
          [
            ["A star", "一颗星星"],
            ["A rocket", "一枚火箭"],
            ["A book", "一本书"],
          ],
          ["The story says there was a rug shaped like a turtle.", "故事说有一块乌龟形状的地毯。"],
          [
            ["A star is not in the story. The rug was a turtle.", "故事里没有星星。地毯是乌龟形的。"],
            ["A rocket is wrong. Space is what Mia's books were about.", "火箭不对。太空是米娅的书的主题。"],
            ["A book is not the rug's shape. It looked like a turtle.", "地毯的形状不是书，是乌龟。"],
          ],
        ),
        ask(
          ["How does Mia feel about the new library?", "米娅觉得新图书馆怎么样？"],
          ["She loves it and wants to come back", "她很喜欢，想再来"],
          [
            ["She is bored", "她觉得无聊"],
            ["She is scared of the doors", "她害怕那扇门"],
            ["She wants to go home", "她想回家"],
          ],
          ["Mia asks if they can come back next week, which shows she loves it.", "米娅问下周能不能再来，说明她很喜欢这里。"],
          [
            ["Bored is wrong. She asks to come back next week.", "无聊不对。她问下周能不能再来。"],
            ["Scared of the doors is wrong. The doors opening by themselves are a happy surprise.", "怕门不对。门自动打开是个惊喜。"],
            ["Wanting to go home is the opposite. She wants to come back.", "想回家正好相反。她想再来。"],
          ],
        ),
        ask(
          ["How many rooms did the old library have?", "旧图书馆有几个房间？"],
          ["Only one", "只有一个"],
          [
            ["Two", "两个"],
            ["Many", "很多"],
            ["None", "一个也没有"],
          ],
          ["The text says the old library had only one room.", "短文说旧图书馆只有一个房间。"],
          [
            ["Two is wrong. It had only one room.", "两间不对。它只有一间屋子。"],
            ["Many is the opposite. The old library was tiny.", "很多间正好相反。旧图书馆很小。"],
            ["None is wrong. It had one room.", "没有房间不对。它有一间。"],
          ],
        ),
        ask(
          ["Where did the town build the new library?", "镇上在哪里建了新图书馆？"],
          ["On Oak Street", "在橡树街"],
          [
            ["On Main Street", "在主街"],
            ["Next to the school", "在学校旁边"],
            ["In the park", "在公园里"],
          ],
          ["The town built a new library on Oak Street.", "镇上在橡树街建了一座新图书馆。"],
          [
            ["Main Street is not named. The library is on Oak Street.", "文中没提主街。图书馆在橡树街上。"],
            ["Next to the school is not in the text.", "文中没说在学校旁边。"],
            ["In the park is not in the text. It is on Oak Street.", "文中没说在公园里。它在橡树街上。"],
          ],
        ),
        ask(
          ["Who went with Mia to see the library?", "谁和米娅一起去看图书馆？"],
          ["Her dad", "她的爸爸"],
          [
            ["Her mom", "她的妈妈"],
            ["Her gran", "她的奶奶"],
            ["Her teacher", "她的老师"],
          ],
          ["On the first day, Mia and her dad went to see it.", "第一天，米娅和爸爸去参观。"],
          [
            ["Her mom is not in this story. Mia went with her dad.", "这个故事里没有妈妈。米娅和爸爸去的。"],
            ["Her gran is not in this story.", "这个故事里没有奶奶。"],
            ["Her teacher is not in this story.", "这个故事里没有老师。"],
          ],
        ),
        ask(
          ["What did the doors do?", "门是怎样的？"],
          ["They opened by themselves", "它们自己打开了"],
          [
            ["They were locked", "它们被锁上了"],
            ["They were very small", "它们很小"],
            ["They were made of glass only", "它们只是玻璃做的"],
          ],
          ['The text says, "The doors opened by themselves!"', "短文说：“门自己打开了！”"],
          [
            ["Locked is the opposite. The doors opened by themselves.", "锁着正好相反。门自己开了。"],
            ["Very small is not said about the doors.", "文中没说门很小。"],
            [
              "Glass only is not in the text. What surprised Mia was that they opened by themselves.",
              "文中没说门全是玻璃的。让米娅吃惊的是门会自己打开。",
            ],
          ],
        ),
        ask(
          ["Where were the big soft chairs?", "大软椅在哪里？"],
          ["By the windows", "在窗户旁边"],
          [
            ["In the children's room", "在儿童室里"],
            ["Outside the doors", "在门外"],
            ["Next to the desk", "在桌子旁边"],
          ],
          ["Inside, there were big soft chairs by the windows.", "里面窗户旁边有大软椅。"],
          [
            ["The children's room had the turtle rug, not the soft chairs.", "儿童室里有乌龟地毯，不是软椅子。"],
            ["Outside the doors is wrong. The chairs were inside.", "门外不对。椅子在里面。"],
            ["Next to the desk is not in the text. The chairs were by the windows.", "文中没说在桌旁。椅子在窗边。"],
          ],
        ),
        ask(
          ["What did Mia get of her very own?", "米娅得到了什么属于自己的东西？"],
          ["A library card", "一张借书证"],
          [
            ["A turtle", "一只乌龟"],
            ["A soft chair", "一把软椅"],
            ["A new bag", "一个新书包"],
          ],
          ['The text says, "Mia got her very own library card."', "短文说：“米娅得到了一张属于自己的借书证。”"],
          [
            ["A turtle is only the shape of the rug.", "乌龟只是地毯的形状。"],
            ["A soft chair stays in the library. She did not get one.", "软椅子留在图书馆，她没得到。"],
            ["A new bag is not in the story.", "故事里没有新书包。"],
          ],
        ),
        ask(
          ["What were Mia's books about?", "米娅的书是关于什么的？"],
          ["Space", "太空"],
          [
            ["Turtles", "乌龟"],
            ["The sea", "大海"],
            ["Cooking", "做饭"],
          ],
          ["She picked three books about space.", "她挑了三本关于太空的书。"],
          [
            ["Turtles are only the shape of the rug.", "乌龟只是地毯的形状。"],
            ["The sea is not in the story.", "故事里没有大海。"],
            ["Cooking is not in the story. She picked books about space.", "故事里没有做饭。她挑了关于太空的书。"],
          ],
        ),
      ],
      ["Mia", "Oak"],
    ),
  ],
};

/** animalsBigAndSmall is the reading unit of grade 2 on the biggest and smallest animals. */
export const animalsBigAndSmall: ReadingUnitDef = {
  id: "animals-big-and-small",
  title: t("Animals Big and Small", "大大小小的动物"),
  passages: [
    passage(
      "the-biggest-animal",
      t("The Biggest Animal", "最大的动物"),
      `What is the biggest animal that has ever lived? It is not a dinosaur. It is the blue whale!

A blue whale is longer than two buses in a row. Its heart is as big as a small car. Even a baby blue whale is bigger than an elephant.

You might think such a big animal eats big things, but it does not. A blue whale eats tiny animals called krill. It takes in a huge gulp of water, then pushes the water out and keeps the krill. In one day, it can eat more krill than you could count.

Blue whales sing to each other with low, deep sounds. Their songs can travel very far under the sea.`,
      [topic],
      [
        ask(
          ["What is the biggest animal that has ever lived?", "有史以来最大的动物是什么？"],
          ["The blue whale", "蓝鲸"],
          [
            ["A dinosaur", "恐龙"],
            ["An elephant", "大象"],
            ["A shark", "鲨鱼"],
          ],
          ["The text says the biggest animal that has ever lived is the blue whale.", "短文说有史以来最大的动物是蓝鲸。"],
          [
            ["A dinosaur is what the text says it is not.", "文中说最大的动物不是恐龙。"],
            ["An elephant is smaller than even a baby blue whale.", "大象比蓝鲸宝宝还小。"],
            ["A shark is not in the text.", "文中没有鲨鱼。"],
          ],
        ),
        ask(
          ["What does a blue whale eat?", "蓝鲸吃什么？"],
          ["Tiny animals called krill", "一种叫磷虾的小动物"],
          [
            ["Big fish", "大鱼"],
            ["Sea plants", "海里的植物"],
            ["Other whales", "别的鲸"],
          ],
          ["The text says a blue whale eats tiny animals called krill.", "短文说蓝鲸吃一种叫磷虾的小动物。"],
          [
            [
              "Big fish is what you might guess, but the text says it does not eat big things.",
              "大鱼是你可能会猜的，但文中说它不吃大东西。",
            ],
            ["Sea plants are not named. It eats tiny krill.", "文中没提海草。它吃小小的磷虾。"],
            ["Other whales is wrong. Blue whales sing to each other, not eat each other.", "吃别的鲸不对。蓝鲸彼此唱歌，不互相吃。"],
          ],
        ),
        ask(
          ["Which detail shows how big a blue whale is?", "哪个细节说明了蓝鲸有多大？"],
          ["Its heart is as big as a small car", "它的心脏和一辆小汽车一样大"],
          [
            ["It sings with low sounds", "它用低沉的声音唱歌"],
            ["It eats krill", "它吃磷虾"],
            ["Its songs travel far", "它的歌声传得很远"],
          ],
          ["A heart as big as a small car tells how huge the whole whale must be.", "心脏和小汽车一样大，说明整头鲸一定非常巨大。"],
          [
            ["Singing with low sounds is about its songs, not its size.", "用低沉的声音唱歌说的是歌声，不是大小。"],
            ["Eating krill is about its food, not its size.", "吃磷虾说的是食物，不是大小。"],
            ["Songs traveling far is about sound, not size.", "歌声传得远说的是声音，不是大小。"],
          ],
        ),
        ask(
          ["What is the biggest animal not?", "最大的动物不是什么？"],
          ["A dinosaur", "恐龙"],
          [
            ["A whale", "鲸"],
            ["An animal of the sea", "海洋动物"],
            ["An animal that sings", "会唱歌的动物"],
          ],
          ['The text says, "It is not a dinosaur. It is the blue whale!"', "短文说：“它不是恐龙，而是蓝鲸！”"],
          [
            ["A whale is what it is, not what it is not.", "最大的动物就是鲸，不是“不是”的那个。"],
            ["An animal of the sea is true, since the blue whale lives in the sea.", "海里的动物是对的，蓝鲸就住在海里。"],
            ["An animal that sings is true too. Blue whales sing.", "会唱歌的动物也对，蓝鲸会唱歌。"],
          ],
        ),
        ask(
          ["How long is a blue whale?", "蓝鲸有多长？"],
          ["Longer than two buses in a row", "比两辆首尾相接的公共汽车还长"],
          [
            ["As long as one car", "和一辆汽车一样长"],
            ["As long as a bee", "和一只蜜蜂一样长"],
            ["Shorter than an elephant", "比大象短"],
          ],
          ["The text says a blue whale is longer than two buses in a row.", "短文说蓝鲸比两辆首尾相接的公共汽车还长。"],
          [
            ["One car is too short. The heart alone is as big as a small car.", "一辆车太短了。光是心脏就有一辆小汽车那么大。"],
            ["As long as a bee is the tiny hummingbird's size, not the whale's.", "和蜜蜂一样长说的是蜂鸟，不是鲸。"],
            ["Shorter than an elephant is the opposite. Even a baby is bigger than an elephant.", "比大象短正好相反。连鲸宝宝都比大象大。"],
          ],
        ),
        ask(
          ["What is even a baby blue whale bigger than?", "连小蓝鲸都比什么大？"],
          ["An elephant", "大象"],
          [
            ["A bus", "公共汽车"],
            ["A house", "房子"],
            ["A ship", "轮船"],
          ],
          ['The text says, "Even a baby blue whale is bigger than an elephant."', "短文说：“即使是小蓝鲸也比大象大。”"],
          [
            ["A bus is used for the grown whale: longer than two buses.", "公交车是用来比成年鲸的：比两辆公交车还长。"],
            ["A house is not in the text.", "文中没有房子。"],
            ["A ship is not in the text. A baby is bigger than an elephant.", "文中没有船。鲸宝宝比大象还大。"],
          ],
        ),
        ask(
          ["What does a blue whale take in to get its food?", "蓝鲸吞进什么来获取食物？"],
          ["A huge gulp of water", "一大口水"],
          [
            ["A big fish", "一条大鱼"],
            ["Sand", "沙子"],
            ["Air", "空气"],
          ],
          [
            "It takes in a huge gulp of water, then pushes the water out and keeps the krill.",
            "它吞进一大口水，然后把水排出去，留下磷虾。",
          ],
          [
            ["A big fish is not its food. It eats tiny krill.", "大鱼不是它的食物。它吃小小的磷虾。"],
            ["Sand is not in the text.", "文中没有沙子。"],
            ["Air is not what it gulps for food. It takes in water.", "它吞进的不是空气，是水。"],
          ],
        ),
        ask(
          ["What does the whale keep after it pushes the water out?", "蓝鲸把水排出后留下什么？"],
          ["The krill", "磷虾"],
          [
            ["The water", "水"],
            ["Big fish", "大鱼"],
            ["Stones", "石头"],
          ],
          ["The whale pushes the water out and keeps the krill.", "蓝鲸把水排出去，留下磷虾。"],
          [
            ["The water is what it pushes out.", "水是它推出去的。"],
            ["Big fish are not in its food.", "大鱼不是它的食物。"],
            ["Stones are not in the text.", "文中没有石头。"],
          ],
        ),
        ask(
          ["What kind of sounds do blue whales sing with?", "蓝鲸用什么样的声音唱歌？"],
          ["Low, deep sounds", "低沉的声音"],
          [
            ["High, sharp sounds", "尖锐的高音"],
            ["Loud barks", "响亮的叫声"],
            ["No sounds at all", "不发出声音"],
          ],
          ["Blue whales sing to each other with low, deep sounds.", "蓝鲸用低沉的声音彼此歌唱。"],
          [
            ["High, sharp sounds are the opposite of low and deep.", "又高又尖和低沉正好相反。"],
            ["Loud barks are a dog's sound, not a whale's song.", "大声叫是狗的声音，不是鲸的歌。"],
            ["No sounds at all is wrong. Blue whales sing.", "完全不出声不对。蓝鲸会唱歌。"],
          ],
        ),
        ask(
          ["How far can the whales' songs travel?", "蓝鲸的歌声能传多远？"],
          ["Very far under the sea", "在海里传得很远"],
          [
            ["Only a few steps", "只有几步远"],
            ["Only on land", "只在陆地上"],
            ["Up to the sky", "一直传到天上"],
          ],
          ["Their songs can travel very far under the sea.", "它们的歌声能在海里传得很远。"],
          [
            ["Only a few steps is the opposite of very far.", "只有几步远和很远正好相反。"],
            ["Only on land is wrong. The songs travel under the sea.", "只在陆地上不对。歌声在海里传播。"],
            ["Up to the sky is not in the text.", "文中没说传到天上。"],
          ],
        ),
      ],
      [],
      ["krill"],
    ),
    passage(
      "tiny-hummingbirds",
      t("Tiny Hummingbirds", "小小的蜂鸟"),
      `Hummingbirds are some of the smallest birds in the world. The tiniest kind is not much bigger than a bee!

A hummingbird beats its wings so fast that you cannot see them. They make a humming sound, and that is how the bird got its name. It is the only bird that can fly backward, and it can stay still in the air like a helicopter.

Hummingbirds drink sweet juice from flowers with their long, thin beaks. They must eat many times a day, because flying so fast uses a lot of energy. At night, they rest and slow down to save their strength.`,
      [topic],
      [
        ask(
          ["How did the hummingbird get its name?", "蜂鸟的名字是怎么来的？"],
          ["Its wings make a humming sound", "它的翅膀发出嗡嗡声"],
          [
            ["It hums songs", "它会哼歌"],
            ["It lives near bees", "它住在蜜蜂附近"],
            ["It eats bees", "它吃蜜蜂"],
          ],
          [
            "The text says its wings make a humming sound, and that is how the bird got its name.",
            "短文说它的翅膀发出嗡嗡声，这就是它名字的由来。",
          ],
          [
            ["Humming songs is wrong. The sound comes from its wings.", "哼歌不对。声音来自它的翅膀。"],
            ["Living near bees is not the reason. A bee is only used to show its size.", "住在蜜蜂附近不是原因。蜜蜂只是用来比它的大小。"],
            ["Eating bees is not in the text. It drinks from flowers.", "文中没有吃蜜蜂。它喝花里的汁。"],
          ],
        ),
        ask(
          ["What can a hummingbird do that other birds cannot?", "蜂鸟能做哪件别的鸟做不到的事？"],
          ["Fly backward", "向后飞"],
          [
            ["Swim under water", "在水下游泳"],
            ["Sing at night", "在夜里唱歌"],
            ["Build a nest", "筑巢"],
          ],
          ["The text says it is the only bird that can fly backward.", "短文说它是唯一能向后飞的鸟。"],
          [
            ["Swimming under water is not in the text.", "文中没有水下游泳。"],
            ["Singing at night is wrong. At night it rests.", "晚上唱歌不对。它晚上休息。"],
            ["Building a nest is something many birds do.", "做窝是很多鸟都会做的事。"],
          ],
        ),
        ask(
          ["Why must hummingbirds eat many times a day?", "蜂鸟为什么一天要吃很多次？"],
          ["Flying so fast uses a lot of energy", "飞得这么快要消耗很多能量"],
          [
            ["Flowers are hard to find", "花很难找到"],
            ["Their beaks are long", "它们的嘴很长"],
            ["They sleep all day", "它们整天睡觉"],
          ],
          [
            "The text says they must eat many times a day because flying so fast uses a lot of energy.",
            "短文说它们一天要吃很多次，因为飞得这么快要消耗很多能量。",
          ],
          [
            ["Flowers being hard to find is not the reason given.", "文中给的原因不是花难找。"],
            ["Long beaks are for drinking, not the reason it eats so often.", "长喙是用来喝汁的，不是它常吃东西的原因。"],
            ["Sleeping all day is wrong. It rests at night.", "整天睡觉不对。它是晚上休息。"],
          ],
        ),
        ask(
          ["How big is the tiniest kind of hummingbird?", "最小的蜂鸟有多大？"],
          ["Not much bigger than a bee", "比蜜蜂大不了多少"],
          [
            ["As big as a cat", "和猫一样大"],
            ["As big as an eagle", "和鹰一样大"],
            ["Bigger than a helicopter", "比直升机还大"],
          ],
          ["The text says the tiniest kind is not much bigger than a bee.", "短文说最小的蜂鸟比蜜蜂大不了多少。"],
          [
            ["As big as a cat is far too big.", "和猫一样大太大了。"],
            ["An eagle is a big bird. The tiniest hummingbird is near a bee's size.", "鹰是大鸟。最小的蜂鸟和蜜蜂差不多大。"],
            ["A helicopter is only how it stays still in the air, not its size.", "直升机只是比喻它在空中停住，不是大小。"],
          ],
        ),
        ask(
          ["Why can you not see a hummingbird's wings?", "为什么你看不见蜂鸟的翅膀？"],
          ["They beat so fast", "它们扇得太快了"],
          [
            ["They are too small", "它们太小了"],
            ["They are hidden", "它们被藏起来了"],
            ["It has no wings", "它没有翅膀"],
          ],
          ["A hummingbird beats its wings so fast that you cannot see them.", "蜂鸟扇翅膀扇得太快，你都看不见。"],
          [
            ["Too small is not the reason. They move too fast.", "太小不是原因。是它们动得太快。"],
            ["Hidden is not in the text.", "文中没说藏起来了。"],
            ["Having no wings is wrong. Its wings hum.", "没有翅膀不对。它的翅膀会嗡嗡响。"],
          ],
        ),
        ask(
          ["How can a hummingbird stay in the air?", "蜂鸟怎样停在空中？"],
          ["Still, like a helicopter", "像直升机一样静止不动"],
          [
            ["Only by sitting on a flower", "只能坐在花上"],
            ["Only by flying fast forward", "只能快速向前飞"],
            ["It cannot stay in the air", "它不能停在空中"],
          ],
          ["It can stay still in the air like a helicopter.", "它能像直升机一样静止地停在空中。"],
          [
            ["Sitting on a flower is not how it stays in the air.", "停在花上不是它留在空中的方法。"],
            ["Flying fast forward is wrong. It can stay still.", "快速向前飞不对。它能停在空中不动。"],
            ["It cannot stay in the air is the opposite of what the text says.", "不能停在空中和文中说的正好相反。"],
          ],
        ),
        ask(
          ["What do hummingbirds drink?", "蜂鸟喝什么？"],
          ["Sweet juice from flowers", "花里的甜汁"],
          [
            ["Water from ponds", "池塘里的水"],
            ["Milk", "牛奶"],
            ["Rain", "雨水"],
          ],
          ["Hummingbirds drink sweet juice from flowers.", "蜂鸟喝花里的甜汁。"],
          [
            ["Water from ponds is not named.", "文中没提池塘的水。"],
            ["Milk is not in the text.", "文中没有牛奶。"],
            ["Rain is not in the text. They drink sweet juice from flowers.", "文中没有雨。它们喝花里的甜汁。"],
          ],
        ),
        ask(
          ["What are a hummingbird's beaks like?", "蜂鸟的喙是什么样的？"],
          ["Long and thin", "又长又细"],
          [
            ["Short and thick", "又短又粗"],
            ["Wide and flat", "又宽又扁"],
            ["Round and soft", "又圆又软"],
          ],
          ["They drink with their long, thin beaks.", "它们用又长又细的喙喝东西。"],
          [
            ["Short and thick is the opposite of long and thin.", "又短又粗和又长又细正好相反。"],
            ["Wide and flat is not in the text.", "文中没说又宽又扁。"],
            ["Round and soft is not in the text.", "文中没说又圆又软。"],
          ],
        ),
        ask(
          ["What do hummingbirds do at night?", "蜂鸟晚上做什么？"],
          ["They rest and slow down", "它们休息，放慢速度"],
          [
            ["They fly backward", "它们向后飞"],
            ["They eat many times", "它们吃很多次"],
            ["They sing", "它们唱歌"],
          ],
          ["At night, they rest and slow down to save their strength.", "晚上，它们休息并放慢下来，保存体力。"],
          [
            ["Flying backward is something it can do, but not what it does at night.", "向后飞是它会做的事，但不是晚上做的。"],
            ["Eating many times is what it does in the day.", "吃很多次是它白天做的事。"],
            ["Singing is not in the text. At night it rests.", "文中没有唱歌。晚上它休息。"],
          ],
        ),
        ask(
          ["Why do hummingbirds slow down at night?", "蜂鸟晚上为什么放慢下来？"],
          ["To save their strength", "为了保存体力"],
          [
            ["To hide from bees", "为了躲开蜜蜂"],
            ["To find flowers", "为了找花"],
            ["To dry their wings", "为了晾干翅膀"],
          ],
          ["They rest and slow down to save their strength.", "它们休息并放慢下来，保存体力。"],
          [
            ["Hiding from bees is not in the text.", "文中没有躲蜜蜂。"],
            ["Finding flowers is a day job, not why it slows down.", "找花是白天的事，不是放慢的原因。"],
            ["Drying their wings is not in the text.", "文中没有晾翅膀。"],
          ],
        ),
      ],
    ),
    passage(
      "the-lion-and-the-mouse",
      t("The Lion and the Mouse", "狮子和老鼠"),
      `A big lion was sleeping in the sun. A little mouse ran across his nose and woke him up. The lion grabbed the mouse with his huge paw.

"Please let me go," cried the mouse. "One day, I will help you." The lion laughed. How could a tiny mouse help a lion? But he let the mouse go.

A few days later, the lion was caught in a hunter's net. He roared and pulled, but he could not get out. The little mouse heard him. She ran to the net and chewed through the ropes until the lion was free.

"You laughed at me," said the mouse, "but even a small friend can be a big help."`,
      [parts, feel],
      [
        ask(
          ["What happens at the beginning of the story?", "故事开头发生了什么？"],
          ["The mouse wakes the lion, and he grabs her", "老鼠吵醒了狮子，狮子抓住了她"],
          [
            ["The lion is caught in a net", "狮子被网困住了"],
            ["The mouse chews the ropes", "老鼠咬断了绳子"],
            ["The hunter runs away", "猎人逃走了"],
          ],
          [
            "At the beginning, the mouse runs across the lion's nose, and he grabs her.",
            "故事开头，老鼠从狮子的鼻子上跑过，狮子抓住了她。",
          ],
          [
            ["Being caught in a net happens a few days later, in the middle.", "被网住是几天后、故事中间的事。"],
            ["Chewing the ropes happens near the end.", "咬断绳子是快结尾的事。"],
            ["The hunter running away is not in the story.", "故事里没有猎人逃跑。"],
          ],
        ),
        ask(
          ["How did the mouse solve the lion's problem?", "老鼠是怎样解决狮子的难题的？"],
          ["She chewed through the ropes of the net", "她咬断了网上的绳子"],
          [
            ["She called the other lions", "她叫来了别的狮子"],
            ["She scared the hunter away", "她吓跑了猎人"],
            ["She pulled the net with her paws", "她用爪子拉网"],
          ],
          ["The mouse chewed through the ropes until the lion was free.", "老鼠一直咬绳子，直到狮子脱身。"],
          [
            ["Calling other lions is not in the story.", "故事里没有叫别的狮子。"],
            ["Scaring the hunter is not in the story. The hunter never appears.", "故事里没有吓跑猎人。猎人根本没出现。"],
            ["Pulling the net is what the lion tried. The mouse chewed.", "拉网是狮子试过的办法。老鼠是咬。"],
          ],
        ),
        ask(
          ["What is the lesson of the story?", "这个故事告诉我们什么道理？"],
          ["Even a small friend can be a big help", "即使是小小的朋友也能帮上大忙"],
          [
            ["Lions are always kind", "狮子总是很善良"],
            ["Do not sleep in the sun", "不要在太阳下睡觉"],
            ["Nets are strong", "网很结实"],
          ],
          [
            "The mouse says it at the end: even a small friend can be a big help.",
            "老鼠在结尾说出了这个道理：即使是小小的朋友也能帮上大忙。",
          ],
          [
            ["Lions always being kind is not the lesson. He laughed at the mouse.", "狮子总是很善良不是寓意。他还嘲笑过老鼠。"],
            ["Not sleeping in the sun is not the lesson. That is just how it starts.", "不要在太阳下睡觉不是寓意，那只是故事的开头。"],
            ["Nets being strong is not the lesson. The tiny mouse got through it.", "网很结实不是寓意。小老鼠就咬穿了它。"],
          ],
        ),
        ask(
          ["Where was the lion sleeping?", "狮子在哪里睡觉？"],
          ["In the sun", "在阳光下"],
          [
            ["In a cave", "在山洞里"],
            ["Under a net", "在网下面"],
            ["In the rain", "在雨中"],
          ],
          ["The story says a big lion was sleeping in the sun.", "故事说一头大狮子在阳光下睡觉。"],
          [
            ["A cave is not in the story.", "故事里没有山洞。"],
            ["Under a net is wrong. The net came days later.", "在网下不对。网是几天后的事。"],
            ["In the rain is the opposite. He slept in the sun.", "在雨里正好相反。他在太阳下睡觉。"],
          ],
        ),
        ask(
          ["How did the mouse wake the lion?", "老鼠是怎样弄醒狮子的？"],
          ["She ran across his nose", "她跑过他的鼻子"],
          [
            ["She bit his tail", "她咬了他的尾巴"],
            ["She sang a song", "她唱了一首歌"],
            ["She roared", "她吼叫"],
          ],
          ["A little mouse ran across his nose and woke him up.", "一只小老鼠跑过他的鼻子，把他弄醒了。"],
          [
            ["Biting his tail is not in the story. She ran across his nose.", "故事里没有咬尾巴。她从他的鼻子上跑过。"],
            ["Singing a song is not in the story.", "故事里没有唱歌。"],
            ["Roaring is what the lion does, not the mouse.", "吼叫的是狮子，不是老鼠。"],
          ],
        ),
        ask(
          ["What did the mouse promise?", "老鼠许下了什么承诺？"],
          ["One day she would help the lion", "有一天她会帮助狮子"],
          [
            ["She would never come back", "她再也不会回来"],
            ["She would bring him food", "她会给他带食物"],
            ["She would find him a net", "她会给他找一张网"],
          ],
          ['"Please let me go," cried the mouse. "One day, I will help you."', "老鼠喊道：“请放了我吧，总有一天我会帮助你。”"],
          [
            ["Never coming back is wrong. She said she would help one day.", "再也不回来不对。她说有一天会帮他。"],
            ["Bringing food is not in the story.", "故事里没有带食物。"],
            ["Finding him a net is the opposite. The net was the trap.", "给他找张网正好相反。网是陷阱。"],
          ],
        ),
        ask(
          ["What did the lion do when the mouse said she would help?", "老鼠说会帮忙时，狮子做了什么？"],
          ["He laughed", "他笑了"],
          [
            ["He cried", "他哭了"],
            ["He ran away", "他跑了"],
            ["He roared at her", "他冲她吼"],
          ],
          ['The story says, "The lion laughed."', "故事说：“狮子笑了。”"],
          [
            ["Crying is what the mouse did when she begged.", "哭的是求饶时的老鼠。"],
            ["Running away is not what the lion did. He let her go.", "狮子没有逃跑，他放了老鼠。"],
            ["Roaring is what he did later, in the net.", "吼叫是他后来在网里做的事。"],
          ],
        ),
        ask(
          ["What caught the lion a few days later?", "几天后什么困住了狮子？"],
          ["A hunter's net", "猎人的网"],
          [
            ["A big hole", "一个大洞"],
            ["A cage", "一个笼子"],
            ["A river", "一条河"],
          ],
          ["A few days later, the lion was caught in a hunter's net.", "几天后，狮子被猎人的网困住了。"],
          [
            ["A big hole is not in the story.", "故事里没有大坑。"],
            ["A cage is not in the story. It was a net.", "故事里没有笼子。是一张网。"],
            ["A river is not in the story.", "故事里没有河。"],
          ],
        ),
        ask(
          ["What did the lion do in the net?", "狮子在网里做了什么？"],
          ["He roared and pulled", "他吼叫、挣扎"],
          [
            ["He went to sleep", "他睡着了"],
            ["He ate the ropes", "他吃掉了绳子"],
            ["He sang", "他唱歌"],
          ],
          ["He roared and pulled, but he could not get out.", "他吼叫、挣扎，却出不来。"],
          [
            ["Going to sleep is wrong. He tried hard to get out.", "睡觉不对。他拼命想出来。"],
            ["Eating the ropes is what the mouse did, by chewing.", "咬绳子的是老鼠。"],
            ["Singing is not in the story.", "故事里没有唱歌。"],
          ],
        ),
        ask(
          ["How did the mouse know the lion needed help?", "老鼠怎样知道狮子需要帮助？"],
          ["She heard him", "她听到了他的声音"],
          [
            ["She saw the hunter", "她看到了猎人"],
            ["A bird told her", "一只鸟告诉了她"],
            ["She smelled him", "她闻到了他"],
          ],
          ['The story says, "The little mouse heard him."', "故事说：“小老鼠听到了他的声音。”"],
          [
            ["Seeing the hunter is not in the story.", "故事里没有看见猎人。"],
            ["A bird is not in the story.", "故事里没有鸟。"],
            ["Smelling him is not in the story. She heard him roar.", "故事里没有闻到。她听到了他的吼声。"],
          ],
        ),
      ],
    ),
  ],
};

/** talesToTell is the reading unit of grade 2 on fables and folk tales. */
export const talesToTell: ReadingUnitDef = {
  id: "tales-to-tell",
  title: t("Tales to Tell", "讲故事"),
  passages: [
    passage(
      "the-ant-and-the-grasshopper",
      t("The Ant and the Grasshopper", "蚂蚁和蚱蜢"),
      `All summer long, a grasshopper sang and played in the warm grass. Each day, he saw an ant walk past, carrying a heavy seed on her back.

"Why do you work so hard?" asked the grasshopper. "Come and play with me!" "I am saving food for the winter," said the ant. "You should do the same." But the grasshopper just laughed and went on singing.

Then winter came. Snow covered the ground, and there was no food to be found. The grasshopper was cold and hungry. He went to the ant's home and asked for help. The kind ant shared some of her seeds, and the grasshopper learned to plan ahead.`,
      [parts, feel],
      [
        ask(
          ["What did the ant do all summer?", "蚂蚁整个夏天都在做什么？"],
          ["She saved food for the winter", "她为冬天储存食物"],
          [
            ["She sang in the grass", "她在草丛里唱歌"],
            ["She slept in the sun", "她在太阳下睡觉"],
            ["She played with the grasshopper", "她和蚱蜢一起玩"],
          ],
          ['The ant said, "I am saving food for the winter."', "蚂蚁说：“我在为冬天储存食物。”"],
          [
            ["Singing in the grass is what the grasshopper did.", "在草地上唱歌的是蚱蜢。"],
            ["Sleeping in the sun is not in this story.", "这个故事里没有晒太阳睡觉。"],
            ["Playing with the grasshopper is what he asked her to do, but she kept working.", "和蚱蜢玩是他邀请她做的，但她继续干活。"],
          ],
        ),
        ask(
          ["How did the grasshopper feel when winter came?", "冬天来了，蚱蜢有什么感受？"],
          ["Cold and hungry", "又冷又饿"],
          [
            ["Happy and full", "又开心又饱"],
            ["Proud", "很骄傲"],
            ["Sleepy and warm", "又困又暖和"],
          ],
          ["The story says the grasshopper was cold and hungry.", "故事说蚱蜢又冷又饿。"],
          [
            ["Happy and full is the opposite. There was no food.", "又开心又饱正好相反。那时找不到食物。"],
            ["Proud is not in the story. He had to ask for help.", "故事里没有骄傲。他只好去求助。"],
            ["Sleepy and warm is wrong. Snow covered the ground and he was cold.", "又困又暖不对。大雪盖住了地面，他很冷。"],
          ],
        ),
        ask(
          ["What did the grasshopper learn?", "蚱蜢学到了什么？"],
          ["To plan ahead", "要提前做好打算"],
          [
            ["To sing louder", "唱得更大声"],
            ["To sleep all winter", "整个冬天睡觉"],
            ["To stay away from ants", "离蚂蚁远一点"],
          ],
          ["The last sentence says the grasshopper learned to plan ahead.", "最后一句说蚱蜢学会了提前做好打算。"],
          [
            ["Singing louder is not the lesson. Singing all summer was the problem.", "唱得更响不是他学到的。整个夏天只顾唱歌才是问题。"],
            ["Sleeping all winter is not in the story.", "故事里没有冬眠。"],
            ["Staying away from ants is the opposite. The ant helped him.", "远离蚂蚁正好相反。是蚂蚁帮了他。"],
          ],
        ),
        ask(
          ["What did the grasshopper do all summer?", "蚱蜢整个夏天做什么？"],
          ["He sang and played in the grass", "他在草地上唱歌玩耍"],
          [
            ["He saved food", "他储存食物"],
            ["He dug a home", "他挖了一个家"],
            ["He slept in the snow", "他在雪里睡觉"],
          ],
          ["All summer long, a grasshopper sang and played in the warm grass.", "整个夏天，蚱蜢都在温暖的草地上唱歌玩耍。"],
          [
            ["Saving food is what the ant did.", "存粮的是蚂蚁。"],
            ["Digging a home is not in the story.", "故事里没有挖窝。"],
            ["Sleeping in the snow is wrong. The snow came in winter, not summer.", "在雪里睡觉不对。雪是冬天才有的，不是夏天。"],
          ],
        ),
        ask(
          ["What did the ant carry on her back?", "蚂蚁背上背着什么？"],
          ["A heavy seed", "一颗沉重的种子"],
          [
            ["A leaf", "一片叶子"],
            ["Her baby", "她的宝宝"],
            ["Some snow", "一些雪"],
          ],
          ["He saw an ant walk past, carrying a heavy seed on her back.", "他看见一只蚂蚁走过，背上背着一颗沉重的种子。"],
          [
            ["A leaf is not in the story. She carried a heavy seed.", "故事里没有树叶。她背着一颗沉沉的种子。"],
            ["Her baby is not in the story.", "故事里没有她的孩子。"],
            ["Snow comes in winter. In summer she carried seeds.", "雪是冬天的。夏天她背的是种子。"],
          ],
        ),
        ask(
          ["What did the grasshopper ask the ant to do?", "蚱蜢请蚂蚁做什么？"],
          ["Come and play with him", "来和他一起玩"],
          [
            ["Share her seeds", "分给他种子"],
            ["Help him dig", "帮他挖洞"],
            ["Sing a song", "唱一首歌"],
          ],
          ['"Come and play with me!" said the grasshopper.', "蚱蜢说：“来和我一起玩吧！”"],
          [
            ["Sharing her seeds is what he asked for later, in winter.", "分种子是他后来冬天求的。"],
            ["Helping him dig is not in the story.", "故事里没有帮他挖。"],
            ['Singing a song is close, but his words were "Come and play with me!"', "唱歌很接近，但他说的是“来和我玩吧！”"],
          ],
        ),
        ask(
          ["What did the ant tell the grasshopper he should do?", "蚂蚁告诉蚱蜢他应该做什么？"],
          ["Save food for the winter too", "也为冬天储存食物"],
          [
            ["Sing more songs", "多唱歌"],
            ["Go to sleep", "去睡觉"],
            ["Find a new home", "找个新家"],
          ],
          ['"I am saving food for the winter," said the ant. "You should do the same."', "蚂蚁说：“我在为冬天储存食物，你也应该这样做。”"],
          [
            ["Singing more songs is what he was already doing.", "多唱歌是他本来就在做的事。"],
            ["Going to sleep is not her advice.", "睡觉不是她的建议。"],
            ["Finding a new home is not in the story.", "故事里没有找新家。"],
          ],
        ),
        ask(
          ["What did the grasshopper do when the ant gave advice?", "蚂蚁给出建议时蚱蜢做了什么？"],
          ["He laughed and went on singing", "他笑了笑，继续唱歌"],
          [
            ["He started to work", "他开始干活"],
            ["He said sorry", "他道了歉"],
            ["He went home", "他回家了"],
          ],
          ["The grasshopper just laughed and went on singing.", "蚱蜢只是笑了笑，继续唱歌。"],
          [
            ["Starting to work is the opposite. He kept singing.", "开始干活正好相反。他继续唱歌。"],
            ["Saying sorry is not in the story then.", "当时故事里没有道歉。"],
            ["Going home is not what he did. He laughed and went on singing.", "他没有回家。他笑了笑，继续唱。"],
          ],
        ),
        ask(
          ["What covered the ground in winter?", "冬天什么覆盖了大地？"],
          ["Snow", "雪"],
          [
            ["Seeds", "种子"],
            ["Grass", "草"],
            ["Leaves", "树叶"],
          ],
          ['The story says, "Snow covered the ground, and there was no food to be found."', "故事说：“大雪覆盖了大地，找不到一点食物。”"],
          [
            ["Seeds are what the ant saved, not what covered the ground.", "种子是蚂蚁存的，不是盖住地面的东西。"],
            ["Grass is what he played in during summer.", "草是他夏天玩耍的地方。"],
            ["Leaves are not in the story. Snow covered the ground.", "故事里没有树叶。盖住地面的是雪。"],
          ],
        ),
        ask(
          ["What did the kind ant do?", "好心的蚂蚁做了什么？"],
          ["She shared some of her seeds", "她分了一些种子给他"],
          [
            ["She sent him away", "她把他赶走了"],
            ["She laughed at him", "她嘲笑他"],
            ["She sang with him", "她和他一起唱歌"],
          ],
          ["The kind ant shared some of her seeds.", "好心的蚂蚁分了一些种子给他。"],
          [
            ["Sending him away is the opposite. She shared her seeds.", "把他赶走正好相反。她分了种子给他。"],
            ["Laughing at him is what he did to her earlier.", "嘲笑别人的是他，早些时候他笑过她。"],
            ["Singing with him is not in the story.", "故事里没有和他一起唱歌。"],
          ],
        ),
      ],
    ),
    passage(
      "the-boy-who-cried-wolf",
      t("The Boy Who Cried Wolf", "狼来了"),
      `A boy watched the sheep on a hill near his village. The days were long, and he was bored.

One day, he had an idea. "Wolf! Wolf!" he shouted. The people of the village ran up the hill to help, but there was no wolf. The boy laughed and laughed. A few days later, he did it again. Once more, the people ran up the hill, and once more there was no wolf. They were angry.

Then one evening, a real wolf came out of the woods. "Wolf! Wolf!" the boy cried. But this time, nobody came. They thought he was playing a trick again. The boy learned that if you tell lies, people will not believe you, even when you tell the truth.`,
      [parts, feel],
      [
        ask(
          ['Why did the boy shout "Wolf!" the first time?', "男孩第一次为什么喊“狼来了”？"],
          ["He was bored and wanted to play a trick", "他觉得无聊，想捉弄人"],
          [
            ["He saw a real wolf", "他看见了一只真的狼"],
            ["He was lost", "他迷路了"],
            ["A sheep was sick", "一只羊病了"],
          ],
          [
            "The story says the boy was bored and laughed when the people came for no reason.",
            "故事说男孩觉得无聊，人们白跑一趟时他哈哈大笑。",
          ],
          [
            ["A real wolf came only at the end, and that time nobody believed him.", "真狼最后才来，那次没人相信他。"],
            ["Being lost is not in the story. He was on the hill near his village.", "故事里没有迷路。他就在村边的山上。"],
            ["A sick sheep is not in the story.", "故事里没有生病的羊。"],
          ],
        ),
        ask(
          ["How did the people feel after the second trick?", "第二次被捉弄后，人们有什么感受？"],
          ["Angry", "很生气"],
          [
            ["Happy", "很开心"],
            ["Proud", "很骄傲"],
            ["Sleepy", "很困"],
          ],
          ['The story says, "They were angry."', "故事说：“他们很生气。”"],
          [
            ["Happy is wrong. They ran up for nothing twice.", "高兴不对。他们两次白跑了一趟。"],
            ["Proud is not in the story.", "故事里没有骄傲。"],
            ["Sleepy is not in the story. They were angry.", "故事里没有困。他们很生气。"],
          ],
        ),
        ask(
          ["Why did nobody come when the real wolf came?", "真的狼来时为什么没有人来？"],
          ["They thought he was playing a trick again", "他们以为他又在捉弄人"],
          [
            ["They could not hear him", "他们听不见他"],
            ["They were asleep", "他们睡着了"],
            ["They were scared of wolves", "他们害怕狼"],
          ],
          ["The story says nobody came because they thought he was playing a trick again.", "故事说没有人来，因为他们以为他又在捉弄人。"],
          [
            ["Not hearing him is wrong. They heard, but did not believe him.", "听不见不对。他们听见了，但不相信。"],
            ["Being asleep is not in the story.", "故事里没有睡着。"],
            ["Being scared of wolves is not the reason given.", "怕狼不是文中给的原因。"],
          ],
        ),
        ask(
          ["What did the boy watch?", "男孩照看什么？"],
          ["Sheep", "羊"],
          [
            ["Cows", "牛"],
            ["Hens", "母鸡"],
            ["Horses", "马"],
          ],
          ["A boy watched the sheep on a hill near his village.", "一个男孩在村子附近的山坡上放羊。"],
          [
            ["Cows are not in the story.", "故事里没有牛。"],
            ["Hens are not in the story.", "故事里没有鸡。"],
            ["Horses are not in the story. He watched sheep.", "故事里没有马。他放的是羊。"],
          ],
        ),
        ask(
          ["How did the boy feel at the start?", "一开始男孩有什么感受？"],
          ["Bored", "无聊"],
          [
            ["Scared", "害怕"],
            ["Angry", "生气"],
            ["Sad", "难过"],
          ],
          ["The days were long, and he was bored.", "白天很长，他觉得很无聊。"],
          [
            ["Scared is how he felt at the end, not the start.", "害怕是他最后的感受，不是开头。"],
            ["Angry is how the people felt after the tricks.", "生气是村民被骗后的感受。"],
            ["Sad is not said at the start. The days were long and he was bored.", "开头没说难过。日子很长，他很无聊。"],
          ],
        ),
        ask(
          ["Who ran up the hill to help?", "谁跑上山坡来帮忙？"],
          ["The people of the village", "村里的人"],
          [
            ["The boy's sheep", "男孩的羊"],
            ["A hunter", "一个猎人"],
            ["Nobody", "没有人"],
          ],
          ["The people of the village ran up the hill to help.", "村里的人跑上山坡来帮忙。"],
          [
            ["The sheep did not run up. They were already on the hill.", "羊没有跑上来，它们本来就在山上。"],
            ["A hunter is not in this story.", "这个故事里没有猎人。"],
            ["Nobody is only the last time, when the real wolf came.", "没人来只是最后那次，真狼来的时候。"],
          ],
        ),
        ask(
          ["What did the boy do when there was no wolf?", "没有狼的时候男孩做了什么？"],
          ["He laughed and laughed", "他笑个不停"],
          [
            ["He said sorry", "他道了歉"],
            ["He cried", "他哭了"],
            ["He ran away", "他逃跑了"],
          ],
          ['The story says, "The boy laughed and laughed."', "故事说：“男孩笑个不停。”"],
          [
            ["Saying sorry is not in the story.", "故事里没有道歉。"],
            ["Crying is not what he did then. He laughed.", "那时他没哭，他在笑。"],
            ["Running away is not in the story.", "故事里没有逃跑。"],
          ],
        ),
        ask(
          ["How many times did the boy play the trick before the real wolf came?", "真狼来之前男孩开了几次玩笑？"],
          ["Two times", "两次"],
          [
            ["One time", "一次"],
            ["Five times", "五次"],
            ["Ten times", "十次"],
          ],
          ['He shouted "Wolf!" one day, then did it again a few days later.', "他有一天喊了“狼来了！”，几天后又喊了一次。"],
          [
            ["One time is too few. He did it again a few days later.", "一次太少了。几天后他又骗了一次。"],
            ["Five times is too many. The story tells of two tricks.", "五次太多了。故事讲了两次骗局。"],
            ["Ten times is far too many.", "十次太多了。"],
          ],
        ),
        ask(
          ["When did the real wolf come?", "真狼是什么时候来的？"],
          ["One evening", "一天傍晚"],
          [
            ["One morning", "一天早上"],
            ["At lunch time", "午饭时"],
            ["In the night", "半夜里"],
          ],
          ['The story says, "Then one evening, a real wolf came out of the woods."', "故事说：“后来一天傍晚，一只真狼从树林里出来了。”"],
          [
            ["One morning is wrong. The story says one evening.", "一天早上不对。故事说的是一天傍晚。"],
            ["At lunch time is not in the story.", "故事里没有午饭时间。"],
            ["In the night is close, but the story says evening.", "夜里很接近，但故事说的是傍晚。"],
          ],
        ),
        ask(
          ["Where did the real wolf come from?", "真狼从哪里来？"],
          ["Out of the woods", "从树林里"],
          [
            ["Up from the river", "从河边"],
            ["From the village", "从村子里"],
            ["Down the hill", "从山上下来"],
          ],
          ["A real wolf came out of the woods.", "一只真狼从树林里出来了。"],
          [
            ["Up from the river is not in the story.", "故事里没有河。"],
            ["From the village is where the people lived, not the wolf.", "村里住的是人，不是狼。"],
            [
              "Down the hill is wrong. The boy was on the hill, and the wolf came from the woods.",
              "从山上下来不对。男孩在山上，狼是从树林里来的。",
            ],
          ],
        ),
      ],
    ),
    passage(
      "the-little-red-hen",
      t("The Little Red Hen", "小红母鸡"),
      `The little red hen found some grains of wheat. "Who will help me plant this wheat?" she asked. "Not I," said the cat. "Not I," said the dog. "Not I," said the duck. So she planted it herself.

The wheat grew tall and golden. "Who will help me cut the wheat?" she asked. "Not I," they all said. So she cut it herself. Then she took it to the mill and made flour, and she baked a loaf of bread, all by herself.

The warm bread smelled so good. "Who will help me eat this bread?" asked the hen. "I will!" said the cat, the dog and the duck. "No," said the little red hen. "I did all the work, so my chicks and I will eat it."`,
      [parts, feel],
      [
        ask(
          ["What did the little red hen find?", "小红母鸡找到了什么？"],
          ["Some grains of wheat", "一些麦粒"],
          [
            ["A loaf of bread", "一条面包"],
            ["A bag of flour", "一袋面粉"],
            ["Some eggs", "一些鸡蛋"],
          ],
          ["The story begins when the hen finds some grains of wheat.", "故事从母鸡找到一些麦粒开始。"],
          [
            ["A loaf of bread is what she made at the end.", "一条面包是她最后做出来的。"],
            ["A bag of flour is what she made at the mill.", "一袋面粉是她在磨坊磨出来的。"],
            ["Some eggs are not in the story.", "故事里没有鸡蛋。"],
          ],
        ),
        ask(
          ["Who helped the hen plant and cut the wheat?", "谁帮母鸡种麦子、割麦子？"],
          ["Nobody, so she did it herself", "没有人，所以她自己做"],
          [
            ["The cat", "猫"],
            ["The dog and the duck", "狗和鸭子"],
            ["Her chicks", "她的小鸡"],
          ],
          ['Each time, the others said "Not I," so the hen did it herself.', "每次别的动物都说“我不干”，所以母鸡只好自己做。"],
          [
            ['The cat said "Not I."', "猫说“我不干”。"],
            ['The dog and the duck said "Not I" too.', "狗和鸭子也说“我不干”。"],
            ["Her chicks only appear at the end, to eat the bread.", "小鸡们只在最后出现，来吃面包。"],
          ],
        ),
        ask(
          ["Why did the hen not share the bread with the others?", "母鸡为什么不和别的动物分享面包？"],
          ["They did not help with any of the work", "它们一点活儿都没帮忙"],
          [
            ["There was not enough bread", "面包不够"],
            ["The bread was not done", "面包还没烤好"],
            ["They did not like bread", "它们不喜欢面包"],
          ],
          ['The hen says, "I did all the work, so my chicks and I will eat it."', "母鸡说：“所有的活儿都是我干的，所以我和我的小鸡来吃。”"],
          [
            ["Not enough bread is not the reason. She said she did all the work.", "面包不够不是原因。她说活儿都是她干的。"],
            ["The bread not being done is wrong. It was warm and smelled good.", "面包没烤好不对。面包热乎乎的，很香。"],
            ['Not liking bread is the opposite. They all said "I will!"', "不喜欢面包正好相反。他们都说“我要！”"],
          ],
        ),
        ask(
          ['Who said "Not I" first?', "谁第一个说“我不干”？"],
          ["The cat", "猫"],
          [
            ["The dog", "狗"],
            ["The duck", "鸭子"],
            ["The chick", "小鸡"],
          ],
          ['"Not I," said the cat. "Not I," said the dog. "Not I," said the duck.', "猫说：“我不干。”狗说：“我不干。”鸭子说：“我不干。”"],
          [
            ['The dog said "Not I" second, after the cat.', "狗是第二个说“我不干”的，在猫之后。"],
            ['The duck said "Not I" third.', "鸭子是第三个说“我不干”的。"],
            ["A chick did not speak. The chicks only appear at the end.", "小鸡没说话。小鸡只在最后出现。"],
          ],
        ),
        ask(
          ["What did the wheat look like when it grew?", "小麦长成后是什么样的？"],
          ["Tall and golden", "又高又金黄"],
          [
            ["Short and green", "又矮又绿"],
            ["Small and brown", "又小又棕"],
            ["Red and round", "又红又圆"],
          ],
          ['The story says, "The wheat grew tall and golden."', "故事说：“小麦长得又高又金黄。”"],
          [
            ["Short and green is the opposite. It grew tall and golden.", "又矮又绿正好相反。它长得又高又金黄。"],
            ["Small and brown is wrong. It grew tall and golden.", "又小又棕不对。它长得又高又金黄。"],
            ["Red and round is not in the story. Red is the hen.", "故事里没有又红又圆。红色说的是母鸡。"],
          ],
        ),
        ask(
          ["Where did the hen take the wheat?", "母鸡把小麦带到了哪里？"],
          ["To the mill", "到磨坊"],
          [
            ["To the shop", "到商店"],
            ["To the farm", "到农场"],
            ["To the pond", "到池塘"],
          ],
          ["She took it to the mill and made flour.", "她把小麦带到磨坊，磨成了面粉。"],
          [
            ["The shop is not in the story.", "故事里没有商店。"],
            ["The farm is not named. She took it to the mill.", "文中没提农场。她把它送到磨坊。"],
            ["The pond is not in the story.", "故事里没有池塘。"],
          ],
        ),
        ask(
          ["What did the hen make at the mill?", "母鸡在磨坊做了什么？"],
          ["Flour", "面粉"],
          [
            ["Bread", "面包"],
            ["Cake", "蛋糕"],
            ["Soup", "汤"],
          ],
          ["She took it to the mill and made flour.", "她把小麦带到磨坊，磨成了面粉。"],
          [
            ["Bread came after, when she baked the flour at home.", "面包是后来用面粉烤的。"],
            ["Cake is not in the story.", "故事里没有蛋糕。"],
            ["Soup is not in this story.", "这个故事里没有汤。"],
          ],
        ),
        ask(
          ["What did the hen bake?", "母鸡烤了什么？"],
          ["A loaf of bread", "一条面包"],
          [
            ["A cake", "一个蛋糕"],
            ["Some cookies", "一些饼干"],
            ["A pie", "一个馅饼"],
          ],
          ["She baked a loaf of bread, all by herself.", "她自己烤了一条面包。"],
          [
            ["A cake is not in the story.", "故事里没有蛋糕。"],
            ["Cookies are not in the story.", "故事里没有饼干。"],
            ["A pie is not in the story. She baked a loaf of bread.", "故事里没有馅饼。她烤了一条面包。"],
          ],
        ),
        ask(
          ['Who said "I will!" when the hen asked who would eat the bread?', "母鸡问谁来吃面包时，谁说“我来！”？"],
          ["The cat, the dog and the duck", "猫、狗和鸭子"],
          [
            ["Only the chicks", "只有小鸡"],
            ["Nobody", "没有人"],
            ["Only the duck", "只有鸭子"],
          ],
          ['"I will!" said the cat, the dog and the duck.', "猫、狗和鸭子都说：“我来！”"],
          [
            ["Only the chicks is wrong. The chicks did not ask.", "只有小鸡不对。小鸡没有开口要。"],
            ["Nobody is wrong. They all said it at once.", "没人说不对。他们一起说的。"],
            ["Only the duck is wrong. The cat and the dog said it too.", "只有鸭子不对。猫和狗也说了。"],
          ],
        ),
        ask(
          ["Who ate the bread in the end?", "最后谁吃了面包？"],
          ["The hen and her chicks", "母鸡和她的小鸡"],
          [
            ["The cat, the dog and the duck", "猫、狗和鸭子"],
            ["Everyone together", "大家一起"],
            ["Nobody", "没有人"],
          ],
          ['The hen said, "I did all the work, so my chicks and I will eat it."', "母鸡说：“活都是我干的，所以我和我的小鸡来吃。”"],
          [
            ["The cat, the dog and the duck asked to eat, but the hen said no.", "猫、狗和鸭子想吃，但母鸡拒绝了。"],
            ["Everyone together is wrong. The hen did not share with the others.", "大家一起吃不对。母鸡没和别人分享。"],
            ["Nobody is wrong. The hen and her chicks ate it.", "没人吃不对。母鸡和小鸡吃了。"],
          ],
        ),
      ],
    ),
  ],
};

/** howThingsWork is the reading unit of grade 2 on wheels, magnets and kites. */
export const howThingsWork: ReadingUnitDef = {
  id: "how-things-work",
  title: t("How Things Work", "东西是怎样工作的"),
  passages: [
    passage(
      "wheels-make-work-easy",
      t("Wheels Make Work Easy", "轮子让工作变轻松"),
      `Try to push a heavy box across the floor. It is hard work! The box rubs on the floor and does not want to move. Now put the box on a cart with wheels. It rolls along with just a small push.

Wheels make work easier because they roll instead of rubbing. That is why we put wheels on so many things. Cars, bikes, trains and wagons all roll on wheels. A shopping cart has wheels, and so does a suitcase.

People made the first wheels a very long time ago, from slices of wood. Since then, wheels have helped us carry heavy things, travel far and get places fast.`,
      [topic],
      [
        ask(
          ["Why is it hard to push a heavy box on the floor?", "为什么在地板上推重箱子很费劲？"],
          ["The box rubs on the floor", "箱子在地板上摩擦"],
          [
            ["The box has wheels", "箱子有轮子"],
            ["The floor is wet", "地板是湿的"],
            ["The box is empty", "箱子是空的"],
          ],
          ["The text says the box rubs on the floor and does not want to move.", "短文说箱子在地板上摩擦，不容易动。"],
          [
            ["The box having wheels is the fix, not the problem.", "箱子装上轮子是解决办法，不是问题。"],
            ["A wet floor is not in the text.", "文中没有湿地板。"],
            ["An empty box is wrong. The text says a heavy box.", "空箱子不对。文中说的是重箱子。"],
          ],
        ),
        ask(
          ["Why do wheels make work easier?", "为什么轮子能让工作更轻松？"],
          ["They roll instead of rubbing", "它们滚动而不是摩擦"],
          [
            ["They are made of wood", "它们是木头做的"],
            ["They make things lighter", "它们让东西变轻"],
            ["They push by themselves", "它们会自己推"],
          ],
          [
            "The text says wheels make work easier because they roll instead of rubbing.",
            "短文说轮子能让工作更轻松，因为它们滚动而不是摩擦。",
          ],
          [
            ["Being made of wood is about the first wheels, not why they help.", "木头做的说的是最早的轮子，不是它们省力的原因。"],
            ["Making things lighter is wrong. The box is still heavy, but it rolls.", "让东西变轻不对。箱子还是重的，只是能滚了。"],
            ["Pushing by themselves is wrong. You still give a small push.", "自己会推不对。你还是要轻轻推一下。"],
          ],
        ),
        ask(
          ["What were the first wheels made from?", "最早的轮子是用什么做的？"],
          ["Slices of wood", "木头片"],
          [
            ["Metal", "金属"],
            ["Stone balls", "石球"],
            ["Rubber", "橡胶"],
          ],
          ["The text says people made the first wheels from slices of wood.", "短文说人们用木头片做了最早的轮子。"],
          [
            ["Metal is not named. The first wheels were wood.", "文中没提金属。最早的轮子是木头的。"],
            ["Stone balls are not in the text.", "文中没有石球。"],
            ["Rubber is not in the text.", "文中没有橡胶。"],
          ],
        ),
        ask(
          ["What happens when you put the box on a cart with wheels?", "把箱子放在带轮子的推车上会怎样？"],
          ["It rolls along with a small push", "轻轻一推就滚动起来"],
          [
            ["It will not move at all", "一点也推不动"],
            ["It gets heavier", "它变得更重"],
            ["It falls off", "它掉下来"],
          ],
          [
            "Put the box on a cart with wheels, and it rolls along with just a small push.",
            "把箱子放在带轮子的推车上，轻轻一推它就滚动起来。",
          ],
          [
            ["Not moving at all is the problem without wheels.", "完全推不动是没有轮子时的问题。"],
            ["Getting heavier is not in the text.", "文中没说会变重。"],
            ["Falling off is not in the text.", "文中没说会掉下来。"],
          ],
        ),
        ask(
          ["Which of these rolls on wheels?", "下面哪个靠轮子滚动？"],
          ["A train", "火车"],
          [
            ["A boat", "船"],
            ["A kite", "风筝"],
            ["A plane in the sky", "天上的飞机"],
          ],
          ["The text says cars, bikes, trains and wagons all roll on wheels.", "短文说汽车、自行车、火车和货车都靠轮子滚动。"],
          [
            ["A boat floats on water. It has no wheels.", "船浮在水上，没有轮子。"],
            ["A kite flies on the wind.", "风筝靠风飞。"],
            ["A plane in the sky is not on the text's list of wheeled things.", "天上的飞机不在文中带轮子的东西里。"],
          ],
        ),
        ask(
          ["What else does the text say has wheels?", "短文还说什么东西有轮子？"],
          ["A suitcase", "行李箱"],
          [
            ["A chair", "椅子"],
            ["A box", "箱子"],
            ["A desk", "桌子"],
          ],
          ["A shopping cart has wheels, and so does a suitcase.", "购物车有轮子，行李箱也有。"],
          [
            ["A chair is not named in the text.", "文中没提椅子。"],
            ["A box is what you push. It has no wheels until you put it on a cart.", "箱子是被推的东西，放到推车上之前它没有轮子。"],
            ["A desk is not in the text.", "文中没有桌子。"],
          ],
        ),
        ask(
          ["When did people make the first wheels?", "人们什么时候造出了第一个轮子？"],
          ["A very long time ago", "很久很久以前"],
          [
            ["Last year", "去年"],
            ["When cars were made", "汽车出现的时候"],
            ["When the box was pushed", "推箱子的时候"],
          ],
          ["People made the first wheels a very long time ago.", "人们很久很久以前就造出了第一个轮子。"],
          [
            ["Last year is far too recent.", "去年太近了。"],
            ["When cars were made is wrong. Wheels came long before cars.", "造汽车时不对。轮子比汽车早得多。"],
            ["When the box was pushed is only the example at the start.", "推箱子只是开头的例子。"],
          ],
        ),
        ask(
          ["How do wheels help us travel?", "轮子怎样帮助我们出行？"],
          ["They help us travel far and get places fast", "帮助我们走得远、到得快"],
          [
            ["They make us walk slowly", "让我们走得慢"],
            ["They keep us at home", "让我们待在家里"],
            ["They help us swim", "帮助我们游泳"],
          ],
          ["Wheels have helped us carry heavy things, travel far and get places fast.", "轮子帮助我们搬运重物、走得远、到得快。"],
          [
            ["Walking slowly is the opposite.", "走得慢正好相反。"],
            ["Keeping us at home is the opposite. Wheels help us travel far.", "待在家里正好相反。轮子帮我们走得远。"],
            ["Swimming is not in the text.", "文中没有游泳。"],
          ],
        ),
        ask(
          ["What do wheels help us carry?", "轮子帮助我们搬运什么？"],
          ["Heavy things", "重物"],
          [
            ["Only paper", "只有纸"],
            ["Water", "水"],
            ["Light things only", "只有轻的东西"],
          ],
          ["Wheels have helped us carry heavy things.", "轮子帮助我们搬运重物。"],
          [
            ["Only paper is wrong. The text says heavy things.", "只运纸不对。文中说的是重东西。"],
            ["Water is not in the text.", "文中没有水。"],
            ["Light things only is the opposite of heavy things.", "只运轻东西和重东西正好相反。"],
          ],
        ),
        ask(
          ["What is pushing a heavy box across the floor like?", "推着沉重的箱子穿过地板是什么感觉？"],
          ["Hard work", "很费力"],
          [
            ["Easy and fast", "又轻松又快"],
            ["Fun and quick", "有趣又快"],
            ["Like riding a bike", "像骑自行车"],
          ],
          [
            'The text says, "Try to push a heavy box across the floor. It is hard work!"',
            "短文说：“试着推一个沉重的箱子穿过地板，很费力！”",
          ],
          [
            ["Easy and fast is the cart with wheels, not the box on the floor.", "又轻松又快说的是带轮子的推车，不是地上的箱子。"],
            ["Fun and quick is not in the text.", "文中没说又好玩又快。"],
            ["Riding a bike is not how the text describes it.", "文中没这样形容。"],
          ],
        ),
      ],
    ),
    passage(
      "magnets-pull",
      t("Magnets Pull", "磁铁会吸"),
      `A magnet is a special kind of metal. It can pull some things toward it without even touching them!

Hold a magnet near a paper clip, and the clip will jump to the magnet. Magnets pull on things made of iron, such as nails and pins. But they do not pull on wood, paper, glass or plastic. Try it with a spoon, a cork and a coin, and see what happens.

Every magnet has two ends. If you put two magnets together one way, they snap and stick. Turn one around, and they push each other away. You can feel the push in your hands. Magnets help us every day, from the door of the fridge to the speakers in a radio.`,
      [topic],
      [
        ask(
          ["Which things does a magnet pull?", "磁铁会吸哪些东西？"],
          ["Things made of iron, such as nails", "铁做的东西，比如钉子"],
          [
            ["Wood and paper", "木头和纸"],
            ["Glass", "玻璃"],
            ["Plastic toys", "塑料玩具"],
          ],
          ["The text says magnets pull on things made of iron, such as nails and pins.", "短文说磁铁会吸铁做的东西，比如钉子和别针。"],
          [
            ["Wood and paper are things a magnet does not pull.", "木头和纸是磁铁吸不动的。"],
            ["Glass is on the list of things it does not pull.", "玻璃在吸不动的清单上。"],
            ["Plastic toys are not pulled. Plastic is on the not list.", "塑料玩具吸不动，塑料在吸不动的清单上。"],
          ],
        ),
        ask(
          ["What happens if you turn one of two magnets around?", "如果把两块磁铁中的一块掉个头，会怎样？"],
          ["They push each other away", "它们会互相推开"],
          [
            ["They melt", "它们会融化"],
            ["They stick even harder", "它们粘得更紧"],
            ["Nothing at all", "什么也不会发生"],
          ],
          ['The text says, "Turn one around, and they push each other away."', "短文说：“把一块掉个头，它们就会互相推开。”"],
          [
            ["Melting is not in the text.", "文中没有熔化。"],
            ["Sticking harder is the opposite. Turned around, they push away.", "吸得更紧正好相反。转过来以后它们互相推开。"],
            ["Nothing at all is wrong. You can feel the push in your hands.", "什么都不发生不对。你的手能感觉到推力。"],
          ],
        ),
        ask(
          ["What is the text mostly about?", "这篇短文主要讲什么？"],
          ["What magnets do", "磁铁的作用"],
          [
            ["How to make a radio", "怎样做收音机"],
            ["Paper clips", "回形针"],
            ["The door of the fridge", "冰箱门"],
          ],
          [
            "Every part tells about magnets: what they pull, their two ends and how they help us.",
            "每一部分都在讲磁铁：它吸什么、它的两端以及它怎样帮助我们。",
          ],
          [
            ["Making a radio is not explained. A radio is only one example.", "文中没讲怎么做收音机，收音机只是一个例子。"],
            ["Paper clips are one example of what magnets pull.", "回形针只是磁铁能吸的一个例子。"],
            ["The fridge door is one example at the end.", "冰箱门只是结尾的一个例子。"],
          ],
        ),
        ask(
          ["What is a magnet?", "磁铁是什么？"],
          ["A special kind of metal", "一种特殊的金属"],
          [
            ["A kind of wood", "一种木头"],
            ["A kind of glass", "一种玻璃"],
            ["A kind of plastic", "一种塑料"],
          ],
          ['The text says, "A magnet is a special kind of metal."', "短文说：“磁铁是一种特殊的金属。”"],
          [
            ["Wood is something a magnet does not pull.", "木头是磁铁吸不动的。"],
            ["Glass is something a magnet does not pull.", "玻璃是磁铁吸不动的。"],
            ["Plastic is something a magnet does not pull.", "塑料是磁铁吸不动的。"],
          ],
        ),
        ask(
          ["Can a magnet pull things without touching them?", "磁铁不接触就能吸东西吗？"],
          ["Yes", "能"],
          [
            ["No", "不能"],
            ["Only wood", "只能吸木头"],
            ["Only when it is wet", "只在湿的时候"],
          ],
          ["The text says it can pull some things toward it without even touching them.", "短文说它甚至不用接触就能把一些东西吸过来。"],
          [
            ["No is the opposite. The text says it pulls without even touching.", "不能正好相反。文中说它不用碰到就能吸。"],
            ["Only wood is wrong. A magnet does not pull wood at all.", "只有木头不对。磁铁根本吸不动木头。"],
            ["Only when it is wet is not in the text.", "文中没说只有湿的时候。"],
          ],
        ),
        ask(
          ["What does the paper clip do near a magnet?", "回形针靠近磁铁时会怎样？"],
          ["It jumps to the magnet", "跳到磁铁上"],
          [
            ["It moves away", "移开了"],
            ["It melts", "熔化了"],
            ["Nothing", "没有变化"],
          ],
          ["Hold a magnet near a paper clip, and the clip will jump to the magnet.", "把磁铁靠近回形针，回形针就会跳到磁铁上。"],
          [
            ["Moving away is what two magnets do when turned around.", "推开是两块磁铁反过来时发生的。"],
            ["Melting is not in the text.", "文中没有熔化。"],
            ["Nothing is wrong. The clip jumps to the magnet.", "什么都不发生不对。回形针跳到了磁铁上。"],
          ],
        ),
        ask(
          ["Which does a magnet not pull?", "磁铁不吸下面哪个？"],
          ["Paper", "纸"],
          [
            ["Nails", "钉子"],
            ["Pins", "别针"],
            ["A paper clip", "回形针"],
          ],
          ["Magnets do not pull on wood, paper, glass or plastic.", "磁铁不吸木头、纸、玻璃或塑料。"],
          [
            ["Nails are iron, so a magnet pulls them.", "钉子是铁的，磁铁能吸。"],
            ["Pins are iron, so a magnet pulls them.", "大头针是铁的，磁铁能吸。"],
            ["A paper clip jumps to the magnet, so it is pulled.", "回形针会跳到磁铁上，所以能被吸。"],
          ],
        ),
        ask(
          ["How many ends does every magnet have?", "每块磁铁有几端？"],
          ["Two", "两端"],
          [
            ["One", "一端"],
            ["Three", "三端"],
            ["Four", "四端"],
          ],
          ['The text says, "Every magnet has two ends."', "短文说：“每块磁铁都有两端。”"],
          [
            ["One is wrong. Every magnet has two ends.", "一端不对。每块磁铁都有两端。"],
            ["Three is too many.", "三端太多了。"],
            ["Four is too many.", "四端太多了。"],
          ],
        ),
        ask(
          ["What happens if you put two magnets together one way?", "把两块磁铁朝一个方向放在一起会怎样？"],
          ["They snap and stick", "它们啪地吸在一起"],
          [
            ["They break", "它们碎了"],
            ["They get hot", "它们变热"],
            ["They fall apart", "它们散开了"],
          ],
          ["If you put two magnets together one way, they snap and stick.", "把两块磁铁朝一个方向放在一起，它们会啪地吸在一起。"],
          [
            ["Breaking is not in the text.", "文中没说会断。"],
            ["Getting hot is not in the text.", "文中没说会变热。"],
            ["Falling apart is the other way round, when one magnet is turned.", "分开是把一块磁铁转过来的情况。"],
          ],
        ),
        ask(
          ["Where do magnets help us?", "磁铁在哪里帮助我们？"],
          ["On the door of the fridge", "在冰箱门上"],
          [
            ["In a candle", "在蜡烛里"],
            ["In a paper book", "在纸书里"],
            ["In a glass cup", "在玻璃杯里"],
          ],
          [
            "Magnets help us every day, from the door of the fridge to the speakers in a radio.",
            "从冰箱门到收音机的扬声器，磁铁每天都在帮助我们。",
          ],
          [
            ["A candle is not named with magnets.", "文中讲磁铁时没提蜡烛。"],
            ["A paper book is wrong. Magnets do not pull paper.", "纸书不对。磁铁吸不动纸。"],
            ["A glass cup is wrong. Magnets do not pull glass.", "玻璃杯不对。磁铁吸不动玻璃。"],
          ],
        ),
      ],
    ),
    passage(
      "how-a-kite-flies",
      t("How a Kite Flies", "风筝是怎样飞起来的"),
      `On a windy day, Leo and his sister took their new kite to the park. Leo held the string and ran as fast as he could. The kite bumped along the grass, but it would not go up.

"Wait for a strong wind," said his sister. "Then hold the kite up high and let the wind catch it." Leo waited. When the wind blew hard, he let go. The kite climbed up and up into the sky!

A kite flies because the wind pushes up under it. The string holds the kite at a slant, so the wind can lift it. If the wind stops, the kite falls. That is why kites need a windy day.`,
      [parts, topic],
      [
        ask(
          ["What was Leo's problem at first?", "利奥一开始遇到了什么问题？"],
          ["The kite would not go up", "风筝飞不起来"],
          [
            ["He lost the kite", "他把风筝弄丢了"],
            ["The string broke", "线断了"],
            ["It began to rain", "开始下雨了"],
          ],
          ["The story says the kite bumped along the grass, but it would not go up.", "故事说风筝在草地上一路磕碰，就是飞不起来。"],
          [
            ["Losing the kite is not in the story.", "故事里没有弄丢风筝。"],
            ["The string breaking is not in the story.", "故事里没有断线。"],
            ["Rain is not in the story. It was a windy day.", "故事里没有下雨。那天刮着风。"],
          ],
        ),
        ask(
          ["How did Leo get the kite to fly?", "利奥是怎样让风筝飞起来的？"],
          ["He waited for a strong wind and let it catch the kite", "他等来一阵大风，让风托起风筝"],
          [
            ["He ran faster", "他跑得更快"],
            ["He threw the kite", "他把风筝扔了出去"],
            ["He cut the string", "他剪断了线"],
          ],
          [
            "His sister told him to wait for a strong wind, and when it blew hard, the kite climbed up.",
            "姐姐让他等一阵大风，风一大，风筝就升上去了。",
          ],
          [
            ["Running faster is what he tried first, and it did not work.", "跑得更快是他一开始试的，没有用。"],
            ["Throwing the kite is not in the story. He held it up and let go.", "故事里没有扔风筝。他把风筝举高再放手。"],
            ["Cutting the string is wrong. The string holds the kite.", "剪断线不对。线是用来牵住风筝的。"],
          ],
        ),
        ask(
          ["What makes a kite fly?", "是什么让风筝飞起来的？"],
          ["The wind pushing up under it", "从下面往上吹的风"],
          [
            ["The sun", "太阳"],
            ["Running on the grass", "在草地上跑"],
            ["A motor", "发动机"],
          ],
          ["The last part says a kite flies because the wind pushes up under it.", "最后一部分说风筝能飞是因为风从下面往上推它。"],
          [
            ["The sun is not named. The wind lifts the kite.", "文中没提太阳。是风把风筝托起来。"],
            ["Running on the grass only made the kite bump along.", "在草地上跑只让风筝在地上颠。"],
            ["A motor is not in the text.", "文中没有马达。"],
          ],
        ),
        ask(
          ["What was the day like?", "那天天气怎么样？"],
          ["Windy", "有风"],
          [
            ["Rainy", "下雨"],
            ["Snowy", "下雪"],
            ["Still and hot", "无风又热"],
          ],
          [
            'The story says, "On a windy day, Leo and his sister took their new kite to the park."',
            "故事说：“一个刮风的日子，利奥和姐姐带着新风筝去了公园。”",
          ],
          [
            ['Rainy is wrong. The first words are "On a windy day".', "下雨不对。开头就是“在一个刮风的日子”。"],
            ["Snowy is not in the story.", "故事里没有下雪。"],
            ["Still and hot is the opposite. A kite needs wind.", "无风又热正好相反。风筝需要风。"],
          ],
        ),
        ask(
          ["Who went with Leo to the park?", "谁和利奥一起去了公园？"],
          ["His sister", "他的姐姐"],
          [
            ["His dad", "他的爸爸"],
            ["His friend", "他的朋友"],
            ["His gran", "他的奶奶"],
          ],
          ["Leo and his sister took their new kite to the park.", "利奥和姐姐带着新风筝去了公园。"],
          [
            ["His dad is not in this story.", "这个故事里没有爸爸。"],
            ["A friend is not named. He went with his sister.", "文中没提朋友。他和姐姐一起去的。"],
            ["His gran is not in this story.", "这个故事里没有奶奶。"],
          ],
        ),
        ask(
          ["What did Leo do first?", "利奥先做了什么？"],
          ["He held the string and ran fast", "他拉着线快跑"],
          [
            ["He waited for the wind", "他等风"],
            ["He let go of the kite", "他松开了风筝"],
            ["He went home", "他回家了"],
          ],
          ["Leo held the string and ran as fast as he could.", "利奥拉着线，拼命地跑。"],
          [
            ["Waiting for the wind came after his sister's advice.", "等风是姐姐提醒之后的事。"],
            ["Letting go came last, when the wind blew hard.", "放手是最后风大时的事。"],
            ["Going home is not in the story.", "故事里没有回家。"],
          ],
        ),
        ask(
          ["What did the kite do at first?", "风筝一开始怎样？"],
          ["It bumped along the grass", "它在草地上磕磕碰碰"],
          [
            ["It flew very high", "它飞得很高"],
            ["It broke", "它坏了"],
            ["It got stuck in a tree", "它挂在树上"],
          ],
          ["The kite bumped along the grass, but it would not go up.", "风筝在草地上磕磕碰碰，就是飞不起来。"],
          [
            ["Flying high came later, after he waited for the wind.", "飞得很高是后来等到风以后的事。"],
            ["Breaking is not in the story.", "故事里没有摔坏。"],
            ["A tree is not in the story.", "故事里没有树。"],
          ],
        ),
        ask(
          ["Who told Leo to wait for a strong wind?", "谁让利奥等一阵大风？"],
          ["His sister", "他的姐姐"],
          [
            ["His mom", "他的妈妈"],
            ["A man in the park", "公园里的一个人"],
            ["Nobody", "没有人"],
          ],
          ['"Wait for a strong wind," said his sister.', "姐姐说：“等一阵大风。”"],
          [
            ["His mom is not in this story.", "这个故事里没有妈妈。"],
            ["A man in the park is not in the story.", "故事里没有公园里的男人。"],
            ['Nobody is wrong. His sister said, "Wait for a strong wind."', "没人说不对。是姐姐说“等一阵大风”。"],
          ],
        ),
        ask(
          ["What does the string do?", "线起什么作用？"],
          ["It holds the kite at a slant", "让风筝保持倾斜"],
          [
            ["It pushes the kite up", "把风筝推上去"],
            ["It makes the wind blow", "让风吹起来"],
            ["It keeps the kite on the ground", "让风筝留在地上"],
          ],
          ["The string holds the kite at a slant, so the wind can lift it.", "线让风筝保持倾斜，这样风才能把它托起来。"],
          [
            ["Pushing the kite up is what the wind does.", "把风筝往上推的是风。"],
            ["Making the wind blow is wrong. Nothing in the story makes the wind.", "让风吹起来不对。故事里没有东西能造风。"],
            ["Keeping the kite on the ground is the opposite.", "把风筝留在地上正好相反。"],
          ],
        ),
        ask(
          ["What happens if the wind stops?", "如果风停了会怎样？"],
          ["The kite falls", "风筝会掉下来"],
          [
            ["The kite flies higher", "风筝会飞得更高"],
            ["The string breaks", "线会断"],
            ["Nothing", "什么也不会发生"],
          ],
          ['The text says, "If the wind stops, the kite falls."', "短文说：“如果风停了，风筝就会掉下来。”"],
          [
            ["Flying higher is the opposite. Without wind, it falls.", "飞得更高正好相反。没有风，它就掉下来。"],
            ["The string breaking is not in the text.", "文中没说线会断。"],
            ["Nothing is wrong. The text says the kite falls.", "什么都不发生不对。文中说风筝会掉下来。"],
          ],
        ),
      ],
      ["Leo"],
    ),
  ],
};

/** lettersAndCelebrations is the reading unit of grade 2 on a letter, a festival and a party. */
export const lettersAndCelebrations: ReadingUnitDef = {
  id: "letters-and-celebrations",
  title: t("Letters and Celebrations", "书信和庆祝"),
  passages: [
    passage(
      "a-letter-to-gran",
      t("A Letter to Gran", "给奶奶的信"),
      `Dear Gran,

Thank you for the birthday gift! I love the blue backpack. It has a pocket for my pencils and a place for my water. I take it to school every day.

My birthday party was so much fun. Five friends came to our house. We played games in the yard, and Dad made a cake shaped like a rocket. When I blew out the candles, I made a wish. I wished that you could come and visit soon.

I miss you. Please write back and tell me about your garden.

Love,
Nora`,
      [feel],
      [
        ask(
          ["Why did Nora write to Gran?", "诺拉为什么给奶奶写信？"],
          ["To thank her for the birthday gift", "感谢她送的生日礼物"],
          [
            ["To ask for a cake", "向她要蛋糕"],
            ["To tell her about school", "告诉她学校里的事"],
            ["To invite her to the party", "邀请她来参加聚会"],
          ],
          ['The letter starts, "Thank you for the birthday gift!"', "信的开头写道：“谢谢您送的生日礼物！”"],
          [
            ["Asking for a cake is wrong. Dad already made the cake.", "要蛋糕不对。爸爸已经做了蛋糕。"],
            ["School is only where she takes the backpack.", "学校只是她背书包去的地方。"],
            [
              "Inviting Gran to the party is wrong. The party is over, and she tells Gran about it.",
              "邀请奶奶来聚会不对。聚会已经结束了，她是在讲给奶奶听。",
            ],
          ],
        ),
        ask(
          ["What was the cake shaped like?", "蛋糕是什么形状的？"],
          ["A rocket", "一枚火箭"],
          [
            ["A backpack", "一个背包"],
            ["A garden", "一个花园"],
            ["A star", "一颗星星"],
          ],
          ["Nora says Dad made a cake shaped like a rocket.", "诺拉说爸爸做了一个火箭形状的蛋糕。"],
          [
            ["A backpack is Gran's gift, not the cake.", "书包是奶奶的礼物，不是蛋糕。"],
            ["A garden is what Nora asks Gran to write about.", "花园是诺拉请奶奶写信讲的。"],
            ["A star is not in the letter.", "信里没有星星。"],
          ],
        ),
        ask(
          ["What did Nora wish for?", "诺拉许了什么愿？"],
          ["That Gran could come and visit soon", "希望奶奶能很快来看她"],
          [
            ["A new backpack", "一个新背包"],
            ["More friends", "更多朋友"],
            ["A bigger cake", "更大的蛋糕"],
          ],
          ["Nora wished that Gran could come and visit soon.", "诺拉许愿奶奶能很快来看她。"],
          [
            ["A new backpack is what she already got.", "新书包是她已经收到的。"],
            ["More friends is not her wish. Five came to the party.", "更多朋友不是她的愿望。已经有五个朋友来了。"],
            ["A bigger cake is not in the letter.", "信里没有更大的蛋糕。"],
          ],
        ),
        ask(
          ["What gift did Gran send?", "奶奶送了什么礼物？"],
          ["A blue backpack", "一个蓝色背包"],
          [
            ["A red coat", "一件红外套"],
            ["A rocket", "一个火箭"],
            ["A book", "一本书"],
          ],
          ['Nora writes, "I love the blue backpack."', "诺拉写道：“我很喜欢这个蓝色背包。”"],
          [
            ["A red coat is not in the letter.", "信里没有红外套。"],
            ["A rocket is only the shape of the cake.", "火箭只是蛋糕的形状。"],
            ["A book is not in the letter. The gift was a backpack.", "信里没有书。礼物是书包。"],
          ],
        ),
        ask(
          ["What does the backpack have a pocket for?", "背包上的口袋用来装什么？"],
          ["Pencils", "铅笔"],
          [
            ["Books", "书"],
            ["Toys", "玩具"],
            ["Money", "钱"],
          ],
          ["It has a pocket for my pencils and a place for my water.", "它有一个装铅笔的口袋和一个放水的地方。"],
          [
            ["Books are not named. The pocket is for pencils.", "文中没提书。口袋是放铅笔的。"],
            ["Toys are not in the letter.", "信里没有玩具。"],
            ["Money is not in the letter. There is a place for water too.", "信里没有钱。另外还有放水杯的地方。"],
          ],
        ),
        ask(
          ["Where does Nora take the backpack?", "诺拉把背包带到哪里？"],
          ["To school every day", "每天带去学校"],
          [
            ["Only to parties", "只带去聚会"],
            ["To Gran's house", "带去奶奶家"],
            ["Nowhere", "哪里也不带"],
          ],
          ['Nora writes, "I take it to school every day."', "诺拉写道：“我每天都背着它去上学。”"],
          [
            ["Only to parties is wrong. She takes it to school every day.", "只带去聚会不对。她每天背着去上学。"],
            ["Gran's house is not where she takes it.", "她没有背去奶奶家。"],
            ["Nowhere is the opposite. She uses it every day.", "哪儿都不带正好相反。她每天都用。"],
          ],
        ),
        ask(
          ["How many friends came to the party?", "有几个朋友来参加聚会？"],
          ["Five", "五个"],
          [
            ["Two", "两个"],
            ["Ten", "十个"],
            ["Three", "三个"],
          ],
          ['Nora writes, "Five friends came to our house."', "诺拉写道：“有五个朋友来我们家。”"],
          [
            ["Two is too few. Five friends came.", "两个太少了。来了五个朋友。"],
            ["Ten is too many.", "十个太多了。"],
            ["Three is wrong. The letter says five.", "三个不对。信里说的是五个。"],
          ],
        ),
        ask(
          ["Where did they play games?", "他们在哪里玩游戏？"],
          ["In the yard", "在院子里"],
          [
            ["In the park", "在公园里"],
            ["At school", "在学校"],
            ["In the kitchen", "在厨房里"],
          ],
          ['Nora writes, "We played games in the yard."', "诺拉写道：“我们在院子里玩游戏。”"],
          [
            ["The park is not in the letter. They played in the yard.", "信里没有公园。他们在院子里玩。"],
            ["At school is wrong. The party was at home.", "在学校不对。聚会在家里。"],
            ["The kitchen is not where they played.", "他们不是在厨房玩。"],
          ],
        ),
        ask(
          ["Who made the cake?", "谁做的蛋糕？"],
          ["Dad", "爸爸"],
          [
            ["Gran", "奶奶"],
            ["Mom", "妈妈"],
            ["Nora", "诺拉"],
          ],
          ["Dad made a cake shaped like a rocket.", "爸爸做了一个火箭形状的蛋糕。"],
          [
            ["Gran sent the backpack. She was not at the party.", "奶奶寄来了书包，她不在聚会上。"],
            ["Mom is not in the letter.", "信里没有妈妈。"],
            ["Nora blew out the candles, but Dad made the cake.", "诺拉吹了蜡烛，但蛋糕是爸爸做的。"],
          ],
        ),
        ask(
          ["What does Nora ask Gran to write about?", "诺拉请奶奶写什么？"],
          ["Her garden", "她的花园"],
          [
            ["Her house", "她的房子"],
            ["Her cat", "她的猫"],
            ["Her birthday", "她的生日"],
          ],
          ['Nora writes, "Please write back and tell me about your garden."', "诺拉写道：“请给我回信，讲讲你的花园。”"],
          [
            ["Her house is not named. Nora asks about the garden.", "文中没提她的房子。诺拉问的是花园。"],
            ["A cat is not in the letter.", "信里没有猫。"],
            ["Her birthday is Nora's, not Gran's, and it is what Nora told about.", "生日是诺拉的，不是奶奶的，而且是诺拉讲的事。"],
          ],
        ),
      ],
      ["Nora"],
    ),
    passage(
      "the-moon-festival",
      t("The Moon Festival", "中秋节"),
      `In the fall, when the moon is round and bright, many families in China and other places have the Moon Festival.

On that night, families get together for a big dinner. After dinner, they go outside to look at the full moon. Children carry paper lanterns that glow in the dark. Some lanterns are shaped like rabbits, fish or stars.

Families also share mooncakes. A mooncake is a round cake with a sweet filling inside, such as bean paste or nuts. Its round shape stands for the full moon, and for a family that is all together.

People who live far from home look at the moon too, and think of the ones they love.`,
      [topic],
      [
        ask(
          ["When is the Moon Festival?", "中秋节在什么时候？"],
          ["In the fall, when the moon is round and bright", "秋天，月亮又圆又亮的时候"],
          [
            ["In spring, when it rains", "春天下雨的时候"],
            ["In summer, at the beach", "夏天在海滩上的时候"],
            ["In winter, when it snows", "冬天下雪的时候"],
          ],
          ["The text says the Moon Festival is in the fall, when the moon is round and bright.", "短文说中秋节在秋天，那时月亮又圆又亮。"],
          [
            ["Spring and rain are not in the text.", "文中没有春天和雨。"],
            ["Summer at the beach is not in the text.", "文中没有夏天和海滩。"],
            ["Winter and snow are not in the text. It is in the fall.", "文中没有冬天和雪。节日在秋天。"],
          ],
        ),
        ask(
          ["What does the round shape of a mooncake stand for?", "月饼的圆形代表什么？"],
          ["The full moon and a family all together", "圆圆的月亮和团圆的家人"],
          [
            ["The sun", "太阳"],
            ["A lantern", "灯笼"],
            ["A rabbit", "兔子"],
          ],
          [
            "The text says its round shape stands for the full moon, and for a family that is all together.",
            "短文说它的圆形代表满月，也代表全家团圆。",
          ],
          [
            ["The sun is not in the text. The round shape stands for the moon.", "文中没有太阳。圆形代表月亮。"],
            ["A lantern is what children carry, not what the cake stands for.", "灯笼是孩子们提的，不是月饼的含义。"],
            ["A rabbit is one shape of a lantern.", "兔子是灯笼的一种形状。"],
          ],
        ),
        ask(
          ["What is the text mostly about?", "这篇短文主要讲什么？"],
          ["How families celebrate the Moon Festival", "家人们怎样过中秋节"],
          [
            ["How to make a lantern", "怎样做灯笼"],
            ["Why the moon changes shape", "月亮为什么会变形状"],
            ["Rabbits and fish", "兔子和鱼"],
          ],
          ["Every part tells what families do at the Moon Festival.", "每一部分都在讲家人们在中秋节做什么。"],
          [
            ["Making a lantern is not explained.", "文中没讲怎么做灯笼。"],
            ["Why the moon changes shape is not explained.", "文中没讲月亮为什么变形状。"],
            ["Rabbits and fish are only lantern shapes.", "兔子和鱼只是灯笼的形状。"],
          ],
        ),
        ask(
          ["What do families do on the night of the Moon Festival?", "中秋节晚上家人们做什么？"],
          ["They get together for a big dinner", "聚在一起吃一顿大餐"],
          [
            ["They go to school", "他们去上学"],
            ["They sleep early", "他们早早睡觉"],
            ["They plant trees", "他们种树"],
          ],
          ["On that night, families get together for a big dinner.", "那天晚上，家人们聚在一起吃一顿大餐。"],
          [
            ["Going to school is not in the text.", "文中没有上学。"],
            ["Sleeping early is wrong. They go out after dinner to see the moon.", "早睡不对。晚饭后他们出去赏月。"],
            ["Planting trees is not in the text.", "文中没有种树。"],
          ],
        ),
        ask(
          ["What do families do after dinner?", "晚饭后家人们做什么？"],
          ["Go outside to look at the full moon", "到外面赏满月"],
          [
            ["Wash the car", "洗车"],
            ["Watch the sun rise", "看日出"],
            ["Write letters", "写信"],
          ],
          ["After dinner, they go outside to look at the full moon.", "晚饭后，他们到外面赏满月。"],
          [
            ["Washing the car is not in the text.", "文中没有洗车。"],
            ["Watching the sun rise is wrong. It is night, and they watch the moon.", "看日出不对。那是晚上，他们看月亮。"],
            ["Writing letters is not in the text.", "文中没有写信。"],
          ],
        ),
        ask(
          ["What do children carry?", "孩子们提着什么？"],
          ["Paper lanterns", "纸灯笼"],
          [
            ["Mooncakes", "月饼"],
            ["Candles", "蜡烛"],
            ["Flags", "旗子"],
          ],
          ["Children carry paper lanterns that glow in the dark.", "孩子们提着在黑暗中发光的纸灯笼。"],
          [
            ["Mooncakes are shared, not carried around by children.", "月饼是分着吃的，不是孩子们提着的。"],
            ["Candles are not named. The lanterns glow.", "文中没提蜡烛，发光的是灯笼。"],
            ["Flags are not in the text.", "文中没有旗子。"],
          ],
        ),
        ask(
          ["Which shape can a lantern have?", "灯笼可以是什么形状？"],
          ["A rabbit", "兔子"],
          [
            ["A car", "汽车"],
            ["A house", "房子"],
            ["A tree", "树"],
          ],
          ["Some lanterns are shaped like rabbits, fish or stars.", "有些灯笼的形状像兔子、鱼或星星。"],
          [
            ["A car is not in the text.", "文中没有汽车。"],
            ["A house is not in the text.", "文中没有房子。"],
            ["A tree is not in the text. Lanterns are rabbits, fish or stars.", "文中没有树。灯笼是兔子、鱼或星星形的。"],
          ],
        ),
        ask(
          ["What shape is a mooncake?", "月饼是什么形状的？"],
          ["Round", "圆形"],
          [
            ["Square", "方形"],
            ["Star shaped", "星形"],
            ["Long and thin", "又长又细"],
          ],
          ["A mooncake is a round cake with a sweet filling inside.", "月饼是一种里面有甜馅的圆形糕点。"],
          [
            ["Square is wrong. It is round, like the full moon.", "方形不对。它是圆的，像满月。"],
            ["Star shaped is one kind of lantern, not a mooncake.", "星形是一种灯笼，不是月饼。"],
            ["Long and thin is not in the text.", "文中没说又长又细。"],
          ],
        ),
        ask(
          ["What can be inside a mooncake?", "月饼里面可以有什么？"],
          ["Bean paste or nuts", "豆沙或坚果"],
          [
            ["Meat soup", "肉汤"],
            ["Ice", "冰"],
            ["Paper", "纸"],
          ],
          ["A mooncake has a sweet filling inside, such as bean paste or nuts.", "月饼里面有甜馅，比如豆沙或坚果。"],
          [
            ["Meat soup is not in the text.", "文中没有肉汤。"],
            ["Ice is not in the text.", "文中没有冰。"],
            ["Paper is what lanterns are made of, not the filling.", "纸是灯笼的材料，不是馅儿。"],
          ],
        ),
        ask(
          ["What do people far from home do?", "远离家乡的人做什么？"],
          ["Look at the moon and think of the ones they love", "望着月亮思念所爱的人"],
          [
            ["Forget the festival", "忘记这个节日"],
            ["Go to sleep early", "早早睡觉"],
            ["Carry lanterns to school", "提着灯笼去上学"],
          ],
          [
            "People who live far from home look at the moon too, and think of the ones they love.",
            "远离家乡的人也会望着月亮，思念他们所爱的人。",
          ],
          [
            ["Forgetting the festival is the opposite.", "忘记节日正好相反。"],
            ["Going to sleep early is not in the text.", "文中没说早睡。"],
            ["Carrying lanterns to school is not in the text.", "文中没有提灯笼去学校。"],
          ],
        ),
      ],
      ["China"],
      ["mooncake", "mooncakes"],
    ),
    passage(
      "a-party-for-pedro",
      t("A Party for Pedro", "为佩德罗办的聚会"),
      `Pedro had been the school's gardener for many years. Now he was going to stop working. The children in Class Two wanted to say thank you.

"Let us have a party," said Ella. "But it must be a surprise!" The class made a big card and signed their names on it. They painted a picture of the school garden, with all the sunflowers Pedro had planted.

On his last day, the teacher asked Pedro to come to the classroom. When he opened the door, everyone shouted, "Surprise!" Pedro was so happy that he had tears in his eyes. "This is the best gift a gardener could get," he said. "You have all grown so well."`,
      [parts, feel],
      [
        ask(
          ["Why did the class want to have a party?", "全班为什么想办一个聚会？"],
          ["To say thank you to Pedro", "向佩德罗表示感谢"],
          [
            ["It was Ella's birthday", "那天是埃拉的生日"],
            ["To plant sunflowers", "为了种向日葵"],
            ["It was the first day of school", "那天是开学第一天"],
          ],
          [
            "The story says the children wanted to say thank you because Pedro was going to stop working.",
            "故事说佩德罗要退休了，孩子们想向他道谢。",
          ],
          [
            ["Ella's birthday is not in the story. Ella had the party idea.", "故事里没有埃拉的生日。办聚会是埃拉的主意。"],
            ["Planting sunflowers is what Pedro did before.", "种向日葵是佩德罗以前做的。"],
            ["The first day of school is wrong. It was Pedro's last day.", "开学第一天不对。那是佩德罗的最后一天。"],
          ],
        ),
        ask(
          ["What did the class paint?", "全班画了什么？"],
          ["A picture of the school garden", "一幅学校花园的画"],
          [
            ["A picture of Pedro's house", "一幅佩德罗家的画"],
            ["A big rocket", "一枚大火箭"],
            ["Their classroom", "他们的教室"],
          ],
          [
            "The story says they painted a picture of the school garden, with all the sunflowers.",
            "故事说他们画了一幅学校花园的画，上面有所有的向日葵。",
          ],
          [
            ["Pedro's house is not in the story.", "故事里没有佩德罗的家。"],
            ["A big rocket is from a different story.", "大火箭是另一个故事里的。"],
            ["Their classroom is where the party was, not what they painted.", "教室是聚会的地方，不是他们画的东西。"],
          ],
        ),
        ask(
          ["How did Pedro feel at the surprise?", "看到惊喜时佩德罗有什么感受？"],
          ["So happy that he had tears in his eyes", "高兴得热泪盈眶"],
          [
            ["Angry", "很生气"],
            ["Scared", "很害怕"],
            ["Bored", "很无聊"],
          ],
          ["The story says Pedro was so happy that he had tears in his eyes.", "故事说佩德罗高兴得热泪盈眶。"],
          [
            ["Angry is the opposite. He was so happy.", "生气正好相反。他非常高兴。"],
            ["Scared is not in the story.", "故事里没有害怕。"],
            ["Bored is not in the story. He had tears of joy.", "故事里没有无聊。他高兴得流泪。"],
          ],
        ),
        ask(
          ["What was Pedro's job?", "佩德罗是做什么工作的？"],
          ["The school's gardener", "学校的园丁"],
          [
            ["The school's teacher", "学校的老师"],
            ["The school's cook", "学校的厨师"],
            ["The bus driver", "公共汽车司机"],
          ],
          ["Pedro had been the school's gardener for many years.", "佩德罗当了学校园丁很多年。"],
          [
            ["The school's teacher is who asked Pedro to come.", "学校的老师是请佩德罗过来的人。"],
            ["The school's cook is not in the story.", "故事里没有学校厨师。"],
            ["The bus driver is not in the story. He was the gardener.", "故事里没有司机。他是园丁。"],
          ],
        ),
        ask(
          ["Which class wanted to say thank you?", "哪个班想说谢谢？"],
          ["Class Two", "二班"],
          [
            ["Class One", "一班"],
            ["Class Three", "三班"],
            ["Class Five", "五班"],
          ],
          ["The children in Class Two wanted to say thank you.", "二班的孩子们想说声谢谢。"],
          [
            ["Class One is not in the story.", "故事里没有一班。"],
            ["Class Three is not in the story.", "故事里没有三班。"],
            ["Class Five is not in the story. It was Class Two.", "故事里没有五班。是二班。"],
          ],
        ),
        ask(
          ["Who had the idea of a party?", "谁想到要开聚会？"],
          ["Ella", "艾拉"],
          [
            ["Pedro", "佩德罗"],
            ["The teacher", "老师"],
            ["Leo", "利奥"],
          ],
          ['"Let us have a party," said Ella.', "艾拉说：“我们开个聚会吧。”"],
          [
            ["Pedro did not know. It was a surprise for him.", "佩德罗不知道，这是给他的惊喜。"],
            ["The teacher only asked Pedro to come. Ella had the idea.", "老师只是请佩德罗来。主意是埃拉出的。"],
            ["Leo is not in this story.", "这个故事里没有利奥。"],
          ],
        ),
        ask(
          ["What did Ella say the party must be?", "艾拉说聚会必须是什么样的？"],
          ["A surprise", "一个惊喜"],
          [
            ["Very big", "很盛大"],
            ["In the garden", "在花园里"],
            ["Short", "很短"],
          ],
          ['Ella said, "But it must be a surprise!"', "艾拉说：“但必须是个惊喜！”"],
          [
            ["Very big is not what she said.", "她没说要很大。"],
            ["In the garden is wrong. The party was in the classroom.", "在花园里不对。聚会在教室里。"],
            ["Short is not what she said.", "她没说要短。"],
          ],
        ),
        ask(
          ["What did the class sign their names on?", "全班把名字签在了什么上面？"],
          ["A big card", "一张大卡片"],
          [
            ["A painting", "一幅画"],
            ["A sunflower", "一朵向日葵"],
            ["The door", "门上"],
          ],
          ["The class made a big card and signed their names on it.", "全班做了一张大卡片，并在上面签了名。"],
          [
            ["A painting is what they made too, but they signed the card.", "他们也画了画，但签名签在卡片上。"],
            ["A sunflower is in the painting, not something they signed.", "向日葵是画里的，不是签名的地方。"],
            ["The door is what Pedro opened, not what they signed.", "门是佩德罗打开的，不是签名的地方。"],
          ],
        ),
        ask(
          ["What flowers had Pedro planted?", "佩德罗种过什么花？"],
          ["Sunflowers", "向日葵"],
          [
            ["Roses", "玫瑰"],
            ["Tulips", "郁金香"],
            ["Daisies", "雏菊"],
          ],
          ["They painted the school garden, with all the sunflowers Pedro had planted.", "他们画了学校花园，画上了佩德罗种的所有向日葵。"],
          [
            ["Roses are not in the story.", "故事里没有玫瑰。"],
            ["Tulips are not in the story.", "故事里没有郁金香。"],
            ["Daisies are not in the story. Pedro planted sunflowers.", "故事里没有雏菊。佩德罗种的是向日葵。"],
          ],
        ),
        ask(
          ["What did everyone shout when Pedro opened the door?", "佩德罗开门时大家喊了什么？"],
          ["Surprise!", "惊喜！"],
          [
            ["Goodbye!", "再见！"],
            ["Happy birthday!", "生日快乐！"],
            ["Hello!", "你好！"],
          ],
          ['When he opened the door, everyone shouted, "Surprise!"', "他一开门，大家就喊：“惊喜！”"],
          [
            [
              'Goodbye is what Pedro\'s last day might bring, but they shouted "Surprise!"',
              "这是佩德罗的最后一天，但大家喊的是“惊喜！”而不是“再见”。",
            ],
            ["Happy birthday is wrong. It was not his birthday.", "生日快乐不对。那天不是他的生日。"],
            ["Hello is not what they shouted.", "他们喊的不是“你好”。"],
          ],
        ),
      ],
      ["Pedro", "Ella"],
    ),
  ],
};

/** readingUnits2 are the reading units of grade 2, one for each unit of the course. */
export const readingUnits2: readonly ReadingUnitDef[] = [
  longAgoAndToday,
  ourNeighborhood,
  animalsBigAndSmall,
  talesToTell,
  howThingsWork,
  lettersAndCelebrations,
];
