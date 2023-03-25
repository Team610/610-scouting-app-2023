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

export function DisplayTeamData({
  data,
  weight,
}: {
  data: teamAggData[];
  weight: teamAggDataWeight;
}) {
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
    data.map((d: teamAggData) => <AggregateRow data={d} weights={weight} />)
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
      {data !== undefined ? (
        <DisplayTeamData data={data} weight={defaultWeight} />
      ) : null}
    </div>
  );
}

export default function AllTeamData() {
  const [data, setData] = useState<teamAggData[]>();
  const [advanceTable, setAdvanceTable] = useState(true);
  const [weights, setWeights] = useState<teamAggDataWeight>(defaultWeight);
  const [displayWeights, setDisplayWeights] = useState(false);

  useEffect(() => {
    async function getData() {
      setData(await getAllTeamData());
    }
    getData();
  }, []);

  const handleWeightChange = (key: keyof teamAggDataWeight, value: string) => {
    setWeights((prevWeights) => ({
      ...prevWeights,
      [key]: parseInt(value),
    }));
  };

  const weightAdjuster = Object.keys(defaultWeight).map((feature: string) => (
    <TextInput
      label={feature}
      defaultValue={defaultWeight[feature]}
      onChange={(e: any) => handleWeightChange(feature, e.currentTarget.value)}
      maxLength={3}
    ></TextInput>
  ));

  return (
    <div style={{ padding: "10px" }}>
      {displayWeights ? (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <>{weightAdjuster}</>
          </div>
          <Button onClick={() => setDisplayWeights(false)}>Hide Weights</Button>
        </>
      ) : (
        <Button onClick={() => setDisplayWeights(true)}>
          Display Weighting
        </Button>
      )}
      <h1>All Teams</h1>

      <Button onClick={() => setAdvanceTable(!advanceTable)}>
        {!advanceTable ? "Advance Table" : "Simple Table"}
      </Button>
      {data ? (
        <div>
          {advanceTable ? (
            <AdvancedTable data={data} weights={weights} />
          ) : (
            <DisplayTeamData data={data} weight={weights} />
          )}
          <CSVLink data={data}>Download CSV</CSVLink>
        </div>
      ) : (
        <div>Loading...</div>
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
      <td>{calcPR({ teamData: data, weights: weights })}</td>
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
  ret += teamData.PPG * weights.PPG;
  ret += teamData.autoClimbPPG * weights.autoClimbPG;
  ret += teamData.autoPPG * weights.autoPPG;
  ret += teamData.autoPiecesPG * weights.autoPiecesPG;
  ret += teamData.avgPiecesScored * weights.piecesPG;
  ret += isNaN(teamData.coneAccuracy * weights.coneAccuracy)
    ? 0
    : teamData.coneAccuracy * weights.coneAccuracy;
  ret += isNaN(teamData.cubeAccuracy * weights.cubeAccuracy)
    ? 0
    : teamData.cubeAccuracy * weights.cubeAccuracy;
  ret += teamData.cyclesPG * weights.cyclesPG;
  ret += teamData.linkPG * weights.linkPG;
  ret += teamData.maxPiecesScored * weights.maxPieces;
  ret += isNaN(teamData.scoringAccuracy * weights.accuracy)
    ? 0
    : teamData.scoringAccuracy * weights.accuracy;
  ret += teamData.scoringPositions[0] * weights.lowerPG;
  ret += teamData.scoringPositions[1] * weights.middlePG;
  ret += teamData.scoringPositions[2] * weights.upperPG;
  ret += teamData.teleopClimbPPG * weights.teleClimbPG;
  ret += teamData.teleopPiecesPG * weights.telePiecesPG;
  ret += teamData.weightedCyclesPG * weights.wCyclesPG;

  return ret.toFixed(2);
}
