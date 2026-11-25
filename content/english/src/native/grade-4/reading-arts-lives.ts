// Grade 4: the reading units of art and artists, plays for the stage and lives that made a difference.

import { type ReadingUnitDef, t } from "@ga/content";
import { edge, passage, q } from "./reading-kit.ts";

const painting = edge("words-of-painting-and-drawing");
const sculpture = edge("words-of-sculpture-and-craft");
const color = edge("words-of-color");
const describing = edge("words-for-describing-art");
const imagery = edge("imagery", 0.3);
const details = edge("supporting-details", 0.3);
const theater = edge("words-of-plays-and-theater");
const drama = edge("words-of-comedy-and-drama");
const speaking = edge("words-for-speaking");
const parts = edge("parts-of-a-play", 0.3);
const traits = edge("what-characters-say-and-think", 0.3);
const achievement = edge("words-for-courage-and-achievement");
const research = edge("words-of-discovery-and-research");
const helping = edge("words-for-helping-others");
const lives = edge("biography-or-autobiography", 0.3);
const chains = edge("cause-and-effect-chains", 0.3);
const academic2 = edge("academic-words-2");

/** artUnit is the reading unit of art and artists. */
export const artUnit: ReadingUnitDef = {
  id: "art-and-artists",
  title: t("Art and Artists", "艺术与艺术家"),
  passages: [
    passage(
      "why-people-make-art",
      ["Why People Make Art", "人们为什么创作艺术"],
      `People have made art for as long as there have been people. Long before anyone could write, humans carved shapes into bone and painted animals on rock. Today, people make art in every country on Earth. Why do we do it?

      One reason is to remember. A portrait keeps the face of someone after they are gone, and a painting of a battle or a festival keeps a moment from history. Before cameras, art was the only way to show what a person or a place looked like.

      Another reason is to express feelings. An artist who is sad might paint with dark, heavy colors, and one who is joyful might choose bright, vivid ones. People who look at the work can feel those feelings too, even hundreds of years later.

      Art can also tell stories and share beliefs. Many of the most famous paintings and statues in the world show stories from religions or old legends.

      Finally, art can simply make life more beautiful. People decorate pots, cloth, walls and even their own skin. A plain cup does its job, but a cup with a painted flower can make someone smile every morning.`,
      [describing, details],
      [
        q(
          ["Why was art so important for remembering before cameras?", "在有照相机之前，艺术为什么对记忆那么重要？"],
          ["It was the only way to show what someone looked like", "它是展示一个人样貌的唯一方式"],
          [
            ["People could not remember faces without it", "没有它人们记不住面孔"],
            ["Paintings were much cheaper then than photographs are today", "那时画比今天的照片便宜得多"],
            ["Only kings were allowed to remember the past", "只有国王才被允许记住过去"],
          ],
          [
            "The second paragraph says that before cameras, art was the only way to show what a person or a place looked like.",
            "第二段说，在有照相机之前，艺术是展示一个人或一个地方样貌的唯一方式。",
          ],
          [
            ["Not remembering faces without art is not what the passage says.", "没有艺术就记不住脸不是文中说的。"],
            ["Cheaper paintings is not in the passage.", "画更便宜文中没有。"],
            ["Only kings remembering is not in the passage.", "只有国王才能记住文中没有。"],
          ],
        ),
        q(
          ["How might a sad artist show feelings in a painting?", "一位悲伤的艺术家可能怎样在画中表达情感？"],
          ["With dark, heavy colors", "用深暗、沉重的颜色"],
          [
            ["With bright, vivid colors", "用明亮、鲜艳的颜色"],
            ["By painting a festival", "画一个节日"],
            ["By carving shapes into bone", "在骨头上刻图形"],
          ],
          [
            "The third paragraph says a sad artist might paint with dark, heavy colors; bright, vivid ones belong to a joyful artist.",
            "第三段说，悲伤的艺术家可能用深暗、沉重的颜色；明亮鲜艳的颜色属于快乐的艺术家。",
          ],
          [
            ["Bright, vivid colors are what a joyful artist might choose.", "鲜艳明亮的颜色是快乐的画家会选的。"],
            ["A festival is something art remembers, not a sad feeling.", "节日是艺术记录的场景，不是悲伤。"],
            ["Carving bone is what early humans did, not about feelings.", "刻骨头是早期人类做的事，和感情无关。"],
          ],
        ),
        q(
          ["What does the example of the painted cup support?", "画着花的杯子这个例子支持什么观点？"],
          ["Art can simply make life more beautiful", "艺术能让生活更美好"],
          [
            ["Art helps people remember history", "艺术帮助人们记住历史"],
            ["Art tells stories from old legends and religions", "艺术讲述古老传说和宗教中的故事"],
            ["Art was made before anyone could write", "艺术出现在人们会写字之前"],
          ],
          [
            "The last paragraph gives the cup as an example of art that simply makes life more beautiful.",
            "最后一段用杯子作为例子，说明艺术能让生活更美好。",
          ],
          [
            ["Remembering history is a different reason, shown by portraits.", "记住历史是另一个原因，用肖像画来说明。"],
            ["Stories and beliefs are a different reason, shown by famous paintings.", "故事和信仰是另一个原因，用名画来说明。"],
            ["Art before writing is from the first paragraph.", "文字出现前的艺术在第一段。"],
          ],
        ),
        q(
          ["What did humans do long before anyone could write?", "在人类会写字之前很久，他们做了什么？"],
          ["Carved shapes into bone and painted animals on rock", "在骨头上刻图形，在岩石上画动物"],
          [
            ["Took photographs", "拍照片"],
            ["Painted portraits of kings", "给国王画肖像"],
            ["Wrote stories on paper", "在纸上写故事"],
          ],
          [
            "Long before anyone could write, humans carved shapes into bone and painted animals on rock.",
            "在有人会写字之前很久，人类就在骨头上刻图形，在岩石上画动物。",
          ],
          [
            ["Photographs came much later.", "照片是很晚才有的。"],
            ["Portraits of kings are not named here.", "国王的肖像这里没提。"],
            ["Writing on paper is wrong. They could not write yet.", "在纸上写故事不对。他们那时还不会写字。"],
          ],
        ),
      ],
      { names: ["Earth"] },
    ),
    passage(
      "paintings-in-caves",
      ["Paintings in Caves", "洞穴里的画"],
      `In 1940, four teenagers in France were exploring the woods when their dog disappeared down a hole. When they climbed in after it, they found a cave. Its walls were covered with paintings of horses, deer and huge bulls. The cave is called Lascaux, and its paintings are about seventeen thousand years old.

      The painters had no shops to buy paint from, so they made their own pigments. They ground red and yellow earth and black charcoal into powder and mixed it with water or animal fat. They painted with their fingers, with brushes of hair or moss, and by blowing paint through hollow bones.

      Caves are dark, so the artists worked by the light of small lamps that burned animal fat. Some paintings are high on the walls or ceilings, so they must have built ladders or platforms to reach them.

      In many caves around the world, people also left outlines of their hands. They pressed a hand against the rock and blew paint around it. These handprints are like signatures from people who lived long ago.

      No one knows for certain why the paintings were made. They may have been part of stories, ceremonies or hunting.`,
      [painting, color],
      [
        q(
          ["How were the Lascaux paintings found?", "拉斯科洞穴的画是怎样被发现的？"],
          ["Teenagers followed their dog into a hole", "几个少年跟着他们的狗钻进一个洞"],
          [
            ["Scientists dug in the woods for many years", "科学家们在树林里挖了很多年"],
            ["A farmer was digging a well in his field", "一位农民在田里挖井"],
            ["Hunters were looking for horses", "猎人们在找马"],
          ],
          [
            "The first paragraph says four teenagers found the cave when they climbed in after their dog.",
            "第一段说，四个少年跟着狗爬进去，发现了这个洞穴。",
          ],
          [
            ["Scientists digging for years is not in the passage.", "科学家挖了好多年文中没有。"],
            ["A farmer digging a well found the clay soldiers in China.", "农民挖井发现的是中国的兵马俑。"],
            ["Hunters looking for horses is not in the passage.", "猎人找马文中没有。"],
          ],
        ),
        q(
          ["How did the cave painters get their colors?", "洞穴画家是怎样得到颜料的？"],
          ["They ground earth and charcoal and mixed it with water or fat", "他们把泥土和木炭磨成粉，再和水或油脂混合"],
          [
            ["They bought their paint from the shops in the nearby towns", "他们从附近城镇的商店买颜料"],
            ["They used the blood of the animals they painted", "他们用所画动物的血"],
            ["They squeezed the juice from flowers", "他们挤出花的汁液"],
          ],
          [
            "The second paragraph says they ground red and yellow earth and charcoal into powder and mixed it with water or animal fat.",
            "第二段说，他们把红色和黄色的泥土以及黑色的木炭磨成粉，和水或动物油脂混合。",
          ],
          [
            ["Shops are wrong. There were no shops to buy paint from.", "商店不对。那时没有卖颜料的店。"],
            ["Animal blood is not in the passage.", "动物的血文中没有。"],
            ["Flower juice is not in the passage.", "花汁文中没有。"],
          ],
        ),
        q(
          ["Why does the author compare the handprints to signatures?", "作者为什么把手印比作签名？"],
          ["They show that a real person was there", "它们表明有一个真实的人在那里"],
          [
            ["They were written with a pen", "它们是用笔写的"],
            ["They spell out the painters' names in letters", "它们用字母拼出了画家的名字"],
            ["They were used to buy food", "它们被用来买食物"],
          ],
          [
            "Like a signature, a handprint marks the work of one particular person, here someone who lived long ago.",
            "像签名一样，手印标出了某一个人的作品，这里是一个很久以前生活的人。",
          ],
          [
            ["A pen is wrong. They blew paint around their hands.", "笔不对。他们是在手的周围吹颜料。"],
            ["Spelling names is wrong. They are outlines, not letters.", "拼出名字不对。它们是手的轮廓，不是字母。"],
            ["Buying food is not in the passage.", "买食物文中没有。"],
          ],
        ),
        q(
          ["How did the cave artists see in the dark?", "洞穴画家怎样在黑暗中看清？"],
          ["By small lamps that burned animal fat", "靠燃烧动物脂肪的小油灯"],
          [
            ["By sunlight through a hole", "靠从洞口照进来的阳光"],
            ["By candles of wax", "靠蜡烛"],
            ["By the light of a fire outside", "靠外面火堆的光"],
          ],
          ["The artists worked by the light of small lamps that burned animal fat.", "画家们借着燃烧动物脂肪的小油灯的光作画。"],
          [
            ["Sunlight through a hole is wrong. Caves are dark.", "洞口透进的阳光不对。洞里很黑。"],
            ["Wax candles are not named. The lamps burned animal fat.", "蜡烛文中没提。灯烧的是动物脂肪。"],
            ["A fire outside is not in the passage.", "外面的火文中没有。"],
          ],
        ),
      ],
      { names: ["France", "Lascaux"] },
    ),
    passage(
      "mixing-colors",
      ["Mixing Colors", "调色"],
      `If you open a box of paints, you might find dozens of colors. But painters know that they can make almost any hue from just three: red, yellow and blue. These are called the primary colors, because they cannot be made by mixing other paints.

      When you mix two primary colors, you get a secondary color. Red and yellow make orange. Yellow and blue make green. Blue and red make purple. By changing how much of each you use, you can make a yellowish green or a bluish green.

      Painters also change colors with white and black. Adding white makes a tint, a paler, softer version of a color. Pink is a tint of red. Adding black makes a shade, which is darker. Navy is a shade of blue.

      Some colors are opposites. Red and green, blue and orange, and yellow and purple are called complementary colors. When they sit side by side, each one makes the other look brighter. Artists use them to make a part of a picture stand out.

      Mixing takes practice. Too many colors mixed together turn into a muddy brown, so most painters keep a clean spot on their palette for each new blend.`,
      [color, painting],
      [
        q(
          ["Why are red, yellow and blue called primary colors?", "为什么红、黄、蓝被称为原色？"],
          ["They cannot be made by mixing other paints", "它们不能用其他颜料调出来"],
          [
            ["They are the colors of the rainbow", "它们是彩虹的颜色"],
            ["They are the most popular colors in every box of paints", "它们是每盒颜料里最受欢迎的颜色"],
            ["They make brown when mixed", "混合后会变成棕色"],
          ],
          [
            "The first paragraph says these are called primary colors because they cannot be made by mixing other paints.",
            "第一段说，它们叫原色，因为不能用其他颜料调出来。",
          ],
          [
            ["The rainbow is not the reason given.", "彩虹不是文中给的原因。"],
            ["Being popular is not the reason given.", "受欢迎不是文中给的原因。"],
            ["Making brown is what happens when too many colors are mixed.", "变成棕色是混太多颜色的结果。"],
          ],
        ),
        q(
          ["What is a tint?", "什么是浅色调（tint）？"],
          ["A color with white added", "加了白色的颜色"],
          [
            ["A color with black added", "加了黑色的颜色"],
            ["A mix of two primary colors", "两种原色的混合"],
            ["A color that is the opposite of another one", "与另一种颜色相对的颜色"],
          ],
          [
            "The third paragraph says adding white makes a tint; adding black makes a shade, and two primaries make a secondary color.",
            "第三段说，加白色得到浅色调；加黑色得到暗色调，两种原色混合得到间色。",
          ],
          [
            ["Black added makes a shade.", "加黑色得到的是暗色。"],
            ["Two primaries mixed make a secondary color.", "两种原色混合得到的是二次色。"],
            ["An opposite color is a complementary color.", "相反的颜色是互补色。"],
          ],
        ),
        q(
          ["Why might an artist put orange next to blue?", "艺术家为什么会把橙色放在蓝色旁边？"],
          ["To make a part of the picture stand out", "让画的某一部分更突出"],
          [
            ["To make a muddy brown", "调出浑浊的棕色"],
            ["To make the colors paler", "让颜色变浅"],
            ["To save paint", "节省颜料"],
          ],
          [
            "The fourth paragraph says complementary colors make each other look brighter, so artists use them to make a part stand out.",
            "第四段说，互补色会让彼此看起来更亮，所以艺术家用它们来突出某一部分。",
          ],
          [
            ["Muddy brown comes from mixing too many colors.", "浑浊的棕色来自混太多颜色。"],
            ["Paler colors come from adding white.", "更浅的颜色来自加白色。"],
            ["Saving paint is not the reason given.", "节省颜料不是文中给的原因。"],
          ],
        ),
        q(
          ["What do yellow and blue make?", "黄色和蓝色混合成什么？"],
          ["Green", "绿色"],
          [
            ["Orange", "橙色"],
            ["Purple", "紫色"],
            ["Brown", "棕色"],
          ],
          ['The text says, "Yellow and blue make green."', "短文说：“黄色和蓝色混合成绿色。”"],
          [
            ["Orange comes from red and yellow.", "橙色来自红和黄。"],
            ["Purple comes from blue and red.", "紫色来自蓝和红。"],
            ["Brown comes from mixing too many colors.", "棕色来自混太多颜色。"],
          ],
        ),
      ],
    ),
    passage(
      "portraits-and-faces",
      ["Portraits and Faces", "肖像与面孔"],
      `A portrait is a picture of a person. For thousands of years, artists have painted, drawn and carved portraits, and many of the most famous works of art in the world are faces.

      Perhaps the best known is the Mona Lisa, painted by Leonardo da Vinci in Italy more than five hundred years ago. The woman in the portrait has a quiet, mysterious smile. Some people think she looks happy, and others think she looks a little sad. Leonardo softened the edges of her mouth and eyes with thin layers of paint, so her expression seems to change as you look at it.

      A good portrait shows more than what a person looks like. It can show who they are. An artist chooses the pose, the clothes, the background and the objects around the person. A scientist might be painted with her books, and a farmer with his tools.

      When artists paint themselves, the picture is called a self-portrait. The Mexican painter Frida Kahlo painted more than fifty of them. She often added plants, animals and symbols to show her feelings and her love of Mexico.

      Next time you see a portrait, look closely. What is the artist telling you about the person?`,
      [painting, describing],
      [
        q(
          ["Why does the Mona Lisa's expression seem to change?", "为什么《蒙娜丽莎》的表情似乎会变化？"],
          ["Leonardo softened the edges of her mouth and eyes", "列奥纳多把她嘴和眼睛的边缘画得很柔和"],
          [
            ["The painting is lit by a moving lamp", "这幅画被移动的灯照着"],
            ["The paint has faded over the years", "颜料多年来褪色了"],
            ["She was painted more than once", "她被画了不止一次"],
          ],
          [
            "The second paragraph says Leonardo softened the edges of her mouth and eyes with thin layers of paint, so her expression seems to change.",
            "第二段说，列奥纳多用薄薄的颜料层柔化了她嘴和眼睛的边缘，所以她的表情似乎会变。",
          ],
          [
            ["A moving lamp is not in the passage.", "移动的灯文中没有。"],
            ["Fading paint is not the reason given.", "颜料褪色不是文中给的原因。"],
            ["Being painted more than once is not in the passage.", "画了不止一次文中没有。"],
          ],
        ),
        q(
          ["How can a portrait show who a person is?", "肖像怎样能表现一个人是谁？"],
          ["Through the pose, clothes and objects the artist chooses", "通过艺术家选择的姿势、衣着和物品"],
          [
            ["By being painted exactly as large as the real person is", "通过画得和真人一模一样大"],
            ["By always showing the person smiling", "通过总是画这个人微笑"],
            ["By being painted in only one color", "通过只用一种颜色画"],
          ],
          [
            "The third paragraph says the artist chooses the pose, clothes, background and objects, such as a scientist's books.",
            "第三段说，艺术家选择姿势、衣着、背景和物品，比如科学家的书。",
          ],
          [
            ["Life size is not what the passage says.", "和真人一样大不是文中说的。"],
            ["Always smiling is wrong. The artist chooses many things.", "总是微笑不对。画家要选择很多东西。"],
            ["One color is not in the passage.", "只用一种颜色文中没有。"],
          ],
        ),
        q(
          ["What is a self-portrait?", "什么是自画像？"],
          ["A portrait an artist makes of himself or herself", "艺术家给自己画的肖像"],
          [
            ["A portrait of a famous person", "一个名人的肖像"],
            ["A portrait that has no background", "没有背景的肖像"],
            ["A portrait carved in stone", "刻在石头上的肖像"],
          ],
          [
            "The fourth paragraph says that when artists paint themselves, the picture is called a self-portrait.",
            "第四段说，艺术家画自己时，这幅画就叫自画像。",
          ],
          [
            ["A famous person can be painted by anyone. That is not a self-portrait.", "名人谁都可以画，那不是自画像。"],
            ["No background is not what self-portrait means.", "没有背景不是自画像的意思。"],
            ["Carved in stone is not what self-portrait means.", "刻在石头上不是自画像的意思。"],
          ],
        ),
        q(
          ["How many self-portraits did Frida Kahlo paint?", "弗里达·卡罗画了多少幅自画像？"],
          ["More than fifty", "五十多幅"],
          [
            ["Exactly five", "正好五幅"],
            ["About ten", "大约十幅"],
            ["More than five hundred", "五百多幅"],
          ],
          ["The Mexican painter Frida Kahlo painted more than fifty self-portraits.", "墨西哥画家弗里达·卡罗画了五十多幅自画像。"],
          [
            ["Five is far too few.", "五幅太少了。"],
            ["Ten is far too few.", "十幅太少了。"],
            ["Five hundred mixes it up with the Mona Lisa's age.", "五百幅把它和《蒙娜丽莎》的年代弄混了。"],
          ],
        ),
      ],
      { names: ["Mona", "Lisa", "Leonardo", "da", "Vinci", "Italy", "Mexican", "Frida", "Kahlo", "Mexico"] },
    ),
    passage(
      "landscapes",
      ["Landscapes", "风景画"],
      `A landscape is a picture of the land: mountains, rivers, fields, forests or the sea. In some paintings people are tiny or missing altogether, because the real subject is nature itself.

      In China, landscape painting has a history of more than a thousand years. Its Chinese name means "mountains and water." Painters did not usually sit outside and copy one view. Instead, they walked in the mountains, studied them for a long time and then painted from memory at home. They wanted to show the spirit of a place, not just its shape. Tall peaks rise through the mist, and a tiny figure crossing a bridge shows how small people are beside nature.

      In Europe, many painters began working outdoors about two hundred years ago, when paint in tubes made it easy to carry. They tried to catch the light at one moment of the day, painting quickly before it changed.

      The Dutch painter Vincent van Gogh painted landscapes with thick, swirling strokes. In The Starry Night, the sky over a sleeping village seems to move like the sea.

      A landscape lets you travel to a place without leaving the room.`,
      [painting, imagery],
      [
        q(
          ["How did many Chinese landscape painters work?", "许多中国山水画家是怎样作画的？"],
          ["They studied the mountains and painted from memory", "他们观察山川，然后凭记忆作画"],
          [
            ["They sat outside and copied one view exactly", "他们坐在户外，一笔一笔照着一处景色画"],
            ["They painted quickly before the light changed", "他们在光线变化前快速作画"],
            ["They used paint from tubes", "他们用管装颜料"],
          ],
          [
            "The second paragraph says they walked in the mountains, studied them and then painted from memory at home.",
            "第二段说，他们在山中行走，观察山川，然后回家凭记忆作画。",
          ],
          [
            ["Copying one view outside is what they usually did not do.", "在户外照着一处画正是他们通常不做的。"],
            ["Painting before the light changed is how European painters worked.", "趁光线变化前快画是欧洲画家的做法。"],
            ["Paint in tubes is from Europe two hundred years ago.", "管装颜料是两百年前欧洲的事。"],
          ],
        ),
        q(
          ["What does the tiny figure on a bridge show in a Chinese landscape?", "中国山水画中桥上的小人表现了什么？"],
          ["How small people are beside nature", "人在大自然面前多么渺小"],
          [
            ["Who painted the picture", "这幅画是谁画的"],
            ["That the painting is unfinished", "这幅画还没有画完"],
            ["Where the painter lived when the picture was painted", "画家作画时住在哪里"],
          ],
          [
            "The second paragraph says a tiny figure crossing a bridge shows how small people are beside nature.",
            "第二段说，过桥的小人表现了人在大自然面前多么渺小。",
          ],
          [
            ["Who painted it is not what the figure shows.", "谁画的不是那个小人表示的。"],
            ["Being unfinished is not in the passage.", "没画完文中没有。"],
            ["Where the painter lived is not in the passage.", "画家住哪里文中没有。"],
          ],
        ),
        q(
          ["What image does the author use for the sky in The Starry Night?", "作者用什么意象来描写《星月夜》中的天空？"],
          ["It seems to move like the sea", "它好像像大海一样涌动"],
          [
            ["It is as quiet as the sleeping village", "它像沉睡的村庄一样安静"],
            ["It is hidden by mist", "它被雾遮住了"],
            ["It is as flat as a field", "它像田野一样平"],
          ],
          [
            "The fourth paragraph says that in The Starry Night, the sky seems to move like the sea, an image of movement.",
            "第四段说，在《星月夜》中，天空好像大海一样涌动，这是一个表现动感的意象。",
          ],
          [
            ["Quiet as the village is wrong. The sky seems to move.", "和村庄一样安静不对。天空好像在动。"],
            ["Hidden by mist is from Chinese landscapes.", "被雾遮住说的是中国山水画。"],
            ["Flat as a field is the opposite of swirling.", "像田野一样平正好和旋转相反。"],
          ],
        ),
        q(
          ["What does the Chinese name for landscape painting mean?", "中国山水画的名字是什么意思？"],
          ["Mountains and water", "山和水"],
          [
            ["Fields and forests", "田野和森林"],
            ["Sky and sea", "天空和大海"],
            ["Light and shadow", "光和影"],
          ],
          ['Its Chinese name means "mountains and water."', "它的中文名字意思是“山和水”。"],
          [
            [
              "Fields and forests are in the definition of landscape, not the Chinese name.",
              "田野和森林是风景画的定义，不是中文名的意思。",
            ],
            ["Sky and sea are not the Chinese name.", "天和海不是中文名的意思。"],
            ["Light and shadow is about ink painting.", "光和影说的是水墨画。"],
          ],
        ),
      ],
      { names: ["China", "Chinese", "Europe", "Dutch", "Vincent", "van", "Gogh", "Starry"] },
    ),
    passage(
      "ink-and-brush",
      ["Ink and Brush", "笔与墨"],
      `In China, painting and writing have always been close cousins. Both use the same tools, which were once called the Four Treasures of the Study: the brush, the ink stick, the ink stone and paper.

      To make ink, a painter grinds the ink stick against the wet ink stone. By adding more or less water, the painter can make ink that is deep black, soft gray or so pale that it is almost invisible. Many ink paintings use no other color at all, yet they seem full of light and shadow.

      The brush is made of animal hair set in a bamboo handle. Pressed down, it makes a wide, dark stroke. Lifted lightly, it makes a thin line. A skilled painter can make a single stroke that is thick at one end and fine at the other, like a bamboo leaf.

      Ink cannot be erased, and it soaks into the paper at once. So the painter must think first and then paint quickly and surely. Years of practice go into a few seconds of work.

      The painter Qi Baishi was famous for his shrimp. With just a few strokes of gray ink, he made them look as if they were swimming through clear water.`,
      [painting, sculpture],
      [
        q(
          ["How does a painter make ink of different darkness?", "画家怎样调出深浅不同的墨？"],
          ["By adding more or less water", "通过加多加少的水"],
          [
            ["By using inks of different colors", "通过使用不同颜色的墨"],
            ["By pressing harder on the paper with a thin pen", "通过用细笔更用力地压纸"],
            ["By drying it in the sun", "通过在太阳下晒干"],
          ],
          [
            "The second paragraph says that by adding more or less water, the painter can make ink deep black, soft gray or very pale.",
            "第二段说，加多加少的水，画家就能调出浓黑、淡灰或很浅的墨。",
          ],
          [
            ["Different colored inks is wrong. Many ink paintings use no other color.", "不同颜色的墨不对。很多水墨画不用别的颜色。"],
            ["A thin pen is wrong. Painters use a brush.", "细笔不对。画家用的是毛笔。"],
            ["Drying in the sun is not in the passage.", "在太阳下晒干文中没有。"],
          ],
        ),
        q(
          ["Why must an ink painter think first and paint quickly?", "为什么水墨画家必须先想好再快速作画？"],
          ["Ink cannot be erased and soaks in at once", "墨无法擦掉，而且会立刻渗入纸中"],
          [
            ["The ink stone dries out in a few seconds", "砚台几秒钟就干了"],
            ["The brush loses its hairs if used slowly", "毛笔用得慢会掉毛"],
            ["Paper was too expensive to buy", "纸太贵买不起"],
          ],
          [
            "The fourth paragraph says ink cannot be erased and soaks into the paper at once, so the painter must think first.",
            "第四段说，墨擦不掉，而且立刻渗进纸里，所以画家必须先想好。",
          ],
          [
            ["The ink stone drying is not the reason.", "砚台变干不是原因。"],
            ["The brush losing hairs is not in the passage.", "毛笔掉毛文中没有。"],
            ["Expensive paper is not the reason given.", "纸太贵不是文中给的原因。"],
          ],
        ),
        q(
          ["What was Qi Baishi famous for painting?", "齐白石以画什么闻名？"],
          ["Shrimp", "虾"],
          [
            ["Bamboo leaves", "竹叶"],
            ["Mountains in the mist", "雾中的山"],
            ["Portraits", "肖像"],
          ],
          [
            "The last paragraph says Qi Baishi was famous for his shrimp, painted with a few strokes of gray ink.",
            "最后一段说，齐白石以画虾闻名，他只用几笔淡墨就画出了虾。",
          ],
          [
            ["Bamboo leaves describe the shape of one brush stroke.", "竹叶说的是一笔的形状。"],
            ["Mountains in mist are from landscape painting.", "雾中的山来自山水画。"],
            ["Portraits are from another passage.", "肖像来自另一篇文章。"],
          ],
        ),
        q(
          ["What were the Four Treasures of the Study?", "文房四宝是什么？"],
          ["The brush, the ink stick, the ink stone and paper", "笔、墨、砚和纸"],
          [
            ["Four famous paintings", "四幅名画"],
            ["Red, yellow, blue and black ink", "红、黄、蓝、黑四种墨"],
            ["Silk, bamboo, bone and clay", "丝绸、竹子、骨头和陶土"],
          ],
          ["The Four Treasures of the Study are the brush, the ink stick, the ink stone and paper.", "文房四宝是笔、墨、砚和纸。"],
          [
            ["Four famous paintings is wrong. They are tools.", "四幅名画不对。它们是工具。"],
            ["Colored inks are wrong. Ink is ground from one stick.", "彩色墨水不对。墨是从墨条磨出来的。"],
            ["Silk, bamboo, bone and clay are not the four treasures.", "丝、竹、骨、陶不是文房四宝。"],
          ],
        ),
      ],
      { names: ["China", "Four Treasures", "Study", "Qi", "Baishi"] },
    ),
    passage(
      "sculptures-in-stone-and-clay",
      ["Sculptures in Stone and Clay", "石头与陶土的雕塑"],
      `A painting is flat, but a sculpture has three dimensions. You can walk around it and see it from every side. Sculptors make their works in two main ways: by taking material away or by building it up.

      Carving takes material away. The sculptor starts with a block of stone or wood and cuts away everything that is not part of the figure. The Italian artist Michelangelo carved his statue of David from a single block of marble more than five meters tall. He worked on it for about three years with hammers and chisels. One wrong cut could not be undone.

      Modeling builds material up. The sculptor shapes soft clay with fingers and tools, adding and pressing until the figure is finished. Then the clay is fired in a hot kiln, which makes it hard.

      In 1974, farmers digging a well in China broke into something astonishing: an army of clay soldiers, buried more than two thousand years ago to guard the tomb of the first emperor of China. There are about eight thousand of them, and each face is different. Some soldiers are smiling, some are serious, and some look tired. They were once painted in bright colors.`,
      [sculpture, details],
      [
        q(
          ["What is the difference between carving and modeling?", "雕刻和塑造有什么不同？"],
          ["Carving takes material away and modeling builds it up", "雕刻是去掉材料，塑造是堆加材料"],
          [
            ["Carving uses clay and modeling uses stone", "雕刻用陶土，塑造用石头"],
            ["Carving is flat, while modeling has three dimensions", "雕刻是平的，而塑造是立体的"],
            ["Carving is fired in a kiln and modeling is not", "雕刻要放进窑里烧，塑造不用"],
          ],
          [
            "The first three paragraphs explain that carving takes material away from a block, while modeling builds up soft clay.",
            "前三段说明，雕刻是从一块材料上去掉多余部分，而塑造是用软陶土一点点堆起来。",
          ],
          [
            ["Clay and stone are swapped. Carving uses stone or wood.", "陶土和石头说反了。雕刻用的是石头或木头。"],
            ["Flat is wrong. Both make sculptures with three dimensions.", "平面不对。两者做出的雕塑都是立体的。"],
            ["Firing in a kiln belongs to modeling, not carving.", "进窑烧是塑造的步骤，不是雕刻的。"],
          ],
        ),
        q(
          ["Why does clay go into a kiln?", "为什么要把陶土放进窑里？"],
          ["The heat makes it hard", "高温让它变硬"],
          [
            ["The heat makes it soft enough to shape", "高温让它软得可以塑形"],
            ["The kiln paints it in bright colors", "窑会给它涂上鲜艳的颜色"],
            ["The kiln cuts away the parts that are not needed", "窑会去掉不需要的部分"],
          ],
          [
            "The third paragraph says the clay is fired in a hot kiln, which makes it hard.",
            "第三段说，陶土要放进高温的窑里烧，这样会变硬。",
          ],
          [
            ["Making it soft is backwards. Clay is soft before firing.", "让它变软是反的。烧之前黏土是软的。"],
            ["Painting it is not what the kiln does.", "上色不是窑做的事。"],
            ["Cutting away is carving, not firing.", "削掉是雕刻，不是烧制。"],
          ],
        ),
        q(
          ["Which detail shows how carefully the clay soldiers were made?", "哪个细节表明陶俑做得多么用心？"],
          ["Each face is different", "每张脸都不一样"],
          [
            ["They were found by farmers", "它们是农民发现的"],
            ["They were buried long ago", "它们很久以前就被埋了"],
            ["They guarded a tomb", "它们守护着一座陵墓"],
          ],
          [
            "The last paragraph says each of the eight thousand faces is different, which shows great care; the other details do not.",
            "最后一段说，八千张脸各不相同，这表现了极大的用心；其他细节没有说明这一点。",
          ],
          [
            ["Being found by farmers is about how they were discovered.", "被农民发现说的是怎样被找到的。"],
            ["Being buried long ago is about age, not care.", "很久以前被埋说的是年代，不是用心。"],
            ["Guarding a tomb is their purpose, not their care.", "守护陵墓是用途，不是制作的用心。"],
          ],
        ),
      ],
      { names: ["Italian", "Michelangelo", "David", "China"] },
    ),
    passage(
      "art-on-walls",
      ["Art on Walls", "墙上的艺术"],
      `Some art is too big to hang on a wall, because it is the wall. A painting made directly on a wall or ceiling is called a mural.

      Murals are one of the oldest kinds of art. Long ago, people in Egypt painted the walls of tombs with scenes of farming, fishing and feasting. In Rome, rich families covered their walls with painted gardens, so their rooms felt as if they opened onto the outdoors.

      One old way to paint a mural is called fresco. The painter spreads a layer of wet plaster on the wall and paints on it before it dries. The colors soak into the plaster and become part of the wall, so a fresco can last for hundreds of years. But the painter must work fast and only paint as much as can be finished in one day.

      In the last hundred years, artists in Mexico, such as Diego Rivera, painted huge murals on public buildings. They showed the history of the country and the lives of ordinary workers, so that everyone, not only the rich, could enjoy art.

      Today, murals brighten schools, hospitals and city streets around the world. Often a whole neighborhood helps to plan and paint them.`,
      [painting, describing],
      [
        q(
          ["What is a mural?", "什么是壁画？"],
          ["A painting made directly on a wall or ceiling", "直接画在墙上或天花板上的画"],
          [
            ["A painting of a garden", "一幅花园的画"],
            ["A painting that is hung on a wall in a frame", "装在画框里挂在墙上的画"],
            ["A kind of statue", "一种雕像"],
          ],
          [
            "The first paragraph defines a mural as a painting made directly on a wall or ceiling.",
            "第一段把壁画定义为直接画在墙上或天花板上的画。",
          ],
          [
            ["A painting of a garden is one example of a mural, not its meaning.", "花园的画只是壁画的一个例子，不是定义。"],
            ["Hung in a frame is the opposite. A mural is the wall itself.", "挂在框里正好相反。壁画就画在墙上。"],
            ["A statue is not a painting.", "雕像不是画。"],
          ],
        ),
        q(
          ["Why can a fresco last for hundreds of years?", "为什么湿壁画能保存几百年？"],
          ["The colors soak into the plaster and become part of the wall", "颜料渗入灰泥，成为墙的一部分"],
          [
            ["It is painted in a single day", "它是一天之内画完的"],
            ["It is covered with glass", "它被玻璃盖住了"],
            ["It is painted only on ceilings", "它只画在天花板上"],
          ],
          [
            "The third paragraph says the colors soak into the wet plaster and become part of the wall.",
            "第三段说，颜料渗进湿灰泥里，成为墙的一部分。",
          ],
          [
            ["One day is how fast it must be painted, not why it lasts.", "一天是作画要多快，不是它能持久的原因。"],
            ["Glass is not in the passage.", "玻璃文中没有。"],
            ["Only on ceilings is wrong. Frescoes go on walls.", "只在天花板上不对。湿壁画画在墙上。"],
          ],
        ),
        q(
          ["Why did Diego Rivera paint murals on public buildings?", "迭戈·里维拉为什么在公共建筑上画壁画？"],
          ["So that everyone could enjoy art", "让每个人都能欣赏艺术"],
          [
            ["Because walls were cheaper than canvas", "因为墙比画布便宜"],
            ["To decorate the tombs of rich families", "为了装饰富人家族的陵墓"],
            ["Because the government would not let him paint anywhere else", "因为政府不让他在别处作画"],
          ],
          [
            "The fourth paragraph says the murals showed the country's history and workers' lives so that everyone, not only the rich, could enjoy art.",
            "第四段说，这些壁画表现国家的历史和工人的生活，让每个人而不只是富人都能欣赏艺术。",
          ],
          [
            ["Cheaper walls is not the reason given.", "墙更便宜不是文中给的原因。"],
            ["Rich families' tombs is Egypt, long ago.", "富人的墓是很久以前埃及的事。"],
            ["The government stopping him is not in the passage.", "政府不许他在别处画文中没有。"],
          ],
        ),
      ],
      { names: ["Egypt", "Rome", "Mexico", "Diego", "Rivera"] },
    ),
  ],
};

