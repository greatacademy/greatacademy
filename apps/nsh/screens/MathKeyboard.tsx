import { computed, safeAreaInsets, signal, View, WebView, type WebViewRef } from "nsh";

import { pageHtml } from "../lib/content.ts";
import { SITE_URL } from "../lib/rpc.ts";
import { colors } from "../lib/ui.tsx";

// MathLive's keyboard and its fields talk in messages of this type, as they do across frames on the web.
const MESSAGE = "mathlive#virtual-keyboard-message";

/**
 * KEYBOARD_STAND_IN goes in a math field's page before MathLive loads. MathLive then takes it for the page's keyboard,
 * as a field in a frame takes the keyboard of the page around it, and the field's requests (show, hide, settings) go to
 * the app, which passes them to the keyboard at the bottom of the screen (MathKeyboard); what the keyboard answers comes
 * back as messages from the app. A key's command goes straight to the field, since MathLive's field hears its keyboard
 * only while it has focus, which a tap on the keyboard's web view takes away. Nothing here moves the focus itself: a
 * script's focus or blur in one web view while another has just been clicked mixes up the next click's press and
 * release on macOS. So the field's policy is manual (MathLive would blur and refocus it as the keyboard toggles), its
 * toggle acts on a whole click, and on a touch screen focusing the field shows the keyboard, as the auto policy does.
 */
export const KEYBOARD_STAND_IN = `<script>(function(){
var rect={x:0,y:0,width:0,height:0,top:0,right:0,bottom:0,left:0},shifted=false,listeners={};
function send(action,data){if(window.nsh)window.nsh.postMessage(JSON.stringify({kb:Object.assign({type:"${MESSAGE}",action:action},data||{})}))}
function emit(e){var set=listeners[e.type];if(set)set.forEach(function(l){typeof l==="function"?l(e):l.handleEvent(e)});return !e.defaultPrevented}
function toggle(on,options){if(emit(new CustomEvent("before-virtual-keyboard-toggle",{detail:{visible:on},bubbles:true,cancelable:true,composed:true}))){send(on?"show":"hide",options);emit(new Event("virtual-keyboard-toggle"))}}
var keyboard={
getKeycap:function(){},setKeycap:function(keycap,value){send("update-setting",{setKeycap:{keycap:keycap,value:value}})},
set alphabeticLayout(v){send("update-setting",{alphabeticLayout:v})},set layouts(v){send("update-setting",{layouts:v})},
get normalizedLayouts(){return[]},set editToolbar(v){send("update-setting",{editToolbar:v})},set container(v){},
show:function(o){toggle(true,o)},hide:function(o){toggle(false,o)},get visible(){return rect.height>0},set visible(on){toggle(on)},
get isShifted(){return shifted},get boundingRect(){return rect},
executeCommand:function(command){send("execute-command",{command:command});return true},
updateToolbar:function(state){send("update-toolbar",state)},update:function(state){send("update-setting",state)},
connect:function(){send("connect")},disconnect:function(){send("disconnect")},
addEventListener:function(type,l){(listeners[type]=listeners[type]||new Set).add(l)},
removeEventListener:function(type,l){if(listeners[type])listeners[type].delete(l)},dispatchEvent:emit};
Object.defineProperty(window,"mathVirtualKeyboard",{get:function(){return keyboard},configurable:true});
function onToggle(e){var t=e.composedPath()[0];return !!(t&&t.closest&&t.closest("[part~=virtual-keyboard-toggle]"))}
["pointerdown","pointerup","mousedown","mouseup","touchstart","touchend"].forEach(function(t){addEventListener(t,function(e){if(onToggle(e))e.stopPropagation()},true)});
addEventListener("click",function(e){if(!onToggle(e))return;e.stopPropagation();e.preventDefault();keyboard.visible?keyboard.hide():keyboard.show({animate:true})},true);
addEventListener("focusin",function(e){if(e.target&&e.target.tagName==="MATH-FIELD"&&!keyboard.visible&&matchMedia("(pointer: coarse)").matches)keyboard.show({animate:true})});
addEventListener("message",function(e){
if(typeof e.data!=="string")return;var d;try{d=JSON.parse(e.data)}catch(_){return}
if(!d||d.type!=="${MESSAGE}")return;
if(d.action==="synchronize-proxy"||d.action==="geometry-changed"){rect=d.boundingRect||rect;shifted=!!d.isShifted;if(d.action==="geometry-changed")emit(new Event("geometrychange"));return}
var f=document.querySelector("math-field");if(!f)return;
if(d.action==="execute-command"){
if(Array.isArray(d.command))d.command.forEach(function(o){if(o&&typeof o==="object"&&"focus" in o)o.focus=false});
f.executeCommand(d.command)}
});
})();</script>`;

