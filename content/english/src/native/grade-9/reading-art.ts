// Grade 9: the reading unit of the eighth theme, art and its subjects, from paintings that became poems and plays
// that became ballets to the first films and the critics who named a movement by mocking it.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const artWords = { topic: "words-of-art-and-criticism", weight: 0.3 } as const;
const musicWords = { topic: "words-of-music-and-performance", weight: 0.3 } as const;
const filmWords = { topic: "words-of-film", weight: 0.3 } as const;
const mediums = { topic: "a-subject-in-two-mediums", weight: 0.2 } as const;
const perspective = { topic: "perspective-from-another-culture", weight: 0.2 } as const;
const courageWords = { topic: "words-of-courage-and-fear", weight: 0.3 } as const;
const academic1 = { topic: "academic-words-1", weight: 0.1 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;

/** artAndItsSubjects is a reading unit of grade 9 on painting, music and film and how one subject changes between them. */
export const artAndItsSubjects: ReadingUnitDef = {
  id: "art-and-its-subjects",
  title: t("Art and Its Subjects", "艺术及其题材"),
  passages: [
    passage(
      "the-boy-who-fell-unnoticed",
      t("The Boy Who Fell Unnoticed", "无人察觉的坠落"),
      `In Greek myth, Daedalus, a brilliant inventor, made wings of feathers and wax so that he and his son, Icarus, could escape from the island of Crete. He warned the boy not to fly too close to the sun. Icarus, thrilled by flight, climbed higher and higher until the wax melted, and he fell into the sea and drowned.

Around 1560, a painting now known as Landscape with the Fall of Icarus was made in the style of the Flemish artist Pieter Bruegel the Elder. Scholars now think it is probably an early copy of a lost original by Bruegel. What is striking about the painting is how little of it shows the myth. Most of the canvas is filled with an ordinary scene: a farmer ploughs a field in the foreground, a shepherd gazes at the sky, a fisherman sits by the water and a great ship sails across a calm, shining sea. Icarus is almost impossible to find. In the lower right corner, two small white legs are splashing in the water. That is all. No one in the painting notices.

In 1938, the English poet W. H. Auden visited the Museum of Fine Arts in Brussels and saw the painting. He wrote a poem called “Musée des Beaux Arts” about what it shows. The old painters, the poem says, understood suffering. They knew that it takes place while other people are eating, or opening a window, or just walking dully along. In Bruegel's Icarus, everything turns away quite leisurely from the disaster. The ploughman may have heard the splash, but for him it was not an important failure. The expensive ship must have seen a boy falling out of the sky, but it had somewhere to get to and sailed calmly on.

Auden's poem does something the painting cannot. It tells us what to notice, and it adds a quiet, ironic voice. The painting, on the other hand, makes us search, and in searching, we become one of the people who almost miss the fall. Together, the two works show how a single subject can change its meaning as it moves from one medium to another.`,
      [artWords, mediums],
      [
        ask(
          t("What is striking about how the painting shows the myth?", "这幅画表现神话的方式有什么醒目之处？"),
          t("Icarus is almost impossible to find among ordinary scenes", "伊卡洛斯淹没在日常景象中，几乎找不到"),
          [
            t("Icarus fills most of the canvas", "伊卡洛斯占据了大部分画面"),
            t("The sun is painted black", "太阳被画成黑色"),
            t("Daedalus is shown building the wings", "画中描绘代达罗斯在制作翅膀"),
          ],
          t(
            "The second paragraph says most of the canvas is filled with an ordinary scene and Icarus is almost impossible to find.",
            "第二段说画面大部分是日常景象，几乎找不到伊卡洛斯。",
          ),
        ),
        ask(
          t("According to Auden's poem, what did the old painters understand about suffering?", "根据奥登的诗，古代画家对苦难有什么理解？"),
          t("It takes place while other people go on with ordinary life", "苦难发生时，其他人照常过着日常生活"),
          [
            t("It always happens in the sky", "它总是发生在天上"),
            t("It should never be painted", "它永远不应被画出来"),
            t("Everyone stops to help when it happens", "苦难发生时人人都会停下来帮忙"),
          ],
          t(
            "The third paragraph says the old painters knew suffering takes place while others are eating, opening a window or walking dully along.",
            "第三段说古代画家明白，苦难发生时别人正在吃饭、开窗或无聊地走着。",
          ),
        ),
        ask(
          t("What can the poem do that the painting cannot?", "这首诗能做到哪些画做不到的事？"),
          t("Tell us what to notice and add an ironic voice", "告诉我们该注意什么，并加入一种反讽的声音"),
          [
            t("Show the colors of the sea", "表现大海的颜色"),
            t("Make us search for Icarus", "让我们去寻找伊卡洛斯"),
            t("Show the farmer ploughing", "表现农夫耕地"),
          ],
          t(
            "The last paragraph says Auden's poem tells us what to notice and adds a quiet, ironic voice, while the painting makes us search.",
            "最后一段说奥登的诗告诉我们该注意什么，并加入一种平静而反讽的声音，而画则让我们去寻找。",
          ),
        ),
      ],
      [
        "Greek",
        "Daedalus",
        "Icarus",
        "Crete",
        "Landscape",
        "Fall",
        "Flemish",
        "Pieter",
        "Bruegel",
        "Elder",
        "English",
        "W.",
        "H.",
        "Auden",
        "Museum",
        "Fine",
        "Arts",
        "Brussels",
        "Musée",
        "des",
        "Beaux",
        "Bruegel's",
        "Auden's",
      ],
      ["ploughman"],
    ),
    passage(
      "named-by-an-insult",
      t("Named by an Insult", "以嘲讽命名"),
      `In April 1874, a group of young painters who had been rejected by the official art exhibition in Paris decided to hold an exhibition of their own. Among them were Claude Monet, Pierre-Auguste Renoir, Camille Pissarro, Edgar Degas and Berthe Morisot. Their work broke many of the rules taught in the academies.

The official taste of the time preferred smooth, carefully finished paintings of historical and religious subjects, with invisible brushstrokes and soft, controlled colors. The young painters did almost the opposite. They often worked outdoors, quickly, trying to capture the changing effects of light at a particular moment. They painted ordinary subjects: boats on a river, people dancing in a café, a railway station full of steam. Their brushstrokes were loose and visible, and their colors were bright.

One of the paintings Monet showed was a view of the harbor of Le Havre in the early morning. Orange sun glows through blue mist, and dark shapes of boats are suggested with a few quick strokes. He called it Impression, Sunrise.

A critic named Louis Leroy visited the exhibition and wrote a mocking review in a satirical newspaper. He invented a conversation with an imaginary old painter who grows more and more horrified as he walks through the rooms. In front of Monet's painting, the old man exclaims that wallpaper in its first stage is more finished than this. Leroy titled his article “The Exhibition of the Impressionists.” He meant it as an insult: these painters, he suggested, could produce only vague impressions, not real art.

The painters adopted the name anyway. Within a few years, they were calling their own exhibitions Impressionist. Critics and collectors slowly came to admire what they had once laughed at, and today Impressionist paintings are among the most loved, and most expensive, in the world.

The story is a reminder that critics can be wrong, especially about new art. It also shows how a movement can take an insult and turn it into a banner. The Impressionists did not ask for their name, but by accepting it, they made it mean something new.`,
      [artWords, academic2],
      [
        ask(
          t("Why did the young painters hold their own exhibition?", "年轻画家们为什么自己举办展览？"),
          t("They had been rejected by the official exhibition", "他们被官方展览拒之门外"),
          [
            t("They wanted to sell their paintings to the king", "他们想把画卖给国王"),
            t("The official exhibition had closed", "官方展览已经停办了"),
            t("A critic asked them to", "一位评论家请他们这样做"),
          ],
          t(
            "The first paragraph says they had been rejected by the official art exhibition in Paris and decided to hold one of their own.",
            "第一段说他们被巴黎的官方美术展拒绝，决定自己办展。",
          ),
        ),
        ask(
          t("How did the young painters' work differ from the official taste?", "年轻画家的作品与官方趣味有何不同？"),
          t("They used loose, visible brushstrokes and bright colors to capture light", "他们用松散可见的笔触和明亮的色彩捕捉光线"),
          [
            t("They painted only religious subjects", "他们只画宗教题材"),
            t("They hid their brushstrokes completely", "他们完全隐藏笔触"),
            t("They worked only indoors from memory", "他们只在室内凭记忆作画"),
          ],
          t(
            "The second paragraph says they worked quickly outdoors to capture light, with loose and visible brushstrokes and bright colors.",
            "第二段说他们在户外快速作画以捕捉光线，笔触松散可见，色彩明亮。",
          ),
        ),
        ask(
          t("What did Leroy mean by calling the painters Impressionists?", "勒鲁瓦称这些画家为“印象派”是什么意思？"),
          t("That they could produce only vague impressions, not real art", "他们只能画出模糊的印象，而非真正的艺术"),
          [
            t("That they had made a strong impression on him", "他们给他留下了深刻印象"),
            t("That they were the best painters in Paris", "他们是巴黎最好的画家"),
            t("That they printed their paintings", "他们把画作印刷出来"),
          ],
          t(
            "The fourth paragraph says he meant it as an insult, suggesting they could produce only vague impressions, not real art.",
            "第四段说他把这当作一种侮辱，暗指他们只能画出模糊的印象，而非真正的艺术。",
          ),
        ),
      ],
      [
        "April",
        "Paris",
        "Claude",
        "Monet",
        "Pierre-Auguste",
        "Renoir",
        "Camille",
        "Pissarro",
        "Edgar",
        "Degas",
        "Berthe",
        "Morisot",
        "Le",
        "Havre",
        "Impression",
        "Sunrise",
        "Louis",
        "Leroy",
        "Monet's",
        "Exhibition",
        "Impressionists",
        "Impressionist",
      ],
      ["brushstrokes", "satirical"],
    ),
    passage(
      "a-painting-against-war",
      t("A Painting Against War", "一幅反战的画"),
      `On April 26, 1937, during the Spanish Civil War, warplanes from Nazi Germany and Fascist Italy, supporting the Spanish general Francisco Franco, bombed the small Basque town of Guernica. It was a market day. For several hours, bombs fell on the town, and much of it burned. Hundreds of people were killed. It was one of the first times in history that a town full of ordinary people had been destroyed from the air.

In Paris, the Spanish artist Pablo Picasso had been asked by the Spanish government to paint a large work for the World's Fair that summer. When he read the newspaper reports and saw the photographs of Guernica, he abandoned his earlier ideas and began a new painting. He worked on it with furious speed. In just over a month, he finished a canvas more than three meters high and nearly eight meters wide.

Guernica does not show the planes or the town. Instead, it shows suffering. Painted only in black, white and gray, like a newspaper photograph, it is a crowded scene of broken figures. A mother screams with her dead child in her arms. A horse shrieks in agony, its body pierced. A fallen soldier lies in pieces, still gripping a broken sword. A woman leans through a window holding out a lamp, as if trying to see what has happened. Above everything, an electric light bulb glares like an eye.

Picasso refused to explain the meaning of the bull and the horse, saying that viewers must decide for themselves. But the painting's power does not depend on explanation. Its shapes are twisted and flattened in Picasso's modern style, yet the feeling of terror is immediate.

After the World's Fair, Guernica toured the world to raise money for refugees. Picasso said it should not return to Spain until democracy was restored there. It finally arrived in 1981, after Franco's death and Picasso's own.

The painting has become one of the most famous images against war. A copy hangs at the headquarters of the United Nations in New York, a reminder of what happens when the violence of war falls on those who never chose to fight.`,
      [artWords, mediums],
      [
        ask(
          t("Why did Picasso abandon his earlier ideas for the World's Fair painting?", "毕加索为什么放弃了为世界博览会作画的原有构思？"),
          t("He read the reports and saw the photographs of Guernica", "他读到报道并看到了格尔尼卡的照片"),
          [
            t("The Spanish government rejected them", "西班牙政府拒绝了它们"),
            t("He ran out of paint", "他的颜料用完了"),
            t("The fair was canceled", "博览会取消了"),
          ],
          t(
            "The second paragraph says that when he read the reports and saw the photographs of Guernica, he abandoned his earlier ideas.",
            "第二段说他读到格尔尼卡的报道并看到照片后，放弃了原有的构思。",
          ),
        ),
        ask(
          t("Why might Picasso have painted Guernica only in black, white and gray?", "毕加索为什么可能只用黑、白、灰来画《格尔尼卡》？"),
          t("To make it look like a newspaper photograph", "让它看起来像一张报纸照片"),
          [
            t("Because color paint was too expensive", "因为彩色颜料太贵"),
            t("Because the canvas was too large for color", "因为画布太大，不适合用彩色"),
            t("Because the government ordered it", "因为政府下了命令"),
          ],
          t(
            "The third paragraph says it was painted only in black, white and gray, like a newspaper photograph.",
            "第三段说它只用黑、白、灰绘成，就像一张报纸照片。",
          ),
        ),
        ask(
          t("When did Picasso say the painting could return to Spain?", "毕加索说这幅画什么时候才能回到西班牙？"),
          t("When democracy was restored there", "当西班牙恢复民主时"),
          [
            t("After the World's Fair ended", "世界博览会结束后"),
            t("When Guernica was rebuilt", "格尔尼卡重建后"),
            t("When he finished explaining it", "当他解释完这幅画时"),
          ],
          t(
            "The fifth paragraph says Picasso said it should not return to Spain until democracy was restored there.",
            "第五段说毕加索表示，在西班牙恢复民主之前，这幅画不应回去。",
          ),
        ),
      ],
      [
        "April",
        "Spanish",
        "Civil",
        "War",
        "Nazi",
        "Germany",
        "Fascist",
        "Italy",
        "Francisco",
        "Franco",
        "Basque",
        "Guernica",
        "Paris",
        "Pablo",
        "Picasso",
        "World's",
        "Fair",
        "Picasso's",
        "Spain",
        "Franco's",
        "United",
        "Nations",
        "New",
        "York",
      ],
    ),
    passage(
      "the-great-wave",
      t("The Great Wave", "神奈川冲浪里"),
      `It may be the most famous image ever made in Asia. A huge wave curls over three narrow boats, its white crest breaking into claw-like fingers of foam. The rowers bend low, clinging to their oars. In the distance, small and calm beneath the wave, stands the snow-capped peak of Mount Fuji.

The image is called Under the Wave off Kanagawa, though most people know it as The Great Wave. It was created around 1831 by the Japanese artist Katsushika Hokusai, who was then about seventy years old. It is not a painting but a woodblock print. Hokusai drew the design, and skilled craftsmen carved it into blocks of wood, one block for each color. The blocks were inked and pressed onto paper again and again, so thousands of copies could be made and sold cheaply.

The Great Wave was part of a series called Thirty-six Views of Mount Fuji. In each print, the sacred mountain appears in a different setting: seen from a field, through a window, beyond a city street, far away beneath a stormy sky. Sometimes it dominates the picture; sometimes, as in The Great Wave, it is tiny. The series asks the viewer to look at one subject from many points of view.

Hokusai used a new imported pigment, Prussian blue, which gave the print its deep, rich color. He also borrowed ideas from European prints that reached Japan through Dutch traders, including the use of perspective to create a sense of depth.

The influence later flowed the other way. In the 1850s, Japan opened its ports to Western trade, and Japanese prints began to arrive in Europe. Artists such as Vincent van Gogh and Claude Monet collected them eagerly. They admired the bold outlines, the flat areas of color and the unusual compositions, in which important subjects might be pushed to the edge of the picture.

Hokusai was never satisfied with his own work. In his seventies he wrote that nothing he had drawn before the age of seventy was worth noticing. He hoped that by the age of one hundred he would finally be a true artist. He died at eighty-eight, still learning.`,
      [artWords, mediums, perspective],
      [
        ask(
          t("How was The Great Wave produced?", "《神奈川冲浪里》是如何制作的？"),
          t("As a woodblock print, with one carved block for each color", "作为木版画，每种颜色刻一块木版"),
          [
            t("As a single oil painting on canvas", "作为一幅布面油画"),
            t("As a photograph of a real wave", "作为一张真实海浪的照片"),
            t("As a drawing in ink on silk", "作为一幅绢本墨画"),
          ],
          t(
            "The second paragraph says it is a woodblock print, with craftsmen carving one block for each color.",
            "第二段说它是一幅木版画，工匠为每种颜色雕刻一块木版。",
          ),
        ),
        ask(
          t("What does the series Thirty-six Views of Mount Fuji ask the viewer to do?", "《富岳三十六景》系列让观者做什么？"),
          t("Look at one subject from many points of view", "从多个角度看同一个题材"),
          [
            t("Climb the mountain", "去爬那座山"),
            t("Count the waves in each print", "数每幅画中的浪"),
            t("Compare thirty-six different mountains", "比较三十六座不同的山"),
          ],
          t(
            "The third paragraph says the series asks the viewer to look at one subject from many points of view.",
            "第三段说这个系列让观者从多个角度去看同一个题材。",
          ),
        ),
        ask(
          t("What did European artists admire in Japanese prints?", "欧洲艺术家欣赏日本版画的哪些方面？"),
          t("Bold outlines, flat color and unusual compositions", "大胆的轮廓、平涂的色彩和不寻常的构图"),
          [
            t("Smooth, invisible brushstrokes", "平滑、看不见的笔触"),
            t("Religious subjects from Europe", "来自欧洲的宗教题材"),
            t("Very high prices", "非常高的价格"),
          ],
          t(
            "The fifth paragraph says they admired the bold outlines, the flat areas of color and the unusual compositions.",
            "第五段说他们欣赏大胆的轮廓、平涂的色块和不寻常的构图。",
          ),
        ),
      ],
      [
        "Asia",
        "Mount",
        "Fuji",
        "Under",
        "Wave",
        "Kanagawa",
        "Great",
        "Japanese",
        "Katsushika",
        "Hokusai",
        "Thirty-six",
        "Views",
        "Prussian",
        "European",
        "Japan",
        "Dutch",
        "Western",
        "Europe",
        "Vincent",
        "van",
        "Gogh",
        "Claude",
        "Monet",
      ],
      ["woodblock"],
    ),
    passage(
      "the-composer-who-could-not-hear",
      t("The Composer Who Could Not Hear", "听不见的作曲家"),
      `In his late twenties, the German composer Ludwig van Beethoven began to notice a ringing in his ears. Over the following years, his hearing grew steadily worse. For a musician, it was a catastrophe. In 1802, at the age of thirty-one, he wrote a letter to his brothers, now known as the Heiligenstadt Testament, in which he admitted that his deafness had brought him close to despair. He had withdrawn from society, he wrote, because he could not bear to ask people to shout. Only his art had held him back from ending his life.

Yet Beethoven did not stop composing. In the years that followed, he wrote some of his greatest and boldest works. His Third Symphony, the Eroica, was longer and more dramatic than any symphony before it. His Fifth Symphony begins with four famous notes, three short and one long, that seem to knock at the door like fate.

By his late forties, Beethoven was almost completely deaf. Friends communicated with him by writing in notebooks, and many of these conversation books survive. Still, he could hear music in his mind. He composed by imagining sound, and some scholars think that his isolation pushed his music in new and strange directions.

His Ninth Symphony, first performed in Vienna in 1824, broke one of the oldest rules of the form. In the final movement, after the orchestra has played for nearly an hour, voices enter. A choir and four soloists sing a poem by Friedrich Schiller, the “Ode to Joy,” which celebrates the brotherhood of all people.

At the premiere, Beethoven stood on the stage beside the conductor, beating time, though he could not hear the musicians. When the symphony ended, the audience burst into applause, but Beethoven, still facing the orchestra, did not know. According to the most famous account, one of the singers gently turned him around so that he could see the crowd clapping and waving their hats.

Today the melody of the Ode to Joy serves as the anthem of the European Union. It was written by a man who could not hear it, and it has become a song of hope for millions who can.`,
      [musicWords, courageWords],
      [
        ask(
          t("Why had Beethoven withdrawn from society, according to his letter?", "根据他的信，贝多芬为什么远离社交？"),
          t("He could not bear to ask people to shout", "他无法忍受请别人大声喊话"),
          [
            t("He was too busy composing", "他忙于作曲"),
            t("His brothers had forbidden him to go out", "他的兄弟禁止他外出"),
            t("He disliked the music of Vienna", "他不喜欢维也纳的音乐"),
          ],
          t(
            "The first paragraph says he wrote that he had withdrawn from society because he could not bear to ask people to shout.",
            "第一段说他在信中写道，他远离社交是因为无法忍受请别人大声喊话。",
          ),
        ),
        ask(
          t("Which old rule did the Ninth Symphony break?", "第九交响曲打破了哪条古老的规则？"),
          t("It added voices to a symphony", "它在交响曲中加入了人声"),
          [
            t("It was played without a conductor", "它在没有指挥的情况下演奏"),
            t("It was shorter than any symphony before it", "它比之前任何交响曲都短"),
            t("It had only four notes", "它只有四个音符"),
          ],
          t(
            "The fourth paragraph says in the final movement voices enter, breaking one of the oldest rules of the form.",
            "第四段说在最后一个乐章中加入了人声，打破了这一体裁最古老的规则之一。",
          ),
        ),
        ask(
          t("What happened at the end of the premiere, according to the most famous account?", "根据最著名的记述，首演结束时发生了什么？"),
          t("A singer turned Beethoven around so he could see the applause", "一位歌手把贝多芬转过身来，让他看到观众的掌声"),
          [
            t("Beethoven heard the applause and bowed", "贝多芬听到掌声并鞠躬"),
            t("The audience left in silence", "观众默默离开"),
            t("The conductor stopped the orchestra", "指挥让乐团停了下来"),
          ],
          t(
            "The fifth paragraph says one of the singers gently turned him around so he could see the crowd clapping.",
            "第五段说一位歌手轻轻把他转过身来，让他看到人群在鼓掌。",
          ),
        ),
      ],
      [
        "German",
        "Ludwig",
        "van",
        "Beethoven",
        "Heiligenstadt",
        "Testament",
        "Third",
        "Symphony",
        "Eroica",
        "Fifth",
        "Vienna",
        "Ninth",
        "Friedrich",
        "Schiller",
        "Ode",
        "Joy",
        "European",
        "Union",
      ],
    ),
    passage(
      "the-train-that-frightened-paris",
      t("The Train That Frightened Paris", "吓坏巴黎的火车"),
      `On December 28, 1895, in the basement of a café in Paris, about thirty people paid one franc each to watch something new. Two brothers, Auguste and Louis Lumière, had invented a machine they called the cinématographe. It could record moving images and also project them onto a screen. That evening, they showed ten short films, each less than a minute long. Many historians consider it the first public film screening for a paying audience.

The films were simple. One showed workers leaving the Lumière factory at the end of the day. Another showed a baby being fed. A third showed a gardener being sprayed with water when a boy steps on his hose, an early comedy.

The most famous Lumière film, The Arrival of a Train at La Ciotat, shows a steam train pulling into a station, coming toward the camera at an angle, while passengers wait on the platform. A popular legend says that when it was shown, audiences screamed and ran from the room, believing the train would burst through the screen. Historians have found little evidence that this really happened. The story may have been exaggerated by journalists and later writers because it captured something true: the astonishment of seeing the world move on a screen for the first time.

The Lumière brothers thought of their invention mainly as a scientific curiosity and a way of recording reality. Others saw different possibilities. A magician named Georges Méliès, who attended an early screening, began making films full of tricks: people who vanished in puffs of smoke, heads that floated in the air. In 1902 he made A Trip to the Moon, in which a rocket lands in the eye of the Man in the Moon.

From these two beginnings, film developed in two directions that still exist today. One, like the Lumières, records real life; it led to the documentary. The other, like Méliès, creates impossible worlds; it led to fantasy and special effects. Every film made since contains something of both: a camera pointed at the world, and an imagination that changes what we see.`,
      [filmWords, mediums, academic1, academic2],
      [
        ask(
          t("What could the cinématographe do?", "活动电影机能做什么？"),
          t("Record moving images and project them onto a screen", "录制活动影像并把它们投射到银幕上"),
          [
            t("Record sound and play it back", "录音并回放"),
            t("Print photographs in color", "印彩色照片"),
            t("Show films on television", "在电视上放电影"),
          ],
          t(
            "The first paragraph says the machine could record moving images and also project them onto a screen.",
            "第一段说这台机器能录制活动影像，也能把它们投射到银幕上。",
          ),
        ),
        ask(
          t("What do historians say about the legend of audiences running from the train?", "历史学家如何看待观众被火车吓跑的传说？"),
          t("There is little evidence it really happened", "几乎没有证据表明这真的发生过"),
          [
            t("It is confirmed by many police reports", "许多警方报告证实了这一点"),
            t("It happened at every screening", "每次放映都会发生"),
            t("The Lumières invented it to sell tickets", "卢米埃尔兄弟编造它来卖票"),
          ],
          t(
            "The third paragraph says historians have found little evidence that this really happened.",
            "第三段说历史学家几乎没有找到证据表明这真的发生过。",
          ),
        ),
        ask(
          t("Which two directions of film does the last paragraph describe?", "最后一段描述了电影的哪两个方向？"),
          t("Recording real life and creating impossible worlds", "记录真实生活与创造不可能的世界"),
          [
            t("Comedy and tragedy", "喜剧与悲剧"),
            t("Silent films and sound films", "无声电影与有声电影"),
            t("French films and American films", "法国电影与美国电影"),
          ],
          t(
            "The last paragraph says one direction records real life, leading to the documentary, and the other creates impossible worlds, leading to fantasy.",
            "最后一段说一个方向记录真实生活，发展出纪录片；另一个创造不可能的世界，发展出奇幻片。",
          ),
        ),
      ],
      [
        "December",
        "Paris",
        "Auguste",
        "Louis",
        "Lumière",
        "Arrival",
        "Train",
        "La",
        "Ciotat",
        "Georges",
        "Méliès",
        "Trip",
        "Moon",
        "Man",
        "Lumières",
      ],
      ["franc", "cinématographe"],
    ),
    passage(
      "the-painter-of-herself",
      t("The Painter of Herself", "画自己的画家"),
      `When she was eighteen, the Mexican painter Frida Kahlo was riding a bus in Mexico City when it crashed into a streetcar. A metal handrail pierced her body. Her spine, her pelvis and one of her legs were broken in several places. She spent months in bed, wrapped in a plaster cast, and she would suffer pain and undergo many operations for the rest of her life.

During her recovery, her mother had a special easel made so that she could paint lying down, and a mirror was fixed above her bed. With nothing to look at but herself, Kahlo began to paint self-portraits. “I paint myself because I am so often alone,” she later said, “and because I am the subject I know best.”

Of her roughly two hundred paintings, about a third are self-portraits. In them, she looks directly at the viewer, unsmiling, with her heavy, joined eyebrows and the faint mustache that she refused to hide. She often wore traditional clothes from the Tehuana region of Mexico, with long embroidered skirts and flowers in her hair, as a way of celebrating Mexican identity.

Her paintings are not simply records of how she looked. They are full of symbols. In The Broken Column, painted in 1944, her body is split open to reveal a crumbling stone column in place of her spine, and nails are driven into her skin, while tears run down her calm face. In The Two Fridas, two versions of herself sit side by side, holding hands, their hearts exposed and connected by a single vein.

Some critics have called her a Surrealist, after the movement that painted dreams and strange images. Kahlo rejected the label. “I never painted dreams,” she said. “I painted my own reality.”

During her lifetime, she was often overshadowed by her husband, the famous muralist Diego Rivera. Today she is one of the most recognized artists in the world. Her face appears on posters, bags and murals far from Mexico. Yet her paintings still resist the easy fame of her image. They remain what they always were: honest, painful records of a woman who turned her suffering into art.`,
      [artWords, mediums, academic2],
      [
        ask(
          t("Why did Kahlo begin painting self-portraits?", "卡罗为什么开始画自画像？"),
          t("Lying in bed with a mirror above her, she had little else to look at", "她躺在床上，头顶有面镜子，几乎没有别的可看"),
          [
            t("Her teacher told her to paint only herself", "她的老师让她只画自己"),
            t("She could not afford models", "她请不起模特"),
            t("Her husband asked her to", "她丈夫请她这样做"),
          ],
          t(
            "The second paragraph says a mirror was fixed above her bed, and with nothing to look at but herself, she began to paint self-portraits.",
            "第二段说她床上方装了一面镜子，除了自己没什么可看，于是她开始画自画像。",
          ),
        ),
        ask(
          t("What does the stone column in The Broken Column represent?", "《破碎的脊柱》中的石柱代表什么？"),
          t("Her damaged spine", "她受伤的脊柱"),
          [
            t("A building in Mexico City", "墨西哥城的一座建筑"),
            t("Her husband's murals", "她丈夫的壁画"),
            t("A dream she had", "她做过的一个梦"),
          ],
          t(
            "The fourth paragraph says her body is split open to reveal a crumbling stone column in place of her spine.",
            "第四段说她的身体被剖开，露出一根代替脊柱的、正在崩塌的石柱。",
          ),
        ),
        ask(
          t("Why did Kahlo reject the label Surrealist?", "卡罗为什么拒绝“超现实主义者”这个标签？"),
          t("She said she painted her own reality, not dreams", "她说她画的是自己的现实，而不是梦"),
          [
            t("She disliked all modern art", "她不喜欢所有现代艺术"),
            t("She wanted to be called a muralist", "她希望被称为壁画家"),
            t("She had never heard of Surrealism", "她从未听说过超现实主义"),
          ],
          t(
            "The fifth paragraph quotes her saying she never painted dreams but her own reality.",
            "第五段引用她的话：她从不画梦，她画的是自己的现实。",
          ),
        ),
      ],
      ["Mexican", "Frida", "Kahlo", "Mexico", "City", "Tehuana", "Broken", "Column", "Two", "Fridas", "Surrealist", "Diego", "Rivera"],
      ["pelvis", "easel", "muralist"],
    ),
    passage(
      "two-lovers-many-stages",
      t("Two Lovers, Many Stages", "一对恋人，多个舞台"),
      `Around 1595, William Shakespeare wrote a play about two teenagers from feuding families in the Italian city of Verona. Romeo, a Montague, and Juliet, a Capulet, fall in love at first sight, marry in secret and die within a few days, each believing the other dead. Shakespeare did not invent the story; he took it from an English poem by Arthur Brooke, which was itself based on Italian tales. But his version, with its quick, bright poetry and its rush toward disaster, made the lovers immortal.

Since then, Romeo and Juliet has been retold in almost every medium. Each version keeps the story but changes how it is told, and each medium has its own strengths.

In 1938, the Russian composer Sergei Prokofiev's ballet of Romeo and Juliet was first performed. A ballet has no spoken words at all. Prokofiev had to tell the story through music and dance. He gave the feuding families a heavy, stamping march, the Dance of the Knights, that sounds like power and threat. The lovers, by contrast, have soaring, tender melodies. Their feelings are expressed through the movement of bodies rather than through language.

In 1957, the musical West Side Story moved the story to the streets of New York. The feuding families became two teenage gangs, the Jets and the Sharks, one white and one Puerto Rican. The feud was no longer about old family pride but about prejudice and the struggle for territory in a poor neighborhood. The music of Leonard Bernstein combined jazz, Latin rhythms and classical forms. Unlike Shakespeare's Juliet, the heroine, Maria, survives at the end.

Films have also retold the story many times. In 1968, Franco Zeffirelli cast actors who were teenagers themselves, close to the ages of Shakespeare's characters. In 1996, Baz Luhrmann kept Shakespeare's language but set the story in a modern city of fast cars and guns, with swords replaced by pistols, using quick editing and loud music to capture the speed of young love.

Comparing these versions reveals what each medium can do. A play relies on words, a ballet on movement and music, a film on images and editing. The story survives every change, perhaps because its subject never grows old: young love, set against a world full of hate.`,
      [mediums, musicWords, filmWords, academic1],
      [
        ask(
          t("Where did Shakespeare get the story of Romeo and Juliet?", "莎士比亚从哪里得到了罗密欧与朱丽叶的故事？"),
          t("From an English poem by Arthur Brooke based on Italian tales", "出自阿瑟·布鲁克根据意大利故事写的一首英文诗"),
          [
            t("He invented it himself", "他自己编的"),
            t("From a ballet by Prokofiev", "出自普罗科菲耶夫的芭蕾舞剧"),
            t("From a film made in Verona", "出自在维罗纳拍摄的一部电影"),
          ],
          t(
            "The first paragraph says he took it from an English poem by Arthur Brooke, which was itself based on Italian tales.",
            "第一段说他取材于阿瑟·布鲁克的一首英文诗，而那首诗本身又基于意大利故事。",
          ),
        ),
        ask(
          t("How does Prokofiev's ballet tell the story without words?", "普罗科菲耶夫的芭蕾舞剧如何在没有台词的情况下讲故事？"),
          t("Through music and dance, such as a heavy march for the families", "通过音乐和舞蹈，比如为两个家族写的沉重进行曲"),
          [
            t("Through a narrator who reads the play aloud", "通过一位朗读剧本的叙述者"),
            t("Through subtitles projected above the stage", "通过投射在舞台上方的字幕"),
            t("Through silent scenes with no music", "通过没有音乐的无声场景"),
          ],
          t(
            "The third paragraph says Prokofiev told the story through music and dance, giving the families a heavy, stamping march.",
            "第三段说普罗科菲耶夫通过音乐和舞蹈讲故事，为两个家族写了一首沉重、跺脚的进行曲。",
          ),
        ),
        ask(
          t("How did West Side Story change what the feud is about?", "《西区故事》如何改变了世仇的内涵？"),
          t("It became about prejudice and territory rather than family pride", "它变成了关于偏见和地盘之争，而不是家族的骄傲"),
          [
            t("It became about money and inheritance", "它变成了关于金钱和遗产"),
            t("It became about two rival schools", "它变成了关于两所对立的学校"),
            t("It became about a war between nations", "它变成了关于国家之间的战争"),
          ],
          t(
            "The fourth paragraph says the feud was no longer about old family pride but about prejudice and the struggle for territory.",
            "第四段说世仇不再关乎古老的家族荣誉，而是关乎偏见和地盘之争。",
          ),
        ),
      ],
      [
        "William",
        "Shakespeare",
        "Italian",
        "Verona",
        "Romeo",
        "Montague",
        "Juliet",
        "Capulet",
        "English",
        "Arthur",
        "Brooke",
        "Russian",
        "Sergei",
        "Prokofiev's",
        "Dance",
        "Knights",
        "West",
        "Side",
        "Story",
        "New",
        "York",
        "Jets",
        "Sharks",
        "Puerto",
        "Rican",
        "Leonard",
        "Bernstein",
        "Latin",
        "Shakespeare's",
        "Maria",
        "Franco",
        "Zeffirelli",
        "Baz",
        "Luhrmann",
        "Prokofiev",
      ],
    ),
  ],
};
