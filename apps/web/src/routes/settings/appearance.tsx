import {
  addCustomPalette,
  CONTRASTS,
  type ColorScheme,
  type ColorSeeds,
  choiceSeeds,
  customHexColors,
  isCustomChoice,
  isHexColor,
  MAX_CUSTOM_PALETTES,
  MAX_PALETTE_NAME,
  MOTIONS,
  PALETTES,
  type Palette,
  type PaletteChoice,
  parseSharedPalette,
  removeCustomPalette,
  sharePalette,
  TEXT_SIZES,
  THEMES,
  type Theme,
  updateCustomPalette,
} from "@ga/design";
import { Check, Plus } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { type CSSProperties, type ReactNode, useEffect, useState } from "react";

import { field } from "../../components/AuthForm.tsx";
import { Markdown } from "../../components/Markdown.tsx";
import { Button, buttonClass, Card } from "../../components/ui.tsx";
import { setAppearance, useAppearance } from "../../lib/appearance.ts";
import { useI18n } from "../../lib/i18n.tsx";

export const Route = createFileRoute("/settings/appearance")({ component: AppearanceSettings });

/** The attributes that make an element show a palette in a scheme, whatever the page around it shows. */
function useSchemeAttributes(scheme: ColorScheme, choice?: PaletteChoice) {
  const appearance = useAppearance();
  return { "data-theme": scheme, [`data-${scheme}`]: choice ?? appearance[scheme], "data-contrast": appearance.contrast };
}

/** A miniature of the product in a scheme, drawn with the real tokens of that scheme. */
function Miniature({ scheme, choice }: { scheme: ColorScheme; choice?: PaletteChoice }) {
  const attributes = useSchemeAttributes(scheme, choice);
  return (
    <div {...attributes} className="flex h-full w-full flex-col gap-1.5 bg-page p-2 text-ink">
      <div className="flex items-center gap-1">
        <span className="size-1.5 rounded-full bg-accent" />
        <span className="h-1 w-6 rounded-full bg-line" />
      </div>
      <div className="flex-1 space-y-1.5 rounded-md border border-line bg-surface p-1.5">
        <div className="h-1 w-4/5 rounded-full bg-ink" />
        <div className="h-1 w-3/5 rounded-full bg-muted" />
        <div className="flex gap-1">
          <span className="h-2 w-1/3 rounded-sm bg-good-soft" />
          <span className="h-2 w-1/3 rounded-sm bg-bad-soft" />
        </div>
        <div className="h-2.5 w-2/5 rounded-sm bg-accent" />
      </div>
    </div>
  );
}

function ThemePreview({ theme }: { theme: Theme }) {
  if (theme !== "system") return <Miniature scheme={theme} />;
  return (
    <div className="relative h-full w-full">
      <Miniature scheme="light" />
      <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-[200%]">
          <Miniature scheme="dark" />
        </div>
      </div>
    </div>
  );
}

/** One choice shown as a miniature with its name below. */
function PreviewChoice({
  group,
  name,
  checked,
  onChange,
  children,
}: {
  group: string;
  name: string;
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
}) {
  return (
    <label className="group min-w-0 cursor-pointer space-y-1.5 text-center text-sm">
      <input type="radio" name={group} className="peer sr-only" checked={checked} onChange={onChange} />
      <span className="block aspect-[4/3] overflow-hidden rounded-xl border-2 border-line transition group-hover:border-accent/50 peer-checked:border-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
        {children}
      </span>
      <span className={`flex items-center justify-center gap-1 ${checked ? "font-medium text-ink" : "text-muted"}`} title={name}>
        {checked && <Check size={14} weight="bold" className="shrink-0 text-accent" />}
        <span className="truncate">{name}</span>
      </span>
    </label>
  );
}

