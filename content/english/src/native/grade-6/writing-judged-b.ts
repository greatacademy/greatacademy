// Grade 6: writing judged by a model, part two: a letter to a leader, a sports column and the history of a word.

import { type TopicDef, t } from "@ga/content";
import { point, type WritingItem, writingGenerator } from "@ga/subject-english";
import { after } from "../grade-5/links.ts";
import { criterion, onePiece } from "../grade-5/writing-judged-a.ts";

/** letterBank gives a change about food or farming to ask a leader for. */
const letterBank: readonly WritingItem[] = [
  {
    task: "Write a letter to your school principal asking for a school garden. Notes you may use: an empty strip of land behind the gym; students could learn science by growing plants; vegetables could go to the cafeteria; a parent who is a farmer has offered to help.",
    model:
      "Dear Principal Harris,\n\nI am writing to ask you to let our students start a vegetable garden on the empty strip of land behind the gym.\n\nFirst, a garden would help us learn. In science we study how plants grow, but we only read about it. In a garden, we could plant seeds, measure how fast they grow and see what happens when they get more or less water.\n\nSecond, the garden could improve our lunches. Tomatoes, lettuce and beans from the garden could go straight to the cafeteria, so students would eat fresher vegetables that they grew themselves.\n\nFinally, the garden would not cost the school much. Mr. Diaz, whose daughter is in my class, is a farmer, and he has offered to help us prepare the soil and choose the right plants.\n\nThank you for considering this idea. I would be glad to meet with you to talk about it.\n\nSincerely,\nMaya Chen\nGrade 6",
  },
  {
    task: "Write a letter to your town's mayor asking for a weekly farmers market in the town square. Notes you may use: the square is empty on Saturdays; local farmers now drive two hours to sell in the city; fresh food is hard to buy in town; markets bring visitors who also shop in local stores.",
    model:
      "Dear Mayor Okafor,\n\nI am writing to ask you to start a weekly farmers market in the town square on Saturday mornings.\n\nOne reason is that it would help our local farmers. Right now, many of them drive two hours each way to sell their fruit and vegetables in the city. A market here would save them time and fuel, and they would earn more by selling directly to us.\n\nAnother reason is that it would help families. Our town has only one small grocery store, and it is hard to buy fresh food here. A market would let people buy fruit and vegetables picked the day before.\n\nA market could also help other businesses. In nearby towns, Saturday markets bring visitors who stay to eat at cafés and shop in local stores.\n\nThe square is empty on Saturday mornings, so the space is already there. Thank you for your time and for reading my letter.\n\nRespectfully,\nDaniel Price",
  },
  {
    task: "Write a letter to the head of your school district asking for less food waste in school cafeterias. Notes you may use: your class weighed thrown-away food for one week, 180 kg; many students throw away fruit they did not choose; a share table lets students leave unopened food for others; leftover food could go to a food bank.",
    model:
      "Dear Superintendent Lopez,\n\nI am writing to ask the district to take steps to reduce food waste in our school cafeterias.\n\nThe problem is bigger than most people think. Last month, my class weighed all the food thrown away at lunch for one week. The total was 180 kilograms from our school alone.\n\nMuch of this waste could be avoided. Many students must take a piece of fruit with every lunch, even if they do not want it, and most of that fruit goes straight into the trash. If students could choose, far less would be wasted.\n\nI also suggest a share table in every cafeteria. Students could leave unopened milk, fruit and snacks there for anyone who is still hungry. Food that is left at the end of the day could be given to the town food bank.\n\nThese changes would save money and help families in need. Thank you for considering my request.\n\nSincerely,\nAisha Rahman\nGrade 6, Lincoln Middle School",
  },
  {
    task: "Write a letter to your city council asking it to protect farmland at the edge of the city from new buildings. Notes you may use: a plan to build a shopping mall on the Miller farm; once paved, farmland cannot grow food again; the farm supplies vegetables to local schools; the empty old factory site could be used instead.",
    model:
      "Dear Members of the City Council,\n\nI am writing to ask you to protect the Miller farm from the plan to build a shopping mall on it.\n\nMy most important reason is that farmland, once paved over, can never grow food again. The soil on the Miller farm took thousands of years to form. A parking lot would destroy it in a few weeks.\n\nThe farm also matters to our community right now. It supplies fresh vegetables to five schools in our city, including mine. If it closes, the schools will have to buy vegetables that travel hundreds of kilometers.\n\nI understand that the city needs new shops and jobs. However, there is another place for them: the old factory site on River Road has been empty for ten years. Building the mall there would bring jobs without losing our farm.\n\nThank you for listening to the views of young people in our city. I hope you will vote to keep the Miller farm.\n\nYours sincerely,\nLeo Martins",
  },
  {
    task: "Write a letter to your principal asking for a longer lunch break. Notes you may use: lunch is 20 minutes; the line takes about 10 minutes; many students throw away half their meal; students who eat well focus better in afternoon classes.",
    model:
      "Dear Ms. Gupta,\n\nI am writing to ask you to make our lunch break longer, from 20 minutes to 30 minutes.\n\nThe main problem is that 20 minutes is not enough time to eat. On most days, the lunch line takes about ten minutes. That leaves only ten minutes to sit down, eat and clean up, so many students throw away half of their meal when the bell rings.\n\nThis matters because food affects learning. Students who do not finish lunch are often hungry and tired by the afternoon. Our health teacher explained that students who eat a full meal find it easier to focus in class.\n\nI know the school day is already full. Perhaps the extra ten minutes could come from the long break between the last two classes, which many students say they do not need.\n\nThank you for reading my letter. I hope you will consider this change for the health of all students.\n\nRespectfully,\nOmar Haddad\nGrade 6",
  },
  {
    task: "Write a letter to the mayor asking for a community garden in your neighborhood. Notes you may use: many families live in apartments with no yards; an empty lot on Elm Street has been fenced off for years; gardens let families grow cheap, healthy food; neighbors would meet and work together.",
    model:
      "Dear Mayor Bennett,\n\nI am writing to ask the city to turn the empty lot on Elm Street into a community garden.\n\nMost families in my neighborhood live in apartments with no yards. A community garden would give them a place to grow their own vegetables. For families with little money, a few garden beds could provide tomatoes, beans and greens all summer for almost nothing.\n\nA garden would also bring neighbors together. Right now, many of us hardly know the people who live in the next building. Working side by side in a garden would give people of all ages a reason to meet, share tips and help one another.\n\nFinally, the lot has been fenced off and empty for years. It is full of weeds and litter. A garden would make our street cleaner and more beautiful.\n\nThank you for considering this idea. My neighbors and I would be happy to help plant and care for the garden.\n\nSincerely,\nGrace Kim",
  },
  {
    task: "Write a letter to your principal asking the school to stop selling sugary drinks. Notes you may use: the vending machine sells soda; one can has about 9 teaspoons of sugar; dentists say sugary drinks are a main cause of tooth decay; water and milk could be sold instead; some students buy soda every day.",
    model:
      "Dear Principal Novak,\n\nI am writing to ask you to replace the sodas in our school vending machine with water and milk.\n\nSugary drinks are very bad for our health. A single can of soda contains about nine teaspoons of sugar, more than a young person should eat in a whole day. Some students in my class buy a can every day.\n\nThese drinks also harm our teeth. My dentist told me that sugary drinks are one of the main causes of tooth decay in children, and fixing cavities is painful and costs families money.\n\nThe change would be simple. The same machine could sell bottled water and small cartons of milk. Students would still have something to drink, and the school would still earn money from the machine.\n\nI know that some students will miss the soda at first. However, I believe the school should make the healthy choice the easy one.\n\nThank you for reading my letter.\n\nRespectfully,\nSofia Rossi\nGrade 6",
  },
  {
    task: "Write a letter to your town council asking for help for farmers during the drought. Notes you may use: no rain for four months; crops are dying; farmers may lose a whole year of work; the town could share water from the reservoir; a small fund could help farmers buy feed for animals.",
    model:
      "Dear Members of the Town Council,\n\nI am writing to ask you to help the farmers of our town during this drought.\n\nIt has not rained for four months. Many fields around town are brown, and crops of corn and wheat are dying. My uncle is a farmer, and he says that without help he may lose a whole year of work.\n\nThe council could help in two ways. First, the town could share some water from the reservoir with farmers, even if only for a few hours each week. This could save crops that are close to harvest.\n\nSecond, the council could set up a small fund to help farmers buy feed for their animals, because the grass in their fields has stopped growing.\n\nOur farmers feed our town, and many of our stores depend on them as customers. Helping them now would help everyone.\n\nThank you for your time. I hope you will act soon.\n\nYours sincerely,\nTomás Rivera",
  },
  {
    task: "Write a letter to the manager of your local supermarket asking the store to sell imperfect fruit and vegetables at a lower price. Notes you may use: farmers throw away produce that looks odd; up to a third of some crops never reach stores; odd-shaped carrots taste the same; other stores sell imperfect boxes at a discount.",
    model:
      "Dear Store Manager,\n\nI am writing to ask your supermarket to sell imperfect fruit and vegetables at a lower price.\n\nEvery year, farmers throw away tons of good food only because it looks odd. A carrot with two legs or an apple with a small mark tastes exactly the same as a perfect one. Yet for some crops, as much as a third never reaches stores, because buyers want only perfect-looking produce.\n\nIf your store sold these foods, it would help in two ways. First, much less food would be wasted. Second, families could buy fresh fruit and vegetables for less money, which matters to many people right now.\n\nOther supermarkets have already tried this. Some sell boxes of imperfect produce at a discount, and they say the boxes sell out quickly.\n\nThank you for reading my letter. I would be happy to tell my friends and family to look for the boxes in your store.\n\nSincerely,\nHannah Weiss",
  },
  {
    task: "Write a letter to your principal asking for cooking lessons at school. Notes you may use: many students cannot cook a simple meal; students who can cook eat less fast food; the school has a kitchen that is used only at lunch; the lessons could be an after-school club.",
    model:
      "Dear Mr. Ahmed,\n\nI am writing to ask you to start cooking lessons for students, perhaps as an after-school club.\n\nMany students in my grade cannot cook even a simple meal. When their parents work late, they eat chips or instant noodles, or they buy fast food. Learning to cook would let them make healthier food for themselves and their families.\n\nCooking is also a skill for life. In my health class, we learned that people who cook at home usually eat more vegetables and less sugar and salt than people who rely on fast food. Cooking also teaches measuring, reading instructions and planning, which help in other subjects.\n\nWe would not need new equipment. The school kitchen is used only at lunchtime, so it is empty in the afternoon. Our cafeteria staff or a volunteer parent might be willing to lead the club.\n\nThank you for considering this. I know several students who would join right away.\n\nRespectfully,\nPriya Nair\nGrade 6",
  },
  {
    task: "Write a letter to your city's mayor asking for free water fountains in parks. Notes you may use: parks have no drinking water; children and athletes get thirsty in summer; many people buy plastic bottles, which become litter; fountains cost little to run.",
    model:
      "Dear Mayor Silva,\n\nI am writing to ask the city to put free drinking fountains in our parks.\n\nAt the moment, none of the three parks in my neighborhood has drinking water. In summer, the parks are full of children playing, people running and teams practicing soccer. On hot days, they all need water, but there is nowhere to get it.\n\nAs a result, many people buy bottled water, and the empty plastic bottles end up as litter on the grass and in the pond. Last month, my class collected more than two hundred bottles in one park in a single afternoon. Fountains would mean fewer bottles and cleaner parks.\n\nFountains also cost very little to run once they are built, and they could be used by thousands of people every week.\n\nI hope you will think about this request. Thank you for working to make our city a better place for young people.\n\nSincerely,\nNoah Bauer",
  },
  {
    task: "Write a letter to your principal asking for free fruit at sports practice. Notes you may use: practice is right after school, when students are hungry; fruit gives quick energy; some students cannot afford snacks; a local grocery has offered to donate fruit that is close to its sell-by date.",
    model:
      "Dear Ms. Johansson,\n\nI am writing to ask you to provide free fruit for students at after-school sports practice.\n\nPractice starts right after the last class, and most of us have not eaten since lunch. Many players feel tired and hungry before practice even begins. Fruit such as bananas and oranges gives quick energy, so we could train harder and stay safer.\n\nNot every student can afford to buy a snack every day. Free fruit would make sure that all players have the same chance to do their best, whatever their families can spend.\n\nThe plan would not have to cost the school anything. The owner of Green Street Grocery has told our coach that the store would donate fruit that is close to its sell-by date but still good to eat. This would also keep that fruit from being thrown away.\n\nThank you for considering my idea. Our team would be glad to help collect the fruit each week.\n\nRespectfully,\nJamal Wright\nGrade 6",
  },
];

