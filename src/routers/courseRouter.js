const express = require('express')

const courseController = require('../controllers/courseController')

const authProfessor = require('../middleware/authProfessor')

const router = new express.Router()

// add auth middleware to get all courses and get course
router.get('/', courseController.getAllCourses)

router.post('/new', authProfessor, courseController.createCourse)

router.patch('/:courseId/register', authProfessor, courseController.registerForCourse)

router.patch('/:courseId/unregister', authProfessor, courseController.removeFromCourse)

router.route('/:courseId')
    .get(courseController.getCourse)
    .delete(authProfessor, courseController.deleteCourse)

module.exports = router