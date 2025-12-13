import type {
  CategoriesQuery,
  ProductsByCategoryQuery,
  ProductBySkuQuery,
} from "../../graphql/generated";

export type Category = NonNullable<
  NonNullable<NonNullable<CategoriesQuery["categories"]>["items"]>[number]
>;

export type ProductListItem = NonNullable<
  NonNullable<NonNullable<ProductsByCategoryQuery["products"]>["items"]>[number]
>;

export type ProductDetail = NonNullable<
  NonNullable<NonNullable<ProductBySkuQuery["products"]>["items"]>[number]
>;

export type ProductImage = NonNullable<
  NonNullable<ProductDetail["media_gallery_entries"]>[number]
>;
