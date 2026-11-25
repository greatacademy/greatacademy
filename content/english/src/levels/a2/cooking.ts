// A2, unit 4: Cooking. Cooking, ingredients, taste and quantities; a few and a little; steps in order judged by rules
// and a recipe judged by a model.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, interleave, vocabularyTopic, word } from "../words.ts";
import { fill, judgedTopic } from "./kit.ts";
import { quantifiersAFewAndALittleFixNot, writingStepsInOrderWriteNot } from "./mistakes.ts";

const cooking = vocabularyTopic({
  id: "a2-words-cooking",
  title: t("Cooking", "烹饪"),
  summary: t(
    "Recipes; boiling, frying, baking, cutting, mixing, adding, pouring and heating; slices, ovens and pans.",
    "食谱；煮、煎、烤、切、混合、加、倒和加热；片、烤箱和平底锅。",
  ),
  intro: t(
    "Dad reads the **recipe**, puts a **pan** on the stove and starts to **fry** some onions, while the bread **bakes** in the **oven**. These words help you follow the steps of cooking and talk about how food is made.",
    "爸爸看着 **recipe**（食谱），把 **pan**（平底锅）放到炉子上，开始 **fry**（煎）洋葱，面包正在 **oven**（烤箱）里 **bakes**（烘烤）。这些词帮你按步骤做饭，并谈论食物是怎样做出来的。",
  ),
  prerequisites: ["a1-words-meals"],
  words: [
    word(
      "recipe recipes",
      "a list of what you need and the steps for cooking a dish",
      "食谱",
      "Can you write down the {recipe} for this cake? | Grandma wrote her {recipe} for dumplings in a little book. | Follow the {recipe} step by step.",
      "oven pan",
    ),
    word(
      "boil boils boiled boiling",
      "to heat water or food until it bubbles",
      "煮沸；煮",
      "{Boil} the water, then add the noodles. | Water {boils} at 100 degrees.|fries bakes | The soup is {boiling}. Turn down the heat.|frying baking",
      "fry bake",
    ),
    word(
      "fry fries fried frying",
      "to cook in hot oil",
      "油炸；煎",
      "{Fry} the onions in a little oil. | Dad {fried} the fish in a hot pan.|boiled poured | Don't {fry} food in so much oil every day. It isn't healthy.",
      "boil pour",
    ),
    word(
      "bake bakes baked baking",
      "to cook in an oven",
      "烘焙；烤",
      "Mom {baked} a cake for my birthday.|boiled fried | {Bake} the bread for forty minutes. | I love the smell of {baking} bread.|boiling frying",
      "boil fry",
    ),
    word(
      "cut cuts cutting",
      "to make something into pieces with a knife",
      "切",
      "{Cut} the apple in half. | I {cut} my finger with a knife.|mixed poured | Can you {cut} the bread, please?",
      "mix pour",
    ),
    word(
      "mix mixes mixed mixing",
      "to put things together and stir them",
      "混合",
      "{Mix} the flour and the eggs. | Red and yellow {mixed} together make orange.|boiled fried | {Mix} everything well in a big bowl.",
      "boil fry",
    ),
    word(
      "add adds added adding",
      "to put something with something else",
      "加；添加",
      "{Add} a little salt to the soup. | If you {add} 2 and 3, you get 5. | Can you {add} some sugar to my tea?",
      "cut bake",
    ),
    word(
      "pour pours poured pouring",
      "to make a liquid flow out of something",
      "倒；倾倒",
      "{Pour} the milk into a glass. | Can you {pour} me some water? | It's {pouring} with rain!|cutting frying",
      "cut fry",
    ),
    word(
      "heat heats heated heating",
      "to make something hot; how hot something is",
      "加热；热",
      "{Heat} the oil in a pan. | I can't sleep in this {heat}.|pan recipe | {Heat} the soup before you eat it.",
      "fry cut",
    ),
    word(
      "slice slices",
      "a thin flat piece cut from something",
      "片",
      "Can I have a {slice} of cake? | I had two {slices} of pizza.|pans recipes | Cut the lemon into thin {slices}.|pans recipes",
      "pan recipe",
    ),
    word(
      "oven ovens",
      "a box in a kitchen that you heat to bake food in",
      "烤箱",
      "Put the cake in the hot {oven} to bake for thirty minutes. | Be careful! The {oven} door is hot. | Our {oven} is broken, so we can't bake bread.",
      "pan recipe",
    ),
    word(
      "pan pans",
      "a metal pot with a handle, for cooking",
      "平底锅；锅",
      "Fry the eggs in the {pan}. | Wash the dirty {pans} in the sink after dinner.|ovens recipes | Put some oil in the {pan}.",
      "oven recipe",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Boil*, *fry* and *bake* are three ways to cook: you boil in hot water, fry in hot oil and bake in an oven. Look for *water*, *oil* or *oven* and the food in the sentence.",
        "*boil*、*fry* 和 *bake* 是三种做法：boil 是在开水里煮，fry 是用热油煎炸，bake 是放进烤箱烤。找找句子里有没有 *water*、*oil*、*oven* 和是什么食物。",
      ),
      meaning: t(
        "A *recipe* is the list of things and steps for cooking a dish. It is not the food itself, and not the *oven* or *pan* you cook it in.",
        "*recipe* 是做一道菜所需的材料和步骤清单，不是食物本身，也不是做菜用的 *oven* 或 *pan*。",
      ),
      spell: t(
        "*Fry* changes y to i in *fries* and *fried* but keeps the y in *frying*, and the final e of *recipe* is said: re · ci · pe.",
        "*fry* 在 *fries*、*fried* 里把 y 变成 i，但 *frying* 保留 y；*recipe* 词尾的 e 要读出来：re · ci · pe。",
      ),
    },
    notes: `
      recipe|the written steps for making a cake;Grandma's written steps for dumplings in a little book;steps to follow one by one|a recipe tells you how to cook a dish; an oven is a thing you cook in|recipe 告诉你怎样做一道菜；oven 是做菜用的器具|oven=oven is a hot box in the kitchen that you bake food in, not something you can write down or follow step by step=oven 是厨房里烤东西的箱子，不能写下来，也不能一步步照着做;pan=pan is a metal pot with a handle that you cook in, not a list of steps=pan 是带柄的金属锅，不是步骤清单|re · ci · pe|c said like s, and the final e is said, not silent|c 读作 s，词尾的 e 要读出来，不是不发音
      boil|water heated before the noodles go in;water at 100 degrees;soup so hot that it bubbles|you boil food in hot water; you fry it in hot oil|boil 是在开水里煮；fry 是在热油里煎炸|fry=fry means cooking in hot oil, not water or soup bubbling as it gets very hot=fry 是用热油煎炸，不是水或汤烧开冒泡;bake=bake means cooking in an oven, not making water or soup bubble=bake 是用烤箱烤，不是把水或汤烧开|boil|oi, as in *oil*|oi 和 *oil* 里的一样
      fry|onions cooked in a little oil;fish cooked in a hot pan;cooking in a lot of oil every day|you fry food in hot oil; you boil it in water|fry 是在热油里煎炸；boil 是在水里煮|boil=boil means cooking in bubbling water, not in hot oil in a pan=boil 是在沸水里煮，不是在锅里用热油煎;pour=pour means making a liquid flow out of a bottle or jug, not cooking food=pour 是把液体从瓶子或壶里倒出来，不是做饭|fry|y that changes to i in *fries* and *fried*, but stays in *frying*|y 在 *fries*、*fried* 里变成 i，在 *frying* 里不变
      bake|a birthday cake made in an oven;bread cooked for forty minutes;the smell of bread in the oven|you bake bread and cakes in an oven; you fry food in oil|bake 是在烤箱里烤面包和蛋糕；fry 是用油煎|boil=boil means cooking in bubbling water, and cakes and bread are not cooked in water=boil 是在沸水里煮，蛋糕和面包不是用水煮的;fry=fry means cooking in hot oil in a pan, not making cakes and bread in an oven=fry 是在锅里用热油煎，不是在烤箱里做蛋糕面包|bake|the silent e that drops in *baking*|词尾 e 不发音，*baking* 里要去掉
      cut|an apple made into two halves;a finger hurt by a knife;bread made into pieces|you cut with a knife; you mix things by stirring them together|cut 是用刀切；mix 是把东西搅在一起|mix=mix means stirring things together, not making pieces with a knife=mix 是把东西搅拌在一起，不是用刀切成块;pour=pour means making a liquid flow out, and apples, fingers and bread are not liquids=pour 是倒液体，而苹果、手指和面包都不是液体|cut|the past is also *cut*, and *cutting* doubles the t|过去式也是 *cut*；*cutting* 要双写 t
      mix|flour and eggs put together and stirred;red and yellow together making orange;everything stirred well in a big bowl|you mix things into one; you boil water until it bubbles|mix 是把东西合在一起；boil 是把水烧开|boil=boil means heating water until it bubbles, not putting things together=boil 是把水烧到冒泡，不是把东西合在一起;fry=fry means cooking in hot oil, not stirring things together in a bowl=fry 是用热油煎，不是在碗里搅拌|mix|the x at the end, and -es for *mixes*|词尾是 x，第三人称单数加 -es：*mixes*
      add|salt put into the soup;2 and 3 put together to make 5;sugar put into tea|you add a thing to something else; you cut a thing into pieces|add 是加进去；cut 是切成块|cut=cut means making pieces with a knife, and it is never followed by *to* the soup or the tea=cut 是用刀切成块，后面不会接 *to* 汤或茶;bake=bake means cooking in an oven, not putting one thing into another=bake 是用烤箱烤，不是把一样东西加进另一样|add|the double d at the end|词尾双写 d
      pour|milk going into a glass;some water for someone;very heavy rain|you pour a liquid; you cut solid food|pour 倒的是液体；cut 切的是固体食物|cut=cut means making pieces with a knife, but milk, water and rain cannot be cut=cut 是用刀切，而牛奶、水和雨都切不了;fry=fry means cooking in hot oil, not making a liquid flow out=fry 是用热油煎，不是把液体倒出来|pour|our said like or, as in *four*|our 读作 or，和 *four* 一样
      heat|oil made hot in a pan;the hot weather that keeps someone awake;soup made hot before eating|to heat food is to make it hot; to fry food is to cook it in hot oil|heat 是把食物加热；fry 是用热油煎|fry=fry means cooking food in hot oil, and you cannot fry the oil itself or a soup=fry 是用热油煎食物，不能煎油本身，也不能煎汤;cut=cut means making pieces with a knife, and oil and soup cannot be cut=cut 是用刀切，油和汤都切不了;pan=pan is a metal pot for cooking, not the hot weather that keeps you awake=pan 是做饭的金属锅，不是让人睡不着的炎热;recipe=recipe is a list of cooking steps, not hot weather=recipe 是做菜的步骤清单，不是炎热的天气|heat|ea for the long e sound, as in *eat*|ea 发长 e 音，和 *eat* 一样
      slice|a thin piece of cake;two thin pieces of pizza;a lemon cut into thin pieces|a slice is a thin piece of food; a pan is a pot you cook in|slice 是一片食物；pan 是做饭的锅|pan=pan is a metal pot for cooking, not a thin piece of food you can eat=pan 是做饭的金属锅，不是能吃的一片食物;recipe=recipe is a list of cooking steps, not a piece of food=recipe 是做菜的步骤清单，不是一片食物|slice|ice at the end, said like *ice*|结尾是 ice，读音和 *ice* 一样
      oven|a hot box where a cake bakes for thirty minutes;a hot door in the kitchen;a broken thing that stops us baking bread|an oven is a hot box you bake in; a pan is a pot for the stove|oven 是用来烤东西的箱子；pan 是放在炉子上的锅|pan=pan is a metal pot on the stove, with no door, and you do not bake bread in it=pan 是炉子上的金属锅，没有门，也不用来烤面包;recipe=recipe is a list of cooking steps, which cannot be hot or have a door=recipe 是做菜的步骤清单，不会烫，也没有门|o · ven|o said like u, as in *love*|o 读作 u，和 *love* 一样
      pan|a pot for frying eggs;dirty pots washed in the sink;a pot with some oil in it|a pan is a metal pot for the stove; an oven is a big hot box|pan 是炉子上的金属锅；oven 是很大的烤箱|oven=oven is a big box you bake in, and it does not go in the sink=oven 是用来烤东西的大箱子，不能放进水槽;recipe=recipe is a list of steps, and you cannot fry eggs or pour oil in it=recipe 是步骤清单，不能在里面煎蛋或倒油|pan|a short a, as in *man*|短元音 a，和 *man* 一样
    `,
  },
});

