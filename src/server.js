// server.js - UPDATED
const express = require('express');
const cors = require('cors');
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

app.use(cors());
app.use(express.json({ limit: '1mb' }));

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