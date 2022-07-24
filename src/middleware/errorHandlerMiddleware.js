const errorHandlerMiddleware = (error, req, res, next) => {
    res.status(500).send({
        status: 500,
        message: error.message
    })
};

module.exports = errorHandlerMiddleware;