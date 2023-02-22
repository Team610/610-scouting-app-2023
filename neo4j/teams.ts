import { resourceLimits } from "worker_threads";
import { getNeoSession } from "./Session";



export async function getTeams() {

    const session = getNeoSession();
    const tx = session.beginTransaction()
    try {
        const result = await tx.run(
          'MATCH (t:Team)RETURN t',
        )
        return result;
    }
    catch (error) {
        console.error(error)
      }

}