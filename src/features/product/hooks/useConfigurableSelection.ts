import { useMemo } from "react";
import type { ProductDetail } from "@/types/graphql";

export type UiOptionValue = { uid: string; label: string };
export type UiOption = { uid: string; label: string; values: UiOptionValue[] };

export function useConfigurableSelection(
  product: ProductDetail | null,
  selected: Record<string, string>
) {
  const options: UiOption[] = useMemo(() => {
    if (!product || product.__typename !== "ConfigurableProduct") return [];

    const cfg = (product.configurable_options ?? []).filter(
      (o): o is NonNullable<typeof o> => Boolean(o?.uid && o?.label)
    );

    return cfg
      .map((o) => ({
        uid: o.uid!,
        label: o.label ?? "Option",
        values: (o.values ?? [])
          .filter((v): v is NonNullable<typeof v> =>
            Boolean(v?.uid && v?.label)
          )
          .map((v) => ({ uid: v.uid!, label: v.label! })),
      }))
      .filter((o) => o.values.length > 0);
  }, [product]);

  const resolvedSelected = useMemo(() => {
    if (options.length === 0) return selected;

    const next = { ...selected };
    for (const opt of options) {
      if (!next[opt.uid]) {
        const first = opt.values[0]?.uid;
        if (first) next[opt.uid] = first;
      }
    }
    return next;
  }, [options, selected]);

  const allOptionsSelected = useMemo(
    () => options.every((o) => Boolean(resolvedSelected[o.uid])),
    [options, resolvedSelected]
  );

  const selectedOptionsForCart = useMemo(() => {
    const out: Record<string, string> = {};
    for (const opt of options) {
      const valUid = resolvedSelected[opt.uid];
      const val = opt.values.find((v) => v.uid === valUid);
      if (val?.label) out[opt.label] = val.label;
    }
    return out;
  }, [options, resolvedSelected]);

  return {
    options,
    resolvedSelected,
    allOptionsSelected,
    selectedOptionsForCart,
  };
}
