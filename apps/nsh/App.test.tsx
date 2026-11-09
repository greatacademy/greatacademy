import { expect, open, test } from "nsh/test";

const url = "http://localhost:5173/api/rpc/ga.catalog.v1.CatalogService";
const json = (body: unknown) => ({ status: 200, headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
const text = (en: string, zh: string) => ({ values: { en, "zh-CN": zh } });

const network = {
  [`POST ${url}/ListCourses`]: json({
    subjects: [{ id: "math", title: text("Mathematics", "数学"), mark: "M", hue: 250 }],
    courses: [
      {
        id: "algebra",
        subjectId: "math",
        title: text("Algebra", "代数"),
        description: text("Solve equations", "解方程"),
        subjectTitle: text("Mathematics", "数学"),
        topicCount: 2,
      },
    ],
  }),
  [`POST ${url}/GetCourse`]: json({
    course: {
      id: "algebra",
      title: text("Algebra", "代数"),
      units: [
        {
          title: text("Unit one", "第一单元"),
          modules: [{ title: text("Module one", "第一模块"), topics: [{ id: "linear", title: text("Linear equations", "一次方程") }] }],
        },
      ],
    },
  }),
};

test("opens a course from the list", async () => {
  const app = await open("./App.tsx", { network });
  await app.press("text:Browse the courses");
  await app.waitFor("text:2 topics");
  await app.press("text:Solve equations");
  await app.waitFor("text:· Linear equations");
  expect(app.texts()).toContain("Unit one");
});

test("shows a course opened again from what it read before, without asking the server", async () => {
  let reads = 0;
  const app = await open("./App.tsx", {
    network: {
      ...network,
      [`POST ${url}/GetCourse`]: () => {
        reads += 1;
        return network[`POST ${url}/GetCourse`];
      },
    },
  });
  await app.press("text:Browse the courses");
  await app.press("text:Solve equations");
  await app.waitFor("text:· Linear equations");
  await app.back();
  await app.press("text:Solve equations");
  expect(app.texts()).toContain("Unit one");
  expect(reads).toBe(1);
});

test("follows a Chinese device", async () => {
  const app = await open("./App.tsx", { network, locale: "zh-Hans-CN" });
  await app.press("text:先看看课程");
  await app.waitFor("text:2 个知识点");
  expect(app.texts()).toContain("代数");
});

test("offers a retry when the call fails", async () => {
  const app = await open("./App.tsx", { network: { [`POST ${url}/ListCourses`]: { status: 503, body: "{}" } } });
  await app.press("text:Browse the courses");
  await app.waitFor("text:The server could not answer just now. Try again in a moment.");
  await app.waitFor("text:Retry");
});

test("says when no plan covers a subject, without prices or a way to pay", async () => {
  const denied = {
    status: 403,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ code: "permission_denied", message: "no plan covers math" }),
  };
  const app = await open("./App.tsx", { network: { [`POST ${url}/ListCourses`]: denied } });
  await app.press("text:Browse the courses");
  await app.waitFor("text:No plan of this account covers this subject.");
  expect(app.texts().join(" ")).not.toMatch(/\$|Buy|Plans/);
});

test("says when there is no connection, and loads once it is back", async () => {
  let down = true;
  const app = await open("./App.tsx", {
    network: { ...network, [`POST ${url}/ListCourses`]: () => (down ? { error: "offline" } : network[`POST ${url}/ListCourses`]) },
  });
  await app.press("text:Browse the courses");
  await app.waitFor("text:No connection");
  await app.waitFor("text:Offline. Trying again when the connection is back.");
  down = false;
  await app.press("text:Retry");
  await app.waitFor("text:2 topics");
  expect(app.texts()).not.toContain("Offline. Trying again when the connection is back.");
});

const privacyUrl = "http://localhost:5173/api/rpc/ga.privacy.v1.PrivacyService";
const authUrl = "http://localhost:5173/api/auth";
const countries = { [`POST ${privacyUrl}/ListCountries`]: json({ countries: ["US", "CN"] }) };
const accessIs = (status: string) => ({ [`POST ${privacyUrl}/GetAccess`]: json({ status }) });

async function answerAge(app: Awaited<ReturnType<typeof open>>, year: string) {
  await app.press("label:Country or region");
  await app.press("text:United States");
  await app.press("label:Month and year of birth");
  await app.press(`text:${year}`);
  await app.press("label:March");
  await app.press("text:Continue");
}

