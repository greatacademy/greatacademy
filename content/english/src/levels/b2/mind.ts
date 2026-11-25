// B2, unit 10: Mind and Behavior. Psychology, strong feelings, decisions, habits, memory and sleep, bonds, motivation,
// body language, wellbeing, personality types, and weighing ideas; inversion after negative adverbs. Its other
// topics, parallel structure and revising a draft, already exist.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill } from "../a2/kit.ts";
import { vocabularyTopic, word } from "../words.ts";

const psychology = vocabularyTopic({
  id: "b2-words-psychology",
  title: t("Psychology", "心理学"),
  summary: t(
    "Psychologists and psychological research; the conscious and the subconscious mind; consciousness; instincts and instinctive reactions; cognition; behavioral science; temperaments, dispositions and mindsets.",
    "心理学家和心理学研究；意识和潜意识；意识状态；本能和本能的反应；认知；行为科学；气质、性情和心态。",
  ),
  intro: t(
    "A **psychologist** showed people pictures for a split second. They were not **conscious** of seeing them, but their **subconscious** mind still reacted, and their **instinct** was to choose the pictures they had seen. These words help you talk about how the mind works.",
    "一位 **psychologist**（心理学家）让人们看一闪而过的图片。他们并没有 **conscious**（意识到）自己看见了，但 **subconscious**（潜意识）仍有反应，他们的 **instinct**（本能）让他们选中了看过的图片。这些词帮你谈论心智是如何运作的。",
  ),
  prerequisites: ["b2-words-mental-health"],
  words: [
    word(
      "psychologist psychologists",
      "a scientist who studies the mind and behavior",
      "心理学家",
      "The {psychologist} studied how the children's minds handled fear. | {Psychologists} have studied why people put things off.|Physicists Physiologists | She saw a {psychologist} to talk through her fear of flying.",
      "physicist physiologist",
    ),
    word(
      "psychological",
      "connected with the mind and how it works",
      "心理的；心理学的",
      "Losing a job can have serious {psychological} effects, such as anxiety and low mood. | The coach says the final is a {psychological} battle as much as a physical one. | He needed {psychological} support to cope with his nightmares after the accident.",
      "physical physiological",
    ),
    word(
      "subconscious",
      "the part of the mind that you are not aware of; existing in it",
      "潜意识（的）",
      "Our {subconscious} fears, which we are not aware of, often appear in dreams. | Advertisers try to reach the {subconscious} mind, below our awareness. | Somewhere in my {subconscious}, I knew he was lying, though I didn't realize it.|consciousness conscience",
      "conscious deliberate",
      "conscious",
    ),
    word(
      "conscious",
      "awake and able to see and hear; aware of something",
      "清醒的；意识到的",
      "The patient was {conscious} and talking when the ambulance arrived. | She was {conscious} that everyone was looking at her, and her face went red. | He made a {conscious} decision, after thinking about it carefully, to eat less sugar.",
      "unconscious subconscious",
      "subconscious",
    ),
    word(
      "consciousness",
      "the state of being awake and aware; the ideas and feelings that a person or a group has",
      "意识；知觉",
      "He lost {consciousness} after hitting his head and woke up in hospital. | Scientists still do not understand how {consciousness}, our awareness of ourselves, works. | The film raised public {consciousness} about the problem, so more people knew of it.",
      "cognition conscience",
      "cognition",
    ),
    word(
      "instinct instincts",
      "a natural way of behaving or feeling that you do not have to learn",
      "本能；直觉",
      "Birds build nests by {instinct}, without being taught. | My first {instinct}, before I could think, was to run away. | Trust your {instincts}: if it feels wrong, it probably is.|habits mindsets",
      "habit mindset",
      "instinctive",
    ),
    word(
      "instinctive",
      "done without thinking, because it comes naturally",
      "本能的；直觉的",
      "Pulling your hand away from a flame, without thinking, is {instinctive}. | She knows by nature what children need: her understanding is {instinctive}. | Babies' fear of falling is {instinctive}: nobody teaches it to them.",
      "conscious deliberate",
      "instinct",
    ),
    word(
      "cognition",
      "the mental processes of knowing, thinking, learning and remembering",
      "认知",
      "Sleep is important for {cognition}: thinking, learning and remembering. | The drug may improve {cognition}, helping older people think and remember better. | She studies the {cognition} of babies: how they learn and think.",
      "temperament instinct",
      "consciousness",
    ),
    word(
      "behavioral",
      "connected with the way people or animals behave",
      "行为的",
      "The boy has {behavioral} problems at school: he hits and shouts in class. | {Behavioral} scientists study the choices people make and how they act. | Some changes are {behavioral}, such as eating more slowly.",
      "conscious instinctive",
    ),
    word(
      "temperament temperaments",
      "a person's basic nature, especially how calm or emotional they are",
      "气质；性情",
      "She has a calm {temperament} and rarely gets angry. | Horses with a gentle {temperament} are good for beginners. | The twins have very different {temperaments}: one is calm, the other is wild.|cognitions consciousnesses",
      "cognition consciousness",
      "disposition",
    ),
    word(
      "disposition dispositions",
      "a person's natural character; a tendency to behave in a certain way",
      "性情；倾向",
      "He has a cheerful {disposition} and is always smiling. | She has a nervous {disposition} and worries about small things. | People with sunny {dispositions} often live longer.|cognitions consciousnesses",
      "cognition consciousness",
      "temperament",
    ),
    word(
      "mindset mindsets",
      "a person's way of thinking and their attitudes",
      "心态；思维方式",
      "With a growth {mindset}, you believe you can improve with effort. | We need to change the old {mindset}, the way of thinking that says boys don't cry. | Leaders with fixed {mindsets} fear new ideas.|cognitions instincts",
      "cognition instinct",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Conscious* means aware, while *subconscious* describes the part of the mind you are not aware of. Look for words such as *not aware*, *without realizing* or *after thinking carefully* that show which one fits.",
        "*conscious* 是意识到的，*subconscious* 指你自己察觉不到的那部分心智。找找句中的 *not aware*、*without realizing* 或 *after thinking carefully* 这类词，判断该用哪个。",
      ),
      meaning: t(
        "Your *temperament* or *disposition* is the nature you are born with, while your *mindset* is a way of thinking that you can change. Check whether the meaning is about nature or about thinking.",
        "*temperament* 或 *disposition* 是天生的性情，*mindset* 是可以改变的思维方式。看释义说的是天性，还是想法。",
      ),
      spell: t(
        "*Psychologist* and *psychological* start with a silent p; *conscious* has sc in the middle; *behavioral* has no u in American English.",
        "*psychologist* 和 *psychological* 开头的 p 不发音；*conscious* 中间是 sc；*behavioral* 在美式拼法中没有 u。",
      ),
    },
    notes: `
      psychologist|how children's minds handle fear;why people put things off;talking through a fear of flying|a psychologist studies the mind; a physiologist studies how the body works|psychologist 研究心智；physiologist 研究身体机能|physicist/physicists=a physicist studies matter and energy, not the mind and behavior=physicist 研究物质和能量，不研究心智和行为;physiologist/physiologists=a physiologist studies how the body works, not fears and habits of the mind=physiologist 研究身体机能，不研究心理上的恐惧和习惯|psy · chol · o · gist|a silent p at the start, and ch sounding like k|开头 p 不发音，ch 读作 k
      psychological|anxiety and low mood after losing a job;a battle as much of the mind as of the body;help with nightmares after an accident|psychological is about the mind; physical is about the body|psychological 是心理的；physical 是身体的|physical=physical is about the body, but the sentence is about fears and feelings of the mind=physical 说的是身体，而句子说的是心里的恐惧和感受;physiological=physiological is about how the body works, not about the mind=physiological 是生理的，不是心理的|psy · cho · log · i · cal|a silent p, and psycho + logical|开头 p 不发音，psycho + logical
      subconscious|fears that appear in dreams;the mind below our awareness;knowing without realizing it|subconscious is the part of the mind you are not aware of; conscious means aware|subconscious 是察觉不到的潜意识；conscious 是意识到的|conscious=conscious means aware, the opposite of the part of the mind you are not aware of=conscious 是意识到的，和察觉不到的潜意识正相反;deliberate=deliberate means done on purpose, not hidden below your awareness=deliberate 是故意的，不是藏在意识之下的;consciousness=consciousness is your awareness, the opposite of the hidden part of the mind=consciousness 是清醒的意识，和隐藏的潜意识正相反;conscience=your conscience tells you right from wrong, not what you know without realizing it=conscience 是分辨对错的良心，不是不自觉知道的东西|sub · con · scious|sub + conscious, with sc in the middle|sub + conscious，中间是 sc
      conscious|a patient awake and talking;knowing that everyone is looking;a decision made after careful thought|conscious means awake or aware; subconscious is the part of the mind you are not aware of|conscious 是清醒、意识到的；subconscious 是潜意识|unconscious=unconscious means not awake or not aware, the opposite of the sentence=unconscious 是昏迷或没意识到，和句子意思正相反;subconscious=subconscious describes what you are not aware of, not someone awake, aware or deciding on purpose=subconscious 指察觉不到的东西，不是清醒、意识到或有意决定|con · scious|sc in the middle, then -ious|中间是 sc，再接 -ious
      consciousness|waking in hospital after a blow to the head;our awareness of ourselves;more people knowing of a problem|consciousness is being awake and aware; cognition is thinking and learning|consciousness 是意识；cognition 是认知|cognition=cognition is thinking and remembering, not being awake or aware=cognition 是思考和记忆，不是清醒或觉知;conscience=your conscience tells you right from wrong, not whether you are awake or aware=conscience 是分辨对错的良心，不是清醒或觉知|con · scious · ness|conscious + ness, with a double s at the end|conscious + ness，结尾双写 s
      instinct|birds building nests without being taught;wanting to run before you can think;a feeling that something is wrong|an instinct is natural, not learned; a habit is learned by doing something again and again|instinct 是天生的本能；habit 是后天养成的习惯|habit/habits=a habit is learned by doing something again and again, not something natural you never had to learn=habit 是反复做而养成的，不是不用学的天性;mindset/mindsets=a mindset is a way of thinking, not a natural reaction you do not have to learn=mindset 是思维方式，不是不用学的天生反应|in · stinct|-stinct at the end, with a c before the t|结尾是 -stinct，t 前面有 c
      instinctive|pulling a hand from a flame without thinking;knowing by nature what children need;a fear nobody teaches babies|instinctive means done naturally without thinking; deliberate means done on purpose|instinctive 是本能的；deliberate 是故意的|conscious=conscious means aware and thinking about it, the opposite of without thinking=conscious 是有意识的，和不假思索正相反;deliberate=deliberate means done on purpose after thinking, not natural and without thought=deliberate 是经过考虑故意做的，不是自然而然的|in · stinc · tive|instinct + ive|instinct + ive
      cognition|thinking, learning and remembering in sleep;older people thinking and remembering better;how babies learn and think|cognition is thinking and learning; temperament is your basic nature|cognition 是认知；temperament 是性情|temperament=temperament is how calm or emotional you are, not how you think and remember=temperament 是性情，不是思考和记忆;instinct=an instinct is a natural reaction, not the mental work of learning and remembering=instinct 是天生反应，不是学习和记忆的思维过程|cog · ni · tion|cog + nition, the g said before the n|cog + nition，g 和 n 分开读
      behavioral|a boy who hits and shouts in class;the choices people make and how they act;eating more slowly|behavioral is about how people act; conscious is about being aware|behavioral 是行为上的；conscious 是有意识的|conscious=conscious means aware, not connected with the way people act=conscious 是意识到的，与行为无关;instinctive=instinctive means natural and unlearned, not about problems or changes in the way people act=instinctive 是天生的，不是说行为上的问题或改变|be · hav · ior · al|behavior + al, with no u in American English|behavior + al，美式拼法没有 u
      temperament|a calm nature that rarely gets angry;a gentle nature in horses;twins, one calm and one wild|temperament is your basic nature; mindset is a way of thinking you can change|temperament 是天性；mindset 是可以改变的思维方式|cognition/cognitions=cognition is thinking and remembering, not how calm or emotional someone is=cognition 是思考和记忆，不是性情平和与否;consciousness/consciousnesses=consciousness is being awake and aware, not how calm or emotional someone is=consciousness 是清醒的意识，不是性情|tem · per · a · ment|temper + a + ment, with an a in the middle|temper + a + ment，中间有 a
      disposition|a cheerful man always smiling;a nervous woman worrying about small things;sunny people who live longer|disposition is your natural character; cognition is your thinking|disposition 是性情；cognition 是认知|cognition/cognitions=cognition is thinking and remembering, not a cheerful or nervous character=cognition 是思考和记忆，不是开朗或紧张的性格;consciousness/consciousnesses=consciousness is being awake and aware, not a cheerful or nervous character=consciousness 是清醒的意识，不是开朗或紧张的性格|dis · po · si · tion|dispose drops its e before -ition|dispose 去掉 e 再加 -ition
      mindset|believing you can improve with effort;the old idea that boys don't cry;leaders afraid of new ideas|a mindset is a way of thinking you can change; an instinct is a natural reaction|mindset 是可以改变的思维方式；instinct 是天生反应|cognition/cognitions=cognition is the mental work of thinking and remembering, not an attitude you can hold or change=cognition 是思考和记忆的过程，不是可以持有或改变的态度;instinct/instincts=an instinct is natural and unlearned, not a way of thinking you can change=instinct 是天生的，不是可以改变的思维方式|mind · set|mind + set, one word|mind + set，连写成一个词
    `,
  },
});

