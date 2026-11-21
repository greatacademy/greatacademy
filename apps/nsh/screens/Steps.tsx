import { type Mark, type Step, type StepGroup, type StepTarget, sameTarget } from "@ga/design";
import { Text, View } from "nsh";

import { m } from "../lib/i18n.ts";
import { colors } from "../lib/ui.tsx";

const tone = (mark: Mark): { color: string; opacity: number } => {
  switch (mark) {
    case "right":
      return { color: colors().good, opacity: 1 };
    case "wrong":
      return { color: colors().bad, opacity: 1 };
    case "done":
      return { color: colors().accent, opacity: 0.5 };
    case "current":
      return { color: colors().accent, opacity: 1 };
    default:
      return { color: colors().line, opacity: 1 };
  }
};

/** Labeled is a step with the name it is read out by. */
type Labeled = { step: Step; name: string };

function labeled(groups: readonly StepGroup[]): { knowledgePoint?: number; steps: Labeled[] }[] {
  let question = 0;
  return groups.map((g) => ({
    ...(g.knowledgePoint !== undefined && { knowledgePoint: g.knowledgePoint }),
    steps: g.steps.map((step) => {
      if (step.kind === "intro") return { step, name: m().stepIntro };
      if (step.kind === "example") return { step, name: m().workedExample };
      question += 1;
      return { step, name: m().stepQuestion(question) };
    }),
  }));
}

/** StepArrow moves one step back or on through the steps bar. */
export function StepArrow(props: { glyph: string; label: string; onPress?: () => void }) {
  return (
    <View
      role="button"
      accessibilityLabel={props.label}
      accessibilityState={{ disabled: !props.onPress }}
      onPress={() => props.onPress?.()}
      hoverStyle={{ backgroundColor: colors().line }}
      style={{
        alignItems: "center",
        borderRadius: 16,
        height: 32,
        justifyContent: "center",
        opacity: props.onPress ? 1 : 0.3,
        width: 32,
      }}
    >
      <Text style={{ color: colors().muted, fontSize: 22, fontWeight: "600" }}>{props.glyph}</Text>
    </View>
  );
}

/**
 * StepsBar is a session's steps as a row of segments, as on the web: a group per knowledge point in a lesson, each
 * step gone through opening to look back at, the step looked at ringed, and the arrows moving one step back or on.
 */
export function StepsBar(props: {
  groups: readonly StepGroup[];
  looking: StepTarget;
  onOpen: (target: StepTarget) => void;
  onPrevious?: () => void;
  onNext?: () => void;
}) {
  return (
    <View role="navigation" accessibilityLabel={m().stepsBar} style={{ alignItems: "center", flexDirection: "row", gap: 2 }}>
      <StepArrow glyph="‹" label={m().previousStep} onPress={props.onPrevious} />
      <View style={{ alignItems: "center", flex: 1, flexDirection: "row", gap: 8 }}>
        <Each of={labeled(props.groups)}>
          {(group) => (
            <View
              role="group"
              accessibilityLabel={
                group().knowledgePoint !== undefined ? m().step((group().knowledgePoint ?? 0) + 1, props.groups.length) : m().stepsBar
              }
              style={{ alignItems: "center", flexBasis: 0, flexDirection: "row", flexGrow: group().steps.length, gap: 3 }}
            >
              <Each of={group().steps}>
                {(entry) => {
                  const { step, name } = entry();
                  const open = step.target;
                  const ringed = !!open && sameTarget(open, props.looking);
                  const now = step.marks.includes("current");
                  return (
                    <View
                      role={open ? "button" : "none"}
                      accessibilityLabel={open ? name : `${name} · ${m().stepFuture}`}
                      accessibilityState={{ current: ringed ? "step" : false, disabled: !open }}
                      onPress={() => open && props.onOpen(open)}
                      style={{ flexBasis: 0, flexGrow: 1, height: 28, justifyContent: "center", minWidth: 6 }}
                    >
                      <View
                        style={{
                          borderColor: colors().ink,
                          borderRadius: 7,
                          borderWidth: ringed ? 2 : 0,
                          flexDirection: "row",
                          gap: 1,
                          height: ringed ? 14 : now ? 12 : 8,
                          opacity: step.kind === "question" ? 1 : 0.8,
                          overflow: "hidden",
                        }}
                      >
                        <Each of={[...step.marks]}>
                          {(mark) => <View style={{ backgroundColor: tone(mark()).color, flex: 1, opacity: tone(mark()).opacity }} />}
                        </Each>
                      </View>
                    </View>
                  );
                }}
              </Each>
            </View>
          )}
        </Each>
      </View>
      <StepArrow glyph="›" label={m().nextStep} onPress={props.onNext} />
    </View>
  );
}
