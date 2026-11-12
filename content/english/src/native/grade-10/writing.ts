// Grade 10: writing skills checked by rule: an objective tone, a theme stated as a complete idea, and qualifications
// shown with evidence.

import type { TopicDef } from "@ga/content";
import { choose, type Label, label, topic } from "../grade-6/kit.ts";

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

const objective = topic("writing", {
  id: "keeping-an-objective-tone",
  title: ["Keeping an Objective Tone", "保持客观的语气"],
  summary: [
    "Writing a report or an explanation in an objective tone: facts and attributed claims instead of personal feelings, loaded words and exaggeration.",
    "用客观的语气写报道或说明文：用事实和注明出处的说法，而不是个人感受、带感情色彩的词语和夸张。",
  ],
  after: ["formal-style", "facts-interpretations-and-judgments"],
  points: [
    choose(
      "the-objective-sentence",
      ["The Objective Sentence", "客观的句子"],
      [
        "In a news report, a research report or an explanation, the writer stays in the background. An **objective** sentence states facts or reports who claimed what: *The council voted 7 to 2 to close the pool. Residents' groups called the decision unfair.* It avoids **personal feelings** (*I was shocked*), **loaded words** (*the outrageous decision*) and **exaggeration** (*the worst decision in history*). Objective does not mean dull: precise facts can be as powerful as opinions.",
        "在新闻报道、研究报告或说明文中，作者退居幕后。**客观**的句子陈述事实，或报道谁说了什么：*The council voted 7 to 2 to close the pool. Residents' groups called the decision unfair.* 它避免**个人感受**（*I was shocked*）、**带感情色彩的词语**（*the outrageous decision*）和**夸张**（*the worst decision in history*）。客观并不意味着枯燥：精确的事实可以和观点一样有力。",
      ],
      ["Which sentence keeps an objective tone?", "哪个句子保持了客观的语气？"],
      `
        A report on a school decision|The school board voted to start classes at 9 a.m. instead of 8 a.m.|I was so happy and relieved when the board finally decided to let all of us sleep a little later.|The board made the greatest decision in the history of education.
        A report on a storm|The storm brought down power lines across three districts.|I have honestly never been so scared in my whole life as I was during that terrible storm.|The storm destroyed absolutely everything in the whole city.
        A report on a new law|The law requires restaurants to list calories on their menus.|Personally, I think counting calories at every meal is annoying, pointless and a waste of everyone's time.|The law will completely end obesity forever.
        A report on a sports result|The home team lost 3 to 0 in front of 20,000 fans.|We were all heartbroken by the team's humiliating defeat.|It was the most shameful loss any team has ever suffered.
        A report on a scientific finding|The study found that the drug lowered blood pressure in 60 percent of patients.|I am amazed and delighted that scientists have finally done something truly useful for ordinary people.|The drug is a miracle that will cure every heart problem.
        A report on a protest|About 300 students gathered outside city hall to protest fee increases.|I felt proud to stand with my brave classmates.|Millions of furious students flooded the streets.
        A report on a company|The company announced that it would close two factories next year.|I find it disgusting that a company would treat workers this way.|The company has destroyed the lives of everyone in the region.
        A report on a museum|The museum reopened on Monday after a two-year renovation.|I can't wait to visit the gorgeous new galleries.|The museum is now the most beautiful building in the world.
        A report on a traffic plan|The plan would ban cars from five downtown streets on weekends.|I think most drivers will hate this silly plan, and I cannot blame them for feeling that way at all.|The plan will make traffic a thousand times worse.
        A report on a fire|Firefighters brought the blaze under control after four hours.|It broke my heart to watch the old building burn.|The fire was the most terrible disaster in human memory.
        A report on an election|The mayor was re-elected with 54 percent of the vote.|Sadly, voters chose the same tired mayor again.|The mayor won the most crushing landslide of all time.
        A report on a price increase|Bus fares will rise from 2 dollars to 2.50 dollars in March.|I honestly can't believe that they now expect all of us to pay even more money for the same bad service.|Bus fares are skyrocketing beyond anyone's reach.
        A report on an invention|The device uses sunlight to purify up to 20 liters of water a day.|I think this clever little gadget is absolutely wonderful, and I hope that everyone gets the chance to own one.|The device will end thirst on the planet forever.
        A report on a school survey|In the survey, 62 percent of students said they slept less than seven hours.|It worries me that my friends are so tired all the time.|Every single student in the country is exhausted.
        A report on a park|The city plans to plant 500 trees in the park by next spring.|I love trees more than anything, so this is easily the best news that I have heard all year long.|The park will become the greenest place on Earth.
        A report on a strike|Train drivers began a two-day strike on Tuesday over pay.|I feel sorry for the passengers stuck because of the selfish drivers.|The strike has brought the entire nation to a total standstill.
        A report on a library|The library will extend its opening hours to 10 p.m. on weekdays.|I am thrilled about this, because the library has always been my favorite place in the whole town.|The library will now be open almost all the time.
        A report on a medical study|Researchers followed 1,200 adults for ten years.|I personally admire these patient researchers.|Researchers followed basically everyone for an eternity.
        A report on a concert|The concert raised 40,000 dollars for the children's hospital.|I cried when I heard how generous everyone was.|The concert raised an unbelievable fortune.
        A report on a road accident|Two people were injured when a truck struck a bus on Highway 9.|I think truck drivers are the most careless people on the road.|The crash was a scene of total horror and endless chaos.
        A report on a debate|Both candidates answered questions on housing and transport.|I thought that one of the candidates was much more likeable and honest than the other one was.|The debate was the most boring event ever held.
        A report on a zoo|The zoo welcomed a newborn giraffe on Friday.|I personally think that baby giraffes are the cutest and most wonderful animals alive anywhere.|The baby giraffe has become the most famous animal in history.
        A report on unemployment|Unemployment fell from 6.1 percent to 5.8 percent.|I am relieved that things are finally getting better.|Unemployment has practically disappeared.
        A report on a festival|About 15,000 people attended the three-day festival.|I had the time of my life dancing at the festival.|The whole world came to the festival.
        A report on a court ruling|The court ruled that the company must pay a fine of 2 million dollars.|In my view, the fine was far too small.|The court destroyed the company with a giant fine.
        A report on a new phone|The phone has a battery that lasts about two days.|I think the phone is beautiful, and I really want to buy one as soon as I have saved enough money.|The battery basically lasts forever.
        A report on a river cleanup|Volunteers removed two tons of rubbish from the river on Saturday.|I am proud of my town's amazing volunteers.|Volunteers cleaned every bit of rubbish out of the river.
        A report on a school play|The drama club performed the play three times to full houses.|I loved every minute of the hilarious play.|The play was the greatest performance ever seen on a stage.
        A report on housing|Rents in the city rose by an average of 8 percent last year.|It is unfair that young people like me can't afford rent.|Rents have exploded to impossible levels.
        A report on a vaccine program|Clinics gave the vaccine to 30,000 children in the first month.|I am grateful to the wonderful nurses who did this.|Every child on Earth has now been vaccinated.
      `,
      (right) => [
        `"${right}" states a fact precisely, without the writer's feelings or exaggeration.`,
        `“${right}” 精确地陈述了事实，没有作者的个人感受或夸张。`,
      ],
      [
        [
          '"{wrong}" brings in the writer\'s own feelings or opinions, which do not belong in an objective report.',
          "“{wrong}”加入了作者自己的感受或看法，这些不属于客观报道。",
        ],
        [
          '"{wrong}" exaggerates or uses loaded words, so it no longer reports the facts accurately.',
          "“{wrong}”夸大其词或使用了带感情色彩的词语，因此不再准确地报道事实。",
        ],
      ],
    ),
    label(
      "fact-attributed-claim-or-opinion",
      ["Fact, Attributed Claim or the Writer's Opinion", "事实、注明出处的说法还是作者的观点"],
      [
        "An objective writer may report opinions, as long as they belong to someone else and are **attributed**: *Critics called the plan wasteful.* A **fact** can be checked: *The plan costs 3 million dollars.* The **writer's opinion** is a judgment with no source, and it does not belong in an objective report: *The plan is a waste of money.*",
        "客观的作者可以报道观点，只要这些观点属于别人，并且**注明出处**：*Critics called the plan wasteful.* **事实**是可以核实的：*The plan costs 3 million dollars.* **作者的观点**是没有出处的判断，它不属于客观报道：*The plan is a waste of money.*",
      ],
      ["What kind of statement is this?", "这是哪种陈述？"],
      `
        The bridge is 340 meters long.|a fact
        The mayor called the bridge "a symbol of our future."|an attributed claim
        The bridge is an ugly waste of money.|the writer's opinion
        The new law took effect on January 1.|a fact
        Business leaders warned that the law would cost jobs.|an attributed claim
        The new law is a disaster for the economy.|the writer's opinion
        The team has won four of its last ten games.|a fact
        The coach said the team was "on the right track."|an attributed claim
        The team is clearly heading for a terrible season.|the writer's opinion
        The study included 2,000 teenagers from six countries.|a fact
        The authors argue that social media harms sleep.|an attributed claim
        Social media is ruining a whole generation.|the writer's opinion
        The festival sold 12,000 tickets.|a fact
        Organizers described the event as "a huge success."|an attributed claim
        The festival was the best event this town has ever hosted.|the writer's opinion
        The factory employs 800 people.|a fact
        Residents complained that the factory smells of chemicals.|an attributed claim
        The factory should be closed immediately.|the writer's opinion
        The museum's ticket price rose to 15 dollars.|a fact
        Some visitors said the price was too high for families.|an attributed claim
        Fifteen dollars is a ridiculous price for a museum.|the writer's opinion
        The river rose 2 meters overnight.|a fact
        Officials said the flood defenses had worked as planned.|an attributed claim
        The flood defenses were a brilliant piece of engineering.|the writer's opinion
        The candidate received 41 percent of the vote.|a fact
        Her supporters called the result "a moral victory."|an attributed claim
        She deserved to win and was cheated by the system.|the writer's opinion
        The school day will begin at 8:45 a.m. next year.|a fact
        Several parents said the change would be hard for working families.|an attributed claim
        The new schedule is obviously better for everyone.|the writer's opinion
      `,
      {
        "a fact": L(
          "事实",
          "It can be checked, by measurement, records or counting, and it carries no judgment.",
          "它可以通过测量、记录或计数来核实，不带任何判断。",
          "It cannot simply be checked as true or false.",
          "它无法简单地核实真假。",
        ),
        "an attributed claim": L(
          "注明出处的说法",
          "It reports a judgment and says whose it is, so an objective writer may include it.",
          "它报道了一个判断，并说明这是谁的判断，所以客观的作者可以使用它。",
          "It does not say who holds the view it reports.",
          "它没有说明所报道的观点是谁的。",
        ),
        "the writer's opinion": L(
          "作者的观点",
          "It is a judgment with no source, so it is the writer's own view and breaks the objective tone.",
          "它是没有出处的判断，因此是作者自己的看法，破坏了客观的语气。",
          "It is not a judgment offered by the writer without a source.",
          "它不是作者未注明出处给出的判断。",
        ),
      },
    ),
  ],
});

