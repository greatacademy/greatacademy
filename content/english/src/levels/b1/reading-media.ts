// The reading unit of the B1 theme Media and News: how news is made, fake photos, headlines, trust, crime and elections.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { readingWords } from "./reading-words.ts";

const reported = "reported-speech";

const passage = passageMaker(readingWords, [
  "b1-words-news",
  "b1-words-media",
  "b1-words-truth",
  "b1-words-crime",
  "b1-words-describing-events",
  "b1-words-communicating",
  "b1-words-opinions",
  reported,
]);

/** readingMedia is the reading unit of the theme Media and News. */
export const readingMedia: ReadingUnitDef = {
  id: "b1-reading-media",
  title: t("Media and News", "媒体与新闻"),
  passages: [
    passage({
      id: "b1-media-how-a-newspaper-is-made",
      title: ["How a Newspaper Is Made", "一份报纸是怎样做出来的"],
      body: `At six o'clock in the morning, you can buy a newspaper full of stories from the day before. But how is it possible to collect, write and print all that news in less than twenty-four hours?

The day at a newspaper starts with a meeting at about ten in the morning. The editors talk about the stories that will probably be in the next paper: a national election, a major accident, a new law, a big football match. They decide which reporters will work on each story, and how much space each one will get.

Then the reporters go out. They attend press conferences, interview witnesses and call their sources. A good reporter checks every fact with at least two sources, because a newspaper that publishes false information quickly loses the trust of the public. By the afternoon, the reporters are back at their desks, writing.

In the evening, the editors read every article. They correct mistakes, make long stories shorter and write the headlines. Photos are chosen. Designers put everything on the page, like pieces of a puzzle.

The hardest moment comes at about ten at night, which is the deadline. After that, the pages are sent to the printing factory. If something major happens after the deadline, like an earthquake, the editors may stop the printing machines and change the front page. One editor told me that this had happened to him three times in thirty years.

By four in the morning, the newspapers are on their way to shops all over the country. Of course, today most news is also published online, all day long. But for many people, the paper on the table at breakfast is still the best way to start the day.`,
      grammar: [reported],
      questions: [
        [
          ["What happens at the meeting at ten in the morning?", "早上十点的会议上会做什么？"],
          ["The editors decide which stories will be in the paper and who will write them", "编辑们决定报纸刊登哪些新闻、由谁来写"],
          [
            ["The pages are sent to the printing factory", "版面被送到印刷厂"],
            ["The reporters interview witnesses", "记者们采访目击者"],
          ],
          [
            "At the morning meeting the editors talk about the stories for the next paper and decide which reporters will work on each one.",
            "上午的会议上，编辑们讨论第二天报纸的新闻，并分配记者负责每篇报道。",
          ],
        ],
        [
          ["Why does a good reporter check every fact with two sources?", "为什么好记者要用两个来源核实每个事实？"],
          ["A newspaper that publishes false information loses the trust of the public", "刊登虚假信息的报纸会失去公众的信任"],
          [
            ["The editors pay more for longer stories", "编辑会为更长的报道付更多钱"],
            ["The deadline is at ten at night", "截稿时间是晚上十点"],
          ],
          [
            'The passage says this is "because a newspaper that publishes false information quickly loses the trust of the public".',
            "报纸一旦刊登虚假信息，就会很快失去公众的信任。",
          ],
        ],
        [
          ["What did one editor say, according to the writer?", "根据作者的说法，一位编辑说了什么？"],
          ["That he had stopped the printing machines three times in thirty years", "他三十年里叫停过三次印刷"],
          [
            ["That he never changes the front page", "他从不改动头版"],
            ["That the deadline was at four in the morning", "截稿时间是凌晨四点"],
          ],
          [
            'Reported speech: "One editor told me that this had happened to him three times in thirty years." The past perfect had happened reports what he said about the past.',
            "这是间接引语：编辑说这种事三十年里发生过三次，动词往过去推了一步，变成 had happened。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-media-fake-photos",
      title: ["Fake Photos", "假照片"],
      body: `A shark swimming down a city street after a flood. A famous leader shaking hands with a thief. A huge wave about to hit a beach full of tourists. Photos like these are shared millions of times online, and many of them are fake.

Changing photos is not new. A hundred years ago, people in photos were sometimes painted out by hand. But today anyone with a phone can change a picture in a few seconds, and computer programs can make photos of things that never happened at all. Some fake photos are made as a joke. Others are made to make people angry, to sell something or to change how people vote.

How can you tell if a photo is real? Journalists give some simple advice. First, look at the source. Was the photo published by a reliable newspaper or news channel, or was it shared by a stranger with no name and no photo? Second, look carefully at the small things in it. Fake photos often have hands with six fingers, writing that means nothing, or light that comes from the wrong side. Third, search for the photo online. You may find that it was taken years ago in a different country, or that the real picture looks different.

Most important of all, stop before you share. Ask yourself how the photo makes you feel. If it makes you very angry or very surprised, that is exactly the moment to be careful. People who make fake photos know that angry or surprised people share without thinking.

A journalist I spoke to said that she checked every photo two times before using it. "People trust us," she explained. "If we publish one fake, we lose that trust."`,
      grammar: [reported],
      questions: [
        [
          ["Why are some fake photos made, according to the passage?", "根据文章，有些假照片是为了什么而制作的？"],
          ["To make people angry or change how they vote", "为了激怒人们或改变他们的投票"],
          [
            ["To help newspapers save money", "为了帮新闻机构省钱"],
            ["To teach people how to use their phones", "为了教人们使用手机"],
          ],
          [
            '"Some fake photos are made as a joke. Others are made to make people angry, to sell something or to change how people vote."',
            "有些假照片是开玩笑，有些则是为了激怒人们、卖东西或影响选举。",
          ],
        ],
        [
          ["Which detail can show that a photo is fake?", "哪个细节可能说明一张照片是假的？"],
          ["Hands with six fingers or writing that means nothing", "六根手指的手或毫无意义的文字"],
          [
            ["A photo published by a reliable newspaper", "由可靠报纸刊登的照片"],
            ["A photo of a beach full of tourists", "一张满是游客的海滩照片"],
          ],
          [
            '"Fake photos often have hands with six fingers, writing that means nothing, or light that comes from the wrong side."',
            "假照片常有六根手指的手、看不懂的文字或方向不对的光线。",
          ],
        ],
        [
          ["What did the journalist say?", "那位记者说了什么？"],
          ["That she checked every photo two times before using it", "她每张照片使用前都要检查两遍"],
          [
            ["That she never uses photos from the internet", "她从不使用网上的照片"],
            ["That readers do not care about fake photos", "读者不在乎假照片"],
          ],
          [
            'Reported speech: "A journalist I spoke to said that she checked every photo two times before using it." Her words "I check" became she checked.',
            "间接引语：她原话是 I check，转述时变成 she checked。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-media-the-podcast-that-started-in-a-bedroom",
      title: ["The Podcast That Started in a Bedroom", "从卧室起步的播客"],
      body: `Three years ago, Noah and Leo Grant were two bored brothers in a small town. They were seventeen and fifteen, they loved history, and they argued about it all the time. "Our mother said that if we were going to argue anyway, we should turn it into a podcast," Noah remembers. So they did.

They bought cheap equipment, put old coats on the walls of their bedroom to make the sound better, and made their first episode: a debate of forty minutes about why the Roman Empire fell. They uploaded it and told their friends. Twelve people listened to it.

The brothers didn't give up. Every week they chose a new subject, read books from the library, and made a new episode. They tried to make history fun: they told stories, did funny voices and asked their audience to vote on questions. Slowly, the number of followers grew. After one year they had five thousand. Then a famous history professor mentioned their podcast in an interview, and within a month they had a hundred thousand.

Today the podcast has more than half a million followers in forty countries. Famous professors have been guests on it, and the brothers have made an episode in front of an audience of eight hundred people. They still make most episodes in the same bedroom, but now with better equipment.

What is their advice for young people who want to start a podcast? Leo says that the subject matters more than the equipment. "Talk about something you really love," he says. "If you are bored, your audience will be bored too." Noah adds that it is important to publish regularly. "People want to know when the next episode is coming. If you disappear for two months, they forget about you."`,
      grammar: [reported],
      names: ["Noah", "Leo", "Grant", "Roman", "Empire"],
      questions: [
        [
          ["Why did the brothers start the podcast?", "兄弟俩为什么开始做播客？"],
          ["Their mother said they should turn their arguments into a podcast", "他们的妈妈说他们应该把争论做成播客"],
          [
            ["A history professor asked them to", "一位历史教授请他们录"],
            ["Their school gave them some equipment", "学校给了他们一些设备"],
          ],
          [
            'Reported speech: "Our mother said that if we were going to argue anyway, we should turn it into a podcast."',
            "妈妈说既然他们反正要争论，不如做成播客；这是用间接引语转述的话。",
          ],
        ],
        [
          ["What happened after a professor mentioned the podcast?", "一位教授提到这个播客后发生了什么？"],
          ["Within a month they had a hundred thousand followers", "一个月内他们有了十万听众"],
          [
            ["Only twelve people listened to it", "只有十二个人听了"],
            ["They stopped making episodes in their bedroom", "他们不再在卧室里做节目了"],
          ],
          [
            '"A famous history professor mentioned their podcast in an interview, and within a month they had a hundred thousand."',
            "知名教授在采访中提到后，一个月内关注者就涨到了十万；只有十二个人收听的是第一期。",
          ],
        ],
        [
          ["What does Leo say about starting a podcast?", "关于做播客，利奥说了什么？"],
          ["The subject matters more than the equipment", "话题比设备更重要"],
          [
            ["You need very expensive equipment", "你需要非常昂贵的设备"],
            ["You should publish only when you want to", "想发布的时候再发布就行"],
          ],
          [
            '"Leo says that the subject matters more than the equipment." Noah adds that you should publish regularly.',
            "利奥认为话题比设备重要；诺亚补充说要定期更新。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-media-why-headlines-shout",
      title: ["Why Headlines Shout", "标题为什么要“喊”"],
      body: `"SHOCKING NEWS!" "You won't believe what happened next!" "Scientists warn: this food is destroying your brain!" Headlines like these are everywhere, in newspapers, on websites and on social media. Why do they shout so loudly?

The simple answer is attention. Every day we see thousands of headlines, and we read only a few of the articles. A headline has a second or two to make us stop. So editors choose short, strong words, and they often use numbers, questions and shocking claims.

Online, it is even harder to get attention. Many websites earn money from advertisements, and they are paid for every person who clicks. A more exciting headline means more clicks, and more clicks mean more money. This has led to "clickbait": headlines that promise something exciting, but the article is boring or doesn't really match the headline.

The problem is that many people read only headlines. A study found that more than half of the articles shared on social media had never been opened by the person who shared them. If the headline is not accurate, people may believe something that is not true. For example, a headline might say "Coffee causes heart disease", while the article explains that one small study found a weak effect in older men.

Good journalists try to write headlines that are both interesting and honest. As people who read the news, we can help too. Before you believe or share a story, read the article, not just the headline. Ask yourself whether the headline matches the facts. And when a headline shouts very loudly, be especially careful. Often, the louder the headline, the smaller the truth behind it.`,
      grammar: [reported],
      glossed: ["clickbait"],
      questions: [
        [
          ["Why do headlines use short, strong words?", "标题为什么要用简短有力的词？"],
          ["They have only a second or two to make us stop", "它们只有一两秒钟让我们停下来"],
          [
            ["Editors do not have time to write more", "编辑没有时间写更多"],
            ["Newspapers have very small pages", "报纸的版面很小"],
          ],
          [
            '"A headline has a second or two to make us stop. So editors choose short, strong words."',
            "我们每天看到成千上万个标题，标题只有一两秒钟吸引我们的注意。",
          ],
        ],
        [
          ["What is clickbait?", "什么是标题党（clickbait）？"],
          ["A headline that promises more than the article gives", "承诺很多、文章却名不副实的标题"],
          [
            ["An article without a headline", "没有标题的文章"],
            ["A headline that is long and boring", "又长又无聊的标题"],
          ],
          [
            'Clickbait headlines "promise something exciting, but the article is boring or doesn\'t really match the headline".',
            "标题党用夸张的标题吸引点击，文章内容却令人失望或与标题不符。",
          ],
        ],
        [
          ["What does the passage advise readers to do?", "文章建议读者怎么做？"],
          ["Read the article, not just the headline", "读文章，而不只是看标题"],
          [
            ["Share stories with loud headlines quickly", "赶快分享标题夸张的新闻"],
            ["Stop reading news on websites", "不再在网站上看新闻"],
          ],
          [
            '"Before you believe or share a story, read the article, not just the headline."',
            "在相信或分享之前，先读完文章，并看看标题是否符合事实。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-media-a-day-with-a-local-reporter",
      title: ["A Day with a Local Reporter", "跟随地方记者的一天"],
      body: `Hannah Kim has been a reporter for the Riverside News, a small local newspaper, for six years. She writes about everything that happens in her town: the weather, school sports, crime, the opening of a new shop. I spent a day with her.

At eight o'clock she was already on the phone. Someone had called the paper to say that the old bridge on Mill Road was closed. Hannah called the town office, and an official told her that workers were repairing the bridge after a storm. She asked when it would open again, but nobody could give her an answer. "That is a story too," she told me. "People need to know."

At ten we drove to a school, where the children had collected money for a local hospital. Hannah talked to the principal and two pupils, and took photos. "Local news is about people," she said. "A national newspaper would never print this. Here, the whole town will read it."

After lunch she went to the court, where a man said that he had not stolen five bikes. She listened for two hours and took careful notes. "In court, every word must be accurate," she explained. "If I make a mistake, I can hurt someone who has done nothing wrong."

At five she was back at her desk, writing four short articles before her deadline. Her editor read them, asked her to check a name, and said they were ready.

Is it a good job? Hannah laughed. She said that the pay was low and the hours were long. "But I know everyone here, and they know me. When I write something, it really matters to them."`,
      grammar: [reported],
      names: ["Hannah", "Kim", "Riverside", "Mill"],
      questions: [
        [
          ["What did the official tell Hannah about the bridge?", "那位官员告诉汉娜桥怎么了？"],
          ["That workers were repairing it after a storm", "工人们在暴风雨后正在修桥"],
          [
            ["That it would open the next morning", "桥第二天早上就会开放"],
            ["That a reader had damaged it", "一位读者把桥弄坏了"],
          ],
          [
            'Reported speech: "an official told her that workers were repairing the bridge after a storm." Nobody could say when it would open.',
            "这是间接引语：官员说桥在暴风雨后正在维修，但没人知道何时重新开放。",
          ],
        ],
        [
          ["Why did Hannah write about the school children?", "汉娜为什么报道学校的孩子们？"],
          ["Local news is about people, and the whole town will read it", "地方新闻关注身边的人，全镇人都会读"],
          [
            ["A national newspaper asked her to", "一家全国性报纸请她写"],
            ["The children had stolen bikes", "孩子们偷了自行车"],
          ],
          [
            'Hannah said: "Local news is about people. A national newspaper would never print this. Here, the whole town will read it."',
            "汉娜说地方新闻关注普通人，这种事全国性报纸不会登，但全镇人都会看。",
          ],
        ],
        [
          ["Why must Hannah be accurate in court?", "为什么汉娜在法庭上必须准确？"],
          ["A mistake can hurt someone who has done nothing wrong", "一个错误可能伤害无辜的人"],
          [
            ["The judge reads all her articles", "法官会读她所有的文章"],
            ["She has only two hours to write", "她只有两个小时来写"],
          ],
          [
            '"In court, every word must be accurate. If I make a mistake, I can hurt someone who has done nothing wrong."',
            "法庭报道中一个错误就可能伤害无辜的人，所以每个字都必须准确。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-media-can-we-trust-what-we-read",
      title: ["Can We Trust What We Read?", "我们能相信读到的东西吗？"],
      body: `Every day we read hundreds of claims: on the news, on social media, in messages from friends. Some are true, some are false, and many are a mix of both. How can we decide what to trust?

Students at a school in Canada were asked to check ten stories that they had seen online. Their teacher, Ms. Carter, gave them three questions to ask about each one.

The first question is: who is telling me this? Is the source a reliable newspaper, a scientist, a government office, or a stranger with no name? A source with a name and a history is usually more accurate, because it has a good name to protect.

The second question is: what is the evidence? A good article tells you where its facts come from. It may mention a study, use the words of an official or show a document. If a story says "people are saying" or "everyone knows", but gives no evidence, be careful.

The third question is: what do other sources say? If a story is true and important, other newspapers and channels will report it too. If only one website has it, it may be a rumor.

The results surprised the students. Of the ten stories, four were false and three were only half true. One student, Ethan, told the class that he had already shared two of the false stories with his friends. "I felt a bit embarrassed," he said. "They looked totally real."

Ms. Carter said that this was exactly the point. "Nobody can know everything," she told them. "But everyone can learn to ask good questions. That is the best way to protect ourselves."`,
      grammar: [reported],
      names: ["Canada", "Ms", "Carter", "Ethan"],
      questions: [
        [
          ["Why is a source with a name and a history usually more accurate?", "为什么有名字和历史的来源通常更准确？"],
          ["It has a good name to protect", "它有声誉需要维护"],
          [
            ["It always writes long articles", "它总是写长文章"],
            ["It never shares anything on social media", "它从不在社交媒体上分享任何东西"],
          ],
          [
            '"A source with a name and a history is usually more accurate, because it has a good name to protect."',
            "有名有姓、有历史的来源要维护自己的声誉，所以更可能准确。",
          ],
        ],
        [
          ["What should make you careful about a story?", "什么样的报道应该让你提高警惕？"],
          ['It says "everyone knows" but gives no evidence', "它说“大家都知道”却不给证据"],
          [
            ["It mentions a study", "它提到了一项研究"],
            ["Many newspapers report it", "很多报纸都报道了"],
          ],
          [
            "\"If a story says 'people are saying' or 'everyone knows', but gives no evidence, be careful.\"",
            "没有证据、只说“大家都在说”的报道要小心；提到研究和多家机构报道反而是可信的迹象。",
          ],
        ],
        [
          ["What did Ethan tell the class?", "伊森对全班说了什么？"],
          ["That he had already shared two false stories", "他已经分享过两条假新闻"],
          [
            ["That all ten stories were true", "十条新闻全是真的"],
            ["That he never reads news online", "他从不在网上看新闻"],
          ],
          [
            'Reported speech: "Ethan told the class that he had already shared two of the false stories with his friends."',
            "这是间接引语，原话 I have shared 转述时变成了 he had shared。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-media-the-witness",
      title: ["The Witness", "目击者"],
      body: `It was a cold evening in November, and Ana Silva was waiting for the bus outside a small shop that sold gold and silver. Suddenly the door of the shop opened, and a young man ran out with a bag in his hand. Behind him, the shop owner was shouting, "Stop! Thief!"

The man ran past Ana so close that she could see his face. He jumped onto a motorbike that was waiting at the corner and disappeared into the traffic. The whole thing took less than ten seconds.

Ana called the police. When an officer arrived, he asked her what she had seen. She told him that the man was tall and thin, that he was wearing a gray jacket, and that he had a long mark on his neck. She said that the motorbike was red. The officer wrote everything down and thanked her.

Two weeks later, the police arrested a man. A month after that, Ana received a letter: she was asked to be a witness in court. She felt very nervous. In the court, the lawyer for the arrested man asked her many questions. Was it dark? Was she sure about the mark? How could she remember a face she had seen for only a few seconds?

Ana told the truth. She said that it had been dark, but she said that the shop window was bright and that she had seen his face clearly. "I am certain about the mark," she said.

The judge also heard other evidence: the motorbike, the bag and a video from a camera in the street. In the end the man was sent to prison for two years.

"I almost didn't call the police that night," Ana says now. "I'm glad I did. If witnesses stay quiet, thieves win."`,
      grammar: [reported],
      names: ["Ana", "Silva"],
      questions: [
        [
          ["What did Ana tell the police officer?", "安娜告诉警察什么？"],
          ["That the man was tall and thin with a mark on his neck", "那个人又高又瘦，脖子上有一道痕迹"],
          [
            ["That the man had a red car", "那个人有一辆红色的汽车"],
            ["That she knew the man's name", "她知道那个人的名字"],
          ],
          [
            'Reported speech: "She told him that the man was tall and thin, that he was wearing a gray jacket, and that he had a long mark on his neck." The motorbike, not a car, was red.',
            "间接引语：她说那人高瘦、穿灰夹克、脖子上有痕迹；红色的是摩托车而不是汽车。",
          ],
        ],
        [
          ["What did the lawyer for the arrested man try to show?", "被告的律师想证明什么？"],
          ["That Ana could not be sure of what she had seen", "安娜不能确定自己看到了什么"],
          [
            ["That Ana was the thief", "安娜才是小偷"],
            ["That the shop was closed that evening", "那天晚上商店关门了"],
          ],
          [
            "The lawyer asked whether it was dark and how she could remember a face seen for only a few seconds: he wanted to show she might be wrong.",
            "律师追问天是否黑、她怎能记住只看了几秒的脸，想让人怀疑她的证词。",
          ],
        ],
        [
          ["What does Ana say about witnesses?", "安娜怎样看待目击者？"],
          ["If they stay quiet, thieves win", "如果目击者保持沉默，小偷就赢了"],
          [
            ["They should never go to court", "他们永远不应该出庭"],
            ["They always remember faces wrongly", "他们总是记错别人的脸"],
          ],
          [
            'Ana says: "If witnesses stay quiet, thieves win." She is glad she called the police.',
            "安娜很庆幸自己报了警，她认为目击者沉默就是让小偷得逞。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-media-voting-for-the-first-time",
      title: ["Voting for the First Time", "第一次投票"],
      body: `Last month I turned eighteen, and on Sunday I voted for the first time in a national election. I want to share what it was like, because I know many young people think voting doesn't matter.

To be honest, I almost didn't vote. A few weeks before the election, I told my friend Jake that I didn't know enough about politics. He said that nobody knew everything, and that I should just find out about the most important questions. So I did.

I started by making a list of the things I care about most: the cost of university, jobs for young people and the environment. Then I looked at what each party had promised. I watched two debates on TV and read articles from different newspapers, because I wanted more than one opinion. I also used a website that asks you questions and shows which candidates agree with you. The results surprised me: the party I liked at first was not the nearest to my own views.

My grandmother was very excited for me. She told me that when she was young, women in her village had to work hard for the right to vote. "Never waste your vote," she said.

On Sunday morning I went to the school near my house. I showed my passport, received a paper with the names of the candidates and went to a small table on my own. I put a mark next to the name I had chosen and put the paper in a box. It took three minutes.

My candidate didn't win. But I am not sorry I voted. I expressed my opinion, and I was part of something bigger than myself. Next time I will definitely vote again, and I will try to persuade my friends to vote too.`,
      grammar: [reported],
      names: ["Jake"],
      questions: [
        [
          ["What did Jake tell the writer?", "杰克对作者说了什么？"],
          ["That nobody knew everything and she should learn about the most important questions", "没人什么都懂，她只需了解最重要的问题"],
          [
            ["That voting doesn't matter", "投票没有意义"],
            ["That she should vote for his party", "她应该投他支持的党"],
          ],
          [
            'Reported speech: "He said that nobody knew everything, and that I should just find out about the most important questions."',
            "这是间接引语：杰克说没人什么都懂，她只要去了解主要议题就行。",
          ],
        ],
        [
          ["What surprised the writer?", "什么让作者感到意外？"],
          ["The party she liked at first was not the nearest to her views", "她最初喜欢的党并不是和她观点最接近的"],
          [
            ["The debates on TV were very short", "电视辩论很短"],
            ["Her grandmother had never voted", "她的祖母从未投过票"],
          ],
          [
            'After using the website, "the party I liked at first was not the nearest to my own views".',
            "通过网站的问答，她发现自己起初喜欢的党与自己的观点并不最接近。",
          ],
        ],
        [
          ["How does the writer feel after the election?", "选举后作者感觉如何？"],
          ["Not sorry, even though her candidate lost", "尽管她支持的候选人输了，她也不后悔"],
          [
            ["Sorry that she voted", "后悔投了票"],
            ["Happy because her candidate won", "很高兴，因为她支持的候选人赢了"],
          ],
          [
            '"My candidate didn\'t win. But I am not sorry I voted." She will vote again and persuade her friends.',
            "她支持的候选人没赢，但她不后悔投票，下次还要投，并劝朋友们也去投。",
          ],
        ],
      ],
    }),
  ],
};
