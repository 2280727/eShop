import { productCategories } from "../data/product.js";
import sequelize from "../connections/db.js";
import { Op } from "sequelize";
import Product from "../models/Product.js";
import Rating from "../models/Rating.js";
import redisClient from "../connections/redis.js";

const getAllProducts = async (page, size, searchTitle) => {
    const cacheKey = `products:${page}:${size}:${searchTitle}`;
    const cachedData = await redisClient.get(cacheKey);
    let products;
    if (cachedData) {
        products = JSON.parse(cachedData);
        return {
            products,
            pageCount: Math.ceil(products.length / size)
        }
    } else {    

        let pageNumber = 0;
        if (!Number.isNaN(page) && page > 0) {
            pageNumber = page;
        }
        let sizeNumber = 10;
        if (!Number.isNaN(size) && size > 0 && size < 10) {
            sizeNumber = size;
        }

        const whereClause = searchTitle ? { title: { [Op.like]: `%${searchTitle}%` } } : {};

        const results = await Product.findAndCountAll({
            where: whereClause,
            limit: sizeNumber,
            offset: pageNumber * sizeNumber,
            order: [
                ['price', 'DESC']
            ],
            include: [{
                model: Rating,
                as: 'rating',
                attributes: ['rate', 'count']
            }]
        });
        //cache the results
        await redisClient.set(cacheKey, JSON.stringify(results.rows));
        return {
            products: results.rows,
            pageCount: Math.ceil(results.count / sizeNumber)
        };
    }
}    

const getCategories = async () => {
    return productCategories;
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

const createProduct = async (product) => {
    return await Product.create({
        title: product.title,
        description: product.description,
        category: product.category,
        image: product.image,
        price: product.price,
        rating: {
            rate: product.rating.rate,
            count: product.rating.count
        }
    },{
        include: [{ model: Rating, as: 'rating'}]
    });
}

const updateProduct = async (uuid, productData) => {
    const transaction = await sequelize.transaction();

    try {
        const product = await Product.findByPk(uuid, {
            include: [{ model: Rating, as: 'rating' }],
            transaction
        });

        if (!product) {
            throw new Error('Product not found');
        }

        // Update product fields if they are provided
        if (productData.title) product.title = productData.title;
        if (productData.description) product.description = productData.description;
        if (productData.category) product.category = productData.category;
        if (productData.image) product.image = productData.image;
        if (productData.price) product.price = productData.price;

        await product.save({ transaction });

        // Update rating if provided
        if (productData.rating) {
            if (productData.rating.rate !== undefined) {
                product.rating.rate = productData.rating.rate;
            }
            if (productData.rating.count !== undefined) {
                product.rating.count = productData.rating.count;
            }
            await product.rating.save({ transaction });
        }

        await transaction.commit();

        // Fetch and return the updated product with rating
        return await Product.findByPk(uuid, {
            include: [{ model: Rating, as: 'rating' }]
        });
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}


export {
    getAllProducts,
    getCategories,
    createProduct,
    updateProduct,
    getProductsByCategory
}
