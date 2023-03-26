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
import { calculateTeamAgg, getTeamAgg } from "../neo4j/Aggregate";
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
      label: "Team #1",
      data: [0, 0, 0, 0, 0, 0, 0],
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
    },
    {
      label: "Team #2",
      data: [0, 0, 0, 0, 0, 0, 0],
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
    },
    {
      label: "Team #3",
      data: [0, 0, 0, 0, 0, 0, 0],
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
    },
  ],
};
//changes data for radar chart
function changeData({
  cycles,
  autoClimb,
  teleopClimb,
  autoPieces,
  levelOne,
  levelTwo,
  levelThree,
  team,
  num,
}: {
  cycles: number;
  autoClimb: number;
  teleopClimb: number;
  autoPieces: number;
  levelOne: number;
  levelTwo: number;
  levelThree: number;
  team: number;
  num: number;
}) {
  let strLabel = "Team " + team;
  if (num == 1) {
    data.datasets = [
      {
        label: strLabel,
        //data: [cycles * 10, autoClimb / 15 * 100, teleopClimb * 10, autoPieces * 50, cycles != 0 ? levelOne / cycles * 100 : 0, cycles != 0 ? levelTwo / cycles * 100 : 0, cycles != 0 ? levelThree / cycles * 100 : 0],
        data: [
          cycles,
          autoClimb,
          teleopClimb,
          autoPieces,
          levelOne,
          levelTwo,
          levelThree,
        ],
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        borderColor: "rgba(255, 0, 0, 1)",
        borderWidth: 1,
      },
      data.datasets[1],
      data.datasets[2],
    ];
  } else if (num == 2) {
    data.datasets = [
      data.datasets[0],
      {
        label: strLabel,
        data: [
          cycles,
          autoClimb,
          teleopClimb,
          autoPieces,
          levelOne,
          levelTwo,
          levelThree,
        ],
        backgroundColor: "rgba(0, 255, 0, 0.2)",
        borderColor: "rgba(0, 255, 0, 1)",
        borderWidth: 1,
      },
      data.datasets[2],
    ];
  } else if (num == 3) {
    data.datasets = [
      data.datasets[0],
      data.datasets[1],
      {
        label: strLabel,
        data: [
          cycles,
          autoClimb,
          teleopClimb,
          autoPieces,
          levelOne,
          levelTwo,
          levelThree,
        ],
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        borderColor: "rgba(0, 0, 255, 1)",
        borderWidth: 1,
      },
    ];
  }
}
//text input to put in specific team
function TeamInput({ setTeam, num }: { setTeam: Function; num: number }) {
  let str = "Team: #" + num;
  return (
    <TextInput
      placeholder="e.g. 610"
      label={str}
      withAsterisk
      onChange={(event) => setTeam(event.currentTarget.value)}
    />
  );
}
//calculates team aggregate data
function RadarData({ team, num }: { team: number; num: number }) {
  const [teamData, setTeamData] = useState<teamAggData>();
  useEffect(() => {
    async function getData() {
      let teamAgg = await calculateTeamAgg({ team: parseInt(team + "") });
      setTeamData(teamAgg);
    }
    getData();
  }, [team]);

  changeData({
    cycles: parseFloat((teamData != undefined ? teamData.cyclesPG : 0) + ""),
    autoClimb: parseFloat(
      (teamData != undefined ? teamData.autoClimbPPG : 0) + ""
    ),
    teleopClimb: parseFloat(
      (teamData != undefined ? teamData.teleopClimbPPG : 0) + ""
    ),
    autoPieces: parseFloat(
      (teamData != undefined ? teamData.autoPiecesPG : 0) + ""
    ),
    levelOne: parseFloat(
      (teamData != undefined ? teamData.scoringPositions[0] : 0) + ""
    ),
    levelTwo: parseFloat(
      (teamData != undefined ? teamData.scoringPositions[1] : 0) + ""
    ),
    levelThree: parseFloat(
      (teamData != undefined ? teamData.scoringPositions[2] : 0) + ""
    ),
    team: team,
    num: num,
  });
}

//shows radar chart
export function RadarChart() {
  const [teamOne, setTeamOne] = useState("");
  const [teamTwo, setTeamTwo] = useState("");
  const [teamThree, setTeamThree] = useState("");
  RadarData({ team: parseInt(teamOne + ""), num: 1 });
  RadarData({ team: parseInt(teamTwo + ""), num: 2 });
  RadarData({ team: parseInt(teamThree + ""), num: 3 });

  return (
    <>
      <div style={{ backgroundColor: "white" }}>
        <div>
          <div>
            <TeamInput setTeam={setTeamOne} num={1} />
            <TeamInput setTeam={setTeamTwo} num={2} />
            <TeamInput setTeam={setTeamThree} num={3} />
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
      </div>
    </>
  );
}
