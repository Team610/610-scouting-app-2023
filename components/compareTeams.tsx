import { getCompTeams, getMatch, calculateTeamAgg } from "../neo4j/Aggregate";
import { Button, Table, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { teamAggData } from "../utils";

export function CompareTeamData({ teams }: { teams: Array<number> }) {
  const [data, setData] = useState<teamAggData[]>();
  const teamRoles = ["Blue 1", "Blue 2", "Blue 3", "Red 1", "Red 2", "Red 3"];

  useEffect(() => {
    async function getData() {
      setData((await getCompTeams(teams)) as teamAggData[]);
    }
    getData();
  }, [teams]);

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
      <th>AutoNoClimbPG</th>
    </tr>
  );

  const rows = data ? (
    data.map((data: teamAggData, index: number) => (
      <tr key={index}>
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
        <td>{data.autoNoClimb}</td>
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

export default function CompareTeams({ teams }: { teams?: number[] }) {
  return (
    <div>
      <CompareTeamData teams={teams} />
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
