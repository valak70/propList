import { Request, Response } from 'express';
import { Property } from '../models/Property';
import { AuthRequest } from '../middlewares/authMiddleware';
import redis from '../utils/redis';
import { delPattern } from '../utils/redis';
import mongoose from 'mongoose';
// Create Property
export const createProperty = async (req: AuthRequest, res: Response) => {
  try {
    const property = await Property.create({
      ...req.body,
      createdBy: req.userId,
    });
    await redis.del(`property:/api/properties/${req.params.id}`);
    await delPattern('properties:*');
    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create property' });
  }
};

// Get All Properties
export const getAllProperties = async (req: Request, res: Response) => {
  try {
    const {
      city,
      state,
      type,
      furnished,
      isVerified,
      listingType,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      bedrooms,
      bathrooms,
      rating,
      amenities,
      tags,
      sort,
      createdBy,
      page = '1',
      limit = '20'
    } = req.query;

    const query: Record<string, any> = {};

    if (city) query.city = city;
    if (state) query.state = state;
    if (type) query.type = type;
    if (furnished !== undefined) query.furnished = furnished === 'true';
    if (isVerified !== undefined) query.isVerified = isVerified === 'true';
    if (listingType) query.listingType = listingType;
    if (bedrooms) query.bedrooms = Number(bedrooms);
    if (bathrooms) query.bathrooms = Number(bathrooms);
    if (rating) query.rating = { $gte: Number(rating) };
    if (createdBy) query.createdBy = new mongoose.Types.ObjectId(createdBy as string);;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (minArea || maxArea) {
      query.areaSqFt = {};
      if (minArea) query.areaSqFt.$gte = Number(minArea);
      if (maxArea) query.areaSqFt.$lte = Number(maxArea);
    }

    if (amenities) {
      query.amenities = { $all: amenities.toString().split(',') };
    }

    if (tags) {
      query.tags = { $all: tags.toString().split(',') };
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    let sortQuery: Record<string, 1 | -1> = {};
    if (sort) {
      const sortFields = sort.toString().split(',').map((f) =>
        f.startsWith('-') ? [f.substring(1), -1] : [f, 1]
      );
      sortQuery = Object.fromEntries(sortFields);
    }
    
    const totalCount = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNum).populate('createdBy', 'name email');

    const totalPages = Math.ceil(totalCount / limitNum);
    

    res.json({
      properties,
      totalPages,
      currentPage: pageNum,
      totalCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch properties' });
  }
};


// Get Property by ID
export const getPropertyById = async (req: AuthRequest, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch {
    res.status(500).json({ message: 'Error fetching property' });
  }
};

// Update Property (only if createdBy matches)
export const updateProperty = async (req: AuthRequest, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (property.createdBy.toString() !== req.userId)
      return res.status(403).json({ message: 'Unauthorized' });

    Object.assign(property, req.body);
    await property.save();
    await redis.del(`property:/api/properties/${req.params.id}`);
    await delPattern('properties:*');
    res.json(property);
  } catch {
    res.status(500).json({ message: 'Failed to update property' });
  }
};

// Delete Property (only if createdBy matches)
export const deleteProperty = async (req: AuthRequest, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (property.createdBy.toString() !== req.userId)
      return res.status(403).json({ message: 'Unauthorized' });

    await property.deleteOne();
    await redis.del(`property:/api/properties/${req.params.id}`);
    await delPattern('properties:*');
    res.json({ message: 'Property deleted' });
  } catch {
    res.status(500).json({ message: 'Failed to delete property' });
  }
};
