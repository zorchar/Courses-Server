const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const professorSchema = new mongoose.Schema(
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
        tokens: [
            {
                token: {
                    type: String,
                    required: true,
                }
            }
        ]
    },
    {
        timestamps: true
    }
)

professorSchema.pre('save', async function (next) {
    const professor = this
    if (professor.isModified('password')) {
        // const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{0,}$/
        // if (!passRegex.test(professor.password) /*|| professor.password.length < 8*/) {
        //     throw new Error('password must contain... and have 8 chars or more')
        // }
        professor.password = await bcrypt.hash(professor.password, 8)
    }
    next()
})

professorSchema.statics.findByEmailAndPassword = async (email, password) => {
    const professor = await Professor.findOne({ email })
    if (!professor) {
        const err = new Error('Unable to login.')
        err.status = 401
        throw err
    }

    const isPassMatch = await bcrypt.compare(password, professor.password)
    if (!isPassMatch) {
        const err = new Error('Unable to login.')
        err.status = 401
        throw err
    }

    return professor
}

professorSchema.methods.generateToken = async function () {
    const professor = this
    const token = jwt.sign(
        {
            _id: professor._id
        },
        process.env.SECRET,
        {
            expiresIn: '6h'
        }
    )
    professor.tokens = professor.tokens.concat({ token })
    await professor.save()

    return token
}

professorSchema.methods.toJSON = function () {
    const professor = this
    const professorObj = professor.toObject()

    delete professorObj.password
    delete professorObj.tokens

    return professorObj
}

const Professor = mongoose.model("Professor", professorSchema)

module.exports = Professor