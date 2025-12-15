import Head from "next/head";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps } from "next";
import { Box, Container, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import ProductCard from "@/features/product/components/ProductCard/ProductCard";
import { createApolloClient } from "@/lib/apolloClient";
import {
  CategoriesDocument,
  ProductsByCategoryDocument,
} from "../../../graphql/generated";
import type { Category, ProductListItem } from "@/types/graphql";

type CategoryNode = Category & {
  description?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  children?: Array<CategoryNode | null> | null;
};

const stripHtml = (s?: string | null) =>
  (s ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function findContextById(cats: CategoryNode[], id: string) {
  for (const top of cats) {
    if (!top?.id) continue;

    const siblings =
      ((top.children ?? []).filter(Boolean) as CategoryNode[]) ?? [];

    if (String(top.id) === id) {
      return { current: top, siblings, parentName: top.name ?? null };
    }

    const hit = siblings.find((c) => String(c?.id) === id);
    if (hit) {
      return { current: hit, siblings, parentName: top.name ?? null };
    }
  }

  return {
    current: null as CategoryNode | null,
    siblings: [] as CategoryNode[],
    parentName: null as string | null,
  };
}

export default function CategoryPage({
  categories,
  products,
  categoryId,
}: {
  categories: CategoryNode[];
  products: ProductListItem[];
  categoryId: string;
}) {
  const { current, siblings, parentName } = findContextById(
    categories,
    categoryId
  );

  const categoryName = current?.name ?? `Category ${categoryId}`;
  const description = stripHtml(current?.description);

  const metaTitle = (current?.meta_title ?? "").trim();
  const metaDesc = stripHtml(current?.meta_description).trim();

  const fallbackTitle = `Shop cool ${categoryName} Socks for ${(
    parentName ?? categoryName
  ).toLowerCase()}`;

  const title = `${metaTitle || fallbackTitle} - Massdata Commerce®`;
  const headDescription =
    metaDesc || description || `Browse products in ${categoryName}.`;

  return (
    <>
      <Head>
        <title key="title">{title}</title>
        <meta name="description" content={headDescription} key="description" />
      </Head>

      <Container maxWidth="xl" sx={{ pt: { xs: 5, md: 7 }, pb: 4 }}>
        <Box sx={{ textAlign: "center", px: 1 }}>
          <Typography
            component="h1"
            sx={{
              fontWeight: 900,
              letterSpacing: "-0.04em",
              fontSize: { xs: 40, sm: 56, md: 72 },
              lineHeight: 1.05,
            }}
          >
            {categoryName}
          </Typography>

          {description ? (
            <Typography
              sx={{
                mt: 2,
                mx: "auto",
                maxWidth: 860,
                opacity: 0.85,
                fontSize: { xs: 15, sm: 16, md: 17 },
                lineHeight: 1.8,
              }}
            >
              {description}
            </Typography>
          ) : null}

          {siblings.length > 0 ? (
            <Stack
              direction="row"
              justifyContent="center"
              sx={{
                mt: 3,
                flexWrap: "wrap",
                rowGap: 1.25,
                columnGap: { xs: 2, sm: 3 },
              }}
            >
              {siblings.map((c) => {
                const active = String(c.id) === categoryId;
                return (
                  <Box
                    key={String(c.id)}
                    component={Link}
                    href={`/category/${c.id}`}
                    sx={{
                      textDecoration: active ? "underline" : "none",
                      textUnderlineOffset: "6px",
                      color: active ? "common.white" : "rgba(255,255,255,0.85)",
                      fontWeight: 700,
                      fontSize: { xs: 14, sm: 16 },
                      "&:hover": {
                        color: "common.white",
                        textDecoration: "underline",
                        textUnderlineOffset: "6px",
                      },
                    }}
                  >
                    {c.name}
                  </Box>
                );
              })}
            </Stack>
          ) : null}
        </Box>

        <Box
          sx={{
            mt: 5,
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            opacity: 0.6,
          }}
        >
          <Box
            sx={{
              height: 1,
              bgcolor: "rgba(255,255,255,0.14)",
              width: { xs: 80, sm: 200, md: 260 },
            }}
          />
          <Typography variant="body2">{products.length} products</Typography>
          <Box
            sx={{
              height: 1,
              bgcolor: "rgba(255,255,255,0.14)",
              width: { xs: 80, sm: 200, md: 260 },
            }}
          />
        </Box>

        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {products.map((p) => (
            <Grid key={p.sku ?? String(p.id)} size={{ xs: 6, sm: 4, md: 3 }}>
              <ProductCard product={p} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const apollo = createApolloClient();
  const { data } = await apollo.query({ query: CategoriesDocument });

  const root = data?.categories?.items?.[0] ?? null;
  const top = ((root?.children ?? []).filter(Boolean) as CategoryNode[]) ?? [];

  const childCats = top.flatMap(
    (t) => ((t.children ?? []).filter(Boolean) as CategoryNode[]) ?? []
  );

  const paths = childCats
    .filter((c) => Boolean(c?.id))
    .slice(0, 24)
    .map((c) => ({ params: { id: String(c.id) } }));

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const id = String(ctx.params?.id ?? "");
  const apollo = createApolloClient();

  const catRes = await apollo.query({ query: CategoriesDocument });
  const root = catRes.data?.categories?.items?.[0] ?? null;
  const categories =
    ((root?.children ?? []).filter(Boolean) as CategoryNode[]) ?? [];

  const prodRes = await apollo.query({
    query: ProductsByCategoryDocument,
    variables: { categoryId: id, limit: 24 },
  });

  const products = prodRes.data?.products?.items ?? [];

  return {
    props: { categories, products, categoryId: id },
    revalidate: 60 * 60,
  };
};
