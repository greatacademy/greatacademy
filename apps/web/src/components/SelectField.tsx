import { Select } from "@base-ui/react/select";
import { CaretDown, Check } from "@phosphor-icons/react";
import { useId } from "react";

import { field } from "./AuthForm.tsx";
import { menuItem, menuPopup } from "./ui.tsx";

/** Chevron is the arrow at the right of a field that opens a list, the same on every such field and on the language. */
export function Chevron() {
  return (
    <span aria-hidden className="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 text-muted">
      <CaretDown size={12} weight="bold" />
    </span>
  );
}

/** SelectOption is one choice of a `SelectField`: the value sent with the form and the words shown. */
export interface SelectOption {
  readonly value: string;
  readonly label: string;
}

/**
 * SelectField picks one value from a list that opens below the field, styled like the language menu, and sends it
 * with its form under `name`. With `placeholder` it starts empty; `required` keeps the form from being sent so.
 */
export function SelectField(props: {
  label: string;
  name: string;
  options: readonly SelectOption[];
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="space-y-1.5 text-sm font-medium">
      <label htmlFor={id} className="block">
        {props.label}
      </label>
      <Select.Root
        modal={false}
        id={id}
        name={props.name}
        required={props.required}
        disabled={props.disabled}
        items={props.options}
        defaultValue={props.defaultValue ?? null}
      >
        <Select.Trigger className={`${field} relative cursor-default pr-8 text-left font-normal data-[disabled]:opacity-60`}>
          <Select.Value placeholder={props.placeholder} className={(state) => (state.placeholder ? "text-muted" : "")} />
          <Chevron />
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner alignItemWithTrigger={false} side="bottom" align="start" sideOffset={4} className="z-30">
            <Select.Popup className={`${menuPopup} !max-h-72 w-[var(--anchor-width)]`}>
              {props.options.map((o) => (
                <Select.Item key={o.value} value={o.value} className={menuItem}>
                  <Select.ItemText>{o.label}</Select.ItemText>
                  <Select.ItemIndicator className="flex text-accent">
                    <Check size={14} weight="bold" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
