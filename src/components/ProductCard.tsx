import { Box, Typography } from "@mui/material";
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
      {/* IMAGE TILE (taller) */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "3 / 4", // taller like GraphCommerce
          borderRadius: 0.5,
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

      {/* TEXT BELOW (NOT fused into image) */}
      <Box sx={{ pt: 1.5, textAlign: "center", px: 0.5 }}>
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: { xs: 16, md: 18 },
            lineHeight: 1.2,
          }}
          noWrap
        >
          {name}
        </Typography>

        {price != null && (
          <Typography sx={{ mt: 0.5, opacity: 0.8, fontSize: 14 }}>
            {formatPrice(price, currency)}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
