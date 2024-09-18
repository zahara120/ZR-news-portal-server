const jwt = require('jsonwebtoken');
const generateJwt = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET)
}

const verifyJwt = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { generateJwt, verifyJwt }