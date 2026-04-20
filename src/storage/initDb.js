// storage/initDb.js
const { MongoClient } = require('mongodb');

async function initializeDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    
    // Create indexes
    await db.collection('bots').createIndex(
      { user_id: 1, bot_id: 1 }, 
      { unique: true }
    );
    
    await db.collection('bots').createIndex(
      { user_id: 1, created_at: -1 }
    );
    
    await db.collection('sessions').createIndex(
      { session_id: 1 }
    );
    
    await db.collection('sessions').createIndex(
      { user_id: 1, updated_at: -1 }
    );
    
    console.log('✅ Database indexes created');
  } finally {
    await client.close();
  }
}

module.exports = { initializeDatabase };