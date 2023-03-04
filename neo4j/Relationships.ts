import { Session } from "next-auth";
import { getNeoSession } from "./Session";
import neo4j from 'neo4j-driver'
import { matchData } from "./AddData";

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
        
      } catch (error) {
        console.error(error)
      }
    }
  }
//takes the match data for a team as the parameter, creates the enemy relaitionships for the team

  export async function enemies(data: any) {
    console.log(data.enemies)
    const session = getNeoSession()
    for (let index = 0; index < data.enemies.length; index++) {
      try {
        const tx = session.beginTransaction()
        
        const _ = await tx.run  (
          'MERGE (:Team{name:$allyname})',
          { allyname: data.enemies[index]}
        )

        const result = await tx.run(
          'MATCH (t:Team),(ot:Team) WHERE t.name = $name AND ot.name = $otherName CREATE (t)-[:ENEMY{match: toString($match)}]->(ot)',
          { name: data.team, otherName: data.enemies[index], match: data.match },
        )
  
        await tx.commit()
        
      } catch (error) {
        console.error(error)
      }
    }
  }
  