const CategoryController = require('../controllers/categoryController.js')
const news = require('express').Router()

news
    .get('/', CategoryController.getCategory)
    .post('/', CategoryController.createCategory)
    .put('/:id', CategoryController.updateCategory)
    .delete('/:id', CategoryController.deleteCategory)

module.exports = news