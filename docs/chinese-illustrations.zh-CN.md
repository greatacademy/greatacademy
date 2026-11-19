# 语文插图

> 给用图像工具生成语文彩色插图的编码智能体的说明：HSK 5 写作试卷要求的每个故事的四幅图、每条提示词怎么写、每张图怎么检查并做出网页文件。[English](chinese-illustrations.md)。

## 1. 任务

HSK 5 写作第一部分给出四幅图，要求写一个把它们连起来的故事。主题 `hsk-5-scene-stories`（`content/chinese/src/hsk/paper.ts`）有十六道这样的题，在 `content/chinese/src/hsk/paper-data.ts` 的 `sceneStories` 里；在有图之前，每道题用文字描述它的四个场景。你的任务是：§7 列出的每道题，只要 `content/chinese/illustrations/` 里还没有它的网页文件，就画出它的四个场景，检查，做出网页文件并提交。

每道题是一张图，分成两行两列的四格，从左到右、从上到下读，和试卷印的一样。一张图能让人物、衣服和地点在各格之间保持一致，分开的四张图做不到。

图本身就是题目：看不出发生了什么，学习者就写不出故事。所以和英语插图不同，每一格都必须清楚地画出它的场景：谁在场，在做什么，有什么变化。画面里永远没有文字，所以故事里涉及名字、时间或地址的地方，画出那件东西（名片、没有数字的钟面、只有线条的快递单），由学习者自己用文字说出来。

按这个顺序做：

1. §7 里每张还没做的图，按列出的顺序：写提示词（§2），生成，审核（§5），保存并做出网页文件（§6）。
2. 一批做完后提交（§6），并向用户报告：做了哪些文件、各自多大，以及放弃了哪张图、为什么。

## 2. 写提示词

图像工具在两次调用之间没有记忆，所以每条提示词都要完整。按这个顺序拼接：

1. §3 的风格块，原样。
2. §4 的布局块，原样。
3. §7 里这道题的人物和地点，原样。
4. §7 里这道题的四格，原样。

要求横版 1536 × 1024。如果工具接受参考图，就把本批第一张通过审核的图和以后每一张一起传入，并加上：*Match the style, palette and grain of the reference image; do not reuse its people.*

不要增加或改写提示词。如果一张图反复在 §5 的同一点上不合格，可以加一句点明问题的话，例如 *The man wears the same grey jacket in all four panels.*

## 3. 风格块

```text
Modern picture-book illustration of everyday life in a Chinese city today. Flat shapes with soft edges and no outlines.
A warm, muted palette: mustard yellow, terracotta red, olive and teal green, dusty blue, warm cream and walnut brown, with deep navy for the darkest shadows.
A very fine, faint paper grain over the whole image. Soft light, clear simple backgrounds, calm and friendly mood.
Simple, rounded figures with small dot eyes and clear expressions and gestures; natural proportions.
Chinese people of different ages, shown with respect and without stereotypes.
Absolutely no text: no letters, Chinese characters, words, numbers, logos or signs with writing anywhere, including shop signs, screens, clocks, maps, labels, books and cards. Where writing would appear, use plain color blocks or simple lines.
No brands, no real people, no copyrighted characters.
```

提示词用英语写，因为图像模型最可靠地遵循英语提示词；本文档的两个版本共用它们。

## 4. 布局块

```text
One landscape image, 3:2, divided into four equal panels in a grid of two by two, separated by thin warm cream gutters, with no numbers or captions. The panels tell one story in order: top left, top right, bottom left, bottom right. The same people appear with the same faces, hair and clothes in every panel where they appear, and the place stays the same where the story stays in one place. Each panel shows its action clearly, with the people large enough to read their gestures and faces.
```

## 5. 审核

保存之前看一遍每张生成的图。有下面任何一种情况就重新生成：

- 有任何字母、汉字、数字或标志，哪怕是模糊的或编造的，格子之间的空白也算。
- 不是两行两列的四格，或者格子顺序不对。
- 某一格没有把 §7 的场景画清楚，学习者看不出里面发生了什么。
- 某个人物的脸、发型或衣服在各格之间变了。
- 手指多了或少了，脸变形，或身体角度不可能。
- 有不符合今天中国的细节，例如汽车靠左行驶，或公交车的门不在右侧。
- 有任何不安全或吓人的内容，或对某个民族、某个地方的刻板印象。
- 风格偏离本批：颜色更鲜艳、有轮廓线、有光泽感或照片感。

如果工具能编辑图片，小问题就用编辑修正，说明问题和要保留的部分。一张图试三次仍不合格就放弃，并在报告里写明。

## 6. 文件

