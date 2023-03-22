import { clientCycle } from "../neo4j/SubmitMatch";
import { cycleData, revPegPosition } from "../utils";

export function convertCycleServer(cycles: Array<clientCycle>){
    let serverCycles: Array<cycleData> = [];
    for (let i = 0; i < cycles.length; i++){
        let substation = cycles[i].substation
        let teleop = !cycles[i].auto
        let level = cycles[i].level
        let link = cycles[i].link
        let object = cycles[i].cone ? "cone" : "cube"
        serverCycles.push({substation, teleop, level, link, object})
    }

    return serverCycles
}