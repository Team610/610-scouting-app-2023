import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Layout from "./layout";
import { MantineProvider } from "@mantine/core";

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
          <Layout />
          <Component {...pageProps} />
        </MantineProvider>
      </SessionProvider>
    </>
  );
}
