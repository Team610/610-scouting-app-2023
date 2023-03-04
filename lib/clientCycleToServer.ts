import { cycleData } from "../neo4j/AddData";
import { clientCycle } from "../neo4j/SubmitMatch";
import { revPegPosition } from "../neo4j/Utils";

export function convertCycleServer(cycles: Array<clientCycle>){
    let serverCycles: Array<cycleData> = [];
    for (let i = 0; i < cycles.length; i++){
        let x = cycles[i].x
        let y = cycles[i].y
        let teleop = !cycles[i].auto
        let scoringPosition = (27 + revPegPosition(cycles[i].grid, cycles[i].level, cycles[i].position)) % 27
        let link = cycles[i].link
        let object = cycles[i].cone ? "cone" : "cube"
        serverCycles.push({x, y, teleop, scoringPosition, link, object})
    }

    return serverCycles
}