// Grade 8: writing judged by a model, part one: an argument about history, an informative report from sources, a
// scientific explanation and a Gothic tale.

import { type TopicDef, t } from "@ga/content";
import { point, type WritingItem, writingGenerator } from "@ga/subject-english";
import { after } from "../grade-5/links.ts";
import { criterion, onePiece } from "../grade-5/writing-judged-a.ts";

/** limits are the length limits of a grade 8 essay. */
export const limits = { minWords: 140, maxChars: 4200 };

/** historyBank gives a historical question and primary sources to argue from. */
const historyBank: readonly WritingItem[] = [
  {
    task: 'Write an argument answering this question: Was the American Revolution mainly about taxes? Sources: (1) The Declaration of Independence, 1776: "all men are created equal" and have rights to "Life, Liberty and the pursuit of Happiness." (2) The Stamp Act protests, 1765: "No taxation without representation." (3) A Loyalist farmer, 1775: "The taxes are small; the quarrel is about who rules."',
    model:
      'The American Revolution began with arguments about taxes, but it became, above all, a fight over who had the right to rule.\n\nTaxes were the spark. In 1765, protesters against the Stamp Act cried, "No taxation without representation." Their complaint was not only the cost but the fact that colonists had no vote in the Parliament that taxed them.\n\nBy 1776, the argument had grown far larger. The Declaration of Independence claims that "all men are created equal" and have rights to "Life, Liberty and the pursuit of Happiness." These words say nothing about stamps or tea; they describe a new idea of government by the people.\n\nSome might argue that the colonists simply did not want to pay. Yet even a Loyalist farmer admitted in 1775 that "the taxes are small; the quarrel is about who rules." If money were the real issue, such small taxes would hardly have led to war.\n\nThe Revolution started with taxes, but its true cause was a demand for self-government.',
  },
  {
    task: 'Write an argument answering this question: Did the Industrial Revolution make life better for workers? Sources: (1) A mill worker, 1832: "We work fourteen hours, and the children fall asleep at the machines." (2) A factory owner, 1835: "Our cotton clothes every family in England at a price they can pay." (3) A report, 1900: wages had roughly doubled since 1850, and most workers could buy meat each week.',
    model:
      'In its early years, the Industrial Revolution made life harder for workers, even though it eventually raised their standard of living.\n\nFor the first generation in the mills, the cost was terrible. A worker in 1832 described working "fourteen hours" while "the children fall asleep at the machines." Long hours, danger and child labor were the daily price of the new factories.\n\nIt is true that the factories brought real benefits. A factory owner boasted in 1835 that his cotton "clothes every family in England at a price they can pay." Cheap goods did reach ordinary homes. A later report also shows that by 1900, wages had roughly doubled since 1850, and most workers could buy meat each week.\n\nHowever, these gains came slowly and only after reformers fought for shorter hours and safer work. The workers who suffered in the 1830s did not live to enjoy the wages of 1900.\n\nThe Industrial Revolution made life better in the long run, but for the workers who built it, it was first a time of hardship.',
  },
  {
    task: 'Write an argument answering this question: Was the Haitian Revolution as important as the American Revolution? Sources: (1) Toussaint Louverture, 1793: "I want liberty and equality to reign." (2) The Haitian constitution, 1805: slavery "is forever abolished." (3) An American newspaper, 1804: "the news from Saint-Domingue has terrified every slaveholder in the South."',
    model:
      'The Haitian Revolution was as important as the American Revolution, because it carried the idea of liberty to the people the American Revolution left out.\n\nThe American Revolution declared that all men were equal, yet slavery continued in the new nation. In Haiti, enslaved people themselves took up the same ideas. Toussaint Louverture declared in 1793, "I want liberty and equality to reign," and he meant liberty for everyone.\n\nHaiti made that promise law. Its constitution of 1805 states that slavery "is forever abolished." No other nation of the time had gone so far.\n\nSome argue that the American Revolution mattered more because the United States became a great power. Its influence was certainly wider. But Haiti\'s influence was felt too: an American newspaper reported in 1804 that "the news from Saint-Domingue has terrified every slaveholder in the South." Haiti showed the world that freedom could not be kept for some.\n\nThe American Revolution introduced the idea of equal rights; the Haitian Revolution proved how far that idea could go.',
  },
  {
    task: 'Write an argument answering this question: Were the Luddites, who broke machines in 1811 and 1812, simply against progress? Sources: (1) A Luddite letter, 1812: "We will never lay down our arms till the House of Commons passes an act to put down all machinery hurtful to the commonality." (2) A weaver, 1812: "My wages have fallen from twenty shillings to eight." (3) A magistrate, 1812: "They break only the frames of masters who pay below the agreed price."',
    model:
      'The Luddites were not simply against progress; they were fighting to protect their wages and their way of life.\n\nIt is easy to see them as enemies of all machines. A Luddite letter of 1812 promised to keep fighting until Parliament put down "all machinery hurtful to the commonality." On its own, this sounds like a war on technology.\n\nYet the key word is "hurtful." The Luddites objected to machines that harmed ordinary people. A weaver complained in 1812 that his wages had "fallen from twenty shillings to eight." For him, the new machines meant hunger.\n\nEven a magistrate, whose job was to punish them, noticed that they broke "only the frames of masters who pay below the agreed price." They chose their targets carefully, sparing employers who treated workers fairly.\n\nThe Luddites broke machines, but their real target was the unfair way those machines were used. They were protesting against poverty, not against the future.',
  },
  {
    task: 'Write an argument answering this question: Did the French Revolution achieve its goals? Sources: (1) The Declaration of the Rights of Man, 1789: "Men are born and remain free and equal in rights." (2) A Paris shopkeeper, 1794: "The prisons are full, and the guillotine works every day." (3) The Napoleonic Code, 1804: all male citizens are equal before the law, and noble privileges are ended.',
    model:
      'The French Revolution failed to bring the freedom it promised in its first years, but it did achieve its goal of ending noble privilege.\n\nThe Revolution began with bold hopes. The Declaration of the Rights of Man proclaimed in 1789 that "men are born and remain free and equal in rights." Freedom and equality were its two goals.\n\nWithin five years, freedom had turned into fear. A Paris shopkeeper wrote in 1794 that "the prisons are full, and the guillotine works every day." A revolution that killed thousands of its own people had clearly lost its way.\n\nStill, it would be wrong to call the Revolution a complete failure. Under Napoleon, the Code of 1804 made all male citizens equal before the law and ended the special privileges of nobles. One of the Revolution\'s great goals had become permanent law, although women were still excluded.\n\nThe French Revolution lost its promise of liberty for a time, but it won a lasting victory for equality under the law.',
  },
  {
    task: 'Write an argument answering this question: Was the railway the most important invention of the Industrial Revolution? Sources: (1) A merchant, 1840: "Goods that took a week by canal now reach London in a day." (2) A historian, writing about 1830 to 1850: towns on the railway grew quickly, while towns without it often shrank. (3) An engineer, 1800: "Without the steam engine, there would be no mills, no mines and no railways."',
    model:
      'The railway was not the most important invention of the Industrial Revolution; the steam engine that powered it was.\n\nThe railway certainly changed Britain. A merchant wrote in 1840 that "goods that took a week by canal now reach London in a day." A historian of the period also notes that towns on the railway grew quickly, while towns without it often shrank. Few inventions changed daily life so visibly.\n\nYet the railway depended on something older. As an engineer pointed out in 1800, "without the steam engine, there would be no mills, no mines and no railways." Steam engines pumped water from coal mines, drove the machines in the mills and, later, pulled the trains.\n\nSome would answer that the steam engine mattered only once the railway spread its effects across the country. But the mills and mines were already transforming Britain decades before the first passenger line opened in 1830.\n\nThe railway carried the Industrial Revolution across the land, but the steam engine was the power at its heart.',
  },
  {
    task: 'Write an argument answering this question: Should Simón Bolívar be remembered as a liberator? Sources: (1) Bolívar, 1815: "the bonds that united us to Spain have been severed." (2) Bolívar, 1816: he promised freedom to enslaved people who joined his army. (3) A critic, 1828: "The Liberator now rules as a dictator."',
    model:
      'Simón Bolívar should be remembered as a liberator, even though his later rule fell short of his ideals.\n\nBolívar led the struggle that ended Spanish rule over much of South America. In 1815, he declared that "the bonds that united us to Spain have been severed." His armies made that statement true for the lands that became Venezuela, Colombia, Ecuador, Peru and Bolivia.\n\nHis idea of freedom also reached beyond independence. In 1816, he promised freedom to enslaved people who joined his army, connecting the fight against Spain with the fight against slavery.\n\nCritics have a point. In 1828, one complained that "the Liberator now rules as a dictator," and Bolívar did take great power for himself in his last years. But he took it in a time of civil war, trying to hold together the nations he had freed, and he gave it up before he died.\n\nBolívar was an imperfect leader, but the freedom he won for millions of people makes the title of Liberator deserved.',
  },
  {
    task: 'Write an argument answering this question: Did the abolition of the slave trade in Britain in 1807 happen mainly because of protest? Sources: (1) Olaudah Equiano, 1789, a formerly enslaved writer: his book told readers of "the horrors" of the slave ships. (2) A petition, 1792: signed by about 400,000 people asking Parliament to end the trade. (3) An economist, 1806: the sugar islands were earning less, and the trade was "no longer so profitable."',
    model:
      'Britain abolished the slave trade in 1807 mainly because of public protest, though falling profits made the change easier.\n\nThe protest movement changed what British people knew and felt. Olaudah Equiano, who had been enslaved himself, published a book in 1789 that showed readers "the horrors" of the slave ships. His story made the suffering impossible to ignore.\n\nOrdinary people then acted. In 1792, about 400,000 people signed a petition asking Parliament to end the trade. Such a huge number shows how widely the protest had spread.\n\nSome historians argue that money mattered more. An economist noted in 1806 that the sugar islands were earning less and the trade was "no longer so profitable." This probably made some members of Parliament less willing to defend it. However, a trade that still earned money for powerful families would not have ended without pressure from outside.\n\nFalling profits opened the door, but it was the protest of Equiano and hundreds of thousands of others that pushed abolition through.',
  },
  {
    task: 'Write an argument answering this question: Were women the forgotten heroes of the American Revolution? Sources: (1) Abigail Adams, 1776: she asked her husband to "remember the ladies." (2) A soldier, 1778: a woman named Mary Hays "carried water to the guns all day under fire." (3) A merchant, 1779: "The women of Philadelphia raised more money for the army than the Congress could."',
    model:
      'Women were the forgotten heroes of the American Revolution, because their work was essential but their rights were ignored.\n\nWomen took part in the fighting itself. A soldier reported in 1778 that a woman named Mary Hays "carried water to the guns all day under fire." Without such help, the soldiers could not have kept their cannons working.\n\nWomen also supported the war at home. A merchant noted in 1779 that "the women of Philadelphia raised more money for the army than the Congress could." Their efforts fed and clothed the troops.\n\nSome might say that women are not forgotten, since figures like Abigail Adams are well known. Yet Adams is remembered partly for a request that was refused: in 1776, she asked her husband to "remember the ladies" in the new nation\'s laws. The new nation did not, and women would wait almost 150 years for the vote.\n\nWomen helped win independence, but the Revolution forgot them when it handed out the rights they had fought for.',
  },
  {
    task: 'Write an argument answering this question: Did the Factory Act of 1833 really protect children? Sources: (1) The Factory Act, 1833: children under nine could not work in textile mills, and children under thirteen could work no more than nine hours a day. (2) A factory inspector, 1836: "There are only four of us to visit more than 3,000 mills." (3) A mother, 1835: "My boy is eight, but the master says he is nine."',
    model:
      'The Factory Act of 1833 protected children on paper, but in practice its protection was weak.\n\nThe law itself was a real step forward. It banned children under nine from working in textile mills and limited children under thirteen to nine hours a day. For the first time, Parliament set clear rules for child labor.\n\nYet a law protects no one if it is not enforced. A factory inspector admitted in 1836 that "there are only four of us to visit more than 3,000 mills." Most mills could break the rules for years without being visited.\n\nEmployers also found ways around the law. A mother complained in 1835, "My boy is eight, but the master says he is nine." Since there were no birth certificates yet, ages were easy to lie about.\n\nSome argue that the Act still mattered, because it set an example for stronger laws later. That is true, but the children of the 1830s needed protection then.\n\nThe Factory Act was an important beginning, but it did not truly protect the children it was written for.',
  },
  {
    task: 'Write an argument answering this question: Was the Boston Tea Party justified? Sources: (1) A Boston newspaper, 1773: "The tea tax is a chain on our necks, put there by a Parliament in which we have no voice." (2) A British official, 1774: "Three hundred and forty chests of private property were thrown into the sea." (3) Benjamin Franklin, 1774: the tea should be paid for, because the company\'s owners had done the colonists no wrong.',
    model:
      'The Boston Tea Party was justified as a protest, but its destruction of private property made it harder to defend.\n\nThe colonists had a real grievance. A Boston newspaper of 1773 called the tea tax "a chain on our necks, put there by a Parliament in which we have no voice." The colonists had asked again and again to be heard, and they had been ignored. Dumping the tea was a dramatic way to refuse a tax they had never agreed to.\n\nHowever, the protest had a cost that its supporters could not easily explain away. A British official reported that "three hundred and forty chests of private property were thrown into the sea." The tea belonged to a company, not to Parliament.\n\nEven some colonists were troubled. Benjamin Franklin, who supported the colonial cause, argued in 1774 that the tea should be paid for, because its owners had done the colonists no wrong.\n\nThe Boston Tea Party was a justified act of resistance against taxation without representation, but Franklin was right that destroying the property of people who had done no harm weakened the colonists\' claim to be defending their rights.',
  },
  {
    task: 'Write an argument answering this question: Did the Chartists fail? Sources: (1) The People\'s Charter, 1838: six demands, including a vote for every man, secret ballots and pay for members of Parliament. (2) A newspaper, 1848: "For the third time, Parliament has thrown the great petition aside." (3) A historian, writing in 1990: "By 1918, five of the Charter\'s six points were law."',
    model:
      'The Chartists failed in their own time, but they succeeded in the long run, because their ideas became the basis of British democracy.\n\nAt first glance, the movement looks like a defeat. The People\'s Charter of 1838 made six demands, including a vote for every man, secret ballots and pay for members of Parliament. Millions of people signed petitions supporting it. Yet in 1848 a newspaper reported that "for the third time, Parliament has thrown the great petition aside." Not one demand was granted while the movement was strong.\n\nSome would say that a movement that wins nothing has failed. That view is understandable, because many Chartists were imprisoned and the movement had faded by the 1850s.\n\nHowever, ideas can outlive the people who first fight for them. A historian points out that "by 1918, five of the Charter\'s six points were law." The Chartists had made demands that once seemed extreme into ones that later generations accepted as normal.\n\nThe Chartists lost their battles, but in the end they won the argument, and that is not failure.',
  },
];

