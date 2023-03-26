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
      label: 'Team ?',
      data: [0, 0, 0, 0, 0, 0, 0],
      backgroundColor: 'rgba(255, 0, 0, 0.2)',
      borderColor: 'rgba(255, 0, 0, 1)',
      borderWidth: 1,
    },
    {
      label: 'Team ?',
      data: [0, 0, 0, 0, 0, 0, 0],
      backgroundColor: 'rgba(0, 255, 0, 0.2)',
      borderColor: 'rgba(0, 255, 0, 1)',
      borderWidth: 1,
    },
    {
      label: 'Team ?',
      data: [0, 0, 0, 0, 0, 0, 0],
      backgroundColor: 'rgba(0, 0, 255, 0.2)',
      borderColor: 'rgba(0, 0, 255, 1)',
      borderWidth: 1,
    },
  ],
};
//changes data for radar chart



function changeData({ teamData, team, num }: { teamData: teamAggData, team: number, num: number }) {
  let strLabel = 'Team ' + team
  console.log(teamData);
  let bgColor = 'rgba(' + (num % 3 == 0 ? "0, 0, 255," : (num % 2 == 0 ? '0, 255, 0,' : '255, 0, 0,')) + " 0.2)";
  let bdColor = 'rgba(' + (num % 3 == 0 ? "0, 0, 255," : (num % 2 == 0 ? '0, 255, 0,' : '255, 0, 0,')) + " 1)";
  switch (num) {
    case 1:
      data.datasets = [
        {
          label: strLabel,
          //data: [cycles * 10, autoClimb / 15 * 100, teleopClimb * 10, autoPieces * 50, cycles != 0 ? levelOne / cycles * 100 : 0, cycles != 0 ? levelTwo / cycles * 100 : 0, cycles != 0 ? levelThree / cycles * 100 : 0],
          data: [parseFloat(teamData.cyclesPG + ""), parseFloat(teamData.autoClimbPPG + ""), parseFloat(teamData.teleopClimbPPG + ""), parseFloat(teamData.autoPiecesPG + ""),
          parseFloat(teamData.scoringPositions[0] + ""), parseFloat(teamData.scoringPositions[1] + ""), parseFloat(teamData.scoringPositions[2] + "")],
          backgroundColor: bgColor,
          borderColor: bdColor,
          borderWidth: 1,
        },
        data.datasets[1],
        data.datasets[2]
      ]
      break;
    case 2:
      data.datasets = [data.datasets[0],
      {
        label: strLabel,
        //data: [cycles * 10, autoClimb / 15 * 100, teleopClimb * 10, autoPieces * 50, cycles != 0 ? levelOne / cycles * 100 : 0, cycles != 0 ? levelTwo / cycles * 100 : 0, cycles != 0 ? levelThree / cycles * 100 : 0],
        data: [parseFloat(teamData.cyclesPG + ""), parseFloat(teamData.autoClimbPPG + ""), parseFloat(teamData.teleopClimbPPG + ""), parseFloat(teamData.autoPiecesPG + ""),
        parseFloat(teamData.scoringPositions[0] + ""), parseFloat(teamData.scoringPositions[1] + ""), parseFloat(teamData.scoringPositions[2] + "")],
        backgroundColor: bgColor,
        borderColor: bdColor,
        borderWidth: 1,
      },
      data.datasets[2]
      ]
      break;
    case 3:
      data.datasets = [data.datasets[0],
      data.datasets[1],
      {
        label: strLabel,
        //data: [cycles * 10, autoClimb / 15 * 100, teleopClimb * 10, autoPieces * 50, cycles != 0 ? levelOne / cycles * 100 : 0, cycles != 0 ? levelTwo / cycles * 100 : 0, cycles != 0 ? levelThree / cycles * 100 : 0],
        data: [parseFloat(teamData.cyclesPG + ""), parseFloat(teamData.autoClimbPPG + ""), parseFloat(teamData.teleopClimbPPG + ""), parseFloat(teamData.autoPiecesPG + ""),
        parseFloat(teamData.scoringPositions[0] + ""), parseFloat(teamData.scoringPositions[1] + ""), parseFloat(teamData.scoringPositions[2] + "")],
        backgroundColor: bgColor,
        borderColor: bdColor,
        borderWidth: 1,
      }
      ]
      break;
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
      let teamAgg = (await calculateTeamAgg({ team: parseInt(team + "") }));
      // console.log(teamAgg);
      setTeamData(teamAgg);
    }
    getData();
  }, [team]);

  if (teamData != undefined) {
    changeData({
      teamData: teamData, team: team, num: num
    });
  }

}

//shows radar chart
export function RadarChart() {
  const [teamOne, setTeamOne] = useState('');
  const [teamTwo, setTeamTwo] = useState('');
  const [teamThree, setTeamThree] = useState('');
  RadarData({ team: parseInt(teamOne + ""), num: 1 });
  RadarData({ team: parseInt(teamTwo + ""), num: 2 });
  RadarData({ team: parseInt(teamThree + ""), num: 3 });

  return (
    <>
      <div style={{ backgroundColor: "white" }}>
        <div>
          <TeamInput setTeam={setTeamOne} num={1} />
          <TeamInput setTeam={setTeamTwo} num={2} />
          <TeamInput setTeam={setTeamThree} num={3} />
          <div style={{ height: "100vh", position: "relative", marginBottom: "1%", padding: "1%" }}>
            <Radar data={data} options={{ scales: { r: { pointLabels: { font: { size: 10 } } } } }} />
          </div>



        </div>
      </div>
    </>
  );
}
