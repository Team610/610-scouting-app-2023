import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import TimerFunction from './TimerFunction'
import Header from './components/Header'
import Footer from './components/Footer'

const inter = Inter({ subsets: ['latin']});

export default function Home() {

  let time = TimerFunction(15,'/');
  
   return (
      <>
        <Header></Header>
        <h1 className = {styles.center}>End Game</h1>
        <h2>
          <Link href="/" className = {styles.links}>Home</Link>
          <h1 className = {styles.center}>{time}</h1>
        </h2>
        <Footer></Footer>
      </>
    )
  }