const mongoose = require('mongoose')
const app = require('../app')
const productModel = require('../models/product')
const request = require('supertest')

process.env.NODE_ENV = 'test';
require('dotenv').config()

beforeEach(async () => {
    await mongoose.connect(process.env.connect_DB)
})

afterAll(async () => {
    await productModel.deleteMany({ isTest: true });
    await mongoose.connection.close();
})

describe('get all products', () => {
    it('should return all products', async () => {
        const res = await request(app).get('/api/products');
        expect(res.status).toBe(200);
    });

    it('should return failure with status code 500', async () => {
        await mongoose.connection.close();
        const res = await request(app).get('/api/products');
        expect(res.status).toBe(500);
        await mongoose.connect(process.env.connect_DB);
    });
});

describe('get a product', () => {
    it('should return a product', async () => {
        const product = await productModel.create({
            title: "product1",
            price: 200,
            description: "desc1",
            category: "cat1",
            image: "image1",
            isTest: true,
        });
        const res = await request(app).get(`/api/products/${product._id}`);
        expect(res.status).toBe(200);
        expect(res.body.title).toBe("product1");
    });

    it('should return product not found', async () => {
        const validButFakeId = new mongoose.Types.ObjectId();
        const res = await request(app).get(`/api/products/${validButFakeId}`);
        expect(res.status).toBe(404);
    });
});

describe('post a product', () => {
    it('should create a product', async () => {
        const res = await request(app).post(`/api/products`).send({
            title: "product2",
            price: 400,
            description: "desc2",
            category: "cat2",
            image: "image2",
            isTest: true,
        });
        expect(res.status).toBe(200);
        expect(res.body.title).toBe("product2");
    });

    it('should fail to create a product (missing fields)', async () => {
        const res = await request(app).post('/api/products').send({});
        expect(res.status).toBe(400);
    });
});

describe('update a product', () => {
    it('should update a product', async () => {
        const product = await productModel.create({
            title: "product4",
            price: 600,
            description: "desc4",
            category: "cat4",
            image: "image4",
            isTest: true,
        });

        const res = await request(app).put(`/api/products/${product._id}`).send({
            title: "product5",
            price: 550,
            description: "desc5",
            category: "cat5",
            image: "image5",
        });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Product updated successfully");
    });

    it('should return product not found', async () => {
        const validButFakeId = new mongoose.Types.ObjectId();
        const res = await request(app).put(`/api/products/${validButFakeId}`).send({
            title: "test",
            price: 10,
            description: "test",
            category: "test",
            image: "test",
        });
        expect(res.status).toBe(404);
    });
});

describe('delete a product', () => {
    it('should delete a product', async () => {
        const product = await productModel.create({
            title: "product6",
            price: 600,
            description: "desc6",
            category: "cat6",
            image: "image6",
            isTest: true,
        });
        const res = await request(app).delete(`/api/products/${product._id}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Product deleted successfully");
    });

    it('should return product not found', async () => {
        const validButFakeId = new mongoose.Types.ObjectId();
        const res = await request(app).delete(`/api/products/${validButFakeId}`);
        expect(res.status).toBe(404);
    });
});
