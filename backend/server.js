require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGODB_URI;

async function start() {
    try {
        await mongoose.connect(MONGO); 
        console.log('MongoDB connected');
        app.listen(PORT, () => {
            connsole.log(`Server running on port ${PORT}`);
        })
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

start();