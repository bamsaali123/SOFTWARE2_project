// middlewares/auth.js

const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
      return next(); // المستخدم مسجل دخوله، اكمل التنفيذ
    }
    return res.status(401).json({ message: 'Unauthorized' }); // لو مفيش جلسة أو المستخدم مش مسجل دخول
  };
  
  module.exports = isAuthenticated;
  