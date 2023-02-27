import type { AppProps } from "next/app";
import { SessionProvider, useSession } from "next-auth/react";
import Layout from "./layout";
import { MantineProvider } from "@mantine/core";
import { useEffect, useState } from "react";
import neo4j from "neo4j-driver";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <SessionProvider session={pageProps.session}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{ colorScheme: "dark" }}
        >
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MantineProvider>
      </SessionProvider>
    </>
  );
}
