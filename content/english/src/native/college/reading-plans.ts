// College writing: the reading unit of the eighth theme, proposals and reports: eight original accounts of proposals
// and what came of them, from a community garden to a plan that failed. The places, funders and people are invented.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grades-6-8/reading-kit.ts";

const planning = { topic: "words-of-planning-and-proposals", weight: 0.3 } as const;
const requests = { topic: "reading-requests-for-proposals", weight: 0.3 } as const;
const lists = { topic: "parallel-lists-and-headings", weight: 0.1 } as const;

/** academic gives the edge to a batch of the shared academic words, which a passage uses as it goes. */
const academic = (n: 1 | 2 | 3) => ({ topic: `academic-words-${n}`, weight: 0.1 }) as const;

/** plansThatWorked is a reading unit of the college writing course on proposals and their results. */
export const plansThatWorked: ReadingUnitDef = {
  id: "plans-that-worked",
  title: t("Plans That Worked", "成功的计划"),
  passages: [
    passage(
      "a-grant-for-a-community-garden",
      t("A Grant for a Community Garden", "社区花园的资助申请"),
      `When the Millbrook Neighborhood Association decided to turn an empty lot into a community garden, its members had energy, volunteers and a strong sense of what the neighborhood needed. What they lacked was money. A local foundation offered grants of up to 20,000 for "projects that improve health and bring neighbors together", and the association decided to apply. Its first draft of a proposal was rejected. Its second was funded. The difference between them shows what funders look for.

The first draft was enthusiastic and vague. It described the lot, the volunteers' commitment and the joy that a garden would bring. It asked for 20,000, the maximum, without explaining how the money would be spent. The foundation's reply was polite and brief: the proposal did not address the criteria in the call for proposals.

The association's chair, Rosa Grant, went back to the call and read it carefully. It listed four criteria, each with a share of the score: the need for the project, its objectives and plan, its budget, and its sustainability after the grant ended. The first draft had addressed only the first, and only with feeling rather than evidence.

The second draft was organized around those four criteria, with a heading for each. Under "Need", it cited the city's own figures: the neighborhood had the lowest rate of access to fresh vegetables in the city, and no public green space within a fifteen minute walk. Under "Objectives", it set out three measurable aims: to create thirty garden plots, to provide vegetables to at least sixty households in the first year, and to hold twelve free workshops on growing food. Under "Plan", it gave a schedule with milestones: soil tested by March, beds built by April, plots allocated by May, first harvest by July.

The budget was the section that changed most. Instead of a single figure, it gave a table: 6,000 for soil and building materials, 4,500 for a water connection, 3,000 for tools, 2,500 for a fence, and 1,500 for workshop costs, a total of 17,500. Each item had a short rationale, and two of the estimates came from written quotes from local suppliers. The association had asked for less than the maximum, and the precision of the figures made the request credible.

Under "Sustainability", the draft explained how the garden would continue without the foundation. Each plot holder would pay a small annual fee, covering water and repairs. The city had agreed in writing to lease the lot for ten years at a nominal rent. And a committee of plot holders, elected each year, would manage the garden.

The proposal also included a section the call had not explicitly requested: risks. It named two, the possibility that the soil was contaminated and the possibility that volunteers would lose interest, and explained how each would be mitigated. The soil would be tested before any work began, and raised beds with new soil would be used if necessary. Volunteers would be organized in small teams with named leaders.

The garden opened in May. In its first year it had thirty plots, a waiting list of twenty households, and more workshops than planned. Grant later said that the most useful lesson had come from the first rejection: "We were writing about what we wanted. They wanted to know what we would do."`,
      [planning, requests, lists, academic(1)],
      [
        ask(
          t("Why was the association's first proposal rejected?", "社区协会的第一份申请为什么被拒绝了？"),
          t("It was vague and did not address the criteria in the call for proposals", "它内容空泛，没有回应征集通知中的评审标准"),
          [
            t("It asked for less money than the garden needed", "它申请的钱少于花园所需"),
            t("The foundation did not fund gardens", "基金会不资助花园项目"),
            t("The lot belonged to another city", "那块地属于另一个城市"),
          ],
          t(
            "The foundation replied that the proposal did not address the criteria in the call; it had addressed only need, and only with feeling rather than evidence.",
            "基金会回复说申请没有回应征集通知中的标准；它只谈到了需求，而且只有感情，没有证据。",
          ),
        ),
        ask(
          t("What made the budget in the second draft credible?", "第二稿中的预算为什么令人信服？"),
          t(
            "It itemized costs with reasons, and some estimates came from written quotes",
            "它逐项列出费用并说明理由，有些估价来自书面报价",
          ),
          [
            t("It asked for the maximum amount allowed", "它申请了允许的最高金额"),
            t("It gave a single total figure", "它只给出一个总数"),
            t("It left the costs to be decided later", "它把费用留待以后再定"),
          ],
          t(
            "The passage says the budget gave a table with a rationale for each item and two written quotes, and it asked for less than the maximum.",
            "文章说预算以表格列出各项费用并附理由，还有两份书面报价，而且申请金额低于上限。",
          ),
        ),
        ask(
          t("How did the proposal show that the garden would be sustainable?", "申请书怎样表明花园能够持续下去？"),
          t("Plot fees, a ten-year lease from the city and an elected committee", "地块使用费、市政府十年的租约以及选举产生的委员会"),
          [
            t("A promise of further grants from the foundation", "基金会承诺继续资助"),
            t("Selling the vegetables to supermarkets", "把蔬菜卖给超市"),
            t("Paying a full-time manager from the grant", "用资助款聘请全职管理员"),
          ],
          t(
            "Under Sustainability, the draft named annual plot fees, the city's written agreement to lease the lot for ten years, and a committee of plot holders.",
            "在“可持续性”部分，申请书提到每年的地块费用、市政府书面同意出租十年，以及由地块使用者组成的委员会。",
          ),
        ),
      ],
      ["Millbrook", "Rosa", "Grant"],
    ),
    passage(
      "a-school-recycling-plan",
      t("A School Recycling Plan", "学校的回收计划"),
      `At Ashford Secondary School, the bins for recycling had been in the corridors for six years, and almost nothing in them was recycled. A survey by a group of students found the reason. Most of what went into the recycling bins was mixed with food or other waste, and the company that collected it rejected entire loads as contaminated. The school paid for a recycling service that, in practice, sent nearly everything to the same place as ordinary rubbish.

The students, led by a sixteen year old named Kemi Ade, wrote a proposal to the school's governors. It is a useful model of how a small proposal can be both ambitious and feasible.

The proposal opened with a summary of one paragraph: the problem, the proposed solution, the cost and the expected result. Governors reading many papers at a meeting could understand the whole proposal from that paragraph alone. The detail followed.

The problem section relied on evidence the students had gathered themselves. Over two weeks, with the help of a science teacher, they had sorted and weighed the contents of the recycling bins. Only about a fifth of the material was clean enough to recycle. They also reported the collection company's figures, which showed that nine of the last ten loads had been rejected.

The solution had three parts, presented as a list in parallel form: replace the corridor bins with clearly labeled stations in three places; train a team of student monitors to check the stations at lunch; and run a short campaign in every class explaining what can and cannot be recycled. Each part responded directly to a cause identified in the evidence. The proposal did not try to solve every environmental problem at the school. It defined its scope narrowly, as reducing contamination in recycling, and said so.

The proposal was candid about what it did not know. It stated that similar schemes at two other schools had reduced contamination significantly, but acknowledged that those schools were smaller. It therefore proposed a trial of one term, with a clear test of success: at least half of the collected loads accepted by the company. If the test was met, the scheme would continue; if not, the students would report what had gone wrong.

The cost was small, mainly for new stations and printed signs, and the proposal showed that it would be recovered within two years from lower fees, since rejected loads were charged at a higher rate. This argument mattered. Governors are more willing to fund a project that pays for itself than one that only costs money, however worthy.

Finally, the proposal named who would be responsible for each part of the plan and when each milestone would be reached. Kemi would coordinate; a teacher would supervise the monitors; the business manager would deal with the collection company.

The trial met its target by the sixth week. By the end of the term, eight of ten loads were accepted. The governors extended the scheme to the whole year and asked the students to present their method to two other schools. Asked what made the proposal succeed, Kemi said that it was the decision to ask for less: "We didn't promise to save the planet. We promised to fix the bins."`,
      [planning, requests, lists, academic(1), academic(2), academic(3)],
      [
        ask(
          t("What was the cause of the recycling problem at the school?", "学校回收问题的原因是什么？"),
          t("Recycling was mixed with food and waste, so whole loads were rejected", "可回收物混入了食物和垃圾，导致整车都被拒收"),
          [
            t("The school had no recycling bins at all", "学校根本没有回收箱"),
            t("The collection company never came to the school", "回收公司从不到学校来"),
            t("Students refused to use the bins", "学生拒绝使用回收箱"),
          ],
          t(
            "The survey found that most material in the recycling bins was mixed with food or other waste, and the company rejected entire loads as contaminated.",
            "调查发现，回收箱中的大多数东西都混有食物或其他垃圾，回收公司把整车当作受污染的物品拒收。",
          ),
        ),
        ask(
          t("Why did the proposal suggest a trial of one term?", "为什么申请书建议先试行一个学期？"),
          t("Evidence from other schools was encouraging but those schools were smaller", "其他学校的证据令人鼓舞，但那些学校规模较小"),
          [
            t("The governors only allowed projects of one term", "校董会只允许为期一个学期的项目"),
            t("The students were leaving the school", "学生们即将离开学校"),
            t("The collection company required it", "回收公司要求这样做"),
          ],
          t(
            "The proposal acknowledged that the schools where similar schemes worked were smaller, so it proposed a one-term trial with a clear test of success.",
            "申请书承认类似方案奏效的学校规模较小，因此提议试行一个学期，并设定明确的成功标准。",
          ),
        ),
        ask(
          t("Why did the cost argument matter to the governors?", "费用方面的论证为什么对校董会很重要？"),
          t("The scheme would pay for itself through lower fees within two years", "这一方案能在两年内通过降低费用收回成本"),
          [
            t("The scheme cost nothing at all", "这一方案完全不花钱"),
            t("The students offered to pay for it", "学生们提出自己出钱"),
            t("Another school agreed to share the cost", "另一所学校同意分担费用"),
          ],
          t(
            "The passage says the cost would be recovered from lower fees, and governors are more willing to fund a project that pays for itself.",
            "文章说成本可以通过降低费用收回，而校董会更愿意资助能自负盈亏的项目。",
          ),
        ),
      ],
      ["Ashford", "Kemi", "Ade"],
    ),
    passage(
      "a-pitch-for-a-small-business",
      t("A Pitch for a Small Business", "小企业的融资陈述"),
      `Leila Haddad had baked bread for friends for years before she decided to open a bakery. She had found a small shop near a train station in the town of Corwick, and she needed 60,000 to equip it and cover her first six months. Her savings covered a third. For the rest she approached a bank and a small investment fund for local businesses. Her written plan, which both accepted, shows how a business proposal answers the questions an investor is bound to ask.

The plan began with a one-page summary. It stated what the business would sell, to whom, at what price, how much money it needed and when it expected to make a profit. An investor who read only this page could decide whether to read further.

The section on the market was based on observation, not hope. Leila had stood outside the station on six mornings and counted the people passing: about 2,400 each weekday between six and nine. She had visited the three nearby places that sold breakfast and noted their prices and their queues. She had also surveyed 150 commuters, of whom about a third said they would buy fresh bread or pastries on their way to work if a shop were convenient. From these figures she estimated, conservatively, that she might attract 150 customers a day in the first year.

The financial section turned that estimate into numbers. It showed expected sales, the cost of ingredients, rent, wages and equipment, month by month for two years. It showed when the bakery would begin to cover its costs, in the eighth month, and how much cash it would need until then. Importantly, it also showed what would happen if sales were a quarter lower than expected: the bakery would still survive, but would not cover its costs until the fourteenth month, and the plan explained how the owner would reduce costs in that case.

This analysis of a worse case was, according to the fund's manager, the main reason it invested. Every business plan predicts success. Few show that the owner has considered failure and knows what she would do about it. An investor is lending money against uncertainty, and a plan that evaluates its own risks is more persuasive than one that ignores them.

The plan was also honest about the owner's limits. Leila had years of experience baking, but none of running a business. She proposed to mitigate this weakness by taking a short course in small business accounting and by hiring a part-time bookkeeper. Investors do not expect founders to be perfect; they expect them to know where they are not.

Finally, the plan set out milestones that the investors could use to judge progress: the shop open by September, 100 customers a day by December, costs covered by the following May. These gave both sides a shared picture of what success would look like and an early warning if it did not arrive.

The bakery opened two weeks late, because the oven was delivered late. By its first December it was serving about 120 customers a day, fewer than planned, and Leila applied the cost savings she had described. It covered its costs in the eleventh month. Three years later, she opened a second shop, financed this time from her own profits.`,
      [planning, requests, lists, academic(1)],
      [
        ask(
          t("How did Leila estimate the number of customers the bakery might attract?", "莱拉是怎样估计面包店可能吸引的顾客人数的？"),
          t("By counting passers-by, visiting competitors and surveying commuters", "通过统计路过的人、走访竞争对手和调查通勤者"),
          [
            t("By asking the bank for its own figures", "向银行索要其数据"),
            t("By guessing from her friends' opinions", "根据朋友的意见猜测"),
            t("By copying another bakery's business plan", "照搬另一家面包店的商业计划"),
          ],
          t(
            "The passage says she counted people passing the station, visited three nearby places and surveyed 150 commuters, then estimated conservatively.",
            "文章说她统计了经过车站的人数，走访了附近三家店，调查了150名通勤者，然后作了保守估计。",
          ),
        ),
        ask(
          t("According to the fund's manager, what was the main reason the fund invested?", "据基金经理说，基金投资的主要原因是什么？"),
          t(
            "The plan showed what would happen, and what she would do, if sales were lower",
            "计划表明了如果销售额较低会怎样，以及她会怎么应对",
          ),
          [
            t("The plan predicted very large profits", "计划预测会有很高的利润"),
            t("Leila had run several businesses before", "莱拉以前经营过好几家企业"),
            t("The bakery needed very little money", "面包店需要的钱很少"),
          ],
          t(
            "The passage says the analysis of a worse case was the main reason: few plans show the owner has considered failure and knows what to do.",
            "文章说，对较差情况的分析是主要原因：很少有计划能表明经营者考虑过失败并知道如何应对。",
          ),
        ),
        ask(
          t("How did the plan deal with Leila's lack of business experience?", "计划怎样处理莱拉缺乏经营经验的问题？"),
          t("She proposed a course in accounting and a part-time bookkeeper", "她提出去上会计课程并聘请一名兼职记账员"),
          [
            t("It did not mention her lack of experience", "计划没有提及她缺乏经验"),
            t("She asked the bank to run the business", "她请银行来经营这家店"),
            t("She promised to work without wages", "她承诺不领工资地工作"),
          ],
          t(
            "The plan was honest about her limits and proposed to mitigate the weakness with a short course and a part-time bookkeeper.",
            "计划坦率地承认了她的不足，并提出通过短期课程和兼职记账员来弥补这一弱点。",
          ),
        ),
      ],
      ["Leila", "Haddad", "Corwick"],
    ),
    passage(
      "the-city-that-built-bicycle-lanes",
      t("The City That Built Bicycle Lanes", "修建自行车道的城市"),
      `Ten years ago, fewer than 2 in every 100 trips in the city of Lindau were made by bicycle. The streets were busy, the city's air quality was poor, and the few people who cycled did so in traffic, among buses and lorries. When the city council proposed a network of protected bicycle lanes, the proposal was controversial. Shop owners feared losing parking for customers; drivers feared longer journeys; some residents doubted that anyone would use the lanes at all. The plan that was eventually adopted, and the way it was presented, show how a public proposal can win support for a contested change.

The transport department's first decision concerned scope. Rather than propose a network for the whole city at once, it proposed a first phase of four routes, chosen because they connected the areas where most people lived with the places where most people worked and studied. Each route was described with a map, a timetable and a cost. The rationale for a phase, the proposal explained, was that it allowed the city to evaluate results before committing to a larger investment.

The second decision concerned evidence. The proposal did not simply assert that people would cycle if lanes were built. It cited the experience of three cities of similar size that had built protected lanes, showing how cycling had grown in each and how long the growth had taken. It also reported a survey of Lindau residents: about two fifths said they would consider cycling to work if they could do so separated from traffic. The proposal was careful not to treat this as a forecast, since people often say they will do things they do not do, but as evidence of potential demand.

The third decision concerned the objections. Rather than dismiss them, the proposal addressed each in its own section. To shop owners, it presented studies from other cities showing that people who arrive by bicycle shop more often, even if they spend less on each visit, and it proposed to keep loading spaces for deliveries. To drivers, it showed traffic models suggesting that journey times on the affected streets would rise by an average of about two minutes. To skeptics, it proposed counting cyclists on each route before and after construction and publishing the results.

The fourth decision concerned measurement. The proposal set out objectives for the first phase in numbers: to double the share of trips by bicycle on the four routes within three years, to reduce injuries to cyclists, and to keep the change in journey times for drivers under five minutes. It explained how each would be measured and when results would be reported to the council.

Construction of the first phase took two years and cost slightly more than planned. Three years after the first route opened, cycling on the four routes had more than tripled, injuries had fallen, and journey times for drivers had risen by about three minutes. Some shop owners remained unhappy; others reported more customers. On the strength of the published results, the council approved a second phase.

The lesson is not that every bicycle plan will succeed. It is that a contested proposal persuades best when it is limited in scope, honest about evidence, respectful of objections and specific about how success will be judged.`,
      [planning, requests, lists, academic(1), academic(3)],
      [
        ask(
          t("Why did the transport department propose only a first phase of four routes?", "交通部门为什么只提议第一期修建四条路线？"),
          t("To evaluate results before committing to a larger investment", "为了在作出更大投资之前先评估效果"),
          [
            t("Because the city had only four streets", "因为城市只有四条街"),
            t("Because the council refused any larger plan", "因为市议会拒绝任何更大的计划"),
            t("To avoid publishing any results", "为了避免公布任何结果"),
          ],
          t(
            "The proposal explained that a phase allowed the city to evaluate results before committing to a larger investment.",
            "提案解释说，分期建设可以让城市在投入更大资金前先评估效果。",
          ),
        ),
        ask(
          t("How did the proposal treat the survey of residents?", "提案怎样对待居民调查的结果？"),
          t("As evidence of potential demand, not as a forecast", "把它当作潜在需求的证据，而不是预测"),
          [
            t("As proof that two fifths of residents would cycle", "当作五分之二居民会骑车的证明"),
            t("As a reason to cancel the plan", "当作取消计划的理由"),
            t("As less important than the opinions of drivers", "认为它不如司机的意见重要"),
          ],
          t(
            "The passage says the proposal did not treat the survey as a forecast, since people often say they will do things they do not do, but as evidence of potential demand.",
            "文章说提案没有把调查当作预测，因为人们常说会做却并不做，而是把它当作潜在需求的证据。",
          ),
        ),
        ask(
          t("How did the proposal respond to the concerns of shop owners?", "提案怎样回应店主们的担忧？"),
          t(
            "With studies showing cyclists shop more often, and by keeping loading spaces",
            "用研究表明骑车的人购物更频繁，并保留装卸货车位",
          ),
          [
            t("It ignored their concerns entirely", "它完全忽略了他们的担忧"),
            t("It promised to pay them for lost customers", "它承诺赔偿他们失去的顾客"),
            t("It moved the lanes away from all shops", "它把车道都移离了商店"),
          ],
          t(
            "The proposal presented studies showing people who arrive by bicycle shop more often and proposed to keep loading spaces for deliveries.",
            "提案引用了骑车来的人购物更频繁的研究，并提议为送货保留装卸车位。",
          ),
        ),
      ],
      ["Lindau"],
    ),
    passage(
      "a-research-grant",
      t("A Research Grant", "科研经费申请"),
      `Every year, a national research council invites scientists to apply for grants of up to three years. The call for proposals runs to twelve pages. Most applicants read the first page, which describes the purpose of the program, and the last, which gives the deadline. The middle ten pages, which explain how proposals will be judged, are where successful applicants spend their time.

Dr Yusuf Bello, a biologist who studies how insects pollinate crops, had applied twice without success. Before his third attempt, he asked a colleague who had served on the council's review panel to read his previous proposals alongside the call. Her comments were blunt. The proposals described interesting science, she said, but they were written as if the reviewers already shared his enthusiasm and his knowledge. The reviewers, she pointed out, were scientists from several fields, reading forty proposals each in a few weeks. They needed to see quickly what the project would discover, why it mattered and whether it could be done.

The call listed its criteria explicitly: the importance of the question, the quality of the method, the feasibility of the plan, and the expected impact beyond the research community. Each was given equal weight. Bello's earlier proposals had devoted most of their length to the method, which he found most interesting, and very little to impact or feasibility.

His third proposal was rebuilt around the criteria. The first page stated the question in a sentence: why do certain wild bees visit some fields of a crop and ignore others nearby? It then explained, in plain language, why the question mattered: farmers in the region had seen yields fall, and some of the fall appeared to be caused by poor pollination. An answer could help farmers plan their fields to attract the bees they depend on.

The section on method was shorter than before but more precise. It described three studies, each designed to answer one part of the question, and showed how the results of the first would shape the second. A timeline divided the three years into stages with milestones, so that reviewers could see when each result would be available.

The section on feasibility addressed the doubts a reviewer might have. Bello had access to fields through an agreement with a farmers' cooperative, which he attached. He had already collected a season of preliminary data, which showed that the differences between fields were large enough to measure. And he named the risks, chiefly a bad season with few bees, and explained how the design would mitigate them, by spreading observations across two seasons.

The section on impact described how results would reach farmers: through workshops with the cooperative, a short guide written in plain language, and data shared openly with other researchers.

The budget allocated funds to each study and explained every major item. Bello removed a costly piece of equipment that he admitted was desirable but not essential. Reviewers, his colleague had told him, notice when a budget includes items the method does not need.

The third proposal was funded. In his acceptance letter, the council included the reviewers' comments. One wrote that the proposal was "unusually clear about what it would find out, how and why it matters". That, Bello later said, was exactly what he had finally tried to write.`,
      [planning, requests, lists, academic(2), academic(3)],
      [
        ask(
          t("What was wrong with Bello's earlier proposals, according to his colleague?", "据他的同事说，贝洛之前的申请书有什么问题？"),
          t("They assumed reviewers shared his knowledge and enthusiasm", "它们假定评审者和他有同样的知识和热情"),
          [
            t("They described science that was not interesting", "它们描述的科学研究没有意思"),
            t("They asked for too little money", "它们申请的钱太少"),
            t("They were submitted after the deadline", "它们是在截止日期之后提交的"),
          ],
          t(
            "His colleague said the proposals were written as if the reviewers already shared his enthusiasm and knowledge, though the reviewers came from several fields.",
            "他的同事说，这些申请书写得好像评审者已经和他有同样的热情和知识，而评审者其实来自多个领域。",
          ),
        ),
        ask(
          t("How had Bello's earlier proposals failed to match the call's criteria?", "贝洛之前的申请书在哪方面没有符合征集通知的标准？"),
          t(
            "They spent most of their length on method and little on impact or feasibility",
            "它们把大部分篇幅用在方法上，很少谈影响或可行性",
          ),
          [
            t("They addressed only impact and ignored method", "它们只谈影响，忽略了方法"),
            t("They did not include a research question", "它们没有提出研究问题"),
            t("They gave the criteria unequal weight on purpose", "它们故意对各项标准给予不同的比重"),
          ],
          t(
            "The passage says the call gave four criteria equal weight, but his proposals devoted most of their length to method and very little to impact or feasibility.",
            "文章说征集通知中的四项标准权重相同，但他的申请书把大部分篇幅用于方法，很少谈影响和可行性。",
          ),
        ),
        ask(
          t("Why did Bello remove a costly piece of equipment from his budget?", "贝洛为什么从预算中删去了一件昂贵的设备？"),
          t(
            "It was desirable but not essential, and reviewers notice items the method does not need",
            "它是可有可无的，而评审者会注意到方法并不需要的开支",
          ),
          [
            t("The council did not allow any equipment", "研究理事会不允许购买任何设备"),
            t("The cooperative already owned one", "合作社已经有一台"),
            t("He had already bought it with his own money", "他已经自己出钱买了"),
          ],
          t(
            "The passage says he admitted it was desirable but not essential, and his colleague had told him reviewers notice items the method does not need.",
            "文章说他承认那件设备并非必需，而他的同事提醒过他，评审者会注意到方法并不需要的开支。",
          ),
        ),
      ],
      ["Dr", "Yusuf", "Bello", "Bello's"],
    ),
    passage(
      "a-library-open-late",
      t("A Library Open Late", "延长开放时间的图书馆"),
      `The public library in the town of Easton closed at six every evening. Its staff had long suspected that the hours suited the library's traditional users, mostly retired people and parents with young children, but excluded others: students with nowhere quiet to study, and adults who worked during the day. When the library's director, Hannah Price, proposed opening until ten on four evenings a week, she knew the town council would ask two questions. Who would use it? And how would the town pay for it?

Her proposal answered the first question with evidence collected over a month. The library surveyed visitors and, more importantly, people who did not visit, by placing short questionnaires in the town's two secondary schools, its college and three large workplaces. Of about 900 people who replied, more than a third of those who rarely used the library said that its hours were the main reason. Among secondary students, the figure was nearly half. Many wrote that they had no quiet place to study at home.

The proposal did not ask the council to believe these figures alone. It proposed a pilot of six months, with late opening on four evenings, and set out clear objectives for the pilot: at least forty visitors on an average late evening, at least half of them people who had not used the library in the previous year, and no increase in complaints about noise from neighbors. It explained how each figure would be measured. Visitors would be counted at the door; a short card would ask late visitors whether they had used the library before; and complaints would be logged.

The second question, cost, was the harder one. Opening for sixteen more hours a week required staff, heating and lighting. Price's proposal showed the full cost in a table and then explained how it would be reduced. The library would staff the late evenings with one librarian and trained volunteers from the college, rather than with the usual team of three. It would close one rarely used room in the evenings to save heating. And it had secured a contribution from the college, whose students would benefit, covering about a quarter of the cost. The remaining cost to the town was about the same as the salary of one part-time worker.

The proposal also addressed risks. Some councillors had worried about safety in the evenings. The proposal described the lighting outside the building, a simple procedure for closing, and an arrangement with the local police to pass by at closing time during the first month.

The council approved the pilot by a narrow vote. The first weeks were quiet, and some councillors predicted failure. By the third month, however, late evenings averaged fifty five visitors, most of them students, and nearly two thirds were new users. There were no complaints about noise. At the end of the pilot, the council made the late hours permanent and asked the library to evaluate whether Saturday afternoons, which had also been mentioned in the survey, should be extended too.

Price later reflected that the pilot had been the key to the proposal's success. "A council can say no to a permanent change," she said. "It is much harder to say no to finding out."`,
      [planning, requests, lists, academic(1), academic(3)],
      [
        ask(
          t("Why did the library survey people who did not visit it?", "图书馆为什么要调查不来图书馆的人？"),
          t("To find out whether the hours kept potential users away", "为了弄清开放时间是否把潜在读者挡在了门外"),
          [
            t("To persuade them to pay for the late hours", "为了说服他们为延长开放时间付费"),
            t("Because regular visitors refused to answer", "因为常来的读者拒绝回答"),
            t("To find volunteers for the evenings", "为了给晚间找志愿者"),
          ],
          t(
            "The survey of non-users showed that more than a third of those who rarely used the library said its hours were the main reason.",
            "对非读者的调查显示，很少使用图书馆的人中，超过三分之一说开放时间是主要原因。",
          ),
        ),
        ask(
          t("How did the proposal reduce the cost of opening late?", "提案怎样降低了延长开放的成本？"),
          t(
            "By using one librarian with volunteers, closing a room and getting a college contribution",
            "安排一名馆员加志愿者、关闭一个房间并争取学院的资助",
          ),
          [
            t("By charging every visitor a fee", "向每位读者收费"),
            t("By closing the library in the mornings", "早上关闭图书馆"),
            t("By turning off all the lights", "关掉所有的灯"),
          ],
          t(
            "The proposal staffed evenings with one librarian and college volunteers, closed a rarely used room, and secured a contribution covering about a quarter of the cost.",
            "提案安排一名馆员和学院志愿者值晚班，关闭一个少用的房间，并争取到约四分之一费用的资助。",
          ),
        ),
        ask(
          t('What did Price mean by "It is much harder to say no to finding out"?', "普赖斯说“要拒绝‘试一试看’难得多”是什么意思？"),
          t(
            "A pilot asks only for a test, which is easier to approve than a permanent change",
            "试点只要求做一次试验，比永久性改变更容易获得批准",
          ),
          [
            t("Councils never reject any proposals", "议会从不否决任何提案"),
            t("The survey had already proved the change would work", "调查已经证明这一改变会成功"),
            t("Councillors were curious about the library", "议员们对图书馆很好奇"),
          ],
          t(
            "She said a council can say no to a permanent change, but a pilot only asks to find out, which is much harder to refuse.",
            "她说议会可以拒绝永久性的改变，但试点只是要求试一试，这就难以拒绝了。",
          ),
        ),
      ],
      ["Easton", "Hannah", "Price", "Price's", "councillors"],
    ),
    passage(
      "a-clinic-in-a-village",
      t("A Clinic in a Village", "村里的诊所"),
      `For the twelve villages of the Tarra valley, the nearest clinic was a journey of three hours by road, longer in the rainy season when the river crossing flooded. A small charity, working with the regional health office, proposed to open a clinic in the largest village, Kesu, to serve the whole valley. Its proposal to an international health fund, which approved it, is a careful example of planning under difficult conditions.

The fund's call for proposals placed particular weight on two criteria: whether a project responded to needs identified by the community itself, and whether it would continue after funding ended. Many proposals, a reviewer later said, treated these as formalities. This one built its whole plan around them.

The charity did not begin by deciding what the clinic would do. It began by asking. Over two months, its staff held meetings in each of the twelve villages, separately with men, women and elders, to find out which health problems mattered most to people and why they did or did not travel to the distant clinic. The answers shaped the plan. Women's most urgent concern was care during pregnancy and childbirth; travel to the clinic during labor was dangerous and often impossible. Parents were concerned about childhood fevers and diarrhea, which were common and sometimes fatal. These two needs defined the clinic's initial scope: maternal care and the treatment of common childhood illnesses, rather than the wider range of services that a larger clinic would provide.

The proposal was explicit about why it had limited its scope. A clinic that tried to do everything with two nurses would do nothing well. A clinic that did two things well could expand later.

The question of sustainability was answered in three ways. First, staff. Rather than bring nurses from the city, who often leave remote posts within a year, the plan proposed to train two women from the valley as nurses, with the regional health office agreeing to employ them once qualified. Second, supplies. The regional office agreed to include the clinic in its regular delivery of medicines, so that supplies did not depend on the charity. Third, ownership. A committee drawn from the twelve villages would oversee the clinic, and the villages would contribute labor to build and maintain it.

The proposal also set out risks and how it would mitigate them. Flooding might cut off the clinic from supplies for weeks each year, so the plan included a store of essential medicines for three months. Trained nurses might leave for better-paid work in the city; the agreement with the regional office included a commitment to work in the valley for at least four years after training.

The monitoring plan was simple and realistic: the number of births attended by a trained nurse, the number of children treated for fever, and the number of patients referred to the distant hospital. These figures would be collected by the nurses and reviewed by the village committee each quarter.

Five years after it opened, the clinic was run entirely by the regional health office. The proportion of births in the valley attended by a trained nurse had risen from about one in ten to more than six in ten. The fund's final evaluation noted that the project's most important decision had been made before any money was spent: the decision to listen first.`,
      [planning, requests, lists],
      [
        ask(
          t("How did the charity decide what the clinic would do?", "这家慈善机构是怎样决定诊所的服务内容的？"),
          t("By holding meetings in every village to learn which health needs mattered most", "在每个村庄召开会议，了解哪些健康需求最重要"),
          [
            t("By copying the services of a city hospital", "照搬城市医院的服务"),
            t("By asking the international fund what to offer", "询问国际基金该提供什么"),
            t("By choosing the services that were cheapest", "选择最便宜的服务"),
          ],
          t(
            "The passage says the charity began by asking: it held meetings in each of the twelve villages, and the answers shaped the plan.",
            "文章说慈善机构首先是去询问：它在十二个村庄分别召开会议，村民的回答决定了计划的内容。",
          ),
        ),
        ask(
          t("Why did the proposal limit the clinic's scope to two kinds of care?", "提案为什么把诊所的服务范围限定在两类医疗上？"),
          t("A clinic with two nurses that tried to do everything would do nothing well", "只有两名护士的诊所如果什么都做，就什么都做不好"),
          [
            t("The fund allowed only two services per clinic", "基金只允许每个诊所提供两项服务"),
            t("No one in the valley had any other health problems", "山谷里没有人有其他健康问题"),
            t("The regional office refused to support other services", "地区卫生部门拒绝支持其他服务"),
          ],
          t(
            "The proposal was explicit: a clinic that tried to do everything with two nurses would do nothing well, while one that did two things well could expand later.",
            "提案说得很明确：两名护士的诊所什么都做就什么都做不好，而把两件事做好的诊所以后可以扩展。",
          ),
        ),
        ask(
          t("Why did the plan train women from the valley as nurses?", "计划为什么培训本山谷的妇女当护士？"),
          t("Nurses from the city often leave remote posts within a year", "从城里来的护士常常不到一年就离开偏远岗位"),
          [
            t("Women from the valley did not need any training", "山谷的妇女不需要任何培训"),
            t("City nurses refused to work in clinics", "城里的护士拒绝在诊所工作"),
            t("It was a requirement of the river crossing", "这是过河的要求"),
          ],
          t(
            "The passage says nurses from the city often leave remote posts within a year, so local women were trained and the regional office agreed to employ them.",
            "文章说城里的护士常常不到一年就离开偏远岗位，所以培训了当地妇女，并由地区卫生部门同意雇用她们。",
          ),
        ),
      ],
      ["Tarra", "Kesu"],
    ),
    passage(
      "a-plan-that-failed",
      t("A Plan That Failed", "失败的计划"),
      `Not every proposal that is funded succeeds. The story of the Harbor Learning Hub, a project to provide free tablets and online lessons to secondary students in a coastal town, is worth telling because its failure was, in hindsight, written into its proposal. The proposal itself was well written, and it was funded generously. What it lacked became clear only when the project was implemented.

The proposal was submitted by a technology company working with the town's education office. It set out an ambitious objective: to raise examination results in mathematics and science by giving every student in the town's three secondary schools a tablet loaded with interactive lessons. It cited studies showing that some digital programs had improved learning. It included a detailed budget, a timeline with milestones for distribution, and a plan to train teachers in a single day before the school year began.

Two years later, an independent evaluation found that examination results had not changed. Many tablets were broken or lost; others were used mainly for games and videos. Teachers reported that the lessons did not match the curriculum they were required to teach, and that they had little time to integrate the tablets into their classes. In the poorest households, students often had no internet connection at home, so the online lessons could not be used outside school.

Reading the proposal again after the evaluation, its weaknesses are visible. The first was that it defined success in terms of what the project would deliver, tablets distributed and lessons installed, rather than what students would learn. Its milestones measured activity, not results. By its own measures, the project succeeded: every tablet was delivered on time.

The second was that it had not consulted the people who would have to make it work. Teachers were not asked whether the lessons fitted their curriculum, or how much time they had. Students and parents were not asked whether they had internet access at home. The proposal assumed these conditions rather than checking them.

The third was that it treated its evidence selectively. The studies it cited had found improvements in programs that combined technology with substantial support for teachers over months. The proposal took the technology and left out the support, which was expensive and less attractive to funders.

The fourth was that it had no plan for what would happen if things went wrong. There was no budget for repairs, no procedure for lost devices, and no point at which the project would pause to evaluate progress and adjust. Risks were mentioned in a single sentence that said they would be "managed as they arise".

The evaluation was not entirely negative. It noted that some teachers who had chosen to use the tablets had developed effective lessons, and recommended that any future project begin with those teachers. The education office later ran a smaller program built on their experience, with a year of support for teachers and devices kept at school. Its early results were modest but positive.

The lessons of the failure are the reverse of the lessons of success. Define objectives as results, not activities. Ask the people whose work the plan depends on. Read the evidence fully, including what it says about conditions. And plan for the ways a project might fail before it does.`,
      [planning, requests, lists, academic(1), academic(3)],
      [
        ask(
          t("What did the independent evaluation find?", "独立评估发现了什么？"),
          t("Examination results had not changed", "考试成绩没有任何变化"),
          [
            t("Examination results had risen sharply", "考试成绩大幅提高"),
            t("No tablets had been delivered", "一台平板电脑都没有发出去"),
            t("Teachers had refused to take part in training", "老师们拒绝参加培训"),
          ],
          t(
            "The passage says that two years later an independent evaluation found that examination results had not changed.",
            "文章说两年后的独立评估发现考试成绩没有变化。",
          ),
        ),
        ask(
          t("Why did the project succeed by its own measures despite failing?", "为什么这个项目虽然失败了，按它自己的标准却算成功？"),
          t(
            "Its milestones measured activity, such as tablets delivered, not what students learned",
            "它的里程碑衡量的是活动，比如发了多少平板，而不是学生学到了什么",
          ),
          [
            t("The evaluation was carried out by the company itself", "评估是由公司自己进行的"),
            t("The objectives were changed after the project ended", "项目结束后目标被修改了"),
            t("Students reported that they enjoyed the games", "学生们说他们喜欢玩游戏"),
          ],
          t(
            "The passage says the proposal defined success as what the project would deliver, so by its own measures it succeeded: every tablet was delivered on time.",
            "文章说提案把成功定义为项目交付了什么，所以按它自己的标准它成功了：每台平板都按时发放。",
          ),
        ),
        ask(
          t("How did the proposal treat its evidence selectively?", "提案是怎样有选择地使用证据的？"),
          t(
            "The studies combined technology with teacher support, but the proposal left the support out",
            "那些研究是把技术与对教师的支持结合起来的，提案却略去了支持部分",
          ),
          [
            t("It cited only studies that found no effect", "它只引用了没有发现效果的研究"),
            t("It did not cite any studies at all", "它根本没有引用任何研究"),
            t("It invented the results of the studies", "它编造了研究的结果"),
          ],
          t(
            "The passage says the studies found improvements in programs combining technology with substantial teacher support, and the proposal took the technology without the support.",
            "文章说那些研究发现，技术加上大量教师支持才有改进，而提案只取了技术，没有支持。",
          ),
        ),
      ],
      ["Harbor", "Hub"],
    ),
  ],
};
