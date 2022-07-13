const { findOneAndUpdate } = require("../models/absenceModel");
const Absence = require("../models/absenceModel");
const Course = require("../models/courseModel");
const Student = require("../models/studentModel");
const { concatObjectIdToFieldInDocument, removeObjectIdFromFieldInDocument } = require("../utils/generalUtils");
const { patchDocument, deleteDocument, deleteDocuments } = require("./genericControllers")

const signInStudent = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const student = await Student.findStudentByEmailAndPassword(email, password)
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
    const { studentId } = req.params
    try {
        const coursesWhereStudentIsRegistered = await Course.find({ students: studentId })
        coursesWhereStudentIsRegistered.forEach((course) => {
            course.students.forEach((student, i) => {
                if (student.toString() === studentId)
                    course.students.splice(i, 1)
            })
        })
        console.log(coursesWhereStudentIsRegistered);
        coursesWhereStudentIsRegistered.forEach(course => {
            course.save()
        })

        const deletedCount = await deleteDocument(Student, { _id: studentId })
        await deleteDocuments(Absence, { student: studentId })

        res.locals.data = deletedCount
        res.locals.status = 200
        next()
    } catch (error) {
        next(error)
    }
}

const registerForCourse = async (req, res, next) => {
    const data = {}
    const { courseId, studentId } = req.body
    try {
        const course = await Course.findOne({ _id: courseId })
        const absence = new Absence(
            {
                course: courseId,
                student: studentId,
                absences: course.schedule
            }
        )

        data.course = await concatObjectIdToFieldInDocument(Course, courseId, studentId, 'students')
        data.student = await concatObjectIdToFieldInDocument(Student, studentId, courseId, 'courses')

        await data.course.save()
        await data.student.save()
        await absence.save()

        res.locals.data = data
        res.locals.status = 201
        next()
    } catch (error) {
        next(error)
    }
}

const removeFromCourse = async (req, res, next) => {
    try {
        const data = {}
        const { courseId, studentId } = req.body

        await deleteDocument(Absence, { course: courseId, student: studentId })

        data.course = await removeObjectIdFromFieldInDocument(Course, courseId, studentId, 'students')
        data.student = await removeObjectIdFromFieldInDocument(Student, studentId, courseId, 'courses')

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
    registerForCourse,
    removeFromCourse,
}