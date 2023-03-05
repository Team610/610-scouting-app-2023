import { Session } from "next-auth";
import { getNeoSession } from "./Session";
import neo4j from 'neo4j-driver'
import { defaultTeam, teamAggData, arrayAverage, standardDeviation } from "../utils";

// returns how many game pieces the robot scored in that row: 1 is bottom, 3 is top
export async function getTeamScoreLocation(team: number, row: number, teleop: boolean, tx: any) {
    try {
        if(row != 2){
            const result = await tx.run(
                'MATCH (t:Team {name: $name})--(c:Cycle)-[]->(s:ScoringPosition) WHERE s.name/9 = $row AND c.teleop = $teleTrue RETURN count(*)',
                { name: team, row: row - 1, teleTrue: teleop },
            )
            return result.records[0].get(0).low
        }else{
            let ret = 0
            const not17 = await tx.run(
                'MATCH (t:Team {name: $name})--(c:Cycle)-[]->(s:ScoringPosition) WHERE s.name/9 = $row AND c.teleop = $teleTrue AND s.name <> 17 RETURN count(*)',
                { name: team, row: row - 1, teleTrue: teleop },
            )
            ret += not17.records[0].get(0).low
            const yes17 = await tx.run(
                'MATCH (t:Team {name: $name})--(c:Cycle)-[]->(s:ScoringPosition) WHERE s.name/9 = $row AND c.teleop = $teleTrue RETURN count(DISTINCT c.match)',
                { name: team, row: row - 1, teleTrue: teleop },
            )
            ret += yes17.records[0].get(0).low

            return ret
        }
    } catch (error) {
        console.error(error)
    }
}

export async function getMaxPiecesScored(team: number, tx:any){
    const matches = await getMatchList(team)
    let max = 0
    for (let match in matches){
        let temp = 0
        const not17 = await tx.run(
            'MATCH (t:Team {name: $name})-[{match: $match}]->(m:Cycle) - [:SCORED] -> (q:ScoringPosition) WHERE q.name <> 17 RETURN count(m)',
            { name: team, match: match},
        )
        temp += not17.records[0].get(0).low
        const yes17 = await tx.run(
            'MATCH (t:Team {name: $name})-[{match: $match}]->(m:Cycle) - [:SCORED] -> (q:ScoringPosition) WHERE q.name = 17 RETURN count(DISTINCT m.match)',
            { name: team, match: match},
        )
        temp += yes17.records[0].get(0).low
        if (temp > max){
            max = temp
        }
    }
    return max
}

// get where team picked up pieces in all matches
export async function getPiecesScoredAllMatches(team: number, piece: string, tx: any) {
    //cones picked up
    
    let ret = 0

    const not17 = await tx.run(
        'MATCH (t:Team {name: $name})-[r:' + piece + ']->(m:Cycle) - [:SCORED] -> (q:ScoringPosition) WHERE q.name <> 17 RETURN count(m)',
        { name: team, piece: piece },
    )

    ret += not17.records[0].get(0).low

    const yes17 = await tx.run(
        'MATCH (t:Team {name: $name})-[r:' + piece + ']->(m:Cycle) - [:SCORED] -> (q:ScoringPosition) WHERE q.name = 17 RETURN count(DISTINCT m.match)',
        { name: team, piece: piece },
    )

    ret += yes17.records[0].get(0).low

    return ret
}


// get where team picked up pieces in a match, given what piece
export async function getPiecesScored(team: number, match: String, piece: string, tx: any){
    //cones picked up
    let ret = 0
    const not17 = await tx.run(
        'MATCH (t:Team {name: $name})-[:' + piece + '{match: toString($match)}]->(c:Cycle) - [:SCORED] -> (q:ScoringPosition) WHERE q.name <> 17 RETURN count(*)',
        { name: team, match: match, piece: piece},
    )
    ret += not17.records[0].get(0).low;

    const yes17 = await tx.run(
        'MATCH (t:Team {name: $name})-[:' + piece + '{match: toString($match)}]->(c:Cycle) - [:SCORED] -> (q:ScoringPosition) WHERE q.name === 17 RETURN count(DISTINCT c.match)',
        { name: team, match: match, piece: piece},
    )
    ret += yes17.records[0].get(0).low;

    return ret
}