const ingredients = vocabularyTopic({
  id: "a2-words-ingredients",
  title: t("Ingredients", "食材"),
  summary: t(
    "Flour, butter, oil, pepper, onions, garlic, carrots, beans, corn, sauce, honey and lemons.",
    "面粉、黄油、油、胡椒、洋葱、大蒜、胡萝卜、豆子、玉米、酱、蜂蜜和柠檬。",
  ),
  intro: t(
    "For pancakes we need **flour**, eggs and milk, a little **butter** for the pan and some **honey** on top. These words help you name what goes into a dish and say how it tastes.",
    "做煎饼要用 **flour**（面粉）、鸡蛋和牛奶，锅里放一点 **butter**（黄油），上面再淋些 **honey**（蜂蜜）。这些词帮你说出一道菜用了哪些材料，以及它是什么味道。",
  ),
  prerequisites: ["a2-words-cooking"],
  words: [
    word(
      "flour",
      "a white powder made from wheat, used to make bread and cakes",
      "面粉",
      "You need {flour}, eggs and milk to make pancakes. | Bread is made from {flour} and water. | {Flour} is a white powder. We use it to make bread.",
      "garlic pepper",
    ),
    word(
      "butter",
      "a yellow food made from milk, that you put on bread",
      "黄油",
      "I like bread with {butter} and jam. | Melt the {butter} in a pan. | {Butter} is made from milk.",
      "pepper garlic",
    ),
    word(
      "oil oils",
      "a thick liquid from plants, used for cooking",
      "油",
      "Fry the fish in hot {oil}. | Add a little olive {oil}. | This bottle of cooking {oil} is almost empty.",
      "flour honey",
    ),
    word(
      "pepper peppers",
      "a hot powder you put on food; a red, green or yellow vegetable",
      "胡椒；甜椒",
      "Add salt and {pepper} to the soup. | A green {pepper} tastes sweet and crunchy in a salad. | This soup has too much {pepper}. It's hot and makes me sneeze!",
      "garlic honey",
    ),
    word(
      "onion onions",
      "a round vegetable with a strong smell that makes you cry when you cut it",
      "洋葱",
      "Cutting {onions} makes me cry.|lemons honey | Fry the {onion} until it is soft. | I put a red {onion} in the salad, and now my breath smells strong.",
      "lemon honey",
    ),
    word(
      "garlic",
      "a small white plant with a strong taste, used in cooking",
      "大蒜",
      "Add two pieces of {garlic} to the oil. | I can smell {garlic} on your breath. | Some people eat {garlic} to stay healthy, but it makes their breath smell.",
      "honey flour",
    ),
    word(
      "carrot carrots",
      "a long orange vegetable",
      "胡萝卜",
      "Rabbits love crunchy orange {carrots}.|lemons beans | A {carrot} is long and orange. | Cut the long orange {carrots} into slices.|lemons beans",
      "lemon bean",
    ),
    word(
      "bean beans",
      "a seed of a plant that you cook and eat",
      "豆",
      "Tofu is made from {beans}.|carrots lemons | Green {beans} are good for you.|carrots lemons | We had rice and black {beans} for dinner.|carrots lemons",
      "carrot lemon",
    ),
    word(
      "corn",
      "a tall plant with yellow seeds that you eat",
      "玉米",
      "Popcorn is made from {corn}. | Chickens eat {corn}. | There are fields of tall yellow {corn} near the village.",
      "flour honey",
    ),
    word(
      "sauce sauces",
      "a thick liquid you eat with food",
      "酱；调味汁",
      "Noodles with tomato {sauce} are my favorite. | Do you want soy {sauce} with your dumplings? | The chef makes a special {sauce} for the fish.",
      "flour corn",
    ),
    word(
      "honey",
      "a sweet food that bees make",
      "蜂蜜",
      "Bees make {honey}. | I put {honey} in my tea. | This cake is sweet because of the {honey}.",
      "butter garlic",
    ),
    word(
      "lemon lemons",
      "a yellow fruit with a very sour taste",
      "柠檬",
      "A {lemon} is yellow and sour. | Hot water with {lemon} and honey is good for a cold. | I'd like tea with {lemon}, please.",
      "carrot bean",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Look at what the sentence says about taste and look: *honey* is sweet, a *lemon* is sour and yellow, *pepper* makes food hot, *garlic* and *onions* smell strong, and *flour* is a white powder.",
        "看句子怎样描述味道和样子：*honey* 是甜的，*lemon* 又酸又黄，*pepper* 让食物变辣，*garlic* 和 *onion* 气味浓，*flour* 是白色粉末。",
      ),
      meaning: t(
        "*Pepper* has two meanings: a hot powder you shake on food, and a red, green or yellow vegetable. Both are *pepper*.",
        "*pepper* 有两个意思：撒在食物上的辣味粉末（胡椒），以及红、绿、黄色的蔬菜（甜椒）。两种都叫 *pepper*。",
      ),
      spell: t(
        "*Flour* for bread and cakes sounds just like *flower* in a garden: for cooking, write f-l-o-u-r.",
        "做面包蛋糕的 *flour* 和花园里的 *flower* 读音完全一样：做饭用的要写 f-l-o-u-r。",
      ),
    },
    notes: `
      flour|pancakes made with eggs and milk;bread made with water;a white powder for making bread|flour is a white powder for bread and cakes; pepper is a hot powder|flour 是做面包蛋糕的白色粉末；pepper 是辣味粉末|garlic=garlic is a small white plant with a strong taste, not a powder for making bread and pancakes=garlic 是味道很冲的白色小植物，不是做面包和煎饼的粉;pepper=pepper is a hot powder you shake on food in small amounts, not what bread and pancakes are made of=pepper 是少量撒在食物上的辣味粉，不是做面包和煎饼的原料|flour|our, said like *flower*, but written f-l-o-u-r|our 的读音和 *flower* 一样，但拼作 f-l-o-u-r
      butter|something on bread with jam;something melted in a pan;a food made from milk|butter is a yellow food made from milk; pepper is a hot powder|butter 是用牛奶做的黄色食物；pepper 是辣味粉末|pepper=pepper is a hot powder or a vegetable, not a food made from milk=pepper 是辣味粉末或蔬菜，不是用牛奶做的食物;garlic=garlic is a plant with a strong smell, not a soft yellow food made from milk=garlic 是气味很冲的植物，不是用牛奶做的软软的黄色食物|but · ter|the double t in the middle|中间双写 t
      oil|hot liquid for frying fish;olive liquid added to food;a bottle of cooking liquid|oil is a liquid for cooking; flour is a dry powder|oil 是做饭用的液体；flour 是干的粉末|flour=flour is a dry white powder, not a liquid you fry in or keep in a bottle=flour 是干的白色粉末，不是用来煎炸、装在瓶子里的液体;honey=honey is a sweet food made by bees, not a cooking liquid from plants=honey 是蜜蜂酿的甜食，不是从植物里来的食用油|oil|oi, as in *boil*|oi 和 *boil* 里的一样
      pepper|salt and a hot powder added to soup;a green vegetable, sweet and crunchy in a salad;a hot powder that makes someone sneeze|pepper is hot or a crunchy vegetable; honey is sweet|pepper 是辣的粉或脆的蔬菜；honey 是甜的|garlic=garlic is a small white plant with a strong smell, not a green vegetable and not the hot powder you shake with salt=garlic 是气味很冲的白色小植物，不是绿色蔬菜，也不是和盐一起撒的辣粉;honey=honey is a sweet food made by bees, not hot and not a vegetable=honey 是蜜蜂酿的甜食，不辣，也不是蔬菜|pep · per|the double p in the middle|中间双写 p
      onion|vegetables that make someone cry when cut;a vegetable fried until soft;a red vegetable that makes breath smell strong|an onion has a strong smell and makes you cry; a lemon is sour|onion 气味很冲，会让人流泪；lemon 是酸的|lemon=lemon is a sour yellow fruit that does not make you cry or make your breath smell=lemon 是酸的黄色水果，不会让人流泪，也不会让口气难闻;honey=honey is a sweet food made by bees, not a vegetable you cut, fry or eat in a salad=honey 是蜜蜂酿的甜食，不是切、炒或放进沙拉的蔬菜|on · ion|o said like u, as in *son*, and -ion at the end|o 读作 u，和 *son* 一样，结尾是 -ion
      garlic|pieces of a plant added to oil;a strong smell on someone's breath;a plant some people eat to stay healthy|garlic is a small white plant with a strong taste; honey is sweet|garlic 是味道很冲的白色小植物；honey 是甜的|honey=honey is a sweet food made by bees, not a plant that comes in pieces or makes your breath smell=honey 是蜜蜂酿的甜食，不是一瓣一瓣的植物，也不会让口气难闻;flour=flour is a white powder for bread, not a plant with a strong smell=flour 是做面包的白色粉末，不是气味很冲的植物|gar · lic|-ic at the end, with no k|结尾是 -ic，没有 k
      carrot|crunchy orange food that rabbits love;a long, orange vegetable;long orange vegetables cut into slices|a carrot is a long orange vegetable; a lemon is a yellow fruit|carrot 是长长的橙色蔬菜；lemon 是黄色水果|lemon=lemon is a round, yellow, sour fruit, not a long orange vegetable=lemon 是圆圆的黄色酸水果，不是长长的橙色蔬菜;bean=bean is a small seed you cook, not a long orange vegetable=bean 是煮着吃的小豆子，不是长长的橙色蔬菜|car · rot|the double r in the middle|中间双写 r
      bean|seeds that tofu is made from;green seeds and pods that are good for you;small black seeds eaten with rice|a bean is a seed you cook; a carrot is a long orange vegetable|bean 是煮着吃的豆子；carrot 是长长的橙色蔬菜|carrot=carrot is a long orange vegetable, and tofu is not made from it=carrot 是长长的橙色蔬菜，豆腐不是用它做的;lemon=lemon is a sour yellow fruit, not a seed you cook and eat with rice=lemon 是酸的黄色水果，不是和米饭一起吃的豆子|bean|ea for the long e sound, as in *eat*|ea 发长 e 音，和 *eat* 一样
      corn|what popcorn is made from;what chickens eat;tall yellow plants in fields near a village|corn is a tall plant with yellow seeds; flour is a powder made from wheat|corn 是长着黄色籽粒的高秆植物；flour 是小麦磨成的粉|flour=flour is a white powder made in a mill, not seeds that pop or plants that grow in fields=flour 是磨出来的白色粉末，不是能爆开的籽粒，也不是长在田里的植物;honey=honey is a sweet food made by bees, not a plant with yellow seeds=honey 是蜜蜂酿的甜食，不是长着黄色籽粒的植物|corn|or, as in *for*|or 和 *for* 里的一样
      sauce|a tomato liquid on noodles;a soy liquid for dumplings;a special thick liquid for fish|a sauce is a thick liquid you eat with food; flour is a dry powder|sauce 是配着食物吃的浓汁；flour 是干粉末|flour=flour is a dry white powder for making bread, not a liquid you eat with noodles or fish=flour 是做面包的干的白色粉末，不是配面条或鱼吃的酱汁;corn=corn is a plant with yellow seeds, not a thick liquid made from tomato or soy=corn 是长着黄色籽粒的植物，不是用番茄或大豆做的酱汁|sauce|au said like or, and -ce at the end|au 读作 or，结尾是 -ce
      honey|a sweet food bees make;something sweet put in tea;what makes a cake sweet|honey is sweet and made by bees; butter is made from milk|honey 是蜜蜂酿的，很甜；butter 是牛奶做的|butter=butter is a food made from milk, not something bees make or a sweet thing for tea=butter 是牛奶做的食物，不是蜜蜂酿的，也不是放进茶里的甜东西;garlic=garlic has a strong smell and is not sweet=garlic 气味很冲，一点也不甜|hon · ey|o said like u, as in *money*, and -ey at the end|o 读作 u，和 *money* 一样，结尾是 -ey
      lemon|a yellow, sour fruit;a fruit in hot water with honey for a cold;a fruit in tea|a lemon is a sour yellow fruit; a carrot is an orange vegetable|lemon 是酸的黄色水果；carrot 是橙色蔬菜|carrot=carrot is a long orange vegetable, not a sour yellow fruit you put in tea=carrot 是长长的橙色蔬菜，不是放进茶里的酸的黄色水果;bean=bean is a small seed you cook, not a sour yellow fruit=bean 是煮着吃的小豆子，不是酸的黄色水果|lem · on|-on at the end, not -en|结尾是 -on，不是 -en
    `,
  },
});

