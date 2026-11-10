// The reading unit of the B1 theme Technology in Our Lives: phones, drones, scams, data, robots, screens and inventions.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { readingWords } from "./reading-words.ts";

const conditional = "second-conditional";
const relative = "relative-clauses";

const passage = passageMaker(readingWords, [
  "b1-words-digital",
  "b1-words-online-safety",
  "b1-words-research-and-design",
  "b1-words-gadgets",
  "b1-words-tech-verbs",
  "b1-words-tech-problems",
  conditional,
  relative,
]);

/** readingTechnology is the reading unit of the theme Technology in Our Lives. */
export const readingTechnology: ReadingUnitDef = {
  id: "b1-reading-technology",
  title: t("Technology in Our Lives", "生活中的科技"),
  passages: [
    passage({
      id: "b1-technology-a-week-without-a-smartphone",
      title: ["A Week Without a Smartphone", "没有智能手机的一周"],
      body: `Last month our teacher asked us a question: "If you didn't have a smartphone for a week, what would happen?" Most of us laughed. Then she suggested an experiment. Anyone who wanted could put their phone in a box in her office for seven days. Eight of us agreed. This is what I wrote each day.

Monday. I woke up late, because my phone is also my clock. I borrowed an old clock from my grandmother. On the bus I didn't know what to do with my hands. I kept putting my hand in my pocket for a phone that wasn't there.

Tuesday. I felt anxious all day. What if my friends were messaging me? What if something important was happening? I realized that I usually check my phone more than a hundred times a day, often for no reason.

Wednesday. Something changed. On the bus I looked out of the window and noticed a park I had never seen before, although I have taken that bus for three years. In the evening I read a book for two hours. I can't remember the last time I did that.

Thursday. I had to call my mother from a phone at school, and I realized that I didn't know her number. I felt embarrassed.

Friday and Saturday. I met my friends in person instead of chatting online. We talked much more than we usually do, because nobody was looking at a screen.

Sunday. I got my phone back. It had two hundred messages, and almost all of them were not important.

Would I live without a smartphone? Probably not. It is too useful. But I have made some rules. My phone now stays outside my bedroom at night, and I turn off most of its sounds. Without the experiment, I would never have noticed how much it controlled me.`,
      grammar: [conditional, relative],
      questions: [
        [
          ["How did the writer feel on Tuesday?", "作者星期二感觉如何？"],
          ["Anxious, worrying about missing messages", "焦虑，担心错过消息"],
          [
            ["Relaxed, reading a book for hours", "放松，读了几个小时书"],
            ["Happy, meeting friends in person", "开心，和朋友们见面"],
          ],
          [
            'On Tuesday the writer "felt anxious all day", asking what would happen if friends were messaging. Reading and meeting friends came later in the week.',
            "星期二作者一整天都很焦虑；读书和见朋友是后来几天的事。",
          ],
        ],
        [
          ["What did the writer notice on Wednesday?", "作者星期三注意到了什么？"],
          ["A park that they had never seen from the bus", "一个从未在公交车上注意到的公园"],
          [
            ["Their mother's phone number", "妈妈的电话号码"],
            ["Two hundred new messages", "两百条新消息"],
          ],
          [
            'On the bus the writer "noticed a park I had never seen before, although I have taken that bus for three years".',
            "坐了三年的公交车，作者第一次注意到窗外的公园，因为这次没有低头看手机。",
          ],
        ],
        [
          ["What rule has the writer made after the experiment?", "实验之后作者定了什么规矩？"],
          ["The phone stays outside the bedroom at night", "晚上手机放在卧室外面"],
          [
            ["The writer never uses a smartphone now", "作者现在再也不用智能手机了"],
            ["The phone stays in the teacher's office", "手机放在老师办公室里"],
          ],
          [
            '"My phone now stays outside my bedroom at night, and I turn off most of its sounds." The writer still uses it, because it is useful.',
            "作者仍然使用手机，但晚上不放在卧室，并关掉了大部分通知。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-technology-how-drones-deliver",
      title: ["How Drones Deliver", "无人机是怎样送货的"],
      body: `In a small village in the mountains, a nurse hears a soft sound in the sky. A few seconds later, a white drone stops above the clinic and drops a small box onto the ground near the door. Inside the box there is blood for a woman who has just had a baby. By road, the blood would take three hours to arrive. The drone took twenty minutes.

Drones are small flying machines that are controlled by computers. Most drones that deliver things look like small planes or have four to eight small wings that turn. They carry boxes of up to a few kilos, and they can fly for about a hundred kilometers before their batteries need charging.

Each trip starts at a center that receives orders by phone or online. A worker puts the box in the drone, and the computer plans the way. During the flight, the drone uses signals from space to know where it is, and cameras to avoid birds, trees and other drones. When it arrives, it either lands or drops the box. Then it flies back on its own.

Drones are already used to deliver medicine, blood and vaccines to places that are difficult to get to. Some companies are also trying drones that deliver food and shopping to homes in cities.

But there are problems too. Many people don't like the noise of drones, and some worry about privacy, because drones have cameras. Drones cannot fly in strong winds or heavy rain. In cities, governments must also decide where drones are allowed to fly, so that they do not crash into houses or planes.

If these problems were solved, the sky above our streets might soon be full of small flying machines. Would you like to receive your lunch from the sky?`,
      grammar: [conditional, relative],
      questions: [
        [
          ["Why was the drone useful for the village clinic?", "无人机对村里的诊所有什么用？"],
          ["It brought blood much faster than a car", "它送血比汽车快得多"],
          [
            ["It took the woman to a hospital", "它把那位妇女送到医院"],
            ["It brought a doctor to the village", "它把医生带到了村里"],
          ],
          [
            '"By road, the blood would take three hours to arrive. The drone took twenty minutes."',
            "走公路要三个小时，无人机只用了二十分钟。",
          ],
        ],
        [
          ["How does a drone avoid birds and trees?", "无人机怎样避开鸟和树？"],
          ["It uses cameras", "它使用摄像头"],
          [
            ["A pilot controls it from the clinic", "诊所里的飞行员操纵它"],
            ["It flies only at night", "它只在夜里飞"],
          ],
          [
            'During the flight the drone uses signals from space to know where it is, "and cameras to avoid birds, trees and other drones".',
            "无人机用来自太空的信号定位，用摄像头避开障碍。",
          ],
        ],
        [
          ["Which is a problem with drones, according to the passage?", "根据文章，无人机有什么问题？"],
          ["They cannot fly in strong winds or heavy rain", "它们不能在大风或大雨中飞行"],
          [
            ["They can carry only letters", "它们只能运送信件"],
            ["They are too slow for medicine", "它们运送药品太慢了"],
          ],
          [
            "The passage mentions noise, privacy, bad weather and where drones may fly in cities.",
            "文章提到的问题包括噪音、隐私、恶劣天气以及城市里允许飞行的区域。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-technology-the-scam-email",
      title: ["The Scam Email", "诈骗邮件"],
      body: `It was a Tuesday evening when Mr. Patel, who is seventy-two, received an email from his bank. At least, it looked like an email from his bank. It had the name and colors of the bank, and it began: "Dear customer, we have noticed a problem with your account. To protect your money, please click the link below within 24 hours and check your personal information."

Mr. Patel was worried. He had worked hard for his money, and he did not want to lose it. He clicked the link, which took him to a website that looked exactly like the real website of his bank. It asked for his username, his password and the number of his bank card. He typed them in.

The next morning he looked at his account. Almost three thousand dollars had disappeared.

Mr. Patel had been the victim of a scam called phishing. Thieves send thousands of fake emails that copy real companies, and they hope that a few people will believe them. The emails often try to make you afraid or excited: your account will be closed, you have won a prize, a gift is waiting for you.

How can you protect yourself? First, banks never ask for your password by email. Second, look carefully at the address that the email came from, which often looks wrong or is full of numbers. Third, don't click links in messages that you did not expect. If you are worried, call your bank on the number on your card.

The story of Mr. Patel has a happy ending. He called his bank at once, and because he was quick, he got most of his money back. Now he gives talks at the local library about online security. "If it happened to me," he says, "it could happen to anyone."`,
      grammar: [relative, conditional],
      names: ["Mr", "Patel"],
      glossed: ["phishing"],
      questions: [
        [
          ["Why did Mr. Patel click the link?", "帕特尔先生为什么点击了链接？"],
          ["He was worried about losing his money", "他担心失去自己的积蓄"],
          [
            ["He wanted to win a prize", "他想赢得奖品"],
            ["His son told him to do it", "他儿子让他这样做"],
          ],
          [
            'The email said there was a problem with his account, and "he did not want to lose" the money he had worked hard for.',
            "邮件说他的账户有异常，他害怕辛苦攒下的钱被盗，于是点了链接。",
          ],
        ],
        [
          ["What is phishing?", "什么是网络钓鱼？"],
          ["Sending fake emails that copy real companies", "发送冒充真实公司的假邮件"],
          [
            ["A way to protect your bank account", "一种保护银行账户的方法"],
            ["A program that finds viruses", "一种查找病毒的程序"],
          ],
          [
            '"Thieves send thousands of fake emails that copy real companies, and they hope that a few people will believe them."',
            "骗子群发冒充真实公司的假邮件，希望有人上当。",
          ],
        ],
        [
          ["What should you do if a message about your bank worries you?", "如果一条关于银行的消息让你担心，应该怎么做？"],
          ["Call the bank on the number on your card", "拨打银行卡上的电话联系银行"],
          [
            ["Click the link quickly", "赶快点击链接"],
            ["Reply with your password", "回复你的密码"],
          ],
          [
            '"If you are worried, call your bank on the number on your card." Banks never ask for your password by email.',
            "银行从不通过邮件索要密码；担心时应拨打卡上的官方电话。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-technology-who-owns-your-data",
      title: ["Who Owns Your Data?", "你的数据归谁所有？"],
      body: `Every time you search for something, watch a video or buy something online, you leave information behind. The websites and apps that you use collect this data: what you like, where you are, who your friends are, how long you look at each picture. But who owns this data, and what happens to it?

Many apps that millions of people use are free. But as people in technology often say, "If you are not paying for the product, you are the product." Companies earn money by using your data to show you advertisements that match what you like. If you have searched for running shoes, you will see advertisements for running shoes for weeks. Some companies also sell data to other businesses.

Most of us agree to this without thinking. When we install an app, we click "I agree" without reading the long document that explains how our data will be used. One study found that reading all the privacy documents that a normal person agrees to in a year would take about seventy-six working days.

Is this a problem? Some people say that they have nothing to hide. But data can be used in ways that we don't expect. Insurance companies might charge more to people whose data shows habits that are bad for health. Hackers can steal data and use it to steal identities. And information that is shared today may still be online in twenty years.

In some parts of the world, new laws give people more control. They can ask a company what data it keeps about them, and they can ask it to delete that data. But laws can only do so much. The simplest way to protect ourselves is to think before we share, check the settings of our apps, and ask ourselves whether a free app is really free.`,
      grammar: [relative, conditional],
      questions: [
        [
          ["How do many free apps earn money?", "很多免费应用是怎样赚钱的？"],
          ["By using your data to show you advertisements", "利用你的数据向你展示广告"],
          [
            ["By charging you every month", "每月向你收费"],
            ["By deleting your data", "删除你的数据"],
          ],
          [
            '"Companies earn money by using your data to show you advertisements that match what you like." Some also sell data.',
            "公司利用你的数据推送符合你兴趣的广告来赚钱，有的还出售数据。",
          ],
        ],
        [
          ["What does the study about privacy documents show?", "关于隐私条款的研究说明了什么？"],
          ["They are far too long for most people to read", "条款太长，大多数人根本读不完"],
          [
            ["Most people read them very carefully", "大多数人都读得很仔细"],
            ["They are shorter than a page", "它们不到一页长"],
          ],
          [
            'Reading all the privacy documents a normal person agrees to in a year "would take about seventy-six working days".',
            "一个人一年同意的隐私条款要读七十六个工作日，所以大家都不读就点同意。",
          ],
        ],
        [
          ["What can people do under the new laws?", "根据新的法律，人们可以做什么？"],
          ["Ask a company to delete their data", "要求公司删除他们的数据"],
          [
            ["Sell their data to hackers", "把数据卖给黑客"],
            ["Use apps without any settings", "使用没有任何设置的应用"],
          ],
          [
            'Under the new laws people "can ask a company what data it keeps about them, and they can ask it to delete that data".',
            "新法律让人们可以查询公司保存了哪些数据，并要求删除。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-technology-the-robot-in-the-laboratory",
      title: ["The Robot in the Laboratory", "实验室里的机器人"],
      body: `At three o'clock in the morning, the university laboratory is dark and quiet, but one machine is still working. It is a robot called Ada, with two long arms that move small glass bottles from one place to another, add tiny amounts of different materials and measure the results. Ada has been working for nineteen hours without a break.

Dr. Lena Fischer, the scientist who designed the program for Ada, is trying to develop a new material for batteries. To find the best one, her team has to test thousands of different mixes. "If people did this work by hand, it would take us ten years," she says. "Ada can do it in a few months."

Robots like Ada are changing scientific research. They don't get tired, they don't get bored, and they repeat every experiment in exactly the same way. They also record every result without help, so data is never lost or written down wrong. Some robots can now decide which experiment to do next, using the results of the last one.

Does this mean that scientists will lose their jobs? Dr. Fischer doesn't think so. "Ada is very good at doing the same thing many times," she says. "But she can't ask an interesting question. She can't notice something unexpected. Most important discoveries in history came from people who noticed something unexpected."

She also says that robots make research more fun. Young scientists used to spend months on boring, repeated tasks. Now they can spend their time on thinking and planning.

"If I had to choose between Ada and a good student," Dr. Fischer laughs, "I would choose the student. But I'm lucky. I don't have to."`,
      grammar: [conditional, relative],
      names: ["Ada", "Dr", "Lena", "Fischer"],
      questions: [
        [
          ["Why does Dr. Fischer's team use a robot?", "费舍尔博士的团队为什么使用机器人？"],
          ["It can test thousands of mixes much faster than people", "它测试几千种混合物比人快得多"],
          [
            ["Nobody in the team can do experiments", "团队里没人会做实验"],
            ["The robot asks interesting questions", "机器人会提出有趣的问题"],
          ],
          [
            '"If people did this work by hand, it would take us ten years. Ada can do it in a few months."',
            "第二条件句：如果靠人工做，要十年；机器人几个月就能完成。",
          ],
        ],
        [
          ["What can Ada NOT do, according to Dr. Fischer?", "根据费舍尔博士的说法，阿达不能做什么？"],
          ["Notice something unexpected", "注意到出乎意料的现象"],
          [
            ["Repeat an experiment in the same way", "以同样的方式重复实验"],
            ["Record the results of experiments", "记录实验结果"],
          ],
          [
            "Dr. Fischer says Ada \"can't ask an interesting question. She can't notice something unexpected.\"",
            "机器人擅长重复和记录，却不会提出有趣的问题，也不会发现意外的奇怪现象。",
          ],
        ],
        [
          ["How have robots changed the work of young scientists?", "机器人怎样改变了年轻科学家的工作？"],
          ["They spend more time thinking and planning", "他们有更多时间思考和计划"],
          [
            ["They have all lost their jobs", "他们都失去了工作"],
            ["They spend months on boring tasks", "他们花几个月做无聊的工作"],
          ],
          [
            '"Young scientists used to spend months on boring, repeated tasks. Now they can spend their time on thinking and planning."',
            "以前年轻科学家要花几个月做重复的工作，现在可以把时间用在思考和计划上。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-technology-teenagers-and-screen-time",
      title: ["Teenagers and Screen Time", "青少年与屏幕时间"],
      body: `In many countries, young people between thirteen and eighteen spend seven hours or more a day looking at screens, and that is without homework. They watch videos, play games, chat with friends and look through social media. Many parents are worried. Is all this screen time bad for them?

The answer is not simple. Research suggests that what young people do on screens matters more than how many hours they spend. Talking to friends, learning a new skill or making music can be positive. Looking for hours at photos of other people who seem to have better lives, on the other hand, can make young people feel anxious or sad about themselves.

Sleep is one area where scientists agree. Many young people use their phones in bed until late at night. The light from screens tells the brain that it is still day, so it becomes harder to sleep. Young people who sleep with their phones in their bedrooms sleep less and feel more tired at school.

Some apps are also designed to keep us using them. They send messages all the time, show one video after another and give us likes. This is why it can be so hard to stop. Some young people say they feel addicted.

So what can families do? Doctors suggest making rules together instead of just banning devices. For example, no phones at dinner, and all devices out of the bedroom an hour before sleep. Parents can help by following the same rules themselves.

Mia, who is sixteen, told me that her family had tried this. "At first I didn't like it at all," she said. "But now I sleep better, and we actually talk at dinner. If my parents had not done it with me, I wouldn't have agreed."`,
      grammar: [conditional, relative],
      names: ["Mia"],
      questions: [
        [
          ["What matters more than the number of hours, according to research?", "研究认为，什么比时长更重要？"],
          ["What young people do on screens", "年轻人在屏幕上做什么"],
          [
            ["Which device they use", "他们用的是什么设备"],
            ["How expensive their phone is", "他们的手机有多贵"],
          ],
          [
            '"Research suggests that what young people do on screens matters more than how many hours they spend."',
            "研究表明，在屏幕上做什么比花多少时间更重要。",
          ],
        ],
        [
          ["Why do screens make it harder to fall asleep?", "为什么屏幕会让人更难入睡？"],
          ["Their light tells the brain that it is still day", "屏幕的光让大脑以为还是白天"],
          [
            ["They are too loud at night", "它们夜里太吵"],
            ["They use too much electricity", "它们用电太多"],
          ],
          [
            '"The light from screens tells the brain that it is still day, so it becomes harder to sleep."',
            "屏幕的光让大脑误以为还是白天，所以更难入睡。",
          ],
        ],
        [
          ["What does Mia say about her family's rules?", "米娅怎样评价她家的规定？"],
          ["She didn't like them at first, but now she sleeps better", "她起初很不喜欢，但现在睡得更好了"],
          [
            ["She still refuses to follow them", "她仍然拒绝遵守"],
            ["Her parents did not follow them", "她的父母自己不遵守"],
          ],
          [
            'Mia said: "At first I didn\'t like it at all. But now I sleep better, and we actually talk at dinner." Her parents followed the rules with her.',
            "米娅起初讨厌这些规定，但现在睡得更好，晚饭时一家人也会聊天；她父母也和她一起遵守。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-technology-the-day-the-internet-stopped",
      title: ["The Day the Internet Stopped", "互联网停止的那一天"],
      body: `On a Thursday morning last spring, the people of a small island woke up and discovered that the internet was not working. Their phones showed no signal. Their computers were offline. At first everyone thought it was a small problem that would be fixed in a few minutes. It went on for four days.

The island was connected to the rest of the world by one cable that lay on the floor of the sea. During the night, the anchor of a large ship had cut it. A repair ship had to come from another country, and the work took days.

The effects were felt everywhere. Shops could not take cards, so people waited for hours at the only bank to get cash, until the machine was empty. Hotels could not receive orders from guests. Students could not access their online lessons. The hospital could still operate, but doctors could not send x-rays to specialists in other countries. Some people could not even call their families, because their phones depended on the internet for calls.

But people also remember those days with a smile. Neighbors who had never spoken to each other met in the streets to share news. The coffee shop on the square, which had an old radio, became the center of the island. Children played football on the beach instead of games on their tablets.

When the connection came back on Monday morning, the island celebrated. But the government also learned a lesson. It has now asked for a second cable, so that if one is damaged, the island will stay online. "We didn't realize how much we relied on one cable," said an official. "If it happened again, we would be ready."`,
      grammar: [conditional, relative],
      glossed: ["anchor"],
      questions: [
        [
          ["Why did the internet stop on the island?", "岛上的互联网为什么中断了？"],
          ["A ship cut the cable on the floor of the sea", "一艘船弄断了海底的电缆"],
          [
            ["A storm destroyed the computers", "暴风雨毁坏了电脑"],
            ["The government turned it off", "政府把它关掉了"],
          ],
          [
            '"During the night, the anchor of a large ship had cut it." The island had only one cable.',
            "一艘大船的锚在夜里切断了海底电缆，而岛上只有这一条电缆。",
          ],
        ],
        [
          ["Why did people wait at the bank?", "人们为什么在银行排队？"],
          ["Shops could not take cards, so they needed cash", "商店不能刷卡，他们需要现金"],
          [
            ["The bank was giving away free money", "银行在免费发钱"],
            ["They wanted to call their families", "他们想给家人打电话"],
          ],
          [
            '"Shops could not take cards, so people waited for hours at the only bank to get cash."',
            "断网后商店不能刷卡，人们只好去唯一的银行取现金。",
          ],
        ],
        [
          ["What has the government done since then?", "从那以后政府做了什么？"],
          ["Asked for a second cable", "申请铺设第二条电缆"],
          [
            ["Banned the internet on the island", "在岛上禁止使用互联网"],
            ["Built a new hospital", "建了一所新医院"],
          ],
          [
            'The government "has now asked for a second cable, so that if one is damaged, the island will stay online".',
            "政府申请铺设第二条电缆，这样一条坏了岛上仍能联网。",
          ],
        ],
      ],
    }),
    passage({
      id: "b1-technology-inventing-the-headphone",
      title: ["Inventing the Headphone", "耳机的发明"],
      body: `Today headphones are everywhere: on the bus, in the gym, in the office. They are small, wireless and often cheap. But the story of the first headphones that people could buy begins more than a hundred years ago, at a kitchen table in Utah, in the United States.

Nathaniel Baldwin was a young man who was interested in electricity and sound. Around 1910 he wanted to make a better way to listen to the radio, which was very quiet in those days. Working at home, without a laboratory or any money, he built a pair of headphones from metal and an old radio part. They were heavy and hurt the ears, but they made the sound much louder and clearer than anything else at the time.

Baldwin sent his headphones to the US Navy. At first nobody answered. But when the navy finally tried them, they were very surprised. The navy, which needed good equipment for its ships, ordered a hundred pairs. Baldwin made them by hand in his kitchen, and later in a small factory.

But Baldwin was a better inventor than businessman. He didn't protect his design, so other companies soon copied it, and he lost most of his money.

For many years headphones were used almost only by pilots and radio workers. Only about forty years ago, when small music players that you could carry came out, did they become part of the lives of normal people. Since then they have become smaller, cheaper and better. Some can now stop outside noise, check your heart or change one language into another.

If Baldwin could see the headphones of today, he would probably be very surprised. But the idea, sound close to the ear, is still the one he built at his kitchen table.`,
      grammar: [conditional, relative],
      names: ["Utah", "United", "States", "Nathaniel", "Baldwin", "US", "Navy"],
      questions: [
        [
          ["Why did Baldwin want to make headphones?", "鲍德温为什么想制作耳机？"],
          ["The radio was very quiet in those days", "那时的收音机声音很小"],
          [
            ["He wanted to sell music players", "他想卖音乐播放器"],
            ["The navy asked him to make them", "海军让他制作"],
          ],
          [
            '"He wanted to make a better way to listen to the radio, which was very quiet in those days." The navy became interested later.',
            "当时收音机声音很小，他想找到更好的收听方式；海军是后来才感兴趣的。",
          ],
        ],
        [
          ["Why did Baldwin lose most of his money?", "鲍德温为什么失去了大部分钱？"],
          ["He didn't protect his design, and other companies copied it", "他没有保护自己的设计，其他公司仿制了它"],
          [
            ["The navy never paid him", "海军从未付钱给他"],
            ["His factory was destroyed by a fire", "他的工厂被大火烧毁"],
          ],
          [
            '"He didn\'t protect his design, so other companies soon copied it, and he lost most of his money."',
            "他发明能力强，却不善经营，没保护设计，结果被别人仿制。",
          ],
        ],
        [
          ["When did headphones become part of everyday life?", "耳机什么时候成为日常生活的一部分？"],
          ["When small music players that you could carry came out", "便携式音乐播放器出现的时候"],
          [
            ["As soon as Baldwin built the first pair", "鲍德温一造出第一副耳机就是"],
            ["When the navy ordered a hundred pairs", "海军订购一百副的时候"],
          ],
          [
            'For many years almost only pilots and radio workers used them. "Only about forty years ago, when small music players that you could carry came out, did they become part of the lives of normal people."',
            "很长时间里只有飞行员和无线电员使用耳机，直到大约四十年前便携式播放器出现才普及。",
          ],
        ],
      ],
    }),
  ],
};
