import type { CatalogModel, CatalogProvider, Provider } from "@ga/proto/admin/v1/admin_pb";
import { useQuery } from "@tanstack/react-query";
import { useId, useState } from "react";

import { field } from "../components/AuthForm.tsx";
import { SelectField } from "../components/SelectField.tsx";

import { admin } from "./rpc.ts";

/** useCatalog reads the named vendors of pi-ai's catalog once per visit; they change only with a new release. */
export function useCatalog() {
  return useQuery({ queryKey: ["catalog"], queryFn: () => admin.listCatalog({}), staleTime: Number.POSITIVE_INFINITY });
}

/** catalogModels are the catalog's models of a configured vendor, empty for one set up by hand. */
export function catalogModels(
  catalog: readonly CatalogProvider[] | undefined,
  providers: readonly Provider[],
  providerId: string,
): readonly CatalogModel[] {
  const id = providers.find((p) => p.id === providerId)?.catalog;
  return (id && catalog?.find((c) => c.id === id)?.models) || [];
}

/** useRouteChoices reads what a route may name: the criteria of the subjects, the prompt versions and the speech languages. */
export function useRouteChoices() {
  return useQuery({ queryKey: ["admin", "route-choices"], queryFn: () => admin.listRouteChoices({}), staleTime: 0 });
}

/** OTHER_MODEL is the choice that opens a field for a model the catalog does not list. */
const OTHER_MODEL = "__other";

/**
 * ModelField picks a vendor's model from the catalog, sending it as `model`; "another model" opens a field for a name the
 * catalog does not list. A vendor set up by hand has no list, so its field takes the name alone. Give it a `key` of the
 * vendor so that a new vendor starts it afresh.
 */
export function ModelField(props: {
  label: string;
  otherLabel: string;
  placeholder: string;
  models: readonly CatalogModel[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}) {
  const { models, value, onChange, disabled } = props;
  const [other, setOther] = useState(value !== "" && !models.some((m) => m.id === value));
  const id = useId();
  const input = (
    <input
      id={id}
      name="model"
      required
      value={value}
      onChange={(e) => onChange(e.target.value)}
      readOnly={disabled}
      aria-label={props.label}
      autoComplete="off"
      className={field}
    />
  );
  if (models.length === 0)
    return (
      <div className="space-y-1.5 text-sm font-medium">
        <label htmlFor={id} className="block">
          {props.label}
        </label>
        {input}
      </div>
    );
  return (
    <div className="space-y-1.5">
      <SelectField
        label={props.label}
        name="model-choice"
        required
        disabled={disabled}
        placeholder={props.placeholder}
        defaultValue={other ? OTHER_MODEL : value || undefined}
        options={[
          ...models.map((m) => ({ value: m.id, label: m.name && m.name !== m.id ? `${m.name} · ${m.id}` : m.id })),
          { value: OTHER_MODEL, label: props.otherLabel },
        ]}
        onValueChange={(v) => {
          setOther(v === OTHER_MODEL);
          onChange(v === OTHER_MODEL ? "" : v);
        }}
      />
      {other ? input : <input type="hidden" name="model" value={value} />}
    </div>
  );
}
