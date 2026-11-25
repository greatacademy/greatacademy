// The speaking topics of B2 (S2–S4): in each unit, after its listening, the words of four of its vocabulary topics
// said after a recording, their sentences read aloud, and questions on its theme answered aloud in a full sentence with
// a given word or phrase.

import type { TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type SayFrame, say, type UnitSpeakingSpec, unitSpeaking } from "../speaking.ts";
import { units } from "./listening.ts";

const frames: Record<(typeof units)[number]["slug"], readonly SayFrame[]> = {
  "society-and-change": [
    say(
      "What do you think is the biggest change in society in the last twenty years?",
      "I think the biggest change is {x}. / The biggest change is {x}. / In my opinion, the biggest change is {x}.",
      "the internet, social media, working from home, an older population, climate awareness",
    ),
    say(
      "Which social problem should governments deal with first?",
      "Governments should deal with {x} first. / I think governments should deal with {x} first. / They should deal with {x} first.",
      "poverty, homelessness, unemployment, inequality, loneliness",
    ),
    say(
      "Which invention has changed society most?",
      "I think {x} has changed society most. / {x} has changed it most.",
      "the internet, the smartphone, the car, electricity, the printing press",
    ),
    say(
      "What is the biggest challenge for young people today?",
      "The biggest challenge is {x}. / I think it is {x}.",
      "finding a job, the cost of housing, stress at school, social media, climate change",
    ),
    say(
      "What would you change about your country?",
      "I would change {x}. / I would like to change {x}.",
      "the education system, public transport, the health service, the tax system, the housing market",
    ),
    say(
      "Which group needs more support from society?",
      "{x} need more support. / I think {x} need more support.",
      "older people, young families, refugees, disabled people, the unemployed",
    ),
  ],
  "work-and-the-economy": [
    say(
      "Would you rather work for a large company or a small one?",
      "I would rather work for {x}. / I'd rather work for {x}. / I would prefer to work for {x}.",
      "a large company, a small company, a start-up, a family business, myself",
    ),
    say(
      "What makes a good manager?",
      "A good manager is {x}. / I think a good manager is {x}. / In my view, a good manager is {x}.",
      "fair, organized, honest, supportive, a good listener",
    ),
    say(
      "Would you rather work from home or in an office?",
      "I would rather work {x}. / I'd prefer to work {x}.",
      "from home, in an office, in a caf\u00e9, outdoors, abroad",
    ),
    say(
      "What makes a job satisfying?",
      "{x} makes a job satisfying. / For me, {x} makes a job satisfying.",
      "helping others, learning new things, good pay, a sense of purpose, friendly colleagues",
    ),
    say(
      "Which industry will grow fastest?",
      "I think {x} will grow fastest. / {x} will grow fastest.",
      "renewable energy, health care, technology, tourism, education",
    ),
    say(
      "How should young people prepare for work?",
      "They should {x}. / Young people should {x}.",
      "get work experience, learn languages, study online, build a network, volunteer",
    ),
  ],
  "science-ethics-and-medicine": [
    say(
      "What medical advance do you think is the most important?",
      "I think {x} is the most important. / The most important advance is {x}. / In my view, {x} is the most important.",
      "vaccines, antibiotics, organ transplants, gene therapy, anesthesia",
    ),
    say(
      "How do you look after your mental health?",
      "I look after my mental health by {x}. / I try to look after it by {x}. / I look after it by {x}.",
      "getting enough sleep, talking to friends, doing exercise, spending time outdoors, taking breaks from my phone",
    ),
    say(
      "Should animals be used in medical research?",
      "I think {x}. / In my view, {x}.",
      "they should never be used, they should be used only when necessary, it depends on the research, there are better methods, it is sometimes acceptable",
    ),
    say(
      "Which disease would you most like to see cured?",
      "I would most like to see {x} cured. / I'd like to see {x} cured.",
      "cancer, malaria, diabetes, dementia, heart disease",
    ),
    say(
      "What is the best way to stay healthy?",
      "The best way is {x}. / I think it is {x}.",
      "regular exercise, a balanced diet, enough sleep, less stress, regular checkups",
    ),
    say(
      "Who should pay for health care?",
      "I think {x} should pay. / {x} should pay for it.",
      "the government, employers, patients, insurance companies, everyone together",
    ),
  ],
  "climate-and-sustainability": [
    say(
      "Which source of energy should we use more?",
      "We should use more {x}. / I think we should use more {x}. / In my view, we should use more {x}.",
      "solar power, wind power, nuclear power, hydroelectric power, geothermal energy",
    ),
    say(
      "What is the most effective thing a person can do for the climate?",
      "The most effective thing is to {x}. / I think the most effective thing is to {x}. / A person can {x}.",
      "fly less, eat less meat, use public transport, save energy at home, buy fewer things",
    ),
    say(
      "What should governments do about climate change?",
      "They should {x}. / Governments should {x}.",
      "tax pollution, invest in clean energy, protect forests, improve public transport, ban coal",
    ),
    say(
      "How could you reduce your carbon footprint?",
      "I could {x}. / I could reduce it if I {x}.",
      "fly less, eat less meat, use public transport, buy less, save energy at home",
    ),
    say(
      "Which country is doing most for the environment?",
      "I think {x} is doing most. / {x} is doing the most.",
      "Sweden, Costa Rica, Denmark, Norway, New Zealand",
    ),
    say(
      "What will happen if we do nothing?",
      "{x} will happen. / I think {x} will happen.",
      "more floods, more droughts, rising seas, food shortages, more wildfires",
    ),
  ],
  "media-and-persuasion": [
    say(
      "Which source of news do you trust most?",
      "I trust {x} most. / I trust {x} the most. / The source I trust most is {x}.",
      "public radio, a national newspaper, the BBC, a news agency, my local paper",
    ),
    say(
      "What makes an advert persuasive?",
      "An advert is persuasive when it uses {x}. / I think {x} makes an advert persuasive. / {x} makes an advert persuasive.",
      "humor, famous people, strong images, catchy music, a clear message",
    ),
    say(
      "How do you check if a story is true?",
      "I check it by trying to {x}. / I {x}.",
      "compare sources, look for the original, check the date, ask an expert, use a fact-checking site",
    ),
    say(
      "What kind of advert annoys you most?",
      "{x} annoy me most. / I find {x} most annoying.",
      "pop-up adverts, video adverts, loud adverts, adverts before films, adverts on social media",
    ),
    say(
      "Should social media be regulated?",
      "I think {x}. / In my view, {x}.",
      "it should be regulated, it should be free, it depends on the content, governments should act, companies should decide",
    ),
    say(
      "Which famous speech do you admire?",
      "I admire {x}. / I most admire {x}.",
      "Martin Luther King's speech, Churchill's speech, Malala's speech, Lincoln's speech, Mandela's speech",
    ),
  ],
  "education-and-opportunity": [
    say(
      "What would you like to study at university?",
      "I would like to study {x}. / I'd like to study {x} at university. / I want to study {x}.",
      "medicine, engineering, law, economics, computer science",
    ),
    say(
      "What is the best way to be assessed?",
      "The best way is {x}. / I think the best way is {x}. / In my view, the best way is {x}.",
      "coursework, written exams, oral exams, projects, presentations",
    ),
    say(
      "Should university be free?",
      "I think {x}. / In my view, {x}.",
      "it should be free, students should pay something, it depends on the course, only for poor students, it should be cheaper",
    ),
    say(
      "What is the most important skill school should teach?",
      "School should teach {x}. / The most important skill is {x}.",
      "critical thinking, communication, teamwork, managing money, creativity",
    ),
    say(
      "What would you study if you could start again?",
      "I would study {x}. / I'd study {x}.",
      "medicine, law, engineering, architecture, philosophy",
    ),
    say(
      "How can schools help poorer students?",
      "They can {x}. / Schools can {x}.",
      "offer free meals, give extra lessons, lend laptops, provide scholarships, offer mentoring",
    ),
  ],
  "culture-identity-and-globalization": [
    say(
      "Which tradition from your culture would you share with the world?",
      "I would share {x}. / I'd share {x} with the world. / I would like to share {x}.",
      "our food, our music, our festivals, our language, our stories",
    ),
    say(
      "What is the main benefit of globalization?",
      "The main benefit is {x}. / I think the main benefit is {x}. / In my opinion, the main benefit is {x}.",
      "cheaper goods, cultural exchange, more jobs, faster communication, international cooperation",
    ),
    say(
      "Which language would you most like to learn?",
      "I would most like to learn {x}. / I'd like to learn {x}.",
      "Spanish, Chinese, Arabic, French, Japanese",
    ),
    say(
      "What makes you proud of where you come from?",
      "I am proud of {x}. / {x} makes me proud.",
      "our history, our food, our music, our people, our language",
    ),
    say(
      "How has globalization changed your life?",
      "It has changed {x}. / Globalization has changed {x}.",
      "what I eat, what I wear, how I work, where I travel, what I watch",
    ),
    say(
      "Which foreign festival would you like to see?",
      "I would like to see {x}. / I'd love to see {x}.",
      "Diwali, Carnival in Rio, the Day of the Dead, Hanami, Oktoberfest",
    ),
  ],
  "technology-and-the-future": [
    say(
      "How do you think artificial intelligence will change our lives?",
      "I think it will change {x}. / It will change {x}. / I believe it will change {x}.",
      "how we work, how we learn, how we travel, medicine, communication",
    ),
    say(
      "Would you like to travel to space?",
      "I would like to travel to {x}. / I'd love to travel to {x}. / I would like to go to {x}.",
      "the Moon, Mars, the space station, Jupiter, Venus",
    ),
    say(
      "Which job will robots do first?",
      "I think robots will {x} first. / Robots will {x} first.",
      "drive taxis, clean houses, work in factories, deliver parcels, cook in restaurants",
    ),
    say(
      "What technology worries you most?",
      "{x} worries me most. / I am most worried about {x}.",
      "artificial intelligence, facial recognition, social media, self-driving cars, online surveillance",
    ),
    say(
      "How will people travel in the future?",
      "They will travel by {x}. / People will travel by {x}.",
      "electric car, flying taxi, high-speed train, drone, hyperloop",
    ),
    say(
      "What would you ask a robot to do?",
      "I would ask it to {x}. / I'd ask a robot to {x}.",
      "do the cleaning, cook dinner, do my homework, walk the dog, wash the car",
    ),
  ],
  "law-rights-and-justice": [
    say(
      "Which right do you think is most important?",
      "I think {x} is the most important. / The most important right is {x}. / In my view, {x} is the most important.",
      "free speech, privacy, education, a fair trial, the right to vote",
    ),
    say(
      "What is the best way to reduce crime?",
      "The best way is {x}. / I think the best way is {x}. / In my opinion, the best way is {x}.",
      "better education, more police, more jobs, community programs, better street lighting",
    ),
    say(
      "Should voting be compulsory?",
      "I think {x}. / In my view, {x}.",
      "it should be compulsory, it should be a free choice, it depends on the country, young people should vote, everyone should vote",
    ),
    say(
      "What age should people be able to vote?",
      "They should be able to vote at {x}. / At {x}.",
      "sixteen, seventeen, eighteen, twenty, twenty-one",
    ),
    say(
      "Which law would you introduce?",
      "I would introduce a law {x}. / I'd introduce a law {x}.",
      "against plastic bags, for free public transport, against animal testing, for a shorter working week, against fake news",
    ),
    say(
      "What should happen to young offenders?",
      "They should {x}. / Young offenders should {x}.",
      "do community service, get an education, meet their victims, go to special schools, get a second chance",
    ),
  ],
  "mind-and-behavior": [
    say(
      "What helps you remember new information?",
      "{x} helps me remember. / I remember better by {x}. / What helps me is {x}.",
      "writing notes, repeating things, drawing pictures, teaching others, sleeping well",
    ),
    say(
      "How do you make important decisions?",
      "I make important decisions by {x}. / I usually decide by {x}. / I decide by {x}.",
      "making a list, asking my family, thinking for a long time, following my feelings, sleeping on it",
    ),
    say(
      "What makes you happy?",
      "{x} makes me happy. / I feel happy with {x}.",
      "good music, time with friends, a long walk, a good book, sunny weather",
    ),
    say(
      "How do you deal with stress?",
      "I deal with it by trying to {x}. / I {x}.",
      "go for a run, talk to friends, meditate, write in a diary, take a break",
    ),
    say(
      "What habit would you like to change?",
      "I would like to change {x}. / I'd like to stop {x}.",
      "going to bed late, checking my phone, eating sweets, putting things off, worrying too much",
    ),
    say(
      "Are you a morning person or an evening person?",
      "I am {x}. / I'm {x}.",
      "a morning person, an evening person, a night owl, an early bird, both",
    ),
  ],
};

