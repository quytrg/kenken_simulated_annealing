const express = require('express')
const gameController = require('../controllers/game.controller')

const router = express.Router()

router.route('/generate')
    .post(gameController.generate)

router.route('/result')
    .post(gameController.result)


module.exports = router