import { SYSTEM_PROPS } from "@mantine/core/lib/Box/style-system-props/system-props/system-props";
import { Anybody } from "@next/font/google";
import Link from "next/link";
import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getMatch, getMatchList, getTeam } from "../../neo4j/Aggregate";
import { getTeams } from "../../neo4j/GetData";
import { teamAggData } from "../../utils";
import { AggregateRow } from "../compareTeams";
import { Table } from "@mantine/core";

export default function Home(this: any) {
  const [matches, setMatches] = useState<number[]>();
  const [agg, setAgg] = useState<teamAggData>();
  const router = useRouter();
  let teamNumber: string = router.asPath.replace("/teams/", "");

  useEffect(() => {
    async function getData() {
      let data = await getMatchList(parseInt(teamNumber));
      let teamAgg = await getTeam({ team: parseInt(teamNumber) });
      setMatches(data);
      setAgg(teamAgg);
    }

    getData();
  }, []);

  return (
    <div>
      <h1>Team {teamNumber}</h1>
      {/* <div style={{ border: "1px solid grey" }}>Team {teamNumber}</div> */}
      {/* <div style={{ border: "1px solid grey" }}>Matches: </div> */}
      {/* <div style={{ display: "flex", flexDirection: "column" }}> */}
      {/* {matches?.map((match) => {
          return (
            <div>
              <Link href={`${router.asPath}/${match}`}>{match}</Link>
            </div>
          );
        })} */}
      <Table>
        <thead>
        <tr>
          <th>Team</th>
          <th>Matches Played</th>
          <th>Auto PPG</th>
          <th>PPG</th>
          <th>Cycles PG</th>
          <th>Weighted Cycles PG</th>
          {/* <th>Scoring Accuracy</th>
          <th>Cone Accuracy</th>
          <th>Cube Accuracy</th> */}
          <th>Scoring Positions</th>
          <th>Auto Climb PPG</th>
          <th>Teleop Climb PPG</th>
          <th>Climb PPG</th>
          <th>Link PG</th>
        </tr>
        </thead>
        <tbody>
          {agg ? <AggregateRow data={agg!} /> : null}
        </tbody>
      </Table>
    </div>
  );
}
