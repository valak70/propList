import { connectDB } from '../config/db';
import { Property } from '../models/Property';
import { User } from '../models/User';
import csv from 'csvtojson';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const importData = async () => {
  await connectDB();

  const dummyUser = await User.findOne({ email: 'dummy@user.com' });
  if (!dummyUser) {
    console.error('Dummy user not found. Run createDummyUser.ts first.');
    process.exit(1);
  }

  const filePath = path.join(__dirname, '../data/propertyData.csv');
  const jsonArray = await csv().fromFile(filePath);

  const formatted = jsonArray.map(item => ({
    title: item.title,
    type: item.type,
    price: Number(item.price),
    state: item.state,
    city: item.city,
    areaSqFt: Number(item.areaSqFt),
    bedrooms: Number(item.bedrooms),
    bathrooms: Number(item.bathrooms),
    amenities: item.amenities?.split('|').map((a: string) => a.trim()) || [],
    furnished: item.furnished === 'Furnished',
    availableFrom: new Date(item.availableFrom),
    listedBy: item.listedBy,
    tags: item.tags?.split('|').map((t: string) => t.trim()) || [],
    colorTheme: item.colorTheme,
    rating: Number(item.rating),
    isVerified: item.isVerified === 'true',
    listingType: item.listingType,
    createdBy: dummyUser._id
  }));

  await Property.insertMany(formatted);
  console.log('CSV data imported successfully!');
  process.exit();
};

importData();
