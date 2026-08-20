import { jest } from '@jest/globals';
import request from 'supertest';

// Mock connection object
const mockConnection = {
  ping: jest.fn().mockResolvedValue(true),
  query: jest.fn().mockResolvedValue([[]]),
  release: jest.fn(),
  beginTransaction: jest.fn().mockResolvedValue(true),
  commit: jest.fn().mockResolvedValue(true),
  rollback: jest.fn().mockResolvedValue(true)
};

// Mock the MySQL pool to prevent tests from requiring a running database
jest.unstable_mockModule('mysql2/promise', () => {
  const mockPool = {
    getConnection: jest.fn().mockResolvedValue(mockConnection),
    query: jest.fn().mockResolvedValue([[]]),
    on: jest.fn()
  };
  return {
    default: {
      createPool: () => mockPool
    },
    createPool: () => mockPool
  };
});

// Import the app after mocking mysql2
const { app, pool } = await import('../server.js');

describe('CollegeMart API Server Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset connection query mock to return empty array by default
    mockConnection.query.mockReset().mockResolvedValue([[]]);
  });

  describe('GET /api/v1/health', () => {
    it('should return 200 and connection success message', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'Database connected successfully' });
    });

    it('should return 500 when database connection fails', async () => {
      pool.getConnection.mockRejectedValueOnce(new Error('Connection error'));

      const res = await request(app).get('/api/v1/health');
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Database connection failed' });
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should return 400 for invalid email or short password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'bad-email', password: '123' });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 401 if user does not exist', async () => {
      mockConnection.query.mockResolvedValueOnce([[]]); // No user found
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'test@college.edu', password: 'password123' });
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid email or password');
    });
  });

  describe('GET /api/v1/products', () => {
    it('should retrieve list of products with default pagination', async () => {
      const mockProducts = [
        { id: 1, title: 'Bicycle', price: 50, category: 'books', sold: 0 }
      ];
      
      mockConnection.query
        .mockResolvedValueOnce([mockProducts]) // products select
        .mockResolvedValueOnce([[{ total: 1 }]]); // count query

      const res = await request(app).get('/api/v1/products');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveLength(1);
      expect(res.body.pagination.total).toBe(1);
    });
  });

  describe('GET /api/v1/products/:id', () => {
    it('should return 404 when product is not found', async () => {
      // Products pool query
      pool.query
        .mockResolvedValueOnce([[]]) // Product query empty
        .mockResolvedValueOnce([[]]) // Image query empty
        .mockResolvedValueOnce([[]]); // Review query empty

      const res = await request(app).get('/api/v1/products/999');
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Product not found');
    });
  });
});
