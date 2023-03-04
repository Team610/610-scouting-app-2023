import { Session } from "next-auth";
import { getNeoSession } from "./Session";
import neo4j from 'neo4j-driver'
import { addDummyData, createNTeams } from "./AddData";
import { getMatchList } from "./Aggregate";

export async function getTeams() {

    const session = getNeoSession();
    const tx = session.beginTransaction()
    let tempResult:any;
    let finalResult = new Array;

    try {
        const result = await tx.run(
          'MATCH (t:Team) RETURN t',
        )
        tempResult = result;
 
 
        for (let index = 0; index < tempResult.records.length; index++) {
          // console.log(tempResult.records[index]._fields[0].identity.low);
          finalResult.push(tempResult.records[index]._fields[0].properties.name.low);
        }

        console.log(tempResult)
 
 
        return finalResult;
    }
    catch (error) {
        console.error(error)
      }
 
 
}