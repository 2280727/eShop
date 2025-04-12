import Product from "../models/Product.js";
import Rating from "../models/Rating.js";

const getAllProducts = async () => {
    return await Product.findAll({
        include: [{
            model: Rating,
            as: 'rating',
            attributes: ['rate', 'count']
        }]
    })
}

const getCategories = async () => {
    return Product.rawAttributes.category.type.values;
}

const getProductsByCategory = async (category) => {
    return await Product.findAll({
        where: {
            category: category
        },
        include: [{
            model: Rating,
            as: 'rating',
            attributes: ['rate', 'count']
        }]
    })
}

export {
    getAllProducts,
    getCategories,
    getProductsByCategory}