function ThemePicker({ onPick }: { onPick: (scheme: ColorScheme) => void }) {
  const { m } = useI18n();
  const { theme } = useAppearance();
  const names: Record<Theme, string> = { system: m.themeSystem, light: m.themeLight, dark: m.themeDark };
  return (
    <fieldset className="grid grid-cols-3 gap-3">
      <legend className="sr-only">{m.theme}</legend>
      {THEMES.map((t) => (
        <PreviewChoice
          key={t}
          group="theme"
          name={names[t]}
          checked={theme === t}
          onChange={() => {
            setAppearance({ theme: t });
            if (t !== "system") onPick(t);
          }}
        >
          <ThemePreview theme={t} />
        </PreviewChoice>
      ))}
    </fieldset>
  );
}

/** The names of the built-in palettes. */
function usePaletteNames(): Record<Palette, string> {
  const { m } = useI18n();
  return {
    academy: m.paletteAcademy,
    iris: m.paletteIris,
    plum: m.palettePlum,
    rose: m.paletteRose,
    linen: m.paletteLinen,
    terracotta: m.paletteTerracotta,
    walnut: m.paletteWalnut,
    honey: m.paletteHoney,
    olive: m.paletteOlive,
    paper: m.palettePaper,
    sepia: m.paletteSepia,
    pine: m.palettePine,
    lake: m.paletteLake,
    sky: m.paletteSky,
    midnight: m.paletteMidnight,
    slate: m.paletteSlate,
  };
}

/** A name not yet taken in a scheme: the wanted one, or the wanted one with a number. */
function freeName(wanted: string, taken: readonly { name: string }[]) {
  const names = new Set(taken.map((p) => p.name));
  if (!names.has(wanted)) return wanted;
  let n = 2;
  while (names.has(`${wanted} ${n}`)) n++;
  return `${wanted} ${n}`;
}

function PaletteGrid({ scheme }: { scheme: ColorScheme }) {
  const { m } = useI18n();
  const appearance = useAppearance();
  const names = usePaletteNames();
  const custom = appearance.custom[scheme];
  const pick = (choice: PaletteChoice) => setAppearance({ [scheme]: choice });
  const add = () => {
    let n = 1;
    while (custom.some((p) => p.name === m.paletteNewName(n))) n++;
    setAppearance(addCustomPalette(appearance, scheme, m.paletteNewName(n), choiceSeeds(appearance, scheme)));
  };
  return (
    <fieldset className="grid grid-cols-4 gap-x-2.5 gap-y-3 sm:grid-cols-6">
      <legend className="sr-only">{m.palette}</legend>
      {PALETTES.map((p) => (
        <PreviewChoice key={p} group={`palette-${scheme}`} name={names[p]} checked={appearance[scheme] === p} onChange={() => pick(p)}>
          <Miniature scheme={scheme} choice={p} />
        </PreviewChoice>
      ))}
      {custom.map((p) => (
        <PreviewChoice
          key={p.id}
          group={`palette-${scheme}`}
          name={p.name}
          checked={appearance[scheme] === p.id}
          onChange={() => pick(p.id)}
        >
          <Miniature scheme={scheme} choice={p.id} />
        </PreviewChoice>
      ))}
      {custom.length < MAX_CUSTOM_PALETTES && (
        <button
          type="button"
          onClick={add}
          className="group min-w-0 cursor-pointer space-y-1.5 text-center text-sm text-muted hover:text-ink"
        >
          <span className="flex aspect-[4/3] items-center justify-center rounded-xl border-2 border-dashed border-line transition group-hover:border-accent/50">
            <Plus size={20} />
          </span>
          <span className="block truncate">{m.paletteNew}</span>
        </button>
      )}
    </fieldset>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (hex: string) => void }) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5">
      <span className="text-sm font-medium">{label}</span>
      <span className="flex items-center gap-2">
        <input
          type="text"
          aria-label={`${label} hex`}
          spellCheck={false}
          value={draft}
          onChange={(e) => {
            const next = e.target.value.trim().toLowerCase();
            setDraft(next);
            if (isHexColor(next)) onChange(next);
          }}
          onBlur={() => setDraft(value)}
          className={`${field} w-28 py-1 font-mono text-sm`}
        />
        <input
          type="color"
          aria-label={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="size-8 shrink-0 cursor-pointer rounded-md border border-line bg-surface p-0.5"
        />
      </span>
    </div>
  );
}

