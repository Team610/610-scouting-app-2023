import { Session } from "next-auth";
import { getNeoSession } from "./Session";
import neo4j from 'neo4j-driver'
import { allies, defence, enemies } from "./Relationships";
import { matchData, climbStatus, levels } from "../utils";
import { calculateTeamAgg, setTeamAgg } from "./Aggregate";


// adds the climbing data from a team from a match, takes the json with the match data as paramter, returns nothing
export async function climb(data: matchData) {
    const session = getNeoSession()
    const teleopClimb = data.teleopClimb
    const autoClimb = data.autoClimb

    try {
        const tx = session.beginTransaction()
        await tx.run("MERGE (t:Team{name:$tname})\n"
            + (autoClimb ? "MERGE (ac:AutoClimb{team:$tname})\nCREATE (t) - [:" + climbStatus[autoClimb] + "{match: $m}] -> (ac)\n" : "")
            + (teleopClimb ? "MERGE (tc:TeleopClimb{team:$tname})\nCREATE (t) - [:" + climbStatus[teleopClimb] + "{numpartners:$np, match: $m}] -> (tc)\n" : ""),
            {tname: data.team, m: data.match, np: data.numPartners})

        await tx.commit()
    } catch (error) {
        console.error(error)
    } finally {
        session.close()
    }
}

export async function addDummyData({ data }: { data: Array<matchData> }) {
    for (var i = 0; i < data.length; i++) {
        console.log("added dummy data " + (i + 1) + "/" + data.length)
        await score(data[i])
        await allies(data[i])
        await enemies(data[i])
        await climb(data[i])
        await park(data[i])
        await mobility(data[i])
        await defence(data[i])

        await setTeamAgg({ team_agg_data: await calculateTeamAgg({ team: data[i].team }) })
    }
}

//scores a single match
export async function scoreMatch(match: matchData) {
    console.log(match)
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

    try {
        const tx = session.beginTransaction()
        for (const cycle of data.cycles) {
            await tx.run("MERGE (t:Team{name:$tname})\n\
            MERGE(sp:ScoringPosition{name:$pname, team:$tname})\n\
            CREATE (t) - [:" + cycle.object + "{teleop:$tel, substation: $sub, match: $match, link: $link}] -> (sp)",
                { tname: data.team, pname: levels[cycle.level], tel: cycle.teleop, sub: cycle.substation, match: data.match, link: cycle.link })
        }


        await tx.commit()
    } catch (error) {
        console.error(error)
    } finally {
        session.close()
    }
}

//adds the mobility data from a team from a match, takes the json with the match data as parameter, returns nothing
export async function mobility(data: matchData) {
    if (data.mobility) {
        const session = getNeoSession()

        try {
            const tx = session.beginTransaction()
            await tx.run("MERGE (t:Team{name:$tname})\n\
            MERGE(m:Mobility{team:$tname})\n\
            CREATE (t) - [:MOVED{match: $match}] -> (m)",
                { tname: data.team, match: data.match })


            await tx.commit()
        } catch (error) {
            console.error(error)
        } finally {
            session.close()
        }
    }
}
export async function park(data: matchData) {
    if (data.mobility) {
        const session = getNeoSession()

        try {
            const tx = session.beginTransaction()
            for (const cycle of data.cycles) {
                await tx.run("MERGE (t:Team{name:$tname})\n\
            MERGE(m:Park{team:$tname})\n\
            CREATE (t) - [:PARKED{match: $match}] -> (m)",
                    { tname: data.team, match: data.match })
            }


            await tx.commit()
        } catch (error) {
            console.error(error)
        } finally {
            session.close()
        }
    }
}
