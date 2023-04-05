import { Session } from "next-auth";
import { getNeoSession } from "./Session";
import neo4j from 'neo4j-driver'
import { allies, defence, enemies } from "./Relationships";
import { matchData } from "../utils";
import { calculateTeamAgg, setTeamAgg } from "./Aggregate";


//create teams to test with takes a number as parameter for number of teams, returns nothing
export async function createNTeams(n: number) {
    const session = getNeoSession()
    for (let index = 1; index <= n; index++) {
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

export async function makeTeam(team: number){
    const session = getNeoSession()
    const tx = session.beginTransaction()
    try {
        const result = await tx.run(
            'MERGE (a:Team{ name: toInteger($name)}) RETURN a',
            { name: team }
        )

        await tx.commit()
        
    } catch (error) {
        console.error(error)
    }
}


// adds the climbing data from a team from a match, takes the json with the match data as paramter, returns nothing
export async function climb(data: matchData) {
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
                'MATCH (t:Team), (c:TeleopClimb) WHERE t.name = toInteger($team) AND ID(c) = $id CREATE (t)-[r:' + climbStatus + '{match:toString($match), numPartners:toInteger($numPartners)}]->(c)',
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
                'MATCH (t:Team), (c:AutoClimb) WHERE t.name = toInteger($team) AND ID(c) = $id CREATE (t)-[r:' + climbStatus + '{match:toString($match)}]->(c)',
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

export async function addDummyData({data}: {data: Array<matchData>}){
    for(var i = 0; i < data.length; i++){
        console.log("added dummy data " + (i + 1) + "/" + data.length)
        await score(data[i])
        await allies(data[i])
        await enemies(data[i])
        await climb(data[i])
        await park(data[i])
        await mobility(data[i])
        await defence(data[i])

        await setTeamAgg({team_agg_data: await calculateTeamAgg({team: data[i].team})})
    }
}

//scores a single match
export async function scoreMatch(match: matchData){
    console.log(match)
    await makeTeam(match.team)
    await score(match)
    await allies(match)
    await enemies(match)
    await park(match)
    await mobility(match)
    await climb(match)
    await defence(match)
}


// adds the cones and cube data from a team from a match, takes the json with the match data as parameter, returns nothing
export async function score(data: matchData) {
    const session = getNeoSession()

    for (var i = 0; i < data.cycles.length; i++) {
        try {
            const tx = session.beginTransaction()
            //create the cycle node for the current cycle
            const result = await tx.run(
                'CREATE (a:Cycle{substation:toString($sub),match:toString($match),teleop:$teleop}) RETURN  ID(a)',
                {
                    sub: data.cycles[i].substation,
                    team: data.team,
                    match: data.match,
                    teleop: data.cycles[i].teleop,
                },
            )
            const id = result.records[0].get(0).toNumber()

            //create the relationship between the team and the cycle
            const result1 = await tx.run(
                'MATCH (t:Team),(a:Cycle) WHERE t.name = toInteger($team) AND ID(a) = $id CREATE (t)-[r:' + data.cycles[i].object + '{match:toString($match),teleop:$teleop}]->(a) ',
                {
                    id: id,
                    team: data.team,
                    match: data.match,
                    teleop: data.cycles[i].teleop,
                    object: data.cycles[i].object
                }
            )

            //if the piece is scored merge the node with the name of the position
            if (data.cycles[i].level != null && data.cycles[i].level != 0) {
                const positions = ["dropped", "bottom", "middle", "top"]
                const result2 = await tx.run(
                    'MERGE (z:ScoringPosition{name: $posName, team:toInteger($team)}) RETURN ID(z)',
                    {
                        posName: positions[data.cycles[i].level],
                        team: data.team
                    },
                )
                //and then create the relationship from the cycle to the scoringposition
                const scoringId = result2.records[0].get(0).toNumber()
                const result3 = await tx.run(
                    'MATCH (c:Cycle), (s:ScoringPosition) WHERE ID(c) = $id AND ID(s) = $scoringId CREATE (c)-[r:SCORED{teleop:$teleop, match:toString($match),link:$link}]->(s)',
                    {
                        link: data.cycles[i].link,
                        id: id,
                        scoringId: scoringId,
                        teleop: data.cycles[i].teleop,
                        match: data.match
                    }
                )

            }
            await tx.commit()
        }catch(error){
            console.error(error)
        }
    }
}

//adds the mobility data from a team from a match, takes the json with the match data as parameter, returns nothing
export async function mobility(data: matchData) {
    const session = getNeoSession()
    let id: any
    if (data.mobility) {
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
                'MATCH (t:Team), (c:Mobility) WHERE t.name = toInteger($team) AND ID(c) = $id CREATE (t)-[r:MOVED{match:toString($match)}]->(c)',
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
export async function park(data:any) {
    const session = getNeoSession()
    let id: any
    // console.log(data)
    if (data.park == true) {
        try {
            const tx = session.beginTransaction()
            const result = await tx.run(
                'MERGE (c:Park{team: toInteger($team)}) return ID(c)',
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
                'MATCH (t:Team), (c:Park) WHERE t.name = toInteger($team) AND ID(c) = $id CREATE (t)-[r:MOVED{match:toString($match)}]->(c)',
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
