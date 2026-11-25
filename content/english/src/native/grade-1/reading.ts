// Grade 1: the reading units of the course, one for each theme: short stories and short texts of facts in words a first
// grader can sound out or knows by sight, three questions each.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage, words } from "../grade-3/reading-kit.ts";

const who = words("who-and-where-in-a-story", 0.3);
const order = words("what-happens-first-next-and-last", 0.3);
const facts = words("finding-facts-in-a-text", 0.3);

/** allAboutMe is the reading unit of grade 1 on children, their families and what they can do. */
export const allAboutMe: ReadingUnitDef = {
  id: "all-about-me",
  title: t("All About Me", "关于我"),
  passages: [
    passage(
      "my-name-is-pam",
      t("My Name Is Pam", "我叫帕姆"),
      `Hi! My name is Pam, and I am six. I have red hair and a big smile. I live in a little house on a hill.

I like to run and jump in the grass. I like to sing songs with my dad. When it rains, I read a book in my bed.

My best pal is a dog named Rex. Rex has black spots and a long tail. He sleeps on a rug next to my bed. When I get up, he licks my hand.`,
      [who],
      [
        ask(
          ["How old is Pam?", "帕姆几岁了？"],
          ["Six", "六岁"],
          [
            ["Ten", "十岁"],
            ["Two", "两岁"],
            ["Eight", "八岁"],
          ],
          ['Pam says, "My name is Pam, and I am six."', "帕姆说：“我叫帕姆，我六岁了。”"],
          [
            ["Ten is too old for Pam. She tells us her age at the very start: six.", "十岁太大了。帕姆一开头就说了自己的年龄：六岁。"],
            ["Two is the age of a little child, but Pam says she is six.", "两岁是很小的孩子，可帕姆说自己六岁。"],
            ["Eight is not the number Pam says. In her first line she says six.", "八岁不是帕姆说的数字。她第一句就说自己六岁。"],
          ],
        ),
        ask(
          ["What does Pam do when it rains?", "下雨时帕姆做什么？"],
          ["She reads a book in bed", "她在床上看书"],
          [
            ["She runs in the grass", "她在草地上跑"],
            ["She sings with her dad", "她和爸爸唱歌"],
            ["She jumps in the mud", "她在泥里跳"],
          ],
          ["The story says that when it rains, Pam reads a book in her bed.", "故事说，下雨时帕姆在床上看书。"],
          [
            [
              "Running in the grass is what Pam likes to do outside, not what she does when it rains.",
              "在草地上跑是帕姆喜欢在外面做的事，不是下雨时做的事。",
            ],
            [
              "Singing with her dad is something Pam likes, but the rainy-day part is about a book.",
              "和爸爸唱歌是帕姆喜欢的事，但讲下雨的那句说的是看书。",
            ],
            [
              "Jumping in the mud is not in the story. When it rains, Pam stays in bed with a book.",
              "故事里没有在泥里跳。下雨时帕姆在床上看书。",
            ],
          ],
        ),
        ask(
          ["Who is Rex?", "雷克斯是谁？"],
          ["Pam's dog", "帕姆的狗"],
          [
            ["Pam's dad", "帕姆的爸爸"],
            ["Pam's cat", "帕姆的猫"],
            ["A boy at school", "学校里的一个男孩"],
          ],
          ["Pam says her best pal is a dog named Rex.", "帕姆说她最好的朋友是一只叫雷克斯的狗。"],
          [
            ["Pam's dad is the one she sings with. Rex is a dog.", "帕姆和爸爸一起唱歌。雷克斯是一只狗。"],
            ["A cat is not in the story. Pam says Rex is a dog with black spots.", "故事里没有猫。帕姆说雷克斯是一只有黑斑点的狗。"],
            ["A boy at school is never named. Rex is Pam's best pal, a dog.", "故事没提学校里的男孩。雷克斯是帕姆最好的朋友，一只狗。"],
          ],
        ),
        ask(
          ["What color is Pam's hair?", "帕姆的头发是什么颜色的？"],
          ["Red", "红色"],
          [
            ["Black", "黑色"],
            ["Yellow", "黄色"],
            ["Brown", "棕色"],
          ],
          ['Pam says, "I have red hair and a big smile."', "帕姆说：“我有一头红发和大大的笑容。”"],
          [
            ["Black is the color of Rex's spots, not Pam's hair.", "黑色是雷克斯身上斑点的颜色，不是帕姆的头发。"],
            ["Yellow hair is not in the story. Pam says her hair is red.", "故事里没有黄头发。帕姆说她的头发是红色的。"],
            ["Brown is not said about Pam. She has red hair.", "故事没说帕姆有棕色头发。她是红头发。"],
          ],
        ),
        ask(
          ["Where does Pam live?", "帕姆住在哪里？"],
          ["In a little house on a hill", "在山上的一座小房子里"],
          [
            ["In a big flat in a town", "在镇上的一套大公寓里"],
            ["On a boat on the sea", "在海上的一条船上"],
            ["In a tent in the woods", "在树林里的一顶帐篷里"],
          ],
          ["Pam says she lives in a little house on a hill.", "帕姆说她住在山上的一座小房子里。"],
          [
            [
              "A big flat in a town is the opposite of what Pam says: a little house on a hill.",
              "镇上的大公寓正好和帕姆说的相反：她住在山上的小房子里。",
            ],
            ["A boat on the sea is not in the story. Pam's home is a little house.", "故事里没有海上的船。帕姆的家是一座小房子。"],
            ["A tent in the woods is not where Pam lives. She lives in a house on a hill.", "帕姆不住在树林的帐篷里，她住在山上的房子里。"],
          ],
        ),
        ask(
          ["Where does Pam like to run and jump?", "帕姆喜欢在哪里跑跑跳跳？"],
          ["In the grass", "在草地上"],
          [
            ["In her bed", "在她的床上"],
            ["In the pool", "在泳池里"],
            ["On the rug", "在地毯上"],
          ],
          ['Pam says, "I like to run and jump in the grass."', "帕姆说：“我喜欢在草地上跑跑跳跳。”"],
          [
            ["Her bed is where Pam reads when it rains, not where she runs and jumps.", "床是帕姆下雨时看书的地方，不是跑跳的地方。"],
            ["A pool is not in this story. Pam runs and jumps in the grass.", "这个故事里没有泳池。帕姆在草地上跑跳。"],
            ["The rug is where Rex sleeps, not where Pam runs and jumps.", "地毯是雷克斯睡觉的地方，不是帕姆跑跳的地方。"],
          ],
        ),
        ask(
          ["Who does Pam sing songs with?", "帕姆和谁一起唱歌？"],
          ["Her dad", "她的爸爸"],
          [
            ["Her mom", "她的妈妈"],
            ["Her dog", "她的狗"],
            ["Her teacher", "她的老师"],
          ],
          ["Pam likes to sing songs with her dad.", "帕姆喜欢和爸爸一起唱歌。"],
          [
            ["Her mom is not in the story at all. Pam sings with her dad.", "故事里根本没提妈妈。帕姆是和爸爸唱歌。"],
            ["Her dog Rex licks her hand, but Pam sings with her dad.", "小狗雷克斯会舔她的手，但和她唱歌的是爸爸。"],
            ["A teacher is never named in the story. Pam sings with her dad.", "故事里没有提到老师。帕姆是和爸爸唱歌。"],
          ],
        ),
        ask(
          ["What does Rex look like?", "雷克斯长什么样？"],
          ["He has black spots and a long tail", "他身上有黑色斑点，还有一条长尾巴"],
          [
            ["He is all white with a short tail", "他全身雪白，尾巴很短"],
            ["He is brown with big soft ears", "他是棕色的，耳朵又大又软"],
            ["He has red hair and a big smile", "他有一头红毛和大大的笑容"],
          ],
          ["Pam says Rex has black spots and a long tail.", "帕姆说雷克斯身上有黑色斑点，还有一条长尾巴。"],
          [
            [
              "All white with a short tail is the opposite of Rex: he has black spots and a long tail.",
              "全身白色、尾巴短，正好和雷克斯相反：他有黑斑点和长尾巴。",
            ],
            [
              "Brown with big soft ears is not Rex. That is not how Pam tells us he looks.",
              "棕色、耳朵又大又软的不是雷克斯，帕姆不是这样描述他的。",
            ],
            ["Red hair and a big smile is how Pam looks, not her dog.", "红头发和大笑容说的是帕姆自己，不是她的狗。"],
          ],
        ),
        ask(
          ["Where does Rex sleep?", "雷克斯睡在哪里？"],
          ["On a rug next to Pam's bed", "在帕姆床边的地毯上"],
          [
            ["In a box in the garden", "在花园里的一个箱子里"],
            ["On the sofa", "在沙发上"],
            ["Under the table", "在桌子下面"],
          ],
          ["Rex sleeps on a rug next to Pam's bed.", "雷克斯睡在帕姆床边的地毯上。"],
          [
            ["A box in the garden is not in the story. Rex sleeps next to Pam's bed.", "故事里没有花园里的箱子。雷克斯睡在帕姆的床边。"],
            ["The sofa is never named. Rex sleeps on a rug next to Pam's bed.", "故事没提沙发。雷克斯睡在帕姆床边的地毯上。"],
            [
              "Under the table is not where Rex sleeps. His spot is the rug by Pam's bed.",
              "雷克斯不睡在桌子底下，他睡在帕姆床边的地毯上。",
            ],
          ],
        ),
        ask(
          ["What does Rex do when Pam gets up?", "帕姆起床时，雷克斯会做什么？"],
          ["He licks her hand", "他舔她的手"],
          [
            ["He barks at her", "他冲她叫"],
            ["He runs to the door", "他跑到门口"],
            ["He jumps on her bed", "他跳到她的床上"],
          ],
          ['Pam says, "When I get up, he licks my hand."', "帕姆说：“我起床时，他会舔我的手。”"],
          [
            ["Barking is not in the story. When Pam gets up, Rex licks her hand.", "故事里没有叫。帕姆起床时，雷克斯舔她的手。"],
            ["Running to the door is not what Rex does. He licks Pam's hand.", "雷克斯没有跑到门口，他舔帕姆的手。"],
            [
              "Jumping on her bed is not in the story. Rex sleeps on the rug and licks her hand.",
              "故事里没有跳上床。雷克斯睡在地毯上，会舔她的手。",
            ],
          ],
        ),
      ],
      ["Pam", "Rex"],
    ),
    passage(
      "my-family",
      t("My Family", "我的家人"),
      `This is my family. There is my mom, my dad, my little sister and me. My gran lives with us too.

Mom is a vet. She helps sick cats and dogs get well. Dad is a cook. He makes the best soup in the town.

My sister is just two. She likes to stack blocks and then knock them down. Gran tells us stories at night. We all sit on the rug and listen.

We are not all the same, but we all love each other a lot.`,
      [who, facts],
      [
        ask(
          ["What does Mom do?", "妈妈是做什么的？"],
          ["She is a vet who helps sick pets", "她是兽医，帮助生病的宠物"],
          [
            ["She is a cook", "她是厨师"],
            ["She drives a bus", "她开公共汽车"],
            ["She tells stories at school", "她在学校讲故事"],
          ],
          ["The text says Mom is a vet who helps sick cats and dogs get well.", "短文说妈妈是兽医，帮助生病的猫和狗恢复健康。"],
          [
            ["A cook is Dad's job. Mom is the vet.", "厨师是爸爸的工作。妈妈是兽医。"],
            ["Driving a bus is no one's job in this story. Mom helps sick cats and dogs.", "故事里没有人开公交车。妈妈帮助生病的猫和狗。"],
            ["Telling stories is what Gran does at night, not Mom's job.", "讲故事是奶奶晚上做的事，不是妈妈的工作。"],
          ],
        ),
        ask(
          ["What does the little sister like to do?", "妹妹喜欢做什么？"],
          ["Stack blocks and knock them down", "搭积木再把它们推倒"],
          [
            ["Make soup", "做汤"],
            ["Tell stories", "讲故事"],
            ["Help sick dogs", "帮助生病的狗"],
          ],
          ["The text says she likes to stack blocks and then knock them down.", "短文说她喜欢搭积木，然后把它们推倒。"],
          [
            ["Making soup is Dad's job, not the little sister's.", "做汤是爸爸的事，不是妹妹的。"],
            ["Telling stories is what Gran does. The sister is only two.", "讲故事是奶奶做的。妹妹才两岁。"],
            ["Helping sick dogs is Mom's work as a vet, not the sister's.", "帮助生病的狗是当兽医的妈妈的工作，不是妹妹的。"],
          ],
        ),
        ask(
          ["When does Gran tell stories?", "奶奶什么时候讲故事？"],
          ["At night", "晚上"],
          [
            ["At lunch", "午饭时"],
            ["In the morning", "早上"],
            ["At school", "在学校"],
          ],
          ["The text says Gran tells stories at night, when they all sit on the rug.", "短文说奶奶晚上讲故事，那时大家都坐在地毯上。"],
          [
            ['At lunch is not when Gran tells stories. The story says "at night".', "奶奶不是在午饭时讲故事。故事说的是“在晚上”。"],
            ["In the morning is the wrong time. Gran tells stories at night.", "早上时间不对。奶奶在晚上讲故事。"],
            ["At school is a place, not a time, and Gran tells stories at home at night.", "学校是地点，不是时间。奶奶晚上在家讲故事。"],
          ],
        ),
        ask(
          ["Who lives with the family too?", "还有谁和这家人住在一起？"],
          ["Gran", "奶奶"],
          [
            ["An uncle", "一位叔叔"],
            ["A cousin", "一个表亲"],
            ["A friend", "一个朋友"],
          ],
          ['The text says, "My gran lives with us too."', "短文说：“我奶奶也和我们住在一起。”"],
          [
            ["An uncle is not in the family list. Gran lives with them.", "家人里没有叔叔。和他们住在一起的是奶奶。"],
            ["A cousin is never named. The one who lives with them too is Gran.", "故事没提堂兄弟姐妹。也和他们住在一起的是奶奶。"],
            ["A friend is not part of the family list. Gran lives with them.", "朋友不在家人名单里。和他们住的是奶奶。"],
          ],
        ),
        ask(
          ["What does Dad do?", "爸爸是做什么的？"],
          ["He is a cook", "他是厨师"],
          [
            ["He is a vet", "他是兽医"],
            ["He is a teacher", "他是老师"],
            ["He is a farmer", "他是农民"],
          ],
          ['The text says, "Dad is a cook."', "短文说：“爸爸是厨师。”"],
          [
            ["A vet is Mom's job, not Dad's.", "兽医是妈妈的工作，不是爸爸的。"],
            ["A teacher is not anyone's job in this story. Dad is a cook.", "故事里没有人当老师。爸爸是厨师。"],
            ["A farmer is not in the story. Dad is a cook.", "故事里没有农民。爸爸是厨师。"],
          ],
        ),
        ask(
          ["What does Dad make best?", "爸爸最拿手做什么？"],
          ["Soup", "汤"],
          [
            ["Cake", "蛋糕"],
            ["Bread", "面包"],
            ["Pizza", "比萨"],
          ],
          ["Dad makes the best soup in the town.", "爸爸做的汤是镇上最好的。"],
          [
            ["Cake is not in the story. Dad makes the best soup in the town.", "故事里没有蛋糕。爸爸做的汤是全镇最好的。"],
            ["Bread is never named. Dad is known for his soup.", "故事没提面包。爸爸最拿手的是汤。"],
            ["Pizza is not in the story. Dad makes the best soup.", "故事里没有披萨。爸爸做的汤最好。"],
          ],
        ),
        ask(
          ["How old is the little sister?", "小妹妹几岁了？"],
          ["Two", "两岁"],
          [
            ["Six", "六岁"],
            ["Four", "四岁"],
            ["One", "一岁"],
          ],
          ['The text says, "My sister is just two."', "短文说：“我妹妹才两岁。”"],
          [
            ["Six is not the sister's age. She is just two.", "六岁不是妹妹的年龄。她才两岁。"],
            ["Four is too old. The story says the sister is just two.", "四岁太大了。故事说妹妹才两岁。"],
            ["One is close, but the story says she is just two.", "一岁很接近，但故事说她才两岁。"],
          ],
        ),
        ask(
          ["What does Mom help get well?", "妈妈帮助什么恢复健康？"],
          ["Sick cats and dogs", "生病的猫和狗"],
          [
            ["Sick children", "生病的孩子"],
            ["Sick birds and fish", "生病的鸟和鱼"],
            ["Old trees", "老树"],
          ],
          ["Mom is a vet. She helps sick cats and dogs get well.", "妈妈是兽医，她帮助生病的猫和狗恢复健康。"],
          [
            ["Sick children are not what a vet helps. Mom helps sick cats and dogs.", "兽医不给生病的孩子看病。妈妈帮助生病的猫和狗。"],
            ["Birds and fish are not named. The story says cats and dogs.", "故事没提鸟和鱼，说的是猫和狗。"],
            ["Old trees are not animals. Mom is a vet for cats and dogs.", "老树不是动物。妈妈是给猫狗看病的兽医。"],
          ],
        ),
        ask(
          ["Where does the family sit to listen to Gran?", "一家人坐在哪里听奶奶讲故事？"],
          ["On the rug", "在地毯上"],
          [
            ["At the table", "在桌子旁"],
            ["In the garden", "在花园里"],
            ["On the bed", "在床上"],
          ],
          ['The text says, "We all sit on the rug and listen."', "短文说：“我们都坐在地毯上听。”"],
          [
            ["The table is not where they sit. They all sit on the rug.", "他们不是坐在桌边，而是都坐在地毯上。"],
            ["The garden is not in this story. They sit on the rug to listen.", "这个故事里没有花园。他们坐在地毯上听。"],
            ["The bed is not where the family sits. They sit on the rug.", "一家人不是坐在床上，而是坐在地毯上。"],
          ],
        ),
        ask(
          ["What does the child say about the family at the end?", "结尾处孩子怎样说这一家人？"],
          ["They are not all the same, but they all love each other", "他们并不都一样，但都彼此相爱"],
          [
            ["They all look the same", "他们长得都一样"],
            ["They all have the same job", "他们都做同样的工作"],
            ["They do not like to sit together", "他们不喜欢坐在一起"],
          ],
          [
            'The text ends, "We are not all the same, but we all love each other a lot."',
            "短文结尾说：“我们并不都一样，但我们都很爱彼此。”",
          ],
          [
            [
              "All looking the same is the opposite. The child says they are not all the same.",
              "长得都一样正好相反。孩子说他们并不都一样。",
            ],
            ["The same job is wrong. Mom is a vet and Dad is a cook.", "工作一样是错的。妈妈是兽医，爸爸是厨师。"],
            [
              "Not liking to sit together is the opposite. They all sit on the rug and love each other.",
              "不喜欢坐在一起正好相反。他们一起坐在地毯上，彼此相爱。",
            ],
          ],
        ),
      ],
    ),
    passage(
      "what-i-can-do",
      t("What I Can Do", "我会做的事"),
      `When I was a baby, I could not do much. I could not walk or talk. I just slept and drank milk.

Now I can do lots of things. I can get dressed on my own. I can brush my teeth and make my bed. I can ride a bike with no help.

I can read short books, and I can write my name. I can count to one hundred.

There are still things I want to learn. Next year, I want to swim across the big pool. What can you do?`,
      [order],
      [
        ask(
          ["What could the child do as a baby?", "这个孩子还是婴儿时会做什么？"],
          ["Sleep and drink milk", "睡觉和喝奶"],
          [
            ["Ride a bike", "骑自行车"],
            ["Write a name", "写名字"],
            ["Make the bed", "整理床铺"],
          ],
          ["The text says that as a baby, the child just slept and drank milk.", "短文说，这个孩子还是婴儿时只会睡觉和喝奶。"],
          [
            ["Riding a bike is something the child can do now, not as a baby.", "骑自行车是孩子现在会做的，不是小时候。"],
            ["Writing a name is a thing the child can do now. As a baby they could not.", "写名字是孩子现在会的，婴儿时还不会。"],
            [
              "Making the bed is a thing the child does now. A baby just slept and drank milk.",
              "整理床铺是孩子现在做的事。婴儿只会睡觉和喝奶。",
            ],
          ],
        ),
        ask(
          ["Which can the child do now?", "这个孩子现在会做哪件事？"],
          ["Ride a bike with no help", "不用帮忙就能骑自行车"],
          [
            ["Swim across the big pool", "游过大泳池"],
            ["Drive a car", "开车"],
            ["Fly a plane", "开飞机"],
          ],
          ['The text says, "I can ride a bike with no help."', "短文说：“我不用帮忙就能骑自行车。”"],
          [
            [
              "Swimming across the big pool is what the child wants to learn next year, so not yet.",
              "游过大泳池是孩子明年想学的，现在还不会。",
            ],
            ["Driving a car is not in the story. A child this age cannot drive.", "故事里没有开车。这么小的孩子不会开车。"],
            ["Flying a plane is not in the story. The child rides a bike with no help.", "故事里没有开飞机。孩子会独自骑自行车。"],
          ],
        ),
        ask(
          ["What does the child want to learn next year?", "这个孩子明年想学什么？"],
          ["To swim across the big pool", "游过大泳池"],
          [
            ["To brush teeth", "刷牙"],
            ["To walk", "走路"],
            ["To read short books", "读短书"],
          ],
          ['The last part says, "Next year, I want to swim across the big pool."', "最后一段说：“明年我想游过大泳池。”"],
          [
            ["Brushing teeth is something the child can already do.", "刷牙是孩子已经会的事。"],
            ["Walking is something the child learned long ago. Only as a baby they could not.", "走路孩子早就学会了，只有婴儿时不会。"],
            ["Reading short books is something the child can already do.", "看短小的书是孩子已经会的事。"],
          ],
        ),
        ask(
          ["What could the child not do as a baby?", "孩子还是婴儿时不会做什么？"],
          ["Walk or talk", "走路或说话"],
          [
            ["Sleep", "睡觉"],
            ["Drink milk", "喝奶"],
            ["Cry", "哭"],
          ],
          ['The text says, "I could not walk or talk."', "短文说：“我不会走路，也不会说话。”"],
          [
            ["Sleeping is what the baby did a lot, so it could do that.", "睡觉是婴儿常做的事，所以它会。"],
            ["Drinking milk is what the baby did, so it could do that.", "喝奶是婴儿做的事，所以它会。"],
            ["Crying is not in the story. The child says a baby could not walk or talk.", "故事里没提哭。孩子说婴儿不会走路也不会说话。"],
          ],
        ),
        ask(
          ["Which can the child do on their own now?", "孩子现在能自己做什么？"],
          ["Get dressed", "穿衣服"],
          [
            ["Drive a car", "开车"],
            ["Cook dinner", "做晚饭"],
            ["Swim across the big pool", "游过大泳池"],
          ],
          ['The child says, "I can get dressed on my own."', "孩子说：“我能自己穿衣服。”"],
          [
            ["Driving a car is not in the story at all.", "故事里根本没有开车。"],
            ["Cooking dinner is not one of the things the child names.", "做晚饭不是孩子说到的事情。"],
            [
              "Swimming across the big pool is a wish for next year, not something the child can do now.",
              "游过大泳池是明年的愿望，不是现在会的。",
            ],
          ],
        ),
        ask(
          ["Besides getting dressed, what else can the child do?", "除了穿衣服，孩子还能做什么？"],
          ["Brush their teeth and make their bed", "刷牙和整理床铺"],
          [
            ["Wash the car", "洗车"],
            ["Bake bread", "烤面包"],
            ["Fix a bike", "修自行车"],
          ],
          ['The child says, "I can brush my teeth and make my bed."', "孩子说：“我能刷牙，还能整理床铺。”"],
          [
            ["Washing the car is not in the story.", "故事里没有洗车。"],
            ["Baking bread is not something the child names.", "孩子没有说到烤面包。"],
            ["Fixing a bike is wrong. The child rides a bike but never says they fix one.", "修自行车不对。孩子会骑车，但没说会修车。"],
          ],
        ),
        ask(
          ["What can the child write?", "孩子会写什么？"],
          ["Their name", "自己的名字"],
          [
            ["A long letter", "一封长信"],
            ["A whole book", "一整本书"],
            ["The days of the week", "一周的每一天"],
          ],
          ['The child says, "I can write my name."', "孩子说：“我会写自己的名字。”"],
          [
            ["A long letter is too much. The child can write their name.", "长信太多了。孩子会写自己的名字。"],
            [
              "A whole book is not in the story. The child can read short books and write a name.",
              "故事里没有写整本书。孩子会读短书、写名字。",
            ],
            ["The days of the week are never named. The child writes their name.", "故事没提星期几。孩子写的是自己的名字。"],
          ],
        ),
        ask(
          ["How far can the child count?", "孩子能数到多少？"],
          ["To one hundred", "一百"],
          [
            ["To ten", "十"],
            ["To twenty", "二十"],
            ["To one thousand", "一千"],
          ],
          ['The child says, "I can count to one hundred."', "孩子说：“我能数到一百。”"],
          [
            ["Ten is too small. The child can count to one hundred.", "十太少了。孩子能数到一百。"],
            ["Twenty is too small. The story says one hundred.", "二十太少了。故事说的是一百。"],
            ["One thousand is too big. The child counts to one hundred.", "一千太多了。孩子能数到一百。"],
          ],
        ),
        ask(
          ["What kind of books can the child read?", "孩子能读什么样的书？"],
          ["Short books", "短小的书"],
          [
            ["Very long books", "很长的书"],
            ["No books at all", "一本也不会读"],
            ["Only books about pools", "只有关于泳池的书"],
          ],
          ['The child says, "I can read short books."', "孩子说：“我能读短小的书。”"],
          [
            ["Very long books are the opposite. The child reads short books.", "很长的书正好相反。孩子读的是短书。"],
            ["No books at all is wrong. The child says they can read short books.", "一本书也不读是错的。孩子说自己能读短书。"],
            [
              "Books about pools are not named. The pool is what the child wants to swim across.",
              "故事没提关于泳池的书。泳池是孩子想游过去的地方。",
            ],
          ],
        ),
        ask(
          ["What question does the child ask at the end?", "孩子在结尾问了什么问题？"],
          ["What can you do?", "你会做什么？"],
          [
            ["How old are you?", "你几岁了？"],
            ["Can you swim?", "你会游泳吗？"],
            ["Where do you live?", "你住在哪里？"],
          ],
          ['The text ends with the question, "What can you do?"', "短文以问题“你会做什么？”结尾。"],
          [
            ['How old are you is not asked. The last line is "What can you do?"', "故事没问你几岁。最后一句是“你会做什么？”"],
            [
              'Can you swim is close to the pool wish, but the last question is "What can you do?"',
              "“你会游泳吗”和泳池的愿望有关，但最后的问题是“你会做什么？”",
            ],
            ["Where do you live is not asked anywhere in the story.", "故事里没有问你住在哪里。"],
          ],
        ),
      ],
    ),
  ],
};

