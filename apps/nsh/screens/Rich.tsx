import type { Figure } from "@ga/proto/common/v1/figure_pb";
import { computed, signal, Text, View, WebView } from "nsh";

import { contentHtml, figureHtml, isPlain, pageHtml, texHtml } from "../lib/content.ts";
import { tx } from "../lib/i18n.ts";
import { API_URL } from "../lib/rpc.ts";
import { colors } from "../lib/ui.tsx";

/** Page shows HTML in a web view as tall as its content; a press anywhere on it calls onPress. */
function Page(props: { label: string; body: () => string; fontSize?: number; onPress?: () => void }) {
  const height = signal(props.fontSize ? props.fontSize * 1.6 : 26);
  const html = computed(() =>
    pageHtml(props.body(), colors(), {
      fontSize: props.fontSize,
      script: props.onPress ? `addEventListener("click",function(){post({press:true})});` : "",
    }),
  );
  return (
    <View accessibilityLabel={props.label} onPress={props.onPress} style={{ alignSelf: "stretch" }}>
      <WebView
        html={html()}
        baseUrl={`${API_URL}/`}
        scrollable={false}
        style={{ backgroundColor: "transparent", height: height() }}
        onMessage={({ data }) => {
          const message = JSON.parse(data) as { height?: number; press?: boolean };
          if (message.height) height.set(message.height);
          if (message.press) props.onPress?.();
        }}
      />
    </View>
  );
}

/**
 * Rich shows a content text: as a native text where it is plain, which is cheap,
 * and otherwise in a web view that typesets its math and draws its figures.
 */
export function Rich(props: {
  source: string;
  figures?: readonly Figure[];
  inline?: boolean;
  fontSize?: number;
  bold?: boolean;
  onPress?: () => void;
}) {
  return (
    <If
      when={isPlain(props.source) && !props.source.includes("{{figure")}
      else={
        <Page
          label={props.source}
          fontSize={props.fontSize}
          onPress={props.onPress}
          body={() => {
            const html = contentHtml(props.source, props.figures, props.inline);
            return props.bold ? `<strong>${html}</strong>` : html;
          }}
        />
      }
    >
      <Text
        onPress={props.onPress}
        style={{
          color: colors().ink,
          fontSize: props.fontSize ?? 16,
          fontWeight: props.bold ? "600" : "400",
          lineHeight: (props.fontSize ?? 16) * 1.5,
        }}
      >
        {props.source}
      </Text>
    </If>
  );
}

/** Tex shows a LaTeX string such as an answer, as a native text where it is only a number. */
export function Tex(props: { tex: string; fontSize?: number }) {
  return (
    <If when={/^[-\d.,\s]+$/.test(props.tex)} else={<Page label={props.tex} fontSize={props.fontSize} body={() => texHtml(props.tex)} />}>
      <Text style={{ color: colors().ink, fontSize: props.fontSize ?? 16 }}>{props.tex}</Text>
    </If>
  );
}

/** FigureView shows a content figure. */
export function FigureView(props: { figure: Figure; caption?: boolean; onPress?: () => void }) {
  return <Page label={tx(props.figure.alt)} onPress={props.onPress} body={() => figureHtml(props.figure, props.caption)} />;
}