每张图的名字是 `hsk-5-story-<NN>`，`NN` 是这道题在 `sceneStories` 里的位置，从 `01` 开始；§7 用原图的文件名列出每张图。一道题有了图以后，它的位置就不再改变：新题加在最后。

图按题目的大小显示，从不作为缩略图，所以每张图只有一个 WebP 网页文件，比英语的稍大一些，因为四格的细节更多：

| 文件 | 尺寸 | 上限 | 显示位置 |
| :--- | :--- | :--- | :--- |
| `<name>.webp` | 1200 × 800 | 120 KB | 题目上方，和页面一样宽 |

1. 把生成的原图保存为 `content/chinese/illustrations/originals/<name>.png`。Git 忽略这个文件夹；原图留在这台机器上。
2. 在仓库根目录做出网页文件，把 `<name>` 换成图的名字：

   ```bash
   mise exec -- uv run --no-project --with pillow==11.3.0 python - <name> <<'EOF'
   import os, sys
   from PIL import Image
   folder, name = "content/chinese/illustrations", sys.argv[1]
   original = Image.open(f"{folder}/originals/{name}.png").convert("RGB")
   path = f"{folder}/{name}.webp"
   image = original.resize((1200, 800), Image.Resampling.LANCZOS)
   for quality in (80, 75, 70, 65, 60):
       image.save(path, "WEBP", quality=quality, method=6)
       if os.path.getsize(path) <= 120_000:
           break
   print(f"{path}: 1200 × 800, quality {quality}, {os.path.getsize(path) // 1000} KB")
   EOF
   ```

3. 打开网页文件和原图比较。如果脸或手势模糊了，说明格子太繁杂：用更简单的背景重新生成，并在报告里说明。
4. 一批的网页文件在一个提交里提交，遵循 [AGENTS.md](../AGENTS.md)：`feat(content-chinese): pictures of the HSK 5 stories, 1 to 8`。不要提交原图。删除 `content/chinese/illustrations/` 里 `originals/` 以外留下的 PNG。

## 7. 场景

先写人物和地点，再写四格。第一批是故事 1 至 8，第二批是故事 9 至 16。

### 7.1 第一批

`hsk-5-story-01.png`

```text
People: Xiao Wang, a young office worker of about 28 with short black hair, a light blue shirt and dark grey trousers, carrying a black shoulder bag; a colleague, a woman of about 35 with a short bob, a camel coat and a dark green umbrella. Place: a modern office building in a city.
Top left: a bright sunny morning; Xiao Wang leaves his apartment building with his bag, smiling, empty-handed, a closed umbrella left standing by the door inside.
Top right: late afternoon, heavy rain pouring down; Xiao Wang stands under the entrance of the office building, frowning at the rain, no umbrella.
Bottom left: the colleague walks up and holds out her open dark green umbrella to him with a kind smile; he looks surprised.
Bottom right: the next day, a sunny office; Xiao Wang hands the folded dark green umbrella back to the colleague at her desk, together with a bag of fruit; both smile.
```

`hsk-5-story-02.png`

```text
People: Xiao Li, a young man of about 25 with short black hair, a white T-shirt and a navy jacket; the owner of the wallet, a middle-aged woman with her hair tied back and a red cardigan; a police officer in a light blue uniform shirt. Place: a city park with trees and a bench, then a small police station.
Top left: Xiao Li sits down on a park bench and notices a black wallet lying beside him.
Top right: close up, Xiao Li holds the open wallet, which shows an identity card as a plain card with a small blank photo and a few banknotes as plain colored rectangles; he looks worried.
Bottom left: the same bench at dusk, long shadows; Xiao Li still sits waiting, looking around the empty park, the wallet in his hand.
Bottom right: inside the police station, Xiao Li hands the wallet to the police officer across a counter; in a small circle in the corner, the woman speaks gratefully on her phone.
```

`hsk-5-story-03.png`

```text
People: the mother, a woman of about 45 with shoulder-length hair and a mustard sweater; the daughter, a girl of about 15 with a ponytail and a navy and white school tracksuit. Place: the family's living room and dining table, in the evening.
Top left: a table with dishes of dinner laid out; through the window it is dark; a wall clock without numbers shows its hands late; the mother sits alone at the table.
Top right: the mother rests her chin on her hand, looking sad, her phone face down on the table.
Bottom left: the front door opens; the daughter stands there smiling, holding a homemade round cake with uneven cream decoration.
Bottom right: a small scene in a friend's kitchen, earlier: the daughter and another girl in aprons, with flour on their hands, decorating the same cake.
```

`hsk-5-story-04.png`

