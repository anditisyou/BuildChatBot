class SessionManager {
  constructor(db) {
    this.sessions = db.collection('sessions');
  }

  async getOrCreateSession(sessionId, botId, userId) {
    if (sessionId) {
      const session = await this.sessions.findOne({ session_id: sessionId });
      if (session) return session;
    }
    
    const newSession = {
      session_id: generateSessionId(),
      bot_id: botId,
      user_id: userId,
      context: {},
      lead_data: {},
      created_at: new Date(),
      updated_at: new Date()
    };
    
    await this.sessions.insertOne(newSession);
    return newSession;
  }

  async updateContext(sessionId, updates) {
    await this.sessions.updateOne(
      { session_id: sessionId },
      { 
        $set: { 
          context: updates,
          updated_at: new Date() 
        } 
      }
    );
  }
}