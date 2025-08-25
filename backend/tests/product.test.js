require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Product = require('../models/product');

let token;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);

    await User.deleteOne({ username: 'testuser@gmail.com' })
    await Product.deleteMany({});

    const email = `testuser+${Date.now()}@gmail.com`;
    const registerRes = await request(app)
        .post('/auth/register')
        .send({ username: email, password: 'Test@1234'});

    const loginRes = await request(app)
        .post('/auth/login')
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
    await User.deleteMany({});
    await Product.deleteMany({});
});

describe('POST /Product', () => {
    it('should create a new product', async () => {
        const newProduct = {
            name: 'Wormier Mechanical Keyboard',
            price: 69.99,
            condition: 'new',
            category: 'keyboards',
            images: ['https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRwcJqMynOo8nwnhHWPpkZ1jmz5bPMh-PkmzpZXmm1YZfYMs2bY_bwbA9WmdchFSCx5RCIcgZu0dav7aRLk9LNf0aSqqmnQbSxWyX_2D33uRhjxVu3KXB_T'],
        }

        const res = await request(app)
            .post('/Product')
            .send(newProduct);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.name).toBe(newProduct.name);
        expect(res.body.price).toBe(newProduct.price);
        expect(res.body.category).toBe(newProduct.category);
        expect(res.body.images.length).toBe(1);
    });    

    it('should return 400 for missing required fields', async () => {
        const newProduct = {
            price: 69.99,
            condition: 'new',
            category: 'keyboards',
            images: ['https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRwcJqMynOo8nwnhHWPpkZ1jmz5bPMh-PkmzpZXmm1YZfYMs2bY_bwbA9WmdchFSCx5RCIcgZu0dav7aRLk9LNf0aSqqmnQbSxWyX_2D33uRhjxVu3KXB_T'],
        }

        const res = await request(app)
            .post('/Product')
            .send(newProduct);

        expect(res.statusCode).toBe(400);
    });

    it('should return 400 if the price is not a number', async () => {
        const newProduct = {
            name: 'Wormier Mechanical Keyboard',
            price: 'sixty nine ninety nine',
            condition: 'new',
            category: 'keyboards',
            images: ['https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRwcJqMynOo8nwnhHWPpkZ1jmz5bPMh-PkmzpZXmm1YZfYMs2bY_bwbA9WmdchFSCx5RCIcgZu0dav7aRLk9LNf0aSqqmnQbSxWyX_2D33uRhjxVu3KXB_T'],
        }

        const res = await request(app)
            .post('/Product')
            .send(newProduct);

        expect(res.statusCode).toBe(400);
    });

    it('should return 400 if the price is negative', async () => {
        const newProduct = {
            name: 'Wormier Mechanical Keyboard',
            price: -10.00,
            condition: 'new',
            category: 'keyboards',
            images: ['https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRwcJqMynOo8nwnhHWPpkZ1jmz5bPMh-PkmzpZXmm1YZfYMs2bY_bwbA9WmdchFSCx5RCIcgZu0dav7aRLk9LNf0aSqqmnQbSxWyX_2D33uRhjxVu3KXB_T'],
        }

        const res = await request(app)
            .post('/Product')
            .send(newProduct);

        expect(res.statusCode).toBe(400);
    });
});

describe('GET /Product', () => {
    Product.deleteMany({});
    it('should return 404 if no products are found', async () => {
        const res = await request(app)
            .get('/Product');
        expect(res.statusCode).toBe(404);
    });

    it('should return all products', async () => {
        const product1 = {
            name: 'Wormier Mechanical Keyboard',
            price: 69.99,
            condition: 'new',
            category: 'keyboards',
            images: ['https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRwcJqMynOo8nwnhHWPpkZ1jmz5bPMh-PkmzpZXmm1YZfYMs2bY_bwbA9WmdchFSCx5RCIcgZu0dav7aRLk9LNf0aSqqmnQbSxWyX_2D33uRhjxVu3KXB_T'],
        };
        const product2 = {
            name: 'Logitech MX Master 3',
            price: 99.99,
            condition: 'new',
            category: 'mice',
            images: ['https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRwcJqMynOo8nwnhHWPpkZ1jmz5bPMh-PkmzpZXmm1YZfYMs2bY_bwbA9WmdchFSCx5RCIcgZu0dav7aRLk9LNf0aSqqmnQbSxWyX_2D33uRhjxVu3KXB_T'],
        };
        await request(app).post('/Product').send(product1);
        await request(app).post('/Product').send(product2);

        const res = await request(app)
            .get('/Product');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);
    });
});