// get the number of cycles a team did in a match
export async function getNumberCycles(team: number, match: String, tx: any){
    const result = await tx.run(
        'MATCH (t:Team {name: $name})-[{match: toString($match)}]->(c:Cycle) RETURN count(*)',
        { name: team, match: match },
    )
    return result.records[0].get(0).low;
}

// get the number of cycles a team did in all matches
export async function getNumberCyclesAllMatches(team: number, tx: any) {
    const result = await tx.run(
        'MATCH (t:Team {name: $name})-[]->(c:Cycle) RETURN count(*)',
        { name: team },
    )
    return result.records[0].get(0).low;
}

// get the weighted number of cycles a team did in all matches:
// high cycle : coefficient of 5
// middle cycle: coefficient of 3
// low cycle: coefficient of 2
export async function getWeightedCyclesAllMatches(team: number, tx: any) {
    let res : number = 0
    const lower = await tx.run(
        'MATCH (t:Team {name: $name})-[]->(c:Cycle)-[]->(m:ScoringPosition) WHERE m.name / 9 = 0 RETURN count(*)',
        { name: team },
    )
    res += 2 * lower.records[0].get(0).low;
    const middle = await tx.run(
        'MATCH (t:Team {name: $name})-[]->(c:Cycle)-[]->(m:ScoringPosition) WHERE m.name / 9 = 1 RETURN count(*)',
        { name: team },
    )
    res += 3 * middle.records[0].get(0).low;

    const higher = await tx.run(
        'MATCH (t:Team {name: $name})-[]->(c:Cycle)-[]->(m:ScoringPosition) WHERE m.name / 9 = 2 RETURN count(*)',
        { name: team },
    )

    res += 5 * higher.records[0].get(0).low

    return res
}

// returns nodes connected to a team node in a given match
export async function getMatchNodes(team: number, match: String, tx: any){
    const result = await tx.run(
        'MATCH (t:Team {name: $name})-[r{match: toString($match)}]-(c) RETURN *',
        { name: team, match:match},
    )
    console.log(result)
    return result;
}
export async function getnumberOfLinksMatch(team: number, match: String, tx: any){
    const result = await tx.run(
        'MATCH (t:Team {name: $name})-[r{match: toString($match)}]-(c:Cycle)-[o{link:true}]-(s:ScoringPosition) RETURN *',
        { name: team, match: match },
    )
    let returnValue: number = 0;
    if (result.records.length > 0) {
        returnValue = result.records.length - 1
    }
    return returnValue;
}
export async function getnumberOfLinks(team: number, tx: any) {
    const result = await tx.run(
        'MATCH (t:Team {name: $name})--(c:Cycle)-[o{link:true}]-(s:ScoringPosition) RETURN *',
        { name: team },
    )
    let returnValue: number = 0;
    if (result.records.length > 0) {
        returnValue = result.records.length - 1
    }
    return returnValue;
}

// get where team picked up pieces in a match, given what piece
export async function getPiecesPickedUp(team: number, match:String, piece: string, tx:any){
    //cones picked up
    const result = await tx.run(
        'MATCH (t:Team {name: $name})-[:' + piece + '{match: toString($match)}]->(c:Cycle) RETURN count(*)',
        { name: team, match: match, piece: piece},
    )
    return result.records[0].get(0).low;
}

// get where team picked up pieces in all matches
export async function getPiecesPickedUpAllMatches(team: number, piece: string, tx: any) {
    //cones picked up
    const result = await tx.run(
        'MATCH (t:Team {name: $name})-[:' + piece + ']->(c:Cycle) RETURN count(*)',
        { name: team, piece: piece }
    )
    return result.records[0].get(0).low;
}

// get links a team contributed in all matches
export async function getLinks(team: number, tx: any) {
    //cones picked up
    const result = await tx.run(
        "MATCH (n:Team{name:$team})-[]-(m:Cycle)-[s:SCORED{link:true}]-() RETURN COUNT(*)",
        { team: team }
    )
    return result.records[0].get(0).low;
}