const feelings = vocabularyTopic({
  id: "b2-words-strong-feelings",
  title: t("Strong Feelings", "强烈的情感"),
  summary: t(
    "Overwhelmed and desperate; ecstatic, thrilled and delighted; furious and irritated; satisfied and dissatisfied; resentful and envious; nostalgic.",
    "不知所措的和绝望的；狂喜的、兴奋的和高兴的；暴怒的和恼火的；满意的和不满意的；怨恨的和嫉妒的；怀旧的。",
  ),
  intro: t(
    "When Ana got into her dream school, she was **ecstatic**. Her best friend felt a little **envious**, her brother was **thrilled**, and her parents were simply **delighted**. These words help you say exactly how strong a feeling is.",
    "安娜考上理想的学校时，她 **ecstatic**（欣喜若狂）。她最好的朋友有点 **envious**（羡慕），哥哥 **thrilled**（兴奋极了），父母则十分 **delighted**（高兴）。这些词帮你准确说出一种感受有多强烈。",
  ),
  prerequisites: ["b1-words-emotions"],
  words: [
    word(
      "overwhelmed",
      "feeling so much emotion or having so much to do that you cannot cope",
      "不知所措的；无法承受的",
      "With three exams in one week, she felt completely {overwhelmed} and couldn't cope. | He was {overwhelmed} by all the kind messages after his father died, and burst into tears. | New parents often feel {overwhelmed} by the amount of work and don't know where to start.",
      "satisfied irritated",
    ),
    word(
      "ecstatic",
      "extremely happy and excited",
      "狂喜的",
      "She was {ecstatic} when she heard she had won the prize. | The fans were {ecstatic} and danced after their team's last-minute goal. | My parents were {ecstatic} about the news of the baby and called everyone.",
      "furious resentful",
      "thrilled delighted",
    ),
    word(
      "thrilled",
      "very pleased and excited",
      "非常兴奋的；极为高兴的",
      "Thank you, I'm {thrilled} to be invited to your wedding! | The children were {thrilled} with their new puppy and played with it all day. | We were {thrilled} that the plan worked so well.",
      "irritated envious",
      "ecstatic delighted",
    ),
    word(
      "delighted",
      "very pleased",
      "高兴的；乐意的",
      "I'd be {delighted} to help you. | She was {delighted} with her exam results: all As! | We are {delighted} to announce the birth of our daughter.",
      "furious dissatisfied",
      "thrilled ecstatic",
    ),
    word(
      "furious",
      "extremely angry",
      "暴怒的",
      "Dad was {furious} when I crashed his car, and shouted for an hour. | She was {furious} with herself for missing the train. | The {furious} customer shouted at the manager.",
      "delighted satisfied",
      "irritated",
    ),
    word(
      "irritated",
      "a little angry or annoyed",
      "恼火的；烦躁的",
      "He was {irritated} by the noise from next door. | I get a little {irritated} when people are late. | She looked {irritated} and kept checking her watch.",
      "delighted ecstatic",
      "furious",
    ),
    word(
      "satisfied",
      "pleased because you have got what you wanted",
      "满意的",
      "Are you {satisfied} with the service, or would you like to complain? | The teacher was {satisfied} with my essay and gave it an A. | Customers who are {satisfied} come back again.",
      "dissatisfied resentful",
      "dissatisfied",
    ),
    word(
      "dissatisfied",
      "not pleased with something because it is not good enough",
      "不满意的",
      "Many workers are {dissatisfied} with their pay and are going on strike. | {Dissatisfied} customers can ask for their money back. | She was {dissatisfied} with the hotel and wrote a bad review.",
      "satisfied delighted",
      "satisfied",
    ),
    word(
      "resentful",
      "feeling angry because you think you have been treated unfairly",
      "怨恨的；忿忿不平的",
      "He felt {resentful} that his brother got all the attention. | Workers were {resentful} of the managers' huge bonuses. | She was {resentful} about having to do all the housework.",
      "delighted satisfied",
      "envious",
    ),
    word(
      "nostalgic",
      "feeling happy and a little sad when you think about the past",
      "怀旧的；思乡的",
      "Old photos make me {nostalgic} for my childhood. | The song makes people {nostalgic} for the 1990s. | He felt {nostalgic} when he visited his old school.",
      "furious irritated",
    ),
    word(
      "envious",
      "wanting something that someone else has",
      "嫉妒的；羡慕的",
      "I'm {envious} when I see people who can sleep anywhere, because I can't. | She felt {envious} when her sister won the prize she had wanted herself. | His friends were {envious} when he bought a new car they couldn't afford.",
      "satisfied delighted",
      "resentful",
    ),
    word(
      "desperate",
      "having lost hope; needing or wanting something very much",
      "绝望的；极度渴望的",
      "After a week without food, the people were {desperate}. | I'm {desperate} for a cup of coffee: I haven't had one all day. | They made one last {desperate} attempt to save the failing business.",
      "satisfied delighted",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Irritated* is only a little angry, while *furious* is extremely angry. Look at how strong the reaction is: checking a watch is *irritated*, shouting for an hour is *furious*.",
        "*irritated* 只是有点生气，*furious* 是暴怒。看反应有多强烈：看看手表是 *irritated*，吼一个小时是 *furious*。",
      ),
      meaning: t(
        "*Resentful* is anger at being treated unfairly, while *envious* is wanting what someone else has. Check whether the meaning is about unfairness or about wanting.",
        "*resentful* 是因受到不公平对待而怨恨，*envious* 是想要别人拥有的东西。看释义说的是不公平，还是想要。",
      ),
      spell: t(
        "*Dissatisfied* is dis + satisfied, so it has a double s; *ecstatic* starts with ec, not ex; *desperate* has -per- in the middle.",
        "*dissatisfied* 是 dis + satisfied，所以双写 s；*ecstatic* 以 ec 开头，不是 ex；*desperate* 中间是 -per-。",
      ),
    },
    notes: `
      overwhelmed|three exams in one week;kind messages after a father's death;the amount of work for new parents|overwhelmed means feeling too much to cope with; irritated means a little annoyed|overwhelmed 是承受不住；irritated 是有点烦|satisfied=satisfied means pleased with what you got, not unable to cope=satisfied 是满意，不是应付不过来;irritated=irritated means a little annoyed, which is far weaker than not being able to cope=irritated 只是有点烦，远不到无法承受|o · ver · whelmed|over + whelmed, with an h after the w|over + whelmed，w 后面有 h
      ecstatic|winning a prize;fans dancing after a late goal;news of a baby|ecstatic means extremely happy; thrilled means very pleased and excited|ecstatic 是狂喜；thrilled 是兴奋高兴|furious=furious means extremely angry, the opposite of extremely happy=furious 是暴怒，和狂喜正相反;resentful=resentful means angry at being treated unfairly, not extremely happy=resentful 是因不公平而怨恨，不是狂喜|ec · stat · ic|ec at the start, not ex|以 ec 开头，不是 ex
      thrilled|an invitation to a wedding;children playing with a new puppy;a plan that worked well|thrilled means very pleased and excited; delighted means very pleased|thrilled 是兴奋高兴；delighted 是很高兴|irritated=irritated means annoyed, not pleased and excited=irritated 是恼火，不是兴奋高兴;envious=envious means wanting what someone else has, not pleased about good news of your own=envious 是想要别人的东西，不是为自己的好事高兴|thrilled|thr at the start and a double l|以 thr 开头，双写 l
      delighted|being glad to help;exam results that were all As;the birth of a daughter|delighted means very pleased; satisfied means pleased that something is good enough|delighted 是很高兴；satisfied 是满意|furious=furious means extremely angry, the opposite of very pleased=furious 是暴怒，和很高兴正相反;dissatisfied=dissatisfied means not pleased because something is not good enough=dissatisfied 是因为不够好而不满意|de · light · ed|de + light + ed, with a silent gh|de + light + ed，gh 不发音
      furious|a crashed car and an hour of shouting;anger at herself for missing a train;a customer shouting at a manager|furious means extremely angry; irritated means a little annoyed|furious 是暴怒；irritated 是有点恼火|delighted=delighted means very pleased, the opposite of extremely angry=delighted 是很高兴，和暴怒正相反;satisfied=satisfied means pleased with what you got, not extremely angry=satisfied 是满意，不是暴怒|fu · ri · ous|-ious at the end, as in *curious*|结尾是 -ious，和 *curious* 一样
      irritated|noise from next door;people who are late;checking a watch again and again|irritated means a little annoyed; furious means extremely angry|irritated 是有点恼火；furious 是暴怒|delighted=delighted means very pleased, the opposite of annoyed=delighted 是很高兴，和恼火正相反;ecstatic=ecstatic means extremely happy, the opposite of annoyed=ecstatic 是狂喜，和恼火正相反|ir · ri · tat · ed|a double r: irritate + d|双写 r：irritate + d
      satisfied|the service before a complaint;an essay that got an A;customers who come back|satisfied means pleased that you got what you wanted; dissatisfied means not pleased|satisfied 是满意；dissatisfied 是不满意|dissatisfied=dissatisfied means not pleased, which does not fit someone happy enough to come back or give an A=dissatisfied 是不满意，和愿意回头或给 A 不符;resentful=resentful means angry at unfair treatment, not pleased with what you got=resentful 是因不公而怨恨，不是满意|sat · is · fied|satisfy changes its y to i before -ed|satisfy 的 y 变 i 再加 -ed
      dissatisfied|workers striking over pay;customers asking for their money back;a bad review of a hotel|dissatisfied means not pleased because something is not good enough; satisfied means pleased|dissatisfied 是不满意；satisfied 是满意|satisfied=satisfied means pleased, the opposite of striking, asking for money back or writing a bad review=satisfied 是满意，和罢工、退款或差评正相反;delighted=delighted means very pleased, the opposite of not pleased=delighted 是很高兴，和不满意正相反|dis · sat · is · fied|dis + satisfied, so a double s|dis + satisfied，所以双写 s
      resentful|a brother who got all the attention;managers' huge bonuses;doing all the housework alone|resentful means angry at being treated unfairly; envious means wanting what someone else has|resentful 是因不公而怨恨；envious 是羡慕嫉妒|delighted=delighted means very pleased, not angry at being treated unfairly=delighted 是很高兴，不是因不公而怨恨;satisfied=satisfied means pleased with what you got, not angry at unfair treatment=satisfied 是满意，不是因不公而怨恨|re · sent · ful|resent + ful, with one l|resent + ful，只有一个 l
      nostalgic|old photos of childhood;a song from the 1990s;a visit to an old school|nostalgic means happy and a little sad about the past; resentful means angry at unfair treatment|nostalgic 是怀旧；resentful 是怨恨|furious=furious means extremely angry, not a gentle feeling about the past=furious 是暴怒，不是对往事温和的感受;irritated=irritated means annoyed, not a warm, sad feeling about the past=irritated 是恼火，不是对往事温暖又伤感的感受|nos · tal · gic|-algic at the end, with a g that sounds like j|结尾是 -algic，g 读作 j
      envious|people who can sleep anywhere;a sister who won the wanted prize;a new car friends couldn't afford|envious means wanting what someone else has; resentful means angry at being treated unfairly|envious 是羡慕嫉妒；resentful 是因不公而怨恨|satisfied=satisfied means pleased with what you have, not wanting what someone else has=satisfied 是对自己拥有的满意，不是想要别人的东西;delighted=delighted means very pleased, not wishing you had what another person has=delighted 是很高兴，不是希望拥有别人的东西|en · vi · ous|envy changes its y to i before -ous|envy 的 y 变 i 再加 -ous
      desperate|a week without food;wanting coffee after none all day;a last try to save a failing business|desperate means having lost hope or needing something badly; satisfied means content|desperate 是绝望或极度渴望；satisfied 是满足|satisfied=satisfied means content with what you have, the opposite of needing something badly=satisfied 是满足，和极度需要正相反;delighted=delighted means very pleased, not having lost hope=delighted 是很高兴，不是绝望|des · per · ate|-per- in the middle, not -par-|中间是 -per-，不是 -par-
    `,
  },
});

const decisions = vocabularyTopic({
  id: "b2-words-decisions",
  title: t("Making Decisions", "做决定"),
  summary: t(
    "Deliberating and hesitating; hesitation and impulse; rational and irrational choices; intuition and intuitive judgments; preferences, alternatives and trade-offs.",
    "深思熟虑和犹豫；迟疑和冲动；理性的和非理性的选择；直觉和凭直觉的判断；偏好、替代选择和权衡取舍。",
  ),
  intro: t(
    "Tom had two job offers. He **deliberated** for a week, made a list of **alternatives**, and saw the **trade-off**: more money or more free time. In the end he trusted his **intuition**. These words help you talk about how people make choices.",
    "汤姆收到两份工作邀请。他 **deliberated**（反复考虑）了一周，列出各种 **alternatives**（选择），看清了其中的 **trade-off**（取舍）：钱多还是空闲多。最后他相信了自己的 **intuition**（直觉）。这些词帮你谈论人们如何做选择。",
  ),
  prerequisites: ["b1-words-thinking"],
  words: [
    word(
      "deliberate deliberates deliberated deliberating",
      "to think carefully about something for a long time before deciding",
      "仔细考虑；商议",
      "The jury {deliberated}, discussing the evidence carefully for two days, before reaching a verdict.|hesitated tempted | She is still {deliberating}, comparing every university carefully before she chooses.|hesitating tempting | The committee will {deliberate} on the proposal at a long meeting next week.",
      "hesitate tempt",
      "hesitate",
    ),
    word(
      "hesitate hesitates hesitated hesitating",
      "to pause before you do or say something, because you are not sure",
      "犹豫；迟疑",
      "If you have any questions, don't {hesitate} to ask. | She {hesitated} for a moment, unsure, before opening the door.|deliberated tempted | He {hesitates}, unsure what to say, whenever someone asks him a direct question.|deliberates tempts",
      "deliberate tempt",
      "deliberate",
    ),
    word(
      "hesitation",
      "pausing before you do something because you are not sure",
      "犹豫；迟疑",
      "She said yes without {hesitation}. | After a moment's {hesitation}, he took the money. | There was a long {hesitation} before anyone answered.",
      "impulse preference",
      "deliberate",
    ),
    word(
      "impulse impulses",
      "a sudden strong wish to do something without thinking",
      "冲动",
      "I bought the shoes on {impulse}; I didn't need them. | He felt a sudden {impulse} to laugh at the worst moment. | Children find it hard to control their {impulses}.|hesitations preferences",
      "hesitation preference",
    ),
    word(
      "rational",
      "based on clear thinking and reasons, not on feelings",
      "理性的；合理的",
      "There must be some {rational} explanation for the strange noise. | Try to stay calm and {rational} during an argument, and think clearly. | Buying a house you cannot afford is not {rational}: the numbers don't add up.",
      "irrational intuitive",
      "irrational",
    ),
    word(
      "irrational",
      "not based on clear thinking; not reasonable",
      "不理性的；不合理的",
      "Her fear of spiders is completely {irrational}: they can't hurt her. | It is {irrational} to drive to the shop at the end of the street. | When he is angry, his decisions are {irrational}.",
      "rational intuitive",
      "rational",
    ),
    word(
      "intuition",
      "the ability to know something from your feelings rather than from facts",
      "直觉",
      "My {intuition} told me that something was wrong. | She relied on {intuition}, a gut feeling, rather than on data. | Experienced doctors often have a strong {intuition} about patients.",
      "hesitation preference",
      "intuitive",
    ),
    word(
      "intuitive",
      "based on feelings rather than facts; easy to use without being taught",
      "直觉的；易于使用的",
      "The app is so {intuitive} that you don't need instructions. | Her sense of what customers want is {intuitive}: she just feels it. | His decisions are {intuitive}, based on gut feeling, and they are usually right.",
      "rational irrational",
      "intuition",
    ),
    word(
      "judgment judgments",
      "the ability to make good decisions; an opinion formed after thinking",
      "判断力；判断",
      "Use your {judgment} and do what you think is best. | Don't make {judgments} about people before you know them.|hesitations impulses | His {judgment} was affected by lack of sleep.",
      "hesitation impulse",
      "intuition",
    ),
    word(
      "preference preferences",
      "a greater liking for one thing than another",
      "偏好；偏爱",
      "Do you have a {preference} for a window seat or an aisle seat? | Customers' {preferences} have changed since the pandemic.|hesitations impulses | My {preference} is to travel by train.",
      "hesitation impulse",
      "alternative",
    ),
    word(
      "alternative alternatives",
      "another possible choice; different from the usual",
      "替代选择；可供选择的",
      "We had no {alternative} but to cancel the trip. | Solar power is a clean {alternative} to coal. | There are several {alternatives} to the plan.|hesitations preferences",
      "hesitation preference",
      "preference",
    ),
    word(
      "trade-off trade-offs",
      "a balance between two things that you cannot have at the same time",
      "权衡；取舍",
      "There is a {trade-off} between speed and quality. | Living in the city is a {trade-off}: more jobs but less space. | Every decision involves {trade-offs}.|hesitations preferences",
      "hesitation preference",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "To *deliberate* is to think carefully for a long time, while to *hesitate* is to pause for a moment because you are unsure. Look for words such as *carefully*, *for two days* or *for a moment* that show which one fits.",
        "*deliberate* 是长时间仔细考虑，*hesitate* 是因为没把握而停顿一下。找找句中的 *carefully*、*for two days* 或 *for a moment* 这类词，判断该用哪个。",
      ),
      meaning: t(
        "*Intuition* is knowing from a feeling, while *judgment* is the ability to decide well after thinking. Check whether the meaning is about a feeling or about thinking it through.",
        "*intuition* 是凭感觉知道，*judgment* 是经过思考做出好决定的能力。看释义说的是感觉，还是想清楚。",
      ),
      spell: t(
        "*Judgment* has no e after the g in American English; *trade-off* has a hyphen; *irrational* is ir + rational, so it has a double r.",
        "*judgment* 在美式拼法中 g 后面没有 e；*trade-off* 中间有连字符；*irrational* 是 ir + rational，所以双写 r。",
      ),
    },
    notes: `
      deliberate|a jury discussing evidence for two days;comparing every university carefully;a long meeting on a proposal|to deliberate is to think carefully for a long time; to hesitate is to pause for a moment because you are unsure|deliberate 是长时间仔细考虑；hesitate 是没把握而停顿|hesitate/hesitated/hesitating=hesitate means to pause for a moment because you are unsure, not to think carefully for a long time=hesitate 是没把握而短暂停顿，不是长时间仔细考虑;tempt/tempted/tempting=tempt means to make someone want something, not to think carefully before deciding=tempt 是引诱别人想要某物，不是决定前仔细考虑|de · lib · er · ate|de + liber + ate, with one l and one b|de + liber + ate，一个 l、一个 b
      hesitate|questions you should ask freely;a pause before opening a door;not knowing what to say to a direct question|to hesitate is to pause because you are unsure; to deliberate is to think carefully for a long time|hesitate 是犹豫停顿；deliberate 是长时间考虑|deliberate/deliberated/deliberates=deliberate means to think carefully for a long time, not to pause for a moment=deliberate 是长时间仔细考虑，不是短暂停顿;tempt/tempted/tempts=tempt means to make someone want something, not to pause because you are unsure=tempt 是引诱，不是犹豫停顿|hes · i · tate|hes + i + tate, with one s and one t in the middle|hes + i + tate，中间一个 s、一个 t
      hesitation|saying yes at once;a moment's pause before taking money;a long pause before an answer|hesitation is a pause because you are unsure; an impulse is a sudden wish to act at once|hesitation 是犹豫；impulse 是冲动|impulse=an impulse is a sudden wish to act at once, the opposite of a pause=impulse 是想立刻行动的冲动，和停顿正相反;preference=a preference is liking one thing more, not a pause before acting=preference 是更喜欢某样东西，不是行动前的停顿|hes · i · ta · tion|hesitate drops its e before -ion|hesitate 去掉 e 再加 -ion
      impulse|shoes bought without needing them;a sudden wish to laugh;wishes children find hard to control|an impulse is a sudden wish to act without thinking; a preference is a settled liking|impulse 是一时冲动；preference 是稳定的偏好|hesitation/hesitations=hesitation is a pause because you are unsure, the opposite of acting suddenly=hesitation 是犹豫停顿，和突然行动正相反;preference/preferences=a preference is a settled liking for one thing, not a sudden wish=preference 是稳定的偏好，不是突然的冲动|im · pulse|im + pulse|im + pulse
      rational|a reason for a strange noise;staying calm and thinking clearly;numbers that don't add up|rational means based on clear thinking; irrational means not based on clear thinking|rational 是理性的；irrational 是不理性的|irrational=irrational means not based on clear thinking, the opposite of the sense the sentence needs=irrational 是不理性的，和句子需要的意思正相反;intuitive=intuitive means based on feelings, not on clear thinking and reasons=intuitive 是凭感觉的，不是基于清晰思考和理由|ra · tion · al|ration + al, with -tion said "shun"|ration + al，-tion 读作 "shun"
      irrational|a fear of spiders that can't hurt;driving to a shop at the end of the street;decisions made in anger|irrational means not reasonable; rational means based on clear thinking|irrational 是不合理的；rational 是理性的|rational=rational means sensible and well reasoned, but the sentence shows something that makes no sense=rational 是合理的，而句子说的事并不合理;intuitive=intuitive means based on a feeling that is often right, not unreasonable=intuitive 是凭往往准确的感觉，不是不合理|ir · ra · tion · al|ir + rational, so a double r|ir + rational，所以双写 r
      intuition|a feeling that something was wrong;a gut feeling instead of data;doctors sensing something about patients|intuition is knowing from a feeling; judgment is deciding well after thinking|intuition 是直觉；judgment 是判断力|hesitation=hesitation is a pause because you are unsure, not a feeling that tells you something=hesitation 是犹豫，不是告诉你某事的感觉;preference=a preference is liking one thing more, not knowing something from a feeling=preference 是偏好，不是凭感觉知道|in · tu · i · tion|in + tuition|in + tuition
      intuitive|an app that needs no instructions;knowing what customers want by feeling it;gut decisions that are usually right|intuitive means based on feeling or easy to use; rational means based on reasons|intuitive 是凭直觉的；rational 是理性的|rational=rational means based on reasons and facts, not on a gut feeling or on being easy to use=rational 是基于理由和事实，不是凭感觉或易于使用;irrational=irrational means not reasonable, but these feelings and designs work well=irrational 是不合理的，而这里的感觉和设计都很好用|in · tu · i · tive|intuit + ive|intuit + ive
      judgment|doing what you think is best;opinions about people you don't know;decisions harmed by lack of sleep|judgment is the ability to decide well; intuition is knowing from a feeling|judgment 是判断力；intuition 是直觉|hesitation/hesitations=hesitation is a pause because you are unsure, not the ability to decide well=hesitation 是犹豫，不是做出好决定的能力;impulse/impulses=an impulse is a sudden wish without thinking, the opposite of an opinion formed after thinking=impulse 是不假思索的冲动，和思考后形成的看法正相反|judg · ment|no e after the g in American English|美式拼法 g 后面没有 e
      preference|choosing a window or an aisle seat;what customers like more now;liking the train best|a preference is liking one thing more than another; an alternative is another possible choice|preference 是偏好；alternative 是另一个选择|hesitation/hesitations=hesitation is a pause because you are unsure, not liking one thing more=hesitation 是犹豫，不是更喜欢某样东西;impulse/impulses=an impulse is a sudden wish, not a settled liking for one thing over another=impulse 是突然的冲动，不是稳定的偏好|pref · er · ence|prefer + ence, with one r before -ence|prefer + ence，-ence 前只有一个 r
      alternative|no other choice but to cancel;solar power instead of coal;other possible plans|an alternative is another possible choice; a preference is the one you like more|alternative 是另一个选择；preference 是更喜欢的那个|hesitation/hesitations=hesitation is a pause because you are unsure, not another possible choice=hesitation 是犹豫，不是另一个可能的选择;preference/preferences=a preference is the choice you like more, not another option you could take instead=preference 是更喜欢的选择，不是可替代的另一个选项|al · ter · na · tive|alternate + ive, dropping the e|alternate 去掉 e 再加 ive
      trade-off|speed against quality;more jobs but less space;what every decision involves|a trade-off is giving up one thing to get another; a preference is simply liking one thing more|trade-off 是此消彼长的取舍；preference 只是更喜欢|hesitation/hesitations=hesitation is a pause because you are unsure, not a balance between two things you cannot both have=hesitation 是犹豫，不是两者不可兼得的平衡;preference/preferences=a preference is liking one thing more, not giving up one thing to get another=preference 是偏好，不是为得到一样而放弃另一样|trade · off|trade + off, joined by a hyphen|trade + off，中间用连字符连接
    `,
  },
});

