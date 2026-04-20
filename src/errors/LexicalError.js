/**
 * Lexical Error Class
 * Specific to errors during tokenization phase
 */
class LexicalError extends Error {
  constructor(message, line, column) {
    // Format: "Lexical Error: Unexpected character '$' at line 5, column 12"
    super(`Lexical Error: ${message} at line ${line}, column ${column}`);
    
    this.name = 'LexicalError';
    this.phase = 'lexical';
    this.line = line;
    this.column = column;
    this.location = { line, column };
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      error: this.message,
      phase: this.phase,
      line: this.line,
      column: this.column
    };
  }
}

module.exports = LexicalError;