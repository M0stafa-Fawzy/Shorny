const app = require('./app')

port = process.env.PORT

app.listen( port, () => {
    console.log("running on port " + port )
})

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
// const lawyers = require('../src/db_models/lawyer')

// const cons = require('../src/db_models/concultation')

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

const tt = {
    name : "mmo" , 
    age : 23 , 
    specialized : "is" , 
    yog : 2016
}
