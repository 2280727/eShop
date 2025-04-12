import express from 'express'
import { 
    getProductsController, 
    getProductsByCategoryController, 
    getCategoriesController } from '../controller/productController.js'

const router = express.Router();

router.get(
    '/', 
    getProductsController)

router.get(
    '/categories', 
    getCategoriesController);
    
router.get(
    '/category/:category',
    getProductsByCategoryController
)

export default router;