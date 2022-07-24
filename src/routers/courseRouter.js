const express = require('express')
const courseController = require('../controllers/courseController')
const authProfessor = require('../middleware/authProfessor')
const authStudent = require('../middleware/authStudent')

const router = new express.Router()

router.post('/create', authProfessor, courseController.createCourse)

router.delete('/:courseName', authProfessor, courseController.deleteCourse)

router.get('/', courseController.getAllCourses)

module.exports = router