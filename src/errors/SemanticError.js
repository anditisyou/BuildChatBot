/**
 * Semantic Error Class
 * Specific to errors during semantic analysis phase
 * Can aggregate multiple semantic errors
 */
class SemanticError extends Error {
  constructor(message) {
    // Format: "Semantic Errors:\n- Duplicate intent name 'admission'\n- Fallback response is required"
    super(message);
    
    this.name = 'SemanticError';
    this.phase = 'semantic';
    
    // Parse individual errors if message contains multiple lines
    if (message.includes('\n')) {
      this.errors = message.split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.replace('-', '').trim());
    } else {
      this.errors = [message];
    }
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      error: this.message,
      phase: this.phase,
      errors: this.errors
    };
  }
}

module.exports = SemanticError;