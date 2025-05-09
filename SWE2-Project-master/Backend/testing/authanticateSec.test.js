// tests/auth.test.js
jest.setTimeout(15000); // في أعلى ملف test
const request = require('supertest');
const app = require('../app'); // المسار حسب مكان الـ app.js

let cookie;

beforeAll(async () => {
  // التسجيل دخول باستخدام بيانات صحيحة
  const res = await request(app)
    .post('/login')
    .send({ email: 'user@example.com', password: 'password123' });

  cookie = res.headers['set-cookie']; // هنا بناخد الكوكي من الريسبونس
});

describe('Auth routes', () => {
  it('should login successfully', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'user@example.com', password: 'password123' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Login successful');
  });

  it('should not login with incorrect credentials', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'wrong@example.com', password: 'wrongpassword' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid email or password');
  });

  it('should access protected route after login', async () => {
    const res = await request(app)
      .get('/profile')
      .set('Cookie', cookie); // إرسال الكوكي مع الريكوست

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Welcome to your profile');
  });

  it('should not access protected route without login', async () => {
    const res = await request(app)
      .get('/profile'); // من غير كوكي

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Unauthorized');
  });

  it('should logout successfully', async () => {
    const res = await request(app)
      .get('/logout')
      .set('Cookie', cookie); // إرسال الكوكي مع الريكوست

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Logged out');
  });
});