const behavior = vocabularyTopic({
  id: "b2-words-behavior",
  title: t("Habits and Behavior", "习惯与行为"),
  summary: t(
    "Misbehaving and conduct; tendencies and what people tend to do; compulsive habits; procrastinating and procrastination; willpower and self-control; temptation and tempting; reinforcing a habit.",
    "行为不端和品行；倾向和人们往往做的事；强迫性的习惯；拖延；意志力和自制力；诱惑和引诱；强化习惯。",
  ),
  intro: t(
    "Kai has a **tendency** to **procrastinate**. Every evening his phone **tempts** him, and he needs real **willpower** to put it away and open his books. These words help you talk about habits, good and bad, and how to change them.",
    "凯有 **procrastinate**（拖延）的 **tendency**（倾向）。每天晚上手机都在 **tempts**（引诱）他，他得靠真正的 **willpower**（意志力）才能把手机放下、翻开书本。这些词帮你谈论好习惯和坏习惯，以及如何改变它们。",
  ),
  prerequisites: ["b1-words-healthy-habits"],
  words: [
    word(
      "misbehave misbehaves misbehaved misbehaving",
      "to behave badly",
      "行为不端；调皮捣蛋",
      "Children often {misbehave}, shouting and breaking things, when they are tired. | The boys who {misbehaved} by throwing paper in class had to stay after school.|procrastinated tempted | If the dog {misbehaves} and chews your shoes, don't shout at it.|procrastinates tempts",
      "procrastinate tempt",
    ),
    word(
      "conduct",
      "the way a person behaves, especially in public or at work",
      "行为；品行",
      "The player was fined for bad {conduct} on the field. | Staff who break the code of {conduct} can lose their jobs. | The prize is for good {conduct}: it goes to students who are polite and helpful.",
      "tendency temptation",
      "behavior",
    ),
    word(
      "tendency tendencies",
      "a likelihood to behave or develop in a particular way",
      "倾向；趋势",
      "He has a {tendency} to talk too much when he's nervous. | There is a growing {tendency} for people to work from home. | She has a {tendency} to worry, so she usually expects the worst.",
      "temptation willpower",
      "tend",
    ),
    word(
      "tend tends tended tending",
      "to usually do or be something",
      "往往；倾向于",
      "People {tend} to eat more when they are stressed. | It {tends} to rain a lot here in spring.|tempts reinforces | Older drivers {tended} to have fewer accidents.|tempted reinforced",
      "tempt reinforce",
      "tendency",
    ),
    word(
      "compulsive",
      "unable to stop doing something, often something bad",
      "强迫性的；难以控制的",
      "He is a {compulsive} gambler who cannot stop, and he has lost everything. | Checking your phone every minute can become {compulsive}. | She is a {compulsive} liar; nothing she says is true.",
      "occasional compulsory",
    ),
    word(
      "procrastinate procrastinates procrastinated procrastinating",
      "to delay doing something you should do",
      "拖延；拖拉",
      "Stop {procrastinating}: start your essay now, not tomorrow!|misbehaving reinforcing | I always {procrastinate}, putting off a difficult task until the last minute. | He {procrastinated} for weeks and missed the deadline.|misbehaved reinforced",
      "misbehave reinforce",
      "procrastination",
    ),
    word(
      "procrastination",
      "delaying things that you should do",
      "拖延的习惯",
      "{Procrastination}, putting things off, is the enemy of good grades. | She wrote a book about {procrastination} and why we put things off. | Social media makes {procrastination} easier than ever.",
      "willpower temptation",
      "procrastinate",
    ),
    word(
      "willpower",
      "the ability to control your thoughts and actions to achieve something",
      "意志力",
      "It takes a lot of {willpower} to give up sugar. | She lacks the {willpower} to study every day. | My {willpower} disappears when I see chocolate.",
      "temptation procrastination",
      "self-control",
    ),
    word(
      "self-control",
      "the ability to control your feelings and behavior",
      "自制力",
      "He lost his {self-control} and shouted at the referee. | Children learn {self-control} as they grow up. | It takes {self-control} not to eat the whole cake.",
      "temptation procrastination",
      "willpower",
    ),
    word(
      "temptation temptations",
      "the wish to do something that you know you should not do",
      "诱惑",
      "I couldn't resist the {temptation} to eat another cookie. | Living next to a bakery is a constant {temptation}. | Teenagers face many {temptations}, such as smoking.|willpowers tendencies",
      "willpower tendency",
      "tempt",
    ),
    word(
      "tempt tempts tempted tempting",
      "to make someone want to do or have something, especially something they should not",
      "引诱；吸引",
      "The warm weather {tempted} us to go for a swim.|tended reinforced | I'm {tempted} to quit my job and travel.|tended reinforced | Shops put sweets near the checkout to {tempt} children.",
      "tend reinforce",
      "temptation",
    ),
    word(
      "reinforce reinforces reinforced reinforcing",
      "to make something stronger, such as a habit, an idea or a structure",
      "加强；强化",
      "Praise {reinforces} good behavior. | The walls were {reinforced} with steel.|tempted tended | Repeating new words {reinforces} them in your memory.",
      "tempts tends",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "To *tend* to do something is to usually do it, while to *tempt* someone is to make them want something they should not have. Ask whether the sentence describes what usually happens or what pulls someone towards it.",
        "*tend* to do 是“往往会做”，*tempt* 是让人想要不该要的东西。看句子说的是通常会发生什么，还是什么在吸引人。",
      ),
      meaning: t(
        "*Procrastination* is putting things off, while *temptation* is the wish to do something you should not. Check whether the meaning is about delay or about a wish.",
        "*procrastination* 是把事情往后拖，*temptation* 是想做不该做的事的念头。看释义说的是拖延，还是念头。",
      ),
      spell: t(
        "*Procrastinate* is pro · cras · ti · nate, with cr after pro; *willpower* is one word; *self-control* has a hyphen.",
        "*procrastinate* 是 pro · cras · ti · nate，pro 后面是 cr；*willpower* 连写成一个词；*self-control* 中间有连字符。",
      ),
    },
    notes: `
      misbehave|tired children shouting and breaking things;boys throwing paper in class;a dog chewing shoes|to misbehave is to behave badly; to procrastinate is to put off work|misbehave 是调皮捣蛋；procrastinate 是拖延|procrastinate/procrastinated/procrastinates=procrastinate means to put off work, not to shout, throw things or chew shoes=procrastinate 是拖延，不是吵闹、扔东西或咬鞋;tempt/tempted/tempts=tempt means to make someone want something, not to behave badly yourself=tempt 是引诱别人，不是自己调皮捣蛋|mis · be · have|mis + behave, with one s|mis + behave，只有一个 s
      conduct|a player fined on the field;rules staff must follow;students who are polite and helpful|conduct is the way you behave; a tendency is what you are likely to do|conduct 是品行；tendency 是倾向|tendency=a tendency is what you are likely to do, not behavior that is judged good or bad=tendency 是倾向，不是被评判好坏的行为;temptation=a temptation is a wish to do wrong, not the way you behave=temptation 是想做坏事的念头，不是行为表现|con · duct|stress on CON for the noun|名词重音在 CON
      tendency|talking too much when nervous;more people working from home;worrying and expecting the worst|a tendency is what you are likely to do; a temptation is a wish to do something wrong|tendency 是倾向；temptation 是诱惑|temptation=a temptation is a wish to do something you should not, not what usually happens=temptation 是想做不该做的事，不是通常会发生的事;willpower=willpower is the strength to control yourself, not what you are likely to do=willpower 是控制自己的力量，不是倾向|ten · den · cy|tend + ency|tend + ency
      tend|eating more when stressed;rain in spring;older drivers having fewer accidents|to tend to do something is to usually do it; to tempt is to make someone want something|tend 是往往；tempt 是引诱|tempt/tempts/tempted=tempt means to make someone want something, not to usually do or be something=tempt 是引诱，不是往往会做;reinforce/reinforces/reinforced=reinforce means to make something stronger, not to usually do something=reinforce 是加强，不是往往会做|tend|t-e-n-d, not *tempt*|t-e-n-d，不要写成 *tempt*
      compulsive|a gambler who cannot stop;checking a phone every minute;a liar whose every word is false|compulsive means unable to stop; compulsory means required by rules|compulsive 是控制不住的；compulsory 是规定必须的|occasional=occasional means happening only now and then, the opposite of being unable to stop=occasional 是偶尔的，和停不下来正相反;compulsory=compulsory means required by a rule, not unable to stop yourself=compulsory 是规定必须的，不是自己停不下来|com · pul · sive|-sive at the end, not -sory|结尾是 -sive，不是 -sory
      procrastinate|starting an essay now, not tomorrow;putting off a hard task;weeks of delay before a deadline|to procrastinate is to delay what you should do; to misbehave is to behave badly|procrastinate 是拖延；misbehave 是调皮|misbehave/misbehaving/misbehaved=misbehave means to behave badly, not to put off work=misbehave 是表现不好，不是拖延工作;reinforce/reinforcing/reinforced=reinforce means to make something stronger, not to delay it=reinforce 是加强，不是拖延|pro · cras · ti · nate|pro + crastinate, with cr after pro|pro + crastinate，pro 后面是 cr
      procrastination|putting things off and grades;a book on why we put things off;social media making delay easy|procrastination is putting things off; temptation is the wish to do something you should not|procrastination 是拖延；temptation 是诱惑|willpower=willpower is the strength to get things done, the opposite of putting them off=willpower 是把事做成的毅力，和拖延正相反;temptation=temptation is the wish to do something wrong, not putting off what you should do=temptation 是想做不该做的事，不是拖延该做的事|pro · cras · ti · na · tion|procrastinate drops its e before -ion|procrastinate 去掉 e 再加 -ion
      willpower|giving up sugar;studying every day;chocolate that breaks your control|willpower is the strength to make yourself do something; self-control is holding back feelings and actions|willpower 是意志力；self-control 是自制力|temptation=a temptation is the wish to do wrong, which willpower has to fight=temptation 是想做坏事的念头，正是意志力要对抗的;procrastination=procrastination is putting things off, the opposite of the strength to do them=procrastination 是拖延，和做成事的毅力正相反|will · pow · er|will + power, one word|will + power，连写成一个词
      self-control|shouting at a referee;what children learn as they grow;not eating the whole cake|self-control is controlling your feelings and behavior; temptation is the wish you must control|self-control 是自制力；temptation 是要克制的诱惑|temptation=a temptation is the wish to do wrong, not the ability to hold yourself back=temptation 是诱惑，不是克制自己的能力;procrastination=procrastination is putting things off, not controlling your feelings=procrastination 是拖延，不是控制情绪|self · con · trol|self + control, joined by a hyphen|self + control，中间用连字符
      temptation|another cookie you couldn't resist;living next to a bakery;smoking and other risks for teenagers|a temptation is a wish to do wrong; willpower is the strength to resist it|temptation 是诱惑；willpower 是抵抗诱惑的意志力|willpower/willpowers=willpower is the strength to resist, the opposite of the wish you resist=willpower 是抵抗的力量，和要抵抗的念头正相反;tendency/tendencies=a tendency is what you usually do, not a wish you try to resist=tendency 是平常的倾向，不是要抵抗的念头|temp · ta · tion|tempt + ation, keeping the p|tempt + ation，保留 p
      tempt|warm weather and a swim;quitting a job to travel;sweets near a checkout|to tempt is to make someone want something; to tend is to usually do something|tempt 是引诱；tend 是往往|tend/tended=tend means to usually do something, and cannot take a person as its object=tend 是往往会做，不能接人作宾语;reinforce/reinforced=reinforce means to make something stronger, not to make someone want something=reinforce 是加强，不是引诱|tempt|mp before the t, not *temt*|t 前面是 mp，不要写成 *temt*
      reinforce|praise and good behavior;steel in walls;repeating new words|to reinforce is to make something stronger; to tempt is to make someone want something|reinforce 是加强；tempt 是引诱|tempt/tempts/tempted=tempt means to make someone want something, not to make it stronger=tempt 是引诱，不是加强;tend/tends/tended=tend means to usually do something, not to make something stronger=tend 是往往，不是加强|re · in · force|re + in + force|re + in + force
    `,
  },
});

const memory = vocabularyTopic({
  id: "b2-words-memory-and-sleep",
  title: t("Memory and Sleep", "记忆与睡眠"),
  summary: t(
    "Recollections and nostalgia; being forgetful; reminiscing; nightmares and insomnia; drowsy, dozing and fatigue; exhausted, alert and refreshed.",
    "回忆和怀旧；健忘；追忆往事；噩梦和失眠；昏昏欲睡、打盹和疲劳；精疲力竭的、警觉的和精神焕发的。",
  ),
  intro: t(
    "Grandma suffers from **insomnia**, so she often **dozes** in her chair after lunch. When she wakes up **refreshed**, she likes to **reminisce** about her school days. These words help you talk about memory, sleep and tiredness.",
    "奶奶有 **insomnia**（失眠），所以午饭后常在椅子上 **dozes**（打盹）。醒来 **refreshed**（神清气爽）时，她喜欢 **reminisce**（回忆）上学的日子。这些词帮你谈论记忆、睡眠和疲劳。",
  ),
  prerequisites: ["b1-words-body-and-mind"],
  words: [
    word(
      "recollection recollections",
      "a memory of something; the ability to remember",
      "回忆；记忆",
      "I have no {recollection} of what happened after the accident. | Her {recollection} of the war, every detail of it, is still painful. | To the best of my {recollection}, the meeting was on a Tuesday.",
      "nostalgia fatigue",
      "nostalgia",
    ),
    word(
      "nostalgia",
      "a happy but slightly sad feeling when you think about the past",
      "怀旧之情",
      "The old songs filled him with {nostalgia} for his youth. | There is a lot of {nostalgia} for the 1980s. | She looked at the photos with {nostalgia}, missing those happy days.",
      "recollection insomnia",
      "recollection",
    ),
    word(
      "forgetful",
      "often forgetting things",
      "健忘的",
      "My grandfather has become {forgetful}; he often loses his keys. | I'm so {forgetful} that I write everything down. | {Forgetful} people should use reminders on their phones.",
      "alert drowsy",
    ),
    word(
      "reminisce reminisces reminisced reminiscing",
      "to talk or think about pleasant things from the past",
      "追忆；缅怀",
      "The old friends sat and {reminisced} about their school days.|dozed reminded | My parents love {reminiscing} about their first trip abroad.|dozing reminding | We {reminisce} about our holiday every time we look at the photos.",
      "doze remind",
      "recollection",
    ),
    word(
      "nightmare nightmares",
      "a frightening dream; a very bad experience",
      "噩梦",
      "I had a {nightmare} that I was falling. | The trip was a {nightmare}: our flight was canceled twice. | Children often have {nightmares} after watching scary films.|insomnias recollections",
      "insomnia recollection",
    ),
    word(
      "insomnia",
      "being unable to sleep",
      "失眠",
      "Stress often causes {insomnia}, so you lie awake all night. | She has suffered from {insomnia} for years and sleeps only four hours a night. | Coffee at night can lead to {insomnia}, keeping you awake until dawn.",
      "fatigue nostalgia",
      "fatigue",
    ),
    word(
      "drowsy",
      "tired and almost asleep",
      "昏昏欲睡的",
      "This medicine may make you {drowsy}, so don't drive. | I always feel {drowsy} after lunch. | The warm room made the students {drowsy}.",
      "alert refreshed",
      "exhausted",
    ),
    word(
      "doze dozes dozed dozing",
      "to sleep lightly for a short time",
      "打盹；小睡",
      "Grandpa {dozed} in his chair after dinner. | I must have {dozed} off during the film. | The cat was {dozing} in the sun.|reminiscing alerting",
      "reminisced alerted",
    ),
    word(
      "fatigue",
      "great tiredness",
      "疲劳；疲倦",
      "Doctors who work long hours suffer from {fatigue} and can hardly keep their eyes open. | Driver {fatigue} causes many accidents. | The runners showed signs of {fatigue} after twenty miles.",
      "insomnia nostalgia",
      "insomnia",
    ),
    word(
      "exhausted",
      "extremely tired",
      "精疲力竭的",
      "After the marathon, she was completely {exhausted}. | I'm too {exhausted} to cook tonight. | The {exhausted} children fell asleep in the car.",
      "refreshed alert",
      "drowsy",
    ),
    word(
      "alert",
      "awake and quick to notice things",
      "警觉的；机敏的",
      "Drivers must stay {alert} at all times. | Coffee helps me feel more {alert} in the morning. | The guard stayed {alert} all night and noticed the thief at once.",
      "drowsy exhausted",
    ),
    word(
      "refreshed",
      "feeling rested and full of energy again",
      "精神焕发的；恢复精力的",
      "I woke up feeling {refreshed} after a long sleep. | A cold shower left him {refreshed}. | She came back from vacation {refreshed} and ready to work.",
      "exhausted drowsy",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Insomnia* is being unable to sleep, while *fatigue* is great tiredness. Look for words such as *lie awake* or *can hardly keep their eyes open* that show which one fits.",
        "*insomnia* 是睡不着，*fatigue* 是极度疲劳。找找句中的 *lie awake* 或 *can hardly keep their eyes open* 这类词，判断该用哪个。",
      ),
      meaning: t(
        "A *recollection* is a memory of something, while *nostalgia* is the warm, sad feeling that memories bring. Check whether the meaning is about remembering or about a feeling.",
        "*recollection* 是对某事的记忆，*nostalgia* 是回忆带来的温暖又伤感的情绪。看释义说的是记得，还是情绪。",
      ),
      spell: t(
        "*Reminisce* ends in -sce, *fatigue* ends in a silent -ue, and *exhausted* has a silent h after the x.",
        "*reminisce* 以 -sce 结尾，*fatigue* 结尾的 -ue 不发音，*exhausted* 的 x 后面有一个不发音的 h。",
      ),
    },
    notes: `
      recollection|what happened after an accident;every detail of a war;the day of a meeting|a recollection is a memory of something; nostalgia is the feeling memories bring|recollection 是记忆；nostalgia 是怀旧之情|nostalgia=nostalgia is a warm, sad feeling about the past, not a memory of a fact or an event=nostalgia 是对往事温暖又伤感的情绪，不是对事实或事件的记忆;fatigue=fatigue is great tiredness, not a memory=fatigue 是极度疲劳，不是记忆|rec · ol · lec · tion|re + collection, with a double l|re + collection，双写 l
      nostalgia|old songs from his youth;longing for the 1980s;missing happy days in photos|nostalgia is a warm, sad feeling about the past; a recollection is a memory|nostalgia 是怀旧之情；recollection 是回忆|recollection=a recollection is a memory of a fact, not the warm, sad feeling it brings=recollection 是对事实的记忆，不是它带来的情绪;insomnia=insomnia is being unable to sleep, not a feeling about the past=insomnia 是失眠，不是对往事的感情|nos · tal · gia|-algia at the end, with a g that sounds like j|结尾是 -algia，g 读作 j
      forgetful|a grandfather who loses his keys;writing everything down;reminders on a phone|forgetful means often forgetting; alert means quick to notice|forgetful 是健忘；alert 是警觉|alert=alert means quick to notice things, the opposite of often forgetting=alert 是机敏警觉，和健忘正相反;drowsy=drowsy means almost asleep, not often forgetting things=drowsy 是昏昏欲睡，不是健忘|for · get · ful|forget + ful, with one l|forget + ful，只有一个 l
      reminisce|old friends and their school days;parents and their first trip abroad;holiday photos|to reminisce is to talk about happy past times; to remind is to make someone remember|reminisce 是追忆往事；remind 是提醒别人|doze/dozed/dozing=doze means to sleep lightly, not to talk about the past=doze 是打盹，不是谈论往事;remind/reminded/reminding=remind means to make someone else remember, and needs an object, as in *remind me*=remind 是让别人记起，要接宾语，如 *remind me*|rem · i · nisce|-sce at the end, with sc|结尾是 -sce，有 sc
      nightmare|a dream of falling;a trip with two canceled flights;scary films and children's dreams|a nightmare is a frightening dream; insomnia is being unable to sleep at all|nightmare 是噩梦；insomnia 是失眠|insomnia/insomnias=insomnia is being unable to sleep, not a frightening dream or a terrible experience=insomnia 是失眠，不是噩梦或糟糕的经历;recollection/recollections=a recollection is a memory of something real, not a frightening dream=recollection 是对真事的记忆，不是噩梦|night · mare|night + mare, with a silent gh|night + mare，gh 不发音
      insomnia|stress that keeps you awake all night;sleeping only four hours a night;coffee that keeps you up until dawn|insomnia is being unable to sleep; fatigue is great tiredness|insomnia 是失眠；fatigue 是疲劳|fatigue=fatigue is great tiredness, which makes you want to sleep rather than keeping you awake=fatigue 是极度疲劳，会让人想睡，而不是睡不着;nostalgia=nostalgia is a feeling about the past, not being unable to sleep=nostalgia 是怀旧之情，不是失眠|in · som · ni · a|in + somnia, with -ia at the end|in + somnia，以 -ia 结尾
      drowsy|medicine before driving;feeling sleepy after lunch;students in a warm room|drowsy means almost asleep; exhausted means extremely tired|drowsy 是昏昏欲睡；exhausted 是精疲力竭|alert=alert means awake and quick to notice, the opposite of almost asleep=alert 是清醒警觉，和昏昏欲睡正相反;refreshed=refreshed means full of energy again, the opposite of sleepy=refreshed 是精力恢复，和困倦正相反|drow · sy|ow as in *how*, then -sy|ow 读音同 *how*，再接 -sy
      doze|a grandpa asleep in his chair;falling asleep during a film;a cat in the sun|to doze is to sleep lightly; to reminisce is to talk about the past|doze 是打盹；reminisce 是追忆|reminisce/reminisced/reminiscing=reminisce means to talk about happy times in the past, not to sleep lightly=reminisce 是追忆往事，不是打盹;alert/alerted/alerting=alert as a verb means to warn someone, not to sleep lightly=alert 作动词是提醒警告，不是打盹|doze|the o-e spelling, with z, not *dose*|o-e 的拼法，用 z，不要写成 *dose*
      fatigue|doctors who can hardly keep their eyes open;tired drivers causing accidents;runners after twenty miles|fatigue is great tiredness; insomnia is being unable to sleep|fatigue 是疲劳；insomnia 是失眠|insomnia=insomnia is being unable to sleep, not tiredness that makes your eyes close=insomnia 是睡不着，不是困得睁不开眼;nostalgia=nostalgia is a feeling about the past, not tiredness=nostalgia 是怀旧之情，不是疲劳|fa · tigue|-gue at the end, with a silent u and e|结尾是 -gue，u 和 e 不发音
      exhausted|after a marathon;too tired to cook;children asleep in the car|exhausted means extremely tired; drowsy means almost asleep|exhausted 是精疲力竭；drowsy 是昏昏欲睡|refreshed=refreshed means full of energy again, the opposite of extremely tired=refreshed 是精力恢复，和精疲力竭正相反;alert=alert means awake and quick to notice, not extremely tired=alert 是清醒警觉，不是精疲力竭|ex · haust · ed|a silent h after the x|x 后面有一个不发音的 h
      alert|drivers who must notice everything;coffee in the morning;a guard who noticed a thief|alert means awake and quick to notice; drowsy means almost asleep|alert 是警觉；drowsy 是昏昏欲睡|drowsy=drowsy means almost asleep, the opposite of quick to notice=drowsy 是昏昏欲睡，和机敏警觉正相反;exhausted=exhausted means extremely tired, not awake and quick to notice=exhausted 是精疲力竭，不是清醒警觉|a · lert|a + lert, with er in the middle|a + lert，中间是 er
      refreshed|waking after a long sleep;a cold shower;coming back from vacation ready to work|refreshed means rested and full of energy; exhausted means extremely tired|refreshed 是精神焕发；exhausted 是精疲力竭|exhausted=exhausted means extremely tired, the opposite of rested and full of energy=exhausted 是精疲力竭，和精力充沛正相反;drowsy=drowsy means sleepy, the opposite of full of energy=drowsy 是困倦，和精力充沛正相反|re · freshed|re + fresh + ed|re + fresh + ed
    `,
  },
});

