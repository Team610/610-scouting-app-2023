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
import { defaultTeam, teamAggData } from "../utils";
import { CSVLink, CSVDownload } from "react-csv";
import { AdvancedTable, DisplayTeamData } from "./components/tables";

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
