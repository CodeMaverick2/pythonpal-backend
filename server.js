import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './utils/db.js';
import setupMongoDB from './scripts/setupMongoDB.js';

dotenv.config();

// Verify required environment variables
const requiredEnvVars = ['JWT_SECRET', 'OPENAI_API_KEY'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please check your .env file');
  process.exit(1);
}

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    // Setup MongoDB if running locally
    if (process.env.MONGODB_URI?.includes('localhost') || 
        process.env.MONGODB_URI?.includes('127.0.0.1')) {
      await setupMongoDB();
    }

    // Try to connect to MongoDB
    const isDbConnected = await connectDB();
    
    if (!isDbConnected && process.env.NODE_ENV === 'production') {
      console.error('Failed to connect to MongoDB in production environment');
      process.exit(1);
    }

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
      if (!isDbConnected) {
        console.warn('⚠️ Server running without MongoDB connection');
      }
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
        process.exit(1);
      }
      console.error('Server error:', error);
    });

  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

startServer();
// Handle process termination
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  if (mongoose.connection.readyState === 1) {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}); 