const bonds = vocabularyTopic({
  id: "b2-words-bonds",
  title: t("Bonds", "情感纽带"),
  summary: t(
    "Bonds, companionship and rapport; mutual respect; reconciling and reconciliation; betraying a friend and betrayal; loyalty and jealousy; dependable friends; estranged families.",
    "纽带、陪伴和融洽关系；相互尊重；和解；背叛朋友；忠诚和嫉妒；可靠的朋友；疏远的家人。",
  ),
  intro: t(
    "Jo and Mei had a close **bond** until Jo told Mei's secret. Mei felt it as a **betrayal**, and for a year they were **estranged**. Then a **mutual** friend helped them **reconcile**. These words help you talk about the ties between people and what breaks or mends them.",
    "乔和梅原本有很深的 **bond**（情谊），直到乔说出了梅的秘密。梅觉得这是 **betrayal**（背叛），两人 **estranged**（疏远）了一年。后来一位 **mutual**（共同的）朋友帮她们 **reconcile**（和好）。这些词帮你谈论人与人之间的纽带，以及什么会破坏它、什么能修复它。",
  ),
  prerequisites: ["b1-words-relationships"],
  words: [
    word(
      "bond bonds",
      "a close feeling that connects people",
      "纽带；联系",
      "There is a strong {bond} between the two sisters. | Sharing hard times can create lasting {bonds}.|betrayals jealousies | The {bond} between a mother and her baby begins early.",
      "betrayal jealousy",
      "rapport",
    ),
    word(
      "companionship",
      "the pleasant feeling of having friends or company",
      "陪伴；友谊",
      "Many elderly people keep a dog for {companionship}. | She missed the {companionship} of her colleagues after she retired. | Online games offer {companionship} to lonely teenagers.",
      "betrayal jealousy",
      "rapport",
    ),
    word(
      "rapport",
      "a friendly relationship in which people understand each other well",
      "融洽的关系",
      "The teacher has a great {rapport} with her students. | It takes time to build {rapport} with a new client. | Good doctors quickly establish {rapport} with patients.",
      "betrayal jealousy",
      "bond",
    ),
    word(
      "reconcile reconciles reconciled reconciling",
      "to become friendly with someone again after a disagreement; to find a way to make two different ideas agree",
      "和解；调和",
      "After ten years of silence, father and son were finally {reconciled} and hugged each other.|betrayed rejected | It is hard to {reconcile} work and family life so that both fit together. | The two leaders are trying to {reconcile} their differences and become friends again.",
      "betray reject",
      "reconciliation",
    ),
    word(
      "reconciliation",
      "becoming friendly again after an argument or a war",
      "和解",
      "The meeting led to a {reconciliation} between the two countries. | There is little hope of {reconciliation} after the divorce, as they no longer speak. | The president called for peace and {reconciliation}.",
      "betrayal jealousy",
      "reconcile",
    ),
    word(
      "mutual",
      "felt or done by two or more people towards each other; shared",
      "相互的；共同的",
      "Their friendship is based on {mutual} respect. | We met through a {mutual} friend. | I don't like him, and the feeling is {mutual}: he doesn't like me either.",
      "estranged dependable",
    ),
    word(
      "betray betrays betrayed betraying",
      "to harm someone who trusts you, for example by telling their secrets",
      "背叛；出卖",
      "He {betrayed} his best friend by telling her secret to everyone.|reconciled protected | I would never {betray} your trust. | She felt {betrayed} when her friend lied to her.|reconciled protected",
      "reconcile protect",
      "betrayal",
    ),
    word(
      "betrayal betrayals",
      "harming someone who trusts you",
      "背叛",
      "His {betrayal} hurt her more than anything else. | The film is the story of a spy's {betrayal} of his own country. | Politicians' broken promises feel like {betrayals} to voters.|loyalties rapports",
      "loyalty rapport",
      "betray",
    ),
    word(
      "loyalty",
      "being faithful to someone or something",
      "忠诚",
      "Dogs are famous for their {loyalty} to their owners. | The company rewards customer {loyalty} with discounts. | Her {loyalty} to her team never changed.",
      "jealousy betrayal",
    ),
    word(
      "jealousy",
      "an unhappy feeling because someone has something you want, or because you fear losing someone's love",
      "嫉妒",
      "His {jealousy} grew, and he got angry, when his girlfriend made new friends. | Sibling {jealousy} is common when a new baby arrives. | She couldn't hide her {jealousy} of her friend's success.",
      "loyalty companionship",
    ),
    word(
      "dependable",
      "able to be trusted to do what is needed",
      "可靠的",
      "She is a {dependable} friend who never lets you down. | We need a {dependable} car for the long journey. | He is not very {dependable}; he's often late.",
      "estranged mutual",
    ),
    word(
      "estranged",
      "no longer friendly with a family member or a partner",
      "疏远的；分居的",
      "She has been {estranged} from her father for years and they never speak. | His {estranged} wife lives in another city. | The brothers were {estranged} after an argument about money.",
      "mutual dependable",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Betrayal* breaks someone's trust, while *loyalty* keeps it. Look for words such as *hurt*, *lied* or *broken promises* that point to a betrayal, and *faithful* or *never changed* that point to loyalty.",
        "*betrayal* 是辜负别人的信任，*loyalty* 是守住信任。找找 *hurt*、*lied* 或 *broken promises* 这类指向背叛的词，以及 *never changed* 这类指向忠诚的词。",
      ),
      meaning: t(
        "*Rapport* is a relationship in which people understand each other well, often at work, while *companionship* is simply the pleasure of having company. Check whether the meaning is about understanding or about company.",
        "*rapport* 是彼此很了解的融洽关系，常用于工作中；*companionship* 只是有人陪伴的愉快。看释义说的是相互理解，还是陪伴。",
      ),
      spell: t(
        "*Rapport* ends in a silent t; *reconciliation* changes the e of *reconcile* to i; *jealousy* has ea after the j.",
        "*rapport* 结尾的 t 不发音；*reconciliation* 把 *reconcile* 的 e 变成 i；*jealousy* 的 j 后面是 ea。",
      ),
    },
    notes: `
      bond|two close sisters;hard times shared;a mother and her baby|a bond is a close feeling that connects people; betrayal breaks that connection|bond 是情感纽带；betrayal 是破坏纽带的背叛|betrayal/betrayals=betrayal is harming someone who trusts you, the opposite of a close connection=betrayal 是伤害信任你的人，和亲密联系正相反;jealousy/jealousies=jealousy is an unhappy feeling of wanting what others have, not a close feeling that connects people=jealousy 是嫉妒，不是连接人与人的亲密感情|bond|o as in *pond*|o 读音同 *pond*
      companionship|an elderly person's dog;colleagues missed after retiring;lonely teenagers playing online|companionship is the pleasure of having company; rapport is understanding each other well|companionship 是陪伴；rapport 是相互理解的融洽关系|betrayal=betrayal is harming someone who trusts you, not the pleasure of having company=betrayal 是背叛，不是有人陪伴的愉快;jealousy=jealousy is an unhappy feeling, not the pleasure of having company=jealousy 是嫉妒的不快，不是有人陪伴的愉快|com · pan · ion · ship|companion + ship|companion + ship
      rapport|a teacher and her students;a new client;doctors and patients|rapport is a relationship of understanding; companionship is simply having company|rapport 是融洽关系；companionship 是陪伴|betrayal=betrayal is harming someone who trusts you, not a friendly understanding=betrayal 是背叛，不是友好的相互理解;jealousy=jealousy is an unhappy feeling, not a friendly understanding=jealousy 是嫉妒，不是友好的相互理解|rap · port|a double p and a silent t at the end|双写 p，结尾 t 不发音
      reconcile|a father and son hugging after years of silence;fitting work and family together;leaders ending their differences|to reconcile is to become friends again or make things fit together; to betray is to break someone's trust|reconcile 是和解、调和；betray 是背叛|betray/betrayed=betray means to break someone's trust, the opposite of becoming friends again=betray 是背叛，和重归于好正相反;reject/rejected=reject means to refuse or push away, the opposite of bringing together=reject 是拒绝、排斥，和使和好正相反|rec · on · cile|-cile at the end, said "sile"|结尾是 -cile，读作 "sile"
      reconciliation|two countries meeting;a divorce with no hope;peace after conflict|reconciliation is becoming friendly again; betrayal is breaking trust|reconciliation 是和解；betrayal 是背叛|betrayal=betrayal is breaking someone's trust, the opposite of becoming friendly again=betrayal 是背叛，和和解正相反;jealousy=jealousy is an unhappy feeling of wanting, not becoming friendly again=jealousy 是嫉妒，不是重归于好|rec · on · cil · i · a · tion|the e of *reconcile* becomes i before -ation|*reconcile* 的 e 变成 i，再加 -ation
      mutual|respect on both sides;a friend you both know;dislike felt by both|mutual means shared by both; dependable means able to be trusted|mutual 是相互的；dependable 是可靠的|estranged=estranged means no longer friendly, not shared by both sides=estranged 是疏远的，不是双方共有的;dependable=dependable means able to be trusted, not felt by two people towards each other=dependable 是可靠的，不是彼此之间的|mu · tu · al|mu + tu + al, with -ual at the end|mu + tu + al，结尾是 -ual
      betray|a secret told to everyone;trust you would never break;a friend who lied|to betray is to harm someone who trusts you; to protect is to keep them safe|betray 是背叛；protect 是保护|reconcile/reconciled=reconcile means to become friends again, the opposite of breaking trust=reconcile 是和好，和背叛正相反;protect/protected=protect means to keep someone safe, the opposite of harming them=protect 是保护，和伤害正相反|be · tray|be + tray|be + tray
      betrayal|a hurt worse than anything else;a spy working against his own country;broken promises to voters|betrayal is harming someone who trusts you; loyalty is staying faithful|betrayal 是背叛；loyalty 是忠诚|loyalty/loyalties=loyalty is staying faithful, the opposite of harming someone who trusts you=loyalty 是忠诚，和背叛正相反;rapport/rapports=rapport is a friendly understanding, not harming someone=rapport 是融洽关系，不是伤害别人|be · tray · al|betray + al|betray + al
      loyalty|dogs and their owners;customers who keep buying;a player who never left her team|loyalty is staying faithful; jealousy is an unhappy feeling of wanting|loyalty 是忠诚；jealousy 是嫉妒|jealousy=jealousy is an unhappy feeling of wanting what others have, not staying faithful=jealousy 是嫉妒，不是忠诚;betrayal=betrayal is breaking trust, the opposite of staying faithful=betrayal 是背叛，和忠诚正相反|loy · al · ty|loyal + ty|loyal + ty
      jealousy|a boyfriend angry at new friends;children and a new baby;a friend's success|jealousy is an unhappy feeling of wanting or fearing loss; loyalty is staying faithful|jealousy 是嫉妒；loyalty 是忠诚|loyalty=loyalty is staying faithful, not an unhappy feeling that makes you angry=loyalty 是忠诚，不是让人生气的不快情绪;companionship=companionship is the pleasure of company, not an unhappy feeling=companionship 是陪伴的愉快，不是不快的情绪|jeal · ous · y|ea after the j, then -ousy|j 后面是 ea，再接 -ousy
      dependable|a friend who never lets you down;a car for a long journey;someone who is often late|dependable means able to be trusted; estranged means no longer friendly|dependable 是可靠的；estranged 是疏远的|estranged=estranged means no longer friendly with family, not able to be trusted=estranged 是与家人疏远，不是可靠;mutual=mutual means shared by two people, not able to be trusted=mutual 是相互的，不是可靠|de · pend · a · ble|depend + able, with -able|depend + able，以 -able 结尾
      estranged|a daughter who never speaks to her father;a wife living in another city;brothers after a money argument|estranged means no longer friendly with family; mutual means shared by both|estranged 是疏远的；mutual 是相互的|mutual=mutual means shared by two people, not no longer friendly=mutual 是相互的，不是不再友好;dependable=dependable means able to be trusted, not no longer friendly=dependable 是可靠的，不是疏远|es · tranged|e + strange + d|e + strange + d
    `,
  },
});

