import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('Skipping MongoDB connection - no URI provided');
      return false;
    }

    // Validate MongoDB URI format
    if (!process.env.MONGODB_URI.startsWith('mongodb://') && 
        !process.env.MONGODB_URI.startsWith('mongodb+srv://')) {
      console.error('Invalid MongoDB URI format');
      return false;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });
    
    if (conn.connection.readyState === 1) {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return true;
    } else {
      console.error('MongoDB connection failed - unexpected connection state');
      return false;
    }

  } catch (err) {
    console.error('MongoDB connection error:', err);
    return false;
  }
};

export default connectDB; 