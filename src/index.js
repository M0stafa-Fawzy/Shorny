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

port = process.env.PORT


app.listen( port, () => {
    console.log("running on port " + port )
})

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
// const arr = [{ name : "mo" , age : 25 } , 
// { name : "mo" , age : 25 } ,
// { name : "momo" , age : 25 } 
// , 5555]

// for(i = 0 ; i<arr.length ; i++){
//     if(arr)
// }
//arr.concat(55)
// if( arr.some( (value) => { 
//         if(value.name === "mo"){
//             console.log('fon')
//         }else{
//             console.log('not')
//         }
//     })){
//         console.log('foun')
        
//     }else{('not fiund')}


// const arr = [{"_id" : "545484f5rgf4v65e4g84"} , {"_id" : "545484f54v65e4g84"} , {"_id" : "545484f5hgfd4v65e4g84"} , {"_id" : "545484f54v6jhgdfdf5e4g84"} ,]


// arr.some( (value) => {
//     if(value._id === "545484f54v65e4g84"){
//         console.log('existed')

//     }else{
//         console.log('not existed')

//     }
// })


//const arr = [{"_id" : "545484f5rgf4v65e4g84"} , "545484f5rgf4v65e4g84" ,{"_id" : "545484f54v65e4g84"} , {"_id" : "545484f5hgfd4v65e4g84"} , {"_id" : "545484f54v6jhgdfdf5e4g84"}]

// arr.forEach( (value) => {
//     if(value._id !== "545484f5rgf4v65e4g84"){
//         console.log("ther is not value")
//     }else{
//         console.log(value)
//     }
// })