const taste = vocabularyTopic({
  id: "a2-words-taste",
  title: t("Taste", "味道"),
  summary: t(
    "Tasting and smelling; delicious, sweet, sour, salty, spicy, fresh, raw and bitter food; meals.",
    "品尝和闻；美味的、甜的、酸的、咸的、辣的、新鲜的、生的和苦的食物；一顿饭。",
  ),
  intro: t(
    "The curry is **spicy**, the lemonade is **sour**, and the cake is **sweet** and **delicious**. These words help you say what food tastes and smells like and whether you like it.",
    "咖喱是 **spicy**（辣的），柠檬水是 **sour**（酸的），蛋糕又 **sweet**（甜）又 **delicious**（美味）。这些词帮你说出食物尝起来、闻起来怎么样，以及你喜不喜欢。",
  ),
  prerequisites: ["a2-words-ingredients"],
  words: [
    word(
      "taste tastes tasted tasting",
      "what food is like in your mouth; to try a little food",
      "味道；品尝",
      "I tried a spoonful. This soup {tastes} too salty.|smells sounds | Put a little sauce on your tongue and {taste} it before you add more salt. | When you bite a lemon, it has a sour {taste}.",
      "smell sound",
    ),
    word(
      "delicious",
      "very good to eat",
      "美味的",
      "Mmm, this cake is {delicious}! | Thank you for the {delicious} meal. | The dumplings were {delicious}. I ate twenty!",
      "raw bitter",
    ),
    word(
      "sweet sweeter sweetest",
      "tasting like sugar",
      "甜的",
      "Sugar and honey are {sweet}. | This tea is too {sweet}. You put in too much sugar. | I like {sweet} things like cakes and ice cream.",
      "sour salty",
    ),
    word(
      "sour sourer sourest",
      "tasting like a lemon",
      "酸的",
      "Lemons are {sour}. | This milk is old. It tastes {sour}. | The green apples were very {sour}, so I added sugar.",
      "sweet spicy",
    ),
    word(
      "salty saltier saltiest",
      "with a lot of salt",
      "咸的",
      "Sea water is {salty}. | I'm thirsty. The chips were very {salty}. | This soup is too {salty}. Who put in so much salt?",
      "sweet sour",
    ),
    word(
      "spicy spicier spiciest",
      "with a hot, strong taste",
      "辣的",
      "Sichuan food is very {spicy}. | This curry is too {spicy}. My mouth is on fire! | Do you like {spicy} food? — Yes, I love chilies.",
      "sweet sour",
    ),
    word(
      "fresh fresher freshest",
      "just made or picked, not old",
      "新鲜的",
      "These flowers are {fresh}. I picked them this morning. | This bread is {fresh}. It's still warm. | Open the window and let in some {fresh} air.",
      "raw bitter",
    ),
    word(
      "raw",
      "not cooked",
      "生的",
      "In sushi, the fish is {raw}. Nobody cooks it. | Don't eat {raw} meat. Cook it first. | Carrots are good {raw} or cooked.",
      "fresh bitter",
    ),
    word(
      "smell smells smelled smelling",
      "to notice something with your nose; what you notice with your nose",
      "闻；气味",
      "I love the {smell} of fresh bread coming from the kitchen. | Open the window! Something {smells} bad in here.|tastes feels | Dogs use their noses to {smell} food from far away.",
      "taste feel",
    ),
    word(
      "bitter",
      "with a strong taste that is not sweet, like coffee without sugar",
      "苦的",
      "Coffee without sugar is {bitter}. | Dark chocolate has little sugar, so it is a little {bitter}. | Black tea is {bitter} if you leave it too long.",
      "sweet salty",
    ),
    word(
      "meal meals",
      "the food you eat at one time, like breakfast or dinner",
      "一顿饭",
      "Breakfast is the first {meal} of the day. | We had a big {meal} at Grandma's. | Wash your hands before {meals}.|tastes smells",
      "taste smell",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Taste* and *smell* are close: you *taste* food in your mouth and *smell* it with your nose. Look for *mouth*, *tongue*, *nose* or a smell coming from somewhere.",
        "*taste* 和 *smell* 很接近：*taste* 是用嘴尝，*smell* 是用鼻子闻。找找句子里有没有 *mouth*、*tongue*、*nose*，或者气味从哪里飘来。",
      ),
      meaning: t(
        "*Fresh* and *raw* are different: *fresh* food is new, not old, and *raw* food is not cooked. Fresh bread is cooked, and a piece of old meat can still be raw.",
        "*fresh* 和 *raw* 意思不同：*fresh* 是新鲜、不陈旧，*raw* 是生的、没煮过。新鲜面包是烤熟的，放久的肉也可能是生的。",
      ),
      spell: t(
        "*Delicious* ends in -cious, said like *shus*: de · li · cious. Write c-i-o-u-s, not -shus.",
        "*delicious* 以 -cious 结尾，读作 *shus*：de · li · cious。要写成 c-i-o-u-s，不要写成 -shus。",
      ),
    },
    notes: `
      taste|soup tried from a spoonful;sauce put on the tongue before more salt;the sour feeling of biting a lemon|you taste with your mouth; you smell with your nose|taste 用嘴尝；smell 用鼻子闻|smell=smell is what you notice with your nose, not what you notice when food is in your mouth=smell 是用鼻子闻到的，不是食物在嘴里尝到的;sound/sounds=sound is what you hear with your ears, not what food is like in your mouth=sound 是用耳朵听到的，不是食物在嘴里的味道|taste|a long a, and the silent e at the end|长元音 a，词尾 e 不发音
      delicious|a cake that makes someone say "Mmm";a meal someone says thank you for;dumplings so good someone ate twenty|delicious means very good to eat; bitter is a strong taste many people dislike|delicious 是非常好吃；bitter 是很多人不喜欢的苦味|raw=raw means not cooked, which does not make food good to eat=raw 是没煮过的，并不表示好吃;bitter=bitter is a strong taste like coffee without sugar, not a taste that makes you eat twenty=bitter 是像不加糖的咖啡那样的苦味，不会让人想吃二十个|de · li · cious|the ending -cious, said like *shus*|结尾 -cious 读作 *shus*
      sweet|the taste of sugar and honey;tea with too much sugar;cakes and ice cream|sweet tastes like sugar; sour tastes like a lemon|sweet 是糖的味道；sour 是柠檬的味道|sour=sour is the taste of a lemon, not the taste of sugar=sour 是柠檬的味道，不是糖的味道;salty=salty means with a lot of salt, not with a lot of sugar=salty 是盐放多了，不是糖放多了|sweet|the double e, as in *tree*|两个 e，和 *tree* 一样
      sour|the taste of lemons;old milk;green apples that needed sugar|sour tastes like a lemon; sweet tastes like sugar|sour 是柠檬的味道；sweet 是糖的味道|sweet=sweet is the taste of sugar, and you would not add sugar to food that is already sweet=sweet 是糖的味道，已经甜的东西不用再加糖;spicy=spicy is the hot taste of chilies, not the taste of lemons, old milk or green apples=spicy 是辣椒的辣味，不是柠檬、变质牛奶或青苹果的味道|sour|our, as in *our*|our 的读音和 *our* 一样
      salty|sea water;chips that make someone thirsty;soup with too much salt|salty means with a lot of salt; sweet means with a lot of sugar|salty 是盐多；sweet 是糖多|sweet=sweet is the taste of sugar, not of salt=sweet 是糖的味道，不是盐的味道;sour=sour is the taste of a lemon, not of salt=sour 是柠檬的味道，不是盐的味道|sal · ty|salt with a y added|在 salt 后面加 y
      spicy|Sichuan food;a curry that sets the mouth on fire;food for someone who loves chilies|spicy is the hot taste of chilies; sour is the taste of a lemon|spicy 是辣椒的辣味；sour 是柠檬的酸味|sweet=sweet is the taste of sugar, which does not set your mouth on fire=sweet 是糖的味道，不会让嘴里火辣辣的;sour=sour is the taste of a lemon, not the hot taste of chilies=sour 是柠檬的酸味，不是辣椒的辣味|spi · cy|spice with the e changed to y|把 spice 的 e 换成 y
      fresh|flowers picked this morning;warm bread just made;clean air from an open window|fresh means just made or picked; raw means not cooked|fresh 是刚做好或刚摘下的；raw 是没煮过的|raw=raw means not cooked, and flowers, warm bread and air are not food you cook=raw 是没煮过的，而花、热面包和空气都不是要煮的食物;bitter=bitter is a strong taste like coffee without sugar, not something new and clean=bitter 是像不加糖的咖啡那样的苦味，不是新鲜干净的|fresh|sh at the end|结尾是 sh
      raw|fish in sushi that nobody cooks;meat that must be cooked first;carrots eaten without cooking|raw means not cooked; fresh means new, not old|raw 是没煮过；fresh 是新鲜、不陈旧|fresh=fresh means new and not old, and it does not tell you whether food is cooked=fresh 是新鲜、不陈旧，并不说明食物有没有煮过;bitter=bitter is a strong taste like coffee without sugar, not food that is not cooked=bitter 是像不加糖的咖啡那样的苦味，不是没煮过的食物|raw|aw, said like or, as in *saw*|aw 读作 or，和 *saw* 一样
      smell|bread from the kitchen;something bad in the air of a room;food that dogs find with their noses|you smell with your nose; you taste with your mouth|smell 用鼻子闻；taste 用嘴尝|taste=taste is what food is like in your mouth, not what your nose notices from far away=taste 是食物在嘴里的味道，不是鼻子从远处闻到的;feel=feel means noticing something by touch or in your body, not with your nose=feel 是靠触摸或身体感觉，不是用鼻子闻|smell|the double l at the end|词尾双写 l
      bitter|coffee without sugar;dark chocolate with little sugar;black tea left too long|bitter is a strong taste that is not sweet; sweet tastes of sugar|bitter 是不甜的苦味；sweet 是糖的甜味|sweet=sweet is the taste of sugar, but these drinks and foods have little or no sugar=sweet 是糖的味道，而这些饮料和食物几乎没有糖;salty=salty means with a lot of salt, and coffee, chocolate and tea are not salty=salty 是盐放多了，而咖啡、巧克力和茶都不咸|bit · ter|the double t in the middle|中间双写 t
      meal|breakfast, the first food of the day;a big dinner at Grandma's;the times we eat, when we wash our hands first|a meal is the food you eat at one time; a taste is what food is like in your mouth|meal 是一顿饭；taste 是食物在嘴里的味道|taste=taste is what food is like in your mouth, not breakfast or dinner=taste 是食物在嘴里的味道，不是早饭或晚饭;smell=smell is what your nose notices, not the food you eat at one time=smell 是鼻子闻到的气味，不是一顿饭|meal|ea for the long e sound, as in *eat*|ea 发长 e 音，和 *eat* 一样
    `,
  },
});

