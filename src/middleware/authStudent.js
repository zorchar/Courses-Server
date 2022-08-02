const jwt = require('jsonwebtoken')

const Student = require('../models/studentModel')

const authStudent = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, process.env.SECRET)
        const student = await Student.findOne(
            {
                _id: data._id,
                'tokens.token': token
            }
        )

        if (!student) {
            const err = new Error("No student found")
            err.status = 401
            throw err
        }
        req.token = token
        req.student = student
        return next()
    } catch (error) {
        error.status = 401
        error.message = 'no authentication'
        return next(error)
    }
}

module.exports = authStudent