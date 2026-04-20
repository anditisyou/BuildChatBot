/**
 * Optimized Message Matcher
 * Pure matching logic extracted from runtime
 */
class MessageMatcher {
  constructor(runtimeConfig) {
    this.keywordIndex = runtimeConfig.keyword_index;
    this.responseMap = runtimeConfig.response_map;
    this.trie = runtimeConfig.trie;
    this.fallback = runtimeConfig.fallback;
  }

  match(message) {
    if (!message || typeof message !== 'string') {
      return this.fallback;
    }

    const normalized = message.toLowerCase().trim();
    
    if (normalized === '') {
      return this.fallback;
    }

    // Strategy 1: Direct keyword match (O(1))
    const words = this.tokenize(normalized);
    for (const word of words) {
      const intentIds = this.keywordIndex[word];
      if (intentIds && intentIds.length > 0) {
        return this.responseMap[intentIds[0]];
      }
    }

    // Strategy 2: Trie-based prefix matching (O(n) where n = message length)
    const matchedIntent = this.matchWithTrie(normalized);
    if (matchedIntent) {
      return this.responseMap[matchedIntent];
    }

    // Strategy 3: Substring matching (for multi-word keywords)
    for (const [keyword, intentIds] of Object.entries(this.keywordIndex)) {
      if (normalized.includes(keyword)) {
        return this.responseMap[intentIds[0]];
      }
    }

    return this.fallback;
  }

  matchWithTrie(message) {
    let node = this.trie;
    let lastMatch = null;
    
    for (let i = 0; i < message.length; i++) {
      const char = message[i];
      
      if (node[char]) {
        node = node[char];
        if (node._intent) {
          lastMatch = node._intent;
        }
      } else {
        // Reset to root for next starting position
        node = this.trie;
      }
    }
    
    return lastMatch;
  }

  tokenize(text) {
    return text.split(/[^a-zA-Z0-9]+/).filter(word => word.length > 0);
  }

  // Batch processing for multiple messages
  matchBatch(messages) {
    return messages.map(msg => this.match(msg));
  }
}

module.exports = MessageMatcher;