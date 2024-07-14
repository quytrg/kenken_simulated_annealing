function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function pattern(row, col, size) {
    return (row + col) % size;
}

function generate_board(size) {
    let board = Array.from({ length: size }, () => Array(size).fill(null)); // initial null board
    const nums = Array.from({ length: size }, (_, index) => index + 1);
    // shuffle array nums 1 - size
    shuffle(shuffle(shuffle(nums)));
    // array store row, col position
    const rows = Array.from({ length: size }, (_, index) => index);
    shuffle(shuffle(shuffle(rows)));
    const cols = [...rows];
    shuffle(shuffle(shuffle(cols)));

    // produce board using randomized baseline pattern
    for (let r of rows) {
        for (let c of cols) {
            board[r][c] = nums[pattern(r, c, size)];
        }
    }

    return board
}

function calc_val_of_bloc(cell_list, op) {
    let block_val;
    if (op === '+') {
        block_val = 0;
    } else if (op === '-') {
        block_val = 0.5;
    } else if (op === '*') {
        block_val = 1;
    } else if (op === '/') {
        block_val = -1;
    } else {
        block_val = 0;
    }

    cell_list.forEach(val => {
        if (op === '+') {
            block_val += val;
        } else if (op === '-') {
            if (block_val === 0.5) {
                block_val = val;
            } else {
                block_val -= val;
            }
        } else if (op === '*') {
            block_val *= val;
        } else if (op === '/') {
            if (block_val === -1) {
                block_val = val;
            } else {
                block_val /= val;
            }
        }
    });

    if (block_val <= 0) {
        block_val = Math.abs(block_val);
    } else if (block_val < 1) {
        block_val = 1 / block_val;
    }

    // return parseInt(block_val);
    return block_val;
}

function generate_block(board, size) {
    let data = {
        N: size,
        matrix: [[]],
        constraint: {}
    }

    let block_id = 'A';
    const operators = ['+', '-', '*', '/'];
    let mark_board = Array.from({ length: size }, () => Array(size).fill(null));
    const offset_r = [-1, 1, 0, 0];
    const offset_c = [0, 0, -1, 1];

    for (let r = 0; r < size; r++) { 
        for (let c = 0; c < size; c++) {
            if (mark_board[r][c] === null) {
                mark_board[r][c] = block_id;

                let block_constraint = {};
                const block_op = operators[Math.floor(Math.random() * 4)];
                block_constraint.op = block_op;
                
                let stuck = 0;
                let num_cell_of_block = Math.floor(Math.random() * 4) + 1;
                // Case of consecutive division of multiple numbers without a determined processing method
                if (block_op === '/') {
                    num_cell_of_block = 1;
                }
                const cell_list = [board[r][c]];
                while (num_cell_of_block !== 0 && stuck < 10) {
                    // move method: up: 0, down: 1, left: 2, right: 3
                    const move_method = Math.floor(Math.random() * 4);
                    tmp_r = r + offset_r[move_method];
                    tmp_c = c + offset_c[move_method];
                    if (tmp_r >= 0 && tmp_r < size && tmp_c >= 0 && tmp_c < size && mark_board[tmp_r][tmp_c] === null) {
                        cell_list.push(board[tmp_r][tmp_c]);
                        mark_board[tmp_r][tmp_c] = block_id;
                        num_cell_of_block--;
                    }
                    stuck++;
                }

                // Change to a different operator if the division produces a decimal number.
                if (block_op === '/') {
                    let quotient = cell_list[0] / cell_list[1];
                    if (quotient < 1) {
                        quotient = 1 / quotient;
                    }
                    if (!Number.isInteger(quotient)) {
                        block_constraint.op = operators[Math.floor(Math.random() * 3)];
                    }
                }

                // Change the operator to '+' if there is only one element in 'cell_list'
                if (cell_list.length === 1) {
                    block_constraint.op = '+';
                }

                block_constraint.val = calc_val_of_bloc(cell_list, block_constraint.op);
                data.constraint[block_id] = block_constraint;
                const ascii_value = block_id.charCodeAt(0);
                block_id = String.fromCharCode(ascii_value + 1);
            }
            
        }
        
    }

    data.matrix = mark_board;
    return data;
}

function generateInitialState(size) {
    const board = generate_board(size);
    console.log(board);
    const data = generate_block(board, size);
    console.log(data);
    return data;
}

module.exports = generateInitialState;