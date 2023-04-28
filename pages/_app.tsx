import type { AppProps } from "next/app";
import { SessionProvider, useSession } from "next-auth/react";
import Layout from "./layout";
import { MantineProvider } from "@mantine/core";
import { useEffect, useState } from "react";
import neo4j from "neo4j-driver";
import { useRouter } from "next/router";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const router = useRouter();
  return (
    <>
      <SessionProvider session={pageProps.session}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{ colorScheme: "dark" }}
        >
          {!router.asPath.includes("match") ? (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          ) : (
            <Component {...pageProps} />
          )}
        </MantineProvider>
      </SessionProvider>
    </>
  );
}
