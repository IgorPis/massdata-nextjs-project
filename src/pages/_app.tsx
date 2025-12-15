import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import { theme } from "@/theme";
import { createApolloClient } from "@/lib/apolloClient";
import Layout from "@/components/layout/Layout";

const client = createApolloClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout {...pageProps}>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </ApolloProvider>
  );
}
