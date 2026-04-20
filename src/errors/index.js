/**
 * Central Error Exports
 * Provides unified error handling for the compiler
 */
const LexicalError = require('./LexicalError');
const SyntaxError = require('./SyntaxError');
const SemanticError = require('./SemanticError');

class CompilerError extends Error {
  constructor(message, phase) {
    super(message);
    this.name = 'CompilerError';
    this.phase = phase;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  CompilerError,
  LexicalError,
  SyntaxError,
  SemanticError
};