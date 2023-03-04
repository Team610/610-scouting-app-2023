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
      const _ = await tx.run(
        'MERGE (:Team{name:$allyname})',
        { allyname: data.allies[index] }
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

//takes the match data for a team as the parameter, creates the ally relaitionships for the team
export async function addOneAlly({ team1, team2, match }: { team1: string, team2: string, match: string }) {
  const session = getNeoSession()
  try {
    const tx = session.beginTransaction()
    await tx.run(
      'MERGE (:Team{name:$allyname})',
      { allyname: team2 }
    )

    await tx.run(
      'MATCH (t:Team),(ot:Team) WHERE t.name = $name AND ot.name = $otherName CREATE (t)-[:ALLY{match: toString($match)}]->(ot)',
      { name: team1, otherName: team2, match: match },
    )

    await tx.commit()
    await session.close()

  } catch (error) {
    console.error(error)
  }
}

//takes the match data for a team as the parameter, creates the ally relaitionships for the team
export async function addOneEnemy({ team1, team2, match }: { team1: string, team2: string, match: string }) {
  const session = getNeoSession()
  try {
    const tx = session.beginTransaction()
    await tx.run(
      'MERGE (:Team{name:$enemname})',
      { enemname: team2 }
    )

    await tx.run(
      'MATCH (t:Team),(ot:Team) WHERE t.name = $name AND ot.name = $otherName CREATE (t)-[:ENEMY{match: toString($match)}]->(ot)',
      { name: team1, otherName: team2, match: match },
    )

    await tx.commit()
    await session.close()

  } catch (error) {
    console.error(error)
  }
}

export async function matchRelationships({ redTeams, blueTeams, matchNo }: { redTeams: string[], blueTeams: string[], matchNo: string }) {
  await addOneAlly({team1: redTeams[0], team2: redTeams[2], match : matchNo})
  await addOneAlly({team1: redTeams[0], team2: redTeams[1], match : matchNo})
  await addOneAlly({team1: redTeams[1], team2: redTeams[2], match : matchNo})

  await addOneEnemy({team1: redTeams[0], team2: blueTeams[0], match : matchNo})
  await addOneEnemy({team1: redTeams[0], team2: blueTeams[1], match : matchNo})
  await addOneEnemy({team1: redTeams[0], team2: blueTeams[2], match : matchNo})

  await addOneEnemy({team1: redTeams[1], team2: blueTeams[0], match : matchNo})
  await addOneEnemy({team1: redTeams[1], team2: blueTeams[1], match : matchNo})
  await addOneEnemy({team1: redTeams[1], team2: blueTeams[2], match : matchNo})

  await addOneEnemy({team1: redTeams[2], team2: blueTeams[0], match : matchNo})
  await addOneEnemy({team1: redTeams[2], team2: blueTeams[1], match : matchNo})
  await addOneEnemy({team1: redTeams[2], team2: blueTeams[2], match : matchNo})

}


//takes the match data for a team as the parameter, creates the enemy relaitionships for the team

export async function enemies(data: any) {
  const session = getNeoSession()
  for (let index = 0; index < data.enemies.length; index++) {
    try {
      const tx = session.beginTransaction()

      const _ = await tx.run(
        'MERGE (:Team{name:$allyname})',
        { allyname: data.allies[index] }
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
