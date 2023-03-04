// return a grid-row-column triplet for where the scoring position is
// grid 1, bottom row, right -> (1, 1, 3)
// 18 19  20 | 21  22  23 | 24  25  26
// 9  10  11 | 12  13  14 | 15  16  17
// 0  1   2  |  3   4   5 |  6   7   8
export function pegPosition(id: number){
    let r = id / 9
    let c = id % 9 + 1
    let g = (c % 9) / 3
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

   return r * 9 + g * 3 + (c - 1);
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