// returns how many game pieces the robot scored in that row IN A MATCH: 1 is bottom, 3 is top
export async function getTeamMatchScoreLocation(team : number, row : number, match: String, teleop: boolean, tx:any){
    try{
        if(row != 2){
            const result = await tx.run(
                'MATCH (t:Team {name: $name})--(c:Cycle)-[match:toString($match)]->(s:ScoringPosition) WHERE s.name/9 = $row AND c.teleop = $teleTrue RETURN count(*)',
                { name: team, row: row - 1, teleTrue: teleop, match: match },
            )
            return result.records[0].get(0).low
        }else{
            let ret = 0
            const not17 = await tx.run(
                'MATCH (t:Team {name: $name})--(c:Cycle)-[match:toString($match)]->(s:ScoringPosition) WHERE s.name/9 = $row AND c.teleop = $teleTrue AND s.name <> 17 RETURN count(*)',
                { name: team, row: row - 1, teleTrue: teleop, match: match },
            )
            ret += not17.records[0].get(0).low
            const yes17 = await tx.run(
                'MATCH (t:Team {name: $name})--(c:Cycle)-[match:toString($match)]->(s:ScoringPosition) WHERE s.name/9 = $row AND c.teleop = $teleTrue RETURN count(DISTINCT c.match)',
                { name: team, row: row - 1, teleTrue: teleop, match: match },
            )
            ret += yes17.records[0].get(0).low

            return ret
        }
    } catch (error) {
        console.error(error)
    }
}

// returns how many games a certain team played
export async function getMatchesPlayed(team: number, tx: any) {
    const result = await tx.run(
        'MATCH (t:Team {name: $name})-[r]->(n) RETURN COUNT(DISTINCT r.match)',
        { name: team },
    )
    return result.records[0].get(0).low
}

