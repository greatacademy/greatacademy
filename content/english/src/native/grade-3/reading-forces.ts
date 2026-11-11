// Grade 3: the reading unit of the theme of forces and magnets: pushes and pulls, starting and stopping, friction,
// ramps, balanced forces, magnets, poles and magnets at work.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, clues, passage, words } from "./reading-kit.ts";

const forces = words("words-of-forces-and-motion");
const magnets = words("words-of-magnets");
const explaining = words("words-for-explaining-how");

/** pushesPullsAndMagnets is the reading unit of grade 3 on forces, motion and magnets. */
export const pushesPullsAndMagnets: ReadingUnitDef = {
  id: "pushes-pulls-and-magnets",
  title: t("Pushes, Pulls and Magnets", "推、拉和磁铁"),
  passages: [
    passage(
      "what-is-a-force",
      t("What Is a Force?", "什么是力？"),
      `Every time you kick a ball, open a door or lift a backpack, you are using a force. A force is a push or a pull. When you push something, you move it away from you. When you pull something, you bring it toward you.

You cannot see a force, but you can see what it does. A force can make a still object start to move. It can make a moving object go faster or slower. It can change the direction something is moving in, like when a player kicks a rolling ball toward the goal. A force can even change the shape of an object, like when you squeeze a lump of clay.

Some forces need to touch an object to work. Your hand must touch the door to push it open. Other forces can work from far away. Gravity is a pull that works without touching. It pulls everything toward the ground, which is why a dropped apple falls and does not float away.

Forces are all around us. Without them, nothing in the world would ever move.`,
      [clues, forces],
      [
        ask(
          ["What is a force?", "什么是力？"],
          ["A push or a pull", "一种推或拉"],
          [
            ["A kind of heavy metal", "一种很重的金属"],
            ["The shape of an object", "一个物体的形状"],
            ["Something you can always see", "一种你总能看见的东西"],
          ],
          [
            "The first paragraph says that a force is a push or a pull, and gives kicking and lifting as examples.",
            "第一段说，力就是推或拉，还举了踢球和提书包的例子。",
          ],
        ),
        ask(
          ["Which of these is something a force can do?", "下面哪一项是力能做到的？"],
          ["Change the direction a moving object goes", "改变运动物体的方向"],
          [
            ["Make an object disappear", "让一个物体消失"],
            ["Turn a ball into clay", "把一个球变成黏土"],
            ["Stop gravity from working", "让重力不起作用"],
          ],
          [
            "The second paragraph says a force can change the direction something is moving in, like a kick that sends a rolling ball toward the goal.",
            "第二段说，力能改变物体运动的方向，比如一脚把滚动的球踢向球门。",
          ],
        ),
        ask(
          ["How is gravity different from the push of your hand on a door?", "重力和你用手推门有什么不同？"],
          ["Gravity works without touching the object", "重力不用接触物体就能起作用"],
          [
            ["Gravity only pushes things upward", "重力只会把东西往上推"],
            ["Gravity works only on doors", "重力只对门起作用"],
            ["Gravity needs a hand to start it", "重力要用手才能启动"],
          ],
          [
            "The third paragraph says your hand must touch the door, but gravity is a pull that works without touching.",
            "第三段说，你的手必须碰到门，而重力是一种不用接触就能起作用的拉力。",
          ],
        ),
      ],
    ),
    passage(
      "starting-and-stopping",
      t("Starting and Stopping", "开始和停止"),
      `Imagine a ball sitting on the grass. It will stay there all day unless something pushes or pulls it. Objects that are still stay still until a force makes them move.

Now imagine the ball rolling across a smooth floor. It keeps rolling in a straight line until something slows it down, stops it or turns it. Objects that are moving keep moving until a force changes their motion.

The stronger the force, the bigger the change. If you tap a ball gently with your foot, it rolls a little way. If you kick it hard, it shoots across the field. A strong push gives an object more speed than a weak one.

Heavy objects need more force to start and stop than light ones. It is easy to push an empty shopping cart, but a full one takes a much harder push. Once the full cart is rolling, it is also harder to stop.

That is why seat belts matter. When a car stops suddenly, your body keeps moving forward. The seat belt is the force that holds you back and keeps you safe in your seat.`,
      [clues, forces, explaining],
      [
        ask(
          ["What happens to a ball sitting on the grass if nothing pushes or pulls it?", "如果没有东西推或拉，草地上的球会怎样？"],
          ["It stays still", "它会一直停在那里"],
          [
            ["It slowly starts to roll", "它会慢慢开始滚动"],
            ["It rolls in a straight line", "它会沿直线滚动"],
            ["It sinks into the grass", "它会陷进草里"],
          ],
          [
            "The first paragraph says the ball will stay there all day unless something pushes or pulls it.",
            "第一段说，除非有东西推它或拉它，那个球会在那里待一整天。",
          ],
        ),
        ask(
          ["Why is a full shopping cart harder to push than an empty one?", "为什么装满东西的购物车比空车难推？"],
          ["Heavy objects need more force to start moving", "重的物体需要更大的力才能动起来"],
          [
            ["Full carts have smaller wheels", "装满的购物车轮子更小"],
            ["The floor is rougher under full carts", "满车下面的地面更粗糙"],
            ["Empty carts are pulled by gravity", "空车被重力拉着走"],
          ],
          [
            "The fourth paragraph says heavy objects need more force to start and stop than light ones, like a full cart.",
            "第四段说，重的物体比轻的物体需要更大的力才能开始运动和停下来，比如装满的购物车。",
          ],
        ),
        ask(
          ["Why does a seat belt keep you safe when a car stops suddenly?", "汽车突然停下时，安全带为什么能保护你？"],
          ["It holds back your body, which keeps moving forward", "它拉住你还在往前冲的身体"],
          [
            ["It makes the car stop more slowly", "它让汽车停得更慢"],
            ["It pushes the car forward", "它把汽车往前推"],
            ["It stops gravity from pulling you", "它让重力拉不动你"],
          ],
          [
            "The last paragraph says your body keeps moving forward, and the seat belt is the force that holds you back.",
            "最后一段说，你的身体会继续往前冲，安全带就是把你拉回来的力。",
          ],
        ),
      ],
    ),
    passage(
      "friction-slows-things-down",
      t("Friction Slows Things Down", "摩擦力让东西慢下来"),
      `If you roll a ball across a carpet, it soon stops. But why? Nobody grabbed it. The answer is a force called friction.

Friction happens when two surfaces rub against each other. It always works against motion, so it slows moving things down. Rough surfaces, like carpet, sandpaper or a gravel path, make a lot of friction. Smooth surfaces, like ice or a polished floor, make very little. That is why a ball rolls much farther on a wooden floor than on a carpet, and why it is easy to slip on ice.

Friction can be a problem. It wears out the soles of your shoes and the tires of a bike. It also makes the parts of machines hot, so people put oil on them to help the parts slide.

But friction is also useful. Without it, you could not walk, because your feet would slide out from under you. The brakes on a bike use friction to stop the wheels. Even the pencil in your hand needs friction to leave a mark on paper.

Next time you rub your hands together on a cold day, feel the warmth. That is friction at work.`,
      [clues, forces, explaining],
      [
        ask(
          ["Why does a ball rolling across a carpet soon stop?", "为什么在地毯上滚动的球很快就停下了？"],
          ["Friction between the ball and the carpet slows it down", "球和地毯之间的摩擦力让它慢下来"],
          [
            ["Someone grabs the ball", "有人抓住了球"],
            ["The carpet pushes the ball upward", "地毯把球往上推"],
            ["Gravity stops working on carpets", "重力在地毯上不起作用"],
          ],
          [
            "The first two paragraphs say friction works against motion and that rough surfaces like carpet make a lot of it.",
            "前两段说，摩擦力总是阻碍运动，而像地毯这样粗糙的表面摩擦力很大。",
          ],
        ),
        ask(
          ["Which surface makes the least friction?", "哪种表面的摩擦力最小？"],
          ["Ice", "冰面"],
          [
            ["Sandpaper", "砂纸"],
            ["A gravel path", "碎石路"],
            ["A carpet", "地毯"],
          ],
          [
            "The second paragraph says smooth surfaces like ice make very little friction, which is why it is easy to slip on ice.",
            "第二段说，像冰这样光滑的表面摩擦力很小，所以在冰上很容易滑倒。",
          ],
        ),
        ask(
          ["How is friction useful when you ride a bike?", "骑自行车时，摩擦力有什么用？"],
          ["The brakes use it to stop the wheels", "刹车靠它让车轮停下来"],
          [
            ["It makes the tires last forever", "它让轮胎永远用不坏"],
            ["It keeps the parts of the bike cold", "它让自行车的零件保持冰凉"],
            ["It makes the bike go faster downhill", "它让自行车下坡时跑得更快"],
          ],
          [
            "The fourth paragraph says the brakes on a bike use friction to stop the wheels.",
            "第四段说，自行车的刹车利用摩擦力让车轮停下来。",
          ],
        ),
      ],
    ),
    passage(
      "ramps-and-rolling",
      t("Ramps and Rolling", "斜坡和滚动"),
      `A ramp is a flat surface with one end higher than the other. When you set a toy car at the top of a ramp and let go, gravity pulls it down, and it rolls.

Mei and her brother wanted to know what makes a car roll farther. First they made a ramp from a board and two books. They let the car go from the top and measured how far it rolled across the floor. Then they added two more books to make the ramp steeper. This time the car raced down faster and rolled much farther. A steeper ramp gave the car more speed.

Next they tried different floors at the bottom of the ramp. On the kitchen tiles, the car rolled a long way. On the rug in the hall, it stopped quickly. The rough rug made more friction.

Mei was careful to keep the test fair. Each time, she used the same car and let it go from the same spot without pushing it. She changed only one thing at a time, so she knew what made the difference.

Ramps are useful in real life too. A ramp makes it easier to roll a heavy box or a wheelchair up to a door.`,
      [clues, forces, explaining],
      [
        ask(
          ["What happened when Mei and her brother made the ramp steeper?", "梅和弟弟把斜坡弄得更陡以后发生了什么？"],
          ["The car went faster and rolled much farther", "小车跑得更快，滚得更远了"],
          [
            ["The car stopped at the top of the ramp", "小车停在了斜坡顶上"],
            ["The car rolled a shorter way", "小车滚的距离更短了"],
            ["The car fell off the side of the ramp", "小车从斜坡旁边掉了下去"],
          ],
          [
            "The second paragraph says that with a steeper ramp the car raced down faster and rolled much farther.",
            "第二段说，斜坡更陡时，小车冲下来更快，滚得也远得多。",
          ],
        ),
        ask(
          ["Why did the car stop quickly on the rug?", "为什么小车在地毯上很快就停了？"],
          ["The rough rug made more friction", "粗糙的地毯产生了更大的摩擦力"],
          [
            ["The rug was steeper than the tiles", "地毯比瓷砖更陡"],
            ["Mei pushed the car backward", "梅把小车往回推"],
            ["The rug pulled the car like a magnet", "地毯像磁铁一样吸住了小车"],
          ],
          [
            "The third paragraph says the car stopped quickly on the rug because the rough rug made more friction.",
            "第三段说，小车在地毯上很快停下，是因为粗糙的地毯摩擦力更大。",
          ],
        ),
        ask(
          ["How did Mei keep the test fair?", "梅是怎样让试验保持公平的？"],
          ["She changed only one thing at a time", "她每次只改变一样东西"],
          [
            ["She used a new car each time", "她每次都换一辆新车"],
            ["She pushed the car harder each time", "她每次都把车推得更用力"],
            ["She asked her brother to guess", "她让弟弟去猜"],
          ],
          [
            "The fourth paragraph says Mei used the same car from the same spot and changed only one thing at a time.",
            "第四段说，梅用同一辆车从同一个地方出发，每次只改变一样东西。",
          ],
        ),
      ],
      ["Mei"],
    ),
    passage(
      "balanced-and-unbalanced-forces",
      t("Balanced and Unbalanced Forces", "平衡力和不平衡力"),
      `Most of the time, more than one force is acting on an object. What happens next depends on whether those forces are balanced or unbalanced.

Think of a game of tug of war. Two teams pull on a rope in opposite directions. If both teams pull with the same strength, the rope does not move. The forces are balanced. They cancel each other out, and the motion does not change.

Now imagine one team pulls harder. The rope starts to slide toward the stronger team. The forces are unbalanced, and the object moves in the direction of the bigger force.

Balanced forces are everywhere, even when nothing seems to be happening. A book lying on a table is being pulled down by gravity. At the same time, the table pushes up on the book with an equal force. Because the two forces are balanced, the book stays still.

If you push the book across the table, your push is bigger than the friction holding it back. The forces become unbalanced, and the book slides. When you stop pushing, friction is the only force left, and the book soon stops.`,
      [clues, forces, explaining],
      [
        ask(
          ["In tug of war, what happens when both teams pull with the same strength?", "拔河时，如果两队用一样大的力拉，会怎样？"],
          ["The rope does not move", "绳子不会移动"],
          [
            ["The rope breaks in the middle", "绳子从中间断了"],
            ["The rope moves toward the left team", "绳子向左边的队移动"],
            ["Both teams fall down", "两队都摔倒了"],
          ],
          [
            "The second paragraph says that if both teams pull with the same strength, the rope does not move because the forces are balanced.",
            "第二段说，如果两队用一样大的力拉，绳子不会动，因为力是平衡的。",
          ],
        ),
        ask(
          ["Which way does an object move when the forces on it are unbalanced?", "物体受到不平衡的力时，会往哪个方向移动？"],
          ["In the direction of the bigger force", "朝着较大的那个力的方向"],
          [
            ["Always straight up", "总是笔直向上"],
            ["In the direction of the smaller force", "朝着较小的那个力的方向"],
            ["It does not move at all", "它根本不动"],
          ],
          [
            "The third paragraph says that when the forces are unbalanced, the object moves in the direction of the bigger force.",
            "第三段说，力不平衡时，物体会朝较大的那个力的方向移动。",
          ],
        ),
        ask(
          ["Why does a book lying on a table stay still?", "为什么放在桌上的书能保持不动？"],
          ["Gravity pulls it down and the table pushes up equally", "重力向下拉它，桌子以同样大的力向上推它"],
          [
            ["There are no forces on it at all", "它根本没有受到任何力"],
            ["The book is too heavy to move", "书太重了，动不了"],
            ["Friction pulls it toward the edge", "摩擦力把它拉向桌边"],
          ],
          [
            "The fourth paragraph says gravity pulls the book down while the table pushes up with an equal force, so the forces are balanced.",
            "第四段说，重力把书往下拉，桌子用同样大的力往上推，所以这两个力是平衡的。",
          ],
        ),
      ],
    ),
    passage(
      "how-magnets-work",
      t("How Magnets Work", "磁铁是怎样起作用的"),
      `A magnet is an object that can pull certain metals toward it without touching them. If you hold a magnet near a paper clip, the clip jumps across the gap and sticks to it. This pull is called magnetism.

Magnets do not attract everything. They pull on iron and steel, and on a few other metals such as nickel. But they do not attract wood, plastic, glass, paper, or even most coins and soda cans. You can test this yourself by moving a magnet over a pile of objects and seeing which ones stick.

The space around a magnet where its pull can be felt is called its magnetic field. The field is invisible, but you can see its shape. Lay a sheet of paper over a magnet and sprinkle tiny bits of iron on top. The bits line up in curved patterns that show where the field is.

A magnet's pull can even pass through some materials. A magnet can hold a drawing to the refrigerator through a sheet of paper. It can also move a paper clip through a thin table if you slide the magnet underneath.`,
      [clues, magnets, explaining],
      [
        ask(
          ["Which of these would a magnet attract?", "磁铁会吸住下面哪一样东西？"],
          ["A steel paper clip", "一枚钢做的回形针"],
          [
            ["A wooden spoon", "一把木勺子"],
            ["A plastic cup", "一个塑料杯"],
            ["A glass marble", "一颗玻璃弹珠"],
          ],
          [
            "The second paragraph says magnets pull on iron and steel, but not on wood, plastic or glass.",
            "第二段说，磁铁会吸铁和钢，但不会吸木头、塑料或玻璃。",
          ],
        ),
        ask(
          ["What is a magnetic field?", "什么是磁场？"],
          ["The space around a magnet where its pull can be felt", "磁铁周围能感受到它吸力的空间"],
          [
            ["A field where magnets are found in the ground", "地里埋着磁铁的一块田"],
            ["A sheet of paper with iron on it", "一张撒了铁屑的纸"],
            ["The metal a magnet is made of", "做磁铁用的金属"],
          ],
          [
            "The third paragraph says the space around a magnet where its pull can be felt is called its magnetic field.",
            "第三段说，磁铁周围能感受到吸力的空间叫作磁场。",
          ],
        ),
        ask(
          ["How can you see the shape of a magnetic field?", "怎样才能看到磁场的形状？"],
          ["Sprinkle tiny bits of iron on paper over a magnet", "在盖住磁铁的纸上撒细小的铁屑"],
          [
            ["Shine a light on the magnet", "用灯照着磁铁"],
            ["Paint the magnet a bright color", "把磁铁涂成鲜艳的颜色"],
            ["Drop the magnet into water", "把磁铁丢进水里"],
          ],
          [
            "The third paragraph says that tiny bits of iron sprinkled on paper over a magnet line up in curved patterns that show where the field is.",
            "第三段说，撒在磁铁上方纸上的细小铁屑会排成弯弯的图案，显示出磁场在哪里。",
          ],
        ),
      ],
    ),
    passage(
      "poles-that-push-and-pull",
      t("Poles That Push and Pull", "会推也会拉的磁极"),
      `Every magnet has two ends called poles. One is the north pole, and the other is the south pole. The pull of a magnet is strongest at its poles. If you dip a bar magnet into a box of paper clips, most of the clips cling to the two ends, and very few stick to the middle.

When you bring two magnets together, something surprising happens. If you hold the north pole of one magnet near the south pole of another, they snap together. Opposite poles attract. But if you hold two north poles together, they push each other away. Try to press them together and you can feel them fight back. Like poles repel. Two south poles repel too.

If you cut a bar magnet in half, you do not get one north piece and one south piece. Each half becomes a new, smaller magnet with a north pole and a south pole of its own.

The Earth itself acts like a giant magnet. That is why the needle of a compass, which is a tiny magnet, always swings to point north. For hundreds of years, sailors have used compasses to find their way across the sea.`,
      [clues, magnets, explaining],
      [
        ask(
          ["Where is the pull of a magnet strongest?", "磁铁的吸力在哪里最强？"],
          ["At its two poles", "在它的两个磁极"],
          [
            ["In its middle", "在它的中间"],
            ["Only at its north pole", "只在它的北极"],
            ["Wherever it is painted red", "在涂成红色的地方"],
          ],
          [
            "The first paragraph says the pull of a magnet is strongest at its poles, so most paper clips cling to the two ends.",
            "第一段说，磁铁的吸力在两极最强，所以大多数回形针都吸在两端。",
          ],
        ),
        ask(
          ["What happens when you hold two north poles together?", "把两个北极放在一起会怎样？"],
          ["They push each other away", "它们会互相推开"],
          [
            ["They snap together", "它们会啪地吸在一起"],
            ["They both turn into south poles", "它们都变成了南极"],
            ["Nothing at all happens", "什么也不会发生"],
          ],
          [
            "The second paragraph says that two north poles push each other away, because like poles repel.",
            "第二段说，两个北极会互相推开，因为同极相斥。",
          ],
        ),
        ask(
          ["Why does a compass needle point north?", "为什么指南针的指针会指向北方？"],
          ["The Earth acts like a giant magnet", "地球就像一块巨大的磁铁"],
          [
            ["Sailors turn it by hand", "水手们用手转动它"],
            ["The sea pulls it north", "大海把它往北拉"],
            ["It is cut in half", "它被切成了两半"],
          ],
          [
            "The last paragraph says the Earth acts like a giant magnet, which is why a compass needle always swings to point north.",
            "最后一段说，地球就像一块巨大的磁铁，所以指南针的指针总是转向北方。",
          ],
        ),
      ],
      ["Earth"],
    ),
    passage(
      "magnets-at-work",
      t("Magnets at Work", "工作中的磁铁"),
      `Magnets are not just toys. People use them every day, often without knowing it.

Look at your refrigerator door. A strip of soft magnet runs around its edge and pulls the door tightly shut, so the cold air stays inside. Many cupboard doors and bags close with small magnets too. Magnets hold notes and drawings on refrigerators and whiteboards.

In a recycling center, cans of every kind arrive mixed together. A giant magnet swings over the pile and lifts the steel cans out, leaving the aluminum cans behind. This makes it easy to sort the metals so each kind can be reused.

Some magnets can be switched on and off. An electromagnet is made by wrapping wire around a piece of iron. When electricity flows through the wire, the iron becomes a strong magnet. When the electricity stops, the magnet lets go. Cranes in scrapyards use electromagnets to lift old cars and drop them where they are needed.

Magnets also work inside things you cannot see, such as speakers, headphones and electric motors. In some countries, fast trains even float above the track on magnets, so there is almost no friction to slow them down.`,
      [clues, magnets, explaining],
      [
        ask(
          ["Why does a refrigerator door have a magnet around its edge?", "为什么冰箱门的边上有一圈磁铁？"],
          ["To pull the door tightly shut and keep the cold air in", "为了把门紧紧吸住，不让冷气跑出来"],
          [
            ["To hold notes and drawings on it", "为了在上面贴便条和图画"],
            ["To keep the food from moving", "为了让食物不乱动"],
            ["To make the door easier to break", "为了让门更容易坏"],
          ],
          [
            "The second paragraph says a strip of magnet pulls the refrigerator door tightly shut, so the cold air stays inside.",
            "第二段说，冰箱门边的磁条把门紧紧吸住，冷气就不会跑出来。",
          ],
        ),
        ask(
          ["How does a recycling center use a giant magnet?", "回收站怎样使用巨大的磁铁？"],
          ["It lifts the steel cans out of the pile", "它把钢罐从一堆罐子里吸出来"],
          [
            ["It lifts the aluminum cans out of the pile", "它把铝罐从一堆罐子里吸出来"],
            ["It crushes the cans flat", "它把罐子压扁"],
            ["It washes the cans clean", "它把罐子洗干净"],
          ],
          [
            "The third paragraph says the giant magnet lifts the steel cans out and leaves the aluminum cans behind.",
            "第三段说，巨大的磁铁把钢罐吸出来，把铝罐留在原处。",
          ],
        ),
        ask(
          ["What makes an electromagnet different from an ordinary magnet?", "电磁铁和普通磁铁有什么不同？"],
          ["It can be switched on and off with electricity", "它可以用电打开和关上"],
          [
            ["It only attracts aluminum", "它只吸铝"],
            ["It has no poles at all", "它根本没有磁极"],
            ["It is made of wood and wire", "它是用木头和电线做的"],
          ],
          [
            "The fourth paragraph says an electromagnet becomes a magnet when electricity flows through its wire and lets go when the electricity stops.",
            "第四段说，电流通过电线时电磁铁就变成磁铁，电流停止时它就松开。",
          ],
        ),
      ],
    ),
  ],
};
