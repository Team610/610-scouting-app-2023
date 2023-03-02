import { getCompTeams, getMatch, getTeam, teamData } from "../neo4j/Aggregate";
import { createNTeams, addDummyData } from "../neo4j/AddData";
import { query, wipe } from "../neo4j/Miscellaneous";
import { Button, Table } from "@mantine/core";
import sampleMatch from "../data/sampleMatch.json";
import { Input } from "@mantine/core";
import { useEffect, useState } from "react";

export function CompareTeamData({ teams }: { teams: Array<number>}) {
    const [data6, setData6] = useState<teamData[]>()
    const teamRoles = ["Blue 1", "Blue 2", "Blue 3", "Red 1", "Red 2", "Red 3"]

    useEffect(() => {
        async function getData() {
            console.log("getting data")
            setData6(await getCompTeams(teams))
        }
        getData()
    }, [])

    const ths = (
        <tr>
            <th>Team</th>
            <th>In this game</th>
            <th>Matches Played</th>
            <th>Auto PPG</th>
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


    const rows = data6 ? data6.map((data : teamData, index : number) => (
        <tr key={data.team}>
             <td>{data.team}</td>
             <td>{teamRoles[index]}</td>
             <td>{data.matchesPlayed}</td>
             <td>{data.autoPPG}</td>
             <td>{data.PPG}</td>
             <td>{data.cyclesPG}</td>
             <td>{data.scoringAccuracy}</td>
             <td>{data.coneAccuracy}</td>
             <td>{data.cubeAccuracy}</td>
             <td>{"Lower: " + data.scoringPositions[0] + " Middle: " + data.scoringPositions[1] + " Top: " + data.scoringPositions[2]}</td>
             <td>{data.autoClimbPPG}</td>
             <td>{data.teleopClimbPPG}</td>
             <td>{data.climbPPG}</td>
             <td>{data.linkPG}</td>
        </tr>
    )) : <></>;


    return (
        <>
            <Table>
                <thead>{ths}</thead>
                <tbody>{rows}</tbody>
            </Table>
        </>
    );
}

export default function CompareTeams() {
    return (
        <div>
            <Button onClick={async () => await createNTeams(20)}>Create dummy teams</Button>
            <Button onClick={async () => await addDummyData({ data: sampleMatch })}>
                Add dummy data
            </Button>
            <Button onClick={async () => await wipe()}>
                Wipe
            </Button>

            <CompareTeamData teams={[1, 2, 3, 4, 5, 6]}/>
        </div>
    );
}