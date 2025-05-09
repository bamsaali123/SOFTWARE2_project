const request = require('supertest');
const app = require('../app'); // Adjust path to your app
const mongoose = require('mongoose');
const User = require('../models/user');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('User Controller', () => {
  describe('POST /api/users', () => {
    it('should create a user', async () => {
      const res = await request(app).post('/api/users').send({
        username: 'Samir',
        password: 'password123',
        confirmPassword: 'password123',
        email: 'samir@example.com',
        firstName: 'Samir',
        lastName: 'Ali',
        mobile: '01012345678',
        gender: 'male',
        isAdmin: false,  // Adjust based on your needs
      });

      console.log(res.body);

      // Ensure correct status code and response
      expect(res.status).toBe(201);
      expect(res.body.username).toBe('Samir');
    });

    it('should fail to create a user if required fields are missing', async () => {
      const res = await request(app).post('/api/users').send({
        username: 'Samir',
        // Missing required fields (like password, lastName, etc.)
      });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('All fields are required.');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update a user', async () => {
      const user = await User.create({
        username: 'Karim',
        password: 'password123',
        confirmPassword: 'password123',
        email: 'karim@example.com',
        firstName: 'Karim',
        lastName: 'Ibrahim',
        mobile: '01087654321',
        gender: 'male',
      });
      
      const res = await request(app).put(`/api/users/${user._id}`).send({
        username: 'Abdelrahman',
        firstName: 'Abdel',
        lastName: 'Rahman',
        mobile: '01022223333',
        gender: 'male',
        confirmPassword: 'password123',
      });

      expect(res.status).toBe(200);
      expect(res.body.username).toBe('Abdelrahman');
    });

    it('should update a user without changing username', async () => {
      const user = await User.create({
        username: 'Karim',
        firstName: 'OldName',
        lastName: 'Ibrahim', 
        gender: 'male', 
        password: 'password123',
        email: 'karim@example.com',
        mobile: '01087654321',
      });
      
      const res = await request(app).put(`/api/users/${user._id}`).send({
        firstName: 'Kareem',
        mobile: '01087654321',
      });

      expect(res.status).toBe(200);
      expect(res.body.firstName).toBe('Kareem');
      expect(res.body.username).toBe('Karim');
    });

    it('should return user not found if user does not exist', async () => {
      const res = await request(app).put('/api/users/123456789012345678901234').send({
        username: 'Abdelrahman',
        firstName: 'Abdel',
        lastName: 'Rahman',
        mobile: '01000000000',
        gender: 'male',
        confirmPassword: 'password123',
      });
      expect(res.status).toBe(404);  // Ensure the correct status code when user is not found
    });
  });
});
