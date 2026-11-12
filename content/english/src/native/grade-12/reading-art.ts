// Grade 12: the reading unit of the fourth theme, art and its critics, from a ballet that caused a riot and a
// painting a critic named by mocking it to a signed piece of plumbing, a painting that shredded itself, a nanny's
// hidden photographs, a painter who sued a critic, a novel that failed and the stars of the crowd.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const art = { topic: "words-of-art-criticism", weight: 0.3 } as const;
const taste = { topic: "words-of-taste-and-beauty", weight: 0.3 } as const;
const review = { topic: "evaluating-a-review", weight: 0.2 } as const;
const academic10 = { topic: "academic-words-10", weight: 0.1 } as const;
const academic11 = { topic: "academic-words-11", weight: 0.1 } as const;
const academic1 = { topic: "academic-words-1", weight: 0.1 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;

/** artAndItsCritics is a reading unit of grade 12 on art and its critics, taste and beauty, and how to judge a judgment of a work. */
export const artAndItsCritics: ReadingUnitDef = {
  id: "art-and-its-critics",
  title: t("Art and Its Critics", "艺术与评论"),
  passages: [
    passage(
      "the-night-of-the-riot",
      t("The Night of the Riot", "骚乱之夜"),
      `On the evening of May 29, 1913, an audience gathered in a new theater in Paris to see the first performance of a ballet called The Rite of Spring. The music was by a young Russian composer, Igor Stravinsky, and the dances were created by Vaslav Nijinsky, the most famous dancer of the time. The ballet told of an ancient ritual in which a young woman dances herself to death to welcome the spring.

Within minutes of the opening, the audience began to stir. The music was unlike anything most of them had heard: harsh, loud chords repeated with sudden changes of rhythm, melodies that seemed to clash with each other, and a pounding beat. The dancers did not float gracefully as ballet dancers usually did. They stamped, turned their feet inward and jerked as if pulled by strings. Some people laughed, some shouted insults, and others shouted back at them to be quiet. According to some accounts, objects were thrown. The noise was so loud that the dancers could barely hear the orchestra.

The reviews the next day were divided. Some critics called the work a brutal joke and complained that it was ugly and noisy. Others, though shocked, sensed that they had heard something important. The arguments were often less about the work itself than about what ballet ought to be: graceful and pleasing, or free to express harsher things.

What happened next is just as revealing. In April 1914, the music was played again in Paris, this time as a concert without dancing. The audience cheered, and Stravinsky was carried out of the hall on the shoulders of admirers. Within a few years the piece was being performed around the world. Today it is widely considered one of the most important works of music of the twentieth century, and its rhythms have influenced composers of film and popular music as well as of concert music.

The story is often told as a warning about critics who failed to recognize genius. That is partly fair. But it also shows how hard it is to judge something truly new. The first audience had no categories for what they heard. A judgment of a work depends not only on the work but on what the judge expects, and it takes time for expectations to change.`,
      [art, review, academic10],
      [
        ask(
          t("Why did many people in the first audience react so strongly?", "为什么首演的许多观众反应如此强烈？"),
          t("The music and dancing were unlike anything they had known", "那种音乐和舞蹈与他们所熟悉的一切都不同"),
          [
            t("The theater had sold too many tickets for the hall", "剧院卖出的票超过了大厅的容量"),
            t("Stravinsky had insulted the audience before the show", "斯特拉文斯基在演出前侮辱了观众"),
            t("The dancers forgot their steps halfway through", "舞者演到一半忘了舞步"),
          ],
          t(
            "The second paragraph describes harsh chords, sudden rhythms and stamping, jerking dancers unlike anything most of the audience had experienced.",
            "第二段描述了刺耳的和弦、突变的节奏以及跺脚、抽动的舞者，这些与大多数观众经历过的都不同。",
          ),
        ),
        ask(
          t("What was the 1914 concert performance evidence of?", "1914 年的音乐会演出证明了什么？"),
          t("How quickly opinion of the work changed", "人们对这部作品的看法转变得多么快"),
          [
            t("That the dancing had been the best part of the ballet", "舞蹈曾是这部芭蕾最好的部分"),
            t("That Paris audiences disliked all new music", "巴黎观众不喜欢所有的新音乐"),
            t("That Stravinsky had rewritten most of the music", "斯特拉文斯基改写了大部分音乐"),
          ],
          t(
            "The fourth paragraph says that less than a year later the audience cheered and carried Stravinsky out on their shoulders.",
            "第四段说不到一年之后，观众欢呼着把斯特拉文斯基扛在肩上抬了出去。",
          ),
        ),
        ask(
          t("What does the writer conclude about judging new art?", "作者对评判新艺术得出了什么结论？"),
          t("A judgment depends on the judge's expectations, which take time to change", "评判取决于评判者的期待，而期待需要时间才能改变"),
          [
            t("Critics who dislike new work are always wrong", "不喜欢新作品的评论家总是错的"),
            t("New art should be shown only as concerts first", "新艺术应该先只以音乐会形式展出"),
            t("Audiences should never make noise in a theater", "观众绝不应在剧院里喧哗"),
          ],
          t(
            "The last paragraph says a judgment depends on what the judge expects, and it takes time for expectations to change.",
            "最后一段说评判取决于评判者的期待，而期待需要时间才能改变。",
          ),
        ),
      ],
      [
        "Igor",
        "Stravinsky",
        "Stravinsky's",
        "Rite",
        "Spring",
        "Paris",
        "Vaslav",
        "Nijinsky",
        "Nijinsky's",
        "Russian",
        "Russians",
        "Ballets",
        "Russes",
        "May",
      ],
    ),
    passage(
      "the-critic-who-named-a-movement",
      t("The Critic Who Named a Movement", "为一个流派命名的评论家"),
      `In April 1874, a group of painters who had grown tired of being rejected by the official art exhibition in Paris held a show of their own. Among them were Claude Monet, Pierre-Auguste Renoir, Edgar Degas and Camille Pissarro. Their paintings looked unfinished to many visitors. The brushwork was loose and quick, the colors bright and unmixed, the subjects ordinary: a crowded street, a field of flowers, a harbor at dawn.

One of Monet's paintings showed the harbor of Le Havre in the early morning, with a small orange sun above gray-blue water and a few dark boats sketched in a handful of strokes. When asked for a title, Monet is said to have answered, "Impression." The painting became Impression, Sunrise.

A critic named Louis Leroy visited the show and wrote a mocking review for a humorous newspaper. He wrote it as a conversation between himself and an imaginary older painter who grows more and more upset as they walk through the rooms. Standing in front of Monet's harbor, the old painter asks what it represents and, on reading the title, exclaims that wallpaper in its earliest state is more finished than this seascape. Leroy titled his review "The Exhibition of the Impressionists."

He meant the word as an insult. The painters, he implied, did not paint real pictures, only vague impressions. But the name stuck, and within a few years the painters themselves began to use it. Impressionism became one of the most admired movements in the history of art, and Impression, Sunrise one of its best-known works.

Leroy's review is a good example of a judgment that tells us more about its standards than about its subject. His complaint was that the paintings were not finished, which assumes that a good painting must be smooth and detailed. The Impressionists were trying to do something else: to capture the changing light of a moment, which detail would have destroyed.

Yet Leroy was not simply foolish. He noticed exactly what was new about the work, its looseness and speed, and he described it vividly. He judged it by the wrong standard. A careful reader of reviews learns to separate the two: what a critic observes, which may be accurate, and the standard by which the critic judges, which may be the very thing in question.`,
      [art, review, academic11],
      [
        ask(
          t('Why did Leroy call the painters "Impressionists"?', "勒鲁瓦为什么称这些画家为“印象派”？"),
          t("To mock them for painting vague impressions instead of real pictures", "嘲笑他们画的只是模糊的印象，而不是真正的画"),
          [
            t("Because the painters had asked him to give them a name", "因为画家们请他给他们起个名字"),
            t("To praise them for their careful and detailed technique", "称赞他们细致入微的技法"),
            t("Because all their paintings showed the sun rising", "因为他们所有的画都画着日出"),
          ],
          t(
            "The fourth paragraph says Leroy meant the word as an insult, implying they painted only vague impressions.",
            "第四段说勒鲁瓦用这个词是一种侮辱，暗示他们只画模糊的印象。",
          ),
        ),
        ask(
          t("What standard was Leroy's judgment based on, according to the writer?", "作者认为勒鲁瓦的评判基于什么标准？"),
          t("That a good painting must be smooth and detailed", "一幅好画必须光滑而细致"),
          [
            t("That a good painting must show ordinary life", "一幅好画必须表现日常生活"),
            t("That a good painting must use bright colors", "一幅好画必须使用明亮的颜色"),
            t("That a good painting must be finished quickly", "一幅好画必须很快完成"),
          ],
          t(
            "The fifth paragraph says his complaint assumes that a good painting must be smooth and detailed.",
            "第五段说他的抱怨假定一幅好画必须光滑而细致。",
          ),
        ),
        ask(
          t("What does the writer say a careful reader of reviews should do?", "作者说一个细心的评论读者应该怎么做？"),
          t("Separate what a critic observes from the standard used to judge it", "把评论家观察到的东西和用来评判的标准区分开"),
          [
            t("Trust a review only if it is funny and vivid", "只有当评论有趣生动时才相信它"),
            t("Ignore reviews written for humorous newspapers", "忽略为幽默报纸写的评论"),
            t("Accept the critic's standard if the critic is famous", "如果评论家很有名，就接受他的标准"),
          ],
          t(
            "The last paragraph says a careful reader separates what the critic observes, which may be accurate, from the standard of judgment, which may be in question.",
            "最后一段说细心的读者会把评论家所观察到的（可能准确）与评判标准（可能有问题）区分开。",
          ),
        ),
      ],
      [
        "Louis",
        "Leroy",
        "Leroy's",
        "Claude",
        "Monet",
        "Monet's",
        "Impression",
        "Sunrise",
        "Paris",
        "Charivari",
        "French",
        "Impressionists",
        "Impressionism",
        "Pierre-Auguste",
        "Renoir",
        "Edgar",
        "Degas",
        "Camille",
        "Pissarro",
        "Le",
        "Havre",
        "April",
      ],
    ),
    passage(
      "a-signed-piece-of-plumbing",
      t("A Signed Piece of Plumbing", "签了名的卫浴器具"),
      `In 1917, a new art society in New York announced an exhibition that would accept any work from any artist who paid a small fee. There would be no jury and no prizes. One of the society's directors was a French artist named Marcel Duchamp. Shortly before the show opened, he bought an ordinary porcelain urinal from a plumbing supplier, turned it on its back, signed it "R. Mutt 1917" and submitted it under that false name with the title Fountain.

The society's other directors were not amused. After an argument, they decided that the object was not art and kept it out of the exhibition, though the rules had promised that nothing would be refused. Duchamp resigned. The original Fountain was photographed by Alfred Stieglitz and then lost, probably thrown away. Most of the "Fountains" in museums today are copies made decades later.

A small magazine edited by Duchamp's friends defended the work. Whether Mr. Mutt made the fountain with his own hands, it argued, was not important. He chose it. He took an everyday object and placed it so that its useful meaning disappeared, creating a new thought for that object. The act of choosing, not the skill of making, was what made it art.

This idea, that an artist could present an ordinary object as a work of art, has been called one of the most influential in modern art. Duchamp called such works "readymades." They challenged the old belief that art must be beautiful, skillfully made and personally crafted. They suggested instead that art is defined by the ideas it raises and the context in which it is shown. Much of the conceptual art and installation work of the following century built on that suggestion.

Not everyone accepts it. Critics of the readymades argue that if anything can be art, the word means nothing, and that skill and beauty are not arbitrary standards but the very things that make art worth looking at. Some see Fountain as a brilliant question; others as a clever joke that has been taken too seriously, or even as philistine contempt for craft dressed up as daring.

Both sides agree on one point. Fountain made it impossible to ask "Is this good art?" without first asking a harder question: "What is art?"`,
      [art, taste, academic10],
      [
        ask(
          t("Why did the society's directors refuse to show Fountain?", "协会的理事们为什么拒绝展出《泉》？"),
          t("They decided that the object was not art", "他们认定这件东西不是艺术"),
          [
            t("Duchamp had not paid the fee to take part", "杜尚没有交参展费"),
            t("The urinal was broken when it arrived", "小便池送到时已经破了"),
            t("A jury had given it the lowest score", "评审团给了它最低分"),
          ],
          t(
            "The second paragraph says that after an argument they decided the object was not art and kept it out.",
            "第二段说他们争论之后认定这件东西不是艺术，并把它排除在外。",
          ),
        ),
        ask(
          t("According to Duchamp's defenders, what made Fountain a work of art?", "根据杜尚的辩护者，什么使《泉》成为一件艺术作品？"),
          t("The artist's act of choosing it and giving it a new meaning", "艺术家选择它并赋予它新的意义"),
          [
            t("The great skill with which the porcelain was shaped", "瓷器成型的高超技艺"),
            t("The high price Duchamp paid to the supplier", "杜尚付给供应商的高价"),
            t("The beauty of its curves and its white color", "它的曲线和白色之美"),
          ],
          t(
            "The third paragraph says the act of choosing, not the skill of making, was what made it art, creating a new thought for the object.",
            "第三段说是选择的行为而不是制作的技艺使它成为艺术，为这件物品创造了新的思想。",
          ),
        ),
        ask(
          t("What do critics of the readymades argue?", "现成品的批评者主张什么？"),
          t("If anything can be art, the word loses its meaning", "如果什么都能是艺术，这个词就失去了意义"),
          [
            t("Readymades are too difficult for most artists to make", "现成品对大多数艺术家来说太难制作"),
            t("Duchamp should have used his real name", "杜尚应该用他的真名"),
            t("Museums should show only the original Fountain", "博物馆应该只展出《泉》的原件"),
          ],
          t(
            "The fifth paragraph says critics argue that if anything can be art, the word means nothing, and that skill and beauty are not arbitrary standards.",
            "第五段说批评者认为，如果什么都能是艺术，这个词就毫无意义，而技艺和美并不是任意的标准。",
          ),
        ),
      ],
      [
        "Marcel",
        "Duchamp",
        "Duchamp's",
        "Fountain",
        "R.",
        "Mutt",
        "New",
        "York",
        "Alfred",
        "Stieglitz",
        "Society",
        "Independent",
        "Artists",
        "French",
      ],
    ),
    passage(
      "the-painting-that-shredded-itself",
      t("The Painting That Shredded Itself", "自毁的画"),
      `On an October evening in 2018, at an auction house in London, a framed painting of a girl reaching toward a red heart-shaped balloon was sold for just over one million pounds. The work was by Banksy, a street artist whose real name has never been officially confirmed and whose images, often painted on walls at night, mix humor with political protest. The auctioneer's hammer came down. A moment later, an alarm sounded inside the frame, and the canvas began to slide down through a hidden shredder. The audience gasped as strips of paper emerged from the bottom of the frame.

The shredder stopped about halfway, leaving the top of the picture whole and the lower half hanging in strips. Banksy soon posted a video showing that he had built the shredder into the frame years earlier, in case the painting was ever put up for auction. The message seemed clear: a protest against the art market, which turns works into expensive objects to be bought and sold.

What happened next complicated that message. The buyer decided to keep the work. Banksy's team gave the half-shredded piece a new title, Love Is in the Bin, and declared it a new artwork created at the moment of the auction. Three years later, it was sold again at the same auction house, this time for more than eighteen million pounds.

Critics have read the event in very different ways. To some, it was a brilliant piece of performance art that exposed the absurdity of the market in front of its own audience. To others, it was a clever publicity stunt that achieved the opposite of its ostensible purpose, making the work far more valuable and the artist even more famous. A few questioned how much the auction house knew in advance, which would make the protest less a surprise than a piece of shared theater.

The disagreement turns partly on intention and partly on effect. If the purpose was to destroy the work's value, it failed. If the purpose was to make people think about why a picture of a girl and a balloon is worth millions, it may have succeeded better than any wall could. A fair review of the event must weigh both: what the artist apparently meant, and what the act actually did.`,
      [art, review, academic11, academic2],
      [
        ask(
          t("What did the shredding seem at first to protest against?", "碎纸起初似乎是在抗议什么？"),
          t("The art market that turns works into expensive objects", "把作品变成昂贵物品的艺术市场"),
          [
            t("The auction house's refusal to show street art", "拍卖行拒绝展出街头艺术"),
            t("The buyer who paid too little for the painting", "出价太低的买家"),
            t("People who paint on walls at night", "夜里在墙上作画的人"),
          ],
          t(
            "The second paragraph says the message seemed to be a protest against the art market, which turns works into expensive objects.",
            "第二段说这一举动似乎是在抗议艺术市场，它把作品变成昂贵的物品。",
          ),
        ),
        ask(
          t(
            'Why does the writer say that what happened next "complicated that message"?',
            "作者为什么说接下来发生的事“使这个信息复杂化了”？",
          ),
          t("The shredded work was later sold for far more than before", "被碎的作品后来以远高于之前的价格售出"),
          [
            t("Banksy admitted he had never seen the painting", "班克斯承认他从没见过这幅画"),
            t("The shredder was found to be a fake", "碎纸机被发现是假的"),
            t("The auction house destroyed the rest of the canvas", "拍卖行毁掉了画布的其余部分"),
          ],
          t(
            "The third paragraph says the half-shredded work was renamed and sold three years later for more than eighteen million pounds.",
            "第三段说这件半碎的作品被重新命名，三年后以超过一千八百万英镑售出。",
          ),
        ),
        ask(
          t("What does the writer say a fair review of the event must do?", "作者说对这一事件的公正评论必须做什么？"),
          t("Weigh both what the artist seemed to mean and what the act did", "既要衡量艺术家似乎想表达的，也要衡量这一行为实际造成的"),
          [
            t("Decide only whether the auction house knew in advance", "只判断拍卖行是否事先知情"),
            t("Praise the artist for being famous and clever", "称赞艺术家既出名又聪明"),
            t("Ignore the price and talk only about the girl and the balloon", "忽略价格，只谈女孩和气球"),
          ],
          t(
            "The last paragraph says a fair review must weigh both what the artist apparently meant and what the act actually did.",
            "最后一段说公正的评论必须权衡两者：艺术家显然想表达什么，以及这一行为实际造成了什么。",
          ),
        ),
      ],
      ["Banksy", "Banksy's", "Girl", "Balloon", "Love", "Bin", "London", "Sotheby's"],
    ),
    passage(
      "the-nannys-hidden-photographs",
      t("The Nanny's Hidden Photographs", "保姆藏起来的照片"),
      `In 2007, a young man named John Maloof, who was researching a book about his Chicago neighborhood, bought a box of old photographic negatives at an auction for about four hundred dollars. When he began to look at them, he found pictures of the city's streets from the 1950s and 1960s: children playing, a woman in a fur coat glancing back, a man asleep on a bench, workers on their way home. Many were striking. He began buying more boxes from the same storage unit and eventually owned more than a hundred thousand negatives, many of them never developed.

The photographer's name was Vivian Maier. When Maloof searched for her, he found that she had worked for about forty years as a nanny, caring for other people's children in Chicago and New York. She had taken photographs almost every day, usually with a camera hung at her waist, which let her look down into it and photograph people without raising it to her eye. She had shown the pictures to almost no one. She died in 2009, just before her work became known.

Exhibitions and books followed, and Maier was praised as one of the finest street photographers of her century. Critics admired her eye for the unguarded moment, her sense of humor, and the understated way she framed people at the edges of society. Her self-portraits, often only her shadow or her reflection in a shop window, became especially famous.

Her story also raised hard questions. Maier chose almost none of the prints that are now exhibited. A photographer usually selects a small number of the best pictures from many, and that selection is part of the art. In Maier's case, others made the choices: which negatives to print, how to crop them, how dark or light to make them. Some critics asked whether the work on museum walls was truly hers or partly the creation of her finders. Others asked whether it was right to show pictures that a private woman had apparently chosen to keep to herself.

Her admirers reply that the quality of the pictures is evident in thousands of them, not just a few, and that great work deserves to be seen. The debate shows that judging a work of art can depend on more than the work: it can depend on who made the choices that shaped what we see.`,
      [art, taste, review, academic10],
      [
        ask(
          t("What made it possible for Maier to photograph people without them noticing?", "是什么让迈尔能在人们没注意时拍下他们？"),
          t("She held her camera at her waist and looked down into it", "她把相机挂在腰间，向下看取景"),
          [
            t("She hid her camera inside a box of negatives", "她把相机藏在一盒底片里"),
            t("She worked only at night when the streets were dark", "她只在街道昏暗的夜里工作"),
            t("She asked the children she cared for to take the pictures", "她让她照看的孩子们去拍照"),
          ],
          t(
            "The second paragraph says she usually hung her camera at her waist, which let her photograph people without raising it to her eye.",
            "第二段说她通常把相机挂在腰间，这让她无需举到眼前就能拍人。",
          ),
        ),
        ask(
          t("Why did some critics question whether the exhibited work was truly hers?", "为什么一些评论家质疑展出的作品是否真是她的？"),
          t("Others had chosen, cropped and printed most of the pictures", "大部分照片是由别人挑选、裁剪和冲印的"),
          [
            t("Maier had copied the pictures from other photographers", "迈尔抄袭了其他摄影师的照片"),
            t("The negatives had been damaged in the storage unit", "底片在储藏室里受损了"),
            t("Maloof had taken many of the photographs himself", "马卢夫自己拍了很多照片"),
          ],
          t(
            "The fourth paragraph says Maier chose almost none of the prints and that others decided which to print, how to crop them and how dark to make them.",
            "第四段说迈尔几乎没有挑选过任何一张照片，是别人决定冲印哪些、怎样裁剪、冲印深浅。",
          ),
        ),
        ask(
          t("What is the main point of the last paragraph?", "最后一段的要点是什么？"),
          t("Judging a work can depend on who made the choices that shaped it", "评判一件作品可能取决于是谁作出了塑造它的选择"),
          [
            t("Street photographs are more valuable than portraits", "街头照片比肖像照更有价值"),
            t("Private people should never take photographs", "普通人绝不应拍照"),
            t("Maier's work is weak when it is seen in large numbers", "迈尔的作品大量呈现时显得平庸"),
          ],
          t(
            "The last paragraph says judging a work of art can depend on more than the work, including who made the choices that shaped what we see.",
            "最后一段说评判艺术作品可能不只取决于作品本身，还取决于谁作出了塑造我们所见内容的选择。",
          ),
        ),
      ],
      ["Vivian", "Maier", "Maier's", "Chicago", "John", "Maloof", "New", "York"],
    ),
    passage(
      "the-painter-who-sued-a-critic",
      t("The Painter Who Sued a Critic", "起诉评论家的画家"),
      `In 1877, the American painter James McNeill Whistler showed a small painting in London called Nocturne in Black and Gold: The Falling Rocket. It showed fireworks over a park at night, but not in any detail. Most of the canvas was a dark, smoky blue-black, scattered with flecks and drops of gold paint that suggested sparks falling through the air. Whistler priced it at two hundred guineas, a large sum.

John Ruskin, the most powerful art critic in England, saw it and was outraged. He wrote that he had heard much of the impudence of artists before, but never expected to hear a coxcomb ask two hundred guineas for flinging a pot of paint in the public's face. Whistler sued him for libel, claiming that the review had damaged his reputation and his income.

The trial in 1878 became a public spectacle. Ruskin's lawyer asked Whistler how long it had taken him to paint the picture. About two days, Whistler said. Was he asking two hundred guineas for two days' work? No, Whistler answered: he asked it for the knowledge he had gained in the work of a lifetime. The courtroom applauded.

Underneath the jokes lay a serious disagreement about what painting was for. Ruskin believed that art should be truthful to nature and morally serious, and that its value was linked to the labor and skill visible in it. Whistler believed that a painting should be judged as an arrangement of colors and forms, as music is judged as an arrangement of sounds; that is why he gave his works musical titles. To him, the Nocturne was not a careless sketch of fireworks but a harmonious study of darkness and light.

The jury found that Ruskin had libeled Whistler but awarded him damages of one farthing, the smallest coin in the country, and made him pay his own large legal costs. Within a year, Whistler was bankrupt. Ruskin, embarrassed, resigned his university post.

Neither man won. But the case still raises a question for anyone who writes reviews. A critic has the right to dislike a work and to say so strongly. Ruskin's sentence, however, judged not the painting but the painter's honesty, and offered no reasons that a reader could check. Strong opinion is not the problem; insult without argument is.`,
      [art, review, academic11],
      [
        ask(
          t("What did Ruskin's review accuse Whistler of?", "罗斯金的评论指责惠斯勒什么？"),
          t("Asking a huge price for a careless, insulting work", "为一件草率、无礼的作品要价过高"),
          [
            t("Copying a painting by another artist", "抄袭另一位艺术家的画"),
            t("Painting fireworks that were not real", "画了并不真实的烟花"),
            t("Refusing to sell his painting to Ruskin", "拒绝把画卖给罗斯金"),
          ],
          t(
            "The second paragraph quotes Ruskin calling Whistler a coxcomb who asked two hundred guineas for flinging a pot of paint in the public's face.",
            "第二段引用罗斯金的话，称惠斯勒是个花花公子，竟为把一罐颜料泼到公众脸上而要价两百几尼。",
          ),
        ),
        ask(
          t("Why did Whistler give his paintings musical titles?", "惠斯勒为什么给他的画起音乐性的标题？"),
          t("He thought a painting should be judged as an arrangement of colors and forms", "他认为画应该作为色彩和形式的编排来评判"),
          [
            t("He was also a famous composer of night music", "他也是一位著名的夜曲作曲家"),
            t("He wanted to sell his paintings to musicians", "他想把画卖给音乐家"),
            t("The jury asked him to rename them", "陪审团要求他给它们改名"),
          ],
          t(
            "The fourth paragraph says Whistler believed a painting should be judged as an arrangement of colors and forms, as music is judged as an arrangement of sounds.",
            "第四段说惠斯勒认为画应该像音乐作为声音的编排那样，作为色彩和形式的编排来评判。",
          ),
        ),
        ask(
          t("What lesson about reviews does the writer draw from the case?", "作者从这个案件中得出了关于评论的什么教训？"),
          t("Strong opinion is acceptable, but insult without reasons is not", "强烈的观点可以接受，但没有理由的侮辱不行"),
          [
            t("Critics should never say that they dislike a work", "评论家绝不应说他们不喜欢一件作品"),
            t("Painters should always sue critics who attack them", "画家应该总是起诉攻击他们的评论家"),
            t("A review is fair if a jury agrees with it", "如果陪审团同意，评论就是公正的"),
          ],
          t(
            "The last paragraph says a critic may dislike a work strongly, but Ruskin judged the painter's honesty without reasons a reader could check.",
            "最后一段说评论家可以强烈地不喜欢一件作品，但罗斯金评判的是画家的诚实，且没有给出读者能核实的理由。",
          ),
        ),
      ],
      [
        "James",
        "McNeill",
        "Whistler",
        "Whistler's",
        "John",
        "Ruskin",
        "Ruskin's",
        "Nocturne",
        "Black",
        "Gold",
        "Falling",
        "Rocket",
        "London",
        "American",
        "English",
        "England",
      ],
    ),
    passage(
      "the-novel-that-failed",
      t("The Novel That Failed", "失败的小说"),
      `In 1851, Herman Melville published a long novel about a whaling ship and its captain, Ahab, who is determined to kill the great white whale that once took his leg. Melville had written successful adventure books before, and he hoped this one would be his masterwork. It was called Moby-Dick.

The reviews were mixed, and many were harsh. Some critics praised its power and its descriptions of the sea, but complained that it was disorganized. The story was interrupted again and again by chapters about the anatomy of whales, the history of whaling and the meaning of the color white. Its style moved from plain storytelling to speeches like those in a play and to long, strange passages of philosophy. One reviewer called it a mixture of romance and fact that was neither one nor the other.

There was an unlucky problem as well. The British edition, published first, accidentally left out the short final section that explains how the narrator, Ishmael, survived the sinking of the ship. Several British reviewers complained that the book was absurd, since a narrator who drowned could not have told the story. American critics then repeated some of their judgments.

The novel sold poorly. In Melville's lifetime, only a few thousand copies were sold, and he earned little from it. He went on writing, but his later books were even less popular, and he spent many years working as a customs inspector in New York. When he died in 1891, few remembered him.

Then, around the hundredth anniversary of his birth in 1919, critics began to rediscover Moby-Dick. A new generation of readers, living after a world war, found in its dark, restless, many-sided style a picture of their own uncertain age. The very features that had seemed like faults, the mixing of forms and the chapters that wandered away from the story, now seemed bold. By the middle of the century, the book was called one of the greatest novels in English.

Were the first critics simply wrong? Not entirely. They described the book accurately; it is disorganized by the standards of a tidy novel. What they could not see was that its disorder might be part of its meaning. Their mistake was not one of observation but of judgment, a judgment tied to the expectations of their own time.`,
      [art, review, academic10],
      [
        ask(
          t("Why did several British reviewers call the book absurd?", "为什么几位英国评论家说这本书荒唐？"),
          t("Their edition left out the part that explains how the narrator survived", "他们的版本漏掉了解释叙述者如何幸存的部分"),
          [
            t("They thought whales could not really sink a ship", "他们认为鲸鱼不可能真的弄沉一艘船"),
            t("They disliked stories that were set at sea", "他们不喜欢以海上为背景的故事"),
            t("The book had been printed with its pages out of order", "这本书印刷时页码顺序错乱了"),
          ],
          t(
            "The third paragraph says the British edition left out the final section explaining how Ishmael survived, so reviewers complained that a drowned narrator could not tell the story.",
            "第三段说英国版漏掉了解释以实玛利如何幸存的结尾部分，所以评论家抱怨淹死的叙述者不可能讲述这个故事。",
          ),
        ),
        ask(
          t("Why did readers after 1919 value the book more?", "为什么 1919 年以后的读者更看重这本书？"),
          t("Its restless, mixed style seemed to fit their own uncertain age", "它不安、混杂的风格似乎契合他们自己那个不确定的时代"),
          [
            t("A new edition removed all the chapters about whales", "新版删去了所有关于鲸鱼的章节"),
            t("Melville wrote a new ending that pleased them", "梅尔维尔写了一个让他们满意的新结局"),
            t("It became required reading for customs inspectors", "它成了海关检查员的必读书"),
          ],
          t(
            "The fifth paragraph says readers living after a world war found in its dark, restless style a picture of their own uncertain age.",
            "第五段说经历过世界大战的读者在它阴暗、不安的风格中看到了自己那个不确定时代的写照。",
          ),
        ),
        ask(
          t("According to the writer, what was the first critics' real mistake?", "根据作者，最初的评论家真正的错误是什么？"),
          t("They judged accurate observations by the expectations of their own time", "他们用自己时代的期待来评判准确的观察"),
          [
            t("They had not actually read the novel", "他们其实没有读过这部小说"),
            t("They described the book's style inaccurately", "他们对这本书风格的描述不准确"),
            t("They praised the book too highly at first", "他们起初对这本书赞扬过度"),
          ],
          t(
            "The last paragraph says they described the book accurately; their mistake was not of observation but of judgment, tied to the expectations of their time.",
            "最后一段说他们准确地描述了这本书；他们的错误不在观察，而在于受时代期待束缚的判断。",
          ),
        ),
      ],
      [
        "Herman",
        "Melville",
        "Melville's",
        "Moby-Dick",
        "Ishmael",
        "Ahab",
        "Raymond",
        "Weaver",
        "London",
        "British",
        "American",
        "Americans",
      ],
    ),
    passage(
      "the-stars-of-the-crowd",
      t("The Stars of the Crowd", "大众的星级"),
      `Before the Internet, most people who wanted an opinion about a book, a film or a restaurant read the work of professional critics. Today, they are just as likely to look at a row of stars: the average rating given by thousands of ordinary customers. Crowd reviews have changed how people choose what to buy, read and watch. They have also raised the question of how much such ratings can be trusted.

Crowd reviews have real strengths. A professional critic is one person with one set of tastes; thousands of reviewers represent many. A critic may judge a restaurant on a single visit, while customers report on hundreds. And customers often care about things critics ignore, such as whether a hotel's beds are comfortable or whether a toy breaks easily.

But ratings have weaknesses too, and studies have found several. First, the people who write reviews are not a random sample of customers. Those who are delighted or furious are more likely to write than those who are merely satisfied, so ratings tend to bunch at the top and the bottom. Second, early ratings influence later ones. In one large experiment on a website where users voted on comments, researchers added a single positive vote at random to some comments. Those comments went on to receive noticeably higher ratings than similar comments that had not received the extra vote. People, it seemed, followed the crowd. Third, some reviews are fake, written by businesses to praise themselves or to attack rivals.

There is also a deeper problem. A rating tells you how much people liked something; it does not tell you why. A film may receive low stars from viewers who expected a comedy and found a slow, serious drama, and high stars from those who wanted exactly that. A single number cannot show whether the judgment is germane to your own purpose.

For this reason, careful readers of crowd reviews tend to read the words, not just the stars. They look for reviews that describe specific features and explain their effects, for patterns that appear in many reviews, and for reviewers whose tastes seem like their own. In other words, they read crowd reviews the way a good reader reads any review: by asking what judgment is being made, what evidence supports it, and what standard it assumes.`,
      [taste, review, academic11, academic2, academic1],
      [
        ask(
          t("Why do ratings tend to bunch at the top and the bottom?", "为什么评分往往集中在最高和最低两端？"),
          t("Delighted or furious customers are more likely to write reviews", "非常满意或非常愤怒的顾客更有可能写评论"),
          [
            t("Websites allow only the highest and lowest ratings", "网站只允许最高分和最低分"),
            t("Professional critics write most of the reviews", "大部分评论是专业评论家写的"),
            t("Customers do not understand the middle ratings", "顾客不理解中间的分数"),
          ],
          t(
            "The third paragraph says those who are delighted or furious are more likely to write than those who are merely satisfied.",
            "第三段说非常满意或非常愤怒的人比只是满意的人更有可能写评论。",
          ),
        ),
        ask(
          t("What did the experiment with a single positive vote show?", "加一个好评的实验说明了什么？"),
          t("Early ratings can influence later ones", "早期的评分会影响后来的评分"),
          [
            t("Most comments on websites are fake", "网站上的大多数评论都是假的"),
            t("People never read the comments they vote on", "人们从不阅读他们投票的评论"),
            t("Positive votes are always given at random", "好评总是随机给出的"),
          ],
          t(
            "The third paragraph says comments given one random positive vote went on to receive higher ratings, so people followed the crowd.",
            "第三段说随机多得一个好评的评论后来获得了更高的评分，所以人们会随大流。",
          ),
        ),
        ask(
          t("What does the writer advise careful readers of crowd reviews to do?", "作者建议细心的大众评论读者怎么做？"),
          t("Read the words and ask what judgment, evidence and standard they show", "阅读文字，看它体现了什么判断、证据和标准"),
          [
            t("Trust only the average number of stars", "只相信平均星级"),
            t("Ignore every review written by ordinary customers", "忽略所有普通顾客写的评论"),
            t("Choose whatever has the most reviews", "选择评论最多的那个"),
          ],
          t(
            "The last paragraph says careful readers read the words and ask what judgment is made, what evidence supports it and what standard it assumes.",
            "最后一段说细心的读者会阅读文字，并问作出了什么判断、有什么证据支持、假定了什么标准。",
          ),
        ),
      ],
      ["Internet"],
    ),
  ],
};
