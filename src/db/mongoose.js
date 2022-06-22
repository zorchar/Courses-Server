const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL)
    .then((con) => {
        console.log('database connected')
    })
    .catch((err) => {
        console.log(`mongoose err conection: ${err}`)
    })