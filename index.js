require('./src/db/mongoose')
require("dotenv").config()
const express = require('express')
const app = express()
const { errorHandler } = require("./src/middleware/errorHandler")

app.use(express.json())

const users = require('./routes/user')
const consultations = require('./routes/consultation')
const replies = require('./routes/reply')
const rate = require('./routes/ratting')

app.get("/", (req, res) => {
    res.send("<h1>Shorny Application</h1>")
})

app.use('/users', users)
app.use('/consultations', consultations)
app.use('/replies', replies)
app.use('/rate', rate)
app.use(errorHandler)


port = process.env.PORT || 3000

try {
    app.listen(port, () => {
        console.log(`running on port ${port}`)
    })
} catch (error) {
    console.log(error.message);
}

