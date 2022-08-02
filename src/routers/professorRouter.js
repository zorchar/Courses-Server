const express = require('express')
const professorController = require('../controllers/professorController')
const authProfessor = require('../middleware/authProfessor')

const router = new express.Router()

router.post('/login', professorController.loginProfessor)

router.patch('/me', authProfessor, professorController.patchProfessor)

// // only keep for admin purposes------------------------------------------------
// router.post('/new', professorController.createProfessor)
// router.get('/:professor', authProfessor, professorController.getProfessor)

module.exports = router