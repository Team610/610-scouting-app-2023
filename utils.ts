import neo4j from 'neo4j-driver'

const uri:string = process.env.NEXT_PUBLIC_DATABASE_URI!
const driver = neo4j.driver(uri, neo4j.auth.basic(process.env.NEXT_PUBLIC_DATABASE_NAME!, process.env.NEXT_PUBLIC_DATABASE_PASSWORD!))

export function getNeoSession(){
    let session = driver.session({ database: "neo4j" })
    return session
}

export interface cycleData {
    substation: string,
    teleop: boolean,
    level: number,
    link: boolean,
    object: string
}

export interface matchData {
    team: number,
    match: String,
    autoClimb: number,
    teleopClimb: number,
    numPartners: number,
    park: boolean,
    mobility: boolean,
    cycles: Array<cycleData>,
    enemies: Array<number>,
    allies: Array<number>
}

export type teamAggData = {
    team: number,
    matchesPlayed: number,
    autoPPG: number,
    PPG: number,
    cyclesPG: number,
    weightedCyclesPG: number,
    scoringAccuracy: number,
    coneAccuracy: number,
    cubeAccuracy: number,
    scoringPositions: Array<number>,
    autoClimbPPG: number,
    teleopClimbPPG: number,
    climbPPG: number,
    linkPG: number,
    avgPiecesScored: number,
    maxPiecesScored: number,
    autoPiecesPG: number,
    teleopPiecesPG: number,
}

export interface teamAggDataWeight {
    autoPPG_weight: number,
    PPG_weight: number,
    cyclesPG_weight: number,
    weightedCyclesPG_weight: number,
    scoringAccuracy_weight: number,
    coneAccuracy_weight: number,
    cubeAccuracy_weight: number,
    lowerScoredPG_weight:number,
    middleScoredPG_weight: number,
    upperScoredPG_weight: number,
    autoClimbPPG_weight: number,
    teleopClimbPPG_weight: number,
    climbPPG_weight: number,
    linkPG_weight: number,
    avgPiecesScored_weight: number,
    maxPiecesScored_weight: number,
    autoPiecesPG_weight: number,
    teleopPiecesPG_weight: number,
}

export const defaultWeight : teamAggDataWeight = {
    autoPPG_weight: 1,
    PPG_weight: 0,
    cyclesPG_weight: 0,
    weightedCyclesPG_weight: 2,
    scoringAccuracy_weight: 1,
    coneAccuracy_weight: 0,
    cubeAccuracy_weight: 0,
    lowerScoredPG_weight:0,
    middleScoredPG_weight: 0,
    upperScoredPG_weight: 0,
    autoClimbPPG_weight: 1,
    teleopClimbPPG_weight: 1,
    climbPPG_weight: 0,
    linkPG_weight: 2,
    avgPiecesScored_weight: 0,
    maxPiecesScored_weight: 2,
    autoPiecesPG_weight: 2,
    teleopPiecesPG_weight: 1,
}

export const defaultTeam : teamAggData ={
    team: 0,
    matchesPlayed: 0,
    autoPPG: 0, 
    PPG: 0,
    cyclesPG: 0,
    weightedCyclesPG: 0,
    scoringAccuracy: 0,
    coneAccuracy: 0,
    cubeAccuracy: 0,
    scoringPositions: [0, 0, 0],
    autoClimbPPG: 0,
    teleopClimbPPG: 0,
    climbPPG: 0,
    linkPG: 0,
    avgPiecesScored: 0,
    maxPiecesScored: 0,
    autoPiecesPG: 0,
    teleopPiecesPG: 0
    // powerRating: 0
}



export const defaultMatch : matchData ={
    team: 9999,
    match: "X01",
    autoClimb: 0,
    teleopClimb: 0, 
    numPartners: 0,
    park: false,
    mobility: false,
    cycles: [],
    enemies: [9997, 9998],
    allies: [9994, 9995, 9996]
}

// return a grid-row-column triplet for where the scoring position is
// grid 1, bottom row, right -> (1, 1, 3)
// 18 19  20 | 21  22  23 | 24  25  26
// 9  10  11 | 12  13  14 | 15  16  17
// 0  1   2  |  3   4   5 |  6   7   8
export function pegPosition(id: number){
    let r = id / 9 + 1
    let c = id % 9 + 1
    let g = c / 3 + 1
    return new Array(g, r, c)
}

// returns an encoded value between 0 and 26 for where the scoring position is
// 18 19  20 | 21  22  23 | 24  25  26
// 9  10  11 | 12  13  14 | 15  16  17
// 0  1   2  |  3   4   5 |  6   7   8
export function revPegPosition(grid: number, row: number, column: number){
   let g = grid
   let r = row
   let c = column

   return (r - 1) * 9 + (c - 1);
}
export function standardDeviation(arr:Array<number>){
    let mean = arr.reduce((acc, curr)=>{
	return acc + curr
}, 0) / arr.length;


arr = arr.map((el)=>{
	return (el - mean) ** 2
})

let total = arr.reduce((acc, curr)=> acc + curr, 0);

return Math.sqrt(total / arr.length)
}
export function arrayAverage(arr:Array<number>){
    //Find the sum
    let sum = 0;
    for(let i in arr) {
        sum += arr[i];
    }
    //Get the length of the array
    let numbersCnt = arr.length;
    //Return the average / mean.
    return (sum / numbersCnt);
}
