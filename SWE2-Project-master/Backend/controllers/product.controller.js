const Products = require('../models/product')

const getProducts = async (req, res) => {
    try {
        const products = await Products.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Products.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const createProduct = async (req, res) => {
    try {
        const { title, description, category, price, image, discount, isTest } = req.body;

        if (!title || !description || !category || !price || !image) {
            return res.status(400).json({ message: "All fields required" });
        }

        const newProduct = new Products({
            title,
            description,
            category,
            price,
            image,
            discount,
            isTest
        });

        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct); // ✅ مهم
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error }); // ✅ مهم
    }
};

const updateProduct = async (req, res) => {
    try {
        const { title, description, category, price, image, discount } = req.body;

        if (!title || !description || !category || !price || !image) {
            return res.status(400).json({ message: "All fields required" });
        }

        const productId = req.params.id;
        const product = await Products.updateOne(
            { _id: productId },
            {
                $set: {
                    title,
                    description,
                    category,
                    price,
                    image,
                    discount
                }
            }
        );

        if (product.matchedCount === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product updated successfully' }); // ✅ مهم
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error }); // ✅ مهم
    }
};

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Products.deleteOne({ _id: productId });

        if (product.deletedCount === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' }); // ✅ مهم
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};

