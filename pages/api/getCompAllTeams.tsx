import { NextApiRequest, NextApiResponse } from "next";
import { getNeoSession } from "../../neo4j/Session";
var neo4j = require('neo4j-driver')

type Data = {
    teams:  number[]
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
){
    res.status(200).json({teams: await getAllTeams()})
}

async function getAllTeams() {
    const session = getNeoSession()
    try{
        const tx = session.beginTransaction()
        const rec = await tx.run("MATCH (n:Team) RETURN n.name AS teamName")
        const teamNames: number[] =  rec.records.map((record) => neo4j.isInt(record.get("teamName")) ? record.get("teamName").low : record.get("teamName"))

        await tx.close()

        return teamNames
    }catch(error){
        console.error(error)
        return []
    }finally{
        await session.close()
    }
}