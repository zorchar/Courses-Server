const express = require('express')
const studentController = require('../controllers/studentController')

const router = new express.Router()

router.post('/professors/students/create', studentController.createStudent)

router.post('/professors/professors/create', studentController.createProfessor)

router.get('/professors/students', studentController.getAllStudents)

router.get('/professors/students/:student', studentController.getStudent)

router.get('/professors/professors/:professor', studentController.getProfessor)

router.use((req, res, next) => {
    if (res.locals.data)
        return res.status(res.locals.status || 200).send({ status: "success", data: res.locals.data })
    next({ status: 500, message: 'path does not exist' })
})

router.use((error, req, res, next) => {
    res.status(500).send({
        status: 500,
        message: error.message
    })
})

module.exports = router