```text
People: an old man of about 75 with white hair, a grey padded jacket and a flat cap, holding a folded paper map; Xiao Zhang, a student of about 17 with short black hair, a school uniform jacket in white and blue, and a backpack. Place: a busy street corner in a city, a school and a hospital beside it.
Top left: the old man stands at a street corner, holding the map close to his face, turning it and looking around, confused.
Top right: Xiao Zhang walks up to him and bends a little, asking politely; the old man shows him the map.
Bottom left: Xiao Zhang points down the street, where a school building with a sports field stands next to a hospital building with a red cross; both smile.
Bottom right: Xiao Zhang walks the old man by the arm up to the entrance of the hospital; the old man waves goodbye.
```

`hsk-5-story-05.png`

```text
People: Xiao Chen, a man of about 30 with short hair, glasses, a dark blue windbreaker; the bag's owner, a man of about 40 with a short beard and a brown jacket. Place: a train, then Xiao Chen's apartment, then a railway station hall.
Top left: inside a train at a station, passengers getting off; Xiao Chen hurriedly takes a black bag from the luggage rack above the seats, another black bag of the same shape still on the rack.
Top right: at home, Xiao Chen opens the black bag on his bed and stares, astonished, at women's and children's clothes and things he has never seen.
Bottom left: Xiao Chen holds a small plain business card, with only lines on it, in one hand and his phone at his ear with the other.
Bottom right: in a large railway station hall, Xiao Chen and the bearded man meet, each handing the other a black bag, both laughing.
```

`hsk-5-story-06.png`

```text
People: three children of about 9, two boys and a girl, in school uniforms and backpacks; a shop owner, a man of about 50 with a white apron. Place: a quiet street after school, with a tall tree beside a small grocery shop.
Top left: the three children walking home stop and look up at the tree, one of them pointing.
Top right: a small white kitten clings to a high branch, looking down, frightened.
Bottom left: the shop owner carries a tall wooden ladder to the tree while the children watch hopefully.
Bottom right: the kitten safe on the ground eats from a small dish; the children crouch around it, smiling, a small bag of cat food beside them; the shop owner looks on.
```

`hsk-5-story-07.png`

```text
People: Xiao Liu, a student of about 17 with messy short black hair, a blue hooded top; a class monitor, a girl of about 17 with glasses and a school uniform. Place: Xiao Liu's bedroom at night and in the morning, then a school classroom.
Top left: night; Xiao Liu studies at his desk under a lamp, piles of books and papers, yawning.
Top right: morning sun through the curtains; Xiao Liu jumps out of bed in shock, staring at an alarm clock without numbers on the bedside table.
Bottom left: Xiao Liu, out of breath and with his backpack, opens the door of a classroom whose desks are all empty.
Bottom right: in the school corridor, the girl with glasses explains something to him, pointing at the afternoon sun outside the window; he scratches his head, embarrassed.
```

`hsk-5-story-08.png`

```text
People: the husband, a man of about 35 with short hair and an olive apron over a white shirt; the wife, a woman of about 33 with long hair and a terracotta blouse. Place: their small home kitchen and dining table.
Top left: the husband ties on his apron in the kitchen, looking determined, vegetables on the counter; the wife reads on the sofa in the next room.
Top right: the husband cooks in a hurry, a wok on the stove, glancing at a recipe on his phone propped against the wall, the screen showing only simple pictures of food.
Bottom left: close up of his hand spooning white granules from a jar into the wok, beside two identical jars, while he looks at the phone, not at the jar.
Bottom right: at the dining table, the wife tastes the dish with chopsticks, her eyes wide but laughing; the husband watches anxiously.
```

### 7.2 第二批

`hsk-5-story-09.png`

```text
People: Xiao Zhou, a man of about 30 with short hair, a grey sweatshirt; a girl of about 8 with two braids and a yellow dress; her mother, a woman of about 38 with short hair and a teal cardigan. Place: an apartment building at night, Xiao Zhou's flat below and the family's flat above.
Top left: night; Xiao Zhou lies in bed covering his ears with a pillow, wavy lines of noise coming through the ceiling.
Top right: Xiao Zhou climbs the stairs, frowning, and knocks on the door of the flat above.
Bottom left: the door opens; the little girl stands there shyly, an upright piano with open sheet music of plain lines behind her.
Bottom right: Xiao Zhou, the mother and the girl talk at the door, smiling and nodding; a clock without numbers on the wall behind them shows its hands at nine.
```

`hsk-5-story-10.png`

```text
People: a boy of about 5 with short hair and a red T-shirt; a shop assistant, a young woman of about 25 with her hair in a bun and a green store vest; the boy's mother, a woman of about 32 with a ponytail and a blue coat. Place: a large supermarket with long aisles.
Top left: the boy stands crying between tall shelves of goods, shoppers passing by.
Top right: the shop assistant crouches down to the boy's height and speaks to him gently; he wipes his tears.
Bottom left: at a service desk, the shop assistant speaks into a microphone while holding the boy's hand.
Bottom right: the mother rushes up and hugs the boy tightly; the shop assistant smiles beside them.
```