const motivation = vocabularyTopic({
  id: "b2-words-motivation",
  title: t("Motivation", "动力"),
  summary: t(
    "Intrinsic and extrinsic motivation; purposeful work, fulfillment and satisfaction; recognition; self-motivated learners; apathy and apathetic voters; complacent winners; inspiration and enthusiasm; struggling.",
    "内在的和外在的动力；有目标的工作、成就感和满足感；认可；自我激励的学习者；冷漠和冷漠的选民；自满的胜利者；灵感和热情；努力挣扎。",
  ),
  intro: t(
    "Some students study for **extrinsic** rewards such as prizes; others have **intrinsic** motivation and love learning for itself. When they finish a hard project, both feel real **satisfaction**, but only one group stays **self-motivated** afterwards. These words help you talk about what makes people try.",
    "有的学生为了奖品这类 **extrinsic**（外在的）回报而学习；有的则有 **intrinsic**（内在的）动力，单纯热爱学习。完成一项难做的作业时，两类学生都会感到真正的 **satisfaction**（满足），但之后只有一类能保持 **self-motivated**（自我激励）。这些词帮你谈论是什么让人努力。",
  ),
  prerequisites: ["b2-words-success"],
  words: [
    word(
      "intrinsic",
      "coming from inside something or someone; part of its basic nature",
      "内在的；固有的",
      "Children who read for pleasure have {intrinsic} motivation. | The painting has little {intrinsic} value, but it is important to her. | Curiosity is {intrinsic} to good scientists: it is part of who they are.",
      "extrinsic complacent",
      "extrinsic",
    ),
    word(
      "extrinsic",
      "coming from outside, such as money or praise",
      "外在的；外来的",
      "Money and grades are {extrinsic} rewards. | Some students only work for {extrinsic} reasons, such as prizes. | {Extrinsic} motivation often fades when the reward stops.",
      "intrinsic purposeful",
      "intrinsic",
    ),
    word(
      "purposeful",
      "having a clear aim; determined",
      "有目标的；果断的",
      "She walked with {purposeful} steps toward the stage. | Volunteers say their work feels {purposeful}. | We want students to lead {purposeful} lives.",
      "apathetic complacent",
    ),
    word(
      "fulfillment",
      "the feeling of being happy because you are doing something important",
      "成就感；满足",
      "She found {fulfillment} in teaching. | Money alone does not bring {fulfillment}, the feeling that your life matters. | Many people look for {fulfillment} outside work, in hobbies that make them feel their life matters.",
      "apathy recognition",
      "satisfaction",
    ),
    word(
      "satisfaction",
      "the pleasant feeling when you have achieved something or got what you wanted",
      "满足；满意",
      "There is great {satisfaction} in finishing a difficult job. | Customer {satisfaction} is our first priority. | She smiled with {satisfaction} at her finished painting.",
      "apathy complacency",
      "fulfillment",
    ),
    word(
      "recognition",
      "praise or respect for what someone has done; knowing who someone is",
      "认可；认出",
      "Nurses deserve more {recognition} for their hard work. | The artist won international {recognition}. | Face {recognition} software can identify people in crowds.",
      "apathy fulfillment",
    ),
    word(
      "self-motivated",
      "able to work hard without needing others to push you",
      "自我激励的；主动的",
      "Online learners need to be {self-motivated}. | We are looking for a {self-motivated} person who can work alone. | {Self-motivated} employees need little supervision.",
      "apathetic complacent",
      "purposeful",
    ),
    word(
      "apathy",
      "a lack of interest or energy",
      "冷漠；无兴趣",
      "Voter {apathy} led to very low turnout in the election. | Teachers struggle with student {apathy}. | There is a general {apathy} toward politics among young people.",
      "enthusiasm inspiration",
      "apathetic",
    ),
    word(
      "apathetic",
      "showing no interest or energy",
      "冷漠的；无动于衷的",
      "Many young people are {apathetic} about politics and never vote. | The {apathetic} audience barely clapped. | Don't be {apathetic}; your vote matters.",
      "purposeful self-motivated",
      "apathy",
    ),
    word(
      "complacent",
      "too satisfied with yourself, so you stop trying",
      "自满的；自鸣得意的",
      "After winning the cup, the team became {complacent} and lost every game. | We can't be {complacent} about safety just because nothing has gone wrong. | Successful companies must not grow {complacent}.",
      "purposeful self-motivated",
      "apathetic",
    ),
    word(
      "inspiration",
      "something that gives you new ideas or makes you want to do something",
      "灵感；鼓舞人心的人或事",
      "The sea was the {inspiration} for many of her paintings. | Young athletes see her as their {inspiration}. | Where do writers find {inspiration} for their stories?",
      "apathy satisfaction",
      "enthusiasm",
    ),
    word(
      "enthusiasm",
      "a strong feeling of interest and excitement",
      "热情；热忱",
      "He talked about the project with great {enthusiasm}. | The children's {enthusiasm} for science was wonderful to see. | Her {enthusiasm} for the job disappeared after a month.",
      "apathy recognition",
      "inspiration",
    ),
    word(
      "struggle struggles struggled struggling",
      "to try very hard to do something difficult",
      "努力；挣扎",
      "Many new students {struggle} with managing their time and often fall behind. | She {struggled} for years before she finally passed her driving test.|succeeded relaxed | He was {struggling} to stay motivated after losing his job.|succeeding relaxing",
      "succeed relax",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Intrinsic* motivation comes from inside you, such as reading for pleasure, while *extrinsic* motivation comes from outside, such as money or prizes. Look for the reward the sentence names.",
        "*intrinsic* 动力来自内心，比如为乐趣而读书；*extrinsic* 动力来自外部，比如金钱或奖品。看句子提到的是哪种回报。",
      ),
      meaning: t(
        "*Complacent* people are so pleased with themselves that they stop trying, while *apathetic* people have no interest to begin with. Check whether the meaning is about being too satisfied or about not caring.",
        "*complacent* 的人太满意自己，于是不再努力；*apathetic* 的人从一开始就没兴趣。看释义说的是过于满足，还是不在乎。",
      ),
      spell: t(
        "*Fulfillment* is ful + fill + ment in American English; *apathy* is a + pathy; *enthusiasm* has th after en.",
        "*fulfillment* 在美式拼法中是 ful + fill + ment；*apathy* 是 a + pathy；*enthusiasm* 的 en 后面是 th。",
      ),
    },
    notes: `
      intrinsic|reading for pleasure;value a painting has in itself;curiosity as part of a scientist|intrinsic means coming from inside; extrinsic means coming from outside|intrinsic 是内在的；extrinsic 是外在的|extrinsic=extrinsic means coming from outside, such as money, but here the motivation or value comes from inside=extrinsic 是来自外部的，比如钱，而这里的动力或价值来自内在;complacent=complacent means too satisfied to keep trying, not coming from inside=complacent 是自满不再努力，不是内在的|in · trin · sic|in + trinsic, with -sic at the end|in + trinsic，以 -sic 结尾
      extrinsic|money and grades as rewards;working for prizes;motivation that fades when rewards stop|extrinsic means coming from outside; intrinsic means coming from inside|extrinsic 是外在的；intrinsic 是内在的|intrinsic=intrinsic means coming from inside, but money, grades and prizes come from outside=intrinsic 是来自内心的，而金钱、分数和奖品来自外部;purposeful=purposeful means having a clear aim, not coming from outside=purposeful 是有明确目标的，不是来自外部的|ex · trin · sic|ex + trinsic|ex + trinsic
      purposeful|steps toward a stage;volunteer work;lives with a clear aim|purposeful means having a clear aim; apathetic means having no interest|purposeful 是有目标的；apathetic 是冷漠的|apathetic=apathetic means showing no interest or energy, the opposite of having a clear aim=apathetic 是没兴趣没劲头，和有明确目标正相反;complacent=complacent means too satisfied to keep trying, not determined=complacent 是自满不再努力，不是坚定果断|pur · pose · ful|purpose + ful, keeping the e|purpose + ful，保留 e
      fulfillment|a teacher's work;a feeling money alone cannot bring;hobbies that make life feel meaningful|fulfillment is the happiness of doing something important; satisfaction is the pleasure of getting what you wanted|fulfillment 是成就感；satisfaction 是满意|apathy=apathy is a lack of interest, the opposite of feeling that your life matters=apathy 是冷漠，和觉得人生有意义正相反;recognition=recognition is praise from other people, not a happy feeling inside you=recognition 是别人的认可，不是内心的满足感|ful · fill · ment|ful + fill + ment, a double l only in the middle|ful + fill + ment，只有中间双写 l
      satisfaction|finishing a difficult job;customers' happiness with a service;a finished painting|satisfaction is the pleasure of achieving something; fulfillment is the happiness of doing something important|satisfaction 是满足；fulfillment 是成就感|apathy=apathy is a lack of interest, not a pleasant feeling of achievement=apathy 是冷漠，不是有所成就的愉快;complacency=complacency is being too pleased with yourself to keep trying, not the pleasure of a job done=complacency 是自满懈怠，不是完成工作的愉快|sat · is · fac · tion|satis + faction|satis + faction
      recognition|praise nurses deserve;international fame for an artist;software that knows faces|recognition is praise from others, or knowing who someone is; fulfillment is a happy feeling inside you|recognition 是认可；fulfillment 是成就感|apathy=apathy is a lack of interest, not praise or respect=apathy 是冷漠，不是赞扬或尊重;fulfillment=fulfillment is a feeling inside you, not praise you win from others or a way to know faces=fulfillment 是内心感受，不是别人给的认可或识别人脸|rec · og · ni · tion|re + cognition|re + cognition
      self-motivated|learners studying online;a person who can work alone;employees who need little supervision|self-motivated means working hard without being pushed; complacent means too satisfied to try|self-motivated 是自我激励的；complacent 是自满的|apathetic=apathetic means showing no interest or energy, the opposite of working hard without being pushed=apathetic 是没兴趣没劲头，和主动努力正相反;complacent=complacent means too satisfied to keep trying, the opposite of pushing yourself=complacent 是自满懈怠，和自我督促正相反|self · mo · ti · vat · ed|self + motivated, joined by a hyphen|self + motivated，中间用连字符
      apathy|low turnout in an election;students with no interest;young people and politics|apathy is a lack of interest; enthusiasm is strong interest|apathy 是冷漠；enthusiasm 是热情|enthusiasm=enthusiasm is strong interest and excitement, the opposite of a lack of interest=enthusiasm 是热情，和冷漠正相反;inspiration=inspiration gives you ideas and makes you want to act, the opposite of a lack of energy=inspiration 给人想法和干劲，和缺乏活力正相反|ap · a · thy|a + pathy, with th|a + pathy，有 th
      apathetic|young people who never vote;an audience that barely clapped;voters told their vote matters|apathetic means showing no interest; complacent means too satisfied to keep trying|apathetic 是冷漠的；complacent 是自满的|purposeful=purposeful means having a clear aim, the opposite of showing no interest=purposeful 是有明确目标，和冷漠正相反;self-motivated=self-motivated means working hard without a push, the opposite of showing no energy=self-motivated 是主动努力，和没劲头正相反|ap · a · thet · ic|apathy + etic, the y gone|apathy 去掉 y 再加 etic
      complacent|a team that won a cup and then lost every game;safety ignored because nothing has gone wrong;successful companies that stop trying|complacent means too satisfied to keep trying; apathetic means not interested at all|complacent 是自满的；apathetic 是冷漠的|purposeful=purposeful means determined with a clear aim, the opposite of stopping trying=purposeful 是坚定有目标，和不再努力正相反;self-motivated=self-motivated means pushing yourself, the opposite of stopping trying=self-motivated 是自我督促，和不再努力正相反|com · pla · cent|-cent at the end, with a c that sounds like s|结尾是 -cent，c 读作 s
      inspiration|the sea behind many paintings;a woman young athletes look up to;ideas for writers' stories|inspiration gives new ideas; enthusiasm is strong interest|inspiration 是灵感；enthusiasm 是热情|apathy=apathy is a lack of interest, the opposite of something that gives you ideas=apathy 是冷漠，和带来想法的东西正相反;satisfaction=satisfaction is the pleasure after achieving something, not what gives you new ideas=satisfaction 是成功后的满足，不是带来新想法的东西|in · spi · ra · tion|inspire drops its e before -ation|inspire 去掉 e 再加 -ation
      enthusiasm|talking about a project;children and science;keenness for a job that disappeared|enthusiasm is strong interest and excitement; apathy is a lack of interest|enthusiasm 是热情；apathy 是冷漠|apathy=apathy is a lack of interest, the opposite of great excitement=apathy 是冷漠，和热情正相反;recognition=recognition is praise from others, not a feeling of interest and excitement=recognition 是别人的认可，不是兴趣和兴奋|en · thu · si · asm|th after en, and -asm at the end|en 后面是 th，以 -asm 结尾
      struggle|new students falling behind;years of trying to pass a driving test;staying motivated after losing a job|to struggle is to try very hard at something difficult; to succeed is to do it well|struggle 是费力挣扎；succeed 是成功|succeed/succeeded/succeeding=succeed means to do something well, not to find it hard=succeed 是成功，不是费力挣扎;relax/relaxed/relaxing=relax means to rest and stop trying, the opposite of trying very hard=relax 是放松休息，和拼命努力正相反|strug · gle|a double g before -le|-le 前双写 g
    `,
  },
});

const body = vocabularyTopic({
  id: "b2-words-body-language",
  title: t("Body Language", "肢体语言"),
  summary: t(
    "Articulating and conveying ideas; gestures, posture and facial expressions; verbal and nonverbal communication; tone; misinterpreting a message and asking for clarification; eloquent speakers; first impressions.",
    "清楚地表达和传达想法；手势、姿势和面部表情；言语和非言语交流；语气；误解信息和请求澄清；能言善辩的演讲者；第一印象。",
  ),
  intro: t(
    "Before Sam said a word in the interview, his **posture**, his **facial** expression and a nervous **gesture** had already made an **impression**. These words help you talk about how people communicate with and without words.",
    "面试时，萨姆还没开口，他的 **posture**（姿势）、**facial**（面部的）表情和一个紧张的 **gesture**（手势）就已经给人留下了 **impression**（印象）。这些词帮你谈论人们如何用语言和非语言的方式交流。",
  ),
  prerequisites: ["b1-words-communicating"],
  words: [
    word(
      "articulate articulates articulated articulating",
      "to express ideas or feelings clearly in words",
      "清楚地表达",
      "She {articulated} her ideas clearly in the meeting.|misinterpreted mumbled | Young children cannot always {articulate} their feelings in words. | He struggled to {articulate} why he was unhappy.",
      "misinterpret mumble",
      "convey",
    ),
    word(
      "convey conveys conveyed conveying",
      "to communicate an idea, a feeling or information",
      "传达；表达",
      "A smile can {convey} more than words. | The letter {conveyed} his deep sadness to everyone who read it.|misinterpreted interrupted | Her face {conveys} exactly what she thinks.|misinterprets interrupts",
      "misinterpret interrupt",
      "articulate",
    ),
    word(
      "gesture gestures",
      "a movement of the hands or head that shows a meaning; an action that shows a feeling",
      "手势；姿态",
      "He made a rude {gesture} at the driver with his hand. | Sending flowers was a kind {gesture}. | Italians are famous for the {gestures} they make with their hands.|postures clarifications",
      "posture clarification",
      "expression",
    ),
    word(
      "nonverbal",
      "without words",
      "非言语的",
      "Smiling is a form of {nonverbal} communication. | Babies use {nonverbal} signals to show they are hungry. | Most of our message is {nonverbal}: it comes from our face and body.",
      "verbal eloquent",
      "verbal",
    ),
    word(
      "verbal",
      "spoken, not written; using words",
      "言语的；口头的",
      "They had a {verbal} agreement but nothing in writing. | The test checks {verbal} skills such as vocabulary. | He suffered {verbal} abuse from other players.",
      "nonverbal facial",
      "nonverbal",
    ),
    word(
      "posture postures",
      "the way you hold your body when you sit or stand",
      "姿势；体态",
      "Bad {posture} can cause back pain. | Sit up straight and improve your {posture}. | Yoga can improve your {posture}, so you stand straighter.",
      "gesture clarification",
      "gesture",
    ),
    word(
      "facial",
      "connected with the face",
      "面部的；脸的",
      "Her {facial} expression showed that she was angry. | The software uses {facial} recognition. | He had serious {facial} injuries after the crash.",
      "verbal eloquent",
    ),
    word(
      "expression expressions",
      "the look on someone's face; a word or a phrase; showing a feeling",
      "表情；表达；词语",
      'From her {expression}, I could tell she was disappointed. | "Break a leg" is a common {expression} that means "good luck". | Painting is a way of {expression} for people who find words difficult.',
      "posture clarification",
      "gesture",
    ),
    word(
      "tone tones",
      "the quality of a voice that shows how someone feels",
      "语气；音调",
      "I didn't like the {tone} of his voice: he sounded angry. | Speak in a calm {tone}. | The singer has a warm, deep {tone} to her voice.",
      "posture gesture",
    ),
    word(
      "misinterpret misinterprets misinterpreted misinterpreting",
      "to understand something wrongly",
      "误解；曲解",
      "She {misinterpreted} his silence as anger.|articulated conveyed | It's easy to {misinterpret} a short text message and think the writer is angry. | Foreigners often {misinterpret} this gesture as rude.",
      "articulate convey",
    ),
    word(
      "clarification clarifications",
      "an explanation that makes something easier to understand",
      "澄清；说明",
      "Could I ask for some {clarification} on the second question? | The teacher gave a {clarification} of the rules. | We received several {clarifications} from the manager.|postures gestures",
      "posture gesture",
    ),
    word(
      "eloquent",
      "speaking or writing well and persuasively",
      "雄辩的；有说服力的",
      "Her speech was {eloquent} and moved the audience to tears. | He is very {eloquent} in English, though it is his second language. | The president was praised for her {eloquent} words.",
      "facial nonverbal",
      "articulate",
    ),
    word(
      "impression impressions",
      "an opinion or feeling about someone or something, often formed quickly",
      "印象",
      "She made a good {impression} at the interview. | First {impressions} are hard to change.|clarifications postures | I got the {impression} that he wasn't listening.",
      "clarification posture",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Verbal* communication uses words, while *nonverbal* communication uses the face and body. Look for words such as *in writing*, *vocabulary*, *smiling* or *signals* that show which one fits.",
        "*verbal* 交流用语言，*nonverbal* 交流用表情和肢体。找找 *in writing*、*vocabulary*、*smiling* 或 *signals* 这类词，判断该用哪个。",
      ),
      meaning: t(
        "A *gesture* is a movement of the hands or head, while *posture* is the way you hold your whole body. Check whether the meaning is about a movement or about how you sit and stand.",
        "*gesture* 是手或头的动作，*posture* 是整个身体的姿势。看释义说的是一个动作，还是坐立的样子。",
      ),
      spell: t(
        "*Eloquent* has qu after the o; *clarification* changes the y of *clarify* to i; *misinterpret* is mis + interpret, with one s.",
        "*eloquent* 的 o 后面是 qu；*clarification* 把 *clarify* 的 y 变成 i；*misinterpret* 是 mis + interpret，只有一个 s。",
      ),
    },
    notes: `
      articulate|ideas put clearly in a meeting;feelings put into words;reasons for being unhappy|to articulate is to express clearly in words; to mumble is to speak unclearly|articulate 是清楚表达；mumble 是含糊地说|misinterpret/misinterpreted=misinterpret means to understand wrongly, not to express your own ideas clearly=misinterpret 是理解错，不是清楚表达自己的想法;mumble/mumbled=mumble means to speak unclearly, the opposite of expressing clearly=mumble 是含糊不清地说，和清楚表达正相反|ar · tic · u · late|-ulate at the end, said "you-late"|结尾是 -ulate
      convey|a smile saying more than words;sadness in a letter;a face that shows what she thinks|to convey is to communicate an idea or feeling; to misinterpret is to understand it wrongly|convey 是传达；misinterpret 是误解|misinterpret/misinterpreted/misinterprets=misinterpret means to understand wrongly, not to communicate a feeling=misinterpret 是理解错，不是传达感情;interrupt/interrupted/interrupts=interrupt means to stop someone while they are speaking, not to communicate a feeling=interrupt 是打断别人说话，不是传达感情|con · vey|-vey at the end, with ey|结尾是 -vey，是 ey
      gesture|a rude movement of the hand at a driver;flowers sent to show kindness;hand movements Italians make|a gesture is a movement or an action that shows meaning; posture is how you hold your body|gesture 是手势或表示心意的举动；posture 是身体姿势|posture/postures=posture is how you hold your whole body, not a movement that shows a meaning=posture 是整个身体的姿势，不是表达意思的动作;clarification/clarifications=a clarification is an explanation in words, not a movement or a kind action=clarification 是语言上的解释，不是动作或善意的举动|ges · ture|g that sounds like j, and -ture at the end|g 读作 j，以 -ture 结尾
      nonverbal|smiling as communication;signals babies use;messages from the face and body|nonverbal means without words; verbal means using words|nonverbal 是非言语的；verbal 是言语的|verbal=verbal means using words, but smiles, signals and the body use none=verbal 是用语言的，而微笑、信号和肢体都不用语言;eloquent=eloquent means speaking well, which needs words=eloquent 是能言善辩，需要用语言|non · ver · bal|non + verbal, one word|non + verbal，连写成一个词
      verbal|an agreement with nothing in writing;skills such as vocabulary;abuse shouted by players|verbal means spoken or using words; nonverbal means without words|verbal 是口头的；nonverbal 是非言语的|nonverbal=nonverbal means without words, but agreements, vocabulary and shouting use words=nonverbal 是不用语言的，而协议、词汇和骂人都用语言;facial=facial means connected with the face, not spoken=facial 是面部的，不是口头的|ver · bal|verb + al|verb + al
      posture|back pain from sitting badly;sitting up straight;standing straighter after yoga|posture is how you hold your body; a gesture is a movement of the hands or head|posture 是姿势；gesture 是手势|gesture/gestures=a gesture is one movement of the hands or head, not the way you sit or stand=gesture 是手或头的一个动作，不是坐立的样子;clarification/clarifications=a clarification is an explanation, not a way of holding your body=clarification 是解释，不是身体的姿势|pos · ture|-ture at the end, not *pasture*|结尾是 -ture，不要写成 *pasture*
      facial|an angry look;software that knows faces;injuries to the face|facial means connected with the face; verbal means using words|facial 是面部的；verbal 是言语的|verbal=verbal means using words, not connected with the face=verbal 是用语言的，与脸无关;eloquent=eloquent means speaking well, not connected with the face=eloquent 是能言善辩，与脸无关|fa · cial|face + ial, with c sounding like sh|face + ial，c 读作 sh
      expression|a disappointed look;a phrase meaning "good luck";painting as a way to show feelings|an expression is a look, a phrase or a way of showing feelings; a gesture is a movement|expression 是表情、词语或表达；gesture 是动作|posture/postures=posture is how you hold your body, not a look on your face or a phrase=posture 是身体姿势，不是脸上的表情或词语;clarification/clarifications=a clarification is an explanation of something unclear, not a look or a phrase=clarification 是解释，不是表情或词语|ex · pres · sion|express + ion, with a double s|express + ion，双写 s
      tone|an angry-sounding voice;a calm way of speaking;a warm, deep voice|tone is the quality of a voice; a gesture is a movement|tone 是语气、音色；gesture 是手势|posture/postures=posture is how you hold your body, not the sound of your voice=posture 是身体姿势，不是声音;gesture/gestures=a gesture is a movement of the hands, not the sound of your voice=gesture 是手的动作，不是声音|tone|the o-e spelling, as in *phone*|o-e 的拼法，和 *phone* 一样
      misinterpret|silence taken as anger;a short text read as angry;a gesture taken as rude|to misinterpret is to understand wrongly; to convey is to communicate|misinterpret 是误解；convey 是传达|articulate/articulated=articulate means to express clearly, not to understand wrongly=articulate 是清楚表达，不是理解错;convey/conveyed=convey means to communicate something, not to understand it wrongly=convey 是传达，不是理解错|mis · in · ter · pret|mis + interpret, with one s|mis + interpret，只有一个 s
      clarification|a question that was unclear;the rules explained again;explanations from a manager|a clarification is an explanation that makes things clear; a gesture is a movement|clarification 是澄清说明；gesture 是手势|posture/postures=posture is how you hold your body, not an explanation=posture 是身体姿势，不是解释;gesture/gestures=a gesture is a movement of the hands, not an explanation in words=gesture 是手的动作，不是语言解释|clar · i · fi · ca · tion|clarify changes its y to i before -cation|clarify 的 y 变 i 再加 -cation
      eloquent|a speech that moved an audience;good English as a second language;a president's words|eloquent means speaking well and persuasively; facial means connected with the face|eloquent 是雄辩的；facial 是面部的|facial=facial means connected with the face, not speaking well=facial 是面部的，不是能言善辩;nonverbal=nonverbal means without words, but a speech or words need language=nonverbal 是不用语言的，而演讲和言辞都要用语言|el · o · quent|qu after the o, and -ent at the end|o 后面是 qu，以 -ent 结尾
      impression|a good start at an interview;opinions formed at first;a feeling that he wasn't listening|an impression is an opinion formed quickly; a clarification is an explanation|impression 是印象；clarification 是澄清|clarification/clarifications=a clarification is an explanation, not an opinion you form about someone=clarification 是解释，不是对人的看法;posture/postures=posture is how you hold your body, not an opinion you form=posture 是身体姿势，不是形成的看法|im · pres · sion|impress + ion, with a double s|impress + ion，双写 s
    `,
  },
});

