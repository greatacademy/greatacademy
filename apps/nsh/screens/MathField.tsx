import { computed, signal, untracked, View, WebView } from "nsh";
import { Input } from "nsh/base";

import { pageHtml, scriptValue } from "../lib/content.ts";
import { m } from "../lib/i18n.ts";
import { API_URL } from "../lib/rpc.ts";
import { colors, fieldStyle, Muted } from "../lib/ui.tsx";

// MathLive's own fonts and sounds are off: KaTeX's stylesheet already provides the fonts.
const script = (value: string, disabled: boolean) => `
MathfieldElement.fontsDirectory=null;MathfieldElement.soundsDirectory=null;
var f=document.getElementById("f");
f.value=${scriptValue(value)};f.disabled=${disabled};
customElements.whenDefined("math-field").then(function(){
  f.menuItems=[];
  f.inlineShortcuts=Object.assign({},f.inlineShortcuts,{">=":"\\\\ge","<=":"\\\\le"});
});
f.addEventListener("input",function(){post({value:f.value})});
f.addEventListener("keydown",function(e){if(e.key==="Enter"){e.preventDefault();post({submit:true})}},{capture:true});
window.mathVirtualKeyboard.addEventListener("geometrychange",function(){
  post({keyboard:window.mathVirtualKeyboard.boundingRect.height});
});`;

/**
 * MathField asks for math as LaTeX through MathLive, in a web view that grows to
 * hold MathLive's keyboard. A learner can also type plain text, such as 3/4.
 */
export function MathField(props: { value: string; onChange: (latex: string) => void; onSubmit: () => void; disabled: boolean }) {
  const asText = signal(false);
  const field = signal(60);
  const keyboard = signal(0);
  // The page keeps what is typed; it is written back only when the page is built again.
  const html = computed(() => {
    const disabled = props.disabled;
    const palette = colors();
    return pageHtml(
      `<math-field id="f" aria-label="${m().yourAnswer}" math-virtual-keyboard-policy="auto" smart-fence="on" style="display:block;box-sizing:border-box;width:100%;min-height:48px;padding:8px 12px;font-size:20px;border:1px solid ${palette.ink}33;border-radius:8px;background:transparent;color:inherit"></math-field>`,
      palette,
      {
        head: `<script src="${API_URL}/embed/mathlive.min.js"></script>`,
        script: script(
          untracked(() => props.value),
          disabled,
        ),
      },
    );
  });
  return (
    <View style={{ gap: 6 }}>
      <If
        when={asText()}
        else={
          <WebView
            html={html()}
            baseUrl={`${API_URL}/`}
            scrollable={false}
            style={{ backgroundColor: "transparent", height: field() + keyboard() }}
            onError={() => asText.set(true)}
            onMessage={({ data }) => {
              const message = JSON.parse(data) as { height?: number; value?: string; submit?: boolean; keyboard?: number };
              if (message.height) field.set(message.height);
              if (message.value !== undefined) props.onChange(message.value);
              if (message.submit) props.onSubmit();
              if (message.keyboard !== undefined) keyboard.set(message.keyboard);
            }}
          />
        }
      >
        <Input
          accessibilityLabel={m().yourAnswer}
          value={props.value}
          disabled={props.disabled}
          autoCapitalize="none"
          autoCorrect={false}
          onChange={({ value }) => props.onChange(value)}
          style={fieldStyle()}
        />
      </If>
      <If when={!props.disabled}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 8 }}>
          <Muted>{m().mathHint}</Muted>
          <View role="button" onPress={() => asText.set(!asText())}>
            <Muted>{asText() ? m().mathAsField : m().mathAsText}</Muted>
          </View>
        </View>
      </If>
    </View>
  );
}
