import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

interface JwtPayload {
  id: string;
  username: string;
  role: string;
}

export const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'No token, authorization denied' });
    return;
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret') as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export const adminMiddleware = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'No token, authorization denied' });
    return;
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret') as JwtPayload;
    if (decoded.role !== 'admin') {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
