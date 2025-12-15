export const stripHtml = (s?: string | null) =>
  (s ?? "").replace(/<[^>]*>/g, "").trim();

export const formatMoney = (
  value?: number | null,
  currency?: string | null
) => {
  if (value == null) return "";
  const cur = currency ?? "USD";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: cur,
    }).format(value);
  } catch {
    return `${value} ${cur}`;
  }
};
