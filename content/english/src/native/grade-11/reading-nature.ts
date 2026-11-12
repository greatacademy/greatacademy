// Grade 11: the reading unit of the fifth theme, nature and the self, from a cabin by a pond and an essay on
// self-reliance to a prophet of the mountains, a poet's sister, a hermit who went home to his fields, the sublime,
// bathing in a forest and a grandmother who walked two thousand miles.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const natureWords = { topic: "words-of-nature-and-the-self", weight: 0.3 } as const;
const solitude = { topic: "words-of-solitude-and-simplicity", weight: 0.3 } as const;
const motifs = { topic: "motifs-in-a-story", weight: 0.2 } as const;
const academic6 = { topic: "academic-words-6", weight: 0.1 } as const;
const academic7 = { topic: "academic-words-7", weight: 0.1 } as const;
const academic1 = { topic: "academic-words-1", weight: 0.1 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;

/** natureAndTheSelf is a reading unit of grade 11 on nature, solitude and simplicity, and what people learn about themselves outdoors. */
export const natureAndTheSelf: ReadingUnitDef = {
  id: "nature-and-the-self",
  title: t("Nature and the Self", "自然与自我"),
  passages: [
    passage(
      "a-cabin-by-a-pond",
      t("A Cabin by a Pond", "池畔小屋"),
      `On the fourth of July, 1845, a twenty-seven-year-old man named Henry David Thoreau moved into a small wooden cabin he had built himself beside Walden Pond, near the town of Concord, Massachusetts. The cabin was ten feet wide and fifteen feet long. It had a bed, a desk, three chairs and a stove. Thoreau would live there for two years and two months.

He explained his reason in a famous sentence. He went to the woods, he wrote, because he wished to live deliberately, to face only the essential facts of life, and to see if he could learn what it had to teach. He did not want to discover, when he came to die, that he had not lived.

Thoreau believed that most people led lives of quiet desperation. They worked long hours to buy things they did not need, and they had no time left to think. At Walden, he tried an experiment in simplicity. He grew beans, caught fish and kept careful accounts. He found that by working about six weeks a year, he could earn enough to live on. The rest of his time was free for reading, writing, walking and watching the pond.

He watched it with extraordinary attention. His book about the experience, Walden, published in 1854, records the colors of the water in different seasons, the sounds of the ice cracking in winter, the battles of ants and the habits of a loon that dived whenever he paddled near. The pond becomes a recurring presence in the book, almost a character. Thoreau called it the earth's eye, in which the viewer measures the depth of his own nature.

It is sometimes said that Thoreau was not really a hermit. His cabin was only a mile and a half from town, and he walked there often. His mother sometimes brought him food. But Thoreau never claimed to have left society completely. His solitude was not an escape from people but a way of seeing ordinary life more clearly.

Walden sold slowly at first. Today it is one of the most widely read books in American literature, and the pond is visited by many thousands of people each year. They come to see a small replica of the cabin and to stand by the water. Many of them, like Thoreau, are looking for a way to live with less noise and more attention.`,
      [solitude, natureWords, academic6],
      [
        ask(
          t("Why did Thoreau go to live at Walden Pond?", "梭罗为什么去瓦尔登湖畔生活？"),
          t(
            "To live deliberately and learn what the essential facts of life could teach",
            "为了从容地生活，看看生活中最本质的东西能教给他什么",
          ),
          [
            t("To escape from the police after a crime", "为了犯罪后躲避警察"),
            t("To start a farm and become rich selling beans", "为了开农场，靠卖豆子发财"),
            t("To write a guidebook for visitors to the pond", "为了给湖的游客写一本旅游指南"),
          ],
          t(
            "The second paragraph says he went to the woods to live deliberately and to see if he could learn what life had to teach.",
            "第二段说他去林中是为了从容地生活，看看能否学到生活要教给他的东西。",
          ),
        ),
        ask(
          t("What did Thoreau's experiment show about work?", "梭罗的实验在工作方面说明了什么？"),
          t("He could live on what he earned in about six weeks of work a year", "一年只工作大约六个星期，赚的钱就够他生活"),
          [
            t("He needed to work every day just to have enough food", "他每天都得工作才能吃饱"),
            t("Farming was too hard for anyone to do alone", "务农太辛苦，任何人都无法独自完成"),
            t("Living in the woods cost more than living in town", "住在林中比住在镇上花费更多"),
          ],
          t(
            "The third paragraph says that by working about six weeks a year, he could earn enough to live on.",
            "第三段说一年工作大约六个星期，他就能赚够生活所需。",
          ),
        ),
        ask(
          t("How does the pond work in Thoreau's book?", "这个湖在梭罗的书中起什么作用？"),
          t(
            "It returns again and again, almost like a character, and mirrors the viewer's nature",
            "它一再出现，几乎像一个人物，并映照出观看者的本性",
          ),
          [
            t("It appears once at the start and is then forgotten", "它只在开头出现一次，之后就被遗忘了"),
            t("It is described only as a place to catch fish", "它只被描写成一个钓鱼的地方"),
            t("It stands for the busy life of the town", "它象征着镇上忙碌的生活"),
          ],
          t(
            "The fourth paragraph says the pond is a recurring presence, almost a character, and Thoreau called it the earth's eye in which one measures one's own nature.",
            "第四段说这个湖反复出现，几乎是一个人物，梭罗称它为大地之眼，人在其中衡量自己本性的深度。",
          ),
        ),
      ],
      ["Henry", "David", "Thoreau", "Thoreau's", "Walden", "Massachusetts", "Concord", "Ralph", "Waldo", "Emerson", "American"],
    ),
    passage(
      "trust-thyself",
      t("Trust Thyself", "相信你自己"),
      `Ralph Waldo Emerson was trained to be a minister, like his father and grandfather before him. But in 1832, at the age of twenty-nine, he resigned from his church in Boston. He had come to believe that the forms of religion had become empty, and that each person could find truth directly, without priests or ceremonies. He moved to the town of Concord and began a new career as a writer and lecturer.

In 1836 he published a short book called Nature. In it, he described the feeling of standing on bare ground in the open air and seeming to become a transparent eyeball: all egotism vanished, and he felt part of something larger than himself. Nature, he argued, was not only a collection of rocks and trees but a language through which a deeper spiritual truth spoke. A person who looked closely at a leaf or a sunset could learn as much as from any book.

Five years later came his most famous essay, "Self-Reliance." Its message was simple and bold: trust thyself. Emerson urged his readers to follow their own judgment rather than the opinions of society, the habits of the past or the authority of famous men. Whoso would be a man, he wrote, must be a nonconformist. He warned against what he called a foolish consistency, the fear of contradicting what one said yesterday. Better to say what one believes today in hard words, even if it contradicts everything one said before.

These ideas became the heart of a movement called transcendentalism, which held that intuition and the individual conscience were higher guides than reason or tradition. Emerson's friend Henry David Thoreau, who later lived at Walden Pond on land Emerson owned, was one of its most famous followers.

Emerson's influence on American thought was enormous. His belief in the individual fit the spirit of a young country that saw itself as breaking free from Europe. Yet his ideas have also been criticized. Some readers argue that self-reliance can become an excuse for selfishness, or that it ignores how much every person depends on others. Emerson, a man of independent means, did not have to worry about how to pay for food.

Still, his central challenge remains a powerful one. In a world full of advice, opinions and pressure to fit in, Emerson asks a simple question: what do you yourself think is true? And are you brave enough to say it?`,
      [solitude, natureWords, academic7],
      [
        ask(
          t("Why did Emerson resign from his church?", "爱默生为什么辞去了教会的职务？"),
          t(
            "He believed the forms of religion had become empty and truth could be found directly",
            "他认为宗教的形式已经空洞，人可以直接找到真理",
          ),
          [
            t("He wanted to become a farmer in Concord", "他想在康科德当农民"),
            t("His father ordered him to start a new career", "他父亲命令他开始新的职业"),
            t("The church could no longer afford to pay him", "教会再也付不起他的薪水了"),
          ],
          t(
            "The first paragraph says he came to believe that the forms of religion had become empty and that each person could find truth directly.",
            "第一段说他开始相信宗教的形式已经空洞，每个人都可以直接找到真理。",
          ),
        ),
        ask(
          t("What did Emerson mean by warning against a foolish consistency?", "爱默生告诫人们警惕愚蠢的一致性，是什么意思？"),
          t(
            "People should not fear contradicting what they said before if they now believe otherwise",
            "如果现在有不同的看法，人们就不应害怕与自己以前说过的话相矛盾",
          ),
          [
            t("People should always repeat exactly what they said the day before", "人们应该总是重复自己前一天说过的话"),
            t("People should agree with the opinions of famous men", "人们应该同意名人的意见"),
            t("People should never change their habits once they are adults", "人一旦成年就不应改变习惯"),
          ],
          t(
            "The third paragraph says he warned against the fear of contradicting what one said yesterday, and urged saying what one believes today.",
            "第三段说他告诫人们不要害怕与昨天说的话相矛盾，要说出今天所相信的。",
          ),
        ),
        ask(
          t("What criticism of self-reliance does the passage mention?", "文章提到了对自立思想的什么批评？"),
          t(
            "It can become an excuse for selfishness and ignores how people depend on others",
            "它可能成为自私的借口，并忽视了人们彼此之间的依赖",
          ),
          [
            t("It was too difficult for most readers to understand", "它太难懂，大多数读者无法理解"),
            t("It was copied from the writers of Europe", "它是从欧洲作家那里抄来的"),
            t("It encouraged people to stay in their churches", "它鼓励人们留在教会里"),
          ],
          t(
            "The fifth paragraph says some readers argue self-reliance can become an excuse for selfishness or ignores how much people depend on others.",
            "第五段说有些读者认为自立可能成为自私的借口，或忽视了人们对他人的依赖。",
          ),
        ),
      ],
      ["Ralph", "Waldo", "Emerson", "Emerson's", "Boston", "Concord", "Thoreau", "Nature", "American", "Americans", "Europe"],
    ),
    passage(
      "the-prophet-of-the-mountains",
      t("The Prophet of the Mountains", "群山的先知"),
      `In 1867, a young man named John Muir was working in a factory in Indiana when a file slipped and struck his eye. For weeks he lay in a dark room, afraid that he would be blind for life. When his sight returned, he made a decision. He would no longer spend his life on machines. He would spend it, he said, looking at the works of God.

He set out on foot and walked a thousand miles from Kentucky to the Gulf of Mexico. Then he sailed to California and walked into the Sierra Nevada mountains. There, in the Yosemite Valley, he found what he had been looking for. Cliffs of granite rose thousands of feet above a green valley floor. Waterfalls dropped from the heights in long white ribbons. Ancient sequoia trees, some more than two thousand years old, stood in groves nearby.

Muir took a job at a sawmill in the valley and spent every free moment exploring. He climbed peaks without ropes, slept on the bare ground with only a crust of bread in his pocket and once rode out a storm at the top of a hundred-foot fir tree, swaying in the wind, to feel what the tree felt. He wrote that going to the mountains was going home. For him, the wilderness was not a primeval wasteland to be conquered but a sacred place in which a person could find communion with something greater.

His writing made millions of readers see the American West differently. In 1892 he founded the Sierra Club to protect the mountains, and in 1903 he took President Theodore Roosevelt camping in Yosemite. The two men slept under the stars, and Muir talked late into the night about the need to save the forests. Roosevelt later protected vast areas of land as national parks and forests.

Muir lost his most painful battle. In 1913, Congress allowed the city of San Francisco to dam the Hetch Hetchy Valley, a valley Muir thought as beautiful as Yosemite, to provide water. Muir wrote that one might as well dam for water tanks the people's cathedrals and churches. He died the next year.

Today, Muir is honored as a founder of the movement to protect wild places. Historians also note that his vision of empty wilderness overlooked the Native peoples who had lived in Yosemite for thousands of years and had been forced out. Like many dreams of nature, his was beautiful and incomplete.`,
      [natureWords, solitude, academic6],
      [
        ask(
          t("What event led Muir to change the direction of his life?", "什么事件促使缪尔改变了人生方向？"),
          t("An injury to his eye in a factory that made him fear blindness", "在工厂里伤了眼睛，使他害怕失明"),
          [
            t("A visit to Yosemite with his family as a boy", "小时候和家人一起游览优胜美地"),
            t("A meeting with the president in Washington", "在华盛顿与总统的一次会面"),
            t("The loss of his job at a sawmill", "失去了在锯木厂的工作"),
          ],
          t(
            "The first paragraph says a file struck his eye, and after weeks of fearing blindness, he decided to spend his life looking at nature.",
            "第一段说锉刀击中了他的眼睛，几周担心失明之后，他决定把一生用来观赏自然。",
          ),
        ),
        ask(
          t("How did Muir see the wilderness?", "缪尔如何看待荒野？"),
          t(
            "As a sacred place for communion with something greater, not a wasteland to conquer",
            "视为与更伟大之物交融的神圣之地，而不是有待征服的荒地",
          ),
          [
            t("As a dangerous place that should be avoided", "视为应当避开的危险之地"),
            t("As land that should be cleared for farms", "视为应当开垦成农田的土地"),
            t("As a source of timber for the growing cities", "视为为不断发展的城市提供木材的来源"),
          ],
          t(
            "The third paragraph says the wilderness for him was not a primeval wasteland to be conquered but a sacred place of communion.",
            "第三段说对他来说，荒野不是有待征服的原始荒地，而是可以与更伟大之物交融的神圣之地。",
          ),
        ),
        ask(
          t("What does the last paragraph say Muir's vision overlooked?", "最后一段说缪尔的观点忽视了什么？"),
          t("The Native peoples who had lived in Yosemite and were forced out", "曾在优胜美地生活又被迫离开的原住民"),
          [
            t("The need for water in San Francisco", "旧金山对水的需求"),
            t("The beauty of the Hetch Hetchy Valley", "赫奇赫奇山谷的美丽"),
            t("The danger of climbing peaks without ropes", "不用绳索攀登山峰的危险"),
          ],
          t(
            "The last paragraph says historians note that his vision of empty wilderness overlooked the Native peoples who had lived there and been forced out.",
            "最后一段说历史学家指出，他关于空旷荒野的设想忽视了曾住在那里又被迫离开的原住民。",
          ),
        ),
      ],
      [
        "John",
        "Muir",
        "Muir's",
        "Scotland",
        "Wisconsin",
        "Yosemite",
        "Valley",
        "California",
        "Sierra",
        "Nevada",
        "Theodore",
        "Roosevelt",
        "Sierra",
        "Club",
        "Hetch",
        "Hetchy",
        "San",
        "Francisco",
        "American",
      ],
    ),
    passage(
      "the-poets-sister",
      t("The Poet's Sister", "诗人的妹妹"),
      `On the fifteenth of April, 1802, a brother and sister were walking home along the shore of a lake in the north of England. The wind was strong. Near the water, they came upon a long belt of wild daffodils growing under the trees, more than either of them had ever seen. That evening, the sister described them in her journal. Some rested their heads on the stones as on a pillow, she wrote; the rest tossed and reeled and danced, and seemed as if they verily laughed with the wind.

The sister was Dorothy Wordsworth, and her brother was the poet William Wordsworth. Two years later, William wrote a poem about the same daffodils. It became one of the most famous poems in the English language. Many readers who know it have never heard that its images were first recorded by Dorothy.

Dorothy and William lived together for most of their lives in a small cottage in Grasmere, in the Lake District. They were poor, and their life was one of deliberate simplicity. They walked for miles every day, in every weather, and Dorothy wrote down what they saw: the color of the moss, the shapes of the clouds, the sound of a stream after rain. Her journals were not written for publication. They were partly a gift to her brother, a store of observations he could draw on when he wrote.

William believed that poetry came from strong feelings remembered in tranquility. A moment in nature, recalled later in a quiet hour, could return with new meaning. In his poem about the daffodils, the most important moment comes at the end, when the speaker, lying on his couch in a pensive mood, sees the flowers again with his inward eye, the bliss of solitude. The memory of nature, recurring in the mind, becomes a source of joy.

Dorothy's journals were finally published long after her death. Today, many readers find them as moving as her brother's poems. Her writing is precise, fresh and unpretentious, and it shows a mind that paid close attention to small things. Some critics argue that she was a great writer in her own right whose talent was hidden because she was a woman who chose to serve her brother's work.

The daffodils by the lake still bloom each spring. Visitors who come to see them can read both versions, the sister's quick notes of an April afternoon and the brother's poem, and wonder how much of the vision belonged to each.`,
      [natureWords, solitude, motifs, academic7, academic1],
      [
        ask(
          t("Who first recorded the images of the daffodils?", "是谁最先记录下水仙花的意象？"),
          t("Dorothy Wordsworth, in her journal on the evening of the walk", "多萝西·华兹华斯，在散步那天晚上的日记里"),
          [
            t("William Wordsworth, in a letter to a friend", "威廉·华兹华斯，在给朋友的一封信中"),
            t("A visitor who saw the flowers many years later", "许多年后看到这些花的一位游客"),
            t("A newspaper that reported on the walk", "一家报道了这次散步的报纸"),
          ],
          t(
            "The first paragraph says the sister described the daffodils in her journal that evening, and the second paragraph names her as Dorothy.",
            "第一段说妹妹当晚在日记里描写了水仙花，第二段说出她就是多萝西。",
          ),
        ),
        ask(
          t("In William's poem, what role does the memory of the daffodils play?", "在威廉的诗中，对水仙花的回忆起了什么作用？"),
          t("It recurs in the mind in quiet hours and becomes a source of joy", "它在安静的时刻反复浮现于脑海，成为快乐的源泉"),
          [
            t("It makes the speaker sad because the flowers have died", "它让说话人伤心，因为花已经凋谢了"),
            t("It reminds the speaker of the dangers of strong wind", "它提醒说话人强风的危险"),
            t("It is forgotten as soon as the walk is over", "散步一结束，它就被忘掉了"),
          ],
          t(
            "The fourth paragraph says the speaker sees the flowers again with his inward eye, and the recurring memory becomes a source of joy.",
            "第四段说说话人用内心之眼再次看到这些花，反复出现的回忆成为快乐的源泉。",
          ),
        ),
        ask(
          t("What do some critics argue about Dorothy?", "一些评论家对多萝西有什么看法？"),
          t(
            "She was a great writer whose talent was hidden by her role in her brother's work",
            "她是一位伟大的作家，她的才华因为她在哥哥工作中的角色而被掩盖",
          ),
          [
            t("She wrote most of her brother's poems herself", "她哥哥的大部分诗是她自己写的"),
            t("She did not enjoy walking in the countryside", "她不喜欢在乡间散步"),
            t("Her journals were written to be sold to the public", "她的日记是为了卖给公众而写的"),
          ],
          t(
            "The fifth paragraph says some critics argue she was a great writer in her own right whose talent was hidden because she chose to serve her brother's work.",
            "第五段说一些评论家认为她本身就是一位伟大的作家，因为选择为哥哥的工作服务，她的才华被掩盖了。",
          ),
        ),
      ],
      ["William", "Wordsworth", "Wordsworth's", "Dorothy", "Dorothy's", "Grasmere", "Lake", "District", "England", "Ullswater", "English"],
    ),
    passage(
      "going-home-to-the-fields",
      t("Going Home to the Fields", "归园田居"),
      `In the year 405, a Chinese official named Tao Yuanming was serving as the magistrate of a small county. He had held the post for only about eighty days when word came that an inspector from the higher government was on his way. Tao's staff told him that he must put on his formal robes and belt to receive the visitor with proper ceremony. Tao refused. He would not, he said, bow like a servant for a salary of five pecks of rice. He resigned that same day and went home to his farm.

He never returned to official life. For the remaining twenty years or so of his life, he lived in the countryside as a farmer and a poet. His poems about this life are some of the most loved in Chinese literature. They describe plowing the fields at dawn and coming home under the moon with a hoe on his shoulder, drinking wine with neighbors, reading by the window and watching the birds return to the hills at evening.

A recurring image in his poems is the bird that flies back to its old forest. In one poem, Tao compares himself to a caged bird that longs for its woods and a fish in a pond that remembers its first deep waters. Going home to the fields is, for him, a return to his true nature after years of being trapped in a life that was not his own.

His life was not easy. He was often poor, and in some years his harvests failed. He wrote honestly about hunger and about the weeds that grew faster than his beans. But he insisted that a simple life lived according to his nature was worth more than wealth gained by pretending to be someone else. In a famous line, he writes of picking chrysanthemums by the eastern fence and gazing at the southern mountain, and of finding in that moment a meaning he could not put into words.

Tao also wrote a short story about a fisherman who follows a stream of peach blossoms and finds a hidden village whose people have lived in peace, cut off from the world, for centuries. When the fisherman leaves and tries to return, he can never find it again. The Peach Blossom Spring has become a lasting Chinese image of an ideal place, always longed for and never quite reached.

Tao's choice has inspired readers for sixteen centuries. In a world that often measures success by rank and salary, his poems ask whether freedom and peace of mind might be worth more.`,
      [solitude, natureWords, motifs, academic6, academic1],
      [
        ask(
          t("Why did Tao Yuanming resign from his post?", "陶渊明为什么辞官？"),
          t("He refused to bow with ceremony to an inspector for a small salary", "他不愿为了微薄的俸禄而向上级派来的官员行礼"),
          [
            t("He was dismissed for failing to collect taxes", "他因未能收税而被免职"),
            t("His farm needed him because of a flood", "因为洪水，他的农场需要他"),
            t("He wanted a higher post in the capital", "他想在京城得到更高的职位"),
          ],
          t(
            "The first paragraph says he refused to put on formal robes and bow like a servant for five pecks of rice, and resigned that day.",
            "第一段说他拒绝穿上官服、像仆人一样为五斗米折腰，当天就辞了职。",
          ),
        ),
        ask(
          t("What does the recurring image of the returning bird suggest in his poems?", "他诗中反复出现的归鸟意象暗示了什么？"),
          t("A return to his true nature after being trapped in a life not his own", "在被困于不属于自己的生活之后，回归真正的本性"),
          [
            t("His wish to travel to distant countries", "他想去遥远国度旅行的愿望"),
            t("His fear of the long winters in the hills", "他对山中漫长冬季的恐惧"),
            t("His interest in hunting birds for food", "他对猎鸟充饥的兴趣"),
          ],
          t(
            "The third paragraph says he compares himself to a caged bird that longs for its woods, and going home is a return to his true nature.",
            "第三段说他把自己比作思念旧林的笼中鸟，回到田园就是回归本性。",
          ),
        ),
        ask(
          t("What is the Peach Blossom Spring a lasting image of?", "桃花源是什么的持久意象？"),
          t("An ideal place that is longed for and never quite reached", "令人向往却永远无法真正到达的理想之地"),
          [
            t("A busy market town full of traders", "一个满是商人的繁忙集镇"),
            t("The capital city where officials worked", "官员们工作的京城"),
            t("A garden that Tao planted beside his house", "陶渊明在房子旁边种的一个园子"),
          ],
          t(
            "The fifth paragraph says the Peach Blossom Spring has become an image of an ideal place, always longed for and never quite reached.",
            "第五段说桃花源已成为一个理想之地的意象，总是令人向往，却永远无法真正到达。",
          ),
        ),
      ],
      ["Tao", "Yuanming", "Yuanming's", "Jin", "Chinese", "Peach", "Blossom", "Spring"],
    ),
    passage(
      "the-terror-and-the-delight",
      t("The Terror and the Delight", "恐惧与喜悦"),
      `For most of European history, mountains were not admired. Travelers who had to cross the Alps described them as ugly, frightening and dangerous, warts on the face of the earth. They drew the curtains of their carriages so as not to see the cliffs. A beautiful landscape was a gentle one: green fields, a calm river, a well-kept garden.

In the eighteenth century, this began to change. In 1757, a young Irish writer named Edmund Burke published a book that tried to explain why people were sometimes drawn to things that frightened them. He distinguished between two kinds of experience. The beautiful, he said, was small, smooth and pleasant, and it produced love. The sublime was vast, dark, powerful or infinite, and it produced something closer to terror: a feeling of being overwhelmed. Yet when we experience the sublime from a place of safety, Burke argued, the terror becomes a kind of delight.

Burke's idea gave people a language for experiences they had found hard to name. A storm at sea watched from a cliff, a waterfall roaring in a narrow gorge, the endless night sky, a glacier groaning in the mountains: all of these could be sublime. They made a person feel small, and that smallness was strangely thrilling.

Within a few decades, travelers who had once hurried past the Alps began to seek them out. Poets climbed to the glaciers below Mont Blanc and wrote about the feeling of standing before something that seemed eternal. The young writer Mary Shelley set some of the most powerful scenes of her novel among the ice of the same mountains, where her characters feel both awe and despair. Painters showed tiny human figures dwarfed by cliffs, storms and seas.

The idea of the sublime changed how many people saw themselves. If the self could be overwhelmed by nature and survive, it could also be enlarged by the experience. Standing before a mountain, a person might feel both how small they were and how much their mind could hold.

The idea also had a lasting practical effect. As the sublime became fashionable, wild places that had been ignored or feared came to be valued. Mountain tourism grew. In time, some of those places were protected as parks. When we stand today at a viewpoint over a great canyon and feel that mixture of fear and wonder, we are feeling what Burke tried to name more than two centuries ago.`,
      [natureWords, solitude, academic7, academic2],
      [
        ask(
          t(
            "How did most European travelers view mountains before the eighteenth century?",
            "在十八世纪之前，大多数欧洲旅行者如何看待高山？",
          ),
          t("As ugly, frightening and dangerous", "丑陋、可怕而危险"),
          [
            t("As the most beautiful landscapes on earth", "地球上最美的风景"),
            t("As places to build new cities", "可以建设新城市的地方"),
            t("As the best places to grow crops", "种庄稼的最好地方"),
          ],
          t(
            "The first paragraph says travelers described mountains as ugly, frightening and dangerous and even drew their curtains so as not to see them.",
            "第一段说旅行者形容高山丑陋、可怕而危险，甚至拉上车帘不去看它们。",
          ),
        ),
        ask(
          t("According to Burke, how can the terror of the sublime become delight?", "根据伯克的观点，崇高带来的恐惧怎样才能变成喜悦？"),
          t("When it is experienced from a place of safety", "当人们在安全的地方体验它时"),
          [
            t("When it is painted in small, gentle colors", "当它被用柔和的小幅色彩画出来时"),
            t("When the person is too tired to feel afraid", "当人太累而感觉不到害怕时"),
            t("When it happens to someone else in a story", "当它发生在故事中的别人身上时"),
          ],
          t(
            "The second paragraph says that when we experience the sublime from a place of safety, the terror becomes a kind of delight.",
            "第二段说当我们在安全的地方体验崇高时，恐惧就变成了一种喜悦。",
          ),
        ),
        ask(
          t("What practical effect did the idea of the sublime have?", "崇高这一观念产生了什么实际影响？"),
          t("Wild places came to be valued, visited and in time protected", "荒野开始受到重视、被游览，并最终受到保护"),
          [
            t("People stopped traveling across the mountains", "人们不再翻越高山旅行"),
            t("Gardens became more popular than mountains", "花园变得比高山更受欢迎"),
            t("Painters refused to show any human figures", "画家拒绝画任何人物"),
          ],
          t(
            "The last paragraph says that as the sublime became fashionable, wild places came to be valued, mountain tourism grew and some places were protected as parks.",
            "最后一段说随着崇高成为时尚，荒野受到重视，山地旅游兴起，有些地方被保护为公园。",
          ),
        ),
      ],
      ["Edmund", "Burke", "Burke's", "Alps", "Europe", "Irish", "Mont", "Blanc", "Mary", "Shelley"],
    ),
    passage(
      "bathing-in-the-forest",
      t("Bathing in the Forest", "森林浴"),
      `In 1982, Japan's forestry agency introduced a new phrase: shinrin-yoku, which means forest bathing. It did not involve water. To bathe in a forest meant simply to walk slowly through the trees, using all the senses, and to let the atmosphere of the forest wash over the body and mind. The agency hoped the idea would encourage people from crowded cities such as Tokyo to visit the country's forests, and that it would help protect them.

At first, forest bathing was a gentle custom with little scientific support. Then researchers began to study it. In one series of experiments, Japanese scientists took groups of office workers on trips to forests and compared their health with that of people who walked through city streets. After the forest walks, the participants tended to have lower blood pressure, lower levels of stress hormones and slower heart rates than after the city walks. They also reported feeling calmer and less anxious.

One researcher, the doctor Qing Li, found something more surprising. After a weekend in the forest, the participants' blood contained more of a type of white blood cell that helps the body fight infections, and the effect lasted for days. He suggested that one cause might be chemicals released by trees, which protect them from insects and decay and which people breathe in among the trees.

Not all scientists are convinced by every claim. Some of the studies were small, and it is hard to separate the effect of the trees from the effect of simply taking a holiday, leaving work behind and walking slowly. A careful reader should notice that a calm weekend anywhere might lower stress. Still, a large body of research now suggests that time in green places is good for both mental and physical health.

Forest bathing has spread far beyond Japan. Guides in many countries now lead slow walks in which participants touch the bark of trees, listen to the wind and sit in silence. To some, this seems like an obvious idea dressed up in a fashionable name. People have always found peace in the woods, from poets to hermits.

But perhaps that is the point. In modern life, many people spend more than ninety percent of their time indoors, often in front of screens. The idea of forest bathing gives them permission to do something humans have done for thousands of years: to slow down, to pay attention and to remember that they are part of the living world.`,
      [natureWords, solitude, academic6, academic1, academic2],
      [
        ask(
          t("What does forest bathing involve?", "森林浴包括什么？"),
          t("Walking slowly through trees and using all the senses", "在林中慢慢行走，调动所有感官"),
          [
            t("Swimming in lakes and rivers in the forest", "在森林里的湖泊和河流中游泳"),
            t("Cutting down trees to build bathhouses", "砍树建造浴室"),
            t("Running as fast as possible along forest paths", "沿着林间小路尽可能快地跑"),
          ],
          t(
            "The first paragraph says forest bathing did not involve water but meant walking slowly through the trees using all the senses.",
            "第一段说森林浴不涉及水，而是在林中慢慢行走，调动所有感官。",
          ),
        ),
        ask(
          t("What problem do some scientists see in the studies?", "一些科学家认为这些研究有什么问题？"),
          t("It is hard to separate the effect of trees from the effect of a holiday", "很难把树木的作用与度假本身的作用区分开来"),
          [
            t("The researchers did not measure anyone's blood pressure", "研究人员没有测量任何人的血压"),
            t("The forests used in the studies were too small", "研究中使用的森林太小"),
            t("The participants all became ill after the walks", "参与者在散步后都生病了"),
          ],
          t(
            "The fourth paragraph says some studies were small and it is hard to separate the trees' effect from simply taking a holiday.",
            "第四段说一些研究规模小，而且很难把树木的作用与单纯度假的作用区分开来。",
          ),
        ),
        ask(
          t("What point does the last paragraph make?", "最后一段表达了什么观点？"),
          t(
            "The idea gives modern indoor people permission to do what humans have always done",
            "这个观念让整天待在室内的现代人可以去做人类一直在做的事",
          ),
          [
            t("Forest bathing is a new invention with no history at all", "森林浴是一项全新的发明，毫无历史"),
            t("People should spend all of their time in forests", "人们应该把所有时间都花在森林里"),
            t("Screens are more relaxing than walks in the trees", "屏幕比林中散步更让人放松"),
          ],
          t(
            "The last paragraph says forest bathing gives people who spend most of their time indoors permission to slow down as humans have done for thousands of years.",
            "最后一段说森林浴让大部分时间待在室内的人可以像人类数千年来那样放慢脚步。",
          ),
        ),
      ],
      ["Japan", "Japanese", "Tokyo", "Shinrin", "Yoku", "Qing", "Li"],
    ),
    passage(
      "the-grandmother-on-the-trail",
      t("The Grandmother on the Trail", "步道上的老奶奶"),
      `In May 1955, a sixty-seven-year-old woman from Ohio told her grown children that she was going for a walk. She did not tell them where. She took a bus to Georgia, and on the second of May she set out north on the Appalachian Trail, a footpath of more than two thousand miles through the mountains of the eastern United States. Her name was Emma Gatewood.

She carried almost nothing. Instead of a backpack, she had a cloth bag she had sewn herself and slung over one shoulder. In it were a blanket, a raincoat, a shower curtain to keep off the rain, a first-aid kit, a little food and a notebook. She wore ordinary canvas sneakers and wore out several pairs along the way. She slept on beds of leaves, on porches and sometimes in the homes of strangers who offered her a meal.

Five months later, in September, she reached the summit of Mount Katahdin in Maine, the northern end of the trail. She was the first woman to walk the entire trail alone in one season. Newspapers had discovered her along the way, and reporters asked why she had done it. She gave different answers at different times. Once she said simply that she thought it would be a nice lark.

Only much later did her family speak openly about what she had left out. For more than thirty years, Gatewood had been married to a man who beat her terribly. She had raised eleven children in fear. She had read a magazine article about the trail, and something in it seemed to promise a kind of freedom she had never known. Walking alone through the mountains, answerable to no one, may have been a way of reclaiming a life that had long been taken from her.

Gatewood walked the whole trail twice more, the last time at the age of seventy-five. She also complained publicly about the poor condition of parts of the path, and her fame helped bring volunteers and money to repair it. Some historians credit her with saving the trail at a time when it was falling into neglect.

Today, thousands of people set out on the Appalachian Trail each year, with lightweight tents and expensive boots. Many of them have heard of the grandmother in canvas sneakers. Her story reminds them that the trail asks for persistence more than equipment, and that a long walk in solitude can mean something different to each person who takes it.`,
      [solitude, natureWords, motifs, academic7],
      [
        ask(
          t("What was unusual about Gatewood's equipment?", "盖特伍德的装备有什么不寻常之处？"),
          t("She carried a homemade cloth bag and wore ordinary canvas sneakers", "她背着一个自制的布袋，穿着普通的帆布运动鞋"),
          [
            t("She carried the heaviest backpack ever taken on the trail", "她背着步道上有史以来最重的背包"),
            t("She rode a horse for most of the journey", "她大部分路程是骑马走完的"),
            t("She used a map given to her by the newspapers", "她用的是报社给她的地图"),
          ],
          t(
            "The second paragraph says she had a cloth bag she sewed herself and wore ordinary canvas sneakers.",
            "第二段说她背着一个自己缝的布袋，穿着普通的帆布运动鞋。",
          ),
        ),
        ask(
          t("What does the passage suggest about why Gatewood walked the trail?", "文章暗示盖特伍德为什么要走这条步道？"),
          t(
            "It may have been a way to reclaim freedom after a long, violent marriage",
            "这可能是她在漫长而暴力的婚姻之后重获自由的一种方式",
          ),
          [
            t("She wanted to become famous in the newspapers", "她想在报纸上出名"),
            t("She had been paid by a magazine to test sneakers", "一家杂志付钱请她测试运动鞋"),
            t("Her children had asked her to find a new home in Maine", "她的孩子们请她在缅因州找一个新家"),
          ],
          t(
            "The fourth paragraph says her husband had beaten her for over thirty years, and the walk may have been a way of reclaiming a life taken from her.",
            "第四段说她丈夫殴打她三十多年，这次远足可能是她夺回被剥夺的人生的一种方式。",
          ),
        ),
        ask(
          t("How did Gatewood help the trail itself?", "盖特伍德对步道本身有什么帮助？"),
          t("Her complaints and fame brought volunteers and money to repair it", "她的抱怨和名气为修缮步道带来了志愿者和资金"),
          [
            t("She built shelters along the whole path by herself", "她独自在整条步道沿线修建了避难所"),
            t("She bought the land the trail crosses", "她买下了步道经过的土地"),
            t("She closed the trail to protect it from walkers", "她关闭了步道以免它被行人破坏"),
          ],
          t(
            "The fifth paragraph says she complained about the path's poor condition and her fame helped bring volunteers and money to repair it.",
            "第五段说她抱怨步道状况糟糕，她的名气帮助带来了修缮所需的志愿者和资金。",
          ),
        ),
      ],
      [
        "Emma",
        "Gatewood",
        "Gatewood's",
        "Ohio",
        "Georgia",
        "Maine",
        "Appalachian",
        "Trail",
        "Katahdin",
        "National",
        "Geographic",
        "American",
      ],
    ),
  ],
};
