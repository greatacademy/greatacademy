import { layoutRoadmap, prerequisitesOf, ROADMAP_SIZE } from "@ga/design";
import type { Course, Subject } from "@ga/proto/catalog/v1/catalog_pb";
import { Canvas, computed, Path2D, platform, Scroll, signal, Text, View } from "nsh";
import { m, tx } from "../lib/i18n.ts";
import { tint } from "../lib/subject.tsx";
import { colors } from "../lib/ui.tsx";

/** CanvasRenderingContext is the context a canvas draws with. */
type CanvasRenderingContext = Parameters<Parameters<typeof Canvas>[0]["draw"]>[0];

/**
 * CourseRoadmap is a subject's courses as a graph, as on the web (docs/experience.md §4): the first courses at the
 * bottom, a line from each course to those it builds on, the learner's courses filled. Hovering a course, or tapping it
 * on a phone, lights the way to it; pressing it, or tapping it again, opens it. A subject of one course has none.
 */
export function CourseRoadmap(props: {
  courses: readonly Course[];
  subject: Subject | undefined;
  mine: ReadonlySet<string>;
  open: (courseId: string) => void;
}) {
  const list = () => props.courses;
  const map = computed(() => layoutRoadmap(list()));
  const paths = computed(() => map().edges.map((e) => ({ from: e.from, to: e.to, path: new Path2D(e.path) })));
  const lit = signal<string | undefined>(undefined);
  const path = computed(() => {
    const id = lit();
    return id ? prerequisitesOf(list(), id) : undefined;
  });
  const shade = () => tint(props.subject);
  const draw = (cx: CanvasRenderingContext) => {
    const lighted = path();
    for (const e of paths()) {
      const on = !!lighted && lighted.has(e.from) && lighted.has(e.to);
      cx.strokeStyle = on ? shade().strong : colors().muted;
      cx.globalAlpha = on ? 1 : lighted ? 0.15 : 0.45;
      cx.lineWidth = on ? 2 : 1.25;
      cx.stroke(e.path);
    }
  };
  const press = (id: string) => {
    if (platform.desktop || lit() === id) props.open(id);
    else lit.set(id);
  };
  return (
    <If when={list().length > 1}>
      <View style={{ gap: 8, marginTop: 24 }}>
        <Text style={{ color: colors().ink, fontSize: 18, fontWeight: "600" }}>{m().roadmap}</Text>
        <Text style={{ color: colors().muted, fontSize: 15, lineHeight: 22 }}>{m().roadmapIntro}</Text>
        <View
          style={{
            backgroundColor: colors().surface,
            borderColor: colors().line,
            borderRadius: 16,
            borderWidth: 1,
            marginTop: 4,
            overflow: "hidden",
          }}
        >
          <Scroll horizontal scrollbar={false}>
            <View style={{ flexGrow: 1, alignItems: "center", paddingHorizontal: 16, paddingVertical: 24 }}>
              <View onPress={() => lit.set(undefined)} style={{ height: map().height, width: map().width }}>
                <Canvas
                  draw={draw}
                  style={{ height: map().height, left: 0, pointerEvents: "none", position: "absolute", top: 0, width: map().width }}
                />
                <Each of={map().boxes} key={(b) => b.id}>
                  {(b) => {
                    const course = () => props.courses.find((c) => c.id === b().id);
                    const yours = () => props.mine.has(b().id);
                    const title = () => tx(course()?.title);
                    const dim = () => !!path() && !path()?.has(b().id);
                    return (
                      <View
                        role="button"
                        accessibilityLabel={yours() ? `${title()} · ${m().roadmapYours}` : title()}
                        tooltip={yours() ? `${title()} · ${m().roadmapYours}` : title()}
                        onPress={() => press(b().id)}
                        onMouseEnter={() => lit.set(b().id)}
                        onMouseLeave={() => lit.set(undefined)}
                        style={{
                          alignItems: "center",
                          backgroundColor: yours() ? shade().strong : shade().soft,
                          borderColor: yours() ? shade().strong : colors().line,
                          borderRadius: 12,
                          borderWidth: 1,
                          height: ROADMAP_SIZE.boxHeight,
                          justifyContent: "center",
                          left: b().x,
                          opacity: dim() ? 0.4 : 1,
                          paddingHorizontal: 8,
                          position: "absolute",
                          top: b().y,
                          width: ROADMAP_SIZE.boxWidth,
                        }}
                      >
                        <Text
                          style={{
                            color: yours() ? shade().onStrong : shade().onSoft,
                            fontSize: 12,
                            fontWeight: "500",
                            numberOfLines: 2,
                            textAlign: "center",
                          }}
                        >
                          {title()}
                        </Text>
                      </View>
                    );
                  }}
                </Each>
              </View>
            </View>
          </Scroll>
        </View>
      </View>
    </If>
  );
}
