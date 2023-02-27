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

// get where team picked up pieces in all matches
export async function getPiecesScoredAllMatches(team: number, piece: string, tx:any){
    //cones picked up
    const result = await tx.run(
        'MATCH (t:Team {name: $name})-[:' + piece + ']->() - [:SCORED] -> () RETURN count(*)',
        { name: team, piece: piece},
    )
    return result.records[0].get(0).low;
}


// get where team picked up pieces in a match, given what piece
export async function getPiecesScored(team: number, match:number, piece: string, tx:any){
    //cones picked up
    const result = await tx.run(
        'MATCH (t:Team {name: $name})-[:' + piece + '{match: $match}]->(c:Cycle) - [:SCORED] -> () RETURN count(*)',
        { name: team, match: match, piece: piece},
    )
    return result.records[0].get(0).low;
}


// get the number of cycles a team did in a match
export async function getNumberCycles(team: number, match: number, tx: any){
    const result = await tx.run(
        'MATCH (t:Team {name: $name})-[{match: $match}]->(c:Cycle) RETURN count(*)',
        { name: team, match: match },
    )
    return result.records[0].get(0).low;
}

// get the number of cycles a team did in all matches
export async function getNumberCyclesAllMatches(team: number, tx: any){
    const result = await tx.run(
        'MATCH (t:Team {name: $name})-[]->(c:Cycle) RETURN count(*)',
        { name: team},
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

// get where team picked up pieces in a match, given what piece
export async function getPiecesPickedUp(team: number, match:number, piece: string, tx:any){
    //cones picked up
    const result = await tx.run(
        'MATCH (t:Team {name: $name})-[:' + piece + '{match: $match}]->(c:Cycle) RETURN count(*)',
        { name: team, match: match, piece: piece},
    )
    return result.records[0].get(0).low;
}

// get where team picked up pieces in all matches
export async function getPiecesPickedUpAllMatches(team: number, piece: string, tx:any){
    //cones picked up
    const result = await tx.run(
        'MATCH (t:Team {name: $name})-[:' + piece + ']->(c:Cycle) RETURN count(*)',
        { name: team, piece: piece}
    )
    return result.records[0].get(0).low;
}

// returns how many game pieces the robot scored in that row IN A MATCH: 1 is bottom, 3 is top
export async function getTeamMatchScoreLocation(team : number, row : number, match: number, teleop: boolean, tx:any){
    try{
        const result = await tx.run(
            'MATCH (t:Team {name: $name})--(c:Cycle)-[{match: $match}]->(s:ScoringPosition) WHERE s.name/9 = $row AND c.teleop = $teleTrue RETURN count(*)',
                {name: team, row: row - 1, teleTrue: teleop, match: match}
        )
        return result.records[0].get(0).low
    }catch(error){
        console.error(error)
    }
}

// returns how many games a certain team played
export async function getMatchesPlayed(team : number, tx: any){
    const result = await tx.run(
        'MATCH (t:Team {name: $name})-[r]->(n) RETURN COUNT(DISTINCT r.match)',
        { name: team },
    )
    return result.records[0].get(0).low
}

//takes the team number as a parameter, returns an object with the following format
/*
    team: team,
    matchesPlayed: matchesPlayed,
    autoPPG: auto points per game,
    PPG: points per game,
    scoring accuracy: pieces scored / pieces picked up
    cone accuracy: cones scored / cones picked up
    cube accuracy: cubes scored / cubes picked up
    cycles per game: cycles per game
    scoring positions: [scored in lower, scored in middle, scored in higher]
 */
export async function getTeam({ team }: { team: number }) {
    const session = getNeoSession()

    let autoPoints: number = 0
    let points: number = 0
    let matchesPlayed: number = 0
    let conesPickedUp: number = 0
    let cubesPickedUp: number = 0
    let conesScored: number = 0
    let cubesScored: number = 0
    let ncycles: number = 0
    let scoringPositions = Array(3)

    try{
        const tx = session.beginTransaction()

        //auto points
        autoPoints += 3 * await getTeamScoreLocation(team, 1, false, tx)
        autoPoints += 4 * await getTeamScoreLocation(team, 2, false, tx)
        autoPoints += 6 * await getTeamScoreLocation(team, 3, false, tx)
        
        points = autoPoints
        points += 2 * await getTeamScoreLocation(team, 1, true, tx)
        points += 3 * await getTeamScoreLocation(team, 2, true, tx)
        points += 5 * await getTeamScoreLocation(team, 3, true, tx)

        scoringPositions[0] = await getTeamScoreLocation(team, 1, false, tx) + await getTeamScoreLocation(team, 1, false, tx)
        scoringPositions[1] = await getTeamScoreLocation(team, 2, false, tx) + await getTeamScoreLocation(team, 2, false, tx)
        scoringPositions[2] = await getTeamScoreLocation(team, 3, false, tx) + await getTeamScoreLocation(team, 3, false, tx)

        conesPickedUp = await getPiecesPickedUpAllMatches(team, "CONE", tx)
        cubesPickedUp = await getPiecesPickedUpAllMatches(team, "CUBE", tx)

        conesScored = await getPiecesScoredAllMatches(team, 'CONE', tx)
        cubesScored = await getPiecesScoredAllMatches(team, 'CONE', tx)

        ncycles = await getNumberCyclesAllMatches(team, tx)


        matchesPlayed = await getMatchesPlayed(team, tx);
        
    }catch(error){
        console.error(error)
    }

    let matchData: Object = {
        team: team,
        matchesPlayed: matchesPlayed,
        autoPointsPerGame: autoPoints / matchesPlayed,
        autoPoints: autoPoints,
        points: points,
        pointsPerGame: points / matchesPlayed,
        cyclesPerGame: ncycles / matchesPlayed,
        scoringAccuracy: (conesScored + cubesScored) / (conesPickedUp + cubesPickedUp),
        coneAccuracy: conesScored / conesPickedUp,
        cubeAccuracy: cubesScored / cubesPickedUp,
        scoringPositions: scoringPositions
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
                    } else {
                        autoClimb = 2
                    }
                    break;
                case "TeleopClimb":
                    numPartners = matchNodes.records[index]._fields[1].properties.numPartners.low
                    if (matchNodes.records[index]._fields[1].type == "DOCKED") {
                        teleopClimb = 1
                    } else {
                        teleopClimb = 2
                    }
                    break;

                case "Team":
                    if (matchNodes.records[index]._fields[1].type == "ALLY") {
                        allies.push(matchNodes.records[index]._fields[0].properties.name.low)
                    } else {
                        enemies.push(matchNodes.records[index]._fields[0].properties.name.low)
                    }
                    break;
                //default is used for mobility
                case "Mobility":
                    mobility = true;
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