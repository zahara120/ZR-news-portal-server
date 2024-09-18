'use strict';
const {
  Model,
  Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Article.belongsTo(models.Category)
      Article.belongsTo(models.User)
    }
    static async getAllData(search, sort, category, page) {
      const limit = 10;
      let pageNumber = 1;
      let queryWhere = {}
      let query = {
        include: [
          {
            model: sequelize.models.User,
            attributes: { exclude: ['password'] }
          },
          {
            model: sequelize.models.Category,
          },
        ],
        where: queryWhere,
        limit : limit
      }

      if (search) {
        queryWhere.title = {
          [Op.iLike]: `%${search}%`
        }
      }

      if (sort) {
        const sorting = sort[0] === '-' ? 'DESC' : 'ASC'
        const column = sorting === 'DESC' ? sort.slice(1) : sort
        query.order = [
          [column, sorting]
        ]
      }

      if (category) {
        queryWhere.CategoryId = category
      }

      if(page){
        if(page.number){
          pageNumber = +page.number
          query.offset = (pageNumber - 1) * limit
        }
      }

      const { count, rows } = await Article.findAndCountAll(query)
      return {
        page: pageNumber,
        data : rows,
        totalData : count,
        totalPage : Math.ceil(count /limit),
        dataPerPage : limit
      }
    }
  }
  Article.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'title is required'
        },
        notNull: {
          msg: 'title is required'
        }
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'content is required'
        },
        notNull: {
          msg: 'content is required'
        }
      }
    },
    imgUrl: DataTypes.STRING,
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'CategoryId is required'
        },
        notNull: {
          msg: 'CategoryId is required'
        }
      }
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'UserId is required'
        },
        notNull: {
          msg: 'UserId is required'
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Article',
  });
  return Article;
};