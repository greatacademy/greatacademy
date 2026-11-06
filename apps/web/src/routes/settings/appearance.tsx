import {
  CONTRASTS,
  type ColorScheme,
  type ColorSeeds,
  isHexColor,
  MOTIONS,
  PALETTE_CHOICES,
  type Palette,
  type PaletteChoice,
  parseSharedPalette,
  seedsOf,
  sharePalette,
  TEXT_SIZES,
  THEMES,
  type Theme,
} from "@ga/design";
import { Check, Palette as PaletteIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { type ReactNode, useEffect, useState } from "react";

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
      <span className={`inline-flex items-center gap-1 ${checked ? "font-medium text-ink" : "text-muted"}`}>
        {checked && <Check size={14} weight="bold" className="shrink-0 text-accent" />}
        {name}
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

/** The seeds a scheme has in the appearance, or what it shows now, as a palette to share or to start customizing from. */
function useCurrentSeeds(scheme: ColorScheme): ColorSeeds {
  const appearance = useAppearance();
  const choice = appearance[scheme];
  const custom = scheme === "light" ? appearance.customLight : appearance.customDark;
  return choice === "custom" && custom ? custom : seedsOf(choice === "custom" ? "academy" : (choice as Palette), scheme);
}

const setCustom = (scheme: ColorScheme, seeds: ColorSeeds) =>
  setAppearance(scheme === "light" ? { light: "custom", customLight: seeds } : { dark: "custom", customDark: seeds });

function PaletteGrid({ scheme }: { scheme: ColorScheme }) {
  const { m } = useI18n();
  const appearance = useAppearance();
  const seeds = useCurrentSeeds(scheme);
  const hasCustom = !!(scheme === "light" ? appearance.customLight : appearance.customDark);
  const names: Record<PaletteChoice, string> = {
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
    custom: m.paletteCustom,
  };
  return (
    <fieldset className="grid grid-cols-4 gap-x-2.5 gap-y-3 sm:grid-cols-6">
      <legend className="sr-only">{m.palette}</legend>
      {PALETTE_CHOICES.map((p) => (
        <PreviewChoice
          key={p}
          group={`palette-${scheme}`}
          name={names[p]}
          checked={appearance[scheme] === p}
          onChange={() => {
            if (p !== "custom") setAppearance({ [scheme]: p });
            else if (hasCustom) setAppearance({ [scheme]: "custom" });
            else setCustom(scheme, seeds);
          }}
        >
          {p === "custom" && !hasCustom ? (
            <span className="flex h-full items-center justify-center text-muted">
              <PaletteIcon size={22} />
            </span>
          ) : (
            <Miniature scheme={scheme} choice={p} />
          )}
        </PreviewChoice>
      ))}
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

function CustomEditor({ scheme }: { scheme: ColorScheme }) {
  const { m } = useI18n();
  const seeds = useCurrentSeeds(scheme);
  return (
    <div className="space-y-2">
      <div className="divide-y divide-line rounded-xl border border-line bg-surface">
        <ColorField label={m.customAccent} value={seeds.accent} onChange={(accent) => setCustom(scheme, { ...seeds, accent })} />
        <ColorField label={m.customPage} value={seeds.page} onChange={(page) => setCustom(scheme, { ...seeds, page })} />
        <ColorField label={m.customInk} value={seeds.ink} onChange={(ink) => setCustom(scheme, { ...seeds, ink })} />
      </div>
      <p className="text-xs text-muted">{m.customHint}</p>
    </div>
  );
}

function CopyImport({ scheme }: { scheme: ColorScheme }) {
  const { m } = useI18n();
  const seeds = useCurrentSeeds(scheme);
  const [copied, setCopied] = useState(false);
  const [importing, setImporting] = useState(false);
  const [text, setText] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  const close = () => {
    setImporting(false);
    setText("");
    setFailed(false);
  };

  return (
    <>
      <span className="flex items-center gap-1">
        <button type="button" className={buttonClass("ghost", "px-2.5 py-1")} onClick={() => (importing ? close() : setImporting(true))}>
          {m.paletteImport}
        </button>
        <button
          type="button"
          className={buttonClass("ghost", "px-2.5 py-1")}
          onClick={async () => {
            await navigator.clipboard.writeText(sharePalette(scheme, seeds));
            setCopied(true);
          }}
        >
          {copied ? m.paletteCopied : m.paletteCopy}
        </button>
      </span>
      {importing && (
        <form
          className="w-full space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            const shared = parseSharedPalette(text);
            if (!shared || shared.scheme !== scheme) {
              setFailed(true);
              return;
            }
            setCustom(scheme, shared.seeds);
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
              setFailed(false);
            }}
            className={`${field} font-mono text-xs`}
          />
          {failed && <p className="text-sm text-bad">{m.paletteImportFailed(scheme === "light" ? m.themeLight : m.themeDark)}</p>}
          <Button type="submit" variant="secondary" disabled={!text.trim()}>
            {m.paletteImport}
          </Button>
        </form>
      )}
    </>
  );
}

/** A real question in a scheme's colors: the type, math, a figure and the states of an answer. */
function Preview({ scheme }: { scheme: ColorScheme }) {
  const { m } = useI18n();
  const attributes = useSchemeAttributes(scheme);
  return (
    <div {...attributes} className="rounded-2xl bg-page p-3 text-ink">
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
          <CopyImport key={scheme} scheme={scheme} />
        </div>
        <PaletteGrid scheme={scheme} />
        {appearance[scheme] === "custom" && <CustomEditor scheme={scheme} />}
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{m.appearancePreview}</h2>
        <Preview scheme={scheme} />
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
