// Grade 10: reading of nonfiction and satire: bias in the news, numbers that mislead, and how satire works.

import type { TopicDef } from "@ga/content";
import { choose, type Label, label, topic } from "../grade-6/kit.ts";

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

const bias = topic("reading", {
  id: "identifying-bias-in-the-news",
  title: ["Identifying Bias in the News", "识别新闻中的偏见"],
  summary: [
    "How a news report can lean to one side without telling a lie: by its choice of words, of sources, of facts left out and of what goes in the headline.",
    "一篇新闻报道如何在不说谎的情况下偏向一方：通过措辞、消息来源的选择、遗漏的事实以及标题的内容。",
  ],
  after: ["loaded-language", "facts-interpretations-and-judgments"],
  points: [
    label(
      "how-the-report-leans",
      ["How the Report Leans", "报道如何偏向"],
      [
        "A report can be **biased** even when every fact in it is true. Watch for four kinds of bias. **Word choice**: *protesters* or *rioters*, *tax relief* or *tax cuts for the rich*. **Selection of sources**: quoting only one side, or only officials. **Omission**: leaving out a fact that would change the reader's view. **Placement**: putting one side in the headline and the other in the last paragraph, where few readers reach.",
        "即使报道中的每个事实都是真的，它仍可能有**偏见**。要注意四种偏见。**措辞**：说 *protesters* 还是 *rioters*，说 *tax relief* 还是 *tax cuts for the rich*。**消息来源的选择**：只引用一方，或只引用官员。**遗漏**：略去会改变读者看法的事实。**位置安排**：把一方放在标题里，把另一方放在最后一段，那里很少有读者读到。",
      ],
      ["What kind of bias does this report show?", "这篇报道表现出哪种偏见？"],
      `
        The article calls the striking nurses "a mob of greedy workers holding patients hostage."|word choice
        A report on the new factory quotes the company's director, the mayor and a business leader, but no one who lives near the site.|selection of sources
        A story praising the new highway does not mention that two hundred families lost their homes to build it.|omission
        The headline reads "Mayor Saves City Millions"; only the last paragraph says that the savings came from closing three libraries.|placement
        The report describes the senator's plan as "a reckless scheme" and her opponent's as "a bold vision."|word choice
        An article on a dispute between a landlord and tenants interviews the landlord at length and does not contact any tenant.|selection of sources
        A story about the team's victory leaves out that the referee was later suspended for favoring the home side.|omission
        The front page announces "Crime Falls in City Center"; page twelve reports that crime rose in every other district.|placement
        The reporter calls the cuts to the school budget "smart savings."|word choice
        A piece on a new medicine quotes three doctors paid by the company that makes it, and no independent experts.|selection of sources
        A report on the protest gives the number of arrests but not the reason people were protesting.|omission
        The headline says "Union Demands Huge Raise"; the eighth paragraph explains that workers have had no raise in ten years.|placement
        The article describes the refugees as "flooding" across the border.|word choice
        A report on the election quotes four supporters of the winner and one of the loser.|selection of sources
        A story celebrating the company's record profits does not say that it laid off a thousand workers the same month.|omission
        The top story is "Police Praised for Quick Arrest"; the final line notes that the man was released when the real thief confessed.|placement
        The report calls the new law "a crackdown on freedom," while the government calls it "a safety measure," and the reporter uses only the first phrase.|word choice
        An article about a strike quotes the company spokesperson and a customer who was inconvenienced, but no striking worker.|selection of sources
        A report on a famous athlete's charity work leaves out that he was fined for cheating that year.|omission
        The headline reads "New Dam Brings Power to Millions"; the last paragraph mentions the villages it flooded.|placement
        A story describes the opposition leader as "shrill" and the president as "firm."|word choice
        A report on the new mine quotes the mining company and the regional government, and leaves out the fishermen downstream.|selection of sources
        An article about a new phone praises its speed and does not mention that it overheats.|omission
        "Students Cheer New Rules," says the headline; the fifth paragraph reports that most students opposed them.|placement
        The reporter calls the march "a small gathering of troublemakers."|word choice
        A story about rising rents quotes three property developers and an economist who works for them.|selection of sources
        An article praising the city's new stadium leaves out its cost to taxpayers.|omission
        The headline reads "Test Scores Rise"; the article later explains that only students who passed a pre-test were allowed to sit the exam.|placement
        The article refers to the minister's mistake as "a minor slip."|word choice
        A report on the drought quotes only farmers who blame the government, not scientists or officials.|selection of sources
      `,
      {
        "word choice": L(
          "措辞",
          "The report uses words with strong feelings attached, which push the reader toward one side.",
          "报道使用了带有强烈感情色彩的词语，推动读者倒向一方。",
          "The bias does not lie in loaded words.",
          "偏见并不在于带有感情色彩的词语。",
        ),
        "selection of sources": L(
          "消息来源的选择",
          "The report lets only one side speak, so the reader hears one point of view.",
          "报道只让一方发声，读者只能听到一种观点。",
          "The bias does not lie in which people are quoted.",
          "偏见并不在于引用了哪些人的话。",
        ),
        omission: L(
          "遗漏",
          "The report leaves out an important fact that would change how the reader sees the story.",
          "报道略去了一个会改变读者看法的重要事实。",
          "The report does not leave out a key fact.",
          "报道并没有略去关键事实。",
        ),
        placement: L(
          "位置安排",
          "The report puts one side up front, in the headline, and buries the important other side near the end.",
          "报道把一方放在前面的标题里，把重要的另一方埋在结尾附近。",
          "The bias does not lie in what goes in the headline and what is buried.",
          "偏见并不在于什么放进标题、什么被埋在后面。",
        ),
      },
    ),
    choose(
      "the-neutral-version",
      ["The Neutral Version", "中立的版本"],
      [
        "To test a report for bias, imagine how a fair reporter would write the same sentence. **Neutral** language names what happened without praise or blame: *workers went on strike* rather than *workers abandoned their posts* or *heroic workers stood up*. A neutral sentence keeps the facts and drops the feeling words.",
        "要检验报道是否有偏见，就想象一位公正的记者会如何写同一个句子。**中立**的语言只说明发生了什么，不褒也不贬：*workers went on strike*，而不是 *workers abandoned their posts* 或 *heroic workers stood up*。中立的句子保留事实，去掉带感情色彩的词。",
      ],
      ["Which version of the sentence is the most neutral?", "这个句子的哪个版本最中立？"],
      `
        A sentence about a protest|About five hundred people marched to city hall on Saturday.|A furious mob stormed city hall on Saturday.|Brave citizens rose up and marched on city hall on Saturday.
        A sentence about a tax change|The council raised the property tax by two percent.|The council grabbed another two percent from homeowners.|The council wisely invested two percent more in our future.
        A sentence about a new law|Parliament passed a law limiting the use of cars in the city center.|Parliament declared war on drivers with a harsh new law.|Parliament bravely saved the city center from choking traffic.
        A sentence about a company|The company closed its factory in Leeds, and 300 workers lost their jobs.|The greedy company threw 300 loyal workers onto the street.|The company made a tough but necessary choice to close its factory in Leeds.
        A sentence about a politician's speech|The minister spoke for forty minutes about the economy.|The minister rambled for forty minutes about the economy.|The minister gave a brilliant forty-minute speech on the economy.
        A sentence about a sports result|The visiting team won 2 to 1.|The visitors stole a lucky 2 to 1 win.|The visitors crushed the home side 2 to 1.
        A sentence about a scientist's claim|The researcher said the drug reduced symptoms in most patients.|The researcher boasted that her drug works wonders.|The researcher admitted that the drug only helps some patients.
        A sentence about immigration|About ten thousand migrants crossed the border last month.|A wave of ten thousand migrants poured across the border last month.|Ten thousand desperate families found refuge across the border last month.
        A sentence about a school decision|The board voted to end the music program.|The board killed the beloved music program.|The board finally trimmed the costly music program.
        A sentence about a strike|Bus drivers stopped work on Monday, asking for higher wages.|Bus drivers abandoned passengers on Monday in a selfish strike.|Heroic bus drivers took a stand on Monday for fair wages.
        A sentence about an election|The challenger won 52 percent of the vote.|The challenger scraped through with a mere 52 percent.|The challenger swept to victory with a powerful 52 percent.
        A sentence about a demolition|The city tore down the old cinema to build apartments.|The city destroyed a beloved landmark to please developers.|The city cleared away an old eyesore to make room for new homes.
        A sentence about a court case|The jury found the defendant not guilty.|The jury let the defendant walk free.|The jury cleared the innocent defendant's name.
        A sentence about a price rise|The price of bread rose by ten cents.|Bakers hiked the price of bread by ten cents.|Bread now costs only ten cents more.
        A sentence about a new building|The city opened a new stadium that cost 400 million dollars.|The city wasted 400 million dollars on a new stadium.|The city proudly opened a magnificent new stadium.
        A sentence about a disagreement|The two leaders disagreed about trade.|The two leaders clashed bitterly over trade.|The wise leader stood firm against his rival on trade.
        A sentence about a report|The report found that air quality fell in five cities.|The shocking report exposed toxic air in five cities.|The report noted a slight change in air quality in five cities.
        A sentence about a resignation|The director resigned on Tuesday.|The director fled her post on Tuesday.|The director bravely stepped down on Tuesday.
        A sentence about a protest's size|Police estimated the crowd at two thousand.|A tiny crowd of two thousand showed up.|A massive crowd of two thousand filled the square.
        A sentence about a policy|The government will require ID to vote.|The government will block citizens from voting.|The government will protect elections from fraud.
        A sentence about a festival|About ten thousand people attended the festival.|Hordes of noisy visitors invaded the festival.|A joyful crowd of ten thousand celebrated at the festival.
        A sentence about a medicine|The drug was approved for use in adults.|The risky drug was rushed through for adults.|The miracle drug was finally approved for adults.
        A sentence about wages|Average wages rose by three percent last year.|Wages barely crept up three percent last year.|Wages soared by three percent last year.
        A sentence about a mayor|The mayor did not answer reporters' questions.|The mayor ducked reporters' questions.|The mayor wisely refused to be drawn into gossip.
        A sentence about a park|The council sold part of the park to a builder.|The council handed our park to its developer friends.|The council made smart use of unused park land.
        A sentence about a company's profits|The company earned 2 billion dollars last year.|The company raked in a massive 2 billion dollars last year.|The company achieved an outstanding 2 billion dollars in earnings last year.
        A sentence about a game delay|The game was delayed for an hour because of rain.|The game was ruined by an hour of rain.|Fans patiently waited out an hour of rain.
        A sentence about a vote|The bill passed by three votes.|The bill squeaked through by just three votes.|The bill won by a clear three votes.
        A sentence about a scientist|The scientist changed her conclusion after new data.|The scientist flip-flopped on her conclusion.|The scientist courageously updated her conclusion.
        A sentence about a march|Students marched to protest the fee increase.|Students skipped class to march against fees.|Students marched bravely for their future.
      `,
      (right) => [
        `"${right}" states what happened and keeps the facts, without words of praise or blame.`,
        `“${right}” 说明了发生的事，保留了事实，没有褒扬或指责的词语。`,
      ],
      [
        [
          '"{wrong}" uses words that blame or belittle, such as a negative verb or adjective, to push the reader against one side.',
          "“{wrong}”用了指责或贬低的词，比如带贬义的动词或形容词，推动读者反对一方。",
        ],
        [
          '"{wrong}" uses words that praise, flatter or play down the facts, to push the reader toward one side.',
          "“{wrong}”用了褒扬、讨好或淡化事实的词，推动读者倾向一方。",
        ],
      ],
    ),
  ],
});

