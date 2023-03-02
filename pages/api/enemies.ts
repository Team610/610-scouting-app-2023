import { useState } from "react";
import { defaultMatch, getNeoSession, matchData } from "../../utils";

const handler = (req, res) => {
    const [jsonData, setJsonData] = useState<matchData>(defaultMatch)
    if (req.method == "POST") {
        setJsonData(req.body)
        enemies(jsonData)
        res.status(200)
    } else {
        res.status(200)
    }
};

//takes the match data for a team as the parameter, creates the enemy relaitionships for the team

export async function enemies(data: any) {
    const session = getNeoSession()
    for (let index = 0; index < data.enemies.length; index++) {
        try {
            const tx = session.beginTransaction()

            const _ = await tx.run(
                'MERGE (:Team{name:$allyname})',
                { allyname: data.allies[index] }
            )

            const result = await tx.run(
                'MATCH (t:Team),(ot:Team) WHERE t.name = $name AND ot.name = $otherName CREATE (t)-[:ENEMY{match: toString($match)}]->(ot)',
                { name: data.team, otherName: data.enemies[index], match: data.match },
            )

            await tx.commit()
            await tx.close()

        } catch (error) {
            console.error(error)
        }
    }
}
  
export default (handler)