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
          finalResult.push(tempResult.records[index]._fields[0].properties.name.low);
        }

        console.log(tempResult)
 
 
        return finalResult;
    }
    catch (error) {
        console.error(error)
      }
 
}

export async function getMatchByValueAndRelatoinship(relationship: String, team: number) {
  const session = getNeoSession()
  const tx = session.beginTransaction()
  try {
      if (relationship != "SCORED") {
          const result = await tx.run(
              'MATCH (t:Team{name: $name})-[:' + relationship + '{match}]->(n) RETURN n.match',
              {name:team,relationship:relationship}
          )
          console.log(result)
      }
  } catch (error) {
      console.error(error)
  }
}