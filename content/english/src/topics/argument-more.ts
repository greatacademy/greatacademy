// Argument: more items for the banks of argument.ts, written as lines of fields separated by bars: what is shown, the
// right answer and two wrong answers, in the order the feedback of each bank expects.

import type { ChoiceItem } from "@ga/subject-english";

/** bars turns lines of four fields separated by bars into choice items. */
const bars = (lines: string): readonly ChoiceItem[] =>
  lines
    .trim()
    .split("\n")
    .map((line) => {
      const [shown, right, ...wrong] = line.trim().split("|");
      return [shown!, right!, wrong];
    });

/** claimMore are more claims, each with two facts about the same subject. */
export const claimMore = bars(`
  |Our school should plant a vegetable garden.|Our school has a large empty field.|Vegetables grow best in full sun.
  |Students should be allowed to use phones at lunch.|Most students own a phone.|Lunch is at twelve thirty.
  |The town should build a public swimming pool.|The nearest pool is twenty miles away.|Swimming lessons cost fifteen dollars.
  |Field trips are worth more than a week of classroom lessons.|Our class took two field trips last year.|The museum is open on weekdays.
  |Fast food restaurants should post calories on their menus.|A burger can have over five hundred calories.|Many families eat out on weekends.
  |Every school should have a full-time nurse.|Our school nurse works two days a week.|Nurses check students' temperatures.
  |Recess should last at least thirty minutes.|Recess at our school lasts fifteen minutes.|Children play tag at recess.
  |The city must clean up the river before summer.|The river runs through the center of the city.|Fish live in the river.
  |Libraries matter more today than ever.|The library lends e-books.|The library opened in 1955.
  |Students should help choose the books they read in class.|Our class reads four novels a year.|The school library has ten thousand books.
  |Our town should ban fireworks to protect pets.|Fireworks are set off on holidays.|Many families own dogs.
  |Teenagers should have a say in school rules.|The school rules are written by the principal.|There are twenty rules in the handbook.
  |Cities should make public transportation free.|A bus ticket costs two dollars.|The city has forty bus routes.
  |Art classes deserve as much time as math.|Our school offers art once a week.|Art supplies include paint and clay.
  |Schools should teach students how to manage money.|Most adults use a bank account.|Our school teaches math every day.
  |Our school should serve breakfast to every student.|Some students skip breakfast.|The cafeteria opens at seven.
  |Dogs should be allowed in more city parks.|Dogs are allowed in two city parks.|Many people walk their dogs at night.
  |The school day should include time for exercise.|Students sit for about six hours a day.|The gym is next to the library.
  |Our community should build a skate park.|Skateboarding is an Olympic sport.|Skateboards have four wheels.
  |Volunteering should be required for graduation.|Our town has many charities.|Some students volunteer at the animal shelter.
  |Single-use plastic straws should be replaced with paper ones.|Plastic straws are made from oil.|Restaurants give out straws with drinks.
  |Middle school students should learn to code.|Coding is the writing of computer programs.|Our school has a computer lab.
`);

