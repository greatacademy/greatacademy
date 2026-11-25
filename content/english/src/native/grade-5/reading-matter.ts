// Grade 5: the reading unit of the second theme, matter and its changes, from particles too small to see to the
// changes of the kitchen.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "./reading-kit.ts";

const matterWords = { topic: "words-of-matter", weight: 0.3 } as const;
const changeWords = { topic: "words-of-chemical-change", weight: 0.3 } as const;
const materialWords = { topic: "words-for-describing-materials", weight: 0.3 } as const;
const investigating = { topic: "words-for-investigating", weight: 0.3 } as const;
const experiment = { topic: "reading-about-an-experiment", weight: 0.2 } as const;
const evidence = { topic: "matching-points-and-evidence", weight: 0.2 } as const;
const academic1 = { topic: "academic-words-1", weight: 0.1 } as const;

/** matterAndItsChanges is a reading unit of grade 5 on matter, its states and the changes it goes through. */
export const matterAndItsChanges: ReadingUnitDef = {
  id: "matter-and-its-changes",
  title: t("Matter and Its Changes", "物质及其变化"),
  passages: [
    passage(
      "everything-is-matter",
      t("Everything Is Matter", "万物皆物质"),
      `Look around you. The chair you sit on, the water in your glass and even the air you breathe are all made of matter. Matter is anything that has mass and takes up space.

Mass is the amount of matter in an object. A bowling ball has more mass than a beach ball of the same size, which is why it is much harder to lift. Volume is the amount of space an object fills. A balloon full of air has a large volume but very little mass.

Every kind of matter has properties, the qualities that help us tell one substance from another. Color, smell and hardness are properties. So is whether a substance floats or sinks in water. A rock is dense, so it sinks, while a cork is not, so it floats.

Some things are not matter at all. Light, sound and heat have no mass and fill no space, though they can change the matter they touch. A sunbeam can warm a stone, but the sunbeam itself is not a thing you could weigh.

Scientists sort the world by its properties. Once you know what something is made of and how it behaves, you can predict what it will do.`,
      [matterWords, evidence],
      [
        ask(
          t("What two things make something matter, according to the passage?", "根据文章，物质具备哪两个条件？"),
          t("It has mass and takes up space", "有质量并且占据空间"),
          [
            t("It has color and a smell", "有颜色和气味"),
            t("It floats and is hard", "能漂浮而且很硬"),
            t("It gives off light and heat", "能发光发热"),
          ],
          t(
            "The first paragraph defines matter as anything that has mass and takes up space.",
            "第一段把物质定义为任何有质量并且占据空间的东西。",
          ),
          [
            t(
              "Color and smell are properties that tell substances apart, not what makes something matter.",
              "颜色和气味是区分物质的性质，不是构成物质的条件。",
            ),
            t(
              "Floating and hardness are also just properties. A rock sinks and is still matter.",
              "浮和硬也只是性质。石头会沉，但仍是物质。",
            ),
            t("Light and heat are named as things that are not matter at all.", "光和热正是文中说的根本不是物质的东西。"),
          ],
        ),
        ask(
          t("Why does the passage compare a bowling ball and a beach ball?", "文章为什么把保龄球和沙滩球作比较？"),
          t("To show that objects of one size can have different masses", "说明同样大小的物体质量可以不同"),
          [
            t("To show that balls are made of the same substance", "说明这些球由同一种物质构成"),
            t("To explain why light has no mass at all", "解释为什么光完全没有质量"),
            t("To prove that the beach ball has a larger volume", "证明沙滩球的体积更大"),
          ],
          t(
            "The two balls are the same size, yet the bowling ball is harder to lift because it has more mass.",
            "两个球一样大，但保龄球更难举起，因为它的质量更大。",
          ),
          [
            t(
              "Same substance is never claimed. The two balls differ in how heavy they are.",
              "文中从没说它们是同一种物质。两个球的区别在于轻重。",
            ),
            t("Light comes up in a later paragraph, not in the comparison of the balls.", "光是在后面一段才提到的，与两个球的比较无关。"),
            t("The balls are the same size, so neither has a larger volume.", "两个球大小一样，所以谁的体积都不更大。"),
          ],
        ),
        ask(
          t("Which of these is not matter, according to the passage?", "根据文章，下面哪一项不是物质？"),
          t("A beam of sunlight", "一束阳光"),
          [t("The air in a balloon", "气球里的空气"), t("A cork in water", "水中的软木塞"), t("A heavy stone", "一块重石头")],
          t(
            "The passage says light, sound and heat have no mass and fill no space, so a sunbeam is not matter. Air, cork and stone all are.",
            "文章说光、声和热没有质量，也不占空间，所以阳光不是物质。空气、软木塞和石头都是物质。",
          ),
          [
            t("The air in a balloon is matter: it has a little mass and a large volume.", "气球里的空气是物质：它有少量质量和较大体积。"),
            t("A cork is matter. It floats because it is not dense.", "软木塞是物质。它浮起来是因为密度小。"),
            t("A stone is matter. The sunbeam only warms it.", "石头是物质。阳光只是让它变暖。"),
          ],
        ),
        ask(
          t("Why does a cork float in water?", "软木塞为什么能浮在水上？"),
          t("It is not dense", "它的密度不大"),
          [t("It is heavier than a rock", "它比石头重"), t("It has no mass", "它没有质量"), t("It is made of light", "它是光做的")],
          t("A rock is dense, so it sinks, while a cork is not, so it floats.", "石头密度大，所以下沉；软木塞不是，所以漂浮。"),
          [
            t(
              "Heavier than a rock is the reverse. The rock is the dense one that sinks.",
              "比石头重是反过来了。石头才是密度大、会下沉的那个。",
            ),
            t("A cork has mass. Only light, sound and heat have none.", "软木塞有质量。只有光、声和热没有质量。"),
            t("Light is not matter, and a cork is not made of it.", "光不是物质，软木塞也不是光做的。"),
          ],
        ),
      ],
    ),
    passage(
      "too-small-to-see",
      t("Too Small to See", "小到看不见"),
      `If you could cut a grain of sugar in half, and then in half again, and keep going, what would you find at the end? More than two thousand years ago, a Greek thinker named Democritus guessed that you would reach tiny pieces that could not be cut any further. He called them atoms.

Today we know he was close to the truth. All matter is made of particles far too small to see, even with an ordinary microscope. A single drop of water contains more particles than there are stars in our galaxy.

These particles are always moving. In a solid, they are packed tightly and only shake in place. In a liquid, they slide past one another. In a gas, they zoom around freely and spread out to fill any container.

You can see evidence of this movement yourself. Drop a little food coloring into a glass of still water and watch. Without any stirring, the color slowly spreads until the whole glass is tinted. The moving particles of water bump the particles of coloring and carry them everywhere.

The tiny particles explain much of what we see, from a melting ice cube to the smell of bread drifting from the kitchen.`,
      [matterWords, evidence, academic1],
      [
        ask(
          t("What did Democritus guess about matter?", "德谟克利特对物质有什么猜想？"),
          t("It is made of tiny pieces that cannot be cut further", "物质由不能再分割的微小颗粒构成"),
          [
            t("It is made of sugar that dissolves in water", "物质由能溶于水的糖构成"),
            t("It can be cut in half forever without an end", "物质可以永远对半切下去"),
            t("It is made of stars, like those of the galaxy", "物质像银河里的星星一样由星星构成"),
          ],
          t(
            "The first paragraph says Democritus guessed you would reach tiny pieces that could not be cut any further, which he called atoms.",
            "第一段说，德谟克利特猜想最后会得到不能再分割的微小颗粒，他称之为原子。",
          ),
          [
            t("Sugar is only the example he cut in half. He did not say matter is sugar.", "糖只是他拿来切半的例子。他没说物质是糖。"),
            t(
              "Cutting forever is the opposite. He guessed you would reach pieces that cannot be cut.",
              "永远切下去正好相反。他猜想最后会得到切不开的小块。",
            ),
            t("Stars are only a comparison for how many particles a drop holds.", "星星只是用来比喻一滴水里粒子有多少。"),
          ],
        ),
        ask(
          t("Which detail is evidence that particles are always moving?", "哪个细节证明颗粒一直在运动？"),
          t("Food coloring spreads through still water", "食用色素在静止的水中扩散开来"),
          [
            t("A drop of water has very many particles", "一滴水含有非常多的颗粒"),
            t("Particles are too small to see", "颗粒小到看不见"),
            t("Democritus lived long ago", "德谟克利特生活在很久以前"),
          ],
          t(
            "The fourth paragraph says the color spreads without stirring because moving water particles carry it, which is evidence of motion.",
            "第四段说，不用搅拌颜色也会扩散，因为运动的水颗粒带着它走，这就是运动的证据。",
          ),
          [
            t(
              "A drop holding many particles shows how many there are, not that they move.",
              "一滴水有很多粒子说明粒子多，不说明它们在动。",
            ),
            t("Being too small to see says nothing about movement.", "太小看不见和是否运动无关。"),
            t("When Democritus lived is history, not evidence of movement.", "德谟克利特生活的年代是历史，不是运动的证据。"),
          ],
        ),
        ask(
          t("How do particles behave in a gas?", "气体中的颗粒是怎样运动的？"),
          t("They move freely and spread out", "它们自由运动并且散开"),
          [
            t("They are packed and only shake", "它们挤在一起，只是颤动"),
            t("They slide slowly past each other", "它们慢慢地相互滑过"),
            t("They stop moving completely", "它们完全停止运动"),
          ],
          t(
            "The third paragraph says particles in a gas zoom around freely and spread out to fill a container. Shaking in place describes a solid, and sliding describes a liquid.",
            "第三段说气体中的颗粒自由飞快地运动，散开充满容器。在原地颤动说的是固体，相互滑过说的是液体。",
          ),
          [
            t("Packed tightly and shaking describes a solid.", "紧密排列、原地振动描述的是固体。"),
            t("Sliding past one another describes a liquid.", "彼此滑过描述的是液体。"),
            t("The passage says particles are always moving, in every state.", "文中说粒子在任何状态下都一直在运动。"),
          ],
        ),
        ask(
          t("How do particles behave in a solid?", "固体中的粒子怎样运动？"),
          t("They are packed tightly and shake in place", "它们紧密排列，在原地振动"),
          [
            t("They zoom around freely", "它们自由地飞来飞去"),
            t("They slide past one another", "它们互相滑过"),
            t("They do not move at all", "它们完全不动"),
          ],
          t("In a solid, particles are packed tightly and only shake in place.", "在固体中，粒子紧密排列，只在原地振动。"),
          [
            t("Zooming around freely describes a gas.", "自由飞来飞去描述的是气体。"),
            t("Sliding past one another describes a liquid.", "彼此滑过描述的是液体。"),
            t("They do move: they shake in place.", "它们是在动的：在原地振动。"),
          ],
        ),
      ],
    ),
    passage(
      "solid-liquid-and-gas",
      t("Solid, Liquid and Gas", "固体、液体和气体"),
      `Water is a surprising substance, because you can find it in three different forms on an ordinary day. It is solid in the ice cubes in your freezer, liquid in your glass and gas in the invisible steam above a pot of soup.

A solid keeps its own shape. An ice cube is a cube whether it sits on a plate or in a bowl. Its particles are locked close together, so it also keeps the same volume.

A liquid has a fixed volume but no shape of its own. Pour a cup of juice into a tall glass, and then into a flat dish. The amount of juice stays the same, but its shape changes to fit each container.

A gas has neither its own shape nor its own volume. It spreads to fill whatever space it is in. When you open a bottle of perfume in one corner, soon the whole room smells of it.

These three forms are called states of matter. The same substance can move from one state to another when it is heated or cooled, but it is still the same substance. Ice, water and steam are all water, just as a child, a teenager and an adult can all be the same person.`,
      [matterWords, evidence],
      [
        ask(
          t("What is true of a liquid, according to the passage?", "根据文章，液体有什么特点？"),
          t("It keeps its volume but takes the shape of its container", "体积不变，但形状随容器改变"),
          [
            t("It keeps both its own shape and its own volume", "既保持自己的形状也保持自己的体积"),
            t("It has no volume and spreads out to fill the room", "没有固定体积，会散开充满房间"),
            t("It always becomes a solid when you pour it out", "倒出来时总会变成固体"),
          ],
          t(
            "The third paragraph says the amount of juice stays the same while its shape changes to fit each container.",
            "第三段说果汁的量不变，而形状随每个容器改变。",
          ),
          [
            t("Keeping its own shape is true of a solid, like the ice cube.", "保持自己的形状是固体的特点，比如冰块。"),
            t("Spreading to fill the room is a gas, like the perfume.", "扩散到整个房间是气体，比如香水。"),
            t("Pouring juice into a dish changes its shape, not its state.", "把果汁倒进盘子改变的是形状，不是状态。"),
          ],
        ),
        ask(
          t("Why does the author mention a bottle of perfume?", "作者为什么提到一瓶香水？"),
          t("To show how a gas spreads to fill a space", "说明气体会散开充满空间"),
          [
            t("To show how a solid keeps its shape", "说明固体会保持形状"),
            t("To explain why ice floats on water", "解释冰为什么浮在水面上"),
            t("To compare the smell of steam and soup", "比较蒸汽和汤的气味"),
          ],
          t(
            "The perfume example supports the point that a gas spreads to fill whatever space it is in.",
            "香水的例子支持了“气体会散开充满所在空间”这一观点。",
          ),
          [
            t("A solid keeping its shape is shown by the ice cube, not the perfume.", "固体保持形状是用冰块说明的，不是香水。"),
            t("Ice floating is never discussed in this passage.", "这篇文章没有谈冰为什么浮。"),
            t(
              "Steam and soup appear in the first paragraph. The perfume shows a gas spreading.",
              "蒸汽和汤出现在第一段。香水说明的是气体扩散。",
            ),
          ],
        ),
        ask(
          t("What does the comparison to a child, a teenager and an adult explain?", "把物质和儿童、少年、成年人作比较，解释了什么？"),
          t("A substance stays the same substance in each state", "物质在每种状态下仍是同一种物质"),
          [
            t("Substances grow larger as they get older", "物质越老就会变得越大"),
            t("Water must be heated three times to change", "水要加热三次才会改变"),
            t("Only people can change from one form to another", "只有人能从一种形态变成另一种"),
          ],
          t(
            "Just as one person passes through different ages, ice, water and steam are all the same substance, water.",
            "正如一个人会经历不同的年龄，冰、水和蒸汽都是同一种物质：水。",
          ),
          [
            t("Growing larger is not the point. The person stays the same person.", "长大不是重点。这个人还是同一个人。"),
            t(
              "Heating three times is not said. Heating or cooling moves a substance between states.",
              "文中没说要加热三次。加热或冷却让物质在状态间变化。",
            ),
            t("The comparison is about water, not about people alone changing.", "这个比喻说的是水，不是说只有人会变。"),
          ],
        ),
        ask(
          t("Where can you find water as a gas on an ordinary day?", "平常的一天里，你在哪里能找到气态的水？"),
          t("In the steam above a pot of soup", "在一锅汤上方的蒸汽里"),
          [
            t("In the ice cubes in the freezer", "在冰箱的冰块里"),
            t("In a glass of water", "在一杯水里"),
            t("In a bottle of perfume", "在一瓶香水里"),
          ],
          t("Water is gas in the invisible steam above a pot of soup.", "水在一锅汤上方看不见的蒸汽里是气态的。"),
          [
            t("Ice cubes in the freezer are water as a solid.", "冰箱里的冰块是固态的水。"),
            t("A glass of water holds liquid water.", "一杯水装的是液态的水。"),
            t("Perfume is the example of a gas spreading, not of water.", "香水是气体扩散的例子，不是水。"),
          ],
        ),
      ],
    ),
    passage(
      "melting-freezing-and-boiling",
      t("Melting, Freezing and Boiling", "熔化、凝固和沸腾"),
      `Heat is what pushes matter from one state to another. When you add heat to a solid, its particles shake faster and faster until they break free of their places. The solid melts into a liquid. Ice melts at zero degrees Celsius.

Keep heating the liquid, and its particles move faster still. Some escape from the surface and float away as a gas; this is how a puddle evaporates on a sunny day. At one hundred degrees Celsius, water boils. Bubbles of gas form all through the liquid and rise to the top.

Take heat away, and the changes run backward. Steam that touches a cold window cools and turns back into drops of liquid water. Put that water in a freezer, and its particles slow down until they lock together as ice.

Scientists call these changes physical changes, because the substance itself does not change. Melted chocolate is still chocolate, and it can be cooled into a solid bar again. The same is true of wax, butter and metal.

Different substances melt and boil at different temperatures. Butter melts in a warm hand, but iron must be heated to more than 1,500 degrees Celsius before it flows like water.`,
      [matterWords, changeWords],
      [
        ask(
          t("What happens to the particles of a solid as it is heated?", "固体被加热时，它的颗粒会发生什么？"),
          t("They shake faster until they break free", "它们颤动得越来越快，直到挣脱原位"),
          [
            t("They slow down and lock tighter together", "它们变慢，并锁得更紧"),
            t("They turn into a brand-new substance", "它们变成一种全新的物质"),
            t("They stop moving and stay in place", "它们停止运动，留在原地"),
          ],
          t(
            "The first paragraph says added heat makes particles shake faster until they break free, and the solid melts.",
            "第一段说，加热让颗粒颤动得更快，直到挣脱原位，固体就熔化了。",
          ),
          [
            t("Slowing down and locking together is what happens when heat is taken away.", "变慢并锁在一起是去掉热量时发生的。"),
            t("Melting is a physical change. The substance stays the same.", "熔化是物理变化。物质本身不变。"),
            t("Stopping is the opposite. Heat makes particles shake faster.", "停止不动正好相反。加热让粒子振动得更快。"),
          ],
        ),
        ask(
          t("Why are melting and boiling called physical changes?", "为什么熔化和沸腾叫作物理变化？"),
          t("The substance itself stays the same", "物质本身保持不变"),
          [
            t("They happen only in a laboratory", "它们只在实验室里发生"),
            t("They need a temperature of 100 degrees", "它们需要一百摄氏度的温度"),
            t("They can never be reversed", "它们永远不能逆转"),
          ],
          t(
            "The fourth paragraph says these are physical changes because the substance does not change; melted chocolate is still chocolate.",
            "第四段说，这些是物理变化，因为物质没有改变；熔化的巧克力仍然是巧克力。",
          ),
          [
            t("A laboratory is never mentioned for melting and boiling.", "文中没说熔化和沸腾只在实验室发生。"),
            t("100 degrees is only water's boiling point. Butter melts in a warm hand.", "100度只是水的沸点。黄油在温暖的手里就会熔化。"),
            t("They can be reversed: melted chocolate cools back into a bar.", "它们是可以逆转的：熔化的巧克力能冷却成块。"),
          ],
        ),
        ask(
          t("What happens when steam touches a cold window?", "蒸汽碰到冰冷的窗户会怎样？"),
          t("It cools and turns into drops of water", "它冷却下来，变成水滴"),
          [
            t("It boils and makes bubbles on the glass", "它沸腾，在玻璃上起泡"),
            t("It freezes straight into a bar of ice", "它直接冻成一块冰"),
            t("It turns into a new kind of gas", "它变成一种新的气体"),
          ],
          t(
            "The third paragraph says steam that touches a cold window cools and turns back into drops of liquid water.",
            "第三段说，碰到冰冷窗户的蒸汽会冷却，变回液态的水滴。",
          ),
          [
            t("Boiling needs heat. The window is cold, so the steam cools.", "沸腾需要热。窗户是冷的，所以蒸汽冷却。"),
            t("It turns into drops of liquid first. Freezing comes only in a freezer.", "它先变成液态水滴。只有放进冰箱才会结冰。"),
            t("It stays water. Cooling steam gives liquid water, not a new gas.", "它还是水。蒸汽冷却变成液态水，不是新的气体。"),
          ],
        ),
        ask(
          t("At what temperature does water boil?", "水在多少度沸腾？"),
          t("One hundred degrees Celsius", "一百摄氏度"),
          [
            t("Zero degrees Celsius", "零摄氏度"),
            t("Fifty degrees Celsius", "五十摄氏度"),
            t("More than 1,500 degrees Celsius", "一千五百多摄氏度"),
          ],
          t('The text says, "At one hundred degrees Celsius, water boils."', "短文说：“水在一百摄氏度时沸腾。”"),
          [
            t("Zero degrees is where ice melts, not where water boils.", "零度是冰熔化的温度，不是水沸腾的温度。"),
            t("Fifty degrees is not given anywhere in the passage.", "文中根本没有提到五十度。"),
            t("More than 1,500 degrees is what iron needs to melt.", "超过1500度是铁熔化所需的温度。"),
          ],
        ),
      ],
    ),
    passage(
      "mixtures-and-solutions",
      t("Mixtures and Solutions", "混合物和溶液"),
      `Stir a handful of sand into a jar of dried beans, and you have made a mixture. A mixture is two or more substances mixed together, each keeping its own properties. The sand is still sand, and the beans are still beans. You could even separate them again with a sieve, because the beans are too big to pass through its holes.

Some mixtures are harder to see. When you stir sugar into warm water, the sugar seems to disappear. It has dissolved: its particles have spread evenly between the particles of water. A mixture like this, in which one substance dissolves completely into another, is called a solution. Salt water and lemonade are solutions too.

Even though you cannot see the sugar, it is still there, as one sip will tell you. And it can be separated. Leave the sugar water in a shallow dish in the sun. The water slowly evaporates, and the sugar is left behind as crystals.

Not everything dissolves. Sand stirred into water will swirl for a moment and then sink to the bottom. Sugar is soluble in water, but sand is not.

Knowing which substances dissolve helps cooks, doctors and scientists every day.`,
      [matterWords, materialWords],
      [
        ask(
          t("What is a solution, according to the passage?", "根据文章，什么是溶液？"),
          t("A mixture in which one substance dissolves completely", "一种物质完全溶解于另一种物质的混合物"),
          [
            t("A mixture of large pieces that a sieve can separate", "能用筛子分开的大块物质的混合物"),
            t("A substance that sinks to the bottom of a jar", "沉到罐底的物质"),
            t("A new substance made when sugar is heated", "糖加热后形成的新物质"),
          ],
          t(
            "The second paragraph defines a solution as a mixture in which one substance dissolves completely into another.",
            "第二段把溶液定义为一种物质完全溶解于另一种物质的混合物。",
          ),
          [
            t(
              "Pieces a sieve can catch, like sand and beans, form a mixture that is not a solution.",
              "能被筛子分开的大块，比如沙和豆子，是混合物而不是溶液。",
            ),
            t("Sinking to the bottom is what sand does because it does not dissolve.", "沉到底部是沙子的表现，因为它不溶解。"),
            t("Heating is not mentioned. In a solution the sugar is still sugar.", "文中没提加热。溶液里的糖仍然是糖。"),
          ],
        ),
        ask(
          t("How can the sugar be taken back out of sugar water?", "怎样把糖从糖水里取回来？"),
          t("Let the water evaporate in the sun", "让水在阳光下蒸发"),
          [
            t("Pour it through a sieve", "用筛子过滤"),
            t("Stir it faster and faster", "越搅越快"),
            t("Add more sand to it", "再加入一些沙子"),
          ],
          t(
            "The third paragraph says the water slowly evaporates in a dish in the sun and leaves the sugar behind as crystals.",
            "第三段说，把糖水放在阳光下的浅盘里，水慢慢蒸发，糖以晶体的形式留下来。",
          ),
          [
            t("A sieve separates beans from sand. Dissolved sugar passes through.", "筛子分开的是豆子和沙。溶解的糖会穿过去。"),
            t("Stirring only helps sugar dissolve. It does not take it out.", "搅拌只会帮糖溶解，不会把它取出来。"),
            t("Sand does not dissolve and would not pull the sugar out.", "沙子不溶解，也不会把糖带出来。"),
          ],
        ),
        ask(
          t("Which sentence shows that sand is not soluble in water?", "哪句话表明沙子不溶于水？"),
          t("It swirls for a moment and then sinks to the bottom", "它旋转一会儿，然后沉到底部"),
          [
            t("It spreads evenly between the water particles", "它均匀地散布在水颗粒之间"),
            t("It disappears, but one sip shows it is there", "它消失了，但尝一口就知道还在"),
            t("It is left behind as crystals in the sun", "在阳光下以晶体形式留下"),
          ],
          t(
            "Sand that sinks has not dissolved. The other details describe sugar, which is soluble.",
            "沉下去的沙子没有溶解。其他细节说的都是能溶解的糖。",
          ),
          [
            t("Spreading evenly between water particles describes sugar dissolving.", "均匀分散在水分子之间描述的是糖溶解。"),
            t("Disappearing but still tasting sweet describes sugar in water.", "看不见但尝得出来描述的是水中的糖。"),
            t("Crystals left in the sun are the sugar taken back out of water.", "阳光下留下的晶体是从水里取回的糖。"),
          ],
        ),
        ask(
          t("How could you separate sand from dried beans?", "怎样把沙子和干豆子分开？"),
          t("With a sieve", "用筛子"),
          [t("By boiling them", "煮它们"), t("By adding sugar", "加糖"), t("By freezing them", "冷冻它们")],
          t(
            "You could separate them with a sieve, because the beans are too big to pass through its holes.",
            "可以用筛子把它们分开，因为豆子太大，漏不过筛孔。",
          ),
          [
            t("Boiling is not how the passage separates sand and beans.", "文中不是用煮沸来分开沙子和豆子的。"),
            t("Adding sugar would only make the mixture more mixed.", "加糖只会让混合物更杂。"),
            t("Freezing would not part them. The beans are too big for the sieve's holes.", "冷冻分不开它们。豆子太大，穿不过筛孔。"),
          ],
        ),
      ],
    ),
    passage(
      "when-new-substances-form",
      t("When New Substances Form", "新物质形成时"),
      `Leave a steel bicycle out in the rain for a few weeks, and its chain will turn orange and flaky. That orange crust is rust, and it is not steel at all. It is a brand-new substance, formed when the iron in steel reacts with water and oxygen from the air.

A change that makes a new substance is called a chemical change, or a chemical reaction. Unlike melting, a chemical change usually cannot be undone. You can cool melted butter back into a solid, but you cannot turn rust back into a shiny chain, or ashes back into wood.

How can you tell that a chemical change has happened? Scientists look for clues. A new color may appear, like the brown of toasted bread. Bubbles of gas may fizz up, as when baking soda meets vinegar. There may be a new odor, such as the sour smell of milk that has gone bad. Sometimes heat or light is given off, as in a burning candle.

Not every clue proves a chemical change. Boiling water bubbles too, but it is still water. A careful scientist checks whether a new substance has really formed.`,
      [changeWords, evidence],
      [
        ask(
          t("What is rust, according to the passage?", "根据文章，铁锈是什么？"),
          t("A new substance made when iron reacts with water and air", "铁与水和空气反应后形成的新物质"),
          [
            t("Steel that has melted in the hot sun", "在烈日下熔化的钢"),
            t("Orange paint that has peeled off the chain", "从链条上剥落的橙色油漆"),
            t("A solution of steel dissolved in rainwater", "钢溶解在雨水中形成的溶液"),
          ],
          t(
            "The first paragraph says rust is a brand-new substance formed when the iron in steel reacts with water and oxygen.",
            "第一段说，铁锈是钢中的铁与水和氧气反应后形成的全新物质。",
          ),
          [
            t("Melting keeps steel as steel. Rust is a new substance, not steel at all.", "熔化后钢还是钢。铁锈是新物质，根本不是钢。"),
            t("Paint is not mentioned. The crust forms from the iron itself.", "文中没提油漆。锈层来自铁本身。"),
            t("Steel does not dissolve in rain. Iron reacts with water and oxygen.", "钢不会溶解在雨水里。是铁和水、氧气发生了反应。"),
          ],
        ),
        ask(
          t("How is a chemical change different from melting?", "化学变化和熔化有什么不同？"),
          t("It usually cannot be undone", "它通常不能逆转"),
          [
            t("It needs no heat at all", "它完全不需要热"),
            t("It always gives off light", "它总会发光"),
            t("It keeps the same substance", "它保留同一种物质"),
          ],
          t(
            "The second paragraph says a chemical change usually cannot be undone, unlike melted butter, which can become solid again.",
            "第二段说，化学变化通常不能逆转，不像熔化的黄油可以重新变成固体。",
          ),
          [
            t("Heat is not ruled out. A burning candle gives off heat.", "文中没说不需要热。燃烧的蜡烛就会放热。"),
            t("Light is only one possible clue, given off sometimes, not always.", "光只是可能的线索之一，有时出现，并非总是。"),
            t("Keeping the same substance is melting. A chemical change makes a new one.", "保持同一种物质是熔化。化学变化会产生新物质。"),
          ],
        ),
        ask(
          t("Why does the author mention boiling water in the last paragraph?", "作者为什么在最后一段提到沸水？"),
          t("To show that bubbles alone do not prove a chemical change", "说明只有气泡并不能证明发生了化学变化"),
          [
            t("To give an example of a new substance forming", "举一个形成新物质的例子"),
            t("To explain how baking soda reacts with vinegar", "解释小苏打怎样与醋反应"),
            t("To prove that water turns into rust when heated", "证明水加热后会变成铁锈"),
          ],
          t(
            "Boiling water bubbles but stays water, so the author uses it to show that one clue is not proof.",
            "沸水会冒泡但仍然是水，所以作者用它来说明一条线索不等于证据。",
          ),
          [
            t("Boiling water is still water, so no new substance forms.", "沸水仍然是水，所以没有新物质形成。"),
            t("Baking soda and vinegar come in the paragraph before, as a separate clue.", "小苏打和醋出现在前一段，是另一条线索。"),
            t("Water turning into rust is never said. Rust forms from iron.", "文中从没说水会变成铁锈。铁锈来自铁。"),
          ],
        ),
        ask(
          t("What happens when baking soda meets vinegar?", "小苏打遇到醋会怎样？"),
          t("Bubbles of gas fizz up", "冒出气泡"),
          [t("It turns into rust", "变成铁锈"), t("It melts", "融化了"), t("It gives off light", "发出光")],
          t("Bubbles of gas may fizz up, as when baking soda meets vinegar.", "会冒出气泡，就像小苏打遇到醋那样。"),
          [
            t("Rust forms from iron, water and air, not from baking soda.", "铁锈来自铁、水和空气，不是小苏打。"),
            t("Melting is a physical change. This reaction makes gas.", "熔化是物理变化。这个反应会产生气体。"),
            t("Light is the clue of a burning candle, not of this reaction.", "发光是燃烧蜡烛的线索，不是这个反应的。"),
          ],
        ),
      ],
    ),
    passage(
      "weighing-before-and-after",
      t("Weighing Before and After", "前后称重"),
      `Maria's class wanted to answer a question: when baking soda and vinegar react, does any matter disappear?

First, they poured vinegar into a plastic bottle and put a spoonful of baking soda inside a balloon. They stretched the balloon over the bottle's neck without letting the powder fall in. Then they set the whole thing on a scale. It weighed 182 grams.

Next, Maria lifted the balloon so the baking soda dropped into the vinegar. The mixture fizzed wildly, and the balloon swelled up with gas. When the fizzing stopped, they weighed the bottle again. The scale still read 182 grams.

The class repeated the test with an open bottle and no balloon. This time the mass dropped to 178 grams. The gas had escaped into the room.

Their conclusion was clear. In a chemical reaction, matter is not destroyed. It only changes form. When the gas was trapped in the balloon, the mass stayed the same. When the gas escaped, it seemed as if matter had vanished, but it had only floated away.

Scientists call this idea the conservation of mass. It is one of the most important rules in all of chemistry.`,
      [experiment, investigating],
      [
        ask(
          t("What question did the class want to answer?", "全班想回答什么问题？"),
          t("Does matter disappear when baking soda and vinegar react?", "小苏打和醋反应时物质会消失吗？"),
          [
            t("How fast does a balloon fill with air?", "气球充气有多快？"),
            t("Which weighs more, vinegar or baking soda?", "醋和小苏打哪个更重？"),
            t("Why does vinegar smell sour?", "醋为什么闻起来是酸的？"),
          ],
          t(
            "The first paragraph states the question: when baking soda and vinegar react, does any matter disappear?",
            "第一段提出了问题：小苏打和醋反应时，会有物质消失吗？",
          ),
          [
            t("The balloon filling is part of the test, not the question the class asked.", "气球鼓起是实验的一部分，不是全班要问的问题。"),
            t("The class weighed everything together, not vinegar against soda.", "全班是一起称的，不是比较醋和小苏打谁重。"),
            t("The smell of vinegar is never mentioned.", "文中从没提到醋的气味。"),
          ],
        ),
        ask(
          t("Why did the mass drop in the open bottle?", "为什么开口瓶的质量下降了？"),
          t("The gas escaped into the room", "气体跑到了房间里"),
          [t("The vinegar was destroyed", "醋被消灭了"), t("The scale was broken", "秤坏了"), t("The balloon popped", "气球爆了")],
          t(
            "The fourth paragraph says the mass dropped to 178 grams because the gas had escaped into the room.",
            "第四段说质量降到178克，是因为气体跑到了房间里。",
          ),
          [
            t("Nothing was destroyed. The conclusion is that matter only changes form.", "什么都没被消灭。结论是物质只是改变了形态。"),
            t("The same scale gave 182 grams for the sealed bottle, so it worked.", "同一个秤称密封瓶子得到182克，所以秤没坏。"),
            t("The open bottle had no balloon at all.", "开口的瓶子根本没有气球。"),
          ],
        ),
        ask(
          t("Which result supports the conclusion that matter is not destroyed?", "哪个结果支持“物质不会被消灭”的结论？"),
          t("The sealed bottle weighed 182 grams before and after", "密封瓶反应前后都是182克"),
          [
            t("The mixture fizzed wildly", "混合物剧烈地冒泡"),
            t("The open bottle weighed less afterward", "开口瓶之后变轻了"),
            t("The balloon swelled up with gas", "气球被气体胀大了"),
          ],
          t(
            "Only the unchanged mass of the sealed bottle shows that no matter vanished. Fizzing and swelling show a reaction, not that mass was kept.",
            "只有密封瓶质量不变才能说明没有物质消失。冒泡和胀大说明发生了反应，但不能说明质量守恒。",
          ),
          [
            t("Fizzing shows a reaction happened, not that the mass stayed the same.", "冒泡说明发生了反应，不说明质量不变。"),
            t(
              "The lighter open bottle seems to show matter vanishing. The gas only escaped.",
              "开口瓶子变轻似乎说明物质消失，其实只是气体跑了。",
            ),
            t("The swelling balloon shows gas formed, not that no matter was lost.", "气球鼓起说明产生了气体，不说明质量没有减少。"),
          ],
        ),
      ],
    ),
    passage(
      "matter-in-the-kitchen",
      t("Matter in the Kitchen", "厨房里的物质"),
      `A kitchen is a laboratory, even if no one calls it one. Every time you cook, you change matter.

Some kitchen changes are physical. When you chop a carrot, it is still a carrot, only in smaller pieces. When you melt butter in a pan, it becomes a liquid, but let it cool, and it is solid butter again. Freezing juice into ice pops changes its state, not what it is made of.

Other changes are chemical. Crack an egg into a hot pan, and the clear part turns white and firm. No amount of cooling will make it clear and runny again. Bake a cake, and the batter rises as baking powder gives off bubbles of gas, which are trapped in the batter as it sets. Toast a slice of bread, and the surface browns as new substances form, giving off a delicious smell.

Cooks use these changes on purpose. A baker knows that too little baking powder makes a flat cake, while too much makes a bitter one. A good recipe is a careful procedure, tested again and again until the results are consistent.

So the next time you help in the kitchen, remember: you are doing science.`,
      [changeWords, investigating],
      [
        ask(
          t("Which kitchen change is a chemical change?", "哪一种厨房里的变化是化学变化？"),
          t("An egg turning white and firm in a hot pan", "鸡蛋在热锅里变白变硬"),
          [
            t("Butter melting in a pan", "黄油在锅里熔化"),
            t("Juice freezing into ice pops", "果汁冻成冰棍"),
            t("A carrot cut into pieces", "胡萝卜被切成小块"),
          ],
          t(
            "The third paragraph says the cooked egg cannot be made clear and runny again, so a new substance has formed. The other three are physical changes.",
            "第三段说煮熟的鸡蛋不能再变回透明、流动的样子，所以形成了新物质。另外三个都是物理变化。",
          ),
          [
            t("Melted butter becomes solid butter again when it cools: a physical change.", "熔化的黄油冷却后又变回固体黄油：是物理变化。"),
            t("Freezing juice changes its state, not what it is made of.", "冻果汁改变的是状态，不是成分。"),
            t("A chopped carrot is still a carrot, only in smaller pieces.", "切碎的胡萝卜还是胡萝卜，只是块小了。"),
          ],
        ),
        ask(
          t("What makes a cake rise, according to the passage?", "根据文章，是什么让蛋糕膨胀？"),
          t("Bubbles of gas from baking powder", "发酵粉产生的气泡"),
          [
            t("Butter that melts in the oven", "在烤箱里熔化的黄油"),
            t("Eggs that turn white", "变白的鸡蛋"),
            t("Smell from the toasted bread", "烤面包的香味"),
          ],
          t(
            "The third paragraph says the batter rises as baking powder gives off bubbles of gas that are trapped as it sets.",
            "第三段说，发酵粉放出的气泡被困在凝固的面糊中，面糊就膨胀了。",
          ),
          [
            t(
              "Melting butter is a physical change mentioned earlier. It does not make the cake rise.",
              "熔化黄油是前面提到的物理变化，不会让蛋糕膨胀。",
            ),
            t("Eggs turning white is a separate example of a chemical change.", "鸡蛋变白是另一个化学变化的例子。"),
            t("The smell comes from toast, a different food.", "香味来自烤面包，是另一种食物。"),
          ],
        ),
        ask(
          t("Why does the author call a recipe a careful procedure?", "作者为什么把食谱称为严谨的步骤？"),
          t("It is tested until it gives the same result each time", "它经过反复测试，每次都得到相同结果"),
          [
            t("It must be cooked only in a real laboratory", "它只能在真正的实验室里烹饪"),
            t("It lists only physical changes and no chemical ones", "它只列出物理变化，没有化学变化"),
            t("It always uses as much baking powder as possible", "它总是尽量多放发酵粉"),
          ],
          t(
            "The fourth paragraph says a good recipe is tested again and again until the results are consistent, like a scientist's procedure.",
            "第四段说，好的食谱要反复测试，直到结果一致，就像科学家的实验步骤。",
          ),
          [
            t("The kitchen is only called a laboratory, not a real one.", "厨房只是被比作实验室，不是真的实验室。"),
            t("Recipes use chemical changes on purpose, like rising cake.", "食谱会有意利用化学变化，比如蛋糕膨胀。"),
            t("Too much baking powder makes a bitter cake.", "发酵粉太多会让蛋糕发苦。"),
          ],
        ),
      ],
    ),
  ],
};
