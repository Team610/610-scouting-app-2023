import { Session } from "next-auth";
import { getNeoSession } from "./Session";
import neo4j from 'neo4j-driver'

// returns how many game pieces the robot scored in that row: 1 is bottom, 3 is top
export async function getTeamScoreLocation(team : number, row : number, teleop: boolean, tx: any){
    try{
        const result = await tx.run(
            'MATCH (t:Team {name: $name})--(c:Cycle)-[]->(s:ScoringPosition) WHERE s.name/9 = $row AND c.teleop = $teleTrue RETURN count(*)',
                {name: team, row: row - 1, teleTrue: teleop},
        )
        return result.records[0].get(0).low
    }catch(error){
        console.error(error)
    }
}

// get the number of cycles a team did in a match
export async function getNumberCycles(team: number, match: number, tx: any){
    const result = await tx.run(
        'MATCH (t:Team {name: $name})-[{match: $match}]->(c:Cycle) RETURN count(*)',
        { name: team, match: match },
    )
    return result.records[0].get(0).low;
}

// returns nodes connected to a team node in a given match
export async function getMatchNodes(team: number, match: number, tx: any){
    const result = await tx.run(
        'MATCH (t:Team {name: $name})-[r{match: $match}]-(c) RETURN *',
        { name: team, match: match },
    )
    return result;
}
export async function getnumberOfLinksMatch(team: number, match: number, tx: any){
    const result = await tx.run(
        'MATCH (t:Team {name: $name})-[r{match: $match}]-(c:Cycle)-[o{link:true}]-(s:ScoringPosition) RETURN *',
        { name: team, match: match },
    )
    let returnValue:number = 0;
    if(result.records.length>0) {
        returnValue = result.records.length-1
    }
    return returnValue;
}
export async function getnumberOfLinks(team: number, tx: any){
    const result = await tx.run(
        'MATCH (t:Team {name: $name})--(c:Cycle)-[o{link:true}]-(s:ScoringPosition) RETURN *',
        { name: team},
    )
    let returnValue:number = 0;
    if(result.records.length>0) {
        returnValue = result.records.length-1
    }
    return returnValue;
}

// get where team picked up pieces in a match
export async function getPiecesPickedUp(team: number, match:number, piece: string, tx:any){
    //cones picked up
    const result = await tx.run(
        'MATCH (t:Team {name: $name})-[:' + piece + '{match: $match}]->(c:Cycle) RETURN count(*)',
        { name: team, match: match, piece: piece},
    )
    return result.records[0].get(0).low;
}

// returns how many game pieces the robot scored in that row IN A MATCH: 1 is bottom, 3 is top
export async function getTeamMatchScoreLocation(team : number, row : number, match: number, teleop: boolean, tx:any){
    try{
        const result = await tx.run(
            'MATCH (t:Team {name: $name})--(c:Cycle)-[{match: $match}]->(s:ScoringPosition) WHERE s.name/9 = $row AND c.teleop = $teleTrue RETURN count(*)',
                {name: team, row: row - 1, teleTrue: teleop, match: match},
        )
        return result.records[0].get(0).low
    }catch(error){
        console.error(error)
    }
}

//takes the team number as a parameter, returns an object with the following format
/*
    team: team,
    autoPoints: autoPoints,
    points: points,
    autoPointsPerGame: autoPointsPerGame,
    pointsPerGame: pointsPerGame,
    matchesPlayed: matchesPlayed
 */
