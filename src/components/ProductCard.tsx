import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import type { ProductListItem } from "@/types/graphql";

export default function ProductCard({ product }: { product: ProductListItem }) {
  const sku = product?.sku ?? "";
  const name = product?.name ?? "Product";
  const img = product?.small_image?.url;

  const price = product?.price_range?.minimum_price?.regular_price?.value;
  const currency =
    product?.price_range?.minimum_price?.regular_price?.currency ?? "";

  return (
    <Card>
      <CardActionArea
        component={Link}
        href={sku ? `/product/${encodeURIComponent(sku)}` : "#"}
      >
        {img ? (
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "4 / 3",
            }}
          >
            <Image
              src={img}
              alt={product?.small_image?.label ?? name}
              fill
              sizes="(max-width: 600px) 50vw, 25vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        ) : null}

        <CardContent>
          <Typography variant="subtitle1" component="h3" noWrap>
            {name}
          </Typography>
          {price != null && (
            <Typography variant="body2" color="text.secondary">
              {price} {currency}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
