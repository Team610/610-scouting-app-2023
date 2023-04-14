import { convertCycleServer } from "../lib/clientCycleToServer";
import { matchData } from "../utils";
import { mobility, scoreMatch } from "./AddData";
import { calculateTeamAgg, setTeamAgg } from "./Aggregate";
import { getNeoSession } from "./Session";

export interface clientCycle {
    substation: string,
    auto: boolean,
    level: number,
    cone: boolean,
    link: boolean,
    dropped: boolean
}

export async function submitMatch(match: matchData){

    fetch("/api/scoreMatch", {
        method: "POST",
        body: JSON.stringify(match)
    }).then(data => console.log(data.json()))
    // await setTeamAgg({team_agg_data: await calculateTeamAgg({team: match.team})})

}