import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import { app } from "../firebase/FirebaseConfig";
import SignIn from "./signIn";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <div className={styles.center}>
        <h2>
          <Link href="/match" className={styles.center}>
            Start
          </Link>
        </h2>
      </div>
    </>
  );
}
