// The dialogues of level 7 with their questions (docs/chinese-curriculum.md §8.4), written for this package in the characters taught by the end of their unit; none is taken from a test.

import type { LevelDialogues } from "../level-1/dialogues.ts";

/** dialogues are the dialogue listening topics of level 7, ending its sixth and twelfth units. */
export const dialogues: readonly LevelDialogues[] = [
  {
    unit: 6,
    data: `
女：我小时候过年，家家都得排长队买肉，凭票才能买到一点儿。
男：现在手机上一点，第二天就送到家门口，这变化真是天翻地覆。
问：他们在谈论什么？
据：女的讲小时候凭票排队买肉，男的讲现在手机一点就送到家，又说“这变化真是天翻地覆”。两个人比的是过去和现在的生活。 | She recalls queuing with coupons for meat; he notes that now a tap brings it home and calls the change earth-shaking. They compare life then and now.
答：生活方式的巨大变化
错：过年应该买什么 | 买肉只是用来比较的例子，他们没有讨论过年该买什么。 | Meat is only an example; they do not discuss what to buy for New Year.
错：怎么在网上买肉 | 网上买东西只是男的举的现在的例子，不是在教怎么买。 | Online shopping is his example of today, not a how-to.
错：小时候的过年习惯 | 小时候过年只是一半，男的接着讲现在，说的是变化。 | Childhood New Year is only half; he goes on to the present, so the topic is change.
问：关于女的小时候，可以知道什么？
据：女的说“家家都得排长队买肉，凭票才能买到一点儿”。 | The woman says every family queued for meat and needed coupons to get a little.
答：买东西要凭票排队
错：家里经常吃肉 | 凭票才能买到“一点儿”，说明不是经常吃肉。 | Only a little with coupons means meat was not common.
错：可以在网上买东西 | 网上买东西是男的说的“现在”。 | Online shopping is the man's "now".
错：过年不买年货 | 她们过年要排队买肉，就是在买年货。 | Queuing for meat at New Year is buying New Year goods.

男：我们老家的村子现在只有老人和孩子了，年轻人都到城里打工去了。
女：这两年情况好像有点儿变化，我们那儿不少人返乡开了网店，带货卖当地的特产。
男：要是家门口就能挣钱，谁愿意在外面奔波呢？
女：所以关键还是要让农村有发展的机会，光靠劝是劝不回来的。
问：女的家乡最近有什么变化？
据：女的说“我们那儿不少人返乡开了网店，带货卖当地的特产”。 | The woman says many people back home have returned to open online shops selling local goods.
答：有人返乡开网店卖特产
错：年轻人都去了城里 | 年轻人进城是男的说的他老家，不是女的家乡的变化。 | Young people leaving is the man's village, not the change in hers.
错：村子里只有老人 | 只有老人是男的的村子。 | Only old people remain in the man's village.
错：政府劝年轻人回来 | 女的说“光靠劝是劝不回来的”，没有说政府在劝。 | She says persuasion alone will not work; no government campaign is mentioned.
问：女的认为让年轻人回乡的关键是什么？
据：女的说“所以关键还是要让农村有发展的机会，光靠劝是劝不回来的”。 | The woman says the key is giving the countryside chances to develop; persuasion alone will not bring people back.
答：农村要有发展机会
错：多劝年轻人回来 | 她说光靠劝是劝不回来的。 | She says persuasion alone fails.
错：提高城里的工资 | 她说的是农村的机会，不是城里的工资。 | She speaks of rural opportunity, not city wages.
错：让老人去城里生活 | 对话没有说让老人进城。 | Moving the old to the city is never mentioned.
问：男的那句"谁愿意在外面奔波呢"是什么意思？
据：男的说“要是家门口就能挣钱，谁愿意在外面奔波呢”。反问的意思是：能在家乡挣钱，就没人愿意在外面跑，人们就会回来。 | He asks, if one could earn at home, who would want to toil far away? The rhetorical question means people would come back.
答：能在家乡挣钱，人们就愿意回来
错：年轻人不喜欢在外面工作 | 他说的是有条件的：家门口能挣钱才回来，不是泛泛地不喜欢外面的工作。 | His point is conditional: they return if they can earn at home, not a general dislike of work away.
错：在城里工作太累了 | 他说的是愿不愿意离家，没有比较城里累不累。 | He speaks of leaving home, not of how tiring city work is.
错：他自己不想回家乡 | 他说的是“谁”，指大家，不是他自己。 | His "who" means everyone, not himself.

女：你们家就一个孩子，父母老了以后，赡养的压力全在你身上吧？
男：确实不小。我打算以后让他们去离我家近的敬老院，护工专业，我下班也能常去看看。
女：你父母愿意吗？老一辈人总觉得住敬老院是孩子不孝顺。
男：我已经跟他们商量过了，他们比我想的开明。
问：男的打算怎么照顾父母？
据：男的说“我打算以后让他们去离我家近的敬老院”。 | The man plans to have them live in a care home near him.
答：让父母住附近的敬老院
错：辞职在家照顾父母 | 他说下班也能常去看看，说明他还在上班，没有辞职。 | He will visit after work, so he keeps his job.
错：请护工到家里来 | 护工在敬老院里，不是请到家里。 | The carers are at the home, not hired to his house.
错：让父母和自己住在一起 | 他们住敬老院，不是和他住在一起。 | They will live in the care home, not with him.
问：男的父母对这个打算是什么态度？
据：男的说“我已经跟他们商量过了，他们比我想的开明”。开明就是能接受。 | The man says he discussed it and they are more open-minded than he expected, so they accept it.
答：能够接受
错：坚决反对 | 他们比男的想的开明，没有反对。 | They are open-minded, so they do not object.
错：觉得孩子不孝顺 | 觉得不孝顺是女的说的老一辈的一般看法，男的父母比这开明。 | Calling it unfilial is the woman's general view of elders; his parents are more open.
错：还没有表态 | 男的已经跟他们商量过了，他们表了态。 | He has discussed it, so they have given their view.

男：现在的孩子周末比上班还忙，这个兴趣班，那个补习班，一点儿玩的时间都没有。
女：家长也是没办法，怕孩子输在起跑线上。可是拔苗助长，最后反而让孩子对学习失去兴趣。
问：女的对给孩子报很多班是什么看法？
据：女的说“家长也是没办法”，这是理解；又说“拔苗助长，最后反而让孩子对学习失去兴趣”，这是担心效果相反。 | She says parents have little choice, which is sympathy, then that forcing growth makes children lose interest, which is the backfire.
答：可以理解，但效果可能适得其反
错：家长应该多给孩子报班 | 她说拔苗助长会让孩子失去兴趣，不是鼓励多报。 | She warns it backfires, so she does not urge more classes.
错：孩子周末就应该学习 | 她说会让孩子对学习失去兴趣，不是周末就该学习。 | She warns of lost interest, not that weekends belong to study.
错：这样做对孩子完全没有影响 | 她说“反而让孩子对学习失去兴趣”，影响很大。 | She says it makes children lose interest, a real effect.
问：女的认为家长为什么给孩子报很多班？
据：女的说家长“怕孩子输在起跑线上”，就是怕孩子比别人落后。 | She says parents fear their child losing at the starting line, that is, falling behind others.
答：怕孩子落后于别人
错：孩子自己想去 | 女的说的是家长怕，没有说孩子想去。 | She speaks of parents' fear, not children's wishes.
错：周末没人照顾孩子 | 对话没有说没人照顾孩子。 | Childcare is never mentioned.
错：学校要求这样做 | 对话没有说学校要求。 | No school requirement is mentioned.

女：这次考试又没考好，我是不是天生就笨？
男：别这么想。你只是方法不对，光死记硬背，没真正理解。先把最基本的概念理解透，再做题，慢慢就好了。
女：可我已经很刻苦了，每天学到半夜。
男：刻苦是好事，但方向错了，越努力越累。学习要循序渐进，不能着急。
问：男的认为女的考不好的原因是什么？
据：男的说“你只是方法不对，光死记硬背，没真正理解”。 | The man says her method is wrong: rote learning without understanding.
答：学习方法不对
错：她不够努力 | 女的说每天学到半夜，男的也说“刻苦是好事”，不是不够努力。 | She studies till midnight, and he calls her diligence good.
错：她天分不够 | 男的让她“别这么想”，不同意天生笨。 | He tells her not to think she is born slow.
错：考试题太难 | 男的没有说题太难。 | He does not blame the paper.
问：男的建议女的怎么做？
据：男的说“先把最基本的概念理解透，再做题”。 | The man says first understand the basic ideas thoroughly, then do exercises.
答：先理解基本概念，再做题
错：每天学到半夜 | 学到半夜是女的现在的做法，男的说方向错了越努力越累。 | Studying till midnight is what she does now; he says effort in the wrong direction only tires.
错：多做一些练习题 | 他说先理解再做题，不是多做题。 | He says understand first, not do more exercises.
错：请一位家教 | 他没有说请家教。 | He does not mention a tutor.
问：男的的态度是什么？
据：男的先说“别这么想”，再说出原因和办法。他在鼓励她，也帮她找原因。 | He says not to think that way, then gives the cause and a way forward: encouragement and diagnosis.
答：鼓励女的，帮她找原因
错：批评女的不努力 | 他说“刻苦是好事”，没有批评她不努力。 | He praises her diligence.
错：同意女的说的话 | 女的说自己天生笨，男的不同意。 | She says she is born slow, and he disagrees.
错：觉得女的应该放弃 | 他说“慢慢就好了”，没有让她放弃。 | He says it will improve, not to give up.

男：祝贺你啊，听说你拿到了名校的录取通知书。
女：谢谢！其实第一年落榜了，我复读了一年。那一年特别难熬，好几次想放弃。
男：能坚持下来真不容易。
问：关于女的，可以知道什么？
据：男的说她拿到了名校的录取通知书，女的说“其实第一年落榜了，我复读了一年”。 | He says she got into a top university; she says she failed the first year and repeated a year.
答：复读一年后考上了名校
错：第一年就考上了名校 | 她说第一年落榜了。 | She says she failed the first year.
错：她没有参加考试 | 她落榜说明参加了考试。 | Failing shows she sat the exam.
错：她决定放弃上大学 | 她拿到了录取通知书，没有放弃。 | She got her offer and did not give up.
问：复读那一年女的感觉怎么样？
据：女的说“那一年特别难熬，好几次想放弃”。 | The woman says that year was very hard and she nearly gave up several times.
答：很难，几次想放弃
错：很轻松，很有信心 | 她说特别难熬，不是轻松。 | She says it was very hard, not easy.
错：一直很开心 | 她说好几次想放弃，不是一直开心。 | She nearly quit several times, so not always happy.
错：没有什么感觉 | 她说得很清楚是难熬，有很强的感觉。 | She calls it very hard, a strong feeling.

女：我想跳槽，现在的公司加班太多，加班费也不按时发。
男：你先别急着辞职，劳动合同上对加班是怎么规定的？如果公司违反了，你可以先跟人力资源部门反映。
女：我还真没认真看过合同。
问：女的为什么想换工作？
据：女的说“现在的公司加班太多，加班费也不按时发”。 | The woman says there is too much overtime and the overtime pay is late.
答：加班多，加班费不按时发
错：工资太低 | 她说的是加班费不按时，没有说工资低。 | She says overtime pay is late, not that her salary is low.
错：跟同事关系不好 | 对话没有说同事关系。 | Colleagues are never mentioned.
错：离家太远 | 对话没有说路远。 | Distance is never mentioned.
问：男的建议女的先做什么？
据：男的问合同怎么规定，说“如果公司违反了，你可以先跟人力资源部门反映”。 | The man asks what the contract says and suggests raising any breach with HR first.
答：看合同，向人力资源部门反映
错：马上辞职 | 男的说“你先别急着辞职”。 | He says not to rush to quit.
错：找律师告公司 | 他让她先找人力资源部门，没有说律师。 | He says HR first, not a lawyer.
错：继续加班 | 他是要她维护权利，不是继续加班。 | He wants her to assert her rights, not keep doing overtime.

男：新来的小王试用期还没过，就已经被转正了。
女：我一点儿也不意外，她做事又快又认真，客户都点名要她负责。
问：关于小王，可以知道什么？
据：男的说小王“试用期还没过，就已经被转正了”，女的说她做事又快又认真。 | He says Xiao Wang was confirmed before her probation ended, and the woman says she works fast and carefully.
答：表现好，提前转正了
错：试用期没有通过 | 她提前转正了，试用期通过了。 | She was confirmed early, so she passed.
错：客户对她不满意 | 客户都点名要她负责，是满意的。 | Clients ask for her, so they are pleased.
错：她是老员工 | 她是“新来的”，不是老员工。 | She is new, not a veteran.
问：客户对小王怎么样？
据：女的说“客户都点名要她负责”。 | The woman says clients ask for her by name.
答：点名要她负责
错：常常投诉她 | 点名要她就不是投诉她。 | Asking for her is the opposite of complaining.
错：不太认识她 | 点名要她，说明客户认识她。 | Naming her shows they know her.
错：觉得她做事太慢 | 女的说她做事“又快又认真”。 | The woman says she is quick and careful.

女：你在这家公司干了十年，为什么突然要辞职？
男：工资倒是不低，可每天做的都是同样的事，我觉得自己在原地踏步。
女：那你想去做什么？
男：现在还不算老，我想去学点儿新东西，哪怕从头开始也愿意。
问：男的为什么要辞职？
据：男的说“每天做的都是同样的事，我觉得自己在原地踏步”。原地踏步就是没有进步。 | He says he does the same thing every day and feels he is marking time: no progress.
答：觉得工作没有进步的空间
错：工资太低 | 他说“工资倒是不低”。 | He says the pay is not bad.
错：公司要裁员 | 对话没有说裁员。 | Layoffs are never mentioned.
错：身体不好 | 对话没有说身体。 | Health is never mentioned.
问：男的对从头开始是什么态度？
据：男的说“哪怕从头开始也愿意”。 | The man says he is willing even to start from scratch.
答：愿意接受
错：很担心 | 他说愿意，不是担心。 | He says he is willing, not worried.
错：坚决不愿意 | 他说愿意，和不愿意正好相反。 | He says willing, the opposite.
错：还没想好 | 他已经想好了要去学新东西。 | He has decided to learn something new.

男：大夫，我最近老是咳嗽，晚上更厉害，要不要打针？
女：先别着急。我看了检查结果，肺没有问题，可能是过敏引起的。你家里有没有养宠物？
男：上个月刚养了一只猫。
女：那很可能就是它了。我先给你开点儿药，你这段时间别让猫进房间。
问：医生认为男的咳嗽可能是什么原因？
据：医生说“可能是过敏引起的”，听说他上个月刚养了猫，又说“那很可能就是它了”。合起来是对猫过敏。 | The doctor suspects an allergy, and on hearing of the new cat says it is likely the cat: a cat allergy.
答：对猫过敏
错：肺出了问题 | 医生说“肺没有问题”。 | The doctor says the lungs are fine.
错：感冒了 | 医生说的是过敏，不是感冒。 | She says allergy, not a cold.
错：工作太累 | 医生没有说累。 | She says nothing about tiredness.
问：医生让男的怎么做？
据：医生说“我先给你开点儿药，你这段时间别让猫进房间”。 | The doctor prescribes medicine and tells him to keep the cat out of his room.
答：吃药，不让猫进房间
错：马上打针 | 男的问要不要打针，医生说“先别着急”。 | He asks about an injection, and she says not to rush.
错：把猫送给别人 | 医生只说别让猫进房间，没有说送人。 | She says keep it out of the room, not give it away.
错：住院检查 | 医生开了药，没有让他住院。 | She prescribes medicine, not a hospital stay.

女：你们医院现在可以在网上看病了？
男：对，一些复诊的病人不用跑来医院，在手机上就能跟医生视频，药直接送到家。
女：这对住得远的老人可方便多了。
男：不过第一次看病还是得来医院，医生得亲自检查才放心。
问：哪些病人可以在网上看病？
据：男的说“一些复诊的病人不用跑来医院”。 | The man says some follow-up patients need not come in.
答：复诊的病人
错：所有病人 | 男的说第一次看病还得来医院，不是所有病人。 | He says first visits need the hospital, so not everyone.
错：第一次看病的病人 | 第一次看病的人必须来医院。 | First-time patients must come in.
错：只有老人 | 住得远的老人是女的说的特别方便的人，不是只有他们可以。 | Elderly people far away are whom the woman says it helps, not the only ones allowed.
问：为什么第一次看病要去医院？
据：男的说“医生得亲自检查才放心”。 | The man says the doctor must examine in person to be sure.
答：医生需要亲自检查
错：网上不能开药 | 男的说药可以直接送到家。 | He says medicine is delivered home.
错：手机视频不清楚 | 对话没有说视频不清楚。 | Video quality is never mentioned.
错：医院规定不能在网上看病 | 医院已经可以在网上看病了。 | The hospital already offers online care.
问：女的认为网上看病对谁特别方便？
据：女的说“这对住得远的老人可方便多了”。 | The woman says it is much easier for elderly people who live far away.
答：住得远的老人
错：医院的医生 | 她说的是病人，不是医生。 | She speaks of patients, not doctors.
错：年轻的病人 | 她说的是老人，不是年轻人。 | She says the elderly, not the young.
错：第一次看病的人 | 第一次看病的人还得去医院。 | First-time patients must still go in.

男：这片湿地前些年差点儿被填平盖楼，现在居然成了候鸟的家。
女：是啊，这几年保护得好，听说今年来过冬的鸟比五年前多了好几千只。
问：关于这片湿地，可以知道什么？
据：女的说“这几年保护得好……今年来过冬的鸟比五年前多了好几千只”。 | The woman says it has been well protected, and wintering birds are several thousand more than five years ago.
答：保护以后来的鸟增多了
错：已经盖起了高楼 | 男的说“差点儿被填平盖楼”，没有盖。 | The man says it was nearly built on, but was not.
错：鸟越来越少了 | 鸟比五年前多了，不是少了。 | There are more birds, not fewer.
错：五年前就有很多鸟 | 五年前鸟少，现在多了好几千只。 | Five years ago there were fewer; now thousands more.
问：女的说今年来过冬的鸟有多少？
据：女的说“比五年前多了好几千只”。 | The woman says several thousand more than five years ago.
答：比五年前多好几千只
错：比五年前少一半 | 是多了，不是少了一半。 | More, not half as many.
错：和五年前差不多 | 多了好几千只，不是差不多。 | Thousands more, not about the same.
错：比去年少一些 | 她比较的是五年前，不是去年。 | She compares with five years ago, not last year.

女：这条河以前又脏又臭，附近的人都不愿意走这条路。
男：现在可大不一样了，工厂都搬走了，河边还修了步道，晚上很多人来散步。
女：可是听说河里的鱼还很少。
男：生态恢复需要时间，不能指望一两年就完全好起来。
问：这条河为什么变干净了？
据：男的说“工厂都搬走了，河边还修了步道”。 | The man says the factories have moved away and a riverside path was built.
答：工厂搬走了，河边也整治了
错：下了很多雨 | 对话没有说下雨。 | Rain is never mentioned.
错：大家不再走这条路 | 不走这条路是以前的事，现在很多人来散步。 | Avoiding the road was before; now many walk there.
错：河里放了很多鱼 | 女的说河里的鱼还很少。 | The woman says there are still few fish.
问：男的对河里鱼少的看法是什么？
据：男的说“生态恢复需要时间，不能指望一两年就完全好起来”。 | The man says ecological recovery takes time; it cannot be fully well in a year or two.
答：生态恢复需要时间
错：说明治理失败了 | 他说需要时间，不是治理失败。 | He says it needs time, not that the clean-up failed.
错：应该多放一些鱼 | 他没有说放鱼。 | He does not suggest stocking fish.
错：鱼少不是问题 | 他承认还没完全好，只是需要时间。 | He admits it is not yet well, only that it takes time.

男：你坐过无人驾驶的出租车吗？
女：坐过一次，开得很稳，可我一路都不太放心，眼睛一直盯着前面。
问：女的坐无人驾驶出租车时感觉怎么样？
据：女的说“开得很稳，可我一路都不太放心，眼睛一直盯着前面”。 | The woman says it drove smoothly, but she was uneasy all the way, eyes fixed ahead.
答：车开得稳，但她心里不踏实
错：车开得很危险 | 她说开得很稳，不是危险。 | She says it was smooth, not dangerous.
错：她觉得非常放心 | 她说一路都不太放心。 | She says she was uneasy all the way.
错：她一路都在睡觉 | 她眼睛一直盯着前面，没有睡觉。 | She kept her eyes on the road, so she did not sleep.
问：女的坐过几次无人驾驶出租车？
据：女的说“坐过一次”。 | The woman says she has ridden once.
答：一次
错：两次 | 她说的是一次，不是两次。 | She says once, not twice.
错：很多次 | 她说的是一次，不是很多次。 | She says once, not many times.
错：从来没坐过 | 她说坐过一次。 | She says she has ridden once.

女：大数据推荐真是越来越准了，我刚说想买跑步鞋，手机上就全是跑鞋的广告。
男：方便是方便，可也说明我们的个人信息被收集得太多了。
女：你说得对，看来以后得好好看看那些软件要了哪些权限。
问：男的担心什么？
据：男的说“可也说明我们的个人信息被收集得太多了”。 | The man says it shows too much personal data is collected.
答：个人信息被过度收集
错：广告推荐不准 | 女的说推荐“越来越准了”。 | The woman says the recommendations are ever more accurate.
错：跑步鞋太贵 | 对话没有说跑鞋的价钱。 | Shoe prices are never mentioned.
错：手机速度太慢 | 对话没有说手机速度。 | Phone speed is never mentioned.
问：女的最后有什么打算？
据：女的说“看来以后得好好看看那些软件要了哪些权限”。 | The woman says she will check which permissions those apps ask for.
答：检查软件的权限
错：不再用手机 | 她要检查权限，没有说不用手机。 | She will check permissions, not stop using the phone.
错：去买跑步鞋 | 她说过想买跑鞋，可是最后的打算是检查权限。 | She did want running shoes, but her final plan is about permissions.
错：关掉所有广告 | 她没有说关广告。 | She does not say she will turn ads off.
`,
  },
  {
    unit: 12,
    data: `
男：听说城西那个工地发现了一座古墓，考古队已经进去了。
女：对，工程只好先停下来。据说墓里有不少陶器，上面还有文字，也许能查清楚墓主人是谁。
男：那盖楼的公司岂不是要等很久？
女：没办法，文物保护是有法律规定的，发掘完了才能继续施工。
问：工地为什么停工了？
据：男的说工地“发现了一座古墓，考古队已经进去了”，女的说“工程只好先停下来”。 | He says an ancient tomb was found and archaeologists went in; she says the work had to stop.
答：发现了古墓，正在发掘
错：资金出了问题 | 对话没有说钱的问题。 | Money is never mentioned.
错：附近居民反对 | 对话没有说居民反对。 | Residents are never mentioned.
错：天气不好 | 对话没有说天气。 | Weather is never mentioned.
问：女的说陶器上的文字可能有什么用？
据：女的说陶器“上面还有文字，也许能查清楚墓主人是谁”。 | The woman says the pottery bears writing that may reveal who was buried there.
答：查清楚墓主人的身份
错：说明古墓的大小 | 她没有说古墓的大小。 | She does not mention its size.
错：证明陶器是假的 | 她没有说陶器是假的。 | She does not say they are fake.
错：告诉人们怎么施工 | 文字是古代的，跟施工没有关系。 | The writing is ancient and has nothing to do with construction.
问：女的对停工是什么态度？
据：女的说“没办法，文物保护是有法律规定的，发掘完了才能继续施工”。 | The woman says there is no choice: the law protects relics, and building resumes only after excavation.
答：认为必须依法先保护文物
错：觉得公司太吃亏了 | “岂不是要等很久”是男的替公司说的。 | "Won't they wait ages?" is the man speaking for the firm.
错：希望马上恢复施工 | 她说发掘完了才能施工，不是马上恢复。 | She says only after excavation, not at once.
错：觉得考古没有意义 | 她说要依法保护文物，是重视考古的。 | She insists on protecting relics, so she values archaeology.

女：你看历史书喜欢看正史还是野史？
男：正史当然更可靠，可野史里有很多细节和小人物的故事，读起来更有意思。只是不能全当真。
问：男的对野史是什么看法？
据：男的说野史“读起来更有意思。只是不能全当真”。 | The man says unofficial histories are more fun to read, but not to be taken wholly as true.
答：有趣，但不能完全相信
错：比正史更可靠 | 他说“正史当然更可靠”。 | He says official histories are more reliable.
错：没有任何价值 | 他说野史有意思，有价值。 | He finds them interesting, so they have value.
错：只写大人物的故事 | 他说野史里有很多小人物的故事。 | He says they hold many tales of ordinary people.
问：男的觉得正史怎么样？
据：男的说“正史当然更可靠”。 | The man says official histories are of course more reliable.
答：更可靠
错：更有意思 | 更有意思的是野史。 | It is unofficial history that is more fun.
错：细节更多 | 细节多的是野史。 | Unofficial history has more detail.
错：不能当真 | 不能全当真的是野史。 | It is unofficial history that cannot be fully trusted.

男：我最近在整理我们家的家谱，追溯到了三百多年前。
女：这么早！你是怎么查到的？
男：老家的祠堂里保存了一本旧家谱，再加上县里的一些文献记载，一点点对上的。
女：那你现在知道祖籍是哪儿了吗？
男：知道了，是从北方迁过来的，明年我打算去那边看看。
问：男的在做什么？
据：男的说“我最近在整理我们家的家谱”。 | The man says he is compiling his family's genealogy.
答：整理自己家的家谱
错：写一本历史书 | 他整理的是家谱，不是写历史书。 | He is compiling a genealogy, not writing a history book.
错：修建家里的祠堂 | 祠堂是保存旧家谱的地方，他没有修祠堂。 | The ancestral hall keeps the old record; he is not rebuilding it.
错：研究县里的历史 | 县里的文献是他查家谱用的，不是他研究的对象。 | County records are his sources, not his subject.
问：男的是根据什么查到的？
据：男的说“老家的祠堂里保存了一本旧家谱，再加上县里的一些文献记载”。 | The man says an old genealogy kept in the ancestral hall, plus county records.
答：旧家谱和县里的文献
错：老人们讲的故事 | 他没有说老人讲的故事。 | He does not mention stories from elders.
错：网上的资料 | 他没有说网上的资料。 | He does not mention online sources.
错：古墓里的铭文 | 古墓是别的对话里的，他没有说铭文。 | Tombs are not mentioned here, nor inscriptions.
问：男的明年打算做什么？
据：男的说祖籍在北方，“明年我打算去那边看看”。 | The man says his ancestral home is in the north and he plans to visit next year.
答：去祖籍所在的地方看看
错：搬回老家住 | 他说去看看，不是搬回去住。 | He says visit, not move.
错：重新修家谱 | 他正在整理家谱，没有说重新修。 | He is compiling it now, not redoing it.
错：去北方工作 | 他是去看看祖籍，不是去工作。 | He will visit the ancestral place, not work there.

女：你一个学理科的，怎么开始读老子和庄子了？
男：工作压力太大，什么都想抓在手里，结果越抓越累。读了这些书，我才明白有时候放下也是一种智慧。
问：男的从这些书里得到了什么？
据：男的说“读了这些书，我才明白有时候放下也是一种智慧”。 | The man says these books taught him that letting go can be wisdom.
答：学会了适当放下
错：找到了新的工作 | 他没有说找到新工作。 | He does not mention a new job.
错：学到了理科知识 | 老子和庄子不是理科书。 | Laozi and Zhuangzi are not science.
错：变得更加努力 | 他学会的是放下，不是更努力。 | He learned to let go, not to strive harder.
问：男的为什么开始读这些书？
据：男的说“工作压力太大，什么都想抓在手里，结果越抓越累”。 | The man says work pressure was too great and grasping at everything wore him out.
答：工作压力太大
错：老师让他读 | 对话没有说老师。 | No teacher is mentioned.
错：他是学哲学的 | 女的说他是学理科的。 | The woman says he studied science.
错：他想换工作 | 他没有说想换工作。 | He does not say he wants a new job.

男：我奶奶每年都要去寺院烧香，祈求家人平安。
女：我觉得这是老人的一种寄托，不一定是迷信，她心里踏实了，对身体也有好处。
男：我倒不反对，就是怕她一个人上山不安全，以后我陪她去。
问：女的怎么看奶奶去寺院？
据：女的说“我觉得这是老人的一种寄托，不一定是迷信”。 | The woman says it is a source of comfort for the old, not necessarily superstition.
答：是一种心理寄托
错：是完全的迷信 | 她说“不一定是迷信”。 | She says it is not necessarily superstition.
错：对身体没好处 | 她说“对身体也有好处”。 | She says it is good for her health.
错：应该马上停止 | 她认为有好处，没有说要停止。 | She sees benefits, so she does not want it stopped.
问：男的担心什么？
据：男的说“就是怕她一个人上山不安全”。 | The man says he only fears she is unsafe climbing the mountain alone.
答：奶奶一个人上山不安全
错：奶奶太迷信 | 男的说“我倒不反对”，没有说她迷信。 | He says he does not object, and never calls it superstition.
错：去寺院花钱太多 | 对话没有说钱。 | Money is never mentioned.
错：奶奶身体不好 | 他担心的是上山，没有说她身体不好。 | He worries about the climb, not her health.

女：有人说人性本善，有人说人性本恶，你同意哪种说法？
男：我觉得人生下来没有善恶，关键看后天的教育和环境。同样一个孩子，在不同的家庭长大，可能完全不一样。
女：那你更重视教育的作用了。
男：没错，所以我觉得家长的责任特别大。
问：男的的观点是什么？
据：男的说“我觉得人生下来没有善恶，关键看后天的教育和环境”。 | The man says people are born neither good nor evil; upbringing and surroundings decide.
答：善恶主要由后天决定
错：人性本来就是善的 | 他说生下来没有善恶，不是本善。 | He says neither, so not good by nature.
错：人性本来就是恶的 | 他说生下来没有善恶，不是本恶。 | He says neither, so not evil by nature.
错：教育没什么作用 | 他说关键看教育，是重视教育。 | He says education is key.
问：男的认为谁的责任特别大？
据：男的说“所以我觉得家长的责任特别大”。 | The man says parents bear a special responsibility.
答：家长
错：学校 | 他说的是家长，不是学校。 | He says parents, not schools.
错：孩子自己 | 他说的是家长，不是孩子。 | He says parents, not children.
错：社会 | 他说的是家长，不是社会。 | He says parents, not society.

男：你的小说写到哪儿了？
女：写了一半就卡住了。主人公的性格前后不一致，我得回头重新改。
男：要不先放几天，等有了新想法再写？
女：也好，有时候离开一段时间，反而看得更清楚。
问：女的的小说出了什么问题？
据：女的说“主人公的性格前后不一致，我得回头重新改”。 | The woman says the hero's character is inconsistent and she must revise.
答：主人公性格前后不一致
错：故事情节太简单 | 她没有说情节简单。 | She does not call the plot simple.
错：语言不够生动 | 她没有说语言。 | She does not mention language.
错：结局不好 | 她才写了一半，还没写到结局。 | She is only halfway, with no ending yet.
问：女的最后决定怎么做？
据：男的建议先放几天，女的说“也好”。 | The man suggests setting it aside for a few days, and she agrees.
答：先放几天再写
错：马上重新写 | 她同意先放几天，不是马上重写。 | She agrees to wait, not to rewrite now.
错：请男的帮她改 | 男的只是出了主意，没有说帮她改。 | He only suggests; he does not offer to edit.
错：放弃这部小说 | 她要放几天再写，不是放弃。 | She will return to it, not abandon it.

女：这篇文章的开头你写了三遍了，还不满意？
男：开头决定读者会不会往下读，我想第一句话就能抓住人。
问：男的为什么反复改开头？
据：男的说“开头决定读者会不会往下读，我想第一句话就能抓住人”。 | The man says the opening decides whether readers go on; he wants the first line to grip them.
答：想一开始就吸引读者
错：编辑要求他改 | 对话没有说编辑。 | No editor is mentioned.
错：开头有错字 | 他没有说有错字。 | He does not mention typos.
错：文章写得太长了 | 他改的是开头，没有说文章长。 | He revises the opening, not the length.
问：这篇文章的开头男的写了几遍？
据：女的说“这篇文章的开头你写了三遍了”。 | The woman says he has written the opening three times.
答：三遍
错：一遍 | 她说的是三遍，不是一遍。 | She says three times, not once.
错：两遍 | 她说的是三遍，不是两遍。 | She says three times, not twice.
错：五遍 | 她说的是三遍，不是五遍。 | She says three times, not five.

男：这本书我读了两遍，第一遍只看故事，第二遍才看出作者的用意。
女：好的作品都是这样，每读一遍都有新的收获。
问：女的认为好的作品有什么特点？
据：女的说“好的作品都是这样，每读一遍都有新的收获”。 | The woman says good works are like this: each reading brings something new.
答：每次读都有新收获
错：故事一定很精彩 | 她没有说故事一定精彩。 | She does not say the story must be thrilling.
错：读一遍就能看懂 | 男的读了两遍才看出用意，不是一遍就懂。 | He needed two readings, so not understood at once.
错：作者用意很明显 | 用意要第二遍才看出，不明显。 | The intent showed only on the second reading, so it is not obvious.
问：男的读第一遍时注意的是什么？
据：男的说“第一遍只看故事”。 | The man says on the first reading he followed only the story.
答：只注意故事
错：作者的用意 | 作者的用意是第二遍才看出的。 | The author's intent came on the second reading.
错：语言的特点 | 他没有说语言。 | He does not mention language.
错：作者的生平 | 他没有说作者的生平。 | He does not mention the author's life.

女：这个房间是你设计的？颜色这么简单，却一点儿也不单调。
男：我只用了白色和木头的颜色，再加一点儿绿色的植物。设计不在于东西多，而在于每样东西都放对地方。
女：怪不得看起来又干净又舒服。
问：男的的设计理念是什么？
据：男的说“设计不在于东西多，而在于每样东西都放对地方”。 | The man says design is not about many things, but about each thing in the right place.
答：东西不在多，要放对位置
错：颜色越多越好 | 他只用了白色和木头的颜色，不是越多越好。 | He used only white and wood tones.
错：一定要有很多植物 | 他只加了“一点儿”绿色植物。 | He added only a few plants.
错：房间要越大越好 | 他没有说房间大小。 | He does not mention room size.
问：女的觉得这个房间怎么样？
据：女的说颜色简单“却一点儿也不单调”，又说“看起来又干净又舒服”。 | The woman says the colours are simple yet not dull, and it looks clean and comfortable.
答：简单而舒服
错：太单调了 | 她说一点儿也不单调。 | She says it is not dull at all.
错：颜色太多 | 她说颜色这么简单。 | She says the colours are simple.
错：东西太多了 | 男的说设计不在于东西多，房间里东西不多。 | He says it is not about many things; the room is sparse.

男：这幅画看起来就是几个色块，为什么卖得这么贵？
女：艺术的价值不能光看画得像不像，它代表了一个时期的一种新的看法。
男：可我还是看不懂。
女：看不懂也没关系，你可以先感受一下颜色给你的感觉。
问：女的认为这幅画的价值在哪里？
据：女的说“它代表了一个时期的一种新的看法”。 | The woman says it represents a new way of seeing in its time.
答：代表了一种新的艺术观念
错：画得非常像 | 女的说价值不能光看画得像不像。 | She says value is not just likeness.
错：用的颜色很贵 | 她没有说颜料贵。 | She does not mention costly paint.
错：画的时间很长 | 她没有说画了多久。 | She does not mention time taken.
问：女的建议男的怎么欣赏这幅画？
据：女的说“看不懂也没关系，你可以先感受一下颜色给你的感觉”。 | The woman says it is fine not to understand; first feel what the colours do to you.
答：先感受颜色带来的感觉
错：去查画家的资料 | 她没有说查资料。 | She does not mention research.
错：请专家来讲解 | 她没有说请专家。 | She does not mention an expert.
错：多看几遍就懂了 | 她说看不懂也没关系，没有说多看就懂。 | She says not understanding is fine, not that repetition brings it.

女：楼上装修一直到晚上十点还在打电钻，我们跟他们说了好几次都没用。
男：按照规定，晚上不能施工。你可以先找物业，物业不管就向有关部门投诉。
女：要是还不行呢？
男：那就保留好证据，录下声音和时间，必要的时候可以去法院。
问：女的遇到了什么问题？
据：女的说“楼上装修一直到晚上十点还在打电钻”。 | The woman says the upstairs renovation goes on drilling until ten at night.
答：楼上晚上装修太吵
错：楼上漏水 | 她说的是噪音，不是漏水。 | She speaks of noise, not leaks.
错：物业乱收费 | 物业是男的建议去找的，没有说乱收费。 | Property management is where he suggests going; no overcharging is mentioned.
错：邻居乱停车 | 对话没有说停车。 | Parking is never mentioned.
问：男的建议的第一步是什么？
据：男的说“你可以先找物业”。 | The man says first go to property management.
答：先找物业
错：直接去法院 | 法院是“必要的时候”最后一步。 | Court is the last step, "if necessary".
错：自己上楼吵架 | 女的已经跟他们说了好几次，男的没有让她去吵。 | She has already told them several times, and he does not suggest a row.
错：搬走 | 男的没有说搬走。 | He does not suggest moving.
问：男的说必要的时候可以怎么做？
据：男的说“保留好证据，录下声音和时间，必要的时候可以去法院”。 | The man says keep evidence, record the noise and times, and go to court if necessary.
答：带着证据去法院
错：搬到别的地方 | 他没有说搬走。 | He does not suggest moving.
错：自己去跟楼上吵 | 他让她保留证据去法院，不是去吵。 | He says keep evidence for court, not argue.
错：让物业赔钱 | 他没有说让物业赔钱。 | He does not mention compensation from management.

男：我签合同的时候没细看，现在才发现有一条对我很不利。
女：签了字就有法律效力了，以后签东西一定要一条一条看清楚，看不懂的就问。
问：男的遇到了什么麻烦？
据：男的说“现在才发现有一条对我很不利”。 | The man says he has just found a clause very much against him.
答：签了对自己不利的合同
错：合同丢了 | 合同还在，他刚看出问题。 | He has the contract; he just found the problem.
错：对方不肯签合同 | 合同已经签了。 | The contract is already signed.
错：合同上没有他的名字 | 他签了字，上面有他的名字。 | He signed it, so his name is on it.
问：女的提醒男的以后要怎么做？
据：女的说“以后签东西一定要一条一条看清楚，看不懂的就问”。 | The woman says in future he must read every clause and ask about anything unclear.
答：签字前看清每一条
错：不要再签合同 | 她说签之前看清楚，不是不再签。 | She says read before signing, not never sign.
错：请别人代签 | 她没有说请别人代签。 | She does not suggest someone else sign.
错：签完再看 | 签了字就有效了，所以要签之前看。 | Signing makes it binding, so reading must come first.

女：最近出口的订单少了很多，好几家工厂都在减产。
男：一方面是国外需求下降，另一方面是我们的成本越来越高，价格上没有优势了。
女：那企业该怎么办？
男：光靠便宜是走不远的，得在品牌和技术上下功夫。
问：出口订单为什么减少了？
据：男的说“一方面是国外需求下降，另一方面是我们的成本越来越高”。 | The man says foreign demand fell and their costs keep rising.
答：国外需求下降，成本上升
错：工厂不愿意生产 | 工厂减产是订单少的结果，不是原因。 | Factories cutting output is the result, not the cause.
错：产品质量出了问题 | 对话没有说质量问题。 | Quality is never mentioned.
错：国外价格太高 | 是我们的成本高，价格没有优势，不是国外价格高。 | Their own costs are high, so their prices lose the edge; foreign prices are not the issue.
问：男的认为企业应该怎么做？
据：男的说“光靠便宜是走不远的，得在品牌和技术上下功夫”。 | The man says cheapness alone will not last; they must invest in brands and technology.
答：发展品牌和技术
错：继续降低价格 | 他说光靠便宜走不远。 | He says cheapness alone fails.
错：只做国内市场 | 他没有说只做国内。 | He does not say stay domestic.
错：减少工人 | 他没有说减少工人。 | He does not mention cutting staff.

男：这家店的东西一年涨了三次价，顾客还越来越多。
女：人家的东西确实做得好，大家愿意为质量多花钱。
问：女的认为顾客为什么还越来越多？
据：女的说“人家的东西确实做得好，大家愿意为质量多花钱”。 | The woman says their goods are truly good, and people will pay more for quality.
答：东西质量好
错：价格一直很便宜 | 店里一年涨了三次价，不便宜。 | They raised prices three times, so not cheap.
错：店的位置好 | 她没有说位置。 | She does not mention location.
错：广告做得多 | 她没有说广告。 | She does not mention advertising.
问：这家店一年涨了几次价？
据：男的说“这家店的东西一年涨了三次价”。 | The man says this shop raised prices three times in a year.
答：三次
错：一次 | 他说的是三次，不是一次。 | He says three, not one.
错：两次 | 他说的是三次，不是两次。 | He says three, not two.
错：没有涨价 | 他说涨了三次价。 | He says they raised them three times.
`,
  },
];
