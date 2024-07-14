const solveGame = require('../helpers/solveGame');
const generateInitialState = require('../helpers/generateInitialState')

class GameService {
    // constructor() {
    // }

    async generate(size) {
        const result = await generateInitialState(size);
        return result
    }

    async solve(data) {
        const result = await solveGame(data);
        return result;
    }
}

module.exports = GameService;