`hsk-5-story-11.png`

```text
People: Xiao Lin, a girl of about 16 with a short bob, a white and red school uniform and a backpack; a bicycle repairman, a man of about 60 with grey hair, a dark blue work jacket and a tool box. Place: a street with trees, a small bicycle repair stall at the roadside.
Top left: Xiao Lin rides her bicycle along the street; the chain has fallen off and she wobbles to a stop.
Top right: Xiao Lin stands by her bicycle, looking anxiously at her wristwatch, her hands black from the chain.
Bottom left: the repairman kneels by the bicycle, fixing the chain with a tool, while Xiao Lin watches.
Bottom right: Xiao Lin holds out some money; the repairman waves it away with a smile and points down the road towards a school.
```

`hsk-5-story-12.png`

```text
People: Xiao Gao, a man of about 28 with short hair, a dark green jacket; a neighbor, a woman of about 45 with curly hair and a purple sweater. Place: an apartment building, the corridor in front of Xiao Gao's door and the floor above.
Top left: Xiao Gao, coming home from work, finds a brown parcel box in front of his door and picks it up, puzzled.
Top right: close up of the parcel label, plain lines only, with Xiao Gao's finger pointing at one line; he looks up towards the ceiling, understanding.
Bottom left: Xiao Gao, holding the parcel, at the door of the flat above; the neighbor opens it and smiles with relief.
Bottom right: in the neighbor's doorway, she offers him an open box of traditional pastries; Xiao Gao takes one, smiling.
```

`hsk-5-story-13.png`

```text
People: the grandfather, a man of about 70 with white hair, glasses and a brown cardigan; his granddaughter, a girl of about 12 with a ponytail and a light blue school uniform. Place: the grandfather's living room with a sofa and a window.
Top left: the grandfather holds a new smartphone at arm's length, frowning at it, its box on the table.
Top right: the granddaughter, home from school with her backpack still on, sits beside him on the sofa and shows him how to tap the screen.
Bottom left: the grandfather alone, proudly taking a photo of a flower pot on the windowsill with the phone.
Bottom right: the granddaughter, holding a birthday cake with candles, smiles at her own phone, whose screen shows only a small picture of the grandfather waving.
```

`hsk-5-story-14.png`

```text
People: Xiao Zhao, a boy of about 15 with short hair, a red sports vest and white shorts; another runner, a boy of about 15 with a blue sports vest; classmates in the stands. Place: a school sports ground with a red running track on sports day. The sports vests have no numbers.
Top left: the start of a long-distance race; Xiao Zhao and other runners set off along the track, classmates cheering in the stands.
Top right: halfway, the runner in the blue vest, just ahead of Xiao Zhao, falls on the track, holding his knee.
Bottom left: Xiao Zhao has stopped and helps the fallen runner up, his arm around his shoulder, while other runners pass.
Bottom right: at the finish, Xiao Zhao and the runner in blue cross the line together, well behind the others; the whole stand claps and cheers.
```

`hsk-5-story-15.png`

```text
People: Xiao Wu, a woman of about 27 with long straight hair, a beige trench coat and a brown handbag; a café waiter, a young man of about 22 with a black apron. Place: the door of an apartment in the evening, then a small café on the ground floor of the same building.
Top left: in front of her apartment door, Xiao Wu searches her handbag, looking worried; no key.
Top right: Xiao Wu speaks on the phone; in a small circle in the corner, her roommate with a suitcase stands at an airport.
Bottom left: Xiao Wu sits alone at a table in the café with a hot drink, thinking, chin in hand; it is dark outside.
Bottom right: the waiter walks up holding out a bunch of keys; Xiao Wu looks up in happy surprise.
```

`hsk-5-story-16.png`

```text
People: a family of four: the father of about 40 with short hair and a dark green jacket; the mother of about 38 with a ponytail and a mustard sweater; a boy of about 10 with a red cap; a girl of about 7 with two pigtails; and an old farming couple of about 65, the man in a blue work jacket and the woman in a flowered blouse. Place: the countryside outside a city, green fields and a farmhouse with a tiled roof.
Top left: the family spreads a picnic blanket on the grass, with fruit, sandwiches and drinks; a kite lies beside the boy; the sky is clear.
Top right: dark clouds have come; rain begins to fall on the picnic and the family hurriedly gathers the food.
Bottom left: the family runs through the rain towards the farmhouse, where the old couple wave them in from the doorway.
Bottom right: inside the farmhouse, everyone sits around a wooden table drinking tea and laughing, rain still falling outside the window.
```
