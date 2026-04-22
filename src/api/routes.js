const express = require('express');
const { compile } = require('./controllers/compile');
const { chat } = require('./controllers/chat');
const { getBotInfo, getAllBots, deleteBot } = require('./controllers/bot');
const { validateCompile, validateChat } = require('./middleware/validation');
const authMiddleware = require('./middleware/auth');

const router = express.Router();

// Health
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const rateLimit = require('../middleware/rateLimit');

// PUBLIC
// Apply rate limiting to chat endpoint to protect the runtime
router.post('/chat/:botId', rateLimit, validateChat, chat);
router.get('/bot/:botId', getBotInfo);
router.get('/bots', getAllBots);

// PROTECTED
router.post('/compile', validateCompile, compile);
router.delete('/bot/:botId', deleteBot);

module.exports = router;