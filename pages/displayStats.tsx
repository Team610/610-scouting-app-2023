import { Table } from '@mantine/core';
import { Text } from '@mantine/core';
import { match } from 'assert';
import { useEffect } from 'react';
import { getTeam, getMatch } from '../neo4j/Aggregate';

export interface teamData {
  autoPoints: number,
  autoPointsPerGame: number,
  matchesPlayed: number,
  points: number,
  pointsPerGame: number,
  team: number
}
export interface matchData {
  allies: [],
  autoClimb: number,
  autoPoints: number,
  conesPickedUp: number,
  cubesPickedUp: number,
  cycles: [],
  enemies: [],
  match: number,
  mobility: boolean,
  numPartners: number,
  park: boolean,
  piecesScored: number,
  points: number,
  scoringAccuracy: number,
  team: number,
  teleopClimb: number,
}

export default function display(props:{teamInfo: teamData, matchInfo: matchData}) {
  console.log(props.teamInfo)
  return (
    <>
      <div style={{ display: "flex", flexDirection: "row", gap: "25px" }}>
        {/* <div>
          <Text size="xl">Team Data</Text>
          <DisplayTeamData data={teamInfo} inter={} />
        </div>
        <div>
          <Text size="xl">Match Data</Text>
          <DisplayMatchData data={matchInfo} team={false} />
        </div> */}
        <DisplayTeamData />
      </div>
    </>
  )
}

export function DisplayTeamData() {
  let data;
  useEffect(() => {
    async function getData(){
      data = await getTeam({ team: 16 })
      console.log(data)
    }

    getData()
  })

   const ths = (
     <tr>
       <th>Team</th>
       <th>Auto Points</th>
       <th>APG</th>
      <th>Points</th>
       <th>PPG</th>
       <th># of Matches</th>
     </tr>
  );

   const rows = (
     <tr key={data.team}>
       <td>{data.team}</td>
       <td>{data.autoPoints}</td>
     <td>{data.autoPointsPerGame}</td>
      <td>{data.points}</td>
       <td>{data.pointsPerGame}</td>
      <td>{data.matchesPlayed}</td>
    </tr>);


  return (
    <>
      <Table>
        {/* <thead>{ths}</thead>
        <tbody>{rows}</tbody> */}
      </Table>
    </>
  );
}
function DisplayMatchData({ data, team }: { data: matchData, team: boolean }) {

  const ths = (

    <tr>
      <th>Team</th>
      <th>Match</th>
      <th>Auto Points</th>
      <th>Auto Climb</th>
      <th>Cones Picked Up</th>
      <th>Cubes Picked Up</th>
      <th>Pieces Scored</th>
      <th>Scoring Accuracy</th>
      <th>Cycles</th>
      <th>Mobility</th>
      <th>Park</th>
      <th>Teleop Climb</th>
      <th># of Partners</th>
      <th>Points</th>
      <th>Enemies</th>
    </tr>
  );


  const rows = (
    <tr key={data.team}>
    <td>{data.team}</td>
    <td>{data.match}</td>
    <td>{data.autoPoints}</td>
    <td>{data.autoClimb}</td>
    <td>{data.conesPickedUp}</td>
    <td>{data.cubesPickedUp}</td>
    <td>{data.piecesScored}</td>
    <td>{data.scoringAccuracy}</td>
    <td>{data.cycles}</td>
    <td>{data.mobility}</td>
    <td>{data.park}</td>
    <td>{data.teleopClimb}</td>
    <td>{data.numPartners}</td>
    <td>{data.points}</td>
    <td>{data.enemies}</td>
  </tr>);


  return (
    <>
      <Table>
        <thead>{ths}</thead>
        <tbody>{rows}</tbody>
      </Table>
    </>
  );
}