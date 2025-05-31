import { connectDB } from '../config/db';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { User } from '../models/User';

dotenv.config();

const createDummyUser = async () => {
  await connectDB();

  const existing = await User.findOne({ email: 'dummy@user.com' });
  if (existing) {
    console.log('Dummy user already exists:', existing._id);
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash('dummy123', 10);

  const dummyUser = await User.create({
    name: 'Dummy User',
    email: 'dummy@user.com',
    password: hashedPassword
  });

  console.log('Dummy user created with ID:', dummyUser._id);
  process.exit(0);
};

createDummyUser();
