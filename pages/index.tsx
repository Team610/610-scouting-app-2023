import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import Link from 'next/link'
import Header from './components/Header'
import Footer from './components/Footer'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  return (
    <>
      <Header></Header>
      <div className = {styles.center}>
        <h2>
          <Link href='/Auto' className = {styles.center}>Start</Link>
        </h2>
      </div>
      <Footer></Footer>
    </>
  )
}
