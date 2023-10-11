import categoryModel from '../models/categoryModel.js'
import slugify from 'slugify'

export const createCategoryController = async (req, res) => {
    try {

        const { name } = req.body

        if (!name) return res.status(400).send({ message: 'Name is required' })

        const existingCategory = await categoryModel.findOne({ name })

        if (existingCategory) {
            return res.status(400).send({
                success: false,
                message: 'Category already exists'
            })
        }

        const category = await new categoryModel({ name, slug: slugify(name) }).save()

        res.status(201).send({
            success: true,
            message: 'New category created',
            category
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in creating category'
        })
    }
}

export const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body
        const { id } = req.params // id will be accessed through URL

        const category = await categoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true })

        res.status(200).send({
            success: true,
            message: "Category updated successfully",
            category
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in updating category'
        })
    }
}

export const categoryController = async (req, res) => {
    try {

        const category = await categoryModel.find({})
        res.status(200).send({
            success: true,
            message: 'Successfully fetched all categories',
            category
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Error in fetching categories",
            success: false,
            error
        })
    }
}

// single category controller : 

export const singleCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug })
        res.status(200).send({
            success: true,
            message: 'Single category fetched successfully',
            category
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error while getting single category'
        })
    }
}

// delete category controller

export const deleteCategory = async (req, res) => {
    try {
        const { slug } = req.params
        const deleteCategory = await categoryModel.deleteOne({ slug })
        res.status(200).send({
            success: true,
            message: 'Category deleted successfully',
            deleteCategory
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error while deleting category'
        })
    }
}