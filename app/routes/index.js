const gameRouter = require('./game.route')

module.exports = (app) => {
    const PATH_PREFIX = '/' + app.locals.apiPrefix;
    app.use(PATH_PREFIX + '/game', gameRouter);

}