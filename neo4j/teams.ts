import { Anybody } from "@next/font/google";
import { resourceLimits } from "worker_threads";
import { getNeoSession } from "./Session";



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
          finalResult.push(tempResult.records[index]._fields[0].identity.low);
        }

        return finalResult;
    }
    catch (error) {
        console.error(error)
      }

}