test("signs in, keeps the token and sends it", async () => {
  const app = await open("./App.tsx", {
    network: {
      ...network,
      ...accessIs("ACCESS_STATUS_OK"),
      [`POST ${authUrl}/sign-in/email`]: {
        status: 200,
        headers: { "content-type": "application/json", "set-auth-token": "tok.sig" },
        body: JSON.stringify({ token: "tok" }),
      },
    },
  });
  await app.press("text:I have an account");
  await app.type("label:Email or username", "a@example.test");
  await app.type("label:Password", "correct horse");
  await app.press("role:button[Sign in]");
  await app.waitFor("text:Learn");
  expect(app.storage()["ga.session"]).toBe("tok.sig");
  const call = app.requests().find((r) => r.url.endsWith("/GetAccess"));
  expect(call?.headers.authorization ?? call?.headers.Authorization).toBe("Bearer tok.sig");
});

test("words a wrong password", async () => {
  const app = await open("./App.tsx", {
    network: {
      ...network,
      [`POST ${authUrl}/sign-in/username`]: {
        status: 401,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: "INVALID_USERNAME_OR_PASSWORD", message: "Invalid" }),
      },
    },
  });
  await app.press("text:I have an account");
  await app.type("label:Email or username", "kid");
  await app.type("label:Password", "wrong-password");
  await app.press("role:button[Sign in]");
  await app.waitFor("text:That email, username or password isn't right.");
  expect(app.storage()["ga.session"]).toBeUndefined();
});

test("holds an unanswered account on the age question until it answers", async () => {
  let answered = false;
  const app = await open("./App.tsx", {
    storage: { "ga.session": "tok.sig" },
    network: {
      ...network,
      ...countries,
      [`POST ${privacyUrl}/GetAccess`]: () => json({ status: answered ? "ACCESS_STATUS_OK" : "ACCESS_STATUS_NEEDS_AGE" }),
      [`POST ${privacyUrl}/SetAge`]: () => {
        answered = true;
        return json({ band: "BAND_ADULT" });
      },
    },
  });
  await app.waitFor("text:Before you start");
  await answerAge(app, "1990");
  await app.waitFor("text:Learn");
});

test("explains a market that is closed and can sign out", async () => {
  const app = await open("./App.tsx", {
    storage: { "ga.session": "tok.sig" },
    network: { ...network, ...accessIs("ACCESS_STATUS_MARKET_CLOSED"), [`POST ${authUrl}/sign-out`]: json({ success: true }) },
  });
  await app.waitFor("text:Not available yet");
  await app.press("text:Sign out");
  await app.waitFor("text:Get started");
  expect(app.storage()["ga.session"]).toBeUndefined();
});

test("drops a session the server no longer accepts", async () => {
  const app = await open("./App.tsx", {
    storage: { "ga.session": "old.sig" },
    network: {
      ...network,
      [`POST ${privacyUrl}/GetAccess`]: {
        status: 401,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: "unauthenticated", message: "sign in first" }),
      },
    },
  });
  await app.waitFor("text:Get started");
  await app.waitUntil(() => app.storage()["ga.session"] === undefined);
});

test("stops a child at sign-up, keeps no answer, and stays stopped", async () => {
  const child = { ...network, ...countries, [`POST ${privacyUrl}/CheckAge`]: json({ band: "BAND_CHILD" }) };
  const app = await open("./App.tsx", { network: child });
  await app.press("text:Get started");
  await app.press("label:Me");
  await answerAge(app, "2018");
  await app.waitFor("text:Please ask an adult");
  expect(Object.keys(app.storage())).toEqual(["ga.sign-up-stopped"]);
  const again = await open("./App.tsx", { network: child, storage: app.storage() });
  await again.press("text:Get started");
  await again.press("label:Me");
  await again.waitFor("text:Please ask an adult");
});

test("lets a parent or guardian sign up from the stop page", async () => {
  const app = await open("./App.tsx", {
    network: { ...network, ...countries, [`POST ${privacyUrl}/CheckAge`]: json({ band: "BAND_CHILD" }) },
    storage: { "ga.sign-up-stopped": String(Date.now()) },
  });
  await app.press("text:Get started");
  await app.press("label:Me");
  await app.waitFor("text:Please ask an adult");
  await app.press("text:A parent or guardian signs up here");
  await app.waitFor("text:About you");
});

test("forgets a stop after a day", async () => {
  const app = await open("./App.tsx", {
    network: { ...network, ...countries },
    storage: { "ga.sign-up-stopped": String(Date.now() - 25 * 60 * 60 * 1000) },
  });
  await app.press("text:Get started");
  await app.press("label:Me");
  await app.waitFor("text:Before you start");
});

