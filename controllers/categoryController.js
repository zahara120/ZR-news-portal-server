const { Category } = require('../models')

class CategoryController {

    static async getCategory(req, res, next) {
        try {
            const categories = await Category.findAll();
            res.status(200).json(categories)
        } catch (error) {
            next(error)
        }
    }
    static async createCategory(req, res, next) {
        try {
            const { name } = req.body
            const category = await Category.create({ name });
            res.status(201).json(category);
        } catch (error) {
            next(error)
        }
    }
    static async updateCategory(req, res, next) {
        try {
            const { id } = req.params
            const { name } = req.body
            let data = await Category.findByPk(id)

            if (!data) throw { name: 'notFound' }

            let updatedData = await data.update({ name });
            res.status(200).json(updatedData)
        } catch (error) {
            next(error)
        }
    }
    static async deleteCategory(req, res, next) {
        try {
            const { id } = req.params
            let data = await Category.findByPk(id)

            if (!data) throw { name: 'notFound' }

            await data.destroy();

            res.status(200).json({
                message: `category with id ${id} success to delete`
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = CategoryController;