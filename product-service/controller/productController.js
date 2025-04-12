import { NotFoundError } from '../errors/index.js';
import { getAllProducts, getCategories, getProductsByCategory }from '../services/productService.js';

const getProductsController = async (req, res, next) => {
    try {
        const results = await getAllProducts();
        res.status(200).json(results)
    } catch (err) {
        next(err)
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

export {
    getProductsController,
    getCategoriesController,
    getProductsByCategoryController
}