import type { CategoriesQuery } from "../../../graphql/generated";

export type Category = NonNullable<
  NonNullable<NonNullable<CategoriesQuery["categories"]>["items"]>[number]
>;