function CopyButton({ scheme, name, seeds }: { scheme: ColorScheme; name: string; seeds: ColorSeeds }) {
  const { m } = useI18n();
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);
  return (
    <button
      type="button"
      className={buttonClass("ghost", "px-2.5 py-1")}
      onClick={async () => {
        await navigator.clipboard.writeText(sharePalette(scheme, name, seeds));
        setCopied(true);
      }}
    >
      {copied ? m.paletteCopied : m.paletteCopy}
    </button>
  );
}

/** Deleting takes a second click, because nothing brings a palette back. */
function DeleteButton({ onDelete }: { onDelete: () => void }) {
  const { m } = useI18n();
  const [asked, setAsked] = useState(false);
  return (
    <button
      type="button"
      className={buttonClass("ghost", "px-2.5 py-1 text-bad hover:text-bad")}
      onBlur={() => setAsked(false)}
      onClick={() => (asked ? onDelete() : setAsked(true))}
    >
      {asked ? m.paletteDeleteConfirm : m.paletteDelete}
    </button>
  );
}

/** A name that may not end up blank: it stays as typed, and an empty field shows the old name again on leaving. */
function NameField({ value, onChange }: { value: string; onChange: (name: string) => void }) {
  const { m } = useI18n();
  const [text, setText] = useState(value);
  return (
    <input
      type="text"
      aria-label={m.paletteName}
      maxLength={MAX_PALETTE_NAME}
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        if (e.target.value.trim()) onChange(e.target.value);
      }}
      onBlur={() => setText(value)}
      className={`${field} min-w-0 flex-1 py-1 text-sm font-medium`}
    />
  );
}

/**
 * The colors of the chosen palette. A person's own palette changes as it is
 * edited; a built-in one never does, so edits to it stay a draft until saved as
 * a new palette.
 */
function PaletteDetails({
  scheme,
  draft,
  onDraft,
}: {
  scheme: ColorScheme;
  draft: ColorSeeds | null;
  onDraft: (draft: ColorSeeds | null) => void;
}) {
  const { m } = useI18n();
  const appearance = useAppearance();
  const names = usePaletteNames();
  const choice = appearance[scheme];
  const list = appearance.custom[scheme];
  const custom = list.find((p) => p.id === choice);
  const name = custom?.name ?? (isCustomChoice(choice) ? "" : names[choice]);
  const saved = choiceSeeds(appearance, scheme);
  const seeds = draft ?? saved;
  const full = list.length >= MAX_CUSTOM_PALETTES;
  const [copyName, setCopyName] = useState("");
  const suggested = freeName(m.paletteCopyName(name), list);

  const change = (part: Partial<ColorSeeds>) => {
    if (custom) {
      setAppearance(updateCustomPalette(appearance, scheme, custom.id, part));
      return;
    }
    const next = { ...seeds, ...part };
    onDraft(next.accent === saved.accent && next.page === saved.page && next.ink === saved.ink ? null : next);
  };

  return (
    <div className="space-y-2">
      <div className="divide-y divide-line rounded-xl border border-line bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5">
          {custom ? (
            <NameField
              value={custom.name}
              onChange={(next) => setAppearance(updateCustomPalette(appearance, scheme, custom.id, { name: next }))}
            />
          ) : (
            <span className="flex items-baseline gap-2 text-sm font-medium">
              {name}
              <span className="text-xs font-normal text-muted">{m.paletteBuiltIn}</span>
            </span>
          )}
          <span className="flex items-center gap-1">
            <CopyButton scheme={scheme} name={name} seeds={seeds} />
            {custom && <DeleteButton onDelete={() => setAppearance(removeCustomPalette(appearance, scheme, custom.id))} />}
          </span>
        </div>
        <ColorField label={m.customAccent} value={seeds.accent} onChange={(accent) => change({ accent })} />
        <ColorField label={m.customPage} value={seeds.page} onChange={(page) => change({ page })} />
        <ColorField label={m.customInk} value={seeds.ink} onChange={(ink) => change({ ink })} />
        {draft && (
          <form
            className="flex flex-wrap items-center gap-2 px-4 py-2.5"
            onSubmit={(e) => {
              e.preventDefault();
              setAppearance(addCustomPalette(appearance, scheme, copyName.trim() || suggested, draft));
              onDraft(null);
            }}
          >
            <input
              type="text"
              aria-label={m.paletteName}
              maxLength={MAX_PALETTE_NAME}
              placeholder={suggested}
              value={copyName}
              onChange={(e) => setCopyName(e.target.value)}
              className={`${field} min-w-40 flex-1 py-1 text-sm`}
            />
            <Button type="submit" variant="secondary" disabled={full}>
              {m.paletteSaveCustom}
            </Button>
            <button type="button" className={buttonClass("ghost", "px-2.5 py-1")} onClick={() => onDraft(null)}>
              {m.paletteRevert}
            </button>
            {full && <p className="w-full text-sm text-bad">{m.paletteLimit(MAX_CUSTOM_PALETTES)}</p>}
          </form>
        )}
      </div>
      {!custom && <p className="text-xs text-muted">{m.builtInHint}</p>}
      <p className="text-xs text-muted">{m.customHint}</p>
    </div>
  );
}

