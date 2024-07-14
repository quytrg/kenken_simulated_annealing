const express = require('express')
const cors = require('cors')
require('dotenv').config()
const ApiError = require('./app/api-error')
const systemConfig = require('./app/config/system/index')
const kenkenRouter = require('./app/routes/index')

const app = express()

app.use(cors())
app.use(express.json())

// local variables within the application
app.locals.apiPrefix = systemConfig.apiPrefix

// Router
kenkenRouter(app)

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to kenken game!'})
})

app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found!"))
})

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error"
    })
})

module.exports = app