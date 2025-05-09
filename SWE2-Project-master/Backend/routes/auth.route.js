// routes/auth.routes.js

const express = require('express');
const isAuthenticated = require('../middlewares/authenticate'); // المسار اللي فيه الـ middleware
const { registerValidation, loginValidation } = require('../middlewares/auth.validation');
const validate = require('../middlewares/validateInput');

const { register, login, logout } = require('../controllers/auth.controller');

const router = express.Router();

// راوت تسجيل المستخدم
router.post('/register', registerValidation, validate, register);

// راوت تسجيل الدخول
router.post('/login', loginValidation, validate, login);

// راوت الخروج
router.get('/logout', logout);

// راوت محمي، لازم المستخدم يكون مسجل دخوله علشان يوصل له
router.get('/profile', isAuthenticated, (req, res) => {
  res.status(200).json({ message: 'Welcome to your profile' });
});

module.exports = router;