const quantities = vocabularyTopic({
  id: "a2-words-quantities",
  title: t("Quantities", "数量"),
  summary: t(
    "Pieces, kilos, grams, liters, bits and pairs; few, little, enough, plenty, amounts and extra.",
    "块、千克、克、升、一点和一对；few、little、enough、plenty、数量和额外的。",
  ),
  intro: t(
    "For the party we buy a **kilo** of rice, two **liters** of juice and a **few** big cakes, so there is **plenty** for everyone. These words help you say how much or how many you need when you shop and cook.",
    "为了聚会，我们买了一 **kilo**（公斤）大米、两 **liters**（升）果汁和 **few**（几个）大蛋糕，这样每个人都有 **plenty**（足够多的）东西吃。这些词帮你在购物和做饭时说出需要多少。",
  ),
  prerequisites: ["a2-words-taste"],
  words: [
    word(
      "piece pieces",
      "one part of something",
      "一块；一片",
      "Can I have a small {piece} of your birthday cake? | I need a {piece} of paper to write a note. | The plate fell and broke into {pieces}.|pairs kilos",
      "pair kilo",
    ),
    word(
      "kilo kilos",
      "a thousand grams",
      "千克；公斤",
      "A {kilo} of apples, please. | This bag of rice is five {kilos}.|liters grams | The baby was three {kilos} when she was born.|liters grams",
      "liter gram",
    ),
    word(
      "gram grams",
      "a very small amount of weight; there are a thousand in a kilo",
      "克",
      "Add 200 {grams} of flour.|kilos liters | This letter is only 20 {grams}.|kilos liters | A {gram} is very light.",
      "kilo liter",
    ),
    word(
      "liter liters",
      "an amount of liquid; a big bottle of water holds one or two",
      "升",
      "We need two {liters} of milk.|kilos grams | Drink about two {liters} of water a day.|kilos grams | This bottle holds one {liter}.",
      "kilo gram",
    ),
    word(
      "bit bits",
      "a small piece or amount",
      "一点；小块",
      "I'm a {bit} tired. | Add a {bit} of salt. | Can I have a {bit} more time, please?",
      "few piece",
    ),
    word(
      "few",
      "not many; with a: some",
      "很少；（a few）几个",
      "There are a {few} apples in the bag. | I have a {few} friends in this town. | Very {few} people came to the party, so it was quiet.",
      "little bit",
    ),
    word(
      "little less least",
      "not much; with a: some",
      "很少；（a little）一点",
      "Add a {little} oil to the pan. | There's very {little} milk left. Let's buy some. | I speak a {little} French.",
      "few bit",
    ),
    word(
      "enough",
      "as much or as many as you need",
      "足够的",
      "Do we have {enough} chairs for everyone? | I didn't have {enough} money to buy it. | Is there {enough} food for ten people?",
      "plenty amount",
    ),
    word(
      "plenty",
      "a lot, more than enough",
      "大量；充足",
      "Don't hurry. We have {plenty} of time. | There's {plenty} of food, so invite your friends. | Drink {plenty} of water when it's hot.",
      "enough few",
    ),
    word(
      "pair pairs",
      "two things of the same kind used together",
      "一双；一对",
      "I bought a new {pair} of shoes. | A {pair} of glasses costs a lot. | Work in {pairs}: two students in each group.|pieces kilos",
      "piece kilo",
    ),
    word(
      "amount amounts",
      "how much there is of something",
      "数量；数额",
      "Use a small {amount} of salt. | That's a lot of money! What a large {amount}! | The {amount} of rain this year is low.",
      "pair kilo",
    ),
    word(
      "extra",
      "more than usual",
      "额外的",
      "Can I have {extra} cheese on my pizza? | We have one {extra} bed if you want to stay. | Breakfast is {extra}: it costs five dollars more.",
      "enough plenty",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*A few* goes with things you can count, as in *a few apples*, and *a little* goes with things you cannot count, as in *a little oil*. Look at the noun after the gap.",
        "*a few* 修饰可数的东西，如 *a few apples*；*a little* 修饰不可数的东西，如 *a little oil*。看空格后面的名词。",
      ),
      meaning: t(
        "*Enough* means as much as you need, and *plenty* means more than enough; *plenty* needs *of* before a noun: *plenty of time*.",
        "*enough* 是正好够用，*plenty* 是绰绰有余；*plenty* 后面接名词要加 *of*：*plenty of time*。",
      ),
      spell: t(
        "The weights and measures end in different letters: *kilo* ends in o, *gram* in m, and *liter* in -er (British English writes *litre*).",
        "这几个度量词的结尾各不相同：*kilo* 以 o 结尾，*gram* 以 m 结尾，*liter* 以 -er 结尾（英式英语写作 *litre*）。",
      ),
    },
    notes: `
      piece|a small part of a birthday cake;paper for writing a note;the parts of a broken plate|a piece is one part of something; a pair is two things used together|piece 是某物的一部分；pair 是成对使用的两样东西|pair=pair means two things used together, like shoes, not one part of a cake or paper=pair 是成对使用的两样东西，比如鞋，不是蛋糕或纸的一部分;kilo=kilo is a weight of a thousand grams, not one small part of something=kilo 是一千克的重量，不是某物的一小部分|piece|ie for the long e sound, and -ce at the end|ie 发长 e 音，结尾是 -ce
      kilo|a weight of apples to buy;the weight of a bag of rice;a baby's weight when she was born|a kilo is a thousand grams; a liter measures liquid|kilo 是一千克；liter 量的是液体|liter=liter measures liquids like milk and water, not apples, rice or a baby=liter 量的是牛奶、水这样的液体，不是苹果、大米或婴儿;gram=gram is a very small weight, far too light for a bag of rice or a baby=gram 是很小的重量，一袋米或一个婴儿远不止这么轻|ki · lo|i said like ee, and o at the end: *kilos*|i 读作 ee，词尾是 o，复数 *kilos*
      gram|the flour for a recipe;the weight of a letter;a very light weight|a gram is very light; a kilo is a thousand grams|gram 很轻；kilo 是一千克|kilo=kilo is a thousand grams, much too heavy for a recipe's flour or a letter=kilo 是一千克，对一份食谱的面粉或一封信来说太重了;liter=liter measures liquids, not the weight of flour or a letter=liter 量的是液体，不是面粉或信的重量|gram|m at the end, with no e|结尾是 m，没有 e
      liter|milk to buy;water to drink every day;what a bottle holds|a liter measures liquid; a kilo measures weight|liter 量液体；kilo 量重量|kilo=kilo is a weight for things like rice and apples, not an amount of milk or water=kilo 是大米、苹果这类东西的重量，不是牛奶或水的量;gram=gram is a very small weight, not an amount of liquid in a bottle=gram 是很小的重量，不是瓶子里液体的量|li · ter|-er at the end; British English writes *litre*|结尾是 -er；英式英语写作 *litre*
      bit|feeling a little tired;a small amount of salt;a little more time|a bit is a small amount; a piece is one part of a solid thing|bit 是一点点；piece 是固体东西的一块|few=few goes only with things you can count, and *a few tired* or *a few of salt* is not English=few 只修饰可数的东西，不能说 *a few tired* 或 *a few of salt*;piece=piece is one part of a solid thing, so you cannot be *a piece tired* or ask for *a piece more time*=piece 是固体东西的一块，不能说 *a piece tired*，也不能说 *a piece more time*|bit|a short i, as in *sit*|短元音 i，和 *sit* 一样
      few|a small number of apples in a bag;a small number of friends in town;a very small number of people at a party|few goes with things you can count; little goes with things you cannot count|few 修饰可数的东西；little 修饰不可数的东西|little=little goes with things you cannot count, like oil or milk, not with apples, friends or people=little 修饰油、牛奶这样不可数的东西，不修饰苹果、朋友或人;bit=bit needs *of* before a noun, as in *a bit of salt*, and does not go with *very* or plural nouns=bit 后面接名词要加 *of*，如 *a bit of salt*，也不和 *very* 或复数名词连用|few|ew, said like *you*|ew 读作 *you*
      little|a small amount of oil;not much milk left;some French|little goes with things you cannot count; few goes with things you can count|little 修饰不可数的东西；few 修饰可数的东西|few=few goes with things you can count, like apples, not with oil, milk or a language=few 修饰苹果这样可数的东西，不修饰油、牛奶或语言;bit=bit needs *of* before a noun, as in *a bit of oil*, and is not used with *very*=bit 后面接名词要加 *of*，如 *a bit of oil*，也不和 *very* 连用|lit · tle|the double t, and -le at the end|双写 t，结尾是 -le
      enough|chairs for everyone;money to buy something;food for ten people|enough is as much as you need; plenty is more than enough|enough 是正好够用；plenty 是绰绰有余|plenty=plenty needs *of* before a noun, as in *plenty of chairs*, so it cannot come straight before *chairs*, *money* or *food*=plenty 后面接名词要加 *of*，如 *plenty of chairs*，不能直接放在 *chairs*、*money* 或 *food* 前面;amount=amount is a noun for how much there is, and it cannot stand before another noun like *chairs* or *food*=amount 是表示数量的名词，不能直接放在 *chairs*、*food* 这样的名词前面|e · nough|ough said like *uff*|ough 读作 *uff*
      plenty|lots of time, so no need to hurry;lots of food for friends;lots of water on a hot day|plenty means a lot, more than enough; few means not many|plenty 是很多、绰绰有余；few 是很少|enough=enough goes straight before a noun with no *of*, so *enough of time* is not English=enough 直接放在名词前，不加 *of*，所以不能说 *enough of time*;few=few means not many, and it does not tell people not to hurry or to invite friends=few 是不多，不能用来让人别着急或邀请朋友|plen · ty|-ty at the end, with y|结尾是 -ty，用 y
      pair|new shoes;glasses;two students working together|a pair is two things used together; a piece is one part|pair 是成对的两样东西；piece 是一部分|piece=piece is one part of something, and shoes and glasses come in twos, not pieces=piece 是某物的一部分，而鞋和眼镜是成对的;kilo=kilo is a weight of a thousand grams, not two things used together=kilo 是一千克的重量，不是成对的两样东西|pair|air at the end, said like *air*|结尾是 air，读音和 *air* 一样
      amount|a little salt to use;a lot of money;how much rain fell this year|amount means how much there is; a pair is two things|amount 是多少；pair 是成对的两样东西|pair=pair means two things used together, not how much salt, money or rain there is=pair 是成对的两样东西，不是盐、钱或雨水的多少;kilo=kilo is one fixed weight, so *a small kilo* or *the kilo of rain* does not make sense=kilo 是一个固定的重量，*a small kilo* 或 *the kilo of rain* 都说不通|a · mount|a at the start, then *mount*|开头是 a，后面是 *mount*
      extra|more cheese than usual on a pizza;one more bed for a visitor;breakfast that costs five dollars more|extra means more than usual; enough means as much as you need|extra 是额外的、多出来的；enough 是正好够|enough=enough means as much as you need, not something added that costs more=enough 是正好够用，不是额外加的、要多付钱的东西;plenty=plenty means a lot and needs *of* before a noun, so *plenty cheese* or *one plenty bed* is not English=plenty 是很多，后面接名词要加 *of*，不能说 *plenty cheese* 或 *one plenty bed*|ex · tra|x at the start, said like *ks*|开头的 x 读作 *ks*
    `,
  },
});

