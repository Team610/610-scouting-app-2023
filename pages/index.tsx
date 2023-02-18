import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import { climb, create100Teams, score } from "../neo4j/GabeTesting";
import { Button } from "@mantine/core";
import sampleMatch from "../data/sampleMatch.json";
import SignIn from "./signIn";
import Link from "next/link";
import { getSession, useSession } from "next-auth/react";
import { Context, useEffect, useState } from "react";
import { GetServerSidePropsContext } from "next";
import neo4j from "neo4j-driver";
import { addUser } from "../neo4j/User";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Button onClick={async () => await create100Teams()}>CREATE</Button>
      <Button onClick={async () => await score({ data : sampleMatch })}>Scored</Button>
      <Button onClick={async () => await climb({ data : sampleMatch})}>Climb</Button>
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await getSession(context);
  if (user) {
    await addUser(user);
  }

  return { props: {} };
}
