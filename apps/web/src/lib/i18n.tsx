import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";

import { LOCALE_COOKIE, type Locale } from "./locale.ts";

/** Localized is a content text as it comes over the wire: one string per locale. */
export interface Localized {
  readonly values: { readonly [locale: string]: string };
}

const messages = {
  en: {
    tagline: "Learn mathematics the efficient way",
    heroBody:
      "An adaptive course that finds what you already know, teaches the next step when you are ready for it, and schedules reviews just before you would forget.",
    heroPoints: [
      "A placement diagnostic so you never relearn what you know",
      "Lessons in small steps, each with a worked example",
      "Spaced reviews, compressed by what later lessons already practice",
    ],
    courses: "Courses",
    topics: "topics",
    signIn: "Sign in",
    signUp: "Create account",
    signOut: "Sign out",
    name: "Name",
    email: "Email",
    password: "Password",
    passwordHint: "At least 8 characters",
    noAccount: "No account yet?",
    haveAccount: "Already have an account?",
    enroll: "Enroll",
    continueLearning: "Continue learning",
    viewCourse: "View course",
    learned: "Learned",
    due: "Due for review",
    today: "Today",
    total: "Total",
    xpTitle: "XP",
    last14: "Last 14 days",
    yourTasks: "Your next tasks",
    tasksHint: "Do them in order: the first is what helps most now.",
    resume: "Resume",
    start: "Start",
    diagnostic: "Placement diagnostic",
    diagnosticBody: (n: number) =>
      `Up to ${n} questions find which topics you already know, so the course starts where you are. Answer "I don't know" instead of guessing.`,
    skipDiagnostic: "Skip and start from the beginning",
    lesson: "Lesson",
    review: "Review",
    quiz: "Quiz",
    quizBody: (n: number) => `${n} questions on recent and older topics, with no hints until the end.`,
    reviewCovers: (n: number) => `Also refreshes ${n} related topic${n === 1 ? "" : "s"}`,
    kps: (n: number) => `${n} step${n === 1 ? "" : "s"}`,
    progress: "Progress map",
    dashboard: "Dashboard",
    nothingToDo: "Nothing to do right now: every topic is learned and no review is due. Come back tomorrow.",
    step: (i: number, n: number) => `Step ${i} of ${n}`,
    workedExample: "Worked example",
    showSolution: "Show solution",
    answer: "Answer",
    practice: "Practice",
    gotIt: "Start practicing",
    submit: "Check",
    dontKnow: "I don't know",
    next: "Continue",
    correct: "Correct!",
    incorrect: "Not quite.",
    correctAnswer: "Correct answer",
    solution: "Solution",
    streak: (s: number, n: number) => `${s} / ${n} in a row`,
    question: (i: number, n: number) => (n > 0 ? `Question ${i} of ${n}` : `Question ${i}`),
    questionUpTo: (i: number, n: number) => `Question ${i} (at most ${n})`,
    choiceHint: "Press A, B, C… to choose and Enter to check.",
    passed: "Passed",
    failed: "Not passed this time",
    lessonPassed: "Lesson complete",
    lessonFailed:
      "This lesson was hard going. That usually means an earlier topic needs a refresh: you will review it first, and the lesson will come back after.",
    reviewFailed: "This review will come back soon, so the topic sticks.",
    placedResult: (n: number) => `Placement done: ${n} topic${n === 1 ? "" : "s"} marked as known.`,
    score: (c: number, n: number) => `${c} of ${n} correct`,
    earned: (xp: number) => `+${xp} XP`,
    backToDashboard: "Back to dashboard",
    yourAnswer: "Your answer",
    skipped: "skipped",
    status: {
      locked: "Locked",
      available: "Available",
      failed: "Needs prerequisites",
      learned: "Learned",
      due: "Due",
      assumed: "Assumed",
    },
    memory: "Memory",
    language: "Language",
    error: "Something went wrong.",
    retry: "Try again",
    loading: "Loading…",
    signInToLearn: "Sign in to enroll and start learning.",
    mathHint: "Type math with the keyboard: / for a fraction, ^ for a power.",
  },
  "zh-CN": {
    tagline: "高效地学数学",
    heroBody: "自适应课程：先找出你已经会的，在你准备好时教下一步，并在你快要遗忘之前安排复习。",
    heroPoints: ["入学诊断，不再重学已会的内容", "小步讲授，每一步都有例题", "间隔复习，后续课程已练到的内容不再单独复习"],
    courses: "课程",
    topics: "个知识点",
    signIn: "登录",
    signUp: "注册",
    signOut: "退出登录",
    name: "名字",
    email: "邮箱",
    password: "密码",
    passwordHint: "至少 8 个字符",
    noAccount: "还没有账号？",
    haveAccount: "已有账号？",
    enroll: "选修",
    continueLearning: "继续学习",
    viewCourse: "查看课程",
    learned: "已学会",
    due: "待复习",
    today: "今日",
    total: "累计",
    xpTitle: "XP",
    last14: "最近 14 天",
    yourTasks: "接下来的任务",
    tasksHint: "按顺序完成：排在最前的此刻最有帮助。",
    resume: "继续",
    start: "开始",
    diagnostic: "入学诊断",
    diagnosticBody: (n: number) => `最多 ${n} 道题，找出你已经掌握的知识点，让课程从合适的地方开始。不会就选"我不会"，不要猜。`,
    skipDiagnostic: "跳过，从头开始",
    lesson: "课程",
    review: "复习",
    quiz: "测验",
    quizBody: (n: number) => `${n} 道题，涵盖近期和较早的知识点，结束前没有提示。`,
    reviewCovers: (n: number) => `同时巩固 ${n} 个相关知识点`,
    kps: (n: number) => `${n} 步`,
    progress: "进度图",
    dashboard: "学习主页",
    nothingToDo: "现在没有任务：所有知识点都已学会，也没有到期的复习。明天再来吧。",
    step: (i: number, n: number) => `第 ${i} 步，共 ${n} 步`,
    workedExample: "例题",
    showSolution: "查看解答",
    answer: "答案",
    practice: "练习",
    gotIt: "开始练习",
    submit: "检查",
    dontKnow: "我不会",
    next: "继续",
    correct: "正确！",
    incorrect: "不太对。",
    correctAnswer: "正确答案",
    solution: "解答",
    streak: (s: number, n: number) => `连对 ${s} / ${n}`,
    question: (i: number, n: number) => (n > 0 ? `第 ${i} 题，共 ${n} 题` : `第 ${i} 题`),
    questionUpTo: (i: number, n: number) => `第 ${i} 题（最多 ${n} 题）`,
    choiceHint: "按 A、B、C… 选择，按回车检查。",
    passed: "通过",
    failed: "这次未通过",
    lessonPassed: "课程完成",
    lessonFailed: "这节课有些吃力，通常说明某个先修知识点需要巩固：你会先复习它，之后这节课会再出现。",
    reviewFailed: "这个知识点很快会再次复习，帮你记牢。",
    placedResult: (n: number) => `诊断完成：${n} 个知识点被判定为已掌握。`,
    score: (c: number, n: number) => `答对 ${c} / ${n}`,
    earned: (xp: number) => `+${xp} XP`,
    backToDashboard: "返回学习主页",
    yourAnswer: "你的答案",
    skipped: "已跳过",
    status: {
      locked: "未解锁",
      available: "可学习",
      failed: "需先巩固先修",
      learned: "已学会",
      due: "待复习",
      assumed: "视为已知",
    },
    memory: "记忆",
    language: "语言",
    error: "出错了。",
    retry: "重试",
    loading: "加载中…",
    signInToLearn: "登录后即可选修并开始学习。",
    mathHint: "用键盘输入数学式：/ 输入分数，^ 输入乘方。",
  },
} satisfies Record<Locale, unknown>;

export type Messages = (typeof messages)["en"];

interface I18n {
  readonly locale: Locale;
  readonly m: Messages;
  /** tx picks a content text in the current locale, falling back to English. */
  tx(t: Localized | undefined): string;
  setLocale(l: Locale): void;
}

const I18nContext = createContext<I18n | null>(null);

export function I18nProvider({ initial, children }: { initial: Locale; children: ReactNode }) {
  const [locale, setState] = useState<Locale>(initial);
  const setLocale = useCallback((l: Locale) => {
    setState(l);
    // biome-ignore lint/suspicious/noDocumentCookie: the Cookie Store API is not available in every supported browser
    document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = l;
  }, []);
  const value = useMemo<I18n>(
    () => ({
      locale,
      m: messages[locale] as Messages,
      tx: (t) => t?.values[locale] ?? t?.values.en ?? "",
      setLocale,
    }),
    [locale, setLocale],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  const v = useContext(I18nContext);
  if (!v) throw new Error("useI18n outside I18nProvider");
  return v;
}
