// return a grid-row-column triplet for where the scoring position is
// grid 1, bottom row, right -> (1, 1, 3)
// 18 19  20 | 21  22  23 | 24  25  26
// 9  10  11 | 12  13  14 | 15  16  17
// 0  1   2  |  3   4   5 |  6   7   8
export async function pegPosition(id: number){
    var r = id / 9 + 1
    var c = id % 9 + 1
    var g = c / 3 + 1
    return new Array(g, r, c)
}

// returns an encoded value between 0 and 26 for where the scoring position is
// 18 19  20 | 21  22  23 | 24  25  26
// 9  10  11 | 12  13  14 | 15  16  17
// 0  1   2  |  3   4   5 |  6   7   8
export async function revPegPosition(pos: Array<number>){
   var g = pos[0]
   var r = pos[1]
   var c = pos[2]

   return (r - 1) * 9 + (c - 1);
}