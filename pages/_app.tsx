import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {SessionProvider} from 'next-auth/react'
import Layout from './layout'

export default function App({ Component, pageProps: {session, ...pageProps} }: AppProps) {
  return <>
    <SessionProvider session={pageProps.session}>
      <Layout />
      <Component {...pageProps} />
    </SessionProvider>
  </>
}
