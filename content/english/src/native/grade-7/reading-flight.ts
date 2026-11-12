// Grade 7: the reading unit of the ninth theme, flight, from the forces on a wing and the first balloons to the
// Wright brothers, the pilots who followed them and the systems that keep flying safe.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const flightWords = { topic: "words-of-flight", weight: 0.3 } as const;
const pilotWords = { topic: "words-of-pilots-and-airports", weight: 0.3 } as const;
const trialWords = { topic: "words-of-trial-and-error", weight: 0.3 } as const;
const diagrams = { topic: "integrating-text-and-diagrams", weight: 0.2 } as const;
const scientificIdea = { topic: "tracing-a-scientific-idea-over-time", weight: 0.2 } as const;
const greek4 = { topic: "greek-roots-4", weight: 0.1 } as const;
const academic1 = { topic: "academic-words-1", weight: 0.1 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;
const academic3 = { topic: "academic-words-3", weight: 0.1 } as const;

/** takingToTheAir is a reading unit of grade 7 on how flight works, how people learned to fly and how flying became safe. */
export const takingToTheAir: ReadingUnitDef = {
  id: "taking-to-the-air",
  title: t("Taking to the Air", "飞向天空"),
  passages: [
    passage(
      "four-forces-on-a-plane",
      t("Four Forces on a Plane", "飞机上的四种力"),
      `Picture a diagram of an airplane in level flight, seen from the side. Four arrows point away from it in four directions. Each arrow stands for a force, a push or a pull. Understanding these four forces is the first step to understanding how anything flies.

The arrow pointing down is weight. Weight is the pull of gravity on the plane, its passengers and its fuel. A large passenger jet can weigh more than three hundred tonnes when it takes off.

The arrow pointing up is lift. Lift is produced mainly by the wings as air flows over and under them. To stay in the air, a plane needs lift at least as great as its weight.

The arrow pointing forward is thrust. Thrust comes from the engines, which push air or hot gases backward so that the plane moves forward. On a small plane, a propeller does this job; on a jet, the engines blast a stream of hot gas out the back.

The arrow pointing backward is drag. Drag is the resistance of the air, which pushes against the plane as it moves. Engineers give planes smooth, narrow shapes to reduce drag, just as a swimmer streamlines their body to move through water.

In the diagram, the arrows are drawn the same length, because in steady, level flight the forces are balanced. Lift equals weight, so the plane neither climbs nor sinks, and thrust equals drag, so its speed stays the same. To climb, the pilot increases lift. To speed up, the pilot increases thrust. Every move a plane makes is a change in the balance of these four arrows.

The same forces act on a bird, a paper airplane and a rocket. Only the ways of producing them differ.`,
      [flightWords, diagrams],
      [
        ask(
          t("In the diagram, what does the arrow pointing backward stand for?", "图中指向后方的箭头代表什么？"),
          t("Drag, the resistance of the air", "阻力，即空气的阻碍"),
          [
            t("Thrust from the engines", "发动机的推力"),
            t("Weight from gravity", "重力造成的重量"),
            t("Lift from the wings", "机翼产生的升力"),
          ],
          t(
            "The fifth paragraph says the arrow pointing backward is drag, the resistance of the air pushing against the plane as it moves.",
            "第五段说指向后方的箭头是阻力，即飞机移动时空气对它的阻碍。",
          ),
        ),
        ask(
          t("Why are the four arrows in the diagram drawn the same length?", "为什么图中的四个箭头画得一样长？"),
          t("In steady, level flight, the forces are balanced", "在平稳的水平飞行中，各力保持平衡"),
          [
            t("All planes weigh the same amount", "所有飞机的重量都一样"),
            t("The diagram has no room for longer arrows", "图中没有空间画更长的箭头"),
            t("Lift is always greater than weight", "升力总是大于重量"),
          ],
          t(
            "The sixth paragraph says the arrows are the same length because in steady, level flight lift equals weight and thrust equals drag. The length of an arrow shows the size of a force.",
            "第六段说箭头一样长，是因为在平稳的水平飞行中升力等于重量，推力等于阻力。箭头的长度表示力的大小。",
          ),
        ),
        ask(
          t(
            "If the pilot wanted the plane to speed up, which arrow in the diagram would grow longer?",
            "如果飞行员想让飞机加速，图中哪个箭头会变长？",
          ),
          t("The forward arrow, thrust", "向前的箭头，即推力"),
          [
            t("The downward arrow, weight", "向下的箭头，即重量"),
            t("The backward arrow, drag", "向后的箭头，即阻力"),
            t("No arrow would change", "没有箭头会变化"),
          ],
          t(
            "The text says that to speed up, the pilot increases thrust. In the diagram, that means the forward arrow becomes longer than the backward arrow, drag.",
            "文中说要加速，飞行员会增大推力。在图中，这意味着向前的箭头变得比向后的阻力箭头更长。",
          ),
        ),
      ],
      [],
    ),
    passage(
      "how-a-wing-lifts",
      t("How a Wing Lifts", "机翼如何产生升力"),
      `If you have ever held your hand out of the window of a moving car, you have felt lift. Tilt your hand so the front edge points slightly up, and the air pushes your hand upward. A wing works in much the same way, though its shape makes it far more efficient.

Look at a diagram of a wing cut across from front to back, a shape called an airfoil. The front edge is thick and rounded, and the back edge is thin and sharp. The top surface is usually more curved than the bottom. The wing is also tilted slightly, with its front edge a little higher than its back. This tilt is called the angle of attack.

As the wing moves forward, it meets the air and turns it. Air flowing over the curved top follows the surface and leaves the back edge heading downward. Air hitting the tilted bottom is pushed downward too. In the diagram, this is shown by arrows behind the wing curving toward the ground. Because the wing pushes a great mass of air down, the air pushes the wing up. This follows one of Isaac Newton's laws: for every action, there is an equal and opposite reaction.

The same flow also changes the air pressure around the wing. The air moving over the top speeds up, and the pressure above the wing drops. Higher pressure below pushes up toward lower pressure above. Pressure and the downward push of air are two ways of describing the same lift.

You may have heard that air over the top must travel faster because it has to meet the air from the bottom at the back edge at the same moment. This popular explanation is wrong. Experiments show that air over the top actually arrives at the back edge well before the air from below.`,
      [flightWords, diagrams, scientificIdea],
      [
        ask(
          t("What is the angle of attack?", "什么是攻角？"),
          t("The slight tilt of the wing, with its front edge higher", "机翼轻微的倾斜，前缘较高"),
          [
            t("The curve of the top surface of the wing", "机翼上表面的弧度"),
            t("The speed at which a plane takes off", "飞机起飞时的速度"),
            t("The sharp back edge of the wing", "机翼尖锐的后缘"),
          ],
          t(
            "The second paragraph says the wing is tilted slightly, with its front edge a little higher than its back, and this tilt is called the angle of attack.",
            "第二段说机翼略微倾斜，前缘比后缘稍高，这种倾斜叫作攻角。",
          ),
        ),
        ask(
          t("In the diagram, what do the arrows curving toward the ground behind the wing show?", "图中机翼后方弯向地面的箭头表示什么？"),
          t("The air the wing has pushed downward", "被机翼向下推的空气"),
          [
            t("The weight of the plane", "飞机的重量"),
            t("The thrust of the engines", "发动机的推力"),
            t("Air traveling to meet at the back edge", "到后缘汇合的空气"),
          ],
          t(
            "The third paragraph says air leaves the back edge heading downward, and in the diagram this is shown by arrows behind the wing curving toward the ground.",
            "第三段说空气离开后缘时向下流动，在图中用机翼后方弯向地面的箭头表示。",
          ),
        ),
        ask(
          t("Why does the author describe the popular explanation in the last paragraph?", "作者为什么在最后一段描述那个流行的解释？"),
          t("To correct it, since experiments show it is wrong", "为了纠正它，因为实验表明它是错的"),
          [
            t("To give the true reason a wing lifts", "为了给出机翼产生升力的真正原因"),
            t("To agree with Isaac Newton", "为了赞同艾萨克·牛顿"),
            t("To explain the angle of attack", "为了解释攻角"),
          ],
          t(
            "The last paragraph calls the popular explanation wrong and gives the evidence: air over the top arrives at the back edge well before the air from below.",
            "最后一段称这个流行的解释是错的，并给出了证据：上方的空气比下方的空气早得多到达后缘。",
          ),
        ),
      ],
      ["Isaac", "Newton's"],
      ["airfoil"],
    ),
    passage(
      "a-sheep-a-duck-and-a-rooster",
      t("A Sheep, a Duck and a Rooster", "一只羊、一只鸭和一只公鸡"),
      `For thousands of years, people dreamed of flying. Some strapped feathered wings to their arms and jumped from towers, usually with painful results. The first people to actually rise into the sky did not copy birds at all. They used hot air.

Joseph and Étienne Montgolfier were brothers who ran a paper factory in France. According to a famous story, Joseph noticed that smoke and hot air from a fire made a cloth bag rise. The brothers began experimenting with larger and larger bags of paper and cloth, heated by fires underneath. They did not fully understand why the bags rose. Today we know that hot air is lighter than the same amount of cool air, so a bag full of hot air floats upward in the cooler air around it, the way a cork floats up in water.

In 1783, the brothers were invited to demonstrate their balloon for King Louis XVI at the palace of Versailles. No one knew whether living creatures could survive high in the air, so the first passengers were a sheep, a duck and a rooster. The balloon rose, drifted for about eight minutes and landed in a forest a few kilometers away. The animals were unharmed, though the story says the rooster had a hurt wing, perhaps from being kicked by the sheep.

Two months later, on November 21, 1783, two men made the first free flight by humans in a Montgolfier balloon. They floated over Paris for about twenty-five minutes, feeding the fire with straw to keep the air hot.

The balloon could not be steered; it went wherever the wind blew. But it had proved that people could leave the ground. The next challenge would be to control where they went.`,
      [flightWords, trialWords, scientificIdea],
      [
        ask(
          t("Why does a bag full of hot air rise?", "为什么装满热空气的袋子会上升？"),
          t("Hot air is lighter than the same amount of cool air", "热空气比同样多的冷空气轻"),
          [
            t("Smoke pushes the bag up from below", "烟从下面把袋子往上推"),
            t("Paper and cloth are lighter than air", "纸和布比空气轻"),
            t("The wind blows it upward", "风把它吹上去"),
          ],
          t(
            "The second paragraph explains that hot air is lighter than the same amount of cool air, so the bag floats upward like a cork in water.",
            "第二段解释说热空气比同样多的冷空气轻，所以袋子会像水中的软木塞一样向上浮起。",
          ),
        ),
        ask(
          t("Why were animals the first passengers?", "为什么第一批乘客是动物？"),
          t("No one knew whether living creatures could survive high in the air", "没有人知道生物能否在高空中存活"),
          [
            t("The king wanted to see them fly", "国王想看它们飞"),
            t("The balloon was too small for a person", "气球太小，装不下人"),
            t("Animals could help steer the balloon", "动物可以帮助操纵气球"),
          ],
          t(
            "The third paragraph says no one knew whether living creatures could survive high in the air, so the first passengers were a sheep, a duck and a rooster.",
            "第三段说没有人知道生物能否在高空存活，所以第一批乘客是一只羊、一只鸭和一只公鸡。",
          ),
        ),
        ask(
          t("What problem did the balloon leave for later inventors?", "气球给后来的发明家留下了什么问题？"),
          t("It could not be steered", "它无法操纵方向"),
          [
            t("It could not leave the ground", "它无法离开地面"),
            t("It could not carry people", "它无法载人"),
            t("It could not float over Paris", "它无法飘过巴黎上空"),
          ],
          t(
            "The last paragraph says the balloon could not be steered and went wherever the wind blew, so the next challenge was to control where people went.",
            "最后一段说气球无法操纵，随风飘荡，所以下一个挑战是控制人们飞往何处。",
          ),
        ),
      ],
      ["Joseph", "Étienne", "Montgolfier", "France", "King", "Louis", "XVI", "Versailles", "November", "Paris"],
    ),
    passage(
      "two-hundred-wings",
      t("Two Hundred Wings", "两百个机翼"),
      `Wilbur and Orville Wright ran a bicycle shop in Dayton, Ohio. They had no university degrees. Yet in 1903, they built and flew the first powered airplane that a pilot could control. Their success came not from a sudden flash of genius but from years of patient trial and error.

The brothers began by studying everything they could find about flight. Then, in 1900, they built a glider and took it to Kitty Hawk, North Carolina, where strong, steady winds blew across soft sand dunes. They learned to control their gliders by twisting the wings, an idea Wilbur got from watching birds and from twisting a long, empty box in his hands.

Their 1901 glider was a disappointment. It produced far less lift than the tables published by earlier experimenters had predicted. Discouraged, Wilbur said at one point that people might not fly in their lifetimes.

Instead of giving up, the brothers decided the old tables might be wrong. Back in Dayton, they built a small wind tunnel: a wooden box about two meters long, with a fan at one end. Inside, they tested about two hundred small model wings of different shapes, carefully measuring the lift of each. Their measurements were the most accurate anyone had made.

Using their new data, they built a much better glider in 1902 and made hundreds of successful flights. Then they designed a light engine and propellers.

On December 17, 1903, at Kitty Hawk, Orville flew their powered Flyer for twelve seconds, covering about thirty-seven meters. That day they made four flights; the longest, by Wilbur, lasted fifty-nine seconds. It was a short trip, but it was the beginning of a new age.`,
      [trialWords, flightWords, scientificIdea, academic3],
      [
        ask(
          t("Why did the brothers choose Kitty Hawk for their tests?", "兄弟俩为什么选择基蒂霍克进行试验？"),
          t("Strong, steady winds and soft sand dunes", "那里有强劲稳定的风和松软的沙丘"),
          [
            t("Their bicycle shop was there", "他们的自行车店在那里"),
            t("It had the first wind tunnel", "那里有第一个风洞"),
            t("Earlier experimenters lived there", "早期的试验者住在那里"),
          ],
          t(
            "The second paragraph says strong, steady winds blew across soft sand dunes at Kitty Hawk, ideal for gliders and safer landings.",
            "第二段说基蒂霍克有强劲稳定的风吹过松软的沙丘，非常适合滑翔机，着陆也更安全。",
          ),
        ),
        ask(
          t("What did the brothers do after the disappointing 1901 glider?", "1901年的滑翔机令人失望之后，兄弟俩做了什么？"),
          t("They tested about two hundred model wings in a wind tunnel", "他们在风洞中测试了约两百个模型机翼"),
          [
            t("They gave up and returned to bicycles", "他们放弃了，回去做自行车"),
            t("They copied the old tables more carefully", "他们更仔细地照搬旧数据表"),
            t("They built an engine before a new glider", "他们在造新滑翔机之前先造了发动机"),
          ],
          t(
            "The fourth paragraph says they decided the old tables might be wrong, built a wind tunnel and tested about two hundred model wings, measuring the lift of each.",
            "第四段说他们认为旧数据表可能有误，于是造了一个风洞，测试了约两百个模型机翼，逐一测量升力。",
          ),
        ),
        ask(
          t("What is the central idea of the passage?", "文章的中心思想是什么？"),
          t("The Wrights succeeded through patient trial and error", "莱特兄弟通过耐心的反复试验获得成功"),
          [
            t("The Wrights succeeded through a sudden flash of genius", "莱特兄弟凭借灵光一现获得成功"),
            t("Flying requires a university degree", "飞行需要大学学位"),
            t("Gliders are better than powered airplanes", "滑翔机比动力飞机更好"),
          ],
          t(
            "The first paragraph says their success came not from a sudden flash of genius but from years of patient trial and error, and the rest of the passage shows each step.",
            "第一段说他们的成功不是来自灵光一现，而是来自多年耐心的反复试验，文章其余部分展示了每一步。",
          ),
        ),
      ],
      ["Wilbur", "Orville", "Wright", "Wrights", "Dayton", "Ohio", "Kitty", "Hawk", "North", "Carolina", "December", "Flyer"],
    ),
    passage(
      "the-pilot-who-went-to-france",
      t("The Pilot Who Went to France", "远赴法国的飞行员"),
      `Bessie Coleman grew up in Texas in the 1890s, one of thirteen children in a poor family. She picked cotton and helped her mother wash laundry, and she walked miles to a one-room school. She loved to read, and she dreamed of becoming somebody.

As a young woman, she moved to Chicago and worked in a barbershop. There she heard stories from soldiers returning from the First World War, including tales of French women who flew airplanes. Coleman decided she would learn to fly.

But no flight school in the United States would accept her. She was a woman, and she was African American, and the schools of the time refused both. A newspaper publisher she knew gave her some advice: if American schools would not teach her, she should go to France.

So Coleman learned French, saved her money and, in 1920, sailed across the Atlantic. In France, she trained in a fragile plane made of wood and fabric. During her training, she saw a fellow student killed in a crash, but she did not quit. In June 1921, she became the first African American woman, and the first woman of Native American descent, to earn an international pilot's license.

Back in the United States, she became a stunt pilot, performing loops and figure eights at air shows. Crowds called her "Queen Bess." She refused to perform where Black spectators were not allowed to enter through the same gates as white spectators.

Coleman dreamed of opening a flight school for Black students. She died in a crash in 1926, before she could do it. But her example inspired others, and a few years later, a flying club named after her began training Black pilots in Los Angeles.`,
      [pilotWords, trialWords],
      [
        ask(
          t("Why did Bessie Coleman go to France?", "贝西·科尔曼为什么去法国？"),
          t("No flight school in the United States would accept her", "美国没有一所飞行学校愿意接收她"),
          [
            t("She wanted to fight in the First World War", "她想参加第一次世界大战"),
            t("Her family had moved to France", "她的家人搬到了法国"),
            t("French planes were safer", "法国的飞机更安全"),
          ],
          t(
            "The third paragraph says no flight school in the United States would accept her, because she was a woman and African American, so she was advised to go to France.",
            "第三段说美国没有一所飞行学校愿意接收她，因为她是女性又是非裔美国人，所以有人建议她去法国。",
          ),
        ),
        ask(
          t(
            "What does Coleman's reaction to the crash during her training show about her?",
            "科尔曼对训练中那次坠机事故的反应说明了她什么？",
          ),
          t("She was determined and brave", "她意志坚定、勇敢无畏"),
          [
            t("She was careless about danger", "她对危险漫不经心"),
            t("She wanted to stop flying", "她想停止飞行"),
            t("She blamed the French teachers", "她责怪法国教练"),
          ],
          t(
            "The fourth paragraph says she saw a fellow student killed in a crash, but she did not quit. Continuing after seeing that danger shows determination and courage.",
            "第四段说她目睹一名同学在坠机中丧生，但她没有放弃。在目睹这样的危险后坚持下去，体现了她的决心和勇气。",
          ),
        ),
        ask(
          t("How did Coleman use her fame as a stunt pilot?", "科尔曼是如何利用她作为特技飞行员的名气的？"),
          t("She refused to perform where Black spectators had to use separate gates", "她拒绝在黑人观众必须走单独入口的地方表演"),
          [
            t("She opened a flight school in Texas", "她在得克萨斯开办了一所飞行学校"),
            t("She sold airplanes to her fans", "她把飞机卖给她的粉丝"),
            t("She became a newspaper publisher", "她成了报纸出版人"),
          ],
          t(
            "The fifth paragraph says she refused to perform where Black spectators were not allowed to enter through the same gates as white spectators.",
            "第五段说她拒绝在黑人观众不能与白人观众走同一入口的地方表演。",
          ),
        ),
      ],
      [
        "Bessie",
        "Coleman",
        "Coleman's",
        "Texas",
        "Chicago",
        "First",
        "World",
        "War",
        "French",
        "United",
        "States",
        "American",
        "African",
        "France",
        "Atlantic",
        "June",
        "Native",
        "Queen",
        "Bess",
        "Black",
        "Los",
        "Angeles",
      ],
    ),
    passage(
      "keeping-planes-apart",
      t("Keeping Planes Apart", "让飞机保持间隔"),
      `At a busy airport, a plane may take off or land every minute. Thousands more fly overhead. How do they avoid running into one another? The answer is air traffic control, a team of controllers who guide each plane from the gate to the sky and back again.

A flight is passed from one group of controllers to the next, like a baton in a relay race. First, ground control directs the plane along the taxiways, the roads that connect the gates to the runways. Next, the tower controllers, who sit high above the airport with a view of the runways, give permission to take off. Once the plane is in the air, it is handed to departure controllers, and then to controllers in distant centers who watch the plane on radar as it crosses the country. As it nears its destination, the process runs in reverse.

Controllers talk to pilots by radio, using short, standard phrases so that there is no confusion. Pilots must repeat important instructions back, so that the controller can catch any mistake.

Each runway has a number painted on its end, and an airport diagram shows these numbers. The number comes from the runway's direction on a compass, divided by ten. A runway pointing east, toward ninety degrees, is runway 9. The same strip of concrete, seen from the other end, points west, toward two hundred and seventy degrees, so it is also runway 27. Planes usually take off and land into the wind, so controllers choose which end to use depending on the weather.

Controllers keep planes a safe distance apart, both side by side and up and down. It is a demanding job, and controllers take frequent breaks to stay alert.`,
      [pilotWords, diagrams, greek4, academic2],
      [
        ask(
          t(
            "Why does the author compare the passing of a flight between controllers to a relay race?",
            "作者为什么把航班在管制员之间的交接比作接力赛？",
          ),
          t("Each group guides the plane for one stage and then hands it on", "每一组负责引导飞机走一段，然后交给下一组"),
          [
            t("Controllers run between the towers", "管制员在塔台之间奔跑"),
            t("Planes race one another to the runway", "飞机争先恐后地冲向跑道"),
            t("The fastest controller wins a prize", "最快的管制员会获奖"),
          ],
          t(
            "The second paragraph says a flight is passed from one group to the next, like a baton in a relay race: ground, tower, departure and distant centers each handle one stage.",
            "第二段说航班从一组交给下一组，就像接力赛中的接力棒：地面、塔台、离场和远方的管制中心各负责一段。",
          ),
        ),
        ask(
          t("Why must pilots repeat important instructions back?", "为什么飞行员必须复述重要指令？"),
          t("So the controller can catch any mistake", "这样管制员可以发现任何错误"),
          [
            t("So other pilots can learn the phrases", "这样其他飞行员可以学会这些用语"),
            t("Because the radio works only one way", "因为无线电只能单向通话"),
            t("To show they are on the right runway", "为了表明他们在正确的跑道上"),
          ],
          t(
            "The third paragraph says pilots must repeat important instructions back so that the controller can catch any mistake.",
            "第三段说飞行员必须复述重要指令，这样管制员可以发现任何错误。",
          ),
        ),
        ask(
          t(
            "On an airport diagram, a runway is labeled 9 at one end. What number would be at the other end?",
            "在机场图上，一条跑道的一端标着9。另一端会是什么数字？",
          ),
          t("Runway 27", "27号跑道"),
          [t("Runway 9", "9号跑道"), t("Runway 18", "18号跑道"), t("Runway 90", "90号跑道")],
          t(
            "The fourth paragraph explains that runway 9 points east, toward ninety degrees; from the other end the same strip points west, toward two hundred and seventy degrees, so it is runway 27.",
            "第四段解释说，9号跑道指向东方，即90度；从另一端看，同一条跑道指向西方，即270度，所以是27号跑道。",
          ),
        ),
      ],
      [],
      ["taxiways"],
    ),
    passage(
      "the-box-that-is-not-black",
      t("The Box That Is Not Black", "并不是黑色的黑匣子"),
      `In 1953 and 1954, several of the world's first jet airliners, the Comet, crashed mysteriously. Investigators struggled to work out what had gone wrong, because there were no survivors and little evidence. An Australian scientist named David Warren, whose own father had died in a plane crash years earlier, had an idea: what if every plane carried a recorder that captured the sounds in the cockpit and the readings of its instruments?

At first, few people took the idea seriously. Some pilots did not want their conversations recorded. But Warren built a working model in 1956, and after another crash in Australia, the government began to require flight recorders on airliners in the 1960s. Other countries followed.

Today, most large planes carry two recorders, often called black boxes. One, the cockpit voice recorder, records the voices of the pilots and the sounds around them. The other, the flight data recorder, records hundreds of measurements every second, such as the plane's speed, height, direction and the position of its controls.

Despite the name, the boxes are bright orange, so that searchers can find them in wreckage. They are built to survive enormous forces, intense fire and deep water. If a plane goes down at sea, the recorders send out a signal that searchers can track for about a month.

The recorders have made flying far safer. After each accident, investigators study the recordings to find out exactly what happened. Their findings lead to changes: new designs, new rules or new training for pilots. Every accident becomes a lesson, so that the same mistake is less likely to happen again. Flying has become one of the safest ways to travel, in part because the industry learns from every failure.`,
      [pilotWords, trialWords, greek4, academic1, academic3],
      [
        ask(
          t("Why was it hard to learn what caused the Comet crashes?", "为什么很难查明彗星客机坠毁的原因？"),
          t("There were no survivors and little evidence", "没有幸存者，证据也很少"),
          [
            t("The planes carried too many recorders", "飞机上带了太多记录器"),
            t("The pilots refused to talk", "飞行员拒绝开口"),
            t("The planes were bright orange", "飞机是亮橙色的"),
          ],
          t(
            "The first paragraph says investigators struggled because there were no survivors and little evidence.",
            "第一段说调查人员举步维艰，因为没有幸存者，证据也很少。",
          ),
        ),
        ask(
          t("Why are the black boxes painted bright orange?", "为什么黑匣子被漆成亮橙色？"),
          t("So searchers can find them in wreckage", "以便搜寻人员在残骸中找到它们"),
          [
            t("So they can survive fire", "以便它们能经受火烧"),
            t("So pilots can see them in the cockpit", "以便飞行员在驾驶舱里看到它们"),
            t("So they send a stronger signal", "以便它们发出更强的信号"),
          ],
          t(
            "The fourth paragraph says the boxes are bright orange, so that searchers can find them in wreckage.",
            "第四段说这些匣子是亮橙色的，以便搜寻人员在残骸中找到它们。",
          ),
        ),
        ask(
          t("According to the last paragraph, how have the recorders made flying safer?", "根据最后一段，记录器是怎样让飞行更安全的？"),
          t("They help investigators learn from each accident and make changes", "它们帮助调查人员从每次事故中吸取教训并作出改进"),
          [
            t("They stop planes from crashing", "它们阻止飞机坠毁"),
            t("They fly the plane when pilots make mistakes", "飞行员出错时由它们驾驶飞机"),
            t("They record only the pilots' voices", "它们只记录飞行员的声音"),
          ],
          t(
            "The last paragraph says investigators study the recordings after each accident, and their findings lead to new designs, rules or training, so every accident becomes a lesson.",
            "最后一段说每次事故后调查人员都会研究记录，他们的发现带来新的设计、规定或培训，所以每次事故都成了一次教训。",
          ),
        ),
      ],
      ["Comet", "Australian", "Australia", "David", "Warren"],
    ),
    passage(
      "faster-than-sound",
      t("Faster Than Sound", "比声音更快"),
      `In the 1940s, pilots of the fastest fighter planes reported something frightening. As they dived at speeds close to the speed of sound, their planes began to shake violently, and their controls stopped working properly. Some planes broke apart. Many people began to speak of a "sound barrier," an invisible wall in the sky that no plane could pass.

The problem was real, but the wall was not. As a plane flies, it pushes on the air in front of it, sending out pressure waves that travel at the speed of sound. At low speeds, these waves move ahead of the plane and the air has time to flow smoothly around it. But as the plane approaches the speed of sound, it catches up with its own waves. They pile up into a shock wave, a sudden jump in pressure, which can make the plane hard to control.

To find out whether a plane could fly through, the United States built a special research plane, the Bell X-1. Its shape was modeled on a bullet, which was known to fly faster than sound and stay stable. It had a rocket engine and was carried high into the air under a larger plane, then dropped to save fuel.

The engineers moved carefully, increasing the speed a little on each test flight and studying the results. On October 14, 1947, test pilot Chuck Yeager flew the X-1 to a speed about six percent faster than the speed of sound. The shaking stopped as he passed through, and the flight became smooth. People on the ground heard a deep boom: the shock wave reaching the ground.

The sound barrier had been broken, not by a single brave leap, but by step-by-step testing.`,
      [flightWords, trialWords, scientificIdea],
      [
        ask(
          t("Why did people believe in a sound barrier?", "人们为什么相信存在音障？"),
          t("Planes near the speed of sound shook, lost control and sometimes broke apart", "接近音速的飞机会剧烈震动、失控，有时甚至解体"),
          [
            t("Scientists had seen a wall in the sky", "科学家在天空中看到了一堵墙"),
            t("Sound could not travel through the air", "声音无法在空气中传播"),
            t("Bullets could not fly faster than sound", "子弹无法飞得比声音快"),
          ],
          t(
            "The first paragraph says pilots near the speed of sound reported violent shaking and failing controls, and some planes broke apart, so people spoke of an invisible wall.",
            "第一段说飞行员在接近音速时报告剧烈震动和操纵失灵，一些飞机解体了，所以人们说有一堵看不见的墙。",
          ),
        ),
        ask(
          t("What is a shock wave, as the passage explains it?", "文章是如何解释激波的？"),
          t("Pressure waves that pile up into a sudden jump in pressure", "压力波堆积形成的压力骤然跃升"),
          [
            t("A wall that no plane can pass", "任何飞机都无法穿越的墙"),
            t("The rocket engine of the X-1", "X-1的火箭发动机"),
            t("The smooth flow of air around a slow plane", "空气在慢速飞机周围的平稳流动"),
          ],
          t(
            "The second paragraph says that as the plane catches up with its own pressure waves, they pile up into a shock wave, a sudden jump in pressure.",
            "第二段说当飞机追上自己的压力波时，这些波堆积起来形成激波，即压力的骤然跃升。",
          ),
        ),
        ask(
          t("Why was the X-1 shaped like a bullet?", "为什么X-1被设计成子弹的形状？"),
          t("Bullets were known to fly faster than sound and stay stable", "众所周知子弹能以超音速飞行并保持稳定"),
          [
            t("It made the plane easier to carry under another plane", "这让它更容易挂在另一架飞机下面"),
            t("It saved fuel on the ground", "这能在地面上节省燃料"),
            t("The pilot asked for that shape", "飞行员要求做成那种形状"),
          ],
          t(
            "The third paragraph says its shape was modeled on a bullet, which was known to fly faster than sound and stay stable.",
            "第三段说它的形状仿照子弹，而子弹是公认能以超音速飞行并保持稳定的。",
          ),
        ),
      ],
      ["United", "States", "Bell", "X-1", "October", "Chuck", "Yeager"],
    ),
  ],
};
