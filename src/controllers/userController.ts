import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

interface CustomRequest extends Request {
  user?: {
    id: string;
  };
}

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: errMsg });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
    res.status(200).json({ user, token });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: errMsg });
  }
};

export const addFavorite = async (req: CustomRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    await User.updateOne({ _id: req.user.id }, { $addToSet: { favorites: new Types.ObjectId(req.params.id) } });
    const user = await User.findById(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: errMsg });
  }
};

export const removeFavorite = async (req: CustomRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    await User.updateOne({ _id: req.user.id }, { $pull: { favorites: new Types.ObjectId(req.params.id) } });
    const user = await User.findById(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: errMsg });
  }
};

export const getUserProfile = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: errMsg });
  }
};


export const getUserFavorites = async (req: CustomRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const user = await User.findById(req.user.id).populate({
      path: 'favorites',
      populate: {
        path: 'comments',
        populate: {
          path: 'user',
          model: 'User',
          select: 'username'
        }
      }
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user.favorites);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: errMsg });
  }
};