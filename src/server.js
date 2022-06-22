const express = require('express')
const cors = require('cors')
const path = require('path')

const port = process.env.PORT
require('./db/mongoose')

const studentRouter = require('./routers/studentRouter')

// const publicDirectoryPath = path.join(__dirname, '../public')

const app = express()
app.use(cors())
app.use(express.json())

// app.use(express.static(publicDirectoryPath))
app.use(studentRouter)

app.use((req, res, next) => {
    return res.send('ok')
})

// app.all("*", (req, res) => {
//     res.status(400).render('error-page')
// })

app.listen(port, () => {
    console.log('Server connected, port:', port)
})
