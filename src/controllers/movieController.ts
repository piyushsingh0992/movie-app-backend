import { Request, Response } from 'express';
import Movie from '../models/Movie';
import Comment from '../models/Comment';
import { Types } from 'mongoose';
import User from '../models/User';

interface CustomRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const getMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const movies = await Movie.find().populate({
      path: 'comments',
      populate: {
        path: 'user',
        model: 'User',
        select: 'username'
      }
    });
    res.status(200).json(movies);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: errMsg });
  }
};

export const getMovieById = async (req: Request, res: Response): Promise<void> => {
  try {
    const movie = await Movie.findById(req.params.id)
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          model: 'User',
          select: 'username'
        }
      });

    if (!movie) {
      res.status(404).json({ message: 'Movie not found' });
      return;
    }

    const usersWhoLiked = await User.find({ favorites: req.params.id }).select('username');
    res.status(200).json({ movie, usersWhoLiked });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: errMsg });
  }
};

export const addMovie = async (req: CustomRequest, res: Response): Promise<void> => {
  const { name, description, runningTime, imageUrl } = req.body;
  const newMovie = new Movie({ name, description, runningTime, imageUrl });

  try {
    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: errMsg });
  }
};

export const addComment = async (req: CustomRequest, res: Response): Promise<void> => {
  const { text } = req.body;
  const { id } = req.params;

  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const newComment = new Comment({ text, movie: id, user: req.user.id });

  try {
    const savedComment = await newComment.save();
    const movie = await Movie.findById(id);
    if (movie) {
      movie.comments.push(savedComment._id);
      await movie.save();

      const populatedComment = await Comment.findById(savedComment._id).populate({
        path: 'user',
        model: 'User',
        select: 'username'
      });

      res.status(201).json(populatedComment);
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: errMsg });
  }
};

export const deleteComment = async (req: CustomRequest, res: Response): Promise<void> => {
  const { movieId, commentId } = req.params;

  try {
    await Comment.findByIdAndDelete(commentId);
    await Movie.updateOne({ _id: movieId }, { $pull: { comments: new Types.ObjectId(commentId) } });
    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: errMsg });
  }
};