/** preciseClaimMore are more precise claims, each with a vague statement and a fact. */
export const preciseClaimMore = bars(`
  |The cafeteria should offer a vegetarian meal every day.|Food is important.|The cafeteria serves lunch at noon.
  |The town should put a crosswalk in front of the elementary school.|Safety matters.|The elementary school is on Pine Street.
  |Our school should start a free tutoring club after classes.|Learning is good.|Some students stay after school.
  |The city should keep public pools open until eight in summer.|Pools are great.|The pools close at six.
  |Each class should get one field trip to a museum every year.|Museums are interesting.|The art museum is downtown.
  |Students should be allowed to listen to music during study hall.|Music is a big deal.|Study hall is in room twelve.
  |The park should add water fountains near the playground.|Parks need things.|The park has one water fountain.
  |The school should replace its old textbooks with new ones by next year.|Books matter a lot.|The science textbooks are from 2005.
  |The city should plant trees along Main Street to give shade.|Trees are nice.|Main Street has no trees.
  |Our library should stay open on Sunday afternoons.|Libraries are useful.|The library is closed on Sundays.
  |The school should hold parent meetings in the evening, not the morning.|Parents are important.|Parent meetings are at nine in the morning.
  |The town should add a bike rack outside the train station.|Bikes are cool.|Many commuters ride bikes.
  |Our school should give students a ten-minute break between classes.|Breaks are good things.|Classes are fifty minutes long.
  |The city should paint murals on the walls of the old factory.|Art is important.|The old factory is gray.
  |The bus company should add a route to the hospital.|Getting places matters.|No bus goes to the hospital.
  |The school should switch to reusable trays in the cafeteria.|The environment is a big issue.|The cafeteria uses paper trays.
  |Our team should hold tryouts in spring instead of fall.|Sports are fun to play.|Tryouts are held in September.
  |The town should put recycling bins on every block.|Recycling is good.|There are ten recycling bins downtown.
  |Students should get one homework-free weekend a month.|Homework is a thing.|Teachers give homework on Fridays.
  |The school should buy new microscopes for the science lab.|Science is very important.|The lab has six microscopes.
  |The city should lower the speed limit near schools to fifteen miles per hour.|Driving is serious.|The speed limit near schools is twenty-five.
  |The museum should offer free entry to students on weekends.|Museums should be better.|Tickets cost twelve dollars.
`);

/** relevantEvidenceMore are more claims, each with relevant evidence and two facts that do not support it. */
export const relevantEvidenceMore = bars(`
  Claim: Our school should plant a garden.|Students in schools with gardens ate more vegetables, a health survey found.|The school was painted last summer.|Some gardens have fences.
  Claim: The town needs more streetlights.|Most nighttime accidents in town happen on unlit streets.|Streetlights were invented over a hundred years ago.|The town hall has a clock tower.
  Claim: Students should have longer lunch breaks.|Students with longer lunches ate more of their food and wasted less, a study found.|The cafeteria has blue tables.|Lunch is served after fourth period.
  Claim: Phones should be put away during class.|Students without phones in class scored higher on tests in several studies.|Phones were first sold in the 1980s.|Many phones have cameras.
  Claim: The city should build bike lanes.|Cities that added bike lanes saw fewer cyclist injuries.|Bicycles come in many colors.|The mayor rides a bus.
  Claim: Schools should offer music classes.|Students who study music often improve in memory and attention.|Pianos have eighty-eight keys.|The school band wears red uniforms.
  Claim: The river should be cleaned up.|Tests found the river's water unsafe for swimming in three places.|The river is sixty miles long.|The river has a famous bridge.
  Claim: Our town should open a teen center.|After the next town opened a teen center, reports of vandalism fell by half.|Teenagers are between thirteen and nineteen.|The town has two grocery stores.
  Claim: Students should get more sleep.|Students who slept nine hours scored better on memory tests than those who slept six.|Many students have bedtime routines.|Pillows can be soft or firm.
  Claim: The school should serve healthier snacks.|Students at schools with healthy snacks had fewer sick days.|The vending machine is near the gym.|Snacks come in plastic wrappers.
  Claim: The zoo should build larger enclosures.|Animals in larger enclosures showed fewer signs of stress.|The zoo opened in 1960.|The zoo sells ice cream.
  Claim: Plastic bags should be banned.|In towns that banned plastic bags, litter on beaches dropped sharply.|Plastic bags weigh very little.|Grocery stores sell fruit.
  Claim: Libraries should stay open later.|Visits to the library are highest in the hour before it closes.|The library has a reading room.|Library cards are blue.
  Claim: Students should learn first aid.|Quick first aid in the first minutes after an injury can save lives.|First aid kits are white boxes.|Nurses wear uniforms.
  Claim: The city should plant more trees.|Streets with trees can be up to ten degrees cooler on hot days.|Trees have leaves.|The city has a tree on its flag.
  Claim: Schools should start a reading program.|Students who read twenty minutes a day learn many more new words each year.|Books have covers.|The school was built of brick.
  Claim: The town should repair the old bridge.|Inspectors found cracks in two of the bridge's supports.|The bridge was named after a mayor.|The bridge is painted green.
  Claim: Dogs should be allowed in more parks.|Parks with dog areas had more visitors and fewer complaints about loose dogs.|Some dogs are very small.|Dogs like to chase balls.
  Claim: Students should study a second language early.|Children who learn a language before age ten often speak it with less of an accent.|French is spoken in many countries.|Our school has a globe.
  Claim: The school needs a new roof.|Rain leaked into six classrooms during last month's storm.|The roof is gray.|The school has two floors.
  Claim: The city should make buses free for students.|When another city made buses free for students, attendance at school rose.|Buses have large windows.|The bus driver waves to children.
  Claim: Schools should have recycling bins in every classroom.|Classrooms with recycling bins recycled three times more paper.|Paper is made from trees.|Classrooms have whiteboards.
`);

