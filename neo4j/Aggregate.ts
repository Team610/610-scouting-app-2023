import { Session } from "next-auth";
import { getNeoSession } from "./Session";
import neo4j from "neo4j-driver";
import {
  defaultTeam,
  teamAggData,
  arrayAverage,
  standardDeviation,
  roundToTwo,
} from "../utils";
import { getTeams } from "./GetData";

// returns how many game pieces the robot scored in that row: 1 is bottom, 3 is top
export async function getTeamScoreLocation(
  team: number,
  row: number,
  teleop: boolean,
  tx: any
) {
  try {
    if (row == 1) {
      const result = await tx.run(
        'MATCH (t:Team {name: $name})--(c:Cycle)-[]->(s:ScoringPosition) WHERE s.name = "bottom" AND c.teleop = $teleTrue RETURN count(*)',
        { name: team, teleTrue: teleop }
      );
      return result.records[0].get(0).low;
    } else if (row == 2) {
      const result = await tx.run(
        'MATCH (t:Team {name: $name})--(c:Cycle)-[]->(s:ScoringPosition) WHERE s.name = "middle" AND c.teleop = $teleTrue RETURN count(*)',
        { name: team, teleTrue: teleop }
      );
      return result.records[0].get(0).low;
    } else if (row == 3) {
      const result = await tx.run(
        'MATCH (t:Team {name: $name})--(c:Cycle)-[]->(s:ScoringPosition) WHERE s.name = "top" AND c.teleop = $teleTrue RETURN count(*)',
        { name: team, teleTrue: teleop }
      );
      return result.records[0].get(0).low;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getMaxPiecesScored(team: number, tx: any) {
  const matches = await getMatchList(team);
  let max = 0;
  for (let i = 0; i < matches?.length!; i++) {
    let temp = 0;
    const res = await tx.run(
      "MATCH (t:Team {name: $name})-[{match: $match}]->(m:Cycle) - [:SCORED] -> (q:ScoringPosition) RETURN count(q)",
      { name: team, match: matches![i] }
    );
    temp = res.records[0].get(0).low;
    if (temp > max) {
      max = temp;
    }
  }
  return max;
}

// get where team picked up pieces in all matches
export async function getPiecesScoredAllMatches(
  team: number,
  piece: string,
  teleop: boolean,
  tx: any
) {
  const res = await tx.run(
    "MATCH (t:Team {name: $name})-[r:" +
      piece +
      "]->(m:Cycle) - [:SCORED{teleop: $teleop}] -> (q:ScoringPosition) RETURN count(*)",
    { name: team, piece: piece, teleop: teleop }
  );

  return res.records[0].get(0).low;
}

// get where team picked up pieces in a match, given what piece
export async function getPiecesScored(
  team: number,
  match: String,
  piece: string,
  tx: any
) {
  const res = await tx.run(
    "MATCH (t:Team {name: $name})-[:" +
      piece +
      "{match: toString($match)}]->(c:Cycle) - [:SCORED] -> (q:ScoringPosition) RETURN count(*)",
    { name: team, match: match, piece: piece }
  );
  return res.records[0].get(0).low;
}

// get the number of cycles a team did in a match
export async function getNumberCycles(team: number, match: String, tx: any) {
  const result = await tx.run(
    "MATCH (t:Team {name: $name})-[{match: toString($match)}]->(c:Cycle) RETURN count(*)",
    { name: team, match: match }
  );
  return result.records[0].get(0).low;
}

// get the number of cycles a team did in all matches
export async function getNumberCyclesAllMatches(team: number, tx: any) {
  const result = await tx.run(
    "MATCH (t:Team {name: $name})-[]->(c:Cycle) RETURN count(*)",
    { name: team }
  );
  return result.records[0].get(0).low;
}

// get the weighted number of cycles a team did in all matches:
// high cycle : coefficient of 5
// middle cycle: coefficient of 3
// low cycle: coefficient of 2
export async function getWeightedCyclesAllMatches(team: number, tx: any) {
  let res: number = 0;
  const lower = await tx.run(
    'MATCH (t:Team {name: $name})-[]->(c:Cycle)-[]->(m:ScoringPosition) WHERE m.name = "bottom" RETURN count(*)',
    { name: team }
  );
  res += 2 * lower.records[0].get(0).low;
  const middle = await tx.run(
    'MATCH (t:Team {name: $name})-[]->(c:Cycle)-[]->(m:ScoringPosition) WHERE m.name = "middle" RETURN count(*)',
    { name: team }
  );
  res += 3 * middle.records[0].get(0).low;

  const higher = await tx.run(
    'MATCH (t:Team {name: $name})-[]->(c:Cycle)-[]->(m:ScoringPosition) WHERE m.name = "top" RETURN count(*)',
    { name: team }
  );

  res += 5 * higher.records[0].get(0).low;

  return res;
}

// returns nodes connected to a team node in a given match
export async function getMatchNodes(team: number, match: String, tx: any) {
  const result = await tx.run(
    "MATCH (t:Team {name: $name})-[r{match: toString($match)}]-(c) RETURN *",
    { name: team, match: match }
  );
  return result;
}
export async function getnumberOfLinksMatch(
  team: number,
  match: String,
  tx: any
) {
  const result = await tx.run(
    "MATCH (t:Team {name: $name})-[r{match: toString($match)}]-(c:Cycle)-[o{link:true}]-(s:ScoringPosition) RETURN *",
    { name: team, match: match }
  );
  let returnValue: number = 0;
  if (result.records.length > 0) {
    returnValue = result.records.length - 1;
  }
  return returnValue;
}
export async function getnumberOfLinks(team: number, tx: any) {
  const result = await tx.run(
    "MATCH (t:Team {name: $name})--(c:Cycle)-[o{link:true}]-(s:ScoringPosition) RETURN *",
    { name: team }
  );
  let returnValue: number = 0;
  if (result.records.length > 0) {
    returnValue = result.records.length - 1;
  }
  return returnValue;
}

// get where team picked up pieces in a match, given what piece
export async function getPiecesPickedUp(
  team: number,
  match: String,
  piece: string,
  tx: any
) {
  //cones picked up
  const result = await tx.run(
    "MATCH (t:Team {name: $name})-[:" + piece +
      "{match: toString($match)}]->(c:Cycle) RETURN count(*)",
    { name: team, match: match}
  );
  return result.records[0].get(0).low;
}

export async function getPiecesByLevel(team: number){
  let res = {}
  let pieces = ['', 'cone', 'cube']
  const session = getNeoSession();
  const tx = session.beginTransaction();
  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i];
    res[piece!="" ? piece : "total"] = {}
    for (let row = 0; row < 3; row++) {
      try {
        const result = await tx.run(
          'MATCH (t:Team {name: $name})-' + (piece=="" ? '[]' : '[:' + piece + ']') + '-(c:Cycle {teleop: TRUE}) OPTIONAL MATCH (c)--(s:ScoringPosition {name: $row}) RETURN count(c) AS cycleCount, count(s) AS scoredCount',
          { name: team, row: row == 0 ? "bottom" : row == 1 ? "middle" : "top"}
        );

        res[piece!="" ? piece : "total"][row] = {
          cycles: result.records[0].get("cycleCount")["low"], 
          scored: result.records[0].get("scoredCount")["low"]
        }
      }
      catch(e){console.error(e)}
    }
  }
  return res
}

// get where team picked up pieces in all matches
export async function getPiecesPickedUpAllMatches(
  team: number,
  piece: string,
  tx: any
) {
  //cones picked up
  const result = await tx.run(
    "MATCH (t:Team {name: $name})-[:" + piece + "]->(c:Cycle) RETURN count(*)",
    { name: team, piece: piece }
  );
  return result.records[0].get(0).low;
}

// get links a team contributed in all matches
export async function getLinks(team: number, tx: any) {
  //cones picked up
  const result = await tx.run(
    "MATCH (n:Team{name:$team})-[]-(m:Cycle)-[s:SCORED{link:true}]-() RETURN COUNT(*)",
    { team: team }
  );
  return result.records[0].get(0).low;
}

export async function getTeamScoreLocationByMatch(
  team: number,
  row: number,
  match: String,
  teleop: boolean,
  tx: any
) {
  try {
    if (row == 1) {
      const result = await tx.run(
        'MATCH (t:Team {name: $name})--(c:Cycle)-[{match:toString($match)}]->(s:ScoringPosition) WHERE s.name = "bottom" AND c.teleop = $teleTrue RETURN count(*)',
        { name: team, match: match, row: row - 1, teleTrue: teleop }
      );
      return result.records[0].get(0).low;
    } else if (row == 2) {
      const result = await tx.run(
        'MATCH (t:Team {name: $name})--(c:Cycle)-[{match:toString($match)}]->(s:ScoringPosition) WHERE s.name = "middle" AND c.teleop = $teleTrue RETURN count(*)',
        { name: team, match: match, row: row - 1, teleTrue: teleop }
      );

      return result.records[0].get(0).low;
    } else if (row == 3) {
      const result = await tx.run(
        'MATCH (t:Team {name: $name})--(c:Cycle)-[{match:toString($match)}]->(s:ScoringPosition) WHERE s.name = "top" AND c.teleop = $teleTrue RETURN count(*)',
        { name: team, match: match, row: row - 1, teleTrue: teleop }
      );
      return result.records[0].get(0).low;
    }
  } catch (error) {
    console.error(error);
  }
}

// returns how many games a certain team played
export async function getMatchesPlayed(team: number, tx: any) {
  const result = await tx.run(
    "MATCH (t:Team {name: $name})-[r]->(n) RETURN COUNT(DISTINCT r.match)",
    { name: team }
  );
  return result.records[0].get(0).low;
}

// returns [# park, # dock, # engage]
export async function getClimbAllMatches(
  team: number,
  teleop: boolean,
  tx: any
) {
  let climbs = Array(3);

  let result = await tx.run(
    "MATCH (t:Team {name: $name})-[]-(c:" +
      (teleop ? "Park" : "Mobility") +
      ") RETURN count(*)",
    { name: team }
  );

  climbs[0] = result.records[0].get(0).low;

  result = await tx.run(
    "MATCH (t:Team {name: $name})-[:DOCKED]-(:" +
      (teleop ? "Teleop" : "Auto") +
      "Climb) RETURN count(*)",
    { name: team }
  );

  climbs[1] = result.records[0].get(0).low;

  result = await tx.run(
    "MATCH (t:Team {name: $name})-[:ENGAGED]-(:" +
      (teleop ? "Teleop" : "Auto") +
      "Climb) RETURN count(*)",
    { name: team }
  );

  climbs[2] = result.records[0].get(0).low;

  return climbs;
}

async function getAutoCyclesByMatch(team: number, match: String, tx: any) {
  let result = await tx.run(
    "MATCH (t:Team {name:$name})--(c:Cycle {match: $match}) RETURN count(c)",
    {
      name: team,
      match: match,
    }
  );
  console.log(result);
}

/**takes the team number as a parameter, returns an object with the following format
* @return : 
{team: team,
    matchesPlayed: matchesPlayed,
    autoPPG: auto points per game,
    PPG: points per game,
    scoring accuracy: pieces scored / pieces picked up
    cone accuracy: cones scored / cones picked up
    cube accuracy: cubes scored / cubes picked up
    cycles per game: cycles per game
    scoring positions: [scored in lower, scored in middle, scored in higher]
    links per game: links per game
    teleopClimbPPG: teleopClimb,
    autoClimbPPG: autoClimb
}
 */
export async function calculateTeamAgg({ team }: { team: number }) {
  const session = getNeoSession();

  let startTime = Date.now()

  let autoPoints: number = 0;
  let points: number = 0;
  let matchesPlayed: number = 0;
  let conesPickedUp: number = 0;
  let cubesPickedUp: number = 0;
  let autoConesScored: number = 0;
  let autoCubesScored: number = 0;
  let teleopConesScored: number = 0;
  let teleopCubesScored: number = 0;
  let conesScored: number = 0;
  let cubesScored: number = 0;
  let ncycles: number = 0;
  let nWcycles: number = 0;
  let scoringPositions = Array(3);
  let autoClimbPoints: number = 0;
  let teleopClimbPoints: number = 0;
  let autoClimb: Array<number>;
  let teleopClimb: Array<number>;
  let links: number = 0;
  let maxPiecesScored: number = 0;

  try {
    const tx = session.beginTransaction();
    matchesPlayed = await getMatchesPlayed(team, tx);

    let autoLow = await getTeamScoreLocation(team, 1, false, tx);
    let autoMid = await getTeamScoreLocation(team, 2, false, tx);
    let autoHigh = await getTeamScoreLocation(team, 3, false, tx);

    let teleopLow = await getTeamScoreLocation(team, 1, true, tx);
    let teleopMid = await getTeamScoreLocation(team, 2, true, tx);
    let teleopHigh = await getTeamScoreLocation(team, 3, true, tx);

    links = await getnumberOfLinks(team, tx);

    //auto points
    autoPoints = 3 * autoLow + 4 * autoMid + 6 * autoHigh;
    points =
      autoPoints + 2 * teleopLow + 3 * teleopMid + 5 * teleopHigh + 5 * links;

    autoClimb = await getClimbAllMatches(team, false, tx);
    teleopClimb = await getClimbAllMatches(team, true, tx);

    autoClimbPoints = 3 * autoClimb[0] + 8 * autoClimb[1] + 12 * autoClimb[2];
    teleopClimbPoints =
      2 * teleopClimb[0] + 6 * teleopClimb[1] + 10 * teleopClimb[2];

    autoPoints += autoClimbPoints;
    points += autoClimbPoints + teleopClimbPoints;

    scoringPositions[0] = ((autoLow + teleopLow) * 1.0) / matchesPlayed;
    scoringPositions[1] = ((autoMid + teleopMid) * 1.0) / matchesPlayed;
    scoringPositions[2] = ((autoHigh + teleopHigh) * 1.0) / matchesPlayed;

    conesPickedUp = await getPiecesPickedUpAllMatches(team, "cone", tx);
    cubesPickedUp = await getPiecesPickedUpAllMatches(team, "cube", tx);

    autoConesScored = await getPiecesScoredAllMatches(team, "cone", false, tx);
    autoCubesScored = await getPiecesScoredAllMatches(team, "cube", false, tx);

    teleopConesScored = await getPiecesScoredAllMatches(team, "cone", true, tx);
    teleopCubesScored = await getPiecesScoredAllMatches(team, "cube", true, tx);

    cubesScored = teleopCubesScored + autoCubesScored;
    conesScored = teleopConesScored + autoConesScored;

    ncycles = await getNumberCyclesAllMatches(team, tx);
    nWcycles = await getWeightedCyclesAllMatches(team, tx);
    links = await getLinks(team, tx);
    maxPiecesScored = await getMaxPiecesScored(team, tx);

    await tx.close();
    await session.close();
  } catch (error) {
    console.error(error);
  }

  let teamdata: teamAggData = {
    team: team,
    matchesPlayed: matchesPlayed,
    autoPPG: roundToTwo(autoPoints / matchesPlayed),
    PPG: roundToTwo(points / matchesPlayed),
    cyclesPG: roundToTwo(ncycles / matchesPlayed),
    weightedCyclesPG: nWcycles / matchesPlayed,
    avgPiecesScored: (conesScored + cubesScored) / matchesPlayed,
    maxPiecesScored: maxPiecesScored,
    scoringAccuracy:
      roundToTwo((conesScored + cubesScored) / (conesPickedUp + cubesPickedUp)),
    coneAccuracy: roundToTwo(conesScored / conesPickedUp),
    cubeAccuracy: roundToTwo(cubesScored / cubesPickedUp),
    scoringPositions: scoringPositions,
    autoClimbPPG: roundToTwo(autoClimbPoints / matchesPlayed),
    teleopClimbPPG: roundToTwo(teleopClimbPoints / matchesPlayed),
    climbPPG: roundToTwo((autoClimbPoints + teleopClimbPoints) / matchesPlayed),
    linkPG: roundToTwo(links / matchesPlayed),
    autoPiecesPG: roundToTwo((autoConesScored + autoCubesScored) / matchesPlayed),
    teleopPiecesPG: roundToTwo((teleopConesScored + teleopCubesScored) / matchesPlayed),
    cubeCycleProportion: roundToTwo((cubesPickedUp) / (conesPickedUp + cubesPickedUp)),
    autoNoClimb: roundToTwo((autoPoints - autoClimbPoints) / matchesPlayed),
    teleopPPG: roundToTwo((points / matchesPlayed) - ((autoPoints - autoClimbPoints) / matchesPlayed) - ((autoClimbPoints + teleopClimbPoints) / matchesPlayed)),

    // power rating = 4 * wCPG + 3 * accu + 2 * linkPG + 5 * PPG
    // powerRating: 4 * (nWcycles / matchesPlayed) + 3 * (conesScored + cubesScored) / (conesPickedUp + cubesPickedUp) + 2 * (links / matchesPlayed)
    // + 5 * (points / matchesPlayed)
  };

  console.log(teamdata)

  let endTime = Date.now()

  console.log("Aggregate done in " + (endTime - startTime) / 1000 + "s")

  return teamdata.matchesPlayed > 0 ? teamdata : defaultTeam;
}

export async function getAgg(team?:number) {
  const session = getNeoSession();
  let teams = 0;
  let ret: teamAggData[] = []
  try {
    let res;
    const tx = session.beginTransaction();
    if (team){
        res = await tx.run(
        "MATCH (t:TeamAgg{name: $name}) RETURN properties(t)",
        { name: team }
      );
    }
    else{
      res = await tx.run(
        "MATCH (t:TeamAgg) RETURN properties(t)",
      );
      teams = (await getTeams()).length
    }
    if (res.records.length > 0) {
      for (let i = 0; i < teams || i == 0; i++){
        if(res.records[i]){

          const pros = res.records[i].get("properties(t)");
  
          let teamdata: teamAggData = {
            team: pros.team,
            matchesPlayed: pros.matchesPlayed.low,
            autoPPG: pros.autoPPG,
            PPG: pros.PPG,
            cyclesPG: pros.cyclesPG,
            weightedCyclesPG: pros.weightedCyclesPG,
            avgPiecesScored: pros.avgPiecesScored,
            maxPiecesScored: pros.maxPiecesScored,
            scoringAccuracy: pros.scoringAccuracy,
            coneAccuracy: pros.coneAccuracy,
            cubeAccuracy: pros.cubeAccuracy,
            scoringPositions: [
              parseFloat((pros.lowerScored.hasOwnProperty("low")
                ? pros.lowerScored.low
                : pros.lowerScored).toFixed(2)),
              parseFloat((pros.middleScored.hasOwnProperty("low")
                ? pros.middleScored.low
                : pros.middleScored).toFixed(2)),
              parseFloat((pros.upperScored.hasOwnProperty("low")
                ? pros.upperScored.low
                : pros.upperScored).toFixed(2)),
            ],
            autoClimbPPG: pros.autoClimbPPG,
            teleopClimbPPG: pros.teleopClimbPPG,
            climbPPG: pros.climbPPG,
            linkPG: pros.linkPG,
            autoPiecesPG: pros.autoPiecesPG,
            teleopPiecesPG: pros.teleopPiecesPG,
            cubeCycleProportion: pros.cubeCycleProportion,
            autoNoClimb: pros.autoNoClimb,
            teleopPPG: pros.teleopPPG
    
            // power rating = 4 * wCPG + 3 * accu + 2 * linkPG + 5 * PPG
            // powerRating: 4 * (nWcycles / matchesPlayed) + 3 * (conesScored + cubesScored) / (conesPickedUp + cubesPickedUp) + 2 * (links / matchesPlayed)
            // + 5 * (points / matchesPlayed)
        }
        
        for (const key in teamdata) {
          if (key != "scoringPositions" && teamdata[key]){
            teamdata[key] = parseFloat((teamdata[key] as number).toFixed(2))
          }
        }
        if (teams == 0){
          return teamdata;
        }
        else{
          ret.push(teamdata)
        }
      }
      }
      return ret;
    }
  } catch (error) {
    console.error(error);
  }

  return defaultTeam;
}

interface TeamRelativeStatistics {
  autoScoring: number;
  teleopScoring: number;
  scoringAccuracy: number;
  autoClimbPoints: number;
  teleopClimbPoints: number;
  cyclesPerGame: number;
}

function calculatePercentiles({teamsData} : {teamsData: teamAggData[]}) {
  const stats = [
    'autoPPG',
    'PPG',
    'cyclesPG',
    'weightedCyclesPG',
    'scoringAccuracy',
    'coneAccuracy',
    'cubeAccuracy',
    'autoClimbPPG',
    'teleopClimbPPG',
    'climbPPG',
    'linkPG',
    'avgPiecesScored',
    'maxPiecesScored',
    'autoPiecesPG',
    'teleopPiecesPG',
  ];

  stats.forEach(stat => {
    const statArray = teamsData.map(teamData => teamData[stat]);
    statArray.sort((a, b) => Number(a) - Number(b));

    teamsData.forEach(teamData => {
      const teamStatIndex = statArray.indexOf(teamData[stat]);
      const percentile = (teamStatIndex / teamsData.length) * 100;
      teamData[`percentile${stat}`] = percentile;
    });
  });

  return teamsData;
}

/**
 * Calculate the z score for the main aggregate categories for a specified team
 * @param team - the desired team to calculate z scores for
 * @return : {stat1: zscore, stat2...} - object of zscores
 * */

export async function getTeamStandardizedScores(team: number) {
  let teams: Array<number> = await getAllTeamNumbers();

  let autoScoring = [];
  let teleopScoring = [];
  let scoringAccuracy = [];
  let autoClimbPoints = [];
  let teleopClimbPoints = [];
  let cyclesPerGame = [];
  let foundTeam: number = 0;

  for (let index = 0; index < teams.length; index++) {
    let thisTeam: any = await getAgg(teams[index]);

    if (thisTeam.team == team) {
      foundTeam = index;
    }

    autoScoring.push(thisTeam.autoPPG - thisTeam.autoClimbPPG);
    teleopScoring.push(
      thisTeam.PPG - thisTeam.autoPPG - thisTeam.teleopClimbPPG
    );
    scoringAccuracy.push(thisTeam.scoringAccuracy);
    autoClimbPoints.push(thisTeam.autoClimbPPG);
    teleopClimbPoints.push(thisTeam.teleopClimbPPG);
    cyclesPerGame.push(thisTeam.cyclesPG);
  }

  let ret: TeamRelativeStatistics = {
    autoScoring:
      (autoScoring[foundTeam] - arrayAverage(autoScoring)) /
      standardDeviation(autoScoring),
    teleopScoring:
      (teleopScoring[foundTeam] - arrayAverage(teleopScoring)) /
      standardDeviation(teleopScoring),
    scoringAccuracy:
      (scoringAccuracy[foundTeam] - arrayAverage(scoringAccuracy)) /
      standardDeviation(scoringAccuracy),
    autoClimbPoints:
      (autoClimbPoints[foundTeam] - arrayAverage(autoClimbPoints)) /
      standardDeviation(autoClimbPoints),
    teleopClimbPoints:
      (teleopClimbPoints[foundTeam] - arrayAverage(teleopClimbPoints)) /
      standardDeviation(teleopClimbPoints),
    cyclesPerGame:
      (cyclesPerGame[foundTeam] - arrayAverage(cyclesPerGame)) /
      standardDeviation(cyclesPerGame),
  };
  return ret;
}


//takes the team and match numbers as paramters, returns object  in the following format
/*
    team: team,
    match: match,
    mobility: mobility,
    park: park,
    teleopClimb: teleopClimb,
    autoClimb: autoClimb,
    numPartners: numPartners,
    allies: allies,
    enemies: enemies,
    cycles: cycles,
    cubesPickedUp: cubesPickedUp,
    conesPickedUp: conesPickedUp,
    cubesScored: cubes scored,
    conesScored: cones scored,
    autoPoints: points scored in auto,
    points: points scored in total,
    piecesScored: pieces scored in total,
    scoringAccuracy: scoring accuracy
    */

export async function getMatch(team: number, match: String) {
  const session = getNeoSession();

  let matchNodes: any;
  let nCycles: number;
  let teleopClimb: number = 0;
  let autoClimb: number = 0;
  let numPartners: number = 0;
  let cycles = new Array();
  let allies: number[] = new Array(2);
  let enemies: number[] = new Array(3);
  let park: boolean = false;
  let autoPoints: number = 0;
  let points: number = 0;
  let piecesScored = 0;
  let cubesPickedUp = 0;
  let conesPickedUp = 0;

  let autoCycles = 0
  let autoScored = 0
  let autoTop = 0
  let autoMiddle = 0
  let autoBottom = 0

  let teleopCycles = 0
  let teleopScored = 0
  let teleopTop = 0
  let teleopMiddle = 0
  let teleopBottom = 0
  let mobility = 0

  try {
    const tx = session.beginTransaction();

    nCycles = await getNumberCycles(team, match, tx);
    cycles = new Array(nCycles);

    // matches to a team
    matchNodes = await getMatchNodes(team, match, tx);

    for (let index = 0; index < matchNodes.records.length; index++) {
      switch (matchNodes.records[index]._fields[0].labels[0]) {
        case "Cycle":
          cycles.push(matchNodes.records[index]._fields[0].properties);
          break;
        case "AutoClimb":
          if (matchNodes.records[index]._fields[1].type == "DOCKED") {
            autoClimb = 1;
            autoPoints += 8;
          } else {
            autoClimb = 2;
            autoPoints += 12;
          }
          break;
        case "TeleopClimb":
          numPartners =
            matchNodes.records[index]._fields[1].properties.numPartners.low;
          if (matchNodes.records[index]._fields[1].type == "DOCKED") {
            teleopClimb = 1;
            points += 6;
          } else {
            teleopClimb = 2;
            points += 10;
          }
          break;

        case "Team":
          if (matchNodes.records[index]._fields[1].type == "ALLY") {
            allies.push(
              matchNodes.records[index]._fields[0].properties.name.low
            );
          } else {
            enemies.push(
              matchNodes.records[index]._fields[0].properties.name.low
            );
          }
          break;
        case "Mobility":
          mobility = 1;
          autoPoints += 3;
          break;
        case "Park":
          park = true;
          points += 2;
          break;
        default:
          break;
      }
    }

    cycles = cycles.filter(el => el)

    cycles.map(cycle => {
      if(cycle.teleop){
        teleopCycles += 1
      }
      else{
        autoCycles += 1
      }
    })

    cubesPickedUp = await getPiecesPickedUp(team, match, "cube", tx);
    conesPickedUp = await getPiecesPickedUp(team, match, "cone", tx);

    autoTop = await getTeamScoreLocationByMatch(team, 3, match, false, tx);
    autoMiddle = await getTeamScoreLocationByMatch(team, 2, match, false, tx)
    autoBottom = await getTeamScoreLocationByMatch(team, 1, match, false, tx)

    autoScored += autoTop + autoMiddle + autoBottom
    autoPoints += 3 * autoBottom + 4* autoMiddle + 6 * autoTop

    teleopTop = await getTeamScoreLocationByMatch(team, 3, match, true, tx)
    teleopMiddle = await getTeamScoreLocationByMatch(team, 2, match, true, tx)
    teleopBottom = await getTeamScoreLocationByMatch(team, 1, match, true, tx)

    teleopScored = teleopTop + teleopMiddle + teleopBottom

    points += autoPoints;
    points += 2 * teleopBottom + 3 * teleopMiddle + 5 * teleopTop

    points += 5 * (await getnumberOfLinksMatch(team, match, tx));

    const result = await tx.run(
      "MATCH (t:Team {name: $name})-[{match: toString($match)}]-(c:Cycle)-[]->(s:ScoringPosition) RETURN count(*)",
      { name: team, match: match }
    );
    piecesScored = result.records[0].get(0).low;
  } catch (error) {
    console.error(error);
  }

  let matchData: Object = {
    team,
    match,
    mobility,
    park,
    teleopClimb,
    autoClimb,
    numPartners,
    allies: allies.filter(el => el),
    enemies: enemies.filter(el => el),
    cycles,
    cubesPickedUp,
    conesPickedUp,
    autoPoints,
    points,
    piecesScored,
    scoringAccuracy: piecesScored / (cubesPickedUp + conesPickedUp),
    autoCycles,
    autoTop,
    autoScored,
    autoMiddle: autoMiddle,
    autoBottom: autoBottom,
    teleopCycles,
    teleopScored,
    teleopTop,
    teleopMiddle,
    teleopBottom
  };
  // console.log(matchData)
  return matchData;
}

export async function getCompTeams(teams: number[]) {
  const teamPromises = teams.map((team) => getAgg(team));
  const teamData = await Promise.all(teamPromises);
  return teamData;
}

//a useless function used for testing
//takes the team number as paramete, returns number of cubes scored
export async function getAmountCube({ team }: { team: number }) {
  const session = getNeoSession();
  const tx = session.beginTransaction();
  try {
    const tx = session.beginTransaction();
    const result = await tx.run(
      "MATCH (t:Team {name: $name})-[:CUBE]->(c:Cycle) RETURN count(*)",
      { name: team }
    );

    await tx.commit();
  } catch (error) {
    console.error(error);
  }
}

// returns how many games a certain team played
export async function getMatchList(team: number) {
  const session = getNeoSession();
  const tx = session.beginTransaction();
  try {
    const result = await tx.run(
      "MATCH (t:Team {name: $name})-[r]->(n) RETURN DISTINCT r.match",
      { name: team }
    );
    let ret: Array<string> = result.records.map(
      (record: any) => record._fields[0]
    );
    await tx.commit();
    return ret;
  } catch (error) {
    console.error(error);
  }
}

export async function getAllTeamNumbers() {
  const session = getNeoSession();
  let tempResult: any;
  let toReturn = [];

  try {
    const tx = session.beginTransaction();
    const result = await tx.run("MATCH (t:Team) return distinct *");
    tempResult = result;
    for (let index = 0; index < result.records.length; index++) {
      toReturn.push(tempResult.records[index]._fields[0].properties.name.low);
    }

    await tx.commit();
  } catch (error) {
    console.error(error);
  }
  return toReturn;
}

export async function setTeamAgg({
  team_agg_data,
}: {
  team_agg_data: teamAggData;
}) {
  const session = getNeoSession();
  try {
    const tx = session.beginTransaction();
    let qs =
      "MERGE (ta:TeamAgg{name:toInteger(" +
      team_agg_data["team"] +
      ")})\nWITH ta\nMATCH (t:Team{name: toInteger(" +
      team_agg_data["team"] +
      ")})\n";
    Object.keys(team_agg_data).forEach(function (key: string) {
      if (key == "matchesPlayed") {
        qs += "SET ta.matchesPlayed = toInteger(" + team_agg_data[key] + ")\n";
      } else if (key == "scoringPositions") {
        qs +=
          "SET ta.lowerScored = toFloat(" +
          team_agg_data["scoringPositions"][0] +
          ")\n";
        qs +=
          "SET ta.middleScored = toFloat(" +
          team_agg_data["scoringPositions"][1] +
          ")\n";
        qs +=
          "SET ta.upperScored = toFloat(" +
          team_agg_data["scoringPositions"][2] +
          ")\n";
      } else {
        qs +=
          "SET ta." + key + " = toFloat(" + (team_agg_data as any)[key] + ")\n";
      }
    });

    await tx.run(qs);
    await tx.commit();
    await session.close();
  } catch (error) {
    console.log(error);
  }
}

export async function getAllTeamData() {

  // const teamlist = await getAllTeamNumbers();

  // DUMMY!!
  // const teamlist = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

  
  let ret:teamAggData[] = await getAgg() as teamAggData[];
  console.log(ret)

  // for (let i = 0; i < teamlist.length; i++) {
  //   let temp = await getAgg({ team: teamlist[i] });
  //   if (temp.matchesPlayed > 0) {
  //     ret.push(temp);
  //   }
  //   console.log("data: " + (i + 1) + "/" + teamlist.length)
  // }

  return ret;
}

//max cycles,max gamepieces scored,max cones scored,max cubes scored, max level 3
export async function getMax(team:number) {
  let cycles:number=0
  let piecesScored:number = 0
  let conesScored:number = 0
  let cubesSocred:number = 0
  let level3:number = 0
  let match:String[] = await getMatchList(team)

  for (let i = 0; i < match.length; i++) {
    let currentMatch:any = getMatch(team, match[i])
  
    if(currentMatch.cycles > cycles) {
      cycles = currentMatch.cycles 
    }
    if(currentMatch.piecesScored > piecesScored) {
      piecesScored = currentMatch.piecesScored
    }
    if(currentMatch.conesScored > conesScored) {
      conesScored = currentMatch.conesScored
    }
    if(currentMatch.cubesScored > cubesSocred) {
      cubesSocred = currentMatch.cubesScored
    }
    if((currentMatch.autoTop + currentMatch.teleopTop) > level3) {
      level3 = (currentMatch.autoTop + currentMatch.teleopTop) 
    }
  }
  let ret =  {
    cycles,
    piecesScored,
    conesScored,
    cubesSocred,
    level3
  }
  console.log(ret)
  return ret
}
