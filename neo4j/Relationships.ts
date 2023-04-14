import { Session } from "next-auth";
import { getNeoSession } from "./Session";
import neo4j from 'neo4j-driver'
import { matchData } from "../utils";

//takes the match data for a team as the parameter, creates the ally relaitionships for the team
export async function allies(data: matchData) {
  const session = getNeoSession()
  try {
    const tx = session.beginTransaction()
    for (const ally of data.allies) {
      await tx.run(
        'MERGE (t:Team{name: $a})\n\
          MERGE (ot:Team{name: $b})\n\
          MERGE (t) - [:ALLY{match: $m}] - (ot)',
        { a: data.team, m: data.match, b: ally }
      )
    }

    await tx.commit()

  } catch (error) {
    console.error(error)
  } finally {
    session.close()
  }
}
//takes the match data for a team as the parameter, creates the enemy relaitionships for the team

export async function enemies(data: matchData) {
  const session = getNeoSession()
  try {
    const tx = session.beginTransaction()
    for (const enemy of data.enemies) {
      await tx.run(
        'MERGE (t:Team{name: $a})\n\
          MERGE (ot:Team{name: $b})\n\
          MERGE (t) - [:ENEMY{match: $m}] - (ot)',
        { a: data.team, m: data.match, b: enemy }
      )

    }
    await tx.commit()

  } catch (error) {
    console.error(error)
  } finally {
    session.close()
  }
}

export async function defence(data: matchData) {
  const session = getNeoSession()
  try {
    const tx = session.beginTransaction()
    for (const def of data.defended) {
      await tx.run(
        'MERGE (t:Team{name: $a})\n\
          MERGE (ot:Team{name: $b})\n\
          MERGE (t) - [:DEFENDED{match: $m, time: $time}] - (ot)',
        { a: data.team, m: data.match, time: def.time, b: def.team }
      )

    }
    await tx.commit()

  } catch (error) {
    console.error(error)
  } finally {
    session.close()
  }
}