/** strongerEvidenceMore are more claims, each with strong evidence and two weak supports: a feeling and a general statement. */
export const strongerEvidenceMore = bars(`
  Claim: The cafeteria should offer more fruit.|In a week-long trial, students took twice as much fruit when it was offered at every meal.|I really like apples.|Everyone knows fruit is good for you.
  Claim: Students should have a longer recess.|A study of four schools found that students focused better in class after longer recess.|My friends love recess.|Everybody needs a break.
  Claim: The town needs a new library.|The current library turns away two hundred people a week because it is full.|My mom says the library is too small.|Libraries are always good.
  Claim: The school should add more buses.|Records show buses on two routes are over capacity every morning.|I hate crowded buses.|Buses are always too full.
  Claim: The park needs a fence near the pond.|Three children fell into the pond last summer, the park office reports.|My little sister got scared by the pond once.|Ponds are dangerous.
  Claim: Our school should start a coding club.|Fifty students signed a petition asking for a coding club.|Coding is super fun.|Everybody wants to learn coding.
  Claim: The crosswalk needs a light.|Traffic counts show over a thousand cars pass the crosswalk each morning.|My dad thinks it is dangerous.|Crosswalks are always risky.
  Claim: The school should repaint the hallways.|A survey found that eighty percent of students find the hallways dark and dirty.|I think the hallways look ugly.|Everybody hates the color.
  Claim: The town should ban leaf blowers in the early morning.|Noise readings show leaf blowers are louder than a passing truck.|My neighbor's leaf blower wakes me up.|Leaf blowers are annoying.
  Claim: Students should get a homework limit.|Students in our district report an average of three hours of homework a night.|My homework takes forever.|Everybody has too much homework.
  Claim: The city should add more trash cans downtown.|Cleaning crews collected twice as much litter on blocks without trash cans.|I always see trash on the street.|Litter is a big problem everywhere.
  Claim: The pool should hire more lifeguards.|Last summer, the pool had one lifeguard for every eighty swimmers, twice the safe number.|My cousin almost slipped at the pool.|Lifeguards are important.
  Claim: The school needs air conditioning.|Classroom temperatures reached ninety degrees on twelve days in June.|It feels really hot in class.|Everybody gets sweaty in summer.
  Claim: The town should build a dog park.|A town survey found that four in ten households own a dog.|Dogs are the best pets.|Everybody loves dogs.
  Claim: Our school should offer more after-school sports.|Over one hundred students were turned away from full teams this year.|My friend wanted to join soccer.|Sports are always good for kids.
  Claim: The city should fix the potholes on Elm Street.|Repair shops report dozens of cars damaged on Elm Street this spring.|My bike hit a pothole once.|Potholes are terrible.
  Claim: The museum should open on Mondays.|Ticket records show Monday is the day most tourists ask to visit.|I like going to museums.|Museums should always be open.
  Claim: Students should have lockers.|Nurses report that students carry backpacks weighing up to a quarter of their body weight.|My backpack is really heavy.|Backpacks are hard to carry.
  Claim: The town should add a bus to the beach.|Parking at the beach was full by nine every summer weekend, records show.|I can never find a parking spot.|Beaches are always crowded.
  Claim: Our school should teach cooking.|In schools with cooking classes, students ate more home-cooked meals, a study found.|Cooking is fun.|Everyone should know how to cook.
  Claim: The library should buy more e-books.|E-book loans rose by sixty percent last year, while the number of e-books stayed the same.|I like reading on my tablet.|E-books are the future.
  Claim: The school needs another counselor.|Each counselor at our school serves six hundred students, over twice the recommended number.|My friend could not get an appointment.|Counselors are really helpful.
`);

