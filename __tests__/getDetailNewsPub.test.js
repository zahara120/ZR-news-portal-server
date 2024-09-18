const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const { generateJwt } = require('../helpers/jwt');
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
    test("berhasil mendapatkan data news sesuai dengan params id yang diberikan", async () => {
        let { status, body } = await request(app)
            .get("/pub/news/1")
            
        // console.log({ status, body });
        expect(status).toBe(200);
        // id di body harus sama kaya di param
        expect(body.id).toEqual(1);
    });
    test("gagal mendapatkan data news karena params id yang diberikan tidak ada di database", async () => {
        let { status, body } = await request(app)
            .get("/pub/news/900")
        // console.log({ status, body });
        expect(status).toBe(404);
        expect(body).toHaveProperty("message", "error not found");
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
