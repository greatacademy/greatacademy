// The reading unit of the B2 theme Culture, Identity and Globalization: growing up between two cultures, whether the
// world is becoming the same, a language that was nearly lost, superstitions, who owns a recipe, tourists who love a
// place to death, stereotypes and humor, and diplomacy over dinner.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { readingWords } from "./reading-words.ts";

const passage = passageMaker(readingWords, [
  "b2-words-identity",
  "b2-words-globalization",
  "b2-words-language",
  "b2-words-traditions",
  "b2-words-heritage",
  "b2-words-belief",
  "b2-words-stereotypes",
  "b2-words-tourism",
  "b2-words-food-2",
  "b2-words-personality-3",
  "b2-words-diplomacy",
  "cleft-sentences",
]);

/** readingCulture is the reading unit of the theme Culture, Identity and Globalization. */
export const readingCulture: ReadingUnitDef = {
  id: "b2-reading-culture",
  title: t("Culture, Identity and Globalization", "文化、身份与全球化"),
  passages: [
    passage({
      id: "b2-culture-growing-up-between-two-cultures",
      title: ["Growing Up Between Two Cultures", "在两种文化之间长大"],
      body: `Mei was four when her parents moved from a small city in the south of China to Manchester, in the north of England. Her father had found work as a chef, and her mother opened a shop that sold vegetables and spices to the growing Chinese community. At home, the family spoke Cantonese, ate rice with every meal and celebrated the Moon Festival every year. At school, Mei spoke English, ate sandwiches and learned about bonfires in November.

For years, she moved between these two worlds without thinking about it. It was only as a teenager that she began to feel the pressure of choosing. Her school friends could not understand why she had to be home early, or why her parents expected her to study medicine. Her parents, in turn, worried that she was becoming too English: she preferred her friends to family dinners, and her Cantonese was getting worse. "At school I was the Chinese girl," she says. "When we visited my grandparents in China, I was the English one. I didn't really belong in either place."

This feeling is common in the children of immigrants, and scientists have studied it for decades. Some young people respond by rejecting the culture of their parents and trying to assimilate completely. Others hold on hard to their heritage and keep their distance from the majority. Many, however, eventually find a third way: a mixed identity in which both cultures have a place. Studies suggest that this third group often does best, both at school and in terms of wellbeing.

For Mei, the turning point came at university, where she met other students with similar stories, from Nigeria, Poland and Pakistan. What surprised her was how much they had in common. Talking with them, she realized that being between two cultures was not a lack of identity but an identity of its own.

Now over thirty, she works as an interpreter and is bringing up her own daughter in two languages. She takes her to the Moon Festival and to bonfire night. "What I want her to know," she says, "is that she doesn't have to choose. She can be both, and that's a gift."`,
      grammar: ["cleft-sentences"],
      names: ["Mei", "China", "Manchester", "England", "Chinese", "Cantonese", "English", "Nigeria", "Poland", "Pakistan"],
      glossed: ["bonfires", "bonfire"],
      questions: [
        [
          ["When did Mei begin to feel the pressure of choosing between two cultures?", "梅从什么时候开始感到在两种文化之间选择的压力？"],
          ["As a teenager", "在十几岁的时候"],
          [
            ["When she first started school", "她刚上学的时候"],
            ["When she became a mother", "她当了母亲以后"],
          ],
          [
            '"It was only as a teenager that she began to feel the pressure of choosing." Before that, she moved between the two worlds without thinking about it.',
            "直到十几岁她才开始感到选择的压力，在那之前她在两个世界之间来去自如。",
          ],
        ],
        [
          ["Which group of young people often does best, according to studies?", "研究表明，哪一类年轻人往往过得最好？"],
          ["Those who develop a mixed identity", "形成混合身份的人"],
          [
            ["Those who assimilate completely", "完全同化的人"],
            ["Those who keep apart from the majority", "与主流群体保持距离的人"],
          ],
          [
            'Many find "a third way: a mixed identity in which both cultures have a place", and this group often does best.',
            "许多人找到了第三条路：让两种文化都有一席之地的混合身份，这类人往往过得最好。",
          ],
        ],
        [
          ["What does Mei want her daughter to understand?", "梅希望女儿明白什么？"],
          ["She does not have to choose one culture", "她不必只选择一种文化"],
          [
            ["She should speak only Cantonese at home", "她在家只应该说粤语"],
            ["English culture is more important for her", "英国文化对她更重要"],
          ],
          [
            "\"What I want her to know is that she doesn't have to choose. She can be both, and that's a gift.\"",
            '"我希望她明白，她不必选择，她可以两者兼有，这是一种优势。"',
          ],
        ],
      ],
    }),
    passage({
      id: "b2-culture-is-the-world-becoming-the-same",
      title: ["Is the World Becoming the Same?", "世界正在变得千篇一律吗？"],
      body: `Walk through the center of almost any large city today, and you will see the same things: the same coffee shops, the same clothes stores, the same phones in the hands of the same kind of young people listening to the same songs. To many people who study culture, this is the clearest sign of globalization, and a worrying one. The world, they fear, is becoming homogeneous, as a few dominant cultures, above all that of the United States, replace thousands of local traditions.

There is some truth in this view. Global brands can be found in nearly every country, and a small number of companies produce most of the movies and music that people consume. Young people in Lagos, Seoul and São Paulo often know the same celebrities. Languages are disappearing at a worrying rate, and with each one, a way of seeing the world is lost.

However, the picture is less simple than it first seems. To begin with, culture does not only travel in one direction. Japanese food, Korean television and music from Nigeria have become popular worldwide. Yoga, which comes from India, is practiced in almost every city on Earth.

Moreover, people do not just accept what arrives from outside; they change it. A global company that sells fast food offers rice dishes in Indonesia and vegetarian dishes in India, because local customers expect it. Hip-hop, which began in New York, has been adopted by young people from Senegal to China, who sing in their own languages about their own lives. Scientists have a word for this mixing of the global and the local: "glocalization".

Finally, globalization can even make local identity stronger. When people feel that their culture is under threat, they often value it more. Interest in traditional crafts, local food and minority languages has grown in many countries in recent years, in part in response to the spread of global culture.

It may be more accurate, then, to say that the world is becoming more connected, not more similar. What is disappearing is not cultural difference itself, but the isolation in which many cultures once developed. Whether that is a loss or a benefit depends, in the end, on how communities choose to use the new connections.`,
      grammar: ["cleft-sentences"],
      names: [
        "United",
        "States",
        "Lagos",
        "Seoul",
        "São",
        "Paulo",
        "Japanese",
        "Korean",
        "Nigeria",
        "Yoga",
        "India",
        "Indonesia",
        "Hip-hop",
        "New",
        "York",
        "Senegal",
        "China",
      ],
      glossed: ["glocalization"],
      questions: [
        [
          ["What do many observers fear about globalization?", "许多观察者对全球化有什么担忧？"],
          ["A few dominant cultures will replace local traditions", "少数强势文化会取代地方传统"],
          [
            ["Cities will stop building coffee shops", "城市将不再开咖啡店"],
            ["Young people will stop listening to music", "年轻人将不再听音乐"],
          ],
          [
            'They fear that the world is becoming homogeneous, "as a few dominant cultures... replace thousands of local traditions."',
            "他们担心世界正变得同质化，少数强势文化会取代成千上万的地方传统。",
          ],
        ],
        [
          ["Why does a global fast-food company sell rice dishes in Indonesia?", "为什么一家全球快餐公司在印度尼西亚卖米饭？"],
          ["Local customers expect it", "当地顾客期望如此"],
          [
            ["Burgers are not allowed there", "那里不允许卖汉堡"],
            ["Rice is cheaper than bread", "米饭比面包便宜"],
          ],
          [
            'People change what arrives from outside: the company offers rice dishes in Indonesia "because local customers expect it."',
            "人们会改造外来的事物：这家连锁店在印度尼西亚卖米饭，因为当地顾客期望如此。",
          ],
        ],
        [
          ["What does the writer conclude?", "作者得出了什么结论？"],
          ["The world is becoming more connected, not more similar", "世界正变得更加相连，而不是更加相同"],
          [
            ["Local cultures will soon disappear", "地方文化很快就会消失"],
            ["Globalization has had no effect on culture", "全球化对文化没有任何影响"],
          ],
          [
            '"It may be more accurate, then, to say that the world is becoming more connected, not more similar."',
            "更准确的说法或许是：世界正变得更加相连，而不是更加相同。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-culture-the-language-that-was-nearly-lost",
      title: ["The Language That Was Nearly Lost", "险些消失的语言"],
      body: `In the middle of the twentieth century, the Māori language of New Zealand seemed to be dying. For decades, children had been hit at school for speaking it, and many parents, hoping to give their children a better future, spoke only English at home. Fifty years ago, less than one in five Māori people could speak their ancestral language with fluency, and most of those were old. Experts predicted that it would disappear within a generation.

It did not. What saved it was not a law or a government plan, at least at first, but the work of ordinary people. In 1982, a group of Māori families opened the first kōhanga reo, or "language nest": a preschool where young children spent the whole day with old people who spoke only Māori. The idea spread very fast. Within a few years, there were hundreds of language nests across the country, followed by schools for older children that taught every subject in Māori.

Activists also worked hard to have the language made official. In 1987, Māori became an official language of New Zealand, together with English. A Māori television channel and radio stations followed. Gradually, Māori words became part of the English of every day as well, and today it is normal for a news reporter to greet viewers in Māori, or for a minister to open a talk with a Māori proverb.

The revival is far from complete. Fluent speakers are still a minority, and many young people who learned the language at school use it little at home. Experts point out that a language survives only if parents speak it to their children, and that is still not common.

Nevertheless, the story of Māori has inspired communities around the world, from Wales to Hawaii, where languages were in a similar situation. Its lesson is that a language is not only a way to communicate. It carries the history of a people, its jokes, its songs and its way of seeing the land. "When we lost our language," one old man said, "we lost part of ourselves. When our grandchildren speak it, we get that part back."`,
      grammar: ["cleft-sentences"],
      names: ["Māori", "New", "Zealand", "English", "Wales", "Hawaii"],
      glossed: ["kōhanga", "reo", "preschool", "revival"],
      questions: [
        [
          ["Why did many Māori parents speak only English to their children?", "为什么许多毛利父母只对孩子说英语？"],
          ["They hoped it would give their children a better future", "他们希望这能给孩子更好的未来"],
          [
            ["The government paid them to do so", "政府付钱让他们这样做"],
            ["They had forgotten the Māori language", "他们已经忘了毛利语"],
          ],
          [
            '"Many parents, hoping to give their children a better future, spoke only English at home."',
            "许多父母希望给孩子更好的未来，所以在家只说英语。",
          ],
        ],
        [
          ['What was a "language nest"?', '"语言巢"是什么？'],
          [
            "A preschool where children spent the day with old people who spoke only Māori",
            "一种学前机构，孩子整天和只说毛利语的长者在一起",
          ],
          [
            ["A television channel for children in Māori", "一个面向儿童的毛利语电视频道"],
            ["A law that made Māori an official language", "一项使毛利语成为官方语言的法律"],
          ],
          [
            'It was "a preschool where young children spent the whole day with old people who spoke only Māori."',
            "它是一种学前机构，小孩子整天和只说毛利语的长者待在一起。",
          ],
        ],
        [
          ["Why is the revival of Māori still far from complete?", "为什么毛利语的复兴还远未完成？"],
          ["Few parents speak it to their children at home", "很少有父母在家对孩子说毛利语"],
          [
            ["It is no longer taught in any school", "已经没有学校教这门语言了"],
            ["The government has banned it on television", "政府禁止在电视上使用它"],
          ],
          [
            'A language survives only if parents speak it to their children, "and that is still not common."',
            "一种语言只有在父母对孩子说它时才能延续，而这种情况仍属少数。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-culture-why-superstitions-survive",
      title: ["Why Superstitions Survive", "迷信为何经久不衰"],
      body: `Many hotels have no thirteenth floor. In China and Japan, many towers skip the number four, which sounds like the word for death. Some football players always put on their left boot before their right, and tennis players hit the ball on the ground the same number of times before every serve. Even people who say they are not superstitious will often touch wood after saying something they hope for.

Why do such habits survive in an age of science? One answer is that superstitions grow out of a very useful ability: the brain is designed to find order in the world. Our ancestors survived by noticing that one thing usually followed another, such as dark clouds and rain. However, the same ability also makes us see connections that are not there. If a player wins after wearing a certain pair of socks, it is hard not to wear them again.

A second answer is that superstitions give a feeling of control. Scientists have found that people are most superstitious in situations that are both important and uncertain: before exams, during illness, at sea or in sport. When we cannot control the result, a small ritual makes us feel that we are doing something. In some experiments, people who were given a "lucky" ball even performed slightly better at a sport, probably because they felt more confident.

Third, superstitions are passed on as part of culture. Children learn them from parents and grandparents, often as part of folklore and celebrations. Breaking a glass, opening an umbrella inside the house or seeing a black cat may mean bad luck in one country and nothing at all in another. In this way, superstitions are a little like a shared language: following them is a way of belonging to a group.

Are superstitions harmful? Usually not. Most are small and cost nothing, and if a ritual helps us relax before an exam, it may even help. Problems happen only when superstition replaces careful thinking, for example when people choose a strange cure instead of treatment by a doctor, or when someone is blamed for bad luck because of an old taboo.

For most of us, the healthiest attitude may be the one many people already have: we do not really believe that touching wood works, but we do it anyway, just to be safe.`,
      grammar: ["cleft-sentences"],
      names: ["China", "Japan"],
      questions: [
        [
          ["Why do many towers in China and Japan skip the number four?", "为什么中国和日本的许多高楼会跳过数字四？"],
          ["It sounds like the word for death", '它听起来像"死"字'],
          [
            ["It is the number of an old king", "它是一位古代国王的数字"],
            ["Towers with four floors are against the law", "四层的楼是违法的"],
          ],
          ['Many towers "skip the number four, which sounds like the word for death."', '建筑常常跳过数字四，因为它听起来像"死"字。'],
        ],
        [
          ["When are people most superstitious, according to psychologists?", "心理学家发现，人们在什么情况下最迷信？"],
          ["When a situation is both important and uncertain", "当情况既重要又不确定时"],
          [
            ["When they are with their grandparents", "当他们和祖父母在一起时"],
            ["When they are relaxed and on holiday", "当他们放松度假时"],
          ],
          [
            'People are most superstitious "in situations that are both important and uncertain: before exams, during illness, at sea or in sport."',
            "人们在既重要又不确定的情况下最迷信，比如考试前、生病时、出海或比赛时。",
          ],
        ],
        [
          ["When does superstition become a problem?", "迷信什么时候会成为问题？"],
          ["When it replaces careful thinking, or treatment by a doctor", "当它取代审慎的思考或医生的治疗时"],
          [
            ["Whenever people touch wood", "每当人们摸木头时"],
            ["When a ritual helps people relax", "当某种仪式帮人放松时"],
          ],
          [
            '"Problems happen only when superstition replaces careful thinking, for example when people choose a strange cure instead of treatment by a doctor."',
            "只有当迷信取代审慎思考时才会出问题，比如人们选择魔法疗法而不去就医。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-culture-who-owns-a-recipe",
      title: ["Who Owns a Recipe?", "食谱归谁所有？"],
      body: `A few years ago, a famous chef in a large Western city opened a restaurant that served dishes from a small region of Mexico. The reviews were very good, the prices were high, and the tables were full. Then a food writer from that region wrote an angry article. The chef, she wrote, had spent two weeks in the region, learned the recipes from local women, and was now earning a fortune from them. The women, meanwhile, still sold the same dishes at a market for a few coins, and nobody had ever heard of them.

The debate that followed raised a difficult question: who, if anyone, owns a recipe? In law, the answer is quite clear. A list of ingredients cannot usually be protected, so anyone may cook a dish they have tasted in another place. Food has always traveled in this way. Tomatoes came to Italy from the Americas; noodles may have come to the West from China. Almost every national cuisine is the result of centuries of borrowing.

However, many people argue that the problem is not borrowing itself but the way it is done. They distinguish between appreciation and appropriation. Appreciation means learning about a culinary tradition with respect, giving credit to the people it comes from and, where possible, sharing the benefits. Appropriation means taking it without acknowledgment, changing it for profit and sometimes describing it as your own invention. When the people who take are richer and stronger than those they take from, the second can feel like history repeating itself.

Others find this argument narrow-minded. Cooking, they say, is about creativity and exchange, and a rule that only people from a culture may cook its food would be impossible to enforce and harmful to everyone. Many immigrant cooks, after all, have adapted their dishes to local tastes.

Some chefs have found a middle way. They name the cooks who taught them, invite them to work in their kitchens, or send part of their income to the communities whose dishes they serve. After the article, the chef in our story did something similar: he traveled back to the region and brought two of the women to cook with him for a month, and their names are now on the menu.`,
      grammar: ["cleft-sentences"],
      names: ["Western", "Mexico", "Italy", "Americas", "China"],
      glossed: ["appreciation", "appropriation", "acknowledgment"],
      questions: [
        [
          ["Why was the food writer angry with the chef?", "为什么那位美食作家对厨师感到愤怒？"],
          ["He earned a fortune from recipes while the women who taught him did not", "他靠这些食谱发了财，而教他的妇女却没有"],
          [
            ["His dishes were not like the real ones", "他做的菜与正宗的不一样"],
            ["He refused to let her into the restaurant", "他拒绝让她进餐厅"],
          ],
          [
            'The chef was "earning a fortune" from the recipes, while the women "still sold the same dishes at a market for a few coins."',
            "厨师靠这些食谱赚了大钱，而那些妇女仍在市场上以几枚硬币的价格卖同样的菜。",
          ],
        ],
        [
          ["What does the law usually say about recipes?", "法律对食谱通常是怎么规定的？"],
          ["A list of ingredients cannot usually be protected", "配料清单通常无法受到保护"],
          [
            ["Only people from a culture may cook its food", "只有本文化的人才能做本文化的菜"],
            ["A chef must pay to use a recipe", "厨师使用食谱必须付费"],
          ],
          [
            '"A list of ingredients cannot usually be protected, so anyone may cook a dish they have tasted in another place."',
            "配料清单通常不受保护，所以任何人都可以做他在别处尝过的菜。",
          ],
        ],
        [
          ["What did the chef do after the article?", "文章发表后厨师做了什么？"],
          ["He brought two of the women to cook with him", "他请了其中两位妇女来和他一起做菜"],
          [
            ["He closed his restaurant", "他关掉了自己的餐厅"],
            ["He stopped serving dishes from Mexico", "他不再供应墨西哥菜"],
          ],
          [
            '"He traveled back to the region and brought two of the women to cook with him for a month, and their names are now on the menu."',
            "他回到那个地区，请了两位妇女来和他一起做一个月的菜，菜单上现在也写着她们的名字。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-culture-tourists-who-love-a-place-to-death",
      title: ["Tourists Who Love a Place to Death", "爱之深、害之切的游客"],
      body: `Venice has about fifty thousand residents in its historic center. Every year, it receives more than twenty million visitors. On a busy summer day, the small streets are so crowded that residents cannot walk to work, and huge cruise ships once passed the ancient palaces several times a day. Many families have left, because they could not pay the rents, which have risen as apartments are turned into holiday homes. Venice is often given as the clearest example of overtourism: a place so popular that tourism begins to damage the very things that bring visitors there.

It is not the only one. In Barcelona, residents have protested against tourists with signs saying "Tourists go home". In Amsterdam, the city has banned new souvenir shops in the center. On Everest, long lines of people wait near the top, and the mountain is full of waste. Some beaches in Thailand have been closed for months to allow the coral and the sea life to recover.

The problem is in part a result of success. Cheap flights, rising incomes in many countries and social media have made travel possible for hundreds of millions of people who could never afford it before. A single photo on social media can turn a quiet village into a destination for thousands of visitors within a few months.

Tourism also brings real benefits. It creates jobs, supports local crafts and pays for the preservation of monuments. For many poorer regions, it is the main source of income. The challenge, therefore, is not to stop tourism but to manage it.

Cities and countries are trying several approaches. Venice now charges day visitors a fee on the busiest days and has banned large cruise ships from the center. Other places control the number of visitors each day or require them to book early. Some promote less famous attractions to spread visitors across more places. Those who believe in ecotourism encourage tourists to stay longer, spend money with local businesses and respect local etiquette.

Tourists, too, can make a difference. Visiting outside the busiest season, staying in local guesthouses and learning a few words of the language are small things that help. As one resident of Venice put it: "We are happy to have guests. We just want them to remember that people live here. It is a home, not a park for having fun."`,
      grammar: ["cleft-sentences"],
      names: ["Venice", "Barcelona", "Amsterdam", "Everest", "Thailand"],
      glossed: ["guesthouses"],
      questions: [
        [
          ["Why have many families left Venice?", "为什么许多家庭离开了威尼斯？"],
          ["They can no longer pay the rising rents", "他们付不起上涨的房租"],
          [
            ["The cruise ships made too much noise", "游轮噪音太大"],
            ["There are no jobs in tourism", "旅游业没有工作机会"],
          ],
          [
            'Families have left "because they could not pay the rents, which have risen as apartments are turned into holiday homes."',
            "许多家庭因付不起房租而离开，因为公寓被改成了度假屋，房租随之上涨。",
          ],
        ],
        [
          ["Why, according to the writer, is the challenge not to stop tourism?", "作者为什么说挑战不在于阻止旅游业？"],
          ["Tourism brings real benefits, such as jobs and income", "旅游业带来实实在在的好处，比如工作和收入"],
          [
            ["Tourists refuse to stay at home", "游客拒绝待在家里"],
            ["Stopping tourism is against the law", "阻止旅游业是违法的"],
          ],
          [
            'Tourism "creates jobs, supports local crafts and pays for the preservation of monuments." So the challenge is to manage it.',
            "旅游业提供就业、支持本地手工艺并为古迹保护出资，因此挑战在于管理它。",
          ],
        ],
        [
          ["What has Venice done about overtourism?", "威尼斯采取了什么措施应对过度旅游？"],
          ["It charges day visitors a fee and has banned large cruise ships", "向一日游游客收费，并禁止大型游轮进入"],
          [
            ["It has closed the city to all visitors", "对所有游客关闭了城市"],
            ["It has banned new souvenir shops", "禁止开设新的纪念品店"],
          ],
          [
            '"Venice now charges day visitors a fee on the busiest days and has banned large cruise ships from the center." Amsterdam banned new souvenir shops.',
            "威尼斯在最繁忙的日子向一日游游客收费，并禁止大型游轮进入市中心；禁开纪念品店的是阿姆斯特丹。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-culture-stereotypes-and-humor",
      title: ["Stereotypes and Humor", "刻板印象与幽默"],
      body: `An Englishman, a Frenchman and a German walk into a restaurant. You probably already know how the joke will go: the Englishman will be polite, the Frenchman will complain about the food, and the German will arrive exactly on time. Jokes like this are told in almost every country, about neighbors, regions and nations, and they depend completely on stereotypes.

A stereotype is a simple, fixed idea about a whole group of people. Some stereotypes have a little truth in them: in some cultures, people really do arrive at a meeting earlier than in others. But stereotypes turn an average into a rule and forget the enormous differences within every group. Not every German is punctual, and not every Englishman is polite.

Why, then, are such jokes so popular? Part of the answer is that jokes often depend on surprise and exaggeration, and stereotypes give a quick picture that everyone recognizes. A person telling a joke does not have time to explain a character; a stereotype does the work in a single word. Jokes about our own group can also be a way of laughing at ourselves, and of showing that we belong.

However, humorous stories built on stereotypes can also do real harm. When the group being laughed at is a minority, or one that has suffered prejudice, a joke can make ignorance stronger and make discrimination seem normal. What is harmless fun in one context can be very cruel in another. A great deal depends on who is telling the joke, to whom, and why.

Some of the best comic actors, however, use stereotypes in order to challenge them. An actor from an immigrant family may play with the misconceptions that people have about her community, inviting the audience to laugh and then showing them how wrong those ideas are. Here, the joke is not on the group but on the stereotype itself, and on the narrow-minded people who believe it.

So should we stop telling such jokes? Not always. But a useful question to ask before telling one is this: would I tell it in front of the people it is about? If the answer is no, it is probably not as funny as it seems.`,
      grammar: ["cleft-sentences"],
      names: ["Englishman", "Frenchman", "German"],

      questions: [
        [
          ["What is the main problem with stereotypes, according to the passage?", "根据文章，刻板印象的主要问题是什么？"],
          ["They turn an average into a rule and forget differences", "它们把平均情况当成规律，忽视个体差异"],
          [
            ["They are never based on any truth at all", "它们完全没有任何事实依据"],
            ["They are only used in jokes about nations", "它们只用于关于国家的笑话"],
          ],
          [
            '"Stereotypes turn an average into a rule and forget the enormous differences within every group." Some have a little truth in them.',
            "刻板印象把平均情况变成规律，忽视每个群体内部的巨大差异；有些确实带有一点真实成分。",
          ],
        ],
        [
          ["When can a joke based on a stereotype do real harm?", "基于刻板印象的笑话什么时候会造成真正的伤害？"],
          ["When it is about a minority that has suffered prejudice", "当它针对一个遭受过偏见的少数群体时"],
          [
            ["When it is told about one's own group", "当它是关于自己群体的笑话时"],
            ["When the audience laughs too loudly", "当观众笑得太大声时"],
          ],
          [
            '"When the group being laughed at is a minority, or one that has suffered prejudice, a joke can make ignorance stronger."',
            "当被嘲笑的群体是少数群体或曾遭受偏见时，笑话会加深无知。",
          ],
        ],
        [
          ["How do some of the best comic actors use stereotypes?", "一些最优秀的喜剧演员是怎样使用刻板印象的？"],
          ["To show how wrong those ideas are", "用来展示这些观念有多错误"],
          [
            ["To make fun of minorities", "用来取笑少数群体"],
            ["To avoid explaining their characters", "用来避免解释人物"],
          ],
          [
            'They "use stereotypes in order to challenge them": the joke is on the stereotype itself, not on the group.',
            "他们利用刻板印象来挑战刻板印象：笑点在刻板印象本身，而不在那个群体。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-culture-diplomacy-over-dinner",
      title: ["Diplomacy over Dinner", "餐桌上的外交"],
      body: `In 1972, when the American president Richard Nixon visited China, the two countries had not spoken to each other for more than twenty years. The talks were difficult, and much of the most important work was done not at the negotiating table but at dinner. At a great banquet in Beijing, Nixon used chopsticks, raised his glass of strong Chinese alcohol to his hosts and, by many accounts, drank more than his experts would have liked. The pictures were shown around the world, and they told a story that no official words could: the two countries were ready to talk.

Diplomats have always known that food matters. Sharing a meal is one of the oldest signs of trust in almost every culture, and a dinner allows leaders to talk more easily than they can in an official meeting. Many difficult agreements have been made over dessert.

Every part of an official dinner is therefore planned with care. Hosts choose dishes that show off their national cuisine while respecting the guests' religious and cultural rules. A diplomat must know that some guests do not eat meat from pigs, that alcohol is not allowed for others, and that in some countries it is polite to leave a little food on the plate, while in others it suggests that the meal was not good. A mistake in etiquette can leave everyone embarrassed, and now and then cause a diplomatic argument.

The food itself can also carry a message. When the leaders of two countries that had once been at war met, the menu mixed dishes from both sides, a sign of peace. At other times, a host has served a dish from a disputed region, which guests understood as a planned message about territory.

Some countries have made food an official part of their foreign policy. Thailand, for example, has supported thousands of Thai restaurants abroad, hoping to raise the profile of its culture, and South Korea has promoted its cuisine worldwide. Experts call this "gastrodiplomacy".

Of course, a good dinner cannot solve every conflict. But as one ambassador remarked, it is hard to shout at someone who has just passed you the bread.`,
      grammar: ["cleft-sentences"],
      names: ["American", "Richard", "Nixon", "China", "Beijing", "Chinese", "Thailand", "Thai", "Korea"],
      glossed: ["banquet", "gastrodiplomacy"],
      questions: [
        [
          ["What did the pictures of the dinner in Beijing tell the world?", "北京宴会的画面向世界传达了什么？"],
          ["That the two countries were ready to talk", "两国已经准备好对话"],
          [
            ["That Nixon disliked Chinese food", "尼克松不喜欢中国菜"],
            ["That the talks had completely failed", "会谈彻底失败了"],
          ],
          [
            'The pictures "told a story that no official words could: the two countries were ready to talk."',
            "这些画面讲述了官方声明无法讲述的故事：两国已经准备好对话。",
          ],
        ],
        [
          ["Why must a diplomat know the rules about food of other cultures?", "为什么外交官必须了解其他文化的饮食规矩？"],
          ["A mistake in etiquette can cause embarrassment or an argument", "礼仪上的失误可能造成尴尬甚至外交争执"],
          [
            ["Guests always bring their own food", "客人总是自带食物"],
            ["The law of every country requires it", "每个国家的法律都有此要求"],
          ],
          [
            '"A mistake in etiquette can leave everyone embarrassed, and now and then cause a diplomatic argument."',
            "礼仪上的失误会造成真正的尴尬，偶尔还会引发外交事件。",
          ],
        ],
        [
          ['What is "gastrodiplomacy"?', '什么是"美食外交"？'],
          ["Using food as part of foreign policy", "把饮食作为外交政策的一部分"],
          [
            ["Holding every meeting during a meal", "所有会议都在用餐时举行"],
            ["Banning foreign restaurants", "禁止外国餐馆"],
          ],
          [
            'Some countries "have made food an official part of their foreign policy", such as Thailand with its restaurants abroad.',
            "一些国家把饮食作为外交政策的正式组成部分，比如泰国在海外推广泰国餐馆。",
          ],
        ],
      ],
    }),
  ],
};