const numbers = topic("reading", {
  id: "how-numbers-can-mislead",
  title: ["How Numbers Can Mislead", "数字如何误导人"],
  summary: [
    "The common ways true numbers give a false picture: a percentage without its base, an average that hides the spread, a cut-off axis and a sample too small or too chosen.",
    "真实的数字给出错误印象的常见方式：没有基数的百分比、掩盖分布的平均数、截断的坐标轴，以及过小或经过挑选的样本。",
  ],
  after: ["correlation-or-cause", "reporting-numbers-from-a-graph"],
  points: [
    label(
      "the-trick-in-the-number",
      ["The Trick in the Number", "数字里的花招"],
      [
        "A number can be accurate and still mislead. Watch for a **percentage without a base**: *crime doubled* may mean it rose from two cases to four. Watch for an **average that hides the spread**: one billionaire in a room makes the average income huge. Watch for a **chosen sample**: a survey of a product's own fans says little about everyone. And watch for a **cut-off graph**, whose vertical axis starts high so that a small change looks huge.",
        "一个数字可能准确，却仍然误导人。要留意**没有基数的百分比**：*犯罪翻了一番* 可能只是从两起增加到四起。要留意**掩盖分布的平均数**：房间里有一位亿万富翁，平均收入就会高得惊人。要留意**经过挑选的样本**：对某产品自己的粉丝做调查，几乎说明不了所有人的情况。还要留意**截断的图表**，其纵轴从很高的数值开始，使小小的变化看起来很大。",
      ],
      ["What makes this use of numbers misleading?", "这种对数字的使用为什么具有误导性？"],
      `
        "Shark attacks rose by 100 percent this year!" There were two attacks last year and four this year.|a percentage without a base
        "The average salary at our company is 150,000 dollars." The owner earns 3 million dollars; most workers earn 30,000.|an average that hides the spread
        "Nine out of ten users love our app!" The survey was sent only to people who had rated the app five stars.|a chosen sample
        A bar chart of test scores starts its vertical axis at 80, so a rise from 81 to 83 looks like a tripling.|a cut-off graph
        "Thefts in the village have tripled!" There was one theft last year and three this year.|a percentage without a base
        "The average family in our town owns 2.5 cars." Most families own one car, and a few own many.|an average that hides the spread
        "Most readers agree with our opinion." The poll was taken among readers of the newspaper's opinion page.|a chosen sample
        A chart of a company's share price shows a cliff, but the axis runs only from 99 to 101 dollars.|a cut-off graph
        "Sales of our new soup jumped 400 percent!" The company sold five cans last month and twenty-five this month.|a percentage without a base
        "The average house price on this street is 2 million dollars." One mansion is worth 15 million; the rest are worth about 500,000.|an average that hides the spread
        "Ninety percent of people support the new park." The survey was carried out at a meeting of the park's supporters.|a chosen sample
        A graph of unemployment begins its axis at 4.8 percent, so a change from 4.9 to 5.1 looks like a disaster.|a cut-off graph
        "Cases of the rare disease have doubled!" The number rose from one case in a million to two.|a percentage without a base
        "Our students average 1,400 on the exam." Half scored 1,600 and half scored 1,200.|an average that hides the spread
        "Doctors recommend our toothpaste." The company asked only dentists it already paid.|a chosen sample
        A chart of the city's population shows a steep fall, but the axis runs from 1,000,000 to 1,010,000.|a cut-off graph
        "Membership in the chess club has grown by 50 percent!" It went from two members to three.|a percentage without a base
        "The average temperature this year was normal." The summer was the hottest on record and the winter the coldest.|an average that hides the spread
        "Everyone at the gym says our protein shake works." The gym is owned by the shake company.|a chosen sample
        A bar graph of two candidates' support starts at 40 percent, so 46 and 48 look like one bar twice the height of the other.|a cut-off graph
        "Accidents on our road have increased by 200 percent!" There were three accidents instead of one.|a percentage without a base
        "The average age of the club's members is 35." Half the members are teenagers and half are over sixty.|an average that hides the spread
        "Our customers rate us 4.9 out of 5." Only customers who completed a purchase were asked; those who gave up were not.|a chosen sample
        A line chart of fuel prices shows a sharp spike, but the axis covers only two cents.|a cut-off graph
        "Use of our library app is up 300 percent!" Four people used it last month and sixteen this month.|a percentage without a base
        "The average class size is 25." Some classes have 50 students and some have 5.|an average that hides the spread
        "Most voters trust the governor." The poll was taken at the governor's own rally.|a chosen sample
        A chart of the river's height starts at 9.9 meters, so a rise of a few centimeters looks like a flood.|a cut-off graph
        "Cheating at the school doubled this term!" Two students were caught instead of one.|a percentage without a base
        "Fans of the film gave it an average of 9 out of 10." The score came from the official fan club.|a chosen sample
      `,
      {
        "a percentage without a base": L(
          "没有基数的百分比",
          "A large percentage is reported, but the starting number is so small that the change means little.",
          "报道了很大的百分比，但起始数字非常小，变化其实没什么意义。",
          "The problem is not a big percentage built on a tiny starting number.",
          "问题并不在于以极小的起始数字算出的大百分比。",
        ),
        "an average that hides the spread": L(
          "掩盖分布的平均数",
          "The average is correct, but a few extreme values pull it away from what is typical, or hide two very different groups.",
          "平均数没有算错，但少数极端值把它拉离了典型情况，或掩盖了两个截然不同的群体。",
          "The problem is not an average distorted by extreme values.",
          "问题并不在于被极端值扭曲的平均数。",
        ),
        "a chosen sample": L(
          "经过挑选的样本",
          "The people asked were chosen in a way that favors the result, so they do not represent everyone.",
          "被调查的人是以有利于结果的方式挑选的，因此不能代表所有人。",
          "The problem is not who was chosen for the survey.",
          "问题并不在于调查选了哪些人。",
        ),
        "a cut-off graph": L(
          "截断的图表",
          "The vertical axis does not start at zero, so a small difference looks huge.",
          "纵轴不是从零开始，因此小小的差别显得很大。",
          "The problem is not the scale of a graph.",
          "问题并不在于图表的刻度。",
        ),
      },
    ),
    choose(
      "the-question-to-ask",
      ["The Question to Ask", "应该问的问题"],
      [
        "A careful reader meets a striking number with a question. For a percentage: *a percentage of what?* For an average: *what is typical, and how spread out are the values?* For a survey: *who was asked, and who chose them?* For a link between two things: *could something else cause both?* Asking the right question is the first step to judging the claim.",
        "细心的读者遇到惊人的数字时会提出问题。对于百分比：*是什么的百分比？* 对于平均数：*典型的情况是怎样的，数值的分布有多散？* 对于调查：*问了谁，又是谁挑选了他们？* 对于两件事之间的关联：*会不会是别的原因同时导致了二者？* 问对问题是判断这个说法的第一步。",
      ],
      ["Which question should a careful reader ask first?", "细心的读者首先应该问什么问题？"],
      `
        "Robberies in the park went up 50 percent."|How many robberies were there before?|Which park in the city is the most beautiful one to visit?|Why do people visit parks at night?
        "The average worker here earns 90,000 dollars."|What does a typical worker earn?|Is 90,000 dollars a large amount?|How many hours a week does the owner work?
        "Eight out of ten people prefer our coffee."|Who was asked, and how were they chosen?|Is coffee better than tea?|How much does a cup of the coffee cost?
        "Children who eat breakfast get better grades."|Could something else, such as family income, explain both?|What exactly do the children eat for breakfast each morning?|Do the children like their teachers?
        "Membership tripled in a year."|How many members were there at the start?|Who is the president of the club?|Is the club open on weekends?
        "Our customers are 98 percent satisfied."|Which customers were asked, and how?|Is 98 percent close enough to 100 percent to call it perfect?|What products does the company sell?
        "Towns with more police have more crime."|Could the crime cause the extra police, rather than the reverse?|How many police officers work in each of the towns in total?|What color are the police cars?
        "The average home here has 4.5 bedrooms."|Do a few very large homes raise the average?|What is the best size for a bedroom in a modern family home?|How old are the houses?
        "Sales doubled after the new advertisement."|What were sales before, and what else changed?|Was the advertisement funny?|Who made the advertisement?
        "Most experts support the plan."|Which experts, and who chose them?|What is an expert?|How long is the plan?
        "Students who play music score higher in math."|Could the same students have other advantages that explain both?|What instruments do the students play, and which do they like best?|Is math harder than music?
        "Deaths from the illness fell 30 percent."|Thirty percent of what number, over what time?|Is the illness painful?|Where did the illness begin?
        "The average rainfall here is moderate."|Does the average hide floods and droughts?|What is the wettest month?|How is rain measured?
        "Nine in ten dentists approve."|How many dentists were asked, and were they paid?|Do dentists themselves like this toothpaste better than others?|Where do the dentists work?
        "People who own dogs live longer."|Could healthier people be more likely to own dogs?|What breed of dog is best for a family that lives in a city?|How long do dogs live?
        "Prices rose only 2 percent."|Two percent of which prices, and over what period?|Is 2 percent a small number?|Who sets the prices?
        "Our survey shows the town wants a new mall."|Who answered the survey, and who paid for it?|How big would the mall be?|Where would the mall be built?
        "The graph shows a huge jump in sales."|Where does the vertical axis start?|What color is the graph?|Who drew the graph?
        "Cities with more ice cream sales have more drownings."|Could hot weather explain both?|What flavor of ice cream sells the most in the summer months?|How deep are the pools?
        "Average test scores rose this year."|Did the group of students who took the test change?|Was the test longer or shorter this year than the year before?|Who wrote the test?
        "Our new diet helped people lose 10 kilos."|How many people tried it, and how many gave up?|Is losing 10 kilos a lot for an adult who wants to be healthier?|What food does the diet allow?
        "Crime is at a record high."|Compared with what, and measured how?|What is the worst crime?|Who reports crimes?
        "Half of all marriages end in divorce."|Half of which marriages, and counted how?|Why do people decide to marry in the first place, and at what age?|How long is a typical wedding?
        "Viewers loved the show: the average rating was 8."|Did many viewers give 10 while many gave 1?|How long is each episode?|Who stars in the show?
        "Unemployment fell to 4 percent."|Who is counted as unemployed?|Is 4 percent a good number or a bad number for a country's economy?|Which jobs are most common?
        "Users of our app sleep better."|Did people who already slept well choose the app?|Is the app free?|What time do users go to bed?
        "Sales are up 200 percent since we hired the new manager."|What were sales before, and what else changed at the time?|Is the new manager friendly and popular with the people who work there?|How old is the new manager?
        "The average commute is 30 minutes."|Do some people travel two hours while others walk five minutes?|What is the best way to travel?|What time do offices open?
        "Ninety percent of our graduates find jobs."|Within what time, and what kind of jobs?|How many graduates are there?|Where is the school?
        "A study of 12 people proves the drug works."|Is a sample of 12 people large enough?|What does the drug taste like, and is it taken as a pill or a liquid?|Where did the twelve people live?
      `,
      (right) => [
        `"${right}" is the question that tests whether the number really supports the claim.`,
        `“${right}” 是检验这个数字是否真正支持该说法的问题。`,
      ],
      [
        [
          '"{wrong}" changes the subject or asks for an opinion; it does not test the number behind the claim.',
          "“{wrong}”转移了话题或是在询问看法；它并没有检验说法背后的数字。",
        ],
        [
          '"{wrong}" asks about a side detail; the answer would not show whether the claim is misleading.',
          "“{wrong}”问的是次要细节；答案并不能说明这个说法是否具有误导性。",
        ],
      ],
    ),
  ],
});

