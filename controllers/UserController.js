const { Op } = require("sequelize");
const { User } = require("../models");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");

class UserController {
    static async login(req, res, next) {
        try {
            const { identifier, password } = req.body;
            if (!identifier) {
                throw {
                    name: "BadRequest",
                    message: "Username/email is required"
                }
            }

            if (!password) {
                throw {
                    name: "BadRequest",
                    message: "Password is required"
                }
            }

            const user = await User.findOne({
                where: {
                    [Op.or]: [{ username: identifier }, { email: identifier }]
                }
            })

            if (!user) {
                throw {
                    name: "Unauthorized",
                    message: "username/email, or password is invalid"
                }
            }

            const isValidPassword = await comparePassword(password, user.password)

            if (!isValidPassword) {
                throw {
                    name: "Unauthorized",
                    message: "username/email, or password is invalid"
                }
            }

            const { id, username, email } = user
            const bearerToken = await signToken({
                id: id,
                username: username,
                email: email
            })

            res.status(200).json({
                message: `login success`,
                access_token: bearerToken,
                id: id,
            })
        } catch (error) {
            next(error)
        }
    }

    static async register(req, res, next) {
        try {
            const { name, email, username, password } = req.body
            if (!name) {
                throw {
                    name: "BadRequest",
                    message: "Name is required"
                }
            }

            if (!email) {
                throw {
                    name: "BadRequest",
                    message: "Email is required"
                }
            }

            if (!username) {
                throw {
                    name: "BadRequest",
                    message: "Username is required"
                }
            }

            if (!password) {
                throw {
                    name: "BadRequest",
                    message: "Password is required"
                }
            }
            const hashedPassword = await hashPassword(password)
            const newUser = await User.create({
                name: name,
                username: username,
                email: email,
                password: hashedPassword
            })

            res.status(201).json({
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = UserController