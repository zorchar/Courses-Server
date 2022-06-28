const express = require('express')
const professorControllers = require('../controllers/professorControllers')
const authProfessor = require('../middleware/authProfessor')

const router = new express.Router()

router.post('/signin', professorControllers.signInProfessor)

router.post('/create', professorControllers.createProfessor)

router.get('/:professor', authProfessor, professorControllers.getProfessor)

router.patch('/me', authProfessor, professorControllers.patchProfessor)

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