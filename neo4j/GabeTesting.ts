import Head from "next/head";
import { Session } from "next-auth";
import { getNeoSession } from "./Session";
import neo4j from "neo4j-driver";

const uri = "bolt://localhost:7687";
const driver = neo4j.driver(uri, neo4j.auth.basic("neo4j", "robotics"));

//create 100 teams with names 0-99 to test with
export async function createNTeams(n: number) {
  const session = getNeoSession();
  for (let index = 0; index < n; index++) {
    const tx = session.beginTransaction();
    try {
      const result = await tx.run(
        "MERGE (a:Team{ name: toInteger($name)}) RETURN a",
        { name: index }
      );

      await tx.commit();
    } catch (error) {
      console.error(error);
    }
  }
}

export async function mobility({ data }: { data: any }) {
  const session = getNeoSession();
  let id: any;
  if (data.mobility == true) {
    try {
      const tx = session.beginTransaction();
      const result = await tx.run(
        "MERGE (c:Mobility{team: toInteger($team)}) return ID(c)",
        {
          team: data.team,
        }
      );
      id = result.records[0].get(0).toNumber();
      await tx.commit();
    } catch (error) {
      console.error(error);
    }
    try {
      const tx = session.beginTransaction();
      const result = await tx.run(
        "MATCH (t:Team), (c:Mobility) WHERE t.name = toInteger($team) AND ID(c) = $id CREATE (t)-[r:MOVED{match:toInteger($match)}]->(c)",
        {
          match: data.match,
          team: data.team,
          id: id,
        }
      );
      await tx.commit();
    } catch (error) {
      console.error(error);
    }
  }
}
// climb
export async function climb({ data }: { data: any }) {
  const session = getNeoSession();
  let id: any;
  if (data.teleopClimb != 0) {
    let climbStatus: String;
    if (data.teleopClimb == 1) {
      climbStatus = "DOCKED";
    } else {
      climbStatus = "ENGAGED";
    }
    try {
      const tx = session.beginTransaction();
      const result = await tx.run(
        "MERGE (c:TeleopClimb{team: toInteger($team)}) return ID(c)",
        {
          team: data.team,
        }
      );
      id = result.records[0].get(0).toNumber();
      await tx.commit();
    } catch (error) {
      console.error(error);
    }
    try {
      const tx = session.beginTransaction();
      const result = await tx.run(
        "MATCH (t:Team), (c:TeleopClimb) WHERE t.name = toInteger($team) AND ID(c) = $id CREATE (t)-[r:" +
          climbStatus +
          "{match:toInteger($match), numPartners:toInteger($numPartners)}]->(c)",
        {
          match: data.match,
          team: data.team,
          id: id,
          numPartners: data.numPartners,
        }
      );
      await tx.commit();
    } catch (error) {
      console.error(error);
    }
  }
  if (data.autoClimb != 0) {
    let climbStatus: String;
    if (data.autoClimb == 1) {
      climbStatus = "DOCKED";
    } else {
      climbStatus = "ENGAGED";
    }
    try {
      const tx = session.beginTransaction();
      const result = await tx.run(
        "MERGE (c:AutoClimb{team: toInteger($team)}) return ID(c)",
        {
          team: data.team,
        }
      );
      id = result.records[0].get(0).toNumber();
      await tx.commit();
    } catch (error) {
      console.error(error);
    }
    try {
      const tx = session.beginTransaction();
      const result = await tx.run(
        "MATCH (t:Team), (c:AutoClimb) WHERE t.name = toInteger($team) AND ID(c) = $id CREATE (t)-[r:" +
          climbStatus +
          "{match:toInteger($match)}]->(c)",
        {
          match: data.match,
          team: data.team,
          id: id,
        }
      );
      await tx.commit();
    } catch (error) {
      console.error(error);
    }
  }
}

