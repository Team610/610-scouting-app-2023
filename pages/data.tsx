import {
  getAllTeamData,
  getCompTeams,
  getMatch,
  calculateTeamAgg,
} from "../neo4j/Aggregate";
import { createNTeams, addDummyData } from "../neo4j/AddData";
import { query, wipe } from "../neo4j/Miscellaneous";
import { Button, Table, TextInput } from "@mantine/core";
import sampleMatch from "../data/sampleMatch.json";
import { Input } from "@mantine/core";
import { useEffect, useState } from "react";
import {
  defaultTeam,
  defaultWeight,
  teamAggData,
  teamAggDataWeight,
} from "../utils";
import { CSVLink, CSVDownload } from "react-csv";
import { AdvancedTable } from "../components/tables";

export function DisplayTeamData({ data }: { data: teamAggData[] }) {
  const [weights, setWeights] = useState<teamAggDataWeight>(defaultWeight);
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
      <th>Power Rating</th>
    </tr>
  );

  const rows = data ? (
    data.map((d: teamAggData) => <AggregateRow data={d} weights={weights} />)
  ) : (
    <></>
  );

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

  useEffect(() => {
    async function getData() {
      if (teamNo !== 0) {
        setData([await calculateTeamAgg({ team: teamNo })]);
      }
    }
    getData();
  }, []);

  return (
    <div>
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
              setData([await calculateTeamAgg({ team: teamNo })]);
              setSearching(true);
            }}
          >
            Run Query
          </Button>
        </div>
      ) : null}
      {data !== undefined ? <DisplayTeamData data={data} /> : null}
    </div>
  );
}

export default function AllTeamData() {
  const [data, setData] = useState<teamAggData[]>();
  const [advanceTable, setAdvanceTable] = useState(false);
  useEffect(() => {
    async function getData() {
      setData(await getAllTeamData());
    }
    getData();
  }, []);
  return (
    <div style={{ padding: "10px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>All Teams</h1>

        <Button onClick={() => setAdvanceTable(!advanceTable)}>
          {!advanceTable ? "Advance Table" : "Simple Table"}
        </Button>
      </div>
      {data ? (
        <div>
          {advanceTable ? (
            <AdvancedTable data={data} />
          ) : (
            <DisplayTeamData data={data} />
          )}
          <CSVLink data={data}>Download CSV</CSVLink>
        </div>
      ) : (
        "Loading"
      )}
    </div>
  );
}
export function AggregateRow({
  data,
  weights,
}: {
  data: teamAggData;
  weights: teamAggDataWeight;
}) {
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
          data.scoringPositions[0].toFixed(2) +
          " Middle: " +
          data.scoringPositions[1].toFixed(2) +
          " Top: " +
          data.scoringPositions[2].toFixed(2)}
      </td>
      <td>{data.autoClimbPPG.toFixed(2)}</td>
      <td>{data.teleopClimbPPG.toFixed(2)}</td>
      <td>{data.climbPPG.toFixed(2)}</td>
      <td>{data.linkPG.toFixed(2)}</td>
      <td>{data.autoPiecesPG.toFixed(2)}</td>
      <td>{data.teleopPiecesPG.toFixed(2)}</td>
      <td>{calcPR({ teamData: data, weights: weights }).toFixed(2)}</td>
    </tr>
  );
}

export function calcPR({
  teamData,
  weights,
}: {
  teamData: teamAggData;
  weights: teamAggDataWeight;
}) {
  let ret: number = 0;
  ret += teamData.PPG * weights.PPG_weight;
  ret += teamData.autoClimbPPG * weights.autoClimbPPG_weight;
  ret += teamData.autoPPG * weights.autoPPG_weight;
  ret += teamData.autoPiecesPG * weights.autoPiecesPG_weight;
  ret += teamData.avgPiecesScored * weights.avgPiecesScored_weight;
  ret += teamData.climbPPG * weights.climbPPG_weight;
  ret += teamData.coneAccuracy * weights.coneAccuracy_weight;
  ret += teamData.cubeAccuracy * weights.cubeAccuracy_weight;
  ret += teamData.cyclesPG * weights.cyclesPG_weight;
  ret += teamData.linkPG * weights.linkPG_weight;
  ret += teamData.maxPiecesScored * weights.maxPiecesScored_weight;
  ret += teamData.scoringAccuracy * weights.scoringAccuracy_weight;
  ret += teamData.scoringPositions[0] * weights.lowerScoredPG_weight;
  ret += teamData.scoringPositions[1] * weights.middleScoredPG_weight;
  ret += teamData.scoringPositions[2] * weights.upperScoredPG_weight;
  ret += teamData.teleopClimbPPG * weights.teleopClimbPPG_weight;
  ret += teamData.teleopPiecesPG * weights.teleopPiecesPG_weight;
  ret += teamData.weightedCyclesPG * weights.weightedCyclesPG_weight;

  return ret;
}
