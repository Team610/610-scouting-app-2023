import { getNeoSession } from "./Session";

interface cycle {
    x: number,
    y: number,
    teleop: boolean,
    scoringPosition: number
}

interface match {
    team: number,
    allies: [number],
    enemies: [number],
    match: string,
    cycles: [cycle],
    autoClimb: number, //0 -> none, 1 -> docked, 2 -> engaged
    teleopClimb: number,
    numPartners: number,
    mobility: number
}

function submitMatch(match: match){

}

async function addCycle(cycle: cycle, team: number, match: number){
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
            teleop: cycle.teleop,
          }        
        )

        if(cycle.scoringPosition){
        }
        await tx.commit();
    } catch(e){
        console.log(e)
    }
}