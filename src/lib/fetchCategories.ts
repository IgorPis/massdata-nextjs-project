import { createApolloClient } from "@/lib/apolloClient";
import { CategoriesDocument } from "../../graphql/generated";

export async function fetchCategories() {
  const apollo = createApolloClient();
  const { data } = await apollo.query({ query: CategoriesDocument });
  return data?.categories?.items ?? [];
}
