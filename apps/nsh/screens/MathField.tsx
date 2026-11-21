import { cleanup, computed, effect, signal, untracked, View, WebView } from "nsh";
import { Input } from "nsh/base";

import { pageHtml, scriptValue } from "../lib/content.ts";
import { m } from "../lib/i18n.ts";
import { SITE_URL } from "../lib/rpc.ts";
import { colors, fieldStyle, Muted } from "../lib/ui.tsx";
import { connectMathKeyboard, KEYBOARD_STAND_IN } from "./MathKeyboard.tsx";

// MathLive's own fonts and sounds are off: KaTeX's stylesheet already provides the fonts. Without MathLive, which the
// page loads from the site before this runs, the page says so and the learner types plain text instead. The keyboard
// is not in this page but at the bottom of the screen (MathKeyboard).
const script = (value: string, disabled: boolean) => `
if(typeof MathfieldElement==="undefined"){post({failed:true})}else{
MathfieldElement.fontsDirectory=null;MathfieldElement.soundsDirectory=null;
var f=document.getElementById("f");
f.value=${scriptValue(value)};f.disabled=${disabled};
customElements.whenDefined("math-field").then(function(){
  f.menuItems=[];
  f.inlineShortcuts=Object.assign({},f.inlineShortcuts,{">=":"\\\\ge","<=":"\\\\le"});
});
f.addEventListener("input",function(){post({value:f.value})});
f.addEventListener("keydown",function(e){if(e.key==="Enter"){e.preventDefault();post({submit:true})}},{capture:true});
}`;

/**
 * MathField asks for math as LaTeX through MathLive, in a web view, with MathLive's keyboard docked at the bottom of
 * the screen (MathKeyboard). A learner can also type plain text, such as 3/4.
 */
export function MathField(props: {
  value: string;
  onChange: (latex: string) => void;
  onSubmit: () => void;
  onKeyboard?: (height: number) => void;
  disabled: boolean;
}) {
  const asText = signal(false);
  const field = signal(60);
  const keyboard = connectMathKeyboard((height) => props.onKeyboard?.(height));
  cleanup(() => keyboard.release());
  // A field that is answered, or typed as plain text, has no use for the keyboard.
  effect(() => {
    if (props.disabled || asText()) keyboard.release();
  });
  // The page keeps what is typed; it is written back only when the page is built again.
  const html = computed(() => {
    const disabled = props.disabled;
    const palette = colors();
    return pageHtml(
      `<math-field id="f" aria-label="${m().yourAnswer}" math-virtual-keyboard-policy="manual" smart-fence="on" style="display:block;box-sizing:border-box;width:100%;min-height:48px;padding:8px 12px;font-size:20px;border:1px solid ${palette.ink}33;border-radius:8px;background:transparent;color:inherit"></math-field>`,
      palette,
      {
        head: `${KEYBOARD_STAND_IN}<style>math-field{--caret-color:${palette.accent};--primary-color:${palette.accent}}math-field:focus,math-field:focus-visible{outline:none}math-field::part(menu-toggle){display:none}math-field::part(virtual-keyboard-toggle){min-width:44px;min-height:44px}</style><script src="${SITE_URL}/embed/mathlive.min.js"></script>`,
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
            ref={(ref) => keyboard.attach(ref)}
            html={html()}
            baseUrl={`${SITE_URL}/`}
            scrollable={false}
            style={{ backgroundColor: "transparent", height: field() }}
            onError={() => asText.set(true)}
            onMessage={({ data }) => {
              const message = JSON.parse(data) as {
                height?: number;
                value?: string;
                submit?: boolean;
                kb?: unknown;
                failed?: boolean;
              };
              if (message.failed) asText.set(true);
              if (message.height) field.set(message.height);
              if (message.value !== undefined) props.onChange(message.value);
              if (message.submit) props.onSubmit();
              if (message.kb) keyboard.relay(message.kb);
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
          onSubmit={props.onSubmit}
          returnKeyType="done"
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