export async function getTeam({ team }: { team: number }) {
    const session = getNeoSession()

    let autoPoints: number = 0
    let points: number = 0
    let matchesPlayed: number = 0

    try{
        const tx = session.beginTransaction()

        //auto points
        autoPoints += 3 * await getTeamScoreLocation(team, 1, false, tx)
        autoPoints += 4 * await getTeamScoreLocation(team, 2, false, tx)
        autoPoints += 6 * await getTeamScoreLocation(team, 3, false, tx)
        try {
            const tx = session.beginTransaction()
            const result = await tx.run(
                'MATCH (t:Team {name: $name})-[]-(c:Mobility) RETURN count(*)',
                {name: team},
            )
            autoPoints += result.records[0].get(0).low * 3;

            await tx.commit()
        } catch (error) {
            console.error(error)
        }
        try {
            const tx = session.beginTransaction()
            const result = await tx.run(
                'MATCH (t:Team {name: $name})-[r:DOCKED]-(c:AutoClimb) RETURN count(*)',
                {name: team},
            )
            autoPoints += result.records[0].get(0).low * 8;

            await tx.commit()
        } catch (error) {
            console.error(error)
        }
        try {
            const tx = session.beginTransaction()
            const result = await tx.run(
                'MATCH (t:Team {name: $name})-[r:ENGAGED]-(c:AutoClimb) RETURN count(*)',
                {name: team},
            )
            autoPoints += result.records[0].get(0).low * 12;

            await tx.commit()
        } catch (error) {
            console.error(error)
        }
        points = autoPoints
        points += 2 * await getTeamScoreLocation(team, 1, true, tx)
        points += 3 * await getTeamScoreLocation(team, 2, true, tx)
        points += 5 * await getTeamScoreLocation(team, 3, true, tx)
        points += 5 * await getnumberOfLinks(team,tx);

        try {
            const tx = session.beginTransaction()
            const result = await tx.run(
                'MATCH (t:Team {name: $name})--(c:Park) RETURN count(*)',
                {name: team},
            )
            points += result.records[0].get(0).low * 2;

            await tx.commit()
        } catch (error) {
            console.error(error)
        }
        try {
            const tx = session.beginTransaction()
            const result = await tx.run(
                'MATCH (t:Team {name: $name})-[r:DOCKED]-(c:TeleopClimb) RETURN count(*)',
                {name: team},
            )
            points += result.records[0].get(0).low * 6;

            await tx.commit()
        } catch (error) {
            console.error(error)
        }
        try {
            const tx = session.beginTransaction()
            const result = await tx.run(
                'MATCH (t:Team {name: $name})-[r:ENGAGED]-(c:TeleopClimb) RETURN count(*)',
                {name: team},
            )
            points += result.records[0].get(0).low * 10;

            await tx.commit()
        } catch (error) {
            console.error(error)
        }

        const tmp = await tx.run(
            'MATCH (t:Team {name: $name})-[r]->(n) RETURN COUNT(DISTINCT r.match)',
            { name: team, },
        )
        matchesPlayed = tmp.records[0].get(0).low
        await tx.commit()
        

    }catch(error){
        console.error(error)
    }

    let matchData: Object = {
        team: team,
        autoPoints: autoPoints,
        points: points,
        autoPointsPerGame: autoPoints / matchesPlayed,
        pointsPerGame: points / matchesPlayed,
        matchesPlayed: matchesPlayed
    }

    console.log(matchData)
    return (
        matchData
    )
}

//takes the team and match numbers as paramters, returns object  in the following format
/*
    team: team,
    match: match,
    mobility: mobility,
    park: park,
    teleopClimb: teleopClimb,
    autoClimb: autoClimb,
    numPartners: numPartners,
    allies: allies,
    enemies: enemies,
    cycles: cycles,
    cubesPickedUp: cubesPickedUp,
    conesPickedUp: conesPickedUp,
    cubesScored: cubes scored,
    conesScored: cones scored,
    autoPoints: points scored in auto,
    points: points scored in total,
    piecesScored: pieces scored in total,
    scoringAccuracy: scoring accuracy
    */

