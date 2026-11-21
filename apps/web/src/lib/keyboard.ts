/**
 * SLIDE_AWAY_CLASS marks MathLive's virtual keyboard while it slides down; styles.css gives the slide, and the app's
 * math field (apps/nsh/screens/MathField.tsx) does the same in its web view.
 */
export const SLIDE_AWAY_CLASS = "ga-hiding";

/** SlidingKeyboard is what slideKeyboardAway uses of MathLive's virtual keyboard, including two of its private fields. */
interface SlidingKeyboard {
  show(options?: { animate?: boolean }): void;
  hide(options?: { animate?: boolean }): void;
  readonly _element?: HTMLElement;
  readonly _visible?: boolean;
}

/**
 * slideKeyboardAway makes MathLive's virtual keyboard slide down as it hides, as it slides up as it shows: MathLive
 * removes it at once. Until the slide ends the keyboard counts as hidden, and showing it again slides it back up.
 */
export function slideKeyboardAway(keyboard: SlidingKeyboard) {
  const hide = keyboard.hide.bind(keyboard);
  const show = keyboard.show.bind(keyboard);
  const sliding = () => !!keyboard._element?.classList.contains(SLIDE_AWAY_CLASS);
  Object.defineProperty(keyboard, "visible", {
    configurable: true,
    get: () => !!keyboard._visible && !sliding(),
    set: (on: boolean) => (on ? keyboard.show() : keyboard.hide()),
  });
  keyboard.hide = (options) => {
    const element = keyboard._element;
    if (!element || !keyboard._visible) return hide(options);
    if (sliding()) return;
    element.classList.add(SLIDE_AWAY_CLASS);
    let timer = 0;
    const done = () => {
      clearTimeout(timer);
      element.removeEventListener("transitionend", ended);
      if (element.classList.contains(SLIDE_AWAY_CLASS)) {
        element.classList.remove(SLIDE_AWAY_CLASS);
        hide(options);
      }
    };
    // Only the backdrop's own slide ends it; the keys' transitions bubble up too.
    const ended = (event: TransitionEvent) => {
      if ((event.target as Element).classList.contains("MLK__backdrop") && event.propertyName === "transform") done();
    };
    element.addEventListener("transitionend", ended);
    // A transition that does not run, as with reduced motion, still ends the hiding.
    timer = window.setTimeout(done, 400);
  };
  keyboard.show = (options) => {
    if (sliding()) keyboard._element?.classList.remove(SLIDE_AWAY_CLASS);
    else show(options);
  };
}

/**
 * pasteThroughClipboardApi makes the paste key of MathLive's keyboard paste. MathLive pastes with
 * `document.execCommand("paste")` wherever the browser says it supports the command, and browsers say so but refuse it
 * to pages; only where the command is unsupported does MathLive read the clipboard through the Clipboard API, which
 * browsers allow on a key's press (after asking, where they ask).
 */
export function pasteThroughClipboardApi(doc: Document) {
  const supported = doc.queryCommandSupported.bind(doc);
  doc.queryCommandSupported = (command) => command.toLowerCase() !== "paste" && supported(command);
}
