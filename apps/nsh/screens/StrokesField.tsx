import type { StrokesInput } from "@ga/proto/learning/v1/learning_pb";
import { computed, signal, untracked, View, WebView, type WebViewRef } from "nsh";

import { pageHtml, scriptValue } from "../lib/content.ts";
import { m } from "../lib/i18n.ts";
import { SITE_URL } from "../lib/rpc.ts";
import { colors, Muted } from "../lib/ui.tsx";

type Point = readonly [number, number];
type Stroke = readonly Point[];

/** writeStrokes is the response for strokes: points as "x,y" joined by spaces, strokes joined by ";". */
const writeStrokes = (strokes: readonly Stroke[]) => strokes.map((s) => s.map(([x, y]) => `${x},${y}`).join(" ")).join(";");

/** readStrokes gives the strokes of a response. */
function readStrokes(response: string): Stroke[] {
  return response
    .split(";")
    .map((s) =>
      s
        .trim()
        .split(/\s+/)
        .map((p) => p.split(",").map(Number) as unknown as Point)
        .filter((p) => p.length === 2 && p.every(Number.isFinite)),
    )
    .filter((s) => s.length > 0);
}

const BOX = 1024;

/** pad is the page's square: a 田 grid, the character to trace if any, and the strokes. */
const pad = (trace: string, muted: string) =>
  `<svg id="pad" viewBox="0 0 ${BOX} ${BOX}" style="display:block;width:100%;max-width:20rem;margin:0 auto;aspect-ratio:1;touch-action:none;border:2px solid ${muted};border-radius:12px">` +
  `<g stroke="${muted}" stroke-width="4" stroke-dasharray="16 16" opacity=".5"><line x1="0" y1="512" x2="1024" y2="512"/><line x1="512" y1="0" x2="512" y2="1024"/></g>` +
  (trace
    ? `<text x="512" y="512" text-anchor="middle" dominant-baseline="central" font-size="880" fill="${muted}" opacity=".35" style="font-family:KaiTi,STKaiti,'Kaiti SC',serif">${trace.replace(/[<&>]/g, "")}</text>`
    : "") +
  `<g id="answer" fill="none" stroke-width="40" stroke-linecap="round" stroke-linejoin="round" class="result" stroke="currentColor" opacity=".55"></g>` +
  `<g id="ink" fill="none" stroke="currentColor" stroke-width="44" stroke-linecap="round" stroke-linejoin="round"></g></svg>`;

// The page keeps the strokes, so that drawing one does not load it again.
const script = (input: StrokesInput, strokes: readonly Stroke[], answer: readonly Stroke[], disabled: boolean) => `
var most=${input.strokes},strokes=${scriptValue(strokes)},answer=${scriptValue(answer)},disabled=${disabled},now=null;
var svg=document.getElementById("pad"),ink=document.getElementById("ink"),shown=document.getElementById("answer");
function d(s){return s.length===1?"M"+s[0][0]+" "+s[0][1]+"h0.1":"M"+s.map(function(p){return p[0]+" "+p[1]}).join("L")}
function path(layer,s){var e=document.createElementNS("http://www.w3.org/2000/svg","path");e.setAttribute("d",d(s));layer.appendChild(e);return e}
function draw(){ink.textContent="";shown.textContent="";answer.forEach(function(s){path(shown,s)});strokes.forEach(function(s){path(ink,s)})}
function at(e){var p=new DOMPoint(e.clientX,e.clientY).matrixTransform(svg.getScreenCTM().inverse());
  return [Math.round(Math.min(${BOX},Math.max(0,p.x))),Math.round(Math.min(${BOX},Math.max(0,p.y)))]}
function thin(s){if(s.length<=48)return s;var out=[];for(var i=0;i<48;i++)out.push(s[Math.round(i*(s.length-1)/47)]);return out}
function undoStroke(){strokes=strokes.slice(0,-1);draw();post({strokes:strokes})}
function clearStrokes(){strokes=[];draw();post({strokes:strokes})}
svg.addEventListener("pointerdown",function(e){if(disabled||strokes.length>=most)return;svg.setPointerCapture(e.pointerId);
  now={points:[at(e)]};now.el=path(ink,now.points);e.preventDefault()});
svg.addEventListener("pointermove",function(e){if(!now)return;var p=at(e),q=now.points[now.points.length-1];
  if(Math.hypot(p[0]-q[0],p[1]-q[1])>=6){now.points.push(p);now.el.setAttribute("d",d(now.points))}});
function end(){if(!now)return;strokes=strokes.concat([thin(now.points)]);now=null;draw();post({strokes:strokes})}
svg.addEventListener("pointerup",end);svg.addEventListener("pointercancel",end);
draw();`;

/** StrokesField asks for a character written by hand on a square pad. The response is complete once all its strokes are drawn. */
export function StrokesField(props: {
  input: StrokesInput;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  /** answer is the correct response, drawn under the learner's after a wrong one. */
  answer?: string;
}) {
  let view: WebViewRef | undefined;
  const height = signal(340);
  const strokes = signal<readonly Stroke[]>(readStrokes(props.value));
  const html = computed(() =>
    pageHtml(`<div class="figure-ga">${pad(props.input.trace, colors().muted)}</div>`, colors(), {
      script: script(props.input, untracked(strokes), readStrokes(props.answer ?? ""), props.disabled),
    }),
  );
  return (
    <View style={{ gap: 8 }}>
      <WebView
        ref={(node) => {
          view = node;
        }}
        html={html()}
        baseUrl={`${SITE_URL}/`}
        scrollable={false}
        accessibilityLabel={m().strokesPad}
        style={{ backgroundColor: "transparent", height: height() }}
        onMessage={({ data }) => {
          const message = JSON.parse(data) as { height?: number; strokes?: Stroke[] };
          if (message.height) height.set(message.height);
          if (message.strokes) {
            strokes.set(message.strokes);
            props.onChange(message.strokes.length === props.input.strokes ? writeStrokes(message.strokes) : "");
          }
        }}
      />
      <View style={{ alignItems: "center", flexDirection: "row", gap: 16 }}>
        <Muted>
          {m().strokesDrawn}: {strokes().length} / {props.input.strokes}
        </Muted>
        <View style={{ flex: 1 }} />
        <If when={!props.disabled && strokes().length > 0}>
          <View role="button" onPress={() => view?.injectJavaScript("undoStroke()")}>
            <Muted>{m().strokesUndo}</Muted>
          </View>
          <View role="button" onPress={() => view?.injectJavaScript("clearStrokes()")}>
            <Muted>{m().plotClear}</Muted>
          </View>
        </If>
      </View>
      <If when={!props.disabled}>
        <Muted>{m().strokesHint}</Muted>
      </If>
    </View>
  );
}
