import express from 'express'
import { getProductsController, getProductsByCategoryController } from '../controller/productController.js'

const router = express.Router();

router.get('/', getProductsController)
router.get(
    '/:category',
    getProductsByCategoryController
)

export default router;