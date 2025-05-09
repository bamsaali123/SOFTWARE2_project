const express = require('express')
//const authenticate = require('../middlewares/authenticate');
const authorize = process.env.NODE_ENV === 'test'
    ? (req, res, next) => next()
    : require('../middlewares/authorize');

const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/product.controller');

const router = express.Router();

router.get('/products', getProducts)

router.get('/products/:id', getProductById)
 // محدش يقدر يضيف ولا يعدل ولا يحذف غير الادمن 
router.post('/products',authorize, createProduct) 

router.put('/products/:id',authorize, updateProduct)

router.delete('/products/:id', authorize,deleteProduct)

module.exports = router;