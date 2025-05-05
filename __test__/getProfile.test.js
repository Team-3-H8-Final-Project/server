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

describe('GET /profile', () => {
    it('should return user profile', async () => {
        const response = await request(app).get('/profile').set('Authorization', `Bearer ${accessToken}`)

        expect(response.status).toBe(200)
        expect(response.body.data).toHaveProperty("id", user.id)
        expect(response.body.data).toHaveProperty("name", user.name)
        expect(response.body.data).toHaveProperty("username", user.username)
        expect(response.body.data).toHaveProperty("email", user.email)
    })

})
