import { SYSTEM_PROPS } from "@mantine/core/lib/Box/style-system-props/system-props/system-props";
import { Anybody } from "@next/font/google";
import Link from "next/link";
import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getMatch, getMatchList, calculateTeamAgg } from "../../neo4j/Aggregate";
import { getTeams } from "../../neo4j/GetData";
import { teamAggData } from "../../utils";
import { AggregateRow } from "../compareTeams";
import { Table } from "@mantine/core";
import { SingleTeamData } from "../data";

export default function Home() {
  const [matches, setMatches] = useState<number[]>();
  const [agg, setAgg] = useState<teamAggData>();
  const router = useRouter();
  let teamNumber: string = router.asPath.replace("/teams/", "");

  useEffect(() => {
    async function getData() {
      let data = await getMatchList(parseInt(teamNumber));
      let teamAgg = await calculateTeamAgg({ team: parseInt(teamNumber) });
      setMatches(data);
      setAgg(teamAgg);
    }

    getData();
  }, []);

  return (
    <div>
      <h1>Team {teamNumber}</h1>
      {/* <SingleTeamData team={parseInt(teamNumber)} /> */}
      Go to /single for stats
    </div>
  );
}
