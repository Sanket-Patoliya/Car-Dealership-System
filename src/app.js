import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRouter from './routes/auth.routes.js';
import vehicleRouter from './routes/vehicle.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

// Global Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Auth Routes
app.use('/api/auth', authRouter);

// Vehicle Routes
app.use('/api/vehicles', vehicleRouter);

// Base Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

// Fallback Route (404)
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