/** reasoningMore are more claims and evidence, each with the reasoning that links them and two unlinked statements. */
export const reasoningMore = bars(`
  Claim: Schools should serve breakfast. Evidence: Hungry students struggle to focus.|If students eat breakfast at school, they can focus better in class.|Breakfast is served at seven.|Some students like cereal.
  Claim: Cities should plant trees. Evidence: Trees absorb rainwater.|If trees soak up rain, streets will flood less during storms.|Trees grow slowly.|Many people like trees.
  Claim: Students should read every day. Evidence: Reading builds vocabulary.|Daily reading gives students more chances to learn new words, which helps them understand harder texts.|Our class reads in the afternoon.|Some books are long.
  Claim: Towns should add bike lanes. Evidence: Separated lanes protect cyclists from cars.|If cyclists feel safe, more people will choose bikes over cars.|Bikes are cheaper than cars.|Some people ride for fun.
  Claim: Phones should be off in class. Evidence: Notifications break students' attention.|Without interruptions, students can follow the lesson and remember more.|Phones are expensive.|Most students have phones.
  Claim: Recess should be longer. Evidence: Exercise helps the brain.|More time to move lets students return to class ready to think.|Recess is outside.|Students like to play games.
  Claim: The school should start later. Evidence: Teens' sleep cycles shift later.|A later start lets teens sleep at the hours their bodies need, so they are more alert.|School starts at seven forty.|Many teens drink coffee.
  Claim: Plastic bags should be banned. Evidence: Bags blow into rivers and the sea.|Fewer bags would mean less plastic harming fish and birds.|Plastic bags are light.|Stores give bags to customers.
  Claim: Students should learn first aid. Evidence: Emergencies often happen before help arrives.|If students know first aid, they can help in the minutes before a doctor comes.|First aid kits are red.|Some students want to be doctors.
  Claim: Zoos should breed endangered animals. Evidence: Some species have almost no wild members left.|Breeding in zoos can keep a species alive until it can return to the wild.|Zoos sell tickets.|Some animals live in cages.
  Claim: Libraries should stay open late. Evidence: Many students work or care for siblings after school.|Late hours give these students a chance to use the library when they are free.|The library has computers.|Libraries are quiet.
  Claim: Cities should make buses free. Evidence: Cost stops some families from riding.|Free buses would let more families reach jobs and schools.|Buses run on diesel.|The city has many buses.
  Claim: Schools should teach money skills. Evidence: Many young adults fall into debt.|Learning to budget early can help students avoid debt later.|Money is made of paper.|Banks have vaults.
  Claim: Art should be required. Evidence: Art builds creative problem solving.|Practice in creating art helps students find new solutions in other subjects too.|Paint comes in tubes.|Some students draw well.
  Claim: The pool should hire more lifeguards. Evidence: Each guard can only watch so many swimmers.|More guards means every swimmer is watched, so accidents are caught sooner.|The pool is outdoors.|Lifeguards wear red.
  Claim: Students should choose their books. Evidence: Students read more when they enjoy the book.|Letting students choose leads to more reading, which builds their skills.|Books cost money.|The library has a catalog.
  Claim: Cities should add trash cans. Evidence: People litter when no can is nearby.|More cans make it easy to throw trash away, so the streets stay cleaner.|Trash cans are green.|Some people pick up litter.
  Claim: Schools should have gardens. Evidence: Children are more willing to eat food they grew.|Growing vegetables can make students more likely to eat healthy food.|Gardens need water.|Some schools are in cities.
  Claim: The town should repair the bridge. Evidence: Cracked supports can fail without warning.|Repairing the supports now prevents a sudden collapse that could hurt people.|The bridge is old.|Many people cross the bridge.
  Claim: Students should learn to code. Evidence: Many future jobs will use computers.|Learning to code prepares students for the kinds of jobs that will exist.|Computers have keyboards.|Some students play games.
  Claim: Homework should be limited. Evidence: Too much homework cuts into sleep.|Limiting homework would protect the sleep students need to learn well.|Homework is given daily.|Some students finish quickly.
  Claim: The museum should offer free days. Evidence: Ticket prices keep some families away.|A free day lets families who cannot pay still visit and learn.|The museum has paintings.|The museum is large.
`);

