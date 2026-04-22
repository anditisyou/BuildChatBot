// server.js - UPDATED
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const apiRoutes = require('./api/routes');
const BotRepository = require('./storage/mongodb.repository');
const errorHandler = require('./api/middleware/error');
const { initializeDatabase } = require('./storage/initDb');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Timeout middleware
app.use((req, res, next) => {
  req.setTimeout(30000);
  res.setTimeout(30000);
  next();
});

// Security and performance
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['*'];
// Configure helmet but allow cross-origin resource sharing for static widget files
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(compression());

// CORS configuration: allow specific origins or all when not set
const corsOptions = {
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser clients or same-origin
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET','POST','OPTIONS','DELETE'],
  allowedHeaders: ['Content-Type','Authorization'],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

// Simple request logger for production debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.ip} ${req.method} ${req.originalUrl}`);
  next();
});

// Static files
app.use(express.static(path.join(__dirname, '../public')));

app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Root route - serve DSL editor
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Routes
app.use('/api', apiRoutes);

// Error handler
app.use(errorHandler);

async function startServer() {
  try {
    // Initialize database indexes first
    await initializeDatabase();

    // Initialize bot repository with MongoDB
    const repository = new BotRepository(process.env.MONGODB_URI, process.env.DB_NAME);
    await repository.initialize();

    app.set('botRepository', repository);

    app.listen(PORT, () => {
      console.log(`
      ╔════════════════════════════════════╗
      ║  DSL Chatbot Platform v1.0         ║
      ║  Running on port: ${PORT}                  ║
      ║  Health: http://localhost:${PORT}/api/health ║
      ╚════════════════════════════════════╝
      `);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();