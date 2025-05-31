import { AuthRequest } from "../middlewares/authMiddleware";
import { User } from "../models/User";
import { Request, Response } from "express";
import mongoose from "mongoose";
import redis from "../utils/redis";


export const addFavorite = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.userId);
        const propertyId = new mongoose.Types.ObjectId(req.params.propertyId);

        if (!user) return res.status(404).json({ message: 'User not found' });
        if (!propertyId) return res.status(400).json({ message: 'Property ID is required' });

        if (!user.favorites.some(id => id.equals(propertyId))) {
            user.favorites.push(propertyId);
            await redis.del(`favorites:${user._id}`);
            await user.save();
        }
        res.json({ message: 'Property added to favorites' });
    } catch {
        res.status(500).json({ message: 'Failed to add favorite' });
    }
};

export const removeFavorite = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.userId);
        const propertyId = req.params.propertyId;

        if (!user) return res.status(404).json({ message: 'User not found' });

        user.favorites = user.favorites.filter(id => id.toString() !== propertyId);
        await redis.del(`favorites:${user._id}`)
        await user.save();
        res.json({ message: 'Property removed from favorites' });
    } catch {
        res.status(500).json({ message: 'Failed to remove favorite' });
    }
};

export const getFavorites = async (req: AuthRequest, res: Response) => {
    try {
        const cached = await redis.get(`favorites:${req.userId}`);

        if (cached) {
            // console.log(`📦 CACHE HIT for favorites:${req.userId}`);
            return res.json(JSON.parse(cached));
        }
        // console.log(`🔍 CACHE MISS for favorites:${req.userId}`);
        const user = await User.findById(req.userId).populate('favorites');
        if (!user) return res.status(404).json({ message: 'User not found' });
        await redis.set(`favorites:${user._id}`, JSON.stringify(user.favorites));
        res.json(user.favorites);
    } catch {
        res.status(500).json({ message: 'Failed to fetch favorites' });
    }
};