/** conclusionMore are more pieces of evidence, each with a fair conclusion and two that go too far. */
export const conclusionMore = bars(`
  Evidence: In a survey of our grade, 70 of 100 students said they walk to school.|Most students in our grade walk to school.|Every student in the country walks to school.|Walking is the only way to get to school.
  Evidence: The library's visits rose by a third after it opened on Saturdays.|Opening on Saturdays seems to have brought more visitors.|Saturday openings make every library popular.|No one visited the library before.
  Evidence: Four of the six puppies in the litter have brown spots.|Most of the puppies in this litter have brown spots.|All puppies have brown spots.|Brown spots are the best markings.
  Evidence: After the town added speed bumps, speeding on Oak Lane fell by half.|The speed bumps seem to have reduced speeding on Oak Lane.|Speed bumps end all speeding everywhere.|No one will ever speed on Oak Lane again.
  Evidence: In our class, students who studied with flashcards scored higher on the quiz.|Flashcards may have helped students in our class on this quiz.|Flashcards are the only way to study.|Everyone who uses flashcards gets perfect scores.
  Evidence: The bakery sold out of bread every day last week.|The bakery's bread was in high demand last week.|The bakery is the best in the world.|The bakery will sell out every day forever.
  Evidence: Two of the three bridges in town were rated as needing repair.|Most of the town's bridges need repair.|Every bridge in the country is unsafe.|The bridges will fall down tomorrow.
  Evidence: After the school added a water fountain, soda sales fell by forty percent.|Adding the fountain seems to have reduced soda sales.|Water fountains end soda drinking everywhere.|No student will ever drink soda again.
  Evidence: The town's temperature records show summers getting warmer over thirty years.|Summers in the town have been getting warmer.|Every place on earth is getting hotter in the same way.|Next summer will be the hottest ever.
  Evidence: Eight of the ten tomato plants grown in sunlight grew taller than those in shade.|Sunlight seemed to help these tomato plants grow taller.|All plants need full sun to grow.|Tomatoes cannot grow in the shade at all.
  Evidence: Our team won nine of its twelve games this season.|Our team had a successful season.|Our team is the best in history.|Our team will never lose again.
  Evidence: Most customers in the store survey said they wanted longer hours.|Many customers would like the store to stay open longer.|Every person in town wants the store open all night.|The store will close if it does not change.
  Evidence: Students who joined the reading club read more books on average this year.|Members of the reading club tended to read more books this year.|The reading club makes everyone love reading.|Students outside the club never read.
  Evidence: Five of the seven classrooms tested had poor air quality.|Most of the tested classrooms had poor air quality.|Every school in the city has bad air.|Students in those rooms will all get sick.
  Evidence: After the park added lights, evening visits doubled.|The lights seem to have encouraged more evening visits.|Lights make every park popular.|The park was empty before the lights.
  Evidence: In a test of three brands, Brand A's batteries lasted longest.|Of the three brands tested, Brand A's batteries lasted longest.|Brand A makes the best batteries in the world.|Other brands' batteries are useless.
  Evidence: Half of the students surveyed said they skip breakfast at least once a week.|Many of the students surveyed sometimes skip breakfast.|All students skip breakfast every day.|Skipping breakfast is the cause of every bad grade.
  Evidence: The river's fish count rose after the factory stopped dumping waste.|Stopping the waste seems to have helped the fish recover.|Factories are the only cause of harm to rivers.|The river is now completely clean.
  Evidence: Most of the town's crashes last year happened at the Main Street corner.|The Main Street corner is the most dangerous spot in town.|Every corner in town is deadly.|No crashes happen anywhere else.
  Evidence: Students who took the practice test scored an average of ten points higher.|Taking the practice test was linked to higher scores.|Practice tests guarantee a perfect score.|Students who skip practice tests always fail.
  Evidence: The new bus route carried two thousand riders in its first month.|The new bus route got good use in its first month.|Everyone in the city now takes the bus.|The route will be the busiest in the country.
  Evidence: Three of the four classes that tried standing desks reported fewer students fidgeting.|Standing desks seemed to reduce fidgeting in most classes that tried them.|Standing desks cure all problems in class.|No student will ever fidget again.
`);

