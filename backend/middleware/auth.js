const jwt = require('jsonwebtoken');

// Middleware to verify JWT and protect routes
module.exports = function (req, res, next) {
  try {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded.id) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    // Set user info on request object
    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email
    };
    
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ message: 'Token is not valid', error: err.message });
  }
};

// Optional auth middleware that doesn't require authentication
module.exports.optional = function (req, res, next) {
  try {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.id) {
        req.user = {
          id: decoded.id,
          name: decoded.name,
          email: decoded.email
        };
      }
    }
    
    next();
  } catch (err) {
    // If token is invalid, continue without user info
    next();
  }
}; 