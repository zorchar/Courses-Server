const sucessHandlerMiddleware = (req, res, next) => {
    return res.status(res.locals.status || 200).send({ status: "success", data: res.locals.data })
}

module.exports = sucessHandlerMiddleware