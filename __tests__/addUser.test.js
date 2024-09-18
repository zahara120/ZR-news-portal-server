const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const { generateJwt } = require('../helpers/jwt');
const { hashPassword } = require('../helpers/bcrypt');
const { queryInterface } = sequelize;
const { User } = require('../models')

let token = ''

const admin = {
    "username": "admin",
    "email": "admin@mail.com",
    "password": "limabiji",
    "role": "Admin",
    "phoneNumber": "08123456789",
    "address": "Jl. Raya"
}

const user2 = {
    "username": "zahara",
    "email": "zahara@mail.com",
    "password": "limabiji",
    "role": "Staff",
    "phoneNumber": "08123456789",
    "address": "Jl. Raya"
}

const user3 = {
    "username": "amalia",
    "email": "amalia@mail.com",
    "password": "limabiji",
    "role": "Staff",
    "phoneNumber": "08123456789",
    "address": "Jl. Raya"
}

describe("/add-user", () => {
    test("berhasil menambahkan user", async () => {
        let { status, body } = await request(app)
            .post("/add-user")
            .set('Authorization', `Bearer ${token}`)
            .send(user2)
        expect(status).toBe(201);
        expect(body).toHaveProperty("id", expect.any(Number))
        expect(body).toHaveProperty("username", "zahara")
        expect(body).toHaveProperty("email", "zahara@mail.com")
        expect(body).toHaveProperty("phoneNumber", "08123456789")
        expect(body).toHaveProperty("address", "Jl. Raya")
    });

    test("email tidak diberikan", async () => {
        let { status, body } = await request(app)
            .post("/add-user")
            .set('Authorization', `Bearer ${token}`)
            .send({
                password: "limabiji"
            })
        expect(status).toBe(400);
        expect(body).toHaveProperty("message", ["email is required"])
    });
    test("password tidak diberikan", async () => {
        let { status, body } = await request(app)
            .post("/add-user")
            .set('Authorization', `Bearer ${token}`)
            .send({
                email: "zahara@mail.com"
            })
        expect(status).toBe(400);
        expect(body).toHaveProperty("message", ["password is required"])
    });

    test("email diberikan string kosong", async () => {
        let { status, body } = await request(app)
            .post("/add-user")
            .set('Authorization', `Bearer ${token}`)
            .send({
                email: "",
                password: "limabiji"
            })
        // console.log({status, body});
        expect(status).toBe(400);
        expect(body).toHaveProperty("message", ['email is required', 'email is not valid'])
    });
    test("password diberikan string kosong", async () => {
        let { status, body } = await request(app)
            .post("/add-user")
            .set('Authorization', `Bearer ${token}`)
            .send({
                email: "zahara@mail.com",
                password: ""
            })
        console.log({status, body});
        expect(status).toBe(400);
        expect(body).toHaveProperty("message", ['password is required', 'password must be more than 5 characters'])
    });

    test("email sudah terdaftar", async () => {
        let { status, body } = await request(app)
            .post("/add-user")
            .set('Authorization', `Bearer ${token}`)
            .send(user3)
        // console.log({ status, body });
        expect(status).toBe(400);
        expect(body).toHaveProperty("message", ["email must be unique"])
    });

    test("format email invalid", async () => {
        let { status, body } = await request(app)
            .post("/add-user")
            .set('Authorization', `Bearer ${token}`)
            .send({
                email: "zahara.com",
                password: "limabiji"
            })
        // console.log({status, body});
        expect(status).toBe(400);
        expect(body).toHaveProperty("message", ['email is not valid'])
    });

    test("gagal menambahkan user karena tidak terdapat token", async () => {
        let { status, body } = await request(app)
            .post("/add-user")
            .send({
                email: "zahara@mail.com",
                password: "limabiji"
            })
        // console.log({status, body});
        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Unauthenticated")
    });

    test("gagal menambahkan user karena token tidak valid", async () => {
        let { status, body } = await request(app)
            .post("/add-user")
            .set('Authorization', `Bearer 2342342sdfsefasdf`)
            .send({
                email: "zahara@mail.com",
                password: "limabiji"
            })
        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Unauthenticated")
    });
})

beforeAll(async () => {
    await queryInterface.bulkInsert('Users', [
        {
            username: admin.username,
            email: admin.email,
            password: hashPassword(admin.password),
            role: admin.role,
            phoneNumber: admin.phoneNumber,
            address: admin.address,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            username: user3.username,
            email: user3.email,
            password: hashPassword(user3.password),
            role: user3.role,
            phoneNumber: user3.phoneNumber,
            address: user3.address,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ]);

    const user = await User.findOne({ where: { email: "admin@mail.com" } });
    token = generateJwt(user.id);
});

afterAll(async () => {
    await queryInterface.bulkDelete('Users', null, {
        truncate: true,
        cascade: true,
        restartIdentity: true
    });
});
