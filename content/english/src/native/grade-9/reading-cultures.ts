// Grade 9: the reading unit of the seventh theme, stories from many cultures, from the tricksters and storytellers
// of Africa, the Middle East and Asia to the collectors who wrote the old tales down.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const customWords = { topic: "words-of-tradition-and-custom", weight: 0.3 } as const;
const wisdomWords = { topic: "words-of-folk-wisdom", weight: 0.3 } as const;
const familyWords = { topic: "words-of-family-and-belonging", weight: 0.3 } as const;
const perspective = { topic: "perspective-from-another-culture", weight: 0.2 } as const;
const academic1 = { topic: "academic-words-1", weight: 0.1 } as const;

/** storiesFromManyCultures is a reading unit of grade 9 on folk tales, tricksters and traditions around the world. */
export const storiesFromManyCultures: ReadingUnitDef = {
  id: "stories-from-many-cultures",
  title: t("Stories from Many Cultures", "多元文化故事"),
  passages: [
    passage(
      "the-spider-who-owned-the-stories",
      t("The Spider Who Owned the Stories", "拥有故事的蜘蛛"),
      `Among the Akan people of Ghana, in West Africa, many folk tales are known as Anansesem, which means spider stories. Their hero is Kwaku Anansi, a spider who is small and weak but endlessly clever. He is a trickster, a character who wins not by strength but by cunning, and who often breaks the rules.

One famous tale explains how Anansi came to own all the stories in the world. In the beginning, the stories belonged to Nyame, the sky god. Anansi climbed up to the sky and asked to buy them. Nyame laughed. Great and powerful families had tried to buy the stories and failed. But he named a price: Anansi must bring him four creatures that were almost impossible to catch, among them a python, a swarm of hornets and a leopard.

Anansi caught each one with a trick. He told the python that it could not possibly be as long as a palm branch and persuaded it to stretch out beside the branch to prove it, then tied it fast. He poured water over the hornets' nest, told them it was raining and offered them shelter in a dry gourd, then sealed it. He dug a pit for the leopard. When he brought all his captives to the sky, Nyame kept his word. From that day, the stories have been called Anansi's.

When Africans were taken across the Atlantic in the slave trade, they carried Anansi with them. In the Caribbean and the American South, his stories were told and retold. For enslaved people, a small, powerless creature who outwitted the strong was more than entertainment. He was a figure of hope and quiet resistance.

Anansi is not always admirable. He is greedy, lazy and often punished for his tricks. Many of his stories end with a lesson about the danger of selfishness. This double nature is typical of tricksters around the world. They make us laugh, they show that the weak can overcome the powerful, and they also warn us about what happens when cleverness has no conscience.`,
      [wisdomWords, customWords, perspective],
      [
        ask(
          t("What is a trickster, according to the passage?", "根据文章，什么是“骗子精”型人物？"),
          t("A character who wins by cunning rather than strength and often breaks rules", "靠狡猾而非力量取胜、常常打破规矩的人物"),
          [
            t("A powerful god who rules the sky", "统治天空的强大神灵"),
            t("A storyteller who travels between villages", "在村庄间游走的说书人"),
            t("A creature who is always honest", "一个总是诚实的生物"),
          ],
          t(
            "The first paragraph says a trickster is a character who wins not by strength but by cunning and who often breaks the rules.",
            "第一段说骗子精是不靠力量而靠狡猾取胜、常常打破规矩的人物。",
          ),
        ),
        ask(
          t("How did Anansi catch the python?", "阿南西是怎么抓住巨蟒的？"),
          t("He persuaded it to stretch out beside a palm branch and then tied it", "他说服它在棕榈枝旁伸直身子，然后把它捆住"),
          [
            t("He poured water over it", "他往它身上浇水"),
            t("He dug a pit for it", "他为它挖了一个陷坑"),
            t("He offered it shelter in a gourd", "他让它躲进葫芦里"),
          ],
          t(
            "The third paragraph says he told the python it could not be as long as a palm branch, persuaded it to stretch out beside the branch and tied it fast.",
            "第三段说他告诉巨蟒它不可能有棕榈枝那么长，说服它在树枝旁伸直身子，然后把它牢牢捆住。",
          ),
        ),
        ask(
          t("Why was Anansi important to enslaved people in the Americas?", "阿南西为什么对美洲被奴役的人很重要？"),
          t("A small, powerless creature who outwitted the strong gave them hope", "一个弱小无力却能智胜强者的生物给了他们希望"),
          [
            t("His stories taught them how to farm", "他的故事教他们耕种"),
            t("He was the god of the sea", "他是海神"),
            t("His stories were written in their own language", "他的故事是用他们自己的语言写的"),
          ],
          t(
            "The fourth paragraph says a small, powerless creature who outwitted the strong was a figure of hope and quiet resistance for enslaved people.",
            "第四段说对被奴役的人而言，一个弱小却能智胜强者的生物是希望和无声反抗的象征。",
          ),
        ),
      ],
      [
        "Akan",
        "Ghana",
        "West",
        "Africa",
        "Anansesem",
        "Kwaku",
        "Anansi",
        "Nyame",
        "Anansi's",
        "Africans",
        "Atlantic",
        "Caribbean",
        "American",
        "South",
      ],
      ["gourd"],
    ),
    passage(
      "the-wise-fool",
      t("The Wise Fool", "聪明的傻瓜"),
      `From Turkey to Iran, from the Balkans to Central Asia and China, people tell jokes and stories about a man called Nasreddin. In Turkey he is Nasreddin Hodja; elsewhere he may be Mulla Nasreddin or Effendi. He is said to have lived in Anatolia in the thirteenth century, but the stories about him have traveled so far, and been told so often, that it is impossible to separate the real man from the legend.

Nasreddin is a wise fool. He often seems silly or confused, but his foolishness reveals something true about the people around him. In one well-known story, he is invited to a wedding feast wearing his old, shabby clothes. Nobody pays attention to him, and he is given no food. He goes home, puts on a fine fur coat and returns. Now he is welcomed and seated at the best place. When the food arrives, he dips the sleeve of his coat into the soup and says, “Eat, my coat, eat! It is you they invited, not me.”

In another story, a neighbor comes to borrow Nasreddin's donkey. Nasreddin, who does not want to lend it, says the donkey is not at home. Just then, the donkey brays loudly from the stable. “I thought you said the donkey wasn't here,” says the neighbor. Nasreddin answers, offended, “Whom do you believe, me or a donkey?”

Some stories are almost like riddles. One day Nasreddin is found searching for something on the ground outside his house. A friend helps him look. After a while the friend asks where exactly he lost it. “Inside the house,” says Nasreddin. “Then why are we searching out here?” “Because there is more light here.”

The stories are short, but they carry sharp lessons about vanity, honesty and the way people look for easy answers in the wrong places. In 1996, UNESCO celebrated a year of Nasreddin. Across many countries and languages, the same small man on his donkey still makes people laugh at themselves.`,
      [wisdomWords, customWords, perspective],
      [
        ask(
          t("Why is it impossible to separate the real Nasreddin from the legend?", "为什么无法把真实的纳斯雷丁与传说区分开？"),
          t("The stories have traveled so far and been told so often", "这些故事流传太广，讲述太多次了"),
          [
            t("He never existed at all", "他根本不存在"),
            t("His books were all destroyed", "他的书全被毁了"),
            t("He used a different name in every story", "他在每个故事里都用不同的名字"),
          ],
          t(
            "The first paragraph says the stories have traveled so far and been told so often that it is impossible to separate the real man from the legend.",
            "第一段说这些故事流传太广、讲述太多，以致无法把真人与传说区分开。",
          ),
        ),
        ask(
          t("What does Nasreddin show by feeding his coat at the feast?", "纳斯雷丁在宴会上喂他的外套，表明了什么？"),
          t("The hosts valued his fine clothes more than the man himself", "主人看重的是他的华服，而不是他本人"),
          [
            t("He was too hungry to eat properly", "他饿得没法好好吃饭"),
            t("He wanted to ruin the wedding", "他想破坏婚礼"),
            t("The soup was too hot for him", "汤太烫了"),
          ],
          t(
            "The second paragraph says he was ignored in shabby clothes and welcomed in a fine coat, so he told the coat to eat because it was the one they invited.",
            "第二段说他穿旧衣服时无人理睬，穿上华服就受到欢迎，于是他让外套吃，因为主人邀请的是外套。",
          ),
        ),
        ask(
          t("What lesson does the story of searching outside the house suggest?", "在屋外找东西的故事暗示了什么教训？"),
          t("People look for easy answers in the wrong places", "人们在错误的地方寻找简单的答案"),
          [
            t("It is always better to work in daylight", "白天工作总是更好"),
            t("Friends should not help each other", "朋友不应互相帮助"),
            t("Lost things are never found", "丢失的东西永远找不回"),
          ],
          t(
            "The last paragraph says the stories carry lessons about the way people look for easy answers in the wrong places.",
            "最后一段说这些故事蕴含着关于人们在错误的地方寻找简单答案的教训。",
          ),
        ),
      ],
      [
        "Turkey",
        "Iran",
        "Balkans",
        "Central",
        "Asia",
        "China",
        "Nasreddin",
        "Hodja",
        "Mulla",
        "Effendi",
        "Anatolia",
        "Nasreddin's",
        "UNESCO",
      ],
      ["brays"],
    ),
    passage(
      "a-thousand-and-one-nights",
      t("A Thousand and One Nights", "一千零一夜"),
      `The frame story is simple and dark. A king named Shahryar discovers that his wife has betrayed him. Bitter and furious, he decides that no woman can be trusted. Every day he marries a new wife, and every morning he has her killed, so that she will never have the chance to betray him.

The kingdom lives in terror. Then Shahrazad, the clever and well-read daughter of the king's own minister, volunteers to marry him. Her father begs her not to. But Shahrazad has a plan. On their wedding night, she begins to tell the king a story, and she stops at the most exciting moment, just as dawn breaks. The king wants to hear the ending, so he lets her live one more day. The next night she finishes the story and begins another, again stopping at a moment of suspense.

This continues for a thousand and one nights. Her stories contain other stories, which contain still others, like boxes inside boxes. There are tales of merchants and thieves, of djinn trapped in bottles, of talking animals, of journeys to magical islands. By the end, Shahrazad has borne the king children, and he has been transformed. He no longer wants to kill her; his cruelty has been healed by her stories.

The collection known in English as The Arabian Nights grew over many centuries. Its tales came from Persia, India, Iraq and Egypt, and they were gathered in Arabic. Some of the stories most famous in the West, including those of Aladdin and Ali Baba, do not appear in the oldest Arabic manuscripts. They were added in the early eighteenth century by a French translator, Antoine Galland, who said he had heard them from a Syrian storyteller.

The collection is a story about the power of stories. Shahrazad has no weapons and no army. She saves her own life and the lives of countless women with nothing but her memory, her imagination and her understanding of how to make a listener need to know what happens next.`,
      [customWords, wisdomWords, perspective],
      [
        ask(
          t("How does Shahrazad keep the king from killing her?", "谢赫拉莎德如何让国王不杀她？"),
          t("She stops each story at an exciting moment so he wants to hear the ending", "她在每个故事最精彩的时候停下，让国王想听结局"),
          [
            t("She poisons the king's food", "她在国王的食物里下毒"),
            t("Her father orders the king to spare her", "她父亲命令国王饶了她"),
            t("She escapes from the palace at dawn", "她在黎明时逃出王宫"),
          ],
          t(
            "The second paragraph says she stops at the most exciting moment as dawn breaks, and the king wants to hear the ending, so he lets her live.",
            "第二段说她在黎明时分最精彩的地方停下，国王想听结局，就让她多活一天。",
          ),
        ),
        ask(
          t(
            "Where did the stories of Aladdin and Ali Baba come from, according to the passage?",
            "根据文章，阿拉丁和阿里巴巴的故事出自哪里？",
          ),
          t(
            "A French translator added them, saying he had heard them from a Syrian storyteller",
            "一位法国译者添加了它们，说是从一位叙利亚说书人那里听来的",
          ),
          [
            t("They are in the oldest Arabic manuscripts", "它们出现在最古老的阿拉伯文手稿中"),
            t("Shahrazad wrote them herself", "谢赫拉莎德亲自写了它们"),
            t("They came from ancient Greece", "它们来自古希腊"),
          ],
          t(
            "The fourth paragraph says they do not appear in the oldest Arabic manuscripts and were added by Antoine Galland, who said he heard them from a Syrian storyteller.",
            "第四段说它们不见于最古老的阿拉伯文手稿，是安托万·加朗添加的，他说是从一位叙利亚说书人那里听来的。",
          ),
        ),
        ask(
          t("What does the passage say the collection is about?", "文章说这部故事集讲的是什么？"),
          t("The power of stories", "故事的力量"),
          [
            t("The history of Persian kings", "波斯国王的历史"),
            t("How to travel to magical islands", "如何前往魔法岛屿"),
            t("Why merchants become thieves", "商人为何沦为盗贼"),
          ],
          t("The last paragraph says the collection is a story about the power of stories.", "最后一段说这部故事集讲的是故事的力量。"),
        ),
      ],
      [
        "Shahryar",
        "Shahrazad",
        "English",
        "Arabian",
        "Nights",
        "Persia",
        "India",
        "Iraq",
        "Egypt",
        "Arabic",
        "West",
        "Aladdin",
        "Ali",
        "Baba",
        "French",
        "Antoine",
        "Galland",
        "Syrian",
      ],
      ["djinn"],
    ),
    passage(
      "the-fisherman-and-the-sea-palace",
      t("The Fisherman and the Sea Palace", "渔夫与海底宫殿"),
      `One of the oldest stories in Japan is the tale of Urashima Taro. Versions of it appear in writings from the eighth century, and it is still told to children today.

Urashima Taro is a young fisherman. One day on the beach, he sees a group of boys tormenting a small turtle. He scolds them, buys the turtle from them and returns it to the sea. Some time later, while he is fishing, a huge turtle rises from the waves. It tells him that the creature he saved was the daughter of the Dragon King of the sea, and that he has been invited to visit her.

Riding on the turtle's back, Urashima descends to the bottom of the ocean, where he finds a palace of coral and crystal. The princess, Otohime, welcomes him with music, dancing and feasts. Time passes in delight. In some versions, each window of the palace looks out on a different season.

After what seems to be three days, Urashima begins to miss his mother and his village. The princess sadly allows him to leave. As a parting gift, she gives him a beautiful lacquered box, but she warns him never to open it.

When he returns to the shore, everything is strange. The village has changed, and no one recognizes him. At last he meets an old man who says he has heard of a fisherman named Urashima who disappeared at sea, three hundred years ago. In despair, Urashima forgets the warning and opens the box. A cloud of white smoke rises, and in an instant he becomes an ancient man, his hair white, his face wrinkled. In some versions, he crumbles into dust.

The story has puzzled readers for centuries. Is it a punishment for disobedience? A lesson about the passing of time? A reminder that we cannot return to the past? Many cultures have similar tales, such as the Irish legend of Oisín, who returns from a magical land to find centuries gone. Their endings are rarely happy. They suggest that the price of paradise may be everything we leave behind.`,
      [customWords, wisdomWords, perspective],
      [
        ask(
          t("Why is Urashima invited to the sea palace?", "浦岛太郎为什么被邀请到海底宫殿？"),
          t("The turtle he saved was the daughter of the Dragon King", "他救的那只海龟是龙王的女儿"),
          [
            t("He caught the largest fish in his village", "他捕到了村里最大的鱼"),
            t("He fell into the sea during a storm", "他在暴风雨中掉进了海里"),
            t("His mother sent him to find a wife", "他母亲让他去找妻子"),
          ],
          t(
            "The second paragraph says the huge turtle told him the creature he saved was the daughter of the Dragon King and that he had been invited.",
            "第二段说那只大海龟告诉他，他救的是龙王的女儿，她邀请他去做客。",
          ),
        ),
        ask(
          t("What does Urashima discover when he returns to the shore?", "浦岛太郎回到岸上时发现了什么？"),
          t("Three hundred years have passed", "已经过去了三百年"),
          [
            t("Only three days have passed", "只过去了三天"),
            t("His mother has been waiting for him", "他母亲一直在等他"),
            t("The village has become a palace", "村庄变成了宫殿"),
          ],
          t(
            "The fifth paragraph says an old man told him a fisherman named Urashima disappeared three hundred years ago.",
            "第五段说一位老人告诉他，一个叫浦岛的渔夫三百年前在海上失踪了。",
          ),
        ),
        ask(
          t(
            "What do similar tales from other cultures suggest, according to the last paragraph?",
            "根据最后一段，其他文化中的类似故事暗示了什么？",
          ),
          t("The price of paradise may be everything we leave behind", "天堂的代价也许是我们留下的一切"),
          [
            t("Magical lands are always dangerous", "魔法之地总是很危险"),
            t("Turtles should be protected", "海龟应该受到保护"),
            t("Gifts should never be accepted", "永远不应接受礼物"),
          ],
          t(
            "The last paragraph says the endings are rarely happy and suggest that the price of paradise may be everything we leave behind.",
            "最后一段说这些故事的结局很少是圆满的，暗示天堂的代价也许是我们留下的一切。",
          ),
        ),
      ],
      ["Japan", "Urashima", "Taro", "Dragon", "King", "Otohime", "Irish", "Oisín"],
      ["lacquered"],
    ),
    passage(
      "proverbs-and-the-art-of-talk",
      t("Proverbs and the Art of Talk", "谚语与说话的艺术"),
      `In 1958, the Nigerian writer Chinua Achebe published his first novel, Things Fall Apart. It tells the story of Okonkwo, a proud and powerful man in an Igbo village in the years when British missionaries and officials were arriving. The novel became one of the most widely read books by an African writer, translated into more than fifty languages.

Achebe wrote it partly as a reply. He had read European novels set in Africa that described Africans as savage people without history or culture. He wanted to show the Igbo world from the inside: its laws, its religion, its debates, its humor and its art of speech.

One of the most striking features of the novel is its use of proverbs. In the villages Achebe describes, a speaker who can use proverbs well is greatly respected. When a man comes to ask a neighbor to repay a debt, he does not ask directly. He talks around the subject, using proverb after proverb, until both men understand what is being said. Achebe's narrator explains that among the Igbo, the art of conversation is highly regarded, and proverbs are the palm oil with which words are eaten.

The image is precise. In Igbo cooking, palm oil makes food smooth and rich. Proverbs, in the same way, make speech easier to swallow. A blunt request might offend; a request wrapped in wisdom shows respect for the listener and for tradition.

This attention to language is part of Achebe's argument. A society that values the skill of speech so highly is clearly not without culture. By filling his English novel with Igbo proverbs, Achebe brought the rhythms of one language into another and showed readers that eloquence takes many forms.

The novel's title comes from a poem by the Irish writer W. B. Yeats, which describes a world in collapse. As the story goes on, the arrival of the Europeans shakes the village apart. But because Achebe has first shown the richness of that world, readers understand exactly what is being lost.`,
      [wisdomWords, customWords, perspective],
      [
        ask(
          t("Why did Achebe write Things Fall Apart partly as a reply?", "阿切贝为什么把《瓦解》部分地当作一种回应来写？"),
          t("European novels had described Africans as people without history or culture", "欧洲小说把非洲人描写成没有历史和文化的人"),
          [
            t("Another Nigerian writer had criticized him", "另一位尼日利亚作家批评了他"),
            t("British officials asked him to defend them", "英国官员请他为他们辩护"),
            t("He wanted to translate a poem by Yeats", "他想翻译叶芝的一首诗"),
          ],
          t(
            "The second paragraph says he had read European novels describing Africans as savage people without history or culture and wanted to show the Igbo world from the inside.",
            "第二段说他读过把非洲人描写成没有历史和文化的野蛮人的欧洲小说，想从内部展现伊博人的世界。",
          ),
        ),
        ask(
          t("What does the comparison of proverbs to palm oil mean?", "把谚语比作棕榈油是什么意思？"),
          t("Proverbs make speech easier to accept, as palm oil makes food smooth", "谚语让话语更易接受，正如棕榈油让食物顺滑"),
          [
            t("Proverbs are sold at the market like oil", "谚语像油一样在市场上出售"),
            t("Proverbs are only used while cooking", "谚语只在做饭时使用"),
            t("Proverbs make speech longer and heavier", "谚语让话语更长更沉重"),
          ],
          t(
            "The fourth paragraph says palm oil makes food smooth and rich, and proverbs in the same way make speech easier to swallow.",
            "第四段说棕榈油让食物顺滑浓郁，谚语同样让话语更易入耳。",
          ),
        ),
        ask(
          t("How does Achebe's use of proverbs support his argument?", "阿切贝对谚语的运用如何支持了他的论点？"),
          t("A society that values skilled speech so highly is clearly not without culture", "一个如此重视说话技巧的社会显然并非没有文化"),
          [
            t("It shows that the Igbo had no written language", "它表明伊博人没有书面语言"),
            t("It proves that English is better for novels", "它证明英语更适合写小说"),
            t("It makes the novel shorter", "它使小说更短"),
          ],
          t(
            "The fifth paragraph says a society that values the skill of speech so highly is clearly not without culture.",
            "第五段说一个如此重视说话技巧的社会显然并非没有文化。",
          ),
        ),
      ],
      [
        "Nigerian",
        "Chinua",
        "Achebe",
        "Things",
        "Fall",
        "Apart",
        "Okonkwo",
        "Igbo",
        "British",
        "African",
        "European",
        "Africa",
        "Africans",
        "Achebe's",
        "English",
        "Irish",
        "W.",
        "B.",
        "Yeats",
        "Europeans",
      ],
    ),
    passage(
      "the-brothers-who-collected-tales",
      t("The Brothers Who Collected Tales", "收集故事的兄弟"),
      `In the early nineteenth century, two German brothers, Jacob and Wilhelm Grimm, set out to collect the folk tales of their country. They were scholars of language and law, not writers of children's books. At the time, the German-speaking lands were divided into many small states, and parts had been conquered by Napoleon's France. The brothers believed that the old stories told by ordinary people preserved something of a shared German culture, and that they had to be written down before they disappeared.

In 1812 they published the first volume of Children's and Household Tales. It contained stories that are now known all over the world: Cinderella, Snow White, Hansel and Gretel, Little Red Riding Hood and many more.

The brothers liked to give the impression that they had gathered their tales from simple peasants. In fact, many of their storytellers were educated young women from middle-class families, some of whom had learned the stories from French sources. One of their most important sources was Dorothea Viehmann, a tailor's widow who sold vegetables and who could repeat a tale almost word for word.

The first edition surprised many readers. It was full of footnotes and was quite violent. In the original version of Cinderella, the stepsisters cut off parts of their feet to fit into the slipper, and at the end birds peck out their eyes. Mothers in some tales were cruel; in later editions, Wilhelm often changed them into stepmothers.

Over the next forty years, Wilhelm revised the tales again and again. He made the language smoother, added moral lessons and removed details that seemed unsuitable for children. The collection became a family book, and it grew from about eighty-six tales to more than two hundred.

Folklorists today study the Grimms' work with both admiration and caution. The brothers saved stories that might have been lost, and they helped to create the modern study of folklore. But they also shaped those stories to fit their own ideas. Every collection of folk tales, in a sense, tells us as much about the collectors as about the folk.`,
      [wisdomWords, customWords, familyWords, academic1],
      [
        ask(
          t("Why did the Grimm brothers want to collect folk tales?", "格林兄弟为什么想收集民间故事？"),
          t(
            "They believed the tales preserved a shared German culture that might disappear",
            "他们认为这些故事保存了可能消失的共同的德意志文化",
          ),
          [
            t("They wanted to write books for their own children", "他们想为自己的孩子写书"),
            t("Napoleon asked them to", "拿破仑要求他们这样做"),
            t("They needed money to study law", "他们需要钱学法律"),
          ],
          t(
            "The first paragraph says they believed the old stories preserved something of a shared German culture and had to be written down before they disappeared.",
            "第一段说他们认为这些老故事保存了共同的德意志文化，必须在消失前记录下来。",
          ),
        ),
        ask(
          t("Who were many of the brothers' storytellers in fact?", "兄弟俩的讲述者实际上很多是什么人？"),
          t("Educated young women from middle-class families", "来自中产家庭、受过教育的年轻女性"),
          [
            t("Simple peasants in remote villages", "偏远村庄里的普通农民"),
            t("Professional actors", "职业演员"),
            t("Their own university students", "他们自己大学里的学生"),
          ],
          t(
            "The third paragraph says many of their storytellers were educated young women from middle-class families.",
            "第三段说他们的讲述者中很多是来自中产家庭、受过教育的年轻女性。",
          ),
        ),
        ask(
          t("How did Wilhelm change the tales over forty years?", "威廉在四十年间如何修改这些故事？"),
          t("He smoothed the language, added morals and removed unsuitable details", "他润色语言，加入道德教训，删去不适合的细节"),
          [
            t("He made them more violent", "他让故事更暴力"),
            t("He translated them into French", "他把它们译成法语"),
            t("He reduced them to a few tales", "他把它们删减到只剩几个故事"),
          ],
          t(
            "The fifth paragraph says he made the language smoother, added moral lessons and removed details that seemed unsuitable for children.",
            "第五段说他让语言更流畅，加入道德教训，删去了似乎不适合儿童的细节。",
          ),
        ),
      ],
      [
        "German",
        "Jacob",
        "Wilhelm",
        "Grimm",
        "German-speaking",
        "Napoleon's",
        "France",
        "Children's",
        "Household",
        "Tales",
        "Cinderella",
        "Snow",
        "White",
        "Hansel",
        "Gretel",
        "Little",
        "Red",
        "Riding",
        "Hood",
        "French",
        "Dorothea",
        "Viehmann",
        "Grimms'",
      ],
      ["stepsisters"],
    ),
    passage(
      "the-day-of-the-dead",
      t("The Day of the Dead", "亡灵节"),
      `Every year at the beginning of November, families across Mexico prepare to welcome visitors who have traveled a long way. The visitors are their dead relatives, and the holiday is called the Día de los Muertos, the Day of the Dead.

The celebration has roots in the traditions of Indigenous peoples such as the Aztecs, who honored the dead with festivals long before the Spanish arrived in the sixteenth century. After the conquest, these customs blended with the Catholic holidays of All Saints' Day and All Souls' Day on November 1 and 2. The result is a festival unlike any other.

At the center of the celebration is the ofrenda, an altar built in the home. Families decorate it with photographs of the dead, candles and bright orange marigolds, whose strong scent and color are believed to guide the spirits home. They place the dead person's favorite foods and drinks on the altar, along with a sweet bread called pan de muerto. A glass of water is set out, since the spirits are said to be thirsty after their journey.

Many families also visit cemeteries. They clean and decorate the graves, and some stay all night, sharing food, playing music and telling stories about the people they have lost. Sugar skulls, often with a name written on the forehead, are given as gifts. The elegant skeleton lady known as La Catrina, first drawn by the artist José Guadalupe Posada in the early twentieth century, appears on posters and costumes everywhere.

To visitors from cultures that treat death with silence and fear, the festival can seem strange. But its spirit is not gloomy. It is a celebration of memory and of the bond between generations. The dead, the tradition says, are not truly gone as long as they are remembered.

In 2008, UNESCO recognized the festival as part of the Intangible Cultural Heritage of Humanity. Its customs have spread far beyond Mexico, carried by families who have moved abroad, and by films that have introduced its colors and its gentle wisdom to children around the world.`,
      [customWords, familyWords, perspective],
      [
        ask(
          t("Where does the Day of the Dead come from?", "亡灵节起源于什么？"),
          t(
            "Indigenous traditions blended with Catholic holidays after the Spanish conquest",
            "原住民传统与西班牙征服后的天主教节日相融合",
          ),
          [
            t("A festival invented in the twentieth century", "20 世纪发明的一个节日"),
            t("A holiday brought from Asia", "从亚洲传来的节日"),
            t("A film made for children", "一部儿童电影"),
          ],
          t(
            "The second paragraph says it has roots in Indigenous traditions, which blended with the Catholic holidays of All Saints' Day and All Souls' Day.",
            "第二段说它源于原住民传统，后来与天主教的诸圣节和万灵节相融合。",
          ),
        ),
        ask(
          t("Why are marigolds placed on the ofrenda?", "为什么在祭坛上摆放万寿菊？"),
          t("Their strong scent and color are believed to guide the spirits home", "人们相信它们浓烈的气味和颜色能指引亡灵回家"),
          [
            t("They are the favorite food of the dead", "它们是亡者最爱的食物"),
            t("They keep the candles from going out", "它们能防止蜡烛熄灭"),
            t("They are the only flowers that grow in November", "它们是十一月唯一开放的花"),
          ],
          t(
            "The third paragraph says the marigolds' strong scent and color are believed to guide the spirits home.",
            "第三段说人们相信万寿菊浓烈的气味和颜色能指引亡灵回家。",
          ),
        ),
        ask(
          t("What is the spirit of the festival, according to the passage?", "根据文章，这个节日的精神是什么？"),
          t("A celebration of memory and the bond between generations", "对记忆和代际纽带的颂扬"),
          [
            t("A time of silence and fear", "一个沉默与恐惧的时刻"),
            t("A warning about the dangers of death", "对死亡危险的警告"),
            t("A competition for the best costume", "一场最佳服装比赛"),
          ],
          t(
            "The fifth paragraph says its spirit is not gloomy but a celebration of memory and of the bond between generations.",
            "第五段说它的精神并不阴郁，而是对记忆和代际纽带的颂扬。",
          ),
        ),
      ],
      [
        "November",
        "Mexico",
        "Día",
        "de",
        "los",
        "Muertos",
        "Day",
        "Dead",
        "Indigenous",
        "Aztecs",
        "Spanish",
        "Catholic",
        "All",
        "Saints'",
        "Souls'",
        "La",
        "Catrina",
        "José",
        "Guadalupe",
        "Posada",
        "UNESCO",
        "Intangible",
        "Cultural",
        "Heritage",
        "Humanity",
      ],
      ["ofrenda", "marigolds", "pan", "muerto"],
    ),
    passage(
      "the-tale-of-the-frog-in-the-well",
      t("The Frog in the Well", "井底之蛙"),
      `Chinese has thousands of short sayings called chengyu. Most have four characters, and many come from stories in ancient books. To understand a chengyu fully, a speaker must know the story behind it. One of the best known is jing di zhi wa, the frog at the bottom of the well.

The story comes from the Zhuangzi, a collection of writings associated with a philosopher who lived more than two thousand years ago. In the tale, a frog lives in an old, broken well. One day a great turtle from the Eastern Sea comes by, and the frog boasts about his wonderful home. “How happy I am!” he says. “I can jump about on the edge of the well, and when I am tired I rest in the holes in the wall. When I swim, the water holds me up under my arms. I am the master of this whole well. Why don't you come down and see it?”

The turtle tries, but before he can get his left foot into the well, his right knee is stuck. He backs away and tells the frog about the sea. Its size, he says, cannot be measured in thousands of miles, and its depth cannot be measured in thousands of feet. In ancient times there were floods for nine years out of ten, and the sea did not rise; there were droughts for seven years out of eight, and it did not sink. The frog, hearing this, is astonished and confused.

Today the saying describes a person whose view of the world is narrow, who mistakes a small corner for the whole of reality. It is usually a criticism, but it can also be a warning to oneself.

English has similar expressions. A person may be said to have a narrow outlook or to be unable to see the forest for the trees. Yet the frog's story adds something these phrases lack. The frog is not stupid; he is simply proud of what he knows, and he has never been shown anything larger. The cure for his condition is not shame but a visitor, someone who brings news from beyond the walls.`,
      [wisdomWords, perspective],
      [
        ask(
          t("Why must a speaker know the story behind a chengyu?", "为什么说话者必须了解成语背后的故事？"),
          t("Many chengyu come from stories, so the story gives the full meaning", "许多成语出自故事，故事赋予它完整的含义"),
          [
            t("Chengyu are only used in storytelling", "成语只在讲故事时使用"),
            t("The characters of chengyu cannot be read", "成语中的字无法认读"),
            t("Every chengyu describes a frog", "每个成语都描写一只青蛙"),
          ],
          t(
            "The first paragraph says many chengyu come from stories in ancient books, and to understand one fully a speaker must know the story behind it.",
            "第一段说许多成语出自古书中的故事，要完全理解一个成语，必须了解它背后的故事。",
          ),
        ),
        ask(
          t("What does the turtle tell the frog about the sea?", "海龟告诉青蛙关于大海的什么？"),
          t(
            "Its size and depth cannot be measured, and floods and droughts do not change it",
            "它的大小和深度无法测量，洪水和干旱也改变不了它",
          ),
          [
            t("It is smaller than the well", "它比井还小"),
            t("It is full of other frogs", "那里有很多别的青蛙"),
            t("It dries up every summer", "它每年夏天都会干涸"),
          ],
          t(
            "The third paragraph says the sea's size and depth cannot be measured, and it did not rise in floods or sink in droughts.",
            "第三段说大海的大小和深度无法测量，洪水时不涨，干旱时不落。",
          ),
        ),
        ask(
          t("What does the frog's story add that similar English expressions lack?", "青蛙的故事增添了哪些类似英语表达所缺少的东西？"),
          t("The frog is not stupid; he has simply never been shown anything larger", "青蛙并不愚蠢，他只是从未见过更广阔的东西"),
          [
            t("The frog is punished for his pride", "青蛙因骄傲而受到惩罚"),
            t("The frog leaves the well forever", "青蛙永远离开了井"),
            t("The frog teaches the turtle a lesson", "青蛙给海龟上了一课"),
          ],
          t(
            "The last paragraph says the frog is not stupid but proud of what he knows and has never been shown anything larger.",
            "最后一段说青蛙并不愚蠢，他只是为自己所知而自豪，从未见过更广阔的东西。",
          ),
        ),
      ],
      ["Chinese", "Zhuangzi", "Eastern", "Sea", "English"],
      ["chengyu", "jing", "di", "zhi", "wa"],
    ),
  ],
};
