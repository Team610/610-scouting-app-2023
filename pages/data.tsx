import {
  getAllTeamData,
  getCompTeams,
  getMatch,
  getTeam,
} from "../neo4j/Aggregate";
import { createNTeams, addDummyData } from "../neo4j/AddData";
import { query, wipe } from "../neo4j/Miscellaneous";
import { Button, Table, TextInput } from "@mantine/core";
import sampleMatch from "../data/sampleMatch.json";
import { Input } from "@mantine/core";
import { useEffect, useState } from "react";
import { defaultTeam, teamAggData } from "../utils";
import { CSVLink, CSVDownload } from "react-csv";

export function DisplayTeamData({ data }: { data: teamAggData[] }) {
  const ths = (
    <tr>
      <th>Team</th>
      <th>Matches Played</th>
      <th>Auto PPG</th>
      <th>PPG</th>
      <th>Cycles PG</th>
      <th>Weighted Cycles PG</th>
      <th>Scoring Accuracy</th>
      <th>Cone Accuracy</th>
      <th>Cube Accuracy</th>
      <th>Scoring Positions</th>
      <th>Auto Climb PPG</th>
      <th>Teleop Climb PPG</th>
      <th>Climb PPG</th>
      <th>Link PG</th>
      <th>Auto Pieces PG</th>
      <th>Teleop Pieces PG</th>
    </tr>
  );

  const rows = data ? (
    data.map((d: teamAggData) => <AggregateRow data={d} />)
  ) : (
    <></>
  );
  console.log(data);

  return (
    <>
      {data ? (
        <Table>
          <thead>{ths}</thead>
          <tbody>{rows}</tbody>
        </Table>
      ) : (
        "Loading"
      )}
    </>
  );
}

export function SingleTeamData({ team }: { team: number }) {
  const [teamNo, setTeamNo] = useState(team);
  const [data, setData] = useState<teamAggData[]>();
  const [searching, setSearching] = useState(false);
  // useEffect(() => {
  //   async function getData() {
  //     if (teamNo !== 0) {
  //       setData([await getTeam({ team: teamNo })]);
  //     }
  //   }
  //   getData();
  // }, []);

  return (
    <div>
      {/* <Button onClick={async () => await createNTeams(20)}>
        Create dummy teams
      </Button>
      <Button onClick={async () => await addDummyData({ data: sampleMatch })}>
        Add dummy data
      </Button> */}
      {/* <Button onClick={async () => await wipe()}>Wipe</Button> */}

      {team === 0 ? (
        <div>
          <TextInput
            placeholder="610"
            label="Team Number"
            withAsterisk
            onChange={(e) => {
              setTeamNo(
                e.currentTarget.value == ""
                  ? 0
                  : parseInt(e.currentTarget.value)
              );
              setData(undefined);
              setSearching(false);
            }}
          ></TextInput>
          <Button
            onClick={async () => {
              setData([await getTeam({ team: teamNo })]);
              setSearching(true);
            }}
          >
            Run Query
          </Button>
        </div>
      ) : null}
      {data !== undefined ? (
        <DisplayTeamData data={data} />
      ) : null}
    </div>
  );
}

export default function allTeamData() {
  const [data, setData] = useState<teamAggData[]>();
  useEffect(() => {
    async function getData() {
      setData(await getAllTeamData());
    }
    getData();
  }, []);
  return (
    <div>
      All Teams
      {data ? (
        <div>
          <DisplayTeamData data={data} />
          <CSVLink data={data}>Download CSV</CSVLink>
        </div>
      ) : null}
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
      <td>{data.autoPiecesPG.toFixed(2)}</td>
      <td>{data.teleopPiecesPG.toFixed(2)}</td>
    </tr>
  );
}
