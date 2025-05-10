jest.setTimeout(15000); // زيادة المهلة الزمنية للاختبارات

const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = require('../app');
const Users = require('../models/user.model'); // تأكدي من المسار الصحيح

let cookie;

beforeAll(async () => {
  // الاتصال بقاعدة البيانات
  await mongoose.connect(process.env.connect_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // حذف المستخدم لو موجود مسبقًا
  await Users.deleteOne({ email: 'useer@example.com' });

  // إنشاء مستخدم جديد للاختبار
  const hashedPassword = await bcrypt.hash('password123', 10);
  await Users.create({
    email: 'useer@example.com',
    password: hashedPassword,
    username: 'TestUser',
  });

  // تسجيل الدخول وتخزين الكوكي
  const res = await request(app)
    .post('/login')
    .send({ email: 'useer@example.com', password: 'password123' });

  cookie = res.headers['set-cookie'];
});

afterAll(async () => {
  // إغلاق الاتصال بقاعدة البيانات بعد انتهاء الاختبارات
  await mongoose.connection.close();
});

describe('Auth routes', () => {
  it('should login successfully', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'useer@example.com', password: 'password123' });

    expect(res.statusCode).toBe(302); // تأكيد أنه تم التوجيه
    expect(res.headers.location).toBe('/home'); // الوجهة بعد تسجيل الدخول
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
      .set('Cookie', cookie); // إرسال الكوكي

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Welcome to your profile');
  });

  it('should not access protected route without login', async () => {
    const res = await request(app)
      .get('/profile'); // بدون كوكي

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Unauthorized');
  });

  it('should logout successfully', async () => {
    const res = await request(app)
      .get('/logout')
      .set('Cookie', cookie); // مع الكوكي

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/login');
  });
});
