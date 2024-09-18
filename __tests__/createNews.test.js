const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const { generateJwt } = require('../helpers/jwt');
const { hashPassword } = require('../helpers/bcrypt');
const { queryInterface } = sequelize;
const { User } = require('../models')

let token = ''
let userId = ''

const registeredUser = {
    "username": "admin",
    "email": "admin@mail.com",
    "password": "limabiji",
    "role": "Admin",
    "phoneNumber": "08123456789",
    "address": "Jl. Raya"
}

describe("POST /news", () => {
    test("berhasil membuat news", async () => {
        let { status, body } = await request(app)
            .post("/news")
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: "clever amalia",
                content: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                imgUrl: "http://dummyimage.com/101x100.png/dddddd/000000",
                CategoryId: 5,
                UserId: userId,
            })
        // console.log({ status, body });
        expect(status).toBe(201);
        expect(body).toHaveProperty("title", "clever amalia")
        expect(body).toHaveProperty("content", "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.")
        expect(body).toHaveProperty("imgUrl", "http://dummyimage.com/101x100.png/dddddd/000000")
        expect(body).toHaveProperty("CategoryId", 5)
        expect(body).toHaveProperty("UserId", userId)
    });

    test("gagal menjalankan fitur karna belum login", async () => {
        let { status, body } = await request(app)
            .post("/news")
            .send({
                title: "clever amalia",
                content: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                imgUrl: "http://dummyimage.com/101x100.png/dddddd/000000",
                CategoryId: 5,
                UserId: userId,
            })
        // console.log({ status, body });
        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Unauthenticated")
    });

    test("gagal menjalankan fitur karna token tidak valid", async () => {
        let { status, body } = await request(app)
            .post("/news")
            .set('Authorization', `Bearer dsfsadfw4rfsfwse`)
            .send({
                title: "clever amalia",
                content: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                imgUrl: "http://dummyimage.com/101x100.png/dddddd/000000",
                CategoryId: 5,
                UserId: userId,
            })
        // console.log({ status, body });
        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Unauthenticated")
    });

    test("gagal karna request body tidak sesuai", async () => {
        let { status, body } = await request(app)
            .post("/news")
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: "",
                content: "",
                imgUrl: "http://dummyimage.com/101x100.png/dddddd/000000",
                CategoryId: "",
                UserId: "",
            })
        // console.log({ status, body });
        expect(status).toBe(400);
        expect(body).toHaveProperty("message", [
            'title is required',
            'content is required',
            'CategoryId is required'
        ])
    });
})

beforeAll(async () => {
    const user = await User.create(registeredUser);
    token = generateJwt(user.id);
    userId = user.id;

    let data = require('../data/category.json').map(el => {
        return {
            ...el,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    })
    await queryInterface.bulkInsert('Categories', data);
});

afterAll(async () => {
    await queryInterface.bulkDelete('Users', null, {
        truncate: true,
        cascade: true,
        restartIdentity: true
    });
    await queryInterface.bulkDelete('Categories', null, {
        truncate: true,
        cascade: true,
        restartIdentity: true
    });
});