/** playsUnit is the reading unit of short plays, written as scripts. */
export const playsUnit: ReadingUnitDef = {
  id: "plays-for-the-stage",
  title: t("Plays for the Stage", "舞台上的戏剧"),
  passages: [
    passage(
      "the-lost-ticket",
      ["The Lost Ticket", "丢失的票"],
      `CHARACTERS: MAYA, a girl of ten; LEO, her younger brother; MOM.

      SETTING: The front hall of a house, early evening. Coats hang by the door.

      [MAYA is searching through her backpack. She throws out books and a sock.]

      MAYA: It's gone! My ticket to the concert is gone!

      LEO: [Looking up from his comic] Did you look in your coat?

      MAYA: Of course I looked in my coat. I'm not a baby, Leo.

      LEO: [Shrugging] I was only trying to help.

      [MOM enters, holding car keys.]

      MOM: We leave in five minutes. Is everyone ready?

      MAYA: [In a small voice] I can't find my ticket.

      MOM: Take a deep breath. Where did you last see it?

      MAYA: [Thinking] At breakfast. I was showing it to Leo.

      LEO: [Slowly] And then you put it in the cereal box so it wouldn't get lost.

      [MAYA runs offstage. A crash is heard. She comes back holding the ticket and shaking cereal out of her hair.]

      MAYA: Found it! [Pausing] Leo, I'm sorry I snapped at you.

      LEO: [Grinning] That's all right. Can I have the cereal?

      [Everyone laughs. Lights fade.]`,
      [theater, parts],
      [
        q(
          ["What is the problem at the start of the play?", "戏剧开头的问题是什么？"],
          ["Maya cannot find her concert ticket", "玛雅找不到她的音乐会门票"],
          [
            ["Leo has lost his favorite comic book", "利奥弄丢了他最喜欢的漫画书"],
            ["Mom cannot find the car keys", "妈妈找不到车钥匙"],
            ["The concert has been canceled", "音乐会被取消了"],
          ],
          [
            "Maya's first line is that her ticket to the concert is gone, and the play is about finding it.",
            "玛雅的第一句台词就是她的音乐会门票不见了，整部戏都围绕找票展开。",
          ],
          [
            ["Leo is reading his comic. It is not lost.", "利奥在看漫画，漫画没丢。"],
            ["Mom is holding the car keys.", "妈妈手里拿着车钥匙。"],
            ["A canceled concert is not in the play.", "音乐会取消剧中没有。"],
          ],
        ),
        q(
          ["What does the stage direction [In a small voice] tell the actor playing Maya?", "舞台说明“小声地”告诉扮演玛雅的演员什么？"],
          ["To speak quietly, as if worried or ashamed", "要小声说，像是担心或惭愧"],
          [
            ["To shout so the whole audience can hear", "要大声喊，让所有观众都听见"],
            ["To leave the stage", "要离开舞台"],
            ["To sing the line as if she were at the concert", "要像在音乐会上一样把台词唱出来"],
          ],
          [
            "A stage direction tells the actor how to say a line; a small voice is quiet and shows that Maya is worried.",
            "舞台说明告诉演员怎样说台词；小声说表现出玛雅很担心。",
          ],
          [
            ["Shouting is the opposite of a small voice.", "大喊正好和小声相反。"],
            ["Leaving the stage is a different direction.", "离开舞台是另一种舞台说明。"],
            ["Singing is not in the play.", "唱歌剧中没有。"],
          ],
        ),
        q(
          ["What does Maya's last line show about her?", "玛雅最后一句台词表现了她什么？"],
          ["She knows she was unkind and says sorry", "她知道自己态度不好，向弟弟道歉"],
          [
            ["She is still angry with Leo", "她还在生利奥的气"],
            ["She does not care about the concert", "她不在乎音乐会"],
            ["She wants to eat the cereal herself", "她想自己吃麦片"],
          ],
          [
            "Maya says, I'm sorry I snapped at you, which shows she knows she was unkind to Leo earlier.",
            "玛雅说“对不起，我刚才冲你发火了”，这表明她知道自己之前对利奥不好。",
          ],
          [
            ["Still angry is wrong. She says sorry.", "还在生气不对。她道歉了。"],
            ["Not caring is wrong. She was upset to lose the ticket.", "不在乎不对。丢了票她很着急。"],
            ["Wanting the cereal is Leo's line.", "想要麦片是利奥的台词。"],
          ],
        ),
        q(
          ["How long is it until the family leaves?", "还有多久全家要出发？"],
          ["Five minutes", "五分钟"],
          [
            ["One hour", "一小时"],
            ["Two minutes", "两分钟"],
            ["Ten minutes", "十分钟"],
          ],
          ['Mom says, "We leave in five minutes."', "妈妈说：“我们五分钟后出发。”"],
          [
            ["One hour is far too long.", "一小时太长了。"],
            ["Two minutes is not what Mom says.", "两分钟不是妈妈说的。"],
            ["Ten minutes is not what Mom says.", "十分钟不是妈妈说的。"],
          ],
        ),
      ],
      { names: ["Maya", "Leo", "Mom"] },
    ),
    passage(
      "grandpas-robot",
      ["Grandpa's Robot", "爷爷的机器人"],
      `CHARACTERS: GRANDPA; SAM, his grandson; BOLT, a robot.

      SETTING: A messy garage full of tools. A robot made of old pots and pans stands in the corner.

      GRANDPA: [Proudly] There he is, Sam. I built him myself. His name is Bolt.

      SAM: [Doubtfully] Does he actually work?

      GRANDPA: Watch this. [He presses a big red button.] Bolt, make us a cup of tea!

      [BOLT jerks to life. He picks up a watering can and pours water into a flowerpot.]

      BOLT: [In a flat, beeping voice] Tea. Is. Ready.

      SAM: [Trying not to laugh] Grandpa, that's a flowerpot.

      GRANDPA: Hmm. A small problem. Bolt, sweep the floor!

      [BOLT grabs a broom and begins sweeping the ceiling instead.]

      SAM: [Laughing] He's sweeping the ceiling!

      GRANDPA: [Scratching his head] He's very clean, at least.

      SAM: Can I look at him? [He opens a panel on BOLT's back.] Look, Grandpa, two wires are crossed. The red one goes here, and the blue one goes there.

      [SAM switches the wires. BOLT stands up straight.]

      BOLT: [In a cheerful voice] Good afternoon! Shall I make some tea?

      GRANDPA: [Hugging SAM] What would I do without you?

      SAM: [Smiling] Probably drink a lot of flowerpot tea.`,
      [theater, traits],
      [
        q(
          ["Who are the characters of this play?", "这部戏的人物有哪些？"],
          ["Grandpa, Sam and a robot named Bolt", "爷爷、萨姆和一个叫博尔特的机器人"],
          [
            ["Grandpa, Sam and Sam's mother", "爷爷、萨姆和萨姆的妈妈"],
            ["Sam and his two friends from school", "萨姆和他的两个同学"],
            ["Grandpa and a cook", "爷爷和一个厨师"],
          ],
          [
            "The list of characters at the top of a script names everyone in the play: Grandpa, Sam and Bolt, a robot.",
            "剧本开头的人物表列出了戏里所有人物：爷爷、萨姆和机器人博尔特。",
          ],
          [
            ["Sam's mother is not in this play.", "萨姆的妈妈不在这出戏里。"],
            ["Friends from school are not in this play.", "学校的朋友不在这出戏里。"],
            ["A cook is not in this play.", "厨师不在这出戏里。"],
          ],
        ),
        q(
          ["What causes Bolt to do everything wrong?", "是什么让博尔特把每件事都做错？"],
          ["Two of his wires are crossed", "他的两根电线接反了"],
          [
            ["He is made of old pots and pans", "他是用旧锅碗做的"],
            ["Grandpa pressed the wrong button", "爷爷按错了按钮"],
            ["Sam had played a trick on him", "萨姆捉弄了他"],
          ],
          [
            "Sam opens the panel and finds that two wires are crossed; when he switches them, Bolt works.",
            "萨姆打开面板，发现两根电线接反了；他把电线换过来后，博尔特就正常了。",
          ],
          [
            ["Pots and pans are what he is made of, not why he goes wrong.", "锅碗瓢盆是他的材料，不是出错的原因。"],
            ["The wrong button is not in the play. Grandpa pressed the big red one.", "按错按钮剧中没有。爷爷按的是那个大红按钮。"],
            ["A trick by Sam is wrong. Sam fixed him.", "萨姆捉弄他不对。是萨姆修好了他。"],
          ],
        ),
        q(
          ["What does Grandpa's line He's very clean, at least show about him?", "爷爷说“至少他很干净”，这表现了他什么？"],
          ["He stays cheerful and sees the good side", "他保持乐观，看到好的一面"],
          [
            ["He is angry that the robot failed", "他因为机器人出错而生气"],
            ["He does not care whether the robot works", "他不在乎机器人能不能用"],
            ["He thinks that Sam broke the robot", "他认为是萨姆弄坏了机器人"],
          ],
          [
            "Instead of getting upset when Bolt sweeps the ceiling, Grandpa finds something good to say, which shows he is cheerful.",
            "博尔特扫天花板时，爷爷没有生气，反而找了句好话说，表现出他很乐观。",
          ],
          [
            ["Angry is wrong. He jokes about it.", "生气不对。他拿这事开玩笑。"],
            ["Not caring is wrong. He built Bolt proudly.", "不在乎不对。他很自豪地造了波尔特。"],
            ["Blaming Sam is not in the play.", "怪萨姆剧中没有。"],
          ],
        ),
        q(
          ["What is Bolt made of?", "博尔特是用什么做的？"],
          ["Old pots and pans", "旧锅碗瓢盆"],
          [
            ["Shiny new metal", "闪亮的新金属"],
            ["Wood and string", "木头和绳子"],
            ["Paper and glue", "纸和胶水"],
          ],
          [
            "The setting says a robot made of old pots and pans stands in the corner.",
            "场景说明里说，角落里站着一个用旧锅碗瓢盆做成的机器人。",
          ],
          [
            ["Shiny new metal is wrong. The pots are old.", "崭新的金属不对。锅是旧的。"],
            ["Wood and string are not in the play.", "木头和绳子剧中没有。"],
            ["Paper and glue are not in the play.", "纸和胶水剧中没有。"],
          ],
        ),
      ],
      { names: ["Grandpa", "Sam", "Bolt", "Bolt's"] },
    ),
    passage(
      "the-queen-who-hated-rain",
      ["The Queen Who Hated Rain", "讨厌下雨的女王"],
      `CHARACTERS: QUEEN AMARA; FINN, the royal gardener; a MESSENGER.

      SETTING: The throne room of a castle. Rain beats against the windows.

      QUEEN AMARA: [Stamping her foot] Rain, rain, rain! I hate it! It ruins my parades and spoils my shoes.

      MESSENGER: [Bowing low] Your Majesty, what shall we do?

      QUEEN AMARA: I declare that from this day on, rain is forbidden in my kingdom!

      [The MESSENGER runs out. Thunder rumbles, then stops. Bright light floods the stage.]

      QUEEN AMARA: [Smiling] There. Was that so hard?

      [Time passes. The lights grow hotter and yellower. FINN enters, carrying a dead plant.]

      FINN: Your Majesty, it has not rained for a hundred days. The roses are dead. The wells are dry. The farmers have no wheat.

      QUEEN AMARA: [Shocked] No wheat? Then what will we eat?

      FINN: [Gently] Rain may spoil your shoes, Your Majesty, but it feeds the whole kingdom.

      QUEEN AMARA: [After a long pause] Messenger! Tell the rain it may come back. [Quietly] And tell it I'm sorry.

      [Thunder rumbles. The sound of rain fills the stage. FINN holds out his hands and laughs.]

      QUEEN AMARA: [Holding out her own hand] Hmm. It's actually rather nice.`,
      [drama, traits],
      [
        q(
          ["Why does the queen forbid the rain?", "女王为什么禁止下雨？"],
          ["It ruins her parades and spoils her shoes", "雨毁了她的游行，弄脏了她的鞋"],
          [
            ["The farmers ask her to stop it", "农民请她让雨停下"],
            ["It kills the roses in the garden", "雨会让花园里的玫瑰死掉"],
            ["It makes the wells too full", "雨让井水太满"],
          ],
          [
            "The queen's first line says she hates rain because it ruins her parades and spoils her shoes.",
            "女王的第一句台词说，她讨厌雨，因为雨毁了她的游行，弄脏了她的鞋。",
          ],
          [
            ["Farmers asking is wrong. Finn speaks for them later, about the drought.", "农民请求不对。芬后来替他们说的是干旱。"],
            ["Killing roses is what the drought did.", "害死玫瑰的是干旱。"],
            ["Too-full wells is backwards. The wells went dry.", "井水太满是反的。井干了。"],
          ],
        ),
        q(
          ["What do the stage directions about the lights show?", "关于灯光的舞台说明表现了什么？"],
          ["That time passes and the land grows hot and dry", "时间过去，土地变得又热又干"],
          [
            ["That the queen is getting angrier and angrier each day", "女王一天比一天更生气"],
            ["That the castle is on fire", "城堡着火了"],
            ["That the actors should leave the stage", "演员应该离场"],
          ],
          [
            "The direction Time passes, with lights growing hotter and yellower, shows the long dry days without rain.",
            "舞台说明“时间过去”，灯光变得更热更黄，表现了没有雨的漫长干旱。",
          ],
          [
            ["Getting angrier is wrong. She is smiling at first.", "越来越生气不对。她起初在笑。"],
            ["A fire is not in the play.", "着火剧中没有。"],
            ["Leaving the stage is not what lights mean here.", "离开舞台不是这里灯光的意思。"],
          ],
        ),
        q(
          ["How does the queen change by the end of the play?", "到戏剧结尾，女王有了什么变化？"],
          ["She learns that rain is needed and says sorry", "她明白了雨是必需的，并道了歉"],
          [
            ["She grows angrier and banishes Finn", "她更生气了，把芬恩赶走了"],
            ["She buys new shoes for the parades", "她为游行买了新鞋"],
            ["She forbids the sun as well", "她把太阳也禁止了"],
          ],
          [
            "After Finn explains that rain feeds the kingdom, the queen lets the rain return, says sorry and even finds it nice.",
            "芬恩解释雨养育着整个王国后，女王让雨回来了，还道了歉，甚至觉得雨挺好。",
          ],
          [
            ["Banishing Finn is not in the play.", "驱逐芬剧中没有。"],
            ["New shoes are not in the play.", "新鞋剧中没有。"],
            ["Forbidding the sun is not in the play.", "禁止太阳剧中没有。"],
          ],
        ),
        q(
          ["How long had it not rained when Finn came in?", "芬进来时已经多久没下雨了？"],
          ["A hundred days", "一百天"],
          [
            ["Ten days", "十天"],
            ["One year", "一年"],
            ["A week", "一周"],
          ],
          ['Finn says, "Your Majesty, it has not rained for a hundred days."', "芬说：“陛下，已经一百天没下雨了。”"],
          [
            ["Ten days is far too short.", "十天太短了。"],
            ["One year is not what Finn says.", "一年不是芬说的。"],
            ["A week is far too short.", "一周太短了。"],
          ],
        ),
      ],
      { names: ["Amara", "Finn", "Majesty"] },
    ),
    passage(
      "the-lunch-swap",
      ["The Lunch Swap", "交换午餐"],
      `CHARACTERS: PRIYA and JADE, best friends; MR. OKAFOR, their teacher.

      SETTING: A school lunchroom at noon. The two girls sit side by side with their lunch boxes.

      PRIYA: [Opening her box and sighing] Rice and lentils again. Mom always packs the same thing.

      JADE: [Opening hers] I've got a cheese sandwich. Again. I'd love to try something different.

      PRIYA: [Brightening] Then let's swap!

      [They trade lunch boxes. JADE takes a big spoonful of the rice.]

      JADE: [Her eyes growing wide] Whoa! This is spicy! [She waves her hand in front of her mouth.] But it's really good!

      PRIYA: [Taking a bite of the sandwich and frowning] Hmm. It's a bit... plain.

      [MR. OKAFOR walks by and stops.]

      MR. OKAFOR: I see a trade going on. How is it?

      JADE: Priya's lunch is the best thing I've ever eaten. My mouth is on fire, but I want more.

      PRIYA: [Politely] Jade's sandwich is... very nice and soft.

      MR. OKAFOR: [Chuckling] Sounds like a good deal for one of you.

      PRIYA: [Laughing] Tomorrow I'll ask Mom to pack two boxes of rice. One for me and one for Jade.

      JADE: And I'll bring you something better than cheese. I promise!`,
      [speaking, traits],
      [
        q(
          ["Why do the girls swap lunches?", "两个女孩为什么交换午餐？"],
          ["They are both tired of eating the same thing", "她们都吃腻了同样的东西"],
          [
            ["Their teacher tells them to try some new foods today", "老师让她们今天尝试一些新食物"],
            ["Priya forgot her lunch at home", "普丽娅把午餐忘在家里了"],
            ["Jade does not like cheese at all", "杰德根本不喜欢奶酪"],
          ],
          [
            "Priya complains that her mom always packs the same thing, and Jade says she would love to try something different.",
            "普丽娅抱怨妈妈总是装同样的饭，杰德说她很想尝点不一样的。",
          ],
          [
            ["The teacher only comes by after the swap.", "老师是交换之后才走过来的。"],
            ["Priya forgetting her lunch is wrong. She opens her box.", "普丽娅忘带午饭不对。她打开了饭盒。"],
            ["Jade not liking cheese is wrong. She is only tired of it.", "洁德不喜欢奶酪不对。她只是吃腻了。"],
          ],
        ),
        q(
          ["What does Priya's line Jade's sandwich is... very nice and soft show?", "普丽娅说“杰德的三明治……很好，很软”表现了什么？"],
          ["She is being polite about food she does not love", "她对自己不太喜欢的食物说得很客气"],
          [
            ["She thinks it is the best sandwich in the school", "她认为这是学校里最好的三明治"],
            ["She wants to swap lunches every day", "她想每天都交换午餐"],
            ["She is angry with Jade", "她在生杰德的气"],
          ],
          [
            "The direction Politely and the pause in her line show that Priya is kind but does not really love the plain sandwich.",
            "舞台说明“礼貌地”和台词里的停顿表明，普丽娅很友善，但其实不太喜欢这个普通的三明治。",
          ],
          [
            ["The best sandwich is wrong. She found it plain.", "最好的三明治不对。她觉得很淡。"],
            ["Swapping every day is wrong. She wants to bring rice for Jade.", "每天交换不对。她想给洁德带米饭。"],
            ["Angry is not in the play.", "生气剧中没有。"],
          ],
        ),
        q(
          ["What does Mr. Okafor mean by a good deal for one of you?", "奥卡福老师说“对你们中的一个是笔好交易”是什么意思？"],
          ["Jade got the better lunch", "杰德换到了更好的午餐"],
          [
            ["Both girls lost their lunches", "两个女孩都没了午餐"],
            ["Priya got the better lunch", "普丽娅换到了更好的午餐"],
            ["The girls should pay for their food", "女孩们应该为食物付钱"],
          ],
          [
            "Jade loves the spicy rice and Priya finds the sandwich plain, so the trade was a good deal for Jade.",
            "杰德很喜欢辣味米饭，而普丽娅觉得三明治很普通，所以这笔交易对杰德有利。",
          ],
          [
            ["Both losing is wrong. Jade loved the rice.", "两人都吃亏不对。洁德很爱米饭。"],
            ["Priya is the one who got the plain sandwich.", "吃到淡三明治的是普丽娅。"],
            ["Paying for food is not in the play.", "付钱剧中没有。"],
          ],
        ),
        q(
          ["What is in Priya's lunch box?", "普丽娅的饭盒里有什么？"],
          ["Rice and lentils", "米饭和扁豆"],
          [
            ["A cheese sandwich", "一个奶酪三明治"],
            ["Pizza", "比萨"],
            ["Noodles", "面条"],
          ],
          ['Priya says, "Rice and lentils again."', "普丽娅说：“又是米饭和扁豆。”"],
          [
            ["A cheese sandwich is Jade's lunch.", "奶酪三明治是洁德的午饭。"],
            ["Pizza is not in the play.", "比萨剧中没有。"],
            ["Noodles are not in the play.", "面条剧中没有。"],
          ],
        ),
      ],
      { names: ["Priya", "Priya's", "Jade", "Jade's", "Okafor", "Mr.", "Mom"] },
    ),
    passage(
      "the-talent-show",
      ["The Talent Show", "才艺表演"],
      `CHARACTERS: OMAR, a nervous boy; ELLA, his friend; MS. REYES, the director of the show.

      SETTING: Backstage at the school talent show. Music and clapping can be heard from the stage.

      [OMAR paces back and forth, holding a juggling ball.]

      OMAR: I can't do it, Ella. My hands are shaking. I'll drop everything.

      ELLA: You juggled five balls at my house yesterday. You were amazing.

      OMAR: That was your kitchen. This is the whole school.

      MS. REYES: [Peeking around the curtain] Omar, you're next. Two minutes!

      [OMAR drops his ball. It rolls away.]

      OMAR: [Groaning] See?

      ELLA: [Picking up the ball] Try this. Don't look at the audience. Look at the balls. Pretend you're in my kitchen.

      OMAR: [Taking a deep breath] Your kitchen. Okay.

      MS. REYES: [Announcing] And now, Omar the Amazing!

      [OMAR walks into the spotlight. He starts to juggle. He drops one ball, stops, then picks it up and starts again. The audience cheers louder.]

      [Later. OMAR rushes backstage, out of breath.]

      OMAR: I dropped one!

      ELLA: And you picked it up and kept going. That was the best part.

      OMAR: [Grinning] Maybe next year I'll try six.`,
      [theater, traits],
      [
        q(
          ["Why is Omar nervous?", "奥马尔为什么紧张？"],
          ["He has to perform in front of the whole school", "他要在全校面前表演"],
          [
            ["He has never juggled before", "他以前从没玩过抛球"],
            ["He lost all his juggling balls", "他把抛球全弄丢了"],
            ["Ms. Reyes is angry with him for being late to the show", "雷耶斯老师因为他迟到而生气"],
          ],
          [
            "Omar says that juggling in Ella's kitchen was easy, but this is the whole school.",
            "奥马尔说，在埃拉家厨房里抛球很容易，但这里是全校。",
          ],
          [
            ["Never juggling before is wrong. He juggled five balls yesterday.", "从没抛过球不对。他昨天抛了五个球。"],
            ["Losing all his balls is wrong. Only one rolled away.", "球全丢了不对。只滚走了一个。"],
            ["Ms. Reyes being angry is not in the play.", "雷耶斯老师生气剧中没有。"],
          ],
        ),
        q(
          ["How does Ella help Omar?", "埃拉是怎样帮助奥马尔的？"],
          ["She tells him to look at the balls, not the audience", "她让他看着球，而不是看观众"],
          [
            ["She juggles in his place", "她替他抛球"],
            ["She asks Ms. Reyes to cancel his act and let someone else go", "她请雷耶斯老师取消他的节目，让别人上场"],
            ["She hides his juggling balls", "她把他的球藏起来"],
          ],
          [
            "Ella tells Omar not to look at the audience but at the balls, and to pretend he is in her kitchen.",
            "埃拉让奥马尔别看观众，看着球，假装是在她家厨房里。",
          ],
          [
            ["Juggling in his place is not in the play.", "替他表演剧中没有。"],
            ["Canceling his act is not in the play.", "取消他的节目剧中没有。"],
            ["Hiding his balls is the opposite. She picks one up for him.", "藏起他的球正好相反。她帮他捡起了球。"],
          ],
        ),
        q(
          ["What does Omar's last line show about how he has changed?", "奥马尔最后一句台词表明他有了什么变化？"],
          ["He has gone from scared to confident", "他从害怕变得自信了"],
          [
            ["He never wants to juggle again", "他再也不想抛球了"],
            ["He is angry that he dropped a ball", "他因为掉了一个球而生气"],
            ["He thinks Ella should juggle next year", "他觉得明年应该让埃拉来抛球"],
          ],
          [
            "At the start Omar says he can't do it; at the end he wants to try six balls next year, so he has become confident.",
            "开头奥马尔说他做不到；结尾他想明年试着抛六个球，说明他变得自信了。",
          ],
          [
            ["Never again is the opposite of trying six.", "再也不抛了正好和想抛六个相反。"],
            ["Angry about the drop is wrong. He is grinning.", "为掉球生气不对。他在笑。"],
            ["Ella juggling next year is not what he says.", "洁拉明年表演不是他说的。"],
          ],
        ),
        q(
          ["How many balls did Omar juggle at Ella's house?", "奥马尔在艾拉家抛接了几个球？"],
          ["Five", "五个"],
          [
            ["Three", "三个"],
            ["Six", "六个"],
            ["Two", "两个"],
          ],
          ['Ella says, "You juggled five balls at my house yesterday."', "艾拉说：“你昨天在我家抛接了五个球。”"],
          [
            ["Three is not in the play.", "三个剧中没有。"],
            ["Six is what he wants to try next year.", "六个是他明年想试的。"],
            ["Two is not in the play.", "两个剧中没有。"],
          ],
        ),
      ],
      { names: ["Omar", "Ella", "Ella's", "Ms.", "Reyes", "Amazing"] },
    ),
    passage(
      "three-wishes-too-many",
      ["Three Wishes Too Many", "多余的三个愿望"],
      `CHARACTERS: NOAH, a boy; a GENIE in a cloud of smoke.

      SETTING: A bedroom. NOAH is polishing an old lamp he found at a yard sale.

      [A puff of smoke. The GENIE appears with a bang.]

      GENIE: [Booming] I am the Genie of the Lamp! You have three wishes. Choose wisely!

      NOAH: [Jumping back] Whoa! Okay, okay. I wish... I wish I never had to do homework again!

      GENIE: Granted! [Snaps fingers.]

      [A pile of books vanishes. NOAH cheers. Then a loud bell rings.]

      NOAH: What's that?

      GENIE: Your school. Without homework, you will now stay at school until nine every night to finish your work there.

      NOAH: [Horrified] No! Second wish: I wish I could stay home from school forever!

      GENIE: Granted! [Snaps fingers.] You may never leave this room again.

      NOAH: [Looking around in panic] Not even for pizza? For my friends? Okay, okay, last wish. Think, Noah, think. [He sits down slowly.] I wish everything was back the way it was before.

      GENIE: [Raising an eyebrow] Are you sure? You could have gold, or a castle.

      NOAH: I'm sure.

      GENIE: [Smiling for the first time] At last, a wise wish. Granted!

      [The books reappear. NOAH hugs them.]`,
      [drama, parts],
      [
        q(
          ["What goes wrong with Noah's first wish?", "诺亚的第一个愿望出了什么问题？"],
          ["He must stay at school until nine every night", "他每晚都必须在学校待到九点"],
          [
            ["He has to do twice as much homework", "他的作业变成了两倍"],
            ["He can never leave his room", "他永远不能离开房间"],
            ["The genie refuses to grant it", "精灵拒绝实现这个愿望"],
          ],
          [
            "The genie says that without homework, Noah will stay at school until nine every night to finish his work there.",
            "精灵说，没有了家庭作业，诺亚每晚都要在学校待到九点完成功课。",
          ],
          [
            ["Twice the homework is wrong. He has to finish it at school.", "作业加倍不对。他得在学校做完。"],
            ["Never leaving his room is the second wish.", "不能离开房间是第二个愿望。"],
            ["The genie refusing is wrong. He says granted.", "精灵拒绝不对。他说准了。"],
          ],
        ),
        q(
          ["What does the stage direction [Looking around in panic] tell the actor?", "舞台说明“惊慌地四处张望”告诉演员什么？"],
          ["To show that Noah is frightened by his wish", "要表现出诺亚被自己的愿望吓坏了"],
          [
            ["To leave the room and fetch some pizza", "要离开房间去拿比萨"],
            ["To snap his fingers like the genie", "要像精灵一样打响指"],
            ["To read from one of the books", "要读其中一本书"],
          ],
          [
            "A stage direction tells an actor what to do; looking around in panic shows that Noah is frightened to be stuck in his room.",
            "舞台说明告诉演员做什么；惊慌地四处张望表现出诺亚害怕被困在房间里。",
          ],
          [
            ["Fetching pizza is not in the stage direction.", "去拿比萨不在舞台说明里。"],
            ["Snapping fingers is what the genie does.", "打响指是精灵做的。"],
            ["Reading a book is not in the stage direction.", "读书不在舞台说明里。"],
          ],
        ),
        q(
          ["Why does the genie call the last wish wise?", "精灵为什么说最后一个愿望很明智？"],
          ["Noah learned that his old life was better than his wishes", "诺亚明白了原来的生活比他的愿望更好"],
          [
            ["Noah asked for gold and a castle", "诺亚要了黄金和城堡"],
            ["Noah wished for more wishes", "诺亚许愿要更多的愿望"],
            ["Noah wished the genie could go free", "诺亚希望精灵获得自由"],
          ],
          [
            "Noah turns down gold and a castle and asks for everything back as it was, showing he has learned from his first two wishes.",
            "诺亚拒绝了黄金和城堡，要求一切恢复原样，表明他从前两个愿望中吸取了教训。",
          ],
          [
            ["Gold and a castle are what the genie offered, and Noah said no.", "金子和城堡是精灵提出的，诺亚拒绝了。"],
            ["More wishes is not in the play.", "要更多愿望剧中没有。"],
            ["Freeing the genie is not in the play.", "让精灵自由剧中没有。"],
          ],
        ),
        q(
          ["Where did Noah find the old lamp?", "诺亚在哪里找到那盏旧灯？"],
          ["At a yard sale", "在一次旧货甩卖上"],
          [
            ["In a cave", "在一个山洞里"],
            ["At school", "在学校"],
            ["Under his bed", "在床底下"],
          ],
          ["The setting says Noah is polishing an old lamp he found at a yard sale.", "场景说明里说诺亚在擦一盏他在旧货甩卖上找到的旧灯。"],
          [
            ["A cave is not in the play.", "山洞剧中没有。"],
            ["School is not where he found it.", "学校不是他找到灯的地方。"],
            ["Under his bed is not in the play.", "床底下剧中没有。"],
          ],
        ),
      ],
      { names: ["Noah", "Genie", "Lamp"] },
    ),
    passage(
      "the-night-the-lights-went-out",
      ["The Night the Lights Went Out", "停电的那一夜"],
      `CHARACTERS: DAD; ZOE, a girl of nine; BEN, her older brother.

      SETTING: A living room on a stormy night. ZOE and BEN are staring at their tablets. DAD is reading.

      [Thunder crashes. The stage goes completely dark.]

      BEN: [Groaning] Oh no! My game was almost finished!

      ZOE: [Nervously] Dad? I can't see anything.

      DAD: Stay where you are. I'll find a flashlight. [A small beam of light appears.] There we go.

      BEN: How long will the power be out?

      DAD: Could be hours. [He sets the flashlight on the table, pointing up.] You know what we used to do when I was a boy and this happened?

      ZOE: What?

      DAD: [Holding his hand in front of the light] Shadow puppets. Look, a rabbit.

      [A rabbit shadow appears on the wall. ZOE giggles.]

      ZOE: Let me try! [She makes a shape.] It's a bird!

      BEN: [Reluctantly putting down his tablet] That's not a bird. This is a bird. [He makes a better one.]

      [They take turns. The shadows grow sillier. Everyone is laughing.]

      [Suddenly the lights come back on. Everyone blinks.]

      BEN: [Looking at his tablet, then at the wall] Dad, can we turn the lights off again?`,
      [theater, traits],
      [
        q(
          ["What causes the problem in the play?", "是什么造成了戏里的问题？"],
          ["A storm makes the power go out", "暴风雨导致停电"],
          [
            ["Ben breaks the family's flashlight", "本弄坏了家里的手电筒"],
            ["Dad turns off the lights to save energy", "爸爸为了省电关了灯"],
            ["Zoe's tablet runs out of power", "佐伊的平板电脑没电了"],
          ],
          [
            "The first stage direction says thunder crashes and the stage goes completely dark: the storm has cut the power.",
            "第一条舞台说明写着雷声轰鸣，舞台一片漆黑：暴风雨导致停电了。",
          ],
          [
            ["Ben breaking the flashlight is wrong. Dad finds one that works.", "本弄坏了手电筒不对。爸爸找到的手电是好的。"],
            ["Dad saving energy is wrong. Thunder made it dark.", "爸爸为了省电不对。是打雷让灯灭了。"],
            ["A tablet running out is wrong. The whole stage goes dark.", "平板没电不对。整个舞台都黑了。"],
          ],
        ),
        q(
          ["What does the word Reluctantly tell the actor playing Ben?", "“不情愿地”这个词告诉扮演本的演员什么？"],
          ["Ben does not really want to put down his tablet", "本其实并不想放下平板电脑"],
          [
            ["Ben is very happy to stop playing", "本很高兴不玩了"],
            ["Ben wants to make a rabbit shadow too", "本也想做兔子影子"],
            ["Ben is afraid of the dark", "本怕黑"],
          ],
          [
            "Reluctantly means not wanting to do something; Ben puts the tablet down but is not keen at first.",
            "“不情愿地”的意思是不想做某事；本放下了平板电脑，但一开始并不乐意。",
          ],
          [
            ["Very happy is the opposite of reluctantly.", "很高兴正好和不情愿相反。"],
            ["A rabbit shadow is Dad's, and Ben makes a bird.", "兔子影子是爸爸做的，本做的是鸟。"],
            ["Afraid of the dark is how Zoe feels, not Ben.", "怕黑的是佐伊，不是本。"],
          ],
        ),
        q(
          ["What does Ben's last line show?", "本的最后一句台词表现了什么？"],
          ["He enjoyed the shadow puppets more than his game", "他觉得手影游戏比电子游戏更好玩"],
          [
            ["He wants to sleep", "他想睡觉了"],
            ["He is still angry about his game", "他还在为游戏生气"],
            ["He is frightened that the storm will come back again", "他害怕暴风雨会再来"],
          ],
          [
            "Ben looks at his tablet and then the wall and asks to turn the lights off again, so he would rather keep playing shadow puppets.",
            "本看看平板，又看看墙，要求再关灯，说明他宁愿继续玩手影。",
          ],
          [
            ["Wanting to sleep is not in the play.", "想睡觉剧中没有。"],
            ["Still angry is wrong. He wants the lights off again for fun.", "还在生气不对。他想再关灯接着玩。"],
            ["Fear of the storm is not what his line shows.", "怕暴风雨不是他这句话表现的。"],
          ],
        ),
      ],
      { names: ["Dad", "Zoe", "Ben"] },
    ),
    passage(
      "the-dragons-dentist",
      ["The Dragon's Dentist", "龙的牙医"],
      `CHARACTERS: DR. LILY PARK, a dentist; FLAME, a young dragon; the MAYOR.

      SETTING: A dentist's office with an extra-large chair. A sign reads: "No Fire, Please."

      [The MAYOR rushes in.]

      MAYOR: Dr. Park! There's a dragon outside, and he says he has a toothache!

      DR. PARK: [Calmly putting on her gloves] Then send him in.

      [FLAME squeezes through the door, holding his jaw.]

      FLAME: [Moaning] Ohhh. It hurts. Every time I roar, smoke comes out of my ears.

      DR. PARK: Sit down and open wide. [She climbs a ladder to look inside his mouth.] I see. You have a large piece of knight's armor stuck between your teeth.

      FLAME: [Embarrassed] I didn't eat him! He just left his armor behind when he ran away.

      DR. PARK: Hold still. [She pulls with a giant pair of tongs. There is a loud clang.] Got it!

      FLAME: [Smiling, showing his teeth] It doesn't hurt! [He takes a deep breath.] I'm so happy I could...

      DR. PARK and MAYOR: [Together, pointing at the sign] No fire!

      FLAME: [Gulping] Sorry. [He breathes out a tiny puff of smoke instead.] How can I ever thank you?

      DR. PARK: Brush twice a day. And please stop chewing on knights.`,
      [drama, speaking],
      [
        q(
          ["What is causing Flame's toothache?", "是什么让火焰牙疼？"],
          ["A piece of armor stuck between his teeth", "一块卡在他牙缝里的盔甲"],
          [
            ["He ate too much candy", "他吃了太多糖"],
            ["His fire burned his tongue", "他的火烧伤了舌头"],
            ["A knight hit him with a sword", "一个骑士用剑打了他"],
          ],
          [
            "Dr. Park looks inside and finds a large piece of knight's armor stuck between Flame's teeth.",
            "帕克医生往里一看，发现一大块骑士盔甲卡在火焰的牙缝里。",
          ],
          [
            ["Too much candy is not in the play.", "糖吃多了剧中没有。"],
            ["A burned tongue is not in the play.", "舌头被火烧了剧中没有。"],
            ["A knight with a sword is wrong. The knight ran away and left his armor.", "骑士用剑打他不对。骑士跑掉了，留下了盔甲。"],
          ],
        ),
        q(
          ["Why do Dr. Park and the Mayor point at the sign?", "帕克医生和镇长为什么指着那块牌子？"],
          ["Flame is about to breathe fire in the office", "火焰马上要在诊所里喷火了"],
          [
            ["They want Flame to read the dentist's opening hours", "他们想让火焰看诊所的营业时间"],
            ["The sign tells patients where to sit", "牌子告诉病人坐在哪里"],
            ["Flame has forgotten to pay", "火焰忘了付钱"],
          ],
          [
            "Flame takes a deep breath and says he is so happy he could..., so they stop him because the sign reads No Fire, Please.",
            "火焰深吸一口气，说他高兴得都能……，所以他们阻止他，因为牌子上写着“请勿喷火”。",
          ],
          [
            ["Opening hours are not on the sign. It says no fire.", "营业时间不在牌子上。牌子写的是禁止喷火。"],
            ["Where to sit is not on the sign.", "坐在哪里不在牌子上。"],
            ["Paying is not in the play.", "付钱剧中没有。"],
          ],
        ),
        q(
          ["What does Dr. Park's calm reply to the Mayor show about her?", "帕克医生平静地回答镇长，表现了她什么？"],
          ["She is brave and not easily frightened", "她很勇敢，不容易害怕"],
          [
            ["She does not believe there is a dragon", "她不相信有龙"],
            ["She is too busy to see the dragon", "她太忙了，没空看龙"],
            ["She wants the Mayor to fight the dragon", "她想让镇长和龙搏斗"],
          ],
          [
            "While the Mayor rushes in alarmed, Dr. Park calmly puts on her gloves and says to send the dragon in, which shows she is brave.",
            "镇长慌慌张张地冲进来，帕克医生却平静地戴上手套，让龙进来，这表现出她很勇敢。",
          ],
          [
            ["Not believing it is wrong. She says to send him in.", "不相信不对。她说让他进来。"],
            ["Being too busy is wrong. She sees him at once.", "太忙不对。她马上就给他看了。"],
            ["Asking the Mayor to fight is not in the play.", "让镇长去打龙剧中没有。"],
          ],
        ),
      ],
      { names: ["Dr.", "Lily", "Park", "Flame", "Mayor"] },
    ),
  ],
};

