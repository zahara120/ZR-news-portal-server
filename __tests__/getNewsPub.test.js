const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const { queryInterface } = sequelize;
const { User } = require('../models')

const registeredUser = {
    "username": "admin",
    "email": "admin@mail.com",
    "password": "limabiji",
    "role": "Admin",
    "phoneNumber": "08123456789",
    "address": "Jl. Raya"
}

describe("GET /pub/news", () => {
    test("berhasil mendapatkan data news tanpa menggunakan filter parameter", async () => {
        let { status, body } = await request(app)
            .get("/pub/news")
        // console.log({ status, body });
        expect(status).toBe(200);
        expect(body.data[0]).toHaveProperty("id", expect.any(Number))
        expect(body.data[0]).toHaveProperty("title", expect.any(String))
        expect(body.data[0]).toHaveProperty("content", expect.any(String))
        expect(body.data[0]).toHaveProperty("imgUrl", expect.any(String))
        expect(body.data[0]).toHaveProperty("CategoryId", expect.any(Number))
    });

    test("berhasil mendapatkan data news menggunakan 1 filter", async () => {
        let { status, body } = await request(app)
            .get("/pub/news?search=Home")
        // console.log({status, body});
        expect(status).toBe(200);
        expect(body.data[0].title).toContain('Home');
    });

    test("berhasil mendapatkan data news serta panjang yang sesuai ketika memberikan page tertentu", async () => {
        let { status, body } = await request(app)
            .get("/pub/news?page[number]=3")
        
        // console.log({status, body});
        expect(status).toBe(200);
        expect(body.data).toHaveLength(1);
    });
})

beforeAll(async () => {
    await User.create(registeredUser);

    let category = require('../data/category.json').map(el => {
        return {
            ...el,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    })
    await queryInterface.bulkInsert('Categories', category);

    let article = require('../data/article.json').map(el => {
        return {
            ...el,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    })
    await queryInterface.bulkInsert('Articles', article);
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
