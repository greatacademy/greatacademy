import { ArrowDown, ArrowUp } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

import { useI18n } from "../lib/i18n.tsx";
import { Markdown } from "./Markdown.tsx";
import { buttonClass } from "./ui.tsx";

/**
 * OrderField lets a learner put items in order with buttons, which work the same with a mouse, a finger and a keyboard.
 * The list as first shown counts as an answer too, since leaving it as it is can be the right order.
 */
export function OrderField({ items, onChange, disabled }: { items: readonly string[]; onChange(value: string): void; disabled?: boolean }) {
  const { m } = useI18n();
  const [order, setOrder] = useState(() => items.map((_, i) => i));
  useEffect(() => onChange(order.join(",")), [order, onChange]);
  const move = (at: number, by: number) =>
    setOrder((current) => {
      const next = [...current];
      [next[at], next[at + by]] = [next[at + by]!, next[at]!];
      return next;
    });
  return (
    <ol className="space-y-2">
      {order.map((item, at) => (
        <li key={item} className="flex items-center gap-2 rounded-xl border-2 border-line bg-surface px-3 py-2">
          <span className="w-5 shrink-0 text-sm font-medium text-muted">{at + 1}</span>
          <Markdown source={items[item] ?? ""} inline className="min-w-0 flex-1" />
          {!disabled && (
            <span className="flex shrink-0 gap-1">
              <button
                type="button"
                aria-label={m.moveUp}
                disabled={at === 0}
                onClick={() => move(at, -1)}
                className={buttonClass("ghost", "!p-2")}
              >
                <ArrowUp size={16} />
              </button>
              <button
                type="button"
                aria-label={m.moveDown}
                disabled={at === order.length - 1}
                onClick={() => move(at, 1)}
                className={buttonClass("ghost", "!p-2")}
              >
                <ArrowDown size={16} />
              </button>
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
