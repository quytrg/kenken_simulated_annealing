const math = require('mathjs');

class Cell {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.val = 0;
        this.bid = "";
    }
}

class Block {
    constructor(id, n, op) {
        this.id = id;
        this.n = n;
        this.op = op;
        this.cells = new Set();
    }
}

function print_cells() {
    for (let key in cells) {
        const v = cells[key];
        console.log(`---------- CELL ${key} ----------`);
        console.log(`(${v.row}, ${v.col}) -> val: ${v.val}`);
    }
}

function print_blocks() {
    for (let key in blocks) {
        const v = blocks[key];
        console.log(`---------- BLOCK ${key} ----------`);
        console.log(`n: ${v.n} op: ${v.op}`);
        let cells_str = "";
        for (let c of v.cells) {
            cells_str += `(${c.row},${c.col}) ${c.val} `;
        }
        console.log(cells_str);
    }
}

function print_state(cells) {
    let counter = 0;
    let line = "| ";

    console.log("----------- STATE -----------");
    for (let key in cells) {
        const cell = cells[key];
        line += `${cell.val} | `;
        counter++;
        if (counter === N) {
            console.log(line);
            counter = 0;
            line = "| ";
        }
    }
    console.log("-----------------------------");
}

function initialize_state(N, cells) {
    for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
            const randomIndex = Math.floor(Math.random() * all_value.length);
            const random_value = all_value[randomIndex];
            all_value.splice(randomIndex, 1);
            cells[`${r}${c}`].val = random_value;
        }
    }
}

function num_violation_at_position_swap(r1, c1, r2, c2) {
    let count = 0;
    count += check_duplicate_row(r1) + check_duplicate_col(c1);
    count += check_duplicate_row(r2) + check_duplicate_col(c2);
    count += check_invalid_block(blocks[cells[`${r1}${c1}`].bid]);
    count += check_invalid_block(blocks[cells[`${r2}${c2}`].bid]);
    return count;
}

function proposed_state() {
    let r1 = Math.floor(Math.random() * N);
    let c1 = Math.floor(Math.random() * N);
    const first_cell = cells[`${r1}${c1}`];
    let r2 = Math.floor(Math.random() * N);
    let c2 = Math.floor(Math.random() * N);

    while (r2 === r1 && c2 === c1) {
        r2 = Math.floor(Math.random() * N);
        c2 = Math.floor(Math.random() * N);
    }

    const second_cell = cells[`${r2}${c2}`];
    const before_swap = num_violation_at_position_swap(r1, c1, r2, c2);

    let temp = first_cell.val;
    first_cell.val = second_cell.val;
    second_cell.val = temp;

    const after_swap = num_violation_at_position_swap(r1, c1, r2, c2);
    const delta_cost = after_swap - before_swap;

    return [[r1, c1], [r2, c2], delta_cost];
}

function back_state(r1, c1, r2, c2) {
    const first_cell = cells[`${r1}${c1}`];
    const second_cell = cells[`${r2}${c2}`];
    let temp = first_cell.val;
    first_cell.val = second_cell.val;
    second_cell.val = temp;
}

function initial_sigma() {
    const list_violation_states = [];
    for (let i = 1; i < 10; i++) {
        const swap_position = proposed_state();
        const r1 = swap_position[0][0];
        const c1 = swap_position[0][1];
        const r2 = swap_position[1][0];
        const c2 = swap_position[1][1];
        list_violation_states.push(num_violations());
        back_state(r1, c1, r2, c2);
    }
    return math.std(list_violation_states);
}

function check_block(block) {
    let block_val;
    if (block.op === '+') {
        block_val = 0;
    } else if (block.op === '-') {
        block_val = 0.5;
    } else if (block.op === '*') {
        block_val = 1;
    } else if (block.op === '/') {
        block_val = -1;
    } else {
        block_val = 0;
    }

    for (let c of block.cells) {
        if (block.op === '+') {
            block_val += c.val;
        } else if (block.op === '-') {
            if (block_val === 0.5) {
                block_val = c.val;
            } else {
                block_val -= c.val;
            }
        } else if (block.op === '*') {
            block_val *= c.val;
        } else if (block.op === '/') {
            if (block_val === -1) {
                block_val = c.val;
            } else {
                block_val /= c.val;
            }
        }
    }

    if (block_val <= 0) {
        block_val = Math.abs(block_val);
    } else if (block_val < 1) {
        block_val = 1 / block_val;
    }

    return block_val;
}

