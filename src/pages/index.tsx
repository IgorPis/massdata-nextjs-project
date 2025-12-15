import Head from "next/head";
import type { GetServerSideProps } from "next";
import { createApolloClient } from "@/lib/apolloClient";
import ProductCard from "@/features/product/components/ProductCard/ProductCard";
import Hero from "@/components/home/Hero";
import FeaturedCarousel from "@/components/home/FeaturedCarousel";
import type { Category, ProductListItem } from "@/types/graphql";
import {
  CategoriesDocument,
  ProductsByCategoryDocument,
} from "../../graphql/generated";
import type { ProductsByCategoryQuery } from "../../graphql/generated";
import { isVisibleCategory } from "@/components/layout/Header/categoryUtils";

export default function Home({
  categories,
  featuredProducts,
}: {
  categories: Category[];
  featuredProducts: ProductListItem[];
}) {
  const topCats = (categories ?? []).filter(isVisibleCategory);

  const primaryCatId =
    topCats.find((c) => (c.url_key ?? "").toLowerCase() === "men")?.id ??
    topCats.find((c) => (c.url_key ?? "").toLowerCase() === "women")?.id ??
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

      <Hero
        imageSrc="/hero.webp"
        overline="A STEP INTO STYLE"
        title={
          <>
            DISCOVER COMFORT
            <br />
            BEYOND ORDINARY.
          </>
        }
        description={
          <>
            Explore curated sock collections and standout designs. There’s a
            pair for everyone.
          </>
        }
        primaryAction={{
          label: "Shop now",
          href: primaryCatId ? `/category/${primaryCatId}` : "/",
          variant: "contained",
        }}
        secondaryAction={{
          label: "Browse categories",
          href: topCats[1]?.id ? `/category/${topCats[1].id}` : "/",
          variant: "outlined",
        }}
      />

      <FeaturedCarousel<ProductListItem>
        title="Trending products"
        items={featuredProducts}
        getKey={(p) => p.sku ?? String(p.id)}
        renderSlide={(p) => <ProductCard product={p} />}
        emptyText="No featured products available."
      />
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

  const topCats = categories.filter(isVisibleCategory);
  const firstCatId = topCats[0]?.id;

  let featuredProducts: ProductListItem[] = [];

  if (firstCatId) {
    const { data: prodData } = await apollo.query({
      query: ProductsByCategoryDocument,
      variables: { categoryId: String(firstCatId), limit: 7 },
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
