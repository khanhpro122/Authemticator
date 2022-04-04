const userRoute = require('./user')

function route(app) {
    // app.use('/', (req, res) => {
    //     res.send('Hello World!')
    // })
    app.use('/auth', userRoute)
}

module.exports = route