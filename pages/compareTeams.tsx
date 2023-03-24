import { getCompTeams, getMatch, calculateTeamAgg, getTeamAgg } from "../neo4j/Aggregate";
import { createNTeams, addDummyData } from "../neo4j/AddData";
import { query, wipe } from "../neo4j/Miscellaneous";
import { Button, Table } from "@mantine/core";
import { useEffect, useState } from "react";
import { teamAggData } from "../utils";
import sampleMatch from "../data/sampleMatch.json"

export function CompareTeamData({ teams }: { teams: Array<number> }) {
  const [data6, setData6] = useState<teamAggData[]>();
  const teamRoles = ["Blue 1", "Blue 2", "Blue 3", "Red 1", "Red 2", "Red 3"];

  useEffect(() => {
    async function getData() {
      console.log("getting data");
      setData6(await getCompTeams(teams));
    }
    getData();
  }, []);

  const ths = (
    <tr>
      <th>Team</th>
      <th>In this game</th>
      <th>Matches Played</th>
      <th>Auto PPG</th>
      <th>PPG</th>
      <th>Cycles PG</th>
      <th>Weighted Cycles PG</th>
      <th>Scoring Accuracy</th>
      <th>Auto Climb PPG</th>
      <th>Teleop Climb PPG</th>
      <th>Climb PPG</th>
      <th>Scoring Positions</th>
      <th>Cone Accuracy</th>
      <th>Cube Accuracy</th>
      <th>Link PG</th>
    </tr>
  );

  const rows = data6 ? (
    data6.map((data: teamAggData, index: number) => (
      <tr key={data.team}>
        <td>{data.team}</td>
        <td>{teamRoles[index]}</td>
        <td>{data.matchesPlayed}</td>
        <td>{data.autoPPG}</td>
        <td>{data.PPG}</td>
        <td>{data.cyclesPG}</td>
        <td>{data.weightedCyclesPG}</td>
        <td>{data.scoringAccuracy}</td>
        <td>{data.autoClimbPPG}</td>
        <td>{data.teleopClimbPPG}</td>
        <td>{data.climbPPG}</td>
        <td>
          {"Lower: " +
            data.scoringPositions[0] +
            " Middle: " +
            data.scoringPositions[1] +
            " Top: " +
            data.scoringPositions[2]}
        </td>
        <td>{data.coneAccuracy}</td>
        <td>{data.cubeAccuracy}</td>
        <td>{data.linkPG}</td>
      </tr>
    ))
  ) : (
    <></>
  );

  return (
    <>
      <Table>
        <thead>{ths}</thead>
        <tbody>{rows}</tbody>
      </Table>
    </>
  );
}

export default function CompareTeams() {
  return (
    <div>
      <Button onClick={async () => await getTeamAgg({team: 7712})}>
        getAgg
      </Button>
      <Button onClick={async () => await addDummyData({ data: sampleMatch })}>
                Add dummy data
            </Button>
      <Button onClick={async () => await wipe()}>Wipe</Button>
      <Button onClick={async () => { 
          await fetch("/api/create-team", {
            method: "POST",
            body: JSON.stringify({team_number: 5})
          })
      }}>create teams</Button>

      <CompareTeamData teams={[1, 2, 3, 4, 5, 6]} />
    </div>
  );
}

export function AggregateRow({ data }: { data: teamAggData }) {
  return (
    <tr key={data.team}>
      <td>{data.team}</td>
      <td>{data.matchesPlayed}</td>
      <td>{data.autoPPG.toFixed(2)}</td>
      <td>{data.PPG.toFixed(2)}</td>
      <td>{data.cyclesPG.toFixed(2)}</td>
      <td>{data.weightedCyclesPG.toFixed(2)}</td>
      <td>{data.scoringAccuracy.toFixed(2)}</td>
      <td>{data.coneAccuracy.toFixed(2)}</td>
      <td>{data.cubeAccuracy.toFixed(2)}</td>
      <td>
        {"Lower: " +
          data.scoringPositions[0] +
          " Middle: " +
          data.scoringPositions[1] +
          " Top: " +
          data.scoringPositions[2]}
      </td>
      <td>{data.autoClimbPPG.toFixed(2)}</td>
      <td>{data.teleopClimbPPG.toFixed(2)}</td>
      <td>{data.climbPPG.toFixed(2)}</td>
      <td>{data.linkPG.toFixed(2)}</td>
    </tr>
  );
}
