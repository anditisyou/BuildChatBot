/**
 * Runtime Engine
 * Manages bot instances and delegates to matcher
 */
const MessageMatcher = require('./matcher');

class RuntimeEngine {
  constructor(config) {
    this.config = config;
    this.matcher = new MessageMatcher(config.runtime);
  }

  processMessage(message) {
    return this.matcher.match(message);
  }

  processMessages(messages) {
    return this.matcher.matchBatch(messages);
  }

  getWelcome() {
    return this.config.welcome;
  }

  getMetadata() {
    return this.config.metadata;
  }
}

module.exports = RuntimeEngine;