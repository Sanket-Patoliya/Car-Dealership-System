import mongoose from 'mongoose';

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * Must be called explicitly during server startup.
 */
const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error('[CRITICAL] Database configuration error: MONGODB_URI is undefined.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`[INFO] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[CRITICAL] Database connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
