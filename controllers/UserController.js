const { Op } = require("sequelize");
const { User } = require("../models");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });


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
        static async getProfile(req, res, next) {
        try {
            const { id } = req.user;
    
            const user = await User.findByPk(id, {
                attributes: ['id', 'name', 'email', 'username', 'createdAt', 'updatedAt'] 
            });
    
            if (!user) {
                throw {
                    name: "NotFound",
                    message: "User not found"
                };
            }
    
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: `Generate a short motivational quote for learning English. Keep it concise and inspiring.`
            });
    
            let motivation = "Keep learning!";
            if (response.text && typeof response.text === "string") {
                motivation = response.text.trim();
            }
    
            res.status(200).json({
                message: "User profile retrieved successfully",
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    username: user.username,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    motivation: motivation
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UserController