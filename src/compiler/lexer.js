/**
 * Lexical Analyzer
 * Phase 1: Converts DSL source to tokens with precise location tracking
 */
const { LexicalError } = require('../errors');

class Lexer {
  constructor(input) {
    this.input = input;
    this.position = 0;
    this.line = 1;
    this.column = 1;
    this.tokens = [];
    
    // DSL Reserved Words (v1.0)
    this.keywords = new Map([
      ['bot', 'BOT'],
      ['domain', 'DOMAIN'],
      ['tone', 'TONE'],
      ['welcome', 'WELCOME'],
      ['intent', 'INTENT'],
      ['keywords', 'KEYWORDS'],
      ['response', 'RESPONSE'],
      ['lead_capture', 'LEAD_CAPTURE'],
      ['fallback', 'FALLBACK']
    ]);
  }

  tokenize() {
    while (this.position < this.input.length) {
      const char = this.input[this.position];

      // Handle newlines
      if (char === '\n') {
        this.line++;
        this.column = 1;
        this.position++;
        continue;
      }

      // Skip whitespace (except newlines)
      if (this.isWhitespace(char)) {
        this.column++;
        this.position++;
        continue;
      }

      // Colon
      if (char === ':') {
        this.addToken('COLON', ':');
        this.position++;
        this.column++;
        continue;
      }

      // String literals
      if (char === '"') {
        this.tokenizeString();
        continue;
      }

      // Identifiers and keywords
      if (this.isAlpha(char)) {
        this.tokenizeIdentifier();
        continue;
      }

      // Unexpected character
      throw new LexicalError(
        `Unexpected character '${char}'`,
        this.line,
        this.column
      );
    }

    this.addToken('EOF', null);
    return this.tokens;
  }

  tokenizeString() {
    this.position++; // Skip opening quote
    this.column++;
    let value = '';
    let startColumn = this.column - 1;
    let escaped = false;

    while (this.position < this.input.length) {
      const currentChar = this.input[this.position];
      
      if (escaped) {
        value += currentChar;
        escaped = false;
      } else if (currentChar === '\\') {
        escaped = true;
      } else if (currentChar === '"') {
        this.position++;
        this.column++;
        this.addToken('STRING', value, startColumn);
        return;
      } else {
        value += currentChar;
      }
      
      this.position++;
      this.column++;
    }

    throw new LexicalError('Unterminated string', this.line, startColumn);
  }

  tokenizeIdentifier() {
    let value = '';
    const startColumn = this.column;

    while (this.position < this.input.length && 
           (this.isAlphaNumeric(this.input[this.position]) || 
            this.input[this.position] === '_')) {
      value += this.input[this.position];
      this.position++;
      this.column++;
    }

    const tokenType = this.keywords.get(value) || 'IDENTIFIER';
    this.addToken(tokenType, value, startColumn);
  }

  addToken(type, value, column = this.column) {
    this.tokens.push({
      type,
      value,
      line: this.line,
      column
    });
  }

  isAlpha(char) { return /[a-zA-Z]/.test(char); }
  isDigit(char) { return /[0-9]/.test(char); }
  isAlphaNumeric(char) { return /[a-zA-Z0-9]/.test(char); }
  isWhitespace(char) { return /\s/.test(char) && char !== '\n'; }
}

module.exports = Lexer;