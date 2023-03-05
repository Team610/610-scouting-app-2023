import neo4j from 'neo4j-driver'

const uri:string = process.env.NEXT_PUBLIC_DATABASE_URI!
const driver = neo4j.driver(uri, neo4j.auth.basic(process.env.NEXT_PUBLIC_DATABASE_NAME!, process.env.NEXT_PUBLIC_DATABASE_PASSWORD!))

export function getNeoSession(){
    let session = driver.session({ database: "neo4j" })
    return session
}

export interface cycleData {
    x: number,
    y: number,
    teleop: boolean,
    scoringPosition: number,
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

export interface teamAggData {
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
    maxPiecesScored: number
    // powerRating: number
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
    maxPiecesScored: 0
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
