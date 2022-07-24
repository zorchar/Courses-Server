const express = require('express')
const studentController = require('../controllers/studentController')
const authProfessor = require('../middleware/authProfessor')
const authStudent = require('../middleware/authStudent')

const router = new express.Router()

router.post('/signin', studentController.signInStudent)

router.post('/create', authProfessor, studentController.createStudent)

router.get('/', studentController.getAllStudents)

router.get('/:studentId', authProfessor, studentController.getStudent)

router.delete('/:studentId', authProfessor, studentController.deleteStudent)

router.patch('/me', authStudent, studentController.patchStudent)

router.patch('/register', authProfessor, studentController.registerForCourse)

router.patch('/unregister', authProfessor, studentController.removeFromCourse)

module.exports = router