/** sourcesBank gives two short sources on one subject for a report. */
const sourcesBank: readonly WritingItem[] = [
  {
    task: "Write an informative report about the growth of Manchester from these two sources. Source A, a census summary: population about 75,000 in 1801 and about 300,000 in 1851; more than 100 cotton mills by 1830. Source B, a doctor's report of 1840: many families lived in cellars; one toilet was shared by up to 200 people; fever spread quickly in crowded streets.",
    model:
      "In the first half of the nineteenth century, Manchester grew faster than almost any city in the world, and its people paid a heavy price for that growth.\n\nAccording to the census, Manchester's population rose from about 75,000 in 1801 to about 300,000 in 1851, so it quadrupled in fifty years. The cause was cotton. The census summary records more than 100 cotton mills in the city by 1830, and each one drew workers from the countryside.\n\nThe city's housing could not keep up with this flood of people. A doctor's report of 1840 found that many families lived in damp cellars. In some streets, one toilet was shared by up to 200 people.\n\nThese conditions harmed people's health. The same doctor's report explains that fever spread quickly through the crowded streets, where clean water and fresh air were scarce.\n\nTaken together, the two sources show a city transformed by industry. The mills that made Manchester rich also crowded its workers into homes that made them sick.",
  },
  {
    task: "Write an informative report about the first passenger railway from these two sources. Source A, a railway company history: the Liverpool and Manchester Railway opened in 1830; it was 35 miles long; trains reached about 30 miles per hour. Source B, a newspaper of 1831: about 1,100 passengers travelled each day; the journey took under two hours instead of about four by coach; coal and cotton also travelled by train.",
    model:
      "The Liverpool and Manchester Railway, the first railway built mainly for passengers, changed how people and goods moved in Britain.\n\nAccording to the railway company history, the line opened in 1830 and ran for 35 miles between the two cities. Its trains reached about 30 miles per hour, a speed few people had ever travelled before.\n\nThe railway quickly became popular. A newspaper of 1831 reported that about 1,100 passengers travelled on it each day. The same newspaper explained why: the journey took under two hours, while the old coach needed about four.\n\nThe railway carried more than people. The newspaper adds that coal and cotton travelled by train as well, linking Manchester's mills with the port of Liverpool.\n\nBoth sources show that the railway was a success from the start. By cutting travel time in half and carrying both passengers and goods, it showed the rest of Britain, and soon the world, what railways could do.",
  },
  {
    task: "Write an informative report about child labor in British mines from these two sources. Source A, the Mines Report of 1842: children as young as five worked underground; some sat alone in the dark for twelve hours opening ventilation doors; girls and boys pulled coal carts on all fours. Source B, the Mines Act of 1842: banned all women and girls from working underground; banned boys under ten; appointed one inspector for all of Britain's mines.",
    model:
      "In 1842, a government report revealed the conditions of children in British coal mines, and Parliament passed a law to change them.\n\nAccording to the Mines Report of 1842, children as young as five worked underground. Some of the youngest sat alone in the dark for twelve hours at a time, opening and closing doors to let air through the tunnels. The report also describes girls and boys pulling carts of coal on all fours.\n\nThe report shocked the public, and the Mines Act followed in the same year. The Act banned all women and girls from working underground and banned boys under the age of ten.\n\nHowever, the Act also shows the limits of reform. It appointed only one inspector for all of Britain's mines, so the new rules were difficult to enforce.\n\nTogether, the two sources show both the problem and the response. The report exposed the suffering of children in the mines, and the Act began to protect them, although its protection depended on enforcement that was still weak.",
  },
  {
    task: "Write an informative report about the cholera outbreak in London in 1854 from these two sources. Source A, Dr. John Snow's notes: 616 people died near Broad Street; most of the dead had drunk water from one public pump; workers at a nearby brewery, who drank beer, mostly survived. Source B, a city record: the pump handle was removed on 8 September 1854; new deaths in the area fell soon after; sewers were later rebuilt across London.",
    model:
      "In 1854, an outbreak of cholera in London led to one of the most important discoveries in public health.\n\nAccording to Dr. John Snow's notes, 616 people died in the streets around Broad Street. Snow found that most of the dead had drunk water from the same public pump. He also noticed that workers at a nearby brewery, who drank beer instead of water, mostly survived.\n\nThis evidence pointed to the water as the cause. The city record shows that the handle of the pump was removed on 8 September 1854, so that no one could use it. According to the same record, new deaths in the area fell soon after.\n\nThe outbreak had lasting effects. The city record adds that sewers were later rebuilt across London to keep dirty water away from drinking water.\n\nTaken together, the sources show how careful observation solved a deadly mystery. Snow's notes identified the pump, the city acted on his evidence, and London rebuilt its sewers to prevent future outbreaks.",
  },
  {
    task: "Write an informative report about the Lowell mill girls from these two sources. Source A, a mill company record of 1840: about 8,000 workers in Lowell's mills, most of them young women aged 15 to 30; a working day of about 12 hours; workers lived in company boarding houses. Source B, the Lowell Offering, a magazine written by the workers: the women wrote stories and poems; they went on strike in 1836 when their rents were raised.",
    model:
      "In the 1830s and 1840s, the textile mills of Lowell, Massachusetts, employed thousands of young women, who became known as the Lowell mill girls.\n\nAccording to a mill company record of 1840, about 8,000 people worked in Lowell's mills, and most of them were young women between 15 and 30. Their working day lasted about 12 hours. The same record shows that the workers lived in boarding houses owned by the company.\n\nThe mill girls were more than workers. The Lowell Offering, a magazine written by the women themselves, published their stories and poems, which shows that many of them were educated and ambitious.\n\nThey also stood up for themselves. According to the Lowell Offering, the women went on strike in 1836 when the companies raised the rent of the boarding houses.\n\nThe two sources give different views of the same people. The company record shows their long hours and controlled lives, while their own magazine shows writers and organizers who shaped their own story.",
  },
  {
    task: "Write an informative report about the telegraph from these two sources. Source A, an encyclopedia: Samuel Morse sent the first long-distance message in 1844, between Washington and Baltimore; messages used a code of dots and dashes. Source B, a newspaper of 1866: a cable across the Atlantic Ocean now joined Britain and America; news that once took ten days by ship now arrived in minutes.",
    model:
      "The telegraph was the first invention that let people send messages faster than any traveller could carry them.\n\nAccording to the encyclopedia, Samuel Morse sent the first long-distance telegraph message in 1844, along a wire between Washington and Baltimore. Messages were sent in a code of short and long signals, written as dots and dashes, which an operator turned back into letters.\n\nWithin about twenty years, the telegraph had crossed an ocean. A newspaper of 1866 reported that a cable along the floor of the Atlantic now joined Britain and America.\n\nThe effect on news was dramatic. The same newspaper explained that news which once took ten days to cross the ocean by ship now arrived in minutes.\n\nBoth sources show how quickly the telegraph changed communication. In just over twenty years, it grew from a single line between two American cities into a network that connected continents, and the world began to share its news almost at once.",
  },
  {
    task: 'Write an informative report about the Great Exhibition of 1851 from these two sources. Source A, an official guide: held in the Crystal Palace in London\'s Hyde Park; the building used about 300,000 panes of glass; over 100,000 objects from around the world were shown. Source B, a ticket record: about 6 million visits in under six months; cheap "shilling days" let working families attend; profits paid for museums in South Kensington.',
    model:
      'In 1851, London held the Great Exhibition, a huge display of the inventions and goods of the industrial age.\n\nAccording to the official guide, the exhibition took place in the Crystal Palace, a building in Hyde Park made of iron and glass. The guide records that the building used about 300,000 panes of glass. Inside, over 100,000 objects from around the world were on show, from steam engines to fine silks.\n\nThe exhibition drew enormous crowds. The ticket record shows about 6 million visits in under six months. Many of these visitors came on cheap "shilling days," which, according to the same record, allowed working families to attend.\n\nThe exhibition also left a lasting legacy. The ticket record explains that its profits paid for museums in South Kensington, which still stand today.\n\nTogether, the sources show an event that celebrated industry and welcomed people of every class. The Great Exhibition displayed what the industrial age had achieved and left London museums that are still visited by millions.',
  },
  {
    task: "Write an informative report about gas lighting in cities from these two sources. Source A, a history of London: the first public street lit by gas was Pall Mall in 1807; by 1823 about 40,000 gas lamps lit 215 miles of London streets. Source B, a police report of 1830: streets lit by gas had fewer robberies; shops and factories could stay open after dark.",
    model:
      "In the early nineteenth century, gas lighting changed life in cities by turning dark streets into lit ones.\n\nAccording to a history of London, the first public street to be lit by gas was Pall Mall, in 1807. The new lights spread quickly. The same history records that by 1823, about 40,000 gas lamps lit 215 miles of London's streets.\n\nThe lamps changed the city at night. A police report of 1830 found that streets lit by gas had fewer robberies than dark ones, since thieves could no longer hide in the shadows.\n\nGas lighting also changed work. The police report notes that shops and factories could now stay open after dark, which lengthened the working day for many people.\n\nTaken together, the two sources show that gas lighting did more than make streets brighter. In less than twenty years, it made London's streets safer at night and allowed the city's businesses to keep working long after sunset.",
  },
  {
    task: "Write an informative report about the spinning jenny from these two sources. Source A, a history of textiles: invented by James Hargreaves around 1764; a worker turning one wheel could spin 8 threads at once, and later models spun 80; before this, a spinner spun one thread at a time. Source B, a letter of 1768: spinners in Blackburn broke into Hargreaves's house and destroyed his machines; they feared losing their work.",
    model:
      "The spinning jenny was one of the first machines of the Industrial Revolution, and it changed the work of spinning thread.\n\nAccording to a history of textiles, James Hargreaves invented the spinning jenny around 1764. Before this, a spinner could spin only one thread at a time on a spinning wheel. With the jenny, a worker turning one wheel could spin 8 threads at once, and the history notes that later models spun as many as 80.\n\nNot everyone welcomed the machine. A letter of 1768 describes how spinners in Blackburn broke into Hargreaves's house and destroyed his machines. The letter explains that they feared the jenny would take away their work.\n\nThe two sources show both sides of the invention. The history of textiles shows how much faster the jenny made spinning, while the letter shows that the same speed threatened the livelihoods of hand spinners.\n\nThe spinning jenny multiplied what one worker could produce, but it also gave an early sign of the conflict between machines and workers that would mark the Industrial Revolution.",
  },
  {
    task: "Write an informative report about the Penny Post from these two sources. Source A, a Post Office record: introduced in 1840 by Rowland Hill; any letter up to half an ounce cost one penny to send anywhere in Britain; the first stamp, the Penny Black, was printed. Source B, a Post Office report of 1850: about 76 million letters were sent in 1839, and about 347 million in 1850; many working people began writing to family for the first time.",
    model:
      "The Penny Post, introduced in Britain in 1840, made sending a letter cheap enough for almost everyone.\n\nAccording to a Post Office record, Rowland Hill introduced the Penny Post in 1840. Under the new system, any letter weighing up to half an ounce cost one penny to send anywhere in Britain. The same record notes that the first postage stamp, the Penny Black, was printed for the purpose.\n\nThe change had a huge effect. A Post Office report of 1850 shows that about 76 million letters were sent in 1839, the year before the reform. By 1850, the number had risen to about 347 million, more than four times as many.\n\nThe report also describes who was writing. According to the report, many working people began writing to their families for the first time, since the old prices had been too high for them.\n\nTogether, the sources show how a simple reform changed communication. By lowering the price to one penny, the Penny Post multiplied the number of letters and gave ordinary families a new way to stay in touch.",
  },
  {
    task: "Write an informative report about Bazalgette's sewers from these two sources. Source A, a history of London: after the Great Stink of 1858, Parliament approved a plan by the engineer Joseph Bazalgette; about 1,100 miles of street sewers and 82 miles of main sewers were built; the main work was finished in 1875. Source B, a public health report: London had cholera outbreaks in 1832, 1849 and 1854 that killed more than 30,000 people; after the sewers were built, the city had only one more outbreak, in 1866, in an area not yet connected.",
    model:
      "In the 1860s and 1870s, the engineer Joseph Bazalgette built a system of sewers that transformed the health of London.\n\nAccording to a history of London, the project began after the Great Stink of 1858, when the smell of the River Thames became unbearable. Parliament approved Bazalgette's plan, and workers built about 1,100 miles of street sewers and 82 miles of main sewers. The main work was finished in 1875.\n\nA public health report shows why the sewers mattered. London suffered outbreaks of cholera in 1832, 1849 and 1854, which killed more than 30,000 people in all. After the sewers were built, the city had only one more outbreak, in 1866, and the report notes that it struck an area that had not yet been connected to the new system.\n\nTogether, the sources show that Bazalgette's sewers carried waste away from the river that Londoners drank from. The history describes the size of the project, and the health report shows its result: one of the deadliest diseases of the age largely disappeared from the city.",
  },
  {
    task: 'Write an informative report about the match girls\' strike of 1888 from these two sources. Source A, a union record: about 1,400 women and girls at the Bryant and May factory walked out in July 1888; they were fined for talking and for dropping matches; after three weeks, the company ended the fines. Source B, a newspaper article of 1888: many workers suffered from "phossy jaw," a disease caused by white phosphorus; the strikers marched to Parliament and won public support.',
    model:
      'In July 1888, about 1,400 women and girls who made matches at the Bryant and May factory in London went on strike, and they won.\n\nA union record describes the strike and its causes. The workers were fined for small offenses, such as talking or dropping matches, and the fines took away much of their pay. After three weeks on strike, the company agreed to end the fines.\n\nA newspaper article of 1888 adds another reason the workers were angry. Many suffered from "phossy jaw," a disease caused by the white phosphorus used to make the matches, which rotted the bones of the jaw. The article also reports that the strikers marched to Parliament and gained the support of the public.\n\nThe two sources together give a fuller picture than either one alone. The union record explains what the workers demanded and won, while the newspaper shows the danger they faced and how they brought their cause before the public. Their success showed that even workers with little power could change their conditions by acting together.',
  },
];

