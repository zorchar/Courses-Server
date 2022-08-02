const Absence = require("../models/absenceModel")
const Course = require("../models/courseModel")
const Student = require("../models/studentModel");

const { createSchedule } = require("../utils/courseUtils")
const { deleteDocument, deleteDocuments } = require("../utils/documentUtils")
const { concatObjectIdToFieldInDocument, removeObjectIdFromFieldInDocument } = require("../utils/documentUtils");

const createCourse = async (req, res, next) => {
    const course = new Course(req.body)
    const startDate = new Date(req.body.startDate)
    const endDate = new Date(req.body.endDate)
    const intervals = req.body.intervals
    try {
        course.schedule = createSchedule(startDate, endDate, intervals)

        const data = await course.save()

        res.locals.data = data
        res.locals.status = 201
        next()
    } catch (error) {
        next(error)
    }
}

const deleteCourse = async (req, res, next) => {
    const { courseId } = req.params

    try {
        const course = await Course.findOne({ _id: courseId })

        const deletedCount = await deleteDocument(Course, { _id: courseId })
        deletedCount.deletedAbsences = await deleteDocuments(Absence, { course: course._id })

        res.locals.data = deletedCount
        res.locals.status = 204
        next()
    } catch (error) {
        next(error)
    }
}

const getAllCourses = async (req, res, next) => {
    try {
        const data = await Course.find().populate('professor')

        res.locals.data = data
        res.locals.status = 200
        next()
    } catch (error) {
        next(error)
    }
}

const getCourse = async (req, res, next) => {
    const { courseId } = req.params

    try {
        const data = await Course.findOne({ _id: courseId }).populate('professor')

        if (!data) {
            const err = new Error('Course not found.')
            err.status = 404
            throw err
        }

        res.locals.data = data
        res.locals.status = 200
        next()
    } catch (error) {
        next(error)
    }
}

const registerForCourse = async (req, res, next) => {
    const { courseId } = req.params
    const { studentId } = req.body

    try {
        const course = await Course.findOne({ _id: courseId })
        const absence = new Absence(
            {
                course: courseId,
                student: studentId,
                absences: course.schedule
            }
        )

        const data = {}
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
        const { courseId } = req.params
        const { studentId } = req.body

        await deleteDocument(Absence, { course: courseId, student: studentId })

        const data = {}
        data.course = await removeObjectIdFromFieldInDocument(Course, courseId, studentId, 'students')
        data.student = await removeObjectIdFromFieldInDocument(Student, studentId, courseId, 'courses')

        await data.course.save()
        await data.student.save()

        res.locals.data = data
        res.locals.status = 204
        next()
    } catch (error) {
        console.log(error)
        next(error)
    }
}

module.exports = {
    createCourse,
    getAllCourses,
    deleteCourse,
    getCourse,
    registerForCourse,
    removeFromCourse
}