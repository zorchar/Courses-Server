const Professor = require("../models/professorModel")
const { patchDocument } = require("../utils/documentUtils")

const patchProfessor = async (req, res, next) => {
    try {
        const patchedProfessor = await patchDocument(Professor, req.body.userId, req.body)

        res.locals.data = patchedProfessor
        res.locals.status = 200
        next()
    } catch (err) {
        next(err)
    }
}

const loginProfessor = async (req, res, next) => {
    try {
        const professor = await Professor.findByEmailAndPassword(req.body.email, req.body.password)
        const token = await professor.generateToken()

        res.locals.data = { user: professor, token }
        res.locals.status = 200
        next()
    } catch (err) {
        console.log('error found in loginProfessor: ', err.message);
        next(err);
    }
}

const getProfessor = async (req, res, next) => {
    const { professor } = req.params
    try {
        const data = await Professor.findOne(professor.includes('@') ? { email: professor } : { _id: professor })

        res.locals.data = data
        res.locals.status = 200
        next()
    } catch (error) {
        next(error)
    }
}

const createProfessor = async (req, res, next) => {
    const professor = new Professor(req.body)
    try {
        const data = await professor.save()

        res.locals.data = data
        res.locals.status = 201
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getProfessor,
    createProfessor,
    patchProfessor,
    loginProfessor
}