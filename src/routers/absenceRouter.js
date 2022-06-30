const express = require('express')
const absenceControllers = require('../controllers/absenceControllers')
const authProfessor = require('../middleware/authProfessor')
const authStudent = require('../middleware/authStudent')

const router = new express.Router()

// router.post('/create', authProfessor, absenceControllers.createAbsence)

// router.delete('/delete', authProfessor, absenceControllers.deleteAbsence)

router.patch('/add-reason', absenceControllers.addReasonToAbsence)

router.use((req, res, next) => {
    if (res.locals.data)
        return res.status(res.locals.status || 200).send({ status: "success", data: res.locals.data })
    next({ status: 500, message: 'path does not exist' })
})

router.use((error, req, res, next) => {
    console.log(error);
    res.status(500).send({
        status: 500,
        message: error.message
    })
})

module.exports = router