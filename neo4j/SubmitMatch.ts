import { mobility } from "./AddData";
import { getNeoSession } from "./Session";

export interface cycle {
    x: number,
    y: number,
    auto: boolean,
    grid: number,
    level: number,
    cone: boolean
}

interface match {
    team: number,
    allies: Array<number>,
    enemies: Array<number>,
    match: number,
    cycles: Array<cycle>,
    autoClimb: number, //0 -> none, 1 -> docked, 2 -> engaged
    teleopClimb: number,
    numPartners: number,
    mobility: boolean
    parked: boolean
}

export async function submitMatch(match: match){

    mobility({team: match.team, match: match.match, mobility: match.mobility})

}

export async function addCycle(cycle: cycle, team: number, match: number){
    const session = getNeoSession();



    //add cycle
    try {
        const tx = session.beginTransaction();
        const result = await tx.run(
          "CREATE (a:Cycle{x:$x,y:$y,match:toInteger($match),teleop:$teleop}) RETURN  ID(a)",
          {
            team: team,
            x: cycle.x,
            y: cycle.y,
            match: match,
            teleop: !cycle.auto,
          }        
        )

        // if(cycle.scoringPosition){

        // }
        console.log(result)
        await tx.commit();
        
    } catch(e){
        console.log(e)
    }
}