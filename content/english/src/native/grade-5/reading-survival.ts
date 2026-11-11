// Grade 5: the reading unit of the ninth theme, stories of survival, in which young people face danger in the wild and
// choose what to do.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "./reading-kit.ts";

const wildWords = { topic: "words-of-wilderness-survival", weight: 0.3 } as const;
const seaWords = { topic: "words-of-ships-and-the-sea", weight: 0.3 } as const;
const courageWords = { topic: "words-for-courage-and-fear", weight: 0.3 } as const;
const choiceWords = { topic: "words-for-choices-and-consequences", weight: 0.3 } as const;
const challenges = { topic: "how-characters-face-challenges", weight: 0.2 } as const;
const characters = { topic: "comparing-two-characters", weight: 0.2 } as const;
const genre = { topic: "comparing-stories-of-one-genre", weight: 0.2 } as const;

/** storiesOfSurvival is a reading unit of grade 5 of short stories of young people surviving in the wild. */
export const storiesOfSurvival: ReadingUnitDef = {
  id: "stories-of-survival",
  title: t("Stories of Survival", "求生故事"),
  passages: [
    passage(
      "lost-on-the-ridge",
      t("Lost on the Ridge", "迷失在山脊上"),
      `The fog came in so fast that Owen did not notice until the trail markers disappeared. One moment he could see the next red post on the ridge ahead of him; the next, there was only gray.

He had stopped to take a photo of a hawk, and the rest of the hiking group had gone on without him. He called out. Nobody answered.

His first thought was to run, to hurry along the ridge until he caught up. His legs were already moving when he remembered what the guide had said that morning: "If you're ever lost, stop. Panic makes people walk in circles, or off cliffs."

Owen made himself stand still. He took three slow breaths. Then he thought.

He knew the group was ahead of him on the trail. He knew the trail followed the top of the ridge. He couldn't see the posts, but he could feel the path, hard and smooth under his boots, unlike the rough rocks on either side.

He pulled his jacket tight, blew three sharp blasts on the whistle clipped to his pack, and waited. He blew again every few minutes.

After a quarter of an hour, three whistle blasts answered from the fog ahead. Soon the guide's orange jacket appeared out of the gray.`,
      [wildWords, challenges],
      [
        ask(
          t("What was Owen's first impulse when he realized he was lost?", "欧文发现自己迷路时，第一个冲动是什么？"),
          t("To run along the ridge to catch up", "沿着山脊跑去追上大家"),
          [
            t("To sit down and cry for help", "坐下来哭着求救"),
            t("To go back to take another photo", "回去再拍一张照片"),
            t("To climb down off the ridge", "从山脊上爬下去"),
          ],
          t(
            "The story says his first thought was to run and hurry along the ridge, and his legs were already moving.",
            "故事说他的第一个念头是跑，赶紧沿着山脊追上去，腿已经迈开了。",
          ),
        ),
        ask(
          t("What made Owen change his mind?", "是什么让欧文改变了主意？"),
          t("He remembered the guide's advice to stop", "他想起了向导“停下来”的建议"),
          [
            t("He saw the next red trail post", "他看到了下一根红色路标"),
            t("He heard the group calling his name", "他听到大家在喊他的名字"),
            t("The fog suddenly lifted from the ridge", "雾突然从山脊上散去"),
          ],
          t(
            "He remembered the guide saying that if you are lost you should stop, because panic makes people walk in circles or off cliffs.",
            "他想起向导说过，迷路时要停下来，因为惊慌会让人绕圈子或走下悬崖。",
          ),
        ),
        ask(
          t("What does Owen's way of facing the problem show about him?", "欧文面对问题的方式说明了他是怎样的人？"),
          t("He can calm himself and think before acting", "他能让自己冷静下来，先思考再行动"),
          [
            t("He is careless and easily distracted", "他粗心大意，容易分心"),
            t("He prefers to be alone in the mountains", "他喜欢独自待在山里"),
            t("He does not trust the guide at all", "他根本不信任向导"),
          ],
          t(
            "Owen stood still, took three slow breaths, worked out what he knew and signaled with his whistle, showing calm thinking under pressure.",
            "欧文站住不动，慢慢吸了三口气，理清自己知道的情况，再吹哨求救，表现出在压力下冷静思考的能力。",
          ),
        ),
      ],
    ),
    passage(
      "the-flood-night",
      t("The Flood Night", "洪水之夜"),
      `It had rained for four days when the river finally came over its banks. Lena woke at midnight to the sound of water slapping against the house.

She switched on her flashlight. Water was already creeping under the bedroom door.

"Mom!" she shouted. Her mother was working the night shift at the hospital. Only Lena and her little brother, Tomas, were home, with their grandmother, who could not walk far.

Lena's heart pounded, but she forced herself to remember the family's flood plan, which they had practiced in the spring. First, go up, not out. The water outside could be deeper and faster than it looked.

She woke Tomas and helped Grandma up the narrow stairs to the attic, one slow step at a time. Then she went back down twice, wading through water up to her knees, to bring the emergency bag from the hall closet and Grandma's medicine from the kitchen.

In the attic, Lena called the emergency number and gave their address. She switched the flashlight on and off at the little window so rescuers could find them.

Near dawn, a boat with two firefighters pulled up beside the house. Tomas waved. Grandma took Lena's hand and squeezed it hard. "You remembered everything," she said.`,
      [courageWords, choiceWords],
      [
        ask(
          t('Why did the family plan say "go up, not out"?', '家庭应急计划为什么说 "go up, not out"？'),
          t("Water outside could be deeper and faster than it looked", "外面的水可能比看上去更深更急"),
          [
            t("The attic had the best view of the river", "阁楼能最清楚地看到河"),
            t("Grandma liked to sleep in the attic", "奶奶喜欢睡在阁楼里"),
            t("The front door was locked from outside", "前门从外面锁上了"),
          ],
          t(
            "The story gives the reason right after the rule: the water outside could be deeper and faster than it looked.",
            "故事在这条规则后面马上给出了理由：外面的水可能比看上去更深更急。",
          ),
        ),
        ask(
          t("Why did Lena go back downstairs twice?", "莉娜为什么两次下楼？"),
          t("To fetch the emergency bag and Grandma's medicine", "去拿应急包和奶奶的药"),
          [
            t("To look for her mother", "去找她的妈妈"),
            t("To turn off the lights in the hall", "去关掉走廊的灯"),
            t("To see how deep the river was", "去看河水有多深"),
          ],
          t(
            "She waded back down to bring the emergency bag from the hall closet and Grandma's medicine from the kitchen.",
            "她蹚水下楼，从走廊壁橱拿来应急包，又从厨房拿来奶奶的药。",
          ),
        ),
        ask(
          t("What result of Lena's choices does the ending show?", "结尾展现了莉娜的选择带来了什么结果？"),
          t("Rescuers found the family safe in the attic", "救援人员在阁楼找到了平安的一家人"),
          [
            t("The family had to swim to the hospital", "一家人只好游到医院"),
            t("The water never reached the house", "水根本没有进屋"),
            t("Tomas called the firefighters himself", "托马斯自己给消防员打了电话"),
          ],
          t(
            "Because Lena called for help and signaled with the flashlight, the boat found them at dawn, all safe.",
            "因为莉娜打电话求救并用手电发信号，船在黎明时找到了他们，全家平安。",
          ),
        ),
      ],
    ),
    passage(
      "three-days-on-the-island",
      t("Three Days on the Island", "岛上三天"),
      `When the storm finally passed, Kai and his older cousin Malia stood on a beach they had never seen before. Their small sailboat lay on its side in the sand, its mast snapped in two. The radio was soaked and silent.

Malia, who was fifteen, wanted to start walking at once to look for people. Kai, who was eleven, wanted to wait by the boat. They argued until Malia stopped and laughed.

"We're both right," she said. "We'll explore, but we'll always come back here. Searchers will look for the boat first."

They made a list in the sand. Water came first. They followed a line of green plants inland and found a small stream. Shelter came second. They dragged the torn sail between two palm trees to make a roof. Signal came third. On the open beach, they spelled out SOS in big letters with driftwood and dark stones, so it could be seen from above.

On the first night, Kai could not sleep. Every noise in the trees made him jump. Malia told him stories until he dozed off.

On the third morning, a low hum grew louder in the sky. A small plane circled twice over the giant letters, then dipped its wings.

Kai jumped up and down in the sand, waving both arms. "They saw it!"`,
      [seaWords, characters],
      [
        ask(
          t("How did Kai and Malia settle their argument?", "凯和玛丽亚是怎样解决争执的？"),
          t("They agreed to explore but always come back to the boat", "他们决定去探索，但总要回到船边"),
          [
            t("Malia went alone while Kai stayed", "玛丽亚独自去了，凯留了下来"),
            t("They both stayed and did nothing", "他们都留下来，什么也不做"),
            t("Kai gave up and followed Malia inland", "凯让了步，跟着玛丽亚去了内陆"),
          ],
          t(
            "Malia said they were both right: they would explore but always return, because searchers would look for the boat first.",
            "玛丽亚说两人都对：他们去探索，但总要回来，因为搜救人员会先找船。",
          ),
        ),
        ask(
          t("Why did they spell SOS on the open beach?", "他们为什么在开阔的海滩上拼出 SOS？"),
          t("So it could be seen from the air", "这样从空中就能看到"),
          [
            t("So they could find the stream again", "这样能再找到小溪"),
            t("To hold the sail down in the wind", "在风中压住船帆"),
            t("To keep Kai busy at night", "让凯晚上有事做"),
          ],
          t(
            "The story says they made the letters big, with driftwood and dark stones, so they could be seen from above.",
            "故事说，他们用浮木和深色石头拼出大大的字母，这样从空中就能看到。",
          ),
        ),
        ask(
          t("How are the two cousins different?", "这对表兄妹有什么不同？"),
          t("Malia is older and calmer, while Kai is more easily scared", "玛丽亚年龄大、更镇定，凯更容易害怕"),
          [
            t("Kai is braver, while Malia is afraid of the dark", "凯更勇敢，玛丽亚怕黑"),
            t("Malia wants to wait, while Kai wants to explore", "玛丽亚想等待，凯想去探索"),
            t("Kai can sail, while Malia has never been on a boat", "凯会驾船，玛丽亚从没上过船"),
          ],
          t(
            "Malia, fifteen, finds a way to end the argument and tells stories to calm Kai, who jumps at every noise. Kai, not Malia, wanted to wait.",
            "十五岁的玛丽亚想办法化解争执，还讲故事安抚一听到声响就吓一跳的凯。想留下等待的是凯，不是玛丽亚。",
          ),
        ),
      ],
    ),
    passage(
      "whiteout",
      t("Whiteout", "白茫茫"),
      `The snow began as soft flakes, pretty in the light of the afternoon. Within an hour, Anya could not see the tips of her own skis.

She and her father had been skiing the trail between two mountain huts, a route they had done many times. Now the wind drove the snow sideways, and the whole world turned white: the ground, the sky, the air between. There was no up or down, no near or far.

"Whiteout," her father shouted over the wind. "We stop here."

Anya wanted to keep going. The hut was only two kilometers away. But her father shook his head. "In a whiteout, you can ski right off an edge and never see it."

They dug into a deep snowbank with their small shovels, making a cave just big enough for the two of them. Inside, out of the wind, it was strangely quiet. Snow, Anya's father explained, is full of trapped air, so it keeps heat in, like a blanket. They sat on their backpacks, not on the snow, and shared chocolate and warm tea from a flask.

Anya was scared, but she kept her fear to herself and helped keep the entrance clear.

By morning, the storm was over. The sky was blue, and the hut was in plain sight.`,
      [wildWords, courageWords],
      [
        ask(
          t("What is a whiteout, as the story describes it?", "根据故事的描述，什么是白茫茫天气？"),
          t("Snow and wind so thick that everything looks white and shapeless", "风雪大得一切都变成白色、看不出形状"),
          [
            t("A trail that has been freshly covered in snow", "刚被雪覆盖的小路"),
            t("A cave dug into a deep snowbank", "在深雪堆中挖出的洞"),
            t("A hut painted white for the winter", "为过冬漆成白色的小屋"),
          ],
          t(
            "The second paragraph says the whole world turned white, with no up or down and no near or far.",
            "第二段说，整个世界变成了白色，分不清上下，也分不清远近。",
          ),
        ),
        ask(
          t("Why did they make a cave in the snow?", "他们为什么在雪里挖洞？"),
          t("Snow keeps heat in, and the cave shut out the wind", "雪能保温，雪洞也能挡风"),
          [
            t("They wanted to hide their skis", "他们想把滑雪板藏起来"),
            t("They were looking for the buried hut", "他们在找被雪埋住的小屋"),
            t("They needed snow to melt for tea", "他们需要融雪泡茶"),
          ],
          t(
            "Inside the cave it was out of the wind, and the father explains that snow full of trapped air keeps heat in like a blanket.",
            "雪洞里没有风，父亲解释说，充满空气的雪能像毯子一样保温。",
          ),
        ),
        ask(
          t("Why was stopping the right choice, as the ending shows?", "结尾怎样说明停下来是正确的选择？"),
          t("In the morning they could see the hut and travel safely", "早上他们能看见小屋，安全地前进"),
          [
            t("The hut had been destroyed by the storm", "小屋被暴风雪摧毁了"),
            t("They had already reached the hut by night", "他们晚上就已经到了小屋"),
            t("The trail was gone, so they skied home", "小路没了，所以他们滑回了家"),
          ],
          t(
            "By morning the storm was over and the hut was in plain sight, so waiting let them reach it without the danger of skiing off an edge.",
            "到了早上暴风雪停了，小屋清晰可见，所以等待让他们避开了滑下悬崖的危险，安全抵达。",
          ),
        ),
      ],
    ),
    passage(
      "the-broken-canoe",
      t("The Broken Canoe", "破了的独木舟"),
      `The canoe hit the rock with a crack that Jonah felt through his whole body. A moment later, cold water was pouring in through a split in the bottom.

"Paddle for shore!" shouted his sister, Ruth.

They reached a gravel bar in the middle of the river just as the canoe filled. They dragged it onto the stones and sat down, shivering. Their campsite was eight kilometers downstream. The sun would set in three hours.

Jonah wanted to leave the canoe and walk. But the riverbank on both sides was thick forest and steep rock, with no trail. Ruth looked at the crack. It was as long as her hand.

"We can fix this," she said. "Maybe not well, but well enough."

From the repair kit, they took a roll of duct tape. They dried the bottom of the canoe with a spare shirt, because tape won't stick to wet wood. Then they pressed strip after strip across the crack, inside and outside, pushing out every bubble.

They pushed off carefully. A little water seeped in, and Jonah scooped it out with a cup the whole way. Neither of them spoke much.

The canoe was barely floating when they reached the campsite, but they made it just as the sky turned orange.`,
      [choiceWords, challenges],
      [
        ask(
          t("Why didn't they leave the canoe and walk?", "他们为什么不丢下独木舟步行？"),
          t("The banks were thick forest and steep rock, with no trail", "两岸是密林和陡峭的岩石，没有路"),
          [
            t("Ruth was too tired to walk", "露丝太累了，走不动"),
            t("The campsite was just across the river", "营地就在河对岸"),
            t("They had to return the canoe that day", "他们当天必须还独木舟"),
          ],
          t(
            "The story says the riverbank on both sides was thick forest and steep rock, with no trail, so walking was not a real choice.",
            "故事说两岸都是密林和陡峭的岩石，没有路，所以步行行不通。",
          ),
        ),
        ask(
          t("Why did they dry the canoe before taping it?", "他们为什么在贴胶带之前先把独木舟擦干？"),
          t("Tape won't stick to wet wood", "胶带粘不住湿木头"),
          [
            t("The water made the canoe too heavy", "水让独木舟太重"),
            t("A wet canoe is too cold to sit in", "湿的独木舟坐着太冷"),
            t("Their spare shirt needed washing", "他们的备用衬衫需要洗"),
          ],
          t(
            "The story gives the reason directly: they dried it because tape won't stick to wet wood.",
            "故事直接给出了理由：他们擦干它，因为胶带粘不住湿木头。",
          ),
        ),
        ask(
          t('What does Ruth mean by "Maybe not well, but well enough"?', '露丝说 "Maybe not well, but well enough" 是什么意思？'),
          t("The repair need not be perfect, only good enough to reach camp", "修补不必完美，只要够撑到营地就行"),
          [
            t("The canoe will be as good as new", "独木舟会像新的一样"),
            t("They should not try to fix it at all", "他们根本不该去修"),
            t("Jonah did a poor job of paddling", "乔纳划桨划得很差"),
          ],
          t(
            "A taped canoe still leaked, and Jonah had to scoop water, but it got them to the campsite: well enough, if not well.",
            "贴了胶带的独木舟仍然漏水，乔纳得一路舀水，但它把他们送到了营地：不算好，但够用了。",
          ),
        ),
      ],
    ),
    passage(
      "the-desert-detour",
      t("The Desert Detour", "沙漠绕道"),
      `"It's a shortcut," said Uncle Faisal, turning the truck off the paved road onto a dirt track. "It will save us an hour."

Zara looked at the map on her phone. The track wound across the desert toward the mountains, and there was no signal.

For forty minutes, everything was fine. Then the truck sank into soft sand with a groan, and the wheels spun uselessly. Uncle Faisal tried to drive forward, then backward, and only dug the wheels deeper.

It was early afternoon, and the heat pressed down like a weight. Uncle Faisal wanted to walk back to the road for help. Zara remembered something from a book she had read about desert safety: stay with the vehicle. A truck is much easier to spot than a person, and it gives shade.

"Please," she said. "Let's stay."

He looked at the shimmering track behind them, then at her, and nodded.

They rigged a blanket from the side of the truck to make shade, and they rationed the water: small sips, never gulps. As the sun went down, they let some air out of the tires, which made them wider and better at gripping the sand. They laid the floor mats under the wheels.

In the cool of the evening, Uncle Faisal drove forward slowly, and the truck crawled out.`,
      [choiceWords, wildWords],
      [
        ask(
          t("Why did Zara want to stay with the truck?", "扎拉为什么想留在车边？"),
          t("A truck is easier to spot and gives shade", "卡车更容易被发现，还能遮阴"),
          [
            t("She was too tired to walk anywhere", "她累得哪儿也走不动"),
            t("Her phone showed help was coming", "她的手机显示救援就要到了"),
            t("The road was in the other direction", "公路在另一个方向"),
          ],
          t(
            "Zara remembered that a vehicle is much easier to spot than a person and gives shade. Her phone had no signal.",
            "扎拉记得，车比人容易被发现，还能遮阴。她的手机没有信号。",
          ),
        ),
        ask(
          t("Why did they let some air out of the tires?", "他们为什么给轮胎放掉一些气？"),
          t("Wider tires grip the sand better", "更宽的轮胎抓沙更牢"),
          [
            t("The tires had grown too hot", "轮胎太烫了"),
            t("They needed air to cool the truck", "他们需要空气来给车降温"),
            t("It made the truck lighter to push", "这样推车更轻"),
          ],
          t(
            "The story says letting air out made the tires wider and better at gripping the sand.",
            "故事说，放气让轮胎变宽，能更好地抓住沙子。",
          ),
        ),
        ask(
          t("What decision at the start caused the trouble?", "开头的什么决定引来了麻烦？"),
          t("Uncle Faisal taking a dirt shortcut across the desert", "费萨尔叔叔抄近路走沙漠土路"),
          [
            t("Zara reading a book about the desert", "扎拉读了一本关于沙漠的书"),
            t("Driving in the cool of the evening", "在傍晚凉快时开车"),
            t("Laying the floor mats under the wheels", "把脚垫铺在车轮下"),
          ],
          t(
            "The first line shows Uncle Faisal leaving the paved road for a shortcut; on the dirt track, the truck sank into soft sand.",
            "第一句写费萨尔叔叔离开公路抄近路；在土路上，卡车陷进了软沙。",
          ),
        ),
      ],
    ),
    passage(
      "adrift",
      t("Adrift", "漂流"),
      `Mei had only meant to float on the inflatable raft near the beach for a few minutes. But when she opened her eyes after a short doze, the beach was a thin line far away, and the raft was moving steadily out to sea.

Her first instinct was to paddle straight back toward the shore with her hands. She paddled until her arms burned, and the beach got no closer. A current was pulling her out, and it was stronger than she was.

Then she remembered the lifeguard's talk at school. If a current pulls you out, don't fight it head-on. Move sideways, parallel to the shore, until you are out of it. Most currents are narrow.

Mei turned the raft and paddled along the coast instead. It was slow, and she wanted to cry, but she kept going, counting her strokes to stay calm: one hundred, then rest, then one hundred more.

After a while, she noticed the water around her had changed. The little waves were now rolling toward the beach instead of away. She was out of the current.

She waved both arms over her head, the signal for help the lifeguard had taught. On the tower, a figure in red stood up, grabbed a rescue board and ran toward the water.`,
      [seaWords, courageWords],
      [
        ask(
          t("Why did paddling straight toward shore not work?", "为什么直接划向岸边没有用？"),
          t("The current pulling her out was stronger than she was", "把她往外拉的水流比她的力气大"),
          [
            t("The raft had a hole in it", "筏子上有个洞"),
            t("She was paddling in the wrong direction", "她划错了方向"),
            t("The beach was moving away from her", "海滩在离她远去"),
          ],
          t(
            "The story says a current was pulling her out, and it was stronger than she was, so the beach got no closer.",
            "故事说，一股水流在把她往外拉，而且比她的力气大，所以海滩没有变近。",
          ),
        ),
        ask(
          t("What did Mei do to stay calm?", "梅做了什么让自己保持冷静？"),
          t("She counted her strokes, a hundred at a time", "她数着划水的次数，一次一百下"),
          [
            t("She closed her eyes and fell asleep", "她闭上眼睛睡着了"),
            t("She sang the lifeguard's song", "她唱救生员教的歌"),
            t("She stopped paddling and waited", "她停止划水，等待着"),
          ],
          t(
            "She counted her strokes to stay calm: one hundred, then rest, then one hundred more.",
            "她数着划水的次数来保持冷静：一百下，休息，再一百下。",
          ),
        ),
        ask(
          t("How did Mei know she was out of the current?", "梅怎么知道自己已经脱离了水流？"),
          t("The waves were rolling toward the beach instead of away", "波浪变成朝海滩而不是背离海滩涌去"),
          [
            t("The lifeguard told her through a loudspeaker", "救生员用喇叭告诉了她"),
            t("The raft stopped moving completely", "筏子完全停住了"),
            t("She could touch the sandy bottom", "她能踩到沙底了"),
          ],
          t(
            "She noticed the little waves were now rolling toward the beach instead of away, a sign she had left the current.",
            "她发现小浪现在朝海滩涌去而不是往外，这说明她已经离开了水流。",
          ),
        ),
      ],
    ),
    passage(
      "a-night-in-the-cave",
      t("A Night in the Cave", "洞中一夜"),
      `The cave was supposed to be a short adventure: one hour in, one hour out, with Ms. Adeyemi's science club. But on the way back, the narrow tunnel they had crawled through was full of muddy water. Heavy rain outside had flooded it.

"Nobody goes into that water," said Ms. Adeyemi firmly. "We wait until it drains. We are dry, we have light and we have each other."

There were six students. Lucas wanted to try swimming through anyway. Amara was so frightened that she could hardly breathe.

Ms. Adeyemi gave everyone a job. Lucas, who had wanted action, was put in charge of the flashlights. To save batteries, only one light would be on at a time, and he kept a schedule. Amara counted the snacks and water and divided them into portions for the night. The others found a dry ledge and spread out the emergency blankets.

Keeping busy helped. So did the stories Ms. Adeyemi told in the dark and the jokes Lucas made.

They had left a note at the park office, saying where they had gone and when they would be back. When they didn't return, rangers came. At six in the morning, the water had dropped, and a ranger's voice echoed down the tunnel: "Anyone in there?"

"Six students and a teacher," Amara called back, "and all fine."`,
      [courageWords, genre],
      [
        ask(
          t("Why did Ms. Adeyemi give everyone a job?", "阿德耶米老师为什么给每个人安排了任务？"),
          t("Keeping busy helped them stay calm", "让大家忙起来有助于保持冷静"),
          [
            t("She needed help swimming through the tunnel", "她需要帮助游过隧道"),
            t("The rangers had told her to", "护林员要她这样做"),
            t("She wanted to find out who was strongest", "她想看看谁最强壮"),
          ],
          t(
            'Lucas wanted action and Amara was frightened; the story says "Keeping busy helped."',
            '卢卡斯想行动，阿玛拉很害怕；故事说 "Keeping busy helped"。',
          ),
        ),
        ask(
          t("Why did the rangers come looking for the group?", "护林员为什么来找这群人？"),
          t("The group had left a note saying when they would return", "他们留了字条，写明何时回来"),
          [
            t("Lucas swam out and fetched them", "卢卡斯游出去叫来了他们"),
            t("Amara called them on her phone", "阿玛拉用手机给他们打了电话"),
            t("They heard the jokes from outside", "他们在外面听到了笑话"),
          ],
          t(
            "The note at the park office said where they had gone and when they would be back, so the rangers knew to come when they didn't return.",
            "公园办公室的字条写明了他们去了哪里、什么时候回来，所以他们没回来时护林员知道要来找。",
          ),
        ),
        ask(
          t("How is this story like the one about the whiteout?", "这个故事和白茫茫天气的故事有什么相似之处？"),
          t("The safest choice is to stop and wait rather than push on", "最安全的选择是停下等待，而不是硬闯"),
          [
            t("The characters dig a cave in the snow", "人物在雪里挖了个洞"),
            t("A boat rescues the characters at dawn", "黎明时一条船救了人物"),
            t("The characters are lost on a mountain ridge", "人物在山脊上迷了路"),
          ],
          t(
            "In both stories a grown-up refuses to push on through danger, and the group waits, safe, until conditions improve by morning.",
            "两个故事里都有大人拒绝冒险前进，大家安全地等到早上情况好转。",
          ),
        ),
      ],
    ),
  ],
};
