import type { Figure } from "@ga/proto/common/v1/figure_pb";
import type { PlotInput } from "@ga/proto/learning/v1/learning_pb";
import { computed, signal, untracked, View, WebView, type WebViewRef } from "nsh";

import { pageHtml, scriptValue } from "../lib/content.ts";
import { m } from "../lib/i18n.ts";
import { API_URL } from "../lib/rpc.ts";
import { colors, Muted } from "../lib/ui.tsx";

type Mark = readonly [number, number];

const write = (marks: readonly Mark[]) => marks.map(([x, y]) => `(${x}, ${y})`).join("; ");

function read(response: string): Mark[] {
  return [...response.matchAll(/\(\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\)/g)].map((match) => [Number(match[1]), Number(match[2])] as const);
}

// The page keeps the marks, so that marking a point does not load it again.
const script = (input: PlotInput, marks: readonly Mark[], answer: readonly Mark[], disabled: boolean) => `
var g=${scriptValue({ xMin: input.xMin, xMax: input.xMax, yMin: input.yMin, yMax: input.yMax, step: input.step, left: input.left, top: input.top, scale: input.scale, points: input.points })};
var marks=${scriptValue(marks)},answer=${scriptValue(answer)},disabled=${disabled};
var svg=document.querySelector("svg"),layer=document.createElementNS("http://www.w3.org/2000/svg","g");svg.appendChild(layer);
function dot(p,tone){var c=document.createElementNS("http://www.w3.org/2000/svg","circle");
  c.setAttribute("cx",g.left+(p[0]-g.xMin)*g.scale);c.setAttribute("cy",g.top+(g.yMax-p[1])*g.scale);c.setAttribute("r",4.5);
  c.setAttribute("stroke","none");c.setAttribute("fill","currentColor");c.setAttribute("class",tone);layer.appendChild(c)}
function draw(){layer.textContent="";answer.forEach(function(p){dot(p,"result")});marks.forEach(function(p){dot(p,"accent")})}
function along(v,min,max){return Math.min(max,Math.max(min,Number((min+Math.round((v-min)/g.step)*g.step).toFixed(6))))}
function clearMarks(){marks=[];draw();post({marks:marks})}
svg.addEventListener("click",function(e){if(disabled)return;
  var at=new DOMPoint(e.clientX,e.clientY).matrixTransform(svg.getScreenCTM().inverse());
  var p=[along(g.xMin+(at.x-g.left)/g.scale,g.xMin,g.xMax),along(g.yMax-(at.y-g.top)/g.scale,g.yMin,g.yMax)];
  var kept=marks.filter(function(q){return q[0]!==p[0]||q[1]!==p[1]});
  marks=kept.length<marks.length?kept:(marks.length===g.points?marks.slice(0,-1):marks).concat([p]);
  draw();post({marks:marks})});
draw();`;

/** PlotField asks for points marked on a figure. The response is complete once all are marked. */
export function PlotField(props: {
  input: PlotInput;
  figure: Figure;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  /** answer is the correct response, drawn after a wrong one. */
  answer?: string;
}) {
  let view: WebViewRef | undefined;
  const height = signal(240);
  const marks = signal<readonly Mark[]>(read(props.value));
  const html = computed(() =>
    pageHtml(`<div class="figure-ga">${props.figure.svg}</div>`, colors(), {
      script: script(props.input, untracked(marks), read(props.answer ?? ""), props.disabled),
    }),
  );
  return (
    <View style={{ gap: 8 }}>
      <WebView
        ref={(node) => {
          view = node;
        }}
        html={html()}
        baseUrl={`${API_URL}/`}
        scrollable={false}
        style={{ backgroundColor: "transparent", height: height() }}
        onMessage={({ data }) => {
          const message = JSON.parse(data) as { height?: number; marks?: Mark[] };
          if (message.height) height.set(message.height);
          if (message.marks) {
            marks.set(message.marks);
            props.onChange(message.marks.length === props.input.points ? write(message.marks) : "");
          }
        }}
      />
      <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
        <Muted>
          {m().plotMarked}: {marks().length} / {props.input.points}
        </Muted>
        <If when={!props.disabled && marks().length > 0}>
          <View role="button" onPress={() => view?.injectJavaScript("clearMarks()")}>
            <Muted>{m().plotClear}</Muted>
          </View>
        </If>
      </View>
      <If when={!props.disabled}>
        <Muted>{m().plotHint}</Muted>
      </If>
    </View>
  );
}
