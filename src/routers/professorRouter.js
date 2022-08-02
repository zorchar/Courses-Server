const express = require('express')
const professorController = require('../controllers/professorController')
const authProfessor = require('../middleware/authProfessor')

const router = new express.Router()

router.post('/login', professorController.loginProfessor)

// only keep for admin purposes - change to new instead of create
router.post('/new', professorController.createProfessor)

// get - /me
// add router.route for both /me routes
router.get('/:professor', authProfessor, professorController.getProfessor)

router.patch('/me', authProfessor, professorController.patchProfessor)

module.exports = router