import { NextApiRequest, NextApiResponse } from "next";
import { defaultTeam, roundToTwo, teamAggData } from "../../../utils";
import { getNeoSession } from "../../../neo4j/Session";
import router from "next/router";

type Data = {
    teamAgg: teamAggData
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const teamNumber = req.query.team
    if(typeof teamNumber === "string"){
        res.status(200).json({ teamAgg: await getTeamAgg(teamNumber) })
    }else{
        res.status(200)
    }
}

export async function getTeamAgg(name: String) {
    const session = getNeoSession()
    try {
        const tx = session.beginTransaction()
        const res = await tx.run("MATCH (n:TeamAgg{name: toInteger($name)}) RETURN properties(n) AS properties", { name: name })
        const pros = res.records[0].get("properties")
        const teamData = {
            team: pros.team,
            matchesPlayed: pros.matchesPlayed.low,
            autoPPG: roundToTwo(pros.autoPPG),
            PPG: roundToTwo(pros.PPG),
            cyclesPG: roundToTwo(pros.cyclesPG),
            weightedCyclesPG: roundToTwo(pros.weightedCyclesPG),
            avgPiecesScored: roundToTwo(pros.avgPiecesScored),
            maxPiecesScored: roundToTwo(pros.maxPiecesScored),
            scoringAccuracy: roundToTwo(pros.scoringAccuracy),
            coneAccuracy: roundToTwo(pros.coneAccuracy),
            cubeAccuracy: roundToTwo(pros.cubeAccuracy),
            scoringPositions: [
                parseFloat((pros.lowerScored.hasOwnProperty("low")
                    ? pros.lowerScored.low
                    : pros.lowerScored).toFixed(2)),
                parseFloat((pros.middleScored.hasOwnProperty("low")
                    ? pros.middleScored.low
                    : pros.middleScored).toFixed(2)),
                parseFloat((pros.upperScored.hasOwnProperty("low")
                    ? pros.upperScored.low
                    : pros.upperScored).toFixed(2)),
            ],
            autoClimbPPG: roundToTwo(pros.autoClimbPPG),
            teleopClimbPPG: roundToTwo(pros.teleopClimbPPG),
            climbPPG: roundToTwo(pros.climbPPG),
            linkPG: roundToTwo(pros.linkPG),
            autoPiecesPG: roundToTwo(pros.autoPiecesPG),
            teleopPiecesPG: roundToTwo(pros.teleopPiecesPG),
            cubeCycleProportion: roundToTwo(pros.cubeCycleProportion),
            autoNoClimb: roundToTwo(pros.autoNoClimb),
            teleopPPG: roundToTwo(pros.teleopPPG)
        }
        await tx.close()
        return teamData
    } catch (error) {
        console.error(error)
    } finally {
        session.close()
    }

    return defaultTeam
}