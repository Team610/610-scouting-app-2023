import Head from "next/head";
import neo4j from 'neo4j-driver'

const uri = "bolt://localhost:7687"
const driver = neo4j.driver(uri, neo4j.auth.basic("neo4j", "password"))
const session = driver.session()
const personName = 'Alice'

//create 100 teams with names 0-99 to test with 
export async function create100Teams() {
  for (let index = 0; index < 100; index++) {
    const tx = session.beginTransaction()
    try {
      const result = await tx.run(
        'MERGE (a:Team{ name: toInteger($name)}) RETURN a',
        { name: index },
      )

      await tx.commit()
    } catch (error) {
      console.error(error)
    }
  }
}
//score
export async function score({ data }: { data: any }) {
  let id: any;
  //increment through each cycle of the json
  console.log(data.cycles.length)
  for (var i = 0; i < data.cycles.length; i++) {
    try {
      //create the cycle node for the current cycle
      const tx = session.beginTransaction()
      const result = await tx.run(
        'CREATE (a:Cycle{x:$x,y:$y,match:toInteger($match),teleop:$teleop}) RETURN  ID(a)',
        {
          team: data.team,
          x: data.cycles[i].x,
          y: data.cycles[i].y,
          match: data.match,
          teleop: data.cycles[i].teleop,
        },
      )
      id = result.records[0].get(0).toNumber()
      await tx.commit()
      //create the relationship between the team and the cycle
      const tx1 = session.beginTransaction()
      const result1 = await tx1.run(
        'MATCH (t:Team),(a:Cycle) WHERE t.name = toInteger($team) AND ID(a) = $id CREATE (t)-[r:' + data.cycles[i].object + '{match:toInteger($match),teleop:$teleop}]->(a) ',
        {
          id: id,
          team: data.team,
          x: data.cycles[i].x,
          y: data.cycles[i].y,
          match: data.match,
          scoringPosition: data.cycles[i].scoringPosition,
          teleop: data.cycles[i].teleop,
          object: data.cycles[i].object
        },
      )
      await tx1.commit()
    } catch (error) {
      console.error(error)
    }
    //if the piece is scored merge the node with the name of the position, and then create the relationship from the cycle to the scoringposition
    if (data.cycles[i].scoringPosition != null) {
      let scoringId: any;
      try {
        const tx2 = session.beginTransaction()
        const result2 = await tx2.run(
          'MERGE (z:ScoringPosition{name: $name, team:toInteger($team)}) RETURN ID(z)',
          { name: data.cycles[i].scoringPosition, 
            team: data.team },
        )
          scoringId = result2.records[0].get(0).toNumber()
        await tx2.commit()
        console.log(id + " " + scoringId)
        const tx3 = session.beginTransaction()
        const result3 = await tx3.run(
          'MATCH (c:Cycle), (s:ScoringPosition) WHERE ID(c) = $id AND ID(s) = $scoringId CREATE (c)-[r:SCORED{teleop:$teleop, match:toInteger($match)}]->(s)',
          {
            id:id,
            scoringId:scoringId,
            teleop:data.cycles[i].teleop,
            match:data.match
          }
        )
        await tx3.commit()
      } catch (error) {
        console.error(error)
      }

    }
  }
}

export async function getAmountCube({team} : {team:number}) {
  const tx = session.beginTransaction()
    try {
      const result = await tx.run(
        '',
        {},
      )

      await tx.commit()
    } catch (error) {
      console.error(error)
    }
}

export async function friends() {
  const tx = session.beginTransaction()
  try {
    const result = await tx.run(
      'MATCH (a:Person), (b:Person) WHERE a.name = $name1 AND b.name = $name2 CREATE (a)-[:FRIENDS_WITH{since: $since}]->(b)',
      { name1: 'BOB', name2: 'JEF', since: '2017' },
    )

    await tx.commit()
  } catch (error) {
    console.error(error)
  }
}

export async function edit() {
  const tx = session.beginTransaction()
  try {
    const result = await tx.run(
      'MATCH (a:Person{name: $nameOG}) SET a.name = $nameNew',
      { nameOG: 'DAN', nameNew: 'BOB' },
    )
    await tx.commit()
  } catch (error) {
    console.error(error)
  }
}

export async function closeDriver() {
  // on application exit:
  await session.close()
  await driver.close()
}
