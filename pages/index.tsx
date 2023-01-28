import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import { app } from '../firebase/FirebaseConfig'
import Field from './field'
import SignIn from './signIn'
import Layout from './layout'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const firebase = app
  return (
    <>
      <Head>
        <title>610 Scouting App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout />
      <Field />
    
    </>
  )
}
