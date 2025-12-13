import { makeVar } from "@apollo/client";

export type CartItem = {
  sku: string;
  name: string;
  price: number;
  qty: number;
  options?: Record<string, string>;
};

export const cartVar = makeVar<CartItem[]>([]);

export const addToCart = (item: CartItem) => {
  const cur = cartVar();

  const sameOptions = (
    a?: Record<string, string>,
    b?: Record<string, string>
  ) => {
    if (!a && !b) return true;
    if (!a || !b) return false;

    const aKeys = Object.keys(a).sort();
    const bKeys = Object.keys(b).sort();
    if (aKeys.length !== bKeys.length) return false;

    return aKeys.every((k, i) => k === bKeys[i] && a[k] === b[k]);
  };

  const idx = cur.findIndex(
    (x) => x.sku === item.sku && sameOptions(x.options, item.options)
  );

  if (idx >= 0) {
    const updated = [...cur];
    updated[idx] = { ...updated[idx], qty: updated[idx].qty + item.qty };
    cartVar(updated);
  } else {
    cartVar([...cur, item]);
  }
};
