const fs = require('fs').promises;
const path = require('path');

class BotRepository {
  constructor(filePath) {
    this.filePath = filePath || path.join(__dirname, 'bots.json');
    this.bots = {};
  }

  async initialize() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      this.bots = JSON.parse(data);
    } catch (error) {
      // If file doesn't exist or is invalid, start with empty object
      this.bots = {};
      await this._saveToFile();
    }
  }

  async _saveToFile() {
    await fs.writeFile(this.filePath, JSON.stringify(this.bots, null, 2));
  }

  async findById(botId) {
    return this.bots[botId] || null;
  }

  async save(botId, userId, config) {
    this.bots[botId] = {
      bot_id: botId,
      user_id: userId,
      ...config,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    await this._saveToFile();
    return botId;
  }

  async findByUser(userId) {
    return Object.values(this.bots).filter(bot => bot.user_id === userId);
  }
}

module.exports = BotRepository;