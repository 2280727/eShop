import sinon from 'sinon';
import { getCategoriesController, getProductsController, getProductsByCategoryController, createProductController } from '../../controller/productController.js';
import * as productService from '../../services/productService.js';

// Mock the database models
jest.mock('../../models/Product.js', () => {
  return {
    __esModule: true,
    default: {
      findAll: jest.fn(),
      create: jest.fn(),
      rawAttributes: {
        category: {
          type: {
            values: ["men's clothing", "women's clothing", "jewelery", "electronics"]
          }
        }
      }
    }
  };
});

jest.mock('../../models/Rating.js', () => {
  return {
    __esModule: true,
    default: {
      findAll: jest.fn()
    }
  };
});

// Mock database connection
jest.mock('../../db.js', () => {
  return {
    __esModule: true,
    default: {
      define: jest.fn().mockReturnValue({}),
      authenticate: jest.fn().mockResolvedValue(true)
    },
    connectDB: jest.fn().mockResolvedValue(true)
  };
});

describe('Products Controller', () => {
    let req, res, next,mockProducts;
    
    beforeEach(() => {
        mockProducts = [
              {
                  "id": 4,
                  "title": "Mens Casual Slim Fit",
                  "price": 15.99,
                  "description": "The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below on the product description.",
                  "category": "men's clothing",
                  "image": "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
                  "rating": {
                      "rate": 2.1,
                      "count": 430
                  }
              },
              {
                  "id": 5,
                  "title": "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
                  "price": 695,
                  "description": "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl. Wear facing inward to be bestowed with love and abundance, or outward for protection.",
                  "category": "jewelery",
                  "image": "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
                  "rating": {
                      "rate": 4.6,
                      "count": 400
                  }
              },
          ]
        req = {};
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        next = sinon.stub();
    });
    
    afterEach(() => {
        sinon.restore();
    });

    describe('getProducts', () => {
        it('should return the list of products', async () => { 
            // Mock underlying service
            const serviceStub = sinon.stub(productService, 'getAllProducts').resolves(mockProducts);
            
            // Call the controller
            await getProductsController(req, res, next);
            
            // Validate response/assert
            expect(serviceStub.calledOnce).toBe(true);
            expect(res.status.calledWith(200)).toBe(true);
            expect(res.json.calledWith(mockProducts)).toBe(true);
        });
        
        it('should call next with error when service fails', async () => {
            const error = new Error('Service error');
            sinon.stub(productService, 'getAllProducts').rejects(error);
            
            await getProductsController(req, res, next);
            
            expect(next.calledWith(error)).toBe(true);
        });
    });

    describe('getProductByCategory', () => {
      it('should return products of the given category', async () => {
        //mock the request
        const category = "men's clothing";
        req = { params: category};
        const expectedProduct = mockProducts.find(item => item.category === category);
        const serviceStub = sinon.stub(productService, 'getProductsByCategory').resolves(expectedProduct)

        await getProductsByCategoryController(req, res, next);

        expect(serviceStub.calledOnce).toBe(true);
        expect(res.status.calledWith(200)).toBe(true);
        expect(res.json.calledWith(expectedProduct)).toBe(true);
      });
      
      it('should call next with error when service fails', async () => {
        const error = new Error('Service error');
        const category = "men's clothing";
        req = { params: { category } };
        sinon.stub(productService, 'getProductsByCategory').rejects(error);
        
        await getProductsByCategoryController(req, res, next);
        
        expect(next.calledWith(error)).toBe(true);
      });
    });

    describe('getCategories', () => {
      it('should return all available categories', async () => {
        const mockCategories = ["men's clothing", "women's clothing", "jewelery", "electronics"];
        const serviceStub = sinon.stub(productService, 'getCategories').resolves(mockCategories);
        
        await getCategoriesController(req, res, next);
        
        expect(serviceStub.calledOnce).toBe(true);
        expect(res.status.calledWith(200)).toBe(true);
        expect(res.json.calledWith(mockCategories)).toBe(true);
      });

      it('should call next with error when service fails', async () => {
        const error = new Error('Service error');
        sinon.stub(productService, 'getCategories').rejects(error);
        
        await getCategoriesController(req, res, next);
        
        expect(next.calledWith(error)).toBe(true);
      });
    });

    describe('createProduct', () => {
        it('should create a new product successfully', async () => {
            const productData = {
                "title": "New Test Product",
                "price": 29.99,
                "description": "This is a test product description that is longer than 10 characters",
                "category": "men's clothing",
                "image": "https://test-image-url.com/image.jpg",
                "rating": {
                    "rate": 4.2,
                    "count": 120
                }
            };
            
            const createdProduct = { 
                id: 10, 
                ...productData 
            };
            
            req = { body: productData };
            
            // Mock the service function
            const serviceStub = sinon.stub(productService, 'createProduct').resolves(createdProduct);
            
            // Call the controller
            await createProductController(req, res, next);
            
            // Validate response/assert
            expect(serviceStub.calledOnce).toBe(true);
            expect(serviceStub.calledWith(productData)).toBe(true);
            expect(res.status.calledWith(201)).toBe(true);
            expect(res.json.calledWith(createdProduct)).toBe(true);
        });
        
        it('should call next with error when service fails', async () => {
            const error = new Error('Failed to create product');
            const productData = {
                "title": "Invalid Product",
                "price": 29.99
            };
            
            req = { body: productData };
            
            // Mock service to throw error
            sinon.stub(productService, 'createProduct').rejects(error);
            
            // Call the controller
            await createProductController(req, res, next);
            
            // Verify error handling
            expect(next.calledWith(error)).toBe(true);
            expect(res.status.called).toBe(false);
            expect(res.json.called).toBe(false);
        });
    });
    
});
