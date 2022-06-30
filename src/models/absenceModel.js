const mongoose = require('mongoose')

const absenceSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: [true],
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: [true],
        },
        absences: [{
            type: Date,
        }],
        reasons: [
            {
                reason: {
                    type: String
                },
                classDate: {
                    type: Date
                }
            }
        ]
    },
    {
        timestamps: true
    },
)

absenceSchema.methods.toJSON = function () {
    const absence = this
    const absenceObj = absence.toObject()
    /// maybe keep?
    delete absenceObj.createdAt
    delete absenceObj.updatedAt
    delete absenceObj.__v
    // delete absenceObj._id

    return absenceObj
}

const Absence = mongoose.model("Absence", absenceSchema)

module.exports = Absence