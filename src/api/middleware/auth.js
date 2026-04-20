const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }

  req.userId = apiKey; // temporary user system

  next();
};

module.exports = authMiddleware;