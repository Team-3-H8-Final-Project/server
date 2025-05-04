const { verifyToken } = require("../helpers/jwt")

function authentication(req, res, next) {
    const authorization = req.headers.authorization

    if (!authorization) {
        throw {
            name: "Unauthorized",
            message: "Invalid token"
        }
    }

    // if exists
    const [type, token] = authorization.split(" ")

    if (type !== "Bearer" || !token) {
        throw {
            name: "Unauthorized",
            message: "Invalid token"
        }
    }

    const payload = verifyToken(token, "secret")
    req.user = payload
    next()
}

module.exports = authentication