import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import propertyRoutes from './routes/propertyRoutes';
import favoriteRoutes from './routes/favoriteRoutes';
import recommendationRoutes from './routes/recommendationRoutes';
import cors from 'cors';

dotenv.config();
const app = express();


app.use(cors({
  origin: ['http://localhost:5173', 'https://prop-list-client.vercel.app'],
  credentials: true, 
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/recommendations', recommendationRoutes);


connectDB().then(() => {
  app.listen(5000, () => console.log('Server running on port 5000'));
});
