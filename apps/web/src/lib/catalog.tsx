import type { CatalogModel, CatalogProvider, Provider } from "@ga/proto/admin/v1/admin_pb";
import { useQuery } from "@tanstack/react-query";

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

/** ModelOptions offers a vendor's models to a model field, which still takes any other name. */
export function ModelOptions({ id, models }: { id: string; models: readonly CatalogModel[] }) {
  return (
    <datalist id={id}>
      {models.map((m) => (
        <option key={m.id} value={m.id}>
          {m.name}
        </option>
      ))}
    </datalist>
  );
}
