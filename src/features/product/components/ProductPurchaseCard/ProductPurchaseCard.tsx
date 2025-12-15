import Link from "next/link";
import {
  Box,
  Button,
  ButtonBase,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import StarRoundedIcon from "@mui/icons-material/StarRounded";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import type { Category, ProductDetail } from "@/types/graphql";
import type { UiOption } from "@/features/product/hooks/useConfigurableSelection";
import { formatMoney } from "@/features/product/utils/format";

export default function ProductPurchaseCard({
  product,
  mainCategory,
  asLowAs,
  shortDescText,
  rating5,
  reviewCount,
  options,
  resolvedSelected,
  onSelectOption,
  qty,
  onDecQty,
  onIncQty,
  discounted,
  regularPrice,
  finalPrice,
  currency,
  addDisabled,
  onAddToCart,
}: {
  product: ProductDetail;
  mainCategory: Category | null;

  asLowAs: string;
  shortDescText: string;

  rating5: string | null;
  reviewCount: number | null;

  options: UiOption[];
  resolvedSelected: Record<string, string>;
  onSelectOption: (optionUid: string, valueUid: string) => void;

  qty: number;
  onDecQty: () => void;
  onIncQty: () => void;

  discounted: boolean;
  regularPrice: number | null;
  finalPrice: number | null;
  currency: string;

  addDisabled: boolean;
  onAddToCart: () => void;
}) {
  return (
    <Paper
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 4,
        border: "1px solid rgba(255,255,255,0.08)",
        bgcolor: "rgba(17,17,17,0.92)",
      }}
    >
      <Stack spacing={1.5}>
        {mainCategory?.id && mainCategory?.name && (
          <Box>
            <Chip
              component={Link}
              href={`/category/${mainCategory.id}`}
              clickable
              label={mainCategory.name}
              sx={{
                bgcolor: "rgba(255,255,255,0.08)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
              }}
            />
          </Box>
        )}

        <Typography variant="body2" color="text.secondary">
          {asLowAs ? `As low as ${asLowAs}` : ""}
        </Typography>

        <Typography
          variant="h3"
          component="h1"
          sx={{ lineHeight: 1.05, fontWeight: 800 }}
        >
          {product.name}
        </Typography>

        {shortDescText ? (
          <Typography color="text.secondary">{shortDescText}</Typography>
        ) : null}

        {rating5 ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                px: 1.1,
                py: 0.6,
                borderRadius: 999,
                bgcolor: "rgba(255,255,255,0.08)",
              }}
            >
              <StarRoundedIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {rating5}/5
              </Typography>
            </Box>

            {typeof reviewCount === "number" ? (
              <Typography variant="body2" color="text.secondary">
                ({reviewCount})
              </Typography>
            ) : null}
          </Box>
        ) : null}

        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

        {options.length > 0 &&
          options.map((opt) => (
            <Box key={opt.uid}>
              <Typography
                variant="overline"
                sx={{ letterSpacing: 1, color: "text.secondary" }}
              >
                {opt.label}
              </Typography>

              <Box
                sx={{
                  mt: 1,
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 1.25,
                }}
              >
                {opt.values.map((v) => {
                  const active = resolvedSelected[opt.uid] === v.uid;

                  return (
                    <ButtonBase
                      key={v.uid}
                      onClick={() => onSelectOption(opt.uid, v.uid)}
                      focusRipple
                      sx={{
                        width: "100%",
                        textAlign: "left",
                        p: 1.35,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: active
                          ? "rgba(255,255,255,0.30)"
                          : "rgba(255,255,255,0.10)",
                        bgcolor: active
                          ? "rgba(255,255,255,0.10)"
                          : "rgba(255,255,255,0.06)",
                        userSelect: "none",
                        transition:
                          "transform 120ms ease, background 120ms ease",
                        "&:hover": {
                          transform: "translateY(-1px)",
                          bgcolor: "rgba(255,255,255,0.10)",
                        },
                      }}
                    >
                      <Typography sx={{ fontWeight: 800 }}>
                        {v.label}
                      </Typography>
                    </ButtonBase>
                  );
                })}
              </Box>
            </Box>
          ))}

        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.12)",
              bgcolor: "rgba(255,255,255,0.06)",
              px: 1,
              py: 0.6,
            }}
          >
            <Button
              variant="text"
              onClick={onDecQty}
              sx={{ minWidth: 36, borderRadius: 999 }}
            >
              –
            </Button>
            <Typography
              sx={{ width: 22, textAlign: "center", fontWeight: 700 }}
            >
              {qty}
            </Typography>
            <Button
              variant="text"
              onClick={onIncQty}
              sx={{ minWidth: 36, borderRadius: 999 }}
            >
              +
            </Button>
          </Box>

          <Box sx={{ flex: 1, textAlign: "right" }}>
            {discounted ? (
              <Stack
                direction="row"
                spacing={1}
                justifyContent="flex-end"
                alignItems="baseline"
              >
                <Typography
                  sx={{
                    color: "text.secondary",
                    textDecoration: "line-through",
                    fontWeight: 600,
                  }}
                >
                  {formatMoney(regularPrice, currency)}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>
                  {formatMoney(finalPrice, currency)}
                </Typography>
              </Stack>
            ) : (
              <Typography variant="h5" sx={{ fontWeight: 900 }}>
                {formatMoney(finalPrice, currency) || "No price"}
              </Typography>
            )}
          </Box>
        </Box>

        <Paper
          sx={{
            p: 1.5,
            borderRadius: 3,
            bgcolor: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <Stack direction="row" spacing={1.25} alignItems="center">
            <LocalShippingOutlinedIcon sx={{ opacity: 0.9 }} />
            <Box>
              <Typography sx={{ fontWeight: 800 }}>
                Order before 22:00
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Next day delivery · Shipping free
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Button
          size="large"
          variant="contained"
          disabled={addDisabled}
          onClick={onAddToCart}
          sx={{ py: 1.4, borderRadius: 999, fontWeight: 900 }}
        >
          Add to Cart
        </Button>

        <Stack spacing={1} sx={{ pt: 1 }}>
          {[
            {
              icon: <ReplayOutlinedIcon />,
              text: "Free returns within 30 days",
            },
            { icon: <BoltOutlinedIcon />, text: "Dispatched by Massdata" },
            { icon: <CheckCircleRoundedIcon />, text: "Worldwide shipping" },
          ].map((b) => (
            <Stack key={b.text} direction="row" spacing={1} alignItems="center">
              <Box sx={{ opacity: 0.95 }}>{b.icon}</Box>
              <Typography variant="body2" color="text.secondary">
                {b.text}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}
