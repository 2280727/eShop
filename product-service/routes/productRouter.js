import express from 'express'
import { 
    getProductsController, 
    getProductsByCategoryController, 
    getCategoriesController,
    updateProductController, 
    createProductController
} from '../controller/productController.js'
import { createProductValidation, productCategoryValidation, updateProductValidation } from '../middlewares/validators/productValidators.js';
import validate from '../middlewares/validate.js';

const router = express.Router();

router.get(
    '/', 
    getProductsController)

router.get(
    '/categories',
     getCategoriesController);
    
router.get(
    '/category/:category',
    productCategoryValidation,
    validate,
    getProductsByCategoryController
)

router.post(
    '/',
    createProductValidation,
    validate,
    createProductController
)
router.patch(
    '/:id',
    updateProductValidation,
    validate,
    updateProductController
)
export default router;