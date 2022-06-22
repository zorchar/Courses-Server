const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const studentSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            trim: true,
            required: [true, 'first name is required'],
        },
        lastName: {
            type: String,
            trim: true,
            required: [true, 'last name is required'],
        },
        age: {
            type: Number,
            required: [true, 'age is required'],
        },
        address: {
            type: String,
            trim: true,
            required: [true, 'address is required'],
        },
        email: {
            type: String,
            trim: true,
            required: [true, 'email is required'],
            lowercase: true,
            unique: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('invalid email')
                }
            }
        },
        password: {
            type: String,
            required: [true, 'password is required'],
            trim: true,
            // minlength: 8,
        },
    },
    {
        timestamps: true
    }
)

studentSchema.pre('save', async function (next) {
    const student = this
    if (student.isModified('password')) {
        // const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{0,}$/
        // if (!passRegex.test(student.password) /*|| user.password.length < 8*/) {
        //     throw new Error('password must contain... and have 8 chars or more')
        // }
        student.password = await bcrypt.hash(student.password, 8)
    }
    next()
})

studentSchema.methods.toJSON = function () {
    const user = this
    const userObj = user.toObject()

    delete userObj.password
    delete userObj.tokens

    return userObj
}

const Student = mongoose.model("Student", studentSchema)

module.exports = Student