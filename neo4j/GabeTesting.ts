import Head from "next/head";
import { Session } from "next-auth";
import { getNeoSession } from "./Session";
import neo4j from 'neo4j-driver'

const uri = "bolt://localhost:7687"
const driver = neo4j.driver(uri, neo4j.auth.basic("neo4j", "robotics"))

//create 100 teams with names 0-99 to test with 
export async function createNTeams(n: number) {
  const session = getNeoSession()
  for (let index = 0; index < n; index++) {
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

// climb
export async function climb({ data }: { data: any }) {
  const session = getNeoSession()
  let id: any;
  if (data.teleopClimb != 0) {
    let climbStatus: String;
    if (data.teleopClimb == 1) {
      climbStatus = "DOCKED"
    } else {
      climbStatus = "ENGAGED"
    }
    try {
      const tx = session.beginTransaction()
      const result = await tx.run(
        'MERGE (c:TeleopClimb{team: toInteger($team)}) return ID(c)',
        {
          team: data.team,
        },
      )
      id = result.records[0].get(0).toNumber()
      await tx.commit()
    } catch (error) {
      console.error(error)
    }
    try {
      const tx = session.beginTransaction()
      const result = await tx.run(
        'MATCH (t:Team), (c:TeleopClimb) WHERE t.name = toInteger($team) AND ID(c) = $id CREATE (t)-[r:' + climbStatus + '{match:toInteger($match), numPartners:toInteger($numPartners)}]->(c)',
        {
          match: data.match,
          team: data.team,
          id: id,
          numPartners: data.numPartners
        },
      )
      await tx.commit()
    } catch (error) {
      console.error(error)
    }
  }
  if (data.autoClimb != 0) {
    let climbStatus: String;
    if (data.autoClimb == 1) {
      climbStatus = "DOCKED"
    } else {
      climbStatus = "ENGAGED"
    }
    try {
      const tx = session.beginTransaction()
      const result = await tx.run(
        'MERGE (c:AutoClimb{team: toInteger($team)}) return ID(c)',
        {
          team: data.team,
        },
      )
      id = result.records[0].get(0).toNumber()
      await tx.commit()
    } catch (error) {
      console.error(error)
    }
    try {
      const tx = session.beginTransaction()
      const result = await tx.run(
        'MATCH (t:Team), (c:AutoClimb) WHERE t.name = toInteger($team) AND ID(c) = $id CREATE (t)-[r:' + climbStatus + '{match:toInteger($match)}]->(c)',
        {
          match: data.match,
          team: data.team,
          id: id,
        },
      )
      await tx.commit()
    } catch (error) {
      console.error(error)
    }
  }
}

//score
export async function score({ data }: { data: any }) {
  const session = getNeoSession()
  //climb
  let id: any;
  for(var j = 0; j < data.length; j++){
    for (var i = 0; i < data[j].cycles.length; i++) {
      try {
        //create the cycle node for the current cycle
        const tx = session.beginTransaction()
        const result = await tx.run(
          'CREATE (a:Cycle{x:$x,y:$y,match:toInteger($match),teleop:$teleop}) RETURN  ID(a)',
          {
            team: data[j].team,
            x: data[j].cycles[i].x,
            y: data[j].cycles[i].y,
            match: data[j].match,
            teleop: data[j].cycles[i].teleop,
          },
        )
        id = result.records[0].get(0).toNumber()
        await tx.commit()
        //create the relationship between the team and the cycle
        const tx1 = session.beginTransaction()
        const result1 = await tx1.run(
          'MATCH (t:Team),(a:Cycle) WHERE t.name = toInteger($team) AND ID(a) = $id CREATE (t)-[r:' + data[j].cycles[i].object + '{match:toInteger($match),teleop:$teleop}]->(a) ',
          {
            id: id,
            team: data[j].team,
            x: data[j].cycles[i].x,
            y: data[j].cycles[i].y,
            match: data[j].match,
            scoringPosition: data[j].cycles[i].scoringPosition,
            teleop: data[j].cycles[i].teleop,
            object: data[j].cycles[i].object
          },
        )
        await tx1.commit()
      } catch (error) {
        console.error(error)
      }
      //if the piece is scored merge the node with the name of the position, and then create the relationship from the cycle to the scoringposition
      if (data[j].cycles[i].scoringPosition != null) {
        let scoringId: any;
        try {
          const tx2 = session.beginTransaction()
          const result2 = await tx2.run(
            'MERGE (z:ScoringPosition{name: $name, team:toInteger($team)}) RETURN ID(z)',
            {
              name: data[j].cycles[i].scoringPosition,
              team: data[j].team
            },
          )
          scoringId = result2.records[0].get(0).toNumber()
          await tx2.commit()
          console.log(id + " " + scoringId)
          const tx3 = session.beginTransaction()
          const result3 = await tx3.run(
            'MATCH (c:Cycle), (s:ScoringPosition) WHERE ID(c) = $id AND ID(s) = $scoringId CREATE (c)-[r:SCORED{teleop:$teleop, match:toInteger($match)}]->(s)',
            {
              id: id,
              scoringId: scoringId,
              teleop: data[j].cycles[i].teleop,
              match: data[j].match
            }
          )
          await tx3.commit()
        } catch (error) {
          console.error(error)
        }

      }
    }
  }
}

export async function getAmountCube({ team }: { team: number }) {
  const session = getNeoSession()
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

export async function query(qt: string){
  const session = getNeoSession()
  const tx = session.beginTransaction()

  try{
    const result = await tx.run(qt)
    console.log(result)
  } catch (error) {
    console.error(error)
  }
  await tx.close()
}