test("stops a parent path that is not answered by an adult", async () => {
  const app = await open("./App.tsx", {
    network: { ...network, ...countries, [`POST ${privacyUrl}/CheckAge`]: json({ band: "BAND_TEEN" }) },
  });
  await app.press("text:Get started");
  await app.press("label:My children");
  await answerAge(app, "2011");
  await app.waitFor("text:Please ask an adult");
});

test("takes a parent who signs up on to their learners", async () => {
  let answered = false;
  const app = await open("./App.tsx", {
    network: {
      ...network,
      ...countries,
      [`POST ${privacyUrl}/CheckAge`]: json({ band: "BAND_ADULT" }),
      [`POST ${privacyUrl}/GetAccess`]: () => json({ status: answered ? "ACCESS_STATUS_OK" : "ACCESS_STATUS_NEEDS_AGE" }),
      [`POST ${privacyUrl}/SetAge`]: () => {
        answered = true;
        return json({ band: "BAND_ADULT" });
      },
      [`POST ${authUrl}/sign-up/email`]: {
        status: 200,
        headers: { "content-type": "application/json", "set-auth-token": "tok.sig" },
        body: JSON.stringify({ token: "tok" }),
      },
      [`POST ${learningUrl}/GetProfile`]: json({ enrollments: [], xp: {} }),
      [`POST ${accountUrl}/GetSettings`]: json({}),
      [`POST ${accountUrl}/ListGuardedLearners`]: json({ learners: [] }),
    },
  });
  await app.press("text:Get started");
  await app.press("label:My children");
  await app.waitFor("text:About you");
  await answerAge(app, "1985");
  await app.type("label:Name", "Parent");
  await app.type("label:Email", "p@example.test");
  await app.type("label:Password", "correct horse");
  await app.type("label:Confirm password", "correct horse");
  await app.press("role:button[Create account]");
  await app.waitFor("text:Learners you follow");
});

test("asks for the password twice and shows it on request", async () => {
  const app = await open("./App.tsx", {
    network: { ...network, ...countries, [`POST ${privacyUrl}/CheckAge`]: json({ band: "BAND_ADULT" }) },
  });
  await app.press("text:Get started");
  await app.press("label:Me");
  await answerAge(app, "1990");
  await app.type("label:Name", "Test");
  await app.type("label:Email", "a@example.test");
  await app.type("label:Password", "correct horse");
  await app.type("label:Confirm password", "correct hose");
  await app.waitFor("text:The two passwords are not the same.");
  await app.press("label:Show password >> nth=0");
  await app.waitFor("label:Hide password");
});

test("asks a teen for no real name", async () => {
  const app = await open("./App.tsx", {
    network: { ...network, ...countries, [`POST ${privacyUrl}/CheckAge`]: json({ band: "BAND_TEEN" }) },
  });
  await app.press("text:Get started");
  await app.press("label:Me");
  await answerAge(app, "2011");
  await app.waitFor("label:Email");
  expect(app.texts()).not.toContain("Name");
});

test("signs up and goes straight to the courses once the answer is stored", async () => {
  let answered = false;
  const app = await open("./App.tsx", {
    network: {
      ...network,
      ...countries,
      [`POST ${privacyUrl}/CheckAge`]: json({ band: "BAND_ADULT" }),
      [`POST ${privacyUrl}/GetAccess`]: () => json({ status: answered ? "ACCESS_STATUS_OK" : "ACCESS_STATUS_NEEDS_AGE" }),
      [`POST ${privacyUrl}/SetAge`]: () => {
        answered = true;
        return json({ band: "BAND_ADULT" });
      },
      [`POST ${authUrl}/sign-up/email`]: {
        status: 200,
        headers: { "content-type": "application/json", "set-auth-token": "tok.sig" },
        body: JSON.stringify({ token: "tok" }),
      },
    },
  });
  await app.press("text:Get started");
  await app.press("label:Me");
  await answerAge(app, "1990");
  await app.waitFor("label:Name");
  await app.type("label:Name", "Test");
  await app.type("label:Email", "a@example.test");
  await app.type("label:Password", "correct horse");
  await app.type("label:Confirm password", "correct horse");
  await app.press("role:button[Create account]");
  await app.waitFor("text:Learn");
  expect(app.shows("Before you start")).toBe(false);
});

const learningUrl = "http://localhost:5173/api/rpc/ga.learning.v1.LearningService";
const lessonTask = { lesson: { topicId: "linear", title: text("Linear equations", "一次方程"), xp: 10, knowledgePoints: 1 } };
const choiceProblem = {
  prompt: text("Pick the even number", "选出偶数"),
  input: { choice: { options: [text("Three", "三"), text("Four", "四")] } },
};

