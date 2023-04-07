import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { calculateTeamAgg, getMatchList, getTeamAgg } from "../neo4j/Aggregate";
import { teamAggData } from "../utils";
import { TextInput } from "@mantine/core";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

//default data for radarChart
export let data = {
  labels: [
    "Cycles",
    "Auto Climb ",
    "Teleop Climb",
    "Auto Pieces",
    "Level 1",
    "Level 2",
    "Level 3",
  ],
  datasets: [
    {
      label: "Team ?",
      data: [0, 0, 0, 0, 0, 0, 0],
      backgroundColor: "rgba(255, 0, 0, 0.2)",
      borderColor: "rgba(255, 0, 0, 1)",
      borderWidth: 1,
    },
    {
      label: "Team ?",
      data: [0, 0, 0, 0, 0, 0, 0],
      backgroundColor: "rgba(0, 255, 0, 0.2)",
      borderColor: "rgba(0, 255, 0, 1)",
      borderWidth: 1,
    },
    {
      label: "Team ?",
      data: [0, 0, 0, 0, 0, 0, 0],
      backgroundColor: "rgba(0, 0, 255, 0.2)",
      borderColor: "rgba(0, 0, 255, 1)",
      borderWidth: 1,
    },
  ],
};
//changes data for radar chart

function changeData({
  teamData,
  team,
  num,
}: {
  teamData: teamAggData;
  team: number;
  num: number;
}) {
  let strLabel = "Team " + team;
  let bgColor =
    "rgba(" +
    (num % 3 == 0 ? "0, 0, 255," : num % 2 == 0 ? "0, 255, 0," : "255, 0, 0,") +
    " 0.2)";
  let bdColor =
    "rgba(" +
    (num % 3 == 0 ? "0, 0, 255," : num % 2 == 0 ? "0, 255, 0," : "255, 0, 0,") +
    " 1)";
  let newData = [
    parseFloat(teamData.cyclesPG + ""),
    parseFloat(teamData.autoClimbPPG + ""),
    parseFloat(teamData.teleopClimbPPG + ""),
    parseFloat(teamData.autoPiecesPG + ""),
    parseFloat(teamData.scoringPositions[0] + ""),
    parseFloat(teamData.scoringPositions[1] + ""),
    parseFloat(teamData.scoringPositions[2] + ""),
  ];
  let newDataset = {
    label: strLabel,
    data: newData,
    backgroundColor: bgColor,
    borderColor: bdColor,
    borderWidth: 1,
  };
  // data.datasets[num - 1] = newDataset
  switch (num) {
    case 1:
      data.datasets = [newDataset, data.datasets[1], data.datasets[2]];
      break;
    case 2:
      data.datasets = [data.datasets[0], newDataset, data.datasets[2]];
      break;
    case 3:
      data.datasets = [data.datasets[0], data.datasets[1], newDataset];
      break;
  }
}
//text input to put in specific team
function TeamInput({ setTeam, num }: { setTeam: Function; num: number }) {
  let str = "Team: #" + num;
  return (
    <TextInput
      value={num}
      label={str}
      withAsterisk
      onChange={(event) => setTeam(event.currentTarget.value)}
    />
  );
}
//calculates team aggregate data
async function RadarData({ team, num }: { team: number; num: number }) {
  const [teamData, setTeamData] = useState<teamAggData>();
  useEffect(() => {
    async function getData() {
      setTeamData(await getTeamAgg({ team: parseInt(team + "") }));
    }
    getData();
  }, [team]);

  if (teamData != undefined) {
    changeData({
      teamData: teamData,
      team: team,
      num: num,
    });
  }
}

//shows radar chart
export function RadarChart({ teams }: { teams: number[] }) {
  const [teamOne, setTeamOne] = useState(teams[0]);
  const [teamTwo, setTeamTwo] = useState(teams[1]);
  const [teamThree, setTeamThree] = useState(teams[2]);

  RadarData({ team: parseInt(teamOne + ""), num: 1 });
  RadarData({ team: parseInt(teamTwo + ""), num: 2 });
  RadarData({ team: parseInt(teamThree + ""), num: 3 });

  return (
    <>
      <div style={{ backgroundColor: "white" }}>
        <div>
          <TeamInput setTeam={setTeamOne} num={teamOne} />
          <TeamInput setTeam={setTeamTwo} num={teamTwo} />
          <TeamInput setTeam={setTeamThree} num={teamThree} />
          <div
            style={{
              height: "100vh",
              position: "relative",
              marginBottom: "1%",
              padding: "1%",
            }}
          >
            <Radar
              data={data}
              options={{
                scales: { r: { pointLabels: { font: { size: 10 } } } },
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
