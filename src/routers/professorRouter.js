const express = require('express')
const professorController = require('../controllers/professorController')
const authProfessor = require('../middleware/authProfessor')

const router = new express.Router()

router.post('/signin', professorController.signInProfessor)

router.post('/create', professorController.createProfessor)

router.get('/:professor', authProfessor, professorController.getProfessor)

router.patch('/me', authProfessor, professorController.patchProfessor)

module.exports = router