function signedIn(extra: Record<string, unknown>) {
  return {
    network: {
      ...network,
      [`POST ${privacyUrl}/GetAccess`]: json({ status: "ACCESS_STATUS_OK" }),
      [`POST ${learningUrl}/GetProfile`]: json({
        enrollments: [{ courseId: "algebra", subjectId: "math", stats: { learned: 1, total: 2 } }],
        xp: {},
        canDecide: true,
      }),
      [`POST ${accountUrl}/GetSettings`]: json({ username: "learner" }),
      ...extra,
    },
    storage: { "ga.session": "tok.sig" },
  };
}

test("studies a lesson from the course list to its result", async () => {
  let done = false;
  const session = { id: "s1", courseId: "algebra", task: lessonTask };
  const app = await open(
    "./App.tsx",
    signedIn({
      [`POST ${learningUrl}/GetDashboard`]: () =>
        json({ courseId: "algebra", diagnosed: true, tasks: done ? [] : [lessonTask], stats: { learned: done ? 2 : 1, total: 2 }, xp: {} }),
      [`POST ${learningUrl}/StartTask`]: json({
        session: {
          ...session,
          question: {
            index: 0,
            intro: {
              index: 0,
              count: 1,
              title: text("Even numbers", "偶数"),
              explanation: text("Even numbers split in two.", "偶数能对半分。"),
              example: { problem: choiceProblem, solution: text("Four splits in two.", "四能对半分。"), answer: "1" },
            },
            problem: choiceProblem,
            feedback: true,
            lesson: { knowledgePoint: 0, knowledgePoints: 1, streak: 0, needed: 1 },
          },
        },
      }),
      [`POST ${learningUrl}/GetSession`]: json({
        session: {
          ...session,
          question: {
            index: 0,
            intro: {
              index: 0,
              count: 1,
              title: text("Even numbers", "偶数"),
              explanation: text("Even numbers split in two.", "偶数能对半分。"),
              example: { problem: choiceProblem, solution: text("Four splits in two.", "四能对半分。"), answer: "1" },
            },
            problem: choiceProblem,
            feedback: true,
            lesson: { knowledgePoint: 0, knowledgePoints: 1, streak: 0, needed: 1 },
          },
        },
      }),
      [`POST ${learningUrl}/SubmitAnswer`]: () => {
        done = true;
        return json({
          feedback: { correct: true, solution: text("Four splits in two.", "四能对半分。"), answer: "1" },
          session: { ...session, answered: 1, result: { passed: true, correct: 1, asked: 1, xp: 10, fullXp: 10 } },
        });
      },
    }),
  );
  await app.waitFor("text:Next up");
  await app.press("role:button[Start]");
  await app.waitFor("text:Even numbers split in two.");
  await app.press("text:Show solution");
  await app.waitFor("text:Four splits in two.");
  await app.press("text:Start practicing");
  // B picks the second option on a keyboard, and Return checks it.
  await app.keyboard.press("b");
  await app.keyboard.press("Enter");
  await app.waitFor("text:Correct!");
  // Leaving asks first; staying keeps the answer where it was.
  const asked: string[] = [];
  app.onDialog((dialog) => {
    asked.push(dialog.title ?? "");
    return "Keep going";
  });
  await app.press("label:Close");
  await app.keyboard.press("escape");
  expect(asked).toEqual(["Leave this task?", "Leave this task?"]);
  expect(app.shows("Correct!")).toBe(true);
  await app.press("role:button[Continue]");
  await app.waitFor("text:Lesson complete");
  await app.waitFor("text:+10 XP");
  await app.press("text:Back to dashboard");
  await app.waitFor("text:2 / 2 topics");
  expect(app.shows("Nothing to do right now: every topic is learned and no review is due. Come back tomorrow.")).toBe(true);
});