//score
export async function score({ data }: { data: any }) {
  const session = getNeoSession();
  //climb
  let id: any;
  for (var i = 0; i < data.cycles.length; i++) {
    try {
      //create the cycle node for the current cycle
      const tx = session.beginTransaction();
      const result = await tx.run(
        "CREATE (a:Cycle{x:$x,y:$y,match:toInteger($match),teleop:$teleop}) RETURN  ID(a)",
        {
          team: data.team,
          x: data.cycles[i].x,
          y: data.cycles[i].y,
          match: data.match,
          teleop: data.cycles[i].teleop,
        }
      );
      id = result.records[0].get(0).toNumber();
      await tx.commit();
      //create the relationship between the team and the cycle
      const tx1 = session.beginTransaction();
      const result1 = await tx1.run(
        "MATCH (t:Team),(a:Cycle) WHERE t.name = toInteger($team) AND ID(a) = $id CREATE (t)-[r:" +
          data.cycles[i].object +
          "{match:toInteger($match),teleop:$teleop}]->(a) ",
        {
          id: id,
          team: data.team,
          x: data.cycles[i].x,
          y: data.cycles[i].y,
          match: data.match,
          teleop: data.cycles[i].teleop,
          object: data.cycles[i].object,
        }
      );
      await tx1.commit();
    } catch (error) {
      console.error(error);
    }
    //if the piece is scored merge the node with the name of the position, and then create the relationship from the cycle to the scoringposition
    if (data.cycles[i].scoringPosition != null) {
      let scoringId: any;
      try {
        const tx2 = session.beginTransaction();
        const result2 = await tx2.run(
          "MERGE (z:ScoringPosition{name: toInteger($name), team:toInteger($team)}) RETURN ID(z)",
          {
            name: data.cycles[i].scoringPosition,
            team: data.team,
          }
        );
        scoringId = result2.records[0].get(0).toNumber();
        await tx2.commit();
        const tx3 = session.beginTransaction();
        const result3 = await tx3.run(
          "MATCH (c:Cycle), (s:ScoringPosition) WHERE ID(c) = $id AND ID(s) = $scoringId CREATE (c)-[r:SCORED{teleop:$teleop, match:toInteger($match),link:$link}]->(s)",
          {
            link: data.cycles[i].link,
            id: id,
            scoringId: scoringId,
            teleop: data.cycles[i].teleop,
            match: data.match,
          }
        );
        await tx3.commit();
      } catch (error) {
        console.error(error);
      }
    }
  }
}
export async function teams({ data }: { data: any }) {
  const session = getNeoSession();
  for (let index = 0; index < data.allies.length; index++) {
    try {
      const tx = session.beginTransaction();
      const result = await tx.run(
        "MATCH (t:Team),(ot:Team) WHERE t.name = $name AND ot.name = $otherName CREATE (t)-[:ALLY{match: toInteger($match)}]->(ot)",
        { name: data.team, otherName: data.allies[index], match: data.match }
      );

      await tx.commit();
    } catch (error) {
      console.error(error);
    }
  }
}

export async function enemies({ data }: { data: any }) {
  const session = getNeoSession();
  for (let index = 0; index < data.enemies.length; index++) {
    try {
      const tx = session.beginTransaction();
      const result = await tx.run(
        "MATCH (t:Team),(ot:Team) WHERE t.name = $name AND ot.name = $otherName CREATE (t)-[:ENEMY{match: toInteger($match})]->(ot)",
        { name: data.team, otherName: data.enemies[index], match: data.match }
      );

      await tx.commit();
    } catch (error) {
      console.error(error);
    }
  }
}

export async function getAmountCube({ team }: { team: number }) {
  const session = getNeoSession();
  const tx = session.beginTransaction();
  try {
    const tx = session.beginTransaction();
    const result = await tx.run(
      "MATCH (t:Team {name: $name})-[:CUBE]->(c:Cycle) RETURN count(*)",
      { name: team }
    );
    console.log(result.records[0].get(0).low);
    await tx.commit();
  } catch (error) {
    console.error(error);
  }
}