export async function getMatch(team: number, match: number) {
    const session = getNeoSession()

    let matchNodes: any
    let nCycles: number
    let teleopClimb: number = 0
    let autoClimb: number = 0
    let numPartners: number = 0
    let cycles: Object[] = new Array
    let allies: number[] = new Array(2)
    let enemies: number[] = new Array(3)
    let mobility: boolean = false;
    let park: boolean = false;
    let autoPoints: number = 0
    let points: number = 0
    let piecesScored = 0
    let cubesPickedUp = 0
    let conesPickedUp = 0
    let scoringAccuracy: number = 0

    try {
        const tx = session.beginTransaction()
        var result: any
        
        nCycles = await getNumberCycles(team, match, tx)
        cycles = new Array(nCycles)

        // matches to a team
        matchNodes = await getMatchNodes(team, match, tx);


        for (let index = 0; index < matchNodes.records.length; index++) {
            switch (matchNodes.records[index]._fields[0].labels[0]) {
                case "Cycle":
                    cycles.push(matchNodes.records[index]._fields[0].properties)
                    break;
                case "AutoClimb":
                    if (matchNodes.records[index]._fields[1].type == "DOCKED") {
                        autoClimb = 1
                        autoPoints+=8
                    } else {
                        autoClimb = 2
                        autoPoints+=12
                    }
                    break;
                case "TeleopClimb":
                    numPartners = matchNodes.records[index]._fields[1].properties.numPartners.low
                    if (matchNodes.records[index]._fields[1].type == "DOCKED") {
                        teleopClimb = 1
                        points+=6
                    } else {
                        teleopClimb = 2
                        points+=10
                    }
                    break;

                case "Team":
                    if (matchNodes.records[index]._fields[1].type == "ALLY") {
                        allies.push(matchNodes.records[index]._fields[0].properties.name.low)
                    } else {
                        enemies.push(matchNodes.records[index]._fields[0].properties.name.low)
                    }
                    break;
                case "Mobility":
                    mobility = true;
                    autoPoints+=3
                    break;
                case "Park":
                    park = true;
                    points +=2
                    break;
                default:
                    break;
            }
        }

        cubesPickedUp = await getPiecesPickedUp(team, match, "CUBE", tx)
        conesPickedUp = await getPiecesPickedUp(team, match, "CONE", tx)


        autoPoints += 3 * await getTeamMatchScoreLocation(team, 1, match, false, tx)
        autoPoints += 4 * await getTeamMatchScoreLocation(team, 2, match, false, tx)
        autoPoints += 6 * await getTeamMatchScoreLocation(team, 3, match, false, tx)
        points += autoPoints
        points += 2 * await getTeamMatchScoreLocation(team, 1, match, true, tx)
        points += 3 * await getTeamMatchScoreLocation(team, 2, match, true, tx)
        points += 5 * await getTeamMatchScoreLocation(team, 3, match, true, tx)
        points += 5 * await getnumberOfLinksMatch(team,match,tx)

        const result = await tx.run(
            'MATCH (t:Team {name: $name})-[{match: $match}]-(c:Cycle)-[]->(s:ScoringPosition) RETURN count(*)',
            { name: team, match: match },
        )
        piecesScored = result.records[0].get(0).low;
    }catch(error){
       console.error(error)
    }


    let matchData: Object = {
        team: team,
        match: match,
        mobility: mobility,
        park:park,
        teleopClimb: teleopClimb,
        autoClimb: autoClimb,
        numPartners: numPartners,
        allies: allies,
        enemies: enemies,
        cycles: cycles,
        cubesPickedUp: cubesPickedUp,
        conesPickedUp: conesPickedUp,
        autoPoints: autoPoints,
        points: points,
        piecesScored: piecesScored,
        scoringAccuracy: piecesScored / (cubesPickedUp + conesPickedUp)
    }

    console.log(matchData)
    return (
        matchData
    )
}

//a useless function used for testing
//takes the team number as paramete, returns number of cubes scored
export async function getAmountCube({ team }: { team: number }) {
    const session = getNeoSession()
    const tx = session.beginTransaction()
    try {
      const tx = session.beginTransaction()
      const result = await tx.run(
        'MATCH (t:Team {name: $name})-[:CUBE]->(c:Cycle) RETURN count(*)',
        { name: team },
      )
      console.log(result.records[0].get(0).low)
      
      await tx.commit()
      
    } catch (error) {
      console.error(error)
    }
  }