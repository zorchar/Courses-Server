const express = require('express')
const courseControllers = require('../controllers/courseControllers')
const authProfessor = require('../middleware/authProfessor')
const authStudent = require('../middleware/authStudent')

const router = new express.Router()

router.post('/create', authProfessor, courseControllers.createCourse)

// router.post('/register', authProfessor, courseControllers.registerForCourse)

router.delete('/:courseName', authProfessor, courseControllers.deleteCourse)

router.get('/', courseControllers.getAllCourses)

// router.get('/:courseId', courseControllers.getCourse)

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