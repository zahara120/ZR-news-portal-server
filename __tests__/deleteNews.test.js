const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const { generateJwt } = require('../helpers/jwt');
const { queryInterface } = sequelize;
const { User, Article } = require('../models')

let adminToken = ''
let staffToken = ''
let adminNewsId = ''
let staffNewsId = ''

const adminUser = {
    "username": "admin",
    "email": "admin@mail.com",
    "password": "limabiji",
    "role": "Admin",
    "phoneNumber": "08123456789",
    "address": "Jl. Raya"
}
const staffUser = {
    "username": "zahara",
    "email": "zahara@mail.com",
    "password": "limabiji",
    "role": "Staff",
    "phoneNumber": "08123456789",
    "address": "Jl. Raya"
}

describe("DELETE /news/:id", () => {
    test("berhasil menghapus data news", async () => {
        let { status, body } = await request(app)
            .delete(`/news/${adminNewsId}`)
            .set('Authorization', `Bearer ${adminToken}`)
        // console.log({ status, body });
        expect(status).toBe(200);
        expect(body).toHaveProperty("id", expect.any(Number))
        expect(body).toHaveProperty("title", "baru")
        expect(body).toHaveProperty("content", "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.")
        expect(body).toHaveProperty("imgUrl", "http://dummyimage.com/101x100.png/dddddd/000000")
        expect(body).toHaveProperty("CategoryId", 5)
    });

    test("gagal menjalankan fitur karna belum login", async () => {
        let { status, body } = await request(app)
            .delete(`/news/${adminNewsId}`)

        // console.log({ status, body });
        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Unauthenticated")
    });

    test("gagal menjalankan fitur karna token tidak valid", async () => {
        let { status, body } = await request(app)
            .delete(`/news/${adminNewsId}`)
            .set('Authorization', `Bearer dsfsadfw4rfsfwse`)

        // console.log({ status, body });
        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Unauthenticated")
    });

    test("gagal karena data tidak ditemukan", async () => {
        let { status, body } = await request(app)
            .delete(`/news/100`)
            .set('Authorization', `Bearer ${adminToken}`)
        // console.log({ status, body });
        expect(status).toBe(404);
        expect(body).toHaveProperty("message", "error not found")
    });

    test("gagal menjalankan fitur ketika Staff mengolah data yang bukan miliknya", async () => {
        let { status, body } = await request(app)
            .delete(`/news/${staffNewsId}`)
            .set('Authorization', `Bearer ${staffToken}`)
        // console.log({ status, body });
        expect(status).toBe(403);
        expect(body).toHaveProperty("message", "Unauthorized")
    });
})

beforeAll(async () => {
    // Create Admin User
    const admin = await User.create(adminUser);
    adminToken = generateJwt(admin.id);

    // Bulk insert categories
    const categoriesData = require('../data/category.json').map(el => {
        return {
            ...el,
            createdAt: new Date(),
            updatedAt: new Date()
        };
    });
    await queryInterface.bulkInsert('Categories', categoriesData);

    // Create Staff User
    const staff = await User.create(staffUser);
    staffToken = generateJwt(staff.id);

    // Create Articles
    const articles = await Article.bulkCreate([
        {
            "title": "baru",
            "content": "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            "imgUrl": "http://dummyimage.com/101x100.png/dddddd/000000",
            "CategoryId": 5,
            "UserId": admin.id
        },
        {
            "title": "baru2",
            "content": "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            "imgUrl": "http://dummyimage.com/101x100.png/dddddd/000000",
            "CategoryId": 1,
            "UserId": admin.id
        }
    ]);
    adminNewsId = articles[0].id;
    staffNewsId = articles[1].id;
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
