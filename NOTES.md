# Catatan Week 1

> Tuliskan apapun yang kalian pelajari pada phase 2 week-1 di file ini.
>
> "Pemahaman yang baik berasal dari keinginan untuk terus belajar, dan catatan adalah langkah pertama menuju pengetahuan yang dalam."

# Day 1
- cara bikin Restful api tanpa EJS
- cara pake postman (buat test endpoint)
- http status code 
    - 200 (success)
    - 201 (created)
    - 400 (bad request)
    - 401 (authorization/authenticated)
    - 403 (forbidden)
    - 404 (not found)
    - 500 (internal server error)
- bcrypt
- jwt (generate token & verify/decode) (npm jsonwebtoken)
- dotenv (npm dotenv) require('dotenv').config()

# Day 2
- middleware
- authentication 
    - req.headers.authorization
    - user kirim token?
    - token valid? ada Bearer nya ga?
    - siapa yg lagi login? encode token pake verify dari jwt
    - cek user id ada di db apa engga?
    - simpen data user (cukup id aja) req.user = {}
- authorization 
    - ambil data user
    - cek role atau id
    - cek hak nya
- error handling (next(), helpers, app.use taro di paling bawah routes)
- 3rds party api (cloudinary)
    - npm i cloudinary
    - const { v2: cloudinary } = require('cloudinary')
    - cloudinary.config({ 
        cloud_name: process.env.cloudinary_cloud_name, 
        api_key: process.env.cloudinary_api_key, 
        api_secret: process.env.cloudinary_api_secret
    });
    - install multer (supaya app kita bisa nerima request berupa file/img) (req.file)
    - tambahin di routes
        - const multer  = require('multer')
        - const storage = multer.memoryStorage()
        - const upload = multer({ storage: storage })
        - upload.single('img')
    - req.file
    - rubah buffer jadi base64 => .toString('base64')
    - upload ke cloudinary => await cloudinary.uploader.upload(`data:${img.mimetype};base64,${imgBase64}`)

# Day 3
- TDD
- config db for testing
- install supertest
- create bin/www (listen port)
- pisahin app
- add script for test
- import supertest
- create test case
    describe("POST /login", () => {
        test("user berhasil login", async () => {
            await request(app)
                .post("/login")

        expect(status).toBe(200)
        })
    })

# Day 4