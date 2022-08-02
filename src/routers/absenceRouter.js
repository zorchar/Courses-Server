const express = require('express')

const authProfessor = require('../middleware/authProfessor')
const authStudent = require('../middleware/authStudent')

const absenceController = require('../controllers/absenceController')

const router = new express.Router()

// get - /
router.post('/get-reason', authStudent, absenceController.getReasonFromAbsence)

// get - /courses/:courseID?date=
router.post('/get-absences-course-and-date', authProfessor, absenceController.getAbsencesOfDateAndCourse)

router.patch('/:absenceId/add-reason', authStudent, absenceController.addReasonToAbsence)


module.exports = router