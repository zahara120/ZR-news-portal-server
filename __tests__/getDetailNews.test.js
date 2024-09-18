const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const { generateJwt } = require('../helpers/jwt');
const { hashPassword } = require('../helpers/bcrypt');
const { queryInterface } = sequelize;
const { User, Article } = require('../models')

let token = ''
let newsId = ''

const registeredUser = {
    "username": "admin",
    "email": "admin@mail.com",
    "password": "limabiji",
    "role": "Admin",
    "phoneNumber": "08123456789",
    "address": "Jl. Raya"
}

describe("GET /news/:id", () => {
    test("berhasil mendapatkan data news", async () => {
        let { status, body } = await request(app)
            .get(`/news/${newsId}`)
            .set('Authorization', `Bearer ${token}`)
        // console.log({ status, body });
        expect(status).toBe(200);
        expect(body.id).toEqual(newsId);
        expect(body).toHaveProperty("id", expect.any(Number))
        expect(body).toHaveProperty("title", expect.any(String))
        expect(body).toHaveProperty("content", expect.any(String))
        expect(body).toHaveProperty("imgUrl", expect.any(String))
        expect(body).toHaveProperty("CategoryId", expect.any(Number))
    });

    test("gagal menjalankan fitur karna belum login", async () => {
        let { status, body } = await request(app)
            .get(`/news/${newsId}`)

        // console.log({ status, body });
        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Unauthenticated")
    });

    test("gagal menjalankan fitur karna token tidak valid", async () => {
        let { status, body } = await request(app)
            .get(`/news/${newsId}`)
            .set('Authorization', `Bearer dsfsadfw4rfsfwse`)

        // console.log({ status, body });
        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Unauthenticated")
    });
})

beforeAll(async () => {
    const user = await User.create(registeredUser);
    token = generateJwt(user.id);

    let data = require('../data/category.json').map(el => {
        return {
            ...el,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    })
    await queryInterface.bulkInsert('Categories', data);

    let news = await Article.create({
        "title": "baru",
        "content": "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "imgUrl": "http://dummyimage.com/101x100.png/dddddd/000000",
        "CategoryId": 5,
        "UserId": user.id
    });
    newsId = news.id
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
