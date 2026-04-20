/**
 * Intermediate Representation Generator
 * Phase 4: Transforms validated AST to optimized runtime config
 */
const crypto = require('crypto');

class IRGenerator {
  constructor(ast) {
    this.ast = ast;
  }

  generate() {
    const intents = this.normalizeIntents();
    
    return {
      bot_id: this.generateBotId(),
      bot_name: this.ast.botName,
      metadata: {
        domain: this.ast.domain,
        tone: this.ast.tone,
        created_at: new Date().toISOString(),
        version: '1.0'
      },
      welcome: this.ast.welcome,
      intents,
      lead_capture: this.ast.leadCapture,
      fallback: this.ast.fallback,
      
      // Runtime optimizations
      runtime: {
        // Fast lookup: keyword -> [intents]
        keyword_index: this.buildKeywordIndex(intents),
        // Fast lookup: intent_id -> response
        response_map: this.buildResponseMap(intents),
        // Prefix trie for efficient matching
        trie: this.buildTrie(intents),
        // Fallback response
        fallback: this.ast.fallback,
        stats: {
          intent_count: intents.length,
          keyword_count: intents.reduce((sum, i) => sum + i.keywords.length, 0)
        }
      }
    };
  }

  generateBotId() {
    const timestamp = Date.now().toString(36);
    const hash = crypto
      .createHash('md5')
      .update(this.ast.botName + timestamp)
      .digest('hex')
      .substring(0, 8);
    
    return `bot_${hash}_${timestamp}`;
  }

  normalizeIntents() {
    return this.ast.intents.map((intent, index) => ({
      id: this.generateIntentId(intent.name, index),
      name: intent.name,
      keywords: intent.keywords.map(k => k.toLowerCase()),
      response: intent.response
    }));
  }

  generateIntentId(name, index) {
    return crypto
      .createHash('md5')
      .update(name + index)
      .digest('hex')
      .substring(0, 8);
  }

  buildKeywordIndex(intents) {
    const index = {};
    
    for (const intent of intents) {
      for (const keyword of intent.keywords) {
        if (!index[keyword]) {
          index[keyword] = [];
        }
        index[keyword].push(intent.id);
      }
    }
    
    return index;
  }

  buildResponseMap(intents) {
    const map = {};
    for (const intent of intents) {
      map[intent.id] = intent.response;
    }
    return map;
  }

  buildTrie(intents) {
    const trie = {};
    
    for (const intent of intents) {
      for (const keyword of intent.keywords) {
        let node = trie;
        
        for (const char of keyword) {
          if (!node[char]) {
            node[char] = {};
          }
          node = node[char];
        }
        
        // Mark end of keyword with intent reference
        node._intent = intent.id;
      }
    }
    
    return trie;
  }
}

module.exports = IRGenerator;