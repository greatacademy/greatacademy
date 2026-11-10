// College writing: the tasks of the professional email, the memo and the cover letter, each with a model answer.
// The people and organizations are invented.

import type { WritingItem } from "@ga/subject-english";

/** emailBank asks for a professional email with a clear subject, purpose, tone and next step. */
export const emailBank: readonly WritingItem[] = [
  {
    task: "Write an email to your manager, Ms. Carter, asking to move the deadline of a report. Give a subject line, explain why, propose a new date, and keep a polite, professional tone.",
    source:
      "The quarterly sales report is due Friday. The regional office will not send its final figures until Thursday afternoon. You could finish by Tuesday.",
    model:
      "Subject: Request to move the sales report deadline to Tuesday\n\nDear Ms. Carter,\n\nI am writing to ask whether the quarterly sales report could be due next Tuesday instead of this Friday. The regional office has told me that its final figures will not arrive until Thursday afternoon, which leaves too little time to check them and write the analysis properly.\n\nIf I have the figures on Thursday, I can send you a complete and accurate report by Tuesday at noon. If Friday is essential, I could instead send a draft with the regional figures marked as provisional.\n\nPlease let me know which you would prefer.\n\nBest regards,\nDaniel Ruiz",
  },
  {
    task: "Write an email declining a colleague's request politely but clearly. Give a subject line, say no, give a brief reason, and suggest an alternative.",
    source:
      "Your colleague Priya has asked you to lead the training session for new staff next Wednesday. You are presenting to a client that day. Your colleague Tom led the session last year.",
    model:
      "Subject: Training session next Wednesday\n\nHi Priya,\n\nThank you for thinking of me for the new staff training. Unfortunately, I can't lead it next Wednesday, as I'm presenting to a client for most of that day.\n\nTom led the session last year and might be willing to do it again; I'd be glad to ask him if that would help. I'm also happy to share my notes on our filing system for the materials, or to lead a later session if you run another one this spring.\n\nThanks for understanding.\n\nBest,\nSam",
  },
  {
    task: "Write an email introducing yourself to a team you have just joined. Give a subject line, say who you are and what you will do, and suggest a next step.",
    source:
      "You are Ana Lopes, the new data analyst. You will work on the customer survey. You would like to meet each team member this week.",
    model:
      "Subject: Hello from Ana, the new data analyst\n\nDear all,\n\nMy name is Ana Lopes, and I joined the team this week as a data analyst. I'll be working mainly on the customer survey, preparing the data and reporting the results, so many of you will see my questions in the coming weeks.\n\nI would like to meet each of you briefly this week to learn about your work and how the survey can help it. I have sent invitations for fifteen-minute meetings on Thursday and Friday; if the times don't suit you, please suggest another.\n\nI look forward to working with you.\n\nBest regards,\nAna Lopes",
  },
  {
    task: "Write an email to a customer replying to a complaint. Give a subject line, apologize, explain what you will do, and give the customer a clear next step.",
    source:
      "Mr. Osei ordered a desk that arrived with a broken leg. He waited a week for a reply. You can send a replacement leg within three days or collect the desk for a full refund.",
    model:
      "Subject: Your desk order: replacement or refund\n\nDear Mr. Osei,\n\nThank you for letting us know that your desk arrived with a broken leg, and I am sorry both for the damage and for the week it took us to reply. That is not the service we aim to provide.\n\nWe can put this right in one of two ways. We can send you a replacement leg, which will arrive within three working days, or we can collect the desk at a time that suits you and refund the full price.\n\nPlease reply to this email with your choice, and I will arrange it the same day.\n\nKind regards,\nLena Fischer\nCustomer Service",
  },
  {
    task: "Write an email following up on a message that has gone unanswered. Give a subject line, remind the reader of your request, and make it easy to reply.",
    source:
      "Two weeks ago you asked Mr. Haddad, a manager in another department, which week his team could attend a training session. You need to book the room by Friday.",
    model:
      "Subject: Follow-up: training dates for your team\n\nDear Mr. Haddad,\n\nI am following up on my email of 3 March about the data security training for your team. We are offering the session in the weeks of 7 April and 14 April, and I need to book the room by this Friday.\n\nCould you let me know which week would suit your team better? A one-word reply is all I need.\n\nThank you, and I look forward to hearing from you.\n\nBest regards,\nMaria Kovač",
  },
  {
    task: "Write an email asking a senior colleague for feedback on a draft. Give a subject line, say what you need and by when, and respect their time.",
    source:
      "You have written a draft of a grant proposal. Dr. Bennett has written many successful proposals. You most want her view on the budget section. The proposal is due in ten days.",
    model:
      "Subject: Would you look at the budget in my grant draft?\n\nDear Dr. Bennett,\n\nI have finished a draft of our proposal to the City Arts Fund, which is due on 20 May. Since you have written so many successful proposals, I would value your advice, especially on the budget section, which I am least sure about.\n\nThe budget is two pages, and I have attached the full draft in case you want the context. Any comments by 15 May would give me time to revise, but even a few quick notes would help.\n\nThank you for considering it.\n\nBest regards,\nOmar Haddad",
  },
  {
    task: "Write an email reporting a mistake you made and how you have fixed it. Give a subject line, admit the error plainly, give the correction, and say what you will do differently.",
    source:
      "Yesterday you sent clients an invitation to a workshop with the wrong date: 4 June instead of 14 June. Two clients have already replied about 4 June.",
    model:
      "Subject: Correction: the workshop is on 14 June\n\nDear clients,\n\nI am writing to correct an error in yesterday's invitation. The workshop will take place on Saturday, 14 June, not on 4 June as I wrote. The time and place are unchanged: 10 a.m. at our office on River Street.\n\nI apologize for the confusion. If you have already replied about 4 June, there is no need to do anything; I will move your registration to the correct date. In future, I will have a colleague check the details of every invitation before it is sent.\n\nKind regards,\nJulia Novak",
  },
  {
    task: "Write an email asking the technology team for help. Give a subject line, describe the problem precisely, and say how urgent it is.",
    source:
      "Your laptop has not connected to the office network since this morning's update. You have restarted it twice. You have a video call with a client at 3 p.m.",
    model:
      "Subject: Laptop cannot connect to the network since this morning's update\n\nHello,\n\nSince this morning's software update, my laptop has not been able to connect to the office network. I have restarted it twice, and other devices at my desk connect normally, so the problem seems to be with the laptop.\n\nI have a video call with a client at 3 p.m. today, so I would be grateful if someone could look at it before then. I am at desk 4B on the second floor and can bring the laptop to you if that is easier.\n\nThank you,\nKenji Watanabe",
  },
  {
    task: "Write an email to a client confirming what was agreed at a meeting. Give a subject line, list the decisions and who will do what, and ask the client to confirm.",
    source:
      "At today's meeting with Ms. Ito of Green Grocers, you agreed: the new website will launch on 1 September; Green Grocers will send product photos by 15 July; your team will send a first design by 1 August.",
    model:
      "Subject: Summary of today's meeting on the new website\n\nDear Ms. Ito,\n\nThank you for meeting with us today. To make sure we share the same plan, here is what we agreed:\n\n- Green Grocers will send the product photos by 15 July.\n- Our team will send you a first design of the website by 1 August.\n- The new website will launch on 1 September.\n\nCould you reply to confirm that this matches your understanding? If anything is missing or incorrect, please let me know and I will update the plan.\n\nBest regards,\nPeter Mensah",
  },
  {
    task: "Write an email asking a colleague to cover your shift. Give a subject line, make the request clearly, and offer something in return.",
    source:
      "You need someone to cover your Saturday morning shift, 8 a.m. to 1 p.m., at the library desk because of a family event. Your colleague is Lucas.",
    model:
      "Subject: Could you cover my Saturday morning shift?\n\nHi Lucas,\n\nI have a family event this Saturday and wondered whether you could cover my shift at the library desk, from 8 a.m. to 1 p.m.\n\nIf you can, I'd be glad to take one of your shifts in return; just tell me which. I'll let the supervisor know once we've agreed.\n\nNo problem at all if you can't. Thanks for considering it.\n\nBest,\nGrace",
  },
  {
    task: "Write an email declining an invitation to speak at an event. Give a subject line, thank the organizer, decline clearly, and leave the door open.",
    source:
      "Dr. Lee has invited you to speak at a conference on 22 October. You are already committed to another event that week. You would like to be considered next year.",
    model:
      "Subject: Your invitation to speak on 22 October\n\nDear Dr. Lee,\n\nThank you very much for inviting me to speak at the conference on 22 October. I was delighted to be asked.\n\nUnfortunately, I have already committed to another event that week, so I must decline. I am sorry to miss it, as the program looks excellent.\n\nI would be very glad to be considered for next year's conference, and I would be happy to suggest a colleague who might speak this year if that would help.\n\nWith best wishes,\nHelen Adeyemi",
  },
  {
    task: "Write an email asking a professor for a letter of recommendation. Give a subject line, make the request, give the details the professor needs, and allow enough time.",
    source:
      "You took Professor Grant's economics course last year and earned an A. You are applying for a summer internship at a research institute. The deadline is 1 March. It is now late January.",
    model:
      "Subject: Request for a letter of recommendation for a summer internship\n\nDear Professor Grant,\n\nI took your course in economics last spring and enjoyed it very much, especially the research project on local housing prices. I am now applying for a summer internship at the Institute for Policy Research, and I wondered whether you would be willing to write a letter of recommendation for me.\n\nThe deadline is 1 March. I have attached the internship description, my résumé and the project I wrote for your course, in case they are useful.\n\nI understand that you are busy, and I would be grateful for your help either way.\n\nBest regards,\nLiam Chen",
  },
];

