import type { NextApiRequest, NextApiResponse } from 'next'
import { getNeoSession } from '../../neo4j/Session'
import { defaultTeam, roundToTwo, teamAggData } from '../../utils';

type Data = {
  teamdata: any
}

// returns a json list of aggregate data for all teams
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ teamdata: await getAgg() })
}

export async function getAgg(team?: number) {
  const session = getNeoSession();
  try {
    const tx = session.beginTransaction();
    let res = team ? await tx.run("MATCH (t:TeamAgg{name: $name}) RETURN properties(t)", { name: team }) : await tx.run("MATCH (t:TeamAgg) RETURN properties(t) AS properties")
    const ret = res.records.map((record) => {
      const pros = record.get("properties")
      const teamdata: teamAggData = {
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
      };
      return teamdata
    })

    await tx.close()

    console.log(ret)
    return ret
  } catch (error) {
    console.error(error);
  } finally {
    await session.close()
  }

  return defaultTeam;
}