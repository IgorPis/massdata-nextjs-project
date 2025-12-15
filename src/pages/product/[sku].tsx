import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import {
  Button,
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { addToCart } from "@/lib/cart";
import { createApolloClient } from "@/lib/apolloClient";
import {
  CategoriesDocument,
  ProductBySkuDocument,
  ProductsByCategoryDocument,
} from "../../../graphql/generated";
import type { Category, ProductDetail, ProductImage } from "@/types/graphql";
import type { ProductsByCategoryQuery } from "../../../graphql/generated";
import { useState } from "react";

export default function ProductPage({
  product,
}: {
  categories: Category[];
  product: ProductDetail | null;
}) {
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");

  if (!product) return <div>Not found</div>;

  const rawGallery = product.media_gallery_entries ?? [];
  const gallery = (rawGallery as (ProductImage | null | undefined)[]).filter(
    (img): img is ProductImage => Boolean(img && img.file)
  );
  const price = product?.price_range?.minimum_price?.regular_price?.value;
  const currency =
    product?.price_range?.minimum_price?.regular_price?.currency ?? "";

  return (
    <>
      <Head>
        <title>{`${product.name ?? "Product"} - Massdata`}</title>
        <meta
          name="description"
          content={`Buy ${product.name}. ${price ?? ""} ${currency ?? ""}`}
          key="description"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              name: product.name ?? undefined,
              sku: product.sku ?? undefined,
              image: gallery.map(
                (e) =>
                  `https://backend.reachdigital.dev/media/catalog/product${e.file}`
              ),
              description: product.description?.html
                ? product.description.html.replace(/<[^>]*>/g, "").trim()
                : undefined,
              offers: {
                "@type": "Offer",
                price: price ?? undefined,
                priceCurrency: currency ?? undefined,
                url:
                  typeof window !== "undefined"
                    ? window.location.href
                    : undefined,
              },
            }),
          }}
        />
      </Head>

      <Container sx={{ py: 3 }}>
        {gallery.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Swiper
              spaceBetween={8}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              modules={[Navigation, Pagination]}
            >
              {gallery.map((entry, i) => {
                const url = `https://backend.reachdigital.dev/media/catalog/product${entry.file}`;

                return (
                  <SwiperSlide key={entry.id ?? url}>
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        maxWidth: 400,
                        aspectRatio: "4 / 5",
                        mx: "auto",
                      }}
                    >
                      <Image
                        src={url}
                        alt={entry.label ?? product.name ?? "Product image"}
                        fill
                        sizes="(max-width: 600px) 100vw, 50vw"
                        style={{ objectFit: "cover" }}
                        priority={i === 0}
                      />
                    </Box>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </Box>
        )}

        <Typography variant="h4" component="h1" gutterBottom>
          {product.name}
        </Typography>

        <Typography sx={{ mb: 2 }}>
          {price != null ? `${price} ${currency}` : "No price"}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Typography variant="subtitle2">Quantity</Typography>

          <Button
            variant="outlined"
            size="small"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            -
          </Button>

          <Box
            component="input"
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            aria-label="Quantity"
            sx={{
              width: 70,
              px: 1,
              py: 0.75,
              borderRadius: 1,
              border: "1px solid",
              borderColor: "divider",
            }}
          />

          <Button
            variant="outlined"
            size="small"
            onClick={() => setQty((q) => q + 1)}
            aria-label="Increase quantity"
          >
            +
          </Button>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Size
          </Typography>

          <Box
            component="select"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            aria-label="Select size"
            sx={{
              px: 1,
              py: 1,
              borderRadius: 1,
              border: "1px solid",
              borderColor: "divider",
              minWidth: 140,
              bgcolor: "background.paper",
            }}
          >
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
          </Box>
        </Box>

        <Button
          variant="contained"
          disabled={!product.sku}
          onClick={() =>
            addToCart({
              sku: product.sku ?? "",
              name: product.name ?? "Product",
              price: Number(price ?? 0),
              qty,
              options: { size: selectedSize },
            })
          }
        >
          Add to cart
        </Button>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Selected: size {selectedSize}
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Description
          </Typography>
          {product.description?.html ? (
            <Box
              sx={{ mt: 1 }}
              dangerouslySetInnerHTML={{ __html: product.description.html }}
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
              No description available.
            </Typography>
          )}
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Specifications
          </Typography>
          <Table size="small" aria-label="Product specifications">
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  SKU
                </TableCell>
                <TableCell>{product.sku}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Name
                </TableCell>
                <TableCell>{product.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Type
                </TableCell>
                <TableCell>{product.__typename}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
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
  if (!firstCatId) {
    return { paths: [], fallback: "blocking" };
  }

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