test("takes math as plain text and skips in the diagnostic without feedback", async () => {
  const diagnostic = { diagnostic: { maxQuestions: 5 } };
  const session = { id: "s2", courseId: "algebra", task: diagnostic };
  const answers: unknown[] = [];
  const question = (index: number) => ({
    index,
    canSkip: true,
    problem: { prompt: text(`Add ${index + 1}`, `加 ${index + 1}`), input: { math: {} } },
  });
  const app = await open(
    "./App.tsx",
    signedIn({
      [`POST ${learningUrl}/GetDashboard`]: json({
        courseId: "algebra",
        diagnosed: false,
        tasks: [diagnostic],
        stats: { learned: 0, total: 2 },
        xp: {},
      }),
      [`POST ${learningUrl}/StartTask`]: json({ session: { ...session, question: question(0) } }),
      [`POST ${learningUrl}/GetSession`]: json({ session: { ...session, question: question(0) } }),
      [`POST ${learningUrl}/SubmitAnswer`]: (request: { body?: string | null }) => {
        const body = JSON.parse(request.body ?? "{}") as { index?: number };
        answers.push(body);
        return (body.index ?? 0) === 0
          ? json({ session: { ...session, answered: 1, question: question(1) } })
          : json({ session: { ...session, answered: 2, result: { placed: 1, asked: 2 } } });
      },
    }),
  );
  await app.press("role:button[Start]");
  await app.waitFor("text:Add 1");
  await app.press("text:Type it as plain text");
  await app.type("label:Your answer", "3/4");
  await app.press("role:button[Check]");
  await app.waitFor("text:Add 2");
  expect(app.shows("Correct!")).toBe(false);
  await app.press("role:button[I don't know]");
  await app.waitFor("text:Placement done: 1 topic marked as known.");
  expect(answers).toEqual([
    { sessionId: "s2", response: "3/4" },
    { sessionId: "s2", index: 1, skip: true },
  ]);
});

test("sends a link to reset a forgotten password", async () => {
  const app = await open("./App.tsx", { network: { ...network, [`POST ${authUrl}/request-password-reset`]: json({ status: true }) } });
  await app.press("text:I have an account");
  await app.press("text:Forgot your password?");
  await app.type("label:Email", "a@example.test");
  await app.press("text:Send the link");
  await app.waitFor("text:Check your email");
  const call = app.requests().find((r) => r.url.endsWith("/request-password-reset"));
  expect(JSON.parse(call?.body ?? "{}").email).toBe("a@example.test");
});

const accountUrl = "http://localhost:5173/api/rpc/ga.account.v1.AccountService";
const settingsNetwork = {
  ...network,
  ...accessIs("ACCESS_STATUS_OK"),
  [`POST ${accountUrl}/GetSettings`]: json({ username: "learner" }),
  [`POST ${learningUrl}/GetProfile`]: json({ enrollments: [], xp: {}, canDecide: true }),
  [`POST ${authUrl}/delete-user`]: json({ success: true }),
};

test("keeps the language chosen in the settings", async () => {
  const app = await open("./App.tsx", { storage: { "ga.session": "tok.sig" }, network: settingsNetwork, platform: "macos" });
  await app.press("label:Settings");
  await app.press("text:简体中文");
  await app.waitFor("text:语言");
  expect(app.storage()["ga.language"]).toBe("zh-CN");
  const again = await open("./App.tsx", { storage: app.storage(), network: settingsNetwork, platform: "macos" });
  await again.waitFor("label:设置");
});

test("deletes the account after its password and a confirmation", async () => {
  const app = await open("./App.tsx", { storage: { "ga.session": "tok.sig" }, network: settingsNetwork, platform: "macos" });
  app.onDialog(() => "Delete my account");
  await app.press("label:Settings");
  await app.scroll("text:Contrast", 1500);
  await app.press("text:Delete my account");
  await app.type("label:Password", "correct horse");
  await app.press("role:button[Delete my account]");
  await app.waitFor("text:Get started");
  expect(app.storage()["ga.session"]).toBeUndefined();
});

test("puts the task in progress first on Learn, with the weekly goals", async () => {
  const app = await open(
    "./App.tsx",
    signedIn({
      [`POST ${learningUrl}/GetDashboard`]: json({
        courseId: "algebra",
        subjectId: "math",
        diagnosed: true,
        tasks: [lessonTask],
        active: { id: "s9", task: lessonTask },
        stats: { learned: 1, total: 2 },
        xp: { today: 20, goalToday: 30, week: 50, goalWeek: 150, total: 200, days: [10, 20] },
      }),
      [`POST ${learningUrl}/ListSessions`]: json({ sessions: [] }),
    }),
  );
  await app.waitFor("text:Resume");
  expect(app.texts().indexOf("Resume")).toBeLessThan(app.texts().indexOf("Weekly goals"));
  expect(app.texts()).toContain("Total earned");
  expect(app.texts()).toContain("200 XP");
  expect(app.texts()).toContain("20 / 30 XP");
  expect(app.texts()).toContain("50 / 150 XP");
  expect(app.texts()).toContain("10 XP to today's goal");
  expect(app.texts()).toContain("Resume");
});

