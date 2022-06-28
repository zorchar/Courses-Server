const Course = require("../models/courseModel");
const Student = require("../models/studentModel");
const { concatObjectIdToFieldInDocument } = require("../utils/generalUtils");
const { patchDocument, deleteDocument } = require("./genericControllers")

const signInStudent = async (req, res, next) => {
    try {
        const student = await Student.findStudentByEmailAndPassword(req.body.email, req.body.password)
        console.log(student);
        const token = await student.generateToken()
        res.locals.data = { user: student, token }
        res.locals.status = 200
        next()
    } catch (error) {
        console.log('error found in signInStudent: ', error.message);
        next(error);
    }
}

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

const getStudent = async (req, res, next) => {
    try {
        const data = await Student.findOne({ _id: req.params.studentId }).populate('courses')
        console.log(data.courses);
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

const patchStudent = async (req, res, next) => {
    try {
        const patchedStudent = await patchDocument(Student, req.body.userId, req.body)
        res.locals.data = patchedStudent
        res.locals.status = 200
        next()
    } catch (error) {

    }
}

const deleteStudent = async (req, res, next) => {
    try {
        const deletedCount = await deleteDocument(Student, { _id: req.params.studentId })
        res.locals.data = deletedCount
        res.locals.status = 200
        next()
    } catch (error) {
        next(error)
    }
}

const registerForCourse = async (req, res, next) => {
    try {
        const data = {}
        const courseId = req.body.courseId
        const studentId = req.body.studentId

        data.course = await concatObjectIdToFieldInDocument(Course, courseId, studentId, 'students')
        data.student = await concatObjectIdToFieldInDocument(Student, studentId, courseId, 'courses')

        await data.course.save()
        await data.student.save()

        res.locals.data = data
        res.locals.status = 201
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createStudent,
    getStudent,
    getAllStudents,
    patchStudent,
    signInStudent,
    deleteStudent,
    registerForCourse
}