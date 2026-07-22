import mongoose from 'mongoose';
import User from '../models/user.model.js';

/**
 * Seeds the default administrator user if it does not already exist.
 */
const seedAdmin = async () => {
  try {
    const adminEmail = 'admin@gmail.com';
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      console.log(`[INFO] Seeding default admin user (${adminEmail})...`);
      await User.create({
        name: 'Administrator',
        email: adminEmail,
        password: 'admin123',
        role: 'ADMIN',
      });
      console.log(`[INFO] Admin user successfully seeded.`);
    } else {
      console.log(`[INFO] Admin user (${adminEmail}) already exists.`);
    }
  } catch (error) {
    console.error(`[ERROR] Failed to seed admin user: ${error.message}`);
  }
};

/**
 * Normalizes legacy lowercase user roles to uppercase USER and ADMIN in MongoDB.
 */
const normalizeUserRoles = async () => {
  try {
    const legacyAdmins = await User.updateMany({ role: 'admin' }, { $set: { role: 'ADMIN' } });
    const legacyUsers = await User.updateMany({ role: 'user' }, { $set: { role: 'USER' } });
    if (legacyAdmins.modifiedCount > 0 || legacyUsers.modifiedCount > 0) {
      console.log(`[INFO] Migrated legacy roles: ${legacyAdmins.modifiedCount} admins, ${legacyUsers.modifiedCount} users to uppercase.`);
    }
  } catch (error) {
    console.error(`[ERROR] Failed to normalize user roles: ${error.message}`);
  }
};

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
    await seedAdmin();
    await normalizeUserRoles();
  } catch (error) {
    console.error(`[CRITICAL] Database connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

