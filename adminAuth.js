const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Admin authentication failed'
    });
  }
};