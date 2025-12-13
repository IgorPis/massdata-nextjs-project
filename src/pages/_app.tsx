import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { createApolloClient } from "@/lib/apolloClient";
import Layout from "@/components/layout/Layout";
import type { Category } from "@/types/graphql";

type PagePropsWithCategories = AppProps["pageProps"] & {
  categories?: Category[];
};
const client = createApolloClient();
const theme = createTheme();

export default function App({ Component, pageProps }: AppProps) {
  const { categories = [] } = pageProps as PagePropsWithCategories;

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Layout categories={categories}>
          <Component {...(pageProps as PagePropsWithCategories)} />
        </Layout>
      </ThemeProvider>
    </ApolloProvider>
  );
}
