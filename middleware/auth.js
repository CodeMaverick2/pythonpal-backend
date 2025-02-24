import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const auth = async (req, res, next) => {
  // Check if MongoDB is connected
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      message: 'Database service unavailable',
      error: 'Database connection is not established'
    });
  }

  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default auth; 