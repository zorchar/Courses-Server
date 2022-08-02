const Absence = require("../models/absenceModel");
const Course = require("../models/courseModel");
const Student = require("../models/studentModel");

const { patchDocument, deleteDocument, deleteDocuments } = require("../utils/documentUtils")

const loginStudent = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const student = await Student.findByEmailAndPassword(email, password)
        const token = await student.generateToken()

        res.locals.data = { user: student, token }
        res.locals.status = 200
        next()
    } catch (error) {
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

        res.locals.data = data
        res.locals.status = 200
        next()
    } catch (error) {
        next(error)
    }
}

const getAllStudents = async (req, res, next) => {
    try {
        const data = await Student.find().sort({ firstName: 1 })

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
    const { studentId } = req.params
    try {
        const coursesWhereStudentIsRegistered = await Course.find({ students: studentId })
        coursesWhereStudentIsRegistered.forEach((course) => {

            course.students.forEach((student, i) => {
                if (student.toString() === studentId)
                    course.students.splice(i, 1)
            })

            course.save()
        })

        const deletedCount = await deleteDocument(Student, { _id: studentId })
        deletedCount.deletedAbsences = await deleteDocuments(Absence, { student: studentId })

        res.locals.data = deletedCount
        res.locals.status = 200
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
    loginStudent,
    deleteStudent,
}