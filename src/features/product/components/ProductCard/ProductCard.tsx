import { Box, Typography, Rating } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import type { ProductListItem } from "@/types/graphql";

function formatPrice(value?: number | null, currency?: string | null) {
  if (value == null) return "";
  if (currency === "USD" || !currency) return `$${value.toFixed(2)}`;
  return `${currency} ${value.toFixed(2)}`;
}

export default function ProductCard({ product }: { product: ProductListItem }) {
  const sku = product?.sku ?? "";
  const name = product?.name ?? "Product";
  const img = product?.small_image?.url;

  const price =
    product?.price_range?.minimum_price?.regular_price?.value ?? null;
  const currency =
    product?.price_range?.minimum_price?.regular_price?.currency ?? "USD";

  const ratingSummary = product?.rating_summary ?? 0;
  const reviewCount = product?.review_count ?? 0;

  const stars = Math.max(0, Math.min(5, ratingSummary / 20));

  const href = sku ? `/product/${encodeURIComponent(sku)}` : "#";

  return (
    <Box
      component={Link}
      href={href}
      sx={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
        width: "100%",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "1 / 1",
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "#fff",
          boxShadow: "0 14px 40px rgba(0,0,0,0.35)",
        }}
      >
        {img ? (
          <Image
            src={img}
            alt={product?.small_image?.label ?? name}
            fill
            sizes="(max-width: 600px) 70vw, 25vw"
            style={{ objectFit: "cover" }}
          />
        ) : null}
      </Box>

      <Box sx={{ pt: 1.25 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <Rating
            size="small"
            precision={0.5}
            value={stars}
            readOnly
            sx={{
              "& .MuiRating-iconFilled": { color: "#f6c444" },
              "& .MuiRating-iconEmpty": { color: "rgba(255,255,255,0.22)" },
            }}
          />

          {reviewCount > 0 ? (
            <Typography sx={{ fontSize: 12, opacity: 0.65 }}>
              ({reviewCount})
            </Typography>
          ) : null}
        </Box>

        <Box
          sx={{
            mt: 0.75,
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Typography
            sx={{ fontWeight: 800, fontSize: { xs: 14, sm: 15, md: 16 } }}
            noWrap
          >
            {name}
          </Typography>

          {price != null ? (
            <Typography
              sx={{ fontWeight: 800, fontSize: { xs: 14, sm: 15, md: 16 } }}
              noWrap
            >
              {formatPrice(price, currency)}
            </Typography>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}
