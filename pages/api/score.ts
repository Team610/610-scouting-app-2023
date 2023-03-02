import { useState } from "react";
import { defaultMatch, getNeoSession, matchData } from "../../utils";

const handler = (req, res) => {
    const [jsonData, setJsonData] = useState<matchData>(defaultMatch)
    if (req.method == "POST") {
        setJsonData(req.body)
        score(jsonData)
        res.status(200)
    } else {
        res.status(200)
    }
};

// adds the cones and cube data from a team from a match, takes the json with the match data as parameter, returns nothing
export async function score(data: matchData) {
    const session = getNeoSession()

    for (var i = 0; i < data.cycles.length; i++) {
        try {
            const tx = session.beginTransaction()
            //create the cycle node for the current cycle
            const result = await tx.run(
                'CREATE (a:Cycle{x:$x,y:$y,match:toString($match),teleop:$teleop}) RETURN  ID(a)',
                {
                    team: data.team,
                    x: data.cycles[i].x,
                    y: data.cycles[i].y,
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
                    x: data.cycles[i].x,
                    y: data.cycles[i].y,
                    match: data.match,
                    teleop: data.cycles[i].teleop,
                    object: data.cycles[i].object
                }
            )

            //if the piece is scored merge the node with the name of the position, and then create the relationship from the cycle to the scoringposition
            if (data.cycles[i].scoringPosition != null) {
                const result2 = await tx.run(
                    'MERGE (z:ScoringPosition{name: toInteger($name), team:toInteger($team)}) RETURN ID(z)',
                    {
                        name: data.cycles[i].scoringPosition,
                        team: data.team
                    },
                )
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

export default (handler)