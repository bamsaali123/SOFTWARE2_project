const request = require('supertest');
const express = require('express');
const session = require('express-session');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Product = require('../models/product');
const pagesController = require('../controllers/pages.controller');

// Mock the helpers
jest.mock('../helpers/discount', () => ({
  showDiscount: jest.fn().mockReturnValue('10%'),
  calculateNewPrice: jest.fn().mockImplementation(price => price * 0.9),
}));

// Set up Express app for testing
const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.json());
app.use(
  session({
    secret: 'test-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  })
);

// Route to set session for testing
app.get('/set-session', (req, res) => {
  req.session.user = {
    isAdmin: req.query.admin === 'true',
    username: req.query.admin === 'true' ? 'admin' : 'testUser',
  };
  res.status(200).send('Session set');
});

// Define routes
app.get('/home', pagesController.homePage);
app.get('/auth', pagesController.authPage);
app.get('/discount', pagesController.discountPage);
app.get('/login', pagesController.authPage);
app.get('/register', pagesController.authPage);
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/auth');
});

// Setup MongoDB Memory Server
let mongoServer;
let mongooseConnection;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  mongooseConnection = await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Product.deleteMany({});
});

describe('Pages Controller', () => {
  let agent;

  beforeEach(() => {
    agent = request.agent(app);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('GET /login', () => {
    it('should navigate to login page', async () => {
      const res = await agent.get('/login');
      expect(res.status).toBe(200);
    });
  });

  describe('GET /register', () => {
    it('should navigate to registration page', async () => {
      const res = await agent.get('/register');
      expect(res.status).toBe(200);
    });
  });

  describe('GET /auth', () => {
    it('should render auth page', async () => {
      const res = await agent.get('/auth');
      expect(res.status).toBe(200);
    });
  });

  describe('GET /home', () => {
    it('should redirect to /auth if user is not logged in', async () => {
      const res = await agent.get('/home');
      expect(res.status).toBe(302);
      expect(res.header['location']).toBe('/auth');
    });

    it('should redirect to /discount if user is admin', async () => {
      await agent.get('/set-session?admin=true');
      const res = await agent.get('/home');
      expect(res.status).toBe(302);
      expect(res.header['location']).toBe('/discount');
    });

    it('should render home page for normal user', async () => {
      await agent.get('/set-session?admin=false');

      // Create products with all required fields
      await Product.create([
        { 
          title: 'Product1', 
          price: 100, 
          image: '/img/product-5.png',
          description: 'Test description',
          category: 'Test'
        },
        { 
          title: 'Product2', 
          price: 200, 
          image: '/img/product-5.png',
          description: 'Test description',
          category: 'Test'
        },
      ]);

      const res = await agent.get('/home');
      expect(res.status).toBe(200);
    });

    it('should handle database errors', async () => {
      await agent.get('/set-session?admin=false');
      const findMock = jest.spyOn(Product, 'find');
      findMock.mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      const res = await agent.get('/home');
      expect(res.status).toBe(500);
      expect(res.text).toBe('Error retrieving products');
      
      findMock.mockRestore();
    });
  });

  describe('GET /discount', () => {
    it('should render discount page for logged-in admin', async () => {
      await agent.get('/set-session?admin=true');

      // Create products with all required fields
      await Product.create([
        { 
          title: 'Product1', 
          price: 100, 
          image: '/img/product-5.png',
          description: 'Test description',
          category: 'Test'
        },
        { 
          title: 'Product2', 
          price: 200, 
          image: '/img/product-5.png',
          description: 'Test description',
          category: 'Test'
        },
      ]);

      const res = await agent.get('/discount');
      expect(res.status).toBe(200);
    });

    it('should handle database errors', async () => {
      await agent.get('/set-session?admin=true');
      const findMock = jest.spyOn(Product, 'find');
      findMock.mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      const res = await agent.get('/discount');
      expect(res.status).toBe(500);
      
      findMock.mockRestore();
    });
  });

  describe('Navigation of admin and normal users', () => {
    it('should navigate to the home page if the user is normal user', async () => {
      await agent.get('/set-session?admin=false');

      // Create at least one product
      await Product.create({
        title: 'Test Product',
        price: 100,
        image: '/img/product-5.png',
        description: 'Test description',
        category: 'Test'
      });

      const res = await agent.get('/home');
      expect(res.status).toBe(200);
    });

    it('should redirect to the auth page if the user is logged out', async () => {
      await agent.get('/set-session?admin=false');
      await agent.get('/logout');
      const res = await agent.get('/home');
      expect(res.status).toBe(302);
      expect(res.header['location']).toBe('/auth');
    });
  });
});