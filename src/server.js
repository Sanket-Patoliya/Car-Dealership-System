import dotenv from 'dotenv';
import app from './app.js';

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  console.log(`[INFO] Server running on port ${PORT} in ${NODE_ENV} mode.`);
});

// Robust error handling for server runtime stability
process.on('unhandledRejection', (err) => {
  console.error('[CRITICAL] Unhandled Rejection! Shutting down server...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.error('[CRITICAL] Uncaught Exception! Shutting down server...');
  console.error(err.name, err.message);
  process.exit(1);
});