/** memoBank asks for a memo with its heading, a purpose stated at once, organized content and the action it asks for. */
export const memoBank: readonly WritingItem[] = [
  {
    task: "Write a memo to all staff announcing a new policy. Use the heading To, From, Date and Subject; state the purpose at once; explain the change and the reason; and say what staff must do.",
    source:
      "From the office manager, Nina Brooks. From 1 March, all visitors must sign in at reception and wear a visitor's pass. Two laptops were stolen last month by someone who entered without signing in. Staff must meet their visitors at reception.",
    model:
      "To: All staff\nFrom: Nina Brooks, Office Manager\nDate: 15 February\nSubject: New sign-in rule for visitors from 1 March\n\nFrom 1 March, every visitor to the office must sign in at reception and wear a visitor's pass for the whole visit.\n\nWe are making this change because two laptops were stolen last month by someone who entered the building without signing in. Knowing who is in the building will help us keep our people and equipment safe.\n\nWhat this means for you:\n\n- Please tell reception in advance when you expect a visitor.\n- Meet your visitors at reception rather than asking them to come to your desk.\n- If you see someone without a pass, kindly direct them to reception.\n\nThank you for your help. Please send any questions to me at extension 214.",
  },
  {
    task: "Write a memo to your manager recommending a solution to a problem. Use the heading To, From, Date and Subject; state your recommendation at once; give the reasons and the cost; and say what decision you need.",
    source:
      "From Leo Grant, team leader. The team's shared printer breaks down about twice a week, and repairs cost 150 a month. A new printer would cost 900 and come with a three-year warranty. You need approval by the end of the month.",
    model:
      "To: Mira Patel, Operations Manager\nFrom: Leo Grant, Team Leader\nDate: 3 April\nSubject: Recommendation to replace the team printer\n\nI recommend that we replace our team's shared printer with a new model, at a cost of 900.\n\nThe current printer breaks down about twice a week. Each breakdown stops work for the team, and repairs cost us about 150 a month, or 1,800 a year. A new printer would cost 900 and come with a three-year warranty that covers repairs, so it would pay for itself within six months.\n\nI have attached quotations from two suppliers. If you approve the purchase by 30 April, the new printer can be installed in the first week of May.",
  },
  {
    task: "Write a memo to a project team summarizing a meeting. Use the heading To, From, Date and Subject; state the purpose at once; list the decisions and actions with names and dates.",
    source:
      "From Clara Wu, project coordinator. At the meeting on 10 June, the team decided: the launch moves from 1 July to 15 July; Ben will finish testing by 5 July; Ines will update the user guide by 10 July; the next meeting is 24 June.",
    model:
      "To: Website Project Team\nFrom: Clara Wu, Project Coordinator\nDate: 11 June\nSubject: Decisions from the meeting of 10 June\n\nThis memo records what we decided at yesterday's meeting, so that everyone has the same plan.\n\nDecision: The launch moves from 1 July to 15 July, to allow more time for testing.\n\nActions:\n\n- Ben will finish testing by 5 July.\n- Ines will update the user guide by 10 July.\n- Everyone will report any problems to me as soon as they arise.\n\nOur next meeting is on 24 June at 10 a.m. in Room 3. Please let me know before then if any of these dates cannot be met.",
  },
  {
    task: "Write a memo to all staff about a change in working hours. Use the heading To, From, Date and Subject; state the change at once; explain why; and say what staff must do.",
    source:
      "From the director, Paul Okoro. From 1 June, the office will open at 8:00 instead of 9:00 and close at 4:30 instead of 5:30, for a trial of three months. A staff survey showed most staff prefer earlier hours. Staff who cannot change their hours must tell Human Resources by 15 May.",
    model:
      "To: All staff\nFrom: Paul Okoro, Director\nDate: 1 May\nSubject: Earlier office hours from 1 June, a three-month trial\n\nFrom 1 June, the office will open at 8:00 and close at 4:30, one hour earlier than now. This is a trial that will run for three months, until 31 August.\n\nWe are making this change because most of you said in last month's survey that you would prefer earlier hours, mainly to avoid evening traffic and to have more time with your families.\n\nIf you cannot change your hours because of childcare or other duties, please tell Human Resources by 15 May so that we can agree on an arrangement with you. At the end of the trial, we will ask for your views again before deciding whether to keep the new hours.",
  },
  {
    task: "Write a memo to your department reporting an incident and the steps taken. Use the heading To, From, Date and Subject; state what happened at once; then the cause, the response and what staff should do.",
    source:
      "From the lab manager, Dr. Ruth Hale. On 12 March, a small chemical spill occurred in Lab 2; no one was hurt. A container had been stored on a high shelf without a lid. The spill was cleaned within an hour. From now on, chemicals must be stored on low shelves with lids closed.",
    model:
      "To: All staff of the Chemistry Department\nFrom: Dr. Ruth Hale, Lab Manager\nDate: 13 March\nSubject: Chemical spill in Lab 2 and new storage rule\n\nOn 12 March, a small chemical spill occurred in Lab 2. No one was hurt, and the area was cleaned and declared safe within an hour.\n\nThe spill happened because a container had been stored on a high shelf without its lid and was knocked over. To prevent this from happening again, all chemicals must now be stored on low shelves, with their lids firmly closed.\n\nPlease check your own storage areas by Friday and move any containers that do not meet this rule. If you have questions, contact me at extension 330.",
  },
  {
    task: "Write a memo to your manager proposing a small change in how the team works. Use the heading To, From, Date and Subject; state the proposal at once; give the reasons; and suggest a trial.",
    source:
      "From Aisha Bello, customer service team. You propose that the team hold a ten-minute meeting every morning instead of a one-hour meeting every Monday. Questions from customers often wait until Monday. Other teams that use short daily meetings answer customers faster.",
    model:
      "To: Daniel Moore, Customer Service Manager\nFrom: Aisha Bello, Customer Service Team\nDate: 8 September\nSubject: Proposal for short daily team meetings\n\nI propose that our team replace its one-hour Monday meeting with a ten-minute meeting every morning.\n\nAt present, difficult questions from customers often wait until Monday, when we discuss them together. A short daily meeting would let us solve them within a day. Two other teams in the company already use daily meetings, and both answer customers faster than we do. The total time spent in meetings would fall slightly, from 60 to 50 minutes a week.\n\nI suggest that we try the new meetings for one month and then compare our response times with last month's. I would be glad to lead the meetings during the trial.",
  },
  {
    task: "Write a memo to all students in a program announcing a deadline. Use the heading To, From, Date and Subject; state the deadline at once; explain what to submit and how; and say what happens if it is missed.",
    source:
      "From the program director, Prof. Ines Moreau. Final project proposals are due on 20 October at 5 p.m. Submit one PDF of no more than two pages through the online portal, including a title, a question and a plan. Late proposals will lose one grade step per day.",
    model:
      "To: All students in the Master's Program in Public Policy\nFrom: Prof. Ines Moreau, Program Director\nDate: 1 October\nSubject: Final project proposals due 20 October\n\nYour final project proposal is due on 20 October at 5 p.m.\n\nPlease submit one PDF of no more than two pages through the online portal. Your proposal should include:\n\n- a working title,\n- the research question you will answer, and\n- a plan of how you will answer it.\n\nProposals submitted after the deadline will lose one grade step for each day they are late. If illness or an emergency prevents you from submitting on time, please write to me before the deadline. Your supervisor will be happy to discuss your ideas before then.",
  },
  {
    task: "Write a memo to your team explaining a budget cut and how the team will respond. Use the heading To, From, Date and Subject; state the cut at once; explain its effect; and say what will change.",
    source:
      "From the team leader, Mark Silva. The training budget for next year has been cut from 20,000 to 12,000. External courses will be limited to one per person. The team will set up monthly internal workshops led by staff.",
    model:
      "To: Marketing Team\nFrom: Mark Silva, Team Leader\nDate: 20 November\nSubject: Next year's training budget and our plan\n\nOur training budget for next year has been cut from 20,000 to 12,000, a reduction of 40%.\n\nThis means we cannot fund as many external courses as before. From January, each person may attend one external course during the year, and requests should reach me by the end of February so that I can plan the spending.\n\nTo make up for the reduction, we will hold a monthly internal workshop, led by a member of the team, on a skill they know well. Please let me know by 15 December if you would like to lead one. I know this is disappointing, and I will press for a larger budget the following year.",
  },
  {
    task: "Write a memo to the managers of a company reporting the results of a staff survey. Use the heading To, From, Date and Subject; give the main finding at once; report the key figures; and recommend action.",
    source:
      "From Human Resources, Sofia Petrova. 320 of 400 staff answered. 72% are satisfied with their jobs; 58% say they do not receive enough feedback; 64% would like more flexible hours. Recommend: managers hold a feedback meeting with each person twice a year.",
    model:
      "To: All managers\nFrom: Sofia Petrova, Human Resources\nDate: 5 June\nSubject: Results of the staff survey\n\nMost staff are satisfied with their jobs, but many say they do not receive enough feedback.\n\nOf our 400 staff, 320 answered the survey, a response rate of 80%. The key results are:\n\n- 72% are satisfied with their jobs.\n- 58% say they do not receive enough feedback on their work.\n- 64% would like more flexible working hours.\n\nWe recommend that each manager hold a feedback meeting with every member of their team at least twice a year, starting this autumn. Human Resources will provide a short guide for these meetings. We will report separately on flexible hours after discussing options with the directors.",
  },
  {
    task: "Write a memo to a school's teachers about a new procedure. Use the heading To, From, Date and Subject; state the procedure at once; give the steps in order; and say why it matters.",
    source:
      "From the deputy head, Mr. Tom Hughes. From next week, teachers must record attendance on the computer system within the first ten minutes of each lesson, not at the end. The office needs to contact families of absent students before 10 a.m.",
    model:
      "To: All teaching staff\nFrom: Tom Hughes, Deputy Head\nDate: 2 February\nSubject: Recording attendance in the first ten minutes of each lesson\n\nFrom Monday, 9 February, please record attendance on the computer system within the first ten minutes of every lesson, rather than at the end.\n\nThe steps are:\n\n1. Open the attendance page at the start of the lesson.\n2. Mark each student present, absent or late.\n3. Save the register before ten minutes have passed.\n\nThis matters because the office must contact the families of absent students before 10 a.m., and it cannot do so until registers are complete. An early call can mean a missing student is found quickly. Thank you for your help.",
  },
  {
    task: "Write a memo to your department head requesting new equipment. Use the heading To, From, Date and Subject; state the request at once; justify it; and give the cost and what you need.",
    source:
      "From Dr. Kenji Mori, biology teacher. You request ten new microscopes. Six of the current fifteen are broken, so students share one between three. Each new microscope costs 250. You need approval by 1 March to receive them for the spring term.",
    model:
      "To: Dr. Hana Ito, Head of Science\nFrom: Dr. Kenji Mori, Biology\nDate: 10 February\nSubject: Request for ten new microscopes\n\nI request funding for ten new microscopes for the biology lab, at a total cost of 2,500.\n\nSix of our fifteen microscopes are broken and cannot be repaired, so students now share one microscope between three. In practical lessons, most students spend more time waiting than observing. Ten new microscopes would give us nineteen working ones, enough for every pair in a class of 36.\n\nEach microscope costs 250, and the supplier can deliver them before the spring term if we order by 1 March. I would be grateful for your approval by then.",
  },
  {
    task: "Write a memo to volunteers explaining the plan for an event. Use the heading To, From, Date and Subject; state the event and its purpose at once; give the schedule and tasks; and say how to confirm.",
    source:
      "From the organizer, Lucy Adams. The neighborhood clean-up is on Saturday, 18 April, from 9 a.m. to 1 p.m., starting at the park gate. Volunteers will clean the river path, the park and the market square. Gloves and bags will be provided. Volunteers should confirm by 15 April.",
    model:
      "To: Neighborhood clean-up volunteers\nFrom: Lucy Adams, Organizer\nDate: 1 April\nSubject: Plan for the clean-up on Saturday, 18 April\n\nThank you for volunteering for our neighborhood clean-up on Saturday, 18 April, from 9 a.m. to 1 p.m.\n\nWe will meet at the park gate at 9 a.m., where I will divide everyone into three groups:\n\n- Group 1 will clean the river path.\n- Group 2 will clean the park.\n- Group 3 will clean the market square.\n\nWe will provide gloves, bags and water; please wear sturdy shoes and clothes that can get dirty. We will finish together at the park gate at 1 p.m.\n\nPlease confirm that you are coming by replying to this memo by 15 April, so that we have enough supplies.",
  },
];

