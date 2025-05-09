// rateLimit.test.js
const request = require('supertest');
const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message: 'Rate limit exceeded'
});

app.use(limiter);
app.get('/', (req, res) => {
  res.status(200).send('OK');
});

describe('Rate Limit', () => {
  it('should block after 3 requests', async () => {
    await request(app).get('/').expect(200);
    await request(app).get('/').expect(200);
    await request(app).get('/').expect(200);
    await request(app).get('/').expect(429); // blocked
  });
});
