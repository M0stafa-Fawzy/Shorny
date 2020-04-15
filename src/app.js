const express = require('express')
const app = express() 
app.use(express.json())

const adm = require('../routes/adminRoute')
app.use(adm)

const cli = require('../routes/clientRoute')
app.use(cli)

const law = require('../routes/lawyerRoute')
app.use(law)

const con = require('../routes/conRoute')
app.use(con)

const rep = require('../routes/replyRoute')
app.use(rep)

const rate = require('../routes/rateRoute')
app.use(rate)

module.exports = app