const mongoose = require('mongoose')
const app = require('../app')
const productModel = require('../models/product')
const request = require('supertest')

const {showDiscount, calculateNewPrice ,getDiscountAmount } = require('../helpers/discount')

require('dotenv').config()

beforeEach(async () => {
    await mongoose.connect(process.env.connect_DB)
})

afterAll(async () => {
    await productModel.deleteMany({ isTest: true });
    await mongoose.connection.close();
})

describe('apply discount', () => {
    it('should apply a discount', async () => {
        const product = await productModel.create({
            title: "product1",
            price: 200,
            image: "https://images.app.goo.gl/koMaGFcpZ8V9tyi46",
            isTest: true,
        });
        const res = await request(app).post('/api/discount').send({
            id: product._id,
            discount: 20,
        });
        expect(res.status).toBe(302);
    }),
        it('should return apply discount failure', async () => {
            const res = await request(app).post('/api/discount').send({
                id: "kdfjjdf",
                // discount: 20
            });
            expect(res.status).toBe(500);
        })
})

describe('displaying discount', () => {
    it ('should return true to show the discount', () => {
        expect(showDiscount(20)).toBeTruthy();
    }),
    it ('should return false when there is no discount', () => {
        expect(showDiscount(0)).toBeFalsy();
    })
    it ('should return 80.00 when the discount is 20 and the price is 100', () => {
        expect(calculateNewPrice(100, 20)).toBe("80.00");
    })
    it('should throw error if price is negative', () => {
        expect(() => calculateNewPrice(-100, 20)).toThrow('Price cannot be negative');
    });
})
it('should throw matching error snapshot', () => {
    expect(() => getDiscountAmount(-100, 10)).toThrowErrorMatchingSnapshot();
});
