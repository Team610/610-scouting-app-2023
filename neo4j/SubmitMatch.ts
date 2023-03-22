import { convertCycleServer } from "../lib/clientCycleToServer";
import { matchData } from "../utils";
import { mobility, scoreMatch } from "./AddData";
import { calculateTeamAgg, setTeamAgg } from "./Aggregate";
import { getNeoSession } from "./Session";

export interface clientCycle {
    x: number,
    y: number,
    substation: string,
    auto: boolean,
    level: number,
    cone: boolean,
    link: boolean,
    dropped: boolean
}

export async function submitMatch(match: matchData){

    scoreMatch(match)
    setTeamAgg({team_agg_data: await calculateTeamAgg({team: match.team})})

}