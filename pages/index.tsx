import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import { getTeam } from "../neo4j/Aggregate";
import { climb, createNTeams, score, mobility, addDummyData } from "../neo4j/AddData";
import { allies, enemies } from "../neo4j/Relationships";
import { query, wipe } from "../neo4j/Miscellaneous";
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
      <Button onClick={async () => await createNTeams(20)}>Create dummy teams</Button>
      <Button onClick={async () => await addDummyData({ data: sampleMatch })}>
        Add dummy data
      </Button>
      <Button onClick={async () => await climb({ data: sampleMatch })}>
        Climb
      </Button>
      <Button onClick={async () => await getTeam({team : 16})}>
        Get team aggregate data
      </Button>
      <Button onClick={async () => await wipe()}>
        wipe
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