const theme = topic("writing", {
  id: "stating-a-theme",
  title: ["Stating a Theme", "陈述主题"],
  summary: [
    "Writing a theme as a complete, arguable idea about life that the text supports, rather than a single word, a plot summary or a command.",
    "把主题写成文本所支持的、关于人生的完整而可论证的观点，而不是一个单词、情节概要或命令句。",
  ],
  after: ["how-a-theme-develops", "an-analytical-thesis"],
  points: [
    label(
      "is-it-a-theme-statement",
      ["Is It a Theme Statement?", "这是主题陈述吗？"],
      [
        "A **theme statement** is a complete sentence that says what a text suggests about life: *Ambition that ignores conscience destroys the person it drives.* It is not a **topic word**, which names a subject but says nothing about it (*ambition*). It is not a **plot summary**, which tells what happens to particular characters (*Macbeth kills the king to become king*). And it is not a **command or cliché**, which preaches a moral or repeats a tired saying (*Never be too ambitious*; *Crime does not pay*).",
        "**主题陈述**是一个完整的句子，说明文本对人生提出了什么看法：*Ambition that ignores conscience destroys the person it drives.* 它不是**话题词**，话题词只说出主题领域，却没有说出任何看法（*ambition*）。它不是**情节概要**，情节概要讲的是特定人物发生了什么（*Macbeth kills the king to become king*）。它也不是**命令或陈词滥调**，后者是在说教或重复老套的说法（*Never be too ambitious*；*Crime does not pay*）。",
      ],
      ["What is this statement about a story?", "这句关于故事的话属于什么？"],
      `
        People who seek revenge often become the very thing they hated.|a theme statement
        Revenge.|a topic word
        Hamlet spends the play trying to avenge his father's murder.|a plot summary
        Never take revenge.|a command or cliché
        Loyalty to a group can blind people to the wrongs the group commits.|a theme statement
        Loyalty and betrayal.|a topic word
        The soldier follows his captain's orders and burns the village.|a plot summary
        Always be loyal to your friends.|a command or cliché
        War destroys not only bodies but also the ability to feel.|a theme statement
        The horrors of war.|a topic word
        Paul fights in the trenches and loses all his friends.|a plot summary
        War is hell.|a command or cliché
        The things we fear in others are often the things we fear in ourselves.|a theme statement
        Fear.|a topic word
        The villagers chase the stranger out of town.|a plot summary
        Do not judge a book by its cover.|a command or cliché
        Growing up means accepting that the adults we admired are flawed.|a theme statement
        Growing up.|a topic word
        Scout learns that her father cannot win the trial.|a plot summary
        Respect your elders.|a command or cliché
        A society that values profit above people will eventually turn on its own members.|a theme statement
        Greed and society.|a topic word
        The company fires the workers and moves the factory overseas.|a plot summary
        Money is the root of all evil.|a command or cliché
        Memory can preserve love, but it can also trap us in the past.|a theme statement
        Memory.|a topic word
        The widow keeps her husband's room exactly as he left it.|a plot summary
        Live in the present.|a command or cliché
        Satire can expose cruelty that serious argument fails to move people to see.|a theme statement
        Humor.|a topic word
      `,
      {
        "a theme statement": L(
          "主题陈述",
          "It is a complete, general idea about life that a reader could argue for with evidence from the text.",
          "它是一个完整的、关于人生的普遍性观点，读者可以用文本中的证据为之论证。",
          "It is not a complete, general idea about life.",
          "它不是一个完整的、关于人生的普遍性观点。",
        ),
        "a topic word": L(
          "话题词",
          "It names a subject but makes no statement about it, so there is nothing to argue.",
          "它只说出了一个主题领域，却没有对它作出任何陈述，所以没有可论证的内容。",
          "It is a full statement, not just the name of a subject.",
          "它是一个完整的陈述，而不只是一个主题领域的名称。",
        ),
        "a plot summary": L(
          "情节概要",
          "It tells what happens to particular characters, not what the story suggests about life in general.",
          "它讲的是特定人物发生了什么，而不是故事对人生的普遍性看法。",
          "It does not retell events involving particular characters.",
          "它没有复述特定人物所经历的事件。",
        ),
        "a command or cliché": L(
          "命令或陈词滥调",
          "It preaches a rule or repeats a familiar saying, instead of expressing the particular insight of the text.",
          "它在宣讲规则或重复熟悉的说法，而不是表达这篇文本独特的见解。",
          "It does not preach a rule or repeat a familiar saying.",
          "它没有宣讲规则，也没有重复熟悉的说法。",
        ),
      },
    ),
    choose(
      "the-stronger-theme-statement",
      ["The Stronger Theme Statement", "更好的主题陈述"],
      [
        "A strong theme statement is **specific**: it names the conditions under which its idea holds (*ambition that ignores conscience*), rather than making a sweeping claim about all people. It is **arguable**: a thoughtful reader could disagree. And it is **supported** by the whole text, not just one scene. Avoid absolute words such as *always*, *never* and *everyone* unless the text truly supports them.",
        "好的主题陈述是**具体的**：它说明其观点成立的条件（*ambition that ignores conscience*），而不是对所有人作出笼统的论断。它是**可论证的**：有思想的读者可能不同意。它还要**有整篇文本支持**，而不只是一个场景。除非文本确实支持，否则避免使用 *always*、*never*、*everyone* 这样的绝对化词语。",
      ],
      ["Which theme statement is the strongest?", "哪个主题陈述最好？"],
      `
        A story about a rich man who loses his family through greed|Wealth pursued at the cost of relationships leaves a person rich but alone.|Money is bad.|Everyone in the world who has a lot of money is always unhappy and alone, without exception.
        A story about a girl who finds courage when her brother is in danger|Love for another person can give us courage we did not know we had.|Courage is important.|All people are always brave whenever someone they love is in danger, no matter how frightened they are.
        A novel about a town that turns against a stranger|Fear of the unfamiliar can make ordinary people cruel.|Strangers are scary.|Every single town in the world has always hated strangers and always will hate them, whatever happens.
        A poem about an old soldier who cannot forget the war|The memory of violence can outlast the violence itself.|War is sad.|Every soldier who has ever fought in any war is ruined forever and can never live a normal life again.
        A play about a king who trusts flatterers and exiles an honest daughter|Leaders who reward flattery lose the people who would tell them the truth.|Kings should be nice.|All kings and queens throughout history have always been fools who listen only to those who flatter them.
        A story about two friends who fall out over a small lie|Small dishonesties can damage trust more than we expect.|Lying is wrong.|Every lie, however small it may be, always destroys every friendship completely and forever.
        A novel about a boy who leaves his village for the city and feels lost|Gaining a wider world can mean losing a sense of belonging.|Cities are big.|Everyone who moves from a village to a big city is always miserable and lonely for the rest of their life.
        A satire about a government that bans bad news|Silencing bad news does not make problems disappear; it lets them grow.|Governments are bad.|All governments in every country always lie to their people about absolutely everything that happens.
        A story about a scientist who ignores warnings about her invention|Brilliance without caution can turn discoveries into dangers.|Science is dangerous.|Every scientist who makes a discovery always ends up causing a terrible disaster for the whole of humanity.
        A memoir about a family that survives poverty together|Shared hardship can strengthen the bonds between people.|Poverty is hard.|Every poor family in the world is always closer and more loving than every rich family could ever be.
        A story about a girl who pretends to be someone else online|A false identity can win attention but not real connection.|The internet.|Everyone who uses the internet is always a liar who pretends to be someone completely different online.
        A play about a man who blames others for his failures|Refusing responsibility for our failures keeps us from growing.|Blame.|People never take responsibility for anything that goes wrong in their lives and always blame everyone else.
        A novel about a woman who rebuilds her life after a flood|Loss can become the beginning of a new and stronger life.|Floods are bad.|Every disaster, however terrible it is, always leads to a happy ending for the people who live through it.
        A story about a teenager who joins a group that bullies others|The wish to belong can lead people to betray their own values.|Bullying is bad.|All teenagers always join the bullies in their school because they are afraid of being left alone.
        A poem about a tree that outlives everyone who planted it|Nature continues long after the people who shaped it are gone.|Trees are nice.|Nothing that people do in their short lives ever matters at all, because nature always outlives everyone.
        A story about a boy who wins a race by cheating and feels empty|Victory gained dishonestly brings no real satisfaction.|Cheating.|Winners are always cheaters.
        A satire about a town that builds statues instead of schools|Communities that honor appearance over substance neglect their future.|Statues are expensive.|Every town and city in the world always wastes all of its money on things that nobody needs.
        A novel about a family that keeps a secret for generations|Secrets kept to protect a family can end up harming it.|Family secrets.|All families everywhere always have terrible secrets that they keep hidden from the world for generations.
        A story about an old woman who teaches a child to read|Knowledge passed between generations can change both giver and receiver.|Reading is good.|Old people always know best.
        A play about a judge who must sentence his own son|Justice demands the hardest choices when it touches the people we love.|Justice.|Judges never care about their families.
        A story about a refugee who keeps her language alive in a new country|Language can carry a sense of home across any border.|Language.|Every refugee who moves to a new country always forgets her own language within a few short years.
        A novel about a worker who loses his job to a machine|Progress that ignores its human cost leaves people behind.|Machines are bad.|Every new machine that is ever invented always destroys the jobs of the people who worked before it.
        A poem about a mother waiting for news of her son at sea|Waiting can be harder to bear than knowing the worst.|Waiting.|All mothers always worry too much.
        A story about a rich girl who befriends a poor boy|Friendship can cross the lines that society draws between people.|Friendship is nice.|Rich people and poor people can never be real friends, because the differences between them are always too great.
        A satire about a company that sells happiness in a bottle|The promise of easy happiness exploits real human longing.|Advertising.|All companies always lie to their customers about everything they sell, in every advertisement they make.
        A story about a man who keeps every promise except one|A single broken promise can outweigh a lifetime of kept ones.|Promises.|Everyone always breaks their promises.
        A novel about a village that survives a war by hiding a stranger|Small acts of courage by ordinary people can resist great evil.|War stories.|Every village always helps strangers.
        A story about a girl who chooses art over a safe career|Following a true calling may require giving up security.|Art is beautiful.|Artists are always poor.
        A play about two brothers fighting over their father's land|Inheritance can turn love into rivalry.|Brothers fight.|All brothers always hate each other.
        A poem about the last day of summer|Joy feels sharper when we know it is ending.|Summer.|Every ending is always sad.
      `,
      (right) => [
        `"${right}" is specific, arguable and fits the whole story, without sweeping words such as *always* or *never*.`,
        `“${right}” 具体、可论证，并符合整个故事，没有 *always* 或 *never* 这样笼统的词。`,
      ],
      [
        [
          '"{wrong}" is too vague: it names a subject or makes a bare judgment, but says nothing specific about life.',
          "“{wrong}”太空泛：它只说出主题领域或作出简单的判断，却没有对人生说出任何具体的看法。",
        ],
        [
          '"{wrong}" is too sweeping: words such as *always*, *never*, *every* and *all* make a claim the story cannot support.',
          "“{wrong}”太笼统：*always*、*never*、*every*、*all* 这样的词作出了故事无法支持的论断。",
        ],
      ],
    ),
  ],
});

