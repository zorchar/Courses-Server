const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'Name is required'],
            unique: true,
        },
        professor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Professor',
            required: [true],
        },
        students: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        }],
        startDate: {
            type: Date,
            required: [true, 'Start date is required'],
        },
        endDate: {
            type: Date,
            required: [true, 'End date is required'],
        },
        schedule: [{
            type: Date,
        }]
    },
    {
        timestamps: true
    },
)

courseSchema.methods.toJSON = function () {
    const course = this
    const courseObj = course.toObject()
    delete courseObj.createdAt
    delete courseObj.updatedAt
    delete courseObj.__v

    return courseObj
}

const Course = mongoose.model("Course", courseSchema)

module.exports = Course