module.exports = (req, res, next) => {
  if (!req.auth) {
    return res.status(401).json({ message: "No autorizado" });
  }

  req.user = {
    auth0Id: req.auth.sub,
    email: req.auth.email || null
  };

  next();
};