const wellbeing = vocabularyTopic({
  id: "b2-words-wellbeing",
  title: t("Wellbeing", "身心健康"),
  summary: t(
    "Mindfulness and meditating; relaxation; therapeutic and holistic approaches; balance and harmony; tranquil places and soothing music; rejuvenating; self-care and gratitude.",
    "正念和冥想；放松；有疗效的和整体的方法；平衡与和谐；宁静的地方和舒缓的音乐；恢复活力；自我关爱和感恩。",
  ),
  intro: t(
    "Every morning Lena **meditates** by a **tranquil** lake, listens to **soothing** music, and writes down three things she feels **gratitude** for. These words help you talk about looking after your mind and body.",
    "每天早上莉娜都在一片 **tranquil**（宁静的）湖边 **meditates**（冥想），听 **soothing**（舒缓的）音乐，再写下三件让她心怀 **gratitude**（感激）的事。这些词帮你谈论如何照顾自己的身心。",
  ),
  prerequisites: ["b2-words-mental-health"],
  words: [
    word(
      "mindfulness",
      "paying full attention to the present moment, often as a way to reduce stress",
      "正念",
      "{Mindfulness} means noticing your breathing and your thoughts without judging them. | Some schools teach {mindfulness} to help pupils focus. | She practices {mindfulness} for ten minutes every morning.",
      "gratitude harmony",
      "meditate",
    ),
    word(
      "meditate meditates meditated meditating",
      "to sit quietly and focus your mind, often to relax",
      "冥想",
      "He {meditates} for twenty minutes before work, sitting quietly.|rejuvenates balances | Monks {meditate} for hours in silence. | She was {meditating} when the phone rang.|rejuvenating balancing",
      "rejuvenate balance",
      "mindfulness",
    ),
    word(
      "relaxation",
      "the state of being calm and free from worry",
      "放松",
      "Yoga is good for {relaxation}. | The spa offers massage and {relaxation}. | Reading is my favorite form of {relaxation}.",
      "gratitude harmony",
    ),
    word(
      "therapeutic",
      "helping to cure an illness or to make you feel better",
      "有疗效的；有益身心的",
      "After her illness, gardening was {therapeutic}: it helped her feel better. | The doctor recommended {therapeutic} exercises for her back. | Talking about problems has a {therapeutic} effect.",
      "holistic tranquil",
      "soothing",
    ),
    word(
      "holistic",
      "treating the whole person or the whole system, not just one part",
      "整体的；全面的",
      "The clinic takes a {holistic} approach, treating mind and body together. | We need a {holistic} view of education, not just exam results. | {Holistic} medicine looks at diet, sleep and stress.",
      "soothing tranquil",
    ),
    word(
      "balance",
      "a state in which different things have the right amounts; the ability to stay upright",
      "平衡",
      "It's hard to find a good {balance} between work and family. | She lost her {balance} and fell off the bike. | The government must keep a {balance} between freedom and safety.",
      "gratitude relaxation",
      "harmony",
    ),
    word(
      "harmony",
      "a peaceful state in which people agree or things fit together; pleasant sounds sung together",
      "和谐；和声",
      "People of different religions live in {harmony} in the village. | The choir sang in beautiful {harmony}. | The band is known for singing in close {harmony}.",
      "gratitude mindfulness",
      "balance",
    ),
    word(
      "tranquil",
      "calm and peaceful",
      "宁静的；平静的",
      "The hotel is in a {tranquil} valley far from the city. | The lake was {tranquil} in the early morning. | She spoke in a {tranquil} voice.",
      "holistic therapeutic",
      "soothing",
    ),
    word(
      "soothing",
      "making you feel calm or less painful",
      "舒缓的；抚慰的",
      "The mother sang a {soothing} song to her baby. | This cream is {soothing} on sunburn. | The gentle sound of rain is {soothing} and helps me sleep.",
      "holistic stressful",
      "tranquil",
    ),
    word(
      "rejuvenate rejuvenates rejuvenated rejuvenating",
      "to make someone feel or look young and full of energy again; to make a place lively again",
      "使恢复活力；使年轻",
      "A week by the sea {rejuvenated} me.|meditated balanced | The new park has {rejuvenated} the old neighborhood.|meditated balanced | Sleep {rejuvenates} the body and the mind.|meditates balances",
      "meditate balance",
    ),
    word(
      "self-care",
      "the things you do to look after your own health and happiness",
      "自我关爱；自我照顾",
      "Getting enough sleep is an important part of {self-care}. | Nurses need {self-care} too, because their work is stressful. | She sees a long bath as a form of {self-care}.",
      "gratitude harmony",
    ),
    word(
      "gratitude",
      "the feeling of being thankful",
      "感激；感恩",
      "She wrote a letter to express her {gratitude} to the nurses. | Writing down three good things each day builds {gratitude}. | I'd like to show my {gratitude} for your help.",
      "harmony relaxation",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Tranquil* describes a calm place or voice, while *soothing* describes something that makes you calm or eases pain, such as a song or a cream. Ask whether the gap describes how something is or what it does to you.",
        "*tranquil* 形容平静的地方或声音，*soothing* 形容让你平静或减轻疼痛的东西，比如歌声或药膏。看空格说的是事物本身怎样，还是它对你起什么作用。",
      ),
      meaning: t(
        "*Holistic* means treating the whole person, while *therapeutic* means helping to cure or making you feel better. Check whether the meaning is about the whole or about healing.",
        "*holistic* 是从整体看待一个人，*therapeutic* 是有助于治愈或让人好受些。看释义说的是整体，还是疗愈。",
      ),
      spell: t(
        "*Therapeutic* has eu in the middle: ther · a · peu · tic; *rejuvenate* has a j; *tranquil* ends in -quil with qu.",
        "*therapeutic* 中间是 eu：ther · a · peu · tic；*rejuvenate* 里有 j；*tranquil* 以 -quil 结尾，有 qu。",
      ),
    },
    notes: `
      mindfulness|noticing your breathing and thoughts;schools helping pupils focus;ten minutes every morning|mindfulness is paying full attention to the present; gratitude is feeling thankful|mindfulness 是正念；gratitude 是感恩|gratitude=gratitude is feeling thankful, not paying attention to your breathing and the present=gratitude 是感激，不是专注于呼吸和当下;harmony=harmony is a peaceful state between people or sounds, not a practice of paying attention=harmony 是人或声音之间的和谐，不是专注当下的练习|mind · ful · ness|mind + ful + ness, one l and a double s|mind + ful + ness，一个 l，双写 s
      meditate|twenty quiet minutes before work;monks in silence;a phone ringing during quiet focus|to meditate is to sit quietly and focus your mind; to rejuvenate is to make someone feel young again|meditate 是冥想；rejuvenate 是恢复活力|rejuvenate/rejuvenates/rejuvenating=rejuvenate means to make someone full of energy again, not to sit quietly and focus=rejuvenate 是使人恢复活力，不是静坐专注;balance/balances/balancing=balance means to keep things steady or equal, not to sit quietly and focus your mind=balance 是保持平衡，不是静坐专注|med · i · tate|medi + tate, not *medicate*|medi + tate，不要写成 *medicate*
      relaxation|yoga;massage at a spa;reading in free time|relaxation is being calm and free from worry; gratitude is feeling thankful|relaxation 是放松；gratitude 是感恩|gratitude=gratitude is feeling thankful, not being calm and free from worry=gratitude 是感激，不是放松;harmony=harmony is a peaceful state between people or sounds, not resting yourself=harmony 是人或声音之间的和谐，不是自己休息放松|re · lax · a · tion|relax + ation|relax + ation
      therapeutic|gardening after an illness;exercises for a bad back;talking about problems|therapeutic means helping you heal or feel better; holistic means treating the whole person|therapeutic 是有疗效的；holistic 是整体的|holistic=holistic means treating the whole person, not helping one problem get better=holistic 是整体看待，不是帮某个问题好转;tranquil=tranquil means calm and peaceful, not helping to cure an illness=tranquil 是宁静的，不是有助治愈|ther · a · peu · tic|eu in the middle, said "you"|中间是 eu，读作 "you"
      holistic|treating mind and body together;education beyond exam results;diet, sleep and stress together|holistic means treating the whole; soothing means making you calm|holistic 是整体的；soothing 是舒缓的|soothing=soothing means making you feel calm, not looking at the whole person=soothing 是让人平静，不是从整体看待;tranquil=tranquil means calm and peaceful, not looking at every part together=tranquil 是宁静的，不是把各部分放在一起看|ho · lis · tic|h at the start, from *whole*, but no w|开头是 h，来自 *whole*，但没有 w
      balance|work and family in the right amounts;falling off a bike;freedom and safety kept equal|balance is the right amount of each thing, or staying upright; harmony is things fitting together peacefully|balance 是平衡；harmony 是和谐|gratitude=gratitude is feeling thankful, not the right amount of each thing or staying upright=gratitude 是感激，不是各方比例合适或站稳;relaxation=relaxation is being calm, not keeping things in the right amounts=relaxation 是放松，不是保持比例合适|bal · ance|-ance at the end, with one l|结尾是 -ance，一个 l
      harmony|people of different religions living in peace;a choir singing together;close singing in a band|harmony is a peaceful state or sounds sung together; balance is the right amount of each thing|harmony 是和谐、和声；balance 是平衡|gratitude=gratitude is feeling thankful, not living peacefully together or singing together=gratitude 是感激，不是和睦相处或合唱;mindfulness=mindfulness is attention to the present moment, not peace between people or sounds=mindfulness 是专注当下，不是人或声音之间的和谐|har · mo · ny|harm + o + ny|harm + o + ny
      tranquil|a valley far from the city;a lake early in the morning;a calm voice|tranquil means calm and peaceful; soothing means making you calm|tranquil 是宁静的；soothing 是使人平静的|holistic=holistic means treating the whole person, not calm and peaceful=holistic 是整体的，不是宁静的;therapeutic=therapeutic means helping to cure, not describing a calm place or voice=therapeutic 是有疗效的，不是形容宁静的地方或声音|tran · quil|qu after the n, and -il at the end|n 后面是 qu，以 -il 结尾
      soothing|a song for a baby;cream for sunburn;rain that helps you sleep|soothing means making you calm or less in pain; tranquil means calm itself|soothing 是舒缓的；tranquil 是宁静的|holistic=holistic means treating the whole person, not making you calm or less in pain=holistic 是整体的，不是让人平静或减轻疼痛;stressful=stressful means causing worry, the opposite of making you calm=stressful 是让人紧张，和使人平静正相反|sooth · ing|soothe drops its e before -ing|soothe 去掉 e 再加 -ing
      rejuvenate|a week by the sea;a new park in an old neighborhood;sleep for body and mind|to rejuvenate is to make someone or something full of energy again; to meditate is to sit and focus|rejuvenate 是恢复活力；meditate 是冥想|meditate/meditated/meditates=meditate means to sit quietly and focus your mind, and does not take an object such as *me* or *the body*=meditate 是静坐专注，不能接 *me* 或 *the body* 这样的宾语;balance/balanced/balances=balance means to keep things steady or equal, not to make them full of energy again=balance 是使平衡，不是使恢复活力|re · ju · ve · nate|re + juven + ate, with a j|re + juven + ate，有 j
      self-care|enough sleep;nurses with stressful work;a long bath|self-care is looking after your own health; gratitude is feeling thankful|self-care 是自我关爱；gratitude 是感恩|gratitude=gratitude is feeling thankful, not things you do to look after yourself=gratitude 是感激，不是照顾自己的事;harmony=harmony is a peaceful state between people or sounds, not looking after yourself=harmony 是和谐，不是照顾自己|self · care|self + care, joined by a hyphen|self + care，中间用连字符
      gratitude|a letter to the nurses;three good things written each day;thanks for help|gratitude is feeling thankful; harmony is a peaceful state|gratitude 是感恩；harmony 是和谐|harmony=harmony is a peaceful state between people or sounds, not feeling thankful=harmony 是和谐，不是感激;relaxation=relaxation is being calm, not feeling thankful to someone=relaxation 是放松，不是对别人心怀感激|grat · i · tude|grati + tude, not *gratuity*|grati + tude，不要写成 *gratuity*
    `,
  },
});