/** petsAndAnimals is the reading unit of grade 1 on pets and on where animals live. */
export const petsAndAnimals: ReadingUnitDef = {
  id: "pets-and-animals",
  title: t("Pets and Animals", "宠物和动物"),
  passages: [
    passage(
      "a-pup-named-max",
      t("A Pup Named Max", "一只叫麦克斯的小狗"),
      `Ben got a pup for his birthday. The pup was small and brown, with big soft ears. Ben named him Max.

Max liked to run and dig. One day, he dug a big hole in the garden. Mom was not glad! Ben filled the hole with dirt.

Then Ben got a red ball. He threw it, and Max ran to get it. Max brought the ball back to Ben again and again. Max did not dig any more holes that day. He was too tired to dig.`,
      [who, order],
      [
        ask(
          ["Who got a pup?", "谁得到了一只小狗？"],
          ["Ben", "本"],
          [
            ["Mom", "妈妈"],
            ["Max", "麦克斯"],
            ["Ben's dad", "本的爸爸"],
          ],
          ["The story says Ben got a pup for his birthday.", "故事说本过生日时得到了一只小狗。"],
          [
            ["Mom is the one who was not glad about the hole, not the one who got the pup.", "妈妈是对洞不高兴的人，不是得到小狗的人。"],
            ["Max is the pup himself, not the one who got him.", "马克斯就是那只小狗，不是得到小狗的人。"],
            ["Ben's dad is not in the story. Ben got the pup for his birthday.", "故事里没有本的爸爸。本在生日时得到了小狗。"],
          ],
        ),
        ask(
          ["What did Max do in the garden?", "麦克斯在花园里做了什么？"],
          ["He dug a big hole", "他挖了一个大坑"],
          [
            ["He ate the plants", "他吃了植物"],
            ["He slept in the sun", "他在太阳下睡觉"],
            ["He found a ball", "他找到了一个球"],
          ],
          ["The story says that one day Max dug a big hole in the garden.", "故事说有一天麦克斯在花园里挖了一个大坑。"],
          [
            ["Eating the plants is not in the story. Max dug a big hole.", "故事里没有吃植物。马克斯挖了一个大洞。"],
            ["Sleeping in the sun is not what Max did. He liked to run and dig.", "马克斯没有晒太阳睡觉。他喜欢跑和挖。"],
            ["Finding a ball is wrong. Ben got the red ball and threw it.", "找到球不对。红球是本拿来扔的。"],
          ],
        ),
        ask(
          ["Why did Max stop digging?", "麦克斯为什么不再挖坑了？"],
          ["He was too tired from getting the ball", "他追球追得太累了"],
          [
            ["Mom took him away", "妈妈把他带走了"],
            ["It began to rain", "开始下雨了"],
            ["He did not like dirt", "他不喜欢泥土"],
          ],
          ["After running for the ball again and again, Max was too tired to dig.", "麦克斯一次又一次地跑去捡球之后，累得挖不动了。"],
          [
            [
              "Mom took him away is not in the story. Mom was not glad, but Max stopped because he was tired.",
              "故事里没有妈妈把他带走。妈妈不高兴，但马克斯停下是因为累了。",
            ],
            ["Rain is not in this story. Max was too tired to dig.", "这个故事里没有下雨。马克斯是累得挖不动了。"],
            ["Not liking dirt is wrong. Max liked to dig. He was just too tired.", "不喜欢泥土不对。马克斯喜欢挖，只是太累了。"],
          ],
        ),
        ask(
          ["When did Ben get the pup?", "本什么时候得到了小狗？"],
          ["For his birthday", "过生日的时候"],
          [
            ["At school", "在学校的时候"],
            ["On a trip", "旅行的时候"],
            ["At the end of the year", "年底的时候"],
          ],
          ["The story says Ben got a pup for his birthday.", "故事说本过生日时得到了一只小狗。"],
          [
            ["At school is not where Ben got the pup. It was a birthday gift.", "本不是在学校得到小狗的，那是生日礼物。"],
            ["A trip is not in the story. Ben got the pup for his birthday.", "故事里没有旅行。本在生日时得到了小狗。"],
            ['The end of the year is not said. The story says "for his birthday".', "故事没说年底，说的是“生日时”。"],
          ],
        ),
        ask(
          ["What did the pup look like?", "小狗长什么样？"],
          ["Small and brown, with big soft ears", "小小的，棕色的，耳朵又大又软"],
          [
            ["Big and white, with a long tail", "大大的，白色的，有条长尾巴"],
            ["Black with white spots", "黑色带白色斑点"],
            ["Small and gray, with short ears", "小小的，灰色的，耳朵很短"],
          ],
          ["The pup was small and brown, with big soft ears.", "小狗小小的，棕色的，耳朵又大又软。"],
          [
            ["Big and white with a long tail is not Max. He was small and brown.", "又大又白、尾巴长的不是马克斯。他又小又是棕色。"],
            ["Black with white spots is wrong. Max was brown.", "黑底白斑不对。马克斯是棕色的。"],
            ["Gray with short ears is the opposite. Max had big soft ears.", "灰色、耳朵短正好相反。马克斯有又大又软的耳朵。"],
          ],
        ),
        ask(
          ["What did Ben name the pup?", "本给小狗起了什么名字？"],
          ["Max", "麦克斯"],
          [
            ["Rex", "雷克斯"],
            ["Sam", "萨姆"],
            ["Ben", "本"],
          ],
          ['The story says, "Ben named him Max."', "故事说：“本给他起名叫麦克斯。”"],
          [
            ["Rex is a dog from another story. Ben named his pup Max.", "雷克斯是另一个故事里的狗。本给小狗取名马克斯。"],
            ["Sam is not in the story. The pup is Max.", "故事里没有萨姆。小狗叫马克斯。"],
            ["Ben is the boy, not the pup.", "本是男孩，不是小狗。"],
          ],
        ),
        ask(
          ["What did Max like to do?", "麦克斯喜欢做什么？"],
          ["Run and dig", "跑和挖洞"],
          [
            ["Sleep and eat", "睡觉和吃东西"],
            ["Swim and jump", "游泳和跳"],
            ["Bark and sing", "叫和唱歌"],
          ],
          ['The story says, "Max liked to run and dig."', "故事说：“麦克斯喜欢跑和挖洞。”"],
          [
            ["Sleeping and eating are not what the story says Max liked.", "故事没说马克斯喜欢睡觉和吃东西。"],
            ["Swimming is not in the story. Max liked to run and dig.", "故事里没有游泳。马克斯喜欢跑和挖。"],
            ["Barking and singing are not in the story. Max liked to run and dig.", "故事里没有叫和唱歌。马克斯喜欢跑和挖。"],
          ],
        ),
        ask(
          ["How did Mom feel about the hole?", "妈妈对那个洞有什么感受？"],
          ["She was not glad", "她不高兴"],
          [
            ["She was very happy", "她非常高兴"],
            ["She laughed", "她笑了"],
            ["She did not see it", "她没看见"],
          ],
          ['The story says, "Mom was not glad!"', "故事说：“妈妈不高兴！”"],
          [
            ["Very happy is the opposite. The story says Mom was not glad.", "非常高兴正好相反。故事说妈妈不高兴。"],
            ["Laughing is not in the story. Mom was not glad.", "故事里没有笑。妈妈不高兴。"],
            ["Not seeing it is wrong. Mom saw the hole and was not glad.", "没看见不对。妈妈看到了洞，很不高兴。"],
          ],
        ),
        ask(
          ["What did Ben do with the hole?", "本怎样处理那个洞？"],
          ["He filled it with dirt", "他用土把它填上了"],
          [
            ["He made it bigger", "他把它挖得更大了"],
            ["He put his ball in it", "他把球放了进去"],
            ["He planted a tree in it", "他在里面种了一棵树"],
          ],
          ['The story says, "Ben filled the hole with dirt."', "故事说：“本用土把洞填上了。”"],
          [
            ["Making it bigger is the opposite. Ben filled the hole.", "把洞挖大正好相反。本把洞填上了。"],
            ["Putting his ball in it is wrong. Ben threw the ball for Max.", "把球放进去不对。本是把球扔给马克斯。"],
            ["Planting a tree is not in the story. Ben filled it with dirt.", "故事里没有种树。本用土把洞填上了。"],
          ],
        ),
        ask(
          ["What color was the ball?", "球是什么颜色的？"],
          ["Red", "红色"],
          [
            ["Blue", "蓝色"],
            ["Brown", "棕色"],
            ["Green", "绿色"],
          ],
          ['The story says, "Then Ben got a red ball."', "故事说：“然后本拿来一个红球。”"],
          [
            ["Blue is not the color. The ball was red.", "不是蓝色。球是红色的。"],
            ["Brown is the color of the pup, not the ball.", "棕色是小狗的颜色，不是球的。"],
            ["Green is not in the story. Ben got a red ball.", "故事里没有绿色。本拿到的是红球。"],
          ],
        ),
      ],
      ["Ben", "Max"],
    ),
    passage(
      "animal-homes",
      t("Animal Homes", "动物的家"),
      `All animals need a home. A home keeps them safe and dry.

A bird makes a nest in a tree. It uses twigs, grass and mud. The nest holds its eggs.

A rabbit digs a hole in the ground. The hole keeps the rabbit safe from a fox.

Bees live in a hive. Lots of bees live in one hive, and they make honey there.

A fish lives in water. Some fish live in a pond, and some live in the sea. Where do you live?`,
      [facts],
      [
        ask(
          ["What does a bird use to make a nest?", "鸟用什么筑巢？"],
          ["Twigs, grass and mud", "树枝、草和泥"],
          [
            ["Rocks and sand", "石头和沙子"],
            ["Honey and wax", "蜂蜜和蜡"],
            ["Snow and ice", "雪和冰"],
          ],
          ["The text says a bird uses twigs, grass and mud.", "短文说鸟用树枝、草和泥筑巢。"],
          [
            ["Rocks and sand are not named. The bird uses twigs, grass and mud.", "文中没提石头和沙子。鸟用的是树枝、草和泥。"],
            ["Honey and wax belong to the bees in the hive, not the bird's nest.", "蜂蜜和蜡属于蜂巢里的蜜蜂，不是鸟窝。"],
            ["Snow and ice are not in the text. A nest is made of twigs, grass and mud.", "文中没有雪和冰。鸟窝是用树枝、草和泥做的。"],
          ],
        ),
        ask(
          ["Why does a rabbit dig a hole?", "兔子为什么挖洞？"],
          ["To stay safe from a fox", "为了躲开狐狸，保护自己"],
          [
            ["To find honey", "为了找蜂蜜"],
            ["To lay eggs in a tree", "为了在树上产蛋"],
            ["To swim in a pond", "为了在池塘里游泳"],
          ],
          ["The text says the hole keeps the rabbit safe from a fox.", "短文说洞能保护兔子不被狐狸抓到。"],
          [
            ["Honey is made by bees in a hive, not found by a rabbit.", "蜂蜜是蜜蜂在蜂巢里做的，不是兔子找的。"],
            ["Eggs in a tree belong to the bird. The rabbit digs to stay safe.", "树上的蛋属于鸟。兔子挖洞是为了安全。"],
            ["Swimming in a pond is what some fish do, not the rabbit.", "在池塘里游是有些鱼做的事，不是兔子。"],
          ],
        ),
        ask(
          ["Where do bees live?", "蜜蜂住在哪里？"],
          ["In a hive", "在蜂巢里"],
          [
            ["In a nest of mud", "在泥做的巢里"],
            ["In a hole in the ground", "在地洞里"],
            ["In a pond", "在池塘里"],
          ],
          ["The text says bees live in a hive, where they make honey.", "短文说蜜蜂住在蜂巢里，在那里酿蜜。"],
          [
            ["A nest of mud is the bird's home, not the bees'.", "泥做的窝是鸟的家，不是蜜蜂的。"],
            ["A hole in the ground is the rabbit's home.", "地上的洞是兔子的家。"],
            ["A pond is where some fish live, not bees.", "池塘是一些鱼住的地方，不是蜜蜂。"],
          ],
        ),
        ask(
          ["What does a home do for animals?", "家对动物有什么用？"],
          ["It keeps them safe and dry", "让它们安全、干爽"],
          [
            ["It makes them fast", "让它们跑得快"],
            ["It gives them food", "给它们食物"],
            ["It keeps them awake", "让它们保持清醒"],
          ],
          ['The text says, "A home keeps them safe and dry."', "短文说：“家让它们安全、干爽。”"],
          [
            ["Making them fast is not in the text. A home keeps animals safe and dry.", "文中没说让它们跑得快。家让动物安全、干爽。"],
            ["Giving them food is not what the text says a home does.", "文中没说家给它们食物。"],
            ["Keeping them awake is not said. The first lines say safe and dry.", "文中没说让它们不睡觉。开头说的是安全和干爽。"],
          ],
        ),
        ask(
          ["Where does a bird make a nest?", "鸟在哪里筑巢？"],
          ["In a tree", "在树上"],
          [
            ["In the ground", "在地下"],
            ["In a pond", "在池塘里"],
            ["In a hive", "在蜂巢里"],
          ],
          ['The text says, "A bird makes a nest in a tree."', "短文说：“鸟在树上筑巢。”"],
          [
            ["In the ground is where the rabbit digs, not where the bird makes a nest.", "地里是兔子挖洞的地方，不是鸟做窝的地方。"],
            ["A pond is for fish. The bird makes a nest in a tree.", "池塘是鱼的。鸟在树上做窝。"],
            ["A hive is the bees' home. The bird's nest is in a tree.", "蜂巢是蜜蜂的家。鸟窝在树上。"],
          ],
        ),
        ask(
          ["What does the nest hold?", "鸟巢里放着什么？"],
          ["The bird's eggs", "鸟蛋"],
          [
            ["Honey", "蜂蜜"],
            ["Seeds", "种子"],
            ["Fish", "鱼"],
          ],
          ['The text says, "The nest holds its eggs."', "短文说：“鸟巢里放着它的蛋。”"],
          [
            ["Honey is in the bees' hive, not the bird's nest.", "蜂蜜在蜜蜂的蜂巢里，不在鸟窝里。"],
            ["Seeds are not named. The nest holds the bird's eggs.", "文中没提种子。鸟窝里装的是鸟蛋。"],
            ["Fish live in water, not in a nest.", "鱼生活在水里，不在鸟窝里。"],
          ],
        ),
        ask(
          ["Where does a rabbit make its home?", "兔子把家安在哪里？"],
          ["In a hole in the ground", "在地上的洞里"],
          [
            ["In a nest in a tree", "在树上的巢里"],
            ["In a hive", "在蜂巢里"],
            ["In the sea", "在大海里"],
          ],
          ['The text says, "A rabbit digs a hole in the ground."', "短文说：“兔子在地上挖洞。”"],
          [
            ["A nest in a tree is the bird's home.", "树上的窝是鸟的家。"],
            ["A hive is where bees live, not a rabbit.", "蜂巢是蜜蜂住的，不是兔子。"],
            ["The sea is where some fish live. A rabbit lives on land in a hole.", "海里住着一些鱼。兔子住在陆地上的洞里。"],
          ],
        ),
        ask(
          ["What do bees make in the hive?", "蜜蜂在蜂巢里制造什么？"],
          ["Honey", "蜂蜜"],
          [
            ["Milk", "牛奶"],
            ["Mud", "泥"],
            ["Eggs for birds", "给鸟的蛋"],
          ],
          ["The text says lots of bees live in one hive, and they make honey there.", "短文说许多蜜蜂住在一个蜂巢里，在那里酿蜜。"],
          [
            ["Milk is not in the text. Bees make honey.", "文中没有牛奶。蜜蜂做蜂蜜。"],
            ["Mud is what the bird uses for its nest, not what bees make.", "泥是鸟做窝用的，不是蜜蜂做的。"],
            ["Eggs for birds are in the bird's nest. Bees make honey in the hive.", "鸟蛋在鸟窝里。蜜蜂在蜂巢里做蜂蜜。"],
          ],
        ),
        ask(
          ["Where do fish live?", "鱼住在哪里？"],
          ["In water, in a pond or the sea", "在水里，在池塘或大海里"],
          [
            ["In trees", "在树上"],
            ["In holes in the ground", "在地上的洞里"],
            ["In hives", "在蜂巢里"],
          ],
          ["The text says a fish lives in water, some in a pond and some in the sea.", "短文说鱼住在水里，有的在池塘里，有的在大海里。"],
          [
            ["Trees are where birds make nests, not where fish live.", "树是鸟做窝的地方，不是鱼住的地方。"],
            ["Holes in the ground are for rabbits.", "地上的洞是兔子的家。"],
            ["Hives are for bees. Fish live in a pond or the sea.", "蜂巢是蜜蜂的家。鱼住在池塘或大海里。"],
          ],
        ),
        ask(
          ["What question does the text ask at the end?", "短文结尾问了什么问题？"],
          ["Where do you live?", "你住在哪里？"],
          [
            ["What do you eat?", "你吃什么？"],
            ["Do you like bees?", "你喜欢蜜蜂吗？"],
            ["Can you swim?", "你会游泳吗？"],
          ],
          ['The text ends with the question, "Where do you live?"', "短文以问题“你住在哪里？”结尾。"],
          [
            ['What do you eat is not asked. The last line is "Where do you live?"', "文中没问你吃什么。最后一句是“你住在哪里？”"],
            ["Do you like bees is not asked anywhere in the text.", "文中哪里都没问你喜不喜欢蜜蜂。"],
            ["Can you swim is not asked. The text ends by asking where you live.", "文中没问你会不会游泳。结尾问的是你住在哪里。"],
          ],
        ),
      ],
    ),
    passage(
      "the-hen-and-her-chicks",
      t("The Hen and Her Chicks", "母鸡和她的小鸡"),
      `A red hen sat on her eggs in the barn. She sat and sat for days. She kept the eggs warm.

Then one morning, she felt a tap, tap, tap. A crack came in one egg. Then a little chick came out! It was wet and yellow. Soon the other eggs cracked too.

Now the hen had six chicks. She took them out to the yard. She showed them how to peck for seeds and bugs. At night, the chicks slept under her soft wings.`,
      [order, who],
      [
        ask(
          ["Where did the hen sit on her eggs?", "母鸡在哪里孵蛋？"],
          ["In the barn", "在谷仓里"],
          [
            ["In a tree", "在树上"],
            ["By the pond", "在池塘边"],
            ["In the house", "在房子里"],
          ],
          ["The story says a red hen sat on her eggs in the barn.", "故事说一只红母鸡在谷仓里孵蛋。"],
          [
            [
              "A tree is where birds in other stories nest. This hen sat in the barn.",
              "树上是别的故事里鸟做窝的地方。这只母鸡坐在谷仓里。",
            ],
            ["By the pond is not in the story. The hen was in the barn.", "故事里没有池塘边。母鸡在谷仓里。"],
            ["The house is not where she sat. The first line says the barn.", "她没坐在屋子里。第一句说的是谷仓。"],
          ],
        ),
        ask(
          ["What happened after the hen felt a tap?", "母鸡感觉到轻轻的敲击之后发生了什么？"],
          ["An egg cracked and a chick came out", "一个蛋裂开了，一只小鸡钻了出来"],
          [
            ["She ran to the yard", "她跑到了院子里"],
            ["The chicks went to sleep", "小鸡们睡着了"],
            ["She found some seeds", "她找到了一些种子"],
          ],
          ["After the tap, a crack came in one egg and a little chick came out.", "敲击之后，一个蛋裂开了，一只小鸡钻了出来。"],
          [
            ["Running to the yard came much later, after all the chicks hatched.", "跑到院子里是很久以后的事，等小鸡都孵出来以后。"],
            ["Going to sleep happens at night at the end of the story.", "睡觉是故事最后晚上发生的事。"],
            ["Finding seeds is what she later showed the chicks in the yard.", "找种子是她后来在院子里教小鸡做的事。"],
          ],
        ),
        ask(
          ["Where did the chicks sleep at night?", "小鸡晚上睡在哪里？"],
          ["Under the hen's wings", "在母鸡的翅膀下"],
          [
            ["In a box", "在盒子里"],
            ["In the yard", "在院子里"],
            ["On a log", "在木头上"],
          ],
          ["The last sentence says the chicks slept under her soft wings.", "最后一句说小鸡睡在她柔软的翅膀下。"],
          [
            ["A box is not in the story. The chicks slept under the hen's wings.", "故事里没有箱子。小鸡睡在母鸡的翅膀下。"],
            ["The yard is where they pecked in the day, not where they slept.", "院子是白天啄食的地方，不是睡觉的地方。"],
            ["A log is not in the story. They slept under her soft wings.", "故事里没有木头。它们睡在母鸡柔软的翅膀下。"],
          ],
        ),
        ask(
          ["What color was the hen?", "母鸡是什么颜色的？"],
          ["Red", "红色"],
          [
            ["White", "白色"],
            ["Yellow", "黄色"],
            ["Black", "黑色"],
          ],
          ['The story says, "A red hen sat on her eggs in the barn."', "故事说：“一只红母鸡在谷仓里孵蛋。”"],
          [
            ["White is not said. The story calls her a red hen.", "文中没说白色。故事说她是一只红母鸡。"],
            ["Yellow is the color of the first chick, not the hen.", "黄色是第一只小鸡的颜色，不是母鸡的。"],
            ["Black is not in the story. She was a red hen.", "故事里没有黑色。她是一只红母鸡。"],
          ],
        ),
        ask(
          ["How long did the hen sit on her eggs?", "母鸡孵蛋孵了多久？"],
          ["For days", "好几天"],
          [
            ["For one hour", "一个小时"],
            ["For a minute", "一分钟"],
            ["For one night", "一个晚上"],
          ],
          ['The story says, "She sat and sat for days."', "故事说：“她坐了一天又一天。”"],
          [
            ["One hour is far too short. She sat and sat for days.", "一小时太短了。她坐了好几天。"],
            ["A minute is far too short. The story says for days.", "一分钟太短了。故事说的是好几天。"],
            ["One night is too short. The hen sat for days.", "一个晚上太短了。母鸡坐了好几天。"],
          ],
        ),
        ask(
          ["Why did the hen sit on the eggs?", "母鸡为什么坐在蛋上？"],
          ["To keep them warm", "为了让蛋保持温暖"],
          [
            ["To hide them from a fox", "为了把蛋藏起来不让狐狸发现"],
            ["To break them", "为了把蛋压碎"],
            ["Because she was tired", "因为她累了"],
          ],
          ['The story says, "She kept the eggs warm."', "故事说：“她让蛋保持温暖。”"],
          [
            ["Hiding them from a fox is not in this story. She kept the eggs warm.", "这个故事里没有躲狐狸。她是给蛋保暖。"],
            [
              "Breaking them is the opposite. The eggs cracked on their own when the chicks came out.",
              "把蛋压破正好相反。蛋是小鸡出来时自己裂开的。",
            ],
            ["Being tired is not the reason given. She sat to keep the eggs warm.", "文中没说是因为累。她坐在蛋上是为了保暖。"],
          ],
        ),
        ask(
          ["What did the first chick look like?", "第一只小鸡长什么样？"],
          ["Wet and yellow", "湿漉漉的，黄色的"],
          [
            ["Dry and red", "干干的，红色的"],
            ["Big and brown", "大大的，棕色的"],
            ["White with black spots", "白色带黑色斑点"],
          ],
          ["The story says the chick was wet and yellow.", "故事说小鸡湿漉漉的，是黄色的。"],
          [
            ["Dry and red is wrong. The chick was wet, and red was the hen.", "又干又红不对。小鸡是湿的，红色说的是母鸡。"],
            ["Big and brown is wrong. A new chick is little, and this one was yellow.", "又大又棕不对。刚出壳的小鸡很小，而且是黄色的。"],
            ["White with black spots is not in the story. The chick was wet and yellow.", "故事里没有白底黑点。小鸡又湿又黄。"],
          ],
        ),
        ask(
          ["How many chicks did the hen have?", "母鸡有几只小鸡？"],
          ["Six", "六只"],
          [
            ["Two", "两只"],
            ["Ten", "十只"],
            ["One", "一只"],
          ],
          ['The story says, "Now the hen had six chicks."', "故事说：“现在母鸡有六只小鸡了。”"],
          [
            ["Two is too few. The hen had six chicks.", "两只太少了。母鸡有六只小鸡。"],
            ["Ten is too many. The story says six.", "十只太多了。故事说的是六只。"],
            ["One is only the first chick. Soon the other eggs cracked too.", "一只只是第一只小鸡。很快别的蛋也裂开了。"],
          ],
        ),
        ask(
          ["Where did the hen take the chicks?", "母鸡把小鸡带到了哪里？"],
          ["Out to the yard", "到院子里"],
          [
            ["To the pond", "到池塘边"],
            ["Into the house", "到屋里"],
            ["Up a tree", "到树上"],
          ],
          ['The story says, "She took them out to the yard."', "故事说：“她把它们带到院子里。”"],
          [
            ["The pond is not in the story. She took them to the yard.", "故事里没有池塘。她带它们去了院子。"],
            ["Into the house is wrong. They went out to the yard.", "进屋不对。它们出去到了院子里。"],
            ["Up a tree is not in the story. Chicks peck in the yard.", "故事里没有上树。小鸡在院子里啄食。"],
          ],
        ),
        ask(
          ["What did the hen show the chicks?", "母鸡教小鸡做什么？"],
          ["How to peck for seeds and bugs", "怎样啄种子和虫子"],
          [
            ["How to swim", "怎样游泳"],
            ["How to fly to a tree", "怎样飞到树上"],
            ["How to sit on eggs", "怎样孵蛋"],
          ],
          ["She showed them how to peck for seeds and bugs.", "她教它们怎样啄种子和虫子。"],
          [
            ["Swimming is not in the story. She showed them how to peck.", "故事里没有游泳。她教它们怎么啄食。"],
            ["Flying to a tree is not what she showed them.", "她没有教它们飞到树上。"],
            ["Sitting on eggs is what the hen did before, not what she taught.", "坐在蛋上是母鸡之前做的事，不是她教的。"],
          ],
        ),
      ],
    ),
  ],
};

