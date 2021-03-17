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

const act = require('../routes/actorRoute')
app.use(act)

const con = require('../routes/conRoute')
app.use(con)

const rep = require('../routes/replyRoute')
app.use(rep)

const rate = require('../routes/rateRoute')
app.use(rate)

port = process.env.PORT

// const io = require('socket.io').listen(app.listen(port , () => {
//     console.log('running on port ' + port)
// }))

// app.io = io

// let x = 500982

// io.on('connection' , (socket) => {
//     console.log('new connection')

//     io.emit('users' , x)
// })

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
