const request = require("supertest")
const app = require('../index')
const { expect, describe, beforeAll, afterAll } = require("@jest/globals")
const { User } = require('../models/index')
const { hashPassword } = require("../helpers/bcrypt")


describe('POST /register', () => {
    // test success
    it('should successfully register a new user and send verification email', async () => {
        const reqBody = {
            name: "New User",
            email: "newuser@example.com",
            username: "newuser",
            password: "12345678"
        };

        const response = await request(app).post("/register").send(reqBody);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("name", reqBody.name);
        expect(response.body).toHaveProperty("email", reqBody.email);
        expect(response.body).toHaveProperty("username", reqBody.username);
    });

    // test when name not provided
    it('should fail when name is not provided', async () => {
        const reqBody = {
            email: "newuser",
            username: "newuser",
            password: "12345678"
        };

        const response = await request(app).post("/register").send(reqBody);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Name is required");
    })

    // test when name not provided
    it('should fail when email is not provided', async () => {
        const reqBody = {
            username: "newuser",
            name: "New User",
            password: "12345678"
        };

        const response = await request(app).post("/register").send(reqBody);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Email is required");
    })

    // test when username not provided
    it('should fail when username is not provided', async () => {
        const reqBody = {
            email: "newuser",
            name: "New User",
            password: "12345678"
        };
        const response = await request(app).post("/register").send(reqBody);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Username is required");
    })

    // test when password not provided
    it('should fail when password is not provided', async () => {
        const reqBody = {
            email: "newuser",
            username: "newuser",
            name: "New User",
        };
        const response = await request(app).post("/register").send(reqBody);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Password is required");
    })
})