/** scienceBank gives a scientific question with data for an explanation. */
const scienceBank: readonly WritingItem[] = [
  {
    task: "Write a scientific explanation answering this question: Why did the finches' beaks change on Daphne Major? Data: Before a drought in 1977, the average beak depth was 9.4 mm. During the drought, small soft seeds ran out, and only large hard seeds were left. About 85 percent of the finches died. After the drought, the average beak depth of the survivors' young was 9.9 mm.",
    model:
      "The finches' beaks on Daphne Major became deeper because the drought favored birds that could crack large, hard seeds. This is an example of natural selection.\n\nThe evidence comes from measurements made before and after the drought of 1977. Before the drought, the average beak depth was 9.4 millimeters. During the drought, the small, soft seeds ran out, and only large, hard seeds were left. About 85 percent of the finches died. Afterward, the young of the survivors had an average beak depth of 9.9 millimeters.\n\nThe reasoning connects these facts. A deeper beak is stronger, so birds with deeper beaks could crack the hard seeds and survive, while many birds with shallower beaks starved. Because beak depth is passed from parents to their young, the next generation inherited deeper beaks on average.\n\nThis study covers one island and one drought, so it does not prove that every population changes this quickly. However, it strongly suggests that natural selection can change a species within a few generations when its environment changes sharply.",
  },
  {
    task: "Write a scientific explanation answering this question: Why did dark moths become more common near Manchester in the 1800s? Data: In 1848, almost all peppered moths near Manchester were pale. Soot from factories blackened tree trunks. By 1895, about 98 percent of the moths were dark. In experiments, birds ate more pale moths than dark ones on sooty trees.",
    model:
      "Dark peppered moths became more common near Manchester because, once the trees were blackened by soot, birds could see and eat the pale moths more easily.\n\nThe evidence shows a striking change. In 1848, almost all the peppered moths near Manchester were pale. As factories filled the air with soot, the trunks of the trees turned black. By 1895, about 98 percent of the moths were dark. Later experiments found that birds ate more pale moths than dark ones on sooty trees.\n\nThe reasoning explains the change. Moths rest on tree trunks during the day. On a black trunk, a pale moth stands out, while a dark moth is hidden. Because birds ate more of the pale moths, more dark moths survived to breed, and they passed their dark color to their young. Over many generations, the dark form became most common.\n\nThese data come from one region, but they suggest that camouflage and predators can change a population quickly when its surroundings change.",
  },
  {
    task: "Write a scientific explanation answering this question: Why do the fish in Mexican caves have such small eyes? Data: Cave fish live in complete darkness. River fish of the same species have full-sized eyes. Cave fish in three separate caves all have tiny eyes or none. Building and running eyes uses up to 15 percent of a young fish's energy.",
    model:
      "The cave fish of Mexico have very small eyes because, in total darkness, eyes are of no use but still cost a great deal of energy.\n\nThe evidence comes from comparing fish of the same species in different places. Fish that live in rivers have full-sized eyes. Fish that live in caves, where there is no light at all, have tiny eyes or none. This pattern appears in three separate caves. Studies have also found that building and running eyes can use up to 15 percent of a young fish's energy.\n\nThe reasoning connects these facts. In a dark cave, an eye cannot help a fish find food or escape danger. A fish that spends less energy on eyes has more energy to grow and survive. Over many generations, fish with smaller eyes were more likely to survive and pass on their traits.\n\nBecause the same change happened in three caves, the evidence suggests that it is not chance. However, scientists are still studying whether energy is the only reason.",
  },
  {
    task: "Write a scientific explanation answering this question: Why did bacteria in hospitals become resistant to penicillin? Data: Penicillin came into wide use in the 1940s. In 1946, about 14 percent of one kind of hospital bacteria could survive penicillin. By 1950, about 59 percent could. A few bacteria in any large group carry genes that let them survive the drug.",
    model:
      "Bacteria in hospitals became resistant to penicillin because the drug killed the bacteria it could affect and left the resistant ones to multiply.\n\nThe evidence shows a rapid change. Penicillin came into wide use in the 1940s. In 1946, about 14 percent of one kind of hospital bacteria could survive it. Only four years later, in 1950, about 59 percent could. Scientists also know that in any large group of bacteria, a few carry genes that let them survive the drug.\n\nThe reasoning explains how this happened. Each time penicillin was used, it killed most of the bacteria but not those with resistance genes. The survivors then reproduced, and because bacteria reproduce very quickly, their resistant offspring soon made up a larger share of the population. This is natural selection, driven by the drug itself.\n\nThese data come from hospitals, where antibiotics are used heavily, so the change may be slower elsewhere. Still, the evidence strongly suggests that heavy use of an antibiotic can make it less effective over time.",
  },
  {
    task: "Write a scientific explanation answering this question: What do fossils show about where whales came from? Data: Pakicetus, about 50 million years old, had four legs and lived near water. Ambulocetus, about 49 million years old, had large back feet for swimming. Basilosaurus, about 40 million years old, lived in the sea and had tiny back legs. Modern whales have small hip bones inside their bodies.",
    model:
      "Fossils suggest that whales are descended from land animals that gradually moved into the sea over millions of years.\n\nThe evidence comes from a series of fossils of different ages. Pakicetus, about 50 million years old, had four legs and lived near water. Ambulocetus, about 49 million years old, had large back feet that were suited to swimming. Basilosaurus, about 40 million years old, lived in the sea and had only tiny back legs. Modern whales still have small hip bones inside their bodies, although they have no back legs at all.\n\nThe reasoning connects these fossils. Arranged by age, they show a pattern: legs become less useful for walking and more useful for swimming, and then shrink almost to nothing. The hip bones of modern whales are best explained as leftovers from ancestors that once walked.\n\nThese fossils do not record every step of the change, and new finds may add details. However, together they strongly suggest that whales evolved from four-legged animals that lived on land.",
  },
  {
    task: "Write a scientific explanation answering this question: Why do stickleback fish in lakes have fewer armor plates than those in the sea? Data: Sea sticklebacks usually have about 30 bony plates. In most of 40 lakes studied, sticklebacks had fewer than 10. Lakes have fewer large predatory fish than the sea. Growing plates uses minerals that are scarce in fresh water.",
    model:
      "Sticklebacks in lakes have fewer armor plates than those in the sea most likely because, in lakes, heavy armor costs more than it is worth.\n\nThe evidence comes from comparing fish in different waters. Sticklebacks in the sea usually have about 30 bony plates along their sides. In most of the 40 lakes studied, the sticklebacks had fewer than 10. Lakes also contain fewer large predatory fish than the sea, and the minerals needed to grow plates are scarce in fresh water.\n\nThe reasoning connects these facts. In the sea, armor protects sticklebacks from many predators, so fish with more plates survive. In lakes, there are fewer predators, so armor gives less benefit, while growing it uses scarce minerals. Fish with fewer plates could grow faster and survive better, so over generations the lake populations lost much of their armor.\n\nBecause the change appeared in most of the lakes, it is unlikely to be chance. However, not every lake showed it, so other factors probably play a part as well.",
  },
  {
    task: "Write a scientific explanation answering this question: What does DNA show about where dogs came from? Data: DNA from more than 200 dog breeds was compared with DNA from wolves, coyotes and jackals. Dog DNA was most similar to gray wolf DNA. The oldest known dog fossils are about 15,000 years old. Dogs and gray wolves can have healthy young together.",
    model:
      "DNA evidence strongly suggests that dogs are descended from gray wolves.\n\nThe evidence comes from comparing the DNA of more than 200 dog breeds with the DNA of wolves, coyotes and jackals. Of all these animals, the DNA of dogs was most similar to that of gray wolves. In addition, dogs and gray wolves can have healthy young together, and the oldest known dog fossils are about 15,000 years old.\n\nThe reasoning connects these facts. DNA is passed from parents to offspring, so closely related species have similar DNA. Because dog DNA matches gray wolf DNA more closely than any other animal's, dogs and gray wolves must share a recent common ancestor. Their ability to breed together supports the idea that they separated only recently, and the fossils suggest that this happened at least 15,000 years ago, when people began living alongside tamer wolves.\n\nThe DNA cannot tell us exactly where or how the first dogs were tamed, but it gives clear evidence of their wolf ancestry.",
  },
  {
    task: "Write a scientific explanation answering this question: Why did the lizards on two windy islands develop shorter legs? Data: Researchers measured anole lizards on two small islands before and after two hurricanes. Lizards that survived had longer front legs and shorter back legs than those that died. In wind tests, lizards with short back legs were blown off branches less often. The young of the survivors also had shorter back legs.",
    model:
      "On these two islands, the hurricanes seem to have favored lizards with shorter back legs, because those lizards could hold on to branches in strong winds.\n\nThe evidence comes from measurements taken before and after two hurricanes. The lizards that survived had longer front legs and shorter back legs than those that died. In wind tests, lizards with short back legs were blown off their branches less often. The young of the survivors also had shorter back legs.\n\nThe reasoning connects these facts. During a hurricane, a lizard clings to a branch with its front legs, while its back legs catch the wind like a sail. Shorter back legs catch less wind, so those lizards were more likely to survive. Because leg length is inherited, the survivors passed this trait to their young, an example of natural selection.\n\nThis study covers only two small islands, so it does not show that all lizards respond to storms in this way. However, it suggests that a single extreme event can shape a population.",
  },
  {
    task: "Write a scientific explanation answering this question: Why does the Galápagos have so many species found nowhere else? Data: The islands are about 1,000 km from South America. About 97 percent of the reptiles there live nowhere else. Each island has its own kind of giant tortoise. The islands formed from volcanoes and were never joined to a continent.",
    model:
      "The Galápagos has so many species found nowhere else most likely because its islands are far from other land and from one another, so their animals evolved separately.\n\nThe evidence supports this idea. The islands lie about 1,000 kilometers from South America and were formed by volcanoes, so they were never joined to a continent. About 97 percent of their reptiles live nowhere else on Earth. Each island even has its own kind of giant tortoise.\n\nThe reasoning connects these facts. The first animals to reach the islands must have crossed the ocean, perhaps on floating plants. Once there, they were cut off from their relatives on the mainland, and each island's group was cut off from the others. Different conditions on each island favored different traits, so over many generations the groups changed until they became separate species.\n\nIsolation is probably not the only cause, since the islands' unusual conditions also matter. Still, the evidence strongly suggests that distance and separation played a central role.",
  },
  {
    task: "Write a scientific explanation answering this question: Why are rabbits in snowy places mostly white in winter? Data: In surveys, about 90 percent of snowshoe hares in snowy regions turned white in winter. Where snow was rare, most hares stayed brown all year. Foxes and owls hunt hares by sight. In one study, hares whose color did not match the ground were caught more often.",
    model:
      "Snowshoe hares in snowy places are mostly white in winter because a white coat hides them from predators that hunt by sight.\n\nThe evidence comes from surveys and a study of hunting. In snowy regions, about 90 percent of snowshoe hares turned white in winter, while in places where snow was rare, most hares stayed brown all year. Foxes and owls hunt hares by sight, and in one study, hares whose color did not match the ground were caught more often.\n\nThe reasoning connects these facts. A white hare on snow is hard to see, while a brown hare stands out. Hares that matched their surroundings were less likely to be caught, so they survived and passed on the trait of turning white. Where there was little snow, a white coat would make a hare easy to spot, so brown hares survived better there.\n\nThese surveys show a strong pattern, but not every hare follows it. The evidence suggests that camouflage is the main reason, although temperature and day length also control when the coat changes.",
  },
  {
    task: "Write a scientific explanation answering this question: Why could the dodo not fly? Data: The dodo lived only on Mauritius, an island in the Indian Ocean. Before sailors arrived in 1598, the island had no mammals that hunted birds. The dodo's closest relatives are pigeons that fly. The dodo had small wings, a heavy body and laid its eggs on the ground. It was extinct by about 1681, after people, rats and pigs arrived.",
    model:
      "The dodo probably lost the ability to fly because, on an island with no predators, flying gave it no advantage.\n\nThe evidence points to the dodo's history. It lived only on Mauritius, which had no mammals that hunted birds before sailors arrived in 1598. Its closest relatives are pigeons that fly, so its ancestors could almost certainly fly too. Yet the dodo had small wings and a heavy body, and it laid its eggs on the ground.\n\nThe reasoning connects these facts. Flying uses a great deal of energy and needs large wing muscles. On an island where nothing hunted them on the ground, birds that spent less energy on flying and more on growing large could survive and raise young just as well, or better. Over many generations, the population became heavy and flightless.\n\nThe same traits later doomed it. When people, rats and pigs arrived, a bird that could not fly and nested on the ground had no defense, and the dodo was extinct by about 1681. The data strongly suggest this explanation, although no one was there to watch it happen.",
  },
  {
    task: "Write a scientific explanation answering this question: Why did about one in four of Mendel's second generation of pea plants grow short? Data: Mendel crossed pure tall plants with pure short plants, and all 1,064 of the first generation were tall. When these tall plants were crossed with each other, the second generation had 787 tall plants and 277 short plants. He suggested that each plant carries two factors for height, one from each parent.",
    model:
      "About one in four of Mendel's second-generation plants grew short because each of them received the hidden factor for shortness from both parents.\n\nMendel's data show the pattern. When he crossed pure tall plants with pure short plants, all 1,064 plants of the first generation were tall. When he crossed those tall plants with each other, the second generation had 787 tall plants and 277 short ones, a ratio of almost exactly three to one.\n\nMendel's reasoning explains this ratio. Each plant carries two factors for height, one from each parent. The first-generation plants each had one tall factor and one short factor, and the tall factor hid the short one, so they all grew tall. When two such plants were crossed, each parent could pass on either factor. On average, one in four of their offspring received two short factors, and only those plants grew short.\n\nThe close match between the predicted ratio and the counts supports Mendel's explanation. Today we call his factors genes, though height in other plants and animals is often controlled by many genes, not just one.",
  },
];

