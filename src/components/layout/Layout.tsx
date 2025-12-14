import type { ReactNode } from "react";
import Head from "next/head";
import { Box } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Category } from "@/types/graphql";

type LayoutProps = {
  categories?: Category[];
  children: ReactNode;
};

export default function Layout({ categories = [], children }: LayoutProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico?v=2" />

        <title>Massdata</title>
        <meta
          name="description"
          content="Demo commerce frontend built with Next.js, GraphQL and MUI"
          key="description"
        />
      </Head>

      <Box
        sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Header categories={categories} />

        <Box component="main" aria-label="Main content" sx={{ flex: 1 }}>
          {children}
        </Box>

        <Footer />
      </Box>
    </>
  );
}
