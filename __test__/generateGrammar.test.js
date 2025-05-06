const request = require("supertest")
const app = require('../index')
const { expect, describe, beforeAll, afterAll } = require("@jest/globals")
const { User } = require('../models/index')
const { hashPassword } = require("../helpers/bcrypt")
const { signToken } = require("../helpers/jwt")

let accessToken;
let user
beforeAll(async () => {
    user = await User.create({
        name: 'Test User',
        email: 'testuser@example.com',
        username: 'testuser',
        password: await hashPassword('password123')
    })
    accessToken = await signToken({
        id: user.id,
        email: user.email,
        username: user.username
    })
})

afterAll(async () => {
    await User.destroy({
        truncate: true, // hapus semua
        cascade: true, // hapus data yang berelasi
        restartIdentity: true // restart id dari 1
    })
})

describe('POST /generate', () => {
    test('should return list of grammar question & answer', async () => {
        const response = await request(app)
            .post('/generate')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(201)
        expect(response.body).toHaveProperty("message", "Questions generated and saved successfully")
    }, 15000) // add additional timeout for the test to allow for AI response time
})