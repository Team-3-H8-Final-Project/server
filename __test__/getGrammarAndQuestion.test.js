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

describe('GET /grammar', () => {
    test('should return list of grammar question & answer', async () => {
        const response = await request(app)
            .get('/grammar?level=Pemula')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)
        expect(response.body).toHaveProperty("message", "Questions for level: Pemula")
    })

    test('should return 400 if level is not provided', async () => {
        const response = await request(app)
            .get('/grammar')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(400)
        expect(response.body).toHaveProperty("message", "Level is required")
    })

    test('should return 400 if level is invalid', async () => {
        const response = await request(app)
            .get('/grammar?level=InvalidLevel')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(400)
        expect(response.body).toHaveProperty("message", "Invalid level. Allowed levels are: Pemula, Menengah, Lanjutan, Fasih")
    })

})