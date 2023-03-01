import { Table, Text } from '@mantine/core';
import { match } from 'assert';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getTeam, getMatch, TeamAggData } from '../../../neo4j/Aggregate';


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


export default function display() {
    const router = useRouter();
    const teamId = router.query;
    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: "50px" }}>
                <div>
                    <Text size="xl" style={{display: "flex", justifyContent: "space-around"}}>Team Data</Text>
                    <DisplayTeamData teamId={parseInt(teamId.teamId+"")}/>
                </div>
                <div>
                    <Text size="xl" style={{display: "flex", justifyContent: "space-around"}}>Match Data</Text>
                    <DisplayMatchData teamId={parseInt(teamId.teamId+"")}/>
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
export interface TeamData {
    team: number,
    matchesPlayed: number,
    autoPointsPerGame: number,
    autoPoints: number,
    points: number,
    pointsPerGame: number,
    cyclesPerGame: number,
    scoringAccuracy: number,
    coneAccuracy: number,
    cubeAccuracy: number,
    scoringPositions: Array<number>,
    autoClimbPPG: number,
    teleopClimbPPG: number,
    climbPPG: number,
    linkPG: number
}

let defaultTeam: Object = {
    team: 0,
    matchesPlayed: 0,
    autoPointsPerGame: 0,
    autoPoints: 0,
    points: 0,
    pointsPerGame: 0,
    cyclesPerGame: 0,
    scoringAccuracy: 0,
    coneAccuracy: 0,
    cubeAccuracy: 0,
    scoringPositions: 0,
    autoClimbPPG: 0,
    teleopClimbPPG: 0,
    climbPPG: 0,
    linkPG: 0,
}

export function DisplayTeamData({ teamId }: { teamId: number }) {
    const [data, setData] = useState<TeamAggData>()
    
    useEffect(() => {
        async function getData() {
            setData(await getTeam({ team: teamId }))
        }

        getData()
    })
    
    //if(data == undefined) data = defaultTeam;
    const ths = (
        <tr>
            <th>Team</th>
            <th>Matches Played</th>
            <th>Auto PPG</th>
            <th>Auto Points</th>
            <th>Points</th>
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

    return (
        <>
            <Table>
                <thead>{ths}</thead>
                <tbody>{data ? <tr key={data.team}>
                <td>{data.team}</td>
                <td>{data.matchesPlayed}</td>
                <td>{data.autoPointsPerGame}</td>
                <td>{data.autoPoints}</td>
                <td>{data.points}</td>
                <td>{data.pointsPerGame}</td>
                <td>{data.cyclesPerGame}</td>
                <td>{data.scoringAccuracy}</td>
                <td>{data.coneAccuracy}</td>
                <td>{data.cubeAccuracy}</td>
                <td>{"Lower: " + data.scoringPositions[0] + " Middle: " + data.scoringPositions[1] + " Top: " + data.scoringPositions[2]}</td>
                <td>{data.autoClimbPPG}</td>
                <td>{data.teleopClimbPPG}</td>
                <td>{data.climbPPG}</td>
                <td>{data.linkPG}</td>
            </tr> : null}</tbody>
            </Table>
        </>
    );
}

let defaultMatch: Object = {
    team: 0,
    match: 0,
    mobility: false,
    park: false,
    teleopClimb: 0,
    autoClimb: 0,
    numPartners: 0,
    allies: Array(3),
    enemies: Array(3),
    cycles: [0],
    cubesPickedUp: 0,
    conesPickedUp: 0,
    autoPoints: 0,
    points: 0,
    piecesScored: 0,
    scoringAccuracy: 0
}
function DisplayMatchData({ teamId }: {teamId: number }) {
    let data = defaultMatch;
    

    const ths = (

        <tr>
            <th>Team</th>
            <th>Match</th>
            <th>Mobility</th>
            <th>Park</th>
            <th>Teleop Climb</th>
            <th>Auto Climb</th>
            <th># of Partners</th>
            <th>Allies</th>
            <th>Enemies</th>
            <th>Cycles</th>
            <th>Cubes Picked Up</th>
            <th>Cones Picked Up</th>
            <th>Auto Points</th>
            <th>Points</th>
            <th>Pieces Scored</th>
            <th>Scoring Accuracy</th>
        </tr>
    );


    const rows = (
        <tr key={data.match}>
            <td>{data.team}</td>
            <td>{data.match}</td>
            <td>{data.mobility ? "true" : "false"}</td>
            <td>{data.park ? "true" : "false"}</td>
            <td>{data.teleopClimb}</td>
            <td>{data.autoClimb}</td>
            <td>{data.numPartners}</td>
            <td>{data.allies}</td>
            <td>{data.enemies}</td>
            <td>{data.cycles}</td>
            <td>{data.cubesPickedUp}</td>
            <td>{data.conesPickedUp}</td>
            <td>{data.autoPoints}</td>
            <td>{data.points}</td>
            <td>{data.piecesScored}</td>
            <td>{data.scoringAccuracy}</td>
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