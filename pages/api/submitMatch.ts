import { useState } from "react";
import { defaultMatch, getNeoSession, matchData } from "../../utils";
import { makeTeam } from "./create-team";
import { allies } from "./allies";
import { enemies } from "./enemies";
import { mobility, park } from "../../neo4j/AddData";
import { climb } from "./climb";
import { NextApiRequest, NextApiResponse } from "next";
import { score } from "./score";

const handler = (req: NextApiRequest, res:NextApiResponse) => {
    let data = req.body
    console.log(data)
    if (req.method == "POST") {
        makeTeam(data.team)
        score(data)
        allies(data)
        enemies(data)
        park(data)
        mobility(data)
        climb(data)
        res.status(200)
    } else {
        res.status(200)
    }
};

export default (handler)