/** homeAndSchool is the reading unit of grade 1 on a day at school and helping at home. */
export const homeAndSchool: ReadingUnitDef = {
  id: "home-and-school",
  title: t("Home and School", "家和学校"),
  passages: [
    passage(
      "a-day-at-school",
      t("A Day at School", "学校里的一天"),
      `Kim gets to school at eight. First, she hangs up her coat and bag. Then she sits on the rug with her class.

The teacher reads a story. After that, the class does math. Kim likes to add and take away.

At lunch, Kim eats a ham sandwich and an apple. Then she plays tag with her friends.

In the afternoon, the class paints pictures of the sea. Kim paints a big blue whale. When the bell rings, it is time to go home.`,
      [order],
      [
        ask(
          ["What does Kim do first at school?", "金到学校后先做什么？"],
          ["She hangs up her coat and bag", "她挂好外套和书包"],
          [
            ["She eats lunch", "她吃午饭"],
            ["She paints a whale", "她画一头鲸"],
            ["She plays tag", "她玩捉人游戏"],
          ],
          ['The story says, "First, she hangs up her coat and bag."', "故事说：“她先挂好外套和书包。”"],
          [
            ["Eating lunch comes later in the day.", "吃午饭是一天中晚些时候的事。"],
            ["Painting a whale happens in the afternoon, near the end.", "画鲸鱼是下午快结束时的事。"],
            ["Playing tag comes after lunch, not first.", "玩捉人游戏在午饭后，不是一开始。"],
          ],
        ),
        ask(
          ["What does Kim eat at lunch?", "金午饭吃什么？"],
          ["A ham sandwich and an apple", "一个火腿三明治和一个苹果"],
          [
            ["Soup and bread", "汤和面包"],
            ["Eggs and milk", "鸡蛋和牛奶"],
            ["A cake", "一块蛋糕"],
          ],
          ["The story says she eats a ham sandwich and an apple.", "故事说她吃一个火腿三明治和一个苹果。"],
          [
            ["Soup and bread are not in this story. Kim eats a ham sandwich.", "这个故事里没有汤和面包。金吃的是火腿三明治。"],
            ["Eggs and milk are not named. Kim has a sandwich and an apple.", "文中没提鸡蛋和牛奶。金吃三明治和苹果。"],
            ["A cake is not in the story. Kim eats a ham sandwich and an apple.", "故事里没有蛋糕。金吃火腿三明治和苹果。"],
          ],
        ),
        ask(
          ["What does Kim paint?", "金画了什么？"],
          ["A big blue whale", "一头蓝色的大鲸"],
          [
            ["A red ship", "一艘红色的船"],
            ["Her friends", "她的朋友们"],
            ["A green frog", "一只绿色的青蛙"],
          ],
          ["The story says Kim paints a big blue whale.", "故事说金画了一头蓝色的大鲸。"],
          [
            [
              "A red ship is not in the story. The class paints the sea, and Kim paints a whale.",
              "故事里没有红船。全班画大海，金画了一头鲸鱼。",
            ],
            ["Her friends are who she plays tag with, not what she paints.", "她的朋友是和她玩捉人游戏的人，不是她画的东西。"],
            ["A green frog is not in the story. Kim paints a big blue whale.", "故事里没有绿青蛙。金画了一头蓝色大鲸鱼。"],
          ],
        ),
        ask(
          ["When does Kim get to school?", "金几点到学校？"],
          ["At eight", "八点"],
          [
            ["At nine", "九点"],
            ["At seven", "七点"],
            ["At noon", "中午"],
          ],
          ['The text says, "Kim gets to school at eight."', "短文说：“金八点到学校。”"],
          [
            ["Nine is wrong. Kim gets to school at eight.", "九点不对。金八点到学校。"],
            ["Seven is wrong. The story says at eight.", "七点不对。故事说的是八点。"],
            ["Noon is lunch time, not when she gets to school.", "中午是午饭时间，不是她到校的时间。"],
          ],
        ),
        ask(
          ["Where does Kim sit with her class?", "金和同学们坐在哪里？"],
          ["On the rug", "在地毯上"],
          [
            ["On the bus", "在公共汽车上"],
            ["In the garden", "在花园里"],
            ["At the lunch table", "在午餐桌旁"],
          ],
          ["Kim sits on the rug with her class.", "金和同学们坐在地毯上。"],
          [
            ["The bus is not in the story. They sit on the rug.", "故事里没有公交车。他们坐在地毯上。"],
            ["The garden is not in the story. The class sits on the rug.", "故事里没有花园。全班坐在地毯上。"],
            [
              "The lunch table is where she eats, but the class sits on the rug for the story.",
              "午餐桌是吃饭的地方，但听故事时全班坐在地毯上。",
            ],
          ],
        ),
        ask(
          ["What does the teacher do first?", "老师首先做什么？"],
          ["She reads a story", "她读一个故事"],
          [
            ["She plays tag", "她玩捉人游戏"],
            ["She paints a whale", "她画一头鲸"],
            ["She rings the bell", "她摇铃"],
          ],
          ['The text says, "The teacher reads a story."', "短文说：“老师读一个故事。”"],
          [
            ["Playing tag is what Kim does with friends after lunch.", "玩捉人游戏是金午饭后和朋友做的事。"],
            ["Painting a whale is what Kim does in the afternoon.", "画鲸鱼是金下午做的事。"],
            [
              "Ringing the bell is not something the teacher does in the story. The bell rings at the end.",
              "故事里没说老师打铃。铃声在最后响起。",
            ],
          ],
        ),
        ask(
          ["What does the class do after the story?", "听完故事后全班做什么？"],
          ["Math", "数学"],
          [
            ["Painting", "画画"],
            ["Lunch", "吃午饭"],
            ["Music", "音乐"],
          ],
          ['The text says, "After that, the class does math."', "短文说：“然后，全班做数学。”"],
          [
            ["Painting is in the afternoon, after lunch.", "画画在下午，午饭以后。"],
            ["Lunch comes after math, not right after the story.", "午饭在数学课之后，不是故事一讲完。"],
            ["Music is not in the story. After the story, they do math.", "故事里没有音乐课。听完故事后上数学。"],
          ],
        ),
        ask(
          ["What does Kim like to do in math?", "金在数学课上喜欢做什么？"],
          ["Add and take away", "做加法和减法"],
          [
            ["Count to ten", "数到十"],
            ["Draw shapes", "画图形"],
            ["Tell the time", "认时间"],
          ],
          ['The text says, "Kim likes to add and take away."', "短文说：“金喜欢做加法和减法。”"],
          [
            ["Counting to ten is not what the story says she likes.", "故事没说她喜欢数到十。"],
            ["Drawing shapes is not in the story. Kim likes to add and take away.", "故事里没有画图形。金喜欢加法和减法。"],
            ["Telling the time is not named. She likes adding and taking away.", "文中没提认时间。她喜欢加减法。"],
          ],
        ),
        ask(
          ["What does Kim play with her friends?", "金和朋友们玩什么？"],
          ["Tag", "捉人游戏"],
          [
            ["Ball", "球"],
            ["Cards", "纸牌"],
            ["Hide and seek", "捉迷藏"],
          ],
          ['The text says, "Then she plays tag with her friends."', "短文说：“然后她和朋友们玩捉人游戏。”"],
          [
            ["Ball is not named. Kim plays tag.", "文中没提球。金玩捉人游戏。"],
            ["Cards are not in the story. Kim plays tag with her friends.", "故事里没有纸牌。金和朋友玩捉人游戏。"],
            ["Hide and seek is a different game. The story says tag.", "捉迷藏是另一种游戏。故事说的是捉人游戏。"],
          ],
        ),
        ask(
          ["What tells the class it is time to go home?", "什么提醒全班该回家了？"],
          ["The bell rings", "铃响了"],
          [
            ["The teacher reads a story", "老师读了一个故事"],
            ["Kim paints a whale", "金画了一头鲸"],
            ["The bus honks", "公共汽车按喇叭"],
          ],
          ['The text says, "When the bell rings, it is time to go home."', "短文说：“铃一响，就该回家了。”"],
          [
            ["The teacher reading a story happens in the morning.", "老师讲故事是在上午。"],
            ["Kim painting a whale is what she does before the end, not the signal to go.", "金画鲸鱼是放学前做的事，不是回家的信号。"],
            ["A bus honking is not in the story. The bell rings.", "故事里没有公交车鸣笛。是铃声响了。"],
          ],
        ),
      ],
      ["Kim"],
    ),
    passage(
      "ben-helps-at-home",
      t("Ben Helps at Home", "本在家帮忙"),
      `Ben likes to help at home. Every day, he has a job to do.

On Monday, he feeds the cat. On Tuesday, he waters the plants. On Wednesday, he helps Dad wash the dishes. On Thursday, he puts away his toys. On Friday, he helps Mom fold the clothes.

Ben's jobs are not hard, but they help the family a lot. Mom says that when we all help, the work gets done fast. Then there is more time to play!`,
      [order, facts],
      [
        ask(
          ["What does Ben do on Monday?", "本星期一做什么？"],
          ["He feeds the cat", "他喂猫"],
          [
            ["He waters the plants", "他给植物浇水"],
            ["He washes the dishes", "他洗碗"],
            ["He folds the clothes", "他叠衣服"],
          ],
          ['The text says, "On Monday, he feeds the cat."', "短文说：“星期一，他喂猫。”"],
          [
            ["Watering the plants is his Tuesday job.", "浇花是他星期二的活儿。"],
            ["Washing the dishes is his Wednesday job.", "洗碗是他星期三的活儿。"],
            ["Folding the clothes is his Friday job.", "叠衣服是他星期五的活儿。"],
          ],
        ),
        ask(
          ["Who does Ben help wash the dishes?", "本帮谁洗碗？"],
          ["Dad", "爸爸"],
          [
            ["Mom", "妈妈"],
            ["His sister", "他的姐姐"],
            ["The cat", "猫"],
          ],
          ["The text says that on Wednesday he helps Dad wash the dishes.", "短文说星期三他帮爸爸洗碗。"],
          [
            ["Mom is who Ben helps on Friday with the clothes.", "妈妈是本星期五帮着叠衣服的人。"],
            ["His sister is not in this story.", "这个故事里没有他的姐妹。"],
            ["The cat is the one Ben feeds on Monday.", "猫是本星期一喂的。"],
          ],
        ),
        ask(
          ["Why does Mom say it is good when we all help?", "妈妈为什么说大家都帮忙很好？"],
          ["The work gets done fast", "活儿很快就干完了"],
          [
            ["The cat gets fed", "猫能吃到东西"],
            ["The toys get lost", "玩具会丢"],
            ["The plants get dry", "植物会变干"],
          ],
          [
            "Mom says that when we all help, the work gets done fast, and there is more time to play.",
            "妈妈说大家都帮忙，活儿就干得快，玩的时间就更多。",
          ],
          [
            ["The cat getting fed is one of Ben's jobs, not what Mom says.", "喂猫是本的一项活儿，不是妈妈说的话。"],
            ["Toys getting lost is not in the story. Ben puts his toys away.", "故事里没有玩具丢了。本会把玩具收好。"],
            ["Plants getting dry is the opposite. Ben waters them.", "花变干正好相反。本会给花浇水。"],
          ],
        ),
        ask(
          ["How often does Ben have a job to do?", "本多久有一项活儿要做？"],
          ["Every day", "每天"],
          [
            ["Once a week", "每周一次"],
            ["Only on Monday", "只在星期一"],
            ["Never", "从来没有"],
          ],
          ['The text says, "Every day, he has a job to do."', "短文说：“他每天都有一项活儿要做。”"],
          [
            ["Once a week is too little. Ben has a job every day.", "一周一次太少了。本每天都有活儿干。"],
            ["Only on Monday is wrong. He has a job each day of the week.", "只在星期一不对。他每天都有活儿。"],
            ["Never is the opposite of every day.", "从不和每天正好相反。"],
          ],
        ),
        ask(
          ["What does Ben do on Tuesday?", "本星期二做什么？"],
          ["He waters the plants", "他给植物浇水"],
          [
            ["He feeds the cat", "他喂猫"],
            ["He puts away his toys", "他收拾玩具"],
            ["He folds the clothes", "他叠衣服"],
          ],
          ['The text says, "On Tuesday, he waters the plants."', "短文说：“星期二，他给植物浇水。”"],
          [
            ["Feeding the cat is his Monday job.", "喂猫是他星期一的活儿。"],
            ["Putting away his toys is his Thursday job.", "收玩具是他星期四的活儿。"],
            ["Folding the clothes is his Friday job.", "叠衣服是他星期五的活儿。"],
          ],
        ),
        ask(
          ["On which day does Ben help wash the dishes?", "本哪天帮忙洗碗？"],
          ["Wednesday", "星期三"],
          [
            ["Monday", "星期一"],
            ["Thursday", "星期四"],
            ["Friday", "星期五"],
          ],
          ['The text says, "On Wednesday, he helps Dad wash the dishes."', "短文说：“星期三，他帮爸爸洗碗。”"],
          [
            ["Monday is the day he feeds the cat.", "星期一他喂猫。"],
            ["Thursday is the day he puts away his toys.", "星期四他收玩具。"],
            ["Friday is the day he helps fold the clothes.", "星期五他帮着叠衣服。"],
          ],
        ),
        ask(
          ["What does Ben do on Thursday?", "本星期四做什么？"],
          ["He puts away his toys", "他收拾玩具"],
          [
            ["He waters the plants", "他给植物浇水"],
            ["He feeds the cat", "他喂猫"],
            ["He washes the dishes", "他洗碗"],
          ],
          ['The text says, "On Thursday, he puts away his toys."', "短文说：“星期四，他收拾玩具。”"],
          [
            ["Watering the plants is on Tuesday.", "浇花是在星期二。"],
            ["Feeding the cat is on Monday.", "喂猫是在星期一。"],
            ["Washing the dishes is on Wednesday.", "洗碗是在星期三。"],
          ],
        ),
        ask(
          ["Who does Ben help on Friday?", "本星期五帮谁？"],
          ["Mom", "妈妈"],
          [
            ["Dad", "爸爸"],
            ["His sister", "他的姐姐"],
            ["His teacher", "他的老师"],
          ],
          ['The text says, "On Friday, he helps Mom fold the clothes."', "短文说：“星期五，他帮妈妈叠衣服。”"],
          [
            ["Dad is who Ben helps on Wednesday with the dishes.", "爸爸是本星期三帮着洗碗的人。"],
            ["His sister is not in this story.", "这个故事里没有他的姐妹。"],
            ["His teacher is not in this story. On Friday he helps Mom.", "这个故事里没有老师。星期五他帮妈妈。"],
          ],
        ),
        ask(
          ["What does Ben help Mom do?", "本帮妈妈做什么？"],
          ["Fold the clothes", "叠衣服"],
          [
            ["Wash the dishes", "洗碗"],
            ["Feed the cat", "喂猫"],
            ["Cook the dinner", "做晚饭"],
          ],
          ["Ben helps Mom fold the clothes on Friday.", "本星期五帮妈妈叠衣服。"],
          [
            ["Washing the dishes is what Ben helps Dad do.", "洗碗是本帮爸爸做的事。"],
            ["Feeding the cat is Ben's own Monday job, not helping Mom.", "喂猫是本自己星期一的活儿，不是帮妈妈。"],
            ["Cooking dinner is not in the story.", "故事里没有做晚饭。"],
          ],
        ),
        ask(
          ["What is there more time for when the work gets done fast?", "活儿干得快了，就有更多时间做什么？"],
          ["To play", "玩"],
          [
            ["To sleep", "睡觉"],
            ["To do more jobs", "干更多活儿"],
            ["To read", "读书"],
          ],
          ['The text says, "Then there is more time to play!"', "短文说：“那样就有更多时间玩了！”"],
          [
            ["Sleeping is not what Mom says. She says more time to play.", "妈妈没说睡觉，她说的是有更多时间玩。"],
            ["More jobs is the opposite. Getting work done fast leaves time to play.", "做更多的活儿正好相反。活儿干得快就有时间玩。"],
            ["Reading is not named at the end. The last word is play.", "结尾没提读书。最后一个词是玩。"],
          ],
        ),
      ],
      ["Ben"],
    ),
    passage(
      "the-lost-lunch-box",
      t("The Lost Lunch Box", "丢失的午餐盒"),
      `It was time for lunch, but Sam could not find his lunch box. It was green, with a frog on the lid.

Sam looked in his bag. It was not there. He looked under his desk. It was not there. He looked by the door. It was not there.

Sam felt sad. His friend Ann said, "I will help you look." They went back to the bus stop. There it was, on the bench!

Sam was glad. He gave Ann a big hug and shared his grapes with her.`,
      [who, order],
      [
        ask(
          ["What did the lunch box look like?", "午餐盒是什么样子的？"],
          ["Green, with a frog on the lid", "绿色的，盖子上有一只青蛙"],
          [
            ["Red, with a cat on it", "红色的，上面有一只猫"],
            ["Blue, with a ship on it", "蓝色的，上面有一艘船"],
            ["Black, with no lid", "黑色的，没有盖子"],
          ],
          ["The story says it was green, with a frog on the lid.", "故事说它是绿色的，盖子上有一只青蛙。"],
          [
            ["Red with a cat is not Sam's lunch box. It was green, with a frog.", "红色、印着猫的不是萨姆的饭盒。它是绿色的，上面有青蛙。"],
            ["Blue with a ship is wrong. The lid had a frog on it.", "蓝色、印着船不对。盖子上是一只青蛙。"],
            ["Black with no lid is wrong. It had a lid, with a frog on it.", "黑色、没盖子不对。它有盖子，上面有青蛙。"],
          ],
        ),
        ask(
          ["Where did they find the lunch box?", "他们在哪里找到了午餐盒？"],
          ["On the bench at the bus stop", "在公共汽车站的长凳上"],
          [
            ["In Sam's bag", "在萨姆的书包里"],
            ["Under the desk", "在桌子下面"],
            ["By the door", "在门边"],
          ],
          ["Sam and Ann went back to the bus stop, and the lunch box was on the bench.", "萨姆和安回到公共汽车站，午餐盒就在长凳上。"],
          [
            ["Sam's bag is the first place he looked, and it was not there.", "萨姆的书包是他最先找的地方，饭盒不在那儿。"],
            ["Under the desk is the second place he looked, and it was not there.", "课桌下是他第二个找的地方，饭盒也不在。"],
            ["By the door is the third place he looked, and it was not there.", "门边是他第三个找的地方，饭盒还是不在。"],
          ],
        ),
        ask(
          ["How did Sam thank Ann?", "萨姆怎样感谢安？"],
          ["He hugged her and shared his grapes", "他拥抱了她，还和她分享葡萄"],
          [
            ["He gave her his lunch box", "他把午餐盒给了她"],
            ["He sang her a song", "他给她唱了一首歌"],
            ["He drew her a picture", "他给她画了一幅画"],
          ],
          [
            "The last sentence says he gave Ann a big hug and shared his grapes with her.",
            "最后一句说他给了安一个大大的拥抱，还和她分享葡萄。",
          ],
          [
            ["Giving her his lunch box is wrong. He shared his grapes.", "把饭盒送给她不对。他分给她葡萄。"],
            ["Singing her a song is not in the story.", "故事里没有给她唱歌。"],
            ["Drawing her a picture is not in the story. He hugged her.", "故事里没有给她画画。他拥抱了她。"],
          ],
        ),
        ask(
          ["What was the problem at lunch time?", "午饭时出了什么问题？"],
          ["Sam could not find his lunch box", "萨姆找不到他的饭盒"],
          [
            ["Sam had no money", "萨姆没有钱"],
            ["Sam missed the bus", "萨姆没赶上公共汽车"],
            ["Sam was too full to eat", "萨姆太饱了吃不下"],
          ],
          ["The story says Sam could not find his lunch box.", "故事说萨姆找不到他的饭盒。"],
          [
            ["Having no money is not in the story. The lunch box was lost.", "故事里没说没钱。是饭盒不见了。"],
            ["Missing the bus is wrong. They went back to the bus stop to look.", "错过公交车不对。他们是回到车站去找。"],
            [
              "Being too full is the opposite. It was lunch time and his lunch was lost.",
              "吃得太饱正好相反。到了午饭时间，他的午饭却不见了。",
            ],
          ],
        ),
        ask(
          ["Where did Sam look first?", "萨姆先在哪里找？"],
          ["In his bag", "在他的书包里"],
          [
            ["Under his desk", "在他的课桌下"],
            ["By the door", "在门边"],
            ["At the bus stop", "在公共汽车站"],
          ],
          ['The story says, "Sam looked in his bag."', "故事说：“萨姆在书包里找。”"],
          [
            ["Under his desk was the second place, after his bag.", "课桌下是第二个地方，在书包之后。"],
            ["By the door was the third place he looked.", "门边是他第三个找的地方。"],
            ["The bus stop came last, when Ann helped him.", "车站是最后去的，那时安在帮他。"],
          ],
        ),
        ask(
          ["Where did Sam look after his bag?", "找完书包后，萨姆在哪里找？"],
          ["Under his desk", "在他的课桌下"],
          [
            ["At the bus stop", "在公共汽车站"],
            ["In the garden", "在花园里"],
            ["On the bench", "在长椅上"],
          ],
          ["After his bag, Sam looked under his desk.", "找完书包后，萨姆在课桌下找。"],
          [
            ["The bus stop was the last place, where they found it.", "车站是最后去的地方，在那儿找到了。"],
            ["The garden is not in the story.", "故事里没有花园。"],
            ["The bench is where they found it at the end, not his second try.", "长椅是最后找到它的地方，不是他第二次找的地方。"],
          ],
        ),
        ask(
          ["How did Sam feel when he could not find it?", "萨姆找不到饭盒时有什么感受？"],
          ["Sad", "难过"],
          [
            ["Glad", "高兴"],
            ["Angry", "生气"],
            ["Sleepy", "困"],
          ],
          ['The story says, "Sam felt sad."', "故事说：“萨姆很难过。”"],
          [
            ["Glad is how Sam felt at the end, when they found it.", "高兴是萨姆最后找到饭盒时的感受。"],
            ["Angry is not said. The story says Sam felt sad.", "文中没说生气。故事说萨姆很难过。"],
            ["Sleepy is not in the story. Sam felt sad.", "故事里没有困。萨姆感到难过。"],
          ],
        ),
        ask(
          ["Who helped Sam look?", "谁帮萨姆找？"],
          ["His friend Ann", "他的朋友安"],
          [
            ["His teacher", "他的老师"],
            ["His mom", "他的妈妈"],
            ["The bus driver", "公共汽车司机"],
          ],
          ['His friend Ann said, "I will help you look."', "他的朋友安说：“我帮你找。”"],
          [
            ["His teacher is not in the story.", "故事里没有他的老师。"],
            ["His mom is not in this story. Ann helped.", "这个故事里没有妈妈。是安帮的忙。"],
            ["The bus driver is not in the story. His friend Ann said she would help.", "故事里没有司机。是他的朋友安说要帮忙。"],
          ],
        ),
        ask(
          ["Where did Sam and Ann go to look?", "萨姆和安去哪里找了？"],
          ["Back to the bus stop", "回到公共汽车站"],
          [
            ["To the kitchen", "到厨房"],
            ["To the park", "到公园"],
            ["Home", "回家"],
          ],
          ['The story says, "They went back to the bus stop."', "故事说：“他们回到了公共汽车站。”"],
          [
            ["The kitchen is not in the story.", "故事里没有厨房。"],
            ["The park is not in the story. They went back to the bus stop.", "故事里没有公园。他们回到了车站。"],
            ["Going home is wrong. They went back to the bus stop.", "回家不对。他们回到了车站。"],
          ],
        ),
        ask(
          ["How did Sam feel when they found it?", "找到饭盒时萨姆有什么感受？"],
          ["Glad", "高兴"],
          [
            ["Sad", "难过"],
            ["Scared", "害怕"],
            ["Bored", "无聊"],
          ],
          ['The story says, "Sam was glad."', "故事说：“萨姆很高兴。”"],
          [
            ["Sad is how Sam felt before they found it.", "难过是萨姆找到饭盒之前的感受。"],
            ["Scared is not in the story. Sam was glad.", "故事里没有害怕。萨姆很高兴。"],
            ["Bored is not in the story. Sam was glad and hugged Ann.", "故事里没有无聊。萨姆很高兴，拥抱了安。"],
          ],
        ),
      ],
      ["Sam", "Ann"],
    ),
  ],
};

