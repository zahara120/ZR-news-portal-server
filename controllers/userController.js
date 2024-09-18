const { comparePassword } = require("../helpers/bcrypt");
const { generateJwt } = require("../helpers/jwt");
const { User } = require("../models");
const { OAuth2Client } = require("google-auth-library");
class UserController {
  static async getData(req, res, next) {
    try {
      let data = await User.findAll();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  static async getDataPub(req, res, next) {
    try {
      let data = await User.findAll();
      const result = data.map((el) => {
        return {
          id: el.id,
          username: el.username,
          email: el.email,
          imageUrl: el.imageUrl,
        };
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
  static async getDetailData(req, res, next) {
    try {
      const { email } = req.params;
      let data = await User.findOne({
        where: {
          email: email,
        },
      });
      res.status(200).json({
        id: data.id,
        username: data.username,
        email: data.email,
        imageUrl: data.imageUrl,
      });
    } catch (error) {
      next(error);
    }
  }
  static async addUser(req, res, next) {
    try {
      const { username, email, password, phoneNumber, address } = req.body;
      let user = await User.create({
        username,
        email,
        password,
        phoneNumber,
        address,
      });
      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
      });
    } catch (error) {
      next(error);
    }
  }
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // ? cek user input email dan password
      if (!email) throw { name: "emailIsRequired" };
      if (!password) throw { name: "passwordIsRequired" };

      // ? cek user ada apa ga di db
      let user = await User.findOne({ where: { email } });
      if (!user) throw { name: "invalidEmailOrPassword" };

      // ? cek password user
      let isValid = comparePassword(password, user.password);
      if (!isValid) throw { name: "invalidEmailOrPassword" };

      // ? generate jwt
      const token = generateJwt(user.id);
      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }
  static async googleLogin(req, res, next) {
    try {
      const client = new OAuth2Client();
      const { googleToken } = req.body;
      // ? cek googleToken ada?
      if (!googleToken) throw { name: "missingGoogleToken" };

      // ? verify token dari google
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      // ? cek user ada apa ga di db
      let [user] = await User.findOrCreate({
        where: {
          email: payload.email,
        },
        defaults: {
          email: payload.email,
          username: payload.name,
          imageUrl: payload.picture,
          password: "default",
        },
      });
      // ? generate jwt
      const token = generateJwt(user.id);
      res.status(200).json({
        token,
        email: payload.email
      });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = UserController;
