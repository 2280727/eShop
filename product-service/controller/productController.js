import { NotFoundError } from '../errors/index.js';
import { getAllProducts, getProductsByCategory }from '../services/productService.js';

const getProductsController = async (req, res, next) => {
    try {
        const results = await getAllProducts();
        res.status(200).json(results)
    } catch (err) {
        next(err)
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
    getProductsByCategoryController
}