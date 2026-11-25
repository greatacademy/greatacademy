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
          [
            ["A heavy metal is not a force. A force is a push or a pull.", "重金属不是力。力是推或拉。"],
            ["The shape of an object is something a force can change, not the force itself.", "物体的形状是力能改变的，不是力本身。"],
            ["Always seeing it is wrong. You cannot see a force, only what it does.", "总能看见不对。你看不见力，只能看见它的作用。"],
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
          [
            ["Making something disappear is not in the passage.", "让东西消失文中没有。"],
            [
              "Turning a ball into clay twists the clay example. Squeezing only changes its shape.",
              "把球变成黏土把例子理解歪了。挤压只是改变形状。",
            ],
            ["Stopping gravity is not something the passage says a force can do.", "阻止重力文中没说力能做到。"],
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
          [
            ["Pushing upward is wrong. Gravity pulls things toward the ground.", "向上推不对。重力把东西往地面拉。"],
            ["Working only on doors is wrong. Gravity pulls everything.", "只对门起作用不对。重力拉所有东西。"],
            ["Needing a hand is backwards. Gravity works without touching.", "需要用手是反的。重力不用接触就起作用。"],
          ],
        ),
        ask(
          ["Why does a dropped apple fall and not float away?", "掉落的苹果为什么会落下而不会飘走？"],
          ["Gravity pulls everything toward the ground", "重力把一切拉向地面"],
          [
            ["The wind pushes it down", "风把它往下吹"],
            ["Your hand pushes it", "你的手推了它"],
            ["Apples are too heavy to float", "苹果太重，飘不起来"],
          ],
          ["Gravity pulls everything toward the ground, which is why a dropped apple falls.", "重力把一切拉向地面，所以掉落的苹果会落下。"],
          [
            ["The wind is not the reason given.", "风不是文中给的原因。"],
            ["Your hand only dropped it. It did not push it down.", "你的手只是松开了它，没有往下推。"],
            ["Being too heavy to float is not the passage's reason.", "太重浮不起来不是文中的原因。"],
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
          [
            ["Slowly starting to roll is wrong. It needs a force to move.", "慢慢滚起来不对。它需要力才能动。"],
            ["Rolling in a straight line is what a moving ball does.", "沿直线滚是运动中的球才会做的。"],
            ["Sinking into the grass is not in the passage.", "陷进草里文中没有。"],
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
          [
            ["Smaller wheels are not in the passage.", "轮子更小文中没有。"],
            ["A rougher floor is not the reason given.", "地面更粗糙不是文中给的原因。"],
            ["Gravity pulling empty carts is not in the passage.", "重力拉空车文中没有。"],
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
          [
            ["Making the car stop more slowly is not what the belt does.", "让车停得更慢不是安全带的作用。"],
            ["Pushing the car forward is wrong. The belt holds you back.", "把车往前推不对。安全带是把你往后拉住。"],
            ["Stopping gravity is not in the passage.", "阻止重力文中没有。"],
          ],
        ),
        ask(
          ["What happens when you kick a ball hard instead of tapping it?", "用力踢球而不是轻轻碰它，会怎样？"],
          ["It shoots across the field", "它飞快地穿过球场"],
          [
            ["It rolls only a little way", "它只滚一小段"],
            ["It stays still", "它一动不动"],
            ["It gets heavier", "它变得更重"],
          ],
          [
            "If you kick it hard, it shoots across the field, because a strong push gives more speed.",
            "如果用力踢，它会飞快地穿过球场，因为大的推力给它更大的速度。",
          ],
          [
            ["Rolling a little way is what a gentle tap does.", "只滚一点点是轻轻一碰的结果。"],
            ["Staying still is wrong. A kick is a strong force.", "不动不对。踢是很大的力。"],
            ["Getting heavier is not in the passage.", "变重文中没有。"],
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
          [
            ["Someone grabbing it is wrong. The passage says nobody grabbed it.", "有人抓住它不对。文中说没人抓它。"],
            ["The carpet pushing it upward is not in the passage.", "地毯把它往上推文中没有。"],
            ["Gravity stopping on carpets is wrong. Gravity always works.", "重力在地毯上失效不对。重力一直在起作用。"],
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
          [
            ["Sandpaper is rough, so it makes a lot of friction.", "砂纸很粗糙，摩擦力很大。"],
            ["A gravel path is rough and makes a lot of friction.", "碎石路粗糙，摩擦力很大。"],
            ["A carpet is rough. The ball stops quickly on it.", "地毯粗糙。球在上面很快停下。"],
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
          [
            ["Tires lasting forever is wrong. Friction wears them out.", "轮胎永远不坏不对。摩擦会磨损轮胎。"],
            ["Keeping parts cold is backwards. Friction makes them hot.", "让零件保持凉爽是反的。摩擦让它们发热。"],
            ["Going faster downhill is not how friction helps. It slows things down.", "下坡更快不是摩擦的帮助。它让东西变慢。"],
          ],
        ),
        ask(
          ["Why do people put oil on the parts of machines?", "人们为什么给机器零件上油？"],
          ["To help the parts slide", "帮助零件滑动"],
          [
            ["To make the parts heavier", "让零件更重"],
            ["To make more friction", "产生更多摩擦"],
            ["To make the parts shine", "让零件发亮"],
          ],
          [
            "Friction makes the parts of machines hot, so people put oil on them to help the parts slide.",
            "摩擦让机器零件发热，所以人们给零件上油，帮助它们滑动。",
          ],
          [
            ["Making parts heavier is not in the passage.", "让零件更重文中没有。"],
            ["More friction is backwards. Oil reduces it.", "增加摩擦是反的。油是减少摩擦的。"],
            ["Making parts shine is not the reason given.", "让零件发亮不是文中给的原因。"],
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
          [
            ["Stopping at the top is wrong. The car raced down.", "停在顶上不对。车冲了下来。"],
            ["A shorter way is backwards. It rolled much farther.", "滚得更短是反的。它滚得远多了。"],
            ["Falling off the side is not in the passage.", "从旁边掉下来文中没有。"],
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
          [
            ["The rug being steeper is wrong. The rug is on the floor, not the ramp.", "地毯更陡不对。地毯铺在地上，不是坡道。"],
            ["Mei pushing backward is wrong. She never pushed it.", "美推车往后不对。她从不推车。"],
            ["Pulling like a magnet is not in the passage.", "像磁铁一样拉文中没有。"],
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
          [
            ["A new car each time is wrong. She used the same car.", "每次换新车不对。她用的是同一辆车。"],
            ["Pushing harder each time is wrong. She did not push at all.", "每次推得更用力不对。她根本不推。"],
            ["Asking her brother to guess is not how she kept it fair.", "让弟弟猜不是她保证公平的办法。"],
          ],
        ),
        ask(
          ["What did Mei and her brother first make the ramp from?", "梅和哥哥一开始用什么搭斜坡？"],
          ["A board and two books", "一块木板和两本书"],
          [
            ["A box and a rug", "一个箱子和一块地毯"],
            ["Two chairs", "两把椅子"],
            ["A wheelchair ramp", "一个轮椅坡道"],
          ],
          ["First they made a ramp from a board and two books.", "他们先用一块木板和两本书搭了一个斜坡。"],
          [
            ["A box and a rug is wrong. The rug was at the bottom later.", "箱子和地毯不对。地毯是后来放在坡底的。"],
            ["Two chairs are not in the passage.", "两把椅子文中没有。"],
            ["A wheelchair ramp is a real-life use at the end.", "轮椅坡道是文末说的生活中的用途。"],
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
          [
            ["Breaking in the middle is not in the passage.", "从中间断开文中没有。"],
            ["Moving toward the left team happens only if that team pulls harder.", "向左边那队移动要那队拉得更用力才会发生。"],
            ["Both teams falling is not in the passage.", "两队都摔倒文中没有。"],
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
          [
            ["Always straight up is not in the passage.", "总是向上文中没有。"],
            ["The smaller force is the wrong way. It moves toward the bigger one.", "较小的力方向错了。它朝较大的力移动。"],
            ["Not moving at all is what balanced forces do.", "完全不动是平衡力的结果。"],
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
          [
            ["No forces at all is wrong. Gravity and the table both act on it.", "完全没有力不对。重力和桌子都作用在它上面。"],
            ["Being too heavy is not the reason given.", "太重不是文中给的原因。"],
            ["Friction pulling it to the edge is not in the passage.", "摩擦把它拉到桌边文中没有。"],
          ],
        ),
        ask(
          ["Why does a book soon stop after you stop pushing it?", "你停止推书后，书为什么很快停下？"],
          ["Friction is the only force left", "只剩下摩擦力"],
          [
            ["Gravity pushes it back", "重力把它推回去"],
            ["The table pulls it", "桌子拉住了它"],
            ["The forces are still balanced", "力仍然是平衡的"],
          ],
          [
            "When you stop pushing, friction is the only force left, and the book soon stops.",
            "你停止推时，只剩下摩擦力，书很快就停下了。",
          ],
          [
            ["Gravity pushing it back is wrong. Gravity pulls down.", "重力把它往回推不对。重力是向下拉。"],
            ["The table pulling it is not in the passage.", "桌子拉它文中没有。"],
            ["Still balanced is wrong. Only friction is left, so they are unbalanced.", "仍然平衡不对。只剩摩擦力，所以力不平衡。"],
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
          [
            ["A wooden spoon is wood, which magnets do not attract.", "木勺是木头，磁铁吸不住。"],
            ["A plastic cup is plastic, which magnets do not attract.", "塑料杯是塑料，磁铁吸不住。"],
            ["A glass marble is glass, which magnets do not attract.", "玻璃珠是玻璃，磁铁吸不住。"],
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
          [
            ["A field in the ground mixes up the word field.", "地里的田把field这个词理解错了。"],
            ["Paper with iron on it is how you see the field, not the field itself.", "撒了铁屑的纸是看磁场的方法，不是磁场本身。"],
            ["The metal a magnet is made of is not its field.", "磁铁的材料不是它的磁场。"],
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
          [
            ["Shining a light is not in the passage. The field is invisible.", "用光照文中没有。磁场是看不见的。"],
            ["Painting the magnet is not in the passage.", "给磁铁涂色文中没有。"],
            ["Dropping it into water is not in the passage.", "把它扔进水里文中没有。"],
          ],
        ),
        ask(
          ["How can a magnet hold a drawing to the refrigerator?", "磁铁怎样把画固定在冰箱上？"],
          ["Its pull can pass through a sheet of paper", "它的吸力能穿过一张纸"],
          [
            ["It is sticky like glue", "它像胶水一样黏"],
            ["It attracts paper", "它吸引纸"],
            ["The drawing is made of iron", "画是铁做的"],
          ],
          [
            "A magnet's pull can pass through some materials, so it can hold a drawing through a sheet of paper.",
            "磁铁的吸力能穿过一些材料，所以它能隔着一张纸把画固定住。",
          ],
          [
            ["Being sticky like glue is wrong. It pulls without glue.", "像胶水一样黏不对。它不用胶就能吸住。"],
            ["Attracting paper is wrong. Magnets do not attract paper.", "吸纸不对。磁铁不吸纸。"],
            ["The drawing being iron is wrong. Its pull goes through the paper.", "画是铁做的不对。它的吸力穿过了纸。"],
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
          [
            ["The middle is where very few clips stick.", "中间只粘着很少的回形针。"],
            ["Only the north pole is wrong. Both ends pull strongly.", "只有北极不对。两端吸力都很强。"],
            ["Being painted red is not in the passage.", "涂成红色文中没有。"],
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
          [
            ["Snapping together is what opposite poles do.", "吸在一起是异极的情况。"],
            ["Turning into south poles is not in the passage.", "变成南极文中没有。"],
            ["Nothing happening is wrong. You can feel them fight back.", "什么也不发生不对。你能感到它们在反抗。"],
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
          [
            ["Sailors turning it by hand is wrong. It swings by itself.", "水手用手转不对。它自己会转。"],
            ["The sea pulling it is not in the passage.", "大海拉它文中没有。"],
            ["Cutting in half is about bar magnets, not why a compass points north.", "切成两半说的是条形磁铁，不是指南针指北的原因。"],
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
          [
            ["Holding notes is another use, not why the edge has a magnet.", "吸住便条是另一种用途，不是门边装磁铁的原因。"],
            ["Keeping food from moving is not in the passage.", "让食物不动文中没有。"],
            ["Making the door easier to break is not in the passage.", "让门更容易坏文中没有。"],
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
          [
            ["The aluminum cans are left behind, not lifted.", "铝罐是留下的，不是被吸起来的。"],
            ["Crushing cans is not in the passage.", "压扁罐子文中没有。"],
            ["Washing cans is not in the passage.", "清洗罐子文中没有。"],
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
          [
            ["Attracting aluminum is wrong. Aluminum cans stay behind.", "吸铝不对。铝罐被留下了。"],
            ["Having no poles is not in the passage.", "没有磁极文中没有。"],
            ["Wood and wire is wrong. It is wire around iron.", "木头和电线不对。它是铁上绕电线。"],
          ],
        ),
      ],
    ),
  ],
};
