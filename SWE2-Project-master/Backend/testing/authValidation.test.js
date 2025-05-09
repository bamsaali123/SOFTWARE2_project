// tests/auth.test.js
const request = require('supertest');
const app = require('../app'); // المسار حسب مكان app.js

describe('Auth Routes', () => {
  describe('POST /register', () => {
    it('should return 400 if email is invalid', async () => {
      const res = await request(app)
        .post('/register')
        .send({
          email: 'not-an-email',
          password: '123456',
          name: 'User'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors[0].msg).toBe('Email is invalid');
    });

    it('should return 400 if password is too short', async () => {
      const res = await request(app)
        .post('/register')
        .send({
          email: 'user@example.com',
          password: '123',
          name: 'User'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors[0].msg).toBe('Password must be at least 6 characters');
    });
  });

  describe('POST /login', () => {
    it('should return 400 if password is missing', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          email: 'user@example.com'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors[0].msg).toBe('Password is required');
    });
  });
});