// A few and a little.

/** counted are nouns you count, in the plural; uncounted are nouns you do not count. */
const counted: readonly string[] = [
  "onions",
  "eggs",
  "carrots",
  "tomatoes",
  "potatoes",
  "apples",
  "lemons",
  "cookies",
  "oranges",
  "bananas",
  "beans",
];
const uncounted: readonly string[] = ["oil", "salt", "milk", "sugar", "flour", "butter", "honey", "rice", "water", "cheese", "juice"];

/** frames are sentences with a gap before the noun that take either kind. */
const frames: readonly string[] = [
  "Buy ___ {} on your way home.",
  "We only have ___ {} left.",
  "I need ___ {} for the recipe.",
  "Can you give me ___ {}, please?",
  "Put ___ {} in the bowl.",
  "Let's add ___ {}.",
];

const quantRows = (nouns: readonly string[]) => everyPair(nouns, frames).map(([noun, frame]) => frame.replace("{}", noun));

const quantChoiceBank: readonly ChoiceItem[] = interleave([
  quantRows(counted).map((s): ChoiceItem => [s, "a few", ["a little", "a bit"]]),
  quantRows(uncounted).map((s): ChoiceItem => [s, "a little", ["a few", "a bit"]]),
]);

const quantFixBank: readonly TypedItem[] = interleave([
  quantRows(counted).map((s): TypedItem => {
    const shown = s.replace("___", "a little");
    return { shown, accepted: [s.replace("___", "a few")], wrong: [shown] };
  }),
  quantRows(uncounted).map((s): TypedItem => {
    const shown = s.replace("___", "a few");
    return { shown, accepted: [s.replace("___", "a little")], wrong: [shown] };
  }),
]);

