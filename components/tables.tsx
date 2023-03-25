import { Box, Table } from "@mantine/core";
import { useMemo } from "react";
import { teamAggData } from "../utils";
import { MantineReactTable, MRT_ColumnDef } from "mantine-react-table";

export function DisplayTeamData({ data }: { data: teamAggData[] }) {
  const ths = (
    <tr>
      <th>Team</th>
      <th>Matches Played</th>
      <th>Auto PPG</th>
      <th>PPG</th>
      <th>Cycles PG</th>
      <th>Weighted Cycles PG</th>
      <th>Scoring Accuracy %</th>
      <th>Cone Accuracy %</th>
      <th>Cube Accuracy %</th>
      <th>Scoring Positions</th>
      <th>Auto Climb PPG</th>
      <th>Teleop Climb PPG</th>
      <th>Climb PPG</th>
      <th>Link PG</th>
      <th>Auto Pieces PG</th>
      <th>Teleop Pieces PG</th>
    </tr>
  );

  const rows = data.map((d: teamAggData) => (
    <tr key={d.team}>
      <AggregateRow data={d} />
    </tr>
  ));

  return (
    <>
      <Table>
        <thead>{ths}</thead>
        <tbody>{rows}</tbody>
      </Table>
    </>
  );
}

export const AdvancedTable = ({ data }: { data: teamAggData[] }) => {
  const columns = useMemo<MRT_ColumnDef<teamAggData>[]>(
    () => [
      {
        id: "robots", //id used to define `group` column
        header: "Robots",
        columns: [
          {
            accessorFn: (row) => row.team,
            id: "team",
            header: "Team",
            size: 50,
          },
          {
            accessorFn: (row) => row.autoPPG.toFixed(2),
            header: "Auto PPG",
            id: "autoPPG",
            size: 50,
          },
          {
            accessorFn: (row) => row.cyclesPG.toFixed(2),
            header: "Cycles PG",
            id: "cycles",
            size: 50,
            Cell: ({ cell }) => (
              <Box
                sx={(theme) => ({
                  backgroundColor:
                    cell.getValue<number>() < 3
                      ? theme.colors.red[8]
                      : cell.getValue<number>() >= 3 &&
                        cell.getValue<number>() < 8
                      ? theme.colors.yellow[8]
                      : theme.colors.green[8],
                  borderRadius: "4px",
                  color: "#fff",
                  maxWidth: "9ch",
                  padding: "4px",
                })}
              >
                {cell.getValue<number>().toFixed(2)}
              </Box>
            ),
          },
          {
            accessorFn: (row) => row.weightedCyclesPG,
            header: "Weighted Cycles PG",
            id: "weightedCycles",
            size: 50,
            Cell: ({ cell }) => (
              <Box
                sx={(theme) => ({
                  backgroundColor:
                    cell.getValue<number>() < 5
                      ? theme.colors.red[8]
                      : cell.getValue<number>() >= 5 &&
                        cell.getValue<number>() < 10
                      ? theme.colors.yellow[8]
                      : theme.colors.green[8],
                  borderRadius: "4px",
                  color: "#fff",
                  maxWidth: "9ch",
                  padding: "4px",
                })}
              >
                {cell.getValue<number>().toFixed(2)}
              </Box>
            ),
          },
          {
            accessorFn: (row) =>
              parseFloat(row.scoringAccuracy.toFixed(2)) * 100,
            header: "Scoring Accuracy %",
            id: "Scoring Accuracy",
            size: 50,
          },
          {
            accessorFn: (row) => parseFloat(row.coneAccuracy.toFixed(2)) * 100,
            header: "Cone Accuracy %",
            id: "cone accuracy",
            size: 50,
          },
          {
            accessorFn: (row) => parseFloat(row.cubeAccuracy.toFixed(2)) * 100,
            header: "Cube Accuracy %",
            id: "cube accuracy",
            size: 50,
          },
          {
            accessorFn: (row) =>
              "Lower: " +
              row.scoringPositions[0].toFixed(2) +
              " | Middle: " +
              row.scoringPositions[1].toFixed(2) +
              " | Top: " +
              row.scoringPositions[2].toFixed(2),
            header: "Scoring Position",
            id: "Scoring Position",
            size: 50,
          },
          {
            accessorFn: (row) => row.autoClimbPPG.toFixed(2),
            header: "Auto Climb PPG",
            id: "auto climb ppg",
            size: 50,
          },
          {
            accessorFn: (row) => row.teleopClimbPPG.toFixed(2),
            header: "Teleop Climb PPG",
            id: "teleop climb ppg",
            size: 50,
          },
          {
            accessorFn: (row) => row.autoPiecesPG.toFixed(2),
            header: "Auto Pieces PG",
            id: "auto pieces",
            size: 50,
          },
          {
            accessorFn: (row) => row.teleopPiecesPG.toFixed(2),
            header: "Teleop Pieces PG",
            id: "teleop pieces",
          },
          {
            accessorFn: (row) => row.linkPG.toFixed(2),
            header: "Link PG",
            id: "link pg",
            size: 50,
          },
          {
            accessorFn: (row) => row.PPG.toFixed(2),
            header: "PPG",
            id: "PPG",
            size: 50,
          },
        ],
      },
    ],
    []
  );

  return (
    <MantineReactTable
      columns={columns}
      data={data}
      enableColumnFilterModes
      enableColumnOrdering
      enableGrouping
      enablePinning
      initialState={{
        columnVisibility: { required: false, description: false },
        density: "xs",
        showGlobalFilter: true,
        sorting: [
          { id: "required", desc: true },
          { id: "propName", desc: false },
        ],
        showColumnFilters: true,
      }}
    />
  );
};

export function AggregateRow({ data }: { data: teamAggData }) {
  return (
    <>
      <td>{data.team}</td>
      <td>{data.matchesPlayed}</td>
      <td>{data.autoPPG.toFixed(2)}</td>
      <td>{data.PPG.toFixed(2)}</td>
      <td>{data.cyclesPG.toFixed(2)}</td>
      <td>{data.weightedCyclesPG.toFixed(2)}</td>
      <td>{parseFloat(data.scoringAccuracy.toFixed(2)) * 100}</td>
      <td>{parseFloat(data.coneAccuracy.toFixed(2)) * 100}</td>
      <td>{parseFloat(data.cubeAccuracy.toFixed(2)) * 100}</td>
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
    </>
  );
}
