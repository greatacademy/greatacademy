// The reading unit of the B1 theme Relationships: brothers and sisters, saying sorry, friends, shyness, twins and chores.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { readingWords } from "./reading-words.ts";

const tags = "question-tags";
const indirect = "indirect-questions";

const passage = passageMaker(readingWords, [
  "b1-words-relationships",
  "b1-words-personality",
  "b1-words-getting-on",
  "b1-words-emotions",
  "b1-words-social-life",
  "b1-words-life-events",
  "b1-words-family-life",
  tags,
  indirect,
]);

/** readingRelationships is the reading unit of the theme Relationships. */
export const readingRelationships: ReadingUnitDef = {
  id: "b1-reading-relationships",
  title: t("Relationships", "人际关系"),
  passages: [
    passage({
      id: "b1-relationships-brothers-and-sisters",
      title: ["Brothers and Sisters", "兄弟姐妹"],
      body: `Most of us spend more time with our brothers and sisters than with anyone else, especially in childhood. Our parents usually die before us, and we meet our friends and partners later in life. Our siblings are often the only people who know us from the beginning to the end.

That does not mean the relationship is always easy. Young siblings quarrel a lot. Scientists who watched families at home found that children between three and seven argued with a brother or sister about once every ten minutes. They argued about toys, about who sat where in the car, and about who got more attention from their parents.

These arguments may seem like a problem, but they can actually be useful. With a sibling, children practice how to disagree, how to apologize and how to forgive, because they cannot just walk away. They learn that another person can be angry with them one minute and play with them the next.

The order of birth may affect personality too, although scientists disagree about how much. Many people believe that older children are more responsible, and that the youngest ones are more easygoing and outgoing. Some studies support this, while others find almost no difference.

As siblings grow up, their relationship often changes. Teenagers may spend less time together, and adults may live in different cities. But many people say that they got on better with their siblings later in life, when they had children of their own or when they had to look after their elderly parents together.

"When we were children, my sister and I couldn't stand each other," says Paula, who is forty-five. "Now she is the first person I call when something goes wrong."`,
      names: ["Paula"],
      questions: [
        [
          ["Why are siblings often special, according to the passage?", "根据文章，兄弟姐妹为什么往往很特别？"],
          ["They often know us from the beginning to the end of our lives", "他们常常从头到尾了解我们的一生"],
          [
            ["They always agree with us", "他们总是同意我们"],
            ["They choose the same jobs as we do", "他们和我们选择一样的工作"],
          ],
          [
            '"Our siblings are often the only people who know us from the beginning to the end." Parents die earlier and friends come later.',
            "父母通常比我们先离世，朋友是后来才认识的，只有兄弟姐妹可能伴随我们一生。",
          ],
        ],
        [
          ["Why can arguments between young siblings be useful?", "为什么年幼兄弟姐妹之间的争吵可能有益？"],
          ["Children practice how to disagree, apologize and forgive", "孩子们练习如何表达不同意见、道歉和原谅"],
          [
            ["Children learn to walk away from problems", "孩子们学会回避问题"],
            ["Parents give more attention to the winner", "父母会更关注赢的一方"],
          ],
          [
            '"With a sibling, children practice how to disagree, how to apologize and how to forgive, because they cannot just walk away."',
            "和兄弟姐妹无法一走了之，所以孩子们在争吵中学会表达分歧、道歉和原谅。",
          ],
        ],
        [
          ["When do many people become closer to their siblings?", "很多人什么时候和兄弟姐妹变得更亲近？"],
          ["Later in life, for example when they look after their parents", "人生后期，比如一起照顾父母时"],
          [
            ["As teenagers, when they spend more time together", "青少年时期，他们相处时间更多的时候"],
            ["Between three and seven years old", "三到七岁的时候"],
          ],
          [
            'Many people became closer "later in life, when they had children of their own or when they had to look after their elderly parents together". Teenagers often spend less time together.',
            "很多人在有了孩子或一起照顾年迈父母时与兄弟姐妹更亲近；青少年时期反而相处较少。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-relationships-how-to-say-sorry",
      title: ["How to Say Sorry", "怎样道歉"],
      body: `Everyone makes mistakes. We forget a birthday, say something rude when we are tired, or break a promise. When this happens, a good apology can save a friendship. A bad one can make things worse.

So what makes an apology work? Scientists who have studied the topic say that a real apology has a few parts.

First, say clearly what you did wrong. "I'm sorry if you were upset" is not a real apology, because it puts the problem on the other person. "I'm sorry that I laughed at your idea in front of everyone" is much better. It shows that you understand exactly what happened.

Second, admit that you were wrong. Don't blame other people or the situation. Many people add the word "but": "I'm sorry I was late, but the traffic was terrible." The "but" makes the apology weaker, because it sounds like an excuse.

Third, show that you understand how the other person feels. You might say: "That must have been hard for you, mustn't it?" This shows respect for their emotions.

Fourth, try to repair the damage if you can, and promise to do better. "Next time I'll check the calendar" or "Can I buy you a new one?"

Finally, give the other person time. You cannot make someone forgive you. Some people need a few hours or a few days before they are ready to accept an apology, especially if they feel hurt.

Saying sorry is not easy, because we have to admit that we were wrong. But people who apologize well are usually trusted more, not less. And a friendship that has survived an argument can become even stronger.`,
      grammar: [tags],
      glossed: ["apology", "excuse"],
      questions: [
        [
          ['Why is "I\'m sorry if you were upset" not a real apology?', "为什么“如果你不高兴，我很抱歉”不是真正的道歉？"],
          ["It puts the problem on the other person", "它把问题推给了对方"],
          [
            ["It is too long", "它太长了"],
            ['It uses the word "sorry" too many times', "它用了太多次“对不起”"],
          ],
          [
            'The passage says it "is not a real apology, because it puts the problem on the other person". A real one says clearly what you did.',
            "这种说法把问题归到对方的情绪上，而没有说清自己做错了什么。",
          ],
        ],
        [
          ['What is the problem with adding "but" to an apology?', "道歉时加上“但是”有什么问题？"],
          ["It sounds like an excuse and makes the apology weaker", "听起来像借口，让道歉变得无力"],
          [
            ["It makes the apology too polite", "它让道歉显得太客气"],
            ["It shows too much emotion", "它表露了太多情绪"],
          ],
          ["\"The 'but' makes the apology weaker, because it sounds like an excuse.\"", "“但是”后面往往是借口，会削弱道歉的诚意。"],
        ],
        [
          ["What does the passage say about time after an apology?", "关于道歉之后的时间，文章说了什么？"],
          ["Some people need hours or days before they accept it", "有些人需要几小时或几天才能接受"],
          [
            ["The other person must forgive you at once", "对方必须马上原谅你"],
            ["You should apologize again every hour", "你应该每小时再道歉一次"],
          ],
          [
            '"You cannot make someone forgive you. Some people need a few hours or a few days before they are ready to accept an apology."',
            "原谅不能强求，有些人需要时间才能接受道歉。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-relationships-friends-across-generations",
      title: ["Friends Across Generations", "跨越代际的友谊"],
      body: `Most of our friends are about the same age as we are. We meet them at school, at university or at work, and we share the same music, jokes and problems. But some of the most interesting friendships are between people of very different generations.

Ruby is twenty-three and works as a nurse. Her best friend, Arthur, is eighty-seven. They met three years ago through a program that connects young volunteers with elderly people who live alone. "At first I thought I was just helping him," Ruby says. "I did his shopping and helped him with his phone. But very soon I realized that he was helping me just as much."

Arthur was an engineer for forty years, and he has traveled to more than fifty countries. When Ruby was confused about her career, he listened to her for hours and asked good questions. When her relationship with her boyfriend ended, he told her about his own first love, which also ended badly, seventy years ago. "He made me laugh about it," Ruby says. "He has seen everything. Nothing surprises him."

For Arthur, the friendship has changed his life. After his wife died, he almost never left the house. "I didn't see anyone for days," he remembers. "Now Ruby comes every Thursday, and she has introduced me to her friends. I've even learned to send videos, haven't I?" he asks her, and she laughs.

Research suggests that friendships like this are good for both sides. Older people who have young friends feel less lonely and stay more active. Young people get advice, learn to be patient and see life in a new way.

"People ask me whether it is strange to have a best friend who is so old," Ruby says. "I tell them that age is just a number."`,
      grammar: [tags, indirect],
      names: ["Ruby", "Arthur"],
      questions: [
        [
          ["How did Ruby and Arthur meet?", "露比和亚瑟是怎样认识的？"],
          ["Through a program that connects young volunteers with elderly people", "通过一个把年轻志愿者和老人联系起来的项目"],
          [
            ["At the hospital where Ruby works", "在露比工作的医院"],
            ["Arthur was her teacher at university", "亚瑟是她的大学老师"],
          ],
          [
            '"They met three years ago through a program that connects young volunteers with elderly people who live alone."',
            "他们通过一个志愿者项目相识，这个项目让年轻人陪伴独居老人。",
          ],
        ],
        [
          ["How has Arthur helped Ruby?", "亚瑟是怎样帮助露比的？"],
          ["He listened to her and gave her advice about her career and love", "他倾听她的烦恼，在职业和感情上给她建议"],
          [
            ["He did her shopping every week", "他每周替她购物"],
            ["He found her a job as a nurse", "他帮她找到了护士的工作"],
          ],
          [
            "When she was confused about her career, he listened for hours, and when her relationship ended, he told her about his own first love.",
            "露比职业迷茫时亚瑟耐心倾听，她失恋时亚瑟讲自己的初恋逗她开心；替人购物的是露比。",
          ],
        ],
        [
          ["What does Ruby tell people who ask whether it is strange?", "有人问这是否奇怪时，露比怎样回答？"],
          ["That age is just a number", "年龄只是一个数字"],
          [
            ["That Arthur is like a grandfather to her", "亚瑟就像她的祖父"],
            ["That she has no friends of her own age", "她没有同龄朋友"],
          ],
          [
            '"People ask me whether it is strange to have a best friend who is so old. I tell them that age is just a number."',
            "注意间接问句的语序：whether it is strange，而不是 is it strange。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-relationships-the-class-reunion",
      title: ["The Class Reunion", "同学聚会"],
      body: `Twenty years after we left school, an email arrived: "Class reunion! Saturday, the fourteenth of June, at our old school." My first feeling was joy. My second was fear. Would anyone remember me? What would I say? I was a shy teenager who spent most breaks in the library.

I almost didn't go. My husband asked me why I was so nervous. "You aren't the same person now, are you?" he said. He was right. So I went.

The school looked smaller than I remembered. About forty people had come. At first I didn't know anyone. Then a tall woman with gray hair walked toward me and said my name. It was Emma, who sat next to me in math for three years. We hugged, and suddenly it felt as if no time had passed.

The evening was full of surprises. Daniel, the boy everyone in our class liked best, told me that he had always been jealous of my grades. Kate, who the teachers always shouted at, is now a principal. The quietest boy in the class has become a famous chef. Some people had married, some had divorced, and some had become grandparents already.

There were also sad moments. We stood quietly for a minute for two classmates who had died. And many people admitted that the years after school had been harder than they expected.

What surprised me most was how kind everyone was. In school we had put each other in groups: the clever ones, the ones who were good at sports, the shy ones. Now, as adults, those groups didn't matter. We were just people who shared a piece of the past.

At midnight Emma asked me whether I would come to the next reunion. "Definitely," I said. "I wouldn't miss it."`,
      grammar: [tags, indirect],
      names: ["June", "Emma", "Daniel", "Kate"],
      questions: [
        [
          ["How did the writer feel when the email arrived?", "收到邮件时作者感觉如何？"],
          ["Happy at first, then afraid", "先是高兴，然后害怕"],
          [
            ["Angry and annoyed", "生气又烦躁"],
            ["Bored and not interested", "无聊，不感兴趣"],
          ],
          [
            '"My first feeling was joy. My second was fear." She wondered whether anyone would remember her.',
            "她先是开心，随后又担心没人记得她。",
          ],
        ],
        [
          ["What did the husband say to the writer?", "丈夫对作者说了什么？"],
          ['"You aren\'t the same person now, are you?"', "“你现在已经不是当年那个人了，对吧？”"],
          [
            ['"You should stay at home, shouldn\'t you?"', "“你应该待在家里，对吧？”"],
            ['"You were very popular, weren\'t you?"', "“你当年很受欢迎，对吧？”"],
          ],
          [
            'He said: "You aren\'t the same person now, are you?" A negative sentence takes a positive question tag.',
            "这是反义疑问句：前半句是否定的 aren't，后面的附加问句用肯定的 are you。",
          ],
        ],
        [
          ["What surprised the writer most?", "最让作者惊讶的是什么？"],
          ["How kind everyone was", "大家都那么友善"],
          [
            ["How big the school hall was", "学校礼堂那么大"],
            ["That nobody had changed", "谁都没有变"],
          ],
          [
            '"What surprised me most was how kind everyone was." The old school groups no longer mattered.',
            "最让她意外的是大家都很友善，学生时代的小团体已经不重要了。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-relationships-shy-or-quiet",
      title: ["Shy or Quiet?", "害羞还是安静？"],
      body: `"Why don't you say anything?" "Come on, don't be so shy!" Many quiet people have heard these words all their lives. But is a quiet person always shy? Scientists say no. Shy and quiet are two different things.

Shyness is a kind of fear. Shy people often want to talk to others, but they feel anxious in social situations. They worry that people will judge them or that they will say something wrong. Before a party, a shy person may feel tense, and after it they may think about every word they said.

Introverts, on the other hand, are not always afraid. They just get their energy from time alone. A party can be fun for them, but after a few hours they feel tired and need some rest. Extroverts are different: they feel more alive when they are with other people. Most of us are in the middle.

So a person can be quiet but not shy. And a person can be outgoing and sociable but still feel shy inside.

Why does this matter? Because other people often do not understand quiet people. At school, teachers may criticize them for not speaking in class. At work, they may not get the opportunity to lead, even when they have good ideas. Many famous scientists, writers and leaders have been introverts, and they did their best work alone.

If you are shy and want to change, small changes can help: ask one question at a gathering, or prepare a few topics of conversation before a party. If you are just an introvert, there is nothing to fix. Just make sure that the people around you understand.

And if you have a quiet friend, don't push them. Ask them what they think, and then listen. You may be surprised by what you hear.`,
      glossed: ["shyness", "introverts", "introvert", "extroverts"],
      questions: [
        [
          ["What is shyness, according to the passage?", "根据文章，什么是害羞？"],
          ["A kind of fear in social situations", "在社交场合的一种恐惧"],
          [
            ["Getting energy from time alone", "从独处中获得能量"],
            ["Not wanting to talk to anyone", "不想和任何人说话"],
          ],
          [
            '"Shyness is a kind of fear. Shy people often want to talk to others, but they feel anxious in social situations."',
            "害羞是一种恐惧，害羞的人其实想与人交流，却在社交场合感到焦虑。",
          ],
        ],
        [
          ["How are introverts different from shy people?", "内向的人和害羞的人有什么不同？"],
          ["They are not afraid; they get their energy from time alone", "他们并不害怕，只是从独处中获得能量"],
          [
            ["They never enjoy parties", "他们从不喜欢聚会"],
            ["They feel more alive with other people", "和别人在一起时他们更有活力"],
          ],
          [
            '"Introverts are not always afraid. They just get their energy from time alone." Extroverts feel more alive with other people.',
            "内向者不一定害怕社交，只是需要独处来恢复精力；和人在一起更有活力的是外向者。",
          ],
        ],
        [
          ["What advice does the passage give about a quiet friend?", "关于安静的朋友，文章给出了什么建议？"],
          ["Ask them what they think and listen", "问问他们的想法，然后认真倾听"],
          [
            ["Tell them not to be shy", "告诉他们别害羞"],
            ["Push them to speak at every party", "逼他们在每次聚会上发言"],
          ],
          [
            '"Don\'t push them. Ask them what they think, and then listen." Note the indirect question: what they think, not what do they think.',
            "不要逼他们，问问他们怎么想然后倾听；注意间接问句语序 what they think。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-relationships-twins-who-grew-up-apart",
      title: ["Twins Who Grew Up Apart", "分开长大的双胞胎"],
      body: `In 2002, a young woman called Anaïs was watching a video online when she saw a girl who looked exactly like her. Same face, same smile, same way of moving her hands. The girl in the video lived in another country and spoke another language. Anaïs sent her a message: "This might sound strange, but were you adopted?"

She was. So was Anaïs. After some research and a test, the two women discovered that they were twins. They had been born in the same hospital in South Korea and adopted as babies by two different families, one in France and one in the United States. Neither family knew about the other twin.

When they finally met, at the age of twenty-five, they were surprised by how many things were the same. Neither of them liked cooked carrots. Both studied art. Both played with their hair when they were nervous. They even laughed in the same way.

Scientists find stories like this one very interesting, because they help to answer an old question: how much of our personality comes from our genes, and how much comes from our upbringing? Twins who grew up in different families share the same genes but not the same home, so they are a natural experiment.

The results of many studies like this suggest that both matter. Things like how tall we are, some health problems and even parts of our character, for example how outgoing or anxious we are, come in part from the genes we get from our parents. But our families, our friends, our culture and our experiences matter too. These twins often look the same and do things in the same way, but they are never the same person.

Anaïs and her sister now speak almost every day. "I always felt that something was missing," Anaïs says. "I didn't know what it was. Now I know."`,
      names: ["Anaïs", "South", "Korea", "France", "United", "States"],
      glossed: ["genes"],
      questions: [
        [
          ["How did Anaïs find her twin?", "阿纳伊斯是怎样找到她的双胞胎姐妹的？"],
          ["She saw a girl who looked exactly like her in a video", "她在视频里看到一个和她长得一模一样的女孩"],
          [
            ["Her parents told her about her sister", "她的父母告诉了她"],
            ["They met at the hospital where they were born", "她们在出生的医院相遇"],
          ],
          [
            'Anaïs "was watching a video online when she saw a girl who looked exactly like her".',
            "她在网上看视频时看到一个和自己长得一模一样的女孩，于是发了消息。",
          ],
        ],
        [
          ["Why do scientists find stories like this interesting?", "为什么科学家对这样的故事感兴趣？"],
          ["They help to show what comes from genes and what comes from upbringing", "它们有助于说明哪些来自基因、哪些来自成长环境"],
          [
            ["They prove that families do not matter", "它们证明家庭并不重要"],
            ["They show that all twins like art", "它们说明所有双胞胎都喜欢艺术"],
          ],
          [
            'Twins who grew up apart "share the same genes but not the same household, so they are a natural experiment".',
            "分开长大的双胞胎基因相同、家庭不同，是研究先天与后天的天然实验。",
          ],
        ],
        [
          ["What do the results of many studies suggest?", "许多研究的结果表明了什么？"],
          ["Both genes and experiences shape us", "基因和经历都会塑造我们"],
          [
            ["Only genes decide our personality", "只有基因决定我们的性格"],
            ["Only our families decide who we are", "只有家庭决定我们是什么样的人"],
          ],
          [
            '"The results of many studies like this suggest that both matter." These twins often look the same and do things in the same way, but they are never the same person.',
            "研究表明先天和后天都很重要，分开长大的双胞胎相似但并不相同。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-relationships-chores-and-pocket-money",
      title: ["Chores and Pocket Money", "家务与零花钱"],
      body: `Should children be paid for doing chores? Few questions start more arguments in a household. We asked two parents with very different views.

Mark, father of three: "In our house, every child gets an allowance, but only if they do their chores. Washing the dishes, feeding the dog, cleaning their rooms: each job has a price. I think this teaches them that money comes from work. My oldest daughter is fourteen, and she has saved enough money to buy her own bike. She is very proud of it. In real life, nobody gives you money for nothing, do they?"

Laura, mother of two: "I totally disagree. Chores are not a job. They are part of living in a family. Nobody pays me to cook dinner, do they? If you pay children for chores, they start asking, 'What will I get?' every time you ask for help. My children get a small allowance every week, and they can decide how to spend it. That teaches them about money. But they help at home because we are a family and everyone helps."

So who is right? Scientists who study children and money say that both ways can work, if parents keep to the same rules. Children need clear rules and should know what is expected of them. They also need the opportunity to choose for themselves what to do with money, and sometimes to make mistakes, like spending everything on candy and having nothing left for a gift.

Most specialists agree on one thing: children should do chores, paid or not. Children who help at home learn to be responsible and considerate. And they become adults who know how to wash their own clothes.`,
      grammar: [tags],
      names: ["Mark", "Laura"],
      questions: [
        [
          ["Why does Mark pay his children for chores?", "马克为什么为孩子做家务付钱？"],
          ["He thinks it teaches them that money comes from work", "他认为这能让孩子明白钱来自劳动"],
          [
            ["His children refused to help without money", "孩子们不给钱就不帮忙"],
            ["He wants them to buy their own food", "他想让孩子们自己买食物"],
          ],
          ['Mark says: "I think this teaches them that money comes from work."', "马克认为按劳付酬能教会孩子钱是靠劳动挣来的。"],
        ],
        [
          ['What does Laura mean by "Nobody pays me to cook dinner, do they?"', "劳拉说“没有人付钱让我做晚饭，对吧？”是什么意思？"],
          ["Chores are part of family life, not a job", "家务是家庭生活的一部分，而不是工作"],
          [
            ["She wants to be paid for cooking", "她希望做饭能拿到报酬"],
            ["Her children cook dinner every day", "她的孩子们每天做晚饭"],
          ],
          [
            'Laura believes chores "are part of living in a family". The question tag do they? asks the reader to agree.',
            "劳拉认为家务是家庭成员的分内事；句末的 do they? 是反义疑问句，期待对方同意。",
          ],
        ],
        [
          ["What do most experts agree on?", "大多数专家在哪一点上意见一致？"],
          ["Children should do chores, paid or not", "无论是否给钱，孩子都应该做家务"],
          [
            ["Children should never get an allowance", "孩子不应该有零花钱"],
            ["Parents should pay for every chore", "父母应该为每项家务付钱"],
          ],
          [
            '"Most specialists agree on one thing: children should do chores, paid or not."',
            "专家们一致认为，不管给不给钱，孩子都应该做家务。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-relationships-arguing-well",
      title: ["Arguing Well", "好好吵架"],
      body: `Every couple argues. Even the happiest marriages have quarrels about money, chores, families and a hundred small things. Scientists who have studied couples for many years say that the question is not whether you argue, but how.

In one famous study, scientists watched couples discuss a problem for fifteen minutes. Years later, they checked which couples were still together. The way people argued showed very well what would happen to their relationship.

The couples who stayed together were not the ones who never disagreed. They were the ones who argued with respect. They complained about a behavior, not about the person: "I'm annoyed that you forgot to call" instead of "You are so selfish." They listened, even when they were angry. They made jokes, and they knew when to take a break.

The couples who broke up often did the same things. They criticized the character of the other person, they rolled their eyes, and they refused to listen. Instead of solving the problem, each partner tried to win.

What can we learn from this? First, start in a calm way. An argument that begins with anger usually ends with anger. Second, talk about how you feel: "I feel frustrated when..." is easier to hear than "You always..." Third, try to understand the other side. You might ask: "Can you tell me why this is so important to you?" Finally, accept that some problems never go away totally. Many happy couples have the same arguments for many years, but they have learned to talk about them in a calm way, and even to laugh.

These ideas don't only work for couples. They help with friends, siblings and colleagues too. An argument doesn't have to damage a relationship. Handled well, it can make it stronger.`,
      grammar: [indirect],
      questions: [
        [
          ["Which couples stayed together in the study?", "研究中哪些夫妻最终没有分开？"],
          ["Those who argued with respect", "那些争吵时仍彼此尊重的夫妻"],
          [
            ["Those who never disagreed", "那些从不争吵的夫妻"],
            ["Those who always won their arguments", "那些总是吵赢的夫妻"],
          ],
          [
            '"The couples who stayed together were not the ones who never disagreed. They were the ones who argued with respect."',
            "能长久在一起的不是从不吵架的夫妻，而是吵架时依然彼此尊重的夫妻。",
          ],
        ],
        [
          ["Which sentence is an example of a good way to complain?", "下面哪句话是好的抱怨方式？"],
          ['"I\'m annoyed that you forgot to call."', "“你忘了打电话，我有点生气。”"],
          [
            ['"You are so selfish."', "“你太自私了。”"],
            ['"You always forget everything."', "“你总是什么都忘。”"],
          ],
          [
            'Good arguers "complained about a behavior, not about the person": "I\'m annoyed that you forgot to call" instead of "You are so selfish."',
            "好的抱怨针对具体行为，而不是攻击对方的人格。",
          ],
        ],
        [
          ["What question does the passage suggest asking?", "文章建议问哪个问题？"],
          ['"Can you tell me why this is so important to you?"', "“你能告诉我为什么这件事对你这么重要吗？”"],
          [
            ['"Why are you always so angry?"', "“你为什么总是这么生气？”"],
            ['"Can you tell me why is this so important?"', "“你能告诉我为什么这件事这么重要吗？”（语序错误）"],
          ],
          [
            'The passage suggests "Can you tell me why this is so important to you?" In an indirect question the order is that of a statement: why this is, not why is this.',
            "间接问句用陈述语序：why this is，而不是 why is this。",
          ],
        ],
      ],
    }),
  ],
};
