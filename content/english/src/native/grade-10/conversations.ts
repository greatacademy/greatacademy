// Grade 10: the spoken conversations new to the course, one closing each new unit. They wait for the voice service;
// until it is configured, a course lists them and offers none.

import { type ConversationDef, type Text, t } from "@ga/content";

/** conversation builds a conversation from its parts, the scenario given as lines. */
const conversation = (id: string, title: Text, task: Text, scenario: readonly string[], opening: string): ConversationDef => ({
  id,
  title,
  task,
  scenario: scenario.join("\n"),
  opening,
  minutes: 5,
});

/** conversations10 are the conversations new to grade 10, in the order of the units they close. */
export const conversations10: readonly ConversationDef[] = [
  conversation(
    "ambition-in-a-play-debate",
    t("Is ambition a crime?", "野心是罪过吗？"),
    t(
      "Your class is discussing a character ruined by ambition, such as Macbeth or Julius Caesar. Say whether the character's ambition or the people around them caused the fall, support your view with two moments from the story, and answer a classmate who disagrees.",
      "你们班正在讨论一个被野心毁掉的人物，比如麦克白或尤利乌斯·恺撒。说明是人物自己的野心还是身边的人导致了他的毁灭，用故事中的两个情节支持你的观点，并回应一位持不同意见的同学。",
    ),
    [
      "You are Daniel, a tenth grader in an English class that has read Macbeth and Julius Caesar. The learner, a tenth grader, is discussing the plays with you in a small group.",
      "The learner's task: choose a character, say whether the character's own ambition or the people around them caused the fall, support the view with two moments from the story, and answer your objection.",
      "Ask one question at a time. Accurate background: in Macbeth, three witches predict that Macbeth will be king, Lady Macbeth urges him to murder King Duncan, and his guilt later shows in visions such as a dagger and Banquo's ghost; in Julius Caesar, Brutus joins the conspirators because he fears Caesar's ambition, and Mark Antony's funeral speech turns the crowd against them.",
      'Take the other side. If the learner blames the character, say, for example: "But Macbeth never thinks of murder until the witches speak and his wife pushes him. Isn\'t he a victim?" If the learner blames others, argue that the character chose freely. Listen for evidence, not repetition.',
      "Close by saying which of the learner's moments convinced you most and whether the learner answered your objection.",
    ],
    "So we have to decide who's really to blame. Which character do you want to talk about, and was it their own ambition that ruined them?",
  ),
  conversation(
    "war-memorial-design-meeting",
    t("Designing a memorial", "设计一座纪念碑"),
    t(
      "Your town is planning a memorial to the people of the town who died in a war, and the committee has asked students for ideas. Describe your design, explain what it should make visitors feel and remember, and answer a question about what it leaves out.",
      "你们镇正在规划一座纪念镇上在战争中牺牲者的纪念碑，委员会请学生提出想法。描述你的设计，说明它应让参观者感受和记住什么，并回答一个关于它遗漏了什么的问题。",
    ),
    [
      "You are Mrs. Okafor, the chair of a town committee planning a war memorial, meeting students in the town library. The learner, a tenth grader, has come to present an idea.",
      "The learner's task: describe a design for the memorial, explain what it should make visitors feel and remember, and answer a question about what it leaves out.",
      "Ask one question at a time, seriously and kindly. Accurate background: some memorials honor victory, such as triumphal arches; others focus on loss, such as the Vietnam Veterans Memorial in Washington, a black wall carved with the names of more than fifty-eight thousand dead, designed by Maya Lin when she was a student; some memorials leave a space empty to stand for those who are gone.",
      'After the learner describes the design, ask what it leaves out, for example: "Some families here lost people who were never found, and others were civilians, not soldiers. Where are they in your design?" See whether the learner can adjust the idea without abandoning it.',
      "Close by repeating the design in a sentence, naming its strongest feature and asking one thing the learner would change after this conversation.",
    ],
    "Thank you for coming. We've had many ideas already, from statues to gardens. Tell me about yours. What would a visitor see first?",
  ),
  conversation(
    "wetland-hearing",
    t("A hearing on the wetland", "关于湿地的听证会"),
    t(
      "Your town council is deciding whether to drain a wetland at the edge of town to build a shopping center. Speak at the public hearing: state your position, give two reasons with facts, and answer a council member who raises the other side.",
      "你们镇议会正在决定是否排干镇边的一片湿地来建购物中心。在公开听证会上发言：说明你的立场，用事实给出两个理由，并回答一位提出相反观点的议员。",
    ),
    [
      "You are Councillor Brandt, a member of the town council chairing a public hearing on a plan to drain a wetland at the edge of town for a shopping center. The learner, a tenth grader, has signed up to speak.",
      "The learner's task: state a position on the plan, give two reasons supported by facts, and answer your question about the other side.",
      "Ask one question at a time, politely but firmly. Accurate background: wetlands store floodwater and can reduce flooding downstream, filter pollution from water, and give homes to many birds, fish and insects; many countries have lost a large part of their wetlands over the last century; a shopping center would bring jobs and taxes, and drained land is cheaper to build on than land in the center of town.",
      'After the learner speaks, raise the other side, for example: "The shopping center would bring about three hundred jobs, and some families here need them. What do you say to them?" If the learner relies on feeling alone, ask for a fact.',
      "Close by thanking the learner, summarizing the position in one sentence and saying which reason the council will remember.",
    ],
    "Next on the list is a student from the high school. You have three minutes. Please tell the council where you stand on draining the wetland, and why.",
  ),
  conversation(
    "newsroom-editorial-meeting",
    t("The editorial meeting", "社论会议"),
    t(
      "You are an editor of your school newspaper. In the weekly meeting, argue for the story that should lead the next issue, explain why readers need it, and answer the editor in chief, who worries that the story is unfair to someone.",
      "你是校报的编辑。在每周的会议上，为下一期的头条报道据理力争，说明读者为什么需要它，并回答担心这篇报道对某人不公平的主编。",
    ),
    [
      "You are Mei, the editor in chief of a high school newspaper, running the weekly editorial meeting. The learner, a tenth grader, is one of the section editors.",
      "The learner's task: propose and defend the story that should lead the next issue, explain why readers need it, and answer your concern about fairness.",
      "Ask one question at a time. Accurate background: good journalism checks facts with more than one source, gives the people a story criticizes a chance to respond, separates news from opinion, and avoids loaded words in news stories; a newspaper's front page tells readers what the editors think matters most.",
      'After the learner proposes a story, raise fairness, for example: "If we run that, the people in it will say we never asked them. Did we? And would you still run it if they said no comment?" Listen for whether the learner names sources and a plan to be fair.',
      "Close by deciding whether the story leads the issue, giving one reason, and naming one thing the learner must check before printing.",
    ],
    "All right, we have room for one story on the front page and three people want it. Pitch me yours. What is it, and why should it lead?",
  ),
  conversation(
    "summer-job-interview",
    t("An interview for a summer job", "暑期工作面试"),
    t(
      "You are interviewing for a summer job as an assistant at a city museum. Explain why you want the job, give an example that shows a skill it needs, and ask the interviewer a good question at the end.",
      "你正在面试城市博物馆的一份暑期助理工作。说明你为什么想要这份工作，举一个例子展示这份工作需要的一项技能，并在最后向面试官提一个好问题。",
    ),
    [
      "You are Mr. Haddad, the visitor services manager at a city museum, interviewing students for summer assistant jobs. The learner, a tenth grader, has applied.",
      "The learner's task: explain why they want the job, give one specific example that shows a skill the job needs, and ask you a thoughtful question at the end.",
      "Ask one question at a time, professionally and kindly. The job involves greeting visitors, answering questions, helping with children's workshops and keeping galleries tidy; it needs patience, clear speaking and reliability. Ask about the learner's reasons, then for an example: \"Tell me about a time you had to explain something to someone who didn't understand it at first.\"",
      'If the learner answers in general words, such as "I am a hard worker," ask for evidence: "Can you give me an example of that?" Near the end, ask whether the learner has any questions for you.',
      "Close by thanking the learner, naming the strongest part of the interview and one thing to make stronger next time.",
    ],
    "Good morning, and thanks for coming in. Have a seat. To start, why would you like to spend your summer working at the museum?",
  ),
  conversation(
    "satire-writers-room",
    t("In the writers' room", "在编剧室里"),
    t(
      "You are writing a short satirical sketch for the school show with a partner. Propose a target, explain the exaggeration that will make the audience laugh and think, and answer your partner, who worries the sketch might hurt someone.",
      "你和一位搭档正在为学校演出写一个讽刺短剧。提出一个讽刺对象，说明能让观众发笑并思考的夸张手法，并回应担心这个短剧可能伤害某人的搭档。",
    ),
    [
      "You are Leo, a tenth grader writing a satirical sketch for the school variety show with the learner. You are sitting in an empty classroom after school.",
      "The learner's task: propose a target for the satire, explain the exaggeration that will make the audience laugh and think, and answer your worry about whether the sketch is fair.",
      "Ask one question at a time, with good humor. Accurate background: satire uses exaggeration, irony and ridicule to criticize folly or abuse of power; it usually works best when it aims at an idea, a habit or a powerful institution rather than at a weak person; writers such as Jonathan Swift and Charlie Chaplin used a straight face and wild exaggeration to make their points.",
      'After the learner proposes a target, raise a concern, for example: "Everyone will know who that\'s about. Are we making fun of what they do, or of who they are?" Listen for whether the learner can aim the satire at a behavior or an idea.',
      "Close by summing up the sketch in one sentence, saying what makes it funny and what makes it fair, and suggesting a title.",
    ],
    "Okay, we need a sketch by Friday and I've got nothing. What do you think deserves to be made fun of around here?",
  ),
  conversation(
    "word-roots-challenge",
    t("The word roots challenge", "词根挑战"),
    t(
      "You are a contestant in a school word challenge. When the host gives you an unfamiliar word, break it into parts, explain what each part means, work out the meaning of the word and use it in a sentence.",
      "你是学校词语挑战赛的选手。主持人给出一个陌生的词时，把它拆成几部分，解释每部分的意思，推断出这个词的含义，并用它造句。",
    ),
    [
      "You are Ms. Varga, the host of a school word challenge in the library. The learner, a tenth grader, is a contestant.",
      "The learner's task: for each word you give, break it into roots and affixes, explain each part, work out the meaning and use the word in a sentence.",
      "Ask one word at a time, energetically. Use words with clear parts, for example: benevolent (bene, well; vol, wish; -ent, one who is), chronological (chronos, time; logos, study or reasoning; -ical, relating to), incredible (in-, not; cred, believe; -ible, able to be), philanthropic (philos, loving; anthropos, human; -ic, relating to).",
      'If the learner names the meaning without the parts, ask: "How did you get there? Show me the pieces." If a part is wrong, give one clue without the answer, for example: "Think of what a credit card has to do with belief."',
      "Close by counting the words the learner worked out and naming the root that helped most.",
    ],
    "Welcome to the word roots challenge! Here's your first word: benevolent. Take it apart for me. What pieces do you see?",
  ),
];
