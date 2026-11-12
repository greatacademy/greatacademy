// Grade 6: the reading unit of the seventh theme, short memoirs of growing up, each told by a writer looking back
// on a moment that changed them.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const memoryWords = { topic: "words-of-memory", weight: 0.3 } as const;
const familyWords = { topic: "words-for-friends-and-family", weight: 0.3 } as const;
const courageWords = { topic: "words-for-fear-and-courage", weight: 0.3 } as const;
const memoir = { topic: "memoir-or-fiction", weight: 0.2 } as const;
const changing = { topic: "dynamic-and-static-characters", weight: 0.2 } as const;

/** growingUp is a reading unit of grade 6 of short memoirs about growing up. */
export const growingUp: ReadingUnitDef = {
  id: "growing-up",
  title: t("Growing Up", "成长"),
  passages: [
    passage(
      "the-summer-i-learned-to-swim",
      t("The Summer I Learned to Swim", "我学会游泳的那个夏天"),
      `I was eleven the summer I finally learned to swim, which was at least five years later than everyone else I knew. My little cousins splashed in the deep end like seals while I stood in the shallow water, gripping the edge of the pool. Every time someone asked if I wanted to come in deeper, I said I was fine where I was. I was not fine. I was terrified.

My fear had a reason, or at least a story. When I was six, I slipped off a dock at the lake and went under. My uncle pulled me out in seconds, but I still remember the green water closing over my head. After that, even putting my face in the bath made my heart race.

That summer my aunt, who taught swimming at the town pool, offered to give me lessons in the early mornings, before anyone else arrived. I was reluctant. I said yes only because she promised no one would watch.

For the first week, all I did was blow bubbles. Then I learned to float on my back while she held one hand under me. On the tenth morning, she quietly took her hand away, and I did not notice until she was standing a meter off, grinning. I was floating on my own.

By August I could swim the length of the pool. I was slow and clumsy, but I could do it. Looking back, I think the lesson was not really about swimming. It was about learning that fear is something you can walk into, one small step at a time, and come out the other side.`,
      [courageWords, memoir, changing],
      [
        ask(
          t(
            "Which detail shows that this is a memoir and not a story told by an invented character?",
            "哪个细节表明这是回忆录，而不是由虚构人物讲述的故事？",
          ),
          t("The writer looks back on what the summer meant for her own life", "作者回顾了那个夏天对自己人生的意义"),
          [
            t("The story has a pool and a lake", "故事里有游泳池和湖"),
            t("The cousins are compared to seals", "表弟表妹们被比作海豹"),
            t("The story takes place in summer", "故事发生在夏天"),
          ],
          t(
            "The last paragraph begins Looking back and explains what the experience taught the writer, the way a memoirist reflects on a real event.",
            "最后一段以 Looking back 开头，解释了这段经历教给作者的东西，这正是回忆录作者回顾真实事件的方式。",
          ),
        ),
        ask(
          t("Why was the writer afraid of the water?", "作者为什么怕水？"),
          t("She had slipped off a dock and gone under when she was six", "她六岁时从码头滑落，沉到了水下"),
          [
            t("Her cousins had splashed her in the pool", "表弟表妹们在泳池里向她泼水"),
            t("Her aunt had told her the pool was dangerous", "她姨妈告诉她游泳池很危险"),
            t("She had never seen a pool before", "她以前从没见过游泳池"),
          ],
          t(
            "The second paragraph tells how she slipped off a dock at the lake and went under when she was six.",
            "第二段讲述了她六岁时从湖边码头滑落、沉入水中的经历。",
          ),
        ),
        ask(
          t("How does the writer change by the end of the summer?", "到夏天结束时，作者有了什么变化？"),
          t("She goes from clinging to the edge in fear to swimming the length of the pool", "她从害怕地抓着池边变成能游完泳池全长"),
          [
            t("She becomes the fastest swimmer in the family", "她成了家里游得最快的人"),
            t("She decides never to go near water again", "她决定再也不靠近水"),
            t("She becomes a swimming teacher like her aunt", "她像姨妈一样成了游泳教练"),
          ],
          t(
            "At the start she grips the edge of the pool, terrified; by August she can swim the length of it, slowly but on her own.",
            "一开始她害怕地抓着池边；到了八月，她已经能独自游完泳池全长，虽然游得很慢。",
          ),
        ),
      ],
    ),
    passage(
      "my-grandmothers-kitchen",
      t("My Grandmother's Kitchen", "我外婆的厨房"),
      `When I think of my grandmother, I do not picture her face first. I picture her kitchen. It was small and always too warm, with a window that steamed up in winter and a radio that played old songs no one else listened to. It smelled of ginger, garlic and something sweet baking in the oven. Even now, the smell of ginger can make me feel nine years old again.

Every Sunday my family drove across the city to her apartment, and every Sunday she put me to work. My job was folding dumplings. She would set a bowl of filling in front of me, a stack of round wrappers and a small dish of water. Then she showed me, again, how to wet the edge, fold the wrapper in half and pinch it into pleats.

My first dumplings were a disaster. They leaked, they fell open in the pot, and some looked more like crumpled paper than food. My grandmother never once laughed at them. She cooked them anyway and put the ugliest one on her own plate. "These taste the best," she said, "because you made them."

She did not talk much about her childhood, which had been hard. But while our hands were busy, she would sometimes tell me a story, about a village I had never seen or a brother who had walked for days to bring home rice.

My grandmother died when I was fourteen. Her kitchen is gone now, and someone else lives in the apartment. But every Lunar New Year, I fold dumplings with my little brother, and I put the ugliest one on my own plate.`,
      [memoryWords, familyWords, memoir],
      [
        ask(
          t("What does the smell of ginger do for the writer now?", "现在姜的气味对作者有什么作用？"),
          t("It brings back the feeling of being nine in her grandmother's kitchen", "它让作者重新感受到九岁时在外婆厨房里的感觉"),
          [
            t("It makes her want to become a cook", "它让她想成为厨师"),
            t("It reminds her of the city traffic", "它让她想起城市的交通"),
            t("It makes her dislike dumplings", "它让她讨厌饺子"),
          ],
          t(
            "The first paragraph ends by saying the smell of ginger can make the writer feel nine years old again.",
            "第一段最后说，姜的气味能让作者重新觉得自己九岁。",
          ),
        ),
        ask(
          t(
            "What does the grandmother's choice to eat the ugliest dumpling show about her?",
            "外婆选择吃最难看的饺子，这说明了她的什么特点？",
          ),
          t("She is kind and makes the child feel proud of trying", "她很慈爱，让孩子为自己的尝试感到自豪"),
          [
            t("She does not like dumplings that look nice", "她不喜欢好看的饺子"),
            t("She is too tired to cook new ones", "她太累了，不想再做新的"),
            t("She wants to teach the child a hard lesson", "她想给孩子一个严厉的教训"),
          ],
          t(
            "She never laughs at the failed dumplings and says the ugliest tastes best because the child made it, which shows her kindness through what she does.",
            "她从不嘲笑失败的饺子，还说最难看的最好吃，因为是孩子做的，这通过她的行为表现了她的慈爱。",
          ),
        ),
        ask(
          t("Why does the writer put the ugliest dumpling on her own plate at the end?", "结尾作者为什么把最难看的饺子放在自己的盘子里？"),
          t("To carry on her grandmother's way of caring for a child", "为了延续外婆关爱孩子的方式"),
          [
            t("Because she still cannot fold dumplings well", "因为她仍然包不好饺子"),
            t("Because her brother refuses to eat it", "因为她弟弟不肯吃"),
            t("Because it is a rule of Lunar New Year", "因为这是春节的规矩"),
          ],
          t(
            "The ending echoes the grandmother's gesture: now the writer is the older one folding dumplings with a child, and she does what her grandmother did.",
            "结尾呼应了外婆的举动：现在作者成了和孩子一起包饺子的长辈，她做了外婆曾经做的事。",
          ),
        ),
      ],
      ["Lunar"],
    ),
    passage(
      "the-new-kid",
      t("The New Kid", "新来的孩子"),
      `On my first day at Riverside Middle School, I made a plan to be invisible. I had moved three times in four years because of my dad's job, and I had learned that being new was easier if nobody noticed you. I would sit at the back, keep my head down and eat lunch in the library. By the time anyone learned my name, I would probably be moving again.

The plan lasted until second period. Our science teacher, Ms. Okafor, put us in pairs for a lab, and my partner was a tall boy named Marcus who talked more than anyone I had ever met. He told me about his dog, his three sisters, his opinion of the cafeteria pizza and his theory that our teacher was secretly a spy. He did not seem to notice that I barely answered.

At lunch I headed for the library, as planned. Marcus caught up with me in the hallway. "You're sitting with us," he said, as if it had already been decided. I was too surprised to argue.

His friends were loud and a little strange, and at first I felt like an outsider at their table. But nobody asked me where I was from or how long I would stay. They just argued about video games and assumed I would have an opinion. By the end of the week, I did.

We stayed in that town for four years, the longest I had ever lived anywhere. Marcus and I are still friends. I often think about how close I came to spending all that time in the library, hiding from the very thing I wanted most.`,
      [familyWords, changing, memoir],
      [
        ask(
          t("Why did the writer plan to be invisible?", "作者为什么打算不引人注意？"),
          t("He had moved often and thought being new was easier if nobody noticed him", "他经常搬家，认为不被人注意时当新生会容易些"),
          [
            t("He did not like science class", "他不喜欢科学课"),
            t("He wanted to spend more time reading", "他想花更多时间读书"),
            t("Marcus had been unkind to him", "马库斯对他不友善"),
          ],
          t(
            "The first paragraph says he had moved three times in four years and had learned that being new was easier if nobody noticed you.",
            "第一段说，他四年里搬了三次家，体会到当新生时不被注意会容易些。",
          ),
        ),
        ask(
          t("How does the writer change in the passage?", "作者在文中有什么变化？"),
          t("He goes from hiding from others to belonging to a group of friends", "他从躲避他人变成融入一群朋友"),
          [
            t("He goes from friendly to unfriendly", "他从友好变得不友好"),
            t("He becomes a spy like his teacher", "他像老师一样成了间谍"),
            t("He does not change at all", "他根本没有变化"),
          ],
          t(
            "At first he plans to eat alone in the library; by the end of the week he has opinions to share at the lunch table, and he stays friends with Marcus for years.",
            "一开始他打算在图书馆独自吃午饭；到周末他已经能在午餐桌上发表意见，并且和马库斯做了多年朋友。",
          ),
        ),
        ask(
          t("What does the last sentence suggest about the writer?", "最后一句暗示了作者的什么？"),
          t("He had wanted friends all along, even while he was hiding", "即使在躲藏时，他其实一直都想要朋友"),
          [
            t("He wishes he had read more books", "他后悔没有多读书"),
            t("He still prefers to be alone", "他仍然更喜欢独处"),
            t("He is angry that his family moved", "他对家人搬家感到生气"),
          ],
          t(
            "He says he was hiding from the very thing he wanted most, which reveals that what he really wanted was friends.",
            "他说自己当时躲避的正是他最想要的东西，这表明他真正想要的是朋友。",
          ),
        ),
      ],
      ["Riverside", "Okafor", "Marcus"],
    ),
    passage(
      "moving-day",
      t("Moving Day", "搬家那天"),
      `The day we left the house on Linden Street, I refused to help pack. My parents and my sister filled box after box while I sat on the bare floor of my bedroom and stared at the wall. On it, in pencil, were the lines my mother had drawn each birthday to show how tall I had grown. The last one, at age twelve, was almost level with the light switch.

We were moving across the country, to a city where my mother had found a better job. Everyone kept telling me it was an adventure. To me it felt like a punishment. I was leaving the only home I remembered, my best friend Jada, who lived two doors down, and the tree in the backyard that I had climbed a thousand times.

In the afternoon, when the truck was almost full, my mother came and sat beside me. She did not tell me it would be fine. Instead she said that she had cried for a week when she left her own hometown at my age. Then she handed me a sheet of tracing paper and a pencil.

Together we traced every line on the wall, each with its date and my age. She folded the paper carefully and gave it to me. "Now you can take it with you," she said.

That paper is pinned to the wall of my room in our new apartment. I have added three more lines to it. I still miss Linden Street, and Jada and I still call each other every week. But I have learned that a home is not only a place. It is partly something you carry.`,
      [memoryWords, familyWords, memoir],
      [
        ask(
          t("Why did the writer refuse to help pack?", "作者为什么拒绝帮忙打包？"),
          t("He did not want to leave the only home he remembered", "他不想离开他记得的唯一的家"),
          [
            t("He was too tired after school", "他放学后太累了"),
            t("He thought the boxes were too heavy", "他觉得箱子太重"),
            t("He wanted to stay with his sister", "他想和姐姐待在一起"),
          ],
          t(
            "The second paragraph says the move felt like a punishment because he was leaving the only home he remembered, his best friend and the tree in the backyard.",
            "第二段说，搬家感觉像是一种惩罚，因为他要离开他记得的唯一的家、他最好的朋友和后院的那棵树。",
          ),
        ),
        ask(
          t("How does the mother help her son?", "母亲是怎样帮助儿子的？"),
          t("She shares her own sadness and helps him take the height marks with him", "她分享了自己当年的伤心，并帮他把身高刻度带走"),
          [
            t("She tells him the move will be fine", "她告诉他搬家没什么"),
            t("She promises they will move back soon", "她承诺他们很快就会搬回来"),
            t("She paints over the marks on the wall", "她把墙上的刻度涂掉了"),
          ],
          t(
            "The third and fourth paragraphs tell how she says she cried when she left her own hometown, then traces the lines with him so he can take them.",
            "第三、四段讲述了她说自己离开家乡时也哭过，然后和他一起把刻度描下来，让他带走。",
          ),
        ),
        ask(
          t(
            "What does the writer mean when he says a home is partly something you carry?",
            "作者说家在某种程度上是你随身携带的东西，这是什么意思？",
          ),
          t("The memories of a home can come with you to a new place", "家的回忆可以伴你到新的地方"),
          [
            t("Families should carry their furniture by hand", "家人应该亲手搬家具"),
            t("He wants to live in a moving truck", "他想住在搬家卡车里"),
            t("He did not really care about the old house", "他其实并不在乎那座老房子"),
          ],
          t(
            "The traced height marks, now pinned in his new room, are a piece of the old home he carried with him, which is what the closing line looks back on.",
            "描下来的身高刻度如今钉在他新房间的墙上，是他从旧家带来的一部分，结尾那句话回顾的正是这一点。",
          ),
        ),
      ],
      ["Linden", "Jada"],
    ),
    passage(
      "the-fight-with-my-brother",
      t("The Fight with My Brother", "和哥哥吵架"),
      `My brother Theo and I have always had a rivalry. He is two years older, and for most of my life he has been better at everything: faster, taller, louder and, as he never failed to remind me, smarter. Usually I let it go. But the winter I was twelve, we had a fight so bad that we did not speak for nearly a month.

It started over a model airplane. Theo had spent weeks building it from a kit, gluing each tiny piece and painting the wings silver. I knew I was not supposed to touch it. One afternoon, while he was out, I picked it up to look at it more closely, and one wing snapped off in my hand.

I panicked. Instead of telling him, I glued the wing back on as well as I could and put the plane back on his shelf. When Theo found it that evening, the glue was still wet. He shouted that I had ruined it, and I shouted back that it was only a stupid toy. Then he said something I will not repeat, and I slammed my door.

For weeks we passed each other in the hallway like strangers. I told myself I did not care. But the silence in the house was heavy, and I hated it.

In the end, Theo was the one who broke it. He knocked on my door with the plane in his hands and asked if I wanted to help him fix it properly. We spent the whole Saturday on it. Neither of us apologized in words. But I think that was the day I understood that a quarrel does not have to end a friendship, even with a brother.`,
      [familyWords, memoir, changing],
      [
        ask(
          t("What did the writer do wrong at the start of the fight?", "在吵架开始时，作者做错了什么？"),
          t("She broke the plane and hid it instead of telling her brother", "她弄坏了飞机，却把它藏起来而没有告诉哥哥"),
          [
            t("She threw the plane out of the window", "她把飞机扔出了窗外"),
            t("She painted the wings the wrong color", "她把机翼涂错了颜色"),
            t("She told their parents about the plane", "她把飞机的事告诉了父母"),
          ],
          t(
            "The third paragraph says that instead of telling him, she glued the wing back on and put the plane back on his shelf.",
            "第三段说，她没有告诉哥哥，而是把机翼粘回去，再把飞机放回他的架子上。",
          ),
        ),
        ask(
          t("What does the phrase like strangers tell you about the siblings?", "like strangers 这个短语告诉你这对兄妹怎样？"),
          t("They acted as if they did not know each other", "他们表现得好像互不相识"),
          [
            t("They had just met for the first time", "他们刚刚第一次见面"),
            t("They spent all their time together", "他们一直待在一起"),
            t("They were living in different houses", "他们住在不同的房子里"),
          ],
          t(
            "Passing each other in the hallway like strangers means they ignored each other and did not speak, as people who do not know each other would.",
            "像陌生人一样在走廊里擦肩而过，意思是他们互相不理睬、不说话，就像互不认识的人一样。",
          ),
        ),
        ask(
          t("How did the fight finally end?", "这场争吵最后是怎样结束的？"),
          t("Theo asked his sister to help him fix the plane", "西奥请妹妹帮他修飞机"),
          [
            t("The writer wrote Theo a long letter of apology", "作者给西奥写了一封长长的道歉信"),
            t("Their parents made them shake hands", "父母让他们握手言和"),
            t("Theo bought a new plane", "西奥买了一架新飞机"),
          ],
          t(
            "The last paragraph says Theo knocked on her door with the plane and asked if she wanted to help fix it properly, though neither apologized in words.",
            "最后一段说，西奥拿着飞机敲她的门，问她愿不愿意帮忙把它好好修好，尽管两人都没有口头道歉。",
          ),
        ),
      ],
      ["Theo"],
    ),
    passage(
      "the-bike-in-the-shop-window",
      t("The Bike in the Shop Window", "橱窗里的自行车"),
      `The bike was red, with silver handlebars and a bell shaped like a small dome. It stood in the window of Hassan's Cycles on Market Street, and I passed it every day on my way to school. It cost two hundred and forty dollars, more money than I had ever held in my life.

When I asked my father if I could have it, he did not say no. He said, "How will you pay for it?" At first I thought this was a joke. Then I understood that it was not.

So I made a plan. I walked our neighbors' dogs, raked leaves and washed cars on Saturdays. I saved my birthday money instead of spending it. I kept a chart on the refrigerator, and every time I earned something, I colored in another square. Some weeks I earned nothing, and the chart did not move. Twice I nearly gave up.

It took me eleven months. By then it was autumn again, and I worried that the bike would be gone. But when I walked into the shop with my envelope of crumpled bills, it was still in the window. Mr. Hassan counted the money slowly, then smiled and gave me a helmet for free. He said he had seen me looking through the glass all year.

I rode that bike until it was much too small for me. I have owned better bikes since then, but none that mattered as much. My father's question taught me something I did not want to learn at the time: the things you work for are the ones you value most.`,
      [memoryWords, memoir, changing],
      [
        ask(
          t("Why did the father answer with a question?", "父亲为什么用一个问题来回答？"),
          t("He wanted his son to find a way to earn the bike himself", "他想让儿子自己想办法挣钱买自行车"),
          [
            t("He did not hear what his son asked", "他没听清儿子问什么"),
            t("He was making a joke about the price", "他在拿价格开玩笑"),
            t("He planned to buy the bike as a surprise", "他打算买自行车作为惊喜"),
          ],
          t(
            "The son first thinks it is a joke, then understands it is not: the question pushes him to make a plan and earn the money.",
            "儿子起初以为这是玩笑，后来明白并不是：这个问题促使他制订计划、自己挣钱。",
          ),
        ),
        ask(
          t("Which detail shows that saving the money was hard?", "哪个细节表明攒钱很不容易？"),
          t("Some weeks the chart did not move, and twice he nearly gave up", "有些星期图表毫无进展，他两次差点放弃"),
          [
            t("The bike had silver handlebars", "自行车有银色的车把"),
            t("Mr. Hassan gave him a helmet", "哈桑先生送了他一个头盔"),
            t("He passed the shop on the way to school", "他上学路上会经过那家店"),
          ],
          t(
            "The third paragraph says some weeks he earned nothing and the chart did not move, and that twice he nearly gave up.",
            "第三段说，有些星期他什么也没挣到，图表没有变化，他还两次差点放弃。",
          ),
        ),
        ask(
          t("What lesson does the writer draw when he looks back?", "作者回顾往事时得出了什么道理？"),
          t("The things you work for are the ones you value most", "你努力争取来的东西，才是你最珍惜的"),
          [
            t("You should always buy the cheapest bike", "你总应该买最便宜的自行车"),
            t("Shop owners give away free helmets", "店主会免费送头盔"),
            t("Red bikes are better than other bikes", "红色自行车比其他自行车好"),
          ],
          t(
            "The last sentence states the lesson his father's question taught him: the things you work for are the ones you value most.",
            "最后一句点明了父亲的问题教给他的道理：你努力争取来的东西，才是你最珍惜的。",
          ),
        ),
      ],
      ["Hassan's", "Hassan"],
    ),
    passage(
      "the-recital",
      t("The Recital", "独奏会"),
      `I had practiced the piece for four months. I could play it in my sleep, and some nights I think I did. It was a short sonata, not very difficult for a real pianist, but for me it was the hardest thing I had ever learned. On the evening of the spring recital, I was the seventh of twelve students to play.

As I waited in the front row, my hands grew cold and damp. I watched the student before me, a girl of about eight, play a simple tune perfectly, and my stomach tightened. I told myself I was ready. My hands did not believe me.

When my name was called, I walked to the piano and sat down. I looked at the keys, and for a terrible moment, I could not remember how the piece began. The hall was silent. I could hear someone's chair creak. Then my fingers found the first notes, and I started to play.

For the first page, everything went well. Then, in the middle, my left hand slipped and I played a loud wrong chord. I froze. Every instinct told me to stop and run off the stage. But I remembered what my teacher always said: "Never go back. Keep the music moving." So I kept going, and I played the rest of the piece without another mistake.

Afterward, I was sure I had embarrassed myself. But my teacher hugged me and said it was the bravest performance of the night. I did not understand her then. Now I think she meant that courage is not playing without mistakes. It is going on after you make one.`,
      [courageWords, memoir, changing],
      [
        ask(
          t("Which detail shows the writer's fear before she played?", "哪个细节表现了作者演奏前的恐惧？"),
          t("Her hands grew cold and damp and her stomach tightened", "她的手变得冰冷潮湿，胃也绷紧了"),
          [
            t("She had practiced for four months", "她练习了四个月"),
            t("The student before her was about eight", "她前面那个学生大约八岁"),
            t("Her teacher hugged her afterward", "老师后来拥抱了她"),
          ],
          t(
            "The second paragraph shows her fear through her body: cold, damp hands and a tightening stomach.",
            "第二段通过她身体的反应表现了恐惧：冰冷潮湿的手和发紧的胃。",
          ),
        ),
        ask(
          t("What did the writer do after she played the wrong chord?", "作者弹错和弦之后做了什么？"),
          t("She remembered her teacher's advice and kept playing", "她想起老师的建议，继续弹了下去"),
          [
            t("She stopped and started the piece again", "她停下来，从头再弹"),
            t("She ran off the stage", "她跑下了舞台"),
            t("She asked the audience to forgive her", "她请观众原谅她"),
          ],
          t(
            "The fourth paragraph says she remembered Never go back. Keep the music moving, and played the rest without another mistake.",
            "第四段说，她想起了“永远不要回头，让音乐继续”，然后把剩下的部分弹完，再没出错。",
          ),
        ),
        ask(
          t("Why did the teacher call it the bravest performance?", "老师为什么称它为最勇敢的演奏？"),
          t("The writer kept going after making a mistake", "作者在出错后坚持了下去"),
          [
            t("The writer played the most difficult piece", "作者弹的曲子最难"),
            t("The writer made no mistakes at all", "作者一点错都没出"),
            t("The writer was the youngest performer", "作者是年龄最小的演奏者"),
          ],
          t(
            "Looking back, the writer explains that courage is not playing without mistakes but going on after you make one.",
            "回顾往事时，作者解释说，勇气不是不犯错，而是犯错后继续前进。",
          ),
        ),
      ],
    ),
    passage(
      "letters-from-home",
      t("Letters from Home", "家书"),
      `The summer I turned thirteen, I spent six weeks at a camp in the mountains, the longest I had ever been away from home. There was no internet and only one telephone, in the camp office, for emergencies. So my mother did something old-fashioned. She wrote me a letter every single day.

At first I found this a little embarrassing. Other campers got a postcard or two; I got a thick envelope every afternoon when the mail came. My cabinmates teased me about it. But I noticed that some of them, the ones who got nothing, watched me open my letters with a look I did not understand at the time.

The letters were not exciting. My mother wrote about the weather, about what she had cooked, about our cat sleeping on my bed because she missed me. Sometimes she copied out a poem or drew a small sketch of the garden. But reading them each night with a flashlight, I felt less far away. On the hard days, when I was homesick or had argued with a friend, the letters were the thing I looked forward to most.

I wrote back, though not as often as she did. My letters were short and full of spelling mistakes, and I am sure they told her very little.

Years later, after my mother had passed away, I found a shoebox in her closet. Inside, tied with ribbon, were all eleven of my letters from that summer. She had kept every one. Now the box sits on my own shelf, a keepsake of a summer and of a love I did not fully see until much later.`,
      [memoryWords, familyWords, memoir],
      [
        ask(
          t("How did the writer feel about the daily letters at first?", "作者起初对每天的来信有什么感受？"),
          t("A little embarrassed, because the other campers teased her", "有点难为情，因为其他营员取笑她"),
          [
            t("Bored, because she never read them", "无聊，因为她从来不读"),
            t("Angry, because the letters came late", "生气，因为信来得太晚"),
            t("Proud, because she got the most mail", "自豪，因为她收到的信最多"),
          ],
          t(
            "The second paragraph says she found the letters a little embarrassing and her cabinmates teased her about them.",
            "第二段说，她觉得这些信有点让人难为情，同屋的营员还拿这事取笑她。",
          ),
        ),
        ask(
          t("Why might the campers who got no letters have watched her with that look?", "那些没收到信的营员为什么可能用那种眼神看她？"),
          t("They wished someone at home would write to them too", "他们希望家里也有人给他们写信"),
          [
            t("They wanted to read her mother's poems for a test", "他们想读她母亲的诗来应付考试"),
            t("They were angry that she broke a camp rule", "他们生气她违反了营地规定"),
            t("They thought the letters were from a stranger", "他们以为信是陌生人寄来的"),
          ],
          t(
            "The writer says she did not understand the look at the time; the campers who got nothing were likely feeling left out and longing for word from home.",
            "作者说她当时不理解那种眼神；没收到信的营员很可能感到被冷落，渴望家里的消息。",
          ),
        ),
        ask(
          t("What does the writer understand when she finds the shoebox?", "作者发现鞋盒时明白了什么？"),
          t("How much her letters had meant to her mother", "她的信对母亲意味着多少"),
          [
            t("That her mother had never read her letters", "母亲从没读过她的信"),
            t("That she should have stayed longer at camp", "她应该在营地多待些时候"),
            t("That shoeboxes are good for storing ribbon", "鞋盒适合存放丝带"),
          ],
          t(
            "Her mother had kept all eleven short letters, tied with ribbon, which shows a love the writer did not fully see until much later.",
            "母亲把那十一封简短的信全都用丝带捆好保存着，这显示了作者很久以后才完全明白的爱。",
          ),
        ),
      ],
    ),
  ],
};
