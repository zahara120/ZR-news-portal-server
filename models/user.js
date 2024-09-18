'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Article)
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull:false,
      unique: true,
      validate:{
        notEmpty:{
          msg : 'email is required'
        },
        notNull:{
          msg : 'email is required'
        },
        isEmail: {
          args: true,
          msg : 'email is not valid'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty:{
          msg : 'password is required'
        },
        notNull:{
          msg : 'password is required'
        },
        len: {
          args: [5,15],
          msg : 'password must be more than 5 characters'
        }
      }
    },
    role: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    address: DataTypes.STRING,
    imageUrl: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: async (user, options) => {
        const hashedPassword = hashPassword(user.password, 10)
        user.password = hashedPassword;
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};