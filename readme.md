
# 🚀 PythonPal Backend API

Welcome to the PythonPal backend! This is where all the magic happens - from AI tutoring to quiz generation! 🎯

## 🛠️ Tech Stack

- Node.js & Express
- MongoDB (Database)
- OpenAI API (AI Tutor)
- JWT Authentication
- CORS enabled
- Python Shell (Code Execution)

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed locally or MongoDB Atlas account
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/CodeMaverick2/pythonpal-backend
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
FRONTEND_URLS=http://localhost:3000,https://your-production-frontend.com
```

4. Start MongoDB (if using local installation):
```bash
npm run setup
```

5. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Tutor
- `POST /api/tutor/chat` - Get AI tutor response
- `POST /api/tutor/generate-quiz` - Generate quiz questions
- `POST /api/tutor/check-answer` - Check quiz answers

### Health Check
- `GET /api/health` - Check API status

## 🌐 Deployment

### Heroku Deployment
1. Create a new Heroku app
2. Add environment variables in Heroku dashboard
3. Connect your GitHub repository
4. Deploy the main branch

### Railway Deployment
1. Create new Railway project
2. Connect your GitHub repository
3. Add environment variables
4. Deploy automatically

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5001 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost/pythonpal |
| JWT_SECRET | Secret for JWT tokens | your-secret-key |
| OPENAI_API_KEY | OpenAI API key | sk-... |
| FRONTEND_URLS | Allowed frontend origins | http://localhost:3000 |

## 🛡️ Security Features

- CORS protection with whitelisted origins
- JWT authentication for protected routes
- Request rate limiting
- Input validation
- Error handling middleware
- Secure password hashing

## 📦 Project Structure

```
backend/
├── routes/          # API route definitions
├── models/          # MongoDB models
├── middleware/      # Custom middleware
├── utils/           # Utility functions
├── scripts/         # Setup scripts
├── app.js          # Express app setup
└── server.js       # Server entry point
```

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

Happy Coding! 🚀✨