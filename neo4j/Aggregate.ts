import { Session } from "next-auth";
import { getNeoSession } from "./Session";
import neo4j from 'neo4j-driver'

export async function getTeam({ team }: { team: number }) {
    const session = getNeoSession()
    let autoPoints: number = 0
    let points: number = 0
    let matchesPlayed = 0;
    //auto points
    {
        try {
            const tx = session.beginTransaction()
            const result = await tx.run(
                'MATCH (t:Team {name: $name})--(c:Cycle)-[]->(s:ScoringPosition) WHERE s.name/9 = 0 AND c.teleop = false RETURN count(*)',
                { name: team, },
            )
            autoPoints += result.records[0].get(0).low * 3;

            await tx.commit()
        } catch (error) {
            console.error(error)
        }
        try {
            const tx = session.beginTransaction()
            const result = await tx.run(
                'MATCH (t:Team {name: $name})--(c:Cycle)-[]->(s:ScoringPosition) WHERE s.name/9 = 1 AND c.teleop = false RETURN count(*)',
                { name: team, },
            )
            autoPoints += result.records[0].get(0).low * 4;

            await tx.commit()
        } catch (error) {
            console.error(error)
        }
        try {
            const tx = session.beginTransaction()
            const result = await tx.run(
                'MATCH (t:Team {name: $name})--(c:Cycle)-[]->(s:ScoringPosition) WHERE s.name/9 = 2 AND c.teleop = false RETURN count(*)',
                { name: team, },
            )
            autoPoints += result.records[0].get(0).low * 6;

            await tx.commit()
        } catch (error) {
            console.error(error)
        }
    }
    points = autoPoints
    //total points
    {
        try {
            const tx = session.beginTransaction()
            const result = await tx.run(
                'MATCH (t:Team {name: $name})--(c:Cycle)-[]->(s:ScoringPosition) WHERE s.name/9 = 0 AND c.teleop = true RETURN count(*)',
                { name: team, },
            )
            points += result.records[0].get(0).low * 2;

            await tx.commit()
        } catch (error) {
            console.error(error)
        }
        try {
            const tx = session.beginTransaction()
            const result = await tx.run(
                'MATCH (t:Team {name: $name})--(c:Cycle)-[]->(s:ScoringPosition) WHERE s.name/9 = 1 AND c.teleop = true RETURN count(*)',
                { name: team, },
            )
            points += result.records[0].get(0).low * 3;

            await tx.commit()
        } catch (error) {
            console.error(error)
        }
        try {
            const tx = session.beginTransaction()
            const result = await tx.run(
                'MATCH (t:Team {name: $name})--(c:Cycle)-[]->(s:ScoringPosition) WHERE s.name/9 = 2 AND c.teleop = true RETURN count(*)',
                { name: team, },
            )
            points += result.records[0].get(0).low * 5;

            await tx.commit()
        } catch (error) {
            console.error(error)
        }
    }
    //total number of matches played
    {
        try {
            const tx = session.beginTransaction()
            const result = await tx.run(
                'MATCH (t:Team {name: $name})-[r]->(n) RETURN COUNT(DISTINCT r.match)',
                { name: team, },
            )
            let tempResult: any = 0
            tempResult = result
            matchesPlayed = tempResult.records[0]._fields[0].low
            await tx.commit()
        } catch (error) {
            console.error(error)
        }
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

export async function getMatch({ team, match }: { team: number, match: number }) {
    const session = getNeoSession()

    let trueResult: any
    let nCycles: number
    let teleopClimb: number = 0
    let autoClimb: number = 0
    let numPartners: number = 0
    let cycles: Object[] = new Array
    let allies: number[] = new Array(2)
    let enemies: number[] = new Array(3)


    let mobility: boolean = false;
    let conesPickedUp: number = 0
    let cubesPickedUp: number = 0
    let autoPoints: number = 0
    let points: number = 0
    let piecesScored = 0
    let scoringAccuracy: number = 0
    try {
        const tx = session.beginTransaction()
        const result = await tx.run(
            'MATCH (t:Team {name: $name})-[{match: $match}]->(c:Cycle) RETURN count(*)',
            { name: team, match: match },
        )
        nCycles = result.records[0].get(0).low;
        cycles = new Array(nCycles)
        await tx.commit()
    } catch (error) {
        console.error(error)
    }
    try {
        const tx = session.beginTransaction()
        const result = await tx.run(
            'MATCH (t:Team {name: $name})-[r{match: $match}]-(c) RETURN *',
            { name: team, match: match },
        )
        trueResult = result;
        await tx.commit()
    } catch (error) {
        console.error(error)
    }
    let currentCycle: number = 0;
    let currentAlly: number = 0;
    let currentEnemy: number = 0;
    for (let index = 0; index < trueResult.records.length; index++) {
        switch (trueResult.records[index]._fields[0].labels[0]) {
            case "Cycle":
                cycles[currentCycle] = trueResult.records[index]._fields[0].properties
                currentCycle++
                break;
            case "AutoClimb":
                if (trueResult.records[index]._fields[1].type == "DOCKED") {
                    autoClimb = 1
                } else {
                    autoClimb = 2
                }
                break;
            case "TeleopClimb":
                numPartners = trueResult.records[index]._fields[1].properties.numPartners.low
                if (trueResult.records[index]._fields[1].type == "DOCKED") {
                    teleopClimb = 1
                } else {
                    teleopClimb = 2
                }
                break;

            case "Team":
                if (trueResult.records[index]._fields[1].type == "ALLY") {
                    allies[currentAlly] = trueResult.records[index]._fields[0].properties.name.low
                    currentAlly++
                } else {
                    enemies[currentEnemy] = trueResult.records[index]._fields[0].properties.name.low
                    currentEnemy++
                }
                break;
            //default is used for mobility
            default:
                mobility = true;
                break;
        }
    }
    //cones picked up
    try {
        const tx = session.beginTransaction()
        const result = await tx.run(
            'MATCH (t:Team {name: $name})-[:CONE{match: $match}]->(c:Cycle) RETURN count(*)',
            { name: team, match: match },
        )
        conesPickedUp = result.records[0].get(0).low;

        await tx.commit()
    } catch (error) {
        console.error(error)
    }
    //cubes picked up
    try {
        const tx = session.beginTransaction()
        const result = await tx.run(
            'MATCH (t:Team {name: $name})-[:CUBE{match: $match}]->(c:Cycle) RETURN count(*)',
            { name: team, match: match },
        )
        cubesPickedUp = result.records[0].get(0).low;

        await tx.commit()
    } catch (error) {
        console.error(error)
    }
    //auto points
    {
        try {
            const tx = session.beginTransaction()
            const result = await tx.run(
                'MATCH (t:Team {name: $name})-[{match: $match}]-(c:Cycle)-[]->(s:ScoringPosition) WHERE s.name/9 = 0 AND c.teleop = false RETURN count(*)',
                { name: team, match: match },
            )
            autoPoints += result.records[0].get(0).low * 3;

            await tx.commit()
        } catch (error) {
            console.error(error)
        }
        try {
            const tx = session.beginTransaction()
            const result = await tx.run(
                'MATCH (t:Team {name: $name})-[{match: $match}]-(c:Cycle)-[]->(s:ScoringPosition) WHERE s.name/9 = 1 AND c.teleop = false RETURN count(*)',
                { name: team, match: match },
            )
            autoPoints += result.records[0].get(0).low * 4;

            await tx.commit()
        } catch (error) {
            console.error(error)
        }
        try {
            const tx = session.beginTransaction()
            const result = await tx.run(
                'MATCH (t:Team {name: $name})-[{match: $match}]-(c:Cycle)-[]->(s:ScoringPosition) WHERE s.name/9 = 2 AND c.teleop = false RETURN count(*)',
                { name: team, match: match },
            )
            autoPoints += result.records[0].get(0).low * 6;

            await tx.commit()
        } catch (error) {
            console.error(error)
        }
    }
    points = autoPoints
    //total points
    {
        try {
            const tx = session.beginTransaction()
            const result = await tx.run(
                'MATCH (t:Team {name: $name})-[{match: $match}]-(c:Cycle)-[]->(s:ScoringPosition) WHERE s.name/9 = 0 AND c.teleop = true RETURN count(*)',
                { name: team, match: match },
            )
            points += result.records[0].get(0).low * 2;

            await tx.commit()
        } catch (error) {
            console.error(error)
        }
        try {
            const tx = session.beginTransaction()
            const result = await tx.run(
                'MATCH (t:Team {name: $name})-[{match: $match}]-(c:Cycle)-[]->(s:ScoringPosition) WHERE s.name/9 = 1 AND c.teleop = true RETURN count(*)',
                { name: team, match: match },
            )
            points += result.records[0].get(0).low * 3;

            await tx.commit()
        } catch (error) {
            console.error(error)
        }
        try {
            const tx = session.beginTransaction()
            const result = await tx.run(
                'MATCH (t:Team {name: $name})-[{match: $match}]-(c:Cycle)-[]->(s:ScoringPosition) WHERE s.name/9 = 2 AND c.teleop = true RETURN count(*)',
                { name: team, match: match },
            )
            points += result.records[0].get(0).low * 5;

            await tx.commit()
        } catch (error) {
            console.error(error)
        }
    }
    try {
        const tx = session.beginTransaction()
        const result = await tx.run(
            'MATCH (t:Team {name: $name})-[{match: $match}]-(c:Cycle)-[]->(s:ScoringPosition) RETURN count(*)',
            { name: team, match: match },
        )
        piecesScored = result.records[0].get(0).low;

        await tx.commit()
    } catch (error) {
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
    return (
        matchData
    )
}

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