/** weatherAndSeasons is the reading unit of grade 1 on rain, snow and the seasons. */
export const weatherAndSeasons: ReadingUnitDef = {
  id: "weather-and-seasons",
  title: t("Weather and Seasons", "天气和季节"),
  passages: [
    passage(
      "rain-rain",
      t("Rain, Rain", "下雨了"),
      `Drip, drop, drip. It is raining. Meg looks out the window. She wants to play in the park, but it is too wet.

"Can I go out?" Meg asks. "Put on your coat and boots," says Mom.

Meg puts on her yellow coat and her red boots. She runs out and jumps in a big puddle. Splash! Then she sees a worm on the path. Worms come up when it rains.

At last, the sun comes out, and Meg sees a rainbow in the sky.`,
      [who, order],
      [
        ask(
          ["What did Meg put on to go out?", "梅格出门前穿了什么？"],
          ["A yellow coat and red boots", "黄色的外套和红色的靴子"],
          [
            ["A hat and gloves", "帽子和手套"],
            ["A swimsuit", "游泳衣"],
            ["Her socks and no shoes", "只穿袜子不穿鞋"],
          ],
          ["The story says Meg puts on her yellow coat and her red boots.", "故事说梅格穿上了黄色的外套和红色的靴子。"],
          [
            ["A hat and gloves are not named. Meg put on her coat and boots.", "文中没提帽子和手套。梅格穿上了外套和靴子。"],
            ["A swimsuit is not in the story. It was raining, so she wore a coat.", "故事里没有泳衣。下着雨，所以她穿了外套。"],
            ["Socks and no shoes is wrong. She wore red boots.", "只穿袜子不对。她穿了红靴子。"],
          ],
        ),
        ask(
          ["What did Meg see on the path?", "梅格在小路上看到了什么？"],
          ["A worm", "一条虫子"],
          [
            ["A frog", "一只青蛙"],
            ["A cat", "一只猫"],
            ["A ball", "一个球"],
          ],
          ["The story says she sees a worm on the path.", "故事说她在小路上看到了一条虫子。"],
          [
            ["A frog is not in the story. Meg saw a worm.", "故事里没有青蛙。梅格看到了一条虫子。"],
            ["A cat is not in the story. A worm came up in the rain.", "故事里没有猫。下雨时一条虫子钻了出来。"],
            ["A ball is not in the story. She saw a worm on the path.", "故事里没有球。她在小路上看到一条虫子。"],
          ],
        ),
        ask(
          ["What did Meg see at the end?", "最后梅格看到了什么？"],
          ["A rainbow", "一道彩虹"],
          [
            ["Snow", "雪"],
            ["The moon", "月亮"],
            ["A storm", "一场暴风雨"],
          ],
          ["At last the sun comes out, and Meg sees a rainbow in the sky.", "最后太阳出来了，梅格看到天上有一道彩虹。"],
          [
            ["Snow is not in this story. It was rain.", "这个故事里没有雪，下的是雨。"],
            ["The moon is not in the story. The sun came out.", "故事里没有月亮。是太阳出来了。"],
            ["A storm is not at the end. The sun came out and she saw a rainbow.", "结尾不是暴风雨。太阳出来了，她看到了彩虹。"],
          ],
        ),
        ask(
          ["What sound does the rain make at the start?", "开头雨发出什么声音？"],
          ["Drip, drop, drip", "滴答，滴答"],
          [
            ["Boom, boom", "轰隆，轰隆"],
            ["Splash, splash", "哗啦，哗啦"],
            ["Buzz, buzz", "嗡嗡"],
          ],
          ['The story starts, "Drip, drop, drip. It is raining."', "故事开头说：“滴答，滴答，下雨了。”"],
          [
            ["Boom, boom is a loud sound, like a drum, not the rain here.", "“轰隆隆”是很响的声音，像鼓声，不是这里的雨声。"],
            ["Splash is the sound when Meg jumps in a puddle, later on.", "“扑通”是梅格后来跳进水坑的声音。"],
            ["Buzz, buzz is the sound of a bee, not rain.", "“嗡嗡”是蜜蜂的声音，不是雨声。"],
          ],
        ),
        ask(
          ["Where does Meg want to play?", "梅格想去哪里玩？"],
          ["In the park", "在公园里"],
          [
            ["At school", "在学校"],
            ["In the kitchen", "在厨房里"],
            ["At the beach", "在海滩上"],
          ],
          ["Meg wants to play in the park.", "梅格想去公园玩。"],
          [
            ["At school is not in the story. Meg wants to play in the park.", "故事里没有学校。梅格想去公园玩。"],
            ["The kitchen is not where she wants to play.", "她不是想在厨房玩。"],
            ["The beach is not in the story. She wants to go to the park.", "故事里没有海滩。她想去公园。"],
          ],
        ),
        ask(
          ["Why can Meg not play in the park at first?", "一开始梅格为什么不能去公园玩？"],
          ["It is too wet", "太湿了"],
          [
            ["It is too hot", "太热了"],
            ["It is too dark", "太黑了"],
            ["The park is shut", "公园关门了"],
          ],
          ["The story says she wants to play in the park, but it is too wet.", "故事说她想去公园玩，但太湿了。"],
          [
            ["Too hot is the opposite. It is raining.", "太热正好相反。外面在下雨。"],
            ["Too dark is not said. The problem is the rain.", "文中没说太黑。问题是下雨。"],
            ["The park being shut is not in the story. It is just too wet.", "故事里没说公园关门。只是太湿了。"],
          ],
        ),
        ask(
          ["Who tells Meg to put on her coat and boots?", "谁让梅格穿上外套和靴子？"],
          ["Mom", "妈妈"],
          [
            ["Dad", "爸爸"],
            ["Gran", "奶奶"],
            ["Her teacher", "她的老师"],
          ],
          ['"Put on your coat and boots," says Mom.', "妈妈说：“穿上外套和靴子。”"],
          [
            ["Dad is not in this story. Mom says it.", "这个故事里没有爸爸。是妈妈说的。"],
            ["Gran is not in this story.", "这个故事里没有奶奶。"],
            ["Her teacher is not in this story. Mom answers Meg.", "这个故事里没有老师。是妈妈回答梅格。"],
          ],
        ),
        ask(
          ["What color are Meg's boots?", "梅格的靴子是什么颜色的？"],
          ["Red", "红色"],
          [
            ["Yellow", "黄色"],
            ["Blue", "蓝色"],
            ["Green", "绿色"],
          ],
          ["Meg puts on her yellow coat and her red boots.", "梅格穿上黄外套和红靴子。"],
          [
            ["Yellow is her coat, not her boots.", "黄色是她的外套，不是靴子。"],
            ["Blue is not in the story. Her boots are red.", "故事里没有蓝色。她的靴子是红的。"],
            ["Green is not in the story. The boots are red.", "故事里没有绿色。靴子是红色的。"],
          ],
        ),
        ask(
          ["What does Meg jump in?", "梅格跳进了什么？"],
          ["A big puddle", "一个大水坑"],
          [
            ["A pile of leaves", "一堆树叶"],
            ["A pool", "一个泳池"],
            ["The snow", "雪里"],
          ],
          ["She runs out and jumps in a big puddle. Splash!", "她跑出去，跳进一个大水坑。哗啦！"],
          [
            ["A pile of leaves is not in the story. It is a rainy day.", "故事里没有落叶堆。那天在下雨。"],
            ["A pool is not where she jumps. She jumps in a puddle.", "她不是跳进游泳池，是跳进水坑。"],
            ["The snow is wrong. It is rain, so there are puddles.", "雪不对。下的是雨，所以有水坑。"],
          ],
        ),
        ask(
          ["When do worms come up?", "虫子什么时候爬出来？"],
          ["When it rains", "下雨的时候"],
          [
            ["When it snows", "下雪的时候"],
            ["When it is hot", "天热的时候"],
            ["At night", "晚上"],
          ],
          ['The story says, "Worms come up when it rains."', "故事说：“下雨时虫子会爬出来。”"],
          [
            ["When it snows is wrong. The story says worms come up when it rains.", "下雪时不对。故事说下雨时虫子会钻出来。"],
            ["When it is hot is the opposite of a rainy day.", "天热时和下雨天正好相反。"],
            ["At night is not said. The story says when it rains.", "文中没说晚上，说的是下雨时。"],
          ],
        ),
      ],
      ["Meg"],
    ),
    passage(
      "fun-in-the-snow",
      t("Fun in the Snow", "雪中的乐趣"),
      `When Tom woke up, the world was white. Snow was on the trees, on the cars and on the grass.

Tom put on his hat, his coat and his mittens. He went out with his sister Jen. They made a big snowman. Jen gave it two black stones for eyes and a carrot for a nose. Tom gave it his old red scarf.

Then they slid down the hill on a sled. It was fast and fun! When their hands got cold, they went in for hot milk.`,
      [order, who],
      [
        ask(
          ["What did the world look like when Tom woke up?", "汤姆醒来时外面是什么样子的？"],
          ["It was white with snow", "到处是白白的雪"],
          [
            ["It was wet with rain", "到处湿漉漉的"],
            ["It was hot and sunny", "又热又晴"],
            ["It was dark and windy", "又黑又刮风"],
          ],
          ["The story says the world was white, with snow on the trees, cars and grass.", "故事说外面一片白，树上、车上和草地上都是雪。"],
          [
            ["Wet with rain is wrong. It was snow, not rain.", "被雨淋湿不对。下的是雪，不是雨。"],
            ["Hot and sunny is the opposite. It was a snowy day.", "又热又晴正好相反。那天下了雪。"],
            ["Dark and windy is not said. The world was white.", "文中没说又黑又刮风。外面一片白。"],
          ],
        ),
        ask(
          ["What did Jen use for the snowman's nose?", "珍用什么做雪人的鼻子？"],
          ["A carrot", "一根胡萝卜"],
          [
            ["A black stone", "一块黑石头"],
            ["A red scarf", "一条红围巾"],
            ["A stick", "一根树枝"],
          ],
          ["The story says Jen gave it a carrot for a nose.", "故事说珍给雪人装了一根胡萝卜当鼻子。"],
          [
            ["A black stone is what Jen used for the eyes.", "黑石头是简用来做眼睛的。"],
            ["A red scarf is what Tom gave the snowman.", "红围巾是汤姆给雪人的。"],
            ["A stick is not in the story. Jen used a carrot for the nose.", "故事里没有树枝。简用胡萝卜做鼻子。"],
          ],
        ),
        ask(
          ["Why did they go in?", "他们为什么进屋了？"],
          ["Their hands got cold", "他们的手冻冷了"],
          [
            ["It got dark", "天黑了"],
            ["The snowman fell", "雪人倒了"],
            ["Mom called them", "妈妈叫他们"],
          ],
          [
            "The last sentence says that when their hands got cold, they went in for hot milk.",
            "最后一句说，他们的手冻冷了，就进屋喝热牛奶。",
          ],
          [
            ["Getting dark is not in the story. Their hands got cold.", "故事里没有天黑。是他们的手冻冷了。"],
            ["The snowman falling is not in the story.", "故事里没有雪人倒了。"],
            ["Mom calling them is not in the story. They went in because of cold hands.", "故事里没有妈妈叫他们。他们进屋是因为手冷。"],
          ],
        ),
        ask(
          ["Where was the snow?", "雪落在哪里？"],
          ["On the trees, the cars and the grass", "树上、车上和草地上"],
          [
            ["Only on the roof", "只在屋顶上"],
            ["Only in the park", "只在公园里"],
            ["Inside the house", "屋子里"],
          ],
          ["Snow was on the trees, on the cars and on the grass.", "树上、车上和草地上都有雪。"],
          [
            ["Only on the roof is wrong. Snow was on the trees, the cars and the grass.", "只在屋顶上不对。树上、车上、草地上都有雪。"],
            ["Only in the park is wrong. The park is not named.", "只在公园里不对。文中没提公园。"],
            ["Inside the house is wrong. The snow was outside.", "屋里不对。雪在外面。"],
          ],
        ),
        ask(
          ["What did Tom put on?", "汤姆穿戴了什么？"],
          ["His hat, his coat and his mittens", "帽子、外套和连指手套"],
          [
            ["His boots and a scarf", "靴子和围巾"],
            ["His swim suit", "泳衣"],
            ["His red coat only", "只穿了红外套"],
          ],
          ["Tom put on his hat, his coat and his mittens.", "汤姆戴上帽子，穿上外套，戴上连指手套。"],
          [
            ["Boots and a scarf are not what he put on. His scarf went to the snowman.", "靴子和围巾不是他穿戴的。他的围巾给了雪人。"],
            ["A swim suit is not in the story. It was snowing.", "故事里没有泳衣。外面在下雪。"],
            [
              "His red coat only is wrong. Red was his old scarf, and he wore a hat and mittens too.",
              "只穿红外套不对。红色的是他的旧围巾，他还戴了帽子和手套。",
            ],
          ],
        ),
        ask(
          ["Who went out with Tom?", "谁和汤姆一起出去了？"],
          ["His sister Jen", "他的姐姐珍"],
          [
            ["His dad", "他的爸爸"],
            ["His friend Max", "他的朋友麦克斯"],
            ["His dog", "他的狗"],
          ],
          ["He went out with his sister Jen.", "他和姐姐珍一起出去了。"],
          [
            ["His dad is not in this story. He went out with his sister.", "这个故事里没有爸爸。他和妹妹一起出去。"],
            ["Max is not in this story. Tom's sister Jen went with him.", "这个故事里没有马克斯。和汤姆一起的是妹妹简。"],
            ["His dog is not in this story.", "这个故事里没有狗。"],
          ],
        ),
        ask(
          ["What did they make?", "他们做了什么？"],
          ["A big snowman", "一个大雪人"],
          [
            ["A snow house", "一座雪屋"],
            ["A sled", "一个雪橇"],
            ["Snowballs only", "只做了雪球"],
          ],
          ['The story says, "They made a big snowman."', "故事说：“他们堆了一个大雪人。”"],
          [
            ["A snow house is not in the story. They made a snowman.", "故事里没有雪屋。他们堆了个雪人。"],
            ["A sled is something they rode, not something they made.", "雪橇是他们坐的，不是他们做的。"],
            ["Snowballs only is wrong. They made a big snowman.", "只做雪球不对。他们堆了一个大雪人。"],
          ],
        ),
        ask(
          ["What did Jen use for the snowman's eyes?", "珍用什么做雪人的眼睛？"],
          ["Two black stones", "两块黑石头"],
          [
            ["Two buttons", "两颗纽扣"],
            ["Two carrots", "两根胡萝卜"],
            ["Two leaves", "两片树叶"],
          ],
          ["Jen gave it two black stones for eyes.", "珍给它安上两块黑石头当眼睛。"],
          [
            ["Buttons are not in the story. Jen used two black stones.", "故事里没有纽扣。简用了两块黑石头。"],
            ["Two carrots is wrong. One carrot was the nose.", "两根胡萝卜不对。一根胡萝卜做了鼻子。"],
            ["Leaves are not in the story. The eyes were black stones.", "故事里没有树叶。眼睛是黑石头。"],
          ],
        ),
        ask(
          ["What did Tom give the snowman?", "汤姆给了雪人什么？"],
          ["His old red scarf", "他的旧红围巾"],
          [
            ["His new hat", "他的新帽子"],
            ["His mittens", "他的连指手套"],
            ["A carrot", "一根胡萝卜"],
          ],
          ["Tom gave it his old red scarf.", "汤姆给它围上了自己的旧红围巾。"],
          [
            ["His new hat is wrong. He gave his old scarf.", "新帽子不对。他给的是旧围巾。"],
            ["His mittens stayed on his hands. He gave the snowman his scarf.", "手套还戴在他手上。他把围巾给了雪人。"],
            ["A carrot is what Jen gave for the nose.", "胡萝卜是简给的鼻子。"],
          ],
        ),
        ask(
          ["What did they have when they went in?", "他们进屋后喝了什么？"],
          ["Hot milk", "热牛奶"],
          [
            ["Cold juice", "冷果汁"],
            ["Soup", "汤"],
            ["Tea", "茶"],
          ],
          ["When their hands got cold, they went in for hot milk.", "手冷了，他们就进屋喝热牛奶。"],
          [
            ["Cold juice is the opposite. They went in to warm up with hot milk.", "冷果汁正好相反。他们进屋喝热牛奶暖和一下。"],
            ["Soup is not in this story. They had hot milk.", "这个故事里没有汤。他们喝了热牛奶。"],
            ["Tea is not named. The story says hot milk.", "文中没提茶，说的是热牛奶。"],
          ],
        ),
      ],
      ["Tom", "Jen"],
    ),
    passage(
      "the-four-seasons",
      t("The Four Seasons", "四季"),
      `A year has four seasons. They are spring, summer, fall and winter.

In spring, the days get warm. Plants start to grow, and baby animals are born.

In summer, it is hot and sunny. The days are long. Lots of people swim and play outside.

In fall, the air gets cool. Leaves turn red and yellow, and they fall from the trees.

In winter, it is cold. In some places, snow falls. Then spring comes back again, and the year starts over.`,
      [facts],
      [
        ask(
          ["How many seasons are in a year?", "一年有几个季节？"],
          ["Four", "四个"],
          [
            ["Two", "两个"],
            ["Three", "三个"],
            ["Six", "六个"],
          ],
          ["The text says a year has four seasons: spring, summer, fall and winter.", "短文说一年有四个季节：春、夏、秋、冬。"],
          [
            ["Two is too few. The text names four: spring, summer, fall and winter.", "两个太少了。文中列了四个：春、夏、秋、冬。"],
            ["Three is one too few. Count them: spring, summer, fall, winter.", "三个少了一个。数一数：春、夏、秋、冬。"],
            ["Six is too many. A year has four seasons.", "六个太多了。一年有四个季节。"],
          ],
        ),
        ask(
          ["When do leaves turn red and yellow?", "树叶什么时候变红变黄？"],
          ["In fall", "秋天"],
          [
            ["In spring", "春天"],
            ["In summer", "夏天"],
            ["In winter", "冬天"],
          ],
          ["The text says that in fall, leaves turn red and yellow.", "短文说秋天树叶变红变黄。"],
          [
            ["In spring, plants grow. Leaves change color later in the year.", "春天植物生长。树叶变色是一年里晚些时候。"],
            ["In summer, it is hot and sunny. Leaves change after that.", "夏天又热又晴。树叶在那之后才变色。"],
            ["In winter, it is cold. The leaves have already fallen.", "冬天很冷，树叶早已落光。"],
          ],
        ),
        ask(
          ["What happens in spring?", "春天会发生什么？"],
          ["Plants grow and baby animals are born", "植物生长，小动物出生"],
          [
            ["Snow falls", "下雪"],
            ["Leaves fall from the trees", "树叶从树上落下"],
            ["The days get cold", "天气变冷"],
          ],
          ["The text says that in spring, plants start to grow and baby animals are born.", "短文说春天植物开始生长，小动物出生。"],
          [
            ["Snow falls in winter, not spring.", "下雪是在冬天，不是春天。"],
            ["Leaves fall from the trees in fall.", "树叶在秋天落下。"],
            ["Cold days are winter. In spring the days get warm.", "冷天是冬天。春天天气变暖。"],
          ],
        ),
        ask(
          ["Which season comes after spring?", "春天之后是哪个季节？"],
          ["Summer", "夏天"],
          [
            ["Winter", "冬天"],
            ["Fall", "秋天"],
            ["Spring again", "又是春天"],
          ],
          ["The seasons are spring, summer, fall and winter.", "四季是春、夏、秋、冬。"],
          [
            ["Winter comes before spring, at the end of the year.", "冬天在春天之前，在一年的末尾。"],
            ["Fall comes after summer, not right after spring.", "秋天在夏天之后，不是紧跟春天。"],
            ["Spring again comes only after winter.", "春天要等冬天过后才会再来。"],
          ],
        ),
        ask(
          ["What are the days like in spring?", "春天的日子是什么样的？"],
          ["They get warm", "变暖和"],
          [
            ["They get cold", "变冷"],
            ["They get dark", "变黑"],
            ["They are snowy", "下雪"],
          ],
          ['The text says, "In spring, the days get warm."', "短文说：“春天，天气变暖和。”"],
          [
            ["Getting cold is winter.", "变冷是冬天。"],
            ["Getting dark is not said about spring.", "文中没说春天会变暗。"],
            ["Snowy days are winter, not spring.", "下雪是冬天，不是春天。"],
          ],
        ),
        ask(
          ["What is summer like?", "夏天是什么样的？"],
          ["Hot and sunny", "炎热、晴朗"],
          [
            ["Cold and snowy", "寒冷、下雪"],
            ["Cool and windy", "凉爽、有风"],
            ["Wet and dark", "潮湿、昏暗"],
          ],
          ['The text says, "In summer, it is hot and sunny."', "短文说：“夏天炎热又晴朗。”"],
          [
            ["Cold and snowy is winter.", "又冷又下雪是冬天。"],
            ["Cool and windy sounds like fall, when the air gets cool.", "又凉又刮风像秋天，那时空气变凉。"],
            ["Wet and dark is not said about any season here.", "文中没有哪个季节被说成又湿又暗。"],
          ],
        ),
        ask(
          ["What do lots of people do in summer?", "夏天很多人做什么？"],
          ["Swim and play outside", "游泳和在户外玩"],
          [
            ["Make snowmen", "堆雪人"],
            ["Rake leaves", "扫落叶"],
            ["Stay in bed", "待在床上"],
          ],
          ["Lots of people swim and play outside in summer.", "夏天很多人游泳、在户外玩。"],
          [
            ["Making snowmen goes with snow in winter.", "堆雪人是冬天下雪时的事。"],
            ["Raking leaves goes with fall, when leaves drop.", "耙树叶是秋天落叶时的事。"],
            ["Staying in bed is not in the text. People go outside in summer.", "文中没有待在床上。夏天人们去户外。"],
          ],
        ),
        ask(
          ["What does the air do in fall?", "秋天空气怎样变化？"],
          ["It gets cool", "变凉"],
          [
            ["It gets hot", "变热"],
            ["It gets wet", "变湿"],
            ["It stays the same", "保持不变"],
          ],
          ['The text says, "In fall, the air gets cool."', "短文说：“秋天，空气变凉了。”"],
          [
            ["Getting hot is summer.", "变热是夏天。"],
            ["Getting wet is not said about fall.", "文中没说秋天会变湿。"],
            ["Staying the same is wrong. The text says the air gets cool.", "保持不变不对。文中说空气变凉了。"],
          ],
        ),
        ask(
          ["What happens in some places in winter?", "冬天有些地方会发生什么？"],
          ["Snow falls", "下雪"],
          [
            ["Leaves turn red", "树叶变红"],
            ["Baby animals are born", "小动物出生"],
            ["The days get long", "白天变长"],
          ],
          ["The text says that in winter, snow falls in some places.", "短文说冬天有些地方会下雪。"],
          [
            ["Leaves turning red is fall.", "树叶变红是秋天。"],
            ["Baby animals being born is spring.", "小动物出生是春天。"],
            ["Long days are summer.", "白天长是夏天。"],
          ],
        ),
        ask(
          ["What comes back after winter?", "冬天之后什么又回来了？"],
          ["Spring", "春天"],
          [
            ["Summer", "夏天"],
            ["Fall", "秋天"],
            ["Snow", "雪"],
          ],
          ['The text says, "Then spring comes back again, and the year starts over."', "短文说：“然后春天又回来了，新的一年重新开始。”"],
          [
            ["Summer comes after spring, not right after winter.", "夏天在春天之后，不是紧跟冬天。"],
            ["Fall comes after summer.", "秋天在夏天之后。"],
            ["Snow is part of winter, not the season that comes back after it.", "雪是冬天的一部分，不是冬天之后回来的季节。"],
          ],
        ),
      ],
    ),
  ],
};

