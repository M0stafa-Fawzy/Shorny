class any {
    constructor(){
        console.log("hello World 1")
    }
    say() {
        console.log("hello World 22")
    }

}

class anyth extends any {
    constructor(){
        super() ; 
        console.log("hello World 3")
    }

}

let an = new anyth()

an.say()



// const express = require('express')
// const app = express() 
// app.use(express.json())

// // const adm = require('../routes/adminRoute')
// // app.use(adm)

// // const cli = require('../routes/clientRoute')
// // app.use(cli)

// // const law = require('../routes/lawyerRoute')
// // app.use(law)

// // const con = require('../routes/conRoute')
// // app.use(con)

// port = process.env.port || 3000


// app.listen(port, () => {
//     console.log("doneeeee")
// })

// // const clients = require('../src/db_models/client')
// // const lawyers = require('../src/db_models/lawyer')

// // const cons = require('../src/db_models/concultation')

// // find the client by a con he created
// // const any = async () => {

// //     const con = await cons.findById('5e4c7fc24c43a408dca39a52')
// //     await con.populate('client').execPopulate()
// //     console.log(con.client)

// // }
// // any()

// // find cons which created by a specific client

// // const any = async () => {
// //     const cli = await clients.findById('5e4c7eaf05bbe638644f3b5a')
// //     await cli.populate('concultations').execPopulate()
// //     console.log(cli.concultations)
// // }
// // any()
