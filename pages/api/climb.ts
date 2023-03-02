import { useState } from "react";
import { defaultMatch, getNeoSession, matchData } from "../../utils";

const handler = (req, res) => {
    const [jsonData, setJsonData] = useState<matchData>(defaultMatch)
    if (req.method == "POST") {
        setJsonData(req.body)
        climb(jsonData)
        res.status(200)
    } else {
        res.status(200)
    }
};

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
            await session.close()

        } catch (error) {
            console.error(error)
        }
    }
}

export default (handler)