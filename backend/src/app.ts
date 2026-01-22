import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { studentRouter } from './routes/student/route.js';
import { classRouter } from './routes/class/route.js';
import { adminRouter } from './routes/admin/route.js';
import { teacherRouter } from './routes/teacher/route.js';
// Load environment variables
dotenv.config({ path: '.env.local' });

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/students', studentRouter);
app.use('/api/classes', classRouter);
app.use('/api/admins', adminRouter);
app.use('/api/teachers', teacherRouter);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ message: 'API is running' });
});

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
});

export default app;