/** livesUnit is the reading unit of lives that made a difference. */
export const livesUnit: ReadingUnitDef = {
  id: "lives-that-made-a-difference",
  title: t("Lives That Made a Difference", "改变世界的人生"),
  passages: [
    passage(
      "mary-anning-fossil-hunter",
      ["Mary Anning, Fossil Hunter", "化石猎人玛丽·安宁"],
      `Mary Anning was born in 1799 in Lyme Regis, a small town on the south coast of England. The cliffs there are full of fossils, the stony remains of plants and animals that lived millions of years ago. Mary's father taught her to hunt for them and sell them to visitors. When he died, the family was very poor, and the fossils Mary found helped to feed them.

      When Mary was about twelve, she and her brother found the skull of a strange creature in the cliffs. Over the next months, Mary dug out the rest of the skeleton. It was an ichthyosaur, a sea reptile that looked a little like a dolphin. Later she found the first complete skeleton of a plesiosaur, a reptile with a long neck and flippers.

      Hunting fossils was dangerous work. The best time to search was after storms, when rocks fell from the cliffs, and Mary was nearly killed by a landslide.

      In her time, women were not allowed to join the scientific societies of London, and men often took credit for her discoveries. But scientists came from far away to learn from her. Today she is remembered as one of the great fossil hunters in history.`,
      [research, lives],
      [
        q(
          ["Why did Mary's family need the fossils she found?", "玛丽家为什么需要她找到的化石？"],
          ["Selling them helped to feed the poor family", "卖化石帮助这个穷困的家庭糊口"],
          [
            ["Scientists in London paid her to join their society", "伦敦的科学家付钱请她加入他们的学会"],
            ["Her father wanted them for his museum", "她父亲想把它们放进博物馆"],
            ["The town needed them to build walls", "小镇需要它们来砌墙"],
          ],
          [
            "The first paragraph says that when Mary's father died, the family was very poor, and the fossils she found helped to feed them.",
            "第一段说，玛丽的父亲去世后，家里很穷，她找到的化石帮助一家人糊口。",
          ],
          [
            ["Joining a London society is wrong. Women were not allowed.", "加入伦敦的学会不对。女性是不被允许的。"],
            ["Her father's museum is not in the passage.", "她父亲的博物馆文中没有。"],
            ["Building walls is not in the passage.", "砌墙文中没有。"],
          ],
        ),
        q(
          ["Why was the best time to search after storms?", "为什么暴风雨后是寻找化石的最好时机？"],
          ["Rocks fell from the cliffs and showed new fossils", "岩石从悬崖上掉下来，露出新的化石"],
          [
            ["Visitors stayed at home during storms", "暴风雨时游客都待在家里"],
            ["The sea carried new fossils in from far away each night", "大海每晚从远方带来新的化石"],
            ["The cliffs were safer when wet", "悬崖湿了更安全"],
          ],
          [
            "The third paragraph says the best time was after storms, when rocks fell from the cliffs, uncovering fossils.",
            "第三段说，最好的时机是暴风雨后，那时岩石从悬崖上掉落，露出化石。",
          ],
          [
            ["Visitors staying home is not the reason given.", "游客待在家里不是文中给的原因。"],
            ["The sea bringing fossils is not in the passage.", "大海带来化石文中没有。"],
            ["Safer wet cliffs is wrong. She was nearly killed by a landslide.", "湿悬崖更安全不对。她差点死于山崩。"],
          ],
        ),
        q(
          ["How can you tell that this passage is a biography?", "你怎样看出这篇文章是传记？"],
          ["It tells Mary's life in the third person", "它用第三人称讲述玛丽的一生"],
          [
            ["Mary tells her own story using I and me", "玛丽用“我”讲述自己的故事"],
            ["It is a made-up story about a fossil", "它是一个关于化石的虚构故事"],
            ["It gives instructions for hunting fossils", "它介绍怎样寻找化石"],
          ],
          [
            "The passage uses she and her for Mary, so someone else is telling her life: a biography.",
            "文章用“她”来称呼玛丽，说明是别人在讲述她的一生，所以是传记。",
          ],
          [
            ["Using I and me would make it an autobiography.", "用“我”讲就成了自传。"],
            ["Made-up is wrong. Mary Anning really lived.", "虚构的不对。玛丽·安宁是真实的人。"],
            ["Instructions are not what the passage gives.", "文章没有给出操作说明。"],
          ],
        ),
        q(
          ["What did Mary find when she was about twelve?", "玛丽大约十二岁时发现了什么？"],
          ["The skull of an ichthyosaur", "鱼龙的头骨"],
          [
            ["A plesiosaur's flipper", "蛇颈龙的鳍"],
            ["A dinosaur egg", "一枚恐龙蛋"],
            ["A gold coin", "一枚金币"],
          ],
          [
            "She and her brother found a skull, and the skeleton turned out to be an ichthyosaur.",
            "她和弟弟发现了一个头骨，整副骨架原来是一条鱼龙。",
          ],
          [
            ["A plesiosaur came later, and it was a whole skeleton.", "蛇颈龙是后来发现的，而且是完整的骨架。"],
            ["A dinosaur egg is not in the passage.", "恐龙蛋文中没有。"],
            ["A gold coin is not in the passage.", "金币文中没有。"],
          ],
        ),
      ],
      { names: ["Mary", "Mary's", "Anning", "Lyme", "Regis", "England", "London"], glossed: ["ichthyosaur", "plesiosaur"] },
    ),
    passage(
      "zhang-heng-and-the-earthquake-detector",
      ["Zhang Heng and the Earthquake Detector", "张衡和地动仪"],
      `Zhang Heng lived in China nearly two thousand years ago, during the Han dynasty. He was a scholar, a poet, a painter and one of the greatest scientists of his time. He studied the stars, made maps of the sky and built a globe that turned by water power to show the movement of the heavens.

      His most famous invention helped with a terrible problem. Earthquakes often struck China, and the emperor wanted to know quickly where help was needed. But in those days, news traveled only as fast as a horse.

      In the year 132, Zhang Heng built a large bronze vessel that looked like a jar. Around the outside were eight dragons, each facing a different direction, and each holding a bronze ball in its mouth. Below each dragon sat a toad with its mouth open. When the ground shook, a ball dropped from one dragon into the toad below, showing the direction of the earthquake.

      One day, a ball fell, but no one in the capital had felt anything. People laughed at the machine. A few days later, a messenger arrived with news of an earthquake far to the west. The detector had been right.`,
      [research, chains],
      [
        q(
          ["Why did the emperor need an earthquake detector?", "皇帝为什么需要地动仪？"],
          ["To know quickly where help was needed", "为了尽快知道哪里需要救助"],
          [
            ["To stop earthquakes from happening", "为了阻止地震发生"],
            ["To make maps of the stars in the night sky", "为了绘制夜空中的星图"],
            ["To decorate his palace", "为了装饰他的宫殿"],
          ],
          [
            "The second paragraph says the emperor wanted to know quickly where help was needed, but news traveled only as fast as a horse.",
            "第二段说，皇帝想尽快知道哪里需要救助，但当时消息只能以马的速度传递。",
          ],
          [
            ["Stopping earthquakes is wrong. It only showed their direction.", "阻止地震不对。它只显示方向。"],
            ["Star maps were another of his works.", "星图是他的另一项成就。"],
            ["Decoration is not the reason given.", "装饰不是文中给的原因。"],
          ],
        ),
        q(
          ["How did the detector show the direction of an earthquake?", "地动仪怎样显示地震的方向？"],
          ["A ball dropped from a dragon into a toad", "一个铜球从龙口中落进蟾蜍嘴里"],
          [
            ["A bell rang in the capital", "京城里的一口钟响了"],
            ["A messenger rode toward it on horseback at once", "一名信使立刻骑马朝那个方向奔去"],
            ["The water inside it turned the globe", "里面的水转动了浑天仪"],
          ],
          [
            "The third paragraph says that when the ground shook, a ball dropped from one dragon into the toad below, showing the direction.",
            "第三段说，地面震动时，一个铜球会从某条龙口中落进下面蟾蜍的嘴里，指示方向。",
          ],
          [
            ["A bell is not in the passage.", "铃文中没有。"],
            ["A messenger came days later with the news.", "信使是几天后才带来消息的。"],
            ["Water power turned his globe, not the detector.", "水力转动的是浑天仪，不是地动仪。"],
          ],
        ),
        q(
          ["Why did people stop laughing at the machine?", "人们为什么不再嘲笑这台机器？"],
          ["News came of an earthquake in the direction it showed", "传来了它所指方向发生地震的消息"],
          [
            ["The emperor ordered them to stop", "皇帝命令他们停下"],
            ["They felt the ground shake hard in the capital city", "他们在京城感到地面剧烈震动"],
            ["Zhang Heng built a second, bigger machine", "张衡造了第二台更大的机器"],
          ],
          [
            "The last paragraph says a messenger arrived with news of an earthquake far to the west, so the detector had been right.",
            "最后一段说，一名信使带来了西边远处发生地震的消息，说明地动仪是对的。",
          ],
          [
            ["The emperor ordering it is not in the passage.", "皇帝下令文中没有。"],
            ["Feeling it in the capital is wrong. No one there felt anything.", "在京城感到震动不对。那里没人感觉到。"],
            ["A second machine is not in the passage.", "第二台机器文中没有。"],
          ],
        ),
        q(
          ["How many dragons were on Zhang Heng's detector?", "张衡的地动仪上有几条龙？"],
          ["Eight", "八条"],
          [
            ["Four", "四条"],
            ["Two", "两条"],
            ["Twelve", "十二条"],
          ],
          ["Around the outside were eight dragons, each facing a different direction.", "外面围着八条龙，各朝一个方向。"],
          [
            ["Four is half the number.", "四只是一半。"],
            ["Two is far too few.", "两只太少了。"],
            ["Twelve is not in the passage.", "十二只文中没有。"],
          ],
        ),
      ],
      { names: ["Zhang", "Heng", "China", "Han"] },
    ),
    passage(
      "louis-brailles-dots",
      ["Louis Braille's Dots", "路易·布莱叶的点字"],
      `Louis Braille was born in a village in France in 1809. When he was three, he was playing in his father's workshop and hurt his eye with a sharp tool. The eye became infected, the infection spread to his other eye, and by the age of five he was completely blind.

      Louis was clever and eager to learn. At ten, he won a place at a school for blind children in Paris. The school had a few books printed with large raised letters that students felt with their fingers. But the books were huge and heavy, and reading them was very slow.

      Then a soldier visited the school. He had invented a way for soldiers to read messages at night, using raised dots instead of letters. His system was hard to learn, but it gave Louis an idea.

      Louis worked on it for years, often late into the night. By the time he was fifteen, he had made a much simpler system. Each letter was a pattern of up to six dots that could be felt with one fingertip.

      At first, many teachers did not want to use it. Only after Louis died was it accepted in France. Today, braille is used by blind readers all over the world.`,
      [achievement, lives],
      [
        q(
          ["Why was reading slow at Louis's school?", "为什么在路易的学校里读书很慢？"],
          ["The books had large raised letters and were huge and heavy", "书上是大大的凸起字母，又大又重"],
          [
            ["The teachers did not allow the students to read books at night", "老师不准学生晚上读书"],
            ["There were no books at all", "根本没有书"],
            ["The books were written in dots", "书是用点写的"],
          ],
          [
            "The second paragraph says the books were printed with large raised letters and were huge and heavy, so reading was slow.",
            "第二段说，书上印着大大的凸起字母，又大又重，所以读得很慢。",
          ],
          [
            ["Not allowed at night is not in the passage.", "晚上不许读书文中没有。"],
            ["No books at all is wrong. The school had a few.", "一本书都没有不对。学校有几本。"],
            ["Dots are what Louis invented later.", "点字是路易后来发明的。"],
          ],
        ),
        q(
          ["Where did Louis get the idea for his system?", "路易的系统的灵感来自哪里？"],
          ["From a soldier's way of reading messages at night", "来自一名士兵在夜里读信息的方法"],
          [
            ["From the tools in his father's workshop", "来自他父亲工作间里的工具"],
            ["From the raised letters in his school's heavy books", "来自学校厚重书本上的凸起字母"],
            ["From a dream he had", "来自他做的一个梦"],
          ],
          [
            "The third paragraph says a soldier had invented a way to read messages at night with raised dots, and it gave Louis an idea.",
            "第三段说，一名士兵发明了在夜里用凸点读信息的方法，这给了路易灵感。",
          ],
          [
            ["Tools in the workshop hurt his eye. They gave no idea.", "作坊的工具伤了他的眼睛，没给他灵感。"],
            ["The raised letters were the problem he wanted to solve.", "凸起的字母正是他想解决的问题。"],
            ["A dream is not in the passage.", "梦文中没有。"],
          ],
        ),
        q(
          ["Which proverb best fits Louis's life?", "哪句谚语最适合路易的一生？"],
          ["Where there's a will, there's a way", "有志者事竟成"],
          [
            ["Look before you leap", "三思而后行"],
            ["Too many cooks spoil the broth", "人多反误事"],
            ["The early bird catches the worm", "早起的鸟儿有虫吃"],
          ],
          [
            "Louis overcame blindness and years of hard work to invent his system, so a proverb about will finding a way fits best.",
            "路易克服了失明，经过多年努力发明了他的系统，所以“有志者事竟成”最合适。",
          ],
          [
            ["Look before you leap warns against rushing. Louis was not rash.", "三思而后行是劝人别冒失。路易并不冒失。"],
            ["Too many cooks is about too many helpers.", "人多手杂说的是帮手太多。"],
            ["The early bird is about getting up early.", "早起的鸟儿有虫吃说的是早起。"],
          ],
        ),
        q(
          ["How many dots made up each letter in Louis's system?", "路易的系统中每个字母最多由几个点组成？"],
          ["Up to six", "最多六个"],
          [
            ["Up to twelve", "最多十二个"],
            ["Exactly two", "正好两个"],
            ["Up to twenty-six", "最多二十六个"],
          ],
          [
            "Each letter was a pattern of up to six dots that could be felt with one fingertip.",
            "每个字母是最多六个点组成的图案，用一个指尖就能摸出来。",
          ],
          [
            ["Twelve is double the number.", "十二个多了一倍。"],
            ["Exactly two is too few.", "正好两个太少了。"],
            ["Twenty-six is the number of letters, not dots.", "二十六是字母的数量，不是点数。"],
          ],
        ),
      ],
      { names: ["Louis", "Louis's", "Braille", "France", "Paris"] },
    ),
    passage(
      "marie-curie-in-her-laboratory",
      ["Marie Curie in Her Laboratory", "实验室里的居里夫人"],
      `Marie Curie was born Maria Sklodowska in Warsaw, Poland, in 1867. Girls in Poland were not allowed to go to university then, so Maria studied in secret. She saved money for years and, at twenty-four, moved to Paris to study science.

      In Paris she met Pierre Curie, a scientist, and they married. Together they studied a strange kind of rock that gave off invisible rays. Marie named this property radioactivity.

      Their laboratory was a cold, leaky shed. For years they crushed, boiled and stirred tons of rock in huge pots, working to separate tiny amounts of new substances. In 1898 they discovered two new elements. Marie named one polonium, after her home country, and the other radium, because it glowed in the dark.

      In 1903, Marie became the first woman to win a Nobel Prize. In 1911, she won a second one, in a different science. No one else has ever done that.

      During the First World War, Marie built cars with X-ray machines inside and drove them to the battlefields, so doctors could find bullets in wounded soldiers.

      Marie did not know how harmful radioactivity was, and years of work with it damaged her health. Her notebooks are still radioactive today.`,
      [research, achievement],
      [
        q(
          ["Why did Maria study in secret in Poland?", "玛丽亚为什么在波兰秘密学习？"],
          ["Girls were not allowed to go to university", "女孩不被允许上大学"],
          [
            ["She did not want Pierre to know", "她不想让皮埃尔知道"],
            ["Her laboratory was a cold, leaky shed", "她的实验室是一个又冷又漏的棚子"],
            ["Science books were forbidden in Warsaw at the time", "当时华沙禁止科学书籍"],
          ],
          [
            "The first paragraph says girls in Poland were not allowed to go to university then, so Maria studied in secret.",
            "第一段说，当时波兰的女孩不能上大学，所以玛丽亚秘密学习。",
          ],
          [
            ["Hiding from Pierre is wrong. She met him later, in Paris.", "瞒着皮埃尔不对。她是后来在巴黎认识他的。"],
            ["The shed was in Paris, later.", "那个棚子是后来在巴黎的。"],
            ["Forbidden books are not in the passage.", "书被禁止文中没有。"],
          ],
        ),
        q(
          ["Why did Marie name one element polonium?", "玛丽为什么把一种元素命名为钋（polonium）？"],
          ["After her home country, Poland", "以她的祖国波兰命名"],
          [
            ["Because it glowed in the dark", "因为它在黑暗中发光"],
            ["After her husband, Pierre", "以她的丈夫皮埃尔命名"],
            ["Because it was found in a shed in Paris", "因为它是在巴黎的一个棚子里发现的"],
          ],
          [
            "The third paragraph says she named polonium after her home country; radium was named because it glowed.",
            "第三段说，她以祖国命名了钋；镭（radium）是因为会发光而得名。",
          ],
          [
            ["Glowing in the dark is why radium got its name.", "在黑暗中发光是镭名字的来历。"],
            ["Her husband is not who it is named after.", "不是以她丈夫命名的。"],
            ["The shed is not the reason for the name.", "棚子不是名字的来历。"],
          ],
        ),
        q(
          ["What did Marie's X-ray cars do during the war?", "战争期间玛丽的X光车做了什么？"],
          ["They helped doctors find bullets in wounded soldiers", "它们帮助医生找到伤员体内的子弹"],
          [
            ["They carried radium to the battlefields to light them at night", "它们把镭运到战场，夜里用来照明"],
            ["They won a Nobel Prize", "它们获得了诺贝尔奖"],
            ["They crushed rock for her research", "它们为她的研究粉碎岩石"],
          ],
          [
            "The fifth paragraph says she drove cars with X-ray machines to the battlefields so doctors could find bullets in wounded soldiers.",
            "第五段说，她驾驶装有X光机的车到战场，让医生能找到伤员体内的子弹。",
          ],
          [
            ["Lighting battlefields with radium is not in the passage.", "用镭照亮战场文中没有。"],
            ["Winning a Nobel Prize is what Marie did, not the cars.", "获得诺贝尔奖的是居里夫人，不是车。"],
            ["Crushing rock was her earlier lab work.", "碾碎岩石是她早先在实验室的工作。"],
          ],
        ),
        q(
          ["What was the Curies' laboratory like?", "居里夫妇的实验室是什么样的？"],
          ["A cold, leaky shed", "一个又冷又漏的棚子"],
          [
            ["A big new building", "一座崭新的大楼"],
            ["A room in a palace", "宫殿里的一个房间"],
            ["A warm kitchen", "一间温暖的厨房"],
          ],
          ['The text says, "Their laboratory was a cold, leaky shed."', "短文说：“他们的实验室是一个又冷又漏的棚子。”"],
          [
            ["A big new building is wrong. It was a leaky shed.", "崭新的大楼不对。那是个漏雨的棚子。"],
            ["A palace room is not in the passage.", "宫殿里的房间文中没有。"],
            ["A warm kitchen is wrong. It was cold.", "温暖的厨房不对。那里很冷。"],
          ],
        ),
      ],
      {
        names: ["Marie", "Marie's", "Curie", "Maria", "Sklodowska", "Warsaw", "Poland", "Paris", "Pierre", "Nobel", "First World War"],
        glossed: ["polonium", "radium", "radioactivity", "radioactive"],
      },
    ),
    passage(
      "wangari-maathai-plants-trees",
      ["Wangari Maathai Plants Trees", "旺加里·马塔伊种树"],
      `Wangari Maathai grew up in the hills of Kenya in the 1940s. As a girl, she drank clean water from a stream near her home and watched tadpoles swim among the stones. The hills were green with trees.

      Wangari was an excellent student. She won a place at a university in the United States and later became the first woman in East Africa to earn the highest degree a university gives.

      When she returned home, she was shocked. Many forests had been cut down to make room for farms. Without the roots of trees to hold it, the soil washed away. Streams dried up. Women had to walk for hours to find firewood and clean water.

      Wangari had a simple idea: plant trees. In 1977 she started the Green Belt Movement. She paid women a small amount for each young tree they grew and planted. The women gained money and skills, and the land began to heal. Over the years, they planted tens of millions of trees across Kenya.

      Not everyone liked her work. When she protested to save a park in the capital, she was arrested and beaten. But she did not give up.

      In 2004, Wangari became the first African woman to win the Nobel Peace Prize.`,
      [helping, chains],
      [
        q(
          ["Why did the streams dry up?", "小溪为什么干涸了？"],
          ["The forests were cut down and the soil washed away", "森林被砍光，水土流失"],
          [
            ["The women used too much water from them for their farms", "妇女们为了种地用了太多溪水"],
            ["It stopped raining in Kenya", "肯尼亚不再下雨"],
            ["The tadpoles drank them dry", "蝌蚪把溪水喝干了"],
          ],
          [
            "The third paragraph gives the chain: forests were cut down, the soil washed away without roots, and streams dried up.",
            "第三段给出了因果链：森林被砍伐，没有了树根，水土流失，小溪就干涸了。",
          ],
          [
            ["Women using too much water is not the reason given.", "女人用水太多不是文中给的原因。"],
            ["No more rain is not the reason given.", "不再下雨不是文中给的原因。"],
            ["Tadpoles drinking streams is not possible or in the passage.", "蝌蚪把溪水喝干既不可能也不在文中。"],
          ],
        ),
        q(
          ["How did the Green Belt Movement help women?", "绿带运动怎样帮助了妇女？"],
          ["They were paid for each tree and gained skills", "她们每种一棵树都能得到报酬，还学到了技能"],
          [
            ["They were given land of their own in the capital city", "她们在首都分到了自己的土地"],
            ["They no longer had to work", "她们不用再干活了"],
            ["They studied in the United States", "她们去美国读书"],
          ],
          [
            "The fourth paragraph says Wangari paid women for each young tree, and they gained money and skills.",
            "第四段说，旺加里为每棵树苗向妇女支付报酬，她们得到了钱和技能。",
          ],
          [
            ["Land in the capital is not in the passage.", "首都的土地文中没有。"],
            ["No longer working is wrong. They worked growing trees.", "不用再工作不对。她们靠种树工作。"],
            ["Studying in the United States is what Wangari did.", "在美国读书是旺加里自己做的事。"],
          ],
        ),
        q(
          ["Which sentence shows that Wangari faced a struggle?", "哪句话表明旺加里经历了艰难斗争？"],
          ["She was arrested and beaten when she protested", "她抗议时被逮捕并遭到殴打"],
          [
            ["She was an excellent student", "她是一个优秀的学生"],
            ["She grew up in the hills of Kenya", "她在肯尼亚的山区长大"],
            ["She drank clean water from a stream", "她喝溪里的干净水"],
          ],
          [
            "The fifth paragraph says she was arrested and beaten when she protested to save a park, but she did not give up.",
            "第五段说，她为保护一座公园而抗议时被捕并遭到殴打，但她没有放弃。",
          ],
          [
            ["Being an excellent student shows success, not struggle.", "成绩优异说明成功，不是困难。"],
            ["Growing up in the hills is about her childhood.", "在山里长大说的是她的童年。"],
            ["Clean water is about her childhood too.", "干净的水也是说她的童年。"],
          ],
        ),
        q(
          ["When did Wangari start the Green Belt Movement?", "旺加里什么时候发起了绿带运动？"],
          ["In 1977", "1977年"],
          [
            ["In 2004", "2004年"],
            ["In the 1940s", "20世纪40年代"],
            ["In 1969", "1969年"],
          ],
          ["In 1977 she started the Green Belt Movement.", "她在1977年发起了绿带运动。"],
          [
            ["2004 is when she won the Nobel Peace Prize.", "2004年是她获得诺贝尔和平奖的时候。"],
            ["The 1940s is when she grew up.", "20世纪40年代是她成长的年代。"],
            ["1969 is from Tu Youyou's story, not Wangari's.", "1969年是屠呦呦故事里的，不是旺加里的。"],
          ],
        ),
      ],
      { names: ["Wangari", "Maathai", "Kenya", "United States", "East Africa", "Green Belt Movement", "African", "Nobel", "Peace Prize"] },
    ),
    passage(
      "tu-youyou-and-the-malaria-cure",
      ["Tu Youyou and the Malaria Cure", "屠呦呦与疟疾良药"],
      `Malaria is a disease spread by mosquitoes. It causes terrible fevers, and for thousands of years it has killed millions of people, many of them children. In the 1960s, the medicines used against it had stopped working well.

      In 1969, a Chinese scientist named Tu Youyou was asked to lead a team to find a new cure. Instead of starting only in the laboratory, she began in the library. She and her team read old Chinese medical books and collected more than two thousand recipes for treating fevers.

      One plant appeared again and again: sweet wormwood. But when the team tested it, the results were disappointing. Tu went back to the books. In a text written more than sixteen hundred years ago, she found a clue. It said to soak the plant in cold water. Tu realized that heat might be destroying the medicine, so she tried a way of drawing it out at a low temperature. This time, it worked.

      Before the medicine was tested on patients, Tu and two of her team tested it on themselves to make sure it was safe.

      The new drug has saved millions of lives. In 2015, Tu Youyou became the first Chinese woman to win a Nobel Prize in science.`,
      [research, chains, academic2],
      [
        q(
          ["Where did Tu Youyou begin her search for a cure?", "屠呦呦从哪里开始寻找药物？"],
          ["In old Chinese medical books", "在古代中医书籍中"],
          [
            ["In a hospital full of patients", "在满是病人的医院里"],
            ["In a forest full of mosquitoes", "在满是蚊子的森林里"],
            ["In a garden of sweet wormwood", "在种满青蒿的园子里"],
          ],
          [
            "The second paragraph says she began in the library, reading old Chinese medical books.",
            "第二段说，她从图书馆开始，阅读古代中医书籍。",
          ],
          [
            ["A hospital is not where she began.", "医院不是她开始的地方。"],
            ["A forest of mosquitoes is not in the passage.", "满是蚊子的森林文中没有。"],
            ["A garden of wormwood is not where she began.", "青蒿园不是她开始的地方。"],
          ],
        ),
        q(
          ["Why did the first tests of sweet wormwood fail?", "青蒿的最初试验为什么失败了？"],
          ["Heat might have been destroying the medicine", "高温可能破坏了药效"],
          [
            ["The plant had no medicine in it", "这种植物里没有药物成分"],
            ["The mosquitoes had eaten the plants", "蚊子吃掉了植物"],
            ["The old recipe books had been written down incorrectly", "古代药方书写错了"],
          ],
          [
            "The third paragraph says Tu realized that heat might be destroying the medicine, so she drew it out at a low temperature.",
            "第三段说，屠呦呦意识到高温可能破坏了药效，于是改用低温提取。",
          ],
          [
            ["No medicine in the plant is wrong. It worked at a low temperature.", "植物里没有药效不对。低温提取就有效了。"],
            ["Mosquitoes eating plants is not in the passage.", "蚊子吃植物文中没有。"],
            ["Incorrect books is wrong. The old book held the clue.", "书写错了不对。古书里正好有线索。"],
          ],
        ),
        q(
          ["Why did Tu test the medicine on herself?", "屠呦呦为什么在自己身上试药？"],
          ["To make sure it was safe for patients", "为了确保它对病人是安全的"],
          [
            ["Because she had malaria herself", "因为她自己得了疟疾"],
            ["To win a Nobel Prize", "为了获得诺贝尔奖"],
            ["Because no patients wanted it", "因为没有病人想用它"],
          ],
          [
            "The fourth paragraph says she and two of her team tested it on themselves to make sure it was safe.",
            "第四段说，她和两名组员在自己身上试药，以确保它是安全的。",
          ],
          [
            ["Having malaria herself is not in the passage.", "她自己得了疟疾文中没有。"],
            ["Winning a prize is not why she did it.", "获奖不是她这样做的原因。"],
            ["Patients not wanting it is not in the passage.", "病人不想用文中没有。"],
          ],
        ),
        q(
          ["How is malaria spread?", "疟疾是怎样传播的？"],
          ["By mosquitoes", "通过蚊子"],
          [
            ["By dirty water", "通过脏水"],
            ["By cold weather", "通过寒冷天气"],
            ["By sweet wormwood", "通过青蒿"],
          ],
          ['The text says, "Malaria is a disease spread by mosquitoes."', "短文说：“疟疾是一种由蚊子传播的疾病。”"],
          [
            ["Dirty water is not how it spreads.", "脏水不是传播途径。"],
            ["Cold weather is not in the passage.", "寒冷天气文中没有。"],
            ["Sweet wormwood is the cure, not the cause.", "青蒿是药，不是病因。"],
          ],
        ),
      ],
      { names: ["Tu", "Youyou", "Chinese", "Nobel"], glossed: ["malaria", "wormwood"] },
    ),
    passage(
      "ibn-al-haytham-and-light",
      ["Ibn al-Haytham and Light", "伊本·海赛姆与光"],
      `About a thousand years ago, a scholar named Ibn al-Haytham lived in Cairo, in Egypt. He wondered about something most people never stop to think about: how do we see?

      Many thinkers before him believed that our eyes send out invisible rays that touch the things we look at, like fingers. Ibn al-Haytham was not so sure. If that were true, he asked, why can't we see in the dark? And why does looking at the bright sun hurt our eyes?

      He decided that light must travel the other way. Light from the sun or a lamp strikes an object and bounces off it, and some of that light travels in straight lines into our eyes.

      To test his ideas, he did experiments. He sat in a dark room with a tiny hole in one wall. Light from the bright world outside came through the hole and made a picture of the outside scene on the opposite wall, upside down. This showed that light travels in straight lines.

      Most important of all, Ibn al-Haytham believed that ideas must be tested, not simply believed. He wrote that a scholar should question everything he reads. This way of working is at the heart of science today.`,
      [research, lives],
      [
        q(
          ["What did many thinkers before Ibn al-Haytham believe about seeing?", "在伊本·海赛姆之前，许多思想家对“看见”有什么看法？"],
          ["The eyes send out rays that touch things", "眼睛发出射线去触碰物体"],
          [
            ["Light bounces off objects into the eyes", "光从物体反弹进入眼睛"],
            ["People can see well in the dark", "人在黑暗中也能看得很清楚"],
            ["Light travels in straight lines through a tiny hole", "光沿直线穿过小孔"],
          ],
          [
            "The second paragraph says many thinkers believed our eyes send out invisible rays that touch the things we look at.",
            "第二段说，许多思想家认为眼睛会发出看不见的射线，去触碰我们看的东西。",
          ],
          [
            ["Light bouncing into the eyes is Ibn al-Haytham's own idea.", "光反射进眼睛是伊本·海赛姆自己的观点。"],
            ["Seeing in the dark is what he asked about, since we cannot.", "在黑暗中看见正是他质疑的，因为我们看不见。"],
            ["The tiny hole is his experiment, not the old belief.", "小孔是他的实验，不是旧观点。"],
          ],
        ),
        q(
          ["What did the experiment in the dark room show?", "暗室里的实验说明了什么？"],
          ["Light travels in straight lines", "光沿直线传播"],
          [
            ["The eyes send out rays", "眼睛会发出射线"],
            ["The sun hurts our eyes", "太阳会伤害我们的眼睛"],
            ["Pictures are always upside down", "图像总是倒过来的"],
          ],
          [
            "The fourth paragraph says the picture made through the tiny hole showed that light travels in straight lines.",
            "第四段说，通过小孔形成的图像说明光沿直线传播。",
          ],
          [
            ["Eyes sending rays is the old idea he doubted.", "眼睛发射光线是他怀疑的旧观点。"],
            ["The sun hurting eyes is one of his questions, not the result.", "太阳刺眼是他提的问题之一，不是实验结果。"],
            ["Always upside down is too broad. Only the picture through the hole was.", "总是倒着的太绝对。只有小孔成的像是倒的。"],
          ],
        ),
        q(
          ["Why is Ibn al-Haytham important to science today?", "伊本·海赛姆为什么对今天的科学很重要？"],
          ["He believed ideas must be tested, not simply believed", "他认为观点必须经过检验，而不是简单相信"],
          [
            ["He built the first lamp", "他造出了第一盏灯"],
            ["He lived in Cairo", "他住在开罗"],
            ["He proved that people cannot see anything at all at night", "他证明了人在夜里什么也看不见"],
          ],
          [
            "The last paragraph says he believed ideas must be tested, a way of working at the heart of science today.",
            "最后一段说，他认为观点必须经过检验，这种工作方式是今天科学的核心。",
          ],
          [
            ["Building the first lamp is not in the passage.", "造了第一盏灯文中没有。"],
            ["Living in Cairo is where he lived, not why he matters.", "住在开罗是他的住处，不是他重要的原因。"],
            ["Not seeing at night is not what he proved.", "晚上什么都看不见不是他证明的。"],
          ],
        ),
      ],
      { names: ["Ibn", "al-Haytham", "Cairo", "Egypt"] },
    ),
    passage(
      "katherine-johnson-counts-the-way-to-the-moon",
      ["Katherine Johnson Counts the Way to the Moon", "凯瑟琳·约翰逊计算登月之路"],
      `Katherine Johnson was born in West Virginia in 1918. She loved to count everything: the steps to the church, the dishes she washed, the stars in the sky. She was so quick at math that she started high school at ten and finished college at eighteen.

      At that time, Black Americans faced unfair laws that kept them apart from white Americans, and many jobs were closed to them. But in 1953, Katherine got a job at the place that would later become NASA, the American space agency. She worked as a "computer." Before machines did the job, computers were people who did difficult math by hand.

      Katherine worked out the paths that spacecraft would follow. In 1961, she calculated the flight of the first American in space. The next year, NASA used electronic computers to plan John Glenn's flight around the Earth. But Glenn did not fully trust the machines. He asked for Katherine to check the numbers by hand. "If she says they're good," he said, "then I'm ready to go."

      Katherine also helped to plan the flight of Apollo 11, which landed the first people on the Moon in 1969. She lived to the age of 101.`,
      [achievement, lives],
      [
        q(
          ["What were computers before machines did the job?", "在机器出现之前，“计算员”是什么？"],
          ["People who did difficult math by hand", "手工进行复杂计算的人"],
          [
            ["Machines that counted the stars at night", "夜里数星星的机器"],
            ["Spacecraft that flew around the Earth", "绕地球飞行的航天器"],
            ["Books full of numbers", "满是数字的书"],
          ],
          [
            "The second paragraph says that before machines did the job, computers were people who did difficult math by hand.",
            "第二段说，在机器出现之前，计算员是手工进行复杂计算的人。",
          ],
          [
            ["Machines counting stars is wrong. Katherine counted stars as a child.", "数星星的机器不对。数星星的是童年的凯瑟琳。"],
            ["Spacecraft are what computers planned paths for.", "宇宙飞船是计算员规划路线的对象。"],
            ["Books of numbers are not what the word meant.", "数字书不是这个词的意思。"],
          ],
        ),
        q(
          ["Why did John Glenn ask for Katherine to check the numbers?", "约翰·格伦为什么要求凯瑟琳核对数字？"],
          ["He did not fully trust the electronic computers", "他不完全信任电子计算机"],
          [
            ["Katherine was the director of NASA", "凯瑟琳是NASA的负责人"],
            ["The machines had been broken for more than a year", "那些机器坏了一年多"],
            ["He wanted to meet her before he left", "他想在出发前见见她"],
          ],
          [
            "The third paragraph says Glenn did not fully trust the machines and asked for Katherine to check the numbers by hand.",
            "第三段说，格伦不完全信任机器，要求凯瑟琳手工核对数字。",
          ],
          [
            ["Director of NASA is wrong. She was a computer there.", "NASA的主管不对。她在那里是计算员。"],
            ["Broken machines for a year is not in the passage.", "机器坏了一年文中没有。"],
            ["Wanting to meet her is not the reason given.", "想见她不是文中给的原因。"],
          ],
        ),
        q(
          ["Which detail shows an obstacle Katherine faced?", "哪个细节表明凯瑟琳遇到了障碍？"],
          ["Unfair laws closed many jobs to Black Americans", "不公平的法律让许多工作对美国黑人关上了大门"],
          [
            ["She loved to count the stars", "她喜欢数星星"],
            ["She lived to the age of 101", "她活到了101岁"],
            ["She helped plan the flight of Apollo 11", "她帮助规划了阿波罗11号的飞行"],
          ],
          [
            "The second paragraph says Black Americans faced unfair laws, and many jobs were closed to them: an obstacle she overcame.",
            "第二段说，美国黑人面临不公平的法律，许多工作不对他们开放：这是她克服的障碍。",
          ],
          [
            ["Counting stars is a happy detail from childhood.", "数星星是童年的快乐细节。"],
            ["Living to 101 is about her long life.", "活到101岁说的是她长寿。"],
            ["Apollo 11 is a success, not an obstacle.", "阿波罗11号是成就，不是障碍。"],
          ],
        ),
      ],
      {
        names: [
          "Katherine",
          "Johnson",
          "West",
          "Virginia",
          "Black",
          "Americans",
          "American",
          "NASA",
          "John",
          "Glenn",
          "Glenn's",
          "Earth",
          "Apollo",
          "Moon",
        ],
      },
    ),
  ],
};
