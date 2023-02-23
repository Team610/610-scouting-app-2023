import { Session } from "next-auth";
import { getNeoSession } from "./Session";
import neo4j from 'neo4j-driver'

//create teams to test with takes a number as parameter for number of teams, returns nothing
export async function createNTeams(n: number) {
    const session = getNeoSession()
    for (let index = 0; index < n; index++) {
        const tx = session.beginTransaction()
        try {
            const result = await tx.run(
                'MERGE (a:Team{ name: toInteger($name)}) RETURN a',
                { name: index },
            )

            await tx.commit()
        } catch (error) {
            console.error(error)
        }
    }
}


// adds the climbing data from a team from a match, takes the json with the match data as paramter, returns nothing
export async function climb({ data }: { data: any }) {
    const session = getNeoSession()
    let id: any;
    if (data.teleopClimb != 0) {
        let climbStatus: String;
        if (data.teleopClimb == 1) {
            climbStatus = "DOCKED"
        } else {
            climbStatus = "ENGAGED"
        }
        try {
            const tx = session.beginTransaction()
            const result = await tx.run(
                'MERGE (c:TeleopClimb{team: toInteger($team)}) return ID(c)',
                {
                    team: data.team,
                },
            )
            id = result.records[0].get(0).toNumber()
            await tx.commit()
        } catch (error) {
            console.error(error)
        }
        try {
            const tx = session.beginTransaction()
            const result = await tx.run(
                'MATCH (t:Team), (c:TeleopClimb) WHERE t.name = toInteger($team) AND ID(c) = $id CREATE (t)-[r:' + climbStatus + '{match:toInteger($match), numPartners:toInteger($numPartners)}]->(c)',
                {
                    match: data.match,
                    team: data.team,
                    id: id,
                    numPartners: data.numPartners
                },
            )
            await tx.commit()
        } catch (error) {
            console.error(error)
        }
    }
    if (data.autoClimb != 0) {
        let climbStatus: String;
        if (data.autoClimb == 1) {
            climbStatus = "DOCKED"
        } else {
            climbStatus = "ENGAGED"
        }
        try {
            const tx = session.beginTransaction()
            const result = await tx.run(
                'MERGE (c:AutoClimb{team: toInteger($team)}) return ID(c)',
                {
                    team: data.team,
                },
            )
            id = result.records[0].get(0).toNumber()
            await tx.commit()
        } catch (error) {
            console.error(error)
        }
        try {
            const tx = session.beginTransaction()
            const result = await tx.run(
                'MATCH (t:Team), (c:AutoClimb) WHERE t.name = toInteger($team) AND ID(c) = $id CREATE (t)-[r:' + climbStatus + '{match:toInteger($match)}]->(c)',
                {
                    match: data.match,
                    team: data.team,
                    id: id,
                },
            )
            await tx.commit()
        } catch (error) {
            console.error(error)
        }
    }
}


// adds the cones and cube data from a team from a match, takes the json with the match data as parameter, returns nothing
export async function score({ data }: { data: any }) {
    const session = getNeoSession()
    //climb
    let id: any;
    for (var i = 0; i < data.cycles.length; i++) {
        try {
            //create the cycle node for the current cycle
            const tx = session.beginTransaction()
            const result = await tx.run(
                'CREATE (a:Cycle{x:$x,y:$y,match:toInteger($match),teleop:$teleop}) RETURN  ID(a)',
                {
                    team: data.team,
                    x: data.cycles[i].x,
                    y: data.cycles[i].y,
                    match: data.match,
                    teleop: data.cycles[i].teleop,
                },
            )
            id = result.records[0].get(0).toNumber()
            await tx.commit()
            //create the relationship between the team and the cycle
            const tx1 = session.beginTransaction()
            const result1 = await tx1.run(
                'MATCH (t:Team),(a:Cycle) WHERE t.name = toInteger($team) AND ID(a) = $id CREATE (t)-[r:' + data.cycles[i].object + '{match:toInteger($match),teleop:$teleop}]->(a) ',
                {
                    id: id,
                    team: data.team,
                    x: data.cycles[i].x,
                    y: data.cycles[i].y,
                    match: data.match,
                    teleop: data.cycles[i].teleop,
                    object: data.cycles[i].object
                },
            )
            await tx1.commit()
        } catch (error) {
            console.error(error)
        }
        //if the piece is scored merge the node with the name of the position, and then create the relationship from the cycle to the scoringposition
        if (data.cycles[i].scoringPosition != null) {
            let scoringId: any;
            try {
                const tx2 = session.beginTransaction()
                const result2 = await tx2.run(
                    'MERGE (z:ScoringPosition{name: toInteger($name), team:toInteger($team)}) RETURN ID(z)',
                    {
                        name: data.cycles[i].scoringPosition,
                        team: data.team
                    },
                )
                scoringId = result2.records[0].get(0).toNumber()
                await tx2.commit()
                const tx3 = session.beginTransaction()
                const result3 = await tx3.run(
                    'MATCH (c:Cycle), (s:ScoringPosition) WHERE ID(c) = $id AND ID(s) = $scoringId CREATE (c)-[r:SCORED{teleop:$teleop, match:toInteger($match),link:$link}]->(s)',
                    {
                        link: data.cycles[i].link,
                        id: id,
                        scoringId: scoringId,
                        teleop: data.cycles[i].teleop,
                        match: data.match
                    }
                )
                await tx3.commit()
            } catch (error) {
                console.error(error)
            }

        }
    }
}

//adds the mobility data from a team from a match, takes the json with the match data as parameter, returns nothing
export async function mobility({ data }: { data: any }) {
    const session = getNeoSession()
    let id: any
    if (data.mobility == true) {
        try {
            const tx = session.beginTransaction()
            const result = await tx.run(
                'MERGE (c:Mobility{team: toInteger($team)}) return ID(c)',
                {
                    team: data.team,
                },
            )
            id = result.records[0].get(0).toNumber()
            await tx.commit()
        } catch (error) {
            console.error(error)
        }
        try {
            const tx = session.beginTransaction()
            const result = await tx.run(
                'MATCH (t:Team), (c:Mobility) WHERE t.name = toInteger($team) AND ID(c) = $id CREATE (t)-[r:MOVED{match:toInteger($match)}]->(c)',
                {
                    match: data.match,
                    team: data.team,
                    id: id,
                },
            )
            await tx.commit()
        } catch (error) {
            console.error(error)
        }
    }
}
