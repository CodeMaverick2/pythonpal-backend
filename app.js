import express from 'express';
import cors from 'cors';
import tutorRouter from './routes/tutor.js';
import authRouter from './routes/auth.js';
// ... other imports ...

const app = express();

// Parse frontend URLs from environment variable
const allowedOrigins = process.env.FRONTEND_URLS ? 
  process.env.FRONTEND_URLS.split(',') : 
  ['http://localhost:3000', 'http://localhost:3002'];

// Enable CORS with specific options
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

// Parse JSON bodies with increased limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/auth', authRouter);
app.use('/api/tutor', tutorRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Add error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something broke!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app; 