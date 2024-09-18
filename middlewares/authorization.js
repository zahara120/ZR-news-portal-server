const { Article } = require('../models')

const adminAuthorization = (req, res, next) => {
    try {
        const role = req.user.role
        if(role !== 'Admin') throw { name : 'forbidden' }
        next()
    } catch (error) {
        next(error)
    }
}

const authorization = async (req, res, next) => {
    try {
        const role = req.user.role
        const userId = req.user.id
        const newsId = req.params.id

        // ? cek ada data nya apa engga
        let data = await Article.findByPk(newsId);
        if(!data) throw { name: 'notFound' }

        // ? UserId di data sama ga, sama yg lagi login? atau Admin 
        if (role === 'Admin' || data.UserId === userId) {
            return next();
        } else {
            throw { name: 'forbidden' };
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {adminAuthorization, authorization};