const types = vocabularyTopic({
  id: "b2-words-personality-types",
  title: t("Personality Types", "性格类型"),
  summary: t(
    "Conscientious, agreeable and neurotic; reserved and spontaneous; meticulous perfectionists; optimists and pessimists; introverts and extroverts; sensible people.",
    "尽责的、随和的和神经质的；内敛的和随性的；一丝不苟的完美主义者；乐观主义者和悲观主义者；内向的人和外向的人；明智的人。",
  ),
  intro: t(
    "In our flat, Ben is an **extrovert** who fills the kitchen with friends, Lily is an **introvert** who reads alone, and Max is a **perfectionist** who cleans the oven twice. These words help you describe what kind of person someone is.",
    "我们合租的公寓里，本是个 **extrovert**（外向的人），总把朋友招进厨房；莉莉是个 **introvert**（内向的人），喜欢独自看书；马克斯是个 **perfectionist**（完美主义者），烤箱要擦两遍。这些词帮你描述一个人是什么样的性格。",
  ),
  prerequisites: ["b2-words-personality-3"],
  words: [
    word(
      "conscientious",
      "careful to do your work well and thoroughly",
      "认真的；尽责的",
      "She is a {conscientious} student who always does her homework. | {Conscientious} workers check their work twice. | He was {conscientious} about paying his bills on time.",
      "spontaneous neurotic",
      "meticulous",
    ),
    word(
      "agreeable",
      "pleasant and friendly; willing to agree",
      "随和的；令人愉快的",
      "He is friendly and {agreeable}, and gets on with everyone. | We had a very {agreeable} evening with friends. | Are you {agreeable} to the plan?",
      "neurotic reserved",
    ),
    word(
      "neurotic",
      "worrying too much about things in a way that is not reasonable",
      "神经质的；过分焦虑的",
      "He is so {neurotic} about germs that he won't shake hands. | My {neurotic} cat hides whenever the doorbell rings. | Stop being so {neurotic}; the plane is perfectly safe.",
      "agreeable sensible",
    ),
    word(
      "reserved",
      "not showing your feelings or opinions; kept for a particular person",
      "内敛的；预订的",
      "She is quite {reserved} and rarely talks about herself. | This table is {reserved} for the Lee family. | He seems {reserved} at first, but he's very funny when you know him.",
      "spontaneous agreeable",
      "introvert",
    ),
    word(
      "spontaneous",
      "done without planning; doing things without planning them",
      "自发的；随性的",
      "We took a {spontaneous} trip to the beach. | The audience broke into {spontaneous} applause. | She is very {spontaneous} and never makes plans.",
      "meticulous conscientious",
    ),
    word(
      "meticulous",
      "paying great attention to every detail",
      "一丝不苟的；极仔细的",
      "He keeps {meticulous} records of everything he spends. | The painting shows {meticulous} attention to detail. | She is {meticulous} about cleaning the kitchen, wiping every corner.",
      "spontaneous careless",
      "conscientious",
    ),
    word(
      "perfectionist perfectionists",
      "a person who wants everything to be perfect",
      "完美主义者",
      "As a {perfectionist}, she rewrote the essay five times. | {Perfectionists} find it hard to finish things.|Pessimists Extroverts | He is a {perfectionist} who is never happy with his work.",
      "pessimist extrovert",
    ),
    word(
      "optimist optimists",
      "a person who expects good things to happen",
      "乐观主义者",
      "She is a real {optimist} who always sees the good side. | {Optimists} tend to live longer.|Pessimists Introverts | Even the {optimists} admit the plan might fail.|pessimists introverts",
      "pessimist introvert",
    ),
    word(
      "pessimist pessimists",
      "a person who expects bad things to happen",
      "悲观主义者",
      "Don't be such a {pessimist}; things will get better. | {Pessimists} always expect the worst.|Optimists Extroverts | As a {pessimist}, he was sure the plane would be late.",
      "optimist extrovert",
    ),
    word(
      "introvert introverts",
      "a quiet person who enjoys being alone",
      "内向的人",
      "As an {introvert}, she needs time alone after a party. | {Introverts} often prefer one close friend to a big group.|Extroverts Optimists | He's an {introvert}, so he finds meetings tiring.",
      "extrovert optimist",
      "reserved",
    ),
    word(
      "extrovert extroverts",
      "a lively person who enjoys being with other people",
      "外向的人",
      "{Extroverts} like him love big parties. | {Extroverts} get energy from being with others. | She's the {extrovert} of the family who talks to everyone.|introvert pessimist",
      "introverts pessimists",
    ),
    word(
      "sensible",
      "having good judgment; practical",
      "明智的；合理的",
      "It would be {sensible} to take an umbrella. | She gave me some very {sensible} advice. | Wear {sensible} shoes for the long walk.",
      "neurotic spontaneous",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "An *introvert* gets energy from time alone, while an *extrovert* gets energy from being with people. Look for words such as *alone*, *one close friend* or *big parties* that show which one fits.",
        "*introvert* 靠独处恢复精力，*extrovert* 靠和人在一起获得精力。找找 *alone*、*one close friend* 或 *big parties* 这类词，判断该用哪个。",
      ),
      meaning: t(
        "*Conscientious* means careful to do your duty well, while *meticulous* means paying attention to every small detail. Check whether the meaning is about duty or about detail.",
        "*conscientious* 是尽心尽责把事做好，*meticulous* 是注意每一个小细节。看释义说的是责任，还是细节。",
      ),
      spell: t(
        "*Conscientious* is con · sci · en · tious, with sci and -tious; *spontaneous* ends in -eous; *extrovert* starts with extro-, not extra-.",
        "*conscientious* 是 con · sci · en · tious，有 sci 和 -tious；*spontaneous* 以 -eous 结尾；*extrovert* 以 extro- 开头，不是 extra-。",
      ),
    },
    notes: `
      conscientious|a student who always does her homework;workers who check twice;bills paid on time|conscientious means careful to do your duty well; meticulous means attentive to every detail|conscientious 是尽责的；meticulous 是一丝不苟的|spontaneous=spontaneous means acting without planning, not carefully doing your duty=spontaneous 是随性而为，不是认真尽责;neurotic=neurotic means worrying too much without reason, not careful and reliable=neurotic 是无端过分焦虑，不是认真可靠|con · sci · en · tious|sci in the middle and -tious at the end|中间是 sci，以 -tious 结尾
      agreeable|a man who gets on with everyone;a pleasant evening;saying yes to a plan|agreeable means pleasant or willing to agree; reserved means not showing your feelings|agreeable 是随和的；reserved 是内敛的|neurotic=neurotic means worrying too much, not pleasant and friendly=neurotic 是过分焦虑，不是随和友好;reserved=reserved means keeping your feelings to yourself, not friendly or willing to agree=reserved 是不外露情感，不是友好或愿意同意|a · gree · a · ble|agree + able, keeping both e's|agree + able，保留两个 e
      neurotic|a man afraid of germs;a cat that hides from the doorbell;fear of a safe plane|neurotic means worrying too much for no good reason; sensible means practical|neurotic 是神经质的；sensible 是明智的|agreeable=agreeable means pleasant and friendly, not worrying too much=agreeable 是随和友好，不是过分焦虑;sensible=sensible means practical and reasonable, the opposite of worry without reason=sensible 是理智务实，和无端焦虑正相反|neu · rot · ic|eu after the n|n 后面是 eu
      reserved|someone who rarely talks about herself;a table kept for a family;a man who seems quiet at first|reserved means not showing your feelings, or kept for someone; agreeable means friendly|reserved 是内敛的或预订的；agreeable 是随和的|spontaneous=spontaneous means doing things without planning, not keeping your feelings in or keeping a table for someone=spontaneous 是随性的，不是不外露情感或预留;agreeable=agreeable means pleasant and friendly, not quiet about yourself or kept for someone=agreeable 是随和友好，不是内敛或预留|re · served|re + serve + d|re + serve + d
      spontaneous|a trip to the beach with no plan;applause no one asked for;a woman who never makes plans|spontaneous means done without planning; meticulous means careful about every detail|spontaneous 是随性的；meticulous 是一丝不苟的|meticulous=meticulous means planning every detail, the opposite of acting without a plan=meticulous 是注重每个细节，和不做计划正相反;conscientious=conscientious means careful to do your duty, not acting without a plan=conscientious 是认真尽责，不是随性而为|spon · ta · ne · ous|-eous at the end|以 -eous 结尾
      meticulous|records of every cent spent;great care with detail in a painting;every corner of a kitchen wiped|meticulous means paying attention to every detail; spontaneous means acting without planning|meticulous 是一丝不苟的；spontaneous 是随性的|spontaneous=spontaneous means acting without planning, the opposite of great care over detail=spontaneous 是随性而为，和注重细节正相反;careless=careless means not paying attention, the opposite of attention to every detail=careless 是粗心的，和注重细节正相反|me · tic · u · lous|-ulous at the end, as in *ridiculous*|以 -ulous 结尾，和 *ridiculous* 一样
      perfectionist|an essay rewritten five times;people who find it hard to finish;a man never happy with his work|a perfectionist wants everything perfect; a pessimist expects the worst|perfectionist 是完美主义者；pessimist 是悲观主义者|pessimist/pessimists=a pessimist expects bad things, not someone who keeps improving their work=pessimist 是预料坏事的人，不是不断改进作品的人;extrovert/extroverts=an extrovert enjoys being with people, not someone who wants everything perfect=extrovert 是喜欢与人相处的人，不是追求完美的人|per · fec · tion · ist|perfection + ist|perfection + ist
      optimist|someone who sees the good side;people who live longer;people who still admit a plan might fail|an optimist expects good things; a pessimist expects bad things|optimist 是乐观主义者；pessimist 是悲观主义者|pessimist/pessimists=a pessimist expects bad things, but these people see the good side=pessimist 是预料坏事的人，而这些人看到好的一面;introvert/introverts=an introvert is a quiet person who enjoys being alone, which says nothing about expecting good things=introvert 是喜欢独处的安静的人，与是否预料好事无关|op · ti · mist|optim + ist, with one t and one m|optim + ist，一个 t、一个 m
      pessimist|someone told things will get better;people who expect the worst;a man sure the plane would be late|a pessimist expects bad things; an optimist expects good things|pessimist 是悲观主义者；optimist 是乐观主义者|optimist/optimists=an optimist expects good things, but these people expect the worst=optimist 是预料好事的人，而这些人预料最坏的情况;extrovert/extroverts=an extrovert enjoys being with people, which says nothing about expecting the worst=extrovert 是喜欢与人相处的人，与是否预料坏事无关|pes · si · mist|a double s after pe|pe 后面双写 s
      introvert|needing time alone after a party;one close friend rather than a group;meetings that feel tiring|an introvert is quiet and enjoys being alone; an extrovert enjoys being with people|introvert 是内向的人；extrovert 是外向的人|extrovert/extroverts=an extrovert enjoys being with people, the opposite of needing time alone=extrovert 喜欢与人相处，和需要独处正相反;optimist/optimists=an optimist expects good things, which says nothing about wanting to be alone=optimist 是乐观的人，与是否喜欢独处无关|in · tro · vert|intro + vert, with o, not a|intro + vert，是 o，不是 a
      extrovert|people who love big parties;people who get energy from others;the family member who talks to everyone|an extrovert enjoys being with people; an introvert enjoys being alone|extrovert 是外向的人；introvert 是内向的人|introvert/introverts=an introvert enjoys being alone, the opposite of loving parties and talking to everyone=introvert 喜欢独处，和爱聚会、跟谁都聊正相反;pessimist/pessimists=a pessimist expects bad things, which says nothing about enjoying company=pessimist 是悲观的人，与是否喜欢与人相处无关|ex · tro · vert|extro-, not extra-|extro-，不是 extra-
      sensible|an umbrella in case of rain;practical advice;shoes for a long walk|sensible means practical and wise; sensitive means easily hurt or aware of feelings|sensible 是明智务实的；sensitive 是敏感的|neurotic=neurotic means worrying too much without reason, not practical and wise=neurotic 是无端焦虑，不是明智务实;spontaneous=spontaneous means acting without planning, not practical and wise=spontaneous 是随性而为，不是明智务实|sen · si · ble|-ible at the end, not *sensitive*|以 -ible 结尾，不要写成 *sensitive*
    `,
  },
});

const weighing = vocabularyTopic({
  id: "b2-words-academic-adjectives",
  title: t("Weighing Ideas", "权衡观点"),
  summary: t(
    "Fundamental, crucial, vital and integral parts; inherent risks; prominent and predominant views; relevant and irrelevant facts; comprehensive and extensive research; explicit rules.",
    "基本的、关键的、至关重要的和不可或缺的部分；固有的风险；突出的和占主导地位的观点；相关的和无关的事实；全面的和广泛的研究；明确的规定。",
  ),
  intro: t(
    "At the town meeting, Dr. Park said that clean water is **vital**, that some risk is **inherent** in every plan, and that her report was **comprehensive** but left out **irrelevant** details. These words help you weigh ideas and say how important they are.",
    "在镇上的会议上，帕克博士说干净的水是 **vital**（至关重要的），每个方案都有 **inherent**（固有的）风险，她的报告 **comprehensive**（全面），只是删去了 **irrelevant**（无关的）细节。这些词帮你权衡观点，说明它们有多重要。",
  ),
  prerequisites: ["b2-words-scientific-adjectives"],
  words: [
    word(
      "fundamental",
      "basic and most important; from which everything else develops",
      "基本的；根本的",
      "Freedom of speech is one of our most {fundamental} rights: all other rights grow from it. | The two plans differ at the most {fundamental} level: they want opposite things. | Reading is {fundamental} to all learning, because every other subject depends on it.",
      "irrelevant extensive",
      "crucial vital",
    ),
    word(
      "crucial",
      "extremely important, because everything else depends on it",
      "关键的；至关重要的",
      "The next few days will be {crucial} for the patient: they will decide whether she lives. | Water is {crucial} for life: without it, nothing can grow. | Her two goals were {crucial} to the team's victory.",
      "irrelevant explicit",
      "vital fundamental",
    ),
    word(
      "vital",
      "absolutely necessary; full of energy",
      "必不可少的；充满活力的",
      "It is {vital} that you arrive on time, or you will miss the plane. | Exercise is {vital} for good health: your heart needs it. | The festival could not happen without volunteers: their help is {vital}.",
      "irrelevant explicit",
      "crucial fundamental",
    ),
    word(
      "integral",
      "necessary and important as a part of a whole",
      "不可或缺的；构成整体所必需的",
      "Music is an {integral} part of the school day, and every child learns an instrument. | Teamwork is {integral} to the job: nobody here works alone. | The kitchen is {integral} to the design of the house, since every room opens onto it.",
      "irrelevant explicit",
    ),
    word(
      "inherent",
      "existing as a natural and permanent part of something",
      "固有的；内在的",
      "There are risks {inherent} in any sport: you can always fall or get hurt. | Danger is {inherent} in mountain climbing, and no one can remove it completely. | The plan has an {inherent} weakness that comes from its basic design.",
      "irrelevant explicit",
    ),
    word(
      "prominent",
      "important and well known; easy to see",
      "著名的；显眼的",
      "She is a {prominent} lawyer who has won many famous cases. | The castle is {prominent} on the hill: you can see it from every street in town. | After his famous speech, he became a {prominent} politician whom everyone knew.",
      "predominant relevant",
      "predominant",
    ),
    word(
      "predominant",
      "most common or most important",
      "占主导地位的；最主要的",
      "Spanish is the {predominant} language in the region: most people speak it at home. | Fear was the {predominant} feeling among the passengers, and almost all of them felt it. | The {predominant} view among scientists is that the climate is changing, and few disagree.",
      "prominent relevant",
      "prominent",
    ),
    word(
      "relevant",
      "connected with what is being discussed",
      "相关的",
      "Please include only {relevant} information in your answer, and leave out anything off the topic. | His age is {relevant} to the case, because the law treats children differently. | The course teaches skills that are {relevant} to the job market, so students find work easily.",
      "irrelevant explicit",
      "irrelevant",
    ),
    word(
      "irrelevant",
      "not connected with what is being discussed",
      "无关的",
      "Your feelings are {irrelevant} here: we need facts. | Her age is {irrelevant} to her ability to do the job: young or old, she does it well. | Delete the {irrelevant} details from your essay, since they have nothing to do with the topic.",
      "relevant crucial",
      "relevant",
    ),
    word(
      "comprehensive",
      "including everything or nearly everything",
      "全面的；综合的",
      "This guidebook is {comprehensive}: it covers every street, museum and restaurant in the city. | Our insurance is {comprehensive}, covering fire, theft and accidents. | The report looks at every side of the problem, so it is truly {comprehensive}.",
      "irrelevant explicit",
      "extensive",
    ),
    word(
      "extensive",
      "covering a large area or including a lot",
      "广泛的；大量的",
      "The storm caused {extensive} damage across the whole region. | She has {extensive} experience of teaching: thirty years in five countries. | The house has {extensive} gardens that stretch all the way down to the river.",
      "irrelevant explicit",
      "comprehensive",
    ),
    word(
      "explicit",
      "clear and exact; showing sex or violence openly",
      "明确的；露骨的",
      "The teacher gave {explicit} instructions about the essay, stating exactly how long it must be. | The film shows {explicit} violence on screen, so children may not watch it. | He was very {explicit} about what he wanted: he wrote it all down in a list.",
      "implicit inherent",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Relevant* means connected with the topic and *irrelevant* means not connected. Look for words such as *off the topic*, *nothing to do with* or *because the law treats* that tell you whether the thing matters here.",
        "*relevant* 是与话题相关，*irrelevant* 是无关。找找 *off the topic*、*nothing to do with* 或 *because the law treats* 这类词，判断它在这里重不重要。",
      ),
      meaning: t(
        "*Prominent* means well known or easy to see, while *predominant* means the most common. Check whether the meaning is about being noticed or about being the most frequent.",
        "*prominent* 是著名的或显眼的，*predominant* 是最常见的、占主导的。看释义说的是引人注目，还是数量最多。",
      ),
      spell: t(
        "*Inherent* ends in -ent, not like *inherit*; *irrelevant* has a double r; *comprehensive* ends in -sive.",
        "*inherent* 以 -ent 结尾，和 *inherit* 不同；*irrelevant* 双写 r；*comprehensive* 以 -sive 结尾。",
      ),
    },
    notes: `
      fundamental|rights that all others grow from;plans that want opposite things;the subject every other subject depends on|fundamental means basic, the thing everything else grows from; extensive means covering a lot|fundamental 是根本的；extensive 是广泛的|irrelevant=irrelevant means not connected, but here other things grow from it or depend on it=irrelevant 是无关的，而这里其他东西都源于它、依赖它;extensive=extensive means covering a large area, not the base that others depend on=extensive 是范围广的，不是其他东西依赖的基础|fun · da · men · tal|fund + a + mental|fund + a + mental
      crucial|days that decide whether a patient lives;water without which nothing grows;two goals that won a game|crucial means extremely important because everything depends on it; irrelevant means not connected|crucial 是关键的；irrelevant 是无关的|irrelevant=irrelevant means not connected, but life, growth and victory depend on these things=irrelevant 是无关的，而生命、生长和胜利都取决于这些;explicit=explicit means clear and exact, not something that everything depends on=explicit 是明确的，不是一切所依赖的东西|cru · cial|-cial at the end, said "shul"|结尾是 -cial，读作 "shul"
      vital|arriving on time for a plane;exercise for the heart;help without which a festival fails|vital means absolutely necessary; irrelevant means not connected|vital 是必不可少的；irrelevant 是无关的|irrelevant=irrelevant means not connected, but missing the plane, the heart and the festival show it is needed=irrelevant 是无关的，而误机、心脏和办不成的节日都说明它不可少;explicit=explicit means clear and exact, not necessary=explicit 是明确的，不是必需的|vi · tal|vit + al, one t|vit + al，一个 t
      integral|a school day where every child learns music;a job where nobody works alone;a room every other room opens onto|integral means a necessary part of a whole; irrelevant means not connected|integral 是不可或缺的；irrelevant 是无关的|irrelevant=irrelevant means not connected, but every child, everyone and every room are tied to it=irrelevant 是无关的，而每个孩子、每个人、每个房间都和它相连;explicit=explicit means clear and exact, not a necessary part of a whole=explicit 是明确的，不是整体中不可少的部分|in · te · gral|-gral at the end, not *integer*|结尾是 -gral，不要写成 *integer*
      inherent|falling in any sport;danger in climbing that cannot be removed;a weakness from a plan's basic design|inherent means a natural, permanent part of something; explicit means clear and exact|inherent 是固有的；explicit 是明确的|irrelevant=irrelevant means not connected, but falling, danger and the design belong to the thing itself=irrelevant 是无关的，而摔倒、危险和设计都属于事物本身;explicit=explicit means stated clearly, not part of something's nature=explicit 是明确说出的，不是事物本身的一部分|in · her · ent|-ent at the end, not *inherit*|结尾是 -ent，不要写成 *inherit*
      prominent|a lawyer famous for her cases;a castle seen from every street;a politician everyone knew|prominent means well known or easy to see; predominant means most common|prominent 是著名的、显眼的；predominant 是占主导的|predominant=predominant means the most common of several, not famous or easy to see=predominant 是几种里最常见的，不是著名或显眼;relevant=relevant means connected with the topic, not famous or easy to see=relevant 是相关的，不是著名或显眼|prom · i · nent|-nent at the end, with one m|结尾是 -nent，一个 m
      predominant|the language most people speak at home;the feeling almost all passengers had;the view few scientists disagree with|predominant means most common; prominent means well known|predominant 是最主要的；prominent 是著名的|prominent=prominent means famous or easy to see, but here the point is that most people share it=prominent 是著名或显眼，而这里说的是大多数人都有;relevant=relevant means connected with the topic, not shared by most=relevant 是相关的，不是大多数人共有的|pre · dom · i · nant|pre + dominant|pre + dominant
      relevant|information that stays on the topic;an age the law cares about;skills that help students find work|relevant means connected with what is discussed; irrelevant means not connected|relevant 是相关的；irrelevant 是无关的|irrelevant=irrelevant means not connected, but here the law, the topic and finding work show a connection=irrelevant 是无关的，而法律、话题和找工作都显示有关联;explicit=explicit means clear and exact, not connected with the topic=explicit 是明确的，不是与话题相关|rel · e · vant|-vant at the end, with one l|结尾是 -vant，一个 l
      irrelevant|feelings when facts are needed;age that does not affect the work;details that have nothing to do with the topic|irrelevant means not connected; relevant means connected|irrelevant 是无关的；relevant 是相关的|relevant=relevant means connected, but these things have nothing to do with the point=relevant 是相关的，而这些东西和重点无关;crucial=crucial means extremely important, the opposite of things that do not matter here=crucial 是关键的，和这里无关紧要正相反|ir · rel · e · vant|ir + relevant, so a double r|ir + relevant，所以双写 r
      comprehensive|a guidebook that covers every street;insurance for fire, theft and accidents;a report that looks at every side|comprehensive means including everything; extensive means covering a lot|comprehensive 是全面的；extensive 是广泛的|irrelevant=irrelevant means not connected, not covering everything=irrelevant 是无关的，不是面面俱到;explicit=explicit means clear and exact, not including every part=explicit 是明确的，不是包括所有部分|com · pre · hen · sive|-sive at the end, not *comprehensible*|结尾是 -sive，不要写成 *comprehensible*
      extensive|storm damage across a whole region;thirty years of teaching;gardens down to a river|extensive means covering a large area or a lot; comprehensive means including everything|extensive 是广泛的、大量的；comprehensive 是全面的|irrelevant=irrelevant means not connected, not large in amount=irrelevant 是无关的，不是数量大;explicit=explicit means clear and exact, not large in area or amount=explicit 是明确的，不是面积大或数量多|ex · ten · sive|ex + tens + ive, not *expensive*|ex + tens + ive，不要写成 *expensive*
      explicit|instructions stating exact length;violence shown on screen;wishes written down in a list|explicit means stated clearly and openly; implicit means suggested but not said|explicit 是明确的；implicit 是含蓄的|implicit=implicit means suggested without being said, but these things are stated, shown or written=implicit 是暗示而未说出，而这些都被说出、展示或写下;inherent=inherent means part of something's nature, not stated clearly=inherent 是固有的，不是明确说出的|ex · plic · it|ex + plic + it, with a c before the it|ex + plic + it，it 前面是 c
    `,
  },
});

