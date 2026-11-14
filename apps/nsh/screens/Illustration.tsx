import { Image, signal } from "nsh";
import { API_URL } from "../lib/rpc.ts";
import { colors } from "../lib/ui.tsx";

/**
 * Illustration shows an illustration from the web app, a 3:2 picture that only decorates: nothing waits for it, and one
 * that fails to load leaves no gap. path is its path from the site's root without an extension, as the API gives it;
 * width is the width it takes, by default all of it; thumb shows the small file, for lists.
 */
export function Illustration(props: { path: string; width?: number; thumb?: boolean }) {
  const failed = signal(false);
  return (
    <If when={props.path !== "" && !failed()}>
      <Image
        src={`${API_URL}/${props.path}${props.thumb ? ".thumb" : ""}.webp`}
        onError={() => failed.set(true)}
        style={{
          alignSelf: props.width ? "auto" : "stretch",
          aspectRatio: 3 / 2,
          backgroundColor: colors().line,
          borderRadius: props.thumb ? 8 : 12,
          objectFit: "cover",
          ...(props.width ? { width: props.width } : { width: "100%" }),
        }}
      />
    </If>
  );
}
