const Professor = require("../models/professorModel")
const { patchDocument } = require("./genericControllers")

const patchProfessor = async (req, res, next) => {
    try {
        const patchedProfessor = await patchDocument(Professor, req.body.userId, req.body)
        res.locals.data = patchedProfessor
        res.locals.status = 200
        next()
    } catch (error) {

    }
}

const signInProfessor = async (req, res, next) => {
    try {
        const professor = await Professor.findProfessorByEmailAndPassword(req.body.email, req.body.password)
        const token = await professor.generateToken()
        res.locals.data = { user: professor, token }
        res.locals.status = 200
        next()
    } catch (error) {
        console.log('error found in signInProfessor: ', error.message);
        next(error);
    }
}

const getProfessor = async (req, res, next) => {
    try {
        const data = await Professor.findOne(req.params.professor.includes('@') ? { email: req.params.professor } : { _id: req.params.professor })
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
    signInProfessor
}