const qualifications = topic("writing", {
  id: "showing-qualifications-with-evidence",
  title: ["Showing Qualifications with Evidence", "用证据展示资历"],
  summary: [
    "In a letter of application or a personal statement, proving a quality with a specific example and a result instead of only claiming it.",
    "在求职信或个人陈述中，用具体的事例和结果来证明某种品质，而不只是声称自己具备它。",
  ],
  after: ["formal-style", "supporting-reasons-with-facts"],
  points: [
    choose(
      "show-do-not-claim",
      ["Show, Do Not Claim", "要展示，不要声称"],
      [
        "Anyone can write *I am hard-working* or *I am a natural leader*. A reader who must choose between applicants believes **evidence**: a specific example of what you did and, if possible, a **result** that can be checked. *I organized a book drive that collected 600 books for the town library* proves leadership better than any adjective. Keep the claim, but let an example carry it.",
        "谁都能写 *I am hard-working* 或 *I am a natural leader*。必须在申请人之间作出选择的读者相信的是**证据**：你做过什么的具体事例，最好还有可以核实的**结果**。*I organized a book drive that collected 600 books for the town library* 比任何形容词都更能证明领导力。可以保留你的说法，但要让事例来支撑它。",
      ],
      ["Which sentence best proves the quality for a letter of application?", "在求职信中，哪个句子最能证明这一品质？"],
      `
        Quality: leadership|As captain of the debate team, I trained six new members, and four reached the regional finals.|I am a born leader, and in every group I have ever joined, people have naturally looked to me to take charge of things.|I have always wanted to be a leader of some kind.
        Quality: reliability|In two years at the bakery, I opened the shop at 6 a.m. every Saturday and never missed a shift.|I am the most reliable person you will ever meet, and anyone who knows me will tell you that I can always be counted on.|I would like to be more reliable in the future.
        Quality: creativity|I designed the posters for our school play, and ticket sales rose by a third over the year before.|I am an extremely creative person who is always full of new and exciting ideas, and I love to think outside the box.|Creativity is very important in today's world.
        Quality: patience|Each week for a year, I tutored a ten-year-old in reading, and his reading level rose by two grades.|I am a very patient and understanding person, especially with young children, who always seem to enjoy spending time with me.|Patience is a quality that I admire in others.
        Quality: teamwork|On our science project, I coordinated the work of five students, and we finished a week early.|I am a great team player who gets along well with everyone, and I always put the needs of the team before my own.|Teamwork makes the dream work, as people say.
        Quality: problem-solving|When our club's website crashed, I rebuilt it in a weekend using free tools, and it has run without problems since.|I am excellent at solving problems of every kind, whether they are technical, practical or personal.|I enjoy solving puzzles in my free time.
        Quality: communication|I gave a five-minute talk on recycling to 400 students, and the school added recycling bins in every classroom.|I have truly excellent communication skills, both written and spoken, and I can talk confidently with anyone at all.|Communication is the key to success in any job.
        Quality: responsibility|I managed the 300-dollar budget for our class trip and returned 40 dollars to the class afterward.|I am a very responsible and trustworthy student, and my teachers have always known that they can rely on me completely.|My parents have always told me to be responsible.
        Quality: hard work|Last summer, I worked thirty hours a week at a farm stand while completing an online course in accounting.|I am easily the hardest-working person in my whole school, and I never stop until a job is done perfectly.|Hard work is something I believe in strongly.
        Quality: initiative|When I noticed that our library had no books in Polish, I asked local families for donations and started a shelf of 80 titles.|I always take the initiative in everything I do, because I believe that waiting for others to act is a waste of time.|Initiative is important for young people.
        Quality: attention to detail|As editor of the school newspaper, I checked every article for errors, and we won a regional award for accuracy.|I pay very great attention to detail at all times, and I am proud of the fact that I never miss even the smallest thing.|Details matter more than most people think.
        Quality: kindness|Every Sunday for two years, I have helped serve lunch at the shelter on Elm Street.|I am a very kind and caring person.|Kindness costs nothing, as my grandmother says.
        Quality: adaptability|When our family moved to a new country, I learned the language well enough to join the debate club within a year.|I can adapt to almost any situation quickly and easily, and I have always been good at dealing with change of every kind.|Change is a part of life for everyone.
        Quality: organization|I set up a sign-up system for our school's 200 volunteers, which cut the time needed to plan events by half.|I am a highly organized individual who always keeps everything in perfect order, from my desk to my schedule.|Organization is very important in a busy office.
        Quality: customer service|At the pet shop, I helped customers choose food and supplies, and my manager asked me to train two new workers.|I am wonderful with customers of all ages, and they always tell me that I am the friendliest person they have ever met.|The customer is always right.
        Quality: persistence|I failed my first driving test, practiced for three more months and passed with no errors.|I never give up on anything that I start, no matter how hard it becomes or how long it takes me to finish.|Persistence is what separates winners from losers.
        Quality: math skills|I scored in the top 5 percent in the regional math competition and tutor two classmates in algebra.|Math is my strongest subject by far.|I have always found numbers fascinating.
        Quality: computer skills|I built a spreadsheet that tracks our club's budget, which the club has used for two years.|I am a computer genius.|Computers are part of every job today.
        Quality: calm under pressure|When a fire alarm went off during our concert, I helped the conductor guide 50 younger students out in three minutes.|I stay calm and relaxed in every situation, even when everyone around me is panicking and does not know what to do.|Stress is a problem for many people.
        Quality: language skills|I translated the school's welcome letter into Spanish and Arabic for new families.|I am excellent at languages.|Learning languages opens many doors.
        Quality: punctuality|In three years of my paper route, not one customer reported a late delivery.|I am always on time for everything.|Being on time shows respect for others.
        Quality: honesty|When the shop's till was 20 dollars over at closing, I reported it, and the money was returned to a customer who had overpaid.|I am the most honest person I know.|Honesty is the best policy.
        Quality: curiosity|After a museum visit, I spent a summer researching local fossils and presented my findings at the town library.|I am an extremely curious person.|Curiosity killed the cat, but I still have it.
        Quality: love of animals|I have volunteered at the animal shelter for eighteen months, walking dogs and cleaning cages every Saturday.|I really love animals of all kinds.|Animals make the world a better place.
        Quality: public speaking|I represented our school at the regional speech contest and placed second out of thirty speakers.|I am a confident and natural public speaker who has never once felt nervous in front of an audience, however large.|Public speaking is many people's greatest fear.
        Quality: fitness|I train five days a week and completed my first half-marathon in under two hours.|I am very fit and healthy.|Fitness is important for every job.
        Quality: writing|Three of my articles were published in the local newspaper's youth section last year.|I am a talented and gifted writer.|Writing has always been a passion of mine.
        Quality: fairness|As a referee for children's football, I handled forty matches without a single formal complaint.|I am always completely fair to everyone I meet, and I treat every single person exactly the same way, whoever they are.|Fairness is what every game needs.
        Quality: planning|I planned our class's charity run, from the route to the permits, and it raised 2,300 dollars.|I am a born planner.|Good plans lead to good results.
        Quality: care for the environment|I started a composting program in our cafeteria that now diverts about 40 kilograms of food waste a week.|I care deeply about the environment.|The environment is everyone's responsibility.
      `,
      (right) => [
        `"${right}" proves the quality with a specific action and a result the reader can believe.`,
        `“${right}” 用具体的行动和读者可以相信的结果证明了这一品质。`,
      ],
      [
        [
          '"{wrong}" only claims the quality with adjectives; it gives the reader no evidence to believe it.',
          "“{wrong}”只用形容词声称具备这一品质；没有给读者任何可信的证据。",
        ],
        [
          '"{wrong}" talks about the quality in general or as a wish, but says nothing about what the applicant has done.',
          "“{wrong}”泛泛地谈论这一品质或只是表达愿望，却没有说申请人做过什么。",
        ],
      ],
    ),
    label(
      "the-part-of-the-letter",
      ["The Part of the Letter", "信件的组成部分"],
      [
        "A letter of application has a clear shape. The **opening** names the position and how the writer learned of it. The **evidence** paragraphs match the writer's experience to what the job needs, with examples. The **closing** thanks the reader, mentions availability for an interview and signs off politely.",
        "求职信有清晰的结构。**开头**说明所申请的职位以及作者是如何得知的。**证据**段落用事例把作者的经历与工作的要求对应起来。**结尾**感谢读者，说明可以参加面试的时间，并礼貌地署名。",
      ],
      ["Which part of a letter of application does this sentence belong to?", "这句话属于求职信的哪个部分？"],
      `
        I am writing to apply for the position of summer assistant at the City Museum, which I saw advertised on your website.|the opening
        In my two years as a library volunteer, I catalogued over a thousand books and helped visitors find what they needed.|the evidence
        Thank you for considering my application; I am available for an interview at any time after June 10.|the closing
        I would like to apply for the role of junior lifeguard advertised in the Herald on May 3.|the opening
        Last summer I completed a first-aid course and helped teach swimming to children aged six to nine.|the evidence
        I look forward to hearing from you and would welcome the chance to discuss the role in person.|the closing
        My teacher, Ms. Lane, told me about the internship at your newspaper, and I am writing to apply.|the opening
        As editor of our school magazine, I met every deadline for two years and managed a team of eight writers.|the evidence
        Please find my résumé attached. Thank you for your time.|the closing
        I am writing in response to your notice for weekend staff at Green Valley Garden Center.|the opening
        I have grown vegetables in our community garden for three years and know the needs of most common plants.|the evidence
        I hope to hear from you soon. Yours sincerely, Amira Haddad|the closing
        Please accept this letter as my application for the volunteer guide program at the national park.|the opening
        I led hiking trips for my scout troop and can identify more than fifty local birds.|the evidence
        I would be grateful for the opportunity to meet with you, and I can be reached at the number below.|the closing
        I am applying for the position of tutor at the Bright Futures Learning Center.|the opening
        I have tutored three younger students in math, and all of them raised their grades by at least one letter.|the evidence
        Thank you again for reading my letter; I hope to contribute to your center this autumn.|the closing
        Having seen your poster in the school hall, I wish to apply for the part-time position of kitchen helper.|the opening
        At my aunt's restaurant, I prepared vegetables and washed dishes during the busy holiday season.|the evidence
        I am available to start on July 1 and look forward to your reply.|the closing
        I am writing to express my interest in the youth council seat advertised on the town website.|the opening
        I organized a petition that collected 900 signatures for a new crossing near our school, which the town built last year.|the evidence
        Thank you for your consideration, and I hope to serve on the council.|the closing
        I would like to be considered for the camp counselor position described in your brochure.|the opening
        For three summers I helped run a day camp for twenty children, planning games and leading craft activities.|the evidence
        I would welcome an interview and thank you for your time and attention.|the closing
        I am writing to apply for the assistant coach position with the under-twelve football team.|the opening
        I have played for my school team for five years and coached my younger brother's team when its coach was ill.|the evidence
        I hope to hear from you, and I thank you for considering me.|the closing
      `,
      {
        "the opening": L(
          "开头",
          "It names the position being applied for and how the writer learned about it.",
          "它说明了所申请的职位以及作者是如何得知这个职位的。",
          "It does not introduce the position or how the writer heard of it.",
          "它没有介绍所申请的职位，也没有说明作者如何得知。",
        ),
        "the evidence": L(
          "证据",
          "It gives a specific example of the writer's experience that matches what the job needs.",
          "它给出了与工作要求相符的、作者经历中的具体事例。",
          "It does not give an example of the writer's experience.",
          "它没有给出作者经历中的事例。",
        ),
        "the closing": L(
          "结尾",
          "It thanks the reader, mentions availability or a reply, and ends the letter politely.",
          "它感谢读者，提到可以面谈的时间或期待回复，并礼貌地结束信件。",
          "It does not thank the reader or bring the letter to a close.",
          "它没有感谢读者，也没有结束信件。",
        ),
      },
    ),
  ],
});

/** writingTopics10 are the writing topics of grade 10 checked by rule. */
export const writingTopics10: readonly TopicDef[] = [objective, theme, qualifications];
