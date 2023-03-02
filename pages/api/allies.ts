import { useState } from "react";
import { defaultMatch, getNeoSession, matchData } from "../../utils";

const handler = (req, res) => {
    const [jsonData, setJsonData] = useState<matchData>(defaultMatch)
    if (req.method == "POST") {
        setJsonData(req.body)
        allies(jsonData)
        res.status(200)
    } else {
        res.status(200)
    }
};

//takes the match data for a team as the parameter, creates the ally relaitionships for the team
export async function allies(data: matchData) {
    const session = getNeoSession()
    for (let index = 0; index < data.allies.length; index++) {
      try {
        const tx = session.beginTransaction()
        const _ = await tx.run  (
          'MERGE (:Team{name:$allyname})',
          { allyname: data.allies[index]}
        )
  
        const result = await tx.run(
          'MATCH (t:Team),(ot:Team) WHERE t.name = $name AND ot.name = $otherName CREATE (t)-[:ALLY{match: toString($match)}]->(ot)',
          { name: data.team, otherName: data.allies[index], match: data.match },
        )
  
        await tx.commit()
        await session.close()
        
      } catch (error) {
        console.error(error)
      }
    }
  }

export default (handler)