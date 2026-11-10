// The reading unit of the B2 theme Media and Persuasion: a rumor that spread online, a photo that fooled the world,
// an investigative newsroom, why we believe what we already think, influencers and the law, the language of
// advertising, the algorithms that choose what we see and a newspaper's last edition.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { readingWords } from "./reading-words.ts";

const passage = passageMaker(readingWords, [
  "b2-words-journalism",
  "b2-words-persuasion",
  "b2-words-advertising",
  "b2-words-information",
  "b2-words-reporting-verbs",
  "b2-words-online-media",
  "b2-words-logic",
  "b2-words-tone",
  "b2-words-film-and-tv",
  "b2-words-public-opinion",
  "b2-words-linking-3",
  "reporting-verbs",
  "participial-phrases",
]);

/** readingMedia is the reading unit of the theme Media and Persuasion. */
export const readingMedia: ReadingUnitDef = {
  id: "b2-reading-media",
  title: t("Media and Persuasion", "媒体与说服"),
  passages: [
    passage({
      id: "b2-media-how-a-rumor-spreads-online",
      title: ["How a Rumor Spreads Online", "谣言如何在网上传播"],
      body: `On a Sunday evening, a short message was shared on a popular social media platform. It claimed that someone had put poison in the water of a large city and that nobody should drink it until the next day. The message had no source and no name, but it looked official, and it was written in a calm, serious way. In less than an hour, it had been shared ten thousand times. By midnight, the shops of the city had sold every bottle of water they had.

The message was a hoax. The water was completely safe, and the water company of the city said so on its website the same evening. Yet the truth spread far more slowly than the rumor. Many people who had shared the message never saw the answer, and some who did see it refused to believe it.

Scientists who study misinformation say that this is common. In one famous study, they followed thousands of stories on a social media platform over several years. They found that false stories got to more people, and got to them faster, than true ones. Notably, it was not computer programs that spread them most, but ordinary people.

Why does this happen? One reason is emotion. A false story is usually more shocking than a true one, and surprise, fear and anger are what make people press the share button. Another reason is speed. Checking a fact takes time, while sharing it takes a second. Most people who share a rumor are not trying to lie to anyone. Instead, they believe they are protecting their friends.

The algorithms of social media make the problem worse. They are designed to increase engagement, so a message that many people respond to is shown to even more people. A rumor that makes people afraid therefore spreads to more and more people, while a careful answer does not.

What can be done? Some platforms now add a note to messages that have been fact-checked and found to be false, and others make people read an article before sharing it. These changes help, admittedly only a little. Scientists urge each of us to do something simpler: before sharing anything that makes us angry or afraid, wait a moment and ask where it came from. Inevitably, a few rumors will still spread, but each moment of thought makes the next one a little weaker.`,
      grammar: ["reporting-verbs"],
      questions: [
        [
          ["What happened to the answer from the water company?", "自来水公司的更正后来怎样了？"],
          ["It spread much more slowly than the rumor", "它传播得比谣言慢得多"],
          [
            ["It was removed from the website by midnight", "到午夜时它被从网站上删除了"],
            ["It made the shops sell even more water", "它使商店卖出了更多的水"],
          ],
          [
            '"Yet the truth spread far more slowly than the rumor." Many people who shared the message never saw the answer.',
            "更正传播得比谣言慢得多，许多转发过警告的人从未看到它。",
          ],
        ],
        [
          ["According to the study, who spread false stories the most?", "根据这项研究，谁传播虚假故事最多？"],
          ["Ordinary people", "普通人"],
          [
            ["Computer programs", "计算机程序"],
            ["Journalists who wanted more readers", "想要更多读者的记者"],
          ],
          [
            '"It was not computer programs that spread them most, but ordinary people."',
            "传播虚假故事最多的不是计算机程序，而是普通用户。",
          ],
        ],
        [
          ["Why do algorithms make the problem worse?", "为什么算法会让问题更严重？"],
          ["They show messages that people respond to strongly to even more people", "它们把引起强烈反应的消息推送给更多人"],
          [
            ["They remove corrections that fact-checkers have written", "它们会删除事实核查员写的更正"],
            ["They are designed to spread false stories on purpose", "它们本来就是为了故意传播假消息而设计的"],
          ],
          [
            "Algorithms are designed to increase engagement, so a message that many people respond to is shown to even more people, and a frightening rumor spreads further.",
            "算法的目的是提高参与度，引起很多反应的帖子会推送给更多人，于是吓人的谣言反而得到了奖励。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-media-the-photo-that-fooled-the-world",
      title: ["The Photo That Fooled the World", "骗过全世界的照片"],
      body: `In the hours after a great storm hit the coast of a large country, a dramatic photo went viral. It showed a shark swimming along a highway between cars that were almost under the brown water. Millions of people shared it. Several television channels showed it, and one famous commentator called it "the picture of the year".

The shark was not real. Someone had taken a real photo of a road under water and added a shark from an old magazine picture, using ordinary software. It took a team of experts less than a day to fact-check it and find the original pictures. Yet for many people, the truth came too late. The same photo, they discovered, had been shared after earlier storms in other countries as well.

Fake pictures are nothing new. Long before computers, governments cut people out of official photos when they fell out of favor, and artists put pictures together in a dark room. What has changed is how easy it has become. Today, a teenager with a phone can create in minutes what once required an expert and a week of work. With the newest tools, a computer can even produce a realistic photo of an event that never happened at all.

Why do people believe such pictures? Scientists point to several reasons. A photo seems more credible than words, because we assume that a camera just records what is there. Moreover, a dramatic picture confirms what we already feel during a disaster: that the situation is terrible. And very few of us stop to look carefully. Examined carefully, the shark photo had clear mistakes, notably a light on the animal that was different from the light on the water.

Experts recommend a few simple habits. First, ask where a picture was first shared, and who took it. Second, search for the picture online, since an older copy often reveals that it has been changed. Third, be particularly skeptical of a photo that seems too beautiful, too shocking or too useful for one side of an argument.

Admittedly, no single habit will protect us completely. However, the story of the shark suggests a useful rule: the more a picture makes us want to share it at once, the more reason there is to wait.`,
      grammar: ["participial-phrases"],
      questions: [
        [
          ["How was the photo of the shark made?", "鲨鱼照片是怎样制作出来的？"],
          ["A shark from an old picture was added to a real photo of a flood", "把旧图片中的鲨鱼加到一张真实的洪水照片上"],
          [
            ["A journalist took it from a boat during the storm", "一名记者在暴风雨中从船上拍的"],
            ["A computer created the whole scene from nothing", "计算机凭空生成了整个画面"],
          ],
          [
            'Someone "had taken a real photo of a road under water and added a shark from an old magazine picture, using ordinary software."',
            "有人拿一张被淹道路的真实照片，用普通软件加上了一张旧杂志图片里的鲨鱼。",
          ],
        ],
        [
          ["What, according to the passage, has changed about fake images?", "根据文章，伪造图片有什么变化？"],
          ["It has become much easier to make them", "制作它们变得容易多了"],
          [
            ["Governments have started to make them", "政府开始制作这类图片"],
            ["People have stopped believing photos", "人们不再相信照片了"],
          ],
          [
            '"Fake pictures are nothing new... What has changed is how easy it has become."',
            "伪造图片并不新鲜，改变的是制作它们变得多么容易。",
          ],
        ],
        [
          ["Which piece of advice do fact-checkers give?", "事实核查员给出了哪一条建议？"],
          ["Search for the picture online to find older copies", "在网上搜索这张图片，找出更早的版本"],
          [
            ["Trust a photo if a television channel has shown it", "如果电视台播过某张照片，就可以相信它"],
            ["Share a photo quickly so that experts can check it", "尽快转发照片，好让专家来核查"],
          ],
          [
            '"Search for the picture online, since an older copy often reveals that it has been changed." Television channels showed the fake photo too.',
            "在网上搜索图片，旧版本常常能揭示图片被改过；电视台也播过这张假照片。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-media-inside-an-investigative-newsroom",
      title: ["Inside an Investigative Newsroom", "走进调查新闻编辑部"],
      body: `Most news is written in a day. An investigative story can take a year. A team of reporters at a national newspaper, for example, once spent fourteen months on a single story about a company that was selling dangerous medicine to hospitals. By the time it was published, they had read more than forty thousand pages of documents and talked to over two hundred people.

The story began with a phone call. A nurse at a small hospital told one of the reporters that several patients had become ill after receiving the same medicine. She could not prove anything, she said, but she was sure that something was wrong. Most calls of this kind lead to nothing. This one, however, led to another nurse in another city, and then to a third.

Gradually, the team found more evidence. A man who had once worked for the company agreed to speak to them, on condition that his name would not be printed. He alleged that managers had known about the problem for two years and had hidden it. A journalist cannot just quote such a claim, though. Every fact must be confirmed by at least two independent sources, and documents are best of all. For months, the reporters searched for those documents, until a second employee finally disclosed private emails that showed exactly what the managers had known.

Before publishing, the newspaper did something that surprises many people: it sent the company a long list of everything the story would say, and gave it a week to respond. This is a simple rule of fair reporting. The company denied everything and said that it would take the newspaper to court. The editors read every line of the story again with their lawyers. Then they published it.

The effect was sudden. The government ordered the hospitals to stop using the medicine, and two managers were later charged. The reporters won a national prize. Yet the editor of the team insists that the prize is not the point. "Investigative work is expensive and slow," she remarked in an interview. "Most of our work never becomes a story at all. But without it, nobody would ever have known."

As newspapers lose money, investigative teams are often the first to be cut. That, arguably, is the greatest risk of all: not that news is false, but that some of the most important stories are never written.`,
      grammar: ["reporting-verbs"],
      questions: [
        [
          ["How did the investigation begin?", "这项调查是怎样开始的？"],
          ["A nurse called one of the reporters", "一名护士给其中一位记者打了电话"],
          [
            ["The company sent the newspaper some documents", "公司给报社寄来了一些文件"],
            ["Two managers were charged by the police", "两名经理被警方起诉"],
          ],
          [
            '"The story began with a phone call. A nurse at a small hospital told one of the reporters that several patients had become ill."',
            "故事始于一通电话：一家小医院的护士告诉记者，有几位病人用药后病倒了。",
          ],
        ],
        [
          ["Why could the reporters not simply quote the former employee?", "为什么记者不能直接引用那位前员工的话？"],
          ["Every fact had to be confirmed by two independent sources", "每个事实都必须由两个独立来源证实"],
          [
            ["He asked them not to use anything he said", "他要求他们不要使用他说的任何话"],
            ["The company had paid him to tell lies", "公司花钱让他撒谎"],
          ],
          [
            '"A journalist cannot just quote such a claim, though. Every fact must be confirmed by at least two independent sources."',
            "记者不能直接引用这样的说法，每个事实都必须由至少两个独立来源证实。",
          ],
        ],
        [
          ["What does the editor think is most important?", "那位编辑认为最重要的是什么？"],
          ["That the story could be known at all", "让这件事能够为人所知"],
          [
            ["That the team won a national prize", "团队赢得了全国性的奖项"],
            ["That investigative work becomes cheaper and faster", "调查工作变得更便宜、更快"],
          ],
          [
            'She insists "the prize is not the point": without this kind of work, "nobody would ever have known."',
            "她坚持说奖项不是重点；没有这样的工作，就没有人会知道真相。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-media-why-we-believe-what-we-already-think",
      title: ["Why We Believe What We Already Think", "我们为何相信自己早已认定的事"],
      body: `In a famous experiment, scientists brought together a group of students, half of whom supported a certain law and half of whom opposed it. They gave every student the same two studies to read. One study seemed to support the law; the other seemed to show that it did not work. Following logic, the evidence should have made both groups less certain. Instead, the opposite happened. Each group judged the study that agreed with it to be well designed and found serious problems in the other. By the end, both groups were more convinced of their original opinion than before.

Scientists call this "confirmation bias": we notice, accept and remember information that confirms what we already believe, while we pay no attention to information that contradicts it, or doubt it. It affects everyone, from scientists to judges and journalists, and it is particularly strong when a belief is part of who we are.

Why should the brain work like this? One explanation is that it saves effort. Asking questions about every belief would take a lot of energy, so the brain sees an idea it knows as safe and a new one as a possible threat. Another explanation is social. For most of history, people needed to agree with their group to stay alive. Changing an opinion could mean losing friends, and the brain seems to respond to a challenge to our beliefs almost as if it were a physical threat.

Online media can make the bias stronger. If we mostly follow people who share our views, and algorithms mostly show us content we like, we may almost never meet a serious counterargument. When we do, it is often expressed in a sarcastic or angry way, which only makes us want to protect our view.

Can we avoid it? Completely, probably not. However, scientists have found some strategies that help. One is to ask ourselves what evidence would change our opinion; if the answer is "nothing", our view may not rest on evidence at all. Another is to state the argument of the other side in its strongest form before rejecting it. A third is just to be interested instead of certain.

Notably, people who have studied longer are not less biased. They are often just better at finding reasons for what they already think. Being clever, it seems, does not protect us. What helps is the modest habit of admitting that we might be wrong.`,
      grammar: ["participial-phrases"],
      glossed: ["confirmation"],
      questions: [
        [
          ["What happened to the students in the experiment?", "实验中的学生后来怎样了？"],
          ["Both groups became more sure of their first opinion", "两组都更坚信自己原来的观点"],
          [
            ["Both groups became less certain, as logic suggests", "正如逻辑所示，两组都变得不那么确定"],
            ["Most students changed their opinion of the law", "大多数学生改变了对这项法律的看法"],
          ],
          [
            '"By the end, both groups were more convinced of their original opinion than before." Logically, they should have become less certain.',
            "最后两组都比以前更坚信原来的观点，虽然按逻辑他们本应变得不那么确定。",
          ],
        ],
        [
          ["Which is a social explanation of confirmation bias?", "以下哪一项是对确认偏误的社会层面的解释？"],
          ["Agreeing with one's group once helped people survive", "与群体保持一致曾经有助于人类生存"],
          [
            ["Questioning every belief would take too much effort", "质疑每一个信念会耗费太多精力"],
            ["Scientists and judges are trained to ignore evidence", "科学家和法官被训练成忽视证据"],
          ],
          [
            '"Another explanation is social. For most of history, people needed to agree with their group to stay alive." Saving effort is the first, non-social explanation.',
            "社会层面的解释是：在人类历史的大部分时间里，与群体一致对生存至关重要；节省精力是另一种解释。",
          ],
        ],
        [
          ["What does the passage say about people who have studied longer?", "关于受教育时间更长的人，文章说了什么？"],
          ["They are often better at defending what they already believe", "他们往往更善于为自己已有的信念辩护"],
          [
            ["They rarely suffer from confirmation bias", "他们很少受确认偏误影响"],
            ["They change their opinions more easily than others", "他们比别人更容易改变观点"],
          ],
          [
            '"People who have studied longer are not less biased. They are often just better at finding reasons for what they already think."',
            "受教育程度高的人并不更少偏见，他们只是更善于为已有的想法找理由。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-media-influencers-and-the-law",
      title: ["Influencers and the Law", "网红与法律"],
      body: `A young woman with two million subscribers shares a video of her morning. She makes coffee, talks about her plans for the day and, almost in passing, mentions a new face cream that has "changed her life". Her followers trust her. Many of them buy the cream that week. What most of them do not know is that the company paid her several thousand dollars to say those words.

Is that wrong? In many countries, it is not only wrong but against the law. Laws on advertising have been in place for decades, and they rest on a simple principle: people have the right to know when someone is trying to sell them something. A commercial on television is clearly an advertisement. A friendly video from someone we feel we know is not, and that is exactly why it works so well.

As influencer marketing has grown into a huge industry, governments in many countries have begun to enforce these rules. Influencers must now state clearly when a video is sponsored, for example with a label at the start, not hidden between twenty hashtags at the end. In some places, they must also follow the same rules as any advertiser for the products they endorse: if a cream claims to make the skin look younger, there must be evidence that it does.

The results can be serious. In one example, a famous influencer had to pay a lot of money for promoting a diet product without saying that she had been paid. In another, a group of influencers was criticized for promoting a festival that turned out to be a disaster; a group of their followers alleged in court that they had been lied to. Several countries have gone even more and banned influencers from promoting certain products at all, such as gambling or surgery to change the face, particularly to young audiences.

Influencers themselves are divided. Some welcome the rules, arguing that being honest builds credibility and that their followers deserve the truth. Others say the rules are hard to understand and are different in each country, albeit for good reasons. People who criticize the rules, conversely, argue that the laws are still too weak and not enforced often enough.

For viewers, the lesson is simple. When someone we admire recommends a product, it is worth asking a question that advertising has always invited: who benefits if I believe this?`,
      grammar: ["reporting-verbs"],
      questions: [
        [
          ["What principle do the laws on advertising rest on?", "广告法以什么原则为基础？"],
          ["People should know when someone is trying to sell them something", "人们有权知道别人什么时候在向他们推销东西"],
          [
            ["Products must be cheaper online than in shops", "产品在网上必须比在商店便宜"],
            ["Only companies may advertise their own products", "只有公司本身才能为自己的产品做广告"],
          ],
          [
            'The laws "rest on a simple principle: people have the right to know when someone is trying to sell them something."',
            "这些法律基于一个简单的原则：人们有权知道有人在向他们推销。",
          ],
        ],
        [
          ["Why is a friendly video from an influencer so effective as advertising?", "为什么网红的亲切视频作为广告如此有效？"],
          ["Viewers do not see it as an advertisement", "观众不会把它看作广告"],
          [
            ["It is longer than a commercial on television", "它比电视广告更长"],
            ["It always contains many hashtags", "它总是带有很多话题标签"],
          ],
          [
            'A commercial is clearly an advertisement; "a friendly video from someone we feel we know is not, and that is exactly why it works so well."',
            "电视广告一看就是广告，而来自熟悉的人的视频看起来不像广告，这正是它有效的原因。",
          ],
        ],
        [
          ["What do critics of the current rules argue?", "批评现行规定的人认为什么？"],
          ["The rules are too weak and not enforced enough", "这些规定太宽松，执行得也不够"],
          [
            ["The rules are too strict for young influencers", "这些规定对年轻网红来说过于严格"],
            ["The rules should be the same in every country", "各国的规定应该完全一样"],
          ],
          [
            'Others "argue that the laws are still too weak and not enforced often enough." The point about different countries comes from influencers.',
            "批评者认为法律仍然太弱、执行太少；各国规定不同的说法来自网红自己。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-media-the-language-of-advertising",
      title: ["The Language of Advertising", "广告的语言"],
      body: `Advertisers have very little time. A billboard is seen for two or three seconds from a passing car; a commercial must catch our attention before we pick up the remote control. In that time, every word has to work hard, and over the years the language of advertising has developed some techniques that work very well.

The first is to keep things simple. Advertising slogans are short, use common words and often play with sound. A catchy slogan that repeats a sound is easier to remember, which is why jingles stay in our heads for years. Specifically, research shows that people judge a sentence with a repeated sound as more probably true than the same idea expressed without it.

The second technique is to choose words that sound strong but say little. Look carefully at some common claims: a product for the hair "helps reduce" hair loss, or a drink "can contribute to" good health. Words such as "helps", "can" and "up to" allow an advertiser to suggest a strong result without actually promising it. A product that is "up to fifty percent cheaper" may be fifty percent cheaper on only one thing.

Third, advertisers appeal to emotions more than to reason. A car is almost never sold by describing its motor. It is sold with pictures of adventure, family or the open road. Admittedly, an advertisement may have some facts in it, but they are usually there to support a feeling, not the other way around. The goal is for us to connect the product with something we already want.

A fourth technique is to suggest that everyone else has already decided. Slogans such as "the favorite of the nation" or "join millions of happy customers" exploit our habit of following others. Testimonials from ordinary people, or endorsement by famous ones, work in the same way.

These techniques are not against the law, and not all of them are lies. However, recognizing them helps us to think more clearly. The next time a slogan stays in your head, it is worth asking a few questions. What exactly is being promised? What is being implied but not stated? And would the product still seem so good if the music, the smiling faces and the clever words were taken away? Often, the answer reveals a great deal.`,
      grammar: ["participial-phrases"],

      questions: [
        [
          ["Why do advertisers use repeated sounds in slogans?", "广告商为什么在口号中使用重复的声音？"],
          ["They make a slogan easier to remember and seem more true", "它们让口号更好记，也显得更可信"],
          [
            ["They make an advertisement cheaper to produce", "它们能降低广告的制作成本"],
            ["The law requires slogans to be short", "法律要求口号必须简短"],
          ],
          [
            "A catchy slogan that repeats a sound is easier to remember, and people judge such a sentence as more probably true.",
            "重复某个声音的口号更容易记住，人们也会觉得这样的句子更可能是真的。",
          ],
        ],
        [
          ['What do words such as "helps" and "up to" allow an advertiser to do?', '"helps" 和 "up to" 这样的词让广告商可以做什么？'],
          ["Suggest a strong result without promising it", "暗示很好的效果而不做出承诺"],
          [
            ["Describe the product in a scientific way", "用科学的方式描述产品"],
            ["Show that the product is the cheapest", "证明产品是最便宜的"],
          ],
          [
            'These words "allow an advertiser to suggest a strong result without actually promising it."',
            "这些词让广告商能够暗示很强的效果，却并不真正做出承诺。",
          ],
        ],
        [
          ["What is the role of facts in most advertisements?", "在大多数广告中，事实起什么作用？"],
          ["They support a feeling", "它们用来支持一种情感"],
          [
            ["They replace emotional images", "它们取代了情感化的画面"],
            ["They describe the engine of a car", "它们描述汽车的发动机"],
          ],
          [
            'An advertisement may have some facts in it, "but they are usually there to support a feeling, not the other way around."',
            "广告里可能有一些事实，但它们通常是为情感服务的，而不是反过来。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-media-who-decides-what-we-see",
      title: ["Who Decides What We See?", "谁决定我们看到什么？"],
      body: `Fifty years ago, the answer to this question was quite simple. A small number of editors at newspapers and television channels decided which stories were important. Their decisions could be biased, and they were often criticized, but at least everyone knew who they were. Today, for billions of people, the news arrives through a screen, chosen not by an editor but by an algorithm.

An algorithm is essentially a list of instructions. The algorithms of social media platforms study what each person does: which messages they stop at, what they like, comment on and share, and how long they watch each video. From this, they predict what will keep that person on the platform for as long as possible, and show more of it. Two neighbors who open the same app may therefore see completely different worlds.

This has clear benefits. A person interested in gardens, chess or strange birds can easily find content and creators that a newspaper would never have reported on. Small voices can get to large audiences without the approval of anyone rich or important.

However, others point to serious problems. Because the algorithms reward engagement, they usually promote content that causes strong emotions, especially outrage. A calm, balanced report may just disappear. Moreover, people may end up in what is sometimes called a filter bubble, seeing only views they already agree with, while those who disagree see different facts. Some scientists argue that this has made public opinion more divided.

Others are less pessimistic. They point out that people have always chosen newspapers that agreed with their views, and that many people still meet many different opinions online. The evidence on the filter bubble, they say, is mixed.

What is not in doubt is the lack of transparency. Editors could be asked to explain their decisions; the rules of most algorithms are secret, and they change all the time. In response, some governments now require large platforms to explain in simple terms how their algorithms work and to let people choose a feed that is not personalized. Whether these rules are enough is not yet clear. Until then, it may help to remember, every time we scroll, that what we see is not just the world, but a picture of it chosen for us.`,
      grammar: ["participial-phrases"],
      glossed: ["bubble", "personalized", "scroll"],
      questions: [
        [
          ["What do the algorithms of social media sites try to predict?", "社交媒体网站的算法试图预测什么？"],
          ["What will keep a user on the site for as long as possible", "什么能让用户在网站上停留尽可能长的时间"],
          [
            ["Which stories are most important for society", "哪些新闻对社会最重要"],
            ["Which news is true and which is false", "哪些消息是真的，哪些是假的"],
          ],
          [
            'Algorithms "predict what will keep that person on the platform for as long as possible, and show more of it."',
            "算法预测什么能让用户在网站上停留得最久，并展示更多这类内容。",
          ],
        ],
        [
          ["Which is a benefit of algorithms, according to the passage?", "根据文章，以下哪项是算法的好处？"],
          ["Small voices can reach large audiences", "小人物的声音也能触达大量受众"],
          [
            ["Calm and balanced reports become more popular", "冷静平衡的报道变得更受欢迎"],
            ["Everyone sees the same important stories", "每个人都能看到同样的重要新闻"],
          ],
          [
            '"Small voices can get to large audiences without the approval of anyone rich or important." Calm reports, in fact, may disappear.',
            "小人物的声音无需权势人物认可就能触达大量受众；冷静的报道反而可能被淹没。",
          ],
        ],
        [
          ['What is "not in doubt", according to the writer?', '作者认为什么是"毫无疑问"的？'],
          ["Algorithms are much less transparent than editors were", "算法远不如过去的编辑透明"],
          [
            ["Filter bubbles have made public opinion more divided", "信息茧房让公众舆论更加分裂"],
            ["Governments now control the rules of algorithms", "政府现在掌控着算法的规则"],
          ],
          [
            '"What is not in doubt is the lack of transparency." The evidence on filter bubbles is described as "mixed".',
            '确定无疑的是缺乏透明度；关于信息茧房的证据则被描述为"有好有坏"。',
          ],
        ],
      ],
    }),
    passage({
      id: "b2-media-a-newspapers-last-edition",
      title: ["A Newspaper's Last Edition", "一份报纸的最后一期"],
      body: `For one hundred and twelve years, the newspaper of the town was printed every morning but Sunday. It reported on the council and football matches, births and deaths, fires and floods. At its best, forty years ago, it had a circulation of forty thousand and employed sixty people. On its last day, there were nine.

The decline had been slow at first and then very fast. As people moved online, they stopped paying for news they could read for free. Worse, the advertising that had paid for most of the newspaper moved to the internet too. Shops that once bought a full page now paid a few dollars to find customers on social media. Year after year, the newspaper cut its pages, its staff and its coverage, until there was not much left to buy.

The editor, a woman who had started there as a young reporter, wrote the final editorial herself. She did not blame anyone. She thanked the people who had read it, the people who had delivered the paper in the rain for a century, and the reporters who had sat through thousands of hours of boring talk "so that you didn't have to". Then she asked a question: who would sit through them now?

It is a serious question. Scientists who have studied towns that lost their local newspaper have found worrying results. In such places, a smaller number of people stand for election, and not as many people vote. Public spending usually rises, in part because nobody is watching how money is spent. Social media does some of the work, but it almost never reports on a council meeting or checks the claims of a politics leader. Instead, rumors spread more easily, and people increasingly get their news from national channels that have little interest in their town.

There are some signs of hope. In several countries, journalists who lost their jobs have started small news websites, supported by subscribers, gifts or local charities. Some of them are doing well, albeit with much smaller teams. They cannot do everything the old newspapers did, but they make sure that someone is still asking questions.

On the last morning, the coffee shop of the town ordered fifty copies, as it always had. By nine o'clock, every one had been taken. Several customers said they would keep their copy. It was, one of them remarked, the first newspaper they had ever bought to keep instead of to read.`,
      grammar: ["reporting-verbs"],

      questions: [
        [
          ["Why did the newspaper lose its money?", "这家报纸为什么失去了收入？"],
          ["Readers and advertisers both moved to the internet", "读者和广告商都转向了互联网"],
          [
            ["The editor decided to stop selling advertising", "编辑决定不再出售广告"],
            ["The town stopped holding council meetings", "镇上不再召开议会会议"],
          ],
          [
            "Readers stopped paying for news they could read for free, and the advertising that paid for the newspaper moved to the internet too.",
            "读者不愿再为能免费读到的新闻付钱，支撑报纸的广告也转到了互联网上。",
          ],
        ],
        [
          ["What have researchers found in towns that lost their local newspaper?", "研究人员在失去本地报纸的城镇发现了什么？"],
          ["Fewer people vote, and public spending tends to rise", "投票的人变少，公共开支往往上升"],
          [
            ["Social media reports carefully on local meetings", "社交媒体认真报道地方会议"],
            ["More people stand for election than before", "参加竞选的人比以前更多"],
          ],
          [
            '"In such places, a smaller number of people stand for election, and not as many people vote. Public spending usually rises."',
            "在这些地方，参选和投票的人都变少了，公共开支往往上升。",
          ],
        ],
        [
          ["Why did customers want to keep a copy of the last edition?", "为什么顾客想保留最后一期报纸？"],
          ["It marked the end of the town's newspaper", "它标志着这家本地报纸的终结"],
          [
            ["It contained a story about the café", "里面有一篇关于这家咖啡馆的报道"],
            ["It was given to them for free", "这期报纸是免费送给他们的"],
          ],
          [
            "It was the newspaper's final edition, and one customer said it was the first newspaper they had bought to keep rather than to read.",
            "这是报纸的最后一期，一位顾客说这是他第一次买报纸是为了收藏而不是阅读。",
          ],
        ],
      ],
    }),
  ],
};
