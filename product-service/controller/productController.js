import { NotFoundError } from '../errors/index.js';
import { 
    createProduct, 
    getAllProducts, 
    getCategories,
    updateProduct, 
    getProductsByCategory }from '../services/productService.js';

const getProductsController = async (req, res, next) => {
    try {
        const { page, size, searchTitle} = req.query;
        console.log('searchTitle', searchTitle)
        const results = await getAllProducts(page, size, searchTitle);
        res.status(200).json(results);
    } catch (err) {
        next(err);
    }
}

const getCategoriesController = async (req, res, next) => {
    try {
        const results = await getCategories();
        res.status(200).json(results);
    } catch (error) {
        next(error)
    }
}

const getProductsByCategoryController = async (req, res, next) =>{
    try{
        const { category } = req.params;
        const results = await getProductsByCategory(category)
        if(!results)
            throw new NotFoundError('Products not available')
        res.status(200).json(results)
    } catch(error) {
        next(error)
    }
}

const createProductController = async (req, res, next) => {
    try {
        const results = await createProduct(req.body);
        res.status(201).json(results);
    } catch (error) {
        next(error)
    }
}

const updateProductController = async (req, res, next) => {
    try {
        const { id }= req.params;
        const results = await updateProduct(id, req.body);
        res.status(200).json(results);
    } catch (error) {
        next(error);
    }
}

export {
    getProductsController,
    getCategoriesController,
    createProductController,
    updateProductController,
    getProductsByCategoryController
}