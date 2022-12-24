const mongoose = require('mongoose')
mongoose.set('strictQuery', true)

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('DB Connected'))
    .catch(e => console.log(`Error During Connection ${e.message}`))
