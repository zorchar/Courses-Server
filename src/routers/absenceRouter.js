const express = require('express')
const absenceController = require('../controllers/absenceController')
const authProfessor = require('../middleware/authProfessor')
const authStudent = require('../middleware/authStudent')

const router = new express.Router()

router.patch('/add-reason', authStudent, absenceController.addReasonToAbsence)

router.put('/get-reason', absenceController.getReasonFromAbsence)

router.put('/get-absences-course-and-date', absenceController.getAbsencesOfDateAndCourse)

module.exports = router