const manyMuchBank: readonly ChoiceItem[] = interleave([
  everyPair(counted, [
    "How ___ {} do we need?",
    "There aren't ___ {} in the fridge.",
    "We don't have ___ {}.",
    "Did you buy ___ {}?",
    "How ___ {} are there?",
  ]).map(([noun, frame]): ChoiceItem => [frame.replace("{}", noun), "many", ["much", "a little"]]),
  everyPair(uncounted, [
    "How ___ {} do we need?",
    "There isn't ___ {} in the fridge.",
    "We don't have ___ {}.",
    "Did you buy ___ {}?",
    "How ___ {} is there?",
  ]).map(([noun, frame]): ChoiceItem => [frame.replace("{}", noun), "much", ["many", "a few"]]),
]);

/** quantNoun is the noun after the gap, or after the quantifier, of a sentence. */
const quantNoun = (sentence: string): string => /(?:___|a few|a little|many|much) (\w+)/u.exec(sentence)?.[1] ?? "";

/** countReason says whether noun is counted and so which words it takes. */
const countReason = (noun: string): Text =>
  counted.includes(noun)
    ? t(
        `You can count *${noun}* (*two ${noun}*), so it takes *a few* and *many*`,
        `*${noun}* 可以数（*two ${noun}*），所以用 *a few* 和 *many*`,
      )
    : t(
        `You cannot count *${noun}* (not *two ${noun}s*), so it takes *a little* and *much*`,
        `*${noun}* 不能数（不说 *two ${noun}s*），所以用 *a little* 和 *much*`,
      );

/** quantWhy explains the quantifier in the gap of shown. */
const quantWhy = (right: string, shown: string): Text => {
  const noun = quantNoun(shown);
  const reason = countReason(noun);
  const countable = counted.includes(noun);
  return t(
    `${reason.en}: ${fill(shown, right)}\n\n**Check.** Test *${noun}* with *two*: ${countable ? `*two ${noun}* works (countable)` : `*two ${noun}s* does not work (uncountable)`}, which confirms *${right}*.`,
    `${reason["zh-CN"]}：${fill(shown, right)}\n\n**检验。** 用 *two* 测试 *${noun}*：${countable ? `可以说 *two ${noun}*（可数）` : `不能说 *two ${noun}s*（不可数）`}，因此选 *${right}*。`,
  );
};

/** whyNotQuant explains a quantifier that does not fit the noun after the gap. */
const whyNotQuant = (wrong: string, _right: string, shown: string): Text => {
  const noun = quantNoun(shown);
  const countable = counted.includes(noun);
  const kind = countable
    ? t(`*${noun}* is a countable plural noun`, `*${noun}* 是可数名词复数`)
    : t(`*${noun}* is an uncountable noun`, `*${noun}* 是不可数名词`);
  if (wrong === "a bit")
    return t(
      `*a bit* cannot stand straight before a noun; it needs *of*, as in *a bit of salt*.`,
      `*a bit* 不能直接放在名词前，要说 *a bit of*，如 *a bit of salt*。`,
    );
  const use: Record<string, Text> = {
    "a few": t("*a few* is for nouns you count", "*a few* 用于可数名词"),
    many: t("*many* is for nouns you count", "*many* 用于可数名词"),
    "a little": t("*a little* is for nouns you do not count", "*a little* 用于不可数名词"),
    much: t("*much* is for nouns you do not count", "*much* 用于不可数名词"),
  };
  const of = use[wrong] ?? t(`*${wrong}*`, `*${wrong}*`);
  const after = /^(a few|a little)$/u.test(wrong) && /How ___|n't ___/u.test(shown);
  return t(
    `${of.en}${after ? ", and after *How* or *not* English uses *many* or *much*" : ""}, while ${kind.en}.`,
    `${of["zh-CN"]}${after ? "，而且在 *How* 或 *not* 后面要用 *many* 或 *much*" : ""}，而${kind["zh-CN"]}。`,
  );
};

const quantifiers: TopicDef = {
  id: "quantifiers-a-few-and-a-little",
  title: t("A Few and A Little", "a few 和 a little"),
  summary: t(
    "A few onions, a little oil: few with nouns you count, little with nouns you do not.",
    "a few onions，a little oil：few 用于可数名词，little 用于不可数名词。",
  ),
  intro: t(
    "In the kitchen, you add *a few carrots* (you can count them one by one) and *a little honey* (you pour it rather than count it). Choosing between *a few/many* and *a little/much* always starts with the noun.",
    "在厨房里，你会加 *a few carrots*（可以一根一根数）和 *a little honey*（只能倒，不能数）。选 *a few/many* 还是 *a little/much*，关键先看后面的名词能不能数。",
  ),
  prerequisites: ["some-and-any", "a2-words-quantities"],
  encompasses: [
    { topic: "some-and-any", weight: 0.2 },
    { topic: "a2-words-quantities", weight: 0.2 },
  ],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("A few or a little", "a few 还是 a little"),
      t(
        "Both mean *some, but not many* or *not much*.\n\n- *a few* goes with nouns you count, in the plural: *a few onions*, *a few eggs*.\n- *a little* goes with nouns you do not count: *a little oil*, *a little salt*, *a little milk*.\n\nAsk: can I say *two* before it? *Two eggs*: yes, so *a few eggs*. *Two milks*: no, so *a little milk*.\n\n> **Watch out.** Do not put *a bit* directly before a noun (*a bit salt* is wrong; it needs *of*: *a bit of salt*), and check whether the noun is plural before picking *a few*.",
        "两者都表示“一些、不多”。\n\n- *a few* 用于可数名词复数：*a few onions*、*a few eggs*。\n- *a little* 用于不可数名词：*a little oil*、*a little salt*、*a little milk*。\n\n先用 *two* 测一下：能说 *two eggs*，所以用 *a few eggs*；不能说 *two milks*，所以用 *a little milk*。\n\n> **注意。** 不要把 *a bit* 直接放在名词前（*a bit salt* 是错的，要说 *a bit of salt*），选 *a few* 前先确认名词是不是可数复数。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), quantChoiceBank, quantWhy, whyNotQuant),
    ),
    point(
      "many-much",
      t("How many or how much", "how many 还是 how much"),
      t(
        "The same countability rule holds for *many* and *much* in questions and negatives: *many* with plural countable nouns (*How many eggs?*, *not many carrots*), *much* with uncountable nouns (*How much milk?*, *not much salt*).\n\n> **Watch out.** Do not use *a few* or *a little* right after *How* (*How a few eggs?* is wrong)—use *How many* or *How much*.",
        "同样的可数/不可数规则也适用于疑问句和否定句中的 *many* 和 *much*：可数复数名词用 *many*（*How many eggs?*、*not many carrots*），不可数名词用 *much*（*How much milk?*、*not much salt*）。\n\n> **注意。** *How* 后面不能接 *a few* 或 *a little*（*How a few eggs?* 是错的），必须用 *How many* 或 *How much*。",
      ),
      choiceGenerator(t("Choose the word for the gap.", "选出填入空白处的词。"), manyMuchBank, quantWhy, whyNotQuant),
    ),
    point(
      "fix",
      t("Fixing a few and a little", "改正 a few 和 a little"),
      t(
        "Each sentence pairs the wrong quantifier with its noun: *Add a few oil.* → *Add a little oil.* *We need a little onions.* → *We need a few onions.* Rewrite the sentence with the matching quantifier.\n\n> **Watch out.** Change only *a few* ↔ *a little* (do not drop *a*, and do not change the noun itself).",
        "每个句子都把量词配错了：*Add a few oil.* → *Add a little oil.* *We need a little onions.* → *We need a few onions.* 用正确的量词重写句子。\n\n> **注意。** 只替换 *a few* ↔ *a little*（别漏掉 *a*，也不要改动后面的名词）。",
      ),
      typedGenerator(
        "sentence",
        t("Fix the sentence.", "改正这个句子。"),
        quantFixBank,
        (right) => {
          const noun = quantNoun(right);
          const reason = countReason(noun);
          const countable = counted.includes(noun);
          return t(
            `${reason.en}: ${right}\n\n**Check.** Test *${noun}* with *two*: ${countable ? `countable → *a few*` : `uncountable → *a little*`}, and the rest of the sentence stays unchanged.`,
            `${reason["zh-CN"]}：${right}\n\n**检验。** 用 *two* 测试 *${noun}*：${countable ? `可数 → *a few*` : `不可数 → *a little*`}，句子的其余部分保持不变。`,
          );
        },
        quantifiersAFewAndALittleFixNot,
      ),
    ),
  ],
};

