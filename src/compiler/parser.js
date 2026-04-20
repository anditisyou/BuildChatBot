/**
 * Syntax Analysis Phase
 * Builds Abstract Syntax Tree (AST) from tokens
 * Enforces strict grammar rules
 */
const { SyntaxError } = require('../errors');

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.position = 0;
  }

  currentToken() {
    return this.tokens[this.position];
  }

  peek(offset = 1) {
    return this.tokens[this.position + offset];
  }

  isAtEnd() {
    return this.currentToken().type === 'EOF';
  }

  eat(type) {
    const token = this.currentToken();

    if (token.type === type) {
      this.position++;
      return token;
    }

    throw new SyntaxError(
      `Expected ${type} but found ${token.type}`,
      token.line,
      token.column
    );
  }

  parse() {
    const program = {
      type: 'Program',
      botName: null,
      domain: null,
      tone: null,
      welcome: null,
      intents: [],
      leadCapture: [],
      fallback: null
    };

    while (!this.isAtEnd()) {
      const token = this.currentToken();

      switch (token.type) {
        case 'BOT':
          this.eat('BOT');
          program.botName = this.parseIdentifier();
          break;

        case 'DOMAIN':
          this.eat('DOMAIN');
          program.domain = this.parseIdentifier();
          break;

        case 'TONE':
          this.eat('TONE');
          program.tone = this.parseIdentifier();
          break;

        case 'WELCOME':
          this.eat('WELCOME');
          program.welcome = this.parseString();
          break;

        case 'INTENT':
          program.intents.push(this.parseIntent());
          break;

        case 'LEAD_CAPTURE':
          this.eat('LEAD_CAPTURE');
          program.leadCapture = this.parseIdentifierList();
          break;

        case 'FALLBACK':
          this.eat('FALLBACK');
          program.fallback = this.parseString();
          break;

        default:
          throw new SyntaxError(
            `Unexpected token ${token.type}`,
            token.line,
            token.column
          );
      }
    }

    return program;
  }

  parseIntent() {
    this.eat('INTENT');
    const name = this.parseIdentifier();

    // Parse keywords block
    this.eat('KEYWORDS');
    this.eat('COLON');
    
    // Parse keywords until we hit a token that's not an identifier
    // or we hit a new intent or response
    const keywords = [];
    while (this.currentToken().type === 'IDENTIFIER') {
      keywords.push(this.parseIdentifier());
    }

    // Ensure at least one keyword
    if (keywords.length === 0) {
      const token = this.currentToken();
      throw new SyntaxError(
        'Expected at least one keyword',
        token.line,
        token.column
      );
    }

    // Parse response block - must come after keywords
    this.eat('RESPONSE');
    const response = this.parseString();

    return { name, keywords, response };
  }

  parseIdentifier() {
    const token = this.currentToken();
    
    if (token.type !== 'IDENTIFIER') {
      throw new SyntaxError(
        `Expected identifier but found ${token.type}`,
        token.line,
        token.column
      );
    }
    
    this.position++;
    return token.value;
  }

  parseString() {
    const token = this.currentToken();
    
    if (token.type !== 'STRING') {
      throw new SyntaxError(
        `Expected string but found ${token.type}`,
        token.line,
        token.column
      );
    }
    
    this.position++;
    return token.value;
  }

  parseIdentifierList() {
    const identifiers = [];
    
    while (this.currentToken().type === 'IDENTIFIER') {
      identifiers.push(this.parseIdentifier());
    }
    
    if (identifiers.length === 0) {
      throw new SyntaxError(
        'Expected at least one identifier',
        this.currentToken().line,
        this.currentToken().column
      );
    }
    
    return identifiers;
  }
}

module.exports = Parser;