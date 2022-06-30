const express = require('express')
const studentControllers = require('../controllers/studentControllers')
const authProfessor = require('../middleware/authProfessor')
const authStudent = require('../middleware/authStudent')


const router = new express.Router()

router.post('/signin', studentControllers.signInStudent)

router.post('/create', authProfessor, studentControllers.createStudent)

router.get('/', studentControllers.getAllStudents)

router.get('/:studentId', authProfessor, studentControllers.getStudent)

router.delete('/:studentId', authProfessor, studentControllers.deleteStudent)//can maybe pipeline remove from course

router.patch('/me', authStudent, studentControllers.patchStudent)

router.patch('/register', authProfessor, studentControllers.registerForCourse)

router.patch('/unregister', authProfessor, studentControllers.removeFromCourse)

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