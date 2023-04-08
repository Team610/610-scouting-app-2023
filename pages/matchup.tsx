import {
    getCompTeams,
    getMatch,
    calculateTeamAgg,
    getTeamAgg,
} from "../neo4j/Aggregate";
import { createNTeams, addDummyData } from "../neo4j/AddData";
import { query, wipe } from "../neo4j/Miscellaneous";
import { Button, Table, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { defaultTeam, teamAggData } from "../utils";
import sampleMatch from "../data/sampleMatch.json";

export function Matchup({ teams }: { teams: Array<number> }) {
    const [data, setData] = useState<teamAggData[]>();
    const teamRoles = ["Blue 1", "Blue 2", "Blue 3", "Red 1", "Red 2", "Red 3", "Blue TOT", "Red TOT"];

    useEffect(() => {
        async function getData() {
            let tempD = await getCompTeams(teams)
            let blueT = defaultTeam
            for (const teamD of tempD.slice(0, 3)){
                for (const property in teamD){
                    if(property == "scoringPositions"){
                        blueT[property][0] += teamD[property][0]
                        blueT[property][1] += teamD[property][1]
                        blueT[property][2] += teamD[property][2]
                    }else if(property == "cubeCycleProportion"){
                        blueT[property] = 0
                    }else if(typeof teamD[property] === 'number' && typeof blueT[property] === 'number'){
                        let temp: number = blueT[property] as number
                        temp += teamD[property] as number
                        blueT[property] = temp
                    }
                }
            }
        }
        getData();
    }, [teams]);

    const ths = (
        <tr>
            <th>Team</th>
            <th>In this game</th>
            <th>EXP auto no climb</th>
            <th>MAX auto no climb</th>
            <th>EXP teleop high</th>
            <th>MAX teleop high</th>
            <th>EXP teleop mid</th>
            <th>MAX teleop mid</th>
            <th>EXP teleop low</th>
            <th>MAX teleop low</th>
            <th>EXP links</th>
            <th>MAX links</th>
            <th>EXP teleop points</th>
            <th>MAX teleop points</th>
            <th>EXP points w/o climb</th>
            <th>MAX points w/o climb</th>
            <th>EXP cycles</th>
            <th>MAX cycles</th>
        </tr>
    );

    const rows = data ? (
        data.map((data: teamAggData, index: number) => (
            <tr key={data.team}>
                <td>{data.team}</td>
                <td>{teamRoles[index]}</td>
                <td>{data.autoNoClimb}</td>
                <td>{-1}</td>
                <td>{data.scoringPositions[2]}</td>
                <td>{-1}</td>
                <td>{data.scoringPositions[1]}</td>
                <td>{-1}</td>
                <td>{data.scoringPositions[0]}</td>
                <td>{-1}</td>
                <td>{data.linkPG}</td>
                <td>{-1}</td>
                <td>{2 * data.scoringPositions[0] + 3 * data.scoringPositions[1] + 5 * data.scoringPositions[2]}</td>
                <td>{-1}</td>
                <td>{data.autoNoClimb + 2 * data.scoringPositions[0] + 3 * data.scoringPositions[1] + 5 * data.scoringPositions[2]}</td>
                <td>{-1}</td>
                <td>{data.cyclesPG}</td>
                <td>{-1}</td>
            </tr>
        ))
    ) : (
        <></>
    );

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
    const [teams, setTeams] = useState<number[]>([]);

    return (
        <div>
            <TextInput
                onChange={(e) => {
                    setTeams(e.target.value.split(" ").map((x) => parseInt(x)));
                    console.log(teams);
                }}
            ></TextInput>

            <Matchup teams={teams} />
        </div>
    );
}

export function AggregateRow({ data }: { data: teamAggData }) {
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
        </tr>
    );
}
