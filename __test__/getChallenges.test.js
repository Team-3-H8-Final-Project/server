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

describe('GET /challenge', () => {
    test('should return list of challenge question & answer', async () => {
        const response = await request(app)
            .get('/challenge?theme=blockchain')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)
        expect(response.body).toHaveProperty("message", "Challenges for theme: blockchain")
    }, 15000)

    test('should return 400 if theme is not provided', async () => {
        const response = await request(app)
            .get('/challenge')
            .set('Authorization', `Bearer ${accessToken}`)
            .query({ theme: '' })
            .expect(400)
        expect(response.body).toHaveProperty("message", "Theme is required")
    })
})