/** columnBank gives a question about sport to take a position on in a column. */
const columnBank: readonly WritingItem[] = [
  {
    task: "Write a sports column answering this question: should every player on a youth team get equal playing time?",
    model:
      "Should Every Player Play?\n\nIn youth sports, every player on the team should get equal playing time. Young athletes join a team to play, and they cannot improve from the bench.\n\nConsider what happens in practice compared with a real game. A player can run drills all week, but only a game teaches how to make quick decisions under pressure. My friend Ana practiced with our soccer team for a whole season and played less than ten minutes. By spring, she had quit.\n\nEqual time also builds a stronger team. When our basketball coach began rotating all twelve players, the starters stopped getting tired in the last quarter, and the bench players became more confident. We won more games, not fewer.\n\nSome people argue that the best players should play most, because winning teaches young people to compete. Winning does matter. However, at this age, the purpose of sport is to learn and to love the game. A team that wins with five players while seven watch has lost something more important.\n\nGive every player a chance, and more of them will still be playing next year.",
  },
  {
    task: "Write a sports column answering this question: should video replay be used to check referees' decisions?",
    model:
      "Let the Cameras Help\n\nVideo replay should be used to check referees' big decisions. The goal of a game is for the better team to win, and replay helps make sure that happens.\n\nReferees are human, and they make mistakes. In the 2010 World Cup, a shot by England clearly crossed the goal line, but the referee did not see it, and the goal did not count. Millions of fans saw the truth on their screens while the referee could not.\n\nReplay has already improved other sports. In tennis, players can challenge a call, and a camera system shows exactly where the ball landed. The arguments that used to stop matches have almost disappeared.\n\nCritics say that replay slows the game down and spoils the excitement of the moment. That can be true when checks drag on too long. However, the solution is to set a time limit, not to give up on the truth. A few seconds of waiting is better than a result that everyone knows is wrong.\n\nUsed wisely, replay does not replace referees. It helps them get it right.",
  },
  {
    task: "Write a sports column answering this question: should schools give out trophies to every player, not only to the winners?",
    model:
      'Not Every Player Needs a Trophy\n\nSchools should save trophies for the players and teams who actually win or achieve something special. When everyone gets a trophy, the trophy stops meaning anything.\n\nThink about why trophies exist. They mark a real achievement, like winning a tournament or breaking a record. Last year, every runner in our school race received the same medal, from first place to last. The girl who had trained for months to win looked at her medal and said, "So what was the point?"\n\nLosing is also part of sport, and it teaches lessons. When my basketball team lost the final, we were disappointed, but we practiced harder all summer. If we had been given trophies anyway, I doubt we would have tried so hard.\n\nSome people say that trophies for everyone make young children feel included and keep them in sport. That is a fair point for very young players. But there are better ways to include everyone, such as certificates for effort or a team photo. A trophy should still mean that you earned it.\n\nPraise every player\'s effort, but keep trophies special.',
  },
  {
    task: "Write a sports column answering this question: should girls and boys play on the same teams in school sports?",
    model:
      "Let Everyone Play Together\n\nIn most school sports, girls and boys should be allowed to play on the same teams. At our age, skill matters more than whether a player is a boy or a girl.\n\nMany girls are as strong and fast as the boys in their grade. On my soccer team, the best goalkeeper in our league is Mia, and she plays on a mixed team. If she had been forced onto a girls' team with fewer games, the league would have lost its best keeper.\n\nMixed teams also teach respect. When boys and girls train and win together, they learn to judge each other by effort and skill. Our coach says that our mixed team has fewer arguments than his old boys' team ever did.\n\nSome people worry that mixed teams are unfair in sports like football, where size and strength can cause injuries. That concern is real, and in contact sports, separate teams may be safer. However, for sports such as soccer, tennis, swimming and track, there is no good reason to keep players apart.\n\nIn most sports, the fairest team is the one chosen by skill.",
  },
  {
    task: "Write a sports column answering this question: should schools require every student to play a sport?",
    model:
      "Sport for Everyone, but Not by Force\n\nSchools should encourage every student to be active, but they should not require everyone to play on a sports team.\n\nNot every student enjoys competitive sport, and forcing them can make them dislike exercise for life. My cousin was made to join the volleyball team at his school. He spent the season afraid of the ball and has hated sport ever since.\n\nThere are many other ways to stay healthy. Some students love dancing, hiking, cycling or climbing, which are not team sports at all. At my school, the walking club has thirty members who would never join the football team, and they exercise three times a week.\n\nSupporters of required sport say that it teaches teamwork and keeps students fit. Those are good goals. However, students can learn teamwork in a band, a robotics club or a play, and they can stay fit through activities they actually enjoy. A required team only works if students want to be there.\n\nGive students many ways to move, and let them choose the one they love.",
  },
  {
    task: "Write a sports column answering this question: is it ever fair to celebrate when an opponent makes a mistake?",
    model:
      "Win With Class\n\nIt is never fair to celebrate an opponent's mistake. Good players cheer for their own team's success, not for someone else's failure.\n\nSport is supposed to test skill against skill. When a tennis player double-faults and the other side's fans cheer, they are not celebrating good play; they are celebrating bad luck. At our school's last basketball game, some students cheered loudly when a player from the other team missed two free throws. The player was close to tears, and even our own coach looked embarrassed.\n\nThe best athletes show the opposite behavior. In a famous race, a runner stopped to help a rival who had fallen, and the crowd gave them both a standing ovation. People remember moments like that far longer than the final score.\n\nSome fans say that cheering at mistakes is just part of the excitement and the pressure of big games. Pressure is part of sport. However, there is a difference between cheering loudly for your team and mocking someone who has slipped.\n\nCelebrate your own team's great plays, and let the other team's mistakes pass in silence.",
  },
  {
    task: "Write a sports column answering this question: should young athletes specialize in one sport or play several?",
    model:
      "Play More Than One Sport\n\nYoung athletes should play several sports instead of focusing on only one. Trying many sports makes better athletes and happier ones.\n\nEach sport trains different skills. Basketball teaches quick footwork, swimming builds strong lungs, and soccer trains players to see the whole field. A girl on my track team says that playing soccer in the fall made her a faster sprinter in the spring.\n\nPlaying only one sport all year can also hurt the body. Doctors who treat young athletes report more injuries in children who repeat the same movements every day, such as young pitchers whose arms wear out. Switching sports gives tired muscles time to rest.\n\nSome people argue that the best players must specialize early to reach the top. It is true that top athletes practice a great deal. However, many professional players, from soccer stars to Olympic swimmers, played several sports as children and chose one only as teenagers.\n\nLet young athletes explore. There is plenty of time to choose later.",
  },
  {
    task: "Write a sports column answering this question: should professional athletes be role models for young people?",
    model:
      "More Than a Game\n\nProfessional athletes should accept that they are role models for young people, and they should act like it, on the field and off.\n\nChildren watch athletes closely. When a star footballer argues with a referee or dives to win a penalty, young players copy it the next weekend. At my brother's soccer game, an eight-year-old fell down and rolled around just like a famous player he had seen on television.\n\nAthletes can also use their fame for good. Some stars have built schools, spoken about mental health or visited children in hospitals. Their fans listen to them in ways they might not listen to parents or teachers.\n\nSome people argue that athletes are paid to play, not to raise other people's children, and that parents should be the real role models. Parents matter most, of course. However, athletes choose to be famous, and fame comes with influence. They cannot choose whether children watch them; they can only choose what children see.\n\nAthletes who play hard and fair teach a lesson no coach can teach alone.",
  },
  {
    task: "Write a sports column answering this question: should school sports teams keep score in games for players under ten?",
    model:
      "Keep the Score\n\nYouth games for players under ten should keep score. Scores make the game exciting, and children can learn to handle both winning and losing.\n\nChildren keep score anyway. In my little sister's soccer league, the referees do not record the score, yet every player on the field knows exactly how many goals each team has. Pretending otherwise only confuses them.\n\nA score also gives players something to work toward. When my sister's team lost three games in a row, they asked their coach to teach them how to defend better. The next week, they lost by only one goal, and they cheered as if they had won. Without a score, they would have had no way to see their progress.\n\nSome parents argue that scores put too much pressure on young children and make losing players feel bad. Young children do need kindness from coaches and parents. However, the problem is not the score; it is adults who shout about it. A calm coach can teach that losing is part of learning.\n\nKeep the score, and teach children what it means.",
  },
  {
    task: "Write a sports column answering this question: should schools spend more money on sports or on arts?",
    model:
      "A Fair Share for the Arts\n\nWhen money is short, schools should not keep giving sports more than the arts. Both matter, and the arts deserve a fair share.\n\nAt many schools, sport receives far more money. At mine, the football team got new uniforms this year, while the band is still playing instruments that are twenty years old. Two of the trumpets do not work at all.\n\nThe arts give students skills that sport does not. Playing in a band teaches students to listen to each other and practice for months toward one concert, just as a team prepares for a match. Art and drama help students who are not athletes find something they are good at.\n\nSupporters of sport point out that games bring the community together and that sport keeps students fit. That is true, and I love playing sport myself. However, a school concert or play also fills the hall with families, and fitness can come from physical education classes for everyone.\n\nA good school builds strong bodies and creative minds, so it should fund both fairly.",
  },
  {
    task: "Write a sports column answering this question: should athletes who cheat by using banned drugs be banned for life?",
    model:
      "No Second Chances for Doping\n\nAthletes who are caught using banned drugs on purpose should be banned from their sport for life. Doping is not a small mistake; it is a choice to cheat everyone else.\n\nA doping athlete steals from honest competitors. When a cyclist won seven Tour de France titles and later admitted to using drugs, the riders who had finished behind him lost years of medals and money they had earned fairly.\n\nShort bans also do not stop cheating. Some athletes have served a two-year ban, returned and been caught again. If the punishment is only a short break, some will decide that cheating is worth the risk.\n\nSome people argue that everyone deserves a second chance, and that some athletes take a banned substance by accident, in a cold medicine for example. That is a fair point. Accidents should be judged more gently. However, an athlete who plans to dope, hides it and lies about it has made a deliberate choice.\n\nA lifetime ban for deliberate doping protects the athletes who play by the rules.",
  },
  {
    task: "Write a sports column answering this question: should young players be allowed to head the ball in soccer?",
    model:
      "Keep Young Heads Safe\n\nPlayers under twelve should not be allowed to head the ball in soccer. Young brains are still growing, and they need protection.\n\nHeading a ball is not a gentle tap. A ball kicked hard can hit a player's head at high speed, and doctors who study young athletes warn that many small hits over time may harm the brain, even when no single hit seems serious. Children's necks are also weaker than adults', so their heads move more when the ball strikes.\n\nSeveral countries have already acted. In the United States and in Scotland, soccer leagues have banned heading for the youngest players, and the game has carried on without it.\n\nSome coaches argue that players who do not learn to head early will be weaker players later. Heading is an important skill. However, players can learn it safely as teenagers, starting with soft balls and short practice. The skill can wait; a healthy brain cannot be replaced.\n\nLet young players use their feet, and save headers for when they are older.",
  },
];

