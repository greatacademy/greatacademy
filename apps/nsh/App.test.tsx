import { expect, open, test } from "nsh/test";

const url = "http://localhost:5173/api/rpc/ga.catalog.v1.CatalogService";
const json = (body: unknown) => ({ status: 200, headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
const text = (en: string, zh: string) => ({ values: { en, "zh-CN": zh } });

const network = {
  [`POST ${url}/ListCourses`]: json({
    courses: [
      {
        id: "algebra",
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
  await app.waitFor("text:2 topics");
  await app.press("text:Solve equations");
  await app.waitFor("text:· Linear equations");
  expect(app.texts()).toContain("Unit one");
});

test("follows a Chinese device", async () => {
  const app = await open("./App.tsx", { network, locale: "zh-Hans-CN" });
  await app.waitFor("text:2 个知识点");
  expect(app.texts()).toContain("代数");
});

test("offers a retry when the call fails", async () => {
  const app = await open("./App.tsx", { network: { [`POST ${url}/ListCourses`]: { status: 503, body: "{}" } } });
  await app.waitFor("text:The server could not answer just now. Try again in a moment.");
  await app.waitFor("text:Retry");
});

test("says when there is no connection, and loads once it is back", async () => {
  let down = true;
  const app = await open("./App.tsx", {
    network: { ...network, [`POST ${url}/ListCourses`]: () => (down ? { error: "offline" } : network[`POST ${url}/ListCourses`]) },
  });
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
  await app.press("label:Month of birth");
  await app.press("text:March");
  await app.type("label:Year of birth", year);
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
  await app.waitFor("text:2 topics");
  await app.press("text:Sign in >> nth=0");
  await app.type("label:Email or username", "a@example.test");
  await app.type("label:Password", "correct horse");
  await app.press("role:button[Sign in]");
  await app.waitFor("text:Account");
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
  await app.waitFor("text:2 topics");
  await app.press("text:Sign in >> nth=0");
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
  await app.waitFor("text:2 topics");
});

test("explains a market that is closed and can sign out", async () => {
  const app = await open("./App.tsx", {
    storage: { "ga.session": "tok.sig" },
    network: { ...network, ...accessIs("ACCESS_STATUS_MARKET_CLOSED"), [`POST ${authUrl}/sign-out`]: json({ success: true }) },
  });
  await app.waitFor("text:Not available yet");
  await app.press("text:Sign out");
  await app.waitFor("text:2 topics");
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
  await app.waitFor("text:Sign in");
  await app.waitUntil(() => app.storage()["ga.session"] === undefined);
});

test("stops a child at sign-up, keeps no answer, and stays stopped", async () => {
  const child = { ...network, ...countries, [`POST ${privacyUrl}/CheckAge`]: json({ band: "BAND_CHILD" }) };
  const app = await open("./App.tsx", { network: child });
  await app.waitFor("text:2 topics");
  await app.press("text:Sign in >> nth=0");
  await app.press("text:Create account");
  await answerAge(app, "2018");
  await app.waitFor("text:Please ask an adult");
  expect(Object.keys(app.storage())).toEqual(["ga.sign-up-stopped"]);
  const again = await open("./App.tsx", { network: child, storage: app.storage() });
  await again.waitFor("text:2 topics");
  await again.press("text:Sign in >> nth=0");
  await again.press("text:Create account");
  await again.waitFor("text:Please ask an adult");
});

test("asks a teen for no real name", async () => {
  const app = await open("./App.tsx", {
    network: { ...network, ...countries, [`POST ${privacyUrl}/CheckAge`]: json({ band: "BAND_TEEN" }) },
  });
  await app.waitFor("text:2 topics");
  await app.press("text:Sign in >> nth=0");
  await app.press("text:Create account");
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
  await app.waitFor("text:2 topics");
  await app.press("text:Sign in >> nth=0");
  await app.press("text:Create account");
  await answerAge(app, "1990");
  await app.waitFor("label:Name");
  await app.type("label:Name", "Test");
  await app.type("label:Email", "a@example.test");
  await app.type("label:Password", "correct horse");
  await app.press("role:button[Create account]");
  await app.waitFor("text:Account >> nth=0");
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
      [`POST ${learningUrl}/GetProfile`]: json({ enrollments: [{ courseId: "algebra", stats: { learned: 1, total: 2 } }], xp: {} }),
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
  await app.waitFor("text:My courses");
  await app.press("text:1 / 2 topics");
  await app.waitFor("text:Next up");
  await app.press("role:button[Start]");
  await app.waitFor("text:Even numbers split in two.");
  await app.press("text:Show solution");
  await app.waitFor("text:Four splits in two.");
  await app.press("text:Start practicing");
  await app.press("text:Four");
  await app.keyboard.press("Enter");
  await app.waitFor("text:Correct!");
  // Leaving asks first; staying keeps the answer where it was.
  const asked: string[] = [];
  app.onDialog((dialog) => {
    asked.push(dialog.title ?? "");
    return "Keep going";
  });
  await app.press("label:Close");
  expect(asked).toEqual(["Leave this task?"]);
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
      [`POST ${learningUrl}/SubmitAnswer`]: (request: { body: string }) => {
        const body = JSON.parse(request.body) as { index?: number };
        answers.push(body);
        return (body.index ?? 0) === 0
          ? json({ session: { ...session, answered: 1, question: question(1) } })
          : json({ session: { ...session, answered: 2, result: { placed: 1, asked: 2 } } });
      },
    }),
  );
  await app.press("text:1 / 2 topics");
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
