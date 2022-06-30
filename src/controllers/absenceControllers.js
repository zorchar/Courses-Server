const Absence = require("../models/absenceModel")
// const Course = require("../models/courseModel")
const { deleteDocument } = require("./genericControllers")

// const createAbsence = async (req, res, next) => {
//     const { courseId, studentId } = req.body
//     try {
//         const course = await Course.findOne({ _id: courseId })
//         const absence = new Absence(
//             {
//                 course: courseId,
//                 student: studentId,
//                 absences: course.schedule
//             }
//         )
//         const data = await absence.save()
//         res.locals.data = data
//         res.locals.status = 201
//         next()
//     } catch (error) {
//         next(error)
//     }
// }

const addReasonToAbsence = async (req, res, next) => {
    const { studentId, courseId, reason, classDate } = req.body
    try {
        const absence = await Absence.findOne({ student: studentId, course: courseId })

        const sameDateReasons = absence.reasons.filter(reason => reason.classDate.toString() === classDate.toString())/// make sure it works after change to classDate
        if (sameDateReasons.length > 0)
            throw ('Absence reason already exists for this class')

        absence.reasons = absence.reasons.concat({
            reason,
            classDate: absence.absences[0]
        })
        const data = await absence.save()

        res.locals.data = data
        res.locals.status = 201
        next()
    } catch (error) {
        next(error)
    }
}

// const deleteAbsence = async (req, res, next) => {
//     const { courseId, studentId } = req.body
//     try {
//         const deletedCount = await deleteDocument(Absence, { course: courseId, student: studentId })
//         res.locals.data = deletedCount
//         res.locals.status = 200
//         next()
//     } catch (error) {
//         next(error)
//     }
// }

module.exports = {
    // createAbsence,
    // deleteAbsence,
    addReasonToAbsence
}