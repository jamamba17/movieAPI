const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401);
      return res.send({ message: 'No authentication token, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      res.status(401);
      return res.send({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    res.send({ message: 'Token is invalid or expired' });
  }
};

exports.isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    res.status(403);
    return res.send({ message: 'Access denied. Admin privileges required' });
  }
  next();
};