import Head from "next/head";
import Link from "next/link";
import { Box, Button, Container, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import { createApolloClient } from "@/lib/apolloClient";
import { CategoriesDocument } from "../../graphql/generated";
import type { Category, ProductListItem } from "@/types/graphql";
import { ProductsByCategoryDocument } from "../../graphql/generated";
import type { ProductsByCategoryQuery } from "../../graphql/generated";
import ProductCard from "@/components/ProductCard";

export default function Home({
  categories,
  featuredProducts,
}: {
  categories: Category[];
  featuredProducts: ProductListItem[];
}) {
  return (
    <>
      <Head>
        <title>Massdata Commerce</title>
        <meta
          name="description"
          content="Demo commerce frontend built with Next.js, GraphQL and MUI"
          key="description"
        />
      </Head>

      <Container sx={{ py: 3 }}>
        {/* Hero banner */}
        <Box
          sx={{
            borderRadius: 3,
            p: 3,
            minHeight: 220,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            bgcolor: "grey.200",
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            New arrivals
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Discover the latest styles from our women, men and kids collections.
          </Typography>
          <Button
            variant="contained"
            component={Link}
            href={categories[0]?.id ? `/category/${categories[0].id}` : "/"}
          >
            Shop now
          </Button>
        </Box>

        {/* Featured products "carousel" */}
        <Box>
          <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
            Featured products
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              overflowX: "auto",
              pb: 1,
              scrollSnapType: "x mandatory",
            }}
          >
            {featuredProducts.map((p) => (
              <Box
                key={p.sku ?? String(p.id)}
                sx={{
                  minWidth: 220,
                  flex: "0 0 auto",
                  scrollSnapAlign: "start",
                }}
              >
                <ProductCard product={p} />
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const apollo = createApolloClient();
  const { data } = await apollo.query({ query: CategoriesDocument });

  const root = data?.categories?.items?.[0] ?? null;
  const categories = (root?.children ?? []).filter(Boolean) as Category[];

  let featuredProducts: ProductListItem[] = [];
  const firstCatId = categories[0]?.id;

  if (firstCatId) {
    const { data: prodData } = await apollo.query({
      query: ProductsByCategoryDocument,
      variables: { categoryId: String(firstCatId), limit: 10 },
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
