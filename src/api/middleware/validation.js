/**
 * Request Validation Middleware
 */
function validateCompile(req, res, next) {
  const { dsl } = req.body;
  
  if (!dsl || typeof dsl !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'DSL input is required and must be a string'
    });
  }
  
  if (dsl.length > 10000) {
    return res.status(400).json({
      success: false,
      error: 'DSL input exceeds maximum length of 10000 characters'
    });
  }
  
  next();
}

function validateChat(req, res, next) {
  const { message } = req.body;
  
  if (!message || typeof message !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Message is required and must be a string'
    });
  }
  
  if (message.length > 500) {
    return res.status(400).json({
      success: false,
      error: 'Message exceeds maximum length of 500 characters'
    });
  }
  
  next();
}

module.exports = { validateCompile, validateChat };