function ImportPalette({ scheme }: { scheme: ColorScheme }) {
  const { m } = useI18n();
  const appearance = useAppearance();
  const [importing, setImporting] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const list = appearance.custom[scheme];

  const close = () => {
    setImporting(false);
    setText("");
    setError("");
  };

  return (
    <>
      <button type="button" className={buttonClass("ghost", "px-2.5 py-1")} onClick={() => (importing ? close() : setImporting(true))}>
        {m.paletteImport}
      </button>
      {importing && (
        <form
          className="w-full space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            const shared = parseSharedPalette(text);
            if (!shared || shared.scheme !== scheme) {
              setError(m.paletteImportFailed(scheme === "light" ? m.themeLight : m.themeDark));
              return;
            }
            if (list.length >= MAX_CUSTOM_PALETTES) {
              setError(m.paletteLimit(MAX_CUSTOM_PALETTES));
              return;
            }
            setAppearance(addCustomPalette(appearance, scheme, freeName(shared.name, list), shared.seeds));
            close();
          }}
        >
          <textarea
            aria-label={m.paletteImport}
            rows={3}
            spellCheck={false}
            placeholder={m.paletteImportPlaceholder}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setError("");
            }}
            className={`${field} font-mono text-xs`}
          />
          {error && <p className="text-sm text-bad">{error}</p>}
          <Button type="submit" variant="secondary" disabled={!text.trim()}>
            {m.paletteImport}
          </Button>
        </form>
      )}
    </>
  );
}

/** A real question in a scheme's colors: the type, math, a figure and the states of an answer. */
function Preview({ scheme, draft }: { scheme: ColorScheme; draft: ColorSeeds | null }) {
  const { m } = useI18n();
  const attributes = useSchemeAttributes(scheme);
  const { contrast } = useAppearance();
  // A draft has no rules in any stylesheet yet, so it sets the colors right here.
  const style =
    draft &&
    (Object.fromEntries(
      Object.entries(customHexColors(draft, scheme, contrast)).map(([token, hex]) => [`--color-${token}`, hex]),
    ) as CSSProperties);
  return (
    <div {...attributes} style={style ?? undefined} className="rounded-2xl bg-page p-3 text-ink">
      <Card className="space-y-4">
        <Markdown source={m.previewPrompt} className="font-medium" />
        <div className="figure-ga">
          <svg viewBox="0 0 200 110" role="img" aria-label="y = x² − 1" fill="none" stroke="currentColor">
            <path d="M20 80H180M100 108V6" strokeWidth="1" />
            <path className="accent" stroke="currentColor" d="M54 6Q100 198 146 6" strokeWidth="2" />
            <circle className="result" stroke="currentColor" fill="currentColor" cx="122" cy="80" r="3.5" />
          </svg>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border-2 border-good bg-good-soft px-4 py-2.5">
            <Markdown source="$x = 1$" inline />
          </div>
          <div className="rounded-xl border-2 border-bad bg-bad-soft px-4 py-2.5">
            <Markdown source="$x = -1$" inline />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button tabIndex={-1}>{m.submit}</Button>
          <span className="text-sm text-good">{m.correct}</span>
          <span className="text-sm text-bad">{m.incorrect}</span>
        </div>
      </Card>
    </div>
  );
}

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="flex shrink-0 rounded-lg border border-line bg-page p-0.5">
      <legend className="sr-only">{label}</legend>
      {options.map((o) => (
        <label key={o.value} className="cursor-pointer text-sm">
          <input type="radio" name={label} className="peer sr-only" checked={value === o.value} onChange={() => onChange(o.value)} />
          <span className="block rounded-md px-3 py-1 whitespace-nowrap text-muted transition peer-checked:bg-surface peer-checked:font-medium peer-checked:text-ink peer-checked:shadow-sm peer-focus-visible:outline-2 peer-focus-visible:outline-accent hover:text-ink">
            {o.label}
          </span>
        </label>
      ))}
    </fieldset>
  );
}

