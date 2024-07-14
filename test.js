function getRandomSample(array, count) {
    let shuffled = array.slice(0),
        i = array.length,
        min = i - count,
        temp, index;

    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}

function generateSudoku() {
    let base = 2;
    let side = base * base;
    let nums = Array.from({ length: side }, (_, i) => i + 1); // number allowed (1 -> 9)
    let board = Array.from({ length: side }, () => Array(side).fill(null)); // initial null board


    function pattern(r, c) {
        return (base * (r % base) + Math.floor(r / base) + c) % side;
    }

    let rBase = Array.from({ length: base }, (_, i) => i);  // [0, 1, 2]
    // console.log('rBase:', rBase)

    let rows = [];
    let cols = [];
    for (let g of getRandomSample(rBase, base)) {
        for (let r of getRandomSample(rBase, base)) {
            rows.push(g * base + r);
        }
        for (let c of getRandomSample(rBase, base)) {
            cols.push(g * base + c);
        }
    }
    nums = getRandomSample(nums, nums.length);

    // produce board using randomized baseline pattern
    for (let r of rows) {
        for (let c of cols) {
            board[r][c] = nums[pattern(r, c)];
        }
    }

    let squares = side * side;
    let empties = 0; // 3/4 => 25% of 81 appro 21    13/20
    for (let p of getRandomSample(Array.from({ length: squares }, (_, i) => i), empties)) {
        board[Math.floor(p / side)][p % side] = 0;
    }

    return board;
}

console.log(generateSudoku())