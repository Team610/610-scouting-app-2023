import { getCompTeams, getMatch, getTeam, teamData } from "../neo4j/Aggregate";
import { createNTeams, addDummyData } from "../neo4j/AddData";
import { query, wipe } from "../neo4j/Miscellaneous";
import { Button, Table, TextInput } from "@mantine/core";
import sampleMatch from "../data/sampleMatch.json";
import { Input } from "@mantine/core";
import { useEffect, useState } from "react";

export function DisplayTeamData({ team }: { team: number }) {
  const [data, setData] = useState<teamData>();

  useEffect(() => {
    async function getData() {
      setData(await getTeam({ team: team }));
    }
    getData();
  }, [team]);

  const ths = (
    <tr>
      <th>Team</th>
      <th>In this game</th>
      <th>Matches Played</th>
      <th>Auto PPG</th>
      <th>PPG</th>
      <th>Cycles per Game</th>
      <th>Scoring Accuracy</th>
      <th>Cone Accuracy</th>
      <th>Cube Accuracy</th>
      <th>Scoring Positions</th>
      <th>Auto Climb PPG</th>
      <th>Teleop Climb PPG</th>
      <th>Climb PPG</th>
      <th>Link PG</th>
    </tr>
  );

  const rows = data ? (
    <tr key={data.team}>
      <td>{data.team}</td>
      <td>{data.matchesPlayed}</td>
      <td>{data.autoPPG.toFixed(2)}</td>
      <td>{data.PPG.toFixed(2)}</td>
      <td>{data.cyclesPG.toFixed(2)}</td>
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

export default function singleTeamData() {
  const [teamNo, setTeamNo] = useState(0);
  return (
    <div>
      <Button onClick={async () => await createNTeams(20)}>
        Create dummy teams
      </Button>
      <Button onClick={async () => await addDummyData({ data: sampleMatch })}>
        Add dummy data
      </Button>
      {/* <Button onClick={async () => await wipe()}>Wipe</Button> */}

      <TextInput
        placeholder="610"
        label="Team Number"
        withAsterisk
        onChange={(e) => setTeamNo(parseInt(e.currentTarget.value))}
      ></TextInput>

      <DisplayTeamData team={teamNo} />
    </div>
  );
}
