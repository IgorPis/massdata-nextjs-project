import { useState } from "react";
import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import { Box, Container } from "@mui/material";

import { addToCart } from "@/state/cart/cartState";
import { createApolloClient } from "@/lib/apolloClient";
import {
  CategoriesDocument,
  ProductBySkuDocument,
  ProductsByCategoryDocument,
} from "../../../graphql/generated";

import type { Category, ProductDetail, ProductImage } from "@/types/graphql";
import type { ProductsByCategoryQuery } from "../../../graphql/generated";

import { formatMoney, stripHtml } from "@/features/product/utils/format";
import { useConfigurableSelection } from "@/features/product/hooks/useConfigurableSelection";

import ProductGallery from "@/features/product/components/ProductGallery/ProductGallery";
import ProductPurchaseCard from "@/features/product/components/ProductPurchaseCard/ProductPurchaseCard";
import ProductDescription from "@/features/product/components/ProductDescription/ProductDescription";
import ProductHighlights from "@/features/product/components/ProductHighlights/ProductHighlights";
import ProductSpecifications from "@/features/product/components/ProductSpecifications/ProductSpecifications";

export default function ProductPage({
  product,
}: {
  categories: Category[];
  product: ProductDetail | null;
}) {
  const [qty, setQty] = useState(1);
  const [selected, setSelected] = useState<Record<string, string>>({});

  const {
    options,
    resolvedSelected,
    allOptionsSelected,
    selectedOptionsForCart,
  } = useConfigurableSelection(product, selected);

  if (!product) return <div>Not found</div>;

  const addDisabled =
    !product.sku || (options.length > 0 && !allOptionsSelected);

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

  const ratingSummary = product.rating_summary ?? null;
  const rating5 =
    ratingSummary != null ? (ratingSummary / 20).toFixed(1) : null;
  const reviewCount = product.review_count ?? null;

  const shortDescText = stripHtml(product.short_description?.html);

  const mainCategory =
    (product.categories ?? []).find((c): c is NonNullable<typeof c> =>
      Boolean(c?.id && c?.name)
    ) ?? null;

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
        <Box
          sx={{
            display: "grid",
            gap: { xs: 2, md: 4 },
            gridTemplateColumns: { xs: "1fr", md: "1.35fr 0.65fr" },
            alignItems: "start",
          }}
        >
          <ProductGallery
            gallery={gallery}
            imageBase={imageBase}
            productName={product.name}
          />

          <Box
            sx={{
              position: { md: "sticky" },
              top: { md: 92 },
              alignSelf: "start",
            }}
          >
            <ProductPurchaseCard
              product={product}
              mainCategory={mainCategory}
              asLowAs={asLowAs}
              shortDescText={shortDescText}
              rating5={rating5}
              reviewCount={reviewCount}
              options={options}
              resolvedSelected={resolvedSelected}
              onSelectOption={(optUid, valUid) =>
                setSelected((s) => ({ ...s, [optUid]: valUid }))
              }
              qty={qty}
              onDecQty={() => setQty((q) => Math.max(1, q - 1))}
              onIncQty={() => setQty((q) => q + 1)}
              discounted={discounted}
              regularPrice={regularPrice}
              finalPrice={finalPrice}
              currency={currency}
              addDisabled={addDisabled}
              onAddToCart={() =>
                addToCart({
                  sku: product.sku ?? "",
                  name: product.name ?? "Product",
                  price: Number(finalPrice ?? regularPrice ?? 0),
                  qty,
                  options: selectedOptionsForCart,
                })
              }
            />
          </Box>
        </Box>

        <Box
          sx={{
            mt: { xs: 4, md: 7 },
            display: "grid",
            gap: { xs: 3, md: 6 },
            gridTemplateColumns: { xs: "1fr", md: "1.35fr 0.65fr" },
            alignItems: "start",
          }}
        >
          <ProductDescription
            name={product.name}
            html={product.description?.html ?? null}
          />
          <ProductHighlights />
        </Box>

        <ProductSpecifications product={product} />
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
