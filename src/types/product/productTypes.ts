import type {
  ProductBySkuQuery,
  ProductsByCategoryQuery,
} from "../../../graphql/generated";

export type ProductListItem = NonNullable<
  NonNullable<NonNullable<ProductsByCategoryQuery["products"]>["items"]>[number]
>;

export type ProductDetail = NonNullable<
  NonNullable<NonNullable<ProductBySkuQuery["products"]>["items"]>[number]
>;

export type ProductImage = NonNullable<
  NonNullable<ProductDetail["media_gallery_entries"]>[number]
>;
