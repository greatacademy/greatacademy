// The reading unit of the B1 theme Science and Discovery: the telescope, penicillin, the layers of the air, a comet,
// genes, doubt, the speed of sound and the way from a prototype to a product.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { readingWords } from "./reading-words.ts";

const pastPerfect = "past-perfect";
const tenses = "verb-tense-consistency";

const passage = passageMaker(readingWords, [
  "b1-words-science",
  "b1-words-research",
  "b1-words-space-2",
  "b1-words-inventions",
  "b1-words-numbers-and-amounts",
  "b1-words-physics",
  "b1-words-describing-change",
  pastPerfect,
  tenses,
]);

/** readingScience is the reading unit of the theme Science and Discovery. */
export const readingScience: ReadingUnitDef = {
  id: "b1-reading-science",
  title: t("Science and Discovery", "科学与发现"),
  passages: [
    passage({
      id: "b1-science-the-telescope",
      title: ["How the Telescope Changed What We Know", "望远镜如何改变了我们的认识"],
      body: `Four hundred years ago, most people believed that the Earth was the center of the universe, and that the sun, the moon and the stars moved around it. The night sky looked the same as it had always looked: a few thousand points of light, and nothing more.

Then, in 1609, an Italian scientist called Galileo heard about a new invention from the Netherlands: two pieces of glass that made things far away look bigger and nearer. He built his own telescope and turned it to the sky. What he saw changed science forever.

He saw that the moon was not a simple, bright ball, as people had believed, but had mountains and valleys like the Earth. He saw that there were far more stars than anyone could see with their eyes alone. And he observed four small moons that moved around the planet Jupiter. This was a breakthrough: here was clear evidence that not everything orbited the Earth.

Galileo's observations supported a theory that a Polish astronomer, Copernicus, had published many years before: the Earth and the other planets orbit the sun. Many important people did not want to accept this idea, and Galileo spent the last years of his life in his own house, because he was not allowed to leave it.

Since then, telescopes have become much bigger and better. Today, some of them are satellites that orbit the Earth, high above the clouds and the lights of cities. They have shown us that our sun is one of billions of stars in our galaxy, and that there are billions of galaxies in the universe.

Every time astronomers have built a better telescope, they have found something they did not expect. Nobody knows what the next one will show us.`,
      grammar: [pastPerfect, tenses],
      names: ["Earth", "Italian", "Galileo", "Galileo's", "Netherlands", "Jupiter", "Polish", "Copernicus"],
      questions: [
        [
          ["What did Galileo see on the moon?", "伽利略在月球上看到了什么？"],
          ["Mountains and valleys, like those on the Earth", "像地球上一样的山和谷"],
          [
            ["A simple, bright surface with nothing on it", "什么也没有的明亮平面"],
            ["Four small moons that moved around it", "四颗绕着它转的小卫星"],
          ],
          [
            '"The moon was not a simple, bright ball, as people had believed, but had mountains and valleys like the Earth." The four moons moved around Jupiter.',
            "月球并不像人们以为的那样只是一个明亮的球，而是像地球一样有山有谷；那四颗卫星绕的是木星。",
          ],
        ],
        [
          ["Why were the moons of Jupiter important?", "木星的卫星为什么重要？"],
          ["They showed that not everything orbited the Earth", "它们表明并非所有天体都绕地球运行"],
          [
            ["They proved that Jupiter was the center of everything", "它们证明木星是万物的中心"],
            ["They showed that the Earth had four moons as well", "它们表明地球也有四颗卫星"],
          ],
          [
            '"This was a breakthrough: here was clear evidence that not everything orbited the Earth."',
            "这是一次突破：它清楚地证明了并非所有东西都绕着地球转。",
          ],
        ],
        [
          ["What does the passage say about modern telescopes?", "关于现代望远镜，文章说了什么？"],
          ["Some of them orbit the Earth above the clouds", "有些在云层之上绕地球运行"],
          [
            ["They are smaller than Galileo's telescope", "它们比伽利略的望远镜小"],
            ["They only show the stars of our own galaxy", "它们只能看到我们银河系的恒星"],
          ],
          [
            '"Some of them are satellites that orbit the Earth, high above the clouds." They have shown billions of other galaxies.',
            "有些望远镜是绕地球运行的卫星；它们让我们看到了数十亿个其他星系。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-science-the-accidental-discovery",
      title: ["The Accidental Discovery", "意外的发现"],
      body: `In September 1928, a Scottish scientist called Alexander Fleming came back to his laboratory in London after a holiday. Before he left, he had grown bacteria in a number of small glass dishes, and he had left them on a table in the corner instead of cleaning them.

When he looked at the dishes, he noticed something strange. A green mold had grown on one of them. Around the mold there was a clear ring where the bacteria had died. Something from the mold was making them die.

Many scientists would have thrown the dish away. Fleming did not. He wanted to know why, so he grew more of the mold and did experiments with the substance it made. He found that it destroyed many types of dangerous bacteria, but did not seem to harm the cells of our bodies. He called it penicillin.

However, Fleming could not make enough of it, and it was hard to keep. For more than ten years, hardly anyone used it. Then, during the Second World War, a team of scientists at Oxford found a way to make it in large amounts. Factories in Britain and the United States started making it, and by 1944 there was enough for thousands of people who were hurt in the war.

Penicillin was the first antibiotic, and it has saved millions of lives. Before penicillin, a person could die from a small cut if bacteria got into it.

Was it just luck? In part, yes. If Fleming had cleaned his dishes, or if the weather had been different that summer, the mold might never have grown. But many people had seen mold destroy bacteria before and hadn't thought about it. Fleming's real genius was that he noticed, and asked why. As one scientist said, luck comes to the people who are ready for it.`,
      grammar: [pastPerfect],
      names: ["Scottish", "Alexander", "Fleming", "Fleming's", "London", "Second", "World", "War", "Oxford", "Britain", "United", "States"],
      glossed: ["bacteria", "mold", "penicillin", "antibiotic"],
      questions: [
        [
          ["What did Fleming notice on one of the dishes?", "弗莱明在其中一个培养皿上注意到了什么？"],
          ["The bacteria had died in a ring around a mold", "霉菌周围一圈的细菌都死了"],
          [
            ["The bacteria had grown much faster than usual", "细菌长得比平时快得多"],
            ["The mold had killed the human cells in the dish", "霉菌杀死了培养皿里的人体细胞"],
          ],
          [
            '"Around the mold there was a clear ring where the bacteria had died." The substance did not seem to harm the cells of our bodies.',
            "霉菌周围出现了一圈细菌死亡的透明区域；这种物质似乎并不伤害人体细胞。",
          ],
        ],
        [
          ["Why did hardly anyone use penicillin for ten years?", "为什么十多年里几乎没人使用青霉素？"],
          ["Fleming could not produce enough of it", "弗莱明无法生产足够的青霉素"],
          [
            ["It harmed the cells of our bodies", "它会伤害人体细胞"],
            ["Doctors did not believe Fleming's results", "医生们不相信弗莱明的结果"],
          ],
          [
            '"Fleming could not make enough of it, and it was hard to keep. For more than ten years, hardly anyone used it."',
            "弗莱明产量不够，青霉素也难以保存，所以十多年里几乎没人用。",
          ],
        ],
        [
          ['What was Fleming\'s "real genius", according to the passage?', "根据文章，弗莱明真正的天才之处是什么？"],
          ["He noticed something and asked why", "他注意到了异常并追问原因"],
          [
            ["He was the only one who had ever seen mold", "他是唯一见过霉菌的人"],
            ["He had planned the discovery for many years", "他为这一发现计划了很多年"],
          ],
          [
            "\"Many people had seen mold destroy bacteria before and hadn't thought about it. Fleming's real genius was that he noticed, and asked why.\"",
            "很多人见过霉菌杀死细菌却没多想，弗莱明的过人之处在于他注意到了并追问原因。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-science-why-the-sky-has-layers",
      title: ["Why the Sky Has Layers", "天空为什么分层"],
      body: `When you look up on a clear day, the sky seems empty. But the air above us is not the same all the way up. Scientists describe the atmosphere, the air around the Earth, as five layers, and each one is different.

The lowest layer starts at the ground and goes up to about twelve kilometers. Almost all of our weather happens here: clouds, rain, snow and storms. It also has most of the air: about three quarters of the total mass of the atmosphere. The higher you go in this layer, the colder it gets. At the top, the temperature is about fifty-five degrees below zero.

Above it is a layer that goes up to about fifty kilometers. It has the ozone layer, which protects life on Earth. Ozone is a kind of oxygen, and it takes in most of the dangerous light from the sun before it gets to the ground. This layer gets warmer as you go up, because the ozone is heated by the light it takes in. Large planes sometimes fly in the lowest part of this layer, above the weather, where the air is calm.

Higher still, between fifty and eighty-five kilometers, the air is very thin and very cold. This is where most meteors burn: small pieces of rock from space that hit the atmosphere at a very high speed. When we see a "falling star", we are watching one of them burn.

Above that, the air is so thin that there is almost nothing there. The temperature rises again, to more than a thousand degrees, but you would not feel warm, because there are so few particles. This is where the International Space Station orbits, about four hundred kilometers above us. Finally, the highest layer gradually disappears into space.

Without these layers, there would be no weather, nothing to protect us from the sun and no air to breathe. The empty sky is really very busy.`,
      names: ["Earth", "International", "Space", "Station"],
      glossed: ["atmosphere", "ozone", "meteors"],
      questions: [
        [
          ["Where does almost all of our weather happen?", "几乎所有天气现象发生在哪里？"],
          ["In the lowest layer, below about twelve kilometers", "在最低的一层，大约十二公里以下"],
          [
            ["In the layer with the ozone, below fifty kilometers", "在有臭氧的那一层，五十公里以下"],
            ["In the highest layer, where the air is very thin", "在空气非常稀薄的最高层"],
          ],
          [
            '"The lowest layer starts at the ground and goes up to about twelve kilometers. Almost all of our weather happens here."',
            "最低的一层从地面到大约十二公里，几乎所有的天气都发生在这里。",
          ],
        ],
        [
          ["Why does the second layer get warmer as you go up?", "为什么第二层越往上越暖？"],
          ["The ozone is heated by the light it takes in", "臭氧吸收阳光后被加热"],
          [
            ["The top of the layer is closer to the sun", "这一层的顶部离太阳更近"],
            ["The large planes heat the air as they fly", "大型飞机飞行时把空气加热了"],
          ],
          [
            '"This layer gets warmer as you go up, because the ozone is heated by the light it takes in."',
            "这一层越往上越暖，是因为臭氧吸收阳光而被加热。",
          ],
        ],
        [
          ["Why would you not feel warm in the layer above eighty-five kilometers?", "为什么在八十五公里以上的那一层你不会觉得暖？"],
          ["There are so few particles there", "那里的微粒太少了"],
          [
            ["The temperature there is below zero", "那里的温度低于零度"],
            ["The space station protects you from the heat", "空间站为你挡住了热量"],
          ],
          [
            '"The temperature rises again, to more than a thousand degrees, but you would not feel warm, because there are so few particles."',
            "那里温度超过一千度，但微粒极少，所以人不会感觉到热。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-science-a-mission-to-a-comet",
      title: ["A Mission to a Comet", "飞向彗星的任务"],
      body: `In March 2004, a spacecraft called Rosetta was launched from South America. Its mission was to do something that no spacecraft had ever done: to fly next to a comet, orbit it, and land a small robot on its surface.

Comets are balls of ice and rock that travel around the sun. Scientists think that they have hardly changed since the beginning of the planets, about four and a half billion years ago. Studying one is like looking billions of years into the past. Some scientists also believe that comets may have brought water to the early Earth.

Getting to a comet is not easy. The comet that Rosetta was sent to, called 67P, was moving at a great speed, so the spacecraft had to travel for ten years and use the gravity of the Earth and Mars to increase its own speed. For almost three years of the journey, Rosetta was so far from the sun that it did not have enough power, so the scientists turned it off. Nobody knew for certain that it would wake up again. In January 2014, it did, and the team cheered.

In August 2014, Rosetta arrived at the comet and began to orbit it. The pictures surprised everyone: 67P looked like a huge toy duck, about four kilometers long, with a dark surface full of rocks and high walls of stone.

In November, the small robot, Philae, was sent down. It was meant to fix itself to the surface, but this failed. It hit the ground and jumped up two times before it stopped in a dark place behind a high rock. Without light from the sun, its batteries ran out after about sixty hours. But in that short time, it sent back important information.

Rosetta stayed with the comet and studied it for two more years. In 2016, the team let it crash slowly onto the surface, and the mission ended.`,
      grammar: [tenses],
      names: ["Rosetta", "South", "America", "Earth", "P", "Mars", "Philae"],
      questions: [
        [
          ["Why do scientists want to study comets?", "科学家为什么想研究彗星？"],
          ["They have hardly changed since the planets began", "自行星形成以来，它们几乎没有变化"],
          [
            ["They are made mostly of metal and steel", "它们主要由金属和钢构成"],
            ["They are the closest objects to the Earth", "它们是离地球最近的天体"],
          ],
          [
            '"They have hardly changed since the beginning of the planets... Studying one is like looking billions of years into the past."',
            "彗星自行星形成以来几乎没变，研究它就像回望遥远的过去。",
          ],
        ],
        [
          ["Why was Rosetta turned off for almost three years?", "罗塞塔号为什么关机了将近三年？"],
          ["It was too far from the sun to have enough power", "它离太阳太远，电力不足"],
          [
            ["Its robot had stopped working on the comet", "它的机器人在彗星上停止了工作"],
            ["The scientists had no more money for it", "科学家们没有钱继续支持它了"],
          ],
          [
            '"Rosetta was so far from the sun that it did not have enough power, so the scientists turned it off."',
            "罗塞塔号离太阳太远，电力不够，科学家只好让它关机。",
          ],
        ],
        [
          ["What happened to Philae?", "菲莱号怎么样了？"],
          ["It stopped in a dark place, so its batteries ran out", "它停在阴暗处，电池很快耗尽"],
          [
            ["It fixed itself to the surface and worked for years", "它固定在表面上工作了好几年"],
            ["It flew back to the Earth with pieces of the comet", "它带着彗星的碎块飞回了地球"],
          ],
          [
            '"It hit the ground and jumped up two times before it stopped in a dark place behind a high rock. Without light from the sun, its batteries ran out after about sixty hours."',
            "菲莱号弹跳两次后停在一块高岩石后面的阴暗处，没有阳光，电池大约六十小时后就耗尽了。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-science-genes-and-families",
      title: ["Genes and Families", "基因与家庭"],
      body: `Why do you have the same eyes as your mother, or the same nose as your grandfather? The answer is in your genes.

Almost every cell in your body has a long list of instructions, written in a chemical called DNA. These instructions are in about twenty thousand genes. Each gene helps to build a part of you, such as the color of your eyes, the shape of your ears or the type of your blood.

You get two copies of each gene: one from your mother and one from your father. This is why children look similar to their parents, but not exactly the same. Brothers and sisters get a different mix of their parents' genes, so they can look very different from each other, unless they are twins who come from one egg, who have the same genes.

Sometimes one copy of a gene is stronger than the other. For example, if you get a gene for brown eyes from one parent and a gene for blue eyes from the other, you will probably have brown eyes. But you still carry the gene for blue eyes, and you can pass it to your own children. That is how two parents with brown eyes can have a child with blue eyes.

Genes affect more than how we look. They can make it easier for some people to get certain illnesses, and scientists are investigating how genes affect how tall we become, and even our personality. But genes are not the whole story. A child who has genes for being tall will not grow tall without enough food, and a child with a talent for music will not play the piano well without practice.

Most experts now agree that we are the outcome of our genes and our environment together. Your genes give you a starting point. What you do with it is up to you.`,
      names: ["DNA"],
      questions: [
        [
          ["Where do your two copies of each gene come from?", "每个基因的两个拷贝分别来自哪里？"],
          ["One from your mother and one from your father", "一个来自母亲，一个来自父亲"],
          [
            ["Both from the parent you look like most", "都来自你最像的那位父母"],
            ["One from each of your two grandfathers", "分别来自你的两位祖父辈"],
          ],
          [
            '"You get two copies of each gene: one from your mother and one from your father."',
            "每个基因你都有两个拷贝，一个来自母亲，一个来自父亲。",
          ],
        ],
        [
          ["How can two parents with brown eyes have a child with blue eyes?", "两个棕色眼睛的父母怎么会生出蓝眼睛的孩子？"],
          ["They can both carry a gene for blue eyes", "他们都可能携带蓝眼睛的基因"],
          [
            ["The child's genes change after it is born", "孩子的基因出生后会改变"],
            ["The color of eyes does not come from genes", "眼睛的颜色不是由基因决定的"],
          ],
          [
            '"You still carry the gene for blue eyes, and you can pass it to your own children. That is how two parents with brown eyes can have a child with blue eyes."',
            "棕眼睛的人仍可能携带蓝眼睛基因并传给孩子，所以两个棕眼睛的父母能生出蓝眼睛的孩子。",
          ],
        ],
        [
          ["What do most experts now agree on?", "大多数专家现在在哪一点上意见一致？"],
          ["We are the outcome of our genes and our environment", "我们是基因和环境共同作用的结果"],
          [
            ["Genes decide everything about our personality", "基因决定我们性格的一切"],
            ["Our environment matters more than genes in everything", "在所有方面环境都比基因更重要"],
          ],
          [
            '"Most experts now agree that we are the outcome of our genes and our environment together."',
            "大多数专家认为，我们是基因和环境共同塑造的。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-science-the-scientist-who-doubted-herself",
      title: ["The Scientist Who Doubted Herself", "怀疑自己的科学家"],
      body: `When Lin Hua got a job at one of the best research centers in the country, her first thought was not "Great!" It was "They have made a mistake."

She had worked hard for years. She had studied cells at university for eight years, published her research and won a prize. But when she walked into the laboratory on her first day, she was sure that everyone else was more brilliant than she was. "I thought that one day they would discover that I wasn't good enough," she says.

This feeling is more common than you might think. It has a name: impostor syndrome. People who have it believe that their success comes from luck, not ability, and they are afraid that others will find out. Some studies suggest that up to seventy percent of people feel this way at some point in their lives, and it is especially common in scientists, doctors and students at top universities.

For two years, Lin hardly spoke when the team met. When she had an idea, she waited for someone else to say it first. Once, she noticed a mistake in some numbers a colleague had calculated, but she didn't mention it, because she thought that she must be wrong. A month later, the team found the same mistake, and they had to repeat the whole experiment.

Things changed when she told an older colleague how she felt. To her surprise, the colleague laughed. "I have felt like that for thirty years," she said. "The secret is to notice the feeling and act anyway."

Today Lin leads her own team. She still doubts herself sometimes, but she has learned to see the doubt as a feeling, not a fact. "Good scientists doubt everything," she says. "I just had to learn to doubt myself a little less."`,
      grammar: [pastPerfect],
      names: ["Lin", "Hua"],
      glossed: ["impostor", "syndrome"],
      questions: [
        [
          ["What did Lin think when she got the job?", "林华得到这份工作时是怎么想的？"],
          ["That they had made a mistake", "觉得对方弄错了"],
          [
            ["That she deserved a better job", "觉得自己配得上更好的工作"],
            ["That the center was not good enough", "觉得那个研究中心不够好"],
          ],
          ["Her first thought \"was 'They have made a mistake.'\"", "她的第一个念头是“他们弄错了”。"],
        ],
        [
          ["What happened because Lin didn't mention the mistake?", "林华没有指出错误，结果怎样？"],
          ["The team had to repeat the whole experiment", "整个团队只好把实验重做一遍"],
          [
            ["Her colleague lost his job at the center", "她的同事丢了工作"],
            ["The team won a prize for the results", "团队凭这些结果获了奖"],
          ],
          [
            '"A month later, the team found the same mistake, and they had to repeat the whole experiment."',
            "一个月后团队发现了同样的错误，只好重做整个实验。",
          ],
        ],
        [
          ["What advice did the older colleague give?", "那位年长的同事给了什么建议？"],
          ["Notice the feeling and act anyway", "觉察这种感觉，但照样去做"],
          [
            ["Wait until the feeling goes away", "等这种感觉消失再说"],
            ["Let others say your ideas first", "让别人先说出你的想法"],
          ],
          ['"The secret is to notice the feeling and act anyway."', "诀窍是意识到这种感觉，但仍然行动。"],
        ],
      ],
    }),
    passage({
      id: "b1-science-the-speed-of-sound",
      title: ["Measuring the Speed of Sound", "测量声速"],
      body: `During a storm, you see lightning, and a few seconds later you hear the thunder. Why does the sound come later, if both are caused by the same event?

The answer is that light and sound travel at very different speeds. Light is the fastest thing in the universe: it travels about three hundred thousand kilometers in a single second. Sound is much slower. In air, it travels about 340 meters in a second.

This difference gives you a simple way to estimate how far away a storm is. When you see the lightning, check how many seconds pass until you hear the thunder. Every three seconds are about one kilometer, so if six seconds pass, the storm is about two kilometers away. If the time between the lightning and the thunder gets shorter, the storm is coming nearer.

Scientists first tried to measure the speed of sound about four hundred years ago, with a similar idea. One person made a very loud noise on a hill and showed a light at the same moment. People on another hill, a known distance away, measured the time between seeing the light and hearing the noise. Their first results were not very good, because their clocks were poor, but over many years the results improved.

They also discovered that the speed of sound is not constant. Sound travels faster in warm air than in cold air. It travels about four times faster in water than in air, and even faster through solid things such as steel. That is why, if you hit one end of a long piece of steel, a person at the other end hears the sound through the steel before it arrives through the air.

Today, the speed of sound is used in many ways. Ships use it to find out how far down the sea floor is: they send a sound down and calculate how long it takes to come back. And doctors use very high sounds to make pictures of babies before they are born.`,
      questions: [
        [
          ["Why do we hear thunder after we see lightning?", "为什么我们先看到闪电后听到雷声？"],
          ["Sound travels much more slowly than light", "声音传播得比光慢得多"],
          [
            ["Thunder starts a few seconds after the lightning", "雷声在闪电几秒钟后才产生"],
            ["Sound travels faster in cold air than in warm air", "声音在冷空气中比在暖空气中传得快"],
          ],
          [
            '"Light and sound travel at very different speeds... Sound is much slower." Both come from the same event, and sound is faster in warm air.',
            "闪电和雷声来自同一事件，只是声音比光慢得多；而且声音在暖空气中更快。",
          ],
        ],
        [
          [
            "Nine seconds pass between the lightning and the thunder. How far away is the storm?",
            "闪电和雷声之间隔了九秒，暴风雨离你多远？",
          ],
          ["About three kilometers", "大约三公里"],
          [
            ["About nine kilometers", "大约九公里"],
            ["About twenty-seven kilometers", "大约二十七公里"],
          ],
          [
            '"Every three seconds are about one kilometer." Nine seconds are three times three seconds.',
            "每三秒大约相当于一公里，九秒就是三公里。",
          ],
        ],
        [
          ["Where does sound travel fastest, according to the passage?", "根据文章，声音在哪里传播得最快？"],
          ["Through solid things such as steel", "在钢这样的固体中"],
          [
            ["Through cold air", "在冷空气中"],
            ["Through warm air", "在暖空气中"],
          ],
          [
            '"It travels about four times faster in water than in air, and even faster through solid things such as steel."',
            "声音在水中比在空气中快约四倍，在钢等固体中更快。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-science-from-prototype-to-product",
      title: ["From Prototype to Product", "从样机到产品"],
      body: `Everything you use, from a pen to your phone, started as an idea. But between an idea and a product in a shop, there is a long and difficult journey.

First there is usually a drawing, and then a prototype: a first, simple example of the product, made to test whether the idea works. Prototypes are often ugly, and most of them fail. The British inventor James Dyson built 5,127 prototypes of a new kind of cleaner over five years before he was happy with one.

Each prototype goes through tests, and the results show what needs to change. Is it too heavy? Does it break when it falls? Do people understand how to use it without reading the instructions? Designers often give prototypes to ordinary people and observe them. They are often surprised: people use things in ways the designers never predicted.

When the prototype finally works, new problems begin. A product that one person can build by hand in a laboratory must now be made by the thousand in a factory, quickly and for little money. The materials may need to change. A part that worked well in the prototype might be impossible to make in large numbers.

Many inventors also ask for a patent. A patent is a document that says that, for about twenty years, nobody else may make or sell the invention unless the inventor agrees. This protects the idea of the inventor, but getting a patent can take years and cost a lot of money.

Finally, the product must find customers. Many brilliant inventions have failed because they were too expensive, because nobody understood what they were for, or because another company was faster.

Experts estimate that only a small percentage of new ideas ever get to the shops. The journey from prototype to product needs more than a good idea. It needs time, hard work and the will to fail many times and try again.`,
      names: ["British", "James", "Dyson"],
      questions: [
        [
          ["Why are prototypes made?", "为什么要制作样机？"],
          ["To test whether an idea works", "为了测试想法是否可行"],
          [
            ["To sell to the first customers", "为了卖给第一批顾客"],
            ["To show the product in shops", "为了在商店里展示产品"],
          ],
          [
            '"A prototype: a first, simple example of the product, made to test whether the idea works."',
            "样机是产品最初的简单模型，用来测试想法是否可行。",
          ],
        ],
        [
          ["What often surprises designers when they observe users?", "设计师观察用户时常常对什么感到意外？"],
          ["People use things in ways nobody predicted", "人们使用东西的方式出乎意料"],
          [
            ["Users always read the instructions first", "用户总是先读说明书"],
            ["Users like the ugly prototypes the most", "用户最喜欢丑陋的样机"],
          ],
          [
            '"They are often surprised: people use things in ways the designers never predicted."',
            "设计师常常惊讶地发现，人们使用东西的方式是他们从未预料到的。",
          ],
        ],
        [
          ["What does a patent do?", "专利有什么作用？"],
          ["It stops others copying the invention for years", "它在多年内阻止别人仿制这项发明"],
          [
            ["It lets the inventor sell the product in any shop", "它让发明者能在任何商店出售产品"],
            ["It proves that the invention really works well", "它证明这项发明确实好用"],
          ],
          [
            '"For about twenty years, nobody else may make or sell the invention unless the inventor agrees."',
            "专利规定大约二十年内，未经许可别人不得制造或出售这项发明。",
          ],
        ],
      ],
    }),
  ],
};