/** counterclaimMore are more claims, each with a counterclaim and two statements that support the claim. */
export const counterclaimMore = bars(`
  Claim: Schools should start later.|Some argue that a later start would make it harder for parents to get to work on time.|Later starts let students get more sleep.|Rested students pay better attention.
  Claim: The city should build bike lanes.|Some say bike lanes take space away from cars and cause traffic.|Bike lanes make cycling safer.|More cyclists means less pollution.
  Claim: Students should not have homework on weekends.|Some say weekend homework helps students remember what they learned during the week.|Free weekends give students time to rest.|Families get more time together.
  Claim: Zoos should be closed.|Some argue that zoos protect animals that would die out in the wild.|Animals in zoos lose their natural space.|Many zoo animals show signs of stress.
  Claim: The school should ban junk food.|Some say students should be free to choose what they eat.|Junk food is linked to poor health.|Healthy food helps students focus.
  Claim: Students should wear uniforms.|Some argue that uniforms cost families extra money.|Uniforms reduce bullying over clothes.|Uniforms make mornings simpler.
  Claim: The town should build a skate park.|Some worry that a skate park would attract noise and litter.|A skate park gives teens a safe place to go.|Skating is good exercise.
  Claim: Phones should be banned in schools.|Some say phones are needed so parents can reach students in an emergency.|Phones distract students in class.|Without phones, students talk more at lunch.
  Claim: The library should be open on Sundays.|Some argue that Sunday hours would cost too much in staff pay.|Many families are free only on Sundays.|Students need a quiet place to study on weekends.
  Claim: Video games are good for learning.|Some say video games take time away from reading and exercise.|Games can teach problem solving.|Some games build teamwork.
  Claim: The city should make buses free.|Some argue that free buses would cost taxpayers too much.|Free buses help families save money.|More riders means fewer cars on the road.
  Claim: Students should choose their own classes.|Some say young students do not yet know which classes they will need.|Choice makes students more interested.|Students learn more when they care about a subject.
  Claim: The school year should be longer.|Some argue that a longer year would leave less time for family and rest.|More days mean more time to learn.|Students forget less over a shorter summer.
  Claim: Plastic bags should be banned.|Some say a ban would hurt shoppers who reuse bags for trash.|Plastic bags harm sea animals.|Bags take hundreds of years to break down.
  Claim: Every student should learn an instrument.|Some argue that instruments are too expensive for many families.|Music builds memory and focus.|Playing in a band teaches teamwork.
  Claim: The town should ban fireworks.|Some say fireworks are an important part of holiday traditions.|Fireworks frighten pets.|Fireworks can cause fires.
  Claim: Students should have a longer lunch.|Some argue that a longer lunch would make the school day end later.|Students need time to eat slowly.|A longer lunch gives students time to relax.
  Claim: Cities should plant more trees.|Some say trees cost money to plant and care for.|Trees cool the streets in summer.|Trees clean the air.
  Claim: Schools should replace textbooks with tablets.|Some argue that screens strain students' eyes and distract them.|Tablets are lighter than books.|Tablets can be updated easily.
  Claim: Grades should be replaced with written comments.|Some say grades make it easy for colleges to compare students.|Comments explain how to improve.|Students worry less without grades.
  Claim: The town should open a dog park.|Some worry that a dog park would bring barking and smells to nearby homes.|Dogs need space to run.|A dog park lets owners meet each other.
  Claim: Students should do community service.|Some argue that required service is no longer truly voluntary.|Service teaches responsibility.|Service helps people in need.
`);

