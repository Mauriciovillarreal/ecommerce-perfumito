function authAdmin(req, res, next) {
  console.log('Auth User Middleware:', req.user);
  console.log('Auth User Middleware: Request Headers:', req.headers);
  if (req.user?.role === 'admin') {
    return next();
  }
  return res.status(401).send('error de autorización');
}

const authUser = (req, res, next) => {
  console.log('Auth User Middleware:', req.user);
  console.log('Auth User Middleware: Request Headers:', req.headers);
  console.log('Session:', req.session);
  console.log('Session ID:', req.sessionID);
  console.log('Is Authenticated:', req.isAuthenticated());

  if (req.isAuthenticated()) {
    const user = req.session.user; // Retrieve user data from session
    req.user = user; // Assign user data to req.user
    return next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = { authAdmin, authUser };
