import { convertCycleServer } from "../lib/clientCycleToServer";
import { matchData, mobility, scoreMatch } from "./AddData";
import { getNeoSession } from "./Session";

export interface clientCycle {
    x: number,
    y: number,
    auto: boolean,
    grid: number,
    level: number,
    cone: boolean,
    link: boolean,
    position: number
}

export async function submitMatch(match: matchData){

    scoreMatch(match)

}