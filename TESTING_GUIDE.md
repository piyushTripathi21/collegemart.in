# Testing Guide for CollegeMart

## Installation

```bash
npm install --save-dev jest supertest @types/jest
```

## Setup Files

Create these files to configure Jest and run tests:

### jest.config.js

```javascript
export default {
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      lines: 70,
      functions: 70,
      branches: 70,
      statements: 70
    }
  },
  testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!node_modules/**'
  ]
}
```

### tests/setup.js

```javascript
// Setup file for tests
// Configure test database, mocks, etc.

process.env.NODE_ENV = 'test'
process.env.DB_HOST = 'localhost'
process.env.DB_USER = 'root'
process.env.DB_PASSWORD = ''
process.env.DB_NAME = 'collegemart_test'
process.env.JWT_SECRET = 'test_secret_key'

console.log('Test environment setup complete')
```

## Test Examples

### Unit Tests - src/__tests__/validators.test.js

```javascript
import { 
  validateEmail, 
  validatePrice, 
  validateRating,
  validatePassword,
  sanitizeString 
} from '../utils/errors'

describe('Validators', () => {
  // Email validation
  test('validateEmail should accept valid emails', () => {
    expect(validateEmail('user@college.edu')).toBe(true)
    expect(validateEmail('test.user+tag@example.com')).toBe(true)
  })

  test('validateEmail should reject invalid emails', () => {
    expect(validateEmail('invalid')).toBe(false)
    expect(validateEmail('invalid@')).toBe(false)
    expect(validateEmail('@example.com')).toBe(false)
    expect(validateEmail('')).toBe(false)
  })

  // Price validation
  test('validatePrice should accept non-negative numbers', () => {
    expect(validatePrice(0)).toBe(true)
    expect(validatePrice(100)).toBe(true)
    expect(validatePrice('50.50')).toBe(true)
  })

  test('validatePrice should reject negative or invalid', () => {
    expect(validatePrice(-10)).toBe(false)
    expect(validatePrice('invalid')).toBe(false)
    expect(validatePrice('')).toBe(false)
  })

  // Rating validation
  test('validateRating should accept 1-5 ratings', () => {
    expect(validateRating(1)).toBe(true)
    expect(validateRating(3)).toBe(true)
    expect(validateRating(5)).toBe(true)
  })

  test('validateRating should reject out of range', () => {
    expect(validateRating(0)).toBe(false)
    expect(validateRating(6)).toBe(false)
    expect(validateRating(10)).toBe(false)
  })

  // Password validation
  test('validatePassword should enforce minimum 8 characters', () => {
    expect(validatePassword('short')).toBe(false)
    expect(validatePassword('password123')).toBe(true)
    expect(validatePassword('12345678')).toBe(true)
  })

  // String sanitization
  test('sanitizeString should trim and limit length', () => {
    expect(sanitizeString('  hello  ', 10)).toBe('hello')
    expect(sanitizeString('verylongstring', 5)).toBe('veryl')
    expect(sanitizeString('')).toBe('')
  })
})
```

### Integration Tests - tests/api.products.test.js

```javascript
import request from 'supertest'
import app from '../server'

let authToken
const testUser = {
  email: 'test@college.edu',
  password: 'password123',
  name: 'Test User',
  college: 'IIT Delhi'
}

describe('Products API', () => {
  // Setup: Register and login test user
  beforeAll(async () => {
    await request(app)
      .post('/api/users/register')
      .send(testUser)
    
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({ 
        email: testUser.email, 
        password: testUser.password 
      })
    
    authToken = loginRes.body.token
  })

  // Get all products with pagination
  test('GET /api/products should return paginated products', async () => {
    const res = await request(app)
      .get('/api/products?page=1&limit=10')
    
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.pagination).toHaveProperty('page', 1)
    expect(res.body.pagination).toHaveProperty('limit', 10)
    expect(res.body.pagination).toHaveProperty('total')
    expect(res.body.pagination).toHaveProperty('pages')
  })

  // Create product
  test('POST /api/products should create product', async () => {
    const productData = {
      title: 'Test Laptop',
      description: 'Good condition laptop',
      price: '20000',
      condition: 'Good',
      category: 'Electronics',
      location: 'Delhi'
    }

    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${authToken}`)
      .send(productData)
    
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('id')
    expect(res.body.title).toBe(productData.title)
    expect(res.body.price).toBe(Number(productData.price))
  })

  // Get product by ID
  test('GET /api/products/:id should return product', async () => {
    const res = await request(app)
      .get('/api/products/1')
    
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('id', 1)
    expect(res.body).toHaveProperty('title')
    expect(res.body).toHaveProperty('reviews')
  })

  // Search products
  test('GET /api/search should search products', async () => {
    const res = await request(app)
      .get('/api/search?q=laptop&page=1&limit=10')
    
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('data')
    expect(res.body).toHaveProperty('pagination')
  })

  // Filter by category
  test('GET /api/products/category/:category should filter', async () => {
    const res = await request(app)
      .get('/api/products/category/Electronics?page=1&limit=10')
    
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    res.body.data.forEach(product => {
      expect(product.category.toLowerCase()).toBe('electronics')
    })
  })

  // Unauthorized access
  test('POST /api/products should reject unauthorized', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ title: 'Test' })
    
    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty('error')
  })
})
```

### Integration Tests - tests/api.auth.test.js

```javascript
import request from 'supertest'
import app from '../server'

describe('Authentication API', () => {
  const testUser = {
    email: `test${Date.now()}@college.edu`,
    password: 'password123',
    name: 'Test User',
    college: 'IIT Delhi'
  }

  // Register user
  test('POST /api/users/register should create user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send(testUser)
    
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('user')
    expect(res.body).toHaveProperty('token')
    expect(res.body.user.email).toBe(testUser.email)
  })

  // Duplicate email
  test('POST /api/users/register should reject duplicate email', async () => {
    await request(app)
      .post('/api/users/register')
      .send(testUser)
    
    const res = await request(app)
      .post('/api/users/register')
      .send(testUser)
    
    expect(res.status).toBe(409)
    expect(res.body.error).toContain('already registered')
  })

  // Login user
  test('POST /api/users/login should return token', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: testUser.email,
        password: testUser.password
      })
    
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
    expect(res.body.user.email).toBe(testUser.email)
  })

  // Invalid password
  test('POST /api/users/login should reject invalid password', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword'
      })
    
    expect(res.status).toBe(401)
    expect(res.body.error).toContain('Invalid')
  })

  // Get current user
  test('GET /api/users/me should return user', async () => {
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({
        email: testUser.email,
        password: testUser.password
      })
    
    const token = loginRes.body.token
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
    
    expect(res.status).toBe(200)
    expect(res.body.email).toBe(testUser.email)
  })

  // Invalid token
  test('GET /api/users/me should reject invalid token', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', 'Bearer invalid_token')
    
    expect(res.status).toBe(401)
  })
})
```

## Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- tests/api.auth.test.js

# Run tests in watch mode
npm test -- --watch
```

## Continuous Integration

Add to package.json:

```json
{
  "scripts": {
    "test": "jest --setup-files-after-env ./tests/setup.js",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch"
  }
}
```

## Coverage Goals

- Lines: 70%+
- Functions: 70%+
- Branches: 70%+
- Statements: 70%+

These tests ensure critical functionality works correctly and prevent regressions during development.
