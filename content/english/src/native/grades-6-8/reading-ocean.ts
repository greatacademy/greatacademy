// Grades 6 to 8: the reading unit of the fifth theme, life in the ocean, from the zones of the sea to the work of
// protecting it.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "./reading-kit.ts";

const clues = { topic: "context-clues", weight: 0.2 } as const;
const ecoWords = { topic: "words-of-ecosystems", weight: 0.3 } as const;
const evidence = { topic: "citing-textual-evidence", weight: 0.2 } as const;
const structures = { topic: "text-structures", weight: 0.2 } as const;

/** lifeInTheOcean is a reading unit of grades 6 to 8 on ocean life and the ecosystems of the sea. */
export const lifeInTheOcean: ReadingUnitDef = {
  id: "life-in-the-ocean",
  title: t("Life in the Ocean", "海洋中的生命"),
  passages: [
    passage(
      "the-zones-of-the-ocean",
      t("The Zones of the Ocean", "海洋的分层"),
      `If you could ride an elevator from the surface of the ocean to its deepest point, you would pass through several very different worlds. Scientists divide the ocean into zones by depth, and each zone has its own conditions and its own kinds of life.

The top layer, the sunlight zone, reaches down about six hundred feet. It receives enough sunlight for tiny producers such as plankton and seaweed to make food through photosynthesis. Because food is plentiful, about ninety percent of all ocean life lives here, from dolphins and sea turtles to most of the fish that people eat.

Below it lies the twilight zone, which extends to about three thousand feet. Only a faint blue glow reaches this depth, too little for plants to grow. Many animals here have huge eyes to catch what light there is. Every night, countless creatures swim up toward the surface to feed in the dark, then sink back down before dawn. Scientists believe this daily journey is the largest migration on Earth.

Deeper still is the midnight zone, where no sunlight reaches at all. The water is near freezing, and the pressure is crushing. The only light comes from animals that make their own, a skill called bioluminescence.

At the bottom are the abyss and, in a few places, deep trenches that plunge more than six miles down. Even here, life survives, feeding on scraps that drift down from above.

Each zone is a separate ecosystem, yet they are all linked: what happens near the surface eventually affects life at the very bottom.`,
      [clues, ecoWords, structures],
      [
        ask(
          t("Why does most ocean life live in the sunlight zone?", "为什么大多数海洋生物生活在阳光层？"),
          t("There is enough sunlight for producers to make plenty of food", "那里阳光充足，生产者能制造大量食物"),
          [
            t("The water there is the coldest", "那里的水最冷"),
            t("The pressure there is the greatest", "那里的压力最大"),
            t("Animals there make their own light", "那里的动物自己发光"),
          ],
          t(
            "The second paragraph says sunlight lets producers make food, and because food is plentiful, about ninety percent of ocean life lives there.",
            "第二段说，阳光让生产者能制造食物，因为食物充足，大约百分之九十的海洋生物生活在那里。",
          ),
        ),
        ask(
          t("What is the daily migration described in the passage?", "文中描述的每日迁徙是什么？"),
          t("Animals swim up at night to feed and sink back down before dawn", "动物夜里游上来觅食，黎明前再沉下去"),
          [
            t("Whales travel from the poles to the tropics", "鲸从两极游到热带"),
            t("Plankton sink to the bottom each day", "浮游生物每天沉到海底"),
            t("Fish leave the ocean for rivers", "鱼离开海洋游进河流"),
          ],
          t(
            "The third paragraph says creatures of the twilight zone swim up each night to feed and sink back before dawn.",
            "第三段说，暮光层的生物每天夜里游上来觅食，黎明前再沉回去。",
          ),
        ),
        ask(
          t('What does "bioluminescence" mean, as the passage uses it?', '文中的 "bioluminescence" 是什么意思？'),
          t("The ability of animals to make their own light", "动物自己发光的能力"),
          [
            t("The pressure of deep water", "深水的压力"),
            t("The faint blue light from the surface", "从海面透下来的微弱蓝光"),
            t("The way plants make food", "植物制造食物的方式"),
          ],
          t(
            "The fourth paragraph defines it right after the word: animals that make their own light.",
            "第四段在这个词前面就给出了解释：动物自己发光。",
          ),
        ),
      ],
      ["Earth"],
      ["bioluminescence"],
    ),
    passage(
      "plankton",
      t("Plankton, the Drifters", "浮游生物：漂流者"),
      `Most people have never seen plankton, yet without these tiny drifters, almost all life in the ocean would disappear. The word plankton comes from a Greek word meaning "wanderer," because plankton cannot swim against the currents. They simply drift wherever the water carries them.

There are two main kinds. Phytoplankton are plant-like organisms, most of them far too small to see without a microscope. Like plants on land, they use sunlight to make food from water and carbon dioxide, releasing oxygen as they do. Scientists estimate that phytoplankton produce about half of all the oxygen on Earth, so every second breath you take may come from the sea.

Zooplankton are tiny animals or similar organisms. Some, like copepods, spend their whole lives as plankton. Others, such as the young of crabs, fish and sea stars, drift as plankton only while they are small. Jellyfish are also zooplankton, even though some grow very large, because they cannot swim against the currents.

Together, plankton form the base of the ocean food web. Zooplankton graze on phytoplankton, small fish eat zooplankton, and larger animals eat the small fish. Some of the largest animals in the sea feed on plankton directly. A blue whale, which can weigh as much as thirty elephants, survives almost entirely on krill, a small, shrimp-like zooplankton.

Because plankton are so important, scientists watch them closely. Changes in plankton, caused by warming water or pollution, can ripple through the whole ecosystem.`,
      [clues, ecoWords, structures, { topic: "academic-words-1", weight: 0.1 }, { topic: "academic-words-2", weight: 0.1 }],
      [
        ask(
          t('Why are plankton called "wanderers"?', "浮游生物为什么被称为“漫游者”？"),
          t("They drift with the currents instead of swimming against them", "它们随洋流漂流，而不是逆流游动"),
          [
            t("They travel to every ocean each year", "它们每年游遍所有大洋"),
            t("They move from the sea to rivers", "它们从海洋游到河流"),
            t("They wander away from the light", "它们远离光线漫游"),
          ],
          t(
            "The first paragraph says the name means wanderer because plankton cannot swim against the currents and simply drift.",
            "第一段说，这个名字意为漫游者，因为浮游生物无法逆流游动，只能随水漂流。",
          ),
        ),
        ask(
          t(
            "Which detail best supports the idea that phytoplankton matter to people on land?",
            "哪个细节最能支持“浮游植物对陆地上的人很重要”这一观点？",
          ),
          t("They produce about half of all the oxygen on Earth", "它们产生了地球上大约一半的氧气"),
          [
            t("Most are too small to see without a microscope", "大多数小得不用显微镜就看不见"),
            t("Copepods spend their whole lives as plankton", "桡足类一生都是浮游生物"),
            t("Jellyfish cannot swim against currents", "水母无法逆流游动"),
          ],
          t(
            "The oxygen fact connects plankton to every breath people take; the other details are true but do not show why they matter to people.",
            "氧气这一事实把浮游生物和人们的每一次呼吸联系起来；其他细节虽然正确，却不能说明它们为什么对人很重要。",
          ),
        ),
        ask(
          t("Why are jellyfish counted as plankton?", "为什么水母被算作浮游生物？"),
          t("They cannot swim against the currents", "它们无法逆流游动"),
          [
            t("They are always very small", "它们总是很小"),
            t("They make food from sunlight", "它们利用阳光制造食物"),
            t("They eat only krill", "它们只吃磷虾"),
          ],
          t(
            "The third paragraph says jellyfish are zooplankton, even when large, because they cannot swim against the currents.",
            "第三段说，水母即使很大也属于浮游动物，因为它们无法逆流游动。",
          ),
        ),
      ],
      ["Greek", "Earth"],
      ["phytoplankton", "zooplankton"],
    ),
    passage(
      "coral-reefs",
      t("The Rainforests of the Sea", "海洋中的雨林"),
      `Coral reefs cover less than one percent of the ocean floor, yet they are home to about a quarter of all ocean species. Because of this astonishing biodiversity, they are often called the rainforests of the sea.

A coral reef may look like colorful rock, but it is built by living animals. Each coral is a colony of tiny creatures called polyps, each no bigger than a pea. A polyp has a soft body and a ring of tentacles around its mouth. It takes calcium from seawater and builds a hard cup around itself. When polyps die, their cups remain, and new polyps grow on top. Over thousands of years, these skeletons pile up into enormous structures. The largest, the Great Barrier Reef, can be seen from space.

Corals depend on a remarkable partnership. Inside each polyp live tiny algae that make food from sunlight and share it with the coral. In return, the coral gives the algae shelter. This kind of relationship, in which two different organisms both benefit, is called symbiosis. It is also the reason reefs grow only in clear, shallow, sunny water.

Today, reefs are in danger. When the water becomes too warm, corals push out their algae and turn white, a process called bleaching. If the water stays warm for too long, the corals starve and die. Pollution, overfishing and careless divers add to the damage.

Scientists and volunteers are fighting back. They grow young corals in underwater nurseries and plant them on damaged reefs, hoping to help the reefs recover.`,
      [clues, ecoWords, evidence, { topic: "academic-words-2", weight: 0.1 }],
      [
        ask(
          t('Why are coral reefs called "the rainforests of the sea"?', "珊瑚礁为什么被称为“海洋中的雨林”？"),
          t("They hold a huge variety of species in a small area", "它们在很小的区域内容纳了种类繁多的物种"),
          [
            t("They are covered with trees", "它们上面长满了树"),
            t("They get a lot of rain", "那里雨水很多"),
            t("They are found only in hot countries", "它们只在炎热的国家才有"),
          ],
          t(
            "The first paragraph says reefs cover less than one percent of the ocean floor but hold about a quarter of ocean species.",
            "第一段说，珊瑚礁占海底面积不到百分之一，却容纳了大约四分之一的海洋物种。",
          ),
        ),
        ask(
          t("Which sentence from the passage defines symbiosis?", "文中哪一句给出了共生的定义？"),
          t("A relationship in which two different organisms both benefit", "两种不同的生物都受益的关系"),
          [
            t("A process in which corals turn white", "珊瑚变白的过程"),
            t("A colony of tiny creatures called polyps", "由叫作珊瑚虫的微小生物组成的群体"),
            t("A nursery where young corals grow", "培育幼小珊瑚的苗圃"),
          ],
          t(
            "The third paragraph says a relationship in which two different organisms both benefit is called symbiosis.",
            "第三段说，两种不同的生物都受益的关系叫作共生。",
          ),
        ),
        ask(
          t("What causes coral bleaching?", "是什么导致了珊瑚白化？"),
          t("Water that becomes too warm", "海水变得过热"),
          [
            t("Too much sunlight in shallow water", "浅水中阳光过多"),
            t("Polyps building cups too quickly", "珊瑚虫造杯子太快"),
            t("Young corals planted on reefs", "种植在礁石上的幼小珊瑚"),
          ],
          t(
            "The fourth paragraph says that when the water becomes too warm, corals push out their algae and turn white.",
            "第四段说，海水过热时，珊瑚会排出体内的藻类而变白。",
          ),
        ),
      ],
      ["Great", "Barrier", "Reef"],
      ["polyps", "bleaching"],
    ),
    passage(
      "kelp-forests",
      t("Kelp Forests and Sea Otters", "海藻林与海獭"),
      `Along the cool, rocky coasts of places like California, South Africa and southern Australia, forests grow underwater. They are made of kelp, a giant brown seaweed. Kelp is one of the fastest-growing organisms on Earth; in good conditions, it can grow up to two feet in a single day and reach more than one hundred feet tall.

Kelp has no roots. Instead, it clings to rocks with a tangle of strong, root-like fingers called a holdfast. Its long blades are lifted toward the sunlight by small bulbs filled with gas, which work like tiny balloons. On a sunny day, light streams down between the swaying stalks, and divers say it feels like swimming through a cathedral.

These forests shelter an amazing variety of life: fish, crabs, snails, sea stars, seals and many more. One animal, however, plays an especially important role in keeping the forest healthy: the sea otter.

Sea otters eat sea urchins, spiny animals that graze on kelp. In the 1700s and 1800s, hunters killed sea otters by the thousands for their thick fur, until the otters almost disappeared. Without otters to eat them, sea urchins multiplied and chewed through the kelp, leaving large areas of bare rock that scientists call urchin barrens.

When laws protected the otters and their numbers began to rise, the urchins were kept in check, and the kelp forests grew back. Scientists call an animal like the sea otter a keystone species, because, like the central stone in an arch, removing it causes the whole structure to collapse.`,
      [clues, ecoWords, structures, { topic: "academic-words-2", weight: 0.1 }],
      [
        ask(
          t("How does kelp stay attached to the rocks?", "海藻怎样附着在岩石上？"),
          t("With a holdfast of strong, root-like fingers", "靠由强韧的根状物组成的固着器"),
          [t("With deep roots", "靠很深的根"), t("With gas-filled bulbs", "靠充满气体的气囊"), t("With sticky leaves", "靠黏性的叶子")],
          t(
            "The second paragraph says kelp has no roots and clings to rocks with a holdfast.",
            "第二段说，海藻没有根，靠固着器附着在岩石上。",
          ),
        ),
        ask(
          t("What happened to kelp forests when sea otters were hunted?", "海獭被捕杀后，海藻林发生了什么？"),
          t("Sea urchins multiplied and ate the kelp", "海胆大量繁殖，吃掉了海藻"),
          [
            t("The kelp grew faster than ever", "海藻长得比以往更快"),
            t("Seals moved in to eat the kelp", "海豹迁入吃掉了海藻"),
            t("Divers planted new kelp", "潜水员种植了新的海藻"),
          ],
          t(
            "The fourth paragraph says that without otters, sea urchins multiplied and chewed through the kelp.",
            "第四段说，没有了海獭，海胆大量繁殖，把海藻啃光了。",
          ),
        ),
        ask(
          t("Why is the sea otter called a keystone species?", "为什么海獭被称为关键物种？"),
          t("Removing it causes the whole ecosystem to collapse", "失去它会导致整个生态系统崩溃"),
          [
            t("It is the largest animal in the forest", "它是海藻林中最大的动物"),
            t("It lives on the rocks of the coast", "它生活在海岸的岩石上"),
            t("It has the thickest fur of any animal", "它的毛皮比任何动物都厚"),
          ],
          t(
            "The last paragraph compares the otter to the central stone of an arch: removing it causes the whole structure to collapse.",
            "最后一段把海獭比作拱门中央的那块石头：拿掉它，整个结构就会坍塌。",
          ),
        ),
      ],
      ["California", "South", "Africa", "Australia", "Earth"],
      ["holdfast", "keystone"],
    ),
    passage(
      "ocean-food-webs",
      t("Who Eats Whom in the Sea", "海洋里谁吃谁"),
      `Every living thing in the ocean needs energy, and almost all of that energy begins with the sun. An ocean food web shows how this energy passes from one organism to another.

At the base of the web are the producers. In the ocean, these are mostly phytoplankton, tiny drifting organisms that use sunlight to make their own food. Seaweed and sea grasses are producers too, but phytoplankton make up by far the largest share.

Next come the consumers, which must eat other organisms to get energy. Zooplankton, such as krill and copepods, graze on phytoplankton. Small fish like anchovies and sardines eat the zooplankton. Larger fish, such as tuna and salmon, eat the small fish, and at the top of the web are predators like sharks, orcas and seals.

When any of these organisms die, decomposers go to work. Bacteria and other tiny organisms break down dead plants and animals, returning nutrients to the water. The phytoplankton then use those nutrients to grow, and the cycle begins again.

Scientists use the word web instead of chain because most animals eat more than one kind of food, and most are eaten by more than one predator. These many connections make the system strong in some ways, but they also mean that a change in one part can spread to others. When fishing boats catch too many anchovies, for example, the seabirds, seals and larger fish that depend on them may go hungry.

For this reason, many scientists argue that fishing limits must consider the whole web, not just one species.`,
      [clues, ecoWords, structures],
      [
        ask(
          t("Where does almost all the energy in an ocean food web begin?", "海洋食物网中几乎所有的能量从哪里开始？"),
          t("With the sun", "太阳"),
          [t("With sharks and orcas", "鲨鱼和虎鲸"), t("With decomposers", "分解者"), t("With fishing boats", "渔船")],
          t(
            "The first paragraph says almost all of that energy begins with the sun, which producers use to make food.",
            "第一段说，几乎所有能量都始于太阳，生产者利用阳光制造食物。",
          ),
        ),
        ask(
          t("What job do decomposers do in the web?", "分解者在食物网中起什么作用？"),
          t("They break down dead organisms and return nutrients to the water", "它们分解死去的生物，把养分归还给海水"),
          [
            t("They make food from sunlight", "它们利用阳光制造食物"),
            t("They hunt the largest fish", "它们捕食最大的鱼"),
            t("They carry plankton across the ocean", "它们把浮游生物带过大洋"),
          ],
          t(
            "The fourth paragraph says decomposers break down dead plants and animals and return nutrients to the water.",
            "第四段说，分解者分解死去的动植物，把养分归还给海水。",
          ),
        ),
        ask(
          t('Why do scientists say "web" instead of "chain"?', "为什么科学家说“网”而不说“链”？"),
          t("Most animals eat, and are eaten by, more than one kind of organism", "大多数动物吃不止一种生物，也被不止一种生物吃"),
          [
            t("The ocean is shaped like a web", "海洋的形状像一张网"),
            t("Spiders live in the ocean", "海洋里生活着蜘蛛"),
            t("Chains are only found on land", "链只存在于陆地上"),
          ],
          t(
            "The fifth paragraph explains that most animals eat more than one kind of food and are eaten by more than one predator.",
            "第五段解释说，大多数动物吃不止一种食物，也被不止一种捕食者吃。",
          ),
        ),
      ],
      [],
      ["phytoplankton", "zooplankton"],
    ),
    passage(
      "the-migration-of-whales",
      t("The Long Journey of the Humpback", "座头鲸的漫长旅程"),
      `Every year, humpback whales make one of the longest journeys of any mammal on Earth. Some travel more than five thousand miles each way between their feeding grounds and their breeding grounds.

In summer, humpbacks feed in the cold waters near the North and South Poles. These waters are rich in krill and small fish, and the whales eat enormous amounts, up to a ton and a half of food a day. They store the energy as a thick layer of fat called blubber. Humpbacks have a clever way of hunting: a group swims in a circle below a school of fish, blowing a ring of bubbles. The bubbles form a net that traps the fish, and the whales rise through the middle with their mouths wide open.

When winter approaches, the whales swim toward warm, tropical waters near places like Hawaii and Mexico. There, the females give birth. A newborn calf has little blubber and could not survive in icy seas. During these months, the adults eat almost nothing and live off their stored fat.

In spring, the mothers lead their calves back toward the feeding grounds, teaching them the route as they go. Scientists are still studying how whales find their way across open ocean. They may use the position of the sun, the earth's magnetic field and even the shape of the ocean floor.

Humpbacks were once hunted until only a few thousand remained. Since hunting was banned in 1966, their numbers have recovered, and today they are no longer considered endangered.`,
      [clues, ecoWords, evidence],
      [
        ask(
          t("Why do humpback whales travel to tropical waters in winter?", "座头鲸冬天为什么游到热带海域？"),
          t("To give birth where the calves can survive", "在幼鲸能够存活的地方生产"),
          [t("To find more krill", "寻找更多磷虾"), t("To escape from hunters", "躲避捕鲸者"), t("To build up their blubber", "积累脂肪")],
          t(
            "The third paragraph says females give birth in warm waters because newborn calves could not survive in icy seas.",
            "第三段说，雌鲸在温暖的海域生产，因为刚出生的幼鲸无法在冰冷的海水中存活。",
          ),
        ),
        ask(
          t("How do humpbacks use bubbles to hunt?", "座头鲸怎样用气泡捕食？"),
          t("A ring of bubbles traps a school of fish like a net", "一圈气泡像网一样困住鱼群"),
          [
            t("The bubbles scare away sharks", "气泡吓跑鲨鱼"),
            t("The bubbles carry the whales upward", "气泡把鲸托上来"),
            t("The bubbles help the whales breathe", "气泡帮助鲸呼吸"),
          ],
          t(
            "The second paragraph says the bubbles form a net that traps the fish, and the whales rise through the middle to eat them.",
            "第二段说，气泡形成一张网困住鱼群，鲸从中间向上游，把鱼吃掉。",
          ),
        ),
        ask(
          t("Which detail supports the claim that humpbacks have recovered?", "哪个细节支持座头鲸数量已经恢复的说法？"),
          t("They are no longer considered endangered", "它们已不再被认为是濒危物种"),
          [
            t("They travel more than five thousand miles", "它们游五千多英里"),
            t("They eat up to a ton and a half of food a day", "它们每天吃多达一吨半的食物"),
            t("They may use the earth's magnetic field", "它们可能利用地球磁场"),
          ],
          t(
            "The last paragraph says their numbers have recovered since hunting was banned and that they are no longer considered endangered.",
            "最后一段说，自从禁止捕鲸以来，它们的数量已经恢复，不再被认为是濒危物种。",
          ),
        ),
      ],
      ["Earth", "North", "South", "Poles", "Hawaii", "Mexico"],
      ["blubber"],
    ),
    passage(
      "plastic-in-the-sea",
      t("Plastic in the Sea", "海洋中的塑料"),
      `Scientists estimate that millions of tons of plastic enter the ocean every year. Some falls from ships, but most of it comes from land. Bottles, bags and wrappers blow off beaches and out of trash cans, wash down drains into rivers, and are carried out to sea.

Unlike wood or paper, plastic does not rot. Instead, sunlight and waves slowly break it into smaller and smaller pieces. Pieces smaller than a grain of rice are called microplastics. They are now found almost everywhere in the ocean, from the surface to the deepest trenches, and even in Arctic ice.

Plastic harms sea life in several ways. Sea turtles mistake floating bags for jellyfish, one of their favorite foods. Seabirds swallow bottle caps and feed them to their chicks, which can starve with stomachs full of plastic. Seals and dolphins become tangled in old fishing nets. Microplastics are eaten by plankton and small fish, and they can then move up the food web to the larger fish that people eat.

Ocean currents carry floating plastic into huge, slowly swirling areas called gyres. The best known, often called the Great Pacific Garbage Patch, lies between Hawaii and California. It is not a solid island of trash, as many people imagine, but a vast area where the water is filled with floating pieces, many of them tiny.

Some groups are building machines to collect plastic from the sea. Many scientists, however, say that the most important step is simpler: keep plastic from reaching the water in the first place, by using less of it and recycling more.`,
      [clues, ecoWords, structures, { topic: "academic-words-1", weight: 0.1 }],
      [
        ask(
          t("Where does most of the plastic in the ocean come from?", "海洋中的塑料大部分来自哪里？"),
          t("From land, carried by wind, drains and rivers", "来自陆地，被风、下水道和河流带入海中"),
          [
            t("From ships at sea", "来自海上的船只"),
            t("From the deepest trenches", "来自最深的海沟"),
            t("From Arctic ice", "来自北极的冰"),
          ],
          t(
            "The first paragraph says some falls from ships, but most comes from land, through drains and rivers.",
            "第一段说，有一些来自船只，但大部分来自陆地，经下水道和河流进入大海。",
          ),
        ),
        ask(
          t("How can microplastics reach people?", "微塑料怎样到达人类？"),
          t("They move up the food web to the fish people eat", "它们沿着食物网向上，进入人们吃的鱼"),
          [
            t("They fall as rain on cities", "它们随雨落在城市里"),
            t("They are added to drinking water on purpose", "它们被故意加进饮用水"),
            t("They grow into large pieces of trash", "它们长成大块垃圾"),
          ],
          t(
            "The third paragraph says microplastics are eaten by plankton and small fish and can move up the food web to fish that people eat.",
            "第三段说，微塑料被浮游生物和小鱼吃掉，可以沿着食物网向上进入人们吃的鱼。",
          ),
        ),
        ask(
          t("What mistaken idea about the garbage patch does the passage correct?", "文章纠正了关于垃圾带的什么错误看法？"),
          t("That it is a solid island of trash", "认为它是一座由垃圾堆成的实心岛"),
          [
            t("That it lies in the Pacific", "认为它位于太平洋"),
            t("That it contains plastic", "认为里面有塑料"),
            t("That currents carry plastic there", "认为是洋流把塑料带到那里"),
          ],
          t(
            "The fourth paragraph says it is not a solid island of trash, as many people imagine, but a vast area of floating pieces.",
            "第四段说，它并不像很多人想象的那样是一座实心的垃圾岛，而是一大片漂浮着碎片的海域。",
          ),
        ),
      ],
      ["Arctic", "Great", "Pacific", "Garbage", "Patch", "Hawaii", "California"],
      ["microplastics", "gyres"],
    ),
    passage(
      "protecting-the-oceans",
      t("Protecting the Oceans", "保护海洋"),
      `On land, people have protected special places for more than a century by turning them into national parks. In the ocean, a similar idea is spreading: the marine protected area. In these parts of the sea, human activities such as fishing, drilling and mining are limited or banned completely.

The results can be striking. Scientists who study protected areas around the world have found that, after some years, many of them contain more fish, larger fish and a greater variety of species than the waters nearby. Larger fish matter because they lay far more eggs than small ones. As the fish populations grow, some fish swim out of the protected area into the surrounding waters, where fishers can catch them.

Protected areas are not a perfect solution, however. A rule is only useful if it is obeyed, and patrolling large areas of open ocean is difficult and expensive. Some fishing communities have opposed new protected areas because they worry about losing their income. Scientists also point out that protection cannot stop every threat: warming water and plastic do not respect boundaries drawn on a map.

Even so, many countries have agreed on an ambitious goal: to protect thirty percent of the ocean by 2030. Today, a little under ten percent is protected in some way.

Ordinary people can help as well. Choosing seafood that is caught in sustainable ways, using less plastic and joining beach cleanups all reduce the pressure on ocean ecosystems. Protecting the ocean, scientists say, is not only about saving sea life; it is about protecting a system that feeds billions of people and helps to control the climate.`,
      [clues, ecoWords, evidence],
      [
        ask(
          t("What is a marine protected area?", "什么是海洋保护区？"),
          t("A part of the sea where fishing, drilling or mining is limited or banned", "限制或禁止捕鱼、钻探或采矿的海域"),
          [
            t("A beach where swimming is not allowed", "禁止游泳的海滩"),
            t("A national park on an island", "岛上的国家公园"),
            t("A place where scientists breed fish", "科学家养鱼的地方"),
          ],
          t(
            "The first paragraph defines it as a part of the sea where fishing, drilling and mining are limited or banned.",
            "第一段把它定义为限制或完全禁止捕鱼、钻探和采矿的海域。",
          ),
        ),
        ask(
          t("How can protected areas help fishers, according to the passage?", "根据文章，保护区怎样帮助渔民？"),
          t("Fish from the protected area swim into nearby waters where they can be caught", "保护区里的鱼游到附近海域，渔民可以捕捞"),
          [
            t("Fishers are paid to stay home", "渔民待在家里就能拿到钱"),
            t("Fishers may fish inside on weekends", "渔民周末可以在保护区内捕鱼"),
            t("The government gives fishers new boats", "政府给渔民新船"),
          ],
          t(
            "The second paragraph says that as fish populations grow, some swim out into surrounding waters, where fishers can catch them.",
            "第二段说，随着鱼的数量增加，一些鱼会游到周围海域，渔民可以在那里捕捞。",
          ),
        ),
        ask(
          t("Which is a limit of protected areas that the passage names?", "文章提到了保护区的哪个局限？"),
          t("They cannot stop warming water or plastic", "它们无法阻止海水变暖或塑料污染"),
          [
            t("They make fish smaller", "它们让鱼变小"),
            t("They cover most of the ocean already", "它们已经覆盖了大部分海洋"),
            t("They are cheap but useless", "它们便宜但没用"),
          ],
          t(
            "The third paragraph says protection cannot stop every threat, because warming water and plastic do not respect boundaries.",
            "第三段说，保护区无法阻止所有威胁，因为海水变暖和塑料污染不受边界限制。",
          ),
        ),
      ],
      [],
    ),
  ],
};
