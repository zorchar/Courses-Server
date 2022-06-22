const Student = require("../models/studentModel")
const Professor = require("../models/professorModel")

const createStudent = async (req, res, next) => {
    const student = new Student(req.body)
    try {
        const data = await student.save()
        res.locals.data = data
        res.locals.status = 201
        next()
    } catch (error) {
        next(error)
    }
}

//change location
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

const getStudent = async (req, res, next) => {
    try {
        const data = await Student.findOne(req.params.student.includes('@') ? { email: req.params.student } : { _id: req.params.student })
        res.locals.data = data
        res.locals.status = 200
        next()
    } catch (error) {
        next(error)
    }
}
//// change location
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

const getAllStudents = async (req, res, next) => {
    try {
        const data = await Student.find()
        res.locals.data = data
        res.locals.status = 200
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createStudent,
    getStudent,
    //change location
    getProfessor,
    createProfessor,
    getAllStudents
}