// returns [# park, # dock, # engage]
export async function getClimbAllMatches(team: number, teleop: boolean, tx: any) {
    let climbs = Array(3)

    let result = await tx.run(
        'MATCH (t:Team {name: $name})-[]-(c:' + (teleop ? "Park" : "Mobility") + ') RETURN count(*)',
        { name: team },
    )

    climbs[0] = result.records[0].get(0).low;

    result = await tx.run(
        'MATCH (t:Team {name: $name})-[:DOCKED]-(:' + (teleop ? "Teleop" : "Auto") + 'Climb) RETURN count(*)',
        { name: team },
    )

    climbs[1] = result.records[0].get(0).low;

    result = await tx.run(
        'MATCH (t:Team {name: $name})-[:ENGAGED]-(:' + (teleop ? 'Teleop' : 'Auto') + 'Climb) RETURN count(*)',
        { name: team },
    )

    climbs[2] = result.records[0].get(0).low;

    return climbs
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
    links per game: links per game
    teleopClimbPPG: teleopClimb,
    autoClimbPPG: autoClimb,
 */
export async function getTeam({team}: {team: number}) {
    const session = getNeoSession()

    let autoPoints: number = 0
    let points: number = 0
    let matchesPlayed: number = 0
    let conesPickedUp: number = 0
    let cubesPickedUp: number = 0
    let conesScored: number = 0
    let cubesScored: number = 0
    let ncycles: number = 0
    let nWcycles: number = 0
    let scoringPositions = Array(3)
    let autoClimbPoints: number = 0
    let teleopClimbPoints: number = 0
    let autoClimb: Array<number>
    let teleopClimb: Array<number>
    let links: number = 0
    let maxPiecesScored: number = 0

    try {
        const tx = session.beginTransaction()

        let a0 = await getTeamScoreLocation(team, 1, false, tx)
        let a1 = await getTeamScoreLocation(team, 2, false, tx)
        let a2 = await getTeamScoreLocation(team, 3, false, tx)

        //auto points
        autoPoints += 3 * a0
        autoPoints += 4 * a1
        autoPoints += 6 * a2

        autoClimb = await getClimbAllMatches(team, false, tx)
        autoClimbPoints = 3 * autoClimb[0] + 8 * autoClimb[1] + 12 * autoClimb[2]
        autoPoints += autoClimbPoints

        let t0 = await getTeamScoreLocation(team, 1, true, tx)
        let t1 = await getTeamScoreLocation(team, 2, true, tx)
        let t2 = await getTeamScoreLocation(team, 3, true, tx)

        points = autoPoints
        points += 2 * t0
        points += 3 * t1
        points += 5 * t2
        teleopClimb = await getClimbAllMatches(team, true, tx)
        teleopClimbPoints = 2 * teleopClimb[0] + 6 * teleopClimb[1] + 10 * teleopClimb[2]
        points += teleopClimbPoints

        points += 5 * await getnumberOfLinks(team, tx);

        scoringPositions[0] = a0 + t0
        scoringPositions[1] = a1 + t1
        scoringPositions[2] = a2 + t2

        conesPickedUp = await getPiecesPickedUpAllMatches(team, "cone", tx)
        cubesPickedUp = await getPiecesPickedUpAllMatches(team, "cube", tx)

        conesScored = await getPiecesScoredAllMatches(team, 'cone', tx)
        cubesScored = await getPiecesScoredAllMatches(team, 'cube', tx)

        ncycles = await getNumberCyclesAllMatches(team, tx)
        nWcycles = await getWeightedCyclesAllMatches(team, tx)
        matchesPlayed = await getMatchesPlayed(team, tx)
        links = await getLinks(team, tx)

        console.log(team)

        // maxPiecesScored = await getMaxPiecesScored(team, tx)

        await tx.close()
        await session.close()

    } catch (error) {
        console.error(error)
    }

    let teamdata: teamAggData = {
        team: team,
        matchesPlayed: matchesPlayed,
        autoPPG: autoPoints / matchesPlayed,
        PPG: points / matchesPlayed,
        cyclesPG: ncycles / matchesPlayed,
        weightedCyclesPG: nWcycles / matchesPlayed,
        avgPiecesScored: (conesScored + cubesScored) / matchesPlayed,
        maxPiecesScored: maxPiecesScored,
        scoringAccuracy: (conesScored + cubesScored) / (conesPickedUp + cubesPickedUp),
        coneAccuracy: conesScored / conesPickedUp,
        cubeAccuracy: cubesScored / cubesPickedUp,
        scoringPositions: scoringPositions,
        autoClimbPPG: autoClimbPoints / matchesPlayed,
        teleopClimbPPG: teleopClimbPoints / matchesPlayed,
        climbPPG: (autoClimbPoints + teleopClimbPoints) / matchesPlayed,
        linkPG: links / matchesPlayed,
        // power rating = 4 * wCPG + 3 * accu + 2 * linkPG + 5 * PPG
        // powerRating: 4 * (nWcycles / matchesPlayed) + 3 * (conesScored + cubesScored) / (conesPickedUp + cubesPickedUp) + 2 * (links / matchesPlayed)
        // + 5 * (points / matchesPlayed)
    }

    console.log(teamdata)

    return teamdata.matchesPlayed > 0 ? teamdata : defaultTeam
}

interface teamRelativeStatistics {
    autoScoring:number,
    teleopScoring:number, 
    scoringAccuracy: number,
    autoClimbPoints: number,
    teleopClimbPoints: number,
    cyclesPerGame: number
}

export async function getTeamStandardizedScores(team:number) {
    let teams: Array<number> = await getAllTeamNumbers()

    let autoScoring = []
    let teleopScoring = []
    let scoringAccuracy = []
    let autoClimbPoints = []
    let teleopClimbPoints = []
    let cyclesPerGame = []
    let foundTeam:number = 0

    for (let index = 0; index < teams.length; index++) {
        let thisTeam: any = await getTeam({ team: teams[index] })
    
        if(thisTeam.team == team) {
            foundTeam = index
        }

        autoScoring.push( thisTeam.autoPPG - thisTeam.autoClimbPPG)
        teleopScoring.push(thisTeam.PPG - thisTeam.autoPPG - thisTeam.teleopClimbPPG)
        scoringAccuracy.push(thisTeam.scoringAccuracy)
        autoClimbPoints.push(thisTeam.autoClimbPPG)
        teleopClimbPoints.push(thisTeam.teleopClimbPPG)
        cyclesPerGame.push(thisTeam.cyclesPG)

    }

    let ret:teamRelativeStatistics = {
        autoScoring:(autoScoring[foundTeam] - arrayAverage(autoScoring))/standardDeviation(autoScoring),
        teleopScoring:(teleopScoring[foundTeam] - arrayAverage(teleopScoring))/standardDeviation(teleopScoring),
        scoringAccuracy:(scoringAccuracy[foundTeam] - arrayAverage(scoringAccuracy))/standardDeviation(scoringAccuracy),
        autoClimbPoints:(autoClimbPoints[foundTeam] - arrayAverage(autoClimbPoints))/standardDeviation(autoClimbPoints),
        teleopClimbPoints:(teleopClimbPoints[foundTeam] - arrayAverage(teleopClimbPoints))/standardDeviation(teleopClimbPoints),
        cyclesPerGame:(cyclesPerGame[foundTeam] - arrayAverage(cyclesPerGame))/standardDeviation(cyclesPerGame)
    }
    return ret
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

export async function getMatch(team: number, match: String) {
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
                        autoPoints += 8
                    } else {
                        autoClimb = 2
                        autoPoints += 12
                    }
                    break;
                case "TeleopClimb":
                    numPartners = matchNodes.records[index]._fields[1].properties.numPartners.low
                    if (matchNodes.records[index]._fields[1].type == "DOCKED") {
                        teleopClimb = 1
                        points += 6
                    } else {
                        teleopClimb = 2
                        points += 10
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
                    autoPoints += 3
                    break;
                case "Park":
                    park = true;
                    points += 2
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

        points += 5 * await getnumberOfLinksMatch(team, match, tx)

        const result = await tx.run(
            'MATCH (t:Team {name: $name})-[{match: toString($match)}]-(c:Cycle)-[]->(s:ScoringPosition) RETURN count(*)',
            { name: team, match: match },
        )
        piecesScored = result.records[0].get(0).low;
    } catch (error) {
        console.error(error)
    }


    let matchData: Object = {
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
        autoPoints: autoPoints,
        points: points,
        piecesScored: piecesScored,
        scoringAccuracy: piecesScored / (cubesPickedUp + conesPickedUp),
    }

    // console.log(matchData)
    return (
        matchData
    )
}

export async function getCompTeams(teams: number[]) {
    const teamPromises = teams.map((team) => getTeam({team:team}));
    const teamData = await Promise.all(teamPromises);
    return teamData;
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

        await tx.commit()

    } catch (error) {
        console.error(error)
    }
  }
 
