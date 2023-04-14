import { NextApiRequest, NextApiResponse } from "next";
import { matchData } from "../../utils";
import { climb, mobility, park, score } from "../../neo4j/AddData";
import { allies, defence, enemies } from "../../neo4j/Relationships";

type Data = {
    error?: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method != 'POST') {
        res.status(405).json({ error: "Only POST allowed!" })
    } else {
        try {
            const data = JSON.parse(req.body)
            await scoreMatch(data)
            return res.status(200)
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: "Something went wrong with query" })
        }
    }
}

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