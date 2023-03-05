import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getTeams } from "../../neo4j/GetData";
import { Button } from "@mantine/core";
import Link from "next/link";
export default function Home() {
  const router = useRouter();
  const [teams, setTeams] = useState<string[]>();
  useEffect(() => {
    async function fetchTeams() {
      let teams = [...new Set(await getTeams())];
      teams = teams.sort((a, b) => a - b);
      setTeams(teams);
      console.log(teams);
    }
    fetchTeams();
  }, []);
  return (
    <div
      style={{ display: "flex", flexDirection: "column", marginLeft: "20px" }}
    >
      <h1>Teams</h1>
      {teams
        ? teams.map((team: string) => {
            return <Link href={"/teams/" + team}>{team}</Link>;
          })
        : null}
    </div>
  );
}
