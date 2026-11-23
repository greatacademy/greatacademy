// The clues of the gap sentences of the level 4 words (docs/chinese-curriculum.md §6), written by hand a sentence at a
// time: what in the sentence decides its word, in Chinese and in English. A word of the batch that could also fill a
// sentence is kept apart from its word in the word data.

import { parseClues } from "../words/clues.ts";

/** levelFourClues are the clues of the gap sentences of the level 4 words, by clueKey, each word's sentence counted as 1. */
export const levelFourClues = parseClues(`
治疗/1 | 医生要花两个月让病好起来 | The doctor needs two months to make the illness better, so the word must mean to treat.
患者/1 | 医生每天看的五十多个人 | A doctor sees more than fifty of them a day, so the word must mean patient.
诊断/1 | 医生检查以后说出他得了什么病 | After the examination the doctor names his illness, so the word must mean to diagnose.
门诊/1 | 病不重，不用住院，在医院看一下 | The illness is mild and needs only a visit to the hospital, so the word must mean outpatient department.
急诊/1 | 半夜病得很急，只好去医院 | He is in sudden pain in the middle of the night, so the word must mean emergency room.
诊所/1 | 楼下开的一家看病的小地方 | A small place to see a doctor opened downstairs, so the word must mean clinic.
护士/1 | 给病人打针的人 | This person gave the patient an injection, so the word must mean nurse.
打针/1 | 孩子怕疼，不想让医生给他扎针 | The child fears the pain of a needle, so the word must mean to have an injection.
治病/1 | 医生的工作是让病人好起来 | Making the sick well is a doctor's work, so the word must mean to cure illnesses.
医疗/1 | 城市有很多大医院，看病的条件好 | The city has many big hospitals, so the word must mean medical care.
疼痛/1 | 药能让病人不那么疼 | The medicine makes the patient hurt less, so the word must mean pain.
头痛/1 | 没睡好，脑袋不舒服 | He slept badly and his head aches, so the word must mean headache.
痛苦/1 | 病人很难受，一晚上没睡着 | The patient suffers so much he cannot sleep all night, so the word must mean suffering.
血压/1 | 医生量了一下，有点儿高 | The doctor measured it and found it a little high, so the word must mean blood pressure.
高血压/1 | 爷爷有这个病，要少吃肉、多运动 | Grandpa has this illness and must eat less meat and exercise more, so the word must mean high blood pressure.
出血/1 | 手被刀划了一下 | His hand was cut by a knife, so the word must mean to bleed.
血管/1 | 血在里面流动 | Blood flows inside it, so the word must mean blood vessel.
心痛/1 | 看到孩子病成这样，妈妈心里难过 | Seeing her child so ill, the mother aches inside, so the word must mean to feel sorry for.
胃痛/1 | 吃了太多冰的东西，肚子疼得睡不着 | Too much ice-cold food keeps him awake with pain, so the word must mean stomachache.
抽血/1 | 体检时要这样做，早上别吃东西 | It is done at a check-up and needs an empty stomach, so the word must mean to draw blood.
呼吸/1 | 山上空气好，吸进去很舒服 | The mountain air is good to take in, so the word must mean to breathe.
吸烟/1 | 医院里请不要这样做 | This is not allowed in a hospital, so the word must mean to smoke.
吸收/1 | 喝水帮助身体把营养留下来 | Water helps the body take in nutrients, so the word must mean to absorb.
胃口/1 | 生病了，什么都不想吃 | He is ill and wants nothing to eat, so the word must mean appetite.
胃病/1 | 吃饭不准时得了这个病 | Eating at irregular times gave him this illness, so the word must mean stomach trouble.
骨头/1 | 狗最喜欢吃的东西 | It is a dog's favourite thing to chew, so the word must mean bone.
骨折/1 | 踢球时腿受伤了，医生说的结果 | The doctor's verdict on his injured leg, so the word must mean fracture.
压力/1 | 快要考试了，心里很紧张 | The exam is near and he feels the strain, so the word must mean pressure, stress.
心跳/1 | 跑了半小时，心脏跳得很快 | After running for half an hour his heart races, so the word must mean heartbeat.
皮肤/1 | 夏天太阳大，要保护身体的外面 | The summer sun is strong and the body's surface needs protecting, so the word must mean skin.
恢复/1 | 身体好了，下星期能上班 | He is well again and back at work next week, so the word must mean to recover.
受伤/1 | 打篮球的时候身体出了问题 | Something happened to his body while playing basketball, so the word must mean to get hurt.
难受/1 | 感冒了，全身都不舒服 | A cold makes his whole body feel bad, so the word must mean to feel unwell.
活动/1 | 坐了一上午，起来动一动 | After sitting all morning one should get up and move, so the word must mean to exercise, to move about.
生活/1 | 退休以后每天过得很简单 | After retiring Grandpa lives simply, so the word must mean life.
弱/1 | 病了很久，身体没有力气 | After a long illness his body has no strength, so the word must mean weak.
开始/1 | 电影七点放，我们快走 | The film starts at seven and we must hurry, so the word must mean to begin.
睡眠/1 | 每天要有八个小时 | Eight hours of it a day keep the body well, so the word must mean sleep.
维生素/1 | 水果里有很多 | Fruit is full of it, so the word must mean vitamin.
养病/1 | 在家休息一个月，让病好起来 | He stays home for a month to get well, so the word must mean to recuperate.
发炎/1 | 伤口红了肿了，要马上去医院 | The wound is inflamed and needs the hospital at once, so the word must mean to become inflamed.
病毒/1 | 传得很快，很多人都病了 | It spreads fast and makes many people ill, so the word must mean virus.
消毒/1 | 碗筷要先这样处理再给病人用 | The bowls must be made germ-free before the patient uses them, so the word must mean to disinfect.
中毒/1 | 吃了坏了的鱼 | He ate fish that had gone bad, so the word must mean to be poisoned.
有毒/1 | 这些花千万别吃 | These flowers must never be eaten, so the word must mean poisonous.
感染/1 | 伤口被细菌弄坏了，一直不好 | Germs got into the wound and it will not heal, so the word must mean to infect.
传染/1 | 感冒会传给别人，最好在家 | A cold passes to others, so it is best to stay home, so the word must mean to be contagious.
预防/1 | 多运动，病就不容易来 | Exercise keeps many illnesses away, so the word must mean to prevent.
疫苗/1 | 孩子出生以后要打很多次 | A baby gets many shots of it, so the word must mean vaccine.
抗生素/1 | 感冒不用吃的一种药 | It is a medicine a cold does not need, so the word must mean antibiotic.
过敏/1 | 一到春天看到花就不舒服 | Flowers make me ill every spring, so the word must mean to be allergic.
敏感/1 | 皮肤很容易出问题，不能用这个牌子 | Her skin reacts easily to this brand, so the word must mean sensitive.
皮/1 | 吃苹果前要不要去掉外面那层 | One asks whether to remove the apple's outer layer, so the word must mean peel, skin.
吃素/1 | 十年来从来不吃肉 | He has eaten no meat for ten years, so the word must mean to be vegetarian.
素菜/1 | 两个肉菜以外的另一个菜 | It is the one dish besides the two meat dishes, so the word must mean vegetable dish.
原始/1 | 森林还是最早的样子 | The forest is still as it first was, so the word must mean primeval, original.
免疫力/1 | 经常运动，很少感冒 | He exercises and rarely catches a cold, so the word must mean immunity.
防疫/1 | 学校做好了工作，没有人得病 | The school's work kept everyone from falling ill, so the word must mean epidemic prevention.
疫情/1 | 那年发生了，很多人只能在家上班 | That year many people had to work from home, so the word must mean epidemic.
毒品/1 | 吸了对身体伤害非常大 | Taking it does great harm to the body, so the word must mean drugs.
住院/1 | 病很重，要在医院住两个星期 | The illness is serious and he must stay two weeks, so the word must mean to be in hospital.
出院/1 | 病好了，明天离开医院 | He is well and leaves the hospital tomorrow, so the word must mean to leave hospital.
病房/1 | 他住在三楼的房间里 | He stays in a room on the third floor of the hospital, so the word must mean ward.
病情/1 | 医生说他已经好多了 | The doctor says he is much better, so the word must mean state of an illness.
大夫/1 | 这位看病很认真 | This person examines patients carefully, so the word must mean doctor.
内科/1 | 胃不舒服去医院的这个科 | He went to this department for his stomach, so the word must mean internal medicine.
外科/1 | 做手术的人住在这个科的病房 | Patients having an operation stay in its ward, so the word must mean surgery.
牙科/1 | 牙疼要去的地方 | A toothache sends me there, so the word must mean dentistry.
药方/1 | 医生开给他的 | The doctor wrote it out for him, so the word must mean prescription.
中药/1 | 奶奶不喜欢西药，喜欢喝这种 | Grandma prefers it to Western medicine, so the word must mean Chinese medicine.
体温/1 | 护士量了，三十八度 | The nurse measured it at thirty-eight degrees, so the word must mean body temperature.
体力/1 | 爬山要身体有力气 | Climbing a mountain takes physical strength, so the word must mean stamina.
活力/1 | 城市很年轻，很有生气 | The city is young and lively, so the word must mean vitality.
养生/1 | 爷爷很懂，每天早睡早起 | Grandpa knows how to keep healthy, so the word must mean to look after one's health.
快活/1 | 孩子们在公园里玩得很开心 | The children play happily in the park, so the word must mean happy, merry.
受不了/1 | 天太热了，我忍不住了 | It is too hot to bear, so the word must mean cannot stand.
接受/1 | 听了医生的意见，开始运动 | He took the doctor's advice and began to exercise, so the word must mean to accept.
感受/1 | 说说第一次出国心里觉得怎么样 | Tell us how your first trip abroad felt, so the word must mean feeling, impression.
受到/1 | 作品得到了大家的欢迎 | His work was welcomed by everyone, so the word must mean to receive.
不断/1 | 一直努力，终于成功 | He kept on working hard and succeeded at last, so the word must mean continuously.
判断/1 | 看出他说的是不是真话 | Can you tell whether he is telling the truth, so the word must mean to judge.
打断/1 | 别人说话时不要插进去 | Do not cut in while others are speaking, so the word must mean to interrupt.
中断/1 | 下大雨，比赛停了一个小时 | Heavy rain stopped the match for an hour, so the word must mean to be suspended.
断/1 | 腿伤得很重，要休息三个月 | His leg is so badly hurt it needs three months, so the word must mean broken.
活/1 | 鱼还没死，快放回水里 | The fish is not dead yet, so the word must mean alive.
苗条/1 | 每天运动，身材很好看 | She exercises daily and has a slim figure, so the word must mean slender.
血/1 | 天太干，鼻子流出来的东西 | The dry air makes it run from his nose, so the word must mean blood.
痛/1 | 头不舒服，想休息一下 | My head hurts and I want to rest, so the word must mean to ache.
压/1 | 小心，别让鸡蛋被重东西弄坏 | Careful not to crush the eggs, so the word must mean to press.
吸/1 | 跳进水里以前用力吸进一口气 | He drew in a breath before diving, so the word must mean to inhale.
航班/1 | 晚上八点起飞的 | It takes off at eight in the evening, so the word must mean flight.
航空/1 | 他在这种公司工作，经常坐飞机 | He works for this kind of company and flies often, so the word must mean aviation.
航线/1 | 公司新开了一条去南方的 | The company opened a new one to the south, so the word must mean air route.
机舱/1 | 飞机起飞了，里面很安静 | Once the plane took off, it was quiet inside, so the word must mean cabin.
托运/1 | 箱子太大，不能带上飞机 | The case is too big to carry on board, so the word must mean to check in luggage.
延误/1 | 下大雪，航班不能准时 | Heavy snow made the flights late, so the word must mean to be delayed.
抵达/1 | 飞机下午三点到北京 | The plane reaches Beijing at three, so the word must mean to arrive.
靠窗/1 | 想要一个能看外面的座位 | I want a seat with a view outside, so the word must mean by the window.
随身/1 | 小包可以带在身上上飞机 | The small bag can go on board with you, so the word must mean carried on one's person.
驾驶/1 | 他会开飞机 | He can fly a plane, so the word must mean to pilot, to drive.
驾照/1 | 刚拿到，还不敢上高速 | He just got it and dares not take the motorway yet, so the word must mean driving licence.
拐弯/1 | 路口往左走 | Turn left at the crossing, so the word must mean to turn a corner.
轮胎/1 | 车上坏了要换新的 | The car needs a new one, so the word must mean tyre.
轮子/1 | 箱子下面有四个，拉起来方便 | The case has four of them and is easy to pull, so the word must mean wheel.
弯/1 | 路不直，开车要小心 | The road is not straight, so the word must mean winding.
靠边/1 | 前面有警察，让车停到路旁 | The police ahead want the car pulled over, so the word must mean to pull over.
距离/1 | 家和公司之间走路十分钟 | Home and office are ten minutes apart, so the word must mean distance.
自驾/1 | 自己开车去海边，不坐火车 | We drive ourselves to the coast, so the word must mean to drive oneself.
方向/1 | 不知道哪边是北 | I cannot tell which way is north, so the word must mean direction.
列车/1 | 开往上海的那辆 | It is bound for Shanghai, so the word must mean train.
轮船/1 | 坐它去小岛 | We take it to the island, so the word must mean ship.
港口/1 | 城市有一个很大的，每天来往的船很多 | The city has a big one with many ships each day, so the word must mean port.
码头/1 | 船到了，大家都下船 | The boat has docked and everyone gets off, so the word must mean pier.
船舱/1 | 外面风大，回船里面去 | It is windy outside, let us go back inside the boat, so the word must mean cabin of a ship.
取票/1 | 网上买了票，要先去车站拿 | The ticket was bought online and must be collected at the station, so the word must mean to collect tickets.
往返/1 | 去北京再回来一次要八个小时 | There and back takes eight hours, so the word must mean round trip.
长途/1 | 坐了十个小时的汽车 | He rode the bus for ten hours, so the word must mean long-distance.
沿途/1 | 路上的风景很美 | The scenery along the way is lovely, so the word must mean along the way.
桥/1 | 河上有一座，过了河是我家 | It crosses the river to my home, so the word must mean bridge.
迷路/1 | 城市太大，第一次来找不到路 | The city is so big that I got lost, so the word must mean to lose one's way.
路途/1 | 很远，早点儿出发 | The journey is long, so set off early, so the word must mean journey.
途中/1 | 回家的路上遇到老朋友 | On the way home he met an old friend, so the word must mean on the way.
向导/1 | 山里路难走，请了一个带路的人 | We hired someone to lead us on the mountain paths, so the word must mean guide.
向/1 | 一直往前走就能看到车站 | Walk straight ahead and you will see the station, so the word must mean towards.
拐/1 | 到了第二个路口往右 | Go right at the second crossing, so the word must mean to turn.
靠近/1 | 酒店离火车站很近 | The hotel is close to the station, so the word must mean near.
到达/1 | 路上堵车，十点才到酒店 | Traffic held us up until ten, so the word must mean to reach.
达到/1 | 工厂生产了一万件 | The factory's output reached ten thousand, so the word must mean to reach a level.
随时/1 | 有问题什么时候都可以打电话 | Call me whenever you have a question, so the word must mean at any time.
岛/1 | 海上的小地方，住着几户人家 | A small piece of land out at sea has a few families living on it, so the word must mean island.
大陆/1 | 从岛上坐船一小时到 | The place is reached from the island in an hour by boat, so the word must mean mainland.
陆地/1 | 地球上的海比它大得多 | The seas are much larger than it, so the word must mean land.
沿海/1 | 上海这样靠海的城市 | Shanghai is given as one of these cities by the sea, so the word must mean coastal.
省/1 | 中国有很多个，我从南方的一个来 | China has many of them, so the word must mean province.
州/1 | 美国有五十个 | The United States has fifty of them, so the word must mean state.
沿着/1 | 顺着这条河一直走 | Follow this river all the way, so the word must mean along.
省钱/1 | 坐火车比坐飞机花得少 | The train costs less than flying, so the word must mean to save money.
民宿/1 | 没住酒店，住在人家开的地方 | We stayed in a home run by a family, not a hotel, so the word must mean guesthouse.
住宿/1 | 吃饭以外，住的地方也便宜 | Besides food, the place to stay was cheap, so the word must mean accommodation.
兑换/1 | 出国前去银行换美元 | Before going abroad I got dollars at the bank, so the word must mean to exchange.
取/1 | 去银行拿点儿钱 | I am going to the bank for some cash, so the word must mean to withdraw.
取消/1 | 天气不好，航班不飞了 | Bad weather stopped the flight from going, so the word must mean to cancel.
随便/1 | 想吃什么就点什么 | Order whatever you like, so the word must mean as you like.
随着/1 | 经济发展了，出国的人多了 | As the economy grew, more people travelled, so the word must mean along with.
靠/1 | 在窗户上倚着睡着了 | He fell asleep leaning on the window, so the word must mean to lean.
托/1 | 请朋友帮我带茶回来 | I asked a friend to bring tea back for me, so the word must mean to ask a favour.
弯路/1 | 有了地图就不会多走路 | With a map we will not take the long way, so the word must mean detour.
旅途/1 | 祝你旅行的路上快乐 | Have a good trip, so the word must mean journey.
列/1 | 把要带的东西写出来 | Write out what to take, so the word must mean to list.
轮流/1 | 两个人一个接一个开车 | The two of us take turns at the wheel, so the word must mean to take turns.
驾驶员/1 | 开飞机的人说还有半小时到 | The one flying the plane announced half an hour to go, so the word must mean pilot.
着陆/1 | 飞机安全到了地面 | The plane touched down safely, so the word must mean to land.
延长/1 | 玩得开心，想多玩三天 | We want three more days of travel, so the word must mean to extend.
延期/1 | 下雨，比赛改到以后 | Rain put the match off, so the word must mean to postpone.
单程/1 | 买的票不回来 | It is a ticket with no return, so the word must mean one-way.
一路/1 | 太累了，路上都在睡觉 | He slept the whole way, so the word must mean all the way.
航行/1 | 大船在海上走了十天 | The ship sailed for ten days, so the word must mean to sail.
返程/1 | 星期天回来的车票 | The ticket back is for Sunday, so the word must mean return journey.
迷/1 | 每场比赛都看的球爱好者 | He watches every match, so the word must mean fan.
头等舱/1 | 很贵但很舒服 | It is costly but very comfortable, so the word must mean first class.
经济舱/1 | 为了省钱坐的 | I fly in it to save money, so the word must mean economy class.
距/1 | 这里离市中心十公里 | It is ten kilometres from the centre, so the word must mean to be distant from.
一向/1 | 他从来都很准时，今天却迟到 | He is always punctual, so lateness is odd, so the word must mean always.
外省/1 | 别的省来这个城市工作的人 | People come from other provinces to work here, so the word must mean other provinces.
驶/1 | 火车慢慢地开进车站 | The train slowly pulls in, so the word must mean to drive, to sail.
出行/1 | 节日时出门的人特别多 | Many people travel during the holidays, so the word must mean to go on a trip.
换乘/1 | 在下一站换二号线 | Change to Line 2 at the next stop, so the word must mean to transfer.
加油站/1 | 车快没油了 | The car is almost out of fuel, so the word must mean petrol station.
公路/1 | 通到海边的路 | The road leads to the sea, so the word must mean highway.
可靠/1 | 他这个人可以放心 | You can trust him, so the word must mean reliable.
达成/1 | 两家公司终于谈好合作 | The two firms finally agreed to work together, so the word must mean to reach an agreement.
迷人/1 | 风景太美了 | The scenery is enchanting, so the word must mean charming.
香港/1 | 很多高楼，晚上的灯很美 | A city of tall buildings and bright lights at night, so the word must mean Hong Kong.
向往/1 | 一直很想过海边的生活 | He has long dreamed of life by the sea, so the word must mean to yearn for.
发达/1 | 交通很好，去哪儿都方便 | Transport is excellent, so the word must mean developed.
列车员/1 | 火车上给我们送热水的人 | This person brought us hot water on the train, so the word must mean train attendant.
取得/1 | 比赛中得了第一名 | He won first place, so the word must mean to obtain.
驾车/1 | 每天自己开车上班 | He drives to work every day, so the word must mean to drive a car.
胎/1 | 自行车的没气了 | The bicycle's is flat, so the word must mean tyre.
媒体/1 | 很多报纸电视都报道了 | Many outlets reported it, so the word must mean media.
自媒体/1 | 不上班，在网上自己发内容 | He quit his job to publish online himself, so the word must mean self-media.
电视台/1 | 他在那里当记者 | He works there as a reporter, so the word must mean TV station.
主持人/1 | 节目上很会说话，大家喜欢 | The show's host speaks well, so the word must mean host.
主播/1 | 每天晚上在网上直播三小时 | She streams live three hours a night, so the word must mean streamer.
评论/1 | 很多人在视频下面写的话 | People wrote under his video, so the word must mean comment.
转发/1 | 消息被一万多人发给别人 | The post was passed on over ten thousand times, so the word must mean to share, to forward.
粉丝/1 | 歌手有很多喜欢他的人 | The singer has many of them, so the word must mean fan.
关注/1 | 在网上跟着看他每天发的视频 | Do you follow him online, so the word must mean to follow.
播出/1 | 节目每天晚上八点放 | The show airs at eight each evening, so the word must mean to broadcast.
阅读/1 | 每天晚上看一个小时书 | He reads for an hour every night, so the word must mean to read.
浏览/1 | 每天早上快快看一下新闻网站 | I skim the news site each morning, so the word must mean to browse.
浏览器/1 | 打开它才能看网页 | Open it to see the web page, so the word must mean browser.
链接/1 | 发给你，点一下就能看到 | Click what I send and you will see it, so the word must mean link.
注意/1 | 过马路要看着车 | Watch out for cars when crossing, so the word must mean to pay attention.
标题/1 | 新闻一看就想读 | The headline makes me want to read on, so the word must mean headline.
点击/1 | 按这里就能下载 | Click here to download, so the word must mean to click.
网页/1 | 打不开，再试试 | It will not load, so try again, so the word must mean web page.
资讯/1 | 软件每天送最新的 | The app sends the latest every day, so the word must mean information, news.
主页/1 | 在上面找到电话号码 | You can find our phone number on it, so the word must mean home page.
返回/1 | 旅行结束了，明天回到北京 | The trip is over and we go back to Beijing tomorrow, so the word must mean to return.
隐私/1 | 手机里有不想让别人知道的个人事情 | My phone holds my personal matters, so the word must mean privacy.
私人/1 | 只给自己用的电话，别告诉别人 | The phone is my own and not for others to know, so the word must mean private.
秘密/1 | 两个人知道、别告诉别人的事 | Only the two of us know it, so the word must mean secret.
私信/1 | 有问题在网上单独发给我 | Send me a message of your own online, so the word must mean private message.
自私/1 | 从来不帮助别人，只想着自己 | He never helps others and thinks only of himself, so the word must mean selfish.
主动/1 | 没人叫他，他自己去帮别人 | He helps others without being asked, so the word must mean on one's own initiative.
主要/1 | 问书里最重要的内容 | The question asks for the book's chief content, so the word must mean main.
主人/1 | 问这只狗是谁的 | The question asks whose dog it is, so the word must mean owner.
主意/1 | 我想到了一个好办法 | I have thought of a good plan, so the word must mean idea.
秘书/1 | 帮他安排明天的会的人 | This person arranged his meeting, so the word must mean secretary.
群/1 | 很多孩子在一起玩 | Many children are playing together, so the word must mean group, crowd.
群聊/1 | 全班有事都在里面说 | The whole class talks in it, so the word must mean group chat.
朋友圈/1 | 她在手机上发旅行照片给朋友看 | She posted travel photos for her friends, so the word must mean Moments.
圈/1 | 在公园里绕着跑了三次 | He ran three laps of the park, so the word must mean lap, circle.
晒/1 | 在网上给大家看自己做的菜 | He shows off his cooking online, so the word must mean to show off.
晒太阳/1 | 冬天老人们喜欢在外面暖和暖和 | Old people sit outside in the winter sunshine, so the word must mean to bask in the sun.
人群/1 | 人很多，她找不到孩子了 | She lost her child among many people, so the word must mean crowd.
群主/1 | 班群的管理人是班长 | The monitor runs the class group, so the word must mean group owner.
发言/1 | 开会时每个人都要说话 | Everyone must speak at the meeting, so the word must mean to speak.
留言/1 | 他不在家，我写下话给他 | He was out, so I left him a note, so the word must mean to leave a message.
谣言/1 | 网上很多，不要随便相信 | There is much of it online, do not believe it, so the word must mean rumour.
虚假/1 | 广告里有很多不是真的东西 | The advert holds many untrue things, so the word must mean false.
骗子/1 | 那个人不能相信 | That man cannot be trusted, so the word must mean cheat, swindler.
骗/1 | 我知道这不是真的 | I know it is not true, so the word must mean to deceive.
诈骗/1 | 电话说他中奖了，是假的 | A call said he had won a prize, a con, so the word must mean fraud.
造谣/1 | 在网上说假话，被警察找上门 | He spread lies online and the police came, so the word must mean to start a rumour.
编/1 | 想出一个不是真的故事骗人 | He made up a story to fool people, so the word must mean to make up.
情况/1 | 问你那边怎么样 | The question asks how things are there, so the word must mean situation.
况且/1 | 太晚了，再加上外面在下雨 | It is late and besides it is raining, so the word must mean moreover.
虚心/1 | 经常向别人学习 | He often learns from others, so the word must mean modest.
编辑/1 | 她在杂志社工作，改文章 | She works at a magazine, so the word must mean editor.
摄影/1 | 星期天经常出去拍照 | He goes out to take photos on Sundays, so the word must mean photography.
拍摄/1 | 电影是在中国拍的 | The film was shot in China, so the word must mean to film.
主题/1 | 比赛说的中心是保护环境 | The contest is about protecting nature, so the word must mean theme.
游戏/1 | 孩子们在玩 | The children are playing it, so the word must mean game.
戏/1 | 今晚去看演出 | We are going to see a play tonight, so the word must mean play, opera.
标准/1 | 他的普通话说得很对 | His Mandarin is correct, so the word must mean standard.
目标/1 | 今年想做到学会游泳 | This year I aim to learn to swim, so the word must mean goal.
主编/1 | 杂志最大的编辑是我的老师 | My teacher heads the magazine, so the word must mean chief editor.
编写/1 | 三位老师一起写的书 | Three teachers wrote the book together, so the word must mean to compile, to write.
评价/1 | 大家对饭店的看法都很高 | Everyone rates the restaurant highly, so the word must mean evaluation.
好评/1 | 网上很多人说衣服好，买的人很多 | Many buyers praise it online, so the word must mean favourable review.
差评/1 | 东西太差了，我给了一个 | The goods were bad, so I gave this, so the word must mean bad review.
批评/1 | 上课说话被老师说了 | He talked in class and the teacher told him off, so the word must mean to criticise.
转/1 | 路口向右 | Turn right at the crossing, so the word must mean to turn.
转变/1 | 他的想法变了很多 | His thinking changed a great deal, so the word must mean change.
标签/1 | 衣服上写着价钱的小纸 | The clothes carry it with the price, so the word must mean label, tag.
打击/1 | 考试没考好，对他很不好受 | Failing the exam hit him hard, so the word must mean blow, setback.
热门/1 | 今天网上最多人看的新闻 | It is the most read news online today, so the word must mean popular, hot.
话题/1 | 换一个说的事，别说工作了 | Let us talk about something besides work, so the word must mean topic.
网红/1 | 她在网上很有名 | She is famous online, so the word must mean internet celebrity.
点赞/1 | 很多人喜欢他的照片 | Many people liked his photo, so the word must mean to like.
上传/1 | 把照片放到网上 | I put the photos online, so the word must mean to upload.
刷屏/1 | 新闻今天在网上到处都是 | The news was everywhere online today, so the word must mean to flood the feed.
舞台/1 | 她站在上面唱歌 | She stands on it to sing, so the word must mean stage.
台/1 | 家里有两个电脑 | There are two computers at home, so the word must mean measure word for machines.
言论/1 | 在网上说的话也要负责 | What one says online carries responsibility, so the word must mean speech, remarks.
主观/1 | 你的看法只从自己出发 | Your view comes only from yourself, so the word must mean subjective.
电台/1 | 开车的时候听 | He listens to it while driving, so the word must mean radio station.
专注/1 | 做作业时心思不离开 | He keeps his mind on his homework, so the word must mean focused.
戏剧/1 | 大学学的，现在是演员 | He studied it and became an actor, so the word must mean drama.
传媒/1 | 她在这种公司工作 | She works for a media company, so the word must mean media.
转告/1 | 他不在，我会告诉他 | He is out and I will pass it on, so the word must mean to pass on a message.
转眼/1 | 一年很快就过去了 | A year passed in a flash, so the word must mean in the blink of an eye.
注重/1 | 公司很看重产品的质量 | The company cares about quality, so the word must mean to pay attention to.
名言/1 | 有名的作家说的一句话 | A famous writer said this sentence, so the word must mean famous saying.
预言/1 | 他事先说这个队会赢，真的赢了 | He said beforehand the team would win, so the word must mean to predict.
民主/1 | 班长是大家选的 | Everyone chose the monitor, so the word must mean democratic.
主张/1 | 我认为应该大家讨论以后再决定 | I hold that we should discuss first, so the word must mean to advocate.
评选/1 | 学校选出了十个好学生 | The school chose ten top pupils, so the word must mean to choose by appraisal.
朝代/1 | 唐朝是历史上有名的一个 | The Tang was a famous one, so the word must mean dynasty.
唐朝/1 | 李白是这个朝代的诗人 | Li Bai was a poet of this dynasty, so the word must mean Tang dynasty.
汉朝/1 | “汉族”的名字从这个朝代来 | The Han people are named after it, so the word must mean Han dynasty.
明朝/1 | 故宫是这个朝代建的 | The Forbidden City was built in it, so the word must mean Ming dynasty.
古代/1 | 很早以前，人们出门骑马 | Long ago people rode horses, so the word must mean ancient times.
现代/1 | 今天的人离不开手机 | People today cannot live without phones, so the word must mean modern.
年代/1 | 八十年那些时候的老照片 | It is an old photo from the eighties, so the word must mean decade.
时代/1 | 我们生活在网络的时期 | We live in the internet age, so the word must mean era.
皇帝/1 | 以前住在宫里的人 | He once lived in this palace, so the word must mean emperor.
皇宫/1 | 故宫以前是这样的地方 | The Forbidden City used to be one, so the word must mean imperial palace.
国王/1 | 故事说他和他的女儿 | The tale is about him and his daughter, so the word must mean king.
王子/1 | 故事里最后找到了公主的人 | He found the princess in the end, so the word must mean prince.
公主/1 | 小女孩最喜欢听她的故事 | Little girls love stories about her, so the word must mean princess.
皇后/1 | 和皇帝一起住在皇宫里 | She lived in the palace with the emperor, so the word must mean empress.
王/1 | 很久以前，他是国家的头 | Long ago he ruled the country, so the word must mean king.
帝王/1 | 古代皇帝住过的地方 | Emperors of old lived here, so the word must mean emperor, monarch.
王朝/1 | 只有三十年就没了 | It lasted only thirty years, so the word must mean dynasty.
后代/1 | 保护环境留给以后的人 | We protect the environment for those after us, so the word must mean descendants.
清朝/1 | 结束以后中国就没有皇帝了 | After it ended China had no emperor, so the word must mean Qing dynasty.
近代/1 | 中国离现在不太远的历史 | The book covers China's recent history, so the word must mean modern times.
将军/1 | 带着军队打败很多国家 | He led an army to many victories, so the word must mean general.
军队/1 | 国家有一百万人当兵 | The country has a million soldiers, so the word must mean army.
军人/1 | 爸爸当兵，很少回家 | Dad is in the forces and seldom home, so the word must mean soldier, serviceman.
士兵/1 | 一个人站在门口站岗 | One stands guard at the gate, so the word must mean soldier.
当兵/1 | 十八岁就去参军 | He joined up at eighteen, so the word must mean to serve in the army.
兵/1 | 将军带着一万个人出发 | The general set off with ten thousand of them, so the word must mean soldier.
空军/1 | 他想开飞机 | He wants to fly planes, so the word must mean air force.
海军/1 | 经常坐船出海 | He often sails out to sea, so the word must mean navy.
军事/1 | 他喜欢看这种新闻 | He likes this kind of news, so the word must mean military.
战士/1 | 年轻的人保护了国家 | The young ones defended the country, so the word must mean soldier, warrior.
胜利/1 | 打了三年仗终于赢了 | After three years of war they finally won, so the word must mean to win, victory.
失败/1 | 没成功没关系，下次再来 | Never mind not succeeding, try again, so the word must mean to fail.
打败/1 | 赢了去年的第一名 | We beat last year's champions, so the word must mean to defeat.
战胜/1 | 病没有打倒他，他回到学校 | He overcame his illness, so the word must mean to overcome.
胜/1 | 三比一赢了 | We won three to one, so the word must mean to win.
败/1 | 比赛输了，下次再来 | We lost the match, so the word must mean to lose.
胜负/1 | 输赢不重要，参加才重要 | Winning or losing matters less than taking part, so the word must mean victory or defeat.
失去/1 | 战争中没有了一条腿 | He lost a leg in the war, so the word must mean to lose.
失望/1 | 他没来，我心里不高兴 | He did not come and I was let down, so the word must mean disappointed.
失业/1 | 公司关门，很多人没工作了 | The firm closed and many lost their jobs, so the word must mean to be unemployed.
英雄/1 | 救了三个孩子 | He saved three children, so the word must mean hero.
伟大/1 | 她是一位了不起的母亲 | She is a great mother, so the word must mean great.
伟人/1 | 写进了历史的人 | He is a person in the history books, so the word must mean great man.
祖先/1 | 很早就住在这里的先人 | Our forebears lived here long ago, so the word must mean ancestors.
祖国/1 | 在国外很多年，一直想回去 | After years abroad he longs to go home, so the word must mean motherland.
祖父/1 | 我家八十岁的老人，身体很好 | My grandfather is eighty and well, so the word must mean grandfather.
祖母/1 | 很会做饭的老奶奶 | She is an old lady who cooks well, so the word must mean grandmother.
英国/1 | 他从那里来，说英语 | He comes from there and speaks English, so the word must mean Britain.
英语/1 | 除了汉语还会说的语言 | I speak it besides Chinese, so the word must mean English.
雄伟/1 | 长城非常高大 | The Great Wall is magnificent, so the word must mean grand.
遗迹/1 | 古代留下来的东西 | Ancient things remain here, so the word must mean ruins, remains.
古迹/1 | 城市有很多名胜和它 | The city has many scenic and historic sites, so the word must mean historic site.
遗产/1 | 长城是世界文化的 | The Great Wall is world cultural heritage, so the word must mean heritage.
城墙/1 | 老城六百年的墙 | The old city's wall is six hundred years old, so the word must mean city wall.
墙/1 | 地图挂在上面 | A map hangs on it, so the word must mean wall.
名胜/1 | 很多有名的地方，很多人来旅游 | Many famous sights draw tourists, so the word must mean scenic spot.
将来/1 | 以后想做什么工作 | What job do you want later on, so the word must mean future.
遗失/1 | 在火车上丢了一个包 | He left a bag on the train, so the word must mean to lose.
文明/1 | 中国有五千年的 | China has five thousand years of it, so the word must mean civilisation.
发明/1 | 纸是古代四大之一 | Paper is one of four great ones of old, so the word must mean invention.
建立/1 | 国家两百年前出现 | The country was founded two hundred years ago, so the word must mean to establish.
成立/1 | 公司有十年了 | The company was founded ten years ago, so the word must mean to found.
灭亡/1 | 国家一千年前没了 | The country fell a thousand years ago, so the word must mean to perish.
消灭/1 | 药能把病毒杀死 | The medicine kills the virus, so the word must mean to wipe out.
死亡/1 | 地震让很多人死了 | The earthquake killed many people, so the word must mean death.
立刻/1 | 听到消息马上回家 | He went home at once, so the word must mean immediately.
建设/1 | 把家乡变得更美 | We will make our hometown more beautiful, so the word must mean to build.
革命/1 | 以后国家有了新的政府 | Afterwards the country had a new government, so the word must mean revolution.
生命/1 | 医生救了他 | The doctor saved it, so the word must mean life.
命运/1 | 他相信以后会怎么样要靠自己 | He believes his fate is in his own hands, so the word must mean destiny.
之前/1 | 睡觉以前别喝咖啡 | No coffee before bed, so the word must mean before.
之后/1 | 毕业以后去北京工作 | After graduating he went to work in Beijing, so the word must mean after.
之一/1 | 世界上最有名的地方中的一个 | It is one of the world's most famous places, so the word must mean one of.
之间/1 | 我们两个人中间没有秘密 | There are no secrets between us, so the word must mean between.
此外/1 | 会说英语，还会一点儿法语 | Besides English he speaks a little French, so the word must mean besides.
因此/1 | 每天练习，所以说得很好 | He practises daily and so speaks well, so the word must mean therefore.
从此/1 | 离开家以后再也没回来 | He left home and never came back from then on, so the word must mean from then on.
如此/1 | 没想到风景这么美 | I never thought it would be so beautiful, so the word must mean so, such.
曾经/1 | 他以前在中国住过三年 | He once lived in China for three years, so the word must mean once.
与/1 | 老人和海的故事 | It is the story of the old man and the sea, so the word must mean and.
绘画/1 | 从小学，画得很好 | She has studied it since childhood and paints well, so the word must mean painting.
雕刻/1 | 石头上刻着一条龙 | A dragon is carved in the stone, so the word must mean to carve.
雕像/1 | 广场上很大的一个 | A big one stands in the square, so the word must mean statue.
墨水/1 | 笔里没有了 | My pen has run out of it, so the word must mean ink.
墨/1 | 画中国画要用笔和它 | Chinese painting needs a brush and it, so the word must mean ink.
彩色/1 | 以前黑白，现在不是 | Photos used to be black and white, so the word must mean coloured.
色彩/1 | 画的颜色很美 | The painting's colours are lovely, so the word must mean colour.
描/1 | 孩子照着画一笔一笔地画 | The child traces the picture stroke by stroke, so the word must mean to trace.
描写/1 | 小说写出了村子的生活 | The novel depicts village life, so the word must mean to describe.
漫画/1 | 孩子们都喜欢看 | Children love to read them, so the word must mean comics.
舞蹈/1 | 从小学，跳得很好 | She has danced since childhood, so the word must mean dance.
歌曲/1 | 好听，我听了很多遍 | I have listened to it many times, so the word must mean song.
曲子/1 | 他在弹一首好听的 | He is playing a lovely one, so the word must mean tune.
作曲/1 | 这首歌的音乐是他写的 | He wrote the music of this song, so the word must mean to compose.
弹/1 | 她会用手指演奏琴 | She can play the piano, so the word must mean to play a stringed instrument.
弹琴/1 | 每天练一个小时 | She practises an hour a day, so the word must mean to play the piano.
鼓/1 | 在乐队里打的 | He plays it in the band, so the word must mean drum.
乐团/1 | 一百多个人一起演奏 | It has over a hundred players, so the word must mean orchestra.
角色/1 | 她在电影里演一个老师 | She plays a teacher in the film, so the word must mean role.
主角/1 | 电影里最重要的人 | He is the film's lead, so the word must mean leading role.
欣赏/1 | 在美术馆看有名的画 | We enjoyed famous paintings at the gallery, so the word must mean to appreciate.
赏/1 | 中秋晚上一起看月亮 | We admire the moon on Mid-Autumn night, so the word must mean to admire.
精彩/1 | 比赛太好看了 | The match was thrilling, so the word must mean wonderful.
经典/1 | 看了很多遍的好电影 | I have seen this film many times, so the word must mean classic.
古典/1 | 他喜欢听的一种音乐 | He likes this kind of music, so the word must mean classical.
优雅/1 | 她走路的样子很美 | She walks gracefully, so the word must mean elegant.
有趣/1 | 故事让孩子们笑了 | The story made the children laugh, so the word must mean interesting.
趣味/1 | 书很好看，一下就看完了 | The book was so engaging I finished it at once, so the word must mean interest, delight.
兴趣/1 | 他对音乐很感 | He is keen on music, so the word must mean interest.
乐趣/1 | 画画给他带来快乐 | Painting brings him joy, so the word must mean pleasure.
创作/1 | 作家写了很多小说 | The writer has written many novels, so the word must mean to create works.
创造/1 | 人用手做出了美好的生活 | People made a good life with their hands, so the word must mean to create.
创新/1 | 公司要发展就要不断出新东西 | A firm must keep innovating to grow, so the word must mean to innovate.
灵感/1 | 旅行中想到写歌的 | He found the idea for a song while travelling, so the word must mean inspiration.
想象/1 | 想一想一百年以后的世界 | Picture the world in a hundred years, so the word must mean to imagine.
形象/1 | 演员在大家心里的样子 | How people see the actor, so the word must mean image.
印象/1 | 问你对北京的感觉 | The question asks what you think of Beijing, so the word must mean impression.
著名/1 | 他是很有名的画家 | He is a famous painter, so the word must mean famous.
名著/1 | 中国四大有名的小说之一 | It is one of China's four great novels, so the word must mean classic work.
灵活/1 | 猫一下就跳上了桌子 | The cat leapt onto the table at once, so the word must mean nimble.
精神/1 | 睡了一觉很有力气 | After a sleep he was full of energy, so the word must mean vigour, spirit.
精力/1 | 全部的力气都放在工作上 | He put all his energy into work, so the word must mean energy.
精美/1 | 书里的画很美 | The book's pictures are exquisite, so the word must mean exquisite.
神话/1 | 中国古代的故事 | It is an ancient Chinese tale, so the word must mean myth.
神/1 | 古人相信天上有 | People of old believed they lived in the sky, so the word must mean god.
味道/1 | 这个菜吃起来很好 | The dish tastes good, so the word must mean taste.
口味/1 | 有的人喜欢辣，有的人喜欢甜 | Some like it hot and some like it sweet, so the word must mean taste, preference.
浪漫/1 | 给女朋友准备了很多花 | He prepared many flowers for his girlfriend, so the word must mean romantic.
漫长/1 | 冬天很长，等着春天 | Winter is long and we wait for spring, so the word must mean very long.
美味/1 | 饭店的菜很好吃 | The restaurant's food is delicious, so the word must mean delicious.
表演/1 | 孩子们在台上给大家演节目 | The children put on a show on stage, so the word must mean to perform.
表达/1 | 用中文说出自己的想法 | He finds it hard to put his thoughts into Chinese, so the word must mean to express.
表现/1 | 他在比赛中做得很好 | He did well in the contest, so the word must mean performance.
表情/1 | 看他的脸就知道他很高兴 | His face shows he is happy, so the word must mean facial expression.
手表/1 | 戴在手上的东西慢了五分钟 | The thing on my wrist is five minutes slow, so the word must mean watch.
表/1 | 在这张纸上写名字 | Write your name on this sheet, so the word must mean form.
代表/1 | 替我们班说话的人 | He speaks for our class, so the word must mean representative.
收藏/1 | 喜欢收集老邮票 | He likes to collect old stamps, so the word must mean to collect.
藏/1 | 孩子把糖放在床下不让人看见 | The child hid the sweets under the bed, so the word must mean to hide.
团体/1 | 二十个人一起跳舞 | Twenty people dance together, so the word must mean group, organisation.
图像/1 | 电脑屏幕上的很清楚 | The picture on the screen is clear, so the word must mean image.
好像/1 | 天黑了，看起来要下雨 | It has grown dark and looks like rain, so the word must mean to seem.
像/1 | 她长得和妈妈差不多 | She looks like her mother, so the word must mean to resemble.
镜子/1 | 出门以前照一照 | She looks into it before going out, so the word must mean mirror.
镜头/1 | 电影最后一个画面很美 | The film's last shot is lovely, so the word must mean shot, lens.
眼镜/1 | 看不清黑板，要戴 | I cannot see the board and need to wear them, so the word must mean glasses.
现象/1 | 社会上很有意思的事情 | It is an interesting thing in society, so the word must mean phenomenon.
大象/1 | 鼻子很长的动物 | Its trunk is long, so the word must mean elephant.
对象/1 | 三十岁了还没有女朋友 | At thirty he still has no partner, so the word must mean partner.
图形/1 | 纸上画着三角形、正方形 | Triangles and squares are drawn on the paper, so the word must mean shape, figure.
打印/1 | 把文件从电脑里印出来 | Print out this document, so the word must mean to print.
印刷/1 | 中国古代很有名的技术 | It was a famous technique of ancient China, so the word must mean printing.
团结/1 | 同学们心在一起 | The classmates stand together, so the word must mean united.
剧团/1 | 去过很多国家演出 | It has performed in many countries, so the word must mean theatre troupe.
角度/1 | 从不同的方面看问题 | Seen from different sides, the problem has different answers, so the word must mean angle.
角/1 | 桌子的四个很硬，小孩子要小心 | The table's four of them are hard, so the word must mean corner.
曲线/1 | 纸上画了一条不直的线 | He drew a line that is not straight, so the word must mean curve.
鼓掌/1 | 表演结束了，大家站起来拍手 | When the show ended everyone rose to clap, so the word must mean to applaud.
团队/1 | 十个人一起工作 | Ten of us work together, so the word must mean team.
精心/1 | 妈妈很用心地准备了一桌菜 | Mum prepared a feast with great care, so the word must mean meticulously.
权利/1 | 每个孩子都可以上学 | Every child may go to school, so the word must mean right.
人权/1 | 国家应该保护人的权利 | Every country should protect it, so the word must mean human rights.
义务/1 | 保护环境是每个人应该做的 | Protecting nature is everyone's duty, so the word must mean duty.
正义/1 | 有这种感，经常帮助别人 | He has a sense of it and helps others, so the word must mean justice.
意义/1 | 活动让大家学到很多 | Everyone learned much, so it was worthwhile, so the word must mean meaning, significance.
主义/1 | 书讲的是社会的一种思想 | The book is about a social doctrine, so the word must mean -ism.
平等/1 | 男女有一样的机会 | Men and women have the same chances, so the word must mean equal.
公平/1 | 比赛对大家都一样，大家满意 | The contest was fair to all, so the word must mean fair.
和平/1 | 大家希望世界没有战争 | Everyone hopes for a world without war, so the word must mean peace.
自主/1 | 孩子长大了，自己选专业 | Grown up, the child chooses his own major, so the word must mean independently.
犯罪/1 | 警察打击的坏事 | The police fight it, so the word must mean crime.
罪犯/1 | 警察抓到的人 | The police caught this person, so the word must mean criminal.
犯/1 | 每个人都会做错 | Everyone makes mistakes, so the word must mean to commit.
罪/1 | 问他犯了什么 | The question asks what offence he committed, so the word must mean crime, guilt.
犯错/1 | 小孩子做错了事 | The child did something wrong, so the word must mean to make a mistake.
犯法/1 | 偷东西不合法 | Stealing breaks the law, so the word must mean to break the law.
杀/1 | 杀了一只鸡做菜 | They killed a chicken for the meal, so the word must mean to kill.
杀人/1 | 很重的罪 | It is a grave crime, so the word must mean murder.
严重/1 | 病得很重，要马上住院 | He is so ill he must go into hospital at once, so the word must mean serious.
无罪/1 | 法院判了以后他高兴地回家 | The court let him go home happy, so the word must mean not guilty.
法庭/1 | 下午要去打官司的地方 | He must appear there this afternoon, so the word must mean court.
审判/1 | 案子下个月开庭 | The case is heard next month, so the word must mean to try.
证人/1 | 看到了全部经过的人 | He saw everything that happened, so the word must mean witness.
被告/1 | 被说偷东西的人说他没偷 | The accused says he stole nothing, so the word must mean defendant.
原告/1 | 告对方拿东西不付钱的人 | This person accuses the other of not paying, so the word must mean plaintiff.
辩论/1 | 两个班就一个题目各说各的道理 | Two classes argue over a topic, so the word must mean to debate.
辩护/1 | 律师在法庭上替他说话 | The lawyer speaks for him in court, so the word must mean to defend.
某/1 | 有一天下午，没说是哪天 | The sentence speaks of one afternoon without saying which, so the word must mean a certain.
某人/1 | 一定是有一个人告诉他的 | Someone must have told him, so the word must mean someone.
案件/1 | 警察正在调查 | The police are investigating it, so the word must mean case.
小偷/1 | 拿走我钱包的人 | My wallet was taken by this person, so the word must mean thief.
偷/1 | 有人悄悄拿走了我的自行车 | Someone took my bike secretly, so the word must mean to steal.
偷偷/1 | 不让她发现地看了一眼 | He glanced at her secretly, so the word must mean stealthily.
防盗/1 | 家里装了新的门，不让小偷进 | The new door keeps thieves out, so the word must mean anti-theft.
盗版/1 | 不要买不合法印的书 | Do not buy illegal copies, so the word must mean pirated.
抢/1 | 弟弟用力拿走了我的书 | My brother snatched my book, so the word must mean to snatch.
抢劫/1 | 在银行拿钱被警察抓住 | He robbed a bank and was caught, so the word must mean to rob.
抓/1 | 警察拿住了那个小偷 | The police caught the thief, so the word must mean to catch.
抓住/1 | 不要放过这次机会 | Seize this chance, so the word must mean to seize.
被捕/1 | 罪犯昨天被警察抓了 | The criminal was caught yesterday, so the word must mean to be arrested.
赔/1 | 用坏了我的手机，要还我一个新的 | You broke my phone and must replace it, so the word must mean to compensate.
赔偿/1 | 公司给了他一万元 | The company paid him ten thousand yuan for the loss, so the word must mean compensation.
赔钱/1 | 生意没赚到，他很难过 | The business lost money, so the word must mean to lose money.
偿还/1 | 用了五年才还了银行的钱 | It took five years to pay back the bank, so the word must mean to repay.
承担/1 | 这件事的全部责任都是你的 | You must bear all the responsibility, so the word must mean to bear.
承认/1 | 他说是自己拿了书 | He owned up to taking the book, so the word must mean to admit.
继承/1 | 爸爸的公司以后归他 | He took over his father's company, so the word must mean to inherit.
承受/1 | 他扛了很大的压力 | He withstood great pressure, so the word must mean to endure.
赔礼/1 | 做错了，去给人家道歉 | You were wrong and must apologise, so the word must mean to apologise.
继父/1 | 对他很好，像亲爸爸一样 | He is like a real father to him, so the word must mean stepfather.
违反/1 | 没按学校的规定做，被批评 | He broke the school's rules, so the word must mean to violate.
违法/1 | 开车喝酒不合法 | Drink-driving is against the law, so the word must mean illegal.
违规/1 | 比赛中三次不守规则 | He broke the rules three times, so the word must mean to break the rules.
禁止/1 | 这里不能吸烟 | Smoking is not allowed here, so the word must mean to prohibit.
停止/1 | 雨不下了，我们出去 | The rain has stopped, so the word must mean to stop.
为止/1 | 到今天，已经有一百人报名 | By today a hundred had signed up, so the word must mean up to.
允许/1 | 妈妈不让我晚上出去玩 | Mum will not let me go out at night, so the word must mean to allow.
不许/1 | 上课的时候不可以玩手机 | Phones are not allowed in class, so the word must mean not allowed.
许可/1 | 没有老师同意不能进房间 | No entry without the teacher's leave, so the word must mean permission.
禁烟/1 | 饭店里不能抽烟，要到外面去 | Smokers must go outside, so the word must mean no smoking.
监狱/1 | 犯了罪被关进去的地方 | He was locked up there for his crime, so the word must mean prison.
犯人/1 | 在监狱里也要工作的人 | They must work even in prison, so the word must mean prisoner.
监视/1 | 警察在外面看着这个人 | The police are watching him from outside, so the word must mean to keep watch on.
监考/1 | 王老师管今天的考试 | Mr Wang watches over the exam, so the word must mean to invigilate.
疑问/1 | 问你还有什么不清楚的 | Do you have any questions, so the word must mean question, doubt.
可疑/1 | 那个人一直站在门口看 | That man keeps standing at the door watching, so the word must mean suspicious.
任何/1 | 不管是谁都不能进房间 | No one at all may enter, so the word must mean any.
如何/1 | 问你觉得这本书怎么样 | What do you think of the book, so the word must mean how.
为何/1 | 问他为什么不来 | Why is he not coming, so the word must mean why.
何必/1 | 这点小事，不用生气 | There is no need to get angry over this, so the word must mean why bother.
平时/1 | 他一般七点起床，今天六点 | He usually gets up at seven, so the word must mean usually.
平常/1 | 没有什么特别的事 | Nothing special happened, so the word must mean ordinary.
平安/1 | 祝你一路没有危险 | Have a safe journey, so the word must mean safe.
平静/1 | 听了消息，他的心很久不能安定 | The news left his heart unsettled for a long time, so the word must mean calm.
严格/1 | 作业错一个字都不行 | Not a single wrong character is allowed, so the word must mean strict.
水平/1 | 他的中文很高 | His Chinese is at a high level, so the word must mean level.
平方/1 | 房间二十这样的米 | The room is twenty square metres, so the word must mean square.
平板/1 | 他用它看电影 | He watches films on it, so the word must mean tablet.
严/1 | 爸爸对他管得很紧 | His father is strict with him, so the word must mean strict.
严禁/1 | 加油站里绝对不能吸烟 | Smoking is strictly forbidden at a petrol station, so the word must mean to strictly forbid.
权力/1 | 他是老板，说了算 | He is the boss and has great power, so the word must mean power.
家庭/1 | 他出生在很普通的一家 | He was born into an ordinary family, so the word must mean family.
抢救/1 | 医生正在救病人 | The doctors are fighting to save the patient, so the word must mean to rescue, to resuscitate.
有权/1 | 你可以知道真相 | You are entitled to know the truth, so the word must mean to have the right.
版权/1 | 书的这种权利是出版社的 | The publisher holds the rights to the book, so the word must mean copyright.
特权/1 | 老板的儿子在公司也没有特别的权利 | Even the boss's son has no special rights, so the word must mean privilege.
审/1 | 文件要请领导看一下 | The leader must look the document over, so the word must mean to examine.
有罪/1 | 证据说明他偷了 | The evidence shows he stole, so the word must mean guilty.
捕鱼/1 | 爷爷年轻时在海上做的事 | Grandpa did this at sea when young, so the word must mean to fish.
某些/1 | 有一些人不喜欢吃辣 | Some people dislike spicy food, so the word must mean some, certain.
贸易/1 | 两个国家之间买卖越来越多 | The two countries buy and sell more each year, so the word must mean trade.
外贸/1 | 公司常常跟外国人打交道 | His company deals with foreigners, so the word must mean foreign trade.
交易/1 | 这笔买卖让两家公司都赚钱 | The deal earned both firms money, so the word must mean deal.
进口/1 | 水果是从别的国家买进来的 | The fruit was brought in from abroad, so the word must mean to import.
买家/1 | 房子卖了很久，还没有人要买 | The house has had no buyer for a long time, so the word must mean buyer.
卖家/1 | 网上买的鞋太小，请卖东西的人换 | I asked the seller to swap the shoes, so the word must mean seller.
供应商/1 | 工厂的零件来自同一家 | The factory's parts come from one source, so the word must mean supplier.
零售/1 | 公司只把货卖给商店，不卖给个人 | The firm sells only to shops, so the word must mean retail.
汇率/1 | 一百美元能换多少人民币 | How much yuan does a hundred dollars buy, so the word must mean exchange rate.
外汇/1 | 出国前到银行换的钱 | He got foreign money at the bank before going abroad, so the word must mean foreign currency.
投资/1 | 把钱放在新公司里 | He put his money into a new company, so the word must mean to invest.
投入/1 | 为了做好事情花了很多时间和力气 | He devoted much time and effort, so the word must mean to put in.
投资者/1 | 股市下跌，亏了钱的人 | They lost money when stocks fell, so the word must mean investor.
股票/1 | 买了一些公司的 | He bought some of the company's, so the word must mean shares, stock.
股市/1 | 最近很热，很多人去买股票 | Many people are buying shares lately, so the word must mean stock market.
股东/1 | 公司每年开一次这样的大会 | The company holds this meeting yearly, so the word must mean shareholder.
股份/1 | 他在公司有百分之十 | He owns ten percent of the company, so the word must mean share, stake.
分红/1 | 公司赚了钱，过年前分给大家 | The firm shares its profit before New Year, so the word must mean to pay a dividend.
风险/1 | 买股票可能亏钱 | Buying shares can lose money, so the word must mean risk.
资本/1 | 开公司需要很多钱 | Starting a firm takes a lot of money, so the word must mean capital.
财富/1 | 健康和知识才是最宝贵的 | Health and knowledge are true riches, so the word must mean wealth.
财产/1 | 他死后都留给了女儿 | He left everything to his daughter, so the word must mean property.
发财/1 | 做生意赚了钱买大房子 | He got rich and bought a big house, so the word must mean to get rich.
理财/1 | 很会管钱，每个月都能存一些 | She manages money well and saves monthly, so the word must mean to manage finances.
贫穷/1 | 小时候家里常常吃不饱 | His family often went hungry, so the word must mean poor.
穷人/1 | 医院给没钱的人看病不要钱 | The hospital treats them for free, so the word must mean the poor.
贫富/1 | 城市里有钱人和没钱人差别大 | The gap between rich and poor is wide, so the word must mean rich and poor.
资产/1 | 公司有几千万元的 | The company is worth tens of millions, so the word must mean assets.
本钱/1 | 想开店，可是没钱，要向朋友借 | He wants to open a shop but lacks the money, so the word must mean capital.
财经/1 | 每天晚上看电视上的这种新闻 | He watches this news every evening, so the word must mean finance and economics.
借钱/1 | 没带钱包，向朋友要钱以后还 | He forgot his wallet and asked a friend for a loan, so the word must mean to borrow money.
贷款/1 | 买房子向银行申请的 | He applied to the bank for one to buy a house, so the word must mean loan.
还钱/1 | 借了我的钱，什么时候给我 | When will you pay me back, so the word must mean to pay back money.
借口/1 | 总找理由不去上课 | He always finds excuses to skip class, so the word must mean excuse.
利息/1 | 钱存在银行里每年多出一点 | Money in the bank earns a little each year, so the word must mean interest.
利率/1 | 银行提高了贷款的 | The bank raised it on loans, so the word must mean interest rate.
汇款/1 | 每个月给家里寄钱 | He sends money home every month, so the word must mean to remit money.
现金/1 | 店里不收，只能用手机付 | The shop takes only phone payment, so the word must mean cash.
金额/1 | 付款前看清楚钱数对不对 | Check the sum before paying, so the word must mean amount.
本金/1 | 借了一万，还了它和利息 | He repaid the ten thousand and the interest, so the word must mean principal.
收入/1 | 他挣的钱不多，但生活快乐 | He earns little but lives happily, so the word must mean income.
损失/1 | 大火给工厂带来很大的 | The fire cost the factory dearly, so the word must mean loss.
亏损/1 | 公司去年少了一千万元 | The company lost ten million last year, so the word must mean to make a loss.
吃亏/1 | 他太老实，做生意常常不划算 | He is too honest and often loses out, so the word must mean to lose out.
亏本/1 | 卖这么便宜，商店不会赔钱吗 | Will the shop not lose money at such prices, so the word must mean to lose money.
利润/1 | 产品赚的钱很多 | The products make good money, so the word must mean profit.
破产/1 | 亏了很多钱，公司最后没了 | The company lost so much it went under, so the word must mean to go bankrupt.
涨价/1 | 菜比上个月贵了 | Vegetables cost more than last month, so the word must mean to rise in price.
上涨/1 | 今年房价高了很多 | House prices rose a lot this year, so the word must mean to rise.
下跌/1 | 股票让很多人亏了钱 | Shares fell and many lost money, so the word must mean to fall.
竞争/1 | 两家公司都想多卖手机 | The two firms both want to sell more phones, so the word must mean to compete.
竞争力/1 | 价格太高，产品就比不过别人 | Too high a price makes the product uncompetitive, so the word must mean competitiveness.
需要/1 | 我要一台新电脑 | I need a new computer, so the word must mean to need.
需求/1 | 夏天很多人要买空调 | Many want air conditioners in summer, so the word must mean demand.
供应/1 | 工厂给全国的商店送牛奶 | The factory supplies milk to shops nationwide, so the word must mean to supply.
提供/1 | 旅馆给客人免费的早饭 | The inn gives guests a free breakfast, so the word must mean to provide.
要求/1 | 老板让我们八点到公司 | The boss told us to be in at eight, so the word must mean to require.
成本/1 | 做一个杯子只要两块钱 | A cup costs only two yuan to make, so the word must mean cost.
讨价还价/1 | 在市场买东西可以说价钱 | You can bargain at this market, so the word must mean to haggle.
供不应求/1 | 新手机卖得太好，不够卖 | The phone sells faster than it is made, so the word must mean demand exceeds supply.
金融/1 | 大学学的，现在在银行工作 | He studied it and works at a bank, so the word must mean finance.
资金/1 | 想开店，可是钱不够 | We want to open a shop but lack the money, so the word must mean funds.
奖金/1 | 过年前公司给每个人发的钱 | The firm paid everyone this before New Year, so the word must mean bonus.
金钱/1 | 健康比钱更重要 | Health matters more than it, so the word must mean money.
财务/1 | 在公司管钱的部门，每天看数字 | He works in the department of numbers, so the word must mean finance.
会计/1 | 公司里每个月算账的人 | This person does the accounts each month, so the word must mean accountant.
预算/1 | 旅行打算花五千元 | The trip is planned at five thousand yuan, so the word must mean budget.
开支/1 | 孩子上学以后花的钱多了 | Spending grew once the child started school, so the word must mean expenses.
收支/1 | 每个月记下家里进的钱和出的钱 | He records what comes in and goes out, so the word must mean income and expenditure.
支付/1 | 很多人用手机付钱 | Many pay by phone, so the word must mean to pay.
计算/1 | 算一下一共多少钱 | Work out the total, so the word must mean to calculate.
打算/1 | 问你明年想做什么 | What are your plans for next year, so the word must mean plan.
算是/1 | 一百块已经是便宜的了 | A hundred yuan counts as cheap, so the word must mean to count as.
算了/1 | 你不想去就别去了 | Forget it, do not go if you do not want to, so the word must mean forget it.
就算/1 | 明天下雨我也要去 | Even if it rains I will go, so the word must mean even if.
划算/1 | 买一送一很值 | Buy one get one free is a bargain, so the word must mean worthwhile.
总共/1 | 班里一共有三十个学生 | The class has thirty pupils altogether, so the word must mean in all.
总数/1 | 数字加起来是多少 | Add the numbers to find it, so the word must mean total.
换算/1 | 把美元算成人民币 | Convert a hundred dollars into yuan, so the word must mean to convert.
平均/1 | 全班的分数加起来再分 | The class's mark is eighty overall, so the word must mean average.
改变/1 | 那次旅行让他的一生变得不一样 | That trip changed the course of his life, so the word must mean to change.
改善/1 | 这几年生活变得更好了 | Life has got much better in recent years, so the word must mean to improve.
改革/1 | 国家正在改经济的制度 | The country is reforming its economy, so the word must mean reform.
改进/1 | 让工作的方法变得更好 | We must improve our ways of working, so the word must mean to improve.
修改/1 | 老师让我再改一下作文 | The teacher wants my essay revised, so the word must mean to revise.
改正/1 | 写错了三个字，要改对 | Three characters are wrong and must be put right, so the word must mean to correct.
改造/1 | 旧工厂变成了博物馆 | The old factory became a museum, so the word must mean to transform.
提高/1 | 让产品的质量更高 | We must raise the quality of our products, so the word must mean to raise.
提出/1 | 他在会上说出一个好办法 | He put forward a good idea at the meeting, so the word must mean to put forward.
总结/1 | 每年十二月回头看一年的工作 | Every December each department reviews its year, so the word must mean to sum up.
恨/1 | 他骗走了我所有的钱 | He swindled me of all my money, so the word must mean to hate.
恨不得/1 | 听到好消息，想马上飞回家 | He wished he could fly home at once, so the word must mean to be itching to.
怒火/1 | 孩子被打，妈妈心里的生气一下子上来 | Seeing her child hit, the mother's anger flared, so the word must mean fury.
发怒/1 | 他很安静，很少生气 | He is quiet and seldom gets angry, so the word must mean to get angry.
怒气/1 | 脸上带着生气，一句话不说 | His face showed anger and he said nothing, so the word must mean anger.
发火/1 | 别为小事生气 | Do not lose your temper over a trifle, so the word must mean to lose one's temper.
火气/1 | 年轻时很容易生气，现在好多了 | He had a quick temper when young, so the word must mean temper.
气人/1 | 他又迟到了 | He is late again, how annoying, so the word must mean annoying.
大怒/1 | 国王听了，马上把他关起来 | The king, enraged, locked him up at once, so the word must mean to fly into a rage.
气死/1 | 他又穿走了我的新衣服 | He took my new clothes again and I am furious, so the word must mean to be furious.
恐怕/1 | 天这么黑，大概要下雨 | It is so dark that rain seems likely, so the word must mean I am afraid, probably.
恐惧/1 | 很多人对死亡都害怕 | Many people fear death, so the word must mean fear.
惧怕/1 | 从小就怕黑夜，不敢一个人睡 | He has always been afraid of the dark, so the word must mean to fear.
惊恐/1 | 地震时人们害怕地跑出大楼 | People fled the building in terror during the earthquake, so the word must mean terrified.
慌/1 | 别着急，慢慢想办法 | Do not panic, let us think calmly, so the word must mean flustered.
慌张/1 | 着急地跑进教室说钱包不见了 | He rushed in flustered to say his wallet was gone, so the word must mean flustered.
惊慌/1 | 着火了，大家不要乱 | There is a fire, so do not panic, so the word must mean panicked.
心慌/1 | 第一次上台讲话，心里有点儿乱 | Speaking on stage for the first time makes me nervous, so the word must mean nervous.
恐慌/1 | 疫情刚开始，很多人抢着买米和油 | People panic-bought rice and oil, so the word must mean panic.
恐高/1 | 不敢站在十楼窗前往下看 | I dare not look down from the tenth floor, so the word must mean to be afraid of heights.
悲伤/1 | 听到爷爷去世，他非常难过 | He was deeply sad at Grandpa's death, so the word must mean sad.
悲痛/1 | 难过得说不出一句话 | He was too grief-stricken to speak, so the word must mean grief.
悲观/1 | 别总往坏处想，事情会好起来 | Do not expect the worst, so the word must mean pessimistic.
心酸/1 | 想起小时候的苦日子 | Remembering hard childhood days saddens him, so the word must mean to feel sad.
痛心/1 | 美丽的森林被大火烧了 | A fine forest burnt down, so the word must mean to be pained.
伤感/1 | 听这首老歌时有些难过 | This old song makes him a little sad, so the word must mean sentimental.
心疼/1 | 孩子病了，妈妈心里不好受 | The mother aches for her sick child, so the word must mean to feel for.
不幸/1 | 三岁时父母去世了 | His parents died when he was three, so the word must mean unfortunately.
悲剧/1 | 故事最后男女主人公都死了 | Both hero and heroine die at the end, so the word must mean tragedy.
失意/1 | 最不顺的时候，朋友陪着他 | A friend stood by him at his lowest, so the word must mean frustrated.
惊讶/1 | 他的中文这么好，大家没想到 | No one expected his Chinese to be so good, so the word must mean surprised.
吃惊/1 | 看到他瘦了这么多，说不出话 | I was speechless to see him so thin, so the word must mean surprised.
惊喜/1 | 生日那天朋友们给我的 | My friends gave me one on my birthday, so the word must mean pleasant surprise.
震惊/1 | 新闻让全世界都吃了一惊 | The news shocked the world, so the word must mean to shock.
惊人/1 | 记忆力好得让人吃惊 | His memory is astonishingly good, so the word must mean astonishing.
惊动/1 | 爷爷在睡觉，别吵他 | Grandpa is asleep, so do not disturb him, so the word must mean to disturb.
羡慕/1 | 他工作这么好，大家都想有 | Everyone wishes they had his job, so the word must mean to envy.
爱慕/1 | 她又漂亮又聪明，很多男孩喜欢她 | Many boys adore her, so the word must mean to adore.
着迷/1 | 对历史很喜欢，每天都看 | He is fascinated by history, so the word must mean to be fascinated.
心动/1 | 房子又大又便宜，我有点想买 | The house is big and cheap, and I am tempted, so the word must mean to be tempted.
寂寞/1 | 孩子们都去外地了，老人在家 | With the children away, the old couple feel lonely, so the word must mean lonely.
孤独/1 | 性格内向，从小就一个人 | Introverted, he has always been alone, so the word must mean solitary.
孤单/1 | 有你陪着我就不是一个人了 | With you by my side I am not alone, so the word must mean lonely.
单独/1 | 老师想跟你一个人谈谈 | The teacher wants to talk to you alone, so the word must mean alone, separately.
独自/1 | 一个人去了国外 | He went abroad by himself, so the word must mean alone.
独立/1 | 长大了要自己生活 | Grown children must live on their own, so the word must mean independent.
孤儿/1 | 从小没见过爸爸妈妈 | He never knew his parents, so the word must mean orphan.
独生子/1 | 家里没有哥哥也没有弟弟 | He has no brothers, so the word must mean only son.
想家/1 | 第一次离开家，晚上常常想 | Away from home for the first time, he misses it at night, so the word must mean to be homesick.
独特/1 | 她的声音一听就知道是她 | Her voice is unmistakable, so the word must mean unique.
后悔/1 | 以前没有好好学习 | I regret not studying hard, so the word must mean to regret.
反悔/1 | 已经答应了不能改 | You already agreed and cannot back out, so the word must mean to go back on one's word.
激动/1 | 见到多年不见的老朋友哭了 | Meeting an old friend moved him to tears, so the word must mean moved, excited.
兴奋/1 | 明天要去旅行，孩子们睡不着 | The trip tomorrow keeps the children awake, so the word must mean excited.
感激/1 | 你帮了我这么多 | You have helped me so much, so the word must mean grateful.
激情/1 | 他对工作很有热情 | He is passionate about his work, so the word must mean passion.
害羞/1 | 小女孩见了生人就红了脸 | The girl blushes at strangers, so the word must mean shy.
羞/1 | 被大家说得红了脸 | Everyone's teasing made him blush, so the word must mean embarrassed.
激发/1 | 书让他对历史有了兴趣 | The book sparked his interest in history, so the word must mean to arouse.
勤奋/1 | 每天都学到很晚 | He studies late every day, so the word must mean diligent.
愉快/1 | 祝你旅途开心 | Have a pleasant journey, so the word must mean pleasant.
幸福/1 | 一家人生活得很美好 | The family lives happily, so the word must mean happy.
幸运/1 | 第一次买彩票就中了大奖 | He won the lottery the first time he played, so the word must mean lucky.
幸好/1 | 你提醒了我，不然就忘了 | Luckily you reminded me, so the word must mean fortunately.
庆幸/1 | 车坏了，人没受伤 | The car broke but no one was hurt, so the word must mean to feel fortunate.
痛快/1 | 今天玩得真开心 | We had a great time today, so the word must mean to one's heart's content.
满足/1 | 对现在的生活没有更多要求 | He is content with his life, so the word must mean satisfied.
心满意足/1 | 看完好电影很满意地回家 | He went home fully satisfied, so the word must mean perfectly content.
笑容/1 | 她脸上总是带着 | Her face always wears one, so the word must mean smile.
幸福感/1 | 有了小家，他觉得更幸福 | With a home of his own he feels happier, so the word must mean sense of happiness.
热爱/1 | 每天第一个到，很爱他的工作 | He loves his job and is always first in, so the word must mean to love deeply.
喜爱/1 | 书很受孩子们的欢迎 | Children love this book, so the word must mean fondness.
心爱/1 | 自行车是他最爱的东西 | The bicycle is his treasure, so the word must mean beloved.
爱心/1 | 常常去帮助老人 | She often helps old people, so the word must mean kindness.
真心/1 | 我是诚心想帮你 | I truly want to help you, so the word must mean sincerely.
内心/1 | 表面平静，心里很着急 | Calm outside, anxious within, so the word must mean inner heart.
心事/1 | 今天一句话也不说 | You have been silent all day, so the word must mean something on one's mind.
思念/1 | 在国外非常想家乡 | Abroad he missed his hometown, so the word must mean to miss.
信任/1 | 他做事认真，老板相信他 | His boss trusts him, so the word must mean to trust.
感动/1 | 他的话打动了我 | His words touched me, so the word must mean moved.
湿润/1 | 南方的空气不像北方那么干 | The southern air is not dry like the north, so the word must mean moist.
干燥/1 | 北方冬天要多喝水 | Northern winters call for plenty of water, so the word must mean dry.
湿度/1 | 空气里水多，衣服不容易干 | Damp air keeps the washing wet, so the word must mean humidity.
雷雨/1 | 夏天下午常常又打雷又下雨 | Summer afternoons often bring thunder and rain, so the word must mean thunderstorm.
打雷/1 | 外面有很大的响声，快关窗户 | There is thunder outside, shut the window, so the word must mean to thunder.
闪电/1 | 天上一道光，接着是一声大雷 | A flash crosses the sky and a clap of thunder follows, so the word must mean lightning.
阵雨/1 | 天气预报说明天下午会下一会儿雨 | Showers are forecast for tomorrow afternoon, so the word must mean shower.
一阵/1 | 刮了一会儿大风，天就晴了 | After a gust of wind the sky cleared, so the word must mean a burst of.
雨季/1 | 每年六月到八月雨很多 | June to August is wet every year, so the word must mean rainy season.
台风/1 | 来了，学校都放假了 | Schools closed when it came, so the word must mean typhoon.
洪水/1 | 下了一星期大雨，河水漫出来 | A week of rain brought it, so the word must mean flood.
防洪/1 | 雨下个不停，大家去河边挡水 | Villagers went to the river to hold back the water, so the word must mean flood control.
干旱/1 | 夏天河里的水都干了 | The rivers ran dry this summer, so the word must mean drought.
抗旱/1 | 农民从很远的地方运水来 | Farmers carry water from afar, so the word must mean to fight drought.
雨水/1 | 今年多，水果长得特别好 | Plenty of it made the fruit grow well, so the word must mean rain.
水土/1 | 刚到南方有点不服 | He was not used to the south at first, so the word must mean climate, environment.
沙漠/1 | 很少下雨，白天热晚上冷 | It rarely rains, hot by day and cold by night, so the word must mean desert.
尘土/1 | 大风刮过，路上的都飞起来 | The wind blew it up off the road, so the word must mean dust.
土地/1 | 这里什么都能长 | Anything grows here, so the word must mean land, soil.
风力/1 | 今天有八级，别出门 | Today it is force eight, so the word must mean wind force.
寒冷/1 | 冬天常常零下二十度 | Winter often falls to twenty below, so the word must mean cold.
严寒/1 | 很冷的冬天他还去河里游泳 | Even in the bitter winter he swims in the river, so the word must mean severe cold.
寒风/1 | 外面很冷的风，大家穿大衣 | A cold wind blows, so the word must mean cold wind.
冻/1 | 天太冷，河水都成了冰 | It is so cold the river has frozen, so the word must mean to freeze.
冻结/1 | 冬天湖面结冰，人可以在上面走 | The lake freezes over in winter, so the word must mean to freeze.
冻伤/1 | 天太冷，他的手受伤了 | The cold has injured his hands, so the word must mean frostbite.
冷冻/1 | 肉放进去可以放很久 | Meat keeps long in it, so the word must mean freezing.
热带/1 | 这种水果只长在很热的地方 | This fruit grows only in hot lands, so the word must mean the tropics.
温带/1 | 中国大部分地方四季分明 | Most of China has four clear seasons, so the word must mean temperate zone.
寒带/1 | 北极一年大半时间都很冷 | The Arctic is cold most of the year, so the word must mean frigid zone.
海洋/1 | 地球上大部分是它 | Most of the earth is covered by it, so the word must mean ocean.
太平洋/1 | 世界上最大的海洋 | It is the world's largest ocean, so the word must mean Pacific Ocean.
大西洋/1 | 从英国坐船去美国要过的海洋 | One crosses it from Britain to America, so the word must mean Atlantic Ocean.
深海/1 | 海里很深的地方没有光 | There is no light down there, so the word must mean deep sea.
深度/1 | 河有五米深 | The river is five metres deep, so the word must mean depth.
深/1 | 水很深，不要下去游泳 | The water is deep, do not swim, so the word must mean deep.
海浪/1 | 风大，海上的浪很高 | The wind raises high waves, so the word must mean wave.
洋流/1 | 能把海里的东西带到很远 | It carries things far across the sea, so the word must mean ocean current.
海面/1 | 早上太阳照在海上 | The morning sun shines on the sea, so the word must mean sea surface.
半岛/1 | 城市三面都是海 | The city has sea on three sides, so the word must mean peninsula.
山峰/1 | 远处的山顶上还有白雪 | Snow still lies on the distant peaks, so the word must mean peak.
高峰/1 | 上下班时路上车最多 | The roads are busiest at rush hour, so the word must mean peak.
山谷/1 | 小河从两山中间流过 | A stream flows between the hills, so the word must mean valley.
平原/1 | 一眼望去看不到山 | No hills in sight, so the word must mean plain.
草原/1 | 上面有很多牛和羊 | Cattle and sheep graze on it, so the word must mean grassland.
高原/1 | 西藏在很高的地方，有的人去了会不舒服 | Tibet is so high some feel unwell, so the word must mean plateau.
雪山/1 | 远远看去那座山是白色的 | The distant mountain looks white, so the word must mean snow mountain.
河流/1 | 国家有很多大的河 | The country has many great rivers, so the word must mean river.
北极/1 | 很冷，住着白熊 | It is cold and home to polar bears, so the word must mean the North Pole.
南极/1 | 很少人去过，一年到头都是冰 | Few have been there and it is ice all year, so the word must mean the South Pole.
根/1 | 大树长在土里很深的部分 | The tree's go deep, so the word must mean root.
种子/1 | 春天农民放进土里 | Farmers sow them in spring, so the word must mean seed.
种植/1 | 这里的农民主要种苹果 | The farmers here mainly grow apples, so the word must mean to plant.
品种/1 | 店里的苹果有十几个 | The shop has over ten kinds of apples, so the word must mean variety.
物种/1 | 地球上很多正在消失 | Many are dying out on earth, so the word must mean species.
种/1 | 我喜欢这样的颜色 | I like this kind of colour, so the word must mean kind.
落叶/1 | 秋天地上都是 | In autumn they cover the ground, so the word must mean fallen leaves.
虫子/1 | 苹果里有一条 | There is one in the apple, so the word must mean worm, insect.
土/1 | 从地里拿了一些种花 | He took some from the field to plant flowers, so the word must mean soil.
害虫/1 | 药能杀死，保护苹果树 | The spray kills them to protect apple trees, so the word must mean pest.
碳/1 | 汽车工厂排出太多，地球变暖 | Too much of it from cars and factories warms the earth, so the word must mean carbon.
低碳/1 | 少开车多坐地铁 | Drive less and take the metro, so the word must mean low-carbon.
大自然/1 | 放假去山里走进它 | We go into the hills to be in it, so the word must mean nature.
日落/1 | 在海边看太阳下山 | We watch the sun go down by the sea, so the word must mean sunset.
落下/1 | 太阳从西边下去 | The sun goes down in the west, so the word must mean to set, to fall.
风向/1 | 变了，现在刮北风 | It has changed and now blows from the north, so the word must mean wind direction.
雷/1 | 声音很大，孩子害怕得哭了 | Its noise made the child cry, so the word must mean thunder.
闪/1 | 灯光一下就不见了 | The light flashed and was gone, so the word must mean to flash.
湿/1 | 下雨了，衣服都有水了 | The rain soaked my clothes, so the word must mean wet.
全球/1 | 天气变暖是整个世界的问题 | Warming is a problem for the whole world, so the word must mean global.
各种/1 | 公园里开着很多样的花 | All sorts of flowers bloom in the park, so the word must mean all kinds of.
各地/1 | 世界上每个地方的人都来 | People come from all over the world, so the word must mean everywhere.
深处/1 | 在森林很里面的地方住着动物 | Animals live deep in the forest, so the word must mean depths.
深夜/1 | 工作到很晚才睡 | He works till late at night, so the word must mean late at night.
角落/1 | 房间边上放着一把椅子 | A chair stands in the corner, so the word must mean corner.
落后/1 | 没有电，也没有路 | No electricity and no roads, so the word must mean backward.
根本/1 | 我完全不认识他 | I do not know him at all, so the word must mean at all.
根据/1 | 按照天气预报，明天下雪 | According to the forecast it will snow, so the word must mean according to.
另外/1 | 买了水果，还买了菜 | I bought fruit and vegetables besides, so the word must mean in addition.
进入/1 | 到了冬天，天黑得很早 | Once winter comes it gets dark early, so the word must mean to enter.
冠军/1 | 他跑得最快 | He was the fastest of all, so the word must mean champion.
亚军/1 | 只比第一名慢一点儿 | He was just behind the winner, so the word must mean runner-up.
季军/1 | 前两名以后的第三名 | It comes after the first two, so the word must mean third place.
金牌/1 | 比赛中拿了两块第一名的奖牌 | He won two of them, so the word must mean gold medal.
奖牌/1 | 中国队一共得了二十块 | China won twenty of them in all, so the word must mean medal.
领奖台/1 | 三名运动员站在上面笑 | The three winners stand on it smiling, so the word must mean podium.
纪录/1 | 打破了自己十年的 | He broke his own ten-year best, so the word must mean record.
连胜/1 | 球队一连赢了五场 | The team has won five in a row, so the word must mean winning streak.
击败/1 | 中国队二比一赢了对手 | China beat their opponents two to one, so the word must mean to defeat.
连败/1 | 一连输了五场，球迷很失望 | Five defeats in a row let the fans down, so the word must mean losing streak.
局/1 | 比赛一共打三次 | The match is played over three games, so the word must mean game, set.
平局/1 | 一比一，谁也没赢 | It ended one all, so the word must mean draw.
裁判/1 | 说这个球不算的人 | This person ruled the goal out, so the word must mean referee.
犯规/1 | 比赛中做了不允许的动作，被罚下场 | He broke the rules and was sent off, so the word must mean to foul.
罚球/1 | 对方犯规，我们得到的 | We got one when the other side fouled, so the word must mean free throw, penalty.
点球/1 | 他踢进的一个 | He scored one from the spot, so the word must mean penalty kick.
半决赛/1 | 赢了就进决赛 | Win it and you reach the final, so the word must mean semi-final.
预赛/1 | 通过了才能参加决赛 | Only those who pass it reach the final, so the word must mean preliminary round.
加时/1 | 九十分钟打平，比赛多打一会儿 | A draw after ninety minutes means extra play, so the word must mean extra time.
全场/1 | 整场比赛进了三个球 | He scored three in the whole match, so the word must mean the whole match.
进攻/1 | 我们开始往前打，进了一个球 | We went forward and scored, so the word must mean to attack.
攻击/1 | 在网上骂别人不对 | Attacking others online is wrong, so the word must mean to attack.
防守/1 | 对方一个球也没进 | The other side scored nothing, so the word must mean defence.
攻守/1 | 进攻和防守都很好，所以总赢 | The team is good in attack and defence, so the word must mean attack and defence.
射门/1 | 一脚踢向球门，球进了 | One kick and it is in, so the word must mean to shoot.
传球/1 | 他很会把球给队友 | He passes the ball well, so the word must mean to pass.
投篮/1 | 十个能进八个 | He makes eight shots out of ten, so the word must mean to shoot a basket.
球门/1 | 球打在上面没进 | The ball hit it and did not go in, so the word must mean goal.
门将/1 | 对方一个点球也没踢进 | Not one penalty got past him, so the word must mean goalkeeper.
队友/1 | 他把球传给了同一队的人 | He passed to a teammate, so the word must mean teammate.
跑步/1 | 每天早上去公园跑 | He goes running in the park each morning, so the word must mean to run, jogging.
长跑/1 | 常常一跑就是十公里 | He often runs ten kilometres at a go, so the word must mean long-distance running.
短跑/1 | 一百米的比赛 | The hundred metres is this kind of race, so the word must mean sprint.
跑道/1 | 操场上四百米的一条 | The sports ground has a four-hundred-metre one, so the word must mean track.
冲刺/1 | 离终点一百米时用全力跑 | With a hundred metres to go he made his final dash, so the word must mean to sprint.
冲/1 | 一下子跑到了最前面 | He dashed to the front, so the word must mean to rush.
起跑/1 | 比赛一开始他最快 | He was quickest off the line, so the word must mean to start a race.
脚步/1 | 门外传来走路的声音 | Footsteps sounded outside, so the word must mean footstep.
步/1 | 往前走了两下 | He took two steps forward, so the word must mean step.
热身/1 | 比赛前先活动十分钟 | Athletes warm up before the race, so the word must mean to warm up.
滑冰/1 | 湖上结了冰，孩子们在上面玩 | The children skate on the frozen lake, so the word must mean to skate.
滑雪/1 | 去山上在雪上玩 | Let us go up the mountain for the snow, so the word must mean to ski.
滑/1 | 下雪以后路面开车要小心 | The road is slippery after snow, so the word must mean slippery.
滑板/1 | 放学后在公园里玩的板子 | He rides it in the park after school, so the word must mean skateboard.
冲浪/1 | 年轻人去海边在浪上玩 | Young people ride the waves at the beach, so the word must mean to surf.
摔/1 | 滑冰时倒在地上 | He fell over while skating, so the word must mean to fall.
体操/1 | 从小练，得过很多奖 | She has trained in it since childhood, so the word must mean gymnastics.
做操/1 | 上午十点学生们在操场上一起做 | Pupils do it together at ten each morning, so the word must mean to do exercises.
操场/1 | 下课了同学们去那里玩 | The pupils play there at break, so the word must mean playground.
举重/1 | 能举起很重的东西的运动员 | He lifts very heavy things, so the word must mean weightlifting.
羽毛球/1 | 我们去打 | Let us go and play it, so the word must mean badminton.
羽毛/1 | 鸟身上的很漂亮 | The bird's are beautiful, so the word must mean feather.
毛/1 | 小猫身上白色的 | The kitten's is white, so the word must mean fur.
球拍/1 | 打球用的坏了要买新的 | His racket broke and he needs a new one, so the word must mean racket.
下棋/1 | 爷爷每天下午跟朋友在公园玩 | Grandpa plays a board game with friends every afternoon, so the word must mean to play chess.
象棋/1 | 很会下中国的这种棋 | He is good at Chinese chess, so the word must mean Chinese chess.
棋/1 | 我们来下一盘 | Let us play a game of it, so the word must mean chess.
拳击/1 | 每天练习打沙袋的运动员 | He trains on a punchbag every day, so the word must mean boxing.
太极拳/1 | 公园里很多老人在打 | Many old people practise it in the park, so the word must mean tai chi.
拳头/1 | 他生气地举起了手 | He raised his fist in anger, so the word must mean fist.
奥运会/1 | 北京在二〇〇八年办的 | Beijing hosted it in 2008, so the word must mean the Olympic Games.
世界杯/1 | 每四年一次的足球比赛 | The football event held every four years, so the word must mean World Cup.
联赛/1 | 球队在里面排第一 | The team tops it, so the word must mean league.
赛季/1 | 新的比赛时期下个月开始 | The new season starts next month, so the word must mean season.
主场/1 | 在我们这里比赛，来看的人很多 | Many came because we played at home, so the word must mean home ground.
客场/1 | 在别人那里比赛，没有很多球迷加油 | Few fans cheered us away from home, so the word must mean away ground.
体育场/1 | 能坐八万人 | It seats eighty thousand people, so the word must mean stadium.
体育馆/1 | 下雨了，去里面打篮球 | It is raining, so we play basketball indoors, so the word must mean gymnasium.
健身房/1 | 下班后去锻炼一个小时 | He works out there for an hour after work, so the word must mean gym.
球迷/1 | 每场足球比赛都看 | He watches every football match, so the word must mean fan.
强/1 | 这个队很厉害，我们很难赢 | The team is strong and hard to beat, so the word must mean strong.
强大/1 | 一个国家要发展经济 | A country must grow its economy to become powerful, so the word must mean powerful.
加强/1 | 不能再让对方进球 | We must stop them scoring again, so the word must mean to strengthen.
坚强/1 | 失败了不要哭 | Do not cry over failure, so the word must mean strong, tough.
强队/1 | 今天的对手是很厉害的队 | Today's opponents are a strong team, so the word must mean strong team.
体能/1 | 足球运动员要跑九十分钟 | Footballers run for ninety minutes, so the word must mean physical fitness.
耐力/1 | 长跑需要的 | Long-distance running needs it, so the word must mean endurance.
连续/1 | 一年接一年得冠军 | He has won three years running, so the word must mean in a row.
继续/1 | 休息以后接着练习 | After the break we carry on practising, so the word must mean to continue.
对手/1 | 比赛里跟我们比的一方很强 | The other side is strong, so the word must mean opponent.
细胞/1 | 人的身体由很多它构成 | The body is made of many of them, so the word must mean cell.
基因/1 | 孩子长得像父母的原因 | It makes children look like their parents, so the word must mean gene.
遗传/1 | 高个子是从爸爸那里来的 | He got his height from his father, so the word must mean to inherit genetically.
进化/1 | 生物在几百万年里慢慢变 | Living things changed over millions of years, so the word must mean to evolve.
基本/1 | 细胞是生命最小的单位 | The cell is life's basic unit, so the word must mean basic.
人类/1 | 只有一个地球，大家都要爱护 | We have only one earth, so the word must mean humankind.
大脑/1 | 多读书多想，让它更灵活 | Reading and thinking keep it sharp, so the word must mean brain.
神经/1 | 手上有很多，所以手很敏感 | The hand is sensitive because of them, so the word must mean nerve.
生物学/1 | 大学学的，研究植物和动物 | He studied plants and animals, so the word must mean biology.
鱼类/1 | 海里有几万种 | The sea holds tens of thousands of kinds, so the word must mean fish.
宇宙/1 | 没有人知道有多大 | No one knows how big it is, so the word must mean universe.
宇航员/1 | 从小的理想是飞上太空 | He has dreamed of going into space since childhood, so the word must mean astronaut.
太空/1 | 飞船送三个人上去 | The spaceship sent three people there, so the word must mean outer space.
星球/1 | 地球也是一个 | The earth is one too, so the word must mean celestial body.
行星/1 | 火星和地球都绕着太阳转 | Mars and the earth both orbit the sun, so the word must mean planet.
太阳系/1 | 地球是其中的一个行星 | The earth is a planet in it, so the word must mean solar system.
月球/1 | 人类一九六九年第一次登上 | People first landed on it in 1969, so the word must mean the moon.
火星/1 | 红色的，离地球不太远 | It is red and not far from the earth, so the word must mean Mars.
飞船/1 | 坐着它去太空 | They went into space in it, so the word must mean spaceship.
引力/1 | 东西都会往下落 | Things fall because of it, so the word must mean gravity.
测量/1 | 医生量了身高和体重 | The doctor measured his height and weight, so the word must mean to measure.
测试/1 | 机器做好以后先试一下 | The new machine is tried out first, so the word must mean to test.
检测/1 | 食品要检查过才能卖 | Food must be tested before sale, so the word must mean to inspect.
预测/1 | 没人能事先知道股票涨还是跌 | No one can foretell the market, so the word must mean to forecast.
显示/1 | 电脑上看得到现在下午三点 | The computer shows three o'clock, so the word must mean to display.
显微镜/1 | 用它可以看到细胞 | Cells can be seen through it, so the word must mean microscope.
望远镜/1 | 用它可以看到月球上的山 | It shows the mountains on the moon, so the word must mean telescope.
数据/1 | 这些说明药是有用的 | These figures show the medicine works, so the word must mean data.
指数/1 | 空气污染的数字很高 | The pollution reading is high, so the word must mean index.
实验室/1 | 每天在里面做实验 | He does experiments there every day, so the word must mean laboratory.
确定/1 | 不知道他明天会不会来 | I am not sure whether he will come, so the word must mean to be sure.
确实/1 | 他说的真是这样 | What he says is indeed true, so the word must mean indeed.
的确/1 | 饭馆的菜真的好吃 | The food really is good, so the word must mean really.
准确/1 | 他的发音没有错 | His pronunciation is accurate, so the word must mean accurate.
正确/1 | 选出对的答案 | Choose the right answer, so the word must mean correct.
明确/1 | 他的目标很清楚 | His goal is clear, so the word must mean clear-cut.
确认/1 | 再看一下起飞时间对不对 | Check the departure time again, so the word must mean to confirm.
显然/1 | 一句话也不说，一看就知道生气了 | His silence shows he is angry, so the word must mean obviously.
明显/1 | 吃了药，病一看就好了很多 | The medicine brought a clear improvement, so the word must mean obvious.
显得/1 | 穿上衣服看起来年轻了 | The clothes make him look younger, so the word must mean to look, to appear.
探索/1 | 科学家一直在找宇宙的秘密 | Scientists keep probing the universe's secrets, so the word must mean to explore.
探测/1 | 机器可以找到地下的水 | The machine detects water underground, so the word must mean to detect.
探讨/1 | 会上大家讨论这个问题 | Everyone discussed the issue at the meeting, so the word must mean to explore, to discuss.
探险/1 | 喜欢去沙漠里冒险 | He likes adventures in the desert, so the word must mean to explore, adventure.
引起/1 | 新发现让很多人注意 | The discovery drew much attention, so the word must mean to arouse.
吸引/1 | 风景让很多游客来 | The scenery draws many visitors, so the word must mean to attract.
引导/1 | 老师带学生自己发现问题 | The teacher guides pupils to find problems themselves, so the word must mean to guide.
理论/1 | 后来被实验证明了 | It was later proved by experiment, so the word must mean theory.
原理/1 | 机器是怎么工作的 | How the machine works, so the word must mean principle.
指出/1 | 老师说出了作文里的问题 | The teacher pointed out the problems in my essay, so the word must mean to point out.
氧气/1 | 人没有它就活不了 | People cannot live without it, so the word must mean oxygen.
缺氧/1 | 山上空气少 | The air is thin up the mountain, so the word must mean lack of oxygen.
原子/1 | 物质由很小很小的它构成 | Matter is made of these tiny things, so the word must mean atom.
分子/1 | 一个水的里面有三个原子 | One of water holds three atoms, so the word must mean molecule.
原子核/1 | 在原子的中间 | It sits at the centre of an atom, so the word must mean nucleus.
核能/1 | 国家用来发电 | The country makes electricity with it, so the word must mean nuclear energy.
元素/1 | 氧是一种化学的 | Oxygen is a chemical one, so the word must mean element.
物质/1 | 水、空气、石头都是 | Water, air and stone are all it, so the word must mean matter.
能量/1 | 吃饭给身体的 | Food gives the body it, so the word must mean energy.
二氧化碳/1 | 植物吸进它放出氧气 | Plants take it in and give out oxygen, so the word must mean carbon dioxide.
分析/1 | 看看失败的原因 | Let us examine why we failed, so the word must mean to analyse.
结构/1 | 楼建得好，地震时没坏 | The building's frame survived the earthquake, so the word must mean structure.
构成/1 | 句子由三个部分组成 | The sentence is made of three parts, so the word must mean to make up.
分类/1 | 把垃圾分开再放 | Sort the rubbish first, so the word must mean to sort.
种类/1 | 商店水果有很多样 | The shop has many kinds of fruit, so the word must mean kind, variety.
状态/1 | 今天跑得很快，身体很好 | He is in good form today, so the word must mean condition, state.
形状/1 | 石头的样子像一只鸟 | The stone is shaped like a bird, so the word must mean shape.
之类/1 | 足球、篮球这样的运动 | Football and basketball are named as examples of the sports he likes, so the word must mean and the like.
结论/1 | 做了很多次实验以后得出的 | He reached it after many experiments, so the word must mean conclusion.
公式/1 | 要记住的数学 | It is a maths one to remember, so the word must mean formula.
方式/1 | 每个人学习的办法不一样 | Everyone learns in their own way, so the word must mean way.
形式/1 | 考试要求学生做实验，很特别 | The exam takes the unusual form of an experiment, so the word must mean form.
正式/1 | 下个月真正开始上班 | He formally starts work next month, so the word must mean formal.
使用/1 | 机器很容易用 | The machine is easy to use, so the word must mean to use.
即使/1 | 下雨比赛也要进行 | The match goes on even if it rains, so the word must mean even if.
使得/1 | 新技术让生产更快 | New technology makes production faster, so the word must mean to make.
未来/1 | 以后的世界会是什么样子 | What will the world be like, so the word must mean future.
未知/1 | 科学家喜欢研究还不知道的东西 | Scientists like to study the unknown, so the word must mean unknown.
未必/1 | 贵的东西不一定好 | Dear things are not always good, so the word must mean not necessarily.
态度/1 | 他学习很认真 | He studies seriously, so the word must mean attitude.
求职/1 | 毕业后到处找工作 | He looked for work everywhere after graduating, so the word must mean to look for a job.
简历/1 | 发到公司邮箱的个人经历 | Send it to the company mailbox, so the word must mean résumé.
面试/1 | 明天去一家公司见面 | I have a job interview tomorrow, so the word must mean interview.
应聘/1 | 去公司申请当销售经理 | He applied to be sales manager, so the word must mean to apply for a job.
就业/1 | 今年大学生找到工作很难 | Graduates find jobs hard to get this year, so the word must mean employment.
岗位/1 | 在这个工作上做了十年 | He has worked at this post for ten years, so the word must mean post.
职位/1 | 公司里经理的位置还空着 | The manager's post is still vacant, so the word must mean position.
上岗/1 | 新员工先培训，然后开始工作 | New staff train first and then start work, so the word must mean to take up a post.
下岗/1 | 工厂关了，工人没工作了 | The factory closed and the workers were laid off, so the word must mean to be laid off.
人才/1 | 公司很需要这样有本领的人 | The company needs able people like this, so the word must mean talent.
薪水/1 | 挣得很多，但工作很累 | He earns well but works hard, so the word must mean salary.
月薪/1 | 这份工作每个月八千元 | The job pays eight thousand a month, so the word must mean monthly salary.
年薪/1 | 当经理以后一年挣五十万 | As manager he earns half a million a year, so the word must mean annual salary.
加薪/1 | 工作做得好，老板多给他钱 | He did well and the boss raised his pay, so the word must mean to get a raise.
带薪/1 | 公司给十天有工资的假 | The firm gives ten days of paid leave, so the word must mean paid.
福利/1 | 员工可以免费吃午饭 | Staff get free lunch, so the word must mean benefits.
雇主/1 | 雇他的人对他很好 | His employer treats him well, so the word must mean employer.
雇员/1 | 公司有三百多个 | The company has over three hundred of them, so the word must mean employee.
雇/1 | 花钱请人帮忙打扫 | They paid someone to clean, so the word must mean to hire.
工资单/1 | 发工资时公司给的一张 | The company gives one each payday, so the word must mean payslip.
培训/1 | 公司每年给员工上课 | The company trains its staff every year, so the word must mean training.
培养/1 | 父母从小让孩子有好习惯 | Parents build good habits in children, so the word must mean to cultivate.
培训班/1 | 他报名学电脑的课 | He signed up for a computer course, so the word must mean training class.
训练/1 | 运动员每天练六个小时 | Athletes train six hours a day, so the word must mean to train.
实习/1 | 大学三年级在公司工作三个月 | He interned at a firm for three months, so the word must mean to intern.
实习生/1 | 公司今年来了五个 | The company took on five of them this year, so the word must mean intern.
教训/1 | 失败让他学到了 | The failure taught him a lesson, so the word must mean lesson.
证书/1 | 学完课拿到的一张 | You get one after the course, so the word must mean certificate.
本领/1 | 他会修车 | He knows how to fix cars, so the word must mean skill.
传授/1 | 老工人把技术教给年轻人 | The old worker passed on his skill, so the word must mean to pass on, to teach.
升职/1 | 工作努力，今年当了经理 | Hard work made him manager this year, so the word must mean to be promoted.
提升/1 | 学外语让竞争力更高 | A foreign language raises your edge, so the word must mean to raise.
上升/1 | 公司的收入多了百分之二十 | Income rose by twenty percent, so the word must mean to rise.
升级/1 | 手机要换到新的版本 | My phone needs an update, so the word must mean to upgrade.
辞职/1 | 不喜欢这份工作，自己不干了 | He quit the job he disliked, so the word must mean to resign.
辞退/1 | 常常迟到，公司不要他了 | He was always late and got dismissed, so the word must mean to dismiss.
兼职/1 | 上大学时在饭馆做的工作 | He worked part-time in a restaurant at university, so the word must mean part-time job.
全职/1 | 生了孩子以后在家当妈妈 | She stays at home full-time with her child, so the word must mean full-time.
创业/1 | 毕业后自己开了一家公司 | He started his own company after graduating, so the word must mean to start a business.
退休金/1 | 爷爷每个月都有的钱 | Grandpa gets it every month, so the word must mean pension.
主管/1 | 有问题可以问管你的人 | Ask the person in charge of you, so the word must mean supervisor.
助理/1 | 帮经理安排每天的会议 | This person schedules the manager's meetings, so the word must mean assistant.
顾问/1 | 公司请来的法律方面的人 | The firm hired a legal one, so the word must mean adviser.
主任/1 | 管办公室十几个人 | He runs an office of a dozen people, so the word must mean director.
人事/1 | 请假要先找的部门 | Leave requests go to this department, so the word must mean personnel.
上司/1 | 他跟管他的人常常一起吃饭 | He gets on well with his boss, so the word must mean boss.
出差/1 | 下星期去上海工作 | He goes to Shanghai on business next week, so the word must mean to go on a business trip.
汇报/1 | 每周一向经理说工作 | Every Monday he reports to the manager, so the word must mean to report.
职工/1 | 工厂有两千名 | The factory has two thousand of them, so the word must mean staff, workers.
同行/1 | 两个人都是老师 | Both are teachers, so the word must mean people of the same trade.
工程师/1 | 大桥是他设计的 | He designed the bridge, so the word must mean engineer.
教授/1 | 北京大学的历史老师 | He teaches history at Peking University, so the word must mean professor.
理发师/1 | 头发长了要去找的人 | I need this person when my hair is long, so the word must mean barber.
公务员/1 | 考上以后在市政府工作 | He works at city hall, so the word must mean civil servant.
消防员/1 | 着火了很快就来 | They came quickly to the fire, so the word must mean firefighter.
研究员/1 | 在研究所每天做实验 | He does experiments at the institute, so the word must mean researcher.
商人/1 | 做了很多年外贸生意 | He has been in foreign trade for years, so the word must mean merchant.
店主/1 | 小店是这个老人开的 | The old man owns the little shop, so the word must mean shopkeeper.
收银员/1 | 付钱时问我要不要袋子 | At the till this person asked if I wanted a bag, so the word must mean cashier.
船长/1 | 船上的人都要听他的 | Everyone on board obeys him, so the word must mean captain.
优秀/1 | 他是一名很好的医生 | He is an excellent doctor, so the word must mean outstanding.
新秀/1 | 足球界的新人才十八岁 | He is a new talent of eighteen, so the word must mean rising star.
能干/1 | 什么事都做得很好 | She does everything well, so the word must mean capable.
特长/1 | 我会唱歌和画画 | I can sing and paint, so the word must mean special skill.
长处/1 | 每个人都有自己的它和短处 | Everyone has strengths and weaknesses, so the word must mean strength.
短处/1 | 他知道自己不好的地方，一直在改 | He knows his faults and works on them, so the word must mean weakness.
志向/1 | 从小就有远大的 | He has had high aims since childhood, so the word must mean aspiration.
前途/1 | 年轻人很努力，以后会很好 | This hard-working young man has a bright future, so the word must mean prospects.
事业/1 | 把教书当成一生的 | Teaching is his life's work, so the word must mean career.
成就/1 | 在科学上取得了很大的 | He achieved much in science, so the word must mean achievement.
`);
