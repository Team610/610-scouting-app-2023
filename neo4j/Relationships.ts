import { Session } from "next-auth";
import { getNeoSession } from "./Session";
import neo4j from 'neo4j-driver'

//takes the match data for a team as the parameter, creates the ally relaitionships for the team
export async function allies(data: any) {
    const session = getNeoSession()
    for (let index = 0; index < data.allies.length; index++) {
      try {
        const tx = session.beginTransaction()
        const result = await tx.run(
          'MATCH (t:Team),(ot:Team) WHERE t.name = $name AND ot.name = $otherName CREATE (t)-[:ALLY{match: toInteger($match)}]->(ot)',
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
    const session = getNeoSession()
    for (let index = 0; index < data.enemies.length; index++) {
      try {
        const tx = session.beginTransaction()
        const result = await tx.run(
          'MATCH (t:Team),(ot:Team) WHERE t.name = $name AND ot.name = $otherName CREATE (t)-[:ENEMY{match: toInteger($match)}]->(ot)',
          { name: data.team, otherName: data.enemies[index], match: data.match },
        )
  
        await tx.commit()
        
      } catch (error) {
        console.error(error)
      }
    }
  }
  