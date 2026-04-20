
/**
 * Syntax Error Class
 * Specific to errors during parsing phase
 */
class SyntaxError extends Error {
  constructor(message, line, column) {
    // Format: "Syntax Error: Expected KEYWORDS but found IDENTIFIER at line 8, column 15"
    super(`Syntax Error: ${message} at line ${line}, column ${column}`);
    
    this.name = 'SyntaxError';
    this.phase = 'syntax';
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

module.exports = SyntaxError;