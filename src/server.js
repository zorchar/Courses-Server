const express = require('express')
const cors = require('cors')
const path = require('path')

const port = process.env.PORT
require('./db/mongoose')

const studentRouter = require('./routers/studentRouter')
const professorRouter = require('./routers/professorRouter')
const courseRouter = require('./routers/courseRouter')
const absenceRouter = require('./routers/absenceRouter')

// const publicDirectoryPath = path.join(__dirname, '../public')

const app = express()
app.use(cors())
app.use(express.json())

// app.use(express.static(publicDirectoryPath))
app.use('/professors', professorRouter)//change
app.use('/students', studentRouter)
app.use('/courses', courseRouter)
app.use('/absences', absenceRouter)

app.use((req, res, next) => {
    return res.status(res.locals.status || 200).send({ status: "success", data: res.locals.data })
})

app.use((error, req, res, next) => {
    res.status(500).send({
        status: 500,
        message: error.message
    })
})

app.listen(port, () => {
    console.log('Server connected, port:', port)
})
