import { layoutRoadmap, prerequisitesOf, ROADMAP_SIZE } from "@ga/design";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useSession } from "../lib/auth.ts";
import { useI18n } from "../lib/i18n.tsx";
import { catalog, learning, timeZone } from "../lib/rpc.ts";

/**
 * CourseRoadmap draws a subject's courses as a map, the first ones at the bottom and each course above the courses it
 * builds on (docs/experience.md §4). Each box opens the course's page; pointing at one lights the way up to it, and
 * the learner's current courses are filled in.
 */
export function CourseRoadmap({ subject }: { subject: string }) {
  const { m, tx } = useI18n();
  const { data: session } = useSession();
  const courses = useQuery({ queryKey: ["courses"], queryFn: () => catalog.listCourses({}) });
  const profile = useQuery({
    queryKey: ["profile"],
    queryFn: () => learning.getProfile({ timeZone: timeZone() }),
    enabled: !!session,
  });
  const [lit, setLit] = useState<string>();

  const list = useMemo(() => (courses.data?.courses ?? []).filter((c) => c.subjectId === subject && !c.retired), [courses.data, subject]);
  const map = useMemo(() => layoutRoadmap(list), [list]);
  const path = useMemo(() => (lit ? prerequisitesOf(list, lit) : undefined), [list, lit]);
  if (list.length < 2) return null;

  const mine = new Set(profile.data?.enrollments.map((e) => e.courseId));
  const byId = new Map(list.map((c) => [c.id, c]));
  const { boxWidth, boxHeight } = ROADMAP_SIZE;

  return (
    <section className="space-y-3" aria-labelledby="roadmap-title">
      <div className="space-y-1">
        <h2 id="roadmap-title" className="text-lg font-semibold">
          {m.roadmap}
        </h2>
        <p className="text-sm text-muted">{m.roadmapIntro}</p>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-line bg-surface px-4 py-6 [scrollbar-width:thin]">
        <div className="relative mx-auto" style={{ width: map.width, height: map.height }}>
          <svg width={map.width} height={map.height} className="absolute inset-0 overflow-visible" aria-hidden="true">
            {map.edges.map((e) => {
              const on = !!path && path.has(e.from) && path.has(e.to);
              return (
                <path
                  key={`${e.from}>${e.to}`}
                  d={e.path}
                  fill="none"
                  strokeWidth={on ? 2 : 1.25}
                  className={`transition-[stroke,opacity] ${on ? "stroke-subject" : "stroke-muted"} ${path && !on ? "opacity-15" : "opacity-45"}`}
                />
              );
            })}
          </svg>
          {map.boxes.map((b) => {
            const c = byId.get(b.id);
            if (!c) return null;
            const yours = mine.has(b.id);
            const dim = !!path && !path.has(b.id);
            return (
              <Link
                key={b.id}
                to="/courses/$courseId"
                params={{ courseId: b.id }}
                title={yours ? `${tx(c.title)} · ${m.roadmapYours}` : tx(c.title)}
                onMouseEnter={() => setLit(b.id)}
                onMouseLeave={() => setLit(undefined)}
                onFocus={() => setLit(b.id)}
                onBlur={() => setLit(undefined)}
                style={{ left: b.x, top: b.y, width: boxWidth, height: boxHeight }}
                className={`absolute flex items-center justify-center rounded-xl border px-2 text-center text-xs leading-tight font-medium transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-subject ${
                  yours
                    ? "border-subject bg-subject text-on-subject"
                    : "border-subject/25 bg-subject-soft text-on-subject-soft hover:border-subject"
                } ${dim ? "opacity-40" : ""}`}
              >
                <span className="line-clamp-2">{tx(c.title)}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
