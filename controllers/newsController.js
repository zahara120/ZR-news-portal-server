const { Article, User, Category } = require('../models')
const { v2: cloudinary } = require('cloudinary')

cloudinary.config({ 
    cloud_name: process.env.cloudinary_cloud_name, 
    api_key: process.env.cloudinary_api_key, 
    api_secret: process.env.cloudinary_api_secret
});

class NewsController {
    static async getNews(req, res, next) {
        try {
            let data = await Article.findAll({
                include: [
                    {
                        model: User,  
                        attributes: { exclude: ['password'] }  
                    },
                    {
                        model: Category  
                    }
                ]
            });
            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }
    static async getNewsPub(req, res, next) {
        try {
            const { search, sort, category, page } = req.query
            let data = await Article.getAllData(search, sort, category, page);
            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }
    static async createNews(req, res, next) { 
        try {
            const UserId = req.user.id // ? dari jwt
            const { title, content, imgUrl, CategoryId } = req.body
            let data = await Article.create({ title, content, imgUrl, CategoryId, UserId });
            res.status(201).json(data)
        } catch (error) {
            next(error)
        }
    }
    static async detailNews(req, res, next) {
        try {
            const { id } = req.params
            let data = await Article.findOne({
                where: { id },
                include: [
                    {
                        model: User,  
                        attributes: { exclude: ['password'] }  
                    },
                    {
                        model: Category  
                    }
                ]
            });
            
            if (!data) throw { name: 'notFound' }

            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }
    static async updateNews(req, res, next) {
        try {
            const { id } = req.params
            const { title, content, imgUrl, CategoryId } = req.body

            let data = await Article.findByPk(id)
            
            if (!data) throw { name: 'notFound' }

            await data.update(
                { title, content, imgUrl, CategoryId }
            );
            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }
    static async updateImg(req, res, next) {
        try {
            const { id } = req.params
            const img = req.file

            // todo rubah buffer ke base64
            const imgBase64 = img.buffer.toString('base64')

            const result = await cloudinary.uploader.upload(`data:${img.mimetype};base64,${imgBase64}`)

            let data = await Article.findByPk(id)
            
            if (!data) throw { name: 'notFound' }

            await data.update(
                { imgUrl:result.secure_url }
            );
            res.status(200).json({
                message: 'Image News success to update'
            })
        } catch (error) {
            next(error)
        }
    }
    static async deleteNews(req, res, next) {
        try {
            const { id } = req.params
            let data = await Article.findByPk(id)
            
            if (!data) throw { name: 'notFound' }

            await data.destroy()

            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = NewsController;