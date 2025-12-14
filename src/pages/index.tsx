import Head from "next/head";
import Link from "next/link";
import { Box, Button, Container, Typography } from "@mui/material";
import type { GetServerSideProps } from "next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import { createApolloClient } from "@/lib/apolloClient";
import ProductCard from "@/components/ProductCard";
import type { Category, ProductListItem } from "@/types/graphql";

import {
  CategoriesDocument,
  ProductsByCategoryDocument,
} from "../../graphql/generated";
import type { ProductsByCategoryQuery } from "../../graphql/generated";

const isVisibleTopCategory = (
  c: Category | null | undefined
): c is Category => {
  if (!c?.id || !c?.name) return false;
  const urlKey = (c.url_key ?? "").toLowerCase();
  const name = (c.name ?? "").toLowerCase();
  if (urlKey === "test-category") return false;
  if (name === "test category") return false;
  if (urlKey.startsWith("home-")) return false;
  if (name.startsWith("homepage ")) return false;
  if (urlKey === "example") return false;
  if (name === "examples") return false;
  return true;
};

export default function Home({
  categories,
  featuredProducts,
}: {
  categories: Category[];
  featuredProducts: ProductListItem[];
}) {
  const topCats = (categories ?? []).filter(isVisibleTopCategory);

  const primaryCatId =
    topCats.find((c) => (c.url_key ?? "") === "men")?.id ??
    topCats.find((c) => (c.url_key ?? "") === "women")?.id ??
    topCats[0]?.id ??
    null;

  return (
    <>
      <Head>
        <title>{`Homepage - Massdata Commerce®`}</title>
        <meta
          name="description"
          content="Demo commerce frontend built with Next.js, GraphQL and MUI"
          key="description"
        />
      </Head>

      {/* HERO */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          minHeight: { xs: 420, md: 560 },
          overflow: "hidden",
          borderRadius: { xs: 0, md: 4 },
          mb: { xs: 4, md: 6 },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url(/hero.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: "scale(1.02)",
            filter: "saturate(1.1) contrast(1.05)",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.18) 65%, rgba(0,0,0,0.05) 100%)",
          }}
        />

        <Container sx={{ position: "relative", py: { xs: 6, md: 10 } }}>
          <Typography
            variant="overline"
            sx={{ letterSpacing: 2, opacity: 0.85, color: "common.white" }}
          >
            A STEP INTO STYLE
          </Typography>

          <Typography
            component="h1"
            sx={{
              mt: 1,
              fontWeight: 900,
              lineHeight: 0.95,
              fontSize: { xs: 44, sm: 56, md: 72 },
              letterSpacing: "-0.02em",
              color: "common.white",
              maxWidth: 760,
            }}
          >
            DISCOVER COMFORT
            <br />
            BEYOND ORDINARY.
          </Typography>

          <Typography
            sx={{
              mt: 2,
              maxWidth: 560,
              color: "rgba(255,255,255,0.85)",
              fontSize: { xs: 14, sm: 16 },
            }}
          >
            Explore curated sock collections and standout designs. There’s a
            pair for everyone.
          </Typography>

          <Box sx={{ mt: 3, display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              color="inherit"
              component={Link}
              href={primaryCatId ? `/category/${primaryCatId}` : "/"}
            >
              Shop now
            </Button>

            <Button
              variant="outlined"
              color="inherit"
              component={Link}
              href={topCats[1]?.id ? `/category/${topCats[1].id}` : "/"}
              sx={{ borderColor: "rgba(255,255,255,0.6)" }}
            >
              Browse categories
            </Button>
          </Box>
        </Container>
      </Box>

      {/* FEATURED (carousel)*/}
      <Box
        sx={{
          bgcolor: "grey.900",
          color: "common.white",
          py: { xs: 5, md: 7 },
          borderTop: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          "& .swiper-button-next, & .swiper-button-prev": {
            color: "white",
          },
          "& .swiper-button-next:after, & .swiper-button-prev:after": {
            fontSize: 18,
            fontWeight: 700,
          },
        }}
      >
        <Container>
          <Typography
            variant="overline"
            sx={{ letterSpacing: 2, opacity: 0.8 }}
          >
            FEATURED
          </Typography>

          <Typography
            variant="h5"
            component="h2"
            sx={{ mt: 0.5, mb: 2, fontWeight: 800 }}
          >
            Trending products
          </Typography>

          {featuredProducts.length > 0 ? (
            <Swiper
              modules={[Navigation]}
              navigation
              spaceBetween={16}
              slidesPerView={1.15}
              breakpoints={{
                600: { slidesPerView: 2.2 },
                900: { slidesPerView: 4.2 },
              }}
            >
              {featuredProducts.map((p) => (
                <SwiperSlide key={p.sku ?? String(p.id)}>
                  <ProductCard product={p} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <Typography sx={{ opacity: 0.8 }}>
              No featured products available.
            </Typography>
          )}
        </Container>
      </Box>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=300, stale-while-revalidate=600"
  );

  const apollo = createApolloClient();

  const { data } = await apollo.query({ query: CategoriesDocument });
  const root = data?.categories?.items?.[0] ?? null;
  const categories = (root?.children ?? []).filter(Boolean) as Category[];

  const topCats = categories.filter(isVisibleTopCategory);
  const firstCatId = topCats[0]?.id;

  let featuredProducts: ProductListItem[] = [];

  if (firstCatId) {
    const { data: prodData } = await apollo.query({
      query: ProductsByCategoryDocument,
      variables: { categoryId: String(firstCatId), limit: 12 },
    });

    const rawItems = (prodData?.products?.items ?? []) as NonNullable<
      NonNullable<ProductsByCategoryQuery["products"]>["items"]
    >;

    featuredProducts = rawItems.filter((p): p is ProductListItem => Boolean(p));
  }

  return {
    props: {
      categories,
      featuredProducts,
    },
  };
};
