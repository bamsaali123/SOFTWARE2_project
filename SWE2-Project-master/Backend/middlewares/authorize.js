module.exports = (req, res , next) => {
    // Check if req.user exists and isAdmin is defined
    if (req.session && req.session.user && req.session.user.isAdmin === true) {
        next();
    } else  {
        res.status(403).send('Access denied. Admins only.');
   
  };
}
  