/** foodAndFriends is the reading unit of grade 1 on sharing food and where food comes from. */
export const foodAndFriends: ReadingUnitDef = {
  id: "food-and-friends",
  title: t("Food and Friends", "食物和朋友"),
  passages: [
    passage(
      "soup-for-gran",
      t("Soup for Gran", "给奶奶的汤"),
      `Gran was sick in bed. Lily wanted to help her feel better. "Let us make her some soup," said Dad.

First, they washed the carrots and the beans. Next, Dad cut them up, and Lily put them in the pot. Then they added water and a little salt. The soup cooked for a long time. The kitchen smelled so good!

Last, Lily took a hot bowl of soup to Gran. Gran ate it all up. "This is the best soup I have ever had," she said with a smile.`,
      [order, who],
      [
        ask(
          ["Why did Lily and Dad make soup?", "莉莉和爸爸为什么做汤？"],
          ["Gran was sick", "奶奶生病了"],
          [
            ["It was a birthday", "那天是生日"],
            ["Lily was hungry", "莉莉饿了"],
            ["It was cold out", "外面很冷"],
          ],
          ["The story says Gran was sick in bed, and Lily wanted to help her feel better.", "故事说奶奶生病躺在床上，莉莉想让她好受一些。"],
          [
            ["A birthday is not in this story.", "这个故事里没有生日。"],
            ["Lily being hungry is not the reason. She wanted Gran to feel better.", "不是因为莉莉饿了。她想让奶奶好起来。"],
            ["Cold weather is not in the story. Gran was sick.", "故事里没有天冷。是奶奶病了。"],
          ],
        ),
        ask(
          ["What did they do first?", "他们先做了什么？"],
          ["They washed the carrots and beans", "他们洗了胡萝卜和豆子"],
          [
            ["They added salt", "他们加了盐"],
            ["They took the soup to Gran", "他们把汤端给奶奶"],
            ["They cut up the carrots", "他们切了胡萝卜"],
          ],
          ['The story says, "First, they washed the carrots and the beans."', "故事说：“他们先洗了胡萝卜和豆子。”"],
          [
            ["Adding salt came later, with the water.", "加盐是后来的事，和加水一起。"],
            ["Taking soup to Gran was the last step.", "给奶奶端汤是最后一步。"],
            ["Cutting up the carrots came next, after washing them.", "切胡萝卜是第二步，在洗之后。"],
          ],
        ),
        ask(
          ["What did Gran think of the soup?", "奶奶觉得汤怎么样？"],
          ["It was the best soup she had ever had", "这是她喝过的最好的汤"],
          [
            ["It was too hot", "太烫了"],
            ["It needed more salt", "还要再加点盐"],
            ["She did not like beans", "她不喜欢豆子"],
          ],
          ['Gran said, "This is the best soup I have ever had."', "奶奶说：“这是我喝过的最好的汤。”"],
          [
            ["Too hot is not what Gran said. She ate it all.", "奶奶没说太烫。她全吃光了。"],
            ["More salt is not what she said. She loved it.", "她没说要多放盐。她很喜欢。"],
            ["Not liking beans is wrong. She ate it all up with a smile.", "不喜欢豆子不对。她笑着全吃光了。"],
          ],
        ),
        ask(
          ["Where was Gran?", "奶奶在哪里？"],
          ["Sick in bed", "生病躺在床上"],
          [
            ["In the kitchen", "在厨房里"],
            ["At the shop", "在商店里"],
            ["In the garden", "在花园里"],
          ],
          ['The story says, "Gran was sick in bed."', "故事说：“奶奶生病躺在床上。”"],
          [
            ["In the kitchen is where Lily and Dad cooked, not where Gran was.", "厨房是莉莉和爸爸做饭的地方，不是奶奶在的地方。"],
            ["At the shop is not in the story.", "故事里没有商店。"],
            ["In the garden is not in the story. Gran was sick in bed.", "故事里没有花园。奶奶生病躺在床上。"],
          ],
        ),
        ask(
          ["Who said they should make soup?", "谁说要做汤？"],
          ["Dad", "爸爸"],
          [
            ["Lily", "莉莉"],
            ["Gran", "奶奶"],
            ["Mom", "妈妈"],
          ],
          ['"Let us make her some soup," said Dad.', "爸爸说：“我们给她做点汤吧。”"],
          [
            ['Lily wanted to help, but Dad said, "Let us make her some soup."', "莉莉想帮忙，但说“我们给她做点汤吧”的是爸爸。"],
            ["Gran was sick in bed. She did not ask for soup.", "奶奶病在床上，她没有要汤。"],
            ["Mom is not in this story.", "这个故事里没有妈妈。"],
          ],
        ),
        ask(
          ["Who cut up the carrots and beans?", "谁切了胡萝卜和豆子？"],
          ["Dad", "爸爸"],
          [
            ["Lily", "莉莉"],
            ["Gran", "奶奶"],
            ["Nobody", "没有人"],
          ],
          ['The story says, "Next, Dad cut them up."', "故事说：“接着，爸爸把它们切好。”"],
          [
            ["Lily put them in the pot. Dad did the cutting.", "莉莉把它们放进锅里。切菜的是爸爸。"],
            ["Gran was sick in bed, not cooking.", "奶奶病在床上，没有做饭。"],
            ["Nobody is wrong. The story says Dad cut them up.", "没人切不对。故事说爸爸切的。"],
          ],
        ),
        ask(
          ["Who put the carrots and beans in the pot?", "谁把胡萝卜和豆子放进锅里？"],
          ["Lily", "莉莉"],
          [
            ["Dad", "爸爸"],
            ["Gran", "奶奶"],
            ["Mom", "妈妈"],
          ],
          ["Dad cut them up, and Lily put them in the pot.", "爸爸把它们切好，莉莉把它们放进锅里。"],
          [
            ["Dad cut them up. Lily put them in the pot.", "爸爸切菜，莉莉把菜放进锅里。"],
            ["Gran was sick in bed.", "奶奶病在床上。"],
            ["Mom is not in this story.", "这个故事里没有妈妈。"],
          ],
        ),
        ask(
          ["What did they add to the pot?", "他们往锅里加了什么？"],
          ["Water and a little salt", "水和一点盐"],
          [
            ["Milk and sugar", "牛奶和糖"],
            ["Rice", "米饭"],
            ["Apples", "苹果"],
          ],
          ['The story says, "Then they added water and a little salt."', "故事说：“然后他们加了水和一点盐。”"],
          [
            ["Milk and sugar are not in the soup.", "汤里没有牛奶和糖。"],
            ["Rice is not in the story. They added water and salt.", "故事里没有米饭。他们加了水和盐。"],
            ["Apples are not in the story. The soup has carrots and beans.", "故事里没有苹果。汤里有胡萝卜和豆子。"],
          ],
        ),
        ask(
          ["How did the kitchen smell?", "厨房闻起来怎么样？"],
          ["So good", "非常香"],
          [
            ["Bad", "很难闻"],
            ["Like smoke", "像烟味"],
            ["Like flowers", "像花香"],
          ],
          ['The story says, "The kitchen smelled so good!"', "故事说：“厨房闻起来真香！”"],
          [
            ["Bad is the opposite. The kitchen smelled so good.", "难闻正好相反。厨房好香啊。"],
            ["Smoke is not in the story. Nothing burned.", "故事里没有烟，什么都没烧焦。"],
            ["Flowers are not in the story. It smelled of good soup.", "故事里没有花。闻到的是好喝的汤香。"],
          ],
        ),
        ask(
          ["How much of the soup did Gran eat?", "奶奶喝了多少汤？"],
          ["All of it", "全喝光了"],
          [
            ["Just a little", "只喝了一点"],
            ["None of it", "一点也没喝"],
            ["Half of it", "喝了一半"],
          ],
          ['The story says, "Gran ate it all up."', "故事说：“奶奶把汤全喝光了。”"],
          [
            ["Just a little is wrong. Gran ate it all up.", "只吃一点不对。奶奶全吃光了。"],
            ["None of it is the opposite.", "一点没吃正好相反。"],
            ["Half of it is wrong. She ate all of it.", "吃一半不对。她吃完了。"],
          ],
        ),
      ],
      ["Lily"],
    ),
    passage(
      "a-picnic-in-the-park",
      t("A Picnic in the Park", "公园野餐"),
      `It was a sunny day, so Max and his friends had a picnic in the park. They sat on a big blanket under a tree.

Max brought sandwiches. Ann brought a bag of grapes. Dan brought a cake that his mom had made.

They were just about to eat when a little bird hopped up. It looked at the cake. Ann gave it a small crumb, and the bird flew off with it.

After lunch, they played catch with a ball. It was the best day!`,
      [who, facts],
      [
        ask(
          ["Where did the friends have their picnic?", "朋友们在哪里野餐？"],
          ["In the park, under a tree", "在公园里的一棵树下"],
          [
            ["At the beach", "在海滩上"],
            ["In the kitchen", "在厨房里"],
            ["At school", "在学校里"],
          ],
          ["The story says they had a picnic in the park and sat under a tree.", "故事说他们在公园野餐，坐在一棵树下。"],
          [
            ["The beach is not in the story. They were in the park.", "故事里没有海滩。他们在公园里。"],
            ["The kitchen is not where they ate. It was a picnic outside.", "他们不是在厨房吃的，这是户外野餐。"],
            ["At school is not in the story. The picnic was in the park.", "故事里没有学校。野餐在公园里。"],
          ],
        ),
        ask(
          ["What did Ann bring?", "安带了什么？"],
          ["A bag of grapes", "一袋葡萄"],
          [
            ["Sandwiches", "三明治"],
            ["A cake", "一块蛋糕"],
            ["A ball", "一个球"],
          ],
          ["The story says Ann brought a bag of grapes.", "故事说安带了一袋葡萄。"],
          [
            ["Sandwiches are what Max brought.", "三明治是马克斯带的。"],
            ["A cake is what Dan brought.", "蛋糕是丹带的。"],
            ["A ball is what they played with after lunch, not what Ann brought.", "球是他们午饭后玩的，不是安带的。"],
          ],
        ),
        ask(
          ["What did the bird take?", "小鸟拿走了什么？"],
          ["A small crumb of cake", "一小块蛋糕屑"],
          [
            ["A grape", "一颗葡萄"],
            ["A whole sandwich", "一整个三明治"],
            ["The ball", "那个球"],
          ],
          ["Ann gave the bird a small crumb, and it flew off with it.", "安给了小鸟一小块蛋糕屑，小鸟叼着它飞走了。"],
          [
            ["A grape is wrong. The bird looked at the cake and got a crumb.", "葡萄不对。小鸟看着蛋糕，得到了一点碎屑。"],
            ["A whole sandwich is too much. Ann gave it a small crumb.", "整个三明治太多了。安只给了它一点碎屑。"],
            ["The ball is what the friends played with after lunch.", "球是朋友们午饭后玩的。"],
          ],
        ),
        ask(
          ["What was the weather like?", "天气怎么样？"],
          ["Sunny", "晴朗"],
          [
            ["Rainy", "下雨"],
            ["Snowy", "下雪"],
            ["Windy and cold", "刮风又寒冷"],
          ],
          ['The story says, "It was a sunny day."', "故事说：“那天阳光明媚。”"],
          [
            ["Rainy is wrong. The first line says it was a sunny day.", "下雨不对。第一句说那天阳光明媚。"],
            ["Snowy is not in the story. It was sunny.", "故事里没有下雪。那天是晴天。"],
            ["Windy and cold is not said. It was a sunny picnic day.", "文中没说又冷又有风。那天适合野餐，阳光明媚。"],
          ],
        ),
        ask(
          ["What did the friends sit on?", "朋友们坐在什么上面？"],
          ["A big blanket", "一条大毯子"],
          [
            ["A bench", "一条长椅"],
            ["The grass", "草地"],
            ["Chairs", "椅子"],
          ],
          ["They sat on a big blanket under a tree.", "他们坐在树下的一条大毯子上。"],
          [
            ["A bench is not in the story. They sat on a blanket.", "故事里没有长椅。他们坐在毯子上。"],
            ["The grass is under the blanket, but they sat on the blanket.", "草地在毯子下面，但他们坐在毯子上。"],
            ["Chairs are not in the story.", "故事里没有椅子。"],
          ],
        ),
        ask(
          ["What did Max bring?", "麦克斯带了什么？"],
          ["Sandwiches", "三明治"],
          [
            ["Grapes", "葡萄"],
            ["A cake", "一个蛋糕"],
            ["A ball", "一个球"],
          ],
          ['The story says, "Max brought sandwiches."', "故事说：“麦克斯带了三明治。”"],
          [
            ["Grapes are what Ann brought.", "葡萄是安带的。"],
            ["A cake is what Dan brought.", "蛋糕是丹带的。"],
            ["A ball is what they played catch with later.", "球是他们后来玩接球用的。"],
          ],
        ),
        ask(
          ["What did Dan bring?", "丹带了什么？"],
          ["A cake his mom had made", "他妈妈做的蛋糕"],
          [
            ["A bag of grapes", "一袋葡萄"],
            ["Sandwiches", "三明治"],
            ["A blanket", "一条毯子"],
          ],
          ["Dan brought a cake that his mom had made.", "丹带了一个他妈妈做的蛋糕。"],
          [
            ["A bag of grapes is what Ann brought.", "一袋葡萄是安带的。"],
            ["Sandwiches are what Max brought.", "三明治是马克斯带的。"],
            ["A blanket is what they sat on. The story does not say who brought it.", "毯子是他们坐的，故事没说是谁带来的。"],
          ],
        ),
        ask(
          ["What hopped up to the friends?", "什么跳到了朋友们身边？"],
          ["A little bird", "一只小鸟"],
          [
            ["A rabbit", "一只兔子"],
            ["A frog", "一只青蛙"],
            ["A dog", "一只狗"],
          ],
          ["The story says a little bird hopped up and looked at the cake.", "故事说一只小鸟跳过来，看着蛋糕。"],
          [
            ["A rabbit is not in the story.", "故事里没有兔子。"],
            ["A frog is not in the story. A little bird hopped up.", "故事里没有青蛙。跳过来的是一只小鸟。"],
            ["A dog is not in the story. It was a bird that flew off.", "故事里没有狗。是一只鸟飞走了。"],
          ],
        ),
        ask(
          ["Who gave the bird a crumb?", "谁给了小鸟一点碎屑？"],
          ["Ann", "安"],
          [
            ["Max", "麦克斯"],
            ["Dan", "丹"],
            ["Dan's mom", "丹的妈妈"],
          ],
          ['The story says, "Ann gave it a small crumb."', "故事说：“安给了它一小块碎屑。”"],
          [
            ["Max brought sandwiches, but Ann gave the crumb.", "马克斯带了三明治，但给碎屑的是安。"],
            ["Dan brought the cake, but Ann gave the bird a crumb.", "丹带了蛋糕，但给小鸟碎屑的是安。"],
            ["Dan's mom made the cake at home. She was not at the picnic.", "丹的妈妈在家做了蛋糕，她不在野餐现场。"],
          ],
        ),
        ask(
          ["What did they do after lunch?", "午饭后他们做了什么？"],
          ["They played catch with a ball", "他们玩抛接球"],
          [
            ["They went home", "他们回家了"],
            ["They had a nap", "他们睡了午觉"],
            ["They fed the ducks", "他们喂了鸭子"],
          ],
          ["After lunch, they played catch with a ball.", "午饭后，他们玩抛接球。"],
          [
            ["Going home is not what they did next. They played catch.", "他们接下来没有回家，而是玩了接球。"],
            ["Having a nap is not in the story.", "故事里没有睡午觉。"],
            ["Feeding the ducks is not in the story. Only a bird got a crumb.", "故事里没有喂鸭子，只有一只小鸟得到了碎屑。"],
          ],
        ),
      ],
      ["Max", "Ann", "Dan"],
    ),
    passage(
      "where-food-comes-from",
      t("Where Food Comes From", "食物从哪里来"),
      `The food we eat comes from plants and animals.

Some food grows on plants. Apples and plums grow on trees. Carrots grow under the ground. Rice and wheat grow in big fields. Bread is made from wheat.

Some food comes from animals. Hens give us eggs. Cows give us milk, and milk is used to make cheese.

Farmers work hard to grow our food. Then trucks take it to the shops. Next time you eat, think about where your food came from!`,
      [facts],
      [
        ask(
          ["Where do carrots grow?", "胡萝卜长在哪里？"],
          ["Under the ground", "在地下"],
          [
            ["On trees", "在树上"],
            ["In the sea", "在海里"],
            ["On a vine in the sky", "在天上的藤上"],
          ],
          ["The text says carrots grow under the ground.", "短文说胡萝卜长在地下。"],
          [
            ["On trees is where apples and plums grow.", "树上长的是苹果和李子。"],
            ["The sea is not named as a place food grows here.", "文中没说食物长在海里。"],
            ["A vine in the sky is not in the text. Carrots grow under the ground.", "文中没有天上的藤。胡萝卜长在地下。"],
          ],
        ),
        ask(
          ["What is bread made from?", "面包是用什么做的？"],
          ["Wheat", "小麦"],
          [
            ["Rice", "大米"],
            ["Milk", "牛奶"],
            ["Plums", "李子"],
          ],
          ["The text says bread is made from wheat.", "短文说面包是用小麦做的。"],
          [
            ["Rice grows in fields too, but bread is made from wheat.", "大米也长在田里，但面包是用小麦做的。"],
            ["Milk is used for cheese, not bread.", "牛奶用来做奶酪，不是面包。"],
            ["Plums grow on trees. They are not used for bread.", "李子长在树上，不是用来做面包的。"],
          ],
        ),
        ask(
          ["What is made from milk?", "什么是用牛奶做的？"],
          ["Cheese", "奶酪"],
          [
            ["Eggs", "鸡蛋"],
            ["Bread", "面包"],
            ["Apples", "苹果"],
          ],
          ["The text says milk is used to make cheese.", "短文说牛奶可以用来做奶酪。"],
          [
            ["Eggs come from hens, not from milk.", "鸡蛋来自母鸡，不是牛奶做的。"],
            ["Bread is made from wheat.", "面包是用小麦做的。"],
            ["Apples grow on trees.", "苹果长在树上。"],
          ],
        ),
        ask(
          ["Where does our food come from?", "我们的食物来自哪里？"],
          ["Plants and animals", "植物和动物"],
          [
            ["Only shops", "只来自商店"],
            ["Only trucks", "只来自卡车"],
            ["Only the sea", "只来自大海"],
          ],
          ['The text says, "The food we eat comes from plants and animals."', "短文说：“我们吃的食物来自植物和动物。”"],
          [
            [
              "Only shops is wrong. Shops sell food, but it comes from plants and animals.",
              "只来自商店不对。商店卖食物，但食物来自植物和动物。",
            ],
            ["Only trucks is wrong. Trucks carry food to the shops.", "只来自卡车不对。卡车只是把食物运到商店。"],
            ["Only the sea is wrong. The text says plants and animals.", "只来自大海不对。文中说的是植物和动物。"],
          ],
        ),
        ask(
          ["What grows on trees?", "什么长在树上？"],
          ["Apples and plums", "苹果和李子"],
          [
            ["Carrots", "胡萝卜"],
            ["Rice and wheat", "大米和小麦"],
            ["Eggs", "鸡蛋"],
          ],
          ['The text says, "Apples and plums grow on trees."', "短文说：“苹果和李子长在树上。”"],
          [
            ["Carrots grow under the ground.", "胡萝卜长在地下。"],
            ["Rice and wheat grow in big fields.", "大米和小麦长在大片田地里。"],
            ["Eggs come from hens.", "鸡蛋来自母鸡。"],
          ],
        ),
        ask(
          ["Where do rice and wheat grow?", "大米和小麦长在哪里？"],
          ["In big fields", "在大片田地里"],
          [
            ["On trees", "在树上"],
            ["Under the ground", "在地下"],
            ["In the sea", "在海里"],
          ],
          ['The text says, "Rice and wheat grow in big fields."', "短文说：“大米和小麦长在大片田地里。”"],
          [
            ["On trees is where apples and plums grow.", "树上长的是苹果和李子。"],
            ["Under the ground is where carrots grow.", "地下长的是胡萝卜。"],
            ["The sea is wrong. Rice and wheat grow in fields.", "大海不对。大米和小麦长在田里。"],
          ],
        ),
        ask(
          ["What do hens give us?", "母鸡给我们什么？"],
          ["Eggs", "鸡蛋"],
          [
            ["Milk", "牛奶"],
            ["Cheese", "奶酪"],
            ["Wheat", "小麦"],
          ],
          ['The text says, "Hens give us eggs."', "短文说：“母鸡给我们鸡蛋。”"],
          [
            ["Milk comes from cows.", "牛奶来自奶牛。"],
            ["Cheese is made from cows' milk.", "奶酪是用牛奶做的。"],
            ["Wheat is a plant that grows in fields.", "小麦是长在田里的植物。"],
          ],
        ),
        ask(
          ["What do cows give us?", "奶牛给我们什么？"],
          ["Milk", "牛奶"],
          [
            ["Eggs", "鸡蛋"],
            ["Bread", "面包"],
            ["Plums", "李子"],
          ],
          ['The text says, "Cows give us milk."', "短文说：“奶牛给我们牛奶。”"],
          [
            ["Eggs come from hens.", "鸡蛋来自母鸡。"],
            ["Bread is made from wheat.", "面包是用小麦做的。"],
            ["Plums grow on trees.", "李子长在树上。"],
          ],
        ),
        ask(
          ["Who works hard to grow our food?", "谁辛勤地种植我们的食物？"],
          ["Farmers", "农民"],
          [
            ["Truck drivers", "卡车司机"],
            ["Teachers", "老师"],
            ["Cooks", "厨师"],
          ],
          ['The text says, "Farmers work hard to grow our food."', "短文说：“农民辛勤地种植我们的食物。”"],
          [
            ["Truck drivers take the food to the shops, but farmers grow it.", "卡车司机把食物运到商店，但种食物的是农民。"],
            ["Teachers are not in this text.", "文中没有老师。"],
            ["Cooks are not in this text. Farmers grow the food.", "文中没有厨师。种食物的是农民。"],
          ],
        ),
        ask(
          ["How does food get to the shops?", "食物怎样被送到商店？"],
          ["Trucks take it there", "卡车运过去"],
          [
            ["Hens carry it", "母鸡带过去"],
            ["It grows in the shops", "它长在商店里"],
            ["Boats on a pond", "池塘里的船"],
          ],
          ['The text says, "Then trucks take it to the shops."', "短文说：“然后卡车把它运到商店。”"],
          [
            ["Hens give eggs. They do not carry food.", "母鸡下蛋，不运食物。"],
            ["Growing in the shops is wrong. Food grows on farms.", "长在商店里不对。食物长在农场里。"],
            ["Boats on a pond are not in the text. Trucks take food to the shops.", "文中没有池塘上的船。是卡车把食物运到商店。"],
          ],
        ),
      ],
    ),
  ],
};

