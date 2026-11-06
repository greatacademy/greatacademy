import { type ColorScheme, MOTIONS, PALETTES, type Palette, TEXT_SIZES, THEMES, type Theme } from "@ga/design";
import { Check } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { Markdown } from "../../components/Markdown.tsx";
import { Button, Card } from "../../components/ui.tsx";
import { setAppearance, useAppearance } from "../../lib/appearance.ts";
import { useI18n } from "../../lib/i18n.tsx";

export const Route = createFileRoute("/settings/appearance")({ component: AppearanceSettings });

/** A miniature of the product in a scheme, drawn with the real tokens of that scheme. */
function Miniature({ scheme, palette }: { scheme: ColorScheme; palette: Palette }) {
  return (
    <div data-theme={scheme} data-palette={palette} className="flex h-full w-full flex-col gap-1.5 bg-page p-2 text-ink">
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

function ThemePreview({ theme, palette }: { theme: Theme; palette: Palette }) {
  if (theme !== "system") return <Miniature scheme={theme} palette={palette} />;
  return (
    <div className="relative h-full w-full">
      <Miniature scheme="light" palette={palette} />
      <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-[200%]">
          <Miniature scheme="dark" palette={palette} />
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
    <label className="group cursor-pointer space-y-2 text-center text-sm">
      <input type="radio" name={group} className="peer sr-only" checked={checked} onChange={onChange} />
      <span className="block aspect-[4/3] overflow-hidden rounded-xl border-2 border-line transition group-hover:border-accent/50 peer-checked:border-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
        {children}
      </span>
      <span className={`inline-flex items-center gap-1 ${checked ? "font-medium text-ink" : "text-muted"}`}>
        {checked && <Check size={14} weight="bold" className="text-accent" />}
        {name}
      </span>
    </label>
  );
}

function ThemePicker() {
  const { m } = useI18n();
  const { theme, palette } = useAppearance();
  const names: Record<Theme, string> = { system: m.themeSystem, light: m.themeLight, dark: m.themeDark };
  return (
    <fieldset className="grid grid-cols-3 gap-3">
      <legend className="sr-only">{m.theme}</legend>
      {THEMES.map((t) => (
        <PreviewChoice key={t} group="theme" name={names[t]} checked={theme === t} onChange={() => setAppearance({ theme: t })}>
          <ThemePreview theme={t} palette={palette} />
        </PreviewChoice>
      ))}
    </fieldset>
  );
}

function PalettePicker() {
  const { m } = useI18n();
  const { palette } = useAppearance();
  const names: Record<Palette, string> = {
    academy: m.paletteAcademy,
    iris: m.paletteIris,
    plum: m.palettePlum,
    rose: m.paletteRose,
    walnut: m.paletteWalnut,
    paper: m.palettePaper,
    sepia: m.paletteSepia,
    pine: m.palettePine,
    lake: m.paletteLake,
    sky: m.paletteSky,
    midnight: m.paletteMidnight,
    slate: m.paletteSlate,
  };
  return (
    <fieldset className="grid grid-cols-4 gap-3 max-sm:grid-cols-3">
      <legend className="sr-only">{m.palette}</legend>
      {PALETTES.map((p) => (
        <PreviewChoice key={p} group="palette" name={names[p]} checked={palette === p} onChange={() => setAppearance({ palette: p })}>
          {/* Half light, half dark: a palette is chosen once for both. */}
          <ThemePreview theme="system" palette={p} />
        </PreviewChoice>
      ))}
    </fieldset>
  );
}

/** A real question in the current settings: the type, math, a figure and the states of an answer. */
function Preview() {
  const { m } = useI18n();
  return (
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
  const { text, motion } = useAppearance();
  const textNames = { small: m.textSmall, default: m.textDefault, large: m.textLarge };
  const motionNames = { system: m.motionSystem, reduced: m.motionReduced, full: m.motionFull };
  return (
    <div className="space-y-8">
      <p className="text-sm text-muted">{m.appearanceBody}</p>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{m.theme}</h2>
        <ThemePicker />
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{m.palette}</h2>
        <PalettePicker />
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{m.appearancePreview}</h2>
        <Preview />
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{m.preferences}</h2>
        <div className="divide-y divide-line rounded-2xl border border-line bg-surface">
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
