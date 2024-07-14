const app = require('./app')

const startServer = () => {
    try {
        const port = process.env.PORT
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
    }
    catch(err) {
        console.log('Something wrong while starting the server', err)
        process.exit()
    }
}

startServer()