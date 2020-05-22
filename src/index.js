const express = require('express')
const path = require('path')
const app = express() 

app.use(express.json())
app.use(express.static(path.join(__dirname , '../notify/public')))

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

port = process.env.PORT

const io = require('socket.io').listen(app.listen(port , () => {
    console.log('running on port ' + port)
}))

app.io = io

let x = 500982

io.on('connection' , (socket) => {
    console.log('new connection')

    io.emit('users' , x)
})

// app.listen( port, () => {
//     console.log("running on port " + port )
// })

//const express = require('express')
// const path = require('path')
// //const hbs = require('hbs')
// const app = express() 
// const htmlPath = path.join(__dirname , '../views')
// app.use(express.static(htmlPath))
// app.set('view engine','hbs')
// app.set('views' , htmlPath)

// app.get('' , (req , res) => {
//     res.render('tea')    
// })

// const clients = require('../models/client')

// find the client by a con he created
// const any = async () => {

//     const con = await cons.findById('5e4c7fc24c43a408dca39a52')
//     await con.populate('client').execPopulate()
//     console.log(con.client)

// }
// any()

// find cons which created by a specific client

// const any = async () => {
//     const cli = await clients.findById('5e4c7eaf05bbe638644f3b5a')
//     await cli.populate('concultations').execPopulate()
//     console.log(cli.concultations)
// }
// any()


// let avrRate = 0
// for(var i = 0 ; i<count ; i++ ){
//     avrRate += (rates[i].rate)/count
// }
// this.rate = avrRate

//const rr = [2,5,63,9,3,8,5,8,2,85,8,6,5,665]
// var y = 0 
// rr.forEach((value) => {
//     y += value
    
// })
// console.log(y)