const satire = topic("reading", {
  id: "understanding-satire",
  title: ["Understanding Satire", "理解讽刺作品"],
  summary: [
    "How satire uses humor to criticize: finding its target, recognizing its tools, and reading past the literal words to the point it makes.",
    "讽刺作品如何用幽默进行批评：找到它的批评对象，识别它的手法，并透过字面意思读出它要表达的观点。",
  ],
  after: ["irony", "personification-and-hyperbole"],
  points: [
    label(
      "the-tool-of-the-satirist",
      ["The Tool of the Satirist", "讽刺者的手法"],
      [
        "**Satire** mocks a person, a group or an idea in order to criticize it and, often, to change it. Its main tools are **exaggeration**, which stretches a fault until it looks absurd; **irony**, which says the opposite of what is meant, often in a straight face; **parody**, which imitates the style of a known form, such as a news report or an advertisement, to mock it; and **reversal**, which turns the expected roles upside down, so that animals rule people or children teach adults.",
        "**讽刺作品**嘲弄某个人、某个群体或某种观念，以便批评它，并常常希望改变它。它的主要手法有：**夸张**，把缺点放大到荒谬可笑；**反讽**，一本正经地说出与本意相反的话；**戏仿**，模仿新闻报道、广告等人们熟知的形式的风格来嘲弄它；**颠倒**，把预期的角色颠倒过来，比如动物统治人类，孩子教导大人。",
      ],
      ["Which tool of satire does this passage mainly use?", "这段文字主要使用了哪种讽刺手法？"],
      `
        The new phone is so smart that it now makes all your decisions, including whom to marry and when to breathe.|exaggeration
        "What a wonderful idea," wrote the critic, "to build the new school next to the airport, so that children can learn to read lips."|irony
        BREAKING NEWS: Local Man Reads Entire Terms and Conditions, Doctors Baffled.|parody
        In the story, the cats hold elections every year and always choose the human who opens the most cans.|reversal
        The company's managers held so many meetings about efficiency that no one had time to work.|exaggeration
        The governor proudly announced that the new prison was the finest building the town had ever paid for, finer even than its schools.|irony
        Introducing new Silence Plus: now with 30 percent less noise, from the makers of Nothing.|parody
        In the cartoon, the children sit at the big desk and lecture their parents about screen time.|reversal
        The tourist took so many photographs of the sunset that he missed it completely, three evenings in a row.|exaggeration
        "Of course the river is safe to drink," said the factory owner, "as long as you are not alive."|irony
        WEATHER FORECAST: Sunny, with a 90 percent chance of being blamed on the government.|parody
        In the play, the servants give orders and the lord polishes their boots.|reversal
        The diet promised to make you lose weight so fast that you would float away by Friday.|exaggeration
        "How generous," the article said, "of the bank to give its directors a bonus for losing our money."|irony
        The poem imitates a grand epic to describe a war between two neighbors over a hedge.|parody
        In the fable, the sheep guard the farm, and the dogs graze in the field and complain about the grass.|reversal
        The traffic in the city was so slow that commuters celebrated birthdays in their cars.|exaggeration
        "Fortunately," said the minister, "the hospital has closed, so no one will have to wait for a bed."|irony
        A fake travel guide advises tourists to visit the town's famous pothole, now in its tenth year.|parody
        In the story, the robots worry that their human workers spend too much time thinking.|reversal
        The politician's speech was so long that two generations of listeners grew old during it.|exaggeration
        "A brilliant plan," the editor wrote, "to save money on teachers by having no students."|irony
        A mock instruction manual explains, in twelve numbered steps, how to open a door.|parody
        In the satire, the patients run the hospital and send the doctors home with bad advice.|reversal
        The influencer's breakfast photo took four hours, by which time the eggs had fossilized.|exaggeration
        "What a relief," the narrator says, "that the king has banned books, since reading was making people think."|irony
        The cartoon presents an advertisement for a car that runs on the tears of drivers stuck in traffic.|parody
        In the story, the students give the teacher a test, and he fails.|reversal
        The meeting to reduce paperwork produced a four-hundred-page report.|exaggeration
        "Our leader is so modest," the newspaper said, "that he has only forty statues of himself."|irony
      `,
      {
        exaggeration: L(
          "夸张",
          "The passage stretches a real fault or habit until it becomes absurd.",
          "这段文字把一个真实存在的缺点或习惯放大到荒谬的地步。",
          "The passage does not mainly stretch a fault to an absurd extreme.",
          "这段文字并不是主要把缺点放大到荒谬的程度。",
        ),
        irony: L(
          "反讽",
          "The words praise or approve on the surface, but the writer means the opposite.",
          "字面上是赞扬或赞同，但作者的意思恰恰相反。",
          "The passage does not say the opposite of what it means.",
          "这段文字并没有说出与本意相反的话。",
        ),
        parody: L(
          "戏仿",
          "The passage imitates a familiar form, such as a news headline, an advertisement or an epic, to mock its subject.",
          "这段文字模仿人们熟知的形式，如新闻标题、广告或史诗，来嘲弄它的对象。",
          "The passage does not imitate the style of a familiar form.",
          "这段文字并没有模仿某种人们熟知的形式的风格。",
        ),
        reversal: L(
          "颠倒",
          "The passage turns the usual roles upside down, so that the weak rule the strong or the young teach the old.",
          "这段文字把通常的角色颠倒过来，弱者统治强者，年轻人教导长者。",
          "The passage does not turn the usual roles upside down.",
          "这段文字并没有把通常的角色颠倒过来。",
        ),
      },
    ),
    choose(
      "the-target-of-the-satire",
      ["The Target of the Satire", "讽刺的对象"],
      [
        "Every satire has a **target**: the person, group, habit or idea it criticizes. The target is rarely named outright. To find it, ask what fault is being exaggerated or praised with irony, and who in the real world shows that fault. The **point** of the satire is the criticism it makes of that target.",
        "每部讽刺作品都有一个**对象**：它所批评的人、群体、习惯或观念。对象很少被直接点名。要找到它，就问一问：被夸大或被反讽地赞扬的是什么缺点，现实中又是谁有这个缺点。讽刺作品的**观点**就是它对这个对象的批评。",
      ],
      ["What is the main target of this satire?", "这段讽刺的主要对象是什么？"],
      `
        In the story, a town builds a giant statue of a smartphone and bows to it three times a day.|people's devotion to their phones|the high price that towns pay for building large statues|the dangers of building in towns
        The mock advertisement offers a cream that removes wrinkles, freckles, your nose and, eventually, your face.|beauty products that promise too much|doctors who perform cosmetic surgery on famous people|the cost of medicine
        The minister announces that to fight poverty, poor people will no longer be counted.|governments that hide problems instead of solving them|the difficulty of counting people|people who are poor
        A fake news story reports that a student finished her homework without once checking social media, and scientists want to study her.|our dependence on social media|students who study too hard|scientists who study teenagers
        In the cartoon, a factory pours smoke into the sky beside a huge sign reading "Proud to Be Green."|companies that pretend to care for the environment|the color green and what it is supposed to mean in advertising|the danger of smoke to workers
        The satire describes a school where students are graded on how quietly they sit, and the silent ones become leaders.|schools that value obedience over thinking|students who talk too much in class and disturb their teachers|the importance of quiet in class
        The story shows a city so in love with cars that it paves over its last park to make room for more lanes.|our dependence on cars|people who walk in parks|the cost of building roads
        In the play, a doctor prescribes the same expensive pill for every illness, from a cold to a broken leg.|doctors and drug companies who sell medicine for profit|people who break their legs and then have to wait for a doctor|the taste of pills
        A mock guide tells politicians how to answer any question without saying anything at all.|politicians who avoid honest answers|journalists and members of the public who ask too many questions|the length of interviews
        The article proposes that to reduce traffic, everyone should simply stay home forever.|simple-minded solutions to complex problems|people who stay at home|the cost of traffic lights
        The story imagines a world where people pay to be followed by cameras, so that others can watch them eat breakfast.|the craving for attention online|the rising price of cameras and the cost of filming people at home|the importance of breakfast
        In the cartoon, a rich man throws a coin to a beggar while cameras film his kindness.|charity done for show|beggars who ask for money|the cost of cameras
        The fable tells of a lion who passes a law that all animals must be the same size, then exempts himself.|rulers who place themselves above the law|lions who hunt other animals and keep the best of the meat for themselves|animals of different sizes
        A satirical poem praises a general who won every battle by never fighting one.|leaders who claim credit they have not earned|the dangers of war|poets who write about soldiers
        The story's university gives a degree to anyone who pays, and the most expensive degree is in honesty.|education sold for money|students who study honesty|the cost of buildings
        In the mock interview, a celebrity explains that she has read no books but has written three.|celebrity culture that rewards fame over substance|people who read books and look down on those who do not|authors who write too much
        The cartoon shows a giant shopping bag swallowing a family on the biggest sales day of the year.|consumer greed|the size of bags|families who go shopping together
        The satire proposes that the town save money by turning off the streetlights and handing out candles.|budget cuts that harm public safety|the beauty of candlelight compared with harsh electric streetlights|people who walk at night
        In the story, the committee to fight bureaucracy needs nine forms to approve its own lunch.|bureaucracy and endless paperwork|committees that spend too long eating lunch during their meetings|the cost of forms
        A fake headline reads: "Company Fires Workers to Pay for Seminar on Employee Happiness."|companies that talk about caring for workers while harming them|seminars that last too long|workers who are unhappy
        The novel describes a country where history books are rewritten every year to praise the current leader.|governments that control and falsify history|people who write history books and the publishers who sell them|the difficulty of learning history
        In the comic, a news channel spends an hour on a celebrity's new haircut and ten seconds on a war.|news media that value entertainment over serious news|people who cut their hair too often in order to look like celebrities|the length of a news program
        The satire describes a gym where members pay to stand next to the machines and take photographs.|exercise done for appearance rather than health|the high price of exercise machines and gym memberships today|people who take photos of nature
        A mock speech by a mayor celebrates the town's new bridge, which connects nothing to nowhere.|wasteful public spending for show|the difficult engineering of bridges that cross wide rivers|towns that have rivers
        In the story, the experts agree to agree on nothing, and are paid well for it.|experts who avoid useful conclusions|people who agree with each other|the cost of meetings
        The cartoon shows a parent texting "Look at me when I talk to you" to a child at the same table.|families who communicate through phones|children who text their friends too much during family meals|the cost of phones
        The satire imagines a restaurant where the food is invisible but the prices are enormous.|overpriced restaurants that sell style without substance|people who eat out|the danger of hungry diners
        The story's king declares the drought over, and orders everyone to stop being thirsty.|rulers who deny reality by decree|people who drink too much water|the dangers of drought for farmers
        A mock award goes to the city council for "Most Studies of a Pothole Never Fixed."|governments that study problems instead of fixing them|drivers who hit potholes|awards for public service
        In the fable, the foxes hold a conference on the safety of chickens.|people in power who claim to protect those they exploit|foxes who are hungry|farmers who keep chickens
      `,
      (right) => [
        `The target is ${right}: that is the real-world fault the passage exaggerates or praises with irony.`,
        `批评对象是“${right}”：这正是文段所夸大或反讽地赞扬的现实中的缺点。`,
      ],
      [
        [
          'The answer "{wrong}" names a surface detail of the story, not the fault in the real world that the satire criticizes.',
          "答案“{wrong}”说的是故事的表面细节，而不是讽刺作品所批评的现实中的缺点。",
        ],
        [
          'The answer "{wrong}" misses the satire: it treats the passage as if it were serious and literal.',
          "答案“{wrong}”没有看出讽刺：它把这段文字当成了严肃的字面陈述。",
        ],
      ],
    ),
  ],
});

/** readingTopics10b are the reading topics of grade 10 on nonfiction and satire. */
export const readingTopics10b: readonly TopicDef[] = [bias, numbers, satire];
