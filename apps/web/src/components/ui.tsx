import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-white shadow-sm hover:brightness-110 disabled:opacity-50",
  secondary: "border border-line bg-surface text-ink hover:bg-page disabled:opacity-50",
  ghost: "text-muted hover:bg-accent-soft hover:text-ink disabled:opacity-50",
};

/** buttonClass styles a button or a link as a button. */
export function buttonClass(variant: Variant = "primary", extra = "") {
  return `inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed ${variants[variant]} ${extra}`;
}

export function Button({ variant = "primary", className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type="button" className={buttonClass(variant, className)} {...props} />;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-line bg-surface p-6 shadow-[0_1px_2px_oklch(0_0_0/0.04)] ${className}`}>{children}</div>
  );
}

export function Spinner({ label }: { label: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-16 text-muted">
      <span className="size-5 animate-spin rounded-full border-2 border-line border-t-accent" />
      {label}
    </div>
  );
}

export function ErrorNote({ message, onRetry, retry }: { message: string; onRetry?: () => void; retry?: string }) {
  return (
    <div role="alert" className="rounded-xl border border-bad/30 bg-bad-soft px-4 py-3 text-sm text-bad">
      {message}
      {onRetry && (
        <button type="button" className="ml-3 font-medium underline" onClick={onRetry}>
          {retry}
        </button>
      )}
    </div>
  );
}

/** Bar is a thin progress bar from 0 to 1. */
export function Bar({ value, className = "bg-accent" }: { value: number; className?: string }) {
  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full bg-line"
      role="progressbar"
      aria-valuenow={Math.round(value * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={`h-full rounded-full transition-all ${className}`} style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }} />
    </div>
  );
}
