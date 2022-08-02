const express = require('express')
const studentController = require('../controllers/studentController')
const authProfessor = require('../middleware/authProfessor')
const authStudent = require('../middleware/authStudent')

const router = new express.Router()

router.get('/', authProfessor, studentController.getAllStudents)

router.post('/login', studentController.loginStudent)

router.post('/new', authProfessor, studentController.createStudent)

router.route('/:studentId')
    .get(authProfessor, studentController.getStudent)
    .delete(authProfessor, studentController.deleteStudent)

router.patch('/me', authStudent, studentController.patchStudent)

module.exports = router