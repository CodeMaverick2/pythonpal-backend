import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const setupMongoDB = () => {
  try {
    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'data', 'db');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Check if MongoDB is installed
    try {
      execSync('mongod --version');
    } catch (error) {
      console.error('MongoDB is not installed. Please install MongoDB first.');
      process.exit(1);
    }

    // Check if MongoDB is running
    try {
      execSync('pgrep mongod');
      console.log('MongoDB is already running');
    } catch (error) {
      console.log('Starting MongoDB...');
      try {
        // Start MongoDB daemon
        execSync(`mongod --dbpath ${dataDir} --fork --logpath ${path.join(dataDir, 'mongodb.log')}`);
        console.log('MongoDB started successfully');
      } catch (startError) {
        console.error('Failed to start MongoDB:', startError.message);
        process.exit(1);
      }
    }
  } catch (error) {
    console.error('Error setting up MongoDB:', error);
    process.exit(1);
  }
};

export default setupMongoDB; 