import { Box, Stack, Typography } from "@mui/material";
import type { ProductDetail } from "@/types/graphql";

export default function ProductSpecifications({
  product,
}: {
  product: ProductDetail;
}) {
  return (
    <Box sx={{ mt: { xs: 4, md: 7 } }}>
      <Typography variant="h5" sx={{ fontWeight: 900, mb: 2 }}>
        Product Specifications
      </Typography>

      <Box
        sx={{
          display: "grid",
          rowGap: 2.25,
          gridTemplateColumns: { xs: "1fr", sm: "220px 1fr" },
          alignItems: "start",
          "& .specLabel": {
            color: "rgba(255,255,255,0.78)",
            fontWeight: 600,
          },
          "& .specValue": {
            color: "rgba(255,255,255,0.95)",
            fontWeight: 700,
          },
        }}
      >
        <Typography className="specLabel">SKU</Typography>
        <Typography className="specValue">{product.sku}</Typography>

        <Typography className="specLabel">Name</Typography>
        <Typography className="specValue">{product.name}</Typography>

        <Typography className="specLabel">Type</Typography>
        <Typography className="specValue">
          {product.__typename ?? ""}
        </Typography>

        <Typography className="specLabel">Category</Typography>
        <Stack spacing={0.75}>
          {(product.categories ?? [])
            .map((c) => c?.name)
            .filter((name): name is string => Boolean(name))
            .map((name, idx) => (
              <Typography key={`${name}-${idx}`} className="specValue">
                {name}
              </Typography>
            ))}
        </Stack>
      </Box>
    </Box>
  );
}
