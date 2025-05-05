const request = require("supertest")
const app = require('../index')
const { expect, describe, beforeAll, afterAll } = require("@jest/globals")
const { User } = require('../models/index')
const { hashPassword } = require("../helpers/bcrypt")
const { signToken } = require("../helpers/jwt")

beforeAll(async () => {
    const user = await User.create({
        name: 'Test User',
        email: 'testuser@example.com',
        username: 'testuser',
        password: await hashPassword('password123')
    })
})

afterAll(async () => {
    await User.destroy({
        truncate: true, // hapus semua
        cascade: true, // hapus data yang berelasi
        restartIdentity: true // restart id dari 1
    })
})

describe('POST /login', () => {
    const identifier = "testuser"
    const password = "password123"
    it('should success and send access_token', async () => {
        const reqBody = {
            identifier: identifier,
            password: password
        }
        const response = await request(app).post("/login").send(reqBody)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("access_token")
    })

    // test when identifier not provided
    it('should return 400 when identifier not provided', async () => {
        const reqBody = {
            password: password
        }
        const response = await request(app).post("/login").send(reqBody)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("message", "Username/email is required")
    })

    // test when password not provided
    it('should return 400 when password not provided', async () => {
        const reqBody = {
            identifier: identifier
        }
        const response = await request(app).post("/login").send(reqBody)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("message", "Password is required")
    })

    // test when user not found
    it('should return 401 when user not found', async () => {
        const reqBody = {
            identifier: "nonexistentuser",
            password: password
        }
        const response = await request(app).post("/login").send(reqBody)
        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty("message", "username/email, or password is invalid")
    })

    // test when password is incorrect
    it('should return 401 when password is incorrect', async () => {
        const reqBody = {
            identifier: identifier,
            password: "wrongpassword"
        }
        const response = await request(app).post("/login").send(reqBody)
        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty("message", "username/email, or password is invalid")
    })
})