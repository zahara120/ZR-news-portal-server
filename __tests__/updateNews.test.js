const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const { generateJwt } = require('../helpers/jwt');
const { queryInterface } = sequelize;
const { User, Article } = require('../models')

let adminToken = ''
let staffToken = ''
let newsId = ''

const registeredUser = {
    "username": "admin",
    "email": "admin@mail.com",
    "password": "limabiji",
    "role": "Admin",
    "phoneNumber": "08123456789",
    "address": "Jl. Raya"
}
const registeredUser2 = {
    "username": "zahara",
    "email": "zahara@mail.com",
    "password": "limabiji",
    "role": "Staff",
    "phoneNumber": "08123456789",
    "address": "Jl. Raya"
}

describe("PUT /news/:id", () => {
    test("berhasil mengupdate data news", async () => {
        let { status, body } = await request(app)
            .put(`/news/${newsId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                "title": "Ganti 1",
                "content": "Seds do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                "imgUrl": "https://dummyimage.com/179x100.png/5fa2dd/ffffff",
                "CategoryId": 5
            })
        // console.log({ status, body });
        expect(status).toBe(200);
        expect(body.id).toEqual(newsId);
        expect(body).toHaveProperty("title", "Ganti 1")
        expect(body).toHaveProperty("content", "Seds do eiusmod tempor incididunt ut labore et dolore magna aliqua.")
        expect(body).toHaveProperty("imgUrl", "https://dummyimage.com/179x100.png/5fa2dd/ffffff")
        expect(body).toHaveProperty("CategoryId", 5)
    });

    test("gagal menjalankan fitur karna belum login", async () => {
        let { status, body } = await request(app)
            .put(`/news/${newsId}`)

        // console.log({ status, body });
        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Unauthenticated")
    });

    test("gagal menjalankan fitur karna token tidak valid", async () => {
        let { status, body } = await request(app)
            .put(`/news/${newsId}`)
            .set('Authorization', `Bearer dsfsadfw4rfsfwse`)

        // console.log({ status, body });
        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Unauthenticated")
    });

    test("gagal karena data tidak ditemukan", async () => {
        let { status, body } = await request(app)
            .put(`/news/100`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                "title": "Ganti 1",
                "content": "Seds do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                "imgUrl": "https://dummyimage.com/179x100.png/5fa2dd/ffffff",
                "CategoryId": 5
            })
        // console.log({ status, body });
        expect(status).toBe(404);
        expect(body).toHaveProperty("message", "error not found")
    });

    test("gagal menjalankan fitur ketika Staff mengolah data yang bukan miliknya", async () => {
        let { status, body } = await request(app)
            .put(`/news/${newsId}`)
            .set('Authorization', `Bearer ${staffToken}`)
            .send({
                "title": "Ganti 1",
                "content": "Seds do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                "imgUrl": "https://dummyimage.com/179x100.png/5fa2dd/ffffff",
                "CategoryId": 5
            })
        // console.log({ status, body });
        expect(status).toBe(403);
        expect(body).toHaveProperty("message", "Unauthorized")
    });

    test("gagal karna request body tidak sesuai", async () => {
        let { status, body } = await request(app)
            .put(`/news/${newsId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                title: "",
                content: "",
                imgUrl: "http://dummyimage.com/101x100.png/dddddd/000000",
                CategoryId: "",
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
    adminToken = generateJwt(user.id);

    let data = require('../data/category.json').map(el => {
        return {
            ...el,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    })
    await queryInterface.bulkInsert('Categories', data);

    const user2 = await User.create(registeredUser2);
    staffToken = generateJwt(user2.id);

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
