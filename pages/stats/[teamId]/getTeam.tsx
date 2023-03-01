import Head from "next/head";
import { Session } from "next-auth";
import { getNeoSession } from "../../../neo4j/Session";
import neo4j, { Record } from 'neo4j-driver'

//sees if team is in database
export async function getTeam() {
    let n = 5;
    const session = getNeoSession()
    const tx = session.beginTransaction()
    let thing;
    try {   
        const cypher = `MATCH (t:Team {name: $name}) RETURN count(t) > 0` 
        const params = {name: n}
        const res = await tx.run(cypher, params)
        await tx.commit();
        res.records.map((record: Record) => {
            console.log(record.get('count(t) > 0'))
            thing = record.get('count(t) > 0')
        })
    } finally {
        await session.close();
    }
    console.log(thing);
    return thing;
}



