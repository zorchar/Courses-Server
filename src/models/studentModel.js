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
        courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course'
            }
        ],
        tokens: [
            {
                token: {
                    type: String,
                    required: true,
                }
            }
        ],
    },
    {
        timestamps: true
    }
)

studentSchema.pre('save', async function (next) {
    const student = this
    if (student.isModified('password')) {
        // const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{0,}$/
        // if (!passRegex.test(student.password) /*|| student.password.length < 8*/) {
        //     throw new Error('password must contain upper case, lower case, numbers, and have 8 chars or more')
        // }
        student.password = await bcrypt.hash(student.password, 8)
    }
    next()
})

studentSchema.statics.findStudentByEmailAndPassword = async (email, password) => {
    const student = await Student.findOne({ email })
    if (!student) {
        const err = new Error('Unable to login.')
        err.status = 400
        throw err
    }

    const isPassMatch = await bcrypt.compare(password, student.password)
    if (!isPassMatch) {
        const err = new Error('Unable to login.')
        err.status = 400
        throw err
    }

    return student
}

studentSchema.methods.generateToken = async function () {
    const student = this
    const token = jwt.sign(
        {
            _id: student._id
        },
        process.env.SECRET,
        {
            expiresIn: '6h'
        }
    )
    student.tokens = student.tokens.concat({ token })
    await student.save()

    return token
}

studentSchema.methods.toJSON = function () {
    const student = this
    const studentObj = student.toObject()

    delete studentObj.password
    delete studentObj.tokens

    return studentObj
}

const Student = mongoose.model("Student", studentSchema)

module.exports = Student