describe('GET /Product/:id', () => {
    it('should return 404 if product not found', async () => {
        const res = await request(app)
            .get('/Product/64b7f0f4f4d3c2a5b6e8d9c0');
        expect(res.statusCode).toBe(404);
    });

    it('should return the product if found', async () => {
        const newProduct = {
            name: 'Wormier Mechanical Keyboard',
            price: 69.99,
            condition: 'new',
            category: 'keyboards',
            images: ['https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRwcJqMynOo8nwnhHWPpkZ1jmz5bPMh-PkmzpZXmm1YZfYMs2bY_bwbA9WmdchFSCx5RCIcgZu0dav7aRLk9LNf0aSqqmnQbSxWyX_2D33uRhjxVu3KXB_T'],
        };

        const createRes = await request(app)
            .post('/Product')
            .send(newProduct);

        const productId = createRes.body._id;

        const res = await request(app)
            .get(`/Product/${productId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('_id', productId);
    });
});

describe('PUT /Product/:id', () => {
    it('should return 404 if product not found', async () => {
        const res = await request(app)
            .put('/Product/64b7f0f4f4d3c2a5b6e8d9c0')
            .send({ price: 79.99 });
        expect(res.statusCode).toBe(404);
    });

    it('should update the product if found', async () => {
        const newProduct = {
            name: 'Wormier Mechanical Keyboard',
            price: 69.99,
            condition: 'new',
            category: 'keyboards',
            images: ['https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRwcJqMynOo8nwnhHWPpkZ1jmz5bPMh-PkmzpZXmm1YZfYMs2bY_bwbA9WmdchFSCx5RCIcgZu0dav7aRLk9LNf0aSqqmnQbSxWyX_2D33uRhjxVu3KXB_T'],
        }
        const createRes = await request(app)
            .post('/Product')
            .send(newProduct);

        expect(createRes.statusCode).toBe(201);
        expect(createRes.body).toHaveProperty('_id');
        expect(createRes.body.price).toBe(69.99);
        expect(createRes.body.condition).toBe('new');
        
        const productId = createRes.body._id;

        const updateRes = await request(app)
            .put(`/Product/${productId}`)
            .send({ price: 49.99, condition: 'used' });

        expect(updateRes.statusCode).toBe(200);
        expect(updateRes.body).toHaveProperty('_id', productId);
        expect(updateRes.body.price).toBe(49.99);
        expect(updateRes.body.condition).toBe('used');
    });

    it('should return 400 for invalid updates', async () => {
        const newProduct = {
            name: 'Wormier Mechanical Keyboard',
            price: 69.99,
            condition: 'new',
            category: 'keyboards',
            images: ['https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRwcJqMynOo8nwnhHWPpkZ1jmz5bPMh-PkmzpZXmm1YZfYMs2bY_bwbA9WmdchFSCx5RCIcgZu0dav7aRLk9LNf0aSqqmnQbSxWyX_2D33uRhjxVu3KXB_T'],
        }
        const createRes = await request(app)
            .post('/Product')
            .send(newProduct);

        expect(createRes.statusCode).toBe(201);
        expect(createRes.body).toHaveProperty('_id');
        expect(createRes.body.price).toBe(69.99);
        expect(createRes.body.condition).toBe('new');
        
        const productId = createRes.body._id;

        const updateRes = await request(app)
            .put(`/Product/${productId}`)
            .send({ price: -20.00 });

        expect(updateRes.statusCode).toBe(400);

        const updateRes2 = await request(app)
            .put(`/Product/${productId}`)
            .send({ price: 'free' });
        expect(updateRes2.statusCode).toBe(400);
    });
});

describe('DELETE /Product/:id', () => {
    it('should return 404 if product not found', async () => {
        const res = await request(app)
            .delete('/Product/64b7f0f4f4d3c2a5b6e8d9c0');
        expect(res.statusCode).toBe(404);
    });

    it('should delete the product if found', async () => {
        const newProduct = {
            name: 'Wormier Mechanical Keyboard',
            price: 69.99,
            condition: 'new',
            category: 'keyboards',
            images: ['https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRwcJqMynOo8nwnhHWPpkZ1jmz5bPMh-PkmzpZXmm1YZfYMs2bY_bwbA9WmdchFSCx5RCIcgZu0dav7aRLk9LNf0aSqqmnQbSxWyX_2D33uRhjxVu3KXB_T'],
        }
        const createRes = await request(app)
            .post('/Product')
            .send(newProduct);

        expect(createRes.statusCode).toBe(201);
        expect(createRes.body).toHaveProperty('_id');
        
        const productId = createRes.body._id;

        const deleteRes = await request(app)
            .delete(`/Product/${productId}`);

        expect(deleteRes.statusCode).toBe(200);
        expect(deleteRes.body).toHaveProperty('message', 'Product deleted successfully');

        const getRes = await request(app)
            .get(`/Product/${productId}`);
        expect(getRes.statusCode).toBe(404);
    });
});
    

