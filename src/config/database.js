// config/database.js - NEW FILE
const { MongoClient } = require('mongodb');

class DatabaseManager {
  constructor() {
    this.client = null;
    this.db = null;
  }
  
  async connect() {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    const dbName = process.env.DB_NAME || 'dsl_chatbot';
    
    this.client = new MongoClient(uri, {
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 10000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 30000
    });
    
    await this.client.connect();
    this.db = this.client.db(dbName);
    
    await this.createIndexes();
    
    console.log('✅ Database connected');
    return this.db;
  }
  
  async createIndexes() {
    const botsCollection = this.db.collection('bots');
    const sessionsCollection = this.db.collection('sessions');
    
    // Bot indexes
    await botsCollection.createIndex(
      { user_id: 1, bot_id: 1 }, 
      { unique: true }
    );
    await botsCollection.createIndex(
      { user_id: 1, created_at: -1 }
    );
    
    // Session indexes
    await sessionsCollection.createIndex(
      { session_id: 1 }
    );
    await sessionsCollection.createIndex(
      { user_id: 1, updated_at: -1 }
    );
    
    console.log('✅ Database indexes created');
  }
  
  getDb() {
    return this.db;
  }
  
  async disconnect() {
    await this.client.close();
  }
}

module.exports = new DatabaseManager();