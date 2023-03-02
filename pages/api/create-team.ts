import React, { useState } from "react";
import { defaultMatch, getNeoSession, matchData } from "../../utils";

const handler = (req, res) => {
    const [teamNumber, setTeamNumber] = useState(9999)
    if (req.method == "POST") {
        setTeamNumber(req.body["team_number"])
        makeTeam(teamNumber)
        res.status(200)
    } else {
        res.status(200)
    }
};

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

export default handler