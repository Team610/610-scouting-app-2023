import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import TimerFunction from './TimerFunction'
import Header from './components/Header'
import Footer from './components/Footer'

const inter = Inter({ subsets: ['latin']});

export default function Home() {

  let time = TimerFunction(15,'/TeleOp');
  const [cones, setCones] = useState(0);
  function conesCount(){
    setCones(cones+1);
  }

   return (
        <div>
          <Header></Header>
          <div>
            <h1 className = {styles.center}>Auto</h1>
          </div>
          <div>
            <h2><Link href='/' className = {styles.links}>Home</Link></h2>
            <h2><Link href='/TeleOp' className = {styles.links}>TeleOp</Link></h2>
          </div>
          <div>
            <h1 className = {styles.center}>{time}</h1>
          </div>
          <div className = {styles.buttons}>
            <button id = "coneButton" onClick = {conesCount}>Cones</button>
            <h2 className = {styles.buttons}>{cones}</h2>
          </div>
          <div>
          </div>
          <Footer></Footer>
        </div>
    )
  }