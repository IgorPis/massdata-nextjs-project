// src/pages/product/[sku].tsx
import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import StarRoundedIcon from "@mui/icons-material/StarRounded";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import NightsStayOutlinedIcon from "@mui/icons-material/NightsStayOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import { addToCart } from "@/lib/cart";
import { createApolloClient } from "@/lib/apolloClient";
import {
  CategoriesDocument,
  ProductBySkuDocument,
  ProductsByCategoryDocument,
} from "../../../graphql/generated";

import type { Category, ProductDetail, ProductImage } from "@/types/graphql";
import type { ProductsByCategoryQuery } from "../../../graphql/generated";

const stripHtml = (s?: string | null) =>
  (s ?? "").replace(/<[^>]*>/g, "").trim();

const formatMoney = (value?: number | null, currency?: string | null) => {
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

type UiOptionValue = { uid: string; label: string };
type UiOption = { uid: string; label: string; values: UiOptionValue[] };

export default function ProductPage({
  product,
}: {
  categories: Category[];
  product: ProductDetail | null;
}) {
  // Hooks must always run (no early return before hooks)
  const [qty, setQty] = useState(1);
  const [selected, setSelected] = useState<Record<string, string>>({});

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

  // Derived selection (no useEffect, avoids “setState in effect” warning)
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

  const allOptionsSelected = options.every((o) =>
    Boolean(resolvedSelected[o.uid])
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

  // Safe early return after hooks
  if (!product) return <div>Not found</div>;

  // gallery
  const rawGallery = product.media_gallery_entries ?? [];
  const galleryAll = (rawGallery as (ProductImage | null | undefined)[]).filter(
    (img): img is ProductImage => Boolean(img && img.file)
  );

  const gallery = galleryAll.slice(0, 3);

  const regularPrice =
    product.price_range?.minimum_price?.regular_price?.value ?? null;

  const finalPrice =
    product.price_range?.minimum_price?.final_price?.value ?? regularPrice;

  const currency =
    product.price_range?.minimum_price?.final_price?.currency ??
    product.price_range?.minimum_price?.regular_price?.currency ??
    "";

  const discounted =
    finalPrice != null && regularPrice != null && finalPrice < regularPrice;

  const asLowAs = formatMoney(finalPrice, currency);

  // rating_summary in Magento is usually 0..100 → convert to /5
  const ratingSummary = product.rating_summary ?? null;
  const rating5 =
    ratingSummary != null ? (ratingSummary / 20).toFixed(1) : null;
  const reviewCount = product.review_count ?? null;

  const shortDescText = stripHtml(product.short_description?.html);

  const mainCategory =
    (product.categories ?? []).find((c): c is NonNullable<typeof c> =>
      Boolean(c?.id && c?.name)
    ) ?? null;

  // const categoryText = (product.categories ?? [])
  //   .filter((c): c is NonNullable<typeof c> => Boolean(c?.name))
  //   .map((c) => c.name!)
  //   .join(", ");

  const imageBase = "https://backend.reachdigital.dev/media/catalog/product";

  return (
    <>
      <Head>
        <title>{`${product.name ?? "Product"} - Massdata Commerce®`}</title>
        <meta
          name="description"
          content={`Buy ${product.name ?? "this product"}. ${formatMoney(
            finalPrice,
            currency
          )}`}
          key="description"
        />
      </Head>

      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        {/* Top section: big image (left) + sticky buy box (right) */}
        <Box
          sx={{
            display: "grid",
            gap: { xs: 2, md: 4 },
            gridTemplateColumns: { xs: "1fr", md: "1.35fr 0.65fr" },
            alignItems: "start",
          }}
        >
          {/* LEFT: big white gallery */}
          <Paper
            sx={{
              p: { xs: 1.5, md: 2 },
              bgcolor: "#fff",
              color: "#000",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: { xs: 420, sm: 520, md: 720 },
                bgcolor: "#fff",
                borderRadius: 3,
                overflow: "hidden",
                "& .swiper-button-next, & .swiper-button-prev": {
                  color: "#111",
                  display: { xs: "none", md: "flex" },
                },
                "& .swiper-pagination-bullet": {
                  opacity: 0.35,
                },
                "& .swiper-pagination-bullet-active": {
                  opacity: 0.9,
                },
              }}
            >
              {gallery.length > 0 ? (
                <Swiper
                  spaceBetween={8}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  modules={[Navigation, Pagination]}
                  style={{ width: "100%", height: "100%" }}
                >
                  {gallery.map((entry, i) => {
                    const url = `${imageBase}${entry.file}`;
                    return (
                      <SwiperSlide key={entry.id ?? url}>
                        <Box
                          sx={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          <Image
                            src={url}
                            alt={entry.label ?? product.name ?? "Product image"}
                            fill
                            sizes="(max-width: 900px) 100vw, 65vw"
                            style={{ objectFit: "contain" }}
                            priority={i === 0}
                          />
                        </Box>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              ) : (
                <Box
                  sx={{
                    height: "100%",
                    display: "grid",
                    placeItems: "center",
                    color: "rgba(0,0,0,0.7)",
                  }}
                >
                  No image
                </Box>
              )}
            </Box>
          </Paper>

          {/* RIGHT: sticky buy box */}
          <Box
            sx={{
              position: { md: "sticky" },
              top: { md: 92 },
              alignSelf: "start",
            }}
          >
            <Paper
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 4,
                border: "1px solid rgba(255,255,255,0.08)",
                bgcolor: "rgba(17,17,17,0.92)",
              }}
            >
              <Stack spacing={1.5}>
                {/* Category chip */}
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
                  <Typography color="text.secondary">
                    {shortDescText}
                  </Typography>
                ) : null}

                {/* rating */}
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

                {/* options (only if configurable) */}
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
                            <Box
                              key={v.uid}
                              onClick={() =>
                                setSelected((s) => ({ ...s, [opt.uid]: v.uid }))
                              }
                              role="button"
                              tabIndex={0}
                              sx={{
                                p: 1.35,
                                borderRadius: 2,
                                border: "1px solid",
                                borderColor: active
                                  ? "rgba(255,255,255,0.30)"
                                  : "rgba(255,255,255,0.10)",
                                bgcolor: active
                                  ? "rgba(255,255,255,0.10)"
                                  : "rgba(255,255,255,0.06)",
                                cursor: "pointer",
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
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>
                  ))}

                <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

                {/* qty + price row */}
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
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
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
                      onClick={() => setQty((q) => q + 1)}
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

                {/* shipping card */}
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
                  disabled={
                    !product.sku || (options.length > 0 && !allOptionsSelected)
                  }
                  onClick={() =>
                    addToCart({
                      sku: product.sku ?? "",
                      name: product.name ?? "Product",
                      price: Number(finalPrice ?? regularPrice ?? 0),
                      qty,
                      options: selectedOptionsForCart,
                    })
                  }
                  sx={{
                    py: 1.4,
                    borderRadius: 999,
                    fontWeight: 900,
                  }}
                >
                  Add to Cart
                </Button>

                {/* benefits */}
                <Stack spacing={1} sx={{ pt: 1 }}>
                  {[
                    {
                      icon: <ReplayOutlinedIcon />,
                      text: "Free returns within 30 days",
                    },
                    {
                      icon: <BoltOutlinedIcon />,
                      text: "Dispatched by Massdata",
                    },
                    {
                      icon: <CheckCircleRoundedIcon />,
                      text: "Worldwide shipping",
                    },
                  ].map((b) => (
                    <Stack
                      key={b.text}
                      direction="row"
                      spacing={1}
                      alignItems="center"
                    >
                      <Box sx={{ opacity: 0.95 }}>{b.icon}</Box>
                      <Typography variant="body2" color="text.secondary">
                        {b.text}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Paper>
          </Box>
        </Box>

        {/* Description section */}
        <Box
          sx={{
            mt: { xs: 4, md: 7 },
            display: "grid",
            gap: { xs: 3, md: 6 },
            gridTemplateColumns: { xs: "1fr", md: "1.35fr 0.65fr" },
            alignItems: "start",
          }}
        >
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 2 }}>
              {product.name}
            </Typography>

            {product.description?.html ? (
              <Box
                sx={{
                  color: "rgba(255,255,255,0.88)",
                  fontSize: 18,
                  lineHeight: 1.7,
                  "& p": { margin: "0 0 14px" },
                  "& a": {
                    color: "inherit",
                    textDecorationColor: "rgba(255,255,255,0.35)",
                  },
                }}
                dangerouslySetInnerHTML={{ __html: product.description.html }}
              />
            ) : (
              <Typography color="text.secondary">
                No description available.
              </Typography>
            )}
          </Box>

          <Stack spacing={2} sx={{ pt: { md: 2 } }}>
            {[
              {
                icon: <LocalShippingOutlinedIcon />,
                title: "Free shipping",
                sub: "On eligible orders",
              },
              {
                icon: <ReplayOutlinedIcon />,
                title: "30 days return policy",
                sub: "Simple returns",
              },
              {
                icon: <BoltOutlinedIcon />,
                title: "Unlimited Next Day Delivery",
                sub: "Fast dispatch",
              },
              {
                icon: <NightsStayOutlinedIcon />,
                title: "Late night delivery",
                sub: "For those night owls",
              },
            ].map((item) => (
              <Stack
                key={item.title}
                direction="row"
                spacing={1.5}
                alignItems="center"
              >
                <Box sx={{ opacity: 0.9 }}>{item.icon}</Box>
                <Box>
                  <Typography sx={{ fontWeight: 800 }}>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.sub}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Box>

        {/* Specifications (GraphCommerce-style, no SKU) */}
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
            {/* SKU */}
            <Typography className="specLabel">SKU</Typography>
            <Typography className="specValue">{product.sku}</Typography>

            {/* Name */}
            <Typography className="specLabel">Name</Typography>
            <Typography className="specValue">{product.name}</Typography>

            {/* Type */}
            <Typography className="specLabel">Type</Typography>
            <Typography className="specValue">
              {product.__typename ?? ""}
            </Typography>

            {/* Category (each on new line) */}
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
      </Container>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const apollo = createApolloClient();

  const { data: catData } = await apollo.query({ query: CategoriesDocument });
  const root = catData?.categories?.items?.[0] ?? null;
  const children = (root?.children ?? []).filter(Boolean);

  const firstCatId = children[0]?.id;
  if (!firstCatId) return { paths: [], fallback: "blocking" };

  const { data: prodData } = await apollo.query({
    query: ProductsByCategoryDocument,
    variables: { categoryId: String(firstCatId), limit: 40 },
  });

  const items = (prodData?.products?.items ?? []) as NonNullable<
    NonNullable<ProductsByCategoryQuery["products"]>["items"]
  >;

  const paths = items
    .filter((p): p is NonNullable<typeof p> => Boolean(p?.sku))
    .map((p) => ({ params: { sku: String(p.sku) } }));

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const sku = String(ctx.params?.sku ?? "");
  const apollo = createApolloClient();

  const catRes = await apollo.query({ query: CategoriesDocument });
  const root = catRes.data?.categories?.items?.[0] ?? null;
  const categories = (root?.children ?? []).filter(Boolean);

  const prodRes = await apollo.query({
    query: ProductBySkuDocument,
    variables: { sku },
  });

  const product = prodRes.data?.products?.items?.[0] ?? null;

  if (!product) return { notFound: true, revalidate: 60 };

  return {
    props: { categories, product },
    revalidate: 60 * 60,
  };
};