/** rebuttalMore are more counterclaims, each with a rebuttal, a statement that agrees with it and one that does not answer it. */
export const rebuttalMore = bars(`
  Counterclaim: A later start makes it harder for parents to get to work.|However, schools could open early for supervised study, so parents can still drop off children on time.|It is true that parents need to get to work.|Many parents drive cars.
  Counterclaim: Bike lanes cause traffic.|Yet cities that added bike lanes often found traffic flowed just as well, because some drivers switched to bikes.|Bike lanes do take up road space.|Traffic is common in big cities.
  Counterclaim: Weekend homework helps memory.|However, short reviews during the week can build memory just as well without taking the whole weekend.|Weekend homework does help some students remember.|Weekends are two days long.
  Counterclaim: Zoos protect endangered animals.|But most zoo animals are not endangered, and protected wild parks can save species in their own homes.|Zoos have saved some species.|Many families visit zoos.
  Counterclaim: Students should be free to choose their food.|Still, schools already limit choices for safety, and healthy food supports learning.|Students like to choose what they eat.|The cafeteria serves lunch at noon.
  Counterclaim: Uniforms cost families extra money.|However, uniforms can replace many outfits, and schools can offer free uniforms to families in need.|Uniforms do cost money.|Uniforms come in blue and gray.
  Counterclaim: A skate park would attract litter.|However, trash cans and a volunteer clean-up team can keep the park clean.|Some parks do have litter.|Skateboards are made of wood.
  Counterclaim: Parents need to reach students by phone.|Yet parents can call the school office, which can reach any student within minutes.|Phones are useful in emergencies.|Many students own phones.
  Counterclaim: Sunday hours cost too much.|Still, volunteers and shorter afternoon hours could keep the cost low.|Staff do need to be paid.|The library has many books.
  Counterclaim: Video games take time from reading.|However, many games require reading and can encourage players to read more about their stories.|Some students play games instead of reading.|Games are sold in stores.
  Counterclaim: Free buses cost taxpayers too much.|But fewer cars on the road would save the city money on road repairs and pollution.|Free buses do cost money.|The city has many bus stops.
  Counterclaim: Young students do not know which classes they need.|Even so, advisers can guide students' choices while still letting them follow their interests.|Young students often change their minds.|Schools offer many classes.
  Counterclaim: A longer school year leaves less family time.|However, the extra days could be spread out as short breaks, giving families time together all year.|Families do value summer time.|Summer is warm.
  Counterclaim: Banning bags hurts shoppers who reuse them.|Yet shoppers can buy small trash bags, and the harm bags do to wildlife is far greater.|Some shoppers do reuse bags.|Bags come in many sizes.
  Counterclaim: Instruments are too expensive.|However, schools can lend instruments to students, as many already do.|Some instruments cost a lot.|Violins have four strings.
  Counterclaim: Fireworks are a holiday tradition.|Still, towns that switched to drone light shows kept the celebration without the noise and fire risk.|Fireworks are part of many holidays.|Fireworks are colorful.
  Counterclaim: A longer lunch makes the day end later.|However, shortening passing time between classes could make room for a longer lunch.|A longer lunch would change the schedule.|Lunch is served in the cafeteria.
  Counterclaim: Trees cost money to care for.|But trees save money by cooling buildings and soaking up storm water.|Trees do need care.|Trees have roots.
  Counterclaim: Screens strain students' eyes.|However, tablets can be set to limit screen time and reduce glare.|Screens can tire the eyes.|Tablets have batteries.
  Counterclaim: Grades help colleges compare students.|Yet many colleges already read written reports and essays to understand students.|Grades are easy to compare.|Colleges have many students.
  Counterclaim: A dog park would bring barking to nearby homes.|However, the park could be placed at the edge of town, far from houses.|Dogs do bark.|Many people own dogs.
  Counterclaim: Required service is no longer voluntary.|Still, students can choose where and how they serve, which keeps the spirit of volunteering.|Required service is not truly voluntary.|Many charities need help.
`);
