/**
 * Semantic Analyzer
 * Phase 3: Validates AST against business rules
 * Collects all errors before throwing
 */
const { SemanticError } = require('../errors');

class SemanticAnalyzer {
  constructor(ast) {
    this.ast = ast;
    this.allowedDomains = new Set(['education', 'ecommerce', 'saas']);
    this.errors = [];
  }

  analyze() {
    this.validateBotName();
    this.validateDomain();
    this.validateWelcome();
    this.validateFallback();
    this.validateIntents();
    this.validateLeadCapture();

    if (this.errors.length > 0) {
      throw new SemanticError(this.errors.join('\n'));
    }

    return this.ast;
  }

  validateBotName() {
    if (!this.ast.botName) {
      this.errors.push('Bot name is required');
    }
  }

  validateDomain() {
    if (!this.ast.domain) {
      this.errors.push('Domain is required');
    } else if (!this.allowedDomains.has(this.ast.domain)) {
      this.errors.push(
        `Invalid domain '${this.ast.domain}'. ` +
        `Allowed: ${Array.from(this.allowedDomains).join(', ')}`
      );
    }
  }

  validateWelcome() {
    if (!this.ast.welcome) {
      this.errors.push('Welcome message is required');
    }
  }

  validateFallback() {
    if (!this.ast.fallback) {
      this.errors.push('Fallback response is required');
    }
  }

  validateIntents() {
    if (!this.ast.intents || this.ast.intents.length === 0) {
      this.errors.push('At least one intent is required');
      return;
    }

    const intentNames = new Set();
    const keywordMap = new Map();

    for (const intent of this.ast.intents) {
      // Validate intent name
      if (intentNames.has(intent.name)) {
        this.errors.push(`Duplicate intent name '${intent.name}'`);
      }
      intentNames.add(intent.name);

      // Validate keywords
      if (!intent.keywords || intent.keywords.length === 0) {
        this.errors.push(`Intent '${intent.name}' must have at least one keyword`);
      }

      // Check for duplicate keywords within intent
      const uniqueKeywords = new Set(intent.keywords);
      if (uniqueKeywords.size !== intent.keywords.length) {
        this.errors.push(`Intent '${intent.name}' contains duplicate keywords`);
      }

      // Check for cross-intent keyword conflicts
      for (const keyword of intent.keywords) {
        if (keywordMap.has(keyword)) {
          const existingIntent = keywordMap.get(keyword);
          this.errors.push(
            `Keyword '${keyword}' conflicts with intent '${existingIntent}'`
          );
        } else {
          keywordMap.set(keyword, intent.name);
        }
      }

      // Validate response
      if (!intent.response) {
        this.errors.push(`Intent '${intent.name}' must have a response`);
      }
    }
  }

  validateLeadCapture() {
    if (this.ast.leadCapture && this.ast.leadCapture.length > 0) {
      const unique = new Set(this.ast.leadCapture);
      if (unique.size !== this.ast.leadCapture.length) {
        this.errors.push('Duplicate lead capture fields');
      }
    }
  }
}

module.exports = SemanticAnalyzer;