const jwt = require("jsonwebtoken");

const sign = (data, options = {}) => {
    const token = jwt.sign(data, process.env.SECRET, options);

    return token
}

const verify = (data, secret, options) => { }

module.exports = {
    sign,
    verify,
}