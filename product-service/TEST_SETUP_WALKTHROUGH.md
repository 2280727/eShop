# Testing Setup Walkthrough for Product Service

This document details the steps taken to configure and fix the Jest test setup for the Product Service in the eShop microservices project.

## Initial Issues Encountered

When running `npm run test`, we encountered several issues:

1. **Next Function Error**: 
   ```
   TypeError: next is not a function
   at next (controller/productController.js:9:9)
   ```
   The test was improperly set up without mocking the `next` function.

2. **Database Connection Issues**:
   Tests were hanging due to unclosed database connections, with errors like:
   ```
   Jest did not exit one second after the test run has completed.
   This usually means that there are asynchronous operations that weren't stopped in your tests.
   ```

3. **ES Modules Configuration Issues**:
   Since the project uses ES Modules (`"type": "module"` in package.json), we had compatibility issues with Jest configurations.

4. **Assertion Library Mismatch**:
   The tests were using Chai assertion syntax without properly importing Chai.

## Configuration Changes

### 1. Jest Configuration

Created a CommonJS-based Jest configuration file (`jest.config.cjs`):

```javascript
/** @type {import('jest').Config} */
module.exports = {
  // Tell Jest we're using ESM
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  // Indicate which paths to transform
  transformIgnorePatterns: [
    // Transform ESM modules that don't work with Jest by default
    "node_modules/(?!(chai|sinon|@sinonjs|uuid)/)"
  ],
  // Setup test environment
  testEnvironment: "node",
  // Use .js for test files
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.js$",
  // Use babel to handle imports
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },
};
```

### 2. Babel Configuration

Created a CommonJS-based Babel configuration file (`babel.config.cjs`):

```javascript
module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
  ],
};
```

### 3. File Extension Changes

Changed configuration file extensions to `.cjs` to ensure they are treated as CommonJS:
- `jest.config.js` → `jest.config.cjs`
- `babel.config.js` → `babel.config.cjs`

## Test File Modifications

### 1. Mock Database Dependencies

Created mock implementations for database models to avoid actual database connections:

```javascript
// Mock the database models
jest.mock('../../models/Product.js', () => {
  return {
    __esModule: true,
    default: {
      findAll: jest.fn(),
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
```

### 2. Fixed Test Structure

Updated the test structure with proper mock setup and cleanup:

```javascript
describe('Products Controller', () => {
    let req, res, next;
    
    beforeEach(() => {
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

    // Test cases...
});
```

### 3. Switched from Chai to Jest Assertions

Removed Chai dependencies and updated assertion syntax:

**Before:**
```javascript
import chai from 'chai';
const { expect } = chai;
// ...
expect(serviceStub.calledOnce).to.be.true;
expect(res.status.calledWith(200)).to.be.true;
```

**After:**
```javascript
// No Chai import needed
// ...
expect(serviceStub.calledOnce).toBe(true);
expect(res.status.calledWith(200)).toBe(true);
```

### 4. Fixed Controller Test Call

Corrected the parameter order when calling the controller:

**Before:**
```javascript
await getProductsController(res, next)
```

**After:**
```javascript
await getProductsController(req, res, next);
```

### 5. Added Error Handling Test

Added a specific test for error handling scenarios:

```javascript
it('should call next with error when service fails', async () => {
    const error = new Error('Service error');
    sinon.stub(productService, 'getAllProducts').rejects(error);
    
    await getProductsController(req, res, next);
    
    expect(next.calledWith(error)).toBe(true);
});
```

## Final Working Setup

The final working test structure:

1. **Configuration Files**:
   - `jest.config.cjs` - CommonJS Jest configuration
   - `babel.config.cjs` - CommonJS Babel configuration

2. **Test Structure**:
   - DB mocks to prevent actual database connections
   - Proper test isolation with beforeEach/afterEach
   - Jest assertions for validation
   - Proper testing of both success and error paths

3. **Test Results**:
   ```
   PASS  tests/controllers/product.test.js
     Products Controller
       getProducts
         ✓ should return the list of products (3 ms)
         ✓ should call next with error when service fails (1 ms)

   Test Suites: 1 passed, 1 total
   Tests:       2 passed, 2 total
   Snapshots:   0 total
   Time:        0.577 s
   ```

## Key Lessons Learned

1. **ES Modules with Jest**:
   - Use `.cjs` extension for CommonJS configuration files in ES Module projects
   - Configure Jest transformations to handle ES Module imports

2. **Database Testing**:
   - Always mock database connections in tests
   - Prevent hanging tests by properly mocking async operations

3. **Testing Frameworks**:
   - Stick to one assertion library (Jest's built-in assertions)
   - Ensure proper parameter ordering when calling functions under test

4. **Error Handling**:
   - Test both success and error paths
   - Properly mock error scenarios to validate error handling

