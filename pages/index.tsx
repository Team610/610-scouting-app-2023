import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import { climb, createNTeams, score, query } from "../neo4j/GabeTesting";
import { Button } from "@mantine/core";
import sampleMatch from "../data/sampleMatch.json";
import SignIn from "./signIn";
import Link from "next/link";
import { getSession, useSession } from "next-auth/react";
import { Context, useEffect, useState } from "react";
import { GetServerSidePropsContext } from "next";
import neo4j from "neo4j-driver";
import { addUser } from "../neo4j/User";
import { Input } from "@mantine/core";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [queryText, setQueryText] = useState("");
  return (
    <>
      <Button onClick={async () => await createNTeams(2)}>CREATE</Button>
      <Button onClick={async () => await score({ data: sampleMatch })}>
        Scored
      </Button>
      <Button onClick={async () => await climb({ data: sampleMatch })}>
        Climb
      </Button>
      <Input
        placeholder="Run query"
        onChange={(e) => {
          setQueryText(e.currentTarget.value);
        }}
      />
      <Button onClick={async () => await query(queryText)}>Query</Button>

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
