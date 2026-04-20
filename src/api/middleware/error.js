/**
 * Global Error Handling Middleware
 */
function errorHandler(err, req, res, next) {
  console.error('Unhandled Error:', err);

  // Handle specific error types
  if (err.name === 'LexicalError' || 
      err.name === 'SyntaxError' || 
      err.name === 'SemanticError') {
    return res.status(400).json({
      success: false,
      error: err.message,
      phase: err.phase,
      location: err.location,
      errors: err.errors
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }

  // Handle rate limit errors
  if (err.name === 'RateLimitError') {
    return res.status(429).json({
      success: false,
      error: 'Too many requests, please try again later.'
    });
  }

  // Default server error
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
}

module.exports = errorHandler;