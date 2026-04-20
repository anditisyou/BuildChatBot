const RuntimeCache = require('../../storage/cache');
const RuntimeEngine = require('../../engine/runtime');

const cache = new RuntimeCache();

async function chat(req, res) {
  try {
    const repository = req.app.get('botRepository');
    const { botId } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    let runtime = cache.get(botId);

    if (!runtime) {
      const botConfig = await repository.findById(botId);

      if (!botConfig) {
        return res.status(404).json({ error: 'Bot not found' });
      }

      runtime = new RuntimeEngine(botConfig);
      cache.set(botId, runtime);
    }

    const response = runtime.processMessage(message);

    res.json({
      success: true,
      response
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Chat error' });
  }
}

module.exports = { chat };