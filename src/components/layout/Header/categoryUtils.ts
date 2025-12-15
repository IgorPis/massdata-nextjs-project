import type { Category } from "@/types/graphql";

const HIDDEN_CATEGORY_URL_KEYS = new Set(["test-category", "example"]);
const HIDDEN_CATEGORY_NAMES = new Set(["Test Category", "Examples"]);

const HIDDEN_URLKEY_PREFIXES = ["home-"];
const HIDDEN_NAME_PREFIXES = ["homepage "];

export const isVisibleCategory = (
  c: Category | null | undefined
): c is Category => {
  if (!c?.id || !c?.name) return false;

  const urlKey = (c.url_key ?? "").toLowerCase();
  const nameLower = (c.name ?? "").toLowerCase();

  if (HIDDEN_CATEGORY_URL_KEYS.has(urlKey)) return false;
  if (HIDDEN_CATEGORY_NAMES.has(c.name ?? "")) return false;

  if (HIDDEN_URLKEY_PREFIXES.some((p) => urlKey.startsWith(p))) return false;
  if (HIDDEN_NAME_PREFIXES.some((p) => nameLower.startsWith(p))) return false;

  return true;
};

export const isSaleCategory = (cat: Category) => {
  const name = (cat.name ?? "").toLowerCase();
  const urlKey = (cat.url_key ?? "").toLowerCase();
  return name === "sale" || urlKey === "sale";
};