/** coverLetterBank asks for a cover letter that names the position, matches experience to its requirements, and closes with a request. */
export const coverLetterBank: readonly WritingItem[] = [
  {
    task: "Write a cover letter for this job. Name the position, show how your experience matches two of its requirements with specific examples, and close by asking for an interview.",
    source:
      "Job posting: Assistant at the City Library. Requirements: experience helping the public; good organization; comfort with computers. Your experience: two years volunteering at a school library, where you organized a book fair; a summer job at a café; you taught older neighbors to use email.",
    model:
      "Dear Hiring Committee,\n\nI am writing to apply for the position of Library Assistant at the City Library, which I saw advertised on your website. As a volunteer at my school's library for two years, I have learned how much a good library depends on people who are organized and glad to help.\n\nYour posting asks for experience helping the public. At my summer job in a busy café, I served hundreds of customers a day and learned to stay patient and friendly when people were in a hurry. I have also taught several older neighbors to use email, so I know how to explain technology clearly to people who find it unfamiliar.\n\nYou also seek someone with good organization. At the school library, I organized our annual book fair, coordinating twelve volunteers and arranging more than 500 books by age and subject. The fair raised enough money to buy forty new books.\n\nI would welcome the chance to discuss how I could contribute to the City Library. Thank you for considering my application; I look forward to hearing from you.\n\nSincerely,\nMei Lin",
  },
  {
    task: "Write a cover letter for this job. Name the position, show how your experience matches two of its requirements with specific examples, and close by asking for an interview.",
    source:
      "Job posting: Junior Data Analyst at Northwind Insurance. Requirements: skill with spreadsheets and statistics; the ability to explain findings to non-specialists. Your experience: a degree in economics; a research project analyzing housing prices; tutoring high school students in math for two years.",
    model:
      "Dear Ms. Clarke,\n\nI am applying for the position of Junior Data Analyst at Northwind Insurance. I recently completed a degree in economics, and I am eager to apply my training in statistics to real business questions.\n\nYour posting calls for skill with spreadsheets and statistics. In my final year, I analyzed ten years of housing prices for my city, cleaning a dataset of 40,000 sales and using regression to identify which features of a home most affected its price. My professor described the project as the strongest in the class.\n\nYou also need someone who can explain findings to people who are not specialists. For two years I tutored high school students in math, and I learned to turn abstract ideas into simple steps and everyday examples. I presented my housing project to a group of local residents, who said it helped them understand the market for the first time.\n\nI would be glad to discuss how these skills could help your team. Thank you for your time and consideration, and I hope to have the opportunity to speak with you.\n\nSincerely,\nTomás Rivera",
  },
  {
    task: "Write a cover letter for this job. Name the position, show how your experience matches two of its requirements with specific examples, and close by asking for an interview.",
    source:
      "Job posting: Summer Camp Counselor at Pine Lake Camp. Requirements: experience working with children aged 8 to 12; first-aid training; enthusiasm for outdoor activities. Your experience: babysitting two families for three years; a first-aid certificate earned last year; leading hikes for your scout group.",
    model:
      "Dear Camp Director,\n\nI would like to apply for the position of Summer Camp Counselor at Pine Lake Camp. I love working with children and spending time outdoors, and your camp offers the chance to do both.\n\nYou are looking for someone with experience working with children aged 8 to 12. For three years, I have regularly looked after the children of two families, who are now 9, 10 and 12. I plan games, help with homework and handle the occasional argument, and both families have asked me back every summer.\n\nYou also want counselors who are enthusiastic about the outdoors and trained in first aid. I earned my first-aid certificate last year, and as a leader in my scout group, I have planned and led six day hikes for younger scouts, teaching them to read maps and stay safe on the trail.\n\nI would be delighted to discuss the position with you. Thank you for considering my application.\n\nSincerely,\nNoah Bennett",
  },
  {
    task: "Write a cover letter for this job. Name the position, show how your experience matches two of its requirements with specific examples, and close by asking for an interview.",
    source:
      "Job posting: Marketing Assistant at Green Leaf Foods. Requirements: experience creating content for social media; strong writing skills; ability to meet deadlines. Your experience: you ran the social media accounts of your university's environmental club, growing followers from 300 to 2,000; you wrote for the student newspaper for three years.",
    model:
      "Dear Mr. Okafor,\n\nI am writing to apply for the position of Marketing Assistant at Green Leaf Foods. Your company's commitment to sustainable farming matches my own interests, and I would be excited to help tell its story.\n\nYour posting asks for experience creating content for social media. For two years I ran the accounts of my university's environmental club, posting short videos and photo stories about our projects. Over that time, our followers grew from 300 to more than 2,000, and one video about a river clean-up was shared over 5,000 times.\n\nYou also seek strong writing skills and the ability to meet deadlines. For three years I wrote for the student newspaper, producing a weekly article on campus life. In that time I never missed a deadline, and my editor often gave me stories with only a day's notice.\n\nI would welcome the opportunity to discuss how I could contribute to your marketing team. Thank you for your consideration.\n\nSincerely,\nAmara Diallo",
  },
  {
    task: "Write a cover letter for this job. Name the position, show how your experience matches two of its requirements with specific examples, and close by asking for an interview.",
    source:
      "Job posting: Research Assistant in a psychology laboratory at Westbrook University. Requirements: experience collecting data from participants; attention to detail; knowledge of research ethics. Your experience: you ran a survey of 200 students for your thesis; you completed an online course in research ethics; you checked data for a professor's project.",
    model:
      "Dear Dr. Moreno,\n\nI am applying for the position of Research Assistant in the Psychology Laboratory at Westbrook University. Having just completed my undergraduate thesis on sleep and memory, I am keen to continue research in a laboratory like yours.\n\nYou are looking for someone with experience collecting data from participants and knowledge of research ethics. For my thesis, I designed and ran a survey of 200 students, recruiting participants, obtaining their informed consent and storing their responses securely. I also completed an online course in research ethics, which covered consent, privacy and the protection of vulnerable participants.\n\nYour posting also emphasizes attention to detail. Last year I checked the data for one of my professor's projects, comparing 3,000 entries with the original paper forms. I found and corrected 42 errors, and she thanked me in the acknowledgments of the published paper.\n\nI would be grateful for the chance to discuss how I could support your research. Thank you for your time.\n\nSincerely,\nHannah Kowalski",
  },
  {
    task: "Write a cover letter for this job. Name the position, show how your experience matches two of its requirements with specific examples, and close by asking for an interview.",
    source:
      "Job posting: Customer Service Representative at Bright Mobile. Requirements: patience with upset customers; ability to solve problems; a second language is an advantage. Your experience: two years at a hotel reception desk; you speak English and Spanish; you created a guide to common guest problems that the hotel still uses.",
    model:
      "Dear Hiring Manager,\n\nI am writing to apply for the position of Customer Service Representative at Bright Mobile. After two years at a busy hotel reception desk, I enjoy helping people solve problems, and I would like to bring that experience to your team.\n\nYour posting asks for patience with upset customers. At the hotel, I dealt every day with guests whose rooms were not ready or whose bookings had gone wrong. I learned to listen first, apologize sincerely and then offer a clear solution, and several guests wrote to the manager to thank me.\n\nYou also need someone who can solve problems, and you mention that a second language is an advantage. I noticed that the same problems came up again and again, so I wrote a short guide to the twelve most common ones and how to fix them, which the hotel still gives to new staff. I also speak Spanish fluently and often helped guests from Spanish-speaking countries.\n\nI would welcome the opportunity to discuss the role with you. Thank you for considering my application.\n\nSincerely,\nCarlos Mendes",
  },
  {
    task: "Write a cover letter for this job. Name the position, show how your experience matches two of its requirements with specific examples, and close by asking for an interview.",
    source:
      "Job posting: Teaching Assistant at Riverside Primary School. Requirements: experience supporting children's reading; ability to work as part of a team; patience. Your experience: you volunteered in a reading program at a primary school for one year, helping six children; you worked on a group project at university; you coach a children's football team.",
    model:
      "Dear Ms. Grant,\n\nI would like to apply for the position of Teaching Assistant at Riverside Primary School. I have seen how much difference one patient adult can make to a child who is learning to read, and I would love to do that work every day.\n\nYour posting asks for experience supporting children's reading. Last year I volunteered in a reading program at Elm Street Primary School, meeting six children twice a week to read with them. By the end of the year, five of the six had reached the expected level for their age, and their teacher asked me to continue this year.\n\nYou also need someone who works well as part of a team and has patience. I coach a children's football team on Saturdays, which has taught me to stay calm and encouraging when things go wrong. At university, I worked with four classmates on a long research project, and I learned to share tasks fairly and keep everyone informed.\n\nThank you for considering my application. I would be very glad to meet you to discuss the position.\n\nSincerely,\nElla Thompson",
  },
  {
    task: "Write a cover letter for this job. Name the position, show how your experience matches two of its requirements with specific examples, and close by asking for an interview.",
    source:
      "Job posting: Intern in the Communications Office of a city government. Requirements: excellent writing; interest in public service; ability to work with people from many backgrounds. Your experience: you studied political science; you wrote press releases for a local charity; you speak three languages; you organized a voter registration drive on campus.",
    model:
      "Dear Communications Director,\n\nI am applying for the internship in the Communications Office of the City of Lakeside. As a student of political science, I believe that good public service depends on clear communication with the people it serves.\n\nYour posting calls for excellent writing. For the past year, I have written press releases for a local food bank, announcing new programs and appeals for donations. Two of my releases were printed almost in full by the local newspaper, and our spring appeal raised a third more than the year before.\n\nYou also seek interest in public service and the ability to work with people from many backgrounds. Last autumn, I organized a voter registration drive on campus with volunteers from eight student groups, and we registered over 600 new voters. Because I speak English, Arabic and French, I was able to help international and immigrant students understand the process.\n\nI would welcome the opportunity to discuss how I could contribute to your office. Thank you for considering my application.\n\nSincerely,\nYasmin Haddad",
  },
  {
    task: "Write a cover letter for this job. Name the position, show how your experience matches two of its requirements with specific examples, and close by asking for an interview.",
    source:
      "Job posting: Sales Assistant at Peak Outdoor Equipment. Requirements: knowledge of outdoor sports; friendly manner with customers; ability to work weekends. Your experience: you climb and hike regularly; you worked for a year at a bookshop; you are available every weekend.",
    model:
      "Dear Store Manager,\n\nI would like to apply for the position of Sales Assistant at Peak Outdoor Equipment. I spend most of my free time climbing and hiking, and I often shop at your store, so I would be proud to work there.\n\nYour posting asks for knowledge of outdoor sports. I have been climbing for five years and hiking for longer, including a two-week trek last summer. I know from experience how much the right boots or backpack matters, and I enjoy helping friends choose equipment for their first trips.\n\nYou also need someone who is friendly with customers and can work weekends. For a year I worked at a busy bookshop, where I helped customers find books and recommended titles based on what they had enjoyed. My manager praised me for building a group of regular customers who asked for me by name. I am available every weekend.\n\nThank you for considering my application. I would be glad to come in to discuss the position.\n\nSincerely,\nRyan Walsh",
  },
  {
    task: "Write a cover letter for this job. Name the position, show how your experience matches two of its requirements with specific examples, and close by asking for an interview.",
    source:
      "Job posting: Administrative Assistant at a law firm, Hart & Lee. Requirements: excellent organization; accuracy with documents; discretion with confidential information. Your experience: you worked for two years as an office assistant at a medical clinic, managing appointments for four doctors and handling patient records.",
    model:
      "Dear Ms. Lee,\n\nI am writing to apply for the position of Administrative Assistant at Hart & Lee. For two years I have worked as an office assistant at a medical clinic, and I am ready to bring my skills to a law firm.\n\nYour posting calls for excellent organization and accuracy with documents. At the clinic, I managed the appointments of four doctors, scheduling about 120 patients a day and making sure that each patient's records were ready before the visit. I introduced a checklist for new patient files that cut missing paperwork by more than half.\n\nYou also require discretion with confidential information. Handling patient records taught me to treat private information with great care. I followed the clinic's privacy rules strictly, never discussed patients outside the office, and was trusted with access to the clinic's most sensitive files.\n\nI would welcome the chance to discuss how my experience could support your firm. Thank you for your consideration.\n\nSincerely,\nSophie Martin",
  },
  {
    task: "Write a cover letter for this job. Name the position, show how your experience matches two of its requirements with specific examples, and close by asking for an interview.",
    source:
      "Job posting: Junior Web Developer at Blue Harbor Studio. Requirements: experience building websites; ability to learn new tools quickly; good communication with clients. Your experience: you built websites for three small businesses as a freelancer; you taught yourself a new programming framework in a month for a project; you studied computer science.",
    model:
      "Dear Hiring Team,\n\nI am applying for the position of Junior Web Developer at Blue Harbor Studio. I have admired your studio's work for local businesses, and I would be excited to join a team that builds websites with such care.\n\nYour posting asks for experience building websites and good communication with clients. While studying computer science, I built websites for three small businesses as a freelancer: a bakery, a bicycle repair shop and a dentist. I met each owner to understand what their customers needed, explained my plans without technical language, and delivered each site on time. The bakery's online orders doubled within three months.\n\nYou also seek someone who learns new tools quickly. When one client needed features my usual tools could not provide, I taught myself a new framework in a month and finished the project on schedule.\n\nI would be glad to show you my work and discuss how I could contribute. Thank you for considering my application.\n\nSincerely,\nArjun Patel",
  },
  {
    task: "Write a cover letter for this job. Name the position, show how your experience matches two of its requirements with specific examples, and close by asking for an interview.",
    source:
      "Job posting: Volunteer Coordinator at Harbor Animal Shelter. Requirements: experience organizing people; good record keeping; love of animals. Your experience: you organized volunteers for a school charity event; you kept the membership records of your sports club for two years; you have fostered three dogs.",
    model:
      "Dear Shelter Director,\n\nI would like to apply for the position of Volunteer Coordinator at Harbor Animal Shelter. I have fostered three dogs over the past two years, and I would love to help the shelter find and support the volunteers it depends on.\n\nYour posting asks for experience organizing people. Last spring, I organized forty volunteers for my school's charity fun run, assigning roles, preparing a schedule and briefing everyone on the day. The event ran smoothly and raised more than any previous year.\n\nYou also need good record keeping. For two years I kept the membership records of my sports club, tracking more than 150 members, their payments and their contact details. I moved the records from paper to a spreadsheet, which made it much easier for the club to contact members and follow up on fees.\n\nI would be delighted to discuss how I could help the shelter. Thank you for considering my application.\n\nSincerely,\nLaura Kim",
  },
];
