/**
 * Runtime Cache with LRU eviction
 */
class RuntimeCache {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(botId) {
    return this.cache.get(botId);
  }

  set(botId, runtime) {
    if (this.cache.size >= this.maxSize) {
      // LRU eviction - remove oldest
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(botId, runtime);
  }

  clear() {
    this.cache.clear();
  }

  has(botId) {
    return this.cache.has(botId);
  }
}

module.exports = RuntimeCache;