test("chooses a first course from Learn, then answers the diagnostic's report", async () => {
  let chosen = false;
  let kept = false;
  const app = await open(
    "./App.tsx",
    signedIn({
      [`POST ${learningUrl}/GetProfile`]: () =>
        json({
          enrollments: chosen ? [{ courseId: "algebra", subjectId: "math", stats: { learned: 1, total: 2 } }] : [],
          xp: {},
          canDecide: true,
        }),
      [`POST ${learningUrl}/ChooseCourse`]: () => {
        chosen = true;
        return json({});
      },
      [`POST ${learningUrl}/KeepCourse`]: () => {
        kept = true;
        return json({});
      },
      [`POST ${learningUrl}/GetDashboard`]: () =>
        json({
          courseId: "algebra",
          diagnosed: true,
          tasks: [lessonTask],
          stats: { learned: 1, total: 2 },
          xp: {},
          remainingXp: 30,
          canDecide: true,
          ...(!kept && { report: { placed: 1, total: 2 } }),
        }),
    }),
  );
  await app.press("role:button[Choose a course]");
  await app.press("role:button[Start this course]");
  await app.waitFor("text:What the diagnostic found");
  expect(app.texts()).toContain("This course is the right place to start.");
  await app.press("role:button[Start learning]");
  await app.waitFor("role:button[Start]");
  expect(kept).toBe(true);
});

test("sets the weekly goals of the subject from Learn", async () => {
  const app = await open("./App.tsx", {
    ...signedIn({
      [`POST ${learningUrl}/GetDashboard`]: json({ courseId: "algebra", subjectId: "math", stats: {}, xp: {}, canDecide: true }),
      [`POST ${learningUrl}/SetGoals`]: json({}),
    }),
    platform: "macos",
  });
  await app.waitFor("text:No goal yet");
  await app.press("text:Set goals");
  await app.waitFor("text:150 XP a week");
  expect(app.texts()).toContain("Weekly goals · Mathematics");
  await app.press("label:More on Mon");
  await app.press("text:Save");
  await app.waitFor("text:Saved");
  const call = app.requests().find((r) => r.url.endsWith("/SetGoals"));
  expect(JSON.parse(call?.body ?? "{}").subjectId).toBe("math");
  expect(JSON.parse(call?.body ?? "{}").goals.weekdays).toEqual([35, 30, 30, 30, 30, 0, 0]);
});

test("switches tabs and opens the settings from the sidebar and its shortcuts on a desktop", async () => {
  const app = await open("./App.tsx", {
    ...signedIn({ [`POST ${learningUrl}/GetDashboard`]: json({ courseId: "algebra", stats: {}, xp: {} }) }),
    platform: "macos",
  });
  await app.waitFor("text:Weekly goals");
  await app.keyboard.press("mod+2");
  await app.waitFor("text:The last 14 days");
  await app.press("label:Course");
  await app.waitFor("text:Outline of the course");
  expect(app.texts()).toContain("1 / 2 topics");
  await app.keyboard.press("mod+,");
  await app.waitFor("text:Language");
  // Goals belong to a subject, on its pages, not to the settings.
  expect(app.texts()).not.toContain("Weekly goals");
});

test("shows a tab's key on hover and collapses the sidebar to its icons on a desktop", async () => {
  const app = await open("./App.tsx", {
    ...signedIn({ [`POST ${learningUrl}/GetDashboard`]: json({ courseId: "algebra", stats: {}, xp: {} }) }),
    platform: "macos",
    width: 1200,
    height: 800,
  });
  await app.waitFor("text:Weekly goals");
  expect(app.texts()).not.toContain("⌘2");
  await app.hover("label:Progress");
  await app.waitFor("text:⌘2");
  expect(app.texts()).not.toContain("⌘1");
  await app.press("label:Collapse the sidebar");
  await app.waitFor("label:Expand the sidebar");
  // The labels and the logo go once the sidebar has narrowed to its icons (the launch screen's logo has gone by then).
  await app.waitUntil(() => !app.texts().includes("Progress") && app.count("label:Great Academy") === 0);
  // The header names the tab beside the collapse button.
  expect(app.texts()).toContain("Learn");
  expect(app.shows("label:Settings")).toBe(true);
  expect(app.storage()["ga.sidebar"]).toBe("collapsed");
});

