const mongoose = require('mongoose')
mongoose.set('strictQuery', true)

mongoose.connect('mongodb://127.0.0.1:27017/shorny')
    .then(() => console.log('DB Connected'))
    .catch(e => console.log(`Error During Connection ${e.message}`))
