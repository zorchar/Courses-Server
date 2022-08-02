const express = require('express')
const cors = require('cors')

const errorHandlerMiddleware = require('./middleware/errorHandlerMiddleware')
const sucessHandlerMiddleware = require('./middleware/successHandlerMiddleware');

const studentRouter = require('./routers/studentRouter')
const professorRouter = require('./routers/professorRouter')
const courseRouter = require('./routers/courseRouter')
const absenceRouter = require('./routers/absenceRouter')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/professors', professorRouter)
app.use('/students', studentRouter)
app.use('/courses', courseRouter)
app.use('/absences', absenceRouter)

app.use(sucessHandlerMiddleware)
app.use(errorHandlerMiddleware)

module.exports = app;