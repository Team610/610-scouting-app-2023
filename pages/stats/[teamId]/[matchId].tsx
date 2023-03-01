import { Table } from '@mantine/core';
import { Text } from '@mantine/core';
import { match } from 'assert';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getTeam } from '../../../neo4j/Aggregate';

export interface teamData {
    team: number,
    autoPoints: number,
    points: number,
    autoPointsPerGame: number,
    pointsPerGame: number,
    matchesPlayed: number
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

export let defaultTeam = {
    team: null,
    autoPoints: 0,
    points: 0,
    autoPointsPerGame: 0,
    pointsPerGame: 0,
    matchesPlayed: 0
}
export default function display(props: { teamInfo: teamData, matchInfo: matchData }) {
    let data = defaultTeam;
    const router = useRouter();
    const {teamId, matchId} = router.query;
    console.log(props.teamInfo)
    return (
        <>
            <div style={{ display: "flex", flexDirection: "row", gap: "25px" }}>
                <div>
                    <Text size="xl">Team Data</Text>
                    <DisplayTeamData teamId={parseInt(teamId+"")}/>
                </div>
                
            </div>
        </>
    )
}

/*
<div>
                    <Text size="xl">Match Data</Text>
                    <DisplayMatchData data={matchInfo} team={false} />
                </div>
                <DisplayTeamData />
*/
export function DisplayTeamData({teamId }: { teamId: number}) {
    let data;
    useEffect(() => {
        async function getData() {
            data = await getTeam({ team: teamId })
            console.log(data)
        }

        getData()
    })
    if(data == undefined) data = defaultTeam
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





/*export async  function getTeam(n: number) {
    const session = getNeoSession()
    const tx = session.beginTransaction()
    let teamFound;
    try { 
        const cypher = `MATCH (t:Team {name: $name}) RETURN count(t) > 0` 
        const params = {name: n}
        const res = await tx.run(cypher, params)
        await tx.commit();
        res.records.map((record: Record) => {
            teamFound = record.get('count(t) > 0');
        })
    } finally {
        await session.close();
    }
    console.log(teamFound);
    
    return teamFound;
}*/