export async function getTeam({ team }: { team: number }) {
  const session = getNeoSession();
  let autoPoints: number = 0;
  let points: number = 0;
  let matchesPlayed = 0;
  //auto points
  {
    try {
      const tx = session.beginTransaction();
      const result = await tx.run(
        "MATCH (t:Team {name: $name})--(c:Cycle)-[]->(s:ScoringPosition) WHERE s.name/9 = 0 AND c.teleop = false RETURN count(*)",
        { name: team }
      );
      autoPoints += result.records[0].get(0).low * 3;

      await tx.commit();
    } catch (error) {
      console.error(error);
    }
    try {
      const tx = session.beginTransaction();
      const result = await tx.run(
        "MATCH (t:Team {name: $name})--(c:Cycle)-[]->(s:ScoringPosition) WHERE s.name/9 = 1 AND c.teleop = false RETURN count(*)",
        { name: team }
      );
      autoPoints += result.records[0].get(0).low * 4;

      await tx.commit();
    } catch (error) {
      console.error(error);
    }
    try {
      const tx = session.beginTransaction();
      const result = await tx.run(
        "MATCH (t:Team {name: $name})--(c:Cycle)-[]->(s:ScoringPosition) WHERE s.name/9 = 2 AND c.teleop = false RETURN count(*)",
        { name: team }
      );
      autoPoints += result.records[0].get(0).low * 6;

      await tx.commit();
    } catch (error) {
      console.error(error);
    }
  }
  points = autoPoints;
  //total points
  {
    try {
      const tx = session.beginTransaction();
      const result = await tx.run(
        "MATCH (t:Team {name: $name})--(c:Cycle)-[]->(s:ScoringPosition) WHERE s.name/9 = 0 AND c.teleop = true RETURN count(*)",
        { name: team }
      );
      points += result.records[0].get(0).low * 2;

      await tx.commit();
    } catch (error) {
      console.error(error);
    }
    try {
      const tx = session.beginTransaction();
      const result = await tx.run(
        "MATCH (t:Team {name: $name})--(c:Cycle)-[]->(s:ScoringPosition) WHERE s.name/9 = 1 AND c.teleop = true RETURN count(*)",
        { name: team }
      );
      points += result.records[0].get(0).low * 3;

      await tx.commit();
    } catch (error) {
      console.error(error);
    }
    try {
      const tx = session.beginTransaction();
      const result = await tx.run(
        "MATCH (t:Team {name: $name})--(c:Cycle)-[]->(s:ScoringPosition) WHERE s.name/9 = 2 AND c.teleop = true RETURN count(*)",
        { name: team }
      );
      points += result.records[0].get(0).low * 5;

      await tx.commit();
    } catch (error) {
      console.error(error);
    }
  }
  //total number of matches played
  {
    try {
      const tx = session.beginTransaction();
      const result = await tx.run(
        "MATCH (t:Team {name: $name})-[r]->(n) RETURN COUNT(DISTINCT r.match)",
        { name: team }
      );
      let tempResult: any = 0;
      tempResult = result;
      matchesPlayed = tempResult.records[0]._fields[0].low;
      await tx.commit();
    } catch (error) {
      console.error(error);
    }
  }

  let matchData: Object = {
    team: team,
    autoPoints: autoPoints,
    points: points,
    autoPointsPerGame: autoPoints / matchesPlayed,
    pointsPerGame: points / matchesPlayed,
    matchesPlayed: matchesPlayed,
  };
  return matchData;
}