// Writing steps in order.

/** recipes are four steps each, in order, written as instructions. */
const recipes: readonly (readonly [string, string, string, string])[] = [
  ["boil some water", "add the noodles", "cook them for five minutes", "put them in a bowl with some sauce"],
  ["mix the flour, eggs and milk", "heat a little oil in a pan", "pour in some of the mix", "fry the pancake on both sides"],
  ["boil the water", "put a tea bag in a cup", "pour the water into the cup", "add a slice of lemon and a little honey"],
  ["heat a little oil in a pan", "break an egg into the pan", "fry it for two minutes", "put it on a plate"],
  ["wash the fruit", "cut it into small pieces", "put the pieces in a bowl", "add a little honey and mix"],
  ["cut two slices of bread", "put a little butter on them", "add some cheese and tomato", "put the slices together"],
  ["cut the carrots and onions", "fry them in a little oil", "add some water and boil it", "cook the soup for twenty minutes"],
  ["wash the rice", "put it in a pan with water", "boil it for ten minutes", "turn off the heat and wait five minutes"],
  ["mix the butter and sugar", "add the eggs and flour", "pour the mix into a pan", "bake it for forty minutes"],
  ["boil a pan of water", "add the corn", "cook it for ten minutes", "add a little butter and salt"],
  ["cut the lemons in half", "put their juice in a bottle", "add water and a little sugar", "put the bottle in the fridge"],
  ["wash the potatoes", "cut them into thin slices", "fry them in hot oil", "add a little salt"],
];

const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** stepWords are the word before each step, written with the comma it takes. */
const stepWords = ["First,", "Then", "Next,", "Finally,"] as const;
const stepRight = ["First", "Then", "Next", "Finally"] as const;
const stepWrong: readonly (readonly [string, string])[] = [
  ["Finally", "Next"],
  ["First", "Finally"],
  ["First", "Finally"],
  ["First", "Second"],
];

const told = (steps: readonly string[], gapAt: number) =>
  steps.map((step, i) => (i === gapAt ? `___${i === 1 ? "" : ","} ${step}.` : `${stepWords[i]} ${step}.`)).join(" ");

const stepChoiceBank: readonly ChoiceItem[] = interleave(
  [0, 1, 2, 3].map((position) =>
    recipes.map((steps): ChoiceItem => [told(steps, position), stepRight[position] ?? "", stepWrong[position] ?? []]),
  ),
);

const stepTypedBank: readonly TypedItem[] = interleave(
  [0, 2, 1, 3].map((position) =>
    recipes.map((steps): TypedItem => {
      const step = steps[position] ?? "";
      const word = position === 0 ? "First" : position === 3 ? "Finally" : "[Then|Next]";
      const canonical =
        position === 0 ? `First, ${step}.` : position === 3 ? `Finally, ${step}.` : `${position === 1 ? "Then" : "Next,"} ${step}.`;
      return {
        shown: `Step ${position + 1} of 4: ${step}`,
        accepted: [`${word}(,) ${step}.`],
        canonical,
        wrong: [`${capital(step)}.`, `${position === 0 ? "Finally" : "First"}, ${step}.`],
      };
    }),
  ),
);

/** stepPlace says which step a word marks and why it fits there. */
const stepPlace: Readonly<Record<string, Text>> = {
  First: t("This is the first step, so it starts with *First* and a comma", "这是第一步，所以用 *First* 加逗号开头"),
  Then: t("This step comes in the middle, right after the first, so it takes *Then*", "这一步在中间，紧接第一步，所以用 *Then*"),
  Next: t(
    "This step comes in the middle, after another step, so it takes *Next* and a comma",
    "这一步在中间，跟在另一步后面，所以用 *Next* 加逗号",
  ),
  Finally: t("This is the last step, so it starts with *Finally* and a comma", "这是最后一步，所以用 *Finally* 加逗号开头"),
};

/** stepUse says what each order word is for. */
const stepUse: Readonly<Record<string, Text>> = {
  First: t(
    "*First* is only for the first step, and a step already comes before this one",
    "*First* 只用于第一步，而这一步前面已经有步骤了",
  ),
  Finally: t("*Finally* means *last*, so it is only for the last step", "*Finally* 意思是“最后”，只用于最后一步"),
  Next: t("*Next* follows another step, but nothing comes before the first one", "*Next* 要跟在另一步后面，但第一步前面没有步骤"),
  Second: t("*Second* marks step two, but this is the very last step", "*Second* 表示第二步，而这是最后一步"),
};

/** stepWhy explains the order word of a step. */
const stepWhy = (word: string, step: string): Text => {
  const place = stepPlace[word] ?? t(`*${word}*`, `*${word}*`);
  return t(
    `${place.en}: ${step}\n\n**Check.** Check where the gap sits in the four-step sequence: *First* opens step 1, *Then/Next* link steps 2–3, and *Finally* closes step 4.`,
    `${place["zh-CN"]}：${step}\n\n**检验。** 看空白在四步流程里的位置：*First* 用于第 1 步，*Then/Next* 连接第 2–3 步，*Finally* 用于第 4 步。`,
  );
};

const writingStepsInOrder: TopicDef = {
  id: "writing-steps-in-order",
  title: t("Writing Steps in Order", "按顺序写步骤"),
  summary: t(
    "Put the steps of a recipe in order and join them with first, then, next and finally.",
    "按顺序写出食谱的步骤，用 first、then、next 和 finally 连接。",
  ),
  intro: t(
    "Instructions are easiest to follow when each step carries a clear signpost: *First, wash the rice. Then add water. Next, boil it. Finally, serve it hot.* Order words show the reader where each action belongs.",
    "步骤前面加上顺序路标，读起来一目了然：*First, wash the rice. Then add water. Next, boil it. Finally, serve it hot.* 顺序词让读者一眼看清每一步的位置。",
  ),
  prerequisites: ["imperatives", "joining-with-and-but-or"],
  encompasses: [{ topic: "imperatives", weight: 0.3 }],
  xp: 20,
  strand: "writing",
  knowledgePoints: [
    point(
      "choose",
      t("First, then, next, finally", "first、then、next、finally"),
      t(
        "Steps are instructions: they start with the verb, like *Boil the water.* Words before them show the order:\n\n- *First,* for the first step\n- *Then* or *Next,* for the steps in the middle\n- *Finally,* for the last step\n\n*First, boil some water. Then add the noodles. Next, cook them for five minutes. Finally, put them in a bowl.*\n\n> **Watch out.** *Finally* means “last”—never use it for a middle step, and never use *Next* for step 1.",
        "步骤是指令，以动词开头，比如 *Boil the water.* 步骤前面的词表示顺序：\n\n- *First,* 用于第一步\n- *Then* 或 *Next,* 用于中间的步骤\n- *Finally,* 用于最后一步\n\n*First, boil some water. Then add the noodles. Next, cook them for five minutes. Finally, put them in a bowl.*\n\n> **注意。** *Finally* 只用于最后一步，不要用在中间步骤；第一步前面没有其他步骤，不能用 *Next*。",
      ),
      choiceGenerator(
        t("Choose the word for the gap.", "选出填入空白处的词。"),
        stepChoiceBank,
        (right, shown) => stepWhy(right, shown.replace("___", `*${right}*`)),
        (wrong) => {
          const use = stepUse[wrong] ?? t(`*${wrong}* does not fit this step`, `*${wrong}* 不适合这一步`);
          return t(`${use.en}.`, `${use["zh-CN"]}。`);
        },
      ),
    ),
    point(
      "write",
      t("Writing a step", "写出一个步骤"),
      t(
        "Write the step as an instruction with the word for its place: *First,* for step 1 (*First, wash the fruit.*), *Then* or *Next,* in the middle (*Next, cut it into small pieces.*), and *Finally,* for the last step (*Finally, mix well.*).\n\n> **Watch out.** Start the sentence with the order word (capitalized), keep the action verb in its plain imperative form, and end with a period.",
        "把这一步写成指令，并加上表示顺序的词：第 1 步用 *First,*（*First, wash the fruit.*），中间步骤用 *Then* 或 *Next,*（*Next, cut it into small pieces.*），最后一步用 *Finally,*（*Finally, mix well.*）。\n\n> **注意。** 顺序词放句首且首字母大写，后面的动作保持动词原形祈使句，句末加句号。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Write the step.", "写出这个步骤。"),
        stepTypedBank,
        (right) => {
          const word = right.split(/[ ,]/u)[0] ?? "";
          const place = stepPlace[word] ?? t(`*${word}*`, `*${word}*`);
          return t(
            `${place.en}, and the step itself is an instruction that starts with the verb: ${right}\n\n**Check.** Verify three things: the order word (*${word}*) matches the step number, the action starts with a plain verb, and the sentence ends with a period.`,
            `${place["zh-CN"]}，步骤本身是以动词开头的指令：${right}\n\n**检验。** 核对三处：顺序词 *${word}* 与步骤序号匹配、动作以动词原形开头、句末有句号。`,
          );
        },
        writingStepsInOrderWriteNot,
      ),
    ),
  ],
};