/** bugsAndGrowingThings is the reading unit of grade 1 on seeds, ants and butterflies. */
export const bugsAndGrowingThings: ReadingUnitDef = {
  id: "bugs-and-growing-things",
  title: t("Bugs and Growing Things", "小虫和生长的东西"),
  passages: [
    passage(
      "a-seed-becomes-a-plant",
      t("From Seed to Plant", "从种子到植物"),
      `A plant starts as a tiny seed. If you plant the seed in soil and give it water, it will begin to grow.

First, a little root grows down into the soil. The root drinks water. Next, a green shoot pushes up out of the soil. The shoot grows into a stem with leaves. The leaves need sunlight to make food for the plant.

Last, the plant may grow a flower. The flower makes new seeds, and then new plants can grow.`,
      [facts, order],
      [
        ask(
          ["What grows first from the seed?", "种子最先长出什么？"],
          ["A root", "根"],
          [
            ["A flower", "花"],
            ["A leaf", "叶子"],
            ["A new seed", "新的种子"],
          ],
          ['The text says, "First, a little root grows down into the soil."', "短文说：“首先，一条小根向下长进土里。”"],
          [
            ["A flower grows last, not first.", "花是最后长的，不是最先。"],
            ["A leaf comes later, on the stem.", "叶子是后来长在茎上的。"],
            ["A new seed comes at the very end, from the flower.", "新种子是最后由花结出的。"],
          ],
        ),
        ask(
          ["What do the leaves need to make food?", "叶子需要什么来制造养料？"],
          ["Sunlight", "阳光"],
          [
            ["Snow", "雪"],
            ["Soil", "泥土"],
            ["Wind", "风"],
          ],
          ["The text says the leaves need sunlight to make food for the plant.", "短文说叶子需要阳光为植物制造养料。"],
          [
            ["Snow is not in the text. Leaves need sunlight.", "文中没有雪。叶子需要阳光。"],
            ["Soil is where the root grows. The leaves need sunlight.", "土壤是根生长的地方，叶子需要的是阳光。"],
            ["Wind is not in the text.", "文中没有风。"],
          ],
        ),
        ask(
          ["What does the flower make?", "花会产生什么？"],
          ["New seeds", "新的种子"],
          [
            ["Roots", "根"],
            ["Water", "水"],
            ["Soil", "泥土"],
          ],
          ["The text says the flower makes new seeds, so new plants can grow.", "短文说花会结出新的种子，于是新的植物就能生长。"],
          [
            ["Roots grow first from the seed, not from the flower.", "根是最先从种子里长出来的，不是花结的。"],
            ["Water is what the root drinks.", "水是根喝的。"],
            ["Soil is where the seed is planted.", "土壤是种种子的地方。"],
          ],
        ),
        ask(
          ["How does a plant start?", "植物是怎样开始生长的？"],
          ["As a tiny seed", "从一颗小小的种子开始"],
          [
            ["As a big flower", "从一朵大花开始"],
            ["As a green leaf", "从一片绿叶开始"],
            ["As a tall stem", "从一根高高的茎开始"],
          ],
          ['The text says, "A plant starts as a tiny seed."', "短文说：“植物从一颗小小的种子开始。”"],
          [
            ["A big flower comes last, not first.", "大花是最后才有的，不是开始。"],
            ["A green leaf grows later, on the stem.", "绿叶是后来长在茎上的。"],
            ["A tall stem grows from the shoot, later on.", "高高的茎是后来由嫩芽长成的。"],
          ],
        ),
        ask(
          ["What does a seed need to begin to grow?", "种子开始生长需要什么？"],
          ["Soil and water", "土壤和水"],
          [
            ["Snow and wind", "雪和风"],
            ["Only darkness", "只需要黑暗"],
            ["Salt and sugar", "盐和糖"],
          ],
          [
            "The text says if you plant the seed in soil and give it water, it will begin to grow.",
            "短文说如果把种子种在土里并浇水，它就会开始生长。",
          ],
          [
            ["Snow and wind are not in the text.", "文中没有雪和风。"],
            ["Only darkness is wrong. The text says soil and water.", "只要黑暗不对。文中说的是土壤和水。"],
            ["Salt and sugar are not in the text.", "文中没有盐和糖。"],
          ],
        ),
        ask(
          ["Which way does the root grow?", "根往哪个方向长？"],
          ["Down into the soil", "向下长进土里"],
          [
            ["Up into the sky", "向上长到空中"],
            ["Out to the side", "向旁边长"],
            ["Into the flower", "长进花里"],
          ],
          ['The text says, "First, a little root grows down into the soil."', "短文说：“首先，一条小根向下长进土里。”"],
          [
            ["Up into the sky is the shoot, not the root.", "向上长的是嫩芽，不是根。"],
            ["Out to the side is not in the text. The root grows down.", "文中没说向旁边长。根向下长。"],
            ["Into the flower is wrong. The flower comes last, at the top.", "长进花里不对。花是最后长在上面的。"],
          ],
        ),
        ask(
          ["What does the root drink?", "根吸收什么？"],
          ["Water", "水"],
          [
            ["Milk", "牛奶"],
            ["Sunlight", "阳光"],
            ["Seeds", "种子"],
          ],
          ['The text says, "The root drinks water."', "短文说：“根吸收水分。”"],
          [
            ["Milk is not in the text.", "文中没有牛奶。"],
            ["Sunlight is what the leaves need, not what the root drinks.", "阳光是叶子需要的，不是根喝的。"],
            ["Seeds are made by the flower. The root drinks water.", "种子是花结的。根喝的是水。"],
          ],
        ),
        ask(
          ["What pushes up out of the soil?", "什么从土里钻出来？"],
          ["A green shoot", "一株绿芽"],
          [
            ["A root", "一条根"],
            ["A flower", "一朵花"],
            ["A seed", "一颗种子"],
          ],
          ['The text says, "Next, a green shoot pushes up out of the soil."', "短文说：“接着，一株绿芽从土里钻出来。”"],
          [
            ["A root grows down into the soil, not up out of it.", "根向下长进土里，不是钻出土面。"],
            ["A flower comes last, on the plant.", "花是最后长在植物上的。"],
            ["A seed is planted in the soil. It does not push up.", "种子是种在土里的，不会往上冒。"],
          ],
        ),
        ask(
          ["What does the shoot grow into?", "嫩芽长成了什么？"],
          ["A stem with leaves", "带叶子的茎"],
          [
            ["A root", "一条根"],
            ["A seed", "一颗种子"],
            ["A fruit", "一个果子"],
          ],
          ['The text says, "The shoot grows into a stem with leaves."', "短文说：“嫩芽长成带叶子的茎。”"],
          [
            ["A root grows down, not from the shoot.", "根向下长，不是嫩芽长成的。"],
            ["A seed is made by the flower at the end.", "种子是最后由花结的。"],
            ["A fruit is not in this text.", "文中没有果实。"],
          ],
        ),
        ask(
          ["What may the plant grow last?", "植物最后可能长出什么？"],
          ["A flower", "一朵花"],
          [
            ["A root", "一条根"],
            ["A shoot", "一株嫩芽"],
            ["Soil", "土壤"],
          ],
          ['The text says, "Last, the plant may grow a flower."', "短文说：“最后，植物可能会开花。”"],
          [
            ["A root grows first, not last.", "根最先长，不是最后。"],
            ["A shoot comes second, out of the soil.", "嫩芽是第二步，从土里冒出来。"],
            ["Soil is where the plant grows, not something it grows.", "土壤是植物生长的地方，不是植物长出来的东西。"],
          ],
        ),
      ],
    ),
    passage(
      "the-busy-ant",
      t("The Busy Ant", "忙碌的蚂蚁"),
      `Ants are very small, but they are very strong. An ant can lift things that are much bigger than it is.

Ants live together in a nest under the ground. The nest has lots of little rooms and long tunnels. One big ant is the queen. She lays all the eggs.

The other ants work all day. Some ants look for food. Some take care of the eggs. Some dig new tunnels. When an ant finds food, it leaves a smell on the path so the other ants can find it too.`,
      [facts],
      [
        ask(
          ["Where do ants live?", "蚂蚁住在哪里？"],
          ["In a nest under the ground", "在地下的巢穴里"],
          [
            ["In a hive in a tree", "在树上的蜂巢里"],
            ["In a pond", "在池塘里"],
            ["On top of a hill", "在山顶上"],
          ],
          ["The text says ants live together in a nest under the ground.", "短文说蚂蚁一起住在地下的巢穴里。"],
          [
            ["A hive in a tree sounds like bees, not ants.", "树上的蜂巢说的是蜜蜂，不是蚂蚁。"],
            ["A pond is not in the text.", "文中没有池塘。"],
            ["On top of a hill is wrong. The nest is under the ground.", "山顶上不对。蚁窝在地下。"],
          ],
        ),
        ask(
          ["What does the queen ant do?", "蚁后做什么？"],
          ["She lays all the eggs", "她产下所有的卵"],
          [
            ["She digs tunnels", "她挖隧道"],
            ["She looks for food", "她寻找食物"],
            ["She lifts big things", "她搬大东西"],
          ],
          ["The text says the queen lays all the eggs.", "短文说蚁后产下所有的卵。"],
          [
            ["Digging tunnels is a job for other ants.", "挖隧道是别的蚂蚁的活儿。"],
            ["Looking for food is a job for other ants.", "找食物是别的蚂蚁的活儿。"],
            ["Lifting big things is what any ant can do, not the queen's job.", "搬大东西是所有蚂蚁都能做的，不是蚁后的工作。"],
          ],
        ),
        ask(
          ["How do other ants find the food?", "其他蚂蚁怎样找到食物？"],
          ["They follow a smell on the path", "它们循着路上的气味找"],
          [
            ["They see it from far away", "它们从远处看见它"],
            ["The queen tells them", "蚁后告诉它们"],
            ["They hear it", "它们听见了它"],
          ],
          [
            "The text says an ant leaves a smell on the path so the other ants can find the food.",
            "短文说蚂蚁在路上留下气味，让其他蚂蚁也能找到食物。",
          ],
          [
            ["Seeing it from far away is not in the text. They follow a smell.", "文中没说从远处看见。它们跟着气味走。"],
            ["The queen telling them is wrong. The queen lays eggs.", "蚁后告诉它们不对。蚁后只负责产卵。"],
            ["Hearing it is not in the text. The ant leaves a smell.", "文中没说听见。蚂蚁留下的是气味。"],
          ],
        ),
        ask(
          ["What size are ants?", "蚂蚁有多大？"],
          ["Very small", "很小"],
          [
            ["Very big", "很大"],
            ["As big as a cat", "和猫一样大"],
            ["As big as a bird", "和鸟一样大"],
          ],
          ['The text says, "Ants are very small, but they are very strong."', "短文说：“蚂蚁很小，但很强壮。”"],
          [
            ["Very big is the opposite. Ants are very small.", "很大正好相反。蚂蚁非常小。"],
            ["As big as a cat is wrong. Ants are very small.", "和猫一样大不对。蚂蚁非常小。"],
            ["As big as a bird is wrong. The first line says very small.", "和鸟一样大不对。第一句说非常小。"],
          ],
        ),
        ask(
          ["What can an ant lift?", "蚂蚁能举起什么？"],
          ["Things much bigger than it is", "比它自己大得多的东西"],
          [
            ["Only tiny seeds", "只能举起小种子"],
            ["Nothing at all", "什么都举不起来"],
            ["A car", "一辆汽车"],
          ],
          ["The text says an ant can lift things that are much bigger than it is.", "短文说蚂蚁能举起比它自己大得多的东西。"],
          [
            ["Only tiny seeds is wrong. Ants lift things much bigger than they are.", "只能搬小种子不对。蚂蚁能搬比自己大得多的东西。"],
            ["Nothing at all is the opposite. Ants are very strong.", "什么都搬不动正好相反。蚂蚁很有力气。"],
            ["A car is far too big. The text says much bigger than an ant, not a car.", "汽车太大了。文中说比蚂蚁大得多，没说汽车。"],
          ],
        ),
        ask(
          ["What does the nest have?", "蚁巢里有什么？"],
          ["Lots of little rooms and long tunnels", "许多小房间和长长的隧道"],
          [
            ["One big room", "一个大房间"],
            ["Windows and doors", "窗户和门"],
            ["A pond", "一个池塘"],
          ],
          ["The nest has lots of little rooms and long tunnels.", "蚁巢里有许多小房间和长长的隧道。"],
          [
            ["One big room is wrong. The nest has lots of little rooms.", "一个大房间不对。蚁窝有很多小房间。"],
            ["Windows and doors are not in the text.", "文中没有门窗。"],
            ["A pond is not in the text.", "文中没有池塘。"],
          ],
        ),
        ask(
          ["What is the one big ant called?", "那只大蚂蚁叫什么？"],
          ["The queen", "蚁后"],
          [
            ["The king", "蚁王"],
            ["The boss", "老板"],
            ["The mom", "妈妈"],
          ],
          ['The text says, "One big ant is the queen."', "短文说：“有一只大蚂蚁是蚁后。”"],
          [
            ["The king is not in the text. The big ant is the queen.", "文中没有国王。那只大蚂蚁是蚁后。"],
            ["The boss is not the word the text uses.", "文中用的词不是“老板”。"],
            ["The mom is not the word. The text calls her the queen.", "文中没用“妈妈”这个词，叫她蚁后。"],
          ],
        ),
        ask(
          ["How long do the other ants work?", "其他蚂蚁工作多久？"],
          ["All day", "一整天"],
          [
            ["One hour", "一个小时"],
            ["Only at night", "只在晚上"],
            ["Only in spring", "只在春天"],
          ],
          ['The text says, "The other ants work all day."', "短文说：“其他蚂蚁整天工作。”"],
          [
            ["One hour is too short. They work all day.", "一小时太短了。它们整天都在干活。"],
            ["Only at night is wrong. The text says all day.", "只在晚上不对。文中说整天。"],
            ["Only in spring is not said. They work all day.", "文中没说只在春天。它们整天干活。"],
          ],
        ),
        ask(
          ["Which is a job some ants do?", "下面哪一项是一些蚂蚁做的工作？"],
          ["Take care of the eggs", "照顾卵"],
          [
            ["Make honey", "酿蜜"],
            ["Build nests in trees", "在树上筑巢"],
            ["Spin webs", "织网"],
          ],
          [
            "The text says some ants look for food, some take care of the eggs and some dig new tunnels.",
            "短文说有些蚂蚁找食物，有些照顾卵，有些挖新隧道。",
          ],
          [
            ["Making honey is what bees do, not ants.", "做蜂蜜是蜜蜂做的事，不是蚂蚁。"],
            ["Nests in trees are not ant nests. Ants live under the ground.", "树上的窝不是蚁窝。蚂蚁住在地下。"],
            ["Spinning webs is what spiders do.", "织网是蜘蛛做的事。"],
          ],
        ),
        ask(
          ["What does an ant leave on the path when it finds food?", "蚂蚁找到食物后在路上留下什么？"],
          ["A smell", "一种气味"],
          [
            ["A leaf", "一片叶子"],
            ["A seed", "一颗种子"],
            ["A sign", "一个标志"],
          ],
          ["When an ant finds food, it leaves a smell on the path.", "蚂蚁找到食物后，会在路上留下气味。"],
          [
            ["A leaf is not in the text. The ant leaves a smell.", "文中没有树叶。蚂蚁留下的是气味。"],
            ["A seed is not what it leaves.", "它留下的不是种子。"],
            ["A sign is not in the text. The other ants follow a smell.", "文中没有标志。别的蚂蚁跟着气味走。"],
          ],
        ),
      ],
    ),
    passage(
      "a-butterfly-grows",
      t("A Butterfly Grows", "蝴蝶的成长"),
      `A butterfly does not start out as a butterfly. It changes a lot as it grows.

First, a butterfly lays a tiny egg on a leaf. Then a little caterpillar comes out of the egg. The caterpillar is very hungry. It eats and eats, and it gets bigger and bigger.

Next, the caterpillar makes a hard shell around itself. Inside, it changes. This takes about two weeks.

At last, the shell opens, and out comes a butterfly with bright wings. It dries its wings in the sun and flies away.`,
      [order, facts],
      [
        ask(
          ["Where does a butterfly lay its egg?", "蝴蝶把卵产在哪里？"],
          ["On a leaf", "在叶子上"],
          [
            ["In the soil", "在土里"],
            ["In a pond", "在池塘里"],
            ["In a nest", "在鸟巢里"],
          ],
          ["The text says a butterfly lays a tiny egg on a leaf.", "短文说蝴蝶把小小的卵产在叶子上。"],
          [
            ["In the soil is not in the text. The egg goes on a leaf.", "文中没说在土里。卵产在叶子上。"],
            ["A pond is not in the text.", "文中没有池塘。"],
            ["A nest is for birds or ants. The butterfly uses a leaf.", "窝是鸟或蚂蚁的。蝴蝶用的是叶子。"],
          ],
        ),
        ask(
          ["What comes out of the egg?", "从卵里出来的是什么？"],
          ["A caterpillar", "一条毛毛虫"],
          [
            ["A butterfly", "一只蝴蝶"],
            ["A bird", "一只鸟"],
            ["An ant", "一只蚂蚁"],
          ],
          ["The text says a little caterpillar comes out of the egg.", "短文说一条小毛毛虫从卵里钻出来。"],
          [
            ["A butterfly comes much later, out of the shell.", "蝴蝶要很久以后才从硬壳里出来。"],
            ["A bird is not in this text.", "文中没有鸟。"],
            ["An ant is not in this text. A caterpillar comes out.", "文中没有蚂蚁。出来的是毛毛虫。"],
          ],
        ),
        ask(
          ["What does the butterfly do last?", "蝴蝶最后做什么？"],
          ["It dries its wings and flies away", "它晾干翅膀，飞走了"],
          [
            ["It lays an egg", "它产卵"],
            ["It eats lots of leaves", "它吃很多叶子"],
            ["It makes a hard shell", "它做一个硬壳"],
          ],
          ["At last the butterfly dries its wings in the sun and flies away.", "最后，蝴蝶在阳光下晾干翅膀，飞走了。"],
          [
            ["Laying an egg is the first step, not the last.", "产卵是第一步，不是最后一步。"],
            ["Eating lots of leaves is what the caterpillar does early on.", "吃很多叶子是毛毛虫早期做的事。"],
            ["Making a hard shell is the step before the butterfly comes out.", "做硬壳是蝴蝶出来之前的一步。"],
          ],
        ),
        ask(
          ["How is the caterpillar?", "毛毛虫怎么样？"],
          ["Very hungry", "非常饿"],
          [
            ["Very sleepy", "非常困"],
            ["Very cold", "非常冷"],
            ["Very sad", "非常难过"],
          ],
          ['The text says, "The caterpillar is very hungry."', "短文说：“毛毛虫非常饿。”"],
          [
            ["Very sleepy is not in the text.", "文中没说很困。"],
            ["Very cold is not in the text.", "文中没说很冷。"],
            ["Very sad is not in the text. The caterpillar is very hungry.", "文中没说很难过。毛毛虫非常饿。"],
          ],
        ),
        ask(
          ["What does the caterpillar do all the time?", "毛毛虫一直在做什么？"],
          ["It eats and eats", "一直吃"],
          [
            ["It sleeps and sleeps", "一直睡"],
            ["It flies and flies", "一直飞"],
            ["It swims and swims", "一直游"],
          ],
          ['The text says, "It eats and eats, and it gets bigger and bigger."', "短文说：“它吃了又吃，越长越大。”"],
          [
            ["Sleeping is not what it does all the time. It eats and eats.", "它不是一直睡，而是一直吃。"],
            ["Flying comes only at the end, when it is a butterfly.", "飞是最后变成蝴蝶以后的事。"],
            ["Swimming is not in the text.", "文中没有游泳。"],
          ],
        ),
        ask(
          ["What does the caterpillar make around itself?", "毛毛虫在自己周围做了什么？"],
          ["A hard shell", "一个硬壳"],
          [
            ["A nest", "一个巢"],
            ["A hole", "一个洞"],
            ["A web", "一张网"],
          ],
          ['The text says, "Next, the caterpillar makes a hard shell around itself."', "短文说：“接着，毛毛虫在自己周围做了一个硬壳。”"],
          [
            ["A nest is not in the text. It makes a hard shell.", "文中没有窝。它做了一层硬壳。"],
            ["A hole is not in the text.", "文中没有洞。"],
            ["A web is what spiders make, not caterpillars.", "网是蜘蛛织的，不是毛毛虫。"],
          ],
        ),
        ask(
          ["How long does the change inside the shell take?", "在壳里变化需要多久？"],
          ["About two weeks", "大约两周"],
          [
            ["About two days", "大约两天"],
            ["One hour", "一个小时"],
            ["A whole year", "一整年"],
          ],
          ['The text says, "This takes about two weeks."', "短文说：“这大约需要两周。”"],
          [
            ["About two days is too short. The text says two weeks.", "大约两天太短了。文中说的是两周。"],
            ["One hour is far too short.", "一小时太短了。"],
            ["A whole year is far too long. It takes about two weeks.", "一整年太长了。大约需要两周。"],
          ],
        ),
        ask(
          ["What comes out of the shell?", "什么从壳里出来了？"],
          ["A butterfly with bright wings", "一只翅膀鲜艳的蝴蝶"],
          [
            ["A caterpillar", "一只毛毛虫"],
            ["A tiny egg", "一颗小卵"],
            ["A bird", "一只鸟"],
          ],
          ["At last, the shell opens, and out comes a butterfly with bright wings.", "最后壳打开了，飞出一只翅膀鲜艳的蝴蝶。"],
          [
            ["A caterpillar went into the shell, but a butterfly comes out.", "进壳的是毛毛虫，出来的是蝴蝶。"],
            ["A tiny egg is the first step, on a leaf.", "小小的卵是第一步，在叶子上。"],
            ["A bird is not in this text.", "文中没有鸟。"],
          ],
        ),
        ask(
          ["Where does the butterfly dry its wings?", "蝴蝶在哪里晾干翅膀？"],
          ["In the sun", "在阳光下"],
          [
            ["In the rain", "在雨中"],
            ["In its shell", "在壳里"],
            ["Under a leaf", "在叶子下面"],
          ],
          ["The text says it dries its wings in the sun.", "短文说它在阳光下晾干翅膀。"],
          [
            ["In the rain is the opposite. It dries its wings in the sun.", "在雨里正好相反。它在阳光下晾干翅膀。"],
            ["In its shell is wrong. The shell has opened.", "在壳里不对。壳已经打开了。"],
            ["Under a leaf is not said. The text says in the sun.", "文中没说在叶子下，说的是在阳光下。"],
          ],
        ),
        ask(
          ["What does the text say about how a butterfly starts?", "短文怎样说蝴蝶的开始？"],
          ["It does not start out as a butterfly", "它一开始并不是蝴蝶"],
          [
            ["It is born with wings", "它生来就有翅膀"],
            ["It starts as a seed", "它从种子开始"],
            ["It starts as a bird", "它从鸟开始"],
          ],
          ['The text says, "A butterfly does not start out as a butterfly."', "短文说：“蝴蝶一开始并不是蝴蝶。”"],
          [
            ["Being born with wings is the opposite. It starts as an egg.", "生来就有翅膀正好相反。它是从卵开始的。"],
            ["A seed is how a plant starts, not a butterfly.", "种子是植物的开始，不是蝴蝶的。"],
            ["A bird is not in the text. It starts as an egg on a leaf.", "文中没有鸟。它从叶子上的卵开始。"],
          ],
        ),
      ],
    ),
  ],
};

/** readingUnits1 are the reading units of grade 1, one for each unit of the course. */
export const readingUnits1: readonly ReadingUnitDef[] = [
  allAboutMe,
  petsAndAnimals,
  homeAndSchool,
  weatherAndSeasons,
  foodAndFriends,
  bugsAndGrowingThings,
];