function Row({ title, body, children }: { title: string; body: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-x-6 gap-y-3 px-5 py-4 max-sm:flex-col max-sm:items-start">
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-sm text-muted">{body}</div>
      </div>
      {children}
    </div>
  );
}

function AppearanceSettings() {
  const { m } = useI18n();
  const appearance = useAppearance();
  const { theme, contrast, text, motion } = appearance;
  // Which scheme's colors are being edited: at first the one showing now.
  const [scheme, setScheme] = useState<ColorScheme>("light");
  useEffect(() => {
    setScheme(theme === "system" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : theme);
  }, [theme]);
  // Unsaved changes to a built-in palette, kept until another palette is edited.
  const [draft, setDraft] = useState<{ of: string; seeds: ColorSeeds } | null>(null);
  const draftOf = `${scheme}:${appearance[scheme]}`;
  const currentDraft = draft?.of === draftOf ? draft.seeds : null;
  const contrastNames = { standard: m.contrastStandard, high: m.contrastHigh };
  const textNames = { small: m.textSmall, default: m.textDefault, large: m.textLarge };
  const motionNames = { system: m.motionSystem, reduced: m.motionReduced, full: m.motionFull };
  return (
    <div className="space-y-8">
      <p className="text-sm text-muted">{m.appearanceBody}</p>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{m.theme}</h2>
        <ThemePicker onPick={setScheme} />
      </section>
      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">{m.palette}</h2>
          <p className="text-sm text-muted">{m.paletteBody}</p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Segmented
            label={m.palette}
            options={[
              { value: "light", label: m.themeLight },
              { value: "dark", label: m.themeDark },
            ]}
            value={scheme}
            onChange={setScheme}
          />
          <ImportPalette key={scheme} scheme={scheme} />
        </div>
        <PaletteGrid scheme={scheme} />
        <PaletteDetails key={draftOf} scheme={scheme} draft={currentDraft} onDraft={(seeds) => setDraft(seeds && { of: draftOf, seeds })} />
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{m.appearancePreview}</h2>
        <Preview scheme={scheme} draft={currentDraft} />
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{m.preferences}</h2>
        <div className="divide-y divide-line rounded-2xl border border-line bg-surface">
          <Row title={m.contrast} body={m.contrastBody}>
            <Segmented
              label={m.contrast}
              options={CONTRASTS.map((value) => ({ value, label: contrastNames[value] }))}
              value={contrast}
              onChange={(value) => setAppearance({ contrast: value })}
            />
          </Row>
          <Row title={m.textSize} body={m.textSizeBody}>
            <Segmented
              label={m.textSize}
              options={TEXT_SIZES.map((value) => ({ value, label: textNames[value] }))}
              value={text}
              onChange={(value) => setAppearance({ text: value })}
            />
          </Row>
          <Row title={m.motion} body={m.motionBody}>
            <Segmented
              label={m.motion}
              options={MOTIONS.map((value) => ({ value, label: motionNames[value] }))}
              value={motion}
              onChange={(value) => setAppearance({ motion: value })}
            />
          </Row>
        </div>
      </section>
    </div>
  );
}