function check_invalid_block(block) {
    const block_val = check_block(block);
    if (block_val !== parseInt(block.n)) {
        return block.cells.size;
        // return 1;
    }
    return 0;
}

function check_duplicate_row(row) {
    const unique_row_value = new Set();
    for (let c = 0; c < N; c++) {
        unique_row_value.add(cells[`${row}${c}`].val);
    }
    return N - unique_row_value.size;
}

function check_duplicate_col(col) {
    const unique_col_value = new Set();
    for (let r = 0; r < N; r++) {
        unique_col_value.add(cells[`${r}${col}`].val);
    }
    return N - unique_col_value.size;
}

function num_violations() {
    let count = 0;

    for (let i = 0; i < N; i++) {
        count += check_duplicate_row(i);
        count += check_duplicate_col(i);
    }

    for (let block_id in blocks) {
        count += check_invalid_block(blocks[block_id]);
    }

    // console.log(count);
    return count;
}

// ---------- MAIN LOGIC STARTS HERE ----------
let N = 0
let matrix = [[]]
let constraint = {}

let all_value = [];

let blocks = {};

let cells = {};

function parse_data(data) {
    N = data.N;
    matrix = data.matrix;
    constraint = data.constraint;
    all_value = [...Array(N).keys()].map(value => Array(N).fill(value + 1)).flat();

    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            const bid = matrix[i][j];
    
            const curr_cell = new Cell(i, j);
            cells[`${i}${j}`] = curr_cell;
            curr_cell.bid = bid;
            if (!blocks[bid]) {
                const curr_block = new Block(bid, 0, '');
                // Add cell to block
                curr_block.cells.add(curr_cell);
                // Add block to blocks dict
                blocks[bid] = curr_block;
            } else {
                blocks[bid].cells.add(curr_cell);
            }
        }
    }
    
    Object.entries(constraint).forEach(([key, value]) => {
        const bid = key;
        blocks[bid].n = value.val;
        blocks[bid].op = value.op;
    });
}

function new_state(sigma) {
    const swap_position = proposed_state();
    const r1 = swap_position[0][0];
    const c1 = swap_position[0][1];
    const r2 = swap_position[1][0];
    const c2 = swap_position[1][1];
    const delta_cost = swap_position[2];

    if (delta_cost < 0) {
        return delta_cost;
    } else {
        const prob_move = Math.exp(-delta_cost / sigma);
        if (prob_move > Math.random()) {
            return delta_cost;
        } else {
            back_state(r1, c1, r2, c2);
            return 0;
        }
    }
}

function simulated_annealing() {
    let found_solution = false;
    while (!found_solution) {
        const decrease_factor = 0.99;
        let stuck = 0;
        initialize_state(N, cells);
        print_blocks();
        let sigma = initial_sigma();
        const origin_sigma = sigma;
        console.log('sigma: ', sigma);
        let score = num_violations();
        console.log('initial score: ', score);
        print_state(cells);
        if (score <= 0) {
            found_solution = true;
        }

        while (!found_solution) {
            const previousScore = score;
            for (let i = 0; i < N * N; i++) {
                const delta_cost = new_state(sigma);
                score += delta_cost;
                console.log('score------------------------: ', score);
                print_state(cells);
                if (score <= 0) {
                    found_solution = true;
                    break;
                }
            }

            sigma *= decrease_factor;
            if (score <= 0) {
                found_solution = true;
                break;
            }
            if (score >= previousScore) {
                stuck += 1;
            } else {
                stuck = 0;
            }
            if (stuck > 80) {
                sigma += origin_sigma;
            }
            if (num_violations() === 0) {
                print_state(cells);
                found_solution = true;
                break;
            }
        }
    }
}

function convert_result_to_array() {
    let result_array = new Array(N);

    for (let i = 0; i < N; i++) {
        result_array[i] = new Array(N).fill(0);
    }

    for (const key in cells) {
        const cell = cells[key];
        result_array[cell.row][cell.col] = cell.val;
    }

    return result_array;
}

function clear_data() {
    N = 0
    matrix = [[]]
    constraint = {}

    all_value = [];

    blocks = {};

    cells = {};
}

function solveGame(data) {
    parse_data(data)
    simulated_annealing();
    const result = convert_result_to_array();

    clear_data();

    return result;
}

module.exports = solveGame;