/** wordHistoryBank gives notes on the history of a word. */
const wordHistoryBank: readonly WritingItem[] = [
  {
    task: "Write a paragraph on the history of the word sandwich, from these notes. Notes: named after John Montagu, the Earl of Sandwich, 1700s England; said to have eaten meat between bread so he could keep playing cards; others asked for the same as Sandwich; the name of a town became the name of a food; now means any food between two pieces of bread.",
    model:
      'The word *sandwich* began as the name of a place and a person. In the 1700s, John Montagu was the Earl of Sandwich, a title taken from a town in England. According to a popular story, he did not want to stop playing cards to eat a proper meal, so he asked for meat served between two slices of bread. That way, he could eat with one hand and keep playing with the other. Other people began to order "the same as Sandwich," and over time the name of the earl came to mean the food itself. The meaning has grown since then: today, a *sandwich* is any food served between two pieces of bread, and the word is used in many languages around the world.',
  },
  {
    task: "Write a paragraph on the history of the word boycott, from these notes. Notes: Charles Boycott, a land agent in Ireland, 1880; he tried to force poor farmers off their land; the whole village refused to work for him, sell to him or speak to him; newspapers wrote about it; his name became a verb; now means refusing to buy from or deal with someone as a protest.",
    model:
      'The word *boycott* comes from the name of a man who was very unpopular. In 1880, Charles Boycott was a land agent in Ireland, collecting rents for a rich landowner. When poor farmers asked for lower rents after a bad harvest, he tried to force them off their land. In response, the whole village decided to have nothing to do with him. Workers left his fields, shops refused to sell to him, and even the postman would not deliver his letters. Newspapers across Britain reported the story, and soon people began to use his name as a verb, saying that someone had been "boycotted." Today, to *boycott* means to refuse to buy from or deal with a person, a company or a country as a form of protest.',
  },
  {
    task: "Write a paragraph on the history of the word salary, from these notes. Notes: from Latin salarium; linked to sal, the Latin for salt; salt was precious in ancient times for keeping food; some say Roman soldiers were paid in salt or given money to buy it; meaning moved from salt money to any fixed pay; now means money paid regularly for a job.",
    model:
      "The word *salary* is connected to something we now take for granted: salt. It comes from the Latin word *salarium*, which is related to *sal*, the Latin word for salt. In ancient times, salt was very valuable, because it was one of the few ways to keep meat and fish from spoiling. Some historians believe that Roman soldiers were given an amount of money to buy salt, while others say they were sometimes paid in salt itself. Either way, *salarium* came to mean an allowance paid to someone for their work. Over the centuries, the link to salt was forgotten, and the meaning widened. Today, a *salary* is any fixed amount of money paid regularly for a job.",
  },
  {
    task: "Write a paragraph on the history of the word nice, from these notes. Notes: from Latin nescius, meaning not knowing, ignorant; in English in the 1300s it meant foolish or silly; later fussy and careful; then delicate or precise; by the 1700s pleasant; now means kind or pleasant.",
    model:
      'The word *nice* has changed its meaning more than almost any other word in English. It comes from the Latin *nescius*, which meant "not knowing" or ignorant. When it entered English in the 1300s, *nice* still had a bad meaning: a nice person was foolish or silly. Over the next centuries, the meaning shifted step by step. First it came to mean fussy, then careful about small details, and then delicate or precise, as in *a nice difference*. Because being careful and delicate was seen as good, the word slowly became positive. By the 1700s, people were using *nice* to mean pleasant. Today it means kind or agreeable, the very opposite of the insult it once was.',
  },
  {
    task: "Write a paragraph on the history of the word disaster, from these notes. Notes: from Italian disastro, through French; dis- means bad, astro means star; people once believed the stars and planets controlled events; a disaster was an event caused by an unlucky position of the stars; belief faded but the word stayed; now means any sudden event that causes great damage.",
    model:
      'The word *disaster* comes from an old belief about the stars. It entered English in the 1500s from the Italian word *disastro*, through French. The word is built from two parts: *dis-*, meaning bad, and *astro*, meaning star. At that time, many people believed that the positions of the stars and planets controlled what happened on Earth. A disaster, then, was an event caused by an unlucky arrangement of the stars, literally a "bad star." Over time, most people stopped believing that the stars decided their fate, but the word remained. Today, a *disaster* is any sudden event that causes great damage or suffering, such as a flood or an earthquake, and no one thinks of the stars when they use it.',
  },
  {
    task: "Write a paragraph on the history of the word ketchup, from these notes. Notes: probably from a word in a Chinese language, kê-tsiap, a fish sauce; British sailors and traders met it in Southeast Asia in the 1600s and 1700s; British cooks made their own versions with mushrooms, walnuts or oysters; tomatoes added in the 1800s in America; now means a sweet tomato sauce.",
    model:
      "The word *ketchup* has traveled a long way, and so has the sauce. It probably comes from *kê-tsiap*, a word in a Chinese language of southern China for a sauce made from salted fish. In the 1600s and 1700s, British sailors and traders tasted this sauce in Southeast Asia and brought the word home. Back in Britain, cooks tried to make their own versions, but they used ingredients such as mushrooms, walnuts and oysters instead of fish. In the 1800s, cooks in the United States began making ketchup from tomatoes, and their sweet red version became popular around the world. Today, *ketchup* almost always means this tomato sauce, which has little in common with the fish sauce that gave it its name.",
  },
  {
    task: "Write a paragraph on the history of the word clue, from these notes. Notes: from Old English cliwen, a ball of thread or yarn; in a Greek myth Theseus used a ball of thread to find his way out of the labyrinth; a clew came to mean anything that guides you out of a puzzle; spelling changed to clue; now means a piece of information that helps solve a mystery.",
    model:
      "The word *clue* began as a simple ball of thread. In Old English, a *cliwen* or *clew* was a ball of yarn. Its meaning changed because of a famous Greek myth. In the story, the hero Theseus entered a maze called the labyrinth to fight a monster. To find his way out again, he unrolled a ball of thread behind him and followed it back. Because of this story, a clew came to mean anything that guides a person through a difficult problem. Over time, the spelling changed to *clue*, and people forgot about the thread. Today, a *clue* is a piece of information that helps solve a mystery or a puzzle, from a detective's case to a crossword.",
  },
  {
    task: "Write a paragraph on the history of the word marathon, from these notes. Notes: Marathon, a plain in Greece; battle of Marathon, 490 BCE, Greeks defeated the Persians; legend says a messenger ran about 40 km to Athens with the news and then died; first modern Olympics, 1896, a long race named after the legend; distance later fixed at 42.195 km; now also means any long, tiring activity.",
    model:
      "The word *marathon* comes from the name of a place in Greece. Marathon is a plain near the sea, where the Greeks defeated a Persian army in a famous battle in 490 BCE. According to a legend, a messenger ran all the way from Marathon to Athens, about 40 kilometers, to announce the victory, and then fell dead from exhaustion. When the first modern Olympic Games were held in Athens in 1896, the organizers created a long-distance race to honor this story and called it the marathon. Later, the distance was fixed at 42.195 kilometers. Since then, the word has also grown a wider meaning: today, a *marathon* can be any long, tiring activity, such as a marathon study session.",
  },
  {
    task: "Write a paragraph on the history of the word robot, from these notes. Notes: from a Czech play by Karel Čapek, 1920; based on the Czech robota, meaning forced labor or hard work; in the play, robots were artificial workers made in a factory; the play was translated and performed around the world; now means a machine that can do tasks by itself.",
    model:
      "The word *robot* is only about a hundred years old, and it was born in a play. In 1920, the Czech writer Karel Čapek wrote a play about a factory that made artificial workers. To name them, he used a word based on the Czech *robota*, which meant forced labor or hard, boring work. In the play, the robots did all the work that people did not want to do, until they rebelled. The play was translated into many languages and performed around the world, and the new word spread with it. At first, *robot* meant a human-like machine from a story. Today, it means any machine that can carry out tasks by itself, from a factory arm to a vacuum cleaner.",
  },
  {
    task: "Write a paragraph on the history of the word school, from these notes. Notes: from Greek skholē, meaning free time or leisure; free time was used for talking and learning; the word came to mean a place for discussion and lessons; passed through Latin schola into English; now means a place where children are taught.",
    model:
      "Surprisingly, the word *school* once meant free time. It comes from the Greek word *skholē*, which meant leisure, the time when a person did not have to work. In ancient Greece, people who had free time often spent it talking, arguing and learning from wise teachers. Because of this, *skholē* came to mean the discussions themselves, and then the place where they happened. The word passed into Latin as *schola*, meaning a place of lessons, and from Latin into English. Over many centuries, the meaning narrowed to the kind of school we know. Today, a *school* is a place where children are taught, and few students would describe it as free time.",
  },
  {
    task: "Write a paragraph on the history of the word tycoon, from these notes. Notes: from Japanese taikun, meaning great lord; taken from Chinese words for great and prince; used by foreigners for the military ruler of Japan in the 1850s; Americans used it as a nickname for President Lincoln; later for powerful businessmen; now means a rich and powerful person in business.",
    model:
      'The word *tycoon* traveled from East Asia to American business. It comes from the Japanese word *taikun*, meaning great lord, which itself was built from Chinese words for great and prince. In the 1850s, foreign visitors used *taikun* as a title for the shogun, the military ruler of Japan. Americans who had been to Japan brought the word home, and some of President Abraham Lincoln\'s assistants even called him "the Tycoon" as a joke. After that, the word moved from politics to money. People began to use it for powerful businessmen who controlled railways, oil or steel. Today, a *tycoon* is a very rich and powerful person in business, and its link to Japanese lords is mostly forgotten.',
  },
  {
    task: "Write a paragraph on the history of the word quarantine, from these notes. Notes: from Italian quaranta giorni, meaning forty days; Venice in the 1300s during the plague; ships from infected places had to wait forty days before people could land; the time showed whether anyone was sick; now means any period in which people or animals are kept apart to stop a disease spreading.",
    model:
      "The word *quarantine* comes from a number. In the 1300s, a terrible disease called the plague spread across Europe, and port cities such as Venice were afraid of ships that came from infected places. To protect the city, officials ordered these ships to wait offshore for forty days before anyone could come ashore. In Italian, forty days is *quaranta giorni*, and the waiting period came to be called a *quarantena*. Forty days was long enough to show whether anyone on board was sick. Over time, the word spread into English and other languages, and the exact number was dropped. Today, a *quarantine* is any period in which people or animals are kept apart to stop a disease from spreading, whether it lasts forty days or only a few.",
  },
];

