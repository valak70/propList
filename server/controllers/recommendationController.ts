import { Request, Response } from 'express';
import { User } from '../models/User';
import { AuthRequest } from '../middlewares/authMiddleware';
import redis from '../utils/redis';

export const recommendProperty = async (req: AuthRequest, res: Response) => {
  const { email, propertyId } = req.body;
  try {
    const recipient = await User.findOne({ email });
    if (!recipient) return res.status(404).json({ message: 'Recipient not found' });

    recipient.recommendationsReceived.push({
      property: propertyId,
      from: req.userId
    });
    await recipient.save();
    await redis.del(`recommendations:${recipient._id}`); // Clear cache for recommendations
    res.json({ message: 'Property recommended' });
  } catch {
    res.status(500).json({ message: 'Failed to recommend property' });
  }
};

export const getRecommendations = async (req: AuthRequest, res: Response) => {
  try {

    const cached = await redis.get(`recommendations:${req.userId}`);
    if (cached) {
      // console.log(`📦 CACHE HIT for recommendations:${req.userId}`);
      return res.json(JSON.parse(cached));
    }
    // console.log(`🔍 CACHE MISS for recommendations:${req.userId}`);
    const user = await User.findById(req.userId)
      .populate([
        {
          path: 'recommendationsReceived.property', populate: {
            path: 'createdBy', // Assuming your Property schema has a createdBy ref
            select: 'name email' // Optional: only return specific fields
          }
        },
        { path: 'recommendationsReceived.from', select: 'name email' }
      ]);

    if (!user) return res.status(404).json({ message: 'User not found' });
      await redis.set(`recommendations:${user._id}`, JSON.stringify(user.recommendationsReceived));
    res.json(user.recommendationsReceived);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch recommendations' });
  }
};

