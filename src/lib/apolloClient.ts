import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import fetch from "cross-fetch";

export function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: new HttpLink({
      uri: "https://backend.reachdigital.dev/graphql",
      fetch,
    }),
    cache: new InMemoryCache(),
  });
}