test("shows the progress map and the history of a course from Progress", async () => {
  const app = await open("./App.tsx", {
    ...signedIn({
      [`POST ${learningUrl}/GetDashboard`]: json({
        courseId: "algebra",
        diagnosed: true,
        tasks: [],
        stats: { learned: 1, total: 2 },
        xp: {},
      }),
      [`POST ${learningUrl}/GetCourseProgress`]: json({ topics: [{ topicId: "linear", status: "TOPIC_STATUS_LEARNED", memory: 0.8 }] }),
      [`POST ${learningUrl}/ListSessions`]: json({
        sessions: [{ id: "s1", task: lessonTask, completedAt: "1767225600000", passed: true, correct: 3, asked: 3, xp: 10, fullXp: 10 }],
      }),
    }),
    platform: "macos",
  });
  await app.press("label:Progress");
  await app.waitFor("text:80%");
  expect(app.texts()).toContain("Progress map");
  expect(app.texts()).toContain("Linear equations");
  expect(app.texts()).toContain("Learned 1");
  await app.press("text:History");
  await app.waitFor("text:+10 XP");
  expect(app.texts()).toContain("3 of 3 correct");
});

test("lists the learner's courses of the subject first, then the others by shelf", async () => {
  const course = (id: string, title: string, group?: string) => ({
    id,
    subjectId: "math",
    title: text(title, title),
    description: text("About it", "简介"),
    subjectTitle: text("Mathematics", "数学"),
    topicCount: 3,
    ...(group ? { group: text(group, group) } : {}),
  });
  const app = await open("./App.tsx", {
    ...signedIn({
      [`POST ${url}/ListCourses`]: json({
        subjects: [{ id: "math", title: text("Mathematics", "数学"), mark: "M", hue: 250 }],
        courses: [course("algebra", "Algebra", "School"), course("geometry", "Geometry", "School"), course("logic", "Logic")],
      }),
      [`POST ${learningUrl}/GetDashboard`]: json({ courseId: "algebra", stats: {}, xp: {} }),
    }),
    platform: "macos",
  });
  await app.press("label:Mathematics, switch subject");
  await app.press("text:Course catalog");
  await app.waitFor("text:My courses");
  const shown = app.texts();
  expect(shown.indexOf("My courses")).toBeLessThan(shown.indexOf("School"));
  expect(shown.indexOf("Geometry")).toBeLessThan(shown.indexOf("Other courses"));
  expect(shown.filter((t) => t === "Algebra")).toHaveLength(1);
});

test("switches subject, keeps the choice, and asks before changing course", async () => {
  const course = (id: string, title: string, subjectId: string) => ({
    id,
    subjectId,
    title: text(title, title),
    description: text("About it", "简介"),
    topicCount: 3,
  });
  const app = await open("./App.tsx", {
    ...signedIn({
      [`POST ${url}/ListCourses`]: json({
        subjects: [
          { id: "math", title: text("Mathematics", "数学"), mark: "M", hue: 250 },
          { id: "english", title: text("English", "英语"), mark: "E", hue: 20 },
        ],
        courses: [course("algebra", "Algebra", "math"), course("geometry", "Geometry", "math"), course("reading", "Reading", "english")],
      }),
      [`POST ${learningUrl}/GetDashboard`]: json({ courseId: "algebra", subjectId: "math", stats: {}, xp: {}, canDecide: true }),
      [`POST ${learningUrl}/ChooseCourse`]: json({}),
    }),
    platform: "macos",
  });
  await app.waitFor("text:Algebra");
  await app.press("label:Mathematics, switch subject");
  await app.waitFor("text:Not started");
  await app.press("label:English");
  await app.waitFor("text:Choose a course in English");
  expect(app.storage()["ga.subject"]).toBe("english");
  await app.press("label:English, switch subject");
  await app.press("label:Mathematics");
  await app.keyboard.press("mod+3");
  await app.press("text:Change course");
  await app.waitFor("text:Geometry");
  // Only the subject's courses are offered.
  expect(app.texts()).not.toContain("Reading");
  const asked: string[] = [];
  app.onDialog((dialog) => {
    asked.push(dialog.title ?? "");
    return "Cancel";
  });
  await app.press("role:button[Start this course]");
  expect(asked).toEqual(["Switch to Geometry?"]);
  expect(app.requests().some((r) => r.url.endsWith("/ChooseCourse"))).toBe(false);
});

