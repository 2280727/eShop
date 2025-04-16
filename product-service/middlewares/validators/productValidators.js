import { body, param } from "express-validator";
import { productCategories } from "../../data/product.js";

const productCategoryValidation = [
    param('category')
        .trim()
        .notEmpty().withMessage('Category is required')
        .isIn(productCategories).withMessage(`Invalid category. Must be one of ${productCategories.join(', ')}`)
] 

const createProductValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isString().withMessage('Title must be a string')
        .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
    
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isString().withMessage('Description must be a string')
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),
    
    body('category')
        .trim()
        .notEmpty().withMessage('Category is required')
        .isIn(productCategories).withMessage(`Invalid category. Must be one of ${productCategories.join(', ')}`),
    
    body('image')
        .trim()
        .notEmpty().withMessage('Image URL is required')
        .isURL().withMessage('Image must be a valid URL'),
    
    body('price')
        .notEmpty().withMessage('Price is required')
        .isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    
    body('rating.rate')
        .notEmpty().withMessage('Rating rate is required')
        .isFloat({ min: 0, max: 5 }).withMessage('Rating rate must be a number between 0 and 5'),
    
    body('rating.count')
        .notEmpty().withMessage('Rating count is required')
        .isInt({ gt: 0 }).withMessage('Rating count must be a positive integer')
]
const updateProductValidation = [
    param('id')
        .isUUID().withMessage('Invalid product ID format'),

    body('title')
        .optional()
        .trim()
        .isString().withMessage('Title must be a string')
        .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
    
    body('description')
        .optional()
        .trim()
        .isString().withMessage('Description must be a string')
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),
    
    body('category')
        .optional()
        .trim()
        .isIn(productCategories).withMessage(`Invalid category. Must be one of ${productCategories.join(', ')}`),
    
    body('image')
        .optional()
        .trim()
        .isURL().withMessage('Image must be a valid URL'),
    
    body('price')
        .optional()
        .isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    
    body('rating.rate')
        .optional()
        .isFloat({ min: 0, max: 5 }).withMessage('Rating rate must be a number between 0 and 5'),
    
    body('rating.count')
        .optional()
        .isInt({ gt: 0 }).withMessage('Rating count must be a positive integer')
]

export {
    productCategoryValidation,
    createProductValidation,
    updateProductValidation
}