/** writingJudgedTopics6b are the grade 6 writing topics judged by a model, part two. */
export const writingJudgedTopics6b: readonly TopicDef[] = [
  {
    id: "writing-a-letter-to-a-leader",
    title: t("Writing a Letter to a Leader", "给领导人写信"),
    summary: t(
      "Write a letter to a principal, mayor or council that asks for one change about food or farming, with at least two relevant reasons backed by facts and a respectful tone throughout.",
      "给校长、市长或议会写一封信，就食物或农业提出一项改变的请求，至少给出两个有事实支持的相关理由，并自始至终保持尊重的语气。",
    ),
    prerequisites: after("writing-an-opinion-piece", "choosing-relevant-reasons"),
    encompasses: [{ topic: "writing-an-opinion-piece", weight: 0.2 }],
    xp: 22,
    strand: "writing",
    criteria: ["g6-states-request", "g6-relevant-reasons", "g6-respectful-tone", "w4-concludes"].map(criterion),
    knowledgePoints: [
      point(
        "the-request-and-the-reasons",
        t("The Request and the Reasons", "请求与理由"),
        t(
          "A letter to a leader states its **request** early and clearly, in one sentence: *I am writing to ask you to let our students start a vegetable garden behind the gym.* Then it gives at least two **relevant reasons**, each in its own paragraph, and backs each one with a fact or an example: a number you counted, something that happened or what an expert said. Leave out reasons that are only feelings or about something else.",
          "给领导人的信要尽早、清楚地用一句话说出**请求**：*I am writing to ask you to let our students start a vegetable garden behind the gym.* 然后至少给出两个**相关的理由**，每个理由一段，并用事实或例子支持：你统计的数字、发生过的事或专家说的话。不要写只是感觉或与请求无关的理由。",
        ),
        writingGenerator(
          t(
            "Write the letter in English, stating your request early and giving at least two reasons backed by facts.",
            "用英语写这封信，尽早说出你的请求，并至少给出两个有事实支持的理由。",
          ),
          letterBank,
          ["g6-states-request", "g6-relevant-reasons", "w4-concludes"],
          { minWords: 120, maxChars: 4000 },
          onePiece,
        ),
      ),
      point(
        "a-respectful-tone",
        t("A Respectful Tone", "尊重的语气"),
        t(
          "A leader is more likely to listen to a letter that is **polite**. Open with a greeting (*Dear Mayor Okafor,*) and close with a sign-off (*Sincerely,* or *Respectfully,*) and your name. Ask rather than demand, never insult, and show that you understand the leader's side: *I know the school day is already full.* End by thanking the reader and, if you can, offering to help.",
          "**礼貌**的信更容易让领导人听进去。用称呼开头（*Dear Mayor Okafor,*），用结束语（*Sincerely,* 或 *Respectfully,*）和你的名字结尾。要请求而不是要求，绝不侮辱，并表明你理解领导人的立场：*I know the school day is already full.* 最后感谢读者，如果可以的话，表示愿意帮忙。",
        ),
        writingGenerator(
          t(
            "Write the letter in English with a greeting, a closing and a polite, respectful tone throughout.",
            "用英语写这封信，要有称呼和结束语，并自始至终保持礼貌、尊重的语气。",
          ),
          letterBank,
          ["g6-respectful-tone", "g6-states-request", "w4-concludes"],
          { minWords: 120, maxChars: 4000 },
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-a-sports-column",
    title: t("Writing a Sports Column", "写体育专栏"),
    summary: t(
      "Write a column that takes a clear position on a question about sport, supports it with specific examples from games, teams or rules, and answers the other side fairly.",
      "写一篇专栏文章，对一个体育问题表明清楚的立场，用比赛、球队或规则中的具体例子来支持，并公正地回应对方的观点。",
    ),
    prerequisites: after("writing-a-letter-to-a-leader"),
    encompasses: [{ topic: "writing-a-letter-to-a-leader", weight: 0.2 }],
    xp: 22,
    strand: "writing",
    criteria: ["g6-takes-a-position", "g6-supports-with-examples", "g6-answers-other-side"].map(criterion),
    knowledgePoints: [
      point(
        "a-position-and-examples",
        t("A Position and Examples", "立场与例子"),
        t(
          "A column takes a **position** and says it where no reader can miss it, often in the first two sentences: *In youth sports, every player should get equal playing time.* A title can help: *Should Every Player Play?* Then it supports the position with **specific examples** from sport: a game you saw, a team you played on, a rule, a famous match. One real example convinces more than three general claims.",
          "专栏文章要表明**立场**，并把它放在读者不会错过的地方，通常在前两句：*In youth sports, every player should get equal playing time.* 标题也有帮助：*Should Every Player Play?* 然后用体育中的**具体例子**来支持立场：你看过的一场比赛、你参加过的球队、一条规则、一场著名的比赛。一个真实的例子比三个笼统的说法更有说服力。",
        ),
        writingGenerator(
          t(
            "Write the sports column in English, stating your position clearly and supporting it with specific examples from sport.",
            "用英语写这篇体育专栏，清楚地表明你的立场，并用体育中的具体例子来支持。",
          ),
          columnBank,
          ["g6-takes-a-position", "g6-supports-with-examples", "g6-answers-other-side"],
          { minWords: 140, maxChars: 4000 },
          onePiece,
        ),
      ),
      point(
        "answering-the-other-side",
        t("Answering the Other Side", "回应对方的观点"),
        t(
          "A strong column admits that some people disagree. State their view **fairly**, the way they would say it (*Some people argue that the best players should play most, because winning teaches young people to compete.*), grant what is true in it, and then explain why your position is still stronger: *However, at this age, the purpose of sport is to learn.* End by returning to your position in a short, memorable line.",
          "有力的专栏文章会承认有人不同意。**公正地**说出他们的观点，就像他们自己会说的那样（*Some people argue that the best players should play most, because winning teaches young people to compete.*），承认其中正确的部分，然后解释为什么你的立场仍然更有力：*However, at this age, the purpose of sport is to learn.* 最后用一句简短、令人难忘的话回到你的立场。",
        ),
        writingGenerator(
          t(
            "Write the sports column in English, stating the other side fairly and explaining why your position is still stronger.",
            "用英语写这篇体育专栏，公正地说出对方的观点，并解释为什么你的立场仍然更有力。",
          ),
          columnBank,
          ["g6-answers-other-side", "g6-takes-a-position", "g6-supports-with-examples"],
          { minWords: 140, maxChars: 4000 },
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-a-word-history",
    title: t("Writing a Word History", "写词语的历史"),
    summary: t(
      "Write a paragraph from notes on where a word came from, how its meaning or form changed over time and why, ending with what it means now.",
      "根据笔记写一段话，说明一个词的来源、它的意思或形式随时间发生了怎样的变化以及原因，最后说出它现在的意思。",
    ),
    prerequisites: after("writing-a-history-explanation", "words-from-other-languages"),
    encompasses: [{ topic: "words-from-other-languages", weight: 0.2 }],
    xp: 22,
    strand: "writing",
    criteria: ["g6-word-origin", "g6-explains-change", "w4-concludes"].map(criterion),
    knowledgePoints: [
      point(
        "where-the-word-began",
        t("Where the Word Began", "这个词从哪里来"),
        t(
          "A word history begins at the **origin**: the language, person or place the word came from and what it first meant. *The word salary comes from the Latin salarium, which is related to sal, the Latin word for salt.* Use the facts in the notes exactly, and set the word you are writing about in italics or quotation marks so the reader knows you are talking about the word itself.",
          "词语的历史从**来源**写起：这个词来自哪种语言、哪个人或哪个地方，最初是什么意思。*The word salary comes from the Latin salarium, which is related to sal, the Latin word for salt.* 准确使用笔记中的事实，并把你要写的词用斜体或引号标出，让读者知道你说的是这个词本身。",
        ),
        writingGenerator(
          t(
            "Write the history of the word in English from the notes, beginning with where it came from and what it first meant.",
            "根据笔记用英语写出这个词的历史，从它的来源和最初的意思写起。",
          ),
          wordHistoryBank,
          ["g6-word-origin", "g6-explains-change", "w4-concludes"],
          { minWords: 90, maxChars: 3200 },
          onePiece,
        ),
      ),
      point(
        "how-the-meaning-changed",
        t("How the Meaning Changed", "意思是怎样变化的"),
        t(
          "The heart of a word history is the **change**. Take the reader through it in order, with time words (*in the 1300s*, *over the next centuries*, *by the 1700s*), and give the **reason** for each change: a story, a belief, a new invention, a word that traveled with traders. End with what the word means **now**, and, if you can, how far that is from where it began.",
          "词语历史的核心是**变化**。用时间词（*in the 1300s*、*over the next centuries*、*by the 1700s*）按顺序带读者了解这个变化，并说出每次变化的**原因**：一个故事、一种信仰、一项新发明、一个随商人传播的词。最后说出这个词**现在**的意思，如果可以的话，再说说它与最初的意思相差多远。",
        ),
        writingGenerator(
          t(
            "Write the history of the word in English from the notes, explaining how and why its meaning changed and what it means now.",
            "根据笔记用英语写出这个词的历史，说明它的意思是怎样以及为什么变化的，以及它现在的意思。",
          ),
          wordHistoryBank,
          ["g6-explains-change", "g6-word-origin", "w4-concludes"],
          { minWords: 90, maxChars: 3200 },
          onePiece,
        ),
      ),
    ],
  },
];