test("starts a subject over from the Course tab, after asking", async () => {
  const app = await open("./App.tsx", {
    ...signedIn({
      [`POST ${learningUrl}/GetDashboard`]: json({
        courseId: "algebra",
        subjectId: "math",
        diagnosed: true,
        stats: {},
        xp: {},
        canDecide: true,
      }),
      [`POST ${learningUrl}/RetakeDiagnostic`]: json({}),
      [`POST ${learningUrl}/ResetKnowledge`]: json({}),
    }),
    platform: "macos",
  });
  await app.keyboard.press("mod+3");
  await app.waitFor("text:Start over");
  const answers = ["Cancel", "Retake the diagnostic", "Reset the knowledge profile"];
  const asked: string[] = [];
  app.onDialog((dialog) => {
    asked.push(dialog.title ?? "");
    return answers.shift() ?? "Cancel";
  });
  const sent = (rpc: string) => app.requests().filter((r) => r.url.endsWith(`/${rpc}`)).length;
  await app.press("text:Retake the diagnostic");
  expect(sent("RetakeDiagnostic")).toBe(0);
  await app.press("text:Retake the diagnostic");
  await app.waitUntil(() => sent("RetakeDiagnostic") === 1);
  await app.press("text:Reset the knowledge profile");
  await app.waitUntil(() => sent("ResetKnowledge") === 1);
  expect(asked).toEqual(["Retake the diagnostic?", "Retake the diagnostic?", "Reset the knowledge profile?"]);
});

test("turns a purpose on and, after asking, off on the privacy page", async () => {
  const granted: string[] = [];
  let on = false;
  const app = await open("./App.tsx", {
    storage: { "ga.session": "tok.sig" },
    platform: "macos",
    network: {
      ...settingsNetwork,
      [`POST ${privacyUrl}/ListConsents`]: () =>
        json({
          band: "BAND_TEEN",
          scopes: [
            { scope: "basic", inForce: true },
            { scope: "writing", inForce: on, canGrant: !on },
          ],
        }),
      [`POST ${privacyUrl}/GrantConsent`]: (request: { body?: string | null }) => {
        granted.push((JSON.parse(request.body ?? "{}") as { scope: string }).scope);
        on = true;
        return json({});
      },
      [`POST ${privacyUrl}/WithdrawConsent`]: () => {
        on = false;
        return json({});
      },
    },
  });
  await app.press("label:Settings");
  await app.scroll("text:Contrast", 600);
  await app.press("text:Privacy and your data");
  await app.waitFor("text:AI-judged writing");
  expect(app.texts()).toContain("Under 18");
  await app.press("text:Turn on");
  await app.waitUntil(() => granted.includes("writing"));
  const asked: string[] = [];
  app.onDialog((dialog) => {
    asked.push(dialog.title ?? "");
    return "Turn off";
  });
  await app.press("text:Turn off >> nth=1");
  expect(asked).toEqual(["Turn this off?"]);
  await app.waitFor("text:Turn on");
});

test("makes an invitation code while a guardian has to agree", async () => {
  const app = await open("./App.tsx", {
    storage: { "ga.session": "tok.sig" },
    network: {
      ...network,
      ...accessIs("ACCESS_STATUS_NEEDS_GUARDIAN"),
      [`POST ${accountUrl}/CreateGuardianInvite`]: json({ code: "ABCD1234", expiresAt: "1767225600000" }),
    },
  });
  await app.waitFor("text:A guardian needs to agree first");
  await app.press("text:Invite a guardian");
  await app.waitFor("text:ABCD1234");
});

test("follows a learner with a code and sets their daily limit", async () => {
  const limits: number[] = [];
  const app = await open("./App.tsx", {
    storage: { "ga.session": "tok.sig" },
    platform: "macos",
    network: {
      ...settingsNetwork,
      [`POST ${privacyUrl}/GetAccess`]: json({ status: "ACCESS_STATUS_OK", band: "BAND_ADULT" }),
      [`POST ${accountUrl}/ListGuardedLearners`]: json({ learners: [] }),
      [`POST ${accountUrl}/AcceptGuardianInvite`]: json({ learnerId: "kid1" }),
      [`POST ${accountUrl}/GetGuardedLearner`]: json({ learner: { learnerId: "kid1", name: "kid", xp: { today: 5 } }, enrollments: [] }),
      [`POST ${privacyUrl}/ListConsents`]: json({ band: "BAND_CHILD", managed: true, scopes: [{ scope: "basic", inForce: true }] }),
      [`POST ${privacyUrl}/SetTimeLimit`]: (request: { body?: string | null }) => {
        limits.push((JSON.parse(request.body ?? "{}") as { minutes: number }).minutes);
        return json({});
      },
    },
  });
  await app.press("label:Settings");
  await app.scroll("text:Contrast", 1500);
  await app.press("text:Learners you follow");
  await app.waitFor("text:You are not following anyone yet.");
  await app.type("label:Invitation code", "ABCD1234");
  await app.press("role:button[Follow]");
  await app.waitFor("text:Child account");
  await app.scroll("text:Child account", 600);
  await app.press("text:30");
  await app.waitFor("text:Saved.");
  expect(limits).toEqual([30]);
});