// Inversion after negative adverbs.

/**
 * inversions are formal sentences that begin with a negative word: the opening, the auxiliary, the subject, the rest,
 * the same idea in normal word order, and two wrong auxiliaries.
 */
const handInversions: readonly (readonly [string, string, string, string, string, string, string])[] = [
  ["Never", "have", "I", "felt so tired", "I have never felt so tired.", "did", "am"],
  ["Rarely", "do", "people", "admit their mistakes", "People rarely admit their mistakes.", "are", "have"],
  ["Seldom", "does", "she", "eat meat", "She seldom eats meat.", "is", "has"],
  ["Never", "had", "we", "seen such a crowd before that day", "We had never seen such a crowd before that day.", "did", "were"],
  ["Rarely", "have", "I", "heard such nonsense", "I have rarely heard such nonsense.", "did", "am"],
  ["Not once", "did", "he", "say thank you", "He did not say thank you once.", "has", "was"],
  ["Never before", "has", "the city", "seen so much rain", "The city has never seen so much rain before.", "did", "is"],
  ["Little", "did", "they", "know what was about to happen", "They did not know what was about to happen.", "has", "were"],
  ["Hardly ever", "do", "we", "go to the movies", "We hardly ever go to the movies.", "are", "have"],
  ["Under no circumstances", "should", "you", "open this door", "You should not open this door under any circumstances.", "have", "are"],
  [
    "At no time",
    "did",
    "the police",
    "explain why he was arrested",
    "The police did not explain at any time why he was arrested.",
    "were",
    "have",
  ],
  ["Never", "will", "I", "forget that day", "I will never forget that day.", "have", "am"],
  ["Rarely", "does", "the president", "give interviews", "The president rarely gives interviews.", "is", "has"],
  ["Seldom", "have", "scientists", "agreed so strongly", "Scientists have seldom agreed so strongly.", "do", "are"],
  [
    "Not only",
    "did",
    "she",
    "win the race, but she also broke the record",
    "She not only won the race but also broke the record.",
    "has",
    "was",
  ],
  ["Never", "has", "the team", "played so badly", "The team has never played so badly.", "did", "is"],
  ["No sooner", "had", "we", "arrived than it started to rain", "We had no sooner arrived than it started to rain.", "did", "have"],
  ["Hardly", "had", "she", "sat down when the phone rang", "She had hardly sat down when the phone rang.", "did", "has"],
  ["Only then", "did", "I", "understand the problem", "I understood the problem only then.", "had", "was"],
  ["Only after the test", "did", "he", "realize his mistake", "He realized his mistake only after the test.", "has", "was"],
  ["Rarely", "do", "children", "read newspapers these days", "Children rarely read newspapers these days.", "are", "does"],
  ["Never", "did", "anyone", "expect him to win", "Nobody ever expected him to win.", "has", "was"],
  ["Seldom", "is", "the museum", "so quiet", "The museum is seldom so quiet.", "does", "has"],
  ["Never", "was", "she", "so happy", "She was never so happy.", "did", "had"],
  [
    "Under no circumstances",
    "will",
    "the bank",
    "ask for your password",
    "The bank will not ask for your password under any circumstances.",
    "is",
    "has",
  ],
  ["Rarely", "has", "a film", "made me cry so much", "A film has rarely made me cry so much.", "did", "is"],
  ["Not until the end", "did", "we", "learn the truth", "We did not learn the truth until the end.", "have", "were"],
  ["Little", "does", "he", "know about cars", "He knows little about cars.", "is", "has"],
  ["Never", "had", "I", "felt so alone", "I had never felt so alone.", "did", "was"],
  ["Seldom", "do", "I", "have time to read", "I seldom have time to read.", "am", "have"],
  ["Never", "have", "prices", "risen so fast", "Prices have never risen so fast.", "did", "are"],
  ["Not once", "has", "she", "complained about the work", "She has not complained about the work once.", "did", "is"],
];

/** inversionPeople are the subjects of the generated inversions, each one person. */
const inversionPeople = ["Tom", "Anna", "my father", "our teacher", "the manager", "Grace"] as const;

/**
 * inversionActs are an opening, its auxiliary, the rest after the subject, the normal sentence after the subject, and
 * two wrong auxiliaries.
 */
const inversionActs: readonly (readonly [string, string, string, string, string, string])[] = [
  ["Never", "has", "seen such a mess", "has never seen such a mess", "did", "is"],
  ["Rarely", "does", "cook at home", "rarely cooks at home", "is", "has"],
  ["Seldom", "does", "take a day off", "seldom takes a day off", "is", "has"],
  ["Not once", "did", "complain about the food", "did not complain about the food once", "has", "was"],
  ["Never", "had", "felt so proud", "had never felt so proud", "did", "was"],
  ["Little", "did", "know about the surprise party", "did not know about the surprise party", "has", "was"],
  ["Hardly ever", "does", "watch television", "hardly ever watches television", "is", "has"],
  ["Never", "will", "forget this trip", "will never forget this trip", "has", "is"],
  ["Only then", "did", "notice the mistake", "noticed the mistake only then", "had", "was"],
  ["Rarely", "has", "been so angry", "has rarely been so angry", "did", "is"],
  ["No sooner", "had", "left than the bus arrived", "had no sooner left than the bus arrived", "did", "has"],
  ["Hardly", "had", "opened the door when the dog ran out", "had hardly opened the door when the dog ran out", "did", "has"],
  ["Seldom", "is", "late for work", "is seldom late for work", "does", "has"],
  ["Not until midnight", "did", "finish the essay", "did not finish the essay until midnight", "has", "was"],
];

/** inversions are the hand-written inversions, then those from people and acts. */
const inversions: readonly (readonly [string, string, string, string, string, string, string])[] = [
  ...handInversions,
  ...inversionActs.flatMap(([neg, aux, rest, normal, w1, w2]) =>
    inversionPeople.map((who) => [neg, aux, who, rest, `${who.charAt(0).toUpperCase()}${who.slice(1)} ${normal}.`, w1, w2] as const),
  ),
];

const orderChoice: readonly ChoiceItem[] = inversions.map(
  ([neg, aux, subject, rest, normal]): ChoiceItem => [
    `${normal} → ${neg} ___ ${rest}.`,
    `${aux} ${subject}`,
    [`${subject} ${aux}`, subject],
  ],
);

const auxiliaryChoice: readonly ChoiceItem[] = inversions.map(
  ([neg, aux, subject, rest, , wrong1, wrong2]): ChoiceItem => [`${neg} ___ ${subject} ${rest}.`, aux, [wrong1, wrong2]],
);

const inversionTyped: readonly TypedItem[] = inversions.map(
  ([neg, aux, subject, rest, normal]): TypedItem => ({
    shown: `${normal} (${neg} …)`,
    accepted: [`${neg} ${aux} ${subject} ${rest}.`],
    canonical: `${neg} ${aux} ${subject} ${rest}.`,
    wrong: [`${neg} ${subject} ${aux} ${rest}.`, `${neg} ${subject} ${rest}.`],
  }),
);

/** inversionOf finds the inversion of a sentence with a gap, or of a written sentence. */
const inversionOf = (text: string) =>
  inversions.find(
    ([neg, aux, subject, rest, normal]) =>
      text === `${normal} → ${neg} ___ ${rest}.` ||
      text === `${neg} ___ ${subject} ${rest}.` ||
      text === `${neg} ${aux} ${subject} ${rest}.`,
  );

/** orderRule names the question order after the negative opening of text. */
function orderRule(text: string): Text {
  const [neg = "", aux = "", subject = ""] = inversionOf(text) ?? [];
  return t(
    `After *${neg}* at the start, the auxiliary comes before the subject, as in a question (*${aux} ${subject}*)`,
    `*${neg}* 放在句首时，助动词要放在主语前面，和疑问句一样（*${aux} ${subject}*）`,
  );
}

/** auxiliaryRule names where the auxiliary of an inversion comes from: the normal sentence, or do, does or did. */
function auxiliaryRule(text: string): Text {
  const [, aux = "", , , normal = ""] = inversionOf(text) ?? [];
  return new RegExp(`\\b${aux}\\b`, "iu").test(normal)
    ? t(
        `The normal sentence already has *${aux}* (*${normal}*), so *${aux}* moves before the subject`,
        `原来的句子里已经有 *${aux}*（*${normal}*），所以把 *${aux}* 移到主语前面`,
      )
    : t(
        `The normal sentence has no auxiliary (*${normal}*), so add *${aux}*, as in a question, and the main verb goes back to its base form`,
        `原来的句子里没有助动词（*${normal}*），所以像疑问句一样加 *${aux}*，主要动词变回原形`,
      );
}

/** whyNotOrder explains the normal order, or a missing auxiliary, after a negative opening. */
const whyNotOrder = (wrong: string, _right: string, _shown: string, position: number): Text =>
  position === 0
    ? t(
        `*${wrong}* keeps statement order, but a negative opening requires inverted question order (auxiliary before subject).`,
        `*${wrong}* 保留了陈述句语序，而否定词放在句首时必须用疑问句倒装语序（助动词在主语前）。`,
      )
    : t(
        `*${wrong}* leaves out the auxiliary; inverted order puts the auxiliary in front of the subject.`,
        `*${wrong}* 漏掉了助动词；倒装结构需要把助动词放在主语前面。`,
      );

/** whyNotAuxiliary explains an auxiliary that does not match the normal sentence. */
const whyNotAuxiliary = (wrong: string): Text =>
  t(
    `*${wrong}* does not match the tense, subject, or main-verb form of this inverted clause.`,
    `*${wrong}* 与这个倒装句的时态、主语或主要动词形式不匹配。`,
  );

const inversion: TopicDef = {
  id: "inversion-after-negative-adverbs",
  title: t("Never Have I...", "否定副词后的倒装"),
  summary: t(
    "Never have I felt so tired. Rarely do people admit it. After a negative word at the start of a formal sentence, the order is that of a question.",
    "Never have I felt so tired. Rarely do people admit it. 正式的句子以否定词开头时，语序和疑问句一样。",
  ),
  intro: t(
    "Move *never* or *rarely* to the front of a formal sentence for dramatic weight—*Never had the audience heard such silence*—and the auxiliary jumps ahead of the subject, just as in a question.",
    "正式书面语把 *never* 或 *rarely* 提到句首加强语气时（*Never had the audience heard such silence*），助动词就会像疑问句一样跳到主语前面。",
  ),
  prerequisites: ["present-perfect-or-past-simple"],
  encompasses: [{ topic: "present-simple-questions", weight: 0.2 }],
  xp: 30,
  strand: "grammar",
  knowledgePoints: [
    point(
      "order",
      t("Question order after a negative word", "否定词后用疑问句语序"),
      t(
        "In formal and written English, a sentence can begin with a negative or limiting word for emphasis: *never*, *rarely*, *seldom*, *little*, *not once*, *under no circumstances*, *no sooner*, *only then*. The subject and the auxiliary then change places, as in a question:\n\n- *I have never felt so tired.* → *Never **have I** felt so tired.*\n- *We had no sooner arrived than it started to rain.* → *No sooner **had we** arrived than it started to rain.*\n\n> **Watch out.** Never keep statement order after a fronted negative (*Never I have felt* and *Never I felt* are both wrong)—always invert auxiliary + subject.",
        "在正式的书面英语中，为了强调，句子可以用否定词或表示限制的词开头：*never*、*rarely*、*seldom*、*little*、*not once*、*under no circumstances*、*no sooner*、*only then*。这时主语和助动词要交换位置，和疑问句一样：\n\n- *I have never felt so tired.* → *Never **have I** felt so tired.*\n- *We had no sooner arrived than it started to rain.* → *No sooner **had we** arrived than it started to rain.*\n\n中文“我从来没有这么累过”语序不变，所以中国学生常常忘记倒装。\n\n> **注意。** 否定词提前后绝不能保留陈述语序（*Never I have felt* 和 *Never I felt* 都是错的），必须把助动词放在主语前。",
      ),
      choiceGenerator(
        t("Choose the words for the gap.", "选出填入空白处的词。"),
        orderChoice,
        (right, shown) => {
          const rule = orderRule(shown);
          return t(
            `${rule.en}: ${fill(shown, right)}\n\n**Check.** Confirm the fronted negative is followed immediately by auxiliary + subject (*${right}*).`,
            `${rule["zh-CN"]}：${fill(shown, right)}\n\n**检验。** 确认句首否定词后面紧跟“助动词 + 主语”（*${right}*）。`,
          );
        },
        whyNotOrder,
      ),
    ),
    point(
      "auxiliary",
      t("Choosing the auxiliary", "选择助动词"),
      t(
        "Use the auxiliary that the question would use. If the sentence already has *have*, *had*, *will*, *should* or *be*, that word moves before the subject. If it has none, add *do*, *does* or *did*, and the main verb goes back to its base form:\n\n- *People rarely admit it.* → *Rarely **do** people admit it.*\n- *She seldom eats meat.* → *Seldom **does** she **eat** meat.*\n- *He didn't say thank you once.* → *Not once **did** he **say** thank you.*\n- *The museum is seldom so quiet.* → *Seldom **is** the museum so quiet.*\n\n> **Watch out.** Match the auxiliary to the verb that follows it: *do/does/did* takes a **base verb**, *has/have/had* takes a **past participle**, and *is/are/was/were* takes an adjective or *-ing*.",
        "用疑问句会用的助动词。如果句子里已经有 *have*、*had*、*will*、*should* 或 *be*，就把它移到主语前面；如果没有，就加 *do*、*does* 或 *did*，主要动词变回原形：\n\n- *People rarely admit it.* → *Rarely **do** people admit it.*\n- *She seldom eats meat.* → *Seldom **does** she **eat** meat.*\n- *He didn't say thank you once.* → *Not once **did** he **say** thank you.*\n- *The museum is seldom so quiet.* → *Seldom **is** the museum so quiet.*\n\n这和构成一般疑问句的方法完全相同：*Does she eat meat?*\n\n> **注意。** 根据后面的动词形态核对助动词：*do/does/did* 配**动词原形**，*has/have/had* 配**过去分词**，*is/are/was/were* 配形容词或 *-ing*。",
      ),
      choiceGenerator(
        t("Choose the word for the gap.", "选出填入空白处的词。"),
        auxiliaryChoice,
        (right, shown) => {
          const rule = auxiliaryRule(shown);
          return t(
            `${rule.en}: ${fill(shown, right)}\n\n**Check.** Form the matching yes-no question in your head—the auxiliary that opens it (*${right}*) is the exact word needed here.`,
            `${rule["zh-CN"]}：${fill(shown, right)}\n\n**检验。** 在脑中把原句改成一般疑问句，开头用的那个助动词（*${right}*）就是这里该填的词。`,
          );
        },
        whyNotAuxiliary,
      ),
    ),
    point(
      "write",
      t("Writing inverted sentences", "写倒装句"),
      t(
        "Rewrite the sentence so that it begins with the words given. Put the auxiliary before the subject, add *do*, *does* or *did* if there is no auxiliary, and keep the rest of the sentence:\n\n- *She seldom eats meat. (Seldom …)* becomes *Seldom does she eat meat.*\n- *I will never forget that day. (Never …)* becomes *Never will I forget that day.*\n\n> **Watch out.** Drop *not* or *never* from the middle of the original sentence once the fronted negative replaces it, and return the main verb to its base form after *do/does/did*.",
        "用给出的词开头改写句子。把助动词放在主语前面；没有助动词时加 *do*、*does* 或 *did*；句子的其余部分不变：\n\n- *She seldom eats meat. (Seldom …)* 写成 *Seldom does she eat meat.*\n- *I will never forget that day. (Never …)* 写成 *Never will I forget that day.*\n\n> **注意。** 句首否定词已经代替了原句中的 *not* 或 *never*，不要在句中重复；加了 *do/does/did* 后，主要动词记得还原成原形。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Rewrite the sentence so that it begins with the words given.", "用给出的词开头改写句子。"),
        inversionTyped,
        (right) => {
          const order = orderRule(right);
          const aux = auxiliaryRule(right);
          return t(
            `${order.en}. ${aux.en}: ${right}\n\n**Check.** Confirm auxiliary + subject order, no repeated *not/never*, and the right verb form after the auxiliary.`,
            `${order["zh-CN"]}。${aux["zh-CN"]}：${right}\n\n**检验。** 核对“助动词 + 主语”倒装语序、没有重复 *not/never*，且助动词后的动词形式正确。`,
          );
        },
      ),
    ),
  ],
};

/** topics are the topics of the unit Mind and Behavior. */
export const topics: readonly TopicDef[] = [
  psychology.topic,
  feelings.topic,
  decisions.topic,
  behavior.topic,
  memory.topic,
  bonds.topic,
  motivation.topic,
  body.topic,
  wellbeing.topic,
  types.topic,
  weighing.topic,
  inversion,
];

/** vocabulary are the word batches of the unit Mind and Behavior. */
export const vocabulary: readonly WordBatch[] = [
  psychology.batch,
  feelings.batch,
  decisions.batch,
  behavior.batch,
  memory.batch,
  bonds.batch,
  motivation.batch,
  body.batch,
  wellbeing.batch,
  types.batch,
  weighing.batch,
];