// The keyboard's page: MathLive's keyboard on its own, speaking to the field through the app. It slides down as it
// hides, as on the web (apps/web/src/lib/keyboard.ts).
const keyboardScript = `
if(typeof MathfieldElement==="undefined"){post({failed:true})}else{
MathfieldElement.fontsDirectory=null;MathfieldElement.soundsDirectory=null;
var k=window.mathVirtualKeyboard,field={postMessage:function(d){post({kb:d})}};
k.targetOrigin="*";k.container=document.body;k.connectedMathfieldWindow=field;
var hide=k.hide.bind(k),show=k.show.bind(k);
function sliding(){return !!(k._element&&k._element.classList.contains("ga-hiding"))}
Object.defineProperty(k,"visible",{configurable:true,get:function(){return !!k._visible&&!sliding()},set:function(on){on?k.show():k.hide()}});
k.hide=function(o){var el=k._element;if(!el||!k._visible)return hide(o);if(sliding())return;el.classList.add("ga-hiding");
var timer=0;function done(){clearTimeout(timer);el.removeEventListener("transitionend",ended);if(el.classList.contains("ga-hiding")){el.classList.remove("ga-hiding");hide(o)}}
function ended(e){if(e.target.classList.contains("MLK__backdrop")&&e.propertyName==="transform")done()}
el.addEventListener("transitionend",ended);timer=setTimeout(done,400)};
k.show=function(o){if(sliding())k._element.classList.remove("ga-hiding");else show(o)};
addEventListener("message",function(e){
if(typeof e.data!=="string")return;var d;try{d=JSON.parse(e.data)}catch(_){return}
if(!d||d.type!=="${MESSAGE}"||d.action==="disconnect")return;
k.connectedMathfieldWindow=field;k.handleMessage(d,d.action==="execute-command"?window:field);
});
k.addEventListener("geometrychange",function(){post({keypad:k.boundingRect.height})});
k.addEventListener("virtual-keyboard-toggle",function(){post({open:k.visible})});
}`;

// The web view of the keyboard, the field that last used it, and what a field is told when the keyboard moves.
let keyboardView: WebViewRef | undefined;
let fieldView: WebViewRef | undefined;
let onMove: ((height: number) => void) | undefined;
const open = signal(false);
const height = signal(0);
// The keyboard's web view keeps its last height while it slides away, so that the slide stays in sight.
const tall = signal(300);

/** mathKeyboardHeight is how much of the bottom of the screen the math keyboard covers, 0 while it is hidden. */
export const mathKeyboardHeight = computed(() => (open() ? height() : 0));

/**
 * connectMathKeyboard connects a math field to the keyboard; `moved` hears the keyboard's height while the field has it.
 * The field gives `attach` its web view and `relay` what its page sends for the keyboard, and calls `release` as it goes,
 * which hides the keyboard if the field still has it.
 */
export function connectMathKeyboard(moved?: (height: number) => void) {
  let view: WebViewRef | undefined;
  return {
    attach(ref: WebViewRef) {
      view = ref;
    },
    relay(message: unknown) {
      fieldView = view;
      onMove = moved;
      keyboardView?.postMessage(JSON.stringify(message));
    },
    release() {
      if (fieldView !== view) return;
      keyboardView?.postMessage(JSON.stringify({ type: MESSAGE, action: "hide" }));
      fieldView = undefined;
      onMove = undefined;
    },
  };
}

/**
 * MathKeyboard is MathLive's keyboard docked at the bottom of the screen, over what is there, as on the web: math
 * fields (MathField) open and close it, and its keys type into the field that opened it. It sits in its own web view,
 * so that it stays put while the page scrolls.
 */
export function MathKeyboard() {
  const insets = safeAreaInsets();
  const html = computed(() =>
    pageHtml("", colors(), {
      head: `<style>.ML__keyboard{--keyboard-padding-bottom:${insets().bottom}px}</style><script src="${SITE_URL}/embed/mathlive.min.js"></script>`,
      script: keyboardScript,
    }),
  );
  return (
    <View
      style={{
        bottom: 0,
        height: tall(),
        left: 0,
        pointerEvents: open() ? "auto" : "none",
        position: "absolute",
        right: 0,
      }}
    >
      <WebView
        ref={(ref) => {
          keyboardView = ref;
        }}
        html={html()}
        baseUrl={`${SITE_URL}/`}
        scrollable={false}
        style={{ backgroundColor: "transparent", flex: 1 }}
        onMessage={({ data }) => {
          const message = JSON.parse(data) as { kb?: unknown; keypad?: number; open?: boolean };
          if (message.kb) fieldView?.postMessage(JSON.stringify(message.kb));
          if (message.open !== undefined) open.set(message.open);
          if (message.keypad !== undefined) {
            if (message.keypad > 0) tall.set(message.keypad);
            height.set(message.keypad);
            onMove?.(message.keypad);
          }
        }}
      />
    </View>
  );
}
