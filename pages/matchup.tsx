import {
  getCompTeams,
  getMatch,
  calculateTeamAgg,
  getTeamAgg,
} from "../neo4j/Aggregate";
import { createNTeams, addDummyData } from "../neo4j/AddData";
import { query, wipe } from "../neo4j/Miscellaneous";
import { Button, Table, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { defaultTeam, defaultTeamB, teamAggData } from "../utils";
import sampleMatch from "../data/sampleMatch.json";

export function Display({ teams }: { teams: Array<number> }) {
  const [data, setData] = useState<teamAggData[]>();
  const teamRoles = [
    "Blue 1",
    "Blue 2",
    "Blue 3",
    "Red 1",
    "Red 2",
    "Red 3",
    "Blue Alliance",
    "Red Alliance",
  ];

  const getData = async () => {
    let tempD = await getCompTeams(teams);
    let blueT = Object.assign({}, defaultTeam);
    let redT = Object.assign({}, defaultTeamB);
    for (const teamD of tempD.slice(0, 3)) {
      for (const property in teamD) {
        if (property == "scoringPositions") {
          blueT["scoringPositions"][0] += teamD["scoringPositions"][0];
          blueT["scoringPositions"][1] += teamD["scoringPositions"][1];
          blueT["scoringPositions"][2] += teamD["scoringPositions"][2];
        } else if (property == "cubeCycleProportion") {
          blueT[property] = 0;
        } else if (property == "team") {
          blueT[property] = -1;
        } else if (
          typeof teamD[property] === "number" &&
          typeof blueT[property] === "number"
        ) {
          let temp: number = blueT[property] as number;
          temp += teamD[property] as number;
          blueT[property] = temp;
        }
      }
    }
    for (const teamD of tempD.slice(3, 6)) {
      for (const property in teamD) {
        if (property == "scoringPositions") {
          redT["scoringPositions"][0] += teamD["scoringPositions"][0];
          redT["scoringPositions"][1] += teamD["scoringPositions"][1];
          redT["scoringPositions"][2] += teamD["scoringPositions"][2];
        } else if (property == "cubeCycleProportion") {
          redT[property] = 0;
        } else if (property == "team") {
          redT[property] = -2;
        } else if (
          typeof teamD[property] === "number" &&
          typeof redT[property] === "number"
        ) {
          let temp: number = redT[property] as number;
          temp += teamD[property] as number;
          redT[property] = temp;
        }
      }
    }
    setData([...tempD, blueT, redT]);
  };

  const handleGetData = () => {
    getData();
  };

  const ths = (
    <tr>
      <th>Team</th>
      <th>In this game</th>
      <th>EXP auto no climb</th>
      <th>MAX auto no climb</th>
      <th>EXP teleop high</th>
      <th>MAX teleop high</th>
      <th>EXP teleop mid</th>
      <th>MAX teleop mid</th>
      <th>EXP teleop low</th>
      <th>MAX teleop low</th>
      <th>EXP links</th>
      <th>MAX links</th>
      <th>EXP teleop points w/o link</th>
      <th>MAX teleop points w/0 link</th>
      <th>EXP points w/o climb</th>
      <th>MAX points w/o climb</th>
      <th>EXP cycles</th>
      <th>MAX cycles</th>
    </tr>
  );

  const rows = data ? (
    data.map((data: teamAggData, index: number) => (
      <tr key={data.team}>
        <td>
          {data.team == -1
            ? "Blue Alliance"
            : data.team == -2
            ? "Red Alliance"
            : data.team}
        </td>
        <td>{teamRoles[index]}</td>
        <td>{data.autoNoClimb.toFixed(2)}</td>
        <td>{-1}</td>
        <td>{data.scoringPositions[2].toFixed(2)}</td>
        <td>{-1}</td>
        <td>{data.scoringPositions[1].toFixed(2)}</td>
        <td>{-1}</td>
        <td>{data.scoringPositions[0].toFixed(2)}</td>
        <td>{-1}</td>
        <td>{data.linkPG.toFixed(2)}</td>
        <td>{-1}</td>
        <td>
          {(
            2 * data.scoringPositions[0] +
            3 * data.scoringPositions[1] +
            5 * data.scoringPositions[2]
          ).toFixed(2)}
        </td>
        <td>{-1}</td>
        <td>
          {(
            data.autoNoClimb +
            2 * data.scoringPositions[0] +
            3 * data.scoringPositions[1] +
            5 * data.scoringPositions[2]
          ).toFixed(2)}
        </td>
        <td>{-1}</td>
        <td>{data.cyclesPG.toFixed(2)}</td>
        <td>{-1}</td>
      </tr>
    ))
  ) : (
    <></>
  );

  return (
    <>
      <Button onClick={handleGetData}>Get Data</Button>
      <Table>
        <thead>{ths}</thead>
        <tbody>{rows}</tbody>
      </Table>
    </>
  );
}

export default function Matchup({ defaultTeams }: { defaultTeams?: number[] }) {
  const [teams, setTeams] = useState<number[]>(
    defaultTeams ? defaultTeams : []
  );
  return (
    <div>
      <TextInput
        defaultValue={teams.map((team) => team + " ")}
        onChange={(e) => {
          setTeams(e.target.value.split(" ").map((x) => parseInt(x)));
        }}
      ></TextInput>

      <Display teams={teams} />
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