// Writing a recipe.

const recipeBank: readonly WritingItem[] = [
  {
    task: "Write a recipe for egg fried rice.",
    model:
      "Egg fried rice\nYou need: a bowl of cooked rice, two eggs, a little oil, a few green onions and a little salt.\nFirst, heat the oil in a pan. Then break the eggs into the pan and mix them. Next, add the rice and fry it for three minutes. Then add the salt and the green onions. Finally, put the rice on a plate and eat it hot.",
  },
  {
    task: "Write a recipe for pancakes.",
    model:
      "Pancakes\nYou need: 200 grams of flour, two eggs, half a liter of milk and a little butter.\nFirst, mix the flour, eggs and milk in a big bowl. Then heat a little butter in a pan. Next, pour in some of the mix. Fry the pancake for one minute on each side. Finally, put it on a plate with some honey or lemon.",
  },
  {
    task: "Write a recipe for a fruit salad.",
    model:
      "Fruit salad\nYou need: two apples, a banana, an orange, a few grapes and a little honey.\nFirst, wash the fruit. Then cut the apples, the banana and the orange into small pieces. Next, put all the fruit in a bowl. Add a little honey and mix it well. Finally, put the bowl in the fridge for half an hour.",
  },
  {
    task: "Write a recipe for tomato and egg soup.",
    model:
      "Tomato and egg soup\nYou need: two tomatoes, two eggs, a liter of water, a little oil and a little salt.\nFirst, cut the tomatoes into pieces. Then fry them in a little oil for two minutes. Next, add the water and boil it. Mix the eggs in a bowl and pour them slowly into the soup. Finally, add the salt and serve it hot.",
  },
  {
    task: "Write a recipe for a cheese sandwich.",
    model:
      "Cheese sandwich\nYou need: two slices of bread, a little butter, two slices of cheese and a tomato.\nFirst, put a little butter on the bread. Then cut the tomato into thin slices. Next, put the cheese and the tomato on one slice of bread. Put the other slice on top. Finally, cut the sandwich in half.",
  },
  {
    task: "Write a recipe for hot lemon and honey.",
    model:
      "Hot lemon and honey\nYou need: half a lemon, a big cup of water and a little honey.\nFirst, boil the water. Then cut the lemon into slices. Next, put two slices of lemon in a cup and pour in the hot water. Wait two minutes. Finally, add a little honey and mix it. It is great when you have a cold.",
  },
  {
    task: "Write a recipe for noodles with vegetables.",
    model:
      "Noodles with vegetables\nYou need: some noodles, a carrot, an onion, a few beans, a little oil and some soy sauce.\nFirst, boil the noodles for five minutes. Then cut the carrot and the onion into thin pieces. Next, fry the vegetables in a little oil. Add the noodles and a little soy sauce, and mix everything. Finally, put the noodles in bowls.",
  },
  {
    task: "Write a recipe for a simple cake.",
    model:
      "Simple cake\nYou need: 200 grams of butter, 200 grams of sugar, four eggs and 200 grams of flour.\nFirst, heat the oven. Then mix the butter and sugar in a bowl. Next, add the eggs and the flour and mix them well. Pour the mix into a cake pan. Finally, bake it for forty minutes.",
  },
  {
    task: "Write a recipe for corn soup.",
    model:
      "Corn soup\nYou need: two cups of corn, an onion, a little butter, half a liter of milk and a little salt and pepper.\nFirst, cut the onion into small pieces. Then fry it in the butter until it is soft. Next, add the corn and the milk. Cook the soup for fifteen minutes. Finally, add salt and pepper.",
  },
  {
    task: "Write a recipe for a dish from your family.",
    model:
      "Grandma's potato pancakes\nYou need: three potatoes, an egg, two spoons of flour, a little oil and a little salt.\nFirst, wash the potatoes and cut them into very thin pieces. Then mix them with the egg, the flour and the salt. Next, heat the oil in a pan. Put a few spoons of the mix in the pan and fry them on both sides. Finally, eat them hot.",
  },
  {
    task: "Write a recipe for a healthy breakfast.",
    model:
      "A healthy breakfast bowl\nYou need: a cup of milk, a few spoons of oats, a banana, a few nuts and a little honey.\nFirst, pour the milk into a pan and heat it. Then add the oats and cook them for three minutes. Next, put them in a bowl. Cut the banana into slices and put it on top. Finally, add the nuts and a little honey.",
  },
  {
    task: "Write a recipe for a cold drink for a hot day.",
    model:
      "Lemon drink\nYou need: three lemons, a liter of cold water, a little sugar and some ice.\nFirst, cut the lemons in half. Then put their juice in a big bottle. Next, add the water and the sugar, and mix them well. Put the bottle in the fridge for an hour. Finally, pour the drink into glasses with some ice.",
  },
];

const writingARecipe = judgedTopic({
  id: "writing-a-recipe",
  title: t("Writing a Recipe", "写食谱"),
  summary: t(
    "Write a recipe for a simple dish: what you need, then five or six steps in order.",
    "为一道简单的菜写食谱：需要什么，然后按顺序写五六个步骤。",
  ),
  intro: t(
    "A clear recipe tells the cook two things in order: the ingredients with amounts (*two tomatoes, a little oil*) and step-by-step instructions (*First, cut the tomatoes. Then fry them...*). Anyone reading it should be able to cook the dish.",
    "一份清晰的食谱按顺序交代两件事：带用量的材料清单（*two tomatoes, a little oil*），以及按顺序排列的操作步骤（*First, cut the tomatoes. Then fry them...*），让读者照着就能做出来。",
  ),
  prerequisites: ["writing-steps-in-order", "quantifiers-a-few-and-a-little"],
  encompasses: [
    { topic: "writing-steps-in-order", weight: 0.4 },
    { topic: "quantifiers-a-few-and-a-little", weight: 0.2 },
  ],
  criteria: ["a2-recipe-ingredients", "a2-recipe-steps", "a1-sentences"],
  point: {
    id: "recipe",
    title: t("What you need and the steps", "所需材料和步骤"),
    explanation: t(
      "A recipe has two parts:\n\n- What you need, with amounts: *two eggs*, *a little oil*, *a few onions*, *200 grams of flour*.\n- The steps, in order, as instructions that start with a verb: *First, heat the oil in a pan. Then add the eggs. Finally, put the rice on a plate.*\n\n> **Watch out.** Write each step as an imperative starting with the plain verb (*Heat the oil*, not *You heat* or *Heating*), and match *a few* / *a little* to countable and uncountable ingredients.",
      "食谱有两部分：\n\n- 需要的材料和用量：*two eggs*、*a little oil*、*a few onions*、*200 grams of flour*。\n- 步骤：按顺序写，每一步都以动词开头：*First, heat the oil in a pan. Then add the eggs. Finally, put the rice on a plate.*\n\n> **注意。** 每一步用动词原形开头的祈使句（*Heat the oil*，不要写 *You heat* 或 *Heating*），并注意可数食材用 *a few*、不可数食材用 *a little*。",
    ),
  },
  question: t(
    "Write the recipe the task names in English: first what you need, then five or six steps in order.",
    "根据题目用英语写食谱：先写需要的材料，再按顺序写五六个步骤。",
  ),
  bank: recipeBank,
  limits: { minWords: 40, maxChars: 900 },
  what: t("recipe", "食谱"),
});

/** topics are the topics of the unit Cooking. */
export const topics: readonly TopicDef[] = [
  cooking.topic,
  ingredients.topic,
  taste.topic,
  quantities.topic,
  quantifiers,
  writingStepsInOrder,
  writingARecipe,
];

/** vocabulary are the words the unit Cooking teaches. */
export const vocabulary: readonly WordBatch[] = [cooking.batch, ingredients.batch, taste.batch, quantities.batch];
