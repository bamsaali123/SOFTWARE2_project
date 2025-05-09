// // routes/pages.route.js
// const express = require("express");
// const {
//   homePage,
//   authPage,
//   discountPage,
// } = require("../controllers/pages.controller");

// const router = express.Router();

// router.get("/home", homePage);
// router.get("/auth",authPage);
// router.get("/discount", discountPage);

// module.exports = router;

const express = require('express');
const router = express.Router();
const pagesController = require('../controllers/pages.controller');

router.get('/home', pagesController.homePage);
router.get('/auth', pagesController.authPage);
router.get('/discount', pagesController.discountPage);
router.get('/login', pagesController.authPage);
router.get('/register', pagesController.authPage);

module.exports = router;