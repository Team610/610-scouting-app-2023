import { Session } from "next-auth";
import { getNeoSession } from "./Session";
import neo4j from 'neo4j-driver'
import { matchData } from "../utils";

//takes the match data for a team as the parameter, creates the ally relaitionships for the team
export async function allies(data: matchData) {
    const session = getNeoSession()
    for (let index = 0; index < data.allies.length; index++) {
      try {
        const tx = session.beginTransaction()
        const _ = await tx.run  (
          'MERGE (:Team{name:toInteger($allyname)})',
          { allyname: data.allies[index]}
        )
  
        const result = await tx.run(
          'MATCH (t:Team),(ot:Team) WHERE t.name = toInteger($name) AND ot.name = toInteger($otherName) CREATE (t)-[:ALLY{match: toString($match)}]->(ot)',
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
        
        const _ = await tx.run  (
          'MERGE (:Team{name:toInteger($enemyname)})',
          { enemyname: data.enemies[index]}
        )

        const result = await tx.run(
          'MATCH (t:Team),(ot:Team) WHERE t.name = toInteger($name) AND ot.name = toInteger($otherName) CREATE (t)-[:ENEMY{match: toString($match)}]->(ot)',
          { name: data.team, otherName: data.enemies[index], match: data.match },
        )
  
        await tx.commit()
        
      } catch (error) {
        console.error(error)
      }
    }
  }
  
  export async function defence(data: any) {
    const session = getNeoSession()
    for (let index = 0; index < data.defended.length; index++) {
      try {
        const tx = session.beginTransaction()
        
        const _ = await tx.run  (
          'MERGE (:Team{name:toInteger($enemyname)})',
          { enemyname: data.defended[index]["team"]}
        )

        const result = await tx.run(
          'MATCH (t:Team),(ot:Team) WHERE t.name = toInteger($name) AND ot.name = toInteger($otherName) CREATE (t)-[:DEFENDED{match: toString($match), time: toFloat($time)}]->(ot)',
          { name: data.team, otherName: data.defended[index]["team"], match: data.match, time: data.defended[index]["time"] },
        )
  
        await tx.commit()
        
      } catch (error) {
        console.error(error)
      }
    }
  }