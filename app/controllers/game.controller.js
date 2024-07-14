const GameService = require('../services/game.service');
const ApiError = require('../api-error');

module.exports.generate = async (req, res, next) => {
    // if (!req.body?.size) {
    //     return next(new ApiError(400, "Size cannot be empty"))
    // }
    const size = 6;

    try {
        const gameService = new GameService();
        const result = await gameService.generate(size);
        res.send(result);
    } 
    catch (err) {
        return next (
            new ApiError(500, "An error occurred while generating the kenken board")
        )
    }
}

module.exports.result = async (req, res, next) => {
    // if (!req.body?.data) {
    //     return next(new ApiError(400, "Data cannot be empty"))
    // }

    const data = {
        N: 4,
        matrix: [
            ['A', 'B', 'C', 'C'],
            ['A', 'D', 'E', 'C'],
            ['F', 'D', 'E', 'G'],
            ['H', 'H', 'G', 'G']
        ],
        constraint: {
            A: {
                val: 2,
                op: '/'
            },
            B: {
                val: 3,
                op: '+'
            },
            C: {
                val: 4,
                op: '*'
            },
            D: {
                val: 2,
                op: '/'
            },
            E: {
                val: 7,
                op: '+'
            },
            F: {
                val: 3,
                op: '+'
            },
            G: {
                val: 7,
                op: '+'
            },
            H: {
                val: 3,
                op: '-'
            },
        }
    }
    
    const data1 = {
        N: 6,
        matrix: [
            ['A', 'B', 'B', 'C', 'D', 'D'],
            ['A', 'E', 'E', 'C', 'F', 'D'],
            ['G', 'G', 'H', 'H', 'F', 'D'],
            ['G', 'G', 'I', 'J', 'K', 'K'],
            ['L', 'L', 'I', 'J', 'J', 'M'],
            ['N', 'N', 'N', 'O', 'O', 'M']
        ],
        constraint: {
            A: {
                val: 11,
                op: '+'
            },
            B: {
                val: 2,
                op: '/'
            },
            C: {
                val: 20,
                op: '*'
            },
            D: {
                val: 6,
                op: '*'
            },
            E: {
                val: 3,
                op: '-'
            },
            F: {
                val: 3,
                op: '/'
            },
            G: {
                val: 240,
                op: '*'
            },
            H: {
                val: 6,
                op: '*'
            },
            I: {
                val: 6,
                op: '*'
            },
            J: {
                val: 7,
                op: '+'
            },
            K: {
                val: 30,
                op: '*'
            },
            L: {
                val: 6,
                op: '*'
            },
            M: {
                val: 9,
                op: '+'
            },
            N: {
                val: 8,
                op: '+'
            },
            O: {
                val: 2,
                op: '/'
            },
        }
    }

    try {
        const gameService = new GameService();
        const result = await gameService.solve(data1);
        res.send(result);
    } 
    catch (err) {
        return next (
            new ApiError(500, "An error occurred while solving the kenken")
        )
    }
}