/** gothicBank gives the opening of a Gothic tale to continue. */
const gothicBank: readonly WritingItem[] = [
  {
    task: 'Continue this opening as a Gothic tale: "The letter said only that my great-aunt had died and that the house on the moor was now mine."',
    model:
      'The letter said only that my great-aunt had died and that the house on the moor was now mine.\n\nI arrived at dusk. Mist crawled across the heather, and the house rose out of it like a black tooth. The key was cold and heavy in my hand, and the door groaned as it swung inward.\n\nInside, the air smelled of damp stone and old roses. Dust sheets covered the furniture, and in the hall, a tall clock stood silent, its hands stopped at a quarter past three.\n\nI found my aunt\'s room at the top of the stairs. On her desk lay a diary, open to its last page. "She comes at a quarter past three," it said. "I will not open the door again."\n\nThat night, I woke to a sound below me. The clock in the hall had begun to tick. Then, slowly, it struck once, twice, three times, and someone knocked softly at my door.\n\nI did not open it. In the morning, I found wet footprints on the stairs, leading up to my room and stopping there.',
  },
  {
    task: 'Continue this opening as a Gothic tale: "No one in the village would speak of the abbey, but every night a light burned in its highest window."',
    model:
      "No one in the village would speak of the abbey, but every night a light burned in its highest window.\n\nI was new to the village, and curious, so one evening I climbed the hill. Rain hissed in the ruined arches, and the wind carried a smell of wet ash. Crows rose from the broken roof as I passed, crying harshly.\n\nA narrow stair wound up inside the tower. The stone steps were worn into hollows, as if countless feet had climbed them, and the walls were slick and cold under my hand.\n\nAt the top was a small room. A candle burned on the sill, though no one was there to tend it. Beside it lay a book of names, each with a date, the last written only yesterday.\n\nThe ink of that name was still wet. It was mine.\n\nBehind me, the door closed with a soft click. The candle flickered, and in the black glass of the window, I saw a pale face looking over my shoulder.",
  },
  {
    task: 'Continue this opening as a Gothic tale: "The portrait in the gallery had always been of an old man, until the morning I saw that he was smiling."',
    model:
      'The portrait in the gallery had always been of an old man, until the morning I saw that he was smiling.\n\nI told myself that the light had changed. The gallery was long and cold, its windows draped in faded velvet, and the morning sun came through them thin and gray. But I had passed that portrait every day for ten years, and he had never smiled before.\n\nThat evening, I asked the housekeeper about him. Her hands stopped on her apron. "That is the old master," she whispered. "He promised to come back for the house when the last of his family grew careless."\n\nI laughed, but the sound died quickly in the cold air.\n\nThe next morning, the old man\'s painted hand had moved from his cane to the frame. On the third morning, the frame was empty.\n\nThat night, I heard slow footsteps in the gallery and the tap of a cane on the boards, coming closer to my door. Then a dry voice said my name.',
  },
  {
    task: 'Continue this opening as a Gothic tale: "The lighthouse keeper had been missing for three days when I rowed out to the rock."',
    model:
      'The lighthouse keeper had been missing for three days when I rowed out to the rock.\n\nThe sea was the color of slate, and waves broke against the tower with a hollow boom. Gulls screamed overhead. As I tied up the boat, I noticed that the lamp at the top was dark, although its oil tank was full.\n\nInside, the keeper\'s dinner sat on the table, cold and untouched. His coat hung by the door, still damp. The only sound was the dripping of water somewhere above me and the groan of the wind in the iron stairs.\n\nIn the logbook, his last entry was written in a shaking hand. "It climbs out of the water when the lamp goes dark. I must keep it lit. I must not sleep."\n\nI lit the lamp myself and sat with my back to the wall as night came down. Near midnight, the flame began to sink, though nothing touched it. Then, from the stairs below, I heard a wet slapping sound, coming slowly up toward the light.',
  },
  {
    task: 'Continue this opening as a Gothic tale: "My grandmother made me promise never to open the locked room at the end of the east wing."',
    model:
      "My grandmother made me promise never to open the locked room at the end of the east wing.\n\nShe died that winter, and the house fell silent. The east wing had always been cold, but now frost formed on the inside of its windows, and the corridor smelled faintly of lilies, the flowers she hated.\n\nOne night, I heard music from that wing, a few notes on a piano, played slowly and badly, like a child learning. My grandmother had told me there was no piano in the house.\n\nI found the key in her jewelry box, wrapped in a lock of pale hair. My hands shook as I turned it in the lock.\n\nThe room was a nursery. Dust lay thick on a small bed, and on the wall hung a picture of a girl who looked exactly like me. Beneath it, a brass plate gave her name, my name, and a date a hundred years ago.\n\nBehind me, the piano began to play again. This time, it was playing well.",
  },
  {
    task: 'Continue this opening as a Gothic tale: "The new tenants of Ashcombe Hall asked me to stop the bell in the chapel from ringing at night."',
    model:
      "The new tenants of Ashcombe Hall asked me to stop the bell in the chapel from ringing at night.\n\nI was the only builder in the village, and I needed the money, so I went. The chapel stood behind the hall in a ring of black yews. Its door was swollen with damp and screamed on its hinges when I forced it open.\n\nInside, the air was thick with the smell of mold and candle smoke, though no candle had been lit there for years. The bell rope hung down from the dark tower, perfectly still.\n\nI climbed the ladder with my lamp. The bell was green with age, and someone had tied its clapper with wire, long ago, so that it could not ring at all.\n\nI was still staring at the wire when the bell spoke. One deep, shuddering note rolled through the tower and shook dust from the beams.\n\nBelow me, in the circle of lamplight, the rope was swaying, and a thin gray hand was letting it go.",
  },
  {
    task: 'Continue this opening as a Gothic tale: "I was hired to catalog the library of Sir Edmund Grey, who had not left his rooms in twenty years."',
    model:
      'I was hired to catalog the library of Sir Edmund Grey, who had not left his rooms in twenty years.\n\nThe library was a vast, dim room that smelled of leather and dust. The shelves climbed into shadow, and the only light came from my lamp and from the fire, which hissed and spat but gave no warmth.\n\nEach night, as I worked, I heard Sir Edmund pacing in the rooms above me. His steps were slow and dragging, and they always stopped directly over my desk.\n\nOn the fifth night, I found a book with no title. Its pages were filled with the same sentence, written over and over in a tightening hand: "He must never learn what I did to my brother."\n\nAbove me, the pacing stopped.\n\nI looked up. A thin line of dark liquid was seeping through the cracks in the ceiling, and drops began to fall, one by one, onto the open page.\n\nThe next morning, the servants told me that Sir Edmund had died twenty years ago.',
  },
  {
    task: 'Continue this opening as a Gothic tale: "The ferryman warned me that no traveler should cross the marsh after the mist came in."',
    model:
      "The ferryman warned me that no traveler should cross the marsh after the mist came in.\n\nI was in a hurry and did not listen. By the time I reached the middle of the causeway, the mist had swallowed the sun. It was cold and wet against my face, and it smelled of rotting reeds.\n\nThe path became narrow and soft. Black water lay on both sides, so still that it seemed to be holding its breath. Somewhere ahead, a lantern swung, and I hurried toward it, thinking it was another traveler.\n\nThe lantern stayed always the same distance away. When I stopped, it stopped. When I called out, no one answered, but the reeds whispered as if many people were moving through them.\n\nThen I saw that the water beside the path was full of pale faces, staring up at me with open eyes.\n\nI turned and ran back the way I had come. Behind me, I heard a voice I knew, the ferryman's, calling softly that I had been warned.",
  },
  {
    task: 'Continue this opening as a Gothic tale: "After the funeral, my brother began to sleepwalk, and every night he went to the same place."',
    model:
      "After the funeral, my brother began to sleepwalk, and every night he went to the same place.\n\nThe first time, I followed him out into the garden. The grass was cold and soaked with dew, and the moon threw long shadows from the yew trees. He walked straight to the old well and stood there, his eyes open but empty, listening.\n\nI listened too. Far down in the dark, water dripped, slow as a clock. Then, very faintly, I heard a voice singing a lullaby that our mother used to sing.\n\nEach night, he stood closer to the edge. Each night, the song grew louder.\n\nOn the seventh night, I tied a rope around his waist and the other end around my wrist. Near midnight, the rope pulled tight, and I was dragged across the wet grass toward the well.\n\nI dug in my heels and screamed his name. He woke at last, shaking, at the very lip of the stone. Far below us, the singing stopped, and something began to climb.",
  },
  {
    task: 'Continue this opening as a Gothic tale: "The mirror arrived in a crate from my uncle\'s estate, with a note that said, Do not cover it."',
    model:
      'The mirror arrived in a crate from my uncle\'s estate, with a note that said, "Do not cover it."\n\nIt was tall and dark, its frame carved with twisting vines, and its glass had a faint greenish tint, like water in a deep pond. When I hung it in the hall, the air around it seemed colder.\n\nAt first, nothing happened. Then, one evening, I noticed that the room in the mirror was slightly wrong. The candles were lit in the reflection, although in my hall they were dark. A fire burned in a grate that I did not have.\n\nEach day, the reflection drifted further from my own house. Strange furniture appeared, and a woman in a gray dress sat by the fire, with her back to me.\n\nI could not bear it, so one night I threw a sheet over the glass.\n\nIn the morning, the sheet lay on the floor. The woman in the mirror had turned her chair around. She was looking at me, and she was smiling.',
  },
  {
    task: 'Continue this opening as a Gothic tale: "The train stopped at a station that was not on any map, and the conductor told me that this was where I had bought my ticket to."',
    model:
      'The train stopped at a station that was not on any map, and the conductor told me that this was where I had bought my ticket to.\n\nI stepped down onto a platform of cracked stone. Behind me, the doors hissed shut, and the train slid away into a fog so thick that its red lamp vanished in seconds. The air smelled of wet coal and something sweeter, like flowers left too long in a vase.\n\nA single gas lamp burned above a sign whose letters had rotted away. Beneath it stood a bench, and on the bench sat a woman in a black dress of the kind my grandmother wore in old photographs. She did not turn her head.\n\n"You\'re late," she said. "We have waited a long time."\n\n"I think there\'s been a mistake," I said. My voice sounded thin in the fog.\n\nShe held out a ticket. It was yellow and soft with age, and it bore my name, written in my own handwriting, and a date fifty years before I was born.\n\nThen, along the platform, one by one, the other lamps began to light.',
  },
  {
    task: 'Continue this opening as a Gothic tale: "Every winter, on the night of the first snow, the same stranger knocked at our door and asked whether the master of the house was ready."',
    model:
      'Every winter, on the night of the first snow, the same stranger knocked at our door and asked whether the master of the house was ready.\n\nMy father always answered the door himself. I would watch from the top of the stairs as he opened it a crack, letting in a breath of icy air. The stranger never stepped inside. He was tall and thin, and snow did not settle on his long gray coat.\n\n"Not yet," my father would say, his voice steady but his hand white on the door frame. The stranger would nod, and when I ran to the window, there would be no footprints in the snow.\n\nMy father died in the spring of my sixteenth year. The house became mine, and I forgot about the stranger, or told myself I had.\n\nTonight, the first snow is falling. I have locked every door and drawn every curtain, and I am sitting by the fire with the lamp turned high.\n\nIt is nearly midnight. Somewhere in the dark hall behind me, softly, someone has begun to knock.',
  },
];

