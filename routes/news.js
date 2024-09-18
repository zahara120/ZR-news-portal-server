const NewsController = require('../controllers/newsController.js')
const upload = require('../helpers/multer.js')
const {authorization} = require('../middlewares/authorization.js')
const news = require('express').Router()

news
    .get('/', NewsController.getNews)
    .post('/', NewsController.createNews)
    .get('/:id', NewsController.detailNews)
    .put('/:id', authorization, NewsController.updateNews)
    .patch('/:id/img', authorization, upload.single('img'), NewsController.updateImg)
    .delete('/:id', authorization, NewsController.deleteNews)


module.exports = news;