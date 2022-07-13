const Absence = require("../models/absenceModel")

const addReasonToAbsence = async (req, res, next) => {
    const { studentId, courseId, reason, classDate, isAttended } = req.body
    try {
        const absence = await Absence.findOne({ student: studentId, course: courseId })

        const sameDateReasons = absence.reasons.filter(reason => new Date(reason.classDate).toString() === new Date(classDate).toString())

        // redundency check - no two reasons can exist on the same date
        if (sameDateReasons.length === 0)
            absence.reasons = absence.reasons.concat({
                reason,
                classDate
            })
        else {
            absence.reasons.forEach((reasonElement, i) => {
                if (new Date(reasonElement.classDate).toString() === new Date(classDate).toString())
                    if (isAttended)
                        absence.reasons.splice(i, 1)
                    else
                        absence.reasons[i].reason = reason
            })
        }

        const data = await absence.save()

        res.locals.data = data
        res.locals.status = 201
        next()
    } catch (error) {
        next(error)
    }
}

const getReasonFromAbsence = async (req, res, next) => {
    const { studentId, courseId, classDate } = req.body
    try {
        const absence = await Absence.findOne({ student: studentId, course: courseId })
        const absenceStatus = {}

        const sameDateReasons = absence.reasons.filter(reason => new Date(reason.classDate).toString() === new Date(classDate).toString())/// make sure it works after change to classDate
        if (sameDateReasons.length === 1) {
            absenceStatus.reason = sameDateReasons[0].reason
            absenceStatus.isAttended = false
        }
        else {
            absenceStatus.reason = ''
            absenceStatus.isAttended = true
        }
        res.locals.data = absenceStatus
        res.locals.status = 201
        next()
    } catch (error) {
        next(error)
    }
}

const getAbsencesOfDateAndCourse = async (req, res, next) => {
    const { courseId, classDate } = req.body
    try {
        const absences = await Absence.find({ 'reasons.classDate': new Date(classDate), course: courseId })

        res.locals.data = absences
        res.locals.status = 201
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = {
    // createAbsence,
    // deleteAbsence,
    addReasonToAbsence,
    getReasonFromAbsence,
    getAbsencesOfDateAndCourse
}