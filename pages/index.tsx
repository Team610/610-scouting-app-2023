import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import { getMatch, getTeam } from "../neo4j/Aggregate";
import {
  climb,
  createNTeams,
  score,
  mobility,
  addDummyData,
} from "../neo4j/AddData";
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
import React from "react";
import SelectMatchDropBox from "./matches";

//import SelectMatchDropBox from "./matches";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [queryText, setQueryText] = useState("");
  return (
    <>
       {/* <Button onClick={async () => await createNTeams(20)}>Create dummy teams</Button>
      <Button onClick={async () => await addDummyData({ data: sampleMatch })}> 
        Add dummy data
  </Button>
      <Button onClick={async () => await getTeam({ team: 17 })}>
        Get team aggregate data
      </Button>
      <Button onClick={async () => await getMatch(3, "06")}>
        Get match aggregate data
      </Button>
      <Button onClick={async () => await wipe()}>
        Wipe
      </Button>  */}
      {/* <Input
        placeholder="Run query"
        onChange={(e) => {
          setQueryText(e.currentTarget.value);
        }}
      />
      <Button onClick={async () => await query(queryText)}>Query</Button> */}

      <div>
        <SelectMatchDropBox></SelectMatchDropBox>
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