export async function getMatch({
  team,
  match,
}: {
  team: number;
  match: number;
}) {
  const session = getNeoSession();

  let trueResult: any;
  let nCycles: number;
  let teleopClimb: number = 0;
  let autoClimb: number = 0;
  let numPartners: number = 0;
  let cycles: Object[] = new Array();
  let allies: number[] = new Array(2);
  let enemies: number[] = new Array(3);

  let mobility: boolean = false;
  let conesPickedUp: number = 0;
  let cubesPickedUp: number = 0;
  let autoPoints: number = 0;
  let points: number = 0;
  let piecesScored = 0;
  let scoringAccuracy: number = 0;
  try {
    const tx = session.beginTransaction();
    const result = await tx.run(
      "MATCH (t:Team {name: $name})-[{match: $match}]->(c:Cycle) RETURN count(*)",
      { name: team, match: match }
    );
    nCycles = result.records[0].get(0).low;
    cycles = new Array(nCycles);
    await tx.commit();
  } catch (error) {
    console.error(error);
  }
  try {
    const tx = session.beginTransaction();
    const result = await tx.run(
      "MATCH (t:Team {name: $name})-[r{match: $match}]-(c) RETURN *",
      { name: team, match: match }
    );
    trueResult = result;
    await tx.commit();
  } catch (error) {
    console.error(error);
  }
  let currentCycle: number = 0;
  let currentAlly: number = 0;
  let currentEnemy: number = 0;
  for (let index = 0; index < trueResult.records.length; index++) {
    switch (trueResult.records[index]._fields[0].labels[0]) {
      case "Cycle":
        cycles[currentCycle] = trueResult.records[index]._fields[0].properties;
        currentCycle++;
        break;
      case "AutoClimb":
        if (trueResult.records[index]._fields[1].type == "DOCKED") {
          autoClimb = 1;
        } else {
          autoClimb = 2;
        }
        break;
      case "TeleopClimb":
        numPartners =
          trueResult.records[index]._fields[1].properties.numPartners.low;
        if (trueResult.records[index]._fields[1].type == "DOCKED") {
          teleopClimb = 1;
        } else {
          teleopClimb = 2;
        }
        break;

      case "Team":
        if (trueResult.records[index]._fields[1].type == "ALLY") {
          allies[currentAlly] =
            trueResult.records[index]._fields[0].properties.name.low;
          currentAlly++;
        } else {
          enemies[currentEnemy] =
            trueResult.records[index]._fields[0].properties.name.low;
          currentEnemy++;
        }
        break;
      //default is used for mobility
      default:
        mobility = true;
        break;
    }
  }
  //cones picked up
  try {
    const tx = session.beginTransaction();
    const result = await tx.run(
      "MATCH (t:Team {name: $name})-[:CONE{match: $match}]->(c:Cycle) RETURN count(*)",
      { name: team, match: match }
    );
    conesPickedUp = result.records[0].get(0).low;

    await tx.commit();
  } catch (error) {
    console.error(error);
  }
  //cubes picked up
  try {
    const tx = session.beginTransaction();
    const result = await tx.run(
      "MATCH (t:Team {name: $name})-[:CUBE{match: $match}]->(c:Cycle) RETURN count(*)",
      { name: team, match: match }
    );
    cubesPickedUp = result.records[0].get(0).low;

    await tx.commit();
  } catch (error) {
    console.error(error);
  }
  //auto points
  {
    try {
      const tx = session.beginTransaction();
      const result = await tx.run(
        "MATCH (t:Team {name: $name})-[{match: $match}]-(c:Cycle)-[]->(s:ScoringPosition) WHERE s.name/9 = 0 AND c.teleop = false RETURN count(*)",
        { name: team, match: match }
      );
      autoPoints += result.records[0].get(0).low * 3;

      await tx.commit();
    } catch (error) {
      console.error(error);
    }
    try {
      const tx = session.beginTransaction();
      const result = await tx.run(
        "MATCH (t:Team {name: $name})-[{match: $match}]-(c:Cycle)-[]->(s:ScoringPosition) WHERE s.name/9 = 1 AND c.teleop = false RETURN count(*)",
        { name: team, match: match }
      );
      autoPoints += result.records[0].get(0).low * 4;

      await tx.commit();
    } catch (error) {
      console.error(error);
    }
    try {
      const tx = session.beginTransaction();
      const result = await tx.run(
        "MATCH (t:Team {name: $name})-[{match: $match}]-(c:Cycle)-[]->(s:ScoringPosition) WHERE s.name/9 = 2 AND c.teleop = false RETURN count(*)",
        { name: team, match: match }
      );
      autoPoints += result.records[0].get(0).low * 6;

      await tx.commit();
    } catch (error) {
      console.error(error);
    }
  }
  points = autoPoints;
  //total points
  {
    try {
      const tx = session.beginTransaction();
      const result = await tx.run(
        "MATCH (t:Team {name: $name})-[{match: $match}]-(c:Cycle)-[]->(s:ScoringPosition) WHERE s.name/9 = 0 AND c.teleop = true RETURN count(*)",
        { name: team, match: match }
      );
      points += result.records[0].get(0).low * 2;

      await tx.commit();
    } catch (error) {
      console.error(error);
    }
    try {
      const tx = session.beginTransaction();
      const result = await tx.run(
        "MATCH (t:Team {name: $name})-[{match: $match}]-(c:Cycle)-[]->(s:ScoringPosition) WHERE s.name/9 = 1 AND c.teleop = true RETURN count(*)",
        { name: team, match: match }
      );
      points += result.records[0].get(0).low * 3;

      await tx.commit();
    } catch (error) {
      console.error(error);
    }
    try {
      const tx = session.beginTransaction();
      const result = await tx.run(
        "MATCH (t:Team {name: $name})-[{match: $match}]-(c:Cycle)-[]->(s:ScoringPosition) WHERE s.name/9 = 2 AND c.teleop = true RETURN count(*)",
        { name: team, match: match }
      );
      points += result.records[0].get(0).low * 5;

      await tx.commit();
    } catch (error) {
      console.error(error);
    }
  }
  try {
    const tx = session.beginTransaction();
    const result = await tx.run(
      "MATCH (t:Team {name: $name})-[{match: $match}]-(c:Cycle)-[]->(s:ScoringPosition) RETURN count(*)",
      { name: team, match: match }
    );
    piecesScored = result.records[0].get(0).low;

    await tx.commit();
  } catch (error) {
    console.error(error);
  }
  let matchData: Object = {
    team: team,
    match: match,
    mobility: mobility,
    teleopClimb: teleopClimb,
    autoClimb: autoClimb,
    numPartners: numPartners,
    allies: allies,
    enemies: enemies,
    cycles: cycles,
    cubesPickedUp: cubesPickedUp,
    conesPickedUp: conesPickedUp,
    autoPoints: autoPoints,
    points: points,
    piecesScored: piecesScored,
    scoringAccuracy: piecesScored / (cubesPickedUp + conesPickedUp),
  };
  return matchData;
}

export async function query(qt: string) {
  const session = getNeoSession();
  const tx = session.beginTransaction();

  try {
    const result = await tx.run(qt);
    console.log(result);
  } catch (error) {
    console.error(error);
  }
  await tx.close();
}

export async function addUser(user: Session) {
  const session = getNeoSession();
  const tx = session.beginTransaction();

  try {
    const result = await tx.run(
      "MATCH (a:User{ name: $name, email: $email}) RETURN a",
      { name: user.user?.name, email: user.user?.email }
    );

    console.log(result.records[0]);

    if (result.records[0] == undefined) {
      if (user.user?.email?.includes("@crescentschool.org")) {
        const result = await tx.run(
          "MERGE (a:User{ name: $name, email: $email}) RETURN a",
          { name: user.user?.name, email: user.user?.email }
        );
      }
    }

    await tx.commit();
  } catch (error) {
    console.error(error);
  }
  await tx.close();
}