/** writingJudgedTopics8a are the topics of grade 8 whose writing a model judges, part one. */
export const writingJudgedTopics8a: readonly TopicDef[] = [
  {
    id: "writing-an-argument-about-history",
    title: t("Writing an Argument About History", "写关于历史的议论文"),
    summary: t(
      "Write an argument that answers a historical question with a clear claim, supports it with quotations from primary sources and answers a different view.",
      "写一篇议论文：用明确的论点回答一个历史问题，用原始资料中的引语支持它，并回应不同的观点。",
    ),
    prerequisites: after("quoting-a-primary-source", "acknowledging-conflicting-viewpoints"),
    encompasses: [{ topic: "quoting-a-primary-source", weight: 0.2 }],
    xp: 24,
    strand: "writing",
    criteria: ["g8-history-claim", "g8-history-sources", "g8-history-other-view"].map(criterion),
    knowledgePoints: [
      point(
        "arguing-from-the-sources",
        t("Arguing from the Sources", "依据资料论证"),
        t(
          'An argument about history answers a question that historians can disagree about, such as *Was the Revolution mainly about taxes?* State a **claim** that takes a side, then support it with the words of people who were there. Introduce each quotation with its speaker and year, and explain what it shows: *Even a Loyalist farmer admitted in 1775 that "the quarrel is about who rules."*',
          '关于历史的议论文回答一个历史学家可能有分歧的问题，例如 *Was the Revolution mainly about taxes?* 提出一个表明立场的**论点**，再用亲历者的话来支持它。每条引语都要交代说话人和年份，并解释它说明了什么：*Even a Loyalist farmer admitted in 1775 that "the quarrel is about who rules."*',
        ),
        writingGenerator(
          t(
            "Write an argument in English answering the historical question, with a clear claim supported by quotations from the sources.",
            "用英语写一篇议论文回答这个历史问题，提出明确的论点，并用资料中的引语支持它。",
          ),
          historyBank,
          ["g8-history-claim", "g8-history-sources", "g8-history-other-view"],
          limits,
          onePiece,
        ),
      ),
      point(
        "answering-another-view",
        t("Answering Another View", "回应另一种观点"),
        t(
          "Historians often read the same sources in different ways. A strong argument names a **different view** fairly, *Some argue that the colonists simply did not want to pay*, then answers it with evidence: *Yet such small taxes would hardly have led to war.* Answer the other view before your conclusion, so that the essay ends on your own claim.",
          "历史学家常常以不同方式解读同样的资料。有力的议论文会公正地指出**不同的观点**，如 *Some argue that the colonists simply did not want to pay*，再用证据回应它：*Yet such small taxes would hardly have led to war.* 要在结论之前回应另一种观点，让文章以你自己的论点结束。",
        ),
        writingGenerator(
          t(
            "Write an argument in English answering the historical question, acknowledging a different view and answering it with evidence from the sources.",
            "用英语写一篇议论文回答这个历史问题，承认一种不同的观点，并用资料中的证据回应它。",
          ),
          historyBank,
          ["g8-history-other-view", "g8-history-sources", "g8-history-claim"],
          limits,
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-an-informative-report-from-sources",
    title: t("Writing an Informative Report from Sources", "根据资料写说明性报告"),
    summary: t(
      "Write an objective report that combines facts and numbers from two sources and says where each key fact comes from.",
      "写一篇客观的报告：综合两份资料中的事实和数字，并说明每个关键事实的出处。",
    ),
    prerequisites: after("using-statistics-in-a-sentence", "tracking-a-central-idea"),
    encompasses: [{ topic: "using-statistics-in-a-sentence", weight: 0.2 }],
    xp: 24,
    strand: "writing",
    criteria: ["g8-sources-both", "g8-sources-credits", "g8-sources-objective"].map(criterion),
    knowledgePoints: [
      point(
        "combining-two-sources",
        t("Combining Two Sources", "综合两份资料"),
        t(
          "A report from sources does not summarize one source and then the other. It is organized by **idea**: each paragraph gathers the facts on one point, from whichever source gives them. A census may tell you how fast a city grew, while a doctor's report tells you what that growth did to people's health; together they explain more than either does alone.",
          "根据资料写的报告不是先概括一份资料再概括另一份。它按**要点**组织：每段汇集关于一个要点的事实，不管它们来自哪份资料。人口普查可能告诉你一座城市增长得多快，而医生的报告告诉你这种增长对人们健康的影响；两者结合起来比单独任何一份说明得更多。",
        ),
        writingGenerator(
          t(
            "Write an informative report in English that combines the facts of both sources, organized by idea.",
            "用英语写一篇说明性报告，按要点组织，综合两份资料中的事实。",
          ),
          sourcesBank,
          ["g8-sources-both", "g8-sources-credits", "g8-sources-objective"],
          limits,
          onePiece,
        ),
      ),
      point(
        "crediting-each-fact",
        t("Crediting Each Fact", "注明每个事实的出处"),
        t(
          "A reader should be able to tell where each number and key fact came from. Credit your sources as you go, with phrases such as *according to the census*, *the doctor's report found* or *the same record shows*. Keep the tone **objective**: report what the sources say accurately, and leave out your own opinions.",
          "读者应该能分辨每个数字和关键事实来自哪里。边写边注明出处，使用 *according to the census*、*the doctor's report found*、*the same record shows* 等短语。保持**客观**的语气：准确地报告资料所说的内容，不加入你自己的看法。",
        ),
        writingGenerator(
          t(
            "Write an objective informative report in English from the two sources, saying which source each number or key fact comes from.",
            "根据两份资料用英语写一篇客观的说明性报告，说明每个数字或关键事实来自哪份资料。",
          ),
          sourcesBank,
          ["g8-sources-credits", "g8-sources-objective", "g8-sources-both"],
          limits,
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-a-scientific-explanation",
    title: t("Writing a Scientific Explanation", "写科学解释"),
    summary: t(
      "Write a scientific explanation that makes a claim, backs it with evidence from data, connects the two with reasoning and keeps the claim within what the evidence shows.",
      "写一篇科学解释：提出论断，用数据中的证据支持它，用推理把两者联系起来，并让论断不超出证据所显示的范围。",
    ),
    prerequisites: after("qualifying-a-claim"),
    encompasses: [{ topic: "qualifying-a-claim", weight: 0.2 }],
    xp: 24,
    strand: "writing",
    criteria: ["g8-science-claim", "g8-science-reasoning", "g8-science-qualified"].map(criterion),
    knowledgePoints: [
      point(
        "claim-evidence-and-reasoning",
        t("Claim, Evidence and Reasoning", "论断、证据和推理"),
        t(
          "A scientific explanation has three parts. The **claim** answers the question: *The beaks became deeper because the drought favored birds that could crack hard seeds.* The **evidence** gives the data: *the average depth rose from 9.4 mm to 9.9 mm.* The **reasoning** connects them with a scientific idea: *Because beak depth is inherited, the survivors' young had deeper beaks.*",
          "科学解释有三个部分。**论断**回答问题：*The beaks became deeper because the drought favored birds that could crack hard seeds.* **证据**给出数据：*the average depth rose from 9.4 mm to 9.9 mm.* **推理**用科学原理把两者联系起来：*Because beak depth is inherited, the survivors' young had deeper beaks.*",
        ),
        writingGenerator(
          t(
            "Write a scientific explanation in English answering the question, with a claim, evidence from the data and reasoning that connects them.",
            "用英语写一篇科学解释回答这个问题，包括论断、来自数据的证据，以及把它们联系起来的推理。",
          ),
          scienceBank,
          ["g8-science-claim", "g8-science-reasoning", "g8-science-qualified"],
          limits,
          onePiece,
        ),
      ),
      point(
        "knowing-the-limits",
        t("Knowing the Limits", "了解局限"),
        t(
          "A careful explanation ends by saying how far the evidence reaches. If the data come from one island or three caves, say so, and use words such as *suggests*, *most likely* or *in this study*: *This study covers one island, so it does not prove that every population changes this quickly.* But do not hedge so much that the claim disappears.",
          "严谨的解释最后会说明证据能推及多远。如果数据来自一个岛屿或三个洞穴，就要说明，并使用 *suggests*、*most likely* 或 *in this study* 等词：*This study covers one island, so it does not prove that every population changes this quickly.* 但不要含糊到论断都消失了。",
        ),
        writingGenerator(
          t(
            "Write a scientific explanation in English answering the question, ending with what the evidence can and cannot show.",
            "用英语写一篇科学解释回答这个问题，最后说明证据能说明什么、不能说明什么。",
          ),
          scienceBank,
          ["g8-science-qualified", "g8-science-reasoning", "g8-science-claim"],
          limits,
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-a-gothic-tale",
    title: t("Writing a Gothic Tale", "写哥特故事"),
    summary: t(
      "Write a Gothic tale that builds dread through details of the senses, uses Gothic elements such as a gloomy setting or a secret from the past and ends at a moment of horror or revelation.",
      "写一个哥特故事：用感官细节营造恐惧，运用阴森的环境、过去的秘密等哥特元素，并在恐怖或真相揭示的时刻结束。",
    ),
    prerequisites: after("creating-atmosphere-with-sensory-details"),
    encompasses: [{ topic: "creating-atmosphere-with-sensory-details", weight: 0.2 }],
    xp: 24,
    strand: "writing",
    criteria: ["g8-gothic-atmosphere", "g8-gothic-elements", "g7-suspense-ending"].map(criterion),
    knowledgePoints: [
      point(
        "a-setting-full-of-dread",
        t("A Setting Full of Dread", "充满恐惧的环境"),
        t(
          "A Gothic tale lives in its setting: an old house, a ruined abbey, a marsh in the mist. Build the dread through **the senses**: *Mist crawled across the heather; the door groaned; the air smelled of damp stone.* Never write *it was scary*; let the details make the reader feel it.",
          "哥特故事依托于它的环境：一座老宅、一座废弃的修道院、雾中的沼泽。通过**感官**营造恐惧：*Mist crawled across the heather; the door groaned; the air smelled of damp stone.* 绝不要写 *it was scary*；让细节使读者自己感受到。",
        ),
        writingGenerator(
          t(
            "Continue the opening in English as a Gothic tale that builds dread through details of the senses.",
            "用英语接着这个开头写一个哥特故事，用感官细节营造恐惧。",
          ),
          gothicBank,
          ["g8-gothic-atmosphere", "g8-gothic-elements", "g7-suspense-ending"],
          limits,
          onePiece,
        ),
      ),
      point(
        "the-secret-and-the-revelation",
        t("The Secret and the Revelation", "秘密与揭示"),
        t(
          "Gothic tales turn on **a secret from the past**: a diary, a portrait, a locked room. Plant hints of the secret as the story goes, and let a touch of the **supernatural** grow until a final moment reveals it: *Beneath the picture, a brass plate gave her name, my name, and a date a hundred years ago.* End at that moment of horror or revelation.",
          "哥特故事围绕着**过去的秘密**展开：一本日记、一幅肖像、一间上锁的房间。随着故事推进埋下秘密的线索，让**超自然**的迹象逐渐增强，直到最后一刻揭示秘密：*Beneath the picture, a brass plate gave her name, my name, and a date a hundred years ago.* 在那个恐怖或揭示的时刻结束。",
        ),
        writingGenerator(
          t(
            "Continue the opening in English as a Gothic tale that hints at a secret from the past and ends when it is revealed.",
            "用英语接着这个开头写一个哥特故事，暗示一个过去的秘密，并在秘密揭开时结束。",
          ),
          gothicBank,
          ["g8-gothic-elements", "g7-suspense-ending", "g8-gothic-atmosphere"],
          limits,
          onePiece,
        ),
      ),
    ],
  },
];
