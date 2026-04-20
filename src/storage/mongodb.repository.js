// storage/mongodb.repository.js
const { MongoClient } = require('mongodb');

class BotRepository {
  constructor(mongoUri, dbName) {
    // Connection pool configuration
    this.client = new MongoClient(mongoUri, {
      maxPoolSize: 10,      // Maximum connections in pool
      minPoolSize: 2,       // Minimum connections to maintain
      maxIdleTimeMS: 10000, // Close idle connections after 10 seconds
      connectTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 5000
    });
    
    this.dbName = dbName;
    this.db = null;
    this.collection = null;
  }
  
  async initialize() {
    await this.client.connect();
    this.db = this.client.db(this.dbName);
    this.collection = this.db.collection('bots');
    console.log('✅ MongoDB connected with connection pool');
  }
  
  async disconnect() {
    await this.client.close();
  }

  async findById(botId) {
    const bot = await this.collection.findOne({ bot_id: botId });
    return bot;
  }

  async save(botId, userId, config) {
    const botData = {
      bot_id: botId,
      user_id: userId,
      ...config,
      created_at: new Date(),
      updated_at: new Date()
    };

    await this.collection.updateOne(
      { bot_id: botId },
      { $set: botData },
      { upsert: true }
    );
    return botId;
  }

  async findByUser(userId) {
    const bots = await this.collection.find({ user_id: userId }).toArray();
    return bots;
  }

  async delete(botId) {
    const result = await this.collection.deleteOne({ bot_id: botId });
    return result.deletedCount > 0;
  }
}

module.exports = BotRepository;