export async function getMatchByValueAndRelatoinship(amount: number, relationship: String, team: number) {
    const session = getNeoSession()
    const tx = session.beginTransaction()
    try {
        if (relationship != "SCORED") {
            const result = await tx.run(
                'MATCH (t:Team{name: $name})-[:' + relationship + '{match}]->(n) RETURN n.match',
                {name:team,relationship:relationship}
            )
            console.log(result)
        }
    } catch (error) {
        console.error(error)
    }


}

// returns how many games a certain team played
export async function getMatchList(team : number){
    const session = getNeoSession()
    const tx = session.beginTransaction()
    try{
        const result = await tx.run(
            'MATCH (t:Team {name: $name})-[r]->(n) RETURN DISTINCT r.match',
            { name: team },
        )
        console.log(result.records.map((record: any) => record._fields[0].low))
        let ret:Array<number> = result.records.map((record: any) => record._fields[0].low)
        await tx.commit()
        return ret
    }catch(error){
        console.error(error)
    }
}
export async function getAllTeamNumbers() {
    const session = getNeoSession()
    let tempResult:any
    let toReturn = []

    try {
        const tx = session.beginTransaction()
        const result = await tx.run(
            'MATCH (t:Team) return distinct *'
        )
        tempResult = result
        for (let index = 0; index < result.records.length; index++) {
            toReturn.push(tempResult.records[index]._fields[0].properties.name.low)
            console.log(toReturn[index])
        }

        await tx.commit()

    } catch (error) {
        console.error(error)
    }
    return toReturn
}

export async function getAllTeamData(){
    let ret : teamAggData[] = []
    const teamlist = await getAllTeamNumbers()
    for(let i = 0; i < teamlist.length; i++){
        ret.push(await getTeam({team: teamlist[i]}))
    }

    return ret
}