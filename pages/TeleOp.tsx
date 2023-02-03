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
  let time = TimerFunction(15,'/EndGame');

   return (
      <>
        <Header></Header>
        <div>
          <h1 className = {styles.center}>TeleOp</h1>
        </div>
        <div>
          <h2>
            <Link href="./" className = {styles.links}>Home</Link>
            <h1 className = {styles.center} >{time}</h1>
            <Link href="./EndGame" className = {styles.links}>End Game</Link>
          </h2>
        </div>
        <Footer></Footer>
      </>
    )
  }