/** watchOuts are the Watch outs of the speaking topics, by unit. */
const watchOuts: Record<(typeof units)[number]["slug"], NonNullable<UnitSpeakingSpec["watchOut"]>> = {
  "society-and-change": {
    repeat: t(
      "*discrimination* is *dis-krim-ih-NAY-shun*. *demographic* is *dem-uh-GRAF-ik*. *civilization* is *siv-ih-lih-ZAY-shun*.",
      "*discrimination* 读作 *dis-krim-ih-NAY-shun*。*demographic* 读作 *dem-uh-GRAF-ik*。*civilization* 读作 *siv-ih-lih-ZAY-shun*。",
    ),
    read: t(
      "Stress can move inside a word family: *migrate* is *MY-grate*, *migration* is *my-GRAY-shun*. *inhabitant* is *in-HAB-ih-tunt*. *vulnerable* is *VUL-ner-uh-bul*.",
      "同族词的重音会移动：*migrate* 读作 *MY-grate*，*migration* 读作 *my-GRAY-shun*。*inhabitant* 读作 *in-HAB-ih-tunt*。*vulnerable* 读作 *VUL-ner-uh-bul*。",
    ),
    say: t(
      "Groups with *the* take a plural verb: *The unemployed need more support*. Say *deal with* together: *Governments should deal with poverty first*.",
      "*the* 加形容词表示群体，动词用复数：*The unemployed need more support*。*deal with* 连在一起说：*Governments should deal with poverty first*。",
    ),
  },
  "work-and-the-economy": {
    repeat: t(
      "*enterprise* is *EN-ter-prize*. *mortgage* has a silent *t*: *MOR-gij*. *bankrupt* is *BANK-rupt*. *monopoly* is *muh-NOP-uh-lee*.",
      "*enterprise* 读作 *EN-ter-prize*。*mortgage* 的 *t* 不发音：*MOR-gij*。*bankrupt* 读作 *BANK-rupt*。*monopoly* 读作 *muh-NOP-uh-lee*。",
    ),
    read: t(
      "*economic* is *ee-kuh-NOM-ik*, unlike *ih-KON-uh-mee*. *redundant* is *rih-DUN-dunt*. *recruited* and *dismissed* differ: *-id* and *-t*.",
      "*economic* 读作 *ee-kuh-NOM-ik*，与 *economy* 的 *ih-KON-uh-mee* 不同。*redundant* 读作 *rih-DUN-dunt*。*recruited* 和 *dismissed* 词尾不同：*-id* 和 *-t*。",
    ),
    say: t(
      "After *I'd rather* comes the plain verb: *I'd rather work from home*. *I would prefer to* keeps *to*. After *They should* use the plain verb: *They should volunteer*.",
      "*I'd rather* 后接动词原形：*I'd rather work from home*。*I would prefer to* 要保留 *to*。*They should* 后接动词原形：*They should volunteer*。",
    ),
  },
  "science-ethics-and-medicine": {
    repeat: t(
      "*epidemic* is *ep-ih-DEM-ik*. *antibiotic* is *an-tee-by-OT-ik*. *dilemma* is *dih-LEM-uh*. *resilience* is *rih-ZIL-yuns*.",
      "*epidemic* 读作 *ep-ih-DEM-ik*。*antibiotic* 读作 *an-tee-by-OT-ik*。*dilemma* 读作 *dih-LEM-uh*。*resilience* 读作 *rih-ZIL-yuns*。",
    ),
    read: t(
      "*controversial* is *kon-truh-VER-shul*, but *controversy* is *KON-truh-ver-see*. *bacteria* is plural. *embryo* is *EM-bree-oh*.",
      "*controversial* 读作 *kon-truh-VER-shul*，而 *controversy* 读作 *KON-truh-ver-see*。*bacteria* 是复数。*embryo* 读作 *EM-bree-oh*。",
    ),
    say: t(
      "After *by* use the *-ing* form: *by getting enough sleep*. Say *I would most like to see cancer cured*, with *cured* at the end.",
      "*by* 后用 *-ing* 形式：*by getting enough sleep*。说 *I would most like to see cancer cured*，*cured* 放在最后。",
    ),
  },
  "climate-and-sustainability": {
    repeat: t(
      "*biodiversity* is *by-oh-dy-VER-sih-tee*. *deforestation* is *dee-for-ih-STAY-shun*. *biodegradable* is *by-oh-dih-GRAY-duh-bul*.",
      "*biodiversity* 读作 *by-oh-dy-VER-sih-tee*。*deforestation* 读作 *dee-for-ih-STAY-shun*。*biodegradable* 读作 *by-oh-dih-GRAY-duh-bul*。",
    ),
    read: t(
      "*nuclear* is *NOO-klee-er*, not *NOO-kyuh-ler*. *generate* is *JEN-uh-rate*. *atmosphere* is *AT-mus-feer*.",
      "*nuclear* 读作 *NOO-klee-er*，不是 *NOO-kyuh-ler*。*generate* 读作 *JEN-uh-rate*。*atmosphere* 读作 *AT-mus-feer*。",
    ),
    say: t(
      "After *is to* use the plain verb: *The most effective thing is to fly less*. After *if I* say *fly less*, not *will fly less*.",
      "*is to* 后接动词原形：*The most effective thing is to fly less*。*if I* 后说 *fly less*，不说 *will fly less*。",
    ),
  },
  "media-and-persuasion": {
    repeat: t(
      "*correspondent* is *kor-ih-SPON-dunt*. *algorithm* is *AL-guh-rith-um*. *propaganda* is *prop-uh-GAN-duh*.",
      "*correspondent* 读作 *kor-ih-SPON-dunt*。*algorithm* 读作 *AL-guh-rith-um*。*propaganda* 读作 *prop-uh-GAN-duh*。",
    ),
    read: t(
      "*exaggerate* is *ig-ZAJ-uh-rate*; the double *g* is one *j*. *rhetoric* is *RET-er-ik*. *manipulate* is *muh-NIP-yuh-late*.",
      "*exaggerate* 读作 *ig-ZAJ-uh-rate*，双 *g* 只读一个 *j*。*rhetoric* 读作 *RET-er-ik*。*manipulate* 读作 *muh-NIP-yuh-late*。",
    ),
    say: t(
      "Plural adverts take a plural verb: *Pop-up adverts annoy me most*. *I think it should be regulated* keeps *be*. Possessives keep *'s*: *Mandela's speech*.",
      "复数的广告用复数动词：*Pop-up adverts annoy me most*。*I think it should be regulated* 别漏 *be*。所有格保留 *'s*：*Mandela's speech*。",
    ),
  },
  "education-and-opportunity": {
    repeat: t(
      "*dissertation* is *dis-er-TAY-shun*. *comprehension* is *kom-prih-HEN-shun*. *plagiarism* is *PLAY-juh-riz-um*.",
      "*dissertation* 读作 *dis-er-TAY-shun*。*comprehension* 读作 *kom-prih-HEN-shun*。*plagiarism* 读作 *PLAY-juh-riz-um*。",
    ),
    read: t(
      "*academic* is *ak-uh-DEM-ik*, unlike *uh-KAD-uh-mee*. *criterion* is singular and *criteria* plural. *eligible* is *EL-ih-juh-bul*.",
      "*academic* 读作 *ak-uh-DEM-ik*，与 *academy* 的 *uh-KAD-uh-mee* 不同。*criterion* 是单数，*criteria* 是复数。*eligible* 读作 *EL-ih-juh-bul*。",
    ),
    say: t(
      "Subjects take no article: *I would like to study medicine*. After *Schools can* use the plain verb: *Schools can lend laptops*.",
      "学科前不加冠词：*I would like to study medicine*。*Schools can* 后接动词原形：*Schools can lend laptops*。",
    ),
  },
  "culture-identity-and-globalization": {
    repeat: t(
      "*indigenous* is *in-DIJ-ih-nus*. *diaspora* is *dy-AS-puh-ruh*. *cosmopolitan* is *koz-muh-POL-ih-tun*.",
      "*indigenous* 读作 *in-DIJ-ih-nus*。*diaspora* 读作 *dy-AS-puh-ruh*。*cosmopolitan* 读作 *koz-muh-POL-ih-tun*。",
    ),
    read: t(
      "*ethnic* has a soft *th*. *pronunciation* is *pruh-nun-see-AY-shun*; there is no *noun* in it. *superstitious* is *soo-per-STISH-us*.",
      "*ethnic* 中间是轻柔的 *th*。*pronunciation* 读作 *pruh-nun-see-AY-shun*，里面没有 *noun*。*superstitious* 读作 *soo-per-STISH-us*。",
    ),
    say: t(
      "*It has changed what I eat* keeps *has*. Say *I am proud of*, with *of*. Festivals keep *the*: *the Day of the Dead*.",
      "*It has changed what I eat* 别漏 *has*。说 *I am proud of*，别漏 *of*。节日保留 *the*：*the Day of the Dead*。",
    ),
  },
  "technology-and-the-future": {
    repeat: t(
      "*autonomous* is *aw-TON-uh-mus*. *encryption* is *en-KRIP-shun*. *extraterrestrial* is *ek-struh-tuh-RES-tree-ul*.",
      "*autonomous* 读作 *aw-TON-uh-mus*。*encryption* 读作 *en-KRIP-shun*。*extraterrestrial* 读作 *ek-struh-tuh-RES-tree-ul*。",
    ),
    read: t(
      "*sophisticated* is *suh-FIS-tih-kay-tid*. *obsolete* is stressed on the last beat in British and the first in American; keep one. *phishing* says *f*.",
      "*sophisticated* 读作 *suh-FIS-tih-kay-tid*。*obsolete* 英式重音在后、美式在前，选一种保持一致。*phishing* 读 *f*。",
    ),
    say: t(
      "*I think robots will drive taxis first* puts *first* at the end. Say *travel by electric car*, with no *an*. After *ask it to* use the plain verb.",
      "*I think robots will drive taxis first* 把 *first* 放在句末。说 *travel by electric car*，不加 *an*。*ask it to* 后接动词原形。",
    ),
  },
  "law-rights-and-justice": {
    repeat: t(
      "*prosecutor* is *PROS-ih-kyoo-ter*. *constitution* is *kon-stih-TOO-shun*. *humanitarian* is *hyoo-man-ih-TAIR-ee-un*.",
      "*prosecutor* 读作 *PROS-ih-kyoo-ter*。*constitution* 读作 *kon-stih-TOO-shun*。*humanitarian* 读作 *hyoo-man-ih-TAIR-ee-un*。",
    ),
    read: t(
      "*permit* is *PER-mit* as a noun and *per-MIT* as a verb. *testimony* is *TES-tih-moh-nee*. *burglary* is *BUR-gluh-ree*.",
      "*permit* 作名词读 *PER-mit*，作动词读 *per-MIT*。*testimony* 读作 *TES-tih-moh-nee*。*burglary* 读作 *BUR-gluh-ree*。",
    ),
    say: t(
      "Say *at sixteen* for an age. *I would introduce a law against plastic bags* keeps *a law* before *against* or *for*. After *should* use the plain verb.",
      "年龄用 *at sixteen*。*I would introduce a law against plastic bags* 在 *against* 或 *for* 前保留 *a law*。*should* 后接动词原形。",
    ),
  },
  "mind-and-behavior": {
    repeat: t(
      "*subconscious* is *sub-KON-shus*. *procrastinate* is *proh-KRAS-tih-nate*. *nostalgia* is *nos-TAL-juh*. *insomnia* is *in-SOM-nee-uh*.",
      "*subconscious* 读作 *sub-KON-shus*。*procrastinate* 读作 *proh-KRAS-tih-nate*。*nostalgia* 读作 *nos-TAL-juh*。*insomnia* 读作 *in-SOM-nee-uh*。",
    ),
    read: t(
      "*deliberate* is *dih-LIB-er-ut* as an adjective and *dih-LIB-uh-rate* as a verb. *irrational* is *ih-RASH-uh-nul*. *exhausted* has a silent *h*.",
      "*deliberate* 作形容词读 *dih-LIB-er-ut*，作动词读 *dih-LIB-uh-rate*。*irrational* 读作 *ih-RASH-uh-nul*。*exhausted* 的 *h* 不发音。",
    ),
    say: t(
      "After *by* and *stop* use the *-ing* form: *by making a list*, *I'd like to stop checking my phone*. Say *a morning person* with *a*.",
      "*by* 和 *stop* 后用 *-ing* 形式：*by making a list*、*I'd like to stop checking my phone*。说 *a morning person*，别漏 *a*。",
    ),
  },
};

/** topics are the speaking topics of the units of B2, two to a unit, in their order. */
export const topics: readonly TopicDef[] = units.flatMap((u) =>
  unitSpeaking({
    id: `b2-speaking-${u.slug}`,
    title: t(`Speaking: ${u.en}`, `口语：${u.zh}`),
    summary: t("Say the unit's words, and read its sentences aloud.", `说出“${u.zh}”的词汇，并朗读句子。`),
    listening: `b2-listening-${u.slug}`,
    words: u.words,
    frames: frames[u.slug],
    watchOut: watchOuts[u.slug],
  }),
);
