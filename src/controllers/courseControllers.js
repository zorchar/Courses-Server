const Course = require("../models/courseModel")
const { createSchedule } = require("../utils/courseUtils")
const { patchDocument, deleteDocument } = require("./genericControllers")

const createCourse = async (req, res, next) => {
    const course = new Course(req.body)
    const startDate = new Date(req.body.startDate)
    const endDate = new Date(req.body.endDate)
    const intervals = req.body.intervals
    try {
        course.schedule = createSchedule(startDate, endDate, intervals)
        console.log(course.schedule);

        const data = await course.save()
        res.locals.data = data
        res.locals.status = 201
        next()
    } catch (error) {
        next(error)
    }
}

const deleteCourse = async (req, res, next) => {
    try {
        const deletedCount = await deleteDocument(Course, { name: req.params.courseName })
        res.locals.data = deletedCount
        res.locals.status = 200
        next()
    } catch (error) {
        next(error)
    }
}

const getAllCourses = async (req, res, next) => {
    try {
        const data = await Course.find().populate('professor', 'firstName')
        // const data = await Course.find()
        res.locals.data = data
        res.locals.status = 201
        next()
    } catch (error) {
        next(error)
    }
}

// const getCoursesOfStudent = async (req, res, next) => {
//     const studentId = req.params.studentId
//     try {
//         const data = await Course.find({ students: studentId }).populate('professor', 'firstName') // maybe remove professor populate
//         console.log(data);
//         res.locals.data = data
//         res.locals.status = 201
//         next()
//     } catch (error) {
//         next(error)
//     }
// }

module.exports = {
    createCourse,
    getAllCourses,
    deleteCourse,
    // getCoursesOfStudent
    // registerForCourse
}