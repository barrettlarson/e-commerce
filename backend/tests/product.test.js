require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');

let token;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);

    await User.deleteOne({ username: 'testuser@gmail.com' })

    const email = `testuser+${Date.now()}@gmail.com`;
    const registerRes = await request(app)
        .post('/api/auth/register')
        .send({ username: email, password: 'Test@1234'});

    const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ username: email, password: 'Test@1234'});
    
    token = loginRes.body.token;
    console.log('Register status:', registerRes.status);
    console.log('Login status:', loginRes.status); 
});

afterAll(async () => {
    await mongoose.disconnect();
});

beforeEach(async () => {
    const Product = require('../models/product');
    await Product.deleteMany({});
    await User.deleteMany({});
});

describe('POST /products', () => {
    it('should create a new product', async () => {
        const newProduct = {
            name: 'Wormier Mechanical Keyboard',
            price: 69.99,
            condition: 'new',
            category: 'keyboards',
            images: ['tests/WormierMechanicalKeyboard.jpg'],
        }
    });    
});

