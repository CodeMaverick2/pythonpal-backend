import express from 'express';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

// Instead of importing from frontend, define the configs here
const MODULE_CONFIGS = {
  'intro-python': {
    title: 'Introduction to Python',
    topics: ['What is Python?', 'Python Syntax', 'Running Python Programs'],
  },
  'variables': {
    title: 'Python Variables',
    topics: ['Variable Declaration', 'Data Types', 'Type Conversion'],
  },
  'control-flow': {
    title: 'Control Flow in Python',
    topics: ['If Statements', 'For Loops', 'While Loops'],
  }
};

// Add sample questions database
const QUIZ_QUESTIONS = {
  'intro-python': [
    {
      question: "What will be the output of print('Hello, World!')?",
      options: ["Hello, World!", "Error", "Nothing", "'Hello, World!'"],
      correctAnswer: "Hello, World!",
      explanation: "The print function outputs the text exactly as given, without the quotes."
    },
    {
      question: "Which symbol is used for comments in Python?",
      options: ["//", "#", "/*", "<!--"],
      correctAnswer: "#",
      explanation: "In Python, the # symbol is used to start a single-line comment."
    },
    {
      question: "How do you create a variable named 'age' with value 25?",
      options: ["var age = 25", "age := 25", "age = 25", "let age = 25"],
      correctAnswer: "age = 25",
      explanation: "In Python, you can directly assign values to variables using the = operator."
    }
  ],
  'variables': [
    {
      question: "What is the data type of x in x = 5.0?",
      options: ["int", "float", "number", "decimal"],
      correctAnswer: "float",
      explanation: "Numbers with decimal points in Python are float data type."
    },
    {
      question: "Which is a valid variable name in Python?",
      options: ["2name", "my-var", "my_var", "class"],
      correctAnswer: "my_var",
      explanation: "Variable names can contain letters, numbers, and underscores, but can't start with a number."
    }
  ],
  'control-flow': [
    {
      question: "What will this loop print? for i in range(3): print(i)",
      options: ["0 1 2", "1 2 3", "0 1 2 3", "1 2"],
      correctAnswer: "0 1 2",
      explanation: "range(3) generates numbers from 0 to 2 (3 exclusive)."
    },
    {
      question: "Which statement is used to exit a loop prematurely?",
      options: ["exit", "stop", "break", "return"],
      correctAnswer: "break",
      explanation: "The break statement is used to exit a loop before its normal completion."
    }
  ]
};

const router = express.Router();

let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
  });
} catch (error) {
  console.warn('OpenAI initialization failed:', error.message);
}

// Chat endpoint
router.post('/chat', auth, async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({ 
        message: 'Chat service is currently unavailable',
        suggestedActions: generateSuggestedActions(req.body.lessonId)
      });
    }

    const { message, context, lessonId } = req.body;

    // Create a system message based on the lesson context
    let systemMessage = "You are a friendly Python programming tutor for kids. Keep explanations simple and fun.";
    if (lessonId) {
      systemMessage += ` The current lesson is about ${lessonId}.`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemMessage },
        ...context.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    res.json({
      message: completion.choices[0].message.content,
      suggestedActions: generateSuggestedActions(lessonId)
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Error processing chat request' });
  }
});

// Update the generate quiz endpoint
router.post('/generate-quiz', auth, async (req, res) => {
  try {
    const { topic, difficulty } = req.body;
    
    // Get questions for the topic
    const topicQuestions = QUIZ_QUESTIONS[topic] || QUIZ_QUESTIONS['intro-python'];
    
    // Get a random question
    const randomIndex = Math.floor(Math.random() * topicQuestions.length);
    const selectedQuestion = topicQuestions[randomIndex];

    // Add difficulty modifier if needed
    if (difficulty === 'advanced' && selectedQuestion.explanation) {
      selectedQuestion.explanation += ' Try to think about edge cases!';
    }

    res.json({ quiz: selectedQuestion });

  } catch (error) {
    console.error('Quiz generation error:', error);
    // Return a fallback question
    res.json({ 
      quiz: {
        question: "What is the output of print(2 + 3)?",
        options: ["5", "23", "2 + 3", "Error"],
        correctAnswer: "5",
        explanation: "The + operator performs addition with numbers."
      }
    });
  }
});

// Helper function to generate suggested actions
function generateSuggestedActions(lessonId) {
  const baseActions = [
    "Try a practice exercise",
    "Take a quiz",
    "See an example",
    "Move to next topic"
  ];

  if (lessonId) {
    return [
      `Continue learning about ${lessonId}`,
      ...baseActions
    ];
  }
  return baseActions;
}

// Update user progress
router.post('/progress', auth, async (req, res) => {
  try {
    const { lessonId, score } = req.body;
    const user = await User.findById(req.user.id);

    user.progress.set(lessonId, score);
    await user.save();

    res.json(user.progress);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update API key
router.post('/api-key', auth, async (req, res) => {
  try {
    const { apiKey } = req.body;
    const user = await User.findById(req.user.id);

    user.apiKey = apiKey;
    await user.save();

    res.json({ message: 'API key updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add error handling middleware
router.use((err, req, res, next) => {
  console.error('Tutor route error:', err);
  res.status(500).json({ 
    message: 'Server error', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

export default router; 