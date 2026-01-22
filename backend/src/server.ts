import app from './app.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/HomeWorkManager';

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✓ MongoDB connected successfully');
    } catch (error) {
        console.error('✗ MongoDB connection failed:', error);
        process.exit(1);
    }
};

// Start server
const startServer = async () => {
    try {
        await connectDB();
        
        app.listen(PORT, () => {
            console.log(`✓ Server is running on http://localhost:${PORT}`);
            console.log(`✓ Health check: http://localhost:${PORT}/health`);
            console.log(`✓ API endpoint: http://localhost:${PORT}/api/students`);
            console.log(`✓ API endpoint: http://localhost:${PORT}/api/classes`);
            console.log(`✓ API endpoint: http://localhost:${PORT}/api/admins`);
            console.log(`✓ API endpoint: http://localhost:${PORT}/api/teachers`);

        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
