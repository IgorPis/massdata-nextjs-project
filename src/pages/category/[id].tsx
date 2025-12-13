import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import { Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import ProductCard from "@/components/ProductCard";
import { createApolloClient } from "@/lib/apolloClient";
import {
  CategoriesDocument,
  ProductsByCategoryDocument,
} from "../../../graphql/generated";
import type { Category } from "@/types/graphql";
import type { ProductListItem } from "@/types/graphql";

const findCategoryNameById = (cats: Category[], id: string): string | null => {
  for (const c of cats) {
    if (String(c.id) === id) return c.name ?? null;

    const kids = (c.children ?? []).filter((x): x is NonNullable<typeof x> =>
      Boolean(x)
    );

    const hit = findCategoryNameById(kids, id);
    if (hit) return hit;
  }
  return null;
};

export default function CategoryPage({
  categories,
  products,
  categoryId,
}: {
  categories: Category[];
  products: ProductListItem[];
  categoryId: string;
}) {
  const categoryName =
    findCategoryNameById(categories, categoryId) ?? `Category ${categoryId}`;

  return (
    <>
      <Head>
        <title>{`${categoryName} — Massdata`}</title>
        <meta
          name="description"
          content={`Browse products in ${categoryName}.`}
          key="description"
        />
      </Head>

      <Container sx={{ py: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {categoryName}
        </Typography>

        <Grid container spacing={2}>
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
  const items = (root?.children ?? []).filter(Boolean) as Category[];

  const paths = items
    .filter((c): c is Category => Boolean(c?.id))
    .slice(0, 8)
    .map((c) => ({ params: { id: String(c.id) } }));

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const id = String(ctx.params?.id ?? "");
  const apollo = createApolloClient();

  const catRes = await apollo.query({ query: CategoriesDocument });
  const root = catRes.data?.categories?.items?.[0] ?? null;
  const categories = (root?.children ?? []).filter(Boolean);

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
